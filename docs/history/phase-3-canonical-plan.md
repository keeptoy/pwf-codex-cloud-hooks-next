<a name="historical-position"></a>

# v0.3.0 Phase 3：Canonical Owned Plan

## Historical position

Phase 3 在 `v0.3.0-beta.1` 完成 Phase 1～3 的最小完整功能闭环：两个 Hook 事件都通过 owned-plan 获得
canonical plan context，SessionStart 再运行 owned catch-up。`v0.3.0-beta.2` 保持相同行为，补齐文档治理、
独立 immutable assets 和可重放验收后成为 successor 迁移来源。

<a name="problem-before"></a>

## Problem before

Phase 2 激活 catch-up 后，adapter 内仍保留自己的 plan resolution/rendering，upstream resolver/injector 也会
自行解析环境和 Phase 4 markers。两条 plan 路径可能对同一项目得出不同状态；直接调用 pristine injector
又会把 ambient mode、文件竞争和未授权行为带进 production trusted graph。

<a name="core-decisions"></a>

## Core decisions

- `owned-plan.py` 成为唯一 plan authority，两个事件都由 thin adapter 监督该 sibling；SessionStart 把同一
  exact-v1 project state 交给 `owned-catchup.py`。
- pristine resolver/injector 只能在 private bounded snapshot 中调用：先对真实项目做 contained safe read，
  再只投影 task/progress，清除 ambient mode inputs，并严格验证 timeout、framing、UTF-8 与总预算。
- 在当时比较的多目标 overlay、受控快照、上游正式协议、Host-native IR、OS 虚拟化和官方原生支持中，
  选择受控快照作为可立即落地的路线：它保持 resolver/injector pristine，又不把 Phase 4 marker 或第二个
  upstream patch point 带入当前 trusted graph。多目标 overlay 只在快照无法满足真实文件语义、权限或清理
  要求时重新打开。
- 上游结构化调用协议或 Codex Cloud 原生 Skill Hook 是快照层的明确迁移/退休条件；单一 PWF 样本不足以
  证明通用 Driver manifest 或 Host-native IR，OS 级虚拟化也不能在平台能力未形成合同时成为默认前提。
- 只有 `context_emitted` 可以注入；race、symlink/hard-link、invalid input、child failure、timeout 或 oversized
  output 都保留 canary、整段不注入。
- 激活时删除 adapter 的平行 plan algorithm；machine schemas 保持 exact v1，生命周期晋级本身不改协议名。

<a name="completed-delivery"></a>

## Completed delivery

- 新增并安装 exact request/result schemas 与 `owned-plan.py`，在激活前先完成 inactive inventory、doctor、
  safe-read、snapshot cleanup、deadline 和 cross-user 证据。
- adapter 对 SessionStart/UserPromptSubmit 统一执行 owned-plan；SessionStart 再执行 catch-up，并按 canary、
  catch-up、plan 的固定顺序输出已验证上下文。
- private snapshot 强制 managed-legacy 行为，允许复用 pinned pristine upstream resolver/injector，同时隔离
  `.mode`、attestation、nonce、smart injection 和 ledger 等 Phase 4 输入。

<a name="acceptance-conclusion"></a>

## Acceptance conclusion

beta.1 完成 exact-byte seal、publication/download 和 Fresh/Resume Cloud A～F，证明 canonical plan、真实
resume catch-up、UserPrompt plan-only、failure degradation、doctor 和 snapshot residue 边界成立。beta.2
没有改变 production runtime/installer/contracts/trusted graph；它用新的 immutable identity 重新完成封板、
下载、安装和 Cloud 验收，并把文档与后继迁移边界收口。

<a name="explicit-non-goals"></a>

## Explicit non-goals

- 不新增 Hook event，不改变 Managed policy 的 adapter-only 入口。
- 不启用 upstream v3 attestation、nonce、autonomous/gated/smart modes、ledger mutation 或 completion gating。
- feasibility spike、逐 Round activation 文档和测试日志不进入 production runtime 或 Release artifact。

<a name="successor-inheritance"></a>

## Successor inheritance

Phase 3 固定的 thin adapter、owned-plan、owned-catchup、single project state、private snapshot 与 fail-open loop/
fail-closed injection 语义成为 stable v0.3.0 的 canonical runtime。后续 successor 迁移只通过 M1 exact mirror、
M2 slim transformation、M3 Cloud equivalence 与 M4 authority cutover 改变仓库归属，没有重新定义该行为。
Private snapshot 是当前 PWF integration driver 的实现策略，不是通用 Host ABI；只有第二个只读集成或上游/
Host 正式协议提供新证据后，才重新决定抽象、替换或退休边界。

<a name="immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b)

该 snapshot 中的 `docs/phase-3-upstream-invocation-options.md` 保存 A～F 原始路线比较；它只证明本文的历史
来源，不解释当前实现。当前 contract 与行为以当前仓库 authority 为准。
