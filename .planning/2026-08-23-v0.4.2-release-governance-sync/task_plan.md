# Task Plan: v0.4.2 Release governance synchronization

## Goal

把Product Discovery验收轮次、Release双通道与两轮retirement review明确拆成三个独立维度，并在不改变production、Release字节、package identity或历史验收事实的前提下，同步ROADMAP、Operator Guide/Cloud协议模板、治理authority与契约测试。

## Next Step

维护者将本地`0.4.2`分支push到远端；本任务停止，不进入Cloud、package或Release流程。

## Current Phase

Complete / local handoff

## Phases

### Phase 1: Recover authorities and freeze semantics

- [x] 复核README、ARCHITECTURE、DESIGN、ROADMAP、两套Cloud模板与治理指南。
- [x] 冻结三个独立维度：Discovery acceptance、Release channels、retirement reviews。
- [x] 冻结同一Release guide的channel checkpoint与最终Post-run/freeze语义。
- **Status:** complete

### Phase 2: Add failing-first governance contracts

- [x] 保护ROADMAP四步Release流程、两次Cloud执行与两次控制面动作的分工。
- [x] 保护channel checkpoint不是新的Discovery Round或最终Post-run。
- [x] 保护retirement review不是Cloud acceptance。
- **Status:** complete / intentional red confirmed

### Phase 3: Synchronize documentation authorities

- [x] 更新ROADMAP、Cloud hard template、Operator Guide template、repository governance与DESIGN。
- [x] 保持历史acceptance/runbook/operator guide原名和时间语义。
- [x] 不改变README/AGENTS/MAINTAINER_HANDOFF、production、contracts、runtime、manifest、package或Release输入。
- **Status:** complete

### Phase 4: Validate and create one local commit

- [x] 运行focused governance、完整回归、Release排除与范围审计。
- [x] 验证三份历史参考acceptance按原SHA-256恢复且未暂存。
- [x] 创建单一范围本地commit并停止，交由维护者push。
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| Product验收按正式Discovery Round计数 | 新risk/behavior claim才产生新产品验收，gate/task/stage不是计数单位 |
| 真正发布固定保留Source/Candidate与Published Release两个独立通道 | 前者证明final source/candidate bytes，后者证明public URL/bootstrap/default-download bytes；身份和环境不可合并 |
| 两个Release通道不产生两个Product Discovery Round，也不要求两份guide | single-Discovery版本可由一份Release operator guide编排两个channel checkpoint |
| Guide在Source/Candidate后记录中间channel checkpoint但不冻结 | 正常等待维护者publication不是INCOMPLETE；只有声明范围全部闭合后才追加最终Post-run并freeze |
| Release四步中第1/3步是Cloud验收，第2/4步是维护者控制面动作与核验 | 避免把tag/upload/Latest误称为额外黑盒轮次 |
| 两轮retirement review继续保留但明确不是验收 | 它们分别处理candidate closeout和accepted role rotation时的RETIRE/MIGRATE/KEEP判断 |
| exact final-source Discovery证据可在identity与所有Release输入不变时承担Source/Candidate | 防止机械重跑；任一相关输入变化则必须重新执行最终candidate通道 |

## Authorization

- 已授权：按维护者确认的上述模型同步多个治理文档、相应契约测试和本planning；运行风险相称本地验证并创建单一范围本地commit。
- 未授权：修改历史acceptance证据、README、AGENTS、MAINTAINER_HANDOFF、production、contracts、runtime、manifest、package identity、Release输入；执行Cloud、push、tag、PR、Release、Latest或其他远端写。

## Stop Conditions

- 若实现需要改变可执行Cloud脚本、production behavior、Host ABI、trusted graph、Release inventory或package identity，停止并先请维护者扩展授权。
- 若三个历史参考acceptance无法按原SHA-256恢复，或与本任务改动无法安全分离，停止且不提交。
- 若focused/full回归出现真实治理或产品失败，不弱化断言；先记录、分类和修正。
- 本地commit后停止，等待维护者push；不进入真实Release流程。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 恢复读取中使用三位置参数`Join-Path '.planning' $active 'task_plan.md'`，Windows PowerShell拒绝第三个位置参数 | 1 | 改用两次嵌套`Join-Path`并成功读取旧活动计划；未发生文件写入 |
| 首轮实现后focused为17 pass / 3 fail；旧断言仍冻结`Phase closeout`与旧Post-run表格措辞，新正则又只接受“不冻结”而文档写“不会冻结” | 1 | 同步旧断言到获批新authority，并把语义正则改为接受“不冻结/不会冻结”；不删除Release、retirement或final-status断言 |
| 提交收尾时直接运行Node focused tests被当前沙箱以`spawn EPERM`拒绝启动test worker | 1 | 分类为sandbox permission，不是产品或断言失败；保持文件不变并在授权执行面重跑同一命令 |
| 授权执行面focused首跑为18 pass / 2 fail；命令漏用了既定reference isolation，边界测试因此看见三份维护者补回的untracked历史acceptance | 1 | 三份文件SHA-256仍与入场值一致；按既定fixture隔离在`try/finally`中临时移出、测试后原样恢复，再运行同一20项测试 |

## Current Status

`V0_4_2_RELEASE_GOVERNANCE_COMPLETE / LOCAL_COMMIT_READY / PACKAGE_IDENTITY_0_4_1`
