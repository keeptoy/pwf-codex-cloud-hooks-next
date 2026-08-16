<a name="phase-4-8-positioning"></a>

# Phase 4.8：F3B3 autonomous live 小型 Discovery

## Historical position

本文记录 F3B2 smart live 已通过以后、F3B3 autonomous live 尚未施工时的一次关键 gate 复核。它不重做
Phase 4.1 的安全模型，也不把 autonomous、tamper 或 Cloud lifecycle 写成已经通过；当前架构、programme、
验收状态和 Next Step 仍分别以 `ARCHITECTURE.md`、`ROADMAP.md`、版本 acceptance 与活动 planning 为准。

本轮只回答三个问题：现有 owned runtime 是否已经足够支撑 F3B3；F3B3 应怎样生成独立、可审计的 workspace
提交链；真实 Cloud 应收集哪些证据才能把“结构合法”与“生命周期真的发生过”区分开。

<a name="phase-4-8-inherited-evidence"></a>

## 继承证据与本轮增量

F3B2 已经证明：同一个 markerless managed runtime 可以在真实 Cloud 中按
`legacy → smart → legacy → smart` 完成 prepare、activation、disarm、re-arm，并在 activated checkpoint
观察 Fresh、UserPromptSubmit 与 real Resume。它同时证明了两条身份必须分开：

- `RUNTIME_SOURCE_HEAD` 决定安装哪一份 source/candidate；
- `WORKSPACE_LIFECYCLE_HEAD` 决定本轮 workspace 处于哪个 prepare/arm/disarm 节点。

F3B3 不能复用 smart validation refs，也不能把 F3B2 的 plan 改名后继续使用。它新增的证明面是：

1. autonomous preparation 在没有 activation 时仍为 legacy；
2. exact autonomous token 只能激活完整且匹配的 mode、nonce、task attestation 与 ledger 集合；
3. autonomous 输出使用 nonce delimiter 和结构化 ledger 摘要，不读取 raw `progress.md`；
4. task bytes 被修改但未重新 attest 时必须 canary-only / `state_unsafe`，不得回退 legacy；
5. disarm 后修改 task，必须同时更换 nonce 和 attestation，再以单独 activation commit re-arm；
6. 新旧 task digest、nonce 与 Cloud Fresh/Resume 观察能够逐 stage 归属，不能由 expected 值自证。

<a name="phase-4-8-runtime-code-audit"></a>

## Runtime、上游 Skill 与供应链复核

现有 production seam 足够完成上述验证，不需要修改 runtime、Host ABI、contract、bundle、installer 或 bootstrap：

- `owned-plan.py` 先读取 `.pwf-codex-managed`。commit point 不存在时，旧 `.mode`、nonce、attestation 和 ledger
  完全 inert，结果保持 legacy。
- autonomous token 存在后，runtime 才读取并绑定 exact `autonomous\n`、16 位小写十六进制 nonce、当前
  `task_plan.md` SHA-256 attestation 与 bounded ledgers；render 后再次核对全部身份和内容。
- autonomous 私有快照不复制 raw `progress.md`，只复制 task、规范化 state 与 normalized ledger；任何 admission
  或 revalidation 失败都拒绝内容，不产生 partial injection。
- 零 ledger 是合法状态。pristine `ledger-summary.sh` 仍输出固定 `=== RUN LEDGER ===`、`entries: 0`、phase
  计数与 `in_progress`，所以零 ledger 不等于缺失摘要。

工作区中的完整 upstream `planning-with-files v3.8.2` 可以直接用于审计，也可以在用户侧提供 writer 工作流，
但不能因此自动进入 managed trusted graph。尤其 `init-session.sh --autonomous` 还会写 `.stop_blocks` 等 gated
状态，并且其 auto-attest 调用允许 initializer 自身继续返回；这比 F3B3 的 exact autonomous acceptance state 更宽。
因此本轮采用 runbook 的 bounded materializer：先写 mode/nonce/attestation，读回并由 production admission 验证，
最后单独写 activation。它不否定 upstream writer，只是不拿一个更宽的用户侧初始化器替代本轮精确验收协议。

当前四个 pristine runtime 文件已覆盖 autonomous renderer 所需的 `inject-plan.sh`、`ledger-summary.sh` 与解析依赖，
F3B3 不新增第五个 upstream 文件。如果以后确有功能需要导入 `attest-plan.sh`、ledger writer 或其他 pristine
脚本，仍可增加，但必须另开 source/bundle/Release transaction，同步 path、mode、hash、inventory、installer 和
candidate 验收；不能在 live gate 中“按需顺手复制”。

<a name="phase-4-8-autonomous-state-model"></a>

## Autonomous workspace 状态模型

F3B3 应先创建新的 markerless `A_BASE`。它包含本轮 autonomous live plan 和活动指针，但没有任何 machine state；
随后把 `A_BASE` 冻结为本轮 runtime-source transport ref，并从它建立下面的独立 workspace 链：

```text
A_BASE (markerless autonomous-live plan)
└─ A_PREP    add only .mode/.nonce/.attestation
   └─ A_ARM      add only .pwf-codex-managed
      └─ A_DISARM   delete only .pwf-codex-managed
         └─ A_REPREP  change only task_plan.md/.nonce/.attestation
            └─ A_REARM   add only .pwf-codex-managed
```

这对 Phase 4.7 的图做了一项顺序细化：F3B2 和 F3B3 共享同一套 markerless runtime/candidate 行为与安全模型，
但因为两轮 live gate 依次发生、plan ID 不同，F3B3 需要自己的 markerless workspace base。否则 `A_PREP` 会混入
创建/替换 plan 的改动，无法再证明“preparation 只增加三个 autonomous state 文件”。

| Workspace stage | Repository state | Production effective profile | exact 变化 |
|---|---|---|---|
| `A_BASE` | `legacy` | `legacy` | 本轮 plan records；无 machine state |
| `A_PREP` | `autonomous_prepared` | `legacy` | 新增 `.mode`、`.nonce`、`.attestation` |
| `A_ARM` | `autonomous_armed` | `autonomous` | 只新增 profile-bound activation |
| `A_DISARM` | `autonomous_prepared` | `legacy` | 只删除 activation |
| `A_REPREP` | `autonomous_prepared` | `legacy` | 只改 task、nonce、attestation；三者均须与旧值不同 |
| `A_REARM` | `autonomous_armed` | `autonomous` | 只重新新增 profile-bound activation |

`WORKSPACE_STAGE` 回答“刚做了哪一步”，`REPOSITORY_STATE` 回答“当前文件组合是什么”，
`EFFECTIVE_PROFILE` 回答“production 最终按什么 renderer 运行”。三者继续独立记录；expected profile 只用于
比较，实际值必须来自 installed production probe。

<a name="phase-4-8-validation-topology"></a>

## Cloud 执行顺序与 operator protocol

F3B3 implementation 应先物化本地 refs 和一份完整独立的
`v0.4.0-dev-f3b3-autonomous-live-operator-guide.md`。最终 guide 必须像 F3B2 guide 一样自包含，不要求操作者
来回拼接 F3 runbook；但在 refs、task bytes、nonce、attestation 与 candidate identity 冻结前，不应预写假的
HEAD/SHA 或可执行脚本。

建议 Cloud 顺序固定为六个隔离任务，不提供多套可选排序：

1. `A_PREP` cold Fresh：setup/maintenance → workspace preflight → 第一条无工具 Host 观察 → production/doctor/residue
   检查 → prepared evidence；实际 profile 必须 legacy。
2. `A_ARM` cold Fresh：同样顺序验证 autonomous；随后对同一 armed session 做一次明确的 real Resume，再收 armed
   evidence。
3. `A_ARM_TAMPER` disposable task：从 exact `A_ARM` 开始，执行下节唯一负向变更并在 follow-up UserPromptSubmit
   验证 canary-only；完成后销毁环境。
4. `A_DISARM` cold Fresh：验证 activation 已删除且实际 profile 恢复 legacy。
5. `A_REPREP` cold Fresh：验证新 task、新 nonce、新 attestation 已共同提交但仍未激活，实际 profile 仍为 legacy。
6. `A_REARM` cold Fresh：验证新 autonomous context；随后对同一 re-armed session 做一次明确 real Resume，再收
   rearmed evidence。

每轮只有一个顺序：transaction 完成并取得最终 exit code → preflight → 第一条无工具 Host 观察 → 最终只读检查 →
evidence validation。异步工具返回 `session_id` 或没有最终 `exit_code` 时必须继续轮询；只能报告
`INCOMPLETE/UNKNOWN`，不能用缺少 PASS 的中间 stdout 猜失败。

`A_ARM` 与 `A_REARM` 必须各自有一次有意安排的 real Resume。其他 stage 在连续对话中如果实际出现 resume 可以
诚实记录，但不能替代这两个 mandatory checkpoint。`validateF3EvidenceRecord()` 只验证 source 数组合法、有序、
不重复；Host 原始 canary、Cloud task/session、probe JSON 与最终 exit code 才证明来源。

Activated probe 和 Host context 还必须证明：

- delimiter 使用本 stage 的 exact nonce；
- `Plan-SHA256` 等于本 stage 的 exact task digest；
- 存在 `=== ledger summary ===`、`=== RUN LEDGER ===` 与 `entries: 0`；
- 不存在 `=== recent progress ===`，也不出现 plan 中预埋的 raw-progress exclusion sentinel；
- `A_REARM` 不出现旧 nonce 或旧 task digest。

Cloud environment cache 只记录 `reset|hit|miss|unknown` 观察，不参与授权或正确性。owned private snapshot 内部的
SHA cache 跟随 snapshot 被清理，也不能被误写成 Cloud cache persistence evidence。

<a name="phase-4-8-tamper-boundary"></a>

## Bounded tamper 的唯一合法形态

tamper 不是第六个 Git ref，也不创建故意 stale-attestation commit。它只能从 exact `A_ARM` 派生一个 disposable
dirty worktree：

1. 先证明 checkout HEAD 精确等于 `A_ARM` 且 worktree clean；
2. 只向当前 plan 的 `task_plan.md` 增加一个冻结的 tamper sentinel；
3. `git status --porcelain=v1 --untracked-files=all` 必须只有该路径的单一 ` M`；
4. follow-up UserPromptSubmit 只允许 canary，不允许任何 plan body/partial context；
5. installed probe 必须为 `outcome=invalid_request`、`inject=false`、`effective_profile=null`、
   `advisory=state_unsafe`；
6. 收集 doctor、zero snapshot residue、tampered evidence 与最终 exit code 后销毁整个 Cloud environment。

正常 stage verifier 必须坚持 clean worktree。tamper 使用单独 verifier，不能为了让负向 case 通过而把通用 preflight
改成“clean 或 dirty 都行”。模型只获准执行这一处 disposable edit；禁止 repair、re-attest、reset、commit、push、PR
或继续把该环境用于正向证据。

<a name="phase-4-8-evidence-and-stop-rules"></a>

## Evidence record、退出条件与失败分流

F3B3 需要六份 stage record：`prepared`、`armed`、`tampered`、`disarmed`、`reprepared`、`rearmed`。其中
tampered record 的 `workspace_lifecycle_head` 仍是 `A_ARM`，但 `worktree=tamper_only`；它不能伪造一个不存在的
tamper commit。

repository-only validator 继续负责 exact keys、hash 格式和 stage/profile/worktree 关系，不升级成 Host provenance
authority。F3B3 的最终汇总必须把六份 records 与下面原始事实逐一对账：runtime source ref、candidate SHA、workspace
HEAD/parent/path diff、task digest、nonce、Host canary/context、probe JSON、doctor JSON、snapshot residue、Cloud task/session
身份和每条长命令的最终 exit code。

以下任一情况立即 `STOP_AND_REVIEW`：

- 需要修改 production、contract、Host ABI、trusted graph 或 Release input 才能通过；
- `A_PREP/A_REPREP` 自行变成 autonomous，或 armed-invalid/tamper 回退 legacy；
- activation/disarm commit 混入其他路径，reprepare 没有同时轮转 task/nonce/attestation；
- autonomous 暴露 raw progress、缺少零 ledger 结构摘要或 `A_REARM` 仍使用旧 digest/nonce；
- tamper 产生第二个 dirty path、commit/ref/PR，或环境没有在收证后销毁；
- source/workspace/candidate 身份漂移、没有最终 exit code、snapshot residue 非零；
- upstream writer 或额外 pristine 文件成为继续验收的隐含前提。

smart 已 PASS 而 autonomous 失败时，不自动把当前列车解释成可发布 smart-only stable。维护者必须另开 scope 决定
修复后重跑、延期 autonomous，还是重新定义版本能力面。

<a name="phase-4-8-lifecycle-ledger"></a>

## F3B3 对象生命周期账本

| 对象 | 当前状态 / owner | F3B3 materialization 动作 | 复核或退休条件 |
|---|---|---|---|
| F3B2 smart refs/evidence | FROZEN ACCEPTED EVIDENCE / maintainer | 只读继承，不移动、不复用为 autonomous state | F3C/Phase 9 retention decision；历史证据不改写 |
| F3B3 `A_BASE` runtime-source ref | ABSENT / maintainer | 从 markerless autonomous-live planning commit 冻结 exact ref | F3C/Phase 9 后按 evidence retention 人工决定 |
| `A_PREP…A_REARM` refs | ABSENT / maintainer | 独立物化 direct-parent/exact-path DAG | F3C/Phase 9 后人工退休；agent 不删除远端 ref |
| autonomous plan state | ABSENT / validation branch owner | 只存在于 validation refs，不合并回 development branch | disarm/re-attest/re-arm 按 stage；programme close 后清退 live scope |
| tamper worktree | ABSENT / one disposable Cloud task | 从 exact `A_ARM` 临时增加单一 task edit | record 闭合后立即销毁，永不 commit/ref/Resume 为正向证明 |
| zero ledger | SUPPORTED EMPTY SET / no writer claim | 验证 fixed summary 与 raw-progress exclusion | Phase 8 重新决定 writer、lock、atomicity、rollback residue |
| upstream user-side writers | AVAILABLE BUT OUTSIDE MANAGED GRAPH / upstream | 只作审计参考；本轮不导入、不执行为隐含 authority | 新 writer/product requirement 出现时另开 supply-chain Discovery |
| F3B3 operator guide | ABSENT / maintainer | refs 与 exact inputs 冻结后生成一份自包含 guide | F3B3 close 后冻结为历史执行入口；protocol v2 时替换 |
| six evidence JSON records | ABSENT / Cloud task owner | 逐 stage 从实际输出生成并结构校验 | F3B4 汇总后只作归档，不成为 source/cache/consent authority |
| README pre-live sentence | DEFERRED RELEASE-INPUT CLEANUP / future candidate | 本轮不改；以后改成状态无关表述，不写 live 流水账 | 下一次 ZIP-changing candidate transaction 重建并重验 |

<a name="phase-4-8-decision"></a>

## Decision

结论为：

`CONDITIONAL_GO_TO_F3B3_AUTONOMOUS_MATERIALIZATION / IMPLEMENTATION_NOT_AUTHORIZED / LIVE_NOT_STARTED`

现有架构和 production code 足够，F3B3 不需要再做大范围技术探路。下一次若维护者明确授权，先进入 bounded
materialization：创建新的 markerless `A_BASE`、独立 autonomous refs、自包含 operator guide 与 repository-only
校验；完成本地验证后必须再次停止，由维护者 push refs/branch 并逐轮执行 Cloud live。

本结论不授权创建 refs/machine state、执行 tamper、启动 Cloud task、进入 F3B4/F3C、修改 README/Release bytes，
也不授权任何 push、PR、tag、Release、publication 或 promotion。
