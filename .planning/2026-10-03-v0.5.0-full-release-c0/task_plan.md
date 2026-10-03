# Task Plan: v0.5.0 FULL Release C0 and Source/Candidate handoff

## Goal

Enter the existing FULL Release workflow for `v0.5.0`, freeze an exact local C0 Source/Candidate checkout with its
operator guide and deterministic zero-hash candidate assets, and hand the immutable source identity to the
maintainer for push and the first Cloud channel.

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

## Current phase

Phase 5R complete at this commit: the portable Git-mode fixture is repaired and the replacement local C0 is frozen.

## Next Step

Maintainer fast-forwards branch `0.5.0` to the replacement `SOURCE_CANDIDATE_HEAD`, verifies remote equality, then
runs a Fresh Source/Candidate A--F channel and returns complete raw evidence plus final exit codes.

## Phases

1. [x] Recover current authorities, accepted predecessor, Release object inventory and exact C0 semantics.
2. [x] Freeze the v0.5.0 FULL operator guide, candidate admission preflight and stop conditions.
3. [x] Run focused/failing-first checks and reconcile any lifecycle test expectations.
4. [x] Run FULL local regression, deterministic ZIP double-build and candidate-bootstrap checks.
5. [x] Create and verify the exact local C0 commit, then hand off maintainer push and Source/Candidate Cloud steps.
5R. [x] Repair the Cloud-exposed mode fixture, revalidate, and create a replacement exact local C0.
6. [ ] After maintainer returns raw first-channel evidence, verify exact C0/asset identity and write C1 only on PASS.
7. [ ] After separately authorized immutable publication and second-channel evidence, close Latest/retirement/C2.

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
