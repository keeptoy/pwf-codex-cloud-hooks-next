"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const { validateF3RollbackEvidenceRecord } = require("./f3-lifecycle-helpers");

const root = path.resolve(__dirname, "..");
const currentRuntime = path.join(root, "runtime", "owned-plan.py");
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const LINUX = process.platform === "linux";
const acceptedSource = "5d01b55890c1da2a5088e2b991b152a9fb1c3f87";

function evidence(stage = "rollback", profile = "smart") {
  const rollback = stage === "rollback";
  return {
    schema_version: 1,
    profile,
    stage,
    runtime_source_head: "a".repeat(40),
    workspace_disarm_head: "b".repeat(40),
    current_version: "0.4.0-dev",
    current_candidate_sha256: "c".repeat(64),
    accepted_version: "v0.3.5",
    accepted_source_head: "d".repeat(40),
    accepted_zip_sha256: "e".repeat(64),
    installed_role: rollback ? "accepted" : "current",
    installed_version: rollback ? "0.3.5" : "0.4.0-dev",
    repository_state: profile === "smart" ? "smart_prepared" : "autonomous_prepared",
    activation_absent: true,
    worktree: "clean",
    session_start_sources: ["startup", "resume"],
    user_prompt_observed: true,
    hook_context: "legacy",
    effective_profile: "legacy",
    advisory: null,
    doctor_healthy: true,
    backup_verified: true,
    transition: rollback
      ? "current_uninstall_then_accepted_clean_install"
      : "accepted_to_current_exact_predecessor",
    snapshot_leftovers: 0,
    final_exit_code: 0,
  };
}

function requestV2(projectRoot) {
  return {
    schema_version: 2,
    runtime: "codex",
    event: { name: "UserPromptSubmit", source: null, session_id: null, turn_id: null },
    project: { root: projectRoot, plan_id: "active" },
    policy: {
      planning_enabled: true,
      allowed_profiles: ["legacy", "smart", "autonomous"],
      opt_in_protocol: "codex-managed-v1",
    },
    output_budget: { max_context_chars: 20000, max_plan_lines: 50, max_progress_lines: 20 },
  };
}

function requestV1(projectRoot) {
  return {
    schema_version: 1,
    runtime: "codex",
    event: { name: "UserPromptSubmit", source: null, session_id: null, turn_id: null },
    project: { root: projectRoot, plan_id: "active" },
    policy: { planning_enabled: true, behavior_profile: "managed_legacy" },
    output_budget: { max_context_chars: 20000, max_plan_lines: 50, max_progress_lines: 20 },
  };
}

function runRuntime(runtime, request, env = {}) {
  const result = spawnSync(python, [runtime], {
    input: JSON.stringify(request),
    encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1", ...env },
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

function extractAcceptedRuntime(destination) {
  for (const relative of [
    "runtime/owned-plan.py",
    "runtime/upstream/inject-plan.sh",
    "runtime/upstream/ledger-summary.sh",
    "runtime/upstream/resolve-plan-dir.sh",
    "runtime/upstream/session-catchup.py",
  ]) {
    const result = spawnSync("git", ["show", `${acceptedSource}:${relative}`], {
      cwd: root,
      encoding: null,
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
    assert.equal(result.status, 0, result.stderr?.toString("utf8"));
    const target = path.join(destination, relative.replace(/^runtime\//, ""));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, result.stdout);
    fs.chmodSync(target, 0o755);
  }
  return path.join(destination, "owned-plan.py");
}

function armedWorkspace(profile) {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), `pwf-f3c-${profile}-`));
  const plan = path.join(workspace, ".planning", "active");
  fs.mkdirSync(plan, { recursive: true });
  fs.writeFileSync(path.join(workspace, ".planning", ".active_plan"), "active\n");
  fs.writeFileSync(path.join(plan, "task_plan.md"), `# ${profile} rollback negative\n\n## Goal\nKeep intent explicit.\n`);
  fs.writeFileSync(path.join(plan, "progress.md"), "F3C_RUNTIME_ONLY_NEGATIVE\n");
  if (profile === "smart") {
    fs.writeFileSync(path.join(plan, ".mode"), "inject-smart\n");
    fs.writeFileSync(path.join(plan, ".pwf-codex-managed"), "codex-managed-v1\n");
  } else {
    const task = fs.readFileSync(path.join(plan, "task_plan.md"));
    fs.writeFileSync(path.join(plan, ".mode"), "autonomous\n");
    fs.writeFileSync(path.join(plan, ".nonce"), "0123456789abcdef\n");
    fs.writeFileSync(path.join(plan, ".attestation"),
      `${crypto.createHash("sha256").update(task).digest("hex")}\n`);
    fs.writeFileSync(path.join(plan, ".pwf-codex-managed"), "codex-managed-v1 autonomous\n");
  }
  return { workspace, plan };
}

test("F3C rollback evidence keeps accepted and current roles explicit", () => {
  const rollback = evidence("rollback", "smart");
  const recovered = evidence("recovered", "autonomous");
  assert.deepEqual(validateF3RollbackEvidenceRecord(rollback), rollback);
  assert.deepEqual(validateF3RollbackEvidenceRecord(recovered), recovered);
  assert.throws(() => validateF3RollbackEvidenceRecord({ ...rollback, latest: true }), /exact keys/);
  assert.throws(() => validateF3RollbackEvidenceRecord({ ...rollback, installed_role: "current" }), /accepted role/);
  assert.throws(() => validateF3RollbackEvidenceRecord({ ...recovered, installed_version: "0.3.5" }),
    /current_version/);
  assert.throws(() => validateF3RollbackEvidenceRecord({ ...rollback, activation_absent: false }),
    /absent activation/);
  assert.throws(() => validateF3RollbackEvidenceRecord({ ...recovered, repository_state: "autonomous_armed" }),
    /state\/profile/);
  assert.throws(() => validateF3RollbackEvidenceRecord({ ...rollback, effective_profile: "smart" }),
    /legacy effective profile/);
  assert.throws(() => validateF3RollbackEvidenceRecord({ ...rollback, transition: recovered.transition }),
    /rollback transition/);
});

for (const profile of ["smart", "autonomous"]) {
  test(`runtime-only ${profile} rollback leaves an activation that revives under current runtime`, { skip: !LINUX }, () => {
    const layout = armedWorkspace(profile);
    const acceptedRuntimeRoot = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-f3c-accepted-runtime-"));
    try {
      const acceptedRuntime = extractAcceptedRuntime(acceptedRuntimeRoot);
      const stateBefore = fs.readdirSync(layout.plan).sort()
        .map(name => [name, fs.readFileSync(path.join(layout.plan, name))]);

      let result = runRuntime(currentRuntime, requestV2(layout.workspace), { PWF_INJECT: "smart" });
      assert.equal(result.effective_profile, profile);

      result = runRuntime(acceptedRuntime, requestV1(layout.workspace));
      assert.equal(result.schema_version, 1);
      assert.equal(result.outcome, "context_emitted");
      assert.match(result.context, /===BEGIN PLAN DATA===/);
      assert.match(result.context, /=== recent progress ===/);

      result = runRuntime(currentRuntime, requestV2(layout.workspace), { PWF_INJECT: "smart" });
      assert.equal(result.effective_profile, profile,
        "current runtime did not revive the still-present activation commit point");
      const stateAfter = fs.readdirSync(layout.plan).sort()
        .map(name => [name, fs.readFileSync(path.join(layout.plan, name))]);
      assert.deepEqual(stateAfter, stateBefore, "runtime-only switching changed workspace intent state");
    } finally {
      fs.rmSync(layout.workspace, { recursive: true, force: true });
      fs.rmSync(acceptedRuntimeRoot, { recursive: true, force: true });
    }
  });
}

test("F3C operator guide is self-contained, exact, and preserves live authorization boundaries", () => {
  const guide = fs.readFileSync(
    path.join(root, "docs", "v0.4.0-dev-f3c-rollback-operator-guide.md"), "utf8");
  for (const anchor of [
    "f3c-operator-positioning", "f3c-section-map", "f3c-one-minute-model", "f3c2-smart-live-walkthrough",
    "f3c-frozen-identities", "f3c-no-live-gate", "f3c-ref-aware-checkout",
    "f3c-cloud-environment", "f3c-transaction", "f3c-cloud-order", "f3c-host-prompts",
    "f3c-read-only-verifier", "f3c-evidence-records", "f3c-stop-and-handoff", "f3c-pre-run-status",
    "f3c-post-no-live-status", "f3c2-smart-post-run-status",
  ]) assert.match(guide, new RegExp(`<a name="${anchor}"></a>`));
  for (const identity of [
    "12a359096ab1e376014476b77a6b0833a7a90b2e",
    "df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c",
    "5d01b55890c1da2a5088e2b991b152a9fb1c3f87",
    "7d351cfe0eaa60e93bc279645ed3f480dc9e83efdff1c6abf13c14d84c286f0b",
    "c9275ba02073adb184cd73550c5b9f54c6f8178c",
    "98b6f138497af244563541ec655a1111198f0c36",
  ]) assert.match(guide, new RegExp(identity));
  for (const stage of ["S_ROLLBACK", "S_RECOVER", "A_ROLLBACK", "A_RECOVER"]) {
    assert.match(guide, new RegExp(stage));
  }
  assert.match(guide, /current-owned uninstall/);
  assert.match(guide, /accepted_to_current_exact_predecessor/);
  assert.match(guide, /validateF3RollbackEvidenceRecord/);
  assert.match(guide, /F3_ROLLBACK_EVIDENCE_RECORD_V1=PASS/);
  assert.match(guide, /session id[\s\S]*持续轮询/);
  assert.match(guide, /第 3 节[^\n]*F3C1/);
  assert.match(guide, /第 4～9 节[^\n]*F3C2\/F3C3/);
  assert.match(guide, /S_ROLLBACK[^\n]*S_RECOVER/);
  assert.match(guide, /git clone https:\/\/github\.com\/keeptoy\/pwf-codex-cloud-hooks-next\.git/);
  assert.match(guide, /rev-parse --verify 'v0\.3\.5\^\{commit\}'/);
  assert.match(guide, /rev-parse --verify 'v0\.3\.4\^\{commit\}'/);
  assert.match(guide, /PWF_F3C1_REF_AWARE_PREFLIGHT=PASS/);
  assert.match(guide, /PWF_F3C_SKILL_BOOTSTRAP=PASS/);
  assert.match(guide, /bash "\$SKILL_BOOTSTRAP" skill/);
  assert.doesNotMatch(guide, /bash "\$SKILL_BOOTSTRAP" all/);
  const skillBootstrap = guide.indexOf('bash "$SKILL_BOOTSTRAP" skill');
  const firstCurrentInstall = guide.indexOf('node "$CURRENT_PACKAGE/install.js" install');
  assert.ok(skillBootstrap >= 0 && firstCurrentInstall > skillBootstrap,
    "F3C transaction must install the pinned pristine Skill before the first current installer call");
  assert.match(guide, /第一条模型提示词之前完成/);
  assert.match(guide, /不能冒充安装完成后的 Fresh Host证据/);
  for (const placeholder of [
    "<EXPECTED_STAGE>",
    "<EXPECTED_WORKSPACE_HEAD>",
    "<EXPECTED_INSTALLED_ROLE>",
    "<EXPECTED_REPOSITORY_STATE>",
    "<EXPECTED_EFFECTIVE_PROFILE>",
  ]) assert.match(guide, new RegExp(placeholder));
  assert.match(guide, /S_ROLLBACK[^\n]*accepted[^\n]*smart_prepared[^\n]*legacy/);
  assert.match(guide, /S_RECOVER[^\n]*current[^\n]*smart_prepared[^\n]*legacy/);
  assert.match(guide, /A_ROLLBACK[^\n]*accepted[^\n]*autonomous_prepared[^\n]*legacy/);
  assert.match(guide, /A_RECOVER[^\n]*current[^\n]*autonomous_prepared[^\n]*legacy/);
  assert.match(guide, /actual HEAD、actual installed role、actual effective profile 一律写 UNKNOWN/);
  assert.match(guide,
    /F3C1_PROTOCOL_MATERIALIZED \/ REPOSITORY_AND_LINUX_NO_LIVE_REQUIRED \/ CLOUD_ROLLBACK_NOT_RUN \/ STOP_BEFORE_F3C2/);
  assert.match(guide,
    /F3C1_PROTOCOL_NO_LIVE_PASS \/ REF_AWARE_LINUX_ZERO_SKIP \/ CLOUD_ROLLBACK_NOT_RUN \/ STOP_BEFORE_F3C2/);
  assert.match(guide,
    /F3C2_SMART_LIVE_PASS \/ SMART_ROLLBACK_AND_EXACT_RECOVERY_CONFIRMED \/ STOP_BEFORE_F3C3/);
  assert.match(guide, /S_ROLLBACK[^\n]*immutable accepted `v0\.3\.5`/);
  assert.match(guide, /S_RECOVER[^\n]*exact current `0\.4\.0-dev`/);
  assert.match(guide, /cdc4a9eba7e7f1f2545723829ed1a6b4c76cb48b/);
  assert.match(guide, /13\/13 tests通过，0 fail、0 skipped、exit code 0/);
  assert.doesNotMatch(guide, /F3C_ROLLBACK_PASS\s*\/\s*(?:CONFIRMED|PASS)/);

  const bashBlocks = [...guide.matchAll(/```bash\n([\s\S]*?)```/g)].map(match => match[1]);
  assert.ok(bashBlocks.length >= 4, "F3C guide must retain independently executable shell stages");
  for (const [index, source] of bashBlocks.entries()) {
    const syntax = spawnSync("bash", ["-n"], { input: source, encoding: "utf8" });
    assert.equal(syntax.status, 0, `F3C guide bash block ${index + 1}: ${syntax.stderr}`);
  }
});
