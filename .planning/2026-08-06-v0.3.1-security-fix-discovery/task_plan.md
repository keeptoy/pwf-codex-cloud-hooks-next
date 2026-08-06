# Task Plan: v0.3.1 Security-Fix Discovery

## Goal

Turn the 2026-08-06 repository audit into a bounded, reviewable security-fix programme
before Product Phase 4, with `0.3.1` as a candidate identity, while preserving every
published `v0.3.0` tag, asset, checksum and acceptance record unchanged.

## Current Gate

A standalone security-fix Discovery is authorized. D0 evidence persistence and plan
activation are complete. No production implementation, version change, Cloud mutation,
tag, publication or Product Phase 4 work is authorized by this plan state.

## Status

The audit baseline is persisted with two high-risk, three medium-risk and two low-risk
findings. The classifications are prioritization decisions, not claims that an incident
has occurred. `v0.3.1` remains a candidate until D1 proves the fixes stay inside the
existing `0.3.x` behavior, Host ABI and trusted graph.

## Next Step

Stop for maintainer review of the persisted risk register; if continued under this
Discovery, freeze the D1 repair designs and boundary-test matrix before changing code.

## Authorization Boundary

Authorized now:

- preserve the audit evidence in this planning directory;
- activate this planning directory through `.planning/.active_plan`;
- perform read-only Discovery and design work for the listed findings.

Not authorized now:

- edit production/runtime/installer/bootstrap/contracts or change package identity;
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
| M2 | Medium | The bootstrap runs an unverified remote NVM installer through a pipe to shell and selects floating Node major `24`. | Decide whether a future, newly identified bootstrap pins and verifies both inputs. |
| M3 | Medium | `hook_adapter.py` reads untrusted Host stdin without a byte limit, leaving a memory-exhaustion path outside the bounded child-output rules. | Define an ABI-compatible input budget and canary-only failure behavior. |
| L1 | Low | The Release ZIP contains `tools/import_upstream_runtime.py` but omits the patcher it requires, so importer self-check from an extracted ZIP fails. | Decide whether future ZIPs include the patcher or explicitly make the importer source-only. |
| L2 | Low | README rollback wording and several runtime comments retain pre-stable/candidate-era descriptions. | Correct documentation only after the safety scope is frozen; do not alter v0.3.0 assets. |

Full evidence, reproduction results, affected paths and required tests are in
`findings.md`.

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

- [ ] Reconfirm each reproduction against the current exact source and record preconditions.
- [ ] Freeze H1 ownership-preserving TOML edit semantics and hostile fixtures.
- [ ] Freeze H2 descriptor/snapshot, containment, identity and replacement-race semantics.
- [ ] Freeze M1 lock transaction boundaries and concurrent-writer tests.
- [ ] Decide the M2/M3/L1/L2 inclusion boundary and whether `0.3.1` remains correct.
- [ ] Produce GO, CONDITIONAL_GO or NO_GO plus exact implementation and rollback gates.
- **Exit:** reviewed design with no production edits and no unresolved trust-boundary choice.
- **Status:** pending

### S1 — Nearest-boundary tests and minimum fixes

- [ ] Obtain explicit implementation authorization after D1.
- [ ] Add deterministic failing tests before each production change.
- [ ] Implement only reviewed minimum fixes; preserve canary and existing Host contracts.
- [ ] Run focused checks after each finding and classify every failure honestly.
- **Exit:** reviewed source diff and focused tests green on the appropriate platform.
- **Status:** pending / unauthorized

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

D0 is complete. The maintainer should first review the risk ranking and scope. Continuing
this authorized Discovery may enter D1 read-only design work; entering S1 or any later
mutation gate requires explicit authorization.
