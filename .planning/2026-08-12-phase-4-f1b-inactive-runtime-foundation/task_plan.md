# Task Plan: Phase 4 F1B Inactive Runtime Foundation

## Goal

在 F1A 的 schema4/bundle-v2/Release-v2 基线上，原子轮转 plan request/result v2，并加入只可通过受控 unit seam 调用的 owned state reader/normalizer；production producer policy 与 runtime capability 都只能是 `legacy`，必须在任何 mode/nonce/attestation/ledger capture 前短路，保持现有 Host 输出与 managed-legacy 行为不变。

## Authorization

- Maintainer authorization: 继续 F1B。
- Authorized: F1B plan contracts、adapter/owned-plan inactive foundation、state reader/normalizer、bundle/manifest/Release hashes、installed-state transition 更新、nearest/full local tests、current docs、local commit。
- Not authorized: F2A/F2B activation、真实 workspace state 写入、managed token 生效、smart/autonomous/gated production behavior、新 Host event、persistent cache、Cloud execution、seal、publication、promotion、remote writes。

## Next Step

完成 P0 exact producer/consumer/state-surface inventory，恢复 Phase 4.1/4.3 冻结的 v2 shape；随后先写 failing-first plan-v2、legacy zero-read、forged-profile refusal 与 state-reader unit seam tests。

## Stop Conditions

- F1B 本地实现、验证和单一 commit 后停止，不自动进入 F2A。
- 如必须保留 current plan-v1/v2 双 loader、改变现有 Host output/canary/catch-up order、读取 production marker、写 workspace、增加 Host event/persistent cache/upstream writer，立即停止并重开 Discovery。
- 如无法用 current exact installed state 和 v0.3.5 predecessor 精确迁移，收缩为 uninstall -> clean install，不放宽 unknown-state admission。
- 本轮不执行 Cloud、seal、publication 或任何远端写入；这些需要维护者后续单独授权。

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| P0 Evidence refresh and lifecycle inventory | completed | v1 producers/consumers、state surface、hash/installed transition 全部入账 |
| P1 Failing-first v2 and zero-read tests | completed | exact v2、forged profiles、legacy zero-read、state seam 红灯成立 |
| P2 Contract/runtime implementation | completed | schemas、adapter、owned-plan/state helper 原子切换，production legacy-only |
| P3 Supply-chain and installed transition closure | completed | bundle/manifest/Release/hashes 与 accepted predecessor 迁移闭合 |
| P4 Full validation and lifecycle reconciliation | completed | focused/full suite、golden parity、deterministic ZIP、syntax/mode/residue scans 通过 |
| P5 Local commit and stop | completed | 独立 commit，工作树干净，F2A 未授权 |
| P6 Cloud acceptance handoff calibration | completed | v0.4.0-dev acceptance 增量准确覆盖 F1B，聚焦文档验证通过，独立本地文档 commit |

## Migration lifecycle ledger

| Object/path/symbol | Producer/consumer/owner | Action | Gate/window | Required proof | Post-gate state | Review/retirement |
|---|---|---|---|---|---|---|
| plan request v1 schema/path | adapter + owned-plan + tests | REPLACE — CLOSED | F1B | exact v2 and absence guard passed | current v2 only; predecessor/history retain v1 evidence | next plan schema gate |
| plan result v1 schema/path | owned-plan + adapter + tests | REPLACE — CLOSED | F1B | relational result tests passed | current v2 only; predecessor/history retain v1 evidence | next plan schema gate |
| request `policy.behavior_profile` constant | adapter/owned-plan | REPLACE — CLOSED | F1B | ordered profiles + forged profile zero-read refusal passed | producer/runtime capability both legacy-only | F2A expands only with new authorization |
| owned state reader/normalizer | owned-plan owner | ADD INACTIVE — CLOSED | F1B | bounds/UTF-8/link/race/grammar tests; Linux cases defined | installed but no production call edge | F2A reviews activation call edge |
| `.mode`/nonce/attestation/ledger production reads | none in current managed path | DENY/KEEP UNREACHABLE — CLOSED | F1B | static one-definition proof + patched capture tests | `.mode` seam inactive; nonce/attestation/ledger readers absent | F2 activation only |
| adapter/owned-plan hashes | bundle + manifest | REPLACE — CLOSED | F1B | raw hash, install/doctor and manifest chain passed | new current leaves | every runtime change |
| installed plan ABI file paths | bundle/install transition | REPLACE — CLOSED | F1B | exact v0.3.5 takeover retires superseded paths | current v2 paths only | next plan schema gate |
| F1A current installed state | development checkpoint only | DO NOT ADMIT | F1B | accepted-window assertion remains singular | not a compatibility contract; clean reinstall if locally installed | no lifecycle beyond this development gate |
| v0.3.5 predecessor profile | installer transition owner | KEEP if exact and non-ambiguous | F1B | direct accepted -> F1B migration | accepted support window | accepted promotion, no later than F3/Phase 9 |
| smart/autonomous/gated tokens and behavior | future F2 owners | DEFER/DENY | F2A/F2B/Phase8 | non-injecting tests in F1B | no production behavior | respective future gate |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Windows sandbox blocked Node test-runner child creation with `spawn EPERM` | 1 | Re-ran the focused command outside the sandbox; obtained the intended six product red failures. |
| Full suite exposed superseded v1 ABI files surviving exact v0.3.5 takeover | 1 | Installer now derives exact retired paths only after full predecessor validation, backs up, retires them, then writes v2; cross-version oracle is green. |
| Cloud handoff governance test still required “F1B not authorized” after F1B completion | 1 | Advanced the lifecycle guard to require that F2A/F2B activation remains unauthorized. |

## Current status

`F1B_LOCAL_CHECKPOINT_COMPLETE / CLOUD_HANDOFF_READY / F2A_NOT_AUTHORIZED`
