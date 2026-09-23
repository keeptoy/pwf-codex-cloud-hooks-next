# Task Plan: Phase 5.1 B4c DESIGN authority checks

## Goal

Make DESIGN ownership tests reject misplaced current-state declarations while permitting equivalent pointers to the true owner, without weakening version or Release identity boundaries.

## Authorization and scope

- Maintainer said “继续” after B4b local commit `daa2fc5`; the last handoff identified DESIGN's duplicate broad bans as the next bounded candidate.
- Allowed: coordinated governance assertions and in-memory probes in `tests/architecture-contracts.test.js` and `tests/repository-boundary.test.js`, plus this scoped planning.
- Not allowed: production/contracts, macro-document body rewrites, Release/Cloud/remote actions, or unrelated R36/R38 retirements.

## Current phase

Phase 3: local checks and exact diff passed; create the scoped local commit.

## Next Step

After B4c commit, map another remaining R36 ban to its unique owner and independent failure consequence before proposing further retirement.

## Phases

1. [x] Confirm owner and full duplicate-check graph for DESIGN current-state language.
2. [x] Implement the smallest coordinated assertion change with harmful/harmless probes.
3. [x] Run focused and full local regression, review exact diff, and create one scoped local commit.

## Stop conditions

- If a broad ban protects a distinct identity or authorization risk, keep it unchanged.
- A false current rollback/Latest declaration in DESIGN must still fail; a pointer explaining that ROADMAP owns it should pass.
- Leave ARCHITECTURE and AGENTS bans unchanged unless the DESIGN-only change cannot be safely isolated; then stop and report.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| Expected failing-first DESIGN probe: helper accepted `## GitHub \`Latest\`` | 1 | Extend only the DESIGN owner guard, then rerun all probes. |
