# Findings: R29 Phase 4.8 route retirement

## Entry evidence

- The preceding `e0ea3bc` appends Phase 4.8's missing final Cold evidence section with one exact accepted `6b388518855da9053713a58e5c918c8b727b6dc6` source link, retired F3B3 guide path and two explicit anchor names. No historical body or R29 test changed.
- Six other R29 records already use `assertReindexStatusRoutes` for one index row, one scoped status anchor, the current ROADMAP route and historical evidence. Phase 4.8 was intentionally excluded until its source route existed.
- Phase 4.8 places Cold evidence after its dated reindex status, unlike the earlier six. Its current four assertions include two Phase-number/authorization prose pins; the test should preserve owner and fixed identity relationships without making the dated note current authority.

## Decision and verified result

- Added Phase 4.8 to the existing R29 route helper, with support for an indexed fragment and a status slice ending at the next `##` section. This prevents a later Cold evidence link from satisfying the current ROADMAP route check.
- Phase 4.8's tail Cold evidence must have one scoped anchor, the expected section heading, one exact accepted commit URL, and the retired guide path plus both explicit anchor identities. Local Git source is read to confirm the guide anchors resolve.
- In-memory wrong Phase 4.8 index, wrong current ROADMAP route, changed source SHA, duplicate short-SHA source and missing Cold evidence anchor all fail. Equivalent old→new Phase, placeholder-version and non-authorization explanations pass. The four former Phase 4.8 wording assertions were removed; the historical record remains untouched.
- Focused repository-boundary suite passes 29/29. Full Windows `npm test` passes 184/210, 26 POSIX/Linux-only skips, zero failures. The skipped cases are not Cloud/Linux evidence.
