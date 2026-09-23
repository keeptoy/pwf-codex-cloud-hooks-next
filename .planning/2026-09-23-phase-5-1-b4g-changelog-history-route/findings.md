# Findings: B4g CHANGELOG history route

## Entry baseline

- B4f `25487ae` is committed and the worktree was clean at entry. The previous plan authorizes mapping one remaining R36 ban by owner and failure consequence.
- README's documentation map routes version delta to CHANGELOG, current programme to ROADMAP, immutable identity to provenance, and closed Phase process to the history index. Root AGENTS permits only README and ROADMAP as macro entrances into Phase history.

## Pending decision

Resolved: the whole-document ban appears twice, in R30's macro-entrance loop and R36's CHANGELOG check. Both must change together for an inert explanatory path to pass; all other macro-doc bans remain unchanged. The governance guide expressly bars CHANGELOG from creating a third history entrance, not from naming the directory as literal text. Permit only inline-code path literals; continue rejecting every unquoted `docs/history/` occurrence, including Markdown links, reference definitions, HTML hrefs and prose that acts as a route. This is a deliberately narrow relaxation, not a general Markdown parser.

## B4g probe evidence

- Under the old whole-document check, the harmless inline-code path caused the focused suite to fail 28/29 as expected.
- The replacement strips only same-line backtick-delimited inline code before applying the original path ban. Direct Markdown links, reference definitions, HTML `href`, link labels containing inline code, and unquoted prose routes still fail. Single- and double-backtick literal explanations pass.
- Only CHANGELOG uses this helper at R30 and R36; the other macro documents retain their existing broad path ban. Focused repository-boundary suite passes 29/29 after the replacement.
- Full Windows regression passed 183/209 with 26 POSIX-only skips and zero failures; syntax and `git diff --check` passed. Windows skips are not Linux/Cloud evidence. Exact diff review found only the two CHANGELOG call sites, helper/probes and scoped planning.
