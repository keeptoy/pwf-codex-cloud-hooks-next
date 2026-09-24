# Findings: Phase 5.2 newcomer handoff revision

## Entry

- Worktree clean after local commit `9f333ca`, which added a detailed retained assertion ledger to Phase 5.2.
- The preceding plan still says its commit was pending in its progress prose, but Git shows it was committed. This new task does not reopen that completed gate.
- User feedback: exact rule IDs and technical tables are not enough; a newcomer must understand actual changes, unchanged protections and the triggers for later review without relying on planning.

## Recovered authority and Phase 5.1 meaning

- Root documentation still places current programme in ROADMAP, owner map in README, architecture/implementation/operation in their own documents; Phase 5.2 must remain a historical execution record.
- Phase 5.1 explains the original problem in plain terms: the two governance test files mixed real safety/identity/link checks with sentence- and history-wording matches. Its labels describe how to treat *assertions*, not whether a document is good or bad. The method is owner-linked harmful-fail/harmless-pass, with B0–B4 as bounded gates.
- Phase 5.1 explicitly says B0–B4 were a conditional route, not their completion. Phase 5.2 should make the time transition obvious: decision then, local execution later. Original 59-group/17-DEFER counts belong to opening classification, not final converted totals.

## Newcomer-readability gap

- Current Phase 5.2 is fact-rich but starts with role/phase shorthand and then a B0–B4 implementation table; a newcomer does not first receive a direct answer to “what changed, what stayed, why, and what should I decide next?” The 17-row DEFER table is a useful lookup appendix but dominates the handoff narrative.
- A plain-language front section should say that the work mainly changed how **tests check documents**, not the runtime or Release rules; show a concrete old-versus-new example; distinguish completed local work, deliberately retained checks, and future decision triggers. Keep existing exact ID ledger below as traceability.
- History index/Guide require a capsule to stand alone after planning retirement while avoiding a copy of planning, test counts, SHA tables or current status. The new material should be a concise explanation of already evidenced results and a reading route, not a live task list.
- A read-only search guessed `docs/history/phase-history-template.md`, which does not exist. `rg --files` located the actual `docs/phase-history-template.md`; no file changed.

## Drafted revision

- Added an upfront newcomer handoff answering four questions: what changed, what remained, what deserves future re-review and what local completion does not mean. It names the two test modules and defines A/R IDs, KEEP/DEFER, owner and cold source.
- Rewrote the B0–B4 delivery table in plain Chinese while retaining exact technical boundaries: actual Wiki command block, Cloud bootstrap selection subset, document navigation, planning consent, history cold recovery, and current/cold identity separation.
- Replaced vague successor advice with event-triggered decision guidance. It routes current authority through README/active planning, keeps retained guards until owner-specific proof, distinguishes synthetic NONE from real transition and denies automatic planning cleanup or external acceptance.
- The detailed 17-ID DEFER and A20 ledger remains intact as a traceability appendix; no test, product, contract or programme change is intended.
- Diff review confirmed the new lead is short enough to scan before the ledger: a four-question outcome table, one concrete harmful/harmless example, a reading route/glossary, simpler B0–B4 descriptions and event-triggered successor guidance. Existing role, source snapshot and exact retained tables are unchanged.
- `git diff --check` passed. Focused architecture/repository governance tests passed 47/47, including Markdown link/anchor/history role checks. Full Windows `npm test`: 210 total, 184 pass, 26 POSIX/Linux-only skips, 0 fail. These are local results, not Linux/Cloud evidence.
