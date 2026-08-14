# Findings: Phase 4 F3B1 protocol materialization

## Entry facts

- F3B0 completed with `CONDITIONAL_GO_TO_F3B1_PROTOCOL_MATERIALIZATION`; the maintainer has now authorized F3B1 only.
- Current official Cloud documentation says a cold chat checks out the selected branch/commit before setup, while cached environment
  creation uses default branch and cached resume checks out the chat branch before optional maintenance. Setup and agent use separate
  Bash sessions; configured environment variables span phases, shell-local `export` does not.
- Current Hooks documentation keeps existing `SessionStart source=startup|resume|clear|compact` and `UserPromptSubmit`; F3B1 needs
  no new event or Host ABI.
- The development branch is clean and markerless. Existing F3A verifier/runbook tests use disposable directories and are outside the
  runtime/Release inventory.

## Frozen implementation shape

- Keep one versioned F3 runbook as human authority; do not create a shipped setup helper or second product CLI.
- Materialize one exact Bash transaction block and require it to be copied unchanged into setup and maintenance. Inputs are explicit
  environment configuration, revalidated at runtime, never authorization state.
- Extend repository-only test helpers to build both validation DAGs in temporary Git repositories and assert exact state at every
  node. The real active scope remains the three Markdown records.
- Freeze an evidence record grammar/parser in tests/runbook so live tasks report facts rather than self-certifying “latest” markers.
- Any profile state used by tests remains in OS temporary directories and is deleted by fixture cleanup.

## Implementation details recovered

- The existing Source/Candidate template already derives the external bootstrap from manifest-routed Release contract, performs two
  deterministic builds and installs with explicit `HOOKS_URL=file://...` plus exact `HOOKS_SHA256`. F3B1 should reuse that authority
  shape rather than hardcode the bootstrap filename or ZIP entry count.
- The versioned development bootstrap accepts explicit `CODEX_HOME`, `MANAGED_REQUIREMENTS`, `PLANNING_WITH_FILES_ROOT`, local
  `HOOKS_URL` and exact `HOOKS_SHA256`; its default zero hash remains fail closed. The F3 Cloud transaction can therefore build from
  an exact fetched source and install through the existing bootstrap without a new production installer.
- The Cloud environment transaction should require configured values for source repository, 40-hex source commit, 64-hex candidate
  SHA and explicit install paths. It must fetch/checkout the commit detached, dynamically resolve the bootstrap, build/check the ZIP,
  compare the exact digest, install with local override, and finish with doctor. It must not infer an expected digest from the build it
  is supposed to verify.
- Setup and maintenance will copy the same single runbook transaction. F3B2 live preflight must stop if maintenance cannot fetch or
  rebuild the exact source in the actual platform; F3B1 does not silently introduce a cached receipt as a second authority.
- The correct bootstrap route is `manifest.managed_runtime.contracts.release_artifact.path` followed by the Release contract's sole
  string `external_release_assets[0]`. F3B1 tests freeze this structural route without hardcoding a bootstrap filename.
