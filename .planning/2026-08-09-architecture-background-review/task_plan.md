# Task Plan: Architecture Background Review

## Goal

只读恢复并深入理解当前工作区的项目边界、系统架构、实现布局、programme 状态、活动安全边界以及
关键 machine contracts / source / tests 的对应关系，最后向维护者交付一份证据化架构导览。

## Authorization

- 维护者已授权最小 A4/A5：仅修改 `ARCHITECTURE.md`、`DESIGN.md`、现有 architecture governance test
  与本 planning scope。
- 不修改 production、contracts、README、ROADMAP、历史 acceptance/runbook 或其他权威文档。
- 维护者已授权把本 scope 的精确变化 commit 并 push 到现有 `0.3.2-dev`；不创建 PR/tag/Release/asset，
  不访问或修改 Cloud。
- 不启动 Product Phase 4，不改变 Host ABI、trusted graph、runtime 行为或 release lifecycle。

## Next Step

无。本 scope 内容与发布前复核已完成；本轮按维护者授权执行 Git delivery，不产生新的 architecture gate。

## Phases

- [x] A0 — 恢复 README、ARCHITECTURE、DESIGN、ROADMAP 与前一活动 planning。
- [x] A1 — 枚举仓库结构、关键 contracts 与 production entrypoints。
- [x] A2 — 交叉核对 source/build/install/runtime 数据流与测试保护面。
- [x] A3 — 汇总架构、当前状态、不变量、失败语义和后续阅读路径。
- [x] A4 — 实施最小架构文档精度补丁与 focused guard。
- [x] A5 — 在 DESIGN 展开 Catch-up wrapper/helper 职责边界，并精炼 Architecture 图。
- [x] A6 — 复核双路径、完成完整验证并冻结提交范围。

## Status

A0–A6 全部完成。双路径与文档补丁无冲突；完整 suite、importer、syntax/static checks 通过；远端
`0.3.2-dev` 与本地 HEAD 无分歧，提交范围冻结为本 planning、Architecture、Design 和 governance test。

## Stop Conditions

- 发现工作树存在需保护的用户改动并与只读研究冲突。
- 需要写入 production、扩大 gate、访问 Cloud 或改变远端状态。
- 文档、contract 与源码对核心 Host ABI/trusted graph 结论发生冲突。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell 首次读取 README 未显式指定 UTF-8，中文显示为 mojibake | 1 | 使用 `Get-Content -Encoding utf8` 重读，后续统一显式编码 |
| `Join-Path` 以三个位置参数组合 planning 文件路径失败 | 1 | 先生成 plan directory，再用插值后的精确文件路径读取 |
| Node test runner 在受限沙箱创建 test-file child process 时 `spawn EPERM` | 1 | 归类为 sandbox process limitation；按相同精确命令请求受控权限重跑，不弱化或改写测试 |
