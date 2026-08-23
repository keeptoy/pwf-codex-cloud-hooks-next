# Progress: ROADMAP lifecycle governance review

## 2026-08-23 — Entry

- 维护者提出四项耦合议题：5.5表格收敛、F2同文档链接修复、5.4提升为独立治理章节、history第二入口与模板post-status模型。
- 已完整读取planning-with-files skill并运行session catchup；上一plan complete且无未同步上下文。
- 已建立独立read-only discovery scope；实现等待维护者确认统一方案。
- 已读取ROADMAP目标章节、Product Phase大表、history模板与入口/anchor测试合同。
- 初步确认5.5可吸收进现有Phase 5～8表格；5.4应提升为Discovery之后的版本无关migration治理章节。
- 初步建议把history权限冻结为README+ROADMAP唯二宏观入口，并让ROADMAP只对programme相关历史使用stable exact Phase links。
- 模板应增加可选而非强制的post-implementation/post-live尾注协议；默认闭合摘要继续使用Completed delivery/Acceptance conclusion。
- 已完整读取Phase 4.8两段目标尾注：implementation保留本地/未授权时间语义，live只在真实Cloud后更新生命周期账与结论；另有post-discovery尾注证明状态类型不应被硬编码成仅两种。
- 已审计章节数字耦合：ROADMAP重排只需同步自身“第8节”和architecture contract；其他8.x命中属于独立文档，不应机械改号。
- 已复核治理指南与全仓policy：需要同步的活规则集中在repository-governance-guide、phase-history-template和repository-boundary test；CHANGELOG中的“当时唯一入口”属于历史版本delta，不应回写。
- 只读Discovery完成，统一方案已冻结并等待维护者确认；尚未修改ROADMAP、模板、history policy或测试。
- 维护者确认ROADMAP可作为第二history入口并直达exact Phase stable anchor；实现、测试和本地commit现已授权。
- 已先更新治理测试并取得预期红灯：ROADMAP缺少独立migration章节与两个Phase 4.8 exact-anchor链接；旧history入口合同仍禁止ROADMAP。
- `node --test <files>`在当前Windows sandbox因`spawn EPERM`无法派生runner；语法检查通过，随后改用原进程执行测试文件，确认这是平台执行限制而非产品失败。
- 已把Phase 5～8边界收敛进主表，修复F2 same-file链接，删除重复5.5，并把旧5.4提升为保留兼容anchor的独立第8节。
- 已把Release、rollback与长期路线顺延为第9～11节；Release内部稳定anchors保持不变。
- 新migration章节冻结planning→implementation与implementation→live/lifecycle两个review时点，并只用Phase 4.8两个稳定anchor作历史实例。
- 已同步README+ROADMAP唯二history入口到AGENTS、history索引、治理指南和Phase模板；模板尾注是可选append-only家族，不预填PASS且本地证据不得替代Cloud/live。
- focused验证已绿：architecture contracts 9/9，history双入口目标测试1/1。
- 首次完整回归隔离脚本因本机PowerShell不接受三段`Join-Path`而在测试前停止；`finally`完成归位，7个用户文件的名称、大小与SHA复核均与隔离前一致。
- 修正隔离脚本后完整`npm test`通过：184 tests、158 pass、0 fail、26个诚实Linux/POSIX skip。
- 测试后再次核对`临时文件/`的7个文件：名称、大小、SHA与测试前完全一致；用户移动未被本任务吸收。
- 静态审计通过：`git diff --check`无输出；README恰好1个history索引入口、ROADMAP恰好2个Phase 4.8 exact-anchor入口；其他宏观文档无history直链；旧5.4/5.5和旧裸fragment链接均无残留。
- package identity仍为0.4.1，本任务文件与22-entry Release allowlist交集为零；production/contracts/package/Release inputs未修改。
- 已创建单一范围本地commit；提交后repository-boundary复验13/13 PASS。
- 最终工作树只保留维护者原有的4个guide删除与`临时文件/`未跟踪目录；这些用户改动未被暂存或提交，远端写操作未执行。

## Current Status

`COMPLETE / LOCAL_COMMIT_READY / USER_TEMP_REFERENCES_EXCLUDED`
