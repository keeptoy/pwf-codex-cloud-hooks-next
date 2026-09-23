# Progress: B4e provenance current-role language

## 2026-09-23

- Announced and read planning-with-files skill; session catch-up found no unsynced context.
- Confirmed clean worktree and inspected R36 plus authority routes and prior B4d plan.
- Opened a provenance-only B4e scope. No test or macro-document content changed yet.
- Added a provenance-specific guard for `当前源码权威` and `current lifecycle role` as headings, status rows and direct role declarations; removed only those two broad R36 alternatives. Added four harmful and two harmless in-memory probes.
- Syntax, whitespace and focused repository-boundary checks passed (29/29). Full Windows regression remains.
- Full Windows suite initially passed 183/209 (26 POSIX-only skips). Diff review exposed a harmless direct owner-pointer sentence rejected by the value-agnostic guard; the added positive probe failed as expected (28/29), and the predicate was refined to allow ROADMAP-only references but reject explicit source/version/role identities even when ROADMAP is also mentioned. Focused/full checks must be rerun.
- An additional arbitrary source identity `feature/foo，见 ROADMAP` showed that merely filtering known role tokens still let a false declaration pass (expected failing-first 28/29). Tightened the exception to a predicate that begins as a ROADMAP pointer; an identity plus later link cannot qualify. Rerun required.
- Added forged `ROADMAP-forged` negative. The first suffix boundary also rejected valid sentence-final `ROADMAP.` (28/29); adjusted it to distinguish identifier continuation from punctuation. Final focused/full rerun remains.
- Final syntax, `git diff --check` and focused repository-boundary suite passed 29/29. Full Windows suite passed 183/209 with 26 POSIX-only skips and zero failures. Exact diff review found only the two provenance term alternatives replaced, with all immutable publication, SHA, acceptance, role-neutrality and count checks retained.
