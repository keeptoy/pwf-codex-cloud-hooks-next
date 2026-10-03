# Findings: Phase 5.3 G3 evidence plan and projection

## Inherited evidence

- G2 emits deterministic `PWF_RELEASE_RISK_ADVISORY_V2` with complete raw changes, atomic identity closure,
  residual changes, lane and explicit unknowns from exact base/head commits.
- Frozen G3 must map the lane to required local/Linux/Cloud/retirement evidence and project a minimal block into
  existing task-plan/operator-guide documents; it must not execute those steps or become a second authority.
- C1/C2, Source/Candidate and Published Release remain mandatory current workflow objects throughout G3.

## Questions to resolve

1. Which current document owns the canonical evidence checklist, and what fields are genuinely lane-dependent?
2. Is projection one tool with `plan`/`project` modes, or a V2 classifier extension plus a separate writer?
3. What stable explicit markers can be added without parsing or rewriting human prose?
4. How should FULL fallback be represented when input is missing, malformed, self-changing or policy-unknown?
5. Which disposable fixtures prove byte-stable reruns and preservation of human-authored bytes?

## Stable boundaries recovered

- README keeps stable product/install behavior and routes current programme and acceptance to ROADMAP and
  version-specific documents; a G3 generated block therefore cannot claim Cloud/Release acceptance or become a
  new programme authority.
- ARCHITECTURE treats workspace planning files as untrusted project data and keeps installer/runtime ownership
  separate from workspace planning. G3 must remain source-only maintenance tooling and cannot enter the managed
  runtime, installer, Release ZIP authority or trusted execution graph.
- Existing failure semantics require integrity/schema/content operations to fail closed while advisory failure
  cannot terminate the product loop. Projection should therefore refuse ambiguous document state before writing,
  but its generated checklist remains advisory until operators execute and record existing gates.
- DESIGN confirms task-plan and operator-guide documents are existing governance surfaces, while tools/tests are
  source-only maintenance inputs. It also contains stale G1-only classifier wording (`no identity closure`, `G2
  not replayed`) that must be reconciled when G3 adds the new module seam; this is an implementation-map repair,
  not a change to programme authority.
- ROADMAP section 9 is the unique current C0/C1/C2 and dual-channel authority. A generated plan must preserve:
  candidate admission preflight; C0 Source/Candidate; first retirement review and C1; immutable publication;
  Published Release; Latest confirmation; second retirement review and C2. Lane-dependent evidence may reduce
  what is proved *inside* those checkpoints only after later enablement, never remove the objects in G3.
- ROADMAP assigns exact evidence ownership: task plan holds current authorization/Next Step, one operator guide
  holds both channel checkpoints/final Post-run, provenance holds immutable assets, and ROADMAP holds current
  programme roles. G3 projection should reference these owners rather than copy their mutable state.
- Wiki still describes the classifier as the G1 `V1` shape with neither identity closure nor required gates. Its
  stable usage notes must be updated after the G3 CLI/schema is fixed, without turning Wiki into a second policy
  or programme authority.
- The frozen Phase 5.3 contract requires each post-G2 result to expose required gates and G3 to project the lane's
  local/Linux/Cloud/retirement checklist idempotently. It also fixes three non-negotiable semantics: an
  identity-only delta returns `NO_RELEASE_REQUIRED`; every actual release retains both identity channels and both
  retirement checkpoints; and successful G1-G3 local work does not enable a reduced lane before later gates.

## Frozen G3 design

- Evolve the read-only classifier result to `PWF_RELEASE_RISK_ADVISORY_V3`. Keep the complete G2 delta and
  identity-closure fields, and add explicit `owner_fingerprints` plus a `required_gates` object. The latter is a
  shadow minimum-evidence projection, not a new execution authority.
- Add `tools/project_release_evidence.py` as a separate source-only writer. It imports the classifier for exact
  base/head analysis, so the classifier remains read-only and the write boundary stays independently testable.
  Classifier, owner policy and projector are one self-protected owner set: changing any of them selects FULL.
- `required_gates` always exposes local, Linux, Source/Candidate, Published Release and retirement arrays. It also
  lists the fixed lifecycle objects `C0`, both identity channels, immutable publication, Latest confirmation,
  both retirement reviews, `C1` and `C2`. Non-release results retain those names with an explicit not-applicable
  disposition rather than silently deleting them.
- `PACKAGE_DOC_ONLY` and `RELEASE_MECHANICS` contain the frozen matrix's smaller shadow evidence, but carry
  `SHADOW_ONLY_NOT_EXECUTION_AUTHORITY` and a pointer to current ROADMAP FULL workflow. `PRODUCT_OR_SECURITY`
  contains the full plan. `NO_RELEASE_REQUIRED` forbids automatic publication and identifies the separately
  authorized `RELEASE_MECHANICS` exception.
- Projection accepts only explicit repository-relative `.planning/**/task_plan.md` or `docs/**/*.md` operator
  guide targets. The bounded block uses one exact BEGIN/END marker pair. With no pair it appends at EOF without
  changing existing bytes; with one valid pair it replaces only that interval; duplicate, unmatched, reversed,
  symlink or kind/path-conflicting targets fail before any write.
- `--check` is read-only and fails on absent/drifted content; `--write` uses a same-directory temporary file and
  atomic replacement after a second identity/content check. The rendered block references existing authorities,
  records no PASS, and publishes counters for generated checklist fields, manual evidence fields and block count.
- No standing placeholder is added to templates: EOF is the format-independent unique insertion seam, while the
  explicit markers become the sole future replacement seam. This avoids parsing or normalizing human headings.

## Exit evidence

- All G2 lanes now carry explicit five-dimension evidence plans. The three publication lanes retain the exact
  nine-object C0/two-channel/two-retirement/C1/C2 lifecycle; no-release lanes retain those names with an explicit
  not-applicable disposition. Nothing infers or records PASS.
- Disposable task-plan and operator-guide projections prove first-write determinism, second-write byte identity,
  check-only drift detection, preservation of human bytes on both sides, and fail-before-write marker/target
  rejection. One invocation supplies four routing inputs and generates five checklist fields with zero manually
  edited evidence fields, one block and no copied authority body.
- Six historical/current replays retain their frozen lanes with zero false-fast results. Full Windows regression
  is 196 pass, 26 known POSIX/Linux-only skips and 0 fail; importer, Python/Node syntax and diff checks are healthy.
- Release inputs and current workflow bytes are unchanged. No Linux/Cloud, C0, assets, publication, retirement,
  remote write or G4/G5 enablement action occurred. G4 remains gated on a real eligible future train.
