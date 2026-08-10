# Progress: v0.3.3-dev Pristine Catch-up Runtime

- 2026-08-10：维护者批准 Route B 继续施工，并要求同步补充 ARCHITECTURE 的 patcher/importer 与 production
  execution 分层细节。
- 恢复 README、ARCHITECTURE、DESIGN、ROADMAP 与 P2 active evidence；确认 published v0.3.2 的 patcher 描述
  是准确历史，但 successor 实施完成后必须改写为 current pristine rebuild path，不能把旧路径继续写成现实。
- 建立本 successor scope；当前只授权 source implementation/local verification，不授权 seal、push、Release、
  Cloud deployment 或 Product Phase 4。
- G0 candidate identity 已写入 package/Release contract/ROADMAP/CHANGELOG；新增 v0.3.3-dev zero-hash bootstrap
  与 pending Cloud acceptance，同时保留 v0.3.2 accepted bootstrap/acceptance 组成 candidate + accepted 窗口。
- 新 bootstrap 首次通过 shell read → apply_patch 机械复制时，shell tool 的三行执行元数据被误识别为正文；
  立即用 apply_patch 删除并复核首行为 shebang。未执行 bootstrap、未改 v0.3.2 文件。
- G1 新增独立 pristine catch-up boundary tests：managed/pristine wrapper envelope 等价、四 helper roots、
  传递闭包禁止 CLI overlay/main、import-time UTF-8/orjson surface。首次沙箱运行的 Python spawn 被 Win32
  权限阻止；沙箱外真实运行暴露测试误走 POSIX CLI gate，已改用 native `require_posix=False` harness。
- G2 已把 session runtime 恢复为 pinned pristine SHA `6476fd...`；runtime bundle 显式冻结四 helper symbols，
  importer 统一拒绝 non-pristine origin、divergent managed hash 与 overlay declarations。Current tree 删除
  patcher/ledger，upstream manifest、installer inventory 和 Release allowlist 同步收窄。
- ARCHITECTURE 3.1 已把 v0.3.2 patcher/importer 分层保留为准确冷历史，同时把当前路径改为四文件 pristine
  rebuild；5.1 新增 plan private snapshot 与 Phase 2 catch-up wrapper 的双 invocation-domain 解释，避免误写成
  同一 overlay 被 snapshot 直接替换。README/DESIGN/provenance/ROADMAP/CHANGELOG 已同步职责分层。
- 第一轮 focused suite 22/22 PASS：architecture、bootstrap、contracts、importer、pristine helper boundary 与
  deterministic successor ZIP 均通过；候选 bootstrap default zero hash fail closed，ZIP hash 与 published
  v0.3.2 不同。
- Staged repository/architecture/installer focused suite 28 PASS、1 Linux-only SKIP、1 lifecycle FAIL；唯一失败
  是 completed P2 scope 与新 active scope 同时留在 current tree。P2 exact planning 已由 `b7f9713` 保存，现按
  单一 active planning contract 从 current tree 退场，不改其 immutable history。
- 首次完整 suite 为 95 tests、82 PASS、12 SKIP、1 FAIL；唯一失败不是 product behavior，而是
  `cloud-fixtures.test.js` 仍直接执行退休后的 upstream CLI 并依赖 scoped-plan overlay。该 fixture 已迁移到
  production-owned request seam，分别验证 validated Host path 与 explicit fallback 得到同一 report，并继续
  冻结 message/tool count、structured update、dedup、truncation marker 与 tail sentinel；focused 2/2 PASS。
- 迁移后的完整 `npm test` 为 95 tests、83 PASS、12 个 Windows/POSIX 诚实 SKIP、0 FAIL；repository lifecycle
  guard 9/9 PASS，未通过删减安全断言换取绿色结果。
- `tools/import_upstream_runtime.py check` PASS；三个 owned Python entrypoint compile PASS；`install.js` Node
  syntax PASS；v0.3.2 accepted 与 v0.3.3-dev candidate bootstrap 的 `bash -n` 均 PASS。Git Bash 在受限沙箱内
  因 Win32 signal pipe 权限失败，按 platform limitation 在沙箱外只重跑语法检查后通过。
- Git index 证明四个且仅四个 `runtime/upstream/*` 保持 `100755`；current-tree patcher/overlay key 扫描无残留；
  worktree 与 staged `diff --check` 均 PASS。
- 两次独立 dev ZIP 构建均为 21 entries、73920 bytes、SHA-256
  `378bab58aeeba958939eadcc5815bb017a6518bdefcea89743fc47095936389e`，逐字节一致且两次 contract check
  均 PASS。该 hash 只是未封板本地证据，不得写入 zero-hash bootstrap 或冒充 Published Release。
- G0～G5 的本地授权范围已完成；Cloud handoff 已生成于 `docs/v0.3.3-dev-cloud-hard-acceptance.md`。当前状态
  `LOCAL_PASS / CLOUD_PENDING`，下一步停在 R5-SC 外部执行前，不进入 seal、push、R5-PR 或 Phase 4。
- 最终 repository/architecture guards 在受限沙箱中因派生只读 Git 子进程返回 `status=null`；沙箱外原样重跑
  17/17 PASS。该现象归类为 platform limitation，测试断言和 production code 均未为此放宽。
