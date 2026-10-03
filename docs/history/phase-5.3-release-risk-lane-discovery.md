<a name="phase-5-3-release-risk-lane-discovery"></a>
<a name="phase-5-3-historical-position"></a>

# Phase 5.3：Release 风险车道与证据自动化 Discovery

> Record role: `FROZEN_DISCOVERY_RECORD`

## Historical position

Phase 5.3是Product Phase 5内一轮已经关闭的Release harness治理Discovery。它承接
[`Phase 4.17`](phase-4.17-phase-4-harness-retrospective.md#phase-4-17-historical-position)留下的精简问题，使用
v0.4.1～v0.4.4、一次source-only planning清退和current v0.5.0-dev做历史回放，冻结machine-admitted风险lane、canonical
identity closure、C1耐久恢复点和后继施工顺序。

本记录只保存当时形成的`CONDITIONAL_GO`、五个后继gate与停止条件。它不是classifier实现、reduced lane启用、Phase 5
closeout、Cloud或Release验收。当前Product目标仍只读
[`Product Phase 5 Overview`](../product-phases/phase-5-overview.md#product-phase-5-overview)，当前授权与唯一Next Step仍只读活动planning。

<a name="phase-5-3-problem-before"></a>

## Problem before

现行Release把不可省的供应链身份工作与可以按风险裁剪的行为复验放在同一条保守路径中。任一package字节变化都必须产生
新C0、ZIP/hash、tag和公开资产identity；但runtime、installer、Host ABI和trusted graph完全不变时，完整B～E lifecycle、
跨authority手工抄写和多份状态说明未必都在证明本次变化特有的风险。

直接按文件名或hash降级也不安全。每次正式改号都会连带修改`package.json`、Release/installed-state identity、manifest
integrity hash和versioned zero-hash bootstrap；反过来，v0.4.3的asset materializer/template虽然不进入ZIP，却真实改变正式资产
生成路径。仅看“是否进入ZIP”会漏掉Release mechanics，仅看“哪些hash变化”又会把所有版本误判为FULL。

同时，C1不是多余的第三条Cloud通道：它是Source/Candidate PASS到tag/publication之间当前唯一的仓库耐久恢复点。仓库尚无
独立、content-addressed的外部job/attestation store，立即删除C1会用少一个commit换取更弱的中断恢复与审计能力。

<a name="phase-5-3-opening-evidence"></a>

## Opening evidence and historical replay

回放基线使用前一accepted列车的最终closeout到下一C0，并额外加入source-only与current样本。原始changed path、mode/type、
Release intersection和owner trigger先独立计算，再区分规范identity cascade与剩余semantic delta。

| 样本 | 最高风险触发 | 回放结论 |
|---|---|---|
| planning清退`eb13518^..eb13518` | 无shipped/protocol owner | `SOURCE_ONLY_GOVERNANCE` |
| v0.4.1 | installer path-safety行为 | `PRODUCT_OR_SECURITY` |
| v0.4.2 | Cloud/operator protocol authority | `RELEASE_MECHANICS` |
| v0.4.3 | asset materializer与bootstrap template | `RELEASE_MECHANICS` |
| v0.4.4 | canonical identity closure之外只剩packaged README | `PACKAGE_DOC_ONLY` |
| current v0.5.0-dev相对v0.4.4 C2 | owned-plan admission与runtime-bundle integrity | `PRODUCT_OR_SECURITY` |

六个样本没有出现低于已知历史风险的分类。该结果只证明路线值得进入只读实现实验；当时的分析原型尚未实现exact
identity-closure验证、mode/type防线、policy自保护或持久machine output，因此不能启用reduced lane。

<a name="phase-5-3-core-decisions"></a>

## Core decisions

1. **identity与behavior证据分开。** 新package字节继续要求新identity、确定性ZIP/hash、exact C0/tag和公开资产链；只有
   risk-critical owner/fingerprint变化才天然要求完整Product/security行为复验。
2. **先验证canonical identity closure，再分类semantic delta。** version、Release contract external asset、accepted-predecessor
   snapshot、manifest integrity hash与zero-hash candidate bootstrap只有在全部变化可由规范生成规则解释时才可被归一化；任一
   未解释字段或字节直接升级。
3. **严格优先级与FULL兜底。** `PRODUCT_OR_SECURITY > RELEASE_MECHANICS > PACKAGE_DOC_ONLY >
   SOURCE_ONLY_GOVERNANCE`。unknown path、unsafe type/mode、Host profile变化、证据缺失或classifier/policy自修改一律走当前FULL。
4. **测试变化只使证据失效，不凭自身制造Release。** 测试改动必须重跑相应local suite，也不能作为降低product owner lane的
   理由；仅改Release-excluded测试或治理材料不自动生成版本列车。
5. **保留双identity通道与两次retirement时点。** reduced lane只允许减少通道内部与本风险无关的重复证明，不能合并
   Source/Candidate和Published Release，也不能把retirement review冒充Cloud验收。
6. **近期保留C1/C2。** 先让证据和retirement block由machine生成并投影进现有task plan/operator guide；在独立耐久checkpoint
   经过新Discovery前，不删除C1、不新造竞争authority。
7. **不为版本号本身奖励一次Release。** canonical identity closure存在但没有可发布semantic delta时，classifier应返回
   `NO_RELEASE_REQUIRED`；若维护者仍要求identity-only publication，至少升级为`RELEASE_MECHANICS`并另行授权。

<a name="phase-5-3-classification-evidence-matrix"></a>

## Classification and minimum evidence matrix

后继classifier必须显式接收accepted closeout base与candidate HEAD，不从moving branch或`Latest`猜base。输出至少包括
base/head、changed path与mode/type、Release intersection、identity closure解释、owner fingerprints、lane、失效证据、required
gates、升级理由和unknowns。

| Lane | 最低local证据 | Source/Candidate | Published Release |
|---|---|---|---|
| `SOURCE_ONLY_GOVERNANCE` | affected治理/link测试、相关suite、diff检查 | 无；不开C0、不发布 | 无 |
| `PACKAGE_DOC_ONLY` | full regression、确定性ZIP、package-doc diff oracle | exact checkout、双build/check、archive doc oracle、override install/doctor | public checksum/default download、install/doctor与packaged-doc oracle；behavior fingerprints相同时不重放无关B～E |
| `RELEASE_MECHANICS` | full regression、变更mechanic负向、确定性资产 | build/materialization边界、override install、doctor/inventory与专项检查 | public bootstrap/ZIP、default download、install、doctor/deep inventory；installation/runtime observable变化时升级 |
| `PRODUCT_OR_SECURITY` | 当前完整local、Linux、安全/迁移门槛 | 当前完整Source/Candidate lifecycle与负向 | 当前完整public Fresh/UserPrompt/real Resume/doctor/deep check及rollback/migration |

任何实际Host profile与复用key不符、最小检查失败或输出无法解释时，当前run停止并在更严格lane从其要求的Fresh起点重来；不得把
部分PASS拼成低风险验收。

<a name="phase-5-3-successor-gates"></a>

## Successor construction topology：exactly five gates

后继施工固定为五个串行gate。它们是同一Discovery决定的实施/验证节点，不是五轮新的Product Discovery；每个gate仍需活动
planning和维护者单独授权，前一gate PASS只允许提出下一gate，不自动开工。

| Gate | 施工目标 | 必须产物与退出条件 | 本gate明确不做 |
|---|---|---|---|
| **G1 — advisory classifier foundation** | 建立只读owner/policy与Git delta分类器；base/head必须显式，收集add/delete/rename、mode/type和existing authorities | versioned machine result；unknown/self-change强制FULL；source-only、runtime、Release-tool与package-doc基本负向通过；不修改任何Release输入 | 不归一化identity closure，不选择reduced Cloud步骤，不写workspace/远端 |
| **G2 — canonical identity closure and replay** | 验证package、Release contract、accepted predecessor、manifest hashes与candidate bootstrap的规范cascade，再对剩余semantic delta定级 | v0.4.1～v0.4.4、source-only和current v0.5 fixture全部匹配；false-fast为0；支持`NO_RELEASE_REQUIRED`；当前v0.5保持FULL | 不自动改版本、不生成C0、不启用lane |
| **G3 — evidence plan and projection** | 把lane映射成required local/Linux/Cloud/retirement清单，并幂等生成最小evidence block到现有task plan/operator guide | 无新增authority；重复生成字节稳定；C1/C2仍保留；缺字段/owner/证据时升级；人工字段和重复投影有可测下降 | 不删除C1/C2，不改ROADMAP现行流程，不执行Cloud/Release |
| **G4 — shadow validation on an eligible train** | 等待未来真实`PACKAGE_DOC_ONLY`或`RELEASE_MECHANICS`列车，同时执行classifier建议与现行FULL shadow，比较遗漏、耗时和人工往返 | exact low-risk source、两个identity通道和完整shadow证据；false-fast为0；Host/profile与资产身份一致；异常即回退FULL | 不拿当前v0.5冒充低风险样本，不因缺少合适列车制造空版本，不真正跳过现行gate |
| **G5 — reduced-lane enablement decision** | 基于G1～G4证据决定是否、以及只对哪个lane修改current Release规则 | 独立`GO/CONDITIONAL_GO/NO_GO`、精确lane/evidence合同、rollback和ROADMAP/模板变更授权；未达到证据门槛默认`NO_GO` | 不删除双通道或两次retirement；C1删除与外部attestation仍需新Discovery |

施工依赖固定为`G1 → G2 → G3 → G4 → G5`。G4没有真实合格列车时允许长期`WAITING_FOR_ELIGIBLE_TRAIN`，但不能跳到G5；
G1～G3的本地成功也不能把reduced lane写成现行规范。

<a name="phase-5-3-gate-stop-rules"></a>

## Gate-wide stop rules

- 任一历史fixture被分到低于本记录回放结论的lane，停止当前gate并修正policy；不得为测试绿灯改写历史期望。
- 任何runtime、installer、schema、Host ABI、trusted graph、migration、path safety或source-import integrity变化必须FULL。
- identity closure出现无法由accepted source与规范renderer解释的字段、hash、文件名、mode或字节时必须FULL。
- owner/policy自身变化不得由旧classifier给自己降级；至少按FULL执行local验证，并由独立测试守住fail-closed。
- 实际Cloud Host profile、checkout identity、公开URL/SHA或installed predecessor与classification key不符时，本次证据不可复用。
- C1删除、外部attestation、tag-derived dynamic version、双通道合并或retirement时点变化全部退出Phase 5.3施工范围，重新Discovery。
- G4没有真实低风险列车时等待，不把identity-only版本或当前FULL列车加工成样本。
- 所有远端push/tag/Release/Latest/部署仍由维护者执行；任何gate授权都不扩大智能体远端权限。

<a name="phase-5-3-completed-delivery"></a>

## Completed delivery

- 恢复当前C0/C1/C2、Release allowlist、version identity、C1/C2 evidence owner与Phase 4.17后继要求。
- 用六个历史/current样本验证四级strict-precedence模型，没有发现false-fast分类。
- 识别并冻结“identity closure先验证、semantic delta后分类”这一必要中间层，避免所有版本被raw hash误判为重型mechanics。
- 确认README/Wiki的主要Release-surface拆分已在v0.5.0-dev完成；进一步移出用户README不是risk lane前置条件。
- 比较现行manual C0/C1/C2、generated minimal C1/C2、立即C0+final record、external attestation与tag-derived version路线。
- 冻结五个后继gate、各自退出条件与全局stop rules；未实现classifier或改变current Release流程。

<a name="phase-5-3-acceptance-conclusion"></a>

## Acceptance conclusion

本轮结论为`CONDITIONAL_GO`，只支持维护者后续单独授权**G1只读advisory classifier foundation**。它没有授权G1本身，更没有授权
G2～G5、reduced lane、Cloud、C0、Release或C1删除。当前v0.5.0-dev包含owned-plan admission行为变化，任何候选发布继续使用
`PRODUCT_OR_SECURITY`与现行FULL workflow。

路线成立的核心判据不是“步骤变少”，而是机器能解释所有identity变化、unknown自动升级、历史false-fast保持0，并在真实低风险
shadow列车中证明少做的步骤与本次风险确实无关。任一条件不成立，保持当前较重但可解释的harness。

<a name="phase-5-3-explicit-non-goals"></a>

## Explicit non-goals

- 不实现classifier、identity checker、evidence generator或自动version writer。
- 不修改production、runtime、installer、contracts、Release allowlist、bootstrap template或Host ABI。
- 不创建C0、tag、Cloud task、Release、Latest、rollback或远端状态。
- 不启用任何reduced lane，不让本地Windows证据替代Linux/Cloud。
- 不删除C1/C2、合并双通道或取消两次retirement review。
- 不采用GitHub/external attestation，也不把annotated tag message当作当前C1替代品。
- 不为获得G4样本发布version-only或空semantic delta版本。

<a name="phase-5-3-successor-inheritance"></a>

## Successor inheritance

后继施工先从G1建立只读、只升级风险的advisory surface；G1完成前，现行流程是唯一authority。每次进入下一gate前重读本记录、
当前ROADMAP和活动planning，复核Host/profile、accepted base、owner policy与历史fixtures仍成立。实现细节和运行错误写入新的活动
planning；只有实际实施或live证据形成且具有长期解释价值时，才按模板追加post-implementation/post-live status，不回写本轮原决定。

若未来新平台提供durable attestation，或维护者仍希望删除C1，应另开Discovery比较权限、retention、verification、rollback与中断恢复，
不能把Phase 5.3的“generated minimal C1/C2”解释成“C1已经无用”。

<a name="phase-5-3-post-implementation-status-g1"></a>

## Post-implementation status — G1

维护者随后单独授权G1。实际交付与原设计一致：新增source-only只读classifier和repository-owned owner policy，要求显式base/head，
保留add/delete/rename、old/new mode与object type证据，从exact head读取现有Release artifact authority，并输出versioned
`PWF_RELEASE_RISK_ADVISORY_V1` JSON。unknown path、symlink/gitlink、证据错误及classifier/policy自修改均fail closed到
`PRODUCT_OR_SECURITY`；工具不写workspace或远端。

planning → implementation没有改变trusted graph、Host ABI、runtime bundle、Release allowlist或C0/C1/C2。G1实现刻意没有canonical
identity closure、`NO_RELEASE_REQUIRED`、required-gate选择或evidence投影；这些仍分别属于G2/G3，且G4/G5仍未授权。当前
`v0.4.4..v0.5.0-dev`回放保持`PRODUCT_OR_SECURITY`，一个已完成source-only治理范围得到
`SOURCE_ONLY_GOVERNANCE`且无unknown。disposable Git边界测试和完整Windows回归已通过；POSIX/Linux-only skip与任何Cloud/live
结论均未被本地结果替代。

对象生命周期账保持简单：classifier、policy及其边界测试`KEEP`为Release-excluded source-only维护输入；既有Release/runtime
contracts与现行Release workflow `KEEP`且字节/职责不变。G2若获单独授权，只能消费G1 advisory结果并增加exact identity closure，
不能把本地G1 PASS解释成reduced lane已经启用。

<a name="phase-5-3-post-implementation-status-g2"></a>

## Post-implementation status — G2

维护者随后单独授权G2。classifier升级为`PWF_RELEASE_RISK_ADVISORY_V2`：继续保留完整raw Git delta，同时增加原子的
`identity_closure`与`residual_changes`。它从exact accepted base重建installed predecessor，逐项复核runtime inventory与实际Git
blob hash；candidate bootstrap优先按exact head template渲染，pre-template v0.4.2则只允许从accepted sealed bootstrap精确替换唯一
version和ZIP hash。package、Release contract与manifest只有在identity替换后完整字节可解释时才从residual移除；predecessor或
candidate任一字节、mode/type、path或integrity reference不符时，整组closure不归一化并fail closed到`PRODUCT_OR_SECURITY`。

exact replay ledger固定六个40位commit endpoint。回放结果依次为source-only `SOURCE_ONLY_GOVERNANCE`、v0.4.1
`PRODUCT_OR_SECURITY`、v0.4.2/v0.4.3 `RELEASE_MECHANICS`、v0.4.4 `PACKAGE_DOC_ONLY`和current v0.5
`PRODUCT_OR_SECURITY`，false-fast为0。v0.4.1的历史head已是non-zero sealed bootstrap，不能冒充zero-hash candidate，因而按设计
保守保留FULL；规范identity-only disposable fixture得到`NO_RELEASE_REQUIRED`，tampered fixture则验证原子FULL回退。

G2只修改Release-excluded classifier、owner policy、测试/fixture与本历史状态；package、manifest、runtime/Release contracts、
bootstrap与现行C0/C1/C2字节/职责均未改变。完整Windows回归为193 pass、26个已记录POSIX/Linux-only skip、0 fail；本地结果没有
提升为Linux/Cloud或reduced-lane证据。G3～G5仍未授权，`required_gates`/evidence projection仍不存在，当前v0.5候选继续使用
`PRODUCT_OR_SECURITY`和现行FULL workflow。

<a name="phase-5-3-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable local decision-source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/94ea8a53624de28f6348f29c9f638c99a638fa19)

该exact local commit及其祖先固定本轮planning、历史回放、方案比较与原始`CONDITIONAL_GO`；链接只用于来源审计，不表示该commit
已被远端发布，也不授权五个后继gate。当前contract、programme、Release流程与授权仍只读当前仓库authority。
