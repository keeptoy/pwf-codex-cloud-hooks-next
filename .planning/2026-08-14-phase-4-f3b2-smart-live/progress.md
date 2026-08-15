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
- Created markerless foundation commit `b37eea4706fed8d4e764f824eb75a3820f31c9be`.
- Materialized the isolated local smart DAG with four frozen `validation/*` refs. Every node passed exact state bytes, direct-parent and
  one-path `diff-tree --no-renames` checks. Returned the primary worktree to `0.4.0-dev`; active state validates as `legacy`.
- No push, PR, tag, Release, Cloud configuration or other remote write occurred.
- Final focused lifecycle/governance rerun passed 18/18. Final full Windows regression again passed 139 with 0 failures and 23 honest
  Linux/POSIX skips (162 total).
- Final candidate build/check preserved 22 entries, 85,533 bytes and exact SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`; development branch remained markerless legacy.
- Local work is ready for a markerless handoff commit. F3B2 remains open because no real Cloud Fresh/UserPrompt/Resume evidence exists.
- Added a frozen local runtime-source transport ref at the already-verified markerless foundation; it creates no new commit or state and
  prevents the Cloud handoff from depending on a moving development branch name.
- Reconciled Phase 4.7 with the materialized F3B2 local chain. Added an explicitly pre-live `Post-implementation status — F3B2`, recorded
  the dedicated-branch-vs-extra-worktree implementation detail, froze the transport-ref role, and added lifecycle/review conditions.
- Corrected active findings so later handoff documentation commits no longer appear eligible to replace the frozen runtime source.
- Focused F3 lifecycle/protocol/repository verification passed 18/18. Full Windows regression passed 139 with 0 failures and 23 honest
  Linux/POSIX skips (162 total); Release/package guards confirm the history/planning/test-only change stays outside candidate inventory.
- Drafted an uncommitted beginner operator guide beside the canonical F3 runbook. It separates Host prompt observation from the installed
  production probe, fills the frozen runtime/candidate/stage identities, explains all generic placeholders and records that a docs-only
  handoff commit moves only `0.4.0-dev`, not the frozen runtime source, lifecycle refs or Release-excluded candidate bytes. Maintainer review
  is required before this draft is committed; no remote write or live Cloud action occurred.
- Draft validation passed: all four Bash fences parse, the PowerShell preflight parses, `git diff --check` is clean, and focused
  F3 lifecycle/protocol/repository/Release tests passed 21/21 with zero skips. No script body was executed against Cloud or remote state.
- Expanded the draft into an operationally self-contained F3B2 manual: embedded the exact setup/maintenance transaction, added explicit
  Cloud environment configuration, documented that all plan records are pre-committed validation inputs, inserted a stage-aware read-only
  workspace preflight before the execution sequence, and embedded the evidence schema/validator flow. Corrected the prompt contract so
  Host observation checks the visible exact task title/content while shell evidence proves the otherwise invisible plan-directory ID.
- Revalidation passed: the embedded runtime transaction was byte-for-byte equal to the frozen transaction, all six Bash fences and the PowerShell
  fence parse, and focused F3 lifecycle/protocol/repository/Release tests again passed 21/21 with zero skips. The guide remains uncommitted
  pending maintainer review; no Cloud action, remote write, lifecycle ref movement or Release-byte change occurred.
- Simplified the operator order after maintainer review: setup/maintenance now combines the unchanged runtime transaction core with an exact
  four-HEAD workspace preflight before the model starts; the first prompt is observation-only; the second prompt runs the sole final
  production/doctor/residue verifier; evidence validation comes last. Removed the alternative two-script ordering and documented that its
  evidence command is Bash wrapping inline Node JavaScript imported from `tests/f3-lifecycle-helpers.js`.
- Final static/focused recheck for this revision passed: all five remaining Bash fences and the PowerShell fence parse; focused F3
  lifecycle/protocol/repository/Release tests passed 21/21 with zero skips. No setup/install body was executed and the draft remains
  uncommitted pending maintainer confirmation.

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
| Smart validation DAG | four exact local refs; parent/path/state relations pass |
| Runtime source transport | frozen local ref points exactly to markerless `b37eea4` foundation |
| Development branch after DAG | clean markerless `0.4.0-dev`; repository state `legacy` |
| Final focused verification | 18/18 pass |
| Final full Windows regression | 162 total; 139 pass; 0 fail; 23 honest platform skips |
| Final candidate check | exact 22-entry / 85,533-byte SHA preserved |
| Phase 4.7 F3B2 reconciliation | focused 18/18; full 162 total / 139 pass / 0 fail / 23 platform skips |

## Current status

`F3B2_AUTHORIZED / LOCAL_SMART_DAG_VERIFIED / CLOUD_HANDOFF_PENDING / LIVE_PASS_ABSENT`
