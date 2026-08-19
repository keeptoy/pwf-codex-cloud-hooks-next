# Task Plan: Phase 4 F3C4 aggregate closure Discovery

## Goal

在 current exact HEAD上对账 F3C1 no-live、F3C2 smart rollback/recovery 与 F3C3 autonomous rollback/recovery，冻结
F3C4 aggregate closure的最小实现、证据边界、对象生命周期和退出条件。只做 Release-excluded Discovery与历史状态补录，
不实施 aggregate PASS、不删除 refs、不修改 production/contracts/Release bytes。

## Next Step

等待维护者另行决定是否授权 Phase 4.11冻结的最小 F3C4 closure implementation；不得自行写 aggregate PASS、删除 refs或
进入 Phase 4 closeout/Phase 9。F3C4若获授权，必须包含第一轮 retirement inventory，但不等于批量删除。

## Current Phase

F3C4 Discovery + lifecycle clarification complete；停在 closure implementation授权前

## Phases

### F3C4-D0 — Authority and scope recovery

**Status:** completed

- 恢复 current HEAD、clean worktree、F3C1～F3C3 acceptance、operator status与 Phase 4.9/4.10生命周期约束。
- 为 Phase 4.10补 F3C2/F3C3最小 post-live尾注，不改写原 Discovery/F3C1时间语义。

### F3C4-D1 — Four-record and identity reconciliation

**Status:** completed

- 对账 smart/autonomous rollback/recovered四份 record的 exact source/candidate/accepted/disarm身份与关系字段。
- 对账 Fresh/Resume、legacy profile、activation absence、doctor、backup、residue和 final-exit provenance。

### F3C4-D2 — Residue and lifecycle audit

**Status:** completed

- 复核 development markerless状态、validation refs、temporary evidence/snapshot/package residue与 Release边界。
- 为 refs、guides、validators、history、machine state冻结 KEEP/RETIRE/DEFER与最早复核条件。

### F3C4-D3 — Decision, verification and handoff

**Status:** completed

- 新建 Phase 4.11历史 Discovery，给出 GO/NO_GO、最小 closure方案、停止规则与验证结果。
- 同步 history index与静态守卫；本地 commit后停止，不自动实施 F3C4 closure。

### F3C4-D4 — Version-train and two-review lifecycle clarification

**Status:** completed

- 在 Phase 4.11补“一眼看懂 F3C”，在 Phase 4.10只追加后继导航，避免复制第二份路线说明。
- 在 ROADMAP冻结 Product Phase功能基线、standing Phase 9 accepted baseline与两轮 retirement review的通用关系。
- 修正生命周期措辞：每轮都是强制审查，不是强制删除；按对象 owner、恢复证据与回归价值决定 RETIRE/MIGRATE/KEEP。

## Authorization

- 已授权：只读代码/合同/refs/evidence审计；Phase 4.10 post-live尾注；新建 Phase 4.11 Discovery；planning/history/tests更新；
  相称本地验证与本地 commit。
- 未授权：F3C4 closure implementation或 aggregate PASS；删除/移动 validation refs；修改 production/runtime/installer/
  contracts/manifest/bundle/bootstrap/README/Release bytes；Cloud重跑；push/PR/tag/Release/publication/promotion。

## Stop Conditions

- 四份 record、exact refs、candidate/accepted身份或 Host/probe/final-exit证据出现冲突或缺失。
- current development tree出现未解释的 machine state、snapshot/cache/ZIP/JSON residue或 Release inventory漂移。
- closure需要新 Cloud、evidence schema、Host ABI、trusted graph或 production改动。
- 任一对象无法给出 owner、保留原因和最早 retirement review条件。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 用 `git show ref:path`直接探测应当不存在的 activation 文件时 Git 输出 fatal path-not-found | 1 | 改以 exact `git ls-tree` inventory证明 activation absence；没有 ref或工作树变更 |
| PowerShell解析 `[Linq.Enumerable]::SequenceEqual[byte]` 时在命令执行前报泛型语法错误 | 1 | 改用两个 byte array的 Base64字符串做确定性比较；首轮未生成临时产物或执行审计步骤 |
| PowerShell向 `node -e`传参时剥掉内层引号，Node语法失败但后续构建使整段返回 0 | 1 | 将 attestation审计拆成独立 Python命令并显式检查 `$LASTEXITCODE`；只接受子步骤自己的最终状态 |
| Windows `rg`直接接收 `docs/history/phase-4.*.md` wildcard时把它当成不存在的 literal path | 1 | 改用目录参数与 `-g 'phase-4.*.md'`；没有文件变更 |
| 并行基线中的 Git Bash在受限沙箱无法创建 signal pipe，返回 Win32 error 5 | 1 | 在允许派生进程的环境独立重跑全部 bootstrap `bash -n`并取得 exit code 0 |
| `git for-each-ref`以不存在的中间 ref prefix查询，脚本得到 local/remote 0/0 | 1 | 查询 validation根再按 exact `v0.4.0-dev-*`正则过滤；最终得到 11/11同身份 pairs |
| 首个 residue grep同时匹配 production/tests中的状态文件名常量，不能表示现场 residue | 1 | 改查 `.planning`实际文件 inventory；确认 machine-state文件为 0 |
| Phase 4.11大白话 blockquote用 Markdown双空格强制换行，触发 `git diff --check` trailing-whitespace | 1 | 改成显式空引用行；不改变语义，随后重跑 whitespace与 focused guards |

## Current status

`CONDITIONAL_GO_TO_F3C4_AGGREGATE_CLOSURE / IMPLEMENTATION_NOT_AUTHORIZED / REF_CLEANUP_NOT_AUTHORIZED`
