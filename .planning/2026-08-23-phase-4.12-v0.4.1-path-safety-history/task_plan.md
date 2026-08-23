# Task Plan: Phase 4.12 v0.4.1 path-safety history summary

## Goal

在`docs/history/`补充Phase 4.12摘要，准确记录`v0.4.1`兼容性path-safety patch train的缺陷、修复边界、验收结论与非目标，供后续维护恢复安全设计理由。

## Next Step

维护者push本地commit；本任务不执行任何远端写操作。

## Current Phase

Complete / maintainer push pending

## Phases

### Phase 1: Recover exact evidence

- [x] 核对v0.4.1列车身份、两条linked-parent缺陷与修复层次。
- [x] 核对unknown regular content、nested special entry及backup/mutation边界。
- [x] 确认历史摘要的immutable evidence与Release exclusion。
- **Status:** complete

### Phase 2: Write protected history

- [x] 新增Phase 4.12摘要并更新history索引。
- [x] 增加最小治理测试，保护核心安全语义与非Product Phase定位。
- **Status:** complete

### Phase 3: Validate and commit

- [x] 运行focused governance、完整回归和静态审计。
- [x] 验证三份未跟踪历史acceptance未修改、未暂存。
- [x] 创建单一范围本地commit并停止，交由维护者push。
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| Phase 4.12是回顾性patch-train摘要 | `v0.4.1`没有进入新的Product Phase |
| path topology与exact inventory admission分层说明 | 防止把linked/special拒绝边界误写成unknown regular content全面拒绝 |
| 不复制验收流水与测试计数 | history只保存稳定设计理由，真实资产/Cloud证据仍由provenance和acceptance负责 |

## Authorization

- 已授权：新增Phase 4.12 history摘要，完善索引与必要治理测试，运行本地验证并创建本地commit。
- 未授权：修改production、contracts、Release inputs、既有acceptance/provenance或任何远端状态。

## Stop Conditions

- 若源码、测试与用户给出的缺陷边界矛盾，先报告差异，不擅自改写结论。
- 若新增摘要进入Release allowlist或改变package identity，停止。
- 若三份历史reference无法安全隔离，停止且不提交。
- 本地commit后停止，等待维护者push。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Windows PowerShell把`docs\v0.4.1*`原样传给`rg`，触发`os error 123` | 1 | 改用精确文件名`docs\v0.4.1-cloud-hard-acceptance.md`；其余搜索结果有效且未发生写入 |
| planning状态补丁的目标段落顺序与实际文件不一致，`apply_patch`验证失败 | 1 | 补丁被完整拒绝、无部分写入；读取实际文件后按精确上下文拆分更新 |
| Phase 4.12首次实现测试要求关联术语位于同一物理行，正文正常换行导致失败 | 1 | 保留可读Markdown排版，把治理断言改为跨行关系检查；事实关键词与顺序不放宽 |

## Current Status

`COMPLETE / LOCAL_COMMIT_CREATED / MAINTAINER_PUSH_PENDING / PRODUCTION_EXCLUDED`
