# Progress: Phase 9 instance — v0.4.0 Release Discovery

## 2026-08-19

- Maintainer authorized Phase 9 Discovery after F3C4 aggregate closure and first retirement review.
- Ran planning session catch-up; confirmed clean `0.4.0-dev` at `d5102ca` and a completed predecessor plan.
- Opened a version-scoped standing-gate plan. No Release input, Cloud environment, ref or remote state has been changed.
- Read README and ARCHITECTURE completely. Confirmed the deferred README pre-live sentence and found two additional stale F3C-future
  claims in ARCHITECTURE; widened the Discovery inventory, not the implementation authorization.
- Read DESIGN and ROADMAP. Identified stale future-gate wording in DESIGN's test routing and lower ROADMAP sections while preserving the
  current top-level Phase 4/standing-Phase-9 authority. No stable or Release-input document was edited.
- Audited package, manifest, runtime bundle, Release v2, bootstrap and principal Release tests. Froze the stable version/hash propagation
  graph and confirmed README is the only macro document in the 22-entry ZIP.
- Read the Cloud template, v0.3.5 acceptance precedent, current v0.4.0-dev acceptance, CHANGELOG and provenance. Confirmed acceptance
  rename-not-duplicate semantics, four distinct Release gates and several Release-excluded stale-v1/F3-pending narratives.
- Audited candidate/publication/repository/contract tests. Identified the mixed v2-accepted/v1-fallback oracle migration and classified
  stable-identity hardcodes versus the v0.3.5 predecessor contract that must remain unchanged.
- Completed the authority/identity readiness gate and entered the pre-seal input inventory.
- Audited all 11 validation refs. Two runtime-source commits are already reachable from the development line, but nine lifecycle commits
  remain side-branch-only and none is retained by the current stable tags. Recorded hashes do not replace object retention, so the
  Phase 9 default is KEEP unless a later separately authorized archival migration proves an equivalent recovery path.
- Logged one harmless audit-command defect: an expected negative ancestry result became the combined shell command's final exit code.
- Confirmed F3B2/F3B3/F3C guides are exact executable dev-evidence records, with tests bound to their paths and frozen identities. They
  stay under their existing names; stable publication must link them rather than rename them.
- Reconstructed the v0.3.5 commit sequence and preserved its separation between candidate evidence, stable byte seal, tag evidence and
  later published-role governance as the model for v0.4.0 sub-gates.
- Materialized the version-scoped Phase 9 history, Phase 4.11 successor link, history index policy, ROADMAP P9-A～P9-F route and a
  version-acceptance Discovery row. Release inputs remain unchanged.
- First focused runner attempt was platform-blocked by Windows sandbox `spawn EPERM`; direct-file execution proved the new Phase 9
  guard passes and identified one stale Phase 4 prose assertion, which was narrowed to the enduring closeout fact before rerun.
- Focused architecture/F3/rollback/repository suite now passes: 28 tests, 26 pass, 0 fail and 2 honest Linux-only skips. This is a
  Windows Discovery result; it does not claim Linux or Cloud acceptance.
- Full Windows suite passes: 173 tests, 148 pass, 0 fail and 25 honest Linux/POSIX-only skips.
- Closed P9-D1 through P9-D3: pre-seal inventory, P9-A～P9-F evidence routing, role rotation and object lifecycle decisions are frozen.
  Entered final documentation/verification handoff only; P9-A remains unauthorized.
- A parallel static-postflight attempt hit Git Bash `Win32 error 5` while creating its signal pipe. No repository defect was inferred;
  postflight is being rerun sequentially so each final exit status remains attributable.
- Sequential postflight passed importer, owned Python compile, installer Node syntax, all bootstrap Bash syntax and `git diff --check`.
- Two independent candidate builds/checks remained byte-identical at the existing 22-entry development identity; temporary ZIPs were
  removed. Changed paths intersect neither Release entries nor external assets.
- Corrected an audit-only ref prefix mistake and then required all 11 local/origin validation ref pairs to match exactly; PASS.
- Closed P9-D4 with a version-scoped conditional-go. The next authorized action, if the maintainer chooses it, is P9-A only.

## Current status

`CONDITIONAL_GO_TO_V0_4_0_PHASE_9_PRE_SEAL_MATERIALIZATION / IMPLEMENTATION_NOT_AUTHORIZED / RELEASE_INPUTS_UNCHANGED / PUBLICATION_NOT_AUTHORIZED`
