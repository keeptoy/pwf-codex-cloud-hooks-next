# Findings: R38 current/cold evidence mapping

## Baseline

- Clean `0.5.0-dev` after B3f commit `3972e8f`; B3f retired nine pure narrative assertions and preserved R38 checks.
- R38 inventory: the five retrospective records repeat exact source hashes, Release and path-safety claims. The frozen Discovery says to map each to current publication oracle or immutable Git recovery before retirement; do not bundle R38 with R31 prose changes.
- Phase 4.8's missing Cold evidence is separate and remains untouched.

## First seam review

- Phase 4.13 keeps explicit non-Product identity, path-topology/backup-before-mutation claims, `BLOCKED_UNSAFE_RUNTIME_PATH`, zero-skip wording and source `99885b…`. Current README documents the path-safety contract; `tests/installer.test.js` has linked-path denial and unknown regular backup cases. The history text is not itself the live installer oracle.
- Phase 4.14 retains Release closeout/C0–C2, three named HEADs, authority links, 22-entry exclusion and historical absence checks. These mix current programme/operator rules with cold history; no blanket removal is justified.
- Phase 4.15 retains bootstrap template/materializer, three asset roles, contract selector, override/candidate identity and dual-channel evidence; 4.16 retains C0 exact tag/ref/peeled commit; 4.17 retains Release identity and proposed classifier lanes. Several current producers/tests exist, but they are not yet fully mapped.
- R30 protects the *shape* of one cold source commit link for each record, not the exact commit identity. Exact hash assertions cannot be retired merely because R30 passes.

## Current-oracle leads

- R38 4.13 source `99885b…` is also the v0.4.1 source in `BASELINE_PROVENANCE.md`; v0.4.4's 4.17 source `053f66…` is its sealed-bootstrap source there, while its actual Release source is `f7032f…`. These are different roles and must not be conflated.
- 4.15 `add5f8…` and 4.16 `aea21a…` appear in their history records and repository-boundary assertions but not in the current provenance/ROADMAP/Wiki/acceptance search. Their exact cold-snapshot role needs Git verification before any retirement.
- ROADMAP owns the current C0/C1/C2 order and two retirement checkpoints; architecture-contract tests also pin their current flow. Wiki owns current candidate asset and exact C0 tag instructions; repository-boundary and release asset tests cover parts of these. This permits a future ownership replacement, not direct deletion of the historical claims.

## Read-only tool issue

- A search guessed two non-existent test filenames (`tests/materialize-release-assets.test.js`, `tests/release-artifact.test.js`). `rg --files tests` found the actual release modules: `release-assets.test.js`, `release-package.test.js`, plus `published-release-oracles.test.js`. No files changed.
- A second read-only search passed a Bash-style bracket/glob path under PowerShell; rerunning `rg -g 'phase-4.1[3-7]*.md'` found all five cold links. No files changed.

## Five cold snapshot roles (local Git confirmed)

| Record | Exact snapshot | Git subject / role | Provenance relation |
|---|---|---|---|
| 4.13 | `99885b854bd9621c3340e99f031bf83ceb58414d` | `release: seal v0.4.1 source candidate` | Same v0.4.1 Release source in provenance. |
| 4.14 | `86032ef9343cc9935e91f3f358f2642d01f26bd6` | `docs: decouple release closeout from phase 9` | Historical governance snapshot; not the version Release source. |
| 4.15 | `add5f8c98b81c3019f4f095f566a80913d02df95` | `docs: explain bootstrap override semantics` | Historical operator/governance snapshot; not v0.4.3 Release source (`6204de…`). |
| 4.16 | `aea21aea851e17ee9cc9cbc462a031afa5cad8c8` | `docs: open v0.4.4 release tag guide train` | Historical operator/governance snapshot; not v0.4.4 Release source (`f7032f…`). |
| 4.17 | `053f66e994ca095e974f69a7fbe8f2bb54697fc3` | `release: close v0.4.4 role window` | Same v0.4.4 sealed-bootstrap/C2 source in provenance; not its Release C0 source. |

All five are locally valid commit objects. A future test cannot assume shallow/tagless Cloud contains them, and should not mistake governance/C2 snapshots for C0 publication identities.

## Existing current guards by topic

| Historical assertions | Current owner / independent guard | Residual |
|---|---|---|
| 4.13 linked parent, unsafe components, backup-before-mutation, unknown regular cleanup | README path-safety contract; `tests/installer.test.js` clean-install/uninstall linked paths, special entries, backup/cleanup cases (with FIFO Linux-only skip on Windows) | Historical reason and exact old source remain cold evidence; current test does not prove the old release's Linux result. |
| 4.14 C0/C1/C2, preflight and two retirement checkpoints | ROADMAP Release flow/retirement anchors; `tests/architecture-contracts.test.js` checks ordered flow, three HEADs and stop conditions | These guards protect *current* programme order, not the historical 4.14 snapshot or every link inside it. |
| 4.15 template/materializer, three assets, selector and override | Wiki operator instructions; `tests/release-assets.test.js`, `release-package.test.js`, `bootstrap.test.js`, repository-boundary selector and Wiki checks | Current candidate behavior is covered in several seams, but historical 4.15 source `add5f8…` has no provenance mirror. |
| 4.16 C0 exact tag/ref/peeled commit | Wiki executable operator block and `assertC0TagOperatorBlock` harmful/harmless probes in repository-boundary test | Current command safety is covered; old 4.16 source `aea21a…` remains unique cold evidence. |
| 4.17 README ZIP identity / proposed machine lanes | Release contract and package tests cover current ZIP identity; Phase 4 overview and architecture tests preserve “Discovery input, not current workflow” | Risk lanes are a historical proposal, not an implemented classifier; broad lane retirement would risk misrepresenting authorization. |

These are ownership leads, not a claim that all historical claims can now be deleted. The current tests themselves contain some wording pins, and R38 requires claim-by-claim false-positive/false-negative probes before replacement.

## Maintainer clarification and disposition

- `assertRetrospectiveHistoryRecords` is a generic structural check across Phase 4.13–4.17: it requires exactly one full-SHA commit URL from this repository in each record's Cold evidence. It intentionally does not assert a particular commit. The 4.14 `86032ef…` link remains historical record data, not a new test literal or provenance identity.
- The earlier suggestion to add a 4.14-specific hash guard would conflate link shape with historical identity and create another source of truth; the maintainer chose to keep the structural check generic. That resolves the apparent gap as a scope distinction, not a defect to patch.
- R38 exact literals in 4.13/4.15/4.16/4.17 are existing cold evidence checks and remain unchanged. The 4.14 block has no exact source literal and will not gain one in this gate. No historical body, test, production or contract change is justified by this mapping alone.
- Current owner tests cover many live path-safety/Release procedures, but they do not prove every old version's historical outcome or permit retirement of cold-source checks. Future R38 work would need a narrower claim-level design, such as a real harmful current-safety mutation plus an equivalent history explanation rewrite, before removing a specific literal.
- Focused `node --test tests/repository-boundary.test.js` passed 29/29 after the active planning switch. No production, test, contract or history file changed, so a full platform/Release suite is not claimed for this planning-only decision.
