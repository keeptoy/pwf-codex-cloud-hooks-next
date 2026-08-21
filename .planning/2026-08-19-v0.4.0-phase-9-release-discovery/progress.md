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

## Current status

`P9_B_LOCAL_SEAL_PASS / SEALED_SOURCE_CLOUD_PENDING / STOP_BEFORE_P9_C / PUBLICATION_NOT_AUTHORIZED`
