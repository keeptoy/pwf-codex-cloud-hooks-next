<a name="phase-4-5-f2b-autonomous-activation-discovery"></a>

# Phase 4.5：F2B autonomous activation Discovery

## 定位

本里程碑发生在 F2A smart implementation 与 Source/Candidate/no-live Cloud 验收完成后，只负责回答 F2B 能否安全施工、
怎样表达 autonomous 的独立授权，以及 Cloud 暂时无法证明 opt-in 时该留下什么。它不修改 production runtime，不激活
autonomous，也不授权 F3、Release 或远端动作。

结论是 **`CONDITIONAL_GO_TO_F2B_READ_ONLY_IMPLEMENTATION`**：consumer 在现有 owned boundary 内技术可行，但必须由后继
实施 gate 原子落地，并由 F3 证明真实 Cloud 生命周期。证明失败时，不发布半激活能力，只保留当前已经存在的不可达
contract seam 与拒绝测试。

## 为什么 F2A token 不能直接复用

F2A 的 exact `codex-managed-v1\n` 是用户对 smart 的 commit point。如果 F2B 只让同一个 token 配合后来变化的 `.mode`
自动进入 autonomous，就等于把一次旧授权静默扩大为 nonce、attestation、ledger 新行为。

因此冻结以下 profile-bound 语义：

| activation exact bytes | 授权范围 | 状态 |
|---|---|---|
| `codex-managed-v1\n` | smart only | 已有 F2A 行为；永远不自动授权 autonomous |
| `codex-managed-v1 autonomous\n` | autonomous only | F2B 候选；当前尚未实现 |

autonomous 的顺序必须是：先准备 exact `.mode=autonomous\n`、nonce、attestation 和 bounded ledger，验证成功后最后原子写
profile-bound activation。删除 activation 即 disarm；activation 已存在但依赖状态非法时只拒绝，不得降级 legacy/smart。

这仍是 request v2 已声明的 `codex-managed-v1` protocol family，不要求为了命名再制造 schema v3；真正施工时必须把
activation grammar、adapter capability、runtime reader、关系校验和 hash/inventory 当成一个 transaction。

## consumer 的安全边界

- managed runtime 继续只读 workspace；上游 initializer、attester、ledger writer、phase writer 不进入 trusted graph；
- attestation 是 captured `task_plan.md` exact bytes 的 lowercase SHA-256，只证明内容未漂移，不证明“这是某个人同意的”；
- nonce 是 exact 16 位 lowercase hex framing value，不是 secret、身份凭据或防重放授权；
- 每次调用重新计算 task digest，不使用 path+mtime 或 persistent correctness cache；
- ledger admission 为 `0..32` 个 bounded `ledger-<agent>.jsonl`。零 ledger 是合法空摘要，不代表可回退 raw `progress.md`；
- owned reader 先做 safe-file、name、UTF-8、bytes/lines、JSON exact-key/type 与 aggregate bounds，再把 normalized representation
  投影进 private snapshot；pristine child 不能重新打开 live workspace；
- child 结束后重新验证 task、nonce、attestation、ledger identity 与 enumeration。变化、损坏、缺失或超预算只给 bounded
  advisory，不 partial inject、不回退 legacy、不泄露 raw path/content。

F2B 不新增 Hook event、不增加 managed writer、不建立第二套 parser，也不把上游 broad glob、substring mode 或 raw-progress
fallback 提升为生产 authority。

## 本地授权和 Cloud 授权不是一回事

官方 Codex 文档说明，本地 CLI/IDE 可以依据 approval policy 暂停并询问；Cloud 是隔离容器中的后台 task，用户在结果
出来后 review diff、follow-up 或创建 PR。Cloud setup secret 和 chat-level environment variable 也不是绑定 exact
repository/plan/state 的 consent。

本轮审阅的官方文档没有建立可供 F2B 使用的 authenticated in-task consent callback。这只是“目前没有证据”，不是断言
未来永远不可能。证据入口：

- [Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security)
- [Codex cloud](https://learn.chatgpt.com/docs/cloud)
- [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment)

F2B 不把未经证实的 Cloud 行为压成一条路线，而是按证据强度冻结首选与备选；两者都只是待 F3 实测的 hypothesis。

### 首选：Git-backed 双阶段 activation

1. preparation commit/PR 只加入 exact mode、nonce、attestation 和初始 bounded ledger，不写 activation；
2. 用户检查并 merge 该 diff；
3. 第二个独立 commit/PR 只加入 profile-bound activation，用户再次检查并 merge；
4. 从包含 activation 的 exact commit 启动新 Cloud task，再验证 UserPromptSubmit/Resume、disarm/re-arm、cache 与 rollback。

这条路线优先使用官方已经明确的 branch/commit checkout、diff review 与 PR/follow-up 原语。它把“准备了什么”和“最后
同意启用什么”分成两个可审计 Git 边界，不依赖同一容器未提交 worktree 恰好继续存在。activation 仍只是 repository/
plan-local workflow intent，不是用户身份或签名凭据；attestation 仍必须匹配最终 exact task bytes。

如果目标仓库不允许提交这些 plan-local 状态、状态被 `.gitignore` 排除、branch protection 无法表达第二个 commit，或
mutable ledger 的 Git lifecycle 无法闭合，首选路线立即停止，不能绕过审查偷偷写 token。

### 备选：同一 Cloud chat 的 review + follow-up activation

1. prepare task 在当前 worktree 生成 mode/nonce/attestation/ledger，但不写 activation；
2. 用户在任务结果页检查 summary/diff 后明确发 follow-up，只允许最后写 profile-bound activation；
3. 后续 Hook 先核对 exact HEAD、plan identity、task digest 和 state fingerprint，再决定是否接受；
4. F3 必须覆盖 cache hit/miss、maintenance、Fresh、real Resume、超时和容器重建，不能只证明一次 happy path。

这条路线的弱点是依赖同一 chat/worktree/cache 的持续性；官方文档说明 Cloud 支持 review、follow-up 和至多 12 小时的
container cache，但没有把未提交 plan state 的持续性定义成 F2B 所需的原子授权 ABI。因此它只在首选确实不可行后尝试，
且失败就 fail closed，不再继续降级。

两条路线都失败时，F2B Cloud activation 为 `NO_GO/defer`。不使用“模型生成链接让用户点击”、外部认证服务、setup
secret、环境变量或推断的本地 approval 作为第三种兜底；未来只有官方出现 authenticated、bounded、可绑定 exact state
的接口时才重新 Discovery。

## 为什么现在不先堆 inactive 实现

“先把 autonomous reader 全写好但让 production 永远调用不到”会新增一大块无人消费的安全代码和生命周期负担，却不能
回答 Cloud opt-in 是否成立。当前仓库已经有足够窄的兜底接口：

- request/result v2 预留 ordered `[legacy, smart, autonomous]` 与 autonomous result enum；
- adapter 当前只生产 `[legacy, smart]`；
- owned runtime 在读取 autonomous state 前拒绝 future profile；
- relational tests 拒绝伪造的 autonomous result。

所以“大白话”的兜底不是再放一套半成品，而是保持这个窄 seam：以后条件成熟可沿同一合同施工；最终确认不可行时，也能
直接退休 enum/guard，而不会清理一堆 writer、cache 和 dead parser。

## 后继实施 gate 的最低退出条件

1. 旧 smart token 仍只能启用 smart；autonomous 必须有新的 exact profile-bound commit point；
2. 未 armed 时对 mode/nonce/attestation/ledger 保持 zero-read；armed-invalid 全部拒绝且无 raw-progress fallback；
3. task、state、ledger 的 unsafe-file、malformed、mismatch、over-budget、race 与 mutation 矩阵闭合；
4. zero-ledger、bounded multi-ledger、deterministic normalization、private snapshot 权限与 cleanup 有行为测试；
5. adapter/runtime capability 与 relational result validation 原子扩展，`gate` 继续 denied；
6. Windows 对 POSIX-only case 诚实 skip，Linux 零 skip；Source/Candidate 重跑 deterministic ZIP 与 no-live probes；
7. F2B 实施结束必须停下。只有 F3 可以判断 Cloud prepare/review/activate-last、Fresh/Resume/cache、opt-out/re-arm 和 rollback。

## 生命周期总账

| 对象 | 当前处置 | owner / consumer | 重新审核或退休条件 |
|---|---|---|---|
| `codex-managed-v1\n` | KEEP，smart-only | user / owned runtime | managed protocol replacement 或 Phase 4 retirement |
| `codex-managed-v1 autonomous\n` | DESIGN-FROZEN，尚未实现 | future explicit producer / owned runtime | F2B implementation 授权；F2B/F3 `NO_GO` 时不落地 |
| autonomous schema seam | KEEP，production unreachable | adapter/runtime relational contract | F2B 重启或 protocol replacement |
| nonce/attestation/ledger readers | ABSENT | future F2B owned runtime | 只在获批实施 gate 增加 |
| upstream writer scripts | DENIED / UNINSTALLED | external pristine Skill/user flow | 独立 producer audit 或官方授权表面变化 |
| Git-backed two-stage Cloud consent | PREFERRED / UNPROVEN | F3 live acceptance | 两次受审 commit 边界与 exact lifecycle 证据通过才接受 |
| same-chat follow-up consent | FALLBACK / UNPROVEN | F3 live acceptance | 仅首选不可行后测试；state/cache 有歧义即退休 |
| external click/callback | ABSENT | none | 仅 authenticated official Host ABI 出现时重开 Discovery |

## 版本列车与失败切换

F2B 首选、备选都在尚未发布的 `v0.4.0-dev` programme 内验证。首选失败不自动产生 `v0.4.1`：可以在新的
`0.4.0-alpha.N` / `beta.N` candidate 中撤销失败 bytes、切换备选并重新执行 hash、ZIP、Cloud 与 rollback gates。
任何失败 candidate 都不能晋级为 stable。

如果两条路线都失败，允许从 candidate 完整撤回 autonomous implementation，只以已经成立的 F1/F2A 能力继续评估是否
封板 smart-only `v0.4.0`。一旦 stable `v0.4.0` 已发布，后续新增 autonomous 会改变显式授权与用户行为，不符合当前
ROADMAP 对 `0.x.y (y>0)`“只做同一 minor 兼容修复”的约束；届时必须重新安排下一 minor programme，而不是用
`v0.4.1` 偷渡。具体 minor 编号需与当时 Phase 5～9 路线一起重排，不在本 Discovery 预占。

## 交接

当前适合进入的下一步不是直接施工，而是由维护者决定是否接受两项实施前提：profile-bound autonomous token，以及在 F3
按“Git-backed 双阶段首选 → same-chat follow-up 备选 → 两者失败则 NO_GO/defer”的顺序验证。明确授权后才建立 F2B
implementation scope；否则维持现状，现有 smart 行为和 legacy 默认均不受影响。
