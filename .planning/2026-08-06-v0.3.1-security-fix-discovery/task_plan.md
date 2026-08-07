# Task Plan: v0.3.1 Security-Fix Discovery

## Goal

Turn the 2026-08-06 repository audit into a bounded, reviewable security-fix programme
before Product Phase 4, with `0.3.1` as a candidate identity, while preserving every
published `v0.3.0` tag, asset, checksum and acceptance record unchanged.

## Current Gate

S1-C is complete on the maintainer-authorized basis
`main@06d6f4e4f8be836d4789341e20729ea033dcbdc1`. L1/L2 and the minimum 0.3.1
candidate-source identity closure are implemented: a self-contained 23-entry candidate
ZIP contract, package/contract/bootstrap identity consistency, separate current-candidate
and immutable published-v0.3.0 tests, and current documentation/comment corrections. The
v0.3.1 bootstrap retains its zero ZIP hash. Work stops for a local checkpoint before S2;
Cloud mutation, final seal, tags, push, publication, rollback promotion and Product Phase 4
remain unauthorized.

## Status

The audit baseline, D1 repair design and S1-A/S1-B implementations are persisted. S1-C has
closed the former Release-identity failures without weakening the immutable v0.3.0 oracle:
the current source/package/contract identity is an unsealed 0.3.1 candidate; its ZIP is
deterministic, contains the importer patcher and passes extracted importer `check`; the
published v0.3.0 tag independently rebuilds to its exact original ZIP hash. Focused tests
pass 9/9 and the full Windows-local suite passes 67 with 12 honest POSIX skips. This is not
Linux/no-live Cloud evidence and does not begin S2.

## Next Step

Maintainer creates a local checkpoint and reviews the S1-C diff/evidence. Do not start S2
unless it receives separate authorization; S2 must rerun the exact checkpointed source and
add the outstanding Linux and disposable no-live Cloud evidence.

## Authorization Boundary

Authorized now:

- preserve the audit evidence in this planning directory;
- activate this planning directory through `.planning/.active_plan`;
- retain checkpointed S1-A/S1-B runtime and bootstrap behavior unchanged except for a
  directly demonstrated S1-C integration defect;
- add `patches/patch_planning_skill.py` to the current candidate ZIP allowlist and prove
  extracted-ZIP importer self-containment;
- set and validate the 0.3.1 candidate source/package/contract/external-bootstrap identity
  without setting a final ZIP hash or claiming a Release;
- split current-candidate deterministic packaging assertions from immutable v0.3.0 tag and
  asset oracles;
- perform the frozen L2 README/current-comment corrections and directly required stable
  architecture/roadmap/maintainer validation synchronization;
- run local focused/full verification and deterministic candidate/stable-oracle builds.

Not authorized now:

- edit the immutable `init-cloud-sandbox-v0.3.0.bash` or any published acceptance byte;
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
- [x] Obtain explicit S1-B implementation authorization after the local S1-A checkpoint.
- [x] S1-B: add bootstrap tests, remove NVM/Node24/root `npx`, verify platform Node `>=18`
  and install pristine PWF from the exact contracted archive/hash.
- [x] Obtain explicit S1-C authorization after checkpointing S1-B.
- [x] S1-C: add the importer patcher to the 23-entry candidate ZIP and prove extracted-ZIP
  importer `check` succeeds.
- [x] S1-C: freeze package/contract/bootstrap as an unsealed 0.3.1 candidate while keeping
  published v0.3.0 tag/assets independently verifiable and unchanged.
- [x] S1-C: complete L2 current documentation/comments without rewriting historical facts.
- [x] Run focused checks after each authorized sub-gate and classify every failure honestly.
- **Exit:** reviewed source diff and focused tests green on the appropriate platform.
- **Status:** complete through S1-C / stopped before S2

### S2 — Full local, Linux and no-live Cloud regression

- [ ] Run importer/static/full suite and deterministic packaging checks.
- [ ] Run Linux-only races, file-identity and installer concurrency coverage.
- [ ] Prove Fresh/UserPrompt/Resume/doctor/inventory behavior in disposable no-live Cloud.
- [ ] Prove zero published-asset mutation and a clean tested workspace.
- **Exit:** exact candidate source has complete risk-proportionate regression evidence.
- **Status:** pending / unauthorized

### S3 — Immutable seal and release decision

- [ ] Obtain separate seal/publication authorization.
- [ ] Freeze the final identity, allowlist, ZIP inputs and exact source.
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

D0, D1 and S1-A through S1-C are complete. S2 and S3 remain separate unauthorized gates.
No current plan state authorizes changing the published v0.3.0 bootstrap/assets, setting a
final v0.3.1 ZIP hash, Cloud actions, commits/pushes, tags, publication, rollback promotion
or Product Phase 4.
