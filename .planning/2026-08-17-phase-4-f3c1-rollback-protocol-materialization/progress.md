# Progress: Phase 4 F3C1 rollback protocol materialization

## 2026-08-17

- Maintainer explicitly authorized F3C1 implementation after the exact-HEAD audit passed.
- Re-read repository authorities and recovered the completed audit at local commit `cd2effc`.
- Created this separate markerless implementation scope. No production/install/Cloud/ref mutation has occurred.
- Logged and corrected one PowerShell-only active-plan path error caused by an untrimmed newline.
- Added the mandatory immutable v0.3.5 direct-over-current refusal test. Its first run was blocked by Windows sandbox
  `spawn EPERM` before the test file started; this is being rerun outside the child-process restriction.
- Reran the exact publication oracle outside the child-process restriction: 9/9 passed. Direct downgrade refusal occurred
  before any runtime/requirements/backup mutation, and current doctor remained healthy.
- Added a distinct rollback evidence validator and relational tests; the focused F3B/F3C protocol run passed 5/7 with the two
  expected Linux-only runtime revival cases honestly skipped on Windows.

## Current status

`F3C1_IMPLEMENTATION_IN_PROGRESS / RELEASE_EXCLUDED / NO_LIVE / STOP_BEFORE_F3C2`
