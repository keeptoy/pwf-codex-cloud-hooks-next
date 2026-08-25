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
const materializer = path.join(root, "tools", "materialize_release_assets.py");
const builder = path.join(root, "tools", "build_release.py");
const template = path.join(root, "tools", "templates", "init-cloud-sandbox.bash.in");
const packageVersion = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;
const version = `v${packageVersion}`;
const bootstrapName = `init-cloud-sandbox-${version}.bash`;
const zipName = `pwf-codex-cloud-hooks-${version}.zip`;
const zeroSha256 = "0".repeat(64);
const sha256 = value => crypto.createHash("sha256").update(value).digest("hex");

function runMaterializer(args) {
  return spawnSync(python, [materializer, ...args], { cwd: root, encoding: "utf8" });
}

function buildExpectedZip(output) {
  const result = spawnSync(python, [builder, "build", "--output", output], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("canonical bootstrap template renders the tracked candidate without mojibake", () => {
  const source = fs.readFileSync(template, "utf8");
  assert.equal(source.match(/@HOOKS_VERSION@/g)?.length, 1);
  assert.equal(source.match(/@HOOKS_SHA256@/g)?.length, 1);
  assert.equal(source.match(/@[A-Z0-9_]+@/g)?.length, 2);
  assert.match(source, /这是一次 planning-with-files lifecycle Hook 黑盒验证。/);
  assert.doesNotMatch(source, /è¿|ã|ä¸¥æ/);

  const expected = source
    .replace("@HOOKS_VERSION@", version)
    .replace("@HOOKS_SHA256@", zeroSha256);
  assert.equal(fs.readFileSync(path.join(root, bootstrapName), "utf8"), expected);

  const check = runMaterializer(["candidate-bootstrap"]);
  assert.equal(check.status, 0, check.stderr);
  const result = JSON.parse(check.stdout);
  assert.equal(result.action, "candidate-bootstrap");
  assert.equal(result.state, "unchanged");
  assert.equal(result.version, version);
  assert.equal(result.zip_sha256, zeroSha256);
});

test("release materializer creates an exact and idempotent ZIP/bootstrap pair", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-assets-"));
  try {
    const expectedZip = path.join(workspace, "expected.zip");
    const expected = buildExpectedZip(expectedZip);
    const output = path.join(workspace, "dist");
    let run = runMaterializer([
      "release", "--version", version,
      "--expected-zip-sha", expected.sha256,
      "--output-dir", output,
    ]);
    assert.equal(run.status, 0, run.stderr);
    let result = JSON.parse(run.stdout);
    assert.equal(result.action, "release");
    assert.equal(result.zip.state, "created");
    assert.equal(result.bootstrap.state, "created");
    assert.equal(path.basename(result.zip.path), zipName);
    assert.equal(path.basename(result.bootstrap.path), bootstrapName);

    const releaseZip = fs.readFileSync(path.join(output, zipName));
    const bootstrap = fs.readFileSync(path.join(output, bootstrapName), "utf8");
    assert.equal(sha256(releaseZip), expected.sha256);
    assert.equal(Buffer.compare(releaseZip, fs.readFileSync(expectedZip)), 0);
    assert.match(bootstrap, new RegExp(`HOOKS_VERSION="\\$\\{HOOKS_VERSION:-${version.replaceAll(".", "\\.")}\\}"`));
    assert.match(bootstrap, new RegExp(`HOOKS_SHA256="\\$\\{HOOKS_SHA256:-${expected.sha256}\\}"`));
    assert.doesNotMatch(bootstrap, /@HOOKS_|è¿|ã|ä¸¥æ/);

    run = runMaterializer([
      "release", "--version", version,
      "--expected-zip-sha", expected.sha256,
      "--output-dir", output,
    ]);
    assert.equal(run.status, 0, run.stderr);
    result = JSON.parse(run.stdout);
    assert.equal(result.zip.state, "unchanged");
    assert.equal(result.bootstrap.state, "unchanged");
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("release materializer fails closed on identity, SHA, and existing-output drift", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-assets-fail-"));
  try {
    const expectedZip = path.join(workspace, "expected.zip");
    const expected = buildExpectedZip(expectedZip);

    for (const [args, message] of [
      [["release", "--version", "v9.9.9", "--expected-zip-sha", expected.sha256], /release version mismatch/],
      [["release", "--version", version, "--expected-zip-sha", zeroSha256], /must not be the development zero placeholder/],
      [["release", "--version", version, "--expected-zip-sha", "A".repeat(64)], /64 lowercase hexadecimal/],
    ]) {
      const result = runMaterializer([...args, "--output-dir", path.join(workspace, crypto.randomUUID())]);
      assert.equal(result.status, 1, result.stdout);
      assert.match(result.stderr, message);
    }

    const mismatchOutput = path.join(workspace, "mismatch");
    const mismatch = runMaterializer([
      "release", "--version", version,
      "--expected-zip-sha", "1".repeat(64),
      "--output-dir", mismatchOutput,
    ]);
    assert.equal(mismatch.status, 1, mismatch.stdout);
    assert.match(mismatch.stderr, /Source\/Candidate ZIP SHA-256 mismatch/);
    assert.deepEqual(fs.readdirSync(mismatchOutput), []);

    const conflictOutput = path.join(workspace, "conflict");
    fs.mkdirSync(conflictOutput);
    fs.writeFileSync(path.join(conflictOutput, bootstrapName), "different bytes\n");
    const conflict = runMaterializer([
      "release", "--version", version,
      "--expected-zip-sha", expected.sha256,
      "--output-dir", conflictOutput,
    ]);
    assert.equal(conflict.status, 1, conflict.stdout);
    assert.match(conflict.stderr, /refusing to overwrite different existing output/);
    assert.deepEqual(fs.readdirSync(conflictOutput), [bootstrapName]);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("release materializer and bootstrap template stay outside the Release ZIP", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "upstream-manifest.json"), "utf8"));
  const artifact = JSON.parse(fs.readFileSync(path.join(root, manifest.managed_runtime.contracts.release_artifact.path), "utf8"));
  const entries = artifact.entries.map(entry => entry.path);
  assert.equal(entries.includes("tools/materialize_release_assets.py"), false);
  assert.equal(entries.includes("tools/templates/init-cloud-sandbox.bash.in"), false);
  assert.deepEqual(artifact.external_release_assets, [bootstrapName]);
});
