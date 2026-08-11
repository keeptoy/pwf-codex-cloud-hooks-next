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
const release032ZipSha256 = "b42aecafaba650e5595acef8c138d142747da38dde04fa78bfb0a7f4235e5081";
const release033ZipSha256 = "2b2dca5c5894a2297a6f2ccc5fb190878c3c920b71148719a4873326b4ccb352";

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

test("current v0.3.4 sealed ZIP is deterministic, self-contained, and pinned by its external bootstrap", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-candidate-"));
  const first = path.join(workspace, "first.zip"), second = path.join(workspace, "second.zip");
  try {
    let result = run("build", first); assert.equal(result.status, 0, result.stderr);
    const firstResult = JSON.parse(result.stdout);
    result = run("build", second); assert.equal(result.status, 0, result.stderr);
    const secondResult = JSON.parse(result.stdout);
    assert.equal(sha256(first), sha256(second));
    assert.equal(firstResult.sha256, secondResult.sha256);
    assert.notEqual(firstResult.sha256, release033ZipSha256);
    assert.notEqual(firstResult.sha256, release032ZipSha256);
    assert.equal(firstResult.entries, 21);
    assert.ok(firstResult.size > 0);
    result = run("check", first); assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).healthy, true);

    const artifact = JSON.parse(fs.readFileSync(contract, "utf8"));
    const packageMetadata = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    assert.equal(packageMetadata.version, "0.3.4");
    assert.equal(artifact.package_name, packageMetadata.name);
    assert.equal(artifact.package_version, packageMetadata.version);
    assert.equal(artifact.entries.some(entry => entry.path === "tools/build_release.py"), true);
    assert.equal(artifact.entries.some(entry => entry.path === "tools/import_upstream_runtime.py"), true);
    assert.equal(artifact.entries.some(entry => entry.path === "patches/patch_planning_skill.py"), false);
    assert.equal(artifact.entries.some(entry => entry.path === "contracts/compatibility-overlays-v1.json"), false);
    assert.equal(artifact.entries.some(entry => entry.path.startsWith("init-cloud-sandbox-")), false);
    assert.deepEqual(artifact.external_release_assets.map(entry => entry.path), ["init-cloud-sandbox-v0.3.4.bash"]);
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
    const bootstrap = fs.readFileSync(path.join(root, "init-cloud-sandbox-v0.3.4.bash"), "utf8");
    assert.match(bootstrap, /HOOKS_VERSION="\$\{HOOKS_VERSION:-v0\.3\.4\}"/);
    assert.match(bootstrap, /keeptoy\/pwf-codex-cloud-hooks-next\/releases\/download/);
    const hooksSha = bootstrap.match(/HOOKS_SHA256="\$\{HOOKS_SHA256:-([a-f0-9]{64})\}"/);
    assert.ok(hooksSha, "bootstrap lacks a pinned default ZIP SHA-256");
    assert.equal(hooksSha[1], firstResult.sha256);
    assert.notEqual(hooksSha[1], "0".repeat(64));
    const roadmap = fs.readFileSync(path.join(root, "ROADMAP.md"), "utf8");
    assert.match(roadmap, /v0\.3\.4.*sealed candidate.*zero-hash Source\/Candidate/is);
    assert.match(roadmap, /历史 programme annotation.*exact current inventory guard/is);
    assert.match(roadmap, /Product Phase 4.*未授权/is);

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
