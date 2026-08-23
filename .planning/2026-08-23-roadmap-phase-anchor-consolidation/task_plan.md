# Task Plan: ROADMAP Phase anchor consolidation

## Goal

保留维护者把ROADMAP第5节整理为“每个小节对应一个Product Phase”的层级改动，把Phase 4三个子节anchor收敛为一个`product-phase-4`入口，并在同一retirement transaction中迁移current入链、更新测试和完成删除后复扫。

## Next Step

维护者按需push本地治理commit；当前任务没有后续授权动作。

## Current Phase

Complete

## Phases

### Phase 1: Implement atomic link migration

- [x] 保留维护者的5.1.1～5.1.3标题层级调整。
- [x] 新增一个Phase 4级canonical anchor并删除三个子节anchor。
- [x] 迁移ROADMAP自链接、两份Phase history链接和测试。
- **Status:** completed

### Phase 2: Validate and commit

- [x] 运行focused/full regression、旧anchor反向复扫和canonical入链审计。
- [x] 创建单一职责本地commit并停止，交由维护者push。
- **Status:** completed

## Authorization

- 已授权：按维护者确认的“一个Phase一个入口”方案继续；保留其ROADMAP标题改动，迁移相关history/tests/planning并创建本地commit。
- 未授权：改写历史事实、production/contracts/package/Release inputs或任何远端状态。

## Stop Conditions

- 不覆盖或还原维护者尚未提交的ROADMAP标题层级改动。
- 删除旧anchor前必须迁移3条current authority链接；planning中的时间语义文字不批量改写。
- 新链接必须指向显式英文anchor，不使用编号/中文自动heading slug。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| None | 0 | — |

## Current Status

`COMPLETE`
