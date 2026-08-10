# Progress: Low-risk Current-tree Cleanup

## 2026-08-10

- 恢复读取 README、ARCHITECTURE、HEAD 中的 DESIGN、ROADMAP 与已完成活动 scope。
- `git status` 确认只存在维护者的四项删除；未覆盖这些改动。
- 冻结低风险边界并建立本活动 scope；C0 PASS，开始 C1。
- 恢复 `DESIGN.md` 原字节；保留 v0.3.2 bootstrap/acceptance 与旧架构快照删除。
- ROADMAP current file window 改为 candidate + accepted；v0.3.2 acceptance 链接改为 immutable final evidence blob。
- repository guard 改为检查真实 working tree、只要求 candidate + accepted 本地版本文件，并禁止根级旧架构快照。
- 已完成 planning scope 从 current tree 退休；C1～C3 PASS，开始 C4。
- focused runner 在沙箱内因 `spawn EPERM` 未执行断言；沙箱外 22/23 PASS，唯一失败为旧 role-window 文案断言。
- 将该断言拆成 local file window 与 publication oracle window 两条，不改变测试强度或版本角色。
- 修正后 focused governance/architecture/published/release tests 23/23 PASS；v0.3.2 immediate-fallback oracle
  从 immutable source/tag 成功重建并命中冻结 ZIP identity。
- 最终完整 `npm test`：96 tests，84 PASS、12 个 Windows/POSIX 诚实 SKIP、0 FAIL。
- Importer check、三个 Python entrypoint compile、`install.js`/repository guard Node syntax、v0.3.3 bootstrap
  `bash -n`、四个 upstream `100755` mode 与 `git diff --check` 全部 PASS。
- 已验证并移除上一活动 scope 留下的本地空目录；C4 PASS，状态为
  `CURRENT_TREE_CLEANUP_PASS / PHASE4_NOT_AUTHORIZED`。
- 删除 ignored、可重建的 `dist/pwf-codex-cloud-hooks-v0.3.3.zip`（74,198 bytes）及空 `dist/` 目录；
  immutable GitHub Release 资产未触碰。
