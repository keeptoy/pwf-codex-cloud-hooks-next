# Task Plan: Phase history renumbering

## Goal

把历史v0.4.0 Release discovery统一编号为Phase 4.12，并将原Phase 4.12、4.13依次顺延为Phase 4.13、4.14；保留历史语义、稳定锚点和准确引用，同时隔离维护者移入`临时文件/`的黑盒验收参考。

## Next Step

本地history renumbering commit已完成；停止并等待维护者push或授权临时验收文件的下一治理任务。

## Current Phase

Phase 4 / complete

## Phases

### Phase 1: Discover exact rename graph

- [x] 读取必需宏观文档与三个目标history文件。
- [x] 枚举旧文件名、Phase编号、稳定anchor和全仓引用。
- [x] 确认`临时文件/`用户改动只读保留且不纳入提交。
- **Status:** complete

### Phase 2: Freeze failing-first contracts

- [x] 更新必要治理测试，冻结新文件名、编号和引用。
- [x] 在旧结构上取得精确intentional red。
- **Status:** complete

### Phase 3: Renumber history and synchronize references

- [x] 给旧Phase 9正文追加改名尾注，再改名为Phase 4.12。
- [x] 原Phase 4.12顺延为4.13，原Phase 4.13顺延为4.14。
- [x] 同步README/history index、ROADMAP、active planning与测试中的准确引用；已关闭planning保留old naming时间语义。
- **Status:** complete

### Phase 4: Validate and commit

- [x] 运行focused governance、完整回归和静态审计。
- [x] 确认临时参考文件未修改、未暂存。
- [x] 创建单一范围本地commit并停止，交由维护者push。
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| 新历史顺序为Release discovery 4.12、path-safety 4.13、Release governance 4.14 | 与Phase 4时间线连续，去除历史standing Phase 9的编号例外 |
| 旧Phase 9先补尾注再改名 | 保留原始形成背景与后来治理解释，不伪装成当时就采用新编号 |
| `临时文件/`不纳入本任务commit | 它们是维护者提供的参考移动，归属独立于本次history renumbering |
| 新canonical anchors随4.12/4.13/4.14编号更新，旧anchors保留为alias | 仓库内引用准确，同时尽量保护已传播fragment |
| 已关闭planning保留旧文件名作为当时命名陈述，active planning记录old→new映射 | 旧字符串不是活链接；改写会伪造原授权与决策时间语义 |

## Authorization

- 已授权：重编号三个history文件、补尾注、同步仓库引用与必要治理测试、运行本地验证并创建本地commit。
- 未授权：修改`临时文件/`内容或其用户移动、production/contracts/package/Release inputs、版本acceptance/provenance及任何远端状态。

## Stop Conditions

- 若稳定外部anchor必须改写，优先保留兼容anchor并记录；无法兼容时先停止说明。
- 若临时参考与本任务目标文件发生归属冲突，停止且不覆盖。
- 本地commit后停止，等待维护者push。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 首个整块test补丁中的JS正则`\n`在编排字符串中被解释成实际换行，导致patch格式无效 | 1 | 补丁完整拒绝且无部分写入；拆成三个小补丁并双重转义反斜杠 |
| 新编号治理测试在旧目录结构上3/3失败 | 1 | 属于预期intentional red：分别缺少新4.12、4.13、4.14路径；进入materialization |
| PowerShell中的双引号`rg`正则被内层引号截断，后半段被解析为命令 | 1 | 前置status/diff已成功且无写入；后续改用单引号pattern，不重复原命令 |
| 第二次复合heading `rg`仍把带引号与管道的pattern拆成文件参数 | 1 | 输出已足以确认anchors；后续使用多个`-e`简单pattern或分别查询，停止复用复合表达式 |
| staged scope把3个rename source也要求出现在`git diff --cached --name-only`中 | 1 | Git rename检测只列canonical target；commit未执行，改为核对11个canonical paths并单独断言3条R状态 |

## Current Status

`PHASE_HISTORY_RENUMBERING_COMPLETE / LOCAL_COMMIT_ONLY / USER_TEMP_REFERENCES_EXCLUDED`
