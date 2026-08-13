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
bundle/manifest/Release/trust gate。后继 exact source 已闭合 F3A Linux/Source-Candidate no-live 验收；该结果只把
repository/source foundation 推进到目标 Linux 与 no-live Cloud，不是 live opt-in 证据。F3B live activation、F3C rollback、
seal、publication和远端写入仍未授权。

<a name="phase-4-6-post-implementation-design-reconciliation"></a>

## Post-implementation design reconciliation — F3A

本节参照 Phase 4.5 的写法，只比较“F3 Discovery/F3A 职责冻结时准备怎么做”与 `bdbc5a3` 实际落地了什么；不把
本地 fixture、source helper 或 no-live candidate 误写成真实 Cloud lifecycle 证据。结论是：**主路线没有偏航，权限面和
Release 面也没有扩张；差异集中在 verifier 分层、测试复用和后继 transition guard 三项实现细化。**

| Discovery / F3A 约束 | 实际落点 | 分类 | 后续含义 |
|---|---|---|---|
| 只对 active scoped plan 开放 exact machine state | `repository-boundary.test.js` 把 active scope 交给共享 verifier；inactive/history scope 仍精确限制为三份 Markdown 记录 | 按计划落地 | 不能把 machine state 搬入历史 scope，也不能为了 F3B 方便而放宽未知文件、链接、hard-link、预算或 state-combination 拒绝 |
| repository admission 不能只做文件名 allowlist | verifier 同时核对 regular file、hard-link count、exact mode/token/nonce/attestation、task digest、ledger filename/aggregate budget 与完整状态组合 | 按计划落地并具体化 | 文件名合法但状态残缺、profile/token 错配或 digest 漂移仍阻断；F3B 不得把这些负向断言改成 advisory |
| 不建立第二套 runtime/ledger parser | repository verifier 对固定 framing 与 Git shape负责；ledger record语义直接调用当前 exact source 的 `owned-plan.py.normalize_ledger`，prepared-state副本再交给 installed `owned-plan.py` 做完整 admission | 实现细化 | JS helper不是独立 runtime authority；若 Python normalizer接口重构，helper、tests和runbook必须在同一 transaction内调整，不能让两套 grammar 漂移 |
| 使用版本化命令与现有只读 probe，默认不新增 shipped executable | 实际分成版本化 runbook、`tests/f3-lifecycle-helpers.js` repository-only verifier和 installed production probe三层；全部位于 Release 外 | 实现细化，不是 trusted-graph 扩张 | helper虽位于 `tests/`，同时被runbook消费，准确定位应是 repository-only source verifier；若未来要做长期用户CLI，必须另开 producer/distribution设计，不能直接把它搬进managed inventory |
| preparation inert，activation最后且独立 | disposable Git fixture证明 preparation后继 commit只能新增 `.pwf-codex-managed`，disarm commit只能删除同一路径；runbook同时核对direct parent、task digest和clean worktree | 按计划落地 | F3B只能从reviewed preparation进入activation；任何额外路径、模糊parent或task变化立即停止 |
| F3A不在真实仓库创建activation state | 所有smart/autonomous写入只发生在系统临时目录；真实active planning由repository test显式要求为markerless `legacy` | 更强的停止点证明 | 这个exact `legacy`断言是F3A过渡守卫，不是永久产品合同；见下方transition说明 |
| F3A建立专用runbook，不把未证明live行为塞进通用模板 | 新建版本专用F3 runbook；通用B～E和9.1脚本保持不变，版本acceptance只增加F3A pending增量 | 按计划落地 | no-live PASS只更新F3A Cloud行；F3B/F3C必须各自追加独立状态与exact evidence，不得覆盖F3A证据 |
| managed runtime、Host ABI、bundle/Release和四文件inventory保持不变 | 两次candidate build仍与F2B字节完全一致；新增文件全部在`.planning/`、`docs/`或`tests/` | 按计划落地并得到字节证据 | F3A不能被用作新增upstream文件已获准的先例；四文件只是当前inventory，未来扩充仍需原子供应链gate |
| local/Linux/no-live是F3A退出面，live与rollback后置 | local与 Linux/Source-Candidate no-live 均已闭合；F3B/F3C仍明确未授权 | 按计划闭合 F3A | 当前可说 `F3A_SOURCE_CANDIDATE_NO_LIVE_CLOUD_PASS`，仍不能说 Cloud opt-in lifecycle 可用 |

### F3A → F3B transition guard

当前 `repository-boundary.test.js` 不仅调用结构 verifier，还要求真实active planning结果精确为 `legacy`。这在F3A很有价值：
它机器证明本轮没有偷偷创建真实state。但它不能原样跨入F3B，否则合法的preparation会返回`smart_prepared`或
`autonomous_prepared`，合法的activation又会返回相应`*_armed`，从而让测试与产品生命周期互相冲突。

因此F3B preparation commit必须在**同一个reviewed preparation transaction**中完成两件事：加入完整但inert的state，
并把“真实仓库必须等于`legacy`”替换为“真实仓库必须通过exact lifecycle verifier且处于本轮获批profile的prepared/armed
闭包”。后续activation-only和disarm-only commit不再修改测试；它们只增删commit point，state由仓库字节本身表达。
这不是放宽结构准入，而是退役F3A的no-live临时断言。若F3B最终`NO_GO`，必须恢复markerless legacy守卫，或随
autonomous/smart product-pending route一并退役对应state和runbook，不能留下无owner的宽窗口。

<a name="phase-4-6-post-implementation-lifecycle-reconciliation"></a>

## Post-implementation lifecycle reconciliation — F3A

下表是F3A本地实施后的对象级快照。当前programme状态仍只由ROADMAP与活动task plan维护；这里负责回答“为什么存在、
谁消费、何时晋级/替换/删除”，防止F3B/F3C或版本轮转后留下无owner残留。

| 对象 / seam | 实施后生命周期状态 | owner / producer → consumer | 当前可执行证据 | 晋级、复核或退役条件 |
|---|---|---|---|---|
| active-scope structural/state admission | **ACTIVE SOURCE GOVERNANCE** | repository bytes → shared verifier → repository boundary | complete smart/autonomous、partial/mismatch/unknown/link/inactive refusal tests | supported lifecycle存在期间保留；protocol replacement时原子更新；F3 route整体`NO_GO`时收缩回markerless规则 |
| inactive/history three-record denial | **ACTIVE LONG-LIVED GUARD** | repository inventory → repository boundary | inactive scope machine-state refusal | 不随F3B激活放宽；只有全新repository lifecycle Discovery可改变 |
| real-active-scope exact `legacy` expectation | **TRANSITIONAL F3A NO-LIVE GUARD** | current checkout → repository boundary | 当前真实planning markerless断言 | F3B preparation commit中原子替换为获批profile的prepared/armed闭包；F3B `NO_GO`则恢复或保留legacy-only |
| `tests/f3-lifecycle-helpers.js` | **REPOSITORY-ONLY SOURCE VERIFIER / PRODUCT-PENDING** | repository tests与F3 runbook → framing/Git-shape检查；ledger语义委托source normalizer | focused tests、repository test、runbook静态合同 | F3B/F3C期间保留；不得进入ZIP/managed graph；若长期CLI/producer出现则评估迁入专用tools或退休，不能永久借`tests/`充当隐式产品API |
| `owned-plan.py.normalize_ledger` test-side import | **BORROWED INTERNAL AUTHORITY** | exact source module → repository verifier | malformed ledger refusal与no-bytecode-cache guard | 不是新增public API；函数签名/模块边界变化时同transaction更新调用方，或改用等强production probe后退休 |
| disposable prepared-state project | **EPHEMERAL VERIFICATION FIXTURE** | runbook/test → installed `owned-plan.py` | preparation production-probe protocol与cleanup命令 | 每轮必须清理；不得缓存、提交、作为consent或correctness authority |
| installed production read-only probe | **REUSED CORRECTNESS AUTHORITY** | exact request → installed `owned-plan.py` | expectedprofile、outcome/inject/advisory检查 | request/result、renderer、installed identity或opt-in protocol变化时原子复核 |
| preparation/activation/disarm Git relation tests | **ACTIVE PRODUCT-PROTOCOL GUARD** | disposable Git commits → F3 tests | exact direct parent与single-path A/D assertions | Git-backed lifecycle被支持期间保留；官方bounded approval ABI替代或F3 route退休时重审 |
| `docs/v0.4.0-dev-f3-cloud-lifecycle-runbook.md` | **VERSIONED OPERATING PROTOCOL / F3A NO-LIVE PROVEN** | maintainer → F3B/F3C operator | local anchors/Bash/boundary tests + Linux zero-skip Source/Candidate | 继续保留给F3B/F3C；`v0.4.0` identity冻结时随版本文档策略迁移/改名；列车结束后由immutable Git保留历史，current tree按retirement DoD清退 |
| v0.4.0-dev acceptance F3A row | **PASS EVIDENCE / CURRENT GATE POINTER** | exact Cloud evidence → version acceptance | exact HEAD、149/149、deterministic ZIP、B～E、9.1 | 不得被F3B证据覆盖；dev→stable时按单一acceptance规则迁移 |
| managed/upstream writer | **DENIED / ABSENT** | none | inventory/call-edge与runbook边界 | 独立producer Discovery或Phase 8 writer gate前不得准入 |
| current four pristine runtime files | **KEEP — CURRENT INVENTORY, NOT A CAP** | runtime bundle → installer/owned runtime | unchanged deterministic ZIP与bundle checks | 只在真实managed execution需要时通过atomic bundle/manifest/Release/trust gate扩充；不能因工作区有完整upstream树自动加入 |
| optional ledger files in F3 lifecycle | **ZERO ALLOWED / EXTERNAL PRODUCER UNOWNED** | future user-side flow → read-only consumer | zero-ledger fixture与production normalizer | F3B只证明实际使用的零/有限ledger路线；writer ownership、lock、durability和rollback residue仍归Phase 8 Discovery |
| real activation/disarm/Fresh/Resume evidence | **ABSENT / NOT AUTHORIZED** | future F3B | none from F3A | 只能由exact live gate创建；local fixture、source candidate或runbook存在均不能晋级 |
| rollback/disarm-first evidence | **ABSENT / F3C NOT AUTHORIZED** | future F3C | lifecycle design only | F3B PASS并获得独立授权后才创建；runtime-only rollback仍为denied route |

最终生命周期判断：F3A没有产生需要“等Phase 4全部结束再统一删除”的临时production代码。当前需要后继明确处理的
过渡对象只有real-scope `legacy`断言、dev-version runbook/acceptance指针，以及F3 route失败时的product-pending verifier/
protocol tests。它们各自已有退出条件，不应现在删除，也不应无期限保留。

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/e3f6b1a2ad37f7976835f7a38070d105ce35b09c)

该链接只证明 Discovery 开始时的 F2B/no-live accepted source 状态，不解释当前实现；当前 contract、programme 与授权以
当前仓库 authority 为准。
