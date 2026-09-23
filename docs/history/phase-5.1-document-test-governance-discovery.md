<a name="phase-5-1-discovery-draft"></a>
<a name="phase-5-1-document-test-governance-decision"></a>

# Phase 5.1：文档测试治理 Discovery 决策

> Record role: `FROZEN_DISCOVERY_RECORD`

本记录封存Product Phase 5文档测试治理这一轮Discovery的证据、方法、`CONDITIONAL_GO`和停止条件；它不是Phase 5
closeout，也不是两份测试批量改造、Cloud或Release的验收。现行Product目标仍由
[`Product Phase 5 Overview`](../product-phases/phase-5-overview.md#product-phase-5-overview)负责；当前唯一Next Step和实施授权由
活动planning负责。

<a name="phase-5-1-draft-purpose"></a>

## Problem before

按职责指定唯一authority、让测试保护安全意图而非临时施工形状，并不是Phase 5新提出的原则；早期
[`Phase 3.8`](phase-3.8-runtime-inventory-authority-discovery.md#phase-3-8-design-hindsight)已明确分析重复machine authority与
测试把过渡形状固化的问题。Phase 5是在既有原则上修补和完善文档治理：
[`Phase 5.0`](phase-5.0-v0.5.0-dev-document-governance.md#phase-5-0-core-decisions)已经收敛文档职责，并提出让测试保护稳定关系、
不冻结阶段文案。随后进行的只读粗筛表明，这条分工在当前两份文档治理测试中仍未完全实现：真正重要的Release、安全、身份、
inventory、链接和anchor边界，与中文句式、段落顺序、一次性迁移状态及历史总结措辞混在同一批正则断言里。

因此开启一轮有界Discovery，但不能把“正则很多”直接翻译成“批量删除测试”。本轮先从治理规则及其唯一owner、
失败后果和当前/历史语义出发，再定位保护它的断言：同一规则可能分布于多处断言，同一断言也可能混合结构与文案。只有弄清
被保护的风险及替代验证方式，才能决定保留、替换、退休或延期。

<a name="phase-5-1-opening-evidence"></a>

## Opening evidence

粗筛在两份主要测试中看到结构边界、安全操作和文案句式混写；Phase 5.0已经先移除过一条重复冻结history总数的断言，
说明简单计数既不稳定，也不是本轮质量目标。主要表面为：

- [`tests/architecture-contracts.test.js`](../../tests/architecture-contracts.test.js)：版本无关的架构、文档authority和ROADMAP治理断言；
- [`tests/repository-boundary.test.js`](../../tests/repository-boundary.test.js)：仓库inventory、文档生命周期、history入口和元测试边界。

同一文档生命周期case同时检查`docs/`不进入Release ZIP、稳定anchor，以及Cloud/Release教程中的C0 tag命令、验收身份和停止条件；
因此不能仅凭“断言匹配Markdown文字”归入文案冻结。后续按规则与失败后果完成分组盘点，而不是按正则语法删除。

<a name="phase-5-1-working-taxonomy"></a>

## Working taxonomy

本轮使用下列分类理解断言，不按正则语法或行数机械处置：

| 类型 | 典型对象 | 初始处置方向 |
|---|---|---|
| 真正机器边界 | 文件存在、稳定显式anchor、相对链接解析、Release ZIP排除docs、版本角色与package/contract对应 | `KEEP` |
| 可转换的结构合同 | current train、history入口数量、overview文件清单、authority metadata | `KEEP`或数据驱动`REPLACE` |
| 安全关键操作说明 | Cloud/Release教程中的命令、身份选择、禁止动作和停止条件与自然语言解释混写 | 先核对实际失败后果；有等效验证前`KEEP`或`DEFER`，优先设计结构化/可执行`REPLACE` |
| 文案冻结 | 必须出现某句中文、几段自然语言必须按特定顺序出现，且没有独立安全或操作后果 | 通常`REPLACE`或`RETIRE` |
| 时态性断言 | 当前不得存在某文件、旧术语不得出现、一次性迁移事实必须继续留在moving authority | 通常`RETIRE`，必要时迁到正确生命周期检查 |
| 历史叙述冻结 | history必须保留某组总结句、理由或措辞 | 改为anchor、record role、immutable ref和受控入口等结构检查 |
| 测试源码自检 | 测试读取自身，禁止版本号、hash或其他易漂移身份 | 单独复核；有稳定目的时改为明确lint，否则`DEFER`或`RETIRE` |

每组最终只使用四种处置标签：

- `KEEP`：直接保护可解析结构、身份、关系或安全边界，当前表达已经合适；
- `REPLACE`：保护目标正确，但实现应改为schema、集合、解析器、数据表或其他结构化检查；
- `RETIRE`：只冻结措辞、顺序或已经结束的时态，没有独立失败后果；
- `DEFER`：可能关联安全、Release或特殊lint，但本轮证据不足，禁止为了减数先删。

<a name="phase-5-1-hotspots"></a>

## Inventory surface

盘点重点是四个混合入口，而非四个实施批次：

| 入口 | 需要区分的风险 |
|---|---|
| `architecture-contracts.test.js` 的ROADMAP治理case | 稳定anchors、programme关系、Release顺序与自然语言表达混写 |
| `repository-boundary.test.js` 的文档生命周期case | 文件集合、Release排除、路径检查与模板/acceptance措辞混写 |
| `repository-boundary.test.js` 的history治理case | 受控入口、role和anchor与历史叙述冻结混写 |
| `repository-boundary.test.js` 的版本历史自检 | 元测试可能防止第二authority，也可能只是偶然的源码自检 |

这四个入口不意味着每条断言都有问题。inventory按规则/owner分组，而不是为每个
`assert.match`制造一项流程记录。

<a name="phase-5-1-candidate-principle"></a>

## Core admission principle

本轮选定的准入原则是：

> 每条治理规则回到既有的唯一current authority；JS测试优先验证可解析的结构、身份、关系、安全边界和可执行操作合同，
> 不把一般中文措辞、一次性迁移状态或历史摘要当作长期API。Markdown模板只承担其本来负责的执行/写作协议，不能泛化成
> 所有自然语言规则的第二份权威；安全关键但暂不能结构化验证的操作说明，也不能只因表现为文字就失去审阅和验证防线。

一条文档规则要进入JS测试，至少应能回答：

1. 是否存在稳定、可解析的对象，例如path、anchor、metadata、schema、集合、引用关系或明确forbidden zone？
2. 违反规则是否会导致错误路由、断链、重复authority、Release/trusted-graph越界或无法恢复的生命周期漂移？
3. 测试能否在不绑定某句中文同义表达和段落顺序的情况下识别该错误？
4. 规则是否已有唯一owner，测试验证的是owner产出的关系，而不是在JS里复制第二份自然语言规范？
5. 若规则是操作说明，是否有命令、参数、身份、顺序或停止条件可由现有contract、可执行样例或负向样例验证？不能自动验证的
   剩余语义由谁审阅，何时审阅？

无法回答这些问题的断言不能自动当作长期合同；但只要可能影响Release、安全、身份、inventory、可恢复性或操作员行为，也不能
自动删除，应先`DEFER`并补证据。反过来，某条规则位于Markdown正文而不容易解析，也不表示现有脆弱正则就是足够可靠的防线。

<a name="phase-5-1-authority-placement"></a>

## Authority placement for transferred rules

`Repository Governance Guide`可以称为**仓库治理方法的权威**：它解释如何分配authority、划分hot/warm/cold、管理planning与
history、审查链接和retirement。它不是覆盖所有Markdown内容的“文档治理总宪章”，也不因测试断言移交而自动成为每条规则的
接收处。本仓库实际的“问题→唯一权威”导航仍以[`README文档地图`](../../README.md#documentation-map)为准；Guide中的通用
推荐映射不能代替某个领域已有的current authority。

对代表性规则，按职责而非原测试文件名路由：

| 规则问的是什么 | 既有owner route | 测试应保留的职责 |
|---|---|---|
| authority怎样分配、planning/history何时保留或清退、入链怎样迁移 | [`Repository Governance Guide`](../repository-governance-guide.md#repository-governance-guide) | 检查唯一入口、role、链接与retirement关系，不复制整段治理文字 |
| 当前programme、版本角色、Release四步与C0～C2顺序 | [`ROADMAP`](../../ROADMAP.md#release-four-step-flow)及其相应current章节 | 检查角色/身份关系与必要锚点，不把另一份顺序规范写进JS |
| Cloud双通道执行、停止条件、evidence schema或一轮guide的写入生命周期 | 对应[`Cloud执行模板`](../cloud-hard-acceptance-template.md#acceptance-document-responsibilities)或[`Operator Guide结构模板`](../cloud-acceptance-operator-guide-template.md) | 验证可执行命令、身份输入和停止防线；等义说明文字可变 |
| Host ABI、runtime/source inventory、ZIP allowlist等机器事实 | 对应machine contract及producer/consumer；架构理由另见ARCHITECTURE | 维持exact schema/hash/inventory与行为测试，不把机器事实搬进Guide |

这不是第二份“问题→权威”表。盘点为每组记录失败后果、既有owner、current/历史语义和验证方式；不能因为断言写在JS里，
就把原文原样搬到Guide、ROADMAP或模板。若Guide包含领域规则的展开投影，应审查它是必要示例还是竞争authority，
只做经证据支持的最小链接/措辞收敛。

<a name="phase-5-1-bounded-round"></a>

## Bounded Discovery evidence

两份测试按治理规则而非正则行数完成分组；每组核对失败后果、唯一owner、current/历史语义和拟议验证方式。
跨README、ROADMAP、模板、history和测试的重复陈述被区分为必要投影与竞争authority。安全操作说明先找命令、contract、
状态与人工审阅防线，没有等效证据时保留原断言。两个混合样本用“关键身份、命令或路径被改坏必须失败；等义说明改写不应失败”
验证方法。盘点本身不授权批量修改，也不以正则数量下降作为成功标准。

<a name="phase-5-1-exit-conditions"></a>

## Decision closure and limits

盘点形成59组候选处置：22组`KEEP`现有结构/机器防线，16组`REPLACE`但必须先证明等效验证，4组`RETIRE`附带前置条件，
17组`DEFER`保留原断言并设单独触发证据。每组的详细owner、理由、失败后果和source映射由本记录末尾的exact source恢复；
本记录只冻结路线与边界，不复制施工清单。Release、安全、链接、path/inventory、版本角色和authority入口不得因文案治理弱化；
无法机器判定的操作余义由对应维护者/operator owner在改变该协议时审阅。维护者批准本轮Discovery关闭及B0准入事务，
未批准B1～B4或`DEFER`的批量实施。

<a name="phase-5-1-first-sample-evidence"></a>

## First bounded convergence sample

Wiki C0 tag/push混合case的内存探路证明：整文件命令匹配可能被围栏外安全文字蒙混，
而等义改写的说明会被句式正则误伤。

维护者随后单独授权该组的有界本地实施：`tests/repository-boundary.test.js`现检查`Wiki.md#source-candidate-c0-tag-push`
之后的实际PowerShell命令块，要求tag精确指向Source/Candidate C0、push仅含一个tag ref，并核对C0解析、同名tag停止
条件与本地/远端peeled commit。内存变异覆盖错误C1目标、`--tags`广推、缺失预检、错误远端peeled比对、在后续标题下
藏第二条命令，以及等义说明和停止提示改写。该检查不是通用PowerShell解释器；未覆盖的命令变体仍需人工审阅。

该有界实施只收敛R24及直接依赖的C0解释断言。R23、R25其余说明和17组`DEFER`保持原状；本地回归不代表Cloud验收或
整份测试治理完成。

<a name="phase-5-1-second-sample-evidence"></a>

## Second bounded convergence sample

维护者随后单独授权R23a：仅核对Source/Candidate模板4.1从当前manifest点名的Release contract读取唯一
`external_release_assets`，先验证被选中的bootstrap，再用本轮本地ZIP的URL与实际SHA override调用同一个脚本。
测试只静态检查具名4.1代码围栏，不执行教程；contract、bootstrap和资产测试继续独立守住当前版本身份与候选字节。
Wiki只补到模板4.1的稳定anchor，其候选选择说明仍由Wiki负责，不迁入Guide或测试作为第二份自然语言规范。

内存变异证明：硬编码旧脚本、选中后重赋值、去掉唯一性或文件/语法检查、改坏URL/SHA override或重复执行必须失败；
Wiki等义说明和选择器中的非语义注释可以通过。当前实现只覆盖该选择链；R23的物化、zero-hash、公开下载身份等
其余断言仍保留，R23组整体仍是`DEFER`。静态检查不解释任意Bash/Python控制流；非规范代码改写仍需operator owner
人工审阅，不能把本地回归提升成Cloud PASS。

<a name="phase-5-1-staged-decision-proposal"></a>
<a name="phase-5-1-conditional-go"></a>

## Conditional-go and staged route

三条路线经过比较：直接批量删改最省眼前代码量，却会把Release/Cloud/身份防线一并误删；逐条正则原样保留最稳妥，
但继续冻结等义文案并积累第二份规范；按owner与失效后果分批收敛，成本是多次小门槛和人工审阅，却能同时保住安全意图与
文案弹性。因此本轮选择第三条路线，结论为`CONDITIONAL_GO`，不是两份测试的无条件批量GO。

| 后继门槛 | 决策边界 |
|---|---|
| B0 history准入 | 以exact source封存本决策、登记索引，并把旧固定总数断言改为索引成员/role关系检查；B0不实施其余R28。 |
| B1 导航/文档边界 | A02、A03、A12、A14、A16、A20、R11、R21；逐组证明解析后的owner链接、section或环境路由等价。 |
| B2 操作与planning文档生命周期 | A04、A07、R13、R17；保留命令、状态、删除同意与角色边界，operator/maintainer审阅不可机器化的解释。 |
| B3 history结构与条件退休 | R28其余、R30先建立role/index/anchor/immutable-link关系，之后才能退休R04、R29、R31的历史叙述断言；历史正文不改写。 |
| B4 current/cold身份 | R36先对齐CHANGELOG、ROADMAP、provenance、acceptance与publication oracle，再替换宽泛的词句禁令。 |

R24已由第一个样本局部替换；R23a仅覆盖R23候选bootstrap选择子规则，R23整体仍`DEFER`。R25虽列为条件`RETIRE`，
但要等R23其余操作安全及R24相邻停止条件有等效防线才可审议。17组`DEFER`不进入B1～B4：A08/A18须先证明Release两通道和
C0/C1/C2错误顺序及未知Latest停止；A10/A21须有runtime行为/平台权限与产品opt-in的独立证据；A19须分清Guide方法、
ROADMAP时点与人工删除同意；R18～R20/R23须有Cloud预检、最终退出/证据状态、双通道contract数据流及候选资产身份的
负向探针；R02/R06/R35/R38须逐项映射current publication oracle或immutable Git恢复；R08/R26须核对旧路径复发风险；
R33须有退役前后入链与immutable恢复演练；R37须有能区分正常提及与第二authority的窄lint。上述剩余语义分别由维护者作为
Release、runtime/trust、planning、Cloud operator、provenance、retirement或test-design owner审阅，不因本轮结论自动放行。

每个后继批次先定位当时的owner与源码断言，再证明有害改动失败、等义改写通过；运行最近边界与producer/consumer测试、
完整本地回归、链接/anchor和差异检查，并以单一可恢复本地commit收束。Windows上的POSIX跳过不算Linux/Cloud证据；
若触及ZIP输入、machine contract或可执行操作协议，转入相应平台/专项门槛。失败时保留上一批commit，分类、修复或只回滚
当前批次；不把失败带进下一批。B1～B4各自仍需活动planning和维护者授权，`DEFER`另行设计，Cloud/Release/远端写入均未授权。

<a name="phase-5-1-stop-rules"></a>

## Stop rules and non-conclusions

- 不把本轮Discovery关闭误作Phase 5、Cloud、Release或整体测试治理完成。
- 不以断言总数、正则数量或文件行数作为成功标准。
- 不因断言匹配自然语言、写法脆弱或存在重复，就在证明等效防线前删除安全关键操作规则。
- 不弱化Release allowlist、trusted source、版本角色、链接/anchor、history入口、planning lifecycle或安全失败语义。
- 不修改runtime、Host ABI、installer、trusted graph、Cloud gate、Release流程或版本角色。
- 不把一个代表性case的方案自动扩展到两份文件全部断言。
- owner冲突、等效防线不成立、有害变异假绿、等义变异假红或实施路线发生实质变化时，停止当前批次并重新作维护者决策。

<a name="phase-5-1-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable decision-source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/f7ebbf9dab6984697cfea5c1050daafe336737c3)

该exact commit固定本轮分组决策、B0～B4实施边界、`DEFER`触发器及冻结前草稿；本记录只封存当时决定，不解释后继实施或
当前programme。当前authority仍按README文档地图、Product Phase 5 overview、ROADMAP和活动planning读取。
