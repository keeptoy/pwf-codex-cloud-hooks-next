<a name="phase-4-14-historical-position"></a>

# Phase 4.14：Release closeout 与验收文档治理回顾

## Historical position

Phase 4.14是`v0.4.1`完成发布后，在后继`0.4.2`文档治理列车中形成的**回顾性维护者里程碑**。它没有新增
Product行为、Host ABI、trusted graph、package identity或Release字节，而是重新整理已经跑通过的Release实践：以后怎样
计算Discovery验收轮次、怎样组织Source/Candidate与Published Release、两轮退役审查放在哪里，以及状态commit和正式tag
分别代表什么。

它不是新的Product Phase、Discovery Round或Release acceptance，也不接管Phase 4.12 Release discovery或Phase 4.13
path-safety的详细证据；当前programme顺序只读[`ROADMAP`的Release四步与C0/C1/C2](../../ROADMAP.md#release-four-step-flow)
和[`两个retirement checkpoint`](../../ROADMAP.md#version-train-two-retirement-reviews)，当前授权与实际验收状态仍只读活动planning
与对应版本operator guide。

<a name="phase-4-14-problem-before"></a>

## Problem before

`v0.4.0`和`v0.4.1`第一次建立完整Release生命周期时，曾用P9-A～P9-F把pre-seal、候选Cloud、publication、公开包Cloud、
Latest promotion和第二轮退役逐项拆开。这对首次探路有价值，但后续治理一度把三种不同概念挤进同一个“Phase 9”容器：

- Product验收究竟按Discovery风险计数，还是按gate/task数量计数；
- Source/Candidate与Published Release的双通道是否等于两轮Product Discovery；
- 两轮retirement review是否必须再生成两轮Cloud或六段状态施工。

如果把历史P9-A～F机械复制成未来默认模板，即使普通patch只有一个Discovery，也会产生多轮重复教程、状态同步和仓库提交；
反过来，如果为了省步骤把两个Release通道或两个退役时点合并，又会丢失候选源码、公开资产和角色轮转各自需要的身份信息。

<a name="phase-4-14-historical-p9-calibration"></a>

## Historical P9 calibration

`v0.4.0`与`v0.4.1`的P9-A～P9-F是本仓库首次完整Release探路：它把pre-seal、exact-source候选验收、immutable
publication、公开包Fresh/Resume、Latest角色轮转和第二轮退役逐项拆开，使每个新风险都有独立停止点。该结构证明了这些
职责不能互相冒充，但它不是未来默认模板；普通列车应把相同职责折叠进版本无关Release workflow，而不是保留六段编号。

两条历史列车仍分别恢复：[v0.4.0 Release discovery](phase-4.12-v0.4.0-release-discovery.md#phase-4-12-v0-4-0-release-discovery)保存首次
完整封板与角色轮转，[v0.4.1 path-safety patch train](phase-4.13-v0.4.1-path-safety-patch-train.md#phase-4-13-historical-position)
保存兼容性安全修复如何复用同一Release生命周期。这里仅保留两者共同导出的治理结论，不复制逐gate状态、资产表或验收全文。

<a name="phase-4-14-core-decisions"></a>

## Core decisions

1. **三个维度独立。** Product验收按正式Discovery Round计数；Source/Candidate与Published Release是两个独立Release
   身份/环境通道；retirement review只做对象治理。gate、task、stage和状态commit都不是Product验收轮数。
2. **保留两个退役检查点，但不保留强制Phase 9。** 普通Release不需要另建standing Phase 9，也不复制P9-A～F；
   ROADMAP批准RC且活动task plan授权Release gate后，直接进入版本无关的Release closeout workflow。
3. **第一轮嵌入入口。** `candidate-readiness retirement checkpoint`在Source/Candidate前完成。Product Phase closeout
   已经做过的review可以复用；小型patch/governance列车在candidate baseline closeout做等价审查。任何动作改变Release
   输入，都必须先重新冻结候选再运行第一通道。
4. **第二轮嵌入出口。** `role-window closeout retirement checkpoint`在Published Release、Latest promotion和只读
   postflight后完成，只处理此时才能判断的candidate/accepted窗口对象，不得改写sealed tag、ZIP、bootstrap、URL或SHA。
5. **一个Release guide跨两个通道。** Source/Candidate PASS后追加channel checkpoint但保持guide开放；公开资产通道、
   Latest/postflight和第二检查点闭合后才追加final Post-run并冻结。正常等待维护者publication不是INCOMPLETE。
6. **Cloud与控制面分开。** Release四步继续保留：第1、3步是两次独立Cloud；第2、4步是维护者的Pre-release publication
   与Latest promotion/postflight，不是另外两轮黑盒。

<a name="phase-4-14-c0-c1-c2"></a>

## C0 / C1 / C2 身份与证据流

下图保留Phase 4.14形成时的讨论快照，用于解释三个身份为什么分开，不作为后继版本的执行顺序；当前顺序只读上述ROADMAP入口。

```text
C0：候选源码 commit（SOURCE_CANDIDATE_HEAD）
  → Source/Candidate Cloud PASS
  → 正式验收tag精确指向C0
  → 维护者创建immutable Pre-release并上传已验收ZIP/bootstrap

C1：第一阶段状态commit（SOURCE_CANDIDATE_CHECKPOINT_HEAD）
  → 本地回补第一阶段PASS与channel checkpoint
  → 维护者push治理分支
  → 启动独立Published Release Cloud

C2：最终治理commit（PUBLISHED_RELEASE_CLOSEOUT_HEAD）
  → 回补Published Release evidence
  → 记录Latest promotion/postflight
  → 完成第二轮退役检查与Release closeout
  → 追加final Post-run并同步programme角色
```

三者不能互换：`SOURCE_CANDIDATE_HEAD`是Cloud实际验收通过的候选源码，也是正式tag唯一目标；
`SOURCE_CANDIDATE_CHECKPOINT_HEAD`只记录第一通道证据并推进分支；`PUBLISHED_RELEASE_CLOSEOUT_HEAD`记录公开包、角色轮转和
最终治理闭合。两笔状态commit不是新的Cloud通道，也不能因为位于分支新HEAD就取代C0的tag身份。commit不能在自己的内容中
自引用最终hash，因此由Git历史和本地handoff返回exact HEAD，后继阶段再把已知HEAD作为治理输入。

<a name="phase-4-14-completed-delivery"></a>

## Completed delivery

本轮把上述模型同步到ROADMAP、Cloud hard acceptance template、Cloud acceptance Operator Guide template、repository
governance guide与DESIGN，并增加repository/architecture治理断言：

- 删除未来版本“每条列车必须进入standing Phase 9”的programme规则，同时保留历史Phase 9实例的原名和时间语义；
- 从ROADMAP当前开发区移出已关闭P9流水，把历史校准留在本摘要与版本化Phase history；
- 把两个retirement checkpoint写进Release guide的Pre-run进入边界和Final Post-run退出边界；
- 把retirement programme规则迁入ROADMAP Release章节，并以C0/C1/C2图表达三笔Git身份；
- 冻结Source/Candidate channel checkpoint、Published final Post-run和两笔状态commit的职责；
- 明确正式tag绑定Cloud实际PASS的C0，而不是后继证据commit；
- 保持稳定Cloud B～E/deep-check脚本、production、contracts、runtime、manifest、package和Release allowlist不变。

这次治理也把“多gate版本”纠正为“多Discovery版本”：一个正式Discovery Round对应一轮新增风险的Product验收；Round内
A/B/C施工子门槛和纯aggregate/retirement closeout不机械重跑整套黑盒。真正发布仍固定保留两个Release通道。

<a name="phase-4-14-acceptance-conclusion"></a>

## Acceptance conclusion

本轮证明未来Release教程和programme规则已经使用同一套心智模型：普通列车只需要两次Cloud、两次维护者控制面动作和两次
仓库证据写回；两个retirement review继续保留不同信息时点，但作为同一Release closeout的进入/退出检查点，不再依赖固定
Phase编号。

该结论只证明文档authority、索引、Release exclusion和治理契约闭合。它没有执行新的Source/Candidate、Published Release、
tag、Pre-release、Latest、rollback或对象删除，也不能替代任何具体版本的真实Cloud证据。

<a name="phase-4-14-explicit-non-goals"></a>

## Explicit non-goals

- 不改写`v0.4.0`、`v0.4.1`及更早版本的P9/acceptance历史叙述。
- 不删除两个retirement review，也不把它们合并成一次无法覆盖角色轮转的审查。
- 不合并Source/Candidate与Published Release环境、identity或证据。
- 不让第一阶段状态commit、moving branch或Latest指针取代正式tag的exact candidate身份。
- 不把history摘要变成当前ROADMAP、operator guide、provenance或Release资产账本。
- 不因流程简化自动授权Cloud、push、tag、Release、Latest或后继Product Phase。

<a name="phase-4-14-successor-inheritance"></a>

## Successor inheritance

后续普通版本应从Product Phase/candidate baseline closeout直接进入版本无关Release workflow：先完成candidate readiness，
再按C0→C1→C2闭合双通道和角色窗口。只有出现新增Release风险、迁移、兼容切换或复杂rollback，才增加专项
Discovery/Release hardening gate；不能为了沿用旧编号重新制造Phase 9或P9-A～F。

新增operator guide继续复用统一生命周期：Pre-run → entry retirement checkpoint → Source/Candidate channel checkpoint →
Published Release → Latest/postflight → exit retirement checkpoint → final Post-run → freeze。历史runbook、acceptance和Phase 9
实例继续作为cold evidence保留，不用当前模板批量重写。

<a name="phase-4-14-post-implementation-status-stage-guide-retirement"></a>

## Post-implementation status — v0.4.0 stage-guide retirement

本轮治理随后暴露了一个实际生命周期偏差：早前清退`v0.4.0`版本级black-box acceptance的current root copy时，关联的F3
runbook、smart/autonomous与rollback阶段guide没有在同一retirement transaction中退出；current tests还继续把这些历史教程
当作必须存在的回归资产。结果是版本验收已经由immutable evidence接管，但阶段教程仍滞留current tree，退役只完成了一半。

后续closeout已把边界补齐：4份阶段guide从tracked tree清退，旧全文继续由immutable Git恢复；current suite只保留Git-backed
lifecycle、evidence schema、rollback/revival negative与runtime行为oracle；本机`临时文件/`副本仅供维护者参考并被Git忽略，
不进入repository inventory、Release、Phase history或current authority。这个实例也是本轮为何把对象生命周期账、两次drift
review和Release内嵌retirement checkpoint写成明确规则的直接背景。

<a name="phase-4-14-post-governance-status-history-role-rotation"></a>

## Post-governance status — history roles and Product Phase authority rotation

第一轮Release closeout治理完成后，后续文档审计又确认`docs/history/`实际承载两种不同时间身份：Phase 0～3.9.3与
Phase 4.12～4.14主要是对象关闭后回补的`RETROSPECTIVE_CAPSULE`；Phase 4.1～4.11则是正式Discovery/decision round关闭后
冻结的`FROZEN_DISCOVERY_RECORD`。因此原先把所有history统一限制为“一Product Phase一份摘要”的规则过窄，无法准确解释
Phase 4内部多轮真实Discovery，也会诱导维护者错误合并其conditional-go、stop rules和后续post-*状态。

后续治理据此完成两项深化：

1. repository governance、Phase history模板与索引明确区分两种record role。回补型capsule对同一闭合对象最多一份；正式
   Discovery record按真实Round保留多份，但不能按聊天、测试批次或施工子门槛虚增。既有history文件不重命名、不批量回写，
   原始Discovery结论继续保持当时时间语义。
2. ROADMAP第4节与第5节形成显式authority rotation：Product Phase活动时，第4节维护current train；Round关闭后record可以
   冻结进history并继续把current-authority链接指向第4节；Product Phase closeout后，只把长期Product结论提炼进第5节唯一
   `product-phase-N`，同时把这些current-authority链接迁到第5节；Release完成并轮转前必须确认旧第4节没有current入链。

当前维护默认一条版本列车只承载一个Product Phase；多个Product Phase共用列车只在维护者明确授权后适用。patch train继承它
修补的accepted/candidate Product baseline，documentation/process governance按ROADMAP声明的当前或新version series落位；版本号
用于识别列车，不能独自创建Product Phase。若版本、活动task plan、ROADMAP与实际修补对象不能给出唯一归属，智能体必须先把
候选归属和影响交给维护者确认，不能为了完成第4节轮转自行虚构第5节条目。

这项后续治理只补齐history身份、current/long-term authority与列车轮转的文档模型，没有修改production、contracts、runtime、
package或Release字节，也没有授权`0.4.2`候选封板、Cloud、publication、Latest或下一Product Phase。详细current规则只见
[repository governance guide](../repository-governance-guide.md#product-phase-authority-rotation)与ROADMAP；本节继续只是带时间语义的
历史回补。

<a name="phase-4-14-post-governance-status-post-pass-retirement-ordering"></a>

## Post-governance status — post-PASS retirement ordering

`v0.4.2`候选准备期间，维护者又收窄了本章早期形成的“入口/出口检查点”表达：两轮真实retirement review都应等待对应验收
PASS。Source/Candidate前仍保留`candidate admission preflight`，但它只读inventory、分类、恢复证据与风险，不删除任何对象。
原因很直接：Source/Candidate失败时，旧planning、恢复材料和回滚线索必须仍在，不能让提前清退增加排错与回滚难度。

第一通道PASS后才执行`source-candidate closeout retirement checkpoint`，并让C1保存第一通道与第一轮真实退役结论；Published
Release PASS且Latest/postflight完成后，才执行`role-window closeout retirement checkpoint`，并让C2保存第二轮真实退役和最终
closeout。这样C1、C2记录的都是已经发生的检查，不是“准备以后检查”的承诺。planning的实际删除仍须维护者按
[Planning生命周期](../repository-governance-guide.md#planning-lifecycle)明确决定。

第一轮还有一条fail-closed边界：只有Release-excluded planning、临时教程和脚手架适合在PASS后提出清退。若拟退役对象会改变
package、contract、runtime、bootstrap、ZIP allowlist或其他C0 Release输入，就不能沿用原PASS，必须形成新C0并重新运行
Source/Candidate。本节保留这次后续精炼的原因；当前执行顺序仍只读
[`ROADMAP` Release四步](../../ROADMAP.md#release-four-step-flow)与
[`ROADMAP` 两轮retirement review](../../ROADMAP.md#version-train-two-retirement-reviews)。

<a name="phase-4-14-post-governance-status-readme-release-handoff"></a>

## Post-governance status — README Release handoff

`v0.4.2`的Source/Candidate暂停期间，维护者发现稳定Release工具虽然已经存在，但根README缺少一段可以直接复制的手工交接：
怎样执行candidate build/check/hash、怎样把本地中间ZIP准备成正式版本资产，以及标准bootstrap封板时到底改哪些字段。后续治理
把这些说明提升到根README，明确标准命名不变时只替换`HOOKS_VERSION`与exact `HOOKS_SHA256`；`HOOKS_PACKAGE`和`HOOKS_URL`
由前者派生，固定安全字段不能顺手改写。

第一版说明随后暴露了新人阅读顺序问题：读者第一次接触流程时会先看到旧证据作废警告，却还不知道`C0`、
`Source/Candidate`和`Release-excluded`分别是什么。最终README先用三条大白话解释这三个术语并提供ROADMAP唯一流程入口，
再说明`README.md`本身也是Release ZIP输入。这样“为什么只改文档也可能重建候选”先有上下文，同时继续保持fail closed：
如果README在第一通道PASS后变化，旧证据必须作废，形成新C0并重新运行Source/Candidate。

由于README进入Release allowlist，本轮不是纯Release-excluded治理改动。最终本地zero-hash候选已重新完成双构建/check：
22 entries、87,386 bytes、SHA-256 `d1547ab50afcc3a275592d41b60daa77ab1062c97c072be3661cfe763467264e`，两份字节一致。
这只是C0前本地候选快照，不是Source/Candidate PASS、sealed bootstrap或public asset证据；当前列车状态仍只读
[`ROADMAP` v0.4.2 current train](../../ROADMAP.md#v0-4-2-release-closeout)，exact执行证据继续由活动planning和版本operator guide承接。

<a name="phase-4-14-post-governance-status-maintenance-environment-memory"></a>

## Post-governance status — persistent maintenance environment memory

README Release handoff闭合后，维护者继续发现一类相同的生命周期风险：本机WSL、容器与Linux证据边界虽然已经写进AGENTS和
活动planning，但planning会按生命周期清退，AGENTS也不适合扩张成带日期的环境事实流水账。若没有独立持久层，后继任务要么
遗忘限制并重复搜索，要么把旧机器事实误当永久平台合同。

后续治理因此建立一份可更新的[维护机执行环境档案](../maintenance-environment-profile.md#maintenance-environment-profile)。档案只保存
经过维护者陈述或只读探测确认的跨阶段结论，并为每项事实同时登记适用执行面、核对日期、影响、默认解决方案与重验触发器；
原始命令、输出和单次错误继续留在planning。AGENTS只保留强制入口与执行摘要，MAINTAINER_HANDOFF提供人的发现链，repository
governance则冻结“已确认的长期限制不得只留planning”的提升与隐私规则。

这份profile不是Host ABI、Product合同或永久机器承诺；只有维护者说明环境变化、实际信号冲突、有界安装授权或新primitive需求
才触发重验。它与本轮ROADMAP/history/tests/planning同步都属于Release-excluded，没有改变候选ZIP字节；但新的治理commit仍会
成为下一次exact source C0。Source/Candidate状态保持`PENDING`，本节不冒充本地平台重验、Cloud PASS或公开资产证据。

<a name="phase-4-14-post-governance-status-acceptance-directory-migration"></a>

## Post-governance status — staged acceptance directory migration

Source/Candidate继续暂停期间，维护者又审查了根目录与`docs/`的文档分区。preflight确认权威级别、目录位置和Release ZIP输入
是三个独立维度：根README仍是全局文档地图，repository governance仍是`docs/`内的专项唯一authority；不能为了视觉对称把
所有Markdown下沉，也不能让每个singleton各占一个目录。

更关键的边界来自冻结证据：`v0.4.1` acceptance已经关闭整条Release列车，其中template链接和Cloud提示词硬编码了当时的
`docs/`根路径。已发布acceptance不可原位改写；若现在批量移动template，要么破坏教程，要么保留旧副本形成双authority。
因此本轮只把未冻结的`v0.4.2` candidate迁入`docs/acceptance/`，`v0.4.1`冻结guide与三个template继续原路径`KEEP`。

这不是永久双目录规范，而是由版本角色拥有的迁移窗口：v0.4.1根级副本继续承担accepted职责；v0.4.2通过Published Release、
Latest/postflight后，在C2第二retirement checkpoint把v0.4.1 current入口迁到exact immutable closeout证据并清退本地副本。
目录README不复制当前版本表，只把读者导向ROADMAP和治理指南。整个迁移、状态同步与测试都被Release allowlist排除，根README
未修改，22-entry候选ZIP输入不变；新的source commit仍将成为下一C0，Source/Candidate继续`PENDING`。

<a name="phase-4-14-post-governance-status-canonical-baseline-tool-capability"></a>

## Post-governance status — canonical baseline tool capability

`v0.4.2` Source/Candidate真实Cloud运行暴露了C步骤的教程能力闭环问题。B的“不要调用工具”限制已经在进入C时结束，但C自己又
要求先用独立只读文件工具核对`.planning`目标是否存在，同时禁止Shell。实际Cloud会话只提供Shell型读取与apply_patch；模型若
跳过检查直接Add File，就可能违反“存在即停止、不得覆盖”，因此首次安全拒绝是正确的fail-closed行为。

维护者临时授权只读Shell检查后，canonical fixture与后续Resume/deep check全部通过。稳定修正不是放开Shell施工，而是把临时
授权收窄为template合同：只有会话缺少独立只读文件工具时，才允许在apply_patch前对exact `.planning`路径执行存在性、类型和
active pointer读取；Shell仍不得写入、重定向、删除、移动、commit、push或创建PR，fixture正文仍只能由apply_patch创建。

这次发现和修正发生在Source/Candidate PASS后的C1回补中，只改变Release-excluded template、版本guide、治理状态、tests与planning，
没有修改package、contract、runtime、bootstrap或ZIP allowlist。故已验收C0保持有效，正式tag继续精确指向C0；Published Release、
Latest与第二轮role-window closeout仍未发生。current顺序与状态只读ROADMAP和版本acceptance，本节只保存设计原因。

<a name="phase-4-14-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/86032ef9343cc9935e91f3f358f2642d01f26bd6)

该链接只证明本轮治理落地时的exact仓库状态，不解释未来current实现；当前programme、Release流程、授权与行为仍以当前仓库
authority为准。
