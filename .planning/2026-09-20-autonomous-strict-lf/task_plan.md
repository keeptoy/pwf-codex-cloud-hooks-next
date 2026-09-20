# Task Plan: Enforce autonomous LF state

## Goal

Require autonomous nonce and attestation state files to end in exactly one LF, add regression coverage for unterminated rejection, refresh managed-runtime integrity hashes, and validate the complete repository baseline.

## Authorization

- The maintainer explicitly chose strict LF semantics after reviewing the historical audit.
- Runtime, nearest tests, required integrity references, and planning evidence are writable.
- Existing README exact-state wording is already authoritative and should remain unchanged unless implementation reveals a contradiction.
- Do not alter mode/activation grammar, Host ABI, trusted graph, ledger semantics, Release identity, or published assets.
- No remote writes, push, tags, PRs, Releases, deployment, or publication.

## Next Step

No further local implementation action. The completed scoped commit is ready for maintainer review and any later remote push.

## Current Phase

Complete

## Phases

### Phase 1: Recover boundary and design the regression

- [x] Read required authorities and the completed newline audit.
- [x] Inspect exact normalizer consumers and nearest tests.
- [x] Freeze strict-LF positive/negative cases and hash propagation.
- **Status:** complete

### Phase 2: Implement strict LF

- [x] Add failing-first regression coverage.
- [x] Require one final LF in nonce/attestation normalization.
- [x] Refresh adapter/runtime bundle integrity references as required.
- **Status:** complete

### Phase 3: Validate and commit

- [x] Run focused runtime/contract/installer/Release checks.
- [x] Run complete regression and static integrity baseline.
- [x] Record evidence and create one scoped local commit.
- **Status:** complete

## Decisions Made

| Decision | Rationale |
|---|---|
| Reject unterminated nonce and attestation | Maintainer selected the documented and historically accepted exact-state contract. |
| Keep mode and activation behavior unchanged | They already require exact LF and are outside the discovered mismatch. |
| Treat runtime byte changes as integrity changes | `owned-plan.py` is a bundle-managed runtime source. |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Combined `rg` inspection returned exit 1 after useful matches because `CHANGELOG.md` is not in the Release allowlist | 1 | Re-ran bounded reads separately; confirmed this is an expected no-match, not a repository failure. |
| New strict-LF regression failed because unterminated nonce and attestation were returned as valid values | 1 | This was the required failing-first evidence; applied the minimal final-LF admission check. |
| First integrity assertion addressed a nonexistent `local_runtime` property | 1 | Read the bundle structure, corrected the assertion to the authoritative `local_files` array, and reran it successfully. |
| A follow-up `rg` key probe returned exit 1 because the PowerShell quoting pattern did not match | 1 | Used a bounded `Select-String` structure read; no repository data was changed. |
| Git Bash could not create its signal pipe inside the Windows sandbox (`Win32 error 5`) | 1 | Re-ran the syntax-only bootstrap check outside the sandbox; all tracked bootstraps passed. |
| First full `npm test` run found `runtime/__pycache__` in the global cleanliness hook | 1 | Classified as generated local bytecode residue rather than a product assertion failure; verified exact cache paths, removed only regenerable `runtime/__pycache__` and stale `tools/__pycache__`, then scheduled a clean rerun. |
| Final cleanliness review found `tools/__pycache__` recreated by the passing full suite | 1 | Confirmed runtime cache remained absent; removed only the regenerable tools cache after all Python-based validation completed. |

## Stop Conditions

- Stop before changing any autonomous behavior beyond nonce/attestation final-LF admission.
- Stop if strict LF requires a Host ABI, schema, trusted-graph, ledger, or writer change.
- Keep all published tags, assets, hashes, URLs, and acceptance immutable.
