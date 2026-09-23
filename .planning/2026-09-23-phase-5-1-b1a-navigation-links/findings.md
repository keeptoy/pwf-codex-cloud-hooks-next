# Findings: Phase 5.1 B1a navigation and handoff links

## Starting evidence

- Exact baseline is local B0 commit `256b90ab868a671f0efdcde46304045cfbc2919a`; the `0.5.0-dev` worktree was clean before switching scope.
- Frozen Phase 5.1 decision assigns A02 and A03 to B1's navigation/authority lane. A01 link containment/existence, A04 handoff style and A05 Release exclusion are adjacent but not this gate's replacement targets.
- README is the human question-to-authority map; ROADMAP owns current Product Phase route; MAINTAINER_HANDOFF is the triage entry. The test should verify these actual routes, not the wording of explanation paragraphs.

## Open checks

- A02 is the final `counts` comparison in the first `tests/architecture-contracts.test.js` case. A01 already validates all linked Markdown paths and explicit fragments. ROADMAP §4 has the active-train pointer to Phase 5 and inherited accepted-baseline pointer to Phase 4; §5's two actual Phase rows point to those same overviews. The hard-coded two-link/count array freezes that temporary number rather than the §4→§5 role relation.
- A03 is the `for (const target ...) assert.match(handoff, new RegExp(target...))` block in the second test. It accepts a target string anywhere in the file, even plain prose or a decoy, and treats a directory/path mention as a navigation link. A04's headings, signal words, code-fence and version/command bans begin after that block; A05 is the artifact exclusion at the end. They can remain untouched.
- Handoff §1's numbered steps carry README map, active planning, DESIGN/ARCHITECTURE and Wiki local-development routes. Handoff §2's triage table carries the version/Release cluster, docs evidence directory and environment profile. The README map identifies the corresponding owner documents; link labels and surrounding Chinese explanation may vary.

## Candidate bounded checks

- A02: derive Phase overview target identities from actual §4 links and §5 route rows; each active pointer must have a matching row with the same Phase number/target. Any duplicated overview link must be precisely this one-per-section relationship. Do not hard-code two phases or counts.
- A03: parse Markdown links in the relevant handoff sections, require each safety-relevant step/triage cluster to use the correct target path/anchor, and prove the target belongs to the README owner map where applicable. Do not attempt to infer natural-language row meaning from a Chinese sentence; residual explanation remains human-reviewed.

## Decision and residual boundary

- A02 now derives the currently declared Product Phase from the structured ROADMAP train row, checks §4's matching overview pointer against §5's numbered Phase row, and permits a repeated overview only once in each of those two roles. The existing A01 path/explicit-anchor verifier remains intact; duplicate authority links outside this ROADMAP relationship remain rejected.
- A03 now checks actual Markdown link targets by handoff role: introduction → README owner map; numbered quickstart steps → active plan, Wiki local development, and paired DESIGN/ARCHITECTURE; triage rows → README, ROADMAP/CHANGELOG/provenance together, `docs/`, and environment profile. Linked owner documents are checked against README's map rather than copied into a second complete JS map. A04/A05 checks remain unchanged.
- In-memory negatives cover wrong current pointer, mismatched Phase route, stray extra duplicate, duplicate authority link outside ROADMAP, misplaced handoff intro/step/triage links with harmless decoys elsewhere. Equivalent Chinese explanation and link-label wording passes. These are role checks, not a machine attempt to grade the handoff's explanatory quality.
- No production or Markdown owner link required repair. B1a is local-test governance only; other B1 groups and Cloud/Linux evidence are not implied.
