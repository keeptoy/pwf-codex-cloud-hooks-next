# Findings: Phase 4 F1A Contract/Source Foundation

## Frozen boundaries

- F0 commit `8c83659` is the clean entry baseline and `v0.4.0-dev` remains zero-hash/unsealed.
- F1A changes supply-chain contracts and installation projection only; plan request/result remain v1 and legacy output must remain behaviorally identical.
- Current source accepts only schema4/bundle-v2/Release-v2 after cutover. Published v0.3.5/v0.3.4 tests discover their own immutable v1 contracts.
- Installed manifest remains schema3 in F1A. Forward migration from v0.3.5 is exact and fail-closed; rollback is candidate uninstall/backup followed by immutable v0.3.5 clean install.

## Evidence log

- Current loaders hard-code source manifest schema3/nested schema2, bundle-v1 field sets, and release-v1 path. This confirms F1A must change importer, installer, builder, manifest, contracts and tests atomically.
- Adapter is currently prepended outside bundle by `sourceRuntimeFiles()`. Four upstream scripts and two owned runtimes are bundle entries; only two plan ABI schemas are installed, while catch-up request/result schemas are manifest-only integrity references.
- Release builder owns a second executable-path set. Release v2 must carry exact mode on every entry and builder must reject malformed/unsafe modes instead of inferring them.
- Plan/catch-up request/result schema bytes remain v1 in F1A. Only their placement changes; producer/consumer code must not change.
- Published-source tests currently mix historical fixed v1 paths with current fixed v1 paths. F1A must preserve historical self-discovery while routing current source through the manifest.
- Transition validation must run before backup or any write. Installed-manifest remains schema3; exact predecessor admission is additional input to `assertSafeRuntimeForInstall`, not a second current source loader.

## Closed F1A result

- Source admission is now one current chain only: exact manifest schema4 -> raw hash -> bundle/Release/transition contracts. v1 current contracts were removed; immutable v0.3.5/v0.3.4 oracles discover their historical contracts from their own source.
- Bundle structure now expresses origin instead of carrying overlay tombstones. Adapter and four v1 ABI schemas share the same bundle-owned install projection; installed manifest remains a state snapshot, not source authority.
- Release v2 owns every entry mode and builder no longer owns an executable-path mirror. Default contract discovery is manifest-selected and raw-hash verified; external assets and excluded prefixes are strict unique string lists.
- Exact v0.3.5 transition is a bounded compatibility window with an explicit retirement review at accepted-baseline promotion, no later than F3/Phase 9. It accepts only canonical manifest metadata, requirements ownership, exact inventory, bytes and POSIX modes before backup.
- Legacy behavior did not change: all four runtime protocol schemas remain v1, the adapter/owned runtime production files are byte-identical to the F0 baseline, and golden/activation/seam tests stayed green.
