# Findings: Phase 5.3 G2 identity closure and replay

## Inherited evidence

- G1 emits deterministic `PWF_RELEASE_RISK_ADVISORY_V1` from explicit exact commits and fails closed on unknown,
  unsafe or classifier/policy self-change.
- G1 deliberately classifies raw version identity paths conservatively. G2 may normalize them only after a
  complete byte-exact canonical cascade is proven.
- Existing authorities remain singular: package identity in `package.json`, ZIP/external assets in the Release
  artifact contract, runtime/install inventory in the runtime bundle, integrity references in
  `upstream-manifest.json`, predecessor admission in `installed-state-transition-v1.json`, and candidate
  bootstrap rendering in the canonical template/materializer.
- The frozen expected sample lanes are source-only, v0.4.1 product/security, v0.4.2/v0.4.3 Release mechanics,
  v0.4.4 package-doc-only and current v0.5 product/security.

## Questions to resolve

1. Which exact commits are the accepted closeout bases and C0 heads for v0.4.1～v0.4.4?
2. Which identity-owner fields changed in each train, and which current renderers can prove their expected bytes?
3. How should historical schema/layout variation be represented without adding a second current authority?
4. What exact residual set distinguishes a canonical identity-only change from `PACKAGE_DOC_ONLY` or mechanics?

## Exact replay endpoints

| Sample | Base accepted/closeout | Candidate/head | Frozen expected lane |
|---|---|---|---|
| source-only planning retirement | `eb13518^` | `eb13518` | `SOURCE_ONLY_GOVERNANCE` |
| v0.4.1 | v0.4.0 closeout `6b388518855da9053713a58e5c918c8b727b6dc6` | C0/tag `99885b854bd9621c3340e99f031bf83ceb58414d` | `PRODUCT_OR_SECURITY` |
| v0.4.2 | v0.4.1 closeout `3903326d7bbea344a8b03de1d9e1e7205eed57b1` | C0/tag `d51f291566b5599cb21a9fc5c3f30fd1a1bbc74a` | `RELEASE_MECHANICS` |
| v0.4.3 | v0.4.2 closeout `33deb5870015c94df329fe233e306363ba43232b` | C0/tag `6204de36cd8b2cbc614a4bb53b8481a5a1ba234d` | `RELEASE_MECHANICS` |
| v0.4.4 | v0.4.3 closeout `d7b5345b165e94c18ceab9b591d9a6b6dd251110` | C0/tag `f7032fd0efad3df9e4b6052e8cd766d27cd2a844` | `PACKAGE_DOC_ONLY` |
| current v0.5 | v0.4.4 closeout `053f66e994ca095e974f69a7fbe8f2bb54697fc3` | current G1 closeout `d2f9acc` initially | `PRODUCT_OR_SECURITY` |

The v0.4.1/v0.4.2 tags are lightweight commit refs; v0.4.3/v0.4.4 are annotated tags whose peeled commits are
the C0 values above. Fixtures must store exact commit IDs and never depend on tag object type or moving branches.

## Identity-owner observations

- Every accepted-closeout base contains exactly its own stable bootstrap. Each following C0 retains that accepted
  bootstrap and adds the new zero-hash candidate bootstrap. The later role-window closeout removes the previous
  bootstrap, so replay must use accepted-closeout → C0 rather than prior tag → next tag.
- All v0.4.x/current endpoints use `release-artifact-v2.json` and `installed-state-transition-v1.json`; G2 does
  not need a historical schema compatibility branch for these samples.
- `installed-state-transition-v1.json.predecessor` is an exact snapshot of the accepted installed manifest's
  stable identity: version, schema/owner/key set, canonical upstream hash, adapter hash, events and runtime file
  inventory. `install.js` already verifies these fields but does not expose a source renderer for maintenance.
- The current bootstrap template has exactly two identity placeholders, `@HOOKS_VERSION@` and `@HOOKS_SHA256@`.
  Candidate closure must render the new external asset with target version and 64 zeroes, while requiring every
  other template byte to match the exact head template applicable to that train.
- G2 can remain source-only by reconstructing expected predecessor/contract/hash bytes from base/head Git blobs;
  it must not call installer mutation paths or materialize files in the workspace.
- The canonical bootstrap template does not exist at either v0.4.1 endpoint or either v0.4.2 endpoint. It is
  introduced by the v0.4.3 C0 and exists at both v0.4.4 endpoints. Therefore current template rendering can be
  the production closure rule only where the exact head contains the template; v0.4.1/v0.4.2 replay requires a
  bounded historical fixture adapter and must not add legacy rendering behavior to the current materializer.
- The accepted-closeout → C0 ranges deliberately contain large governance/document/test deltas in addition to
  the identity cascade. Closure must annotate and remove only exact identity members, leaving those residual
  paths to the unchanged G1 precedence rules; this is what makes the frozen v0.4.x expectations useful rather
  than treating each train as an identity-only fixture.
- Historical bootstrap roles are not uniform. Each accepted base points to a stable bootstrap with a non-zero
  ZIP SHA. The v0.4.2, v0.4.3 and v0.4.4 heads point to newly added zero-hash candidates, but the selected
  v0.4.1 head already contains a non-zero v0.4.1 bootstrap. Current G2 closure must remain zero-hash-only;
  v0.4.1 can still replay conservatively as `PRODUCT_OR_SECURITY` without normalizing that asset, or use only a
  fixture-bounded historical assertion if the frozen Phase 5.3 authority explicitly requires it.
- Transition predecessor runtime inventory legitimately differs between a base's own predecessor and the next
  head's accepted predecessor (for example 10 → 12 entries in the v0.4.1 train). The head snapshot must be
  derived from the complete accepted base installation authorities, not compared to the base transition file
  after substituting only the version.
- The frozen history requires exact sample lanes, but its stop rule also says any closure member that cannot be
  explained by accepted source and a canonical renderer remains FULL. That resolves the v0.4.1 exception:
  leaving its sealed/non-template bootstrap unexplained is conservative and still produces its frozen FULL
  result; early historical behavior need not be admitted into the current closure algorithm.
- `install.js` provides the semantic predecessor contract but not source-file rendering. G2 therefore needs a
  read-only renderer that reproduces the repository's stable transition JSON layout byte-for-byte from the
  accepted base package/manifest/runtime bundle/adapter/notice authorities. Semantic JSON equality alone would
  wrongly hide whitespace or formatting bytes and is insufficient for closure.
- Current bootstrap materialization already has the desired strict rule: exact head template, exactly one of
  each identity token, target `v<package_version>`, and 64 zeroes. G2 should reproduce that check against Git
  blobs without importing/calling its workspace-writing paths.
- A native byte-preserving comparison proved the v0.4.2 candidate is exactly its accepted v0.4.1 bootstrap with
  the single embedded version changed to v0.4.2 and the single accepted ZIP hash changed to 64 zeroes. The same
  zero-hash derivation does not match v0.4.1's sealed head. This supplies a deterministic accepted-source
  renderer for the one pre-template candidate without a commit-specific allowlist.

## Frozen G2 design

- Evolve the machine result/error identity to V2 while retaining the G1 owner policy V1 unchanged. Add
  `identity_closure` and `residual_changes`; keep `changes` as the complete raw Git delta.
- When package version is unchanged, closure is `not_applicable` and all changes flow through the G1 classifier.
  When it changes, require the five-member cascade: package, Release contract, installed predecessor, manifest
  integrity references and the newly added 0644 candidate bootstrap.
- Validate identity fields semantically, then compare deterministic expected bytes. Package/Release/manifest
  paths are removed only if the complete file difference consists solely of the admitted identity substitutions;
  legitimate additional bytes remain residual. The predecessor and candidate bootstrap must match their full
  expected bytes or the entire closure fails closed and no member is removed.
- Derive the predecessor from the exact accepted base: package version; canonical full upstream manifest hash;
  actual adapter hash; fixed installed-manifest schema/owner/key/event identity; runtime inventory ordered exactly
  as installer `local_files`, `upstream_files`, `installed_contracts`, then notice, with every declared content
  hash rechecked against the base Git blob.
- Derive candidate bootstrap from the exact head template where present. For the pre-template layout, derive it
  from the accepted base bootstrap only when the embedded accepted version and non-zero SHA each occur exactly
  once, replacing them with target version and 64 zeroes. This admits v0.4.2 and rejects sealed v0.4.1.
- A complete closure with zero residual changes returns `NO_RELEASE_REQUIRED`; otherwise the unchanged strict G1
  priority classifies only residual changes. Any missing member, unsafe mode/type, wrong hash/path/bytes or
  derivation error leaves the raw delta intact and adds explicit closure unknowns.
- Store the six replay endpoints and frozen lanes in one test fixture using exact 40-character commits. This is
  an oracle/ledger only, not an alternate identity authority and not a default CLI input.
- The implemented v0.4.2 closure is fully valid and explains all five identity paths. Its remaining unexpected
  FULL result comes only from previously unowned historical documentation paths, not identity derivation. G2
  must explicitly assign those stable governance/operator paths to the existing source/mechanics rules rather
  than weakening the unknown-path fallback.
- v0.4.4 closure is also complete; its only residual paths previously classed as Release mechanics were
  `BASELINE_PROVENANCE.md` and `ROADMAP.md`. The frozen finding that only packaged README remains above source
  governance requires these Release-excluded state/provenance documents to use the source-governance owner.
  Actual operator templates, Wiki/build tooling and retired live runbooks remain Release mechanics.
