<a name="phase-5-1-discovery-draft"></a>

# Phase 5.1（草稿）：文档测试治理 Discovery

> Target record role: `FROZEN_DISCOVERY_RECORD`
> Record status: `DRAFT / OPEN — not frozen, not indexed`

本文件由维护者显式创建，用于提前整理Phase 5.1正式Discovery的边界。它当前不是已关闭的history object，不计入
`FROZEN_DISCOVERY_RECORD`数量，也不表示任何测试改造已经获批。当前Product目标和稳定边界仍只读
[`Product Phase 5 Overview`](../product-phases/phase-5-overview.md#product-phase-5-overview)；唯一Next Step、实施授权和错误证据仍由
活动planning控制。

<a name="phase-5-1-draft-purpose"></a>

## Draft purpose

按职责指定唯一authority、让测试保护安全意图而非临时施工形状，并不是Phase 5新提出的原则；早期
[`Phase 3.8`](phase-3.8-runtime-inventory-authority-discovery.md#phase-3-8-design-hindsight)已明确分析重复machine authority与
测试把过渡形状固化的问题。Phase 5是在既有原则上修补和完善文档治理：
[`Phase 5.0`](phase-5.0-v0.5.0-dev-document-governance.md#phase-5-0-core-decisions)已经收敛文档职责，并提出让测试保护稳定关系、
不冻结阶段文案。随后进行的只读粗筛表明，这条分工在当前两份文档治理测试中仍未完全实现：真正重要的Release、安全、身份、
inventory、链接和anchor边界，与中文句式、段落顺序、一次性迁移状态及历史总结措辞混在同一批正则断言里。

因此值得开启一轮小范围Discovery，但不能把“正则很多”直接翻译成“批量删除测试”。本轮应先从治理规则及其唯一owner、
失败后果和当前/历史语义出发，再定位保护它的断言：同一规则可能分布于多处断言，同一断言也可能混合结构与文案。只有弄清
被保护的风险及替代验证方式，才能决定保留、替换、退休或延期。

<a name="phase-5-1-opening-evidence"></a>

## Opening evidence

粗筛时，两份主要测试合计约有：

| 断言形式 | 粗筛快照 | 当前opening baseline |
|---|---:|---:|
| `assert.match` | 488 | 487 |
| `assert.doesNotMatch` | 84 | 84 |
| 合计 | 572 | 571 |

两组数字并不冲突。Phase 5.0在粗筛后已经删除一条Phase 4.17专属、重复冻结全局history总数的正向断言，所以当前树比原快照少一条。
这些数字只用于说明盘点规模，不是稳定合同、质量指标或必须下降到某个目标值。

主要表面为：

- [`tests/architecture-contracts.test.js`](../../tests/architecture-contracts.test.js)：版本无关的架构、文档authority和ROADMAP治理断言；
- [`tests/repository-boundary.test.js`](../../tests/repository-boundary.test.js)：仓库inventory、文档生命周期、history入口和元测试边界。

只读抽样已看到同一文档生命周期case同时检查`docs/`不进入Release ZIP、稳定anchor，以及Cloud/Release教程中的C0 tag命令、
验收身份和停止条件；这些风险不能仅凭“断言匹配Markdown文字”归入文案冻结。此处只是说明分类必须按规则和失败后果进行，
不构成逐组inventory或任何断言的最终处置。

<a name="phase-5-1-working-taxonomy"></a>

## Working taxonomy

第一轮使用下列分类理解断言，不按正则语法或行数机械处置：

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

## Hotspots to inventory

当前四个代表性入口为：

| 入口 | 当前规模 | 为什么需要单独看 |
|---|---:|---|
| `architecture-contracts.test.js` 的ROADMAP治理case | 93 | 同时保护稳定anchors、programme关系、Release顺序和大量自然语言表达/顺序 |
| `repository-boundary.test.js` 的文档生命周期case | 150 | 好的文件集合、Release排除和路径检查，与模板文案、acceptance生命周期句式混合 |
| `repository-boundary.test.js` 的history治理case | 43 | 受控入口、role和anchor有价值，但部分断言继续冻结history/template叙述 |
| `repository-boundary.test.js` 的版本历史自检 | 4 | 元测试目的有价值但实现特殊，应判断它是稳定lint还是测试源码对自身的偶然约束 |

上述规模是opening baseline，不是四个实施批次，也不意味着每条断言都有问题。正式inventory应按规则/owner分组，而不是为每个
`assert.match`制造一项流程记录。

<a name="phase-5-1-candidate-principle"></a>

## Candidate admission principle

拟验证的准入原则是：

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

<a name="phase-5-1-bounded-round"></a>

## Bounded first Discovery round

第一轮只做以下工作：

1. 先按治理规则建立小组清单，记录唯一authority、当前/历史语义、失败后果和风险，再映射两份目标测试中的相关test case与断言；
   对每组标记`KEEP / REPLACE / RETIRE / DEFER`，不把一条正则等同于一条规则；
2. 找出同一治理规则被README、ROADMAP、模板、history和测试重复冻结的位置，区分正确投影与竞争authority；
3. 对安全关键操作说明单独核对现有防线与可替代的命令/contract/结构检查；尚无等效防线的项目保留或`DEFER`，不得因正则
   脆弱或文字可改写就直接退休；
4. 选择一个同时包含结构边界、操作风险和文案冻结的代表性case，形成before/after收敛设计：改坏关键路径、命令、身份或
   停止条件时应失败；仅作等义表述调整时不应失败；
5. 冻结实施范围、focused/full回归路线、停止条件和需要维护者决定的`DEFER`项；无法机器判定的剩余语义明确人工审阅owner与
   触发时机，不另建第二份machine authority。

Discovery阶段可以写清代表性case的before/after设计，但不批量编辑测试，也不把“建议`RETIRE`”直接当删除授权。

<a name="phase-5-1-exit-conditions"></a>

## Exit conditions before freeze

Phase 5.1只有同时满足以下条件，才可由维护者决定是否冻结为正式`FROZEN_DISCOVERY_RECORD`并授权后续实施：

- 两份目标测试涉及的治理规则及断言组都已有唯一owner、当前/历史语义、分类、理由和失败后果，不留未解释的关键组；
- Release、安全、链接、path/inventory、版本角色和authority入口等机器边界，以及安全关键操作说明，均有明确保留或等效
  替代方案；不能机器判定的剩余语义有明确人工审阅责任；
- 重复治理规则已经映射到唯一authority，测试不再被设计成第二份自然语言规范；
- 至少一个代表性case形成可审查的收敛设计，列出必须继续失败的负向样例和应允许通过的等义改写样例；
- `DEFER`项单独列出触发条件，不因追求断言数量下降而被静默处理；
- 实施范围、focused/full回归路线和回滚办法已经清楚；
- 维护者明确给出freeze与implementation授权。

冻结时再把本草稿改写为当时的证据、决定、conditional-go和stop rules，补齐exact immutable source，并登记history索引。若Discovery
最终认为不应实施，也应如实冻结no-go或由维护者决定删除草稿；不得保留一个看似已经验收的永久OPEN记录。

<a name="phase-5-1-stop-rules"></a>

## Stop rules and current non-conclusions

- 不在Discovery inventory完成前大规模删除、合并或重写断言。
- 不以断言总数、正则数量或文件行数作为成功标准。
- 不因断言匹配自然语言、写法脆弱或存在重复，就在证明等效防线前删除安全关键操作规则。
- 不弱化Release allowlist、trusted source、版本角色、链接/anchor、history入口、planning lifecycle或安全失败语义。
- 不修改runtime、Host ABI、installer、trusted graph、Cloud gate、Release流程或版本角色。
- 不把一个代表性case的方案自动扩展到两份文件全部断言。
- 当前没有`KEEP / REPLACE / RETIRE / DEFER`的逐组最终清单，没有选定实施patch，也没有Discovery PASS或implementation授权。

<a name="phase-5-1-opening-baseline"></a>

## Opening baseline (not final cold evidence)

本草稿从local exact source `8cd0155e5f2b86d293f8036f663355c25237a631`打开。该commit只固定Phase 5.0完成后的起点；Phase 5.1
正式关闭时必须重新记录承载完整Discovery结论的exact immutable source，不能把opening baseline冒充final cold evidence。
