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
- 维护者在 I0 闭合后授权继续 I1：允许修改 importer、installer、配套测试，以及同步 importer integrity hash；
  两个 consumer 必须先验证 manifest→bundle 原始 SHA，再严格解析并消费 bundle。
- 维护者在 I1 闭合并明确停在 I2 前后要求“继续”，据此授权 I2 atomic mirror removal：允许把 nested
  `managed_runtime` 升到 schema 2、删除已由 bundle 独占的 mirrors，并同步 consumer、tests、integrity hash、
  稳定 authority 文档和 Unreleased changelog。
- 本轮仍不授权 I3、runtime、Release allowlist、production dispatch、seal、publication、push、Cloud 部署或 Phase 4 激活。

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
- [x] I1 — Verified bundle consumers：实现 manifest→bundle raw SHA、严格 bundle validator 与 importer/installer
  单一 inventory consumption；保持 manifest schema 1/mirrors 供 I2 原子删除。
- [x] I2 — Atomic mirror removal：nested schema 2、mirror 删除、consumer/tests/docs/hash 同步并完成本地回归。
- [ ] I3 — Local/Linux/Cloud verification：未授权。

## Next Step

I2 已闭合。停止并等待 I3 授权；不得把本地全量回归冒充 Linux/Cloud supply-chain verification，
也不提前进入 Phase 4、seal、publication 或 push。

## Decision

`I2_ATOMIC_MIRROR_REMOVAL_COMPLETE / I3_NOT_AUTHORIZED / PHASE4_NOT_AUTHORIZED`

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
| I1 Node 回归在受限 Windows sandbox 中因 `spawn EPERM` 未执行断言 | 1 | 在获准的沙箱外重跑同一命令；focused 47 PASS/1 SKIP，全量非 I2 suite 110 PASS/12 SKIP |
| I2 旧字段扫描把多个含括号 pattern 拼成一个 `rg` 正则，触发 `unopened group` | 1 | 改用多个 `rg -e` 固定 pattern 分别扫描，不重复原命令；manifest JSON 解析本身已通过 |
| I2 固定 pattern 扫描中的 Python 双引号被 PowerShell 拆成路径参数 | 2 | 移除该脆弱 pattern，分别扫描 `schema_version` 与已退休字段；已有命中仅为 schema-2/负向测试 |
| I2 focused 中 unsafe bundle reference 的产品拒绝正确，但 importer 错误标签从 `runtime bundle` 漂成 `runtime_bundle` | 1 | 分类为诊断文本回归；contract ref validator 使用人类可读 label，保留既有 domain error 合同后重跑 |
