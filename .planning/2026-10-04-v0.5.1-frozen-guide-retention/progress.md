# Progress: v0.5.1 frozen acceptance-guide retention

## 2026-10-04

- Confirmed a clean worktree on branch 0.5.0 with no divergence from origin/0.5.0; recovered current acceptance
  index, Release/installed-predecessor contracts, package identity and manifest integrity references.
- Created this active implementation scope under the maintainer's explicit request to start the discussed work.
  The scope authorizes local implementation and v0.5.1 candidate preparation; Cloud/Release execution is separate.
- Recovered the current guide's final C2 evidence and test dependencies. Defined a bounded three-column historical
  registry rather than allowing arbitrary old files, with current navigation checked independently.
- Added retention and historical-link negatives. The first normal Node invocation hit the known sandbox spawn
  EPERM; the outside-sandbox rerun failed as intended because the acceptance index had no registry yet. The frozen
  link fixture passed and proves replay does not borrow today's template.
- Implemented acceptance navigation, governance retention rules and operator-template lifecycle changes; updated
  inventory/link tests to distinguish exact current entrypoints from verified historical bytes.
- Focused architecture/repository regression passed 49/49 after scoping one legacy immutable-reference assertion
  to its owning section. `git diff --check` passed. Created local branch 0.5.1 for the authorized candidate work.
- Read-only canonical identity rendering from accepted C2 fixed the 0.5.0 predecessor snapshot and expected SHA;
  no runtime or adapter bytes are being copied from an older predecessor or modified.
- Saved the independently validated retention implementation as local commit 0437b11 on branch 0.5.1.
- Prepared package/Release identity 0.5.1, exact accepted-0.5.0 predecessor bytes and manifest references. Generated
  the candidate bootstrap from the unchanged canonical template; second check returned unchanged, with zero ZIP
  SHA and bootstrap SHA c51dfe2ff89b54ca1a076dd4bb70f818168fb4b12ff161e2b0e6dee261302cc1.
- Added the already-existing v0.5.0 sealed bootstrap source C2 to provenance after matching its raw SHA to the
  frozen public evidence. Published oracles can now recover accepted bytes independently of candidate identity.
- Routed ROADMAP/Phase 5 to the authorized v0.5.1 pre-C0 work without creating a Release guide. Reconciled the
  installed-predecessor assertion and moved v0.5.0 closeout checks to its immutable C2 snapshot, retaining a strict
  unchanged-current-guide assertion.
- First full Windows run: 224 tests, 195 pass, 26 honest POSIX/Linux skips and three governance failures. Product,
  installer/transition, accepted/fallback recovery and asset checks passed. Reconciled bounded minor-series route
  admission and the existing CHANGELOG heading format; a wrong-minor-series negative preserves the route guard.
- Importer returned healthy; Python/Node syntax and diff checks passed. The Bash sandbox probes were separately
  classified as signal-pipe permission errors; outside-sandbox syntax checks for accepted and candidate returned 0.
- Second complete regression passed: 224 tests / 198 pass / 26 honest Windows skips / 0 fail. Two deterministic
  ZIP builds/checks matched exactly: 84,518 bytes, 22 entries, SHA
  75c9eda81b6cc192df15346a5fb9bf60d2970e47ed53f3481887169778ac0a72; candidate-bootstrap recheck returned unchanged.
- Promoted recurring Node/Bash sandbox execution limits into the environment profile before this scope closes,
  as required by the repository's environment-memory rule. No WSL/container re-probe or Cloud run was performed.
