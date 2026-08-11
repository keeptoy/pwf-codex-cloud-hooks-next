# Task Plan: Source Logic and Route Analysis

## Goal

深入阅读当前工作区的 production、contracts、installer/build/import 与 tests，形成一份基于源码证据的
逻辑脉络、端到端数据流、信任/失败边界和后续 programme 路线分析。

## Authorization

- 已追加授权：把冻结的架构理解整理为 `docs/history/` 中的 Phase 3.9.1 里程碑，并接入唯一历史索引。
- 不授权修改 production/runtime/contracts/tests，不授权 Phase 4、Release、部署或远端写操作。
- 结论必须区分当前已实现行为、供应链/安装维护路径、历史兼容证据与尚未授权路线。

## Gates

- [x] A0 — Repository and authority recovery：恢复稳定文档、活动 gate、文件清单与工作树状态。
- [x] A1 — Runtime call graph：逐层阅读 adapter、plan、catch-up 与 upstream helper，冻结事件/数据/失败链路。
- [x] A2 — Supply-chain and install graph：阅读 contracts、importer、installer 与 release builder，冻结 source 到 installed/runtime 的信任链。
- [x] A3 — Test and roadmap synthesis：把测试保护面映射到实现，并区分近期兼容清理、独立 contract gate 与未来 Product Phase。
- [x] A4 — Verification and report：运行只读/相称验证，形成最终分析和可继续阅读的源码导航。
- [x] A5 — Phase 3.9.1 maintainer milestone：按历史模板提炼 v0.3.4 逻辑分析、接入索引并验证。

## Next Step

本地文档 gate 已闭合；交接 Phase 3.9.1 摘要、历史索引、验证结果与精确本地 commit，不进入任何后继实施 gate。

## Decision

`DOCUMENTATION_MILESTONE_COMPLETE / NO_PRODUCTION_CHANGES / PHASE4_NOT_AUTHORIZED / REMOTE_WRITES_MAINTAINER_ONLY`

补充：维护者已授权新增 Phase 3.9.1 历史摘要与索引行；该文档动作不扩大 production、Release 或 Phase 4 权限。

## Stop Conditions

- 发现工作树出现归属不明或与本任务重叠的改动。
- 分析需要改变 Host ABI、trusted graph、runtime inventory、Release identity 或外部状态。
- 当前源码与 machine contract/活动 programme 证据出现无法解释的冲突。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 并行聚合 importer/test/syntax 时 Git Bash 在 Windows sandbox 无法创建 signal pipe（Win32 error 5），聚合调用未保留其他分项输出 | 1 | 不重复并行聚合；将 importer、npm、Python/Node/diff 与 bootstrap Bash 分开顺序运行，Bash 平台限制单独分类 |
| `npm test` 在受限 sandbox 中 16 个 test-file worker 全部 `spawn EPERM`，未进入产品 case | 1 | 按权限规则在沙箱外重跑；126 tests / 114 pass / 0 fail / 12 Windows POSIX SKIP |
