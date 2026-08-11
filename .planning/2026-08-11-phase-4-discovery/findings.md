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

## D2 semantic model

### Mode composition

| Effective state | Upstream inputs | Current managed Hook effect if safely enabled | Attestation | Progress/context source |
|---|---|---|---|---|
| legacy | no recognized v3 token | existing SessionStart/UserPromptSubmit output | optional; mismatch blocks | plan head + normalized raw progress tail |
| smart-only | `PWF_INJECT=smart` or `inject-smart` marker | structure-aware plan selection at the same two turn-start events | optional, like legacy | smart plan extract + raw progress tail |
| autonomous | `autonomous` marker | turn-start plan only; upstream pre-tool suppression is irrelevant because managed has no PreToolUse | mandatory to reveal plan | plan/smart extract + ledger summary |
| gated | `autonomous gate` marker | same turn-start context family as autonomous; distinct forced re-hash | mandatory to reveal plan | plan/smart extract + ledger summary |
| hard completion gate | gated marker plus Stop/check-complete/gate state | no current managed equivalent | separate from context rendering | Phase 8 only |

Smart selection is orthogonal: `inject-smart` alone does not create autonomous mode, and it may compose with autonomous. Gated context rendering is
not proof that the completion gate is active. Treating `.mode="autonomous gate"` as a complete Phase 4 feature would therefore be a partial and
misleading implementation while `Stop` remains intentionally absent.

### Failure semantics inherited and required

- No plan: injector is silent; adapter still emits the managed canary. This remains advisory fail-open for the Codex loop.
- Autonomous/gated without attestation: upstream emits a one-line refusal and hides plan and progress/ledger context. Managed result should expose
  a reason-coded non-injecting outcome rather than accepting a warning string as successful plan context.
- Digest mismatch or digest computation failure: upstream sets tampered and hides plan/progress. Managed must verify the digest against the exact
  safely captured plan bytes itself, fail closed for content, and never let a child cache decide trusted state.
- Nonce missing or invalid: upstream silently falls back to static delimiters. For a managed v3 opt-in this weakens the promised framing; candidate
  policy should require the exact nonce shape or reject the opt-in state. Legacy continues to use static delimiters unchanged.
- Ledger helper absent: upstream falls back to raw `progress.md`, contradicting the autonomous reason for replacing un-attested free text. Managed
  autonomous must instead treat the renderer/dependency or normalized ledger state as required and withhold optional context if unavailable.
- Child timeout/error/oversize remains advisory fail-open to canary, but cannot downgrade an explicitly recognized v3 state into legacy raw context.

### Parser and untrusted-data gaps

- Upstream recognizes mode components with substring `grep`, not exact tokens: arbitrary text containing `autonomous`, `gate` or `inject-smart`
  can activate behavior. The managed reader needs a bounded exact grammar and must reject unknown, duplicate or ambiguous tokens.
- Upstream accepts any non-empty alphanumeric nonce and does not impose the initializer's documented 16-lowercase-hex shape. Managed admission
  should enforce the producer's exact shape before projection.
- `ledger-summary.sh` counts lines by textual patterns, enumerates an unbounded filename glob, injects agent names derived from filenames and emits
  the first in-progress phase heading. Thus “no free text” is only approximately true: summary prose/timestamps are excluded, but some workspace
  text still reaches context. A managed path must bound ledger count/bytes, validate names and event schema, and decide whether the attested phase
  heading is acceptable before creating a normalized snapshot/summary.
- The attestation and the plan live in the same workspace trust domain. It is useful as a workflow approval/change detector against accidental or
  unsanctioned plan edits, but it is not cryptographic proof of a separate human principal: a writer able to replace both files can forge a matching
  digest. Managed documentation and outcomes must not overclaim identity or authorization.

### Cache conclusion

The upstream mtime cache is a performance hint, not part of correctness. Its mtime has second-level resolution and non-gated modes may reuse a
cached digest on a path+mtime match. The current private snapshot makes it ephemeral, so the safest Phase 4 route is to compute SHA-256 directly
over the owned captured bytes on every Hook invocation and keep no persistent attestation cache. Gated forced re-hash then adds no distinct Phase 4
value; any future cache requires its own private owner, atomic format, bounded cleanup and same-second replacement tests.

## D3 Host and Cloud reconciliation

### Existing events are sufficient

- Phase 4 context behavior needs no new Host event. Both supported events already call the same owned plan runtime before optional catch-up;
  `SessionStart` covers startup/resume/clear/compact and `UserPromptSubmit` refreshes at each user turn. Mode parsing remains workspace policy,
  not Host ABI.
- Official Codex now documents more events, but registering PreToolUse, PreCompact/PostCompact, Stop or permission/tool events would change the
  product Phase and trusted graph. Their existence is an interface fact only; Phase 4 keeps the installed event set exactly two.
- Multiple matching Hook commands can run concurrently. Keeping one absolute managed adapter avoids a second repository handler and keeps internal
  ordering deterministic (plan capture before catch-up). Phase 4 must remain read-only/idempotent so concurrency with unrelated Host hooks cannot
  corrupt shared workspace state.
- The current request contract already accepts all four documented `SessionStart.source` values. Cloud evidence has observed startup and resume;
  clear/compact remain contract-compatible but Phase 5 owns their lifecycle behavior and dedicated Cloud acceptance.
- `transcript_path` is explicitly non-stable Host data and is relevant only to catch-up. Phase 4 must not couple plan mode/attestation authority to
  transcript discovery, session-store fallback or undocumented transcript records.

### Opt-in authority and upgrade surprise

- Passing upstream `PWF_INJECT=smart` through the managed child is a poor primary authority: Cloud environment variables can span setup and agent
  phases and apply broadly, while the current minimal child environment intentionally strips ambient variables. A per-plan marker is narrower and
  survives Fresh/Resume in an inspectable form.
- Simply beginning to honor existing `.mode` is not safely opt-in. v0.3.5 deliberately ignores it, so a workspace may already contain stale
  `autonomous`, `gate` or `inject-smart` tokens created by the pristine Skill. An upgrade that suddenly activates them would change behavior without
  fresh consent even though legacy is nominally the default.
- Recommended admission rule: require a new exact token such as `codex-managed-v1` in the same bounded `.mode` file before any managed smart or
  autonomous behavior is recognized. The owned parser validates the full token set, then projects only the sanitized upstream tokens into the
  private snapshot. Existing upstream-only markers remain managed legacy.
- This versioned token is a managed opt-in protocol, not a security secret. It supplies explicit post-upgrade intent and an exact parser version;
  it does not prove which human/process wrote it. Its lifecycle owner is the plan-context request/policy contract, with review on the next mode
  protocol rotation and retirement only after all supported installed states have crossed that window.
- `gate` should remain reserved/unsupported in Phase 4. A file containing `codex-managed-v1 autonomous gate` must not silently provide only the
  autonomous half while users may believe hard Stop is active. The owned policy should return a reason-coded unsupported state and canary-only
  output until Phase 8 explicitly admits the completion gate.

### Fresh, Resume and cache implications

- Cloud can restore cached container state and then check out a chat branch/run maintenance. Therefore acceptance must test candidate takeover with
  a pre-existing ignored upstream `.mode`, an explicitly armed managed token, marker removal, branch/plan changes and real Resume—not only a clean
  synthetic call.
- Phase 4 runtime remains read-only, so rollback is primarily code/policy rollback: reinstalling v0.3.5 makes every marker unreachable again and
  must reproduce legacy output without deleting user files. A successor reinstall must re-enable only a still-valid explicit managed token.
- No persistent SHA cache is needed. Fresh/Resume should prove both content and refusal paths directly, plus zero owned snapshot residue after
  success, mismatch, timeout and rollback. Cloud cache reuse must not turn a formerly rejected/stale plan into accepted context.

### D3 boundary conclusion

No-live-Host schema expansion is required for Phase 4. The necessary contract rotation is internal adapter/owned-plan policy and result diagnostics,
plus a versioned per-plan opt-in token. Phase 5–8 can reuse the same owned state reader later, but must add their own event contracts and gates rather
than pre-registering them now.

## D4 architecture options

| Option | Shape | Advantages | Blocking costs / decision |
|---|---|---|---|
| A. Execute upstream scripts in the real plan directory | adapter/child calls injector, attester and ledger tools against workspace | closest to upstream CLI | rejects current trust model: mutable workspace execution/read paths, shell writers, weak grammar/locking, second Host integration risk; `NO_GO` |
| B. Copy raw v3 files into the current private snapshot | extend snapshot allowlist and keep pristine injector | small code delta; preserves renderer | raw mode/nonce/ledger parser gaps and helper fallback cross the boundary; old markers auto-activate; insufficient without owned normalization |
| C. Reimplement the complete renderer/state machine in Python | owned-plan parses and renders every legacy/smart/v3 output | strongest local control | creates a second plan/smart/ledger algorithm and loses pristine output authority; violates adapter/runtime design unless upstream renderer is abandoned through a separate migration; `NO_GO` now |
| D. Owned admission + normalized private snapshot + pristine renderer | owned-plan strictly captures/validates state, writes sanitized snapshot, pristine injector/ledger helper render it | keeps current safe-read/process supervision and canonical semantics; no workspace writes/new Hook | modest v2 protocol and owned-policy work; requires exact profile/refusal design; **recommended** |
| E. Store opt-in/attestation in a separate installer-owned database | managed state outside workspace controls approval | stronger principal separation possible | new persistent state, CLI, migration, Cloud cache and cleanup owner; disproportionate for workflow change detection and conflicts with read-only Phase 4; defer unless threat model requires human identity proof |

### Recommended trusted graph

```text
Codex SessionStart/UserPromptSubmit
  -> one absolute managed adapter
  -> exact plan-context request v2 (capability policy, no workspace-derived mode)
  -> owned-plan v2
       -> safe resolve + safe capture
          task_plan.md, optional progress.md, bounded .mode/.nonce/.attestation,
          bounded admitted ledger-<agent>.jsonl
       -> exact managed opt-in + digest/state validation
       -> private normalized snapshot
          legacy: task + progress
          smart: task + progress + sanitized inject-smart token
          autonomous: task + sanitized mode/nonce/generated matching attestation
                      + normalized ledgers; no raw progress projection
       -> pristine inject-plan.sh -> required pristine ledger-summary.sh when autonomous
  -> exact result v2 validation
  -> canary + safe advisory or verified context (+ independent eligible catch-up)
```

The snapshot's `.attestation` should be generated from the already verified captured digest rather than copying arbitrary whitespace/content. The
owned runtime still compares that digest with the safely read workspace marker first; generation only normalizes renderer input. Likewise `.mode`,
nonce and ledgers are new owned files derived from validated values, never raw copies.

### Ownership and failure split

- Workspace/user owns the proposed mode token, nonce, attestation marker and ledger data. This is workflow state, not installer ownership.
- `owned-plan` owns grammar, bounds, safe capture, digest comparison, effective profile, normalized snapshot and refusal reason.
- Pristine injector owns smart/head rendering, delimiter shape and canonical outer plan text; pristine ledger-summary owns the final normalized
  ledger block only after its inputs have been admitted.
- Adapter owns only Host payload validation, child supervision/result validation and ordered context composition. It does not parse `.mode`.
- Installer/bundle owns executable/contract presence, hashes and modes. Autonomous activation must require `ledger-summary` as an effective
  dependency; missing/drifted helper never permits raw-progress fallback.
- Invalid or unsupported opt-in, missing/invalid nonce, absent/mismatched attestation, unsafe ledger or state race withholds plan-derived content
  and returns a small owned advisory. Child/runtime failure leaves canary available. No recognized managed state may silently downgrade to legacy.

### Scope split across future Phases

- Phase 4 implementation candidate: inactive v2 foundation, then explicit smart/autonomous activation using existing two events.
- Phase 5/6: reuse the owned state reader only if compaction/tool event contracts independently need it; no pre-registration now.
- Phase 7: advisory completion may read normalized plan state but does not inherit ledger writers automatically.
- Phase 8: decide `gate`, Stop contract, counters, stall detection and writer/lock model. Only then can `codex-managed-v1 ... gate` become accepted.
- Phase 9: release only the feature set whose independent gates have passed; no requirement to wait for Phase 5–8 before sealing Phase 4.

## D5 source admission and C2 intersection

### Executable admission

- Recommended Phase 4 adds **no new upstream executable**. Existing pristine `inject-plan.sh`, `ledger-summary.sh` and resolver already form the
  rendering closure; `attest-plan.sh`, `ledger-append.sh`, `phase-status.sh`, init and gate scripts remain outside managed runtime.
- `owned-plan.py` changes materially to implement admission/normalization; the adapter changes only for request/result v2 policy/composition.
- A current single-authority gap must be fixed in bundle v2: `hook_adapter.py` is installed and executed but `install.js` currently prepends it
  outside `runtime-bundle-v1.json` and hashes the package file dynamically. Add it to v2 `local_files`, then remove the installer special case.
  License notice remains installed package documentation, not executable runtime; its manifest integrity edge can stay separate.
- `ledger_summary` becomes a required dependency for the autonomous profile. It stays installed for legacy packages as part of exact source
  inventory, but the owned runtime must preflight it before accepting autonomous state and never allow injector fallback to raw progress.

### Runtime bundle v2 decision

Use exact structural partitions `upstream_files`, `local_files` and `installed_contracts`:

- `upstream_files`: four existing pristine files, one `pristine_sha256`, exact source/package/installed roots, mode and dependency closure;
- `local_files`: adapter, owned-plan and owned-catchup with package/installed path, SHA, mode and direct dependencies;
- `installed_contracts`: all four internal adapter/child ABI schemas—catch-up request/result v1 plus plan request/result v2—so the installed managed
  package is consistently self-describing and doctor verifies their hashes. This closes the unexplained plan-only/catch-up-source-only asymmetry.

The v2 partitions fully express source class, so entry-level `origin` has no independent consumer and should be removed. Also remove
`managed_sha256`, empty `overlay_ids`, `language` and `host_dependencies`: Phase 4 admitted no new interpreter surface, and the last two remain
unchecked declarations rather than prerequisite/dispatch inputs. Human prerequisites stay in DESIGN/README; executable shebang, pinned bytes,
mode and tested dependency closure remain machine evidence. If a future mixed collection or dependency resolver needs these fields, it must add
them through a new schema with a real consumer and lifecycle.

### Other C2 decisions now closed

- Manifest schema 4: exact top-level keys, remove duplicate `skill_version`, retain provenance cross-check, required pristine Skill files and
  bundle/Release/importer/license integrity edges. Once all four internal ABI schemas move into bundle `installed_contracts`, remove the manifest's
  direct catch-up request/result hashes so the same contract bytes are not anchored twice.
- Release artifact v2: contract owns every ZIP entry mode; builder drops `EXECUTABLE_PATHS`; remove ignored `state`, `origin`, `reason` and
  prose `checksum_workflow`; retain exact entries, external asset paths and negative prefixes.
- Runtime bundle/manifest/Release v1 remain immutable in published v0.3.5 source. Candidate uses only its v2/schema-4 set; no dual-loader fallback.
- Historical oracles must discover contract paths from each source snapshot's own manifest, so v0.3.5 continues to validate with v1 while the
  candidate validates with v2.

### Internal plan protocol v2 shape

The request policy should carry trusted adapter capability, not a workspace-derived effective mode:

- `planning_enabled`;
- ordered `allowed_profiles` (`[legacy]` for inactive foundation; later `[legacy, smart, autonomous]` after activation authorization);
- exact `opt_in_protocol=codex-managed-v1`.

`owned-plan` alone resolves the effective profile from safely captured workspace state. Result v2 needs a bounded, adapter-consumed advisory
channel for refusals plus enough exact outcome/effective-profile state to reject impossible combinations. Avoid adding hashes, nonce values,
ledger counts or other diagnostics unless a named adapter/doctor/test consumer changes behavior or acceptance based on them.

### Placement and gate sequence

Do not publish a separate stable contract-only patch. Use one `0.4.0-alpha.*` train but retain two independently reviewed gates:

1. **F1 inactive foundation:** schema-4 manifest, runtime-bundle/release v2, adapter inventory inclusion, four installed ABI contracts, plan protocol
   v2 and hybrid code land with `allowed_profiles=[legacy]`. Golden output, installed behavior and Host event set remain v0.3.5-equivalent.
2. **F2 opt-in activation:** after F1 local/Linux/no-live Cloud PASS, trusted adapter policy permits smart/autonomous. Only a valid
   `codex-managed-v1` marker can leave legacy; gated remains unsupported.
3. **F3 live Cloud acceptance:** explicit marker Fresh/UserPrompt/real Resume, mismatch/refusal/cache/rollback and v0.3.5 takeover.
4. Release/Latest remain later, separately authorized gates.

This sequence combines C2 and Phase 4 where their contracts genuinely intersect without treating foundation PASS as behavior authorization.

### Machine-field lifecycle decisions

| Field / structure | Owner and consumer | Lifecycle / review |
|---|---|---|
| v2 structural partitions | importer + installer acquire/project logic | `PERMANENT_CONTRACT`; review only on bundle schema rotation |
| upstream `pristine_sha256` | importer + installer byte validation | `PERMANENT_CONTRACT` |
| entry `origin` | none after structural partition | `RETIRE_IN_V2`; recover only for behaviorally mixed collection |
| `managed_sha256`, `overlay_ids` | no post-overlay consumer | `RETIRE_IN_V2` |
| `language`, `host_dependencies` | no operational consumer | `RETIRE_IN_V2`; prerequisites move to human docs |
| `installed_contracts` | installer install + doctor drift; on-site ABI audit | `PERMANENT_CONTRACT`; now contains both internal protocol pairs |
| request `allowed_profiles` | trusted adapter producer; owned-plan behavioral consumer | `PERMANENT_V2_POLICY`; changes require activation gate/tests |
| request `opt_in_protocol` | adapter/owned-plan exact grammar agreement | `PERMANENT_UNTIL_PROTOCOL_ROTATION`; review no later than Phase 8 |
| `.mode` token `codex-managed-v1` | workspace producer; owned-plan consumer | `VERSIONED_OPT_IN`; successor token requires migration/rollback design |
| result advisory | owned-plan producer; adapter bounded-context consumer | `PERMANENT_V2_PROTOCOL`; exact reason mapping, no arbitrary child text |

## D6 threat, compatibility and validation matrix

### State admission rules

| Observed workspace state | Managed decision | Content behavior |
|---|---|---|
| `.mode` absent or safe regular file without `codex-managed-v1` | legacy | byte-equivalent v0.3.5 path; upstream-only old tokens ignored |
| `.mode` exists but is symlink, hard link, oversized, invalid UTF-8 or changes during capture | unsafe state | canary + bounded advisory; never downgrade to legacy |
| managed token plus unknown/duplicate/incompatible token | invalid opt-in | canary + bounded advisory; no plan/progress/ledger |
| managed token plus `gate` | unsupported future profile | canary + bounded advisory; no partial autonomous behavior |
| managed smart only | smart | safely captured plan rendered by pristine smart extractor; raw progress remains legacy-shaped |
| managed autonomous with exact nonce and matching attestation | autonomous | attested plan + nonce framing + normalized ledger summary; raw progress not projected |
| managed autonomous with missing/invalid nonce or attestation | incomplete/refused | canary + bounded advisory; no plan-derived content |
| digest mismatch or plan/marker race | tampered/state changed | canary + bounded advisory; no plan-derived content |
| unsafe/malformed/over-budget ledger | autonomous state rejected | no plan-derived content; never fall back to raw progress |
| child/helper missing, stderr, nonzero, timeout or oversize | runtime failure | canary survives; no downgrade or unverified context |

An unsafe `.mode` is different from an ordinary absent/old marker. Treating a present-but-unreadable marker as absent would let an attacker replace
an armed managed marker with a symlink and force legacy raw injection; presence must therefore fail closed even before effective profile is known.

### Proposed bounded grammar

- `.mode`: regular single-link UTF-8 file, at most 256 bytes; whitespace-separated exact tokens from
  `codex-managed-v1`, `inject-smart`, `autonomous`, `gate`; no duplicates. Accepted Phase 4 sets are exactly
  `{codex-managed-v1, inject-smart}` and `{codex-managed-v1, autonomous}` with optional `inject-smart` on autonomous.
- `.nonce`: regular single-link file, at most 64 bytes after capture; normalized content must be exactly 16 lowercase hex characters.
- attestation: regular single-link file, at most 128 bytes; normalized content exactly 64 lowercase hex characters and equal to SHA-256 of captured
  `task_plan.md` bytes. Hash every invocation; no persistent cache.
- ledgers: filenames `ledger-<agent>.jsonl`, agent `[A-Za-z0-9][A-Za-z0-9_-]{0,63}`; at most 32 files, 256 KiB each and 1 MiB total.
  Strict UTF-8 JSONL, at most 10,000 total non-empty lines. Each entry has the upstream seven exact keys; positive bounded integer tick, exact agent
  match, known event, bounded strings/list and valid timestamp. Normalized snapshot lines retain only safe tick/event data needed by the pristine
  summary, eliminating summary/timestamp/files prose before the shell reader runs.
- Plan/progress/output budgets remain current limits unless failing-first tests prove a smaller profile-specific value is needed.

The specific limits are managed safety contracts and must appear once in implementation/schema tests, not be repeated through prose regex across
multiple governance documents.

### Threat conclusions

- **Tamper:** digest mismatch blocks; matching replacement of plan+attestation remains possible in the same workspace trust domain and is explicitly
  outside identity-authentication claims.
- **Nonce/replay:** nonce prevents accidental/static delimiter collision, not a writer who can read it. Reuse across Resume is allowed and not an
  authentication replay; invalid/missing nonce blocks autonomous managed mode.
- **Cache:** no correctness cache in Phase 4. Cloud/container cache cannot supply a digest result because none persists.
- **Race/partial read:** use descriptor-relative no-follow reads and identity checks for every state file; collect a consistent bounded snapshot.
  Any mixed generation that does not independently validate refuses content. Production performs no workspace writes, so partial-write recovery
  belongs to the external producer, not Hook mutation logic.
- **Concurrency:** Hook invocations are read-only, use unique private snapshots and no shared cache/lock. Ledger writers may race upstream, but a
  malformed/inconsistent capture refuses autonomous context; managed runtime does not repair it.
- **Prompt injection:** legacy remains intentionally compatible. Smart has the same trust level as legacy. Autonomous reveals plan only after
  workflow attestation and never injects raw progress/ledger prose; attested plan content itself remains user-approved data, not safe instructions.

### Upgrade and rollback matrix

| Transition | Required result |
|---|---|
| clean candidate, no marker | exact legacy golden output and two-event policy |
| v0.3.5 install with pre-existing upstream `.mode` -> candidate | still legacy; no surprise activation |
| inactive foundation `[legacy]` with valid managed token | still legacy plus no unsafe partial behavior; activation capability demonstrably closed |
| activated candidate + valid smart/autonomous token | only requested profile active; removal returns immediately to legacy |
| activated candidate + token/digest/nonce/ledger tamper | canary/advisory only, zero plan-derived content and zero snapshot residue |
| candidate -> immutable v0.3.5 | v0.3.5 doctor healthy and markers ignored without deletion |
| v0.3.5 -> candidate again | only still-valid versioned marker re-arms; exact digest/state revalidated |
| failed install/contract/unknown key | no backup/write/partial takeover; prior managed bytes unchanged |

### Verification gates

1. **Failing-first unit/seam:** exact mode sets, old-marker compatibility, unsafe file types, missing/mismatched digest, nonce grammar, ledger schema/
   bounds/filenames, no-cache, helper absence, timeout/process cleanup, advisory combinations and impossible result rejection.
2. **Golden parity:** every current legacy fixture byte-identical; smart/autonomous canonical output compared with pinned upstream over normalized
   fixtures; explicit proof raw progress and ledger free text never appear in autonomous output.
3. **Contract/supply chain:** manifest schema 4, bundle/Release v2 exact-key mutation tests, adapter inside bundle, no deferred writers, four installed
   ABI schemas, single hash/mode authorities, historical-oracle path discovery and deterministic ZIP.
4. **Full local:** importer check, `npm test`, Python compile, Node/bootstrap syntax, Git mode and `git diff --check`; Windows POSIX cases honestly skip.
5. **Linux:** complete zero-failure suite, descriptor/race/symlink/hard-link/process-group cases, install/doctor/repair/uninstall and cross-version
   takeover; installed inventory/modes/hashes exact.
6. **No-live Cloud Source/Candidate:** Fresh + real Resume, startup/resume sources, legacy parity, old marker ignored, opt-in profiles, all refusal paths,
   container cache reuse, rollback/reinstall and `SNAPSHOT_LEFTOVERS=0`.
7. **Live opt-in/Release:** separately authorized activation first; later immutable alpha/beta/RC/final bytes, published download, Fresh/Resume/doctor and
   rollback evidence. No local/RC result substitutes for final downloaded assets.

## D7 route freeze

### Decision

`CONDITIONAL_GO_TO_F1_INACTIVE_FOUNDATION`

Phase 4 is architecturally viable without adding Host events, executing workspace scripts, importing deferred upstream writers or weakening the
owned snapshot boundary. The chosen hybrid route preserves pristine rendering while moving opt-in authority, exact grammar, state capture and
failure decisions into the owned runtime.

This conclusion does **not** authorize implementation. F1 may begin only after the maintainer explicitly says to implement the frozen inactive
foundation and the worktree/branch still match the v0.3.5-based `0.4.0-dev` train.

### F1 exact scope when authorized

- failing-first contract/supply-chain/legacy-closure tests;
- manifest schema 4, runtime-bundle v2 and release-artifact v2 as one atomic contract transaction;
- bundle admission of adapter, four installed internal ABI schemas and removal of retired/unconsumed v2 fields described in D5;
- plan request/result v2 plus owned hybrid state code, with trusted `allowed_profiles=[legacy]` so marker files are not read and every current
  legacy output remains byte-equivalent;
- importer/installer/builder/historical-oracle migrations required by those contracts;
- local full regression and Linux/no-live Cloud foundation acceptance designed before any activation.

F1 explicitly excludes a package/Release seal unless separately authorized. A development or alpha identity is frozen only inside the future F1
task plan; the current branch name is not that identity.

### F1 exit conditions before F2 can be proposed

1. exact-v2/schema-4 loaders fail before write for unknown/missing/old fields and preserve prior managed bytes;
2. adapter/runtime/contract/mode inventories have one authority each; no second executable set or v1/v2 active fallback exists;
3. all existing legacy golden, SessionStart/UserPromptSubmit, catch-up, tamper, process/snapshot and installer behavior remains green;
4. `[legacy]` policy proves `.mode`, nonce, attestation and ledger remain unreachable, including unsafe/malicious markers;
5. deterministic candidate ZIP, installed package, doctor, v0.3.5 takeover/rollback and Linux/no-live Cloud foundation gates pass;
6. no production writer, new Hook event, persistent cache, gated token or live opt-in exists.

Only after those conditions and a new maintainer authorization may F2 enable `[legacy, smart, autonomous]`. F2 must start with the D6 marker/refusal
tests and may not absorb Stop/gated behavior. F3 live Cloud, Release sealing/publication and Latest promotion remain subsequent independent gates.

### Closed questions

- `origin`: remove in bundle/Release v2 because structural partitions and real consumers fully express source.
- Deferred upstream writers: remain denied; Phase 4 read-only rendering does not need them.
- Schema placement: install all four internal adapter/child ABI schemas through bundle authority; remove duplicate manifest anchors.
- Host events: remain exactly SessionStart and UserPromptSubmit.
- Attestation claim: workflow change detector only, not identity authentication.
- Cache: none in Phase 4 correctness path.
- Gated mode: reserved for Phase 8 and rejected if paired with the managed Phase 4 token.

### Discovery conclusion

D1–D7 are complete. The next action is not more Discovery and not activation: wait for explicit authorization to open an F1 implementation plan.
If upstream pin, official Host ABI, Cloud lifecycle, accepted baseline or branch state changes first, reopen evidence rather than applying this route
mechanically.
