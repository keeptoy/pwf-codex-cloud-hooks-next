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

本文件是Phase 5的current Product authority，只维护阶段目的、已采纳路线、稳定边界和里程碑摘要提纲。详细问题、决策过程、
实施顺序、错误和验证结果写入活动或已完成planning，不在overview复制第二份流水。

<a name="phase-5-why-this-phase-existed"></a>

## Why this Phase existed

Phase 4完成后，仓库已经具备稳定runtime、供应链、Cloud与Release治理，但文档维护成本也暴露出三个长期问题：

1. README同时承担产品入口、开发教程与Release操作时过重，而且其中任一字节变化都会改变Release ZIP候选身份；
2. architecture、design、contracts、源码和测试会随演进出现小幅漂移，需要一种明确的代码级对账与修正入口；
3. planning会保存详细施工证据，也可能由维护者定期删除；需要在删除前由维护者判断哪些内容值得进入精选history，避免证据丢失，
   同时不把全部planning永久化。

大白话：Phase 5先把“什么应该写在哪里、什么时候从施工记录提炼成长期说明或历史记录”治理清楚，再决定是否值得实施其他
Product方向。文档治理本身已经激活；新的Product能力仍必须另行Discovery和授权。

<a name="phase-5-adopted-route"></a>

## Adopted route and stable boundaries

当前采用以下路线：

- 根README保持轻量，只承载稳定行为、安装运维、安全不变量和唯一文档地图；本地开发与构建/Release教程由Release-excluded
  [`Wiki`](../../Wiki.md)维护。
- ROADMAP独占current train、版本角色、programme路线和Phase overview指针；本文件独占Phase 5长期目标、已采纳边界和里程碑提纲。
- `.planning/.active_plan`继续选择唯一活动scope；详细流水保存在对应planning中，completed scope是否保留或退役由维护者决定，
  不以测试强制“只能存在一个目录”。
- 文档与实现对账以contracts、源码和测试为证据。发现偏差时修正文档或实现，但不得借“对齐”扩大ABI、trusted graph、Release
  或远端权限。
- history仍只接收符合`FROZEN_DISCOVERY_RECORD`或`RETROSPECTIVE_CAPSULE`准入条件的成熟对象；只有维护者在planning退役前
  明确决定时才创建或维护`phase-5.x`记录，不为会话、测试批次或普通提交虚增编号。

Phase 4的legacy默认、explicit plan-local opt-in、managed runtime只读workspace、unknown state fail closed、trusted source exact、
deterministic package与disarm-first rollback继续是继承边界。当前Phase 5治理不能弱化这些Product与安全不变量。

<a name="phase-5-outline"></a>

## Phase outline

本节只列出当前阶段级主题和已形成的结论，不维护时间线或逐任务证据。详细依据由对应planning保存。

| 主题 | 摘要 |
|---|---|
| development identity | `v0.5.0-dev`已建立统一package/candidate身份，本地branch同步为`0.5.0-dev`；candidate身份本身不产生Release或Product实现授权 |
| README / Wiki分层 | README保持稳定产品入口，本地开发与构建/Release教程由Release-excluded `Wiki.md`维护 |
| planning lifecycle | `.active_plan`只选择一个活动scope；completed scope的保留、历史提炼和删除均由维护者决定 |
| implementation audit | architecture、design、contracts、源码和测试已完成一次代码级对账，已知文档漂移得到修正 |
| autonomous exact state | nonce/attestation现与README合同一致，严格要求exact单个LF，其他换行或尾随形式拒绝 |
| Phase authority activation | Phase 5已显式激活为文档治理阶段，但新的Product实现、Cloud和Release仍未授权 |
| document-test governance Discovery | 粗筛发现两份治理测试仍混合机器边界与文案/时态断言；Phase 5.1已打开小范围Discovery草稿，先做`KEEP / REPLACE / RETIRE / DEFER`分组、authority去重和代表性方案，不授权批量删改 |

<a name="phase-5-planning-history-lifecycle"></a>

## Planning and history lifecycle

`phase-5-overview.md`始终只保存摘要提纲；详细流水、错误、测试与取舍保存在各活动/已完成planning中。维护者定期决定planning的保留或
删除，并在删除前审阅其内容：只有维护者认为某个已关闭主题值得长期保留且符合合法history role时，才创建或更新
`docs/history/phase-5.x-<topic>.md`并登记索引。

智能体可以在planning中标记可能值得提炼的材料并提出建议，但不得自行把planning提升为history，也不得因为scope完成、内容变长、
存在Git恢复点或准备删除就自动创建history。维护者没有明确决定时，保持planning原状；history一旦创建，只保存精选过程，不复制
全部planning，也不成为current Product authority。

<a name="phase-5-version-train-mapping"></a>

## Version-train mapping

Phase 5当前映射到`0.5.0-*`。`v0.5.0-dev`只是pre-C0 development candidate；Phase激活不产生C0、Cloud PASS、tag、Release或
accepted/fallback轮转。逐版本实际变化只读[`CHANGELOG`](../../CHANGELOG.md)，当前角色和后续授权只读ROADMAP。

未来若`0.5.x`继续承载同一文档治理目标，可以保留在本Phase；若提出runtime、Host event、permission、completion evaluator或
hard gating等新的Product方向，必须先按ROADMAP重新Discovery，不能仅因版本号相邻而自动并入本Phase。

<a name="phase-5-closeout-and-successor-inheritance"></a>

## Closeout and successor inheritance

Phase 5尚未closeout。关闭前至少需要：更新本摘要提纲；由维护者复核completed planning的保留、history提炼或删除处置；确认
文档authority、代码实现与测试不存在已知漂移；明确哪些治理规则成为后继稳定边界，以及哪些候选方向被拒绝或仍需Discovery。

后继阶段必须继承“一个问题一个current authority”、活动planning与历史证据分层、文档/代码相互校验、未知权限和Release风险
fail closed等边界。Phase 5不会预先授权Phase 6 compaction或其后的可选能力。

<a name="phase-5-evidence-map"></a>

## Evidence map

- Current programme、version roles与未来路线：[`ROADMAP`](../../ROADMAP.md)
- 逐版本delta：[`CHANGELOG`](../../CHANGELOG.md)
- 详细任务、验证与错误：`.planning/.active_plan`指向的活动scope及维护者尚未删除的completed scopes
- 成熟历史对象及其准入：[`Phase history`](../history/README.md)
- 已发布身份与不可变验收：[`BASELINE_PROVENANCE`](../../BASELINE_PROVENANCE.md)及对应acceptance
- Phase 4继承边界：[`Product Phase 4 Overview`](phase-4-overview.md#product-phase-4-overview)
