# Task Plan: Architecture Contract History Retention

## Goal

审计并重构 `tests/architecture-contracts.test.js` 的历史版本耦合：稳定架构/文档 authority 继续由精确
治理测试保护；版本生命周期、专项 acceptance 和 immutable Release identity 进入各自合适的测试层，
避免每次发版继续膨胀同一个架构测试。

## Authorization

- 维护者要求继续补充文档治理，并指出 `architecture-contracts.test.js` 可能仍有历史文件残留。
- 本 scope 可修改 tests、DESIGN 的测试职责索引及仓库治理文档/活动 planning。
- 不修改 production runtime、Host ABI、trusted graph、Release ZIP inputs、已发布 tag/资产或
  rollback/`Latest` 状态。
- 若审计发现必须删除历史文档或改变 Release oracle 边界，先冻结证据与方案，不在本 gate 顺手执行。

## Next Step

本 scope 已完成，没有剩余实施。保持 v0.3.0 publication oracle 与精选 tombstone 不变；未来只有在
新的 baseline promotion + eviction gate 明确授权时，才依据届时 ROADMAP 角色旋转 published oracle。

## Gates

- [x] G0 — Discovery：恢复治理合同，盘点历史耦合与现有测试覆盖，冻结迁移边界。
- [x] G1 — Failing-first：增加职责边界 guard，证明架构测试不得继续冻结版本身份/专项 acceptance。
- [x] G2 — Refactor：迁移或收敛断言，同步 DESIGN reverse index 与治理说明。
- [x] G3 — Validation：focused/full suite、repository boundary、ZIP identity 与 diff 检查全绿。

## Stop Conditions

- 需要弱化 trusted source、Release identity、历史 tag/source/asset 或文档 authority 的安全断言。
- 需要删除唯一历史证据，而 Git/tag/Release/acceptance 没有等价恢复路径。
- 需要修改 ZIP allowlist、production 行为、Release/Latest/rollback 或外部状态。
- 工作树出现与本任务无关的用户改动且无法安全隔离。

## Status

G0–G3 PASS。architecture contracts 已版本无关；当前文档角色窗口由 repository lifecycle 动态治理；
旧 Release/Cloud planning 已退出当前树。v0.3.2 Release、rollback/`Latest` 与 Product Phase 状态未改变。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell 向 `rg` 原样传递 `tests/*.test.js`，Windows 将其视为非法路径 | 1 | 改用 `rg ... tests -g '*.test.js'`，不重复 shell glob |
| JS template literal 中为匹配 Markdown backtick 使用了错误的反斜杠组合，`node --check` 报 missing `)` | 1 | 改用普通字符串拼接构造两个动态正则，避免 template/backtick 转义歧义 |
