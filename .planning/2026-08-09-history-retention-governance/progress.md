# Progress: Repository History Retention Governance

## 2026-08-09

- H8 获批：维护者决定不 merge，并要求把本地仓库当前开发列车话术改为 `0.3.2-dev-extend`；明确
  package/Release candidate identity `0.3.2-dev` 不变，本轮不 push。
- H8 current-state failing-first：architecture governance 7 tests 中 6 PASS、1 FAIL；唯一红项是 ROADMAP
  仍把当前开发列车写作 `0.3.2-dev`，证明需要在 programme authority 更新，而不是改 package/contracts。
- ROADMAP 已把当前 source/governance 开发列车更新为 `0.3.2-dev-extend`，并明确不计划 merge；
  `0.3.2-dev` 继续作为 predecessor branch 和 package/Release candidate identity。
- H8 focused governance 12/12 PASS；`git diff --check` PASS，package 与 Release contract 版本均仍为
  `0.3.2-dev`，trusted/runtime/contracts/bootstrap diff 为空。
- H7 获批：维护者要求保留 `0.3.2-dev`，把治理分支改名并推送为 `0.3.2-dev-extend`，将治理 delta
  迁入独立 CHANGELOG extension 章节，并删除 `.planning` 下已验证为空的旧目录。
- 当前工作区从 H6 commit `b9e4892` 干净开始；原本地 governance 分支没有 upstream，远端未发现同名
  分支，现有 `0.3.2-dev` 仍停在 `cde4b15`。5 个旧 planning scope 目录逐项确认 entry count 为 0。
- CHANGELOG extension failing-first：architecture governance 7 tests 中 6 PASS、1 FAIL，唯一红项是尚无
  `0.3.2-dev-extend` 独立章节；测试标题定位同时改用带换行的完整 header，避免 base 名称误匹配
  extension 前缀。
- 已把两项治理 delta 迁入独立 `0.3.2-dev-extend` 章节，并明确它只是 source branch/extension track；
  原 `0.3.2-dev` 章节保留基点 delta，package identity 不变。focused governance 12/12 PASS。
- 5 个经核验为空的旧 planning 目录已按精确路径非递归删除；Git 不产生删除 diff，当前只剩 active scope。
- 当前本地分支已改名为 `0.3.2-dev-extend`；完整 `npm test` 为 87 tests、75 PASS、12 Windows/POSIX
  SKIP、0 FAIL。
- push 前远端只读检查确认 `0.3.2-dev` 仍为 `cde4b15`，`0.3.2-dev-extend` 尚不存在；可用普通
  non-force first push 建立同名 upstream。
- 创建本地恢复点 `c330070` 后，以普通 non-force push 建立远端 `origin/0.3.2-dev-extend` 并设置
  upstream；没有删除、覆盖或推进 `origin/0.3.2-dev`。
- H7 完成状态写回后最终 focused governance 复跑 12/12 PASS。
- H6 恢复轮次：维护者明确授权最终本地收口；工作区从 H5 commit `435f830` 干净开始。重读 README/ARCHITECTURE 后确认 H6 只需 authority/package/platform evidence，不改变 trusted graph 或 runtime。
- 重读 DESIGN/ROADMAP；H6 的适用验证是文档 authority、repository guard、完整本地 regression 与 deterministic development package。没有 production/contract/Host ABI 变化，不触发新的 live Cloud/rollback gate。
- H6 authority failing-first：architecture governance 7 tests 中 5 PASS、2 FAIL；缺口精确落在 README 未导航治理指南，以及 CHANGELOG/ROADMAP 未提升已发生的 exact-vs-lifecycle 与 role-window 结论。
- 已同步 README 文档地图、CHANGELOG Unreleased 与 ROADMAP `0.3.2-dev` programme 摘要；未向 ARCHITECTURE/DESIGN 复制第二份治理规则。
- H6 authority test 复跑 7/7 PASS。
- H6 完整 `npm test`：87 tests，75 PASS、12 Windows/POSIX SKIP、0 FAIL。
- H6 development ZIP 双构建与逐包 check：两次均为 23 entries、82,632 bytes、SHA-256 `f15f9c9522c79c838b09d340b103181701d89ff5d0b8d53878c933639e2096c5`，确定性 PASS；临时 ZIP 已删除，该 hash 不是 seal/Release identity。
- H6 source/platform/static gate：importer check、Python compile、`node --check install.js`、Git for Windows
  Bash 对 v0.3.1/v0.3.2 bootstrap 的 `bash -n`、63 个 tracked files 的 UTF-8/LF、15 个仓库自有
  Markdown 的 fence/relative links、四个 upstream `100755` modes 与 `git diff --check` 全部 PASS。
- 最终边界审计：相对 `0.3.2-dev@cde4b15` 没有 trusted/current-role 文件变化，输出
  `TRUSTED_CURRENT_ROLE_DIFF=NONE`；本轮 diff 仅涉及治理、文档、planning、测试和已验证可恢复的冷历史退场。
- H6 结论：source merge 建议 GO；12 个 Windows/POSIX SKIP 不阻塞无 production 漂移的源码治理合并，
  但本结论不覆盖 Release、Cloud、publication 或 rollback，实际 merge/push 仍等待维护者授权。
- 最终 architecture/repository 聚焦复跑首次受沙箱 `spawn EPERM` 阻断；以同一只读命令在沙箱外复跑后
  12/12 PASS，归类为执行环境限制而非 product/test defect。
- H5 恢复轮次：维护者指示继续；按最小授权解释为历史迁移/清退，不包含 H6、push、Release 或 Cloud。重读 README 与 ARCHITECTURE 后确认 trusted graph 和 Release 不变量不变。
- 活动 task plan 已同步 H5 授权：允许在 immutable recovery 验证后清退角色窗口外历史文件并改写直接依赖；禁止改 production/contracts/package identity/当前 bootstrap、push、Release 和 Cloud。
- 重读 DESIGN 与 ROADMAP；H5 仅作用于 Release-excluded governance/history zones，当前 candidate `0.3.2-dev`、accepted `v0.3.1` 与 rollback evidence chain 的角色事实不变。
- H5 recovery probe：20/20 拟清退路径可从已推送 `cde4b15bba7ed8580cb774c8b8bb259c9174c3d0` 恢复；v0.3.0 acceptance/bootstrap 另由 immutable `v0.3.0` tag commit 二次验证。
- H5 failing-first repository test：5 tests 中 3 PASS、2 FAIL；红项精确对应 5 个 completed planning scopes 与角色窗口外 v0.3.0 root bootstrap，trusted-source 和 immutable-ref guard 保持绿色。
- 已应用 H5 migration：删除 15 个 completed planning 文件、4 份冷历史 runbook/acceptance 和 v0.3.0 root bootstrap；保留 active scope、v0.3.1 accepted 与 v0.3.2 candidate 文件。
- BASELINE_PROVENANCE 已压缩旧版本为 milestone catalog，README/AGENTS/ROADMAP/CHANGELOG/DESIGN/v0.3.1 acceptance 和三组治理/历史 oracle tests 已改路由；剩余旧路径字符串均为 immutable URL、tag archive 或 negative assertion。
- 暂存候选 inventory 后运行 H5 聚焦测试：architecture、repository boundary、release package、skill patch 共 23/23 PASS；单一 active planning、v0.3.1 + v0.3.2 role window 与 immutable cold-history 路由闭合。
- 完整 `npm test`：87 tests，75 PASS、12 Windows/POSIX SKIP、0 FAIL；相较 H4 少 1 项是已明确退休的 v0.3.0 current-tree bootstrap replay，v0.3.0 tag archive oracle 仍通过。
- 独立 importer check、Python compile 和 `node --check install.js` 已先通过；PowerShell PATH 无 `bash`，直接 bootstrap `bash -n` 分类为平台限制，改用仓库测试已采用的 Bash 探测路径，不重复原命令。
- 使用 Git for Windows Bash 后，保留的 v0.3.1/v0.3.2 bootstrap `bash -n` 均 PASS。
- 首次 Markdown link probe 只发现裁剪 upstream Skill fixture 中未随 fixture 带入的模板/参考链接；分类为 fixture scope error，repository-owned 文档检查将排除 `tests/fixtures/` 后重跑。
- 排除受专属 tests 管理的 upstream fixture 后，15 个 repository-owned Markdown 文件的相对链接检查 PASS。
- H5 候选 tracked inventory：63 paths；planning 4 files、docs 3 files、root bootstraps 2 files，符合单一 active scope 与 candidate + accepted 角色窗口。
- 严格 UTF-8/LF、Markdown fences、四个 upstream `100755` modes、staged/unstaged `git diff --check`：PASS。
- 本轮恢复后重读 README 与 ARCHITECTURE；稳定运行边界、trusted graph 和 Release 不变量未发生变化。本轮仍只处理仓库治理 guard。
- 重读 DESIGN 与 ROADMAP；本次重构属于 `0.3.2-dev` 文档/治理检查范围，不改变 runtime、Host ABI、trusted graph 或 Release lifecycle。
- 维护者通过治理模型并授权 H4 guard 重构，以及在关键恢复点自动创建本地 commit；H5 历史迁移和远端写入仍未授权。
- 维护者选择描述性分支 `governance/history-retention`，并授权持久化治理思路与生成可迁移 Markdown 指南。
- 完整读取 planning-with-files skill 与三个模板；session catch-up 无未同步输出。
- 从干净的 `0.3.2-dev@cde4b15` 创建并切换到本地 `governance/history-retention`；未访问或修改远端。
- 按仓库顺序重读 README、ARCHITECTURE、DESIGN、ROADMAP 和前一活动 planning；前一 scope 已关闭。
- 复核 MAINTAINER_HANDOFF、architecture governance 和 repository boundary tests，确认当前 exact inventory guard 与活动 planning 生命周期冲突，而且提交后的已知红灯可稳定复现。
- 创建本 scope，冻结热/温/冷分层、三类基线、角色窗口、provenance admission、迭代模型、H3–H6 gates 与停止条件。
- 新建 `docs/repository-governance-guide.md`，使用通用角色模型和迁移清单，可独立迁移到其他仓库。
- 在 MAINTAINER_HANDOFF 新人入口增加指南链接；未修改 README、production、contracts、Release 或 Cloud。

## Validation Status

- `git diff --check`：PASS。
- 严格 UTF-8、LF、Markdown fence 平衡、活动 planning 指针与指南稳定显式锚点检查：PASS。
- 聚焦运行 `tests/architecture-contracts.test.js` 与 `tests/repository-boundary.test.js`：10 项中 9 PASS、1 FAIL。
- 唯一 FAIL 是继承的 repository exact-inventory 红项：前一提交已跟踪的 3 个 architecture planning 文件未列入静态 `expectedPaths`。本轮新增指南和 planning 尚未跟踪，不是该失败的新增触发因素。
- 暂存治理模型后再次运行同一聚焦测试：仍为 10 项中 9 PASS、1 FAIL；失败 diff 现在精确列出 6 个合法 planning scope 文件和 1 个治理指南路径，证明单个静态全仓库清单同时误拒绝生命周期文档与新增治理文档。
- 首次运行重构后 guard：12 项中 11 PASS、1 FAIL；exact trusted 与 planning lifecycle 两项已通过，唯一失败是测试正则没有容纳 handoff 链接标签现有的 Markdown code span，分类为 test defect。
- 修正测试自身的链接标签匹配后，聚焦 architecture/repository governance 测试 12/12 PASS；原静态全仓库 `expectedPaths` 已不再存在。
- 完整 `npm test`：88 tests，76 PASS、12 Windows/POSIX SKIP、0 FAIL；SKIP 与既有平台边界一致。
- 该失败已分类为验证时序缺陷与脆弱治理策略，是 H4 的 failing-first 输入；本轮 guide-only gate 不通过扩张静态清单伪装绿色。
- 完整 suite、package 与平台 gate 留到 retention contract 获批并完成 H4 实施之后。

## Current Handoff

- H0–H8 已完成；本地/远端 extension 分支均为 `0.3.2-dev-extend`，原 `0.3.2-dev` 保持在
  `cde4b15`，维护者明确决定不 merge。
- 当前开发列车话术是 `0.3.2-dev-extend`；底层 package/Release candidate identity 仍为 `0.3.2-dev`。
- CHANGELOG delta 已独立分层，旧空 planning 目录已删除，focused/full regression 均为 0 FAIL。
- 本轮只创建本地关键恢复点，不 push 或创建 PR；后续 Release、Cloud 和 rollback 都需要新的明确授权。
- 不创建 tag/Release/asset，也不宣称 Cloud 或 rollback gate 已通过。
