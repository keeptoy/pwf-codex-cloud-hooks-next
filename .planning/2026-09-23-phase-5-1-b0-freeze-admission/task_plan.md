# Task Plan: Phase 5.1 B0 frozen Discovery admission

## Goal

Close the formally approved Phase 5.1 document-test governance Discovery as one self-contained `FROZEN_DISCOVERY_RECORD`, register it in the history index, and replace only the brittle fixed-11 history admission assertion with a role/index structural guard.

## Authorization

- The maintainer answered “好的，继续” to the explicit B0 request: freeze the record, index it, and correct the history-role/count test atomically.
- This gate may edit the Phase 5.1 draft, `docs/history/README.md`, the nearest history-admission test in `tests/repository-boundary.test.js`, and this planning scope.
- It does not authorize B1–B4, other R28 implementation, the 17 DEFER groups, executable Cloud/Release protocols, production, machine contracts, or remote writes.

## Current phase

Completed locally: frozen record, history admission guard, exact-source verification, focused/full regression and diff review. No Cloud or remote action.

## Next Step

No further B0 implementation. Obtain a separate scoped authorization before the first B1 group or any B2–B4/DEFER gate.

## Phases

1. [x] Recover source, history-role protocol, draft, index and exact test seam.
2. [x] Add a narrow role/index structural guard with negative/positive probes; freeze a self-contained decision and register it atomically.
3. [x] Run focused/full local regression, validate links/diff/source evidence, commit locally and report remaining gates.

## Stop conditions

- If a frozen record cannot independently explain the decision or cite an exact pre-freeze source, keep it open and report the missing evidence.
- The index guard must fail on missing/duplicate/unindexed frozen records, wrong role, or mismatched count, and allow harmless wording changes outside structured fields.
- Do not use fixed historical totals or regex windows as the new authority; derive identity from indexed rows and files.
- Do not change the underlying Cloud/Release commands, accepted assets, production, or any B1–B4 assertion.

## Errors encountered

| Error | Context | Resolution |
|---|---|---|
| `rg docs/history/*.md` failed under PowerShell path handling | Role-marker inventory | Switched to `rg ... docs/history -g '*.md'` and continued. |
| First targeted B0 run after freeze failed on a negative-probe message | Removing a row violated the aggregate-count invariant before the unindexed-file invariant | Accept the earlier specific failure as valid detection; widen only the expected diagnostic, not the guard. |
