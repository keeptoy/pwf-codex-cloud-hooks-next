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
| 当前开发列车 | `v0.3.5` accepted baseline；本地 `0.4.0-dev` 已完成 Phase 4 Discovery 与路线校准，下一步细化 F1A～F3 实施计划，尚无 successor package/machine identity |
| 当前已接受版本 | `v0.3.5`；production rollback 与 GitHub `Latest` |
| 当前直接回退版本 | immutable `v0.3.4` immediate fallback |
| 回退证据链 | immutable `v0.3.3` deeper fallback；更早发布里程碑见 provenance museum |
| 当前 programme 边界 | Product Phase 4 Discovery 已完成并 `CONDITIONAL_GO_TO_F1`；F1A～F3 路线已采纳，implementation/activation 未授权 |
| 长期支持范围 | 只正式支持 `OthmanAdi/planning-with-files v3.8.2` |

`v0.3.5` 已完成 immutable publication、公开下载/安装验收与 pointer-only promotion；只读 postflight 确认它为
非 prerelease 的 Latest，v0.3.5/v0.3.4 tag、source、ZIP/bootstrap、URL、size 与 digest 均未改写。版本 delta 见
[`CHANGELOG.md`](CHANGELOG.md)，精确 source/资产/SHA 见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，
最终 Cloud 与晋级证据见 [`docs/v0.3.5-cloud-hard-acceptance.md`](docs/v0.3.5-cloud-hard-acceptance.md)。

## 3. 已完成的基线 `v0.3.5`

`v0.3.5` 是 Product Phase 4 前当前已接受的兼容与仓库治理基线。它继承 v0.3.4 的全部供应链和运行时安全
边界，没有新增 Hook、Host ABI、trusted graph、installed inventory 或安装行为，并在同一 `0.3` 行为合同内
完成以下收口：

| 问题域 | 已完成结果 |
|---|---|
| inherited security baseline | 保留 v0.3.4 的 bundle authority、Managed ownership/locking、immutable transcript bytes、bounded Host input、固定 PWF archive 与无远程 root Node tooling 等边界 |
| documentation authority | README、ARCHITECTURE、DESIGN、CHANGELOG、ROADMAP、active planning 与 provenance/acceptance 各自只有一个职责权威 |
| repository lifecycle | trusted/Release zones 继续 exact；planning/docs 按生命周期治理；当前树保持一个 active planning，并以机器可解析角色窗口控制版本文件 |
| compatibility cleanup | notice 恢复四文件 pristine 事实；删除标题元测试并收缩 prose/order locks，保留 exact inventory、forbidden zones 与 direct behavior guards |
| Release test maintenance | 通用 candidate/package 测试从 machine identity 派生版本、bootstrap 与 entry count，不再复制单版本常量 |
| retained authorities | runtime bundle、manifest integrity、installed snapshot、Release allowlist、Host ABI、trusted graph 与 production dispatch 均保持 v0.3.4 语义 |
| Release maintenance | 21-entry ZIP、外部 bootstrap、Source/Candidate 与 Published Release 两条 Cloud 通道、公开下载和 pointer-only promotion 全部 PASS |

该基线已完成 immutable publication、公开下载字节复核、Fresh/Resume/doctor 双通道 Cloud 验收和显式
baseline promotion；当前 lifecycle 角色只见第 2 节。实际版本 delta 见 [`CHANGELOG.md`](CHANGELOG.md)，
精确 source/资产身份与 predecessor 迁移链见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，完整
阶段与晋级证据见 [`docs/v0.3.5-cloud-hard-acceptance.md`](docs/v0.3.5-cloud-hard-acceptance.md)。

## 4. 当前开发列车与 Product Phase 路线

`v0.3.5` 的 zero-hash Source/Candidate Cloud 已 PASS，Published Release Cloud hard acceptance 已 PASS，
publication 与 Latest postflight 也已闭合。C2 已把 bundle tombstone、通用 exact schema、字段生命周期、Release
entry mode、兼容/rollback 与 placement 收敛为 `CONDITIONAL_GO` 输入；本地 `0.4.0-dev` 上的 Phase 4 Discovery
已联合复核 attestation、nonce、opt-in v3 modes、source admission 与 contract foundation shape，并冻结为
F1 conditional go。后续路线校准已把它细分为 F1A、F1B、F2A、F2B 与 F3；这是 programme 顺序，不是
implementation authorization。

Phase 4 Discovery 已完成并冻结为 `CONDITIONAL_GO_TO_F1_INACTIVE_FOUNDATION`；当前只授权把已采纳路线翻译为
分步实施计划、依赖、测试矩阵和退出条件。没有 contract-v2 implementation、行为激活、Release identity 或
`0.4.0-*` package/machine identity 授权。本地分支名不建立这些身份或实现 gate。精确 Next Step 和停止条件只见
活动 task plan；已完成 v0.3.5 基线与 rollback 证据仍见第 3 节及 provenance/acceptance。

仓库生命周期治理通常保持一个 active planning，并以 candidate + accepted role window 控制当前
bootstrap/acceptance；当前 candidate 与 accepted 都是 v0.3.5，因此窗口收敛为单一 v0.3.5 文件。v0.3.4
immediate fallback 与 v0.3.3 deeper fallback 均由 immutable commit、tag、Release、exact acceptance 与
publication oracle 恢复；更早历史只留在精选 provenance。
trusted/Release zones 继续 exact，docs/planning zones 按 lifecycle policy 验证。

下表是未来 Discovery 的候选，不是发布承诺，也不自动授权下一 Phase。一个 Phase 可以有多个
pre-release；多个低风险 Phase 也只有在独立评审后才能进入同一版本列车。

| Phase | 候选版本列车 | 候选范围 | 最低退出/Cloud 门槛 | 状态 |
|---|---|---|---|---|
| 4 | `0.4.0-*` | owned v3 state foundation；显式 smart/autonomous opt-in | F1A/F1B inactive foundation → F2A smart → F2B autonomous → F3 Fresh/Resume/rollback Cloud；legacy 默认不变 | Discovery/路线校准 complete；分步 planning next；implementation 未授权 |
| 5 | `0.5.0-*` | compaction lifecycle | 复核真实 Cloud payload；先证明现有 `SessionStart source=clear\|compact` 是否足够，只有真实 context/时序缺口才新增 Hook | pending |
| 6 | `0.6.0-*` | optional selective tool/permission hooks | PreToolUse、PostToolUse、PermissionRequest 各自独立 gate；必须有 use case、latency/token budget 与 Cloud 证据 | pending / optional；允许逐项或整体 `NO_GO`；不是 Phase 7 前置 |
| 7 | `0.7.0-*` | read-only advisory completion evaluator | bounded、non-recursive、无 plan 时安静；只 advisory，不阻断、不写 counter/ledger | pending；可独立于 Phase 6 进入 Discovery |
| 8 | `0.8.0-*` | optional hard gating，复用 Phase 7 evaluator | 重新 Discovery writer/counter/atomicity/lock/cache/Resume/rollback；再增加 block cap、escape hatch 与 stall state | pending；implementation 前必须重新 Discovery |
| 9 | 当前列车的 `rc.N` → stable | standing Release 收口：完整矩阵、最终字节、canary retirement、正式发布 | RC 与最终资产分别验收；重新下载双资产；可逆 | standing gate；`v0.3.5` instance complete；当前 `0.4.0-dev` train 尚未进入 |

Phase 9 是 Release 收口，不机械等于 `0.9.0`。例如只完成 Phase 4 时，它可以封板 `0.4.0`；如果多个
Phase 经独立 gate 后被明确合并，则封板当时获批的同一版本列车。`v0.3.5` 的 Phase 9 instance 已完成，
但 Phase 9 本身是每条未来列车都要重新进入的 standing gate，不能继承上一版本的 PASS。

### 4.1 Phase 4 已采纳 gate 路线

Phase 4 保持 Phase 4.1 冻结的 hybrid owned-boundary 与两个现有 turn-start events，不改变主架构；内部按
风险和故障域拆成五个 gate：

| Gate | 范围 | 必须保持的边界 | 典型故障归属 |
|---|---|---|---|
| F1A — Contract/source foundation | manifest schema 4、bundle/Release v2、adapter 纳入 bundle、schema placement 收敛 | runtime 行为仍为 legacy；manifest/bundle/Release 作为原子 contract transaction | contracts、importer、installer、builder |
| F1B — Inactive runtime foundation | plan request/result v2、owned state reader/normalizer、production `allowed_profiles=[legacy]` | marker 仍不可达；现有 Host 输出与 v0.3.5 等价 | owned runtime、adapter/runtime protocol |
| F2A — Smart activation | versioned managed opt-in，只改变 plan 选段 | 不读取 nonce/attestation/ledger；不接受 gated | smart selection 与 opt-in policy |
| F2B — Autonomous activation | attestation、exact nonce、normalized ledger | raw progress 不得回退；无效或不完整状态拒绝，不降级 legacy | state validation、tamper/refusal、ledger rendering |
| F3 — Cloud and rollback acceptance | Fresh、UserPrompt、real Resume、cache reuse、opt-out/re-arm 与双向 rollback | live Cloud 不等于 Release；失败不得产生 partial takeover 或 snapshot residue | Cloud lifecycle、takeover、rollback |

F1A/F1B 是独立审查、测试和停止点，不强制形成两个可发布的半成品。只要 runtime/schema bytes 会影响 bundle、
manifest 或 ZIP hash，最终 candidate 就必须在同一完整 transaction 内使 contract、代码、inventory、mode 与 hash
全部自洽；不得发布只完成一半或无法 deterministic build/check 的中间状态。

### 4.2 F2 activation/disarm 前置协议

F1A/F1B 可以先规划和实施；任何 F2 behavior activation 前必须另行冻结用户如何安全启用和退出：

1. versioned managed token 是 activation commit point，也是显式 opt-in，不是 secret 或身份凭据；
2. smart 所需状态准备完成后最后写 token；删除 token 即退出 managed opt-in；
3. autonomous 先由 pristine Skill/用户侧流程建立 nonce、attestation 与所需状态，确认 attestation 成功后最后写 token；
4. token 存在但其他状态不完整或非法时只拒绝，不能按“未启用”降级到 legacy；
5. managed Hook/runtime 继续只读 workspace，上游 writer 不进入 production trusted graph。

这条顺序防止 initializer 吞掉 attestation failure 后留下“看似已激活、实际状态残缺”的 mode。F2A 与 F2B
仍分别授权；完成 F1 不会自动授权任何 opt-in behavior。

### 4.3 Phase 5～8 已采纳边界

- **Phase 5：** 先重新核对实际 Cloud payload，比较现有 `SessionStart source=clear|compact` 与
  PreCompact/PostCompact 的时序和恢复能力。现有事件足够时不扩大 managed event set；只有真实 context 丢失或
  时序缺口才能提议新增 Hook。
- **Phase 6：** 是可跳过的可选能力。PreToolUse、PostToolUse、PermissionRequest 分别建立 use case、预算、
  噪声和 Cloud gate；没有明确收益就 `NO_GO`，也不阻塞 Phase 7。
- **Phase 7：** 建立唯一的 read-only completion evaluator，只给 advisory，不阻断、不写 mutable gate state。
- **Phase 8：** 复用 Phase 7 evaluator，只新增 blocking decision 与可恢复的 mutable state。实施前必须重新
  Discovery ledger/counter owner、atomicity/lock、cache/Resume inheritance 与 rollback residue；不得直接把上游
  best-effort shell lock 提升为 managed authority。

## 5. 版本号与晋级语义

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

## 6. Discovery 与 gate 晋级模型

本项目采用“先探路、再实施”的动态轮次治理。Discovery 不是固定的 Phase 编号，而是在继续实现可能
导致“实现正确，但架构方向错了”时主动暂停并恢复证据的设计 gate。

### 6.1 Discovery 触发条件

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

### 6.2 正式加 Round 与 Round 内子门槛

按变化影响选择治理粒度，而不是为了维持旧轮次数字硬塞风险：

| 变化类型 | 治理动作 |
|---|---|
| 改变架构、契约、Product Phase 范围、信任边界、Release 边界或回滚方式 | 正式增加可独立审查的 Discovery Round |
| 架构不变，只需把已选方案拆成安全的实施、隔离和验证顺序 | 使用当前 Round 内 A/B/C 子门槛 |
| 普通测试补漏、文档同步或已冻结方案内的局部 bug 修复 | 不单独增加探路轮，但仍受当前 task plan、边界测试和停止条件约束 |

关键 gate 不因“仍在同一 Phase”而豁免设计检查；反过来，局部实现拆分也不应虚增 programme Round。

### 6.3 Discovery 最低产物与结论

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

### 6.4 标准晋级链

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

每个箭头都是独立 gate；前一 gate PASS 不自动授权后一 gate。任一步出现 6.1 的触发条件，都回到
Discovery，按 6.2 决定增加正式 Round 或 Round 内子门槛，再按 6.3 重新冻结结论。

## 7. Release 授权与封板顺序

只有 ROADMAP 把目标版本标为获批 Release candidate，且活动 task plan 明确授权具体 Release gate，
才允许封板。稳定构建/验证命令由 [`README.md`](README.md) 管理，精确版本步骤和资产证据由相应版本
acceptance 管理；[`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md) 只提供维护者接手和结果分流入口。
模板、活动 Release task plan、版本 acceptance 与 ROADMAP 的详细分工只由
[`Cloud hard acceptance template` 的“文档职责与写入时机”](docs/cloud-hard-acceptance-template.md#acceptance-document-responsibilities)
定义；本节只维护 programme 级授权与封板顺序，不复制逐资产或逐步骤状态。

<a name="release-four-step-flow"></a>

### 7.1 大白话 Release 四步

以后每个版本按四个大步骤走；前一步通过只允许进入下一步，不自动把后面的角色一起改掉：

| 步骤 | 大白话 | 必须证明 | 主要证据 |
|---|---|---|---|
| 1. 候选验证 | 先在源码和本地候选 ZIP 上测；除本地回归外，还要在 Cloud 的选定 branch/commit checkout 跑通 Source/Candidate | “这份代码可以发布”，但还没有真实公开包 | 活动 task plan；完成后写版本 acceptance 的 Source/Candidate 证据 |
| 2. 发布 Pre-release | 创建新的 immutable tag 和对应 Pre-release，上传最终 ZIP 与 ZIP 外 bootstrap | “真实公开包已经存在”，tag/URL/size/SHA 已冻结 | provenance + publication audit；不得删 tag 或重传同名资产来修补 |
| 3. 公开包验收 | 用另一套 Fresh Cloud 从公开 bootstrap 默认下载链安装，再重新下载公开 ZIP 做 Resume/doctor/deep check | “用户实际下载到的公开包也能工作” | 版本 acceptance 的 Published Release 证据 |
| 4. 晋级 Latest | 前三步全绿后，由维护者把同一个 Release 取消 Pre-release 并设为 Latest，再做只读 postflight | “现在正式推荐这个版本”，并旋转 accepted/fallback 角色 | ROADMAP；tag、Release 和资产都原地保留，不删除重建 |

对应关系也保持简单：provenance 回答“发布了什么字节”，acceptance 回答“公开包是否验收”，ROADMAP
回答“现在推荐谁”。Latest promotion 只改 Release metadata 与 lifecycle 指针，不重新上传包；postflight
必须再次核对新 accepted 和 immediate fallback 的 tag/source/asset identity，并按 retirement DoD 清理退出
candidate+accepted 窗口的本地版本文件与旧 oracle。

<a name="pre-1-compatibility-admission"></a>

### 7.2 Pre-1.0 compatibility 与历史债准入

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

## 8. 回滚与基线提升

当前角色只在第 2 节维护。未来版本只有在 immutable publication、重新下载、Fresh/Resume/doctor 和
rollback 验证全部通过后，才能更新该表并成为新的基线。旧资产、tag、SHA、acceptance 和迁移 evidence
refs 不得重写；pointer-only promotion 也不能反向修改 sealed ZIP 输入。

## 9. 长期泛化边界

当前唯一正式集成仍是 PWF v3.8.2。第二个只读插件尚未证明 Host/runner/Driver 抽象，因此不得把项目
描述为通用 Skill 转换器，也不预先为泛化能力分配版本号。只有独立 Discovery 和第二实现证据完成后，
才能决定抽象是否进入新的 Product Phase 或 `1.0.0` 稳定合同。
