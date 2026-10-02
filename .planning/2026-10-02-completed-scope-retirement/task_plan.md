# Task Plan: retire completed Phase 5.1/5.2 planning scopes

## Goal

Remove the 45 completed planning scopes that the maintainer explicitly authorized for deletion, while preserving one valid active planning pointer and recoverability through Git history.

## Authorization and scope

- Maintainer stated that the existing `.planning` plans are complete and may be deleted.
- Allowed: verify closure, exact paths, current authority/history handoff and Git recovery; delete those completed scopes; retain this minimal active scope; run local checks; create one local commit.
- Not allowed: change production, tests, contracts, Phase 5.1/5.2 history or Product/Cloud/Release roles, or write remote state.

## Current phase

Completed locally: the 45 old scopes are removed, one valid active scope remains, and focused/full Windows regression passed. This planning-only transaction is ready for a bounded local commit.

## Next Step

Hand off the cleanup after its local commit. Old planning bytes remain recoverable from the pre-retirement Git commit; the new active scope is only the current-task pointer, not a replacement archive.

## Phases

1. [x] Verify exact old scope inventory, completion markers, external references and Git recovery.
2. [x] Remove only the old completed scopes and preserve the required active pointer.
3. [x] Verify repository invariants and create a bounded local commit.

## Stop conditions

- If any scope is dirty, untracked, contains unexpected files, or is referenced by a current local link, stop before deleting it.
- If a test or current authority requires old scope content beyond the historical capsule/Git recovery, stop and report the gap.
- Do not delete `.planning` itself or leave `.active_plan` dangling.

## Errors

| Error | Resolution |
|---|---|
| `rg` with a PowerShell-unexpanded `.planning/*/task_plan.md` argument failed | Used native PowerShell `Get-ChildItem` and `Get-Content` for the scope inventory. |
