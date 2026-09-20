<a name="product-phase-5-overview"></a>

# Product Phase 5 Overview

> Authority role: `PRODUCT_PHASE_OVERVIEW`
> Version series: `0.5.0-*`
> Current programme and train pointer: [`ROADMAP`](../../ROADMAP.md)

<a name="phase-5-long-term-position"></a>

## Long-term position

Product Phase 5当前以**文档治理与authority收敛**为正式范围：让稳定产品说明、programme状态、实现地图、维护教程、活动planning
和历史证据各自只回答自己的问题，并持续核对文档声明与代码级实现。它不是对Phase 4 Product baseline的重新实现，也不因整理
文档而自动授权新的runtime行为、Host ABI、trusted graph、Cloud gate或Release。

本文件是Phase 5的current Product authority。活动期允许在下方维护经过筛选的工作账本；它只记录值得进入Phase长期叙述的重要
问题、决定和交付，不复制当前Next Step、逐命令日志、原始测试输出、测试计数、C0/C1/C2步骤或临时PASS/PENDING状态。

<a name="phase-5-why-this-phase-existed"></a>

## Why this Phase existed

Phase 4完成后，仓库已经具备稳定runtime、供应链、Cloud与Release治理，但文档维护成本也暴露出三个长期问题：

1. README同时承担产品入口、开发教程与Release操作时过重，而且其中任一字节变化都会改变Release ZIP候选身份；
2. architecture、design、contracts、源码和测试会随演进出现小幅漂移，需要一种明确的代码级对账与修正入口；
3. 活动planning、长期Product authority和精选history若没有清晰转化规则，容易把临时流水、当前状态和历史摘要复制到多个位置。

大白话：Phase 5先把“什么应该写在哪里、什么时候从施工记录提炼成长期说明或历史记录”治理清楚，再决定是否值得实施其他
Product方向。文档治理本身已经激活；新的Product能力仍必须另行Discovery和授权。

<a name="phase-5-adopted-route"></a>

## Adopted route and stable boundaries

当前采用以下路线：

- 根README保持轻量，只承载稳定行为、安装运维、安全不变量和唯一文档地图；本地开发与构建/Release教程由Release-excluded
  [`Wiki`](../../Wiki.md)维护。
- ROADMAP独占current train、版本角色、programme路线和Phase overview指针；本文件独占Phase 5长期目标、已采纳边界和活动期
  的精选工作账。
- `.planning/.active_plan`继续选择唯一活动scope；completed scope是否保留或退役由维护者决定，不以测试强制“只能存在一个目录”。
- 文档与实现对账以contracts、源码和测试为证据。发现偏差时修正文档或实现，但不得借“对齐”扩大ABI、trusted graph、Release
  或远端权限。
- history仍只接收符合`FROZEN_DISCOVERY_RECORD`或`RETROSPECTIVE_CAPSULE`准入条件的成熟对象；不为会话、测试批次或普通提交
  虚增`phase-5.x`编号。

Phase 4的legacy默认、explicit plan-local opt-in、managed runtime只读workspace、unknown state fail closed、trusted source exact、
deterministic package与disarm-first rollback继续是继承边界。当前Phase 5治理不能弱化这些Product与安全不变量。

<a name="phase-5-active-working-ledger"></a>

## Active working ledger

本节是Phase 5活动期的curated working ledger。它先承载重要过程和阶段结论；只有形成可独立理解、已有证据且符合history role的
对象时，才提炼到`docs/history/phase-5.x-*.md`。在此之前不创建空history文件，也不把普通planning流水冒充正式Round。

### Activation baseline — `0.5.0-dev`

| 主题 | 已发生的重要事实 | Phase 5含义 |
|---|---|---|
| development identity | package、Release contract、predecessor contract与zero-hash bootstrap已轮转到`v0.5.0-dev`，本地branch同步为`0.5.0-dev` | 建立Phase 5版本系列，但candidate初始化本身不等于programme授权 |
| README / Wiki分层 | 本地开发与构建/Release教程迁入Release-excluded `Wiki.md`，README收敛为稳定产品入口与文档地图 | 降低README和Release ZIP输入的治理重量，同时保留唯一导航入口 |
| planning lifecycle | 维护者退役早期已完成scope，随后明确completed scope可保留，测试只要求一个活动pointer | 区分“一个活动scope”和“只能存在一个scope目录” |
| implementation audit | 对照architecture、design、contracts、runtime与tests完成代码级核查，并修正installed contract图、Wiki链接和adapter注释漂移 | 文档不能把历史模型或不完整部署图继续当作当前实现 |
| autonomous exact state | 回看Phase 4历史、本地验收与真实Cloud证据后，确认正向样本均使用LF；runtime现严格要求nonce/attestation为exact单个LF | README合同、实现和回归重新一致；无LF、CRLF、多LF及尾随空白均拒绝 |
| Phase authority activation | 维护者显式确认进入Phase 5文档治理，并创建本overview | 从“仅预占0.5.0系列”切换为真实激活、但范围仍受限的Product Phase |

后续重要决定或交付先追加到本表或本节的有界子段；普通命令、失败重试和测试数字继续只写活动planning。若一项工作只是版本delta，
只写CHANGELOG；若涉及exact发布身份或验收，只写provenance/acceptance并从这里链接，不复制证据表。

<a name="phase-5-ledger-distillation"></a>

## Ledger distillation

当工作账本出现一个已经关闭、可独立理解且值得长期回看的主题时，按以下步骤提炼：

1. 判断它是真实Discovery/decision round，还是对象关闭后的回顾；分别选择`FROZEN_DISCOVERY_RECORD`或
   `RETROSPECTIVE_CAPSULE`，不创造第三种history role。
2. 创建一个有语义标题的`docs/history/phase-5.x-<topic>.md`，补入稳定英文anchor，并在history索引登记；`x`按真实对象顺序分配，
   不按聊天、提交或测试批次编号。
3. 把值得保存的条件、取舍、停止点和后继继承提炼到history；原始聊天、完整测试输出、当前状态和旧planning不搬入。
4. 从本文件删除已经被history承接的过程细节，只保留结论、稳定边界和链接，使`phase-5.md`逐步蜕变为摘要提纲。
5. `phase-5.md`始终保留current Product authority；history只解释“当时怎样决定”，不得反向授权当前实现或Release。

账本变长本身不是唯一准入条件。若内容仍在讨论、没有关闭结论或无法归类到两个合法role，就继续留在活动账本或planning，不提前
物化history。Phase closeout时必须完成最后一次提炼，并删除已经失去长期价值的临时账目。

<a name="phase-5-version-train-mapping"></a>

## Version-train mapping

Phase 5当前映射到`0.5.0-*`。`v0.5.0-dev`只是pre-C0 development candidate；Phase激活不产生C0、Cloud PASS、tag、Release或
accepted/fallback轮转。逐版本实际变化只读[`CHANGELOG`](../../CHANGELOG.md)，当前角色和后续授权只读ROADMAP。

未来若`0.5.x`继续承载同一文档治理目标，可以保留在本Phase；若提出runtime、Host event、permission、completion evaluator或
hard gating等新的Product方向，必须先按ROADMAP重新Discovery，不能仅因版本号相邻而自动并入本Phase。

<a name="phase-5-closeout-and-successor-inheritance"></a>

## Closeout and successor inheritance

Phase 5尚未closeout。关闭前至少需要：把活动账本提炼成摘要提纲；将符合条件的过程记录迁入已索引history；确认文档authority、
代码实现与测试不存在已知漂移；明确哪些治理规则成为后继稳定边界，以及哪些候选方向被拒绝或仍需Discovery。

后继阶段必须继承“一个问题一个current authority”、活动planning与历史证据分层、文档/代码相互校验、未知权限和Release风险
fail closed等边界。Phase 5不会预先授权Phase 6 compaction或其后的可选能力。

<a name="phase-5-evidence-map"></a>

## Evidence map

- Current programme、version roles与未来路线：[`ROADMAP`](../../ROADMAP.md)
- 逐版本delta：[`CHANGELOG`](../../CHANGELOG.md)
- 活动任务、验证与错误：`.planning/.active_plan`指向的scope
- 成熟历史对象及其准入：[`Phase history`](../history/README.md)
- 已发布身份与不可变验收：[`BASELINE_PROVENANCE`](../../BASELINE_PROVENANCE.md)及对应acceptance
- Phase 4继承边界：[`Product Phase 4 Overview`](phase-4.md#product-phase-4-overview)
