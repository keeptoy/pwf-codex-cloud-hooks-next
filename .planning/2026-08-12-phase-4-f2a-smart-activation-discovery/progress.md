# Progress: Phase 4 F2A Smart Activation Discovery

## 2026-08-12

- Maintainer authorized F2 exploration after F1 closeout; selected F2A Discovery as the only current scope.
- Re-read repository authorities, planning-with-files instructions and the completed F1 handoff; confirmed a clean `0.4.0-dev` worktree before creating this scope.
- Created a separate Discovery plan. Explicitly excluded implementation, F2B state, Cloud, Release and remote writes.
- Completed P0 evidence refresh. Official OpenAI Docs search found no public page establishing the repository's Hook event ABI, so retained the repository/Cloud evidence as the dated authority and recorded the limitation.
- Began P1 inventory: confirmed two independent legacy capability locks, one inactive `.mode` seam, pristine smart rendering support, private snapshot isolation and absence of any admitted workspace writer.
- Completed P1. Confirmed pristine smart rendering is reusable through an owned child environment, schemas already reserve the capability, and the same-file F1 seam would unnecessarily read unsafe old `.mode` files on unarmed upgrades.
- Completed P2. Selected `.pwf-codex-managed` with exact `codex-managed-v1\n` as the independent last-write commit point; `.mode` remains an inert upstream profile selector until that file is valid. Froze prepare/commit/confirm/disarm/re-arm and invalid-state semantics.
- Completed P3. Froze the atomic adapter/runtime `[legacy, smart]` capability change, two-pass token/mode revalidation, private-snapshot `PWF_INJECT=smart` handoff, existing v2 result/advisory semantics and continued F2B denied surface.
- Completed P4. Assigned portable/Linux/no-live Source/Candidate evidence to F2A implementation and retained real opt-in Fresh/Resume/cache/rollback lifecycle for F3.
- Reached `CONDITIONAL_GO_TO_F2A_IMPLEMENTATION`; began closeout documentation. No production, contract, manifest, Release behavior or real workspace state was changed.
- Added the Phase 4.4 Discovery summary, history index entry and current ROADMAP state. The history records the independent
  activation commit point, read-only production probe requirement, schema-v2 reuse, lifecycle handoff and F2A/F3 evidence split.
- Initial sandboxed `npm test` was uniformly blocked before test-file execution by Windows `spawn EPERM`; the identical suite
  outside the sandbox completed with 141 tests, 127 pass, 0 fail and 14 honest Windows/Linux-only skips. `git diff --check` passed.
- Re-ran the complete suite after the final ROADMAP/history edits with the same result: 141 tests, 127 pass, 0 fail and 14 honest
  Windows/Linux-only skips.
- Closed Discovery at `CONDITIONAL_GO`; implementation, real opt-in, F2B/F3, Cloud lifecycle, Release and remote writes remain
  unauthorized.
