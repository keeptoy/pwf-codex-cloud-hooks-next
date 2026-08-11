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
const publicationRoles = Object.freeze([
  Object.freeze({
    role: "accepted",
    version: "v0.3.3",
    commit: "a1b9f4548e3b6e071fee611270365c8ecf3f8d13",
    entryCount: 21,
    zipSha256: "2b2dca5c5894a2297a6f2ccc5fb190878c3c920b71148719a4873326b4ccb352",
    bootstrapSha256: "236e364bde8397b04c9d7ebfa121fa96963055d77b56e6299e6b9c9aad6c887e",
    tagRequired: true,
  }),
  Object.freeze({
    role: "immediate-fallback",
    version: "v0.3.2",
    commit: "c68a53bdeab7c38badcfb4e2a733ddd851e498e4",
    entryCount: 23,
    zipSha256: "b42aecafaba650e5595acef8c138d142747da38dde04fa78bfb0a7f4235e5081",
    bootstrapSha256: "aa2c1fd64bfc8ee3804d5f4bf39f7816a2ca9ad9a96949336ec94a6c20f8f77c",
    tagRequired: true,
  }),
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
  const releaseZip = path.join(workspace, `${release.version}-roundtrip.zip`);
  result = buildFromSource(
    releaseZip,
    path.join(sourceRoot, "contracts", "release-artifact-v1.json"),
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
  const releaseZip = path.join(workspace, "current-roundtrip.zip");
  const result = buildFromSource(
    releaseZip,
    path.join(root, "contracts", "release-artifact-v1.json"),
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
      const releaseArtifact = JSON.parse(fs.readFileSync(path.join(releaseRoot, "contracts", "release-artifact-v1.json"), "utf8"));
      const releasePackage = JSON.parse(fs.readFileSync(path.join(releaseRoot, "package.json"), "utf8"));
      const bootstrapName = `init-cloud-sandbox-${release.version}.bash`;
      assert.equal(releasePackage.version, release.version.slice(1));
      assert.equal(releaseArtifact.entries.length, release.entryCount);
      assert.deepEqual(releaseArtifact.external_release_assets.map(entry => entry.path), [bootstrapName]);

      const releaseZip = path.join(workspace, `pwf-codex-cloud-hooks-${release.version}.zip`);
      result = buildFromSource(
        releaseZip,
        path.join(releaseRoot, "contracts", "release-artifact-v1.json"),
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

test("v0.3.3 upgrade and rollback keep the published managed state recoverable", async t => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-v033-roundtrip-"));
  try {
    const accepted = publicationRoles.find(release => release.version === "v0.3.3");
    const acceptedPackage = buildPublishedPackage(workspace, accepted);
    const currentPackage = buildCurrentPackage(workspace);

    await t.test("a candidate with bundle drift cannot modify or back up the v0.3.3 installation", () => {
      const home = installHome(workspace, "invalid-upgrade-home");
      let result = runPackageInstaller(acceptedPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(acceptedPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
      const before = managedState(home);

      const candidateBundle = path.join(currentPackage, "contracts", "runtime-bundle-v1.json");
      const originalBundle = fs.readFileSync(candidateBundle);
      try {
        fs.appendFileSync(candidateBundle, " ");
        result = runPackageInstaller(currentPackage, home, "install");
        assert.equal(result.status, 1, "candidate accepted a runtime bundle that no longer matches its manifest SHA");
        assert.match(result.stderr, /runtime bundle SHA-256 mismatch/);
        assert.deepEqual(managedState(home), before, "rejected candidate upgrade changed the v0.3.3 managed state");
      } finally {
        fs.writeFileSync(candidateBundle, originalBundle);
      }

      result = runPackageInstaller(acceptedPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
    });

    await t.test("a valid candidate can replace v0.3.3 and the immutable v0.3.3 installer can take ownership back", () => {
      const home = installHome(workspace, "valid-roundtrip-home");
      let result = runPackageInstaller(acceptedPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(currentPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(currentPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
      let manifest = JSON.parse(fs.readFileSync(path.join(home, "hooks", "planning-with-files", "installed-manifest.json"), "utf8"));
      assert.equal(manifest.installer_version, "0.3.4");

      result = runPackageInstaller(acceptedPackage, home, "install");
      assert.equal(result.status, 0, result.stderr);
      result = runPackageInstaller(acceptedPackage, home, "doctor");
      assert.equal(result.status, 0, result.stderr);
      manifest = JSON.parse(fs.readFileSync(path.join(home, "hooks", "planning-with-files", "installed-manifest.json"), "utf8"));
      assert.equal(manifest.installer_version, "0.3.3");
    });
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});
