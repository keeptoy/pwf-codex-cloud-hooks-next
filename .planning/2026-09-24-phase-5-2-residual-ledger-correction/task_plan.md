# Task Plan: Phase 5.2 retained-assertion ledger correction

## Goal

Make the Phase 5.2 retrospective self-contained about the safety/identity assertions retained at local B0–B4 closeout, so later retirement of completed planning does not erase the decision context.

## Authorization and scope

- The maintainer explicitly asked to write concrete retained/deferred matters into Phase 5.2 and to leave the underlying assertions unchanged.
- Allowed: read-only recovery of frozen inventory and closeout planning; evidence-based correction of the Phase 5.2 historical capsule; scoped planning, local verification and one local commit.
- Not allowed: retire or change tests, contracts, production, Phase 5.1 decision record, programme roles, Cloud/Release status, or remote state.

## Current phase

Completed locally: the retained-assertion ledger is now self-contained in Phase 5.2, scoped and full Windows regression passed, and the correction is ready for one local commit.

## Next Step

Hand off the historical ledger after its local commit. Any later owner-specific redesign, actual `NONE` transition, Product Phase 5 closeout, Cloud or Release gate needs separate authority; do not infer it from this record.

## Phases

1. [x] Recover current authority and source evidence for retained/deferred items.
2. [x] Add self-contained historical residual ledger to Phase 5.2 without changing role/authority.
3. [x] Run history/link and full local regression, review diff, create local commit.

## Stop conditions

- If a proposed detail lacks source evidence, omit it or label uncertainty; do not invent re-review criteria.
- Keep this a historical snapshot, not a live Next Step or authorization to modify retained guards.
- Do not alter tests or broaden to Product/Cloud/Release acceptance.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| Initial catch-up invocation used `session_catchup.py` instead of `session-catchup.py` | 1 | Ran the documented hyphenated script successfully. |
