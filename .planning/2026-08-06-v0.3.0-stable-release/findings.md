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
