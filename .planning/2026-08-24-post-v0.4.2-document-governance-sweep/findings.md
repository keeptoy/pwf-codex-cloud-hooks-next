# Findings & Decisions: post-v0.4.2 文档治理扫尾 Discovery

## Requirements

- 新建并激活一份 post-v0.4.2 文档治理扫尾 Discovery 计划。
- 不自动清退已关闭的 v0.4.2 planning；多个 planning scope 可承担复杂项目多轮 Discovery 的相邻上下文恢复。
- 删除 current test 对“仓库只能存在一个 planning scope”的强制要求。
- 后续检查“临时授权”等一次性事故叙事是否泄漏到稳定测试与模板。

## Confirmed Findings

### 唯一 planning scope 断言的来源

- `tests/repository-boundary.test.js` 的 planning lifecycle test 最早只验证 active pointer 格式、active scope 三件套和 active state。
- `docs/repository-governance-guide.md#planning-lifecycle` 明确允许 current tree 按维护者节奏暂时保留完整 completed scope；切换 `.active_plan` 不自动产生删除授权。
- `tests/f3-lifecycle-helpers.js::validatePlanningScopes` 原生支持一个 active scope 加若干 inactive scope；inactive scope 必须严格只含 `task_plan.md`、`findings.md`、`progress.md`。
- `assert.deepEqual(planningScopes, [activePlan], ...)` 直到 2026-08-24 的 commit `33deb5870015c94df329fe233e306363ba43232b` 才出现。
- 同一 commit 刚完成 24 个非活动 planning scope 的获批 C2 清退，并记录“最终只剩 1 个活动 planning”。因此该断言是在保护一次 closeout 结果，而不是早期稳定生命周期合同。
- 把该快照提升为永久不变量会阻止正常的新 scope rollover，并与治理指南和底层 validator 直接冲突；应退役这条额外断言，不削弱原有结构安全检查。

### “临时授权”历史与稳定合同的初始分类

- `docs/acceptance/v0.4.2-cloud-hard-acceptance.md` 中“首次安全停止 → 维护者临时授权 exact-path 只读 Shell → C～F PASS”是真实版本验收时间线，应作为 immutable historical evidence 保留。
- `docs/history/phase-4.14-release-closeout-governance.md` 可以保留该事故如何推动稳定协议修正的历史理由。
- `docs/cloud-hard-acceptance-template.md` 当前已经把临时处置归一化为稳定协议：优先使用独立只读文件工具；缺少该能力时允许严格限定的 exact-path 只读 Shell preflight；正文写入仍只能使用 `apply_patch`。
- current tests 若继续强制匹配“临时授权”字样、事件顺序或某版本专用叙事，属于 snapshot/history coupling 候选；稳定测试应优先保护工具能力边界、只读约束、停止条件和禁止写操作。
- 是否移除这些具体断言尚未获授权，Phase 2 先完整盘点并提交建议。

## Technical Decisions

| Decision | Rationale |
|---|---|
| planning 数量不是安全不变量 | 安全边界是 active pointer 唯一、scope 路径合法、inactive 只有三件套；目录数量属于维护者治理节奏。 |
| C2 清退事实留在 acceptance/history/Git | current regression 不应让一次版本 closeout 快照支配所有后续 Discovery。 |
| 历史叙事和稳定协议分层测试 | 既不抹掉真实验收过程，也避免长期测试依赖事故措辞和自然语言词序。 |

## Issues Encountered

| Issue | Resolution |
|---|---|
| 新建 scope 会触发 8 月 24 日新增的唯一-scope断言 | 追溯确认是 C2 快照过度泛化；维护者明确授权删除该要求并保留旧 scope。 |

## Resources

- `docs/repository-governance-guide.md#planning-lifecycle`
- `tests/repository-boundary.test.js`
- `tests/f3-lifecycle-helpers.js`
- commit `33deb5870015c94df329fe233e306363ba43232b`
- `docs/acceptance/v0.4.2-cloud-hard-acceptance.md`
- `docs/cloud-hard-acceptance-template.md`
- `docs/history/phase-4.14-release-closeout-governance.md`
