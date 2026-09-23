# Findings: B4c DESIGN authority checks

## Baseline

- B4b `daa2fc5` passed focused 29/29 and Windows full 183 pass / 26 POSIX-only skip / 0 fail; worktree clean at B4c entry.
- README routes implementation structure to DESIGN, current programme/Release/rollback to ROADMAP, and the unique Next Step to active planning. DESIGN's own positioning table makes the same current-programme route explicit.
- Prior read-only audit found broad `当前生产回滚|GitHub \`Latest\`` bans in `tests/architecture-contracts.test.js` and the macro-document loop in `tests/repository-boundary.test.js`. `assertDesignOwnerBoundaries` already has declaration-shaped guards and a harmless pointer probe, but the broad bans still block that prose when evaluating the whole suite.

## Decision pending

Resolved: the DESIGN helper now owns structural guards for the four R36 aliases. The coordinated change removed only overlapping DESIGN broad-ban alternatives, while R36 still bans ARCHITECTURE/AGENTS and the architecture test still retains `Product Phase 4.*未授权`.

## Discovery cross-check

- Frozen Phase 5.1 Discovery permits B4 only as owner-specific, staged R36 work after aligning current/cold identity; it requires harmful mutations to fail and equivalent explanations to pass. It explicitly leaves R35/R38 and other DEFER groups alone.
- This candidate is limited to a DESIGN-only duplicate: `architecture-contracts` has both a broad DESIGN ban and `assertDesignOwnerBoundaries`; R36 has another broad macro-doc ban. ROADMAP remains current programme/rollback owner, and DESIGN is an implementation map, not a status source.
- The governance guide also assigns module layout to DESIGN and current candidate/accepted/rollback state to ROADMAP. It recommends testing ownership relationships, not freezing generic prose.
- `assertDesignOwnerBoundaries` checks positioning-table owner links, current-state headings, role table rows, and direct rollback/Latest assertions. Existing mutation probes already cover a wrong owner, heading, row, prose declaration, and safe `GitHub \`Latest\`` pointer. It does not yet cover all four R36 aliases (`当前生产回滚`, `当前回退层级`, `GitHub \`Latest\``, `production rollback`) in each declaration shape.
- `tests/architecture-contracts.test.js:701` has a broad DESIGN ban with independent `Product Phase 4.*未授权` alternative. Retain that phase-specific alternative unchanged in this gate. `tests/repository-boundary.test.js:2033` applies one broad regex to ARCHITECTURE, DESIGN, AGENTS; keep ARCHITECTURE/AGENTS unchanged and remove DESIGN only after the helper gains equivalent negative probes.

## B4c evidence

- Failing-first: the added `## GitHub \`Latest\`` second-authority heading was accepted by the old helper, so the focused suite failed at the expected probe before implementation.
- The strengthened helper rejects heading, status-row and direct-declaration shapes for `当前生产回滚`, `当前回退层级`, `GitHub \`Latest\`` and `production rollback`. Its existing owner-link checks remain, and explanatory pointers to ROADMAP pass.
- Focused governance suites passed 46/46. Full Windows regression passed 183/209, with 26 POSIX-only skips and zero failures. `node --check` on both changed tests and `git diff --check` passed. Windows skips are not Linux/Cloud evidence.
