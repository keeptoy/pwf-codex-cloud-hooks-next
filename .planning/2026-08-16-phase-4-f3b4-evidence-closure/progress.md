# Progress: Phase 4 F3B4 evidence closure

## 2026-08-16

- Maintainer authorized the Phase 4.9 minimal evidence-closure implementation and a Phase 4.7 newcomer explanation.
- Recovered a clean `0.4.0-dev` worktree at the Phase 4.9 Discovery commit.
- Created a separate markerless closure scope; no ref cleanup, Cloud rerun, production/Release mutation or F3C work is authorized.
- Appended Phase 4.9 post-implementation status and promoted version acceptance/ROADMAP to aggregate
  `F3B_LIVE_LIFECYCLE_PASS / STOP_BEFORE_F3C`; F3C remains explicitly unauthorized.
- Added a stable Phase 4.7 newcomer table for F3B0～F3B4. It explains each gate's question and keeps exact identities/current status in
  their existing authorities; the final note separates F3C rollback from F3B live evidence.
- Retained all validation refs and kept README plus every production/Release input unchanged.
- Initial focused test invocation did not execute any test because the Windows sandbox denied worker creation with `spawn EPERM`; the
  exact command will be rerun with the established outer execution permission.
- The first real focused run exposed a ROADMAP wording regression: compacting the current-train sentence removed the stable explicit
  `F1 foundation ... complete` clause. Restored that clause; no product or F3 evidence fact changed.
- The next focused run found the same wording-drift class for the stable F3B0/F3B1 completion phrase. Restored the explicit
  `F3B0 Discovery 与 F3B1 no-live protocol materialization complete` clause instead of weakening its regression guard.
- A third focused run found that combining smart/autonomous status had hidden the stable `F3B2 smart Cloud live PASS` phrase.
  Restored separate explicit F3B2 and F3B3 Cloud-live clauses; the evidence and gate state did not change.
- The next run correctly rejected an over-short F3B3 status. Restored the explicit
  `zero-ledger/tamper/disarm/re-attest/re-arm` scope so ROADMAP continues to state the proof boundary precisely.
- The first final focused invocation caught an unescaped `/` in a newly added documentation regex before test execution. Escaped the
  delimiter and retained the intended Release-boundary assertion.
- Initial scoped staging was denied because the workspace sandbox exposes `.git` read-only and could not create `index.lock`; no paths
  were staged. The same explicit path list will be staged with the established repository-metadata permission.

## Verification log

| Check | Result |
|---|---|
| Initial branch/worktree | clean `0.4.0-dev` |
| Aggregate closure docs | implemented; F3B PASS recorded; F3C not authorized |
| Phase 4.7 newcomer navigation | F3B0～F3B4 question table added; no exact identity duplication |
| Focused F3/history/repository suite | 21 tests; 21 pass; 0 fail; 0 skipped |
| Full Windows suite | 165 tests; 142 pass; 0 fail; 23 honest Linux/POSIX-only skips |
| Importer / source syntax / diff check | PASS |
| Deterministic candidate | two builds; 22 entries; 85,533 bytes; exact frozen SHA; byte-identical |
| Markerless/residue | active scope admitted as legacy; planning machine-state residue 0 |
| Validation refs | 11 local and remote-tracking refs match frozen commits |
| Release boundary | no changed path intersects Release v2 entries or external assets |

## Current status

`F3B_LIVE_LIFECYCLE_PASS / STOP_BEFORE_F3C / F3C_NOT_AUTHORIZED`
