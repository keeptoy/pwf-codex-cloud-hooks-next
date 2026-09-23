# Findings: Phase 5.1 B1d ROADMAP Phase routes

## Starting evidence

- Clean branch `0.5.0-dev` after B1c local commit `bfc4738c3a1cfa32d8db4dfc2cb13fdeb9266e51`; no pre-existing user changes.
- Frozen B1 assigns A20 to ROADMAP §4 current pointer, §5 Phase route rows, overview rotation and historical Phase examples. Inventory calls for route/overview link and state parsing rather than fixed milestone wording. A17 keeps current train/package/anchor identity; A18 keeps Release sequencing and Latest stop; A19 keeps planning/migration consent/safety.
- B1a A02 already checks ROADMAP §4 current overview pointer against §5's matching Phase row and rejects duplicate overview links outside that two-role relationship. This gate should reuse that relationship, not create an incompatible second route parser.
- Current ROADMAP §4 points active Phase 5 overview and inherited Phase 4 baseline; §5 has materialized overviews for rows 4/5 and pending nonmaterialized rows 6–9. §5.1 owns pointer rotation and distinguishes active, closed and no-next-train states.

## Open classification

- The large `ROADMAP keeps stable ...` test interleaves A17–A20. Determine which `currentTrain`, `productPhases` and Phase overview assertions freeze summary wording versus enforce owner/role safety.
- Check Product overview index/template and historical Phase links before replacing any prose assertion; do not reclassify immutable acceptance evidence as mutable guidance.

## Assertion ledger

- A17 KEEP: ROADMAP §2 development-train/package identity, explicit anchors and materialized overview anchors; current exact candidate/branch identity stays. A18/A19 DEFER: Release C0→C1→C2/Latest stop, planning deletion consent, migration atomicity, multi-Phase approval. These remain unchanged in the large test.
- A20 replaceable in this scope: §4's fixed Product Phase 4→provenance→acceptance sentence order, candidate/accepted prose and current-pointer narrative; §4 bans on old gate names/summary words; §5's fixed Phase 4/5 row descriptions; overview-index narrative and Phase 4 retrospective gate-order sentence. Their safety intent is route ownership, materialized-vs-pending row state and current-pointer scope, not specific descriptions.
- Preserve Phase 6–9 future-route safety sentences pending a separate semantic defense: no implicit Hook-event expansion, Phase 7 optional/NO_GO and not a Phase 8 prerequisite, Phase 8 read-only independent evaluator, Phase 9 hard-gating rediscovery/trust boundary. Preserve Phase 4 overview's Release asset/dual-channel, no-Product-reopen and history-role assertions as adjacent A18/A21/B3 safety, even though they share the test block.
- Retain non-A20 Product overview identity/role anchors and historical direct links. Do not mutate `repository-boundary.test.js` current-role/acceptance checks: those are independently inventoried R rules, many DEFER. This A20 gate cannot claim complete retirement of all historical prose tests.
- `tests/architecture-contracts.test.js` already has B1a's `assertOverviewRouteRelationship`, which ensures current §4 overview target has the same numbered §5 route row and duplicate links only pair these two roles. Extend by checking route table shape/status against `docs/product-phases/README.md` materialized index, rather than adding another target list.

## Current-state result and residual

- B1a's relationship helper now returns its parsed current/route slices for A20. The A20 helper parses §5 rows and lifecycle status, requires one active Phase matching the current train, forbids overview links on pending rows, compares all materialized route targets/status with the Product overview index and on-disk Phase overview files, and verifies §4's provenance plus accepted-version evidence link. It also rejects historical links or nested runbook sections in §4.
- Harmful in-memory edits reject an active row mislabeled pending, a pending row given an overview, a missing or wrong index entry, a wrong accepted-version evidence target, and a nested runbook. Equivalent active-Phase scope and candidate-window description wording passes the new relationship guard. Only Phase 4/5 fixed row descriptions and Phase 4 retrospective gate-order prose were removed from the live test; future safety routes, Release, planning, migration and trust checks remain.
- Future `NONE` is deliberately unresolved. The existing B1a helper and this current-state A20 helper assume an active Phase; ROADMAP §5.1 says an unauthorized next train writes `NONE` without retaining an old exact train anchor, but current evidence does not determine whether §4 keeps a separate accepted-baseline overview link. Do not invent a synthetic transition or retire the exact `NONE` rotation safety assertion in this gate. A later dedicated state-model decision/test is required before claiming full A20 closeout.
- The retained future Phase 6–9 and Phase 4 Release/history claims are also A20-adjacent residuals: they cannot be retired merely because the current route table passes. This batch closes only the current-state route/overview subset, not the whole A20 inventory item.
- The accepted-evidence relation is exact to the convention `${accepted}-cloud-hard-acceptance.md#...`, not a loose accepted-version prefix; an in-memory same-version wrong file now fails. A01 separately checks target existence and explicit anchor.
