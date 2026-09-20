# Task Plan: Reduce ROADMAP current train to a pointer

## Goal

Make ROADMAP section 4 a compact current-development-train pointer: retain its general role statement, exact candidate/branch, current authorization, accepted/fallback roles, and authority links while removing completed work summaries and one-time planning-retirement history already owned elsewhere.

## Authorization

- The maintainer approved the proposed section-4 reduction.
- Update ROADMAP, directly affected governance tests, changelog, and this planning evidence as needed.
- Keep Phase 5 purpose and outline in `docs/product-phases/phase-5.md`; do not duplicate or expand them.
- Do not change runtime, contracts, package identity, Release state, planning retention, or remote state.

## Next Step

None. ROADMAP section 4 is pointer-only, validation is complete, and no Product or Release state changed.

## Current Phase

Complete

## Phases

### Phase 1: Audit section-4 contracts

- [x] Identify tests and links coupled to removable section-4 prose.
- [x] Separate current dynamic facts from completed/historical detail.
- **Status:** complete

### Phase 2: Implement pointer-only section

- [x] Reduce ROADMAP section 4 without changing current identities or authorization.
- [x] Update only directly affected tests and version delta documentation.
- **Status:** complete

### Phase 3: Validate and commit

- [x] Run focused and complete regression checks.
- [x] Run syntax, link, LF, diff, and worktree checks.
- [x] Record evidence and create one scoped local commit.
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| Keep the first two paragraphs | They define section 4's durable role and prevent it from becoming another Product summary. |
| ROADMAP retains dynamic roles | Candidate/branch, authorization, and accepted/fallback are programme state and cannot be delegated to Phase 5. |
| Remove completed task narrative | README/Wiki migration, code audit, exact LF work, and planning retirement are already represented by Phase 5/CHANGELOG/history authorities. |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Combined section display and zero-match `rg` returned exit 1 after successfully printing the target section | 1 | Treated zero matches as the expected result; future absence checks should avoid combining display success with `rg` exit semantics. |
| First focused run passed 26/27; the current-authorization assertion expected the canonical `Product实现、Cloud或Release` phrase while the compact prose used a line-broken `Cloud与Release` form | 1 | Kept the authorization assertion and normalized the ROADMAP sentence to the existing canonical phrase. |

## Stop Conditions

- Stop before moving current train or accepted/fallback authority into `phase-5.md`.
- Stop before changing any actual version/Release/Product authorization state.
