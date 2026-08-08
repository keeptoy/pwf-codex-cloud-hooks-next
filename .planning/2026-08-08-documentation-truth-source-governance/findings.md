# Findings: Documentation Truth-Source Governance

## User intent

- 开展一次独立文档治理计划，而不是零散改几段文字。
- 每类事实保留一个完整真理源，其他文档只摘要和引用。
- 明确宏观路线与微观计划、宏观架构与模块功能说明的分层。
- 首批样例：把 ROADMAP 的“与活动 planning 的分工”导航职责迁入 README `开发状态`，并删除
  README 顶部已过时、时间敏感的版本/rollback blockquote。

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
5. `MAINTAINER_HANDOFF.md`：接手和操作流程；目前“当前事实”、Release 精确字节和回滚角色复制了
   ROADMAP/acceptance/provenance。
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
| Release 封板顺序 | README、ROADMAP、AGENTS、handoff | ROADMAP 定义 programme gate/顺序；handoff 提供可执行步骤并链接；README/AGENTS 只留关键安全摘要 |

### Intentional summaries that should remain

- README 保留“一句话模型”、两个支持事件、最小失败语义和用户命令；它们服务首次使用，不是当前
  programme 状态副本。
- AGENTS 保留不可绕过的 trust/Release 安全规则和验证命令，因为这是 agent 执行边界；但具体当前
  版本角色改为链接 ROADMAP。
- MAINTAINER_HANDOFF 保留操作顺序、失败分类和 rollback 方法；具体资产身份从 acceptance/provenance
  读取，不在手册另建完整数据表。
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
README (入口、稳定行为、文档地图)
  ├─ ROADMAP (当前宏观路线、生命周期、版本/Release gate)
  │    └─ active task plan (当前微观 Next Step、授权、停止条件)
  ├─ ARCHITECTURE (系统模型、组件职责、信任/失败边界)
  │    ├─ machine contracts (schema/hash/inventory/allowlist)
  │    └─ source/tests (模块微观行为与可执行证明)
  ├─ BASELINE_PROVENANCE (不可变来源链)
  ├─ MAINTAINER_HANDOFF (维护操作流程)
  └─ docs/* (专项 runbook、历史 acceptance、平台专项)
```

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

## Frozen batch rationale

1. 身份基础必须先于 README，因为任何 README edit 会立即改变 candidate ZIP。
2. README/ROADMAP/AGENTS 同批迁移，避免文档地图在中间状态出现两个完整权威表。
3. ARCHITECTURE/provenance/handoff 后续单批清理，便于逐类判断原理、历史与操作摘要，避免一次大删。
4. 历史 acceptance 最后处理且默认不改；只有读者可能误认“当前状态”时才增加标签/入口。
5. 重复事实 guard 只针对当前宏观文档，必须显式排除 immutable acceptance、历史 planning 和 fixtures。
