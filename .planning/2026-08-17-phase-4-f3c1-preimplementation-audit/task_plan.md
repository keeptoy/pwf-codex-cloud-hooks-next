# Task Plan: Phase 4 F3C1 pre-implementation HEAD audit

## Goal

以当前 exact HEAD 重新审计 Phase 4.10 的 F3C1 前提：installer ownership、installed-state transition、v0.3.5 accepted
行为、current runtime/profile admission、Release identities、F3B disarm refs 与现有 tests 是否仍一致；输出 GO/ADJUST/STOP，
但不实施 F3C1、不执行 rollback/install/Cloud、不创建或移动 refs。

## Next Step

等待维护者另行授权 F3C1 protocol/no-live materialization；下一 gate 必须先新增 direct old-over-current no-backup/no-mutation
test，再物化 rollback evidence helper/operator protocol，仍不得自动进入 live Cloud。

## Current Phase

F3C1-A0 evidence recovery and scope freeze

## Phases

### F3C1-A0 — Evidence recovery and scope freeze

**Status:** completed

- 恢复当前 HEAD、clean worktree、活动计划与 Phase 4.6～4.10 继承关系。
- 冻结 read-only audit 边界和停止条件。

### F3C1-A1 — Contract and installer transition audit

**Status:** completed

- 复核 current/accepted schema、ownership、uninstall/backup 与 forward transition。
- 检查 direct downgrade refusal 是否已有代码/测试证据，识别缺口。

### F3C1-A2 — Runtime, refs and evidence audit

**Status:** completed

- 复核 smart/autonomous disarm refs、legacy behavior、dormant-token revival 与 evidence helper seam。
- 复核 operator/Cloud stage 输入是否能由当前代码事实支撑。

### F3C1-A3 — Decision and handoff

**Status:** completed

- 将发现写入 planning；必要时只补 Phase 4.10 的 pre-implementation audit 尾注和静态守卫。
- 运行相称只读验证，本地提交后停止；不进入 F3C1 implementation。

## Authorization

- 已授权：当前 HEAD 的 read-only 源码/contracts/tests/ref 审计；planning/必要的历史尾注与静态守卫；相称测试；本地 commit。
- 未授权：F3C1 protocol/operator/helper 实施；真实 rollback/install/uninstall；Cloud task；workspace machine state；ref mutation；
  production/contracts/manifest/bundle/installer/bootstrap/README/Release bytes 修改；push/PR/tag/Release/publication/promotion。

## Stop Conditions

- 当前代码事实与 Phase 4.10 的 supported transition 冲突。
- 安全验证需要先修改 production/installer/contracts 或执行真实 rollback。
- v0.3.5/public asset、current candidate、F3B refs 或 worktree identity 漂移。
- 需要扩大 installer workspace ownership、允许 direct downgrade 或把 cache/口述当证据。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|

## Current status

`F3C1_PREIMPLEMENTATION_HEAD_AUDIT_PASS / PHASE_4_10_ROUTE_UNCHANGED / DIRECT_DOWNGRADE_TEST_REQUIRED / IMPLEMENTATION_NOT_AUTHORIZED`
