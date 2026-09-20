# Findings: Rename Product Phase overview files

## Initial naming decision

- Target names: `docs/product-phases/phase-4-overview.md` and `docs/product-phases/phase-5-overview.md`.
- Keep anchors `product-phase-4-overview` and `product-phase-5-overview` unchanged.
- `docs/product-phase-overview-template.md` remains correctly named; only its instance-path guidance changes from `phase-N.md` to `phase-N-overview.md`.
- Git/tag history preserves old paths; no current-tree redirect files are needed.

## Inventory

- Current non-planning references occur in ROADMAP, CHANGELOG, Product Phase/history templates and indexes, six Phase 4 history-link locations, the Phase 5 cross-link/self-description, and two governance test modules.
- Generic naming rules currently use `docs/product-phases/phase-N.md`; all must move to `phase-N-overview.md` so future instances follow the explicit convention.
- The two source files declare the stable anchors at line 1; those anchors will remain byte-for-byte unchanged.
- Completed planning scopes contain plain-text references to the filenames as they existed during those tasks. They are historical task evidence, not live links or current path authorities, and should remain unchanged; the new active scope records the rename.
- ROADMAP's pre-1.0 compatibility policy explicitly permits retiring old aliases after inventory and reverse scan, while immutable commits/tags preserve the old paths.

## Migration scope

- Rename both tracked source files atomically.
- Update all current links and naming rules using `phase-4.md`, `phase-5.md`, or generic `phase-N.md`.
- Treat edits in `docs/history/*` as link-target maintenance only; do not alter historical prose or conclusions.
- Preserve the v0.4.3 CHANGELOG sentence that truthfully records the path introduced by that historical version; it is non-link historical prose, not current naming guidance.
- Require a post-migration scan with no old live links/naming rules, only classified historical prose in CHANGELOG/completed planning, and zero legacy files in `docs/product-phases/`.
