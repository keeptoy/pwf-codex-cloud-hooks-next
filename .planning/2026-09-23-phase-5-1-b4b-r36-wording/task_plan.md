# Task Plan: Phase 5.1 B4b R36 wording boundaries

## Goal

Replace a safe subset of remaining R36 whole-document wording bans with checks for misplaced authority, while preserving current/cold version roles and Release identity.

## Authorization

- Maintainer said “继续” after B4/R36a local commit `419b836`.
- Allowed: scoped planning and nearest R36 assertions/probes in `tests/repository-boundary.test.js`.
- Not allowed: macro-document content rewrites, production/contracts, Release/Cloud/remote actions, R35/R38 retirement, or weakening unpublished-candidate/publication boundaries.

## Current phase

The bounded B4b Next Step authority-shape subset is implemented and verified locally.

## Next Step

After the scoped B4b commit, map one remaining R36 prohibition to its owner and cross-file duplicate checks before proposing another bounded gate. Do not retire those bans within B4b.

## Phases

1. [x] Recover B4/R36a baseline and classify each remaining whole-document prohibition by owner and failure consequence.
2. [x] Implement only a narrow owner-specific replacement with harmful/harmless probes; defer ambiguous bans.
3. [x] Run focused/full local checks and review the exact R36b diff; create one scoped local commit.

## Stop conditions

- Do not permit a second current lifecycle or Next Step authority outside ROADMAP/activity planning.
- Do not permit exact Release identity or acceptance state to migrate into CHANGELOG or architecture docs.
- If a broad ban cannot be replaced with equivalent evidence, leave it unchanged.
