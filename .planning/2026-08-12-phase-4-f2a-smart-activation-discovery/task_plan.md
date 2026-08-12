# Task Plan: Phase 4 F2A Smart Activation Discovery

## Goal

在已验收的 F1 inactive foundation 上，只读恢复并冻结 F2A smart activation 的用户协议、state admission、
production call edge、失败语义、测试矩阵与退出条件，形成可审查的 `GO / CONDITIONAL_GO / NO_GO`。本轮不实施
smart behavior，不写真实 workspace state，也不进入 F2B。

## Authorization

- Maintainer authorization: 开始 F2 探路；按既定顺序先做 F2A Discovery。
- Authorized: read-only evidence refresh、源码/contract/test/历史文档分析、方案比较、lifecycle ledger、Discovery 文档与本地 commit。
- Not authorized: production/runtime/contract/manifest/Release 行为改动、真实 `.mode` 写入、managed token 生效、nonce/attestation/ledger、Cloud execution、seal、publication、promotion、remote writes。

## Next Step

Discovery 已闭合。停止并等待维护者单独授权 F2A implementation；不得自动修改 production、激活真实
workspace state、进入 F2B/F3 或执行远端动作。

## Stop Conditions

- smart 的用户可见语义存在两条以上安全但明显不同的路线，需要维护者选择。
- F2A 必须读取 nonce/attestation/ledger、执行 workspace/upstream script、写 workspace、扩大 Host event set 或 trusted graph。
- smart 无法只改变 plan 选段，或需要改变 canary/catch-up/Host failure semantics。
- activation token 存在但 state 不完整时无法保持 fail-closed non-injecting。
- 需要 Cloud、真实用户 workspace 或远端变更才能继续冻结设计。

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| P0 Evidence refresh | completed | F1 handoff、Phase 4.1～4.3、current tree 与 worktree 状态恢复 |
| P1 Current/upstream behavior inventory | completed | `.mode` grammar、smart rendering、reader/call edge、writer 与 denied surface 入账 |
| P2 User activation/disarm protocol | completed | prepare/commit/confirm/disarm/re-arm 与非法状态矩阵冻结 |
| P3 Runtime and contract design | completed | producer/runtime capability、state admission、snapshot/rendering、result/advisory 与 lifecycle 接管冻结 |
| P4 Verification and platform split | completed | failing-first、legacy/smart matrix、Linux/local/Cloud/F3 分工、rollback/resume 边界冻结 |
| P5 Decision and closeout | completed | 输出 GO/CONDITIONAL_GO/NO_GO，更新历史摘要/ROADMAP（如确有 programme 变化），本地 commit 并停止 |

## Migration lifecycle ledger

| Object/path/symbol | Current owner/consumer | Discovery action | Required decision/evidence | Review/retirement |
|---|---|---|---|---|
| `.mode` safe reader/normalizer seam | `runtime/owned-plan.py`; unit-only | REPLACE AT F2A | token 与 profile 分离；`.mode` 只在 managed commit point 有效后读取 | F2A 接管并删除同文件 `codex-managed-v1` grammar；F2B 再扩 autonomous |
| `.pwf-codex-managed` activation file | future user-side producer / owned reader | ADD AT F2A | exact bytes、last-write commit、two-pass identity、disarm/re-arm | F2B 复用；protocol v2 或 Phase 4 retirement 时重新审核 |
| adapter `allowed_profiles=[legacy]` | `hooks/hook_adapter.py` | REPLACE AT F2A | 原子改为 `[legacy, smart]`，只表达 capability，不读取 workspace | F2B 才能再次扩展；F2A NO_GO 则保留 legacy |
| owned runtime `SUPPORTED_PROFILES=(legacy,)` | `runtime/owned-plan.py` | REPLACE AT F2A | 精确改为 `(legacy, smart)`；autonomous forged request 仍先拒绝 | F2B 才能再次扩展 |
| production zero-read guards | runtime/tests | REPLACE ONLY WITH STRONGER MATRIX | token 缺失时 `.mode` 零读；token 生效后 exact capture/revalidation；invalid fail closed | 新矩阵通过前不得删除 |
| upstream smart marker tokens | pristine Skill/user writer | KEEP AS UNTRUSTED PROFILE INPUT | old `.mode` 单独存在永不 opt in；managed token 才是 commit point | F2B 扩 grammar；Phase 4 completion review |
| nonce/attestation/ledger/gated | future F2B/Phase8 | KEEP DENIED | F2A source/read/inventory 均应为零 | F2B/Phase8 only |
| `PWF_INJECT` child environment | `runtime/owned-plan.py` → pristine renderer | ADD OWNED VALUE AT F2A | 只由 validated smart decision 写入 private child env；ambient 值继续剥离 | F2B 渲染组合时复核 |
| plan request/result v2 schemas | contracts/adapter/runtime | KEEP | 已预留 smart capability/effective profile/advisory，无需为 F2A 轮转 schema | schema consumer 或语义确实变化时再轮转 |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Combined inventory command referenced absent `runtime/upstream/init-session.sh` and returned exit 1 | 1 | Treated the absence as expected denied-source evidence; all valid scan output retained, subsequent reads use admitted paths only. |
| A disposable smart-render probe hit Windows PowerShell 5 encoding limitations and Git Bash `signal pipe` error 5 | 1 | No product conclusion was drawn; static pristine-source review is sufficient for Discovery and the real renderer matrix is assigned to Linux F2A implementation acceptance. |
| A combined `rg` scan included missing guessed contract/test paths and returned exit 1 after useful matches | 1 | Re-ran targeted reads against the actual `adapter-plan-context-*` and `plan-context-result-*` paths; no repository defect. |
| Sandboxed `npm test` could not spawn any of the 16 test files (`spawn EPERM`) | 1 | Classified as sandbox policy, not assertions; re-ran the identical suite outside the sandbox: 141 tests, 127 pass, 0 fail, 14 honest Windows skips. |

## Current status

`F2A_DISCOVERY / CONDITIONAL_GO / COMPLETE / IMPLEMENTATION_NOT_AUTHORIZED`
