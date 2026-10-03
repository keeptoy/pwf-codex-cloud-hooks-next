# Progress: Phase 5.3 G2 identity closure and replay

## 2026-10-03

- Re-read the planning skill, confirmed session catch-up had no unsynchronized state, and verified a clean
  `0.5.0-dev` worktree after G1 commits `347e457` and `d2f9acc`.
- Recovered the completed G1 plan and Phase 5.3 frozen decision/status. The maintainer explicitly authorized G2;
  G3～G5, Release workflow changes, Cloud and remote operations remain unauthorized.
- Created this separate G2 active planning scope before historical identity research or implementation.
- Reconstructed exact replay endpoints from first-parent history and peeled tag refs: prior accepted closeout to
  exact C0 for v0.4.1～v0.4.4, plus the source-only retirement and current v0.5 range. Historical tag object types
  differ, so G2 fixtures will use exact commit IDs rather than tag names.
- Confirmed all replay endpoints use current v2 Release/v1 transition layouts. Accepted-closeout → C0 keeps the
  old bootstrap and adds a zero-hash candidate. Inspected installer predecessor admission and the canonical
  bootstrap template; identity closure can be reconstructed read-only from exact Git blobs, but the predecessor
  snapshot needs a bounded source renderer/checker because installer currently only consumes it.
- After context recovery, re-read the repository authority chain, planning skill and all G2 planning files, then
  verified the only worktree changes are the new active-plan pointer and G2 planning directory.
- Logged three failed PowerShell-to-Node analysis transports. The next implementation will keep replay data and
  derivation in normal repository files/tests rather than retrying fragile inline argument quoting.
- Compared all four accepted-closeout → C0 path sets and probed the template at each endpoint. Confirmed the
  template begins only at v0.4.3 C0, so early-train replay must be fixture-bounded while current closure can use
  exact head-template rendering. The broad historical deltas also confirm normalization must be per-path and
  residual classification must remain the existing G1 policy.
- Extracted exact package/contract/predecessor/bootstrap identities at every endpoint. Found the important
  historical exception that v0.4.1's selected head bootstrap is already sealed (non-zero), while v0.4.2 onward
  C0 heads are zero-hash candidates. Also confirmed predecessor runtime inventories must be reconstructed from
  the accepted base authorities rather than normalized from the old transition snapshot.
- Re-read the frozen Phase 5.3 G2 contract and current installer/materializer code. Chose the conservative
  interpretation: v0.4.1 may remain FULL because its non-canonical historical asset is unexplained, while
  v0.4.2+ closure must be exact. Identified the missing implementation seam as a deterministic, read-only
  predecessor renderer with byte comparison.
- A direct inline Python comparison repeated the shell-quoting failure class and was stopped. No repository
  state changed; all remaining executable derivation will live in reviewed source/test files.
- Proved the v0.4.2 pre-template candidate is exactly derivable from the accepted v0.4.1 bootstrap by replacing
  one version and one ZIP hash; v0.4.1 correctly fails the zero-hash rule. Frozen the V2 result seam, atomic
  closure behavior, residual-path semantics, predecessor renderer and exact replay-ledger approach. Phases 1～2
  are complete; test-first Phase 3 is active.
- Resolved the source-only parent to `8756cd57c43a74235343421feacb11a89a78a370` and the current replay head to
  `d2f9acce31b6051d6eb6255d59d21a0340fee42e`; the replay ledger can now avoid revision expressions entirely.
- Added the six-sample exact replay ledger plus test-first V2 coverage for unchanged G1 behavior, canonical
  identity-only `NO_RELEASE_REQUIRED`, tampered bootstrap fail-closed behavior and exact historical lanes.
  Focused baseline (outside the Windows spawn sandbox) produced the intended red state: 4 pass / 5 fail, with
  failures limited to the not-yet-implemented V2 fields, closure and v0.4.2 normalization. Phase 3 is complete.
- Implemented the V2 closure/residual seam, exact predecessor reconstruction, current-template rendering and
  accepted-bootstrap identity substitution. Python compilation passes. The first post-implementation focused
  run improved to 7 pass / 2 fail: one test-only sorted-key expectation and one v0.4.2 closure diagnostic remain;
  canonical identity-only and tampered fail-closed tests already pass.
- Fixed the sorted-key assertion. Diagnosed v0.4.2: closure is complete with all five paths explained; the lane
  remains FULL solely because seven old docs are absent from G1's explicit owner map. A bounded policy ownership
  update is required while preserving unknown-path fail-closed behavior.
- Audited v0.4.3/v0.4.4/current residuals. Added explicit source-governance ownership for stable repository/state
  docs and kept old live operator runbooks under Release mechanics; moved `BASELINE_PROVENANCE.md` and
  `ROADMAP.md` to source governance as required by the frozen v0.4.4 package-doc result. Unknown paths still FULL.
- Focused G2 regression now passes 9/9. All six replay samples exactly match the frozen lane ledger with zero
  false-fast outcomes; current v0.5 remains `PRODUCT_OR_SECURITY`. Canonical identity-only and tampered closure
  tests both pass, so implementation/replay Phases 4～5 are complete and final validation is active.
- Initial final-diff audit shows only the active G2 planning scope, classifier, policy, classifier test and replay
  ledger are changed; `git diff --check` passes. Python compilation created one ignored classifier bytecode file,
  which will be removed without touching the pre-existing `build_release` cache entry.
- Full `npm test` passes with 193 pass / 26 documented POSIX/Linux-only skips / 0 fail. Runtime importer check,
  Python compile checks and `node --check install.js` also passed. The combined validation stopped only because
  sandboxed Git Bash hit Win32 signal-pipe error 5 on the first bootstrap syntax check; it will be rerun with the
  already documented limitation that Git Bash syntax is not Linux/Cloud evidence.
- Both tracked bootstraps pass `bash -n` outside the restricted Windows sandbox. Removed only the four bytecode
  files created by this gate's compile check; preserved the pre-existing ignored `build_release` cache entry.
- Added regular-Git-object validation for every identity source blob and re-ran focused G2 tests: 9/9 pass.
  The subsequent full-suite rerun unexpectedly marked the unchanged `owned-runtime.test.js` file failed despite
  all visible subtests passing; output ended before its diagnostic and final totals. Final validation remains open
  pending isolated classification and another complete run.
- Isolated `owned-runtime.test.js` identified a validation-artifact issue, not a product regression: this gate's
  `py_compile` left an empty `runtime/__pycache__` directory after its generated files were removed. The suite's
  no-bytecode invariant caught it as designed. The empty compile-created directory (and its hooks peer) will be
  removed before rerunning tests.
- Removed the two verified-empty cache directories. The targeted owned-runtime module now passes 11 / skips 1 /
  fails 0. A dot-reporter full run emitted no failure or thrown exit error, but its explicit final marker was not
  visible in captured output; run one silent exit-code check before recording final suite PASS.
- Silent final full regression returned `FINAL_FULL_SUITE_EXIT=0`; the detailed prior green run established
  193 pass / 26 documented POSIX/Linux-only skips / 0 fail. Final `git diff --check` passes, no compile-created
  hooks/runtime cache remains, and an explicit diff guard confirms package, manifests, runtime/Release contracts,
  both tracked bootstraps and the canonical template are byte-unchanged.
- Appended the stable G2 post-implementation status with the six exact outcomes and explicit G3～G5/non-enable
  boundary. All six plan phases and every G2 exit condition are complete; stop before G3 pending new authorization.
- Final scoped diff audit remained clean. Initial explicit-path staging was blocked only by sandbox denial of
  `.git/index.lock`; no files were staged or changed, and the same bounded staging will be retried with Git
  metadata write permission.
