<a name="phase-5-2-historical-position"></a>

# Phase 5.2：文档测试治理执行结果回顾

> Record role: `RETROSPECTIVE_CAPSULE`

## Historical position

Phase 5.2是Product Phase 5内一轮**已经完成的本地文档测试治理执行批次**的回顾性标签，不是新增Product Phase、正式
Discovery Round或Phase 5 closeout。它回答：此前[`Phase 5.1决策`](phase-5.1-document-test-governance-discovery.md#phase-5-1-document-test-governance-decision)
选择的有条件路线，后来实际做了什么、遇到什么偏差、又留下什么边界。当前Product目标和长期结论仍只读
[`Product Phase 5 Overview`](../product-phases/phase-5-overview.md#product-phase-5-overview)。

<a name="phase-5-2-newcomer-handoff"></a>

## 新人先看：这轮到底改了什么

**一句话：主要改的是“测试怎样检查文档”，不是改产品功能或放松发布规则。**
过去[`architecture-contracts.test.js`](../../tests/architecture-contracts.test.js)与
[`repository-boundary.test.js`](../../tests/repository-boundary.test.js)中的部分检查要求文档出现某句中文，却未必检查真正会执行的
命令；于是正确的等义改写可能报错，错误命令却可能被旁边一段安全说明掩盖。这轮把能够明确判断的部分改成检查实际命令、
正确链接、所在章节、文档角色和唯一事实来源。

| 你想知道 | 这轮结束时的答案 |
|---|---|
| 已经改了什么？ | 两份治理测试中的一部分文字匹配，改为检查实际命令、链接、身份、角色及其唯一来源；另补齐少量历史证据和当前路线说明。具体批次见下表。 |
| 哪些没改，为什么？ | 未证明等效防线的Cloud／Release操作、资产身份、runtime权限、历史来源和旧路径防复发断言原样保留。它们可能写得生硬，但直接删掉会有漏检风险；下文逐项列出。 |
| 哪些以后要重新判断？ | 并非自动排队全部修改。只有规则、命令或实际状态要变，或出现更可靠的验证方案时，才由对应负责人逐项重审；证明不足就继续保留。 |
| 这轮完成到哪？ | B0～B4这一批**本地**治理和对账完成；Phase 5本身、Linux／Cloud验收、C0和Release均未因此完成或获授权。 |

举个例子：Wiki的C0 tag/push测试过去可能被正文中的安全提示蒙混，现在核对真正的PowerShell命令块；错tag或广推
必须失败，旁边的等义说明可以改写。历史记录则先查索引、角色、锚点和可恢复来源，再放开部分旧总结句的措辞。
相反，R23候选资产操作、R38旧来源混合声明和A20未来Phase等尚未整体移交，不能因为这个例子成功就照搬删除。

读法：先读上表和下文“Completed delivery”，了解改动结果；要查某条保留断言再看“Explicit non-goals and retained work”；
要理解当初为什么选择分批路线，读[`Phase 5.1决策`](phase-5.1-document-test-governance-discovery.md#phase-5-1-conditional-go)。
`A`／`R`编号分别是两份测试中的盘点组（architecture／repository），不是新任务编号；`KEEP`是保留原检查，
`DEFER`是保留原检查且暂不决定怎么改；“owner”是某项规则的唯一负责文档／领域，“冷来源”是可从旧Git提交恢复的
原始证据。B0～B4只是本地执行批次，不代表Product或Release关卡。

<a name="phase-5-2-problem-before"></a>

## Problem before

两份仓库治理测试把可解析的安全、身份、链接和authority关系，与中文说明、历史叙述及一次性迁移状态混在同一批断言里。
整段文字匹配既可能被正文中的安全字样蒙混，使错误的实际命令通过；也可能把等义改写误报为失败。Phase 5.1已完成
按规则和失效后果的盘点，并冻结`CONDITIONAL_GO`与B0～B4分批路线；它当时并没有宣称这些实施已完成。

<a name="phase-5-2-core-decisions"></a>

## Core decisions

1. **先守住owner，再放开表达。** 用具名section、实际代码围栏、index/anchor、current owner链接、机器合同或immutable来源
   验证可解析关系；每一小批都用“改坏必须失败／等义改写应通过”的反例检验，而不以删除正则的数量衡量成果。
2. **安全与身份没有等效防线就保留。** Release/Cloud操作、runtime信任、published资产、历史冷来源和人工删除同意
   不因它们写在Markdown里就自动退休；未证明的断言保持`KEEP`或`DEFER`。
3. **历史决策和执行回顾分开。** Phase 5.1保留当时的假设、条件与停止点；本记录只总结后续已发生的本地执行，
   不反向改写决策，也不把本地回归升格为Linux/Cloud、C0或Release验收。

<a name="phase-5-2-completed-delivery"></a>

## Completed delivery

| 执行范围 | 已形成的结果 |
|---|---|
| 两个先导样本与B0 | 先试验“检查真正会执行的东西”：Wiki C0 tag/push看实际PowerShell块，Cloud模板4.1看是否从Release合同选对bootstrap并传入本轮URL/SHA；两例只解决各自一小部分。随后冻结Phase 5.1决定，并让history测试按索引成员和记录角色判断，不再卡住历史记录的固定总数。 |
| B1 导航与文档边界 | 检查README等文档是否把读者带到正确负责人／文件、链接是否落在正确小节，避免用某句中文当作导航正确的证明。另用合成案例验证“开发列车为`NONE`”时应移除旧当前指针、保留已完成历史；真实轮转没有发生。 |
| B2 操作与planning生命周期 | 检查handoff仍是分流页、Operator Guide的角色和冻结时序正确、planning删除仍需维护者同意；Cloud／Release的真正命令和停止条件没有被当作普通说明文字删掉。 |
| B3 history结构与条件退休 | 先确认历史记录能从索引找到、有合法角色和稳定锚点、旧证据还能恢复，再去掉部分仅要求旧总结句原样出现的断言。Phase 4.8／4.10缺少的冷来源入口先补齐；没有为了测试绿灯批量重写冻结正文。 |
| B4 当前与历史身份 | 分清CHANGELOG写版本变化、ROADMAP写当前路线、provenance和acceptance保留精确来源／发布证据；收窄“一出现某个词就失败”的粗检查，同时保留hash、发布角色和解析边界等精确守卫。 |

<a name="phase-5-2-execution-issues"></a>

## Temporary issues and disposition

| 执行中发现的问题 | 当时如何处理；是否解决 |
|---|---|
| 部分新关系检查仍有假绿或假红：例如Guide计数被同条其他分句蒙混、DESIGN裸句可能重建第二authority、历史标题去措辞化时会漏掉版本身份、B4的owner指针可能误放行具体身份声明。 | **已就各自已实施子规则修正。** 把判断限定到对应句段、声明位置与值，补有害／等义反例；没有为绿灯放宽原安全边界。新写法仍不等于通用自然语言或Shell解释器。 |
| Phase 4.8两处文字说旧guide可从文末Cold evidence恢复，但当时没有该节；Phase 4.10有同类指针缺口。 | **已修复来源入口。** 从Git核对含旧guide及显式anchor的exact祖先，在两份记录末尾各追加一处Cold evidence；随后才把Phase 4.8纳入R29关系验证。没有猜写或改写冻结正文。 |
| ROADMAP允许开发列车为`NONE`，而原A20测试只接受一条active Phase路线；部分新测试fixture又误把具体版本字面量冻结进测试源码。 | **状态模型和fixture已修复，真实轮转未发生。** `NONE`合成反例现在要求无旧当前overview指针、无active Phase行，但保留完成态overview和已接受证据入口；fixture从现有身份派生。无Product Phase的未来patch/governance列车仍需另行决定。 |
| B3的冷链接形状一度容易被误当作每份record的固定commit身份；Phase 5当前overview还滞留“Phase 5.1草稿”描述。 | **已分别澄清和纠偏。** 通用history检查只守一处immutable来源形状，不为Phase 4.14虚增hash权威；其余精确旧来源继续保留。overview在维护者授权后更新为已冻结决策与有界本地执行摘要。 |

<a name="phase-5-2-acceptance-conclusion"></a>

## Acceptance conclusion

本批次达到`B0_B4_LOCAL_RECONCILED`：已实施的分批治理、负向与等义探针、保留守卫和历史来源修复完成本地对账；聚焦及
完整Windows回归通过。Windows中的POSIX/Linux专项仍诚实跳过，这些本地结果不证明Linux/Cloud运行、Source/Candidate、
Published Release或Product Phase 5验收完成。

<a name="phase-5-2-explicit-non-goals"></a>

## Explicit non-goals and retained work

以下是**本批次收束时**的保留快照，供完成态planning日后清退时追溯“什么没移交、为什么不能删”。`KEEP`表示
原断言继续生效；`DEFER`表示该断言的改写或退休尚无等效证明，**不是**待自动执行的任务或新授权。维护者选择暂时
保持这些断言原样。下表的17项是Phase 5.1原始盘点的决策时分类，不是实施后重新计数；各项重审均须由对应owner
确认“改坏关键关系必须失败、等义说明改写应通过”，并明确不能自动判定时的人工审阅责任。

### 原始17项`DEFER`：保护目标与重审证据

| 组 | 保留断言保护的具体失效 | 如要改写／退休，至少先证明 |
|---|---|---|
| A08 | Product Round数量、两个Release Cloud通道及C0/C1/C2角色不被混作同一gate。 | ROADMAP顺序与模板停止态有分角色关系检查；错误通道或过早晋级必须失败。 |
| A10 | adapter dispatch顺序、时间预算、激活准入和禁止并行plan reader不被文字清理顺带放宽。 | adapter／owned runtime附近的行为或AST/seam测试等效覆盖，含违反信任边界的反例。 |
| A18 | Release四步及C0→C1→C2、Latest确认、结果未知时停止不被误改成可跳步发布。 | 按ROADMAP owner验证命令／身份／序列，错误tag、资产或未知结果有失败探针。 |
| A19 | planning删除须获同意、retirement checkpoint、migration原子性、Pre-1兼容边界不被合并成一句空泛治理话。 | 分别找到ROADMAP时序与Guide方法的owner，并给出关系检查或具名人工复核。 |
| A21 | plan-local autonomous opt-in不等于平台／系统执行权限，历史说明也不能变成授权。 | code／contract、激活seam与操作者说明各自守住权限边界；错误授权推论会失败。 |
| R02 | 旧v0.4.4 acceptance措辞、资产size/hash及Phase摘要的历史与当前角色不被误当作一个可丢弃的文字包。 | 每个固定身份分别对上published oracle、provenance或immutable acceptance；不能重建第二份当前资产账。 |
| R06 | 旧acceptance句子、validation-ref数量和SHA字面量退役后仍可恢复。 | cold来源逐条可查，并与当前发布身份oracle分离；不能误删rollback／published证据。 |
| R08 | 被点名的旧prototype路径不会悄然复发。 | 逐个判断复发风险，确认trusted inventory、链接或专门负例是否已覆盖；不能因不在Release里就直接删墓碑。 |
| R18 | Cloud baseline预检禁止不安全shell写入、伪冲突和提前激活。 | 对实际操作块、权限与反例设检查或明确人工复核；错误预检必须触发停止。 |
| R19 | markerless baseline、process/session轮询、最终exit code及不得虚构证据。 | 验证真实marker和进程结果关系；缺失最终退出码或凭空补证据应失败。 |
| R20 | 两个deep-check通道都从manifest／bundle／schema／hash权威派生事实。 | 按通道限定并由machine contract派生的检查通过；单通道漏检或硬编码身份应失败。 |
| R23 | candidate bootstrap选择、URL/SHA override、精确candidate身份和资产物化命令。 | Wiki实际围栏命令与Release contract／materializer相符；错脚本、错版本、错SHA、zero-hash或公开下载身份错误应失败。已替换的R23a仅覆盖模板4.1选择子规则，**不关闭R23**。 |
| R26 | 两个旧beta migration文件的名称墓碑仍防止不当复活。 | 逐个证明inventory、链接或其他守卫足以拦截实际复发；否则保留。 |
| R33 | Guide的retirement三阶段与链接替换／恢复步骤不会因同义改写测试而丢失。 | 删除前后链接清单、冷来源恢复与失链反例或具名人工审阅能守住程序。 |
| R35 | provenance中的七个旧commit字面量不是仅“出现过”，而有正确身份与可恢复来源。 | 逐个映射到当前必须保留的角色或cold审计；单纯字符串存在不算恢复证明。 |
| R37 | 测试源码自身不会把版本acceptance、hash或条目数固化成第二权威。 | 先定义窄范围AST／源码lint，再证明无害版本提及应通过、真正冻结身份应失败。 |
| R38 | Phase 4.13～4.17中旧来源、Release和path-safety混合声明不被当作纯历史措辞一起删除。 | 逐项区分当前安全guard与immutable Git恢复，并做有害／等义反例。R30只查每份record唯一完整commit链接的**形状**，不核对特定来源身份；Phase 4.14未新增固定hash断言。 |

### A20与其他未移交边界

ROADMAP当前Phase行、overview索引／文件、§4指针与accepted-evidence关系，以及开发列车`NONE`的**合成**状态模型已在
本地验证；这既非真实`NONE`轮转，也不替代以下A20跨owner断言。其原守卫均`KEEP`，仅可能的改写`DEFER`：

| 仍保留的A20声明 | 为什么不能由当前路线解析代替；何时重审 |
|---|---|
| Phase 6 compaction与Phase 7可选tool／permission hooks | 路线状态不能证明“先尝试现有事件”、单独gate、预算、`NO_GO`与非前置条件；仅在获授权路线变化时，用行内错误／等义探针重审。 |
| Phase 8只读evaluator与Phase 9可选hard gate | 尚无实现或Cloud证据替代advisory-only／不得写可变状态，以及新writer、锁、Resume、rollback评审；需各Phase owner单独决定。 |
| Phase 4 overview的v0.4.3资产、bootstrap选择及Source/Candidate／Published双通道 | 当前合同和资产测试不证明旧overview的历史发布结果；需对应immutable acceptance/source及错选资产／错通道反例。 |
| Phase 4 overview的“不重开Phase 4、不激活Phase 5、不改Product／runtime行为” | 这是已完成patch/governance列车的范围声明；须有历史纠错证据或独立的Product/trust守卫才能改写。 |
| Phase 4 overview中的两类history record role结论 | index/template已守合法角色与准入，但删除旧结论前仍须证明overview自己的历史含义不丢。 |

此外，A17当前列车／package身份、精确overview链接、Release顺序和权限边界仍是独立`KEEP`守卫；无Product Phase的
未来patch/governance列车另需状态决定，不能从`NONE`分支推导。R25的Wiki说明措辞仍是**有条件退休**，须先证明
R23／R24相邻命令、身份及停止条件的等效覆盖。B3历史索引中的重编号总述、短篇curated-history／当前programme
断言并未随R29／R31一并退休。B4仍保留CHANGELOG精确SHA与`N registered`禁令、provenance的计数／段落解析、
唯一published ledger与acceptance路由、ROADMAP accepted标题与Latest稳定anchor，以及独立published-release oracle；
这些是身份、结构或防止第二权威的守卫，不属于可批量放松的叙述文字。

本批次未改production、Host ABI、trusted graph或Release合同；未创建C0、tag、Cloud任务、Release，也未发布或移动
远端引用。上述保留项日后只能按各自owner重新立证，不能以Phase 5.2回顾或本地测试通过视作关闭。

<a name="phase-5-2-successor-inheritance"></a>

## Successor inheritance

后来接手时，先按[`README文档地图`](../../README.md#documentation-map)找到现行负责文档，按活动planning确认当次授权；
不要把这份历史回顾当作当前任务清单。不同变更按下面的风险区别处理：

| 如果以后要做的是 | 从本批次继承的判断方法 |
|---|---|
| 只把一般说明改成等义说法 | 已移交的结构／关系测试应允许这种改写；若报错，先查是措辞误报，还是实际改坏链接、身份或规则。 |
| 改Cloud／Release命令、资产身份、runtime权限或某条`DEFER`断言 | 先找到它的owner与旧检查防住的错误，再设计“错误必败、等义改写可过”的替代检查；自动检查不到的操作含义由对应负责人审阅。证据不足时保持原断言，不因凑库存数字批量删除。 |
| 删除旧planning、旧路径或精确历史身份 | 先确认链接迁移、维护者同意及immutable来源仍可恢复；当前有测试守卫不等于旧版本历史已经被完整证明。 |
| 真正关闭开发列车、进入`NONE`或出现无新Product Phase的patch/governance列车 | 由ROADMAP和当次授权决定实际状态；本批次只证明了合成`NONE`测试模型，没有替真实状态轮转作决定。 |

Phase 5 closeout、Linux/Cloud和Release各有自己的验收门槛；Phase 5.2既不替它们签字，也不授权清退任何planning。

<a name="phase-5-2-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable local source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/90ab434466780a5d227f85a6c49dee740b14cc61)

该exact commit及其祖先固定本批次的实施、planning对账与修正证据；链接仅用于历史来源审计，不表示该提交已经被远端发布，
也不替代当前Product、programme、合同或验收authority。
