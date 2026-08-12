# Task Plan: Phase 4 F2 opt-in surface review

## Goal

在不实施 F2A 的前提下，补正 Phase 4.1 的后继状态，并区分 Host trust/registration、Codex action approval 与
PWF product opt-in；评估本地 CLI、Cloud 后台任务和未来外部确认链接能否共享同一授权语义。

## Authorization

- Maintainer authorization: 只做 Phase 4.1 尾注与 opt-in/授权调研，明确暂停施工。
- Authorized: repository/official-doc evidence review、历史尾注、ROADMAP 边界校准、planning 记录、本地验证与 commit。
- Not authorized: runtime/contract/installer/Release 改动、真实 activation state、Cloud execution、外部服务、发布或远端写入。

## Next Step

调研与文档同步闭合后停止；等待维护者决定是否授权 F2A implementation。

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| P0 Evidence refresh | completed | 仓库 lineage、F2A Discovery 与官方本地/Cloud 权限事实恢复 |
| P1 Surface separation | completed | Host trust、action approval、product opt-in 三层边界冻结 |
| P2 Local/Cloud protocol review | completed | 可移植核心、Cloud 未证事实、privacy 与 URL 路线归类 |
| P3 Documentation sync | completed | Phase 4.1 尾注、ROADMAP 与本 scope 证据同步 |
| P4 Validation and closeout | completed | 文档检查、相称回归、本地 commit 后停止 |

## Lifecycle ledger

| Object/concept | Owner | Action | Evidence/exit | Re-review |
|---|---|---|---|---|
| `.pwf-codex-managed` | PWF product protocol | KEEP as non-secret plan-local commit point | 与平台 permission 解耦；F2A tests 证明 exact/last-write | F2B protocol extension；Phase 4 retirement |
| CLI approval policy | Codex Host/user | OBSERVE, do not consume as product state | 只决定 command 是否可执行，不持久化 smart selection | 官方 Host 提供可验证 consent ABI 时重审 |
| Cloud result/follow-up workflow | Codex Cloud/user | DEFER lifecycle proof to F3 | Fresh/Resume/cache/opt-out 真机矩阵 | F3 Discovery/acceptance |
| click-to-activate URL | absent external authority | NO_GO for current F2 | 无官方回调可原子绑定 user/plan/commit/state | 只有出现 authenticated, bounded Host consent/callback ABI 才重开 Discovery |
| activation secrets/env vars | Cloud environment/Host | REJECT as product opt-in | secret 在 agent phase 不可见；env 作用域不是 plan-local | 不复审，除非 Host lifecycle contract 改变 |

## Stop Conditions

- 需要新增外部服务、网络 ingress/callback、身份系统或新的 Host ABI。
- 需要声称 Cloud workspace/follow-up 持久性，而尚无 live evidence。
- 任何方案要求把 secret、用户身份或授权码写入 activation file、Hook stdout 或模型上下文。

## Current status

`DISCOVERY_DOCUMENTATION_ONLY / COMPLETE / F2A_IMPLEMENTATION_PAUSED`
