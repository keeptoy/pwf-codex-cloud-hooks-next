# Progress: historical document residue audit

## 2026-08-23 — Entry

- 使用planning-with-files创建只读历史文档残留审计账，并从已关闭状态回补账切换active pointer。
- 开始时`0.4.2`分支与远端同步、工作树干净。
- 审计不会删除、迁移、重命名或修复任何仓库文档；仅planning账本会持久化扫描证据。
- 已复读README与ARCHITECTURE，冻结“历史校准段落≠残留文档”的判断边界。
- 已复读DESIGN与ROADMAP，确认模板、accepted/fallback acceptance和两个Phase 4.8 drift anchors属于合法current职责，历史P9逐stage教程是重点扫描对象。
- 已完成第一轮tracked inventory与旧anchor/filename反扫：docs层未发现旧v0.4.0教程回流；发现21个completed planning scopes和18个重编号compatibility aliases需要进一步核对。
- 已确认21个completed planning scopes全部有Git恢复点；20个在planning外零入链，1个被repository-boundary test直接读取。
- 已区分ignored本地参考与tracked残留：`临时文件/`7份旧验收资料、上游参考树487文件和2个Python缓存均未进入Git。
- 已运行7项聚焦治理测试，全部PASS：稳定anchor、P9-F证据边界、planning lifecycle、文档路径、history双入口、retirement anchors和cold-history dispatch隔离。
- 审计结论已冻结：没有结构性文档断链或旧教程回流；后续retirement候选为18个旧编号alias/test断言，以及21个completed planning scopes（其中1个需先迁移测试证据）。

## Current Status

`HISTORICAL_DOCUMENT_RESIDUE_AUDIT_COMPLETE`
