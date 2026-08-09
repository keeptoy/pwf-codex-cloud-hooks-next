# Progress: Architecture Background Review

## 2026-08-09

- 使用 planning-with-files session catch-up；无未同步输出。
- 按规定完整读取 README、ARCHITECTURE、DESIGN、ROADMAP，并恢复前一活动 planning；前一计划已完成，
  没有剩余行动。
- `git status --short --branch` 显示分支 `0.3.2-dev` 与远端同步，工作树干净。
- 新建本只读架构调研 scope；除 `.planning/.active_plan` 与本 scope 三文件外不授权任何写入。
- 记录两次无副作用的读取错误：README 编码显示和 PowerShell `Join-Path` 参数形式；均已改用安全读法。
- 枚举全部 tracked implementation paths，并读取 package/upstream identity、Host request/result、runtime
  bundle、overlay 和 Release artifact contracts；聚合输出中一处 JSON 被工具截断，后续按文件分读，
  不把截断片段当作完整 contract 证据。
- 单独完整重读 `adapter-runtime-request-v1.schema.json` 与 `runtime-bundle-v1.json`，补齐聚合输出中被截断的
  event/project/transcript 关系约束和 installed inventory/deferred candidates。
- 统计七个关键实现文件规模并枚举顶层符号，建立 runtime、installer 与 supply-chain plane 的源码阅读
  路由；尚未据函数名推断字段级行为，下一步读取关键实现区段。
- 完整分段读取 `hook_adapter.py`，确认 typed relational validation、bounded child supervision、严格串行
  调度、canary/catch-up/plan 组合顺序和 advisory failure 降级均与架构文档一致。
- 读取 `owned-plan.py` 前 650 行，确认 exact child-side validation、最小环境/进程监督、openat 安全读取、
  session attachment 与 canonical resolver containment；下一步补齐 snapshot/inject/cleanup 主路径。
- 完整读完 `owned-plan.py`，确认 private snapshot、重复目录身份校验、bounded stale cleanup 和最终清理；
  开始读取 `owned-catchup.py`，已覆盖 exact request 与 transcript 资源上限。
- 完整读完 `owned-catchup.py`，确认 immutable verified transcript、Host-first/fallback 选择、session/project
  identity、fail-closed parser、Cloud event normalization、dedup 与 report budgets。
- 读取 `install.js` 前 540 行，确认 source hash/inventory、pristine Skill discovery、shared-state fingerprint、
  atomic write、Managed requirements ownership parser/merge、hooks/trust state 与 manifest inspection 前半。
- 完整读完 installer，确认 doctor drift classification、bounded repair、backup/install/uninstall 所有权；完整
  读取 importer，确认 pinned archive→contract/anchor/hash→exact owned runtime 的确定性构建链。
- 完整读取 patcher 与 Release builder，确认四 anchor overlay 复现、global Skill/owned copy 分界，以及
  contract-driven deterministic ZIP 的路径、metadata、mode、bytes 和 external-bootstrap 边界。
- 读取 provenance 与 changelog，恢复 beta.2→successor M1–M4→v0.3.0→v0.3.1→0.3.2-dev 的来源与变化
  语境；确认当前 development identity 没有改变 runtime/Host ABI/trusted graph。
- 读取 maintainer handoff 并枚举所有 test titles，建立“能力/边界→测试证据”的全局视图；下一步抽查
  activation/contracts/Cloud fixtures 的断言与 machine-shaped evidence，而不运行 mutation gate。
- 完整读取 activation 与 contracts tests，确认 plan-first/project-forwarding/composition/global-Skill isolation
  以及 provenance→overlay→runtime→Host ABI→artifact 的跨文件完整性断言。
- 读取 dated Cloud observations/test 与两组 golden fixtures，确认 Host lifecycle shape、wrapper/duplicate
  compatibility 及 legacy/canonical output oracle；这些证据不把 `/opt/codex` 提升为永久常量。
- 完整读取三个 pristine upstream shell scripts 并枚举 patched catch-up symbols，确认 resolver 语义、
  managed-legacy snapshot 如何使 v3 modes 不可达，以及 owned catch-up 只复用 upstream parser helpers。
- A1 完成，A2 开始；importer read-only check PASS，当前 owned upstream byte graph 健康。
- focused activation/contracts/Cloud test 首次运行未进入任何 case：Node test runner 创建三个 test-file
  process 均 `spawn EPERM`。归类为受限沙箱进程权限，不是产品/test failure；将用受控权限原命令重跑。
- 受控权限以完全相同命令重跑 PASS：8 tests / 6 pass / 2 honest Linux skips / 0 fail；两项 SKIP 是真实
  owned-runtime root/root 与 cross-user Linux activation，未用 Windows 结果替代。
- A2/A3 完成：source→build→package→install→runtime→data→evidence 七层模型、失败语义与未来改动风险
  已写入 findings；未发现 authority/contract/source 核心冲突。
- 收口检查：`git diff --check` PASS；工作树变化精确为 `.planning/.active_plan` 与新建的本调研 scope，
  production/contracts/tests/authority/history 均无改动。
- 维护者启动 A4 文档微调讨论；恢复 skill/README/ARCHITECTURE 与工作树，既有变化仍仅为本 planning
  scope。A4 初步判断为“无需结构性重写，最多做少量架构精度补充”。
- 重读 DESIGN/ROADMAP：实现布局已有五层素材，适合只补一句 reachability 判读规则；ROADMAP 无需改动。
- 重读活动 task plan 与完整 findings，确认 A4 仍是只读讨论，现有候选没有越过文档 authority 或当前
  programme 边界。
- 搜索跨文档关键词并读取 architecture governance assertions，形成五项候选排序：推荐 Architecture
  精度补丁、DESIGN 单行同步和 focused guard；明确不改 README/ROADMAP/历史 authority。
- A4 proposal ready：建议实施范围仅为 `ARCHITECTURE.md`、`DESIGN.md`、现有 focused governance test
  与 planning；本轮停在讨论点，等待维护者决定，不直接编辑权威文档。
- 维护者批准按 proposal 继续。重新运行 session catch-up，无未同步输出；重读 README/ARCHITECTURE，
  工作树仍仅含本 planning scope。A4 切换为 in progress，先写 failing-first guard。
- 重读 DESIGN/ROADMAP，确认实现范围与现有 authority/validation route 一致；ROADMAP 与 programme 状态
  不需同步，README 继续保持零改动。
- failing-first focused run 如期 RED：10 tests / 9 pass / 1 fail；唯一失败是新 guard 检出
  ARCHITECTURE 尚未明确“阶段 admission 不等于 dispatch reachability”，既有 repository boundary 全部通过。
- 最小修改完成：ARCHITECTURE 补 admission/reachability 判读规则、parser-helper 调用边界和 immutable
  transcript bytes；DESIGN 仅同步 Catch-up runtime 单行依赖说明；未修改任何实现或 machine contract。
- 同一 focused command 转 GREEN：10 tests / 10 pass / 0 fail / 0 skip。
- 静态收口 PASS：architecture test `node --check`、严格 UTF-8/LF/Markdown fence、`git diff --check`；
  最终差异仅为 ARCHITECTURE、DESIGN、现有 governance test 与本 planning scope。
- 维护者批准继续 A5；planning-with-files catch-up 无未同步输出。重查 `owned-catchup.py` 的全部
  `upstream.*` 调用，确认只有四个 helpers，动态 module load 不等于调用 upstream CLI `main()`。
- A5 failing-first focused run 如期 RED：10 tests / 9 pass / 1 fail；唯一失败是 Architecture 图尚未包含
  新的 validate/identity-check/freeze 精确表述，既有 architecture/repository governance 均通过。
- A5 文档补丁完成：Architecture 图改为 validate/identity-check/freeze；DESIGN 表后增加 Catch-up seam，
  明确 wrapper 职责、完整 module dynamic load、四个 helper 与 no-CLI-main 边界。
- 同一 focused command 转 GREEN：10 tests / 10 pass / 0 fail / 0 skip。JS syntax、严格 UTF-8/LF/fence、
  `git diff --check` 与授权边界零差异检查均 PASS；未修改 production/contracts/README/ROADMAP/Release。
- 维护者授权提交并推送本 scope 到 `0.3.2-dev`。GitHub CLI 2.97.0 已认证为 `keeptoy`；当前分支
  `0.3.2-dev` 跟踪 `origin/0.3.2-dev`，remote 为目标仓库；不创建 PR/Release。
- 逐项复核 importer/patcher、runtime bundle、overlay ledger、Release allowlist、installer 与 runtime 引用：
  §3.1 source rebuild/production execution 双路径与 A4/A5 wrapper/helper 文档补丁无冲突。
- 发布前验证 PASS：importer check healthy；`npm test` 为 86 tests / 74 pass / 12 honest Windows skips /
  0 fail；architecture test syntax 与 `git diff --check` 通过。
- `git fetch origin 0.3.2-dev` 后 `HEAD...origin/0.3.2-dev` 为 0/0，无远端分歧；提交范围冻结为
  `.planning/.active_plan`、本 scope 三文件、ARCHITECTURE、DESIGN 和 architecture governance test。
