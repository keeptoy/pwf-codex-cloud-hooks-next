# Task Plan: Phase 5.1 document-test rule inventory

## Goal

Inventory the governance rules and assertion groups in `tests/architecture-contracts.test.js` and `tests/repository-boundary.test.js` by owner, current/history meaning, failure consequence, and proposed `KEEP / REPLACE / RETIRE / DEFER` treatment. Produce a reviewable Discovery input without editing the tests.

## Authorization

- The maintainer asked to continue from the successful bounded method probe and begin the formal inventory.
- Create this active planning scope, read the two target test modules and directly related authorities, and record a rule-group inventory with coverage evidence.
- Proposed dispositions are Discovery recommendations, not permission to patch tests or move document rules.
- Keep the Phase 5.1 history record `DRAFT / OPEN`; do not freeze it, declare GO, or start runtime/Cloud/Release work.

## Current phase

Inventory complete; awaiting maintainer review of proposed dispositions. Discovery remains open.

## Next Step

Maintainer reviews the 59 proposed rule groups and 17 `DEFER` items. If accepted or amended, define a separate narrow implementation gate; no test edit is authorized by this inventory alone.

## Phases

1. [x] Recover current source baseline, test-case boundaries, assertion surface, and owner documents.
2. [x] Build rule-group inventory with traceable source spans and proposed disposition; explicitly list unresolved safety or owner questions.
3. [x] Cross-check coverage against both test files, inspect the diff, run focused governance checks, and commit the planning-only inventory locally.

## Stop conditions

- Do not remove, rewrite, or add production assertions in this inventory gate.
- Do not classify a safety/Release/identity rule as `RETIRE` without an identified equivalent guard.
- Do not infer an implementation gate, Discovery freeze, Cloud PASS, Release state, or remote-write authorization from this inventory.
