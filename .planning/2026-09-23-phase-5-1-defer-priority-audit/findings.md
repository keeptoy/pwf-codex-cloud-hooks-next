# Findings: Phase 5.1 DEFER prioritization audit

## Starting context

- The prior 59-group inventory proposed 17 `DEFER` groups, all retaining their current assertions pending equivalent guards or ownership evidence.
- The separately authorized R24 C0 operator-command sample passed harmful/harmless probes and local regression; it does not settle adjacent R23 or other DEFER risks.
- Current repository role remains `v0.5.0-dev` Phase 5 document governance. This audit selects the next evidence slice only.
- Read-only audit source baseline: local `7b03164f10e0d68b68e0109170bd51e6c8971796` before activating this planning scope. The other 16 DEFER rows receive a priority/owner triage here, not a new item-by-item equivalence proof.

## Working comparison

- The 17 DEFER rows separate into current operator/Release protocol (A08, A18, A19, R18–R20, R23, R33), runtime/permission (A10, A21), immutable/cold identity and path tombstones (R02, R06, R08, R26, R35, R38), and source self-lint (R37). This is a prioritization lens, not a new disposition.
- R23 is a candidate for the next *sub-slice*, not for retiring the whole group. Its operator-facing candidate-bootstrap selection rule has a machine owner (`release-artifact-v2.json.external_release_assets` via manifest) and a concrete executable consumer in Cloud template 4.1. Existing contract and asset tests also check exact candidate identity and zero-hash materialization. The remaining question is whether current document regexes test the live command/protocol or merely repeat explanation.
- High-risk R18/R19 and A18 have broader Cloud/Release stop-state semantics; R37 is bounded but lower consequence. None can be reclassified from the inventory by risk rank alone.

## All-DEFER review (priority, not disposition)

`Near guard` means a relevant existing check or authority was located; it does **not** prove equivalence to the deferred assertion. Priority compares consequence, owner clarity, guard maturity, and whether a small two-way probe is feasible.

| ID | Consequence / near guard | Audit route |
|---|---|---|
| A08 | Round/channel/C0 role confusion; ROADMAP Release flow and guide templates own separate roles. | High consequence, but first define cross-document state model; leave deferred. |
| A10 | Adapter order/timeout/activation drift; runtime seam and activation tests exist. | Safety critical; needs behavior-to-source regex equivalence audit, outside a document-only slice. |
| A18 | Wrong Release sequence or Latest decision; ROADMAP owns state/stop. | High consequence and broad; split C0/Latest later, not prose cleanup now. |
| A19 | Planning deletion/retirement/compatibility conflation; Guide and ROADMAP split method/timing. | First separate owners and human consent gate; no single test replacement yet. |
| A21 | Product opt-in mistaken for platform permission; activation tests cover product state, not platform authorization. | Keep explicit trust claim until permission evidence is mapped. |
| R02 | Current accepted/fallback asset identity mixed with old prose; publication oracle exists. | Audit each literal against current role oracle before removal. |
| R06 | Cold v0.4.1 SHA/ref/recovery text; immutable Git/provenance exists. | Needs item-by-item cold-recovery map, not version-string deletion. |
| R08 | Former trusted path tombstones; exact trusted set rejects many recurrences. | Check nontrusted stale-name risk separately. |
| R18 | Cloud preflight and unsafe write stops; template owns executable protocol. | High consequence; requires scoped command/permission probes and operator residual. |
| R19 | Markerless/final-exit/evidence integrity; template owns execution/evidence protocol. | High consequence; design state/result guard before editing prose tests. |
| R20 | Two deep-check channels derive hashes/schema from contracts; template has two scripts. | Good future slice, but channel/contract dataflow is larger than R23a. |
| R23 | Wrong candidate bootstrap or public-vs-local URL/SHA; contract identity, materializer, bootstrap and package tests exist. | **First candidate: only contract-selected Source/Candidate bootstrap execution in template 4.1 plus Wiki projection.** Keep the rest deferred. |
| R26 | Two beta-file tombstones; current lifecycle inventory is nearby. | Review recurrence before changing absence checks. |
| R33 | History retirement could lose immutable recovery/link path; Guide procedure plus link checks exist. | Needs before/after recovery fixture and named human review. |
| R35 | Old commit literals may represent cold recovery; provenance/Git refs are owners. | Audit each ref's necessity and recoverability. |
| R37 | Test-source self-lint may stop second authority; no narrow purpose proved. | Bounded but lower failure consequence; later false-positive/true-positive lint probe. |
| R38 | Closed records mix current safety with cold hashes; current code/oracles and immutable refs are separate. | Split record claims by live guard versus cold recovery; defer. |

## R23a corroborated boundary

- `docs/cloud-hard-acceptance-template.md#source-candidate-setup` contains one fenced Bash 4.1 script. It reads `upstream-manifest.json` → the named Release artifact contract → `external_release_assets`, asserts exactly one asset, checks that file and Bash syntax, runs the portable suite, double-builds/checks the ZIP, then executes `HOOKS_URL=file://... HOOKS_SHA256=<actual candidate ZIP SHA> bash "$BOOTSTRAP" all`.
- `tests/contracts.test.js`, `tests/release-assets.test.js`, `tests/release-package.test.js`, and `tests/bootstrap.test.js` independently bind contract asset name to package version, canonical zero-hash candidate bytes, ZIP exclusion and checksum behavior. They do **not** by themselves prove that the *operator template's active 4.1 script* continues to select and execute that contract-named bootstrap.
- The R23 regexes in `tests/repository-boundary.test.js` primarily match Wiki explanation of the selection chain and overrides; a changed executable 4.1 selector can leave those Wiki matches green. Conversely, a harmless Wiki paraphrase can fail their sentence windows. This is the gap for a next bounded, read-only method probe or implementation gate.

## In-memory two-way evidence

No repository file was mutated and no Markdown tutorial command was executed. The selected existing Wiki regexes and a minimal candidate code-block check were applied to strings in memory:

| Scenario | Existing Wiki assertion | Candidate 4.1 active-block signal | Expected |
|---|---|---|---|
| Unchanged Wiki/template | selection and wording regexes pass | contract-selected script and `$BOOTSTRAP` invocation present | pass |
| Replace 4.1 `print(assets[0])` with an old hard-coded bootstrap filename; Wiki unchanged | selection-chain prose regex still passes | contract-selected output missing | fail |
| Replace active `bash "$BOOTSTRAP" all` with an old hard-coded script; Wiki unchanged | selection-chain prose regex still passes | selected-variable invocation missing | fail |
| Rewrite Wiki's “does not scan/guess filenames” sentence to the same contract-selection meaning; template unchanged | exact wording regex fails | active selection remains intact | pass |

The candidate signal in this probe is deliberately small and **not** an approved test helper. It proves that the *method* can distinguish two failure directions; the next gate must design a scoped, adversarially tested checker rather than copy these substring expressions as a permanent oracle.

## Proposed next gate: R23a only

1. **Rule and owner:** Release artifact contract owns the unique external candidate asset and version identity; Cloud hard acceptance template 4.1 owns Source/Candidate selection/execution protocol; Wiki owns the operator explanation and should link to the template's stable `source-candidate-setup` anchor. Do not move a second asset inventory into Markdown or JavaScript.
2. **In-scope replacement target:** only R23's Wiki assertions about the 4.1 contract-selection chain and the directly dependent explanatory sentence. Keep its materialization, zero-hash, public-vs-local override, Source/Candidate identity, and R24 assertions unchanged unless a separate proof and authorization cover them.
3. **Proposed check:** locate the unique 4.1 Bash code fence under `source-candidate-setup`; statically verify the embedded selector follows manifest → named Release contract → `external_release_assets` with exactly-one admission, then verify `test -f`, `bash -n`, and the later local URL/actual ZIP SHA invocation use that selected `$BOOTSTRAP`. Derive version identity from existing contract tests; never hard-code current or accepted versions in this checker. Do not execute Markdown script content.
4. **Required negative/positive probes:** wrong hard-coded old script at selection or invocation, removed exactly-one admission, missing `$BOOTSTRAP` validation, missing URL/SHA override, duplicate executable selector or invocation, safe-looking decoy outside the active block; equivalent Wiki wording and non-semantic comments should pass. A real code-flow bypass or inability to distinguish active code from decoys is a stop.
5. **Residual manual review:** a bounded text/structure checker is not a Bash/Python interpreter. Changes to control flow, alternative shell syntax, or Cloud task order require owner review; current template and machine tests remain as independent guards. Do not claim Cloud PASS from local parser tests.
6. **Verification and rollback route:** add probes before replacing the covered assertions; run focused repository/contracts/release-assets/bootstrap tests and the full local suite. Windows POSIX skips remain skips. If the scoped check cannot discriminate harmful/harmless cases, retain R23 as DEFER and revert only the candidate test patch. Any actual template, contract, bootstrap, ZIP input, or Cloud/Release change is outside this gate and needs separate authorization/platform evidence.

This is a **recommendation for a later separately authorized implementation gate**, not approval to edit R23 now. R23 as a whole and the other 16 DEFER groups retain their proposed `DEFER` status. Phase 5.1 remains `DRAFT / OPEN`.

The Phase 5.1 exit conditions still require owner/equivalence resolution for the remaining safety and cold-evidence groups and explicit maintainer freeze authorization. One successful R24 sample and this R23a route proposal do not satisfy them.
