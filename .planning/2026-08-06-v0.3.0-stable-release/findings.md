# Findings: v0.3.0 Stable Release

## Discovery decisions

- The stable milestone deliberately precedes Product Phase 4. Phase 4 will use a later
  `0.4.0-*` train only after v0.3.0 closure and separate Discovery authorization.
- Stable means immutable, accepted release identity; it does not authorize behavior
  cleanup. Existing canaries and canonical SessionStart/UserPrompt semantics stay intact.
- The current source identity `0.3.0-beta.3-dev` was created for migration/equivalence and
  has no published asset. It can be promoted to stable only through a new Release contract.
- `package.json` supplies installer manifest identity dynamically. The bootstrap separately
  owns tag/package/URL/ZIP-SHA identity and already has the correct versioned filename.
- Release ZIP remains exactly 22 machine-allowlisted entries. The bootstrap remains the
  sole external asset; documentation/planning additions do not enter the ZIP unless the
  existing README itself changes.
- README is a ZIP input. Its stable content must be frozen before ZIP hashing and should
  avoid post-publication status text. PASS/promotion evidence belongs in ROADMAP,
  provenance and the standalone acceptance record so publication does not create a
  README-to-ZIP checksum loop.
- Old beta.2 A～F is a reusable behavioral model but stable v0.3.0 needs a standalone
  runbook and its own exact assets, hashes, commit and conclusions.
- The final local seal order is package/docs/tests/README freeze, deterministic ZIP,
  ZIP SHA, bootstrap seal, bootstrap SHA. Cloud prepublication and publication are later
  independent gates.

## Frozen non-behavioral drift candidates for S1

- `package.json` version;
- bootstrap version and final ZIP SHA;
- stable identity assertions in release/bootstrap tests;
- README/AGENTS/ARCHITECTURE/ROADMAP/MAINTAINER_HANDOFF/provenance status where required;
- new standalone stable acceptance document and current planning/repository-boundary data.

Production adapter, owned runtimes, upstream runtimes, installer algorithms, schemas,
overlay contracts and Release allowlist contents are not candidate behavior changes.

## S1 seal conclusions

- The 19 protected production/contract/import/build inputs are byte-identical to S1 base
  `99ce1a5b56fb1d491003bd6b5d0c289bce9cb7a2`; the Release allowlist remains 22 entries.
- The only ZIP-input drift is the frozen stable `README.md` and `package.json` identity.
- Two deterministic builds are byte-identical: 75,386 bytes, SHA-256
  `f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af`.
- The external bootstrap is 17,423 bytes, SHA-256
  `ab334f0367d948fa29a2bdd37bff0c220929aeb320fdf59dbacbd5a4021b39c0`.
- The standalone Cloud runbook uses the actual upstream v3.8.2 Skill root
  `skills/planning-with-files` and fingerprints live managed paths before and after its
  isolated install. Existing live state may exist, but S2 must prove it was not mutated.
- S1 cannot name the immutable candidate commit until the maintainer checkpoints these
  exact bytes. That commit, not a later moving `main`, becomes S2 `EXPECTED_HEAD`.

## S2 attempt 1 diagnosis

- Cloud proved the exact candidate checkout, Linux 63/63 suite, deterministic ZIP bytes,
  upstream checksum and isolated install before the runbook stopped.
- `installed-manifest.json` defines `runtime_files[]` entries with the key `path`, as
  frozen by `install.js`, installer tests, M3 and beta.2 F acceptance. The new stable
  runbook alone incorrectly read `relative` in its S2 and F inventory blocks.
- Classification is `ACCEPTANCE_ONLY`, not production, manifest or candidate-asset drift.
  The minimum correction is two `path` lookups plus a repository-boundary regression
  assertion. ZIP/bootstrap hashes remain unchanged; the source commit SHA must advance.
