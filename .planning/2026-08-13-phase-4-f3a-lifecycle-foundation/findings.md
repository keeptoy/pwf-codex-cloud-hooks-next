# Findings: Phase 4 F3A lifecycle foundation

## Entry facts

- F3 Discovery is complete with `CONDITIONAL_GO_TO_F3A_IMPLEMENTATION`; the maintainer has now authorized only F3A.
- The repository contains an ignored full upstream `planning-with-files-3.8.2/` tree for inspection. Formal source authority remains
  manifest-pinned provenance plus the exact runtime bundle.
- The four current pristine runtime files are the current closed inventory, not a permanent architectural ceiling. F3A does not need
  another managed file; any future addition remains a separate atomic bundle/manifest/Release/trust transaction.
- F2B managed production is already a fail-closed read-only consumer. F3A must govern source-side repository intent without adding a
  workspace writer or duplicating the runtime parser.

## Frozen implementation shape

- Repository governance opens only the `.active_plan` scoped directory and only for exact machine filenames. Historical/inactive
  planning scopes remain exactly the three Markdown records.
- Allowed repository states are markerless legacy, complete smart preparation/armed, or complete scoped autonomous
  preparation/armed. Unknown files, symlinks, partial autonomous state, token/profile mismatch and task digest mismatch fail closed.
- The dedicated runbook uses atomic temporary-file + rename commands for future preparation, then native Git checks and the installed
  read-only `owned-plan.py` probe. It is not a shipped writer and is not part of the Release artifact.
- F3A tests use disposable fixtures only. The real active planning scope stays markerless; no live token is produced.

## Lifecycle ledger

| Object | F3A action | Owner | Review / retirement trigger |
|---|---|---|---|
| active-scope repository admission | ADD | repository governance tests | protocol replacement, plan closure, or F3 NO_GO |
| inactive/history machine state | DENY | repository governance tests | no planned relaxation |
| prepare commands | ADD AS VERSIONED RUNBOOK | maintainer/user-side flow | upstream/protocol change or dedicated producer adoption |
| activation-only relation verifier | ADD AS RUNBOOK + TEST | F3 lifecycle gate | Git model change or official bounded approval ABI |
| managed `owned-plan.py` probe | REUSE | installed owned runtime | request/result or opt-in protocol replacement |
| managed/upstream writer | KEEP DENIED | none | separate producer/Phase 8 Discovery only |
| current four pristine runtime files | KEEP CURRENT INVENTORY | runtime bundle | demand-driven atomic supply-chain gate; not capped at four |
| F3 runbook | PRODUCT-PENDING | F3B/F3C acceptance | retire if lifecycle is NO_GO; promote only after live PASS |

The real active planning scope remains deliberately markerless through F3A. The repository test's exact `legacy` expectation is a
transition guard owned by F3A; an authorized F3B activation commit must update or retire that expectation in the same reviewed
transaction rather than weakening active-scope structural admission.

## Evidence boundary

F3A can prove that the source/repository protocol is executable and rejects unsafe states. It cannot prove that a real Cloud user can
complete Fresh/Resume/disarm/re-arm or that rollback is safe. Those conclusions remain exclusively F3B and F3C.

## Post-implementation reconciliation

- No architecture, permission, trusted-graph or Release-surface drift occurred. F3A stayed repository-only and the candidate bytes
  remained identical to F2B.
- The planned “versioned commands + production probe” became a three-layer implementation: versioned runbook, repository-only JS
  verifier, and installed production probe. This is a bounded implementation refinement, not a second runtime.
- The JS verifier is consumed by both tests and the runbook, so its lifecycle is more accurately `REPOSITORY-ONLY SOURCE VERIFIER`
  than merely `TEST-ONLY`. It must stay outside Release/managed inventory and must not become an implicit long-term product CLI.
- The verifier delegates ledger record semantics to the exact source `owned-plan.py.normalize_ledger`; that call is an internal
  coupling, not a new public API. Refactors must update it atomically or retire it in favor of an equally strong production probe.
- The current repository's exact `legacy` assertion is a deliberate F3A transition guard. F3B preparation must replace it in the same
  reviewed commit with an exact approved-profile prepared/armed closure, so later activation/disarm commits remain commit-point-only.
- Version-specific runbook and acceptance pointers have explicit train-end retirement/migration conditions; Git relation tests and
  inactive/history denial remain while the supported lifecycle exists.

## Linux / Source-Candidate no-live acceptance

- Exact source `90d00de3f643defe566b1457064f46106ac791ae` completed the full no-live Source/Candidate sequence.
- 4.1 exited 0 with 149/149 Linux tests, zero fail/skip, byte-identical 22-entry candidate ZIP (85,533 bytes,
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`) and healthy override installation.
- 9.1 exited 0 with healthy/non-repairable managed doctor, manifest-routed Release/bundle v2, 12 installed files, four pristine
  upstream files, adapter-only policy and zero snapshot residue.
- The maintainer confirmed the complete B–E no-live sequence; only the long raw marker transcript was omitted from the writeback.
- This closes F3A only. It does not establish real prepare/activation/Fresh/Resume/disarm/re-arm or rollback evidence.
