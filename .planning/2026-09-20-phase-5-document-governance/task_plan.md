# Task Plan: Establish Product Phase 5 authority

## Goal

Formally enter the Product Phase 5 documentation-governance stage by creating `docs/product-phases/phase-5.md` as the current working authority and narrative ledger, wiring it into the current development train, and preserving a clear future extraction path into `docs/history/phase-5.x-*.md` summaries.

## Authorization

- The maintainer explicitly authorized creation of `docs/product-phases/phase-5.md` and use of that file for the current Phase 5 running record.
- Update the minimum roadmap/document-map/test surfaces required to make Phase 5 the real current authority.
- Retain completed planning scopes; do not delete history or create Phase 5 history files prematurely.
- No runtime, contract, installer, Release identity, published evidence, or remote changes.

## Next Step

No further local implementation action. The completed Phase 5 authority commit is ready for maintainer review and any later remote push.

## Current Phase

Complete

## Phases

### Phase 1: Recover authority and conventions

- [x] Read ROADMAP section 4 and its Phase 5 references.
- [x] Compare existing `docs/product-phases/phase-*.md` structures and history naming/anchors.
- [x] Inspect README document map and governance tests for required links and invariants.
- **Status:** complete

### Phase 2: Establish Phase 5 authority

- [x] Create `docs/product-phases/phase-5.md` with stable anchors, scope, current ledger, and future history-extraction rule.
- [x] Update ROADMAP and any unique authority map needed to enter Phase 5 without duplicating lifecycle truth.
- [x] Add or adjust governance tests if the new authority boundary is not already covered.
- **Status:** complete

### Phase 3: Validate and commit

- [x] Run focused documentation/governance tests and link checks.
- [x] Run the risk-proportionate repository baseline and `git diff --check`.
- [x] Record evidence and create a scoped local commit.
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| `phase-5.md` starts as the active detailed ledger | The maintainer explicitly wants details recorded there until volume justifies extraction. |
| Future `phase-5.x` history files are deferred | Empty or speculative history documents would create duplicate authority before there is material to summarize. |
| Completed planning scopes remain | Repository policy makes retirement a maintainer decision; this task does not authorize deletion. |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Failing-first governance run reported three missing-file failures | 1 | Expected red state: positive tests referenced `phase-5.md` before it existed; created the authority transaction. |
| First post-document focused run found two stale exact inventories and one overly strict wording expectation | 1 | Added Phase 5 to the duplicate-anchor and overview-path inventories, and aligned ROADMAP wording to the intended explicit “不授权Product实现” boundary. |
| Second focused run had one heading-capitalization mismatch (`Activation` vs `activation`) | 1 | Made the semantic assertion case-insensitive; document structure and all other governance checks already passed. |
| Third focused run showed the combined prose regex still required the nonexistent literal phrase `exact LF` | 1 | Replaced the broad sentence-order regex with three structural assertions for the ledger heading, activation-baseline heading, and exact nonce/attestation LF ledger row. |
| Full suite recreated ignored `tools/__pycache__` | 1 | Verified the exact path remained inside the repository, removed only the regenerable bytecode cache after validation, and confirmed no runtime cache exists. |

## Stop Conditions

- Stop before inventing Phase 5 product implementation gates not supported by current repository evidence.
- Stop before changing runtime/ABI/trusted graph/Release identities or published history.
- Keep one current lifecycle authority and avoid a third macro history entrance.
