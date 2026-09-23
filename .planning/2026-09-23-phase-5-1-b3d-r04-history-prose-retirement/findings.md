# Findings: R04 history prose retirement

## Baseline

- Clean `0.5.0-dev` after B3c commit `232eaaa`.
- Frozen Discovery orders R28/R30 structural relations before conditional R04/R29/R31 retirement. R04 inventory specifically targets Phase 4.12's exact heading, renumbering prose, P9 continuity sentence and closed-train literal; R03 retains root-copy absence, canonical anchors and immutable acceptance recovery.
- Phase 4.12 is an older record without a dedicated `Cold evidence` section. Its indexed canonical entry is `phase-4.12-v0.4.0-release-discovery.md#phase-4-12-v0-4-0-release-discovery`; the record also has a `phase-4-12-renumbering-note` explicit anchor.
- `BASELINE_PROVENANCE.md` links the retired v0.4.0 acceptance at exact commit `6b388518855da9053713a58e5c918c8b727b6dc6` and fragment `v0-4-0-p9-f-second-retirement-closeout`. `git show` confirms the fragment is present in that immutable file.

## Decision and residual

- A focused relation guard now requires one Phase 4.12 index row targeting the canonical record/entry anchor, a separate renumbering-note anchor, no retired Phase 9 compatibility anchor, the exact provenance acceptance link, and the linked immutable acceptance's P9-F anchor and closed-train result.
- Existing checks for retired v0.4.0 root bootstrap/acceptance absence and ROADMAP fallback-evidence route remain.
- Harmful in-memory index/record/provenance/immutable-acceptance changes fail; equivalent P9 explanatory prose passes. Only Phase 4.12 heading/renumbering/closed-train wording checks were retired. The frozen record itself was not edited.
- R29/R31 remain for later independent review; R38 remains deferred.
