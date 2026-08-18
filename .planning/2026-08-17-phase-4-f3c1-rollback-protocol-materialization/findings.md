# Findings: Phase 4 F3C1 rollback protocol materialization

## Frozen inputs

- Starting HEAD: `cd2effc` (`docs: audit F3C1 implementation prerequisites`).
- Worktree was clean on `0.4.0-dev`.
- Phase 4.10 route remains: committed disarm → current-owned uninstall → immutable v0.3.5 clean install → current exact
  forward recovery.
- Direct old-over-current downgrade is forbidden; the expected refusal mechanism is the old exact-path allowlist rejecting
  current-only v2/extra entries, not a manifest schema mismatch.

## Findings log

- F3C1 is Release-excluded protocol/no-live materialization. Production, machine contracts, candidate ZIP inputs and frozen
  F3B refs remain unchanged unless a stop condition forces renewed Discovery.
- The new publication-oracle subtest installed current first, snapshotted runtime + requirements + backup inventory, then ran
  immutable v0.3.5 directly over it. v0.3.5 returned `BLOCKED_UNKNOWN_RUNTIME` naming current-only v2/runtime contracts;
  the complete snapshot remained identical and current doctor stayed healthy. This dynamically closes the audit's first gap.
- `validateF3RollbackEvidenceRecord()` now has a separate exact shape instead of extending F3B evidence v1. It requires both
  accepted/current identities, disarm HEAD, absent activation, prepared repository state, actual legacy Hook/profile, installed
  role/version, backup/transition relation, doctor, residue and final exit status.
- Runtime-only revival coverage is deliberately Linux-only: current reads the still-present commit point, immutable v0.3.5
  renders legacy from its private v1 snapshot, then current reads the unchanged token again and reactivates the profile. Windows
  records an honest skip; Linux/no-live must execute both smart and autonomous cases.
- The operator guide uses intermediate checkpoint `12a3590...` as exact protocol/runtime source. That commit already contains the
  helper/tests and builds the frozen candidate; the later guide commit therefore avoids a self-referential HEAD and needs no new ref.
- Programme/acceptance/history now distinguish local materialization from Linux/no-live and real Cloud rollback. F3C2 remains
  unauthorized until the two Linux revival cases execute with zero skips.
- The maintainer then ran operator guide section 3 from a full GitHub clone at exact checkout
  `cdc4a9eba7e7f1f2545723829ed1a6b4c76cb48b`. Both immutable tags resolved to provenance-frozen source commits:
  `v0.3.5` -> `5d01b55890c1da2a5088e2b991b152a9fb1c3f87` and `v0.3.4` ->
  `59a999f705701ec67463649e9424f3d059863c81`.
- The ref-aware Linux/no-live run completed 13/13 tests with zero failures, zero skips and final exit code 0. Both mandatory
  smart and autonomous runtime-only revival cases actually executed. This closes F3C1 without claiming a live rollback.
- An earlier run from a directory that contained old commit objects but lacked the two release tags was a prerequisite failure,
  not a product or test defect. F3C rollback tests intentionally require a ref-aware clone because published tag identity is part
  of the trust evidence.
- The guide originally kept all F3C1/F3C2/F3C3 mechanics in one file but did not state plainly enough that section 3 is the whole
  F3C1 gate while sections 4-9 are mutating live gates. A novice handrail now separates those scopes and gives F3C2's two-stage
  order without changing the frozen transaction.
- Historical `v0.3.5`/`v0.3.4` tags do not contain or supply the current F3C1 test script. Current tests use those refs as immutable
  source locators for `git rev-parse`, `git archive` and `git show`; therefore a full ref-aware clone is a test prerequisite, not
  a workaround or an old-version installation.
