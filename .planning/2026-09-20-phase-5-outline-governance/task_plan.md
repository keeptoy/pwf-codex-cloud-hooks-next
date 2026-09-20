# Task Plan: Make Phase 5 overview outline-only

## Goal

Correct the Phase 5 documentation lifecycle so `docs/product-phases/phase-5.md` remains a concise Product outline, detailed work logs stay in planning scopes, and only the maintainer decides whether to distill completed planning into `docs/history/phase-5.x-*.md` before periodic planning deletion.

## Authorization

- The maintainer explicitly superseded the previous active-ledger model.
- Update Phase 5 overview, ROADMAP, Product Phase/history governance, tests, changelog, and planning evidence as needed for one coherent correction.
- Retain existing planning scopes; do not create Phase 5 history records or delete completed planning.
- No runtime, contract, installer, Release identity, published evidence, or remote changes.

## Next Step

None. The outline-only governance correction is complete; future history extraction or planning deletion requires an explicit maintainer decision.

## Current Phase

Complete

## Phases

### Phase 1: Recover affected surfaces

- [x] Locate active-ledger and automatic-distillation language in current authorities and tests.
- [x] Separate outline content from detailed planning evidence in `phase-5.md`.
- [x] Freeze maintainer-owned history promotion and pre-deletion review semantics.
- **Status:** complete

### Phase 2: Implement outline-only governance

- [x] Remove the working-ledger model from `phase-5.md` and retain only the durable activation outline.
- [x] Update ROADMAP/index/template/history/governance/changelog wording consistently.
- [x] Replace tests with outline/planning/maintainer-history assertions.
- **Status:** complete

### Phase 3: Validate and commit

- [x] Run focused documentation/governance tests.
- [x] Run complete regression, syntax, LF, and diff checks.
- [x] Record evidence and create one scoped local commit.
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| `phase-5.md` is outline-only | Maintainer clarified that detailed流水 already belongs to planning. |
| History promotion is maintainer-owned | Completed planning is periodically deleted by the maintainer, who decides whether durable Phase 5 history is warranted first. |
| No Phase 5 history file now | The maintainer requested a governance correction, not immediate history extraction. |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Multi-file governance patch failed because one long Phase 5 context block contained a malformed expected line | 1 | No file was changed; split the correction into smaller, exact patches and re-read only the affected Phase 5 block. |
| Focused rerun left one brittle autonomous LF prose assertion failing | 1 | Kept the same semantic contract while allowing explanatory words between `nonce/attestation`, `exact`, and single `LF`; focused suite then passed 27/27. |
| Initial LF checker used PowerShell 7-only `Get-Content -AsByteStream`; Windows PowerShell reported parameter errors while the script misleadingly exited zero | 1 | Discarded the result and reran the byte check with `[IO.File]::ReadAllBytes`, which is supported in this environment. |
| First exact-path `git add` could not create `.git/index.lock` inside the filesystem sandbox | 1 | Retry the same bounded staging command with repository-metadata write approval. |

## Stop Conditions

- Stop before deleting any planning scope or creating a `phase-5.x` history record.
- Stop before making history extraction automatic or agent-owned.
- Do not alter Product/runtime/Release behavior.
