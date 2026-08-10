# Findings: v0.3.3-dev Pristine Catch-up Runtime

## Inherited evidence

- Phase 1 的四项 overlay 只修改 upstream catch-up CLI 的 session selection、runtime inference、planning guard
  与 CLI rendering；Phase 2 owned wrapper 从首次激活起即不调用这些分支。
- Managed/pristine pinned source 的四个 helper roots 及 15-helper transitive closure 相同，与 patched symbols
  和 `main()` 的交集为空。
- Phase 3 private snapshot 属于 plan invocation strategy，只是避免新增第二组 plan overlay；catch-up overlay
  的替代机制是 Phase 2 validated/frozen transcript、explicit runtime/project state 与 owned renderer。
- 动态加载完整 module 会执行 `configure_utf8_stdio()` 和 optional `orjson` import；Route B 必须测试该真实
  import-time surface，不能宣称只加载四个函数字节。

## Selected route

Route B：保留 pinned pristine full `session-catchup.py`，显式冻结 owned helper allowlist/closure；删除 current
patcher、active overlay ledger 与 patched manifest chain。Published v0.3.2 的 overlay identity只保留在 cold
provenance 与 immutable refs，不在 current tree 保存可执行博物馆副本。

## Closed checks

- candidate/accepted 两席窗口已冻结为 v0.3.3-dev Source/Candidate + published v0.3.2 accepted；新 bootstrap
  保持 64 位 zero hash 并 fail closed，未改变发布角色。
- importer contract 已在原 contract family 内统一四项 `upstream_pristine`，拒绝 non-pristine origin、managed
  hash 分叉和任何 overlay declaration，不需要扩大 Host ABI 或 schema migration。
- `skill-patch.test.js` 的通用 bootstrap/global-Skill 安全断言已迁入 `bootstrap.test.js`；patch-specific 行为由
  importer fail-closed 与新的 pristine helper boundary 取代，不保留可执行历史 fixture。
