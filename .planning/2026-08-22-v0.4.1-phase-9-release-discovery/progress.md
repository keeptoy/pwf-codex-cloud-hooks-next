# Progress: v0.4.1 Phase 9 Release Discovery

## Session: 2026-08-22

### Phase 1: Release Discovery

- **Status:** complete
- 维护者决定先发布 `v0.4.1`，历史兼容精简移交下一开发列车评估。
- planning-with-files 已确认上一 `v0.4.1` local/Cloud gate 账本完整关闭。
- 创建本 Release Discovery 账本并切换 `.planning/.active_plan`。
- 当前只授权只读 Discovery 与路线提案；未进入 materialization、seal、Cloud、tag 或 Release。
- 恢复 `v0.4.0` P9-A～P9-F 的实际 gate/evidence 顺序，确认 Source/Candidate、publication audit、Published Release
  Cloud 与 Latest promotion 必须逐层分离。
- 审计 entry identity：local/remote HEAD 均为 `5c88210…`，无 tag；source 仍是 `0.4.1-dev`，bootstrap 为正确的
  zero-hash fail-closed 状态。
- 初步判断 v0.4.1 P9-A 应收窄为 patch stable identity/pre-seal 对账，不能机械复制 v0.4.0 的大规模 dev→stable 迁移。
- 完成 `0.4.1-dev` 全仓 identity scan：production/runtime 无版本硬编码迁移需求；P9-A 主要是 package、Release
  contract/hash edge、bootstrap/acceptance rename、CHANGELOG/ROADMAP 与当前角色测试的原子传播。
- 冻结 acceptance 历史语义：已执行 Cloud source/hash/installer observation 保持原样；stable 顶层身份采用 rename-not-duplicate。
- 对比 `6c1dd52…HEAD` 与 Release inventory/external asset，交集为零；当前治理提交没有改变已验收candidate bytes。
- 冻结 P9-A最小范围与P9-B～P9-F顺序；结论为conditional-go到P9-A，但materialization及所有后继gate仍未授权。

## Test Results

| Check | Result | Status |
|---|---|---|
| entry worktree | clean; local `0.4.1` equals `origin/0.4.1` | PASS |
| release identity preflight | HEAD `5c88210…`; no tag; `0.4.1-dev`; zero-hash bootstrap | EXPECTED / PASS |
| post-Cloud changed-path/Release intersection | zero Release entries / zero external assets | PASS |
| Release contract integrity edge | source and manifest both `4f89e5b…ab6e0` | PASS |
| repository-boundary after active-plan switch | 14 pass / 0 fail / 0 skip | PASS |

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| composite identity/doc scan returned exit 1 after printing valid matches | 1 | Classified as `rg` no-match exit semantics in a multi-query read; no repository assertion or mutation depended on the aggregate exit code |
| PowerShell static SHA helper methods unavailable | 1 | Switched to `Get-FileHash`; verified exact current contract SHA without repeating the failed method |

## Current Status

`CONDITIONAL_GO_TO_V0_4_1_P9_A_PRE_SEAL_MATERIALIZATION / P9_A_NOT_AUTHORIZED / RELEASE_NOT_AUTHORIZED`
