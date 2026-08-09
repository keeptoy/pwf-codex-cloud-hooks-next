# Progress: Repository History Retention Governance

## 2026-08-09

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

- H4 已完成：trusted source exact guard、planning lifecycle guard、documentation lifecycle guard 与 retired-path protection 均已落地。
- 下一 gate 是 H5，仍需维护者明确授权；此前不进行任何历史迁移或删除。
- 治理模型恢复点为本地 commit `7cb68ca`；H4 验证完成后创建第二个本地恢复点，不推送。
