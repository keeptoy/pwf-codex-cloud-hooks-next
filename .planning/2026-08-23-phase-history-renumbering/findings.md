# Findings: Phase history renumbering

## Entry boundary

- 维护者已把4份已跟踪黑盒验收教程移入`临时文件/`；Git表现为4个tracked deletion和一个untracked目录。
- 这些文件只供后续参考，本任务不修改、不暂存，也不把其移动夹带进history renumbering commit。
- 上一活动Phase 4.13 ROADMAP governance计划已完成；本任务使用独立active plan。

## Rename graph

- 目标文件名冻结为：
  - `phase-4.12-v0.4.0-release-discovery.md`：原`phase-9-v0.4.0-release-discovery.md`；正文保留P9-A～P9-F gate名和原时间语义，尾部新增回顾性Phase 4.12改名说明。
  - `phase-4.13-v0.4.1-path-safety-patch-train.md`：原Phase 4.12摘要。
  - `phase-4.14-release-closeout-governance.md`：原Phase 4.13摘要。
- `docs/history/README.md`当前按4.12、4.13、Phase 9排序；迁移后应连续为4.12 Release discovery、4.13 path-safety、4.14 Release governance。
- ROADMAP当前正文只需把“Phase 4.12、Phase 4.13”更新成新的4.13、4.14，并把“历史P9实例”校准为“已重新编号的v0.4.0 Release discovery”；不得新增ROADMAP到history的直接链接。

## Reference and compatibility policy

- 旧Phase 9文件内的`P9-A`～`P9-F`和`phase-9-v0-4-0-*`section anchors描述真实执行gate，不能机械改名；在新文件顶端新增Phase 4.12 canonical anchor并保留旧positioning anchor作兼容别名。
- 顺延的path-safety与governance摘要应新增新编号canonical anchor，并保留旧anchor别名，避免同文件内或已发布外部fragment失效；仓库内链接统一转向新anchor。
- 旧planning账本中的“当时Phase编号”是历史事实，不批量改写；其中若存在旧history文件路径，应只修正路径引用，不改写原任务标题、授权或结论。
- `tests/repository-boundary.test.js`是本次主要治理合同；`architecture-contracts.test.js`明确不冻结版本历史，不应加入具体新编号。

## Temporary reference inventory

- `临时文件/`现有7份参考：v0.3.4/v0.3.5/v0.4.0 acceptance，以及4份v0.4.0 Discovery operator/runbook。
- 4份原tracked operator/runbook的移动属于维护者改动；3份acceptance继续是untracked reference。整个目录从本任务staging中排除，最终以入场SHA-256复核字节。

## Validation boundary

- `repository-boundary.test.js`目前有一项长期合同要求三份F3 operator guide继续存在于`docs/`；维护者把它们移到`临时文件/`后，未经本任务改动的完整suite也会失败。
- 本次renumbering不会擅自删除或放宽该durable-evidence合同，也不会把用户移动纳入commit。验证时需要在安全`try/finally`夹具中临时恢复4份tracked guide，并隔离整个临时参考目录，结束后完整还原用户布局。
- 新Phase 4.12 Release discovery应在现有“retired v0.4.0 role evidence”case中冻结：新路径、新canonical定位anchor、旧P9定位anchor兼容别名、尾注说明和P9-A～P9-F anchors继续存在。
- path-safety与Release-governance两个专用case分别顺延为Phase 4.13和4.14，仓库内断言只使用新路径与新canonical anchors；旧anchors只作为兼容性别名保留。

## Post-materialization semantic review

- 排除`.planning/`历史账本后，current docs/tests对三个旧文件名的命中已为0；所有实际Markdown链接和代码读取都转向4.12/4.13/4.14新路径。
- `.planning/`剩余旧文件名均位于已关闭任务的“当时命名/当时已创建”记录，不是可点击活链接。批量改写会伪造历史决策，因此保留；本轮active findings则明确记录old→new映射。
- 新4.13正文仍需在“立即后继是版本化Phase 9”的历史事实后补“现回顾性编号4.12”，否则读者可能把它误判成仍存在的独立索引项。
- 新4.14的“也不补写相邻编号的其他历史文件”来自4.12尚缺席时期，编号补齐后应改成“不接管4.12/4.13的详细证据”。
