# Task Plan: Phase 4 F3B1 protocol materialization

## Goal

把 Phase 4.7 冻结的 F3B 双身份、Cloud setup/maintenance、隔离 smart/autonomous Git graph、evidence schema 与
tamper 边界落实为版本化、可复制、可静态检查且能在 disposable local Git fixtures 中完整干跑的协议；保持真实
development planning scope markerless，不执行任何 live activation、Cloud task 或 rollback。

## Authorization

- Maintainer authorization: “继续 F3B1”。
- Authorized: 更新 F3 专用 runbook/提示词与 repository-only verifier/tests；新增 no-live disposable fixtures；同步
  ROADMAP、版本 acceptance、Phase 4.7 post-implementation reconciliation 和当前 planning；运行 local regression、
  deterministic candidate no-byte-change check；创建单一本地 commit。
- Not authorized: 在真实 planning scope 或长期分支创建/提交 `.mode`、`.nonce`、`.attestation`、
  `.pwf-codex-managed`、ledger；创建/移动 validation remote refs；运行 F3B2 smart live、F3B3 autonomous live、
  F3B4 Cloud evidence closure、F3C rollback；修改 production runtime/contracts/bundle/Release inventory；push、PR、tag、
  Release、seal 或 promotion。

## Next Step

先为 Phase 4.7 的双身份、setup/maintenance 和完整 DAG 补 failing/static boundary tests，再扩写 F3 runbook 与
repository-only verifier；完成 disposable no-live dry run、完整回归和 candidate-byte comparison 后本地 commit，并停止在
F3B2 smart live 授权之前。

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| B10 Evidence recovery | completed | 根权威、F3B0、F3A verifier/runbook、官方 Cloud lifecycle 与干净工作树复核 |
| B11 Failing boundary tests | completed | 双身份、setup/maintenance、DAG、tamper/evidence/no-live stop 有可执行失败断言 |
| B12 Protocol materialization | completed | runbook/提示词与 repository-only verifier 实现冻结协议；无 production/Release drift |
| B13 Disposable no-live dry run | completed | smart/autonomous DAG、exact parent/diff/state 与 script syntax 在临时 Git repo 闭合 |
| B14 Regression and authority sync | completed | focused/full suite、candidate bytes、ROADMAP/acceptance/history/lifecycle ledger 一致 |
| B15 Local commit and stop | completed | 单一 F3B1 commit；明确 `F3B2_NOT_AUTHORIZED` |

## Stop Conditions

- 需要在当前真实 planning scope、development branch 或 remote ref 创建任何 profile/activation machine state；
- setup/maintenance 必须依赖 moving branch、cache 命中、secret、setup shell 临时 export 或 agent 网络才能工作；
- 无法同时校验 `RUNTIME_SOURCE_HEAD`、candidate ZIP SHA 与 `WORKSPACE_LIFECYCLE_HEAD`；
- 干跑无法证明 activation/disarm/re-arm direct-parent exact path relation，或需要放宽 repository admission；
- 需要新增 managed writer、Host event、production file、runtime bundle/Release entry 或改变 candidate bytes；
- Cloud/official ABI 与 Phase 4.7 冲突，或任何命令未取得明确最终 exit code；
- 测试需要执行真实 Cloud、push/PR/tag/Release、seal、promotion 或 F3C rollback。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Read command guessed nonexistent `tests/repository-lifecycle.js` | 1 | Located the actual lifecycle authority in `tests/f3-lifecycle-helpers.js`; no file or implementation action depended on the bad path. |
| PowerShell parsed a double-quoted `rg` alternation containing escaped `$` as an empty pipeline | 1 | Reissue the read-only search with single-quoted patterns; no repository command ran and no state changed. |
| Disposable Git DAG returned `spawnSync` status `null` in the restricted Windows runner | 1 | Classify as a sandbox child-process limitation; retain the exact DAG and rerun it with local child-process permission after implementation. |
| First unrestricted DAG rerun did not return a final process status | 1 | Terminated the run; isolate fixture commits from user Git hooks/signing and terminal prompts, and add a bounded child timeout before retrying. |
| Focused regression retained F3A's obsolete pre-F3B no-live sentence as exact wording | 1 | Update the guard to assert F3B1's current, stricter no-live statement; keep all activation/Cloud prohibitions intact. |
| Windows static-check wrapper invoked absent `python3` command | 1 | Re-run importer and runtime compile checks with the available Windows `python` launcher; both completed with exit code 0. |
| First candidate wrapper used unsupported PowerShell `New-Item -LiteralPath` and continued after a non-terminating error | 1 | Treat the clean ZIP result as insufficient wrapper evidence; rerun with `$ErrorActionPreference='Stop'`, supported `-Path`, verified temp containment and final exit code 0. |

## Current status

`F3B1_PROTOCOL_READY / NO_LIVE_STATE / STOP_BEFORE_F3B2 / F3C_NOT_AUTHORIZED`
