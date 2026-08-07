# Progress: v0.3.1 Security-Fix Discovery

## 2026-08-06 — Repository audit baseline

- Read the repository authority chain, stable-release evidence, relevant installer,
  adapter/runtime, contracts, tests and release tooling.
- Used the user-provided Git Bash installation for syntax and black-box checks that cannot
  be represented honestly by PowerShell alone.
- Reproduced H1 shared-policy deletion/misclassification and H2 transcript replacement
  injection with deterministic local probes.
- Identified M1 pre-lock stale proposal, M2 bootstrap supply-chain/reproducibility, M3
  unbounded Host stdin, L1 non-self-contained Release importer and L2 documentation drift.
- Verified the healthy stable baseline: full Windows suite 63 registered / 52 passed /
  0 failed / 11 POSIX skips; importer/static/Bash checks green; deterministic published
  ZIP/bootstrap hashes match; Git object database and tag/source boundary clean.
- Did not edit production, tag, asset, package identity, Cloud state or Release state.

## 2026-08-06 — D0 persistence and activation

- Maintainer explicitly authorized a standalone security-fix Discovery before Product
  Phase 4, with `0.3.1` as a candidate version and an absolute prohibition on modifying
  existing v0.3.0 tags or assets.
- Selected `planning-with-files` because the request requires durable multi-gate state,
  risk evidence and a resumable authorization boundary.
- Restored README, architecture, roadmap, `.planning/.active_plan` and all three files of
  the completed stable-release plan before creating the successor plan.
- Created this standalone task plan, findings register and progress log; switched
  `.planning/.active_plan` to this directory.
- D0 is complete and stops for maintainer review. D1 remains read-only Discovery/design;
  production implementation and all later gates remain unauthorized.

## Validation record

| Check | Result |
|---|---|
| Pre-edit `git status --short --branch` | PASS — clean `main...origin/main` |
| Planning skill catch-up | PASS — no unrecorded prior-session delta reported |
| Authority-chain reread | PASS — stable v0.3.0 immutable; Product Phase 4 still separate |
| New planning files | PASS — task plan, findings and progress created |
| Active pointer | PASS — points to `2026-08-06-v0.3.1-security-fix-discovery` |
| Production/Release file edits in D0 | PASS — none |

## Error log from audit and D0

| Error | Attempt | Resolution |
|---|---:|---|
| Sandboxed Git Bash signal/pipe check returned Win32 error 5 | 1 | Re-ran the same read-only validation outside that process restriction; it passed. |
| Initial Python temporary-directory probe hit sandbox permission limits | 1 | Re-ran with an approved writable temporary location; probe completed. |
| Two Git Bash inline commands were distorted by PowerShell/Bash quoting | 2 | Switched to a base64-fed read-only runner; checks passed without changing repository files. |
| First final full suite found `runtime/__pycache__/owned-catchup.cpython-313.pyc` created by an audit import | 1 | Inspected and removed only the exact generated cache, then reran the full suite green and verified zero cache residue. |
| An unquoted PowerShell `^{commit}` revision expression was parsed incorrectly | 1 | Quoted the revision expression and reran the read-only Git check successfully. |
| Initial combined planning patch lacked the terminal newline required by `apply_patch` | 1 | The patch was rejected atomically; split it by file, added the required newline and retried. |

## 5-question reboot check

| Question | Answer |
|---|---|
| Where am I? | D0 complete; active security-fix Discovery stops for maintainer review. |
| Where am I going? | D1 design freeze, then only explicitly authorized implementation, regression and new-release gates. |
| What is the goal? | Bound and remediate audited security risks before Product Phase 4 without changing v0.3.0. |
| What have I learned? | Two reproducible high risks, three medium risks and two low risks are detailed in `findings.md`. |
| What have I done? | Persisted and activated a planning-only security Discovery; no product or Release byte changed. |

## 2026-08-06 — Cloud setup/runtime lifecycle clarification

- Maintainer supplied the observed sequence: new container, repository clone/checkout,
  setup shell without Host-provided `CODEX_HOME`, then agent/runtime and managed Hooks with
  `CODEX_HOME=/opt/codex`.
- The OpenAI Codex manual helper was attempted first as required, but its official endpoint
  returned HTTP 403 through the current proxy. Switched to the official OpenAI Docs MCP
  route instead of repeating the failed request.
- Official `Cloud environments` documentation confirmed checkout → setup → agent ordering,
  the separate setup Bash session, non-persistence of setup-only exports, and the distinct
  full-chat behavior of variables explicitly configured in environment settings.
- Official `Environment variables` documentation confirmed that public `CODEX_HOME` is a
  configurable state root with general default `~/.codex`; it does not make `/opt/codex`
  a permanent Cloud contract.
- Local provenance, fixture and regression evidence reconfirmed the narrower 2026-08 fact:
  `CODEX_HOME` absent at sandbox initialization, then `/opt/codex` in agent/managed-Hook
  stages with `/opt/codex/sessions` as the observed session store.
- Updated `ARCHITECTURE.md` to separate official lifecycle guarantees, dated repository
  observations and the resulting bootstrap/runtime discovery constraints. No production,
  contract, version, tag, asset, Cloud state or Product Phase 4 behavior changed.
- The first focused test run was blocked by the Windows sandbox runner (`spawn EPERM`).
  The permitted out-of-sandbox rerun passed architecture and Cloud-fixture coverage but
  exposed a pre-existing checkpoint drift: the exact repository allowlist still expected
  65 paths and omitted this plan's three now-tracked files.
- Updated only the repository-boundary governance fixture with those exact three paths and
  the resulting count of 68, satisfying task-plan invariant 9 without broadening the
  repository or Release allowlist.
- Focused rerun PASS: 6 tests / 6 passed / 0 failed across architecture contracts, Cloud
  fixtures and repository boundary. UTF-8, no BOM, LF-only, final newline, balanced
  Markdown fences, local links, trailing whitespace and `git diff --check` also PASS.
- Maintainer then supplied a Codex Cloud environment-settings screenshot showing separate
  environment-variable, secret, container-cache and automatic/manual setup-script controls.
  Refined the architecture and findings to distinguish platform-configured variables,
  setup-shell-local variables and later runtime/Hook Host variables. The screenshot is
  retained as dated UI evidence, not promoted to a permanent platform contract.
- The first combined refinement patch used an imprecise findings line-wrap anchor and was
  rejected atomically. Retried as three file-scoped patches with exact anchors; no partial
  change from the failed attempt was retained.
- Screenshot refinement validation PASS: the same 6 focused architecture/Cloud/repository
  tests passed; UTF-8, LF-only, final newline, Markdown fences, local links, trailing
  whitespace and `git diff --check` remained clean.

## 2026-08-06 — D1 design freeze resumed

- Maintainer authorized continuation into D1 and chose not to create or rename a local or
  remote branch. Production implementation and every S1+ mutation remain unauthorized.
- After context compaction, reran the planning catch-up and restored README, architecture,
  roadmap, active plan, findings, progress, exact HEAD and worktree state as required by
  `AGENTS.md`.
- Recovery result: clean `main@dac1b5ebdf6d09a299d3eb002c182d0d7ac2caf0`, two local
  checkpoints ahead of `origin/main`, with the security-fix Discovery still active.
- A combined read-only `rg` inspection named a non-existent historical test path
  `tests/hook-regression.test.js` and therefore returned exit 1. Repository enumeration
  confirmed the correct file is `tests/hook-adapter.test.js`; subsequent inspection uses
  that path.
- The first D1 H2 rerun used Python's user temporary directory and was blocked at fixture
  directory creation by the managed Windows sandbox (`PermissionError: [WinError 5]`). No
  product or fixture byte was written. The retry uses an exact, disposable path under the
  approved workspace and verifies/removes only that path afterward.
- The workspace-local H2 retry completed successfully and reconfirmed the identity-swap
  path: `report_emitted`, `inject=true` and the replacement-only sentinel present after a
  different-session/different-project file replaced the selected path.
- The retry removed its exact disposable probe directory. Importing the runtime created
  only `runtime/__pycache__/owned-catchup.cpython-313.pyc`; after inspecting its path and
  timestamp, removed that generated file and its now-empty cache directory. It is not a
  tracked or recoverable source artifact.
- Performed a defensive, primary-source-only M2 web check. Official NVM source shows that
  the verified installer would still fetch additional NVM content by Git on this image;
  official Node pages identify v24 as LTS and v24.18.1 as the exact current v24 artifact
  set on the D1 date. This initially supported removing NVM and pinning one official Node
  artifact plus checksum; the later M2 amendment supersedes that Node-download route.
- Direct browser opens of the Node `SHASUMS256.txt` URL were rejected by the browsing
  safety layer as an unsafe URL, while the official release index/search remained
  accessible. D1 does not guess the digest; exact signed-checksum extraction is an S1
  precondition and any value must be persisted before production editing.
- Froze H1 as a dependency-free, byte-preserving TOML header scanner with explicit new
  ownership markers, exact one-way v0.3.0 legacy recognition and fail-closed ambiguity.
- Froze H2 as a root-relative `O_NOFOLLOW` descriptor read into one immutable maximum
  16 MB byte snapshot, with before/after/path identity checks, no original-path reopen and
  a 256-candidate fallback scan ceiling.
- Froze M1 as a complete lock-held shared-state transaction with backups from proposal
  bytes, pre-rename fingerprint checks, post-write verification and an explicitly
  documented residual for non-cooperating writers around atomic rename.
- Initially included M2 and M3 as 0.3.1 security blockers with a pinned Node v24.18.1 x64
  bootstrap artifact and a 1,000,000-byte adapter Host-stdin cap. The later M2 amendment
  supersedes only the Node-download route; the M2/M3 blocker classifications remain.
- Included L1/L2 in the source train: future ZIP includes the importer patcher as entry 23,
  while current docs/comments are corrected without touching any published v0.3.0 byte.
- Recorded D1 verdict `GO` for a separately authorized S1 and marked D1 complete. This
  does not authorize production edits, version mutation, S2/S3, Cloud actions, commit/push,
  tags, assets, publication or Product Phase 4.

## D1 validation record

| Check | Result |
|---|---|
| Exact D1 source | PASS — clean checkpoint basis `dac1b5ebdf6d09a299d3eb002c182d0d7ac2caf0` |
| H1 deterministic rerun | PASS — unowned drift false, repairable true, both administrator arrays deleted by current code |
| H2 deterministic rerun | PASS — replacement sentinel reached an injected report after different identity replaced the selected path |
| Working diff scope | PASS — only this plan's `task_plan.md`, `findings.md` and `progress.md` are modified |
| Active pointer | PASS — still `2026-08-06-v0.3.1-security-fix-discovery` |
| Cache residue | PASS — zero `__pycache__` directories and zero `.pyc` files |
| Planning Markdown | PASS — UTF-8, no BOM/CR, final newline, balanced fences, valid local links and no trailing whitespace |
| `git diff --check` | PASS |
| Production/contract/version/asset edits in D1 | PASS — none |

No product suite was rerun for this planning-only D1 diff. S1 must begin with the frozen
failing boundary tests and then run risk-proportionate focused checks; S2 owns the full
local/Linux/no-live Cloud regression.

## 2026-08-06 — M2 Cloud-runtime scope discussion

- Maintainer clarified that Codex Cloud already offers Node 18/20/22 in environment package
  settings, this adapter supports older Node, and Node 24 is an unrelated requirement of
  other repositories.
- Used `openai-docs` because this depends on current Codex Cloud behavior. The Codex manual
  helper again received HTTP 403 through the proxy; the official Docs MCP successfully
  fetched the Cloud-environment section instead.
- Official documentation confirms the universal image has preinstalled runtimes and the UI
  can pin Node.js. The official reference-image README lists 18/20/22; its current Dockerfile
  also mentions 24, but the repository says it is not identical to production. Retained the
  maintainer's actual UI observation as the acceptance fact.
- Local inspection confirms Node is not part of the managed Hook runtime: it is used only
  for the JavaScript installer/tests and setup-time `npx`; `package.json` requires only
  Node 18+, while the installed bundle is Python/POSIX.
- Recorded a candidate D1 amendment: use Cloud-selected Node 22, verify `>=18`, eliminate
  NVM/default Node installation, install PWF directly from its already pinned archive/hash,
  and leave Node 24 provisioning to repositories that actually require it.
- Did not change the formal task-plan freeze in this discussion round. M2 must be amended
  explicitly before S1 authorization; no production, bootstrap, contract or version file
  was edited.

## 2026-08-06 — D1 M2 amendment frozen

- Maintainer approved continuing with the narrower adapter-owned design. Formally
  superseded the earlier D1 proposal to download/pin Node v24.18.1 inside this bootstrap.
- M2 remains medium severity and a new-bootstrap/release blocker, but is not a managed Hook
  runtime dependency: 0.3.1 uses the Cloud-selected Node runtime, verifies numeric major
  `>=18`, and fixes Node 22 as the no-live Cloud acceptance selection.
- Froze removal of NVM, `NODE_VERSION=24`, default Node installation and root
  `npx skills`. Froze direct pristine Skill installation from the existing PWF v3.8.2
  archive and full contracted SHA, followed by `install.js` required-file hash validation.
- Assigned all Node 24 provisioning to the individual repositories that actually require
  it; it is no longer part of this adapter's bootstrap or security release scope.
- Split future implementation into S1-A core H1/H2/M1/M3 work and S1-B bootstrap M2 work.
  Both remain unauthorized until an explicit S1 grant; S2/S3 and Product Phase 4 remain
  separate.
- Updated only the three active planning files. No production, bootstrap, contract,
  version, tag, asset, Cloud environment or remote state was changed.

## 2026-08-06 — M2 amendment recovery and validation

- Context compaction occurred after the formal amendment. Recovered README, architecture,
  roadmap, the active pointer and all three planning files before making another decision.
- The first catch-up attempt used the nonexistent underscore spelling
  `scripts/session_catchup.py`. The installed v3.8.2 skill uses
  `scripts/session-catchup.py`; reran that exact entry successfully with no unsynced report.
- Removed the final stale x64-specific stop-condition wording and marked the earlier Node
  v24.18.1 progress entries as historical proposals superseded by the frozen amendment.
  D1 now explicitly records an amended GO; the implementation gate remains unauthorized.
- Final planning-only validation PASS: the active pointer is unchanged; only `task_plan.md`,
  `findings.md` and `progress.md` are modified; UTF-8/no-BOM, LF-only, final newline,
  balanced fences, local links, trailing whitespace and `git diff --check` are clean; zero
  `__pycache__` directories and `.pyc` files remain.
- No product suite was rerun because this recovery changed planning prose only. No
  production, bootstrap, contract, version, tag, asset, Cloud environment or remote state
  changed.

## 2026-08-06 — S1-A authorized

- Maintainer explicitly authorized continuation into S1-A.
- Scope is limited to failing-first tests and minimum fixes for H1 managed-TOML ownership,
  H2 transcript object identity, M1 installer transaction locking and M3 Host-input byte
  budgeting.
- S1-B bootstrap work, L1/L2, full S2 regression/Cloud work, version/seal/publication,
  remote changes and Product Phase 4 remain unauthorized.
- Pre-implementation recovery found only the three already-known planning-file edits on
  `main...origin/main [ahead 2]`; no production file had been modified.
- Initial code/test mapping confirmed the nearest boundaries: H1/M1 live in `install.js`
  with coverage in `tests/installer.test.js`; H2 lives in `runtime/owned-catchup.py` with
  coverage in `tests/owned-runtime.test.js`; M3 lives in `hooks/hook_adapter.py` with
  coverage in `tests/hook-adapter.test.js`.
- Added the first H1/H2/M1/M3 boundary tests without changing production. The sandboxed
  Node test runner was blocked by Windows `spawn EPERM`; the approved local rerun executed
  29 tests and produced the expected H1, M1 and M3 product failures.
- The first H2 race harness joined a Python `def` after a semicolon and failed with
  `SyntaxError`, so it was classified as a test defect rather than vulnerability evidence.
  Rewrote that harness as newline-delimited Python before rerunning H2.
- Corrected H2 test rerun then failed for the intended product reason: the replacement-only
  sentinel reached the emitted report after selection.
- Applied the first minimum production pass: marker/legacy-aware TOML ownership and array
  boundaries; lock-held installer reads plus captured-byte backup/fingerprint checks;
  immutable transcript snapshots with POSIX no-follow descriptor traversal; and a
  1,000,000-byte adapter stdin limit. Node/Python syntax and `git diff --check` pass before
  focused regression.
- First post-fix focused run classified two implementation issues: local runtime contract
  hashes still described the old `owned-catchup.py`, and `dataclass` was incompatible with
  the repository's unregistered `importlib` harness. Replaced it with `NamedTuple`, then
  the 11-test owned-runtime suite passed including the replacement race.
- Synced the exact owned-catchup SHA through `runtime-bundle-v1.json` and
  `upstream-manifest.json`, and declared the Linux `openat` Host dependency. Installer
  focused tests then exposed and fixed one final H1 boundary: an administrator comment
  between the legacy owned block and a quoted array table must remain outside the removal
  span.
- Expanded failing-boundary coverage to duplicate/shared Hook groups, malformed headers,
  command collisions, CRLF/quoted array tables, pre-rename concurrent requirements writes,
  multibyte exact-budget input, and honest POSIX-only symlink/hardlink cases. Current
  installer focused result is 10 passed / 0 failed / 1 Windows skip.

## 2026-08-06 — S1-A complete

- Added structured doctor blockers for ambiguous managed requirements and an end-to-end
  doctor/repair proof that third-party array drift remains byte-for-byte intact.
- Final S1-A focused/contract/activation/supervisor run: 44 registered, 39 passed,
  0 failed and 5 honest Windows POSIX skips.
- Importer check PASS; `node --check install.js`, Python compile for adapter/owned runtimes,
  JSON contract hashing, `git diff --check` and zero cache-residue checks PASS.
- Final full local suite: 72 registered, 59 passed, 1 failed and 12 honest POSIX skips.
  The sole failure is the immutable v0.3.0 Release ZIP oracle: modified candidate source
  builds `b9f178e5...`, while the published v0.3.0 oracle remains `f245a554...`. Classified
  as an expected Release-identity gate, not a product defect; no hash/assertion was changed.
- The first combined planning sync used an imprecise findings EOF anchor and was rejected
  atomically. Retried with file-specific exact anchors; no partial planning change remained.
- The first compact final Markdown-validator command omitted required PowerShell spacing
  around `foreach ... in` and failed to parse before reading files. Re-ran the established
  multiline validator successfully; no repository content was changed by the failed check.
- S1-A is complete. S1-B bootstrap, L1/L2, S2 Linux/no-live Cloud, version/seal/publication,
  remote operations and Product Phase 4 remain unauthorized and untouched.

## 2026-08-07 — S1-B authorized and recovered

- Maintainer confirmed a local checkpoint and explicitly authorized continuation into
  S1-B.
- Context recovery followed the repository authority chain and planning-with-files
  catch-up. The recovered worktree is clean at
  `main@2558b95ca49233111eab4f3a7ae857da039b2c30`, three commits ahead of `origin/main`;
  the active security-fix plan is unchanged.
- S1-B is limited to failing-first tests and a new `init-cloud-sandbox-v0.3.1.bash` that
  removes NVM/default Node installation/root `npx`, verifies platform Node major `>=18`,
  and installs pristine PWF v3.8.2 from its exact contracted archive/hash.
- Existing `init-cloud-sandbox-v0.3.0.bash`, v0.3.0 tags/assets/checksums, L1/L2, S2/S3,
  version/package/ZIP identity, Cloud/remote operations and Product Phase 4 remain outside
  this authorization.

## 2026-08-07 — S1-B implementation complete

- Read the complete v0.3.0 bootstrap, runtime/upstream contracts, installer Skill
  validation, Release boundary tests and exact repository inventory before editing.
- Added four nearest-boundary bootstrap tests first. The first permitted run produced the
  intended failure state: three legacy tests passed and all four new tests failed because
  `init-cloud-sandbox-v0.3.1.bash` did not yet exist.
- Added only the new v0.3.1 bootstrap plus S1-B tests and the exact future repository path.
  The script verifies platform Node `>=18`, downloads and checks the contracted PWF v3.8.2
  archive, extracts only the Skill subtree, checks required-file hashes and uses a staged
  replace/restore transaction. Its project ZIP hash remains 64 zeroes and fail closed.
- First post-fix focused run classified three non-product issues: the repository-boundary
  test correctly could not see an untracked new path; one test read the archive fields from
  the wrong manifest nesting; and Windows Git Bash requires `/c/...` rather than `C:/...`
  for the production absolute-path guard. Corrected only the two test defects and retained
  the real tracked-inventory assertion.
- Enhanced the archive test to replace an existing disposable Skill and to prove both a
  bad archive digest and a digest-valid archive with required-file drift preserve the old
  Skill. Final S1-B/contract focused result: 9 passed / 0 failed.
- Static validation PASS: importer check, old/new Bash syntax, installer/test Node syntax,
  owned Python compile, UTF-8/no-BOM/LF/final-newline checks and `git diff --check`. The
  v0.3.0 bootstrap blob remains exactly `7fc930b2d028068cbc3f4852635b39eb138ac49b` in both
  worktree and checkpoint.
- Full local suite: 76 registered / 62 passed / 2 failed / 12 honest POSIX skips. The first
  failure is the already-recorded immutable v0.3.0 ZIP oracle (`b9f178e5...` candidate
  build versus `f245a554...` stable oracle). The second is solely that the new bootstrap is
  not tracked until the maintainer's next checkpoint.
- Replayed repository-boundary tests through a copied disposable Git index containing an
  intent-to-add entry for only the new bootstrap: 3 passed / 0 failed. The first wrapper
  invocation reported outer exit 1 even though all three Node tests passed because cleanup
  overwrote PowerShell's final status; reran with an explicitly preserved test exit code
  and obtained exit 0. Both disposable indexes were removed, and the real index remained
  unchanged with no staged paths.
- No live network archive was fetched, no Cloud/container state was changed and no
  package/ZIP contract, v0.3.0 asset, tag, commit, push or publication was performed. S1-B
  stops here; L1/L2, S2/S3 and Product Phase 4 remain unauthorized.

## 2026-08-07 — S1-C authorized and recovered

- Maintainer checkpointed S1-B and explicitly authorized L1/L2 plus minimum 0.3.1
  candidate-source, Release-test and packaging-boundary closure.
- Recovered a clean `main@06d6f4e4f8be836d4789341e20729ea033dcbdc1`, four commits ahead
  of `origin/main`; planning catch-up reported no unsynced work. The real-index exact
  repository-boundary suite was rerun after checkpoint and passed 3/3.
- S1-C may change current candidate package/contract/tests/docs, but must retain the
  v0.3.1 bootstrap's zero ZIP hash and every existing v0.3.0 tag, asset, checksum and
  acceptance byte unchanged. S2, Cloud, final seal, tag, push and publication remain
  unauthorized.

## 2026-08-07 — S1-C implementation complete

- Added candidate/stable identity tests before production edits. The sandboxed runner was
  blocked by the known Windows `spawn EPERM`; the permitted rerun produced the intended
  pre-fix state: 9 registered, 3 passed and 6 failed on 23-entry/package identity,
  self-containment and L2 assertions. The independent v0.3.0 tag rebuild already passed.
- Set current package identity to 0.3.1; added package name/version to the Release contract;
  made the builder reject either identity mismatch; added the importer patcher as entry 23;
  and changed only the current contract's external asset identity to the unsealed v0.3.1
  bootstrap. Synchronized the exact Release-contract, owned-plan and runtime-bundle hashes.
- Corrected current owned-plan/adapter comments and synchronized README, architecture,
  roadmap, maintainer guidance and AGENTS boundaries. Accepted v0.3.0 remains the production
  rollback and beta.2 remains the immutable previous fallback.
- Focused S1-C result: 9 tests / 9 passed / 0 failed. It includes deterministic candidate
  double-build, extracted-ZIP importer `check`, package-name/version drift rejection and
  exact stable-tag rebuild.
- Full Windows-local result: 79 registered / 67 passed / 0 failed / 12 honest POSIX skips.
  This closes the former package-identity failure but is not S2 Linux or Cloud evidence.
- Static checks pass: importer check, Node/Python syntax, old/new bootstrap Bash syntax and
  `git diff --check`. Git Bash initially hit the managed Windows sandbox's signal-pipe
  access error; the approved out-of-sandbox retry passed both scripts.
- Immutable checks pass: `v0.3.0^{commit}` is still `1454c922...`; rebuilding its exact
  source yields ZIP `f245a554...`; the current v0.3.0 bootstrap SHA-256 remains
  `ab334f03...`; the v0.3.1 bootstrap still embeds the 64-zero ZIP hash; the four upstream
  Git modes remain `100755`.
- No network fetch, Cloud mutation, live install/repair, final ZIP hash, seal, commit, push,
  tag, publication, rollback promotion or Product Phase 4 action occurred. S1-C stops for
  maintainer checkpoint; S2 and S3 remain unauthorized.
- The first final Markdown validator used PowerShell single-quoted `` `[ `t]+$` `` syntax;
  it therefore treated literal `t` as whitespace and falsely reported many historical
  lines ending in that letter. Classified as a validation-command defect; it made no file
  changes. The corrected `[ \t]+$` rerun passed all 8 changed Markdown files for strict
  UTF-8/no BOM, LF-only, final newline, fences, local links and trailing whitespace.
- Final JSON parsing, `git diff --check` and cache audit pass; zero `__pycache__` directories
  and zero `.pyc` files remain.

## 2026-08-07 — S2 authorized and recovered

- Maintainer checkpointed S1-C and explicitly authorized S2 verification.
- Recovery followed the repository authority chain and planning-with-files catch-up. The
  worktree is clean at `main@03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc`, five commits ahead
  of `origin/main`; the active security-fix plan is unchanged.
- Read the historical M3/no-live Cloud runbook and current Linux-only test seams. Its
  structure remains useful, but old version, path count, test count, ZIP entry count/hash
  and accepted HEAD are historical and cannot be copied into 0.3.1 evidence.
- Platform discovery found `wsl.exe` but no installed Linux distribution, and no Docker or
  Podman executable. The combined inspection command exited 1 because `wsl --status`
  reported the missing distribution and `docker` was not found; classified as a local
  platform limitation, not a product failure. Windows skips will not be treated as Linux
  evidence.
- S2 permits exact-candidate verification and disposable no-live Cloud tasks, but not push,
  live `/opt/codex`, seal, tag, publication, rollback promotion or Product Phase 4.
- The `openai-docs` manual helper failed on the proxied official manual URL with HTTP 403;
  classified as a documentation-channel failure. The required official Docs MCP fallback
  succeeded.
- Official docs confirm IDE-to-Cloud delegation can carry local source changes into an
  isolated Cloud chat. They also document branch checkout/cache behavior. The installed
  `codex cloud exec` help exposes environment and branch selection but no local-change
  transport. CLI execution against the unpushed checkpoint is therefore invalid; IDE
  delegation remains the no-push Cloud route, otherwise S2 needs a separate push grant.
- The CLI help command completed but warned that its sandboxed process could not clean or
  create PATH-alias temp directories below the user Codex temp root. The help output was
  complete and no repository content changed; this warning is unrelated to product tests.

## 2026-08-07 — S2 exact-checkpoint Windows/local seal

- The first disposable local `git clone` attempt was blocked by Git for Windows failing to
  create its shell signal pipe inside the managed sandbox. It left only the named partial
  `.s2-local-probe`; after exact-path validation, the permitted out-of-sandbox retry removed
  that partial directory and cloned successfully. Classified as a sandbox limitation.
- The disposable clone is detached at exact candidate
  `03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc`, has 69 tracked paths, a clean worktree and
  the exact stable `v0.3.0` tag oracle `1454c922...`.
- Importer check, Python compile, installer Node syntax, both bootstrap Bash syntax and
  `git diff --check` pass against that clone.
- Two candidate ZIP builds are byte-identical: 23 entries, 82,421 bytes, observed S2
  SHA-256 `2cd19e04a15995014ae354ad0319e4182a72ea0fc82b08213959b3550c741cfb`.
  The patcher is present, both bootstraps are absent, and importer `check` passes from the
  extracted ZIP. This observed hash is not written into the zero-hash bootstrap and is not
  an S3 seal.
- Exact-checkpoint full Windows suite: 79 registered / 67 passed / 0 failed / 12 honest
  POSIX skips. The stable tag rebuild/original SHA, candidate identity drift rejection,
  bootstrap archive/Node boundaries and repository inventory all pass.
- Current v0.3.0 bootstrap SHA-256 remains `ab334f03...`; the 0.3.1 bootstrap still embeds
  64 zeroes. Windows-local seal is complete but supplies no Linux/Cloud evidence.
- Verified the disposable clone remained clean with zero Python cache residue, then
  resolved both named probe/artifact directories under the workspace and removed only
  those temporary trees. The main worktree returned to the three planning-file edits.
- The first read-only `codex cloud list` failed to send its request inside the network
  sandbox; the approved out-of-sandbox retry succeeded. Historical tasks identify the
  `pwf-codex-cloud-hooks` environment label but return null environment IDs. A later CLI
  diagnostic trace proves the label is resolved internally to the configured environment,
  so it can be used for a future `--env` submission even though list filtering output was
  not visibly narrowed.
- A first combined remote-identity command failed for two independent command/platform
  reasons: unquoted PowerShell `HEAD^{tree}` was parsed incorrectly, and sandboxed Git SSH
  hit the Windows signal-pipe restriction. The corrected quoted revision plus permitted
  read-only `git ls-remote` succeeded.
- Current remote `main` is exactly `bef919475b6ebc3d74c09f9664749664cf950537`, five local
  commits behind candidate `03a6cc2f...`; testing it would be invalid. The proposed new
  validation ref `validation/v0.3.1-s2-03a6cc2f` is confirmed absent, but no push was made.
- S2 is paused at its transport gate. Remaining Linux and Cloud evidence needs either IDE
  delegation carrying local source or explicit authorization for the exact non-force
  validation-branch push; neither is inferred from the general S2 grant.
- The Cloud CLI created an untracked 2,147-byte `error.log` containing request diagnostics
  and local account metadata. After confirming its timestamps matched only this S2 lookup,
  removed that exact generated file; it was untracked, is not recoverable from Git and can
  be regenerated by the CLI. No account identifier was copied into planning evidence.

## 2026-08-07 — S2 exact transport authorized

- Maintainer explicitly authorized exactly one ordinary non-force push of frozen candidate
  `03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc` to new validation-only remote ref
  `refs/heads/validation/v0.3.1-s2-03a6cc2f`, followed by read-only SHA verification.
- The maintainer will operate Codex Cloud and perform black-box validation manually. This
  agent must not submit the Cloud task; the historical v0.3.0 hard-acceptance document is
  the behavioral flow only, not a reusable version/hash/count/Release identity oracle.
- No force push, remote-main update, second ref/commit push, S3, seal, tag, asset,
  publication, rollback promotion, live production mutation or Product Phase 4 action is
  authorized.

## 2026-08-07 — S2 exact transport complete

- Ran exactly one `git push` invocation with source
  `03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc` and destination
  `refs/heads/validation/v0.3.1-s2-03a6cc2f`. It used ordinary push semantics with no
  force option and Git reported `[new branch]`.
- Immediately queried that exact ref read-only. The remote returned
  `03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc`; exact remote identity verification PASS.
- No second push was attempted. Remote main, tags, Release assets and local source/index
  were not mutated. The three pre-existing planning-file edits remain the only worktree
  changes and were not included in the pushed checkpoint.
- Froze the manual Cloud handoff against the historical v0.3.0 behavioral flow: current
  branch/commit/version/ZIP identity and fresh lifecycle markers replace historical
  values; S3-A asset download/publication and rollback promotion remain excluded.

## 2026-08-07 — S2 newcomer runbook authorized

- Maintainer requested a self-contained `v0.3.1 Cloud hard acceptance` document and an
  ordinary remote push so a new operator can select a branch and follow it directly.
- To preserve the frozen exact-candidate ref, the runbook will be committed on a separate
  evidence-only branch descended from `03a6cc2f...`; the existing
  `validation/v0.3.1-s2-03a6cc2f` ref must not move.
- Repository inspection found the exact tracked-path test freezes 69 paths. Adding the doc
  without synchronizing that assertion would make the Cloud full suite fail. The sub-gate
  therefore permits only the mechanical new path plus 70-count update in that test; docs,
  tests and planning remain outside the 23-entry Release allowlist.
- The first local `git switch -c` could not create `.git/refs/heads/validation/...` under
  the managed filesystem sandbox. It created no ref; the approved out-of-sandbox retry
  created local `validation/v0.3.1-s2-runbook` at exact base `03a6cc2f...`.
- Added the 469-line self-contained runbook plus only the required repository inventory
  path/count synchronization. It freezes candidate/evidence identities, hard stops, an
  exact Linux/setup script, B through F prompts, post-resume policy/inventory checks,
  explicit S3 exclusions and a raw-evidence return template.
- The first Bash-fence validation was blocked by the known Windows Git Bash signal-pipe
  restriction. The first approved retry passed each block as a `-c` argument, but native
  PowerShell quoting stripped embedded quotes and produced a false EOF syntax error. A
  redirected-stdin retry then hit the host's older .NET API, where `ArgumentList` is null.
  The final compatible `ProcessStartInfo.Arguments='-n -s'` plus redirected stdin preserved
  exact bytes: both Bash blocks PASS `bash -n`; Markdown UTF-8/LF/fence/whitespace and
  `git diff --check` also PASS. None of the failed validators changed repository content.
- The first focused repository-boundary test attempt hit the known sandboxed Node runner
  `spawn EPERM`. The approved out-of-sandbox rerun passed 3/3, including the new exact
  70-path inventory and continued docs/tests exclusion from Release.
- Full Windows-local regression on the runbook branch passed: 79 registered / 67 passed /
  0 failed / 12 honest POSIX skips. These skips remain pending Linux/Cloud evidence and are
  not reclassified by this documentation gate.
- Importer check, installer Node syntax, owned Python compile and deterministic Release
  build/check pass. The evidence-only doc/test/planning changes leave the 23-entry ZIP
  byte-identical at 82,421 bytes and SHA-256
  `2cd19e04a15995014ae354ad0319e4182a72ea0fc82b08213959b3550c741cfb`.

## 2026-08-07 — S2 newcomer runbook published

- Created evidence-only commit `ecc0e8c4453181c207c4c901ed190c11708e8d18`
  (`docs: add v0.3.1 Cloud S2 runbook`). Its direct parent is exact candidate
  `03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc`; its five changed paths are exactly the
  runbook, mechanical inventory test and three current planning files.
- Performed one ordinary non-force push to new ref
  `refs/heads/validation/v0.3.1-s2-runbook`; Git reported `[new branch]`.
- Immediate read-only dual-ref verification PASS: the runbook ref resolves exactly to
  `ecc0e8c4453181c207c4c901ed190c11708e8d18`, and frozen exact-candidate ref
  `refs/heads/validation/v0.3.1-s2-03a6cc2f` remains
  `03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc`.
- No remote main, tag, Release asset, bootstrap, runtime, contract or Release input moved.
  Both push exceptions are now consumed. This post-push planning record remains local for
  the maintainer's next checkpoint and will not trigger another push.

## 2026-08-07 — S2 Cloud attempt 1 classified

- Maintainer designated `validation/v0.3.1-s2-runbook` as the rolling validation branch;
  future reviewed commits and normal pushes on that branch are expected. Hard-coded first-
  candidate commit/tree ancestry and allowed-delta checks are retired from the runbook.
- Cloud attempt 1 reached the Linux suite: 79 registered / 78 passed / 1 failed / 0 skipped.
  `set -e` correctly stopped before ZIP byte-oracle and disposable install/setup steps, so
  no B–F acceptance claim exists for this attempt.
- Failure was `runtime mode mismatch for session_catchup` after the test fixture used
  Python `zipfile.extractall()`. Builder metadata had already passed, and a disposable
  probe that reapplied the recorded entry modes allowed importer validation to proceed.
  Classified as a test-fixture defect; no production or Release input change is indicated.
- The first setup precheck also found the stable commit object without a local `v0.3.0` tag
  ref. A disposable synthetic tag proved the remaining path but was cleaned and never
  pushed. The authorized permanent fix removes the runbook tag prerequisite and makes the
  stable test use its pinned commit object, verifying the tag only when the ref exists.

## 2026-08-07 — S2 attempt-1 fixture correction locally validated

- Replaced the test fixture's bare `zipfile.extractall()` with extraction followed by
  `stat.S_IMODE(info.external_attr >> 16)` and `chmod` for each non-directory entry. The
  production builder/importer and their strict mode assertions are unchanged.
- Stable Release regression now archives the already-pinned `stableCommit` object. If the
  local `v0.3.0` tag ref exists it must still resolve to that commit; absence no longer
  blocks a valid Cloud checkout or requires a synthetic tag.
- Focused Release-package result: 3 registered / 3 passed / 0 failed / 0 skipped.
- Independently reran the same 3 tests with an empty temporary Git ref database and the
  real object store supplied only through alternates. `v0.3.0` was absent while the stable
  commit object remained readable; all 3 tests passed. The temporary Git dir was removed
  and real refs were untouched.
- Updated the runbook to use the rolling branch's dynamic HEAD plus clean
  `git status`/`git diff`; removed hard-coded candidate commit/tree, allowed-delta,
  v0.3.0-tag and stable-bootstrap prechecks. Added the complete stopped Attempt 1 record.
  Both runbook Bash blocks and Markdown byte/fence checks pass.
- Full Windows-local suite: 79 registered / 67 passed / 0 failed / 12 honest POSIX skips.
  Importer check and deterministic build/check also pass. The 23-entry candidate ZIP is
  still exactly 82,421 bytes with SHA-256
  `2cd19e04a15995014ae354ad0319e4182a72ea0fc82b08213959b3550c741cfb`;
  no Release input changed.

## 2026-08-07 — S2 fixture correction published for Cloud rerun

- Created commit `5b619dafebea25a82fdd9dfe3f4da185c644f58d`
  (`test: make Cloud release fixture portable`) as a direct descendant of the first
  runbook commit. It contains exactly the release-package test fixture, runbook and three
  active planning files; no Release input or production file is present.
- Normally fast-forwarded `refs/heads/validation/v0.3.1-s2-runbook` from `ecc0e8c...` to
  `5b619daf...`. Immediate read-only verification returned the exact new SHA.
- Rechecked frozen exact-candidate ref `refs/heads/validation/v0.3.1-s2-03a6cc2f`; it remains
  `03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc`. No other ref, tag, asset or remote main was
  targeted.
- Next evidence must come from a completely fresh Cloud run at the rolling branch's current
  HEAD. Attempt 1 remains a stopped fixture result and cannot be merged with the rerun.
  This post-push planning note remains local until a later checkpoint/push cycle.

## 2026-08-07 — S2 Cloud Attempt 2 PASS and closure

- Maintainer confirms the complete fresh rerun at rolling runbook HEAD `5b619daf...`
  passed Linux suite, deterministic ZIP oracle, disposable setup and B through F. Linux
  result is 79 registered / 79 passed / 0 failed / 0 skipped; Attempt 1 was not combined.
- Maintainer supplied exact F result: `POST_RESUME_DOCTOR=PASS`, installer `0.3.1`, 11
  runtime files, `MANAGED_POLICY=ADAPTER_ONLY`, the exact expected inventory,
  `SNAPSHOT_LEFTOVERS=0` and `V031_S2_POST_RESUME=PASS`.
- Marked `V031_S2_CLOUD_HARD_ACCEPTANCE=PASS` and closed S2. This is a candidate acceptance,
  not Release/publication/rollback evidence; bootstrap remains zero hash and v0.3.0 remains
  the accepted rollback.
- Split the next critical boundary into S3-A immutable seal, S3-B publication and S3-C
  downloaded-asset/final Cloud/rollback promotion. All three remain unauthorized; the
  current action only persists and publishes the S2 evidence closure on the runbook branch.
- Synchronized the S2 PASS/S3 unauthorized state into the Cloud runbook, ROADMAP,
  MAINTAINER_HANDOFF and AGENTS current boundary. Focused architecture/repository governance
  regression passed 5/5. No product or Release input changed, so the already-complete full
  local and Cloud product matrices were not rerun for this evidence-only closure.

## 2026-08-07 — Post-S2 README patcher clarification authorized

- Maintainer requested a logical README supplement after the 0.3.1 candidate ZIP build
  instructions: patcher location, responsibilities and the distinct source/import versus
  production install/runtime paths.
- Added the explanation without changing importer, patcher, runtime, installer, contracts,
  bootstrap or trusted graph. The text explicitly preserves global PWF pristine behavior
  and classifies the v0.3.0 omission as extracted-artifact maintenance self-containment,
  not a production runtime failure.
- Recorded the long-term documentation split: architecture owns component/trust/overlay
  design; README keeps build consequences, commands and a link after that migration.
- README is a 23-entry Release input, so this documentation-only edit changes candidate ZIP
  bytes. The S2 hash remains historical evidence for tested source `5b619daf...`; no final
  hash is written, and S3, tag, push, publication and rollback promotion remain unauthorized.
- The first focused Node invocation was blocked by the known managed Windows sandbox
  `spawn EPERM`; the permitted out-of-sandbox rerun passed all 5 architecture/repository
  governance tests. This was a platform-runner failure and made no repository change.
- Importer check, Markdown UTF-8/no-BOM/LF/final-newline/trailing-whitespace checks and
  `git diff --check` PASS. Release-package tests pass 3/3, including extracted-ZIP importer
  self-containment and the unchanged published v0.3.0 oracle.
- Two post-edit candidate builds are byte-identical: 23 entries, 83,394 bytes and observed
  SHA-256 `b7c13b63e2ebd559c83348b5357ba96468246c4f2d05a3cc039e4a932a5401a6`.
  This is an unsealed local observation only and is not copied into bootstrap or the S2
  runbook's historical tested-source oracle.
- Full Windows-local regression PASS: 79 registered / 67 passed / 0 failed / 12 honest
  POSIX skips. No Linux/Cloud result was reclassified, and no S3 action or remote mutation
  occurred.

## 2026-08-07 — Patcher design migrated to architecture

- Maintainer explicitly authorized the previously discussed documentation split.
- Moved the complete patcher location, four responsibilities, source/import path,
  production install/runtime path and v0.3.0/v0.3.1 distinction into architecture section
  3.1; refined the deployment edge to name importer validation and patcher transformation.
- Reduced README to the operational artifact consequence and an architecture link. README
  remains a Release input, so validation must observe a new unsealed candidate ZIP identity.
- No runtime, installer, patcher, importer, contract, bootstrap, Hook behavior or trusted
  graph changed. S3, tag, push, publication and rollback promotion remain unauthorized.
- Importer check, Markdown UTF-8/no-BOM/LF/final-newline/trailing-whitespace validation and
  `git diff --check` PASS after migration.
- Two final post-migration candidate builds are byte-identical: 23 entries, 82,658 bytes
  and observed SHA-256
  `c527b555bbbffdc86796ff91753186c15bdab287852fc5667edb9e5493d952ff`.
  The earlier `b7c13b63...` value remains only the transient pre-migration README-expanded
  observation; neither value is a seal or bootstrap input.
- Full Windows-local regression PASS after the final documentation layout: 79 registered /
  67 passed / 0 failed / 12 honest POSIX skips. Release self-containment and immutable
  v0.3.0 oracle coverage remain green; no Linux/Cloud evidence was reclassified.

## 2026-08-07 — Runbook ZIP evidence split synchronized

- Maintainer accepted the recommendation to preserve Attempt 2 exact evidence while
  updating future-run fields for the current README-only candidate, without repeating the
  full S2 lifecycle for an ordinary non-executable documentation delta.
- Updated only the Cloud runbook and active planning. These paths are excluded from the
  Release ZIP and therefore do not change the locally observed `c527b555...` candidate.
- Runbook current identity, setup `EXPECTED_ZIP_SHA256`, future evidence criteria and empty
  return template now use 23 entries / 82,658 bytes / `c527b555...` and explicitly state
  that this identity is locally verified but not Cloud PASS or sealed.
- Attempt 2 remains byte-for-byte factual in its execution record: exact source
  `5b619daf...`, 23 entries / 82,421 bytes / `2cd19e04...`, Linux 79/79 and B–F PASS.
- S2 remains closed as the behavioral/security gate; the current documentation-only delta
  is carried into a future S3-A freeze and mandatory S3-C final-byte Cloud acceptance.
  S3, commit, push, tag, publication and rollback promotion remain unauthorized.
- The first synchronization updated the script hash but missed two old size literals in
  the same setup block (`test` and summary output). A complete hard-coded identity scan
  found them before validation; both now use 82,658, while the only remaining 82,421
  references are deliberately frozen Attempt 2/history fields.
- Documentation-only validation PASS: strict UTF-8/no BOM, LF-only, final newline, no
  trailing whitespace, `git diff --check`, exact old/current identity occurrence checks
  and machine-contract confirmation that runbook/planning stay outside the Release ZIP.
- The first Git Bash fence check hit the known managed Windows sandbox signal-pipe failure
  (`Win32 error 5`). The permitted out-of-sandbox retry parsed both Bash fences and passed
  2/2. The failure was a platform limitation and changed no file.
- Per the maintainer's risk-proportionate decision, no product suite or Cloud lifecycle was
  rerun for these ZIP-excluded runbook/planning edits.

## 2026-08-07 — S3-A authorized and recovered

- Maintainer checkpointed the evidence split and explicitly authorized S3-A.
- Recovery found a clean `validation/v0.3.1-s2-runbook` at
  `9ef80422cb01c87240da884389f279c4910e2f2c`, with remote runbook ref still at
  `101dca5...`; no push is inferred or authorized.
- S3-A is limited to final pre-freeze Release-input wording, exact 23-input freeze,
  independent ZIP double-build/check, writing only the resulting hash into the external
  v0.3.1 bootstrap, computing its SHA and local regression/evidence.
- Commit, push, tag, publication, S3-B/S3-C, downloaded-asset acceptance, rollback
  promotion, live Cloud mutation, Product Phase 4 and every v0.3.0/beta.2 change remain
  outside this gate.

## 2026-08-07 — S3-A immutable local seal complete

- Neutralized transient pre-seal wording in README before the freeze. README is the only
  changed Release input relative to checkpoint `9ef80422...`; after freezing, none of the
  23 allowlisted inputs changed.
- Captured all 23 per-file SHA-256 values in findings. The canonical sorted input manifest
  digest is `8b1fd450739e6ee90dc1b6210c3e9fe1831de36d03bb70a90438fc07124fdf58`.
- Two independent builds/checks are byte-identical: 23 entries, 82,725 bytes, SHA-256
  `f097b04015b1a3847ca5a24b9236f882c5a008b22033793b5661e282c39131f9`.
  Both exact copies remain in `%LOCALAPPDATA%/Temp/pwf-v0.3.1-s3a-9ef80422/` for a later
  separately authorized publication decision.
- Added failing-first seal assertions. Before the bootstrap edit, the two v0.3.1 tests
  failed because its default still contained the 64-zero placeholder; the stable v0.3.0
  oracle passed. Changed only the external v0.3.1 bootstrap default to the frozen ZIP
  digest. Focused seal tests then passed 3/3, and an explicit zero override remains rejected.
- Sealed bootstrap identity: 21,565 bytes, SHA-256
  `ce31a32002aea46bbf3f9baf9a0e93451d24c3b3653952e425d1e1ff6960a5e8`.
- The managed Windows sandbox twice blocked child execution: Node test runner reported
  `spawn EPERM`, and Git Bash reported `couldn't create signal pipe, Win32 error 5`.
  Approved local-boundary reruns of the same commands passed. An initial PowerShell static
  command also used unavailable bare `bash`; rerunning with the maintainer-provided
  `D:\\Program Files\\Git\\bin\\bash.exe` fixed the command environment without changing files.
- Full regression first exposed two governance fixture drifts in sequence: the tests still
  required README's old `当前候选源码身份` phrase and architecture's old `未封板` phrase. Only
  those test assertions were updated to the new stable wording. Final Windows-local suite:
  79 registered / 67 passed / 0 failed / 12 honest POSIX-only skips.
- Importer check, Python compilation, `node --check`, both bootstrap Bash syntax checks,
  retained ZIP builder checks, deterministic identity, exact bootstrap hash, Git modes,
  Markdown hygiene and `git diff --check` pass. The frozen input-manifest digest remained
  exact after all ZIP-excluded test/governance updates.
- Stable protection remains green: `v0.3.0^{commit}` is `1454c922...`, v0.3.0 bootstrap
  SHA-256 remains `ab334f03...b39c0`, and the stable ZIP oracle remains `f245a554...d9af`.
- S3-A stops here with an uncommitted, unpublished local seal. No push, tag, Release,
  downloaded-asset acceptance, live Cloud change, rollback promotion, Product Phase 4 or
  v0.3.0/beta.2 mutation occurred. S3-B and S3-C remain unauthorized.

## 2026-08-07 — S3-B authorized and preflighted

- Maintainer checkpointed S3-A as clean commit
  `9aa2148886e499f9f45594f7ae4f7681f1045de2` and instructed the agent to continue to the
  next plan step. S3-B alone is authorized; S3-C, rollback promotion, Product Phase 4,
  branch push and every v0.3.0/beta.2 mutation remain excluded.
- Recovery found local branch `validation/v0.3.1-s2-runbook` clean at that commit before
  the authorization record. The only subsequent working-tree difference is current
  ZIP-excluded planning evidence; no Release input or bootstrap drift exists.
- Exact retained ZIP and witness still exist, each 82,725 bytes with SHA-256
  `f097b04015b1a3847ca5a24b9236f882c5a008b22033793b5661e282c39131f9`.
  The checkpointed external bootstrap remains 21,565 bytes with SHA-256
  `ce31a32002aea46bbf3f9baf9a0e93451d24c3b3653952e425d1e1ff6960a5e8`.
- One PowerShell preflight passed unquoted `HEAD^{tree}` and caused the shell wrapper to
  mis-handle `{tree}` as an encoded command. It changed no files or refs. The corrected
  quoted form returned tree `1cef0c0955a81db301f6ded27c0f4e0e20c9fba7`.
- GitHub authentication is active as `keeptoy` with repository scope. Read-only remote
  preflight returned no `refs/tags/v0.3.1`, and `gh release view v0.3.1` returned the
  expected `release not found`. No existing identity will be overwritten.
- Prepublication source check proved all 23 Release inputs plus the external v0.3.1
  bootstrap match checkpoint `9aa2148` exactly; only ZIP-excluded current planning differs
  in the worktree, with no staged changes.
- A third independent prepublication build/check reproduced 23 entries, 82,725 bytes and
  exact ZIP SHA-256 `f097b040...31f9`; its unique temporary copy was removed after the
  comparison. Focused sealed/stable protection tests passed 4/4.
- Existing v0.3.0 is a lightweight tag, so the new immutable v0.3.1 tag will use the same
  repository convention and point directly to checkpoint `9aa2148`.
- Created local lightweight `v0.3.1` at exact commit
  `9aa2148886e499f9f45594f7ae4f7681f1045de2`, then performed one ordinary non-force push
  of only `refs/tags/v0.3.1`. Immediate `git ls-remote` returned the same exact commit.
  No branch or prior tag moved.
- GitHub CLI supports `--verify-tag` and `--latest=false`; S3-B publication will use both so
  it cannot synthesize a different tag and will not create/update the moving Latest pointer.

## 2026-08-07 — S3-B immutable publication complete

- Created GitHub Release `v0.3.1` with `--verify-tag --latest=false`, title `v0.3.1` and
  release notes that include both exact SHA-256 values plus the explicit S3-C/rollback
  caveat. Release URL:
  `https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.1`.
- Uploaded exactly two assets once: `pwf-codex-cloud-hooks-v0.3.1.zip` and
  `init-cloud-sandbox-v0.3.1.bash`. No witness ZIP, source archive, checksum sidecar or
  unrelated file was uploaded.
- Read-only GitHub API verification reports non-draft/non-prerelease Release, published at
  `2026-08-07T11:49:01Z`, asset count 2, exact sizes 82,725 and 21,565 bytes, and exact
  service-side digests `sha256:f097b040...31f9` and `sha256:ce31a320...a5e8`.
- Remote tag verification still resolves `refs/tags/v0.3.1` to exact source
  `9aa2148886e499f9f45594f7ae4f7681f1045de2`. GitHub `Latest` remains `v0.3.0`.
- S3-B did not download either published asset, execute the published bootstrap, mutate
  Cloud, push a branch, alter remote main, move/replace any tag or asset, promote rollback
  or begin Product Phase 4. Those downloaded-byte and lifecycle checks remain S3-C.
- Synchronized only ZIP-excluded governance/runbook files to published-but-unaccepted
  status. README, all 23 ZIP inputs and the external bootstrap remain byte-identical to
  tag `v0.3.1`; post-publication sealed-path diff check PASS.
- Focused architecture/repository governance regression passed 5/5. `git diff --check`,
  current/stable tag identity and exact tracked-path boundary remain green. No full product
  or Cloud suite was repeated for publication metadata-only governance edits.

## 2026-08-07 — S3-C authorized / public-byte verification started

- Maintainer instructed the agent to continue, authorizing S3-C. The gate is explicitly
  split into agent-run public download verification, maintainer-run Fresh/Resume/doctor
  Cloud smoke, then an evidence-based rollback/Latest decision. The agent will not submit
  Cloud or promote before the maintainer returns exact evidence.
- S3-B governance changes are not checkpointed, but they are all ZIP-excluded documents;
  tag `v0.3.1`, all 23 Release inputs and the external bootstrap remain unchanged.
- First public-download command failed before receiving an asset because this host's older
  PowerShell `New-Item` does not accept `-LiteralPath`. The directory was never created and
  curl then failed with local output error 23. No partial file, network integrity failure or
  Release defect exists. Retry uses a new GUID path with `New-Item -Path -ErrorAction Stop`.
- Corrected public consumer-path download PASS from both unauthenticated GitHub Release
  URLs. Fresh evidence directory:
  `%LOCALAPPDATA%/Temp/pwf-v031-s3c-download-b74056ef919a4bfdb6937c855ae12c94/`.
- Downloaded ZIP is exactly 82,725 bytes / `f097b040...31f9`; downloaded bootstrap is
  exactly 21,565 bytes / `ce31a320...a5e8`. Filenames match the Release contract.
- Builder inspection of the downloaded ZIP reports healthy, 23 entries and the same exact
  digest/size. Downloaded bootstrap visibly binds default `v0.3.1` URL/package to the exact
  ZIP digest; it has not been executed.
- Extracted the downloaded ZIP into the same fresh evidence directory while restoring its
  recorded Unix modes. Its bundled importer `check` passed against all four exact managed
  upstream hashes; patcher is present and no bootstrap entered the ZIP.
- Downloaded bootstrap binding checks PASS: exact v0.3.1 URL/package and `f097b040...31f9`
  default, no zero default. Git Bash syntax check PASS. The bootstrap remains unexecuted
  locally because Windows cannot represent the final Linux/Cloud install boundary.
- Added runbook section 13 for the maintainer-run S3-C Cloud smoke. Its setup wrapper pins
  tag/source `v0.3.1@9aa2148`, verifies the publicly downloaded bootstrap bytes, exercises
  that bootstrap's default public ZIP URL in a Fresh Node-22 `/opt/codex` container and
  requires an initial healthy/non-repairable doctor before B–F.
- The final smoke deliberately reuses sections 4–8 verbatim; their S2 strings are stable
  fixture IDs, while `V031_S3C_PUBLIC_RELEASE_SETUP=PASS` separates final-publication
  evidence from historical S2. The wrapper and both existing Bash fences pass `bash -n`
  (3/3). No Cloud task was submitted by this agent.
- Focused architecture/repository governance regression passed 5/5 after the S3-C handoff
  edit. Strict Markdown hygiene, `git diff --check` and published sealed-path comparison
  against tag v0.3.1 all PASS. Current dirty state remains exactly seven ZIP-excluded
  governance/runbook files.
- S3-C now waits on maintainer-run Cloud outputs from runbook section 13 plus sections 4–8.
  Public-byte PASS alone does not close S3-C and does not authorize rollback/Latest
  promotion.

## 2026-08-07 — S3-C runbook entrypoint correction authorized

- Maintainer reported that the old remote `validation/v0.3.1-s2-runbook` checkout stopped
  because its zero-default bootstrap did not match a copied setup assertion for sealed
  hash `f097...`. Classified this as a stale branch/runbook identity mix, not a product or
  published-asset failure.
- Maintainer accepted the proposed two-lane model: exact-commit Source/Candidate validation
  and immutable-tag/public-asset Release validation. The current S3-C entry is section 13;
  historical section 3 must not be used for the final Release smoke.
- Read-only remote preflight found runbook ref exactly
  `101dca5a5c174badf943466fe0158065c6dd1a11`, `main` at `bef9194...`, and immutable
  `v0.3.1` still at `9aa2148...`.
- Authorized scope is runbook plus active planning, one documentation-only checkpoint and
  one ordinary fast-forward push of the existing validation ref after an exact immediate
  remote-parent preflight. No force option, `dev`, remote main, tag, Release, Latest,
  rollback or Cloud mutation is authorized.
- First runbook syntax command incorrectly expected two Bash fences and stopped before
  running any syntax/test/diff check when it found the actual three. The existing S3-C
  record already documents three fences; the corrected validation expects and parses all
  three. This was a validation-command defect and changed no repository file.
- The corrected in-sandbox run then hit the known Git Bash signal-pipe restriction at the
  first fence (`couldn't create signal pipe, Win32 error 5`) before focused tests or diff
  checks ran. This is a managed Windows platform limitation; the identical read-only
  validation is rerun at the permitted local boundary rather than weakening syntax checks.
- The local-boundary rerun parsed all three Bash fences and passed `bash -n` 3/3. Focused
  architecture/repository governance tests passed 5/5, `git diff --check` passed, and an
  explicit comparison against immutable `v0.3.1` confirmed zero drift in all published
  source/bootstrap paths. Only the runbook and three active planning files differ.
- Before push, clarified that `--force-with-lease` is still a force-family operation and
  is not used. Safety comes from an immediate exact remote-SHA preflight plus Git's normal
  server-side non-fast-forward rejection.

## 2026-08-07 — S3-C Cloud wrapper portability correction

- The authorized ordinary push completed from remote `101dca5...` to exact
  `e9abf838aff9496629804e927baaaa91e0068756`; immediate remote verification matched, the
  local worktree was clean, remote main remained `bef9194...` and tag v0.3.1 remained
  `9aa2148...`.
- Maintainer's fresh S3-C attempt then stopped at
  `git fetch --no-tags origin ...`: the Cloud-provided checkout has no `origin` remote.
  Classified as a runbook portability defect. Cloud had already loaded the requested
  repository/branch; no product, network-access, tag or published-asset failure occurred.
- Maintainer requested a simpler Cloud flow. Section 13 now removes all Git fetch/tag/
  checkout/status operations plus redundant Node-22, file-size, `bash -n`, embedded ZIP
  hash grep and second doctor checks.
- The minimum wrapper retains the independent public bootstrap SHA check, then runs the
  verified bootstrap's `all` command. That command already verifies Node >=18 and the
  pinned ZIP, then installs, doctors and verifies managed state. B–F remain the lifecycle
  black box after setup.
- Local validation PASS: all three runbook Bash fences parse with `bash -n`, focused
  architecture/repository governance tests pass 5/5, `git diff --check` passes and all
  immutable v0.3.1 published source/bootstrap paths remain byte-identical to the tag.
- This local correction authorizes no second checkpoint/push. Remote runbook stays at
  `e9abf838...` until the maintainer explicitly authorizes transport.
- Official Cloud-environment documentation cross-check confirms the required nuance:
  normal tasks check out the selected branch/commit before setup; cache creation checks
  out the default branch and runs setup; cache resume checks out the chat-selected branch
  and runs the optional maintenance script instead. Section 13 now states this explicitly,
  requires Fresh/reset-cache acceptance and forbids setup dependence on workspace branch,
  tag or Git remote topology.
- Confirmed the installation path remains branch-independent: verified public bootstrap
  bytes download verified public ZIP bytes and perform install/doctor/verify. Activation is
  deferred until the later agent/runtime reads Managed requirements; B–F run in that phase,
  and F's workspace installer is post-install verification only.
- Maintainer approved the wording and explicitly authorized one documentation checkpoint
  plus one ordinary non-force push of the existing validation ref. Read-only preflight
  found exact remote parent `e9abf838aff9496629804e927baaaa91e0068756`, remote main
  `bef9194...` and immutable tag v0.3.1 `9aa2148...`.
- Final pre-check after the lifecycle wording PASS: all three Bash fences parse, focused
  governance tests pass 5/5, `git diff --check` passes, the changed-path set is exactly the
  runbook plus three active planning files, and every immutable v0.3.1 published
  source/bootstrap path remains byte-identical to the tag.
