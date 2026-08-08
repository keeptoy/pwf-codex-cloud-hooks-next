# Findings: Documentation Truth-Source Governance

## User intent

- 开展一次独立文档治理计划，而不是零散改几段文字。
- 每类事实保留一个完整真理源，其他文档只摘要和引用。
- 明确宏观路线与微观计划、宏观架构与模块功能说明的分层。
- 首批样例：把 ROADMAP 的“与活动 planning 的分工”导航职责迁入 README `开发状态`，并删除
  README 顶部已过时、时间敏感的版本/rollback blockquote。
- 新建根级 `DESIGN.md`，把 README `仓库地图` 迁入其中，形成与宏观 ARCHITECTURE 分层的仓库/模块
  实现设计权威。
- 后续把 `MAINTAINER_HANDOFF.md` 的事实和完整流程迁入各问题域的权威文档，但保留该文件作为新人
  维护者路标、踩坑摘要和能力检测反馈入口。

## Initial authority findings

- README 适合作为人的入口和文档地图，但不适合作为当前 Release/rollback/gate 状态的唯一权威。
- ROADMAP 应回答 programme/Phase/Release 生命周期，不应重复解释所有 planning 文件的日常职责。
- 活动 task plan 必须继续独占当前 Next Step、授权和停止条件；宏观路线不得产生实施授权。
- ARCHITECTURE 应保留系统级模型和信任边界；函数级行为以源码和 machine contracts 为主。
- acceptance/provenance 文档包含不可变历史证据，不能用全仓当前化替换破坏其时间语义。

## Critical Release-boundary finding

`README.md` 是 `contracts/release-artifact-v1.json` 的 v0.3.1 allowlist entry，也是 sealed ZIP 的精确
输入。当前 governance tests 刻意区分 ROADMAP 当前 lifecycle 与 README 的 tag-time snapshot。
因此用户提出的 README 改动在内容上是文档治理，在供应链上仍是 Release-input 字节变化；实施前必须
选择新的 source/package/Release identity，或把 README 迁移延后到下一版本列车。

## Working classification

| 分类 | 定义 | 处理方式 |
|---|---|---|
| Authority | 完整回答某一类问题、允许被更新的唯一文档 | 保留完整内容和变更责任 |
| Entry summary | 为目标读者提供最小上下文和入口 | 限制长度，链接 authority，不复制易变值 |
| Historical snapshot | 在特定 source/Release/gate 下成立的证据 | 保留时间标记，不随当前状态批量更新 |
| Machine contract | hash、schema、allowlist、inventory 的可执行真理源 | 人类文档解释目的，不复制全部字段 |
| Harmful duplicate | 两处都可独立维护同一完整事实 | 选择 authority，另一处删除或改摘要链接 |

## Pre-existing workspace changes

开始本计划前，旧活动计划的 task plan/findings/progress 已有维护者授权的终态一致性修订，精确解决
promotion evidence transport 的旧 checkbox/status/Decision Checkpoint。新计划必须保留这些改动，
不得覆盖、折叠或误认成本计划产生的宏观文档变更。

## Questions to close in D1

1. README 改动采用下一版本开发身份，还是延后到已有版本列车授权时？
2. AGENTS 的“文档权威”表与 README 文档地图如何区分，避免再次完整复制？
3. ARCHITECTURE 中哪些模块细节属于稳定系统职责，哪些应只留在源码/contract？
4. 哪些版本/Cloud/rollback 摘要是新用户必要上下文，哪些应完全移出 README？
5. 是否需要新增自动化重复事实检查，还是 focused assertion + 白名单足够？

## Repository documentation inventory

当前人类/治理文档可分为六层：

1. `README.md`：产品入口、稳定行为、用户/开发命令、仓库地图；目前混入 Release 时间快照。
2. `ARCHITECTURE.md`：系统模型、Cloud 生命周期、数据流、信任/失败边界；目前末尾混入当前
   rollback/Latest 角色。
3. `ROADMAP.md`：当前 programme/版本/Release 路线；目前同时承担文档导航，并在文件内部多次复制
   Product Phase 4 与 rollback 状态。
4. `BASELINE_PROVENANCE.md`：不可变来源链和历史迁移证据；目前少量“当前角色”字段会随 ROADMAP
   漂移。
5. `MAINTAINER_HANDOFF.md`：维护者 onboarding/triage 入口；目前混合入口命令、模块变更、验证、
   Release 策略、精确版本证据和回滚角色，事实/完整流程应拆回各 authority，文件本身保留稳定路标。
6. `AGENTS.md`：智能体入口、安全/验证/发布规则；目前既含 agent-only 约束，也完整复制文档权威表
   和当前版本角色。

`docs/*acceptance*.md`、M3/M4 runbook 和 `docs/git-file-modes.md` 属于专项/历史证据层；它们不应被
压缩进宏观文档，也不应因当前 lifecycle 变化而批量重写。

## Duplicate-fact classification

### Harmful mutable duplication

| 事实 | 当前重复位置 | 建议权威/处理 |
|---|---|---|
| 当前 production rollback/Latest 与 fallback 层级 | ROADMAP、ARCHITECTURE、AGENTS、handoff、provenance | ROADMAP 当前基线表唯一维护；其他位置改为无版本号安全规则或链接 |
| Product Phase 4 是否授权 | ROADMAP 多处、AGENTS、handoff | ROADMAP programme gate + 活动 task plan 授权；其他位置只声明“以两者为准” |
| 文档职责/当前 Next Step 在哪里 | README、ROADMAP、AGENTS、handoff | README 文档地图是人的入口权威；AGENTS 只保留 agent 读取顺序/冲突规则并链接；ROADMAP 删除完整表 |
| 当前 package/ZIP entry 数、候选/发布状态 | README、handoff、ROADMAP、Release contract/tests | machine contract + 对应 acceptance；README 用 contract-driven 命令，不冻结数字和 candidate 状态 |
| Release 封板顺序 | README、ROADMAP、AGENTS、handoff | ROADMAP 定义 programme gate/顺序；通用构建命令归 README，版本精确步骤归专项 runbook/acceptance；AGENTS 只留 agent-only 安全边界 |

### Intentional summaries that should remain

- README 保留“一句话模型”、两个支持事件、最小失败语义和用户命令；它们服务首次使用，不是当前
  programme 状态副本。
- AGENTS 保留不可绕过的 trust/Release 安全规则和验证命令，因为这是 agent 执行边界；但具体当前
  版本角色改为链接 ROADMAP。
- MAINTAINER_HANDOFF 保留维护者接手顺序、常见误判和能力检测结果分流；操作步骤由实际问题域的
  authority 自解释，handoff 只摘要并链接。
- ARCHITECTURE 可解释为何 bootstrap 必须在 ZIP 外，但不维护“当前 Latest 是谁”。

### Historical snapshots that must not be normalized

- v0.3.1/v0.3.0/beta.2 hard-acceptance 的 source、asset、SHA、Attempt 记录。
- M1/M3/M4 的 accepted commit、Cloud 结果与当时授权边界。
- 已完成 planning 中逐 gate 的历史授权和错误流水。
- sealed README 在 v0.3.1 tag 中的字节；current main 的未来 README 变化必须使用新身份，不能重写 tag。

## Structural migration observations

1. README `开发状态` 当前只有两条链接，正适合扩展成“问题 → 唯一权威”文档地图；ROADMAP
   `## 1. 与活动 planning 的分工` 可在迁移后删除完整表，只留其自身范围声明。
2. README 顶部 blockquote 同时包含 candidate/Release 状态、rollback 和 beta.2 角色，已经与当前
   ROADMAP 不一致；它是首个应删除的 harmful mutable duplicate。
3. README `构建当前 0.3.1 候选 ZIP`、固定 `23 entries` 和“当前外部候选资产”也属于同一时间敏感
   问题，不能只修顶部而留下第二组可漂移身份；D1 需要把它纳入同一 README 迁移批次。
4. ARCHITECTURE 第 11 节应保留通用 Release boundary、source/import 与 production execution 的
   原理，但“v0.3.1 当前 production rollback/Latest”应改为 ROADMAP 链接。
5. BASELINE_PROVENANCE 应只陈述不可变 source/asset/overlay/migration provenance；“current lifecycle
   role”字段应改成历史资产关系或指向 ROADMAP。
6. ROADMAP 自身需要单点化：当前基线表应成为当前 lifecycle 唯一数据块，顶部 blockquote和后文只
   引用该表/描述规则，避免同文件内多次写具体状态。

## Candidate documentation layers after governance

```text
README (入口、稳定行为、用户/开发命令、文档地图)
  ├─ ROADMAP (当前宏观路线、生命周期、版本/Release gate)
  │    └─ active task plan (当前微观 Next Step、授权、停止条件)
  ├─ ARCHITECTURE (为什么这样设计：系统模型、信任/失败边界)
  ├─ DESIGN (如何落实：仓库地图、模块职责/依赖、变更影响/验证路由)
  │    ├─ machine contracts (schema/hash/inventory/allowlist)
  │    └─ source/tests (更细行为与可执行证明)
  ├─ BASELINE_PROVENANCE (不可变来源链)
  ├─ MAINTAINER_HANDOFF (维护者路标、踩坑摘要、能力检测反馈)
  └─ docs/* (专项 runbook、历史 acceptance、平台专项)
```

## DESIGN.md decision

建议采用根级大写文件名 `DESIGN.md`，与 `README.md`、`ARCHITECTURE.md`、`ROADMAP.md` 的宏观文档
命名一致。它不是“更详细的 ARCHITECTURE”，而是实现层导航：

1. 说明目标读者、回答的问题和明确不回答的问题。
2. 承接 README 当前 `## 仓库地图`，并区分 source、build、installed runtime 和 historical evidence。
3. 按 installer、hook adapter、owned plan/catch-up、importer/patcher、Release builder、tests 描述模块职责、
   入口、主要依赖和 contract 边界。
4. 提供“改什么 → 看哪些 contracts/tests → 跑什么验证”的 change-impact 路由。
5. 函数、字段和命令细节通过稳定链接回到源码、machine contracts、tests 或 README，不复制正文。

ARCHITECTURE 唯一回答“为什么这样设计、跨组件如何流动、信任/失败边界是什么”；DESIGN 唯一回答
“这些设计落在哪些仓库模块、改动会影响什么、如何选择验证”。两者都不维护当前版本/Latest/rollback。
`DESIGN.md` 默认应是 tracked 但 ZIP-excluded 的治理文档；新增 tracked path 仍需同步 repository boundary，
但不应仅因它位于根目录就扩大 Release allowlist。

## MAINTAINER_HANDOFF refactoring

| 现有内容类型 | 迁移后的 authority |
|---|---|
| 接手入口、稳定本地开发/健康检查命令 | README；智能体恢复顺序仅留 AGENTS |
| 当前 programme、版本角色、Release/rollback 策略 | ROADMAP；当前授权仍只在活动 task plan |
| 仓库/模块改动分类、source→runtime 更新路径、验证选择 | DESIGN |
| installer/doctor 的用户操作 | README；模块所有权和改动影响进入 DESIGN |
| baseline/upstream/overlay/不可变资产来源 | BASELINE_PROVENANCE + machine contracts |
| 精确候选构建、某版本发布/回滚步骤与资产身份 | 对应版本 runbook/acceptance；通用 build 命令可由 README 链接 |
| M4 cutover 等已经完成的历史步骤 | 对应历史专项文档，不在当前手册复述 |
| agent-only trust、Release 和停止规则 | AGENTS，且链接人的文档地图 |

保留条件是逐节 traceability 完成：每段事实/完整步骤都有承接 authority；handoff 自己只拥有新人最短
接手路径、稳定踩坑摘要和能力检测反馈。它应形成一个短反馈环：先确认当前 gate → 运行 README 指向的
健康/验证入口 → 把结果分类为 PASS、repairable、blocker、platform limitation 或 product defect → 跳到
README/DESIGN/ARCHITECTURE/ROADMAP/provenance/runbook 中的唯一权威。这样既不会把维护知识藏散，也不会
让 handoff 成为第二份状态或操作真理源。

## Executable contract impact

- `contracts/release-artifact-v1.json` 当前固定 `package_version=0.3.1`，并把 `README.md` 列为 23 个
  ZIP entries 之一。
- `tests/release-package.test.js` 从当前工作树构建两次 ZIP，并要求 SHA-256 精确等于 sealed v0.3.1
  `f097b040...31f9`；它还要求 package/contract 均为 `0.3.1`，bootstrap 默认绑定同一 hash。
- `tests/architecture-contracts.test.js` 明确断言 README 含 tag-time `v0.3.0` rollback，而 ROADMAP 含
  current `v0.3.1` promotion。这是有意保护 sealed README 的临时治理断言，不是未来 README 信息架构。
- 因此 README-now 路线至少需要 package identity、Release contract、development bootstrap 和上述
  测试合同同步；只编辑 Markdown 会产生正确的测试红灯。

## D1 identity recommendation

推荐建立独立 `0.3.2-dev` documentation-governance train：它不新增 Hook、Host ABI、runtime 或
trusted edge，符合 patch-level 兼容治理；同时不会占用 ROADMAP 为 Product Phase 4 预留的
`0.4.0-*`。该身份先保持 development/zero-hash，不因文档完成自动 seal 或发布。若维护者不希望现在
开启任何新 package identity，则唯一安全替代是先治理 ZIP-excluded 文档，并把 README 样例延后。

## Maintainer decision and round estimate

2026-08-08，维护者明确选择 `0.3.2-dev` documentation-governance train，并允许在关键节点主动创建
本地 Git commit 便于回滚调整。该决议关闭 Release identity decision checkpoint，也确认 D0/D1 探路
阶段结束；它不授权 seal、publication、tag/asset、push/remote、Cloud 或 Product Phase 4。

重新按仓库必读顺序复核 README、ARCHITECTURE 和 ROADMAP 后，没有出现需要新增 Discovery 的变量：
支持范围、runtime 数据流、Host ABI、trusted graph、失败语义和 production rollback 均保持不变；
本计划改变的是开发身份与信息所有权。因此可以直接进入 R0，不需要额外探路轮。

后续预计六个实施轮次，分别对应 R0、D2、D3、D4、D5、D6。保持一 gate 一 commit 的原因是：R0
涉及可执行 Release identity contract，D2 涉及 sealed README 输入，D3 是信息架构重分层，D4 删除
tracked 文档，D5 会触碰历史/当前语义分界，D6 才能证明整体收口。把这些边界压成更少提交会降低
回滚定位能力；拆成更多轮则会制造文档中间态和额外同步成本。

## Frozen batch rationale

1. 身份基础必须先于 README，因为任何 README edit 会立即改变 candidate ZIP。
2. README/ROADMAP/AGENTS/DESIGN 同批建立入口，避免文档地图或仓库地图在中间状态出现两个完整权威表。
3. 先建立 DESIGN，再清理 ARCHITECTURE/DESIGN 边界；否则直接移走 README 仓库地图会产生无主内容。
4. 先完成 lifecycle/provenance/历史边界去重和 guard，再重写 handoff；路标只能指向已经稳定的 authority。
5. handoff 最后去事实化并保留 onboarding/triage 价值，不删除文件，也不保留第二份完整流程。
6. 重复事实 guard 只针对当前宏观文档，必须显式排除 immutable acceptance、历史 planning 和 fixtures。

## Handoff retention decision

维护者撤回“删除 handoff”的初步方向，选择保留它作为新人维护者入口。这个决定与单一真理源原则不
冲突，前提是 handoff 拥有的是导航/反馈问题，而不是被导航的事实本身：

- **独有价值：** 五分钟接手路径、最容易踩的安全坑、能力/健康检测结果如何解释和分流。
- **允许摘要：** 每项最多一条稳定结论，紧接 authority 链接。
- **禁止内容：** 当前版本/Latest/rollback、commit/hash/test count、逐 gate 状态、完整构建/发布/回滚
  步骤、可独立维护的命令清单。
- **顺序理由：** D4 先稳定 ROADMAP/provenance/history 与 governance guard；D5 再重写 handoff，避免
  路标先指向仍在移动或重复的目的地。

## D2 entrypoint migration design

- README 的新 `开发状态与文档地图` 是人的通用导航 authority；AGENTS 不再复制完整 authority table，
  只保留 agent 必读顺序、当前授权入口、冲突/安全/验证规则并链接 README 文档地图。
- DESIGN 在 D2 先建立稳定边界和仓库地图：回答“实现落在哪里、读者下一步看哪里”；D3 再补模块
  entry/dependency/change-impact/validation routing，避免 D2 提前改写 ARCHITECTURE 系统正文。
- README 顶部 stale lifecycle blockquote 整块删除。由于 README 已处于 0.3.2-dev source identity，构建
  章节也必须去掉“当前 0.3.1 候选”、固定 23 entries 和旧 external candidate 描述，改为 contract-driven
  development ZIP 说明；published/current lifecycle 继续只由 ROADMAP 与版本 acceptance 回答。
- ROADMAP `## 1` 删除完整 planning 职责表，只保留 programme/task-plan 两层分工和 README 文档地图
  链接。ROADMAP 内“handoff 管完整 Release 操作”的旧入口同时改为 README 通用命令 + 版本 runbook，
  与已冻结的 handoff onboarding/triage 职责一致。
- DESIGN 是 tracked root doc 但不进入 23-entry Release allowlist；repository-boundary 应增加该精确路径，
  focused test 应显式断言 README 无第二份仓库地图、DESIGN 有唯一仓库地图且 ZIP 不含 DESIGN。

## D2 implementation result

- README 现在拥有唯一的人类文档导航表，仓库路径表已完全迁出；其开发 ZIP 说明改为读取 machine
  contract，不再冻结候选版本、entry count 或 lifecycle 角色。
- DESIGN foundation 已成为 tracked、LF、ZIP-excluded 根级文档，拥有唯一 `仓库地图`，并先冻结
  source/build/install/runtime/evidence 五层实现视图；D3 将在此基础上补齐模块变更与验证路由。
- ROADMAP 只保留 programme 与活动 planning 的宏观/微观分层，并链接 README 文档地图；AGENTS 只
  保留 agent 必读顺序、授权/证据/contract 路由和安全规则，不再复制完整文档权威表。
- README 字节变化只改变当前 0.3.2-dev 开发 ZIP；v0.3.1/v0.3.0 immutable source oracle 均通过。
  当前双构建观察值为 23 entries / 82,512 bytes / SHA `2bd6fc93...b9725`，未写入 bootstrap，不是 seal。
- focused governance、完整 Windows suite、链接/锚点、LF、importer、Python/Node/Bash syntax、双构建和
  repository inventory 全部通过；D2 exit 成立，可进入 D3。

## D3 boundary audit

- ARCHITECTURE 的部署图与 runtime 数据流虽然包含文件名，但它们证明 trusted graph 和跨组件关系，
  不是仓库维护清单；应原样保留。DESIGN 的仓库地图与后续模块路由回答“改哪里、影响谁、测什么”，
  两者是 intentional overlap 而非重复 authority。
- ARCHITECTURE 的 plan/catch-up contract、信任分层、失败语义、installer ownership 和 Release 安全原则
  均应保留；D3 不把这些正文迁入 DESIGN。
- DESIGN 应新增三类维护视图：repository/source/Release/installed layout 对照、模块 responsibility/
  direct-dependency/consumer/change-impact 表、按变更意图选择入口与验证的 routing 表。
- DESIGN 的验证列只链接到 tests 文件或 README 的完整命令区，不冻结测试数量、命令副本、schema 字段、
  hash、版本角色或 lifecycle 状态。
- ARCHITECTURE 只需在开头、部署图和 runtime 数据流附近增加指向 DESIGN 的稳定路标；版本历史与
  lifecycle 重复属于 D4，本轮保持不动。
- ROADMAP 已明确拥有 current programme/version/Release/rollback；DESIGN 现有 foundation 没有这些
  mutable facts。D3 扩充时继续使用角色名和路径，不引入任何当前版本身份。
- DESIGN 现有“实现层次”可直接演进为 layout 对照，其末尾“后续章节”占位应在 D3 删除，改成真实的
  module/change routing；“继续阅读”保留为收尾导航。
- 源码符号与测试名确认七条主维护路线：installer→`installer.test.js`；adapter/composition→
  `hook-adapter`、`runtime-supervisor`、`activation`；plan→`owned-plan-runtime`；catch-up→`owned-runtime`；
  importer/patcher→`import-runtime`、`skill-patch`；builder/contract→`release-package`、`contracts`；跨层
  trust seam→`architecture-contracts`、`repository-boundary`。
- `install.js` 同时读取 package、upstream manifest、runtime/contracts 并拥有 requirements/manifest/drift；
  module card 应把它标为 install plane owner，而不是简单 CLI 文件。
- `hook_adapter.py` 的边界集中在 Host payload、typed request/result validation、child supervision 与最终
  context composition；plan/catch-up 选择算法分别留在 owned runtime，DESIGN 只说明此依赖方向。
- Layout 对照必须区分：源码树含 importer/patcher/builder/docs/tests；Release ZIP 只含 release contract
  allowlist；installed managed dir 只含 adapter、两个 owned runtime、四个 upstream runtime、运行所需
  contracts 与 installed manifest；global Skill 是 pristine reference，四者不能混成一张目录表。
- Contract routing 可按所有权分组：plan request/result 连接 adapter↔owned-plan；runtime request/result
  连接 adapter↔owned-catchup；runtime bundle/compatibility overlay 连接 importer/patcher↔owned bundle；
  release artifact 只连接 builder↔candidate ZIP。具体字段仍由 JSON contract 自己回答。
- `owned-plan.py` 直接消费两个 upstream shell sibling；`owned-catchup.py` 动态加载 owned upstream
  `session-catchup.py`；这两个依赖方向适合写入 DESIGN，但 timeout/budget/precedence 等语义继续只链接
  ARCHITECTURE/contracts/tests。
- Installer 精确 inventory 复核：installed managed dir 包含 adapter、两个 owned runtime、四个 upstream
  runtime、两个 installed plan contracts、compatibility overlay、third-party notice 和 installed manifest；
  runtime/catch-up schema 是 repository/ZIP contract，不作为 installed file 复制。DESIGN 应点明这个差异。
- Release artifact contract 复核：ZIP 包含 installer/runtime、全部 machine contracts、importer/patcher/
  builder 和 attribution，但排除 tests/docs/planning/bootstrap/DESIGN；因此 layout 表的“allowlist maintenance
  inputs”表述准确，不能把 Release ZIP 简化成 installed runtime 的压缩副本。

## D3 implementation result

- ARCHITECTURE 的全部原有章节、部署图和 runtime data flow 均保留，只增加三个由 architecture → DESIGN
  的单向路标；没有为了制造 why/how 分层而拆散已完整的系统说明。
- DESIGN 现在可独立回答三类维护问题：代码/产物/安装布局如何对应；七个主要模块的入口、依赖、下游、
  change-impact 与最近测试是什么；按具体变更目标应从哪里开始且哪些边界不可顺手扩大。
- Machine contract 路由只说明 producer/consumer/复核方向，不复制字段；验证路由只选择证据类型并链接
  README 完整命令，不冻结测试计数。DESIGN 未引入 current version/Latest/rollback/hash/逐 gate 状态。
- Focused governance/repository boundary 6/6 与完整 Windows suite 70 pass / 0 fail / 12 honest SKIP 均
  通过；links/anchors/LF/fences/diff check 通过，D3 exit 成立。

## D4 change architecture design

- 采用“3+1”模型：CHANGELOG 回答已合并/已发布 delta；ROADMAP 回答开发列车目标与跨 Phase intent；
  活动 task plan 回答当前唯一授权行动；provenance/acceptance/contracts 作为正交 evidence layer。
- README 文档地图应新增 CHANGELOG 入口，本地恢复顺序应补上已遗漏的 DESIGN；CHANGELOG 不必成为
  每次 agent 必读文件，因此 AGENTS 强制顺序无需增加它。
- ARCHITECTURE 第 11 节前半的 bootstrap/allowlist/seal 原则属于稳定 Release boundary；其中具体版本
  entry count、当前 rollback/Latest 和版本角色不属于架构，应改为 CHANGELOG/ROADMAP/provenance 链接。
- CHANGELOG `Unreleased` 只记录已经合并到当前 source 的 0.3.2-dev 文档治理 delta；开发目标只链接
  ROADMAP，不把计划内容写成结果。稳定版本只摘要行为/维护变化并链接精确 provenance/acceptance。
- ROADMAP 当前重复两次维护 v0.3.1/Latest/rollback（顶部 blockquote、§2 table，§8 再总结）；D4 应删除
  顶部副本，以 §2 作为 current lifecycle 唯一完整表，§8 只保留晋级规则并回链 §2。
- ROADMAP 尚未说明当前 `0.3.2-dev` documentation-governance train；应在 §2 记录其宏观目标与“不改变
  runtime/Host ABI/trusted graph、不自动发布”，但具体 D4/D5/D6 Next Step 仍只在活动 task plan。
- ROADMAP §4 仍把已完成 0.3.1 train 的旧活动 plan 写成精确 Next Step authority；应改为已完成版本
  摘要并链接 CHANGELOG/acceptance，避免 historical plan 被误当成 current authorization。
- 三份 version acceptance 已各自完整冻结 exact bytes 与 Cloud 证据，因此 provenance 不需要复制其
  Attempt/命令/测试流水账；只需维护三份 immutable identity index 并链接对应 acceptance。
- v0.3.1 provenance 可从 acceptance 固定 tag/source `9aa2148...`、23-entry ZIP、bootstrap 与两个 SHA；
  lifecycle role 必须留在 ROADMAP，不进入 provenance identity table。
- 历史 acceptance 顶部出现“当前状态/当前入口”是其 runbook 内部的时间语义，不应批量改写；D4 guard
  应白名单 `docs/*acceptance*.md`，只要求新增文件或宏观 authority 不把这些历史文字当成 current source。
- BASELINE_PROVENANCE 当前真正应保留的是 beta.2/v0.3.0 身份、上游、overlay 与 reproduction chain；
  M1 测试数字、current source/protection、Cloud facts 正文和 slim transformation 轮次应缩成 immutable
  lineage/evidence links，并补齐缺失的 v0.3.1 immutable identity index。
- 现有 architecture test 把 v0.3.0/v0.3.1 entry count 强制留在 ARCHITECTURE，正是 D4 要迁移的旧 guard；
  应改为由 provenance/acceptance 保护 exact identity，ARCHITECTURE 只断言 contract-driven Release 原则。
- 新 CHANGELOG 是 tracked root doc，repository exact inventory 从 75 增至 76，且 Release contract 必须
  继续排除它。D4 先保护 CHANGELOG/ROADMAP/provenance/architecture 边界；handoff 的 mutable-fact guard
  在 D5 重写 handoff 时启用，避免跨 gate 提前修改或让 D4 永久红灯。

## R0 identity audit

- 当前 `package.json.version` 与 `contracts/release-artifact-v1.json.package_version` 均为 sealed
  `0.3.1`；Release allowlist 仍是 23 entries，包含 README，因此 D2 前必须先建立新开发身份。
- `init-cloud-sandbox-v0.3.1.bash` 默认绑定 `v0.3.1` 和 sealed ZIP SHA `f097b040...31f9`；该文件必须
  保持字节不变。R0 应从其逻辑复制新建 `init-cloud-sandbox-v0.3.2.bash`，只改变新身份默认值并把
  HOOKS SHA 置为 64-zero，从而在未 seal 状态 fail closed。
- 当前 `tests/release-package.test.js` 把工作树的 deterministic ZIP 直接断言为 sealed v0.3.1 hash；R0
  必须把 current-tree assertions 改为 0.3.2 development identity/双构建一致/zero-hash，同时新增或保留
  从 immutable v0.3.1 source oracle 重建 exact ZIP 和 bootstrap SHA 的历史断言。
- `tests/contracts.test.js` 与 `tests/repository-boundary.test.js` 也把 current artifact 外部资产固定为
  v0.3.1；它们应切换到 v0.3.2 development bootstrap，并同时继续断言 v0.3.0/v0.3.1 bootstrap 不进入
  current ZIP。
- R0 不增加 ZIP entry；新 bootstrap 与既有 bootstrap 一样保持 ZIP-external。它只增加一个 tracked
  root path，因此 repository-boundary 精确 inventory 必须同步。
- v0.3.1 历史实现最初使用 current-tree candidate tests，seal 后再把 bootstrap 的 zero hash 写为精确
  hash；本轮应保留这个“两态 bootstrap”模型，但不能继续让 current main 的 ZIP 与 sealed v0.3.1
  hash相等。历史提交 `9aa2148`/tag 可作为 v0.3.1 immutable oracle。
- `tests/skill-patch.test.js` 当前所有 bootstrap 行为测试都指向 sealed v0.3.1。R0 应保留至少一个
  v0.3.1 sealed identity/override test，同时把共享行为和默认 zero-hash gate 转到新 v0.3.2 development
  bootstrap；这样旧资产不可变与新 candidate fail-closed 两者都有覆盖。
- `tests/architecture-contracts.test.js` 的 README v0.3.1/tag-time 断言应留到 D2 与 README 同批迁移；
  R0 不提前修改 README 或该文档治理断言。
- v0.3.1 开发阶段的既有模式确认：package/contract 使用目标 `0.3.1`，bootstrap 默认 `v0.3.1` +
  64-zero；本计划已明确选择更诚实的 source identity `0.3.2-dev`，而新 bootstrap 的未来 Release 路径
  仍应默认 `v0.3.2` + 64-zero。未来若获批 seal，必须先把 package/contract 从 `0.3.2-dev` 冻结为
  `0.3.2` 并重新构建，不能把 dev ZIP 的观察 hash直接写入 bootstrap。
- immutable v0.3.1 oracle 已完整确定：tag/source
  `9aa2148886e499f9f45594f7ae4f7681f1045de2`，ZIP SHA
  `f097b04015b1a3847ca5a24b9236f882c5a008b22033793b5661e282c39131f9`，bootstrap SHA
  `ce31a32002aea46bbf3f9baf9a0e93451d24c3b3653952e425d1e1ff6960a5e8`。R0 可从该 source 重建 ZIP，
  并核对 tag 中 bootstrap/current frozen v0.3.1 bootstrap 字节与 SHA。
- `upstream-manifest.json.managed_runtime.contracts.release_artifact.sha256` 也绑定当前
  `contracts/release-artifact-v1.json`。R0 改变 package/external-asset identity 后必须同步该 machine hash；
  这不是 runtime graph 变化，而是既有完整性边的预期更新。

## D4 implemented authority boundaries

- `CHANGELOG.md` 已成为 tracked、ZIP-excluded 的实际版本 delta 权威；Unreleased 不含 SHA、当前角色、
  Next Step 或计划能力。
- ROADMAP 第 2 节是当前 lifecycle 的唯一完整陈述；当前开发列车为 `0.3.2-dev` 文档治理，未来 Phase
  仍保持未授权边界。
- BASELINE_PROVENANCE 现按 v0.3.1、v0.3.0、beta.2 索引不可变身份，并保留迁移、upstream、overlay
  与 reproduction 来源链，不再维护当前分支保护、版本角色或测试流水账。
- acceptance/runbook 已具备明确版本、gate 与状态语境；批量追加“历史”标签会改写证据字节而没有增加
  authority 清晰度，因此 D4 选择零 diff，并由治理测试把这些路径作为历史证据白名单。
- AGENTS、ARCHITECTURE、DESIGN、README 只保留各自稳定职责与链接；handoff 的 mutable facts 留到 D5
  逐节迁移，避免在 authority 尚未稳定前重写 onboarding 入口。

## Local Windows Git Bash discovery

- 本机 Git for Windows 安装根为 `D:\Program Files\Git`，版本观测为 `2.55.0.windows.2`；已确认存在
  `git-bash.exe`、`bin\bash.exe` 和 `usr\bin\bash.exe`。
- `git-bash.exe` 是异步终端启动器，不是适合 CI/agent 捕获 stdout 与 exit code 的 Bash binary；从
  PowerShell 直接传 `-lc` 会立即返回，命令输出不可捕获且 `$LASTEXITCODE` 为空。
- 无界面自动化应优先显式调用 `D:\Program Files\Git\bin\bash.exe`；不能因 `bash` 不在 PowerShell
  `PATH` 就断言“本机没有 Bash”。具体 bootstrap syntax 结果由 progress 记录。
- 受控权限下确认该 binary 为 GNU Bash `5.3.15(1)-release (x86_64-pc-cygwin)`。本仓库后续 Windows
  syntax gate 应使用显式 binary + 直接参数（例如 `& $gitBashBinary -n <file>`），避免 launcher 和复杂
  `-lc` 的 PowerShell/Win32 quoting 歧义；受限沙箱若报 Win32 signal-pipe error 5，应按 platform
  limitation 受控重跑。

## D4.1 cross-document anchor finding

- `ARCHITECTURE.md#21-cloud-生命周期与-codex_home` 按当前 GitHub heading slug 规则应可用，但依赖章节
  编号、中文标题、inline code 处理与大小写，任何标题整理都会使 fragment 漂移。
- D4 的通用 local-link script 在 `#` 处分割并只检查目标文件，因而“links PASS”没有证明 fragment
  存在；现有 focused tests 也只保护章节/文件链接，没有验证这六个 fragment。这是验证声明过宽，需在
  D5 前修正。
- 当前根级权威文档共有六条跨文档 fragment，指向五个章节。采用英文显式 `name` anchor，并让通用
  guard 解析所有根级 authority docs；比只修 Cloud 一条或复制 GitHub slug 算法更稳定、易验证。
- D4.1 已按该策略完成：`documentation-map`、`local-development`、`cloud-lifecycle`、
  `implementation-layout`、`module-responsibilities` 成为稳定链接合同；可见标题继续保留原编号和中文，
  二者不再耦合。AGENTS 记录规则，focused test 负责 machine enforcement。
