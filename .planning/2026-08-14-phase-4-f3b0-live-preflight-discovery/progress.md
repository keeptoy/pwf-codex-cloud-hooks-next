# Progress: Phase 4 F3B0 live preflight Discovery

## 2026-08-14

- Maintainer requested discussion before F3B and a new Phase 4.7 plan after the route is settled.
- Recovered repository authority, confirmed a clean `0.4.0-dev` worktree, and closed the completed F3A planning scope without
  reopening its evidence.
- Re-read F3A foundation, Phase 4.6, current F3 runbook, acceptance status, repository tests and official Cloud lifecycle facts.
- Identified the central preflight distinction: candidate runtime bytes must be installed before the first agent startup, while the
  workspace activation state must be proven by a separate exact lifecycle commit. A normal post-start Source/Candidate install cannot
  establish true Fresh activation.
- Compared current official Cloud environment, cache, approval and Hooks documentation with Phase 4.6. The public ABI supports
  selected branch/commit checkout, setup-before-agent, cached maintenance, startup/resume sources and review/follow-up, but does not
  provide an authenticated opt-in callback or make branch names an immutable authority.
- Created Phase 4.7 with the two-identity model, isolated smart/autonomous commit chains, disposable tamper fixture, F3B0～F3B4 gates,
  lifecycle ledger, evidence schema and hard-stop routing. Synced the history index, ROADMAP and version acceptance status without
  adding live evidence or source hashes.
- Focused execution in the restricted Windows harness reproduced the known child-process `status=null` / worker `spawn EPERM`
  limitation; an allowed local runner then passed the new Phase 4.7 assertion 1/1 and the selected programme/history/acceptance
  governance assertions 3/3.
- The first full regression had one real documentation-governance failure: ROADMAP contained a second link to the same README
  documentation-map fragment. Removed only the duplicate link while retaining the programme summary and single history entrance.
- Final focused cross-document test passed 1/1. Final full Windows regression passed 158 tests: 135 pass, 0 fail and 23 honest
  Linux/POSIX skips. This documentation/governance-only round changed no candidate/runtime bytes and requires no new ZIP/Cloud gate.
- Final pre-commit audit found exactly the three Markdown planning records in the active scope and no mode/nonce/attestation/token/
  ledger machine state. `git diff --check` passed; the round is ready for its single local documentation/governance commit.
- No production, contract, runtime, Release or real planning machine state has been changed.
