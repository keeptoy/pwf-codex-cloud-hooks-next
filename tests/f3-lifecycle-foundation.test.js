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
    "phase-4-7-post-discovery-status-f3b3", "phase-4-7-f3b-gates-in-plain-language",
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
  assert.match(history, /F3B1[\s\S]*无 live 模拟考/);
  assert.match(history, /F3B2[\s\S]*smart 第一次正式实考/);
  assert.match(history, /F3B3[\s\S]*autonomous 到底能不能在真实 Cloud 跑通/);
  assert.match(history, /F3B4[\s\S]*smart \+ autonomous 的全部证据是否完整、互不混淆/);
  assert.match(history, /F3B_LIVE_LIFECYCLE_PASS[\s\S]*不能代替 F3C rollback PASS/);
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

test("Phase 4.9 preserves Discovery history and records authorized closure without deleting rollback refs", () => {
  const history = fs.readFileSync(
    path.join(root, "docs", "history", "phase-4.9-f3b4-evidence-closure-discovery.md"), "utf8");
  for (const anchor of [
    "phase-4-9-positioning", "phase-4-9-evidence-inventory", "phase-4-9-provenance-model",
    "phase-4-9-residue-audit", "phase-4-9-retention-ledger", "phase-4-9-closure-plan",
    "phase-4-9-stop-rules", "phase-4-9-decision", "phase-4-9-verification",
    "phase-4-9-post-implementation-status-f3b4", "phase-4-9-closure-verification",
  ]) assert.match(history, new RegExp(`<a name="${anchor}"></a>`));
  for (const stage of ["prepared", "armed", "tampered", "disarmed", "reprepared", "rearmed"]) {
    assert.match(history, new RegExp(`\`${stage}\``));
  }
  assert.match(history, /F3B3 runtime source 是 F3B2 runtime source 的后继/);
  assert.match(history, /production、contracts、bundle、manifest、installer、builder/);
  assert.match(history, /NOT_EXPORTED \/ NOT_REQUIRED_BY_EVIDENCE_V1/);
  assert.match(history, /不复制进仓库/);
  assert.match(history, /F3C PASS \+ 当前 0\.4\.0 Phase 9 instance complete/);
  assert.match(history, /KEEP ABSENT；禁止补建 ref/);
  assert.match(history, /165 tests，142 pass，0 fail，23 个 Linux\/POSIX-only honest skips/);
  assert.match(history,
    /CONDITIONAL_GO_TO_F3B4_EVIDENCE_CLOSURE \/ IMPLEMENTATION_NOT_AUTHORIZED \/ F3C_NOT_AUTHORIZED/);
  assert.match(history,
    /F3B_LIVE_LIFECYCLE_PASS \/ SMART_AND_AUTONOMOUS_EVIDENCE_RECONCILED \/ STOP_BEFORE_F3C/);
  assert.match(history, /全部保持原 commit/);
  assert.match(history, /F3C 仍须另行讨论、Discovery/);
  assert.match(history, /active planning 经 production admission helper 判定为 markerless legacy/);
  assert.match(history, /共 11 个/);
  assert.match(history, /Release v2 entries\/external assets 的交集为空/);
});

test("Phase 4.10 preserves rollback Discovery and appends F3C1 through F3C3 outcomes without aggregate PASS", () => {
  const history = fs.readFileSync(
    path.join(root, "docs", "history", "phase-4.10-f3c-rollback-discovery.md"), "utf8");
  for (const anchor of [
    "phase-4-10-positioning", "phase-4-10-new-evidence", "phase-4-10-threat-model",
    "phase-4-10-supported-transition", "phase-4-10-validation-topology", "phase-4-10-evidence-model",
    "phase-4-10-lifecycle-ledger", "phase-4-10-gate-plan", "phase-4-10-stop-rules",
    "phase-4-10-decision", "phase-4-10-verification", "phase-4-10-preimplementation-head-audit",
    "phase-4-10-post-implementation-status-f3c1", "phase-4-10-f3c1-linux-no-live-acceptance",
    "phase-4-10-f3c2-smart-live-acceptance", "phase-4-10-f3c3-autonomous-live-acceptance",
    "phase-4-10-successor-map",
  ]) assert.match(history, new RegExp(`<a name="${anchor}"></a>`));
  assert.match(history, /current installer uninstall \+ backup/);
  assert.match(history, /immutable v0\.3\.5 clean install/);
  assert.match(history, /current candidate exact forward migration/);
  assert.match(history, /direct old-over-new downgrade/);
  assert.match(history, /armed\/runtime-only rollback/);
  assert.match(history, /validateF3RollbackEvidenceRecord\(\)/);
  assert.match(history, /S_ROLLBACK → S_RECOVER/);
  assert.match(history, /A_ROLLBACK → A_RECOVER/);
  assert.match(history, /F3C PASS \+ 当前 0\.4\.0 Phase 9 instance complete/);
  assert.match(history,
    /CONDITIONAL_GO_TO_F3C1_ROLLBACK_PROTOCOL_MATERIALIZATION \/ IMPLEMENTATION_NOT_AUTHORIZED \/ REFS_FROZEN/);
  assert.match(history, /没有执行真实 uninstall\/install\/rollback/);
  assert.match(history, /current 与 v0\.3\.5 installed manifest schema 都是 3/);
  assert.match(history, /current-only v2\/extra runtime paths/);
  assert.match(history, /拒绝发生在 `backup\(\)`\/任何写入之前/);
  assert.match(history,
    /F3C1_PREIMPLEMENTATION_HEAD_AUDIT_PASS \/ PHASE_4_10_ROUTE_UNCHANGED \/ DIRECT_DOWNGRADE_TEST_REQUIRED \/ IMPLEMENTATION_NOT_AUTHORIZED/);
  assert.match(history, /validateF3RollbackEvidenceRecord\(\)/);
  assert.match(history, /没有新建 F3C validation ref/);
  assert.match(history,
    /F3C1_LOCAL_MATERIALIZATION_PASS \/ LINUX_NO_LIVE_PENDING \/ CLOUD_ROLLBACK_NOT_RUN \/ STOP_BEFORE_F3C2/);
  assert.match(history,
    /F3C1_PROTOCOL_NO_LIVE_PASS \/ REF_AWARE_LINUX_ZERO_SKIP \/ CLOUD_ROLLBACK_NOT_RUN \/ STOP_BEFORE_F3C2/);
  assert.match(history, /13 tests、13 pass、0 fail、0 skipped、exit code 0/);
  assert.match(history,
    /F3C2_SMART_LIVE_PASS \/ SMART_ROLLBACK_AND_EXACT_RECOVERY_CONFIRMED \/ STOP_BEFORE_F3C3/);
  assert.match(history,
    /F3C3_AUTONOMOUS_LIVE_PASS \/ AUTONOMOUS_ROLLBACK_AND_EXACT_RECOVERY_CONFIRMED \/ STOP_BEFORE_F3C4/);
  assert.match(history,
    /phase-4\.11-f3c4-aggregate-closure-discovery\.md#phase-4-11-f3c-at-a-glance/);
  assert.match(history, /本文件不复制[\s\S]*第二份可漂移的路线说明/);
  assert.doesNotMatch(history, /F3C_ROLLBACK_PASS \/.*CONFIRMED/);
});

test("Phase 4.11 conditionally admits minimal F3C4 closure while retaining refs and aggregate PASS absence", () => {
  const history = fs.readFileSync(
    path.join(root, "docs", "history", "phase-4.11-f3c4-aggregate-closure-discovery.md"), "utf8");
  const historyIndex = fs.readFileSync(path.join(root, "docs", "history", "README.md"), "utf8");
  for (const anchor of [
    "phase-4-11-positioning", "phase-4-11-f3c-at-a-glance", "phase-4-11-evidence-matrix",
    "phase-4-11-provenance-reconciliation", "phase-4-11-residue-audit",
    "phase-4-11-lifecycle-ledger", "phase-4-11-closure-plan",
    "phase-4-11-stop-rules", "phase-4-11-decision", "phase-4-11-verification",
  ]) assert.match(history, new RegExp(`<a name="${anchor}"></a>`));
  for (const stage of ["rollback", "recovered"]) assert.match(history, new RegExp(`\`${stage}\``));
  assert.match(history, /smart_prepared/);
  assert.match(history, /autonomous_prepared/);
  assert.match(history, /current_uninstall_then_accepted_clean_install/);
  assert.match(history, /accepted_to_current_exact_predecessor/);
  assert.match(history, /两项 no-live negative/);
  assert.match(history, /11个 F3B2\/F3B3 local validation refs/);
  assert.match(history, /Phase 4\.10：设计回滚路线/);
  assert.match(history, /F3C4：根据对账结论正式封账，形成 `0\.4\.0`功能\/候选基线，并执行第一轮对象退役审查/);
  assert.match(history, /当前列车 Phase 9：封板、发布并接替 accepted baseline，再执行第二轮版本窗口退役审查/);
  assert.match(history, /切换 `0\.5\.0-dev`，进入 Phase 5/);
  assert.match(history, /“退役审查”不等于“必须删除”/);
  assert.match(history, /F3C4不是“什么都不清理”/);
  assert.match(history, /KEEP ABSENT/);
  assert.match(history,
    /CONDITIONAL_GO_TO_F3C4_AGGREGATE_CLOSURE \/ IMPLEMENTATION_NOT_AUTHORIZED \/ REF_CLEANUP_NOT_AUTHORIZED/);
  assert.match(history, /这不是 `F3C_ROLLBACK_PASS`/);
  assert.doesNotMatch(history, /F3C_ROLLBACK_PASS \/.*CONFIRMED/);
  assert.match(historyIndex,
    /phase-4\.11-f3c4-aggregate-closure-discovery\.md#phase-4-11-decision/);
  assert.match(historyIndex, /不预先生成 F3C aggregate PASS或批量删除 refs/);
});
