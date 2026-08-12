# Findings: Phase 4 F2A smart activation implementation

## Entry evidence

- Entry branch is clean `0.4.0-dev`; latest documentation commit is `bf0e2c0`.
- F1 foundation is implemented and Source/Candidate/no-live Cloud accepted; F2A Discovery is
  `CONDITIONAL_GO_TO_F2A_IMPLEMENTATION`.
- The independent activation commit point and local/Cloud authorization split are already frozen. Implementation must not reopen the
  same-file token example or claim live Cloud activation.
- Request/result schema v2 already reserves smart; expected implementation is consumer/runtime behavior plus byte-hash propagation,
  not a schema rotation.

## Invariants inherited from Discovery

- activation absent means ordinary legacy and zero `.mode` read;
- activation valid + invalid/incomplete profile means bounded refusal, never legacy downgrade;
- token and mode identity/content are revalidated after rendering before output;
- smart is passed only as owned `PWF_INJECT=smart` into a normalized private snapshot;
- runtime never writes workspace and never reads nonce, attestation or ledger in F2A;
- adapter still emits canary first and catch-up only after an injecting validated plan result.

## P0 current-tree inventory

- `runtime/owned-plan.py` has two independent legacy locks: `SUPPORTED_PROFILES=("legacy",)` and an F1 unit-only
  `capture_owned_state()` that currently parses managed token and profile from the same `.mode`. Production does not call it.
- `_execute()` already resolves attachment/no-plan before opening a plan and already revalidates plan-directory identity after child
  rendering. F2A can insert state admission only after a real plan is resolved, preserving disabled/detached/no-plan zero-read.
- `safe_read_file()` already enforces no-follow, regular file, single link, byte budget, UTF-8 and first-pass replacement checks. F2A
  should factor a captured identity return from this authority rather than add a second unsafe reader.
- The private snapshot contains only task/progress. `minimal_env()` strips ambient `PWF_INJECT`; F2A can add an explicit owned
  `inject_profile` parameter and set `PWF_INJECT=smart` only after state admission.
- `hooks/hook_adapter.py` produces `[legacy]` and validates only legacy results. It must atomically produce `[legacy, smart]` and accept
  any non-null effective profile that belongs to the exact request sequence; invalid requests remain null + bounded advisory.
- Request/result v2 schemas already admit `[legacy, smart]`, smart results and all required advisories. Their bytes stay unchanged.
- Runtime byte changes propagate through `contracts/runtime-bundle-v2.json`, then its raw hash through `upstream-manifest.json`;
  adapter and owned-plan hashes both change. Release inventory paths/modes do not change.
- Nearest failing-first work belongs primarily in `tests/owned-plan-runtime.test.js`, `tests/runtime-supervisor.test.js` and
  `tests/hook-adapter.test.js`; contract tests should assert schema-v2 reuse and exact current producer capability.

## P1/P2 implementation evidence

- Failing-first produced exactly four portable failures corresponding to the frozen implementation boundary; no fixture or syntax
  defect was exposed.
- Returning captured file identity from the existing safe reader allows one admission authority to serve both content parsing and
  post-render revalidation. No cache or second parser was added.
- The absence of `.pwf-codex-managed` returns legacy before attempting `.mode`, including when `.mode` is invalid UTF-8. This makes
  old/unsafe markers physically inert.
- Adapter validation now relates `effective_profile` to the exact request capability instead of hard-coding legacy, while invalid
  request results remain null-profile + bounded advisory.

## P3/P4 closeout evidence

- F1's same-file token grammar and no-production-call note were replaced, not merely removed. Current production now has exactly one
  state admission call edge, and its lifecycle guards prove unarmed zero-read, exact smart, fail-closed armed state, both state-file
  post-render races and disarm.
- Request/result remain schema v2. The request schema comment was updated from its historical F1B producer state, and its exact bytes
  were propagated through the installed-contract hash, runtime bundle raw hash and source manifest authority.
- No nonce, attestation or ledger reader entered owned-plan. `autonomous` and `gate` exist only as explicitly rejected future profile
  vocabulary; ledger-summary remains bundle inventory for its separately owned upstream/catch-up dependency.
- The current acceptance file now separates the pending F2A status from immutable F1B gate evidence. This prevents a later gate from
  erasing evidence while also preventing old source/ZIP hashes from masquerading as current F2A acceptance.
- Windows local verification is complete. Linux-only safety and real adapter/runtime composition tests remain unchanged and mandatory;
  the absence of WSL/container support is a platform limitation, so F2A is not yet a completed Cloud gate.
