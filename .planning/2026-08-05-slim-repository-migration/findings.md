# Findings: Slim Repository Migration

## Pre-Phase-4 roadmap calibration

- The successor ROADMAP still mixed durable current authority with M2/M3
  intermediate stop language. Those details remain valid historical evidence in
  the M3/M4 runbooks and planning journal, but they should not remain present-tense
  programme instructions after M4 closure.
- The durable governance model is: ROADMAP owns Product Phase/version/Cloud/Release
  state; the active task plan owns the exact current authorization and stop; the
  maintainer handoff owns executable Release operations.
- Phase numbers and release versions are related defaults, not identities. New Hook,
  Host ABI, trusted-graph, activation, or user-visible behavior surfaces normally
  advance a minor train; compatible fixes use patch. Phase 9 seals the currently
  approved train and therefore does not mechanically mean `0.9.0`.
- `0.3.0-beta.3-dev` remains migration/equivalence source identity. Product Phase 4
  Discovery must explicitly choose between a separate stable `v0.3.0` seal of the
  unchanged canonical behavior and a new `0.4.0-*` Phase 4 train. No package,
  bootstrap, ZIP, tag, or Release identity changes before that decision.
- A future Release becomes a rollback baseline only after deterministic sealing,
  immutable publication, downloaded-asset verification, Fresh/Resume/doctor, and
  rollback evidence. Until then immutable beta.2 remains the sole accepted product
  rollback.

## Frozen baseline

- M1 audit commit: `bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b`.
- M1 audit tree: `ff49c3c6656386e94450ccb24437a1c2d1c50e95`.
- M2 target: exactly 59 tracked paths assembled from 46 retained paths, six
  renamed sources, and seven new document/planning entrypoints.

## M2-A boundary

- Archive means omitted from the new orphan tree; historical files remain in the
  archive repository and frozen audit ref.
- The six renames are structural only in M2-A. Behavior-name rewrites and test
  reference updates belong to M2-B.
- The four new root documents are intentionally minimal entrypoints until M2-B;
  they are not current architecture, provenance, handoff, or roadmap authority yet.

## M2-A verification finding

- Exact path, byte, mode, UTF-8, forbidden-path, untracked-path, orphan-branch, and
  audit-oracle checks pass.
- The only cached whitespace report is the terminal blank line inherited byte-for-byte
  from `Git可执行权限修复.md` into `docs/git-file-modes.md`. Editing it in M2-A would
  violate the frozen rename-byte contract, so its cleanup remains an explicit first
  obligation of the M2-B document rewrite.

## M2-B initial dependency inventory

- The retained README/AGENTS still route to archived `PROJECT_UNDERSTANDING.md`,
  `work_plan.md`, generic black-box material, Phase 3 tests, and the prototype;
  the new authority documents must replace those routes rather than copy history.
- Three test modules still open the pre-rename fixture names. The renamed
  `repository-boundary.test.js` still requires the intentionally absent prototype,
  so both stable boundary tests must be rewritten before the suite is meaningful.
- Package and bootstrap still identify beta.2/current repository. The immutable
  beta.2 acceptance document intentionally retains those historical asset strings;
  current identity changes must not rewrite that evidence.
- M2-B must distinguish current references from immutable baseline references:
  beta.2 hashes/URLs remain in the acceptance/provenance documents, while package,
  bootstrap, current README/tests, and handoff move to beta.3-dev/successor identity.

## M2-B manifest decision

- Discovery described `historical_patched_skill_files` as removable because the
  patcher allegedly had a compatibility-patch fallback. Current source does not:
  `load_contract()` still requires the historical field to equal
  `compatibility_patches[PATCH_ID].patched_sha256`.
- Deleting the field would require changing the reproduction patcher and its
  contract, expanding risk without improving the 59-path boundary. M2-B therefore
  retains the field and records its legacy name in provenance. This is allowed by
  the plan's “can delete” wording and keeps production/reproduction behavior stable.
- Overlay evidence paths are a real active dependency because `contracts.test.js`
  requires each one to exist. They will point to `BASELINE_PROVENANCE.md` and the
  committed Cloud observation/JSONL fixtures; the overlay contract hash must then
  be recalculated in `upstream-manifest.json`.

## M2-B authority rewrite

- The new macro layer now has single-purpose documents: README for behavior/ops,
  ARCHITECTURE for trust/runtime, ROADMAP for gates, BASELINE_PROVENANCE for source
  evidence, MAINTAINER_HANDOFF for operations, and the Git-mode runbook for LF/mode.
- Immutable beta.2 acceptance remains untouched and is linked as baseline evidence;
  current docs clearly mark beta.3-dev as unpublished and zero-hash bootstrap as
  intentionally unusable.
- `.gitattributes` now uses repository-wide `* text=auto eol=lf` plus explicit
  binary `-text` families. M2-C still owns fresh-clone proof; the rule alone is not
  claimed as cross-platform acceptance.

## M2-B behavior and identity rewrite

- Replacing the prototype handoff's eight imported tests plus one isolation test
  with three stable repository-boundary tests yields the predicted net reduction
  from 69 to 63 registered cases while preserving production safety assertions.
- The renamed golden/Cloud fixture bytes remain unchanged; only test variable,
  path, and behavioral labels changed.
- Current package/bootstrap identity is beta.3-dev/successor/zero hash. Published
  beta.2 hashes remain asserted through the immutable acceptance document and
  BASELINE_PROVENANCE rather than the development bootstrap.
- Static compile guidance uses in-memory `compile()` instead of `py_compile`, so
  normal maintenance does not create `__pycache__` inside exact runtime inventory.
- Removed Phase/Round wording from the two schema `$comment` fields without
  changing schema validation semantics. This required synchronized installed
  contract hashes in runtime-bundle/upstream-manifest and a new runtime-bundle
  hash; production Python/shell bytes remain untouched.
- Retained historical labels only where they are evidence or immutable data:
  beta.2 acceptance/provenance, the frozen golden fixture description, upstream
  fixture content, fresh planning's M2-A record, and the owned-plan source docstring
  whose modification would violate the no-production-change M2-B boundary.

## Importer hygiene adjustment

- Running the documented importer check created an ignored
  `patches/__pycache__`, because `load_patcher()` dynamically imports the patcher
  with Python's default bytecode behavior. This would leave a fresh successor
  checkout non-pristine even though Git status hides it.
- The bounded fix sets `sys.dont_write_bytecode = True` in the development/import
  tool and adds an after-test assertion. It does not alter adapter/owned/upstream
  runtime, Host ABI, schema validation, imported bytes, or Release layout. The
  importer hash in upstream-manifest is updated accordingly.

## M2-B closure

- The stable repository now contains 63 registered tests rather than the M1
  audit tree's 69 because the nine prototype/handoff cases were replaced by three
  repository-boundary assertions. The six-case reduction is intentional; every
  security conclusion remains mapped to a production test.
- Windows reports 52 PASS and 11 honest POSIX/Linux-only SKIP. This exactly matches
  the Discovery estimate, but the count is evidence rather than a contract; M3
  must still prove 63/63 and behavior equivalence in Cloud/Linux.
- A repository-wide Markdown link scan must exclude the intentionally incomplete
  upstream Skill fixture. Its links point to files not copied into the fixture by
  design; the 12 maintained documents all pass independently.
- The development bootstrap is deliberately unpublishable: it targets the
  successor slug and beta.3-dev but retains a 64-zero checksum. No M2-B evidence
  should be interpreted as a Release candidate or cutover authorization.

## M2-C closure

- The repository-wide LF policy is now proved, not merely configured. A fresh
  clone with `core.autocrlf=true` materialized all 59 tracked files with zero CR
  bytes and passed importer/static/full-suite checks without local repair.
- M2 closes with one parentless 59-path root history, exactly four executable
  upstream runtime entries, deterministic 22-entry development ZIP bytes, and an
  intentionally unusable zero-hash bootstrap. None of these results authorize
  push, Cloud deployment, Release, cutover, or Product Phase 4.
- Closure synchronization changed packaged `README.md`, so the pre-closure
  development ZIP hash was correctly rejected as final evidence. Rebuilding the
  amended tree twice produced the stable 74,899-byte SHA-256
  `647e16852f818a84f4b5d4872a876d411cdbdfa7671f07b7614f35f12aae5e7d`.
  Planning files are outside the Release allowlist, so recording this value does
  not alter the ZIP bytes.

## M3 Discovery

- M3 equivalence is behavioral and operational, not byte equality with beta.2:
  successor documentation, package identity, and development ZIP bytes are
  intentionally different while the trusted runtime behavior remains frozen.
- A four-stop shape avoids conflating different authorities: Discovery; M3-A
  remote transport plus no-live Cloud/Linux seal; M3-B disposable Managed Hook
  setup plus Fresh/Resume; and M3-C evidence closure.
- Development lifecycle testing can exercise the unmodified bootstrap without a
  fake Release: build the deterministic ZIP from the accepted checkout, pass its
  `file://` URL and SHA as process-only overrides, and leave the checked-in
  bootstrap's 64-zero checksum unchanged and fail-closed.
- M3-A records the exact tested HEAD and development ZIP SHA. M3-B must receive
  those values from the external Cloud setup configuration, preventing a
  self-referential commit/hash edit.
- M2 root identity remains immutable. Later M3 governance/evidence is a normal
  descendant; if closure changes anything outside the allowed governance files,
  the behavioral gate must be rerun.
- A direct Windows rehearsal of the isolated installer stopped at the intended
  Linux production contract because `/usr/bin/python3` does not exist on Windows.
  This is a platform limitation, not an installer or M3 script defect: M3-A runs
  the same gate on Linux/Cloud, while the existing Windows installer tests replace
  that frozen interpreter only inside their test copy.
- Adding the M3 runbook creates one legitimate post-M2 path. The exact-tree test
  would pass while the file remained untracked but fail after checkpoint, so the
  Discovery boundary now explicitly advances current HEAD to 60 paths and changes
  only `tests/repository-boundary.test.js` to admit that governance document.

## M3 pre-A README authority refinement

- `README.md` is a Release ZIP entry, while ROADMAP, planning, and the full Git
  mode runbook are source-governance files excluded from the 22-entry artifact.
- Stable supported Hook behavior belongs in the packaged README: an offline ZIP
  user still needs to know events, ordering, and failure semantics. Renamed that
  section from time-sensitive “current” wording rather than moving it out.
- Migration/Cloud/Release gate state belongs only in ROADMAP, with exact Next Step
  in the activity task plan. README now provides stable source-checkout navigation
  instead of copying M2/M3/M4 status.
- Git mode/LF recovery uses two layers: a concise README check and exact four-path
  repair for discoverability, plus `docs/git-file-modes.md` for renormalization,
  fresh-clone, and destructive-operation cautions. Copying the full runbook into
  the packaged README would recreate the coupling this refinement removes.

## M3-A first Cloud attempt

- The accepted `f54fb78633d22af5c8f0f225fc8c44ad046aa9c1` checkout passed M2
  root/tree, 60-path governance boundary, four `100755` modes, importer/static/Bash,
  and Linux 63/63 including root/root, cross-user, and process-group cases.
- The isolated install and doctor completed, but the runbook parser raised
  `KeyError: 'command'`: generated TOML stores an event group at
  `policy["hooks"][event][0]` and the command handler below its `"hooks"` list.
  This is currently classified as a runbook assertion defect, not production,
  installer, test, or platform failure; source confirmation and a regression are
  required before the rerun.

## M3-A accepted evidence

- The repaired descendant `39795283cd65f84547651d7bec816191fb5bfedf` completed
  the script from line one with empty stderr and terminal M3-A PASS.
- The exact development ZIP is 22 entries / 75,323 bytes / SHA-256
  `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`.
  This is a development input for M3-B, not a Release asset or bootstrap default.
- The remote branch must remain on accepted HEAD until M3-B consumes it. M3-A
  evidence updates therefore remain a local governance checkpoint and are not
  pushed ahead of the tested commit.

## M3-B setup evidence

- The accepted development checkout rebuilt the exact 22-entry / 75,323-byte ZIP
  with accepted SHA-256 and installed it through a process-only `file://` override;
  the checked-in bootstrap remains zero-hash and no Release asset was involved.
- Healthy install/doctor plus pristine upstream Skill and both adapter protocol
  probes close the setup gate. Doctor validates installed manifest version against
  the current installer version even though the setup summary does not print that
  field; post-resume doctor remains the explicit version/inventory/residue proof.
- Direct adapter probe output is not automatic Host lifecycle injection. Fresh
  acceptance must come from the first no-tools reply in a completely new task.
- Cloud repository setup order is explicit: create new container, clone the GitHub
  repository, run the saved setup script inside that checkout, start Runtime, then
  accept the first user prompt. A prior manual install in another container is not
  inherited and cannot authorize Fresh without the saved setup configuration.
- The accepted Fresh reply observed startup SessionStart, UserPromptSubmit, and all
  three auxiliary planning sections. Only the two canaries and startup source are
  hard Fresh requirements; the auxiliary observations are additional positive
  evidence, not a newly expanded contract.
- The immediate canonical no-tools check observed all six required fields after
  the exact baseline acknowledgment. This proves active scoped selection, marker,
  framing, and recent-progress injection. It does not replace Resume's structured
  `patch_apply_end` evidence, which remains the proof of the real planning update.
- Resume recognized `task_plan.md` at message #36 as the last planning update and
  recovered 16 unsynced messages, the truncation marker, exact C7F4 tail, ordering,
  and canonical plan/progress. This closes the structured-update cross-check even
  though the model-rendered Markdown presentation is not a byte-for-byte file dump.
- Post-resume doctor closes installed-state equivalence: healthy true, repairable
  false, empty errors/blockers, beta.3-dev manifest version, exact 11-file declared/
  actual inventory, and zero snapshot residue. M3-B is complete; M3-C remains an
  independent authorization boundary because it creates the closure descendant.
- M3-C initial audit proves the complete tested-commit-to-worktree candidate is
  exactly seven existing governance files. Root/tree, 60-path identity, four-mode
  executable set, audit oracle, remote tested HEAD, and zero Release overlap all
  remain frozen; therefore a local closure commit is eligible only after final
  document/importer/focused/staged checks.

## M4 Discovery opening

- The maintainer explicitly authorized M4 Discovery after both local M3/archive
  checkpoints were clean. This authorization is design-only: it does not authorize
  push, public `main`, default-branch or repository-setting mutation, Release,
  cutover, old-repository navigation edits, production behavior, or Product Phase 4.
- M4 must distinguish Git object/ref operations from GitHub repository settings.
  A local branch named `main` or a pushed ref does not itself prove the remote
  default branch, branch protection, repository description, or archive navigation.
- The accepted Cloud-tested remote HEAD `39795283...`, local governance closure
  `d9308763...`, immutable M2 root, and M1 audit ref form separate identities. The
  Discovery must decide which governance descendants become public without moving
  either immutable oracle or claiming untested product bytes.
- Local topology has no `main` or tag. Local slim HEAD is `d9308763...`; remote
  development remains tested `39795283...`; the local branch has no upstream
  configuration and is two governance commits ahead. The audit branch remains
  `bbad3703...`; the complete ref set therefore has two intentionally unrelated
  histories, not one root across all refs.
- GitHub repository metadata is current and materially changes the old assumption:
  `keeptoy/pwf-codex-cloud-hooks-next` is already public, and its default branch is
  `migration/slim-beta3-dev`. The only remote branches are that development branch
  and `audit/beta2-exact`; `main` does not exist. A cutover plan must therefore move
  the default branch deliberately rather than treating its creation as sufficient.
- Current GitHub merge settings allow merge commits, rebase, and squash; auto-merge
  and update-branch are disabled. These are observed repository settings, not yet
  proposed cutover policy. Branch/ruleset protection still requires separate
  read-only evidence.
- GitHub's public read API reports zero repository rulesets and zero successor
  Releases. Classic branch protection cannot be inferred from an empty ruleset list
  and remains unobserved because the available authenticated connector has no
  protection-read action. M4 must treat protection as an explicit pre/post mutation
  check, not claim it is absent.
- The old repository is public, unarchived, and defaults to branch `0.3.0-beta.2`.
  Its immutable Releases remain available through beta.2 and earlier versions; the
  successor has none. This supports keeping the old repository active as the
  rollback/archive source rather than renaming, deleting, or archiving it in M4.
- The successor bootstrap already targets the successor Release URL but remains
  beta.3-dev with a zero hash. Its ZIP allowlist excludes docs/planning, so M4
  governance and navigation edits do not change development artifact bytes unless
  README or another allowlisted entry changes. A real pre-release is therefore a
  separate post-cutover Release gate, not a prerequisite for creating `main`.
- The old README currently has no successor navigation link and still presents
  Phase 4 as the next product step. Cutover needs a small archive banner/link update,
  while retaining beta.2 installation, asset, and historical evidence in place.
- The old local branch is one governance-only checkpoint ahead of its remote.
  M4 must either publish that checkpoint before the navigation commit or combine
  both in a reviewed old-repository push; silently leaving the M3 handoff local
  would make the public archive contradict the successor's provenance narrative.
- GitHub documents two technically valid default-branch routes: rename the current
  default branch, or create a second branch and explicitly select it as default.
  Rename provides web URL redirects and updates branch policies, but raw URLs and
  Git pull do not redirect. Because M3 evidence intentionally names and freezes the
  development ref, creating `main` from an exact descendant and then changing the
  default branch is more transparent than renaming the evidence ref.
- GitHub requires more than one branch before changing the default. Repository
  rulesets can layer with classic protection and are readable by repository readers;
  an active ruleset may prevent deletion and non-fast-forward updates. The successor
  currently has no ruleset, so M4 should add a minimal `main` integrity policy only
  after exact branch creation and before declaring cutover complete.
- Adding a dedicated M4 design document increases the exact slim boundary from 60
  to 61 paths. `tests/repository-boundary.test.js` is the sole test that must change:
  add the new governance path and update the exact count. Release remains 22 entries
  because the machine contract excludes all `docs/` and `tests/` paths.
- Discovery verification confirms the boundary decision: focused contracts 4/4,
  full Windows 63/52/0/11, strict 13-document validation, importer/static checks,
  and two exact accepted ZIP builds all pass. The selected route can advance to an
  authorization checkpoint without any production or Release-input exception.

## M4-A opening

- The maintainer checkpointed both repositories and explicitly authorized M4-A.
  The exact successor candidate is `cc9bc878ddc7d70c25156dd053e2874758f0814a`;
  its parent is the M3 closure `d9308763...`. This authorization does not extend to
  M4-B, M4-C, archive navigation, Release, live Cloud, production, or Product Phase 4.
- M4-A retains the Discovery ordering: authenticated protection/settings evidence
  and a controlled mutation interface are preconditions, not facts inferred from a
  successful Git push. If those controls cannot be observed and changed safely,
  stop before creating `main` rather than leave a partially cut-over repository.
- Preflight confirms exact local candidate `cc9bc878...`, remote development
  `39795283...`, remote audit `bbad3703...`, and no remote `main` or tag. The
  authenticated GitHub connector reports admin permission and development as the
  default; public branch/ruleset APIs report both evidence branches unprotected and
  zero rulesets. Thus classic protection is observed as disabled, not unknown.
- The connector exposes branch creation but not repository-default or ruleset
  mutations. This host has no `gh`; Git Credential Manager has no non-interactive
  GitHub HTTPS credential. An attempted silent credential availability check was
  terminated when it waited for interaction; a second `GCM_INTERACTIVE=Never`
  check returned unavailable without exposing any credential. This is a control
  channel blocker, not a repository, runtime, test, or Git transport defect.
- The maintainer installed and separately authorized GitHub CLI. The running Codex
  process did not inherit its new PATH, so M4-A used the explicit trusted binary
  `C:\Program Files\GitHub CLI\gh.exe`. Authenticated status confirmed account
  `keeptoy`, SSH Git protocol, and `repo` scope without displaying any unmasked
  credential. This resolved the settings-channel blocker without reusing GCM.
- Exact-ref push, default switch, and two repository rulesets succeeded. GitHub's
  branch API now reports all three refs protected by active rulesets; the classic
  protection endpoint remains absent. This distinction is intentional: ruleset
  protection supplies the policy, and classic protection is not silently layered.
- The minimum evidence policy preserves emergency fast-forward maintenance while
  blocking deletion and non-fast-forward changes. It does not fully freeze all
  future updates and does not claim CI exists.

## M4-B opening

- The maintainer checkpointed the M4-A governance record as successor commit
  `94cd28a30479f466b59591680a4be6a5089a319b` and explicitly authorized M4-B.
  Its parent is exact remote `main@cc9bc878...`; the successor worktree is clean.
- The archive worktree is clean at `771f8906...` and is two governance commits
  ahead of remote `0.3.0-beta.2`. M4-B must publish that complete descendant plus
  the navigation update by normal fast-forward; it may not rewrite history or
  alter beta.2 product/Release bytes.
- M4-B is documentation/provenance transport only. M4-C, Release/tag, live Cloud,
  production behavior, repository rename/archive/delete, and Product Phase 4 stay
  outside the authorization.

## M4-C acceptance design

- The final published M4-B readback commit is `5476a5c97e713d935622a9998f902e35a114db07`.
  M4-C needs a committed runbook, so the accepted Cloud checkout cannot remain
  byte-for-byte at that commit. The safe identity rule is one governance-only
  descendant, exact seven-path diff, remote-main SHA captured before clone and
  unchanged after the run, with `5476a5c...` required as its direct M4-B ancestor.
- Authenticated readback confirms successor default `main@5476a5c...`, unchanged
  development `39795283...`, audit `bbad3703...`, and active main/evidence rulesets.
  The old repository remains public/unarchived at default
  `0.3.0-beta.2@11ef7c...`; beta.2 ZIP/bootstrap size and digest remain exact.
- Rollback independence is proved from the downloaded beta.2 package plus the old
  repository's own pinned Skill fixture. Its install and doctor use only a trusted
  temporary `CODEX_HOME` and requirements path; the successor package is never an
  input to the rollback check, and neither bootstrap is executed against live
  `/opt/codex`.
- The development bootstrap rejection can be exercised without setup side effects
  by sourcing it and invoking only `assert_hooks_checksum_configured`; full suite
  coverage plus the exact zero-hash line and Bash syntax freeze the same boundary.

## M4-C accepted evidence

- Fresh Cloud returned the exact terminal marker at accepted
  `main@0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151`. All summary fields are mutually
  consistent with the frozen runbook: one seven-file governance descendant, Linux
  63/63, 61 paths/four executable modes, accepted development ZIP, beta.2 assets,
  isolated 11-payload rollback doctor, handoff, remote recheck, zero live mutation,
  and clean workspaces.
- M4 therefore closes without a beta.3 Release or product/runtime change. The
  successor is the maintenance source authority; the old repository remains the
  immutable beta.2 rollback/archive authority. Product Phase 4 is a new trust and
  behavior domain and still requires a separate Discovery authorization.
- The unique M4-C script is sealed evidence for `0b4bd7d...`: subsequent normal
  governance commits move `main` but do not retroactively move the accepted input.
  A future rerun must check out the accepted commit or define a new gate; it must
  not weaken the exact-parent/seven-path assertion merely to follow current main.

## Post-M4 documentation-governance Discovery

- Historical gate-local prohibitions remain valid evidence; current-state banners,
  status summaries, navigation, and active Next Steps must reflect M1–M4 complete.
- The successor M3 runbook still declares “M4 Discovery authorization required” in
  its top status and end-of-gate Next Step. Its exact script and evidence should not
  be rewritten; a current historical-status banner/pointer should disambiguate it.
- Successor macro documents are mostly current after M4 closure. D2 should therefore
  be narrow, keeping README stable and avoiding duplicate migration流水账 across
  ROADMAP, handoff, provenance, and planning.
- This documentation-only gate is not Product Phase 4 Discovery and cannot authorize
  Release, trusted-graph, Host ABI, production, or live Cloud changes.
- D2 macro review found README, ARCHITECTURE, AGENTS, BASELINE_PROVENANCE, and
  MAINTAINER_HANDOFF already consistent with completed M4 and unpublished beta.3-dev;
  duplicating more migration chronology into them would increase coupling.
- D2 should add a historical-gate banner/current pointer to the exact M3 runbook,
  replace the successor task plan’s internally contradictory “M3-B authorized” status
  journal with a compact M1–M4 completion summary, and split ROADMAP rollback wording
  into historical migration rollback versus current product rollback.
- M3’s internal “PASS does not authorize next gate” statements and copyable scripts
  remain exact historical evidence. M4’s internal staged authorization statements are
  likewise retained because its final result section already closes the chronology.
- D1/D2/D3 establish the stable temporal model: current wrappers and navigation state
  the latest authority, while accepted M1–M4 protocol bodies retain the boundaries that
  made each gate auditable. No macro document needs to duplicate the full chronology.
- Successor independence has two layers. A fresh clone is already fully standalone:
  it is not a superproject/submodule, tracked files contain no local `new-space`, user,
  or `baseline-source` path dependency, and README/AGENTS/handoff cover build, test,
  Release, rollback, trust, and the only Next Step without old conversation context.
- This local migration checkout still has a non-tracked `baseline-source` remote and is
  checked out on a local branch named `migration/slim-beta3-dev`, even though its HEAD
  equals `origin/main`. These are migration-era local configuration, not repository
  dependencies. After the governance commit, normalize the local branch to `main`, set
  `origin/main` upstream, and remove only the local `baseline-source` remote.
- Remote `migration/slim-beta3-dev@39795283...` is accepted M3 evidence, not the future
  integration branch. It must remain frozen. Normal work after M4 is direct or reviewed
  work targeting `main`; any future feature-branch/PR policy is a separate governance
  choice, not an instruction to push new commits onto the evidence ref.
