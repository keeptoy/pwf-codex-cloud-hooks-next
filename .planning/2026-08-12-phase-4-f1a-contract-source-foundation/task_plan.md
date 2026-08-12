# Task Plan: Phase 4 F1A Contract/Source Foundation

## Goal

在保持 plan-v1 legacy runtime behavior 的前提下，原子迁移 source manifest schema4、runtime bundle v2、Release artifact v2、adapter/四项 ABI placement、entry-owned mode 与 accepted v0.3.5 predecessor transition contract，使 importer、installer、doctor、builder、deterministic ZIP、升级/回滚验证形成完整绿色停止点。

## Authorization

- Maintainer authorization: 继续 F1A。
- Authorized: F1A contracts、importer、installer、builder、直接测试/fixture、current docs/hash/inventory 闭合、local/Linux-equivalent validation、本地 commit。
- Not authorized: F1B plan protocol v2/state reader、smart/autonomous activation、workspace state、Cloud execution、seal、publication、promotion、remote writes。

## Next Step

完成 P0 exact baseline inventory；随后以 failing-first tests 冻结 schema、placement、mode、transition 与 residue 边界。

## Stop Conditions

- F1A 完成独立验证和本地 commit 后停止，不自动进入 F1B。
- 若必须保留 current v1/v2 dual loader、放宽 unknown-file blocker、修改 legacy runtime output/Host ABI、写 workspace 或扩大 production trusted graph，停止并重开 Discovery。
- 若 accepted v0.3.5 installed state 无法 exact 识别，收缩为 uninstall → clean install，不猜测迁移。
- 不改写 immutable v0.3.5/v0.3.4 tag、bootstrap、acceptance 或 provenance evidence。

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| P0 Evidence refresh and exact lifecycle inventory | complete | 旧 paths/fields/constants/consumers/hash edges 与 v0.3.5 installed state 全部入账 |
| P1 Failing-first contract and mutation tests | complete | schema4/v2 exact keys、placement、mode、transition、absence guards 红灯成立 |
| P2 Contract/source implementation | complete | leaves → bundle → manifest → importer/installer/builder → Release 原子闭合 |
| P3 Upgrade, rollback and legacy parity proof | complete | v0.3.5 exact forward migration、failed migration zero mutation、legacy behavior parity |
| P4 Full validation and lifecycle reconciliation | complete | focused/full suite、deterministic ZIP、syntax/mode/residue scans 通过 |
| P5 Local commit and stop | complete | 独立 commit，工作树干净，F1B 未授权 |

## Migration lifecycle ledger

| Object/path/symbol | Current producer/consumer/owner | Action | Gate/window | Propagation/proof | Post-gate state | Review/retirement |
|---|---|---|---|---|---|---|
| `upstream-manifest.json` schema3 shape / `skill_version` | importer/installer/contracts tests | REPLACE/RETIRE — CLOSED | F1A | exact-key mutation + raw hash order | schema4 exact source admission | next source schema gate |
| `contracts/runtime-bundle-v1.json` | importer/installer/manifest/tests | REPLACE — CLOSED | F1A | v2 schema/path/hash/inventory tests | removed from current tree; history only | never dual-load current source |
| bundle entry `origin/managed_sha256/overlay_ids/language/host_dependencies/condition/required` | loaders/tests | RETIRE — CLOSED | F1A | exact absence + mutation rejection | structural partitions/root restrictions/dependency closure | history only |
| adapter outside bundle + installer special-case | Release/installer | REPLACE/RETIRE — CLOSED | F1A | bundle projection/install/doctor tests | adapter is `local_files` entry | installed manifest field deferred below |
| two installed plan ABI + two source-only catch-up ABI | bundle/Release/installer | REPLACE placement — CLOSED | F1A | exact four-schema inventory/install tests | all four in `installed_contracts` | F1B replaces plan pair with v2 |
| `contracts/release-artifact-v1.json` | builder/manifest/tests | REPLACE — CLOSED | F1A | v2 exact entries + deterministic build | current v2 only | Release-v3 if future need |
| builder `DEFAULT_CONTRACT` / `EXECUTABLE_PATHS` | builder | REPLACE/RETIRE — CLOSED | F1A | manifest discovery + entry mode mutation tests | manifest-selected contract; mode in entry | no second mode authority |
| source executable modes | bundle/Release/Git | KEEP/MOVE authority — CLOSED | F1A | Git/ZIP mode checks | Release entries own ZIP mode | Phase 9 audit |
| `installed-state-transition-v1.json` | manifest + installer | ADD — CLOSED | F1A accepted predecessor window | exact v0.3.5 fixtures; tamper pre-write failure | one predecessor profile only | installer owner; replace/review at accepted baseline promotion, no later than F3/Phase 9 |
| installed-manifest schema3/runtime_files/adapter_sha256 | installer + v0.3.5 doctor | DEFER/KEEP — CLOSED FOR F1A | F1A | migration/doctor regression | unchanged installed state schema | installer owner; review when accepted predecessor no longer consumes, no later than F3/Phase 9 |
| plan request/result v1 behavior and paths | adapter/owned-plan | KEEP — CLOSED FOR F1A | F1A | golden byte parity | unchanged | F1B replacement |
| published v0.3.5/v0.3.4 v1 oracles | immutable Git refs/tests | KEEP — CLOSED | publication window | historical self-discovery tests | immutable history only | never rewrite |
| current v1 names/fields/constants residue | current code/contracts/tests/docs | RETIRE — CLOSED | F1A | reverse `rg` classification | absent except immutable history/oracle naming and absence guards | future residue scan at every schema/Release gate |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---|---|
| None | — | — |
| PowerShell runtime lacks static `SHA256.HashData`/`Convert.ToHexString` APIs used for a historical raw hash helper | 1 | Use existing Node/Python hashing helpers; current file hashes were still captured successfully |
| Focused F1A regression: 71 pass / 5 fail / 1 Windows skip | 1 | Classified as four incomplete propagation classes; repair stale tests/fixture/docs, then rerun instead of weakening exact admission |
| Combined PowerShell `rg` probe exited 1 after printing the manifest | 1 | Quoting made the search pattern invalid/no-match; split inspection from targeted patches rather than retrying the same compound probe |
| Git Bash `bash -n` could not create a Windows signal pipe in the filesystem sandbox (Win32 error 5) | 1 | Importer passed before the failure; rerun Bash syntax outside the sandbox and execute the skipped mode/diff checks separately |
| Full `npm test`: 123 pass / 1 fail / 12 Windows skips | 1 | Sole failure was a governance test still requiring “F1A not authorized” after F1A completion; advance the assertion to the documented F1B stop boundary and rerun full suite |
| Sandbox denied creation of `.git/index.lock` during local commit | 1 | Code and validation are intact; rerun the same scoped add/commit outside the filesystem sandbox |

## Current status

`F1A_COMPLETE / LOCAL_COMMIT_AND_STOP / F1B_NOT_AUTHORIZED`
