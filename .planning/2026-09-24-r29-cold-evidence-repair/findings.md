# Findings: R29 cold-evidence fact repair

## Entry evidence

- Worktree clean on `0.5.0-dev`; prior A20 classification commit `c601d24` is complete.
- `39f6616491ed98131b6a2e3b3d06a54af8d4bcd8` retired four stage guides and changed Phase 4.8's two former guide links and Phase 4.10's two former guide links to claims that a tail Cold evidence section restores their full text. Neither file gained that section.
- The accepted immutable source/acceptance commit `6b388518855da9053713a58e5c918c8b727b6dc6` is an ancestor of `39f6616^` and contains both retired guides and both history records. Its two guide blob IDs equal those in `39f6616^`: F3B3 `7763dcdb813ddbf8e520d90b62fa38024cb294a3`, F3C `56fdf22580d40bb816fc2ada1e23a967eb93b2b2`.
- F3B3 guide has explicit `f3b3-operator-positioning` and `f3b3-post-run-status` anchors. F3C guide has explicit `f3c2-smart-post-run-status` and `f3c3-autonomous-post-run-status` anchors. Last tracked copies include the claimed PASS status tails.
- History index policy allows at most one immutable source snapshot per record; a single commit link plus textual guide path preserves that shape without relinking a deleted current root copy.

## Decision

Append an explicit Phase-scoped `Cold evidence (not current authority)` section at each record's end, with one full commit URL to `6b3885…` and the exact retired guide path/anchor names as text. This corrects the previously introduced pointer claim; it does not revise the original time-bound record or prove a new Cloud result.

## Verified result

- Both history diffs add only a final, explicitly anchored Cold evidence section; no earlier line was rewritten. Each new section has one `/commit/<40 hex>` link to the same accepted immutable snapshot, plus its corresponding retired guide path and explicit anchor names.
- The snapshot guide blobs were rechecked against `39f6616^` and match exactly. Local Git confirms all four cited anchors in those paths. The new sections identify cold retrieval only, not a restored current guide or new Cloud acceptance.
- Focused architecture/repository-boundary tests: 47 pass, 0 fail. Full Windows `npm test`: 210 total, 184 pass, 26 POSIX/Linux-only skips, 0 fail. `git diff --check` passed before final planning writeback.
- R29 Phase 4.8's original four narration assertions remain unchanged. A separate gate may now decide whether the repaired evidence route meets R29's relational-retirement criteria; this repair alone does not retire them.
