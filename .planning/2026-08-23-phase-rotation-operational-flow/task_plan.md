# Task Plan: Product Phase rotation operational flow

## Goal

把repository governance中已有的ROADMAP第4节→Discovery history→第5节Product Phase authority→版本列车轮转规则，补成维护者可以直接照着执行的大白话状态流；同时收窄multi-Phase与patch/governance例外，避免仅凭版本号虚构或遗漏Product Phase归属。

## Next Step

本轮修订已完成；等待维护者push，后续任务另建并切换active plan。

## Current Phase

Phase 3 / validate and commit — complete

## Phases

### Phase 1: Evidence and rule refinement

- [x] 复核guide、ROADMAP、history template/index与既有tests。
- [x] 冻结单Phase默认、多Phase显式授权及patch/governance归属判断。
- **Status:** completed

### Phase 2: Documentation and contract synchronization

- [x] 在guide加入完整大白话状态流和例外判断。
- [x] 视唯一authority边界同步ROADMAP最小措辞与tests；template/index无需重复programme判断。
- **Status:** completed

### Phase 3: Validate and commit

- [x] 运行focused/full regression与link/Release边界审计。
- [x] 创建单一职责本地commit并停止，交由维护者push。
- **Status:** completed

## Authorization

- 已授权：补充Product Phase/Discovery/列车轮转的大白话流程，分析并收窄multi-Phase与patch/governance例外，同步必要文档、tests和planning，创建本地commit。
- 未授权：修改production/contracts/package/Release inputs、改写既有history事实、push或任何远端branch/tag/Release操作。

## Stop Conditions

- 不把版本号本身当作Product Phase identity；语义归属不确定时必须触发维护者对话确认。
- 当前默认一条版本列车对应一个Product Phase；多Product Phase合并列车只有维护者明确授权后才适用。
- patch/governance结果按其实际继承对象、当前版本系列和authority类型落位，不为了迁移ROADMAP第4节虚构第5节条目。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| focused ROADMAP contract因改写后拆开既有稳定短语`patch/governance列车没有新Product Phase时不得虚构条目`而失败 | 1 | 恢复该准确短语，同时保留新增的baseline/version-series归属判断；不放宽契约 |

## Current Status

`PHASE_ROTATION_FLOW_COMPLETE`
