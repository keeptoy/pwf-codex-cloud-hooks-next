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
