# Findings: Documentation Truth-Source Governance

## User intent

- 开展一次独立文档治理计划，而不是零散改几段文字。
- 每类事实保留一个完整真理源，其他文档只摘要和引用。
- 明确宏观路线与微观计划、宏观架构与模块功能说明的分层。
- 首批样例：把 ROADMAP 的“与活动 planning 的分工”导航职责迁入 README `开发状态`，并删除
  README 顶部已过时、时间敏感的版本/rollback blockquote。
- 新建根级 `DESIGN.md`，把 README `仓库地图` 迁入其中，形成与宏观 ARCHITECTURE 分层的仓库/模块
  实现设计权威。
- 后续把 `MAINTAINER_HANDOFF.md` 内容迁入各问题域的权威文档，使文档自解释，并在零遗漏、零入链后
  退役该聚合手册。

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
5. `MAINTAINER_HANDOFF.md`：接手和操作流程聚合页；目前混合入口命令、模块变更、验证、Release
   策略、精确版本证据和回滚角色，内容应按问题域拆回各 authority，最终删除该聚合页。
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
- 原先“让 MAINTAINER_HANDOFF 只保留操作步骤”的假设已被维护者的新目标取代：操作步骤也应由其
  实际问题域的 authority 自解释；handoff 只在迁移期间作为来源清单存在，完成后删除。
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

## MAINTAINER_HANDOFF decomposition

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

退役条件不是“内容看起来都重复”，而是逐节 traceability 完成：每段都有承接 authority 或明确的重复
删除理由；所有入链已更新；全仓不再引用 handoff；安全步骤、失败分类和恢复入口没有仅存于 handoff；
repository-boundary 与 focused governance assertions 已同步。这样删除 handoff 才会提升自解释性，而不是
把维护知识藏散。

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
4. handoff 在 DESIGN 和其他 authority 具备承接位置后逐节拆解，最后更新入链并删除，禁止先删后补。
5. 历史 acceptance 最后处理且默认不改；只有读者可能误认“当前状态”时才增加标签/入口。
6. 重复事实 guard 只针对当前宏观文档，必须显式排除 immutable acceptance、历史 planning 和 fixtures。
