# Progress: B4d current-status authority

## 2026-09-23

- Announced and read planning-with-files skill; session catch-up found no unsynced context.
- Recovered active B4c plan and checked clean worktree; reviewed root authority routes and R36, CHANGELOG, provenance.
- Opened a bounded B4d scope; no test or document content has changed yet.
- Added `assertNoMovingStatusAuthority` for CHANGELOG's Latest/rollback and provenance's Latest status labels; retired only those exact broad-ban alternatives. In-memory probes reject current-status headings, rows and declarations while allowing historical narration and prose that routes current status to ROADMAP.
- `node --check`, `git diff --check` and focused repository-boundary suite passed (29/29). Full Windows regression remains.
- Full Windows suite first passed 183/209 (26 POSIX-only skips). Diff review exposed a missed ordinary-sentence declaration and a harmless label pointer; added both probes. The new harmful probe failed as intended (28/29), then the guard was refined to test explicit status identity rather than any colon-labeled text. Focused/full checks need rerun after this refinement.
- After refinement, `node --check`, `git diff --check` and focused repository-boundary suite passed 29/29. Full Windows suite again passed 183/209, with 26 POSIX-only skips and zero failures.
- Reviewed exact R36 diff: only the two documents' status-term alternatives were replaced; SHA, role, count, route, macro-document and history checks were retained.
