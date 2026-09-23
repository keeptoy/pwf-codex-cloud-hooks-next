# Findings: Phase 5.1 governance-method probe

## Starting context

- The Phase 5.1 history document is still `DRAFT / OPEN` and requires a rule/owner inventory plus a representative two-way convergence design before freeze.
- The previous draft-creation scope is complete. This scope covers only the maintainer-authorized method probe.
- The candidate sample is the C0 annotated-tag operator block in `Wiki.md`, currently inspected by the large documentation-lifecycle case in `tests/repository-boundary.test.js`.
- ROADMAP owns the C0/C1/C2 source identity and Release sequence; Wiki owns the local operator command. The test should verify the command actually shown to the maintainer and the stable link/anchor, without requiring one Chinese explanation sentence.

## Sample boundary and observed checks

- Baseline source: local `2e2d54a73331cc08d5a745c39f0eb958a19ed8f1` before this planning-only probe.
- `ROADMAP.md` states that the formal tag must point to the Source/Candidate Cloud-PASS commit (`SOURCE_CANDIDATE_HEAD`). `Wiki.md#source-candidate-c0-tag-push` contains the PowerShell operator block with the annotated-tag command and a single-ref tag push.
- The documentation-lifecycle case in `tests/repository-boundary.test.js` checks the command substrings against the whole Wiki file at lines 579 and 581. Its line 578 also requires one specific C1/C2/current-HEAD explanation sentence. The sample retains the existing stable-anchor and Release-exclusion checks; only this command/prose subset was probed.
- The candidate check locates the stable C0-tag anchor, reads its first fenced PowerShell block, and checks that the active `git tag` and `git push` commands are the two expected bounded commands. It ignores text outside that code block. This is an in-memory design probe, not a repository test implementation or a PowerShell parser contract.

| In-memory scenario | Selected existing assertions | Candidate scoped check | Intended result |
|---|---|---|---|
| Unchanged Wiki excerpt | tag, push, and prose all match | pass | pass |
| Active tag command targets `SOURCE_CANDIDATE_CHECKPOINT_HEAD`; the safe command string remains as non-executable text | all three still match | fail | fail |
| Active push command becomes `git push origin --tags`; the single-ref command string remains as non-executable text | all three still match | fail | fail |
| Warning is rephrased to say the tag is fixed only to the Cloud-PASS C0 despite HEAD advancing; commands are unchanged | prose assertion fails; command assertions match | pass | pass |

The probe therefore exposes both a false negative on harmless prose and a false positive when a safe command appears outside the actual operator block. The scoped check distinguishes these four cases. The mutations occurred only in memory; no Git command from the tutorial was executed.

## Limits and next decision

- This validates the rule/owner/actual-instruction approach for one bounded sample. It does not classify every assertion in the large case or either target test file, prove the whole test case would pass or fail under each mutation, or authorize retiring any safety assertion.
- The candidate check currently accepts one exact spelling of each command. Before implementation, Discovery must decide which command variants are safe, verify preflight and peeled-commit checks separately, and consider whether a small parser or narrower command extractor is appropriate across platforms.
- The method is viable for broader Discovery inventory, provided the same owner/risk analysis is performed for each rule group. No Phase 5.1 freeze, implementation GO, Cloud claim, or Release decision follows from this probe.
