# Progress: Slim Repository Migration

## M2-A — orphan skeleton

- Created a dedicated secondary worktree under the verified `new-space` path.
- Created local unborn branch `migration/slim-beta3-dev`; no root commit exists.
- Selectively imported 52 M1 source paths rather than copying the complete tree.
- Applied six Git-aware path renames.
- Added four minimal stable-document entrypoints and three fresh planning files;
  updated `.planning/.active_plan` to this scoped plan.
- M2-B, commit, push, Release, cutover, production changes, and Phase 4 remain
  outside the current authorization.
- Verified exactly 59 indexed paths, zero forbidden/untracked paths, exactly four
  executable runtime files, strict UTF-8 for all 59 worktree files, preserved audit
  blobs/modes, fresh planning selection, unborn branch state, and unchanged clean
  M1 audit commit/tree.
- The first exact-index check ran before the seven new entrypoints were staged and
  correctly stopped at 52 paths. Staged only those seven paths plus the modified
  active pointer, then the exact 59-path check passed.
- `git diff --cached --check` reports only the inherited terminal blank line in
  renamed `docs/git-file-modes.md`; kept its M1 bytes unchanged as required and
  assigned cleanup to M2-B. M2-A is complete and stopped for maintainer review.

## M2-B — authority, identity, and provenance rewrite

- Maintainer checkpointed M2-A and explicitly said to continue; recorded this as
  authorization for M2-B only.
- Recovered the clean archive checkpoint `f3d522f`, unchanged clean M1 audit
  commit/tree, and the 59-path local unborn slim worktree.
- Opened an M2-B plan covering document authority/LF, behavior-named references,
  stable architecture/repository tests, beta.3-dev/bootstrap identity,
  overlay/provenance/manifest hashes, and bounded validation. Root commit, push,
  M2-C/M3, Release, cutover, product behavior changes, and Phase 4 remain excluded.
- Initial stale-reference scan found the expected old fixture names in three tests,
  prototype execution in the renamed repository-boundary test, Phase/history routes
  throughout README/AGENTS, and beta.2/current-repository identity in package and
  bootstrap. The immutable beta.2 acceptance document is intentionally exempt.
- The first `rg` scan used a negative look-ahead without PCRE2 and failed before
  producing results. Re-ran once with `--pcre2`; it completed and supplied the
  dependency inventory. Do not repeat the unsupported default-regex form.
- Read the machine-contract/importer/patcher/installer chain. Contrary to one
  optional Discovery assumption, the patcher currently hard-requires
  `historical_patched_skill_files`; chose to retain it rather than change the
  reproduction algorithm. Overlay evidence/hash updates remain required.
- Replaced the inherited macro docs with focused successor authority: README,
  AGENTS, ARCHITECTURE, ROADMAP, BASELINE_PROVENANCE, MAINTAINER_HANDOFF, and the
  Git mode/LF runbook. The beta.2 hard-acceptance evidence was not modified.
- Broadened `.gitattributes` to repository-wide LF with explicit binary exclusions.
  Removed the inherited terminal blank line through the authorized git-mode
  document rewrite; final M2-B diff hygiene remains to be verified.
- First focused Node run was blocked by the known Windows sandbox `spawn EPERM`;
  reran outside the process-spawn sandbox. Thirteen of fourteen cases passed. The
  only failure was a new architecture-doc anchor that combined two true phrases
  not written contiguously; added the explicit stable sentence to ARCHITECTURE
  rather than weakening the contract. A focused rerun remains pending.
- Updated the three behavior-named fixture references and labels; fixture bytes
  remain the M1 blobs. Rewrote the architecture contract against ARCHITECTURE and
  replaced the prototype handoff with three exact-tree/coverage/graph tests.
- Advanced package/bootstrap to beta.3-dev, successor URL, and zero checksum;
  rewrote release/bootstrap tests so immutable beta.2 assets are verified through
  acceptance/provenance. Updated overlay status/evidence/test names and pinned its
  new SHA-256 in the upstream manifest.
- Static/metadata preflight passes: nine JSON files parse; importer check is
  healthy; Node/Python syntax checks pass; overlay hash equals manifest; 59 index
  paths and zero untracked paths remain.
- Reworded schema comments and remaining current test titles away from Phase/Round
  history, recomputed both installed schema hashes, the overlay hash, and the
  runtime-bundle hash, then synchronized all four manifest entries.
- Full invariant preflight passed production bytes, renamed fixture bytes, exact
  executable set, LF attributes, strict UTF-8, and cached diff hygiene, then
  correctly stopped because importer check had left `patches/__pycache__`.
- Verified the residue path was inside the slim worktree and contained only pyc,
  removed that generated cache, disabled bytecode writes before dynamic patcher
  import, added a regression, and updated the manifest importer hash.
- A combined source read plus no-match `rg` returned exit 1 after showing the
  importer header because the searched cache guard did not yet exist. Treated the
  absence as the finding and did not repeat that command shape.
- Added the exact ARCHITECTURE statement required by the stable contract and
  reran the expanded focused set: 22/22 passed.
- A combined Node validation attempted to spawn `git` from inside the Windows
  process sandbox and received `EPERM`; reran strict UTF-8/LF and Markdown checks
  directly in PowerShell. The first link pass then correctly exposed an incomplete
  link inside the intentionally partial upstream Skill fixture. Excluding fixture
  content, all 12 maintained Markdown documents passed fences and local links.
- Final preflight passed: 59 indexed paths, zero untracked paths, four executable
  managed upstream files, 15 manifest-linked hashes, importer health, zero cache,
  ten production-byte comparisons, three renamed-fixture blob comparisons,
  repository-wide LF/strict UTF-8, stale-current-state scan, and cached diff.
- Full Windows suite passed with 63 tests / 52 pass / 0 fail / 11 honest POSIX
  skips. In-memory Python compilation and Node syntax checks passed; Bash is not
  available on this host and was recorded as unavailable rather than PASS.
- M2-B is complete. The orphan branch remains local, unborn, staged, and unpushed;
  no root commit, Release, cutover, M3, or Phase 4 work was performed. Stopped for
  maintainer checkpoint before M2-C.

## M2-C — root commit and local closure

- Maintainer confirmed the M2-B checkpoint and explicitly authorized M2-C.
- M2-C is limited to final pre-commit invariants, deterministic double ZIP build,
  one parentless 59-path root commit, and fresh Windows clone validation. Push,
  M3/M4, Release, cutover, product behavior changes, and Product Phase 4 remain
  unauthorized.
- Final pre-commit gates pass: importer and in-memory Python/Node static checks,
  exact 59 paths, zero untracked/cache, exactly four executable upstream files,
  and cached diff hygiene.
- Full Windows suite remains green at 63 registered / 52 pass / 0 fail / 11
  honest POSIX skips.
- Two pre-closure development ZIP builds were byte-identical at 22 entries /
  74,871 bytes. Closure then updated packaged README, so that hash was not kept as
  final-tree evidence; bootstrap remained external with its all-zero checksum.
- Created the parentless root commit and verified exact 59 paths, zero parents,
  exactly four `100755` entries, clean slim worktree, and unchanged M1 audit oracle.
- The first local clone attempt was blocked before repository transfer because
  sandboxed Git for Windows could not create its internal signal pipe (Win32 error
  5). Verified and removed only the named partial temporary clone, then reran the
  same gate outside that process sandbox; this is a platform-tool restriction, not
  a repository or test defect.
- Fresh Windows clone PASS under `core.autocrlf=true`: 59 paths, zero CR files,
  four executable modes, importer/static/clean status PASS, and full suite
  63 registered / 52 pass / 0 fail / 11 honest POSIX skips.
- M2 local closure is complete and stopped before push/M3/M4/Release/cutover or
  Product Phase 4. The closure-only planning/document update is folded into the
  same parentless root commit and the final amended commit is re-cloned below.
- The first post-closure double build detected the expected README-driven byte
  change and established the actual final-tree development ZIP: 22 entries /
  74,899 bytes / SHA-256
  `647e16852f818a84f4b5d4872a876d411cdbdfa7671f07b7614f35f12aae5e7d`.
  Recording this value changes only planning files outside the Release allowlist.

## M3 Discovery — Cloud equivalence protocol

- Maintainer checkpointed M2 and authorized the next step; interpreted it as M3
  Discovery only, preserving separate authorization for push and disposable live
  Cloud setup.
- Recovered the clean parentless M2 root, clean unchanged M1 audit worktree,
  successor authorities, immutable beta.2 A～F runbook, installer/bootstrap flow,
  Release allowlist, and current 63-test boundary.
- Froze `docs/beta3-dev-m3-cloud-equivalence.md` with M3-A no-live Linux/isolated
  install seal, M3-B process-only local-ZIP setup and independent Fresh/Resume
  prompts, M3-C evidence closure, failure classification, and exact stop rules.
- Updated README/AGENTS/ROADMAP/handoff and this active plan to reflect Discovery
  completion without claiming push, Cloud PASS, Release, cutover, or Phase 4.
- One read-only Windows search used the Unix wildcard `tests/*.test.js` as a
  literal path and failed with Win32 path error 123. Re-ran with `rg -g
  '*.test.js' ... tests`; this was a command-shape error, not repository drift.
- The first sandboxed full-suite run never entered test logic: Node could not
  spawn any of its 14 file workers and reported 14 uniform `spawn EPERM` failures.
  The first outside-sandbox approval run then timed out in the permission review;
  one permitted retry completed at 63/52/0/11.
- Importer/static checks and two deterministic builds pass. Updating packaged
  README changes the development ZIP as expected to 22 entries / 74,958 bytes /
  SHA-256 `c2f5410c2c53082955ab3a5f9dec64abbd229893796bb74455f622e3a252dcb1`;
  the checkout bootstrap remains zero-hash and no Release value was written.
- A local rehearsal of M3-A isolated install stopped before mutation because the
  production installer correctly requires `/usr/bin/python3`, absent on Windows.
  Recorded this as a platform limitation and retained the real check for Cloud.
- Maintained-document UTF-8, fence, local-link and diff-hygiene checks pass. Bash
  is unavailable locally, so executable Bash syntax remains an explicit M3-A
  Cloud gate rather than a local claim.
- Pre-checkpoint review caught that the untracked runbook was invisible to the
  exact 59-path repository test. Advanced the successor current boundary to 60
  paths and changed only the repository-governance allowlist test; M3-A now proves
  every other test and all production/build inputs remain M2-root bytes.
- The first focused run with a disposable alternate Git index was still inside
  the process sandbox; its spawned `git ls-files` returned `status=null`/EPERM.
  Repeated the complete suite outside that restriction using the same temporary
  index. It passed 63/52/0/11 plus cached diff hygiene at exactly 60 paths, then
  removed the temporary index without staging the real worktree.

## M3 pre-A README authority refinement

- Maintainer checkpointed M3 Discovery locally as child commit `3ef29f5` and did
  not push it, then authorized the final README/ROADMAP/task-plan refinement.
- Renamed README runtime behavior to stable supported behavior and retained its
  event/order/failure contract inside the distributable.
- Replaced the copied M2/M3/M4 current-route block with stable ROADMAP/task-plan
  navigation, while preserving the zero-hash development-bootstrap safety warning.
- Added a short four-file `100755`/LF diagnosis and bounded repair entry to README;
  retained the complete Windows/renormalize/fresh-clone procedure in the dedicated
  Git mode document.
- Updated AGENTS authority wording and made ROADMAP explicitly own changing
  migration/Cloud/Release status. No production, contract, installer, test,
  bootstrap, version, Release allowlist, push, Cloud, or live state changed.
- Document UTF-8/fence/diff hygiene and stale README authority scans pass. Importer
  remains healthy.
- Rebuilt the changed packaged README twice. Both 22-entry development ZIPs are
  byte-identical at 75,323 bytes / SHA-256
  `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`;
  no hash was written to the zero-hash bootstrap.
- Full Windows suite after the refinement passes 63 registered / 52 pass / 0
  fail / 11 honest POSIX skips. No test assertion was changed for this refinement.

## M3-A — first no-live Cloud attempt and repair opening

- M3-A transport created the same-named remote development branch at exact commit
  `f54fb78633d22af5c8f0f225fc8c44ad046aa9c1`; local/remote identity matched.
- Cloud passed every gate through Linux 63/63 and isolated install/doctor, then the
  runbook's Managed Policy parser failed with `KeyError: 'command'` before ZIP and
  terminal PASS fields. Cloud worktree stayed clean and no commit/PR was created.
- Opened a governance-only repair inside M3-A. No M3-B/live setup, product change,
  public `main`, Release, cutover, or Product Phase 4 work is authorized.
- A local combined search for policy shape used a malformed escaped regex and
  failed before returning matches. Switched to fixed-string/source-specific reads
  instead of repeating that command shape.
- Source confirmation found the exact nested `[[hooks.<event>.hooks]]` renderer in
  `install.js`. Corrected the runbook to validate one event group, one nested
  command handler, handler type, and adapter-only commands.
- Added the regression inside the existing repository-boundary case, preserving
  the 63-test total and the frozen rule that this remains the only test file
  allowed to differ from M2 root.
- The first focused run was blocked before test-file execution by the known Windows
  sandbox `spawn EPERM`; the identical outside-sandbox rerun passed 3/3. A direct
  `tomllib` sample of the installer-shaped nested policy also reports
  `NESTED_MANAGED_POLICY_PARSER=PASS`.
- Final local repair validation passes importer, in-memory Python, Node syntax,
  exact 60 paths, zero product/build drift, the single allowed test drift, and
  `git diff --check`. Full Windows suite remains 63/52/0/11. No Release ZIP input
  or bootstrap byte changed.
- Maintainer returned the complete repaired M3-A Cloud result. PASS: accepted HEAD
  `39795283cd65f84547651d7bec816191fb5bfedf`; Linux 63/63/0/0; root/cross-user/
  process-group; isolated install/doctor; adapter-only policy; 11 payload; two
  deterministic 22-entry ZIPs at 75,323 bytes and SHA-256
  `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`;
  zero-hash bootstrap; empty stderr; clean workspace; terminal M3-A PASS.
- Closed M3-A and stopped before M3-B. These evidence/governance edits must be
  checkpointed locally without pushing the remote development branch away from
  the accepted commit before M3-B consumes it.
- A combined status search attempted to read archive paths while its working
  directory was the successor and returned path-not-found after valid successor
  matches. No file changed from the error; archive synchronization uses explicit
  absolute paths instead of repeating that command shape.
- M3-A closure validation passes: successor and archive UTF-8/fence/diff checks,
  zero Release-allowlist overlap, and focused architecture/repository contracts
  4/4. A final read-only remote query confirms the development branch still equals
  accepted HEAD `39795283cd65f84547651d7bec816191fb5bfedf`.

## M3-B authorized — disposable setup opening

- Maintainer confirmed both repositories were checkpointed, kept the successor
  checkpoint local/unpushed, and explicitly authorized M3-B.
- Recovered clean archive HEAD `4962984cb4dd7f88ff2811e0330e0829948e0a4e`
  and clean successor local HEAD `cc6c38000aa2d024a4d9eed2530ad09fdf9ef2db`;
  the latter is a governance-only child of accepted M3-A HEAD `39795283...`.
- The first sandboxed `git ls-remote` attempt failed because Git for Windows could
  not create its signal pipe (`Win32 error 5`). The approved read-only retry
  succeeded and proves remote `migration/slim-beta3-dev` still points exactly to
  `39795283cd65f84547651d7bec816191fb5bfedf`.
- M3-B is now in progress only at disposable setup. Frozen external inputs are
  accepted HEAD `39795283cd65f84547651d7bec816191fb5bfedf` and ZIP SHA-256
  `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`.
  No successor push, M3-C, public `main`, Release, cutover, Product Phase 4, or
  production-source change is authorized.
- The first focused local test launch again hit the known Windows sandbox
  `spawn EPERM` before assertions ran. The identical approved outside-sandbox
  rerun passed all three repository-boundary cases; this is a platform execution
  restriction, not a product or assertion failure.
- Maintainer returned the complete disposable setup result. Both Release-tool
  build/check passes report 22 entries, 75,323 bytes, and exact accepted SHA-256
  `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`.
- Cloud detected `/opt/codex`, installed pristine upstream PWF v3.8.2, installed
  the managed runtime from exact accepted HEAD `39795283...`, returned healthy
  install and doctor JSON with empty errors/blockers, validated TOML and the Codex
  Hook feature, and passed both direct adapter protocol probes.
- Terminal markers `M3B_DISPOSABLE_SETUP=PASS`, exact accepted HEAD, and exact ZIP
  SHA were all observed. Setup is closed; the only next step is a completely new
  task's no-tools Fresh lifecycle prompt. Direct setup adapter output is not reused
  as automatic Runtime injection evidence.
- One PowerShell excerpt read used the host default encoding and displayed Chinese
  runbook text as mojibake. Re-read the bounded Fresh section with explicit UTF-8;
  repository bytes were not changed by either read.
- Maintainer clarified the actual Cloud boundary: every new container clones the
  GitHub repository first and then automatically runs the saved repository setup
  before Runtime/first prompt. Recorded this order in the runbook so a manual old-
  container install cannot be mistaken for Fresh preparation.
- The completely new task's first no-tools reply observed exact startup
  SessionStart and UserPromptSubmit canary lines. Strict summary reports
  SessionStart OBSERVED, source startup, and UserPromptSubmit OBSERVED; planning
  context, plan-data marker, and recent progress were also OBSERVED.
- Fresh lifecycle is PASS. The sole next action is the controlled real-apply_patch
  baseline prompt in the same task; canonical no-tools validation, long wrapper,
  Resume, and doctor remain sequential later steps.
- The first PowerShell attempt to slice the baseline section selected a non-scalar
  end marker and printed a reversed oversized excerpt. Replaced it with a unique
  UTF-8 prompt-line lookup and forward closing-fence scan; the exact bounded prompt
  was recovered and no repository byte changed from either read.
- The controlled baseline step returned exactly
  `PWF_BETA3DEV_M3_BASELINE_CREATED`. This closes the response-shape requirement,
  but file selection/injection still requires the immediate canonical no-tools
  check and the real structured `patch_apply_end` remains a Resume cross-check.
- The immediate no-tools canonical check reports all six fields OBSERVED:
  UserPromptSubmit canary, C7F4 plan marker, ACTIVE PLAN, plan-data framing, recent
  progress, and overall Planning context. Canonical baseline/UserPrompt is PASS.
- The sole next step is the exact long-wrapper message in the same task. It must
  receive only `PWF_BETA3DEV_M3_UNSYNCED_ACKNOWLEDGED`; Resume cannot begin before
  that response and no planning file may change after the baseline patch.
- The long wrapper returned exactly
  `PWF_BETA3DEV_M3_UNSYNCED_ACKNOWLEDGED` and did not echo its C7F4 tail sentinel.
  The current run must now end; the frozen no-tools Resume prompt is the first
  message after reopening the same task.
- One combined governance patch was rejected atomically because its expected
  runbook sentence did not match the actual wording. No partial edit occurred;
  re-read the exact paragraph and applied smaller bounded patches successfully.
- The restored no-tools reply reports source `resume`, SESSION CATCHUP, previous
  rollout `019fd4e2...`, Runtime codex, `task_plan.md at message #36`, and 16
  unsynced messages. Truncation marker, exact C7F4 tail, catch-up-before-plan order,
  canonical marker/framing, and progress are all observed. Resume is PASS.
- Two later multi-file governance patches also failed closed on stale exact-context
  assumptions (first a checklist line, then ROADMAP wrapping). Neither made partial
  edits. Re-read the bounded current text and applied per-file patches instead.
- Post-resume doctor/inventory/residue is now the only remaining M3-B gate. M3-C
  remains unauthorized.
- Maintainer returned the final doctor output: exit 0, healthy true, repairable
  false, empty errors/blockers, installer `0.3.0-beta.3-dev`, exact 11-file actual/
  declared inventory, and zero snapshot leftovers. M3-B is complete.
- Two M3-B closure-status multi-file patches failed atomically on stale expected
  checklist/ROADMAP wrapping. Neither made partial edits. Exact bounded reads and
  per-file patches completed the synchronization; product, tests, contracts,
  bootstrap, Release inputs, remote branch, and live Cloud state were not changed.
- Stopped at `M3-B PASS / M3-C AUTHORIZATION REQUIRED`. No closure commit, push,
  public `main`, Release, cutover, M4, or Product Phase 4 action followed.

## M3-C authorized — closure audit opening

- Maintainer explicitly authorized M3-C and confirmed neither repository had been
  committed after M3-B. M3-C will audit first and may create one local governance
  closure commit only after all descendant checks pass; no push or M4 is authorized.
- Initial successor inspection shows local HEAD `cc6c380...` is a governance child
  of tested `39795283...`; the worktree modifies five existing governance files.
  The complete candidate diff from tested commit currently spans seven existing
  governance paths: AGENTS, MAINTAINER_HANDOFF, ROADMAP, the M3 runbook, and three
  active planning files. No new path is present in this preliminary view.
- Formal local audit PASS: exactly seven allowed governance paths, one immutable
  parentless root/tree, 60 tracked paths, four exact `100755` upstream files, local
  audit oracle unchanged, and Release allowlist overlap zero.
- Approved read-only remote query took about one minute but completed successfully:
  `audit/beta2-exact` remains `bbad3703...` and `migration/slim-beta3-dev` remains
  exact tested HEAD `39795283...`. No remote state changed.
- M3-C pre-commit seal PASS: importer/static, 13 maintained-doc UTF-8/fences,
  `git diff --check`, focused architecture/repository contracts 4/4, and two exact
  22-entry / 75,323-byte ZIPs at accepted SHA-256.
- The commit containing this record is the single local M3 governance closure.
  Candidate remains exactly seven existing governance paths with zero production,
  test, contract, bootstrap, or Release-input drift; no push or M4 action follows.

## M4 Discovery

- Maintainer explicitly authorized M4 Discovery. Recovered the successor entry
  documents, architecture, roadmap, provenance, handoff, active planning, and clean
  local branch before making any external change.
- Updated the active plan to mark Discovery in progress and freeze its read-only
  boundary. No push, ref move, public main, default-branch/repository-setting change,
  Release, live Cloud action, production modification, or Product Phase 4 work has
  occurred.
- The first combined planning patch failed atomically because the expected findings
  tail did not match the current file; it made no partial edit. A bounded tail read
  followed by smaller file-level patches resolved the update without repeating the
  failed approach.
- Completed the first read-only topology pass. Local slim HEAD is `d9308763...`,
  remote tested development is `39795283...`, audit is `bbad3703...`, there is no
  local/remote `main` or tag, and the slim branch has no configured upstream.
- GitHub connector metadata confirms the successor is public and its current
  default branch is already `migration/slim-beta3-dev`; only development and audit
  branches exist. No GitHub setting or ref was changed.
- The first ruleset/Release metadata fallback could not run because `gh` is not
  installed on this Windows host. A second attempt to open raw GitHub API URLs with
  the web reader was rejected as unsafe before any request. Neither attempt changed
  remote state; Discovery will use a different read-only transport and keep
  unobserved protection settings explicit if that transport is unavailable.
- A different read-only public GitHub API transport succeeded. It confirms zero
  successor rulesets/Releases, old default `0.3.0-beta.2`, old immutable Releases,
  and no archive state. Classic branch protection remains explicitly unobserved.
- Scanned successor identity/bootstrap/Release inputs and the old repository's
  README/branch state. The old README has no successor link; its local M3 handoff
  commit is one ahead of remote. No file outside successor planning has been edited.
- Read current GitHub default-branch, branch-rename, ruleset, and protected-branch
  documentation. The evidence supports a create-main-then-switch route and warns
  that branch rename does not redirect raw URLs or Git pull.
- Inspected the exact repository-boundary test. A trailing Windows-incompatible
  `rg` glob made the combined read command exit 1 after producing the needed output;
  no file changed. Future searches will pass explicit paths instead of shell-style
  `*.js` on PowerShell.
- Added the dedicated M4 design/runbook and synchronized AGENTS, ROADMAP, handoff,
  active planning, and the exact boundary test. The boundary is now 61 paths; only
  the new governance document increases the count, and Release remains 22 entries.
- The first Python fence check was invalid because PowerShell reduced three
  backticks inside a double-quoted native argument to one. A native PowerShell
  strict UTF-8/fence/local-link check replaced it and passes all 13 maintained docs.
- Importer and Node syntax PASS. The first focused Node run hit the known Windows
  sandbox `spawn EPERM`, classified as platform/sandbox limitation; the unchanged
  tests reran outside that sandbox and pass 4/4. Cached diff check also passes.
- Full Windows suite PASS at 63 registered / 52 pass / 0 fail / 11 honest POSIX
  skips. Two independent development ZIP build/check runs remain exact at 22
  entries / 75,323 bytes / accepted SHA-256 `82770964...`; temporary artifacts were
  removed. M4 Discovery is design-complete and stops for checkpoint/M4-A authority.
- Final successor candidate is exactly eight staged paths: seven governance entries
  plus the repository-boundary test. It contains 61 tracked paths, has zero Release
  allowlist overlap, no unstaged/untracked files, and passes cached diff checks.
- The archive handoff candidate is exactly six staged governance documents; README
  is intentionally unchanged until M4-B. No commit, push, remote mutation, Release,
  live Cloud, production, or Product Phase 4 action followed Discovery.

## M4-A

- Maintainer confirmed clean local checkpoints for both repositories and authorized
  M4-A. Recovered successor HEAD `cc9bc878...`, clean branch
  `migration/slim-beta3-dev`, and the frozen M4 runbook before external action.
- Marked M4-A in progress with a hard stop before M4-B. No remote ref, default
  branch, ruleset, Release, live Cloud state, old-repository file, or production
  byte has been changed at this point.
- Local preflight PASS: importer and Node syntax; full Windows suite 63 registered /
  52 pass / 0 fail / 11 honest POSIX skips; `git diff --check`; two exact 22-entry,
  75,323-byte ZIP builds at SHA-256 `82770964...`.
- Remote read-only preflight PASS: no `main` or tag; development remains
  `39795283...`; audit remains `bbad3703...`; authenticated repository metadata
  reports admin permission and development default; branch API reports protection
  disabled on both evidence refs and ruleset count zero.
- Stopped before external mutation because neither the connector nor local tooling
  provides a non-interactive authenticated default/ruleset management channel. No
  push, `main`, default/ruleset mutation, Release, live Cloud action, old-repository
  edit, production change, or Product Phase 4 action occurred.
- Maintainer installed and authorized GitHub CLI; explicit binary authentication
  verified the active `keeptoy` account and admin repository access without
  exposing a token. Authenticated protection/default/ruleset preflight PASS.
- Non-force exact refspec created remote `main@cc9bc878...`; immediate readback
  proved development `39795283...` and audit `bbad3703...` remained unchanged.
- Changed successor default to `main`. Created active `main-integrity` ruleset ID
  `20491892` and `evidence-integrity` ruleset ID `20491906`; authenticated branch
  rule readback shows deletion/non-fast-forward only on their exact targets.
- Public no-branch HTTPS fresh clone PASS at exact `main@cc9bc878...`, 61 tracked
  paths, four `100755` upstream runtime files, clean workspace, and
  `refs/remotes/origin/HEAD -> origin/main`.
- `M4A_SUCCESSOR_AUTHORITY_CUTOVER=PASS`. No Release, tag, live Cloud,
  old-repository, production, or Product Phase 4 mutation occurred. Stopped for
  local checkpoint and explicit M4-B authorization.

## M4-B

- Maintainer checkpointed successor M4-A as `94cd28a3...`, did not push it, and
  explicitly authorized the next gate. Recovered clean successor and archive
  worktrees before editing.
- Marked M4-B in progress with a hard stop before M4-C. No file, remote ref,
  repository setting, Release/tag, live Cloud state, production byte, or Product
  Phase 4 state has changed at this opening point.
- M4-B prepublication seal PASS: successor importer/boundary 3/3, exact accepted
  double ZIP, seven successor and six archive changed-document checks, zero
  successor Release overlap, intentional archive README-only overlap, clean diffs,
  exact remote refs/settings, and immutable beta.2 asset metadata.
- Prepared normal fast-forward governance publication in archive-first/successor-
  second order. `M4B_ARCHIVE_PROVENANCE_HANDOFF=PASS` is conditional only on those
  exact normal pushes and final readback; all M4-C and product/Release actions stop.
- Published archive `11ef7c96...` first and successor `fe338942...` second by normal
  fast-forward. Initial remote-content verification incorrectly expected `gh api`
  to honor a raw media-type header and tested the API wrapper rather than decoded
  Markdown; no remote content was missing. Switched to contents API Base64 decoding,
  then verified both successor provenance links and the old README banner PASS.

## M4-C

- Maintainer checkpointed the successor after M4-B and explicitly authorized the
  next gate. Recovered clean successor/archive worktrees and repeated the repository
  reading order before changing any file.
- Local and authenticated remote readback agree on final M4-B
  `main@5476a5c97e713d935622a9998f902e35a114db07`, development evidence
  `39795283...`, audit oracle `bbad3703...`, active integrity rulesets, old default
  `0.3.0-beta.2@11ef7c...`, and unchanged immutable beta.2 asset metadata.
- Opened M4-C as a no-live Cloud/Linux acceptance gate. The only intended remote
  mutation before execution is one normal fast-forward containing seven governance
  files and the copyable runbook; Release/tag, live `/opt/codex`, production,
  repository rename/archive/delete, and Product Phase 4 remain stopped.
- The first combined planning patch failed atomically because it expected a generic
  `## M4-B` findings heading while the file uses `## M4-B opening`; no partial edit
  occurred. Re-read exact headings and applied bounded file-level patches.
- Added the unique 276-line Cloud script and synchronized AGENTS, ROADMAP, handoff,
  M4 design, and planning. Exact changed boundary is seven existing governance
  paths, 61 tracked paths, four executable upstream files, and zero Release-input
  overlap. Strict UTF-8/LF/fences/local links and `git diff --check` PASS.
- Direct `bash` was absent from inherited PATH; the explicit Git Bash syntax check
  first hit the known sandbox signal-pipe error and then passed outside that process
  boundary. All four embedded Python heredocs compile. Importer and Node syntax PASS.
- Focused Node tests first hit the known Windows sandbox `spawn EPERM` before any
  assertion; the approved rerun passed 4/4. Full Windows suite passes 63 registered /
  52 pass / 0 fail / 11 honest POSIX skips.
- The first double-ZIP helper used unsupported `New-Item -LiteralPath`; PowerShell
  reported a non-terminating parameter error even though the builder later passed.
  Replaced it with strict-error `New-Item -Path`, verified the resolved temp target,
  and reran cleanly: two exact 22-entry / 75,323-byte ZIPs at accepted SHA-256.
- The seven-file commit itself succeeded, but its combined verification command then
  called an accidental `test_cmd_placeholder` token and returned exit 1 after the
  commit. No repository operation depended on that token. Recorded the tool error,
  amended this same single descendant, and reran identity/clean checks separately.
- Published the amended single preparation descendant by normal fast-forward as
  `main@0b4bd7d...`; immediate readback confirmed default main and unchanged
  development/audit refs. Both local repositories were clean before Cloud execution.
- Maintainer returned the complete M4-C strict summary. Every frozen field PASS:
  Linux 63/63/0/0, 61 paths/four executables, accepted 22-entry development ZIP,
  zero-hash guard, exact beta.2 asset sizes/hashes, isolated 11-payload rollback
  build/doctor, handoff rehearsal, remote/default/evidence recheck, zero live
  mutation, and clean workspaces.
- Recorded `M4C_CUTOVER_ROLLBACK_ACCEPTANCE=PASS` and closed repository migration as
  `M4_REPOSITORY_CUTOVER=PASS`. No Release/tag, live `/opt/codex`, production byte,
  repository rename/archive/delete, or Product Phase 4 action occurred.
