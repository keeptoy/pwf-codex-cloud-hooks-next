# Progress: R28 history index admission

## 2026-09-23

- Recovered clean worktree and completed B2 active plan.
- Read frozen B3 order, R28/R30/R04/R29/R31 inventory, history index/template and the nearest repository-boundary case.
- Created bounded B3a plan; no source or history edit yet.
- Extended `assertHistoryIndexAdmission` with Phase-scoped explicit-fragment resolution; removed the fixed retrospective summary/count regex and added harmful/harmless probes.
- Focused `node --test tests/repository-boundary.test.js`: 25 passed, 0 failed.
- Full Windows `npm test`: 205 total, 179 passed, 26 POSIX-only skipped, 0 failed. `node --check tests/repository-boundary.test.js` and `git diff --check`: pass. Windows skips are not Linux/Cloud evidence.
- Reviewed exact diff. No frozen history body, index, production, contract, Release or remote change.
- Final harmless probe now asserts its replacement actually changed the index. Repeated focused test: 25 passed. Repeated full Windows suite: 205 total, 179 passed, 26 POSIX-only skipped, 0 failed; `git diff --check` passes.
