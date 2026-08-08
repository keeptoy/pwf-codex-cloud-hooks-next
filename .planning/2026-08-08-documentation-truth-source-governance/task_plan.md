# Task Plan: Documentation Truth-Source Governance

## Goal

建立“一类事实只有一个真理源”的仓库文档体系：权威文档完整回答其唯一问题，其他文档只保留面向
读者的最小摘要和稳定链接，同时不改写历史验收、不破坏 sealed Release 字节边界，也不把文档整理
扩大为产品、Host ABI、trusted graph 或 Product Phase 4 变更。

## Current Gate

维护者已授权创建并激活独立文档治理计划。D0/D1 已完成：既有三文件终态一致性修订得到保护，
文档职责、重复事实、authority matrix、摘要/引用规则、迁移批次、Release 边界与验证门槛已经冻结。
当前停在 Release identity decision gate。尚未授权修改 README、ROADMAP、ARCHITECTURE、专项文档、
测试、package/version、Release allowlist、bootstrap、tag、asset、remote ref 或 Cloud 状态。

## Next Step

维护者选择推荐的 `0.3.2-dev` 文档治理身份路线，或选择先治理 ZIP-excluded 文档并延后 README。

## Current Phase

Identity decision checkpoint — stopped before implementation

## Status

**CONDITIONAL GO.** D0/D1 已完成；authority model 和迁移设计可实施。README 路线必须先由维护者
明确选择；D2–D5 仍未授权。

## Governance Principles

1. **一个问题、一个权威。** 每类事实只在一份文档维护完整内容。
2. **入口摘要，不复制状态。** README 面向新读者提供导航、稳定行为和最小摘要；频繁变化状态通过
   链接进入权威文件。
3. **宏观/微观分层。** ROADMAP 管 programme/Phase/Release 生命周期；活动 task plan 管当前 gate、
   Next Step、授权与停止条件。ARCHITECTURE 管系统级职责/信任边界；模块级说明贴近源码、contract 或
   专项文档。
4. **历史证据不可当前化。** acceptance/provenance/runbook 中的历史快照保持时间语义，不被当前状态
   批量替换。
5. **Release 字节优先。** README 是 v0.3.1 sealed ZIP 输入；任何 README 字节变化必须先解决新的
   source/package/Release identity 与对应测试合同，不能继续冒充 exact v0.3.1。
6. **引用必须可验证。** 摘要链接到唯一权威；相对链接、标题锚点、UTF-8/LF 和 repository boundary
   进入自动验证。

## Proposed Authority Matrix

| 主题/问题 | 唯一真理源 | 其他文档允许内容 |
|---|---|---|
| 稳定支持行为、安装/doctor/repair/测试入口 | `README.md` | 其他文档只链接，不复制命令清单 |
| 文档导航与“去哪里找答案” | `README.md` 的开发状态/文档地图 | `AGENTS.md` 保留智能体必读顺序和冲突规则 |
| 系统组件、数据流、信任边界、失败语义 | `ARCHITECTURE.md` | README 一句话/仓库地图摘要；模块文档只解释局部 |
| 当前 programme、Product Phase、版本列车、Cloud/Release/rollback 状态 | `ROADMAP.md` | README 只说明该类状态去 ROADMAP；不复制具体版本角色 |
| 当前唯一 Next Step、授权、禁止事项、停止条件 | 活动 `task_plan.md` | ROADMAP/README 只链接，不复制逐 gate 状态 |
| 当前研究结论与取舍 | 活动 `findings.md` | 稳定结论成熟后提升到对应权威文档并从 findings 链接 |
| 当前实施、验证和错误证据 | 活动 `progress.md` | 宏观文档不复制流水账 |
| baseline/upstream/overlay/资产来源 | `BASELINE_PROVENANCE.md` + machine contracts | README/ARCHITECTURE 仅摘要和链接 |
| 运维、变更分类、发布与回滚操作 | `MAINTAINER_HANDOFF.md` + 版本 runbook | README 保留用户级命令，不复制维护者完整流程 |
| 历史 Cloud/Release 验收 | 对应 `docs/*acceptance*.md` | ROADMAP 只记录结论和链接，不复制原始证据 |

## First Migration Candidate

- 删除 README 顶部关于当前源码/package、rollback 与 beta.2 的时间敏感 blockquote。
- 将 ROADMAP `## 1. 与活动 planning 的分工` 的“问题 → 权威文件”导航职责迁入 README
  `## 开发状态`，重写为面向新读者的文档权威地图。
- ROADMAP 只保留一句分层原则和指向 README 文档地图的链接，然后直接维护宏观路线/生命周期事实。
- README 不复制 ROADMAP 当前具体版本、Latest/rollback 或逐 gate 状态。
- 该候选只有在新的 source/package/Release identity 决策完成后才可实施，因为 README 是 sealed
  v0.3.1 ZIP 输入。

## Gate Sequence

### D0 — Planning activation and preservation

- [x] 运行 session catch-up 和 `git status --short --branch`。
- [x] 识别并保留前一活动计划的三文件终态一致性修订。
- [x] 创建新的 task plan、findings、progress 并更新 `.planning/.active_plan`。
- [x] 不修改任何产品、宏观文档、测试或 Release 字节。
- **Status:** complete

### D1 — Authority inventory and design freeze

- [x] 枚举根级、docs、planning 和 machine contracts 的文档主题/标题。
- [x] 建立重复事实清单，区分 intentional summary、historical snapshot 和 harmful duplication。
- [x] 冻结 authority matrix、摘要预算、链接方向和冲突处理规则。
- [x] 冻结 README sealed-input 的两条安全路线和推荐选择。
- [x] 给出按风险排序的迁移批次、每批精确文件范围和验证矩阵。
- **Exit:** 无未决文档所有权问题；实施范围和 Release 身份路线可供维护者明确批准。
- **Status:** complete — CONDITIONAL GO, stopped for identity-route choice

### R0 — Source/Release identity foundation

- [ ] 推荐路线下把当前 source/package/Release contract 置为新的 `0.3.2-dev` 身份。
- [ ] 新建 ZIP-external `init-cloud-sandbox-v0.3.2.bash`，development 默认 64-zero hash 并 fail closed；
  v0.3.1/v0.3.0 bootstrap 保持不可变。
- [ ] 把 exact v0.3.1 ZIP/bootstrap 验证改为从 immutable tag/source oracle 重建；current candidate
  assertions 改为新开发身份，不复用 `f097...`。
- [ ] 同步 repository-boundary 精确 tracked-path inventory。
- **Status:** pending / unauthorized / only required for recommended README-now route

### D2 — Entry-point and authority-map migration

- [ ] 按获批身份路线更新 README 开发状态/文档地图并删除时间敏感顶部 blockquote。
- [ ] 精简 ROADMAP 的分工章节为宏观路线权威声明和 README 链接。
- [ ] 同步 AGENTS 的文档权威表，但保留智能体专属读取/冲突/安全规则。
- **Status:** pending / unauthorized

### D3 — Architecture and module-document separation

- [ ] 保留 ARCHITECTURE 的系统模型、组件职责、trusted graph 与失败语义。
- [ ] 把安装器、adapter、plan、catch-up、importer/patcher、Release builder 的微观功能说明指向源码、
  machine contract 或最小专项说明，删除宏观文档间的逐项复制。
- [ ] 不创建没有明确读者/维护责任的新文档。
- **Status:** pending / unauthorized

### D4 — Lifecycle, provenance and operations deduplication

- [ ] ROADMAP 只保留当前宏观状态与未来路线。
- [ ] BASELINE_PROVENANCE 只保留来源链和不可变身份。
- [ ] MAINTAINER_HANDOFF 只保留可执行维护流程并链接权威事实。
- [ ] 历史 acceptance/runbook 保持时间语义，增加必要的“历史证据”标签而不改写原始事实。
- **Status:** pending / unauthorized

### D5 — Validation and closure

- [ ] 运行链接、标题锚点、UTF-8/LF、Markdown fence、重复事实和 repository-boundary 检查。
- [ ] 运行 focused governance tests；若 package/Release identity 变化则运行 full suite、deterministic ZIP
  和对应 Release gate。
- [ ] 记录残留的有意摘要与历史快照白名单。
- [ ] 完成维护者复核后关闭计划，Product Phase 4 仍需独立授权。
- **Status:** pending / unauthorized

## Release Identity Decision Gate

README 当前是 `contracts/release-artifact-v1.json` 的 v0.3.1 allowlist 输入，测试要求当前树能重建
exact sealed v0.3.1 ZIP。实施 README 治理前必须从以下路线中明确选择一条：

1. **推荐：`0.3.2-dev` 文档治理列车。** 先建立新的 source/package/contract identity 和 zero-hash
   external bootstrap，再修改 README；是否最终发布 `0.3.2` 仍需后续独立 seal/acceptance 决策。
   这是同一 0.3 行为合同内的兼容治理，不占用 Product Phase 4 的 `0.4.0-*` 路线。
2. **延后 README。** 先治理 ZIP-excluded 文档，README 迁移推迟到下一已授权版本列车。风险最低，
   但不能立即完成用户给出的首批样例。

禁止通过弱化 v0.3.1 exact-ZIP 断言、从 allowlist 临时删除 README、或把变化后的 current tree 继续
称为 v0.3.1 来绕过该 gate。

## Summary and Reference Rules

- README 文档地图允许一张“问题 → 唯一权威”表；不得含当前版本、commit、hash、Latest/rollback
  角色、测试计数或逐 gate 状态。
- 非权威文档对同一主题最多保留一个短段落或三条稳定要点，随后必须链接权威；不得复制完整表、
  完整步骤或可独立维护的状态块。
- 稳定架构摘要可写职责和不变量，不写当前 lifecycle 角色；模块微观说明以源码、schema、machine
  contract 和最近边界测试为准。
- 运维手册可以保留动作顺序，但具体版本/资产身份必须从 ROADMAP、provenance 或版本 acceptance
  读取；示例使用变量或明确标记为历史版本。
- 历史 acceptance/runbook 不反向改成当前状态，只增加必要的“历史证据/当前入口”链接。
- 引用方向优先为入口 → 权威 → machine evidence；避免两个宏观文档互相要求同步同一事实。

## Migration Batches

### Batch A — Identity foundation（推荐路线独有）

精确范围：`package.json`、`contracts/release-artifact-v1.json`、新 v0.3.2 development bootstrap、
`tests/release-package.test.js`、`tests/skill-patch.test.js`、`tests/repository-boundary.test.js`，以及直接
依赖的 planning。目标仅是建立诚实的新字节身份，不改变 runtime/Host ABI/trusted graph。

### Batch B — README/ROADMAP/AGENTS entrypoint

精确范围：`README.md`、`ROADMAP.md`、`AGENTS.md`、`tests/architecture-contracts.test.js`、直接依赖的
planning。README 获得文档地图并删除顶部时间敏感 blockquote；ROADMAP 删除完整 planning 分工表并
内部单点化当前基线；AGENTS 改为引用 README 文档地图，只保留 agent-only 读取、冲突和安全规则。

### Batch C — Architecture/provenance/handoff separation

精确范围：`ARCHITECTURE.md`、`BASELINE_PROVENANCE.md`、`MAINTAINER_HANDOFF.md`、focused governance
assertions、直接依赖的 planning。移除当前 lifecycle 双写；保留系统原理、不可变来源证据和操作步骤。

### Batch D — Historical labels and automated guard

只对确有歧义的专项 runbook/acceptance 增加历史标签/当前入口，不改写冻结事实。增加一个小型
authority regression：README 必须链接所有权威、非 ROADMAP 宏观文档不得声明当前 Latest/rollback，
README 不得出现具体当前 lifecycle/hash/test-count 模式；历史目录和版本 acceptance 进入白名单。

### Batch E — Final validation and closure

运行完整 Markdown/link/anchor/repository checks、focused governance 和风险相称的 package/full suite。
只有未来明确授权 Release 时才进入 seal/publication/Cloud acceptance；文档实现完成本身不自动发布。

## Validation Matrix

| 变更类型 | 最小验证 |
|---|---|
| planning-only | exact changed paths、UTF-8/LF/final newline、fences、`git diff --check` |
| README/ROADMAP/ARCHITECTURE | local links/anchors、authority assertions、focused governance tests |
| 新增/删除 tracked docs | repository-boundary exact inventory 与 Release exclusion |
| README/package/Release contract | full suite、deterministic build/check、新身份与 bootstrap boundary |
| acceptance/provenance | 历史 hash/URL/身份不变，当前状态只在权威文件更新 |

## Stop Conditions

- 同一事实仍有两个可独立编辑的“完整版本”，且无法决定权威归属。
- 摘要开始复制具体 gate、hash、测试数字或频繁变化的生命周期状态。
- README 字节变化却没有新的 source/package/Release identity 决策。
- 拟修改已发布 tag/asset/acceptance 字节或把历史快照改写为当前事实。
- 文档整理要求改变 Host ABI、trusted graph、runtime、installer 或 Product Phase 4 行为。
- 为通过测试而弱化 sealed asset、identity、repository inventory 或安全断言。

## Non-goals

- 不在本计划中实现 Product Phase 4、通用插件框架或新 Hook。
- 不重写 v0.3.1/v0.3.0/beta.2 的已发布资产与历史验收。
- 不把所有信息集中到一个超大文档；“一个真理源”按问题域划分，而不是全仓只有一份文档。
- 不删除对新用户有价值的摘要、入口命令或安全警告，只删除可漂移的重复正文。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| None | 0 | D0 completed without command or file-write errors. |
