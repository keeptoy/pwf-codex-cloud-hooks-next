# Findings: R30 history record structure

## Baseline

- Clean `0.5.0-dev` after B3b commit `a262c28`.
- Frozen Phase 5.1 Discovery puts R30 role/index/anchor/immutable-link relation before any R04/R29/R31 historical-narrative retirement.
- Rule inventory classifies R30 as `REPLACE` for Phase 4.13–4.17 handcrafted anchor arrays; R31 prose retirement and R38 historical hash/safety checks are separate.
- Recent records Phase 4.15–4.17 declare `Record role: RETROSPECTIVE_CAPSULE`; legacy Phase 4.13–4.14 need inspection before role-aware validation. Do not add metadata just to satisfy a test.

## Structural decision

- Phase 4.13–4.14 indeed have no `Record role` line, but each index row and the record's opening Historical position state `回顾性`. Accept only these two named legacy records by that paired evidence; any explicit marker on a target record must be exactly one valid `RETROSPECTIVE_CAPSULE`.
- All five records have an index row targeting their first Phase-scoped explicit anchor; core section anchors follow a common pattern. Phase 4.14 has many later status anchors; derive their validity from headings instead of freezing a list.
- All five have one `Cold evidence (not current authority)` section with one immutable `/commit/<40 hex>` source link. Keep exact hash assertions in the existing per-record tests (R38).
- A record-aware helper can check index identity, root/core/section anchor relationships, role, cold source link and Release exclusion. Per-record prose and live safety remain untouched in this gate.

## Outcome and residual

- `assertRetrospectiveHistoryRecords` checks each Phase 4.13–4.17 index row and exact target, record presence, title identity, Phase-scoped unique anchors for every section, core sections, one cold immutable source commit link, role and Release exclusion. It derives optional status anchors from headings rather than a frozen list.
- Phase 4.13–4.14 use paired retrospective evidence only while lacking a role marker; Phase 4.15–4.17 must declare one `RETROSPECTIVE_CAPSULE`. A wrong legacy index role and a wrong explicit role both fail.
- In-memory broken index target, missing section anchor, missing cold source and Release inclusion fail; equivalent Phase 4.13/4.17 prose passes. Per-record exact source hashes, historical safety claims, current authority links and no-test-count guards remain unchanged.
- R04/R29/R31 prose retirement is now eligible for separate review, not performed here. R38 remains deferred.
