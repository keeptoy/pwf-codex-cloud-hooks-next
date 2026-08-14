# Progress: Phase 4 F3B1 protocol materialization

## 2026-08-14

- Maintainer authorized F3B1 protocol materialization/no-live dry run and no later live gate.
- Re-read the planning-with-files and OpenAI Docs skill instructions, queried/opened current official Cloud environment and Hooks
  documentation, then recovered repository authority and the completed F3B0 scope.
- Confirmed official setup/cache/maintenance ordering still supports Phase 4.7's two-identity design and requires both setup and
  maintenance to enforce the same exact runtime source/candidate identity.
- Created a new markerless F3B1 active planning scope. No production, Release, Cloud or opt-in state has been changed.
- Inspected the full F3A runbook and lifecycle helper/tests. The existing protocol covers one preparation/activation/disarm chain and
  production probes, but does not yet materialize exact Cloud setup/maintenance, both F3B validation DAGs or a machine-checkable
  evidence record. A guessed helper path was absent; the actual verifier is `tests/f3-lifecycle-helpers.js`.
- Added failing-first F3B1 boundary tests. The runbook-anchor and evidence-validator failures are the intended implementation gaps.
  The disposable Git DAG returned a null child status under the restricted Windows runner, so it is classified as a platform execution
  limitation pending an unrestricted local rerun; no safety assertion was weakened or removed.
- The first unrestricted rerun did not reach a final status and was explicitly terminated. The fixture now disables user Git hooks/signing
  and terminal prompts and bounds every Git child call, preventing personal Git configuration from becoming a test authority.
- Focused regression then exposed one wording fixture pinned to F3A's pre-F3B stop sentence. It was updated to assert the current stricter
  F3B1 no-live boundary; the behavioral/prohibition boundary was not relaxed.
- Implemented the versioned runtime-source transaction, isolated smart/autonomous DAG, bounded tamper instructions and exact relational
  evidence record. A review caught and fixed the actual manifest-to-Release bootstrap route before any live use.
- Focused regression passed 18/18. Full Windows regression passed 138 with 0 failures and 23 honest Linux/POSIX skips (161 total).
  Importer check, installer syntax, all bootstrap Bash syntax and the three Python runtime compile checks passed.
- Two independent candidate builds/checks were byte-identical: 22 entries, 85,533 bytes, SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`. This matches the pre-F3B1 candidate exactly and proves
  the docs/tests/planning-only gate did not alter Release bytes.
- Synchronized ROADMAP, version acceptance, Phase 4.7 post-implementation status, DESIGN reverse test index and the active lifecycle
  ledger. No live state, validation ref, production file, contract or Release inventory was created.
- Final F3B1/repository boundary rerun passed 12/12 after all authority/planning synchronization. The gate is ready for one local commit
  and must stop before F3B2 authorization.
