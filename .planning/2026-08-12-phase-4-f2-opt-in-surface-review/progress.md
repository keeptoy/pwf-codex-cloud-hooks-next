# Progress: Phase 4 F2 opt-in surface review

## 2026-08-12

- Maintainer explicitly paused F2A construction and requested a Phase 4.1 status tail plus local/Cloud opt-in review.
- Re-read repository authorities, F2A Discovery and historical `v0.1.0 -> v0.2.0` trust/registration evidence; worktree was clean.
- Reviewed current official Codex approvals/security, CLI commands, Cloud environments/workflow and Hooks documentation.
- Separated Host trust/registration, Codex action approval and PWF product opt-in; selected plan-local exact state as the portable core.
- Classified Cloud interactive activation/persistence as F3 live evidence, not an F2A assumption; classified click-to-activate URL as
  current NO_GO with an explicit future re-open trigger.
- Began Phase 4.1 and ROADMAP clarification only; no production, activation state, Cloud task, external service or Release change.
- Added the Phase 4.1 post-implementation status tail and a stable ROADMAP anchor. Recorded that the independent commit point is a
  stricter realization of the original invariants, not an architecture rewrite.
- Extended the current F2 protocol authority with the three-control-plane split, the local/Cloud evidence boundary, F3 lifecycle
  handoff, model-visible-data rule and the exact future trigger for reconsidering a click-to-activate surface.
- `git diff --check` passed. Full Windows regression passed: 141 tests, 127 pass, 0 fail and 14 honest Linux/POSIX skips.
- Closed this documentation-only review. F2A implementation, real opt-in, Cloud lifecycle, external service and Release remain paused.
