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
- R0: complete
- D2: authorized / next gate
- D3–D6: pending / sequentially authorized after predecessor exit

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
| Focused `node --test` returned four file-level `spawn EPERM` failures | 1 | Test workers could not start under the sandbox; controlled rerun reached all product assertions. |
| Git Bash failed to create a Win32 signal pipe for three `bash -n` checks | 1 | Sandbox process limitation; controlled rerun parsed all three scripts successfully. |

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

## 2026-08-08 — R0 identity foundation started

- session catch-up 无未同步输出；R0 起点工作树干净，HEAD 为 planning checkpoint `b6d8b5b`，分支
  相对 `origin/main` ahead 2。
- 重新读取活动 task plan/findings/progress；R0 状态切换为 in progress。
- 本轮严格限制为 package/Release contract、ZIP-external v0.3.2 development bootstrap、identity tests、
  repository-boundary inventory 和 planning；README/DESIGN/其他宏观文档留到 D2。
- 完成第一轮 identity grep 与 contract/test 阅读：确认 current-tree exact v0.3.1 hash 断言需要迁移为
  development identity，而 sealed v0.3.1 必须转为 immutable source oracle 测试；R0 不改变 23-entry
  ZIP allowlist，只新增一个 ZIP-external tracked bootstrap。
- 复核 v0.3.1 历史 planning/commit 与 bootstrap tests：采用既有 development zero-hash → authorized seal
  模型；R0 将新 candidate 行为移到 v0.3.2 bootstrap，同时保留 v0.3.1 immutable oracle。
- 从 v0.3.1 acceptance/tag 固定 exact oracle：source `9aa2148...`、ZIP `f097b040...31f9`、bootstrap
  `ce31a320...a5e8`；确认新 source 使用 `0.3.2-dev`，未来 seal 必须另行冻结为 `0.3.2` 后重建。
- 先更新四个 focused identity test 文件；首次 failing-first 运行被 sandbox 的 Node worker `spawn EPERM`
  阻断，尚未产生可解释的红灯，必须受控重跑。
- 受控 failing-first 重跑：16 registered / 8 passed / 8 failed。v0.3.1/v0.3.0 immutable oracle、identity
  drift rejection 和既有安全行为通过；失败精确指向 package/contract 仍为 0.3.1、v0.3.2 bootstrap
  尚不存在、repository inventory 尚未出现该路径，属于预期红灯。
- 开始最小实现：将 package/Release contract 切换到 `0.3.2-dev`，external asset 指向新 v0.3.2
  bootstrap；23-entry ZIP allowlist 和 runtime/contracts 内容不变。
- 使用 v0.3.1 sealed bootstrap 作为逻辑模板创建 v0.3.2 development bootstrap；除默认
  `HOOKS_VERSION=v0.3.2` 与 `HOOKS_SHA256=64-zero` 外字节逻辑保持一致。v0.3.1 当前文件 SHA 仍为
  immutable `ce31a320...a5e8`。
- 实现后 focused rerun 为 16 registered / 15 passed / 1 failed；唯一失败是
  `upstream-manifest.json` 中 release artifact contract SHA 仍为旧值 `a8f6...`，实际新 contract SHA 为
  `d71aa79a...648c`。保留 fail-closed hash 断言并同步该 machine reference。
- 已仅更新 `upstream-manifest.json.managed_runtime.contracts.release_artifact.sha256` 为精确
  `d71aa79a...648c`；其他 runtime、source 和 contract hash 均未改变。
- focused R0 rerun PASS：16 registered / 16 passed / 0 failed；current 0.3.2-dev 双构建、zero-hash
  bootstrap、v0.3.1/v0.3.0 immutable oracle、contract/inventory 和 Skill bootstrap 边界全部通过。
- Full Windows suite PASS：81 registered / 69 passed / 0 failed / 12 honest POSIX/Linux SKIP。
- Importer check、三个 Python production 文件 compile、`node --check install.js`、ZIP build/check 和
  `git diff --check` PASS。独立双构建均为 23 entries / 82,732 bytes / observed dev SHA
  `a71025f0c0be39e1dea9387dea2c46ae48c584a6353385ee0dbb3807005c86e1`；该观察值不进入 zero-hash
  bootstrap，也不构成 seal。
- 三个 Git Bash `bash -n` 在沙箱内均被 Win32 signal-pipe permission error 阻断；这是平台限制，需
  受控重跑，不能把后续 PowerShell exit code 误记为 syntax PASS。
- 受控 Git Bash syntax rerun PASS：v0.3.0、v0.3.1、v0.3.2 三个 bootstrap 均通过 `bash -n`。

## 2026-08-08 — R0 identity foundation complete

- Production/machine changes: `package.json=0.3.2-dev`；Release artifact contract 同步版本并只把 external
  asset 切到 `init-cloud-sandbox-v0.3.2.bash`；23-entry ZIP allowlist 不变；upstream manifest 只同步
  release-contract SHA。
- 新 bootstrap 与 immutable v0.3.1 文件仅有两项默认值差异：`v0.3.2` 和 64-zero ZIP hash；旧 v0.3.1
  bootstrap SHA 仍为 `ce31a320...a5e8`，旧 v0.3.1 ZIP oracle 仍为 `f097b040...31f9`。
- Tests: focused 16/16 PASS；full Windows 81 registered / 69 passed / 0 failed / 12 honest POSIX SKIP；
  importer/compile/Node syntax/三 bootstrap Bash syntax/双 deterministic ZIP/check/`git diff --check` PASS。
- Current development ZIP observation: 23 entries / 82,732 bytes / SHA `a71025f0...c86e1`；只作本轮验证，
  未写入 bootstrap，不是 seal、candidate publication 或 Release。
- R0 exit PASS。Next Step 切换到 D2 entrypoint/DESIGN foundation；README 和其他宏观文档尚未修改。
- R0 已以单一本地 checkpoint commit 收口：精确包含 11 个获批路径（identity contract/bootstrap、四个
  focused tests、upstream manifest 和三份活动 planning），未 push，便于进入 D2 前独立回滚。

## 2026-08-08 — Handoff retention and D4/D5 reorder

- 维护者决定保留 `MAINTAINER_HANDOFF.md`，撤回此前“逐节迁移后删除”的候选方向；历史 progress 中的
  retirement/零入链记录仅保留决策演进语义，均由本节取代，不再是实施目标。
- handoff 新职责冻结为维护者 onboarding/triage 入口：新人最短接手路径、稳定踩坑摘要，以及能力/
  健康检测的“信号 → PASS/repairable/blocker/platform limitation/product defect → authority”反馈。
- handoff 不得维护 current version/Latest/rollback、commit/hash/test count、逐 gate 状态、完整命令清单
  或第二份 Release/rollback runbook；这些内容仍迁入 README、DESIGN、ROADMAP、provenance 和版本专项。
- D4/D5 顺序已交换：D4 先清理 lifecycle/provenance/history 重复并建立 governance guard；D5 再基于
  稳定 authority 去事实化并重写 handoff。总轮次不变，当前 D2 Next Step 也不变。
- 本轮只修改活动 task plan/findings/progress；未修改 handoff、README、DESIGN、ROADMAP、provenance、
  tests 或其他产品/Release 字节。
- 本次决策已以单一本地 planning checkpoint 收口，仅包含活动 task plan/findings/progress，未 push；
  可在 D2 实施前独立回滚而不影响已完成的 R0 identity checkpoint。

## 5-question reboot check

| Question | Answer |
|---|---|
| Where am I? | D0/D1/R0 complete; D2 entrypoint/DESIGN foundation is next |
| Where am I going? | Five remaining sequential implementation rounds, one verified commit per gate |
| What's the goal? | One truth source per question domain; other documents summarize and link |
| What have I learned? | README governance crosses the sealed Release-input boundary; current mutable facts are duplicated across five macro docs |
| What have I done? | Established a tested 0.3.2-dev identity without changing runtime/Host ABI/trusted graph or published bytes |
