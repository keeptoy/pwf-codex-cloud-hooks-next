<a name="product-phase-overview-index"></a>

# Product Phase Overview 索引

大白话：这里保存每个**真实激活过的 Product Phase 的长期说明书**。它回答“这个 Phase 为什么存在、最终采用了什么路线、
留下了哪些稳定边界、后继阶段继承什么”，也不等同于某个 SemVer 或 GitHub Release note。活动期可以先在唯一overview中维护
curated working ledger；成熟过程提炼进history后，overview再收敛为摘要提纲。

## Authority 与准入

- 每个真实激活的 Product Phase 最多一份`phase-N.md`；未激活、只在ROADMAP候选表中的Phase不提前创建空文件。
- Product Phase激活后，ROADMAP第4节把current train指针指向对应overview；活动期间只维护已采纳的Product目标、路线与稳定边界。
- 活动期允许overview暂存重要问题、决定和交付，但不复制当前Next Step、逐命令日志、原始测试输出或临时状态；当一个主题符合
  history准入时，提炼为`phase-5.x`这类有语义标题的record，并从overview移除已被承接的过程细节。
- Product Phase closeout时补齐最终交付和后继继承；关闭后只做有证据的事实纠错、链接维护或明确标注的状态尾注。
- ROADMAP继续独占current programme、版本角色、未来Phase路线索引与
  [overview指针轮转规则](../../ROADMAP.md#product-phase-overview-rotation)。overview不得反向授权新列车、Release或下一Phase。

## 与其他文档的分工

| 要回答的问题 | 唯一入口 |
|---|---|
| 当前列车、版本角色、未来Phase路线和overview指针 | [`ROADMAP`](../../ROADMAP.md) |
| Product Phase长期目标、已采纳路线、稳定边界和最终结论 | 本目录对应`phase-N.md` |
| 当时怎样探路、为什么作出某个决定、后来怎样回补 | [`Phase历史过程账本`](../history/README.md) |
| 各版本实际改变了什么 | [`CHANGELOG`](../../CHANGELOG.md) |
| exact tag、source、ZIP/bootstrap与验收结果 | [`BASELINE_PROVENANCE`](../../BASELINE_PROVENANCE.md)和对应acceptance |
| 当前任务的Next Step、授权和停止条件 | `.planning/.active_plan`指向的活动`task_plan.md` |

closeout后的overview不复制逐Discovery流水、原始测试输出、测试数量、C0/C1/C2操作过程、SHA表、源码或验收教程。活动期账本
也只能保留精选过程；history提炼后必须回收为长期结论和链接。Product Phase可以覆盖多个版本列车；因此本目录使用
“Product Phase Overview”，不使用容易与版本发布混淆的“release note”。

## 已物化 overview

| Product Phase | 长期authority | 状态说明 |
|---|---|---|
| 4 | [`phase-4.md`](phase-4.md#product-phase-4-overview) | Product baseline已闭合；后续同系列patch/governance不自动创建新Product Phase |
| 5 | [`phase-5.md`](phase-5.md#product-phase-5-overview) | active；当前范围为文档治理，overview暂存精选工作账，成熟后提炼到history并收敛为摘要提纲 |

新增实例时复制[`Product Phase Overview模板`](../product-phase-overview-template.md)，按真实证据删改提示文字；模板不是machine
contract，也不要求为模板更新批量改写已经关闭的overview。
