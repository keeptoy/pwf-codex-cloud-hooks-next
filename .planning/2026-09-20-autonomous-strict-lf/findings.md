# Findings: Enforce autonomous LF state

## Inherited evidence

- README has required nonce and attestation to end in LF since the initial F2B implementation.
- Historical local fixtures, public F3B3 validation refs, and real Cloud acceptance all used LF-terminated state.
- The existing `_normalize_exact_line` alone admits an unterminated value; mode and activation are already byte-exact LF tokens.
- Both admitted forms currently normalize into the same LF-terminated private snapshot, but the unterminated form has no positive regression or Cloud acceptance evidence.

## Intended contract

- Accept exactly `16 lowercase hex + LF` for nonce.
- Accept exactly `64 lowercase hex + LF` for attestation.
- Reject missing LF, CRLF, multiple LF, embedded newline, trailing whitespace, wrong length, and uppercase/non-hex values.
- Preserve existing state advisory (`state_unsafe`) and all other runtime behavior.

## Integrity propagation

- Editing `runtime/owned-plan.py` rotates its SHA in `contracts/runtime-bundle-v2.json`.
- Editing the runtime bundle rotates its raw SHA in `upstream-manifest.json`.
- No ABI schema, runtime inventory, Release allowlist, or bootstrap content should change.

## Implementation seam

- `_normalize_exact_line` is shared only by autonomous nonce and attestation admission; requiring `text.endswith("\n")` there is the minimal production change.
- Removing exactly one final LF before the existing embedded-newline and regex checks naturally rejects CRLF, multiple LF, trailing whitespace, uppercase, wrong length, and non-hex input.
- `tests/owned-plan-runtime.test.js` already imports the runtime directly for cross-platform normalizer tests, so the strict-byte contract can be frozen on Windows without relying on Linux-only filesystem integration cases.
- Before this change, `runtime/owned-plan.py` is `9ed4396845b3d2fdac284ab4f7d7933d8df968260cb63e47963e53f802c0b135`, and the raw runtime bundle is `53ea08cecbc11d57197ea355210547f69c3716f902ec4a66e4a717c8c38583c8`.
- After the fix, `runtime/owned-plan.py` is `3b15fc29e9af599678061b123ecf72b1a3f8002d54a5c4d089711113408b21fc`, and the updated raw runtime bundle is `787256000a4c61e9fae93d8a34976ed334524f561337763a81e0949b170df290`.
- `CHANGELOG.md` is the authority for the new development delta but is intentionally excluded from the Release ZIP allowlist; it should receive a concise v0.5.0-dev entry without changing package inventory.

## Authority review

- README already specifies exactly one LF for nonce and attestation, so no stable behavior-document edit is required.
- ARCHITECTURE confirms `owned-plan.py` is the sole state-admission/snapshot boundary and the runtime bundle is the unique source/install inventory; the fix must remain inside that boundary and rotate its integrity chain.
- DESIGN routes plan opt-in/state changes to `owned-plan.py` plus `tests/owned-plan-runtime.test.js`; because managed runtime bytes and package inputs change, contract/integrity, installer, Release, and full-suite checks are also required even though the ABI shape is unchanged.
- ROADMAP permits an already-decided local bug fix without a new Discovery round, but runtime/bundle/manifest/ZIP inputs must close atomically and cannot reuse any prior Cloud or Release evidence. This task remains a new `v0.5.0-dev` source change, not a release action.
- Wiki confirms the required local baseline: importer check, complete suite, Python/Node syntax, bootstrap syntax, deterministic candidate ZIP build/check, mode/LF checks, and `git diff --check`; Windows POSIX skips remain honest and do not become Cloud evidence.
