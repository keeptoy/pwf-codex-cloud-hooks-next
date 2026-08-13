# Progress: Phase 4 F3A lifecycle foundation

## 2026-08-13

- Maintainer authorized Phase 4.6 responsibility completion and F3A implementation, with autonomous execution bounded to F3A.
- Recovered root authority, F3 Discovery planning, current repository state, F2B consumer contracts/tests and the Phase 4.6 summary.
- Confirmed the worktree was clean on `0.4.0-dev` before edits and created a new active F3A scope so completed Discovery evidence
  remains historical rather than being reopened.
- Froze the no-new-shipped-helper design: repository admission is enforced by tests; prepare/verify lives in a dedicated versioned
  runbook and reuses the installed read-only production probe. No real activation state or Release/trusted-graph change is in scope.
- The first focused standard Node runner invocation was blocked before assertions by the known Windows sandbox worker `spawn EPERM`;
  recorded it as a harness limitation and switched to direct single-process execution of the same test files.
- Added disposable-fixture coverage for complete smart/autonomous repository states, partial/mismatched/unknown/inactive refusal and
  exact activation/disarm Git commits. The behavior checks passed; one runbook static assertion initially confused a real Git tab with
  the two-character `\\t` spelling and was corrected without relaxing the transition rule.
- The first complete Windows suite reached all assertions and found only a DESIGN reverse-index omission for the new test module;
  registered the module's repository/Git/runbook responsibility. All product, supply-chain and runtime assertions in that run passed.
- Full Windows rerun passed 156 tests: 133 pass, 0 fail and 23 honest POSIX skips. Importer, Python compile and Node syntax then passed;
  the combined auxiliary command was interrupted at Git Bash startup by a Windows sandbox signal-pipe permission error, so remaining
  Bash/Release/diff checks were routed to an unrestricted local validation rather than guessed from partial stdout.
- A later full run correctly failed its existing no-bytecode-cache guard because the new test helper imported `owned-plan.py` without
  `-B`. Updated the helper to disable bytecode explicitly; the sole generated `runtime/__pycache__/owned-plan.cpython-313.pyc` is a
  test artifact scheduled for exact cleanup before rerun.
- Final complete Windows regression passed 156 tests: 133 pass, 0 fail and 23 honest POSIX skips. Focused F3A assertions passed 4/4;
  repository governance passed 9/9. Importer check, Python/Node/bootstrap Bash syntax, no-bytecode-cache and `git diff --check` passed.
- Two independent candidate builds remained byte-identical to the F2B candidate: 22 entries, 85,533 bytes and SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`. This is evidence that F3A added no Release/runtime byte.
- F3A local implementation is complete. Stopped before Linux/Source-Candidate no-live acceptance and before any real state creation,
  F3B live Cloud lifecycle, F3C rollback, remote write, seal or publication.
