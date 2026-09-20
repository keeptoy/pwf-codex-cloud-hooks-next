# Progress Log: 0.5.0 development-candidate initialization

## Session: 2026-09-20

### Phase 1: Recover and freeze scope

- **Status:** complete
- Renamed the local branch from `0.4.4` to `0.5.0`.
- Removed stale upstream tracking of `origin/0.4.4`; no remote write occurred.
- Created `Wiki.md` and migrated the complete local-development and development-ZIP guidance from README.
- Updated documentation authority maps and current-train statements.
- Deleted 21 tracked files belonging to seven completed obsolete planning scopes; `.planning/.active_plan` was retained and redirected to the fresh scope.
- Ran the full test suite outside the sandbox after the sandbox returned `spawn EPERM`.
- Full execution result before candidate rotation: 158 pass, 5 fail, 26 platform skips. Two failures were moved-document test assumptions; three were the expected sealed-asset mismatch caused by changed README ZIP bytes.
- Received explicit maintainer authorization to initialize `0.5.0` and retain a new active planning scope.

### Phase 2: Initialize the candidate identity

- **Status:** complete
- Created this scope and set `.planning/.active_plan` to it.
- Confirmed HEAD/tag separation and mapped the small set of current candidate identity fields; historical `v0.4.4` evidence remains out of the rewrite set.
- Confirmed that candidate initialization also requires rotating the installed-state predecessor from `0.4.3` to accepted `0.4.4`, including its canonical upstream hash and manifest integrity reference.
- Reproduced the existing predecessor canonical hash and derived the accepted `v0.4.4` upstream canonical hash from immutable tag `f7032fd`.
- Rotated package and contract fields to `0.5.0-dev`, set accepted predecessor `0.4.4`, updated current-train documentation/tests, and calculated both new contract integrity hashes.
- Generated the canonical `v0.5.0-dev` zero-hash bootstrap from the repository template.
- Targeted identity, Release asset, repository boundary, and architecture assertions now pass, including the final 9/9 architecture-only rerun.

### Phase 3: Validate

- **Status:** complete
- Full suite passed 163/163 runnable tests with 26 honest platform skips.
- Importer check, Python compile, Node syntax, candidate-bootstrap identity, `git diff --check`, upstream modes, and elevated bootstrap Bash syntax all passed.
- Final scope audit found the earlier optional-planning policy projection must be narrowed back to this repository's required active scope semantics.
- Restored the repository-wide required active-planning authority in AGENTS, README/DESIGN/handoff, ROADMAP, governance, Product Phase index, CHANGELOG, and tests while retaining the new Wiki routing and the one fresh scope.
- Re-ran the full suite after that restoration: 163 pass, 0 fail, 26 Windows/POSIX platform skips.
- Reviewed the final scope: published `v0.4.4` bootstrap bytes remain unchanged; accepted/fallback roles remain `v0.4.4`/`v0.4.3`; no runtime, Host ABI, remote, tag, or Release change was introduced.

### Phase 4: Commit and hand off

- **Status:** complete
- Final planning evidence is current; the scoped local commit and maintainer-owned push handoff are the atomic closeout action for this record.
- The final diff audit removed accidental command-output metadata from the README header, then re-ran the entire validation baseline successfully.

## Test Results

| Test | Expected | Actual | Status |
|---|---|---|---|
| Sandboxed `npm test` | Suite executes | All 20 test files failed to spawn with `EPERM` | platform limitation |
| Elevated `npm test` before candidate rotation | Identify real regressions | 158 pass, 5 fail, 26 skip; remaining Release failures traced to sealed `v0.4.4` mismatch | diagnostic complete |
| Targeted architecture/repository tests after planning restoration | Moved links and required planning semantics pass | 27 pass, 0 fail | pass |
| Published Release oracle | accepted `v0.4.4` and fallback `v0.4.3` remain exactly recoverable | 9 pass, 0 fail | pass |
| Full `npm test` after oracle migration | No product/test failures; Windows-only cases remain honest skips | 163 pass, 0 fail, 26 skip | pass |
| Final full `npm test` after planning-policy restoration | No product/test failures; Windows-only cases remain honest skips | 163 pass, 0 fail, 26 skip | pass |

## Error Log

| Timestamp | Error | Attempt | Resolution |
|---|---|---:|---|
| 2026-09-20 | `git branch -m 0.5.0` permission denied in sandbox | 1 | Approved local-only elevated retry succeeded. |
| 2026-09-20 | `.git/config` lock denied while unsetting upstream | 1 | Approved local-only elevated retry succeeded. |
| 2026-09-20 | `npm test` child-process spawn `EPERM` | 1 | Approved elevated test execution exposed real results. |
| 2026-09-20 | Release ZIP/bootstrap SHA mismatch | 1 | Root cause is README byte change under sealed `v0.4.4`; initialize `0.5.0` candidate. |
| 2026-09-20 | Planning update patch context mismatch | 1 | Read exact lines and split the patch by file. |
| 2026-09-20 | Node canonical-hash helper received `spawnSync git EPERM` | 1 | Switch to a shell pipeline so Node reads Git output from stdin without spawning a child. |
| 2026-09-20 | Targeted suite: 34 pass, 5 fail | 1 | Candidate ZIP/bootstrap and contract tests passed; failures are ROADMAP wording order, one moved Wiki assertion, and stable-test version-literal guards. |
| 2026-09-20 | Targeted suite: 38 pass, 1 fail | 2 | All identity, ZIP, planning, and moved-guide assertions pass; corrected the last ROADMAP regex to follow actual “不授权Product Phase 5” word order. |
| 2026-09-20 | Architecture-only rerun: 8 pass, 1 fail | 3 | A stale Phase 5 route-placeholder assertion surfaced after the earlier failure cleared; updated it to candidate-active/Product-inactive semantics while keeping the test version-neutral. |
| 2026-09-20 | Patch context mismatch on the Phase 5 assertion | 1 | Inspected the exact one-line assertion and applied an exact targeted hunk. |
| 2026-09-20 | Full suite: 162 pass, 1 fail, 26 skip | 1 | All candidate and migration behavior passed; the v0.4.4 oracle still asked the current candidate contract for the accepted bootstrap filename. Inspect and make the published oracle role-aware. |
| 2026-09-20 | Sandboxed Git Bash `bash -n` launch failed with Win32 error 5 | 1 | Importer, Python compile, Node syntax, diff check, modes, and candidate bootstrap check passed; retry Bash syntax outside the sandbox. |

## 5-Question Reboot Check

| Question | Answer |
|---|---|
| Where am I? | Phase 3, complete local validation. |
| Where am I going? | Final diff review, local commit, and handoff. |
| What is the goal? | A coherent `0.5.0-dev` candidate on branch `0.5.0` with one active planning scope and README/Wiki split. |
| What have I learned? | README is a ZIP input; the accepted `v0.4.4` bootstrap cannot represent changed source bytes. |
| What have I done? | See Phase 1 and Phase 2 above. |
