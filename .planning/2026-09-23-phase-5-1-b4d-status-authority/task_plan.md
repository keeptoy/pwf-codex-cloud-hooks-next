# Task Plan: Phase 5.1 B4d current-status authority

## Goal

Replace a bounded R36 whole-document status-term ban with declaration-shaped checks, so CHANGELOG and provenance can explain historical or routed status without becoming a second current lifecycle authority.

## Authorization and scope

- Maintainer said “继续” after B4c local commit `4251e12`; B4c's Next Step requires mapping one remaining R36 ban to its owner and failure consequence.
- Allowed: nearest R36 assertions and in-memory mutation probes in `tests/repository-boundary.test.js`, plus scoped planning.
- Not allowed: macro-document content changes, runtime/contracts, Release/Cloud/remote actions, R35/R38 or unrelated R36 retirement.

## Current phase

Phase 3: local verification and diff review complete; create the scoped local commit.

## Next Step

After B4d commit, inspect one remaining R36 ban's owner and failure consequence before proposing another bounded gate; do not retire it within B4d.

## Phases

1. [x] Confirm owner, existing duplicate checks and failure consequences for this narrow subset.
2. [x] Replace only safe status-term alternatives with a declaration guard and harmful/harmless probes.
3. [x] Run focused/full local checks, review exact diff and create one scoped local commit.

## Stop conditions

- Keep exact SHA, published identity, accepted/fallback role, count, and link checks unchanged.
- A false current Latest/rollback declaration in CHANGELOG or provenance must fail; historical narration and an authority pointer must pass.
- If the existing terms also protect an independent immutable identity, retain the broad ban and stop for review.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell `rg tests/*.test.js` used an unsupported glob path | 1 | Re-ran with `rg ... tests -g '*.test.js'`; no filesystem change. |
| Expected failing-first R36 probe: an ordinary sentence declaring `GitHub \`Latest\` is v0.4.3` passed the label-only guard | 1 | Match status identity assertions anywhere on the line while allowing a label that only points to ROADMAP. |
