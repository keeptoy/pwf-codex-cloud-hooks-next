# Task Plan: Phase 5.1 B2c planning deletion consent

## Goal

Replace only R13's exact Guide/ROADMAP planning-deletion sentences with owner-section, link and no-automatic-delete relationship checks. Prove harmful deletion permission fails while equivalent explanations pass. Keep the active-scope validator and completed-scope retention fixture.

## Authorization

- The maintainer said “继续” after the bounded A07 handoff. Treat this as authorization for the next B2 group, R13 only.
- Allowed: the nearest R13 assertions and in-memory probes in `tests/repository-boundary.test.js`, scoped planning, and minimal owner-document repair only if a real defect appears.
- Not allowed: R17, A08/R16 changes, actual planning deletion, production/contracts, Cloud/Release/remote writes, or frozen Discovery rewrite.

## Current phase

Completed locally: R13 now tests the Guide owner section, ROADMAP Release-checkpoint route and explicit no-auto-delete relationship. No planning scope or owner document was deleted or rewritten.

## Next Step

Hand off this bounded R13 result. R17 remains the next B2 group and requires separate scope/authorization.

## Phases

1. [x] Recover clean baseline and read entry docs, active plan, R13 inventory/test and owner sections.
2. [x] Replace R13 wording checks with owner-link/consent relation and harmful/harmless probes.
3. [x] Run focused/full local regression, inspect exact diff and commit one local scope if clean.

## Stop conditions

- No pointer switch, C0/C2, Release retirement review, Git recovery point or completion state may automatically authorize deletion of `.planning/` scopes.
- Maintenance decision and full-scope preservation remain explicit; do not remove any planning files in this gate.
- R17 and other adjacent template assertions remain untouched.
