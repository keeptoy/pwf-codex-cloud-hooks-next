# Findings: v0.3.4-dev Runtime-contract Metadata Cleanup

## Inherited cleanup

- 前一低风险 current-tree gate 已恢复 DESIGN，退休 v0.3.2 本地 bootstrap/acceptance 与旧架构快照，修正
  candidate + accepted 文件窗口，并保持 v0.3.2 immutable fallback oracle；完整 96-test suite 0 FAIL。

## Root cause

- `activation_phase` 与 `deferred_upstream_candidates` 在 `033a82b` 的 Phase 1 contract-only gate 同时引入，
  用于表达 Phase 2/3 staged files 与 Phase 4/7/8 deferred candidates。
- 同 commit 的 `tests/contracts.test.js` 消费它们，以冻结当时的 rollout 计划；production importer 只读取
  bundle 的 `schema_version`、`upstream`、`package_root` 与 `files`，installer 使用 upstream manifest。
- Phase 2/3 完成后，hash/origin/dependencies 得到更新，但 programme annotations 没有退休；successor root
  `3234e4e` 将这套合同和测试一起继承到当前树。
- 当前安全意图应由 exact admitted inventory 表达：四个固定 id 必须对应四个固定 upstream source path；
  新文件进入 inventory 时必须显式修改 contract 和测试，而不是依赖历史 Phase 数字。

## Release consequence

- runtime bundle 是 v0.3.3 sealed ZIP 输入；修改它必须产生新 machine identity。选择兼容 patch 开发身份
  `v0.3.4-dev`，zero-hash bootstrap fail closed，不进入 Phase 4 或 publication。

## Phase 9 compatibility

- Phase 9 的职责是可复用 Release closure；它依赖精确 artifact contract、可重复构建、校验和、发布后下载复验
  与 Cloud gate，不依赖早期 Product Phase 数字注解。
- 本清理没有改变 runtime inventory、依赖图、Host ABI、production dispatch 或 Release gate 顺序；移除过时
  programme metadata 不会阻断未来 Phase 9，反而避免 Release contract 携带已经失真的早期 rollout 计划。
- 因此无需为本次局部清理再开一轮广泛 Discovery；未来进入 Phase 9 时仍按当时证据独立冻结退出条件。

## Planning retention follow-up

- `.planning/.active_plan` 只选择当前注入的 scope，本身不会删除目录。
- 自动轮换语义来自 repository guard 对“只能存在 active scope”的断言，以及治理指南要求激活新 scope 时
  从 current tree 移除 completed scope；此前据此删除了 `2026-08-10-current-tree-cleanup` 三份记录。
- 维护者需要自行控制删除节奏，且旧 findings 保存 ledger、programme metadata、inventory 去重三个后续判断
  的边界。因此改为允许完整 inactive scopes 留在 current tree；活动性仍只有 `.active_plan` 一个权威。
- 根级旧 ARCHITECTURE 快照仍保持已删除状态，但不再用精选 tombstone 测试永久禁止同类文件名。
