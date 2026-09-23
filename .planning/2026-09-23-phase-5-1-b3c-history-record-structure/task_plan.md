# Task Plan: Phase 5.1 B3c history record structure

## Goal

Replace the handcrafted Phase 4.13–4.17 history anchor/index/Release-exclusion assertions (R30) with one record-aware relation check, while preserving immutable evidence and safety claims.

## Authorization

- Maintainer said “继续” after B3b local commit `a262c28`; this permits the next bounded local B3 gate.
- Allowed: nearest R30 test assertions and probes in `tests/repository-boundary.test.js`, scoped planning.
- Not allowed: R04/R29/R31 retirement, R38 weakening, frozen record rewrites, production/contracts, Cloud/Release/remote writes, planning deletion.

## Current phase

Completed locally: one record-aware validator replaces R30's five handwritten anchor/index/Release-exclusion checks; role, structural anchors and cold source relation pass focused/full Windows regression.

## Next Step

Hand off the bounded R30 structure result. R04/R29/R31 narrative retirement needs its own gate; R38 exact historical hash and safety checks remain deferred and unchanged.

## Phases

1. [x] Recover clean baseline and map R30 records, index links, test seam and immutable evidence.
2. [x] Replace only R30 structure arrays with relation checks and probes.
3. [x] Verify, review exact diff, commit local scope.

## Stop conditions

- If role cannot be reliably inferred for legacy records, preserve the existing role assertion or stop; do not rewrite frozen prose.
- R38 immutable hash/safety guards stay intact.
- R04/R29/R31 retirement waits for structural validation to pass as a separate next gate.
