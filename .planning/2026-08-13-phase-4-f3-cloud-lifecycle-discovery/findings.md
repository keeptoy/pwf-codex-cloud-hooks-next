# Findings: Phase 4 F3 Cloud lifecycle Discovery

## Entry facts

- F2B read-only autonomous consumer is locally and Linux/Source-Candidate/no-live Cloud accepted from exact candidate bytes.
- No real Cloud prepare/review/activation, Fresh/Resume/cache, disarm/re-arm or rollback lifecycle has been accepted.
- Managed runtime remains workspace read-only; upstream/user-side writers remain outside the installed managed trusted graph.
- F3 Discovery must decide whether a reviewable producer lifecycle exists. It must not infer that parser availability makes the product
  workflow usable.

## Official OpenAI evidence

- Codex Cloud runs tasks in isolated cloud environments, checks out a selected branch or commit, and exposes summary/diff review,
  follow-up requests and PR creation after the result.
- Cloud environment variables exist for the full chat; secrets are setup-only and removed before the agent phase. Neither is an exact
  repository/plan/state consent token.
- Container state may be cached for up to 12 hours for new chats and follow-ups. Cache resume checks out the branch selected for the
  chat and can run maintenance; configuration changes invalidate the cache. This is a performance/lifecycle fact, not a guarantee that
  uncommitted worktree state is a durable authorization boundary.
- The reviewed official pages do not define an authenticated in-task approval callback that binds a human decision to exact
  repository, commit, plan and state bytes.

## Initial implication

Git-backed two-stage activation remains the strongest hypothesis because committed state is reviewable and reconstructible from an
exact checkout. Same-chat follow-up remains a fallback hypothesis and must fail closed on any ambiguous HEAD/worktree/cache continuity.
Environment variables, secrets, local approval prompts and an invented click link remain rejected substitutes.

## Producer and repository-governance evidence

- The currently inspected pristine `init-session.sh --autonomous` is not an atomic F3 producer: it writes nonce and mode before
  invoking the attestation helper, and it deliberately swallows attestation failure. It can therefore leave a prepared-looking but
  incomplete state. The consumer rejects that state, but F3 must not present this command as a successful activation transaction.
- The pristine attestation helper itself uses temporary-file plus atomic rename and read-back verification. That is useful for one
  field, but it does not make the whole mode/nonce/attestation/activation lifecycle atomic.
- The locally installed pristine Skill does not expose the complete ledger helper surface described by historical upstream prose.
  The manifest-pinned full v3.8.2 archive does contain those helpers, and the bootstrap copies that exact archive subtree, but the
  installer/doctor only revalidates the smaller `required_skill_files` set. A live gate that invokes a producer must therefore verify
  that producer's exact pinned bytes immediately before use; parser availability alone is not producer admission.
- `.gitignore` does not hide plan-local machine state. However, the repository-boundary test currently admits only
  `task_plan.md`, `findings.md`, and `progress.md` below each planning scope. A Git-backed state route therefore needs an explicit,
  narrowly governed repository-admission change; silently bypassing that test would weaken the cleanup boundary.

## Early lifecycle risk

- Runtime rollback and workspace opt-out are separate operations. A rollback to a legacy runtime may merely make an autonomous
  activation file inert; upgrading again can make that old opt-in live again. F3 must test and document disarm-before-rollback (or an
  equivalent exact workspace-state rollback), otherwise it has a dormant-activation resurrection gap.

## Route decision

### Accepted hypothesis: Git-backed two-stage state

The preferred route remains viable, but only after an implementation foundation gate:

1. A preparation commit contains the reviewed plan plus exact mode/nonce/attestation and optional bounded ledger, but no activation.
2. A separate activation commit adds only `.pwf-codex-managed`; its parent is the reviewed preparation commit and task/state bytes are
   unchanged.
3. Fresh Cloud tasks select the exact activated commit. The lifecycle does not depend on an uncommitted worktree or cache survival.
4. Removing activation is a separate committed disarm. Task-plan edits while armed are rejected; changing the execution plan requires
   disarm, a new reviewed attestation preparation, and a new activation-only commit.

This is repository intent, not account identity or cryptographic human identity. The security value comes from exact reviewable Git
bytes plus the consumer's fail-closed relationship checks, not from treating a public token as a credential.

### Deferred fallback: same-chat follow-up

Official Cloud behavior supports review and follow-up, but does not promise uncommitted-state durability across checkout, maintenance,
cache invalidation or container rebuild. Because the Git-backed route can be made explicit, same-chat is not part of the initial F3
acceptance surface. It remains `DEFERRED/EXPERIMENTAL`; any later attempt must be a separate Discovery and cannot weaken exact-commit
requirements.

### Rejected substitutes

- Cloud environment variables and setup secrets are chat/environment configuration, not plan-local consent.
- Model statements, generic agent approval, a generated click link or an external callback without an official authenticated Host ABI
  cannot bind exact repository/commit/plan/state bytes.
- `init-session.sh --autonomous` alone is not an accepted transaction because it can swallow attestation failure and never writes the
  managed activation commit point.

## Gate design

### F3A — Git-backed lifecycle foundation

Scope:

- admit only the exact active-plan machine paths needed by smart/autonomous state while keeping all of `.planning/` outside Release;
- reject machine state in inactive/history scopes, unsafe names, links, unexpected files and activation without complete preparation;
- freeze a source-side prepare/verify procedure that checks exact plan ID, task digest, state bytes, activation absence/presence and Git
  diff shape; keep managed runtime read-only and do not add a writer to installed inventory;
- prefer versioned runbook commands plus the existing production read-only probe; F3A does not presume a new shipped executable. If
  implementation proves a helper is necessary, its distribution, hash admission and retirement need an explicit sub-design before use;
- add a dedicated F3 acceptance runbook/addendum. Do not overload the stable no-live template with unproven live behavior;
- prove local/Linux/no-live regressions and stop. No real activation is allowed in F3A.

Exit: repository governance, producer-byte verification, exact two-commit relation, lifecycle cleanup and test/evidence schema are
executable; full legacy regression and deterministic candidate remain green. This only authorizes asking for F3B.

### F3B — Live smart/autonomous Cloud lifecycle

Run on reviewed exact commits and record source commit, preparation commit, activation commit, plan ID, task digest and profile. It must
prove:

- markerless legacy Fresh baseline;
- smart prepare → activate-only → Fresh/UserPrompt/real Resume → committed disarm → Fresh legacy → re-arm;
- autonomous zero-ledger prepare → activate-only → Fresh/UserPrompt/real Resume, exact nonce framing and no raw progress fallback;
- activation-present incomplete/mutated task state refuses rather than silently returning legacy;
- a task-plan edit requires disarm/re-attest/re-activate and succeeds only after that reviewed cycle;
- separate Fresh tasks produce the same behavior whether a cached environment is reused or rebuilt. If cache reuse is not observable,
  record `NOT_OBSERVABLE`; cache is never a correctness prerequisite;
- doctor remains healthy and private snapshot leftovers remain zero.

The autonomous product contract is therefore a **frozen execution plan while armed**. Mutable prose/plan edits are not silently
re-authorized. Optional ledger producer durability is not claimed by the zero-ledger lifecycle and remains outside Phase 8 writer
ownership.

### F3C — Candidate/rollback lifecycle

F3C starts only after F3B PASS. The supported sequence is workspace disarm commit first, candidate confirmation of legacy behavior,
candidate uninstall/backup, immutable v0.3.5 clean install and Fresh/Resume/doctor, then candidate reinstall on the still-disarmed
workspace and a second legacy confirmation. A later re-arm uses a new explicit activation commit.

The negative resurrection case stays a local/isolated assertion: rolling only the runtime back can leave a dormant activation that a
future candidate understands again. The live runbook must never normalize that unsafe sequence as supported rollback.

## Evidence schema and hard stops

Each live profile run must preserve exact checkout HEAD, plan ID, task digest, preparation HEAD, activation HEAD, activation parent,
worktree status, installed candidate identity, observed Hook markers, final command exit codes, doctor result and snapshot residue.
Stdout fragments without a final exit code remain `INCOMPLETE/UNKNOWN`.

Hard stop on any non-activation change in the activation commit; unexpected worktree mutation; task digest mismatch; inability to select
an exact commit; state outside the active scope; producer hash drift; cache dependence; armed-invalid fallback to legacy; live snapshot
residue; or rollback attempted before committed disarm.

## Lifecycle ledger

| Object / seam | F3 disposition | Owner | Review / retirement trigger |
|---|---|---|---|
| smart/autonomous read-only consumer | `KEEP — PRODUCT-PENDING` | managed owned runtime | F3B/F3C PASS promotes; F3 NO_GO requires pre-Phase-9 retirement or new bounded decision |
| `.pwf-codex-managed` | `KEEP — REVIEWED GIT COMMIT POINT` | user/maintainer Git review | protocol replacement or Phase 4 retirement |
| mode/nonce/attestation prepared state | `KEEP — INERT UNTIL ARMED` | source-side preparation flow | delete with closed plan or protocol replacement; only active scope admitted |
| task plan while autonomous armed | `FROZEN EXECUTION INPUT` | orchestrator/user review | any byte edit forces disarm/re-attest/re-arm |
| `ledger-*.jsonl` | `OPTIONAL / ZERO ALLOWED` | external producer; read-only managed consumer | writer/durability/locking remain Phase 8 Discovery; no F3 persistence claim |
| pristine `init-session.sh` | `REJECT AS WHOLE TRANSACTION` | upstream Skill | upstream makes preparation fail-closed and F3 re-audits exact bytes |
| pristine `attest-plan.sh` | `CONDITIONAL EXTERNAL HELPER` | exact pinned Skill bytes | hash drift or resolution/atomicity change requires re-audit |
| repository planning-state admission | `ADD IN F3A, ACTIVE-SCOPE ONLY` | repository governance | plan closure must disarm/retire state; unexpected inactive-scope state blocks |
| same-chat uncommitted flow | `DEFERRED / NOT ACCEPTED` | none | only separate Discovery with durable official ABI evidence |
| environment/secret/click callback | `DENIED / ABSENT` | none | authenticated bounded official Host ABI appears |
| dormant activation across runtime rollback | `DENIED` | rollback runbook | must disarm before rollback; any resurrection evidence blocks F3C |

## Decision

`CONDITIONAL_GO_TO_F3A_IMPLEMENTATION`.

The condition is deliberate: F2B consumer evidence is strong enough to design F3, but the repository cannot safely enter live
activation until it has exact active-scope state governance, a fail-closed preparation verifier and a dedicated runbook. This conclusion
does not authorize F3A, F3B, F3C, remote writes, live Cloud, rollback execution, seal or publication.
