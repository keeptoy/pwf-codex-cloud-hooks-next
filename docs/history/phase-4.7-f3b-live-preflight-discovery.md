<a name="phase-4-7-historical-position"></a>

# Phase 4.7：F3B live preflight Discovery

## Historical position

本里程碑位于 F3A repository/lifecycle foundation 完成本地与 Linux/Source-Candidate/no-live Cloud 验收之后、
任何真实 smart/autonomous opt-in 之前。它不改 Phase 4.1 的安全模型，也不重开 Phase 4.6 选择的 Git-backed
双阶段路线；它只把 F3B 的 Cloud 实验拆成可审计、可停止、不会污染开发分支的实施计划。

结论是：**F3B 需要一次小型 live-preflight Discovery，但不需要新的宏观架构 Discovery。** 原因不是 consumer
逻辑不确定，而是普通 Source/Candidate 安装发生在 agent 已经启动之后，不能证明 candidate 在第一次
`SessionStart source=startup` 前已经生效，也不能证明 cache、checkout 与 activation commit 的身份关系。

<a name="phase-4-7-new-evidence"></a>

## 新证据与 Phase 4.6 的差异

官方当前资料确认：

- [Cloud environment](https://learn.chatgpt.com/docs/environments/cloud-environment) 在普通创建路径中先 checkout
  选定 branch/commit SHA，再运行 setup，最后进入 agent phase；setup 与 agent 是两个 Bash/session 生命周期。
- 同一资料也说明 container 可缓存最多 12 小时；缓存建立时使用 default branch 和 setup，恢复时再 checkout
  chat 指定 branch 并可运行 maintenance。cache 因而可能让“安装 runtime 的源码”与“agent 实际读取的 workspace”
  来自不同提交。
- [Hooks ABI](https://learn.chatgpt.com/docs/hooks) 明确区分 `SessionStart` 的 `startup`、`resume`、`clear`、
  `compact`，并把 hook stdout 注入下一次模型请求；因此 Fresh 与 real Resume 可以用现有 canary 观察，不需要新增 Hook。
- [Codex Cloud workflow](https://learn.chatgpt.com/docs/cloud) 支持结果 review、follow-up 与 PR，但公开资料没有定义
  “模型在任务里生成一个链接，用户点击后返回已认证 opt-in”的 callback ABI。现有 review UI 不能被提升为 product
  activation authority。
- [Agent approvals](https://learn.chatgpt.com/docs/agent-approvals-security) 描述 Cloud 的两阶段运行、隔离、network
  与本地 CLI/IDE 不同的 sandbox/approval 模型；它不保证 Cloud 和本地具有相同的交互式授权路径。

因此 Phase 4.6 的 Git-backed 路线仍成立，但要补一个关键拆分：

| 身份 | 大白话 | 验证方式 |
|---|---|---|
| `RUNTIME_SOURCE_HEAD` | 哪份源码构建并安装了 managed runtime | setup/maintenance 从 exact commit 构建，核对 candidate ZIP SHA、manifest/bundle 与 doctor；禁止回退 moving branch/default branch |
| `WORKSPACE_LIFECYCLE_HEAD` | Hook 实际读取的是哪份 plan preparation/activation/disarm 提交 | Cloud task 优先直接选择 exact commit SHA；否则冻结单用途 branch tip，并在 agent 第一条只读命令核对 `git rev-parse HEAD` 与 clean status |

二者可以相同，但 correctness 不能假设它们相同。每份 evidence 必须同时记录二者；只打印 branch 名、package
version、模型口头声明或某个 PASS marker 都不够。

<a name="phase-4-7-frozen-invariants"></a>

## 冻结的不变量

1. development branch 始终 markerless，不接收真实 `.mode`、`.nonce`、`.attestation`、
   `.pwf-codex-managed` 或 ledger；validation state 不合并回开发分支。
2. managed runtime 继续只读；用户/维护者在 Cloud task 外准备并审核 Git commits，Cloud 模型不创建 activation、
   commit、PR、push 或修复 source。
3. activation file 仍是最后、独立、profile-bound 的 commit point；preparation 与 activation 必须是直接父子关系。
4. smart 与 autonomous 使用从同一 clean foundation 分出的独立验证链。smart PASS 之后停下复核，未 PASS 不进入
   autonomous。
5. autonomous 零 ledger 是合法起点；armed 后 `task_plan.md` bytes 冻结。修改计划必须 disarm → 编辑并重新
   nonce/attestation → activation-only re-arm。
6. cache 只记录为观察事实，不参与授权或正确性。cold Fresh 至少在每个 profile 首次 armed 验证前显式 reset cache；
   cache 命中或失效都必须由 exact runtime/workspace identity 与 maintenance verification 吸收。
7. 每个长命令必须取得工具实际返回的最终 exit code。有 session/running 或无 exit code 时继续轮询；session 丢失只报
   `INCOMPLETE/UNKNOWN`，不得根据部分 stdout 或缺少 PASS 猜测成败。
8. 当前四个 pristine upstream runtime 文件仍是当前 closed inventory，不是永久上限。F3B 不需要新增文件；未来确有
   demand 时仍走独立 bundle/manifest/Release/trust transaction。

## 真正的 Fresh、UserPrompt 与 Resume

本轮把三个词固定为可执行语义：

| 事件 | 必须发生什么 | 不能冒充它的证据 |
|---|---|---|
| Fresh startup | candidate 已在 environment setup/maintenance 阶段安装；agent 第一次模型请求直接观察 `SessionStart source=startup` canary 与预期 profile context；第一条命令核对 workspace exact HEAD | agent 启动后才运行 4.1 安装，再手工调用 adapter |
| UserPromptSubmit | 同一已启动 task 的下一次真实用户消息观察 event canary 与同一 profile context | 只运行 `owned-plan.py` probe |
| real Resume | 结束/离开后重新进入同一个 Cloud chat，直接观察 `SessionStart source=resume` 与预期 context，再复核 exact HEAD/doctor | 新建 chat、普通 follow-up 或伪造 request JSON |

生产 `owned-plan.py` read-only probe 仍必须运行，用来给出 machine-readable `effective_profile`、`inject` 与
`advisory`；但它只能和真实 Host canary/context 互证，不能替代 Hook 黑盒。

<a name="phase-4-7-validation-topology"></a>

## 验证提交拓扑

`R` 是 markerless、production bytes 已通过 F3A 的 F3B protocol-foundation commit。远端 branch 只是把 commit
运到 Cloud 的临时 ref；Cloud task 应尽量直接选择 exact SHA。所有 ref 在任务运行期间冻结：

```text
                         S_PREP -> S_ARM -> S_DISARM -> S_REARM
                        /
R  markerless foundation
                        \
                         A_PREP -> A_ARM -> A_DISARM -> A_REPREP -> A_REARM
```

- `S_PREP`：只包含 smart preparation 与 profile-specific repository expectation；仍无 activation，production 必须 legacy。
- `S_ARM`：相对 `S_PREP` 只新增 smart activation file。
- `S_DISARM`：相对 `S_ARM` 只删除 activation file；`.mode` 保留但立即 inert。
- `S_REARM`：相对 `S_DISARM` 只重新新增相同 profile-bound activation，证明同一 plan 可逆。
- `A_PREP`：只包含 autonomous mode、nonce、exact task attestation、零 ledger 与 profile-specific expectation。
- `A_ARM`：相对 `A_PREP` 只新增 autonomous activation file。
- `A_DISARM`：相对 `A_ARM` 只删除 activation file。
- `A_REPREP`：在 disarmed 状态修改 task bytes，并原子更新 nonce/attestation；仍无 activation。
- `A_REARM`：相对 `A_REPREP` 只新增 autonomous activation file。

不创建故意 attestation mismatch 的远端 commit。tamper 负向实验从 exact `A_ARM` 启动一个一次性 Cloud
environment，先证明正常 autonomous，再由 versioned runbook 的 bounded 命令只修改当前 worktree 的
`task_plan.md` 一处；下一次真实 UserPrompt 与 production probe 必须分别 canary-only、返回
`inject=false / effective_profile=null / advisory=state_unsafe`。该环境标记 `F3B_TAMPER_ONLY` 后立即丢弃，禁止
commit、PR、push、恢复后继续作为正向 evidence，也不得把预期 dirty worktree 误当 product defect。

### F3A transition guard 的生命周期修正

Phase 4.6 说“F3B preparation commit 必须替换 exact legacy assertion”仍正确，但范围要说清楚：

- profile-specific validation preparation branch 原子替换为该 profile 的 exact prepared/armed closure；
- development branch 不合并这些 state branches，因此保留 markerless/legacy-only assertion，职责从
  `TRANSITIONAL F3A NO-LIVE GUARD` 转为 `DEVELOPMENT CANDIDATE NO-LIVE GUARD`；
- 它不是 production dispatch contract。Phase 9 或 F3 NO_GO/协议替换时重新审核是否保留、泛化或退休。

这避免为了 live 实验先放宽整个仓库，也避免把真实 activation 文件带回候选主线。

<a name="phase-4-7-gate-plan"></a>

## F3B 分步计划

### F3B0 — Live-preflight Discovery（本里程碑）

冻结本文件的不变量、双身份、branch graph、evidence 与失败分流。退出状态：
`F3B0_DISCOVERY_COMPLETE / CONDITIONAL_GO_TO_F3B1_PROTOCOL_MATERIALIZATION`。

### F3B1 — Protocol materialization / no-live dry run

只把方案变成可复制的 runbook 与测试，不创建真实 repo state：

- 为 Cloud environment 冻结 setup + maintenance 脚本：从 exact `RUNTIME_SOURCE_HEAD` 在临时目录 build/check，
  核对预期 ZIP SHA 后用显式 local override 安装；任何 fetch/HEAD/hash/doctor mismatch 都 fail closed。
- 为 smart/autonomous 冻结 preparation、activation、disarm、reprepare/re-arm 命令与 exact Git diff/parent checks。
- 用 disposable local Git fixtures 演练完整 DAG、Bash syntax、state verifier 与 evidence parser；production/contract/
  bundle/Release bytes 必须不变。
- 更新 F3 专用 runbook和 live 提示词；通用 markerless Source/Candidate 模板不冒充 F3B，也不硬塞 profile 常量。

退出：`F3B1_PROTOCOL_READY / NO_LIVE_STATE / STOP_BEFORE_F3B2`。必须再次取得维护者授权才进入 smart live。

### F3B2 — Smart live chain

顺序固定：

1. `S_PREP` cold Fresh：activation absent，Hook 与 probe 都必须 legacy；
2. `S_ARM` cold Fresh：startup、UserPrompt、real Resume 与 probe 全部 smart；
3. `S_DISARM` Fresh：立即恢复 legacy，旧 `.mode` 不得继续生效；
4. `S_REARM` Fresh：activation-only 后恢复 smart；
5. doctor、installed inventory、snapshot residue、两个 exact HEAD 和最终 exit codes 闭合。

退出：`F3B2_SMART_LIVE_PASS / STOP_AND_REVIEW`。任何一步失败都停止，不进入 autonomous。

### F3B3 — Autonomous live chain

顺序固定：

1. `A_PREP` cold Fresh：零 ledger preparation 仍必须 legacy；
2. `A_ARM` cold Fresh：startup、UserPrompt、real Resume 与 probe 全部 autonomous；输出包含 nonce-bound autonomous
   结构与 bounded `=== ledger summary ===`，不得出现 raw `progress.md` sentinel；
3. 从 exact `A_ARM` 执行一次性 worktree tamper：真实 UserPrompt canary-only，probe exact `state_unsafe`，随后丢弃环境；
4. 在干净独立环境验证 `A_DISARM` Fresh legacy；
5. `A_REPREP` Fresh 仍 legacy；`A_REARM` Fresh + real Resume 恢复 autonomous，并证明新 task digest/nonce 生效；
6. doctor、inventory、residue、身份与 exit-code evidence 闭合。

退出：`F3B3_AUTONOMOUS_LIVE_PASS / STOP_AND_REVIEW`。如果 smart PASS、autonomous FAIL，不自动把 0.4.0 解释成
smart-only；先进入独立 scope decision，选择修复、defer autonomous 并退休不可发布 seam，或整个 F3 NO_GO。

### F3B4 — Evidence closure / cleanup decision

- 在 markerless development branch 用单独文档/governance commit 写回 exact runtime/workspace commits、Cloud task
  identities、关键 marker、doctor/inventory、final exit codes 与所有 negative result；不 merge validation chains。
- 对 smart/autonomous 分别给 PASS/FAIL/INCOMPLETE，不用一条综合口号掩盖部分通过。
- 保留 F3C 需要的 clean valid/disarmed refs；tamper environment 立即销毁。其余 validation refs 至少保留到 F3C/Phase 9
  路线决策，之后由维护者按 evidence retention 决定退休，智能体不自动删除远端 ref。
- 全仓扫描真实 machine state、临时脚本、cache/snapshot、第二份 inventory 与无 owner 对象；development branch
  必须重新证明 markerless、candidate bytes未漂移。

全部闭合后才可写：`F3B_LIVE_LIFECYCLE_PASS / STOP_BEFORE_F3C`。F3C rollback 仍需新授权。

<a name="phase-4-7-evidence-and-stop-rules"></a>

## Evidence schema 与 hard stop

每个正向 Cloud task 至少记录：profile/stage、`RUNTIME_SOURCE_HEAD`、candidate ZIP SHA、
`WORKSPACE_LIFECYCLE_HEAD`、branch/ref tip（若使用）、worktree classification、SessionStart source、
UserPrompt marker、`effective_profile`、doctor/inventory/residue、cache reset/hit/unknown、最终 exit code。

以下任一条件直接停止：

- setup/maintenance 没有在 agent phase 前证明 exact candidate，或 silently fallback 到 default/moving branch；
- 第一条 agent 命令 HEAD 不等于预期、worktree 非预期 dirty，或 validation ref 在任务中移动；
- Fresh 第一请求没有 startup canary，Resume 没有 resume canary，或 Hook 与 production probe 的 profile 结论冲突；
- preparation 已产生非 legacy 行为、activation commit 改了第二条路径、disarm 后仍非 legacy；
- autonomous 暴露 raw progress、接受 stale attestation、tamper 时回退 legacy，或 re-arm 没有重新 attest；
- Cloud 模型在 tamper 例外之外修改 source/state，或创建 commit、PR、push、自动修复；
- command 仍 running/session 存在却被报告 PASS/FAIL，或最终 exit code 不可取得；
- 需要新增 Host event、managed writer、secret/callback、runtime supply-chain 文件或 Release entry 才能继续。

cache 是否命中允许记为 `UNKNOWN`，只要 cold Fresh、exact identities、maintenance 与行为证据完整；cache 本身不可
观察不会让产品 FAIL。反之，身份或启动顺序不可证明时只能 `INCOMPLETE`，不能用行为看似正确来补票。

<a name="phase-4-7-lifecycle-ledger"></a>

## 对象生命周期账本

| 对象 | 当前状态 / owner | F3B 动作 | 退出或再次审核条件 |
|---|---|---|---|
| managed smart/autonomous reader | IMPLEMENTED, READ-ONLY / owned runtime | KEEP；只被 live 验证消费 | F3B NO_GO、protocol replacement 或 Phase 9 unreachable-code review |
| F3 source verifier | REPOSITORY-ONLY / repository governance | KEEP；F3B1 扩展 fixture，不进入 ZIP | F3 route closure、专用 producer adoption 或 verifier/runtime coupling 变化 |
| F3 runbook | PRODUCT-PENDING / maintainer | F3B1 MATERIALIZE exact setup/maintenance 与 live stages | F3B PASS 后成为 accepted workflow；NO_GO 时退休 product claims |
| development markerless guard | DEVELOPMENT CANDIDATE NO-LIVE GUARD / repository tests | KEEP；禁止 live state 泄漏主线 | Phase 9、F3 NO_GO 或 repository state policy replacement |
| profile validation branches | EPHEMERAL EVIDENCE REFS / maintainer | ADD、运行期间冻结、禁止 merge | F3C/Phase 9 evidence retention decision 后人工退休 |
| activation/preparation files | VALIDATION-BRANCH-ONLY / maintainer-user | ADD only on exact chain | 不进入 dev/Release；branch retirement 或 disarm closes live intent |
| tamper worktree | DISPOSABLE NEGATIVE FIXTURE / one Cloud environment | ADD one exact task edit, never commit | evidence captured 后立即销毁；不得复用/Resume 为正向证明 |
| Cloud cache/environment | EPHEMERAL HOST STATE / Cloud environment owner | RESET/VERIFY/DISCARD；不作 authority | 每个 profile boundary、tamper 结束或 identity drift |
| runtime/workspace identity pair | REQUIRED EVIDENCE / F3B acceptance | ADD to every task record | protocol replacement or completed gate evidence retirement policy |
| current four pristine upstream files | CURRENT INVENTORY, NOT A CAP / runtime bundle | KEEP；F3B 无新增需求 | demand-driven supply-chain Discovery |
| official consent callback/link | ABSENT / no owner | DEFER；不进入首轮 F3B | 官方出现 authenticated bounded ABI 时重新 Discovery |

<a name="phase-4-7-decision"></a>

## Decision

`F3B0_DISCOVERY_COMPLETE / CONDITIONAL_GO_TO_F3B1_PROTOCOL_MATERIALIZATION`

大白话：路线本身能继续，先把两套身份、环境 setup/maintenance、commit graph 和证据表做成可执行 runbook，
在本地/无 live 环境演练通过；然后单独授权 smart live。smart 通过并人工复核后才碰 autonomous。整个过程不把
activation 文件合并回 `0.4.0-dev`，也不因本结论自动授权 F3B1、F3B2、F3B3、F3B4、F3C 或 Release。
