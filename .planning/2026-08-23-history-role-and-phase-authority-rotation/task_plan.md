# Task Plan: history roles and Product Phase authority rotation

## Goal

在repository governance中明确`docs/history`的两种对象身份——回补型retrospective capsule与冻结型Discovery/decision record——并冻结ROADMAP第4节current train到第5节Product Phase authority的closeout/rotation规则，避免把所有history文件误当“一Phase一摘要”或把版本列车全文搬入Phase路线。

## Next Step

本轮治理已完成；等待维护者push本地commit，后续任务另建并切换active plan。

## Current Phase

Phase 3 / validate and commit — complete

## Phases

### Phase 1: Classify current history and contract

- [x] 分类现有history索引为retrospective capsule或frozen Discovery/decision record。
- [x] 冻结active train、Product Phase closeout、Release train rotation及patch/governance例外。
- **Status:** completed

### Phase 2: Implement governance synchronization

- [x] 更新repository-governance-guide与phase-history-template。
- [x] 更新docs/history/README role索引和ROADMAP最小摘要。
- [x] 更新architecture/repository governance contracts。
- **Status:** completed

### Phase 3: Validate and commit

- [x] 运行focused/full regression、link/role/Release边界审计。
- [x] 创建单一职责本地commit并停止，交由维护者push。
- **Status:** completed

## Authorization

- 已授权：按两种history角色与第4→第5节authority轮转模型同步治理指南、模板、索引、ROADMAP、测试和planning并创建本地commit。
- 未授权：重命名既有history文件、改写原始Discovery结论、修改production/contracts/package/Release inputs或任何远端状态。

## Stop Conditions

- 不把frozen Discovery record压缩成retrospective capsule，也不对其应用“一Product Phase一份”的数量限制。
- 不允许活动或纯patch/governance列车为了轮转而虚构新的Product Phase。
- 第5节只接收长期Product结论；版本资产、Cloud流水、SHA与Release角色仍归CHANGELOG/provenance/acceptance/ROADMAP相应authority。
- 既有history正文只做必要link maintenance；角色分类放在索引/治理层，不批量回写历史文件。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| focused repository-boundary在默认沙箱内调用Git时得到child status `null`，尚未执行到新增role断言 | 1 | 分类为Windows sandbox子进程限制；改用已批准的沙箱外Node测试路由，并把architecture/static检查拆开运行 |
| focused architecture contract在默认沙箱的Node test runner启动child时得到`spawn EPERM` | 1 | 同属Windows sandbox子进程限制；改用沙箱外Node测试路由，静态检查仍独立运行 |
| 首次完整回归有1项retirement contract仍期待旧词`自包含Phase摘要` | 1 | 分类为test drift；将断言同步为两种role共享的`自包含history record`，不改变retirement边界 |

## Current Status

`HISTORY_ROLE_AND_PHASE_AUTHORITY_COMPLETE`
