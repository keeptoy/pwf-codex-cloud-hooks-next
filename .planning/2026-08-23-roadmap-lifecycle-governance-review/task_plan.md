# Task Plan: ROADMAP lifecycle governance review

## Goal

审查并冻结ROADMAP下一轮结构：把Phase 5～8已采纳边界收敛到路线表、修复F2四开关引用、将迁移transaction与对象生命周期提升为Discovery之后的版本无关章节，并决定history第二入口及phase-history-template的后实施/后live状态模型。

## Next Step

任务已完成；等待维护者审阅并push本地commit，未来新任务另建活动plan。

## Current Phase

Complete

## Phases

### Phase 1: Recover exact current contracts

- [x] 读取ROADMAP目标章节、Phase 4.8尾注和history模板。
- [x] 定位history单一入口、章节编号和稳定anchor测试合同。
- [x] 分类表格可吸收内容与必须提升为独立章节的通用治理内容。
- **Status:** complete

### Phase 2: Freeze proposal for maintainer review

- [x] 给出ROADMAP重排、history第二入口和模板状态段的建议模型。
- [x] 明确哪些是必须改、哪些是可选、不应机械复制的内容。
- [x] 等待维护者确认后再修改文件。
- **Status:** complete

### Phase 3: Implement approved structure

- [x] 更新ROADMAP、history入口合同、模板和必要治理测试。
- [x] 运行failing-first与focused验证。
- **Status:** complete

### Phase 4: Validate and commit

- [x] 运行完整回归、静态审计并保护`临时文件/`用户布局。
- [x] 创建单一范围本地commit并停止，交由维护者push。
- **Status:** complete

## Initial hypotheses

| Hypothesis | Audit question |
|---|---|
| 5.5应吸收到Phase 5～8大表格 | 是否能保持每个Phase一行、避免把通用gate规则塞进单元格 |
| 5.4应提升为Discovery后的独立章节 | 内容是否跨Phase/Release复用，且Phase 4.8偏差尾注能否作为历史证据而非规范正文 |
| README与ROADMAP可成为history唯二入口 | ROADMAP应只链接history索引，还是允许链接直接相关的exact Phase摘要 |
| 模板应提供可选post-status结构 | 如何避免空段、预填PASS和每轮都机械创建两个尾注 |

## Authorization

- 已授权：按已冻结方案修改ROADMAP、history入口合同、phase-history-template及测试，运行验证并创建本地commit。
- 未授权：修改`临时文件/`及其用户移动、production/contracts/package/Release inputs或远端状态。

## Stop Conditions

- history第二入口的粒度未冻结前，不修改单一入口测试。
- 模板状态段若会把可选尾注误变成每Phase强制流程，停止并重新收窄。
- 发现稳定anchor需迁移时保留anchor，不以章节编号替代链接合同。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Windows sandbox对`node --test <files>`返回`spawn EPERM`，未到达测试断言 | 1 | 分类为runner执行面限制；改用`node <test-file>`与`--test-name-pattern`原进程运行，取得真实红/绿证据 |
| 完整回归隔离脚本用三段`Join-Path`拼接guide目标，在当前PowerShell参数绑定失败 | 1 | `finally`已把整个用户目录归位；复核7个文件名称、大小和SHA全部一致，改用嵌套两段路径拼接后重跑 |

## Current Status

`COMPLETE / LOCAL_COMMIT_READY / USER_TEMP_REFERENCES_EXCLUDED`
