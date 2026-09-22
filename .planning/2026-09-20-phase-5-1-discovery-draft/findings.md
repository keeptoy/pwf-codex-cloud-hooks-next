# Findings: Phase 5.1 document-test governance Discovery draft

## Maintainer-provided starting evidence

- The rough scan identified `tests/architecture-contracts.test.js` and `tests/repository-boundary.test.js` as the main documentation-governance assertion surfaces.
- Reported totals: approximately 488 `assert.match`, 84 `assert.doesNotMatch`, and 572 regex assertions combined.
- The proposed taxonomy is: machine boundary, convertible structural contract, prose freeze, temporal assertion, historical narrative freeze, and test-source self-check.
- The proposed first round is inventory/classification only: label assertion groups `KEEP / REPLACE / RETIRE / DEFER`, identify duplicated rule ownership, design one representative convergence approach, freeze exit conditions, and wait for maintainer authorization before implementation.
- Candidate principle: JS tests verify parseable structure, identity, relationships, and safety boundaries; Markdown templates and the unique authority own natural-language governance rules.

## Draft status boundary

- The requested file will be an open draft whose target final role is `FROZEN_DISCOVERY_RECORD`.
- It is not yet eligible for the frozen-role count because no formal assertion inventory, representative decision, or round closeout has occurred.
- The Phase 5 overview will carry only the rough-scan/Discovery milestone summary.

## Recovered authority constraints

- README exposes history only through `docs/history/README.md`; ROADMAP remains the only permitted second macro entrance when programme reasoning needs a direct frozen-record link.
- The history template currently admits only closed `RETROSPECTIVE_CAPSULE` and `FROZEN_DISCOVERY_RECORD` objects. The maintainer's explicit draft request therefore requires an unmistakable `DRAFT / OPEN` status and exclusion from frozen counts; it must not silently redefine a third final role.
- The Phase 5 overview currently says detailed process stays in planning and only mature maintainer-approved objects become history. The overview update must remain a milestone outline and distinguish the new draft from an admitted frozen record.
- DESIGN describes `architecture-contracts.test.js` as version-independent document/authority protection and `repository-boundary.test.js` as lifecycle/inventory protection that must not freeze history prose format. This is the stable intent the Discovery should recover, not a request to weaken Release, link, inventory, or safety checks.

## Current opening baseline

- The maintainer's rough-scan snapshot reported 488 `assert.match` plus 84 `assert.doesNotMatch`, about 572 regex assertions.
- After Phase 5.0 removed one duplicated Phase 4.17 global-count assertion, the current tree contains 487 `assert.match` plus 84 `assert.doesNotMatch`, for 571 total. The one-count delta is expected and does not change the Discovery rationale.
- Current hotspot entry points remain:
  - `architecture-contracts.test.js`: ROADMAP governance case at line 334.
  - `repository-boundary.test.js`: documentation lifecycle case at line 320.
  - `repository-boundary.test.js`: historical document governance case at line 603.
  - `repository-boundary.test.js`: test-source/version-history self-check at line 1013.
- No assertion-by-assertion classification or behavior change has been performed in this scope.

## Hotspot sizing

- ROADMAP governance case: 79 positive plus 14 negative regex assertions, 93 total.
- Documentation lifecycle case: 135 positive plus 15 negative regex assertions, 150 total.
- Historical document governance case: 38 positive plus 5 negative regex assertions, 43 total.
- Version-history test-source self-check: 4 negative meta-assertions.
- These counts describe current code only and are Discovery inputs, not stable contracts or targets to reduce mechanically.

## Draft integration decision

- Keep the open draft unindexed until the Discovery closes. The history index remains a catalog of admitted frozen records, so its role counts stay 18 retrospective and 11 frozen Discovery records.
- Do not add a direct Phase-overview link to the draft; that would create a third macro history entrance. The overview gets only one milestone row summarizing the rough scan and open Discovery.
- The draft will use `Target record role: FROZEN_DISCOVERY_RECORD` and `Record status: DRAFT / OPEN`, omit final acceptance and immutable-evidence claims, and state the later freeze transaction explicitly.
- The opening exact source baseline is local commit `8cd0155e5f2b86d293f8036f663355c25237a631`; it is an input baseline, not the future frozen record's final cold evidence.

## 2026-09-22 planning cleanup inventory

- The maintainer expressly chose to remove all completed sibling planning scopes while preserving this Phase 5.1 scope and `.planning/.active_plan`.
- The starting worktree was clean and the active pointer still names `2026-09-20-phase-5-1-discovery-draft`.
- Ten sibling directories exist. Nine each contain only tracked `task_plan.md`, `findings.md`, and `progress.md`; `2026-09-20-v0.5.0-candidate-initialization` is empty and not tracked by Git.
- The 27 tracked planning files remain recoverable from the pre-cleanup commit history; no external exact-scope reference was found outside `.planning/`.
- The cleanup is scope-retirement only, not history freezing or a Product/Release state transition.
