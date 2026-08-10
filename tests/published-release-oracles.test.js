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
