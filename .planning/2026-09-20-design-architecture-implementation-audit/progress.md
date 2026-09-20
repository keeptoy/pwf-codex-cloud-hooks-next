# Progress Log: DESIGN/ARCHITECTURE implementation audit

## Session: 2026-09-20

### Phase 1: Authority and implementation inventory

- **Status:** complete
- Created a dedicated read-only audit scope and selected it through `.planning/.active_plan`.
- Confirmed the worktree was clean on local branch `0.5.0-dev` before audit planning changes.
- Read README and ARCHITECTURE completely and extracted their code-checkable runtime, trust, installer, and Release claims into findings.
- Read DESIGN and ROADMAP completely; identified the implementation maps and test index to verify, plus one candidate ARCHITECTURE installed-contract omission and one minor Wiki routing mismatch.
- Inventoried current contracts, runtime bundle, installed predecessor state, Release artifact, production modules, and test modules.
- Confirmed the installed runtime has four ABI contracts and DESIGN's module/test inventories are currently complete; promoted the ARCHITECTURE deployment-tree omission to a confirmed documentation finding.
- Corrected the Windows `rg` inventory command and inspected the adapter completely; its dispatch, validation, supervision, fallback-root construction, sibling execution, and final composition match the architecture.
- Inspected owned-plan request validation and managed-state capture/revalidation through line 838; core architecture matches, but two machine-contract/exact-state questions were identified for test confirmation.
- Completed owned-plan inspection through execution and cleanup; snapshot, renderer, revalidation, and failure behavior align with the architecture apart from the two admission/contract discrepancies already flagged.
- Completed owned-catchup inspection; transcript selection, immutable capture, identity/project checks, parsing, normalization, report budgeting, and helper reuse match ARCHITECTURE and DESIGN.
- Inspected `install.js` end to end. Raw bundle admission, 12-file installed inventory, global-Skill hash-only validation, absolute adapter-only policy, 30-second managed timeout, ownership/state-transition checks, topology blocking, backup ordering, doctor/repair classification, and uninstall behavior match the documented install plane.
- Recovered the active planning files after context compaction. The first resumed read used an invalid three-argument `Join-Path`; retrying with a resolved plan directory succeeded.
- Read the importer, deterministic ZIP builder, and Release asset materializer completely. Their pinned-source, allowlist, topology, reproducibility, zero-hash candidate, and non-zero sealed-output behavior matches ARCHITECTURE and DESIGN.
- Rechecked the full plan-request schema conditional and seam tests. `UserPromptSubmit.turn_id: null` is valid and intentionally tested, so the earlier suspected turn-ID mismatch was removed; only the autonomous newline admission discrepancy remains under contract review.
- The sandboxed focused Node suite hit the known Windows `spawn EPERM`; the approved outside-sandbox retry ran 142 tests: 121 pass, 20 POSIX skips, and one planning-lifecycle failure caused by retaining the now-complete prior scope alongside this new active scope.
- Verified every phase in the prior candidate-initialization plan is complete and retired its three files under the maintainer's explicit authorization. `.planning/` and this active audit scope remain intact.
- Re-ran the exact 11-module audit suite after planning retirement: 122 runnable tests passed, 0 failed, and 20 platform-specific tests skipped honestly.

### Phase 2: ARCHITECTURE audit

- **Status:** complete
- Traced adapter, owned-plan, owned-catchup, importer, installer, builder, materializer, contracts, and pristine helper boundaries against every code-checkable architecture claim.
- Confirmed one installed-tree omission and one related README/runtime EOL exactness mismatch; no main runtime, trust, failure, install, or Release contradiction remains.

### Phase 3: DESIGN audit

- **Status:** complete
- Verified all named modules and machine authorities, the source→ZIP→installed mapping, dependency routing, change routing, and the complete 20-module test reverse index.
- Found one low-risk Wiki-anchor routing mismatch; no stale/missing module or responsibility contradiction.

### Phase 4: Validation and report

- **Status:** complete
- Full regression passed 163 runnable tests with 0 failures and 26 platform skips.
- Importer check, candidate-bootstrap identity check, Python compile, Node syntax, and `git diff --check` passed.
- Classified four follow-ups: one medium ARCHITECTURE omission, one medium related exact-state inconsistency, and two low-risk maintenance drifts. No stable docs or production code were changed in this read-only audit.
- Final architecture/repository governance rerun passed 27/27 after the audit record was finalized.

### Phase 5: Planning lifecycle test correction

- **Status:** complete
- Maintainer confirmed that completed planning deletion always requires an explicit decision and authorized correction of the contradictory test.
- Re-read the governance authority and test helper. The helper already accepts complete inactive scopes; only the repository-boundary test's exact path-list assertion incorrectly required their absence.
- Replaced the exact `.planning/` inventory assertion with a positive retained-completed-scope regression and explicit maintainer-decision/no-auto-delete assertions.
- Focused architecture/repository governance tests passed 27/27.
- Full regression passed 163 runnable tests with 0 failures and 26 honest Windows/POSIX skips; retained-completed-scope policy remained green alongside all planning, runtime, installer, and Release boundaries.

## Test Results

| Test | Expected | Actual | Status |
|---|---|---|---|
| Focused architecture/contract/runtime/install/Release suite | All runnable cases pass; Windows-only POSIX cases skip | 122 pass, 0 fail, 20 skip | pass |
| Full `npm test` | No product/governance failures; POSIX-only Windows cases skip honestly | 163 pass, 0 fail, 26 skip | pass |
| Importer check | Pinned owned upstream inventory and hashes healthy | healthy, four files exact | pass |
| Candidate bootstrap check | Current `v0.5.0-dev` zero-hash candidate unchanged | state=`unchanged`, zero ZIP hash | pass |
| Python compile / `node --check` / `git diff --check` | No syntax or whitespace errors | no errors | pass |
| Final architecture/repository governance rerun | Final active planning and documentation boundaries pass | 27 pass, 0 fail | pass |
| Planning deletion-policy correction | Active scope remains unique while a complete inactive scope is permitted | 27 pass, 0 fail | pass |
| Full regression after planning-policy test correction | No product/governance regressions; platform-only cases skip honestly | 163 pass, 0 fail, 26 skip | pass |

## Error Log

| Timestamp | Error | Attempt | Resolution |
|---|---|---:|---|
| 2026-09-20 | `rg` received PowerShell-style `tools\*.py` and `runtime\upstream\*.sh` paths and returned Windows path errors | 1 | Use `rg -g '*.py'` / `rg -g '*.sh'` with directory roots on the next symbol scan. |
| 2026-09-20 | PowerShell `Join-Path` rejected a third positional child argument while rereading active planning after compaction | 1 | Resolve `.planning/<active>` first and join each planning filename in a separate call. |
| 2026-09-20 | `rg` returned exit 1 while searching for a nonexistent event-specific non-null `turn_id` rule | 1 | Read the schema conditional directly; null is permitted, so the suspected mismatch was retracted. |
| 2026-09-20 | Sandboxed focused Node suite failed all 11 modules with `spawn EPERM` | 1 | Re-ran outside the sandbox; the test runner executed normally. |
| 2026-09-20 | Focused suite reported one planning lifecycle failure because the completed prior scope remained next to the new active audit scope | 1 | Confirmed the prior scope was complete and retired its three files under existing maintainer authorization. |
| 2026-09-20 | A review-only `git diff --no-index` returned its normal exit code 1 for detected differences, causing the wrapper call to be reported as failed | 1 | The diff was produced correctly; ran the final governance tests separately and used ordinary `git diff --check` for pass/fail validation. |

## 5-Question Reboot Check

| Question | Answer |
|---|---|
| Where am I? | Phase 5, planning lifecycle test correction complete. |
| Where am I going? | Commit the scoped correction, then await maintainer direction on the remaining audit findings. |
| What is the goal? | Determine whether the two documents match current implementation and identify any drift. |
| What have I learned? | One active pointer does not imply one retained scope; the existing helper already encoded the right distinction. |
| What have I done? | Corrected the over-strong test, added a retained-completed-scope regression, and passed focused plus full validation. |
