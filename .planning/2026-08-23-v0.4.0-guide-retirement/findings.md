# Findings: v0.4.0 stage-guide retirement

## Initial context

- 早前已清退v0.4.0版本级black-box acceptance root copy，但4份关联阶段guide仍留在current tree，并继续被测试当作现行回归资产。
- 这些guide的完整字节已经在immutable Git历史中可恢复；维护者把副本放入本机`临时文件/`仅供分析参考，不应进入仓库。
- 直接提交删除会使repository-boundary、F3 lifecycle、F3B protocol与F3C rollback测试失败，并造成若干Phase capsule相对链接断裂。

## Replacement rule

- 当前产品行为继续由production/contracts/current behavioral tests负责。
- Phase当时为何这样实施、实际Cloud结论与生命周期偏差由自包含Phase capsule负责。
- 旧guide全文只由immutable commit/tag恢复，不再要求current root copy。

## Dependency audit

- `tests/f3-lifecycle-foundation.test.js`中的F3 runbook块只检查旧文档anchors、措辞与内嵌Bash；同文件的repository admission、Git-backed activation/disarm及Phase 4.6～4.11历史结论测试独立存在。
- Phase 4.7测试同时读smart guide与Phase capsule；guide部分只重复字段名和期望值，Phase capsule本身已经冻结Cloud结论、状态层和停止条件，因此移除guide读取后保留history断言即可。
- `tests/f3b-protocol.test.js`的runbook/F3B3 guide两块是doc-only oracle；disposable Git DAG和evidence-record validator测试继续承担current行为边界。
- `tests/f3c-rollback-protocol.test.js`的guide块是doc-only oracle；同文件的accepted/current角色、exact predecessor、rollback/recovery和revival-negative行为测试继续保留。
- `tests/repository-boundary.test.js`仍把3份operator guide列为P9-F durable regression assets，并把runbook列为required governance path；这正是需要轮转的旧角色断言。
- Phase 4.8与4.10有4处相对链接指向将删除guide；Phase 4.10另有已断开的dev acceptance相对链接。详细结果可由immutable v0.4.0 acceptance和各capsule的Cold evidence恢复，不需current root copy。
- 全量断链扫描还发现Phase 4.3～4.5各有1处相对链接指向早已清退的dev acceptance；stable v0.4.0 immutable acceptance保留相同anchors，可无损迁移。

## Retirement decision

- RETIRE：4份tracked stage guide与所有只验证其current root-copy结构的doc-only测试。
- KEEP：current production/contracts、Git-backed lifecycle tests、evidence validators、rollback/revival negatives和Phase capsules。
- MIGRATE：Phase 4.3～4.5、4.8、4.10断链改为自包含叙述或immutable acceptance；Phase 4.14补充“版本acceptance先退、阶段guide遗漏”这一治理触发背景。
- LOCAL ONLY：`临时文件/`7份参考字节保持不变，通过根`.gitignore`排除，不进入Git inventory、Release或history authority。
