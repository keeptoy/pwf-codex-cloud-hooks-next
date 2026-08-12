# Progress: Phase 4 F1A Contract/Source Foundation

## 2026-08-12

- Maintainer authorized F1A after F0 completed at local commit `8c83659`.
- Confirmed clean worktree on branch `0.4.0-dev` before edits.
- Created a separate F1A implementation scope and initialized the required object-level migration lifecycle ledger.
- No F1A contract, production, test, or Release bytes changed yet.
- P0 first inventory mapped all current v1/schema3 hard-coding in importer, installer, builder and tests, confirmed adapter special-casing and two source-only catch-up ABI schemas, and revalidated the planned v2 shape against actual consumers.
- Captured current adapter/runtime/ABI/notice SHA-256 leaves. A PowerShell-only helper for historical raw hashing used unavailable framework APIs; logged and switched to Node/Python rather than retrying it.
- Added the first failing-first F1A contract assertion: exact source schema4, bundle/Release v2, adapter + four ABI placement, retired-field absence, and current-v1 path removal.
- Implemented the first atomic contract/source cutover across schema4 manifest, runtime bundle v2, Release artifact v2, accepted-state transition contract, importer, installer and builder.
- Focused regression reached 71 pass / 5 fail / 1 honest Windows skip. Classified every failure as incomplete F1A propagation: one stale `bundle.files` test reader, two missing catch-up ABI paths in expected installed inventory, one intentionally obsolete permissive backup fixture, and current authority docs still naming v1 contracts. No runtime-behavior or trust-model conflict was found.
- Closed all focused failures without weakening admission. The backup test now starts from a complete supported current install; expected inventory includes all four ABI schemas; current docs and Cloud acceptance template discover v2 contracts through the manifest.
- Added immutable-package evidence for exact v0.3.5 -> current migration, candidate uninstall -> v0.3.5 clean rollback, and tampered predecessor rejection before backup/mutation.
- Focused F1A regression passed: 79 tests, 78 pass, 0 fail, 1 honest Windows-only permission skip.
- Static review tightened Release-v2 external asset/excluded-prefix list validation and predecessor transition duplicate id/path/key/event rejection; the added mutation suite passed (47 tests, 46 pass, 0 fail, 1 Windows permission skip).
- Final syntax batch confirmed importer health before Git Bash hit a Windows sandbox signal-pipe denial; remaining syntax/mode/diff checks were split for an outside-sandbox retry.
- Outside-sandbox Bash syntax passed for every bootstrap; Node/Python syntax, importer check, Git `100755` inventory and `git diff --check` passed.
- Deterministic candidate double-build/check passed with 22 entries, 79,482 bytes and SHA-256 `5efffac1182431f640b1992a95aa4d7326bddfb03683dc25736b287cabe52b3a`; this is local development evidence, not a seal.
- First full regression classified one stale governance fixture requiring “F1A not authorized”; after advancing it to the documented F1B stop boundary, the complete suite passed: 136 tests, 124 pass, 0 fail, 12 honest Windows/POSIX skips.
- Lifecycle ledger reconciled every F1A object. No unowned current residue remains; exact v0.3.5 transition retirement is owned by installer governance and must be reviewed at accepted-baseline promotion, no later than F3/Phase 9.
- F1A is complete and stops before F1B. The final local changeset contains only this contract/source foundation gate; no push, Cloud run, seal, publication, activation or F1B implementation was performed.
- Created the single scoped local F1A commit after the sandbox-only `.git/index.lock` denial was retried outside the filesystem sandbox; remote state remains untouched.
