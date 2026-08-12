# Task Plan: Phase 4 F2A smart activation implementation

## Goal

按已冻结的 Phase 4.4 设计实现 F2A smart activation：以独立 plan-local `.pwf-codex-managed` 为最后提交点，
只在 exact opt-in 后读取 `.mode` 并选择 pristine smart renderer；保持 legacy 默认、workspace 只读、F2B surface
不可达，并闭合代码、测试、hash/inventory、文档和本地 candidate evidence。

## Authorization

- Maintainer authorization: 时机合适则进入 F2A 并施工。
- Authorized: F2A production/runtime/adapter/test、必要 contract/hash/bundle/Release propagation、用户文档、完整本地验证与本地 commit。
- Not authorized: 写真实用户 activation state、F2B autonomous/nonce/attestation/ledger、live Cloud opt-in、F3、seal、publication、promotion、push 或其他远端写入。

## Next Step

等待维护者 push F2A implementation 与 lifecycle/Cloud protocol follow-up 两个 commits，按更新后的 markerless legacy
canonical fixture 执行 Linux/Source-Candidate/no-live Cloud hard acceptance。验收结果回传前不进入 F2B/F3。

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| P0 Recovery and inventory | completed | implementation scope、call graph、hash propagation、lifecycle ledger 与 baseline 冻结 |
| P1 Failing-first tests | completed | capability、unarmed zero-read、smart/refusal/race/disarm matrix 先红且失败原因正确 |
| P2 Runtime and adapter implementation | completed | exact activation admission、smart private rendering、two-pass revalidation 与 relational adapter validation 闭合 |
| P3 Supply-chain and documentation closure | completed | bundle/manifest/Release hash、current docs、历史状态尾注与 residue scan 自洽 |
| P4 Local acceptance and commit | completed | full local suite、syntax/compile、deterministic ZIP/install checks、diff checks 全绿并本地 commit |
| P5 Lifecycle and Cloud protocol follow-up | completed | Phase 4.4 实施后冷对账、markerless legacy 黑盒判别、版本 evidence/current-state 职责与 tests 闭合并独立 commit |

## Migration lifecycle ledger

| Object/path/symbol | Current owner/consumer | Action in F2A | Propagation/evidence | Review/retirement |
|---|---|---|---|---|
| `.mode` same-file normalizer grammar | `runtime/owned-plan.py`; tests only | REPLACE | remove `codex-managed-v1` token; exact `inject-smart\n` only behind valid activation | F2B extends profile grammar |
| `.pwf-codex-managed` | future user producer / owned runtime | ADD | exact bytes, safe read, post-render revalidation, no runtime writes | F2B reuse; protocol v2 review |
| adapter `allowed_profiles` | `hooks/hook_adapter.py` | REPLACE `[legacy]` with `[legacy, smart]` | request/schema/nearest tests; no workspace reads | F2B only may extend |
| runtime `SUPPORTED_PROFILES` | `runtime/owned-plan.py` | REPLACE with `(legacy, smart)` | forged autonomous rejected before state capture | F2B only may extend |
| legacy zero-read guard | runtime/tests | REPLACE WITH STRONGER MATRIX | unarmed `.mode` never opened; disabled/detached/no-plan zero-read | keep through Phase 4 |
| private renderer environment | owned-plan → pristine inject-plan | ADD owned `PWF_INJECT=smart` only | ambient env stripped; raw markers not copied | F2B rendering review |
| request/result schema v2 | contracts/runtime/adapter | KEEP | no schema byte change unless exact consumer evidence disproves sufficiency | consumer/semantic change only |
| state advisory taxonomy | result v2/runtime | KEEP/CONSUME | map invalid/incomplete/unsupported/changed to existing exact enum | schema semantic review |
| runtime/adapter bytes | bundle/manifest/Release/install | REPLACE + HASH PROPAGATE | one authority chain; deterministic build/check/install | each later runtime change |
| nonce/attestation/ledger/gated/writer | future F2B/Phase 8 | KEEP DENIED | residue/call-edge tests | F2B/Phase 8 Discovery |
| activation procedure/probe docs | current user docs | ADD | no writer bundled; probe reuses production request/result | F3 Cloud lifecycle review |
| Phase 4.4 implementation ledger | cold history / successor review | ADD post-implementation reconciliation | actual owner、consumer、executable evidence、retirement trigger | each F2B/F3 migration audit |
| Cloud canonical completed/active sentinels | stable acceptance template | ADD markerless profile discriminator | D/E2 must observe both without activation files | review when default profile or renderer contract changes |
| version acceptance pending/current section | active plan/ROADMAP should own it | RETIRE/MOVE | repository boundary forbids dynamic pending prose in acceptance | completed exact evidence only |

## Stop Conditions

- 需要新 schema/Host event/upstream file、workspace writer、external consent service 或 persistent cache。
- smart 无法只改变 plan selection，或 token/`.mode` race 无法在输出前 fail closed。
- 任一 invalid armed state 必须降级 legacy 才能继续，或 catch-up/canary semantics 必须变化。
- current tree 与 Discovery 的 hash/inventory/call graph 事实冲突，且存在两条安全代价明显不同的路线。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Local WSL status/runner invocation reported that Windows Subsystem for Linux is not installed | 1 | Classified as local platform limitation; do not weaken/skip Linux assertions or describe Windows results as Linux. Check for an existing container runner, otherwise retain Linux/Cloud acceptance as the post-commit maintainer gate. |
| Docker and Podman probes found no installed local container runner | 1 | Retained the Linux-only matrix unchanged and assigned its zero-skip execution to the mandatory post-commit Cloud gate. |
| Sandboxed Node test runner failed to spawn test files with `EPERM`; sandboxed Git Bash could not create its signal pipe | 1 | Re-ran the same Node and Bash checks outside the workspace sandbox; both completed successfully. |
| Repository lifecycle test assumed a candidate acceptance file could not retain an earlier gate's exact evidence while a later gate was pending | 1 | Preserved F1B evidence under an explicit historical-gate heading and scoped the no-hash assertion to the pending F2A status section. |
| Follow-up audit found that the prior workaround still stored dynamic F2A pending status in the version acceptance | 1 | Retire that pending section entirely; keep current status in ROADMAP/task plan and let acceptance retain only completed exact gate evidence. |
| First patch for removing the pending acceptance section missed its exact line wrapping | 1 | Read the numbered UTF-8 lines and applied a narrower exact-context patch; no partial file mutation occurred. |
| First lifecycle assertion over-locked Chinese sentence ordering around the two sentinels | 1 | Replaced it with exact behavioral checks: each sentinel must occur in C, D and E2, plus the no-activation-file boundary. |
| Combined verification command assumed Git Bash lived on `C:` while this workstation installs it on `D:` | 1 | Derived Bash from `Get-Command bash` and reran bootstrap syntax separately; prior successful test/importer/compile results remained valid. |

## Current status

`F2A_IMPLEMENTATION / LOCAL_COMPLETE / CLOUD_ACCEPTANCE_PENDING`
