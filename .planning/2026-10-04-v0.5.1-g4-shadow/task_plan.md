# Task Plan: v0.5.1 / Phase 5.3 G4 shadow

## Goal

Validate the eligible frozen-guide-retention train in G4: execute the current FULL workflow, evaluate the unchanged
V3 advisory against the same actual evidence, and compare omissions, elapsed time and operator effort without
enabling a reduced lane.

## Authorization and scope

- On 2026-10-04 the maintainer reported the implementation pushed and explicitly authorized G4 shadow.
- Local scope: materialize one version-level Release operator guide, freeze a validated exact C0, project the
  machine checklist, run proportionate local validation, preserve evidence and create scoped local commits.
- The first execution handoff is the FULL Source/Candidate channel, run manually by the maintainer in Cloud.
  Both identity channels are required for G4 completion, but publication, public-channel inputs and Latest are
  staged handoffs: stop after the first real PASS/C1 for the maintainer's next explicit direction.
- All remote writes and Cloud UI execution remain maintainer-only. No push, tag, Release, asset upload, deployment,
  reduced-step execution, G5 enablement or planning deletion is authorized for the agent.
- Preserve accepted v0.5.0, fallback v0.4.4 and all published identities. Runtime, installer, classifier/policy/
  projector, runtime bundle, bootstrap template and ZIP inputs remain unchanged from the admitted implementation.

## Current phase

G4 authorized; C0 5c50774e7d7c340942851ff146a993316e7471bc was pushed and observed in Cloud. On 2026-10-04 the
maintainer reported Source/Candidate A setup PASS with final exit 0, portable Linux 215/215 pass, zero fail/skip,
and exact 22-entry / 84,518-byte ZIP SHA matching the local precheck. Actual Node is 22.22.2 and configured major
is 22. Accepted base remains d4dd150dea205951090b2b5c56fe140a80bebc91. B--F, complete Source/Candidate,
Published Release and G4 final result remain pending. Preparation/stage-evidence commits are not C1.

## Next Step

Continue from the accepted A result: in the installed Source/Candidate Cloud environment create the new task
specified by template 5.1, prepend the acceptance-permission text, and run B post-install Resume without tools.
After B, run C/D/E1, UI Resume the same task for E2, then F with the exact C0's template 9.1. Keep C0 unchanged,
PWF_ACCEPTANCE_NODE_MAJOR=22, raw evidence and G4 profile/timing/operator records. Do not rerun setup solely for
this successful result. Hold newer local governance commits until the complete-channel C1 handoff; no publication,
first retirement review or C1 before B--F pass. All remote writes remain maintainer-only.

## Gates

1. [x] Recover G4 exit rules, active authorities, eligible implementation and maintainer authorization.
2. [x] Materialize one guide, non-destructive admission inventory, comparison mapping and measurement rules.
3. [x] Validate local full suite/assets, freeze C0, regenerate and check the advisory projection, hand off.
4. [ ] Maintainer executes FULL Source/Candidate; A setup PASS, B--F pending; then first review/C1.
5. [ ] Separately directed immutable publication and FULL Published Release in an independent Fresh environment.
6. [ ] Reconcile all five evidence dimensions, Host/profile/asset keys, false-fast, elapsed/operator metrics and
       role-window closeout. G4 completion and G5 decision remain distinct.

## Shadow evaluation

- Execute every operative FULL step once; label the evidence shared with the advisory or FULL-only. Do not run
  duplicate installations or actually omit B--E. The advisory is a counterfactual checklist, not an execution mode.
- Record one comparison row per required gate ID, including actual source/channel/stage, raw evidence and outcome.
  All IDs must be covered; a successful FULL run alone does not establish that the advisory is sufficient.
- Record FULL-only failures relevant to retention, materialization, identity, installation or Host behavior as
  advisory omissions/false-fast; unexplained relevance is unresolved, not zero. Prior six-sample replay must still
  report zero false-fast. Installation/runtime observable change invalidates low-risk eligibility.
- Freeze source, base, policy/Release owner fingerprints, predecessor and unchanged production fingerprint before
  Cloud. Record actual OS, Node/Python, CODEX_HOME, skill root, requirements path and managed events in each channel;
  compare profile values but require different environment/task identities. No secrets or account identifiers.
- Cloud Node major is a maintainer-selected input passed through PWF_ACCEPTANCE_NODE_MAJOR and must match in both
  channels; do not infer it from local Node 24 or a prior Cloud image. Missing configuration blocks setup.
- Record start/end UTC and elapsed seconds for A, B, C, D, E1, E2 and F, plus active operator time, UI Resume count,
  human copy/entry fields and handoff count. Separate agent execution, operator time and queue/idle time.
- Counterfactual savings are sums of measured exclusively FULL-only operations; shared suite/installation costs
  stay shared. No measurement means NOT_MEASURED, never zero or a fabricated speedup. G4 cannot PASS with an
  unresolved omission, missing profile/identity or missing timing/operator comparison.

## Exit and stop conditions

- Both exact identity channels pass FULL, all advisory IDs map to evidence, historical/live false-fast is zero,
  profile/asset/predecessor keys agree and timing/operator comparison is complete.
- Identity drift, unsafe delta, unknown, incomplete closure, production/self-change, unhealthy doctor, missing
  final exit code or an unapproved mutation stops the run. An anomaly returns to the stricter FULL Fresh gate;
  never join partial PASS from different identities or repaired runs.
- Stop before publication until explicit direction and actual Source/Candidate PASS/C1 exist. Stop before Latest
  until public PASS and explicit direction. Stop before G5, Phase closeout, remote writes or planning deletion.

## Errors

| Error | Resolution |
|---|---|
| Read-only git ls-remote inside the Windows sandbox hit signal-pipe Win32 error 5. | The approved outside-sandbox query succeeded and bound remote 0.5.1 to d4b4c66; not a product error. |
| rg with a PowerShell directory wildcard reported invalid filename syntax. | Use the explicit existing planning directory; no file change or lost evidence. |
| One identity-writeback patch used partial-line context and failed verification. | No changes were applied; reapply with the complete source line. |

<!-- BEGIN PWF RELEASE EVIDENCE PLAN V1 -->
### Generated Release evidence plan (advisory only)

- Classification: `PWF_RELEASE_RISK_ADVISORY_V3` / `RELEASE_MECHANICS` / `SHADOW_ONLY_NOT_EXECUTION_AUTHORITY`.
- Exact range: `d4dd150dea205951090b2b5c56fe140a80bebc91` → `5c50774e7d7c340942851ff146a993316e7471bc`.
- Owner fingerprints: `RELEASE_ARTIFACT_AUTHORITY:contracts/release-artifact-v2.json@15c2084db70429fb507e18c17433a9cfe23ec18698bdad6006128fc44d34b9ff`, `RELEASE_RISK_POLICY:tools/release-risk-policy-v1.json@2f745461afd21495b78206fd1cb920afd32a96d5d8eb877c098e31681beae8fd`.
- Local evidence: `FULL_REPOSITORY_REGRESSION`, `CHANGED_MECHANIC_NEGATIVES`, `DETERMINISTIC_RELEASE_ASSETS`, `REESTABLISH_INVALIDATED_LOCAL_EVIDENCE`.
- Linux evidence: `PORTABLE_LINUX_SUITE`, `CHANGED_MECHANIC_LINUX_BOUNDARY`.
- Source/Candidate evidence: `EXACT_BUILD_MATERIALIZATION_BOUNDARY`, `OVERRIDE_INSTALL`, `DOCTOR_AND_INVENTORY`, `CHANGED_MECHANIC_TARGETED_CHECKS`.
- Published Release evidence: `PUBLIC_BOOTSTRAP_AND_ZIP_CHECKSUM`, `DEFAULT_DOWNLOAD_AND_INSTALL`, `DOCTOR_AND_DEEP_INVENTORY`, `FRESH_RESUME_IF_INSTALLATION_OR_RUNTIME_OBSERVABLE_CHANGED`.
- Retirement/checkpoint evidence: `CANDIDATE_ADMISSION_PREFLIGHT`, `SOURCE_CANDIDATE_CLOSEOUT_REVIEW_AND_C1`, `LATEST_CONFIRMATION_ROLE_WINDOW_REVIEW_AND_C2`.
- Lifecycle objects: `C0=REQUIRED`, `SOURCE_CANDIDATE=REQUIRED`, `SOURCE_CANDIDATE_CLOSEOUT_RETIREMENT=REQUIRED`, `C1=REQUIRED`, `IMMUTABLE_PUBLICATION=REQUIRED`, `PUBLISHED_RELEASE=REQUIRED`, `LATEST_PROMOTION_CONFIRMATION=REQUIRED`, `ROLE_WINDOW_CLOSEOUT_RETIREMENT=REQUIRED`, `C2=REQUIRED`.
- Evidence invalidated: `LOCAL_TEST_BASELINE`.
- Unknowns: _none_.
- Escalation: `INSTALLATION_OR_RUNTIME_OBSERVABLE_CHANGE_REQUIRES_PRODUCT_OR_SECURITY`, `ANY_UNKNOWN_OR_UNEXPLAINED_EVIDENCE_RESTARTS_AT_PRODUCT_OR_SECURITY`, `HOST_PROFILE_OR_IDENTITY_MISMATCH_STOPS_AND_RESTARTS_FROM_THE_STRICTER_FRESH_GATE`.
- Existing authorities only: `ROADMAP.md#release-four-step-flow`, `ROADMAP.md#version-train-two-retirement-reviews`, `docs/cloud-hard-acceptance-template.md#cloud-hard-acceptance-template`, `docs/cloud-acceptance-operator-guide-template.md#operator-guide-document-lifecycle`.
- Operative workflow: `ROADMAP_CURRENT_FULL_UNTIL_G5`; this generated block records no PASS, executes no gate and grants no authorization.
<!-- END PWF RELEASE EVIDENCE PLAN V1 -->
