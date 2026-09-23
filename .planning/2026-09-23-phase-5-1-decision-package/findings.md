# Findings: Phase 5.1 decision package

## Starting evidence

- Current branch is `0.5.0-dev`; the worktree was clean before this gate. The completed R23a gate is the previous active scope.
- The 59-group inventory is `OPEN / PROPOSED`: 22 KEEP, 16 REPLACE, 4 conditional RETIRE, 17 DEFER. Group labels do not authorize deletion or change the underlying rule owner.
- R24 and R23a are separately authorized bounded examples of the harmful-fails/harmless-passes method. R23a leaves its group as a whole DEFER. The Phase 5.1 history draft remains DRAFT / OPEN.
- ROADMAP requires a Discovery decision to state evidence changes, route tradeoffs, invariants, scope, stop conditions, validation/rollback, and GO/CONDITIONAL_GO/NO_GO. A GO only permits the named next gate, not Cloud/Release or broad state changes.
- README routes programme to ROADMAP, governance method to the Guide, executable Cloud protocol to its template, and current authorization to the active task plan. ARCHITECTURE and DESIGN preserve trusted graph and verification boundaries.

## Open checks

- Exact baseline for this gate is `e0f8c6283e816766412937b1b9e75c38622d31ca`. Since the 59-group inventory at `fae9adf8e7ea6e0ab18d3b1b3a2cfe733658432d`, only `tests/repository-boundary.test.js` changed in the two bounded R24/R23a gates; the inventory's old line numbers are navigation, not current patch targets. R24 has a local replacement; R23a covers only one R23 sub-rule.
- The Guide and history index admit a `FROZEN_DISCOVERY_RECORD` only after the formal round closes with exact source evidence and index registration. The real template is `docs/phase-history-template.md`, not `docs/history/TEMPLATE.md`.
- `tests/repository-boundary.test.js` still matches the history index against the old Phase 4.1–4.11/11 wording. This broad regex can become stale or pass through an unrelated `11`; it is not a valid guard for adding Phase 5.1. The freeze transaction must make index admission and a role-aware structural test change together, then verify the exact record count/identity and links. This gate does not edit that test.

## Proposed disposition decision

Adopt the inventory as a **bounded implementation map**, not as a deletion list. Existing owner and failure-consequence rows remain the detailed per-rule record. The snapshot's 22 `KEEP` groups stay unchanged. R24 is the first `REPLACE` already implemented; 15 `REPLACE` groups remain. Four `RETIRE` groups remain conditional. The 17 `DEFER` groups keep their current assertions; R23a did not reclassify R23.

| Lane | IDs | Admission and order |
|---|---|---|
| B0 — Discovery freeze admission | R28's current fixed-count history check only, plus draft/index | Separate atomic gate: freeze a self-contained conditional decision with exact source; register Phase 5.1 and change the test to derive role/index membership rather than hard-code the old total. Do not use a green broad regex as proof. |
| B1 — parseable navigation and presentation boundaries | A02, A03, A12, A14, A16, A20, R11, R21 | Replace the old prose/number/duplicate-shape assertions only when parsed owner links, explicit anchors or scoped section boundaries pass broken-target and equivalent-wording probes. Preserve environment status/trigger routing for R11. |
| B2 — operator-guide and planning-document lifecycle | A04, A07, R13, R17 | Keep the existing commands, evidence states, planning-deletion consent and role boundaries. Replace wording checks one owner rule at a time, with a harmful omitted-stop/wrong-role probe and a harmless paraphrase probe; human owner reviews residual explanation. |
| B3 — history structure, then conditional prose retirement | R28 remainder, R30; only afterward R04, R29, R31 | First admit role/index/anchor/immutable-link recovery structurally. Only then retire those historical narration assertions; never edit the frozen historical text. R25 is **not** in this lane because R23 remains DEFER. |
| B4 — current/cold authority relation | R36 | Separately map CHANGELOG/ROADMAP/provenance/acceptance roles and current publication oracle; reject wrong candidate→published promotion before replacing phrase bans. |
| Special evidence gates | A08, A10, A18, A19, A21, R02, R06, R08, R18, R19, R20, R23, R26, R33, R35, R37, R38; conditional R25 | No batch rewrite. Retain assertions until each scoped owner/equivalence proof and explicit gate authorization. R25 may be retired only after the remaining R23 safety and R24-adjacent stops are covered. |

The lane IDs cover the 15 remaining `REPLACE` proposals exactly: B1 8, B2 4, B3 2, B4 1. B0 overlaps R28 but is an admission prerequisite, not completion of R28. The three other conditional `RETIRE` rows in B3 are R04/R29/R31; R25 stays blocked.

## DEFER trigger and human-review register

The original 17 IDs, risk/owner and rationale are in the inventory and priority audit. This table fixes the next evidence trigger; none silently becomes `RETIRE` or an approved `REPLACE`.

| IDs | Required trigger before touching the existing assertion | Residual reviewer |
|---|---|---|
| A08, A18 | A cross-document C0/C1/C2 and two-channel state model, including wrong-order and unknown-Latest negatives | Maintainer as Release programme owner |
| A10 | Behavior/AST-to-source assertion map for dispatch order, budgets, activation and no parallel reader; platform seam evidence | Maintainer as runtime/trust owner |
| A19 | Split Guide method from ROADMAP checkpoint timing and prove no-auto-delete/consent behavior | Maintainer as planning-lifecycle owner |
| A21 | Map plan-local product opt-in and separate platform permission to code, operator guidance and negative example | Maintainer as trust/permission owner |
| R02, R06, R35, R38 | Item-by-item literal→current publication oracle or immutable Git recovery map; no current/cold conflation | Maintainer as provenance/Release owner |
| R08, R26 | For each tombstone, show live recurrence outside exact inventories or confirm that removal cannot hide stale-path resurrection | Maintainer as source/lifecycle owner |
| R18, R19 | Scoped Cloud preflight/write-stop and final-exit/evidence-state negatives; operator review of non-machine-readable stops | Maintainer as Cloud operator-guide owner |
| R20 | Both deep-check channel scripts derive identity/hash/schema from machine authorities; wrong-channel and hard-coded-value negatives | Maintainer as Cloud template/contract owner |
| R23 | Remaining materialization, zero-hash, local-vs-public URL/SHA and identity sub-rules pass harmful/harmless probes; R23a alone is insufficient | Maintainer as Cloud/Release operator owner |
| R33 | Before/after retirement fixture preserves incoming links and immutable recovery; human approval of actual eviction | Maintainer as history-retirement owner |
| R37 | Narrow lint states the prohibited second authority and passes harmless mention/frozen-identity negatives | Maintainer as test-design owner |

## Verification, rollback and stop route

- Each B1–B4 batch names the exact owner and current test span before editing, adds at least one harmful and one equivalent-harmless in-memory probe, preserves all adjacent safety checks, runs nearest governance/producer-consumer tests and then full `npm test`. Run link/anchor check, `git diff --check`, and review the exact staged diff. If a Release ZIP input or machine contract unexpectedly becomes involved, stop and route to its full platform gate instead of calling the doc-only lane sufficient.
- Record Windows POSIX skips as skips, never Linux/Cloud PASS. Any changed executable tutorial command, permission/stop condition or Release identity needs a separate approved operator/platform gate; this programme does not run Cloud or publish.
- Commit each independently recoverable batch locally; on a regression, keep the prior committed baseline and repair or revert only the current batch after classification. Do not reset, rewrite published history, or carry a failing batch into the next lane.
- Stop for owner collision, unproved equivalent guard, a false-green harmful probe, a false-red harmless probe without explicit syntax contract, a need to edit production/contracts/Cloud/Release, or a meaningful new implementation route. Present evidence and choices to the maintainer before expanding scope.

## Freeze decision

Recommend `CONDITIONAL_GO` **only** to the B0 history-admission transaction and then the staged B1–B4 gates after their own prerequisites. This is not a blanket implementation GO. Keep the Phase 5.1 draft `DRAFT / OPEN` in this planning gate: B0 needs a narrow test change outside this gate's edit authorization, an exact decision-source commit, and the index/record atomicity check. The draft can be frozen and indexed in B0 if these conditions pass; otherwise report the failed condition and leave it open.
