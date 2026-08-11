# Findings: Phase 4 Discovery

## Starting baseline

- accepted baseline 是 immutable v0.3.5；本地分支为 `0.4.0-dev`，尚无 successor package/machine identity。
- 当前 production 只有 `SessionStart` / `UserPromptSubmit` 两个 managed adapter event，顺序为 canary → owned plan →
  可选 owned catch-up → validated context；默认 behavior profile 为 `managed_legacy`。
- private snapshot 只投影 `task_plan.md` 与可选 `progress.md`，因此 `.mode`、attestation、nonce、workspace metadata 与
  ledger mutation 不进入当前 injector 数据面；这些上游分支当前不可达。
- C2 已形成 `CONDITIONAL_GO`：contract-v2 foundation 首选在 Phase 4 Discovery 后作为 `0.4.0-alpha.*` 中独立、
  未激活 gate；`origin` 为 `DEFERRED_WITH_REVIEW_TRIGGER`，最迟在 v2 implementation 前裁决。

## Current official OpenAI Host facts — 2026-08-11

Sources:

- [Official Hooks documentation](https://learn.chatgpt.com/docs/hooks)
- [Official Cloud environments documentation](https://learn.chatgpt.com/docs/environments/cloud-environment)

Observed facts relevant to this Discovery:

- Hooks are a current Codex extensibility framework. Officially listed events now include `PreToolUse`, `PermissionRequest`,
  `PostToolUse`, `PreCompact`, `PostCompact`, `UserPromptSubmit`, `SubagentStop`, `Stop`, `SessionStart`, `SubagentStart` and
  `SessionEnd`.
- Multiple matching command hooks for one event are launched concurrently. Managed hooks from system/MDM/cloud/
  `requirements.toml` are policy-trusted and cannot be disabled in the user hook browser.
- `SessionStart.source` currently documents `startup`, `resume`, `clear` and `compact`; `SessionStart` JSON can add developer
  context, and a compact-triggered hook can feed the immediate continuation.
- The official docs explicitly call `transcript_path` convenient but not a stable hook interface. This supports retaining the
  repository's validation/capture boundary rather than treating transcript JSONL as a stable ABI.
- Cloud checks out the selected branch/commit, runs setup, and may run maintenance when resuming cache. Configured environment
  variables span setup and agent phases, but shell-local `export` in setup does not; secrets are removed before the agent phase.
- Cloud container state can be cached for up to 12 hours. Cache creation uses the default branch plus setup; resume checks out the
  chat branch and may run maintenance. Cache behavior is therefore a Phase 4 acceptance input, not an ambient constant.

## Immediate scope consequence

- The old programme assumption “compaction/tool/Stop ABI is not publicly present” is no longer accurate. The events are publicly
  documented, but Product Phase boundaries still hold: ABI existence does not authorize Phase 5～8 behavior.
- Phase 4 should record these events only as adjacent Host facts and keep production registration at the current two events unless
  a later Product Phase independently authorizes expansion.
- The current official docs strengthen two existing invariants: managed hooks remain policy-owned, and mutable transcript data must
  stay behind an owned validation boundary.

## C2 inheritance

- Source origin should be decided after Phase 4 freezes `upstream_files` / `local_files` / source-only / installed partitions.
- `language` and `host_dependencies` remain candidates for real admission ownership; do not delete them before mapping new source.
- installed plan schemas and source-only catch-up schemas must be revisited with the actual Phase 4 producer/consumer graph.
- Any contract-v2 implementation remains separate from Phase 4 behavior activation even if both share one `0.4.0-alpha.*` train.

## Open evidence work

- Recover exact pinned v3.8.2 files and call graph for attest, nonce, modes and ledger.
- Map every file into upstream pristine, owned local runtime, source-only support, installed contract or denied surface.
- Compare upstream write/mutation assumptions with private snapshot permissions, identity checks, cleanup and Cloud users.
- Determine whether opt-in can be expressed without adding a new Host event or reading mutable global Skill state.

## D1 initial upstream inventory

- Workspace contains the ignored, full pinned extraction `planning-with-files-3.8.2/`; current Git status remains clean after the
  D0 commit, so it can serve as read-only cold source evidence without becoming repository source authority.
- Canonical upstream skill surfaces include `attest-plan.sh`, `phase-status.sh`, `ledger-append.sh`, `ledger-summary.sh`,
  `inject-plan.sh`, `resolve-plan-dir.sh` and `session-catchup.py` under `skills/planning-with-files/scripts/`.
- Current managed bundle admits only four pristine scripts: session catch-up, resolver, injector and ledger summary. Phase 4
  candidates `attest-plan.sh`, `ledger-append.sh` and `phase-status.sh` remain outside source/install/ZIP inventory.
- The upstream archive also contains a Codex-specific `.codex/hooks.json` and multiple Codex hook adapters/scripts, including
  SessionStart, UserPromptSubmit, PreCompact, Pre/PostToolUse, PermissionRequest and Stop. They are upstream integration examples,
  not automatically admissible production dependencies; current architecture still requires one repository-owned managed adapter.
- Next inventory step must distinguish canonical skill semantics from `.codex` platform glue. Reusing upstream skill scripts may be
  considered; importing upstream Codex handlers would create a second Host integration and currently violates the adapter-only boundary.

## D1 injector and attestation observations

- Upstream does not implement four equivalent modes. The base states are legacy (no `.mode`), autonomous and gated; smart injection is
  an orthogonal opt-in from `PWF_INJECT=smart` or an `inject-smart` token that composes with the other states.
- `inject-plan.sh` reads `.mode`, `.attestation`, `.nonce`, `task_plan.md`, progress/ledger and a user cache. In autonomous/gated mode it
  suppresses per-tool injection, replaces raw progress tail with ledger summary and refuses plan-body injection when attestation is absent.
- Attestation is the actual write-access defense: plan SHA mismatch blocks injection. The nonce only randomizes delimiters; upstream
  explicitly acknowledges that an actor able to write the plan can also read the nonce and forge a matching delimiter.
- Gated mode forces a fresh plan hash even when the mtime cache hits. Other modes may trust the hash cache keyed by absolute plan path and
  mtime; the cache is a performance surface that requires its own tamper/cache model before managed adoption.
- `attest-plan.sh` writes `.attestation` beside the plan through temp-file + rename, optional advisory `flock`, fallback rename and read-back
  verification. It mutates user planning state and is therefore not just another read-only injection dependency.
- Canonical upstream scripts use ordinary path/file operations and intentionally preserve broad host portability. The current owned-plan
  boundary adds stronger no-follow, identity, race, size, UTF-8 and private-snapshot controls. Phase 4 cannot directly expose the user plan
  directory to upstream injector/attester and assume current safety remains intact.
- Candidate architecture implication: preserve upstream semantic behavior where useful, but place all reads/writes of `.mode`, `.nonce`,
  `.attestation`, ledger and cache behind an owned state boundary. Directly registering or executing upstream Codex hooks remains excluded.

## D1 mutation and concurrency surfaces

- `ledger-append.sh` is a state writer, not merely a helper for rendering summaries. It appends free-text event records to
  `ledger-<agent>.jsonl`, derives the next global tick by scanning every ledger and also creates `.ledger_lock` in the plan directory.
- Its `flock -w 5 9 || true` path is best-effort: a timeout does not stop the append. Concurrent writers can therefore proceed without
  the intended lock and race or allocate duplicate ticks. This is not sufficient as a managed trusted-state primitive without an owned
  locking, identity and atomicity contract.
- `ledger-summary.sh` is read-only and already remains a legitimate conditional dependency of pristine `inject-plan.sh`. Its rendered
  context omits ledger summary prose and timestamps, but it still parses user-controlled/malformed ledger lines and phase headings;
  admission of writers is a separate decision from retaining this reader.
- `phase-status.sh` rewrites `task_plan.md` through a temporary file and rename under another best-effort `.write_lock`. Every successful
  rewrite invalidates the plan hash and therefore requires re-attestation. Its ordinary shell path handling and fail-open lock timeout do
  not meet the existing owned-plan safe-write boundary by themselves.
- `init-session.sh --autonomous` / `--gated` creates `.stop_blocks`, removes stale `.gate_last_ledger`, generates `.nonce`, writes `.mode`
  and invokes the attester. However, the attestation call is followed by `|| true`, so mode state can exist even when initial attestation
  failed. The upstream flow expresses an intent to attest by default, not an atomic managed activation guarantee.
- Phase 4 must therefore split read-only opt-in/context semantics from write-enabled autonomous/gated state management. It must not admit
  attester, ledger writer and phase writer as one undifferentiated bundle merely because upstream v3 groups them in one workflow.

## D1 upstream integration call-graph boundary

- The canonical Skill documentation exposes `ledger-append.sh` and `phase-status.sh` as workflow tools for agents/operators; repository-wide
  search found no canonical Codex hook that invokes either writer. They are not implicit dependencies of plan injection.
- The upstream `.codex/hooks.json` registers seven event families and searches project-local hooks before `$HOME` hooks. That deployment
  model permits mutable workspace code to execute and is incompatible with this repository's absolute, installer-owned adapter contract.
- The archive's `.codex/hooks/user-prompt-submit.sh` directly reads `task_plan.md` / `progress.md` and emits legacy raw context; it does not call
  canonical `inject-plan.sh` and therefore does not carry the attestation, nonce, mode or structured-ledger semantics under review.
- The archive consequently contains two integration descriptions with different behavior: canonical Skill scripts/docs and Codex-specific
  platform glue. Phase 4 source admission must treat canonical Skill semantics as the upstream subject and keep `.codex` glue denied; the
  mere presence of upstream Hook registrations cannot define the managed runtime call graph.
- Upstream `Stop` is only a thin platform adapter over `stop.sh` / completion-gate behavior. That is evidence for the later hard-gating Phase,
  not authorization to register `Stop` during Phase 4.

## D1 current managed reachability

- The adapter-to-plan request contract is deliberately exact-v1 and accepts only `behavior_profile=managed_legacy`; the corresponding result
  contract has no mode, attestation, nonce or ledger diagnostics. Phase 4 opt-in cannot be smuggled through an unknown field without a reviewed
  protocol rotation.
- `owned-plan.py` safely resolves the selected plan, reads only `task_plan.md` plus optional `progress.md`, copies those bytes into a private
  `0700` snapshot as `0600` regular files, and runs pristine `inject-plan.sh` there. Consequently `.mode`, `.nonce`, `.attestation` and ledgers
  are intentionally absent and every v3 branch remains unreachable even though the pristine injector contains the code.
- This isolation is stronger than the upstream shell boundary: it rejects symlink/hard-link/race/identity changes, bounds input/output and
  execution, supervises the process group, and removes only owned snapshots. Any Phase 4 projection must preserve these properties file by file.
- A minimal read-only extension is mechanically possible: safely read selected metadata and ledger inputs, then project verified bytes into the
  private snapshot. That possibility does not settle authority: copying a user-writable `.attestation` beside a user-writable plan proves only
  consistency of two workspace files, not approval by a separately protected principal.
- The private snapshot path is fresh per invocation. `owned-plan.py` gives the child neither `HOME` nor `XDG_CACHE_HOME` and sets `TMPDIR` to
  that snapshot, so upstream's cache is currently created inside the snapshot and removed after the call. Blindly enabling attestation there
  would recompute on every Hook fire; a persistent managed cache would be a separate owned-state decision, not an inherited upstream feature.
- Current Host composition already injects only at turn start (`SessionStart` / `UserPromptSubmit`), not before every tool call. Therefore the
  autonomous benefit described upstream as suppressing per-tool plan recitation is already achieved by the managed integration and should not
  be treated as a Phase 4 feature requirement.

## D1 frozen source and state inventory

| Surface | Upstream role | Mutates workspace | Current managed status | D1 disposition |
|---|---|---:|---|---|
| `resolve-plan-dir.sh` | selected-plan resolver | no | pristine admitted/installed | keep current dependency |
| `inject-plan.sh` | legacy/smart/v3 context renderer and attestation verifier | transient cache only | pristine admitted/installed; v3 inputs unreachable | reuse only behind owned snapshot |
| `ledger-summary.sh` | structured, no-free-text ledger renderer | no | pristine admitted/installed; conditional branch unreachable | keep; candidate reader for autonomous context |
| `session-catchup.py` | SessionStart catch-up helpers | no intended workspace write | pristine admitted/installed through owned wrapper | unchanged; not a Phase 4 component |
| `.mode` | user opt-in tokens | data written outside current runtime | deliberately not projected | candidate bounded input; exact grammar required |
| `.nonce` | randomized delimiter token | data written outside current runtime | deliberately not projected | candidate bounded input; not an authority |
| `.attestation` / `.plan-attestation` | approved plan digest | data written outside current runtime | deliberately not projected | candidate bounded input; authority semantics unresolved |
| `ledger-*.jsonl` | per-agent event history | writers append | deliberately not projected | candidate bounded read inputs; count/name/size/UTF-8 limits required |
| `attest-plan.sh` | operator/Skill attestation writer | yes | explicitly denied by bundle guard | not a runtime dependency; defer write-path admission |
| `ledger-append.sh` | workflow ledger writer | yes | explicitly denied by bundle guard | not a Hook dependency; defer to writer/orchestration gate |
| `phase-status.sh` | sanctioned plan status writer | yes | explicitly denied by bundle guard | not a Hook dependency; defer to writer/orchestration gate |
| `init-session.sh` | initializes plans and v3 markers | yes | global pristine Skill only; not managed runtime | user workflow surface, not production child |
| `check-complete.sh` / `gate-stop.sh` | completion and Stop gate | yes, counters | not admitted | Phase 8 evidence only |
| upstream `.codex/*` | platform-specific Hook glue | varies | not admitted | deny; behavior and trust model diverge |

D1 conclusion: no additional executable is required merely to make the existing pristine injector understand a safely projected opt-in state.
The likely new trusted code is an owned reader/state-policy extension, not a bulk import of three deferred shell writers. Any writer admission must
be justified by a later producer/consumer graph rather than by upstream directory membership.
