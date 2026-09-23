# Findings: R29 reindex status

## Baseline

- Clean `0.5.0-dev` after B3d commit `c2434f2`.
- Frozen Discovery places R29 narrative retirement after R28/R30 structural checks. Rule inventory says seven older records repeat exact old/new Phase prose; preserve status anchors, current ROADMAP links and immutable evidence.
- The seven records are Phase 3.9.3, 4.1, 4.2, 4.4, 4.5, 4.6 and 4.8. Existing test checks their anchors, two long mapping/authorization regexes and the ROADMAP route.
- Some records have a dedicated `Cold evidence` source snapshot; Phase 4.5 and 4.8 need closer inspection before imposing one uniform evidence requirement.

## Scope decision

- Phase 3.9.3, 4.1, 4.2, 4.4 and 4.6 have explicit `Cold evidence (not current authority)` commit URLs before the reindex status. Phase 4.4 uses short hex `4a24b66`, which resolves locally to `4a24b661167f472fdb595111f94d10c7af5337d9`; preserve the existing URL without lengthening frozen prose.
- Phase 4.5 has no Cold evidence section but links exact immutable v0.4.0 F2B acceptance (`6b3885…#v0-4-0-dev-f2b-source-candidate-evidence`) immediately before its reindex status. `git show` confirms that anchor exists.
- Phase 4.8 twice claims a missing tail Cold evidence and has no immutable source URL in the file. The maintainer explicitly authorized leaving it unchanged and handling the other six. No history-body repair or R29 retirement for Phase 4.8 in this gate.
- Phase 4.6 has a valid Cold evidence commit URL but no explicit anchor for that section; preserve the URL and do not invent an anchor solely for the new test. Four other snapshot-backed records have the section anchor.

## Outcome and residual

- `assertReindexStatusRoutes` checks the six eligible index rows, unique Phase-scoped post-programme status anchors, current ROADMAP route/target, and existing evidence shape. Five records retain commit links; Phase 4.5 retains the exact immutable F2B acceptance link, whose fragment resolves in Git.
- Harmful in-memory index, ROADMAP, status-anchor, source-link and acceptance-link changes fail; equivalent Phase mapping prose passes. Phase 4.8's original four assertions remain unchanged, as do its historical bytes.
- The index's own broad reindex-summary prose assertion remains outside this six-record retirement. R31/R38 were not modified.
