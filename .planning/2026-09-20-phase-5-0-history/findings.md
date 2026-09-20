# Findings: Phase 5.0 history capsule

## Confirmed scope

- Phase 5.0 is a concise retrospective of completed `v0.5.0-dev` changelog content.
- It excludes the assertion rough-screening already discussed and all future Discovery work.
- Phase 5.1 is reserved for that later rough-screening/Discovery history and is not created in this task.

## Pending inspection

- History template role and required fields.
- Existing history index ordering/count conventions.
- Exact current `v0.5.0-dev` bullets and their commit evidence.
- Structural tests affected by adding one history record.

## Recovered repository constraints

- `README.md` keeps the human-facing documentation map and routes closed Phase history through `docs/history/README.md`; it does not expose individual history records as competing macro entry points.
- `ARCHITECTURE.md` confirms this task is documentation governance only: it must not imply any runtime, Host ABI, trusted-graph, Cloud, or Release change.
- The prior overview-filename plan is complete and the worktree was clean before this scope was created.

## History model

- The template admits only `RETROSPECTIVE_CAPSULE` and `FROZEN_DISCOVERY_RECORD`; Phase 5.0 fits the former because it summarizes an already completed documentation-governance tranche rather than a formal Discovery round.
- A capsule should remain concise and self-contained: historical position, prior problem, core decisions, completed delivery, acceptance limits, explicit non-goals, successor inheritance, and one cold source snapshot.
- The history index is the sole global entry point. Adding Phase 5.0 requires one new table row and changes the retrospective count from 17 to 18; no direct README or Phase overview link should be added.
- The Phase 5 overview already states that only maintainer-approved mature objects enter `phase-5.x`, and the current request supplies that authorization.
- The closest style precedent is Phase 4.17: stable Phase-scoped anchors, no test counts, no raw log, explicit separation between historical summary and current Product authority.

## Frozen record design

- Filename: `docs/history/phase-5.0-v0.5.0-dev-document-governance.md`.
- Stable anchor family: `phase-5-0-*`.
- Historical object: the first completed `v0.5.0-dev` documentation-governance tranche through commit `905d601c817dc74abd92f3bf4d0a41ef296f8f24`; this does not close Product Phase 5.
- Source content: the eight completed `v0.5.0-dev` changelog deltas, grouped by meaning rather than copied as a commit timeline.
- Cold evidence: one exact commit URL for `905d601c817dc74abd92f3bf4d0a41ef296f8f24`.
- Explicit exclusion: the later assertion rough-screening and any formal Discovery; they remain planning material and may become Phase 5.1 only after the maintainer decides the corresponding round is closed and history-worthy.
- Test impact: update only the existing retrospective role range/count assertion from 17 to 18; do not add Phase 5 prose, title, or current-state regexes.
