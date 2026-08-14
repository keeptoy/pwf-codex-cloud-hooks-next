# Task Plan: Phase 4 F3B2 smart live chain

## Goal

在不污染 `0.4.0-dev`、不改变 production/contract/Release bytes 的前提下，建立可审计的 markerless runtime source
与隔离 `S_PREP → S_ARM → S_DISARM → S_REARM` 提交链，完成本地验证并把 exact refs/配置交给维护者执行真实
Cloud Fresh、UserPrompt、Resume、disarm/re-arm 验收。

## Authorization

- 维护者已明确授权进入 F3B2 smart live gate。
- 已授权：官方 Cloud lifecycle 事实复核；programme/acceptance/planning 状态同步；markerless foundation；只存在于
  `validation/*` refs 的 smart `.mode` / `.pwf-codex-managed` 状态；本地提交、测试、candidate hash 复核和精确 Cloud 交接。
- 未授权：F3B3 autonomous、tamper、F3B4 收口、F3C rollback、production/runtime/contracts/bundle/Release bytes 变更；
  push、PR、tag、Release、Cloud environment 远端配置或任何其他远端写入。

## Next Step

提交 markerless F3B2 foundation，然后从该 exact baseline 在隔离 worktree 建立并验证 smart validation chain。

## Current Phase

F3B2-2 isolated smart DAG

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| F3B2-0 Evidence recovery | completed | 官方 Cloud lifecycle、F3B1 runbook、当前 refs/stop line 与工作树恢复完成 |
| F3B2-1 Markerless foundation | completed | programme/acceptance/planning 同步；active scope exact legacy；focused/full regression 与 candidate identity 闭合 |
| F3B2-2 Isolated smart DAG | in_progress | 四个 local validation refs 满足 direct-parent、exact-path 与 smart state guard |
| F3B2-3 Local verification | pending | focused/full tests、deterministic candidate hash、markerless dev branch 与 Release exclusion 闭合 |
| F3B2-4 Cloud handoff | pending | exact runtime/workspace refs、push/config/task 顺序与停止条件交给维护者；停在真实 Cloud evidence 前 |
| F3B2-5 Live evidence closure | pending | 维护者回传四阶段 Fresh/UserPrompt/real Resume/doctor/inventory/residue/final-exit evidence 后才可判定 PASS |

## Frozen boundaries

1. `0.4.0-dev` 始终 markerless；真实 state 只在隔离 validation refs，永不 merge 回开发分支。
2. runtime source HEAD 与 workspace lifecycle HEAD 分开记录；candidate SHA 是外部 expected input，不能由 transaction 自证。
3. `S_PREP` 只新增 `.mode=inject-smart\n`；`S_ARM` 只新增 smart activation；`S_DISARM` 只删除 activation；
   `S_REARM` 只重新新增相同 activation。
4. Cloud agent 只读验证，不 commit、push、PR、移动 ref 或自动修复。维护者负责远端 refs 与 environment 配置。
5. 每个长命令必须取得工具返回的最终 exit code；否则只能记为 `INCOMPLETE/UNKNOWN`。
6. 任一步失败立即停止；不得进入 F3B3 autonomous 或 F3C rollback。

## Stop Conditions

- development branch 或 active scope 出现 validation-only machine state。
- 任一 validation commit 的 parent 或 exact changed-path 集合不符合 frozen DAG。
- candidate bytes/hash、production trusted graph、runtime inventory 或 Release boundary 发生变化。
- Cloud 无法固定 exact runtime/workspace identity，setup/maintenance 不能完成同一 exact transaction，或 Fresh/Resume
  证据必须依赖 cache、模型口述或 partial stdout。
- 需要 Host event、managed writer、secret/callback、新 supply-chain 文件或远端自动写入才能继续。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Windows sandbox blocked Node test-runner child creation with `spawn EPERM` before any test body ran | 1 | Classified as execution-environment limitation; rerun the identical focused command with approved non-sandbox execution, without weakening assertions. |
| First non-sandbox focused run found one ROADMAP lifecycle assertion drift: the rewritten current boundary no longer contained `F1 foundation ... complete` on one line | 1 | Restored the already-true completed foundation summary in the current programme row; kept the new F3B2 authorization and denial boundaries unchanged. |

## Current status

`F3B2_AUTHORIZED / MARKERLESS_FOUNDATION_VERIFIED / SMART_DAG_NEXT / F3B3_NOT_AUTHORIZED / REMOTE_WRITES_MAINTAINER_ONLY`
