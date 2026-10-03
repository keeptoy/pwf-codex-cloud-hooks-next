# Task Plan: Phase 5.3 G1 advisory classifier foundation

## Goal

Implement and validate the Phase 5.3 G1 read-only advisory classifier foundation. The classifier must compare an
explicit Git base and head, preserve path/type/mode evidence, classify only from repository-owned policy, and
fail closed to `PRODUCT_OR_SECURITY` whenever ownership or evidence is unknown.

## Authorization and scope

- The maintainer said “继续” after the Phase 5.3 handoff explicitly identified G1 as the next separately
  authorized construction gate. This plan treats that instruction as authorization for G1 only.
- Allowed: inventory directly relevant source/contracts/tests; add a Release-excluded read-only classifier,
  explicit policy and historical/unit fixtures; update G1 planning and stable current documentation when needed;
  run proportionate local validation; create bounded local commits.
- Not allowed: G2 identity-closure normalization or replay completion, G3 evidence projection, G4 shadow
  execution, G5 enablement; version changes; mutation of Release inputs; C0/C1/C2, Cloud, seal, tag, publication,
  Latest, rollback or remote writes.
- The current Release workflow remains the sole authority. G1 output is advisory and may only preserve or
  escalate risk; it cannot select reduced Cloud/Release steps.

## Current phase

Completed locally: G1 provides a source-only read-only advisory classifier/policy with deterministic fail-closed
output, current/history replay evidence and full regression; no later Phase 5.3 gate or Release behavior changed.

## Next Step

Hand off the G1 implementation and validation. Starting G2 canonical identity closure/replay requires a new
explicit maintainer authorization and fresh active plan; G3～G5, reduced lanes, Cloud and Release remain unauthorized.

## Phases

1. [x] Recover G1 requirements; inventory existing tooling, policy authorities and test conventions.
2. [x] Freeze the G1 CLI/result/policy design, lifecycle ledger and nearest boundary tests.
3. [x] Add failing tests for explicit endpoints, Git delta fidelity, strict precedence and fail-closed cases.
4. [x] Implement the read-only advisory classifier and versioned machine output.
5. [x] Run focused and full regression; audit no workspace/Release mutation and no G2 behavior.
6. [x] Reconcile stable G1 status into the proper authority and create scoped local commit(s).

## G1 exit conditions

- Base and head are mandatory explicit commit-ish inputs and resolve to exact commits.
- Git delta preserves add/delete/rename plus old/new mode and object type evidence.
- Policy is repository-owned and classifier/policy self-change cannot classify itself below
  `PRODUCT_OR_SECURITY`.
- Unknown paths, unsafe object types, unresolved endpoints or incomplete evidence fail closed.
- Versioned deterministic JSON reports endpoints, path evidence, matched owners, reasons and advisory lane.
- Fixtures cover source-only governance, runtime/product, Release tooling and packaged documentation boundaries.
- The tool performs no Git/worktree/Release/remote writes and does not normalize canonical identity closure.

## Invariants

- Strict precedence remains `PRODUCT_OR_SECURITY > RELEASE_MECHANICS > PACKAGE_DOC_ONLY >
  SOURCE_ONLY_GOVERNANCE`.
- Any changed runtime, installer, schema, Host ABI, trusted graph, migration, path-safety or source-import owner
  selects `PRODUCT_OR_SECURITY`.
- Classification is advisory only; current FULL workflow and two identity channels remain unchanged.
- G1 does not interpret a version/hash cascade as canonical. Identity-related deltas that are not otherwise
  safely owned remain strict/unknown until G2.
- Tests may invalidate evidence but cannot lower a lane selected by product or Release owners.
- User changes must be preserved and commits must not include unrelated paths.

## Stop conditions

- Stop if implementation requires changing Host ABI, trusted graph, runtime bundle, Release allowlist or
  production dispatch.
- Stop before introducing identity-closure normalization, automated version writes or required-gate selection.
- Stop and return to Discovery if deterministic repository facts cannot classify an important owner without a
  maintainer assertion, or if a historical fixture would receive a false-fast lane.
- Stop if overlapping user changes cannot be safely separated.

## Errors

| Error | Resolution |
|---|---|
| Focused Node test was blocked in the Windows sandbox with `spawn EPERM` | Re-ran the identical read-only test with approved escalation. |
| Initial G1 boundary suite failed 0/6 because the classifier source did not yet exist | Expected red phase; implement only the frozen tool/policy seam, then rerun unchanged tests. |
| First implemented run passed 5/6; the unsafe-link fixture staged a synthetic symlink and then `git add -A` removed it because no worktree link existed | Split the fixture commit helper so synthetic index-only objects commit without restaging; product behavior was not weakened. |
| Git Bash bootstrap syntax check failed inside the sandbox with `couldn't create signal pipe, Win32 error 5` | Re-ran the same `bash -n` checks with approved escalation; all versioned bootstraps passed. |
