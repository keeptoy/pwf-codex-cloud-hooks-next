# Findings: B4e provenance current-role language

## Entry baseline

- B4d `13f7411` is committed; the worktree was clean at B4e entry. R36 now checks `GitHub \`Latest\`` as a status declaration rather than a whole-document term in CHANGELOG/provenance.
- README's document map routes current programme, candidate, Release and rollback status to ROADMAP, and immutable published identity to provenance. ROADMAP section 2 explicitly owns the current source authority. The governance guide makes the same hot/cold distinction.
- R36 still bans `当前源码权威|current lifecycle role` anywhere in provenance. A sentence referring readers to ROADMAP would fail even though it does not claim a second role. The exact terms are absent from current provenance content.
- R36 separately checks a single role-neutral published ledger, current accepted acceptance route, immutable identities, `GitHub \`Latest\`` moving-status declarations and registered-count text. This gate will not alter those checks.

## Decision pending

Resolved: the two remaining terms are labels for moving source/lifecycle roles, not immutable identity. Use a provenance-specific shape guard; do not refactor the immutable ledger or broaden this gate to ROADMAP/CHANGELOG.

## Cross-check

- A search across test modules found only R36's broad provenance regex for these exact two terms. ROADMAP section 2 is the current role owner, including the source maintenance authority, while provenance's intro already points programme/lifecycle roles to ROADMAP without naming their current values.
- Harmful shapes are a role heading, a status-table row or a direct declaration naming successor `main`/accepted. Harmless shapes are prose directing readers to ROADMAP for the current role. The publication ledger row structure and accepted acceptance route remain separately checked.

## B4e evidence

- The provenance-only guard rejects role-labeled headings and rows, and direct assertions of source/lifecycle role. A direct assertion can pass only when its asserted value starts as a ROADMAP pointer; appending ROADMAP after `successor main` or arbitrary `feature/foo` does not launder the identity. A forged `ROADMAP-forged` target is rejected.
- Prose such as “关于当前源码权威，请见 ROADMAP” and “The current lifecycle role is described in ROADMAP” passes. This is a bounded syntactic guard, not a general natural-language classifier; immutable identity and owner-link checks remain independent.
- Focused repository-boundary suite passed 29/29 and full Windows suite passed 183/209 with 26 POSIX-only skips and zero failures after the final boundary adjustment. Syntax and `git diff --check` passed. Windows skips are not Linux/Cloud evidence.
