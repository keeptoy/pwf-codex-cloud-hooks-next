# Findings: Phase 4 F3B3 autonomous live Discovery

## Initial constraints

- F3B2 has proved the reversible smart profile chain in real Cloud; it does not prove autonomous, tamper, re-attestation or rollback.
- Phase 4.7 and the F3B1 runbook already propose an autonomous DAG and repository-only evidence schema. This Discovery audits and
  refines that proposal; it does not restart the Phase 4 architecture decision.
- The final F3B3 operator guide must be self-contained for a maintainer, but it must not be written as an exact live document until the
  autonomous validation refs and external candidate identity are frozen by a separately authorized implementation gate.
- Phase 4.8 will own detailed F3B3 Discovery. Phase 4.7 may receive only a minimal subsequent-status link and inheritance summary.

## Recovered stable boundaries

- README documents autonomous as an implemented read-only admission capability, but its blanket pre-F3 live sentence is intentionally not
  a current gate authority. This Discovery must not update README or any Release ZIP input; programme/live status belongs to ROADMAP and
  version acceptance.
- ARCHITECTURE fixes activation-first admission, exact profile-bound token, task/nonce/attestation/ledger revalidation, private snapshot,
  raw-progress exclusion and canary-only refusal. F3B3 may validate these decisions but cannot redesign the trusted graph in this scope.
- F3B2 proved the shared owned boundary for smart only. ARCHITECTURE still correctly classifies real autonomous Cloud activation,
  Resume, cache, tamper and rollback as unproved; F3B3 covers all except rollback.
- DESIGN confirms F3B3 should remain a repository/test/docs gate around the existing `owned-plan.py` seam. Any need to alter runtime,
  contracts or trusted graph is a Discovery stop, not an implementation detail.
- ROADMAP requires a new decision before this critical activation/tamper gate and still marks F3B3/F3B4/F3C unauthorized. The correct
  Discovery output is therefore a conditional implementation decision plus an explicit stop, never a live PASS.
- The earlier ROADMAP note calling the future README change a “status promotion” is conceptually imprecise: the future ZIP-changing task
  should remove README's time-bound F3 sentence and restore status-neutral wording, not copy F3B2/F3B3 status into README. This is outside
  F3B3 Discovery implementation and remains deferred.

## Runtime and evidence audit

- `capture_owned_state()` is activation-first. Without `.pwf-codex-managed`, `.mode`, `.nonce`, `.attestation` and ledgers are not read and
  production remains legacy. With an autonomous activation token, the mode, nonce, scoped task attestation and all admitted ledgers are
  captured and later revalidated together with `task_plan.md`; a mismatch returns a refusal rather than partially rendered context.
- Autonomous rendering deliberately omits raw `progress.md`. The owned runtime writes only the task, exact autonomous state and normalized
  ledgers into a private root-shaped snapshot before invoking the pristine injector.
- Zero ledgers are a supported autonomous state, not an incomplete fixture. In the private snapshot `ledger-summary.sh` still emits a fixed
  `=== RUN LEDGER ===` block with `entries: 0`, phase counts and the active phase. F3B3 must prove this honest zero-ledger shape and must not
  invent a ledger writer or synthetic ledger merely to make the live test look busier.
- `validateF3EvidenceRecord()` validates exact record shape and stage/profile relations. It does not establish which Cloud task produced a
  `startup` or `resume` observation. The operator protocol must retain raw Host/probe evidence and require deliberate real Resume at the
  two activated checkpoints; structural validation cannot self-certify lifecycle provenance.
- The tampered record is intentionally different from every clean lifecycle record: `worktree=tamper_only`, `hook_context=canary_only`,
  `effective_profile=null`, `advisory=state_unsafe`. It therefore needs a dedicated disposable verifier instead of weakening the normal
  clean-worktree preflight.

## Materialization decision

- F3B2's frozen source ref already contains the F3B2 plan, and its `S_PREP` child truly adds only `.mode`. Reusing that same workspace
  commit as F3B3's direct `A_PREP` parent would either reuse the wrong smart plan or mix new plan creation into preparation. F3B3 must first
  create a new markerless `A_BASE` containing its own autonomous-live plan; `A_PREP` can then remain an exact three-path state commit.
- The runtime/candidate behavior remains the already accepted markerless implementation and the candidate bytes remain unchanged, but the
  next materialization gate must freeze a new exact runtime-source transport ref at `A_BASE`. This preserves the two-identity model without
  pretending sequential smart and autonomous plan lifecycles used the same workspace commit.
- The autonomous live sequence needs six evidence records: prepared, armed, tampered, disarmed, reprepared and rearmed. Tampered retains
  `A_ARM` as its workspace HEAD and records `worktree=tamper_only`; it never receives a Git identity of its own.
- F3B3 should not invoke upstream `init-session.sh --autonomous` as its acceptance writer: that broader initializer also creates gated state
  such as `.stop_blocks` and permits its auto-attest subprocess to fail without aborting init. The exact runbook materializer plus read-back
  and production admission is narrower. No additional pristine runtime file is needed for this live gate.
