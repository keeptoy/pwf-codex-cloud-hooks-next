# Findings: Phase 4 F2B autonomous activation Discovery

## Entry facts

- F2A implementation and Source/Candidate/no-live Cloud acceptance are complete; F2B/F3 remain unimplemented.
- F2A already provides an independent non-secret plan-local activation commit point and exact smart profile admission.
- F2B candidate scope from ROADMAP is attestation + exact nonce + normalized ledger; invalid/incomplete state must refuse rather than
  fall back to legacy, and raw progress must not bypass the normalized ledger.

## Official Codex authorization surface (2026-08-13 review)

- Official OpenAI documentation separates sandbox capability from approval policy. Local CLI/IDE can stop and ask before actions,
  while Cloud runs an agent loop inside an isolated container and exposes review/follow-up/PR after the task.
- Cloud setup and agent are separate phases. Secrets exist only during setup; environment variables can span the chat, but neither is
  automatically an exact plan-local user consent bound to repository, commit, plan and state.
- The reviewed official pages do not establish an in-task consent callback suitable for this protocol. This is an evidence gap, not
  a claim that OpenAI can never add such an ABI.
- Therefore local approval may authorize a user-side writer command, but cannot be serialized or inferred as Cloud opt-in state.

Official evidence:

- https://learn.chatgpt.com/docs/agent-approvals-security
- https://learn.chatgpt.com/docs/cloud
- https://learn.chatgpt.com/docs/environments/cloud-environment

## Working hypothesis

F2B must separate two questions:

1. Can owned runtime safely consume already-prepared autonomous state?
2. Can each supported surface provide a trustworthy, explicit producer/consent flow?

If (1) is feasible but Cloud (2) is not, the safe fallback is an inactive, fail-closed interface with no production activation claim.
It must have an owner, entry condition and retirement/review trigger; a vague placeholder field or reachable half-mode is not acceptable.

## D1 current and upstream inventory

- Current request/result v2 already reserves the relational sequence `[legacy, smart, autonomous]` and the result enum
  `effective_profile=autonomous`. The adapter only produces `[legacy, smart]`; `owned-plan.py` supports only those two and rejects
  `autonomous`/`gate` before state admission. This is a strict unreachable seam, not half-active behavior.
- F2A established one state capture/admission authority and post-render identity revalidation. F2B can extend that boundary, but must
  not allow the pristine injector to reopen raw workspace paths or inherit its cache.
- Pinned `inject-plan.sh` treats autonomous as: mandatory attestation, optional nonce framing, and structured ledger summary instead
  of raw progress. Its upstream parser uses substring mode matching, broad alphanumeric nonce admission and a raw-progress fallback
  when `ledger-summary.sh` is absent; those are incompatible with managed exact/no-downgrade rules.
- Pinned `ledger-summary.sh` is read-only and installed, but it parses an unbounded filename glob and extracts agent names, events and
  an in-progress heading from workspace-controlled data. F2B requires an owned bounded normalization step before projection.
- Writer scripts (`init-session.sh`, `attest-plan.sh`, `ledger-append.sh`, `phase-status.sh`) are intentionally absent from current
  source/install inventory and even the compact test fixture. Prior pinned-archive audit established that they mutate workspace and
  use ordinary shell paths/best-effort locks. Their absence remains denied-source evidence, not a missing dependency to import.
- Autonomous's upstream benefit of suppressing per-tool recitation is irrelevant here: managed policy already registers only
  SessionStart/UserPromptSubmit. F2B's possible value is attested/structured turn-start context, not fewer Hook invocations.

## D1 preliminary authority split

| Concern | Safe candidate owner | Unsafe shortcut |
|---|---|---|
| user intent / activation | existing `.pwf-codex-managed`, written last by an explicit user-side flow | infer from `.mode`, approval policy, env var or setup secret |
| profile | owned exact `.mode` parser | upstream substring `grep` |
| attestation comparison | owned runtime over captured exact plan bytes every invocation | upstream path+mtime cache or child warning text |
| nonce | owned exact parser + sanitized snapshot projection | treat nonce as secret/authentication |
| ledger context | owned bounded file admission and normalized private representation | raw glob or fallback to `progress.md` |
| rendering | pinned pristine injector/helper over private snapshot | run upstream code in real plan directory |
| writers | external user/Skill surface pending separate proof | add writer to managed Hook/runtime trusted graph |

## D2 threat, lifecycle and protocol closure

### Consent must be bound to the profile

The existing exact activation bytes `codex-managed-v1\n` were introduced for F2A smart. Reusing those bytes as permission for
autonomous would silently broaden an earlier decision: changing only `.mode` after smart opt-in could enable nonce, attestation and
ledger behavior without a new final commit point.

The smallest compatible correction is to keep the existing token **smart-only** and reserve a second exact form in the same file:

| Exact activation bytes | Authorized profile | Meaning |
|---|---|---|
| `codex-managed-v1\n` | smart only | existing F2A behavior; never authorizes autonomous |
| `codex-managed-v1 autonomous\n` | autonomous only | proposed F2B profile-bound commit point; must be written last |

This treats `codex-managed-v1` as the already-reserved protocol family while binding the new consent to one profile. It avoids a
new state file and does not require request/result schema rotation: request v2 already names that protocol family and reserves the
ordered autonomous capability. The exact new bytes are an implementation input, not active behavior until a separate F2B gate.

The state order is: prepare exact `.mode=autonomous\n`, nonce, attestation and bounded ledger set; verify them; then atomically write
the autonomous activation form. Removing the activation file disarms all managed profiles. A recognized activation token with a
missing, mismatched or unsafe dependent file is an armed refusal and must never fall back to legacy or smart.

### Attestation and nonce are integrity inputs, not identity

- Attestation is exact lowercase SHA-256 of the exact captured `task_plan.md` bytes. It detects drift between producer and consumer;
  because the files share one workspace trust domain, it does not prove a human identity.
- Nonce is an exact 16-character lowercase hexadecimal framing value. It reduces accidental delimiter collision; it is not a secret,
  session credential or replay-proof authorization.
- Both are re-read/revalidated after rendering. No path+mtime or persistent digest cache participates in correctness.
- The pristine child sees only an owned private snapshot. It never receives a path to the live plan directory.

### Ledger admission and no-downgrade behavior

F2B may admit zero through 32 `ledger-<agent>.jsonl` files. Zero is a valid normalized empty ledger, not permission to use raw
`progress.md`. Non-empty input uses the bounds already frozen by the first Phase 4 Discovery: safe regular files, exact agent-name
grammar, strict UTF-8 JSONL, bounded per-file/aggregate bytes and lines, exact key/type validation, deterministic ordering and
post-render identity/enumeration revalidation.

Owned runtime projects only a sanitized private ledger representation to the pristine helper. It does not project raw progress for
autonomous and does not trust the helper's broad glob or parsing as admission. Missing/unsafe/mutated/over-budget state maps to the
existing bounded v2 refusal vocabulary (`state_incomplete`, `state_unsafe`, `state_changed`, `state_over_budget`); raw filenames,
events or content do not enter diagnostics.

### Capture ordering

No-plan and planning-disabled requests retain their zero-read boundary. Once a plan is resolved, the candidate order is:

1. safely capture required task bytes and identity;
2. capture activation and exact mode;
3. for autonomous only, capture/validate nonce, attestation and ledger set without reading raw progress;
4. build the private snapshot, render through the pinned pristine scripts, then revalidate task and all admitted state;
5. validate the result against the original ordered request capability.

This extends the single F2A admission authority; it does not add a second parser, Hook event, persistent cache or writer.

## D3 surface and option analysis

### Local and Cloud are different consent surfaces

Local CLI can stop for an approval or let the user run a state-producing command in a separate terminal. Cloud documentation instead
establishes an isolated task, a result/diff review and follow-up workflow. It does not establish an authenticated in-task callback
that can be bound to this exact repository, plan and state.

F3 must test two ordered hypotheses rather than assume one Cloud flow:

1. **Preferred — Git-backed two-stage activation.** A preparation commit/PR contains mode/nonce/attestation/ledger but no activation;
   after user review/merge, a second independently reviewed commit/PR adds only the profile-bound activation; a new task starts from
   that exact activated commit. This uses documented checkout/diff/PR primitives and does not depend on uncommitted cache continuity.
2. **Fallback — same-chat review + follow-up.** A prepare task leaves an inspectable diff; an explicit follow-up writes activation last;
   later Hook invocations must prove the exact HEAD/plan/state and survive cache hit/miss, maintenance, Fresh and Resume. Official docs
   support review/follow-up and bounded caching, but do not promise an atomic uncommitted-state consent ABI.

Both are workflow consent, not cryptographic identity. The preferred route stops if the target repository cannot safely track the
plan-local state; the fallback stops on any worktree/cache ambiguity. If both fail, F2B Cloud activation is `NO_GO/defer`. No link-click
service, setup secret, chat-wide environment variable or inferred local approval is an acceptable third fallback.

### Options

| Option | Benefit | Cost / failure | Decision |
|---|---|---|---|
| Implement autonomous consumer and activate in production immediately | shortest path | silently assumes Cloud consent/lifecycle and weakens the Phase 4 gate split | reject |
| Add a large unreachable F2B implementation now | creates a future probe target | leaves unconsumed security code and a new lifecycle burden; current seam already exists | reject |
| Implement one read-only F2B transaction after explicit authorization, then test Git-backed activation first and same-chat follow-up second in F3 | validates the real consumer without admitting managed writers; failures remain attributable | requires exact state/race tests and may still fail Cloud lifecycle | conditional recommendation |
| Defer/NO_GO and retain only the current schema capability plus production refusal | no new dead code or trusted edge | autonomous remains unavailable | mandatory fallback |

The fallback interface already exists: request/result v2 reserve `autonomous`, adapter capability stops at smart, runtime refuses the
future profile, and relational tests prevent a forged autonomous result. “Leave an interface for later” therefore requires no new
placeholder field, writer or inactive parser. Its lifecycle owner is Phase 4; it must be reviewed at F2B restart or retired when the
managed protocol is replaced.

## D4 conclusion

**`CONDITIONAL_GO_TO_F2B_READ_ONLY_IMPLEMENTATION`**

F2B is technically implementable without changing the hybrid owned-boundary, Host event set, workspace-write boundary or schema-v2
shape. A future implementation gate may proceed only after the maintainer explicitly authorizes the profile-bound activation grammar
and accepts F3's ordered hypotheses: Git-backed two-stage activation first, same-chat review/follow-up second. It must land runtime,
adapter capability, tests, hashes/inventory and current documentation as one coherent candidate transaction, then stop before F3.

This conclusion does not claim Cloud opt-in works. If F3 cannot prove prepare → review → activate-last → later Hook visibility plus
opt-out/re-arm/cache/rollback, autonomous must not enter an accepted Release. The correct fallback is the existing unreachable seam
and refusal guard—not a half-active runtime and not extra tombstone code.

## Implementation-gate minimum matrix

- exact smart token remains smart-only; autonomous requires the new profile-bound token and exact autonomous mode;
- unarmed autonomous-looking state causes zero mode/nonce/attestation/ledger reads;
- missing, symlinked, non-regular, malformed, mismatched, over-budget or changed state refuses with no legacy/raw-progress fallback;
- task digest is computed every invocation over captured bytes; task and admitted state are revalidated after child execution;
- ledger count/name/bytes/lines/JSON keys/types/order are bounded, including a valid zero-ledger case;
- private snapshot contains only normalized autonomous inputs, has restrictive permissions, and is removed on success/failure/timeout;
- ambient `PWF_*`, `HOME`, executable lookup and child output cannot reopen workspace authority or forge the result;
- adapter/runtime ordered capability and relational result validation expand atomically; gate remains denied;
- Windows reports POSIX-only cases honestly; Linux runs them with zero skips; Source/Candidate repeats deterministic ZIP and no-live
  adapter probes; F3 alone owns live Cloud consent/lifecycle and rollback acceptance.

## Lifecycle disposition

| Object / seam | Discovery disposition | Owner / consumer | Review or retirement trigger |
|---|---|---|---|
| existing `codex-managed-v1\n` | keep smart-only | user producer / owned runtime | managed protocol replacement or Phase 4 retirement |
| proposed `codex-managed-v1 autonomous\n` | design-frozen, inactive | future explicit producer / owned runtime | authorize F2B implementation; remove if F2B/F3 is NO_GO |
| autonomous schema enum/capability sequence | keep reserved and unreachable now | adapter/runtime relational contract | F2B restart or protocol replacement |
| nonce/attestation/ledger owned readers | do not add during Discovery | future F2B owned runtime | add only in authorized implementation; otherwise absent |
| upstream writers | keep denied and uninstalled | external pristine Skill/user flow only | separate producer audit or official surface change |
| Git-backed two-stage Cloud consent | preferred, unproven | F3 live acceptance | accept only with two reviewed commit boundaries and exact Fresh/Resume/cache/rollback evidence |
| same-chat follow-up consent | fallback, unproven | F3 live acceptance | test only if Git-backed route is infeasible; retire on state/cache ambiguity |
| external link/callback seam | absent | none | reopen only for an authenticated, bounded official Host ABI |

## Version-train decision

- Both Cloud hypotheses are experiments inside the unpublished `v0.4.0-dev` programme. A failed preferred candidate may be removed
  and replaced by a new `0.4.0-alpha.N`/`beta.N` candidate using the fallback, with all hashes, ZIP, Cloud and rollback gates rerun.
- If both fail, remove autonomous implementation from the candidate and decide separately whether F1/F2A justify smart-only `v0.4.0`.
- After stable `v0.4.0` publication, adding autonomous changes opt-in and user behavior. Under the current ROADMAP it is not a
  compatibility patch and must be scheduled in a later minor programme, not smuggled into `v0.4.1`.
