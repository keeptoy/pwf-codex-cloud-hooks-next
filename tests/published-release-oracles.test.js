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
const sha256 = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const betaZipSha256 = "812cc9cdcafa93b5fcc47cc763fd743f11be77958b75eea1fa4cf0508dd391ab";
const betaBootstrapSha256 = "d572b77d920b34c34c7912ba364376ae3668216f00ce350251bd7c8b336abcd6";
const stableCommit = "1454c9224c83d11c073b05baf6e536a11c3bb0e5";
const stableZipSha256 = "f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af";
const stableBootstrapSha256 = "ab334f0367d948fa29a2bdd37bff0c220929aeb320fdf59dbacbd5a4021b39c0";
const release031Commit = "9aa2148886e499f9f45594f7ae4f7681f1045de2";
const release031ZipSha256 = "f097b04015b1a3847ca5a24b9236f882c5a008b22033793b5661e282c39131f9";
const release031BootstrapSha256 = "ce31a32002aea46bbf3f9baf9a0e93451d24c3b3653952e425d1e1ff6960a5e8";
const release032Commit = "c68a53bdeab7c38badcfb4e2a733ddd851e498e4";
const release032ZipSha256 = "b42aecafaba650e5595acef8c138d142747da38dde04fa78bfb0a7f4235e5081";
const release032BootstrapSha256 = "aa2c1fd64bfc8ee3804d5f4bf39f7816a2ca9ad9a96949336ec94a6c20f8f77c";

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

test("published v0.3.2 source/tag oracle retains its immutable Release identity", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-v032-"));
  try {
    const tagResult = spawnSync("git", ["rev-parse", "--verify", "v0.3.2^{commit}"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(tagResult.status, 0, tagResult.stderr);
    assert.equal(tagResult.stdout.trim(), release032Commit);

    const sourceArchive = path.join(workspace, "v0.3.2-source.zip");
    let result = spawnSync("git", ["archive", "--format=zip", `--output=${sourceArchive}`, release032Commit], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    const releaseRoot = path.join(workspace, "source");
    extractZip(sourceArchive, releaseRoot);
    const releaseArtifact = JSON.parse(fs.readFileSync(path.join(releaseRoot, "contracts", "release-artifact-v1.json"), "utf8"));
    const releasePackage = JSON.parse(fs.readFileSync(path.join(releaseRoot, "package.json"), "utf8"));
    assert.equal(releasePackage.version, "0.3.2");
    assert.equal(releaseArtifact.entries.length, 23);
    assert.deepEqual(releaseArtifact.external_release_assets.map(entry => entry.path), ["init-cloud-sandbox-v0.3.2.bash"]);

    const releaseZip = path.join(workspace, "pwf-codex-cloud-hooks-v0.3.2.zip");
    result = buildFromSource(
      releaseZip,
      path.join(releaseRoot, "contracts", "release-artifact-v1.json"),
      path.join(releaseRoot, "tools", "build_release.py"),
      releaseRoot,
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(sha256(releaseZip), release032ZipSha256);
    assert.equal(sha256(path.join(releaseRoot, "init-cloud-sandbox-v0.3.2.bash")), release032BootstrapSha256);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("published v0.3.1 source/tag oracle and external bootstrap retain their immutable Release identity", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-v031-"));
  try {
    const tagResult = spawnSync("git", ["rev-parse", "--verify", "v0.3.1^{commit}"], {
      cwd: root,
      encoding: "utf8",
    });
    if (tagResult.status === 0) assert.equal(tagResult.stdout.trim(), release031Commit);

    let result = spawnSync("git", ["cat-file", "-e", `${release031Commit}^{commit}`], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);

    const sourceArchive = path.join(workspace, "v0.3.1-source.zip");
    result = spawnSync("git", ["archive", "--format=zip", `--output=${sourceArchive}`, release031Commit], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);
    const releaseRoot = path.join(workspace, "source");
    extractZip(sourceArchive, releaseRoot);
    const releaseArtifact = JSON.parse(fs.readFileSync(path.join(releaseRoot, "contracts", "release-artifact-v1.json"), "utf8"));
    const releasePackage = JSON.parse(fs.readFileSync(path.join(releaseRoot, "package.json"), "utf8"));
    assert.equal(releasePackage.version, "0.3.1");
    assert.equal(releaseArtifact.entries.length, 23);
    assert.deepEqual(releaseArtifact.external_release_assets.map(entry => entry.path), ["init-cloud-sandbox-v0.3.1.bash"]);

    const releaseZip = path.join(workspace, "pwf-codex-cloud-hooks-v0.3.1.zip");
    result = buildFromSource(
      releaseZip,
      path.join(releaseRoot, "contracts", "release-artifact-v1.json"),
      path.join(releaseRoot, "tools", "build_release.py"),
      releaseRoot,
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(sha256(releaseZip), release031ZipSha256);
    assert.equal(sha256(path.join(releaseRoot, "init-cloud-sandbox-v0.3.1.bash")), release031BootstrapSha256);
    assert.equal(sha256(path.join(root, "init-cloud-sandbox-v0.3.1.bash")), release031BootstrapSha256);
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
    result = buildFromSource(
      stableZip,
      path.join(stableRoot, "contracts", "release-artifact-v1.json"),
      path.join(stableRoot, "tools", "build_release.py"),
      stableRoot,
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(sha256(stableZip), stableZipSha256);
    assert.equal(sha256(path.join(stableRoot, "init-cloud-sandbox-v0.3.0.bash")), stableBootstrapSha256);
    assert.notEqual(stableBootstrapSha256, betaBootstrapSha256);

    const provenance = fs.readFileSync(path.join(root, "BASELINE_PROVENANCE.md"), "utf8");
    assert.match(provenance, new RegExp(betaZipSha256, "g"));
    assert.match(provenance, new RegExp(betaBootstrapSha256, "g"));
    assert.match(provenance, /blob\/cde4b15bba7ed8580cb774c8b8bb259c9174c3d0\/docs\/v0\.3\.0-beta\.2-cloud-hard-acceptance\.md/);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});
