# Task Plan: Current-tree Cleanup Audit

## Goal

只读审计 v0.3.4 accepted tree 的生产代码、供应链文件、文档和测试断言，回答哪些仍是必要安全合同、
哪些只是历史形状、哪些可以在下一兼容版本低风险瘦身；特别复核此前三项中已完成的 Phase metadata
退休与 manifest/bundle inventory 去重，以及仍保留的 `ledger-summary.sh`。

## Authorization

- 本轮只授权分析、探路、计划与必要的 planning 记录，不授权删除或修改 production/runtime/contracts/tests。
- 不授权 Product Phase 4、Release、tag、push 或任何其他远端写操作。
- 所有结论必须区分 production reachability、source/import/install/ZIP authority、未来已规划能力与测试价值。

## Gates

- [x] D0 — Inventory：扫描源码、contracts、Release allowlist、文档和测试的职责与引用关系。
- [x] D1 — Reachability and assertion audit：恢复生产调用图，并把测试分为行为安全、供应链安全、治理结构、
  历史形状四类，识别重复或过拟合断言。
- [x] D2 — Recommendation：给出保留、可直接精简、需独立 Discovery/Release gate 三张清单及优先顺序。

## Next Step

审计已完成，停在 `CURRENT_TREE_AUDIT_PASS / NO_DELETION_AUTHORIZED / PHASE4_NOT_AUTHORIZED`；等待维护者
选择是否先开“notice/history/test assertion”兼容清理 gate，或继续开 bundle/manifest/release contract-v2 Discovery。

## Decision

`DISCOVERY_ONLY / NO_DELETION_AUTHORIZED / PHASE4_NOT_AUTHORIZED / REMOTE_WRITES_MAINTAINER_ONLY`

## Stop Conditions

- 建议会改变 runtime inventory、trusted graph、Host ABI、installer authority 或 sealed Release 字节。
- 无法从当前代码和 immutable history 区分历史理由与未来 Phase 4 需求。
- 发现工作树存在归属不明的用户改动。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 三个 PowerShell 只读盘点通过嵌套 `Promise.all` 聚合时整体返回 exit 1，未保留分项输出 | 1 | 不重复聚合方式；改为顺序运行文件清单、引用图和测试规模查询 |
| Windows 上向 `rg` 直接传 `tests/*.test.js`，glob 未由 shell 展开并触发 os error 123 | 1 | 改用目录参数 `tests` 配合 `-g '*.test.js'`；其余 DESIGN/source 索引输出有效 |
| 首次 `git show` 把 commit 参数放在 `-- paths` 之后，实际显示了 HEAD 而非 `60c9b11` | 1 | 改用 `git show 60c9b11 -- <paths>`；成功恢复 overlay retirement 的准确 bundle diff |
| schema runtime-load 搜索没有匹配，导致包含前两段成功 git log 的聚合命令最终 exit 1 | 1 | 将“无 schema runtime load”作为有效负向证据；后续历史查询单独执行并成功 |
| PowerShell 双引号中的 `rg` alternation 含 JSON 引号，转义后形成未闭合正则 | 1 | 不重复复杂转义；改用单引号 pattern，成功取得全部 contract/builder 命中 |
| 受限 sandbox 不允许创建 `.git/index.lock`，planning-only 自动提交未开始暂存 | 1 | 工作树内容未受损；按权限规则在沙箱外重跑精确 `git add` / `git commit` |
