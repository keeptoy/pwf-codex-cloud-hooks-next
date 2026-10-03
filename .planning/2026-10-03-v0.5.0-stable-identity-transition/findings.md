# Findings: v0.5.0 stable identity transition

## Initial boundary

- The request authorizes a local stable identity transition and local branch rename, not remote Release actions.
- Phase 5.3 replay already proves the accumulated v0.5 train contains owned-plan/runtime behavior changes and is
  `PRODUCT_OR_SECURITY`; removing `-dev` cannot make it an eligible G4 low-risk sample.
- The immediate dev-to-stable delta and the whole accepted-v0.4.4-to-v0.5 product train are different comparisons.
  Only the accepted-base comparison is valid Release classification input.

## Authority recovery

- README and ARCHITECTURE require every development bootstrap to retain a 64-zero ZIP hash and fail closed;
  version text, a local ZIP or a local seal never establishes a Release. Bootstrap stays outside the ZIP.
- Release ZIP identity comes from `package.json` plus `contracts/release-artifact-v2.json`; integrity references
  route through `upstream-manifest.json`. Published bytes, URLs, tags and acceptance remain immutable.
- DESIGN routes version/ZIP/bootstrap work through package identity, Release contract, builder, materializer and
  the nearest release/repository tests. A Release-boundary change requires the full suite and deterministic ZIP
  build/check; Windows cannot replace Linux/Cloud evidence.
- ROADMAP permits sealing only after it marks a Release candidate and an activity plan authorizes the exact gate.
  This plan authorizes stable source identity only: no sealing, C0, tag, publication, role change or live claim.
- ROADMAP currently names both the exact development candidate and local branch as `v0.5.0-dev` / `0.5.0-dev` in
  its current-role table and train section. The requested rename makes those programme pointers stale, so they must
  be updated to `v0.5.0` / `0.5.0` while retaining the explicit no-C0/no-Cloud/no-tag/no-Release boundary.
- Wiki defines the supported pre-C0 operation precisely: update version identity, run
  `materialize_release_assets.py candidate-bootstrap --write`, then its read-only check. A stable candidate may omit
  `-dev` but must remain the tracked canonical zero-hash bootstrap; formal `release` materialization is forbidden
  until exact Source/Candidate PASS supplies the ZIP SHA.
- `contracts/installed-state-transition-v1.json` already names accepted `0.4.4` and must remain byte-identical. A
  classifier identity closure reconstructs the predecessor from its explicit accepted base; using the unaccepted
  `0.5.0-dev` G3 head as base would incorrectly expect it as an installed predecessor and must not drive Release
  classification.

## Frozen identity cascade

| Object | Action | Reason |
|---|---|---|
| local branch | rename `0.5.0-dev` → `0.5.0` | explicit maintainer request; local only |
| `package.json` | version `0.5.0` | package identity owner |
| Release artifact contract | version `0.5.0`; external asset `init-cloud-sandbox-v0.5.0.bash` | ZIP/external asset identity owner |
| upstream manifest Release reference | replace only the Release-contract SHA | integrity index; no inventory mirror |
| installed-state transition | KEEP exact `0.4.4` predecessor and current bytes/SHA | only accepted installed baseline is admissible |
| tracked bootstrap | retire `...v0.5.0-dev.bash`; generate canonical `...v0.5.0.bash` with zero SHA | pre-C0 candidate, not sealed asset |
| ROADMAP / Phase 5 overview | project current candidate/branch as `v0.5.0` / `0.5.0`; retain no-C0/no-Release state | current programme/Product authorities |
| CHANGELOG | rename current section and record the stable identity transition | version delta authority |
| historical planning/history | KEEP unchanged | preserve time semantics and original replay labels |
| current-role test | update exact active candidate expectation; keep dynamic package/contract assertions | nearest programme boundary guard |

No production/runtime/Host ABI/trusted-graph content changes. No formal asset materialization, sealing or Release
operator guide is created in this scope.

## Implementation evidence

- The existing materializer produced `init-cloud-sandbox-v0.5.0.bash` canonically and then reported `unchanged`;
  its embedded ZIP checksum remains exactly 64 zeroes.
- The Release contract SHA is `6b504839b4d4f127fd0b6dcc3903ad02cd39d9039d8aab7ab247d027bb438597`;
  only that manifest integrity reference changed, while the accepted-predecessor contract stayed byte-identical.
- The old lifecycle test inferred that every suffix-free package identity must already have an acceptance guide.
  That conflated stable source identity with separately authorized Release entry. The corrected invariant requires
  an exact candidate guide once that lifecycle is entered, but allows no guide only while ROADMAP explicitly says
  the stable identity is pre-C0 and Release remains unauthorized.
- Two independent 22-entry candidate ZIP builds were byte-identical at SHA-256
  `7f4fcdee036b71c9093c044af1c015218d5a5533779d719d0f4f01bc79d0ba40`; this is local deterministic-build
  evidence only and was not written into the zero-hash bootstrap.
- A temporary unreferenced Git tree allowed the read-only G3 classifier to inspect the complete prospective commit
  against accepted closeout `053f66e994ca095e974f69a7fbe8f2bb54697fc3`. All seven identity checks passed,
  `identity_closure.complete=true`, and `unknowns=[]`; 80 residual changes since v0.4.4 include
  `product_runtime_security`, so the lane remains `PRODUCT_OR_SECURITY` with the current FULL C0/C1/C2 and
  two-channel lifecycle projected as `SHADOW_ONLY_NOT_EXECUTION_AUTHORITY`.
