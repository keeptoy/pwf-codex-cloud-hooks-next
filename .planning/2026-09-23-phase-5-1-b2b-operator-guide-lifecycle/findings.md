# Findings: A07 Operator Guide lifecycle

## Baseline

- Clean branch `0.5.0-dev` after A04 local commit `35d579a`; previous B2a plan is complete.
- Inventory labels A07 `REPLACE`: fixed chapter names, guide-count prose and freeze wording should become named-section and lifecycle-relation checks. A06 remains `KEEP`; A08 remains `DEFER`.
- The template has explicit anchors for lifecycle, positioning, inputs, tutorial, evidence/stops, Pre-run, channel checkpoints and Final Post-run. Its section headings are human labels, not the persistent role identities.
- The current architecture test asserts seven exact headings and several whole-file prose regexes. Its later assertions also cover A06 and A08; those are outside this gate.

## Design questions

- The stable anchors mark eight writing roles. The test now requires each anchor once, in role order, directly introducing a section; headings may be reworded without losing the role.
- Count rules are checked inside the lifecycle numbered rules: a Product count clause ties Discovery Round to the count unit, gates are not separate rounds, one guide may cover multiple gates, and aggregate-only closeout creates no guide. Filename patterns remain scoped to the positioning role.
- The lifecycle sequence must place Pre-run before a stopped channel checkpoint, Final Post-run on the same guide, and freeze after Final. Scoped channel/Final sections also retain the open-versus-frozen and ordinary-waiting semantics.
- A06's exact status tokens/anchors and A08's Release two-channel, C0/C1/C2 and ROADMAP checks remain untouched. Human review remains necessary for nuanced explanatory language and contradictions outside the checked lifecycle roles.
- `tests/repository-boundary.test.js` still contains R17's exact Operator Guide phrases, including checkpoint/final/waiting wording. This gate does not claim a real template paraphrase passes the entire suite; the A07 in-memory helper accepts it, while R17 needs separate ownership review. R13 is a separate planning-deletion rule.
- Initial harmful-count probe exposed a false positive: a whole numbered rule could mention `Discovery Round` in another clause while assigning the count to Gate. Restricting the positive count claim to one sentence-level clause caught the wrong owner. Initial checkpoint probe likewise exposed a second open-guide phrase in the channel section; explicit positive-freeze contradiction detection now catches it.
