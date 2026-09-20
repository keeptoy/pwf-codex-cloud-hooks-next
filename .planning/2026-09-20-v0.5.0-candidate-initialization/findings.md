# Findings: 0.5.0 development-candidate initialization

## Requirements

- Rename the local development branch to `0.5.0`.
- Delete completed obsolete planning scopes but retain `.planning/` for planning-with-files.
- Move README sections “本地开发” and “构建开发 ZIP” into root `Wiki.md`.
- Formally initialize a coherent `0.5.0` development candidate.
- Preserve all published `v0.4.4` and fallback identities.

## Research Findings

- The original branch was local `0.4.4`, tracking `origin/0.4.4`; it is now local `0.5.0` with no upstream.
- Seven completed scopes plus `.planning/.active_plan` comprised 22 tracked planning files. They were removed; a fresh scope is now required.
- `README.md` is an entry in `contracts/release-artifact-v2.json`, so slimming it changes the deterministic ZIP hash.
- The tracked `init-cloud-sandbox-v0.4.4.bash` is a sealed accepted bootstrap with the published `v0.4.4` ZIP SHA. It must not be rewritten for changed source bytes.
- The Release contract owns `package_version` and the exact external bootstrap filename. `upstream-manifest.json` pins the raw SHA-256 of that contract.
- A development candidate uses a canonical bootstrap rendered from `tools/templates/init-cloud-sandbox.bash.in` with its candidate version and a 64-character zero ZIP hash.
- `Wiki.md` is not in the Release allowlist; this keeps detailed maintainer workflow outside future ZIP bytes while README remains a stable user-facing ZIP input.
- Current HEAD is `777b0de`; published `v0.4.4` remains tag `f7032fd`, so candidate edits can leave the immutable tag and its bootstrap untouched.
- Current identity literals requiring rotation are concentrated in `package.json`, `contracts/release-artifact-v2.json`, the contract integrity reference in `upstream-manifest.json`, candidate-role tests, and a new external bootstrap. Historical acceptance, Phase history, and accepted-role ROADMAP facts must retain `v0.4.4`.
- Repository precedent opens an unsealed development candidate with a `-dev` package identity and zero-hash bootstrap (for example, `0.4.4-dev` / `init-cloud-sandbox-v0.4.4-dev.bash`) before later stable C0 sealing. Therefore this train should use package identity `0.5.0-dev` on local branch `0.5.0`, not reuse the sealed stable identity early.
- Candidate initialization alone does not authorize Product Phase 5 implementation. The current gate remains documentation/planning governance unless the maintainer separately activates Product Phase 5 through its required Discovery boundary.
- Opening the previous `0.4.4-dev` train also rotated `contracts/installed-state-transition-v1.json` from the old immediate fallback to the then-accepted predecessor. For `0.5.0-dev`, the exact admitted predecessor must therefore become accepted `0.4.4`, and the manifest integrity hash for this contract must rotate too.
- The current contracts test intentionally checks the stable accepted package's predecessor against the immediate fallback. Candidate state must change that assertion back to the accepted baseline, matching prior train-opening semantics.
- The accepted `v0.4.4` `upstream-manifest.json` canonical SHA-256 is `52b5bcdef2bf0dc9e84c23eb8c02f6071337323b3dc879150ee856861c4e2ef4`; the same calculation reproduced the current `v0.4.3` predecessor hash `7c6f3a...`, validating the derivation method.
- After identity rotation, the exact raw contract hashes are: Release artifact `c0af1c29478e8b24a0afb06afabc83663b5a9725cab38986f1e5526b779363d4`; installed-state transition `1854ee8868ded3487aefe2d73ee9b621fa91ddd220f4c4e01020f2132dc0cc83`.
- Targeted candidate tests proved the core identity path: both release materializer tests, deterministic candidate ZIP, Release builder drift checks, manifest routing, and accepted-predecessor contract passed.
- The five remaining targeted failures are governance fixtures: candidate CHANGELOG must use a real leading version heading instead of `Unreleased`; architecture-contract tests must remain version-neutral; two ROADMAP regexes assumed the old word/order; and one moved Wiki assertion expects the phrase “版本专项 acceptance”.
- Full regression left one real lifecycle-oracle gap: once the current contract points at `v0.5.0-dev`, accepted `v0.4.4` can no longer rely on “current checkout identity” to locate its sealed bootstrap. Like older role-window entries, its provenance row must gain an immutable sealed-bootstrap source.
- Commit `053f66e994ca095e974f69a7fbe8f2bb54697fc3` is the `v0.4.4` role-window closeout and retains the sealed accepted bootstrap; it is the natural immutable source pointer, mirroring the `v0.4.3` closeout pattern.
- Final audit confirmed `init-cloud-sandbox-v0.4.4.bash` is byte-unchanged, the new bootstrap is LF and expected to use Git mode `100644`, the four upstream runtime files remain exactly `100755`, and only the fresh candidate scope exists under `.planning/`.
- The maintainer's correction means earlier broad “planning is optional / current tree may have no `.planning/`” policy edits are outside the final intent for this repository. Restore required active-planning semantics while keeping the authorized deletion of seven obsolete scopes and the new scope.

## Technical Decisions

| Decision | Rationale |
|---|---|
| Rotate package, Release contract, manifest contract hash, and bootstrap together | These fields jointly define the candidate identity and are already guarded by producer/consumer tests. |
| Retain the accepted `v0.4.4` bootstrap unchanged | Published assets and accepted identities are immutable. |
| Keep ROADMAP accepted/fallback roles at `v0.4.4`/`v0.4.3` | Candidate initialization is not Release promotion. |
| Replace “planning absent” tests with “one active current scope, no obsolete scopes” | This reflects the maintainer’s corrected planning lifecycle requirement. |
| Use `0.5.0-dev` package/contract identity on branch `0.5.0` | This follows the repository's prior pre-C0 lifecycle and keeps stable `0.5.0` available for a later seal. |

## Issues Encountered

| Issue | Resolution |
|---|---|
| README migration invalidated the current `v0.4.4` deterministic ZIP hash | Maintainer authorized formal `0.5.0` candidate initialization instead of rewriting the sealed `v0.4.4` bootstrap. |
| Initial implementation interpreted planning retirement as removing `.planning/` entirely | Corrected by creating a new active scope and treating only the seven completed scopes as retired. |
| A planning update patch used a cross-file context that existed in only one file | Inspected exact contents and split the update into targeted hunks. |

## Resources

- `contracts/release-artifact-v2.json`
- `upstream-manifest.json`
- `tools/materialize_release_assets.py`
- `tools/templates/init-cloud-sandbox.bash.in`
- `tests/release-assets.test.js`
- `tests/release-package.test.js`
- `ROADMAP.md`
- `Wiki.md`
