# Task Plan: Phase 5.3 G3 evidence plan and projection

## Goal

Extend the completed G2 advisory into a deterministic required-evidence plan and an idempotent minimal projection
for existing task-plan/operator-guide documents, without creating a competing authority or enabling any reduced
Release lane.

## Authorization and scope

- The maintainer explicitly authorized “继续 G3” after G2 commit
  `43972e60633f0d2f0876a8273923271e1fd0836d` completed exact identity closure and replay.
- Allowed: read current Release/evidence authorities and historical fixtures; design and implement a source-only
  evidence-plan/projection tool or bounded classifier evolution; add fixtures/tests; update G3 planning and stable
  Phase 5.3 status; run local validation; create scoped local commits.
- Not allowed: execute Cloud/Release, generate C0 or assets, change package/manifest/runtime/Release contracts or
  bootstrap bytes, delete C1/C2, alter current ROADMAP Release flow, start G4/G5, enable reduced lanes, or perform
  any remote write.

## Current phase

G3 complete. The V3 evidence plan and bounded projector satisfy the frozen exit conditions; reduced lanes remain
shadow-only and no Cloud/Release action was executed.

## Next Step

Stop. G4 requires a future genuinely eligible low-risk train plus separate maintainer authorization; the current
v0.5 train and local G3 results cannot be used as its shadow sample.

## Phases

1. [x] Recover G3 requirements and current evidence/projection authorities.
2. [x] Freeze lane-to-evidence mapping, machine result schema, markers and fail-closed/idempotence rules.
3. [x] Add failing evidence-plan and projection tests, including drift/unknown/second-run cases.
4. [x] Implement deterministic planning and bounded projection.
5. [x] Prove byte-stable reruns, no competing authority, C1/C2 preservation and missing-input escalation.
6. [x] Run focused/full regression, reconcile stable G3 status and create scoped local commit(s).

## G3 exit conditions

- Every G2 lane maps to an explicit minimum local/Linux/Cloud/retirement evidence plan; unknown or incomplete
  input escalates rather than reducing evidence.
- Projection updates only one bounded generated block in an existing task plan/operator guide and preserves all
  human-authored bytes outside that block.
- First projection is deterministic; a second identical projection is byte-for-byte unchanged. Conflicting or
  malformed markers fail closed without partial writes.
- The projection references existing authorities and does not become a new Release, Cloud or programme source.
- C1/C2 and both Release identity channels remain explicit; G3 does not execute or authorize any gate.
- Current Release inputs, Cloud/remote state and G4/G5 authorization remain unchanged.

## Invariants

- Advisory planning is separate from execution and acceptance; generated requirements never claim PASS.
- Missing base/head, invalid V2 advisory identity, unknown owner/evidence or projection drift selects the full
  evidence plan or stops safely.
- Existing task-plan/operator-guide lifecycle and human fields remain owned by their current authorities.
- Tests/policy/projector self-change cannot lower its own evidence requirements.
- User changes are preserved and commits exclude unrelated paths.

## Stop conditions

- Stop if projection requires rewriting current ROADMAP flow, Release contracts or acceptance authorities.
- Stop if no unique bounded insertion/replacement seam exists in current task plan/operator guide formats.
- Stop if idempotence would require parsing or normalizing human prose outside explicit markers.
- Stop if a lane mapping would skip either identity channel, remove C1/C2, or infer live PASS from local data.
- Stop if overlapping user changes cannot be safely separated.

## Errors

| Error | Resolution |
|---|---|
