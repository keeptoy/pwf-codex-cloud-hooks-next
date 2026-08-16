# Progress: Phase 4 F3B4 evidence closure Discovery

## 2026-08-16

- Maintainer authorized the bounded F3B4 mini-Discovery after F3B3 Cloud live closeout.
- Recovered a clean `0.4.0-dev` worktree and the completed F3B3 planning record.
- Created a separate markerless Discovery scope. No production, validation ref, Cloud or Release mutation is authorized.
- Reconciled all eleven F3B2/F3B3 validation refs against exact local and remote-tracking commits; parent/path/state relations match the
  frozen smart and autonomous DAGs, and no tamper ref exists.
- Rehashed the three exact task blobs: smart and both autonomous digests match accepted evidence. Confirmed F3B3 source descends from
  F3B2 source while their production/Release inputs remain identical.
- Scanned the development tree for machine state, temp ZIP/scripts, snapshots/cache, evidence JSON and duplicate inventory; active state
  is markerless legacy and no live residue was found.
- Froze opaque Cloud task identity as `NOT_EXPORTED / NOT_REQUIRED_BY_EVIDENCE_V1`; retained the existing multi-authority evidence tuple
  instead of inventing a task ID or a second JSON contract.
- Added Phase 4.9, a Phase 4.8 handoff tailnote, history index, ROADMAP/acceptance conditional-go status and repository guards. Closure
  implementation and F3C remain unauthorized.
- Focused suite passed 21/21. Full Windows suite passed 142/165 with 23 honest Linux/POSIX skips and zero failures; importer, Python/Node/
  Bash syntax and whitespace checks passed.
- Two independent candidate builds remained exactly 22 entries, 85,533 bytes and the accepted development SHA-256; no Release input moved.

## Verification log

| Check | Result |
|---|---|
| Initial branch/worktree | clean `0.4.0-dev` |
| Smart ref DAG | exact runtime + four lifecycle refs; local/remote-tracking identities and paths PASS |
| Autonomous ref DAG | exact runtime + five lifecycle refs; no tamper ref; local/remote-tracking identities and paths PASS |
| Exact task hashes | smart initial + autonomous initial/reprepared all match accepted SHA-256 |
| Development admission | `legacy`; no machine state |
| Residue scan | no live state, ZIP, snapshot/cache, evidence JSON or duplicate inventory |
| Focused suite | 21 tests; 21 pass; 0 fail; 0 skipped |
| Full Windows suite | 165 tests; 142 pass; 0 fail; 23 honest Linux/POSIX skips |
| Importer / syntax / whitespace | PASS |
| Deterministic candidate | two exact 22-entry / 85,533-byte builds; accepted SHA unchanged |

## Errors encountered

- A first PowerShell boolean wrapper around `git merge-base --is-ancestor` printed `NO` because a successful silent native command emits
  no pipeline object. The explicit merge-base output and graph proved the F3B2 source is the merge base/ancestor; no repository fact changed.
- The first Git Bash byte-hash command allowed MSYS path conversion to rewrite `ref:path` and lacked a useful result. It was rerun with
  `MSYS_NO_PATHCONV=1` and `pipefail`, producing all three expected SHA-256 values.

## Current status

`CONDITIONAL_GO_TO_F3B4_EVIDENCE_CLOSURE / IMPLEMENTATION_NOT_AUTHORIZED / F3C_NOT_AUTHORIZED`
