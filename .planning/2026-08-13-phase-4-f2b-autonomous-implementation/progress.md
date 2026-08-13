# Progress: Phase 4 F2B autonomous activation implementation

## 2026-08-13

- Maintainer explicitly authorized F2B implementation after the Phase 4.5 Discovery and Cloud-route ranking were committed.
- Recovered repository authorities and confirmed the worktree was clean on `0.4.0-dev` at entry.
- Created a dedicated implementation scope with lifecycle ledger, failing-first order, Cloud/F3 stop boundary and no-writer invariant.
- Completed I0 inventory: request/result v2 and existing `ledger-summary.sh` dependency are sufficient; F2B changes one owned state
  seam, adapter capability/relation, two local hashes and their manifest/Release propagation. No new executable/inventory entry.
- Added failing-first autonomous capability, activation/profile, attestation/nonce/normalized-ledger/no-raw-progress and adapter relation
  tests. Focused Windows run produced 5 expected failures and 14 honest POSIX skips before production implementation.
- Implemented the single owned-plan F2B path: profile-bound token/mode admission, exact nonce and task digest, bounded exact JSONL
  validation, tick/event-only ledger projection, post-child identity revalidation and autonomous private-snapshot rendering. The managed
  runtime remains workspace read-only; autonomous does not capture `progress.md` and `gate` remains denied.
- Expanded the adapter capability relation atomically and updated the existing request-v2 contract comment; no schema shape, Host event,
  writer, executable or Release inventory entry was added.
- Expanded the negative matrix for duplicate keys, invalid calendar timestamps, agent mismatch, invalid ledger names, symlink/size/count
  budgets, zero-ledger admission and post-render task/nonce/attestation/ledger replacement. Focused Windows regression is green for all
  runnable cases; POSIX cases remain honest skips until Linux/Cloud.
- Updated current README/architecture/design/changelog/ROADMAP and the v0.4.0-dev acceptance ledger: local F2B implementation is a
  completed read-only consumer gate; Source/Candidate/no-live Cloud is current; F3 and real activation remain unauthorized.
- Closed bundle/manifest integrity references for adapter, owned-plan and request-v2 schema, and declared owned-plan's existing pristine
  ledger-summary helper as a direct dependency. Importer/compile/syntax/diff checks pass.
- Final full Windows suite: 152 tests, 129 pass, 0 fail, 23 honest POSIX/Linux skips. Final deterministic candidate build/check:
  22 entries, 85,533 bytes, SHA-256 `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`;
  two builds byte-identical. Importer/check, Python compile, Node syntax, bootstrap Bash syntax and diff checks pass.
- Closed the local implementation gate in one scoped commit and prepared the exact Source/Candidate/no-live Cloud handoff. No push,
  live activation, F3, seal, publication or remote mutation was performed.
- Reconciled the Phase 4.5 Discovery against the landed implementation without rewriting its historical tense: documented the scoped/root
  attestation mapping, direct pristine ledger renderer dependency, zero-read raw-progress rule, snapshot-local `pwf-sha` boundary and
  unchanged v2/Host/trusted-graph shape.
- Added the post-implementation lifecycle ledger: autonomous consumer code is locally active but product-pending; its producer routes
  remain F3-unproven, mutable ledger ownership remains reserved for Phase 8, and a double-route F3 `NO_GO` requires retirement rather
  than indefinite half-activation. Updated the history index to distinguish the original conditional-go from the later local landing.
- Focused history/architecture boundary verification passed 16/16 after the managed Windows sandbox's test-worker `spawn EPERM` was
  classified and the same read-only command was rerun with approved escalation; `git diff --check` also passed.
- Maintainer returned the complete F2B Linux/Source-Candidate no-live gate from exact HEAD
  `aeffc4d4c9e709ae59de2b193dabe5d092c5cb42`: 144/144 portable tests passed with zero skips; two 22-entry,
  85,533-byte candidate builds were byte-identical at SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`.
- Bootstrap install, pinned upstream v3.8.2, requirements/feature checks, doctor and both adapter probes passed. Post-Resume deep check
  dynamically routed manifest schema 4 to Release/bundle v2, reconciled 12 installed files and 4 pristine upstream files, retained
  adapter-only policy, found zero snapshot leftovers and returned both Source/Candidate PASS markers. Setup stayed clean; 9.1 observed
  planning-only changes and the exact same HEAD; no branch, commit or PR was created in Cloud.
- Wrote the exact evidence into the version acceptance, advanced ROADMAP and the active status to F2B Cloud no-live PASS, and appended
  a non-duplicating Phase 4.5 Cloud note. F3 and real activation remain unauthorized.
- Final documentation/repository boundary regression passed 16/16 after one over-specific F1 prose assertion was narrowed to its
  same-line semantic anchor; `git diff --check` passed and no production/contract/Release bytes changed in this evidence-only closure.
