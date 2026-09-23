# Findings: Phase 5.1 R23a candidate-bootstrap selection gate

## Starting evidence

- The prior audit at `.planning/2026-09-23-phase-5-1-defer-priority-audit/` showed two in-memory failures of the current R23 Wiki assertions: they stay green if template 4.1 selects or executes an old hard-coded bootstrap, and fail when a correct selection explanation is paraphrased.
- Release artifact contract owns external candidate identity; the Cloud hard acceptance template's 4.1 block owns executable Source/Candidate selection and local override protocol; Wiki owns operator explanation and navigation.
- Existing contract, release-assets, release-package, and bootstrap tests independently cover exact asset identity and candidate bytes, but not the 4.1 document's active selector/invocation.

## Design boundary

- Baseline source is local commit `cd32449a60e9dc3d7b5f5f2028c8e50f9f515b1b`. The active 4.1 section is `docs/cloud-hard-acceptance-template.md#source-candidate-setup`, lines 201–355, with one `~~~bash` block. It derives `BOOTSTRAP` from `upstream-manifest.json` → manifest-named Release contract → `external_release_assets`, asserts length one, then `test -f`/`bash -n` on that variable. After the portable suite and double ZIP build it computes `ACTUAL_ZIP_SHA256` and executes `HOOKS_URL="file://$ZIP_A" HOOKS_SHA256="$ACTUAL_ZIP_SHA256" bash "$BOOTSTRAP" all`.
- The target `tests/repository-boundary.test.js` assertions are the three Wiki selection-chain prose regexes at pre-change lines 655–660. Lines 645–654 and 661 onward cover different candidate materialization, URL/SHA/publication and zero-hash rules and must remain. `Wiki.md` currently links to the Cloud template file without the stable `#source-candidate-setup` fragment.
- The checker will locate the unique named section and its one executable Bash fence, then require one selector assignment, ordered dataflow and validation, and one selected-script invocation with local URL/SHA. It will ignore prose/decoys outside the code fence, but not execute code from a Markdown document. It is a bounded static guard, not a Bash/Python semantic parser.

## Bounded implementation result

- Added a static check in the existing repository-boundary test for the named 4.1 fence. It requires the selector's exact executable Python statement set (comments/blank lines ignored), manifest → Release contract → unique external asset, one `BOOTSTRAP` assignment, file/syntax validation, local ZIP build/hash, and exactly one invocation with local URL/SHA overrides. It derives no version filename or hash of its own.
- The negative in-memory probes reject: hard-coded old selection or invocation despite reassuring prose, missing exactly-one admission, asset reassignment after selection, missing file or syntax check, missing SHA or local URL override, overwriting the selected variable, and duplicate bootstrap execution. Equivalent Wiki wording and selector comments pass.
- Replaced only the three R23 selection-chain sentence regexes with this check. Kept all other R23 materialization/zero-hash/public-vs-local identity assertions, R24, and the other DEFER groups. Wiki now links directly to the executable 4.1 stable anchor; its operator explanation remains the same.
- This deliberately accepts only the current small selector syntax and is not a general Bash/Python interpreter. A future intentional executable-code refactor or Cloud task-order change still needs owner review and risk-matched platform evidence; a local green test is not Cloud PASS.
