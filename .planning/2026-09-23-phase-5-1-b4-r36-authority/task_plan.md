# Task Plan: Phase 5.1 B4 R36 authority relations

## Goal

Replace only brittle R36 document-wording checks whose lifecycle meaning can be enforced by parsed authority/role relations, while preserving unpublished-candidate and immutable-publication guards.

## Authorization

- Maintainer said “继续” after B3g commit `4895f65`; frozen Phase 5.1 Discovery routes B4 to R36 current/cold identity.
- Allowed: scoped planning and nearest `tests/repository-boundary.test.js` R36 helper/probes; no macro-document content changes unless a separately authorized issue is found.
- Not allowed: production/contracts, Release/Cloud/remote actions, historical-body rewrite, R35/R38 cold-identity retirement, or candidate publication by prose.

## Current phase

Completed locally: R36a published-ledger and accepted-acceptance relations passed focused/full Windows checks.

## Next Step

Hand off R36a; B4b must separately design owner-specific replacements for the remaining broad phrase bans.

## Phases

1. [x] Recover R36 baseline, document structure and accepted/fallback publication oracle.
2. [x] Design and implement a bounded parsed relation plus harmful/harmless probes; leave ambiguous checks unchanged.
3. [x] Run focused/full local regression, review exact diff and create one scoped local commit.

## Stop conditions

- Candidate `v0.5.0-dev` must not be mistaken for a published version; accepted/fallback Release identities remain immutable.
- CHANGELOG remains delta-only, ROADMAP lifecycle, provenance publication identity and acceptance actual evidence.
- A failed or ambiguous oracle mapping stops test retirement; do not weaken by deleting a regex alone.
