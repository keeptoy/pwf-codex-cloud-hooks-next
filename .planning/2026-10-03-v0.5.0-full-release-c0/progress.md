# Progress: v0.5.0 FULL Release C0

## 2026-10-03

- Maintainer explicitly authorized continuing with the FULL workflow.
- Loaded the planning-with-files skill, ran session recovery, confirmed a clean `0.5.0` branch at stable-identity
  commit `a06947f`, and activated this separate C0/Source-Candidate plan.
- Preserved the default responsibility split: local C0 preparation and verification belong to the assistant;
  branch push, Cloud execution, tags, Release assets and promotion remain maintainer actions.
- Re-read README and ARCHITECTURE. Recovered the exact zero-hash-before-seal, external-bootstrap, deterministic ZIP,
  immutable-publication and FULL trust/rollback boundaries for this gate.
- Re-read DESIGN and the first ROADMAP sections, including current roles, Phase routing, Discovery governance and
  the C0/C1/C2 + two-channel FULL sequence. Continued reading is required because the initial combined output was
  truncated; no implementation decision will rely on the missing portion.
- Completed the remaining ROADMAP and full Wiki reads. Confirmed C0 may use only the tracked zero-hash bootstrap and
  temporary candidate ZIP; formal exact-hash `dist/` assets remain blocked until Source/Candidate Cloud returns PASS
  and its exact ZIP SHA.
- Read the maintenance environment profile, current operator-guide template, historical v0.4.4 guide as it existed
  at C0, and Cloud template sections 0–6. Confirmed Linux zero-skip evidence must be routed to disposable Cloud and
  that the guide can bind its exact C0 through the post-commit handoff without embedding a self-referential hash.
- Completed the Cloud template read through sections 7–11. Recovered the exact D/E black-box observations,
  Source/Candidate 9.1 deep-check outputs, evidence writeback schema and the prohibition on prebuilding a final
  Post-run section.
- Finished Phase 1 authority recovery. Selected a dedicated multi-Discovery Release entry named
  `docs/acceptance/v0.5.0-release-operator-guide.md`; this does not create another Product Discovery round. Confirmed
  all seven planning directories are retained and the runtime LF-normalization delta independently requires FULL.
- Began Phase 2: freeze the pre-run guide, non-destructive inventory and the minimum programme/governance pointers
  that make local C0 and Source/Candidate Cloud the only authorized next gate.
- Added `docs/acceptance/v0.5.0-release-operator-guide.md` in strict Pre-run/PENDING state. It declares both FULL
  channels, exact v0.4.4 predecessor admission, the seven-directory KEEP inventory, G4/G5 separation and the stop
  before maintainer push; it contains no Cloud PASS, public asset identity, tag or promotion claim.
- Clarified the stable multi-Discovery naming route across the Cloud/operator templates, governance guide and
  acceptance index; updated ROADMAP, Phase 5 overview and CHANGELOG only to reflect the newly authorized local C0
  plus Source/Candidate handoff boundary.
- Focused repository-boundary regression passed: 29 tests, 29 pass, 0 fail, 0 skip. It covers the one-entrypoint
  candidate window, new Release-guide naming, explicit anchors/links, Release exclusion and programme-role claims.
- The first focused Release/contract/bootstrap/classifier run passed 43 of 46 tests; all three failures were the
  same ROADMAP fixture ambiguity because the Phase 5 status cell contained both `active` and `PENDING`. Product,
  contract, bootstrap, package and classifier checks passed. Reworded the gate progress as “approved, not yet
  executed” while retaining the sole Phase lifecycle state `active`; focused rerun remains required.
- The first architecture-only rerun reduced the result to one negative-fixture failure: its generic “first
  acceptance link” mutation now selected the newly added candidate guide instead of the accepted-version evidence
  link. Narrowed the mutation to the dynamically parsed accepted version; no production assertion was weakened.
- Architecture focused rerun passed 18/18. Combined with the earlier results, repository lifecycle is 29/29 and
  the remaining focused Release/contract/bootstrap/classifier tests are 28/28; Phase 3 is complete.
- Integrity/syntax gates passed: upstream importer `healthy=true`; candidate bootstrap `state=unchanged`, version
  `v0.5.0`, SHA-256 `5b49332db4f550901998f54e65d5c32808e12dd8e83b2479b4df8b91e4b91ae2`, embedded ZIP SHA all zeroes;
  Python compile, `node --check`, both tracked bootstrap `bash -n`, and `git diff --check` passed. Git Bash initially
  hit the documented sandbox signal-pipe restriction and passed unchanged when rerun outside that sandbox.
- FULL local suite passed: 222 tests, 196 pass, 26 honest Windows/POSIX skips, 0 fail. Linux zero-skip and actual
  Fresh/UserPrompt/real Resume evidence remains assigned to Source/Candidate Cloud.
- Two independent temporary candidate ZIP builds each passed contract check with 22 entries, 84,516 bytes and
  SHA-256 `7f4fcdee036b71c9093c044af1c015218d5a5533779d719d0f4f01bc79d0ba40`; direct byte comparison was true.
  Temporary ZIPs were removed after verification. No formal `release` materialization or non-zero seal occurred.
- Final C0 time-semantics audit changed ROADMAP/overview from pre-C0 wording to “local stable zero-hash C0 frozen;
  Source/Candidate PENDING”. The first focused rerun then found one stable parser phrase displaced by the qualifier;
  restored the canonical `current exact stable candidate ... branch` sentence and appended C0 status after it.
- Final architecture + repository-boundary rerun passed 47/47 after the C0 time-semantics correction.
- Advisory classifier preflight against accepted v0.4.4 closeout `053f66e` and the exact staged C0 tree reported
  identity closure `complete`, 7/7 identity checks PASS, 0 unknowns, 86 residual changes and lane
  `PRODUCT_OR_SECURITY`. Its evidence plan is explicitly `SHADOW_ONLY_NOT_EXECUTION_AUTHORITY` and retains the
  complete FULL C0/C1/C2 plus two-channel workflow.
- The classifier correctly invalidated `LOCAL_TEST_BASELINE` because tests changed relative to accepted v0.4.4.
  Re-established it on the final C0 content with another FULL run: 222 tests, 196 pass, 26 honest Windows/POSIX
  skips, 0 fail. The local gate is complete; next action belongs to the maintainer push and Cloud channel.
