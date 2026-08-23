# Task Plan: retirement link-integrity rule

## Goal

在repository governance authority中补齐清退acceptance/runbook/operator guide时的入链与断链审计规则，并用repository boundary test冻结，避免Phase history或其他current文档继续指向已删除root copy。

## Next Step

维护者按需 push 本地治理 commit；当前任务没有后续授权动作。

## Current Phase

Complete

## Phases

### Phase 1: Implement rule and contract

- [x] 更新repository-governance-guide的retirement DoD。
- [x] 增加repository-boundary规则断言。
- **Status:** completed

### Phase 2: Validate and commit

- [x] 运行focused/full regression与静态边界审计。
- [x] 创建本地commit并停止，交由维护者push。
- **Status:** completed

## Authorization

- 已授权：补充验收/教程清退时的入链、断链与替代authority规则；更新必要测试、planning并创建本地commit。
- 未授权：修改production/contracts/package/Release inputs或远端状态。

## Stop Conditions

- 不把规则实现成只检查Phase history的窄名单；所有current inbound references和tests/oracles都必须纳入。
- 不要求保留已清退root copy；链接应迁移到自包含摘要、仍在位current authority或immutable evidence。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 治理合同补丁中的JS字符串把正则`\n`展开为真实换行，apply_patch整体拒绝 | 1 | 目标文件无部分修改；改用bounded`[\s\S]`断言并重放 |
| focused test 的历史文字断言字符距离上限过紧 | 1 | 正文规则无误；改用精确句子，并只以`\s+`容忍排版换行 |

## Current Status

`COMPLETE`
