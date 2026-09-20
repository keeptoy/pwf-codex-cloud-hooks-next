# Findings: DESIGN/ARCHITECTURE implementation audit

## Requirements

- Compare `DESIGN.md` and `ARCHITECTURE.md` with the current code-level implementation.
- Identify documentation/code drift, omissions, and contradictions.
- Report evidence, severity, and recommended follow-up without making unapproved fixes.

## Audit Matrix

| Area | Prose authority | Implementation evidence | Status | Notes |
|---|---|---|---|---|
| Host request and adapter boundary | ARCHITECTURE §§4–6, 8; DESIGN §4 | `hooks/hook_adapter.py` + four ABI schemas | match | Plan-first, SessionStart-only catch-up, bounded supervision, exact validators, sibling-only child paths, and single final output confirmed. |
| Owned plan/catch-up composition | ARCHITECTURE §§4–6; DESIGN §4 | both owned runtimes, pristine helpers, bundle dependencies, four ABI schemas | match with one exactness finding | Main flow and safety semantics match; the newline discrepancy is tracked separately. |
| Trusted runtime graph and importer | ARCHITECTURE §§3, 7, 9; DESIGN §§3–4 | runtime bundle + manifest + full importer inspection | match | Bundle confirms three local files, four pristine upstream files, exact dependency graph and hash-first import. |
| Installer/state transition | ARCHITECTURE §10; DESIGN §§3–5 | runtime bundle + installed transition + full `install.js` inspection | match | Installed inventory has 12 files including four contracts and notice; ownership/topology/drift semantics agree. |
| Release artifact/build path | ARCHITECTURE §11; DESIGN §§3–6 | release artifact v2 + builder/materializer inspection | match | 22-entry allowlist, deterministic archive, zero-hash candidate, sealed pair, and external bootstrap agree. |
| Repository/module map | DESIGN §§2–5 | current source inventory + repository tests | match | All named production/tool paths exist and responsibilities/dependencies align. |
| Test responsibility routing | DESIGN §6.1 | 20 current `*.test.js` modules | complete match | Every current test module appears in the reverse index. |

## Findings

- README and ARCHITECTURE agree on the primary runtime sequence: both events invoke owned plan first; only SessionStart may invoke catch-up; final composition is canary, optional catch-up, optional plan.
- ARCHITECTURE makes several high-risk code-checkable claims: one final Host JSON output, exact-v2 plan request/result, six-field project forwarding, no adapter filesystem fallback, 27-second internal deadline under a 30-second policy timeout, sibling-only child execution, and strict transcript fallback semantics.
- The deployment/trust model distinguishes four separate inventories: manifest integrity index, runtime bundle source/install authority, installed-manifest snapshot, and Release artifact allowlist. These must be verified against importer, installer, and contracts.
- The documented trusted graph excludes direct execution from the global Skill and excludes importer/build tooling from production runtime; only installed adapter and sibling owned runtimes/helpers should be executable.
- The audit must separately verify smart/autonomous activation state, private snapshots, transcript handling, installer topology/ownership, and Release-external bootstrap behavior.
- DESIGN provides an explicit source→ZIP→installed layout and a test-module reverse index, making completeness mechanically checkable against the current tree.
- A potential high-confidence architecture drift is visible before code inspection: DESIGN says the installed runtime contains four ABI contracts, while ARCHITECTURE's deployment tree visually lists only the two plan request/result contracts. The runtime bundle and installer must decide whether that tree is incomplete.
- A minor documentation-routing concern is separate from code correctness: DESIGN says all copyable validation commands live under Wiki's “构建开发 ZIP” anchor, while the general test baseline actually lives under Wiki's “本地开发” section.
- ROADMAP confirms this audit is discussion/read-only work: current `v0.5.0-dev` does not authorize Product Phase 5 implementation, Host ABI, trusted-graph, Cloud, or Release changes.
- Runtime bundle confirms four installed ABI contracts: catch-up request/result v1 and plan request/result v2. Therefore ARCHITECTURE's deployment tree is materially incomplete when it displays only the two plan contracts; DESIGN's “four runtime ABI contracts” statement matches implementation.
- Runtime bundle dependency edges match DESIGN: adapter→owned plan/catch-up; plan→resolver/injector/ledger summary; catch-up→session-catchup with exactly four allowed helper symbols.
- The current tree has 20 `*.test.js` modules and DESIGN §6.1 includes all 20, with no stale test filename found in the index.
- Adapter implementation matches the documented main dataflow: it prepares the canary, invokes plan first for both events, invokes catch-up only after a validated injecting plan on SessionStart, composes catch-up before plan, and prints one final Host result.
- Adapter constants confirm the documented 27-second internal deadline, one-second finalization reserve, 15-second catch-up cap, exact output budgets, and sibling regular-file/no-symlink child admission.
- Adapter constructs catch-up input directly from the validated six-field `plan_result["project"]`; it does not re-resolve planning files or implement a transcript parser.
- A small code-comment drift exists outside DESIGN/ARCHITECTURE: `build_plan_context_request` still says “legacy+smart request” although the producer and schema now allow `[legacy, smart, autonomous]`. Runtime behavior is correct.
- Owned-plan's activation-first behavior, profile-bound smart/autonomous tokens, hard-link/symlink-safe reads, bounded ledgers, tick/event-only projection, process-group supervision, and post-render state revalidation match ARCHITECTURE §§5–5.1.
- One exact-state discrepancy needs targeted test inspection: README/ARCHITECTURE describe nonce/attestation as exact newline-terminated values, while `_normalize_exact_line` also accepts the same token with no trailing newline.
- The remainder of owned-plan matches the private-snapshot design: canonical root equality, no-follow directory walking, task/progress capture, 0700 snapshot + 0600 files, autonomous omission of raw progress, normalized ledger projection, pristine injector execution, full post-child byte/identity revalidation, and bounded stale cleanup.
- Plan resolution is delegated to the pristine resolver but all selected results are re-contained and restricted to either repository root or `.planning/<slug>`; this supports DESIGN's claim that owned-plan is the unique managed selection boundary without moving the algorithm into the adapter.
- Autonomous snapshot materialization always normalizes nonce/attestation back to newline-terminated files even when the workspace reader accepted a non-terminated token, reinforcing that the documented “exact state” and admission code currently differ at the workspace boundary.
- Owned-catchup matches ARCHITECTURE §6 in detail: Host path is preferred, identity mismatch/corruption fails closed, ordinary path rejection may use explicitly permitted fallback, fallback examines at most 256 candidates globally and sorts verified snapshots by `mtime_ns`, and parsing uses frozen bytes.
- Catch-up dynamically loads the full pristine module but directly calls only the four allowlisted helpers; unknown record types remain warnings/event fallback while invalid UTF-8/JSON and invalid shapes stop partial report injection.
- DESIGN's catch-up responsibility description, helper boundary, output budget, and test routing accurately reflect implementation.
- Full installer inspection confirms the documented trust and ownership model: it verifies the raw runtime-bundle hash before strict parsing, installs the bundle-defined 12-file inventory, validates source hashes and modes, executes no global-Skill script, and registers only the absolute adapter command for the two managed events with a 30-second timeout.
- Installer state handling also matches ARCHITECTURE §10 and DESIGN's install plane: ownership markers and shared-state fingerprints gate mutation; backup precedes writes/removal; unsafe symlink/junction/special-file topology is blocked; current and explicit predecessor states are admitted; unknown runtime/manifest/requirements drift fails closed; repair is limited to owned repairable drift; explicit uninstall preserves unknown regular content through backup before cleanup.
- Importer inspection matches the source-trust model: `upstream-manifest.json` holds integrity references, the runtime bundle is hash-verified before parsing, archive bytes and allowlisted members are hash-checked, all selected members must share exactly one archive root, symlinks/unknown destination inventory are rejected, and import is staged then atomically renamed.
- Release tooling matches the deterministic-publication model: the hash-pinned artifact contract is the sole ZIP inventory; package identity, lexical ordering, fixed timestamp, deflate compression, file modes, exclusions, and external bootstrap separation are enforced; archive inspection compares exact names, metadata, modes, and source bytes.
- Asset materialization also enforces the documented candidate/seal split: development bootstrap is the canonical zero-hash render; a release build requires a non-zero expected ZIP hash matching a fresh build; the tracked bootstrap must equal either the zero-hash candidate or exact sealed render; output files are only created when absent or accepted when byte-identical, never silently overwritten.
- The suspected `UserPromptSubmit.turn_id` mismatch is disproved: the schema's base property explicitly permits string or null and its event-specific `else` branch constrains only `source`; adapter, owned-plan, seam tests, and schema therefore agree that a missing Host turn ID is normalized to `null`.
- The focused 11-module audit suite executed 142 tests outside the Windows sandbox: 121 passed, 20 POSIX-only cases skipped honestly, and one planning-lifecycle test failed solely because the newly activated audit scope temporarily coexisted with the completed candidate-initialization scope. The earlier scope is fully complete and was removed under the maintainer's standing authorization to retire completed obsolete plans; `.planning/` and the current audit scope remain.
- The exact focused-suite rerun after retirement passed all 122 runnable tests with 20 honest Windows/POSIX skips and zero failures. This covers architecture contracts, all four ABI/schema contracts, adapter, both owned runtimes, importer, installer, deterministic ZIP/assets, repository boundaries, and supervisor seams.
- Full regression passed 163 runnable tests with 0 failures and 26 honest Windows/POSIX skips. Importer check, candidate-bootstrap identity, Python compile, Node syntax, and `git diff --check` also passed.

## Classified discrepancies

| Severity | Finding | Evidence | Impact | Recommended follow-up |
|---|---|---|---|---|
| Medium documentation omission | ARCHITECTURE's installed deployment tree lists only the plan request/result contracts, while the installed runtime actually contains all four ABI contracts. | `ARCHITECTURE.md:119`; `DESIGN.md:65`; `contracts/runtime-bundle-v2.json:89-93` | Can mislead an installer/trust-boundary review about catch-up ABI files even though prose and implementation elsewhere are correct. | Expand the tree to list catch-up request/result plus plan request/result. |
| Medium exact-state inconsistency (related README/runtime boundary) | README says autonomous nonce and attestation exact bytes end with `\n`, but the runtime accepts the same valid token with or without one trailing newline; no test freezes the no-newline case. ARCHITECTURE says “exact nonce” but does not specify raw EOL bytes. | `README.md:100-108`; `runtime/owned-plan.py:546-553,761-765`; autonomous tests only write newline-terminated values | The security behavior remains regex-bounded and safe, but “exact state” is broader in code than the documented operator contract. | Prefer making runtime require the documented newline and add positive/negative tests; otherwise explicitly document optional EOL and test it. |
| Low documentation routing drift | DESIGN says all copyable commands live under Wiki's build-ZIP anchor, but general development/test commands live under the local-development anchor. | `DESIGN.md:127-140`; `Wiki.md` local-development and build-development-zip sections | Maintainers may land in the wrong section; no implementation effect. | Link both anchors or link the Wiki root and name both sections. |
| Low code-comment drift | Adapter request builder docstring says “legacy+smart” although producer, schema and runtime support `legacy, smart, autonomous`. | `hooks/hook_adapter.py:205-206,246-250`; plan schema/tests | No runtime effect, but a future maintainer could overlook autonomous when editing the seam. | Change the docstring to “legacy/smart/autonomous” or profile-neutral wording. |

No production dataflow, Host ABI, trusted-graph, installer ownership, Release allowlist, module responsibility, dependency edge, or test-index contradiction was found beyond the items above.

## Planning lifecycle test correction

- Governance is explicit: `.planning/.active_plan` selects one active scope but does not delete other directories; complete inactive scopes may remain until a separate maintainer review authorizes removal.
- `validatePlanningScopes` already implements this correctly: every inactive scope must contain exactly `task_plan.md`, `findings.md`, and `progress.md`, while only the selected scope may carry lifecycle state.
- `repository-boundary.test.js` then added a redundant exact-inventory assertion requiring `.planning/` to contain only the pointer and active scope. That assertion contradicts the helper and governance and caused the audit run to treat retention as a failure.
- The correction should delete the exact-current-tree inventory assertion, add a synthetic complete inactive-scope case, and assert the governance language that switching `.active_plan` never grants deletion authority.
- Implemented correction: the test now validates both the actual repository paths and a synthetic complete inactive scope through the existing helper, while freezing the governance and ROADMAP prohibition on automatic deletion.

## Issues Encountered

| Issue | Resolution |
|---|---|
| A resumed PowerShell read used an invalid three-segment `Join-Path` call | Rebuilt the plan directory first, then joined each filename separately; no audit evidence was lost. |
| A targeted `rg` for a nonexistent schema rule returned exit 1 after printing the relevant schema block | Read the complete conditional block directly; it disproved the suspected `turn_id` drift. |
| Sandboxed Node test runner failed every module with `spawn EPERM` | Re-ran the same focused suite outside the sandbox; it executed normally. |
| Focused suite found both current and completed planning scopes | Confirmed the older scope was complete, then retired its three files under the maintainer's explicit obsolete-plan deletion authorization. |

## Resources

- `ARCHITECTURE.md`
- `DESIGN.md`
- `contracts/`
- `hooks/`, `runtime/`, `tools/`, `install.js`
- `tests/`
