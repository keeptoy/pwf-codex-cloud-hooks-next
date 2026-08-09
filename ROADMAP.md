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
| 当前开发列车 | `v0.3.2`；published 与 Cloud hard acceptance 已完成；当前分支是 P3 前的 unsealed governance transition，后继列车尚未开启 |
| 当前已接受版本 | `v0.3.2`；production rollback 与 GitHub `Latest` |
| 回退证据链 | immutable `v0.3.1` immediate fallback；更早发布里程碑见 provenance museum |
| 当前 programme 边界 | Product Phase 4 未授权 |
| 长期支持范围 | 只正式支持 `OthmanAdi/planning-with-files v3.8.2` |

`v0.3.2` 已在独立 P1 gate 完成 pointer-only promotion；P2 随后把 v0.3.1 当前树副本归档到 immutable
ref，没有改写任何已发布 tag、source、README 或资产字节。版本 delta 见 [`CHANGELOG.md`](CHANGELOG.md)，
精确 source/资产/SHA 见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，最终验收与晋级证据见
[`docs/v0.3.2-cloud-hard-acceptance.md`](docs/v0.3.2-cloud-hard-acceptance.md)。

## 3. 已完成的基线 `v0.3.2`

`v0.3.2` 是 Product Phase 4 前当前已接受的兼容、供应链与仓库治理基线。它继承 v0.3.1 的全部安全
边界，没有新增 Hook、Host ABI、trusted graph 或安装行为，并在同一 `0.3` 行为合同内完成以下收口：

| 问题域 | 已完成结果 |
|---|---|
| inherited security baseline | 保留 v0.3.1 已关闭的 Managed TOML ownership/locking、immutable transcript bytes、bounded Host input、固定 PWF archive 与无远程 root Node tooling 等边界 |
| documentation authority | README、ARCHITECTURE、DESIGN、CHANGELOG、ROADMAP、active planning 与 provenance/acceptance 各自只有一个职责权威 |
| repository lifecycle | trusted/Release zones 继续 exact；planning/docs 按生命周期治理；当前树保持一个 active planning，并以机器可解析角色窗口控制版本文件 |
| Release maintenance | importer 与直接 patcher 依赖继续 self-contained 进入精确 23-entry ZIP；Source/Candidate 与 Published Release 两条 Cloud 通道独立 PASS |

该基线已完成 immutable publication、公开下载字节复核、Fresh/Resume/doctor 双通道 Cloud 验收和显式
baseline promotion；当前 lifecycle 角色只见第 2 节。实际版本 delta 见 [`CHANGELOG.md`](CHANGELOG.md)，
精确 source/资产身份与 predecessor 迁移链见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，完整
阶段与晋级证据见 [`docs/v0.3.2-cloud-hard-acceptance.md`](docs/v0.3.2-cloud-hard-acceptance.md)。

## 4. 当前开发列车与 Product Phase 路线

`v0.3.2` 列车已经发布并验收；package、Release contract 与根目录 v0.3.2 bootstrap 继续保存最后一个
已发布 machine identity，但不把 P2 后的 HEAD 认证为相同发布源码。`0.3.2-dev-extend` 已完成 P2 历史
深度清理，期间没有修改 production runtime、Host ABI、trusted graph、Hook 行为或任何已发布资产；但
README 作为 ZIP input 已经版本无关化，所以当前 HEAD 构建只是 deterministic unsealed transition bytes，
不等于 published v0.3.2 ZIP，也不是新的 candidate。

下一步必须先进入独立 P3 Discovery，再建立新的 machine identity 和 fail-closed bootstrap，之后才允许
seal 新候选字节；P3 目前未授权。当前状态明确是 **unsealed governance transition**，不得用 v0.3.2
bootstrap 的已发布 checksum 安装从 HEAD 临时重建的 ZIP。

仓库生命周期治理通常保持一个 active planning，并以 candidate + accepted role window 控制当前
bootstrap/acceptance；当前两项角色同为 v0.3.2，因此当前树只保留这一套入口。v0.3.1 作为 immediate
fallback 由 immutable commit、tag、Release 与 exact acceptance 恢复；更早历史只留在精选 provenance。
trusted/Release zones 继续 exact，docs/planning zones 按 lifecycle policy 验证。

下表是未来 Discovery 的候选，不是发布承诺，也不自动授权下一 Phase。一个 Phase 可以有多个
pre-release；多个低风险 Phase 也只有在独立评审后才能进入同一版本列车。

| Phase | 候选版本列车 | 候选范围 | 最低退出/Cloud 门槛 | 状态 |
|---|---|---|---|---|
| 4 | `0.4.0-*` | attestation、nonce 与 opt-in v3 modes | legacy 默认不变；tamper/cache/rollback 与 Fresh/Resume | pending Discovery authorization |
| 5 | `0.5.0-*` | compaction lifecycle | 先观测 `clear`/`compact` Host schema；无重复或丢失 context | pending |
| 6 | `0.6.0-*` | selective tool/permission hooks | 逐事件测量 latency/token/噪声；先 advisory、后扩展 | pending |
| 7 | `0.7.0-*` | advisory completion | bounded、non-recursive、无 plan 时安静 | pending |
| 8 | `0.8.0-*` | optional hard gating | 明确 Stop contract、上限、逃生路径、rollback 与隔离 Cloud | pending |
| 9 | 当前列车的 `rc.N` → stable | 完整矩阵、最终字节、canary retirement、正式发布 | RC 与最终资产分别验收；重新下载双资产；可逆 | complete — `v0.3.2` publication、dual-channel Cloud 与 baseline promotion PASS |

Phase 9 是 Release 收口，不机械等于 `0.9.0`。例如只完成 Phase 4 时，它可以封板 `0.4.0`；如果多个
Phase 经独立 gate 后被明确合并，则封板当时获批的同一版本列车。

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
通道会重新依赖可移动 source checkout。

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
