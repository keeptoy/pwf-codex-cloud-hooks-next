# Task Plan: Phase 5.1 B4l provenance role neutrality

## Goal

Keep BASELINE_PROVENANCE's published-identity ledger free of moving ROADMAP role claims while permitting explanatory references to role vocabulary.

## Authorization and scope

- Maintainer said “继续” after B4k `7bc68a2`; B4k's Next Step selects the provenance role-neutrality ban.
- Change only the R36 role-neutrality helper/assertion and in-memory probes in `tests/repository-boundary.test.js`, plus scoped planning.
- Do not change macro-document content, SHA/count/heading guards, publication identity/oracles, production/contracts, Release/Cloud or remote state.

## Current phase

Phase 3: focused/full checks and diff review passed; create scoped local commit.

## Next Step

After B4l commit, reconcile B4a–B4l against the frozen Discovery and retained/deferred R36 guards before declaring B4 closed. Do not change SHA/count/heading guards without a separate proof and gate.

## Phases

1. [x] Audit role declarations, table rows and explanatory text against existing helpers.
2. [x] Add failing-first probes; implement scoped guard without weakening publication identity.
3. [x] Run focused/full checks, inspect diff and create one local commit.

## Stop conditions

- Provenance must not declare current candidate/accepted/fallback roles or annotate published identity rows with moving roles.
- A plain explanatory sentence about unpublished candidates or ROADMAP ownership must pass.
- Exact accepted/fallback rows, candidate publication membership and accepted acceptance route stay checked independently.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
