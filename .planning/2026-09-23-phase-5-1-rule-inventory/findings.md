# Findings: Phase 5.1 document-test rule inventory

## Starting context

- The prior method probe in `.planning/2026-09-23-phase-5-1-method-probe/` showed that whole-file command matches can pass when an unsafe active command is accompanied by a harmless decoy string, while exact prose checks can reject equivalent wording.
- The Phase 5.1 history record remains an open draft. This inventory is a Discovery input, not a frozen decision or implementation authorization.
- The repository's `README.md#documentation-map` routes each question to its current owner. The Guide owns portable governance method; ROADMAP owns programme/Release order; Cloud templates own execution protocol; machine contracts and source own technical identity and inventories.

Detailed rule-group mapping appears below in this file.

## Opening source surface

- Baseline source is local commit `fae9adf8e7ea6e0ab18d3b1b3a2cfe733658432d`.
- The target files contain 27 top-level test cases: 9 in `architecture-contracts.test.js` and 18 in `repository-boundary.test.js`.
- A read-only source scan found 206 literal `assert.match`/`assert.doesNotMatch` calls in the architecture file and 365 in the repository file, 571 combined. Calls inside loops may cover multiple instances; the count is a navigation aid, not a quality target.
- The first architecture cases already show mixed roles: explicit anchor/link validation, handoff routing, Cloud operator-guide protocol, exact machine/adapter seams, README/DESIGN ownership, and reverse test-module indexing. A case title alone is not a disposition unit.
- Full source-order review found three especially mixed surfaces: the ROADMAP case combines parseable current-role/anchor checks with Release sequence and historical prose; the documentation-lifecycle case combines exact Release exclusion and operator commands with sentence-level Wiki/Cloud wording; the history case combines controlled entrances and roles with frozen narrative and phase-count text.
- History-specific tests for Phase 4.13–4.17 repeatedly check stable record/anchor/index/Release-exclusion properties and then freeze paragraphs of historical narration. Those should become separate rule groups.
- The current-role test also embeds exact accepted/fallback versions, published SHA/size and old acceptance text; those are temporal evidence rather than reusable document-governance rules. Publication and immutable-recovery guards must be located before any proposed retirement.

## Inventory conclusion

- The detailed inventory below maps all 27 top-level cases into 59 rule groups: 22 `KEEP`, 16 `REPLACE`, 4 conditional `RETIRE`, and 17 `DEFER`. Labels are proposals for assertions, not authority changes or permission to delete tests.
- The four `RETIRE` groups concern historical or explanatory wording. Each has a stated dependency on structural, identity, safety or recovery coverage. Historical records themselves are preserved.
- The highest-risk unresolved families are Cloud operator preflight/evidence, Release command and identity selection, plan-local versus platform permission, immutable published/cold evidence, retirement/link recovery, and the test-source self-lint. Existing checks remain until equivalent evidence is designed and authorized.
- The prior mixed-case method probe supplies a specific `REPLACE` candidate for the Wiki C0 tag/push command group (R24), but it does not prove the other Cloud/Release prose checks are safe to remove.
- `tests/published-release-oracles.test.js` covers accepted/fallback publication identity through ROADMAP/provenance and exact asset checks. The target files' old literals still require item-by-item comparison to this oracle or immutable Git recovery before retirement.
- Coverage auditing found every top-level case start represented and no duplicate group ID. This verifies case-level traceability, not one-to-one ownership of all 571 regex call sites; the source-order review and group descriptions are the rule-level evidence.

## Recommended next decision

Review and approve or amend the proposed group dispositions, especially the `DEFER` register. Then define one small implementation gate for R24's command-block replacement plus the two harmful/harmless probes, while leaving unrelated assertions intact. Do not freeze Discovery or begin broad test cleanup from this inventory alone.

## Detailed rule-group inventory

Status: `OPEN / PROPOSED`. This is a rule-level review of the two target test modules at local source `fae9adf8e7ea6e0ab18d3b1b3a2cfe733658432d`; it is not a test patch, a frozen history record, or an implementation decision. Line numbers below refer to that source. `A` means `tests/architecture-contracts.test.js`; `R` means `tests/repository-boundary.test.js`.

### Method and coverage boundary

The 27 top-level cases contain 571 literal `assert.match` / `assert.doesNotMatch` call sites (A: 206, R: 365), alongside equality, collection, filesystem and Git checks. Calls in loops can protect more than one object. The table groups assertions by the rule they protect; one case can appear in several rows. Labels are proposed dispositions for the **test assertion group**, not instructions to delete documentation or alter the underlying rule:

- `KEEP`: the present check protects an identifiable parseable boundary and can stay.
- `REPLACE`: preserve the rule, but validate it by owner-linked structure, exact command block, machine contract, or data-driven relationship.
- `RETIRE`: the particular assertion freezes historical narration or equivalent prose with no independent current failure consequence; keep the historical document itself.
- `DEFER`: the rule matters, but the equivalent guard or ownership proof is not ready. Keep the current check until that proof exists.

Owner names below are routes to existing authority, not a new authority map. README's documentation map resolves the current owner. Where a relationship spans documents, the owner cell identifies which part each document owns. “Historical” means evidence from its time, not a current command. “Current” means a live repository, operator, or machine boundary. Where a case contains both, separate rows carry separate labels.

The owner routes can be checked against stable entry anchors: [README map](../../README.md#documentation-map), [DESIGN implementation layout](../../DESIGN.md#implementation-layout), [ROADMAP Phase route](../../ROADMAP.md#product-phase-route-index), [ROADMAP Release flow](../../ROADMAP.md#release-four-step-flow), [Guide planning lifecycle](../../docs/repository-governance-guide.md#planning-lifecycle), [Guide history roles](../../docs/repository-governance-guide.md#history-record-roles), [Guide retirement completion](../../docs/repository-governance-guide.md#retirement-definition-of-done), [Cloud template hard stops](../../docs/cloud-hard-acceptance-template.md#acceptance-hard-stops), [Operator Guide lifecycle](../../docs/cloud-acceptance-operator-guide-template.md#operator-guide-document-lifecycle), [Wiki C0 command](../../Wiki.md#source-candidate-c0-tag-push), [environment profile](../../docs/maintenance-environment-profile.md#maintenance-environment-profile), [history index](../../docs/history/README.md#phase-history-index), and [acceptance role window](../../docs/acceptance/README.md#acceptance-role-window). Machine contracts and source files are exact file-level authorities rather than Markdown anchor targets. These links are review pointers, not a replacement for README's owner map.

### A — architecture-contracts.test.js

| ID / source | Rule and failure if broken | Owner route / time | Proposal and reason |
|---|---|---|---|
| A01 · 15–60 | Local Markdown targets and explicit stable fragments resolve; otherwise navigation breaks. | AGENTS link rule + each target's anchor / current | `KEEP` the existence, containment and explicit-anchor checks. |
| A02 · 15–60 | Two exact repeated Phase overview targets are currently allowed; an unexpected repeated target may hide double navigation. | README map and ROADMAP Phase route / current | `REPLACE` the fixed duplicate-count exception with owner-aware link roles; “exactly two” is rollout shape. |
| A03 · 61–95 | Handoff directs readers to the current map, implementation, environment and recovery entry points; a wrong route misleads new maintainers. | MAINTAINER_HANDOFF, with linked owner docs / current | `REPLACE` whole-file word presence with parsed links/targets and their roles. |
| A04 · 61–95 | Handoff stays a triage page rather than a versioned command/status runbook. | MAINTAINER_HANDOFF / current | `REPLACE` exact headings, signal words and broad number/code-fence bans with a narrower boundary check and human review of explanation. |
| A05 · 61–95 | Handoff must not enter the Release ZIP. | Release artifact contract / current machine | `KEEP` contract-entry exclusion. |
| A06 · 96–164 | Operator guide has stable role anchors and exact Pre-run/channel/Final status tokens; missing identity can misroute evidence. | Operator Guide template / current protocol | `KEEP` role anchors and machine-readable status tokens while their protocol is active. |
| A07 · 96–164 | Chapter names, prose about guide counts and the freeze lifecycle are tied to sentence order. | Operator Guide template / current writing method | `REPLACE` with named sections and lifecycle relation checks; do not require one wording or all headings verbatim. |
| A08 · 96–164 | Product Round count, two Release Cloud channels and C0/C1/C2 have distinct roles; conflation could authorize the wrong gate. | ROADMAP Release flow / current programme | `DEFER` prose assertion retirement until a relationship check follows ROADMAP ownership and preserves the stop states in the templates. |
| A09 · 165–243 | Plan request/result schema, bundle, Release inventory and adapter-only policy must remain exact. | Machine contracts, manifest and package/consumer code / current machine | `KEEP` schema/inventory/identity checks; no wording cleanup may remove them. |
| A10 · 165–243 | Adapter dispatch order, time budget, activation admission and no parallel plan reader affect execution safety. | Adapter/owned runtime code plus seam tests / current behavior | `DEFER` source-text regex changes until nearest behavioral/AST guards are shown equivalent; retain fail-closed checks. |
| A11 · 165–243 | ARCHITECTURE's installed-contract projection must agree with the verified bundle. | Runtime bundle for inventory; ARCHITECTURE for explanation / current projection | `KEEP` the bundle-derived membership check rather than hand-maintaining a second inventory. |
| A12 · 244–279 | README provides question-to-owner navigation and stays free of moving role state. | README documentation map / current | `REPLACE` whole-file filename and prose exclusions with parsed map entries and section-boundary checks. |
| A13 · 244–304 | DESIGN identifies implementation paths, module responsibility and verification destinations. | DESIGN / current | `KEEP` path/anchor relationships; paths remain checkable. |
| A14 · 280–304 | DESIGN must avoid absorbing architecture rationale, current rollback state or numeric runtime facts. | DESIGN for layout; ARCHITECTURE/contracts for other facts / current | `REPLACE` generic word/number bans with section ownership checks; unrelated mention should not fail. |
| A15 · 305–333 | Every current test module has one reverse-index row in DESIGN. | DESIGN reverse index + repository test inventory / current | `KEEP` the data-driven exact set and uniqueness checks. |
| A16 · 305–333 | A sentence about “test title/ assertion” and a numeric prose ban attempt to enforce writing style. | DESIGN / current | `REPLACE` the textual sentence check with review guidance; keep only a targeted ban if a concrete second authority appears. |
| A17 · 334–499 | ROADMAP current train matches package identity; stable programme/Phase/Release anchors and pointer targets exist. | ROADMAP, package identity and target overview / current | `KEEP` parseable identity, anchor and target relations. |
| A18 · 334–499 | Release four-step/C0→C1→C2 ordering, Latest confirmation and unknown-result stop prevent wrong publication or role rotation. | ROADMAP Release flow / current safety | `DEFER` broad prose regex replacement until a scoped sequence/identity and negative-stop design passes harmful-change probes. |
| A19 · 334–499 | Planning deletion consent, retirement checkpoints, migration atomicity and pre-1.0 compatibility are safety/lifecycle rules. | ROADMAP for programme timing; Guide for planning/eviction method / current | `DEFER` current sentence assertions until each distinct owner and equivalent checks or named manual review are resolved. |
| A20 · 334–499 | Phase route rows, overview pointer rotation and old Phase examples are mixed with fixed milestone wording. | ROADMAP route index and Product overviews / current plus historical examples | `REPLACE` with route/overview link and state parsing; do not freeze individual summary sentences or historical Phase prose. |
| A21 · 500–516 | Plan-local autonomous opt-in does not grant platform/system permission; conflation is a trust-boundary error. | Phase 4 Overview and ARCHITECTURE for current boundary; Phase 4.1 record for history / mixed | `DEFER` retirement of the safety claim until code/contract and operator guidance cover it; historical sentence wording can then leave the test. |

### R — repository-boundary.test.js

| ID / source | Rule and failure if broken | Owner route / time | Proposal and reason |
|---|---|---|---|
| R01 · 36–123 | Development, accepted and immediate-fallback roles are distinct and parseable; candidate matches package/Release identity. | ROADMAP roles + package/Release contract / current | `KEEP` dynamic role parsing and relationship checks. |
| R02 · 59–123 | Exact v0.4.4 acceptance prose, asset sizes/hashes and Phase 4 summary are repeated in a moving test. | Immutable acceptance/provenance; publication oracle for current role / historical + current role | `DEFER` removal until each literal is matched to the publication oracle or cold evidence; no current test should become a second asset ledger. |
| R03 · 124–143 | Retired v0.4.0 root copies stay absent while its record and immutable acceptance link resolve. | History index/record + provenance / historical recovery | `KEEP` path retirement, anchor and immutable-reference checks while they remain relevant to current links. |
| R04 · 124–143 | Exact Phase 4.12 renumbering heading, P9 prose and closed-train sentence are frozen. | Phase 4.12 record / historical | `RETIRE` sentence/heading matches once R03 structural and cold-link checks remain; record text is preserved. |
| R05 · 144–177 | v0.4.1 acceptance bytes can still be read from an immutable Git ref after current-root retirement. | Immutable Git ref + provenance / historical recovery | `KEEP` recoverability and current-root absence checks. |
| R06 · 144–177 | Fixed old acceptance sentences, validation-ref count and older SHA literals are copied into current suite. | Immutable acceptance/provenance / historical | `DEFER` literal retirement until the cold-evidence audit and current publication oracle roles are explicitly separated. |
| R07 · 178–223 | Trusted source set equals the Release contract plus named source-only trusted files; docs/tests/planning are excluded. | Runtime/Release contracts and repository inventory / current machine | `KEEP` exact set, existence and Release-exclusion checks. |
| R08 · 178–223 | Old prototype paths are forbidden forever by selected tombstones. | Guide retirement method + current trusted inventory / former paths | `DEFER` each tombstone's live recurrence risk; trusted exact inventory already rejects extra trusted source, but nontrusted stale names need review. |
| R09 · 178–223 | Fixture paths use semantic identities instead of versioned file names. | Tests fixture policy / current | `KEEP` the path-pattern check while fixtures remain consumed by portable tests. |
| R10 · 224–264 | Maintenance profile is reachable, anchored and excluded from Release; AGENTS/handoff/README route to it. | Environment profile for facts, README map for navigation, Release contract for exclusion / current | `KEEP` target-link, anchor and Release-exclusion relations. |
| R11 · 224–264 | Profile's dated WSL/container/Cloud facts and explanatory sentences are frozen in tests. | Maintenance environment profile / dated current fact | `REPLACE` exact date and sentence checks with status/trigger/route fields or bounded human review; retain an explicit route for Linux-only evidence. |
| R12 · 265–286 | One active pointer resolves to a valid scope while completed scopes may remain. | Active planning pointer + Guide lifecycle / current | `KEEP` actual scope validation and retained-scope fixture. |
| R13 · 265–286 | Guide/ROADMAP planning-deletion sentences must appear in one wording. | Guide for deletion consent; ROADMAP for checkpoint timing / current | `REPLACE` with owner links and a testable no-auto-delete relation; phrase itself is not the contract. |
| R14 · 287–319 | Tracked Markdown relative links stay inside repository, target real files and resolve explicit fragments. | AGENTS link policy + target documents / current | `KEEP` executable link/anchor graph validation. |
| R15 · 320–362 | Docs paths, candidate/accepted bootstrap and acceptance windows, Phase overview files and template location match active roles and Release exclusions. | Release contract; ROADMAP role window; Guide acceptance lifecycle / current | `KEEP` derived path/set/Release-exclusion checks. Review the exact Phase 4/5 overview list at later Phase activation. |
| R16 · 352–407 | Cloud and Operator Guide templates expose stable named anchors and exact evidence-state tokens. | Cloud and Operator Guide templates / current protocol | `KEEP` anchor and state-token presence while consumers use them. |
| R17 · 352–407 | Acceptance index and templates must repeat wording about roles, Round counts, guide freezes and C0/C1/C2. | ROADMAP for programme; templates for their own execution/write protocol / current | `REPLACE` repeated prose with links, role/state structure and owner-specific checks. |
| R18 · 408–443 | Cloud baseline tool preflight forbids unsafe shell writes, false conflicts and premature activation. | Cloud hard acceptance template / current operator safety | `DEFER` sentence-level test retirement until command/permission/negative-example checks or explicit operator review preserve each stop. |
| R19 · 444–464 | Markerless baseline, process/session polling, final exit code and no invented evidence are required. | Cloud hard acceptance template / current operator/evidence safety | `DEFER` current prose checks until exact markers and process-result relations are verified without paraphrase fragility. |
| R20 · 455–483 | Both deep-check channels derive manifest/bundle/schema/hash facts from machine authorities. | Runtime bundle/Release contracts for facts; Cloud template for protocol / current machine + operator | `DEFER` occurrence-count and literal-Python changes until scoped channel/contract-derived checks prove the same two-channel identity. |
| R21 · 483–498 | Stable template must not acquire version hashes, current status or Release artifact constants. | Cloud template / current protocol | `REPLACE` broad whole-file bans with scoped template placeholders and machine-derived inputs; keep the version-neutral boundary. |
| R22 · 499–529 | README/Wiki split, navigation anchors and Release ZIP inclusion are stable. | README map, Wiki navigation and Release contract / current | `KEEP` links, explicit anchors and package membership; guide prose order is a separate writing issue. |
| R23 · 530–576 | Candidate bootstrap selection, URL/SHA overrides, exact candidate identity and asset materialization are operator safety rules. | Wiki commands; Release contract and materializer for machine identity / current | `DEFER` whole-file sentence/command regex changes until fenced-command and contract-derived negative probes cover wrong script, version and SHA. |
| R24 · 577–588 | Actual PowerShell `git tag` targets Source/Candidate C0 and `git push` names only one tag ref. | ROADMAP for C0 identity; Wiki for executable command / current safety | `REPLACE` whole-file substring matches with the anchored code-block check designed in the prior method probe, plus preflight/peeled-commit coverage. |
| R25 · 577–602 | Exact C1/C2 warning and other Wiki explanations must use fixed Chinese sentences. | Wiki explanatory text, with ROADMAP as rule owner / current prose | `RETIRE` wording assertions after R23/R24's actual commands, identity and stop conditions have equivalent coverage. |
| R26 · 589–602 | Two old beta migration files are forbidden by name. | Guide retirement method / former paths | `DEFER` whether these selected tombstones still protect a realistic recurrence beyond inventory/links. |
| R27 · 603–629 | README and ROADMAP are the only macro history entrances; other macro docs cannot create a third. | README map + ROADMAP route + Guide history method / current | `KEEP` entrance count/target/absence relations, but derive allowed ROADMAP links from purpose rather than a frozen exact count. |
| R28 · 630–675 | History objects have legal roles, index membership, stable anchors and controlled Product overview links. | Guide role policy, history index/template, ROADMAP pointer route / current governance of historical objects | `REPLACE` fixed 18/11 totals and long prose matches with parsed role/index/record/link checks. |
| R29 · 676–702 | Old records' reindex status must repeat exact old/new Phase prose across seven files. | Historical records for past wording; ROADMAP for current Phase route / historical + current | `RETIRE` narrative wording checks after preserving explicit status anchors, current ROADMAP links and immutable source evidence. |
| R30 · 703–896 | Phase 4.13–4.17 records exist, have appropriate role/anchors/index links and stay outside Release. | History index/template + Release contract / historical object structure | `REPLACE` per-record handcrafted anchor arrays with a role-aware index/record validator; retain immutable links. |
| R31 · 703–896 | Five closed records must retain historical heading and summary wording unrelated to current routing or safety. | Each frozen record / historical narrative | `RETIRE` prose-shape assertions after R30 preserves object structure; do not rewrite the records. |
| R32 · 897–914 | Guide exposes stable retirement and acceptance lifecycle anchors. | Repository Governance Guide / current method | `KEEP` anchor existence and inbound-link validity. |
| R33 · 897–914 | Guide's three-stage retirement/link procedure is matched by broad wording regex. | Repository Governance Guide / current safety method | `DEFER` retirement of the procedure checks until before/after link-inventory and restoration probes or named manual review are specified. |
| R34 · 915–944 | Cold history and planning never enter Release/runtime/adapter dispatch; candidate package/external bootstrap identities are exact. | Runtime bundle/Release contract + adapter/installer / current machine | `KEEP` exact package/inventory and execution exclusion checks. |
| R35 · 915–944 | Seven old commit literals must remain anywhere in provenance. | Provenance and immutable Git refs / historical identity | `DEFER` literal retirement until each ref is mapped to a required current role or cold audit; mere substring presence does not prove recoverability. |
| R36 · 945–1012 | CHANGELOG delta, ROADMAP lifecycle, provenance identity and current acceptance are distinct; candidate must not become published by prose accident. | Each named authority, README map / current + immutable | `REPLACE` broad phrase bans and literal accepted-title checks with parsed sections, role-linked provenance and publication-oracle relations. |
| R37 · 1013–1020 | Stable architecture test source should not freeze version acceptance, hashes or entry counts. | DESIGN test responsibility policy / current lint | `DEFER` source-self-check replacement until a narrow AST/source lint and false-positive cases are designed; avoid blessing the current broad regex as policy. |
| R38 · 703–896 | Historical records also repeat exact source hashes, Release and path-safety claims whose current or cold evidence must remain recoverable. | Immutable source/provenance for old identity; current installer/Release/Wiki/contracts for live safety / historical evidence + current safety | `DEFER` these literal checks until each claim is matched to its current guard or immutable recovery path; do not bundle them with R31 prose retirement. |

### Case-to-group coverage audit

Each top-level case is represented; its mixed parts are routed to more than one group where necessary. The source review also included non-regex assertions in these cases.

| File | Top-level case starts → inventory groups |
|---|---|
| A | 15→A01–A02; 61→A03–A05; 96→A06–A08; 165→A09–A11; 244→A12–A13; 280→A13–A14; 305→A15–A16; 334→A17–A20; 500→A21 |
| R | 59→R01–R02; 124→R03–R04; 144→R05–R06; 178→R07–R09; 224→R10–R11; 265→R12–R13; 287→R14; 320→R15–R26; 603→R27–R29; 703→R30–R31,R38; 735→R30–R31,R38; 800→R30–R31,R38; 830→R30–R31,R38; 859→R30–R31,R38; 897→R32–R33; 915→R34–R35; 945→R36; 1013→R37 |

### Explicit DEFER register and next evidence

1. **Current operator safety (A08, A18–A19, R18–R20, R23, R33):** preserve existing checks while designing scoped negative examples for wrong C0/tag, wrong bootstrap, mutable or unverified URL/SHA, shell write before safe preflight, missing final exit code, invented evidence, and link retirement without an immutable replacement. R24 already has a bounded replacement design from the method probe, but its existing check also remains unchanged until an implementation gate. A future design must state exactly which checks remain, which move, and which manual review owns the residual semantics.
2. **Runtime and permission boundaries (A10, A21):** cross-check adapter/owned runtime and plan-local opt-in against the nearest seam/activation tests before touching source-text assertions. Product consent must never be inferred from platform execution permission.
3. **Cold and temporal identity (R02, R06, R08, R26, R35, R38):** compare each fixed version, hash and tombstone against the current accepted/fallback publication oracle, provenance and immutable Git recovery. Do not delete a necessary rollback or published-asset check merely because its text is old.
4. **Test-source lint (R37):** define what second authority the lint prevents, then test a harmless version mention and a genuinely frozen version identity. Retain or replace only if it discriminates them.

No `RETIRE` row authorizes removal. The full inventory supplies the rule-level map required by the open Phase 5.1 draft; remaining DEFER items and the representative implementation design still need a later decision before freeze or test modification.
