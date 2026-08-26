<a name="phase-4-17-historical-position"></a>

# Phase 4.17：Phase 4 harness 重量与后继精简回顾

> Record role: `RETROSPECTIVE_CAPSULE`

## Historical position

Phase 4.17是在v0.4.4完成exact C0、双通道Cloud、immutable publication、Latest与C2之后形成的回顾性interlude。
它回看Phase 4功能列车及其后续安全/文档patch trains，回答一个收官问题：为什么一项很小的README教程变化仍触发完整版本
发布，以及哪些成本是真正的供应链要求、哪些只是当前acceptance harness尚未压缩的人工编排。

本文不是原programme中的新Product Phase，也不是Product Phase 5 Discovery或实施授权。Phase 4长期Product边界继续只读
[`Product Phase 4 Overview`](../product-phases/phase-4.md#product-phase-4-overview)，现行Release流程仍只读
[`ROADMAP`](../../ROADMAP.md#release-four-step-flow)。

<a name="phase-4-17-problem-before"></a>

## Problem before

Phase 4最初解决的是一个窄而高风险的Product问题：在legacy默认不变的情况下，为exact plan增加显式、可撤销且fail-closed的
smart/autonomous context。随着source contracts、installer、rollback、Cloud lifecycle、Release assets、acceptance和文档authority
逐步闭合，仓库同时长成了一套完整harness：它不仅运行产品，也构建产品、验证产品、发布产品、保存证据并轮转版本角色。

v0.4.4暴露了这个harness的边际成本。原始需求只是在README增加维护者tag教程；但README属于Release ZIP allowlist，修改后公开
package字节已经变化。stable version、Release contract、manifest hash、candidate bootstrap、ZIP SHA和tag identity必须诚实地产生
新身份，这部分不能靠“只是文字”跳过。

问题在于，**新字节必须有新身份**不等于**所有旧行为都必须用相同篇幅和人工步骤重新证明**。当runtime、installer、Host ABI、
trusted graph和behavior contracts完全不变时，长篇版本guide、多个文档状态投影、对自然语言句式的测试、手写retirement表格和完整
Product lifecycle重放可能主要证明harness自己仍能运转，而不是发现该变更特有的风险。

<a name="phase-4-17-core-decisions"></a>

## Core decisions

1. **承认这是harness工程。** 当前仓库由窄Product、trusted supply chain和Release/Cloud/governance harness共同组成；评价复杂度时
   必须说明成本属于哪一层，不能把全部仪式都称为Product安全需求。
2. **分开identity与behavior证据。** package任一字节变化都要求新C0、确定性ZIP、checksum、immutable tag/Release和公开资产identity；
   但只有risk-critical behavior fingerprint变化时，才天然要求重跑对应Product/安全行为证据。
3. **快车道必须machine-admitted。** 未来若增加精简lane，必须由Git diff、Release inclusion、contract owners和critical hashes
   计算；未知路径、无法解释的hash变化、Host profile不匹配或证据链缺失一律回退更严格lane。维护者口头说“只改文档”不能降级。
4. **保留双通道身份，不机械复制通道内容。** 真正发布时Source/Candidate继续证明候选source/package，Published Release继续证明
   公开默认下载身份；Phase 5可以研究不同风险lane在两个通道内部各需哪些最小证据，而不是把两个身份合并。
5. **先缩小Release surface。** 用户安装、稳定行为和安全边界仍可留在ZIP内README；维护者专用tag/promotion/closeout教程可以评估
   迁到Release-excluded operator documentation。若类似v0.4.4的变化不再进入package，就不需要为了教程文字开启新版本列车。
6. **自动化状态投影，不再增加人工authority。** C0/C1/C2与两次retirement的语义仍有价值，但exact inputs、hash、required gates、
   role inventory和最小evidence block应由薄harness生成；生成物必须投影到现有authority，不能再造竞争ROADMAP/acceptance的新账本。

<a name="phase-4-17-harness-cost-model"></a>

## Harness cost model

| 层 | 当前真正保护的风险 | 后继可优化方向 |
|---|---|---|
| Product/runtime | parsing、state admission、Host ABI、fail-open/fail-closed、path safety | 只有相关owner/hash变化才重跑对应行为矩阵；未知变化回退完整lane |
| Supply chain/Release | source、allowlist、ZIP、bootstrap、tag和公开资产不可变 | 保持exact identity；把build/seal/publication evidence统一由一条薄命令输出 |
| Cloud lifecycle | Fresh、UserPrompt、real Resume、doctor、default download | 按risk fingerprint选择full lifecycle或最小smoke；公开默认下载链不因本地PASS消失 |
| Governance | ROADMAP、acceptance、provenance、planning、overview的职责分层 | 版本guide只保存增量inputs/evidence/异常；固定教程只在template维护 |
| Retirement | candidate closeout与role-window对象可恢复 | machine生成RETIRE/MIGRATE/KEEP候选清单；planning删除仍由维护者明确决定 |
| Tests | machine contracts、行为负向、文档authority与历史边界 | 稳定断言语义/anchor/schema，减少绑定版本号、行距和中文同义句 |

<a name="phase-4-17-successor-options"></a>

## Candidate lanes for a future Discovery

以下只是Phase 5可以验证的候选模型，不是当前流程：

| Candidate lane | 准入示例 | 候选验证强度 |
|---|---|---|
| `SOURCE_ONLY_GOVERNANCE` | 仅Release-excluded docs/planning/tests，且不改变machine/current authority语义 | 本地文档、链接、治理断言；不开版本列车、不发布 |
| `PACKAGE_DOC_ONLY` | 只改ZIP内用户文档；runtime、installer、contracts、bootstrap template与allowlist fingerprints不变 | 新C0/ZIP/public identity仍保留；研究缩成build/check、default download、install/doctor smoke |
| `RELEASE_MECHANICS` | version、builder、allowlist、bootstrap/template、publication路径变化 | 保留两通道的资产、默认下载和边界验证；按变化补专项负向 |
| `PRODUCT_OR_SECURITY` | runtime、installer、schema、Host ABI、trusted graph、migration/path safety变化 | 继续完整local/Linux/Cloud lifecycle、负向安全与rollback/migration验证 |

证据复用不能只看文件名。未来classifier至少需要固定runtime bundle、installer/adapter、machine contracts、Release allowlist、bootstrap
template、installed predecessor、Cloud Host profile和验收template版本；任何fingerprint变化都必须给出“为何复用仍安全”或提升lane。

<a name="phase-4-17-completed-delivery"></a>

## Completed delivery

- 将Phase 4的最终工程形态明确为“窄Product + trusted supply chain + Release/Cloud/governance harness”，避免后继把全部harness成本
  误认为不可裁剪的Product复杂度。
- 冻结必须保留、可自动化、可按风险裁剪和必须重新Discovery的四类边界。
- 给后继留下风险lane、critical fingerprint、source-only维护者文档、machine-generated evidence与semantic test五个优化方向。
- Phase 4 overview只吸收长期经验；本history record保存问题推导和候选路线，不修改ROADMAP当前programme或Release合同。

<a name="phase-4-17-acceptance-conclusion"></a>

## Acceptance conclusion

本回顾确认v0.4.4的新C0与公开资产身份在现有合同下是必要的：README字节进入package，旧v0.4.3证据不能证明新ZIP。
它同时确认当前流程存在可测量的harness重复成本，尤其是版本guide复制、跨authority人工投影、prose-bound测试和缺少fingerprint
复用；这些成本不应在每个低风险patch中永久线性增长。

本结论只形成Phase 5的Discovery输入。它没有证明任何reduced lane已经安全，也没有授权跳过现行Source/Candidate、Published Release、
retirement或C0/C1/C2流程。实现前必须以真实历史changesets做classifier replay，并证明错误分类fail closed回到full lane。

<a name="phase-4-17-explicit-non-goals"></a>

## Explicit non-goals

- 不修改runtime、installer、contracts、Release allowlist、bootstrap、Host events或Cloud行为。
- 不删除当前acceptance template、双通道、C0/C1/C2或retirement语义。
- 不把source-only、package-doc、Release mechanics或Product/security lane提升为现行规范。
- 不激活Product Phase 5，不分配`0.5.0-*`具体版本，不创建candidate或Cloud gate。
- 不为追求少步骤而允许moving tag、无checksum资产、人工自报风险等级或未知变化fail open。

<a name="phase-4-17-successor-inheritance"></a>

## Successor inheritance

Product Phase 5若选择harness精简方向，应先做Discovery而不是直接删门槛。最低应交付：

1. 用历史patch trains replay的machine classifier，输出changed owners、Release inclusion、critical fingerprints、required lane和升级理由；
2. 明确README用户内容与维护者operator内容的package边界，并验证offline/user documentation没有被误删；
3. 为每个lane冻结最小本地、Linux、Source/Candidate和Published Release证据，以及不能复用证据的触发器；
4. 把版本guide收敛为stable protocol引用与machine evidence delta，避免再次复制固定脚本和提示词；
5. 把Cloud baseline fixture物化为受测、幂等、fail-closed helper，保留真实Resume这一不可模拟边界；
6. 将prose-bound治理测试迁到schema、anchor、owner和关系断言，并证明旧错误仍能被更稳定的断言捕获；
7. 保留一个明确的`FULL`兜底：classifier未知、证据缓存失效或risk owner变化时，不争论，直接执行当前严格流程。

Phase 5只有在“减少人工往返和重复执行”与“错误分类会自动升级而非静默漏验”同时成立时才值得实施；否则宁可保留当前较重但
可解释的harness，不再叠加一层更难维护的框架。

<a name="phase-4-17-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable v0.4.4 C2 source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/053f66e994ca095e974f69a7fbe8f2bb54697fc3)

该链接固定本回顾所依据的Phase 4最终accepted closeout字节；它不解释未来实现。当前contract、programme与Release流程仍以当前仓库
authority为准。
