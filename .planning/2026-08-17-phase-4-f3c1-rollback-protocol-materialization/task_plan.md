# Task Plan: Phase 4 F3C1 rollback protocol materialization

## Goal

按 Phase 4.10 与 exact-HEAD audit 已冻结的路线，物化 Release-excluded F3C rollback protocol：先用 disposable
repository/no-live 测试证明旧版不能直接覆盖 current，再建立 accepted/current 双身份 rollback evidence helper、
自包含 operator guide 与静态守卫。不得修改 production/contracts/Release bytes，也不得进入真实 Cloud rollback。

## Next Step

等待维护者另行授权 F3C4 aggregate closure。F3C3 `A_ROLLBACK`与独立 `A_RECOVER` exact evidence均已通过；未经新授权
不得进入 F3C4或清理 validation refs/lifecycle对象。Release与远端写操作仍禁止。

## Current Phase

F3C3 autonomous rollback/recovery complete; wait before F3C4

## Phases

### F3C1-I0 — Scope recovery and implementation freeze

**Status:** completed

- 恢复 exact HEAD、clean worktree、Phase 4.10 与施工前审计。
- 冻结 Release-excluded/no-live 边界和 F3C1 停止条件。

### F3C1-I1 — Direct-downgrade refusal proof

**Status:** completed

- 构造 disposable current managed install。
- 运行 immutable v0.3.5 installer direct-over-current，要求非零且发生在 backup/write 前。
- 比较 managed runtime、requirements 与 backup inventory，证明无 mutation。

### F3C1-I2 — Rollback evidence protocol

**Status:** completed

- 新增 test-only exact rollback evidence validator，明确 accepted/current 双身份和 installed role。
- 覆盖 disarmed/rollback/recovered stage 的字段关系与拒绝用例，不重载 F3B evidence v1。

### F3C1-I3 — Operator guide and static guards

**Status:** completed

- 新建自包含 F3C operator guide，冻结 committed disarm → current uninstall → immutable v0.3.5 clean install → current recovery。
- 明确 runtime-only revival 只允许 disposable no-live negative；禁止 direct downgrade、自动 token 删除与 cache 充当证据。
- 补 repository/static guards 和对象生命周期账本。

### F3C1-I4 — Verification and closeout

**Status:** completed

- 跑 focused/full regression、importer/syntax/deterministic ZIP 与 Release-boundary 检查。
- 回补 Phase 4.10 post-implementation status；本地提交后停止，等待 F3C2 单独授权。

### F3C1-I5 — Ref-aware Linux/no-live acceptance

**Status:** completed

- 在 GitHub 完整 clone 的 exact checkout `cdc4a9eba7e7f1f2545723829ed1a6b4c76cb48b` 执行 operator guide 第 3 节。
- 校验 immutable `v0.3.5` / `v0.3.4` tags 指向 provenance 冻结的 source commits。
- 两个 smart/autonomous runtime-only revival case 均实际运行；13/13 pass、0 fail、0 skipped、final exit code 0。

### F3C1-I6 — Operator guide novice handrail

**Status:** completed

- 明确第 3 节属于 F3C1，第 4～9 节属于需单独授权的 F3C2/F3C3 live，第 10 节只是停止/交接规则。
- 增加 F3C2 `S_ROLLBACK` / `S_RECOVER` 大白话流程和每轮唯一执行顺序。
- 解释 current tests 与 historical tags 的职责，并给出 full clone、exact checkout、tag/source identity前置核对。

### F3C1-I7 — Fresh Cloud Skill prerequisite repair

**Status:** completed

- 把 pinned pristine Skill bootstrap纳入第 5 节唯一 transaction，放在第一次 current installer调用之前。
- 明确只允许 bootstrap `skill`，禁止用 `all` 提前改变 Managed Hooks installed state。
- 记录外部 `S_ROLLBACK` transaction已通过，但 Fresh/Resume/verifier/evidence尚未完成，不能宣称 stage PASS。

### F3C2-E1 — Smart accepted rollback

**Status:** completed externally by maintainer

- `S_ROLLBACK` transaction、Fresh、real Resume、只读 verifier 和 rollback evidence 全部取得明确 exit code 0。
- 最终 installed role/version 为 accepted `0.3.5`，repository state 为 `smart_prepared`，effective profile 为 legacy；
  doctor healthy、snapshot leftovers 0，activation 未复活。

### F3C2-E2 — Smart exact-current recovery

**Status:** completed externally by maintainer

- 从同一个 exact smart disarm HEAD 新建独立 Cloud task，先经过 accepted predecessor，再恢复 exact current candidate。
- Fresh/Resume、只读 verifier 和 recovered evidence 全部通过；最终 current `0.4.0-dev` 仍使用 legacy，activation未复活，
  doctor healthy、backup verified、snapshot leftovers 0，所有最终 exit code为 0。

### F3C2-E3 — Smart live evidence closeout

**Status:** completed

- 将 rollback + recovery exact evidence写入版本 acceptance，并在 operator guide增加不改写旧时间语义的 post-run尾注。
- 同步 ROADMAP、活动 planning与静态治理守卫；停止在 F3C3 前。

### F3C3-P0 — Autonomous live current-HEAD preflight

**Status:** completed

- 只读核对 exact autonomous disarm ref、prepared state、activation absence、attestation/nonce/zero-ledger。
- 核对 protocol/current/accepted identities、deterministic candidate、operator A rows与 evidence helper关系。
- 只输出 GO/NO_GO并停止；不执行 Cloud transaction或任何 ref/workspace mutation。
- 结论：exact state、双身份、candidate和协议均无漂移，`GO_TO_F3C3_AUTONOMOUS_LIVE`；Cloud仍未运行。

### F3C3-P1 — Autonomous live operator walkthrough hardening

**Status:** completed

- 在共用 rollback operator guide中增加与 F3C2 对称的 `A_ROLLBACK` / `A_RECOVER` 大白话操作路线，不复制 transaction。
- 冻结 autonomous prepared残留对象的 inert语义，并把 nonce、Plan SHA与 ledger renderer全部纳入 Fresh/Resume和只读 verifier负向检查。
- 保持 `A_ROLLBACK` 未运行和独立授权边界；文档完善不等于 Cloud stage PASS。

### F3C3-E1 — Autonomous accepted rollback

**Status:** completed externally by maintainer

- exact `A_ROLLBACK` transaction完成 current-owned uninstall与 immutable accepted `v0.3.5` clean install；backup verified。
- 新 Fresh与同任务 real Resume均保持 legacy，nonce/Plan-SHA/ledger renderer未泄漏；只读 verifier确认
  `autonomous_prepared`、activation absent、doctor healthy与零 snapshot residue。
- `profile=autonomous`、`stage=rollback` evidence通过 exact helper与最终 exit code检查；停止在 `A_RECOVER` 前。

### F3C3-P2 — Host observation omission handrail

**Status:** completed

- 在第 7 节增加 Fresh与 real Resume分别可复制的 ledger漏答补问模板；主观察提示词与 evidence schema不变。
- 补问仅允许在同一个 Cloud task复核上一条实际 Host注入；不能运行工具、覆盖原报告或用 expected profile补猜。
- 当前 programme状态不变；仍停止在另行授权的 `A_RECOVER` 前。

### F3C3-E2 — Autonomous exact-current recovery

**Status:** completed externally by maintainer

- 从同一 exact autonomous disarm HEAD建立独立 Cloud task，transaction经 accepted predecessor恢复 exact current `0.4.0-dev`。
- Fresh与同任务 real Resume保持 legacy且无 nonce/Plan-SHA/ledger renderer；只读 verifier确认 current role、
  `autonomous_prepared`、activation absent、doctor healthy、backup verified与零 residue。
- `profile=autonomous`、`stage=recovered` evidence通过 exact helper，verifier与 validator final exit code均为 0。

### F3C3-E3 — Autonomous live evidence closeout

**Status:** completed

- 将 rollback + recovery exact evidence写入版本 acceptance，并在 operator guide保留 partial stage记录后追加完整 post-run尾注。
- 同步 ROADMAP、活动 planning与静态治理守卫；F3C3 PASS并停止在另行授权的 F3C4前。

## Authorization

- 已授权：F3C1 Release-excluded protocol/operator/helper、disposable repository/no-live tests、planning/history/static guards、
  相称验证和本地 commit。
- 维护者已另行授权并亲自执行 F3C2 smart live；本地智能体只接收证据并维护 operator/planning/tests，不代替维护者执行
  Cloud install/uninstall/rollback 或远端写操作。
- 维护者已另行授权并亲自完成 F3C3 `A_ROLLBACK`；本地智能体只接收并同步证据，不代替维护者执行 Cloud transaction。
- 维护者已另行授权并亲自完成 F3C3 `A_RECOVER`；本地智能体只接收并同步证据，不代替维护者执行 Cloud transaction。
- 未授权：F3C4 aggregate closure；生产 runtime/installer/contracts/manifest/bundle/bootstrap/
  README/Release bytes 修改；validation ref 创建/移动；push/PR/tag/Release。

## Stop Conditions

- direct downgrade 发生 backup/write 或 managed-state mutation。
- 当前 installer 无法完成受支持的 current uninstall 或 exact v0.3.5 forward recovery，因而需要生产改动。
- evidence protocol 需要改变 Host ABI、trusted graph、machine contract 或 Release inventory。
- F3B frozen refs、accepted/current immutable identity或工作树出现无法解释的漂移。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell 拼接 active plan 时保留换行，导致 planning 文件路径非法 | 1 | 对 `.active_plan` 使用 `.Trim()` 后重新读取；没有仓库内容损坏 |
| Windows sandbox 运行 Node test runner 时 `spawn EPERM` | 3 | 三轮均分类为测试子进程沙箱限制；用同一命令申请非沙箱执行，不改测试断言 |
| 一次 `Select-String` pattern 末尾转义不完整，PowerShell 报非法 regex | 1 | 改用 `-SimpleMatch` 读取 immutable source；不影响代码或测试 |
| Git Bash 在沙箱中创建 signal pipe时报 Win32 error 5 | 1 | 其他检查继续通过；仅将 bootstrap/guide Bash syntax改到非沙箱环境重跑 |
| F3C 第 5 节在 Fresh Cloud 缺少全局 pristine Skill，current installer fail closed | 1 | 分类为 operator-guide prerequisite defect；将 frozen bootstrap `skill` 子命令纳入 transaction，不修改 installer/runtime |
| Windows sandbox阻止只读 Node审计创建 `git` 子进程，返回 `spawnSync git EPERM` | 1 | 用相同只读命令在沙箱外重跑并通过；未修改 ref或 workspace |

## Current status

`F3C3_AUTONOMOUS_LIVE_PASS / AUTONOMOUS_ROLLBACK_AND_EXACT_RECOVERY_CONFIRMED / STOP_BEFORE_F3C4`
