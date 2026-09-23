# Task Plan: Phase 5.1 B3e R29 reindex status

## Goal

Retire R29 historical Phase-mapping prose assertions only for the six records with an existing immutable source/evidence path. Keep Phase 4.8's current assertions unchanged pending separate evidence governance.

## Authorization

- Maintainer said “继续” after B3d commit `c2434f2`; after the Phase 4.8 evidence inconsistency was reported, explicitly directed “先处理其他”. This authorizes the six-record subset only.
- Allowed: nearest R29 assertions/probes in `tests/repository-boundary.test.js`, scoped planning.
- Not allowed: R31 retirement, R38 weakening, frozen record rewrites, production/contracts, Cloud/Release/remote writes or planning deletion.

## Current phase

Completed locally: six eligible records now use index/status/ROADMAP/evidence relations; Phase 4.8 retains its original assertions and remains outside this retirement.

## Next Step

Hand off this six-record R29 result. Phase 4.8 evidence governance and R31 narrative retirement require separate decisions/gates; R38 remains deferred.

## Phases

1. [x] Recover baseline and map seven record/index/ROADMAP/evidence routes; isolate six eligible records.
2. [x] Implement R29 relation check and counterexamples; retire only mapping prose assertions for six records.
3. [x] Verify, review exact diff, create local commit.

## Stop conditions

- Do not invent a Cold evidence snapshot for Phase 4.5; preserve its exact immutable acceptance. Do not modify Phase 4.8's missing evidence or assertions.
- Keep post-programme anchors, current ROADMAP route and index membership.
- R31/R38 and historical body text stay untouched.
