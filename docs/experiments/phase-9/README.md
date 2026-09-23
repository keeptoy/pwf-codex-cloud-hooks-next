# Phase 9：强制完成门禁必要性讨论

**状态：** Discovery 结论草案，不是已激活 Product Phase。
**Owner：** 当前 Phase 6–9 Cloud necessity discovery scope。
**预算：** 本轮总计一小时；禁止创建 writer/counter/lock 或 production gate。
**Release 边界：** 本目录不进入 production dispatch 或 Release ZIP。

## 大白话：它想解决什么

Phase 8 只会提醒，Phase 9 则可能真的不让任务结束，直到计划满足条件。为了避免无限卡住，它还得可靠记录拦截次数，提供上限、
逃生开关和卡死状态，并在 cache、Resume、并发、崩溃和 rollback 后保持一致。

## 现在要不要实现

**结论：当前 `NO_GO / DEFER`。**

Phase 8 的只读 evaluator 尚未经过真实 Cloud 验证，目前没有证据证明 advisory 不够用。现在直接做 hard gate，会同时引入阻断行为、
mutable state、原子写、锁、恢复和回滚风险，收益没有覆盖复杂度。

## 为什么本轮不写代码原型

单进程内存 counter 或临时文件 demo 无法代表真实 Host 的并发、重试、cache 和 Resume；这种“能加一”原型很容易制造虚假信心。
ROADMAP 也明确要求 implementation 前重新 Discovery writer/counter/atomicity/lock/cache/Resume/rollback，并禁止把上游
best-effort shell lock 当成 managed authority。因此本轮刻意不实现任何 writer 或 gate。

## 未来重新考虑的前置条件

1. Phase 8 已以 exact source 在真实 Cloud 通过；
2. 有证据显示只读 advisory 在重要场景持续不足；
3. Host 明确支持安全的 completion blocking 和 bounded retry；
4. 冻结 counter owner、原子提交点、锁模型、cache/Resume identity 和 crash recovery；
5. 冻结 block cap、escape hatch、stall state、disarm-first rollback；
6. 全部 mutable state 都有 tamper、symlink、partial-write 和重复事件负例。

## 退出条件

在上述条件齐备前保持零实现。Phase 8 若已解决提前停止问题，Phase 9 应永久 `NO_GO`；不能因为版本号已经预留就实施。
