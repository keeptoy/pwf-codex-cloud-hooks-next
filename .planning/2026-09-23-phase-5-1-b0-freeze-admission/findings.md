# Findings: Phase 5.1 B0 frozen Discovery admission

## Starting evidence

- Exact decision-source commit: `f7ebbf9dab6984697cfea5c1050daafe336737c3`; it records the proposed 59-group disposition, B0–B4 lanes, 17 DEFER triggers and open draft before freeze.
- The prior active planning scope explicitly requested this atomic B0 transaction; the maintainer authorized it. The worktree was clean on `0.5.0-dev` before activation.
- README routes history through its one index; ROADMAP is the only other macro history entrance. The Guide and `docs/phase-history-template.md` require a frozen record to be self-contained, indexed with a role, and backed by exact source evidence, without turning the record into current authority.
- The old `tests/repository-boundary.test.js` history case uses `/FROZEN_DISCOVERY_RECORD[\s\S]*Phase 4\.1～4\.11[\s\S]*11/`; this can accept a stale count through unrelated prose and needs a scoped replacement.

## Open checks

- The history index has a two-row role summary and one table of linked history files. Earlier records mostly lack per-file `Record role` metadata; only recent retrospective capsules and the Phase 5.1 draft have role/status markers. B0 must not invent a complete per-file role ledger in JavaScript. A full per-row role schema belongs to R28's later B3 work, not this admission fix.
- The B0 guard can check the two allowed role-summary rows, their aggregate count against the exact set of indexed files, duplicate/missing/unindexed admission, and Phase 5.1's explicit frozen role/status. It cannot prove every legacy row's role individually without a wider index migration; that limitation must remain explicit.
- Freeze text must retain the decision-time status and distinguish completed R24/R23a sample evidence from B1–B4 future implementation. The decision-source commit carries the full planning packet before freeze.

## B0 result and residual

- The record now declares `FROZEN_DISCOVERY_RECORD` and is self-contained about the problem, authority route, alternative tradeoffs, 59-group disposition, two bounded samples, conditional B0–B4 route, DEFER triggers, verification/rollback and non-goals. Its one cold source link points to `f7ebbf9dab6984697cfea5c1050daafe336737c3`, which contains the complete decision package before admission; this is historical evidence, not current authority.
- The history index now has one Phase 5.1 row and its role summary aggregate reflects membership. The two old fixed-11 prose regexes were replaced with a guard that checks allowed role rows, aggregate membership, unique local file targets, absence of unindexed frozen files, allowance for explicitly marked open drafts, and the new record's exact frozen role.
- In-memory negatives cover wrong total, missing or duplicate row, missing target file, wrong Phase 5.1 role and unindexed frozen file. Positives cover an unrelated open draft and equivalent rewording of explanatory and row-summary prose.
- Earlier history records lack per-file role metadata. B0 does **not** infer their individual roles or detect a complementary swap between the two summary counts. A complete per-record role schema remains R28/B3, with separate authorization; B0 only closes the old fixed-total admission gap.
