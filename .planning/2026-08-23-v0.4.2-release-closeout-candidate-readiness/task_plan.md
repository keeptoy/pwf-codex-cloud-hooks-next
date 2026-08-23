# Task Plan: v0.4.2 Release closeout / candidate-readiness

## Goal

不创建 standing Phase 9，按版本无关 Release closeout workflow 完成 `v0.4.2` 的第一退役检查点、候选身份物化、本地验收和 Source/Candidate Cloud 教程准备，并停止在维护者 push/Cloud 之前。

## Next Step

维护者审核并push本地C0 commit；在全新Cloud按`docs/v0.4.2-cloud-hard-acceptance.md`执行Source/Candidate，回传exact HEAD与原始证据。停止在Cloud结果写回前。

## Current Phase

Phase 5 / maintainer push and Source/Candidate Cloud pending

## Phases

### Phase 1: Authority recovery and candidate boundary

- [x] 按 AGENTS 顺序恢复 README、ARCHITECTURE、DESIGN、ROADMAP 和当前 planning。
- [x] 复核 v0.4.2 的实际 delta、Release allowlist、版本身份与停止条件。
- **Status:** complete

### Phase 2: Candidate-readiness retirement checkpoint

- [x] 对施工 planning、临时对象、旧证据依赖和版本窗口对象作 RETIRE/MIGRATE/KEEP 判断。
- [x] 只实施能在 C0 前安全闭合且不损坏 immutable recovery 的最小退役事务。
- **Status:** complete

### Phase 3: Atomic v0.4.2 candidate materialization

- [x] 同步 CHANGELOG、ROADMAP candidate authority、package、Release/transition contracts、manifest hashes 和 bootstrap。
- [x] 新建 single-Discovery `v0.4.2` Cloud hard acceptance/operator guide，保持真实证据 PENDING。
- [x] 更新直接相关 tests，不修改无需求依据的 production/runtime 核心逻辑。
- **Status:** complete

### Phase 4: Local validation and handoff

- [x] 运行风险相称的 focused checks、完整 suite、Release build/check 和 deterministic double build。
- [x] 写回 planning 与第一检查点状态，并准备范围单一的本地C0 commit。
- [x] 停止在 Source/Candidate Cloud 前，准备向维护者交接精确commit、教程和待push动作。
- **Status:** complete

### Phase 5: Source/Candidate channel checkpoint

- [ ] 维护者push并在独立Fresh Cloud完成4.1、B～E与9.1。
- [ ] 核对exact C0 HEAD、Linux零skip、ZIP identity、lifecycle、doctor/inventory/policy/residue原始证据。
- [ ] 真实PASS后才追加guide channel checkpoint并创建C1；否则按首次错误停止。
- **Status:** pending

## Authorization

- 已授权：按已讨论并冻结的版本无关 Release closeout 路线继续下一步；创建活动计划，完成 candidate-readiness、v0.4.2 候选身份与本地/Cloud教程准备，并创建本地 commit。
- 未授权：push、远端 branch/tag、Pre-release/Release、资产上传、Cloud task、Latest、部署或填写未发生的 PASS/URL/SHA。

## Stop Conditions

- 不创建或恢复 Phase 9/P9-A～F；第 9 节只是 ROADMAP 的通用 Release 章节。
- Source/Candidate Cloud 未真实通过前，不创建正式验收 tag，也不把 guide 的 Cloud 状态写成 PASS。
- public assets 不存在前，不写 Published Release/provenance/Latest 证据。
- 任一身份或 contract 变化必须保持 allowlist、hash、transition 与 tests 原子闭合。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Windows sandbox拒绝Node test runner创建子进程：`spawn EPERM` | 1 | 改用直接执行单个test文件取得failing-first语义；完整runner在允许子进程的本地验证阶段重跑。 |
| PowerShell不接受Bash式`||`状态检查 | 1 | 改用PowerShell原生`$LASTEXITCODE`分支；不重复原命令。 |
| Windows sandbox阻止Git Bash创建signal pipe（Win32 error 5） | 1 | 仅为本地Bash语法检查申请允许子进程的执行面；不把Git Bash结果冒充Linux证据。 |

## Current Status

`V0_4_2_LOCAL_CANDIDATE_READY / SOURCE_CANDIDATE_NOT_RUN / STOP_BEFORE_MAINTAINER_PUSH`
