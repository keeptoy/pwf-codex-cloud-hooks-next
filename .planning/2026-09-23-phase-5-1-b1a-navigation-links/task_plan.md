# Task Plan: Phase 5.1 B1a navigation and handoff links

## Goal

Implement only A02/A03 from the frozen Phase 5.1 route: replace rollout-shape duplicate-link allowance and whole-file handoff word-presence assertions with owner-aware, section-scoped navigation checks. Prove wrong routes fail and equivalent explanation text passes.

## Authorization

- The maintainer said “好的，继续” after the B0 handoff explicitly proposed B1's first navigation/link group. Treat this as approval of A02/A03 only.
- This gate may edit the nearest `tests/architecture-contracts.test.js` checks, repair an in-scope README/ROADMAP/handoff link if the new guard reveals a real defect, and update scoped planning. It does not authorize A04 or any other B1/B2–B4/DEFER group.
- No production, machine contract, Cloud, Release, published asset, remote write, or Phase 5.1 frozen-record rewrite.

## Current phase

Completed locally: A02/A03 relationship guards and in-memory harmful/harmless probes passed focused and full regression.

## Next Step

No further B1 group is authorized in this scope. Hand off the A02/A03 result and await a separate next-group instruction.

## Phases

1. [x] Recover source baseline, exact assertions, link targets and owner roles.
2. [x] Add harmful/harmless probes, implement scoped relation checks and replace only A02/A03 assertions.
3. [x] Run focused/full regression and link validation, inspect diff, commit locally.

## Stop conditions

- Preserve A01's path containment, file existence and explicit-anchor link checker; do not weaken it while changing A02.
- Preserve A04/A05 handoff style and Release-exclusion checks. If A03 cannot be isolated from A04, stop and report the overlap before changing it.
- Do not freeze a second map of all authority paths in JS; derive target identity from the README/ROADMAP owner structure where possible.
- Stop for owner ambiguity, a wrong target that passes with reassuring prose elsewhere, or equivalent navigation wording that falsely fails.
