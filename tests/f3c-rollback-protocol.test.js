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
