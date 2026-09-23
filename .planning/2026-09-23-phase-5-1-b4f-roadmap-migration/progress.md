# Progress: B4f ROADMAP migration history boundary

## 2026-09-23

- Announced and read planning-with-files skill; session catch-up found no unsynced context.
- Recovered the document read order, previous plan and clean worktree. Checked R36, ROADMAP, provenance and the historical pre-relocation ROADMAP shape.
- Opened a ROADMAP-only B4f scope. No test or macro-document content changed yet.
- Added the current broad check as a helper and harmful/harmless mutations. The harmless pointer failed as expected (28/29).
- Narrowed the helper to retired migration headings and M1/M2 result-table rows. Focused repository-boundary suite passed 29/29. Full regression and diff review remain.
- Full Windows suite passed 183/209 with 26 POSIX-only skips and zero failures. Syntax, `git diff --check` and exact diff review passed; only the ROADMAP-specific R36 guard, probes and scoped planning changed.
- Added the symmetric M2 heading negative, fixed assertion formatting and reran focused suite: 29/29 passed. Scoped local commit remains.
- Final full Windows suite after the M2 negative passed 183/209 with 26 POSIX-only skips and zero failures.
