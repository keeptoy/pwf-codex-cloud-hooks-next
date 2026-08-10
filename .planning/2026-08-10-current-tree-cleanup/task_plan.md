# Task Plan: Low-risk Current-tree Cleanup

## Goal

在不改变 production、Host ABI、trusted graph、Release 字节或版本角色的前提下，清理 current tree 中已由
immutable history 覆盖的 v0.3.2/旧架构文件，恢复当前实现权威，并让治理测试与仓库生命周期政策一致。

## Authorization

- 维护者已删除 v0.3.2 bootstrap、v0.3.2 Cloud acceptance、旧架构快照，并明确授权先实施低风险
  current-tree 清理。
- 本 gate 允许恢复误删的当前 `DESIGN.md`，同步 ROADMAP/provenance/CHANGELOG 与 repository guards，
  以及轮换已完成的活动 planning。
- 本 gate 不授权 runtime、installer、contracts、manifest、Release ZIP/bootstrap、GitHub 状态、外部部署、
  Phase 4 Discovery 或 Phase 4 实现。

## Invariants

- `v0.3.3` 继续是 accepted/Latest；immutable `v0.3.2` 继续是 immediate fallback。
- 当前本地版本文件窗口只由 candidate + accepted 的去重版本决定；fallback 通过 immutable source/tag/
  Release/acceptance oracle 恢复，不要求在 current tree 保留其 bootstrap 或 acceptance 副本。
- `DESIGN.md` 继续作为当前实现导航权威；根目录不得保留 `ARCHITECTURE-old-*` 快照。
- 已发布 tag、Release 资产、SHA、sealed source 与 oracle 不改写。

## Gates

- [x] C0 — 恢复证据并冻结范围：完成强制文档/活动 planning 阅读、工作树盘点与维护者授权确认。
- [x] C1 — Authority/lifecycle cleanup：恢复 `DESIGN.md`，保留三个历史文件删除，修正文档窗口和 immutable 链接。
- [x] C2 — Guard hardening：修正 role window/旧快照断言，并补 current authority/版本文件真实存在性检查。
- [x] C3 — Planning rotation：退休已完成 G13 scope，只保留本活动 scope。
- [x] C4 — Verification：focused guards、published/release oracle、完整 suite、import/syntax/bootstrap/diff 检查。

## Next Step

本 gate 已完成，停在 `CURRENT_TREE_CLEANUP_PASS / PHASE4_NOT_AUTHORIZED`；等待维护者审阅、提交或决定
是否另开兼容版本的 runtime 瘦身设计 gate。

## Stop Conditions

- 任何修改要求改变 runtime、contract、installer、manifest、Release allowlist 或已发布资产。
- v0.3.2 immutable source/tag/Release/acceptance oracle 无法独立恢复 immediate fallback。
- focused/full suite 暴露 production defect、published asset drift 或需要 Linux/Cloud 才能判定的新行为变化。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| focused `node --test` 在受限 Windows sandbox 中启动 test-file child 时统一 `spawn EPERM` | 1 | 未执行断言；获批后在沙箱外原命令重跑 |
| focused 23 项中 1 项仍冻结三席本地文件窗口 | 1 | 分拆为 candidate + accepted 本地文件窗口和 accepted + immediate fallback publication oracle 窗口 |
| 完整 `npm test` 在受限 Windows sandbox 中 16 个 test file 均于启动时 `spawn EPERM` | 1 | 未执行产品断言；沙箱外原命令完整重跑 |
| Git Bash 在受限 sandbox 创建 signal pipe 时返回 Win32 error 5 | 1 | 沙箱外对同一 v0.3.3 bootstrap 执行 `bash -n` |
