# Findings: Phase 5.1 B1f Cloud template neutrality

## Starting evidence

- Clean `0.5.0-dev` branch after B1e local commit `6ccae74`; no pre-existing user changes.
- Frozen B1 assigns R21 to Cloud hard acceptance template version-neutrality. Inventory proposes replacing whole-file bans with scoped placeholders and machine-derived inputs, while keeping the version-neutral boundary.
- R21's current seam near the end of the large repository-boundary test bans any version string, 40–64 hex hash, Phase 4 marker, selected current-state labels and `readonly` artifact constants across the entire template. R20's deep-check derivation and R22's stable-document bootstrap boundary are adjacent and outside this edit scope.
- The template has explicit 4.2 Published Release bootstrap URL/SHA and 9.2 Published Release ZIP URL/SHA placeholders in executable Bash fences; per-run values belong to the activity plan/environment, not this stable template. It also includes intentionally generic lifecycle status tokens and executable Source/Candidate selector/deep-check scripts.

## Open classification

- Define the smallest parseable active-code/state slots that reject fixed identity or current results without rejecting ordinary explanatory examples.
- Preserve neighboring exact Cloud operator safety checks; do not infer Cloud PASS from local template tests.

## Selected guard shape

- The template has four Bash fences: 4.1/4.2 setup and 9.1/9.2 deep check. Treat executable Bash lines (excluding comments) as identity-bearing; a fixed version/hash or literal artifact constant there is not benign explanation. The `text` fences are task prose/shape, not shell execution.
- In the anchored 4.2/9.2 Bash fences, require one exact placeholder assignment for each immutable public URL/SHA input. This is the positive counterpart to rejecting hardcoded values; nearby Source/Candidate and deep-check tests still own bootstrap selection and machine-derived package inventory.
- Current-state headings/table keys are authority slots; ordinary explanatory prose can mention a historical version/hash or say “当前状态” without becoming a current result. A probe must distinguish these two placements.

## Local result and residual

- The guard now scopes version/hash/current-result checks to fenced Cloud protocol, headings, and the responsibility table. It requires one unresolved URL/SHA assignment each in anchored 4.2 and 9.2 Bash fences; literal `PUBLICATION_TAG`/`PACKAGE_VERSION`/`ZIP_NAME`/`ZIP_SIZE` assignments are rejected while machine-derived `$(...)` remains allowed.
- In-memory hardcoded bootstrap SHA, fixed package version, fixed ZIP size, current-state table row and versioned responsibility row fail. A prose-only explanation mentioning an old version/hash and the words “当前状态” passes. This proves placement/role, not arbitrary natural-language semantics.
- The template itself did not need repair. R16 exact anchors/states, R18–R20 Cloud operator/deep-check safety and R22 stable-document bootstrap names remain unchanged. A prose paragraph that subtly asserts a new current result without taking a recognizable authority slot still needs owner review; this guard cannot reliably infer all Chinese/English meaning.
- Final local evidence: focused repository-boundary 23/23; full Windows suite 201 total, 175 pass, 26 Linux/POSIX-only skips, 0 fail. `node --check` and `git diff --check` passed. These checks do not constitute Cloud or Linux acceptance.
