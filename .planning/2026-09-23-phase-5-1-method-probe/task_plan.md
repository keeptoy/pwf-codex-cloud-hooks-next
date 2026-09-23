# Task Plan: Phase 5.1 governance-method probe

## Goal

Validate the proposed document-test governance method on one bounded mixed case before the full rule-group inventory. Use a real safety-sensitive command/identity rule and an equivalent prose rewrite to see whether the existing assertions and a candidate scoped check produce the intended outcomes.

## Authorization

- The maintainer asked to continue with the proposed mixed-case method validation first.
- Create this active planning scope and record the probe design, observed outcomes, limitations, and next decision.
- Read the relevant current authorities, test source, and operator text; run in-memory or disposable, no-live probes.
- Do not edit repository governance tests, operator instructions, production, contracts, Cloud/Release state, or the open history draft as part of this probe.
- Do not start the full two-file rule/assertion inventory, assign final KEEP/REPLACE/RETIRE/DEFER labels, freeze Phase 5.1, or authorize implementation.

## Current phase

Complete: bounded method probe.

## Next Step

None. The method probe is complete. The broader two-file rule-group inventory and any test change require a separate next decision.

## Phases

1. [x] Recover the bounded rule, owner, operator block, and current assertions.
2. [x] Exercise in-memory negative and positive mutations; compare current assertions with a scoped candidate check.
3. [x] Record evidence, limits, and whether the method is viable; run focused repository checks and commit this planning-only result locally.

## Stop conditions

- Stop if the proposed check cannot distinguish actual executable instructions from stray matching prose.
- Stop if a safety-relevant rule lacks an identified owner or equivalent verification path.
- Stop before test implementation, broad inventory, Cloud/Release operations, or any remote write.
