# Findings: ROADMAP lifecycle governance review

## Entry boundary

- 分支`0.4.2`已与远端同步；上一history renumbering commit已经push。
- 工作树只保留维护者把4份旧guide移入`临时文件/`的独立改动；本任务不读取、修改或暂存该目录。
- 本轮先冻结治理结构，不在维护者确认前修改ROADMAP、模板或测试。

## Preliminary ROADMAP structure

- Phase 5～8大表格已经覆盖5.5的大部分结论；5.5是近乎重复摘要。最佳收敛不是新增长篇并列表，而是把4个遗漏分别补回现有行：Phase 5的Pre/PostCompact比较、Phase 6的噪声预算、Phase 8的best-effort lock不得升格，以及Phase 7 evaluator唯一性；随后删除5.5。
- 5.2源码使用标准same-document fragment`#phase-4-opt-in-purpose`，explicit anchor也存在并受测试保护；维护者看到的`file+.vscode-resource...`是渲染层转换。为提高本地渲染兼容性，可改为显式相对文件链接`ROADMAP.md#phase-4-opt-in-purpose`，而不是依赖裸fragment。
- 5.4描述contract/hash原子闭合、全仓inventory、对象owner和KEEP/REPLACE/RETIRE/DEFER账本，明显跨越Phase 4，属于所有关键migration gate的programme治理，不应继续嵌在Phase 4子章节。
- 推荐顺序：`7 Discovery` → 新`8 Migration transaction与对象生命周期治理` → `9 Release` → `10 rollback` → `11 long-term`。稳定英文anchors继续作为链接合同，章节数字只供阅读。

## History access model

- 当前测试和模板冻结“README是唯一宏观history入口”，ROADMAP被显式禁止出现`docs/history/`。
- 若按维护者“唯二访问权限”开放，建议精确定义为：**只有README与ROADMAP两个宏观文档可以进入history**。README负责全局索引；ROADMAP只在programme路线或治理原则需要历史理由时，链接exact Phase摘要的stable explicit anchor。
- 这种粒度允许新migration章节直接引用Phase 4.8两段偏差尾注，同时避免ARCHITECTURE、DESIGN、CHANGELOG、provenance、handoff各建历史入口。

## Phase history template direction

- 不建议把`Post-implementation status`与`Post-live status`变成每份history摘要的两个强制空章节；Discovery-only、纯回顾性interlude或一次闭合的Phase不需要机械补齐。
- 模板应增加“可选append-only状态尾注”规则：只有原Decision快照先于实施，且计划→实现或实现→live证据的差异本身具有长期解释价值时才追加。
- `Post-implementation status — <gate>`记录实际交付、相对原计划的实现偏差、对象生命周期决定、本地证据和仍未授权边界。
- `Post-live status — <gate>`只在真实Cloud/live完成后记录观测、相对implementation的生命周期偏差、最终结论、剩余停止点；不得预填PASS或由本地测试代替。
- 默认闭合摘要仍把最终结果融合进`Completed delivery`与`Acceptance conclusion`，避免模板把历史文件重新变成逐gate流水账。

## Evidence from existing history

- Phase 4.8确实形成三层时间语义：原Discovery结论、`post-implementation-status-f3b3`、`post-live-status-f3b3`；实施尾注保留LOCAL READY/CLOUD NOT AUTHORIZED，live尾注再以真实Cloud证据更新对象账和停止点。
- 该模式不只存在于4.8：4.1、4.3～4.7、4.9～4.12也使用post-implementation或post-live尾注。因此模板补充不是创造新流程，而是把已经反复验证的历史写作经验规范化。
- Phase 4.8还追加了`Post-discovery status — F3B4`，说明模板应定义通用“append-only status note”家族，而不是只硬编码两种标题；implementation/live是最常见的两类。

## Expected change surface if approved

- ROADMAP：合并5.5、修复same-file链接、提升migration章节并顺延Release/rollback/long-term编号；同步正文中的“第8节”。
- `docs/phase-history-template.md`：修改入口说明并加入可选append-only status尾注协议/骨架。
- `docs/history/README.md`、`AGENTS.md`、`docs/repository-governance-guide.md`：冻结README+ROADMAP唯二history入口及各自职责。
- `tests/architecture-contracts.test.js`：冻结新migration anchor/章节顺序、表格吸收与same-file链接。
- `tests/repository-boundary.test.js`：把“one macro entrance”改成“two controlled macro entrances”，继续禁止其他宏观文档直链history。
- 章节数字耦合很小：除ROADMAP自身一处“第8节”外，仅architecture test硬编码Release为第8节；Cloud acceptance的8.x和治理指南8.1属于各自文档，不受影响。

## Frozen outcome

- README继续承担历史总索引；ROADMAP成为唯一第二宏观入口，只能在programme理由需要时直达exact Phase stable anchor。
- Product Phase表吸收原5.5全部有效边界；版本无关migration治理独立为第8节，Release/rollback/长期路线顺延为第9～11节。
- 旧`phase-4-migration-lifecycle-governance` anchor作为兼容别名保留，新canonical anchor为`migration-transaction-lifecycle-governance`。
- Migration账增加planning→implementation与implementation→live/lifecycle两个时间复核点；它们不增加Discovery Round、Cloud gate或Release通道。
- Phase历史模板只提供可选append-only status note家族；默认仍把最终事实收敛进Completed delivery与Acceptance conclusion。
