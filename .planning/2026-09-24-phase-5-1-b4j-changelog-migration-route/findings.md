# Findings: B4j CHANGELOG migration route

## Entry baseline

- B4i `c8ec42f` committed; worktree clean at entry.
- README assigns version deltas to CHANGELOG and immutable identity/migration evidence to BASELINE_PROVENANCE.
- R36 still pins the entire Markdown link label in the v0.3.0 migration bullet, even though the failure consequence is a wrong/missing provenance target.
- The independent local-link test validates that referenced anchors exist, but not that this migration claim routes to its owner.
- Sensitive SHA/count, role-neutrality and exact publication/section checks remain outside this gate.

## B4 remainder inventory

- One clear wording lock remains in scope: the v0.3.0 migration evidence link's display label.
- Three sensitive families are retained pending separate evidence: SHA/quantity bans, published-ledger role neutrality, and exact section/publication structure.
- B4 progress is assessed by owner/failure coverage, not by number of removed regexes.

## Probe evidence

- Under the original exact-label assertion, changing only the link display text failed the focused test as expected.
- The replacement checks the first v0.3.0 migration bullet's parsed Markdown link target. A wrong anchor and a correct link moved into another bullet fail; an equivalent link label passes.
- The tracked-link test independently verifies that the destination anchor exists; the new R36 check verifies which claim owns that route.
- Full Windows suite passed 183/209 with 26 POSIX-only skips and zero failures. JavaScript syntax and `git diff --check` passed; diff contains only the R36 route helper/probes and scoped planning.
