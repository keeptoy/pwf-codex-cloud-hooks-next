# Task Plan: v0.3.2 Promotion, Historical Cleanup, and Successor Handoff

## Goal

按三个互不混用的 gate 完成生命周期轮换：P1 只把已完成 Cloud hard acceptance 的 v0.3.2 晋级为
accepted rollback/GitHub `Latest`；P2 对 v0.3.1 及同类隐藏历史残留做全仓 Discovery 后实施获批清退；
P3 另开新 scope，才建立后继开发列车与 `v0.3.3-dev` machine identity。

## Authorization

- 维护者已经明确授权 P1：把 GitHub `Latest`/production rollback baseline 从 v0.3.1 晋级到 v0.3.2，
  并同步相应 acceptance 与 lifecycle authority；不得重发或改写任何 tag/asset/SHA。
- 维护者把 P2 定义为独立深度清理：目标是归档 v0.3.1，并扫描 `architecture-contracts.test.js` 一类隐藏
  历史残留。P2 当前先授权全仓只读 inventory、分类与方案冻结；具体删除集合在 Discovery 后另行 GO。
- P3 只记录为后续独立 gate；当前不修改 package、Release contract、bootstrap 或 `v0.3.3-dev` identity，
  不 seal、不发布、不部署新版本。
- 已完成的 `2026-08-09-architecture-contract-retention` 三文件由 immutable commit `d4cc3b5` 保存，P2
  可读取并吸收有效结论，但不作为第二个长期 `.planning` scope 重新进入当前树。

## Next Step

执行 P1：在已通过公开资产 preflight 的前提下仅移动 GitHub `Latest` pointer，立即重新查询；成功后
把 promotion evidence 写入 v0.3.2 acceptance，并同步 ROADMAP/provenance/CHANGELOG 的当前角色，
随后运行 lifecycle、publication、ZIP identity 与完整回归。P1 关闭后才进入 P2 全仓只读 inventory。

## Gates

- [x] D0 — Discovery：全仓库 inventory、外部事实、恢复链、测试影响与候选路线。
- [x] D1 — Decision：维护者冻结 P1 → P2 → P3 三段式；P1 获得明确 GO，P2 先 Discovery，P3 未授权。
- [x] P1-A — Preflight：Latest=v0.3.1；v0.3.2 为非 draft/prerelease，双资产 size/digest 与 acceptance 一致。
- [ ] P1-B — Pointer promotion：仅把 GitHub Latest 指向 v0.3.2，并完成独立后置查询。
- [ ] P1-C — Evidence and authority：写入 v0.3.2 promotion evidence，旋转 ROADMAP/provenance/CHANGELOG 角色。
- [ ] P1-D — Validation：focused/full suite、published oracle、sealed ZIP identity、链接与 diff 全绿。
- [ ] P2-D — Deep-clean Discovery：恢复旧 retention 结论，全仓扫描并冻结 hot/warm/cold inventory、删除集合、
  断言迁移、immutable 恢复链和停止条件；未获新 GO 前不删除。
- [ ] P2-I — Historical cleanup：只实施 P2-D 后明确批准的清退集合，不开启新版本 identity。
- [ ] P3 — Successor train：另开 active scope 和 Discovery，建立获批的后继 machine identity。

## Stop Conditions

- 无法证明 v0.3.1 tag/Release/acceptance/bootstrap 可从 immutable ref 恢复。
- P1 前置或后置查询显示 v0.3.2 资产 identity 漂移、Release draft/prerelease、或 Latest 未按预期切换。
- 需要改写 v0.3.1/v0.3.2 tag、Release、asset、SHA 或 acceptance。
- P2 拟删除内容属于 sealed v0.3.2 ZIP input、当前 rollback 必需资产、唯一恢复证据，或需要先开启新
  machine identity；该项应保留或推迟到 P3，不能为了“清爽”突破边界。
- 任何 promotion/eviction 会削弱当前回滚能力、publication oracle 或 Release gate。

## Status

P1-A PASS，P1-B in progress。维护者已把原两段式修正为 P1 promotion、P2 深度历史清理、P3 后继列车；
P1 获得明确 GO，P2 只获 Discovery 授权，P3 未授权。当前外部事实仍是 Latest=v0.3.1，直至 P1-B
后置查询证明切换成功。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Web open 拒绝直接访问 GitHub API URL，返回 unsafe/internal error | 1 | 改用获批的只读 `gh api` 查询同一官方 Release API，不重复 web open |
| Windows sandbox 中 `node --test tests/repository-boundary.test.js` 在 runner 隔离进程处 `spawn EPERM` | 1 | 分类为 platform limitation；改用 `--test-isolation=none` 在同一进程执行同一测试文件，不修改断言 |
| 沙箱外 guard 首次执行报告 active planning scope 未 tracked | 1 | 这是新 scope 尚未进入 Git index 的预期 checkpoint 状态；先显式 stage 仅 planning 轮换文件，再复跑 guard 后提交 |
| 沙箱内 `git add` 无法创建 `.git/index.lock` | 1 | 工作区未受损；按既有关键 checkpoint 自动 commit 授权，仅对 planning rotation 请求沙箱外 Git 写入 |
| 重写三段式活动计划的大块补丁因旧段落精确换行不匹配被拒绝 | 1 | 未产生部分修改；改用 UTF-8 复读后按标题分段应用，不重复原补丁 |
