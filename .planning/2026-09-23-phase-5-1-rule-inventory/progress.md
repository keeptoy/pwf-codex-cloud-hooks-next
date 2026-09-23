# Progress: Phase 5.1 document-test rule inventory

## 2026-09-23

- Recovered the completed method probe, open Phase 5.1 draft, repository authority route, and current `0.5.0-dev` baseline; worktree was clean before changing the active planning pointer.
- Activated this separate planning scope for the maintainer-requested formal rule-group inventory. No test, production, Cloud, or Release file has been changed.
- Enumerated all 27 top-level cases and the 571 regex assertion call sites, then began source-order review of the architecture test. These are coverage controls only; classification will be by rule and owner.
- Completed source-order review of both target test files. Identified mixed rule families across current programme/Release, Cloud operator safety, exact machine boundaries, planning/history lifecycle, and historical narration; next step is authority/cross-test corroboration and the traceable group table.
- Wrote the 59-group rule/owner/failure/disposition table and a case-to-group coverage ledger into `findings.md`. The table includes an explicit 17-item `DEFER` set and stable owner-entry links; no tests, production source, or authority document changed.
- First focused test attempt inside the sandbox stopped at Node runner `spawn EPERM`. The escalated run then found that an extra `rule-inventory.md` file violated the active planning-scope filename contract. Moved its content into the allowed `findings.md` rather than weakening the lifecycle test.
- Re-ran `node --test tests/architecture-contracts.test.js tests/repository-boundary.test.js` with the Windows sandbox's required process-spawn allowance: **27/27 PASS**. This is a local governance check, not a Cloud or Discovery PASS.
