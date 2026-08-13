# Findings: Phase 4 F2B autonomous activation implementation

## Frozen inputs

- Discovery conclusion: `CONDITIONAL_GO_TO_F2B_READ_ONLY_IMPLEMENTATION`.
- Exact smart token remains smart-only; autonomous candidate token is `codex-managed-v1 autonomous\n` and must be written last.
- Exact autonomous mode is `autonomous\n`; `gate` remains denied.
- Managed runtime is read-only and executes only pinned pristine scripts over a private normalized snapshot.
- Attestation/nonce are integrity/framing inputs, not human identity or secrets.
- F3 tests Git-backed two-stage activation first and same-chat follow-up second; neither is part of this implementation gate.

## Inventory notes

- `runtime/owned-plan.py` has one F2A capture/revalidation seam and one private-snapshot renderer. F2B extends these functions rather
  than adding a second runtime path. Current task/progress are read before state; autonomous must switch to task capture first, state
  decision second, and avoid reading raw progress entirely.
- Request/result v2 already accepts the ordered autonomous capability and result enum/advisory vocabulary. No schema shape rotation is
  required; adapter producer/runtime capability and adapter relational validator must expand atomically.
- `ledger-summary.sh` is already a pristine `inject_plan` dependency in runtime bundle v2 and the Release ZIP. No new executable or
  installed entry is required. Only adapter/owned-plan hashes and then bundle/manifest/Release hash chain change.
- F2B also makes `ledger_summary` an explicit direct dependency of `owned_plan`; this records the production preflight/call edge without
  changing the existing four-file upstream inventory or pristine bytes.
- Failing-first tests now demonstrate the intended deltas: autonomous capability is rejected, adapter still emits only smart, the
  new state constants/readers are absent, and activation/mode normalization rejects autonomous. Windows honestly skips POSIX rendering.

## Implementation bounds

- `.nonce`: max 64 captured bytes; exact `16` lowercase hexadecimal characters plus optional single terminal LF normalization.
- `.attestation`: max 128 captured bytes; exact `64` lowercase hexadecimal digest plus optional single terminal LF, compared against
  SHA-256 of captured task bytes every invocation.
- ledger names: `ledger-<agent>.jsonl`, agent `[A-Za-z0-9][A-Za-z0-9_-]{0,63}`; max 32 files, 256 KiB each, 1 MiB aggregate,
  10,000 non-empty records total.
- ledger record: exact seven keys `tick,ts,agent,phase,event,summary,files`; positive bounded integer tick, filename-matching agent,
  upstream event allowlist, bounded strings/files and strict UTC timestamp. Snapshot normalization retains exact tick and safe event;
  prose, timestamps, phase and file names do not reach the pristine summary renderer.
- A scoped workspace `.attestation` or legacy-root `.plan-attestation` is normalized into `.plan-attestation` inside the private root-shaped
  snapshot because the pristine injector resolves that snapshot as a legacy-root plan. This is invocation plumbing, not a second state format.
