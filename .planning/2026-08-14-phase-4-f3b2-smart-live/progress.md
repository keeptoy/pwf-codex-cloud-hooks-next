# Progress: Phase 4 F3B2 smart live chain

## 2026-08-14

- Maintainer explicitly authorized entry into F3B2 smart live and kept F3B3/F3B4/F3C/Release unauthorized.
- Re-read repository authorities, recovered the clean `0.4.0-dev` HEAD, F3B1 stop line, runbook transaction, smart DAG and evidence schema.
- Rechecked the official Cloud lifecycle: selected branch/commit checkout precedes setup/agent execution; cached resume may run maintenance.
- Started the markerless F3B2 active planning scope. No profile or activation state has been created yet.
- First focused Node run was blocked before test execution by Windows sandbox `spawn EPERM`; recorded as an environment limitation and
  retained the exact assertions for an approved non-sandbox rerun.
- The non-sandbox rerun executed 18 tests: 17 passed and one governance assertion found that the updated current-programme row had
  dropped the existing same-line `F1 foundation ... complete` summary. Restored that stable fact without changing F3B2 scope.
- Focused rerun passed 18/18. Full Windows regression passed 139 with 0 failures and 23 honest Linux/POSIX skips (162 total).
- Importer check, Python compile, installer syntax and diff check passed. Two independent candidate builds were byte-identical:
  22 entries, 85,533 bytes, SHA-256 `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`.
- Markerless foundation is ready for a local commit; no machine state or Release input changed.

## Verification log

| Check | Result |
|---|---|
| Initial worktree | clean `0.4.0-dev` |
| Initial active state | markerless legacy |
| Remote writes | none |
| First focused test attempt | sandbox `spawn EPERM`; no product assertion executed |
| First executed focused run | 17/18 pass; one documentation lifecycle assertion drift corrected |
| Focused rerun | 18/18 pass |
| Full Windows regression | 162 total; 139 pass; 0 fail; 23 honest platform skips |
| Candidate reproducibility | 22 entries; 85,533 bytes; exact pre-F3B2 SHA preserved |

## Current status

`F3B2_AUTHORIZED / MARKERLESS_FOUNDATION_VERIFIED / READY_FOR_LOCAL_COMMIT`
