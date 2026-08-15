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

## 2026-08-16

- Maintainer completed the real Cloud `S_PREP → S_ARM → S_DISARM → S_REARM` chain against frozen runtime source
  `b37eea4706fed8d4e764f824eb75a3820f31c9be` and candidate SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`.
- All four setup/maintenance transactions and stage-aware workspace preflights returned PASS with explicit final exit code 0. The exact
  workspace HEADs remained the frozen validation refs and every Cloud worktree stayed clean.
- Actual profile sequence was prepared `legacy`, armed `smart`, disarmed `legacy`, rearmed `smart`. Host SessionStart startup,
  UserPromptSubmit and plan context were observed; `S_ARM` additionally completed the required real Resume.
- Every production probe returned the expected effective profile with `advisory=null`; doctor stayed healthy/managed/not repairable with
  no errors or blockers, snapshot leftovers stayed zero, and every evidence JSON passed `validateF3EvidenceRecord()`.
- Cache state remained honestly `unknown`; no cache behavior was inferred from expected text. Extra actual Resume observations in continued
  conversations were recorded as facts and were not used to replace the mandatory `S_ARM` Resume.
- F3B2 is closed as a reversible smart opt-in lifecycle PASS. F3B3/F3B4/F3C/Release remain unauthorized; no autonomous state, rollback,
  production/contract/Release-byte change or local remote write was performed during closure.
- A proposed README status promotion was detected as a Release-byte change: the trial build produced a new unaccepted candidate. Reverted
  that ZIP-entry edit, recorded the deferral in ROADMAP/acceptance, and rebuilt the exact accepted 22-entry / 85,533-byte `df6001…`
  candidate. README can only be promoted in a future candidate transaction with fresh Cloud validation.
- Final closeout verification passed: focused lifecycle/governance/Release tests 29/29; full Windows suite 162 total / 139 pass / 0 fail /
  23 honest platform skips; importer, Python compile, installer/bootstrap syntax and diff checks passed. Final build/check again produced the
  exact accepted 22-entry / 85,533-byte candidate SHA-256 `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`.
- Added a post-closeout newcomer explanation for the three independent state layers: workspace lifecycle action, repository machine-state
  shape and actual production profile. Used `S_DISARM / smart_prepared / legacy` as the canonical example and explicitly separated
  `EXPECTED_EFFECTIVE_PROFILE` from the authoritative production probe result. No gate status, runtime or Release input changed.
- Three-layer documentation verification passed: focused F3/governance/Release 18/18; full Windows suite 162 total / 139 pass / 0 fail /
  23 honest platform skips. Candidate build/check remained 22 entries, 85,533 bytes and exact SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`; all changed paths are Release-excluded.

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
| F3B2 Cloud runtime/candidate identity | exact frozen source and 22-entry candidate SHA matched in all four stages |
| F3B2 Cloud profile chain | `legacy → smart → legacy → smart`; S_ARM Fresh + real Resume |
| F3B2 Cloud health/residue | four doctor passes; zero leftovers; clean worktrees; explicit exit code 0 |
| F3B2 evidence records | prepared/armed/disarmed/rearmed all `F3_EVIDENCE_RECORD_V1=PASS` |
| Final local closeout | focused 29/29; full 162 total / 139 pass / 0 fail / 23 platform skips; exact candidate SHA preserved |

## Current status

`F3B2_SMART_LIVE_PASS / REVERSIBLE_OPT_IN_CONFIRMED / STOP_AND_REVIEW / F3B3_NOT_AUTHORIZED`
