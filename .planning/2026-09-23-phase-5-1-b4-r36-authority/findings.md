# Findings: R36 authority relations

## Baseline

- Clean `0.5.0-dev` after B3g commit `4895f65`.
- Frozen Discovery B4 calls for aligning CHANGELOG, ROADMAP, provenance, acceptance and publication oracle before replacing broad word bans.
- Current R36 test checks parsed CHANGELOG versions and candidate package route, but also uses broad forbidden phrases across whole documents and an exact acceptance title. This gate must separate role/identity checks from incidental wording.

## First owner map

- `currentRoleWindow()` already parses development/accepted/immediate-fallback rows from ROADMAP and derives candidate from `package.json`; another test pins the current v0.5.0-dev/v0.4.4/v0.4.3 roles. Published-release-oracles independently reads ROADMAP accepted/fallback, parses their provenance rows and rebuilds exact tagged sources/assets.
- Provenance section 1 is a role-neutral published-identity table; section 2 is migration cold evidence. R36 currently searches the entire provenance text for role versions and candidate absence. That is weaker than unique rows for accepted/fallback and too broad for an unpublished candidate merely mentioned outside the ledger.
- Accepted v0.4.4 provenance row links the current acceptance path and `#v0-4-4-role-window-closeout`; the acceptance contains that anchor. R36 currently checks only exact H1 wording. A route/anchor relation plus a version-preserving title check would protect identity while allowing equivalent title wording.
- Candidate publication detection currently relies on a ROADMAP sentence matching `` `candidate` published prerelease candidate|Latest closeout ``. There is no separate structured publication state in the current role table. Keep that temporal condition for now; changing it would need a dedicated programme-authority design, not a silent test rewrite.
- Broad whole-document bans for CHANGELOG, ROADMAP, provenance and macro docs mix authority enforcement with incidental word choice. They are not yet covered by parsed section/role negatives, so do not batch-retire them with the first relation replacement.

## B4 first relation

- `assertCurrentPublicationRoutes` slices the provenance published ledger and requires exactly one row for accepted and immediate fallback. Candidate ledger membership must match the existing ROADMAP publication marker, but mentions outside that ledger are allowed.
- The accepted row must link the exact version-derived acceptance path and role-window closeout anchor; that anchor must exist in the acceptance. The H1 need only retain the accepted version identity, not the literal English title.
- Harmful in-memory duplicate accepted row, candidate publication row, wrong acceptance target and wrong title version fail. Equivalent acceptance title and candidate mention outside the published ledger pass.
- The current ROADMAP publication marker and the broad CHANGELOG/ROADMAP/provenance/macro-document phrase bans remain unchanged; this bounded gate does not claim to solve their owner-specific replacement.
- Focused repository-boundary suite passed 29/29; full Windows `npm test` passed 183, skipped 26 POSIX-only cases, failed 0 (209 total). These skips are not Linux/Cloud evidence. `node --check` and `git diff --check` passed.
