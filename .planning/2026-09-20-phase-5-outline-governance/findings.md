# Findings: Make Phase 5 overview outline-only

## Maintainer correction

- `phase-5.md` is a concise outline, not a working ledger.
- Detailed implementation chronology and verification belong in planning files.
- Completed planning may be periodically deleted by the maintainer.
- Before deletion, the maintainer decides whether any material deserves a curated `phase-5.x` history record and maintains that history.
- Agents may preserve evidence and recommend promotion, but must not infer authorization to create history or delete planning.

## Intended authority split

| Content | Authority / owner |
|---|---|
| Phase 5 purpose, scope, stable boundaries, milestone outline | `docs/product-phases/phase-5.md` |
| Detailed task chronology, errors, tests, Next Step | active/completed `.planning/<scope>/` |
| Curated durable process history | maintainer-approved `docs/history/phase-5.x-*.md` |
| Current train and programme state | `ROADMAP.md` |

## Affected current surfaces

- The superseded model appears in `ROADMAP.md`, `CHANGELOG.md`, the Product Phase index/template, `docs/history/README.md`, the repository-governance guide, `phase-5.md`, and two governance test modules.
- The completed `.planning/2026-09-20-phase-5-document-governance/` scope also records the earlier interpretation. It should remain unchanged as detailed chronological evidence; this new scope records the maintainer's correction and supersedes it for current governance.
- Existing generic ROADMAP/acceptance rules already say planning deletion requires an explicit maintainer decision. The correction should connect history review to that decision rather than inventing automatic promotion.
- `phase-5.md` can retain a short activation/milestone outline covering candidate initialization, README/Wiki split, implementation reconciliation, strict LF, and Phase activation. It should remove the working-ledger table and step-by-step distillation procedure.
- No history file should be created. Agents can flag candidate material, but the maintainer owns both the promotion decision and the resulting `phase-5.x` record.

## Implemented correction

- `phase-5.md` now contains a compact milestone outline and an explicit planning/history lifecycle; the former working-ledger and automatic-distillation model is gone.
- ROADMAP, the Product Phase index/template, history index, repository-governance guide, and changelog now share the same ownership boundary.
- The focused current-authority search finds the superseded ledger terms only in negative test assertions.
- One focused test initially remained red because it coupled the autonomous LF contract to an exact prose phrase. The assertion should test the semantic sequence (`nonce/attestation`, `exact`, single `LF`) while allowing explanatory wording.
