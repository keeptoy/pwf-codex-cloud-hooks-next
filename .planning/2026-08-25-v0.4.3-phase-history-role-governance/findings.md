# Findings: v0.4.3 Phase history role governance

## Initial framing

- `docs/history/`应被新人理解为“精选过的历史过程账本”：它保存有长期解释价值的过程、决定、条件与后继状态，不保存原始聊天、逐命令日志、测试输出或current lifecycle。
- `RETROSPECTIVE_CAPSULE`是回顾型：对象关闭后依据immutable evidence回补，回答“后来如何总览这段历史”。
- `FROZEN_DISCOVERY_RECORD`是探路/决策型：正式Discovery/decision round关闭时冻结，回答“当时为什么这样判断、有哪些条件与停止点”。
- ROADMAP第5节是Product Phase长期摘要和programme authority；history records不能因为内容详细就取代它。
- `v0.4.3-dev`仍是Phase 4上的文档治理patch train，不能从版本变化推断Product Phase 5已经激活。
- 当前稳定package identity仍为`0.4.2`，Release contract也固定`package_version=0.4.2`与外部`init-cloud-sandbox-v0.4.2.bash`；ROADMAP/provenance中的v0.4.2多数是已发布事实，不能机械改号。
- Git历史显示`58a3452 chore: open v0.4.1-dev patch train`先把Release contract从稳定0.4.0切到`0.4.1-dev`，到`8ef5ec6` pre-seal才物化稳定0.4.1；v0.4.2则在`418f8b5` Source/Candidate前直接从0.4.1物化稳定0.4.2。当前v0.4.3预计还有多轮文档治理，应采用前者：先开`0.4.3-dev`，C0前再稳定化。
- 当前直接version输入只有`package.json`、`contracts/release-artifact-v2.json`和唯一bootstrap；已发布ROADMAP/provenance/acceptance中的v0.4.2是历史/角色事实，不属于机械改号面。
- v0.4.2 predecessor transition不能只改`package_version`：其`upstream_canonical_sha256`是已安装manifest的canonical identity，v0.4.2因contract/manifest身份变化与v0.4.1不同，必须从published v0.4.2 oracle精确派生。
- CHANGELOG可以描述“Phase history”变化，但不能写字面`docs/history/`路径，否则会违反README+ROADMAP唯二宏观入口规则；history详情只从README文档地图进入索引。
- immutable v0.4.2 `upstream-manifest.json` canonical SHA为`67bd9c32ae8964fe5ee5ef4290aa9caa564d8e9b8161d153cd8eebcb9ef75b40`；该值已进入0.4.3-dev predecessor transition并重新传播manifest contract hash。

## Open questions

- 当前索引开头是否足够新人友好地先讲“过程账本”，再讲两个machine role名称？
- README文档地图、治理指南与Phase history模板是否已有重复或含混表述需要收敛？
- 哪些版本身份文件属于`v0.4.3-dev`原子改号面，哪些已发布v0.4.2证据必须保持不变？
# Overview authority model discussion — 2026-08-25

- 维护者已创建但尚未跟踪的`docs/overview/phase4-release-note.md`与`phase5-release-note.md`目前均为空；它们属于维护者材料，本轮只读保留。
- 当前重复来源属实：ROADMAP第5节保存Phase路线表和Phase 4长期正文；治理指南8.2又保存一份第4节→第5节轮转事务；history索引与模板也把第5节写成长期authority。
- 把长期Product Phase摘要迁入`docs/overview/`可以降低ROADMAP体积；ROADMAP仍应独占current programme、版本角色、未来Phase路线和“当前指向哪份overview”的指针事务。
- `phaseN-release-note.md`必须明确是**Product Phase release overview**，不是某个SemVer版本的GitHub Release notes。版本delta仍归CHANGELOG，exact tag/ZIP/bootstrap与验收仍归provenance/acceptance。
- 建议第4节只保留exact development train状态、active Product Phase overview链接和授权边界；第5节保留Phase 4～9路线索引，但Phase长期正文迁出。未激活Phase可以只留ROADMAP候选行，避免空overview被误读为已激活authority。
- 轮转规则适合由ROADMAP单独持有，因为它直接控制ROADMAP指针与programme状态；repository-governance-guide只保留通用的history admission/link-retirement原则，并链接ROADMAP规则，不再复制步骤。
- 仍需保留稳定canonical anchor：ROADMAP的轮转规则anchor，以及每份Phase overview自己的Phase-level anchor。history current-authority链接在Phase活动和关闭后都可指向同一overview anchor，列车轮转只更新ROADMAP第4节指针，无需批量把history从ROADMAP第4节迁到第5节。
- 引用盘点显示迁移面不只ROADMAP与治理指南：history模板、history索引、Phase 4.14、Phase 4.1/4.4的`product-phase-4` current links，以及architecture/repository tests都冻结了旧模型；实施时必须原子迁移链接与断言。
- 多份history尾注链接`ROADMAP#product-phase-5`，它们表达的是programme重编号后的未来Phase 5，而不是已形成的长期Phase 5总结。新模型下应继续指向ROADMAP的Phase 5路线anchor；不能因为存在空`phase5-release-note.md`就把未激活Phase提升为overview authority。
- 新模型最好把两类链接分开：ROADMAP保留`product-phase-N-route`用于候选/未激活programme路线；`docs/overview/phaseN-release-note.md#product-phase-N-overview`只在Phase实际激活后成为current/long-term Product authority。

## Work Step B implementation decisions

- 维护者已清除临时`docs/overview/`，工作树在施工前干净；正式结构采用`docs/product-phases/README.md`与`phase-4.md`，模板单独放`docs/product-phase-overview-template.md`，避免模板冒充真实Phase实例。
- ROADMAP第5节改成`Product Phase路线索引`：保留Phase 4～9表与Release-closeout边界，删除5.1/5.2长期正文；Phase 4行链接真实overview，Phase 5继续只作为TBD路线行，不创建overview。
- ROADMAP新增稳定`product-phase-route-index`与`product-phase-overview-rotation` anchors。前者服务未激活Phase路线引用；后者独占current train→overview的指针事务。
- Phase 4 overview保留原5.1.1～5.1.4的长期Product内容，但所有相对链接按新目录重写；精确Release/Cloud证据仍只链接acceptance/provenance，不复制SHA或原始输出。
- 旧`product-phase-4` current-authority链接迁到`docs/product-phases/phase-4.md#product-phase-4-overview`；旧`product-phase-5`重编号尾注迁到ROADMAP的路线索引anchor，因为Phase 5尚未激活。
- repository-governance-guide删除仓库专用8.2轮转正文与旧anchor，只在history通用治理中引用ROADMAP新规则；Phase 4.14按允许的current-link maintenance改链并追加新authority状态说明。
- 稳定测试目前把ROADMAP长期正文、治理指南8.2、Phase 5占位正文与旧current links都写成正向合同；这些是本次应迁移的test authority，而非产品失败。新断言应覆盖目录准入、模板边界、Phase 4 overview内容、ROADMAP路线/轮转唯一性及Release exclusion。
- repository-boundary首个版本测试过去从ROADMAP切出v0.4.2 closeout；新模型必须改为读取`docs/product-phases/phase-4.md`，同时继续证明accepted acceptance与ROADMAP role window不变。

## Work Step B final conclusion

- `docs/product-phases/`现在是已激活Product Phase长期authority；当前只物化Phase 4，Phase 5继续只存在于ROADMAP的TBD路线行。
- ROADMAP第4节只做current train指针，第5节只做Phase 4～9路线索引并独占overview轮转规则；治理指南不再保存第二份仓库状态机。
- history两种record role和原时间语义保持不变；需要current Product authority的链接直接指向同一Phase overview，不再经历第4节→第5节批量迁链。
- Phase overview模板放在authority目录之外，并使用显式relative-link占位符，避免模板自身被误认成真实Phase或复制后继承错误相对路径。
- 新目录、模板和全部history迁链均不进入22-entry Release allowlist；本轮没有修改production/runtime/contract行为。
