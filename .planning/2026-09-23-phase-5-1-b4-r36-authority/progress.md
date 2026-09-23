# Progress: R36 authority relations

## 2026-09-23

- Announced and read planning-with-files skill; session catch-up returned no unsynced report.
- Confirmed clean worktree and completed B3g plan. Read frozen B4/R36 inventory and current R36 test seam.
- Opened this bounded B4 plan. No test or authority document change yet.
- Read ROADMAP role table, provenance published ledger, CHANGELOG heading layout, current v0.4.4 acceptance and publication-oracle parser. Identified a safe first relational subset: unique published-role rows, candidate absence confined to ledger, and accepted acceptance path/anchor/title-version relation. Broad word bans remain outside this subset.
- Implemented `assertCurrentPublicationRoutes` and R36 harmful/harmless probes; removed whole-provenance version scans and exact accepted-title wording. `node --check`, `git diff --check` and focused repository-boundary suite (29/29) passed.
- Full Windows `npm test`: 209 total, 183 passed, 26 POSIX-only skipped, 0 failed. Reviewed test diff: only R36's published-ledger/accepted-acceptance relation changed; broad bans, publication marker and independent publication oracle are unchanged.
- Final `node --check`, `git diff --check` and new planning whitespace scan passed. The tracked diff consists only of the active-plan pointer and R36 test seam; planning files are the sole new files. Ready for one scoped local commit.
