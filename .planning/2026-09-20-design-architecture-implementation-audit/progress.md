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

### Phase 6: Three non-autonomous audit corrections

- **Status:** complete
- Maintainer authorized the ARCHITECTURE installed-contract tree, DESIGN Wiki route, and adapter docstring corrections, while explicitly deferring autonomous newline semantics.
- Confirmed the adapter comment is part of bundle-managed runtime bytes; this small source edit requires the normal two-level integrity hash refresh.
- Added failing-first governance coverage for all three corrections: bundle-derived installed contracts in ARCHITECTURE, both Wiki anchors in DESIGN §6, and profile-neutral adapter seam wording.
- Failing-first architecture suite produced the expected two failing test blocks: the canonical seam stopped at the first missing catch-up contract name (before reaching the docstring assertion), and DESIGN §6 lacked the local-development anchor. Seven unrelated cases passed.
- Updated ARCHITECTURE to list all four installed schema files, routed DESIGN §6 to both Wiki sections, and made the adapter request-builder docstring profile-neutral. Calculated the new adapter SHA for the bundle integrity refresh.
- Updated the adapter record in `runtime-bundle-v2.json`, recalculated the raw bundle hash, and updated only the manifest's runtime-bundle integrity reference.
- First affected-suite run: 99 pass, 1 fail, 2 platform skips. All implementation, hash, installer, Release, and new finding assertions passed; the sole failure correctly caught a duplicate `DESIGN.md → Wiki.md#local-development` deep-link authority because DESIGN §1 still used the same anchor now owned precisely by §6.
- Routed DESIGN §1 to the Wiki root and retained both precise anchors in §6; the architecture governance suite then passed 9/9.
- Static/integrity validation passed: importer healthy, candidate bootstrap unchanged with zero ZIP hash, Python and Node syntax clean, `git diff --check` clean, adapter/bundle hashes equal their authorities, and README/owned-plan/autonomous tests have no diff.
- Full regression passed 163 runnable tests with 0 failures and 26 honest Windows/POSIX skips after all three corrections and the integrity-chain refresh.
- Final planning-aware architecture/repository governance rerun passed 27/27.

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
| Failing-first three-finding regression | Authorized drifts are detected before implementation | 7 pass, 2 expected fail | diagnostic pass |
| First affected-suite implementation run | New assertions and integrity chain pass; no duplicate deep-link authority | 99 pass, 1 duplicate-link fail, 2 skip | fixture/document route follow-up |
| Corrected architecture governance suite | Four contract names, both Wiki routes, neutral adapter seam, and unique deep links pass | 9 pass, 0 fail | pass |
| Static integrity/autonomous exclusion checks | Hash chain exact; syntax/importer/bootstrap clean; autonomous surfaces unchanged | all checks pass | pass |
| Full regression after three non-autonomous corrections | No product/governance regressions; platform-only cases skip honestly | 163 pass, 0 fail, 26 skip | pass |
| Final Phase 6 architecture/repository governance rerun | Final documentation, links, active planning, and retained-scope policy pass | 27 pass, 0 fail | pass |

## Error Log

| Timestamp | Error | Attempt | Resolution |
|---|---|---:|---|
| 2026-09-20 | `rg` received PowerShell-style `tools\*.py` and `runtime\upstream\*.sh` paths and returned Windows path errors | 1 | Use `rg -g '*.py'` / `rg -g '*.sh'` with directory roots on the next symbol scan. |
| 2026-09-20 | PowerShell `Join-Path` rejected a third positional child argument while rereading active planning after compaction | 1 | Resolve `.planning/<active>` first and join each planning filename in a separate call. |
| 2026-09-20 | `rg` returned exit 1 while searching for a nonexistent event-specific non-null `turn_id` rule | 1 | Read the schema conditional directly; null is permitted, so the suspected mismatch was retracted. |
| 2026-09-20 | Sandboxed focused Node suite failed all 11 modules with `spawn EPERM` | 1 | Re-ran outside the sandbox; the test runner executed normally. |
| 2026-09-20 | Focused suite reported one planning lifecycle failure because the completed prior scope remained next to the new active audit scope | 1 | Confirmed the prior scope was complete and retired its three files under existing maintainer authorization. |
| 2026-09-20 | A review-only `git diff --no-index` returned its normal exit code 1 for detected differences, causing the wrapper call to be reported as failed | 1 | The diff was produced correctly; ran the final governance tests separately and used ordinary `git diff --check` for pass/fail validation. |
| 2026-09-20 | DESIGN linked `Wiki.md#local-development` from both its authority table and validation section | 1 | Keep precise local/build anchors in §6 and make the higher-level §1 authority entry point to the Wiki root. |

## 5-Question Reboot Check

| Question | Answer |
|---|---|
| Where am I? | Phase 6 complete; the three authorized non-autonomous findings are corrected and validated. |
| Where am I going? | Create the scoped local commit, then leave autonomous newline semantics for the next maintainer-directed round. |
| What is the goal? | Keep DESIGN and ARCHITECTURE aligned with implementation while preserving the deferred semantic boundary. |
| What have I learned? | Documentation completeness can be derived from machine inventory, and even a docstring-only managed-runtime edit must rotate both integrity hashes. |
| What have I done? | Added regression coverage, corrected both documents and the docstring, refreshed the integrity chain, and passed focused plus full validation. |
