# Progress: Phase 9 instance — v0.4.0 Release Discovery

## 2026-08-19

- Maintainer authorized Phase 9 Discovery after F3C4 aggregate closure and first retirement review.
- Ran planning session catch-up; confirmed clean `0.4.0-dev` at `d5102ca` and a completed predecessor plan.
- Opened a version-scoped standing-gate plan. No Release input, Cloud environment, ref or remote state has been changed.
- Read README and ARCHITECTURE completely. Confirmed the deferred README pre-live sentence and found two additional stale F3C-future
  claims in ARCHITECTURE; widened the Discovery inventory, not the implementation authorization.
- Read DESIGN and ROADMAP. Identified stale future-gate wording in DESIGN's test routing and lower ROADMAP sections while preserving the
  current top-level Phase 4/standing-Phase-9 authority. No stable or Release-input document was edited.
- Audited package, manifest, runtime bundle, Release v2, bootstrap and principal Release tests. Froze the stable version/hash propagation
  graph and confirmed README is the only macro document in the 22-entry ZIP.
- Read the Cloud template, v0.3.5 acceptance precedent, current v0.4.0-dev acceptance, CHANGELOG and provenance. Confirmed acceptance
  rename-not-duplicate semantics, four distinct Release gates and several Release-excluded stale-v1/F3-pending narratives.
- Audited candidate/publication/repository/contract tests. Identified the mixed v2-accepted/v1-fallback oracle migration and classified
  stable-identity hardcodes versus the v0.3.5 predecessor contract that must remain unchanged.
- Completed the authority/identity readiness gate and entered the pre-seal input inventory.
- Audited all 11 validation refs. Two runtime-source commits are already reachable from the development line, but nine lifecycle commits
  remain side-branch-only and none is retained by the current stable tags. Recorded hashes do not replace object retention, so the
  Phase 9 default is KEEP unless a later separately authorized archival migration proves an equivalent recovery path.
- Logged one harmless audit-command defect: an expected negative ancestry result became the combined shell command's final exit code.
- Confirmed F3B2/F3B3/F3C guides are exact executable dev-evidence records, with tests bound to their paths and frozen identities. They
  stay under their existing names; stable publication must link them rather than rename them.
- Reconstructed the v0.3.5 commit sequence and preserved its separation between candidate evidence, stable byte seal, tag evidence and
  later published-role governance as the model for v0.4.0 sub-gates.
- Materialized the version-scoped Phase 9 history, Phase 4.11 successor link, history index policy, ROADMAP P9-A～P9-F route and a
  version-acceptance Discovery row. Release inputs remain unchanged.
- First focused runner attempt was platform-blocked by Windows sandbox `spawn EPERM`; direct-file execution proved the new Phase 9
  guard passes and identified one stale Phase 4 prose assertion, which was narrowed to the enduring closeout fact before rerun.
- Focused architecture/F3/rollback/repository suite now passes: 28 tests, 26 pass, 0 fail and 2 honest Linux-only skips. This is a
  Windows Discovery result; it does not claim Linux or Cloud acceptance.
- Full Windows suite passes: 173 tests, 148 pass, 0 fail and 25 honest Linux/POSIX-only skips.
- Closed P9-D1 through P9-D3: pre-seal inventory, P9-A～P9-F evidence routing, role rotation and object lifecycle decisions are frozen.
  Entered final documentation/verification handoff only; P9-A remains unauthorized.
- A parallel static-postflight attempt hit Git Bash `Win32 error 5` while creating its signal pipe. No repository defect was inferred;
  postflight is being rerun sequentially so each final exit status remains attributable.
- Sequential postflight passed importer, owned Python compile, installer Node syntax, all bootstrap Bash syntax and `git diff --check`.
- Two independent candidate builds/checks remained byte-identical at the existing 22-entry development identity; temporary ZIPs were
  removed. Changed paths intersect neither Release entries nor external assets.
- Corrected an audit-only ref prefix mistake and then required all 11 local/origin validation ref pairs to match exactly; PASS.
- Closed P9-D4 with a version-scoped conditional-go. The next authorized action, if the maintainer chooses it, is P9-A only.
- Maintainer subsequently authorized P9-A only. Reopened the version-scoped plan with P9-A0～P9-A4 implementation gates and preserved
  explicit stops before exact-hash seal, Cloud, remote refs/publication/promotion and Phase 5.
- Re-read README and ARCHITECTURE completely. Bound the exact state-neutral README replacement and the two ARCHITECTURE F3C-current
  corrections; no runtime or trusted-graph delta is required.
- Re-read the remainder of ROADMAP. Confirmed its generic Release/rollback rules remain current; P9-A only needs this train's current-role,
  gate-state and pre-seal-input reconciliation.
- Re-read CHANGELOG and provenance. Added the stale current v1 supply-chain narrative to P9-A reconciliation while preserving immutable
  historical v1/overlay evidence.
- Ran the pre-edit identity scan. Classified stable identity targets separately from immutable F3 dev evidence and the v0.3.5 predecessor
  transition contract; only the first class will migrate in P9-A.
- Read the exact package/Release/manifest/bootstrap/acceptance inputs and froze the stable propagation graph. Bootstrap exact ZIP hash remains
  zero in P9-A; executed dev evidence inside the renamed acceptance remains historical.
- Read repository/release/publication tests. Froze manifest-routed v1/v2 historical package discovery and the supported
  uninstall/clean-install/forward-recovery rolling-window oracle.
- Added P9-A guards first. Focused red run produced the expected four repository-boundary failures: old dev package role, missing stable
  acceptance filename, stale README F3-pending prose and old acceptance anchor. Release/package/publication tests otherwise passed,
  including the newly manifest-routed historical oracle and supported rolling-window recovery sequence.
- Migrated the stable package/Release/manifest/bootstrap/acceptance identity, renamed rather than duplicated the two versioned files,
  reconciled README/ARCHITECTURE/DESIGN/ROADMAP/CHANGELOG/provenance and appended the version-scoped P9-A implementation ledger.
- First green focused pass exposed one remaining test-only ROADMAP summary lock; narrowed it to the stable Phase 4/P9-A/P9-B boundary
  instead of restoring per-gate prose. Repository boundary then passed 10/10 with zero skips; the broader focused suite had otherwise
  passed 38/39 with only that prose mismatch and two honest Windows Linux-only skips.
- Full Windows suite first rerun reached 173 tests with 147 pass, 1 fail and 25 honest skips. The sole failure was a stale assumption that
  only `-dev` identities may carry zero hash; changed the guard to derive accepted status from ROADMAP and the actual checksum bytes.
  Bootstrap focused tests then passed 4/4.
- First combined static/build postflight stopped at Git Bash `Win32 error 5` while creating its signal pipe after importer and Python/Node
  syntax had passed. This is the known Windows process-launch limitation, not a script failure; deterministic builds had not started and
  will be rerun separately with attributable exits.
- Separate postflight passed importer, owned Python compile, installer Node syntax, both bootstrap Bash syntax checks and `git diff --check`.
- Two independent stable candidate builds/checks were byte-identical: 22 entries, 85,519 bytes, SHA-256
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`; bootstrap remained 64-zero and fail closed.
- Final full Windows suite passed: 173 tests, 148 pass, 0 fail and 25 honest Linux/POSIX-only skips. A final promotion-window oracle
  refinement then passed its focused 9/9 suite: after future promotion, the older package and admitted predecessor dynamically become the
  fallback rather than comparing accepted/current identical bytes.
- Final identity closure matched package/Release at `0.4.0`, stable bootstrap path, manifest raw Release-contract SHA
  `56c5ca811e40fa19eb5a1a22c59e1ec4baa9f5cb8f622ff8769db0c3a7927685` and actual bytes. Changed paths intersect exactly five
  current Release inputs: README, package, manifest, Release v2 and the renamed stable bootstrap; runtime/trusted-graph delta is empty.
- Residue scan found the retired dev bootstrap path only inside the frozen F3C operator guide, where it addresses the exact archived
  protocol source that actually ran. No current authority or current package points to the retired dev bootstrap/acceptance paths.
- Closed P9-A0 through P9-A4 and stopped before P9-B. No Cloud, seal hash write, ref mutation, remote action, publication or promotion ran.
- Maintainer authorized P9-B. Reopened the plan for local byte reproof, exact external-bootstrap sealing, local/ref-aware regression and
  sealed-source Cloud handoff only; P9-B remains incomplete until exact-HEAD Cloud evidence returns, and P9-C remains unauthorized.
- Before editing bootstrap, two independent current builds/checks reproduced the P9-A identity exactly: 22 entries, 85,519 bytes,
  SHA-256 `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`, byte-for-byte deterministic.
- Replaced only the stable bootstrap default zero checksum with that frozen ZIP SHA. Sealed bootstrap SHA-256 is
  `4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f`.
- Rebuilt/check-copied two candidates after sealing; ZIP identity stayed exactly 22 / 85,519 /
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`, proving the external asset did not enter the archive.
- Added the P9-B state guard first. Its escalated Windows red run produced exactly the expected stale ROADMAP/history/acceptance failures;
  after synchronizing the three authorities, the focused bootstrap/release/publication/repository matrix passed 26/26 with zero skips.
- Full Windows suite passed: 173 tests, 148 pass, 0 fail and 25 honest Linux/POSIX-only skips. Importer, owned Python compile,
  installer Node syntax, both versioned bootstrap Bash syntax checks and `git diff --check` also passed.
- P9-B local seal evidence now explicitly distinguishes local frozen bytes from sealed-source Cloud acceptance. No Cloud, ref mutation,
  tag, Release, publication, promotion or P9-C action has run.
- Final ref-aware audit confirmed immutable tags `v0.3.5=5d01b55890c1da2a5088e2b991b152a9fb1c3f87` and
  `v0.3.4=59a999f705701ec67463649e9424f3d059863c81`, plus all 11 local/origin validation-ref pairs at identical commits.
- Changed-path audit against the P9-A parent intersects zero ZIP entries and exactly one external Release asset:
  `init-cloud-sandbox-v0.4.0.bash`. The first audit command had a PowerShell `${tag}:` interpolation defect; the corrected full audit passed.
- After local seal commit, the maintainer reopened ROADMAP governance before Cloud. Preserved the sole dirty user edit, recorded that
  `390d666` is a superseded Cloud-HEAD checkpoint rather than the final sealed-source identity, and began restructuring only ROADMAP
  sections 4/5; the separate P9/F3B2 paragraph decision is intentionally deferred until that structure closes.
- Closed ROADMAP governance items 1–2 in place: established one top-level Product Phase chapter, moved durable Phase 4/5–8 routing
  beneath it, removed the duplicate chapter and temporary `4.6` chronology, retained compact atomic-candidate and object-lifecycle
  governance, and corrected the renumbered Discovery cross-references. The separately identified P9/F3B2 paragraphs remain byte-for-byte
  untouched pending discussion.
- Focused architecture/repository governance passed 18/18 after the first Windows sandbox attempt was correctly classified as
  `spawn EPERM`. Two independent candidate builds/checks remained byte-identical at 22 entries, 85,519 bytes and SHA-256
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`, proving the ROADMAP/test/planning changes are Release-excluded.
- Full Windows regression passed unchanged at 173 tests: 148 pass, 0 fail and 25 honest Linux/POSIX-only skips; `git diff --check`
  also passed. P9-B3a is closed, while the two current-status paragraphs remain deliberately untouched for the separate P9-B3b
  disposition discussion.
- Saved the verified P9-B3a structure as local commit `dfbc128` (`docs: reorganize roadmap phase governance`). The initial sandboxed
  commit attempt could not create `.git/index.lock`; the identical scoped commit succeeded with Git metadata permission. No remote write ran.
- Maintainer approved P9-B3b. Removed the two redundant chapter-4 paragraphs without migration, shortened the 4.1 heading, retained the
  current role-window/zone-governance paragraph in place, and added a structural guard against reintroducing F3B2 contingency chronology.
- P9-B3b focused governance passed 18/18. Two independent ZIP builds/checks remained byte-identical at 22 entries, 85,519 bytes and
  SHA-256 `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`; `git diff --check` passed. The retained chapter-4 opener
  remains current-train governance, while the removed chronology stays owned by Phase history/acceptance.
- Opened P9-B3c to turn the sealed-source Cloud handoff into an executable maintainer entry without creating a second acceptance or
  copying the generic template's Bash. Added a repository guard first; its intentional red run produced one missing-anchor failure with
  9/10 tests passing, confirming the new documentation contract was not yet materialized.
- Added the P9-B operator entry to the existing v0.4.0 acceptance. It dynamically derives/push-verifies the final HEAD, explains the
  `PWF_ACCEPTANCE_NODE_MAJOR` precondition, routes 4.1 → 5.1 → 6 → 7 → 8.1 → 8.2 → 9.1 to stable template anchors, supplies copyable
  non-Bash prompts, freezes returned facts and stop conditions, and keeps P9-C unauthorized.
- The first focused green run was platform-blocked by the known Windows `spawn EPERM`; the escalated rerun executed 18 tests and found
  one documentation defect: the 9.1 return list named `PWF_SC_POST_RESUME` without requiring its exact `=PASS` value. Kept the test
  strict and corrected the operator PASS criteria rather than weakening the guard.
- The next focused run exposed an ordering conflict with the existing exact-evidence lifecycle guard: the pending operator entry had
  placed the frozen ZIP SHA above the completed local-seal heading. Reordered the acceptance to present completed seal evidence first,
  then the pending Cloud procedure, and updated the new structural guard to require that hierarchy.
- Final P9-B3c focused governance passed 18/18. Full Windows regression passed 173 tests: 148 pass, 0 fail and 25 honest Linux/POSIX-only
  skips. Importer, owned Python compile, installer Node syntax, `git diff --check` and both bootstrap Bash syntax probes passed; the first
  sandboxed Bash attempt hit the known Win32 signal-pipe restriction and the permissioned rerun passed both files.
- Two independent candidate builds/checks stayed byte-identical at 22 entries, 85,519 bytes and SHA-256
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`. The operator entry, guard and planning are Release-excluded;
  P9-B3c is complete, while sealed-source Cloud evidence and P9-B closure remain pending before P9-C.
- Maintainer completed the exact-source Cloud route from pushed commit `fe8cd7f284ea2849f634aa68813dbb0f2cca83f9`. Setup exited 0,
  ran 164 tests with 164 pass / 0 fail / 0 skip, reproduced the sealed 22-entry / 85,519-byte ZIP and passed install, doctor and both
  adapter probes. The B～E chain was confirmed complete in template order, including same-task real Resume.
- Deep check exited 0 with the same exact HEAD, planning-only worktree delta, manifest schema 4, Release/bundle v2, installer `0.4.0`,
  12 installed runtime files, 4 pristine upstream files, authoritative inventory, adapter-only policy, healthy doctor, zero residue and
  `PWF_SC_POST_RESUME=PASS`. Added the evidence to version acceptance/history and advanced ROADMAP/planning to P9-B PASS only.
- Added the closure guard first; its expected red run had 9/10 tests passing and failed only because the new P9-B Cloud PASS row/evidence
  did not yet exist. No source, ZIP input, asset, tag, Release, promotion or validation ref was changed.
- First closure green run executed all 18 focused assertions and exposed two stale ROADMAP test/prose couplings: the stable Phase 4
  closeout wording had been unnecessarily merged, and one guard still expected local-seal/Cloud-pending. Restored the stable wording and
  migrated only the lifecycle guard; final focused architecture/repository governance passed 18/18.
- Full Windows regression passed 173 tests: 148 pass, 0 fail and 25 honest Linux/POSIX-only skips. Importer, owned Python compile,
  installer Node syntax, both versioned bootstrap Bash syntax probes and `git diff --check` passed.
- Two independent candidate builds/checks remained byte-identical at 22 entries, 85,519 bytes and SHA-256
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`, proving the acceptance/history/ROADMAP/test/planning closure
  changed no Release ZIP input. P9-B is closed; P9-C remains unstarted and unauthorized.
- Maintainer authorized the next P9-C preparation round. Compared the P9-B Cloud-tested source with the evidence writeback and froze
  `fe8cd7f284ea2849f634aa68813dbb0f2cca83f9` as the only valid `v0.4.0` tag target; the later `01fecef…` remains branch governance only.
- Confirmed the working tree was initially clean and synchronized with `origin/0.4.0`; local tag lookup was absent, GitHub ref API returned
  404 and `gh release view` reported no `v0.4.0` Release. The Git `ls-remote` probe hit a Windows signal-pipe limitation and was correctly
  excluded from the absence conclusion.
- Added a repository guard first. Its permissioned red run executed 11 tests: 8 passed and the three P9-C lifecycle/operator assertions
  failed exactly because ROADMAP/history/acceptance had not yet materialized the authorized gate.
- Added the P9-C operator to the existing v0.4.0 acceptance, including exact-source asset reproduction, maintainer-only lightweight tag and
  Pre-release commands, public redownload/source-rebuild audit, immutable failure handling and a hard stop before P9-D.
- Updated Phase 9 history, ROADMAP and the active plan to distinguish the Cloud-tested tag source from Release-excluded evidence/operator
  commits. No Release input, runtime, contract, manifest, README, tag, Release, asset or remote ref was changed by the local agent.
- Focused repository governance passed 11/11 after the initial intentional red run. The guard briefly exposed two wording-level coupling
  assumptions and was relaxed to protect exact anchors/identities/actions rather than Chinese line layout; no safety assertion was removed.
- PowerShell parser accepted all five independently executable P9-C blocks. A trial of the first block while authoring correctly stopped
  on the dirty worktree; the exact block will be rerun after the local commit when the tree is clean.
- Full Windows suite passed 174 tests: 149 pass, 0 fail and 25 honest Linux/POSIX-only skips. Importer, owned Python compile, installer Node
  syntax, both bootstrap Bash syntax probes, `git diff --check` and the Release-input intersection audit passed.
- Two independent candidate builds/checks stayed byte-identical at 22 entries, 85,519 bytes and SHA-256
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`; bootstrap stayed 21,565 bytes and SHA-256
  `4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f`. P9-C1 is ready for maintainer handoff.

## Current status

`P9_C_OPERATOR_READY / TAG_SOURCE_FROZEN / MAINTAINER_PUBLICATION_PENDING / STOP_BEFORE_P9_D`

## 2026-08-22 — P9-C independent publication audit

- 从GitHub API确认`v0.4.0`为直接指向`fe8cd7f284ea2849f634aa68813dbb0f2cca83f9`的lightweight tag。
- 确认Release为非draft Pre-release，恰好包含冻结的ZIP与外部bootstrap。
- 从GitHub重新下载两项资产；核对size/SHA并通过bootstrap Bash syntax。
- 全新clone公开tag，importer check通过；tag-source重建ZIP为22 entries、85,519 bytes、SHA
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`，与下载ZIP逐字一致。
- 首次受限Windows进程中的`bash -n`因Git Bash signal pipe `Win32 error 5`中止；按既有platform limitation在允许的进程环境
  重跑完整审计，最终exit code 0，`P9_C_PUBLICATION_AUDIT=PASS`。
- P9-C evidence writeback focused repository guards为11/11 pass；完整Windows suite为174 tests、149 pass、0 fail、25个
  POSIX/Linux-only诚实skip。
- importer、owned Python compile、Node syntax、两个bootstrap Bash syntax、deterministic双构建/check与`git diff --check`
  均通过；本轮changed paths与Release entries/external assets交集为0。
- P9-C4 evidence writeback完成；当前停止在P9-D Published Release Cloud之前。
- commit后只读postflight再次确认Release仍为非draft Pre-release且资产digest/size未变；首次`gh api --jq`因PowerShell参数拆分
  报错，改用`ConvertFrom-Json`后确认remote tag type=`commit`、source=`fe8cd7f…`并PASS。

## Current status

`P9_C_IMMUTABLE_PUBLICATION_PASS / PUBLIC_ASSETS_REBUILT_AND_MATCHED / STOP_BEFORE_P9_D`

## 2026-08-22 — P9-D operator materialization started

- 维护者授权继续下一步；恢复Phase 9 Discovery、v0.4.0 acceptance、v0.3.5先例与通用模板Published Release通道。
- 结论：不新增Discovery文件；在现有v0.4.0 acceptance内物化P9-D版本operator，复用模板4.2/5.2/6/7/8.1/8.2/9.2。
- 当前只修改Release-excluded operator/planning/history/ROADMAP/tests；不触碰tag、Release资产、ZIP/bootstrap或production。
- 发现Published Release 4.2/5.2/9.2缺少稳定英文anchor；纳入P9-D-PR1最小治理修正，脚本/提示词内容保持不变。

## 2026-08-22 — P9-D operator materialization completed

- 在版本acceptance物化唯一P9-D operator，冻结公开bootstrap/ZIP URL与SHA、control-plane HEAD动态核对、Fresh/Resume顺序、
  9.2 deep-check回传字段和P9-E前停止条件；没有复制通用setup/deep-check长脚本。
- 给通用模板4.2、5.2、9.2补稳定英文anchor；更新Phase 9 history、ROADMAP、活动planning与repository guards。
- 首次实际focused run为10/12：一个新顺序regex把“real 8.2”误当成连续字面量，另一个旧guard把Cloud未PASS错误等同于文档不能
  出现公开URL。修正为保护真实编号顺序，并允许pending operator固定immutable URL、继续禁止最终PASS/Latest提前出现；最终12/12。
- 完整Windows suite为175 tests、150 pass、0 fail、25个Linux/POSIX-only诚实skip。importer、owned Python compile、Node syntax、
  两个bootstrap Bash syntax、operator PowerShell parse与`git diff --check`均通过。
- 双构建/check仍为22 entries、85,519 bytes、SHA
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`；8个changed paths与Release inputs交集为0。
- P9-D-PR1完成；等待维护者push exact operator commit并执行独立Fresh Cloud。P9-E/P9-F仍未授权。

## Current status

`P9_D_OPERATOR_READY / MAINTAINER_FRESH_CLOUD_PENDING / STOP_BEFORE_P9_E`

## 2026-08-22 — P9-D Published Release Cloud evidence received

- setup从公开bootstrap运行到`Test complete`，输出exact bootstrap SHA
  `4ae21c1f…c64f`与`PWF_PUBLIC_RELEASE_SETUP=PASS`；维护者确认5.2 Fresh及其他前置黑盒均PASS。
- canonical fixture为`2026-08-22-pwf-cloud-acceptance-v1-a3f09c7e`。E2观察真实resume canary、runtime codex、5条
  unsynced messages、截断/tail marker、正确catch-up顺序与全部canonical/markerless legacy上下文。
- 9.2最终exit code 0；公开ZIP为22 entries、85,519 bytes、SHA `24a412…3bb3`，ZIP内importer healthy；doctor、schema4、
  Release/bundle v2、12 installed、4 pristine、authoritative inventory、adapter-only与零residue全部PASS。
- post-Resume HEAD为`9d4a914b8b241fa92345702bff74846024eba5b6`；工作树只含`.planning/.active_plan`和canonical fixture目录。
- GitHub只读交叉检查保持tag source、Pre-release metadata、两项asset size/digest不变；`git ls-remote`再次遭遇已知Windows
  signal-pipe限制，改用GitHub ref API确认远端`0.4.0` HEAD与本地operator HEAD相等。

## Current status

`P9_D_EVIDENCE_RECONCILIATION_IN_PROGRESS / STOP_BEFORE_P9_E`

## 2026-08-22 — P9-D evidence closeout validated

- acceptance新增双通道完成证据与`R5-SC=PASS / R5-PR=PASS / CLOUD-HARD-ACCEPTANCE-PASS`，同时明确不授权Latest、
  role rotation、ref cleanup或P9-F；provenance链接提升到P9-D exact evidence。
- 首次focused run暴露通用Published Release守卫手工重复加入`hook_adapter.py`，导致把v2 authoritative inventory误算为13项；
  删除该v1-era projection后恢复exact 12项。第二次只剩Markdown换行regex过窄，收缩为语义守卫；最终focused 12/12通过。
- 完整Windows suite为175 tests、150 pass、0 fail、25个Linux/POSIX-only诚实skip。importer、owned Python compile、Node syntax、
  两个bootstrap Bash syntax与`git diff --check`均通过。
- 双构建/check保持22 entries、85,519 bytes、SHA
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`；8个changed paths与Release inputs交集为0。
- P9-D正式关闭。对象只推进到P9-E review门口，没有提前取消Pre-release、轮转角色或清理validation refs。

## Current status

`P9_D_PUBLISHED_RELEASE_CLOUD_PASS / PUBLIC_DEFAULT_DOWNLOAD_CHAIN_CONFIRMED / STOP_BEFORE_P9_E`

## 2026-08-22 — P9-E operator materialization

- 维护者授权继续下一步；恢复既有P9-E设计并做GitHub只读preflight。v0.4.0 tag/source、Pre-release和双资产仍与P9-D完全一致，
  远端`0.4.0` branch已包含P9-D closeout。
- 发现当前Latest实际为`v0.3.5-dev`而非programme accepted `v0.3.5`；记录为control-plane drift，并选择直接把最终指针晋级到
  v0.4.0，不执行临时回拨。
- 先增加P9-E repository guard；permissioned intentional red run为13 tests、12 pass、1 fail，唯一失败是operator anchor尚未存在。
- 在现有v0.4.0 acceptance增加preflight、唯一maintainer-only mutation和postflight；同步history、ROADMAP、planning与对象账。
- 当前只准备本地控制面，未修改tag、Release、Latest、assets、refs、roles、production或任何Release input；P9-F继续未授权。
- focused repository guard为13/13；完整Windows suite为176 tests、151 pass、0 fail、25个Linux/POSIX-only诚实skip。
- 三个P9-E PowerShell块parser PASS；importer、owned Python compile、Node syntax、两份bootstrap Bash syntax与`git diff --check`
  PASS。双构建继续为22 entries、85,519 bytes、SHA`24a412…3bb3`，7个changed paths与Release inputs交集为0。

## Current status

`P9_E_OPERATOR_READY / PRE_PROMOTION_LATEST_DRIFT_RECORDED / MAINTAINER_POINTER_PROMOTION_PENDING / STOP_BEFORE_P9_F`

## 2026-08-22 — P9-E promotion verified and P9-F closed

- 维护者完成P9-E；只读交叉核对确认v0.4.0为stable Latest，tag source与85,519-byte ZIP/21,565-byte bootstrap不变；
  v0.3.5 tag/source与77,800/21,565-byte双资产同样未变。
- 先增加P9-F role/absence/lifecycle guards；permissioned intentional red run为14 tests、11 pass、3 fail，失败恰为旧角色窗口、
  缺少P9-E/P9-F证据和两份旧working-tree文件仍存在。实现后focused 14/14 PASS。
- ROADMAP轮转为v0.4.0 accepted/Latest、v0.3.5 immediate fallback、v0.3.4 deeper fallback；后继列车保持未命名、未授权。
- 删除current-tree `init-cloud-sandbox-v0.3.5.bash`和`docs/v0.3.5-cloud-hard-acceptance.md`，把provenance/CHANGELOG验收链接
  迁移到`5d01b…` exact blob；immutable公开身份未改写。
- 11个validation refs、F3 guides/evidence helper、rollback/revival negatives和installed predecessor transition全部KEEP。
- 完整Windows suite为177 tests、152 pass、0 fail、25个Linux/POSIX-only诚实skip；focused repository suite为14/14。
- importer、owned Python compile、Node syntax、唯一v0.4.0 bootstrap Bash syntax与`git diff --check`PASS。双构建仍为22 entries、
  85,519 bytes、SHA`24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`；10个changed paths与Release inputs交集为0。

## Current status

`P9_F_SECOND_RETIREMENT_PASS / V0_4_0_TRAIN_CLOSED / NEXT_TRAIN_UNDECIDED`

## 2026-08-22 — Post-release documentation reconciliation started

- 维护者授权继续文档治理，并指出CHANGELOG尚未完整覆盖P9-A之后已经交付的v0.4.0内容。
- 冻结版本仍为`0.4.0`；本轮不创建后继development列车，不修改package/Release inputs或公开资产。
- 已把工作拆为authority扫描、CHANGELOG release delta补全、宏观文档对账和验证收口四步；当前进入DOC-R0。
- focused guard先在旧CHANGELOG上按预期失败：新增release-delta断言无法找到完整stable事实；Windows沙箱首次以`spawn EPERM`
  阻止Node runner，转到获准的正常进程环境后取得真实13/14 red结果。
- 重写CHANGELOG v0.4.0段，补齐contract/source、smart/autonomous、Cloud lifecycle、rollback/recovery与stable Release；删除pending中间态和P9流水账。
- history index只补Phase 9后继尾注闭合事实；README、ARCHITECTURE、DESIGN、ROADMAP、provenance、acceptance复核后保持不动。
- 新守卫首次green前暴露测试anchor只接受英文`deterministic ZIP`，而CHANGELOG使用中文“确定性 ZIP”；修正为双语语义anchor后focused 14/14 PASS。
- 完整Windows suite为177 tests、152 pass、0 fail、25个Linux/POSIX-only诚实skip；`git diff --check`PASS。
- 最终6个changed paths与Release artifact entries/external bootstrap交集为0；DOC-R0～DOC-R3完成，等待维护者push本地文档治理commit。

## Current status

`POST_RELEASE_DOCUMENTATION_RECONCILED / V0_4_0_IDENTITY_UNCHANGED / NEXT_TRAIN_UNDECIDED`
