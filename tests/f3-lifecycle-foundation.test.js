"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const { validateActivePlanState, validatePlanningScopes } = require("./f3-lifecycle-helpers");
const root = path.resolve(__dirname, "..");

function planFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-f3a-"));
  const scope = "2026-08-13-f3a-fixture";
  const plan = path.join(root, ".planning", scope);
  fs.mkdirSync(plan, { recursive: true });
  fs.writeFileSync(path.join(root, ".planning", ".active_plan"), `${scope}\n`);
  fs.writeFileSync(path.join(plan, "task_plan.md"), "# Task Plan: F3A fixture\n");
  fs.writeFileSync(path.join(plan, "findings.md"), "# Findings\n");
  fs.writeFileSync(path.join(plan, "progress.md"), "# Progress\n");
  return { root, scope, plan };
}

function writeAutonomous(layout, { armed = false } = {}) {
  const task = fs.readFileSync(path.join(layout.plan, "task_plan.md"));
  fs.writeFileSync(path.join(layout.plan, ".mode"), "autonomous\n");
  fs.writeFileSync(path.join(layout.plan, ".nonce"), "0123456789abcdef\n");
  fs.writeFileSync(path.join(layout.plan, ".attestation"),
    `${crypto.createHash("sha256").update(task).digest("hex")}\n`);
  if (armed) fs.writeFileSync(path.join(layout.plan, ".pwf-codex-managed"), "codex-managed-v1 autonomous\n");
}

function git(root, ...args) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function commitAll(root, message) {
  git(root, "add", "-A");
  git(root, "-c", "user.name=F3A Fixture", "-c", "user.email=f3a@example.invalid", "commit", "-m", message);
  return git(root, "rev-parse", "HEAD");
}

function assertCommitPointTransition(root, before, after, planPath, action) {
  assert.equal(git(root, "rev-parse", `${after}^`), before, "transition commit must directly follow reviewed parent");
  const expected = `${action}\t${planPath}/.pwf-codex-managed`;
  assert.equal(git(root, "diff-tree", "--no-commit-id", "--name-status", "--no-renames", "-r", after), expected,
    "transition commit must only change the activation commit point");
}

test("F3A repository admission accepts only complete active-scope lifecycle states", () => {
  const layout = planFixture();
  try {
    assert.equal(validateActivePlanState(layout.plan), "legacy");
    fs.writeFileSync(path.join(layout.plan, ".mode"), "inject-smart\n");
    assert.equal(validateActivePlanState(layout.plan), "smart_prepared");
    fs.writeFileSync(path.join(layout.plan, ".pwf-codex-managed"), "codex-managed-v1\n");
    assert.equal(validateActivePlanState(layout.plan), "smart_armed");
    fs.rmSync(path.join(layout.plan, ".mode"));
    fs.rmSync(path.join(layout.plan, ".pwf-codex-managed"));
    writeAutonomous(layout);
    assert.equal(validateActivePlanState(layout.plan), "autonomous_prepared");
    fs.writeFileSync(path.join(layout.plan, "ledger-agent_1.jsonl"),
      '{"tick":1,"agent":"agent_1","ts":"2026-08-13T00:00:00Z","phase":"F3A","event":"note","summary":"fixture","files":[]}\n');
    fs.writeFileSync(path.join(layout.plan, ".pwf-codex-managed"), "codex-managed-v1 autonomous\n");
    assert.equal(validateActivePlanState(layout.plan), "autonomous_armed");
  } finally { fs.rmSync(layout.root, { recursive: true, force: true }); }
});

test("F3A repository admission rejects partial, mismatched, linked, unknown, and inactive state", () => {
  const cases = [
    layout => fs.writeFileSync(path.join(layout.plan, ".nonce"), "0123456789abcdef\n"),
    layout => { fs.writeFileSync(path.join(layout.plan, ".mode"), "inject-smart\n"); fs.writeFileSync(path.join(layout.plan, ".nonce"), "0123456789abcdef\n"); },
    layout => { writeAutonomous(layout); fs.writeFileSync(path.join(layout.plan, ".attestation"), `${"0".repeat(64)}\n`); },
    layout => fs.writeFileSync(path.join(layout.plan, ".unknown"), "x\n"),
  ];
  for (const mutate of cases) {
    const layout = planFixture();
    try { mutate(layout); assert.throws(() => validateActivePlanState(layout.plan)); }
    finally { fs.rmSync(layout.root, { recursive: true, force: true }); }
  }

  const malformedLedger = planFixture();
  try {
    writeAutonomous(malformedLedger);
    fs.writeFileSync(path.join(malformedLedger.plan, "ledger-agent.jsonl"), '{"tick":1}\n');
    assert.throws(() => validateActivePlanState(malformedLedger.plan), /production ledger admission rejected/);
  } finally { fs.rmSync(malformedLedger.root, { recursive: true, force: true }); }

  const inactive = planFixture();
  try {
    const old = path.join(inactive.root, ".planning", "2026-08-12-inactive");
    fs.mkdirSync(old);
    for (const file of ["task_plan.md", "findings.md", "progress.md"]) fs.writeFileSync(path.join(old, file), "# record\n");
    fs.writeFileSync(path.join(old, ".mode"), "inject-smart\n");
    const paths = fs.readdirSync(path.join(inactive.root, ".planning"), { recursive: true })
      .map(value => `.planning/${String(value).replaceAll("\\", "/")}`)
      .filter(value => !fs.statSync(path.join(inactive.root, value)).isDirectory());
    assert.throws(() => validatePlanningScopes(inactive.root, inactive.scope, paths), /inactive planning scope contains state/);
  } finally { fs.rmSync(inactive.root, { recursive: true, force: true }); }

  if (process.platform !== "win32") {
    const linked = planFixture();
    try {
      fs.writeFileSync(path.join(linked.root, "mode-target"), "inject-smart\n");
      fs.symlinkSync(path.join(linked.root, "mode-target"), path.join(linked.plan, ".mode"));
      assert.throws(() => validateActivePlanState(linked.plan), /symlink/);
    } finally { fs.rmSync(linked.root, { recursive: true, force: true }); }
  }
});

test("F3A Git-backed activation and disarm commits change only the commit point", () => {
  const layout = planFixture();
  const relativePlan = `.planning/${layout.scope}`;
  try {
    git(layout.root, "init", "-q");
    commitAll(layout.root, "baseline");
    writeAutonomous(layout);
    const prepared = commitAll(layout.root, "prepare autonomous state");
    assert.equal(validateActivePlanState(layout.plan), "autonomous_prepared");
    fs.writeFileSync(path.join(layout.plan, ".pwf-codex-managed"), "codex-managed-v1 autonomous\n");
    const activated = commitAll(layout.root, "activate autonomous state");
    assertCommitPointTransition(layout.root, prepared, activated, relativePlan, "A");
    assert.equal(validateActivePlanState(layout.plan), "autonomous_armed");
    fs.rmSync(path.join(layout.plan, ".pwf-codex-managed"));
    const disarmed = commitAll(layout.root, "disarm autonomous state");
    assertCommitPointTransition(layout.root, activated, disarmed, relativePlan, "D");
    assert.equal(validateActivePlanState(layout.plan), "autonomous_prepared");
  } finally { fs.rmSync(layout.root, { recursive: true, force: true }); }
});

test("F3 runbook freezes the no-live boundary and exact lifecycle checks", () => {
  const runbook = fs.readFileSync(path.join(root, "docs", "v0.4.0-dev-f3-cloud-lifecycle-runbook.md"), "utf8");
  for (const anchor of [
    "f3-safety-boundary", "f3-prepare-state", "f3-activation-only-commit", "f3-production-read-only-probe",
    "f3-disarm-commit", "f3-live-matrix", "f3-evidence-schema",
  ]) assert.match(runbook, new RegExp(`<a name="${anchor}"></a>`));
  assert.match(runbook, /F3B1 不授权真实 prepare、activate、disarm 或 Cloud lifecycle/);
  assert.match(runbook, /activation commit 必须直接以 preparation commit 为 parent/);
  assert.match(runbook, /diff-tree --no-commit-id --name-status --no-renames -r/);
  assert.match(runbook, /A\t\.planning\/\$PLAN_ID\/\.pwf-codex-managed/);
  assert.match(runbook, /D\t\.planning\/\$PLAN_ID\/\.pwf-codex-managed/);
  assert.match(runbook, /F3_READ_ONLY_PROBE=PASS/);
  assert.match(runbook, /F3_PREPARATION_PRODUCTION_PROBE=PASS/);
  assert.match(runbook, /不复制第二套 ledger JSON parser/);
  assert.match(runbook, /INCOMPLETE\/UNKNOWN/);
  assert.match(runbook, /runtime-only rollback/);
  assert.doesNotMatch(runbook, /(?:export\s+)?(?:SECRET|TOKEN|PASSWORD)=/i);
  const bashBlocks = [...runbook.matchAll(/```bash\n([\s\S]*?)```/g)].map(match => match[1]);
  assert.ok(bashBlocks.length >= 8, "F3 runbook must retain independently reviewable shell stages");
  for (const [index, source] of bashBlocks.entries()) {
    const syntax = spawnSync("bash", ["-n"], { input: source, encoding: "utf8" });
    assert.equal(syntax.status, 0, `F3 runbook bash block ${index + 1}: ${syntax.stderr}`);
  }
});

test("Phase 4.6 records F3A implementation drift and object retirement without promoting live evidence", () => {
  const history = fs.readFileSync(path.join(root, "docs", "history", "phase-4.6-f3-cloud-lifecycle-discovery.md"), "utf8");
  assert.match(history, /<a name="phase-4-6-post-implementation-design-reconciliation"><\/a>/);
  assert.match(history, /主路线没有偏航/);
  assert.match(history, /REPOSITORY-ONLY SOURCE VERIFIER \/ PRODUCT-PENDING/);
  assert.match(history, /TRANSITIONAL F3A NO-LIVE GUARD/);
  assert.match(history, /F3B preparation commit/);
  assert.match(history, /BORROWED INTERNAL AUTHORITY/);
  assert.match(history, /CURRENT INVENTORY, NOT A CAP/);
  assert.match(history, /real activation\/disarm\/Fresh\/Resume evidence[^\n]*ABSENT \/ NOT AUTHORIZED/);
  assert.match(history, /rollback\/disarm-first evidence[^\n]*ABSENT \/ F3C NOT AUTHORIZED/);
});

test("Phase 4.7 freezes a two-identity staged F3B protocol and records F3B2 Cloud closure", () => {
  const history = fs.readFileSync(
    path.join(root, "docs", "history", "phase-4.7-f3b-live-preflight-discovery.md"), "utf8");
  const operatorGuide = fs.readFileSync(
    path.join(root, "docs", "v0.4.0-dev-f3b2-smart-live-operator-guide.md"), "utf8");
  for (const anchor of [
    "phase-4-7-new-evidence", "phase-4-7-frozen-invariants", "phase-4-7-validation-topology",
    "phase-4-7-gate-plan", "phase-4-7-evidence-and-stop-rules", "phase-4-7-lifecycle-ledger",
    "phase-4-7-decision", "phase-4-7-post-implementation-status-f3b2",
    "phase-4-7-post-discovery-status-f3b3",
  ]) assert.match(history, new RegExp(`<a name="${anchor}"></a>`));
  assert.match(history, /`RUNTIME_SOURCE_HEAD`/);
  assert.match(history, /`WORKSPACE_LIFECYCLE_HEAD`/);
  assert.match(history, /F3B1_PROTOCOL_READY \/ NO_LIVE_STATE \/ STOP_BEFORE_F3B2/);
  assert.match(history, /F3B2_SMART_LIVE_PASS \/ STOP_AND_REVIEW/);
  assert.match(history, /F3B3_AUTONOMOUS_LIVE_PASS \/ STOP_AND_REVIEW/);
  assert.match(history, /F3B_TAMPER_ONLY/);
  assert.match(history, /advisory=state_unsafe/);
  assert.match(history, /DEVELOPMENT CANDIDATE NO-LIVE GUARD/);
  assert.match(history, /CONDITIONAL_GO_TO_F3B1_PROTOCOL_MATERIALIZATION/);
  assert.match(history, /不因本结论自动授权 F3B1、F3B2、F3B3、F3B4、F3C 或 Release/);
  assert.match(history, /## Post-implementation status — F3B2/);
  assert.match(history, /本地施工载体的变化，不改变“validation state 不进入开发分支”的架构不变量/);
  assert.match(history, /runtime-source transport ref/);
  assert.match(history, /F3B2_LOCAL_CHAIN_READY \/ CLOUD_LIVE_PENDING \/ LIVE_PASS_ABSENT \/ STOP_BEFORE_F3B3`（当时状态）/);
  assert.match(history,
    /F3B2_SMART_LIVE_PASS \/ REVERSIBLE_OPT_IN_CONFIRMED \/ STOP_AND_REVIEW \/ STOP_BEFORE_F3B3/);
  assert.match(history, /FROZEN ACCEPTED EVIDENCE/);
  assert.match(history, /F3B3 autonomous\/tamper objects[^\n]*ABSENT \/ NOT AUTHORIZED/);
  for (const text of [history, operatorGuide]) {
    assert.match(text, /workspace(?:_| )stage/i);
    assert.match(text, /repository(?:_| )state/i);
    assert.match(text, /effective(?:_| )profile/i);
    assert.match(text, /S_DISARM[\s\S]*smart_prepared[\s\S]*legacy/);
  }
  assert.match(operatorGuide, /EXPECTED_EFFECTIVE_PROFILE/);
  assert.match(operatorGuide, /actual 等于 expected/);
  assert.match(operatorGuide, /production probe JSON/);
});

test("Phase 4.8 preserves Discovery history and records autonomous local plus Cloud closure", () => {
  const history = fs.readFileSync(
    path.join(root, "docs", "history", "phase-4.8-f3b3-autonomous-live-discovery.md"), "utf8");
  for (const anchor of [
    "phase-4-8-positioning", "phase-4-8-inherited-evidence", "phase-4-8-runtime-code-audit",
    "phase-4-8-autonomous-state-model", "phase-4-8-validation-topology", "phase-4-8-tamper-boundary",
    "phase-4-8-evidence-and-stop-rules", "phase-4-8-lifecycle-ledger", "phase-4-8-decision",
    "phase-4-8-post-implementation-status-f3b3", "phase-4-8-post-live-status-f3b3",
  ]) assert.match(history, new RegExp(`<a name="${anchor}"></a>`));
  for (const state of ["A_BASE", "A_PREP", "A_ARM", "A_DISARM", "A_REPREP", "A_REARM"]) {
    assert.match(history, new RegExp(`\\b${state}\\b`));
  }
  assert.match(history, /entries: 0/);
  assert.match(history, /raw `progress\.md`/);
  assert.match(history, /outcome=invalid_request/);
  assert.match(history, /effective_profile=null/);
  assert.match(history, /advisory=state_unsafe/);
  assert.match(history, /tampered record[^\n]*workspace_lifecycle_head[^\n]*A_ARM/);
  assert.match(history,
    /CONDITIONAL_GO_TO_F3B3_AUTONOMOUS_MATERIALIZATION \/ IMPLEMENTATION_NOT_AUTHORIZED \/ LIVE_NOT_STARTED/);
  assert.match(history, /本结论不授权创建 refs\/machine state、执行 tamper、启动 Cloud task/);
  assert.match(history,
    /F3B3_LOCAL_CHAIN_READY \/ CLOUD_LIVE_NOT_AUTHORIZED \/ LIVE_PASS_ABSENT \/ STOP_BEFORE_F3B4/);
  assert.match(history, /Discovery 上方的 `ABSENT` 表保留当时历史语义/);
  assert.match(history, /v0\.4\.0-dev-f3b3-autonomous-live-operator-guide\.md#f3b3-operator-positioning/);
  assert.match(history,
    /F3B3_AUTONOMOUS_LIVE_PASS \/ TAMPER_REFUSAL_AND_REATTEST_CONFIRMED \/ STOP_AND_REVIEW \/ STOP_BEFORE_F3B4/);
  assert.match(history, /tamper environment[\s\S]*DESTROYED/);
  assert.match(history, /本结论不自动授权 F3B4 evidence closure、F3C disarm-first rollback/);
});
