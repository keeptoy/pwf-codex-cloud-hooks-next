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
- D2: complete
- D3: complete
- D4: complete
- D5: ready / authorized after D4 checkpoint
- D6: pending / authorized after D5 exit

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
| D2 Bash syntax command used the conventional `C:` Git installation path, but this host installs Git on `D:` | 1 | Read-only discovery found `D:\Program Files\Git`; rerun uses that exact executable and does not change product files. |
| First D2 one-off link check passed an empty root-document parent to `Join-Path`; PowerShell emitted non-terminating errors and still exited 0 | 1 | Result discarded. Rerun uses `ErrorActionPreference=Stop` and normalizes an empty parent to `.` before evaluating targets. |
| D3 source audit passed the literal `tests/*.test.js` glob to Windows `rg`, which does not expand it | 1 | Partial test-list result discarded; rerun targets the `tests` directory with `-g '*.test.js'` while preserving the successful source symbol query separately. |
| Combined D3 closure patch assumed the reboot table still followed the D2 completion section | 1 | Patch was rejected atomically with no partial edits; split closure updates by file and inspect the actual progress tail before retrying. |

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

## 2026-08-08 — D2 entrypoint and DESIGN foundation started

- session catch-up 无未同步输出；D2 起点工作树干净，HEAD 为 handoff decision checkpoint `aa7653d`，
  分支相对 `origin/main` ahead 4。
- 重新读取 README、ARCHITECTURE、ROADMAP、AGENTS、活动 planning 和 focused governance/repository
  tests；D2 状态切换为 in progress。
- 冻结本轮边界：README 文档地图/去 stale identity/contract-driven build、DESIGN foundation/仓库地图、
  ROADMAP planning 入口、AGENTS agent-only 导航、focused assertions/repository inventory。D3–D5 不提前。
- 先更新 `tests/architecture-contracts.test.js` 与 repository exact inventory；failing-first 为 5 registered /
  3 passed / 2 failed，失败精确指向 `DESIGN.md` 不存在及 tracked inventory 缺该路径，既有架构/runtime/
  历史边界断言继续通过。
- 已创建并暂存 `DESIGN.md`，迁入仓库地图并明确 implementation map 的权威边界；README、ROADMAP、
  AGENTS 的入口分工同步完成。focused rerun PASS：5 registered / 5 passed / 0 failed。
- Full Windows suite PASS：81 registered / 69 passed / 0 failed / 12 honest POSIX/Linux SKIP；published
  v0.3.1/v0.3.0 oracle 均保持通过。
- Importer check、三个 Python production 文件 compile、`node --check install.js`、working/staged
  `git diff --check` 与 `DESIGN.md` LF attribute PASS。
- 当前 0.3.2-dev ZIP 双构建一致：23 entries / 82,512 bytes / observed SHA
  `2bd6fc93f1bd8161467e1a92ca6383583bd321748a2d39a7ee41087fb5db9725`；仅作 D2 验证，未写入
  zero-hash bootstrap，不构成 seal 或 Release。
- 三个 external bootstrap 已使用本机实际 Git Bash 路径通过 `bash -n`；首次 link-check 因 PowerShell
  root-path 处理错误产生非终止报错，其结果已作废并记入 error log；修正后的链接/锚点检查 PASS。

## 2026-08-08 — D2 entrypoint and DESIGN foundation complete

- README 已删除 stale 顶部 identity/lifecycle blockquote 与第二份仓库地图，新增唯一的人类文档权威地图；
  development ZIP 说明改为 contract-driven，不再维护固定候选版本或 entry count。
- 新增 tracked、LF、ZIP-excluded `DESIGN.md` foundation，承接唯一仓库地图与五层实现视图；ROADMAP
  planning 章节与 AGENTS agent-only 导航均改为链接该入口体系。
- Focused governance PASS：5/5；full Windows suite PASS：81 registered / 69 passed / 0 failed /
  12 honest POSIX/Linux SKIP。
- Importer check、Python compile、Node syntax、三个 bootstrap Bash syntax、本地链接/README anchor、
  working/staged diff check、DESIGN LF 与 repository exact inventory 全部 PASS。
- 0.3.2-dev deterministic ZIP 双构建均为 23 entries / 82,512 bytes / SHA `2bd6fc93...b9725`；
  zero-hash bootstrap 保持不动，无 seal、publication、tag、asset、push、remote 或 Cloud 变更。
- D2 exit PASS；活动计划已切换到 D3 ARCHITECTURE/DESIGN separation。本轮已用单一
  `docs: establish entrypoints and design map` 本地 checkpoint 收口，未 push。

## 5-question reboot check

| Question | Answer |
|---|---|
| Where am I? | D0/D1/R0/D2/D3 complete; D4 lifecycle/provenance guards are next |
| Where am I going? | D4–D6, one verified local commit per gate |
| What's the goal? | One truth source per question domain; other documents summarize and link |
| What have I learned? | ARCHITECTURE is already cohesive; D3 should add implementation navigation rather than dismantle it |
| What have I done? | Added source/ZIP/installed module navigation without dismantling ARCHITECTURE or changing runtime/trust behavior |

## 2026-08-08 — D3 implementation navigation started

- `planning-with-files` catch-up 无未同步输出；起点工作树干净，HEAD 为 D2 checkpoint `124f408`，分支
  相对 `origin/main` ahead 5。
- 维护者确认 D3 不大规模拆分现有 ARCHITECTURE；本轮主任务是让不熟悉源码的人能从 DESIGN 快速定位
  模块职责、依赖、变更影响和验证入口，ARCHITECTURE 只增加稳定路标。
- 活动计划 D3 状态切换为 in progress；D4 lifecycle/provenance 内容不提前处理。
- 完成源码符号、contract inventory 与测试名称审计，冻结 repository/Release/installed layout 和七条
  模块验证路由；所有职责均来自实际依赖，不凭文件名推断。
- 先增加 D3 focused governance assertion；failing-first 为 3 registered / 2 passed / 1 failed，首个失败
  精确指向 ARCHITECTURE 尚无 DESIGN 路标。既有架构 contract 与 D2 文档地图断言继续通过。
- 最小实现完成：ARCHITECTURE 未删除或迁移任何章节，只在总览、部署图、runtime 数据流处增加 DESIGN
  路标；DESIGN 新增 layout 对照、七类模块卡、machine contract 路由、按变更目标定位和分层验证选择。
- DESIGN 只链接最近边界测试与 README 命令 authority，不复制 schema 字段、预算/hash、测试计数或
  lifecycle 状态；D4 的版本历史/lifecycle 清理保持未触碰。
- Focused D3 rerun PASS：3 registered / 3 passed / 0 failed；新增断言同时保护 ARCHITECTURE 的 why/
  trusted/failure 章节不被拆空，以及 DESIGN 的 layout/module/change/validation 路由完整性。
- ARCHITECTURE/DESIGN 全部本地 Markdown target 与两个新增标题 anchor PASS；`git diff --check` PASS，
  精确变更仍为两份目标文档、一个 focused test 和三份 planning。
- Installer/runtime-bundle/Release-contract 精度复核后，DESIGN 已明确 installed inventory 与 repository/
  ZIP contracts 的差异；没有把 Release ZIP 误写成 installed runtime 的压缩副本。
- 最终 focused governance + repository boundary PASS：6 registered / 6 passed / 0 failed；两文档 LF、
  Markdown fences、全部本地 targets、D3 anchors 和 `git diff --check` 均 PASS。
- Full Windows suite PASS：82 registered / 70 passed / 0 failed / 12 honest POSIX/Linux SKIP；candidate ZIP、
  published v0.3.1/v0.3.0 oracle、runtime/installer/trust seams 均保持绿色。

## 2026-08-08 — D3 implementation navigation complete

- ARCHITECTURE 仅增加 DESIGN 总入口、layout 和 module-routing 三处稳定路标；原有 why、部署图、runtime
  data flow、contracts、trusted graph、失败语义和系统不变量完整保留。
- DESIGN 已补齐 repository/ZIP/installed/policy/global-Skill layout、七类模块职责与依赖、machine
  contract 路由、按变更目标定位和风险分层验证路由。
- D3 没有修改 README、ROADMAP、provenance、handoff、runtime、contracts、package/Release identity 或
  ZIP 输入；D4 lifecycle/provenance 内容未提前改写。
- Focused 6/6、full Windows 70 pass / 0 fail / 12 SKIP、links/anchors/LF/fences/repository/diff checks PASS。
- D3 exit PASS；活动计划已切换到 D4 authority deduplication。本轮已用单一
  `docs: map implementation modules and validation` 本地 checkpoint 收口，未 push。

## 2026-08-08 — D4 change architecture and evidence separation started

- `planning-with-files` catch-up 无未同步输出；起点工作树干净，HEAD 为 D3 checkpoint `f98f983`，分支
  相对 `origin/main` ahead 6。
- 维护者批准“ROADMAP intent → task plan authorized action → CHANGELOG actual delta，provenance/
  acceptance/contracts 作为正交 evidence layer”的 D4 方案。
- D4 获批范围扩展为新增 ZIP-excluded CHANGELOG、README 文档地图入口、ROADMAP/provenance 去重、必要
  历史标签、authority/repository guards 和 planning；不改 runtime/Host ABI/trusted graph/已发布证据字节。
- D4 状态切换为 in progress；新增 README 字节仍使用已建立的 0.3.2-dev identity，并触发完整 package
  与 immutable oracle 验证，不构成 seal 或 Release。
- D4 的 authority guard 不提前约束仍待 D5 重写的 handoff；本轮只覆盖 CHANGELOG、ROADMAP、provenance
  和宏观入口文档，handoff 去事实化及其 guard 保留为 D5 exit。
- Error: 首次同步上述范围时，`apply_patch` 因 Batch D 原文在 `README/DESIGN/` 后换行而未匹配；补丁
  整体未应用。读取精确上下文后拆成窄补丁重试。
- Red test attempt: `node --test tests/architecture-contracts.test.js tests/repository-boundary.test.js` 在受限
  Windows runner 启动 test worker 时返回 `spawn EPERM`，没有执行断言；按已知平台分类使用受控权限重跑。
- Red test evidence: 受控重跑得到 7 tests / 3 pass / 4 fail；失败精确来自旧 ARCHITECTURE Release
  叙述、README/DESIGN 尚无 CHANGELOG 入口、`CHANGELOG.md` 尚不存在，以及 tracked inventory 尚未加入
  新文件。证明新 guard 在实现前有效，没有 runtime failure。
- 实施中发现 AGENTS 虽声明“不维护当前 lifecycle”，但稳定边界和尾部迁移段仍复制完整版本角色；将
  D4 直接依赖扩为 AGENTS 最小 authority 同步：保留稳定 trust/Release 规则，以 ROADMAP/provenance
  链接替换 current-role/gate 流水账，不把 CHANGELOG 加入每次必读顺序。
- Focused green attempt: architecture assertions 4 项中 3 PASS、1 FAIL；唯一失败是新测试把 ROADMAP
  中“活动 task plan”与“当前唯一 Next Step”的合法语序写反，属于 test defect。同步修正 regex，并补上
  新测试作用域内遗漏的 `agents` 读取，不改文档语义。
- Focused governance PASS: architecture authority assertions 4/4；将新 CHANGELOG 加入 index 后，
  architecture + repository-boundary 合计 7/7 PASS，tracked exact inventory 为 76，CHANGELOG 仍被
  Release machine allowlist 排除。
- Markdown/static PASS: 10 个本轮 Markdown 变更的相对文件链接均存在，UTF-8 no-BOM、LF、final newline
  与 fence balance 全部通过；`git diff --check` PASS，`docs/` 历史 acceptance/runbook 为零 diff。
- Full suite PASS: 83 tests / 71 pass / 12 honest POSIX skips / 0 fail；其中 v0.3.2-dev deterministic package、
  published v0.3.1/v0.3.0 immutable oracle 与新增 authority/repository guards 均通过。
- Platform limitation: 并行静态检查中的三个 `bash -n` 因当前 Windows runner 没有 `bash` 而 SKIP；
  同一并行调用未可靠回传 importer/语法与双 ZIP 输出，因此将这两组单独重跑，不推断 PASS。
- Importer/static PASS: pinned upstream owned copy healthy；三份 production Python compile 与 `node --check
  install.js` PASS。
- Package PASS: 两次独立 build/check 均为 23 entries / 82,518 bytes / SHA-256 `4447acfb...3df3`，字节
  一致；临时 ZIP 已清理。这只是 `0.3.2-dev` 可复现性证据，不构成 seal 或 Release。
- D4 exit PASS: 新 CHANGELOG、ROADMAP lifecycle 单点、provenance identity index、宏观文档 guard 和
  76-path repository inventory 已建立；历史 acceptance/runbook 零 diff，runtime/ABI/trusted graph 零变化。
  本地 checkpoint 使用 `docs: separate change lifecycle and provenance`；下一步为 D5 handoff maintainer
  entrypoint，未 push、tag、seal、发布或改动 Cloud。
- Error: 首次收口 D4 状态的组合补丁因 findings 中预期锚点与文件实际排序不一致而整体未应用；读取
  精确尾部后按 task/progress 与 findings 分拆重试。
- Final pre-commit audit PASS: forbidden current-role wording 在受治理宏观文档中只剩 ROADMAP §2 一处；
  v0.3.1 provenance 的 exact source/ZIP/bootstrap 与 acceptance 交叉一致；focused 7/7、终态 10 份
  Markdown 的 local links/UTF-8/LF/final newline/fences 和 `git diff --check` 全部通过。

## 2026-08-09 — Local Git Bash path correction

- 维护者补充本机 Git Bash 位于 `D:\Program Files\Git\git-bash.exe`。恢复活动 planning 后确认工作树
  起点干净，D5 仍为下一 gate；本轮只校正并持久化本机验证工具发现，不开始 D5 文档迁移。
- 路径探测 PASS：launcher、`bin\bash.exe`、`usr\bin\bash.exe` 均存在；Git for Windows launcher/
  `bin\bash.exe` 版本为 `2.55.0.windows.2`。
- Direct launcher probe: `git-bash.exe -lc ...` 没有返回 stdout，PowerShell `$LASTEXITCODE` 为空；确认
  launcher 不适合 headless exit-code 验证，下一步改用显式 `bin\bash.exe`，而不是重复 PATH-only 探测。
- Headless attempt 1: 显式 `D:\Program Files\Git\bin\bash.exe` 选路正确，但受限沙箱内创建 Win32
  signal pipe 返回 error 5，exit `-1073741502`；相关 launcher/mintty/bash 无残留进程。按已知平台限制
  使用受控权限重跑，不把该结果归类为脚本语法失败。
- Headless attempt 2: 受控权限已越过 signal-pipe 限制，但含 pipe/command substitution 的复合 `-lc`
  参数经 PowerShell→Win32 传递后被错误拆分，Bash 报 unmatched `)`、exit 2；归类为调用引号缺陷。
  改用无嵌套 shell 字符串的 `--version` 与逐文件 `-n` 参数，不重复该命令形态。
- Headless attempt 3 PASS: `D:\Program Files\Git\bin\bash.exe --version` 返回 GNU Bash 5.3.15；对
  v0.3.0、v0.3.1、v0.3.2 三个 bootstrap 逐文件运行 `-n`，全部 exit 0。D4 中“本机没有 Bash”的
  PATH-only SKIP 由本节纠正：当时只是 PowerShell PATH 未解析到 Bash，并非 binary 不存在。
- 持久化边界：本机路径只进入活动 findings/progress，不写入 README/AGENTS 或产品 contract；D5 状态
  保持 ready，未修改 production、bootstrap 字节、历史证据或 Release/Cloud 状态。

## 2026-08-09 — D4.1 stable cross-document anchors started

- 维护者确认在 D5 前修正 D4 fragment 漂移风险；起点工作树干净，HEAD 为 local Bash discovery
  checkpoint `7188a98`，分支相对 `origin/main` ahead 8。
- 复核确认现有六条跨文档 fragment 指向五个目标章节；当前 Cloud slug 大概率有效，但 D4 link checker
  只验证文件存在，未验证 fragment。D4.1 状态切换为 in progress，D5 暂不开始。
- 冻结实现：英文显式 named anchors + 通用 root-authority fragment guard；README 是 ZIP 输入，因此完成
  focused/static 后仍运行 full suite 和双 deterministic ZIP，不改 runtime/ABI/trusted graph/Release 状态。
- D4.1 failing-first evidence: architecture governance 5 tests / 4 pass / 1 fail；唯一失败为
  `AGENTS.md: unstable fragment #开发状态与文档地图`，证明新 guard 在文档改动前能拒绝 generated-heading
  fragment，既有 architecture/change-authority assertions 全部保持绿色。
- 最小实现完成：README `documentation-map`/`local-development`、ARCHITECTURE `cloud-lifecycle`、DESIGN
  `implementation-layout`/`module-responsibilities` 五个英文 named anchors 已建立，六条跨文档链接全部迁移；
  标题文字和编号未改。
- Focused D4.1 PASS: architecture + repository-boundary 8/8；通用 guard 扫描七份 root authority docs，
  精确发现六条 fragment，并逐条验证 stable ASCII name 与目标文件显式 anchor。
- Static PASS: 六条 fragment 全部为新英文 names，旧 generated slugs 零残留；9 份本轮 Markdown 的
  UTF-8 no-BOM、LF、final newline、fence balance、`git diff --check` 通过，历史 `docs/` 零 diff。
- Full Windows suite PASS: 84 tests / 72 pass / 12 honest POSIX skips / 0 fail；新增 anchor guard、当前
  0.3.2-dev package 与 published v0.3.1/v0.3.0 immutable oracle 全部绿色。
- Importer/static PASS；三份 production Python compile 与 `node --check install.js` PASS。显式
  `D:\Program Files\Git\bin\bash.exe -n` 对三个 bootstrap 全部 PASS。
- Package PASS: 两次独立 build/check 均为 23 entries / 82,554 bytes / SHA-256 `87aaccd6...f6bb2`，
  字节一致且临时文件已清理；只作 0.3.2-dev 开发证据，不构成 seal 或 Release。
- D4.1 exit PASS: 五个 stable anchors、六条迁移链接、通用 fragment guard 与 AGENTS 规则已建立；旧
  generated fragments 零残留，runtime/ABI/trusted graph/历史 evidence 零变化。活动 Next Step 恢复为 D5。
- Final pre-commit audit PASS: focused 8/8；9 份 changed Markdown 的 UTF-8/LF/final newline/fences、
  `git diff --check` 与历史 `docs/` 零 diff 均通过；精确变更为六份根级文档、一个 focused test 和三份
  planning，没有 runtime/contract/bootstrap 字节变化。
- D4.1 已用 `docs: stabilize cross-document anchors` 本地 checkpoint 收口；未 push、tag、seal、发布或
  修改 Cloud。D5 maintainer entrypoint 重新成为当前 Next Step。
