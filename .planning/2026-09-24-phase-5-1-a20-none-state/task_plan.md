# Task Plan: A20 no-development-train state

## Goal

Define and verify the ROADMAP `NONE` state without changing the currently active Phase 5 train. Preserve the active-train checks, completed Phase routes, accepted/fallback evidence, and future-Phase safety assertions.

## Authorization and scope

- Maintainer accepted the discussed A20 route: `NONE` means no approved development train; use an in-memory state fixture with harmful-fail/harmless-pass probes.
- Maintainer subsequently authorized a planning-only KEEP/DEFER classification of A20-adjacent residuals, without bulk test edits or a Phase 5.1 acceptance claim.
- Allowed: ROADMAP §5.1 state-rule clarification, nearest `tests/architecture-contracts.test.js` route/identity checks, and this planning record.
- Not allowed: actually rotate the current train, alter Product Phase 6–9/Release/trust assertions, change production/contracts, or perform Cloud/remote writes.

## Current phase

Completed locally: the A20 `NONE` state rule and in-memory governance probes passed full Windows regression; the cross-owner residuals are now explicitly classified KEEP/DEFER in findings. This is not an actual programme rotation or complete A20/Phase 5.1 closeout.

## Next Step

Hand off the bounded A20 route result and KEEP/DEFER ledger to a **separate Phase 5.1 B0–B4 overall reconciliation**. Do not start another A20 batch by default. A real no-next-train transition later requires independently evidenced Product Phase closeout, actual ROADMAP/overview-index/current-snapshot updates and full verification; Release closeout alone does not authorize it.

## Phases

1. [x] Recover current authority, baseline, and affected assertions.
2. [x] Clarify the `NONE` route rule and implement scoped relational tests.
3. [x] Run tests, inspect diff, and create one local commit.
4. [x] Classify A20-adjacent cross-owner assertions as KEEP now / DEFER redesign in planning only; leave all assertions unchanged.

## Stop conditions

- Current active Phase 5 state must keep its exact candidate/package and overview-pointer checks.
- `NONE` may not retain stale current-train or Phase-overview pointers or silently activate a future Phase.
- Completed Phase overview routes and accepted-version evidence remain reachable and verified.
- If existing guards require an unapproved change to release-train/Product-Phase coupling, stop at the boundary and report it.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| Node test runner `spawn EPERM` in Windows sandbox | 1 | Re-ran focused test with escalated process permission; 18/18 passed before final probe addition. |
| Repository guard rejected frozen version literals in synthetic fixture | 1 | Derived roles and Phase rows from current ROADMAP/index; full Windows suite then passed. |
