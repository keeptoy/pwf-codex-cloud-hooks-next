# Findings: B4l provenance role neutrality

## Entry baseline

- B4k `7bc68a2` committed; worktree clean at entry.
- README maps current programme roles to ROADMAP and immutable published identity to BASELINE_PROVENANCE.
- R36 rejects `candidate`, `accepted`, and `immediate fallback` anywhere before the migration section. That catches moving-role labels but also rejects a harmless negative explanation.
- `assertCurrentPublicationRoutes` already requires unique accepted/fallback rows and candidate publication membership, with exact acceptance routing; the independent published-release oracle validates current published asset identities.

## Working distinction

- Harmful: a ledger heading, row, column or direct declaration that assigns a moving role to a published identity.
- Harmless: prose explaining that candidates are not published identities or that current roles are determined by ROADMAP.

## Owner and guard map

- ROADMAP section 2 owns current development/accepted/fallback roles. The provenance ledger intro explicitly says the same immutable identity structure applies without current/history distinctions and delegates continuing roles to ROADMAP.
- `assertCurrentPublicationRoutes` verifies actual rows/membership and exact accepted acceptance target. `assertNoProvenanceCurrentRoleAuthority` already rejects explicit current lifecycle/source claims but does not cover a row annotation such as `accepted` or a direct `v0.4.4 is accepted` sentence.
- Narrow guard should reject role-bearing headings, table headers/rows and direct role/version assignments inside the published ledger, while permitting negative/explanatory prose. It is not a general English/Chinese semantic classifier; other novel claims still require owner review.

## Probe evidence

- The original whole-ledger word ban failed the harmless “A draft candidate is not a published identity” positive, as expected (focused red).
- The replacement rejects role-bearing headings/table rows, an annotated existing accepted row, version-first or role-first declarations, wrapped declarations, concrete claims appended to a ROADMAP pointer, and forged ROADMAP tokens. Explanatory prose and an exact ROADMAP pointer pass (focused green).
- This helper only classifies common structural and direct-declaration forms. Exact published rows, candidate membership and acceptance routes remain separate checks.
- Further probes reject `accepted` release/version assignments, a version remaining accepted, Chinese/current assignment forms, wrapped values, forged ROADMAP tokens and a Markdown link to DESIGN masquerading as ROADMAP. Plain, wrapped and exact Markdown ROADMAP owner pointers pass. Focused R36 remains green.
- Full Windows suite passed 183/209 with 26 POSIX-only skips and zero failures. JavaScript syntax and whitespace checks passed. The tracked diff is limited to R36's role-neutrality helper/probes and the active planning pointer; SHA/count/heading guards and publication oracles are unchanged.
