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

这里必须保留一个三层状态不变量，避免把 Git 节点、文件结构和 production 决策揉成一个模糊的“当前模式”：

| 层 | 回答的问题 | F3B2 中的 authority |
|---|---|---|
| workspace stage | 当前 checkout 是生命周期哪一步之后的提交 | exact `WORKSPACE_LIFECYCLE_HEAD` 与冻结 DAG |
| repository state | 当前 machine-state 文件组合完整到什么程度 | repository-only state validator |
| effective profile | production 最终实际采用哪个 renderer | owned production probe 的实际 result |

因此 `S_DISARM / smart_prepared / legacy` 是预期安全结果：该提交刚删除 activation，`.mode` preparation 仍在，所以结构上
仍是 `smart_prepared`；但 activation-only commit point 已不存在，production 必须选择 `legacy`。同理，stage map 中的
expected profile 不能自证运行结果；必须由真实 probe result 与 expected 值相等后才能接受。这一分层也是“删除 token
即可退出、残留 preparation 不得复活 smart”的可验证表达。

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

<a name="phase-4-7-post-implementation-status"></a>

## Post-implementation status — F3B1

维护者后来只授权了 F3B1。实施与本里程碑冻结的路线一致，没有把 no-live protocol gate 扩大成真实 opt-in：

- F3 runbook 新增一个必须同时复制到 Cloud setup 与 maintenance 的 exact transaction；它从显式
  `RUNTIME_SOURCE_HEAD` detached fetch/build/check，核对维护者预先给出的 candidate SHA，再通过 manifest 路由找到外部
  bootstrap、安装并 doctor。build 结果不能反过来充当 expected SHA，cache receipt也没有成为第二份 authority。
- workspace 侧继续独立记录 `WORKSPACE_LIFECYCLE_HEAD`。smart 与 autonomous 从同一 markerless baseline 分叉，
  activation/disarm/re-arm 均要求 direct parent + exact one-path diff；autonomous reprepare 只允许 task、nonce、attestation
  三条路径。
- bounded tamper 被明确限制为 F3B3 disposable checkout 的单一 `task_plan.md` dirty path；F3B1 只验证命令语法和边界，
  没有创建真实 tamper、validation ref 或 machine state。
- 新增 exact evidence validator，拒绝 extra keys、伪造 hash、stage/profile/Hook/worktree/advisory 关系冲突和没有最终
  `exit_code=0` 的记录。它只服务 repository/runbook evidence，不进入 managed runtime 或 Release ZIP。
- disposable local Git fixture 已闭合两条完整 DAG；真实 development active scope 仍 markerless。production runtime、
  contracts、bundle、installer、bootstrap 与 Release inventory没有因 F3B1 增加新对象。

### F3B1 对象生命周期复核

| 对象 | 实施后状态 / owner | 后继动作 | 退休或复核条件 |
|---|---|---|---|
| F3 runbook | PROTOCOL-MATERIALIZED / LIVE-PENDING / maintainer | F3B2/F3B3 按授权逐段消费，禁止一次性全跑 | F3B PASS 后转 accepted workflow；NO_GO/协议替换时退休 live claims |
| exact setup/maintenance transaction | VERSIONED RUNBOOK AUTHORITY / maintainer | 两个 Cloud phase 复制同一 block；expected HEAD/SHA 由维护者配置 | maintenance 无法执行、Cloud lifecycle变化或 runtime supply chain改变时重新 Discovery |
| `validateF3EvidenceRecord` | REPOSITORY-ONLY EVIDENCE VALIDATOR / tests | F3B2/F3B3 校验 stage records；不复制到 production | F3/F3C closure、evidence schema v2 或专用受信 producer取代时复核/退休 |
| `f3b-protocol.test.js` disposable DAG | NO-LIVE REGRESSION GUARD / repository tests | 保持 exact parent/path/profile关系和 runbook静态合同 | F3 route NO_GO、Git-backed protocol替换或 history封存时复核 |
| environment inputs / evidence JSON | FUTURE TASK-SCOPED EPHEMERAL DATA / maintainer | 只在获批 live task 显式提供、采集后随 evidence归档 | 每个 Cloud task结束即失去运行时 authority；不能变成 cache secret/receipt |
| smart/autonomous validation refs | ABSENT / F3B2/F3B3 maintainer | 当前不创建；后继按独立 gate 添加并冻结 | F3C/Phase 9 retention decision后人工退休 |
| real profile/activation/tamper state | ABSENT / NOT AUTHORIZED | F3B2 或 F3B3 新授权后才创建 | disarm、environment销毁与 evidence closure |
| production/contract/bundle/Release对象 | UNCHANGED / existing owners | F3B1 无动作 | 只有新 demand触发独立 trust/Release transaction |

实施后的退出状态是：

`F3B1_PROTOCOL_READY / NO_LIVE_STATE / STOP_BEFORE_F3B2`

它只把未来实验做成可审计协议；不构成 smart/autonomous Cloud PASS，也不授权 F3B2、F3B3、F3B4、F3C、seal、
publication、promotion 或 baseline rotation。

<a name="phase-4-7-post-implementation-status-f3b2"></a>

## Post-implementation status — F3B2

这里的 “implementation” 原先只指 **F3B2 本地 foundation、transport refs 与 smart validation DAG 已物化**；以下先保留
当时尚未执行真实 Cloud 时的实施复核，再追加后续 live evidence 尾注。这样不篡改原始时间语义，也不会让旧 pending
状态继续冒充当前事实。

维护者后来单独授权进入 F3B2。当前本地施工与本里程碑冻结的安全模型一致：

- development branch 继续 markerless；smart state 只存在于隔离 validation refs，没有 merge 回 `0.4.0-dev`。
- `S_PREP → S_ARM → S_DISARM → S_REARM` 保持 direct-parent 线性关系；四条边分别只允许新增 `.mode`、新增
  activation、删除 activation、重新新增相同 activation。每个节点都通过 exact state 与 changed-path 检查。
- `RUNTIME_SOURCE_HEAD` 继续与各 stage 的 `WORKSPACE_LIFECYCLE_HEAD` 分开。candidate、production runtime、contracts、
  bundle、installer、bootstrap 与 Release inventory均未因本地链发生变化。
- 本地完整回归、候选可复现性与 development markerless guard 已闭合；没有 push、Cloud environment 配置、真实 Host
  event、cache/maintenance 或 evidence JSON，因此这些证据仍为 `ABSENT / CLOUD PENDING`。
- F3B3 autonomous、tamper、F3B4 evidence closure 与 F3C rollback 没有被顺带创建或授权。

### F3B2 施工与原规划的细化

主路线没有偏航，但施工把三个原先只在拓扑图中的细节变成了明确生命周期对象：

1. `R` 除了是 markerless commit，还增加了一个冻结的 runtime-source transport ref。它只负责让维护者把 exact commit
   运到 Cloud，不能替代 commit SHA、candidate SHA 或 setup/maintenance verification，也不是第二份 source authority。
2. 本地 state chain 实际通过依次切换 dedicated validation branches 物化，而不是另建额外 worktree。每次提交前后仍执行
   clean-status、state、parent 与 exact-path 检查，最后切回 development branch 并重新证明 markerless legacy；因此这是
   本地施工载体的变化，不改变“validation state 不进入开发分支”的架构不变量。
3. validation chain 建成后的 markerless handoff/documentation commits 不替换 `RUNTIME_SOURCE_HEAD`。runtime source 继续冻结
   在已验证的 `R`；后续 development HEAD 只记录 programme 与交接状态，避免 moving branch 悄悄成为 runtime authority。

当前 exact commit/ref 值仍只写活动 task plan；本历史尾注记录已选结构、偏差与生命周期，不复制一个会随 Cloud evidence
变化的第二份执行账本。

### F3B2 对象生命周期复核

| 对象 | 当前状态 / owner | 后继动作 | 退休或再次审核条件 |
|---|---|---|---|
| markerless runtime-source transport ref | LOCAL FROZEN / REMOTE PENDING / maintainer | push 后冻结；setup/maintenance 仍按 exact commit + candidate SHA 核对 | F3C/Phase 9 retention decision、F3B NO_GO 或 runtime source replacement |
| smart `S_PREP/S_ARM/S_DISARM/S_REARM` refs | LOCAL MATERIALIZED / CLOUD PENDING / maintainer | 按顺序逐 stage 选择；禁止移动或 merge | F3C/Phase 9 evidence retention decision；任一 relation 漂移则整条链废弃重建 |
| `.mode` / smart activation state | VALIDATION-REF-ONLY / maintainer-user | prepared/disarmed 保持 inert；armed/rearmed 只在 exact selected ref 表达 opt-in | ref 退休、scope 关闭或 protocol replacement；不得迁入 history/development |
| development markerless guard | ACTIVE DEVELOPMENT BOUNDARY / repository tests | KEEP；继续拒绝 validation state 泄漏主线 | Phase 9、F3 NO_GO 或 repository state policy replacement |
| F3 runbook / evidence validator | PROTOCOL READY / LIVE CONSUMER PENDING | F3B2 Cloud stages按现有 schema 消费 | Cloud lifecycle 差异、evidence schema v2 或 F3 route closure |
| Cloud environments / stage evidence JSON | ABSENT / maintainer | push/config 后逐 stage 采集；无最终 exit code 只能 `INCOMPLETE` | 每个 task结束归档；不能变成 cache/source/consent authority |
| production/contract/bundle/Release objects | UNCHANGED / existing owners | 无动作 | 只有新 demand触发独立 trust/Release transaction |
| F3B3 autonomous/tamper objects | ABSENT / NOT AUTHORIZED | 不创建 | F3B2 live PASS + 人工复核 + 新授权 |

当前阶段状态是：

`F3B2_LOCAL_CHAIN_READY / CLOUD_LIVE_PENDING / LIVE_PASS_ABSENT / STOP_BEFORE_F3B3`（当时状态）

当时规定只有四个 smart stage 的真实 Cloud evidence 全部闭合后，才可提升为
`F3B2_SMART_LIVE_PASS / STOP_AND_REVIEW`；本地 commits、refs 或测试不能替代该结论。

### Subsequent Cloud evidence — 2026-08-16

维护者随后按冻结 operator guide 依次完成 `S_PREP → S_ARM → S_DISARM → S_REARM`。同一 markerless runtime source、
candidate SHA、plan/task identity 在四轮中保持一致；workspace refs 未移动，worktree 均 clean。实际 effective profile 链为
`legacy → smart → legacy → smart`，`S_ARM` 的 Fresh + real Resume、UserPrompt、plan context、production probe、doctor、零
snapshot residue、明确最终 exit code 与四份 evidence record 全部闭合。exact identities 与逐 stage 结果由当前版本 acceptance
保存，本历史文件不复制第二份完整执行账本。

因此上面的退出条件已经满足，后续状态提升为：

`F3B2_SMART_LIVE_PASS / REVERSIBLE_OPT_IN_CONFIRMED / STOP_AND_REVIEW / STOP_BEFORE_F3B3`

对象生命周期随之调整：

| 对象 | Cloud closeout 后状态 | 后继治理 |
|---|---|---|
| runtime-source transport ref | `FROZEN ACCEPTED EVIDENCE` | 禁止移动、merge 或作为 moving authority；F3C/Phase 9 再决定保留期 |
| 四个 smart lifecycle refs | `FROZEN ACCEPTED EVIDENCE` | 保留 exact parent/path/state 关系；后继 gate 不得复用或改写它们表达新状态 |
| 四份 stage evidence JSON | `COMPLETED EPHEMERAL RECORD` | 只作本轮归档证据，不成为 cache/source/consent authority |
| development markerless guard | `ACTIVE DEVELOPMENT BOUNDARY` | 继续保留，拒绝 validation state 泄漏主线 |
| F3 runbook / evidence validator | `CONSUMED / RETAIN` | 保留回归；Cloud 差异或 evidence schema v2 时重新审核 |
| F3B3 autonomous/tamper objects | `ABSENT / NOT AUTHORIZED` | 只有新 Discovery/live 授权后才可创建 |

F3B4/F3C/Release 同样未被本 PASS 自动授权。

<a name="phase-4-7-post-discovery-status-f3b3"></a>

## Post-discovery status — F3B3

维护者在 F3B2 closeout 后另行授权了 F3B3 小型 Discovery。详细代码复核、autonomous workspace base、
零 ledger、tamper 隔离、operator protocol 和对象生命周期结论只见
[`Phase 4.8 decision`](phase-4.8-f3b3-autonomous-live-discovery.md#phase-4-8-decision)；本文件不复制第二份完整方案。

本轮确认 Phase 4.7 的 activation-first、profile-bound state、disarm/re-attest/re-arm 和 canary-only refusal 主路线不变，
但顺序上需要为 F3B3 单独建立 markerless `A_BASE`，再物化 `A_PREP → A_ARM → A_DISARM → A_REPREP → A_REARM`。
这是因为 F3B2/F3B3 的 plan ID 和执行窗口不同；共享的是同一 runtime/candidate 安全模型，不应把旧 smart plan 或
smart validation refs 复用成 autonomous 输入。

当前状态为
`CONDITIONAL_GO_TO_F3B3_AUTONOMOUS_MATERIALIZATION / IMPLEMENTATION_NOT_AUTHORIZED / LIVE_NOT_STARTED`。
autonomous refs、machine state、tamper environment、operator guide 和六份 live evidence 仍为 `ABSENT`；F3B4、F3C、
README/Release byte 变化和远端写入也没有被本 Discovery 自动授权。

<a name="phase-4-7-f3b-gates-in-plain-language"></a>

## F3B0～F3B4 到底分别在问什么（大白话）

上面的分步计划已经给出完整技术条件，但新人最容易把几个编号都看成“继续测 Cloud”。更准确的理解是：每个 gate
回答的是不同问题，前一项通过也不能替后一项作答。

| Gate | 大白话问题 | 类比 |
|---|---|---|
| `F3B0` | “真实 Cloud 验收应该怎么设计，才能既测到 opt-in，又不让 moving branch、脏工作树或模型自报结果混进来？” | 先定考试范围、考场规则和判卷标准 |
| `F3B1` | “先不真的打开 smart/autonomous，setup、状态提交链、tamper 规则、停止条件和 evidence validator 能否在本地完整演练？” | 印好试卷并做无 live 模拟考，证明考试本身可执行 |
| `F3B2` | “更简单的 smart 能不能在真实 Cloud 明确启用、退出、再启用，并在 Fresh/real Resume 中保持正确？” | smart 第一次正式实考 |
| `F3B3` | “autonomous 到底能不能在真实 Cloud 跑通，并且在 attestation tamper 时只保留 canary、绝不泄漏部分上下文？” | autonomous 正式实考，加一场故意破坏状态的安全题 |
| `F3B4` | “smart + autonomous 的全部证据是否完整、互不混淆，并且现在清理哪些对象不会破坏 F3C rollback？” | 汇总阅卷、归档和决定哪些考场材料必须继续保留 |

F3B4 的实际答案不是“现在可以大扫除”，而是：证据已经完整，但 validation refs 正是 F3C 的 rollback 对照输入，因此
当前一个也不删。完整 inventory、provenance、retention 与最终 aggregate closure 见
[`Phase 4.9 post-implementation status`](phase-4.9-f3b4-evidence-closure-discovery.md#phase-4-9-post-implementation-status-f3b4)。

`F3C` 不属于上面这轮“profile 能否 live 运行”的考试。它另问：“先 disarm，再回滚或重装旧 runtime 时，workspace intent
是否仍然安全，旧 token 会不会在未来升级后复活？”所以 `F3B_LIVE_LIFECYCLE_PASS` 仍不能代替 F3C rollback PASS。
