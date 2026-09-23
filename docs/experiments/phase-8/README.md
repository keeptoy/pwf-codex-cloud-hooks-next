# Phase 8：只读完成度提醒器必要性讨论

**状态：** Discovery 原型，不是已激活 Product Phase。
**Owner：** 当前 Phase 6–9 Cloud necessity discovery scope。
**预算：** 本轮总计一小时；原型必须 pure、bounded、non-recursive、无写入。
**Release 边界：** 本目录不进入 production dispatch 或 Release ZIP。

## 大白话：它想解决什么

模型准备停下时，Phase 8 想只读检查计划是否还有没做完的步骤或 blocker，然后提醒一句“还没完成”。它只是提醒，不拦截退出，
也不替模型修改 checkbox、counter、ledger 或任何工作区状态。

## 现在要不要实现

**结论：`CONDITIONAL_GO` 进入正式 Discovery；当前不进入 production。**

这个功能有明确价值：减少“还有明确待办却提前收工”。同时只读、advisory、fail-open 的边界比 hard gate 小，适合先独立验证，
无需等待 Phase 7。不过是否接入真实 completion/Stop 时点，仍取决于 Host 能力、递归行为、真实噪声和延迟证据。

## 本轮原型

`completion_evaluator.py` 只接受调用方已经解析好的有限状态，不读取文件、不写状态、不调用自身，也不执行外部命令：

- 没有 plan 或已经完成：返回 `silent`；
- 有未完成项或 blocker：返回一条有长度上限的 advisory；
- 输入不合法或超预算：报错，由未来 adapter 以 fail-open 方式丢弃；
- 输出不含路径、prompt、transcript 或任意 mutable token。

运行：

```bash
python3 tests/experiments/phase-8/test_completion_evaluator.py
printf '%s' '{"schema_version":1,"plan_exists":true,"incomplete":2,"blockers":0,"max_advisory_chars":160}' \
  | python3 tests/experiments/phase-8/completion_evaluator.py
```

## 原型没有证明什么

它没有证明 Host 存在合适的 completion event，没有证明 Stop Hook 不递归，没有测量真实 Cloud latency，也没有证明 advisory
文字在 UI 中可见。因此只能证明 pure evaluator 的最小决策核理论上可行，不能算 Phase 8 PASS。

## 正式 Discovery 的停止条件

- Host 没有 non-recursive、fail-open 的只读时点：`NO_GO`；
- 无 plan 静默、预算或递归负例失败：停止接入；
- 真实 Cloud 噪声/延迟超过冻结预算：`NO_GO` 或重新设计；
- 只有 exact source 的 Fresh、UserPrompt、Resume/compact 证据通过后，才讨论 production admission。
