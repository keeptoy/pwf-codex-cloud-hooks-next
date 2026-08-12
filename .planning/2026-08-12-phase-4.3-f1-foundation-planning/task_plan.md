# Task Plan: Phase 4.3 F1A/F1B Implementation Planning Discovery

## Goal

把 Phase 4.1 已选择的安全架构与 Phase 4.2 已采纳的 gate 路线，翻译为 F1A/F1B 可审查、可测试、可停止的
实施计划：冻结 exact file/change inventory、依赖与 hash 传播、failing-first tests、local/Linux/no-live Cloud
验证、退出条件和原子 candidate 边界。

本 scope 是开工前勘测和施工图，不修改 production 或 machine contracts，也不授权 F1A implementation。

## Authorization

- 维护者本轮只授权创建 Phase 4.3 占位并明确定位；尚未授权开始 F1A/F1B 证据扫描或方案冻结。
- 下一轮维护者明确要求“开始 Phase 4.3/F1A-F1B 探路”后，才允许只读源码/contracts/tests/history 扫描、
  非生产验证与本 planning 三文件更新。
- 当前没有 production、machine-contract rotation、tests、package identity、Release inputs、Cloud 写入、部署、
  installed-state mutation 或远端变更授权。

## Phase lineage

- **Phase 4.1 是架构探路：**确定采用什么安全模型；冻结 hybrid owned-boundary、versioned managed opt-in、
  legacy default、state/tamper/rollback 边界与 conditional go。
- **Phase 4.2 是路线治理：**确定按哪些 gate 前进；采纳
  `F1A → F1B → F2A → F2B → F3`，并校准 Phase 5～9 programme。
- **Phase 4.3 是实施规划探路：**确定 F1A/F1B 到底怎么落地；冻结文件、依赖、测试、原子闭合、退出条件和
  停止条件。

大白话：4.1 选建筑方案，4.2 排施工顺序，4.3 做开工前勘测和施工图。4.3 讨论结束仍不自动开工；维护者
需要另行授权 F1A implementation。

## Gates

- [ ] P0 — Start authorization and evidence refresh：维护者明确启动探路后，恢复 branch/worktree、Phase 4.1/4.2、
  ROADMAP、current contracts/source/tests 与 v0.3.5 rollback facts。
- [ ] P1 — Exact file and authority map：划分 F1A/F1B 文件、producer/consumer/owner、字段 lifecycle 与 denied surface。
- [ ] P2 — Dependency and atomicity map：画出 schema/runtime → bundle → manifest → installer/doctor → Release/hash 传播，
  判断独立 checkpoint 与完整 candidate transaction 的关系。
- [ ] P3 — Failing-first and regression design：冻结每个 gate 最近边界测试、legacy equivalence、exact-key refusal、
  marker unreachable 与 partial takeover guards。
- [ ] P4 — Platform validation and rollback design：冻结 Windows/local Linux/no-live Cloud、deterministic ZIP、
  candidate → v0.3.5 → candidate 双向 takeover/rollback 矩阵。
- [ ] P5 — Exit/stop conditions and route freeze：输出 `GO / CONDITIONAL_GO / NO_GO`，决定是否请求 F1A implementation。
- [ ] P6 — Closeout：将讨论结论回写完整；闭合后再整理为 `docs/history/` Phase 4.3 摘要并停止。

## Next Step

等待维护者下一轮明确要求开始 Phase 4.3 F1A/F1B 实施规划探路。在此之前只保留本占位，不执行 P0，不扫描
源码/contracts，不修改 production、tests、package/Release identity 或 installed state。

## Current decision

`RESERVED / NOT_STARTED / IMPLEMENTATION_NOT_AUTHORIZED`

## Invariants

- 继承 ROADMAP 的 `F1A → F1B → F2A → F2B → F3`，本轮只研究 F1A/F1B。
- v0.3.5 legacy 默认、两个 managed events、adapter-only policy、pristine Skill 与 owned runtime trusted graph 不变。
- F1A/F1B 是独立 review/test/stop checkpoints；最终 candidate 必须使 contract、代码、inventory、mode 与 hash 原子自洽。
- 不激活 smart/autonomous/gated，不写真实 workspace marker、nonce、attestation 或 ledger。
- F2 activation/disarm 与 F3 Cloud/rollback 仅作为接口和兼容约束，不在 Phase 4.3 实施。
- Phase 4.3 结论不会自动授权 F1A；package identity 也不能仅因 planning 存在而轮转。

## Questions to resolve

1. F1A 精确修改哪些 manifest、bundle/Release contracts、importer、installer、builder 与 tests？
2. F1B 精确修改哪些 request/result schemas、adapter、owned-plan 与 tests？
3. 哪些 bytes/hash/inventory 依赖使 F1A 不能形成独立可发布树，最终原子 transaction 如何闭合？
4. 如何证明 v2 exact-key 拒绝 retired overlay fields、denied-source guard 继续有效？
5. 如何证明 `allowed_profiles=[legacy]`、marker 不读取/不可达、Host output 与 v0.3.5 等价？
6. Windows、Linux、no-live Cloud 分别承担哪些证据，双向 takeover/rollback 如何执行？
7. 每个 gate 的进入、退出、停止条件是什么，何时才允许冻结 `0.4.0-alpha.N` identity？

## Stop Conditions

- 未获得维护者开始探路授权。
- 发现路线要求改变 Phase 4.1 trusted graph、legacy default、workspace write policy 或 Host event set。
- F1A/F1B contract shape 出现两条以上代价明显不同的安全路线，需要维护者选择。
- v0.3.5/branch/upstream/Host/Cloud 基线变化，使 Phase 4.1/4.2 证据失效。
- 需要 production、Release、live Cloud、installed state、真实用户数据或远端 mutation 才能继续。
- 无法同时满足独立 review checkpoint 与最终 contract/hash 原子闭合。

## Errors encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 在旧 Phase 4 Discovery scope 增加自定义 Phase 4.3 markdown，被 planning lifecycle test 拒绝 | 1 | 改建本标准三文件 scope；Phase 4.3 的持续结论写入 findings/progress，闭合后才建立 history 摘要 |
