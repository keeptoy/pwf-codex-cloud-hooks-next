# Progress: B4h CHANGELOG migration label

## 2026-09-23

- Announced and read planning-with-files; session catch-up found no unsynced context.
- Confirmed B4g `47afeac` committed, recovered its planning and clean worktree, and opened a read-first B4h audit.
- Read current authority docs and searched current CHANGELOG/provenance/test references. Historical parent-tree CHANGELOG lookup failed because the file was absent; recorded and switched to direct commit inspection.
- Inspected `81d2789` and `9fd9bb5` CHANGELOG deltas plus the governance guide. Identified the retired source-label construction and the current exact provenance anchor; selected a narrow declaration-shape guard for probes.
- Added harmful/harmless in-memory probes under the old broad helper; the historical “旧称” example failed as expected (28/29).
- Narrowed the CHANGELOG-only helper to old-source declaration shapes. Focused suite passed 29/29; added symmetric direct-claim and historical-explanation probes, so final checks remain.
- Exact diff review found a line-wrap bypass for plain old-source attribution. Added a paragraph-level attribution check and a wrapped negative; focused suite passed 29/29. Full regression must be rerun after this adjustment.
- Final full Windows suite passed 183/209 (26 POSIX-only skips, zero failures). Syntax, `git diff --check` and exact diff review passed; scoped local commit remains.
