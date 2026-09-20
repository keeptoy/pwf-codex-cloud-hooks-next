# Task Plan: Remove prose-only Phase overview tests

## Goal

Keep Product Phase overview governance in the human-facing template and remove Phase 5-specific JavaScript assertions that freeze headings, prose, legacy terms, or the temporary absence of future history files.

## Authorization

- The maintainer approved the proposed correction after reviewing the distinction between machine-verifiable boundaries and prose policy.
- Update the Product Phase overview template if needed, remove only redundant Phase 5 prose/state assertions, validate, and create one scoped local commit.
- Do not weaken generic link, anchor, planning-pointer, runtime, Release, or trust-boundary tests.
- Do not create or delete history/planning records other than this active planning scope.

## Next Step

None. The prose-only assertions are removed, the template owns the explicit rule, and all validation is complete.

## Current Phase

Complete

## Phases

### Phase 1: Audit test ownership

- [x] Read required repository authorities and relevant test helpers/context.
- [x] Classify assertions as machine-verifiable structure or prose/temporal governance.
- **Status:** complete

### Phase 2: Implement narrow correction

- [x] Make the template wording sufficient as the human authority.
- [x] Remove redundant Phase 5-specific prose and temporal assertions.
- **Status:** complete

### Phase 3: Validate and commit

- [x] Run focused and full regression checks.
- [x] Run syntax, LF, diff, and worktree checks.
- [x] Record evidence and create one scoped local commit.
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| Do not test wording as behavior | Regex presence/absence cannot enforce maintainer authorization and makes harmless prose edits fail. |
| Preserve generic machine checks | Stable links, anchors, active-plan selection, and other executable repository boundaries remain useful. |
| Keep Phase 5 role/version metadata checks | These are structured identity declarations rather than mutable prose or temporal history state. |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|

## Stop Conditions

- Stop before removing generic structural or safety assertions unrelated to Phase 5 prose policy.
- Stop before changing runtime, installer, contract, Release, or remote state.
