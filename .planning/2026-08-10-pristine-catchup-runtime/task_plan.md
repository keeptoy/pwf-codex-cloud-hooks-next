# Task Plan: v0.3.3-dev Pristine Catch-up Runtime

## Goal

把已经从 production behavior graph 退出的 catch-up overlay 从 current source/rebuild/install/Release contract
中正式退休：四个 pinned PWF v3.8.2 upstream runtime 文件全部保持 pristine，`owned-catchup.py` 继续只复用
显式允许的 parser helper closure，不调用 upstream CLI `main()`。

## Authorization

- 维护者已批准 P2-OTG-D 的 Route B 并要求继续施工，同时补充 `ARCHITECTURE.md` 的源码重建/生产执行边界。
- 本 gate 授权建立 `v0.3.3-dev` successor source identity、fail-closed development bootstrap、迁移 trusted
  bytes/contracts/importer/installer/Release allowlist/tests/docs，并进行本地完整验证。
- 维护者在 R5-SC 全部 Cloud 黑盒通过后，明确授权 push 当前分支，并把该列车封板、tag、发布为
  immutable `v0.3.3` 双资产；授权包含 publication 后公开重新下载复核。
- 维护者已回传完整 Published Release Cloud PASS，并授权将事实写回 acceptance/lifecycle 文档；本 gate
  仍不授权 GitHub Latest/rollback baseline promotion、外部 deployment 或 Product Phase 4 功能。
- 已发布 v0.3.2 的 tag、ZIP/bootstrap、SHA、acceptance、patcher/overlay identity 不得改写；历史恢复只走
  immutable refs 与 `BASELINE_PROVENANCE.md`。

## Invariants

- global PWF Skill 保持 pristine；production 只从 installed sibling owned runtime 执行。
- Managed policy 仍只注册 absolute `hook_adapter.py`。
- `owned-catchup.py` 继续负责 transcript selection/identity、immutable bytes、normalization、budget/rendering。
- Pinned pristine helper result 必须与退休前 managed helper result 等价；helper closure 不得进入 CLI selection/
  runtime inference/planning guard/rendering 或 `main()`。
- plan private snapshot、Host ABI、event dispatch、failure semantics 与 Phase 4 deferred behavior不变。
- current dev bytes 不能冒充 published v0.3.2；bootstrap checksum 在 seal 前必须为 64 位 zero hash并 fail closed。

## Gates

- [x] G0 — Successor identity and planning rotation：建立唯一 active scope、`v0.3.3-dev` package/candidate role与
  zero-hash bootstrap，不改发布角色。
- [x] G1 — Boundary tests：先补 managed/pristine result equivalence、helper allowlist/transitive closure 与
  import-time surface 断言。
- [x] G2 — Runtime/source migration：恢复 pristine `session-catchup.py`，简化 importer/runtime bundle/upstream
  manifest，删除 current patcher/overlay executable contract。
- [x] G3 — Install/Release/docs migration：同步 installed inventory、Release allowlist、tests、README、
  ARCHITECTURE、DESIGN、ROADMAP、CHANGELOG 与 provenance 冷历史边界。
- [x] G4 — Local acceptance：focused/full suite、import/check、compile/syntax、mode/LF、deterministic ZIP、
  repository guards 与 diff check 全绿。
- [x] G5 — Cloud handoff：生成 Source/Candidate 验收步骤并停下，等待维护者另行授权/执行 Cloud；不 seal。
- [x] G6 — Local pre-release refresh：清理 `.planning` 中已确认无文件的历史空目录，重新执行完整本地回归、
  双构建确定性、ZIP contract/checksum 与静态边界检查；产物仅作本地开发候选，不 seal、不发布。
- [x] G7 — Cloud runbook parity：以 v0.3.2 双通道手册为已验证骨架，把 v0.3.3-dev R5-SC 扩展为可直接
  执行的 Source/Candidate setup、Fresh、canonical planning、long tail、real Resume、doctor/inventory/policy/
  residue、失败取证和回传模板；保留未来 R5-PR 为 publication-gated 模板，不伪造未封板身份。补治理测试、
  完整回归、提交并按维护者授权 push。
- [x] G8 — Cloud lifecycle split：吸收 R5-SC setup/F 的真实 PASS 与官方 container-cache 时序证据，把 B
  按安装发生在 agent phase 或 setup phase 拆成 Source/Candidate post-install Resume 与 Published Release
  Fresh startup；恢复直接输出锚点汇总，更新 architecture/runbook guard 并完成本地验证。
- [x] G9 — v0.3.3 immutable publication：记录 R5-SC lifecycle PASS，核对远端 refs/Release 与身份窗口；
  push 当前 Cloud-passed source；冻结 stable package/contracts/bootstrap/acceptance，双构建/check、完整回归、
  publication audit；创建 immutable tag/Release 双资产并从公开 URL 重新下载复核。发布后停在 R5-PR Cloud。
- [x] G10 — Cloud acceptance consolidation：记录完整 R5-PR PASS；把 Published setup/F 分别并入 4.2/9.2；
  删除无意义的 Phase 4 marker 观察；将 B～E 提示词改为版本无关协议，并把 Published 脚本输入收敛为
  immutable asset URL + SHA。同步 lifecycle guard、ROADMAP/provenance 与活动证据，不改已发布资产。
- [x] G11 — Reusable Cloud acceptance template：新增不携带具体版本身份、测试计数、已发生的 PASS/PENDING
  或角色状态的
  `docs/cloud-hard-acceptance-template.md`；保留双通道 trust boundary、版本中立 B～F、可替换 URL/SHA 输入、
  失败取证与 evidence schema。接入 DESIGN/治理指南和通用 guard，不改变版本 acceptance 或 Release inventory。
## Next Step

停在 `CLOUD_HARD_ACCEPTANCE_PASS / PROMOTION_NOT_AUTHORIZED`，等待维护者另行决定是否开启 Latest/
rollback baseline promotion gate；不改写 v0.3.3 tag、ZIP/bootstrap 或 seal source。

## Stop Conditions

- pristine 与 managed module 对任何 owned request 产生不同 result envelope 或 diagnostic。
- helper transitive closure 进入四个 patched symbols、CLI `main()`，或 import 触发文件/网络/子进程行为。
- 迁移要求改变 Host ABI、plan snapshot、event dispatch、failure semantics 或 Product Phase 4 范围。
- current tree 需要改写 v0.3.2 immutable identity、移除其唯一恢复证据或削弱 publication/fallback oracle。
- 通用 archive hash、source integrity、global Skill pristine、installer drift 或 Release boundary 断言无法无损迁移。

## Status

G0～G5 本地范围全部 PASS；实现状态为 `LOCAL_PASS / CLOUD_PENDING`。P2-OTG-D 的 Route B 已落地；
published v0.3.2 身份未改写，v0.3.3-dev 仍是 zero-hash、未封板的 Source/Candidate。
Post-gate ARCHITECTURE ↔ source audit PASS：主体架构无需改造，部署图、单次 Host 输出与 transcript fallback
三处表达精度已按当前源码收紧并由 architecture guard 冻结；Cloud/Release 状态不变。
G6 发布前本地复验 PASS；development ZIP 双构建逐字节一致。状态仍为 `LOCAL_PASS / CLOUD_PENDING`，
该 ZIP 未 seal，不能作为 Published Release 身份。
G7 runbook parity PASS：R5-SC、B～F、失败取证、evidence ledger 与 publication-gated R5-PR 已达到可重放
粒度并由 lifecycle guard 冻结；状态仍为 `LOCAL_PASS / CLOUD_PENDING`。
G8 lifecycle split PASS：R5-SC setup/F Cloud 证据已写回，B 已按安装阶段拆为 Source/Candidate
post-install Resume 与 Published Release Fresh startup；architecture/guard/full regression 全绿。当前状态为
`SC_SETUP_PASS / SC_F_PASS / LIFECYCLE_PENDING`，下一步只执行 B-SC，不进入 publication。
维护者随后确认修订后的 R5-SC lifecycle 全部通过，并授权正式 publication。封板提交时状态为
`R5_SC_PASS / LOCAL_SEAL_PASS / PUBLICATION_PENDING / R5_PR_PENDING`；该状态不曾冒充 Release 成立。
G9 immutable publication PASS：`v0.3.3` tag 指向 exact seal source，双资产已发布并从公开 URL 重新下载
复核；Latest/accepted 仍为 v0.3.2。当前状态为 `PUBLICATION_PASS / R5_PR_READY`。
R5-PR 10.2 首次执行因提示词转义在下载前停止；直接获取原始 acceptance 并提取同一脚本后完整 PASS，
确认 repository/runbook 无缺陷。当前状态为 `PUBLICATION_PASS / R5_PR_F_PASS / R5_PR_CHANNEL_PENDING`。
维护者随后确认完整 Published Release Cloud channel 已验收通过，并授权只做手册/guard 通用化收口；当前
状态为 `CLOUD_HARD_ACCEPTANCE_PASS / PROMOTION_NOT_AUTHORIZED`。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| shell read 返回值包含 `Exit code/Wall time/Output` 三行元数据，机械生成的新 bootstrap 将其带入文件头 | 1 | 未执行该文件；用 apply_patch 删除三行并复核 shebang/version/zero hash，不重复假设 raw result 纯正文 |
| 新等价测试直接执行 wrapper CLI，在 Windows 因 production POSIX gate 返回 `invalid_request` | 1 | 保留 production gate；测试改用现有 native harness 调用 `run_request(require_posix=False)`，只比较 parser module 等价性 |
| shell read → apply_patch 替换 pristine runtime 时多带一个末尾空行，hash 为 `216268...` | 1 | importer fail closed；用 no-index diff 定位唯一空行并删除，继续以 pinned SHA `6476fd...` 为 authority |
| staged repository guard 发现 P2 completed scope 与新 active scope 同时留在 current tree | 1 | P2 已由 local immutable `b7f9713` 保存；按 lifecycle contract 删除其 current-tree 三文件，只保留新 active scope |
| 首次 full suite 唯一失败：Cloud fixture 仍直接执行已退休 upstream CLI，pristine CLI 对 scoped-only plan 安静退出 | 1 | 分类为历史 test coupling；迁移同一 fixture 到 owned wrapper exact request，覆盖 validated Host path 与 explicit fallback，保留 count/tail 断言 |
| 最终 repository guard 在受限 Windows 沙箱内派生只读 `git ls-files` 时返回 `status=null` | 1 | 归类为 sandbox process limitation；沙箱外原样重跑 repository/architecture guards 17/17 PASS，未修改断言 |
| G6 首轮并行检查通过 PowerShell 裸调用 `bash`，当前 `PATH` 无该命令，组合调用未返回其他子项结果 | 1 | 记录为本机工具发现问题；改为定位 Git for Windows 的显式 `bash.exe`，再整轮重跑并单独汇总 |
| G6 沙箱内 `npm test` 的 16 个 test file 均在 runner 启动时 `spawn EPERM`，Git Bash 也因 signal pipe Win32 error 5 退出 | 1 | 分类为已知 Windows sandbox process limitation；不改断言，申请沙箱外原命令复验 |
| G6 双构建脚本使用 `[System.Linq.Enumerable]::SequenceEqual[byte]`，被 PowerShell 在解析阶段拒绝 | 1 | 解析失败发生在任何命令执行前；改用 `StructuralEqualityComparer` 比较两个 byte array，再整套执行 |
| G7 contract inventory 首次读取猜测旧路径 `runtime/upstream-manifest.json`，文件不存在 | 1 | 不沿用历史布局；先用 `rg --files` 定位当前 manifest/contract authority，再据真实路径编写 Cloud 断言 |
| G7 focused lifecycle guard 首次失败：新增隔离项插入了旧测试冻结短语中间 | 1 | 保留“两条通道不得共用容器、安装状态或 B～F 结果”原句，planning/transcript 隔离另起一句 |
| G7 focused guard 的 `workspace.*install.js` 否定正则误命中文档“不得回退到 workspace install.js” | 1 | 脚本已正确使用 ZIP 内工具；说明改为“不得回退到 checkout 同名维护工具”，不削弱边界 |
| G7 runbook syntax extractor 预期 3 个 Bash fence，实际为 4 个 | 1 | 提取器在语法执行前停止；修正为 SC setup/SC F/PR setup/PR F 四块后逐块 `bash -n` |
| G7 closing 组合补丁因 task plan 状态段换行上下文不精确而整批拒绝 | 1 | `apply_patch` 未产生部分修改；读取精确片段后拆分为小范围 exact hunks |
| G8 focused `node --test` 在 runner 启动两个 test file 时均返回 `spawn EPERM` | 1 | 未进入断言，归类为既有 Windows sandbox limitation；改为逐文件直接执行相同 Node test 内容 |
| G8 runbook 抽取器猜测 `C:\Program Files\Git\bin\bash.exe`，本机不存在 | 1 | 在抽取/语法执行前停止；从实际 `git.exe` 位置推导同发行版 Bash 后重跑 |
| G8 抽取器定位真实 Git Bash 后在首个 `bash -n` 启动时遇到 Win32 signal pipe error 5 | 2 | 未检查脚本文字，归类为既有 sandbox limitation；沙箱外原样重跑四段 Bash 与三段 Python |
| G9 读取旧 Release 模板时请求了当前 `gh` 不支持的 `isLatest` JSON 字段 | 1 | 无远端写入；改用 `release list` 判断 Latest，并用受支持字段重读 v0.3.2 Release |
| G9 组合读取 tagged 文件时 `git show | Select-Object` 因下游提前关闭产生非零退出 | 1 | 已取得所需只读片段；后续避免截断 Git stdout，按精确文件或本地读取核验 |
| R5-PR 10.2 Cloud 临时脚本把 `$PUBLICATION_TAG` 变成 `$PUBLICATION\_TAG`，在 `set -u` 下报 `PUBLICATION: unbound variable` | 1 | 下载/doctor 均未开始；改为直接取得原始 acceptance、提取 10.2 code block 并原样执行后 PASS，确认只是提示词转义，不新增 repository hardening gate |
| G11 首次完整回归发现 README 导航改动使重建 ZIP SHA 偏离已发布 v0.3.3 | 1 | 模板本身位于 Release-excluded docs；撤回 sealed README 输入改动，改由 DESIGN/治理指南导航，重跑后 published ZIP oracle 与完整 suite 全绿 |
