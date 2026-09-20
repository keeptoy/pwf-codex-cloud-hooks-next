# Task Plan: Create Phase 5.0 history capsule

## Goal

Create a concise Phase 5.0 retrospective capsule distilled from the completed `v0.5.0-dev` entries in `CHANGELOG.md`, update the history index and any stable structural checks, and keep assertion rough-screening and Discovery out of this record for a future Phase 5.1 history record.

## Authorization

- The maintainer explicitly requested creation of the Phase 5.0 history record.
- Use only completed `v0.5.0-dev` changes as its substantive source.
- Update the history index, changelog, tests, and planning records only where required by the new record.
- Do not create Phase 5.1, record rough-screening or Discovery conclusions, change Product/Release state, or perform remote actions.

## Next Step

None. Phase 5.0 is recorded and indexed; validation is complete. Assertion rough-screening and Discovery remain outside this scope for a future maintainer-approved Phase 5.1 round.

## Current Phase

Complete

## Phases

### Phase 1: Recover and define the record boundary

- [x] Re-read repository authorities and the active planning context.
- [x] Inspect the history schema, index, representative capsule, `v0.5.0-dev` changelog, and relevant commits.
- [x] Decide filename, stable anchor, role, index placement, evidence, and explicit exclusions.
- **Status:** complete

### Phase 2: Create and integrate Phase 5.0

- [x] Add the Phase 5.0 retrospective capsule.
- [x] Update the history index and current changelog.
- [x] Update only stable structural tests or inventories required by the new record.
- **Status:** complete

### Phase 3: Validate and commit

- [x] Run focused history/document tests and complete regression checks.
- [x] Run link, syntax, LF, diff, and worktree checks.
- [x] Record evidence and create one scoped local commit.
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| Use `RETROSPECTIVE_CAPSULE` | Phase 5.0 summarizes a completed documentation-governance tranche rather than preserving raw Discovery evidence. |
| Reserve rough-screening and Discovery for Phase 5.1 | The maintainer explicitly separated those later activities from the Phase 5.0 changelog-derived capsule. |
| Treat Phase 5.0 as a closed tranche, not Product Phase closeout | The completed changelog set is history-worthy while the Phase 5 overview still correctly says the Product Phase remains active. |
| Reuse only the existing role/count structural assertion | This preserves a machine-checkable index classification without freezing the new capsule's prose or current-state wording. |
| Remove the Phase 4.17 test's duplicate global count | Global role/count ownership already exists in the history-index governance test; a Phase-specific test must not freeze a repository-wide time-varying total. |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Initial PowerShell active-plan path construction retained the pointer file's newline and produced an illegal path | 1 | Re-read the pointer with `.Trim()`; no repository file was changed by the failed read. |
| `node --test tests/repository-boundary.test.js` could not spawn its isolated child on Windows (`spawn EPERM`) | 1 | Treat as a platform runner limitation and rerun the same test file directly with `node`, which executes its `node:test` cases in-process. |
| Direct in-process focused run let 10 cases execute but seven Git-backed cases still hit blocked nested process creation; it also found one real stale Phase 4.17 assertion freezing the old global history count at 17 | 1 | Remove the redundant Phase-specific global-count assertion; keep the single global role/count structural assertion and rerun in an execution context that permits test child processes. |
| Git Bash syntax checks could not create a signal pipe in the restricted Windows sandbox (`Win32 error 5`) | 1 | Rerun only the Bash syntax check outside the restricted process sandbox; repeat the other baseline commands separately because the parallel wrapper did not return their results. |
| Initial exact-path `git add` could not create `.git/index.lock` under the workspace sandbox | 1 | No index change occurred; rerun the same exact-path staging command with Git metadata write permission. |

## Stop Conditions

- Stop if the record would need to claim unfinished Discovery, Cloud acceptance, Release promotion, or a changed Product authorization state.
- Stop before creating Phase 5.1 or performing any remote action.
