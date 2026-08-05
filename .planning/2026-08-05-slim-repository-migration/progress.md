# Progress: Slim Repository Migration

## M2-A — orphan skeleton

- Created a dedicated secondary worktree under the verified `new-space` path.
- Created local unborn branch `migration/slim-beta3-dev`; no root commit exists.
- Selectively imported 52 M1 source paths rather than copying the complete tree.
- Applied six Git-aware path renames.
- Added four minimal stable-document entrypoints and three fresh planning files;
  updated `.planning/.active_plan` to this scoped plan.
- M2-B, commit, push, Release, cutover, production changes, and Phase 4 remain
  outside the current authorization.
- Verified exactly 59 indexed paths, zero forbidden/untracked paths, exactly four
  executable runtime files, strict UTF-8 for all 59 worktree files, preserved audit
  blobs/modes, fresh planning selection, unborn branch state, and unchanged clean
  M1 audit commit/tree.
- The first exact-index check ran before the seven new entrypoints were staged and
  correctly stopped at 52 paths. Staged only those seven paths plus the modified
  active pointer, then the exact 59-path check passed.
- `git diff --cached --check` reports only the inherited terminal blank line in
  renamed `docs/git-file-modes.md`; kept its M1 bytes unchanged as required and
  assigned cleanup to M2-B. M2-A is complete and stopped for maintainer review.

## M2-B — authority, identity, and provenance rewrite

- Maintainer checkpointed M2-A and explicitly said to continue; recorded this as
  authorization for M2-B only.
- Recovered the clean archive checkpoint `f3d522f`, unchanged clean M1 audit
  commit/tree, and the 59-path local unborn slim worktree.
- Opened an M2-B plan covering document authority/LF, behavior-named references,
  stable architecture/repository tests, beta.3-dev/bootstrap identity,
  overlay/provenance/manifest hashes, and bounded validation. Root commit, push,
  M2-C/M3, Release, cutover, product behavior changes, and Phase 4 remain excluded.
- Initial stale-reference scan found the expected old fixture names in three tests,
  prototype execution in the renamed repository-boundary test, Phase/history routes
  throughout README/AGENTS, and beta.2/current-repository identity in package and
  bootstrap. The immutable beta.2 acceptance document is intentionally exempt.
- The first `rg` scan used a negative look-ahead without PCRE2 and failed before
  producing results. Re-ran once with `--pcre2`; it completed and supplied the
  dependency inventory. Do not repeat the unsupported default-regex form.
- Read the machine-contract/importer/patcher/installer chain. Contrary to one
  optional Discovery assumption, the patcher currently hard-requires
  `historical_patched_skill_files`; chose to retain it rather than change the
  reproduction algorithm. Overlay evidence/hash updates remain required.
- Replaced the inherited macro docs with focused successor authority: README,
  AGENTS, ARCHITECTURE, ROADMAP, BASELINE_PROVENANCE, MAINTAINER_HANDOFF, and the
  Git mode/LF runbook. The beta.2 hard-acceptance evidence was not modified.
- Broadened `.gitattributes` to repository-wide LF with explicit binary exclusions.
  Removed the inherited terminal blank line through the authorized git-mode
  document rewrite; final M2-B diff hygiene remains to be verified.
- First focused Node run was blocked by the known Windows sandbox `spawn EPERM`;
  reran outside the process-spawn sandbox. Thirteen of fourteen cases passed. The
  only failure was a new architecture-doc anchor that combined two true phrases
  not written contiguously; added the explicit stable sentence to ARCHITECTURE
  rather than weakening the contract. A focused rerun remains pending.
- Updated the three behavior-named fixture references and labels; fixture bytes
  remain the M1 blobs. Rewrote the architecture contract against ARCHITECTURE and
  replaced the prototype handoff with three exact-tree/coverage/graph tests.
- Advanced package/bootstrap to beta.3-dev, successor URL, and zero checksum;
  rewrote release/bootstrap tests so immutable beta.2 assets are verified through
  acceptance/provenance. Updated overlay status/evidence/test names and pinned its
  new SHA-256 in the upstream manifest.
- Static/metadata preflight passes: nine JSON files parse; importer check is
  healthy; Node/Python syntax checks pass; overlay hash equals manifest; 59 index
  paths and zero untracked paths remain.
- Reworded schema comments and remaining current test titles away from Phase/Round
  history, recomputed both installed schema hashes, the overlay hash, and the
  runtime-bundle hash, then synchronized all four manifest entries.
- Full invariant preflight passed production bytes, renamed fixture bytes, exact
  executable set, LF attributes, strict UTF-8, and cached diff hygiene, then
  correctly stopped because importer check had left `patches/__pycache__`.
- Verified the residue path was inside the slim worktree and contained only pyc,
  removed that generated cache, disabled bytecode writes before dynamic patcher
  import, added a regression, and updated the manifest importer hash.
- A combined source read plus no-match `rg` returned exit 1 after showing the
  importer header because the searched cache guard did not yet exist. Treated the
  absence as the finding and did not repeat that command shape.
- Added the exact ARCHITECTURE statement required by the stable contract and
  reran the expanded focused set: 22/22 passed.
- A combined Node validation attempted to spawn `git` from inside the Windows
  process sandbox and received `EPERM`; reran strict UTF-8/LF and Markdown checks
  directly in PowerShell. The first link pass then correctly exposed an incomplete
  link inside the intentionally partial upstream Skill fixture. Excluding fixture
  content, all 12 maintained Markdown documents passed fences and local links.
- Final preflight passed: 59 indexed paths, zero untracked paths, four executable
  managed upstream files, 15 manifest-linked hashes, importer health, zero cache,
  ten production-byte comparisons, three renamed-fixture blob comparisons,
  repository-wide LF/strict UTF-8, stale-current-state scan, and cached diff.
- Full Windows suite passed with 63 tests / 52 pass / 0 fail / 11 honest POSIX
  skips. In-memory Python compilation and Node syntax checks passed; Bash is not
  available on this host and was recorded as unavailable rather than PASS.
- M2-B is complete. The orphan branch remains local, unborn, staged, and unpushed;
  no root commit, Release, cutover, M3, or Phase 4 work was performed. Stopped for
  maintainer checkpoint before M2-C.

## M2-C — root commit and local closure

- Maintainer confirmed the M2-B checkpoint and explicitly authorized M2-C.
- M2-C is limited to final pre-commit invariants, deterministic double ZIP build,
  one parentless 59-path root commit, and fresh Windows clone validation. Push,
  M3/M4, Release, cutover, product behavior changes, and Product Phase 4 remain
  unauthorized.
- Final pre-commit gates pass: importer and in-memory Python/Node static checks,
  exact 59 paths, zero untracked/cache, exactly four executable upstream files,
  and cached diff hygiene.
- Full Windows suite remains green at 63 registered / 52 pass / 0 fail / 11
  honest POSIX skips.
- Two pre-closure development ZIP builds were byte-identical at 22 entries /
  74,871 bytes. Closure then updated packaged README, so that hash was not kept as
  final-tree evidence; bootstrap remained external with its all-zero checksum.
- Created the parentless root commit and verified exact 59 paths, zero parents,
  exactly four `100755` entries, clean slim worktree, and unchanged M1 audit oracle.
- The first local clone attempt was blocked before repository transfer because
  sandboxed Git for Windows could not create its internal signal pipe (Win32 error
  5). Verified and removed only the named partial temporary clone, then reran the
  same gate outside that process sandbox; this is a platform-tool restriction, not
  a repository or test defect.
- Fresh Windows clone PASS under `core.autocrlf=true`: 59 paths, zero CR files,
  four executable modes, importer/static/clean status PASS, and full suite
  63 registered / 52 pass / 0 fail / 11 honest POSIX skips.
- M2 local closure is complete and stopped before push/M3/M4/Release/cutover or
  Product Phase 4. The closure-only planning/document update is folded into the
  same parentless root commit and the final amended commit is re-cloned below.
- The first post-closure double build detected the expected README-driven byte
  change and established the actual final-tree development ZIP: 22 entries /
  74,899 bytes / SHA-256
  `647e16852f818a84f4b5d4872a876d411cdbdfa7671f07b7614f35f12aae5e7d`.
  Recording this value changes only planning files outside the Release allowlist.
