# Findings: Phase 5.1 B1c DESIGN ownership boundaries

## Starting evidence

- Clean branch `0.5.0-dev` after B1b local commit `6101d01be7ecf72c82f31349d104b7815dd1bc48`; no pre-existing user changes.
- Frozen Phase 5.1 B1 assigns A14/A16 to replaceable DESIGN prose/style checks. A13 keeps implementation paths/anchors, A15 keeps exact test-module reverse-index set and uniqueness. They are adjacent but are not replacement targets.
- A14 currently bans `ADAPTER_DEADLINE_SECONDS`, selected numeric strings, “当前生产回滚” and `GitHub Latest` anywhere in DESIGN. A16 requires the exact nearby `test title ... assertion` phrase and bans numeric test-result prose throughout §6.1. These checks can reject a harmless pointer or equivalent explanation while still missing structurally misplaced authority.
- DESIGN §1 has a question→owner table for ARCHITECTURE, README, Wiki, CHANGELOG, ROADMAP, Product overview and provenance; §2–5 describe implementation modules and dependencies; §6.1 is a reverse test-module index. The real authority for architecture rationale is ARCHITECTURE, current programme/rollback is ROADMAP, machine numbers are source/contracts, and test results are runner/acceptance.

## Open checks

- Identify a narrow section/table shape that fails on an incorrect §1 owner destination or a new competing rationale/current-state section, without rejecting mention-only cross-references.
- Preserve useful §6.1 metadata shape while allowing its explanatory sentence to be rephrased; a test-result count in a row may need a targeted table-cell guard.

## Bounded implementation route

- DESIGN §1's question-to-owner rows can prove architecture rationale → ARCHITECTURE, current programme/rollback → ROADMAP and version delta → CHANGELOG by actual Markdown link target; a safe link elsewhere cannot satisfy a wrong row.
- Outside §1, a new competing architecture/current-state heading or current-role table is a structurally second authority; simple cross-reference prose mentioning those topics is not. Machine-like numeric assignments are a narrow signal of copied contract/runtime constants; unstructured explanations still need maintainer review.
- A15 already proves the exact test-module set and one link per module. A16 can instead verify that each §6.1 module row keeps its four nonempty role columns and does not embed a runner result count. The optional closing explanation remains human-editable.

## Proven scope

- In-memory negatives reject a wrong ARCHITECTURE or ROADMAP target in DESIGN §1 even with a reassuring link elsewhere, a new current-rollback heading, a current-train status row, a copied runtime numeric assignment, a runner result embedded in a test-module row, and a missing role column.
- A safe cross-reference that mentions `GitHub Latest` and the runtime constant name without assigning values passes. Rephrasing the §6.1 closing explanation passes. These checks guard document roles and parseable shape, not every possible natural-language second authority; ambiguous prose still needs maintainer review.
- Diff review found a gap in heading/table-only checks: a bare sentence asserting the current rollback role or an output budget could still become a second authority. Added narrow predicate-plus-value checks for those claims, while a pointer to ROADMAP/source still passes. This is a bounded static guard, not a general Chinese-semantic classifier.
