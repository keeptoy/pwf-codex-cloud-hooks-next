# Task Plan: Phase 4 F3A lifecycle foundation

## Goal

把 F3 Discovery 选择的 Git-backed 双阶段路线落实为可执行、可测试的 source/repository foundation：只允许当前
active scoped plan 使用 exact smart/autonomous machine state；冻结 fail-closed prepare/verify 与 preparation →
activation-only commit 关系；建立独立 F3 live acceptance runbook。managed runtime 继续只读，本 gate 不创建真实
activation state、不运行 live Cloud lifecycle，也不执行 rollback。

## Authorization

- Maintainer authorization: 补全 Phase 4.6 的 F3A 职责并进入 F3A 施工。
- Authorized: active-scope repository admission、source-side prepare/verify protocol、专用 runbook、静态/临时 fixture
  负向测试、local/Linux/no-live regression、当前 programme/acceptance/planning 同步、本地 commit。
- Not authorized: 在真实项目 planning scope 创建或提交 `.mode`、`.nonce`、`.attestation`、
  `.pwf-codex-managed` 或 ledger；运行 F3B live activation、Cloud Fresh/Resume lifecycle、F3C rollback；新增
  managed writer/Host event；修改 Release inventory；push、PR、tag、Release、seal、promotion。

## Next Step

F3A source/repository foundation、本地验证与 Linux/Source-Candidate no-live gate 已全部闭合。当前唯一 Next Step 是停止，
等待维护者决定是否授权独立 F3B live lifecycle；在新授权前不得创建真实 preparation/activation state。

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| A0 Scope and lifecycle ledger | completed | Phase 4.6 职责、owner、retirement 与四文件可扩展边界完成对账 |
| A1 Active-scope repository admission | completed | exact filenames、state combinations、inactive-scope denial、link/unknown/incomplete refusal 有可执行测试 |
| A2 Prepare/verify and runbook | completed | smart/autonomous preparation、activation-only relation、disarm 与 evidence schema 可执行；不依赖 shipped writer |
| A3 Local verification and authority sync | completed | focused/full suite、syntax/import/hash/build checks通过；ROADMAP/acceptance/current planning一致 |
| A4 Local commit and stop | completed | 单一 F3A commit 完成；明确停在 Linux/no-live 与 F3B 之前 |
| A5 Linux/Source-Candidate no-live acceptance | completed | exact HEAD、Linux 零 skip、deterministic ZIP、B～E legacy 与 9.1 deep check 闭合；停止在 F3B 前 |

## Stop Conditions

- 实施需要把 writer、producer helper 或新增 upstream 文件装入 managed runtime/Release inventory；
- 实施需要在当前真实 planning scope 创建 smart/autonomous state，或让测试依赖当前 worktree 已 armed；
- 无法用 exact active pointer、regular-file、content grammar 和 Git commit relation fail closed；
- 需要把 cache、environment variable、secret、模型声明或模糊 HEAD 当作授权/正确性边界；
- 需要运行 live Cloud activation、rollback、push/PR/Release 或任何远端写入；
- 发现 F2B consumer contract、官方 Cloud lifecycle 或 upstream producer事实与 F3 Discovery 冲突。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Focused `node --test` could not create Windows test-runner workers (`spawn EPERM`) before assertions | 1 | Classified as the known workspace sandbox harness limitation; run the exact files directly in single processes, while preserving the standard runner for Linux/no-live acceptance. |
| Runbook static test initially matched literal `\\t` while Git `--name-status` examples correctly contain a real tab | 1 | Corrected the test expression to require the real tab; the exact one-path relation remained unchanged. |
| Programme sync shortened the stable `F1 foundation ... complete` anchor and tripped the repository status parser | 1 | Restored the established parseable phrase while keeping the new F3A state; no programme meaning changed. |
| First full suite found the new F3A test module missing from DESIGN's test-to-capability reverse index | 1 | Added the required module row with its repository/Git/runbook boundary and platform scope; no product assertion failed. |
| Combined auxiliary validation reached bootstrap syntax then Git Bash could not create its Windows sandbox signal pipe (`Win32 error 5`) | 1 | Importer/Python/Node checks before it passed; rerun the remaining Bash/Release/diff checks outside the restricted process sandbox and require an explicit final exit code. |
| Test-only helper imported `owned-plan.py` without disabling bytecode and created `runtime/__pycache__`, tripping the existing no-cache guard | 1 | Invoke Python with `-B` plus `PYTHONDONTWRITEBYTECODE=1`; remove only the verified generated cache directory, then rerun focused/full suites. |
| Post-Cloud status-sync focused run again returned `status=null` for Python/Git/Bash child processes in the restricted Windows harness | 1 | Classified as the already-known local process sandbox limitation, not an assertion failure; rerun the exact focused files with child-process permission and require a final exit code. |
| First permitted post-sync repository-governance run retained two pre-PASS expectations (`F3A` local-only wording and `F2B` as current evidence heading) | 1 | Updated the assertions to the new F3A programme/evidence boundary while preserving the no-evidence-before-heading rule. |

## Current status

`F3A_COMPLETE / SOURCE_CANDIDATE_NO_LIVE_CLOUD_PASS / REAL_STATE_CREATION_FORBIDDEN / F3B_NOT_AUTHORIZED / F3C_NOT_AUTHORIZED`
