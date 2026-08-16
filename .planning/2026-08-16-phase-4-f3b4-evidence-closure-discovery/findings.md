# Findings: Phase 4 F3B4 evidence closure Discovery

## Starting position

- F3B2 smart Cloud live and F3B3 autonomous Cloud live have separately passed their frozen operator protocols.
- F3B4 is not another feature gate. It must decide whether those two evidence sets form one auditable, non-conflicting lifecycle proof and what must remain until F3C/Phase 9.
- This file records discovery evidence and trade-offs; implementation status remains controlled by `task_plan.md`.

## Open questions

1. Are all ten accepted stage records tied to exact runtime source, candidate and validation commits without ref drift?
2. Does the current development tree remain markerless and free of temporary lifecycle state or duplicate authority?
3. Is opaque Cloud task identity required, available and trustworthy, or should v1 evidence remain bounded to exported Git/Host/probe facts?
4. Which refs and records must survive F3C and Phase 9, and what exact event permits later retirement?

## Evidence and ref reconciliation

- F3B2 has one runtime-source ref and four smart lifecycle refs; F3B3 has one runtime-source ref and five autonomous lifecycle refs.
  Local refs and all matching remote-tracking refs point to the exact commits frozen in their operator guides.
- Every child relation and changed path matches the protocol. Smart preparation adds only `.mode`; arm/rearm add only activation and
  disarm removes only activation. Autonomous preparation adds mode/nonce/attestation; arm/rearm add only activation; disarm removes it;
  reprepare changes only task/nonce/attestation.
- No tamper ref exists. The tampered record correctly retains the original armed HEAD and a disposable dirty-worktree fact.
- Exact Git blob hashing reproduced the frozen smart task SHA and both autonomous task SHA values.
- F3B3 runtime source descends from the F3B2 runtime source. Their diff contains only Release-excluded planning/docs/governance paths;
  the production and Release-input subset is identical, explaining the shared candidate SHA without conflating the two source identities.

## Residue and authority findings

- The new active Discovery scope is admitted as `legacy`; the current tree contains no profile, activation, nonce, attestation, ledger or
  stop-block state.
- No repository-local Cloud ZIP, private snapshot, cache, evidence JSON or temporary lifecycle file was found. The pinned upstream Skill's
  `cache-safe-diagram.md` filename is source documentation, not runtime residue.
- Runtime/install inventory remains solely owned by runtime bundle v2. Evidence summaries are not a file inventory or machine contract.
- Existing v1 evidence JSON was execution-scoped and disposable. The repository retains its accepted facts in version acceptance and
  operator/history summaries, not as ten new JSON authorities.

## Cloud task identity decision

- The accepted transcripts did not export a stable opaque platform Cloud task ID, and evidence v1 intentionally has no such field.
- Do not infer or fabricate one. The auditable task identity is the tuple of profile/stage, exact runtime source, candidate SHA, workspace
  HEAD, plan ID, Host/probe observations and final exit status.
- If a future official ABI exports stable task IDs, treat them as auxiliary provenance in a separately discovered evidence version.

## Retention decision

- Keep both runtime-source refs and all nine positive lifecycle refs unchanged through F3C and the current 0.4.0 Phase 9 instance.
- Keep tamper ref absent; keep the negative fact only in immutable human evidence.
- Ref names may be reviewed for manual retirement only after F3C PASS, the current train's Phase 9 instance, recoverability from immutable
  acceptance/tag evidence and explicit maintainer approval. This is not an automatic deletion deadline.

## Discovery conclusion

The safe next gate is a Release-excluded docs/planning/tests closure that aggregates the already accepted evidence and then stops before
F3C. It requires no new Cloud or production/schema change and must not clean refs.

`CONDITIONAL_GO_TO_F3B4_EVIDENCE_CLOSURE / IMPLEMENTATION_NOT_AUTHORIZED / F3C_NOT_AUTHORIZED`
