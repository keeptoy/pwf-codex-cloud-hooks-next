# Findings: Phase 4 F3B3 autonomous materialization

## Inherited decision

- Phase 4.8 is the detailed design authority: new markerless `A_BASE`, independent autonomous DAG, six Cloud evidence records and one
  disposable tamper task.
- Existing production/runtime and candidate bytes are sufficient. Materialization must stay in docs/planning/tests plus local validation
  refs and must not create a second source authority.
- F3B2 refs/evidence remain immutable accepted smart evidence and are never reused as autonomous state.

## Frozen names

| Role | Local ref |
|---|---|
| runtime source / markerless base | `validation/v0.4.0-dev-f3b3-runtime-source` |
| prepared | `validation/v0.4.0-dev-f3b3-autonomous-prep` |
| armed | `validation/v0.4.0-dev-f3b3-autonomous-arm` |
| disarmed | `validation/v0.4.0-dev-f3b3-autonomous-disarm` |
| reprepared | `validation/v0.4.0-dev-f3b3-autonomous-reprep` |
| rearmed | `validation/v0.4.0-dev-f3b3-autonomous-rearm` |

No tamper ref is allowed.

## Recovered implementation boundaries

- The active plan itself is the future autonomous-live workspace plan. Its markerless commit will be `A_BASE`; validation refs must never
  merge their machine state back into `0.4.0-dev`.
- The runtime-source ref freezes `A_BASE`, while the final development-branch handoff commit may advance with the operator guide and tests.
  Cloud setup must fetch the frozen runtime-source ref, not infer source from a workspace validation HEAD.
- README remains unchanged because it is a Release entry. ROADMAP and the version acceptance may record materialization status, but cannot
  claim live PASS before six real Cloud records close.

## Preflight facts

- All six target local refs were absent before materialization, so no existing evidence ref needs moving or replacing.
- The markerless preflight candidate remains 22 entries, 85,533 bytes and SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`.
- The F3B2 guide provides the proven self-contained transaction/order pattern, but F3B3 needs six records, two mandatory Resume checkpoints,
  exact autonomous context checks and a dedicated tamper-only verifier; copying its four-stage table without these deltas would be unsafe.

## Frozen A_BASE

- `validation/v0.4.0-dev-f3b3-runtime-source` points to markerless commit
  `a6fa03159a442b917f893fc51a7e3ed45b37371a`.
- Repository admission classified the active scope as `legacy` before the commit. The development branch remains markerless after the ref
  was created.

## Frozen autonomous DAG

| Stage | Exact local HEAD | Repository state | Task SHA / nonce role |
|---|---|---|---|
| `A_BASE` | `a6fa03159a442b917f893fc51a7e3ed45b37371a` | `legacy` | markerless source/workspace base |
| `A_PREP` | `d107c1cc53199415cc704553dafeab757060ae9e` | `autonomous_prepared` | initial task / initial nonce |
| `A_ARM` | `f43a744cbac7f7056d4efbf9b5cbd676bc1e4091` | `autonomous_armed` | activation-only child |
| `A_DISARM` | `98b6f138497af244563541ec655a1111198f0c36` | `autonomous_prepared` | deletion-only child |
| `A_REPREP` | `5b20eb749c77dc1ac825202ca783dc7b8d938b58` | `autonomous_prepared` | new task / new nonce / new attestation |
| `A_REARM` | `32b13b018176cd3bbaa15480864bf168754e5f67` | `autonomous_armed` | activation-only child |

- Initial task SHA is `415295db8617e87d8d63b94c891a7e1a1494f63024c96bba0993239564e9b552`; reprepared task SHA is
  `2f5cd2dcb0d5ce69fb000a97550096e1421e1cd6ad5569d570777cb744144878`.
- Initial nonce is `d7d00d0fcb799f3f`; reprepared nonce is `c748f8700d4bfcd3`. Both match exact framing and differ.
- Direct parents, exact path sets, repository states, task/attestation relations, zero ledgers and absence of a tamper ref all passed.
- The disposable local worktree was cleanly removed after evidence capture. Only commits and named local refs remain.

## Frozen operator protocol

- `docs/v0.4.0-dev-f3b3-autonomous-live-operator-guide.md` is self-contained: it includes local ref/candidate preflight,
  maintainer-only push commands, Cloud environment inputs, one identical setup/maintenance transaction, fixed task order, Host prompts,
  normal/tamper verifiers and six evidence records.
- Five positive stage checkouts stay clean. The sixth record is a disposable dirty `A_ARM` checkout whose only change is the exact
  `PWF_F3B3_TAMPER_ONLY` sentinel in `task_plan.md`; it is destroyed rather than repaired or committed.
- Autonomous context acceptance is not inferred from shape: the guide requires exact nonce delimiter, task digest, zero-ledger summary,
  absence of raw progress and, on re-arm, absence of the old nonce/digest. Installed production probe remains profile authority.
- At the materialization checkpoint, programme/history/acceptance recorded repository-only PASS separately from Cloud live
  `NOT_AUTHORIZED`; the post-live sections now supersede current status while preserving that original decision as historical evidence.

## Accepted Cloud evidence

| Record | Workspace HEAD | Actual profile/advisory | Distinguishing evidence |
|---|---|---|---|
| `prepared` | `d107c1cc53199415cc704553dafeab757060ae9e` | `legacy` / `null` | autonomous preparation inert; legacy raw progress visible |
| `armed` | `f43a744cbac7f7056d4efbf9b5cbd676bc1e4091` | `autonomous` / `null` | initial nonce/SHA, zero ledger, Fresh + mandatory Resume |
| `tampered` | `f43a744cbac7f7056d4efbf9b5cbd676bc1e4091` | `null` / `state_unsafe` | one dirty task path, canary-only, no partial context; environment destroyed |
| `disarmed` | `98b6f138497af244563541ec655a1111198f0c36` | `legacy` / `null` | activation removal restores legacy |
| `reprepared` | `5b20eb749c77dc1ac825202ca783dc7b8d938b58` | `legacy` / `null` | new task/nonce/attestation remain inert |
| `rearmed` | `32b13b018176cd3bbaa15480864bf168754e5f67` | `autonomous` / `null` | new nonce/SHA, old identities absent, zero ledger, Fresh + mandatory Resume |

- All six records use runtime source `a6fa03159a442b917f893fc51a7e3ed45b37371a` and candidate
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`; all evidence validators and final verifiers exited 0.
- Every positive worktree was clean, every doctor was healthy, and every snapshot-leftover count was zero. Cache state was honestly
  `unknown` because no reliable hit/miss/reset observation was available.
- The tampered task SHA was `4264555784fb42dd0274f824c57a102bccc29a4f70217f83f2497e18b34a851a`; it is negative evidence only,
  not a commit/ref or source authority.
- Accepted status is `F3B3_AUTONOMOUS_LIVE_PASS / TAMPER_REFUSAL_AND_REATTEST_CONFIRMED / STOP_AND_REVIEW`; it does not authorize F3B4/F3C.
