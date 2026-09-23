# Findings: B4f ROADMAP migration history boundary

## Entry baseline

- B4e `60162e3` is committed and the worktree was clean at entry.
- README's document map gives ROADMAP current programme and provenance immutable migration refs. The Phase 5.1 Discovery B4 route requires alignment of CHANGELOG, ROADMAP, provenance, acceptance and publication before narrowing phrase bans.
- R36 currently rejects `## 3. 已完成的仓库迁移`, `M1 exact mirror`, and `M2 slim transformation` anywhere in ROADMAP. No other test uses those exact ROADMAP alternatives.
- Historical ROADMAP before `b59c1b3` contained the retired section plus a `Gate | 冻结结果 | 状态` table with M1/M2 result rows. Current provenance section 2 owns the immutable M1/M2 evidence; current CHANGELOG may describe the historical delta.

## Decision

The failure consequence is a second historical migration ledger in the programme authority, not an incidental mention of an evidence label. Guard the retired migration section heading and migration result rows; let ordinary prose route readers to provenance. Keep the accepted-baseline and publication/acceptance checks unchanged.

## B4f probe evidence

- The old broad guard failed the harmless in-memory ROADMAP sentence pointing both M1/M2 labels to provenance (focused suite 28/29), proving the false positive.
- The narrowed guard rejects the original `## 3` retired heading, a renumbered `## 7` heading, an M1 evidence heading and M1/M2 result rows. The ordinary owner-pointer sentence passes.
- Focused repository-boundary suite passes 29/29 after the replacement. This is a targeted syntax guard for the historically observed ledger shape, not a general semantic classifier; acceptance/publication identity and current-role checks remain independent.
- Final full Windows regression passed 183/209 with 26 POSIX-only skips and zero failures after the symmetric M2-heading negative probe; focused suite also passed 29/29. Windows skips remain neither Linux nor Cloud evidence.
