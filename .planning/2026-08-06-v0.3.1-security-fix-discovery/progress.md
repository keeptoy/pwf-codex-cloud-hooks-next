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
