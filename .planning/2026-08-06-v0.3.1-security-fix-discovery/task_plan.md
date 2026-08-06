# Task Plan: v0.3.1 Security-Fix Discovery

## Goal

Turn the 2026-08-06 repository audit into a bounded, reviewable security-fix programme
before Product Phase 4, with `0.3.1` as a candidate identity, while preserving every
published `v0.3.0` tag, asset, checksum and acceptance record unchanged.

## Current Gate

The maintainer explicitly authorized S1-A only. Its nearest-boundary tests and minimum
H1/H2/M1/M3 fixes are complete on the local Windows gate, with POSIX cases honestly
deferred to S2 Linux. S1-B bootstrap work, L1/L2, S2, S3, version changes, Cloud mutation,
tags, publication and Product Phase 4 remain unauthorized.

## Status

The audit baseline and D1 repair design are persisted. S1-A implements H1 ownership
markers/conservative legacy recognition, H2 immutable verified transcript snapshots, M1
lock-held shared-state transactions with fingerprint checks, and M3 bounded Host stdin.
Focused local regression is green without Hook/Host ABI/result-schema expansion. The full
suite has one intentional Release-gate failure because the modified source still retains
the immutable v0.3.0 package/ZIP identity; changing that identity is not authorized here.

## Next Step

Stop for maintainer review. A separate authorization is required before S1-B bootstrap
work or S2 Linux/no-live Cloud regression. Do not change version/Release identity merely
to make the current v0.3.0 ZIP-hash test green.

## Authorization Boundary

Authorized now:

- preserve the audit evidence in this planning directory;
- activate this planning directory through `.planning/.active_plan`;
- edit only the production/tests directly required for H1, H2, M1 and M3;
- run local and honest platform-appropriate focused verification for S1-A.

Not authorized now:

- edit bootstrap, Release allowlist, package identity or L1/L2-only files;
- modify, move, replace or republish the existing `v0.3.0` tag or either asset;
- install or repair live Cloud state, push, tag, publish or promote a rollback baseline;
- begin Product Phase 4 features or change Host ABI, managed policy or trusted graph;
- weaken safety assertions or reinterpret Windows skips as Linux/Cloud evidence.

## Risk Register

| ID | Severity | Finding | Discovery disposition |
|---|---|---|---|
| H1 | High | Managed TOML removal can absorb a following third-party array-of-tables block, misclassify it as owned drift and delete admin policy during repair/uninstall or legacy trust cleanup. | Design a structure-aware, merge-preserving parser/edit boundary and regression fixtures. |
| H2 | High | `owned-catchup.py` validates a transcript path, then reopens it for parsing; a replacement between those operations can inject a transcript with a different session/project identity. | Design one verified descriptor/snapshot path with identity and race checks. |
| M1 | Medium | Installer install/repair derives proposed shared state before taking the lock, allowing a concurrent administrator update to be overwritten by a stale proposal. | Move read/classify/propose under the lock and revalidate immediately before write. |
| M2 | Medium | The bootstrap unnecessarily runs an unverified NVM installer through a root pipe-to-shell, selects floating Node `24` and then runs the Skills CLI remotely even though Cloud supplies compatible Node and the adapter needs only `>=18`. | Remove runtime provisioning from the adapter bootstrap; verify Cloud Node, install PWF from its pinned archive/hash and leave Node 24 to repositories that require it. |
| M3 | Medium | `hook_adapter.py` reads untrusted Host stdin without a byte limit, leaving a memory-exhaustion path outside the bounded child-output rules. | Define an ABI-compatible input budget and canary-only failure behavior. |
| L1 | Low | The Release ZIP contains `tools/import_upstream_runtime.py` but omits the patcher it requires, so importer self-check from an extracted ZIP fails. | Decide whether future ZIPs include the patcher or explicitly make the importer source-only. |
| L2 | Low | README rollback wording and several runtime comments retain pre-stable/candidate-era descriptions. | Correct documentation only after the safety scope is frozen; do not alter v0.3.0 assets. |

Full evidence, reproduction results, affected paths and required tests are in
`findings.md`.

## D1 Decision Freeze

- **Verdict:** GO for a separately authorized S1; the verdict itself authorizes no code
  or release mutation.
- **Version:** `0.3.1` remains the candidate. Any new Hook/Host ABI/schema/trusted-runtime
  edge discovered during implementation stops the patch train for a new version decision.
- **Required blockers:** H1, H2, M1, M2 and M3 must close before candidate sealing.
- **Bundled corrections:** L1 adds the importer patcher to the new 23-entry ZIP; L2 fixes
  current documentation/comments without rewriting historical or published v0.3.0 bytes.
- **H1:** conservative header scanner, explicit new owner markers, exact legacy recognizer,
  byte-preserved unknown TOML and ambiguous-state blocker; no general TOML dependency.
- **H2:** one `O_NOFOLLOW` root-relative descriptor read into an immutable, maximum
  16,000,000-byte snapshot; metadata and records validate from those bytes; no original
  path reopen; maximum 256 fallback candidates.
- **M1:** every real read/classify/propose/backup/write operation occurs under the installer
  lock, with exact-byte backups and immediate pre-rename fingerprint revalidation.
- **M2:** new 0.3.1 bootstrap removes NVM/default Node installation and root `npx`; it
  verifies platform Node `>=18`, uses Node 22 for Cloud acceptance and installs PWF from
  the already contracted v3.8.2 archive/SHA. Other repositories own Node 24.
- **M3:** one-million-byte Host stdin budget; rejected input is canary-only, child-free and
  exit-0 for a valid event.

The detailed semantics, hostile fixtures, residual races and rollback gates are frozen in
`findings.md` and must be treated as S1 acceptance criteria rather than suggestions.

## Non-goals

- Do not implement attestation, nonce framing, opt-in v3 modes, compaction, new Hook
  events, tool/permission lifecycle or completion gating.
- Do not generalize beyond the sole supported `OthmanAdi/planning-with-files v3.8.2`.
- Do not remove or rename the current canary as part of a security repair.
- Do not turn documentation cleanup or Release packaging ergonomics into a behavioral
  redesign.
- Do not treat candidate version `0.3.1` as approved, sealed, published or accepted.

## Invariants

1. Published/accepted `v0.3.0` remains the current rollback baseline; beta.2 remains the
   immutable previous fallback. Their tags, URLs, assets, hashes and evidence do not move.
2. Security-fix Discovery precedes Product Phase 4 but does not authorize Product Phase 4.
3. Managed requirements remain shared administrator state: edits must preserve unknown
   content, and unknown drift must fail closed.
4. Transcript JSONL remains mutable Host data: containment, regular-file status, session
   identity, project identity and parsed bytes must describe one verified object.
5. Nearest-boundary failing tests precede production edits. Runtime/installer/bootstrap or
   contract changes require the full suite and their platform-specific gates.
6. Windows POSIX skips stay honest. Transcript race, symlink/hardlink, process and install
   semantics require Linux and, where applicable, no-live Cloud evidence.
7. A patch version is valid only if D1 proves there is no new Hook, Host ABI, trusted graph
   or intended behavior surface. Otherwise stop and select a new version train explicitly.
8. Any future ZIP/bootstrap byte change receives a new identity and exact checksums; it can
   never replace an existing `v0.3.0` asset in place.
9. Adding this planning directory changes the future tracked repository inventory. Before
   any checkpoint/commit, update and verify the exact repository-boundary contract without
   weakening its allowlist.

## Gate Sequence

### D0 — Audit evidence persistence and activation

- [x] Restore README, architecture, roadmap and completed stable-plan authority.
- [x] Preserve high/medium/low findings, reproductions, scope and caveats.
- [x] Create `task_plan.md`, `findings.md` and `progress.md` in a standalone directory.
- [x] Activate the directory through `.planning/.active_plan`.
- [x] Keep all production, release and published v0.3.0 bytes untouched.
- **Exit:** planning-only diff with an explicit stop before design/implementation.
- **Status:** complete

### D1 — Security design freeze

- [x] Reconfirm each reproduction against the current exact source and record preconditions.
- [x] Freeze H1 ownership-preserving TOML edit semantics and hostile fixtures.
- [x] Freeze H2 descriptor/snapshot, containment, identity and replacement-race semantics.
- [x] Freeze M1 lock transaction boundaries and concurrent-writer tests.
- [x] Decide the M2/M3/L1/L2 inclusion boundary and whether `0.3.1` remains correct.
- [x] Produce GO, CONDITIONAL_GO or NO_GO plus exact implementation and rollback gates.
- **Exit:** reviewed design with no production edits and no unresolved trust-boundary choice.
- **Status:** complete — amended GO for separately authorized S1

### S1 — Nearest-boundary tests and minimum fixes

- [x] Obtain explicit S1-A implementation authorization after D1.
- [x] S1-A: add deterministic failing tests and minimum H1/H2/M1/M3 production fixes;
  preserve canary and existing Host contracts.
- [ ] S1-B: add bootstrap tests, remove NVM/Node24/root `npx`, verify platform Node `>=18`
  and install pristine PWF from the exact contracted archive/hash.
- [ ] Keep L1/L2 packaging/documentation corrections separate from runtime assertions.
- [ ] Run focused checks after each sub-gate and classify every failure honestly.
- **Exit:** reviewed source diff and focused tests green on the appropriate platform.
- **Status:** S1-A complete / S1-B unauthorized

### S2 — Full local, Linux and no-live Cloud regression

- [ ] Run importer/static/full suite and deterministic packaging checks.
- [ ] Run Linux-only races, file-identity and installer concurrency coverage.
- [ ] Prove Fresh/UserPrompt/Resume/doctor/inventory behavior in disposable no-live Cloud.
- [ ] Prove zero published-asset mutation and a clean tested workspace.
- **Exit:** exact candidate source has complete risk-proportionate regression evidence.
- **Status:** pending / unauthorized

### S3 — New candidate identity and immutable release decision

- [ ] Obtain separate version/seal/publication authorization.
- [ ] Freeze the new identity, allowlist, ZIP inputs and exact source.
- [ ] Follow ZIP-before-bootstrap hashing and downloaded-asset revalidation order.
- [ ] Promote rollback only after full Cloud acceptance; retain v0.3.0 unchanged.
- **Exit:** a separately published and accepted security release, or an explicit no-release
  closure with findings disposition recorded.
- **Status:** pending / unauthorized

## Stop Conditions

Stop immediately if a proposed change would modify existing `v0.3.0` tag/assets, absorb
unknown administrator policy, parse bytes not covered by transcript identity validation,
change Host ABI/trusted graph without a new design and version decision, require weakening
a safety assertion, conflict with Linux/Cloud evidence, or cross into implementation,
publication, live installation or Product Phase 4 without the required authorization.

## Decision Checkpoint

D0, D1 and S1-A are complete. S1-B, S2 and S3 remain separate unauthorized gates. No
current plan state authorizes bootstrap/L1/L2 work, version changes, Cloud actions,
commits/pushes, tags, assets, publication or Product Phase 4.
