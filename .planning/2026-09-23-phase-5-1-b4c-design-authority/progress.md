# Progress: B4c DESIGN authority checks

## 2026-09-23

- Announced and read planning-with-files skill; session catch-up reported no unsynced context.
- Recovered README, ARCHITECTURE, DESIGN, ROADMAP, Wiki and prior B4b plan; confirmed clean worktree.
- Opened a bounded DESIGN-only gate. No tests or macro-document contents changed yet.
- Added in-memory heading, status-row and prose declaration probes for previously uncovered R36 aliases, plus a harmless ROADMAP pointer. Failing-first focused run: 16/17 pass, one expected failure at `architecture-contracts.test.js:783` because the old helper accepts a competing `GitHub \`Latest\`` heading.
- Strengthened `assertDesignOwnerBoundaries` for all four R36 aliases across heading, status-row and direct-declaration shapes. Removed only the duplicate DESIGN term bans in the architecture test and excluded DESIGN from R36's broad macro-document loop; ARCHITECTURE/AGENTS and `Product Phase 4.*未授权` remain guarded.
- Syntax checks and `git diff --check` passed. Two focused governance suites passed 46/46 after the implementation.
- Full Windows suite passed 183/209, with 26 POSIX-only skips and zero failures. Exact diff review confirmed only the two DESIGN-related test sites and scoped planning changed.
