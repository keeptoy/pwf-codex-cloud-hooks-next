# Task Plan: Open Phase 5.1 document-test governance Discovery draft

## Goal

Create an explicitly open Phase 5.1 history draft that internalizes the maintainer-provided rough scan and Discovery plan, register it without counting it as a frozen history record, and add only a concise rough-scan/Discovery outline entry to the Phase 5 Product overview.

## Authorization

- The maintainer explicitly requested a Phase 5.1 draft under `docs/history/` and supplied the planning content to internalize.
- Update the history index, Phase 5 overview, changelog, structural tests if required, and this planning scope.
- The draft may describe the rough scan, classification model, candidate principle, bounded first round, exit conditions, and stop rules.
- Do not perform the assertion-by-assertion inventory, classify individual assertions, select or implement a representative convergence patch, bulk-delete tests, or change runtime/Cloud/Release behavior.
- Do not present the draft as a closed `FROZEN_DISCOVERY_RECORD`; freezing and implementation require later maintainer decisions.

## Next Step

None. The Phase 5.1 Discovery draft is open, unindexed, and bounded; no assertion inventory or implementation is authorized until the maintainer continues the round.

## Current Phase

Complete

## Phases

### Phase 1: Recover and define draft semantics

- [x] Re-read repository authorities, current planning context, history template/index, and Phase 5 overview.
- [x] Confirm the supplied counts/hotspots against current test sources without starting the full Discovery inventory.
- [x] Define draft status, filename, anchors, index treatment, overview summary, and non-goals.
- **Status:** complete

### Phase 2: Materialize the Phase 5.1 draft

- [x] Add the unfreezed Phase 5.1 Discovery draft with the supplied planning content.
- [x] Keep it unindexed and outside frozen role counts; update the changelog without adding a third history entrance.
- [x] Add only a concise Phase 5 overview outline entry.
- [x] Update only stable structural tests required by the new draft boundary; no new prose assertion was needed.
- **Status:** complete

### Phase 3: Validate and commit

- [x] Run focused governance/link checks and the complete regression suite.
- [x] Run syntax, LF, diff, and worktree checks.
- [x] Create one scoped local commit without remote writes.
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| Use an explicit open draft, not a frozen record | The maintainer wants the future Phase 5.1 record started now, but the Discovery round has not yet performed its inventory or reached a closure decision. |
| Keep the draft out of frozen role counts | `FROZEN_DISCOVERY_RECORD` remains a closed-round identity; a draft must not inflate historical completion counts. |
| Keep the overview to one outline row | The Product overview owns milestones, not the detailed scan, classification matrix, or Discovery procedure. |
| Keep the draft unindexed until closeout | The index catalogs admitted frozen objects; listing an open draft there would blur the exact role/count semantics the Discovery is intended to protect. |
| Preserve both rough-scan and current counts | 572 is the supplied scan snapshot; 571 is the current opening baseline after Phase 5.0 removed one duplicate assertion. Neither count becomes a stable test contract. |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|

## Stop Conditions

- Stop before classifying individual assertion groups or changing their behavior.
- Stop if the draft would claim Discovery closure, implementation authorization, Cloud/Release evidence, or a new Product Phase.
- Stop before any remote write.
