# Progress: v0.5.0 stable identity transition

## 2026-10-03

- Read the planning-with-files skill and ran session catch-up. The G3 activity was complete and the worktree was
  clean on local branch `0.5.0-dev` at commit `0f596c3`.
- Recorded the maintainer's explicit stable-version and local-branch authorization in this separate plan. Kept G4,
  C0/Cloud/Release, sealing, tags and all remote writes outside scope.
- Re-read README, ARCHITECTURE and DESIGN, and began a complete ROADMAP reread. Recovered the zero-hash candidate,
  contract-driven ZIP and no-seal/no-C0 boundary for this identity transition.
- Completed the ROADMAP and Wiki reread. Identified the exact current-train pointers that must follow the authorized
  branch/version rename, and confirmed the existing candidate-bootstrap materializer is the canonical writer.
- Inventoried every `0.5.0-dev` occurrence and inspected package, Release contract, transition, manifest,
  materializer and nearest tests. Froze the owner-by-owner cascade; historical references stay unchanged and the
  accepted `0.4.4` predecessor contract is explicitly KEEP.
- Renamed the local Git branch from `0.5.0-dev` to `0.5.0`; no remote ref was created, moved or deleted.
- Focused lifecycle tests exposed an old assumption that every suffix-free package identity already had a candidate
  acceptance guide. Classified it as a governance/test defect for the explicitly authorized pre-C0/no-Release
  state: acceptance now remains absent until the Release guide lifecycle is separately authorized, and the test
  fails closed unless ROADMAP explicitly says the stable source identity has no C0 or Release.
- Updated package/Release/manifest identity, generated the canonical `v0.5.0` zero-hash bootstrap, reconciled the
  current programme/Product/version-delta projections and kept historical `v0.5.0-dev` records unchanged.
- Focused contract/bootstrap/asset/package/repository tests pass after the lifecycle correction. Two independent
  22-entry ZIP builds and checks produced identical SHA-256
  `7f4fcdee036b71c9093c044af1c015218d5a5533779d719d0f4f01bc79d0ba40`; no formal Release materialization ran.
- Classified the complete prospective tree from accepted v0.4.4 closeout: seven identity checks PASS, no unknowns,
  and residual Product/runtime changes retain `PRODUCT_OR_SECURITY` plus the current FULL lifecycle. The projection
  remains advisory/shadow only; no C0, Cloud or Release gate was started.
- The first full suite run reached 222 tests with 194 PASS, 26 honest Windows skips and two architecture-test
  failures. Both were test drift: the Phase-route parser admitted only wildcard `x.y.z-*` series and could not
  represent the now-exact stable `0.5.0` row. Updated the parser to admit either a wildcard family or one exact
  package version. A following focused run exposed one adjacent wording guard that admitted only `development
  candidate`; it now accepts the explicit `development|stable candidate` states while retaining exact version and
  branch checks. No product/security assertion was weakened.
- Final full suite: 222 tests, 196 PASS, 26 honest Windows/POSIX skips, 0 FAIL. Importer check, candidate-bootstrap
  idempotence, Python compilation, `node --check`, both bootstrap `bash -n` checks and `git diff --check` also pass.
  The canonical bootstrap SHA-256 is `5b49332db4f550901998f54e65d5c32808e12dd8e83b2479b4df8b91e4b91ae2`;
  its embedded ZIP checksum remains 64 zeroes. Scope is ready for the required local commit.
