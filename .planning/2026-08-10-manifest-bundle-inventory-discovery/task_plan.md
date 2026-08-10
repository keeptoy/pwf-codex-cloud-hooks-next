# Task Plan: Manifest/Bundle Inventory Authority Discovery

## Goal

追溯 `upstream-manifest.json` 与 `contracts/runtime-bundle-v1.json` 重复 runtime inventory 的形成历史，明确
importer、installer、Release 与 tests 的实际消费关系，比较去重路线并冻结一个不触碰 Phase 4 行为的供应链
authority 迁移设计。

## Authorization

- 维护者授权先回顾历史并开展独立探路，分析如何解决 manifest/bundle inventory 重叠。
- 本轮只允许只读历史/代码/contract/test 审计，以及记录 Discovery 结论和后续实施计划。
- 维护者补充授权把已闭合的重叠根因、路线比较与方案选择整理为 Phase 3.8 历史 interlude，并补录
  Phase 3.7 的 programme metadata 退休原因；历史文字不得冒充 inventory 去重已经实施。
- 维护者要求继续把 Phase 3.7 改成大白话，补全“字段原用途 → 测试为何读取 → production 为何不读 →
  为何长期残留 → 安全意图由谁接替”的因果链。
- 本轮不授权修改 importer、installer、machine contracts、runtime、Release allowlist/hash、production dispatch，
  也不授权 seal、publication、push、Cloud 部署或 Phase 4 激活。

## Invariants

- v0.3.4-dev zero-hash 开发身份、v0.3.3 accepted 与 v0.3.2 fallback 角色不变。
- 四个 pristine upstream runtime、两个 owned runtime、installed inventory、Host ABI、trusted graph 与行为不变。
- 去重后的设计必须只有一个 runtime inventory machine authority，同时保留完整 integrity chain、unknown-drift
  fail-closed、self-contained importer、deterministic ZIP 与 installed-manifest 可审计性。
- Phase 4 的 attestation/nonce/opt-in v3 modes 以及 `ledger-summary.sh` 可达性不进入本轮设计。

## Gates

- [x] D0 — History：定位两份 inventory 的首次引入、演化和当时职责。
- [x] D1 — Consumer map：冻结 importer、installer、builder、doctor/repair 与 tests 的字段级读取/写入关系。
- [x] D2 — Options：比较 manifest authority、bundle authority、generated view 三条路线及迁移风险。
- [x] D3 — Decision：给出 GO/CONDITIONAL_GO/NO_GO、最小实施批次、failing-first guards、验证与回滚方案。
- [x] D4 — History promotion：补录 Phase 3.7，并将本次已闭合 Discovery 冻结为 Phase 3.8 决策 interlude。
- [x] D5 — Phase 3.7 clarification：用可读时间线补足 staged-admission ledger 的产生、消费和退休原因。

## Next Step

Discovery、历史编排与 Phase 3.7 事实性补写均已完成；等待维护者明确授权 I0～I3 implementation gate。
未获授权前保持 production、contracts、Release bytes 与 Phase 4 不变。

## Decision

`CONDITIONAL_GO_BUNDLE_AUTHORITY / IMPLEMENTATION_NOT_AUTHORIZED / PHASE4_NOT_AUTHORIZED`

进入实施的条件：

1. 维护者接受 bundle 为唯一 source/install runtime inventory authority；
2. 同意 manifest nested `managed_runtime` 升到 schema v2，并移除重复 arrays/package roots/installed-contract projections；
3. 先落 failing-first bundle integrity/unsafe inventory/upgrade-rollback guards，再改 consumer；
4. runtime 文件集合、installed layout、Host ABI、production dispatch 与 Phase 4 行为保持逐项相同。

## Stop Conditions

- 证据显示去重必须改变 installed layout、runtime dependency graph、Host ABI 或 Phase 4 行为。
- 当前两份 inventory 并非等价重复，而是分别承担不可合并的信任根职责。
- 历史 ref/consumer 无法确定，或路线选择需要维护者先决定兼容/升级支持窗口。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| `rg` pattern 以 `--bundle` 开头，被解析为未知 flag | 1 | 后续使用 `rg -e` 显式传入 pattern，不重复原命令 |
| Phase 3.7 focused tests 在受限 Windows sandbox 中因 `spawn EPERM` 未执行断言 | 1 | 在获准的沙箱外重跑同一只读命令，17/17 PASS |
