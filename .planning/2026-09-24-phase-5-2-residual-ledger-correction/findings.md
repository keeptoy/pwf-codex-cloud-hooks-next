# Findings: Phase 5.2 retained-assertion ledger correction

## Initial state

- Worktree clean on `0.5.0-dev`; Phase 5.2 retrospective already committed as `f705dd6`.
- The earlier Phase 5.2 plan confirms local B0–B4 closeout at `90ab434`, no test/production changes for this correction, and retained assertions by maintainer decision.
- The existing capsule has only a short residual list; it does not preserve the original exact DEFER register or A20/B4 boundaries in enough detail for planning retirement.
- Current macro authority remains unchanged: README routes to history through its index, ROADMAP keeps Phase 5 active and limits authorization to document governance, while ARCHITECTURE/DESIGN/Wiki retain their architecture, implementation and operations roles. The new detail belongs only in the Phase 5.2 capsule, not a macro current-state document.

## Recovered residual register

- The original inventory recorded 59 mixed assertion groups, including exactly 17 `DEFER`: operator/Release/Cloud A08, A18, A19, R18, R19, R20, R23, R33; runtime/trust A10, A21; cold/temporal R02, R06, R08, R26, R35, R38; source self-lint R37. This is a decision-time classification, not a live assertion count or permission to remove tests.
- Each `DEFER` has a distinct protected failure: wrong gate/command/bootstrap/identity, unsafe operator action or invented evidence, runtime permission/seam violation, lost cold/rollback identity or stale-path recurrence, or ineffective lint. Later work must keep the old check until owner-specific harmful-fail/harmless-pass proof or stated review exists.
- The A20 `NONE` gate proved a synthetic no-train state, not actual rotation. It retained five adjacent cross-owner categories: future Phase 6–7, future Phase 8–9, closed Phase 4 Release/channel claims, closed Phase 4 no-reopen/no-activation scope, and historical role sentence. Exact route/index/current identity guards stay KEEP. A patch/governance train with no Product Phase is a separate future decision.
- B0–B4 closeout confirms R23a is only one subrule, R23 remains DEFER; R38 audit was read-only and a generic commit-link shape is not exact Phase 4.14 identity. B3 history-index reindex prose and curated-history/current-programme guards remain; B4 sensitive SHA/count/parser/accepted-heading guards remain. Do not imply whole A20, R23, R38, Phase 5, Cloud or Release are complete.
- The Phase 5.2 capsule currently has only four short non-goal bullets. Its other sections already provide the delivery, issue-resolution, bounded-verdict and one-source snapshot context, so the change should focus on expanding retained work rather than duplicating the entire retrospective.
- B4m itemizes exact retained current/cold guards: CHANGELOG hash and `N registered` bans, provenance `N registered`, unique published ledger/acceptance routes and parser headings, ROADMAP accepted heading and stable Latest anchor, Next Step/moving-status authority, and the independent published-release oracle. Preserve this as one compact row/category rather than treating every guard as a new DEFER ID.
- R38's five cold snapshot roles were verified locally; Phase 4.14 has only generic one-full-SHA-link structure, deliberately no fixed hash test. Phase 4.15/4.16 snapshots are governance/operator sources, not their Release C0 identities. Current path-safety/Release tests do not prove every historical version's outcome.

## Drafted correction

- Expanded only the existing Phase 5.2 retained-work section: all 17 original DEFER IDs have concrete protected failures and minimum re-review evidence, followed by the five A20 cross-owner categories and R25/B3/B4 retained boundaries.
- The ledger explicitly preserves the decision-time nature of the 17 labels, original tests unchanged, synthetic-only `NONE` proof, R23a partial coverage, and R30 link-shape versus exact identity distinction.
- Initial `git diff --check` passes. ID scan finds all 17 original DEFER labels; repeated R23 mentions are explanatory, not new register rows.
- Focused architecture/repository test run passed 47/47, including tracked Markdown link/explicit-anchor and history-role checks. Full Windows `npm test` passed 184/210 with 26 POSIX/Linux-only skips and 0 failures. These are local evidence only.
