<a name="phase-history-index"></a>

# Product Phase 与架构谱系历史摘要

这里保存已经闭合 Product Phase，以及明确标注的回顾性 architecture-lineage overview / 迁移 interlude
的精选摘要，帮助维护者理解“当时为什么这样走、交付了什么、哪些能力留给后继阶段”。它属于 warm layer
导览，不是源码 archive、当前 programme authority 或验收原文。

每份摘要已经从 cold evidence 中提炼并独立成文，理解其结论不需要继续打开旧 Phase/Round 文档。完整历史
字节仍由 immutable Git commit、tag 与 Release 保存，但只用于来源审计，不解释当前实现。当前现实以根级
README、ARCHITECTURE、DESIGN、现行 contracts、ROADMAP 与活动 planning 为准。这里的文件创建后原则上
冻结，只允许事实纠错或修复 immutable link。

## 收录边界

- 只收录已经关闭并有不可变证据的 Product Phase；回顾性 interlude 必须明确声明不是原 programme 的正式
  Phase，也不产生新授权。讨论中、施工中或只有原型结论的阶段不进入这里。
- 跨多个已关闭阶段的回顾性 overview 只负责组织已经证实的历史关系，必须明确不是正式 Phase，并链接而不
  取代各段详细摘要；不能借 overview 把原型推断成验收、把功能模型推断成当前架构。
- 每个 Phase 只保留一份摘要，不按 Round、测试批次、候选版本或会话继续拆文件。
- 不复制 production source、脚本、fixture、验收全文、SHA 表、测试计数或旧 planning。
- 摘要不维护当前 candidate、accepted、rollback、PASS/PENDING 或下一步状态。
- 每份摘要最多保留一个 immutable source snapshot，不直接链接旧 Phase/Round 设计文档或验收全文。
- `docs/history/` 整体不得进入 Release、installer inventory、trusted graph 或 runtime dispatch。

## 已收录 Phase

| Phase | 当时的交付闭环 | 精选摘要 |
|---|---|---|
| Phase 0 | 回顾性架构谱系：区分失败尝试、成功原型、Cloud 功能基线、owned architecture 完成与 successor authority 迁移；不是正式 Product Phase | [`phase-0-architecture-lineage.md`](phase-0-architecture-lineage.md) |
| Phase 1 | 固定来源、ownership/contracts、可复现 import/install/package；runtime 仅作为 inactive verified inventory | [`phase-1-runtime-provenance.md`](phase-1-runtime-provenance.md) |
| Phase 2 | 激活 adapter 监督的 owned catch-up，建立 transcript 与 global Skill 安全边界 | [`phase-2-owned-catchup.md`](phase-2-owned-catchup.md) |
| Phase 3 | 激活 canonical owned-plan，删除 adapter 平行 plan 算法并完成 beta Cloud 闭环 | [`phase-3-canonical-plan.md`](phase-3-canonical-plan.md) |
| Phase 3.5 | 回顾性迁移标签：M1～M4 将 beta.2 产品基线迁入 successor 并完成 authority cutover；不是正式 Product Phase | [`phase-3.5-successor-migration.md`](phase-3.5-successor-migration.md) |
| Phase 3.6 | 回顾性架构迁移标签：v0.3.2 → v0.3.3-dev 退休不可达 catch-up overlay supply-chain，收敛为四文件 pristine upstream + owned boundary；只关闭本地 source migration，不宣称 Cloud/Release | [`phase-3.6-pristine-catchup-migration.md`](phase-3.6-pristine-catchup-migration.md) |
| Phase 3.7 | 回顾性 contract-cleanup 标签：退休只由测试维护、production 从未读取的早期 programme 元数据，以 exact inventory guard 保留准入边界；不是正式 Product Phase | [`phase-3.7-runtime-contract-metadata-cleanup.md`](phase-3.7-runtime-contract-metadata-cleanup.md) |
| Phase 3.8 | 回顾性 supply-chain Discovery 标签：追溯 manifest/bundle inventory 双写根因，选择 bundle authority 并冻结迁移边界；当时只关闭方案决策，摘要尾注另记该路线后由 v0.3.4 落地 | [`phase-3.8-runtime-inventory-authority-discovery.md`](phase-3.8-runtime-inventory-authority-discovery.md) |
| Phase 3.9.1 | 回顾性维护者里程碑：把 v0.3.4 已验收的运行时、供应链/安装、演进路线与后续建议整理为新人心智模型；不是正式 Product Phase，也不产生新授权 | [`phase-3.9.1-v0.3.4-architecture-analysis.md`](phase-3.9.1-v0.3.4-architecture-analysis.md) |
| Phase 3.9.2 | 回顾性 contract-design 讨论里程碑：区分 overlay 退役 tombstone、通用 exact schema、正向 pristine 证据与未来路线治理；不表示 v2 已实施 | [`phase-3.9.2-contract-v2-tombstone-review.md`](phase-3.9.2-contract-v2-tombstone-review.md) |
| Phase 3.9.3 | 回顾性字段生命周期讨论里程碑：为 `origin` 冻结有触发点的待审状态，并建立 machine field 的 owner、transition、review 与 retirement 最小表；不表示 v2 或 Phase 4 已实施 | [`phase-3.9.3-machine-field-lifecycle-and-origin.md`](phase-3.9.3-machine-field-lifecycle-and-origin.md) |
| Phase 4.1 | Phase 4 第一轮 Discovery 里程碑：冻结 managed v3 mode 的 hybrid owned-boundary、versioned opt-in、contract/source convergence、threat/rollback matrix 与 F1 conditional-go；不表示 foundation 或行为已实施 | [`phase-4.1-managed-v3-discovery.md`](phase-4.1-managed-v3-discovery.md) |
| Phase 4.2 | Phase 4～9 路线复核与决策里程碑：确认 Phase 4.1 已落实字段生命周期原则，并采纳 F1A/F1B/F2A/F2B/F3、activation protocol、可选 Phase 6、共用 evaluator 与 standing Release gate 校准；作为后继规划输入，不产生实施授权 | [`phase-4.2-programme-route-review.md`](phase-4.2-programme-route-review.md) |
| Phase 4.3 | F1 foundation 实施规划里程碑：冻结 F0/F1A/F1B 文件与 authority、hash 传播、failing-first/platform gates、对象级迁移生命周期总账，并把 v0.3.5 forward migration 与 candidate-controlled rollback 明确为非对称合同；不表示 implementation 已授权或完成 | [`phase-4.3-f1-foundation-implementation-plan.md`](phase-4.3-f1-foundation-implementation-plan.md) |
| Phase 4.4 | F2A smart activation Discovery 里程碑：选择独立 managed commit point、upstream profile 分区、two-pass state revalidation、schema-v2 reuse 与 F2A/F3 验收分工；结论为 conditional-go，不表示 smart 已实施或授权 | [`phase-4.4-f2a-smart-activation-discovery.md`](phase-4.4-f2a-smart-activation-discovery.md) |

## 阅读方式

先用本索引定位 Phase，并直接阅读摘要。末尾的 source snapshot 只是 cold evidence，不是当前 authority；
需要审计历史来源时才进入该 commit。如果摘要与不可变历史字节冲突，通过新的事实纠错提交修复摘要；
不得把旧设计重新提升为当前规范，也不得改写旧 commit、tag、Release 或 acceptance。

新增摘要或在上下文丢失后恢复写作边界时，复制 [`Phase 历史摘要模板`](../phase-history-template.md)。模板
只提供写作提示，不是 machine contract；现有摘要不会因为模板文字调整而被批量重写。
