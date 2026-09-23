# Progress: B4j CHANGELOG migration route

## 2026-09-24

- Read planning-with-files and resumed repository authority/read order; confirmed B4i commit and clean worktree.
- Mapped the remaining R36 assertion to CHANGELOG's v0.3.0 migration claim and provenance's stable migration evidence anchor.
- Identified one wording lock plus three sensitive families to keep/audit separately.
- Added wrong-anchor and equivalent-label probes; the latter failed under the old exact-label regex (expected red).
- Replaced that regex with a first-bullet route guard and added a misplaced-link negative. Focused R36 case passed 1/1.
- Full Windows regression passed 183/209 (26 POSIX-only skips, 0 failures); syntax and whitespace checks passed. Scoped diff reviewed before local commit.
