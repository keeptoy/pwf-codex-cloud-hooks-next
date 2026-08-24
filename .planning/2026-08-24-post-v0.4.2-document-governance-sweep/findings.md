# Findings & Decisions: post-v0.4.2 文档治理扫尾 Discovery

## Requirements

- 新建并激活一份 post-v0.4.2 文档治理扫尾 Discovery 计划。
- 不自动清退已关闭的 v0.4.2 planning；多个 planning scope 可承担复杂项目多轮 Discovery 的相邻上下文恢复。
- 删除 current test 对“仓库只能存在一个 planning scope”的强制要求。
- 后续检查“临时授权”等一次性事故叙事是否泄漏到稳定测试与模板。

## Confirmed Findings

### 唯一 planning scope 断言的来源

- `tests/repository-boundary.test.js` 的 planning lifecycle test 最早只验证 active pointer 格式、active scope 三件套和 active state。
- `docs/repository-governance-guide.md#planning-lifecycle` 明确允许 current tree 按维护者节奏暂时保留完整 completed scope；切换 `.active_plan` 不自动产生删除授权。
- `tests/f3-lifecycle-helpers.js::validatePlanningScopes` 原生支持一个 active scope 加若干 inactive scope；inactive scope 必须严格只含 `task_plan.md`、`findings.md`、`progress.md`。
- `assert.deepEqual(planningScopes, [activePlan], ...)` 直到 2026-08-24 的 commit `33deb5870015c94df329fe233e306363ba43232b` 才出现。
- 同一 commit 刚完成 24 个非活动 planning scope 的获批 C2 清退，并记录“最终只剩 1 个活动 planning”。因此该断言是在保护一次 closeout 结果，而不是早期稳定生命周期合同。
- 把该快照提升为永久不变量会阻止正常的新 scope rollover，并与治理指南和底层 validator 直接冲突；应退役这条额外断言，不削弱原有结构安全检查。

### “临时授权”历史与稳定合同的初始分类

- `docs/acceptance/v0.4.2-cloud-hard-acceptance.md` 中“首次安全停止 → 维护者临时授权 exact-path 只读 Shell → C～F PASS”是真实版本验收时间线，应作为 immutable historical evidence 保留。
- `docs/history/phase-4.14-release-closeout-governance.md` 可以保留该事故如何推动稳定协议修正的历史理由。
- `docs/cloud-hard-acceptance-template.md` 当前已经把临时处置归一化为稳定协议：优先使用独立只读文件工具；缺少该能力时允许严格限定的 exact-path 只读 Shell preflight；正文写入仍只能使用 `apply_patch`。
- current tests 若继续强制匹配“临时授权”字样、事件顺序或某版本专用叙事，属于 snapshot/history coupling 候选；稳定测试应优先保护工具能力边界、只读约束、停止条件和禁止写操作。
- 是否移除这些具体断言尚未获授权，Phase 2 先完整盘点并提交建议。

### Current regression 第一轮盘点

初步命中集中在 `tests/repository-boundary.test.js`，需要按职责而不是按关键词机械删除：

| 命中 | 初步分类 | 理由/下一步 |
|---|---|---|
| stable template C段的“缺少独立文件工具时允许 exact-path 只读 Shell preflight”、Shell不得写、正文只用apply_patch | `KEEP` | 保护的是长期工具能力与写入安全边界，不是v0.4.2事故措辞。 |
| v0.4.2 acceptance 正文的“首次安全停止 → 临时授权 → D～F PASS” | 正文`KEEP`；current test候选`RETIRE/MIGRATE` | 真实历史应保留，但测试无需逐字锁定事故时间线；可由final PASS/稳定template边界分别证明。 |
| Phase 4.14 的“首次安全拒绝 → 临时授权 → exact path”直接自然语言断言 | history正文`KEEP`；current test候选`RETIRE/MIGRATE` | history负责解释协议为何变化；长期回归宜保护稳定anchor/结论/authority链接，而非事故措辞顺序。 |
| v0.4.2 acceptance 的“24个非活动planning RETIRE” | 数量断言候选`RETIRE` | `24`是一次C2 inventory结果，不是长期合同；需保留role-window closeout/final状态，但无需让current test冻结数量。 |
| v0.4.2 exact tag/source/ZIP/bootstrap、PASS markers与accepted/fallback身份 | `KEEP`（当前角色窗口） | 属于当前accepted版本与immutable publication identity，直到按角色窗口规则迁移到immutable ref。 |
| Phase 4.12/v0.4.1 P9历史证据 | 暂定`KEEP` | 这些是旧Release流程的真实历史，不等于恢复standing Phase 9；下一步核对断言是否只保护冷证据，还是仍把旧教程当current协议。 |
| `candidate === "v0.4.1"`及P9-A～F大段条件分支 | 高优先级残留候选 | 当前package已是v0.4.2，未来candidate不会回退到v0.4.1；需核对该分支是否不可达、是否另有immutable-history测试覆盖。 |

当前结论不是“版本号测试都删”：当前accepted身份、public package oracle与安全transition仍必须冻结；需要清理的是事故措辞、一次性数量和已经退出执行路径的旧candidate教程分支。

### 已确认的不可达 v0.4.1 candidate/P9 分支

- `change history, programme, provenance, and current acceptance keep separate lifecycle authorities`从`package.json.version`构造`candidate`，并读取`docs/acceptance/${candidate}-cloud-hard-acceptance.md`。
- 当前package/candidate是`v0.4.2`，ROADMAP角色为v0.4.2 accepted、v0.4.1 immediate fallback；未来正常列车只会使用新的candidate identity，不会让current package回退为v0.4.1。
- 该测试内两个`candidate === "v0.4.1"`分支仍保存完整P9-B～P9-F operator/evidence、旧命令、旧SHA、旧test count与旧stop marker断言，但在当前suite中全部跳过。
- v0.4.1 current acceptance已在C2清退；另一个独立测试已经通过exact immutable commit `3903326d…`验证v0.4.1 P9-F证据与provenance恢复入口，publication oracle继续验证v0.4.1 immediate fallback身份和恢复能力。
- 因此不可达大分支不再提供实际覆盖，也重复承担已由immutable evidence/oracle负责的历史身份；建议整体`RETIRE`，而不是迁移到新的candidate分支。
- 同一current CHANGELOG test里的`candidate === "v0.4.0"`和`candidate === "v0.4.1"`旧版本delta分支也已不可达；可以保留通用“current delta不得含Next Step/临时gate/hash流水账”的规则，把版本专用durable facts留给历史/provenance与相应能力测试。

### 明确保留的 v0.4.1 current dependencies

- `contracts.test.js`的accepted v0.4.1 predecessor transition shape仍是v0.4.2 installer兼容性输入，属于生产合同，`KEEP`。
- publication oracles对v0.4.1 immediate fallback的tag/source/assets与恢复路径仍服务当前角色窗口，`KEEP`。
- 这些真实运行/回退边界与不可达的旧P9教程自然语言断言不是同一类对象，不能因版本号相同一起删除。

### 其他已确认/高置信残留

1. **`release-package.test.js` 的 P9-B compatibility conditional — `RETIRE`。**
   - 通用逻辑已经规定：若candidate等于accepted，bootstrap zero hash会直接失败；非零hash还必须等于当前确定性ZIP SHA。
   - 后续仅在acceptance包含`P9-B local seal PASS`时再次验证非零hash、SHA、entries和size；v0.4.2 guide不使用P9-B，该分支当前不执行。
   - 稳定package/hash合同已有无版本条件的强断言，因此删除旧P9-B条件不会降低Release安全性。
2. **Phase 4.12 的全部21个旧`phase-9-v0-4-0-*` anchors及对应测试枚举 — 候选`RETIRE`。**
   - 初扫只从测试枚举识别6个post-status anchor；实施前从正文定义反向枚举后确认同类前缀共有21个，包含positioning、starting facts、decision、gates、inventory、verification、lifecycle、stop/successor及P9各pre/operator/post节点。
   - 全仓入链扫描显示21个anchor均没有真实文档入链；7个只被`tests/repository-boundary.test.js`自证，另外14个只存在于定义本身。没有README/ROADMAP/history index/provenance/current doc消费者。
   - Phase 4.12尾注明确把它们称为旧证据anchors/兼容别名；canonical `phase-4-12-v0-4-0-release-discovery`入口已由history index使用。
   - 按pre-1.0不为无入链兼容别名背负长期包袱的既定原则，可以删除别名和测试枚举；P9-A～F真实正文、时间线、结论和canonical history入口继续`KEEP`。
3. **Phase 4.14逐段自然语言回归 — 候选`MIGRATE`。**
   - 文件已经为各个post-governance status提供稳定显式anchors。
   - current test却大量按自然语言词序锁定每次写回，包括“临时授权”等事故措辞；建议收敛为canonical/history role、关键决策、稳定anchors和authority links，正文继续作为人读历史，不逐句成为machine contract。

### Phase 9关键词的非机械分类

- ROADMAP、稳定templates与治理指南中“普通Release不需要standing Phase 9/P9-A～F”的否定性规则是当前协议，`KEEP`。
- `docs/history/**`中早期“Phase 9是standing gate”等表述是当时真实决策，作为时间语义`KEEP`，不应用现行规则批量改写。
- 应清理的是current tests中的不可达旧P9执行分支和无入链兼容anchors，而不是删除历史正文里的P9词汇。

### 已确认的文档断链与current摘要过细

- `CHANGELOG.md` v0.4.1条目仍以相对链接引用`docs/v0.4.1-cloud-hard-acceptance.md`，但该current副本已在v0.4.2 C2获批清退；链接在当前checkout中失效。
- `BASELINE_PROVENANCE.md`及相关history已经使用exact immutable commit `3903326d…`的GitHub blob/anchor URL，证明恢复入口已存在。CHANGELOG应迁移到同一immutable目标，不恢复已退役current副本。
- 这是repository-governance-guide所要求的“删除与引用迁移原子闭合”漏项，建议列为高优先级`MIGRATE`。
- ROADMAP 4.1仍展开“维护者临时授权只读Shell”的事故细节。它目前位于已关闭v0.4.2列车摘要，不是错误事实，但与acceptance/Phase 4.14重复；后续可收窄为“Cloud暴露工具能力缺口，已归一化为exact-path只读preflight”并链接历史证据，避免programme authority长期复制事故过程。

精炼后的tracked Markdown相对链接审计（排除upstream Skill test fixture和模板占位符，并把目录视为合法目标）确认恰好两条真实missing target：

1. `CHANGELOG.md -> docs/v0.4.1-cloud-hard-acceptance.md`；应迁移到provenance登记的exact commit `3903326d…` URL/anchor。
2. `CHANGELOG.md -> docs/v0.3.4-cloud-hard-acceptance.md`；应迁移到provenance登记的exact commit `5d01b558…` URL。

所有现存本地file+fragment链接都能找到目标中的显式anchor（0 missing explicit anchors）。当前repository suite只断言治理指南包含“删除后复扫broken links/anchors”的文字，没有对tracked docs真正执行相对链接审计；这解释了完整suite全绿但CHANGELOG仍有断链。建议：

- 修复两条CHANGELOG链接，不恢复退役文件；
- 在repository-boundary增加一个小型、版本无关的local Markdown link/explicit-anchor审计，排除明确的upstream fixture和模板placeholder；
- 测试保护“所有current本地链接可解析”，不要硬编码这两条具体历史路径。

## Proposed Implementation Batches

### Batch A — 高置信最小治理（建议批准）

1. 从v0.4.2 current acceptance test删除两条“首次安全停止/临时授权/D～F”自然语言时间线断言；保留真实acceptance正文和stable template C段安全断言。
2. 把“24个非活动planning RETIRE”数量断言替换为final semantic status（`ROLE_WINDOW_CLOSEOUT_PASS / C2_COMPLETE`），保留closeout事实但不冻结inventory数量。
3. 删除`repository-boundary.test.js`中不可达的v0.4.0/v0.4.1 current CHANGELOG分支，以及约174行不可达v0.4.1 P9 operator/evidence分支；immutable P9-F test、provenance和publication oracle继续保留。
4. 删除`release-package.test.js`中已被通用exact-SHA规则覆盖的P9-B conditional。
5. 删除Phase 4.12全部21个无入链`phase-9-v0-4-0-*`兼容anchors、测试枚举及尾注的“继续保留兼容别名”表述；保留P9-A～F历史正文与canonical Phase 4.12入口。该完整范围是实施前校准结果，需维护者确认后执行。
6. 修复CHANGELOG的v0.3.4/v0.4.1两条missing local acceptance links，改指provenance已登记的exact immutable URLs。
7. 增加版本无关的tracked Markdown本地path/explicit-anchor完整性测试，排除upstream fixture和明确模板占位符。

该批次不改production/runtime/contracts/bootstrap/Release allowlist，不改v0.4.2 acceptance或Phase 4.14真实正文中的事故时间线。

### Batch B — 可选深度精简（需单独判断）

- Phase 4.14 repository test当前89行、约50次assert，逐段冻结自然语言与每次post-governance写回。建议收敛为：完整稳定anchors、核心三维职责、C0/C1/C2、两退役检查点、ROADMAP唯一authority links、history index入口和Release-excluded边界。
- 移除其中“临时授权”等事故措辞顺序及其他逐段实现细节断言；正文继续完整保留供人类和后续智能体回忆。
- ROADMAP 4.1把临时授权事故压缩为稳定结果+Phase 4.14/acceptance链接，避免programme摘要复制历史过程。

Batch B不会改变历史事实，但会显著降低自然语言改写导致的脆弱测试；由于涉及“history需要多强的current regression”这一治理取舍，建议与Batch A分开授权。

## Batch A Implementation Result

- 维护者确认后，Phase 4.12全部21个无入链`phase-9-v0-4-0-*`anchors原子清退；canonical Phase 4.12 anchor、P9-A～F标题/正文/结论全部保留。尾注改为明确“保留历史正文，不保留无入链兼容anchors”。
- v0.4.2 acceptance的current test不再逐字冻结临时授权时间线或`24个`inventory数量，改为验证`ROLE_WINDOW_CLOSEOUT_PASS / C2_COMPLETE / NEXT_TRAIN_UNAUTHORIZED`语义；acceptance正文未改。
- 删除current CHANGELOG test的不可达v0.4.0/v0.4.1分支，以及不可达v0.4.1 P9 operator/evidence分支175行；immutable P9-F test、v0.4.1 predecessor contract和publication/fallback oracles保持。
- release-package删除旧P9-B条件与随之无用的acceptance读取；通用accepted bootstrap非零/exact ZIP SHA规则保持。
- CHANGELOG两条退役local acceptance链接已迁到provenance登记的exact immutable commit URL。
- repository-boundary新增版本无关的tracked Markdown local path/explicit-anchor审计，排除`.planning`、upstream fixture和明确模板placeholder。
- 最终静态结果：changed paths与Release entries/external assets交集为0；legacy Phase 4.12 anchor definitions=0；CHANGELOG retired local links=0；dead candidate branches=0。
- 验证：focused 18/18 PASS；完整Windows suite 182 tests / 156 pass / 0 fail / 26 skipped，skip均为既有Linux/POSIX-only cases。

## Batch B Implementation Result

- Phase 4.14的current regression从89行收敛为57行，不再逐段冻结“临时授权”等事故叙事和每次post-governance写回；它现在只保护20个稳定显式anchors、Product/Release/retirement职责、C0/C1/C2、两个真实退役检查点、ROADMAP authority links、history index入口及Release-excluded边界。
- `docs/history/phase-4.14-release-closeout-governance.md`和`docs/acceptance/v0.4.2-cloud-hard-acceptance.md`正文均未修改，真实时间线仍完整保留。
- ROADMAP 4.1只投影稳定C步骤能力结论，并链接immutable v0.4.2 acceptance；不复制临时授权过程，也不新增第三条直达history的宏观入口。
- 首次focused测试23/24 PASS，唯一失败准确识别ROADMAP新增第三条history入口。撤回该入口、保留acceptance证据链接后复跑24/24 PASS，证明治理边界仍被实际保护。
- 完整Windows suite为182 tests / 156 pass / 0 fail / 26 skipped；最终静态审计确认5个changed paths（含三件planning账本）与Release entries交集0、20个Phase 4.14 anchors全部存在、Phase 4.14正文diff为0、ROADMAP history链接数仍为2。

## Phase 5 Attribution Decision

- 维护者明确决定Batch A/B归入v0.4.2，而不是另开v0.4.3或独立治理列车。准确时间语义是“v0.4.2 immutable Release完成后的post-C2仓库治理扫尾”：它属于该列车的文档生命周期，但不回写已经冻结的tag、ZIP或bootstrap字节。
- ROADMAP 4.1只需追加programme级摘要：Batch A/B解决的残留、保留的重要证据/运行边界，以及两个commit与22-entry Release allowlist交集为0的结论。
- Phase 4.14应追加详细历史段，记录Batch A commit `52f1fe7fcdafa698e4d716c7b3210f5186cd1fb1`与Batch B commit `11b4b45c9fb422311b88779cc827169b35d61e91`的RETIRE/KEEP边界、测试治理取舍和不触发重新发布的原因。
- 新段使用独立稳定anchor，但ROADMAP不增加第三条直达history链接；宏观历史入口仍保持README历史索引与ROADMAP既有两条programme理由。
- 最终验证：新段使Phase 4.14当前稳定anchor总数增至21；focused governance tests 24/24 PASS，完整Windows suite 182 tests / 156 pass / 0 fail / 26 skipped；6个changed paths与22-entry Release allowlist交集为0，ROADMAP history links仍为2。

## ROADMAP Phase 5 Documentation Governance Rotation

- 维护者授权把文档治理正式登记为Product Phase 5，原候选Product Phase 5～8顺延为6～9；这次改号必须连同anchors、跨文档链接和测试原子闭合。
- 已关闭v0.4.2 Release closeout不再作为第4节current train实体保留，其长期结论需要内化到第5节的`5.1.4`；但第4节仍保留“当前开发列车工作台”的通用规则、active planning以及candidate/accepted role-window等治理说明。
- 两个现存planning scope均明确`KEEP`，用于Phase 5文档治理与相邻Discovery恢复；pointer或programme轮转不产生删除授权。
- 当前需进一步核对：`5.1.4`在既有层级中位于“5.1 Phase 4已采纳路线”之下，因此迁移时必须用标题和正文清楚区分“v0.4.2/Phase 4长期closeout结论”与新Product Phase 5身份，避免层级语义混淆。
- 引用inventory确认：current ROADMAP只有`product-phase-4` canonical anchor，候选Phase 5～8表格尚无独立anchors；新增文档治理应建立`product-phase-5`，顺延候选6～9可继续留在路线表，等实际closeout时再建立各自canonical小节。
- `v0-4-2-release-closeout`当前只有Phase 4.14历史链接和current-role测试消费；anchor应随正文迁到`5.1.4`，保持旧链接可解析，但Phase 4.14原始“当时current train”措辞不批量改写。
- 大量Phase 4.1/4.2等冻结history records仍使用旧Phase 5～8编号，这些是当时真实programme时间语义，不能跟current ROADMAP机械顺延；现有历史测试也明确保护这些旧说法。
- ROADMAP顶层programme表与current-role helpers目前要求“当前开发列车”必须是可解析`vX.Y.Z`；要表达空列车，需要选择机器可解析的显式空值，并同步repository/architecture tests，不能只删除表格行或写自然语言空白。
- 采用显式空值`NONE`表示当前没有获批development train；accepted/fallback仍保持`v0.4.2`/`v0.4.1`，package identity仍可由Release/package tests独立解析，不把accepted误当活动开发列车。
- 为同时满足`5.1.4`与Phase-level authority，将`5.1`标题校准为“Phase 4～5已采纳路线”：`product-phase-4`继续覆盖5.1.1～5.1.3，新增`product-phase-5`紧邻5.1.4；`v0-4-2-release-closeout`随完整closeout正文迁入5.1.4以保持旧深链接可解析。
- 新Phase 5使用已经完成的`0.4.2`documentation-governance列车；原compaction/tool/advisory/hard-gating候选工作的version series保持`0.5.0-*`～`0.8.0-*`，只把Product Phase编号顺延为6～9，并相应改写它们之间的Phase引用。
- repository governance补充列车间空窗合同：旧列车关闭且下一列车未授权时，第4节保留通用工作台、角色表写`NONE`、旧exact train anchor退场；planning可由维护者决定`KEEP`，但不等于列车激活。
- 最终迁移验证：focused governance 24/24 PASS；完整Windows suite 182 tests / 156 pass / 0 fail / 26 skipped。Release allowlist交集保持0，旧`v0-4-2-release-closeout`和新`product-phase-5`各只有一个定义，ROADMAP history入口仍为2。

### Maintainer correction after initial rotation

- 上一轮把v0.4.2 documentation-governance列车提升为Product Phase 5属于归属错误。v0.4.2仍是Product Phase 4的后续治理/Release closeout，因此其长期摘要正确位置是`5.1.4`，标题必须明确Phase 4，不能占用`product-phase-5`。
- Product Phase 5是另一轮“其他文档治理”，目前只处于programme planning；应建立独立`5.2`与`product-phase-5`精简摘要，但不得宣称complete、不得绑定已经发布的0.4.2，也不应在未Discovery前猜定版本列车。候选版本使用`TBD`。
- history中的Phase records本质是过程流水账与历史理由；ROADMAP第5节才是每个Product Phase的精简长期摘要。第4节current-workbench不复制流水账，只保留通用规则和一个指向相关Phase摘要的链接。
- 原compaction/tool/advisory/hard-gating继续顺延为Product Phase 6～9并保持原`0.5.0-*`～`0.8.0-*`候选版本系列；这部分不受归属纠正影响。
- 静态审计确认纠正后没有双重authority：第4节只有一个Phase 5摘要链接；`product-phase-5`和`v0-4-2-release-closeout`各自只有一个定义；旧归属措辞在ROADMAP中为0。历史Phase files未参与本次纠正，继续保留真实过程语义。
- 最终验证确认本轮完全处于repository-governance zone：6条修改路径与Release allowlist交集为0；完整Windows suite 182 tests / 156 pass / 0 fail / 26 skipped。两个planning scope及active pointer均保持不变。

## Technical Decisions

| Decision | Rationale |
|---|---|
| planning 数量不是安全不变量 | 安全边界是 active pointer 唯一、scope 路径合法、inactive 只有三件套；目录数量属于维护者治理节奏。 |
| C2 清退事实留在 acceptance/history/Git | current regression 不应让一次版本 closeout 快照支配所有后续 Discovery。 |
| 历史叙事和稳定协议分层测试 | 既不抹掉真实验收过程，也避免长期测试依赖事故措辞和自然语言词序。 |
| ROADMAP不为每次历史理由新增直达history入口 | programme authority只保留必要且已治理的两条历史证据入口；版本事故的精确证据优先链接immutable acceptance，完整Phase叙事继续经受控历史索引恢复。 |

## Issues Encountered

| Issue | Resolution |
|---|---|
| 新建 scope 会触发 8 月 24 日新增的唯一-scope断言 | 追溯确认是 C2 快照过度泛化；维护者明确授权删除该要求并保留旧 scope。 |

## Resources

- `docs/repository-governance-guide.md#planning-lifecycle`
- `tests/repository-boundary.test.js`
- `tests/f3-lifecycle-helpers.js`
- commit `33deb5870015c94df329fe233e306363ba43232b`
- `docs/acceptance/v0.4.2-cloud-hard-acceptance.md`
- `docs/cloud-hard-acceptance-template.md`
- `docs/history/phase-4.14-release-closeout-governance.md`
