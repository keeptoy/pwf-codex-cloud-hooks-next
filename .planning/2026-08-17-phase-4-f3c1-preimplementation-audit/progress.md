# Progress: Phase 4 F3C1 pre-implementation HEAD audit

## 2026-08-17

- Maintainer authorized an exact-HEAD pre-implementation audit, not F3C1 construction.
- Session catch-up returned no unsynchronized context; starting branch was clean `0.4.0-dev` at `19508c8`.
- Created a separate markerless audit scope and froze rollback/install/Cloud/ref/production boundaries.
- Re-read README, ARCHITECTURE, DESIGN and all ROADMAP sections. Stable ownership, activation-first admission, Pre-1.0 transition policy and
  current programme state remain aligned with Phase 4.10; ARCHITECTURE already includes F3B2/F3B3 live facts while correctly leaving F3C unimplemented.
- Audited current transition contract, installer admission/write ordering, uninstall/backup boundaries, immutable v0.3.5 installer source and
  publication roundtrip tests. Supported forward/clean-install asymmetry remains valid; the exact old-over-current refusal needs F3C1 executable coverage.
- Audited current owned-plan activation-first code, F3 evidence v1 shape and all frozen F3B refs/disarm diffs. They support reusing exact disarm
  refs and require a separate rollback evidence record rather than overloading v1.
- Reconciled current manifest-routed contract hashes, bundle/release inventory and immutable v0.3.5 identities; no identity drift was found.
- Added a Phase 4.10 pre-implementation audit tail and static guards. It preserves the route while correcting the direct-downgrade refusal
  mechanism from “schema mismatch” to v0.3.5 exact-path refusal of current-only entries; F3C1 executable proof remains required.
- Focused audit suite passed 75/92 with 17 honest Windows skips; full suite passed 143/166 with 23 honest Linux/POSIX skips and zero failures.
- Importer, Python/Node/Bash syntax and diff checks passed. Two deterministic builds remained 22 entries, 85,533 bytes and exact SHA
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`.
- Active audit scope had zero machine-state residue; all 11 local validation refs matched remote-tracking counterparts; changed paths had zero
  Release-boundary intersection. No real install/rollback, Cloud or ref mutation occurred.

## Current status

`F3C1_PREIMPLEMENTATION_HEAD_AUDIT_PASS / PHASE_4_10_ROUTE_UNCHANGED / DIRECT_DOWNGRADE_TEST_REQUIRED / IMPLEMENTATION_NOT_AUTHORIZED`
