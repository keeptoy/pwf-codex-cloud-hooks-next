# Findings: R31 historical prose

## Baseline

- Clean `0.5.0-dev` after B3e commit `c935e10`; Phase 4.8 evidence inconsistency remains explicitly deferred.
- Frozen Discovery orders R28/R30 structural admission before R31 prose retirement; inventory classifies pure heading/summary wording as R31 `RETIRE` and exact source, Release and safety claims as R38 `DEFER`.
- R30 helper `assertRetrospectiveHistoryRecords` already requires the five index rows, Phase-scoped entry/section anchors, retrospective roles (including legacy 4.13/4.14), Phase identity in title, one cold source commit and Release exclusion; harmful and harmless probes exist.

## Candidate boundary

- All five full H1 spelling assertions duplicate R30's Phase-title identity and can be retired.
- Phase 4.13 retrospective label/“not Product Phase” wording, Phase 4.15 comparison to 4.14, and Phase 4.17 high-level retrospective summary are candidates for retirement if role and route probes stay green.
- Exact commit hashes, path safety, candidate/tag/Release procedures, link targets and other mixed assertions remain for R38 or structural governance.

## Classified retirement

- Retire five exact H1 spellings: R30 separately requires Phase identity and indexed entry anchor.
- Retire Phase 4.13 retrospective-label wording: R30 requires a retrospective role in both index and legacy introduction. Retain its explicit “not Product Phase” identity negation; role alone would not reject contradictory prose.
- Retire Phase 4.14's `post-v0.4.2 residue sweep（Batch A/B）` heading fragment only: its historical status section has a Phase-scoped anchor under R30; the exact label is not an operation or current route.
- Retire Phase 4.15's comparison sentence to Phase 4.14: it is a historical summary, not a link or procedure. Its explicit role remains protected by R30.
- Retire Phase 4.17's high-level “narrow Product/trusted supply chain/harness” summary as exact prose; the Phase 4 overview retains the current handoff boundary. Keep proposal lane identifiers, machine-admission, unknown-path fallback, Release identity and non-activation checks in this gate because they may still matter to authorization/safety interpretation.
- Preserve all remaining 4.13–4.17 checks. In particular, 4.14's release closeout sequence, 4.15's asset/override contracts, 4.16's tag/C0 procedure, all exact source hashes and authority links require separate R38 examination; do not infer they are safe to retire from narrative appearance.
- Diff review found R30 only checked the Phase number in H1; removing exact title checks would permit a wrong version in Phase 4.13/4.15/4.16 H1. The helper now checks each versioned record's H1 version identity and a wrong-version mutation fails; equivalent title wording still passes.

## Verification and residual

- Focused `node --test tests/repository-boundary.test.js`: 29 passed, 0 failed. Full Windows `npm test`: 209 total, 183 passed, 26 POSIX-only skipped, 0 failed. Windows skips are not Linux/Cloud evidence.
- R31 retirement is deliberately limited to nine literal historical-wording assertions. The preserved 4.13 non-activation negation and all safety/Release/source checks remain untouched for a separate R38 mapping; no historical record bytes changed.
- Phase 4.8's missing Cold evidence and its unchanged R29 assertions remain a separate governance decision. The broad history-index reindex summary and other DEFER groups also remain outside this gate.
