# Task Plan: Phase 5.1 B4k sensitive R36 guard audit

## Goal

Decide whether B4's remaining SHA/count, published-ledger role-neutrality, and exact section/identity guards should remain as-is or need a separately proved narrowing.

## Authorization and scope

- Maintainer said “继续” after B4j `7be63f3`; B4j's Next Step calls for auditing these three families.
- Audit R36, its source authorities and neighboring independent oracles. Record evidence and a bounded disposition for each family.
- This gate does not authorize weakening test guards, altering macro-document content, production/contracts, Release/Cloud or remote state. Any proposed substantive test change needs its own proof and scope.

## Current phase

Phase 3: dispositions and full local checks complete; create scoped audit commit.

## Next Step

After this audit commit, take one bounded B4l gate for the provenance ledger's role-neutrality ban: prove role declarations/rows fail and explanatory references pass. Leave SHA/count and heading guards unchanged in that gate.

## Phases

1. [x] Map the exact remaining assertions, owners and independent oracles.
2. [x] Run bounded in-memory harmful/harmless probes where uncertainty exists.
3. [x] Record KEEP/NARROW/DEFER decisions, verify planning-only diff and create a scoped local commit if the audit closes.

## Stop conditions

- Do not relax immutable publication, accepted/fallback role or source/asset identity checks.
- Do not move current programme role into provenance or CHANGELOG.
- Do not claim B4 complete if a sensitive guard lacks an owner/failure explanation.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell passed `tests/*.test.js` literally to `rg`, producing an invalid-path error while other paths were searched | 1 | Re-ran the targeted search against the `tests` directory; no source or test files changed. |
