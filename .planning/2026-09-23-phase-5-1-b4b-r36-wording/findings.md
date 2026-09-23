# Findings: R36 wording boundaries

## Baseline

- Clean `0.5.0-dev` after B4/R36a commit `419b836`; R36a now parses published ledger membership and accepted acceptance route.
- R36 still contains whole-document bans for CHANGELOG exact hash/current-status terms, ROADMAP old migration headings, provenance role/current-status terms and architecture/design/AGENTS rollback/Latest terms. The first gate intentionally left these unchanged.

## Audit and bounded choice

- `tests/architecture-contracts.test.js` already has `assertDesignOwnerBoundaries`, including harmful/harmless probes for DESIGN's current role table, current rollback/Latest assertion and safe pointer prose. But that file also retains a separate broad `assert.doesNotMatch(design, /当前生产回滚|GitHub \`Latest\`|.../)`. Retiring DESIGN's duplicate R36 ban alone would not make equivalent prose pass the full suite; coordinated cross-file retirement is a separate gate.
- CHANGELOG and provenance are the only R36 owners with a broad `Next Step` substring ban. Their authority maps route current Next Step to active planning, but a harmless sentence explaining that route should not fail. A structural declaration is the harmful case: a Next Step heading, labeled bullet/line or table row that purports to own the action.
- This gate will replace only the two `Next Step` alternatives with a narrow active-instruction shape check and in-memory harmful/harmless probes. Exact hashes, lifecycle role terms, Latest, rollback, counts and ROADMAP bans remain untouched until their owners are mapped independently.

## B4b implementation

- `assertNoNextStepAuthority` rejects a CHANGELOG/provenance `Next Step` heading, a labeled instruction line or bullet, and a status-table row; an explanatory pointer sentence is allowed. The existing README/AGENTS owner routes still assign the real Next Step to active planning.
- Harmful in-memory heading, plain/bold-numbered instruction and table-row examples fail for each document; explanatory mention passes. All other R36 bans remain byte-for-byte unchanged.
- Focused repository-boundary suite passed 29/29; full Windows suite passed 183/209, with 26 POSIX-only skips and zero failures. `node --check` and `git diff --check` passed. Windows skips are not Linux/Cloud evidence.
