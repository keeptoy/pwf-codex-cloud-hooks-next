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
- 维护者接受 bundle authority 推荐路线，并授权第一轮 I0 failing-first guards：允许只修改最近边界测试与
  planning，预先冻结 manifest→bundle integrity、严格 bundle validation、Phase 4 负向准入和 v0.3.3
  升级/回滚要求。
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
- [x] I0 — Failing-first guards：先写并执行供应链完整性、非法 bundle、Phase 4 负向准入及跨版本往返测试；
  预期只因尚未实施 I1/I2 而红，不得修改 production 使其变绿。
- [ ] I1 — Verified bundle consumers：未授权。
- [ ] I2 — Atomic mirror removal：未授权。
- [ ] I3 — Local/Linux/Cloud verification：未授权。

## Next Step

I0 failing-first guards 已闭合并按预期保持红灯；停止并等待维护者明确授权 I1。保持 production、machine
contracts、Release bytes 与 Phase 4 不变，不提前进入 I1/I2/I3。

## Decision

`I0_FAILING_FIRST_COMPLETE / I1_I2_I3_NOT_AUTHORIZED / PHASE4_NOT_AUTHORIZED`

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
| 尝试读取不存在的 `tests/helpers/published-release.js` | 1 | 确认 publication helpers 全部内联在 `published-release-oracles.test.js`，直接复用并扩展该文件 |
| I0 focused suite 返回非零 | 1 | 属于授权目标：新 guards 精确命中 I1/I2 尚未实现的缺口；既有测试与正常 v0.3.3 往返继续通过 |
