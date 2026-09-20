# Task Plan: Audit DESIGN/ARCHITECTURE against implementation

## Goal

Determine whether `DESIGN.md` and `ARCHITECTURE.md` accurately describe the current contracts, source code, runtime composition, installer, Release builder, and test routing, and report every material mismatch with evidence.

## Authorization

- The maintainer requested a read-only design/architecture-to-code consistency review.
- Planning records and read-only validation are in scope.
- The maintainer subsequently authorized the specific planning-lifecycle test correction that prevents tests from implying automatic completed-scope deletion.
- Production, contract, and authority-document fixes remain unauthorized; no other audit follow-up is in scope.
- Remote writes, push, tags, PRs, Releases, deployment, and external state changes remain forbidden.

## Next Step

Hand off the corrected planning lifecycle regression and local commit; await maintainer direction on the other audit findings.

## Current Phase

Phase 5 — Planning lifecycle test correction complete

## Phases

### Phase 1: Recover authorities and inventory

- [x] Read README, ARCHITECTURE, DESIGN, ROADMAP, and the active planning context.
- [x] Inventory contracts, production source, build/install tooling, and tests.
- [x] Record audit dimensions and high-risk claims.
- **Status:** complete

### Phase 2: Audit ARCHITECTURE claims

- [x] Trace Host input, adapter supervision, owned runtimes, trusted graph, and failure semantics into code/contracts/tests.
- [x] Check installer, runtime source, state, and Release trust boundaries.
- [x] Classify every discrepancy by severity and confidence.
- **Status:** complete

### Phase 3: Audit DESIGN mappings

- [x] Verify repository layout, module responsibilities, dependencies, change routing, and test reverse index.
- [x] Detect missing modules, stale filenames/contracts, or responsibilities placed in the wrong layer.
- [x] Distinguish wording/coverage gaps from code-level contradictions.
- **Status:** complete

### Phase 4: Validate and report

- [x] Run existing architecture/contract/repository checks and targeted static inspections.
- [x] Reconcile findings against tests and machine contracts.
- [x] Deliver an evidence-backed report without implementing unapproved fixes.
- **Status:** complete

### Phase 5: Correct planning lifecycle test policy

- [x] Remove the exact-current-tree assertion that equates one active scope with only one retained scope.
- [x] Add a positive regression proving one complete inactive scope may coexist with the active scope.
- [x] Freeze the maintainer-decision/no-automatic-deletion governance text in the test.
- [x] Run focused and full regression, update evidence, and create one local commit.
- **Status:** complete

## Key Questions

1. Does each stable architectural claim have a matching implementation or machine-contract authority?
2. Does DESIGN route each current production module and test to the correct responsibility?
3. Are there contradictions that could mislead implementation, security review, or Release work?
4. Which findings are material defects versus small documentation-maintenance improvements?

## Decisions Made

| Decision | Rationale |
|---|---|
| Treat machine contracts and executable tests as stronger evidence than prose for field-level behavior | Repository authority rules explicitly assign gate-level schema/hash/inventory semantics to machine contracts. |
| Do not edit production or authority docs during the audit | The user asked for a check; repository rules require presenting evidence and proposed action before unrequested fixes. |
| Fix the test rather than deleting planning to satisfy it | Governance explicitly allows complete inactive scopes and reserves deletion to a separate maintainer decision. |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Windows `rg` rejected wildcard path arguments in the symbol inventory | 1 | Retry with `-g` file filters rooted at directories instead of wildcard path segments. |

## Stop Conditions

- Stop before modifying production, contracts, DESIGN, ARCHITECTURE, or other stable authorities; only the explicitly authorized planning-lifecycle test is writable.
- Stop and report if the audit requires an external/Cloud execution claim that cannot be proven locally.
- Do not turn absent historical detail into a current architecture defect.
