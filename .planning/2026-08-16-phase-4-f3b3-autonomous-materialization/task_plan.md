# Task Plan: Phase 4 F3B3 autonomous live chain

## Goal

物化并审计 `A_BASE → A_PREP → A_ARM → A_DISARM → A_REPREP → A_REARM`，冻结一份完整独立的 Cloud operator
guide，使维护者能够在不修改 production/Release bytes 的前提下逐轮验证 autonomous zero-ledger、tamper refusal、
disarm、re-attest 与 re-arm；本轮停止在真实 Cloud live 之前。

## Next Step

等待维护者 push `0.4.0-dev` 与六个 frozen validation refs；真实 Cloud 六轮执行仍需维护者另行授权，并必须逐项按
operator guide 收集原始 Host/probe/Git/doctor/final-exit evidence。

## Current Phase

F3B3 local materialization complete; stopped before Cloud live

## Autonomous validation checkpoint

`PWF_F3B3_TASK_REVISION=initial`

## Phases

### Phase F3B3-M0 — Authority and plan preflight

**Status:** completed

- 复核 README/ARCHITECTURE/DESIGN/ROADMAP、Phase 4.8、F3 runbook、F3B2 evidence 和当前 refs。
- 冻结授权边界、ref 名称、plan ID、state bytes 与 candidate identity。

### Phase F3B3-M1 — Markerless A_BASE

**Status:** completed

- 把本 plan 作为 markerless active scope 提交到 development branch。
- 冻结 exact runtime-source transport ref；证明当前 scope 没有 machine state。

### Phase F3B3-M2 — Autonomous validation DAG

**Status:** completed

- 在隔离 worktree 物化 prepare/arm/disarm/reprepare/rearm direct-parent commits。
- 核对 exact path、state、task digest、nonce 轮转与 activation-only 关系；不创建 tamper ref。

### Phase F3B3-M3 — Self-contained operator guide

**Status:** completed

- 写入 exact source/candidate/workspace identities、环境变量、六轮 Cloud 顺序、提示词、只读校验和 evidence schema。
- 补 programme/acceptance/lifecycle 状态与 repository-only tests。

### Phase F3B3-M4 — Verification and local handoff

**Status:** completed

- 运行 focused/full regression、deterministic candidate、Release exclusion、ref graph 与 Bash syntax checks。
- 创建单一 docs/tests/planning 本地 commit；停止并交给维护者 push/Cloud。

## Authorization

- 维护者已授权执行 Phase 4.8 冻结的 **F3B3 autonomous materialization**。
- 已授权：创建 markerless `A_BASE` 本地 commit/ref；在隔离本地 worktree 创建 autonomous validation commits/refs；
  创建自包含 operator guide；更新 Release-excluded planning/history/ROADMAP/acceptance/tests；本地验证和本地 commit。
- 未授权：push 或移动远端 refs；真实 Cloud task；真实 tamper；F3B3 live PASS；F3B4/F3C；production/runtime/contracts/
  bundle/manifest/installer/bootstrap/README/Release byte 变化；PR、tag、Release、publication 或 promotion。

## Frozen boundaries

1. `A_BASE` 必须 markerless；development branch 和最终 docs commit 也不得包含 autonomous state。
2. `A_PREP` 只新增 `.mode/.nonce/.attestation`；`A_ARM/A_REARM` 只新增 activation；`A_DISARM` 只删除 activation；
   `A_REPREP` 只修改 `task_plan.md/.nonce/.attestation`。
3. nonce 为 exact 16 位小写十六进制加换行，initial/reprepared 必须不同；attestation 必须是对应 task bytes 的 SHA-256。
4. 零 ledger 是本轮唯一 happy-path state；不得创建 writer、ledger fixture、`.stop_blocks` 或 gated state。
5. tamper 只写进 operator protocol，materialization 不在真实 validation checkout 执行，也不创建 commit/ref。
6. operator guide 必须自包含；expected 值不自证，Cloud Host/probe/Git/final exit code 分别承担 evidence authority。
7. 所有改动保持 Release-excluded，candidate 必须继续精确等于已验收的 22-entry SHA。

## Stop Conditions

- 任何目标 ref 已存在但不等于本轮新建的 exact commit，或 parent/path/state relation 无法闭合。
- 需要修改 production、contract、Host ABI、trusted graph、README 或 Release input 才能继续。
- isolated worktree 混入未知文件、machine state 泄漏 development branch，或 candidate SHA 漂移。
- 需要执行 Cloud/tamper/remote write 才能完成本地 materialization。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| A_REPREP validation command accidentally included nonexistent `test-path-placeholder` after the real validator | 1 | Validator itself had already returned `autonomous_prepared`; logged the orchestration typo and reran only the intended exact checks |
| Git for Windows Bash could not create its signal pipe inside the current sandbox while checking guide fences (`Win32 error 5`) | 1 | Classified as an execution-sandbox limitation rather than a script result; finish the bounded edits, then rerun Bash syntax with the required outer permission |
| Focused test expected at least seven Bash fences, but the self-contained guide intentionally has six executable blocks | 1 | Classified as a test-count defect: push, remote check, transaction, normal verifier, tamper verifier and evidence validator are the six independent blocks; corrected the lower bound to six without weakening any semantic assertion |
| Initial `git add` could not create `.git/index.lock` because the workspace sandbox exposes `.git` read-only | 1 | No paths were staged or lost; logged the environment restriction and reran the same exact-path add/commit with local Git permission only |

## Current status

`F3B3_LOCAL_MATERIALIZATION_PASS / CLOUD_LIVE_NOT_AUTHORIZED / STOP_BEFORE_F3B4`
