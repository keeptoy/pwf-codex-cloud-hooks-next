# Task Plan: pre-1.0 ROADMAP anchor retirement

## Goal

删除无current入链的旧`phase-4-migration-lifecycle-governance`兼容anchor，并在ROADMAP冻结pre-1.0文档路径/anchor不自动承担历史兼容债的治理边界；历史内容继续由immutable tag/commit恢复。

## Next Step

维护者按需push本地治理commit；当前任务没有后续授权动作。

## Current Phase

Complete

## Phases

### Phase 1: Implement anchor retirement and policy

- [x] 删除旧Phase 4兼容anchor及对应存在性断言。
- [x] 冻结pre-1.0 canonical-link与alias retirement边界。
- **Status:** completed

### Phase 2: Validate and commit

- [x] 运行focused/full regression、反向复扫与静态边界审计。
- [x] 创建单一职责本地commit并停止，交由维护者push。
- **Status:** completed

## Authorization

- 已授权：删除旧ROADMAP兼容anchor；以`1.0`前优先清理历史包袱的版本策略同步current治理与测试；更新planning并创建本地commit。
- 未授权：改写immutable tag/历史内容、production/contracts/package/Release inputs或远端状态。

## Stop Conditions

- canonical `migration-transaction-lifecycle-governance` anchor必须保留。
- current tree若发现真实入链，必须迁移后再删除，不能制造断链。
- pre-1.0清理政策不能被写成允许破坏current canonical links或改写immutable history。
- 不在current contract中为单个已退役alias保留named tombstone；通用pre-1.0政策承担防回归职责。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 首次canonical anchor fixed-string复扫没有打印命中，但组合命令被后续`git status`覆盖为exit 0 | 1 | 用有界regex重新检查ROADMAP，确认canonical anchor仍在第283行；后续复扫显式检查每一步结果 |

## Current Status

`COMPLETE`
