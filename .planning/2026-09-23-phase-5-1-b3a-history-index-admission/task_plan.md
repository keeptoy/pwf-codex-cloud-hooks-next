# Task Plan: Phase 5.1 B3a history index admission

## Goal

Complete the first bounded R28 follow-up: validate indexed history targets and explicit fragments against their records, remove one fixed role-count/narrative assertion already superseded by parsed membership, and prove harmful index drift fails while equivalent index explanation passes. Do not alter frozen history prose.

## Authorization

- The maintainer said “继续” after B2 R17 handoff. Treat this as authorization to start the first small B3 gate, R28 index admission only.
- Allowed: nearest R28 helper/assertions and probes in `tests/repository-boundary.test.js`, scoped planning; no history record edits unless a genuine link defect is found and separately assessed.
- Not allowed: R30/R04/R29/R31 retirement, R38/DEFER weakening, history body rewrites, production/contracts, Cloud/Release/remote writes or actual planning deletion.

## Current phase

Completed locally: index admission now checks explicit fragment scope and target existence; the fixed retrospective label/count assertion was removed. Frozen history files remain unchanged.

## Next Step

Hand off this bounded R28 index result. R28's broader owner prose and R30 per-record structure still need separate gates before R04/R29/R31 retirement.

## Phases

1. [x] Recover clean baseline, read B3 frozen order, R28 inventory, history index/template and nearest test seam.
2. [x] Add index/record/fragment relation and probes; retain role-sensitive prose that cannot yet be derived from old records.
3. [x] Run focused/full local regression, inspect exact diff and commit one local scope if clean.

## Stop conditions

- Every indexed record must exist; explicit fragment must resolve in that record, with no duplicate or orphan membership.
- Role summary totals must derive from index membership, not a frozen historical number.
- Older frozen records are not rewritten to add role metadata. R30 structure must precede any R04/R29/R31 prose retirement.
