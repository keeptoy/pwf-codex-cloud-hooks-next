# Findings: v0.5.0 FULL Release C0

## Starting facts

- Maintainer authorization selects the existing FULL route, not the Phase 5.3 reduced-lane experiment.
- Local branch `0.5.0` is clean at `a06947f7b23c020809e87934373702792a458918` before this activity begins.
- Stable package/contract/bootstrap identity is already materialized as pre-C0 `v0.5.0`; the bootstrap contains a
  64-zero ZIP checksum and therefore cannot be used as a public default installer.
- Accepted installed predecessor remains immutable `v0.4.4`; immediate fallback remains `v0.4.3`.
- The G3 classifier already reports complete seven-member identity closure plus residual Product/runtime changes,
  hence `PRODUCT_OR_SECURITY` and the full C0/C1/C2 + two-channel workflow.

## Research log

- README confirms that a development/pre-C0 bootstrap must retain the 64-zero hash and fail closed; a separately
  authorized seal may occur only after all ZIP inputs are frozen and deterministically hashed. Source identity,
  version text and local assets alone never establish a Release.
- ARCHITECTURE confirms the FULL trust boundary: Release ZIP contents are contract-owned, bootstrap stays external,
  local seal still is not publication, and all Product/runtime/security changes require the current Cloud and
  rollback evidence rather than a documentation-only shortcut.
- The accepted predecessor/rollback line cannot be rewritten by this C0: `v0.4.4` remains accepted and `v0.4.3`
  remains immediate fallback until later Published Release + Latest + C2 closeout.
- DESIGN routes this gate through the Release artifact contract, deterministic builder, candidate-bootstrap
  materializer, full suite and target-platform evidence. The G3 classifier/projector remain advisory and cannot
  replace the active plan or execute/authorize any gate.
- ROADMAP's current programme still says pre-C0/no-Release, so this newly authorized gate must update only the
  current Release authorization pointer needed for C0; it must not prematurely record Cloud PASS, publication,
  Latest or role rotation.
- The programme sequence is fixed: non-destructive admission preflight → C0 → Source/Candidate Cloud → first
  retirement review → C1 → tag fixed to C0 + immutable Pre-release → independent Published Release Cloud → Latest
  confirmation → second retirement review → C2. Each boundary remains fail closed.
- ROADMAP requires an explicit programme-level promotion from pre-C0 to approved Release candidate before sealing;
  this task plan supplies the gate authorization, while ROADMAP must be reconciled to say Release step 1 is active
  and later steps are still unauthorized/PENDING.
- Wiki distinguishes three objects: disposable early `candidate.zip`, tracked root zero-hash bootstrap used by
  Source/Candidate with local URL/SHA overrides, and exact-hash `dist/` assets generated only after first-channel
  PASS. This C0 must produce/check only the first two categories and must not run the formal `release` command.
- Source/Candidate Cloud is allowed to be tagless and must exclude publication-only oracles that require refs; it
  must still run the portable Linux suite with zero skips, two deterministic builds, override installation and the
  Fresh/UserPrompt/real-Resume/doctor/deep-check lifecycle.
- Historical v0.4.4 C0 resolves the self-reference problem correctly: its pre-run guide names the branch checkout
  containing the guide as the candidate source, and the post-commit handoff supplies the exact
  `SOURCE_CANDIDATE_HEAD`. The guide does not pre-fill its own commit hash.
- The v0.5.0 guide must follow the current operator-template structure and use the dedicated multi-Discovery
  Release filename selected below. It links stable template anchors instead of copying the long scripts or B–E prompts.
- Template 4.1 dynamically selects the sole contract-named bootstrap, excludes the publication-only oracle from
  tagless Cloud, demands `fail=0` and `skipped=0`, double-builds the ZIP, checks bootstrap exclusion, runs importer
  from extracted ZIP, installs with local overrides, and emits the exact head/ZIP/setup markers needed for C1.
- The current B–E protocol needs no v0.5-specific copy: B-SC must observe post-install Resume, C creates only the
  canonical markerless legacy planning fixture, D observes all eight injected markers, and E proves tail-preserving
  real Resume/catch-up ordering. The guide should link these anchors and require raw replies.
- Source deep check 9.1 permits only planning fixture dirt, derives contract/bundle paths from the current manifest,
  verifies doctor/inventory/hash/helper/policy/residue facts, and rechecks exact HEAD. These outputs plus final exit
  code are mandatory evidence; partial stdout is not enough.
- The guide must declare the full Published Release channel now but leave URLs, SHAs and final Post-run absent until
  immutable publication exists. C1 is the first allowed evidence writeback; C2 remains blocked through Latest and
  the second retirement review.

## Phase 1 decisions

- `v0.5.0` already contains multiple formal Discovery rounds, while this Release closeout is not another Product
  Discovery. Its dedicated entry is therefore `docs/acceptance/v0.5.0-release-operator-guide.md`, not a cumulative
  version acceptance or a fictional new round.
- Candidate-admission inventory contains exactly seven retained planning directories: the completed-scope
  retirement, Phase 5.3 G1/G2/G3, release-process discovery, stable-identity transition and this FULL C0 plan. All
  are `KEEP`; none is disposable pre-Cloud clutter. The accepted v0.4.4 guide/bootstrap, current candidate inputs,
  and Release-excluded governance/history files are retained too.
- The actual candidate delta is not identity-only: `runtime/owned-plan.py` tightens nonce/attestation normalization
  to require the final LF, and the runtime bundle hashes change accordingly. Together with classifier/projector
  self-change, that independently keeps the lane at `PRODUCT_OR_SECURITY` / FULL.

## Source/Candidate fixture correction

- The first Cloud attempt did not expose a classifier or production defect. In the delta-shape test,
  `update-index --chmod=+x` changed the index to `100755`, then helper `commit()` ran `git add -A`; on Linux with
  `core.filemode=true`, Git reread the unchanged `0644` worktree and removed the staged mode delta.
- `fs.chmodSync(..., 0o755)` would work on POSIX, but Node documents that Windows only supports changing the write
  permission through chmod. A local Windows experiment confirmed it left Git at `100644` with no staged diff,
  while `git add -A` followed by `update-index --chmod=+x` produced raw `100644 -> 100755 M` and index `100755`.
- The test validates commit raw-diff evidence, not operating-system chmod semantics. The portable fixture therefore
  stages all A/D/R worktree changes first, changes the Git index mode second, asserts the exact stage mode, and
  calls the existing `commitStaged()` helper so no later restage can erase the mode.
- `core.filemode` must not be disabled. The replacement changes only Release-excluded test/planning files, but the
  failed channel cannot be promoted: a new exact C0 and Fresh Source/Candidate A--F run are required.

## Source/Candidate PASS and C1 admission

- The maintainer explicitly reports the replacement-C0 Source/Candidate A--F channel as all PASS. Per repository
  interaction policy, that final conclusion is accepted directly; the guide records the supplied exact evidence
  without inventing unpasted raw dialogue or asking for a rerun.
- Supplied 9.1 evidence binds the run to HEAD `6633b1bc2b5c5fb1e9452ac3dfa85c1137d7637d`, planning-only worktree dirt,
  healthy managed doctor, installer `0.5.0`, manifest schema 4, Release schema 2, bundle schema 2, 22 Release
  entries, 12 installed runtime files, four pristine upstream files, authoritative bundle inventory,
  adapter-only policy, zero snapshot leftovers and `PWF_SC_POST_RESUME=PASS`.
- The all-PASS A--F conclusion includes the template 4.1 deterministic ZIP gate; the candidate identity remains
  the locally reproduced 22-entry, 84,516-byte ZIP with SHA-256
  `7f4fcdee036b71c9093c044af1c015218d5a5533779d719d0f4f01bc79d0ba40`.
- First retirement review should keep all seven planning scopes, the accepted v0.4.4 recovery pair, sealed C0
  inputs, the open v0.5.0 guide/templates/tests, and the ignored exact `dist/` assets. No object is safe or authorized
  for RETIRE/MIGRATE before publication and the second role-window review.

## Published Release PASS and remaining closeout boundary

- The maintainer explicitly reports the independent v0.5.0 Published Release Cloud channel as PASS with final exit
  code `0`. The supplied immutable URL and re-download SHA equal the sealed candidate ZIP identity
  `7f4fcdee036b71c9093c044af1c015218d5a5533779d719d0f4f01bc79d0ba40`.
- Supplied markers close the public-package identity, post-resume doctor, authoritative bundle inventory,
  adapter-only policy, ZIP-boundary importer, zero-leftover and post-resume gates. Repository policy requires this
  explicit maintainer conclusion to be accepted without reclassification or rerun.
- Published Release PASS does not itself prove GitHub Release Latest promotion. ROADMAP keeps Latest as a separate
  maintainer metadata confirmation after the public channel; C2 and the second role-window retirement checkpoint
  must wait unless the maintainer also confirms the Release detail page shows exact v0.5.0 as Latest and not
  Pre-release.
- A bounded browser attempt could not access the GitHub Release API/page, so it yielded no metadata evidence. This
  is a tool-access limitation, not a Release failure; do not weaken the Latest condition or reinterpret the explicit
  Published PASS.
- The initial public tag was a lightweight ref directly targeting C0. The maintainer accepted this as a low-risk
  publication-metadata defect and performed a guarded atomic replacement rather than deleting the Release or
  assets. The resulting annotated tag object is `e96f5b8855c5f637fa546fa99fd0c93c4cdfaf0f`; its peeled commit remains
  exact C0 `6633b1bc2b5c5fb1e9452ac3dfa85c1137d7637d`.
- This repair changes tag metadata only. It does not alter candidate source, ZIP/bootstrap bytes, public filenames,
  public URLs or the already accepted Published Release behavior evidence. Latest remains intentionally pending.
