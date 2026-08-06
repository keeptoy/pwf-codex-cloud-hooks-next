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
