# Task Plan: Phase 4 F3B4 evidence closure Discovery

## Goal

审计 F3B2 smart 与 F3B3 autonomous 的真实 Cloud evidence、validation refs、candidate 身份和仓库残留，冻结 F3B4 evidence closure 的最小实施范围、保留策略、退出条件与停止条件；本轮只做 Discovery，不实施收口、不进入 F3C。

## Next Step

等待维护者另行讨论并授权 F3B4 evidence closure implementation。下一 gate 只能按 Phase 4.9 的最小 docs/planning/tests
方案汇总 aggregate PASS；不得删除 refs、重跑 Cloud、进入 F3C 或修改 Release bytes。

## Current Phase

F3B4 Discovery complete; stopped before closure implementation/F3C

## Phases

### F3B4-D0 — Authority and evidence recovery

**Status:** completed

- 恢复 README/ARCHITECTURE/DESIGN/ROADMAP、活动计划和 F3B2/F3B3 专项证据。
- 冻结本轮授权边界：Discovery/docs/tests/local commit only。

### F3B4-D1 — Exact evidence and ref inventory

**Status:** completed

- 核对 smart 四份、autonomous 六份 evidence 的 stage、runtime source、workspace HEAD、Host/probe/doctor/final exit facts。
- 核对 local validation refs、parent/path/state 关系和 tamper ref absence。

### F3B4-D2 — Markerless, residue and candidate audit

**Status:** completed

- 证明当前 development tree markerless，且没有 validation state、临时脚本、snapshot/cache 或第二份 inventory authority 泄漏。
- 双构建并核对 candidate identity 未漂移。

### F3B4-D3 — Provenance and retention decision

**Status:** completed

- 区分 Git/runtime/candidate/Host/probe/doctor/evidence-record 各自权威。
- 冻结 validation refs 与 evidence 的保留期、删除触发条件和 F3C 前置关系。

### F3B4-D4 — Phase 4.9 record and local handoff

**Status:** completed

- 新建 Phase 4.9 历史摘要，最小同步 ROADMAP、acceptance、history index 和相关静态断言。
- 运行 focused/full regression、deterministic candidate 与 whitespace checks；创建单一 local commit 后停止。

## Authorization

- 已授权：F3B4 evidence-closure mini-Discovery、只读仓库/refs 审计、Release-excluded planning/history/ROADMAP/acceptance/tests 更新、相称本地验证和本地 commit。
- 未授权：F3B4 closure implementation、删除/移动 refs、修改 production/runtime/contracts/manifest/bundle/installer/bootstrap/README/Release bytes、运行新的 Cloud lifecycle、F3C rollback、push/PR/tag/Release/publication/promotion。

## Frozen boundaries

1. F3B2/F3B3 已接受证据保持历史事实，不因本轮 Discovery 改写或重演。
2. 不把 opaque Cloud task ID 猜写进 evidence；缺少平台导出的 ID 时必须明确记录其 authority 状态。
3. current development tree 必须保持 markerless，candidate 必须与已接受 development identity 完全一致。
4. validation refs 在本轮只读；任何移动、删除或合并都属于后续独立授权。
5. F3B4 aggregate PASS、F3C GO 或 Release readiness 均不得由 Discovery 自动宣告。

## Stop Conditions

- smart/autonomous evidence 的 exact identity、stage relation 或 final status 无法由现有仓库与维护者回传证据闭合。
- 当前 development tree 出现 machine state、unknown residue、第二份 authority 或 candidate drift。
- 需要新增 Cloud task、修改 machine schema/production/Release bytes 或移动 refs 才能完成结论。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell treated silent `git merge-base --is-ancestor` success as a false pipeline object | 1 | Rechecked the explicit merge base and graph; F3B2 source is the exact ancestor of F3B3 source |
| Initial Git Bash task-blob hash allowed MSYS path conversion and produced empty-stream hashes | 1 | Reran with `MSYS_NO_PATHCONV=1` and `pipefail`; all three exact task SHA-256 values matched |
| Focused Node test runner could not spawn workers inside the Windows sandbox (`spawn EPERM`) | 1 | Reran the same command with the required outer execution permission; 21/21 passed |

## Current status

`CONDITIONAL_GO_TO_F3B4_EVIDENCE_CLOSURE / IMPLEMENTATION_NOT_AUTHORIZED / F3C_NOT_AUTHORIZED`
