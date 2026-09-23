# Progress: Phase 5.1 C0 operator-command governance gate

## 2026-09-23

- Recovered the previous method probe, 59-group inventory, current authority route and clean `0.5.0-dev` worktree.
- Activated a separate, narrow R24 implementation gate. No test, Wiki, runtime, Cloud, Release or remote state changed yet.
- Rechecked the exact Wiki command block, ROADMAP C0/C1/C2 rule, and lines 577–584 of the repository test. Froze the narrow command/preflight/peeled safety contract in findings; R23 and other DEFER assertions remain outside this gate.
- First helper patch did not reach the file: a JavaScript wrapper template literal collided with a backtick in the proposed error message. Rebuild the patch without nested template-literal syntax; repository test source remains unchanged.
- Added the scoped helper. First probe-test patch did not reach the file because a literal PowerShell `${RELEASE_VERSION}` placeholder was interpreted by the JavaScript wrapper; construct the placeholder in code before retrying.
- Adversarial probe test passed 19/19 repository cases before old assertion replacement. A follow-up patch did not reach the file because deleted source lines contained Markdown backticks that collided with the wrapper; apply the no-backtick safety tightening separately, then use a safe placeholder for the old-line removal.
- Replaced only the C0 command/prose subset with the scoped helper; two-file governance checks passed 28/28. A new equivalent-error-message probe intentionally fails because the helper still matches one exact Chinese `throw` sentence. Next change is to require ordered guard/throw structure without freezing message wording.
- Reworked the helper to preserve ordered guard/throw and exact command identity without freezing the Chinese stop message; targeted red/green probe now passes. Full Windows local `npm test`: 191 total, 165 pass, 0 fail, 26 POSIX/Linux-only skip.
- Added bounded R24 evidence to the still-open Phase 5.1 Discovery draft and corrected its stale non-conclusion. No broader group disposition, Cloud result, or freeze was inferred.
- Added a tilde-fence negative probe for a second broad push; final-state focused governance tests passed 28/28 and final-state full Windows `npm test` passed 165, failed 0, skipped 26. Reviewed the exact code/draft diff and corrected the draft's opening claim so it acknowledges only this separately authorized sample.
