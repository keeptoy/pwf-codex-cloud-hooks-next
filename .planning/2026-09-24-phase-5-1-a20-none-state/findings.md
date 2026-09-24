# Findings: A20 `NONE` state

## Entry facts

- Worktree clean on `0.5.0-dev` at entry; current ROADMAP §2 declares `v0.5.0-dev` and Phase 5 active.
- ROADMAP §5.1 already permits `NONE` after old-train Release closeout when no successor is authorized, but does not yet state the §4 overview-link shape or route-table lifecycle consequence.
- Existing A20 helper requires a Phase overview in §4 and exactly one active Phase row. The mixed A17 test always requires ROADMAP train identity to equal `package.json`, so a legitimate `NONE` would fail even if §5.1 allowed it.
- B1d explicitly left this state unresolved; B4 local closure did not include A20. This is a separate user-authorized gate.

## Decision boundary

- `NONE` is a programme role, not a package version or inference from Git branch. The package may retain its last development candidate identity while no successor train is approved.
- In `NONE`, §4 is a short no-train pointer with no direct Product Phase overview or stale exact train anchor. §5 and the overview index retain completed overviews; no Phase row is active and pending phases stay unmaterialized.
- Accepted/fallback roles remain in §2; §4 retains only links to provenance and accepted-version evidence, without republishing their identities.
- An approved patch/governance train without a new Product Phase is a separate future state. This gate does not silently redefine that relationship.

## Implemented boundary and evidence

- ROADMAP §5.1 now states that `NONE` is an explicitly unapproved-next-train role. §4 drops direct Phase overview and old exact identity, while §5/overview index keep completed routes; accepted/fallback remain §2 roles and Release closeout does not itself close a Product Phase.
- The A20 route helper accepts either an active train with its matching active Phase or `NONE` with no active Phase. In both cases it still checks canonical §5/index/file relationships and §4 provenance/accepted-evidence links. The existing active-train-to-package identity assertion remains exact; only its `NONE` branch avoids equating programme state to package metadata.
- Synthetic `NONE` checks reject stale exact candidate text, an old §4 overview pointer, an active Phase row, premature pending-Phase overview, index status drift, and wrong accepted evidence. An equivalent no-train explanation passes. The fixture derives current version, accepted evidence, and Phase row numbers from the repository, so it does not freeze the present rollout identity.
- Full Windows regression after removing a literal-version fixture: 210 total, 184 pass, 26 POSIX/Linux-only skips, 0 fail. The first full run exposed `repository-boundary.test.js`'s ban on frozen version literals in architecture tests; the fixture was corrected rather than weakening that guard.

## Residual and next rotation

- This is a synthetic state-model proof, not an actual Release closeout or `NONE` transition. ROADMAP still declares active Phase 5. At a real transition, update the Phase overview/status/index with actual closeout evidence and review the separate `repository-boundary.test.js` assertions that intentionally pin the current programme snapshot.
- Existing active-train logic still assumes one active Product Phase. ROADMAP permits a future patch/governance train without a new Product Phase; that is a different state decision, not silently solved by the `NONE` branch.
- A20's Phase 6–9 safety wording and Phase 4 Release/history-adjacent guards remain untouched. This gate does not claim whole-A20 or Phase 5.1 completion, Cloud PASS, or Release authorization.

## A20-adjacent residual disposition (maintainer-authorized, 2026-09-24)

`KEEP` means the existing assertion remains in force; `DEFER` means replacing or retiring its wording-sensitive form requires a separate owner-specific proof. These are not instructions to change the assertions now. The current §4/§5 route, overview-index/file, accepted-evidence and synthetic `NONE` subset is locally verified; it does not prove the following semantic claims.

| Residual assertion group | Disposition and owner | Why it remains; reopen condition |
|---|---|---|
| ROADMAP Phase 6 compaction route and Phase 7 optional tool/permission hooks | **KEEP assertion; DEFER redesign** — corresponding future Product Phase Discovery | §5 route parsing proves pending/materialized status, not the rule that existing events are tried before adding hooks, nor the separate-gate, budget, `NO_GO` and non-prerequisite decisions. Reopen only with an authorized Phase route change and row-scoped harmful-fail/harmless-pass evidence. |
| ROADMAP Phase 8 read-only evaluator and Phase 9 optional hard gating | **KEEP assertion; DEFER redesign** — corresponding future Product Phase Discovery | No implementation or Cloud evidence yet replaces the advisory-only/no-mutable-state constraint or the fresh writer/lock/Resume/rollback review; weakening these phrases could imply premature authorization. Reopen with explicit owner decisions and negative probes, not a generic overview-link test. |
| Phase 4 overview's v0.4.3 Release asset, bootstrap selection and Source/Candidate versus Published Release claims | **KEEP assertion; DEFER test replacement** — Release/Cloud owner (A18-adjacent) | Current contract and asset tests prove current bytes; they do not alone prove this closed historical claim in the overview or the two-channel distinction. Any rewrite needs the corresponding immutable acceptance/source evidence and a wrong-selection/wrong-channel failure probe. |
| Phase 4 overview's “no Phase 4 reopening, no Phase 5 activation, no Product/runtime behavior change” claim | **KEEP assertion; DEFER replacement** — Product/trust-owner review (A21-adjacent) | This is a scope boundary for a completed patch/governance train, not merely a sentence-style preference. Reopen only if the historical claim is corrected with evidence or an independent owner-specific guard is demonstrated. |
| Phase 4 overview's `RETROSPECTIVE_CAPSULE` / `FROZEN_DISCOVERY_RECORD` sentence | **KEEP assertion for now; DEFER possible retirement** — history-role governance (B3/R28-adjacent) | The history index/template and repository-boundary tests already guard legal roles and admission, making this a candidate for later deduplication, but removal still needs proof that the Phase 4 overview's own historical conclusion is not lost. |

The exact overview anchors, materialized index links and active candidate/package relationship remain **KEEP** as structural/current-identity guards, not as loose A20 prose to batch-remove. A17 current identity, A18 Release order, A19 planning consent and A21 trust boundaries retain their own dispositions. Actual `NONE` rotation, a patch/governance train with no new Product Phase, and future Phase activation are event-triggered decisions, not unfinished implementation licensed by this classification.

**Bounded result:** no additional A20 code/document-governance change is recommended now. Carry this KEEP/DEFER ledger into a separate Phase 5.1 B0–B4 overall reconciliation; do not label whole A20, Phase 5.1, Cloud or Release PASS from it.
