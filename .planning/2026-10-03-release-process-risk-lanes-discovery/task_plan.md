# Task Plan: release process risk-lane discovery

## Goal

Determine whether the current C0/C1/C2 Release governance can be safely simplified through machine-classified
risk lanes, a smaller Release surface and a C0 + final-record lifecycle, without weakening immutable artifact
identity, public-download validation, rollback evidence or the repository trust boundary.

## Authorization and scope

- The maintainer approved continuing with the bounded Discovery proposed in the preceding discussion.
- Allowed: read-only repository/history inventory; historical replay of v0.4.1 through v0.4.4; local analytical
  scripts or tests that do not change production behavior; planning, design/history and Product Phase governance
  documentation; proportionate local validation; one or more bounded local commits.
- Not allowed: production runtime/installer changes, Release contract or ZIP allowlist changes, version bump,
  C0/seal/tag/Cloud/publication/Latest/rollback actions, remote writes, or adoption of an external attestation
  service.
- A Discovery conclusion may recommend a later implementation gate, but does not authorize it.

## Current phase

Completed locally: historical replay, classifier/evidence design and option comparison closed with a bounded
`CONDITIONAL_GO`; current Release behavior remains unchanged and all local governance/full regression passed.

## Next Step

Hand off the Discovery decision. The next gate requires explicit maintainer authorization to implement a
read-only advisory classifier and identity-closure checker; it must not enable reduced lanes or change Release.

## Phases

1. [x] Recover current authorities, Release surface, lifecycle and historical replay corpus.
2. [x] Define candidate machine fingerprints, lane precedence, fail-closed rules and minimum evidence matrix.
3. [x] Replay v0.4.1-v0.4.4 changes and test whether classification preserves all known risk boundaries.
4. [x] Compare current C0/C1/C2, C0 + final record, and externally attested alternatives; freeze a bounded
   `GO`, `CONDITIONAL_GO` or `NO_GO` recommendation.
5. [x] Reconcile the Discovery conclusion into the proper Product Phase/history authority, run governance
   validation and create a scoped local commit.

## Invariants

- New package bytes always require a new identity, deterministic build/hash and immutable public asset chain.
- The formal tag continues to identify the exact source commit whose candidate bytes were validated.
- Unknown ownership, unclassified paths or fingerprint ambiguity always escalates to the strictest lane.
- Machine classification may reduce repeated behavior evidence; it cannot reuse evidence across changed
  runtime, installer, schema, Host ABI, trusted graph, migration or security boundaries.
- Source-only governance must never be promoted into a Release merely because a development version exists.
- Windows results cannot replace Linux/Cloud evidence; this Discovery performs no live Cloud action.

## Stop conditions

- Stop before implementation if historical replay exposes a false-fast-lane classification that cannot be
  eliminated with deterministic repository facts.
- Stop if the proposal would require changing Release bytes, Host ABI, trusted graph, rollback semantics or
  external GitHub state during this Discovery.
- Stop and ask the maintainer if C1 removal would discard evidence that has no durable final authority or
  recoverable source.
- Preserve any user changes; if new overlapping worktree changes appear and cannot be separated, do not commit.

## Errors

| Error | Resolution |
|---|---|
| PowerShell passed the literal `docs/acceptance/v0.4.*-cloud-hard-acceptance.md` path to `rg` | Use `rg -g` or enumerate files instead of a shell glob on Windows. |
| Focused `node --test` failed in the sandbox with Windows `spawn EPERM` before loading either test file | Re-ran the identical read-only test command with approved sandbox escalation; 47/47 tests passed. |
| Sandbox `git add` could not create `.git/index.lock` (`Permission denied`) | Re-run the exact scoped staging/commit operation with repository-local escalation; do not broaden staged paths. |
