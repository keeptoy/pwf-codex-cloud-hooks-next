# Findings: Phase 4 F2 opt-in surface review

## Why this review exists

仓库谱系确认：`v0.1.0 -> v0.2.0` 的关键变化是把无法在 Cloud 落地的 legacy precomputed trust/registration
切换为 `/etc/codex/requirements.toml` system-managed registration；Hook 算法基本不变。这个问题与“某个计划是否
显式启用 smart”不是同一层授权。

## Three separate control planes

| 层 | 回答的问题 | 当前 authority |
|---|---|---|
| Host trust/registration | Cloud 是否承认并执行 managed Hook | system-managed requirements、absolute adapter、installer/doctor |
| Codex action approval | agent 此刻是否能执行命令或写某路径 | sandbox + approval policy；本地 CLI 可交互调整 |
| PWF product opt-in | 当前 plan 是否持久选择 smart/autonomous | plan-local exact state；managed runtime 只读验证 |

平台允许一次写操作，不等于用户已经永久启用 smart；反过来，activation file 存在也不能扩大 Host sandbox 或绕过
approval policy。F2 不得把两者合并成一个“授权”概念。

## Local versus Cloud

- 官方安全文档说明，本地 CLI/IDE 使用 OS sandbox 与 approval policy；CLI 的 `--ask-for-approval` 和
  `/permissions` 可以控制何时暂停并要求人工批准。
- Cloud 在隔离容器中后台执行，官方产品流程是任务结束后查看 summary/diff，再发 follow-up。当前公开文档没有提供
  一个可供本仓库在任务中调用、并把点击结果原子写入 plan-local state 的用户同意 API。
- 因此 F2A runtime 的可移植核心仍应是 exact plan-local state，而不是 CLI UI、Cloud UI 或环境变量。CLI 可由用户在
  独立终端手工创建状态，或在明确请求后允许 Codex 执行；Cloud 的 prepare/review/follow-up 是否能可靠保留相同
  workspace state，必须由 F3 Fresh/Resume/cache 证据确认，当前不得承诺。
- Cloud environment variables 覆盖整段 chat，不是 plan-local；secrets 又会在 agent phase 前移除。两者都不适合作为
  runtime opt-in。setup script 也不能替用户预先 arm 某个 plan。

Official evidence reviewed on 2026-08-12:

- <https://learn.chatgpt.com/docs/agent-approvals-security>
- <https://learn.chatgpt.com/docs/developer-commands?surface=cli>
- <https://learn.chatgpt.com/docs/environments/cloud-environment>
- <https://learn.chatgpt.com/docs/cloud>
- <https://learn.chatgpt.com/docs/hooks>

## Model visibility and privacy

- `.pwf-codex-managed` 是固定的非秘密常量；模型或 Hook 读到它本身不构成凭据泄漏。
- Codex 代表用户执行的命令，其结果必须返回给 agent 才能继续推理；Hook stdout/`additionalContext` 也可能进入模型上下文。
  因此 activation 命令、状态文件和 probe 输出都不得携带 secret、用户身份、一次性授权码或外部账户 token。
- 用户在独立 OS terminal 手工执行的命令，不应被假定为自动进入 Codex 上下文；但其产生的 workspace 文件会在后续
  Hook 按合同读取。这个边界只支持“独立终端不是全局屏幕监听”的保守判断，不承诺任何特定 IDE/terminal 集成永远
  不共享上下文。

## Click-to-activate URL

当前结论是 `NO_GO_FOR_CURRENT_F2`，不是永久否定。链接本身不能把确认可靠绑定到 exact user、repository、commit、
plan directory 和容器内的原子写入；补齐它需要外部认证服务、短期签名 capability/nonce、callback 或 polling、网络
策略、隐私与 rollback，从而扩大 trusted graph。

只有官方 Host 将来提供 authenticated、bounded、可审计的 consent/callback ABI，并能把结果绑定到 exact plan state，
才重新打开独立 Discovery。否则不为了“看起来更像授权”引入第二套控制面。

## Decision

`GO_TO_DOCUMENTATION_CLARIFICATION / F2A_IMPLEMENTATION_REMAINS_PAUSED`。

Phase 4.1 的同文件 token 是示例，不是架构不变量；Phase 4.4 选择独立 commit point 更严格地实现 legacy 默认不变。
F2A 可以继续按这一核心协议施工，但 Cloud 用户确认与持久性只能在 F3 真机 gate 中建立。当前不实现链接、外部服务、
secret/env opt-in，也不把本地 CLI approval 当作 PWF machine state。
