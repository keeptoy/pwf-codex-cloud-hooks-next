# Progress: Phase 4 F2A smart activation implementation

## 2026-08-12

- Maintainer authorized F2A implementation after F1 and the opt-in surface clarification were closed.
- Re-read planning-with-files instructions and repository authorities; confirmed a clean `0.4.0-dev` worktree.
- Recovered F2A Discovery, Phase 4.4 and current repository inventory. No architecture-level conflict found.
- Created this isolated implementation scope. F2B, real activation state, live Cloud/F3, Release and remote writes remain excluded.
- Completed current call-graph and hash-propagation inventory. Confirmed the existing safe reader/private snapshot/result schema are
  sufficient; no new schema, Host event, upstream file or writer is needed.
- Added failing-first nearest tests for `[legacy, smart]` producer/validator capability, independent activation/profile normalization,
  unarmed zero-read, exact smart rendering, armed refusal, disarm and post-render mutation. The focused suite failed only at the four
  intended unimplemented boundaries: legacy-only producer/runtime, missing activation normalizer and legacy-only result validation.
- Implemented the first runtime/adapter pass: activation-first state capture, exact F2A mode grammar, identity evidence, post-render
  revalidation, private child `PWF_INJECT=smart`, `[legacy, smart]` capability and relational result validation.
- Focused portable suite now passes 16 tests with 12 honest Windows Linux-only skips. P2 remains open until the complete Linux safety
  matrix and integration behavior are exercised.
- Local WSL is not installed, so the attempted Linux-only focused run could not start. This is a platform limitation, not a product
  result; the Linux gate remains mandatory and cannot be replaced by Windows skips.
- Confirmed Docker and Podman are also unavailable locally; no substitute Linux runner exists on this workstation.
- Completed runtime/adapter integration, exact activation/mode normalizers, activation-first zero-read, two-pass identity+byte
  revalidation, smart-only private child environment and relational result validation. Added the real adapter→owned-plan smart/disarm
  composition guard and canary-only armed-refusal guard.
- Updated current architecture/design/user/roadmap/changelog/acceptance documentation. Added an atomic user-side activation order,
  read-only production probe and Phase 4.4 post-implementation tail without claiming Cloud lifecycle PASS.
- Propagated the final adapter, owned-plan and request-schema bytes through runtime-bundle-v2 and the raw bundle hash in
  upstream-manifest. Release inventory and request/result schema versions remain unchanged.
- Full Windows regression passed: 146 tests, 128 pass, 0 fail and 18 honest Linux/POSIX skips. Python compile, Node syntax, Git Bash
  syntax, importer check and `git diff --check` passed.
- Final independent candidate builds were byte-identical: 22 entries, 82,635 bytes,
  SHA-256 `7f1b1bd30d73011b0003d9c7e67e2df31bd302a08932c1302a83a84636ac3db4`. This is local reproducibility
  evidence, not a seal or Published Release identity.
- Local F2A implementation is complete. Stop before F2B/F3 and wait for the maintainer's Linux/Source-Candidate/no-live Cloud
  acceptance with zero skipped tests.
- Maintainer authorized a post-implementation documentation and Cloud-protocol follow-up before push/acceptance.
- Audited Phase 4.4, the reusable Cloud template, the current version acceptance, lifecycle governance tests and the active plan.
  Confirmed that the Linux suite already discovers F2A tests dynamically, while the old canonical black box could not discriminate
  markerless legacy from accidental smart selection.
- Added a Phase 4.4 post-implementation lifecycle reconciliation covering retired F1 grammar, active commit-point/profile/admission/
  schema/private-renderer seams, temporary user UX, denied F2B/Phase-8 state and explicit review/retirement triggers.
- Strengthened C/D/E2 with a structured markerless fixture: completed and active legacy sentinels must both be observed, and the
  canonical workspace is forbidden to create activation/profile files.
- Removed dynamic F2A pending prose from the version acceptance. ROADMAP/task plan retain current state; the version file keeps only
  completed F1B exact evidence until F2A Cloud evidence is actually returned.
- The first focused boundary run reached 8/9 pass; the only failure was an over-specific Chinese sentence-order regex. Replaced it
  with exact sentinel placement/count and no-activation-file assertions instead of weakening the behavioral boundary.
- Full local regression passed 146 tests: 128 pass, 0 fail and 18 honest Windows/POSIX skips. Importer check, Python compile and Node
  syntax passed. The combined command's hard-coded `C:` Git Bash path was invalid on this `D:` installation; bootstrap syntax is
  rerun separately using the discovered executable rather than treating that command defect as a product failure.
- Discovered-path bootstrap syntax and final `git diff --check` passed. P5 is locally closed; the next external action is maintainer
  push followed by the updated Linux/Source-Candidate/no-live Cloud run. No F2B/F3 work is authorized.
