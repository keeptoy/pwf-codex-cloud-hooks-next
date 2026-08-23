# Task Plan: historical document residue audit

## Goal

只读扫描当前仓库tracked与可见ignored/untracked文档，按current authority、warm history、active/completed planning、immutable-only reference和可疑历史残留分类，判断是否仍有应退役、迁移、去重或修复断链的历史文档。

## Next Step

向维护者报告残留分类；任何清退或测试迁移另行等待明确授权。

## Current Phase

Phase 3 / report and close complete

## Phases

### Phase 1: Authority and inventory recovery

- [x] 复读README、ARCHITECTURE、DESIGN、ROADMAP及活动账本。
- [x] 建立tracked/ignored/untracked文档和planning inventory。
- **Status:** complete

### Phase 2: Residue and link audit

- [x] 扫描retired filenames、legacy stage guides、duplicate authority、broken links与stale current references。
- [x] 按治理规则区分合法历史语义、可疑残留和明确缺陷。
- **Status:** complete

### Phase 3: Report and close

- [x] 运行相称的只读治理测试/审计并汇总结论。
- [x] 只报告证据与建议，不删除、迁移或修改production/docs正文。
- **Status:** complete

## Authorization

- 已授权：只读扫描当前仓库是否存在历史残留文档，并把分析证据写入本轮planning账本。
- 未授权：删除/移动/重命名文档、修复链接、改写authority、修改production/contracts/Release inputs或执行远端操作。

## Stop Conditions

- 不把带明确时间语义的history、acceptance、provenance或已关闭planning仅因“旧”判定为残留。
- 不把ignored维护者参考目录计入tracked repository residue，但要单独报告其存在与边界。
- 任何建议清退都必须先证明immutable恢复、current入链inventory和替代authority；本轮不执行。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Windows sandbox阻止Node test runner创建子进程，返回`spawn EPERM` | 1 | 按权限流程在沙箱外重跑同一组只读测试，7项全部PASS |

## Current Status

`HISTORICAL_DOCUMENT_RESIDUE_AUDIT_COMPLETE`
