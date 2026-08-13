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

## Post-implementation acceptance audit

- Phase 4.4 already had a six-row handoff and a status tail, but it did not reconcile every implemented seam with its actual
  owner/consumer, executable evidence and retirement trigger. A cold post-implementation table is warranted; current status must
  still remain in ROADMAP/task plan.
- The Source/Candidate setup discovers all non-publication `*.test.js` dynamically, so F2A portable/Linux behavior tests already enter
  the zero-skip Cloud gate without a new shell test list.
- The old B–E canonical fixture contained only a flat title. It could prove planning context existed, but could not distinguish
  markerless legacy from an accidentally activated smart selector.
- A structured plan containing one completed sentinel and one active sentinel provides that discriminator: markerless legacy must
  expose both; smart selection would omit the completed phase. The no-live route still must not create real activation files.
- Follow-up correction: version acceptance is not limited to completed evidence when one version contains several independently
  tested gates. It may own a coarse gate ledger and current-gate validation delta; only command-level progress, retry state and Next
  Step remain exclusive to the active plan. F1B exact evidence stays historical, while F2A exact source/ZIP evidence is still appended
  only after a completed Cloud run.
- The current-gate delta must be useful before execution, so it records the exact outputs that will constitute PASS rather than
  pretending those outputs already exist. Exact source/ZIP/hash values remain forbidden until the Cloud run completes.

## First Cloud 9.1 diagnosis

- The reported failing script explicitly referenced retired v1 paths/keys, while the committed 9.1 already resolved both contracts
  through `upstream-manifest.json` and used all three v2 partitions. Repository-wide current-doc/source/test search found v1 operational
  syntax only in cold planning/history and published v0.3.x oracles, not in the current Cloud template.
- Therefore the first failure is stale external acceptance-script drift, not product/install/current-template failure. Because the
  stale check was read-only and the corrected invocation reran the complete v2 assertions, its green output is valid 9.1 step evidence;
  final gate PASS still requires linkage to the exact preceding Source/Candidate identity and Host blackbox evidence.
- The Cloud feedback still exposed useful defense-in-depth: deep checks should derive the install root from `bundle.roots.installed`,
  verify every upstream/local/contract installed byte against the correct v2 hash key, and emit an exact protocol marker plus source
  HEAD so stale `/tmp` scripts cannot be mistaken for the current runbook.

## Acceptance write-authority correction

- The reported `96119dd` candidate versus later deep-check HEAD was explained by the Cloud model automatically fixing the stale
  script and creating a PR. The product checkout was not initially wrong; the acceptance task had granted an implicit repair path.
- A no-PR note must also forbid branch, commit, push and automatic repair. Otherwise a local commit still advances HEAD and hides the
  canonical fixture from the dirty-worktree evidence.
- C intentionally modifies `.planning/.active_plan` and creates three fixture files, so the old 9.1 clean-worktree assertion was
  incompatible with a correct no-commit run. 9.1 must accept exactly those four paths and reject every other repository mutation.
- A fixed `pwf-cloud-acceptance-v1` directory is not invalid—the resolver intentionally supports legacy undated slugs—but it collides
  on repeated runs. UTC date plus an 8-hex run ID follows upstream naming practice and makes each fixture append-only.
- A protocol slogan only proves that a script printed the slogan. Better evidence is the manifest-routed contract path/id/schema,
  installed root, exact Source HEAD and candidate ZIP SHA. Exact v2 structural assertions remain legitimate consumer contract checks.
- Cross-task identity state must remain data, not executable shell. The setup therefore creates a 0600 JSON file with `O_EXCL`; 9.1
  checks regular-file type, current uid, exact mode, single link, exact keys and values before consuming it.

## Minimal-protocol correction

- Maintainer review correctly identified that the first P8 implementation was disproportionate to the actual failure: a missing
  no-auto-fix/no-PR instruction. C is the only prompt-authorized repository writer; D/E read its result through Hooks, and 9.1 is a
  read-only deep check.
- Retire the cross-task JSON, duplicated 9.1/9.2 exact worktree oracles and their dedicated test. Keep the task permission prefix,
  unique C plan ID and manifest-routed facts. Source HEAD/ZIP remain explicit 4.1 evidence and are compared during evidence writeback.
- The minimal 9.1 guard only rejects changes outside `.planning/`. It is defense-in-depth for accidental product edits, not a second
  machine contract for the exact canonical fixture shape.
