# Findings: Phase 4 F3B0 live preflight Discovery

## Entry facts

- F3A local foundation and Linux/Source-Candidate/no-live Cloud gate are complete; exact candidate bytes and markerless legacy
  behavior passed, but no real smart/autonomous lifecycle has been exercised.
- F3B does not need a new safety model. It needs an executable Cloud experiment protocol that cannot confuse post-start candidate
  installation with a true Fresh `SessionStart` activation.
- Codex Cloud environment setup and agent/workspace execution are separate lifecycle stages. Cloud may reuse cached environments;
  cache is therefore an optimization to observe, never a correctness authority.
- Public Cloud documentation exposes branch-oriented task selection and review/follow-up workflows, but does not establish an
  authenticated in-task consent callback or make a branch name equivalent to an exact immutable checkout.

## Provisional route

- Treat `runtime source HEAD` and `workspace lifecycle HEAD` as two separately verified identities.
- Pin/build/install the candidate during environment setup, before the first agent phase; in the first agent phase verify exact
  workspace HEAD and clean state before accepting Hook evidence.
- Use isolated, frozen validation branch chains for smart and autonomous. Never merge opt-in, tamper or disarm fixtures into the
  development branch.
- Split live work into protocol materialization/no-live dry run, smart live, autonomous zero-ledger/tamper/re-arm, and final evidence
  closure. Each gate stops for maintainer review.
- Keep the development branch markerless. Replace the F3A legacy-only transition assertion only inside profile-specific validation
  preparation branches; do not weaken source governance globally.

## Frozen outcome

- Phase 4.7 closes F3B0 with `CONDITIONAL_GO_TO_F3B1_PROTOCOL_MATERIALIZATION`; the conclusion does not authorize F3B1.
- F3B uses two exact identities: setup/maintenance installs `RUNTIME_SOURCE_HEAD`, while Hook behavior is attributed to a separately
  verified `WORKSPACE_LIFECYCLE_HEAD`.
- The isolated topology is `S_PREP → S_ARM → S_DISARM → S_REARM` and
  `A_PREP → A_ARM → A_DISARM → A_REPREP → A_REARM`, both rooted at a markerless foundation.
- Tamper uses a single disposable Cloud worktree edit from exact `A_ARM`, not a deliberately invalid remote commit. Expected result
  is real UserPrompt canary-only plus production probe `inject=false / effective_profile=null / advisory=state_unsafe`.
- The route is split into F3B1 protocol materialization/no-live dry run, F3B2 smart live, F3B3 autonomous live and F3B4 evidence
  closure. Every transition stops for maintainer review; F3C remains separately unauthorized.
- The development branch remains markerless. Its legacy assertion becomes the development candidate no-live guard; only isolated
  validation preparation branches replace it with exact profile-specific closure.
