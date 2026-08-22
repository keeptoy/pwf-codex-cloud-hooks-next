# Findings: Phase 9 instance — v0.4.0 Release Discovery

## Initial facts

- Starting branch is `0.4.0-dev`; starting HEAD is `d5102cae392de87812823451c58710f6dabc209b`; worktree is clean.
- Phase 4/F3C4 has produced a functional/candidate baseline and completed its first retirement review. It has not sealed, published or
  promoted `v0.4.0`, and it did not mutate Release inputs or validation refs.
- Current role window is candidate `v0.4.0-dev`, accepted `v0.3.5`, immediate fallback `v0.3.4`.
- ROADMAP defines Phase 9 as a standing per-train Release gate, not Product Phase/version `0.9.0`; this instance is version-scoped to
  `v0.4.0` and future instances require separate evidence.
- `README.md` is a Release ZIP entry. Its final pre-live sentence is known deferred debt: Phase 9 implementation must replace it with
  status-neutral authority routing before seal, rebuild the ZIP and rerun Source/Candidate acceptance. Discovery must not edit it.
- Historical naming will use `phase-9-v0.4.0-release-discovery.md`. Phase 4.11 remains the completed functional closeout and will only
  receive a successor link after this Discovery closes.

## Questions to resolve

- Which Release inputs must change before `0.4.0` seal, and which are intentionally stable?
- Which current acceptance results describe behavior independent of bytes, and which must be rerun after any ZIP-input change?
- What is the exact owner/sequence for candidate validation, seal, publication audit, public download validation, promotion and postflight?
- What proof is required before rotating accepted/fallback roles and reviewing validation refs?

## Stable-document audit — first pass

- README correctly declares that current programme/Cloud/Release state belongs to ROADMAP and version acceptance, but lines 117～119
  still say Cloud prepare/Fresh/Resume/opt-out/re-arm “尚需 F3 live gate”. This is the known final README state coupling and is now
  factually stale after F3B/F3C PASS.
- The durable replacement must not copy `F3B2/F3C PASS` into README. It should state that activation files and production probes prove
  state admission only; Cloud lifecycle and Release conclusions remain version-scoped authorities.
- ARCHITECTURE is also not fully stabilized to the Phase 4 result: section 5.1 still says cross-candidate rollback belongs to a future
  F3C gate, and section 12 lists autonomous disarm-first/cross-candidate rollback as “尚未实现”. These are system-status claims, not
  merely historical narrative.
- Phase 9 pre-seal cleanup must therefore audit every Release-input stable document, not patch README alone. Architecture updates must
  preserve enduring invariants (disarm-first, activation absence, immutable accepted install, exact-current recovery) without copying
  transient PASS counters or current-role facts.

## Design and programme audit — first pass

- DESIGN correctly declares itself version/status-neutral, but its reverse test index still describes F3B real activation/rollback and
  F3C real rollback as future work. Those lines should become capability/boundary descriptions (repository-only helper vs live evidence
  authority), not current gate status.
- ROADMAP's top role table and Phase 4/F3C narrative are current, and its standing Phase 9/four-step Release model is already the right
  reusable authority. The new history file must link to these rules instead of copying them.
- ROADMAP still contains older lower-section statements such as “F3通过前不得宣称 Cloud opt-in” and “Cloud activation仍不是当前
  功能事实”. Because ROADMAP is the current programme authority, Phase 9 implementation should reconcile these internal time windows
  rather than leaving readers to infer that the top section overrides them.
- The pre-seal audit therefore has two classes: Release-input stable documents must be fixed before candidate SHA freeze; Release-excluded
  current authorities can be reconciled in the same implementation gate but do not themselves force a ZIP rebuild.
- `phase-9-v0.4.0-release-discovery.md` should be the one version-scoped warm record. Later retries append post-implementation/status
  tails; they should not create generic `phase-9.1/9.2` files or duplicate exact asset evidence from acceptance/provenance.

## Release identity and input graph — first pass

- Release v2 currently has 22 entries. Among the macro documents only `README.md` is inside the ZIP; `ARCHITECTURE.md`, `DESIGN.md`,
  `CHANGELOG.md`, `ROADMAP.md`, history and acceptance are Release-excluded. Their reconciliation is still governance work, but only
  README changes candidate bytes.
- Current package identity is `0.4.0-dev`; Release contract repeats that version and names external asset
  `init-cloud-sandbox-v0.4.0-dev.bash`. The bootstrap defaults to `v0.4.0-dev` and a 64-zero ZIP hash.
- Stable identity propagation must be atomic: package `0.4.0` → Release contract package version + external bootstrap filename → new raw
  Release-contract SHA in upstream manifest → renamed `init-cloud-sandbox-v0.4.0.bash` with `HOOKS_VERSION=v0.4.0` → final ZIP SHA only
  after every ZIP entry is frozen. `install.js` derives its version from package metadata and should not gain a second constant.
- Runtime bundle and its hash need not rotate merely because package/README/Release-contract bytes change; its installed inventory and
  runtime hashes are unchanged unless the pre-seal audit finds a real production delta. The installed-state transition should continue
  naming `0.3.5` as the supported predecessor for the `0.4.0` forward migration.
- Current `df600104…` identifies the development ZIP before README/stable-identity changes. It can remain historical F2/F3 evidence but
  cannot be copied into the stable bootstrap or used as the final Source/Candidate/publication identity.
- Repository tests already derive most candidate/version/bootstrap facts from package + ROADMAP. Remaining literal `v0.4.0-dev` and
  installed-version assertions must be classified as current-role guards versus obsolete single-version locks during implementation.

## Acceptance, changelog and provenance routing

- The stable Cloud template explicitly requires development acceptance to be renamed when identity converges to stable; dev/stable
  acceptance files must not coexist. Therefore `docs/v0.4.0-dev-cloud-hard-acceptance.md` should become
  `docs/v0.4.0-cloud-hard-acceptance.md` in the stable-identity transaction, preserving historical dev gate sections as labelled evidence.
- `v0.3.5` demonstrates the required four-layer sequence: dev Source/Candidate evidence → sealed stable-source revalidation → immutable
  Published Release evidence → separate Latest/pointer-only postflight. `v0.4.0` cannot skip sealed-source revalidation merely because
  its earlier F2/F3 ZIP had extensive Cloud evidence.
- The current acceptance is a valuable version-scoped ledger and should be migrated, not rewritten as a short new file. New Phase 9
  sections belong above historical dev-gate evidence; exact final source/ZIP/bootstrap fields remain empty until the corresponding gate
  has actually passed.
- CHANGELOG `v0.4.0-dev` currently records implementation only through F3A and contains time-bound “F3 pending” claims. Before stable
  publication it needs the actual F3B/F3C/Phase-4 closeout delta and a stable `v0.4.0` heading, but it is Release-excluded.
- BASELINE_PROVENANCE must not pre-create a `v0.4.0` row. Add it only after immutable tag/source/ZIP/bootstrap identities exist. Its
  current upstream/verification narrative still references runtime-bundle/release-artifact v1 and should be reconciled to the v2 current
  chain without altering the separate immutable v0.3.2 overlay history.
- ROADMAP alone rotates candidate/accepted/fallback roles after public validation and promotion. Acceptance proves exact gate results;
  provenance proves published bytes; neither should independently claim the current recommendation role.

## Release-test migration audit

- `release-package.test.js` is largely identity-dynamic already: it derives candidate/bootstrap from package + Release contract and
  accepts zero hash only while candidate differs from accepted. Stable implementation should preserve this model rather than add a
  `v0.4.0` branch.
- `published-release-oracles.test.js` currently hardcodes `contracts/release-artifact-v1.json` for every published role. After promotion
  the two-seat oracle window will be mixed (`v0.4.0` v2 accepted, `v0.3.5` v1 fallback); the oracle must route through each archived
  source's own manifest/contract instead of selecting by current source or version string.
- The same oracle asserts current installed version as literal `0.4.0-dev`; it should derive the current package version. This is a
  maintenance defect exposed by stable identity rotation, not a product-contract change.
- Its current accepted/fallback roundtrip also assumes both installers can overwrite each other directly. That happened to fit the
  v0.3.5/v0.3.4 v1 window, but it is wrong for the future v0.4.0-v2/v0.3.5-v1 window: F3C proved direct old-over-current downgrade must
  fail. The durable oracle must exercise the supported route: current-owned uninstall → fallback clean install → exact current forward
  recovery, while separately retaining the no-mutation direct-downgrade refusal test.
- `repository-boundary.test.js` already models candidate==accepted for completed publication, but its dedicated Phase 4 foundation case,
  current acceptance anchor and several exact dev-state phrases are locked to `v0.4.0-dev`. Phase 9 implementation must split enduring
  Phase 4 capability guards from transient role-window assertions and admit the stable acceptance rename.
- `installed-state-transition-v1.json` must remain an exact v0.3.5 predecessor contract for the v0.4.0 installer. Promotion changes
  publication roles, not the already-proved forward migration source. It should only rotate when a future installer chooses a new
  supported predecessor under a separate contract gate.

## Validation-ref second-review audit

- The repository has 11 local F3 validation refs and 11 matching origin-tracking refs. They are evidence transport/lifecycle refs, not
  candidate or Release roles.
- The two runtime-source commits are ancestors of current `0.4.0-dev` HEAD. The other nine positive smart/autonomous lifecycle commits
  are side-branch commits and are not ancestors of current HEAD.
- None of the 11 validation commits is reachable from the immutable `v0.3.5` or `v0.3.4` tags. Exact hashes are recorded in histories and
  operator guides, but a recorded hash alone does not keep an otherwise unreachable Git object durably retrievable.
- Versioned F3 operator guides still name these refs as executable evidence inputs. Repository tests also validate the guide/protocol
  structure, so ref retirement is not equivalent to deleting an unused label.
- Default Phase 9 decision is therefore `KEEP`: do not delete or move any validation ref during pre-seal, publication or automatic
  post-promotion cleanup. A future retirement gate would first need a separately authorized durable evidence migration (for example,
  immutable archival refs/tags or another proven object-retention authority), updated guides/tests and a recovery audit.
- The audit command itself ended non-zero only because its final expected `merge-base --is-ancestor` non-match was not normalized. All
  requested facts printed successfully; this is an audit-command composition defect, not a repository failure.

## F3 guide and validator lifecycle

- F3B2/F3B3/F3C tests read the exact `v0.4.0-dev-*` operator-guide paths and assert their frozen commits, hashes, stage graphs, safety
  boundaries and executable Bash blocks. These files are not generic current-state manuals; they are executable records of the dev
  lifecycle that actually ran.
- Renaming those executed guides to stable `v0.4.0-*` would rewrite evidence identity and break existing links/tests without adding a
  safety property. They should remain under their dev filenames through the v0.4.0 Release and be described as historical validation
  evidence after promotion.
- The F3 helpers, validators and runtime-revival negative tests continue to protect rollback and lifecycle semantics. They are not
  transitional implementation scaffolding and remain `KEEP` in this train.
- F3C's guide status tail correctly stops before aggregate/Phase 9. Phase 4.11 and the new Phase 9 instance history provide the successor
  chain; the executed guide should not be rewritten to impersonate the later gate.

## v0.3.5 seal precedent — exact local sequence

- The predecessor train used separate commits for: compatible candidate inputs (`cb59ad7`) → Source/Candidate evidence (`8552d17`) →
  stable identity/acceptance rename and bootstrap rename (`5be9b78`) → stable-seal evidence only (`5d01b55`, tagged `v0.3.5`) →
  published acceptance, role rotation and old-window cleanup (`e8ee051`).
- This confirms two useful boundaries for v0.4.0: stable-byte materialization and evidence recording need not be one commit, and
  publication/promotion governance must remain after the immutable stable tag rather than being guessed into it.
- v0.4.0 has a wider pre-seal reconciliation set and a v2/v1 mixed publication-oracle window, but it should preserve the same basic
  ordering instead of collapsing Source/Candidate, seal, publication and promotion into one gate.

## Proposed v0.4.0 Phase 9 gate topology

1. `P9-A pre-seal materialization`: reconcile stable/current docs and dynamic tests; remove README state coupling; converge package,
   Release contract, manifest raw SHA, acceptance filename and bootstrap filename/version to `0.4.0`; keep bootstrap ZIP hash zero while
   calculating the frozen candidate ZIP. No public asset exists and any ZIP-input delta restarts this gate.
2. `P9-B seal and final-source acceptance`: write only the frozen ZIP SHA into the external bootstrap, calculate bootstrap SHA, run the
   full/ref-aware local matrix and exact sealed-source Source/Candidate Cloud gate. The bootstrap is outside the ZIP, so the ZIP bytes
   must remain identical to P9-A. Any required source/ZIP fix reopens P9-A and invalidates both hashes.
3. `P9-C immutable publication`: after maintainer authorization, create the exact stable tag and Pre-release, upload the two sealed
   assets, and run a ref-aware publication audit. No model or local agent performs the remote write.
4. `P9-D Published Release Cloud`: from a separate Fresh Cloud task, use the public bootstrap default URL/SHA chain, then real Resume,
   doctor and manifest-routed deep check. Local candidate bytes or earlier F3 Cloud evidence cannot substitute for this gate.
5. `P9-E Latest promotion`: maintainer changes only Release metadata after P9-D PASS; read-only postflight verifies Latest plus exact
   tag/source/ZIP/bootstrap identities, then ROADMAP rotates to accepted v0.4.0 and fallback v0.3.5.
6. `P9-F second retirement and handoff`: remove only the working-tree candidate/accepted-window files that have durable immutable
   replacements, update provenance/acceptance/ROADMAP, keep v0.3.5 recoverable via immutable tag/Release, retain F3 refs/guides/tests,
   and only then open `0.5.0-dev` / Phase 5 under separate authorization.

An RC is optional if P9-A/B uncovers risk; it cannot substitute for final stable-byte acceptance. Each gate has a separate stop and
maintainer authorization boundary.

## Second-retirement preliminary decisions

| Object | Discovery decision | Earliest action / reason |
|---|---|---|
| `README.md` stale F3 status sentence | `REPLACE` | P9-A, before ZIP freeze; replace with status-neutral authority routing |
| stale current claims in ARCHITECTURE/DESIGN/ROADMAP/CHANGELOG | `RECONCILE` | P9-A; only README affects ZIP, but all stable/current authorities must agree before seal |
| `v0.4.0-dev` package/contract/bootstrap/acceptance identities | `MIGRATE` | P9-A atomically to stable identity; no duplicate dev/stable acceptance or bootstrap |
| v2/v1 publication oracle and direct-downgrade roundtrip | `REPLACE` | P9-A with manifest-routed contracts and supported uninstall/clean-install/forward route |
| `installed-state-transition-v1.json` predecessor `0.3.5` | `KEEP` | It is the sealed v0.4.0 forward-migration contract, not a publication-role label |
| v0.3.5 working-tree bootstrap and acceptance | `KEEP` then `RETIRE` | Keep through P9-D; after v0.4.0 promotion they leave the candidate+accepted working window, while immutable tag/Release/provenance retain recovery |
| v0.3.5 tag/source/Release assets | `KEEP IMMUTABLE` | They become immediate fallback and must remain publicly recoverable |
| 11 F3 validation refs | `KEEP` | Nine retain otherwise side-branch-only commits; no durable replacement exists |
| F3 dev-named operator guides | `KEEP AS EXECUTED EVIDENCE` | Exact filenames/identities are part of the verified protocol and tests |
| F3 validators and revival negative tests | `KEEP` | They still protect current lifecycle/rollback semantics |
| future `0.5.0-dev` identity | `DEFER` | Only after P9-F and separate Phase 5 authorization |

## P9-A authority recovery — implementation pass

- P9-A starts from clean commit `8bfbf60`. The maintainer authorized only pre-seal materialization; exact-hash seal, Cloud and all
  remote lifecycle actions remain outside scope.
- README's one stale paragraph is exactly the final paragraph of the opt-in section. It must retain the secret/credential warning and
  replace only the F3-pending/current-capability sentence with the durable distinction between local admission proof and version-scoped
  Cloud/Release evidence.
- ARCHITECTURE has two current-state corrections: section 5.1 must state that F3C proved disarm-first rollback/recovery for both profiles,
  and section 12 must remove that item from “unimplemented” without turning acceptance facts into a Host/runtime invariant.
- Neither correction requires production/runtime changes. P9-A remains a stable-document and identity migration gate.

## P9-A ROADMAP pass

- ROADMAP 后半段的 Release 四步、pre-1.0 compatibility、accepted/fallback 轮转与封板顺序仍适用于 `v0.4.0`，不需要因本次稳定身份迁移改写；P9-A 只校准顶部 current-role、Phase 4/Phase 9 gate 状态及 README 解耦待办。
- Phase 9 是每列车重复进入的 standing gate；本次文档必须把“`v0.3.5` instance complete”与“`v0.4.0` instance 正在 P9-A”分开，不能把 Phase 9 永久标成 complete。
- `BASELINE_PROVENANCE.md` 的 current upstream/verification-chain sections 仍声称 `runtime-bundle-v1`、`release-artifact-v1` 和 deferred candidates 是当前 authority；这些不是 immutable historical entries，P9-A 必须改为 manifest-routed bundle/release v2。冷证据中的 v0.3.2 overlay 描述保持不动。
- CHANGELOG 的 `v0.4.0-dev` 段已经承载 Phase 4 实际增量；稳定身份迁移应把该段提升为 `v0.4.0` 并补 Phase 4/F3 closeout 与 pre-seal 边界，不复制第二份 dev/stable 变化清单。
- Repository-wide identity scan confirms that F3 runbooks/guides and their exact ref/version strings are executed dev evidence and remain unchanged. Stable promotion scope is limited to package/release/bootstrap/current acceptance plus current authority prose and tests; historical guide identities are explicitly excluded.
- Current hardcodes divide into three classes: stable identity (`package.json`, Release v2, bootstrap, current acceptance, repository/release tests) must migrate; exact F3 evidence strings must remain; `installed-state-transition-v1.json` and F3 rollback helper expectations retain `0.3.5`/`0.4.0-dev` where they describe the already executed predecessor/current-dev protocol rather than the final stable package.
- Stable machine propagation is exact: package version and Release v2 `package_version` become `0.4.0`; Release v2 external asset becomes `init-cloud-sandbox-v0.4.0.bash`; bootstrap default becomes `v0.4.0` while its SHA remains 64 zeros; the resulting raw Release-contract SHA alone updates manifest `managed_runtime.contracts.release_artifact.sha256`.
- The current acceptance file is renamed, not duplicated. Its top-level version identity and current/pre-seal route become stable, while embedded `v0.4.0-dev` F2/F3 anchors, candidate hashes and installed-version observations stay as immutable development evidence unless a new P9 gate records replacement evidence.
- Publication oracle must discover each historical Release contract through that release's own manifest, then normalize v1 object-shaped and v2 string-shaped `external_release_assets`. Hardcoding v1 is invalid once v0.4.0 becomes accepted.
- The supported rolling-window test is: fallback clean install → accepted forward install → accepted-owned uninstall → fallback clean install → accepted exact forward recovery. Direct accepted-over-current downgrade remains a separate negative/no-mutation test; the oracle must not require old installers to overwrite newer state.
- P9-A implementation followed the frozen route. The only scope expansion was stale current v1 prose in provenance; it was the same authority-reconciliation class and required no production change.
- Stable acceptance uses a new top-level stable anchor and keeps all executed dev anchors intact. The dev bootstrap/acceptance paths are retired by rename, while F3 dev guides remain exact evidence.
- P9-A frozen candidate facts: 22 entries, 85,519 bytes, SHA-256 `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`; two independent builds/checks were byte-identical. This is a local zero-hash candidate fact, not a sealed/public asset identity, and must not be copied into bootstrap before P9-B authorization.
- Final lifecycle state: dev bootstrap/acceptance paths retired by rename; stable identity/hash edge migrated; current prose reconciled; v0.3.5 working-tree role files, F3 refs/guides/validators/negative tests and installed transition retained. No unowned transition object remains in the P9-A change set.

## P9-B authorization and local-seal boundary

- P9-B starts from clean P9-A commit `cb5da4b61899cd05f237bc3adcd3e09c8cd24bee`. The candidate identity must be proved again
  from fresh builds before it is copied into bootstrap; the P9-A history line is not sufficient evidence by itself.
- The stable bootstrap is an external Release asset and is excluded from the 22-entry ZIP. Therefore its checksum can be sealed without
  changing candidate bytes, but this independence must be re-proved after the edit.
- “Local seal complete” and “P9-B PASS” are deliberately different states. The first freezes candidate/bootstrap bytes and creates the
  exact source commit; the second additionally requires the maintainer-pushed exact HEAD to pass Source/Candidate Cloud acceptance.
- Any required change to README, package, manifest, Release contract or another ZIP entry invalidates the frozen candidate and routes
  back to P9-A. P9-B is not a place to repair candidate inputs under a previously calculated hash.

## Post-seal ROADMAP governance reopening

- The maintainer intentionally reorganized `ROADMAP.md` after local seal commit `390d666`. Therefore that commit remains a valid local
  byte-seal checkpoint, but it is no longer the future sealed-source Cloud HEAD; the final exact HEAD must be derived only after the
  authorized ROADMAP governance commit closes.
- README remains state-neutral and ARCHITECTURE remains system-level. The only dirty path is the maintainer-owned ROADMAP edit, so it
  must be preserved and refined in place rather than replaced with the previous layout.
- Making Product Phase routing its own top-level section is directionally correct. The temporary `4.6` block is not a durable section:
  it reintroduces chronological F0/F1/F2/F3 implementation narration already owned by Phase history and version acceptance.
- The immediate task is limited to ROADMAP information architecture: retain stable programme decisions and current lifecycle roles,
  compress or route historical gate narration, and defer the maintainer-identified P9/F3B2 paragraph decision until the first two
  structural issues are closed.
- Full ROADMAP review shows the new top-level Product Phase chapter should own the Phase table, Phase 4 adopted gate model,
  opt-in purpose/protocol and Phase 5–8 adopted boundaries. Leaving Phase 4.3–4.5 under “current development train” would keep the
  same conceptual coupling even though the table moved.
- Temporary section 4.6 contains three different classes: (a) pure chronology already preserved by Phase 4 history/acceptance,
  which should leave ROADMAP; (b) durable programme decisions already expressed by the Phase 4 gate table/protocol, which should be
  deduplicated; and (c) two durable governance rules—F1A/F1B may be separate review gates but candidate bytes close atomically, and
  every migration gate maintains an object-lifecycle ledger—which should survive as compact Product Phase governance.
- The clean target shape is therefore: current-role/current-release-instance material in chapter 4; Product Phase table and durable
  Phase 4/5–8 route decisions in chapter 5; generic Discovery/Release governance in later chapters; detailed F0–F3 chronology only in
  version acceptance and `docs/history`.
- The first two governance issues now close cleanly without changing the maintainer-deferred P9/F3B2 paragraphs. ROADMAP has one
  `Product Phase` chapter: it owns the Phase table, durable Phase 4 route/protocol/decision, migration transaction/lifecycle policy and
  Phase 5–8 boundaries. The duplicate chapter and temporary `4.6` chronology are gone.
- The only content recovered from temporary `4.6` is durable rather than historical: F1A/F1B remain independently reviewable but the
  affected candidate must close atomically; every migration gate must maintain an owned `KEEP/REPLACE/RETIRE/DEFER` ledger with
  propagation, evidence and review conditions. Detailed F0–F3 implementation sequence stays routed to acceptance/history.
- The maintainer approved the P9-B3b disposition: remove both redundant current-status paragraphs and shorten the 4.1 heading. Neither
  paragraph needs migration because current P9 state is already owned by sections 2/4.1 and the changed-ZIP-evidence rule is already
  owned by 4.1/Release governance; F3B2 rationale remains historical evidence.
- The remaining opening paragraph in chapter 4 is correctly placed. It defines the current candidate/accepted/fallback role window and
  exact-vs-lifecycle repository zones, so it is current-train governance rather than Product Phase implementation chronology.
- P9-B needs an operator-facing entry, but not a second acceptance file. The existing version acceptance should route the maintainer to
  the generic template's exact Source/Candidate setup and deep-check anchors, derive the final source identity after the documentation
  commit, and record only returned facts. Copying either long Bash block would create a second script authority and future drift.
- The generic template already freezes the complete Source/Candidate order: 4.1 source setup in the selected checkout; a new task for
  5.1 post-install Resume; 6/7/8.1 in that task; real reopen for 8.2; then 9.1 deep check. The version operator entry should explain this
  choreography, the environment variable/preflight, and the two places where scripts must be extracted from the final checkout.
- The operator entry must not freeze the current local HEAD because writing that entry creates a newer commit. It should give the
  maintainer a PowerShell push/`ls-remote` equality check and require the Cloud-reported setup/deep-check HEADs to equal that resulting
  commit. This makes the post-documentation commit—not a prose constant—the identity authority.
- The completed Cloud run satisfies that identity model exactly: `PWF_SC_RUNBOOK_HEAD` and `PWF_DEEP_CHECK_HEAD` both equal pushed
  operator commit `fe8cd7f284ea2849f634aa68813dbb0f2cca83f9`; the 22-entry / 85,519-byte ZIP reproduces sealed SHA
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3` with 164/164 portable Linux tests and zero skips.
- Deep check proves manifest schema 4 routes Release/bundle v2, installer `0.4.0`, 12 installed files and 4 pristine upstream files;
  inventory is authoritative, policy is adapter-only, doctor is healthy and residue is zero. The only worktree delta is the permitted
  canonical planning fixture. This closes P9-B but creates no tag, public asset or promotion authority; P9-C remains a separate gate.

## P9-C tag-source and immutable-publication decision

- The stable tag must point to the source that actually passed P9-B sealed-source Cloud:
  `fe8cd7f284ea2849f634aa68813dbb0f2cca83f9`. Choosing the branch tip would replace a proved source identity with an unproved one even
  when later commits are Release-excluded and reproduce the same ZIP.
- `01fecef569b00e389a3b80ccdceeabd445ff993c` is the P9-B evidence writeback. Its diff from the Cloud-tested source is limited to planning,
  ROADMAP, history, version acceptance and a repository guard; its Release-entry/external-asset intersection is zero. This proves byte
  continuity but does not turn it into the P9-B test subject.
- The v0.3.5 precedent uses a lightweight tag (`git cat-file -t v0.3.5` returns `commit`) at its stable-seal source; publication, Published
  Release Cloud and Latest evidence were written back later. P9-C preserves the same source/evidence separation.
- Local `v0.4.0` tag lookup was absent. Read-only GitHub API returned HTTP 404 for `refs/tags/v0.4.0`, and `gh release view v0.4.0`
  returned `release not found`. A separate `git ls-remote` attempt hit the known Windows Git-Bash signal-pipe restriction, so it was not
  used as absence evidence. The maintainer operator must repeat both remote checks and treat transport uncertainty as `UNKNOWN`.
- P9-C uses the existing version acceptance as the only operator authority. It requires a fresh clone at the exact tag source, two
  deterministic builds, exact ZIP/bootstrap size and SHA, a lightweight tag, a Pre-release with exactly two assets, then a second fresh
  download/tag-source rebuild audit. It stops before Published Release Cloud and Latest promotion.
- Once an exact tag is pushed it is immutable. A later Release/upload failure may resume against that tag, but must not delete or move the
  tag. Any public byte mismatch is a supply-chain incident/new-identity problem, not permission to replace an asset under `v0.4.0`.

## P9-C independent publication audit — 2026-08-22

- GitHub ref API报告`refs/tags/v0.4.0`的object type为`commit`，因此它是lightweight tag；exact source为
  `fe8cd7f284ea2849f634aa68813dbb0f2cca83f9`。
- Release `v0.4.0`为`isDraft=false`、`isPrerelease=true`，公开URL为
  `https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.4.0`，资产inventory恰好两项。
- 重新下载的ZIP为85,519 bytes，SHA-256
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`；bootstrap为21,565 bytes，SHA-256
  `4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f`。
- 全新clone checkout公开tag后，importer check healthy；builder重建22-entry、85,519-byte ZIP，SHA与下载ZIP相同，且逐字比较
  完全一致；最终明确exit code 0并输出`P9_C_PUBLICATION_AUDIT=PASS`。
- 这只关闭P9-C immutable Pre-release publication，不证明P9-D Published Release Cloud，也不授权取消Pre-release、设置Latest或
  轮转accepted/fallback。
