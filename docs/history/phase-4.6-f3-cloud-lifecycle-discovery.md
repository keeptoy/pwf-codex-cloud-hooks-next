<a name="phase-4-6-historical-position"></a>

# Phase 4.6：F3 Cloud lifecycle Discovery

## Historical position

本里程碑位于 `v0.4.0-dev` 的 F2B read-only autonomous consumer 完成本地与 Source/Candidate/no-live Cloud
验收之后。它只关闭 F3 的路线探路与施工分门，不表示真实 opt-in、rollback、Release 或 baseline promotion 已完成。

## Problem before

F2B 已经证明 managed runtime 能 fail-closed 地读取 smart/autonomous state，却没有证明 Cloud 用户能安全地产生、审核、
激活、撤销并跨 Fresh/Resume 保持这些状态。此前的 Git-backed 首选和 same-chat 备选仍有四个未闭合问题：

- 官方 Cloud review/follow-up 与 container cache 是否足以充当授权和状态持久化协议；
- pristine upstream initializer 是否能原子地产生当前 managed protocol；
- 本仓库 planning lifecycle 是否允许提交这些 machine files；
- runtime rollback 后遗留 activation 是否会在重新升级时复活。

## Core decisions

1. **Git-backed 双阶段保留为唯一首选。** preparation commit 只放 mode、nonce、attestation 和可选 ledger；第二个
   activation-only commit 只增加 profile-bound token。Fresh Cloud 从 exact activated commit 启动，不依赖未提交 worktree。
2. **same-chat 不进入首轮稳定验收。** 官方文档证明 review/follow-up 与最长 12 小时 container cache，但没有承诺未提交
   状态跨 checkout、maintenance、cache invalidation 或 rebuild 持久；它保留为以后单独 Discovery 的实验路线。
3. **不把 upstream initializer 当成完整 producer transaction。** pinned v3.8.2 的 initializer 会先写 mode/nonce，并吞掉
   attestation failure；F3 必须用 fail-closed preparation/verification，activation 始终最后且独立。
4. **autonomous 是 frozen-plan opt-in。** armed 后 task bytes 变化必须拒绝；修改执行计划需要先 disarm，再重新审核
   attestation，最后以新 activation-only commit re-arm。
5. **rollback 必须先处理 workspace intent。** 只回滚 runtime 会让 token 暂时 inert，却可能在未来升级时复活；支持路线
   必须先提交 disarm，再执行 candidate → accepted predecessor → candidate 的安装切换。
6. managed runtime 继续只读；不新增 Host event、managed writer、外部认证服务、secret、environment-token 或点击链接。

## Completed delivery

Discovery 将后续工作拆成三个可独立停止的 gate：

| Gate | 范围 | 完成后仍不代表 |
|---|---|---|
| F3A | active-scope machine-state 仓库准入、基于版本化命令和现有只读 probe 的 fail-closed prepare/verify、专用 runbook、local/Linux/no-live regression | 真实 Cloud activation PASS |
| F3B | smart/autonomous exact-commit Fresh、UserPrompt、real Resume、tamper refusal、disarm/re-arm 与 cache-independent behavior | rollback 或 Release PASS |
| F3C | disarm-first candidate → immutable v0.3.5 → candidate reinstall，验证无 dormant activation resurrection | seal、publication 或 baseline promotion |

F3A 必须保持 `.planning/` 在 Release 外，只允许 active plan 的 exact state names，拒绝 inactive/history scope 残留、链接、
未知文件和不完整 activation。它默认不新增 shipped executable；若实施时发现必须引入 helper，需先独立冻结其 distribution、
hash admission 与 retirement，不能顺手进入 managed inventory。F3B 的 autonomous 最小 happy path允许零 ledger；ledger writer 的长期 owner、lock、cache/
Resume durability 与 mutable gate state仍留给 Phase 8 Discovery。

### F3A 职责拆解

F3A 不是“先在真实仓库里造一次 token 看看”，而是把 F3B 将要依赖的地基做成可执行合同。它承担四项职责：

1. **仓库准入。** 只对 `.active_plan` 指向的 scoped plan 开放 exact machine filenames；inactive/history scopes 仍只允许
   三份 Markdown 记录。准入同时检查 regular-file、内容 grammar、完整状态组合、profile/token 关系与 task digest，不能
   只做文件名 allowlist。
2. **准备协议。** 冻结 smart/autonomous 的 prepare 顺序、原子文件写入、activation-absent 检查、exact diff review 和
   production read-only probe；不把 upstream initializer 的 best-effort transaction 提升为 product authority。
3. **Git 关系验证。** preparation commit 保存完整但 inert 的 state，后继 activation commit 只能增加
   `.pwf-codex-managed`，且 parent、task bytes 和其他 state bytes 均必须保持不变；disarm 也必须形成独立可审核提交。
4. **验收分流。** 建立独立 F3 runbook 和 evidence schema；F3A 只跑 disposable fixtures、local/Linux/no-live 回归，
   F3B 才能创建真实 state 并验证 Fresh/Resume/disarm/re-arm，F3C 才能执行 rollback。

这里的“四个 pristine runtime 文件”只是当前 runtime bundle 的 exact inventory snapshot，不是未来扩展上限。工作区完整
上游目录可用于阅读和审计，但不能替代 manifest-pinned archive/hash 与 bundle authority。若后续确有 managed execution
需求，可以通过独立的 bundle/manifest/Release/trust transaction 增加 pristine 文件；F3A 当前不需要这样做。

### F3A 对象生命周期账本

| 对象 / seam | F3A 处置 | owner / consumer | 晋级、复核或退役条件 |
|---|---|---|---|
| active-scope machine-state admission | `ADD — SOURCE GOVERNANCE` | repository tests / maintainer review | F3B PASS 后成为 accepted workflow；F3 NO_GO 时随 protocol 退役 |
| inactive/history machine state | `DENY` | repository tests | 不因 active workflow 成立而放宽 |
| prepare/verify procedure | `ADD — VERSIONED RUNBOOK` | user-side flow / F3 verifier | protocol/upstream/Git model变化时重审；专用 producer 成立后评估替换 |
| activation-only commit relation | `ADD — HARD GATE` | Git review / F3B acceptance | 官方 bounded approval ABI 出现或 activation protocol替换时重审 |
| existing `owned-plan.py` probe | `REUSE — READ ONLY` | installed managed runtime | request/result schema或 opt-in protocol变化时原子更新 |
| upstream/local writer | `KEEP OUT OF MANAGED GRAPH` | none in F3A | 只有独立 producer Discovery 或 Phase 8 writer gate 可重新准入 |
| dedicated F3 runbook | `PRODUCT-PENDING` | F3B/F3C operators | live gates PASS 后晋级；路线 NO_GO 时退役，不能永久保留半成品 |
| optional ledger state | `ZERO ALLOWED / NO WRITER CLAIM` | external future producer / read-only consumer | Phase 8 重新决定 owner、lock、atomicity、cache/Resume 与 rollback residue |

## Acceptance conclusion

结论为 `CONDITIONAL_GO_TO_F3A_IMPLEMENTATION`。现有官方 Cloud 原语与 exact Git commit 足以形成高可信路线，但当前仓库
尚缺 machine-state governance、fail-closed preparation verifier 和 live runbook，因此不能从 Discovery 直接跳到 F3B。

本轮只读取官方文档、当前仓库和 manifest-pinned upstream archive；没有创建 activation state、没有执行 live Cloud 或
rollback，也没有修改 managed trusted graph。F3A 完成后必须再次停止并请求 F3B 授权；F3B PASS 后才可请求 F3C。

## Explicit non-goals

- 不宣称 Cloud cache 是 correctness、durability 或 consent boundary；
- 不支持未提交 same-chat state 作为稳定产品路线；
- 不让 activation token 承载用户身份、secret 或账户授权；
- 不把 optional ledger producer/durability 冒充为 Phase 4 已解决；
- 不授权 push、PR/merge、live activation、rollback execution、seal、publication 或 promotion。

## Successor inheritance

后继 F3A 继承 exact profile-bound tokens、F2B read-only admission 和 legacy 默认不变，只补 source/repository lifecycle，
不得新增第二套 runtime 或 managed writer。F3B 继承 Git 两阶段和 frozen-plan 语义；F3C 继承 disarm-first 规则。任一 gate
需要 cache continuity、模糊 HEAD、activation commit 混入其他变更或 runtime-only rollback，都必须停止而不是降级安全边界。

<a name="phase-4-6-post-implementation-status"></a>

## Post-implementation status

维护者随后明确授权 F3A。实际实现与 Discovery 主路线一致：repository test只对 `.active_plan` 指向的 scoped plan开放
exact machine filenames，并验证固定 state framing、profile/token关系与 task attestation；inactive/history scope仍严格只有
三份 Markdown 记录。独立 disposable fixture证明 complete smart/autonomous preparation/armed状态、partial/mismatch/link/
unknown/inactive refusal，以及 activation/disarm commit只能增删 commit-point一个路径。

source-side prepare/verify没有新增 shipped writer，而是落在版本化 F3 runbook：单文件用同目录临时文件与原子 rename准备，
真实 plan始终保持 activation absent；prepared state复制到 disposable project后由 installed `owned-plan.py` 临时验证完整
ledger/renderer语义，避免 Node repository helper复制第二套 production ledger parser。后继 activation必须直接以 reviewed
preparation为 parent且只有一个新增路径；disarm同理只有一个删除路径。当前真实活动 planning保持 markerless legacy。

本地实施没有修改 production、Host ABI、contracts、runtime bundle、installer、Release entries、bootstrap或当前四个 pristine
runtime文件。四文件仍只是当前 exact inventory，不是永久上限；未来扩充必须按实际 managed execution需求另开原子的
bundle/manifest/Release/trust gate。F3A Linux/Source-Candidate no-live验收仍待维护者执行；F3B live activation、F3C rollback、
seal、publication和远端写入仍未授权。

<a name="phase-4-6-post-implementation-lifecycle-reconciliation"></a>

## Post-implementation lifecycle reconciliation

| 对象 / seam | 实施后状态 | owner / consumer | 下一次复核或退役条件 |
|---|---|---|---|
| active-scope path/state admission | **ACTIVE SOURCE GOVERNANCE** | repository tests / maintainer review | F3B PASS 后晋级；F3 NO_GO 或 protocol replacement 时退役 |
| inactive/history state denial | **ACTIVE PERMANENT GUARD** | repository tests | 仅全新 repository lifecycle Discovery 可改变 |
| Node repository helper | **TEST-ONLY STRUCTURE CHECKER** | repository/F3 tests | 不得演化成第二套 ledger/runtime parser；职责扩大即重审 |
| production prepared-state verification | **REUSE VIA DISPOSABLE COPY** | installed `owned-plan.py` | request/result、renderer或 protocol变化时同步更新 runbook |
| F3 versioned runbook | **LOCAL COMPLETE / CLOUD-PENDING** | maintainer + F3B/F3C operator | no-live PASS 后可请求 F3B；lifecycle NO_GO 时退役 |
| managed/upstream writer | **DENIED / ABSENT** | none | 独立 producer Discovery 或 Phase 8 writer gate |
| four current pristine runtime files | **KEEP — CURRENT INVENTORY** | runtime bundle | demand-driven atomic supply-chain gate；数量不是永久常量 |
| real activation/disarm/rollback evidence | **ABSENT / NOT AUTHORIZED** | future F3B/F3C | 只有 exact live gate可创建，不从本地 fixture推断 |

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/e3f6b1a2ad37f7976835f7a38070d105ce35b09c)

该链接只证明 Discovery 开始时的 F2B/no-live accepted source 状态，不解释当前实现；当前 contract、programme 与授权以
当前仓库 authority 为准。
