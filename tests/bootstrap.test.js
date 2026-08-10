"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const pristineSkill = path.join(root, "tests", "fixtures", "planning-with-files");
const manifestPath = path.join(root, "upstream-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const bash = process.env.BASH || (process.platform === "win32" ? "D:\\Program Files\\Git\\bin\\bash.exe" : "bash");
const candidateBootstrap = path.join(root, "init-cloud-sandbox-v0.3.3.bash");
const releaseZipSha256 = "2b2dca5c5894a2297a6f2ccc5fb190878c3c920b71148719a4873326b4ccb352";

function bashPath(value) {
  const normalized = value.replaceAll("\\", "/");
  return process.platform === "win32"
    ? normalized.replace(/^([A-Za-z]):/, (_, drive) => `/${drive.toLowerCase()}`)
    : normalized;
}

function runBash(command, args = [], env = {}) {
  return spawnSync(bash, ["-c", command, "_", ...args.map(bashPath)], {
    encoding: "utf8",
    env: { ...process.env, ...env },
  });
}

function makeSkillArchive(workspace, driftRequiredFile = false) {
  const archiveRoot = path.join(workspace, "planning-with-files-3.8.2");
  const skillRoot = path.join(archiveRoot, "skills", "planning-with-files");
  const archive = path.join(workspace, "planning-with-files-v3.8.2.zip");
  fs.mkdirSync(path.dirname(skillRoot), { recursive: true });
  fs.cpSync(pristineSkill, skillRoot, { recursive: true });
  if (driftRequiredFile) fs.appendFileSync(path.join(skillRoot, "SKILL.md"), "\nunknown drift\n");
  fs.writeFileSync(path.join(archiveRoot, "OUTSIDE_SKILL_SENTINEL"), "must not be installed\n");
  const result = spawnSync(python, ["-c", [
    "import pathlib, sys, zipfile",
    "root = pathlib.Path(sys.argv[1])",
    "archive = pathlib.Path(sys.argv[2])",
    "with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as output:",
    "    for item in sorted(root.rglob('*')):",
    "        if item.is_file():",
    "            output.write(item, item.relative_to(root.parent).as_posix())",
  ].join("\n"), archiveRoot, archive], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return { archive, sha256: require("node:crypto").createHash("sha256").update(fs.readFileSync(archive)).digest("hex") };
}

test("sealed bootstrap pins both archives, removes remote Node tooling, and rejects an explicit zero hash", () => {
  const bootstrap = fs.readFileSync(candidateBootstrap, "utf8");
  const runAll = bootstrap.match(/run_all\(\) \{([\s\S]*?)\n\}/);
  assert.ok(runAll, "run_all was not found");
  assert.match(bootstrap, /HOOKS_VERSION="\$\{HOOKS_VERSION:-v0\.3\.3\}"/);
  assert.match(bootstrap, new RegExp(`HOOKS_SHA256="\\$\\{HOOKS_SHA256:-${releaseZipSha256}\\}"`));
  assert.match(bootstrap, new RegExp(manifest.release_archive_url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(bootstrap, new RegExp(manifest.release_archive_sha256));
  assert.match(bootstrap, /PLANNING_WITH_FILES_ARCHIVE_ROOT="\$\{PLANNING_WITH_FILES_ARCHIVE_ROOT:-planning-with-files-3\.8\.2\}"/);
  assert.match(bootstrap, /PLANNING_WITH_FILES_SOURCE_PATH="\$\{PLANNING_WITH_FILES_SOURCE_PATH:-skills\/planning-with-files\}"/);
  assert.match(bootstrap, /verify_node_toolchain\(\)/);
  assert.match(bootstrap, /Node\.js 18 or newer is required/);
  assert.match(bootstrap, /verify_sha256 "\$PLANNING_WITH_FILES_ARCHIVE_SHA256"/);
  assert.doesNotMatch(bootstrap, /\bNVM(?:_DIR|_VERSION)?\b|\bNODE_VERSION\b|\bSKILLS_CLI_VERSION\b/);
  assert.doesNotMatch(bootstrap, /\bnvm\b|\bnpx\b|\bnpm\b/i);
  assert.doesNotMatch(bootstrap, /\|[ \t]*bash\b/);
  assert.ok(runAll[1].indexOf("verify_node_toolchain") < runAll[1].indexOf("install_system_prerequisites"));
  const sealedDefault = runBash('source "$1"\nassert_hooks_checksum_configured', [candidateBootstrap]);
  assert.equal(sealedDefault.status, 0, sealedDefault.stderr);
  const explicitZero = runBash(
    'source "$1"\nassert_hooks_checksum_configured',
    [candidateBootstrap],
    { HOOKS_SHA256: "0".repeat(64) },
  );
  assert.equal(explicitZero.status, 1, explicitZero.stdout);
  assert.match(explicitZero.stderr, /HOOKS_SHA256 is still a placeholder/);
  const explicitNonzero = runBash(
    'source "$1"\nassert_hooks_checksum_configured',
    [candidateBootstrap],
    { HOOKS_SHA256: "1".repeat(64) },
  );
  assert.equal(explicitNonzero.status, 0, explicitNonzero.stderr);
});

test("candidate bootstrap rejects Node below 18 and accepts supported platform majors", () => {
  const command = [
    'source "$1"',
    'node() { printf "%s\\n" "$PWF_TEST_NODE_VERSION"; }',
    "verify_node_toolchain",
  ].join("\n");
  for (const version of ["v18.0.0", "v22.17.1", "v24.3.0"]) {
    const result = runBash(command, [candidateBootstrap], { PWF_TEST_NODE_VERSION: version });
    assert.equal(result.status, 0, `${version}: ${result.stderr}`);
  }
  for (const version of ["v17.9.1", "not-a-node-version", "v18"]) {
    const result = runBash(command, [candidateBootstrap], { PWF_TEST_NODE_VERSION: version });
    assert.equal(result.status, 1, `${version}: ${result.stdout}`);
    assert.match(result.stderr, /Node\.js 18 or newer is required|Unable to parse Node\.js version/);
  }
});

test("candidate bootstrap installs only the verified pristine Skill subtree", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-bootstrap-candidate-"));
  const installedSkill = path.join(workspace, "global", "planning-with-files");
  const replacedSentinel = path.join(installedSkill, "replaced-skill-sentinel");
  try {
    const fixtureArchive = makeSkillArchive(workspace);
    fs.mkdirSync(installedSkill, { recursive: true });
    fs.writeFileSync(replacedSentinel, "old installation\n");
    const command = [
      'source "$1"',
      'download_file() { cp -- "$PWF_TEST_ARCHIVE" "$2"; }',
      "install_planning_skill",
    ].join("\n");
    const result = runBash(command, [candidateBootstrap], {
      PLANNING_WITH_FILES_ARCHIVE_SHA256: fixtureArchive.sha256,
      PLANNING_WITH_FILES_ROOT: bashPath(installedSkill),
      PWF_TEST_ARCHIVE: bashPath(fixtureArchive.archive),
    });
    assert.equal(result.status, 0, result.stderr);
    for (const [relative, expected] of Object.entries(manifest.required_skill_files)) {
      const actual = require("node:crypto").createHash("sha256")
        .update(fs.readFileSync(path.join(installedSkill, relative))).digest("hex");
      assert.equal(actual, expected, relative);
    }
    assert.equal(fs.existsSync(path.join(installedSkill, "OUTSIDE_SKILL_SENTINEL")), false);
    assert.equal(fs.existsSync(replacedSentinel), false);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("candidate bootstrap rejects a bad Skill archive without replacing an existing Skill", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-bootstrap-candidate-bad-"));
  const installedSkill = path.join(workspace, "global", "planning-with-files");
  const sentinel = path.join(installedSkill, "existing-skill-sentinel");
  try {
    const fixtureArchive = makeSkillArchive(workspace);
    fs.mkdirSync(installedSkill, { recursive: true });
    fs.writeFileSync(sentinel, "preserve me\n");
    const command = [
      'source "$1"',
      'download_file() { cp -- "$PWF_TEST_ARCHIVE" "$2"; }',
      "install_planning_skill",
    ].join("\n");
    const result = runBash(command, [candidateBootstrap], {
      PLANNING_WITH_FILES_ARCHIVE_SHA256: "0".repeat(64),
      PLANNING_WITH_FILES_ROOT: bashPath(installedSkill),
      PWF_TEST_ARCHIVE: bashPath(fixtureArchive.archive),
    });
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /SHA-256 verification failed/);
    assert.equal(fs.readFileSync(sentinel, "utf8"), "preserve me\n");

    const driftFixture = makeSkillArchive(path.join(workspace, "drift"), true);
    const driftResult = runBash(command, [candidateBootstrap], {
      PLANNING_WITH_FILES_ARCHIVE_SHA256: driftFixture.sha256,
      PLANNING_WITH_FILES_ROOT: bashPath(installedSkill),
      PWF_TEST_ARCHIVE: bashPath(driftFixture.archive),
    });
    assert.equal(driftResult.status, 1, driftResult.stdout);
    assert.match(driftResult.stderr, /SHA-256 verification failed/);
    assert.equal(fs.readFileSync(sentinel, "utf8"), "preserve me\n");
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});
