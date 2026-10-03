# Task Plan: v0.5.1 frozen acceptance-guide retention

## Goal

Implement the maintainer-approved improvement: guides leaving the candidate/accepted window stay at their original
paths with frozen bytes and evidence, while the acceptance README distinguishes current entrypoints from historical
records. Prepare a canonical v0.5.1 candidate and verify its risk classification before any Release/G4 execution.

## Authorization and scope

- The maintainer approved the discussed retention design and asked to create a plan and start implementation.
- Allowed: local planning, governance/template/index edits, boundary tests, canonical v0.5.1 source identity and
  predecessor/bootstrap preparation, a local development branch, local validation and scoped local commits.
- Preserve frozen guide bodies and paths. Previously retired guides need not be restored. New historical records
  are indexed when they leave the current role window; freezing alone does not make an accepted guide historical.
- Keep existing Source/Candidate and Published Release channels, C0/C1/C2 and both retirement review times.
- Keep classifier/policy/projector, runtime, installer, Host ABI, runtime bundle and ZIP inventory unchanged.
- No Cloud execution, C0 freeze, asset sealing, publication, G5 enablement or remote write is authorized by this
  implementation request. An eligible local result permits a concrete G4 handoff, not invented live evidence.

## Current phase

Local implementation and canonical candidate preparation pass validation on branch 0.5.1. Current accepted is
v0.5.0; no guide has yet left that role under the new rule. Exact advisory classification awaits the local candidate
commit; no v0.5.1 Release guide is created before Release entry approval.

## Next Step

Implement and verify the retention rule and bounded historical-guide registry, then prepare the canonical v0.5.1
candidate and obtain an exact V3 classification against accepted closeout d4dd150dea205951090b2b5c56fe140a80bebc91.
Stop after a validated local implementation handoff before any Cloud/Release/G4 execution.

## Phases

1. [x] Recover relevant authorities, current guide evidence, identity closure and test dependencies.
2. [x] Define current-entrypoint versus frozen-history discovery, original-path preservation and immutable replay.
3. [x] Add meaningful positive/negative retention tests and implement governance/template/index changes.
4. [x] Prepare v0.5.1 identity closure with exact accepted predecessor and zero-hash candidate bootstrap.
5. [ ] Run focused/full local checks, deterministic ZIP/bootstrap checks and risk advisory.
6. [ ] Commit scoped results and report G4 admission, limits and maintainer handoff.

## Exit conditions

- Acceptance README explains current and historical guides in plain language, lists retained records and owns only
  navigation/retention metadata; ROADMAP still uniquely owns versions/roles/authorization.
- Historical entries bind original paths, immutable freeze commits and unchanged SHA-256; unknown, duplicate,
  missing, altered or falsely historical guides fail validation instead of relaxing the docs inventory globally.
- Historical relative links do not silently select today's protocol for replay; replay uses the recorded frozen
  source snapshot. Current links remain valid.
- Current candidate/accepted entrypoint uniqueness remains enforced; archives do not become current oracles,
  bootstraps, installed runtime or Release ZIP inputs.
- Both retirement reviews persist; guide retention is an object KEEP decision with controlled inventory.
- New candidate's canonical identity closure is complete, unknowns are empty and lane is RELEASE_MECHANICS or
  PACKAGE_DOC_ONLY; otherwise report the actual result and stop G4 admission without changing risk policy.
- Current frozen guides and v0.5.0 public identities remain byte-identical. Local tests pass, with honest Windows
  skips and all Linux/live evidence left for the separately authorized workflow.

## Stop conditions

- Stop on frozen-byte drift, unresolved references or overlapping user changes.
- Stop if implementation needs a runtime/installer/classifier/policy/projector change or alters retirement timing.
- Stop G4 admission on PRODUCT_OR_SECURITY, unknowns or incomplete canonical identity closure.
- Stop before Cloud, C0, non-zero sealing, publication, Latest, G5 or remote mutation.

## Errors

| Error | Resolution |
|---|---|
| Normal Node runner could not spawn inside the Windows sandbox (EPERM). | Use the bounded approved outside-sandbox test command, as recorded by the environment profile. |
| One multi-file patch used a partial ROADMAP line and failed context verification. | The patch made no changes; reapply with exact full context and stable current-train anchor. |
| First governance regression passed 48/49; a legacy proximity regex assumed freeze-ref prose stayed within 180 characters of role exit. | Scope the check to the owning lifecycle section while preserving the immutable-reference requirement. |
| First full regression passed 195 with 26 Windows skips and 3 governance failures. | Add bounded 0.5.x series admission to the Phase-route validator; use the existing exact CHANGELOG heading format and explain Unreleased in the section body. |
| Bash syntax probes hit the sandbox's Win32 signal-pipe error 5. | Rerun the same two syntax-only probes outside the sandbox; both returned exit 0. |
