# Findings: Phase 4 F1B Inactive Runtime Foundation

## Frozen boundaries

- Entry baseline is clean local commit `b9492e8`; F1A is complete and the candidate remains `v0.4.0-dev`, zero-hash and unsealed.
- F1B changes the internal adapter/owned-plan ABI and adds inactive state code only. Managed policy remains one adapter and the Host event set remains `SessionStart` plus `UserPromptSubmit`.
- Production must short-circuit on the legacy-only allowed profile before state capture. Existing upstream `.mode`, nonce, attestation or ledger bytes must not affect output after upgrade.
- State reader/normalizer is testable only through a controlled unit seam. F2A is the earliest gate allowed to create a production call edge.
- Published v0.3.5/v0.3.4 source and assets remain immutable; current source must not dual-load historical plan schemas.

## Evidence log

- Current request v1 fixes `policy.behavior_profile=managed_legacy`; owned-plan validates the same constant and all current golden output is built on that path.
- Current managed runtime already installs pristine upstream scripts containing smart/autonomous/gated branches, but private snapshots contain only task/progress, so those branches are unreachable. F1B must preserve this fact by an earlier explicit legacy capability check, not by accidental missing files alone.
- Phase 4.3 froze the key proof: patch state capture/open to fail on invocation and prove both Host events, planning-disabled, no-plan and active-plan legacy paths never call it; forged future profiles must also be non-injecting with zero state read.

## F1B ABI shape recovered from Phase 4.1/4.3

- Plan request v2 keeps the current runtime/event/project/output budgets and replaces `behavior_profile` with exact policy keys `planning_enabled`, ordered `allowed_profiles`, and `opt_in_protocol=codex-managed-v1`.
- The schema may describe the monotonic profile sequences `[legacy]`, `[legacy, smart]`, and `[legacy, smart, autonomous]`, while the F1B adapter and owned runtime capability are both fixed to `[legacy]`.
- Plan result v2 adds `effective_profile` and a bounded advisory code. Normal F1B results use `effective_profile=legacy` and `advisory=null`; a structurally valid forged future profile is rejected before any state capture with no injectable context.
- Catch-up request/result remain v1. F1B rotates only the plan ABI and must not create a historical plan-v1 fallback loader.
- The state reader/normalizer remains a helper inside `runtime/owned-plan.py`, reusing the existing descriptor-relative no-follow, single-link, identity/race and UTF-8 boundaries. No new installed runtime module is needed.
- Legacy output bytes, context ordering and canary semantics are externally unchanged; the ABI version change remains private to adapter/child supervision.

## Implementation decisions

- F1B normalizes only `.mode`. This is the minimum state foundation needed by F2A; nonce, attestation and ledger remain F2B concerns and have no reader in the current tree.
- The mode seam accepts old upstream-only tokens as unarmed legacy state. Once `codex-managed-v1` is present, duplicate/unknown/incomplete sets fail with bounded codes; `gate` is explicitly unsupported. The current production path never calls the seam.
- `safe_read_file` gained caller-selected byte bounds and an oversize outcome so plan files retain their existing 1 MiB/`plan_unreadable` behavior while `.mode` uses 256 bytes/`state_over_budget`.
- The installed-state transition remains the singular accepted v0.3.5 predecessor window. The unpublished F1A checkpoint is deliberately not elevated into a machine compatibility promise.
- Current v1 plan schema paths are removed from source/bundle/Release. Their only non-history occurrence is the exact v0.3.5 predecessor inventory, where those paths are immutable evidence needed for forward takeover.

## Cloud handoff calibration

- The generic Cloud hard-acceptance template is already candidate-driven: it derives the current Release contract, bundle inventory, hashes and entry count instead of freezing F1A values.
- Its Linux Source/Candidate setup runs every non-publication test and requires zero skips, so the F1B descriptor, unsafe-link/race, future-profile refusal and production zero-read proofs are part of the Cloud gate.
- The no-live run must use only `4.1 -> 5.1 -> 6 -> 7 -> 8.1 -> 8.2 -> 9.1`. Published Release sections are inapplicable because `v0.4.0-dev` remains zero-hash, unsealed and unpublished.
- The ref-aware v0.3.5 takeover/tamper/rollback oracle is intentionally excluded from a tagless Source/Candidate checkout. Its completed local result remains prerequisite evidence; the Cloud run must not fabricate refs or relabel that oracle as no-live evidence.
- F1B does not change the B-E black-box prompts because observable Host behavior must remain legacy-equivalent. The incremental acceptance value is Linux zero-skip source proof plus exact installed candidate/deep-check proof.

## First Linux Cloud failure classification

- Source/Candidate setup at `8c26de68c73642c229dc9dabf684d9f89969ea8d` stopped before ZIP build/install: 133 tests, 132 pass, 1 fail, 0 skip. No managed runtime was left behind.
- The failing zero-call test deleted only `task_plan.md` while retaining `.planning/.active_plan`, the selected plan directory and `progress.md`. That is a selected but damaged plan, so production correctly returned fail-closed `plan_unreadable`.
- The test intends to exercise the distinct `no_plan` production path. Use a workspace with no `.planning` directory for that request; do not weaken the expected outcome to `plan_unreadable`.
- Existing resolver tests already cover safe no-plan fallback, and unsafe-input tests independently require missing/linked/non-regular required plan content to remain `plan_unreadable`. The correction changes no production behavior or trusted graph.
