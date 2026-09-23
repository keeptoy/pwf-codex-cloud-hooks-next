# Task Plan: Phase 5.1 B4h CHANGELOG migration label

## Goal

Determine whether R36's whole-document ban on the retired “Successor 迁移来源链” label in CHANGELOG can be narrowed to actual old-authority declarations while preserving ordinary historical explanation.

## Authorization and scope

- Maintainer said “继续” after B4g local commit `47afeac`; B4g's Next Step is to map one remaining R36 ban by owner and failure consequence.
- Audit first. If justified, change only the CHANGELOG old-migration-label alternative and in-memory probes in `tests/repository-boundary.test.js`, plus scoped planning.
- Do not change macro documents, production/contracts, Release/Cloud/remote, exact publication/acceptance checks, or unrelated R36/R35/R38 bans.

## Current phase

Phase 3: focused/full checks and diff review complete; create the scoped local commit.

## Next Step

After B4h commit, map one remaining R36 ban by owner and failure consequence; preserve count, identity and role-neutrality guards until separate evidence justifies changes.

## Phases

1. [x] Map owner, duplicate checks and the historical failure shape.
2. [x] Replace only the broad label ban with harmful/harmless mutation probes.
3. [x] Run focused/full checks, inspect the exact diff and create one scoped local commit.

## Stop conditions

- CHANGELOG's current migration source must keep pointing to the exact provenance anchor.
- The retired label must not return as a section, status key or active source link.
- Plain historical explanation may mention the retired label without being treated as a second authority.
- If owner or equivalent protection remains ambiguous, preserve the broad ban and request direction.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| `git show d801ee7^:CHANGELOG.md` failed because that file did not exist in the parent tree | 1 | Inspect the commit contents and later CHANGELOG change directly; do not repeat the absent-parent lookup. |
| Expected failing-first harmless “旧称” explanation failed under the original whole-document ban | 1 | Narrowed the guard to source-declaration shapes while keeping the exact current provenance link requirement. |
