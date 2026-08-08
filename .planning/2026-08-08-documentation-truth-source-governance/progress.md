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
- D1: complete — prior condition satisfied
- Identity decision: complete — maintainer selected `0.3.2-dev`
- R0: authorized / next gate
- D2–D6: pending / sequentially authorized after predecessor exit

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
| `.git/index.lock` permission denied while creating the authorized planning checkpoint | 1 | Sandbox blocks `.git` writes; no partial commit occurred. Controlled escalation then committed the same exact three paths. |

## 2026-08-08 — Plan refinement after maintainer commit

- 维护者已提交初版文档治理计划；复核时工作树干净，`main` 位于 `87d9c51`，相对 `origin/main`
  ahead 1。本轮不改写该提交，也不 push。
- 接受新增 `DESIGN.md` 的方向，统一采用根级大写命名；冻结其职责为仓库地图、模块入口/依赖、
  change-impact 与验证路由，明确不得复制 ARCHITECTURE 的设计原理/trusted graph 或 ROADMAP 状态。
- 将 README `## 仓库地图` 迁入 DESIGN 纳入 D2；README 完成迁移后只保留文档入口。
- 将后续目标从“精简 MAINTAINER_HANDOFF”调整为“逐节拆分并退役”：README 承接用户/开发命令，
  DESIGN 承接模块变更与验证选择，ROADMAP 承接 lifecycle 策略，provenance/runbook/acceptance 承接来源
  和精确版本证据。
- 增加 handoff traceability、零入链、独有安全/恢复步骤零遗漏和 repository-boundary 同步作为删除门槛。
- 迁移序列扩展为 D2–D6 / Batch A–F；本轮仍只调整活动 planning，未创建 DESIGN、未删除 handoff、
  未修改任何宏观文档、产品、测试或 Release 字节。
- Planning-only validation PASS：精确变更仍只有活动计划三文件；UTF-8/no BOM、LF、final newline、
  无尾随空格、fence 平衡，旧阶段/旧 handoff 保留方案无未标注残留，`git diff --check` 通过。

## 2026-08-08 — Identity route authorization

- 维护者明确采用 `0.3.2-dev`，关闭 identity decision checkpoint；D0/D1 探路阶段正式结束。
- 维护者允许在关键 gate 主动本地 commit，以便按阶段回滚调整；push、remote ref、tag、Release assets、
  publication 和 Cloud 仍未授权。
- 估算后续为六个实施轮次：R0 identity、D2 entrypoint/DESIGN、D3 architecture/design、D4 handoff
  retirement、D5 lifecycle/provenance、D6 full validation/closure；每轮验证通过后一个 commit。
- 当前 Next Step 改为提交本次 planning checkpoint，再开始 R0；尚未修改 package、contract、bootstrap、
  tests 或宏观文档。
- 按 AGENTS 必读顺序重新完整复核 README、ARCHITECTURE、ROADMAP 和活动 planning；确认没有 runtime、
  Host ABI、trusted graph、production rollback 或 Cloud 假设变化，不需要增加 Discovery 轮。
- 已创建并回填本地 planning checkpoint；该 commit 只包含活动 task plan、findings 和 progress，不包含
  宏观文档、产品、测试或 Release 字节，并未 push。

## 5-question reboot check

| Question | Answer |
|---|---|
| Where am I? | D0/D1 complete; `0.3.2-dev` selected; R0 is the next authorized gate |
| Where am I going? | Six sequential implementation rounds, one verified commit per gate |
| What's the goal? | One truth source per question domain; other documents summarize and link |
| What have I learned? | README governance crosses the sealed Release-input boundary; current mutable facts are duplicated across five macro docs |
| What have I done? | Froze authority/migration design and recorded the selected identity route without editing macro/product documents |
