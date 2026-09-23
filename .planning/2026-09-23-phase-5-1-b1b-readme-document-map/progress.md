# Progress: Phase 5.1 B1b README document map

## 2026-09-23

- Read planning-with-files skill and ran session catch-up (no unsynced report); confirmed clean worktree before changing the active scope.
- Recovered root repository guidance, README/ARCHITECTURE/DESIGN/ROADMAP/Wiki reading route, completed B1a planning and the frozen Phase 5.1 B1 inventory.
- Selected A12 as the next bounded B1 group and created scoped planning. No test or README content has changed yet.
- Inspected README's map table and A12's test block. The old checks see seven filenames anywhere in README and ban moving-role phrases in the whole file; adjacent DESIGN and machine-code checks are separable. Chose parsed table role checks plus a scoped dev/Release delegation boundary, with in-memory wrong-owner and equivalent-prose probes.
- First focused test: A12 passed, but `repository-boundary` rejected a concrete development version string inside the in-memory counterexample. Classified as test fixture drift against the existing version-neutral test-source rule; replaced it with `moving candidate`, keeping the same role-table failure probe.
- Expanded A12 to require every map row to retain a navigable destination and made the benign probe actually re-label the map link. The next focused run exposed a parser error: the Markdown divider row was being treated as a data row. Filtered divider rows; no README defect was found.
- Final harmful probes reject wrong programme/implementation owners despite safe decoys elsewhere, unlinked Product overview, competing active-plan owner, a second current-role table and a README development build runbook. Harmless probe permits rewritten programme question/link label and an ordinary rollback caution.
- Final `node --check tests/architecture-contracts.test.js` passed. Full Windows `npm test`: 196 total, 170 pass, 26 POSIX/Linux-only skips, 0 fail. Skips are not Linux/Cloud evidence. `git diff --check` passed; no README, production, contract, Release asset, Cloud or remote change.
