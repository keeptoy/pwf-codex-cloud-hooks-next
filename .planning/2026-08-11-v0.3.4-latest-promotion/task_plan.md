# Task Plan: v0.3.4 Latest Promotion Closure

## Goal

只读复核维护者已经执行的 v0.3.4 Latest promotion，更新当前 lifecycle 角色，并把“候选验证 →
Pre-release publication → 公开包验收 → Latest 晋级”写成 ROADMAP 的稳定大白话流程；同时在 AGENTS
固化本地自动 commit、远端写操作由维护者负责的交互纪律。

## Authorization

- 维护者确认已把 GitHub v0.3.4 从 Pre-release 改为 Latest，并要求同步仓库角色与流程文档。
- 允许只读核验远端 Release/tag/asset metadata，修改本地 docs/planning/tests，并在验证通过后自动本地 commit。
- 不允许智能体执行 push、创建/删除/移动 tag、创建/编辑 Release、切换 Latest、上传/删除资产或其他远端写操作。
- Product Phase 4 与下一开发列车不在本计划范围内；作为本次 promotion 同一 lifecycle rotation 的
  v0.3.3 current-tree eviction 明确包含在内，但不删除任何远端历史资产。

## Invariants

- v0.3.4 tag/source、ZIP/bootstrap URL、size、SHA 与 acceptance 字节身份不得改变。
- promotion 只改变 Release 的 Pre-release/Latest metadata 和 ROADMAP lifecycle 角色。
- 晋级后 v0.3.4 为 accepted/Latest，v0.3.3 为 immediate fallback，v0.3.2 为 deeper fallback。
- 本地重要阶段自动 commit 不等于自动 push；远端写操作始终等待维护者执行。

## Gates

- [x] P0 — Read-only postflight：核验 v0.3.4 为非 prerelease/Latest，tag/source 与双资产 metadata 未漂移。
- [x] P1 — Governance update：更新 ROADMAP 四步流程和角色、acceptance/provenance promotion 证据、AGENTS
  交互纪律及对应治理测试；按现有 retirement DoD 移除已退出 candidate+accepted 窗口的 v0.3.3 本地
  bootstrap/acceptance，并把 publication oracle 旋转为 v0.3.4 accepted + v0.3.3 immediate fallback。
- [x] P2 — Local close：运行风险相称回归、确认 sealed/production bytes 未变并自动创建本地 commit；停止在 push 前。

## Next Step

本地 gate 已闭合并停在 push 前。下一步只由维护者把本次本地 commit 推送到远端开发分支与 `main`；
推送后可按需只读确认两条远端分支落在该 commit。不得由智能体代为 push，也不进入 Product Phase 4。

## Decision

`LATEST_PROMOTION_CLOSED / LOCAL_COMMIT_READY / REMOTE_WRITES_MAINTAINER_ONLY / PHASE4_NOT_AUTHORIZED`

## Stop Conditions

- v0.3.4 仍是 prerelease、不是 Latest，或 tag/source/asset identity 漂移。
- 更新角色需要重新上传资产、重建 Release、移动 tag 或修改 sealed bytes。
- 任何修改触及 production/runtime、machine contracts、Host ABI、trusted graph 或 Product Phase 4。
- 需要智能体执行 push 或其他远端写操作才能继续。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| `gh release list --json ...url` 不支持 `url` 字段，首个只读 Latest 查询失败 | 1 | 保留后续成功的 Release/tag metadata；下一次只请求 CLI 明示支持的 `isLatest/isPrerelease/isDraft/tagName` 字段 |
| 把多个语法检查与末尾 `rg` 串在一次只读命令中；`rg` 正常未找到 v0.3.3/v0.3.2 残留却令整条命令返回 1 | 1 | 语法检查本身已通过；后续把“不得匹配”的 `rg` 结果单独判定，不再用聚合退出码误报失败 |
| 首轮聚焦测试 19/21：ROADMAP 关键词顺序正则过强；accepted 角色未被 completion detector 识别，误走 PENDING 分支 | 1 | 把独立事实拆成独立断言；`candidate === accepted` 明确意味着两条前置 Cloud 通道必须完成，再由 acceptance 内容断言证明 |
| 第二轮聚焦测试 19/21：ROADMAP 实际术语为 `zero-hash candidate`；动态 `RegExp` 字符串中的 `\s` 未双重转义 | 2 | 分别断言 Source/Candidate 与 zero-hash candidate；动态正则改用 `[\\s\\S]` 字符串转义 |
| Windows 受限环境中的 `bash -n init-cloud-sandbox-v0.3.4.bash` 无法创建 signal pipe（Win32 error 5）；聚合命令因后续成功步骤最终返回 0 | 1 | 将 Bash 语法检查单独在允许启动 Git Bash 子进程的环境复跑；不采用聚合退出码作为该项证据 |
