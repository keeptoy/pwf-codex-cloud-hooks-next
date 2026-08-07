"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const builder = path.join(root, "tools", "build_release.py");
const contract = path.join(root, "contracts", "release-artifact-v1.json");
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const sha256 = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const betaZipSha256 = "812cc9cdcafa93b5fcc47cc763fd743f11be77958b75eea1fa4cf0508dd391ab";
const betaBootstrapSha256 = "d572b77d920b34c34c7912ba364376ae3668216f00ce350251bd7c8b336abcd6";
const stableCommit = "1454c9224c83d11c073b05baf6e536a11c3bb0e5";
const stableZipSha256 = "f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af";
const stableBootstrapSha256 = "ab334f0367d948fa29a2bdd37bff0c220929aeb320fdf59dbacbd5a4021b39c0";
const zeroSha256 = "0".repeat(64);

function run(command, archive, contractPath = contract, builderPath = builder, cwd = root) {
  const flag = command === "build" ? "--output" : "--archive";
  return spawnSync(python, [builderPath, command, "--contract", contractPath, flag, archive], {
    cwd,
    encoding: "utf8",
  });
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

test("0.3.1 candidate ZIP is deterministic, self-contained, and keeps its unsealed bootstrap external", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-candidate-"));
  const first = path.join(workspace, "first.zip"), second = path.join(workspace, "second.zip");
  try {
    let result = run("build", first); assert.equal(result.status, 0, result.stderr);
    const firstResult = JSON.parse(result.stdout);
    result = run("build", second); assert.equal(result.status, 0, result.stderr);
    const secondResult = JSON.parse(result.stdout);
    assert.equal(sha256(first), sha256(second));
    assert.equal(firstResult.sha256, secondResult.sha256);
    assert.notEqual(firstResult.sha256, stableZipSha256);
    assert.equal(firstResult.entries, 23);
    assert.ok(firstResult.size > 0);
    result = run("check", first); assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).healthy, true);

    const artifact = JSON.parse(fs.readFileSync(contract, "utf8"));
    const packageMetadata = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    assert.equal(packageMetadata.version, "0.3.1");
    assert.equal(artifact.package_name, packageMetadata.name);
    assert.equal(artifact.package_version, packageMetadata.version);
    assert.equal(artifact.entries.some(entry => entry.path === "tools/build_release.py"), true);
    assert.equal(artifact.entries.some(entry => entry.path === "tools/import_upstream_runtime.py"), true);
    assert.equal(artifact.entries.some(entry => entry.path === "patches/patch_planning_skill.py"), true);
    assert.equal(artifact.entries.some(entry => entry.path.startsWith("init-cloud-sandbox-")), false);
    assert.deepEqual(artifact.external_release_assets.map(entry => entry.path), ["init-cloud-sandbox-v0.3.1.bash"]);
    assert.deepEqual(artifact.checksum_workflow, [
      "freeze all required entries",
      "import and verify allowlisted upstream files",
      "build deterministic ZIP from this exact entry list",
      "inspect entry list and compute ZIP SHA-256",
      "write the exact version, package name, and ZIP SHA-256 into the external bootstrap",
      "compute the sealed external bootstrap SHA-256",
      "publish both immutable assets",
      "download both published assets and verify their SHA-256 values",
    ]);
    const bootstrap = fs.readFileSync(path.join(root, "init-cloud-sandbox-v0.3.1.bash"), "utf8");
    assert.match(bootstrap, /HOOKS_VERSION="\$\{HOOKS_VERSION:-v0\.3\.1\}"/);
    assert.match(bootstrap, /keeptoy\/pwf-codex-cloud-hooks-next\/releases\/download/);
    assert.match(bootstrap, new RegExp(`HOOKS_SHA256="\\$\\{HOOKS_SHA256:-${zeroSha256}\\}"`));

    const extracted = path.join(workspace, "extracted");
    extractZip(first, extracted);
    const packageRoot = path.join(extracted, artifact.archive_root.slice(0, -1));
    result = spawnSync(python, ["tools/import_upstream_runtime.py", "check"], {
      cwd: packageRoot,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);

    const releasePaths = [
      ...artifact.entries.map(entry => entry.path),
      ...artifact.external_release_assets.map(entry => entry.path),
    ];
    const attributes = spawnSync("git", ["check-attr", "eol", "--", ...releasePaths], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(attributes.status, 0, attributes.stderr);
    const eolByPath = new Map(attributes.stdout.trim().split(/\r?\n/).map(line => {
      const match = line.match(/^(.*): eol: (.*)$/);
      assert.ok(match, `unexpected git check-attr output: ${line}`);
      return [match[1].replaceAll("\\", "/"), match[2]];
    }));
    assert.deepEqual([...eolByPath.keys()].sort(), [...releasePaths].sort());
    for (const releasePath of releasePaths) assert.equal(eolByPath.get(releasePath), "lf", releasePath);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("Release builder rejects package and artifact candidate identity drift", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-identity-"));
  try {
    for (const [field, value, message] of [
      ["package_name", "different-package", /package name mismatch/],
      ["package_version", "9.9.9", /package version mismatch/],
    ]) {
      const artifact = JSON.parse(fs.readFileSync(contract, "utf8"));
      artifact[field] = value;
      const driftedContract = path.join(workspace, `${field}.json`);
      fs.writeFileSync(driftedContract, `${JSON.stringify(artifact, null, 2)}\n`);
      const result = run("build", path.join(workspace, `${field}.zip`), driftedContract);
      assert.equal(result.status, 1, result.stdout);
      assert.match(result.stderr, message);
    }
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("published v0.3.0 source/tag oracle and external bootstrap retain their immutable Release identity", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-stable-"));
  try {
    const tagResult = spawnSync("git", ["rev-parse", "--verify", "v0.3.0^{commit}"], {
      cwd: root,
      encoding: "utf8",
    });
    if (tagResult.status === 0) assert.equal(tagResult.stdout.trim(), stableCommit);

    let result = spawnSync("git", ["cat-file", "-e", `${stableCommit}^{commit}`], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);

    const sourceArchive = path.join(workspace, "v0.3.0-source.zip");
    result = spawnSync("git", ["archive", "--format=zip", `--output=${sourceArchive}`, stableCommit], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    const stableRoot = path.join(workspace, "source");
    extractZip(sourceArchive, stableRoot);
    const stableArtifact = JSON.parse(fs.readFileSync(path.join(stableRoot, "contracts", "release-artifact-v1.json"), "utf8"));
    const stablePackage = JSON.parse(fs.readFileSync(path.join(stableRoot, "package.json"), "utf8"));
    assert.equal(stablePackage.version, "0.3.0");
    assert.equal(stableArtifact.entries.length, 22);
    assert.deepEqual(stableArtifact.external_release_assets.map(entry => entry.path), ["init-cloud-sandbox-v0.3.0.bash"]);

    const stableZip = path.join(workspace, "pwf-codex-cloud-hooks-v0.3.0.zip");
    result = run(
      "build",
      stableZip,
      path.join(stableRoot, "contracts", "release-artifact-v1.json"),
      path.join(stableRoot, "tools", "build_release.py"),
      stableRoot,
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(sha256(stableZip), stableZipSha256);
    assert.equal(sha256(path.join(stableRoot, "init-cloud-sandbox-v0.3.0.bash")), stableBootstrapSha256);
    assert.equal(sha256(path.join(root, "init-cloud-sandbox-v0.3.0.bash")), stableBootstrapSha256);
    assert.notEqual(stableBootstrapSha256, betaBootstrapSha256);

    const betaAcceptance = fs.readFileSync(
      path.join(root, "docs", "v0.3.0-beta.2-cloud-hard-acceptance.md"),
      "utf8",
    );
    assert.doesNotMatch(betaAcceptance, /__PWF_BETA2_/);
    assert.match(betaAcceptance, new RegExp(betaZipSha256, "g"));
    assert.match(betaAcceptance, new RegExp(betaBootstrapSha256, "g"));
    const provenance = fs.readFileSync(path.join(root, "BASELINE_PROVENANCE.md"), "utf8");
    assert.match(provenance, new RegExp(betaZipSha256, "g"));
    assert.match(provenance, new RegExp(betaBootstrapSha256, "g"));
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});
