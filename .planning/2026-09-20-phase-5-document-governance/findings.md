# Findings: Establish Product Phase 5 authority

## Maintainer direction

- The repository should now be treated as entering Product Phase 5 documentation governance.
- `docs/product-phases/phase-5.md` should initially hold both the Phase outline and detailed running record.
- Once that ledger becomes large, detailed material may be distilled into `docs/history/phase-5.x-*.md`; `phase-5.md` then evolves into a concise summary and index.
- The immediate task is to create Phase 5 authority, not speculative history files.

## Constraints to verify

- ROADMAP owns the current train and programme lifecycle.
- README remains the unique human-facing document map.
- Product Phase files should expose stable explicit English anchors.
- History remains curated evidence, not a competing current authority.

## Initial repository scan

- ROADMAP currently says `v0.5.0-dev` is active only for documentation split/planning retirement while Product Phase 5 is not activated and no overview exists. The maintainer's new direction intentionally advances that governance state.
- The Phase index already reserves Phase 5 for `0.5.0-*` and “其他文档治理方向”; activation can therefore remain documentation-only while Product implementation, Cloud, and Release stay unauthorized/TBD.
- `docs/product-phases/` currently contains only the index and `phase-4.md`; the index admission rules and Phase 4 overview are the direct structural precedents.
- Existing architecture/repository-boundary tests explicitly assert that `docs/product-phases/phase-5.md` does not exist and that Phase 5 remains inactive. Those assertions must be replaced with positive authority/transition assertions rather than merely deleted.
- Existing history already contains `phase-4.1` through `phase-4.17`, supporting the future `phase-5.x-*.md` naming convention; no Phase 5 history object exists yet.

## Authority-shape implications

- ROADMAP section 5.1 already defines activation as: ROADMAP/task plan authorization → create one overview → point section 4 at its stable anchor. The maintainer's instruction supplies the missing authorization.
- The current overview template forbids daily construction logs and says history receives Discovery process. To honor the new workflow without creating duplicate authority, Phase 5 should use a bounded **active working ledger** for important decisions/deliveries only—not raw test output or temporary Next Steps—and explicitly extract mature detail into future `phase-5.x` history records.
- After extraction, `phase-5.md` remains the canonical Product authority but contracts into the durable outline, adopted conclusions, stable boundaries, and links. History stores the selected process detail and never becomes current Product authority.
- This lifecycle refinement should be stated in the Product Phase index/template as a general active→distilled rule; otherwise `phase-5.md` would immediately contradict its own directory authority.
- README already links the Product Phase index and does not need a second direct Phase 5 entry. ROADMAP section 4 and the Phase 5 route-index row are the proper current pointers.

## History and test contract

- History admits only two mature record roles: `FROZEN_DISCOVERY_RECORD` after a real decision round closes, and `RETROSPECTIVE_CAPSULE` after a closed object has immutable evidence. Therefore the current Phase 5 ledger must remain in `phase-5.md`; creating a Phase 5 history file now would violate admission rules.
- The ledger may capture important Phase-level facts and decisions, but must not store raw chat, command-by-command logs, full test output/counts, current Next Step, candidate role status, or PASS/PENDING. Those remain in planning/acceptance/ROADMAP.
- Existing governance tests contain two direct nonexistence assertions for `phase-5.md`, plus sentence-bound assertions that Phase 5 is inactive and the current train points only to Phase 4. These must become positive checks for the Phase 5 overview, active documentation-governance scope, stable anchor, and deferred history extraction.
- Frozen Phase 4 history statements saying they did not activate Phase 5 remain historically correct and must not be rewritten. Tests for those immutable facts should stay unchanged.
- Reindex notes saying Phase 5 was only reserved are also historical time-scoped statements; activation now belongs in current ROADMAP/overview rather than retrospective edits across old records.

## Phase 5 activation baseline

- The `0.5.0-dev` train already contains five important clusters worth seeding into the Phase 5 working ledger: candidate/branch initialization; README→Wiki documentation split and planning retirement; architecture/design/code reconciliation; retained completed-scope test governance; autonomous newline audit and strict-LF closure.
- These pre-activation train facts should be labeled as the **activation baseline**, not retroactively invented as formal Phase 5.x Discovery rounds.
- New `phase-5.x` identifiers should only be assigned when a real coherent round/object is ready for one of the two admitted history roles. The working ledger can group facts without claiming a frozen history identity.
- `CHANGELOG.md` should retain the original fact that candidate initialization did not *automatically* activate Phase 5, then add a separate bullet for the maintainer's explicit activation. This preserves the distinction between version/branch rotation and programme authorization.
- ROADMAP section 2 currently contains two stale statements that Phase 5 is not active. They must say documentation governance is active while Product behavior work, Cloud, and Release remain unauthorized.

## Proposed Phase 5 overview shape

- Stable root anchor: `product-phase-5-overview`.
- Long-term position: documentation governance and authority coherence for `0.5.0-*`; no automatic runtime/Release expansion.
- Current scope: authority hierarchy, documentation/code reconciliation, planning lifecycle, and exact-state contract wording/implementation alignment.
- Active working ledger: important dated decisions and delivered facts only, seeded from the activation baseline.
- Distillation rule: keep details here until a coherent history object is justified; then extract to `docs/history/phase-5.x-*.md`, index it, and contract this file to durable conclusions and links.
- Stable boundaries/version mapping/closeout/evidence sections remain compatible with the existing overview template.

## Implemented authority transaction

- `docs/product-phases/phase-5.md` now owns the active documentation-governance scope, activation baseline, curated working ledger, explicit distillation procedure, inherited boundaries, version mapping, closeout requirements, and evidence map.
- ROADMAP section 2 and section 4 now say Phase 5 documentation governance is explicitly active while Product implementation, Cloud, and Release remain unauthorized; the Phase 5 route row links the new stable anchor.
- Product Phase index/template, history index, and repository-governance guide agree on the lifecycle: active overview ledger first; mature two-role history extraction later; overview contracts to a durable outline.
- No `docs/history/phase-5.x-*` file was created. Existing Phase 4 records retain their original “did not activate Phase 5” time semantics.
- A bounded scan found no remaining current, non-history statement claiming Phase 5 is inactive, reserved only, or forbidden from having an overview.
