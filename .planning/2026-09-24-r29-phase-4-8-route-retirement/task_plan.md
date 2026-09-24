# Task Plan: R29 Phase 4.8 route retirement

## Goal

Decide whether Phase 4.8's four wording-pinned R29 assertions can be replaced by owner/status/source relationships after its Cold evidence repair, and implement only that bounded replacement if harmful and equivalent probes pass.

## Authorization and scope

- Maintainer said “继续” after the paired Cold evidence repair and separate-review handoff.
- Allowed: Phase 4.8 branch of `tests/repository-boundary.test.js`, its in-memory counterexamples, scoped planning, proportionate local tests and one local commit.
- Not allowed: historical body edits, Phase 4.10/R31/R38 or other inventory changes, current programme/Cloud/Release changes, remote writes.

## Current phase

Completed locally: Phase 4.8's four wording-pinned assertions have been replaced by section-scoped status, current-owner and exact-source checks. Focused and full Windows regression pass.

## Next Step

Hand off this bounded R29 retirement. Separately reassess Phase 5.1 B0–B4 and remaining KEEP/DEFER inventory; do not infer Phase 5.1, Cloud or Release PASS from this local test change.

## Phases

1. [x] Recover previous evidence repair and R29 six-record precedent.
2. [x] Add Phase 4.8 relationship check and in-memory harmful/equivalent probes; retire only its four R29 wording assertions.
3. [x] Focused/full local regression, diff review and one local commit.

## Stop conditions

- Historical status remains a dated note, never current programme authority; a Cold evidence URL is a source snapshot, not new acceptance.
- Do not replace a fixed source identity with a generic commit-shaped URL.
- If a harmful mutation passes, an equivalent explanation fails, or the source identity cannot be verified, stop and ask for a separate decision.
- Do not call Phase 5.1, Cloud or Release complete.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| Section slice stopped at the status's own heading | 1 | Search for the next section only after the current status heading; focused test confirms. |
| Index route helper assumed a link without fragment | 1 | Admit a valid fragment on the same target file; existing index-admission check verifies the fragment resolves. |
