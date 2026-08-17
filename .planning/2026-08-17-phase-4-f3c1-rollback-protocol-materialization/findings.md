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
