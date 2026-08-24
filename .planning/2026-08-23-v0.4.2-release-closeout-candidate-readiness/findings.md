# Findings: v0.4.2 Release closeout / candidate-readiness

## Starting boundary

- 普通 Release 直接进入版本无关 closeout workflow；不创建 standing Phase 9，不复制 P9-A～F。
- 两个 retirement checkpoint 是同一 Release workflow 的入口/出口对象治理，不增加 Cloud 通道。
- 本轮只推进到 C0 前的本地候选准备和 Source/Candidate 教程；远端与 Cloud 动作仍由维护者负责。

## Authority recovery

- README/ARCHITECTURE确认当前稳定 product、trusted graph、installer path-safety与Release字节顺序不需因文档治理改变。
- DESIGN把Release operator guide、双通道模板、package/contract/bootstrap边界及相应验证路由列为本任务的直接落点。
- ROADMAP明确第9节是版本无关Release章节：普通Release不建standing Phase 9；Source/Candidate前只做非破坏性candidate admission preflight，两轮真实retirement review分别在Source/Candidate PASS后与Latest/postflight后闭合。
- 当前候选只应产生文档治理delta与Release身份/升级前驱事务，不应修改install、adapter或runtime行为。

## Candidate identity transaction

- 当前`package.json`与Release artifact仍是`0.4.1`，external asset仍是`init-cloud-sandbox-v0.4.1.bash`；v0.4.2候选需把三者同步到`0.4.2`。
- `installed-state-transition-v1`当前只接受exact v0.4.0 predecessor。v0.4.2必须改为exact v0.4.1 predecessor；installed manifest schema仍是3，12-file installed inventory与runtime hashes因v0.4.1只修改installer path safety而保持不变。
- release artifact与transition contract字节变化后，必须同步`upstream-manifest.json`中的两个SHA；runtime bundle/importer/source pin不变。
- v0.4.2 bootstrap是v0.4.1脚本的身份轮转副本：版本改为v0.4.2，Source/Candidate阶段SHA必须为64位zero hash；其余稳定安装逻辑不变。

## Candidate-readiness inventory

- 当前共有25个planning scopes：1个active、24个non-active。除`tests/repository-boundary.test.js`仍直接读取v0.4.1 Phase-9 planning外，non-active scope没有current外部入链。
- v0.4.1 Phase-9 planning的长期P9-F结论已经存在于v0.4.1 acceptance；测试依赖应先迁移到acceptance，再决定账本退役。
- v0.4.2 documentation-governance相关completed scopes仍解释本列车的施工与恢复位置，适合KEEP到C2 role-window closeout再复核；更早v0.4.0/v0.4.1与初始source-analysis scopes具备Git恢复且已由history/acceptance接管，是Source/Candidate PASS后第一轮review的RETIRE候选。
- 治理指南规定completed scope的实际删除必须由维护者在单独评审中明确决定；C1/C2分别保存第一、第二轮真实检查结论，但任何检查点都不能把`RETIRE`建议解释为自动删除授权。
- 维护者进一步澄清这不是v0.4.2特例：ROADMAP的两轮retirement checkpoint必须直接路由到治理指南，并长期冻结“检查点只列清单/建议，planning删除仍需维护者明确决定”。

## Local candidate evidence

- 完整Windows suite：180 tests / 154 pass / 0 fail / 26 skipped；26项均为既有Linux/POSIX-only case，不能替代Cloud零skip。
- exact v0.4.1 predecessor publication oracle全绿，包括forward migration、tampered-state写前拒绝、owned uninstall与accepted/fallback恢复。
- deterministic双构建：22 entries、85,912 bytes、SHA-256 `4a059fa512a2c144cef42478d217935825ee7aca0599dca5582c62dd12df415c`，两份字节身份一致。该hash只属于当前本地zero-hash candidate，不是sealed/public asset identity。
- importer check、Python compile、`node --check install.js`、两份bootstrap Bash syntax、manifest contract hash、bootstrap identity-only delta与`git diff --check`全部PASS。
- 相对v0.4.1，install.js、hooks、runtime、runtime bundle和tools仍为零delta；Release输入变化只限package identity、Release/transition contracts、manifest integrity references和新bootstrap。

## Release workflow authority convergence

- ROADMAP已有`release-four-step-flow`与`version-train-two-retirement-reviews`稳定anchors，但当前没有其他文档链接这两个入口；模板、治理指南、v0.4.2实例和Phase 4.14历史记录都重复了部分流程。
- 当前存在两处真实顺序漂移：ROADMAP宏观流把Pre-release放在C1前，而v0.4.2 guide与Operator Guide模板要求先写C1再等待publication；ROADMAP示例把第二retirement checkpoint放在C2后，但C2定义又要求保存该检查点。
- 先前收敛曾把第一检查点放在C0前；维护者随后进一步批准post-PASS顺序：candidate baseline →只读candidate admission preflight→C0→Source/Candidate PASS→第一真实检查点→C1写回/push→tag精确指向C0并publication→Published Release PASS→Latest/postflight→第二检查点→C2 final closeout。
- 其他文档只保留职责内细节：Cloud模板管执行协议，Operator Guide模板管状态容器，治理指南管对象/planning生命周期，版本guide管exact实例，Phase history管当时设计理由；current programme顺序一律链接ROADMAP。

## Post-PASS retirement ordering

- 维护者确认两轮真实retirement review都必须位于对应验收PASS之后：第一轮在Source/Candidate PASS后、C1前；第二轮在Published Release PASS和Latest/postflight后、C2前。
- 验收前仍保留`candidate admission preflight`，但它只做inventory、分类、恢复证据和风险检查；候选形成所需迁移必须在C0前闭合，preflight本身不删除planning、恢复材料或回滚线索。
- 设计理由是让失败现场保持完整：Source/Candidate失败时不因提前清退增加排错/回滚成本；C1/C2分别保存已真实发生的一、二轮退役结论，不写未来承诺。
- 第一轮PASS后的清退只适用于Release-excluded planning、临时教程和脚手架，且planning删除仍需维护者明确决定。若拟清退对象改变package、contract、runtime、bootstrap、ZIP allowlist或其他C0 Release输入，必须fail closed，形成新C0并重跑Source/Candidate。

## README manual Release handoff

- 维护者要求暂停Source/Candidate，先把可复制的本地ZIP build/check/hash与GitHub手工上传准备写入根README。
- 当前bootstrap的`HOOKS_PACKAGE`由`HOOKS_VERSION`派生为`pwf-codex-cloud-hooks-${HOOKS_VERSION}.zip`，`HOOKS_URL`再由repo、version和package派生；标准tag/asset命名不变时，seal默认值只需写入`HOOKS_VERSION`与exact `HOOKS_SHA256`。
- `pwf-codex-cloud-hooks-candidate.zip`适合作为本地中间文件；GitHub正式资产必须按bootstrap默认合同改名/构建为`pwf-codex-cloud-hooks-vX.Y.Z.zip`，否则必须显式改写`HOOKS_PACKAGE`或`HOOKS_URL`，不属于默认发布路线。
- 工作树恢复时存在用户未跟踪`test.zip`；本任务只读保留，不纳入暂存、Release资产或删除范围。
- Release allowlist交叉检查确认`README.md`本身是22-entry ZIP输入，因此本次说明不是Release-excluded治理改动。Source/Candidate尚未运行，允许现在改；但旧本地candidate ZIP/SHA与先前C0都必须作废，完成后重新双构建/check并形成新C0。
- README更新后的本地双构建一致：22 entries、87,152 bytes、SHA-256 `f90dd556477a166cbe0faade8cab1b36976729b847a84e7591e0dba3a0caf709`；先前85,912-byte/`4a059f…`身份已被本次Release-input变化取代，不得再用于Source/Candidate。
- 维护者指出当前README在首次提到C0与Source/Candidate时直接给出作废/重验警告，而术语定义和ROADMAP流程链接要到约60行后才出现；新人无法先理解“为什么”。本轮应把简短定义和authority链接提前，再保留原fail-closed结论。
- 最终README先用三条大白话定义C0、Source/Candidate与Release-excluded，再给出唯一ROADMAP流程入口和README-as-ZIP-input警告；后文仅承接“上文链接”，避免在同一authority文档重复同一跨文档fragment。
- 最终候选双构建/check逐字一致：22 entries、87,386 bytes、SHA-256 `d1547ab50afcc3a275592d41b60daa77ab1062c97c072be3661cfe763467264e`。该身份取代此前`f90dd5…`及改写期间所有临时候选，只供新的C0/Source-Candidate使用。

## README governance status synchronization

- ROADMAP 4.1是current train工作台，适合写“README进入候选、旧本地身份失效、Cloud仍PENDING”，但不应复制逐次命令或建立第二份exact证据表。
- Phase 4.14是回顾性治理摘要，适合追加独立post-governance status，解释为什么手工交接说明最终必须进入根README、为什么新人术语必须先于fail-closed警告，以及这次README-as-ZIP-input如何触发重新双构建。
- `ROADMAP.md`、`docs/history/*`、`.planning/*`和`tests/*`均在Release contract excluded prefixes内；本轮同步不会再次改变87,386-byte候选ZIP，但新的Git commit会成为待验收的更新C0 source HEAD。
- ROADMAP 4.1现已记录README手工交接、新人术语顺序、旧候选身份失效与Cloud仍PENDING；没有把exact SHA或逐命令提升成programme authority。
- Phase 4.14新增稳定`phase-4-14-post-governance-status-readme-release-handoff`锚点，保存README-as-ZIP-input的原因、本地`d1547a…`快照及“不是Cloud/sealed/public evidence”的边界。

## Persistent maintenance environment memory

- 当前唯一持久记录在`AGENTS.md`：2026-08-22确认`wsl.exe`存在但无发行版，Docker/Podman/nerdctl不存在，Git Bash不能充当Linux/POSIX证据；planning一旦清退不会影响这条规则，但AGENTS不适合继续扩张成环境流水账。
- 更稳妥的结构是新增`docs/maintenance-environment-profile.md`作为机器特定、带日期的执行环境档案：每条限制同时登记observed fact、验证时间/方式、影响、默认解决方案与重验触发器；它不是Host ABI、产品支持合同或永久硬件事实。
- AGENTS保留强制入口与默认行为，具体事实链接新档案；README现已通过文档地图把“新维护者避坑与能力检测”路由到`MAINTAINER_HANDOFF.md`，因此由handoff再链接环境档案即可形成面向人的可发现链，无需再次修改Release ZIP输入README。
- 当前仓库除AGENTS外没有维护机限制副本；新文档应被repository-boundary断言为required lifecycle document、Release-excluded，并要求AGENTS/handoff双入口和“已确认事实不得只写planning”的提升规则。
- `repositoryPaths()`同时枚举tracked与未忽略untracked文件，因此新环境档案可在暂存前接受repository inventory测试；不需要为了测试提前写Git index。
- `MAINTAINER_HANDOFF.md`已经承担“平台限制/能力检测结果分流”，适合作为人类间接入口；其稳定定位仍不保存版本、SHA或命令流水，只把已知环境限制导向新档案。
- 最终结构形成单一事实权威：`docs/maintenance-environment-profile.md`保存机器事实和解决方案；AGENTS强制读取/提升；handoff负责人的发现；治理指南拥有跨阶段提升与隐私/重验规则。README继续只指向handoff，因此没有新增孤岛，也没有改变ZIP输入。
- 环境档案把2026-08-22事实标为`CONFIRMED`/`CONFIRMED_BOUNDARY`，并明确只有维护者说明变化、实际信号冲突、有界安装授权或新primitive需求才重验；这避免旧事实永久化，也避免每轮无意义复查。

## Maintenance environment status synchronization

- ROADMAP 4.1应只记录当前列车完成了“环境事实从planning/AGENTS内联摘要提升为持久profile”的治理交付、其Release-excluded属性与Cloud仍PENDING；具体WSL/container事实继续只读profile。
- Phase 4.14适合新增一个post-governance status，保存设计原因：planning会退役，AGENTS不应膨胀成事实流水账，环境限制又必须带日期、影响、解决方案和重验触发器跨阶段存活。
- 当前分支比origin ahead 1，仅包含环境档案落地commit；本次状态同步将产生新的exact source C0，但ROADMAP/history/tests/planning均被Release artifact排除，不改变候选ZIP字节。
- ROADMAP 4.1最终只链接profile并概括AGENTS/handoff/governance三方职责；WSL、容器和Git Bash事实没有被复制到programme authority。
- Phase 4.14新增稳定`phase-4-14-post-governance-status-maintenance-environment-memory`锚点，记录planning清退风险、AGENTS膨胀风险、重验触发器和“不是永久Host/Product合同”的原因。

## Documentation topology migration preflight

- 维护者批准在Source/Candidate前执行一次有界文档拓扑探路；它是现有`v0.4.2`documentation governance列车的migration preflight，不是新增Product Phase、正式Discovery Round、Phase 9或独立Cloud验收。
- 探路先区分“全局入口”和“专项唯一authority”：文档是否权威不由路径深度决定。README文档地图仍是面向人的全局路由，AGENTS仍是智能体执行入口；`docs/repository-governance-guide.md`可以继续作为仓库生命周期治理领域的专项唯一authority。
- 本gate只盘点分类、入链、测试与Release影响并提出原子迁移方案；未取得维护者对目标拓扑的确认前不移动文件。Source/Candidate保持`PENDING`，最终必须绑定迁移完成后的exact C0。
- tracked根Markdown共9份：README、AGENTS、ARCHITECTURE、DESIGN、ROADMAP、CHANGELOG、BASELINE_PROVENANCE、MAINTAINER_HANDOFF与THIRD_PARTY_NOTICES；它们分别承担全局入口、智能体入口、跨领域current authority、版本/身份账或法律发现面，不应仅为视觉整齐整体下沉到`docs/`。
- `docs/`顶层当前混放8份专项文档：2份当前角色窗口acceptance、3份template、1份repository governance authority、1份维护环境profile和1份Git mode说明；`docs/history/`已经是职责清晰的独立warm-history分区。
- 当前路径迁移成本真实存在：ROADMAP、BASELINE_PROVENANCE、CHANGELOG、README、AGENTS、DESIGN、MAINTAINER_HANDOFF及acceptance/template之间均有current入链；`architecture-contracts.test.js`、`repository-boundary.test.js`和`release-package.test.js`还直接读取旧路径或按`docs/vX.Y.Z-cloud-hard-acceptance.md`模式派生角色窗口。
- acceptance保留语义必须继续是candidate + accepted role window，而不是“只留最新一份”：当前`v0.4.1`与`v0.4.2`分别由ROADMAP/provenance/changelog和测试精确引用。迁入子目录时必须同步路径派生规则，不能只移动两个文件。
- `docs/`整体已被Release contract作为excluded prefix治理；但是否修改根级Release输入仍需继续核对。即使ZIP字节不变，迁移后的exact source commit也必须成为新的C0，不能沿用迁移前HEAD。
- Release artifact精确核对：22项allowlist中只有`README.md`和`THIRD_PARTY_NOTICES.md`是Markdown；`docs/`、`.planning/`和`tests/`均按prefix排除，其他根级治理/架构文档也不在exact allowlist。因此“根级入口”“Release ZIP输入”是两个独立维度，不能用目录位置推断package字节影响。
- 当前8份`docs/`顶层专项文档中，除`git-file-modes.md`外均已有根级或模板级稳定显式anchor；迁移应保持这些anchor不变，只原子改路径。`git-file-modes.md`是否补稳定anchor属于独立内容改进，不应夹带为移动文件的必要条件。
- 根文档也不是统一技术形态：README/THIRD_PARTY_NOTICES同时面向发布包，AGENTS/ROADMAP/ARCHITECTURE/DESIGN等承担仓库入口或current authority，CHANGELOG/PROVENANCE保存版本与身份账。目标拓扑应按受众和职责保留这些根级发现面，不做“所有Markdown归档到docs”的机械整理。
- README已经冻结自己为面向人的唯一“问题→authority”全局路由；治理指南同时冻结Hot/Warm/Cold、exact/lifecycle zones、candidate+accepted角色窗口和retirement link transaction。缺口不是再建一份authority map，而是为现有职责增加可执行的目录放置合同。
- current可见入链显示迁移必须成组：governance guide由README、ROADMAP、MAINTAINER_HANDOFF、环境profile、operator template、v0.4.2 acceptance、history与tests共同引用；Cloud template又被ROADMAP、DESIGN、CHANGELOG、governance、operator template、两份acceptance与tests引用。逐个搬文件会制造中间断链和重复路径兼容层。
- 对8个候选移动文件的非hidden扫描未发现`.planning`引用，但`rg`默认不搜索hidden目录；完整migration inventory仍须用`--hidden --glob '!.git/**'`复核，不能把本次零计数当作planning无入链的最终证据。
- 当前规范要求已发布/已冻结guide保留原名和时间语义；目录迁移可以保留basename与stable anchors，只改变current source路径。是否允许移动已冻结`v0.4.1`acceptance必须同时核对其immutable tag恢复链和当前accepted角色职责，不能把“保留原名”误解为“路径永久不变”。
- `--hidden`完整扫描为8个候选文件发现20个planning文件入链：v0.4.1 acceptance 3、v0.4.2 acceptance 1、Cloud template 5、Operator template 3、history template 1、governance guide 5、environment profile 1、Git mode 1。活动planning中的current路径必须更新；已关闭planning应按历史文字/current可执行引用分类，不应为路径整齐批量重写冻结施工账。
- `v0.4.1` tag可读取`docs/v0.4.1-cloud-hard-acceptance.md`，但当前分支相对tag为694行新增/6行删除，符合tag绑定C0而后续C1/C2回补完整验收状态的历史。结论：tag提供早期source快照，但当前accepted acceptance的完整closeout证据不能机械降级为tag内同路径副本；移动时应保持当前文件字节与anchors，并让最终closeout ref/当前角色入口继续可达。
- repository tests当前把角色窗口路径编码为`docs/${version}-cloud-hard-acceptance.md`，同时验证candidate acceptance到ROADMAP的`../ROADMAP.md`相对链接。迁到`docs/acceptance/`后必须同步为新派生路径，并把相对链接提升为`../../ROADMAP.md`；这是路径合同变化，不是验收内容变化。
- 专项正文复核后，推荐从最初的五分区设想收窄为“两个新增子目录 + 三个docs根级singleton”：`acceptance/`有candidate+accepted角色窗口和独立rotation/retirement生命周期；`templates/`有三份版本无关写作/执行骨架；`history/`已稳定存在。三者都有明确的同类集合与生命周期收益。
- 暂不新建`docs/governance/`：repository governance guide虽是专项唯一authority，但当前只有一份，README已经提供全局路由；移动它会改9个current文件、5个planning引用，却不会改变authority语义或retention策略。
- 暂不新建`docs/operations/`：maintenance environment profile是带日期、可更新的机器事实authority，Git file mode文档是稳定仓库修复教程，两者受众与更新纪律并不相同；仅因都“与维护有关”而放入同一目录会制造模糊分类。
- 建议目标树为：`docs/acceptance/{README.md,v0.4.1...,v0.4.2...}`、`docs/templates/{cloud-hard...,cloud-acceptance...,phase-history...}`、既有`docs/history/`，并让`repository-governance-guide.md`、`maintenance-environment-profile.md`、`git-file-modes.md`继续位于`docs/`根。目录README只解释角色由ROADMAP派生、旧证据从immutable refs恢复和清退链接治理指南，不复制当前版本号或状态表。
- 当前没有通用Markdown broken-link checker；`npm test`只运行Node contracts。正式迁移验证必须组合：旧路径/旧相对链接反向`rg`、新路径正向存在性与anchor检查、focused architecture/repository/release-package tests、完整suite、Release allowlist交叉检查与`git diff --check`。
- 冻结边界改变了迁移建议：`v0.4.1` acceptance已经完成Source/Candidate、publication、Published Release、Latest与P9-F closeout，AGENTS和治理指南明确已发布acceptance不可变；该文件还含两条让Cloud直接读取`docs/cloud-hard-acceptance-template.md`的字面执行指令。现在移动模板会让当前accepted教程断链，回写旧acceptance又违反冻结纪律，保留旧模板副本则制造双authority。
- 因此本轮不应创建`docs/templates/`，三份template继续留在`docs/`稳定路径。这个决定不是否定分类，而是承认模板路径已经成为冻结guide的输入合同；未来若要移动，必须有单独的兼容/immutable-link迁移设计，不能夹带进v0.4.2 closeout。
- acceptance目录可以采用角色安全的分阶段迁移：当前未冻结的`v0.4.2` candidate移入`docs/acceptance/`并更新自身相对链接；已冻结的`v0.4.1` accepted继续原路径KEEP。v0.4.2通过Published Release并晋级accepted后，v0.4.1退出candidate+accepted窗口，在第二retirement checkpoint按既有规则迁到exact immutable closeout链接并从current tree退役；届时current acceptance自然全部位于新目录。
- 该过渡期不是永久双规范：`docs/acceptance/README.md`只声明“新建/未冻结guide进入本目录、冻结accepted保留原位直到角色退出、当前角色只读ROADMAP、旧证据读immutable refs”，并给旧根路径设置owner=`v0.4.1 accepted role`、退出点=`v0.4.2 C2 role-window closeout`。
- 若维护者批准实施，第一事务建议仅包含：新增acceptance目录说明、移动v0.4.2 candidate、更新CHANGELOG/current links和candidate自身相对链接、调整lifecycle tests/role-path派生、把稳定目录合同写入治理指南，并在ROADMAP 4.1/Phase 4.14记录preflight结论。README是否把泛`docs/`入口收窄到`docs/acceptance/`会改变ZIP字节，应由维护者单独选择；不改README也不妨碍通过CHANGELOG/ROADMAP发现candidate guide。
