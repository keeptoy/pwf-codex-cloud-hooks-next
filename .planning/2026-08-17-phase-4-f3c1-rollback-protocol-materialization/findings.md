# Findings: Phase 4 F3C1 rollback protocol materialization

## Frozen inputs

- Starting HEAD: `cd2effc` (`docs: audit F3C1 implementation prerequisites`).
- Worktree was clean on `0.4.0-dev`.
- Phase 4.10 route remains: committed disarm → current-owned uninstall → immutable v0.3.5 clean install → current exact
  forward recovery.
- Direct old-over-current downgrade is forbidden; the expected refusal mechanism is the old exact-path allowlist rejecting
  current-only v2/extra entries, not a manifest schema mismatch.

## Findings log

- F3C1 is Release-excluded protocol/no-live materialization. Production, machine contracts, candidate ZIP inputs and frozen
  F3B refs remain unchanged unless a stop condition forces renewed Discovery.
- The new publication-oracle subtest installed current first, snapshotted runtime + requirements + backup inventory, then ran
  immutable v0.3.5 directly over it. v0.3.5 returned `BLOCKED_UNKNOWN_RUNTIME` naming current-only v2/runtime contracts;
  the complete snapshot remained identical and current doctor stayed healthy. This dynamically closes the audit's first gap.
- `validateF3RollbackEvidenceRecord()` now has a separate exact shape instead of extending F3B evidence v1. It requires both
  accepted/current identities, disarm HEAD, absent activation, prepared repository state, actual legacy Hook/profile, installed
  role/version, backup/transition relation, doctor, residue and final exit status.
- Runtime-only revival coverage is deliberately Linux-only: current reads the still-present commit point, immutable v0.3.5
  renders legacy from its private v1 snapshot, then current reads the unchanged token again and reactivates the profile. Windows
  records an honest skip; Linux/no-live must execute both smart and autonomous cases.
- The operator guide uses intermediate checkpoint `12a3590...` as exact protocol/runtime source. That commit already contains the
  helper/tests and builds the frozen candidate; the later guide commit therefore avoids a self-referential HEAD and needs no new ref.
- Programme/acceptance/history now distinguish local materialization from Linux/no-live and real Cloud rollback. F3C2 remains
  unauthorized until the two Linux revival cases execute with zero skips.
- The maintainer then ran operator guide section 3 from a full GitHub clone at exact checkout
  `cdc4a9eba7e7f1f2545723829ed1a6b4c76cb48b`. Both immutable tags resolved to provenance-frozen source commits:
  `v0.3.5` -> `5d01b55890c1da2a5088e2b991b152a9fb1c3f87` and `v0.3.4` ->
  `59a999f705701ec67463649e9424f3d059863c81`.
- The ref-aware Linux/no-live run completed 13/13 tests with zero failures, zero skips and final exit code 0. Both mandatory
  smart and autonomous runtime-only revival cases actually executed. This closes F3C1 without claiming a live rollback.
- An earlier run from a directory that contained old commit objects but lacked the two release tags was a prerequisite failure,
  not a product or test defect. F3C rollback tests intentionally require a ref-aware clone because published tag identity is part
  of the trust evidence.
- The guide originally kept all F3C1/F3C2/F3C3 mechanics in one file but did not state plainly enough that section 3 is the whole
  F3C1 gate while sections 4-9 are mutating live gates. A novice handrail now separates those scopes and gives F3C2's two-stage
  order without changing the frozen transaction.
- Historical `v0.3.5`/`v0.3.4` tags do not contain or supply the current F3C1 test script. Current tests use those refs as immutable
  source locators for `git rev-parse`, `git archive` and `git show`; therefore a full ref-aware clone is a test prerequisite, not
  a workaround or an old-version installation.
- A Fresh Cloud `S_ROLLBACK` attempt proved that setting `PWF_F3C_SKILL_ROOT` does not install the Skill. The first current
  installer correctly failed closed before uninstall/accepted install because `/root/.agents/skills/planning-with-files/SKILL.md`
  was absent. This is an operator-guide prerequisite defect, not an installer/runtime defect.
- The frozen protocol checkpoint bootstrap supports a checksum-verified `skill` command. Running that command and then the
  unchanged transaction succeeded with current candidate SHA unchanged, accepted role/version `0.3.5`, backups `0 -> 3`, and a
  clean workspace. The guide now embeds the same command before the first installer call; bootstrap `all` remains forbidden there.
- A transaction run by the model after its first prompt cannot prove Fresh Host behavior: startup has already occurred before the
  accepted runtime was installed. The guide now makes setup/maintenance-before-first-prompt ordering explicit; such a run remains
  useful diagnostic evidence but requires a new task for formal stage acceptance.
- The accepted `S_ROLLBACK` Fresh report exposed an operator-prompt defect rather than a runtime defect: section 7 asked the model
  to repeat expected HEAD/installed role without supplying those values, so it mislabeled the installed role as "markerless legacy".
  Setup output is not a dependable human interface because setup/maintenance completes before the model starts. Section 7 therefore
  carries an explicit four-stage expected-facts table and a placeholder-based prompt. Section 5 remains the machine checker; the table
  is only its operator-facing frozen projection, while section 8 remains the sole source of actual installed/profile facts.
- The independent `S_RECOVER` task closed the other half of F3C2: current `0.4.0-dev` was restored only after the exact accepted
  predecessor, while the committed smart disarm state remained `smart_prepared`, activation remained absent, and both Host context
  and the v2 production probe remained legacy. Fresh, real Resume, doctor, backup, zero residue, verifier and recovered evidence all
  ended with explicit exit code 0. Smart rollback/recovery is therefore complete without granting F3C3 autonomous live.
- F3C3 preflight resolved both local and origin-tracking autonomous disarm refs to
  `98b6f138497af244563541ec655a1111198f0c36`. Its active plan is the expected autonomous materialization scope; exact tree audit
  proved `.mode=autonomous`, a valid 16-hex nonce, attestation equal to the task bytes, absent activation and zero ledger files.
  This is the intended `autonomous_prepared` state, not an armed or damaged residue.
- Current source still resolves the frozen protocol checkpoint and accepted `v0.3.5` source exactly. Importer check passed; two
  independent current builds remained 22 entries / 85,533 bytes with SHA-256 `df600104...`, matching the operator guide. The
  accepted ZIP SHA `7d351cfe...` and source `5d01b558...` still agree across provenance and the guide. A-stage mappings and the
  evidence helper both require autonomous-prepared + legacy, with accepted/current roles separated by rollback/recovered stage.
- Focused protocol/publication/autonomous/governance regression passed 24/26 with zero failures and only the two expected Windows
  Linux-only revival skips already closed by F3C1's ref-aware Linux run. No new schema, transaction, Host ABI or trusted-graph gap was
  found. F3C3 therefore needs no new Discovery or production change; it may reuse the frozen operator guide, but `A_ROLLBACK` remains
  a separately authorized Cloud action and must stop for evidence review before `A_RECOVER`.
- The shared operator guide already had all four machine mappings and one transaction, but only F3C2 had a novice walkthrough.
  F3C3 does not need a second transaction or evidence schema: its incremental proof is that committed `.mode/.nonce/.attestation`
  plus zero-ledger prepared state remain inert while activation is absent, under both accepted rollback and exact-current recovery.
- Autonomous leakage must be checked as content, not inferred from `effective_profile=legacy`. Fresh/Resume prompts and the production
  verifier now reject nonce delimiter, `Plan-SHA256`, ledger headers and `entries: 0`; this makes “old runtime did not ingest prepared
  state” and “current did not revive autonomous” independently visible.
- The guide introduction still carried its original pre-live “sections 4-9 not run” wording even though dated F3C2 evidence now exists.
  The introduction is now lifecycle-neutral and routes current progress to dated status, ROADMAP and the active plan; historical
  pre-run/post-run records remain intact as time-scoped evidence.
- Maintainer-run `A_ROLLBACK` closed the accepted half of F3C3 without a production change. Exact autonomous disarm state remained
  `autonomous_prepared` with activation absent while immutable v0.3.5 emitted only legacy context; nonce delimiter, Plan SHA and all
  ledger renderer markers were absent in the replacement Fresh task, its real Resume and the production verifier.
- The accepted v1 result has no `effective_profile` field. The legacy conclusion is therefore the normalized combination of exact
  accepted role/version, managed-legacy v1 request and legacy delimiter/progress assertions, not a field inferred from the stage name.
- `A_ROLLBACK` evidence passed with doctor healthy, backup verified, zero snapshot residue and explicit verifier/validator exit code 0.
  This does not prove current recovery: `A_RECOVER` remains a separate fresh task and authorization gate.
- `A_ROLLBACK` also exposed a repeatable operator-compliance gap: the main Fresh/Resume prompts already named all ledger markers, but
  the Cloud model omitted them from its first reports. This is not a runtime or schema defect. The least invasive repair is an optional
  same-task, no-tool follow-up that must report `UNKNOWN` when prior Host text cannot be verified; the original report remains evidence.
- Independent `A_RECOVER` closed the current half of F3C3: exact current `0.4.0-dev` was restored only through the accepted predecessor,
  while autonomous prepared state remained disarmed and production stayed legacy. Fresh/Resume and the v2 probe exposed no nonce,
  Plan-SHA or ledger renderer; doctor, backup, worktree and residue checks all passed.
- The rollback and recovered records share exact source/candidate/accepted/disarm identities but preserve distinct stage, installed role
  and transition fields. Together they close F3C3 without aggregating all F3C evidence or authorizing validation-ref retirement; that is
  the separate F3C4 responsibility.
