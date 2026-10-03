# Progress: Phase 5.3 G1 advisory classifier foundation

## 2026-10-03

- Re-read the planning skill and recovered README, ARCHITECTURE, DESIGN, ROADMAP, Wiki and the completed
  risk-lane Discovery planning. Session catch-up reported no unsynchronized context; the worktree was clean on
  `0.5.0-dev`.
- Interpreted the maintainer's “继续” against the exact prior handoff as authorization for Phase 5.3 G1 only.
  G2～G5, Release workflow changes, versioning, Cloud and remote actions remain unauthorized.
- Created this dedicated G1 active planning scope before implementation. The first task is a direct inventory of
  relevant policy/tool/test conventions and a minimal read-only seam.
- Re-read the frozen Phase 5.3 G1 contract and inspected package/Release authorities plus repository tool/test
  conventions. Confirmed G1 can remain Release-excluded and advisory by consuming existing inventories rather
  than modifying or duplicating the Release/runtime contracts.
- Inventoried repository-boundary exact source zones, Python CLI conventions and disposable Git test helpers.
  Froze a two-file source-only implementation (`classify_release_risk.py` + JSON policy), head-commit Release
  authority consumption, raw NUL Git delta evidence, deterministic advisory schema v1 and a dedicated Node test
  module. G1 deliberately omits identity normalization and required-gate selection.
- Added six boundary-first tests covering deterministic/read-only output, four-lane precedence, add/delete/rename/
  mode evidence, unknown/unsafe/self-change fail-closed behavior, test-evidence invalidation and endpoint errors.
  The sandbox invocation hit the known Windows `spawn EPERM`; the approved escalated run reached the expected
  red state, 0/6, because the G1 tool/policy had not yet been implemented.
- Implemented the source-only JSON owner policy and Python classifier. The first green attempt passed 5/6; the
  remaining failure was a fixture defect where `git add -A` removed an index-only synthetic symlink. Adjusted
  only the fixture commit helper so the unsafe object reaches the classifier unchanged.
- The unchanged G1 boundary suite now passes 6/6. It confirms deterministic JSON, no worktree mutation, all four
  lane representatives, strict mixed-change precedence, raw add/delete/rename/mode evidence, unsafe symlink and
  unknown-path FULL fallback, classifier/policy self-protection, test-evidence invalidation and exact endpoint
  rejection.
- Integrated the classifier/policy into the exact source-only trusted inventory, DESIGN module/test maps, Wiki
  maintenance entry, Phase 5 overview and CHANGELOG without changing the Release artifact contract.
- Python compile and `git diff --check` passed. Real-repository replay classified the completed history-promotion
  range as source-only with zero unknowns and current `v0.4.4..HEAD` as `PRODUCT_OR_SECURITY`; remaining unknown
  identity/template paths fail closed and are intentionally deferred to G2.
- Focused classifier, architecture, repository-boundary and Release-package regression passed 56/56.
- Full Windows `npm test` passed with 190 pass, 26 honest POSIX/Linux-only skips and 0 failures. Importer check,
  Python compile and Node syntax passed. The first sandboxed `bash -n` attempt hit Git Bash signal-pipe error 5;
  the identical escalated check passed for all tracked versioned bootstraps, followed by `git diff --check` PASS.
- Appended the optional Phase 5.3 G1 post-implementation status without rewriting the frozen Discovery decision.
  The status records delivery parity, lifecycle KEEP decisions, local-only evidence and the explicit G2～G5 stop.
- Post-document governance/link regression passed 47/47. G1 is locally complete and ready for scoped commits;
  no production, contract, package version, Release asset, Cloud or remote state changed.
- Commit `347e457` (`feat(tooling): add advisory release risk classifier`) records the scoped G1 delivery. A
  post-commit replay from prior HEAD `708432b` to exact G1 commit `347e4577818e5c658635b1688753d7c654c16ee3`
  returns `PRODUCT_OR_SECURITY`, `advisory_only=true` and `classifier_self_change=true`, confirming the committed
  tool/policy cannot classify their own introduction into a fast lane.
