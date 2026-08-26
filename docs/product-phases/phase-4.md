<a name="product-phase-4-overview"></a>

# Product Phase 4 Overview

> Authority role: `PRODUCT_PHASE_OVERVIEW`
> Version series: `0.4.0-*` through the current Product Phase 4 patch/governance trains
> Current programme and train pointer: [`ROADMAP`](../../ROADMAP.md)

## Long-term position

Phase 4在不改变legacy默认行为的前提下，为exact plan建立显式、可撤销的smart/autonomous planning context授权，并把
prepare、activation、live lifecycle与disarm-first rollback连成可审查、可恢复的Product路线。它没有给模型增加OS、Cloud、
网络、账户或workspace写权限，也没有扩大system-managed Hook trust。大白话：这是给计划行为授权，不给模型扩权。

本文件只保存Phase 4跨版本仍有效的Product目标、已采纳路线、稳定边界与closeout结论。当前开发列车与版本角色看ROADMAP，
逐轮探路看[`Phase历史过程账本`](../history/README.md)，逐版本变化看[`CHANGELOG`](../../CHANGELOG.md)，exact发布身份与验收看
[`BASELINE_PROVENANCE`](../../BASELINE_PROVENANCE.md)和对应acceptance。

## Why this Phase existed

Phase 4的一句话目标是：**在legacy默认完全不变的前提下，让维护者/用户能对一个exact plan显式、可撤销地选择smart或
autonomous planning context；状态非法时拒绝，绝不静默降级或误激活。** 这里的`autonomous`只描述plan context的
attestation/nonce/ledger语义，不表示Codex获得更高系统权限或开始自动写workspace。

新人应把四个容易都叫“授权/opt-in”的开关分开：

| 开关 | 它回答的问题 | 不能替代什么 |
|---|---|---|
| 本地 sandbox / approval | 本地Codex命令能否越过当前文件、网络或执行边界；边界内例行工作可自动继续 | 不能表示某个plan同意启用smart/autonomous |
| Cloud task / container policy | 本次远程任务能在隔离容器、checkout与网络策略内做什么 | 不能访问用户未提供的本机文件，也不能自动产生PWF profile consent |
| system-managed Hook trust | Cloud是否信任并执行installer注册的absolute adapter | 只回答“Hook能不能跑”，不回答“对哪个plan跑什么profile” |
| Phase 4 plan-local opt-in | exact plan是否通过profile-bound activation-only commit选择smart/autonomous | 不授予模型root、网络、账户身份、workspace writer或远端写权限 |

本项目只依赖显式Host/config输入和受控探测，不以“Cloud默认已经opt in”、固定root身份或“任务结束立即销毁”为正确性前提。
相关平台边界见OpenAI的[Sandbox](https://learn.chatgpt.com/docs/sandboxing?surface=app)、
[Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security)与
[Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment)。

## Adopted route and stable boundaries

Phase 4保持Phase 4.1冻结的hybrid owned-boundary与两个turn-start events，不改变主架构；最终programme顺序为
`F0 → F1A → F1B → F2A → F2B → F3A → F3B → F3C`：

| Gate | 施工目标（大白话） | 必须保持的边界 | 典型故障归属 |
|---|---|---|---|
| F0 — Development identity preparation | 先开明确的`0.4.0-dev`施工列车，让试验有身份但不冒充已发布功能 | zero-hash bootstrap；不改runtime、contract或用户行为 | identity、bootstrap、governance |
| F1A — Contract/source foundation | 让manifest、bundle、Release与installer能完整、单一权威地运送未来runtime | 行为仍为legacy；contract transaction必须原子闭合 | contracts、importer、installer、builder |
| F1B — Inactive runtime foundation | 装入安全读取、规范化和v2协议，但production只准legacy，证明“能力存在≠已经启用” | marker不可达；Host输出与旧基线等价 | owned runtime、adapter/runtime protocol |
| F2A — Smart activation | 增加独立managed commit point；只有显式armed才改变plan选段 | 未armed完全不读旧`.mode`；不碰nonce/attestation/ledger/gated | smart selection、state admission、opt-in policy |
| F2B — Autonomous activation | 增加profile-bound attestation、nonce与normalized ledger context | raw progress不回退；invalid/incomplete state只拒绝 | state validation、tamper/refusal、ledger rendering |
| F3A — Lifecycle foundation | 把“先准备并审核、最后单独激活、可单独disarm”做成Git-backed协议 | managed runtime只读；无live activation；planning state不进ZIP | repository/producer/runbook |
| F3B — Live Cloud lifecycle | 证明exact smart/autonomous commit在Fresh、UserPrompt、real Resume与disarm/re-arm中成立 | runtime/workspace双身份exact；cache不是authority；不执行rollback | Cloud lifecycle、takeover |
| F3C — Disarm-first rollback | 证明先提交disarm再回滚/重装，不会留下未来升级后复活的dormant token | live PASS不等于Release；禁止runtime-only rollback | installed state、workspace intent、rollback |

这条路线不是逐步给模型增加权限，而是先建立不会误激活的供应链和只读consumer，再加入显式profile选择，最后证明该选择
在真实Cloud lifecycle中可进入、可退出、可回滚。

## Activation and lifecycle protocol

F2A/F2B把smart/autonomous启用与退出冻结为以下长期协议：

1. plan-local`.pwf-codex-managed`的exact`codex-managed-v1`内容是独立activation commit point，也是显式opt-in，
   不是secret或身份凭据；
2. smart profile先在upstream`.mode`中准备为exact`inject-smart`，最后原子写activation file；删除activation file即退出
   managed opt-in，未armed时runtime不读取旧`.mode`；
3. autonomous先由pristine Skill/用户侧流程建立nonce、attestation与所需状态，确认attestation成功后，最后写入与
   autonomous profile绑定的新exact token；旧smart token不得被`.mode`变化静默扩权；
4. token存在但其他状态不完整或非法时只拒绝，不能按“未启用”降级到legacy；
5. managed Hook/runtime继续只读workspace，上游writer不进入production trusted graph。

smart保持`codex-managed-v1\n`，autonomous使用profile-bound`codex-managed-v1 autonomous\n`；mode、nonce、attestation与
bounded ledger先准备，activation最后原子写入。runtime每次重新验证task digest和全部state，只投影ledger的`tick/event`；
零ledger合法，raw`progress.md`不读取，invalid/incomplete/mutated/over-budget状态只拒绝。

真实lifecycle采用Git-backed preparation commit加独立activation-only commit。Fresh task从activated commit启动；autonomous
armed后若task bytes变化，必须先disarm、重新attestation，再用新的activation-only commit re-arm。跨版本恢复必须从committed
disarm开始，走current-owned uninstall、immutable accepted clean install与exact-current forward recovery；只回滚runtime却保留
activation属于禁止路线。

本地CLI可以通过交互approval或维护者独立终端执行显式状态变更；Cloud是后台任务后查看结果/diff、再follow-up的工作面，
不能假定存在相同的任务中确认框。当前也不采用“生成链接、用户点击即激活”：公开Host contract没有提供能把点击原子绑定到
exact user、repository、commit、plan与容器state的consent callback；未来只有出现authenticated、bounded、可审计的官方Host ABI
时才重新Discovery。

## Version-train mapping and governance closeout

Phase 4的Product能力由`0.4.0-*`功能/迁移列车形成，后续`v0.4.1`path-safety patch与`v0.4.2`、`v0.4.3`文档治理
继续归属同一Product baseline；patch/governance列车不因版本号变化自动创建新Product Phase。具体版本delta只见CHANGELOG。

<a name="v0-4-2-release-closeout"></a>

### v0.4.2 documentation governance与Release closeout

`v0.4.2`整理Release/retirement、Phase history、acceptance、环境记忆与文档authority，在不修改production、runtime、Host ABI、
trusted graph、managed events或Release allowlist的前提下发布。C2完成后`v0.4.2`成为accepted，`v0.4.1`成为immediate fallback，
`v0.4.0`进入deeper fallback证据链。

该列车没有创建standing Phase 9。candidate admission preflight、Source/Candidate、第一轮retirement checkpoint、tag(C0)、
immutable publication、Published Release Cloud、GitHub Release Latest promotion confirmation、第二轮role-window closeout与C2均已闭合。
逐步骤和exact证据只见[immutable `v0.4.2 acceptance`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/33deb5870015c94df329fe233e306363ba43232b/docs/acceptance/v0.4.2-cloud-hard-acceptance.md#v0-4-2-role-window-closeout)。

长期治理交付包括：

- 根[`README`](../../README.md)形成新人可复制的candidate build/check/hash、正式资产命名与bootstrap两字段seal说明；README是
  Release ZIP输入，变更会使旧候选身份失效。
- 维护机限制提升到[`维护执行环境限制与对策档案`](../maintenance-environment-profile.md#maintenance-environment-profile)，保存带日期的
  事实状态、影响、默认本地/Cloud解法与重验触发器。
- 文档拓扑把全局入口、专项authority和Release输入拆开治理；退出current窗口的版本guide由
  [exact immutable ref](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/33deb5870015c94df329fe233e306363ba43232b/docs/acceptance/v0.4.2-cloud-hard-acceptance.md#v0-4-2-role-window-closeout)恢复，稳定templates继续`KEEP`。
- Source/Candidate暴露的C步骤工具能力缺口被稳定template收敛为：优先独立只读文件工具；缺少该能力时允许exact-path只读Shell
  preflight，正文仍只能用apply_patch写入。
- sealed bootstrap与22-entry ZIP通过Published Release Fresh/Resume/9.2默认下载链验收；GitHub Release详情页确认Latest后，
  正常路径按[`Latest promotion confirmation`](../../ROADMAP.md#github-release-latest-promotion-confirmation)闭合。
- 第二轮退役清理退出角色窗口的旧planning、current guide/bootstrap，并把publication oracle收敛为动态accepted/fallback角色。
- Phase history最终区分回补型`RETROSPECTIVE_CAPSULE`与正式Round关闭后冻结的`FROZEN_DISCOVERY_RECORD`。
- post-v0.4.2 residue Batch A/B清退不可达候选/P9断言与无入链兼容anchors，同时保留真实acceptance/history、immutable P9-F、
  predecessor contract和publication/fallback oracles；这些路径与22-entry Release allowlist交集为零。

<a name="v0-4-3-release-asset-governance"></a>

### v0.4.3 Release资产物化与验收边界

`v0.4.3`在已闭合的Phase 4 Product baseline上，把Release资产准备从手工复制/替换收敛为确定性物化，并补齐
Source/Candidate bootstrap选择与双通道验收的新人边界。它没有重新打开Phase 4、激活Phase 5或改变Product/runtime行为；
exact C0、双通道Cloud、immutable publication、GitHub Latest、第二轮role-window closeout与C2现已全部闭合，`v0.4.3`成为
programme accepted，`v0.4.2`成为immediate fallback。逐资产与运行证据只读
[`v0.4.3 acceptance`](../acceptance/v0.4.3-cloud-hard-acceptance.md#v0-4-3-role-window-closeout)。

后继同系列列车必须继承以下长期边界：

- bootstrap完整正文只由canonical `.bash.in`模板维护；薄materializer编排candidate render/check与正式双资产生成，
  `tools/build_release.py`继续只负责contract-driven ZIP。模板与materializer是source-only维护输入，不进入Release ZIP。
- 本地预检`candidate.zip`、根tracked zero-hash candidate bootstrap与ignored `dist/`正式versioned ZIP/exact-hash bootstrap
  是三个不同生命周期对象；正式生成器不读取或重命名旧`candidate.zip`。
- Source/Candidate按当前checkout的manifest→Release contract→唯一external asset选择bootstrap，不扫描目录、比较SemVer或
  根据GitHub Latest猜版本。`HOOKS_URL`/`HOOKS_SHA256`可以覆盖zero或non-zero默认值，但4.1不override `HOOKS_VERSION`；
  package、contract、内嵌version与canonical zero-hash一致性共同决定candidate资格。
- Source/Candidate证明当前C0源码、contract指定bootstrap与当前源码构建ZIP能共同工作；Published Release不带本地override，
  证明正式bootstrap默认GitHub URL、内嵌exact SHA与公开ZIP。两个通道不能互相替代。
- 根[`README`](../../README.md)是当前构建/物化命令入口并属于Release ZIP输入；稳定双通道协议只读
  [`Cloud hard acceptance template`](../cloud-hard-acceptance-template.md#cloud-hard-acceptance-template)。任一README、template、
  materializer、contract或其他Release输入在Source/Candidate PASS后变化，都必须形成新C0并重新运行第一通道。

## Closeout and successor inheritance

Phase 4的长期Product baseline已经闭合。后继Phase必须继续保持：legacy默认、plan-local exact opt-in、activation-last、
disarm-first rollback、managed runtime只读workspace、trusted source exact与未知状态fail closed。新增Host events、写入式completion gate、
hard gating或其他权限/状态面必须按ROADMAP重新Discovery，不能从Phase 4的`smart`/`autonomous`名称推断授权。

同系列patch/governance列车可以修正安全或文档authority，但不得把未授权Product行为塞入既有Phase。Product Phase overview的
current pointer与轮转只按[`ROADMAP规则`](../../ROADMAP.md#product-phase-overview-rotation)执行。

## Evidence map

- Current programme、version roles与未来路线：[`ROADMAP`](../../ROADMAP.md)
- 逐版本delta：[`CHANGELOG`](../../CHANGELOG.md)
- 历史Discovery与closeout过程：[`Phase history`](../history/README.md)
- 已发布身份和迁移来源：[`BASELINE_PROVENANCE`](../../BASELINE_PROVENANCE.md)
- Phase 4最终已接受公开包证据：[`v0.4.3 Cloud hard acceptance`](../acceptance/v0.4.3-cloud-hard-acceptance.md#v0-4-3-role-window-closeout)
