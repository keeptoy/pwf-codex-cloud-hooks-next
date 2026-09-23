# Task Plan: Phase 5.1 decision package and batch implementation route

## Goal

Turn the 59-group proposed document-test inventory and two bounded samples into a reviewable Discovery decision, disposition/owner boundary, and staged implementation route. Do not bulk-edit the tests in this gate.

## Authorization

- The maintainer accepted the proposed next step: formalize the Phase 5.1 Discovery decision and staged implementation plan before broad test edits, preserving the 17 DEFER groups until separate evidence.
- This gate may update the open Phase 5.1 Discovery draft and scoped planning files. It may freeze/index the Discovery record only if every stated exit condition is evidenced and the exact-source/history protocol is satisfied; otherwise stop at a decision package and report the missing condition.
- No bulk test modification, production, machine contract, Cloud execution, Release, remote write, or published-asset mutation is authorized by this planning gate.

## Current phase

Completed locally: staged decision package and focused validation. Freeze is held for a separate index/test admission transaction.

## Next Step

Seek maintainer direction for B0: a narrow atomic Phase 5.1 freeze/index/test-admission gate. Do not begin B1–B4 or the DEFER special gates before B0 passes and their own scope is authorized.

## Phases

1. [x] Recover baseline, inventory, sample evidence, authorities and freeze requirements.
2. [x] Build group-level decision and staged implementation/verification/rollback route; document unresolved decisions.
3. [x] Update the open Discovery draft only to the supported conclusion, validate docs/planning, inspect diff, and commit the local decision package.

## Stop conditions

- Do not infer that two successful samples prove all 59 groups or all 17 DEFER groups.
- Do not delete or replace a safety, Release, identity, permission, recovery, or operator stop assertion before a scoped equivalent guard and harmful/harmless evidence exist.
- If owner, current/cold semantics, freeze evidence, or exact-source protocol remains ambiguous, keep the record DRAFT / OPEN and ask for the specific missing decision.
- Do not execute Markdown tutorials, modify Cloud/Release state, or perform remote writes.

## Errors encountered

| Error | Context | Resolution |
|---|---|---|
| `docs/history/TEMPLATE.md` absent | Initial history-template path probe | Use the existing history index and Guide; locate actual templates by repository search before opening them. |
