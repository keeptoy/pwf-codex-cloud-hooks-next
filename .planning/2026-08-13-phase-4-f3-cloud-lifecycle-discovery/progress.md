# Progress: Phase 4 F3 Cloud lifecycle Discovery

## 2026-08-13

- Maintainer authorized entry into F3 Discovery after F2B local and no-live Cloud acceptance were closed.
- Loaded the planning and OpenAI Docs skills. The official-docs search initially returned generic pages; direct official Cloud routes
  established isolated task checkout, result/diff review and follow-up behavior, full-chat environment variables, setup-only secrets,
  and container caching for up to 12 hours with branch checkout/maintenance on resume.
- Confirmed the official material still does not establish an authenticated in-task consent callback or durable uncommitted-worktree
  authorization ABI. Started a dedicated read-only Discovery scope; no activation state, writer, Cloud task or remote mutation occurred.
- Inspected current user-side writer behavior and repository governance. The upstream initializer can leave partial autonomous state
  because attestation failure is advisory, while the current repository boundary rejects plan-local machine files. Recorded both as
  explicit F3 design inputs rather than weakening the read-only consumer or pretending the lifecycle is already usable.
- Identified a rollback-specific hazard: legacy runtime rollback can make the activation inert without deleting it, allowing a later
  upgrade to resurrect the previous opt-in. F3 must bind runtime rollback to an explicit workspace disarm/restore procedure.
- Downloaded the exact manifest-pinned v3.8.2 archive to a disposable temporary directory and verified its archive SHA-256 before
  inspection. Confirmed the full archive contains init/attestation/ledger helpers and that Cloud bootstrap copies the exact subtree,
  while installer/doctor only revalidates the smaller required Skill set. No archive bytes entered the repository.
- Compared the route hypotheses. Selected reviewed Git-backed preparation plus a separate activation-only commit; deferred same-chat
  uncommitted state because official cache/follow-up behavior is not a durability or authorization ABI; rejected environment/secret/
  link substitutes.
- Froze three independent gates: F3A repository/producer/runbook foundation with no live activation; F3B smart/autonomous Fresh,
  UserPrompt, real Resume, disarm/re-arm and tamper lifecycle; F3C disarm-first candidate → v0.3.5 → candidate rollback/reinstall.
- Froze the key product limitation that autonomous uses a reviewed, immutable task plan while armed. Editing task bytes requires a new
  disarm/re-attest/re-activate cycle; optional ledger writer durability is not claimed and remains a later writer-ownership problem.
- Discovery conclusion: `CONDITIONAL_GO_TO_F3A_IMPLEMENTATION`; no implementation or live gate is authorized by this conclusion.
- The first focused `node --test` invocation was blocked before assertions by Windows sandbox worker creation (`spawn EPERM`). Logged
  it as a harness limitation and switched to direct single-process execution of the same test files; no safety assertion was weakened.
- Direct execution reached assertions and exposed two expected programme-status fixture drifts: the repository test still required the
  old prose `F3 未授权` and exactly one acceptance `NOT_AUTHORIZED` row. Updated those assertions to require the new F3 Discovery
  conditional-go plus separate F3A and F3B/F3C unauthorized rows; exact trusted/planning/Release guards remain unchanged.
- Focused repository/architecture tests passed 16/16 outside the worker-restricted sandbox. Full local regression then passed with
  152 tests, 129 pass, 0 fail and 23 honest Windows POSIX skips; importer check, Python compilation, Node syntax, bootstrap Bash syntax
  and `git diff --check` all passed. No Linux, live Cloud or rollback evidence was inferred from this local run.
- Closed all Discovery phases and stopped at `CONDITIONAL_GO_TO_F3A`; the next action remains a maintainer authorization decision, not
  automatic implementation.
- The first local commit attempt was blocked before staging by `.git/index.lock` permission denial. No partial commit or remote write
  occurred; the verified exact file set is queued for a local-only escalated retry.
