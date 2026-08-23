# Progress: v0.4.0 stage-guide retirement

## 2026-08-23 — Entry

- 维护者授权直接提交4份旧guide的tracked删除，并明确`临时文件/`只作本机参考、不计入仓库。
- 已完整读取planning-with-files skill并运行session catchup；上一治理plan已关闭且无未同步上下文。
- 初扫发现4组测试和多个Phase capsule仍引用这些root copies，因此需要做有界引用迁移，不能只提交删除。
- 审计确认doc-only guide测试可以退役；current Git lifecycle、evidence schema、rollback/revival与runtime行为测试均独立保留。
- 冻结替代路径：Phase capsule保留历史结论，immutable acceptance/cold snapshot恢复全文，本机`临时文件/`只作ignored reference。
- 首次机械测试清退编排因隔离V8没有`atob`在apply_patch前停止；已确认目标测试无改动，下一次改用JSON文本通道。
- 已删除runbook、F3B3与F3C guide的doc-only测试块；Phase 4.7改为只验证自包含capsule，真实DAG/evidence/rollback测试均保留。
- 已加入`/临时文件/` ignore、4份guide absence/tombstone合同、Phase 4.8/4.10断链修复及Phase 4.14 append-only治理触发说明。
- focused初跑的Git/Python子进程因默认沙箱`EPERM`未执行；纯历史断言发现并修正1处仍冻结旧guide链接的fixture drift。
- 全量history断链审计追加修复Phase 4.3～4.5三处已退役dev acceptance相对链接，并加入immutable-evidence tombstone。
- 实施阶段完成：4份tracked删除待提交，`临时文件/`已被ignore；doc-only tests退出，current行为oracle与Phase capsules保留。
- Phase 4.14 contract新增append-only retirement trigger anchor与版本acceptance/阶段guide不同步清退的回归断言。
- 完整`npm test`在4份guide真实缺席时通过：180 tests、154 pass、0 fail、26个诚实Linux/POSIX skip。
- 完整回归前后`临时文件/`均为7个文件且名称、大小、SHA集合完全一致；没有读写参考字节。
- focused补验通过：Phase 4.8 retirement link contract 1/1，Phase 4.14 retirement trigger contract 1/1。
- broken-link扫描确认history不再相对链接已退役dev acceptance或4份stage guide；current tests只保留4条absence tombstone。
- `git diff --check`无输出；package identity仍为0.4.1，production/contracts/package/Release inputs未修改。
- 已创建单一范围本地清退commit；提交后repository-boundary 13/13 PASS。
- 最终工作树干净，分支领先远端2个本地commit；`临时文件/`继续被ignore，远端写操作未执行。

## Current Status

`COMPLETE / LOCAL_COMMIT_READY / LOCAL_REFERENCES_EXCLUDED`
