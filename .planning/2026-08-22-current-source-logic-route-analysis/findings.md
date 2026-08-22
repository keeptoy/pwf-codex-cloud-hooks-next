# Findings: Current source logic and route analysis

## Scope and current lifecycle

- 本仓库只正式支持 `OthmanAdi/planning-with-files v3.8.2`，不是通用 Skill 转换器。
- 当前分支/HEAD 是 post-release 文档治理后的 `0.4.0` 工作树；immutable `v0.4.0` tag仍指向实际完成 sealed-source Cloud 验收的 source。
- ROADMAP 的当前角色是 `v0.4.0` accepted/Latest、`v0.3.5` immediate fallback、`v0.3.4` deeper fallback。
- Product Phase 4 与 `v0.4.0` Phase 9 instance 都已关闭；Phase 5～8 只是未来 Discovery 候选，后继版本列车未命名、未授权。
- 原 `.active_plan` 仍指向已关闭 Phase 9。planning runtime 不解析 plan 的 closed 状态，只依据 pointer/目录/`task_plan.md` 存在性选择计划，因此 closed 与 active 是仓库治理语义，不是当前 runtime schema 中的机器状态。

## One-sentence architecture

上游 PWF 提供 planning 工作流与 pristine canonical scripts；本仓库负责固定来源、owned copy、Host protocol、managed installation、failure isolation、Cloud/Release acceptance 和 rollback evidence。

## Authority reduction pattern

当前架构的主线不是扩大功能，而是把每类决定压缩到一个权威：

| 问题 | 唯一权威 |
|---|---|
| plan resolution、attachment、profile admission、snapshot/render | `runtime/owned-plan.py` |
| transcript selection、identity、normalization、catch-up report | `runtime/owned-catchup.py` |
| Host event parsing、child supervision、最终组合 | `hooks/hook_adapter.py` |
| runtime source/install inventory | `contracts/runtime-bundle-v2.json` |
| provenance 与 bundle/contract raw SHA index | `upstream-manifest.json` |
| installed state snapshot | `installed-manifest.json`（安装后产生） |
| candidate ZIP allowlist/mode/metadata | `contracts/release-artifact-v2.json` |
| programme/版本角色 | `ROADMAP.md` |

## Supply-chain and Release flow

```text
pinned PWF v3.8.2 archive
  -> importer verifies archive SHA, raw runtime-bundle SHA, exact schema and pristine bytes
  -> runtime/upstream/* (exactly four pristine 0755 files)
  -> local owned runtimes + installed ABI contracts
  -> Release builder applies exact 22-entry allowlist
  -> deterministic ZIP
  -> external checksum-pinning bootstrap remains outside ZIP
```

- importer 和 installer 都先验证 manifest 固定的 runtime bundle 原始 SHA，再解析 inventory。
- runtime bundle 安装投影是 3 个 local runtime、4 个 pristine upstream runtime、4 个 ABI contracts；installer 再加入 notice，形成 12 个 installed files。
- Release artifact 当前包含 22 entries，固定 UTF-8 path 排序、1980 时间戳、deflate level 9 与 entry mode。
- bootstrap 单独固定 PWF archive、PowerShell package、hooks ZIP URL/SHA；它先安装并验证 pristine global Skill，再 dry-run/install/doctor managed hooks。

## Installer logic

- `install.js` 先严格验证 package manifest、bundle、contract hash、dependencies、mode 和 source bytes。
- global Skill 仅用于 pristine identity 验证；production 不从 global Skill 执行可变脚本。
- Managed requirements 只注册两条 absolute adapter command：`SessionStart` 与 `UserPromptSubmit`。
- install 在 lock 内 capture shared fingerprints、重建 proposed requirements、验证 current/exact predecessor runtime、备份、再次核对共享状态，然后写 runtime/requirements/manifest。
- current installer只准入完整 current state或transition contract精确描述的`0.3.5` predecessor；direct old-over-current downgrade fail closed。
- doctor 对 manifest、owned/unowned requirements fingerprints、handler count、runtime exact inventory、hash、mode、unknown file/directory 分类。
- repair 只处理证明为 owned 且能从 manifest 精确重建的 drift；unknown/unowned drift 是 blocker。

## Runtime event flow

```text
Codex Hook stdin JSON
  -> adapter validates bounded Host input
  -> prepare mandatory canary
  -> invoke owned-plan exact-v2 for both supported events
      -> resolve plan -> attachment -> activation-first admission
      -> safe capture -> private snapshot -> pristine injector -> revalidation
  -> only SessionStart + validated inject=true plan result
      -> forward exact six-field project to owned-catchup
      -> validate/freeze transcript bytes -> parse/normalize/render
  -> emit exactly one Host JSON result
     order: canary -> optional catch-up -> optional plan context
```

### Adapter

- Host input上限1,000,000 bytes；child request/stdout/stderr均bounded。
- adapter不读取`task_plan.md`、`progress.md`，也不实现第二套plan selection或transcript parser。
- adapter有27秒内部deadline，在30秒Managed Hook timeout内保留finalization时间。
- plan child失败或invalid result时只输出canary且不启动catch-up；catch-up失败时保留健康plan。

### Owned plan

- canonical precedence：`PLAN_ID` → `.planning/.active_plan` → newest scoped → legacy root。
- 文件读取使用`O_NOFOLLOW`、regular-file、单链接、size/UTF-8检查、前后identity复核和directory identity复核。
- 先捕获activation commit point；缺失时`.mode`、nonce、attestation、ledger完全inert。
- legacy是默认；smart要求exact smart activation与`inject-smart`；autonomous要求profile-bound token、`autonomous` mode、16位hex nonce、task SHA attestation和bounded ledger。
- autonomous只把ledger的`tick/event`写入private snapshot；raw summary、files、timestamp和`progress.md`不进入renderer。
- renderer返回后再次核对task/progress及全部activation state；执行中变化则丢弃输出。
- armed invalid/incomplete/future/over-budget state不降级legacy，而是返回bounded advisory并拒绝注入。

### Owned catch-up

- 只在SessionStart和健康plan result之后运行；project状态来自validated plan result，而不是重新解析workspace。
- allowed roots按`CODEX_SESSIONS_DIR`、`CODEX_HOME/sessions`、installed adapter layout推导并去重。
- Host transcript优先；runtime以no-follow、single-link、identity和containment重新打开并冻结bytes。
- fallback最多检查256个候选，在全部allowed roots中按`mtime_ns`全局排序，再匹配session/project。
- malformed、identity mismatch、oversize或unreadable transcript不产生partial report。
- 只复用pinned pristine `session-catchup.py`的四个helper roots，不调用CLI `main()`。

## Stable failure semantics

- source/hash/mode/schema/inventory/content injection：fail closed。
- plan child failure：canary-only，catch-up不启动。
- catch-up child failure：保留canary和健康plan。
- advisory child failure：Codex主循环fail open。
- stdout必须是一个bounded JSON result；stderr仅作诊断。

## Evolution route

1. `v0.1`：legacy hooks/trust尝试，Cloud信任链失败。
2. `v0.2`：建立system-managed requirements与absolute adapter可行路径。
3. `v0.3`：建立fixed supply chain、owned runtime、thin adapter、canonical owned-plan和immutable transcript boundary。
4. `v0.4`：在legacy默认和两个turn-start events不变的前提下，引入显式smart/autonomous、真实Cloud lifecycle、disarm-first rollback和stable Release晋级。

## Future route candidates

- Phase 5：先验证现有`SessionStart source=clear|compact`是否足够；只有真实时序/context缺口才新增compaction Hook。
- Phase 6：PreToolUse/PostToolUse/PermissionRequest逐项评估，可整体`NO_GO`，不是Phase 7前置。
- Phase 7：read-only advisory completion evaluator，不阻断、不写mutable state，可独立于Phase 6进入Discovery。
- Phase 8：复用Phase 7 evaluator增加hard gating；实施前必须重新Discovery writer/counter/lock/cache/Resume/rollback。
- Phase 9：每条版本列车重复进入的Release standing gate，不是固定的产品版本0.9.0。

## Follow-up Discovery reassessment

### Closed plan versus active pointer

- planning-with-files 的 scoped `init-session.sh` 会先创建新计划目录和三份 planning 文件，然后自动把 `.planning/.active_plan` 改写为新 `PLAN_ID`；已有计划也可由 `set-active-plan.sh` / `set-active-plan.ps1` 显式切换。
- Hook/runtime 的职责不同：它只按 `PLAN_ID` → `.active_plan` → newest scoped plan → legacy root 解析已有状态，不从自然语言对话推断计划身份，也不解析 `closed`。
- 因此“技能在新任务初始化时自动切换”与“resolver 不理解 closed”可以同时成立。按正常技能工作流，新复杂任务一旦初始化，旧 Phase 9 指针自然退场；下一计划尚未建立时保留最后一份可恢复记录，是当前 last-active/recovery 模型的自然结果。
- **重新分类：这不是当前产品缺陷，也不需要单独 Discovery。** 只有未来明确要求表达机器可判定的 `no active plan`、或必须消除新计划创建前的一次旧上下文注入时，才需要设计 inactive sentinel/clear-pointer 语义。

### Uninstall ownership admission

- README 的 Pre-1.0 支持边界明确要求遇到 unknown drift 时先保存 doctor/backup 证据，再走“明确卸载/清理流程重新安装”；历史合同也把 current uninstall 描述为拥有 managed runtime 与 requirements marker。因此，显式 uninstall 允许删除固定 runtime 目录中的 unknown 普通文件，是有意的 recovery/cleanup 语义，不应直接复用会拒绝 unknown inventory 的 `assertSafeRuntimeForInstall()`。
- Windows disposable fixture 证明：只有一个陌生 `operator-note.txt`、且没有有效 installed manifest 时，uninstall 返回成功，删除 runtime，并在 backup 中逐字保留陌生文件。这与上述合同一致。
- 同一 fixture 中，runtime 自身是 junction 时，Windows 在 backup 重建 junction 处以 `EPERM` 失败并保留 target；这是平台偶然保护，不是 installer 主动拒绝，也不能作为稳定合同。
- **已确认的独立缺口：** 当 `<codex-home>/hooks` 父目录是指向 fixture 外部目录的 junction 时，uninstall 返回成功；backup 保存了外部 runtime 字节，但随后 `fs.rmSync(paths.runtime, {recursive:true})` 穿透父 junction，删除了外部 `planning-with-files` 目录和 sentinel，父 junction 本身仍存在。
- 根因是 uninstall 在 `backup()` 和递归删除前没有像 install admission 那样 `lstat` 检查 `<codex-home>/hooks` 与 runtime root；`captureSharedState()` 只冻结 requirements 和 manifest，不能建立 runtime path containment。
- 这应被分类为 **uninstall path-safety defect**，而不是 unknown ownership policy 缺陷。至少 Windows junction 已有真实证据；POSIX 父 symlink 是否同样可复现仍需 Linux gate，不能用 Windows 结果代替。
- 合理修复方向是增加 uninstall 专用的窄路径准入：拒绝 symlink/junction/special path 与越界父路径，同时继续允许 unknown regular files/directories 被备份后清理。不能原样复用 install 的 exact manifest/inventory/hash admission，否则会破坏 README 承诺的 unknown-drift recovery escape hatch。
- 应新增三类回归：unknown regular entry 仍可备份并卸载；direct runtime link 与 linked parent 在任何写入/backup 前拒绝；Linux 对 POSIX symlink 路线零 skip。runtime 并发替换窗口可在同一 patch Discovery 中继续审计，但本轮尚未用 race fixture 证明。

## Verification evidence

- `npm test`：177 tests；152 pass；0 fail；25 honest Windows Linux/POSIX skips。
- importer check：四个pristine upstream runtime文件healthy，hash与bundle一致。
- Python compile：`hook_adapter.py`、`owned-plan.py`、`owned-catchup.py` PASS。
- `node --check install.js` PASS。
- `bash -n init-cloud-sandbox-v0.4.0.bash` PASS。
- deterministic build/check：22 entries、85,519 bytes、SHA-256 `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`。
- Git mode：四个且仅四个`runtime/upstream/*`为`100755`。
- `git diff --check` PASS。

## Working-tree protection

- 分析开始前已有78个`.planning`文件删除，共约7,130行；归属用户，未恢复、未覆盖、未暂存。
- 本任务只新增当前analysis planning三文件并切换active pointer；production、contracts、Release inputs和公开资产保持不变。

## Primary resources

- `README.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `ROADMAP.md`
- `CHANGELOG.md`
- `hooks/hook_adapter.py`
- `runtime/owned-plan.py`
- `runtime/owned-catchup.py`
- `install.js`
- `contracts/runtime-bundle-v2.json`
- `contracts/release-artifact-v2.json`
- `tools/import_upstream_runtime.py`
- `tools/build_release.py`
