# Progress: Phase 5.1 B0 frozen Discovery admission

## 2026-09-23

- Read the planning-with-files skill and ran session catch-up; no unsynced context was reported. Verified a clean `0.5.0-dev` worktree before activating the B0 scope.
- Recovered README, ARCHITECTURE, DESIGN, ROADMAP, Wiki and the completed decision-package planning in repository order. The maintainer's “好的，继续” authorizes only the proposed B0 freeze/index/test-admission transaction.
- Inspected the existing history index, draft, nearby test seam and role markers. Legacy records mostly lack per-file role metadata, so B0 will verify exact index membership and summary aggregate plus the new record's explicit role; fuller legacy role migration stays in B3.
- A PowerShell glob passed literally to `rg` failed; recorded the error and reran with `docs/history -g '*.md'` successfully.
- Added the scoped history-index guard and negative/positive in-memory probes before documentation edits. The first targeted run failed as expected because Phase 5.1 had not yet been indexed.
- Froze the Phase 5.1 decision with a pre-freeze exact source link and registered it in the history index. The first post-freeze targeted run found a test-expectation defect: removing a row failed earlier on count mismatch than on unindexed membership. Widened only that probe's expected diagnostic; the guard itself was unchanged.
- Targeted B0/adjoining history tests passed 2/2 after the probe fix. Focused architecture/repository governance tests passed 30/30, including Markdown links and planning lifecycle. Initial full `npm test` passed 167, skipped 26 Windows POSIX cases, failed 0.
- Added final adversarial coverage for a missing indexed file and a later explicitly marked open draft, plus an equivalent index-row summary rewording. The targeted B0 test passed again; final full regression remains to rerun on this exact state.
- Final focused governance run passed 30/30. Final full `npm test` passed 167 with 26 honest Windows POSIX skips and no failures. `node --check tests/repository-boundary.test.js` and `git diff --check` passed. These local checks do not supply Linux/Cloud evidence or authorize a later lane.
- Verified that the cited exact decision-source commit contains the complete decision-package findings. Inspected the exact B0 diff: one active pointer, the scoped plan, one history record, one history index and the nearest repository-boundary test; no B1–B4, machine, production, Cloud or Release file changed.
