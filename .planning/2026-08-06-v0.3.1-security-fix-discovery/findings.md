# Findings: v0.3.1 Security-Fix Discovery

## Scope and interpretation

This file persists the 2026-08-06 audit of the stable successor repository. Severity is
a remediation priority based on trust-boundary impact, reproducibility and plausible
preconditions. It does not assert exploitation or a production incident.

The audit is anchored at `main@bef919475b6ebc3d74c09f9664749664cf950537` with a clean
worktree before D0. Published `v0.3.0` remains exact source
`1454c9224c83d11c073b05baf6e536a11c3bb0e5`; its ZIP and bootstrap are immutable and
outside the modification scope of this Discovery.

## D1 source reconfirmation

D1 is being frozen against clean source
`dac1b5ebdf6d09a299d3eb002c182d0d7ac2caf0`. The two commits after the original audit
anchor are local documentation/governance checkpoints; the affected production paths are
unchanged.

The H1 probe was rerun at this exact source with a third-party
`[[permissions.audit]]` block immediately following the owned Hook definitions. It again
reported:

```json
{
  "classified_unowned_drift": false,
  "classified_owned_drift": true,
  "doctor_would_mark_repairable": true,
  "reconstruction_matches_manifest": true,
  "admin_rule_survives_repair": false,
  "legacy_admin_array_survives_strip": false
}
```

The H2 replacement probe was also rerun at the exact D1 source. A test seam replaced the
accepted host transcript after `select_transcript()` returned and before
`_parse_transcript()` reopened the path. The replacement carried a different session id,
different project root and unique sentinel; the result was:

```json
{"outcome":"report_emitted","inject":true,"contains_replacement":true,"warnings":["duplicate_record_suppressed","unknown_transcript_record"]}
```

The warnings arise from the existing Cloud wrapper fixture and do not reject the
replacement. The decisive facts are that injection remained enabled and the unique
replacement sentinel reached the report. The prerequisite remains a writer able to
replace a file inside the session store between selection and parsing.

Source inspection also reconfirmed the related transaction and input facts: real
`install()` computes `currentRequirements` and `proposedRequirements` before `acquire()`;
real `repair()` inspects and reconstructs before `acquire()`; `uninstall()` already locks
before reading but lacks a non-cooperating-writer revalidation; and adapter `main()` turns
an empty/invalid payload into canary-only output, so a bounded-input rejection can remain
Host-ABI compatible without suppressing the canary or failing the Codex loop.

## Cloud lifecycle clarification

OpenAI's current public Cloud-environment documentation confirms this lifecycle order:
container creation and repository checkout, setup script, then agent phase. It also says
that setup runs in a separate Bash session, so a setup-only `export` does not persist by
shell inheritance. Environment variables configured in environment settings are available
for the full chat, while secrets are removed before the agent phase.

The maintainer-provided 2026-08 Codex Cloud environment screenshot visually confirms
separate UI controls for environment variables, secrets, container caching and the
automatic/manual setup script. This is dated UI evidence rather than a permanent Host
contract, but it removes an important terminology ambiguity:

- configured environment variables are control-plane inputs injected by the platform;
- the setup shell receives those inputs and can additionally create shell-local variables;
- setup-local exports do not become the later runtime/Hook environment by inheritance;
- the later Host may independently provide runtime values such as the observed
  `CODEX_HOME=/opt/codex`.

Consequently, “configured environment variable,” “setup-shell variable,” and
“runtime/Hook Host variable” are three provenance categories even when they share the
same variable name. Bootstrap validation must preserve that provenance distinction.

The public environment-variable reference defines `CODEX_HOME` as a configurable Codex
state root and gives the general CLI/IDE/app-server/installer default as `~/.codex`; it
does not publish `/opt/codex` as a permanent Cloud guarantee. The repository's narrower
2026-08 evidence remains authoritative for this integration:

- `tests/fixtures/cloud/hook-observations-v1.json` records no Host-provided `CODEX_HOME`
  during `sandbox_initialization`, then `/opt/codex` during `agent_after_start` and
  `managed_hook`;
- `tests/cloud-fixtures.test.js` freezes those stage-specific observations;
- `BASELINE_PROVENANCE.md` already classifies them as dated fixture/acceptance facts;
- `init-cloud-sandbox-v0.3.0.bash` therefore resolves an explicit override or the current
  `/opt/codex` default itself rather than assuming setup inherited the runtime value.

Architectural conclusion: “setup has no `CODEX_HOME`” is a stage-specific observed Host
fact, not a claim that setup has no environment variables. Setup exports do not establish
the later Hook environment; runtime/Hook discovery must continue to prefer explicit Host
input/config and verified installation-path inference. `ARCHITECTURE.md` now states this
distinction and uses “Codex runtime starts” only as a repository lifecycle label, not as
an assertion about a public internal process name.

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

A future bootstrap must eliminate pipe-to-shell and every unnecessary root-level remote
runtime installer. The published v0.3.0 bootstrap must not be edited or replaced; any
correction requires a new identity, hash and acceptance cycle.

D1 defensive supply-chain cross-check against primary sources found that the NVM v0.40.1
installer is itself tag-specific, but its default path uses Git when Git is present and
then fetches/checks out additional repository content; hashing only `install.sh` therefore
would not make the whole dependency graph byte-pinned. The official NVM release page also
shows newer signed releases, so silently following “latest NVM” would merely replace one
floating input with another. Official Node release data identifies v24 as LTS and, on the
D1 date, exposes exact v24.18.1 Linux artifacts plus signed `SHASUMS256` files. Sources:

- <https://github.com/nvm-sh/nvm/releases>
- <https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh>
- <https://nodejs.org/en/about/previous-releases>
- <https://nodejs.org/download/release/latest-v24.x/>

The initial D1 design considered replacing NVM with an exact official Node v24.18.1
artifact. That route established that a deterministic replacement was technically
possible, but the later Cloud/runtime scope review below supersedes it: this adapter does
not need to provision Node 24 at all.

#### D1 M2 amendment — frozen

The maintainer subsequently clarified that the real target is a Codex Cloud Skill adapter,
that the Cloud environment UI already offers Node 18/20/22, and that Node 24 is needed by
other repositories rather than by this adapter. Repository inspection supports that
separation:

- this package declares `node >=18`;
- Node runs `install.js`, tests and the setup-time Skills CLI only;
- the installed Hook graph is Python/POSIX and has no Node runtime dependency; and
- the current Skills CLI package also declares Node 18 or newer.

Official Codex Cloud documentation says the universal image preinstalls common runtimes and
the environment UI can pin Node.js through **Set package versions**. The linked
`openai/codex-universal` reference README lists Node 18/20/22, while its current reference
Dockerfile also verifies a Node 24 image input. The repository explicitly warns that it is
not identical to production, so the maintainer's actual Cloud UI observation remains the
narrower acceptance fact; availability of Node 24 must not be inferred from the reference
Dockerfile.

This makes “download Node v24.18.1 inside the adapter bootstrap” over-scoped. The frozen
amendment is:

1. select Cloud Node 22 through environment package settings and have the bootstrap only
   verify a usable Node major `>=18` (Cloud acceptance uses 22);
2. remove NVM and default Node installation from this adapter's bootstrap;
3. install the pristine PWF Skill from its already pinned upstream v3.8.2 archive and
   exact SHA
   `7dab03ae283da38d33b9d551c7ec621d1818b9f0f17cf9ced566d4accbfc6dd1`
   instead of executing `npx skills` as root, then let `install.js` revalidate the required
   Skill hashes;
4. keep Node 24 provisioning in each repository that actually requires Node 24, using its
   own Cloud environment/setup contract; and
5. retain M2 as a medium bootstrap supply-chain finding, but define closure as eliminating
   unnecessary remote root execution rather than introducing a new Node 24 download.

The Cloud-selected version is an environment setting, not a setup-shell export. The
bootstrap accepts later supported Node majors as long as they satisfy `>=18`; Node 22 is
the exact no-live Cloud acceptance selection for this release train, not a permanent
platform constant. `npm` and `npx` cease to be bootstrap prerequisites once the pinned
archive path replaces the Skills CLI.

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
| Bootstrap | no NVM/Node download, Cloud-selected Node 22 and `>=18` verifier, digest-pinned PWF archive, no root `npx`, deterministic fresh Linux/Cloud setup, new-identity enforcement |
| Release boundary | importer contract decision, exact allowlist, reproducible ZIP, bootstrap outside ZIP, immutable prior assets |
| Full regression | importer/static/full Windows, all Linux-only cases, disposable no-live Cloud Fresh/UserPrompt/Resume/doctor/inventory |

## D1 frozen repair design

### H1 — ownership-preserving TOML editing

The installer will not add a general TOML dependency and will not parse/re-serialize the
administrator's document. `package.json` currently has no dependencies, and ordinary TOML
serialization would unnecessarily change comments, ordering and formatting in shared
state. Instead, S1 must implement one small, conservative table-header scanner that:

1. preserves every unrelated source slice byte-for-byte, including LF/CRLF choice,
   comments, blank lines, quoted/dotted keys and ordering;
2. recognizes complete TOML table and array-table headers while respecting quoted key
   text and trailing comments;
3. treats every unrelated table or array-table header as an ownership boundary;
4. treats malformed or ambiguous header-like input in a candidate owned region as
   `BLOCKED_AMBIGUOUS_MANAGED_REQUIREMENTS`, never as repairable owned drift; and
5. is the only structural primitive used by install, doctor, repair, uninstall and legacy
   trust cleanup.

Newly generated 0.3.1 requirements must wrap the two exact managed Hook groups in stable
begin/end owner comments. A marked region is removable only if markers are unique,
properly paired and its structure contains exactly the allowlisted `SessionStart` and
`UserPromptSubmit` group/handler families. Extra handlers, unrelated headers, nested owner
markers or unknown keys inside the region are blockers. The manifest continues to hash
both the full requirements and the unowned projection.

Upgrade from unmarked v0.3.0 uses a one-way legacy recognizer: it may claim only the exact
two known event groups with one handler each and the expected absolute adapter command
family. A third-party handler sharing a group, a command collision, an unrelated header or
an incomplete group is not removed automatically. Once a valid legacy installation is
rewritten, it receives the new markers. This preserves bounded owned-drift repair without
using the broad `OWNED_SEGMENT` substring as proof of ownership.

`stripTrustToml()` remains separate in purpose but shares the scanner. It removes only an
exact known `[hooks.state."..."]` single-table section, and the very next table *or*
array-table header ends that section. It never absorbs a following administrator block.

Required failing-first fixtures cover third-party arrays before/between/after the owned
groups, a second handler in the same event group, quoted and dotted keys, comments,
duplicate/missing markers, malformed brackets/quotes, command substring collision,
LF/CRLF, legacy v0.3.0 upgrade and byte equality of every unowned slice across install,
doctor, repair, uninstall and trust cleanup.

### H2 — one verified transcript object

Selection must return a `VerifiedTranscript`-equivalent object, not a reusable `Path`.
For every Host path and scan candidate, the runtime must:

1. open the selected session-store root and each relative directory component through
   directory descriptors with `O_DIRECTORY|O_CLOEXEC|O_NOFOLLOW`;
2. open the final name once with `O_RDONLY|O_CLOEXEC|O_NOFOLLOW|O_NONBLOCK`;
3. require a regular file with `st_nlink == 1` and at most 16,000,000 bytes;
4. read at most that budget plus one byte from the held descriptor, preserving the
   existing 1,000,000-byte per-record limit;
5. compare `fstat` identity before/after the read, then reopen the same name and revalidate
   the parent chain and `(dev, ino, type, size, mtime_ns, ctime_ns, nlink)` identity; and
6. validate session/project metadata and parse records only from the resulting immutable
   byte snapshot. No later step may reopen the original Host path.

Replacement after the final path revalidation cannot change the parsed bytes; replacement,
rename, truncate, append, hardlink or parent-chain drift before that point fails closed.
The original verified path remains the diagnostic `selected_transcript_path`, but report
content and session naming derive only from the snapshot whose identity was accepted.
Invalid UTF-8, oversize input, malformed JSONL or identity drift returns an existing
non-injecting outcome with no partial records/report and no Host ABI/schema expansion.

Fallback scanning must cap examined candidate names at 256, secure-open candidates by the
same root-relative procedure and select by the verified descriptor metadata. Windows keeps
an honest POSIX skip; Linux tests inject deterministic races for final-file replacement,
symlink swap, hardlink, parent rename, truncate and append, and verify no replacement
sentinel or partial report can escape.

The 16 MB/256-candidate values are internal safety budgets, not Host ABI. If no-live Cloud
evidence shows a legitimate current transcript exceeds either value, implementation must
stop for a D1 amendment rather than silently raising or removing the bound.

### M1 — shared-state transaction boundary

For real install, repair and uninstall, `acquire()` must precede every read, classification,
proposal, backup and mutation of requirements, legacy config/hooks, installed manifest and
managed runtime. Dry-run remains an unlocked point-in-time preview; a later real invocation
must discard that preview and recompute everything after taking the lock. External doctor
uses a stable before/after read set and reports concurrent drift; the post-mutation doctor
uses an internal already-locked inspection path to avoid recursive locking.

The lock coordinates installer processes but cannot force an administrator/editor to honor
it. Therefore each shared file receives a fingerprint containing existence, regular-file
type, device/inode where available, size, timestamps and SHA-256. The backup is written from
the exact captured bytes used to derive the proposal. Immediately before each atomic rename,
the current file must match that fingerprint or the transaction aborts with a distinct
concurrent-drift blocker. Post-write bytes and hashes are then verified before success.

This removes the demonstrated stale-proposal window and narrows the remaining race to a
non-cooperating writer acting after the last compare and around atomic rename. Node's
standard library has no portable compare-and-swap rename, and an advisory OS lock would
not constrain an editor that ignores it; this residual must be documented rather than
hidden by a native dependency. Deterministic tests use an injected module-level race seam,
not a production CLI/environment trigger, and cover writes before lock, after locked read,
before rename, backup fidelity, post-write verification and two installer instances.

### M2/M3/L1/L2 inclusion decisions

| ID | 0.3.1 disposition | Frozen design |
|---|---|---|
| M2 | Include; bootstrap security/release blocker | Create a new `init-cloud-sandbox-v0.3.1.bash`; remove NVM, `NODE_VERSION=24`, default Node installation and root `npx skills`; require platform-provided Node and fail closed when its numeric major is below 18; select Node 22 in the Cloud environment for acceptance; download the exact PWF v3.8.2 archive to a private temporary file, verify the contract's full SHA-256 before extraction, install only the pristine Skill subtree, and let `install.js` verify all required Skill hashes. Other repositories own any Node 24 provisioning. |
| M3 | Include; runtime blocker | Set `MAX_HOST_INPUT_BYTES = 1_000_000`; read `sys.stdin.buffer` with limit+1; require UTF-8 JSON whose root is an object. Oversize, invalid UTF-8, malformed JSON, empty input or non-object input emits the event canary only, dispatches no child, exits 0 for a valid CLI event and does not alter schemas. Exactly 1,000,000 bytes is accepted; 1,000,001 is rejected. |
| L1 | Include; packaging correction | Add `patches/patch_planning_skill.py` to the new ZIP allowlist because the ZIP already promises the importer as a local tool. The future artifact becomes 23 entries and must prove importer `check` works from an extracted ZIP. The patcher is not installed into managed runtime and does not enter the trusted execution graph. |
| L2 | Include; non-blocking cleanup | Update current rollback wording and active-runtime comments in the 0.3.1 source identity while preserving historical provenance context. No published v0.3.0 document or asset is rewritten. |

H1, H2, M1, M2 and M3 are blockers for a security-release candidate. M2 is specifically a
new-bootstrap/release blocker rather than a managed Hook runtime dependency. L1 and L2 ship
in the same source train but cannot justify weakening or delaying a safety assertion. If
the already contracted PWF archive digest cannot be reproduced, the bootstrap/release
portion is blocked; no Node download is an allowed fallback.

## D1 version and verdict

`0.3.1` remains the correct candidate identity. The design adds no Hook event, Host field,
result schema, managed runtime component, trusted execution edge or intended planning
behavior. It restores the documented merge-preserving/fail-closed contract, bounds already
untrusted input and makes a newly identified bootstrap byte chain deterministic. The added
ZIP patcher is a non-executed maintenance input, not a runtime activation.

**D1 verdict: GO for a separately authorized S1, with no implementation authorization
implied by this verdict.** There is no unresolved trust-boundary choice. Platform Node
selection, adapter bootstrap dependencies and other repositories' Node 24 requirements
are now explicitly separated.

S1 may begin only after explicit maintainer authorization and must add nearest-boundary
failing tests before touching each production path. S2 must run the complete local/Linux
matrix plus disposable no-live Cloud Fresh/UserPrompt/real Resume/doctor/inventory and
verify the 16 MB transcript budget against observed Cloud data. S3 requires separate
version/seal/publication authorization, a new 0.3.1 ZIP/bootstrap identity and exact hashes.

Rollback remains published/accepted v0.3.0 throughout S1/S2 and until a separately
published 0.3.1 passes downloaded-asset and Cloud acceptance. Any regression, unknown
administrator-state classification, transcript identity ambiguity, ABI/trusted-graph
expansion, platform Node/PWF archive precondition conflict or inability to reproduce exact
assets is a stop-and-rollback condition; no existing v0.3.0 tag, URL, asset, checksum or
acceptance record may move.

## S1-A implementation result

S1-A closed the four authorized code boundaries without changing Hook events, Host fields,
result schemas, canary composition or the trusted runtime graph:

- **H1:** new requirements use unique begin/end ownership markers. A conservative header
  scanner recognizes both table forms while respecting quoted keys and comments. Marked
  regions accept only the four expected Hook sections and key sets; malformed, duplicate,
  shared or command-collision states become
  `BLOCKED_AMBIGUOUS_MANAGED_REQUIREMENTS`. The one-way v0.3.0 recognizer removes only the
  exact contiguous legacy pair, and `stripTrustToml()` now stops at any table or array
  table. Unowned bytes after the last owned key, including CRLF comments and quoted array
  tables, remain untouched.
- **H2:** selection returns immutable `VerifiedTranscript` bytes rather than a reusable
  path. Linux opens the root and every relative component with no-follow directory/file
  descriptors, requires a regular single-link file, caps the snapshot at 16,000,000 bytes,
  compares descriptor identity before/after read and against a no-follow reopen, and then
  validates metadata and parses only the snapshot. Fallback examines at most 256 names.
  Windows retains a functional snapshot/reopen check but is not treated as POSIX evidence.
- **M1:** real install/repair/uninstall acquire the installer lock before shared-state
  reads and proposals. Requirements/config/hooks/manifest bytes are fingerprinted with
  identity, size, timestamps and SHA-256; backups use the captured bytes; every atomic
  replacement revalidates the expected fingerprint and verifies written bytes. Doctor
  performs a stable before/after read check. The deterministic race seam is module-only
  and has no CLI/environment trigger.
- **M3:** the adapter reads at most 1,000,001 raw bytes, accepts no more than 1,000,000,
  decodes strict UTF-8 and requires a JSON object before any child dispatch. Oversize,
  malformed, invalid UTF-8, empty and non-object input remain exit-0 canary-only for a
  valid event.

The owned-catchup source and runtime-bundle hashes were updated exactly, and the bundle now
declares its Linux `openat` Host dependency. Focused Windows evidence is green; Linux
symlink/hardlink/parent-race, process and cross-user cases remain honest S2 gates. M1 also
retains the documented unavoidable residual for a non-cooperating writer acting after the
last fingerprint comparison around atomic rename.

The full local suite intentionally remains red in one Release test: current modified source
builds ZIP SHA-256 `b9f178e520a4dda8fe7e81eccfb9b44b9cc27d3b1ef39bd2a57c723b94798758`,
while the immutable v0.3.0 oracle remains
`f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af`. S1-A does not
authorize changing package/ZIP identity or that oracle; the mismatch is a correct Release
gate, not a product-test assertion to weaken.

## S1-B implementation result

S1-B closes the authorized M2 source boundary with a new, unsealed
`init-cloud-sandbox-v0.3.1.bash`; the published v0.3.0 bootstrap remains byte-identical to
its checkpointed Git blob.

- The new script has no NVM configuration, Node download/install, `npm`, `npx` or
  pipe-to-shell path. It requires the platform `node`, strictly parses its semantic version,
  rejects numeric majors below 18 and performs this check before `run_all` begins APT or
  PowerShell network mutation. The retained `nodejs` component command is now verification
  only. Node 22 remains the exact future Cloud acceptance selection; later majors satisfying
  the contract are accepted locally.
- The default PWF source is the contracted v3.8.2 GitHub archive with SHA-256
  `7dab03ae283da38d33b9d551c7ec621d1818b9f0f17cf9ced566d4accbfc6dd1`. The bootstrap
  extracts only `planning-with-files-3.8.2/skills/planning-with-files`, rejects symlinks in
  that subtree, verifies the exact three `required_skill_files` hashes, and stages a bounded
  same-parent replacement with restoration of an existing Skill on transaction failure.
  `install.js` subsequently revalidates the same required hashes before installing Hooks.
- The new bootstrap defaults to `HOOKS_VERSION=v0.3.1` but retains the required 64-zero
  `HOOKS_SHA256`; `hooks`/`all` therefore fail closed until a later authorized gate supplies
  an exact candidate input or S3 seals final bytes. `package.json`, the 22-entry v0.3.0 ZIP
  allowlist and its sole external v0.3.0 bootstrap asset remain unchanged.
- Windows/Git-Bash tests use a deterministic local archive and stub only the download
  transport. They prove Node version boundaries, subtree-only installation, successful
  replacement, archive-digest rejection, required-file drift rejection and preservation of
  an existing Skill. They are not evidence for real GitHub transport, root-owned Linux
  modes, Codex Cloud Node 22 selection or Fresh/Resume behavior; those remain S2 gates.

The exact repository inventory now anticipates 69 tracked paths. Before checkpoint, the
new bootstrap is intentionally untracked and the real-index boundary test reports that
single difference. A disposable copied index with intent-to-add for only that path passes
all three repository-boundary tests without changing the real index, proving the contract
matches the next checkpoint rather than weakening the allowlist.

## S1-C candidate identity and packaging result

S1-C closes L1/L2 and the candidate identity boundary without sealing or publishing a
Release:

- `package.json` now identifies current source as `0.3.1`. The Release artifact contract
  freezes both `package_name=pwf-codex-cloud-hooks` and `package_version=0.3.1`; the builder
  reads `package.json` and rejects missing or mismatched name/version before writing a ZIP.
- The current candidate allowlist has 23 entries. It adds only
  `patches/patch_planning_skill.py`, the direct import dependency of the already-packaged
  `tools/import_upstream_runtime.py`. The patcher is maintenance tooling, not a new installed
  runtime or trusted execution edge.
- A built candidate ZIP is extracted into a disposable directory and its own importer
  successfully runs `check`. Both bootstrap scripts remain outside the ZIP; the current
  external asset identity is `init-cloud-sandbox-v0.3.1.bash`, whose embedded project ZIP
  hash remains 64 zeroes and fails closed.
- Current candidate tests prove deterministic double-build and contract/package identity.
  Published stable identity is a separate oracle: `v0.3.0^{commit}` remains
  `1454c9224c83d11c073b05baf6e536a11c3bb0e5`; rebuilding from that tag produces the original
  22-entry ZIP SHA-256
  `f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af`, and the unchanged
  v0.3.0 bootstrap remains
  `ab334f0367d948fa29a2bdd37bff0c220929aeb320fdf59dbacbd5a4021b39c0`.
- README, architecture, roadmap, maintainer guidance and active runtime comments now
  distinguish the unsealed 0.3.1 candidate, accepted v0.3.0 rollback and immutable beta.2
  previous fallback. Historical acceptance/provenance bytes were not rewritten.

No current candidate ZIP SHA is promoted to an identity in S1-C. That value remains an
ephemeral build result until a separately authorized seal gate freezes every ZIP input.
The Windows-local full suite is green, but Linux descriptor/race/cross-user behavior and
disposable no-live Cloud acceptance remain S2 gates and cannot be inferred from these
results.

## S2 transport discovery

Official Codex documentation distinguishes two Cloud submission paths relevant to the
unpublished checkpoint:

- IDE-to-Cloud delegation explicitly carries the existing chat context, including local
  source changes, into a new isolated Cloud chat. This is the only documented path found
  that can transport the current local checkpoint without first moving a remote ref.
- `codex cloud exec` submits by environment plus Git branch. The installed CLI
  (`0.146.0-alpha.9.2`) exposes `--env`, `--branch` and attempts/config options, but no local
  patch, commit archive or working-tree upload option. A branch-only CLI task therefore
  cannot identify local `main@03a6cc2f...` while `origin/main` remains five commits behind.

The Cloud environment cache is also not exact-source transport: official documentation
says initial cache creation clones the default branch and a resumed cache checks out the
chat branch. Setup/maintenance environment configuration changes can invalidate the cache,
but that does not make an unpublished local commit addressable.

Consequently S2 may use IDE Cloud delegation without a push if that surface is invoked by
the maintainer. Direct CLI execution must stop at the transport gate unless the exact
checkpoint is first made reachable by a separately authorized remote branch update. A
Cloud run against current `origin/main` would test the wrong source and is invalid evidence.

Read-only remote verification initially confirmed GitHub `main` and local `origin/main`
both remained `bef919475b6ebc3d74c09f9664749664cf950537`, while the S2 candidate was
`03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc` with tree
`2a202622e03f4c582943d25aa0fd9725859cb96d`; the proposed transport ref was absent. After
the maintainer explicitly authorized exactly one ordinary non-force push, Git created new
remote ref `refs/heads/validation/v0.3.1-s2-03a6cc2f`. An immediate read-only
`git ls-remote --heads` returned exact SHA
`03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc`. Remote main, tags and assets were not targets.
The one-time push exception is consumed and supplies exact-source Cloud transport only.

The Cloud CLI can read historical tasks and recognizes environment label
`pwf-codex-cloud-hooks` in returned metadata. Although list records expose null
`environment_id` values and the returned task set was not visibly narrowed, the CLI's own
diagnostic trace confirms that it resolves this repository/label to an internal environment
ID before calling the API. The label is therefore a usable future `--env` selector after
exact-source transport is authorized; no internal account identifier is persisted here.

## S2 manual Codex Cloud handoff

The historical `docs/v0.3.0-cloud-hard-acceptance.md` remains the behavioral reference,
not the current candidate identity. For this S2 run:

- checkout branch `validation/v0.3.1-s2-03a6cc2f` and reject any full HEAD other than
  `03a6cc2f32481df0d7e1fdff8aafad841b2b5fbc`;
- select the Cloud-provided Node 22 runtime; the product contract remains Node `>=18`;
- require the Linux suite to report zero failures and zero skips, but record its actual
  runner counts rather than copying the historical v0.3.0 count;
- build/check the candidate twice. The Windows exact-checkpoint oracle is 23 entries,
  82,421 bytes and SHA-256
  `2cd19e04a15995014ae354ad0319e4182a72ea0fc82b08213959b3550c741cfb`;
  any Linux build mismatch is a stop condition, not authority to rewrite the oracle;
- keep `init-cloud-sandbox-v0.3.1.bash` outside the ZIP with its 64-zero default hash. For
  the disposable candidate setup only, pass the locally built archive through explicit
  `HOOKS_URL=file://...` and its computed `HOOKS_SHA256`; do not edit/seal the bootstrap;
- reuse the B through F lifecycle sequence and observation rules, but use fresh 0.3.1 S2
  markers such as plan `pwf-v031-s2-03a6`, canonical marker
  `PWF_V031_S2_CANONICAL_03A6`, acknowledgment `PWF_V031_S2_BASELINE_CREATED`, unsynced
  acknowledgment `PWF_V031_S2_UNSYNCED_ACKNOWLEDGED`, and tail marker
  `PWF_V031_S2_REAL_RESUME_TAIL_03A6`;
- require post-resume doctor to be healthy/non-repairable with empty errors/blockers,
  installer version `0.3.1`, the exact manifest inventory, 11 runtime payloads and zero
  snapshot residue.

Do not execute the historical S3-A Release-download/publication steps, reuse its v0.3.0
tag/asset hashes/counts, claim the observed candidate ZIP hash is sealed, or promote 0.3.1
as rollback. The accepted v0.3.0 Release remains unchanged while this manual run is S2
candidate evidence only.

The newcomer runbook is intentionally placed on a separate evidence-only branch rather
than moving `validation/v0.3.1-s2-03a6cc2f`. Because the repository boundary contract
freezes every tracked path, the new doc requires the mechanical inventory change from 69
to 70 paths. Both the doc and that test are excluded from the 23-entry Release allowlist;
the runbook setup independently proves exact-candidate ancestry, rejects any delta outside
the doc/inventory-test/current-planning paths, and requires the built ZIP to match the
existing exact-candidate size/hash oracle before disposable installation.
