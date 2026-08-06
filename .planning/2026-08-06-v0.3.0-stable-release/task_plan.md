# Task Plan: v0.3.0 Stable Release

## Goal

Publish the successor's already accepted canonical behavior as immutable stable
`v0.3.0` before any Product Phase 4 work, without changing runtime semantics,
removing canaries, weakening tests, or rewriting the beta.2 rollback baseline.

## Current Gate

Stable Release Discovery is complete; S1 candidate-identity authorization is required.

## Status

The maintainer selected the pre-Phase-4 stable route. The repository still identifies
itself as `0.3.0-beta.3-dev`; no package/bootstrap identity, ZIP hash, tag, Release,
live `/opt/codex`, or product behavior has changed. Published/accepted beta.2 remains
the sole production rollback until all stable publication and post-publication gates pass.

## Next Step

Stop for maintainer checkpoint and explicit S1 authorization. S1 may freeze the stable
identity, acceptance contract, tests, and final ZIP inputs, then build deterministic ZIP
bytes and seal the external bootstrap. It may not publish a tag/Release, install live
`/opt/codex`, enter Product Phase 4, remove canaries, or alter runtime/Host behavior.

## Non-goals

- Do not implement attestation, opt-in v3, compaction, tool/permission, or Stop behavior.
- Do not remove or rename `PWF_GLOBAL_HOOK_CANARY_V1` in this release.
- Do not change adapter/runtime/contracts/overlay semantics merely to obtain a stable tag.
- Do not overwrite beta.2 assets, tags, hashes, acceptance evidence, or rollback role.
- Do not publish to npm; `private: true` remains a source/package safety choice.
- Do not treat a local deterministic ZIP as an immutable Release or rollback baseline.

## Invariants

1. Stable `v0.3.0` contains the current accepted canonical behavior and current canaries.
2. Runtime, installer, schema, overlay, Host ABI, managed policy, 11-payload inventory,
   22-entry ZIP boundary, and external-bootstrap boundary remain behaviorally unchanged.
3. `package.json`, README and every other ZIP input are frozen before the final ZIP hash.
4. The ZIP SHA is written into the external bootstrap only after final ZIP bytes exist;
   the sealed bootstrap SHA is calculated afterward.
5. Publication status and post-publication PASS evidence live outside the tagged ZIP
   inputs whenever possible; the immutable tag remains the exact rebuild source.
6. No tag/Release is created before local/Linux and no-live Cloud prepublication seals pass.
7. beta.2 remains the only accepted production rollback until downloaded stable assets,
   Fresh/UserPrompt, real Resume, doctor, inventory and rollback verification all pass.
8. Any candidate-byte drift after SHA calculation invalidates the candidate and requires
   a new identity/hash/seal cycle; no asset is replaced in place.
9. Product Phase 4 remains stopped until stable v0.3.0 closure and separate authorization.

## Frozen Release Identity

| Item | Target |
|---|---|
| package version | `0.3.0` |
| Git tag / Release | `v0.3.0` |
| ZIP asset | `pwf-codex-cloud-hooks-v0.3.0.zip` |
| external bootstrap | `init-cloud-sandbox-v0.3.0.bash` |
| repository | `keeptoy/pwf-codex-cloud-hooks-next` |
| Release type | stable, not prerelease |
| behavior delta from beta.3-dev | none; identity/docs/tests/asset seal only |

## Gate Sequence

### S0 — Release Discovery

- [x] Select stable `v0.3.0` before Product Phase 4.
- [x] Audit package/bootstrap/builder/allowlist/test and beta.2 acceptance boundaries.
- [x] Freeze unchanged behavior, canary retention, asset names and rollback ownership.
- [x] Freeze the no-self-reference rule for README, ZIP SHA and post-publication evidence.
- **Exit:** reviewed plan with explicit S1/S2/S3 stops and no release-byte mutation.
- **Status:** complete

### S1 — Stable candidate identity and local seal

- [ ] Change package/bootstrap/test/document identity from beta.3-dev to stable v0.3.0.
- [ ] Add a standalone v0.3.0 hard-acceptance document without depending on beta.2 text.
- [ ] Keep production/runtime/contract/overlay bytes unchanged and prove the exact drift set.
- [ ] Freeze README and all 22 ZIP inputs before calculating the final ZIP SHA.
- [ ] Run importer/static/full Windows suite and deterministic double-build/check.
- [ ] Write the exact ZIP SHA into the external bootstrap and calculate bootstrap SHA.
- [ ] Record candidate commit, entries, sizes and hashes; stop before Cloud or publication.
- **Exit:** reproducible sealed candidate bytes, zero placeholder, no tag/Release/live install.
- **Status:** pending; explicit authorization required

### S2 — Fresh Cloud prepublication seal

- [ ] Verify exact candidate commit, Git modes, LF, importer and Linux full suite.
- [ ] Rebuild/check exact ZIP bytes cross-platform and match the S1 SHA.
- [ ] Verify external bootstrap exact bytes/SHA without downloading an unpublished asset.
- [ ] Run isolated install/upgrade/doctor, adapter-only policy, inventory and zero residue.
- [ ] Prove no live `/opt/codex` mutation and a clean workspace.
- **Exit:** Cloud prepublication PASS for the exact assets intended for publication.
- **Status:** pending; separately authorized after S1 checkpoint

### S3 — Immutable publication and post-publication hard acceptance

- [ ] Create exact `v0.3.0` tag/Release and upload ZIP plus external bootstrap once.
- [ ] Re-download both assets and verify names, sizes, SHA and ZIP boundary.
- [ ] Run completely fresh Cloud setup and automatic startup/UserPrompt lifecycle.
- [ ] Create a real planning update, long tail, Resume catch-up and post-resume doctor.
- [ ] Verify exact 11-file inventory, zero snapshot residue and beta.2 rollback independence.
- [ ] Record acceptance evidence and promote v0.3.0 as the new rollback baseline.
- **Exit:** immutable published assets and complete A～F acceptance PASS.
- **Status:** pending; publication requires explicit authorization after S2

## Stop Conditions

Stop immediately if production/runtime/schema behavior changes, a final ZIP input changes
after hashing, beta.2 evidence would need rewriting, the Cloud rebuild differs, installer
inventory drifts, any lifecycle observation fails, or publication would require force,
asset replacement, moving URLs, or an unverified checksum.
