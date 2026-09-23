# Task Plan: Phase 5.1 B4e provenance current-role language

## Goal

Allow provenance to point readers to ROADMAP's current-role authority while still rejecting any second source or lifecycle-role declaration in the immutable identity ledger.

## Authorization and scope

- Maintainer said “继续” after B4d local commit `13f7411`. The prior active plan's Next Step was to map one remaining R36 ban before proposing another bounded gate.
- Allowed: R36's provenance-only `当前源码权威|current lifecycle role` alternatives and matching in-memory probes in `tests/repository-boundary.test.js`, plus scoped planning.
- Not allowed: rewrite macro documents, alter production/contracts, Release/Cloud/remote, exact publication/acceptance checks, or retire unrelated R36/R35/R38 bans.

## Current phase

Phase 3: verification and diff review complete; create the scoped local commit.

## Next Step

After B4e commit, map one remaining R36 ban by owner and failure consequence; do not retire count, identity or old-migration bans without separate evidence.

## Phases

1. [x] Verify owner, duplicate checks and failure consequence for these two terms.
2. [x] Replace only the two whole-document alternatives with a narrow guard and mutation probes.
3. [x] Run focused/full local checks, review the exact diff and create one scoped local commit.

## Stop conditions

- Published ledger identity, acceptance links, SHA, role neutrality and counts remain guarded.
- A provenance statement naming the current source or lifecycle role must fail, whether heading, table row or direct prose.
- A pointer stating that current roles are in ROADMAP must pass. If both cannot be demonstrated, leave the broad ban unchanged.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| Expected failing-first harmless probe: `current lifecycle role is described in ROADMAP` failed under the value-agnostic direct regex | 1 | Permit an owner pointer only when the predicate names ROADMAP without a concrete source/version/role identity. |
| Expected harmful probe: `feature/foo，见 ROADMAP` slipped through a loose ROADMAP-presence exception | 1 | Require the asserted value itself to start as a ROADMAP pointer, not merely contain a later link. |
| Valid `ROADMAP.` sentence ending failed after a suffix check treated punctuation as an identifier suffix | 1 | Disallow alphanumeric/hyphen/underscore and dot-plus-alphanumeric continuations, while permitting a terminal period. |
