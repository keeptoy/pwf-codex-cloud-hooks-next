# Progress: v0.3.0 Stable Release

## 2026-08-06 — S0 Discovery

- Maintainer chose to seal unchanged canonical behavior as stable `v0.3.0` before
  Product Phase 4.
- Audited current package identity, bootstrap zero-hash guard, deterministic 22-entry
  builder, Release tests, installer version ownership, beta.2 hard-acceptance structure,
  repository boundary and maintainer Release procedure.
- Frozen four gates: S0 Discovery, S1 local candidate seal, S2 no-live Cloud
  prepublication seal, and S3 immutable publication plus A～F acceptance.
- Strict UTF-8/LF/fence/local-link and `git diff --check` validation PASS for the
  nine changed/new Markdown documents; the governance/planning drift has zero
  Release allowlist overlap.
- A disposable alternate Git index proved the candidate repository is exactly 64
  paths after adding the three stable planning files. Architecture/repository-boundary
  focused tests pass 4/4; the user's real Git index remained untouched.
- No package/bootstrap/version/hash/tag/Release/live runtime/product byte changed.
- Stopped before S1 candidate-identity authorization.

## 2026-08-06 — S1 opening

- Maintainer checkpointed S0 and explicitly authorized S1.
- Opened only the identity/docs/tests/acceptance/asset-seal boundary. Runtime, installer
  algorithm, schemas, overlays, Host ABI, tag/Release, live Cloud and Product Phase 4
  remain excluded.

## 2026-08-06 — S1 local seal

- Changed the source/bootstrap/test/public-document identity to stable `0.3.0` while
  retaining the production canary and all accepted lifecycle semantics.
- Added standalone `docs/v0.3.0-cloud-hard-acceptance.md`; its S2 script uses the exact
  upstream Skill root, isolated installer paths and before/after live-state fingerprints.
- Proved zero drift across 19 protected production/contract/import/build inputs relative
  to S1 base `99ce1a5b56fb1d491003bd6b5d0c289bce9cb7a2`.
- Importer, Node/Python static checks and `git diff --check` PASS. Windows full suite PASS:
  63 registered / 52 passed / 0 failed / 11 honest POSIX/Linux-only skipped. The first
  sandboxed attempt could not spawn test workers (`EPERM`); the identical command passed
  outside that process restriction.
- Deterministic ZIP double-build/check PASS: 22 entries, 75,386 bytes, SHA-256
  `f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af`.
- External bootstrap sealed afterward: 17,423 bytes, SHA-256
  `ab334f0367d948fa29a2bdd37bff0c220929aeb320fdf59dbacbd5a4021b39c0`.
- No tag, Release, push, live `/opt/codex` installation or Product Phase 4 work occurred.
  S1 now stops for the exact candidate checkpoint; S2 remains separately authorized.

## 2026-08-06 — S1 checkpoint / S2 authorization

- Maintainer authorized Codex to create the exact S1 candidate commit and immediately
  enter S2. The commit containing this entry is the candidate identity; its full SHA is
  supplied externally as S2 `EXPECTED_HEAD` to avoid a self-referential commit hash.
- S2 is limited to the standalone no-live Cloud prepublication script. Publication,
  Git tag/Release creation, live `/opt/codex` mutation and Product Phase 4 remain blocked.

## 2026-08-06 — S2 attempt 1

- Pushed exact S1 candidate `7840336a74cb4220a1fb5bb935e05a5e1e16a731` and ran the
  Fresh Cloud no-live script.
- Cloud PASS before the stop: exact HEAD, Linux 63/63, deterministic 22-entry ZIP at the
  sealed size/hash, upstream checksum and isolated install.
- The script then stopped with `KeyError: 'relative'` before strict final summaries. No
  live install, repair, repository edit, tag, Release or asset publication occurred.
- Root cause is acceptance-only schema drift: manifest inventory uses `path`. Corrected
  both stable-runbook inventory blocks and added a regression assertion; S2 remains open
  pending an exact rerun from the corrected commit.

## 2026-08-06 — S2 accepted rerun

- Corrected source `1454c9224c83d11c073b05baf6e536a11c3bb0e5` was independently
  re-fetched from remote `main`; Cloud did not reuse the stale attempt-1 script.
- Strict result PASS: Linux 63/63/0/0; ZIP 22 entries / 75,386 bytes /
  `f245a554...`; bootstrap 17,423 bytes / `ab334f03...`; isolated doctor healthy;
  11 payloads; `LIVE_CODEX_MUTATIONS=0`; clean workspace.
- No repository edit, live install, tag, Release or asset publication occurred in Cloud.
  S2 is closed and execution stops before separately authorized S3.

## 2026-08-06 — S3-A immutable publication/download

- Maintainer authorized S3. Built twice from detached exact source `1454c922...`; ZIP
  remained 22 entries / 75,386 bytes / `f245a554...`, bootstrap remained 17,423 bytes /
  `ab334f03...`.
- Created non-draft, non-prerelease GitHub Release `v0.3.0`; its lightweight tag resolves
  exactly to `1454c9224c83d11c073b05baf6e536a11c3bb0e5`.
- Uploaded only `pwf-codex-cloud-hooks-v0.3.0.zip` and
  `init-cloud-sandbox-v0.3.0.bash`. Re-downloaded both assets and independently verified
  names, count, sizes, SHA-256 and ZIP contract.
- Removed only the verified temporary detached worktree/build/download copies. Main stayed
  clean; no asset replacement, live Cloud mutation or rollback promotion occurred.

## 2026-08-06 — S3 Cloud A～F and stable closure

- Published bootstrap setup PASS on Codex Cloud (`/opt/codex`, pristine PWF v3.8.2,
  managed adapter/runtime/manifest paths).
- Fresh lifecycle PASS: startup SessionStart, UserPrompt canary and planning context.
- Real baseline/canonical PASS with marker `PWF_V030_STABLE_CANONICAL_3C0A`.
- Long wrapper/real Resume PASS: previous session observed, message #37, 9 unsynced,
  truncation and tail marker preserved, catch-up before canonical planning context.
- Final doctor/inventory/residue PASS: healthy, non-repairable, empty errors/blockers,
  installer `0.3.0`, exact 11 payloads and zero snapshot leftovers.
- Promoted published `v0.3.0` to the accepted rollback baseline. beta.2 remains immutable
  as the previous fallback; stopped before Product Phase 4 Discovery.
