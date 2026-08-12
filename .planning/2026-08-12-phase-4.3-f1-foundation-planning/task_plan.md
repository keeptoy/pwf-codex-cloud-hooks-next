# Task Plan: Phase 4.3 F1A/F1B Implementation Planning Discovery

## Goal

把 Phase 4.1 已选择的安全架构与 Phase 4.2 已采纳的 gate 路线，翻译为 F1A/F1B 可审查、可测试、可停止的
实施计划：冻结 exact file/change inventory、依赖与 hash 传播、failing-first tests、local/Linux/no-live Cloud
验证、退出条件和原子 candidate 边界。

本 scope 是开工前勘测和施工图，不修改 production 或 machine contracts，也不授权 F1A implementation。

## Authorization

- 维护者已明确要求开始 Phase 4.3 探路；授权只读源码/contracts/tests/history 扫描、非生产验证与本 planning
  三文件更新，以冻结 F1A/F1B 实施计划。
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

- [x] P0 — Start authorization and evidence refresh：恢复 branch/worktree、Phase 4.1/4.2、
  ROADMAP、current contracts/source/tests 与 v0.3.5 rollback facts。
- [x] P1 — Exact file and authority map：划分 F1A/F1B 文件、producer/consumer/owner、字段 lifecycle 与 denied surface。
- [x] P2 — Dependency and atomicity map：画出 schema/runtime → bundle → manifest → installer/doctor → Release/hash 传播，
  判断独立 checkpoint 与完整 candidate transaction 的关系。
- [x] P3 — Failing-first and regression design：冻结每个 gate 最近边界测试、legacy equivalence、exact-key refusal、
  marker unreachable 与 partial takeover guards。
- [x] P4 — Platform validation and rollback design：冻结 Windows/local Linux/no-live Cloud、deterministic ZIP、
  candidate → v0.3.5 → candidate 双向 takeover/rollback 矩阵。
- [x] P5 — Exit/stop conditions and route freeze：输出 `GO / CONDITIONAL_GO / NO_GO`，决定是否请求 F1A implementation。
- [x] P6 — Closeout：将讨论结论回写完整；整理为 `docs/history/` Phase 4.3 摘要并停止。

## Next Step

Phase 4.3 已关闭并停止。维护者已明确暂停 F0；等待维护者以后另行授权 F0 development identity preparation，
不得自动进入 F0/F1A implementation。

## Current decision

`DISCOVERY_COMPLETE / CLOSEOUT_COMPLETE / F0_PAUSED_BY_MAINTAINER / IMPLEMENTATION_NOT_AUTHORIZED`

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
| 组合 `rg` 命令中的 PowerShell 双引号/转义被错误拆成多个路径 | 1 | 其他读取结果有效；后续按文件使用简单单引号 pattern 分段读取，不重复复杂嵌套转义 |
| `rg` 收到字面量 `*.md`，Windows 将其当作非法路径，导致一组并行读取返回 exit 1 | 1 | 有效 path inventory 已保留；后续用 `--glob '*.md'` 或显式目录，不向 `rg` 传 shell glob 位置参数 |
| 并行只读组中一个 `rg` pattern 无匹配返回 exit 1，使编排器把整组标为 failed | 1 | 已读取内容有效；后续对允许无匹配的 inventory 使用 PowerShell `Select-String` 或显式吞掉仅“无匹配”状态 |
| Phase 4.1 planning scope 的目录名首轮猜成 `2026-08-12-phase-4-discovery` | 1 | 用 `rg` 恢复真实目录 `2026-08-11-phase-4-discovery`；改读真实 authority，不创建替代文件 |
| 沙箱内 `npm test` 的 Node runner 对 16 个 test file 全部报 `spawn EPERM` | 1 | 分类为 Windows sandbox process limitation；获批后在沙箱外运行同一命令，112 pass、0 fail、12 个 POSIX case 诚实 SKIP |
| 一次 `rg` 只读命令的 PowerShell pattern 缺少字符串终止符 | 1 | 改用单引号 pattern 后读取 installer uninstall/backup 边界；未修改文件 |
| 大段 findings patch 的定位句使用“即使”，实际文件为“即便”而校验失败 | 1 | 读取文件尾确认原文，用精确上下文重试成功；无部分写入 |
| focused repository-boundary test 在 sandbox 内调用 Git 时返回 null status | 1 | 同组 architecture/contracts tests 已通过；沙箱外重跑原 repository test 8/8 PASS，不修改测试 |
