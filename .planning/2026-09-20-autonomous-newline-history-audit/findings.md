# Findings: Autonomous newline history audit

## Initial facts

- Current README defines scoped autonomous state with `.nonce = 16 lowercase hex + \n`, `.attestation = lowercase SHA-256 + \n`, and activation `codex-managed-v1 autonomous\n`.
- That current prose does not by itself prove which exact bytes historical local or Cloud acceptance created.
- The audit must inspect commands, fixture writers, raw evidence, and the parser version present at each relevant commit/tag.
- ARCHITECTURE identifies F3B3 as the live autonomous proof covering zero-ledger, tamper refusal, disarm, re-attest/re-arm, and two mandatory Resume runs; this names the primary historical evidence set to recover.
- The architecture says production captures an exact nonce/attestation, revalidates bytes after rendering, and writes a root-shaped `.plan-attestation` into a private snapshot, but it does not state whether historical Cloud setup commands generated terminated or unterminated workspace files.
- DESIGN routes the relevant repository-only protocol evidence to `tests/f3b-protocol.test.js`, runtime byte/admission evidence to `tests/owned-plan-runtime.test.js`, and live conclusions to the version-specific acceptance rather than static tests.
- ROADMAP identifies autonomous as Phase 4 work, now inherited by accepted v0.4.4, and states that exact plan-local activation, tamper refusal, disarm/re-arm, and real Cloud lifecycle were completed. It does not freeze the historical file-construction bytes.
- ROADMAP names `docs/history/phase-4.8-f3b3-autonomous-live-discovery.md` as the historical implementation-to-live drift record and provides stable post-implementation/post-live anchors; this is the first exact Phase document to inspect.
- Wiki contains generic development/Release maintenance only; it does not establish the F3B3 autonomous test bytes.

## Evidence hierarchy

1. Preserved raw acceptance commands/output and immutable published source.
2. Historical test fixture construction and assertions at the exact commit.
3. Phase/runbook/acceptance prose.
4. Current summaries and recollection.

## Open questions

- Which Product Phase and version first introduced autonomous?
- Did every acceptance path use `printf ...\n`, `writeFile(... + "\n")`, or another newline-producing writer?
- Was an unterminated value ever explicitly tested or used in Cloud acceptance?
- Did the parser normalize both byte forms before comparing, and did every later validation step converge to the same snapshot bytes/outcome?

## Located evidence

- Current runtime tests construct every positive autonomous nonce/attestation/activation fixture with a trailing newline. The helper writes `.mode = "autonomous\n"`, `.nonce = "0123456789abcdef\n"`, digest plus `"\n"`, and activation `"codex-managed-v1 autonomous\n"`.
- Current F3B protocol tests also prepare nonce and attestation with `\n` and arm with a newline-terminated activation token. This proves the repository-only lifecycle simulation used terminated bytes.
- The current tree retains Phase 4.8/4.9 history but has retired the versioned F3B3 operator guide and older acceptance from the working tree; Git history is therefore required to recover their exact commands and records.
- Phase 4.8 explicitly records that the bounded materializer wrote mode/nonce/attestation before a separate activation commit, and that the live sequence passed as prepared legacy → armed autonomous → tampered refusal → disarmed legacy → reprepared legacy → rearmed autonomous.
- Local Git preserves the exact autonomous validation DAG: `d107c1c` prepared, `f43a744` armed, `98b6f13` disarmed, `5b20eb7` reprepared, and `32b13b0` rearmed. The operator guide was added at `8e05a01`, closed with live evidence at `f22eeec`, and retired from the current tree at `39f6616`.
- Exact Git blob inspection proves both accepted autonomous identities were newline-terminated: initial nonce is 17 bytes ending `0A`, initial attestation is 65 bytes ending `0A`; reprepared nonce/attestation have the same 17/65-byte shapes. Both arm/rearm activation blobs are 28 bytes ending `0A`; mode is 11 bytes ending `0A`.
- The closed operator guide binds all six Cloud stages to those exact workspace commits and records armed/rearmed PASS. Its shell preflight uses `tr -d '\r\n'` for comparisons, so the preflight assertion alone is newline-insensitive; however the exact checked-out Git blobs prove what bytes the live tasks actually consumed.
- `_normalize_exact_line` was introduced in `aeffc4d` with the current behavior: remove one final LF if present, otherwise keep the text, reject any remaining LF, then regex-match. Git shows no change to this function between the introducing commit and current HEAD.
- The introducing tests and current tests use newline-terminated positive nonce/attestation fixtures. No explicit test name or fixture freezes successful unterminated nonce/attestation admission.
- After admission, both byte forms produce the same normalized `nonce_value`/`attestation_value`, and the private snapshot always writes canonical LF-terminated `.nonce` and `.plan-attestation`. The only retained distinction is the captured raw workspace bytes used for same-run race revalidation; if the file stays unchanged, either form follows the same rendering path and output.
- Phase 4.5 confirms F2B's first Source/Candidate/no-live Cloud gate deliberately created no token, nonce, attestation, or ledger. Therefore it cannot answer the byte-shape question; the first decisive live evidence is F3B3.
- The stable Phase 4 overview and v0.4.0 changelog preserve newline-terminated activation/mode tokens and summarize autonomous lifecycle acceptance, but they do not explicitly specify nonce/attestation EOL bytes. Exact F3B3 Git blobs supply that missing byte-level proof.
- Immutable v0.4.0 acceptance at commit `6b38851` records all six F3B3 stages and exact workspace HEADs, including armed/rearmed autonomous PASS with the two known nonce/task identities. The released `v0.4.0` tag peels to `fe8cd7f`; it contains both the implementation and F3B3 live closeout history.
- Read-only `git ls-remote` against `git@github.com:keeptoy/pwf-codex-cloud-hooks-next.git` confirms the public validation refs still point to the exact local byte-proven commits: prep `d107c1c`, arm `f43a744`, reprep `5b20eb7`, rearm `32b13b0`. Public `v0.4.0` points to `fe8cd7f`.
- GitHub Release `v0.4.0` is public, non-draft, non-prerelease, published 2026-08-22, with immutable ZIP/bootstrap assets and SHA-256 digests. Its short body points to the full `v0.3.5...v0.4.0` changelog; the repository changelog is therefore the public version-level autonomous summary, while the acceptance/validation refs retain exact proof.
- GitHub's public `v0.3.5...v0.4.0` compare includes the same local history: F2B discovery/implementation (`ed7c86b`, `aeffc4d`), F3B3 discovery/materialization/Cloud closeout (`3c7aaef`, `a6fa031`, `8e05a01`, `f22eeec`), and later autonomous rollback evidence. This confirms the autonomous development/acceptance chain is part of the public v0.4.0 version record.
- GitHub Contents API independently returns the public prep/reprep nonce blobs as 17 bytes and both attestation blobs as 65 bytes, each ending hex `0A`; this matches local object inspection exactly.
- A bounded current-code probe returns identical normalized values for 16/64-character inputs with and without one final LF. The v0.4.0 tag contains the same normalizer and only LF-terminated positive fixtures.
- The documentation/implementation mismatch dates to the single introducing commit `aeffc4d`: that commit simultaneously added README's mandatory `+ \n` wording and a parser that accepts LF or no LF. It is not a later accidental relaxation.

## Conclusion

- Historical implementation fixtures and the actual F3B3 Cloud acceptance both used trailing LF. This is proven by exact public validation-ref blobs, not inferred from trimmed verifier output.
- An unterminated nonce or attestation was never the accepted Cloud test input and is not explicitly protected by a positive regression test.
- Nevertheless, from F2B introduction through v0.4.0 and current HEAD, a stable unterminated value is admitted exactly like the same LF-terminated value: both normalize to the same string and produce the same canonical LF-terminated private snapshot/context.
- The equivalence is narrowly limited to no terminator versus one final LF. CRLF, two LFs, trailing spaces, embedded newlines, invalid length/case, or any mid-run byte change are rejected.
- Therefore the historical result is: “acceptance used LF; implementation also accepts no LF; expected successful output is the same for stable valid input, but no-LF lacks historical Cloud acceptance and explicit regression coverage.”
