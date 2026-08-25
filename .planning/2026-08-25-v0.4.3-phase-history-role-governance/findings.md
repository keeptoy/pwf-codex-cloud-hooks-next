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
