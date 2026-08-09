# Progress: Repository History Retention Governance

## 2026-08-09

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

- H5 已完成：20 个路径均在删除前验证 recovery，当前树只保留 active planning、v0.3.1 accepted 与 v0.3.2 candidate 角色文件。
- H5 聚焦测试 23/23 PASS，完整 Node regression 0 FAIL，source/bootstrap/static/link 检查 PASS。
- 下一 gate 是 H6，仍需维护者评审授权；本轮创建本地恢复点后停止，不 push。
