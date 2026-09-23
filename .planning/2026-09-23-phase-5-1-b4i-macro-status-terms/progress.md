# Progress: B4i macro-doc status terms

## 2026-09-23

- Announced and read planning-with-files; session catch-up found no unsynced context.
- Confirmed B4h `e0ebba1` committed, recovered its planning and clean worktree, and opened a read-first B4i audit.
- Reviewed README/ARCHITECTURE/DESIGN/ROADMAP/Wiki authority routes and R36/test duplicates. Found only the broad ARCHITECTURE/AGENTS guard; DESIGN provides a narrow precedent with positive owner-pointer probes.
- Added failing-first probes; the owner pointer failed under the broad check as expected (28/29). Replaced it with a heading/row/declaration guard. First focused rerun failed because two probes expected the old generic diagnostic rather than the new specific heading/row messages; corrected expectations.
- Focused repository-boundary suite passed 29/29 after the correction. Reviewing line wrapping before full regression.
- Added wrapped `GitHub Latest` and `production rollback` harmful probes plus a wrapped owner-pointer positive. Focused suite passed 29/29; full regression and exact diff review remain.
- Added exact Markdown-link owner-pointer positive and wrong-target negative. Focused suite passed 29/29; full regression needs rerun after this final adjustment.
- Final full Windows suite passed 183/209 (26 POSIX-only skips, zero failures). Syntax, `git diff --check` and scoped diff review passed; local commit remains.
