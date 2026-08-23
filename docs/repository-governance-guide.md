<a name="repository-governance-guide"></a>

# Repository Governance Guide

这是一份可复制到其他项目的仓库治理方法。它不规定某个项目的版本号、目录名或发布平台；迁移时应
把文中的角色映射到目标项目，并用该项目自己的 machine contracts、测试和发布规则实例化。

## 1. 治理目标

仓库治理同时保护四件事：

1. 当前源码只有一个权威位置；
2. 历史可恢复，但不会无限堆积在当前工作树；
3. 发布、回滚和测试证据具有明确身份，不能由文件名或口头状态推断；
4. 新人能快速判断“答案在哪里、当前允许做什么、何时必须停止”。

删除旧文件与删除历史不是同一件事。从当前 branch 删除文件，只要不重写 immutable commit、tag 或
Release，它仍可从原始 ref 恢复。治理的目标是保持 HEAD 可维护，而不是抹掉历史。

## 2. 热、温、冷三层

| 层 | 保存内容 | 典型位置 |
|---|---|---|
| Hot | 当前 canonical source、candidate、accepted baseline、活动 planning | 当前 branch/HEAD |
| Warm | 紧凑变更摘要、精选来源索引、当前运维/回滚入口 | 根级 authority docs |
| Cold | 完整旧字节、逐次验收、旧 planning、退役原型 | Git commits、tags、Releases |

Hot 层追求单一权威和快速理解；Cold 层追求精确恢复。不要用不断扩张的 HEAD 同时承担两者。

## 3. 先定义文档权威

每类问题只能有一个主维护位置。推荐最小分工：

| 问题 | 推荐 authority |
|---|---|
| 稳定用户行为、安装和常用命令 | README |
| 架构理由、数据流、信任边界和失败语义 | ARCHITECTURE |
| 模块布局、依赖、改动入口和验证路由 | DESIGN |
| 已经发生的版本变化 | CHANGELOG |
| 当前 programme、candidate、accepted、rollback 状态 | ROADMAP |
| upstream、来源、不可变身份和里程碑索引 | PROVENANCE |
| 当前 Next Step、授权、禁止事项和现场证据 | active planning |
| 完整历史字节和逐次验收 | immutable Git/tag/Release |

其他文件只保留最小摘要和链接，不复制第二份状态表、测试流水或版本角色。

## 4. 区分三类基线

```text
source baseline
  -> immutable release baseline
  -> accepted rollback baseline
```

- Source baseline：开发分支通过相应 gate 并合入 canonical source。
- Release baseline：固定 tag、artifact bytes、checksums，并完成重新下载验收。
- Rollback baseline：真实目标环境验证后，被显式提升为可回退版本。

合并分支只建立 source baseline；本地测试、候选 ZIP 或 RC 都不会自动建立后两种基线。

## 5. 用角色窗口代替固定版本数量

不要写“永远保留最近两个版本”。应定义角色：

| 角色 | 当前树策略 |
|---|---|
| development candidate | 保留当前源码、bootstrap/入口和待完成证据 |
| accepted baseline | 保留当前运维和 rollback 所需入口 |
| immediate previous fallback | 默认使用 immutable 链接；只有明确离线需求才临时保留本地副本 |
| older history | 只在 commit/tag/Release 中保留 |

当 candidate 晋级为 accepted baseline 时，执行一次角色旋转，而不是继续追加新版本文件。

## 6. 当前树分区

建议把路径分为两种治理强度。

### 6.1 Exact zones

适用于能进入执行图或发布字节的区域：

- production entrypoints；
- runtime 与 installer；
- schemas/contracts/manifests；
- Release allowlist；
- executable files、mode、hash 和 installed inventory。

这些区域应使用 exact allowlist、hash、schema 和 producer/consumer tests。未知 drift 通常 fail closed。

### 6.2 Lifecycle zones

适用于非执行治理资料：

- planning；
- operator guide/acceptance，以及保留原名的historical runbook；
- handoff 和研究文档；
- migration notes。

这些区域应验证允许的路径 pattern、活动角色、数量/生命周期、链接有效性和 Release exclusion，而不是
把每个历史文件名永久写入全仓库 exact list。

分区治理不是弱化安全：Release 和 trusted graph 仍保持 exact；只是避免让非执行历史增长绑架执行边界。

## 7. 迭代方式

推荐组合：

```text
branch or worktree
  + one active planning scope
  + canonical source paths
```

不要在版本目录中复制整套 production source。以下结构通常会制造双权威：

```text
iterations/<version>/runtime
iterations/<version>/contracts
iterations/<version>/tests
```

如果确实需要实验目录，它必须明确：

- 不进入 production import/dispatch；
- 不进入 Release；
- 有 owner、预算和退出条件；
- 合并前把有效结论提升到 canonical path，并删除实验副本。

## 8. Planning 生命周期

`.planning/.active_plan` 只选择当前唯一活动 scope，不负责自动删除其他目录。current tree 可以按维护者
控制的节奏暂时保留完整的 completed scope；一个 scope 包含：

- `task_plan.md`：唯一 Next Step、授权、禁止事项、阶段和停止条件；
- `findings.md`：研究、取舍与稳定结论；
- `progress.md`：实施、测试和错误证据。

关闭 scope 时：

1. 把稳定行为提升到正确 authority；
2. 把版本 delta 写入 CHANGELOG；
3. 把 programme/lifecycle 变化写入 ROADMAP；
4. 把重大来源/迁移写入 provenance；
5. 确认完整 scope 已由 commit/PR 保存；
6. 新 scope 激活时只切换 `.active_plan`；completed scope 何时从 current tree 移除，由维护者在单独评审中
   明确决定，不从指针切换自动推导删除授权。

活动 planning 是施工现场，不是永久档案馆；completed scope 可以短期保留，但应由维护者控制数量和退役节奏。

<a name="phase-history-capsules"></a>

### 8.1 已完成 Phase 的精选摘要

如果一个 Product Phase 跨多个版本或 Round，单看 CHANGELOG 很难恢复“为什么选择这条路线”；但把旧
planning 和专项文档整体复制进 HEAD，又会把 cold history 重新变成当前树负担。可以在 warm layer 建立
少量 **Phase capsule**。治理层只冻结生命周期和 authority 边界：

1. Phase 已关闭，并有 immutable commit/tag/Release/acceptance 可以恢复完整原文；
2. 一个闭合阶段只保留一份精选摘要，不按 Round、候选版本、测试批次或会话拆分；
3. 不复制 production source、脚本、fixture、验收全文、SHA 表、测试计数或旧 planning，也不维护当前
   candidate/accepted/rollback、Next Step 或 PASS/PENDING 状态；
4. 摘要正文可以独立理解，完整历史仍从 immutable ref 恢复；
5. 创建后冻结，只允许有证据的事实纠错或 immutable link repair；
6. 所在目录被 Release、installer inventory、trusted graph 与 runtime dispatch 明确排除。

文件名、章节顺序和写作提示统一从 [`Phase 历史摘要模板`](phase-history-template.md) 复制；它们是帮助
上下文恢复的维护约定，不是 repository test 或 machine contract。模板可以随写作经验改进，不要求为此
批量改写已经冻结的摘要。

Phase capsule 是精选历史导航，不是新的 architecture、programme、provenance 或 acceptance authority。
没有长期解释价值的阶段不必收录；讨论中、施工中或只有原型结论的阶段不得提前进入该目录。
Phase history只开放两个受控宏观入口：README/文档地图负责全局索引，只链接Phase目录索引；ROADMAP是唯一
第二入口，只在programme路线需要历史理由时直达具体Phase capsule的稳定显式anchor，不复制目录索引，也不把
历史结论提升成当前programme authority。CHANGELOG、provenance和其他宏观文档不得建立第三入口。Capsule为解释
阶段继承关系可以使用目录内相对链接，但不能借此创建第二份历史索引或把回顾性标签写成当前programme状态。

## 9. Provenance 的准入标准

Provenance 是博物馆目录，不是逐版本流水账。只有以下变化进入里程碑：

- upstream/source pin；
- repository lineage 或重大迁移；
- Host ABI、trusted graph 或激活模型；
- Release、供应链或 rollback mechanism；
- 长期 baseline promotion。

每个里程碑只保存：身份、为什么重要、替代了什么、永久结论和 immutable links。完整命令输出、测试
日志和每个 patch 版本的资产表留在 acceptance、Release 或历史 commit。

## 10. CHANGELOG 的边界

CHANGELOG 记录常规版本 delta，但保持紧凑：

- 只写已经发生的变化；
- 不写当前 Next Step 或未来承诺；
- 不复制 SHA、资产大小和测试流水；
- 不维护 current rollback/Latest 等生命周期；
- 每个版本使用有限的 Added/Changed/Fixed/Compatibility 摘要。

进入新系列且文件明显影响导航时，可以让顶层保留 Unreleased + 当前系列，并链接旧系列的 immutable
Release notes；不要提前创建大量按版本 archive 文件。

## 11. 不可变历史和验收

发布后不得原位改写 tag、asset bytes、URL、checksum 或 acceptance。当前树不需要永久保留每个旧文件，
但清退前必须证明：

- immutable ref 存在；
- 原始字节可恢复；
- 当前文档使用 immutable link，而不是 moving branch；
- rollback 所需入口仍可获得；
- 当前 tests 不再错误依赖已清退的 root copy。

历史 oracle 应验证当前仍承担角色的 baseline。更早版本的完整安全证明由其 tag/Release 和周期性外部
审计承担，不应让每次本地 suite 重跑所有历史实现。

### 11.1 Cloud protocol、Operator Guide 与版本证据

可重放Cloud流程应分成稳定执行协议、一轮验收教程、活动施工状态和宏观角色索引；详细写入规则由
[`Cloud hard acceptance template` 的“文档职责与写入时机”](cloud-hard-acceptance-template.md#acceptance-document-responsibilities)
与[`Cloud acceptance Operator Guide template`](cloud-acceptance-operator-guide-template.md)共同维护：

- [`Cloud hard acceptance template`](cloud-hard-acceptance-template.md)只维护双通道前置条件、信任输入、
  版本中立黑盒提示词、deep-check结构、停止条件和evidence schema；不保存具体版本、commit、资产identity、
  某次PASS/PENDING、Latest/rollback或programme状态；
- Operator Guide template只维护一轮教程的固定章节、Pre-run→channel checkpoint→final Post-run→freeze生命周期与命名路由，不复制稳定
  Cloud脚本或具体Round结果；
- 活动task plan保存当次授权、执行到哪一步、seal输入、URL/SHA、Next Step、失败记录和恢复位置；这些施工状态
  不进入冻结guide；
- Discovery Round是新增risk/behavior claim和验收文档的计数单位。Gate仍是Round内部或Release closeout workflow中的
  授权/停止检查点，Cloud task/stage仍是执行单元；一个guide可以包含多个gate、task和stage；
- single-Discovery版本使用`vX.Y.Z-cloud-hard-acceptance.md`，它就是简化命名的operator guide；多 Discovery 版本
  为每个正式Discovery Round建立一份`vX.Y.Z-<round>-operator-guide.md`，不维护一个累积所有Round全文的巨型
  version acceptance；
- 纯aggregate、evidence closure或retirement closeout只汇总已经冻结的exact records时，不新建guide、不重跑黑盒；
- 同一guide执行前保存Pre-run status；多通道guide的前序通道PASS后可追加channel checkpoint，但它不冻结guide、
  不冒充最终PASS或授权下一gate；声明范围全部闭合后才追加final Post-run并冻结。失败重试、恢复位置和Next Step
  继续留在活动planning；
- Source/Candidate与Published Release是final source和public bytes的两个独立Release通道，可以由同一份Release guide
  编排，但不能共享环境、identity或证据，也不计作两个Product Discovery Round；
- 两轮retirement review只在candidate closeout与accepted role rotation做对象RETIRE/MIGRATE/KEEP判断，不是Cloud
  acceptance；纯review不新建guide、不重复黑盒；
- 普通Release不要求一个固定编号的standing Release Phase。第一轮review作为candidate-readiness retirement checkpoint，
  在Source/Candidate前闭合；第二轮review作为role-window closeout retirement checkpoint，在Latest/postflight后闭合；
- 第一检查点改变任何Release输入时必须重新冻结并运行Source/Candidate；第二检查点不得改写immutable tag、ZIP、
  bootstrap、URL或SHA。两个检查点是同一Release workflow的进入/退出边界，不增加Cloud通道；
- Source/Candidate PASS后，正式tag只指向该Cloud实际通过的candidate commit。第一阶段状态写回commit保存channel
  checkpoint但不替代tag目标；第二阶段状态写回commit保存Published evidence、Latest/postflight、第二检查点与final Post-run；
- 两次状态写回不是额外Cloud验收。普通Release仍只有Source/Candidate与Published Release两个独立环境/身份通道；
- development identity收敛为stable identity时，尚未冻结的single-Discovery acceptance可以原子重命名；已冻结的
  multi-Discovery guide保留原Round身份；
- 已发布或已冻结的acceptance、runbook与operator guide都是带时间语义的冷证据。以后统一新建operator-guide，
  既有runbook与operator-guide保持原名，作为历史文件不批量重命名或回写新模板；
- Cloud protocol template、Operator Guide template及所有具体guide都必须被Release、installed inventory与trusted
  execution graph排除。

这种拆分允许稳定协议跨版本复用，也允许复杂Phase按真实Discovery risk保留多轮证据：活动planning控制施工，
每个guide只承担一轮教程及其channel/final结果，ROADMAP/Phase capsule只做宏观索引，不再把所有层次拼成一份增长总账。

## 12. Promotion 与 eviction 是一个事务

这里的“一个事务”是指同一次 lifecycle rotation，不要求 promotion 与 eviction 位于同一个 commit、PR
或实施 gate。高风险项目可以先完成 pointer/rollback promotion，再用独立 gate 做历史清退；但 eviction
关闭前不得开启下一开发列车，否则临时兼容副本会被下一轮继续继承。

在默认Release closeout workflow中，这个事务由前后两个retirement checkpoint包围：candidate readiness先清理或登记
施工对象，再进入双通道；公开资产验收、Latest和postflight完成后，role-window closeout再执行角色旋转后的清退。
这种前后分工保留两次审查所需的不同信息时点，但不要求Phase 9、六轮任务或额外黑盒。

每次 baseline promotion 都应同时完成清退：

1. 确认新版本的 source/release/rollback 角色；
2. 更新唯一 lifecycle authority；
3. 冻结 immutable assets 和验收链接；
4. 将旧 accepted 降为 previous/older；
5. 移除超出角色窗口的本地 bootstrap、acceptance 和旧 planning；
6. 更新 provenance/CHANGELOG 和交叉链接；
7. 旋转历史 oracle；
8. 运行完整 repository、package 和目标平台 gate；
9. 确认当前树重新回到单一 canonical baseline。

只 promotion 不 eviction，会产生持续膨胀；只 eviction 不验证 immutable refs，会损坏回滚和审计。

<a name="retirement-definition-of-done"></a>

### 12.1 Retirement Definition of Done

旧角色只有同时满足以下条件才算退出当前树：

1. 当前树的版本化 bootstrap、acceptance 和运维入口重新精确等于 candidate + accepted 角色窗口；
2. immediate fallback 默认只由 immutable source、tag、Release、acceptance 和 oracle 恢复；确有离线需求时，
   本地副本必须有 owner、预算和退出条件；
3. README、AGENTS 和可迁移治理指南中的常用命令使用版本无关的发现方式或占位符，不按发布轮次累积
   固定版本文件名；machine contract、bootstrap、provenance 和 acceptance 仍应精确固定其身份；
4. 旧版测试承载的长期安全不变量已经迁入当前版本或版本无关测试，删除旧用例不会删除安全边界；
5. publication oracle 已旋转为 accepted + immediate fallback 两个席位，更早版本退出默认 suite，转由
   provenance、immutable Release 和周期性外部审计保存；
6. 带时间语义的 CHANGELOG、验收和迁移证据保持原义，当前文档只通过 immutable link 引用退役全文；
7. repository、package、publication 和目标平台 gate 全部通过，且当前树不再存在未分类的旧版本引用；
8. 如果 eviction 已改变 Release input，而下一 machine identity 尚未建立，HEAD 必须显式标记为
   unsealed transition；不得用旧版本 bootstrap checksum 安装从该 HEAD 临时重建的 ZIP。

最后一项是临时 fail-closed 状态，不是第四种长期 baseline。下一列车必须重新建立 version/package/
contract/bootstrap 一致的 machine identity 后，才能进入 candidate seal。

### 12.2 Compatibility code 的退休合同

兼容代码不是默认永久资产。只有当前产品明确支持对应来源状态时，compatibility code 才能留在 current
tree；每条路径必须同时登记支持来源窗口、owner、行为测试、fail-closed 语义和 retirement condition。
其中任何一项缺失，都应先进入 Discovery，不能因为函数名带有 `legacy` 就盲删，也不能因为代码仍可运行
就无限期保留。

原型或内测项目可以明确不支持历史版本直接升级。作出该决定后，应同时删除旧迁移算法、历史 manifest/
fixture 分支和不再拥有的 shared-state 读写；遇到无法证明属于当前 ownership contract 的状态时应拒绝接管，
不能猜测迁移或让新旧 handler 并存。Git/tag/Release 继续承担历史恢复，不要求 current installer 重放所有
早期部署路径。

对 pinned upstream 的 patch/overlay 还应额外检查生产调用图：只有当前 trusted behavior 确实依赖 patched
symbol 时，转换链才应继续进入 active source、contract 和 Release。若 owned wrapper 已接管对应职责，只复用
pristine parser helper，则应通过独立 trusted-graph gate 评估恢复 pristine bytes，而不是把旧 overlay 当成
来源证明永久保留。

machine contract 只保存机器实际消费的身份、hash、inventory、ABI 和失败语义。仅用于回忆施工先后的
Phase/Round 元数据，如果不参与运行时、构建或验证语义，应迁往 ROADMAP、CHANGELOG 或精选 history capsule，
不能由 contract test 自我引用后变成永久机器事实。

## 13. 推荐的治理测试

- active pointer 必须解析到唯一存在的 planning scope；
- 当前树不得包含第二套 production/runtime/contracts；
- executable/trusted zones 必须 exact allowlisted；
- docs/planning/experiments 必须被 Release 明确排除；
- Phase history 只能包含被索引覆盖的冻结 Markdown capsule，不得成为源码、脚本或逐 Round archive；
- 当前版本角色窗口不得超限；
- 退役路径、旧原型和 moving artifact URL 必须被拒绝；
- cross-document links 和显式稳定 anchors 必须有效；
- published identity oracle 与当前 candidate tests 分开；
- 稳定文档不得出现具体版本 bootstrap 文件名；使用版本 pattern 检查规则，而不是逐个禁止旧版本；
- 默认 publication oracle 必须恰好覆盖 accepted 与 immediate fallback 两个角色，晋级时替换席位而不是
  复制第三、第四个历史用例；
- Windows/Linux/Cloud 缺失证据必须诚实标记，不得互相替代。

测试应保护规则，而不是冻结某次运行数量或无限增长的历史文件名列表。

稳定架构测试与 lifecycle/历史测试也必须分层：稳定架构测试不得嵌入具体版本 acceptance 路径、发布
commit、资产 hash 或“当前 PASS/PENDING”状态；candidate/accepted 文件窗口由 lifecycle test 根据唯一
角色 authority 派生，精确已发布字节由 publication oracle 验证。角色旋转时替换窗口断言，不在稳定
架构测试中继续追加旧版本；退役路径负断言只保留仍有现实复发风险的精选 tombstone。

## 14. 新项目采用清单

复制本指南后，先填写：

| 项目字段 | 项目选择 |
|---|---|
| canonical source branch | `<branch>` |
| source / release / rollback baseline authority | `<document or system>` |
| exact trusted zones | `<paths>` |
| lifecycle governance zones | `<paths>` |
| active planning pointer | `<path>` |
| candidate / accepted role window | `<rule>` |
| immutable history store | `<Git/tag/Release provider>` |
| Release excluded prefixes | `<paths>` |
| promotion gates | `<tests/platform/approval>` |
| eviction trigger | `<baseline promotion event>` |
| retirement Definition of Done | `<role window / invariant migration / immutable recovery / validation>` |
| publication oracle window | `<accepted + immediate fallback>` |
| optional Phase capsule policy | `<closed phase / authoring template / immutable evidence / Release exclusion>` |

随后按顺序实施：authority map → failing-first guards → history migration → link rewrite → full validation。

## 15. 新人十分钟检查

1. 查看 branch、dirty state 和活动 planning，不覆盖未知现场。
2. 从文档地图找到当前角色、架构、实现、变更和 provenance 的唯一 authority。
3. 区分 repository source、Release artifact 和 installed/runtime state。
4. 确认本轮授权与停止条件。
5. 找到改动对应的 exact zone 或 lifecycle zone。
6. 先运行最近边界检查，再决定是否需要扩大验证。
7. 看到旧文件时先找 immutable ref，不凭“看起来过期”直接删除。

新人不需要背诵所有版本和 hash；需要知道答案在哪里、哪些证据可复现、哪些动作必须另行授权。

## 16. 常见反模式

- 在当前树保留每次 planning、每版 acceptance 和每个 bootstrap；
- 在 README、AGENTS 或通用 operator guide 中逐版追加固定 bootstrap 文件名；
- 为每个历史版本复制一整块 publication test，而不旋转 accepted/fallback 席位；
- 创建 `archive/` 或 `old/` 把膨胀换一个目录继续累积；
- 为每个 Round、测试批次或候选版复制一份“Phase 历史”，让精选摘要重新膨胀成流水账；
- 复制整套源码到版本文件夹，再人工“合回主目录”；
- 把普通 patch 写成 provenance 长篇里程碑；
- 用静态全仓库文件清单同时治理 executable 与活动文档；
- 删除旧文件却不验证 tag/Release 是否能恢复；
- 合并 branch 后直接宣称 Release 或 rollback baseline 已成立；
- 为了测试绿色而弱化 hash、identity、containment、rollback 或 unknown-drift 断言。

好的仓库治理不是保留最多文件，而是让当前事实最清晰、历史最可恢复、晋级和清退都可验证。
