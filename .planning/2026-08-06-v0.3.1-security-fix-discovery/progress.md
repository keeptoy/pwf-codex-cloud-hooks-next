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
