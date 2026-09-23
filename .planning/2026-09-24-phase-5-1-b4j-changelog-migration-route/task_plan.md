# Task Plan: Phase 5.1 B4j CHANGELOG migration evidence route

## Goal

Keep the v0.3.0 CHANGELOG migration claim connected to its exact provenance section without pinning the link's display wording.

## Authorization and scope

- Maintainer asked how much remains in B4 and to continue the next step after B4i `c8ec42f`.
- Change only R36's v0.3.0 migration-link assertion and in-memory probes in `tests/repository-boundary.test.js`, plus this planning record.
- Do not edit macro-document content, publication identity, counts, role neutrality, production/contracts, Release/Cloud or remote state.

## Current phase

Phase 3: focused/full checks and diff review passed; create scoped local commit.

## Next Step

After B4j commit, audit the three remaining sensitive R36 guard families by owner and failure consequence. Preserve them unless a separate equivalence proof supports a bounded change.

## Phases

1. [x] Audit owner, scope and harmful/harmless examples.
2. [x] Add failing-first probes and replace only the exact label assertion.
3. [x] Run focused/full checks, inspect diff and create one scoped local commit.

## Stop conditions

- The v0.3.0 migration claim must still link to `BASELINE_PROVENANCE.md#successor-migration-evidence`.
- A wrong/missing anchor or a link moved out of that claim must fail; equivalent display wording must pass.
- Exact publication, role and count guards remain unchanged.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
