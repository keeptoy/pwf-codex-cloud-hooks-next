# Task Plan: Phase 5.3 G2 identity closure and replay

## Goal

Extend the Phase 5.3 advisory classifier with a read-only canonical identity-closure verifier, then replay the
frozen source-only, v0.4.1～v0.4.4 and current v0.5 samples. Only an exact, fully explained version/identity cascade
may be removed before residual semantic classification; every unexplained identity byte remains FULL.

## Authorization and scope

- The maintainer explicitly authorized “继续G2” after the G1 handoff identified canonical identity closure and
  replay as the next gate.
- Allowed: read historical commits/tags and current machine authorities; update the Release-excluded classifier,
  owner policy and fixtures; add deterministic read-only identity rendering/checking; update G2 planning and
  stable status documentation; run proportionate validation; create bounded local commits.
- Not allowed: automatic version/contract/hash/bootstrap writes; C0 generation; mutation of package, manifest,
  Release/runtime contracts or bootstrap inputs; G3 evidence projection, G4 shadow execution, G5 enablement;
  reduced lanes, Cloud, seal, tag, publication, Latest, rollback or remote writes.
- Current C0/C1/C2 and FULL workflow remain the only operative Release authority regardless of G2 output.

## Current phase

Complete: G2 identity closure, exact replay and local validation satisfy the frozen exit conditions.

## Next Step

Stop. G3 evidence-plan/projection work requires separate maintainer authorization; current C0/C1/C2 FULL workflow
remains operative.

## Phases

1. [x] Recover G2 requirements, historical endpoints and identity-owner/rendering evidence.
2. [x] Freeze the identity-closure algorithm, result schema evolution and lifecycle ledger.
3. [x] Add failing canonical/non-canonical closure tests and exact historical replay fixtures.
4. [x] Implement closure verification, residual classification and `NO_RELEASE_REQUIRED`.
5. [x] Replay all frozen samples; require zero false-fast outcomes and current v0.5 FULL.
6. [x] Run focused/full regression, reconcile stable G2 status and create scoped local commit(s).

## G2 exit conditions

- Canonical closure covers only explainable package version, Release contract identity/external asset,
  accepted-predecessor snapshot, manifest integrity references and zero-hash candidate bootstrap changes.
- The checker renders or derives expected target bytes from exact base/head authorities; it never trusts a path
  merely because its name resembles an identity file.
- Every closure member is byte-exact, complete and type/mode safe. Missing, extra or non-canonical fields/bytes
  fail closed to `PRODUCT_OR_SECURITY` with explicit unknowns.
- Residual semantic changes alone select the four G1 lanes. A valid closure with no residual releasable change
  returns `NO_RELEASE_REQUIRED`; this remains advisory and does not create a version train.
- Frozen samples match: source-only governance, v0.4.1 product/security, v0.4.2 and v0.4.3 Release mechanics,
  v0.4.4 package documentation, and current v0.5 product/security. False-fast count is zero.
- Current Release inputs and all remote/Cloud state remain unchanged.

## Invariants

- Identity closure is validated before normalization; unverified raw hash/path changes are never ignored.
- Runtime, installer, schema, Host ABI, trusted graph, migration, path-safety and source-import changes remain
  `PRODUCT_OR_SECURITY` even when the identity cascade is canonical.
- Classifier/policy/identity-checker self-change remains FULL.
- Historical expectations are test oracles, not editable targets; any lower-than-frozen result stops G2.
- G2 does not emit required gates, modify operator guides or authorize reduced execution.
- User changes are preserved and commits exclude unrelated paths.

## Stop conditions

- Stop if any identity owner cannot be deterministically reconstructed from repository bytes and existing
  authorities without a maintainer assertion.
- Stop if supporting a historical layout would add compatibility behavior to production or weaken current
  contract validation; historical replay may use bounded fixture adapters instead.
- Stop on any false-fast historical result, unexplained identity change or need to mutate Release inputs.
- Stop if overlapping user changes cannot be safely separated.

## Errors

| Error | Resolution |
|---|---|
| Inline `node -e` predecessor-analysis script lost JavaScript quoting through PowerShell (`require(node:crypto)`) | Abandoned direct inline JavaScript; do not retry this transport. |
| Base64-wrapped analysis passed the encoded source through as `process.argv[1]`, so the script parsed it as fixture JSON | Diagnosed the wrapper argument boundary; do not reuse the wrapper without an explicit argument splice. |
| The adjusted wrapper received PowerShell `ConvertTo-Json` objects instead of nested pair arrays | Abandoned PowerShell-generated fixture JSON after the third transport failure. Use repository code/tests with literal checked-in replay data, or simple Git probes, instead of another ad-hoc inline bridge. |
| A later `python -c` byte-comparison probe again lost all inner quotes through PowerShell | Treat all inline Python/Node source transport as prohibited for this gate. Use native PowerShell text operations for the one remaining probe, then move derivation into patched repository code/tests. |
| Unquoted `d2f9acc^{commit}` was parsed incorrectly by PowerShell during endpoint expansion | Used `git show -s --format=%H d2f9acc` to obtain the same exact commit; fixtures store the resulting 40-character ID and avoid brace syntax. |
| Sandboxed `node --test` could not spawn the test worker (`spawn EPERM`) | Re-ran the same focused test with the approved out-of-sandbox test capability; the runner then executed normally. |
| The installed PowerShell rejected the `??` null-coalescing operator in a replay diagnostic | Replaced it with an explicit `if ($null -ne ...)` expression; no product/test code uses shell-version-specific syntax. |
| Sandboxed Git Bash could not create its signal pipe while running bootstrap `bash -n` (Win32 error 5) | Classify as a sandbox/platform launch restriction; rerun only the syntax checks outside the sandbox and do not treat Git Bash as Linux evidence. |
| Final full-suite rerun reported `tests/owned-runtime.test.js` failed after visible subtests passed | Isolated run exposed the exact cause: the validation `py_compile` left an empty `runtime/__pycache__` directory, and the runtime test correctly rejects cache creation. Remove only the empty compile-created hooks/runtime cache directories, then rerun targeted and full regression. |
| Sandboxed `git add` could not create `.git/index.lock` (`Permission denied`) | Repository `.git` is read-only inside the workspace sandbox; rerun the same bounded explicit-path staging command with approved Git metadata write access. |
