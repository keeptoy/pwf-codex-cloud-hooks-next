# Task Plan: Phase 4 F3B4 evidence closure

## Goal

按 Phase 4.9 冻结的最小方案，把已接受的 F3B2 smart 与 F3B3 autonomous Cloud evidence 汇总为完整 F3B lifecycle PASS，
同步 current authorities，并在 Phase 4.7 追加面向新人的 F3B0～F3B4 大白话导航；保留全部 validation refs，停止在 F3C 前。

## Next Step

等待维护者决定是否讨论并授权独立的 F3C rollback Discovery；在此之前不修改 refs、runtime、Release 或远端状态。

## Current Phase

F3B4 complete；stopped before F3C

## Phases

### F3B4-C0 — Closure preflight

**Status:** completed

- 复核 Phase 4.9 conditional-go、current acceptance/ROADMAP 和 Phase 4.7 现有 F3B0～F3B4 描述。
- 冻结本轮只做 aggregate evidence closure，不清理 refs、不进入 F3C。

### F3B4-C1 — Aggregate evidence closeout

**Status:** completed

- 在 Phase 4.9 追加 post-implementation status，记录 exact postflight、保留策略和 aggregate conclusion。
- 将 acceptance/ROADMAP 提升为完整 F3B PASS，同时保持 F3C `NOT_AUTHORIZED`。

### F3B4-C2 — Newcomer navigation

**Status:** completed

- 评估 Phase 4.7 已有技术说明是否足够。
- 只追加 F3B0～F3B4 的大白话职责对照，不复制 SHA、测试数字或 current status authority。

### F3B4-C3 — Verification and local handoff

**Status:** completed

- 运行 focused/full regression、importer/source syntax、deterministic candidate 和 markerless/residue postflight。
- 创建单一 local commit 后停止；等待维护者决定是否讨论 F3C Discovery。

## Authorization

- 已授权：Phase 4.9 所列 F3B4 Release-excluded closure implementation；Phase 4.7 新人大白话导航；planning/history/ROADMAP/
  acceptance/tests 更新；相称本地验证和本地 commit。
- 未授权：删除/移动 refs、重跑 Cloud、修改 production/runtime/contracts/manifest/bundle/installer/bootstrap/README/Release bytes、
  F3C rollback、push/PR/tag/Release/publication/promotion。

## Frozen boundaries

1. 十份 accepted evidence 不重写、不重演；F3B4 只做 aggregate reconciliation。
2. `F3B_LIVE_LIFECYCLE_PASS` 只覆盖当前 exact candidate 的 smart + autonomous live lifecycle，不外推 rollback 或 Release。
3. 全部 runtime-source 与 lifecycle refs 保留到 F3C PASS 和当前 0.4.0 Phase 9 instance 后再人工复核。
4. Phase 4.7 大白话只解释 gate 问题，不承重 current lifecycle、exact identity 或测试数字。
5. development tree 继续 markerless；candidate identity 必须完全不变。

## Stop Conditions

- Phase 4.9 的 ref、candidate、provenance、markerless 或 residue 条件出现漂移。
- 必须修改 production/schema/Release bytes、重跑 Cloud 或清理 refs才能宣告 aggregate PASS。
- 文档更新会把 F3C rollback、Release readiness 或通用 Cloud consent误写成已证明事实。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Focused Node test runner could not spawn workers inside the Windows sandbox (`spawn EPERM`) | 1 | Classified as an execution-sandbox limitation; rerun the same command with outer execution permission |
| Focused boundary guard no longer found the stable phrase `F1 foundation ... complete` after compressing the current-train line | 1 | Classified as current-status wording drift; restored an explicit F1 foundation completion clause without changing F3B4 semantics |
| Focused boundary guard no longer found the stable phrase `F3B0 Discovery 与 F3B1 no-live protocol materialization complete` after compressing the current-train line | 1 | Classified as current-status wording drift; restored the explicit F3B0/F3B1 completion clause and kept the regression guard |
| Focused boundary guard no longer found the stable phrase `F3B2 smart Cloud live PASS` after combining the smart/autonomous clauses | 1 | Classified as current-status wording drift; restored separate explicit F3B2 and F3B3 Cloud-live clauses and kept the regression guard |
| Focused boundary guard no longer found the full stable F3B3 lifecycle phrase after shortening it to `autonomous Cloud live PASS` | 1 | Restored the explicit `zero-ledger/tamper/disarm/re-attest/re-arm` scope so the status states what F3B3 actually proved |
| Final focused test file failed to parse because a literal `/` in the new Release-boundary regex was not escaped | 1 | Escaped the regex delimiter and reran the exact focused suite; no production behavior was involved |
| `git add` could not create `.git/index.lock` inside the workspace sandbox | 1 | Classified as repository-metadata write confinement; rerun the same scoped staging/commit operation with the established outer permission |

## Current status

`F3B_LIVE_LIFECYCLE_PASS / STOP_BEFORE_F3C / F3C_NOT_AUTHORIZED`
