# Progress: v0.3.2 Baseline Promotion and v0.3.3-dev Handoff

- 2026-08-10：维护者授权 P2-P0，把跨版本核心理解整理为回顾性 Phase 0 架构谱系；已读取
  planning-with-files skill、活动计划、Phase 历史索引/模板及 Phase 1/3.5 摘要，冻结“不冒充正式 Phase、
  不复制当前 authority、不进入 P3”的写作边界。
- 新增 `docs/history/phase-0-architecture-lineage.md`：保存四阶段定位表、架构/仓库两条换代主线、完整
  alpha/beta/successor 时间线、大白话结论、非目标与详细 Phase 下钻入口；未复制 SHA、验收全文或当前状态。
- 历史索引新增回顾性 overview 准入边界与 Phase 0 行；CHANGELOG 仅记录 overview 类型扩充，README 的
  单一宏观入口、provenance 和 ROADMAP 均未改变。
- 新文件进入 Git index 后，focused architecture/repository suite 17/17 PASS；完整回归 92 tests、80 PASS、
  12 个 Windows/POSIX SKIP、0 FAIL；cached diff check PASS。P2-P0 已关闭，仍停在 P3 前。

- 2026-08-10：维护者授权 P2-PROV，补齐早期 `BASELINE_PROVENANCE`；已读取 planning-with-files skill、
  恢复活动计划，并冻结“只填可验证事实、缺证留空、不进入 P3”的取证边界。
- GitHub API 核验旧仓库八个 tag/Release 的 source commit、资产 filename/bytes/server digest 与平台
  immutable 状态；历史 tag tree/acceptance 复核区分 hard acceptance、pre-release smoke、planning 验收和缺证。
- `BASELINE_PROVENANCE.md` 已补齐七个早期身份：alpha.2/beta.1 资产与验收闭合；alpha.1 bootstrap
  smoke/Release digest 不一致被显式记录；v0.1/v0.2 缺少的 acceptance/独立 bootstrap 保持空缺语义。
- focused architecture/repository suite 17/17 PASS；完整回归 92 tests、80 PASS、12 个 Windows/POSIX SKIP、
  0 FAIL；`git diff --check` PASS。P2-PROV 已关闭，仍停在 P3 前。

## 2026-08-09

- 维护者授权读取新增临时 0.1.0/0.2.2 实现，并先把 0.1.0 理解写入 CHANGELOG；planning-with-files
  catch-up 后起始工作树只有不得修改/提交的 `临时文件/`。
- 完整读取 0.1.0 README/package/upstream manifest、adapter、installer 关键实现和两组 tests，确认它是
  9-file B1 candidate：legacy hooks.json/config trust、单 adapter、direct global Skill catch-up 和 adapter
  plan rendering，五个本地 fixture case，无 Cloud acceptance。
- Git 审计确认两个快照均无 `.git`；0.1.0 没有可达 tag/commit。v0.2.2 则有 `3bfd3ba`→`2f9100b`
  Git 链，但临时 24-file tree 只有 23 blobs 与 release source 相同，sealed bootstrap 替换了 zero hash。
- CHANGELOG 已新增 v0.1.0 段，区分真实实现、尚未建立的现代安全边界和 source-only 证据等级；v0.2.2
  段按本轮范围保持不动，未从临时快照提前扩写。
- focused suite 17/17 PASS；完整 `npm test` 为 92 tests、80 PASS、12 个诚实 Windows/POSIX SKIP、0 FAIL；
  `git diff --check` PASS。P2-H-010 已关闭，未进入 P3。
- 维护者批准按最干净方案吸收 `phase-3-upstream-invocation-options`；planning-with-files catch-up 后工作树
  只有不得修改/提交的 `临时文件/`，本轮未进入 P3。
- 已验证临时原文 blob `5e76f074...` 与 immutable `bbad3703...` 同路径文件完全一致；审计确认 Phase 3
  capsule 已有最终实现，但缺少 A～F 路线 rationale、后备和退休条件。
- Phase 3 capsule 已提炼受控快照首选、多目标 overlay 后备、上游/Cloud 原生退休条件，以及 IR/OS
  virtualization 的拒绝/暂缓理由；cold evidence 仅注明原始文档路径，继续复用一个 immutable snapshot。
- ARCHITECTURE 新增 integration-specific upstream invocation 边界，明确 snapshot 不是通用 Host ABI，
  路线切换必须重新进入 Discovery；BASELINE_PROVENANCE 保持零改动。
- focused suite 17/17 PASS；完整 `npm test` 为 92 tests、80 PASS、12 个诚实 Windows/POSIX SKIP、0 FAIL；
  旧角色/测试/ZIP 数量未回流扫描与 `git diff --check` PASS。P2-P-R 已关闭。
- 维护者批准 P2-P-T：Phase 摘要格式不再由测试断言，改用可复制模板帮助上下文丢失后的恢复；本轮使用
  planning-with-files catch-up，起始工作树只有不得修改/提交的 `临时文件/`。
- 新增 `docs/phase-history-template.md`，包含证据恢复顺序、归档准入、写作边界和建议八段骨架；明确模板
  不是 machine contract，不能据此猜测历史事实，调整模板也不批量重写已冻结摘要。
- 历史索引加入模板入口；治理指南只保留 closed/evidence/frozen/Release-excluded 等生命周期边界，文件名、
  章节顺序和提示语交由模板维护。DESIGN/CHANGELOG 同步职责分层。
- repository guard 已删除 capsule 枚举、文件名、八个 anchor、证据数量、Phase 1/3.5 内容和治理指南格式
  断言；仅保留 README 单一宏观入口、history index advisory 与 Release/trusted-graph exclusion。
- focused suite 17/17 PASS；完整 `npm test` 为 92 tests、80 PASS、12 个诚实 Windows/POSIX SKIP、0 FAIL；
  Node syntax、格式型断言零匹配与 `git diff --check` PASS。P2-P-T 已关闭，未进入 P3。
- 维护者批准 P2-P-E：CHANGELOG 不再提及或链接 Phase 3.5，迁移来源改回 BASELINE_PROVENANCE，并把
  Phase 历史收口为 README 唯一宏观入口；工作树起点只有不得修改/提交的 `临时文件/`。
- CHANGELOG 的 Unreleased 摘要已移除 Phase 3.5 名称及 deep-link，v0.3.0 改链 provenance 的稳定
  `successor-migration-evidence` anchor；完整 M1～M4 exact refs 仍由 provenance 保存。
- 治理指南和 repository guard 已删除“CHANGELOG 可 deep-link 一个 capsule”的例外：README 只能有一个
  `docs/history/` 入口，其他宏观文档一律不得直链；capsule 内部继承链接继续允许。
- 扫描确认宏观文档只有 README 引用 `docs/history/README.md`，CHANGELOG 中 `Phase 3.5`、`phase-3.5` 和
  `docs/history/` 均为零。focused suite 17/17 PASS；完整 `npm test` 为 92 tests、80 PASS、12 SKIP、
  0 FAIL；Node syntax 与 `git diff --check` PASS。P2-P-E 已关闭，未进入 P3。
- 维护者批准 P2-P-B provenance 收口，并明确两个例外：第 5、6 节不动；引用调整只改 Phase 1 指向
  Phase 3.5，ROADMAP 保留现状。planning-with-files catch-up 后工作树仍只有不得修改/提交的 `临时文件/`。
- 全仓 tracked 引用复核确认 BASELINE_PROVENANCE 被 14 个其他文件引用，因此保留稳定文件名；正文将其
  定位为可新增/轮换精选入口、但已登记 identity 不可改写的冷证据账本。
- 已发布身份从 current/history 两段改为单一角色无关账本，删除 v0.3.1 的 immediate-fallback 热状态；
  README/DESIGN 同步入口措辞，CHANGELOG 记录治理 delta。
- Phase 1 的 M1～M4 叙事已改指 Phase 3.5；ROADMAP diff 为空，provenance 第 5、6 节与修改前逐字一致。
- repository guard 新增冷账本合同、统一身份结构、角色标签防回流与 Phase 1 路由断言。沙箱内 focused
  suite 13/17，其余 4 项因既有 `spawnSync("git")` 限制失败；沙箱外同一 suite 17/17 PASS。
- 完整 `npm test`：92 tests，80 PASS、12 个诚实 Windows/POSIX SKIP、0 FAIL；Node syntax 与
  `git diff --check` 同时 PASS。P2-P-B 已关闭，未进入 P3。
- 维护者批准继续建立 Phase 1～3 精选历史摘要；本轮重新使用 planning-with-files 恢复上下文，catch-up 无未同步输出，
  工作树只有获准读取但不得修改或提交的 `临时文件/`。
- 活动计划已新增 P2-P gate：范围仅为 `docs/history/` 索引、三份闭合 Phase capsule、最小权威入口与生命周期
  guard；明确禁止复制临时资料、逐 Round 流水账、脚本/源码、无证据的 v0.2.2 细节或进入 P3。
- 已建立 `docs/history/README.md` 与 Phase 1～3 三份统一模板摘要；内容只提炼历史位置、前置问题、核心决定、
  已交付闭环、验收结论、非目标、后继继承和 immutable evidence，不复制测试计数、脚本、源码或验收全文。
- 三份摘要分别冻结 inactive trusted inventory、owned catch-up 激活和 canonical owned-plan 激活；Phase 3 同时
  区分 beta.1 功能闭环与 beta.2 行为不变的文档/独立资产重新封板。
- README 文档地图和 provenance M2 已加入最小历史索引入口；CHANGELOG 只记录本次 Unreleased 治理 delta，
  DESIGN 同步 repository guard 职责，没有改写已发布版本或当前 lifecycle 角色。
- 可迁移治理指南新增 Phase capsule 准入/冻结合同：只收录已关闭且可 immutable 恢复的 Phase，一个 Phase
  一份固定模板摘要，禁止 Round/候选版流水、源码/脚本/fixture/验收全文和当前状态进入 warm layer。
- repository lifecycle guard 已补充数据驱动的 history 检查：索引必须覆盖目录内全部 capsule，每份文件名与
  固定八段 anchor 合法、含 immutable source evidence、不得携带当前 Next Step/Status；不把整个 docs 路径
  重新写成静态全仓库清单。
- P2-P 首轮 focused suite 中 13 项通过，4 项在共同的 `trackedPaths()` 前置处因 Windows sandbox 禁止 Node
  `spawnSync("git")` 返回 `status=null`；已分类为 platform limitation，将保持断言不变在沙箱外复跑。
- 沙箱外同一 focused repository/architecture suite 17/17 PASS，新 capsule 的索引、八段模板、immutable
  evidence、Release/trusted-graph exclusion 和治理指南合同均通过。
- 完整 `npm test`：92 tests，80 PASS、12 个诚实的 Windows/POSIX SKIP、0 FAIL；importer integrity、
  unstaged/staged diff checks 与 repository syntax 同时 PASS。
- P2-P 已关闭；没有修改 production runtime、Host ABI、trusted graph、package/Release contract、bootstrap 或
  已发布资产，也没有复制/暂存 `临时文件/` 或进入 P3。
- 维护者后续要求 Phase capsule 文件名去版本前缀；三份文件已统一改为 `phase-1-*`、`phase-2-*`、
  `phase-3-*`，索引、可迁移治理规则和数据驱动 guard 同步采用版本无关命名，正文继续保留历史版本位置。
- 重命名后的 repository/architecture focused suite 17/17 PASS，旧 `v0.3.0-phase-*` 引用扫描为零，Node
  syntax 与 diff check PASS；production、Release 和 immutable evidence 未变化。
- 维护者授权继续收紧 Phase authority；本轮重新读取 planning-with-files skill，catch-up 无未同步输出，
  工作树仍只有不得修改/提交的 `临时文件/`。P2-P-A 已启动，P3 保持未授权。
- 已移除 BASELINE_PROVENANCE 对 Phase 索引的第二入口；README 唯一入口改为明确 cold audit 语义，三份
  capsule 删除旧 Phase/acceptance 直链并各自只保留一个 immutable source commit。
- 治理指南和数据驱动 guard 已同步：摘要必须自洽，宏观文档不得创建第二入口，每份 capsule 恰好一个
  commit evidence，并禁止 retired design/acceptance blob link 回流。
- 静态扫描确认宏观文档仅 README 引用 `docs/history/`，capsule 旧 Phase/acceptance blob link 为零；Node
  syntax 与 diff check PASS。focused repository/architecture suite 17/17 PASS。
- 完整 `npm test`：92 tests，80 PASS、12 个诚实 Windows/POSIX SKIP、0 FAIL。P2-P-A 已关闭；没有修改
  production、Release、immutable assets、`临时文件/` 或 P3 状态。
- 维护者批准将 M1～M4 迁移叙事整理为回顾性 Phase 3.5；本轮重新读取 planning-with-files skill，catch-up
  无未同步输出，工作树仍只有不得修改/提交的 `临时文件/`。P2-P-M 已启动，P3 保持未授权。
- 已新增 `phase-3.5-successor-migration.md`：用统一八段模板概括 M1 exact mirror、M2 slim transformation、
  M3 Cloud equivalence 与 M4 authority cutover，并明确它是回顾性标签、没有新产品行为或 Phase 4 授权。
- CHANGELOG v0.3.0 的迁移叙事已改指 Phase 3.5；provenance 第 2 节改为“不可变证据”并保留全部 per-gate
  refs/runbook，README/历史索引和通用治理规则已容纳明确标注的 decimal interlude。
- P2-P-M 首轮 focused suite 14/17 PASS；3 个失败分别是两个跨行 regex 使用固定空格、一个 CHANGELOG
  link label 多包反引号，已分类为 formatting defect；Phase 3.5 内容、exact refs 和 authority 分层没有失败。
- 修复跨行 regex 与 link label 后第二轮 focused suite 16/17 PASS；唯一失败是新 capsule 的 cold-evidence
  句式偏离统一模板，决定修改文档而不放宽 guard。
- 统一 cold-evidence 模板后 focused repository/architecture suite 17/17 PASS；完整 `npm test` 为 92 tests、
  80 PASS、12 个诚实 Windows/POSIX SKIP、0 FAIL。
- P2-P-M 已关闭；没有修改 production runtime、Host ABI、trusted graph、package/Release contract、bootstrap、
  immutable assets、`临时文件/` 或 P3 状态。
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
- 维护者批准在 P3 前继续 P2-G；只读对照治理指南后确认无需重构，实施范围冻结为 retirement DoD、
  两阶段事务说明、版本无关稳定文档 guard 与 accepted/immediate-fallback 两席 oracle。
- 治理指南第 12～14、16 节已补入 lifecycle transaction 语义、8 项 retirement DoD、unsealed transition
  fail-closed 规则、新项目 adoption 字段和反模式；没有新增文档 authority 或长期 baseline 类型。
- repository lifecycle guard 已从单独禁止 v0.3.1 升级为禁止稳定文档中的任意固定版本 bootstrap 文件名；
  publication oracle 已改为数据驱动的 accepted + immediate-fallback 两席表，并增加精确席位断言。
- P2-G focused tests 首轮 19/19 PASS；完整 `npm test` 为 91 tests、79 PASS、12 个 Windows/POSIX SKIP、
  0 FAIL。CHANGELOG、DESIGN test map 与 ROADMAP 状态同步后，稳定文档无固定 bootstrap 版本扫描、
  `git diff --check` 和最终 focused 19/19 再次 PASS。
- P2-G 已关闭；活动计划重新停在 P3 前，未创建新 scope、machine identity、ZIP、seal、Release 或部署。
- 本地分支已从 `0.3.2-dev-extend` 改名为 `0.3.2-post-release` 并解除旧 upstream；远端分支未修改或删除。
  ROADMAP 与活动 planning 已同步，package/contract/bootstrap 仍保持最后发布的 v0.3.2 identity。
- CHANGELOG 的 v0.3.0 段已补充其来源：从冻结的 v0.3.0-beta.2 经 provenance 中 M1 exact mirror、M2
  slim transformation、M3 Cloud equivalence 与 M4 repository authority cutover 建立首个 stable baseline；
  精确 ref 与迁移证据仍只由 BASELINE_PROVENANCE 维护。
- P2-H 已启动并获准读取 `临时文件/`；完整读完 beta.2 audit tree 的 `work_plan.md`，恢复出 v0.2.2
  compatibility → alpha.1 Phase 1 → alpha.2 Phase 2 → beta.1 Phase 3 功能闭环 → beta.2 文档/发布治理链。
- 完整读完 beta.1 与 beta.2 Cloud hard acceptance：前者证明 Phase 1～3 后 canonical 双 runtime 的首个
  最小完整功能/Cloud A～F 基线，后者证明 runtime 行为不变但文档、独立资产和可重放验收治理重新封板。
- 读取 PROJECT_UNDERSTANDING 的 v0.2.2 overlay/Cloud baseline 段，并以 Git diff 复核 beta.1→beta.2：
  production paths 零变化，变化集中在文档、planning、versioned assets 与 Release tests。successor 没有
  本地 beta/v0.2.2 tag，已记录并改用可达 immutable lineage commit，不创建或伪造 tags。
- CHANGELOG 已新增 beta.1 独立段、扩充 beta.2 文档/发布治理段，并为 v0.2.2 建立最小已证实角色占位；
  repository/architecture guards 16/16 PASS，`git diff --check` PASS。P2-H 关闭，v0.2.2 细节等待维护者补充。
