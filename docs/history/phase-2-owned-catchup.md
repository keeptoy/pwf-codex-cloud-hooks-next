<a name="historical-position"></a>

# v0.3.0 Phase 2：Owned Catch-up

## Historical position

Phase 2 对应 `v0.3.0-alpha.2`。它在 Phase 1 已验证的 inventory 上首次激活 repository-owned catch-up，
同时保持 Managed policy 只注册 adapter；当时 UserPromptSubmit 的 canonical owned-plan 尚未进入 Phase 3。

<a name="problem-before"></a>

## Problem before

Phase 1 已能确定性重建和安装 runtime，但生产行为仍缺少受控 child supervisor。若直接调用 global Skill
中的 `session-catchup.py`，其字节、安装位置和运行时环境都不属于 owned trusted graph；若 transcript
选择、session/project identity 或 child stdout 只做宽松检查，又可能把错误会话或 partial context 注入。

<a name="core-decisions"></a>

## Core decisions

- `owned-catchup.py` 作为 adapter sibling 消费严格 v1 request、产生严格 v1 result；Managed policy 仍只认识
  `hook_adapter.py`，child runtime 不是平台 handler。
- transcript selection 只接受显式 allowed roots 内、regular non-symlink、rollout shape 正确且 session/cwd
  identity 匹配的文件；scan 只是请求明确允许的 compatibility fallback。
- selected transcript 按 strict UTF-8/JSONL、record budget 和消息族规则归一化；任何 malformed、身份错误、
  oversized 或不完整结果都整段不注入。
- advisory child failure 对 Codex loop fail open，但对内容注入 fail closed；canary 和已经验证的本地 plan
  context 不被 catch-up 单点失败吞掉。

<a name="completed-delivery"></a>

## Completed delivery

- adapter 统一解析 project plan precedence、session attachment 与 `PLANNING_DISABLED`，构造 bounded request
  并监督 sibling child 的 deadline、stdout bytes、UTF-8 和 exact result envelope。
- owned wrapper 负责 transcript 选择与身份复核、消息归一化、report budget 和 safe diagnostics；它只复用
  pinned owned upstream 中少量 parser/extraction helpers，不调用 upstream CLI `main()`。
- bootstrap 停止 patch global Skill；installer 要求 global PWF v3.8.2 pristine，并对 owned runtime 的 hash、
  mode、doctor、repair 和 package inventory 负责。

<a name="acceptance-conclusion"></a>

## Acceptance conclusion

`v0.3.0-alpha.2` Fresh Cloud 验收证明 exact ZIP/inventory、pristine global Skill、健康 doctor、真实
SessionStart owned catch-up、Host transcript selection、尾部保留、跨用户可读性和 post-resume lifecycle
可以闭环。Phase 2 因此成为 Phase 3 的回退基线，随后由 beta 系列取代当前角色，但不可变结论不变。

<a name="explicit-non-goals"></a>

## Explicit non-goals

- 不把 `owned-catchup.py` 或 upstream script 直接注册进 Managed policy。
- 不从 global Skill 或 ambient installation path 发现并执行可变脚本。
- 不激活 UserPromptSubmit 的 canonical owned-plan，也不启用 Phase 4 mode/attestation/ledger 行为。

<a name="successor-inheritance"></a>

## Successor inheritance

Phase 3 保留 owned catch-up 的 transcript、identity、budget 与 failure semantics，同时把 project state 的唯一
权威迁到 `owned-plan.py`；SessionStart 随后直接复用 owned-plan 返回的 exact project state，避免 plan 与
catch-up 各自重新解析。该分工继续进入 beta.1、beta.2 和 stable v0.3.0。

<a name="immutable-evidence"></a>

## Immutable evidence

- [Phase 2 完整专项文档（immutable source）](https://github.com/keeptoy/pwf-codex-cloud-hooks/blob/bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b/docs/phase-2-owned-catchup.md)
- [v0.3.0-alpha.2 Cloud hard acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks/blob/bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b/docs/v0.3.0-alpha.2-cloud-hard-acceptance.md)

本文是冻结摘要；实现细节和当时验收命令以 immutable source/acceptance 为准。
