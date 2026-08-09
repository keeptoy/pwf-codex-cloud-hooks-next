# Progress: Architecture Contract History Retention

## 2026-08-09

- 完整读取 planning-with-files skill，session catch-up 无未同步输出；初始工作树 clean。
- 按 AGENTS 顺序恢复 README、ARCHITECTURE、DESIGN、ROADMAP 与已完成的 v0.3.2 Release/Cloud scope。
- 完整审阅 `tests/architecture-contracts.test.js`，确认其中既有稳定架构治理，也有版本窗口、精确历史
  identity 和 v0.3.2 acceptance/runbook 的强耦合断言。
- 创建本 scope 并设为唯一 active planning；当前进入 G0 覆盖审计，尚未删除或迁移断言。
- 审阅 `published-release-oracles.test.js`、`repository-boundary.test.js`、仓库治理指南与 provenance：确认
  architecture 中的精确 release identity 是重复覆盖，v0.3.0 每次重建也已超出当前角色窗口；旧路径
  负断言则是 tombstone，不代表历史文件仍存在。
- 冻结初步分层：architecture 只守稳定规则；documentation lifecycle 守当前文档角色；repository
  boundary 派生 candidate/accepted 文件窗口；published oracle 只重建仍承担角色的两个版本。
- Git history 证明 architecture test 随最近每个治理/Release/Cloud gate 追加断言，膨胀不是偶发现象。
- 一次版本字面量扫描因 PowerShell 未展开 `tests/*.test.js` 而失败，已记录并改用 `rg -g` 路由。
- failing-first 职责 guard 如预期 1/1 FAIL，红项精确命中 architecture test 内的 v0.3.2 acceptance 路径。
- 初次动态 ROADMAP role regex 因 JS template/backtick 转义错误未通过 syntax check；已改为普通字符串
  拼接，不重复该转义方式。
- architecture test 已移除整段 v0.3.0-beta.2～v0.3.2 identity/acceptance 复述、固定 23-entry 总数与固定
  anchor 数量；文件内版本/hash/版本 acceptance 扫描为零。
- repository boundary 新增动态 role parser，以 ROADMAP candidate/accepted 交叉校验 package，并派生当前
  root bootstrap 与 acceptance 文件窗口；原 v0.3.0 文件名 tombstone 由通用窗口断言取代。
- CHANGELOG/ROADMAP/provenance/current acceptance 的 authority 与 promotion 禁区迁入 lifecycle test；
  failing-first guard 和迁移后的 lifecycle case 聚焦复跑 2/2 PASS。
- DESIGN reverse index 与可迁移 repository governance guide 已同步“稳定架构测试不得冻结版本历史，
  lifecycle/publication tests 分别管理角色窗口和精确字节”的长期规则。
- 已完成的 v0.3.2 Release/Cloud planning scope 从当前树清退，Git 提交 `1e11080` 继续保存完整证据；新 scope
  是 `.active_plan` 指向的唯一现场。
- CHANGELOG 新增紧凑 Unreleased delta，避免把本次 post-publication 治理变化反向写入已发布 v0.3.2。
- focused architecture + repository lifecycle 为 15/15 PASS；完整 `npm test` 为 91 tests、79 PASS、
  12 个 Windows/POSIX SKIP、0 FAIL。
- deterministic ZIP build/check 仍为 23 entries、82,627 bytes、SHA-256 `b42aecaf...e5081`；sealed inputs
  staged diff 为空，`git diff --check` PASS。G3 关闭。
