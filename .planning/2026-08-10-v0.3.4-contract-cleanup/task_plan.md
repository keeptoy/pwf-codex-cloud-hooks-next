# Task Plan: v0.3.4-dev Runtime-contract Metadata Cleanup

## Goal

建立不冒充已发布 v0.3.3 的下一兼容开发身份，从 runtime bundle 移除只表达历史 programme 的
`activation_phase` 与 `deferred_upstream_candidates`，并用当前 exact inventory guard 保留未授权能力不得准入。

## Authorization

- 维护者已授权按分析结论修改这两个字段，并明确要求不影响未来 Phase 9 路线。
- 本 gate 允许建立 `v0.3.4-dev` zero-hash Source/Candidate identity，修改 runtime bundle、关联 hash、最近
  contracts/Release/repository tests 与必要 lifecycle 文档。
- 本 gate 不授权删除 `ledger-summary.sh`、合并 manifest/bundle inventory、激活 Phase 4、seal、publication、
  push、Latest/rollback 或外部部署。
- 维护者补充授权恢复上一 completed planning scope，由 `.active_plan` 只控制活动选择；completed scope 的
  current-tree 删除节奏改由维护者明确决定。同时删除根级旧 ARCHITECTURE 快照的 tombstone 测试。

## Invariants

- v0.3.3 tag、ZIP/bootstrap、SHA、acceptance 与 Latest/accepted 角色保持不可变；v0.3.2 仍为 immediate fallback。
- production dispatch、installed inventory、Host ABI、trusted graph 与四个 pristine upstream runtime 不变。
- runtime bundle 只保留当前 source/build/install 语义；programme Phase 只由 ROADMAP 管理。
- `bundle.files` 的 exact id/source inventory 必须继续阻止任何 Phase 4+ script 未经显式 contract gate 准入。
- v0.3.4-dev bootstrap 使用 64 位 zero hash 并 fail closed；不构成 Release。

## Gates

- [x] M0 — Discovery：追溯两个字段由 `033a82b` Phase 1 staged-admission ledger 引入，确认 production 从未读取。
- [x] M1 — Successor identity：建立 v0.3.4-dev package/Release/bootstrap/acceptance/lifecycle 开发身份。
- [x] M2 — Failing-first guard：要求 programme 字段退出 bundle，并冻结当前 exact id/source inventory。
- [x] M3 — Contract cleanup：删除字段并更新 runtime-bundle integrity hash，不改变 inventory/bytes。
- [x] M4 — Verification：focused/full suite、import、compile/syntax、zero-hash bootstrap、deterministic ZIP 与 diff check。
- [x] M5 — Governance follow-up：恢复上一 scope、微调 planning retention policy、删除旧架构快照 tombstone 并验证。

## Next Step

本 gate 与 M5 follow-up 已完成；等待维护者决定提交节奏。后续 planning scope 的 current-tree 删除只按维护者
明确授权执行；不扩展到 ledger、manifest 去重或 Phase 4。

## Result

`V034_CONTRACT_METADATA_CLEANUP_PASS / CLOUD_PENDING / PHASE4_NOT_AUTHORIZED`

## Stop Conditions

- 需要改变 runtime 文件、依赖图、installer inventory、Host ABI、event dispatch 或 Phase 4 行为。
- v0.3.3 published oracle 因 current-tree 修改而无法从 immutable tag/source 独立通过。
- 新 identity 无法保持 zero-hash fail closed，或任何测试要求把本地开发 ZIP冒充已发布资产。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| failing-first contract test 按预期因 `deferred_upstream_candidates` 仍存在而失败 | 1 | 证明新 guard 命中目标字段后进入 M3 |
| 字段删除后的 contract test 按预期发现 upstream manifest 仍是旧 bundle hash | 1 | 计算新 SHA-256 并更新唯一 integrity reference |
| 并行 focused 中 Git/Python child 在受限 sandbox 返回 `status=null` | 1 | 未执行对应断言；改在沙箱外串行重跑原测试 |
| contracts/repository focused 发现两个 successor identity 硬编码未迁移 | 1 | bootstrap 断言改由 package version 派生；CHANGELOG 补 candidate acceptance 链接 |
| lifecycle authority guard 要求未发布 candidate 进入 published provenance 账本 | 1 | 纠正测试角色模型：provenance 只登记 accepted + fallback，未发布 candidate 必须留在账本外 |
| pending acceptance 用完整 PASS 标记描述“不得预填”，触发未验收保护 | 1 | 改用普通文字描述，pending 文件不再携带任何可误判为已通过的机器标记 |
