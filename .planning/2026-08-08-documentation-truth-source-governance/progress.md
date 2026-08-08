# Progress: Documentation Truth-Source Governance

## 2026-08-08 — D0 planning activation

- 使用 `planning-with-files` 建立独立、多阶段文档治理状态。
- session catch-up 无未同步输出；修改前工作树只有旧活动计划的三份维护者授权修订。
- 创建本计划的 task plan、findings、progress，并将 `.planning/.active_plan` 切换到本目录。
- 冻结“一类事实一个真理源、其他位置最小摘要+链接”的基本原则。
- 识别 README 为 sealed v0.3.1 ZIP 输入；在身份路线明确前不修改 README。
- 本轮尚未修改 README、ROADMAP、ARCHITECTURE、AGENTS、contracts、tests 或任何 Release 字节。

## Current status

- D0: complete
- D1: complete — CONDITIONAL GO
- Identity decision: waiting for maintainer choice
- D2–D5: pending and unauthorized

## Validation record

| Check | Result |
|---|---|
| Pre-plan catch-up | PASS — no unsynced report |
| Pre-plan Git state | PASS — only three known old-plan files modified |
| New plan file set | task plan, findings, progress plus active pointer |
| Product/macro-doc edits | none |

## 2026-08-08 — D1 authority inventory and design freeze

- 枚举根级宏观文档、专项 docs 和 machine-contract/test 边界的全部标题与职责。
- 搜索 current rollback、Product Phase 4、Next Step、PWF support、Cloud `/opt/codex` 和 Release seal
  顺序的跨文档重复，区分 harmful duplicate、intentional summary 与 historical snapshot。
- 完整复核 README/ROADMAP，重点复核 AGENTS、ARCHITECTURE Release 边界、handoff 和 provenance 的
  当前角色段落。
- 确认 README 属于 v0.3.1 exact 23-entry ZIP；当前 release test 会从工作树重建并断言
  `f097b040...31f9`，architecture test 则保护 README tag-time snapshot。
- 冻结 authority matrix、摘要/引用规则、五个迁移批次、validation matrix 和 stop conditions。
- D1 verdict：`CONDITIONAL GO`。推荐先建立 `0.3.2-dev` documentation-governance identity；若不选择
  新身份，只能先治理 ZIP-excluded 文档并延后 README。
- 本阶段仍只修改 planning 和 active pointer；未修改任何宏观文档、产品、测试或 Release 字节。
- Planning-only validation PASS：旧计划三文件修订完整保留；新计划三文件与 active pointer 是其余
  精确变更；所有 planning 文件均为 UTF-8/no BOM、LF、final newline、无尾随空格、fence 平衡，且
  `git diff --check` 通过。

## Error log

| Error | Attempt | Resolution |
|---|---:|---|
| None | 0 | D0 completed cleanly. |

## 5-question reboot check

| Question | Answer |
|---|---|
| Where am I? | D1 complete; stopped at Release identity decision |
| Where am I going? | Selected identity route, then separately authorized R0/D2 implementation |
| What's the goal? | One truth source per question domain; other documents summarize and link |
| What have I learned? | README governance crosses the sealed Release-input boundary; current mutable facts are duplicated across five macro docs |
| What have I done? | Froze authority, migration and validation design without editing macro/product documents |
