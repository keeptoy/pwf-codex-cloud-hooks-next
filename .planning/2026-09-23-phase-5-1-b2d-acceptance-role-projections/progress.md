# Progress: R17 acceptance role projections

## 2026-09-23

- Recovered clean repository and active planning after R13.
- Read R17 inventory, acceptance role-window index, Cloud template responsibilities/Round routing/evidence-writeback, and mixed repository-boundary assertion block.
- Created this bounded B2d plan; no source or template edit yet.
- First focused test failed in the new acceptance-index helper: the accepted/current assertion assumed `可以/可` appears before `current`, but the actual owner prose says `可以继续作为current副本`. This is a test pattern defect, not a document defect; adjust the section-scoped relationship pattern and rerun.
- Second focused attempt reached the Cloud template route check: the canonical Operator Guide link is in the template introduction, while responsibility section correctly refers back to “上述结构模板”. The helper incorrectly demanded a duplicate link inside the table section; check the document-level route alongside the scoped role table instead.
- Replaced the scoped acceptance-index, Cloud owner/Round and guide/writeback wording checks with two owner-specific helpers. Added seven harmful and multi-document harmless in-memory probes; duplicate owner-table rows are rejected.
- Focused `node --test tests/repository-boundary.test.js`: 25 passed, 0 failed.
- Full Windows `npm test`: 205 total, 179 passed, 26 POSIX-only skipped, 0 failed. `node --check tests/repository-boundary.test.js` and `git diff --check`: pass. Windows skips are not Linux/Cloud evidence.
- Reviewed exact test diff. No acceptance index, template, production, contract, Release or remote change.
- Final parser review rejected unrecognized/duplicate responsibility rows as well as missing ones. Repeated focused test: 25 passed. Repeated full Windows suite: 205 total, 179 passed, 26 POSIX-only skipped, 0 failed; syntax and `git diff --check` pass.
