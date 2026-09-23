# Progress: R36 wording boundaries

## 2026-09-23

- Announced and read planning-with-files skill; session catch-up returned no unsynced report.
- Confirmed clean worktree and completed B4/R36a plan; opened bounded B4b plan.
- No test or macro-document change yet.
- Audited R36's remaining bans and nearby architecture-contracts tests. Avoided a DESIGN-only change because another broad ban in that test file would defeat the harmless case; selected CHANGELOG/provenance `Next Step` as a bounded declaration-vs-explanation replacement.
- Added `assertNoNextStepAuthority` and eight harmful plus two harmless in-memory checks, retiring only the `Next Step` alternative from two R36 whole-document bans. Focused repository-boundary suite passed 29/29; syntax and diff checks passed.
- Full Windows suite passed 183/209, with 26 POSIX-only skips and zero failures. Reviewed the exact R36 test diff; no other owner or identity bans were changed.
