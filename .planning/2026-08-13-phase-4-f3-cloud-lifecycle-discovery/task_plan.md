# Task Plan: Phase 4 F3 Cloud lifecycle Discovery

## Goal

在 F2B local 与 Linux/Source-Candidate/no-live Cloud 均 PASS 的前提下，重新核对真实 Codex Cloud task、Git checkout、
follow-up、container cache、approval 与当前 autonomous state protocol，冻结 F3 可执行验收路线、失败分流、rollback
边界和 `GO/NO_GO` 条件；不创建真实 activation state，不实施 writer，不运行 live activation。

## Authorization

- Maintainer authorization: 时机合适则进入 F3 Discovery。
- Authorized: 官方文档与当前源码/contracts/tests/历史/acceptance 的只读复核；新建本 Discovery planning；必要的
  纯本地静态探针/fixture 分析；形成专项设计、验收矩阵、lifecycle ledger 与路线结论；本地文档验证和 commit。
- Not authorized: 运行真实 Git-backed 或 same-chat activation；创建/修改项目 `.pwf-codex-managed`、`.mode`、`.nonce`、
  `.attestation`、`.plan-attestation` 或 `ledger-*.jsonl`；导入/安装 managed writer；F3 implementation/live gate；
  branch/tag/PR/Release/push、Cloud task 写入、seal、publication、promotion 或 rollback 执行。

## Next Step

等待维护者决定是否授权 `F3A` foundation implementation：只补 Git-backed active-plan state 的仓库准入、prepare/verify
协议、专用验收 runbook 与静态/本地负向测试；不得直接进入 live activation。`F3A` 本地/Linux/no-live 闭合后必须再次
停止，由维护者另行授权 `F3B` live lifecycle；`F3C` rollback 仍是再后一独立 gate。

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| D0 Authority and evidence recovery | completed | F2B/current docs/code/contracts/tests、官方 Cloud/follow-up/cache/approval 与 writer 事实闭合 |
| D1 Route and threat comparison | completed | Git-backed、same-chat、local/manual、external callback 的能力/风险/失败分流完成 |
| D2 F3 gate and test design | completed | Fresh/Resume/cache/disarm/re-arm/tamper/rollback 矩阵、身份与证据 schema 冻结 |
| D3 Lifecycle and decision | completed | producer/consumer/state/commit/cache/rollback 对象有 owner、退出条件与明确结论 |
| D4 Documentation and verification | completed | Phase 历史摘要、ROADMAP/acceptance 必要校准、边界测试与本地 commit 闭合 |

## Stop Conditions

- 需要在 Discovery 中创建或激活真实 autonomous state；
- 需要把 Cloud approval、environment variable、secret、cache 或模型声明冒充 plan-local user consent；
- 需要依赖未提交 worktree 在 Fresh/container rebuild 后保持，或无法绑定 exact commit/plan/task digest；
- 需要把 upstream writer 加入 managed trusted graph，或新增 Host event/schema/managed writer 而未另开 implementation gate；
- 需要执行 push/PR/merge/Release/rollback 或改变远端/已发布资产；
- 官方资料与实际 Cloud 事实冲突，或两条路线出现新的权限/identity/atomicity 模型而未暂停复核。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Official-domain search initially returned generic Codex use-case/model pages rather than the Cloud lifecycle pages | 1 | Opened the known official Codex Cloud and Cloud environments routes directly, then fetched the exact follow-up/cache passages. |
| Direct web opens of pinned GitHub raw/tree endpoints returned no readable body in the browsing tool | 1 | Downloaded the manifest-pinned v3.8.2 archive read-only to a temporary directory, verified its exact archive SHA-256, and inspected the canonical Skill subtree locally. |
| `node --test` could not spawn its Windows test-runner worker in the workspace sandbox (`spawn EPERM`) | 1 | Classified as a harness/sandbox limitation before any assertion ran; reran the same test files directly in single processes. |
| Initial local commit attempt could not create `.git/index.lock` under workspace permissions | 1 | No partial commit was created; retry the same exact file set with local Git write escalation. |

## Current status

`F3_DISCOVERY_COMPLETE / CONDITIONAL_GO_TO_F3A / F3A_IMPLEMENTATION_NOT_AUTHORIZED / LIVE_ACTIVATION_NOT_AUTHORIZED`
