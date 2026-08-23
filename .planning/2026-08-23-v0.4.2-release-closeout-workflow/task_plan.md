# Task Plan: v0.4.2 Release closeout workflow governance

## Goal

把两个retirement review从强制standing Phase 9中解耦，作为Release流程前后的治理检查点；普通获批RC只运行Source/Candidate与Published Release两次Cloud验收，并保持tag精确指向第一阶段实际验收通过的候选commit。

## Next Step

维护者将本地`0.4.2`分支push到远端；本任务停止，不进入Cloud、tag、package或Release操作。

## Current Phase

Complete / local handoff

## Phases

### Phase 1: Recover authorities and freeze the workflow

- [x] 复核README、ARCHITECTURE、DESIGN、ROADMAP、Release/Operator Guide模板与治理指南。
- [x] 冻结“两个退役检查点、无强制Phase 9、两次Cloud、两次状态写回”的默认流程。
- [x] 冻结Source/Candidate HEAD、第一阶段checkpoint commit与最终closeout commit的身份边界。
- **Status:** complete

### Phase 2: Add failing-first governance contracts

- [x] 保护普通Release不需要standing Phase 9或P9-A～F。
- [x] 保护retirement checkpoint 1/2嵌入Release进入/退出边界且不产生Cloud轮次。
- [x] 保护tag指向Source/Candidate Cloud实际通过的exact candidate HEAD。
- **Status:** complete / intentional red confirmed

### Phase 3: Synchronize documentation authorities

- [x] 更新ROADMAP、Cloud hard template、Operator Guide template及必要治理入口。
- [x] 保持历史P9材料、历史acceptance和已发布身份不可变。
- [x] 不修改production、Release inputs、package identity或可执行Cloud脚本。
- **Status:** complete

### Phase 4: Validate and create one local commit

- [x] 运行focused governance、完整回归、Release排除与范围审计。
- [x] 验证三份历史参考acceptance未修改、未暂存。
- [x] 创建单一范围本地commit并停止，交由维护者push。
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| 保留两个retirement checkpoint，但取消每条列车强制进入standing Phase 9 | 安全性来自候选准入、双通道身份和退出条件，不来自固定Phase编号 |
| 第一检查点是Source/Candidate进入条件，第二检查点是Latest/postflight后的Release退出条件 | 两类对象只能在不同生命周期时点安全判断，但不需要额外Cloud验收 |
| 普通Release只有Source/Candidate与Published Release两次Cloud执行 | Pre-release publication与Latest promotion是维护者控制面动作 |
| tag精确指向Source/Candidate Cloud实际PASS的候选commit | 状态写回commit只记账，不替代经过Cloud验收的源码身份 |

## Authorization

- 已授权：按维护者确认的模型同步多个治理文档、相应契约测试和本planning；运行风险相称本地验证并创建本地commit。
- 未授权：修改历史acceptance/P9证据、production、contracts、runtime、manifest、package identity、Release输入或可执行Cloud脚本；执行Cloud、push、tag、PR、Release、Latest或其他远端写。

## Stop Conditions

- 若实现需要修改Release artifact字节、Cloud可执行脚本、Host ABI、trusted graph或package identity，停止并先请维护者扩展授权。
- 若用户补回的三个历史acceptance与本任务无法安全分离，停止且不提交。
- 若回归出现真实治理或产品失败，不弱化断言；记录、分类并修正。
- 本地commit后停止，等待维护者push。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| ROADMAP首次整块patch因8.1表格原文`Pre-release 并`的空格与patch context不一致而原子拒绝 | 1 | 确认未发生部分写入；改用4.3/Product Phase/8.1三个独立context patch，不重复整块失败方式 |
| 静态审计中的`node -p` package表达式被PowerShell转义为非法JavaScript，版本输出为空 | 1 | 其他审计项已PASS；改用PowerShell`ConvertFrom-Json`读取`package.json.version`，不重复跨shell引号方式 |

## Current Status

`V0_4_2_RELEASE_CLOSEOUT_COMPLETE / LOCAL_COMMIT_READY / PACKAGE_IDENTITY_0_4_1`
