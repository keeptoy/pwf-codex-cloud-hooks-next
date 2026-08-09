# Task Plan: v0.3.2 Baseline Promotion and v0.3.3-dev Handoff

## Goal

先通过只读 Discovery 冻结 v0.3.2 从 Cloud-accepted candidate 晋级为 accepted baseline、v0.3.1 退出
当前角色窗口，以及下一开发身份 `v0.3.3-dev` 的完整含义和最小变更集合；在维护者确认方案前不实施
角色旋转、外部 promotion 或历史清退。

## Authorization

- 维护者提出把 v0.3.1 历史归档、把已完成基线更新为 v0.3.2，并以 v0.3.3-dev 占位下一开发列车。
- 根据 ROADMAP 6，本轮先授权只读 inventory、差异分析、选项与代价，不把讨论性目标直接解释为
  GitHub `Latest`、production rollback、package/contract/bootstrap identity 或文件删除授权。
- 本轮可更新本活动 planning；在维护者确认 GO 前不修改 ROADMAP/CHANGELOG/provenance、版本文件、
  tests、Release、tag、asset、Latest 或外部环境。

## Next Step

盘点 v0.3.1/v0.3.2 当前角色与所有本地/immutable 依赖，区分 repository-only 角色旋转、正式
rollback/Latest promotion 和 v0.3.3-dev source identity 三件事，给出完整候选方案与唯一需要维护者
确认的决策。

## Gates

- [x] D0 — Discovery：全仓库 inventory、外部事实、恢复链、测试影响与候选路线。
- [ ] D1 — Decision：维护者冻结 promotion 范围与 v0.3.3-dev 身份语义，给出 GO/NO_GO。
- [ ] D2 — Role rotation：按获批方案同步 authority、角色窗口、文件与测试，不修改 immutable 历史。
- [ ] D3 — Validation：focused/full suite、ZIP boundary、历史恢复和外部状态（如获批）全部核验。

## Stop Conditions

- 无法证明 v0.3.1 tag/Release/acceptance/bootstrap 可从 immutable ref 恢复。
- “v0.3.2 accepted baseline”是否包含 GitHub `Latest` 与 production rollback promotion 尚未明确。
- “v0.3.3-dev 占位”是否只改 ROADMAP，还是建立 package/contract/bootstrap source identity 尚未明确。
- 需要改写 v0.3.1/v0.3.2 tag、Release、asset、SHA 或 acceptance。
- 任何 promotion/eviction 会削弱当前回滚能力、publication oracle 或 Release gate。

## Status

D0 complete，结论为 `CONDITIONAL_GO`。推荐把同一 lifecycle 事务拆为 P1（v0.3.2 pointer promotion）和
P2（建立真实 0.3.3-dev source identity + 清退 v0.3.1 当前树副本）；D1 等待维护者明确授权两项关键动作。
当前事实仍是 v0.3.2 published + Cloud PASS 但尚未 promoted，v0.3.1 仍是 accepted rollback/GitHub
`Latest`，所有讨论目标尚未成为新事实。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Web open 拒绝直接访问 GitHub API URL，返回 unsafe/internal error | 1 | 改用获批的只读 `gh api` 查询同一官方 Release API，不重复 web open |
| Windows sandbox 中 `node --test tests/repository-boundary.test.js` 在 runner 隔离进程处 `spawn EPERM` | 1 | 分类为 platform limitation；改用 `--test-isolation=none` 在同一进程执行同一测试文件，不修改断言 |
| 沙箱外 guard 首次执行报告 active planning scope 未 tracked | 1 | 这是新 scope 尚未进入 Git index 的预期 checkpoint 状态；先显式 stage 仅 planning 轮换文件，再复跑 guard 后提交 |
| 沙箱内 `git add` 无法创建 `.git/index.lock` | 1 | 工作区未受损；按既有关键 checkpoint 自动 commit 授权，仅对 planning rotation 请求沙箱外 Git 写入 |
