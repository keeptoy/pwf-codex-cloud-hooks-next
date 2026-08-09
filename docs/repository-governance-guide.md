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
- runbook/acceptance；
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

当前树通常只应保留 `.active_plan` 指向的一个 scope。一个 scope 包含：

- `task_plan.md`：唯一 Next Step、授权、禁止事项、阶段和停止条件；
- `findings.md`：研究、取舍与稳定结论；
- `progress.md`：实施、测试和错误证据。

关闭 scope 时：

1. 把稳定行为提升到正确 authority；
2. 把版本 delta 写入 CHANGELOG；
3. 把 programme/lifecycle 变化写入 ROADMAP；
4. 把重大来源/迁移写入 provenance；
5. 确认完整 scope 已由 commit/PR 保存；
6. 新 scope 激活时，从当前树移除已完成 scope。

活动 planning 是施工现场，不是永久档案馆。

<a name="phase-history-capsules"></a>

### 8.1 已完成 Phase 的精选摘要

如果一个 Product Phase 跨多个版本或 Round，单看 CHANGELOG 很难恢复“为什么选择这条路线”；但把旧
planning 和专项文档整体复制进 HEAD，又会把 cold history 重新变成当前树负担。可以在 warm layer 建立
少量 **Phase capsule**，前提是同时满足：

1. Phase 已关闭，并有 immutable commit/tag/Release/acceptance 可以恢复完整原文；
2. 一个 Phase 只保留一份摘要，不按 Round、候选版本、测试批次或会话拆分；
3. 使用固定结构记录历史位置、前置问题、核心决定、已交付闭环、验收结论、明确非目标、后继继承和
   immutable evidence；
4. 不复制 production source、脚本、fixture、验收全文、SHA 表、测试计数或旧 planning；
5. 不维护当前 candidate/accepted/rollback、Next Step 或 PASS/PENDING 状态；
6. 创建后冻结，只允许事实纠错或 immutable link repair；
7. 所在目录被 Release、installer inventory、trusted graph 与 runtime dispatch 明确排除。

Phase capsule 是精选历史导航，不是新的 architecture、programme、provenance 或 acceptance authority。
没有长期解释价值的阶段不必收录；讨论中、施工中或只有原型结论的阶段不得提前进入该目录。

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

## 12. Promotion 与 eviction 是一个事务

这里的“一个事务”是指同一次 lifecycle rotation，不要求 promotion 与 eviction 位于同一个 commit、PR
或实施 gate。高风险项目可以先完成 pointer/rollback promotion，再用独立 gate 做历史清退；但 eviction
关闭前不得开启下一开发列车，否则临时兼容副本会被下一轮继续继承。

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
| optional Phase capsule policy | `<closed phase / fixed summary schema / immutable evidence / Release exclusion>` |

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
- 在 README、AGENTS 或通用 runbook 中逐版追加固定 bootstrap 文件名；
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
