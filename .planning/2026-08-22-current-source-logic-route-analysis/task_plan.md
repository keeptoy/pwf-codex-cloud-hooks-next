# Task Plan: Current source logic and route analysis

## Goal

持久化当前工作区的源码、契约、安装、运行时、Release 与 programme 路线分析，使后续会话可以从一份准确的只读审阅基线继续。

## Next Step

等待维护者决定是否为 active-pointer 关闭语义、uninstall ownership admission 或后继 Product Phase 另开专项 Discovery；当前不实施任何修复或新功能。

## Current Phase

Phase 5 complete / analysis persisted / follow-up undecided

## Phases

### Phase 1: Authority and lifecycle recovery

- [x] 按 README → ARCHITECTURE → DESIGN → ROADMAP 恢复文档权威。
- [x] 读取 Phase 9 task plan、findings 与 progress，并按维护者说明确认其已经关闭。
- [x] 保护既有未提交 `.planning` 删除，不覆盖或混入本任务。
- **Status:** complete

### Phase 2: Source and contract inventory

- [x] 盘点 production runtime、installer、importer、Release builder、bootstrap、contracts 与 tests。
- [x] 确认 manifest、runtime bundle、installed manifest 与 Release artifact 的唯一职责。
- [x] 确认四个 upstream runtime 文件保持 pinned v3.8.2 pristine。
- **Status:** complete

### Phase 3: Runtime and installation flow analysis

- [x] 追踪 adapter → owned-plan → owned-catchup 的事件与失败路径。
- [x] 核对 legacy、smart、autonomous 的 activation-first admission 与 disarm 语义。
- [x] 核对 install、doctor、repair、predecessor transition、bootstrap 和 deterministic ZIP 路径。
- **Status:** complete

### Phase 4: Verification and risk review

- [x] 运行完整 Windows 回归和静态检查。
- [x] 重建/check 当前 deterministic Release ZIP。
- [x] 分类平台限制、工作树现状和需要后继 Discovery 的边界问题。
- **Status:** complete

### Phase 5: Persistence and handoff

- [x] 把分析结论写入 findings.md。
- [x] 把执行与验证证据写入 progress.md。
- [x] 将 `.planning/.active_plan` 显式切换到本分析记录。
- **Status:** complete

## Key Questions

1. 当前产品和 Release 状态是什么？
   - `v0.4.0` 已 accepted/Latest；Phase 4 与本列车 P9-A～P9-F 已关闭；后继列车未命名、未授权。
2. 当前实现的唯一核心权威在哪里？
   - plan selection 在 `owned-plan.py`；transcript/catch-up 在 `owned-catchup.py`；runtime source/install inventory 在 runtime bundle；ZIP inventory 在 Release artifact。
3. 下一条路线是否已经确定？
   - 没有。Phase 5～8 是候选，不是承诺；任何后继工作都必须先进入独立 Discovery。

## Decisions Made

| Decision | Rationale |
|---|---|
| 将本次工作保持为只读分析与 planning 持久化 | 用户没有授权 production、contract、Release 或远端变更 |
| 新建独立 scoped plan，不回写已关闭 Phase 9 计划 | 保留 Phase 9 的时间语义，避免把新分析伪装成 Release gate 延续 |
| 显式切换 `.active_plan` | planning-with-files Hook 只读取既有指针，不会从对话主题自动切换 |
| 把 uninstall 边界记为待 Discovery 问题而非已确认缺陷 | 静态代码显示其未复用 install admission，但是否把固定 runtime 目录整体视为 owned 仍需专门冻结合同和负向测试 |

## Authorization

- 已授权：持久化当前分析；创建 scoped planning 记录；更新 `.planning/.active_plan`；相称验证；仅提交这些 planning 变更。
- 未授权：修改 production、contracts、manifest、runtime、bootstrap、Release、Cloud、远端 refs 或后继版本身份。

## Stop Conditions

- 任何动作需要修改 production/runtime、Host ABI、trusted graph、Release input 或公开资产。
- 新 planning 与用户已有大量 `.planning` 删除发生重叠，或无法单独暂存提交。
- 在维护者决定目标前命名后继版本列车或进入 Phase 5～8 实施。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell 默认输出编码使首次 README 中文显示乱码 | 1 | 后续读取显式设置 UTF-8；未修改文件 |
| Windows `rg tests\\*.test.js` 把 glob 当作非法字面路径 | 1 | 改用 `rg -g '*.test.js'` |
| 沙箱内 Node test runner 对 19 个 test file 均报 `spawn EPERM` | 1 | 在获准的正常进程环境重跑，取得 177 tests / 0 fail 的真实结果 |
| 沙箱内 Git Bash 无法创建 signal pipe，报 Win32 error 5 | 1 | 在获准的正常进程环境重跑 `bash -n` 并通过 |

## Current Status

`SOURCE_LOGIC_ROUTE_ANALYSIS_PERSISTED / NO_PRODUCTION_CHANGE / FOLLOW_UP_DISCOVERY_UNDECIDED`
