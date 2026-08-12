# Progress: Phase 4.3 F1A/F1B Implementation Planning Discovery

## 2026-08-12

- 维护者要求先为 Phase 4.3 占位，下轮再开始 F1A/F1B 实施规划探路。
- 首次尝试在旧 Phase 4 Discovery scope 中增加自定义 markdown，focused governance 14/15；repository lifecycle
  明确每个 scope 只允许标准 `task_plan.md`、`findings.md`、`progress.md`。
- 已改建本独立标准 planning scope 并切换 `.planning/.active_plan`。当前状态为
  `RESERVED / NOT_STARTED / IMPLEMENTATION_NOT_AUTHORIZED`；没有开始源码/contracts 扫描，没有 implementation。
- 标准 scope 建立后重跑同一 focused governance：15/15 PASS，`git diff --check` PASS；未放宽 lifecycle 断言。
- 维护者明确要求开始探路；Phase 4.3 从占位切换到 `DISCOVERY_IN_PROGRESS / P0_EVIDENCE_REFRESH`。
- 首轮组合 authority 读取中，README 的复杂 `rg` 双引号 pattern 被 PowerShell 错误拆成路径；已登记到 task plan。
  其他 skill、catch-up、branch/worktree、ARCHITECTURE/DESIGN/ROADMAP 与 active planning 读取有效，后续改用分段命令。
- P0 首轮基线已写入 findings：当前 package/角色未轮转；恢复 manifest schema 3、bundle/release v1、两个 installed
  plan ABI、bundle 外 adapter 与 builder mode 双 authority，并确认 F1B bytes 会反向进入 F1A hash/inventory transaction。
- 检查 importer/installer/builder、plan producer/consumer seam 与邻近 tests 后，形成首个 P1/P2 工作结论：F1A 可先
  形成使用现有 plan-v1 legacy behavior 的完整绿色 checkpoint；F1B 再轮转 plan-v2/state foundation，并重新闭合
  全部 bundle/manifest/Release hashes。无需制造不可构建 staging tree，也不把 F1A checkpoint 当 Release。
- contract path inventory 的一组并行命令因向 Windows `rg` 传入字面量 `*.md` 而 exit 1，已登记错误并改用 `--glob`。
  已保留的证据确认必须区分 current v2 路由与 immutable published v1 oracle；历史 source/history 文档不能批改。
- 确认 implementation 前必须先做 F0 identity preparation，推荐从 accepted `0.3.5` 轮转到 zero-hash `0.4.0-dev`，
  完整 foundation/Cloud 候选闭合前不提前称为 alpha。
- 冻结 F1B “marker 不可达”的工作定义：production `[legacy]` 必须在 state capture 前短路，对 mode/nonce/
  attestation/ledger 零 open/read；state reader 只能通过受控 unit seam 测试，F2A 才允许 production 调用。
- 一组 root/metadata inventory 因允许无匹配的 `rg` 返回 1 而被编排器标为 failed；有效源码片段已保留，错误已登记。
- P0 基线验证完成：`python tools/import_upstream_runtime.py check` PASS；当前 Release 双构建/check PASS，字节仍与
  v0.3.5 accepted ZIP identity 一致；Git index 仍只有四个 `runtime/upstream/*` 文件为 `100755`。
- 完整 `npm test` 首轮在 Windows sandbox 被 Node test runner 的 `spawn EPERM` 阻断，16 个文件均未实际进入断言；
  获批后在沙箱外重跑同一命令：124 tests，112 pass、0 fail、12 个 POSIX/Linux case 诚实 SKIP。
- P1/P2 已闭合 exact inventory 与传播图：未来先做独立 F0 把 package/bootstrap/acceptance 轮转到 zero-hash
  `0.4.0-dev`；F1A 再轮转 manifest schema4、bundle/Release v2、adapter/四 ABI placement；F1B 再原子切 plan-v2。
- bundle v2 的结构、roots、entry keys 与 dependency closure 已冻结；`origin`、managed/pristine 双 hash、空 overlay、
  language/host dependency 和无行为语义的 condition/required 退出 candidate v2，由 structural partition 与 direct guards 接管。
- 区分了 source `upstream-manifest` 与现场 `installed-manifest`：F1 只轮转前者；现场 schema3、runtime snapshot 与
  `adapter_sha256` 暂保留，后者有 v0.3.5 doctor consumer 和明确 accepted-predecessor review trigger。
- 发现并修正此前“双向 takeover”的过度概括：新 layout 增删 schema paths 后，immutable v0.3.5 installer 不可能直接
  接管 candidate 现场。规划新增 exact `installed-state-transition-v1.json` 只支持 v0.3.5 → candidate 前向迁移；回滚由
  candidate uninstall/backup 后执行 v0.3.5 clean install。不得为迁移保留 active v1/v2 双 loader或放宽 unknown-file blocker。
- P3/P4 已冻结 failing-first 顺序和平台分流：F0/F1A local+Linux；F1B 完成后只跑一次 no-live Cloud foundation，
  F3 再承担已激活 behavior 的 Cloud acceptance，避免每个只改身份/合同的 checkpoint 重复烧 Cloud。
- P5 结论为 `GO_TO_SEPARATE_F0_THEN_F1A_WHEN_AUTHORIZED`。F1A 与 F1B 都是独立绿色 review/commit/stop gate；
  F1B PASS 最多允许请求 F2A 新授权，不自动进入 activation、alpha seal、Cloud F3 或 Release。
- P6 已创建并索引 Phase 4.3 历史摘要，ROADMAP 当前 programme 状态更新为“实施规划 complete，F0/F1 未授权”；
  没有修改 production、contracts、tests、package/bootstrap identity、installed state 或远端。
- closeout focused 验证：architecture contracts 7/7 PASS、machine contracts 2/2 PASS；repository-boundary 在 sandbox
  因 Git child status=null 失败，沙箱外重跑原命令 8/8 PASS；`git diff --check` PASS。
- 最终完整回归 `npm test`：124 tests，112 pass、0 fail、12 个 Windows POSIX-only case 诚实 SKIP；importer check、
  Python compile、`node --check install.js` 与 `git diff --check` 同时 PASS。Phase 4.3 可封板为 planning-only commit。
- 维护者在 F0 施工前暂停 implementation，并指出 ROADMAP 正式 Phase 4 gate table 漏列 F0、Phase 4.3 缺少集中式
  对象级迁移生命周期总账。复核确认两项均成立：原文已零散覆盖生命周期证据，但不足以支持大迁移后的逐项残留审计。
- ROADMAP 已把完整 programme 顺序更新为 `F0 → F1A → F1B → F2A → F2B → F3`，补 F0 gate 和跨 gate ledger
  要求；Phase 4.3 历史摘要补充字段/常量/分支/路径/hash/测试/文档的生命周期表，以及迁移前、中、后和 Phase 9
  retirement audit。活动状态明确为 `F0_PAUSED_BY_MAINTAINER / IMPLEMENTATION_NOT_AUTHORIZED`。
- 补充完成后，architecture 7/7、machine contracts 2/2、repository lifecycle 8/8 与完整 `npm test` 全部通过；
  最终为 124 tests、112 pass、0 fail、12 个 Windows POSIX-only SKIP，`git diff --check` PASS。
