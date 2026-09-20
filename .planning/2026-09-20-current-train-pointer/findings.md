# Findings: Reduce ROADMAP current train to a pointer

## Initial authority split

- ROADMAP section 4 owns current candidate, branch, authorization boundary, accepted/fallback roles, and pointers.
- `docs/product-phases/phase-5.md` already owns Phase 5 purpose, stable boundaries, and the milestone outline.
- CHANGELOG owns the completed `0.5.0-dev` deltas.
- The paragraph about seven retired planning scopes is a one-time historical fact, not current train state.

## Direct consumers

- `tests/repository-boundary.test.js` currently freezes the seven-scope retirement twice and the old candidate-initialization pointer once. Those temporal assertions should be removed; the real planning lifecycle remains covered by fixture admission plus the repository-governance rules.
- `tests/architecture-contracts.test.js` freezes both the completed README/Wiki work narrative and the seven-scope retirement narrative. Remove those two assertions without replacing them with new prose regexes.
- Retain tests for exact candidate/branch, Phase 4/5 links, provenance/acceptance links, section-role language, and current Product/Cloud/Release authorization.
- `CHANGELOG.md` already owns every completed item being removed, including the seven-scope retirement. No material needs to be moved into `phase-5.md`; its outline already contains the durable Phase 5 summary.

## Target section shape

1. Keep the two existing general paragraphs defining lifecycle and pointer responsibilities.
2. One current-candidate paragraph: exact candidate/branch, activated Phase 5 link, documentation-governance-only authorization, no Product/Cloud/Release authorization, not C0/tag/Release, and CHANGELOG pointer.
3. One role/evidence paragraph: accepted/fallback values plus Phase 4 baseline, provenance, and v0.4.4 acceptance links.
