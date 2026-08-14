# Task Plan: Phase 4 F3B0 live preflight Discovery

## Goal

在不创建真实 opt-in state、不运行 live activation 的前提下，复核 F3B 在 Codex Cloud 中的实际启动、checkout、
cache/Resume 与权限边界；冻结 runtime source identity、workspace lifecycle identity、验证分支拓扑、Fresh/Resume
定义、smart/autonomous 隔离、tamper/disarm/re-arm 证据和失败分流，并把结论写入 Phase 4.7 历史里程碑。

## Authorization

- Maintainer authorization: 先讨论 F3B 是否需要小型 Discovery，讨论完成后新建 Phase 4.7 方案计划。
- Authorized: 只读恢复仓库/官方事实；设计 F3B0～F3B4 子 gate；同步 history index、programme/acceptance 摘要、
  当前 planning；相称静态测试；本地 commit。
- Not authorized: 创建或提交真实 `.mode`、`.nonce`、`.attestation`、`.pwf-codex-managed`、ledger；执行 F3B
  live Cloud、F3C rollback；修改 production/runtime/contracts/Release inventory；push、PR、tag、Release、seal、
  promotion 或 Cloud 环境写操作。

## Next Step

完成 F3B0 证据复核与路线冻结，把结论写入 `docs/history/phase-4.7-*`；验证并本地 commit 后停止，等待维护者
决定是否授权 F3B1 protocol materialization/no-live dry run。

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| D0 Evidence recovery | completed | 根权威、F3/F3A、runbook、acceptance 与 Cloud 官方事实完成复核 |
| D1 Live route comparison | completed | 双身份、分支拓扑、Fresh/Resume、profile/negative/cleanup matrix 与失败分流冻结 |
| D2 Phase 4.7 writeback | completed | 新历史里程碑、index、ROADMAP/acceptance 当前状态与 lifecycle ledger 一致 |
| D3 Verification | completed | focused governance、full regression 与 `git diff --check` 通过或诚实分类 |
| D4 Local commit and stop | completed | 单一文档/governance commit 完成；停止在真实 F3B 前 |

## Stop Conditions

- 方案需要用 Cloud cache、未提交 worktree、branch 名或模型声明充当正确性/授权边界；
- 无法在第一次 agent 启动前安装 exact candidate，或无法在 agent phase 核对 workspace exact HEAD；
- 需要让 Cloud 模型创建 commit/PR、修复测试、写 opt-in state 或移动验证 ref；
- 需要扩大 Host ABI、trusted graph、managed writer、runtime bundle 或 Release surface；
- smart 未独立通过却需要继续 autonomous，或任何一步没有明确最终进程 exit code；
- 出现官方 lifecycle、当前代码或 F3A 证据相冲突的新事实。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Focused F3 test could not spawn Python/Git/Bash children in the restricted Windows runner (`status=null`) | 1 | Classified as the established local harness limitation; keep the exact test for Linux/full permitted execution and run repository-only assertions separately. |
| New Phase 4.7 static assertion omitted the document's “因本结论” wording | 1 | Corrected the assertion without changing the design or weakening its no-authorization boundary. |
| ROADMAP directly linked the new history file and tripped the single-history-entrance guard | 1 | Kept the programme summary but routed historical navigation through README's documentation map, preserving one macro entrance. |
| First full regression found a second `ROADMAP.md -> README.md#documentation-map` fragment | 1 | Kept the required single linked entrance at ROADMAP's existing authority section and changed the later Phase 4.7 mention to plain text. |

## Current status

`F3B0_DISCOVERY_COMPLETE / CONDITIONAL_GO_TO_F3B1_PROTOCOL_MATERIALIZATION / REAL_STATE_ABSENT / F3B1_NOT_AUTHORIZED / F3C_NOT_AUTHORIZED`
