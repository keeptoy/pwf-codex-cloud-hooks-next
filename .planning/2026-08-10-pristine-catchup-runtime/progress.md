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
- 2026-08-10 post-gate audit：维护者要求重新逐项确认当前 `ARCHITECTURE.md` 与真实源码流程一致。已恢复
  README/ARCHITECTURE/DESIGN/ROADMAP/活动 planning，并开始对照 adapter 与四份 request/result contracts；
  当前仅形成初步匹配证据，尚未完成 installer、owned runtimes、importer 和 Release 全链审计。
- 已完成 adapter、owned-plan、owned-catchup 的函数级调用链复核：plan-first、六字段 project 转交、private
  snapshot、pristine helper roots、immutable transcript bytes、canary/catch-up/plan 输出顺序与 child 降级匹配；
  记录一处 fallback root“顺序”措辞歧义，等待全链复核后统一修正文档并补 guard。
- 已对照 runtime bundle、upstream manifest 与 21-entry Release contract；确认四份 upstream pristine、source
  ZIP 与 installed runtime 分层正确，同时发现 ARCHITECTURE installed tree 漏画实际安装的 notice 文件。
- 已完成 installer/importer/builder 函数级审计：absolute adapter-only policy、27/30 秒 deadline 配合、exact
  installed inventory、doctor/repair drift 分类、四文件 pristine importer 与 21-entry ZIP builder 均匹配当前
  架构分层；暂无 production code defect。
- 已更新 ARCHITECTURE：部署图补 source → exact ZIP → install 层及 notice；Runtime 图改为 prepare canary →
  plan-first → 条件 catch-up → 单次 Host JSON；Catch-up contract 改为 allowed-root 构造 + Host-first + 跨根
  `mtime_ns` fallback；失败语义补 policy 30 秒与 adapter 27 秒/1 秒 reserve。
- 对应 architecture guard 18/18 PASS；完整 `npm test` 为 96 tests、84 PASS、12 个 Windows/POSIX 诚实 SKIP、
  0 FAIL；`tools/import_upstream_runtime.py check` 与 `git diff --check` PASS。审计结论：ARCHITECTURE 与当前
  v0.3.3-dev source/contracts 统一，状态仍为 `LOCAL_PASS / CLOUD_PENDING`。
- 2026-08-10：维护者授权清理 `.planning` 历史空目录并重做本地发布前测试。盘点确认四个历史 scope 完全
  为空，活动 scope 保留；新增 G6，只生成本地 development candidate，不授权 seal/tag/Release。
- 已对四个目标逐项执行 absolute containment、direct-item count 检查后删除；复核 `.planning` 只剩活动
  `2026-08-10-pristine-catchup-runtime`，其三份 tracked planning 文件与 `.active_plan` 均保留。
- G6 第一轮并行检查因 PowerShell `PATH` 中不存在裸 `bash` 命令而整体未产出可审计汇总；暂不采信同轮
  其他并行子项，先定位显式 Git Bash 路径后整轮重跑。该错误不涉及源码、ZIP 或测试断言修改。
- 显式定位 Git Bash 后的检查确认：importer integrity、三个 Python entrypoint compile、`install.js` syntax 与
  `git diff --check` PASS；沙箱内 `npm test` 全部停在 runner `spawn EPERM`，Git Bash 停在 signal pipe
  Win32 error 5，均未进入产品断言，按既有 platform limitation 在沙箱外原样复验。
- 沙箱外完整 `npm test` 实际执行 96 tests：84 PASS、12 个 Windows/POSIX 诚实 SKIP、0 FAIL；两个 current
  bootstrap 的 `bash -n` 均 PASS。首次 ZIP 双构建脚本因 PowerShell 泛型方法语法解析失败，任何 build/check
  尚未执行，改用非泛型 structural byte comparison 后重试。
- G6 ZIP gate PASS：两次独立 build/check 均为 21 entries、74,206 bytes、SHA-256
  `40e3e134aa4d9a7f452a2447f4aa9026af479882c9b7f78074fc9e3370646182`，byte-for-byte 一致；已删除比较副本，
  只保留 ignored `dist/pwf-codex-cloud-hooks-v0.3.3-dev.zip`。这只是 development candidate，不写 bootstrap
  hash、不 seal、不 tag、不发布，状态保持 `LOCAL_PASS / CLOUD_PENDING`。
- 2026-08-10：维护者指出 v0.3.3-dev Cloud hard acceptance 相比 v0.3.2 过度简化，并授权补齐、验证、提交和
  push。初步结构盘点为 142 行/11 个主节对 649 行/完整双通道 13 节；新增 G7，按已验证 v0.3.2 骨架做
  current-contract parity，不把尚未封板的 v0.3.3-dev 写成 Published Release。
- G7 contract inventory 首次误用已退休布局猜测路径 `runtime/upstream-manifest.json`，读取失败且未修改文件；
  改为先从 current tracked inventory 定位 machine authority，避免把 v0.3.2 历史路径抄进 successor runbook。
- 已将手册扩展为 799 行、14 个主节：完整 R5-SC setup、B Fresh、C baseline、D canonical、E long-tail/
  real Resume、F source deep check、publication-gated R5-PR 双脚本、证据模板和失败取证。focused guard 前两次
  分别发现旧固定短语被插断与否定说明触发宽正则，均只调整表达/guard，不修改生产行为或验收强度。
- repository lifecycle focused guard 已在扩展后 10/10 PASS；新增断言冻结 portable suite/双构建、pristine
  contract、四 helper roots、B～E 提示词、10-file inventory、source/public F gate 与双通道 evidence ledger。
- 首次 runbook Bash fence 提取器把实际四块误记为三块，在运行任何 `bash -n` 前按数量断言停止；修正
  expectation 后重跑，不据此判断手册脚本失败。
- Runbook code validation PASS：四个 Bash fence 分别 `bash -n` PASS，三个 Python heredoc 分别 compile
  PASS；R5-SC setup 内的 static contract heredoc 在当前仓库实际执行并输出 `V033_DEV_STATIC_CONTRACT=PASS`。
- G7 完整验证 PASS：focused lifecycle guard 10/10；完整 `npm test` 96 tests、84 PASS、12 个 Windows/POSIX
  SKIP、0 FAIL；importer、owned Python compile、install/guard Node syntax、两个 bootstrap Bash syntax 与
  `git diff --check` 全绿。Release ZIP fresh rebuild 仍为 21 entries、74,206 bytes、SHA-256
  `40e3e134aa4d9a7f452a2447f4aa9026af479882c9b7f78074fc9e3370646182`，与原 development candidate
  byte-for-byte 相等，证明 docs/tests 治理变更未进入 ZIP payload。
- CHANGELOG 的 v0.3.3-dev 已同步本次实际文档/guard delta；ROADMAP programme、Host ABI、production
  behavior、accepted baseline 与 Release authorization 均未改变。
- 2026-08-10：维护者回传 R5-SC setup 93/93、deterministic ZIP identity 与 Source/Candidate F 深度复验
  全部 PASS；B 的 `startup` 期望与实际“空 environment setup → agent prompt 内安装 → 新 task”时序冲突。
  官方文档复核进一步确认冷任务与 cached environment 有不同 checkout/setup 顺序；新增 G8，只修订 Cloud
  lifecycle 模型、runbook 与治理 guard，不修改 production、ZIP 或 publication 状态。
- G8 首次 focused `node --test` 在 runner 派生两个 test file 时均被 Windows sandbox 以 `spawn EPERM`
  拒绝，未进入任何 assertion；沿用既有分类，不弱化 guard，改为逐文件直接运行同一测试内容。
- G8 runbook 抽取器首次使用猜测路径 `C:\Program Files\Git\bin\bash.exe`，在读取任何 code block 前因文件
  不存在停止；记录为工具发现错误，改从当前 `git.exe` 的实际安装位置推导 Bash。
- 从 `D:\Program Files\Git\cmd\git.exe` 成功推导 Bash 后，沙箱在首个 `bash -n` 启动阶段返回已知 Win32
  signal pipe error 5；尚未检查脚本文字，下一步在沙箱外原样重跑抽取器。
- G8 验证关闭：沙箱外 focused architecture/repository guards 18/18 PASS；完整 `npm test` 为 96 tests、
  84 PASS、12 个 Windows/POSIX 诚实 SKIP、0 FAIL；runbook 四段 Bash `bash -n` 与三段 Python heredoc
  compile 全部 PASS，`git diff --check` PASS。production、ZIP 输入、Host ABI 与 Release identity 均未改变。
- 2026-08-10：维护者确认 R5-SC 剩余 lifecycle 全部通过，并授权 push 与正式发布；新增 G9，目标
  immutable identity 为 `v0.3.3`。当前先做远端/ref/Release 审计与 Cloud-passed source push，随后严格按
  ZIP → bootstrap → tag/Release → 公开重新下载顺序封板；R5-PR 与 Latest/rollback promotion 继续分离。
- G9 远端只读审计 PASS：fetch 后本地相对 `origin/0.3.3-dev` 为 0 behind / 1 ahead，`v0.3.3` tag/Release
  均不存在；现有 Releases 为 v0.3.0～v0.3.2，Latest 仍为 v0.3.2。当前 dev identity 尚未封板，不能直接
  把 ignored development ZIP 当作发布资产。
- 已提交并 push Cloud-passed source 与 G9 authorization：远端 `0.3.3-dev` 现指向 `4027d15`。读取 v0.3.2
  Release 模板时首次请求不支持的 `isLatest` 字段失败且无写入；改用支持字段后确认历史发布为两个资产、
  non-draft/non-prerelease，notes 明确保留 Cloud/Latest/rollback 分离。
- Stable identity 第一阶段已完成：package/Release contract 切换为 `0.3.3`，bootstrap 与 acceptance 重命名为
  stable 路径，ROADMAP/CHANGELOG/tests 同步，bootstrap 仍保留 zero hash 等待最终 ZIP。Release contract
  新 SHA `253cf6f9...f7db` 已写回 upstream manifest；尚未构建或声明 sealed bytes。
- Stable ZIP 第一次双构建/check PASS：两份均为 21 entries、74,198 bytes、SHA-256
  `2b2dca5c5894a2297a6f2ccc5fb190878c3c920b71148719a4873326b4ccb352`，importer check PASS；已把该
  exact SHA 写入 `init-cloud-sandbox-v0.3.3.bash`，tests 从 zero-hash candidate 语义切换为 sealed default +
  explicit-zero fail-closed。尚未计算 bootstrap identity 或创建 seal commit/tag。
### 2026-08-10 G9 stable seal validation

- `git diff --check` 与 `python tools/import_upstream_runtime.py check` PASS。
- 受限 Windows sandbox 中运行 Node focused tests 时，test runner 在创建子进程前统一返回 `spawn EPERM`；
  分类为 platform limitation，不是产品或断言失败，按仓库既有规则改在允许子进程的环境重跑原命令。
- 首次完整 suite 在重命名尚未进入 Git index 时出现 2 个 repository-boundary FAIL；断言正确指出
  `git ls-files` 仍看到 `-dev` 路径。暂存精确重命名后重跑：96 tests，84 PASS、12 Windows/POSIX SKIP、
  0 FAIL。
- importer、Python compile、`node --check install.js`、最终 bootstrap `bash -n` PASS。
- stable ZIP 两次独立 build/check 逐字节一致：21 entries、74,198 bytes、SHA-256
  `2b2dca5c5894a2297a6f2ccc5fb190878c3c920b71148719a4873326b4ccb352`。
- external bootstrap：21,565 bytes、SHA-256
  `236e364bde8397b04c9d7ebfa121fa96963055d77b56e6299e6b9c9aad6c887e`。
- `bash` 不在 PowerShell PATH 的第一次语法命令属于 platform invocation error；改用本机
  `D:\Program Files\Git\bin\bash.exe -n` 后 PASS。
