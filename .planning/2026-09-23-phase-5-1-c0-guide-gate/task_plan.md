# Task Plan: Phase 5.1 C0 operator-command governance gate

## Goal

Implement one bounded R24 replacement: validate the executable C0 tag/push block in `Wiki.md` rather than whole-file string occurrence. Prove harmful command/identity changes fail while an equivalent explanation rewrite does not. Keep all unrelated document assertions intact.

## Authorization

- The maintainer asked to continue with the previous recommendation after the 59-group inventory.
- This authorizes a narrow local implementation gate for R24 and its directly dependent C0 explanation assertions, with local tests and planning/Discovery evidence.
- R23, the remaining R25 wording, and all 17 `DEFER` groups stay unchanged; proposed inventory labels are not blanket cleanup authorization.
- No production runtime, contract, Cloud, Release, tag/push, or remote-write action.

## Current phase

Complete: bounded R24 C0 operator-command governance sample. Phase 5.1 Discovery remains open.

## Next Step

None inside this gate. The maintainer can review the sample's explicit parser limits and the other 58 proposed groups; any further assertion change needs a separate scope and authorization.

## Phases

1. [x] Recover R24/R25 source, owner, prior method probe, and test baseline; freeze the narrow safety contract.
2. [x] Add negative/positive in-memory probes, implement the scoped executable-block check, and replace only equivalent assertions.
3. [x] Run focused and risk-matched regression, update Discovery evidence without freezing it, inspect diff, and commit locally.

## Stop conditions

- Stop if the scoped check can pass a wrong active tag target, broad push, missing preflight, or mismatched peeled commit merely because safe text appears elsewhere.
- Do not interpret paraphrase tolerance as permission to lose safety or identity checks.
- Do not edit R23, other DEFER groups, Release inputs, or historical acceptance; do not declare Phase 5.1 PASS or implementation complete beyond this sample.
