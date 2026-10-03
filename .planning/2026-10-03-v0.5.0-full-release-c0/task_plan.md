# Task Plan: v0.5.0 FULL Release C0 and Source/Candidate handoff

## Goal

Enter the existing FULL Release workflow for `v0.5.0`, freeze an exact local C0 Source/Candidate checkout, close the
first Cloud channel on maintainer-supplied PASS evidence, and prepare the C1 checkpoint plus exact formal assets for
the maintainer's immutable publication gate.

## Authorization and scope

- The maintainer explicitly authorized continuing with the FULL workflow after the stable `v0.5.0` identity was
  prepared and classified `PRODUCT_OR_SECURITY`.
- This plan governs the current local C0 gate and the later evidence writeback checkpoints for the same Release
  train. Only the current gate may be implemented before its exit conditions pass.
- Allowed now: recover/freeze Release authorities; create the `v0.5.0` Release operator guide and non-destructive
  candidate admission preflight; run FULL local/portable validation available on this machine; build/check the
  deterministic candidate ZIP without sealing the tracked bootstrap; create the exact local C0 commit; prepare the
  maintainer push and Source/Candidate Cloud instructions.
- Maintainer-only: push branch/ref, create or move any remote ref, run/Resume Cloud tasks, preserve raw Cloud output,
  create/push the annotated tag, create/edit Release, upload assets, confirm Latest, or perform any deployment.
- Not allowed before first-channel PASS is returned: non-zero bootstrap sealing, C1, tag/publication, Published
  Release Cloud, Latest confirmation, role rotation or C2.
- G4/G5 reduced-lane work remains separate; this release uses the current FULL workflow regardless of those gates.
- The maintainer explicitly authorized the bounded replacement-C0 repair after the first Cloud attempt exposed a
  test-fixture defect: change only the Git mode construction in `tests/release-risk-classifier.test.js`, update
  planning evidence, rerun proportionate/full validation, and create a new local C0. Production/classifier changes
  and all post-Source/Candidate gates remain out of scope.
- The maintainer has now explicitly reported the replacement C0 Source/Candidate A--F channel as all PASS and
  supplied exact 9.1 deep-check evidence bound to HEAD `6633b1bc2b5c5fb1e9452ac3dfa85c1137d7637d`.
  This authorizes the planned first retirement review, Source/Candidate checkpoint writeback, exact asset
  materialization and local C1; remote push/tag/publication and the second channel remain maintainer/later gates.

## Current phase

Phase 7 complete locally: Latest confirmation, second role-window retirement review, accepted/fallback rotation,
final Post-run, C2 validation and the local governance commit are closed. Product Phase 5 remains active; G4/G5 and
any successor Release train remain unauthorized.

## Next Step

Maintainer pushes the local C2 commit on branch `0.5.0`. No additional remote mutation, Product Phase 5 gate,
successor version identity or Release train is authorized by this closeout.

## Phases

1. [x] Recover current authorities, accepted predecessor, Release object inventory and exact C0 semantics.
2. [x] Freeze the v0.5.0 FULL operator guide, candidate admission preflight and stop conditions.
3. [x] Run focused/failing-first checks and reconcile any lifecycle test expectations.
4. [x] Run FULL local regression, deterministic ZIP double-build and candidate-bootstrap checks.
5. [x] Create and verify the exact local C0 commit, then hand off maintainer push and Source/Candidate Cloud steps.
5R. [x] Repair the Cloud-exposed mode fixture, revalidate, and create a replacement exact local C0.
6. [x] After maintainer returns raw first-channel evidence, verify exact C0/asset identity and write C1 only on PASS.
7. [x] After separately authorized immutable publication and second-channel evidence, close Latest/retirement/C2.

## C0 exit conditions

- Worktree began clean on local branch `0.5.0` at stable-identity commit
  `a06947f7b23c020809e87934373702792a458918`; no unrelated user changes are mixed in.
- Package, Release contract, manifest references, installed predecessor and tracked zero-hash bootstrap retain their
  canonical `0.5.0`/accepted-`0.4.4` relationships.
- The version operator guide exists in Pre-run/PENDING state, declares FULL Source/Candidate plus Published Release
  channels, and contains no invented PASS, asset SHA, URL, tag or promotion evidence.
- Candidate admission preflight is non-destructive and records KEEP/DEFER decisions without deleting planning,
  accepted recovery material or rollback evidence.
- The current FULL local suite passes; Windows-only gaps remain honest and all required Linux zero-skip/lifecycle
  evidence is routed to Source/Candidate Cloud.
- Two candidate ZIP builds are byte-identical and healthy; the tracked bootstrap still embeds 64 zeroes.
- The classifier against accepted v0.4.4 reports complete canonical identity closure, no unknowns and
  `PRODUCT_OR_SECURITY`; its evidence plan remains advisory, not execution authority.
- One exact local C0 commit is clean and ready for maintainer push. No remote ref, tag, Release, non-zero sealed
  bootstrap, Cloud PASS, C1 or later lifecycle state is created locally.

## Stop conditions

- Stop on any package/contract/manifest/predecessor/ZIP/bootstrap identity drift.
- Stop if local results cannot distinguish a product defect, test defect, platform limitation or fixture drift.
- Stop if any required Linux/Cloud FULL evidence is unavailable locally; route it to Cloud rather than substituting
  Windows evidence.
- Stop before C1 unless the maintainer returns explicit first-channel PASS bound to the exact C0 and candidate ZIP.
- Stop before tag/publication unless C1 is complete and the maintainer separately performs the remote operations.
- Stop on dirty or mismatched remote/Cloud source, missing final exit code, model-authored Cloud repairs, or any
  attempt to treat partial output as PASS.
- Stop and ask if unrelated/overlapping worktree changes appear.

## Errors

| Error | Resolution |
|---|---|
| Focused architecture suite initially reported 3 failures because the Phase 5 status cell contained both `active` and `PENDING`. | Classified as a documentation fixture ambiguity; retain the single Phase lifecycle state `active` and express the Release gate as “approved, not yet executed”, then rerun the focused suite. |
| First Source/Candidate Cloud attempt observed only `A/D/R`, not the expected `A/D/M/R`, in the G2 delta-shape fixture. | Classified as a test-fixture defect: `update-index --chmod=+x` ran before helper `commit()` called `git add -A`, so Linux `core.filemode=true` restored the worktree's `0644`. Do not write C1; stage A/D/R first, set the index mode second, assert `100755`, and commit the already-staged index. |
| First formal asset-materialization attempt failed with Windows `[WinError 5]` on its system temporary directory inside the restricted sandbox. | No partial `dist/` assets were created. Reran the same canonical command outside the sandbox under the approved materializer prefix; first run created both exact assets and the second returned `unchanged`. |
| Initial C1 focused governance run failed five assertions after the lifecycle writeback. | Four failures came from omitting the parseable `Product Phase 5` marker in the current-train table; one assertion did not allow the intentional line wrap. Restored the marker, bounded the multiline assertion and reran 51/51 PASS. |
| First formal-bootstrap syntax command used the nonexistent `C:` Git Bash path. | Resolved the installed executable with `Get-Command bash` (`D:\Program Files\Git\bin\bash.exe`) and reran `bash -n` successfully. |
| Initial active-plan recovery command passed three positional arguments to this PowerShell version's `Join-Path`. | The active slug was recovered successfully, but the three file reads failed. Use one interpolated `.planning/$active/<file>` path per read instead of repeating the unsupported positional form. |
| The browser connector returned no usable result for the GitHub Release page/search and then reported the Release API URL inaccessible. | Do not repeat the same browser route. Use one bounded local read-only GitHub CLI/API query if available; if metadata still cannot be established, retain Latest/C2 as pending rather than infer promotion from Published Cloud PASS. |
| First Published-checkpoint governance run passed 44/47; three architecture cases parsed both `active` and English `pending` from the Phase 5 status cell. | Preserve the single Phase lifecycle state `active` and reword only the Release sub-gate as Chinese `Latest尚待确认`, then rerun the same focused suite. |
| A targeted PowerShell test-source view failed before reading files because its double-quoted `rg` pattern was not terminated. | No repository data changed; split the search from the line-range read and use literal single-quoted patterns. |
| First C2 focused run was blocked in the restricted sandbox by Node test-runner `spawn EPERM`; the approved outside-sandbox rerun passed 58/63. | Classified the five real failures as pre-C2 naming/route fixtures: duplicate exact guide anchor, `candidate`-only pointer wording, two hardcoded accepted evidence filenames, and accepted-doc inventory. Generalize only those lifecycle assertions and rerun. |
