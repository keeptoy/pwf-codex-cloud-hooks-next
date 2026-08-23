# Task Plan: Phase history alias-anchor retirement

## Goal

退役Phase 4.13与Phase 4.14中因历史改号遗留、已无current文档入链的18个兼容alias anchors，并同步移除只为这些旧alias存在而设置的测试断言；保留canonical anchors、历史正文和有效链接。

## Next Step

向维护者交接本地retirement commit；不执行push或扩大到completed planning清退。

## Current Phase

Phase 3 / verification and commit complete

## Phases

### Phase 1: Authority and exact target recovery

- [x] 复读README、ARCHITECTURE、DESIGN、ROADMAP及当前治理账本。
- [x] 核对18个旧alias在仓库内没有测试之外的入链。
- **Status:** complete

### Phase 2: Bounded retirement

- [x] 从Phase 4.13删除8个旧`phase-4-12-*` aliases。
- [x] 从Phase 4.14删除10个旧`phase-4-13-*` aliases。
- [x] 删除仅冻结旧alias的测试断言，保留canonical anchor与入链断言。
- **Status:** complete

### Phase 3: Verification and commit

- [x] 运行anchor、history、planning与repository-boundary聚焦测试和`git diff --check`。
- [x] 核对diff范围后创建单一职责本地commit，不执行push。
- **Status:** complete

## Authorization

- 已授权：处理Phase 4.13/4.14共18个改号前兼容alias anchor残留，并同步必要测试。
- 未授权：删除history正文/文件、清理completed planning、改动production/contracts/Release inputs或执行远端操作。

## Stop Conditions

- 若任一旧alias仍被tests之外的current文档引用，停止删除并先报告。
- canonical `phase-4-13-*`与`phase-4-14-*` anchors及其现有入链不得改变。
- 不把Phase 4.12的原始`phase-9-v0-4-0-*`历史证据anchor纳入本次范围。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell把包含双引号与`|`的最终`rg`定位表达式拆成命令，返回command-not-found | 1 | 改用`Select-String`完成同一只读定位；不影响修改或验证结果 |

## Current Status

`PHASE_HISTORY_ALIAS_RETIREMENT_COMPLETE`
