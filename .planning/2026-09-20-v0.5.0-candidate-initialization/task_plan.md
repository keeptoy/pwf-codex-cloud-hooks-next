# Task Plan: Initialize the 0.5.0 development candidate

## Goal

Move the repository onto a coherent `0.5.0-dev` candidate identity on branch `0.5.0-dev`, retain one current planning scope, complete the README-to-Wiki split, and leave all published `v0.4.4` identities unchanged.

## Authorization

- The maintainer explicitly authorized formal initialization of the `0.5.0` development candidate.
- The maintainer explicitly instructed that the local branch name also align to `0.5.0-dev`.
- The maintainer authorized deletion only of completed obsolete plans and requires `.planning/` to remain available for planning-with-files.
- Local implementation, validation, and a local commit are authorized; remote writes, push, tags, PRs, Releases, and deployment remain forbidden.

## Next Step

Hand off the unpushed `0.5.0-dev` branch to the maintainer.

## Current Phase

Phase 5 — branch-name alignment complete

## Phases

### Phase 1: Recover and freeze scope

- [x] Rename the local branch to `0.5.0` and remove its stale `origin/0.4.4` upstream.
- [x] Migrate README development/build guidance to `Wiki.md`.
- [x] Delete the seven completed planning scopes and their obsolete active pointer.
- [x] Diagnose the `v0.4.4` sealed ZIP mismatch caused by changing README bytes.
- [x] Receive maintainer authorization to initialize a real `0.5.0` candidate.
- **Status:** complete

### Phase 2: Initialize the candidate identity

- [x] Set package and Release contract identity to `0.5.0-dev`.
- [x] Refresh manifest integrity references for the Release and accepted-predecessor contracts.
- [x] Create the canonical zero-hash `init-cloud-sandbox-v0.5.0-dev.bash` candidate bootstrap.
- [x] Update current documentation and tests without rewriting published `v0.4.4` evidence.
- **Status:** complete

### Phase 3: Validate

- [x] Run importer check, full tests, Python/Node/bootstrap syntax checks, mode checks, and `git diff --check`.
- [x] Classify platform-only skips honestly.
- [x] Review the final diff for scope and immutable-release safety.
- **Status:** complete

### Phase 4: Commit and hand off

- [x] Update planning with final evidence.
- [x] Create one scoped local commit.
- [x] Report the commit, validation, and maintainer-owned remote action.
- **Status:** complete

### Phase 5: Align the local branch name

- [x] Rename the local branch from `0.5.0` to `0.5.0-dev` after the maintainer's follow-up instruction.
- [x] Synchronize current ROADMAP, CHANGELOG, findings, and progress references.
- [x] Validate and commit the branch-name correction locally without configuring an upstream or writing to the remote.
- **Status:** complete

## Key Questions

1. Can `0.5.0-dev` become a valid zero-hash candidate without modifying published `v0.4.4` bytes? Expected: yes, by rotating current package/contract/bootstrap identity while retaining immutable historical evidence.
2. Does the repository keep exactly one valid active planning scope after obsolete plans retire? Expected: yes.

## Decisions Made

| Decision | Rationale |
|---|---|
| Use `0.5.0-dev` as package/contract candidate identity on branch `0.5.0-dev` | README is a Release ZIP input, and repository precedent uses a zero-hash `-dev` identity before stable C0 sealing; the follow-up branch rename keeps the local branch aligned with that identity. |
| Keep `v0.4.4` accepted and `v0.4.3` immediate fallback | Initializing a candidate does not rotate accepted or rollback roles. |
| Create one new planning scope | The user requires `.planning/` for planning-with-files; only completed obsolete scopes were authorized for deletion. |
| Keep `Wiki.md` Release-excluded | The new guide is maintainer workflow documentation and is intentionally outside the current ZIP allowlist. |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Local branch rename could not write `.git` in the sandbox | 1 | Re-ran the local-only rename with approved elevated filesystem access. |
| Unsetting the stale upstream could not lock `.git/config` in the sandbox | 1 | Re-ran the local-only config update with approved elevated access. |
| Sandboxed `npm test` returned `spawn EPERM` for every test file | 1 | Re-ran outside the sandbox; the suite executed normally. |
| Full suite exposed five failures after README migration | 1 | Fixed two moved-document assumptions; classified the remaining three as sealed `v0.4.4` identity drift requiring candidate initialization. |
| Planning update patch expected a decision row that was only present in `task_plan.md` | 1 | Inspected the exact files and applied separate targeted updates. |
| Node helper could not spawn `git show` in the sandbox | 1 | Avoid nested process spawning; stream Git output into a single-process canonical hash helper instead. |
| Candidate identity targeted suite had 5 governance assertion failures | 1 | Release builder/materializer tests all passed; inspect and update only stale documentation-order/version-neutrality assertions. |
| Targeted rerun had one remaining ROADMAP word-order mismatch | 2 | Corrected the assertion to match the stable wording without hardcoding the candidate version. |
| Architecture rerun exposed a stale Phase 5 route-placeholder assertion | 3 | Replaced it with a version-neutral assertion for candidate-active but Product-Phase-inactive state. |
| Phase 5 assertion patch expected a two-line hunk but source was one line | 1 | Read exact source lines and applied the correct one-line replacement. |
| Full suite had one published-oracle failure after candidate rotation | 1 | The accepted bootstrap still exists, but the oracle incorrectly selected it through the now-candidate Release contract; update the oracle to resolve the accepted version explicitly. |
| Sandboxed Git Bash could not create its Win32 signal pipe for `bash -n` | 1 | Treat as a sandbox/platform launch failure and retry the syntax-only check with approved elevated execution. |

## Stop Conditions

- Stop before any remote write, push, tag, PR, Release, Latest promotion, asset upload, or deployment.
- Stop if candidate initialization would require rewriting published `v0.4.4` bytes or immutable acceptance facts.
- Stop if trusted runtime, Host ABI, or product behavior changes become necessary.
