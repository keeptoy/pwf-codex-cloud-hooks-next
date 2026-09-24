# Progress: A20 `NONE` state

## 2026-09-24

- Ran session catch-up and confirmed clean worktree. Recovered root reading route, active B4m closeout, prior A20 B1d residual, ROADMAP §2/§4/§5.1, Product overview index, and nearest architecture tests.
- Opened a separate A20 gate; current ROADMAP stays active Phase 5. Next: implement the synthetic `NONE` relation and negative/benign probes.
- Clarified ROADMAP §5.1: `NONE` removes §4 train/Phase pointers while §5 and the overview index preserve completed materializations; Release closeout alone does not change Product Phase status.
- Extended A20 route guard to branch on active/NONE, retain accepted-evidence and index/file checks, reject stale §4 exact identity or overview pointers, and require zero active Phase rows in NONE. Preserved active-train package identity check when a train exists.
- Added in-memory NONE fixture with stale exact identity, stale overview pointer, active-row, premature future overview, index-drift, and wrong accepted-evidence negatives plus an equivalent-summary positive. Current ROADMAP remains active Phase 5.
- First focused test attempt hit Windows sandbox `spawn EPERM` before any assertion. Escalated focused run passed 18/18 before the final premature-overview probe was added.
- First full Windows run failed one repository-boundary test because the synthetic fixture hard-coded the current version. Changed the fixture to derive version, accepted-evidence target and Phase numbers from current sources; no governance guard was weakened.
- Focused architecture suite passed 18/18 after dynamic fixture. Full Windows suite passed 184/210 with 26 POSIX-only skips and zero failures. `node --check` and `git diff --check` passed before the final one-sentence ROADMAP clarification and link-label handling; rerun the final checks before commit.
- Final full Windows suite after those last changes passed 184/210, with 26 POSIX-only skips and zero failures. `node --check tests/architecture-contracts.test.js` and `git diff --check` passed; status contains only this gate's ROADMAP, architecture test, and planning files. Ready for one scoped local commit.
