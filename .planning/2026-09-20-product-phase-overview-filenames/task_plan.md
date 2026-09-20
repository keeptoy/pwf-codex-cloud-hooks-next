# Task Plan: Rename Product Phase overview files

## Goal

Rename the two Product Phase authorities to explicit `phase-4-overview.md` and `phase-5-overview.md` filenames, update every live repository reference and naming rule, preserve stable anchors, and leave no duplicate legacy-path stubs.

## Authorization

- The maintainer approved the proposed two-file rename and full link migration.
- Update current documents, link-maintenance-only references in historical documents, test inventories, changelog, and this planning scope.
- Keep document contents and stable anchors semantically unchanged except for filenames/naming guidance.
- Do not rewrite historical conclusions, create compatibility stubs, change Product/Release state, or perform remote actions.

## Next Step

None. Both overview files and all live references use the explicit names; validation is complete.

## Current Phase

Complete

## Phases

### Phase 1: Inventory rename surface

- [x] Enumerate both source files and every tracked old-path reference.
- [x] Confirm stable anchors and pre-1.0 compatibility policy permit a path-only rename.
- **Status:** complete

### Phase 2: Rename and migrate references

- [x] Rename both overview files while limiting content changes to filename-clarifying wording and the Phase 4 cross-link.
- [x] Update template naming, current/historical links, tests, and changelog.
- [x] Confirm no old live path or duplicate authority remains.
- **Status:** complete

### Phase 3: Validate and commit

- [x] Run focused and complete regression checks.
- [x] Run link, syntax, LF, diff, rename, and worktree checks.
- [x] Record evidence and create one scoped local commit.
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| Rename both Phase 4 and Phase 5 together | A mixed naming scheme would reduce rather than improve clarity. |
| Preserve `product-phase-N-overview` anchors | The authority identity remains stable while only its repository path changes. |
| Do not add redirect stubs | Pre-1.0 paths are not admitted as permanent compatibility contracts, and stubs would create duplicate authority surfaces. |
| Historical edits are link maintenance only | Updating a relative target does not alter the record's original conclusions or time semantics. |
| Preserve historical plain-text path facts | CHANGELOG/completed planning statements about filenames that existed then remain truthful and are not live link contracts. |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Initial anchor inventory used shell quoting that mangled the `rg` regex under Windows PowerShell | 1 | Discarded that subcommand and confirmed both exact anchors with `Select-String`. |
| First `apply_patch` rename attempt gave the Phase 4 move an empty hunk, which the patch engine rejects | 1 | No source file changed; retry both moves with a small filename-clarifying text hunk in each file. |
| First focused run passed 24/27; three test-owned old-path patterns were escaped or embedded in a filename classifier and evaded the plain-text reverse scan | 1 | Updated the two escaped ROADMAP path assertions, the overview filename classifier, and the history-template path assertion; broaden the final scan to escaped patterns. |
| Broadened reverse scan printed only the classified CHANGELOG hit but inherited `rg`'s final no-match exit code 1 | 1 | Content result is valid; add an explicit successful exit to the final evidence scan instead of treating no matches as failure. |

## Stop Conditions

- Stop if any immutable published asset or historical source identity would be rewritten.
- Stop before changing anchors, Phase content, Product authorization, or Release state.
