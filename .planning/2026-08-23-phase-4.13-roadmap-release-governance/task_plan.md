# Task Plan: Phase 4.13 ROADMAP Release governance convergence

## Goal

让ROADMAP重新只承担当前programme与版本无关Release顺序：清退当前区的已关闭P9流水，把两轮retirement review迁入Release章节，以C0/C1/C2图冻结候选、状态写回和最终closeout身份，并在Phase 4.13 history保留最小历史校准。

## Next Step

本地治理commit已完成；停止并等待维护者push或授权新的programme任务。

## Current Phase

Phase 4 / complete

## Phases

### Phase 1: Freeze document migration contract

- [x] 确认ROADMAP 4.2无外部稳定引用，完整P9历史已有专项history与immutable acceptance承接。
- [x] 确认4.3稳定anchor必须保留，但内容应迁入第8节。
- [x] 确认C0/C1/C2属于programme级Release身份顺序，执行细节继续由Operator Guide承担。
- [x] 确认当前第4节仍把已关闭v0.4.1当作开发列车，需要收敛为v0.4.2-dev文档治理状态。
- **Status:** complete

### Phase 2: Add failing-first governance contracts

- [x] 更新architecture/repository边界测试，要求retirement anchor位于第8节并冻结C0/C1/C2。
- [x] 停止从ROADMAP当前区读取v0.4.1详细P9历史，改从Phase 4.12/版本化history/provenance恢复。
- [x] 确认旧ROADMAP结构下测试精确失败。
- **Status:** complete

### Phase 3: Converge ROADMAP and history

- [x] 把第4节改为v0.4.2-dev documentation-governance状态，并经README文档地图分流到Phase 4.12/4.13历史而不新增直接history入口。
- [x] 删除ROADMAP 4.2旧P9流水，把4.3迁为第8节嵌入式retirement小节。
- [x] 在8.1加入C0/C1/C2大白话身份图，现有Pre-1.0小节顺延且保持稳定anchor。
- [x] 在Phase 4.13 history新增最小historical P9 calibration，不复制旧验收流水。
- **Status:** complete

### Phase 4: Validate and commit

- [x] 运行focused governance、完整回归和静态审计。
- [x] 验证三份未跟踪历史acceptance未修改、未暂存。
- [x] 创建单一范围本地commit并停止，交由维护者push。
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| ROADMAP 4.2直接删除，不整段搬运 | 版本化Phase 9 history与immutable acceptance已承担完整历史 |
| Phase 4.13只增加短小历史校准 | 保存“首次探路为何不再是模板”，避免history复制逐P9状态 |
| `version-train-two-retirement-reviews` anchor随内容迁到第8节 | 保持稳定链接合同，同时消除第4/8节重复authority |
| C0/C1/C2放入8.1，Operator Guide保留执行细节 | ROADMAP解释programme顺序，guide解释怎么跑与怎么回填 |
| 第4节只描述v0.4.2-dev文档治理且明确无RC | 已关闭v0.4.1历史已由Phase 4.12和版本证据恢复 |

## Authorization

- 已授权：按已讨论方案更新ROADMAP、Phase 4.13 history与必要治理测试，运行本地验证并创建本地commit。
- 未授权：修改production、contracts、package/Release inputs、既有版本acceptance/provenance或任何远端状态。

## Stop Conditions

- 若迁移会破坏README或其他稳定anchor链接，先保留anchor并调整结构，不删除合同。
- 若v0.4.2-dev被误写为已物化package、RC或Release授权，停止修正。
- 若三份历史reference无法安全隔离，停止且不提交。
- 本地commit后停止，等待维护者push。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| architecture failing-first断言在template literal中错误转义反引号，导致JS语法错误 | 1 | 改用普通字符串拼接构造role正则；repository两个目标用例的ROADMAP/history失败仍属预期 |
| planning阶段状态补丁的匹配片段顺序与文件实际顺序不一致，`apply_patch`验证失败 | 1 | 补丁完整拒绝且无部分写入；读取实际文件后按出现顺序更新 |
| ROADMAP第8节首个整块补丁因表格原文空格与匹配文本不一致而验证失败 | 1 | 补丁完整拒绝；读取精确第8节后拆为C0插入、重复段删除、retirement迁入三个小补丁 |
| 首次实现测试发现retirement稳定短语空格丢失，且角色测试仍依赖旧current正文措辞 | 1 | 恢复“低风险 Phase/每个 Phase”稳定形式；把accepted/Latest断言改指第2节唯一角色表 |
| ROADMAP语义清理补丁最初假定历史段落未换行，导致上下文匹配失败 | 1 | 补丁完整拒绝；读取UTF-8精确行后重试，未产生部分写入 |
| focused治理回归发现C0图虽有身份关系，但缺少同一行的正式tag约束句 | 1 | 补充“正式tag必须精确指向Source/Candidate实际Cloud PASS的commit”，未改动流程或身份 |

## Current Status

`PHASE_4_13_COMPLETE / LOCAL_COMMIT_ONLY / WAITING_FOR_MAINTAINER_PUSH`
