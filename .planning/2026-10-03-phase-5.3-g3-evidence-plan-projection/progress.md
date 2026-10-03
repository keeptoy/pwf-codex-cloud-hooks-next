# Progress: Phase 5.3 G3 evidence plan and projection

## 2026-10-03

- Re-read the planning skill, ran session catch-up with no unsynchronized state, and confirmed branch
  `0.5.0-dev` was clean at completed G2 commit `43972e60633f0d2f0876a8273923271e1fd0836d`.
- The maintainer explicitly authorized G3. Created this separate active planning scope before evidence-owner
  research or implementation; G4/G5, reduced-lane enablement, Cloud/Release execution and remote writes remain
  outside authorization.
- Re-read README and ARCHITECTURE. Confirmed G3 belongs outside production/trusted execution and must project only
  advisory requirements into existing governance documents; it cannot establish acceptance, modify installer or
  Release authorities, or infer Cloud PASS.
- Re-read DESIGN and ROADMAP. Recovered the exact existing module/document owners and immutable C0→C1→C2,
  Source/Candidate→Published Release sequence that every G3 plan must preserve. Noted stale G1-only DESIGN text
  for reconciliation alongside the G3 implementation map.
- Re-read Wiki and the frozen Phase 5.3/history contract. Confirmed the stable usage text is still G1-only and
  that G3 must emit a measurable, deterministic lane-to-evidence projection while keeping all reduced lanes in
  shadow/advisory status.
- Inventoried the current hard-acceptance/operator-guide templates, the completed v0.4.4 two-channel guide,
  repository boundary tests and G2 implementation. There is no existing generated-block marker; EOF plus one
  exact marker pair is the only bounded seam that works for both document families without parsing human prose.
- Froze the V3 classifier + separate projector design, exact lifecycle preservation, shadow-only semantics,
  target confinement, atomic replacement and measurable projection counters. Advanced to failing-first tests.
- Added failing-first coverage for V3 owner/gate fields, all four release-risk lanes plus `NO_RELEASE_REQUIRED`,
  projector self-protection, exact lifecycle objects, both document families, check-only drift, second-run byte
  stability, human-prefix/suffix preservation and malformed/kind-conflicting no-write failures. The first sandboxed
  run hit the known Windows `spawn EPERM`; the approved out-of-sandbox rerun failed for the expected missing G3
  projector/V3 implementation while the unchanged historical replay test still passed.
- Implemented `PWF_RELEASE_RISK_ADVISORY_V3`: the G2 delta/closure semantics remain intact while explicit owner
  fingerprints, five evidence dimensions, lifecycle dispositions and shadow-only/current-FULL safeguards are now
  machine-readable. Added the projector to the classifier's exact self-protection owner set.
- Added the separate source-only projector with plan/check/write modes, target-family confinement, UTF-8/size/type
  checks, exact marker-pair handling, same-directory atomic replacement and pre-replace race detection. It never
  edits authority bodies or records PASS.
- The first implemented focused run passed all 12 tests, including the six exact replay samples with zero
  false-fast results, both document families, first-write/second-write/check idempotence and no-write failures.
- Tightened projector admission so operator-guide targets must use the established operator-guide or
  cloud-hard-acceptance filename families, and validated exact owner/lifecycle/authority field shapes before any
  target read or write. Ordinary `docs/history` Markdown is now rejected as the wrong document kind.
- Reconciled Wiki's stale V1 usage with the V3 plan/check/write commands and updated DESIGN's module/test map.
  Both documents continue to say the block is shadow-only and current ROADMAP FULL workflow remains operative.
  Added the projector to the repository boundary's Release-excluded source-only tool inventory.
- Re-ran the classifier/projector, repository-boundary and architecture-contract suites after hardening: 59 pass,
  0 fail. This confirms the new module remains outside the Release/trusted inventory, stable links resolve, and the
  existing authority/lifecycle guards still accept the G3 documentation without creating a second authority.
- Ran the complete Windows regression: 196 pass, 26 known POSIX/Linux-only skips, 0 fail. The runtime importer
  check returned healthy; production plus G3 Python compilation, `node --check install.js` and `git diff --check`
  all passed. Package, manifest, runtime/Release contracts and bootstrap/template diffs are empty.
- Appended the post-implementation G3 status to the immutable Phase 5.3 record and closed the activity with G4
  explicitly unauthorized until a future genuinely eligible train exists.
- Re-ran the final history/document authority guards after closeout: 47 pass, 0 fail.
