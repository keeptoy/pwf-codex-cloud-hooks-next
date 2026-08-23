# Findings: historical document residue audit

## Audit policy

- “旧文档”不等于“历史残留”。合法对象包括：README/ROADMAP链接的warm history、immutable evidence索引、当前accepted/fallback acceptance、模板以及按lifecycle policy保留的completed planning。
- 可疑残留至少满足一项：仍在tracked current tree但不再承担current/history/recovery/test职责；复制已由immutable evidence接管的逐gate教程；形成重复authority；存在current入链却目标已退役；或被tests错误当作必须长期存在的旧教程。
- 本轮只分类和报告，不执行retirement transaction。

## Macro authority reread — README / Architecture

- README文档地图确认当前tree中允许长期存在的宏观文档角色：稳定行为、architecture/design、CHANGELOG、ROADMAP、active planning、provenance、Phase history总索引、handoff与专项acceptance；单凭版本号或旧设计内容不能判为残留。
- ARCHITECTURE仍有少量已退休实现的说明（例如v0.3.2 patcher/overlay），但它们用于解释当前pristine-upstream边界并明确只从immutable source恢复，属于有current架构解释价值的历史校准，不是独立历史文档残留。
- 审计重点应放在独立tracked文档及current引用关系，而不是清除宏观authority中为解释现行不变量保留的最小历史段落。

## Macro authority reread — Design / Roadmap

- DESIGN列出的Cloud template、Operator Guide template、provenance与handoff均有current维护职责，不能按文件名中的acceptance/guide误判为历史残留。
- ROADMAP明确保留的历史直达仅有Phase 4.8两个drift-review实例；v0.4.0/v0.4.1 acceptance分别承担fallback/accepted恢复证据，属于角色窗口内current oracle。
- ROADMAP 4.1确认当前`v0.4.2-dev`只做文档治理且没有RC；因此扫描中若发现新的版本化v0.4.2 acceptance/operator guide，应特别检查是否被提前物化。当前宏观文本本身未宣称存在该文件。
- Phase 9/P9-A～F只允许作为历史时间语义；若当前tree仍有对应逐stage教程且没有current角色，应列为高优先级可疑残留。

## Inventory and first residue findings

- tracked Markdown共106份：根级9、`docs/`32（其中history目录26=索引+25 objects）、`.planning/`63（21个已关闭scope；本轮新scope另有3份尚未tracked）。
- `docs/`非history只剩两个稳定Cloud模板、phase-history模板、repository governance、git-mode文档与当前accepted的`v0.4.1` acceptance；没有tracked `v0.4.0`分阶段guide、runbook或version acceptance残留。
- `.planning/`是主要残留候选：21个已关闭scope仍在HEAD。20个在`.planning`外没有任何current入链；`2026-08-22-v0.4.1-phase-9-release-discovery`仍被repository-boundary test直接读取，形成一个test-pinned completed planning。
- Phase 4.13保留8个旧`phase-4-12-*`alias anchors，Phase 4.14保留10个旧`phase-4-13-*`alias anchors；current tests还显式要求其中旧alias存在。仓库已明确pre-1.0不为无current入链旧anchor保兼容，因此这18个alias及其test断言是确认的治理残留。
- Phase 4.12内部的`phase-9-v0-4-0-*`anchors属于原Release discovery/P9证据本体与历史时间语义，不与上述重编号compatibility aliases同类，不应机械清除。

## Confirmed residue boundaries

- `.planning/`当前保留21个已关闭scope，共63份tracked Markdown；它们全部已有Git恢复点。仓库治理允许维护者控制节奏地暂存completed planning，因此这不是立即违规，但已经构成明确的retirement backlog。
- 其中20个scope在`.planning/`之外没有任何入链，可以作为后续批量退役候选；`2026-08-22-v0.4.1-phase-9-release-discovery`仍被`tests/repository-boundary.test.js`直接读取，不能先删。该测试应在未来retirement transaction中迁移为只读取版本acceptance/provenance，然后再退役账本。
- `phase-4.13-v0.4.1-path-safety-patch-train.md`保留8个旧`phase-4-12-*` alias anchors；`phase-4.14-release-closeout-governance.md`保留10个旧`phase-4-13-*` alias anchors。当前有效文档入链使用新编号，旧alias只剩自包含定义和测试断言；结合仓库pre-1.0不承担无入链兼容包袱的政策，这18个alias及其测试断言属于确认的治理残留，而不是需要删除整份history文档。
- `docs/history/`有25个history object，全部由history总索引覆盖；相关治理测试证明只存在README与ROADMAP两个宏观入口、链接使用稳定显式anchor、cold history未进入runtime/Release/adapter dispatch。未发现游离history文件、断链或第三入口。
- tracked `docs/`没有回流旧`v0.4.0` version acceptance、runbook或分阶段operator guide。当前保留的Cloud模板、Phase模板、治理指南、mode文档与`v0.4.1` accepted acceptance均有current职责。

## Ignored local material

- `临时文件/`由`.gitignore`排除，含7份旧acceptance/runbook/operator-guide，只是维护者本地参考，不属于tracked repository residue。
- `planning-with-files-3.8.2/`是ignored上游参考树，共487个本地文件；`tools/__pycache__/`有2个ignored缓存文件。它们不参与仓库文档治理，也不应在本轮删除。

## Audit conclusion

- 当前仓库没有“旧验收手册重新混入tracked docs”、游离history、宏观第三入口或链接失效这类结构性残留。
- 当前确认的清理对象集中为两组：18个重编号兼容alias及其测试断言；21个completed planning scopes，其中1个先要解除test pin。
- 清理应另开有界retirement transaction：先清alias/test断言，再迁移P9-F测试证据并逐scope核对immutable恢复和零入链后退役planning。本轮未执行任何清理。
