# Phase 7：tool / permission Hook 必要性讨论

**状态：** Discovery 结论草案，不是已激活 Product Phase。
**Owner：** 当前 Phase 6–9 Cloud necessity discovery scope。
**预算：** 本轮总计一小时；每种 Hook 必须独立证明价值。
**Release 边界：** 本目录不进入 production dispatch 或 Release ZIP。

## 大白话：它想解决什么

Phase 7 想在模型调用工具前后、或者申请权限时插入提醒或检查。例如在危险命令前提醒边界，在工具完成后提示更新计划。
代价是每次工具调用都可能多一次 Hook：更慢、更吵、更耗 token，也可能让正常权限流程变复杂。

## 现在要不要实现

**结论：当前 `NO_GO`，三个 Hook 都不实现。**

目前没有一个已冻结、无法由现有 `SessionStart` / `UserPromptSubmit`、测试或普通工作流解决的具体用例。仅仅因为 Host
可能提供 `PreToolUse`、`PostToolUse`、`PermissionRequest`，不构成扩大 managed event set 的理由。Phase 7 也不是 Phase 8
的前置条件。

## 为什么本轮不写代码原型

没有 use case 的 prototype 只能证明“可以写一个回调”，不能证明产品收益，反而会偷偷替未来架构做决定。因此本轮不注册事件、
不伪造 latency 数字，也不把普通脚本输出叫作 Cloud 验证。

## 重新开启某个 Hook 的最低条件

每一种 Hook 必须单独回答：

1. 哪个真实用户问题只有这个时点能解决；
2. 不启用它会造成什么可复现失败；
3. 每次触发的 latency、token 和噪声上限；
4. child failure 如何 fail open，怎样避免抑制 canary/其他上下文；
5. 如何在真实 Cloud 测量触发频率、重复调用和权限拒绝路径；
6. 如何单独关闭和回滚，不影响现有两个事件。

满足条件后，只为获批的那一个 Hook 开正式 Discovery；其他 Hook 继续 `NO_GO`。

## 退出条件

保持零实现、零 production 变化。未来若没有新的可复现 use case，本结论无需因为 Phase 编号存在而重开。
