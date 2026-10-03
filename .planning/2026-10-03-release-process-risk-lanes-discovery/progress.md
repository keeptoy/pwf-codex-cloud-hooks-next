# Progress: release process risk-lane discovery

## 2026-10-03

- Read the planning skill and restored README, ARCHITECTURE, DESIGN, ROADMAP, Wiki plus the completed prior
  planning scope. The worktree was clean on branch `0.5.0-dev`.
- Confirmed the maintainer authorized the proposed bounded Discovery, not production/Cloud/Release changes.
- Created this active planning scope to inventory and historically replay a machine-classified Release workflow.
- Read the Phase 5 current authority and Phase 4.17 retrospective. Confirmed that risk lanes, Release-surface
  reduction, historical replay, two identity channels and fail-closed FULL fallback are inherited Discovery
  requirements rather than a new unbounded proposal.
- Inventoried the 22-entry Release allowlist, external candidate bootstrap, current version owners and historical
  v0.4.1-v0.4.4 C0 tags. Began reconstructing each train's C0/C1/C2 evidence commits from first-parent history.
- Replayed each prior C2 → next C0 path set. Identified the key classifier requirement: validate and normalize
  only the canonical version-identity closure before classifying the residual semantic delta; otherwise every
  release is falsely escalated to Release mechanics. Confirmed historical representatives for product/security,
  Release mechanics and package-document lanes.
- Audited historical C1/C2 path ownership and the current builder/materializer. Found that C1 is presently the
  only durable repository resume point between Source/Candidate PASS and publication; a literal C0 + final-record
  workflow must remain conditional until a durable checkpoint replacement exists. Near-term design should retain
  a minimal generated C1 while removing its manual repetition.
- Drafted the read-only classifier algorithm, owner precedence, canonical identity normalization and lane-specific
  evidence matrix. Verified that Phase 5 already moved maintainer Release procedure out of packaged README, and
  that current v0.5.0-dev bytes require the FULL product/security lane because owned-plan behavior changed.
- Replayed a source-only planning retirement plus v0.4.1-v0.4.4 and current v0.5.0-dev through an analytical
  owner-precedence prototype. All six samples matched their known risk class with no false-fast assignment.
- Compared lifecycle options and froze `CONDITIONAL_GO` for a later read-only classifier/identity checker and
  generated minimal evidence projections. Immediate C1 removal, tag-derived versions, reduced v0.5 validation
  and external attestations remain out of scope or `NO_GO`.
- Projected only the stable Discovery summary into the Phase 5 overview and CHANGELOG. Kept detailed evidence in
  planning and did not create a Phase 5.x history record without the maintainer's separate promotion decision.
- `git diff --check` passed. The first focused Node test invocation was blocked by sandbox `spawn EPERM`; the
  identical escalated read-only command passed all 47 architecture/repository governance tests.
- Full Windows `npm test` passed with 184 pass, 26 honest POSIX/Linux-only skips and 0 failures. Discovery is
  locally complete; no production, contract, version, Cloud, Release or remote state changed.
- Initial scoped staging was blocked because the sandbox could not create `.git/index.lock`; exact-path escalated
  staging then succeeded, and commit `94ea8a5` (`docs(discovery): classify release risk lanes`) records the
  replay-backed decision and authority summary without production or Release changes.
