# Task Plan: R29 cold-evidence fact repair

## Goal

Repair the missing end-of-record Cold evidence entrances in Phase 4.8 and Phase 4.10 using a verified immutable Git source, without changing their frozen discovery/live conclusions or retiring R29 assertions.

## Authorization and scope

- Maintainer authorized the proposed paired, append-only repair after read-only Git provenance audit.
- Allowed: append one stable-anchored Cold evidence section to each of the two history records; planning evidence; minimum verification and one local commit.
- Not allowed: rewrite existing history text, restore retired root guides, change R29 or other tests, alter current ROADMAP/Release/Cloud roles, or perform remote writes.

## Current phase

Completed locally: both append-only Cold evidence entrances are source-verified and passed focused/full Windows regression. R29 test retirement remains a separate gate.

## Next Step

Hand off the paired fact repair. Separately review Phase 4.8's R29 narration assertions against the now-real source link and status/index relations before any test retirement. Do not use this historical correction as Phase 5.1, Cloud or Release PASS.

## Phases

1. [x] Recover exact source and check history-section conventions.
2. [x] Append the two evidence sections without changing earlier bytes.
3. [x] Verify links, identity, focused/full regression and diff; create one local commit.

## Stop conditions

- Each record retains at most one immutable source snapshot and does not make a retired guide current authority.
- The selected commit must contain the stated guide file and required explicit anchors, with bytes matching the last tracked pre-retirement copy.
- Do not call Phase 4.8's R29 narrative assertions retired or Phase 5.1 complete in this gate.
- Stop if the proposed source identity or historical meaning conflicts with local Git evidence.

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
