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
- The state chain is created in a disposable local Git worktree and retained only as named `validation/*` refs.
- After the chain is verified, a second markerless documentation commit may record exact local refs. That later dev HEAD is the preferred
  `RUNTIME_SOURCE_HEAD`; validation commits retain their independent `WORKSPACE_LIFECYCLE_HEAD` values.

## Live handoff principle

The maintainer will push exact refs and configure the Cloud environment. Each Cloud task must first prove its expected workspace HEAD,
clean worktree, installed runtime source HEAD and candidate SHA. The model must not mutate the repository. F3B2 cannot become PASS until
all four stage records are obtained from real Host events with final exit codes.

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

## Resources

- OpenAI Cloud environments: https://learn.chatgpt.com/docs/environments/cloud-environment
- `docs/history/phase-4.7-f3b-live-preflight-discovery.md`
- `docs/v0.4.0-dev-f3-cloud-lifecycle-runbook.md`
- `tests/f3-lifecycle-helpers.js`
