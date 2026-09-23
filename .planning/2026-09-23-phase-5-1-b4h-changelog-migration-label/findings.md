# Findings: B4h CHANGELOG migration label

## Entry baseline

- B4g `47afeac` is committed and the worktree was clean at entry. Its Next Step is to map one remaining R36 ban before another bounded change.
- README's document map assigns version deltas to CHANGELOG and immutable migration refs to provenance. This audit will distinguish a retired source label from ordinary historical terminology.

## Pending decision

Current CHANGELOG's v0.3.0 delta links to `BASELINE_PROVENANCE.md#successor-migration-evidence` with the new “不可变证据” label. R36 separately requires that exact link and bans the old “来源链” phrase everywhere. Current provenance section 2 owns M1–M4 immutable refs; its old-heading ban is separate. The phrase occurs in only this R36 CHANGELOG check among current tests. The first attempted parent-tree lookup failed because `CHANGELOG.md` did not exist at that parent; inspect commit contents instead.

## Decision

- `81d2789` introduced the historical CHANGELOG construction `由 [provenance] 的 **Successor 迁移来源链**从...`; `9fd9bb5` later briefly redirected to a Phase-history capsule, while the current document instead requires the precise provenance immutable-evidence anchor. The old phrase is therefore a retired source label, not a fact that must be unmentionable forever.
- Guard old-label headings, table keys, link labels, emphasized source labels and direct source-attribution phrases. Preserve the separate exact current provenance link requirement. Permit a plain sentence that calls the phrase an old name and routes readers to current evidence.
- This is a bounded syntactic distinction, not a general Chinese semantic classifier. If probes show old authority can slip through or harmless historical explanation fails, keep the original ban.

## B4h probe evidence

- The original broad helper failed an explicit historical “旧称” sentence (focused suite 28/29), proving the false positive.
- The narrow helper rejects the historical emphasized attribution, an unformatted “由 provenance 的” attribution, a direct current-source claim, old-label heading/table/bullet keys, and a linked old-label source. Two ordinary historical explanations pass. The separate exact current provenance link assertion is unchanged.
- Focused repository-boundary suite passed 29/29 after the first narrow guard. Final probes and complete regression remain.
- Diff review revealed that Markdown can wrap the old source attribution across lines. The guard now joins only each paragraph for the source-attribution predicate, while heading/table/link/label checks stay line-based; a wrapped harmful mutation fails and focused suite still passes 29/29.
- Final Windows regression passed 183/209 with 26 POSIX-only skips and zero failures after the wrapped mutation. Syntax and `git diff --check` passed. Exact diff review found only the CHANGELOG-specific R36 guard/probes and scoped planning; current provenance link, published identities and all other R36 bans remain unchanged.
