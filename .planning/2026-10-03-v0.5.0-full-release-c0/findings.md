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

## Latest confirmation and C2 retirement model

- Maintainer explicitly confirms normal-path Latest promotion. Per ROADMAP this closes the metadata gate without a
  redundant asset/SHA postflight and authorizes the second role-window review.
- The v0.4.4 C2 precedent retired the previous accepted version's current-tree guide/bootstrap while preserving
  recovery through its immutable Release/C2 commit, migrated the two-seat publication oracle, froze the new
  accepted version's tracked bootstrap to the public exact ZIP SHA, updated provenance/CHANGELOG/ROADMAP and kept
  all unapproved planning deletion as `KEEP`.
- The analogous v0.5.0 role rotation is accepted `v0.5.0`, immediate fallback `v0.4.4`, deeper fallback `v0.4.3`.
  It must not delete remote tags/Releases/assets or stable contracts/runtime/templates/history.
- Unlike the v0.4.4 precedent, Product Phase 5 is still explicitly active because Phase 5.3 G4/G5 remain
  `KEEP / DEFER`. Release closeout therefore cannot silently close Phase 5 or assign an unauthorized successor
  train. The C2 representation must preserve that active Product authority while making clear the v0.5.0 Release
  train itself is closed.
- Because the current phase cannot be closed and no successor train is authorized, the least expansive C2 state is
  to keep the repository/package development identity at `v0.5.0` while marking its Release train closed and its
  accepted role established. This avoids inventing `v0.5.1`, falsely setting Product Phase 5 complete, or violating
  the existing `NONE` rule that disallows an active Phase without a matching train pointer.
- The v0.5.0 accepted evidence uses the already-governed multi-Discovery filename
  `docs/acceptance/v0.5.0-release-operator-guide.md`, whereas earlier accepted releases used
  `vX.Y.Z-cloud-hard-acceptance.md`. C2 tests/routes must admit both stable naming families rather than rename the
  live guide or create a duplicate acceptance.
- `docs/`, `tests/`, planning, ROADMAP, provenance and CHANGELOG are Release-excluded; the tracked v0.5.0 bootstrap
  is an external asset and should be frozen from zero hash to the exact public ZIP hash at C2, matching the prior
  accepted-version pattern without changing the already immutable C0 tag or public assets.
- Recovery confirmed exactly seven planning scopes remain in `.planning/`; the second review keeps all seven because
  the maintainer authorized C2 but did not authorize planning deletion. The worktree contains only this plan's C2
  evidence edits, and local HEAD is the published-checkpoint commit `a385ca2`, one commit ahead of the tracked branch.
- The tracked and formal v0.5.0 bootstraps differ by exactly one line: the tracked candidate has the 64-zero ZIP SHA
  and the formal asset has `7f4fcdee...0ba40`. Freezing that exact line at C2 makes the current-tree bootstrap match
  the already-published 21,565-byte asset; no template, ZIP input or public byte changes.
- Current Phase 5 overview and tests still encode the pre-C2 window. The C2 patch must update both lifecycle prose
  and dynamic route helpers together: accepted evidence may use either `cloud-hard-acceptance` or
  `release-operator-guide`, and installed transition admission must track the immediate fallback (`v0.4.4`) after
  accepted rotates to the current package (`v0.5.0`).
- Repository-boundary C2 assertions should follow the v0.4.4 precedent without hardcoding the old accepted guide:
  read v0.5.0 as the live accepted guide, recover the retired v0.4.4 guide from `053f66e...`, require both v0.4.4
  current-tree files absent, and assert Phase 5 stays active with G4/G5 deferred and no successor train authorized.
- `release-assets.test.js` currently equates `developmentTrain === package version` with a zero-hash candidate. C2
  intentionally has the same `v0.5.0` identity in both the active Phase pointer and accepted role, so accepted status
  must take precedence: require a non-zero exact bootstrap and skip candidate-bootstrap materialization in that case.
- Retiring the v0.4.4 current guide leaves four documentary inbound links. Convert provenance, CHANGELOG and both
  Phase 4 overview references to the immutable `053f66e...` blob before validation; test-only recovery paths remain
  intentionally literal and must not be rewritten.
