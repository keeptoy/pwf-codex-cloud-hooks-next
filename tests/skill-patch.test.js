"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const pristineSkill = path.join(root, "tests", "fixtures", "planning-with-files");
const patcher = path.join(root, "patches", "patch_planning_skill.py");
const manifestPath = path.join(root, "upstream-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const patchContract = manifest.compatibility_patches.PWF_CODEX_CLOUD_COMPAT_PATCH;
assert.deepEqual(Object.keys(manifest.compatibility_patches), ["PWF_CODEX_CLOUD_COMPAT_PATCH"]);
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const bash = process.env.BASH || (process.platform === "win32" ? "D:\\Program Files\\Git\\bin\\bash.exe" : "bash");
const bootstrap031 = path.join(root, "init-cloud-sandbox-v0.3.1.bash");

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

function fixture(prefix = "pwf-skill-patch-") {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const skill = path.join(workspace, ".agents", "skills", "planning-with-files");
  fs.mkdirSync(path.dirname(skill), { recursive: true });
  fs.cpSync(pristineSkill, skill, { recursive: true });
  return { workspace, skill };
}

function runPatcher(skill, command = "apply") {
  return spawnSync(python, [
    patcher,
    command,
    "--skill-root", skill,
    "--manifest", manifestPath,
  ], { encoding: "utf8" });
}

test("compatibility patch is deterministic, idempotent, and fail-closed", () => {
  const { workspace, skill } = fixture();
  const target = path.join(skill, "scripts", "session-catchup.py");
  try {
    assert.equal(fs.existsSync(target), true);
    let result = runPatcher(skill);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).changed, true);
    assert.equal(require("node:crypto").createHash("sha256").update(fs.readFileSync(target)).digest("hex"), patchContract.patched_sha256);

    result = runPatcher(skill);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).changed, false);

    result = runPatcher(skill, "check");
    assert.equal(result.status, 0, result.stderr);

    fs.appendFileSync(target, "# unknown drift\n");
    result = runPatcher(skill);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /refusing unknown Skill content/);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("stable v0.3.0 bootstrap pins the sealed successor ZIP and leaves the global Skill pristine", () => {
  const bootstrap = fs.readFileSync(path.join(root, "init-cloud-sandbox-v0.3.0.bash"), "utf8");
  const workflow = bootstrap.match(/install_hooks_component\(\) \{([\s\S]*?)\n\}/);
  assert.ok(workflow, "install_hooks_component was not found");
  assert.match(bootstrap, /HOOKS_VERSION="\$\{HOOKS_VERSION:-v0\.3\.0\}"/);
  assert.match(bootstrap, /HOOKS_URL="\$\{HOOKS_URL:-https:\/\/github\.com\/keeptoy\/pwf-codex-cloud-hooks-next\/releases\/download\/\$\{HOOKS_VERSION\}\/\$\{HOOKS_PACKAGE\}\}"/);
  assert.match(bootstrap, /HOOKS_SHA256="\$\{HOOKS_SHA256:-f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af\}"/);
  assert.match(bootstrap, /HOOKS_SHA256 is still a placeholder/);
  assert.doesNotMatch(bootstrap, /apply_planning_skill_compat_patch|verify_patched_planning_skill|PLANNING_SKILL_PATCHED_SHA256/);
  assert.match(workflow[1], /install_managed_hooks/);
  assert.match(bootstrap, /run_verification\(\) \{[\s\S]*verify_planning_skill/);
});

test("v0.3.1 bootstrap removes remote Node tooling and pins the pristine Skill archive", () => {
  const bootstrap = fs.readFileSync(bootstrap031, "utf8");
  const runAll = bootstrap.match(/run_all\(\) \{([\s\S]*?)\n\}/);
  assert.ok(runAll, "run_all was not found");
  assert.match(bootstrap, /HOOKS_VERSION="\$\{HOOKS_VERSION:-v0\.3\.1\}"/);
  assert.match(bootstrap, /HOOKS_SHA256="\$\{HOOKS_SHA256:-0{64}\}"/);
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
  const developmentGate = runBash('source "$1"\nassert_hooks_checksum_configured', [bootstrap031]);
  assert.equal(developmentGate.status, 1, developmentGate.stdout);
  assert.match(developmentGate.stderr, /HOOKS_SHA256 is still a placeholder/);
});

test("v0.3.1 bootstrap rejects Node below 18 and accepts supported platform majors", () => {
  const command = [
    'source "$1"',
    'node() { printf "%s\\n" "$PWF_TEST_NODE_VERSION"; }',
    "verify_node_toolchain",
  ].join("\n");
  for (const version of ["v18.0.0", "v22.17.1", "v24.3.0"]) {
    const result = runBash(command, [bootstrap031], { PWF_TEST_NODE_VERSION: version });
    assert.equal(result.status, 0, `${version}: ${result.stderr}`);
  }
  for (const version of ["v17.9.1", "not-a-node-version", "v18"]) {
    const result = runBash(command, [bootstrap031], { PWF_TEST_NODE_VERSION: version });
    assert.equal(result.status, 1, `${version}: ${result.stdout}`);
    assert.match(result.stderr, /Node\.js 18 or newer is required|Unable to parse Node\.js version/);
  }
});

test("v0.3.1 bootstrap installs only the verified pristine Skill subtree", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-bootstrap-v031-"));
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
    const result = runBash(command, [bootstrap031], {
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

test("v0.3.1 bootstrap rejects a bad Skill archive without replacing an existing Skill", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-bootstrap-v031-bad-"));
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
    const result = runBash(command, [bootstrap031], {
      PLANNING_WITH_FILES_ARCHIVE_SHA256: "0".repeat(64),
      PLANNING_WITH_FILES_ROOT: bashPath(installedSkill),
      PWF_TEST_ARCHIVE: bashPath(fixtureArchive.archive),
    });
    assert.equal(result.status, 1, result.stdout);
    assert.match(result.stderr, /SHA-256 verification failed/);
    assert.equal(fs.readFileSync(sentinel, "utf8"), "preserve me\n");

    const driftFixture = makeSkillArchive(path.join(workspace, "drift"), true);
    const driftResult = runBash(command, [bootstrap031], {
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

test("managed compatibility overlay remains reproducible for the owned imported copy", () => {
  const { workspace, skill } = fixture("pwf-catchup-runtime-");
  const project = path.join(workspace, "project");
  const scoped = path.join(project, ".planning", "catchup-regression");
  const codexHome = path.join(workspace, "codex");
  const sessions = path.join(codexHome, "sessions", "2026", "08", "01");
  const rollout = path.join(sessions, "rollout-2026-08-01T00-00-00-catchup-thread.jsonl");
  try {
    const patched = runPatcher(skill);
    assert.equal(patched.status, 0, patched.stderr);
    fs.mkdirSync(scoped, { recursive: true });
    fs.writeFileSync(path.join(project, ".planning", ".active_plan"), "catchup-regression\n");
    fs.writeFileSync(path.join(scoped, "task_plan.md"), "# scoped-only plan\n");
    fs.mkdirSync(sessions, { recursive: true });
    const sentinel = "PWF_CATCHUP_UNSYNCED_SENTINEL_82C4";
    const wrappedUserMessage = `The user was unsatisfied with the code.\n<PREVIOUS_PR_DESCRIPTION>\n${"w".repeat(1500)}\n</PREVIOUS_PR_DESCRIPTION>\n${sentinel}`;
    const records = [
      { type: "session_meta", payload: { cwd: project, source: "codex" } },
      { type: "response_item", payload: { type: "message", role: "assistant", content: [{ type: "output_text", text: "x".repeat(6000) }] } },
      { type: "event_msg", payload: { type: "patch_apply_end", success: true, changes: { [path.join(scoped, "task_plan.md")]: { operation: "modified" } } } },
      { type: "response_item", payload: { type: "message", role: "user", content: [{ type: "input_text", text: wrappedUserMessage }] } },
    ];
    fs.writeFileSync(rollout, records.map(record => JSON.stringify(record)).join("\n") + "\n");
    const env = { ...process.env, PWF_RUNTIME: "codex", CODEX_HOME: codexHome };
    delete env.CODEX_SESSIONS_DIR;
    delete env.CODEX_THREAD_ID;
    const result = spawnSync(python, [path.join(skill, "scripts", "session-catchup.py"), project], { encoding: "utf8", env });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /SESSION CATCHUP DETECTED/);
    assert.match(result.stdout, /Runtime: codex/);
    assert.match(result.stdout, /Last planning update: task_plan\.md/);
    assert.match(result.stdout, /Unsynced messages: 1/);
    assert.match(result.stdout, /The user was unsatisfied with the code/);
    assert.match(result.stdout, /\.\.\.\[truncated\]\.\.\./);
    assert.match(result.stdout, new RegExp(sentinel));

  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});
