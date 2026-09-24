# Task Plan: Phase 5.1 B0–B4 closeout audit

## Goal

Reconcile the frozen Phase 5.1 Discovery route and exit conditions with completed B0–B4 local gates, test evidence, and explicit KEEP/DEFER boundaries; identify the next separately authorized gate without implying Cloud, Release or whole-Phase acceptance.

## Authorization and scope

- Maintainer said “继续” after the independent Phase 4.8 R29 retirement commit and the proposed overall B0–B4 / KEEP–DEFER review.
- After the audit found a stale current Product summary, the maintainer explicitly authorized a minimal Phase 5 Overview row correction and completing this audit.
- Allowed: read-only repository/history/test audit, that one Phase 5 Overview summary row, scoped planning record, proportionate local verification and one local commit.
- Not allowed: changing frozen Discovery, other Product/ROADMAP roles, production/tests, acceptance, Cloud/Release state or remote refs in this audit.

## Current phase

Completed locally: the B0–B4 authorized subset is reconciled, the stale Phase 5 Product summary is corrected, and focused/full Windows regression passed. KEEP/DEFER and external acceptance remain outside this verdict.

## Next Step

Hand off `B0_B4_LOCAL_RECONCILED`. The maintainer may separately choose an owner-specific DEFER design gate or leave those assertions unchanged while planning Phase 5 closeout; no further gate, Cloud or Release work is authorized by this local audit.

## Phases

1. [x] Recover repository/active-plan authority and Phase 5.1 Discovery exit conditions.
2. [x] Cross-check B0–B4 local outcomes, tests and KEEP/DEFER inventory.
3. [x] Write a bounded closeout assessment, verify scope and create one local commit.

## Stop conditions

- Do not equate B4 local completion with Phase 5.1, Cloud, Product or Release PASS.
- Do not reopen intentionally deferred assertions merely to increase a retirement count.
- Any newly found substantive contradiction must be reported with evidence and proposed action before related files are changed.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| Bash-style brace list passed to PowerShell `rg` | 1 | Switched to `rg` over `.planning` with filters and direct directory reads. |
| Guessed A20 cross-domain planning directory did not exist | 1 | Read the actual A20 `NONE` plan, which contains the authorized residual disposition. |
| Phase 5 current overview still described Phase 5.1 as an open draft | 1 | Paused and reported evidence/impact; maintainer authorized one-row correction before commit. |
