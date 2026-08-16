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
