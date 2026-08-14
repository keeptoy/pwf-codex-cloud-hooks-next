# Progress: Phase 4 opt-in purpose clarification

## 2026-08-14

- Maintainer paused F3B2 and authorized a documentation-only newcomer clarification.
- Re-read planning-with-files and OpenAI Docs skill instructions, ran session recovery, confirmed a clean `0.4.0-dev` worktree and
  recovered the completed F3B1 stop line.
- Rechecked official sandbox, approval and Cloud environment documentation. Frozen the three distinct authorization objects and the
  rule that Cloud root/path observations and cache behavior are platform facts, not PWF opt-in semantics.
- Refined the newcomer model to four switches by separating system-managed Hook trust from both platform execution permission and
  plan-local profile consent.
- Added a stable Phase 4 purpose anchor and plain-language F0～F3C construction goals to ROADMAP. Added a clearly post-implementation
  opt-in clarification to historical Phase 4.1 without rewriting its original Discovery decision.
- First focused governance run passed all new opt-in semantics but found the new planning scope lacked the mandatory `## Next Step`
  heading. Added the exact stop-before-F3B2 next step; no documentation boundary changed.
- Focused governance rerun passed 17/17. Full Windows regression passed 139 with 0 failures and 23 honest Linux/POSIX skips
  (162 total). Release-package and repository-boundary cases confirm docs/history/planning/tests remain outside candidate inventory.
- Final diff check passed. The documentation-only gate is ready for one local commit and stops before F3B2.
