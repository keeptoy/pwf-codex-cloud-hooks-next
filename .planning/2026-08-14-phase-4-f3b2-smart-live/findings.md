# Findings: Phase 4 F3B2 smart live chain

## Recovered facts

- OpenAI Cloud environment documentation currently states that a task checks out the selected branch or commit SHA before setup and
  agent execution. A resumed cached environment may run maintenance after checkout, so setup and maintenance must both install from the
  same exact runtime source transaction.
- F3B1 already froze the smart validation graph, exact Git relations, read-only production probe and evidence schema. F3B2 is therefore
  a bounded implementation/live gate, not a new architecture Discovery.
- The current `0.4.0-dev` branch is clean and markerless. Its candidate ZIP bytes were already accepted by F3A/F3B1 no-live gates; F3B2
  documentation/planning/tests are outside Release inventory.

## Chosen local topology

```text
R  markerless F3B2 foundation
└─ S_PREP    add only .mode=inject-smart
   └─ S_ARM  add only .pwf-codex-managed=codex-managed-v1
      └─ S_DISARM delete only .pwf-codex-managed
         └─ S_REARM add only .pwf-codex-managed=codex-managed-v1
```

- The primary worktree remains on markerless `0.4.0-dev`.
- The state chain was materialized by checking out dedicated local `validation/*` branches in the primary worktree. Each node was
  committed and relation-checked before moving to its child; the worktree then returned to markerless `0.4.0-dev`. No extra worktree was
  required, and validation state never entered a development-branch commit.
- Later markerless handoff/documentation commits record exact local refs but do not replace the frozen foundation as
  `RUNTIME_SOURCE_HEAD`; validation commits retain their independent `WORKSPACE_LIFECYCLE_HEAD` values.

## Live handoff principle

The maintainer will push exact refs and configure the Cloud environment. Each Cloud task must first prove its expected workspace HEAD,
clean worktree, installed runtime source HEAD and candidate SHA. The model must not mutate the repository. F3B2 cannot become PASS until
all four stage records are obtained from real Host events with final exit codes.

The Cloud tasks do not create planning files. The frozen foundation already contains the active pointer plus the three reviewed plan
records; `S_PREP` adds only `.mode`, and the remaining nodes only add/delete/re-add the activation file. Missing plan state is therefore a
checkout/Hook/resolver failure, not an invitation to initialize a replacement plan. The injected plan body exposes the task title but does
not guarantee that the plan-directory ID is visible, so Host prompt evidence must check visible title/content while a read-only workspace
preflight proves the exact `.active_plan` value. Treating those as separate facts avoids asking the model to infer an invisible plan ID.

The beginner handoff must be operationally self-contained: it carries the six Cloud variables, identical setup/maintenance transaction,
stage-aware workspace preflight, prompts, production probe, doctor/residue checks and exact evidence shape. The single setup/maintenance
block now runs the runtime transaction and then validates the actual workspace HEAD against the frozen four-stage map before the model sees
its first prompt. The first prompt can therefore remain a pure no-tool Host observation, and one final read-only verifier rechecks identity
before proving production profile/doctor/residue. This is a fixed order, not a choice between two preflight placements.

## Materialized local DAG

- `R=b37eea4706fed8d4e764f824eb75a3820f31c9be` remained markerless and validated as repository `legacy`.
- `S_PREP=a39dc66c755ec19bf29504dc0844de995c6cf67c` adds only `.mode` and validates as `smart_prepared`.
- `S_ARM=1058e704d5ab3496ab1a91a414c20c2e8fe58177` is a direct child and adds only `.pwf-codex-managed`; it validates as `smart_armed`.
- `S_DISARM=c9275ba02073adb184cd73550c5b9f54c6f8178c` deletes only the activation file and returns to `smart_prepared`.
- `S_REARM=6dea2225812939f7a5f9893f2ab90782742a264c` adds only the same activation bytes and returns to `smart_armed`.
- The candidate remains 22 entries / 85,533 bytes / SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`.

The markerless foundation also has a frozen local transport ref, `validation/v0.4.0-dev-f3b2-runtime-source`, so Cloud setup does not
need to discover an exact source commit through a moving development branch. All validation refs are intentionally retained for the
maintainer's push and Cloud selection. They must stay frozen during F3B2 and must
not be merged into `0.4.0-dev`. Remote existence, Cloud Fresh/Resume and installed runtime identity remain unproven until the live gate.

## Historical reconciliation

Phase 4.7 now records a bounded `Post-implementation status — F3B2`: local chain/transport materialization is complete, while Cloud live
evidence remains absent. It also records the two implementation refinements above and gives every new ref/state object an owner and
retirement/review condition without duplicating the active plan's exact mutable evidence ledger.

## Resources

- OpenAI Cloud environments: https://learn.chatgpt.com/docs/environments/cloud-environment
- `docs/history/phase-4.7-f3b-live-preflight-discovery.md`
- `docs/v0.4.0-dev-f3-cloud-lifecycle-runbook.md`
- `tests/f3-lifecycle-helpers.js`
