# Task Plan: v0.3.1 Security-Fix Discovery

## Goal

Turn the 2026-08-06 repository audit into a bounded, reviewable security-fix programme
before Product Phase 4, with `0.3.1` as a candidate identity, while preserving every
published `v0.3.0` tag, asset, checksum and acceptance record unchanged.

## Current Gate

The maintainer checkpointed S1-C and explicitly authorized S2 from clean source
`main@03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc`. S2 is verification-only: rerun the exact
candidate's importer/static/full/deterministic packaging matrix, execute every Linux-only
race/identity/cross-user/process case on a real Linux target, and prove disposable no-live
Cloud setup plus Fresh/UserPrompt/Resume/doctor/inventory behavior. Test evidence and
planning may be persisted; production behavior, final ZIP hash/seal, live Cloud state,
tags, publication, rollback promotion and Product Phase 4 remain unauthorized. The
maintainer has separately authorized exactly one ordinary non-force push of the frozen
candidate to new validation ref `validation/v0.3.1-s2-03a6cc2f`; this narrow transport
exception authorizes no other ref, commit or remote mutation.

The maintainer separately authorized a newcomer-oriented v0.3.1 Cloud hard-acceptance
runbook and one normal push. That documentation sub-gate is complete: evidence-only commit
`ecc0e8c4453181c207c4c901ed190c11708e8d18` is published at
`validation/v0.3.1-s2-runbook`, while the frozen exact-candidate ref still resolves to
`03a6cc2f...`. Neither commit changes any of the 23 Release inputs.

The maintainer now designates `validation/v0.3.1-s2-runbook` as the rolling S2 validation
branch. Future runs record the branch's current HEAD and require a clean checkout; they do
not hard-code an ancestor commit/tree or restrict legitimate reviewed follow-up paths by
diffing against the first candidate. The first Cloud attempt demonstrated a Linux-only
test-fixture defect in `tests/release-package.test.js`: Python `zipfile.extractall()` did
not apply the archive's recorded executable modes before extracted importer `check`. The
same attempt also showed that a valid Cloud checkout may contain the stable commit object
without a local `v0.3.0` tag ref. The maintainer authorizes the minimum fixture/tagless-
checkout test correction, runbook/planning synchronization and ordinary iterative
commit/push on the runbook branch only.

The maintainer has now confirmed that the fresh rerun at rolling runbook HEAD
`5b619dafebea25a82fdd9dfe3f4da185c644f58d` passed the entire Linux/setup/B–F matrix and
explicitly closed S2. Exact F evidence shows healthy/non-repairable doctor, installer
`0.3.1`, 11 exact payloads, adapter-only policy and zero snapshot residue. S3 remains a
separate unauthorized critical gate.

After S2 closure, the maintainer authorized a README patcher explanation and then its
migration into architecture. Only README is a Release input; no executable, contract,
bootstrap or trusted edge changed. The resulting current candidate ZIP is locally
deterministic at 23 entries / 82,658 bytes /
`c527b555bbbffdc86796ff91753186c15bdab287852fc5667edb9e5493d952ff`, while Attempt 2's
23 entries / 82,421 bytes / `2cd19e04...` remains the exact historical Cloud-PASS oracle.
The maintainer accepts risk-proportionate local/document validation without a separate S2
rerun for this ordinary documentation delta; this does not make `c527...` a Cloud PASS or
seal, and final bytes still require S3-C Cloud acceptance.

The maintainer checkpointed the documentation/evidence split at
`validation/v0.3.1-s2-runbook@9ef80422cb01c87240da884389f279c4910e2f2c` and explicitly
authorized S3-A. That local gate is complete: all 23 ZIP inputs are frozen under input-set
digest `8b1fd450...fdf58`; independent builds are byte-identical at 82,725 bytes with ZIP
SHA-256 `f097b040...31f9`; the external v0.3.1 bootstrap alone now pins that ZIP and is
21,565 bytes with SHA-256 `ce31a320...a5e8`. No commit, push, tag, publication,
downloaded-asset acceptance, rollback promotion, live Cloud mutation or Product Phase 4
was performed.

The maintainer checkpointed the completed local seal as
`validation/v0.3.1-s2-runbook@9aa2148` and instructed the agent to continue to the next
step. This explicitly authorizes S3-B only: reverify the exact sealed source/assets, create
one immutable `v0.3.1` tag at that reviewed source, publish exactly the sealed ZIP and its
external bootstrap once, and verify remote identities read-only. It does not authorize
S3-C downloaded-asset/Cloud acceptance, rollback promotion, Product Phase 4, remote main
mutation or any change to v0.3.0/beta.2.

S3-B is complete. Lightweight tag `v0.3.1` resolves remotely to exact sealed source
`9aa2148886e499f9f45594f7ae4f7681f1045de2`; the public non-draft/non-prerelease Release
contains exactly the 82,725-byte ZIP and 21,565-byte external bootstrap, whose GitHub
service-side SHA-256 digests match `f097b040...31f9` and `ce31a320...a5e8`. `Latest`
remains v0.3.0. No published asset has been downloaded or executed in this gate.

The maintainer now instructs the agent to continue, explicitly authorizing S3-C. This gate
is split into three evidence steps: the agent downloads both public Release URLs into a
fresh local directory and verifies exact filename/size/SHA/boundary; the maintainer runs
the final Fresh/Resume/doctor smoke in a new Codex Cloud container using those public
assets; only after the exact evidence is returned may the maintainer decide rollback and
`Latest` promotion. The agent remains unauthorized to submit the Cloud task itself or to
promote before that evidence.

The maintainer accepted the proposed branch/acceptance split after a Cloud attempt used
the old remote runbook branch: its bootstrap still had the development zero hash while the
copied setup expected the sealed `f097...` hash. This is an entrypoint identity mismatch,
not a Release-byte failure. The maintainer authorizes one runbook-routing correction,
planning synchronization, one documentation/planning-only checkpoint and exactly one
ordinary non-force fast-forward push of current branch
`validation/v0.3.1-s2-runbook`. The push must be bounded to observed remote parent
`101dca5a5c174badf943466fe0158065c6dd1a11` by an immediate read-only preflight and Git's
normal server-side fast-forward check; neither `--force` nor `--force-with-lease` is
permitted. No `dev` branch is created in this gate; remote `main`, tags, Release assets,
`Latest`, rollback state and product bytes remain untouched.

That authorized push completed as ordinary fast-forward commit
`e9abf838aff9496629804e927baaaa91e0068756`. The maintainer's next Cloud attempt reached
the new S3-C wrapper but stopped because the platform-provided checkout has no `origin`
remote. This is a runbook portability defect, not a repository-access failure or Release
defect: Cloud already loaded the selected repository/branch, and published-asset smoke does
not need to mutate or refetch workspace Git identity. The maintainer now requests a simpler
wrapper. Local runbook/planning correction is authorized; a further commit or push is not
inferred from that request and requires a new explicit transport authorization.

After official documentation cross-check and review of the branch-independent public-asset
installer path, the maintainer accepted the lifecycle wording and explicitly authorized
one documentation checkpoint plus one ordinary non-force fast-forward push of existing ref
`validation/v0.3.1-s2-runbook`. Immediate read-only preflight observed that ref at
`e9abf838aff9496629804e927baaaa91e0068756`; normal server-side fast-forward checks must
protect it, with no force option. Scope remains the runbook and three active planning files.

## Status

S1, S2, S3-A and S3-B are complete. S3-C is authorized and in progress at the minimum
portable Cloud wrapper checkpoint/transport; public downloaded-byte verification is
complete, while final Cloud evidence and promotion decision remain pending.
Published/accepted v0.3.0 remains the rollback oracle and `Latest`. Historical Cloud-PASS,
post-S2 observation, local seal, publication metadata and downloaded bytes remain distinct
evidence classes.

## Next Step

Finish the official Cloud checkout/cache explanation, revalidate the four-document delta,
create the one authorized documentation checkpoint, then ordinary fast-forward push the
existing validation ref after confirming remote parent `e9abf838...`; verify the exact
remote SHA and stop for a fresh/reset-cache maintainer-run section 13 plus B–F. Do not
submit Cloud, promote rollback/Latest, create `dev`, edit Release/tag/assets, update remote
main or begin Product Phase 4.

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
- run S2 verification on the exact checkpoint, including disposable no-live Cloud setup
  and black-box lifecycle tasks, provided no remote ref or live production state changes;
- persist S2 runbooks, exact commands and raw/result summaries in repository governance
  files without changing candidate production or Release inputs.
- perform exactly one ordinary non-force push of exact commit (consumed successfully on
  2026-08-07)
  `03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc` to the new validation-only remote ref
  `refs/heads/validation/v0.3.1-s2-03a6cc2f`, followed only by read-only SHA verification.
- add the v0.3.1 manual Cloud hard-acceptance runbook, update only the exact tracked-path
  inventory assertion required by that new doc, persist S2 planning, commit those
  evidence-only changes and normally push new ref
  `refs/heads/validation/v0.3.1-s2-runbook` once, followed by read-only SHA verification
  (consumed successfully on 2026-08-07).
- maintain the rolling S2 runbook branch through reviewed ordinary commits/pushes; for the
  demonstrated first-attempt failure, edit only `tests/release-package.test.js`, the
  runbook and current planning, without changing production or Release inputs.
- persist the maintainer-attested S2 PASS in the runbook/governance documents and normally
  fast-forward that evidence-only closure on the rolling runbook branch.
- execute the explicitly authorized S3-A local seal from checkpoint `9ef80422...`:
  make only seal-stability wording changes in current Release inputs, freeze/hash all 23
  input blobs, double-build/check the final ZIP, replace only the v0.3.1 bootstrap's
  64-zero ZIP hash with that exact digest, compute the bootstrap digest, rerun local
  regression and update ZIP-excluded governance evidence.
- execute S3-B publication exactly once from clean checkpoint `9aa2148`: create immutable
  tag `v0.3.1`, push only that tag, create the corresponding GitHub Release and upload only
  `pwf-codex-cloud-hooks-v0.3.1.zip` plus `init-cloud-sandbox-v0.3.1.bash`, then perform
  read-only remote identity/asset metadata verification.
- execute S3-C public-byte verification and prepare the final Cloud handoff; after the
  maintainer returns exact Fresh/Resume/doctor evidence, evaluate but do not silently
  assume rollback/Latest promotion.
- correct only the v0.3.1 hard-acceptance entry routing and active planning, checkpoint
  those documentation-only changes, and perform exactly one ordinary non-force
  fast-forward push of `validation/v0.3.1-s2-runbook`, after immediately confirming
  observed remote parent `101dca5a5c174badf943466fe0158065c6dd1a11`; do not use any
  force option (consumed successfully at `e9abf838...`).
- simplify the local S3-C wrapper and record the observed no-`origin` Cloud failure without
  changing production, published assets or remote state.
- add the reviewed official checkout/cache lifecycle explanation, checkpoint only the
  runbook and three active planning files, and perform one ordinary non-force fast-forward
  push of `validation/v0.3.1-s2-runbook` after confirming remote parent `e9abf838...`.

Not authorized now:

- edit the immutable `init-cloud-sandbox-v0.3.0.bash` or any published acceptance byte;
- modify, move, replace or republish the existing `v0.3.0` tag or either asset;
- submit or mutate live Cloud state from this agent, push any branch except the one exact
  authorized validation fast-forward, move any existing tag, publish any asset or promote
  a rollback baseline;
- begin Product Phase 4 features or change Host ABI, managed policy or trusted graph;
- weaken safety assertions or reinterpret Windows skips as Linux/Cloud evidence.
- force-push, update remote `main`, move `validation/v0.3.1-s2-03a6cc2f`, push another
  ref, create/move a tag, publish assets, modify live `/opt/codex` from this agent, or reuse
  a disposable Cloud container as production;
- create any commit outside the authorized runbook/planning checkpoint, push another
  branch/ref, call publication or local download accepted rollback, promote `Latest`
  before exact Cloud evidence, or modify any v0.3.0/beta.2/v0.3.1 published identity.

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

- [x] Run importer/static/full suite and deterministic packaging checks.
- [x] Transport the exact checkpoint through the separately authorized new validation ref
  and verify its remote SHA read-only.
- [x] Publish the self-contained S2 manual runbook on a separate evidence-only validation
  branch without changing candidate Release inputs or moving the exact-candidate ref.
- [x] Classify Cloud attempt 1 and locally validate the minimum ZIP-mode fixture plus
  tagless-checkout stable-oracle corrections.
- [x] Run Linux-only races, file-identity and installer concurrency coverage.
- [x] Prove Fresh/UserPrompt/Resume/doctor/inventory behavior in disposable no-live Cloud.
- [x] Prove zero published-asset mutation and a clean tested workspace.
- **Exit:** exact candidate source has complete risk-proportionate regression evidence.
- **Status:** complete / Attempt 2 full Linux, setup and B–F PASS / stopped before S3

### S3 — Immutable seal and release decision

- [x] Obtain explicit S3-A authorization from the maintainer after the S2 evidence checkpoint.
- [x] **S3-A local seal:** freeze final source and all 23 ZIP-input blobs; perform
  independent double build/check; write that exact ZIP hash into only the external
  v0.3.1 bootstrap; compute bootstrap SHA; rerun regression; stop before tag/publication.
- [x] **S3-B publication authorization:** create immutable `v0.3.1` tag/Release from the
  reviewed sealed source and upload exactly the ZIP plus external bootstrap once.
- [ ] **S3-C acceptance/promotion authorization:** redownload both assets, reverify
  filename/size/SHA/boundary, run final Fresh/Resume/doctor smoke, then decide whether to
  promote v0.3.1 as rollback while retaining v0.3.0 unchanged.
- **Exit:** a separately published and accepted security release, or an explicit no-release
  closure with findings disposition recorded.
- **Status:** S3-A and S3-B complete / S3-C authorized and in progress

## Stop Conditions

Stop immediately if a proposed change would modify existing `v0.3.0` tag/assets, absorb
unknown administrator policy, parse bytes not covered by transcript identity validation,
change Host ABI/trusted graph without a new design and version decision, require weakening
a safety assertion, conflict with Linux/Cloud evidence, or cross into implementation,
publication, live installation or Product Phase 4 without the required authorization.

## Decision Checkpoint

D0, D1, S1-A through S1-C, S2, S3-A and S3-B are complete. S3-C is authorized only under
the three-step evidence split above. Public-byte PASS alone cannot close S3-C: stop for
maintainer-run Cloud evidence before rollback/Latest promotion. Product Phase 4, branch
push and modification of any published v0.3.0/beta.2/v0.3.1 identity remain unauthorized.
