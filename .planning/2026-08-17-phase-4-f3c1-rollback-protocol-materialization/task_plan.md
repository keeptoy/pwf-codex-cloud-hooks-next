# Task Plan: Phase 4 F3C1 rollback protocol materialization

## Goal

按 Phase 4.10 与 exact-HEAD audit 已冻结的路线，物化 Release-excluded F3C rollback protocol：先用 disposable
repository/no-live 测试证明旧版不能直接覆盖 current，再建立 accepted/current 双身份 rollback evidence helper、
自包含 operator guide 与静态守卫。不得修改 production/contracts/Release bytes，也不得进入真实 Cloud rollback。

## Next Step

等待维护者另行明确授权 F3C2 smart live。F3C1 已完成 ref-aware Linux/no-live 验收；在新授权前不得执行
operator guide 的 live install/uninstall/rollback stages，也不得自动进入 F3C2。

## Current Phase

F3C1 protocol/no-live complete; stop before F3C2

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

## Authorization

- 已授权：F3C1 Release-excluded protocol/operator/helper、disposable repository/no-live tests、planning/history/static guards、
  相称验证和本地 commit。
- 未授权：真实 Cloud install/uninstall/rollback；生产环境或用户 workspace mutation；validation ref 创建/移动；
  production runtime/installer/contracts/manifest/bundle/bootstrap/README/Release bytes 修改；F3C2/F3C3；push/PR/tag/Release。

## Stop Conditions

- direct downgrade 发生 backup/write 或 managed-state mutation。
- 当前 installer 无法完成受支持的 current uninstall 或 exact v0.3.5 forward recovery，因而需要生产改动。
- evidence protocol 需要改变 Host ABI、trusted graph、machine contract 或 Release inventory。
- F3B frozen refs、accepted/current immutable identity或工作树出现无法解释的漂移。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell 拼接 active plan 时保留换行，导致 planning 文件路径非法 | 1 | 对 `.active_plan` 使用 `.Trim()` 后重新读取；没有仓库内容损坏 |
| Windows sandbox 运行 Node test runner 时 `spawn EPERM` | 2 | 两轮均分类为测试子进程沙箱限制；用同一命令申请非沙箱执行，不改测试断言 |
| 一次 `Select-String` pattern 末尾转义不完整，PowerShell 报非法 regex | 1 | 改用 `-SimpleMatch` 读取 immutable source；不影响代码或测试 |
| Git Bash 在沙箱中创建 signal pipe时报 Win32 error 5 | 1 | 其他检查继续通过；仅将 bootstrap/guide Bash syntax改到非沙箱环境重跑 |

## Current status

`F3C1_PROTOCOL_NO_LIVE_PASS / REF_AWARE_LINUX_ZERO_SKIP / CLOUD_ROLLBACK_NOT_RUN / STOP_BEFORE_F3C2`
