<a name="phase-history-index"></a>

# Product Phase 历史摘要

这里保存已经闭合 Product Phase 的精选摘要，帮助维护者理解“当时为什么这样走、交付了什么、哪些能力
留给后继阶段”。它属于 warm layer 导览，不是源码 archive、当前 programme authority 或验收原文。

完整历史字节、逐轮计划、命令输出和专项验收仍由 immutable Git commit、tag 与 Release 保存；当前版本角色、
授权和 Next Step 只读 `ROADMAP.md` 与活动 planning。这里的文件创建后原则上冻结，只允许事实纠错或修复
immutable link。

## 收录边界

- 只收录已经关闭并有不可变证据的 Product Phase；讨论中、施工中或只有原型结论的阶段不进入这里。
- 每个 Phase 只保留一份摘要，不按 Round、测试批次、候选版本或会话继续拆文件。
- 不复制 production source、脚本、fixture、验收全文、SHA 表、测试计数或旧 planning。
- 摘要不维护当前 candidate、accepted、rollback、PASS/PENDING 或下一步状态。
- `docs/history/` 整体不得进入 Release、installer inventory、trusted graph 或 runtime dispatch。

## 已收录 Phase

| Phase | 当时的交付闭环 | 精选摘要 |
|---|---|---|
| Phase 1 | 固定来源、ownership/contracts、可复现 import/install/package；runtime 仅作为 inactive verified inventory | [`phase-1-runtime-provenance.md`](phase-1-runtime-provenance.md) |
| Phase 2 | 激活 adapter 监督的 owned catch-up，建立 transcript 与 global Skill 安全边界 | [`phase-2-owned-catchup.md`](phase-2-owned-catchup.md) |
| Phase 3 | 激活 canonical owned-plan，删除 adapter 平行 plan 算法并完成 beta Cloud 闭环 | [`phase-3-canonical-plan.md`](phase-3-canonical-plan.md) |

## 阅读方式

先用本索引定位 Phase，再从摘要末尾的 immutable evidence 进入当时的完整专项文档和验收。如果摘要与
不可变原文冲突，以原文为历史证据，并通过新的事实纠错提交修复摘要；不得改写旧 commit、tag、Release
或 acceptance。
