"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const pristineSkill = path.join(root, "tests", "fixtures", "planning-with-files");
const sha256 = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const roadmap = fs.readFileSync(path.join(root, "ROADMAP.md"), "utf8");
const provenance = fs.readFileSync(path.join(root, "BASELINE_PROVENANCE.md"), "utf8");

function roadmapRole(pattern, description) {
  const match = roadmap.match(pattern);
  assert.ok(match, `ROADMAP lacks a parseable ${description}`);
  return match[1];
}

function publishedRole(role, version) {
  const row = provenance.split(/\r?\n/).find(line => line.startsWith(`| \`${version}\` |`));
  assert.ok(row, `provenance lacks ${role} ${version}`);
  const commit = row.match(/\[source `([a-f0-9]{40})`\]/);
  const entryCount = row.match(/；(\d+) entries；/);
  const hashes = [...row.matchAll(/SHA-256 `([a-f0-9]{64})`/g)].map(match => match[1]);
  assert.ok(commit, `${version} provenance lacks source commit`);
  assert.ok(entryCount, `${version} provenance lacks ZIP entry count`);
  assert.equal(hashes.length, 2, `${version} provenance must freeze ZIP and bootstrap SHA-256`);
  return Object.freeze({
    role,
    version,
    commit: commit[1],
    entryCount: Number(entryCount[1]),
    zipSha256: hashes[0],
    bootstrapSha256: hashes[1],
    tagRequired: true,
  });
}

const acceptedVersion = roadmapRole(/^\| 当前已接受版本 \| `(v[^`]+)`/m, "accepted role");
const fallbackVersion = roadmapRole(/^\| 当前直接回退版本 \| immutable `(v[^`]+)` immediate fallback/m,
  "immediate fallback role");
const publicationRoles = Object.freeze([
  publishedRole("accepted", acceptedVersion),
  publishedRole("immediate-fallback", fallbackVersion),
]);

function buildFromSource(archive, contractPath, builderPath, cwd) {
  return spawnSync(
    python,
    [builderPath, "build", "--contract", contractPath, "--output", archive],
    { cwd, encoding: "utf8" },
  );
}

function extractZip(archive, destination) {
  const script = [
    "import pathlib, stat, sys, zipfile",
    "destination = pathlib.Path(sys.argv[2])",
    "destination.mkdir(parents=True, exist_ok=True)",
    "with zipfile.ZipFile(sys.argv[1]) as package:",
    "    package.extractall(destination)",
    "    for info in package.infolist():",
    "        if info.is_dir():",
    "            continue",
    "        mode = stat.S_IMODE(info.external_attr >> 16)",
    "        if mode:",
    "            (destination / info.filename).chmod(mode)",
  ].join("\n");
  const result = spawnSync(
    python,
    ["-c", script, archive, destination],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
}

function patchManagedPython(packageRoot) {
  const executable = spawnSync(python, ["-c", "import sys; print(sys.executable)"], { encoding: "utf8" });
  assert.equal(executable.status, 0, executable.stderr);
  const installer = path.join(packageRoot, "install.js");
  const source = fs.readFileSync(installer, "utf8");
  const current = 'const MANAGED_PYTHON = "/usr/bin/python3";';
  const replacement = `const MANAGED_PYTHON = ${JSON.stringify(executable.stdout.trim().replace(/\\/g, "/"))};`;
  assert.equal(source.split(current).length - 1, 1, `${installer} managed Python declaration`);
  fs.writeFileSync(installer, source.replace(current, replacement));
}

function installHome(workspace, name) {
  const home = path.join(workspace, name);
  const requirements = path.join(home, "etc", "codex", "requirements.toml");
  fs.mkdirSync(path.dirname(requirements), { recursive: true });
  fs.writeFileSync(requirements, `[hooks]\nmanaged_dir = ${JSON.stringify(path.join(home, "hooks"))}\n`);
  return home;
}

function runPackageInstaller(packageRoot, home, command) {
  return spawnSync(process.execPath, [
    path.join(packageRoot, "install.js"),
    command,
    "--codex-home", home,
    "--skill-root", pristineSkill,
    "--managed-requirements", path.join(home, "etc", "codex", "requirements.toml"),
    "--json",
  ], { encoding: "utf8" });
}

function managedState(home) {
  const entries = [];
  const roots = [
    [path.join(home, "etc", "codex", "requirements.toml"), "requirements.toml"],
    [path.join(home, "hooks", "planning-with-files"), "runtime"],
    [path.join(home, "backups", "planning-with-files-hooks"), "backups"],
  ];
  function walk(target, relative) {
    if (!fs.existsSync(target)) return;
    const info = fs.lstatSync(target);
    if (info.isDirectory()) {
      entries.push([relative, "directory", info.mode & 0o777]);
      for (const child of fs.readdirSync(target).sort()) walk(path.join(target, child), `${relative}/${child}`);
    } else {
      entries.push([relative, "file", info.mode & 0o777, sha256(target)]);
    }
  }
  for (const [target, relative] of roots) walk(target, relative);
  return entries;
}

function buildPublishedPackage(workspace, release) {
  const sourceArchive = path.join(workspace, `${release.version}-roundtrip-source.zip`);
  let result = spawnSync("git", ["archive", "--format=zip", `--output=${sourceArchive}`, release.commit], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const sourceRoot = path.join(workspace, `${release.version}-roundtrip-source`);
  extractZip(sourceArchive, sourceRoot);
  const manifest = JSON.parse(fs.readFileSync(path.join(sourceRoot, "upstream-manifest.json"), "utf8"));
  const releaseContract = path.join(sourceRoot, manifest.managed_runtime.contracts.release_artifact.path);
  const releaseZip = path.join(workspace, `${release.version}-roundtrip.zip`);
  result = buildFromSource(
    releaseZip,
    releaseContract,
    path.join(sourceRoot, "tools", "build_release.py"),
    sourceRoot,
  );
  assert.equal(result.status, 0, result.stderr);
  const extracted = path.join(workspace, `${release.version}-roundtrip-package`);
  extractZip(releaseZip, extracted);
  const packageRoot = path.join(extracted, "pwf-codex-cloud-hooks");
  patchManagedPython(packageRoot);
  return packageRoot;
}

function buildCurrentPackage(workspace) {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "upstream-manifest.json"), "utf8"));
  const releaseZip = path.join(workspace, "current-roundtrip.zip");
  const result = buildFromSource(
    releaseZip,
    path.join(root, manifest.managed_runtime.contracts.release_artifact.path),
    path.join(root, "tools", "build_release.py"),
    root,
  );
  assert.equal(result.status, 0, result.stderr);
  const extracted = path.join(workspace, "current-roundtrip-package");
  extractZip(releaseZip, extracted);
  const packageRoot = path.join(extracted, "pwf-codex-cloud-hooks");
  patchManagedPython(packageRoot);
  return packageRoot;
}

test("publication oracle window contains exactly accepted and immediate fallback", () => {
  assert.deepEqual(publicationRoles.map(entry => entry.role), ["accepted", "immediate-fallback"]);
});

for (const release of publicationRoles) {
  test(`published ${release.version} source/tag oracle retains its immutable ${release.role} identity`, () => {
    const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `pwf-release-${release.role}-`));
    try {
      const tagResult = spawnSync("git", ["rev-parse", "--verify", `${release.version}^{commit}`], {
        cwd: root,
        encoding: "utf8",
      });
      if (release.tagRequired) assert.equal(tagResult.status, 0, tagResult.stderr);
      if (tagResult.status === 0) assert.equal(tagResult.stdout.trim(), release.commit);

      let result = spawnSync("git", ["cat-file", "-e", `${release.commit}^{commit}`], {
        cwd: root,
        encoding: "utf8",
      });
      assert.equal(result.status, 0, result.stderr);

      const sourceArchive = path.join(workspace, `${release.version}-source.zip`);
      result = spawnSync("git", ["archive", "--format=zip", `--output=${sourceArchive}`, release.commit], {
        cwd: root,
        encoding: "utf8",
      });
      assert.equal(result.status, 0, result.stderr);
      const releaseRoot = path.join(workspace, "source");
      extractZip(sourceArchive, releaseRoot);
      const manifest = JSON.parse(fs.readFileSync(path.join(releaseRoot, "upstream-manifest.json"), "utf8"));
      const releaseContract = path.join(releaseRoot, manifest.managed_runtime.contracts.release_artifact.path);
      const releaseArtifact = JSON.parse(fs.readFileSync(releaseContract, "utf8"));
      const releasePackage = JSON.parse(fs.readFileSync(path.join(releaseRoot, "package.json"), "utf8"));
      const bootstrapName = `init-cloud-sandbox-${release.version}.bash`;
      assert.equal(releasePackage.version, release.version.slice(1));
      assert.equal(releaseArtifact.entries.length, release.entryCount);
      const externalAssets = releaseArtifact.external_release_assets.map(entry =>
        typeof entry === "string" ? entry : entry.path);
      assert.deepEqual(externalAssets, [bootstrapName]);

      const releaseZip = path.join(workspace, `pwf-codex-cloud-hooks-${release.version}.zip`);
      result = buildFromSource(
        releaseZip,
        releaseContract,
        path.join(releaseRoot, "tools", "build_release.py"),
        releaseRoot,
      );
      assert.equal(result.status, 0, result.stderr);
      assert.equal(sha256(releaseZip), release.zipSha256);
      assert.equal(sha256(path.join(releaseRoot, bootstrapName)), release.bootstrapSha256);
    } finally {
      fs.rmSync(workspace, { recursive: true, force: true });
    }
  });
}

test(`${acceptedVersion} accepted and ${fallbackVersion} fallback keep managed state recoverable`, async t => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-published-roundtrip-"));
  try {
    const accepted = publicationRoles.find(release => release.role === "accepted");
    const fallback = publicationRoles.find(release => release.role === "immediate-fallback");
    const acceptedPackage = buildPublishedPackage(workspace, accepted);
    const fallbackPackage = buildPublishedPackage(workspace, fallback);
    const currentPackage = buildCurrentPackage(workspace);
    const currentVersion = JSON.parse(fs.readFileSync(path.join(currentPackage, "package.json"), "utf8")).version;
    const currentMatchesAccepted = currentVersion === accepted.version.slice(1);
    const directDowngradePackage = currentMatchesAccepted ? fallbackPackage : acceptedPackage;
    const forwardPredecessorPackage = currentMatchesAccepted ? fallbackPackage : acceptedPackage;

    await t.test("current-source bundle drift cannot modify or back up the accepted installation", () => {
      const home = installHome(workspace, "invalid-upgrade-home");
      let result = runPackageInstaller(acceptedPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(acceptedPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
      const before = managedState(home);

      const currentManifest = JSON.parse(fs.readFileSync(path.join(currentPackage, "upstream-manifest.json"), "utf8"));
      const candidateBundle = path.join(currentPackage, currentManifest.managed_runtime.contracts.runtime_bundle.path);
      const originalBundle = fs.readFileSync(candidateBundle);
      try {
        fs.appendFileSync(candidateBundle, " ");
        result = runPackageInstaller(currentPackage, home, "install");
        assert.equal(result.status, 1, "candidate accepted a runtime bundle that no longer matches its manifest SHA");
        assert.match(result.stderr, /runtime bundle SHA-256 mismatch/);
        assert.deepEqual(managedState(home), before, "rejected current source changed the accepted managed state");
      } finally {
        fs.writeFileSync(candidateBundle, originalBundle);
      }

      result = runPackageInstaller(acceptedPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
    });

    await t.test("the older published installer refuses direct downgrade over current before backup or mutation", () => {
      const home = installHome(workspace, "direct-downgrade-home");
      let result = runPackageInstaller(currentPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(currentPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
      const before = managedState(home);

      result = runPackageInstaller(directDowngradePackage, home, "install");
      assert.equal(result.status, 1, "older published installer unexpectedly overwrote the current installation");
      assert.match(result.stderr, /BLOCKED_UNKNOWN_RUNTIME:/);
      assert.match(result.stderr,
        /installed manifest identity mismatch|contracts\/adapter-plan-context-request-v2\.schema\.json/);
      if (/contracts\/adapter-plan-context-request-v2\.schema\.json/.test(result.stderr)) {
        assert.match(result.stderr, /contracts\/adapter-plan-context-request-v2\.schema\.json/);
        assert.match(result.stderr, /contracts\/runtime-result-v1\.schema\.json/);
      }
      assert.deepEqual(managedState(home), before,
        "rejected direct downgrade changed current runtime, requirements, or backup inventory");

      result = runPackageInstaller(currentPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
    });

    await t.test("the exact admitted predecessor migrates forward and can roll back by clean install", () => {
      const home = installHome(workspace, "accepted-forward-home");
      let result = runPackageInstaller(forwardPredecessorPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);

      result = runPackageInstaller(currentPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(currentPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
      let manifest = JSON.parse(fs.readFileSync(path.join(home, "hooks", "planning-with-files", "installed-manifest.json"), "utf8"));
      assert.equal(manifest.installer_version, JSON.parse(
        fs.readFileSync(path.join(currentPackage, "package.json"), "utf8")).version);

      result = runPackageInstaller(currentPackage, home, "uninstall");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(forwardPredecessorPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(forwardPredecessorPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
      manifest = JSON.parse(fs.readFileSync(path.join(home, "hooks", "planning-with-files", "installed-manifest.json"), "utf8"));
      assert.equal(manifest.installer_version,
        JSON.parse(fs.readFileSync(path.join(forwardPredecessorPackage, "package.json"), "utf8")).version);
    });

    await t.test("tampered accepted state is rejected before backup or mutation", () => {
      const home = installHome(workspace, "tampered-predecessor-home");
      let result = runPackageInstaller(acceptedPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      const adapter = path.join(home, "hooks", "planning-with-files", "hook_adapter.py");
      fs.appendFileSync(adapter, "# transition tamper\n");
      const before = managedState(home);

      result = runPackageInstaller(currentPackage, home, "install");
      assert.equal(result.status, 1);
      assert.match(result.stderr, /BLOCKED_UNKNOWN_RUNTIME: adapter managed content mismatch/);
      assert.deepEqual(managedState(home), before);
    });

    await t.test("accepted and immediate fallback remain recoverable through owned uninstall and forward install", () => {
      const home = installHome(workspace, "valid-roundtrip-home");
      let result = runPackageInstaller(fallbackPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(acceptedPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(acceptedPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
      let manifest = JSON.parse(fs.readFileSync(path.join(home, "hooks", "planning-with-files", "installed-manifest.json"), "utf8"));
      assert.equal(manifest.installer_version, accepted.version.slice(1));

      result = runPackageInstaller(acceptedPackage, home, "uninstall");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(fallbackPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(fallbackPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
      manifest = JSON.parse(fs.readFileSync(path.join(home, "hooks", "planning-with-files", "installed-manifest.json"), "utf8"));
      assert.equal(manifest.installer_version, fallback.version.slice(1));

      result = runPackageInstaller(acceptedPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(acceptedPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
      manifest = JSON.parse(fs.readFileSync(path.join(home, "hooks", "planning-with-files", "installed-manifest.json"), "utf8"));
      assert.equal(manifest.installer_version, accepted.version.slice(1));
    });
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});
