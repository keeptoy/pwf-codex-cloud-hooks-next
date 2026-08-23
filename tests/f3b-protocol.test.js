"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const { validateActivePlanState, validateF3EvidenceRecord } = require("./f3-lifecycle-helpers");

function fixture(scope) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-f3b-"));
  const plan = path.join(root, ".planning", scope);
  fs.mkdirSync(plan, { recursive: true });
  fs.writeFileSync(path.join(root, ".planning", ".active_plan"), `${scope}\n`);
  fs.writeFileSync(path.join(plan, "task_plan.md"), `# Task Plan: ${scope}\n\nF3B_INITIAL_TASK\n`);
  fs.writeFileSync(path.join(plan, "findings.md"), "# Findings\n");
  fs.writeFileSync(path.join(plan, "progress.md"), "# Progress\n");
  return { root, scope, plan, relativePlan: `.planning/${scope}` };
}

function git(root, ...args) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    timeout: 20_000,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  assert.equal(result.status, 0, result.error?.message || result.stderr);
  return result.stdout.trim();
}

function commitAll(root, message) {
  git(root, "add", "-A");
  git(root, "-c", "user.name=F3B Fixture", "-c", "user.email=f3b@example.invalid",
    "-c", "commit.gpgsign=false", "commit", "--no-verify", "-m", message);
  return git(root, "rev-parse", "HEAD");
}

function assertCommitPoint(root, before, after, relativePlan, action) {
  assert.equal(git(root, "rev-parse", `${after}^`), before);
  assert.equal(git(root, "diff-tree", "--no-commit-id", "--name-status", "--no-renames", "-r", after),
    `${action}\t${relativePlan}/.pwf-codex-managed`);
}

function writeAutonomousPreparation(layout, nonce) {
  const task = fs.readFileSync(path.join(layout.plan, "task_plan.md"));
  fs.writeFileSync(path.join(layout.plan, ".mode"), "autonomous\n");
  fs.writeFileSync(path.join(layout.plan, ".nonce"), `${nonce}\n`);
  fs.writeFileSync(path.join(layout.plan, ".attestation"),
    `${crypto.createHash("sha256").update(task).digest("hex")}\n`);
}

test("F3B1 disposable Git dry run closes isolated smart and autonomous DAGs", () => {
  const layout = fixture("2026-08-14-f3b-dag-fixture");
  try {
    git(layout.root, "init", "-q");
    const baseline = commitAll(layout.root, "markerless foundation");
    assert.equal(validateActivePlanState(layout.plan), "legacy");

    fs.writeFileSync(path.join(layout.plan, ".mode"), "inject-smart\n");
    const smartPrepared = commitAll(layout.root, "smart preparation");
    assert.equal(git(layout.root, "rev-parse", `${smartPrepared}^`), baseline);
    assert.equal(validateActivePlanState(layout.plan), "smart_prepared");
    fs.writeFileSync(path.join(layout.plan, ".pwf-codex-managed"), "codex-managed-v1\n");
    const smartArmed = commitAll(layout.root, "smart activation");
    assertCommitPoint(layout.root, smartPrepared, smartArmed, layout.relativePlan, "A");
    assert.equal(validateActivePlanState(layout.plan), "smart_armed");
    fs.rmSync(path.join(layout.plan, ".pwf-codex-managed"));
    const smartDisarmed = commitAll(layout.root, "smart disarm");
    assertCommitPoint(layout.root, smartArmed, smartDisarmed, layout.relativePlan, "D");
    assert.equal(validateActivePlanState(layout.plan), "smart_prepared");
    fs.writeFileSync(path.join(layout.plan, ".pwf-codex-managed"), "codex-managed-v1\n");
    const smartRearmed = commitAll(layout.root, "smart rearm");
    assertCommitPoint(layout.root, smartDisarmed, smartRearmed, layout.relativePlan, "A");
    assert.equal(validateActivePlanState(layout.plan), "smart_armed");

    git(layout.root, "checkout", "-q", "--detach", baseline);
    writeAutonomousPreparation(layout, "0123456789abcdef");
    const autonomousPrepared = commitAll(layout.root, "autonomous preparation");
    assert.equal(git(layout.root, "rev-parse", `${autonomousPrepared}^`), baseline);
    assert.equal(validateActivePlanState(layout.plan), "autonomous_prepared");
    fs.writeFileSync(path.join(layout.plan, ".pwf-codex-managed"), "codex-managed-v1 autonomous\n");
    const autonomousArmed = commitAll(layout.root, "autonomous activation");
    assertCommitPoint(layout.root, autonomousPrepared, autonomousArmed, layout.relativePlan, "A");
    assert.equal(validateActivePlanState(layout.plan), "autonomous_armed");
    fs.rmSync(path.join(layout.plan, ".pwf-codex-managed"));
    const autonomousDisarmed = commitAll(layout.root, "autonomous disarm");
    assertCommitPoint(layout.root, autonomousArmed, autonomousDisarmed, layout.relativePlan, "D");
    assert.equal(validateActivePlanState(layout.plan), "autonomous_prepared");

    fs.writeFileSync(path.join(layout.plan, "task_plan.md"),
      "# Task Plan: autonomous reprepare\n\nF3B_REATTESTED_TASK\n");
    writeAutonomousPreparation(layout, "fedcba9876543210");
    const autonomousReprepared = commitAll(layout.root, "autonomous reprepare");
    assert.equal(git(layout.root, "rev-parse", `${autonomousReprepared}^`), autonomousDisarmed);
    assert.deepEqual(git(layout.root, "diff-tree", "--no-commit-id", "--name-only", "--no-renames", "-r",
      autonomousReprepared).split(/\r?\n/).sort(), [
      `${layout.relativePlan}/.attestation`, `${layout.relativePlan}/.nonce`, `${layout.relativePlan}/task_plan.md`,
    ].sort());
    assert.equal(validateActivePlanState(layout.plan), "autonomous_prepared");
    fs.writeFileSync(path.join(layout.plan, ".pwf-codex-managed"), "codex-managed-v1 autonomous\n");
    const autonomousRearmed = commitAll(layout.root, "autonomous rearm");
    assertCommitPoint(layout.root, autonomousReprepared, autonomousRearmed, layout.relativePlan, "A");
    assert.equal(validateActivePlanState(layout.plan), "autonomous_armed");
    assert.equal(git(layout.root, "status", "--porcelain=v1", "--untracked-files=all"), "");
  } finally {
    fs.rmSync(layout.root, { recursive: true, force: true });
  }
});

test("F3B1 evidence record is exact, relational, and rejects self-certified drift", () => {
  assert.equal(typeof validateF3EvidenceRecord, "function");
  const record = {
    schema_version: 1,
    profile: "smart",
    stage: "armed",
    runtime_source_head: "a".repeat(40),
    candidate_sha256: "b".repeat(64),
    workspace_lifecycle_head: "c".repeat(40),
    worktree: "clean",
    session_start_sources: ["startup", "resume"],
    user_prompt_observed: true,
    hook_context: "smart",
    effective_profile: "smart",
    advisory: null,
    doctor_healthy: true,
    snapshot_leftovers: 0,
    cache_state: "reset",
    final_exit_code: 0,
  };
  assert.deepEqual(validateF3EvidenceRecord(record), record);
  assert.throws(() => validateF3EvidenceRecord({ ...record, latest: true }), /exact keys/);
  assert.throws(() => validateF3EvidenceRecord({ ...record, hook_context: "legacy" }), /stage\/profile/);
  assert.throws(() => validateF3EvidenceRecord({ ...record, candidate_sha256: "0".repeat(63) }), /candidate_sha256/);
  const tampered = {
    ...record,
    profile: "autonomous",
    stage: "tampered",
    worktree: "tamper_only",
    session_start_sources: ["startup"],
    hook_context: "canary_only",
    effective_profile: null,
    advisory: "state_unsafe",
  };
  assert.deepEqual(validateF3EvidenceRecord(tampered), tampered);
});
