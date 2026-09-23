# Findings: B4i macro-doc status terms

## Entry baseline

- B4h `e0ebba1` is committed and the worktree was clean at entry. Its Next Step allows mapping another R36 ban with separate owner/failure evidence.
- README's document map assigns current programme, Release and rollback state to ROADMAP; ARCHITECTURE owns system design reasoning and AGENTS owns agent process/safety boundaries.

## Pending decision

Resolved: R36 bans `当前生产回滚|当前回退层级|GitHub \`Latest\`|production rollback` anywhere in both ARCHITECTURE and AGENTS. Neither document currently uses the exact terms. README and ROADMAP give current programme/rollback/Latest authority to ROADMAP, while ARCHITECTURE explains architecture and AGENTS supplies agent safety rules. No other test guards these terms in those two files; `tests/architecture-contracts.test.js` already applies a structural current-role guard to DESIGN and accepts ROADMAP owner-pointer prose. The same owner distinction is appropriate here: reject a heading, status row or direct current-role claim, but permit explanation that routes to ROADMAP.

## B4i probe evidence

- The original whole-document helper failed a harmless dual-language ROADMAP owner-pointer sentence in ARCHITECTURE (focused suite 28/29), proving the false positive.
- The narrow guard rejects status headings, rows and direct concrete declarations while accepting explanation and exact ROADMAP pointer values. It rejects pointer laundering with an appended version or forged `ROADMAP-forged` token. After aligning expected diagnostics, focused suite passed 29/29 for both ARCHITECTURE and AGENTS.
- A direct declaration can wrap after `:` or `is`; the helper now checks the following line only for such assignment starts. Both wrapped harmful claims fail, while a wrapped `see ROADMAP` pointer passes. Focused suite remains 29/29.
- Diff review found another legitimate pointer form: a Markdown link to ROADMAP's explicit Latest anchor. The guard now accepts bare or exact local ROADMAP pointers, but rejects a `ROADMAP` label aimed at DESIGN; focused suite still passes 29/29. Actual tracked links remain validated by the independent local-link test.
- Final full Windows regression passed 183/209 with 26 POSIX-only skips and zero failures. Syntax and `git diff --check` passed. Exact diff review found only the shared ARCHITECTURE/AGENTS status guard/probes and scoped planning; no macro document or Release input changed.
