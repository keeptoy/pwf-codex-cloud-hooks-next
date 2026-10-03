# Findings: release process risk-lane discovery

## Initial evidence

- ROADMAP 9.1 defines C0 as the exact candidate source/tag target, C1 as the first-channel evidence/state commit
  and C2 as the public-release/final role closeout commit. C1 and C2 are not extra Cloud channels.
- The current workflow already permits an exact Product/Discovery validation to satisfy Source/Candidate when
  all final Release inputs remain unchanged.
- README is currently Release-included while Wiki, planning and most governance/history documents are
  Release-excluded. This makes some documentation changes package-byte changes even when runtime behavior is
  untouched.
- Phase 4.17 already separates artifact identity from behavior evidence and proposes four candidate lanes:
  source-only governance, package documentation, Release mechanics, and Product/security.
- Current development train is v0.5.0-dev. Phase 5 only authorizes documentation governance; no product,
  Cloud or Release action is authorized.
- At Discovery entry, branch `0.5.0-dev` is clean and the preceding completed planning-retirement transaction
  is recorded by local commit `eb13518`.
- Phase 5 exists partly because README previously mixed user-facing product material with maintainer Release
  procedure; the adopted route already moved development/Release operation into Release-excluded Wiki while
  retaining stable user/offline content in README.
- Phase 4.17 requires a historical classifier replay before any reduced lane can become normative. It also
  preserves two independent identity channels while allowing their internal evidence matrix to differ by risk.
- The useful optimization is therefore two-dimensional: reduce how often a change intersects the Release
  surface, then reduce behavior revalidation only when critical fingerprints prove the behavior owners are
  unchanged. Either dimension alone leaves avoidable toil.

## Initial candidate decision boundary

- `SOURCE_ONLY_GOVERNANCE` can bypass a version train only when every changed path is Release-excluded and the
  change does not alter machine/current authority semantics. Tests alone are not automatically low risk because
  removal or weakening of a security assertion can change evidence validity without changing package bytes.
- `PACKAGE_DOC_ONLY` still needs a new immutable identity and public default-download/install smoke because the
  package bytes change, but unchanged runtime/install/contracts fingerprints can justify omitting unrelated
  Product lifecycle replay.
- `RELEASE_MECHANICS` must retain both identity channels. Version-only changes belong here because package,
  contract and bootstrap identities move together even when runtime behavior does not.
- `PRODUCT_OR_SECURITY` remains the strict fallback for runtime, installer, schema, trusted graph, Host ABI,
  migration, path safety, unknown ownership and unexplained fingerprint changes.

## Current Release surface and evidence topology

- `contracts/release-artifact-v2.json` contains exactly 22 ZIP entries. The Release-included owner groups are:
  product documentation/license (`README.md`, notices), package/install (`package.json`, `install.js`), adapter and
  owned runtime, four pristine upstream files, runtime/install/Host schemas and inventories, plus builder/importer.
- The sole external asset is the versioned candidate bootstrap. Its name is contract-owned and its body embeds
  the version; it remains outside the ZIP but inside the C0 identity/fingerprint surface.
- Current excluded prefixes cover `.planning`, `docs`, `tests` and the upstream source cache. Exclusion alone is
  insufficient for a fast lane: tests can invalidate evidence and ROADMAP/current-authority changes can alter
  lifecycle semantics even though neither changes ZIP bytes.
- Current tags confirm exact C0 identities: v0.4.1 `99885b8`, v0.4.2 `d51f291`, v0.4.3 `6204de3`, and v0.4.4
  `f7032fd`. The last two are annotated tags; the first two are lightweight historical tags, so the classifier
  cannot assume tag object type is uniform across the replay corpus.
- First-parent history shows the modern lifecycle explicitly: v0.4.2-v0.4.4 each have a C0 candidate commit,
  a source-candidate evidence commit, a published-release evidence commit and a final role-window closeout.
  This supports treating C1/C2 as evidence projections rather than package identities, while preserving the
  tag-to-C0 relation.

## Historical replay: raw path evidence

| Train | Replay range | Changed paths | Target-package intersection | Distinguishing owner change |
|---|---|---:|---|---|
| v0.4.1 | v0.4.0 C2 → v0.4.1 C0 | 115 | README, install-state and Release contracts, bootstrap, installer, package, manifest | `install.js` path-safety/security behavior |
| v0.4.2 | v0.4.1 C2 → v0.4.2 C0 | 102 | README, identity contracts, bootstrap, package, manifest | Release/retirement/document-authority protocol changed |
| v0.4.3 | v0.4.2 C2 → v0.4.3 C0 | 48 | README, identity contracts, bootstrap, package, manifest | new asset materializer and canonical bootstrap template |
| v0.4.4 | v0.4.3 C2 → v0.4.4 C0 | 23 | README, identity contracts, bootstrap, package, manifest | packaged maintainer tag guidance; no runtime/installer/builder/template change |

- A raw-hash classifier would incorrectly classify every released train as Release-mechanics because version
  closure necessarily changes `package.json`, Release/installed-state identity fields, manifest integrity hashes
  and the versioned zero-hash bootstrap. Classification therefore needs two stages: first validate a canonical
  identity closure, then classify the residual semantic delta.
- The identity closure must be treated as an expected consequence, not ignored. Any non-canonical field or byte
  change within that closure escalates to `RELEASE_MECHANICS`; only the exact version/name/predecessor/hash cascade
  produced by approved tooling may be normalized away for risk selection.
- v0.4.3 proves Release inclusion is not a sufficient classifier: the new asset materializer and bootstrap
  template were Release-excluded source tools but changed how formal assets were generated. Owner classification
  must cover source-only build/publication tooling and acceptance protocol authorities.
- v0.4.4 is the positive `PACKAGE_DOC_ONLY` replay sample after canonical identity closure is removed. v0.4.1 is
  the positive `PRODUCT_OR_SECURITY` sample. v0.4.2 and v0.4.3 are `RELEASE_MECHANICS` samples for governance
  protocol and asset-generation changes respectively.

## C1/C2 reduction constraint

- Historical C1 commits contain the Source/Candidate identity/evidence summary and first real retirement result;
  they are the repository's durable resume point before tag/publication. Historical C2 closeout commits add the
  public-asset evidence, Latest confirmation, second retirement result, programme role rotation and the sealed
  current bootstrap copy.
- `materialize_release_assets.py` can regenerate and verify candidate/sealed bootstrap bytes and exact ZIP bytes,
  but it does not persist Source/Candidate Cloud evidence, retirement decisions or workflow state. The current
  repository has no durable external job/attestation store that can replace C1.
- Therefore immediate deletion of C1 would weaken crash/restart auditability. A literal `C0 + R` lifecycle is only
  `CONDITIONAL_GO`: it first needs an independently durable, content-addressed Source/Candidate checkpoint with
  a verified link to C0 and the candidate ZIP SHA. GitHub attestations could be evaluated later, but adopting
  them changes the external trust/workflow boundary and is outside this Discovery.
- The safe near-term simplification is to retain the C1 checkpoint but make it a small machine-generated evidence
  projection. The user-visible win comes from fewer manual fields and risk-selected validation, not from reducing
  the number of Git commits at the expense of resumability.

## Existing tooling gap

- The current materializer validates a fully prepared identity and writes only the candidate bootstrap or final
  ignored assets. It does not atomically update/validate all version-identity owners.
- A later implementation should add a read-only classifier plus an explicit identity-closure planner/checker
  before considering any mutating `prepare-candidate` command. The checker must explain every expected change to
  package version, Release contract, predecessor contract, manifest hashes and candidate bootstrap; unexplained
  bytes escalate to `RELEASE_MECHANICS` or `FULL`.

## Proposed classifier contract

The classifier should be read-only and use an accepted closeout commit plus candidate HEAD as explicit inputs.
It must not infer the accepted base from a moving branch or `Latest` URL.

1. Collect the exact Git delta, including add/delete/rename, file mode and symlink/type changes.
2. Resolve existing authorities rather than duplicate them: ZIP membership from the target Release artifact,
   runtime/install inventory from the runtime bundle, integrity edges from the manifest, and dynamic governance
   paths from repository lifecycle rules.
3. Validate the canonical identity closure before lane selection. Expected closure includes package version,
   Release contract version/external asset, accepted-predecessor snapshot, corresponding manifest hashes and the
   canonical zero-hash candidate bootstrap. Every non-identity field and byte must remain explained.
4. Classify the residual semantic delta by owner fingerprint, taking the strictest result.
5. Emit machine JSON with base/head, changed paths and modes, Release intersection, explained identity paths,
   before/after owner fingerprints, lane, invalidated evidence, required gates, reasons and unknowns.

Proposed owner/fingerprint precedence:

| Precedence | Fingerprints / owners | Result |
|---|---|---|
| 4 | runtime/adapter/installer, runtime bundle, Host/result schemas, migration/path-safety or source-import integrity | `PRODUCT_OR_SECURITY` |
| 3 | builder, asset materializer/template, Release allowlist structure, publication/Cloud protocol authorities | `RELEASE_MECHANICS` |
| 2 | Release-included README/notices only, after an exact canonical identity closure | `PACKAGE_DOC_ONLY` |
| 1 | Release-excluded planning/history/non-protocol docs/tests with unchanged shipped/protocol fingerprints | `SOURCE_ONLY_GOVERNANCE` |

- Tests are evidence invalidators, not shipped-behavior owners: changing them forces the relevant local suites to
  rerun and prevents using the changed test as proof of an unchanged baseline, but does not by itself create a
  public Release. Security/runtime test changes cannot be used to lower a lane selected by product fingerprints.
- Unknown paths, unsafe file types, unexplained identity bytes, changed Host profile, missing accepted evidence or
  a classifier/policy self-change all fail closed to `PRODUCT_OR_SECURITY`/current FULL workflow.
- A canonical identity closure with no residual releasable change should return `NO_RELEASE_REQUIRED` rather than
  rewarding a version-only Release. An explicit exception, if ever needed, uses `RELEASE_MECHANICS`.

## Minimum evidence matrix

| Lane | Local | Source/Candidate | Published Release |
|---|---|---|---|
| `SOURCE_ONLY_GOVERNANCE` | affected governance/link tests, relevant suite, `git diff --check` | none; no C0 or publication | none |
| `PACKAGE_DOC_ONLY` | full repository regression, deterministic ZIP build/check, doc/package diff oracle | exact checkout, double build/check, archive doc oracle, override install + doctor; omit unrelated B–E lifecycle replay | public checksum/default download, install + doctor and packaged-doc oracle; no behavior replay when all behavior fingerprints match |
| `RELEASE_MECHANICS` | full regression plus changed builder/materializer/protocol negatives and deterministic assets | exact build/materialization boundary, override install, doctor and inventory; add targeted checks for the changed mechanic | public bootstrap/ZIP checksum, default download, install, doctor and deep inventory; add Fresh/Resume only if an installation/runtime observable changed |
| `PRODUCT_OR_SECURITY` | current full local + required Linux/security/migration gates | current full Source/Candidate lifecycle and negatives | current full public Fresh/UserPrompt/real Resume/doctor/deep check and rollback/migration evidence |

The two identity channels and both retirement decision times remain. Reduced lanes change the work inside a
channel, not the source-vs-public identity distinction. A Host profile mismatch or any failed/minimally unexplained
check immediately escalates and restarts under the stricter lane.

## Release-surface finding

- The largest obvious surface reduction is already present on `v0.5.0-dev`: maintainer tag/publication procedure
  moved from Release-included README to Release-excluded Wiki. Current packaged prose is only README plus the
  third-party notice.
- Further splitting README is not a prerequisite for risk lanes and could damage offline user documentation.
  Keep README packaged unless future data shows user-doc churn still dominates releases.
- The current `v0.5.0-dev` train itself is not a reduced-lane candidate: compared with v0.4.4 C2 it changes
  `owned-plan.py` admission behavior and runtime-bundle integrity, so the proposed classifier correctly selects
  `PRODUCT_OR_SECURITY` for any future release of the current bytes.

## Replay outcome

An analytical path/owner prototype produced the following strict-precedence results after canonical identity
closure is conceptually separated:

| Sample | Highest trigger | Expected lane | Result |
|---|---|---|---|
| planning-scope retirement `eb13518^..eb13518` | no shipped/protocol owner | `SOURCE_ONLY_GOVERNANCE` | matched |
| v0.4.1 | installer path-safety behavior | `PRODUCT_OR_SECURITY` | matched |
| v0.4.2 | Cloud/operator protocol authorities | `RELEASE_MECHANICS` | matched |
| v0.4.3 | asset materializer/template | `RELEASE_MECHANICS` | matched |
| v0.4.4 | packaged README only | `PACKAGE_DOC_ONLY` | matched |
| current v0.5.0-dev vs v0.4.4 C2 | owned-plan/runtime-bundle behavior | `PRODUCT_OR_SECURITY` | matched |

No corpus member was assigned a lane below its known historical risk. This is sufficient to support an
implementation experiment, not enough to enable reduced production gates: the prototype still needs exact
identity-closure validation, mode/type handling, owner-policy self-protection and regression fixtures before it
can be authoritative.

## Option comparison and decision

| Option | Benefit | Missing safety property | Decision |
|---|---|---|---|
| Keep current manual C0/C1/C2 and always-full evidence | known conservative behavior | continues avoidable manual and Cloud repetition | retain as fallback only |
| Risk classifier + generated minimal C1/C2 | large toil reduction while keeping durable resume points and current authorities | requires implemented fail-closed classifier and historical regression fixtures | `CONDITIONAL_GO` |
| Immediate C0 + final record only | removes one commit | loses durable pre-publication checkpoint in the current trust model | `NO_GO` now |
| C0 + final record backed by external immutable attestation | could later remove C1 without losing durability | new GitHub workflow, permissions, retention and trust boundary need separate Discovery | defer |
| Tag-derived dynamic build version | fewer source edits | adds an external build parameter and weakens source-only reproducibility | `NO_GO` |

Recommended implementation sequence, each requiring its own explicit authorization:

1. Add a read-only advisory classifier/policy and historical fixtures. It may only escalate; current workflow
   remains authoritative while parity is proven.
2. Add a read-only identity-closure checker and `NO_RELEASE_REQUIRED` result. Do not start with automatic writes.
3. Generate compact evidence/retirement blocks into the existing task plan and operator guide; retain C1/C2.
4. Exercise one future genuinely low-risk train under both the classifier recommendation and current full shadow
   checks. Only after zero false-fast results may ROADMAP authorize reduced lane contents.
5. Revisit C1 removal only after a separately approved durable checkpoint/attestation design exists.

Suggested success metrics are manual fields edited, number of repeated Cloud B–E executions avoided, number of
files touched by C1/C2, classifier escalation rate, and false-fast-lane count (required to remain zero).

## Discovery conclusion

`CONDITIONAL_GO` for a later **read-only classifier + identity-closure checker + generated evidence projection**
gate. `NO_GO` for changing the current Release workflow, skipping C1, reducing the present v0.5.0-dev full lane,
or adopting external attestations in this Discovery.

The stable conclusion is summarized in the Phase 5 overview and CHANGELOG. The maintainer subsequently made the
separate history-promotion decision required by Phase 5 governance: create Phase 5.3 as a
`FROZEN_DISCOVERY_RECORD`. Its successor implementation topology is exactly five gates: advisory classifier,
identity-closure checker/replay, evidence projection, shadow execution, and a final enablement decision. History
promotion does not authorize any of those gates.

The self-contained history record is `docs/history/phase-5.3-release-risk-lane-discovery.md`. It uses full decision
source commit `94ea8a53624de28f6348f29c9f638c99a638fa19` as cold evidence, increments the frozen-record index from 12 to 13, and keeps detailed
implementation errors/outputs in future gate planning rather than copying the completed working log.

## Questions to resolve

1. Which repository facts can classify every changed path without relying on a maintainer assertion?
2. Which C1 facts are needed before publication, and can they be durably reconstructed or deferred to one
   final closeout record?
3. Which historical changes would have used each lane, and would any reduced lane have missed a required test,
   Cloud check or rollback boundary?
4. Is Release-surface reduction a prerequisite for useful fast lanes, or can classification deliver value
   before changing the allowlist?
5. What is the smallest later implementation gate that produces measurable toil reduction while preserving
   fail-closed defaults?
