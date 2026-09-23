# Task Plan: Phase 5.1 B3d R04 history prose retirement

## Goal

Retire only R04's Phase 4.12 heading/renumbering/P9 conclusion wording assertions after proving the history index, record anchors, retired root copies and immutable acceptance link still form a recoverable relationship.

## Authorization

- Maintainer said “继续” after B3c commit `232eaaa`; this authorizes the next bounded local B3 gate.
- Allowed: nearest R03/R04 tests and in-memory counterexamples in `tests/repository-boundary.test.js`, scoped planning.
- Not allowed: R29/R31 retirement, R38 weakening, frozen history edits, production/contracts, Cloud/Release/remote writes or planning deletion.

## Current phase

Completed locally: R04 historical wording assertions retired after the index→record→immutable acceptance relationship passed focused and full Windows regression.

## Next Step

Hand off this bounded R04 result. R29/R31 historical narrative assertions remain separate gates; R38 stays deferred.

## Phases

1. [x] Recover clean B3c baseline and map R03/R04 source, index and immutable evidence.
2. [x] Add relation guard/counterexamples; retire only R04 wording assertions.
3. [x] Verify, review exact diff and create local commit.

## Stop conditions

- Preserve R03 missing-root-copy, canonical anchor and immutable recovery checks.
- Phase 4.12 record has no dedicated cold-evidence section; use its provenance-linked exact immutable acceptance, not invented metadata.
- R29/R31 and unrelated historical/safety assertions stay for later gates.
