# 路线图

本文件是后续 Product Phase、版本列车、Cloud 验收、Release 晋级和 rollback 状态的唯一宏观权威。
已经发生的版本变化见 [`CHANGELOG.md`](CHANGELOG.md)，不可变来源与资产见
[`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)。精确 Next Step、当前授权、禁止事项和停止条件仍由
活动 `task_plan.md` 决定。

## 1. 文档分层与活动 planning

面向所有读者的“问题 → 唯一权威”导航见
[`README.md` 的“开发状态与文档地图”](README.md#documentation-map)。本文件只回答 programme 将去哪里、
当前版本角色是什么，以及 Phase/版本列车要证明什么；不维护逐次实现流水账或证据表。

ROADMAP 与活动 planning 互补：ROADMAP 管宏观路线和 lifecycle，`.planning/.active_plan` 指向的活动
`task_plan.md` 管当前唯一 Next Step、授权、禁止事项和停止条件。两者若在当前 gate 上冲突，以活动
task plan 为准；只有 programme、Cloud、Release 或 rollback 状态真正变化时才同步本文件。

## 2. 当前基线与仓库角色

本节是当前 lifecycle 角色的唯一完整陈述；其他宏观文档只链接这里。

| 项目 | 当前事实 |
|---|---|
| 源码维护权威 | successor `main` |
| 当前开发列车 | `v0.4.2` Release closeout已完成；双通道Cloud、GitHub Release Latest promotion confirmation、第二轮退役与C2均已闭合，production/runtime行为不变；下一列车未授权 |
| 当前已接受版本 | `v0.4.2`；programme accepted |
| 当前直接回退版本 | immutable `v0.4.1` immediate fallback |
| 回退证据链 | immutable `v0.4.0` deeper fallback；`v0.3.5`与更早发布里程碑见 provenance museum |
| 当前 programme 边界 | Product Phase 4、`v0.4.1`发布列车与`v0.4.2`documentation-governance列车均已关闭；`v0.4.2` Source/Candidate、immutable publication与Published Release已`PASS`，GitHub `Latest` promotion confirmation、第二轮退役与C2均已`PASS`。下一Product Phase、下一版本列车与其他外部状态变更未授权 |
| 长期支持范围 | 只正式支持 `OthmanAdi/planning-with-files v3.8.2` |

`v0.4.0` 已完成 immutable publication、公开下载/安装、Fresh/Resume与 pointer-only promotion；P9-E postflight当时确认它为
非 draft、非 prerelease 的 Latest，且v0.4.0/v0.3.5 tag、source与双资产均未改写。当前它已随`v0.4.2`晋级轮转为
deeper fallback。版本 delta见
[`CHANGELOG.md`](CHANGELOG.md)，精确source/资产/SHA见[`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，完整Cloud、
晋级与第二轮退役证据见[immutable v0.4.0 acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/6b388518855da9053713a58e5c918c8b727b6dc6/docs/v0.4.0-cloud-hard-acceptance.md#v0-4-0-p9-f-second-retirement-closeout)。

## 3. 已接受基线 `v0.4.2`

`v0.4.2` 是当前已接受的documentation-governance基线。它完整继承`v0.4.1`的兼容性路径安全修复与`v0.4.0`
已经闭合的Product Phase 4功能和Release合同；本版只整理Release/retirement、Phase history、acceptance与环境记忆的
文档治理，不改变Host ABI、adapter-only policy、pristine upstream、owned runtime信任边界或legacy默认行为。
精确delta见CHANGELOG，底层功能收口仍由下表概括：

| 问题域 | 已完成结果 |
|---|---|
| legacy default | markerless、prepared或disarmed scope继续使用legacy context；不因Cloud/container权限而隐式opt-in |
| smart/autonomous opt-in | exact plan-local activation commit point、profile-bound state、tamper refusal、disarm/re-arm均已通过真实Cloud lifecycle |
| rollback | smart与autonomous均完成disarm-first accepted rollback和exact current recovery；runtime-only revival negatives继续守护 |
| supply chain | bundle/Release v2、manifest schema 4、12-file installed inventory、4-file pristine upstream与adapter-only policy闭合 |
| repository lifecycle | trusted/Release zones继续exact；planning/docs按生命周期治理；当前树保持一个active planning与机器可解析角色窗口 |
| Release | 22-entry deterministic ZIP、ZIP外bootstrap、Source/Candidate与Published Release双通道、公开下载及pointer-only promotion全部PASS |

该基线的实际版本delta见[`CHANGELOG.md`](CHANGELOG.md)，精确source/资产身份与predecessor迁移链见
[`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，完整双通道、晋级、第二轮退役与C2证据见
[`docs/acceptance/v0.4.2-cloud-hard-acceptance.md`](docs/acceptance/v0.4.2-cloud-hard-acceptance.md#v0-4-2-role-window-closeout)。

## 4. 当前开发列车

仓库生命周期治理保持一个active planning，并继续用candidate + accepted role window区分开发工作流、已接受版本与回退资产。
trusted/Release zones 继续 exact，docs/planning zones 按 lifecycle policy 验证；历史细节只从README文档地图进入Phase history、
provenance和对应版本acceptance，不在本节重建逐P9流水。

本节是current development train工作台：活动planning、未封存Discovery和需要current状态的验收材料可以引用对应train anchor，
但这里的临时施工状态不会自动成为长期Product Phase authority。

<a name="v0-4-2-release-closeout"></a>

### 4.1 已关闭的 `v0.4.2` Release closeout

当前列车已经完成Release、acceptance、retirement与history的documentation governance，并在不修改production、runtime、Host ABI、
trusted graph、managed events或Release allowlist的前提下物化`0.4.2`候选身份。package identity `0.4.2`、Release contract、exact v0.4.1
predecessor transition与ZIP外zero-hash bootstrap构成同一候选事务；C2完成后`v0.4.2`是accepted，`v0.4.1`是immediate fallback，
`v0.4.0`进入deeper fallback证据链。

本列车不创建standing Phase 9。Release candidate已获批；非破坏性candidate admission preflight、Source/Candidate、第一轮
source-candidate closeout、tag(C0)、immutable publication、Published Release Cloud、GitHub Release Latest promotion confirmation、
第二轮role-window closeout与C2均已闭合。下一Product Phase和下一版本列车尚未授权。已关闭的`v0.4.0`Release discovery、
`v0.4.1`path-safety列车与本轮Release治理分别由Phase 4.12、Phase 4.13、
Phase 4.14摘要、CHANGELOG、provenance和immutable acceptance恢复；本节只维护当前边界。

当前列车已经完成以下文档治理交付；这些完成项已进入本候选，但不冒充尚未运行的Cloud或publication证据：

- 根`README.md`已经补齐可复制的candidate build/check/hash、正式资产命名与bootstrap两字段seal说明，并把`C0`、
  `Source/Candidate`、`Release-excluded`的新人解释放在候选失效警告之前。`README.md`本身是Release ZIP输入，因此这两轮
  README调整已经使旧候选身份与旧C0失效；候选已按最终README重新双构建/check，本次Release-excluded状态同步完成后形成
  新C0；该C0现已通过Source/Candidate，exact HEAD与通道证据只见版本acceptance。
- 把维护机限制从活动planning和AGENTS内联事实提升为
  [`维护机执行环境档案`](docs/maintenance-environment-profile.md#maintenance-environment-profile)：档案保存带日期的事实状态、影响、
  默认本地/Cloud解法与重验触发器；AGENTS负责强制执行，MAINTAINER_HANDOFF负责人的发现，repository governance负责跨阶段
  提升规则。具体机器事实不在ROADMAP复制；该档案及本轮状态同步均为Release-excluded。
- 文档拓扑preflight把全局入口、专项authority和Release输入拆开盘点；未冻结的candidate guide现位于
  [`docs/acceptance/v0.4.2-cloud-hard-acceptance.md`](docs/acceptance/v0.4.2-cloud-hard-acceptance.md)。`v0.4.1`冻结guide与bootstrap
  已在C2退出current tree，其完整内容迁入exact immutable tag/source、Release资产与provenance链接；现有templates继续在稳定原路径
  `KEEP`，供当前及后继guide引用。本次清退保持README与22-entry ZIP输入不变。
- Source/Candidate真实Cloud暴露C步骤的工具能力缺口：旧协议同时要求先做只读existence检查又禁止Shell，但实际会话没有独立只读
  文件工具。维护者临时授权只读Shell后整条通道PASS；稳定template现允许无独立文件工具时的exact-path只读preflight，正文写入仍
  只能使用apply_patch。该C1修正属于Release-excluded，不改变已验收C0或正式tag目标。
- 维护者随后让tag精确指向C0，发布sealed bootstrap与22-entry ZIP；Published Release Fresh/Resume/9.2使用公开默认下载链全部
  `PASS`，已经冻结并验收exact tag/source/ZIP/bootstrap。维护者随后在GitHub Release编辑页面把同一Release取消Pre-release并
  设为Latest，Release详情页显示`v0.4.2`、`draft=false`、`prerelease=false`；这已按
  [GitHub Release Latest promotion confirmation](#github-release-latest-promotion-confirmation)完成正常确认，不再另设独立postflight，
  tag与双资产identity保持不变。第二退役检查随后完成：维护者授权清退24个已完成且无current入链的非活动planning，以及
  v0.4.1的current guide/bootstrap；长期publication oracle迁移为动态读取`v0.4.2` accepted与`v0.4.1` immediate fallback。
  C2已经把真实退役结果与programme角色原子写回。
- 把Phase history拆分为回补型`RETROSPECTIVE_CAPSULE`与正式Round关闭后冻结的`FROZEN_DISCOVERY_RECORD`，同步history索引、
  写作模板和repository contracts；一个Product Phase可以有多份真实Discovery records，但同一闭合对象最多一份回补型capsule。
- 冻结ROADMAP第4节current train工作台→Discovery Round归档→第5节`product-phase-N`长期authority→Release后列车轮转的完整状态流；
  current-authority链接迁移不得改写原Discovery结论或时间语义。
- 明确当前默认一条版本列车承载一个Product Phase；multi-Phase列车必须由维护者显式授权。patch继承其修补的Product baseline，
  governance按ROADMAP声明的version series落位；无法唯一判断时先与维护者确认，不为迁移第4节虚构第5节Phase。
- 上述详细规则仍由第5节唯一链接进入仓库治理指南；ROADMAP只保留programme级状态，Phase 4.14继续保存本轮治理为何形成
  及其后续深化，不在第4节建立第二个authority入口。

## 5. Product Phase 路线

下表是未来 Discovery 的候选，不是发布承诺，也不自动授权下一 Phase。一个 Phase 可以有多个
pre-release。当前维护默认一条版本列车只承载一个Product Phase；只有维护者在ROADMAP与活动task plan中明确授权后，
多个低风险Phase才可在分别closeout的前提下进入同一列车。

Product Phase closeout时，只把长期Product目标、路线、边界与结论提炼到对应小节，并保留一个Phase-level canonical anchor；
相关history record的current-authority链接从第4节迁到这里。patch/governance列车先按活动task plan、所修补Product baseline与
ROADMAP声明的版本系列判断归属；patch/governance列车没有新Product Phase时不得虚构条目；不能唯一判断时先由维护者确认。
版本资产与Release角色也不得整段搬入本节。完整轮转规则只见[仓库治理指南](docs/repository-governance-guide.md#product-phase-authority-rotation)。

| Phase | 候选版本列车 | 候选范围 | 最低退出/Cloud 门槛 | 状态 |
|---|---|---|---|---|
| 4 | `0.4.0-*` | owned v3 state foundation；显式 smart/autonomous opt-in | F0 → F1A/F1B → F2A/F2B → F3A lifecycle foundation → F3B0～F3B4 Fresh/Resume/disarm/re-arm → F3C rollback；legacy 默认不变 | complete；F3C4、第一轮retirement及当时的v0.4.0 Release closeout均已闭合；功能基线由当前v0.4.2 accepted继承 |
| 5 | `0.5.0-*` | compaction lifecycle | 复核真实 Cloud payload，比较现有 `SessionStart source=clear\|compact` 与 PreCompact/PostCompact 的时序和恢复能力；现有事件足够时不扩大 managed event set，只有真实 context/时序缺口才新增 Hook | pending |
| 6 | `0.6.0-*` | optional selective tool/permission hooks | PreToolUse、PostToolUse、PermissionRequest各自独立 gate；必须分别有 use case、latency/token budget、噪声预算与 Cloud证据 | pending / optional；没有明确收益就逐项或整体 `NO_GO`；不是 Phase 7前置 |
| 7 | `0.7.0-*` | 唯一的 read-only advisory completion evaluator | bounded、non-recursive、无 plan时安静；只 advisory，不阻断、不写 counter/ledger或其他 mutable gate state | pending；可独立于 Phase 6进入 Discovery |
| 8 | `0.8.0-*` | optional hard gating，复用 Phase 7 evaluator | 重新 Discovery writer/counter/atomicity/lock/cache/Resume/rollback；再增加 block cap、escape hatch与 stall state；不得把上游 best-effort shell lock提升为 managed authority | pending；implementation前必须重新 Discovery |

Release closeout不属于Product Phase编号。任何Product Phase或获批的小型patch/governance列车形成RC后，都按第9节
进入同一版本无关workflow；只有出现新增Release风险、迁移、兼容切换或复杂rollback时，才按第7节增加专项
Discovery/Release hardening gate。历史Phase 9 instances保留原名和时间语义，但不构成未来列车的强制模板。

<a name="product-phase-4"></a>

### 5.1 Phase 4 已采纳 gate 路线

Phase 4 保持 Phase 4.1 冻结的 hybrid owned-boundary 与两个现有 turn-start events，不改变主架构；内部按
风险和故障域拆成八个 gate。完整 programme 顺序为
`F0 → F1A → F1B → F2A → F2B → F3A → F3B → F3C`：

#### 5.1.1 Phase 4 为什么存在：给计划行为授权，不给模型扩权

Phase 4 的一句话目标是：**在 legacy 默认完全不变的前提下，让维护者/用户能对一个 exact plan 显式、可撤销地选择
smart 或 autonomous planning context；状态非法时拒绝，绝不静默降级或误激活。** 它不是让模型申请更高系统权限，
也不是把 Cloud 后台任务、root、联网或本机文件访问包装成产品功能。这里的 `autonomous` 只描述 plan context 的
attestation/nonce/ledger 语义，不表示 Codex 获得更高 OS 权限或开始自动写 workspace。

新人应把四个容易都叫“授权/opt-in”的开关分开：

| 开关 | 它回答的问题 | 不能替代什么 |
|---|---|---|
| 本地 sandbox / approval | 本地 Codex 命令能否越过当前文件、网络或执行边界；边界内例行工作可自动继续 | 不能表示某个 plan 同意启用 smart/autonomous |
| Cloud task / container policy | 这次远程任务能在隔离容器、checkout 与网络策略内做什么 | 不能访问用户未提供的本机文件，也不能自动产生 PWF profile consent |
| system-managed Hook trust | Cloud 是否信任并执行 installer 注册的 absolute adapter | 只回答“Hook 能不能跑”，不回答“对哪个 plan 跑什么 profile” |
| Phase 4 plan-local opt-in | exact plan 是否通过 profile-bound activation-only commit 选择 smart/autonomous | 不授予模型 root、网络、账户身份、workspace writer 或远端写权限 |

OpenAI 官方把本地 sandbox 定义为技术边界、approval 定义为越界时是否停下询问；Cloud 文档则描述远程 container、
checkout、setup/maintenance 与 agent task 流程。二者都是平台执行权限，不是 PWF 行为授权。Cloud 官方也未把 root 身份
承诺为稳定 Host contract，且 container state 可能缓存；因此本项目只依赖显式 Host/config 输入和受控探测，不以“Cloud
默认已经 opt in”或“任务结束立即销毁”为正确性前提。参考 [Sandbox](https://learn.chatgpt.com/docs/sandboxing?surface=app)、
[Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security) 与
[Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment)。

Phase 4 的施工顺序因此不是“逐步给模型加权限”，而是先铺一条不会误激活的供应链和只读 consumer，再加入显式 profile
选择，最后证明该选择在真实 Cloud lifecycle 中可进入、可退出、可回滚：

| Gate | 施工目标（大白话） | 必须保持的边界 | 典型故障归属 |
|---|---|---|---|
| F0 — Development identity preparation | 先开一条明确的 `0.4.0-dev` 施工列车，让后续试验有身份但不冒充已发布功能 | zero-hash bootstrap；不改 runtime、contract 或用户行为 | identity、bootstrap、governance |
| F1A — Contract/source foundation | 先让 manifest、bundle、Release 与 installer 能完整、单一权威地运送未来 runtime | 行为仍为 legacy；contract transaction 必须原子闭合 | contracts、importer、installer、builder |
| F1B — Inactive runtime foundation | 把安全读取、规范化和 v2 协议装好，但 production 只准 legacy，证明“能力存在≠已经启用” | marker 不可达；Host 输出与 v0.3.5 等价 | owned runtime、adapter/runtime protocol |
| F2A — Smart activation | 增加独立 managed commit point；只有显式 armed 才改变 plan 选段 | 未 armed 完全不读旧 `.mode`；不碰 nonce/attestation/ledger/gated | smart selection、state admission、opt-in policy |
| F2B — Autonomous activation | 增加 profile-bound attestation、nonce 与 normalized ledger context；这是上下文语义，不是系统自治扩权 | raw progress 不回退；invalid/incomplete state 只拒绝 | state validation、tamper/refusal、ledger rendering |
| F3A — Lifecycle foundation | 把“先准备并审核、最后单独激活、可单独 disarm”做成 Git-backed repository/runbook 协议 | managed runtime 只读；无 live activation；planning state 不进 ZIP | repository/producer/runbook |
| F3B — Live Cloud lifecycle | 分 B0～B4 证明 exact smart/autonomous commit 在 true Fresh、UserPrompt、real Resume、disarm/re-arm 中确实成立 | runtime/workspace 双身份 exact；cache 不是 authority；不执行 rollback | Cloud lifecycle、takeover |
| F3C — Disarm-first rollback | 证明先提交 disarm 再回滚/重装，不会留下 dormant token 在未来升级后“复活” | live PASS 不等于 Release；禁止 runtime-only rollback | installed state、workspace intent、rollback |


#### 5.1.2 F2 activation/disarm 前置协议

F1A/F1B 可以先规划和实施；F2A/F2B 已把 smart/autonomous 的启用与退出冻结为以下协议：

1. plan-local `.pwf-codex-managed` 的 exact `codex-managed-v1` 内容是独立 activation commit point，也是显式
   opt-in，不是 secret 或身份凭据；
2. smart profile 先在 upstream `.mode` 中准备为 exact `inject-smart`，最后原子写 activation file；删除
   activation file 即退出 managed opt-in，未 armed 时 runtime 不读取旧 `.mode`；
3. autonomous 先由 pristine Skill/用户侧流程建立 nonce、attestation 与所需状态，确认 attestation 成功后，最后写入
   与 autonomous profile 绑定的新 exact token；旧 smart token 不得被 `.mode` 变化静默扩权；
4. token 存在但其他状态不完整或非法时只拒绝，不能按“未启用”降级到 legacy；
5. managed Hook/runtime 继续只读 workspace，上游 writer 不进入 production trusted graph。

这条顺序防止 initializer 吞掉 attestation failure 后留下“看似已激活、实际状态残缺”的 mode。F2A 与 F2B
仍分别授权；完成 F1 不会自动授权任何 opt-in behavior。

这里的“授权”沿用上面的四开关模型：本地 sandbox/approval 与 Cloud task/container policy
是两个执行环境；system-managed requirements 决定 Hook 能否运行；plan-local activation state 才决定 PWF 是否对
exact plan 启用 smart/autonomous。前三个开关不得直接充当或隐式写入第四个，第四个也不能绕过平台执行/trust 边界。

本地 CLI 可通过交互 approval 或用户在独立终端手工执行显式状态变更；Cloud 是后台任务后查看结果/diff、再 follow-up
的工作面，不能假定存在相同的任务中确认框。F2A 只冻结跨端共用的 exact plan-local protocol；Cloud 中 prepare、人工
复核、最后 commit、Fresh/Resume/cache 持久性和 opt-out/re-arm 是否成立，统一留给 F3 live gate。F3 通过前不得宣称
Cloud opt-in 已可用。

当前不采用“生成链接、用户点击即激活”：公开 Host contract 没有提供能把点击原子绑定到 exact user、repository、
commit、plan 与容器内 state 的 consent callback。只有未来出现 authenticated、bounded、可审计的官方 Host ABI 时，
才重新打开独立 Discovery；不得先引入外部认证服务、网络 callback、secret 或 chat-wide environment variable 来模拟。
`.pwf-codex-managed` 始终是可被 runtime 读取的非秘密常量，不能承载用户身份、授权码或账户凭据。

#### 5.1.3 Phase 4 activation/lifecycle 决策

Phase 4没有改变 hybrid owned-boundary、Host event集合或 managed runtime只读 workspace的原则。smart保持
`codex-managed-v1\n`，autonomous使用 profile-bound `codex-managed-v1 autonomous\n`；mode、nonce、attestation与
bounded ledger先准备，activation最后原子写入。runtime每次重新验证 task digest和全部 state，只投影 ledger的
`tick/event`；零 ledger合法，raw `progress.md`不读取，invalid/incomplete/mutated/over-budget状态只拒绝。

真实 lifecycle采用 Git-backed preparation commit加独立 activation-only commit。Fresh task从 activated commit启动；
autonomous armed后若 task bytes变化，必须先 disarm、重新 attestation，再用新的 activation-only commit re-arm。
跨版本恢复必须从 committed disarm开始，走 current-owned uninstall、immutable accepted clean install与 exact-current
forward recovery；只回滚 runtime却保留 activation属于禁止路线。F3B/F3C的具体 Cloud轮次、refs、hash与 PASS证据只在
版本 acceptance和 Phase历史中保存，不在 ROADMAP重建第二份流水账。

## 6. 版本号与晋级语义

项目在 `0.x` 阶段仍主动维持 legacy 默认兼容；SemVer 允许的变化范围不能替代显式 Host ABI、
trusted graph、rollback 和 Cloud 评审。

| 身份 | 含义 |
|---|---|
| `0.x.y-dev` | checkout/source identity；不是 tag 或 Release，bootstrap 必须 fail closed |
| `0.x.0-alpha.N` | contract、inactive implementation 或有限 Cloud 探针；不得宣称 production ready |
| `0.x.0-beta.N` | 目标行为已受控激活，正在完成完整 Cloud、upgrade 与 rollback 验收 |
| `0.x.0-rc.N` | feature/contract/asset boundary 冻结；只接受 Release blocker 修复 |
| `0.x.0` | 最终 ZIP/bootstrap 字节发布并重新下载验收，建立新的 rollback 候选 |
| `0.x.y`（`y>0`） | 同一 minor 行为合同内的兼容修复；不新增 Hook、Host ABI 或 trusted graph |

新增 Hook 类型、Host ABI、信任/激活模型或明显用户行为面，默认提升 minor；纯兼容修复才使用 patch。
任何字节变化都必须使用新身份和新 hash，不得复用已发布资产。

<a name="discovery-gate-governance"></a>

## 7. Discovery 与 gate 晋级模型

本项目采用“先探路、再实施”的动态轮次治理。Discovery 不是固定的 Phase 编号，而是在继续实现可能
导致“实现正确，但架构方向错了”时主动暂停并恢复证据的设计 gate。

### 7.1 Discovery 触发条件

以下情况必须先进入 Discovery：

- **进入新 Product Phase**：第一轮恢复前序证据，扫描当前代码、文档、upstream、Host 与 Cloud 事实，
  复核旧假设、重估轮次并冻结退出条件；原则上不直接切换生产行为。
- **进入关键 gate**：激活、迁移、删除旧生产路径、cutover、schema、Host ABI、trusted graph、Release、
  rollback 或安全边界变化前，必须设置可审查的设计检查点。
- **实施中出现实质偏差**：Cloud 与本地证据冲突、测试推翻设计假设、出现两条以上代价明显不同的
  路线，或 timeout、权限、进程、identity 与数据安全模型变化时，暂停当前实施并重新探路。
- **讨论态尚未形成方案**：维护者提出疑问、例子、假设或“是否还有同类问题”时，默认仍是讨论态；
  只授权只读恢复、扫描和路线比较，不构成实施授权。不得把第一个局部例子直接解释为 patch、迁移或
  删除命令。
- **单点发现可能代表同类问题**：如果一个历史残留、重复 authority 或退役路径可能只是同类问题的
  首个样本，应先做全仓库 inventory，按责任和生命周期分类，比较整体清退、分批迁移与保留方案，并
  冻结恢复路径和停止条件；不能边发现边删除。

从讨论到实施固定经过三种状态：**讨论态**只恢复证据和提出选项；**决策态**冻结范围、不变量、代价、
退出条件并给出 `GO`/`CONDITIONAL_GO`/`NO_GO`；只有进入**实施态**且维护者明确要求按已冻结方案实施，
才允许修改相应文件或状态。这里判断的是语义而不是标点：明确的修复命令可以直接授权已冻结范围，
探索性问句即使没有问号也仍属于讨论态。

触发 Discovery 后，活动 task plan 必须把实施状态标为暂停，并把证据恢复和路线决策设为唯一 Next
Step。结论冻结前，production dispatch、发布哈希和外部部署保持不变；允许的活动仅限获批的只读恢复、
探针、测试/fixture 和设计文档，不得用生产改动代替架构决策。

### 7.2 正式加 Round 与 Round 内子门槛

按变化影响选择治理粒度，而不是为了维持旧轮次数字硬塞风险：

| 变化类型 | 治理动作 |
|---|---|
| 改变架构、契约、Product Phase 范围、信任边界、Release 边界或回滚方式 | 正式增加可独立审查的 Discovery Round |
| 架构不变，只需把已选方案拆成安全的实施、隔离和验证顺序 | 使用当前 Round 内 A/B/C 子门槛 |
| 普通测试补漏、文档同步或已冻结方案内的局部 bug 修复 | 不单独增加探路轮，但仍受当前 task plan、边界测试和停止条件约束 |

关键 gate 不因“仍在同一 Phase”而豁免设计检查；反过来，局部实现拆分也不应虚增 programme Round。

### 7.3 Discovery 最低产物与结论

每次 Discovery 至少冻结：

1. 新证据与旧计划的差异，以及哪些假设仍成立或已失效；
2. 可选路线、各自代价、最终选择和选择理由；
3. 不变量、非目标、实施边界、停止条件与需要维护者决定的事项；
4. 本地测试、Linux/Cloud 验收、失败矩阵与回滚方案；
5. 明确的 `GO`、`CONDITIONAL_GO` 或 `NO_GO` 结论。
6. 若涉及仓库级历史、重复文件或批量清退：完整 inventory、hot/warm/cold 与 exact/lifecycle 分类、
   immutable 恢复证据、保留/迁移/删除集合，以及分批边界和停止条件。

`GO` 只授权进入已冻结的下一 gate；`CONDITIONAL_GO` 必须先满足并核验列明条件；`NO_GO` 停止该路线。
任何结论都不自动授权后续激活、Release、部署或 rollback。若路线选择会改变上述边界，智能体应先提供
证据、选项与代价，再请求维护者授权。

### 7.4 标准晋级链

标准晋级链为：

```text
Discovery
  -> inactive implementation / exact contracts
  -> local + Linux regression
  -> no-live Cloud acceptance
  -> explicit opt-in / canary activation
  -> Fresh + UserPrompt + real Resume + doctor
  -> Release candidate seal
  -> immutable publication
  -> downloaded-asset revalidation
  -> rollback-baseline promotion
```

每个箭头都是独立 gate；前一 gate PASS 不自动授权后一 gate。任一步出现 7.1 的触发条件，都回到
Discovery，按 7.2 决定增加正式 Round 或 Round 内子门槛，再按 7.3 重新冻结结论。

<a name="migration-transaction-lifecycle-governance"></a>

## 8. Migration transaction 与对象生命周期治理

关键迁移可以按照风险、ownership和故障域拆成独立审查、实施、测试和停止点；具体拆分由当前Discovery与活动task plan
针对迁移对象决定，不继承历史Phase的gate名称或数量。任何拆分都不能形成可发布的半成品。只要runtime/schema bytes影响
bundle、manifest或ZIP hash，最终候选必须在同一transaction内让contract、代码、inventory、mode与hash原子闭合；不得发布
只完成一半或无法deterministic build/check的中间状态。

每个迁移 gate都必须在活动 planning维护对象生命周期账，覆盖文件/路径、schema字段、代码常量与分支、producer/consumer、
hash/inventory、测试和 current文档；逐项记录 owner、`KEEP/REPLACE/RETIRE/DEFER`、落地 gate、依赖传播、验证证据、
迁移后状态与再次 review条件。开工前做全仓 inventory，施工按 leaf → contract → manifest → installer/builder → Release
闭合，退出前同时扫描旧符号/旧路径并正向核对新 authority。允许留在 immutable history的命中必须显式分类；无 owner或
未关闭的对象阻断 gate PASS，也不得另建第二份 machine authority保存这张账。

这张账还要在两个不同时间点复核，而不是把原计划直接当作最终事实：

1. **planning → implementation drift review：** 实施闭合后核对实际交付、相对原计划的偏差、对象最终去向、本地证据、
   未授权边界和仍需live验证的停止点。Phase 4.8的
   [post-implementation status](docs/history/phase-4.8-f3b3-autonomous-live-discovery.md#phase-4-8-post-implementation-status-f3b3)
   是这种时间语义的历史实例。
2. **implementation → live / lifecycle drift review：** 只有真实Cloud/live证据形成后，才核对实施假设与实际生命周期、
   恢复/缓存/角色状态的差异，更新最终结论与剩余停止点。Phase 4.8的
   [post-live status](docs/history/phase-4.8-f3b3-autonomous-live-discovery.md#phase-4-8-post-live-status-f3b3)
   展示了这一闭环。

这两个review是迁移账的时间检查点，不机械要求每个Phase都新增两段历史尾注，也不构成额外Discovery Round、Cloud gate或
Release通道。只有偏差本身具有长期解释价值时，才按Phase历史模板追加对应status note；否则把最终事实直接收敛进
`Completed delivery`与`Acceptance conclusion`。

## 9. Release 授权与封板顺序

只有 ROADMAP 把目标版本标为获批 Release candidate，且活动 task plan 明确授权具体 Release gate，
才允许封板。稳定构建/验证命令由 [`README.md`](README.md) 管理，精确版本步骤和资产证据由相应版本
Release operator guide管理；single-Discovery版本可以继续使用`vX.Y.Z-cloud-hard-acceptance.md`简写命名。
[`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md)只提供维护者接手和结果分流入口。
模板、活动Release task plan、operator guide与ROADMAP的详细分工只由
[`Cloud hard acceptance template` 的“文档职责与写入时机”](docs/cloud-hard-acceptance-template.md#acceptance-document-responsibilities)
定义；本节只维护 programme 级授权与封板顺序，不复制逐资产或逐步骤状态。下面两个稳定anchor分别是Release四步/C0～C2
和两轮retirement checkpoint时点的唯一programme authority；四步内部的GitHub Release Latest promotion判断另有精确anchor。
模板、治理指南、具体guide与history只能引用并保存职责内投影。

<a name="release-four-step-flow"></a>

### 9.1 大白话 Release 四步

以后每个版本按四个大步骤走；前一步通过只允许进入下一步，不自动把后面的角色一起改掉：

| 步骤 | 大白话 | 必须证明 | 主要证据 |
|---|---|---|---|
| 1. 候选验证 | 先在源码和本地候选 ZIP 上测；除本地回归外，还要在 Cloud 的选定 branch/commit checkout 跑通 Source/Candidate | “这份代码可以发布”，但还没有真实公开包 | 活动task plan；完成后写同一Release operator guide的Source/Candidate channel checkpoint |
| 2. 发布 Pre-release | 创建新的 immutable tag 和对应 Pre-release，上传最终 ZIP 与 ZIP 外 bootstrap | “真实公开包已经存在”，tag/URL/size/SHA 已冻结 | provenance + publication audit；不得删 tag 或重传同名资产来修补 |
| 3. 公开包验收 | 用另一套 Fresh Cloud 从公开 bootstrap 默认下载链安装，再重新下载公开 ZIP 做 Resume/doctor/deep check | “用户实际下载到的公开包也能工作” | 同一Release operator guide的Published Release证据；声明范围闭合后写final Post-run |
| 4. 晋级 Latest | 前三步全绿后，维护者在GitHub Release编辑页面把同一个Release取消Pre-release并设为Latest；保存后返回或刷新GitHub Release详情页，确认exact版本显示为Latest且不再是Pre-release，就是正常路径的GitHub Release Latest promotion confirmation | “现在正式推荐这个版本”，并允许进入accepted/fallback角色轮转 | ROADMAP；tag、Release和资产都原地保留，不删除重建；正常成功不再单列独立postflight |

对应的Git身份与证据写回按C0→C1→C2前进；分支HEAD可以前进，但正式tag目标始终保持C0。C0前只做非破坏性
candidate admission preflight；两轮真实退役分别在对应验收PASS后执行：

```text
形成候选基线
  → candidate admission preflight
     （只读inventory、分类和风险检查，不删除）

C0：候选源码 commit（SOURCE_CANDIDATE_HEAD）
  → Source/Candidate Cloud PASS
  → source-candidate closeout retirement checkpoint
     （planning删除仍需维护者明确决定）

C1：第一阶段状态commit（SOURCE_CANDIDATE_CHECKPOINT_HEAD）
  → 本地回补第一阶段PASS、channel checkpoint与第一退役检查证据
  → 维护者push治理分支
  → 正式验收tag精确指向C0
  → 维护者创建immutable Pre-release并上传已验收ZIP/bootstrap
  → 独立Published Release Cloud PASS
  → 维护者完成GitHub Release Latest promotion confirmation
  → role-window closeout retirement checkpoint

C2：最终治理commit（PUBLISHED_RELEASE_CLOSEOUT_HEAD）
  → 回补Published Release、GitHub Release Latest promotion confirmation与第二轮退役检查证据
  → 追加final Post-run并同步programme角色
```

正式tag必须精确指向Source/Candidate实际Cloud PASS的commit，即`SOURCE_CANDIDATE_HEAD`；
`SOURCE_CANDIDATE_CHECKPOINT_HEAD`在publication前记录第一通道与第一轮真实退役证据并推进治理分支；维护者随后把tag显式固定到C0，不能让
分支新HEAD取代tag目标。`PUBLISHED_RELEASE_CLOSEOUT_HEAD`只在公开包、GitHub Release Latest promotion confirmation和退出检查点全部闭合后形成。
C1/C2都不能取代C0，也不是额外Cloud通道。

第1、3步是两次独立Cloud验收执行；第2、4步是维护者控制面状态变更与核验，不是另外两轮黑盒。三个治理维度如下：

| 维度 | 计数与必要性 | 不得冒充 |
|---|---|---|
| Product验收 | 每个新增risk/behavior claim的正式Discovery Round一轮相称验收 | gate/task/stage数量或Release通道数量 |
| Release验收 | 真正发布时固定保留Source/Candidate与Published Release两个独立身份/环境通道 | 两个Product Discovery Round或两份guide |
| retirement review | candidate closeout与accepted role rotation两个对象治理时点 | Cloud acceptance、黑盒PASS或删除配额 |

<a name="github-release-latest-promotion-confirmation"></a>

对应关系也保持简单：provenance回答“发布了什么字节”，Release operator guide回答“候选与公开包是否验收”，ROADMAP
回答“现在推荐谁”。Latest promotion只改Release metadata与lifecycle指针，不重新上传包。Published Release已经冻结并验收
exact tag/source/ZIP/bootstrap；因此维护者在GitHub Release编辑页面保存“取消Pre-release并设为Latest”后，返回或刷新
GitHub Release详情页并看到exact版本显示为Latest且不再是Pre-release时，就完成正常路径的GitHub Release Latest promotion
confirmation，不再重复下载资产、重算SHA或另设只读postflight。这里的成功不是Codex Cloud、GitHub Actions、资产上传页或
任意窗口“未报错”，而是GitHub Release详情页呈现了目标metadata。这样避免用第二套检查重复证明第3步已经证明的immutable identity。

该精简不取消fail-closed：如果GitHub Release编辑页面的保存结果未知、Release详情页仍显示Pre-release、Latest指向错误版本，
或维护者观察到tag/资产被改写，
必须停止角色轮转和C2，改做有界只读诊断；不得盲目重复promotion、移动tag或重传资产。只有成功状态明确时，才按retirement DoD
治理退出candidate+accepted窗口的本地版本文件与旧oracle。

若某次Product/Discovery验收已经绑定final exact source，且随后所有Release输入保持不变，其证据可以直接承担第1步，
不机械重跑Source/Candidate；任何相关输入变化都使复用失效。第3步不能提前复用，因为公开URL、bootstrap与资产身份
只有第2步完成后才存在。

<a name="version-train-two-retirement-reviews"></a>

### 9.2 两个嵌入式 retirement checkpoint

默认情况下，一个Product Phase完成目标并形成对应版本的功能/候选基线；ROADMAP批准该版本为Release candidate、活动task plan
授权具体Release gate后，列车直接进入版本无关的Release closeout workflow。普通Release不需要另建standing Phase 9，也不从
历史P9-A～F复制六轮施工。例如：

```text
Phase 4 / F3C4完成
  → 形成0.4.0功能/候选基线
  → candidate admission preflight（只读inventory、分类和风险检查）
  → C0 / Source-Candidate候选源码
  → Source/Candidate Cloud PASS
  → source-candidate closeout retirement checkpoint（第一轮真实退役检查）
  → C1 / 第一阶段状态写回
  → tag精确指向C0并完成immutable publication
  → Published Release Cloud PASS
  → GitHub Release Latest promotion confirmation
  → role-window closeout retirement checkpoint（第二轮版本窗口退役审查）
  → C2 / final evidence与programme closeout
  → 后继版本列车与Product Phase另行决策
```

每条发布列车都必须经过两轮 retirement review；retirement review不是Cloud acceptance，也不因逐项审查就产生新的
Operator Guide或黑盒轮次。“review”是逐项做`RETIRE/MIGRATE/KEEP`决定，不是为了清单好看而强制删除：

在C0前还必须有一次非破坏性`candidate admission preflight`，只读盘点未来可能退役的对象、恢复证据和风险，不删除planning、
恢复材料或回滚线索。这样Source/Candidate失败时，planning、恢复材料和回滚线索仍完整，不会因为提前清退增加排错与回滚难度。

涉及`.planning/`时，两轮真实检查点先列出exact scope、恢复证据与建议去向，再提醒维护者按
[仓库治理指南的Planning生命周期](docs/repository-governance-guide.md#planning-lifecycle)明确决定是否移除。
仅仅到达C0/C2、切换`.active_plan`、满足retirement DoD或已有Git恢复点，都不得自动删除planning；维护者尚未明确决定的
scope继续`KEEP`。大白话：检查点负责把“哪些可以退、为什么可以退”摆到桌面上，真正删不删仍由维护者拍板。

| Review | 触发点 | 主要对象 | 退出要求 |
|---|---|---|---|
| 第一轮：source-candidate closeout | Source/Candidate Cloud实际PASS之后、C1写回之前 | 施工 planning、临时 fixture/脚本、重复摘要、过渡 seam、validation refs与当期 lifecycle账 | 只对Release-excluded对象提出RETIRE/MIGRATE/KEEP；planning删除由维护者明确决定；C1保存已经实际形成的结论 |
| 第二轮：role-window closeout | 同一列车的public assets验收与GitHub Release Latest promotion confirmation之后 | candidate/accepted窗口专用 refs、oracles、compatibility transition、canary和版本化运维材料 | 新 accepted与 immediate fallback可恢复；退出角色窗口的对象按 retirement DoD清退或迁移；稳定 contracts/tests/history不得机械删除 |

Product Phase收官已经是正式生命周期边界，但只形成候选功能基线，不会自动产生immutable public assets或轮转accepted角色。
其closeout结论可以输入candidate admission preflight，但第一轮真实review必须等待Source/Candidate PASS。若PASS后的拟退役动作会改变
package、contract、runtime、bootstrap、ZIP allowlist或其他C0 Release输入，必须fail closed：不得沿用原PASS，必须形成新C0并
重新运行Source/Candidate。只有Release-excluded planning、临时教程和脚手架适合在第一轮提出清退，且planning删除仍需维护者明确决定。
第二轮review是Release workflow的退出条件，只处理必须等公开身份、Latest confirmation和版本角色确定后才能判断的对象，且不得改写sealed
tag、ZIP、bootstrap、URL或SHA。

不进入独立Product Phase的小型patch/governance列车仍要在candidate baseline closeout完成等价第一轮审查，但不因此虚构Product
Phase、Discovery Round或Cloud验收。若维护者明确批准多个低风险 Phase合并到同一版本列车，每个 Phase仍分别做第一轮审查，
而该列车只在最终发布时做一次第二轮审查。

<a name="pre-1-compatibility-admission"></a>

### 9.3 Pre-1.0 compatibility 与历史债准入

本仓库目前仍是 `1.0.0` 前的内部验证线，但“pre-1.0”本身不能代替明确的支持合同。默认支持面只包括
clean install，以及当前 installer、machine contracts 和行为测试明确覆盖的 managed install/doctor/repair/
uninstall 状态与转换；不默认承诺从任意早期原型、未知 manifest/runtime、无 ownership marker 的 Hook/TOML、
被现场修改的 global Skill 或其他未分类 shared state 直接就地升级。

必须区分两类责任：

- **历史可恢复性**：已发布 tag、source、ZIP/bootstrap、SHA、acceptance 与 accepted + immediate fallback
  oracle 必须保持可审计和可恢复；
- **installed-state 升级兼容性**：只有当前 contract 和端到端迁移证据明确列入的来源状态才受支持。

前者不自动产生后者。accepted + immediate fallback 是 publication/rollback 资产席位，不是跨版本 installer
migration contract。遇到来源、ownership 或字节身份无法证明的旧状态时，installer/repair 必须 fail closed；
维护者应先保存诊断和备份，按明确卸载/清理流程回到 clean install，而不能猜测迁移、吸收 unknown drift
或让新旧 handler 并存。

文档路径与anchor在`0.x`阶段同样不会自动成为永久兼容合同。current文档之间的链接必须只使用仍在位的canonical
path与显式anchor，并在改名或清退时完成入链inventory和删除后复扫；没有current入链的旧alias可以直接退休，不为了
假设中的外部书签继续留redirect。旧版本的原始路径和anchor由immutable commit/tag保留。只有进入`1.0.0`稳定线并明确
冻结public documentation surface后，才把获批的公共路径/anchor及其redirect策略作为长期兼容面治理。

任何例外兼容都必须先进入独立 Discovery/compatibility gate，至少冻结：精确来源版本/状态窗口、owner、
migration contract、fail-closed 边界、端到端升级与回滚测试、Linux/Cloud 验收，以及 sunset/retirement
condition。条件未闭合的 compatibility code 不得因为“以后也许需要”进入 Release；删除已支持路径同样必须
经过 retirement inventory，不能借本政策绕过现有用户状态和已发布资产证据。

Release 验证必须先按 checkout 前置条件分流，不能把所有测试机械塞进每个环境：

| 通道 | 可依赖的 checkout 事实 | 应执行的验证 | 不得冒充的结论 |
|---|---|---|---|
| Source/Candidate | Cloud 可能只有所选 branch/commit 的 tagless checkout，没有 remote、本地 tag 或完整 ref topology | tagless 可执行的 portable Linux suite、当前源码双构建/check、精确候选 ZIP hash、本地 override 安装与黑盒 | 不证明 immutable tag 或公开 Release 资产成立 |
| Publication audit | 维护者控制、具备目标 tag 与所需历史 objects 的 ref-aware checkout | 完整 `npm test`，包括 publication-only immutable tag/source/asset oracle；seal 与 publication 前后对应专项复核 | 不替代公开 URL 下载或 live Cloud 黑盒 |
| Published Release | workspace Git refs 不是资产身份；身份来自 immutable Release URL、filename、size 与 SHA | 从公开 URL 校验 bootstrap，让它使用默认 URL/SHA 下载 ZIP，再在 Fresh Cloud 完整跑黑盒 | 不得用分支内同名脚本、本地 ZIP 或 Source/Candidate PASS 代替 |

测试命令进入 runbook 前必须列明 prerequisites。tagless checkout 缺少 remote/tag 本身不是产品失败；
依赖它们的 publication-only oracle 必须分流到 Publication audit，不能在 Source/Candidate 中因环境缺失
误报产品红灯。尤其不得为了让测试变绿而在 Cloud 创建 tag、补造 remote 或用 runbook 常量伪造前置条件。
若某通道只运行 portable 子集，输出必须显式列出排除的 suite；它的 PASS 只能证明该通道，不得宣称
“完整 suite PASS”。完整 suite 仍是封板和 publication 审计的强制门槛，公开 URL、SHA 与 bootstrap
默认下载链仍是 Published Release 通道的独立门槛。

Published Release 的 bootstrap 可以使用临时目录并在 setup 结束后正常清理；后续 post-install 深度复验
不得假设该目录或其中的维护工具继续存在，而应从同一 immutable URL 重新下载并校验 ZIP。复验必须使用
ZIP 内经过 checksum/boundary 核验的 `install.js` 执行 doctor，并用同源 builder/importer、Python
inventory/policy 断言和 snapshot residue 检查闭环；不得回退到 workspace 中的同名工具，否则公开资产
通道会重新依赖可移动 source checkout。可复用 setup 只接受 immutable bootstrap URL + bootstrap
SHA-256，由已校验 bootstrap 内嵌 ZIP URL/SHA；post-resume 复验只接受 immutable ZIP URL + ZIP SHA-256，
version、size、entry/runtime inventory 从已校验 ZIP 的 package/contracts 派生。黑盒提示词只冻结 lifecycle
与 observable behavior，不嵌入产品版本、验收状态或无行为意义的阶段 marker。

固定字节顺序：

1. 冻结目标 version、source、contracts、tests 和 ZIP 精确 allowlist；
2. build/check ZIP，并用独立双构建证明确定性；
3. 计算最终 ZIP SHA-256；
4. 把版本、包名和 ZIP SHA 写入 ZIP 外部 bootstrap；
5. 计算封板后 bootstrap SHA-256；
6. 创建新的 immutable tag/pre-release 或 Release，上传两个独立资产；
7. 从 Release 页面重新下载两个资产并核对 filename、size、SHA 和 ZIP boundary；
8. 在全新 Cloud 完成 install、Fresh/UserPrompt、real Resume、doctor 与 rollback 冒烟；
9. 冻结 acceptance 证据，才可把该版本提升为新的 rollback baseline。

RC/canary 通过不能替代最终字节验收。ZIP 或 bootstrap 任一字节重建，都必须产生新身份、新 hash 和
新的 downloaded-asset/Fresh Cloud 证据。bootstrap 永远是 ZIP 外部资产，禁止 moving branch、
`latest` 或无 checksum URL。

## 10. rollback 原则

当前角色只在第 2 节维护。未来版本只有在 immutable publication、重新下载、Fresh/Resume/doctor 和
rollback 验证全部通过后，才能更新该表并成为新的基线。旧资产、tag、SHA、acceptance 和迁移 evidence
refs 不得重写；pointer-only promotion 也不能反向修改 sealed ZIP 输入。

## 11. 长期路线

当前唯一正式集成仍是 PWF v3.8.2。第二个只读插件尚未证明 Host/runner/Driver 抽象，因此不得把项目
描述为通用 Skill 转换器，也不预先为泛化能力分配版本号。只有独立 Discovery 和第二实现证据完成后，
才能决定抽象是否进入新的 Product Phase 或 `1.0.0` 稳定合同。
