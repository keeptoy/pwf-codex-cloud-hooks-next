# Task Plan: Documentation Truth-Source Governance

## Goal

建立“一类事实只有一个真理源”的仓库文档体系：权威文档完整回答其唯一问题，其他文档只保留面向
读者的最小摘要和稳定链接。新增 `DESIGN.md` 承接仓库/模块实现设计，并在内容逐节归位后退役
`MAINTAINER_HANDOFF.md`；同时不改写历史验收、不破坏 sealed Release 字节边界，也不把文档整理
扩大为产品、Host ABI、trusted graph 或 Product Phase 4 变更。

## Current Gate

维护者已明确采用 `0.3.2-dev` 文档治理身份路线，并允许在关键 gate 主动创建本地 Git commit 作为
回滚点。D0/D1 探路已经完成：既有修订得到保护，文档职责、重复事实、authority matrix、摘要/引用
规则、迁移批次、Release 边界与验证门槛已经冻结。当前进入 R0 source/Release identity foundation；
授权不包含 seal、publication、tag、asset、push、remote ref、Cloud 或 Product Phase 4 变更。

## Next Step

提交本次方案微调和身份决议检查点，然后实施 R0：建立诚实的 `0.3.2-dev` package/contract/bootstrap/
test identity，不改变 runtime、Host ABI 或 trusted graph。

## Current Phase

R0 — Source/Release identity foundation

## Status

**GO.** D0/D1 探路完成，`0.3.2-dev` 路线已明确选择。R0–D6 在本计划冻结范围内按 gate 顺序实施；
每一 gate 通过相称验证后可主动 commit，前一 gate 未通过不得进入下一 gate。Release seal/publication、
push/remote/Cloud 和 Product Phase 4 仍需独立授权。

## Estimated Implementation Rounds

当前决议检查点之后预计 **6 个实施轮次**；每轮以一个可独立回滚的本地 commit 收口：

| 轮次 | Gate | 交付物 | Commit checkpoint |
|---:|---|---|---|
| 1 | R0 | `0.3.2-dev` package/contract、zero-hash bootstrap、identity tests | identity foundation |
| 2 | D2 | README 文档地图、DESIGN foundation、ROADMAP/AGENTS 入口迁移 | entrypoint/design foundation |
| 3 | D3 | ARCHITECTURE/DESIGN 的 why/how 分层与模块验证路由 | architecture/design split |
| 4 | D4 | handoff 逐节迁移、零入链并删除 | handoff retirement |
| 5 | D5 | lifecycle/provenance 去重、必要历史标签与治理 guard | authority deduplication |
| 6 | D6 | 全量回归、deterministic package/repository checks、计划闭环 | governance closure |

若某轮暴露 Release identity、repository inventory 或历史证据冲突，则该轮停止并增加修复回合，不把
失败带入下一 gate；若没有意外，六轮足够，不再另设探索轮。

## Governance Principles

1. **一个问题、一个权威。** 每类事实只在一份文档维护完整内容。
2. **入口摘要，不复制状态。** README 面向新读者提供导航、稳定行为和最小摘要；频繁变化状态通过
   链接进入权威文件。
3. **宏观/微观分层。** ROADMAP 管 programme/Phase/Release 生命周期；活动 task plan 管当前 gate、
   Next Step、授权与停止条件。ARCHITECTURE 管系统为什么这样设计以及系统级职责/信任边界；
   DESIGN 管仓库模块如何落实架构、入口/依赖/变更影响和验证路由；更细行为贴近源码、contract 或
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
| 系统为何如此设计、跨组件数据流、信任边界、失败语义 | `ARCHITECTURE.md` | README/DESIGN 只保留稳定摘要和链接 |
| 仓库地图、模块职责/入口/依赖、变更影响与验证路由 | `DESIGN.md` | README 只保留入口链接；源码/contracts/tests 回答更细行为 |
| 当前 programme、Product Phase、版本列车、Cloud/Release/rollback 状态 | `ROADMAP.md` | README 只说明该类状态去 ROADMAP；不复制具体版本角色 |
| 当前唯一 Next Step、授权、禁止事项、停止条件 | 活动 `task_plan.md` | ROADMAP/README 只链接，不复制逐 gate 状态 |
| 当前研究结论与取舍 | 活动 `findings.md` | 稳定结论成熟后提升到对应权威文档并从 findings 链接 |
| 当前实施、验证和错误证据 | 活动 `progress.md` | 宏观文档不复制流水账 |
| baseline/upstream/overlay/资产来源 | `BASELINE_PROVENANCE.md` + machine contracts | README/ARCHITECTURE 仅摘要和链接 |
| 稳定用户/开发命令 | `README.md` | DESIGN 仅按模块链接命令，不复制完整操作清单 |
| 变更分类、模块修改路径、验证选择 | `DESIGN.md` | AGENTS 保留智能体强制边界；README 只链接 |
| Release/rollback 生命周期策略 | `ROADMAP.md` | README/DESIGN 只链接；精确版本步骤和资产由专项 runbook/acceptance 回答 |
| 历史 Cloud/Release 验收 | 对应 `docs/*acceptance*.md` | ROADMAP 只记录结论和链接，不复制原始证据 |

## First Migration Candidate

- 删除 README 顶部关于当前源码/package、rollback 与 beta.2 的时间敏感 blockquote。
- 将 ROADMAP `## 1. 与活动 planning 的分工` 的“问题 → 权威文件”导航职责迁入 README
  `## 开发状态`，重写为面向新读者的文档权威地图。
- 新建根级 `DESIGN.md`，把 README `## 仓库地图` 迁入其中并扩展为模块实现地图；README 只保留
  DESIGN 入口，不再维护第二份仓库路径表。
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
- **Status:** complete — prior CONDITIONAL GO satisfied by maintainer selection of `0.3.2-dev`

### R0 — Source/Release identity foundation

- [ ] 推荐路线下把当前 source/package/Release contract 置为新的 `0.3.2-dev` 身份。
- [ ] 新建 ZIP-external `init-cloud-sandbox-v0.3.2.bash`，development 默认 64-zero hash 并 fail closed；
  v0.3.1/v0.3.0 bootstrap 保持不可变。
- [ ] 把 exact v0.3.1 ZIP/bootstrap 验证改为从 immutable tag/source oracle 重建；current candidate
  assertions 改为新开发身份，不复用 `f097...`。
- [ ] 同步 repository-boundary 精确 tracked-path inventory。
- [ ] 明确 `DESIGN.md` 为 tracked 但 ZIP-excluded 的治理文档；除非另有 Release contract 决策，不把它
  顺手加入 candidate ZIP。
- **Status:** authorized / next gate

### D2 — Entry-point and DESIGN foundation

- [ ] 按获批身份路线更新 README 开发状态/文档地图并删除时间敏感顶部 blockquote。
- [ ] 新建 `DESIGN.md`，声明读者、回答的问题、不回答的问题和链接方向。
- [ ] 把 README `## 仓库地图` 迁入 DESIGN；README 仅保留简短入口。
- [ ] 精简 ROADMAP 的分工章节为宏观路线权威声明和 README 链接。
- [ ] 同步 AGENTS 的文档权威表，但保留智能体专属读取/冲突/安全规则。
- **Status:** pending / authorized after R0 exit

### D3 — ARCHITECTURE/DESIGN separation

- [ ] ARCHITECTURE 只回答设计原理、跨组件关系、trusted graph、失败语义和系统不变量。
- [ ] DESIGN 回答 repository/source/installed layout，以及 installer、adapter、plan、catch-up、
  importer/patcher、Release builder 的职责、入口、依赖、变更影响和验证路由。
- [ ] 函数/字段级行为继续指向源码、machine contract 和最近边界测试，不在 DESIGN 复制实现正文。
- [ ] 验证 ARCHITECTURE 与 DESIGN 不各自维护一份完整组件清单、调用链或当前 lifecycle 状态。
- **Status:** pending / authorized after D2 exit

### D4 — MAINTAINER_HANDOFF decomposition and retirement

- [ ] 建立 `MAINTAINER_HANDOFF.md` 逐节迁移矩阵，每节只能是迁入明确 authority、保留为历史链接，或
  作为重复内容有理由删除。
- [ ] 将用户/开发命令迁入 README，模块变更与验证选择迁入 DESIGN，programme/Release/rollback 策略
  迁入 ROADMAP，来源链迁入 BASELINE_PROVENANCE，精确版本证据留在专项 runbook/acceptance。
- [ ] 更新 README、ROADMAP、AGENTS、专项文档和测试中的全部入链后删除 `MAINTAINER_HANDOFF.md`。
- [ ] 删除前验证没有只存在于 handoff 的安全步骤、失败分类或恢复入口。
- **Status:** pending / authorized after D3 exit

### D5 — Lifecycle, provenance and historical deduplication

- [ ] ROADMAP 只保留当前宏观状态与未来路线。
- [ ] BASELINE_PROVENANCE 只保留来源链和不可变身份。
- [ ] 历史 acceptance/runbook 保持时间语义，增加必要的“历史证据”标签而不改写原始事实。
- **Status:** pending / authorized after D4 exit

### D6 — Validation and closure

- [ ] 运行链接、标题锚点、UTF-8/LF、Markdown fence、重复事实和 repository-boundary 检查。
- [ ] 运行 focused governance tests；若 package/Release identity 变化则运行 full suite、deterministic ZIP
  和对应 Release gate。
- [ ] 记录残留的有意摘要与历史快照白名单。
- [ ] 完成维护者复核后关闭计划，Product Phase 4 仍需独立授权。
- **Status:** pending / authorized after D5 exit

## Release Identity Decision Gate

README 当前是 `contracts/release-artifact-v1.json` 的 v0.3.1 allowlist 输入，测试要求当前树能重建
exact sealed v0.3.1 ZIP。维护者已在 2026-08-08 明确选择第 1 条：

1. **推荐：`0.3.2-dev` 文档治理列车。** 先建立新的 source/package/contract identity 和 zero-hash
   external bootstrap，再修改 README；是否最终发布 `0.3.2` 仍需后续独立 seal/acceptance 决策。
   这是同一 0.3 行为合同内的兼容治理，不占用 Product Phase 4 的 `0.4.0-*` 路线。
2. **延后 README。** 先治理 ZIP-excluded 文档，README 迁移推迟到下一已授权版本列车。风险最低，
   但不能立即完成用户给出的首批样例。**未选择。**

禁止通过弱化 v0.3.1 exact-ZIP 断言、从 allowlist 临时删除 README、或把变化后的 current tree 继续
称为 v0.3.1 来绕过该 gate。

## Summary and Reference Rules

- README 文档地图允许一张“问题 → 唯一权威”表；不得含当前版本、commit、hash、Latest/rollback
  角色、测试计数或逐 gate 状态。
- 非权威文档对同一主题最多保留一个短段落或三条稳定要点，随后必须链接权威；不得复制完整表、
  完整步骤或可独立维护的状态块。
- 稳定架构摘要可写职责和不变量，不写当前 lifecycle 角色；模块微观说明以源码、schema、machine
  contract 和最近边界测试为准。
- DESIGN 不复制 ARCHITECTURE 的设计理由/trusted graph，也不复制 ROADMAP 当前 lifecycle；它以模块
  入口、依赖、改动落点和验证选择为边界。
- 退役 handoff 后，不再建立新的综合运维手册；操作内容按“用户命令、模块变更、programme 策略、
  精确版本 runbook”归入各自权威。
- 历史 acceptance/runbook 不反向改成当前状态，只增加必要的“历史证据/当前入口”链接。
- 引用方向优先为入口 → 权威 → machine evidence；避免两个宏观文档互相要求同步同一事实。

## Migration Batches

### Batch A — Identity foundation（推荐路线独有）

精确范围：`package.json`、`contracts/release-artifact-v1.json`、新 v0.3.2 development bootstrap、
`tests/release-package.test.js`、`tests/skill-patch.test.js`、`tests/repository-boundary.test.js`，以及直接
依赖的 planning。目标仅是建立诚实的新字节身份，不改变 runtime/Host ABI/trusted graph。

### Batch B — README/ROADMAP/AGENTS/DESIGN entrypoint

精确范围：`README.md`、新 `DESIGN.md`、`ROADMAP.md`、`AGENTS.md`、
`tests/architecture-contracts.test.js`、`tests/repository-boundary.test.js`、直接依赖的 planning。README
获得文档地图并删除顶部时间敏感 blockquote，将仓库地图迁入 DESIGN；ROADMAP 删除完整 planning
分工表并内部单点化当前基线；AGENTS 改为引用 README 文档地图，只保留 agent-only 读取、冲突和
安全规则。

### Batch C — ARCHITECTURE/DESIGN module separation

精确范围：`ARCHITECTURE.md`、`DESIGN.md`、focused governance assertions、直接依赖的 planning。
冻结“为什么/系统边界”与“如何落到仓库模块/如何选择验证”的分工，删除二者间的完整清单复制。

### Batch D — Handoff decomposition and retirement

精确范围：`MAINTAINER_HANDOFF.md`、`README.md`、`DESIGN.md`、`ROADMAP.md`、
`BASELINE_PROVENANCE.md`、`AGENTS.md`、确有承接关系的专项 runbook/acceptance、focused governance 和
repository-boundary assertions、直接依赖的 planning。先迁移和验证全部独有内容，再更新入链和删除
handoff；禁止先删后补。

### Batch E — Historical labels and automated guard

只对确有歧义的专项 runbook/acceptance 增加历史标签/当前入口，不改写冻结事实。增加一个小型
authority regression：README 必须链接所有权威、非 ROADMAP 宏观文档不得声明当前 Latest/rollback，
README 不得出现具体当前 lifecycle/hash/test-count 模式；历史目录和版本 acceptance 进入白名单。

### Batch F — Final validation and closure

运行完整 Markdown/link/anchor/repository checks、focused governance 和风险相称的 package/full suite。
只有未来明确授权 Release 时才进入 seal/publication/Cloud acceptance；文档实现完成本身不自动发布。

## Validation Matrix

| 变更类型 | 最小验证 |
|---|---|
| planning-only | exact changed paths、UTF-8/LF/final newline、fences、`git diff --check` |
| README/ROADMAP/ARCHITECTURE | local links/anchors、authority assertions、focused governance tests |
| DESIGN/模块说明 | 与 ARCHITECTURE 的职责互斥、源码/contracts/tests 链接、change-impact/validation 路由 |
| 新增/删除 tracked docs | repository-boundary exact inventory 与 Release exclusion |
| 删除 MAINTAINER_HANDOFF | 逐节迁移矩阵、全仓零入链、独有安全/恢复步骤零遗漏 |
| README/package/Release contract | full suite、deterministic build/check、新身份与 bootstrap boundary |
| acceptance/provenance | 历史 hash/URL/身份不变，当前状态只在权威文件更新 |

## Stop Conditions

- 同一事实仍有两个可独立编辑的“完整版本”，且无法决定权威归属。
- DESIGN 开始复刻 ARCHITECTURE 的设计理由/trusted graph，或承担 ROADMAP 当前 lifecycle。
- MAINTAINER_HANDOFF 尚有无承接者的独有步骤、失败分类、恢复入口或仍有有效入链。
- 摘要开始复制具体 gate、hash、测试数字或频繁变化的生命周期状态。
- README 字节变化却没有新的 source/package/Release identity 决策。
- 拟修改已发布 tag/asset/acceptance 字节或把历史快照改写为当前事实。
- 文档整理要求改变 Host ABI、trusted graph、runtime、installer 或 Product Phase 4 行为。
- 为通过测试而弱化 sealed asset、identity、repository inventory 或安全断言。

## Non-goals

- 不在本计划中实现 Product Phase 4、通用插件框架或新 Hook。
- 不重写 v0.3.1/v0.3.0/beta.2 的已发布资产与历史验收。
- 不把所有信息集中到一个超大文档；“一个真理源”按问题域划分，而不是全仓只有一份文档。
- 不把 DESIGN 建成新的综合手册、第二份 ARCHITECTURE 或源码逐函数说明。
- 不删除对新用户有价值的摘要、入口命令或安全警告，只删除可漂移的重复正文。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| None | 0 | D0 completed without command or file-write errors. |
| Git could not create `.git/index.lock` under workspace sandbox | 1 | No partial stage/commit occurred; controlled escalation succeeded for the same exact three planning paths. |
