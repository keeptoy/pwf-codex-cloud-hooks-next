# Findings: Phase 5.1 B1b README document map

## Starting evidence

- Clean `0.5.0-dev` baseline after local B1a commit `39483891d058450174455564122bedc81800952c`; no user worktree edits.
- Frozen Phase 5.1 route assigns A12 to B1 and proposes parsed map entries plus section-boundary checks. A12's owner is README's question-to-unique-authority map. Adjacent A13 implementation-path, A15 reverse-index, and A17/Release guards stay outside this scope.
- Existing A12 test in `tests/architecture-contracts.test.js` checks the map heading and seven filenames anywhere in README, then bans a few moving-role phrases anywhere. A filename in unrelated prose can satisfy it while a wrong map link remains hidden; equivalent wording can trigger the prose bans.

## Open checks

- Read the exact README map rows and determine which owner distinctions are safety-relevant, including current programme, delta, immutable identity, implementation layout, governance and handoff.
- Distinguish parsed table destinations from non-link text; require the `README.md#documentation-map` entry route used by macro consumers to remain valid through existing A01/A03 checks.

## Bounded design

- Parse only the README document-map table between its explicit `documentation-map` anchor and `## 许可证`. Inspect Markdown links in each row, not filename strings anywhere in the file. Verify safety-relevant question roles as compact cues (architecture, implementation, delta, current programme, immutable identity, governance, handoff), with each role's actual owner link. This necessarily leaves nuanced Chinese paraphrases to human review; avoid freezing entire sentences or row order.
- Preserve A01/A03 checks for explicit anchor and handoff's owner-map navigation. The new A12 guard should reject a wrong table target even if a safe target appears elsewhere in README.
- Scope the old moving-role bans to actual README role-table rows and the development/Release delegation section. A cautionary mention in ordinary prose is not a second current-state authority; a new role table or embedded build runbook is.

## Implemented boundary

- The A12 guard parses the map's Markdown table rows, requires each data row to retain a navigable destination (or explicit README/self or active-planning pointer), and checks the high-risk owner distinctions by question-role cue plus exact linked target. It does not pin the prose of full questions or link labels.
- The old whole-file moving-role prose bans became a narrow prohibition on a second current-role table, a second repository-map heading, and a fenced build runbook inside README's development/Release delegation section. Equivalent ordinary cautionary prose is allowed.
- The adjacent A01/A03 link anchors, A13 implementation map, A15 reverse test index, and Release/trust checks remain independent. Product overview, environment-profile and history routes retain their separate A20/R11/history gates; this A12 test is not a complete natural-language map evaluator.
- The active-planning row additionally rejects any competing Markdown owner. Only the README map question-to-owner table is machine-checked here; prose nuance and future reworded role cues still require maintainer review.
