# Task Plan: Slim Repository Migration

## Goal

Transform the accepted beta.2 exact mirror into a focused successor repository
without changing production behavior, weakening safety coverage, or rewriting the
immutable M1 audit oracle.

## Current Gate

M3-A governance repair locally validated; full no-live Cloud rerun required.

## Status

M2-A/B/C and M3 Discovery are complete. M3-A transport pushed reviewed commit
`f54fb78633d22af5c8f0f225fc8c44ad046aa9c1` to the same-named remote development
branch. The first no-live Cloud run passed identity, provenance, static, mode, and
Linux 63/63 gates, then stopped in the runbook-only Managed Policy assertion because
it read the actual two-level TOML handler structure as one level. The corrected
governance descendant now validates the nested group/handler shape and passes local
focused/full regression with zero product/Release-input drift. M3-A remains open
until that exact descendant is pushed and the complete Fresh Cloud script passes
from its first line. M3-B, M4, and Product Phase 4 remain unauthorized.

## Next Step

Checkpoint and non-force push the reviewed governance descendant to the same-named
development branch, verify local/remote HEAD equality, then rerun the complete Fresh
Cloud no-live seal from the new exact HEAD. Do not combine partial results from the
first attempt. Do not begin M3-B, create public `main`, publish, cut over, modify
production behavior, or enter Product Phase 4.

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
