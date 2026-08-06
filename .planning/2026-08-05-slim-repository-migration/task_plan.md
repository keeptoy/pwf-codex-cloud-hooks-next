# Task Plan: Slim Repository Migration

## Goal

Transform the accepted beta.2 exact mirror into a focused successor repository
without changing production behavior, weakening safety coverage, or rewriting the
immutable M1 audit oracle.

## Current Gate

M4-B archive/provenance handoff complete; maintainer checkpoint and M4-C authorization required.

## Status

M2-A/B/C, M3 Discovery, and M3-A are complete. The maintainer has explicitly
authorized M3-B. The repaired accepted development
commit is `39795283cd65f84547651d7bec816191fb5bfedf`; its complete Fresh Cloud rerun
passes Linux 63/63, isolated install/doctor, adapter-only policy, 11 payload,
deterministic 22-entry ZIP, zero-hash bootstrap, and clean workspace. Accepted ZIP
SHA-256 is `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`.
M3-B disposable setup is PASS: exact accepted HEAD and ZIP SHA matched, the
bootstrap completed, the global Skill is pristine upstream v3.8.2, install and
doctor are healthy, and both adapter protocol probes passed. Fresh automatic
Runtime injection is also PASS with SessionStart
`source=startup`, UserPromptSubmit, and all auxiliary planning observations.
The controlled baseline acknowledgment and immediate canonical no-tools check are
PASS: all six canary/marker/framing/progress/context fields were observed.
The long wrapper also returned its exact sole acknowledgment without echoing the
tail sentinel or modifying planning state.
Automatic Resume is PASS: source `resume`, previous session, codex runtime,
`task_plan.md` update at message #36, 16 unsynced messages, bounded truncation,
C7F4 tail preservation, catch-up-before-plan ordering, and restored canonical
plan framing were all observed.
Post-resume doctor is PASS with healthy true, repairable false, empty errors and
blockers, installer `0.3.0-beta.3-dev`, exact 11-file manifest inventory, and zero
snapshot leftovers. M3-B is complete.
M3-C closure proves the tested-commit descendant contains exactly seven existing
governance paths, with root/tree/path/mode/audit/remote/Release boundaries intact.
M4 Discovery then froze create-main-then-switch and preserved both evidence refs.
M4-A created exact `main@cc9bc878ddc7d70c25156dd053e2874758f0814a`, made it
the public default, activated minimum main/evidence integrity rulesets, and passed
fresh default clone. M4-B now publishes exact cross-repository provenance and old
archive/rollback navigation without successor README/Release-input drift or beta.2
asset mutation. M4-C, Release/tag, live Cloud, production behavior, repository
rename/archive/delete, and Product Phase 4 remain unauthorized.

## Next Step

Review and checkpoint the published M4-B governance descendants, then wait for
explicit M4-C authorization. M4-C alone may run the frozen no-live cutover,
rollback-download, clean-clone, and handoff acceptance. Do not publish a Release/
tag, touch live Cloud, modify production behavior, rename/archive either repository,
or enter Product Phase 4.

## Invariants

- `audit/beta2-exact` remains clean at the frozen beta.2 commit and tree.
- Production adapter, owned/upstream runtimes, installer, patcher, and Release
  builder retain their M1 bytes and Git modes. Schema comments and the importer
  bytecode-hygiene tool change are metadata/development-only and hash-pinned.
- The M2 root commit remains parentless and immutable; M3 governance changes may
  become a normal child commit only after review and must not rewrite that root.
- The slim branch remains local and unpushed throughout Discovery.
- No Cloud/live execution, Release, cutover, production activation, or Phase 4
  work is authorized by Discovery.
- M4 Discovery may update governance documents and add one dedicated design/runbook,
  but it may not move local/remote refs, rewrite the M2 root or M1 audit oracle, or
  turn a proposed external repository setting into an observed fact.

## Gate Sequence

- [x] Create a verified secondary worktree and local orphan branch.
- [x] Selectively import the frozen M2 source allowlist.
- [x] Complete the six behavior/Git-aware renames.
- [x] Create minimal stable-document entrypoints and fresh planning files.
- [x] Pass M2-A structural, byte, mode, and audit-oracle verification.
- [x] Receive a maintainer checkpoint before M2-B.
- [x] Rewrite the eight-document authority and repository-wide LF contract.
- [x] Rewrite behavior-named fixture/test references and stable boundary tests.
- [x] Apply beta.3-dev, successor bootstrap, overlay/provenance, and manifest hashes.
- [x] Pass M2-B validation and stop before M2-C/root commit.
- [x] Receive a maintainer checkpoint and explicit authorization for M2-C.
- [x] Pass final pre-commit and deterministic double-build gates.
- [x] Create and verify the single parentless 59-path root commit.
- [x] Pass fresh Windows clone importer/static/full-suite/LF/mode validation.
- [x] Close M2 locally and stop before M3/push.
- [x] Receive the M2 checkpoint and authorization for M3 Discovery only.
- [x] Freeze M3-A remote transport and no-live Cloud/Linux seal.
- [x] Freeze M3-B disposable setup plus Fresh/UserPrompt/Resume hard acceptance.
- [x] Freeze M3-C evidence closure and the M4 stop boundary.
- [x] Stop for explicit authorization before creating an M3 child commit or push.
- [x] Pass M3-A transport, complete no-live Linux/Cloud seal, isolated doctor,
  deterministic ZIP, zero-hash, and clean-workspace gates.
- [x] Receive explicit maintainer authorization before M3-B disposable setup.
- [x] Pass M3-B disposable setup from exact accepted HEAD and ZIP SHA.
- [x] Pass M3-B Fresh automatic startup/UserPrompt lifecycle gate.
- [x] Confirm the controlled baseline and canonical UserPrompt with all six
  automatic-injection observations.
- [x] Preserve the real structured planning update in Resume catch-up evidence.
- [x] Receive the exact long-wrapper acknowledgment without further planning edits.
- [x] Pass Resume catch-up, bounded tail, ordering, and canonical restoration.
- [x] Pass post-resume doctor, 11-file inventory, version, and zero-residue gate.
- [x] Receive explicit maintainer authorization before M3-C evidence closure.
- [x] Prove the complete closure descendant is exactly seven existing governance
  paths with root/path/mode/audit/remote/Release boundaries intact.
- [x] Pass final document/importer/focused-test and staged-candidate checks.
- [x] Create and verify one local M3 closure commit without push.
- [x] Audit exact M4 local/remote topology, repository settings dependencies,
  provenance/navigation/rollback requirements, and cutover route alternatives.
- [x] Freeze M4 sub-gates, explicit external mutations, stop conditions, rollback,
  Cloud/Release evidence, and the sole post-Discovery Next Step.
- [x] Pass document/reference/boundary checks and stop for explicit M4-A authority.
- [x] Receive maintainer checkpoint and explicit M4-A-only authorization.
- [x] Complete M4-A settings-channel preflight with authenticated GitHub CLI;
  local/remote identity, classic protection observation, regression, and ZIP PASS.
- [x] Create remote `main` from exact `cc9bc878...` by non-force ref and verify all
  three branch identities.
- [x] Switch the successor default to `main` and activate the reviewed integrity
  policy through a controlled, observable GitHub interface.
- [x] Verify a fresh no-branch clone selects exact `main`, record M4-A evidence,
  and stop before M4-B.
- [x] Receive the M4-A local checkpoint and explicit M4-B authorization.
- [x] Add exact old-repository/beta.2 asset links and observed main/default/policy
  facts to successor provenance, roadmap, handoff, and planning without README or
  Release-input drift.
- [x] Add the old-repository archive/rollback banner and historical-authority state
  while preserving beta.2 install instructions, source, tags, Releases, and default.
- [x] Pass dual-repository document/boundary/Release-drift and remote-identity gates.
- [x] Publish both governance descendants by normal fast-forward, verify GitHub
  navigation/authority facts, and stop before M4-C.

## M4-B Verification

- Successor changed seven governance/provenance documents with zero README or
  22-entry Release-input overlap; archive changed exactly six navigation documents.
- Successor importer and repository boundary 3/3 PASS; deterministic ZIP remains
  22 entries / 75,323 bytes / accepted SHA-256 `82770964...`.
- All 13 changed Markdown files are strict UTF-8/LF with balanced fences and valid
  local links; both worktrees pass `git diff --check` before commit.
- Old beta.2 Release ID `365362981` and asset IDs `502341456` / `502341323` retain
  exact sizes and SHA-256 digests; default remains `0.3.0-beta.2`, public/unarchived.
- Both repositories publish by normal fast-forward only; no force, rename, archive,
  tag/Release, live Cloud, production, or Product Phase 4 mutation is authorized.
- `M4B_ARCHIVE_PROVENANCE_HANDOFF=PASS`; M4-C remains separately unauthorized.

## M4-A Verification

- Exact non-force remote `main`: `cc9bc878ddc7d70c25156dd053e2874758f0814a`.
- Development evidence remains `39795283cd65f84547651d7bec816191fb5bfedf`;
  audit oracle remains `bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b`.
- Successor default is `main`; repository remains public and unarchived.
- `main-integrity` targets exact `main`; `evidence-integrity` targets the exact
  development/audit refs. Both are active with deletion/non-fast-forward rules
  only; classic protection is absent and no required CI checks were invented.
- No-branch public HTTPS clone selects `main@cc9bc878...`, 61 paths, exactly four
  `100755` upstream runtime files, and a clean workspace.
- Release/tag/live Cloud/old-repository/production/Product Phase 4 mutations: 0.
- `M4A_SUCCESSOR_AUTHORITY_CUTOVER=PASS`; M4-B remains separately unauthorized.

## M4 Discovery Verification

- Current GitHub facts: successor is public/unarchived, default is
  `migration/slim-beta3-dev`, remote branches are development/audit only, and
  `main`, tags, Releases, and repository rulesets are absent. Classic protection
  remains an explicit authenticated M4-A preflight observation.
- Route: create exact `main` from an audited governance descendant, verify it, then
  switch default; preserve tested development and audit refs; do not rename repos or
  couple cutover with beta.3 Release.
- Exact boundary: 61 tracked paths after one new M4 governance document; Release
  contract remains 22 entries and excludes docs/tests/planning.
- Importer and Node syntax PASS; strict UTF-8/fences/local links PASS for 13 docs;
  focused architecture/repository contracts PASS 4/4; `git diff --check` PASS.
- Full Windows suite: 63 registered / 52 pass / 0 fail / 11 honest POSIX skips.
- Two ZIP builds/checks: 22 entries / 75,323 bytes / exact accepted SHA-256
  `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`.
- No push, remote ref/default/ruleset/description mutation, old-repository edit,
  Release, live Cloud action, production change, or Product Phase 4 action occurred.

## M3-C Closure Audit

- Candidate diff from tested `39795283...`: exactly seven existing governance
  paths; no production, test, contract, bootstrap, Release-input, or new-path drift.
- Identity: one parentless M2 root `3234e4e...` / tree `300f5a86...`; 60 tracked
  paths; exactly four `100755` upstream runtime files.
- Audit oracle: local and remote `audit/beta2-exact` remain `bbad3703...` / tree
  `ff49c3c...`.
- Remote development branch remains exact tested HEAD
  `39795283cd65f84547651d7bec816191fb5bfedf`; Release allowlist overlap is zero.
- Importer/static checks PASS; 13 maintained Markdown documents are strict UTF-8
  with balanced fences; architecture/repository focused tests PASS 4/4.
- Two development ZIP builds remain byte-identical at 22 entries / 75,323 bytes /
  SHA-256 `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`.

## M3 Discovery Verification

- Documentation UTF-8, Markdown fences, local links, and `git diff --check`: PASS.
- Full Windows suite: 63 registered / 52 pass / 0 fail / 11 honest POSIX skips.
- Importer, in-memory Python compilation, and Node syntax: PASS.
- Two independent development ZIP builds: 22 entries / 74,958 bytes / identical
  SHA-256 `c2f5410c2c53082955ab3a5f9dec64abbd229893796bb74455f622e3a252dcb1`.
- Bash is unavailable on this host; M3-A freezes `bash -n` and the complete Linux
  script as a Cloud requirement rather than reporting a local PASS.
- The successor checkpoint target contains 60 paths: the immutable 59-path M2
  root plus the M3 runbook. Only `tests/repository-boundary.test.js` changes in
  the test tree, solely to include that governance path; all safety tests remain
  byte-identical to M2.

## M3 pre-A README Refinement Verification

- README keeps stable supported runtime behavior and the zero-hash safety warning;
  changing gate status is routed to ROADMAP and exact execution state to this plan.
- README contains the bounded four-path Git mode/LF quick recovery; the complete
  renormalize/fresh-clone procedure remains in `docs/git-file-modes.md`.
- Importer and document structure/stale-authority checks: PASS.
- Two independent development ZIP builds: 22 entries / 75,323 bytes / identical
  SHA-256 `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`.
- Full Windows suite: 63 registered / 52 pass / 0 fail / 11 honest POSIX skips.
- The changed README is the only changed Release ZIP input; bootstrap remains
  external, zero-hash, and unchanged.

## M3-A Runbook Repair Verification

- Installer source and Cloud output agree on one event-group list containing one
  nested `hooks` handler list; the runbook validates both levels, handler type,
  and adapter-only commands.
- Existing repository-boundary regression extended without adding a test case:
  focused 3/3 PASS; full Windows suite remains 63 registered / 52 pass / 0 fail /
  11 honest POSIX skips.
- Importer, Python/Node static checks, direct nested TOML parser sample, exact
  60-path boundary, and `git diff --check` PASS.
- Relative to the immutable M2 root, product/build drift remains zero and the only
  test-tree drift remains `tests/repository-boundary.test.js`. No Release allowlist
  input or bootstrap byte changed.

## M3-A Cloud Acceptance

- Accepted HEAD: `39795283cd65f84547651d7bec816191fb5bfedf`.
- Linux: 63/63/0/0; root/cross-user/process-group PASS.
- Isolated install/doctor and adapter-only Managed Policy PASS; payload count 11.
- Development ZIP: 22 entries / 75,323 bytes / SHA-256
  `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`.
- Bootstrap zero hash PASS; stderr empty; workspace clean; terminal M3-A PASS marker
  observed. M3-A is complete and does not authorize M3-B.

## M2-B Verification

- Focused migration suite: 22 registered / 22 pass / 0 fail / 0 skipped.
- Full Windows suite: 63 registered / 52 pass / 0 fail / 11 honest POSIX skips.
- Exact boundary: 59 indexed paths, zero untracked paths, and exactly four
  `100755` managed upstream runtime files.
- Integrity: importer healthy, 15 manifest-linked hashes exact, zero generated
  `__pycache__`, and `git diff --cached --check` clean.
- Preservation: ten production implementation files remain byte-identical to the
  M1 audit tree; three renamed fixture blobs remain byte-identical.
- Text/docs: all 59 tracked files are strict UTF-8 with LF attributes and no CR;
  12 maintained Markdown documents have balanced fences and valid local links.
- Static checks: in-memory Python compilation and Node syntax checks pass. Bash is
  unavailable on this Windows host, so `bash -n` and Linux semantics remain for
  the later Cloud gate rather than being reported as local PASS.

## M2-C Pre-commit Verification

- Importer/static/inventory: PASS; 59 paths, zero untracked, four `100755`, zero
  bytecode cache, and clean cached diff.
- Full Windows suite: 63 registered / 52 pass / 0 fail / 11 honest POSIX skips.
- Two independent final-tree development ZIP builds are byte-identical: 22
  entries, 74,899 bytes, SHA-256
  `647e16852f818a84f4b5d4872a876d411cdbdfa7671f07b7614f35f12aae5e7d`.
- Bootstrap remains external and deliberately unusable with the beta.3-dev
  successor identity and 64-zero checksum.

## M2-C Root/Fresh-clone Verification

- Root history: one commit, zero parents, exact 59 paths, exactly four `100755`
  entries, clean worktree, and no push.
- Fresh Windows clone used `core.autocrlf=true` and materialized all 59 tracked
  files with zero CR bytes; importer, exact modes, static checks, and clean status
  all pass without local LF repair.
- Fresh-clone full suite: 63 registered / 52 pass / 0 fail / 11 honest POSIX skips.
- M1 audit commit/tree and published beta.2 evidence remain unchanged.

## M2-A Verification

- Exact allowlist: 59 tracked paths; no untracked or forbidden paths.
- Source preservation: 45 retained blobs plus six renamed blobs byte-identical;
  46 retained modes plus six renamed modes identical to the audit tree.
- Executable set: exactly the four managed `runtime/upstream/*` files.
- Fresh planning pointer: `2026-08-05-slim-repository-migration`.
- Branch: local unborn `migration/slim-beta3-dev`; no root commit or push.
- Audit oracle: clean and unchanged at the frozen commit and tree.
- `git diff --cached --check` has one inherited finding only:
  `docs/git-file-modes.md:138: new blank line at EOF.` The renamed source bytes
  are intentionally unchanged in M2-A; M2-B owns the document rewrite and cleanup.

## Stop Conditions

Stop immediately if the exact path boundary cannot be met, production bytes or
runtime modes drift, a renamed source loses identity unexpectedly, the audit ref
moves, or completing the skeleton requires a production/schema/security change.

Any next gate must stop if it requires weakening a production safety assertion,
changing Host ABI/runtime behavior/schema semantics without a new contract,
publishing the zero-hash bootstrap, or moving the frozen M1 audit oracle.
