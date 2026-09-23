# Phase 6：compaction lifecycle 必要性讨论

**状态：** Discovery 原型，不是已激活 Product Phase。
**Owner：** 当前 Phase 6–9 Cloud necessity discovery scope。
**预算：** 本轮总计一小时；不得修改 production、managed policy 或 Host contract。
**Release 边界：** 本目录位于 `docs/`，不进入 production dispatch 或 Release ZIP。

## 大白话：它想解决什么

长对话会压缩上下文。Phase 6 想确认压缩前后，planning 文件里的当前任务、进度和关键决定还能不能稳定地重新交给模型。
它不是为了“多装两个 Hook”，而是为了避免压缩后模型忘记正在做什么，或者重复已经做过的工作。

## 现在要不要实现

**结论：`DISCOVER_FIRST`，问题值得查，但现在不能决定新增功能。**

现有 production 已接受 `SessionStart source=clear|compact`。在没有真实 Host 时序和 payload 证据前，不能证明
`PreCompact`、`PostCompact` 比现有入口多解决了什么。先观察；若现有事件足够，则 Phase 6 应以“不新增 managed event”收束。

## 本轮原型

`lifecycle_probe.py` 是只读 JSONL 轨迹汇总器。它验证我们能否用一个有界工具整理真实 Cloud 观察结果：

- 只接受已知事件与 source；
- 限制记录数、单行字节数和总输入字节数；
- 只报告事件计数和顺序，不保存 prompt、transcript 或其他内容；
- 明确返回 `INSUFFICIENT_EVIDENCE`，不会凭事件出现就声称 context 已恢复。

运行：

```bash
python3 tests/experiments/phase-6/test_lifecycle_probe.py
printf '%s\n' \
  '{"event":"SessionStart","source":"compact"}' \
  '{"event":"UserPromptSubmit","source":null}' \
  | python3 tests/experiments/phase-6/lifecycle_probe.py
```

## 真正 Cloud Discovery 还缺什么

1. 经专项设计批准的事件观察方式，不能临时扩大 production policy；
2. compact/clear 前后真实 payload 和事件顺序；
3. 压缩后 plan、progress 和决策是否恢复的黑盒断言；
4. 重复、缺失、乱序、Resume 和超预算场景；
5. 基于 exact source 的 Fresh/Resume 证据。

## 退出条件

- 现有 `SessionStart source=clear|compact` 足够：`NO_GO` 新事件，提升“保持现状”结论并删除原型；
- 发现可复现的 context/时序缺口：另开正式 Discovery，冻结 Host ABI、失败语义、预算和 Cloud gate；
- 无法安全取得真实事件：保持 pending，不用模拟数据冒充 Cloud PASS。
