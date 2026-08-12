# Progress: Phase 4 F1B Inactive Runtime Foundation

## 2026-08-12

- Maintainer authorized F1B after F1A completed at local commit `b9492e8`.
- Restored README/ARCHITECTURE/DESIGN/ROADMAP, active F1A records, Phase 4.1/4.3 design evidence, current contracts/source/tests, and confirmed a clean `0.4.0-dev` worktree.
- Created a separate F1B implementation scope. Explicitly excluded F2 activation, Cloud, seal, publication and remote writes.
- Initial inventory confirms v1 plan request/result are consumed only by adapter, owned-plan, bundle/install projection and direct tests; upstream future-mode code is packaged but remains unreachable through the current private snapshot.
- Recovered the concrete request/result v2 shape and the F1B capability boundary from Phase 4.1/4.3. Next action is to freeze the state-helper grammar and installed-transition window, then add nearest failing contract/runtime tests.
- Froze the F1B state seam as safe `.mode` capture/normalization only; nonce, attestation and ledger remain deferred with no reader. Reconfirmed that installed transition retains exactly one accepted v0.3.5 window: the unpublished F1A checkpoint is not promoted into a compatibility contract.
- Added failing-first contract, adapter seam, future-profile refusal and inactive mode-normalizer tests. The expected red run produced six product failures after rerunning outside the Windows sandbox (`spawn EPERM` inside the sandbox).
- Implemented plan request/result v2, legacy-only producer/runtime capability, bounded result profile/advisory validation and the inactive `.mode` seam. Added static and dynamic zero-call proofs plus unsafe-file/race Linux cases.
- Rotated current plan ABI paths in bundle/Release/install tests and closed adapter/runtime/schema → bundle → manifest hashes. Retained v1 plan paths only inside the exact v0.3.5 predecessor profile and historical evidence.
- Extended focused supply-chain/install regression passed: 102 tests, 89 pass, 0 fail, 13 Windows/POSIX skips. Golden Host output, installer transition and deterministic Release tests were green.
- First full suite found a product defect in forward migration: exact v0.3.5 state passed predecessor validation but its superseded v1 ABI files survived the new v2 write and became unknown current residue. Fixed by deriving only `verified predecessor inventory - current inventory`, backing up first, then retiring those exact paths before current writes; the general unknown-file blocker remains unchanged.
- Installer/oracle rerun passed 45 tests (44 pass, 0 fail, 1 Windows/POSIX skip), including forward takeover, clean rollback and tampered-predecessor pre-write refusal.
- Final Windows full suite passed: 141 tests, 127 pass, 0 fail, 14 honest Windows/POSIX skips.
- Importer, Python compile, Node syntax, `git diff --check`, current hash-chain audit and residue scan passed. Only exact v0.3.5 predecessor inventory and current absence guards mention plan-v1 paths.
- Two independent candidate builds were byte-identical and both contract-healthy: 22 entries, 80,800 bytes, local development SHA-256 `1866d56503a38dbd8269362c475c63ba1f4638ab7f69f66bad3b6ac9d5653dc9`. This is evidence only; zero-hash bootstrap remains unchanged and no seal occurred.
- F1B local checkpoint is complete. Linux descriptor/state cases and no-live Cloud acceptance remain unexecuted; F2A, seal, publication and remote writes remain unauthorized.
- Final governance/contract check passed 21/21 with no skips. Prepared one scoped local commit and stopped at the F1B boundary.
- Maintainer requested the Linux/no-live Cloud handoff. Audit found `docs/v0.4.0-dev-cloud-hard-acceptance.md` still described the F1A checkpoint (`plan/catch-up v1`, `F1B not authorized`), so it cannot be used unchanged. Reopened only a documentation handoff calibration sub-gate; production remains frozen at commit `c0ef9d1`.
- Recalibrated the version-specific Cloud handoff to F1B: plan v2/catch-up v1, legacy-only capability, inactive `.mode` seam, absent nonce/attestation/ledger readers, Linux zero-skip proofs and dynamic v2 inventory checks are now explicit.
- Froze the maintainer run to Source/Candidate/no-live sections `4.1 -> 5.1 -> 6 -> 7 -> 8.1 -> 8.2 -> 9.1`; Published Release sections remain prohibited for the zero-hash, unsealed candidate.
- Focused governance test exposed one stale lifecycle assertion that still required the current acceptance to say “F1B not authorized.” Advanced that guard to the real post-F1B boundary, “F2A/F2B activation not authorized,” instead of falsifying the handoff document.
- Final handoff validation passed: `git diff --check` clean and focused documentation/governance suite 16/16, 0 failed, 0 skipped. Cloud execution remains with the maintainer after push; F2A remains unauthorized.
