# Findings: R13 planning deletion consent

## Baseline

- Clean branch `0.5.0-dev` after A07 local commit `ae13703`.
- Inventory labels R13 `REPLACE`: Guide/ROADMAP deletion consent is currently tied to exact sentences; substitute owner links and a testable no-auto-delete relation. R12's active-scope validation and retained completed-scope fixture remain `KEEP`.
- Guide `#planning-lifecycle` owns generic planning scope retention/removal. Its closeout rule says switching `.active_plan` does not imply deletion and maintainer decides completed-scope removal separately.
- ROADMAP `#version-train-two-retirement-reviews` owns Release checkpoint timing, links to Guide `#planning-lifecycle`, and explicitly denies deletion permission from C0/C2, pointer switching, retirement DoD or Git recovery alone. The `#product-phase-overview-rotation` section separately describes history admission; it is not the deletion authority.
- Current R13 test asserts one exact Guide opening, one exact Guide closeout sentence and one ROADMAP phrase. It already has a structural validator proving a retained completed scope does not invalidate active scope selection.

## Decision and residual

- Replace only those three wording assertions. The Guide's anchored planning section must keep the active pointer as a selector, a completed-scope closeout item requiring maintainer review, and a denial that pointer movement grants deletion permission. The numbered item is found by role rather than fixed ordinal.
- ROADMAP's anchored two-retirement-review section must link to Guide `#planning-lifecycle`, ask for the maintainer's deletion decision and deny automatic planning removal from C0/C2 or pointer changes. The checked relationship stays within Release timing rather than making ROADMAP a second generic planning authority.
- The existing active-scope validator and retained completed-scope fixture remain unchanged. Negative probes cover misrouting to history, pointer-based auto-delete, missing maintainer consent and ROADMAP auto-delete; a Guide/ROADMAP equivalent rewording passes the scoped helper.
- This is a static governance test, not semantic understanding of arbitrary natural language. Human review remains necessary for new phrasing and for actual removal decisions. No planning deletion occurred, and R17's adjacent Cloud/Operator Guide template wording remains unchanged.
