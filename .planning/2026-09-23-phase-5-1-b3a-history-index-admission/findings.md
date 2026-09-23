# Findings: R28 history index admission

## Baseline

- Clean branch `0.5.0-dev` after B2 local commit `d32f9d9`; B3 order in frozen Discovery is R28 remainder and R30 structure first, then conditional R04/R29/R31 prose retirement.
- Existing `assertHistoryIndexAdmission` parses two legal roles, indexed file membership, no duplicate/missing/orphan files and the sum of role totals. It does not yet verify each index fragment against its record.
- A separate broad assertion still pins retrospective summary wording through `Phase 5.0` and literal `18`, despite the dynamic role-total/membership check.
- Most older history records lack explicit `> Record role`; only recent records declare it. Inferring all 30 per-record roles from source text would be a new classifier or require rewriting frozen records, so this gate does neither.
- The generic tracked-link test also validates Markdown fragments, but R28's index admission should reject wrong target fragments in its nearest relationship check and in-memory probes.

## Decision and residual

- Index rows now parse optional explicit fragments. When present, a fragment must be Phase-scoped to its file name and actually exist as an explicit anchor in the record. Existing membership, duplicate, missing, draft and role-total checks remain.
- Harmful in-memory probes for a missing fragment and another Phase's fragment fail. Rewriting the retrospective role summary explanation passes; the whole-file regex pinning specific Phase ranges and literal `18` has been retired. The dynamic role totals still must sum to indexed membership.
- Per-record legal role inference remains incomplete for legacy files that do not declare `Record role`. This gate does not invent a classifier or rewrite them. R28's other prose/owner checks and R30 structure remain before R04/R29/R31 conditional retirement.

## Diagnostic note

- Initial `rg` with a Windows shell wildcard path failed with OS error 123; reran using `rg -g 'phase-*.md'`, which showed only five explicit `Record role` declarations. No file change or data loss.
