# Progress: Phase 4 F3C rollback Discovery

## 2026-08-16

- Maintainer authorized F3C Discovery after F3B4 aggregate closure.
- Session catch-up returned no unsynchronized context; initial branch/worktree was clean `0.4.0-dev`.
- Created a separate markerless Discovery scope and froze implementation, Cloud, rollback, ref mutation and Release boundaries.
- Read the stable support, architecture, implementation and programme authorities. The key split is now explicit: publication rollback
  identity does not itself promise installed-state downgrade compatibility, and installer ownership remains separate from workspace intent.
- A broad history search used one incorrect Phase 4.6 filename and exited nonzero after returning partial matches. Logged the error and
  corrected the path from the history index; no repository or external state changed.
- Recovered the exact installed transition contract and publication roundtrip tests. They already prove one critical distinction:
  forward migration accepts v0.3.5 in place, while rollback is intentionally uninstall-then-clean-install.
- Verified both accepted disarm refs are single-path activation deletions and recovered the immutable v0.3.5 public asset identities that
  must anchor the old-runtime half of a future Cloud rollback run.
- Rechecked the current official Codex Cloud environment lifecycle. The future operator protocol must be stage-explicit and self-normalizing;
  cache continuity and setup-shell exports cannot be correctness inputs.
- Froze the only supported transaction as committed disarm, candidate legacy confirmation, current-owned uninstall, immutable v0.3.5 clean
  install, then exact current forward migration and a second legacy confirmation. Direct downgrade and armed/runtime-only rollback remain denied.
- Split future work into F3C1 Release-excluded protocol/no-live materialization, F3C2 smart live, F3C3 autonomous live and F3C4 aggregate
  closure. Existing disarm refs are reused; no new workspace lifecycle chain is needed.
- Determined that F3 evidence v1 cannot represent accepted and candidate runtime identities without ambiguity. A future repository-only rollback
  evidence helper is required; production contracts and Release inventory remain unchanged.
- Added Phase 4.10, history index, ROADMAP/acceptance status and exact static guards. No production, contract, installer, README or Release entry changed.
- Focused suite passed 22/22. Full Windows suite passed 143/166 with 23 honest Linux/POSIX skips. Importer, Python/Node/Bash syntax and diff checks passed.
- Two independent candidate builds remained byte-identical at 22 entries, 85,533 bytes and SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`; changed/Release intersection and active machine-state residue were zero.
- All 11 local F3B validation refs still matched their 11 remote-tracking counterparts. No rollback, install switch, Cloud task or ref mutation occurred.

## Current status

`F3C_DISCOVERY_COMPLETE / CONDITIONAL_GO_TO_F3C1_ROLLBACK_PROTOCOL_MATERIALIZATION / IMPLEMENTATION_NOT_AUTHORIZED / REFS_FROZEN`
