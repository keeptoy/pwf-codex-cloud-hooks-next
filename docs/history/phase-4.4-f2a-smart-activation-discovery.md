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

<a name="phase-4-4-post-discovery-clarification"></a>

## Post-discovery clarification

后继 opt-in surface 复核进一步区分了三层“授权”：system-managed trust/registration 决定 Cloud 是否执行 Hook，
Codex sandbox/approval policy 决定 agent 此刻能否执行某个动作，plan-local activation state 才决定 PWF 是否对 exact
plan 启用 smart。前两层不能自动充当第三层，第三层也不能绕过前两层。

因此，本文件冻结的独立 `.pwf-codex-managed` commit point 仍是本地 CLI 与 Cloud 共用的可移植产品协议；本地交互
approval 不是额外 machine state，Cloud 也不能被假定具有相同的任务中确认框。Cloud 中 prepare、人工复核、最后
commit、Fresh/Resume/cache 持久性和 opt-out/re-arm 必须留给 F3 live gate 证明，不能由 F2A no-live acceptance 代替。

当前也不采用“生成链接、点击后激活”的外部路线：现有公开 Host contract 没有 authenticated、bounded、可审计且能
原子绑定 exact user/repository/commit/plan/state 的 consent callback。只有将来出现这种官方 ABI 才重开独立
Discovery。activation token 始终是非秘密常量，不得承载身份、授权码或账户凭据。现行完整边界以
[`ROADMAP` 的 F2 activation/disarm 协议](../../ROADMAP.md#phase-4-f2-activation-protocol) 为准；本尾注只说明后继
复核如何继承本里程碑，不把历史摘要升级为第二份 current authority。

<a name="phase-4-4-post-implementation-status"></a>

## Post-implementation status

后继 F2A implementation 已按本里程碑的独立 commit point、activation-first zero-read、two-pass revalidation 与
schema-v2 reuse 路线落到 `v0.4.0-dev` 当前树，并由更强的 armed/unarmed/refusal/race/disarm 与真实
adapter/runtime 组合测试接管 F1 临时 seam。当前状态是本地实现与供应链闭合；Linux/Source-Candidate/no-live
Cloud hard acceptance 尚未完成，因此本尾注不把 F2A 标为 gate PASS，也不产生 F2B/F3 授权。精确 current 状态
只见 [`ROADMAP`](../../ROADMAP.md) 与活动 task plan。

<a name="phase-4-4-post-implementation-lifecycle-reconciliation"></a>

## Post-implementation lifecycle reconciliation

下面不是第二份 current authority，而是 F2A 实施后的冷对账：它把 Discovery 时的“准备怎么接管”更新为“实际由谁
接管、靠什么证明、何时必须重审”。当前 gate 状态、Next Step 与授权仍只见 `ROADMAP` 和活动 task plan。

| 对象 / seam | 实施后状态 | 当前 owner / consumer | 可执行证据 | 重审或退休条件 |
|---|---|---|---|---|
| F1 `.mode` 同文件 managed-token grammar | **RETIRED**；不再接受 `codex-managed-v1` | 无 production consumer；只剩负向 residue guard | normalizer、旧 marker inert 与 repository residue tests | 不得复活；未来协议只能走独立 commit point 或新 schema |
| `.pwf-codex-managed` / `ACTIVATION_FILE` | **ACTIVE**；exact `codex-managed-v1\n` commit point | 用户是 producer；`owned-plan.py` 是唯一 reader | exact-byte、unsafe-file、race、disarm/re-arm 与 zero-read tests | F2B 复用；protocol v2 或 Phase 4 retirement 必须重审 |
| `.mode` / `MODE_FILE` | **ACTIVE**；仅在 valid activation 后读取 exact `inject-smart\n` | 用户是 producer；owned runtime 是唯一 reader | unarmed zero-read、exact smart、invalid/incomplete refusal、post-render revalidation | F2B 可原子扩 autonomous；Phase 8 才重审 gate vocabulary |
| `SUPPORTED_PROFILES` 与 adapter `allowed_profiles` | **ACTIVE capability lock**；均为 `[legacy, smart]` | adapter producer、owned runtime 与 result validator | relational contract tests、真实 adapter→runtime composition | F2B 必须在一个 gate 内原子扩展，禁止单边漂移 |
| `safe_capture_file()` / `capture_owned_state()` / `revalidate_owned_state()` | **ACTIVE state-admission authority** | `owned-plan.py` | symlink/hardlink/UTF-8/size/race/identity tests | 只有新的单一 admission authority 提供等价或更强证明后才能替换 |
| F1B no-production-call / legacy-only fixture | **REPLACED** | 更强的 armed/unarmed/refusal/race/disarm matrix | production call-edge 与完整 runtime tests | Phase 4 内保留；不得用标题元测试代替行为测试 |
| request/result schema v2 与 request-schema hash chain | **ACTIVE machine contract** | adapter、owned runtime、installer、bundle | exact schema、producer/consumer、bundle/manifest/hash tests | 只有真实 consumer 语义变化才轮转 schema |
| child-only `PWF_INJECT=smart` | **ACTIVE private integration seam** | owned runtime → pristine renderer | ambient env stripping、private snapshot、raw marker exclusion tests | F2B renderer 设计时重审；只有 renderer authority 改变才退休 |
| README 手工 prepare/commit/probe/disarm 流程 | **ACTIVE temporary user surface** | 用户与 production parser 共用 exact bytes | 只读 probe 复用 production request/result；F3 待做真实 lifecycle | 有 bounded official writer/status UX 且语义等价后退休 |
| nonce、attestation、ledger reader/writer、gated state | **DENIED / DEFERRED** | F2B / Phase 8 尚未授权 | source-residue、call-edge 与 future-profile refusal tests | 只能经对应 Discovery + implementation gate 准入 |

`ledger-summary.sh` 仍因 pristine autonomous/gated 供应链依赖留在 bundle；这不等于 F2A owned runtime 已读取 ledger。
F2A Source/Candidate Cloud 证据完成后，应在版本 acceptance 新增独立 evidence 段，不能改写本历史表，也不能让
F1B 的旧 hash 冒充 F2A 当前 bytes。

<a name="phase-4-4-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/4a24b66)

该链接只证明本轮 Discovery 的进入基线，不解释后续实现；当前 contract、programme 与授权以当前仓库 authority
为准。
