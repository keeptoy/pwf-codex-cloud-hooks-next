# Findings: Phase 4 F3C4 aggregate closure Discovery

## Frozen inputs

- Starting HEAD: `8932623ca71c9e00c0b6e2f619eb6c8446ef7370` (`docs: close F3C3 autonomous rollback recovery`).
- Starting worktree: clean on `0.4.0-dev`.
- F3C1 ref-aware Linux/no-live, F3C2 smart live and F3C3 autonomous live are accepted; F3C4 aggregate closure is not.
- Four live records remain execution-scoped JSON summarized by version acceptance; repository evidence is the exact identity and
  relational proof, not copied disposable files.

## Findings log

- Current and origin-tracking F3B2/F3B3 validation refs match for both runtime-source refs and all nine positive lifecycle refs
  (11 exact pairs). The unrelated historical local `validation/v0.3.1-s2-runbook` ref is outside the F3C retention set.
- Smart disarm remains exact `c9275ba...` with `.mode=inject-smart` and no activation. Autonomous disarm remains exact `98b6f13...`
  with `.mode=autonomous`, nonce `d7d00d0fcb799f3f`, attestation `415295db...`, no activation and no ledger files.
- Protocol source `12a3590...`, accepted `v0.3.5` source `5d01b55...` and fallback `v0.3.4` source `59a999f...` resolve exactly.
- Development HEAD has no tracked planning machine state. The only current worktree changes are this Release-excluded Discovery scope
  and the predecessor planning handoff; repository scan found no installed manifest, snapshot, F3C JSON or ledger residue.
- Version acceptance and the operator guide preserve all four rollback relations: smart/autonomous × rollback/recovered, with accepted
  vs current role, prepared repository state, legacy context, activation absence, backup, doctor, zero residue and final exit 0.
- Importer check is healthy. Two independent current candidate builds/checks were byte-identical at 22 entries, 85,533 bytes and
  SHA-256 `df600104...`; both temporary ZIPs were removed after validated temp-path cleanup.
- Focused suite passed 23 runner tests as 21 pass, 0 fail and 2 honest Windows skips; full Windows suite passed 172 tests as 147 pass,
  0 fail and 25 Linux/POSIX-only skips. Importer, owned Python compile, install.js, all bootstrap Bash syntax and diff checks passed.
- Postflight found 11 exact local/origin validation ref pairs, no active planning machine-state files and no changed path intersecting
  Release v2 entries or external assets.

## Lifecycle decision

- KEEP all 11 F3B2/F3B3 validation refs, the F3C operator guide, rollback validator and revival-negative tests. Earliest ref review still
  requires F3C aggregate PASS, the current 0.4.0 Phase 9 instance, immutable recovery and maintainer approval.
- KEEP development planning machine state absent. Disposable Cloud JSON and candidate ZIPs remain execution-scoped and are not copied.
- F3C4 implementation can be docs/planning/tests-only and needs no new Cloud/schema/production/Release byte, provided it preserves each
  profile's identity and negative proof separately.
- Decision: `CONDITIONAL_GO_TO_F3C4_AGGREGATE_CLOSURE / IMPLEMENTATION_NOT_AUTHORIZED / REF_CLEANUP_NOT_AUTHORIZED`.

## Post-Discovery lifecycle clarification

- ROADMAP maps Phase 4 to `0.4.0-*`, Phase 5 to `0.5.0-*`; standing Phase 9 is reused by each train and is not version `0.9.0`.
- Product Phase closure creates the train's functional/candidate baseline. The same train's Phase 9 creates the published accepted
  baseline and rotates accepted/fallback roles. These are distinct lifecycle checkpoints.
- Every train therefore requires two retirement reviews: phase closeout reviews construction-scoped objects; Phase 9 post-promotion
  reviews candidate/accepted-window objects. A review may conclude KEEP or MIGRATE; it does not require deletion.
- For current F3C, F3C4 must conduct the first review. The 11 refs can still remain because they preserve exact side-branch commit
  reachability; validators/negative tests can remain as active regression contracts rather than historical residue.
