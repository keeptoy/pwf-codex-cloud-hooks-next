# Findings: v0.4.2-dev document governance discovery

## User thesis

- 一个Product Phase若只有一轮Discovery，原则上只需要一轮与该实现边界匹配的黑盒验收。
- 一个Product Phase若包含多轮Discovery/实现推进，则需要多轮对应验收；多gate模板最初是为多Discovery版本提供可复用验收能力，不应被理解为每个简单版本都机械重复全部历史gate。
- v0.4.0的`v0.4.0-dev-f3b3-autonomous-live-operator-guide`、`v0.4.0-dev-f3-cloud-lifecycle-runbook`等材料是关键历史样本。
- 维护者已把v0.3.4、v0.3.5、v0.4.0 acceptance作为未跟踪文件补回，供本轮回顾；是否重新纳入仓库尚未决定。

## Maintainer clarification — tutorial and evidence are one lifecycle document

- 三个补回acceptance只作为历史参考和规范设计输入，不是恢复current-tree authority的提议。
- `runbook`与`operator-guide`在实际职责上都是验收教程：冻结执行顺序、输入、停止条件和回传要求，并在真实执行后追加`Post-run status`；未来可以统一命名为`operator-guide`。
- 同一文件从pre-run pending演化为post-run evidence后冻结，不必为了“教程”和“证据”再造两份文档。
- `version acceptance`可理解为single-Discovery版本的简化验收教程/结果文件；multi-Discovery版本则按每轮独立风险建立多份operator guide，而不是把所有Round继续累加到一个巨型version acceptance。

## Entry facts

- 本地`0.4.1`在入场时与`origin/0.4.1`同步，P9-F commit已发布。
- 已从该HEAD创建本地`0.4.2`分支；没有创建远端branch或执行push。
- 三个恢复文件保持untracked：`docs/v0.3.4-cloud-hard-acceptance.md`、`docs/v0.3.5-cloud-hard-acceptance.md`、`docs/v0.4.0-cloud-hard-acceptance.md`。
- 旧active plan是已关闭的v0.4.1 Phase 9账本；本Discovery建立独立plan并接管active pointer。

## Initial hypothesis

- 建议把“验收轮次”绑定到独立的Discovery→implementation risk delta，而不是仅绑定版本号，也不是绑定模板中出现了多少gate标题。
- 通用模板更适合作为验收原语库和阶段路由；version/phase acceptance负责选择本轮实际需要的子集、冻结exact source并保存结果。
- 纯文档治理若不改变可执行教程、脚本、Release下载链或操作权限，通常只需本地治理验证；若改写Cloud operator/runbook的可执行步骤，则至少需要脚本静态解析，是否需要真实Cloud取决于是否改变执行语义。

## README / architecture evidence

- README明确把版本acceptance定义为“某次迁移、Cloud或Release如何被验收”的专项证据；它不是稳定产品行为authority，版本号/本地构建也不能单独证明Release成立。
- README同时说明activation文件、本地probe或consumer代码只能证明格式/admission，不能单独证明某版本完成Cloud lifecycle或Release验收；因此验收轮次必须对应真实新增的lifecycle/risk claim，而不是文档数量。
- ARCHITECTURE把F3B2 smart lifecycle、F3B3 autonomous lifecycle与F3C rollback列为三组不同的真实Cloud证据：它们分别扩大profile、状态机和跨candidate恢复claim。v0.4.0之所以多轮验收，根因是多次Discovery后trusted behavior/rollback claim逐步扩大，不是因为同一个phase名字天然要求多跑。
- 架构对路线切换的标准是：改变upstream invocation、trusted graph、兼容层退休、contracts、Release boundary或rollback时必须重新Discovery并取得Linux/Cloud evidence。反过来，纯authority去重或历史归档若不改变这些事实，不应机械制造新的Cloud黑盒轮次。
- 当前稳定Release不变量要求已发布acceptance不可原位改写，但“不可原位改写”并不等于所有历史acceptance必须永久留在current tree；可以由immutable commit/blob索引恢复，前提是文档地图与长期链接合同清晰。

## DESIGN / ROADMAP evidence

- DESIGN已经把`cloud-hard-acceptance-template.md`定义成“版本中立的双通道Cloud执行协议与三层文档分工”，并明确纯文档路由只需focused governance、链接/anchor、fence、inventory和`git diff --check`；只有文档进入ZIP或改变更高风险边界时才扩大验证。
- ROADMAP 7.2已经给出与维护者核心想法高度一致的正式规则：架构/契约/Phase/trust/Release/rollback变化才增加独立Discovery Round；同一方案的安全拆分使用Round内子门槛；普通测试补漏、文档同步和已冻结方案内局部修复不新增探路轮。
- 因而治理模型最好不是新造规则，而是把现有“Discovery Round粒度”明确映射到“Cloud acceptance round粒度”：每个产生新Cloud claim的正式Round完成后有一次对应黑盒验收；Round内子门槛可共享/递增同一轮证据，不机械生成独立全套Cloud task。
- ROADMAP的标准晋级链列出no-live Cloud、activation、Fresh/UserPrompt/Resume/doctor、seal、publication等独立gate。这说明“每Round一轮黑盒”仍需按风险选择黑盒类型，不能把Source/Candidate、Published Release和Latest promotion混成一次；Release四步属于每条发布列车的standing Release protocol，不是Product Discovery轮次数量。
- v0.4.2若只修改文档authority、模板路由和治理测试，不改变可执行脚本语义、Release inputs或programme事实，符合`0.x.y` patch治理范围；但它不应被描述成新的Product Phase，也不需要为了版本号本身跑一轮产品Cloud黑盒。
- 如果v0.4.2改写Cloud operator中真正执行的命令/状态机，则不再是纯文档排版：需按影响补静态脚本验证，若改变observable lifecycle或新增claim，还要用对应Cloud round验证。版本标签“文档治理”不能豁免执行语义风险。

## Template / F3 runbook evidence

- 通用template开头已经明确：多gate开发版本可维护gate状态表；只有一次整体验收的版本可以省略状态表，直接保存最终证据。这正是“模板支持多Discovery，但不强迫简单版本伪装成多gate”的原始设计。
- template的B～E黑盒是稳定observable lifecycle协议，4.1/9.1与4.2/9.2分别承担Source/Candidate和Published Release通道；它们是Release双通道原语，不等同于Product Phase内部每个Discovery都必须完整重复两条发布通道。
- `v0.4.0-dev-f3-cloud-lifecycle-runbook`不是另一份通用Cloud acceptance，而是Phase 4 F3的版本化Git-backed状态机协议：F3B1只物化protocol/no-live dry run，F3B2 smart、F3B3 autonomous、F3B4汇总、F3C rollback分别授权。
- 该runbook把smart与autonomous分成隔离DAG，并明确F3B4只汇总已独立PASS记录、不补跑缺失阶段。这证明“多轮验收”的单位是独立风险/状态机claim；aggregate gate本身通常不应再机械跑一次同样黑盒。
- runbook与template职责互补：template冻结稳定Cloud lifecycle观察方法，runbook冻结本Phase特有的prepare/activate/disarm/tamper/rollback状态机和evidence schema。版本acceptance只应保存每个已授权round的增量与最终事实，不复制两者全文。

## Operator-guide / acceptance-shape evidence

- F3B3 operator guide是一份“操作者无需拼接其他文档”的自包含执行手册，覆盖六个隔离Cloud task、exact refs、tamper和两次mandatory Resume；它后来又追加post-run PASS事实。它之所以合理地长，是该Discovery round本身包含复杂状态DAG和多task风险矩阵，不是通用acceptance的默认形状。
- acceptance体量对比很说明问题：v0.3.4为139行、单一版本增量+Source/Candidate+Published+promotion；v0.3.5为39行；v0.4.0为1288行，累积F1B/F2A/F2B/F3A/F3B1/B2/B3/B4/F3C1/C2/C3/C4与P9；v0.4.1虽然只是单一path-safety Discovery/patch，仍达到998行，主要因为把P9-B～P9-E operator步骤和dev运行单继续内嵌在version acceptance。
- 这表明目前真正需要治理的不是“是否允许多gate”，而是两个轴被混在一个文件：Product Discovery rounds的证据账本，以及standing Release P9的施工operator。v0.4.0多round需要多条证据是合理的；v0.4.1单round仍复制大量Release operator则是职责膨胀。
- 一个更清晰的目标形态应允许：single-round版本只有一段Discovery/Source-Candidate增量证据，再追加固定Release通道结果；multi-round版本维护多round状态索引和逐round增量证据。P9发布步骤仍可发生多gate，但operator施工态留在活动Release plan/通用模板，version acceptance只保存完成结果。

## Restored compact acceptance evidence

- v0.3.4是较好的single-round最终形态样本：只写版本增量、Source/Candidate结果、Published Release结果、最终结论和Latest postflight；它引用模板而不复制脚本，139行即可完整回答“为什么多测、测了什么、最终字节是否通过”。
- v0.3.5恢复文件更短，但停留在Source/Candidate + local stable seal，并明确写着publication/Published Release/Latest尚未完成；这与当前provenance记载的v0.3.5已发布/Cloud/postflight闭合不一致。它可能是当时的中间快照，不适合作为当前最终acceptance直接重新纳入。
- 因此“补回历史acceptance”不能只按文件名批量恢复。每份都要先和provenance所链接的exact immutable commit/blob、最终lifecycle事实及retirement policy核对；否则会把旧施工态重新提升成当前authority。

## Restored-file identity audit

- 三个补回文件都逐字等于其immutable历史对象：v0.3.4 blob `752163ae3d447f6a13ce039e1b4e32e20e2b9d19`、v0.3.5 blob `de7d0952d93d36b77aca9266eaf1fbc4156e4928`（二者位于commit `5d01b558…`）、v0.4.0 blob `afdd8e853f992c7365dfb339fbb5ca13fcf8e380`（commit `6b388518…`）。
- 所以它们不是内容被误改的副本，而是准确恢复的历史快照；问题在于“是否应重新进入current tree以及以什么角色”，不是字节可信度。
- v0.3.5的历史acceptance确实只写到local seal；后来的publication/Latest事实由provenance与其他治理证据补足。这反而证明旧acceptance可能只代表某个时点的gate账本，不能仅因文件名像final report就赋予最终全版本authority。

## Repository-governance authority

- 治理指南要求hot/warm/cold分层：逐次验收全文属于cold evidence；current tree不应永久同时承担当前authority和历史档案馆。
- 指南11.1已经冻结三层模型：稳定template、活动Release task plan、当前角色窗口内的version acceptance；一次性版本可省略中间状态表，多gate版本才保留简洁ledger。当前问题属于落实/澄清既有规范，不需要推翻治理架构。
- promotion/eviction DoD要求退出角色窗口的acceptance通过immutable link恢复。三个恢复文件都已具备exact历史对象，因此重新加回current tree会逆转刚完成的P9-F，而不是补足丢失历史。
- Phase capsule政策允许每个已关闭Phase保留一份精选摘要，但禁止按Round复制验收全文；v0.4.0多round的长期“为什么”应由现有Phase 4 capsule解释，完整acceptance/operator仍留在immutable history。

## Proposed governance model v0.1

### Acceptance-counting rule

1. 计数单位是**正式Discovery Round产生的新risk/behavior claim**，不是版本号、文件数或模板章节数。
2. single-round Product/patch：一段round delta + 一轮对应的development/Source-Candidate黑盒证据；没有中间gate ledger。
3. multi-round Product Phase：每个真正扩大claim的Round各有一段delta与相称Cloud evidence；Round内A/B/C施工子门槛共享该Round结果，不机械各跑一套。
4. aggregate/evidence-closure Round若只汇总既有exact records，不再重复黑盒；若它改变行为、执行路径或身份，则按新Round处理。
5. 每条要发布的列车仍执行standing Release双通道：final exact Source/Candidate与Published Release。它们验证“最终source字节”和“公开下载字节”，不与Product Round数量合并。

### Document roles

| Document | Recommended role |
|---|---|
| Cloud template | 稳定、版本中立的双通道/黑盒原语库；不保存版本状态 |
| Phase runbook | 仅在Phase有独特、多Round状态机时存在；冻结Phase-specific protocol，不保存current进度 |
| Gate operator guide | 仅复杂且需自包含操作时创建；动态identity/施工状态优先进入active plan，PASS后退入immutable history |
| Version acceptance | compact result ledger：single-round省略gate表；multi-round只保存round index、delta与已完成exact evidence；不复制operator步骤 |
| Active plan | 当前命令、授权、URL/SHA、错误、恢复位置与Next Step |
| Phase capsule | Phase关闭后的一份精选“为什么/继承关系”摘要，不复制验收全文 |

## Proposed governance model v0.2 — unified operator-guide lifecycle

### One document type, two naming forms

| Scenario | File form | Lifecycle |
|---|---|---|
| single-Discovery version | `vX.Y.Z-cloud-hard-acceptance.md` | 它就是简化版operator guide：先写教程/pre-run status，执行后追加post-run status并冻结 |
| multi-Discovery version | `vX.Y.Z-<round>-operator-guide.md` | 每个正式Round一份自包含教程；执行后在同文件追加post-run status并冻结 |
| pure aggregate/closeout | 不新建验收教程 | 只在active plan/Phase capsule/ROADMAP汇总已经冻结的Round证据 |

`acceptance`因此不是第二种内容职责，而是“single-round时使用的简短文件名”；`operator-guide`是多Round时的统一显式名称。

### Per-document lifecycle

```text
Discovery decision
  -> materialize one operator guide with Pre-run status
  -> maintainer runs the exact tutorial
  -> append exact Post-run status/evidence to the same file
  -> freeze the document
  -> later retire it to immutable history when its role window closes
```

冻结后只允许有证据的事实纠错或immutable link repair；后继模板改进不批量重写旧guide。

### Release treatment

- final Release仍需要Source/Candidate与Published Release两个独立环境/身份通道，但可以由**同一份Release operator guide**按前后阶段编排，并在最终post-run section分别登记结果。
- publication、Latest promotion、retirement是同一Release lifecycle里的管理gate，不因各有步骤就自动变成新的Product Discovery验收轮；只有其中出现新风险模型/路线变化才增开guide。
- single-round版本若能让该Round最终exact source直接进入seal，则它的Source/Candidate结果可以同时承担最终candidate证据，避免在后继governance-only commit后无谓重跑。Published Release仍必须在公开资产出现后独立执行。

### Important exception

- 不是每个Discovery都必然需要Cloud黑盒。纯文档authority/命名治理没有新增observable product claim时，只需要本地governance验证；规则应写成“每个**风险承载且产生新claim**的正式Discovery Round有一次相称验收”。
- no-live protocol materialization也可以有operator guide和post-run status，但其结论只能是repository/no-live PASS，不能冒充Cloud live。

## Candidate implementation scope v0.3 — terminology and templates

### Terminology

- **Discovery Round**：新增风险模型、行为claim或路线决策的验收计数单位；决定是否需要一份新的operator guide。
- **Gate**：Round内部或standing Release流程中的授权/停止检查点；一个Round可以有多个gate，gate数量不等于验收轮数。
- **Cloud task/stage**：operator guide里的执行单元；一个guide可以编排多个task/stage。
- 因此应停止使用“多gate版本”描述文档形态，统一改成“multi-Discovery version / 多Discovery版本”；`gate`仍可用于P9-A～P9-F、授权边界和停止点。

### New template

- 建议新增`docs/cloud-acceptance-operator-guide-template.md`，作为single/multi Discovery共同的教程骨架。
- 固定最小章节：定位与claim、exact inputs、执行教程、停止条件、Pre-run status；真实执行后追加Post-run status并冻结。
- 模板只规定结构和写入时机，不复制`cloud-hard-acceptance-template.md`中的稳定B～E提示词、Source/Candidate/Published脚本；具体guide通过稳定anchor复用，只有Round特有增量才内嵌。
- single-Discovery版本使用同一骨架，但文件名可以继续是`vX.Y.Z-cloud-hard-acceptance.md`；multi-Discovery版本每Round使用`vX.Y.Z-<round>-operator-guide.md`。

### Existing Cloud template changes

- 把“多gate开发版本”“版本内gate状态表”改写为“多Discovery版本”“Discovery Round文档路由”。
- 删除“一个巨型version acceptance累计全部gate”的暗示：multi-Discovery版本由多份冻结operator guide承担；活动plan控制当前Round，Phase capsule/ROADMAP只做索引与宏观结论。
- 保留Source/Candidate与Published Release双通道、B～E稳定协议和hard stops；它们是执行原语，不因文档治理而弱化。
- 说明single-Discovery version acceptance只是operator guide的简化命名，不是第二套证据职责。

### Authority synchronization required if implemented

- `docs/repository-governance-guide.md`必须同步，因为它目前是验收三层职责与多gate状态表的长期authority；只改Cloud template会产生冲突。
- `DESIGN.md`应在仓库地图中登记新operator-guide template及其与Cloud protocol template的分工。
- `tests/architecture-contracts.test.js`与`tests/repository-boundary.test.js`应保护新术语/authority和Release exclusion，不冻结历史文件名。
- 已发布acceptance、runbook、operator guide和Phase capsule保持原样，不做批量重命名或回写。

### v0.4.2 identity recommendation

- 本地`0.4.2`分支适合作为隔离的文档治理工作面。
- 当前不应立即把package/bootstrap/Release contract改成`0.4.2-dev`：讨论尚未冻结，而且若改package identity就会建立真正的Release列车并触发seal/Cloud/Release义务。
- 建议先把本轮称为“v0.4.2 document-governance discovery/train”，package仍保持已接受的0.4.1 identity。方案批准后再二选一：
  - 只改Release-excluded docs/tests/planning：作为governance-only source change，不必为了文档单独发布产品包；
  - 若改README等ZIP输入，或维护者明确要发布0.4.2：再原子切换`0.4.2-dev` machine identity，并按standing Phase 9走最终字节验收。
- 无论哪条路线，v0.4.2都不是新Product Phase；它最多是同一minor上的documentation/governance patch train。

## Restored acceptance disposition recommendation

- 三个文件本轮继续作为untracked只读分析fixture，不提交。
- v0.3.4与v0.4.0已经由immutable link完整恢复；重新入库会超出candidate+accepted role window。
- v0.3.5虽字节准确但只代表中间seal时点，更不应被提升成final current acceptance。
- 等维护者批准治理方案后，再明确授权删除本地fixture或保留到本轮分析结束；当前不擅自删除。

## Implementation outcome

- 新增`docs/cloud-acceptance-operator-guide-template.md`，把一轮教程固定为Discovery claim、exact inputs、执行教程、证据/停止条件、Pre-run status和真实执行后追加的Post-run status；冻结后进入immutable history。
- `docs/cloud-hard-acceptance-template.md`继续只拥有稳定Cloud/Release执行协议；它现在明确路由到Operator Guide结构模板，并把错误的“多gate版本”改成“多Discovery版本”。
- `docs/repository-governance-guide.md`成为长期authority：Discovery Round是验收文档计数单位，gate/task/stage不是；single-Discovery acceptance只是简化命名，multi-Discovery按Round建立guide，纯aggregate不新建guide、不重跑黑盒。
- Source/Candidate与Published Release仍是两个不可合并的身份/环境通道，但可以由同一份Release operator guide编排；文档治理没有削弱standing Release protocol。
- 历史acceptance、runbook与operator guide保持原名和时间语义；三个维护者补回文件只作未跟踪参考fixture，不进入current role window或本次commit。
- 本轮只改变Release-excluded docs、治理tests与planning；package仍是`0.4.1`，Release allowlist overlap为0，没有新增observable product claim，因此不要求Cloud黑盒。

## Resources to inspect

- `README.md`、`ARCHITECTURE.md`、`DESIGN.md`、`ROADMAP.md`
- `docs/cloud-hard-acceptance-template.md`
- `docs/v0.4.0-dev-f3-cloud-lifecycle-runbook.md`
- `docs/v0.4.0-dev-f3b3-autonomous-live-operator-guide.md`
- restored `docs/v0.3.4-cloud-hard-acceptance.md`
- restored `docs/v0.3.5-cloud-hard-acceptance.md`
- restored `docs/v0.4.0-cloud-hard-acceptance.md`
- current `docs/v0.4.1-cloud-hard-acceptance.md`

## Open questions

- v0.4.2是“文档治理patch train”还是不应占用产品semver版本？
- acceptance全文是否应随accepted/current角色保留在working tree，还是继续采用P9-F immutable-history退役模型？
- phase runbook、operator guide和version acceptance之间是否存在重复authority，应该保留哪些层次？
