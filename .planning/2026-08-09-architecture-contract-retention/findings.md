# Findings: Architecture Contract History Retention

## Initial Evidence

- `DESIGN.md` 把 `architecture-contracts.test.js` 定义为跨平台静态治理测试，主要保护文档 authority、稳定
  锚点、Architecture/Design 分工和 handoff 治理。
- 当前文件前半部分确实保护稳定架构与文档职责；但单个
  `change history, programme intent, current action, and immutable evidence...` case 同时冻结 CHANGELOG 的
  v0.3.0-beta.2～v0.3.2 章节、ROADMAP 当前版本角色、BASELINE_PROVENANCE 精确 commit/hash，以及
  `docs/v0.3.2-cloud-hard-acceptance.md` 的具体 R4/R5 脚本和最终结果。
- 这不是单纯的无用文件名残留：部分断言仍有安全价值，但放错了测试层。它会让稳定架构测试随每个版本、
  acceptance 和 Cloud runbook 一起增长，违反“稳定架构”与“历史/lifecycle”分层治理目标。
- 已有 `published-release-oracles.test.js` 和 `repository-boundary.test.js`，需先核对其覆盖再迁移，避免为了
  文件整洁而丢掉 immutable identity、当前角色窗口或退役路径隔离。

## Initial Classification

- 应留在 architecture contracts：文档唯一 authority、宏观文档禁止复制当前状态、Architecture/Design
  职责、稳定锚点、handoff 不成为第二份 runbook。
- 候选迁出：精确版本号、commit/SHA、v0.3.2 acceptance 脚本 marker、某次 Cloud gate 结果。
- 需谨慎保留但可能改为通用断言：CHANGELOG 只记 delta、ROADMAP 只记 lifecycle、provenance 只记
  immutable identity、acceptance 不授权 promotion、当前树仅保留版本窗口。

## Existing Coverage Audit

- `published-release-oracles.test.js` 已独立验证 v0.3.2、v0.3.1 和 v0.3.0 的 tag/source、重建 ZIP 与
  bootstrap SHA；因此 architecture test 再逐个匹配相同 commit/hash 是重复覆盖，而不是独立架构证据。
- `repository-boundary.test.js` 已保护 exact trusted/Release zones、唯一 active planning、docs/acceptance
  不进入 ZIP、candidate + accepted bootstrap 窗口与冷历史不进入 runtime dispatch。
- `repository-governance-guide.md` 明确要求：architecture tests 保护规则；当前角色窗口由 lifecycle test
  保护；历史 oracle 只重跑仍承担角色的 baseline，更早版本交给 immutable refs/Release 和周期性审计。
- 当前 `published-release-oracles.test.js` 仍每次重建 v0.3.0，已超出 v0.3.2 candidate + v0.3.1 accepted
  角色窗口。这是与 architecture 文件同源但更广的膨胀信号；是否本 gate 同步旋转，需要以不丢失
  BASELINE_PROVENANCE 的 immutable v0.3.0/beta.2 链为前提。
- `repository-boundary.test.js` 中旧路径的负断言属于 tombstone（防止退役原型重新进入 HEAD），不等于
  仍依赖历史文件；但逐项名字列表也应保持精选，不能随每次版本永久追加。

## Proposed Responsibility Split

1. `architecture-contracts.test.js` 只保留稳定 authority/architecture/design 规则，不读取某个版本
   acceptance，不冻结版本号、commit 或资产 SHA。
2. `repository-boundary.test.js` 由 ROADMAP 声明的 candidate/accepted 角色派生当前 bootstrap 与
   acceptance 窗口，避免硬编码“永远是 v0.3.1 + v0.3.2”。
3. 新增窄职责的 `documentation-lifecycle.test.js`，保护 CHANGELOG/ROADMAP/PROVENANCE/当前 acceptance
   的分工和 promotion 禁区；版本专项结果只作为当前角色窗口 oracle，角色旋转时整体替换，不累计。
4. `published-release-oracles.test.js` 只保留当前 candidate + accepted 两个可重建身份；v0.3.0/beta.2
   继续由 provenance 的 immutable refs/Release 索引恢复，不在每次本地 suite 重跑旧实现。

## Growth Evidence

- `architecture-contracts.test.js` 的 Git history 显示它在文档地图、provenance、history retention、Release
  publication、Cloud channel 和 acceptance closure 的每个治理提交中持续增长；这证明它已成为多个
  lifecycle gate 的汇总落点，而不是稳定架构合同。
- 当前 bootstrap 的 ZIP SHA 可从当前角色文件动态读取，不需要在 architecture test 再复制 64 位常量。
- CHANGELOG 保留 v0.3.0/beta.2 的紧凑摘要与 immutable links 符合 warm 层策略；问题不在这些摘要存在，
  而在每次默认测试继续重建旧实现、以及稳定架构测试逐字段复述它们。

## G0 Decision

- 结论 `GO`：删除 architecture test 中整段版本/lifecycle/acceptance 复述，把通用 authority 与当前角色
  窗口检查移入 `repository-boundary.test.js`；不删除 provenance、CHANGELOG 或当前两个 acceptance。
- 当前 candidate/accepted bootstrap 与 acceptance 文件集合从 ROADMAP 角色表动态派生，并交叉校验
  package identity；这样 promotion 时旋转角色即可，不再修改稳定架构测试。
- v0.3.0 publication oracle 暂不在本 gate 删除：ROADMAP 仍把它列入回退证据链，是否停止每次默认重建
  属于未来 promotion + eviction 事务，不能借本次 architecture cleanup 隐式降低审计范围。
- 精选旧路径 tombstone 保持原位；它们保护“旧原型不得回流”，与仍保留旧文件是两回事。

## Final Result

- `architecture-contracts.test.js` 从 377 行降至 274 行；文件内具体 v0.3.x、40/64 位发布 identity、版本
  acceptance 路径与 Release entry 总数均为零。
- repository lifecycle 不再硬编码当前两个版本的 bootstrap/acceptance 清单，而是读取 ROADMAP 唯一
  candidate/accepted 角色并与 package identity 交叉校验；超出窗口的同类文件会自动报错。
- 安全覆盖没有删除：exact trusted/Release zones、current acceptance 的双通道/promotion 禁区、provenance
  冷历史隔离、publication oracle 和精选 tombstone 继续由各自层级保护。
- 这次不旋转 v0.3.0 publication oracle，因为它仍在 ROADMAP 回退证据链中；该决策留给未来完整的
  promotion + eviction 事务，避免普通文档整理隐式改变审计强度。
