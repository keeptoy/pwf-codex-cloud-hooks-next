# Findings: Phase 4.13 Release governance history summary

## Maintainer intent

- 在`docs/history/`创建Phase 4.13，便于后续维护回忆本轮文档治理。
- 核心结论：保留两个退役检查点，但不保留强制Phase 9；两轮审查嵌入Release流程。
- 必须保存C0/C1/C2：Cloud实际PASS候选/tag、第一阶段状态写回、第二阶段Published/Latest/retirement closeout。
- Phase 4.12由维护者后续补写；本任务不得创建占位或推断其内容。

## Scope guard

- 摘要是cold/warm history导航，不是当前programme、Release identity或Cloud acceptance authority。
- 三份补回的历史acceptance继续作为只读reference fixtures，不进入commit。

## History inventory

- `docs/history/`当前已有Phase 4.1～4.11及独立Phase 9历史；尚无Phase 4.12或4.13。
- Phase 4编号本来就按Discovery/治理里程碑保存，不要求与Product Phase capsule“一阶段一文件”的抽象完全相同；新文档应遵循现有history索引和相邻文件格式。
- 首次文件列表过滤使用POSIX斜杠匹配Windows返回的反斜杠，得到空输出；已改用直接`rg --files docs\history`完成inventory。

## Template and index rules

- 新摘要应使用显式稳定anchor，并包含Historical position、Problem before、Core decisions、Completed delivery、Acceptance conclusion、Explicit non-goals、Successor inheritance、Cold evidence。
- 正文必须短小自洽，不复制脚本、fixture、SHA表、测试计数或逐commit流水；只在`docs/history/README.md`登记，宏观文档不直链具体摘要。
- Phase 4.13应标成“回顾性Release governance里程碑”，不是新的Product Phase/Discovery/Release授权。
- history索引当前仍把standing Phase 9写成未来重复Release gate；这与刚冻结的新治理矛盾。既然本任务必须修改索引，应把该通用收录规则改为：历史Phase 9实例保留原名，但未来Release closeout不要求固定Phase编号。
- Phase 4.2与Phase 9/v0.4.0条目中的standing Phase 9属于当时事实，应保持，不用当前模型改写历史条目。
- 新索引可以直接从4.11跳到4.13；不得创建4.12占位，也不应把编号连续性变成机器合同。

## Adjacent Phase 4 style

- Phase 4.10/4.11使用专题显式anchors和自洽长摘要，保留当时语义，并通过successor note解释后续变化；不会用当前治理批量重写旧“standing Phase 9”叙述。
- Phase 4.13应明确是2026-08-23对Release/acceptance文档职责的回顾性治理里程碑，不是F3C后续产品gate，也不声称补上Phase 4.12。
- 摘要应重点解释为什么P9-A～F不应成为未来默认模板，而不是复述v0.4.0/v0.4.1逐gate结果。
- C0/C1/C2需要同时保存三种身份：`SOURCE_CANDIDATE_HEAD`（tag目标）、`SOURCE_CANDIDATE_CHECKPOINT_HEAD`（第一状态写回）、`PUBLISHED_RELEASE_CLOSEOUT_HEAD`（最终治理HEAD）。
- 还应记录Discovery Round与Release双通道/retirement review三轴拆分、single-guide channel/final生命周期、两次Cloud与两次维护者控制面动作、两次状态写回不是Cloud轮次。
- Cold evidence可指向包含本轮治理结果的exact commit `86032ef...`源码快照；它的完整hash需从Git读取，且摘要本身不自引用未来commit。

## Exact evidence and test route

- 本轮治理源码快照完整hash为`86032ef9343cc9935e91f3f358f2642d01f26bd6`；它包含此前两笔治理commit的最终树，可作为4.13唯一cold evidence链接。
- `tests/repository-boundary.test.js`负责history/docs生命周期、Release exclusion和版本化历史断言，适合新增4.13专用case；`architecture-contracts.test.js`明确禁止冻结版本历史，不应加入4.13路径。
- 新case应保护4.13显式anchors、三轴拆分、两个retirement checkpoint、C0/C1/C2身份角色、历史P9不重写和index入口。
- 不应断言Phase 4.12永久缺失；维护者后续新增4.12时测试必须继续通过。只需让4.13索引不依赖编号连续性。
- 相邻回顾性里程碑使用exact commit URL作Cold evidence，并明确不解释当前实现；4.13可沿用该格式。
