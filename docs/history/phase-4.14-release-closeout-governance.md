<a name="phase-4-14-historical-position"></a>
<a name="phase-4-13-historical-position"></a>

# Phase 4.14：Release closeout 与验收文档治理回顾

## Historical position

Phase 4.14是`v0.4.1`完成发布后，在后继`0.4.2`文档治理列车中形成的**回顾性维护者里程碑**。它没有新增
Product行为、Host ABI、trusted graph、package identity或Release字节，而是重新整理已经跑通过的Release实践：以后怎样
计算Discovery验收轮次、怎样组织Source/Candidate与Published Release、两轮退役审查放在哪里，以及状态commit和正式tag
分别代表什么。

它不是新的Product Phase、Discovery Round或Release acceptance，也不接管Phase 4.12 Release discovery或Phase 4.13
path-safety的详细证据；当前programme、版本角色、授权和实际验收状态仍只读ROADMAP、活动planning与对应版本operator guide。

<a name="phase-4-14-problem-before"></a>
<a name="phase-4-13-problem-before"></a>

## Problem before

`v0.4.0`和`v0.4.1`第一次建立完整Release生命周期时，曾用P9-A～P9-F把pre-seal、候选Cloud、publication、公开包Cloud、
Latest promotion和第二轮退役逐项拆开。这对首次探路有价值，但后续治理一度把三种不同概念挤进同一个“Phase 9”容器：

- Product验收究竟按Discovery风险计数，还是按gate/task数量计数；
- Source/Candidate与Published Release的双通道是否等于两轮Product Discovery；
- 两轮retirement review是否必须再生成两轮Cloud或六段状态施工。

如果把历史P9-A～F机械复制成未来默认模板，即使普通patch只有一个Discovery，也会产生多轮重复教程、状态同步和仓库提交；
反过来，如果为了省步骤把两个Release通道或两个退役时点合并，又会丢失候选源码、公开资产和角色轮转各自需要的身份信息。

<a name="phase-4-14-historical-p9-calibration"></a>
<a name="phase-4-13-historical-p9-calibration"></a>

## Historical P9 calibration

`v0.4.0`与`v0.4.1`的P9-A～P9-F是本仓库首次完整Release探路：它把pre-seal、exact-source候选验收、immutable
publication、公开包Fresh/Resume、Latest角色轮转和第二轮退役逐项拆开，使每个新风险都有独立停止点。该结构证明了这些
职责不能互相冒充，但它不是未来默认模板；普通列车应把相同职责折叠进版本无关Release workflow，而不是保留六段编号。

两条历史列车仍分别恢复：[v0.4.0 Release discovery](phase-4.12-v0.4.0-release-discovery.md#phase-4-12-v0-4-0-release-discovery)保存首次
完整封板与角色轮转，[v0.4.1 path-safety patch train](phase-4.13-v0.4.1-path-safety-patch-train.md#phase-4-13-historical-position)
保存兼容性安全修复如何复用同一Release生命周期。这里仅保留两者共同导出的治理结论，不复制逐gate状态、资产表或验收全文。

<a name="phase-4-14-core-decisions"></a>
<a name="phase-4-13-core-decisions"></a>

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
<a name="phase-4-13-c0-c1-c2"></a>

## C0 / C1 / C2 身份与证据流

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
<a name="phase-4-13-completed-delivery"></a>

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
<a name="phase-4-13-acceptance-conclusion"></a>

## Acceptance conclusion

本轮证明未来Release教程和programme规则已经使用同一套心智模型：普通列车只需要两次Cloud、两次维护者控制面动作和两次
仓库证据写回；两个retirement review继续保留不同信息时点，但作为同一Release closeout的进入/退出检查点，不再依赖固定
Phase编号。

该结论只证明文档authority、索引、Release exclusion和治理契约闭合。它没有执行新的Source/Candidate、Published Release、
tag、Pre-release、Latest、rollback或对象删除，也不能替代任何具体版本的真实Cloud证据。

<a name="phase-4-14-explicit-non-goals"></a>
<a name="phase-4-13-explicit-non-goals"></a>

## Explicit non-goals

- 不改写`v0.4.0`、`v0.4.1`及更早版本的P9/acceptance历史叙述。
- 不删除两个retirement review，也不把它们合并成一次无法覆盖角色轮转的审查。
- 不合并Source/Candidate与Published Release环境、identity或证据。
- 不让第一阶段状态commit、moving branch或Latest指针取代正式tag的exact candidate身份。
- 不把history摘要变成当前ROADMAP、operator guide、provenance或Release资产账本。
- 不因流程简化自动授权Cloud、push、tag、Release、Latest或后继Product Phase。

<a name="phase-4-14-successor-inheritance"></a>
<a name="phase-4-13-successor-inheritance"></a>

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

<a name="phase-4-14-immutable-evidence"></a>
<a name="phase-4-13-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/86032ef9343cc9935e91f3f358f2642d01f26bd6)

该链接只证明本轮治理落地时的exact仓库状态，不解释未来current实现；当前programme、Release流程、授权与行为仍以当前仓库
authority为准。
