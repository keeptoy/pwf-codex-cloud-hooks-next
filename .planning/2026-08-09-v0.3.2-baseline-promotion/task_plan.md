# Task Plan: v0.3.2 Promotion, Historical Cleanup, and Successor Handoff

## Goal

按三个互不混用的 gate 完成生命周期轮换：P1 只把已完成 Cloud hard acceptance 的 v0.3.2 晋级为
accepted rollback/GitHub `Latest`；P2 对 v0.3.1 及同类隐藏历史残留做全仓 Discovery 后实施获批清退；
P3 另开新 scope，才建立后继开发列车与 `v0.3.3-dev` machine identity。

## Authorization

- 维护者已经明确授权 P1：把 GitHub `Latest`/production rollback baseline 从 v0.3.1 晋级到 v0.3.2，
  并同步相应 acceptance 与 lifecycle authority；不得重发或改写任何 tag/asset/SHA。
- 维护者把 P2 定义为独立深度清理：目标是归档 v0.3.1，并扫描 `architecture-contracts.test.js` 一类隐藏
  历史残留。P2-D inventory 后已明确授权 P2-I，并补充允许删除 root v0.3.1 bootstrap、把 README/AGENTS
  固定版本命令改为可执行的版本无关循环；P2 完成后停在 P3 前讨论。
- 维护者已批准 P2-G 治理加固：把本轮经验吸收到可迁移 Repository Governance Guide，并将一次性的旧版
  禁止断言升级为版本无关 retirement guards；仍不得进入 P3 或建立新版本 identity。
- 维护者已批准把本地 post-release 治理分支改名为 `0.3.2-post-release`；该名称不建立新 machine identity，
  不修改或删除远端分支，也不授权用新字节重发 v0.3.2。
- 维护者已明确授权读取未跟踪的 `临时文件/` 作为早期版本证据，并补全 CHANGELOG 中 v0.3.0-beta.1、
  v0.3.0-beta.2 与 v0.2.2 的历史定位；v0.2.2 具体特点等待维护者后续补充，不得无证据扩写。
- 维护者已批准在 P2 内建立精选的 Phase 1～3 历史摘要：只从现有 work plan、Phase 专项文档、
  beta acceptance 与 immutable refs 提炼，不复制临时目录、逐轮日志、脚本或历史源码，也不进入 P3。
- 维护者已批准继续收紧 Phase authority：README 保留唯一面向当前树的 Phase 导航；provenance 不反向链接
  capsule；摘要正文自洽，旧 Phase/acceptance 文档不再作为直接解释入口，只保留明确降级的 cold source evidence。
- 维护者已批准把 M1～M4 的迁移叙事整理为回顾性 `Phase 3.5` capsule：CHANGELOG v0.3.0 改指该摘要，
  provenance 只保留精确迁移 refs；Phase 3.5 不是原 programme 的正式 Product Phase，也不授权 Phase 4。
- 维护者已批准在 P2 内把 `BASELINE_PROVENANCE.md` 收口为持续维护的冷证据账本：文件名保留，已登记
  immutable entry 不改写，当前 lifecycle 角色仍只由 ROADMAP 维护；第 5、6 节原样保留，只把 Phase 1
  的 M1～M4 叙述改指 Phase 3.5，ROADMAP 不因本 gate 修改。
- 维护者随后批准收紧 Phase 历史入口：CHANGELOG 不再提及或链接 Phase 3.5，v0.3.0 迁移来源改指
  BASELINE_PROVENANCE 的 exact-evidence anchor；README 是宏观文档中唯一 `docs/history/` 入口。
- 维护者批准把 Phase 摘要格式从 machine guard 解耦：治理指南只保留生命周期/authority 边界，具体写法
  由可复制模板恢复；测试不再冻结文件名、八段 anchor、证据数量或某个历史 Phase 的内容。
- 维护者批准吸收 immutable `phase-3-upstream-invocation-options` 的关键架构选择：只补 Phase 3 的历史
  rationale 与 ARCHITECTURE 的长期边界，不复制旧 Round/测试/角色状态，也不扩写 BASELINE_PROVENANCE。
- 维护者明确授权读取新增的临时 0.1.0/0.2.2 实现证据，先恢复 0.1.0 的关键文档和代码事实并补入
  CHANGELOG；临时目录本身不得修改、暂存或复制进当前树，同时核对两个快照是否具有 Git 恢复链。
- 维护者随后补充本地 v0.2.1 snapshot，并授权比较 v0.1.0/v0.2.1/v0.2.2 的 README、manifest、实现与
  tests，把已证实的 v0.2.1 delta 写入 CHANGELOG；临时目录继续只读，不扩展到 P3 或当前 runtime。
- P3 只记录为后续独立 gate；当前不修改 package、Release contract、bootstrap 或 `v0.3.3-dev` identity，
  不 seal、不发布、不部署新版本。
- 已完成的 `2026-08-09-architecture-contract-retention` 三文件由 immutable commit `d4cc3b5` 保存，P2
  可读取并吸收有效结论，但不作为第二个长期 `.planning` scope 重新进入当前树。

## P2-PROV Authorization

- 维护者已授权继续补齐 `BASELINE_PROVENANCE.md` 的早期已发布身份；只采用旧仓库 tag、Release API、
  资产 digest、历史 acceptance 和可达 Git object 能直接证明的事实。
- 已证实字段按冷证据账本的统一结构登记；缺少 source、asset、bootstrap 或 acceptance 证据时显式留空/
  标记未恢复，不从后续版本反向推断，也不修改任何历史 tag、Release 或资产。
- 本 gate 仍属于 P2 post-release 文档治理，不建立 P3 scope、candidate identity、ZIP、seal、Release 或部署。

## P2-P0 Authorization

- 维护者已授权把 v0.1.0 → v0.2.2 → alpha.1/alpha.2/beta.1 → beta.2 → successor stable v0.3.0 的核心
  理解组织为 `Phase 0` 架构历史。
- `Phase 0` 必须明确是后续建立的 architecture-lineage overview，不是原 programme 的正式 Product Phase、
  版本或 Release identity；它只解释架构换代与仓库换代的区别，不取代 Phase 1～3/3.5 摘要。
- 本 gate 只修改历史摘要、历史索引、CHANGELOG 最小治理记录和活动 planning；不修改 provenance exact
  identity、当前 architecture/contracts、production、Release、ROADMAP 或 P3 状态。

## Next Step

停在 post-release 文档治理阶段和 P3 前。v0.2.1 已通过三个 early-version snapshots 的逐文件 hash/diff
恢复到 CHANGELOG；早期 publication provenance 与 Phase 0 架构谱系保持原有 authority 分层。P3 继续
等待维护者另行授权。

## Gates

- [x] D0 — Discovery：全仓库 inventory、外部事实、恢复链、测试影响与候选路线。
- [x] D1 — Decision：维护者冻结 P1 → P2 → P3 三段式；P1 获得明确 GO，P2 先 Discovery，P3 未授权。
- [x] P1-A — Preflight：Latest=v0.3.1；v0.3.2 为非 draft/prerelease，双资产 size/digest 与 acceptance 一致。
- [x] P1-B — Pointer promotion：仅把 GitHub Latest 指向 v0.3.2，并完成独立后置查询。
- [x] P1-C — Evidence and authority：写入 v0.3.2 promotion evidence，旋转 ROADMAP/CHANGELOG 角色；provenance 按职责不复制当前角色。
- [x] P1-D — Validation：focused/full suite、published oracle、sealed ZIP identity、链接与 diff 全绿。
- [x] P2-D — Deep-clean Discovery：恢复旧 retention 结论，全仓扫描并冻结 hot/warm/cold inventory、删除集合、
  断言迁移、immutable 恢复链和停止条件；未获新 GO 前不删除。
- [x] P2-I — Historical cleanup：实施获批清退集合与 README 版本无关化，不开启新版本 identity。
- [x] P2-G — Retirement governance：固化可迁移退役合同与版本无关自动化 guard。
- [x] P2-H — Historical changelog recovery：从早期证据恢复 beta.1/beta.2/0.2.2 版本定位。
- [x] P2-P — Phase history capsules：建立精选历史索引与 Phase 1～3 冻结摘要，固化边界 guard。
- [x] P2-P-A — Phase authority tightening：单一 README 入口、正文自洽、旧文档证据降级与防回流 guard。
- [x] P2-P-M — Migration capsule：将 M1～M4 叙事整理为回顾性 Phase 3.5，provenance 保留 exact refs。
- [x] P2-P-B — Provenance cold ledger：统一已发布身份账本、移除角色态措辞并补 hot-state 防回流 guard。
- [x] P2-P-E — Phase archive entrance：移除 CHANGELOG 的 Phase 3.5 特例，冻结 README 单一宏观入口。
- [x] P2-P-T — Phase authoring template：生成恢复模板，移除格式型/历史内容型测试断言。
- [x] P2-P-R — Phase 3 route rationale：提炼受控快照选择、后备与退休条件，保持 provenance 冷账本纯度。
- [x] P2-H-010 — v0.1.0 recovery：交叉读取早期文档/实现/测试，恢复最早原型定位与 Git 证据边界。
- [x] P2-H-021 — v0.2.1 recovery：比较 v0.1.0/v0.2.1/v0.2.2，恢复 Managed policy、ownership、doctor/
  repair 与验收边界的准确版本 delta。
- [x] P2-PROV — Early publication provenance backfill：核验并登记有证据的 v0.1.0、v0.2.2 与
  v0.3.0 alpha/beta 身份，缺证字段保持空缺。
- [x] P2-P0 — Architecture lineage overview：建立回顾性 Phase 0，串联可行性、Cloud 功能基线、owned
  architecture 完成与 successor authority 迁移，且保持详细 Phase authority 分层。
- [ ] P3 — Successor train：另开 active scope 和 Discovery，建立获批的后继 machine identity。

## Stop Conditions

- 无法证明 v0.3.1 tag/Release/acceptance/bootstrap 可从 immutable ref 恢复。
- P1 前置或后置查询显示 v0.3.2 资产 identity 漂移、Release draft/prerelease、或 Latest 未按预期切换。
- 需要改写 v0.3.1/v0.3.2 tag、Release、asset、SHA 或 acceptance。
- 修改或重新发布 v0.3.1/v0.3.2 immutable tag、Release、asset、URL、SHA 或历史 acceptance。
- P2 后 current HEAD 仍被测试或文档宣称可以逐字重建 published v0.3.2，或被赋予新的 candidate/
  installable bootstrap 身份；它必须显式停在 P3 前的 unsealed governance transition。
- P2 删除唯一 immutable 恢复链、削弱 v0.3.1 immediate-fallback oracle 或丢失通用 bootstrap 安全断言。
- 任何 promotion/eviction 会削弱当前回滚能力、publication oracle 或 Release gate。
- 临时文件与 immutable refs 对 beta.1/beta.2 的 Phase 或文档治理范围互相冲突，或 v0.2.2 特点只能靠猜测。

## Status

P1 PASS，P2-I PASS，P2-G PASS，P2-H PASS，P2-P PASS，P2-P-A PASS，P2-P-M PASS，P2-P-B PASS，
P2-P-E PASS，P2-P-T PASS，P2-P-R PASS，P2-H-010 PASS，P2-PROV PASS，P2-P0 PASS，P2-H-021 PASS。
本地分支为 `0.3.2-post-release`，当前 HEAD 是 P3 前的 unsealed governance transition；P3 未授权。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| P2-PROV 收口补丁因计划正文是 `0.1.0`、预期上下文误写成 `v0.1.0` 而拒绝应用 | 1 | 无部分修改；读取真实段落后使用精确上下文重试 |
| Web open 拒绝直接访问 GitHub API URL，返回 unsafe/internal error | 1 | 改用获批的只读 `gh api` 查询同一官方 Release API，不重复 web open |
| Windows sandbox 中 `node --test tests/repository-boundary.test.js` 在 runner 隔离进程处 `spawn EPERM` | 1 | 分类为 platform limitation；改用 `--test-isolation=none` 在同一进程执行同一测试文件，不修改断言 |
| 沙箱外 guard 首次执行报告 active planning scope 未 tracked | 1 | 这是新 scope 尚未进入 Git index 的预期 checkpoint 状态；先显式 stage 仅 planning 轮换文件，再复跑 guard 后提交 |
| 沙箱内 `git add` 无法创建 `.git/index.lock` | 1 | 工作区未受损；按既有关键 checkpoint 自动 commit 授权，仅对 planning rotation 请求沙箱外 Git 写入 |
| 重写三段式活动计划的大块补丁因旧段落精确换行不匹配被拒绝 | 1 | 未产生部分修改；改用 UTF-8 复读后按标题分段应用，不重复原补丁 |
| P1 focused 20/20 PASS 后 `git diff --check` 报 acceptance 新增行 trailing whitespace | 1 | 只移除该行末空格，不修改证据内容；随后重跑 diff/full suite |
| PowerShell 环境没有全局 `bash` 命令，两条直接 `bash -n` 未执行 | 1 | 完整 suite 的 bootstrap 行为用例已 PASS；改用测试固定的 Git Bash 绝对路径做独立语法检查 |
| Git Bash 在沙箱内创建 signal pipe 失败，Win32 error 5 | 1 | 分类为 sandbox permission limitation；仅将两个只读 `-n` 检查移到沙箱外，均 PASS |
| P2 首轮 `rg` 把 PowerShell 不展开的 `*.md` 当作路径，返回 Windows illegal path | 1 | 前两段 inventory 已输出；后续改用 `rg ... . -g '*.md'`，不重复裸 shell glob |
| 合并 inventory 命令最后的 moving-URL `rg` 因零匹配返回 exit 1 | 1 | 前置清单均成功；零匹配本身是 clean 结果，后续不把预期 no-match 与产品失败混为一谈 |
| 组合读取 v0.2.2 证据与 beta tag 的命令因 successor 本地不存在 beta/v0.2.2 tags 返回 exit 1 | 1 | 文档片段已完整读取；改用可达 old-lineage commits、临时 exact tree 和现有 provenance，不伪造本地 tag |
| P2-P focused test 在 Windows sandbox 内由 Node `spawnSync("git")` 返回 `status=null`，4 个依赖 trackedPaths 的 case 同点失败 | 1 | 分类为 sandbox platform limitation；13 个非 Git case 已通过，保持断言不变并在沙箱外重跑同一 focused suite |
| P2-P-M focused suite 14/17 PASS；3 项因 Markdown 换行被固定空格 regex 拒绝、CHANGELOG link label 多包反引号 | 1 | 分类为 test/document formatting defect；保留 Phase 3.5 语义断言，改用 `\s+` 接受合法换行并移除链接标签反引号后复跑 |
| P2-P-M 第二轮 focused suite 16/17 PASS；新 capsule 的 cold-evidence 句式未使用既有统一模板 | 1 | 不放宽 guard；把“迁移闭环的历史来源”统一为“本文的历史来源”，保留后半句 exact-ref 分工后复跑 |
| P2-P-B focused suite 在 Windows sandbox 内 13/17 PASS；4 项依赖 `spawnSync("git")` 的 tracked-path case 返回 `status=null` | 1 | 分类为既有 sandbox platform limitation；保持断言不变，在沙箱外复跑同一 suite 17/17 PASS |
| PowerShell `rg` 再次收到未展开的 `.planning/.../*.md` 路径并返回 Windows illegal path | 1 | 所需测试片段已输出；后续继续使用显式文件或 `rg ... . -g '*.md'`，不重复裸 glob |
| 首次用 PowerShell `foreach (...) { ... } | Format-Table` 比较 v0.2.2 历史 trees 时触发 empty pipe parser error | 1 | 没有修改文件；把循环结果先赋给 `$rows`，再单独格式化，成功比较五个 commits |
