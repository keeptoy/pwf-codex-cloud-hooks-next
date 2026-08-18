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
- Created the self-contained F3C operator guide using exact protocol checkpoint `12a3590...`; focused guide, lifecycle and
  repository-governance tests passed 20/22 with only the two honest Linux-only skips.
- Updated DESIGN test routing and synchronized ROADMAP, version acceptance and Phase 4.10 post-implementation lifecycle status as
  local materialization complete / Linux no-live pending / Cloud rollback not run.
- Full Windows suite passed 146/171 with 25 honest Linux/POSIX skips and zero failures. Importer, Python/Node syntax, upstream
  100755 modes, dual 22-entry candidate build and Release-intersection checks passed; candidate SHA remained `df6001...`.
- The combined syntax command hit a sandbox-only Git Bash signal-pipe error while checking bootstraps; Bash syntax is being rerun
  outside the sandbox without weakening any assertion.
- Non-sandbox Bash syntax recheck passed for both bootstraps and every F3C guide Bash block. Local materialization is closed;
  Linux/no-live remains the only next gate and F3C2 is still unauthorized.
- Maintainer completed the ref-aware Linux/no-live gate from a full GitHub clone at exact checkout
  `cdc4a9eba7e7f1f2545723829ed1a6b4c76cb48b`. Published `v0.3.5` and `v0.3.4` tags resolved to the provenance-frozen commits.
- Operator guide section 3 passed 13/13 tests with zero failures, zero skips and final exit code 0; both smart and autonomous
  runtime-only revival cases executed. F3C1 is complete and work stops before separately authorized F3C2 live execution.
- Post-evidence documentation/static regression passed 28/30 locally with the same two Windows-only revival skips and zero
  failures; those two cases are already closed by the 13/13 ref-aware Linux run. `git diff --check` passed.

## 2026-08-18

- Clarified the self-contained operator guide with an explicit section-to-gate map, a plain-language F3C2 smart two-stage
  walkthrough, the single per-stage execution order, and a concrete full-clone/tag preflight for section 3.
- No transaction, frozen identity, production file, contract or Release input changed; F3C2 remains unauthorized.
- Focused Node run was again blocked before test-file execution by the known Windows sandbox `spawn EPERM`; rerun outside the
  child-process restriction without changing assertions.
- Non-sandbox focused regression completed with 20/22 pass, zero failures and the same two honest Linux-only skips; the operator
  guide test also syntax-checked every Bash block, including the new full-clone/tag preflight. `git diff --check` passed.

## Current status

`F3C1_PROTOCOL_NO_LIVE_PASS / REF_AWARE_LINUX_ZERO_SKIP / CLOUD_ROLLBACK_NOT_RUN / STOP_BEFORE_F3C2`
