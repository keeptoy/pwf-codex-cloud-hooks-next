# Task Plan: Phase 4 F2B autonomous activation implementation

## Goal

按 Phase 4.5 冻结的 read-only owned boundary，实现 profile-bound autonomous activation、exact attestation/nonce 与
bounded normalized ledger；保持 legacy/smart 行为、managed workspace read-only、adapter-only policy 和 gated denial，完成
本地验证与可交给维护者执行的 Linux/Source-Candidate no-live gate 后停止，不进入 F3 live activation。

## Authorization

- Maintainer authorization: 直接进入 F2B 实现。
- Maintainer follow-up authorization: 在尚未推送前补齐 Phase 4.5 的 post-implementation 设计差异、对象生命周期与 F3
  disposition 对账，并并入同一 F2B 本地提交。
- Authorized: production runtime/adapter、相关 tests/contracts hash/inventory、README/ARCHITECTURE/DESIGN/ROADMAP/CHANGELOG、
  current acceptance template 必要同步；本地完整回归、deterministic candidate、独立本地 commit。
- Not authorized: 创建真实用户项目 activation/nonce/attestation/ledger；Cloud Git-backed 或 same-chat activation；F3；新增
  Host event/managed writer/schema generation；导入 upstream writers；seal、publication、promotion、push 或远端写入。

## Next Step

维护者推送补齐实施后对账的 F2B 本地提交，并按 current acceptance 执行 Linux/Source-Candidate no-live Cloud gate；
回传 exact HEAD、零 skip suite、deterministic ZIP、install/doctor 与 adapter probe 证据后停止，不进入 F3。

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| I0 Scope and current inventory | completed | 文件、producer/consumer、hash/inventory、测试和文档传播完整；无用户改动冲突 |
| I1 Failing-first autonomous matrix | completed | token/profile、attestation/nonce、ledger bounds/no-fallback、race/cleanup 与 adapter relation 先红 |
| I2 Owned runtime and adapter implementation | completed | autonomous read-only path 可达；legacy/smart 不变；gate denied；no managed writer |
| I3 Contract/hash/inventory and documentation closure | completed | machine authority/hash、README/architecture/design/changelog/ROADMAP/acceptance 自洽 |
| I4 Local verification and commit | completed | focused + full suite、import/check、compile、syntax、deterministic ZIP、diff checks 通过并提交 |
| I5 Cloud no-live handoff | completed | 精确 HEAD/模板/预期输出交给维护者；不自行 push、不进入 F3 |
| I6 Phase 4.5 post-implementation reconciliation | completed | 方案与落地差异、对象 lifecycle、F3 PASS/NO_GO 处置及历史索引闭合 |

## Lifecycle ledger

| Object / seam | Action | Owner / consumer | Exit evidence | Review / retirement trigger |
|---|---|---|---|---|
| smart activation `codex-managed-v1\n` | KEEP smart-only | user / owned-plan | smart compatibility + anti-escalation tests | protocol replacement |
| autonomous activation `codex-managed-v1 autonomous\n` | ACTIVATE | explicit user-side producer / owned-plan | exact bytes, unsafe/race/disarm tests | F3 failure or Phase 4 retirement |
| `.mode=autonomous\n` | ACTIVATE only behind matching token | user-side producer / owned-plan | zero-read unarmed + exact relation | F3 failure or protocol replacement |
| `.nonce` / `.attestation` | ADD owned readers | external producer / owned-plan | exact format/digest + identity revalidation | F3 failure or protocol replacement |
| `ledger-*.jsonl` admission/normalization | ADD owned reader | external producer / owned-plan | bounds, schema, deterministic order, mutation tests | Phase 8 ledger ownership review |
| raw `progress.md` in autonomous | DENY | none | no-read/no-projection tests | autonomous protocol replacement |
| upstream ledger renderer | KEEP pristine consumer of private normalized snapshot | owned-plan child | bundle closure + snapshot tests | renderer authority change |
| adapter/runtime capabilities | REPLACE atomically `[legacy, smart]` → `[legacy, smart, autonomous]` | adapter / owned-plan/result validator | relational composition tests | F3 rollback or protocol replacement |
| `gate` / upstream writers | KEEP DENIED | none | call-edge/source-residue tests | Phase 8 / separate producer audit |
| F3 activation routes | DEFER | maintainer + Cloud acceptance | no live claim in F2B docs | F2B no-live PASS then explicit authorization |

## Stop Conditions

- 必须新增 managed workspace writer、Host event、external callback、secret/identity token 或 persistent correctness cache；
- 无法在 descriptor-relative boundary 中完成 exact task/state/ledger capture 与 post-child revalidation；
- autonomous 必须读取 raw progress 或在 invalid state 下回退 legacy/smart；
- contract v2 无法诚实表达关系、需要改变 schema/Host ABI/trusted graph 而未先重开 Discovery；
- upstream pristine bytes、global Skill 或 published assets 需要修改；
- Windows 无法执行的 POSIX case 被伪装 PASS，或完整回归出现未分类失败；
- 实现完成后需要进入 live Cloud/F3、seal 或远端写入。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Failing-first focused suite reported 5 expected failures; POSIX autonomous cases skipped on Windows | 1 | Classified as intended red state: capability, normalizers, readers and adapter relation are not implemented; retain Linux-only rendering tests for later Cloud/Linux zero-skip gate. |
| Node focused suite could not spawn test workers in the managed Windows sandbox (`spawn EPERM`) | 1 | Classified as environment permission, not a test result; rerun the same read/test-only command with approved escalation. |
| First escalated focused run had 9 failures | 1 | Classified as implementation/test relation drift: adapter validator still expected the F2A sequence, default test requests still emitted it, and static test names differed. Updated all three atomically; rerun passed 23/23 runnable with 14 honest POSIX skips. |
| First full suite had 2 repository-governance failures | 1 | Classified as expected lifecycle assertion drift: tests still required the pre-F2B ROADMAP and two future `NOT_AUTHORIZED` rows. Updated them to assert F2B local PASS/current Cloud pending and F3-only denial. |
| First deterministic ZIP orchestration command had a PowerShell parse error | 1 | No build ran and no repository file changed; replace the invalid parenthesized `Add-Type` expression with separate statements, then run once. |
| First old-symbol residue scan put `--pcre2` after the path arguments, so look-around parsing failed | 1 | No repository change; rerun with `--pcre2` before the pattern and split broad historical/current searches for classification. |
| Combined final checks reached Git Bash syntax validation but sandbox denied its signal pipe | 1 | Earlier checks in the command passed; rerun only `bash -n` with approved escalation, then run status separately. |
| Local stage/commit could not create `.git/index.lock` inside the managed sandbox | 1 | No staging or commit occurred; rerun the exact scoped git add/check/commit outside the sandbox. |
| Phase 4.5 documentation boundary tests could not spawn Node test workers in the managed Windows sandbox (`spawn EPERM`) | 1 | No test file executed and no repository file changed; record the platform limitation and rerun the exact read-only focused tests with approved escalation. |

## Current status

`F2B_LOCAL_PASS / CLOUD_NO_LIVE_PENDING / F3_NOT_AUTHORIZED`
