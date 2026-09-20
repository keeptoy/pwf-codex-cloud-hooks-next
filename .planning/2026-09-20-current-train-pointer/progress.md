# Progress Log: Reduce ROADMAP current train to a pointer

## Session: 2026-09-20

### Phase 1: Audit section-4 contracts

- **Status:** in_progress
- Started from clean branch `0.5.0-dev` at local commit `2ed5840`.
- Read the `planning-with-files` skill and ran session catch-up; no recovery output was reported.
- Reviewed the completed prior scope and created this dedicated active scope without modifying or deleting older planning directories.
- Located all direct consumers of section-4 completed-work and planning-retirement prose.
- Confirmed the removable facts already live in CHANGELOG and Phase 5's durable outline; no Phase 5 content change is needed.

### Phase 1: Audit section-4 contracts

- **Status:** complete
- Froze the target as two general paragraphs plus two compact current-state paragraphs.

### Phase 2: Implement pointer-only section

- **Status:** complete
- Removed completed README/Wiki, implementation-audit, exact-LF, and planning-retirement narrative from ROADMAP section 4.
- Kept exact candidate/branch, Phase 5 activation and authorization, non-C0 status, accepted/fallback roles, and Phase 4/provenance/acceptance pointers.
- Removed only tests that froze the deleted completed-work and one-time planning-retirement prose; retained current identity, authorization, link, and generic planning-lifecycle checks.
- Added an Unreleased changelog entry for the authority reduction; `phase-5.md` required no change.
- Re-read the resulting section: it now contains exactly the two durable role paragraphs and two current-state paragraphs. A combined absence search returned exit 1 because all retired phrases were absent, which is the intended content result.

### Phase 3: Validate and commit

- **Status:** in_progress
- First focused run passed 26/27. The sole failure was the retained current-authorization boundary using a different conjunction/line wrap; normalized ROADMAP to the established `Product实现、Cloud或Release` phrase without changing meaning.
- Second focused run passed 27/27 with no skips.
- Full regression passed: 190 tests, 164 pass, 0 fail, 26 honest Windows/POSIX skips.
- Both changed JavaScript modules passed `node --check`; link/anchor checks passed inside the focused and full suites.
- `git diff --check` passed and all eight changed/new files are LF-only.
- Removed the exact regenerable `tools/__pycache__` directory created by the full suite after verifying it resolved under the repository.
- Final diff review confirms `phase-5.md`, runtime, contracts, package/Release identities, and previous planning scopes are unchanged.
- Ready for one scoped local commit; no remote action is authorized.
