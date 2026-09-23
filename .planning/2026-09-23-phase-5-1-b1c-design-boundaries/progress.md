# Progress: Phase 5.1 B1c DESIGN ownership boundaries

## 2026-09-23

- Read planning-with-files skill, ran session catch-up with no unsynced report, and confirmed a clean worktree before changing active scope.
- Recovered repository reading route, completed B1b plan, frozen B1 inventory, full DESIGN and exact A14/A16 test seams. Selected A14/A16 as one bounded DESIGN group; no source or DESIGN content has changed yet.
- Replaced only A14/A16 clauses with `assertDesignOwnerBoundaries` and `assertDesignReverseIndexShape`; A13/A15 module-path and exact test-inventory assertions remain intact. Initial focused architecture/repository run passed 33/33. Next add in-memory wrong-route/second-authority and equivalent-prose probes.
- First adversarial focused run: 34 pass / 1 fail. The new competing-section detector missed the explicit Chinese heading `当前生产回滚` used by its own probe; the old whole-file ban had included that phrase. Classified as a test-guard defect, added that heading variant to the structural detector. No source/DESIGN defect.
- Subsequent diff review found that a direct current-rollback or runtime-budget fact sentence could evade heading/table checks; added narrow predicate-plus-value guards and negative probes. Re-focused run: 35/35 pass. Safe cross-reference and equivalent §6.1 prose still pass.
- Final `node --check tests/architecture-contracts.test.js` passed; full Windows `npm test`: 198 total, 172 pass, 26 POSIX/Linux-only skips, 0 fail. Skips are not Linux/Cloud evidence. `git diff --check` passed. Only A14/A16 tests, the active pointer and scoped planning changed; DESIGN, production, contracts, Release and remote state did not.
