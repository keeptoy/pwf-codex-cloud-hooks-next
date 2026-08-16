# Progress: Phase 4 F3B3 autonomous materialization

## 2026-08-16

- Maintainer authorized the bounded materialization step after Phase 4.8 conditional-go.
- Created a new markerless active planning scope. No autonomous state/ref, Cloud task, tamper or Release input has been created yet.
- `PWF_F3B3_RAW_PROGRESS_MUST_NOT_APPEAR` is an intentional acceptance sentinel: legacy may expose this progress line, autonomous must not.
- Preflight found all six target refs absent and rebuilt the unchanged 22-entry / 85,533-byte candidate with SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`.
- Committed markerless `A_BASE` at `a6fa03159a442b917f893fc51a7e3ed45b37371a` and created the matching local
  `validation/v0.4.0-dev-f3b3-runtime-source` ref. Development remained markerless and clean immediately afterward.
- Materialized all five autonomous state transitions in an isolated worktree. Exact state sequence passed as
  `legacy → autonomous_prepared → autonomous_armed → autonomous_prepared → autonomous_prepared → autonomous_armed`.
- Verified direct parents, exact path sets, initial/reprepared task hashes, distinct nonces, matching attestations, zero ledgers and no
  tamper ref. Removed the clean disposable worktree while retaining all six local refs.
- Added the self-contained F3B3 autonomous Cloud operator guide. It freezes the six local identities, exact task/nonce transitions,
  one setup/maintenance transaction, five positive stages, one disposable tamper stage, two mandatory Resume checkpoints and six
  evidence records without claiming or authorizing live PASS.
- Appended Phase 4.8 post-implementation reconciliation and synchronized the history index, ROADMAP and v0.4.0-dev acceptance. They now
  distinguish local materialization PASS from autonomous Cloud live `NOT_AUTHORIZED` while retaining the original Discovery semantics.
- Added focused repository guards for guide anchors/identities/tamper refusal/Bash fences and updated programme-status assertions.

## Verification log

| Check | Result |
|---|---|
| Initial branch/worktree | clean `0.4.0-dev` at `3c7aaef` |
| Discovery decision | conditional-go to materialization; live not authorized |
| Target ref collision scan | all six local refs absent |
| Markerless candidate | 22 entries; 85,533 bytes; exact accepted development SHA unchanged |
| A_BASE repository state | `legacy`; exact local source ref equals `a6fa03159a442b917f893fc51a7e3ed45b37371a` |
| Autonomous DAG | exact parent/path/state/hash audit PASS; six refs frozen; no tamper ref |
| Disposable worktree | removed cleanly after evidence capture |
| Operator guide PowerShell preflight | six exact refs, direct parents/paths, state hashes/nonces, no tamper ref and fixed candidate PASS |
| Focused docs/F3 tests | 20 tests; 20 pass; 0 fail; 0 skipped; all six guide Bash fences syntax-valid |
| Full Windows suite | 164 tests; 141 pass; 0 fail; 23 honest Linux/POSIX skips |
| Importer / source syntax | importer healthy; owned Python compile PASS; `install.js` and every bootstrap syntax PASS |
| Deterministic candidate | two independent 22-entry / 85,533-byte builds identical; exact accepted dev SHA unchanged |
| Whitespace | `git diff --check` PASS |
| Remote writes | none |

## Current status

`F3B3_LOCAL_MATERIALIZATION_PASS / CLOUD_LIVE_NOT_AUTHORIZED / STOP_BEFORE_F3B4`
