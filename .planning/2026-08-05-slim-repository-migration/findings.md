# Findings: Slim Repository Migration

## Frozen baseline

- M1 audit commit: `bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b`.
- M1 audit tree: `ff49c3c6656386e94450ccb24437a1c2d1c50e95`.
- M2 target: exactly 59 tracked paths assembled from 46 retained paths, six
  renamed sources, and seven new document/planning entrypoints.

## M2-A boundary

- Archive means omitted from the new orphan tree; historical files remain in the
  archive repository and frozen audit ref.
- The six renames are structural only in M2-A. Behavior-name rewrites and test
  reference updates belong to M2-B.
- The four new root documents are intentionally minimal entrypoints until M2-B;
  they are not current architecture, provenance, handoff, or roadmap authority yet.

## M2-A verification finding

- Exact path, byte, mode, UTF-8, forbidden-path, untracked-path, orphan-branch, and
  audit-oracle checks pass.
- The only cached whitespace report is the terminal blank line inherited byte-for-byte
  from `Git可执行权限修复.md` into `docs/git-file-modes.md`. Editing it in M2-A would
  violate the frozen rename-byte contract, so its cleanup remains an explicit first
  obligation of the M2-B document rewrite.

## M2-B initial dependency inventory

- The retained README/AGENTS still route to archived `PROJECT_UNDERSTANDING.md`,
  `work_plan.md`, generic black-box material, Phase 3 tests, and the prototype;
  the new authority documents must replace those routes rather than copy history.
- Three test modules still open the pre-rename fixture names. The renamed
  `repository-boundary.test.js` still requires the intentionally absent prototype,
  so both stable boundary tests must be rewritten before the suite is meaningful.
- Package and bootstrap still identify beta.2/current repository. The immutable
  beta.2 acceptance document intentionally retains those historical asset strings;
  current identity changes must not rewrite that evidence.
- M2-B must distinguish current references from immutable baseline references:
  beta.2 hashes/URLs remain in the acceptance/provenance documents, while package,
  bootstrap, current README/tests, and handoff move to beta.3-dev/successor identity.

## M2-B manifest decision

- Discovery described `historical_patched_skill_files` as removable because the
  patcher allegedly had a compatibility-patch fallback. Current source does not:
  `load_contract()` still requires the historical field to equal
  `compatibility_patches[PATCH_ID].patched_sha256`.
- Deleting the field would require changing the reproduction patcher and its
  contract, expanding risk without improving the 59-path boundary. M2-B therefore
  retains the field and records its legacy name in provenance. This is allowed by
  the plan's “can delete” wording and keeps production/reproduction behavior stable.
- Overlay evidence paths are a real active dependency because `contracts.test.js`
  requires each one to exist. They will point to `BASELINE_PROVENANCE.md` and the
  committed Cloud observation/JSONL fixtures; the overlay contract hash must then
  be recalculated in `upstream-manifest.json`.

## M2-B authority rewrite

- The new macro layer now has single-purpose documents: README for behavior/ops,
  ARCHITECTURE for trust/runtime, ROADMAP for gates, BASELINE_PROVENANCE for source
  evidence, MAINTAINER_HANDOFF for operations, and the Git-mode runbook for LF/mode.
- Immutable beta.2 acceptance remains untouched and is linked as baseline evidence;
  current docs clearly mark beta.3-dev as unpublished and zero-hash bootstrap as
  intentionally unusable.
- `.gitattributes` now uses repository-wide `* text=auto eol=lf` plus explicit
  binary `-text` families. M2-C still owns fresh-clone proof; the rule alone is not
  claimed as cross-platform acceptance.

## M2-B behavior and identity rewrite

- Replacing the prototype handoff's eight imported tests plus one isolation test
  with three stable repository-boundary tests yields the predicted net reduction
  from 69 to 63 registered cases while preserving production safety assertions.
- The renamed golden/Cloud fixture bytes remain unchanged; only test variable,
  path, and behavioral labels changed.
- Current package/bootstrap identity is beta.3-dev/successor/zero hash. Published
  beta.2 hashes remain asserted through the immutable acceptance document and
  BASELINE_PROVENANCE rather than the development bootstrap.
- Static compile guidance uses in-memory `compile()` instead of `py_compile`, so
  normal maintenance does not create `__pycache__` inside exact runtime inventory.
- Removed Phase/Round wording from the two schema `$comment` fields without
  changing schema validation semantics. This required synchronized installed
  contract hashes in runtime-bundle/upstream-manifest and a new runtime-bundle
  hash; production Python/shell bytes remain untouched.
- Retained historical labels only where they are evidence or immutable data:
  beta.2 acceptance/provenance, the frozen golden fixture description, upstream
  fixture content, fresh planning's M2-A record, and the owned-plan source docstring
  whose modification would violate the no-production-change M2-B boundary.

## Importer hygiene adjustment

- Running the documented importer check created an ignored
  `patches/__pycache__`, because `load_patcher()` dynamically imports the patcher
  with Python's default bytecode behavior. This would leave a fresh successor
  checkout non-pristine even though Git status hides it.
- The bounded fix sets `sys.dont_write_bytecode = True` in the development/import
  tool and adds an after-test assertion. It does not alter adapter/owned/upstream
  runtime, Host ABI, schema validation, imported bytes, or Release layout. The
  importer hash in upstream-manifest is updated accordingly.

## M2-B closure

- The stable repository now contains 63 registered tests rather than the M1
  audit tree's 69 because the nine prototype/handoff cases were replaced by three
  repository-boundary assertions. The six-case reduction is intentional; every
  security conclusion remains mapped to a production test.
- Windows reports 52 PASS and 11 honest POSIX/Linux-only SKIP. This exactly matches
  the Discovery estimate, but the count is evidence rather than a contract; M3
  must still prove 63/63 and behavior equivalence in Cloud/Linux.
- A repository-wide Markdown link scan must exclude the intentionally incomplete
  upstream Skill fixture. Its links point to files not copied into the fixture by
  design; the 12 maintained documents all pass independently.
- The development bootstrap is deliberately unpublishable: it targets the
  successor slug and beta.3-dev but retains a 64-zero checksum. No M2-B evidence
  should be interpreted as a Release candidate or cutover authorization.

## M2-C closure

- The repository-wide LF policy is now proved, not merely configured. A fresh
  clone with `core.autocrlf=true` materialized all 59 tracked files with zero CR
  bytes and passed importer/static/full-suite checks without local repair.
- M2 closes with one parentless 59-path root history, exactly four executable
  upstream runtime entries, deterministic 22-entry development ZIP bytes, and an
  intentionally unusable zero-hash bootstrap. None of these results authorize
  push, Cloud deployment, Release, cutover, or Product Phase 4.
- Closure synchronization changed packaged `README.md`, so the pre-closure
  development ZIP hash was correctly rejected as final evidence. Rebuilding the
  amended tree twice produced the stable 74,899-byte SHA-256
  `647e16852f818a84f4b5d4872a876d411cdbdfa7671f07b7614f35f12aae5e7d`.
  Planning files are outside the Release allowlist, so recording this value does
  not alter the ZIP bytes.
