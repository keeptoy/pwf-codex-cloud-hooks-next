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

## 2026-08-13

- Maintainer identified that `v0.4.0-dev` is a multi-gate version and therefore still needs a coarse gate status ledger. Recovered the
  clean post-P5 tree and re-audited template, version acceptance, governance guide and lifecycle assertions.
- Corrected the responsibility model: version acceptance owns PASS/current-pending/not-authorized gate indexing plus current-gate
  template/prompt delta; active task plan alone owns per-step progress, retries, exact pending execution inputs and Next Step.
- Restored an F0/F1/F2A/F2B/F3 status table and an F2A validation-delta section that links the current Source/Candidate scripts and
  C/D/E2 prompts, including both exact markerless legacy sentinels. No source/ZIP/hash evidence is prefilled before Cloud completion.
- First focused boundary run passed 8/9. The sole failure was an old regex coupling the order of three documentation-responsibility
  rows; replaced it with independent row-level responsibility assertions rather than changing the new ownership model.
- Second focused run again passed 8/9 and exposed only a newly introduced cross-section wording/order assertion. Split it into exact
  permission and prohibition checks so the test protects ownership semantics without freezing prose layout.
- Third focused run exposed the same class in a legacy dev/stable line-wrap assertion. Audited the remaining responsibility cluster
  and converted compound prose-order checks to explicit anchors and stable keywords.
- Full-text consistency scan found and removed one contradictory tail rule that still banned all unfinished-gate status tables; it
  now bans only prefilled exact evidence. Split F0, F1A and F1B into separate PASS rows so the version ledger maps the actual gates.
- Full local regression passed 146 tests: 128 pass, 0 fail and 18 honest Windows/POSIX skips. Importer, Python compile, Node syntax,
  discovered-path bootstrap syntax and diff checks passed. Linked F2A local PASS to the Phase 4.4 implementation lifecycle
  reconciliation; P6 is locally complete and remains stopped before F2B/F3.
- Maintainer returned the first F2A Cloud 9.1 failure and a same-container corrected run. Compared its v1 paths/keys against current
  9.1 and classified it as stale external script drift; current template was already manifest-routed v2.
- Accepted the corrected complete read-only v2 invocation as 9.1 step PASS and moved the coarse gate to evidence-writeback pending;
  exact 4.1 identity/Linux/ZIP and B/D/E2 evidence are still required before final PASS. Strengthened 9.1/9.2 to derive
  `roots.installed`, validate all v2 partition bytes, emit an exact protocol marker, and bind the Source deep check to HEAD.
- First P7 governance run left only two documentation-test defects: a Markdown line-wrap assumption and a status-row link removed
  during wording edits. Restored the sequence link and made the one-shot-version assertion whitespace-tolerant.
- Focused architecture/lifecycle verification now passes 16/16; embedded Python and all four Bash template blocks pass syntax checks.
- Full local regression passed 146 tests: 128 pass, 0 fail and 18 honest Windows/POSIX skips. Importer, Python compile, Node syntax,
  bootstrap syntax and diff checks passed. P7 is locally complete; only same-run F2A Cloud evidence writeback remains before PASS.
