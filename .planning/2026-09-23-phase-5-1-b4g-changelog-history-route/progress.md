# Progress: B4g CHANGELOG history route

## 2026-09-23

- Announced and read the planning-with-files skill; session catch-up found no unsynced context.
- Confirmed B4f `25487ae` committed, recovered its planning and clean worktree, and began the next R36 audit.
- Read the authority documents, governance guide and test call sites. Found the same CHANGELOG path ban in R30 and R36; chose a narrow inline-code literal exception while keeping active routes forbidden.
- Added a shared CHANGELOG helper at both call sites and harmful/harmless in-memory probes. The harmless literal failed under the broad rule as expected (28/29).
- Ignored only well-formed inline code spans before the existing path ban. Focused suite passed 29/29; full regression and diff review remain.
- Full Windows suite passed 183/209 (26 POSIX-only skips, zero failures). Syntax, `git diff --check` and scoped diff review passed; local commit remains.
