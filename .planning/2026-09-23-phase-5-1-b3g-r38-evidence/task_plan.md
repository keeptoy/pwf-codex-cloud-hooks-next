# Task Plan: Phase 5.1 B3g R38 evidence mapping

## Goal

Map the remaining Phase 4.13–4.17 historical safety, Release and source assertions to current guards or immutable evidence, then change only a demonstrably redundant, bounded subset if one exists.

## Authorization

- Maintainer said “继续” after local B3f commit `3972e8f`; this authorizes a bounded next governance gate, not blanket R38 retirement.
- Maintainer clarified that the five-record Cold source check is a generic link-shape rule and directed it to remain generic; do not add a 4.14-specific commit literal there.
- Allowed: read-only source/evidence audit, scoped planning, and a narrow test-only change with harmful/harmless probes if equivalent independent guards are proven.
- Not allowed: historical-body rewrite, Phase 4.8 repair, production/contracts, Cloud/Release/remote writes, or weakening identity/safety checks without a replacement.

## Current phase

Completed locally: R38 evidence map and generic Cold source decision are recorded; no R38 test assertion was retired.

## Next Step

Hand off B3g; the frozen Discovery's B4/R36 current-cold identity route is the next separate gate, while R38 remains deferred.

## Phases

1. [x] Recover baseline, R38 inventory, five test blocks and relevant current/cold oracles.
2. [x] Classify candidates and document why the remaining assertions stay; keep R30 generic.
3. [x] Verify the planning-only change, review diff and create a scoped local commit.

## Stop conditions

- Preserve exact published identities, old cold-source recovery, current path safety and Release C0/C1/C2 boundaries.
- If a historical claim has no independent current/cold guard, retain its assertion and record the gap.
- Stop for maintainer direction if an apparent contradiction needs a historical or production change.

## Decision

The Phase 4.14 source-link observation is not a structural-test defect: R30 deliberately validates one well-formed immutable commit link per retrospective record, not a particular historical commit. No second exact-source table or 4.14 special case is added. Existing R38 assertions remain unchanged pending individually designed current/cold counterexamples.
