# Progress: v0.3.2 Baseline Promotion and v0.3.3-dev Handoff

## 2026-08-09

- 完整读取 planning-with-files skill，session catch-up 无未同步输出，初始工作树 clean。
- 按新冻结的 Discussion-to-Implementation 规则，把维护者目标解释为关键 promotion/eviction Discovery，
  未直接修改 ROADMAP、版本 identity、文件窗口或外部状态。
- 已完成的 architecture history-retention scope 由已推送 `d4cc3b5` 保存并退出当前树；创建本 scope 作为
  唯一活动探路现场。
- 本地 inventory 确认 package/Release contract/bootstrap/candidate tests 仍是完整 0.3.2 machine
  identity；v0.3.3-dev 若作为“当前开发列车”必须同步整套身份，不能只改 ROADMAP。
- 已列出 v0.3.1 当前树依赖面，并形成“最小角色旋转 + 下一列车预留”与“同事务建立 0.3.3-dev identity”
  两条候选路线；尚未选择或实施。
- Web direct-open GitHub API 失败后改用只读 `gh api`：确认 Latest=v0.3.1，v0.3.1/v0.3.2 Release 双资产
  digest 与仓库证据一致。
- 已证明 v0.3.1 root bootstrap 可从 tag/Release 恢复；最终含 promotion 证据的 acceptance 精确 blob 位于
  可达 commit `435f8305...924f`，清退前应把 warm 文档链接改为该 immutable commit URL。
- 审计 Release ZIP contract 与 tests 后确认 `README.md` 是 sealed v0.3.2 ZIP 输入，HEAD 构建目前必须精确
  复现 v0.3.2 ZIP SHA；所以只改 ROADMAP 或只删 v0.3.1 文件会造成断链/identity drift。
- 审计 skill-patch/published-release oracles 后列出必须迁移的通用 bootstrap 安全断言与历史 oracle 边界；
  不在本次归档问题中顺手扩大到 v0.3.0 oracle 清退。
- D0 Discovery 已形成 `CONDITIONAL_GO`：推荐先执行 v0.3.2 pointer promotion，再建立真实 0.3.3-dev
  source identity 并清退 v0.3.1 当前树副本；等待维护者显式授权两个关键动作。
- planning guard 首次用 Node test runner 默认隔离执行时被 Windows sandbox 以 `spawn EPERM` 阻止；该结果
  属于平台限制而非产品断言失败，随后改用同一 runner 的 `--test-isolation=none` 复核。
- 沙箱外复跑时 6/7 通过，唯一失败准确指出新 active scope 尚未 tracked；先把本轮 planning rotation
  显式加入 Git index，再复跑同一 guard，以验证提交边界而非弱化测试。
- 沙箱内 stage 因 `.git/index.lock` 权限被拒绝，未发生部分 index 写入；按最小范围转为沙箱外 stage/commit。
- planning rotation 暂存后，沙箱外 `node --test --test-isolation=none tests/repository-boundary.test.js`
  7/7 PASS，`git diff --cached --check` PASS；D0 checkpoint 可提交。
- 维护者把路线重排为 P1 promotion、P2 历史深度清理、P3 后继列车；P1 明确授权，P2 先 Discovery，
  P3 不在当前范围。活动计划已按三个独立 gate 重写。
- 重新读取 commit `d4cc3b5` 中已完成 retention 三文件；决定把其有效结论吸收到 P2 findings，而不永久
  恢复第二个 `.planning` scope，以保持 one-active-scope repository contract。
- P1 公开 preflight PASS：Latest=v0.3.1；v0.3.2 Release 非 draft/prerelease，双资产 size/digest 与
  acceptance 精确一致，允许进入 pointer-only promotion。
- 三段式计划重排后的 repository-boundary guard 7/7 PASS，`git diff --check` PASS；P1 设计 checkpoint
  可以在移动外部 pointer 前提交。
- P1-B 已执行：GitHub Latest 从 v0.3.1 移到 v0.3.2；独立后置查询确认 v0.3.2/v0.3.1 四个资产的
  filename、size 与 digest 未变化，没有重发或改写历史资产。
- P1-C 开始同步：acceptance 追加独立 promotion 证据；ROADMAP 把 v0.3.2 设为 completed/accepted，
  并用显式 P2 清理过渡角色精确容纳尚未获批删除的 v0.3.1 当前树副本；CHANGELOG 只记已发生 delta。
- P1 focused architecture/repository/release-package/published-oracle 20/20 PASS；`git diff --check` 唯一红项
  是 acceptance 新增行末空格，已做纯格式修复，未改变证据语义。
- 完整 `npm test` 为 91 tests、79 PASS、12 个 Windows/POSIX SKIP、0 FAIL；importer、Python 编译、
  Node syntax 与 diff PASS。PowerShell 无全局 bash，显式 Git Bash 在沙箱内又被 signal-pipe 权限阻止；
  转到沙箱外后两个 bootstrap `bash -n` 均 PASS。
- P1-A～P1-D 全部关闭；外部 Latest、ROADMAP、CHANGELOG、v0.3.2 acceptance 与 transitional lifecycle
  guard 一致。下一步进入 P2-D 只读深度清理 inventory，不自动删除或开启 P3。
