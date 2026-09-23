# Findings: Phase 5.1 C0 operator-command governance gate

## Starting evidence

- The prior method probe identified a false positive: whole-file `git tag`/`git push` matches survive a wrong active command if the safe string is elsewhere. It also identified a false negative: an equivalent C0 warning rewrite fails the sentence regex.
- Formal inventory R24 proposes a scoped `REPLACE`; R25's prose retirement is conditional. R23 and the 17 `DEFER` groups remain out of scope.
- ROADMAP owns C0/C1/C2 identity and Release sequence. `Wiki.md#source-candidate-c0-tag-push` owns the command actually shown to the maintainer. The repository test is the enforcement location.

## Design boundary

- The C0 operator section begins at the explicit `source-candidate-c0-tag-push` anchor. It contains one PowerShell block for tag creation/push before the later asset-materialization command. The current whole-file assertions are at `tests/repository-boundary.test.js` lines 577–584.
- Scope the check to that named section and its PowerShell block, not a whole-file search. Require exactly one active `git tag` and one active `git push` command in the section, in order, with the C0 target and one exact tag refspec. Non-executable prose outside fenced code cannot satisfy it.
- Preserve the preflight/afterflight safety chain: exact C0 commit resolution, local and remote tag absence checks, local peel to C0, and remote peeled commit to C0. These are operator-command checks, not a PowerShell interpreter or a claim that arbitrary script variants are safe.
- A prose-only rewrite of the paragraph explaining why C1/C2 cannot replace C0 must not affect this check. The remaining Wiki lifecycle assertions, especially candidate bootstrap/asset rules (R23), stay unchanged.

## Bounded implementation result

- The repository test now selects fenced code after the stable C0 anchor, requires one PowerShell tag/push block, exact C0 tag target and exact single-ref push, and ordered preflight/local-remote peeled safety steps. It does not execute Wiki commands or claim to parse arbitrary PowerShell.
- Negative in-memory mutations reject an active C1 tag target with safe prose decoy, `--tags` push with safe prose decoy, missing C0 preflight, wrong remote peeled target, and a second broad push hidden after a later heading or in an alternative tilde fence. Positive mutations accept equivalent C0 prose and a reworded `throw` message while retaining the guard/stop structure.
- One red/green refinement mattered: an initial helper still matched exact Chinese error text, causing the equivalent stop-message probe to fail; matching ordered guard plus actual `throw` fixed that without removing the safety step.
- The previous whole-file C0 command and directly dependent warning/peeled/force prose assertions are replaced by this bounded check. R23 and other R25/DEFER assertions remain unchanged. Exact command spellings still require review if the operator tutorial intentionally adopts a safe PowerShell variant; this sample is not a general language parser.
- Focused architecture/repository checks passed 28/28. Final-state full Windows local `npm test` passed 165, failed 0, skipped 26 POSIX/Linux-only cases. This is local evidence only; it does not satisfy Linux/Cloud gates or Discovery freeze.

## Remaining decision

Review this sample's explicit limits and the 59-group candidate inventory. Decide whether to freeze a narrower Discovery scope or continue with another owner/risk slice. Do not infer approval for a broad replacement campaign from this one R24 pilot.
