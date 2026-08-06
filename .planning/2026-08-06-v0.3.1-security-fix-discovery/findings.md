# Findings: v0.3.1 Security-Fix Discovery

## Scope and interpretation

This file persists the 2026-08-06 audit of the stable successor repository. Severity is
a remediation priority based on trust-boundary impact, reproducibility and plausible
preconditions. It does not assert exploitation or a production incident.

The audit is anchored at `main@bef919475b6ebc3d74c09f9664749664cf950537` with a clean
worktree before D0. Published `v0.3.0` remains exact source
`1454c9224c83d11c073b05baf6e536a11c3bb0e5`; its ZIP and bootstrap are immutable and
outside the modification scope of this Discovery.

## High-risk findings

### H1 — Managed TOML block removal can delete third-party admin state

Affected code:

- `install.js:160-173` — `removeOwnedRequirements()` ends an owned Hook block at another
  single-bracket table or a same-family `[[hooks.*]]` entry, but not at an arbitrary TOML
  array-of-tables header.
- `install.js:329-331` — doctor classification uses that removal result.
- `install.js:455-464` — repair reconstructs shared requirements from the classified text.
- `install.js:478` — uninstall uses the same removal path.
- `install.js:251+` — `stripTrustToml()` has the same structural boundary weakness during
  old v0.1 trust migration.

Deterministic probe: place this administrator-owned block immediately after the owned
`UserPromptSubmit` Hook block:

```toml
[[permissions.audit]]
name = "administrator-owned-rule"
network = "deny"
```

Observed classification and reconstruction:

```text
classified_unowned_drift=false
classified_owned_drift=true
doctor_would_mark_repairable=true
reconstruction_matches_manifest=true
admin_rule_survives_repair=false
```

A separate legacy-trust probe showed a following `[[mcp_servers.audit.headers]]` block is
also consumed by `stripTrustToml()`.

Impact: an administrator-authored array-of-tables block can be misclassified as owned
drift, then removed by a nominally bounded repair/uninstall/migration. This directly
conflicts with the architecture rule that Managed requirements are shared admin state,
must be merge-preserving and must fail closed on unknown drift.

Required D1 outcome:

- define TOML-aware ownership boundaries rather than line-pattern ownership expansion;
- preserve byte-for-byte unrelated tables, arrays-of-tables, comments and ordering where
  the existing contract requires it;
- make ambiguous/invalid shared state a blocker instead of repairable owned drift;
- cover third-party array tables before, between and after owned blocks, quoted/dotted
  keys, comments, CRLF/LF and malformed input;
- apply one consistent boundary model to install, doctor, repair, uninstall and legacy
  trust cleanup.

### H2 — Transcript identity validation and parsing are separated by a reopen race

Affected code:

- `runtime/owned-catchup.py:247-262` — `_contained_regular_file()` validates path/file
  properties.
- `runtime/owned-catchup.py:349-393` — `select_transcript()` validates containment,
  session identity and project identity, then returns a `Path`.
- `runtime/owned-catchup.py:565-569` — `execute()` later reopens that path through
  `_parse_transcript()`.

A deterministic boundary probe replaced the verified regular file after selection with
a transcript for a different session/project before parsing. Observed result:

```json
{"contains_replacement": true, "inject": true, "outcome": "report_emitted", "warnings": []}
```

Impact: containment and identity validation can describe one file while the report is
generated from another. The prerequisite is a concurrent writer with access to the
transcript location; the probe proves the code path, not exploitation in production.
The result violates the declared mutable-Host-data boundary and fail-closed identity
semantics.

Required D1 outcome:

- validate and parse one `O_NOFOLLOW` descriptor or one private verified snapshot;
- use `fstat` identity/size/mode checks and verify stability before and after the read;
- bind containment, session metadata, project metadata and parsed records to the same
  bytes/object;
- fail closed with no partial report on replacement, truncation, growth or identity drift;
- add Linux tests for regular-file replacement, symlink swap, hardlink behavior, rename,
  truncation/growth and deterministic race injection.

## Medium-risk findings

### M1 — Installer locks after reading and proposing shared state

`install.js:435-439` reads current requirements and builds the proposed contents before
acquiring the installer lock. `repair()` similarly inspects/reconstructs at
`install.js:455-461` before locking. A concurrent administrator update can therefore be
included in the backup but overwritten by a stale proposal derived from older bytes.

D1 must define the lock as a complete read/classify/propose/backup/write transaction,
revalidate file identity and content immediately before atomic replacement, and add
deterministic concurrent-writer tests for install and repair. This is medium rather than
high because exploitation requires a narrow concurrent write window, but the affected
state is the same shared administrator policy boundary as H1.

### M2 — Bootstrap has an unpinned executable dependency path

`init-cloud-sandbox-v0.3.0.bash:219-242` executes an unverified remote NVM installer via
`curl ... | bash` as root and installs floating Node major `24`. The project ZIP and
PowerShell inputs are SHA-pinned, but NVM installer bytes and the selected Node patch
version do not have equivalent reproducibility/integrity controls.

A future bootstrap should download to a temporary regular file, verify a frozen digest,
avoid pipe-to-shell and select an exact Node patch/artifact identity. D1 must first decide
whether this belongs in the same security patch. The published v0.3.0 bootstrap must not
be edited or replaced; any correction requires a new identity, hash and acceptance cycle.

### M3 — Unbounded Host stdin read in the adapter

`hooks/hook_adapter.py:77-80` calls `sys.stdin.read()` without a byte ceiling even though
Hook stdin is untrusted Host data. Child timeouts and bounded child stdout do not bound
adapter memory consumption before JSON parsing.

D1 should freeze a reasonable ABI-compatible Host-input budget and a deterministic
canary-only/fail-open-to-the-loop response for excess input, including exact-boundary,
multibyte UTF-8 and malformed/oversized JSON tests. The risk is medium because Host/process
control is a prerequisite and the impact is local resource exhaustion rather than trusted
content injection.

## Low-risk findings

### L1 — Release ZIP importer is not self-contained

`contracts/release-artifact-v1.json:24` includes `tools/import_upstream_runtime.py`, while
the allowlist omits `patches/patch_planning_skill.py`, which the importer references at
`tools/import_upstream_runtime.py:27`. Building and extracting the stable ZIP and running
the importer check exits 1 because the patcher is missing.

Installed production behavior is unaffected, and the stable hard-acceptance contract only
required the builder self-check. D1 should choose one honest future contract: include the
patcher in a newly versioned ZIP, remove the importer from that artifact, or document and
test that import reconstruction is source-checkout-only.

### L2 — Stable-status documentation/comment drift

- `README.md:10` still calls beta.2 the published rollback baseline while current ROADMAP
  and architecture state that accepted stable v0.3.0 is the current rollback and beta.2
  is the previous fallback.
- `runtime/owned-plan.py:2-5` and `hooks/hook_adapter.py:203` retain inactive/pre-Phase-3
  wording although the owned plan path is active in stable behavior.
- `BASELINE_PROVENANCE.md:122` uses candidate-era wording in a historical section; any
  change should preserve its historical time context.

These are comprehension and maintenance risks, not current runtime defects. Corrections
must occur only in a future source/release identity where relevant; they must never rewrite
the published v0.3.0 asset bytes or acceptance history.

## Non-issue / bounded observation

The Markdown local-link audit found ten missing relative links, all inside the deliberately
slim upstream fixture `tests/fixtures/planning-with-files/SKILL.md` and pointing to omitted
upstream templates/docs. No product-document link defect was established; keep this as a
fixture-boundary observation unless a future contract says that fixture must be complete.

## Verified strengths and baseline evidence

- User-provided Git installation was verified: launcher
  `D:\Program Files\Git\git-bash.exe`; CLI `D:\Program Files\Git\bin\bash.exe`, GNU bash
  5.3.15.
- Bash syntax checks passed for the bootstrap and all three upstream shell runtimes.
- Git Bash black-box resolver/injector checks passed.
- Final Windows suite passed: 63 registered, 52 passed, 0 failed and 11 honest
  POSIX/Linux-only skips.
- `python tools/import_upstream_runtime.py check` passed for the exact four managed
  upstream hashes.
- JSON parse checks passed for 12 files; Python compile checks for 8 files; Node syntax
  checks for 15 files.
- Deterministic double ZIP build passed: 22 entries, 75,386 bytes, SHA-256
  `f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af`, matching the
  published stable asset. Bootstrap SHA-256 also matched
  `ab334f0367d948fa29a2bdd37bff0c220929aeb320fdf59dbacbd5a4021b39c0`.
- Full `git fsck` was clean; `v0.3.0` resolves to exact source `1454c922...`; current HEAD
  has zero release-input drift relative to the tag.
- Audit-created Python cache residue was removed after exact inspection; the final tree had
  zero `__pycache__` directories and zero `.pyc` files before D0 planning edits.

These strengths constrain the repair: the repository has a healthy stable baseline, so
security work should be narrow and evidence-driven rather than a redesign.

## Proposed verification matrix for D1

| Boundary | Required proof before implementation approval |
|---|---|
| TOML ownership | hostile arrays-of-tables, quoted/dotted keys, comments, malformed input, install/doctor/repair/uninstall/legacy migration symmetry |
| Transcript identity | same-object descriptor/snapshot, replacement, symlink, hardlink, rename, truncate/grow, session/project mismatch, no partial report |
| Installer locking | deterministic concurrent administrator writer before/during lock, backup fidelity, stale-proposal rejection |
| Host stdin | exact budget edges, UTF-8 byte/character distinction, malformed oversized input, loop remains available |
| Bootstrap | digest-pinned NVM/Node inputs, no pipe-to-shell, deterministic fresh Linux/Cloud setup, new-identity enforcement |
| Release boundary | importer contract decision, exact allowlist, reproducible ZIP, bootstrap outside ZIP, immutable prior assets |
| Full regression | importer/static/full Windows, all Linux-only cases, disposable no-live Cloud Fresh/UserPrompt/Resume/doctor/inventory |

## Discovery decisions still open

1. Whether H1, H2 and M1 form the minimum `0.3.1` security patch, or whether M2/M3 must
   ship in the same train.
2. Whether adding a structure-aware TOML dependency changes the release/trust inventory
   enough to make a patch identity inappropriate.
3. Whether transcript safety uses a held descriptor or a private snapshot, and how that
   choice behaves across supported Linux/Cloud filesystems.
4. Whether the importer is a source-only maintenance tool or a promised Release-ZIP tool.
5. The exact D1 verdict: GO, CONDITIONAL_GO or NO_GO.
