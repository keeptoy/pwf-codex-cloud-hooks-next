# Task Plan: Phase 6–9 Cloud necessity discovery

## Goal

Explain Phase 6–9 plainly, decide whether each capability should be implemented, create one Release-excluded discussion folder per phase, and run only bounded non-production prototypes where the current evidence supports doing so.

## Authorization

- The maintainer authorized a one-hour Cloud workbox for separate Phase 6–9 necessity discussions and simple prototype validation where theoretically feasible.
- Workbox start: `2026-09-22T16:40:42Z`; deadline: `2026-09-22T17:40:42Z`.
- Create only Release-excluded discovery/prototype material; do not activate a Product Phase, change production dispatch/contracts, register new managed events, install/deploy, publish, push, or mutate GitHub.
- Local commit is authorized after proportionate validation. Remote push/PR remains maintainer-owned under repository policy.

## Next Step

None. The bounded necessity discovery and feasibility prototypes are complete; any Product Phase activation or real Host event probe requires a later explicit gate.

## Current Phase

Complete

## Phases

### Phase 1: Recover evidence and freeze decisions
- [x] Map each roadmap phase to current Host/runtime capabilities and evidence gaps.
- [x] Decide IMPLEMENT / DISCOVER FIRST / NO_GO / DEFER for each phase.
- **Status:** complete

### Phase 2: Materialize separate phase folders
- [x] Create one Release-excluded folder for each Phase 6–9 with plain-language purpose, necessity, evidence, and stop conditions.
- [x] Add bounded prototypes only for capabilities justified by Phase 1.
- **Status:** complete

### Phase 3: Validate and close out
- [x] Run prototype tests, focused governance checks, full regression, syntax and diff checks.
- [x] Record limitations and exact results, then create one scoped local commit.
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| Use `docs/experiments/phase-{6,7,8,9}/` | The governance guide permits explicit experiments when they are production/Release-excluded and have owner, budget and exit conditions; `docs/` is already excluded from Release. |
| Do not activate Phase 6–9 | ROADMAP activation requires a separate programme/task-plan decision; this task is bounded necessity Discovery only. |
| Put executable prototypes under `tests/experiments/` | Repository lifecycle admits Markdown only under `docs/` and exactly three files per planning scope; `tests/` is the canonical Release-excluded verification zone. |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| `docs/` lifecycle rejected Python files | 1 | Kept phase discussions in `docs/experiments/`; moved executable prototypes toward a non-doc zone. |
| planning lifecycle rejected nested prototype files | 2 | Moved executable prototypes to `tests/experiments/phase-{6,8}/`; focused governance then passed. |
| Published release oracles could not resolve v0.4.4/v0.4.3 refs | 1 | Classified as the documented tagless Cloud checkout limitation; ran the complete portable suite excluding only that publication-audit module. |
| LF check included transient binary `__pycache__` | 1 | Removed caches and reran against source text only. |

## Stop Conditions

- Stop at the one-hour deadline and record partial results.
- Stop before production, contract, installer, managed policy, Release or remote changes.
- Treat simulated prototype results as feasibility evidence only, never as real Host/Cloud acceptance.
