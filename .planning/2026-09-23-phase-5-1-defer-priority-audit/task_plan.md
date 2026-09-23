# Task Plan: Phase 5.1 DEFER prioritization audit

## Goal

Review the 17 proposed `DEFER` rule groups after the bounded R24 sample. Identify the most useful next small Discovery slice with its existing owner, nearest independent guards, harmful/harmless probes, residual manual review, and stop conditions. Do not implement another assertion change in this audit.

## Authorization

- The maintainer asked to continue from the R24 result and explicitly allowed work to span multiple turns.
- This gate authorizes read-only source/authority/test review and a planning-only recommendation for the next slice.
- The 59-group inventory remains proposed; no blanket approval, Discovery freeze, Cloud/Release action, or remote write follows.

## Current phase

Complete: planning-only DEFER prioritization audit. Phase 5.1 Discovery remains open.

## Next Step

None inside this audit. The maintainer can authorize, amend, or decline the separately scoped R23a implementation proposal; no test edit is authorized by this audit alone.

## Phases

1. [x] Reconcile the inventory's 17 DEFER groups with the current source baseline and rule owners.
2. [x] Compare risk, independent guard maturity, and feasible two-way probes; select and specify one next slice.
3. [x] Check the recommendation against Phase 5.1 exit/stop conditions, verify planning-only diff, and commit locally.

## Stop conditions

- Do not patch tests, operator documents, contracts, runtime, or Release inputs in this audit.
- Do not downgrade a safety, identity, immutable-recovery, permission, or Release guard because an assertion is brittle.
- Do not classify all DEFER groups as approved or declare Phase 5.1 frozen/complete.
