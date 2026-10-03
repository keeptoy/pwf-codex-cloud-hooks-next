# Findings: Phase 5.3 G1 advisory classifier foundation

## Inherited decision

- Phase 5.3 is a frozen Discovery record with exactly five serial successor gates. Only G1 is authorized here.
- G1 is a read-only advisory foundation: explicit base/head, exact Git delta, repository-owned policy, strict
  precedence, versioned machine output and fail-closed unknown/self-change behavior.
- Canonical identity closure belongs to G2. G1 must not normalize version, manifest hash, predecessor or
  candidate-bootstrap cascades and must not emit reduced Release instructions.
- The current v0.5.0-dev source remains `PRODUCT_OR_SECURITY` relative to v0.4.4 because owned-plan admission and
  runtime-bundle integrity changed.
- Current C0/C1/C2 and both identity channels remain the only operative Release workflow.

## Initial implementation questions

1. Which existing repository files already define authoritative Release inclusion, runtime/install inventory and
   governance owners without creating a duplicate inventory?
2. What is the smallest deterministic JSON result that is useful for G2 while remaining advisory in G1?
3. How should Git object types and mode changes be represented so links/submodules/special transitions fail closed?
4. Which fixture form provides stable historical coverage without relying on mutable branches or remote refs?

## Initial repository inventory

- `contracts/release-artifact-v2.json` is the existing authority for exact ZIP entries, the one external
  candidate bootstrap and declared excluded prefixes. G1 should consume it, not copy its entry inventory.
- `contracts/runtime-bundle-v2.json` and `upstream-manifest.json` remain the existing runtime/install inventory
  and integrity authorities. A G1 policy may assign owner classes to authority paths/prefixes, but must not
  reproduce either machine inventory.
- Existing maintenance CLIs are Python, emit deterministic JSON on stdout and diagnostics/errors on stderr.
  A Release-excluded `tools/classify_release_risk.py` plus a dedicated policy file and Node boundary test fits
  repository conventions without entering production or the current ZIP allowlist.
- No current tool provides reusable Git delta parsing. Tests use `git diff-tree` directly, so G1 needs its own
  bounded parser and fixtures for status, rename, old/new mode and object type.
- The current Release contract excludes `.planning/`, `docs/`, `tests/` and selected source-cache paths, but it
  does not declare every Release-excluded path. Exclusion cannot by itself establish a low-risk owner; policy
  must explicitly admit known governance/test/tool paths and classify all unmatched paths as FULL.

## Frozen G1 implementation seam

- Add `tools/classify_release_risk.py` and `tools/release-risk-policy-v1.json` as explicit source-only trusted
  inputs. Repository-boundary tests must list both as source-only; neither may enter the Release ZIP.
- CLI shape: `python tools/classify_release_risk.py --base <commit-ish> --head <commit-ish>`. Both arguments are
  mandatory and resolved with Git to exact commit IDs. The tool runs no mutating Git command.
- The tool reads `contracts/release-artifact-v2.json` from the exact head commit with `git show`, validates the
  fields it consumes, and derives ZIP/external-asset membership from that authority. It never copies the entry
  inventory into policy.
- Policy contains only owner classification rules and the small set of packaged-document paths. Rules can match
  exact paths or prefixes. Unmatched paths, invalid policy/authority data and external candidate assets remain
  FULL in G1 because canonical identity normalization is deferred to G2.
- Git evidence comes from NUL-delimited raw diff output with rename detection and includes status/score,
  old/new path, old/new mode, old/new object type and Release intersection. Only absent/regular-file transitions
  are admissible for lower lanes; symlink, gitlink or unknown modes force FULL.
- Output schema v1 is deterministic JSON with `advisory_only=true`, exact endpoints, policy/authority identity,
  per-change evidence, strict aggregate lane, reasons and unknowns. It intentionally has no required-gate,
  identity-closure or mutation fields.
- A new `tests/release-risk-classifier.test.js` owns CLI/delta/policy/read-only behavior. DESIGN must index the
  new source-only tool and test module; repository-boundary tests must freeze the source-only/ZIP boundary.

## G1 lifecycle ledger

| Object | Owner | Decision | G1 validation | Later review |
|---|---|---|---|---|
| `tools/classify_release_risk.py` | G1 advisory tooling | KEEP source-only | focused classifier tests, syntax, full suite | G2 may consume output; no production admission |
| `tools/release-risk-policy-v1.json` | G1 owner policy | KEEP source-only | exact-key validation, self-change FULL | G2 may extend identity rules only with new authorization |
| `tests/release-risk-classifier.test.js` | G1 boundary evidence | KEEP | disposable Git fixtures | G4 shadow adds live-train evidence separately |
| existing Release/runtime contracts | current machine authorities | KEEP unchanged | classifier consumes; hash/ZIP regression | no authority duplication |
| current C0/C1/C2 workflow | ROADMAP | KEEP unchanged | absence of workflow/gate output | G5 only may propose enablement |

## Implemented evidence

- The source-only history-promotion range `5b92a8b..708432b` classifies
  `SOURCE_ONLY_GOVERNANCE` with seven changes, zero unknowns and `advisory_only=true`.
- `v0.4.4..HEAD` classifies `PRODUCT_OR_SECURITY`, as required for current v0.5. Its six unknowns are conservative
  G1 boundaries: external/retired versioned bootstraps and three governance templates not explicitly admitted by
  policy. G1 does not normalize those identity paths; G2 may explain them only after exact closure validation.
- The implementation reads the Release artifact bytes from the exact head commit and hashes those bytes in the
  report. It reads the policy from the classifier's own repository and treats changes to either classifier-owned
  path as FULL, preventing the policy from approving its own downgrade.
- Focused classifier, architecture, repository-boundary and Release-package regression passes 56/56. The new
  tool and policy are frozen as source-only trusted paths and remain absent from the 22-entry ZIP allowlist.
