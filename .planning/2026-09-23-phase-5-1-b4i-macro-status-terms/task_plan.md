# Task Plan: Phase 5.1 B4i macro-doc status terms

## Goal

Audit R36's whole-document ban on rollback/Latest terms in ARCHITECTURE and AGENTS, preserving ROADMAP as current programme owner while allowing safe owner pointers if evidence supports narrowing.

## Authorization and scope

- Maintainer said “继续下一步” after B4h local commit `e0ebba1`; B4h's Next Step is to map one remaining R36 ban by owner and failure consequence.
- Audit first. If safe, change only R36's ARCHITECTURE/AGENTS status-term guard and in-memory probes in `tests/repository-boundary.test.js`, plus scoped planning.
- Do not change macro-document content, production/contracts, Release/Cloud/remote, exact publication/acceptance checks, or unrelated R36/R35/R38 bans.

## Current phase

Phase 3: focused/full checks and diff review complete; create the scoped local commit.

## Next Step

After B4i commit, map one remaining R36 ban by owner and failure consequence; leave identity, count and role-neutrality guards unchanged until separately proven safe.

## Phases

1. [x] Map owner, duplicates and concrete harmful/harmless examples.
2. [x] Add failing-first probes and replace only the broad status-term ban.
3. [x] Run focused/full checks, inspect the exact diff and create one scoped local commit.

## Stop conditions

- ROADMAP remains the only current programme/rollback/Latest authority.
- A current role declaration in ARCHITECTURE or AGENTS must fail, including headings, status rows and direct claims.
- Equivalent owner-pointer explanation must pass.
- If that distinction cannot be made without weakening safety or Release boundaries, preserve the broad ban and report the reason.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| Focused suite failed because heading/row probes still expected the old generic error message after the guard gained separate structural messages | 1 | Align the probes with the new heading/row diagnostics; no behavior exception was added. |
