# Task Plan: Phase 5.1 B4g CHANGELOG history route

## Goal

Determine whether R36's whole-document `docs/history/` ban in CHANGELOG can be replaced with an owner-specific route guard without allowing CHANGELOG to become a third Phase-history entrance.

## Authorization and scope

- Maintainer said “继续” after B4f local commit `25487ae`; B4f's Next Step is to map one remaining R36 ban by owner and failure consequence.
- Audit first. If replacement is justified, change only the CHANGELOG history-path rule at its R30 and R36 call sites and its in-memory probes in `tests/repository-boundary.test.js`, plus scoped planning.
- Do not change macro documents, production/contracts, Release/Cloud/remote, exact publication/acceptance checks, or unrelated R36/R35/R38 bans.

## Current phase

Phase 3: focused/full checks and diff review complete; create the scoped local commit.

## Next Step

After B4g commit, map one remaining R36 ban by owner and failure consequence; retain any broad guard whose replacement cannot prove equivalent protection.

## Phases

1. [x] Verify owner, duplicate checks and precise harmful/harmless examples.
2. [x] Implement a narrow CHANGELOG route guard with mutation probes.
3. [x] Run focused/full local checks, inspect the exact diff and create one scoped local commit.

## Stop conditions

- README and ROADMAP remain the only macro entrances into Phase history.
- Actual CHANGELOG links to Phase history must fail; inert explanation should not fail solely because it names the directory.
- If the boundary cannot be verified without weakening cross-document link or authority checks, leave the ban unchanged and report the reason.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| Expected failing-first harmless mutation: inline-code directory path failed under the old whole-document ban | 1 | Ignore only well-formed inline code spans; continue rejecting every remaining `docs/history/` occurrence. |
