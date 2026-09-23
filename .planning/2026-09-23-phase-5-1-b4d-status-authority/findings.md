# Findings: B4d current-status authority

## Entry baseline

- B4c `4251e12` is committed and the worktree was clean at entry. B4c moved DESIGN current-status guarding to `assertDesignOwnerBoundaries`, leaving ARCHITECTURE/AGENTS broad R36 bans unchanged.
- README/ROADMAP route current programme, Release, rollback and Latest lifecycle to ROADMAP. CHANGELOG owns already-occurred version deltas; provenance owns immutable published source and asset identity. The governance guide makes the same distinction.
- R36 still bans `GitHub \`Latest\`` in both CHANGELOG and provenance, and `production rollback` in CHANGELOG, anywhere in the file. These exact substrings are not currently present in those two files; the broad bans could reject harmless historical wording or a pointer to ROADMAP.
- The same R36 case separately protects CHANGELOG order/links, exact SHA absence, provenance published-ledger role neutrality, acceptance relationship and immutable identities. Those checks are not candidates here.

## Decision pending

Resolved: keep owner-specific status shape checks only. A heading explicitly labeled Current/当前, a status table row, or a label-style direct declaration is a competing current authority; past-tense historical narration and a sentence pointing to ROADMAP are not. This is a narrow lint, not a natural-language classifier.

## Cross-file audit

- Search across test modules found these remaining exact status-term bans only in R36 for CHANGELOG/provenance; the DESIGN owner guard is separate and already closed in B4c. No other test duplicates these two owners' `GitHub \`Latest\`` or `production rollback` broad bans.
- CHANGELOG currently records that prior versions completed Latest promotion using other wording; provenance's published ledger records each version's immutable closure. Neither document contains the exact backticked `GitHub \`Latest\`` phrase today. A historical mention or link to ROADMAP should be allowed, but a new current status declaration there would compete with ROADMAP.
- The current R36 regex also bans exact 64-character hashes in CHANGELOG, registered counts, provenance role language and other boundaries. Those alternatives remain unchanged. CHANGELOG `production rollback` shares the same current-status owner issue; provenance has no such term ban, so do not add one there.

## B4d evidence

- `assertNoMovingStatusAuthority` rejects a current-status heading, status table row or version/role identity declaration. It checks `GitHub \`Latest\`` in both documents and `production rollback` only in CHANGELOG. Historical narration, prose routing to ROADMAP and a label that says only `see ROADMAP` pass.
- A first implementation caught only label-style declarations. A new ordinary-sentence mutation (`Currently, GitHub \`Latest\` is v0.4.3`) failed as intended before refinement; the refined identity check catches it without rejecting a pure ROADMAP pointer.
- Focused repository-boundary suite passed 29/29 after refinement. Full Windows suite passed 183/209 with 26 POSIX-only skips and zero failures. Syntax and `git diff --check` passed; Windows skips are not Linux/Cloud evidence.
