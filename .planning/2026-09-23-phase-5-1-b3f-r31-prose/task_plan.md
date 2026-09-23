# Task Plan: Phase 5.1 B3f R31 historical prose

## Goal

Retire only pure historical wording assertions for Phase 4.13–4.17 after the R30 structural guard, while retaining R38 identity, source, Release and safety checks.

## Authorization

- Maintainer said “继续” after B3e commit `c935e10`; this gate follows the frozen Discovery B3 ordering.
- Allowed: bounded R31 assertions/probes in `tests/repository-boundary.test.js` and scoped planning.
- Not allowed: R38 weakening, Phase 4.8 evidence repair, historical record rewrites, production/contracts, Cloud/Release/remote writes or planning deletion.

## Current phase

Completed locally: bounded R31 narrative retirement is verified; R38 and Phase 4.8 remain separate gates.

## Next Step

Hand off the committed B3f result; design a separate R38 current/cold evidence gate only with fresh authorization.

## Phases

1. [x] Recover baseline and inspect inventory, R30 guard and five historical test blocks.
2. [x] Classify R31-only versus R38/structural assertions; implement bounded retirement and probes.
3. [x] Run focused/full regression and review the test diff; create one local commit.

## Stop conditions

- Preserve exact source identities, safety and Release claims, index/role/anchor/source relations and current authority links.
- If a candidate assertion is mixed or lacks an independent guard, leave it unchanged and record the residual.
- No historical body edits, Phase 4.8 repair, R38 retirement or remote action.

## Errors encountered

- A first `rg` path argument used Bash-style brace expansion under PowerShell and was rejected as a file type. Re-ran the read-only search with `-g 'phase-4.1[3-7]*'`; no file changed.
