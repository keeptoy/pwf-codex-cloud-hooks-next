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
- P2 首轮全仓版本/退役路径扫描完成：architecture-contracts 已版本无关；v0.3.1 实体与引用面集中在
  bootstrap/acceptance、文档 authority 和三类测试。一次裸 `*.md` PowerShell glob 失败已改为 `-g`。
- 确认 P2 不能删除 root v0.3.1 bootstrap：sealed v0.3.2 README 仍引用它；该单一 residue 必须透明
  延后到 P3。其余 acceptance/link/assertion/oracle/tombstone 进入第二轮职责与恢复链审计。
- P2 隐藏常量扫描发现 release-package 的 v0.3.0/v0.3.1 冗余 SHA `notEqual`、contracts 的逐版本
  bootstrap 负清单、skill-patch 的旧 identity + 通用安全断言混合，以及 v0.3.0/beta.2 默认 oracle。
- 核验 v0.3.1 acceptance 当前/immutable blob 均为 `e70265e...6f77`，v0.3.1 bootstrap 当前/v0.3.2 tag
  blob 均为 `2e470386...65c`；moving Release URL 扫描零匹配。
- P2-D 已冻结 delete/generalize/relink/keep 四类集合并得出 `CONDITIONAL_GO`；未执行删除，等待维护者
  授权 P2-I。旧 retention 三文件的有效结论已全部吸收，未恢复第二个 tracked planning scope。
- P2 Discovery checkpoint 的 repository-boundary guard 7/7 PASS，`git diff --check` PASS；可本地提交。
- 维护者明确 GO P2-I，并补充允许 README 离开 sealed v0.3.2 bytes：P2 可删除 root v0.3.1 bootstrap，
  将 README/AGENTS syntax 改为版本无关循环；完成后必须停在 P3 前，不创建新 identity 或 Release。
- 已冻结过渡语义：published v0.3.2 只由 immutable tag oracle 证明；P2 后 HEAD 只验证 deterministic
  unsealed source ZIP 且必须与 published v0.3.2 SHA 不同，直到 P3 建立新 candidate identity。
- P2-I 第一批改动完成：删除 root v0.3.1 bootstrap 与当前树 acceptance；README/AGENTS 改用版本无关
  bootstrap syntax 循环；provenance 将 v0.3.1 移入精选历史并链接 exact `435f830...` acceptance。
- 测试职责已旋转：通用供应链断言迁入 v0.3.2 skill-patch case；Release contract 的 bootstrap exclusion
  改为 pattern；current-source ZIP 必须 deterministic 且不得等于 published v0.3.2；v0.3.1 oracle 只读
  immutable source，v0.3.0/beta.2 默认 oracle 退出。
- 全仓复扫确认剩余 v0.3.1 文本均属于时间证据、精选历史或 immediate fallback；没有 README/AGENTS、
  lifecycle window 或 current-source 依赖残留。四个 focused suite 共 11/11 PASS。
- 暂存删除后的 repository/architecture guards 15/15 PASS；完整 `npm test` 为 89 tests、77 PASS、12 个
  Windows/POSIX SKIP、0 FAIL。importer integrity、Python compile、`install.js` syntax、版本无关 bootstrap
  `bash -n` 循环与 staged diff 全部 PASS。
- P2-I 已关闭：活动计划 Next Step 已切换为 P3 前讨论；没有创建 successor scope、0.3.3-dev machine
  identity、candidate ZIP、seal、Release 或部署。
