# Findings: Remove prose-only Phase overview tests

## Initial distinction

- `docs/product-phase-overview-template.md` is the appropriate human-facing authority for what an overview may contain and who decides history promotion.
- Exact Phase 5 headings, sentence order, banned legacy phrases, and the current absence of `phase-5.x` are not durable executable contracts.
- Existing generic anchor/link and planning lifecycle checks are outside this correction unless direct inspection shows they depend on the same prose-only model.

## Assertion classification

Remove as prose/temporal policy duplication:

- Product Phase index regex requiring `overview → 摘要提纲 → planning → 维护者 → history` wording.
- Template regex requiring `outline → planning → 维护者 → history` wording.
- Phase 5 `Phase outline` and `Planning and history lifecycle` heading assertions.
- Phase 5 milestone table ordering and autonomous prose assertions.
- Negative checks for the retired working-ledger vocabulary.
- The assertion that no `docs/history/phase-5.x-*` file exists; a future maintainer-approved history record would make that legitimate state fail.

Retain as machine-verifiable structure/current identity:

- Stable explicit anchors for the Product Phase index, template, and instantiated overviews.
- Phase 5 `PRODUCT_PHASE_OVERVIEW` role and `0.5.0-*` series metadata.
- Generic link resolution and active planning-pointer validation.
- Existing Release, runtime, trust, history-role, and programme identity assertions unrelated to this prose policy.

## Template authority

- The current template already places detailed process in planning and makes history promotion maintainer-owned.
- It should be made fully explicit that planning retention/deletion is maintainer-owned and that the maintainer creates and maintains any resulting `phase-N.x` history record.
