<a name="phase-4-4-historical-position"></a>

# Phase 4.4：F2A smart activation Discovery

## Historical position

本里程碑位于 `v0.4.0-dev` 的 F1 foundation 已完成并通过 Source/Candidate/no-live Cloud 验收之后。它只关闭
F2A 的实施前 Discovery：确定 smart 如何显式启用、如何退出、哪些状态可读、失败时怎样不泄漏 plan content，以及
实施需要哪些测试。它没有激活 smart，也没有授权 F2B、F3、Release 或远端动作。

<a name="phase-4-4-problem-before"></a>

## Problem before

F1B 已安装一个 descriptor-safe、bounded 的 `.mode` reader/normalizer seam，但 production 仍固定 legacy 且不调用
它。Phase 4.1 曾推荐把 `codex-managed-v1` 与 upstream profile token 放在同一个 `.mode` 中；进入实施前复核发现，
production 若要在同一文件内寻找 managed token，就必须先读取每一个旧 `.mode`。旧文件一旦是 symlink、hard link、
超限或损坏，原本没有 managed opt-in 的升级工作区也会从 legacy 变成 refusal，违背“旧 marker 单独存在必须保持
legacy”的兼容目标。

同时还需要回答：smart 是否重写 renderer、contract 是否轮转、谁写 activation state、怎样 disarm，以及哪些证据
属于 F2A、哪些必须留给 F3。

<a name="phase-4-4-core-decisions"></a>

## Core decisions

### 1. managed commit point 与 upstream profile 分离

F2A 采用两个职责单一的 plan-local 文件：

| 文件 | exact 内容 | 职责 |
|---|---|---|
| `.pwf-codex-managed` | `codex-managed-v1\n` | managed activation commit point；最后写入，删除即 disarm |
| `.mode` | F2A 只接受 `inject-smart\n` | upstream profile selector；没有 commit point 时完全不读取、不会自行激活 |

这个调整不改变 Phase 4.1 的 hybrid owned-boundary、显式 opt-in、只读 workspace 或 fail-closed 架构。它只替换了
当时尚未实施的同文件示例，使“旧 marker inert”成为物理可证明的零读取边界，而不是先读旧文件再判断没有 token。

activation token 不是 secret 或身份凭据。用户侧流程先原子准备 `.mode`，校验后再原子写入
`.pwf-codex-managed`；managed Hook/runtime 只读，不创建、修复或删除这些文件。disarm 只删除 activation file；
残留 `.mode` 随即恢复为 inert。re-arm 必须先重新校验 profile，再最后重建 activation file。

激活确认不能靠肉眼猜 smart 输出形状，因为没有 `### Phase` 的计划会按 pristine 语义回退 head-N。F2A implementation
必须提供一条文档化的只读 probe，经 installed owned-plan request/result 路径复用 production admission，并要求
`outcome=context_emitted`、`effective_profile=smart`、`advisory=null`；不能为 status 再维护第二套 parser。
新增 bundled writer/status parser 不属于首个 F2A gate，若以后需要必须另作 product/trust 决策。

### 2. token 缺失是 legacy；token 存在后任何不完整状态都拒绝

- activation file 缺失时，不打开 `.mode`；旧 upstream token、旧损坏文件和 ambient `PWF_INJECT` 都不能激活
  managed smart。
- activation path 存在但不安全、内容错误、超限或 raced，返回 bounded refusal，不注入 plan/catch-up content。
- activation file 合法但 `.mode` 缺失、非法、含 autonomous/gate、unknown 或 duplicate token，拒绝且不降级
  legacy。
- token 与 mode 必须在 renderer 返回后再次按 identity/content 复核；中途 disarm、替换或改 profile 时丢弃输出并
  返回 `state_changed`。
- planning disabled、detached session 与 no-plan 在 plan-local capture 前结束，继续保持状态零读取。

### 3. 复用 pristine smart renderer，不建立第二套算法

owned runtime 在真实 plan directory 安全捕获并规范化 state，只把 task/progress 写进 private snapshot。smart 决定
通过 owned child environment 中的 `PWF_INJECT=smart` 传给 pristine `inject-plan.sh`；不复制 `.mode`、activation
file 或其他 raw marker。pristine renderer 继续负责 canonical smart selection；没有 `### Phase` 结构时按其既有语义
回退 head-N，但 effective profile 仍是 smart，不再尝试第二次 legacy rendering。

ambient `PWF_INJECT` 继续被剥离。F2A 不读取 nonce、attestation 或 ledger，不调用 `ledger-summary.sh`，也不准入
upstream writer、autonomous 或 gate。

### 4. contract v2 足够，capability locks 原子接管

现有 request v2 已预留 `[legacy, smart]`，result v2 已预留 `effective_profile=smart` 与全部 bounded state advisory，
所以 F2A 不为已存在的语义制造 schema v3。实施时 adapter producer 和 owned runtime support 必须在同一 transaction
从 legacy-only 精确改为 `[legacy, smart]`；这只表示 candidate 有能力，不表示 workspace 已激活。

adapter result validator 改为验证 effective profile 属于 request capability。state refusal 继续是 non-injecting
`invalid_request`、`effective_profile=null` 与单个 bounded advisory；canary 和 catch-up 顺序不变，catch-up 仍只在
plan context 成功注入后运行。

<a name="phase-4-4-implementation-gate"></a>

## Implementation gate

结论是 `CONDITIONAL_GO_TO_F2A_IMPLEMENTATION`。后继施工必须原子闭合：

1. failing-first 覆盖 token 缺失时 `.mode` 零读取、exact smart、unsafe/incomplete/race refusal、disarm/re-arm；
2. adapter/runtime 精确支持 `[legacy, smart]`，autonomous/gate request 仍在 state capture 前拒绝；
3. smart 只在 normalized private snapshot 中由 pristine renderer 执行，ambient env 与 raw marker 不进入；
4. markerless、旧 marker、planning-disabled、detached/no-plan 保持 legacy 或 canary-only；
5. nonce、attestation、ledger、workspace writer 与新增 Host event 继续为 denied surface；
6. runtime/adapter hash、bundle/manifest/Release、完整回归、deterministic ZIP、install/doctor 与
   Source/Candidate/no-live Cloud 原子闭合。

no-live Cloud 只证明安装后的默认 legacy 与 candidate 供应链，没有证明真实 managed opt-in lifecycle。Fresh、
UserPrompt、real Resume、cache reuse、opt-out/re-arm 与双向 rollback 仍由 F3 统一验收。

<a name="phase-4-4-lifecycle-handoff"></a>

## Lifecycle handoff

| 对象 | F2A 动作 | 后续复核点 |
|---|---|---|
| F1 同文件 normalizer grammar | replace，不再接受 `.mode` 内 `codex-managed-v1` | F2A tests 证明新 token/profile 分离后删除旧分支与 fixture |
| `.pwf-codex-managed` | add，owned reader 消费 | F2B 复用；protocol v2 或 Phase 4 retirement 时重审 |
| `.mode` reader | activate only behind valid commit point | F2B 扩 autonomous grammar；Phase 8 才考虑 gate |
| legacy zero-read guards | 由更强的 armed/unarmed matrix 原子替换 | 新矩阵通过前不得先删 |
| request/result schema v2 | keep | 只有真实 consumer/语义变化才轮转 |
| nonce/attestation/ledger/gated | keep denied | F2B / Phase 8 独立 Discovery/implementation |

这张表延续 Phase 3.9.3 和 Phase 4.3 的生命周期治理：每个临时 seam 都有接管或退休条件，不能把迁移脚手架
无期限保留，也不能为了“先清理”删除下一 gate 正在使用的安全边界。

<a name="phase-4-4-explicit-non-goals"></a>

## Explicit non-goals

- 本里程碑不修改 production、contract bytes、bundle、manifest、installer、Release 或真实 workspace state。
- 不提供 managed workspace writer，也不把 pristine `init-session.sh` 纳入 trusted graph。
- 不实现 autonomous、nonce、attestation、ledger、gated/Stop 或新 Host event。
- 不执行 live Cloud、seal、publication、promotion 或 remote write。

<a name="phase-4-4-successor-inheritance"></a>

## Successor inheritance

下一步只能在维护者单独授权后进入 F2A implementation，并以本文件的独立 commit point、two-pass revalidation、
schema-v2 reuse 和测试分工为施工输入。F2A 本地/Linux/no-live acceptance 完成后必须再次停止；不得自动进入 F2B
或把 no-live 结果包装成 F3 lifecycle PASS。

<a name="phase-4-4-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/4a24b66)

该链接只证明本轮 Discovery 的进入基线，不解释后续实现；当前 contract、programme 与授权以当前仓库 authority
为准。
