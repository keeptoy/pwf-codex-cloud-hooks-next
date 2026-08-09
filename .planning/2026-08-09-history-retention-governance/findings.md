# Findings: Repository History Retention Governance

## Maintainer Intent

- 把完整历史从当前工作树迁回 Git commit/tag/Release，不再让每轮 planning、acceptance 和 bootstrap 永久
  累加在 HEAD。
- 让 `BASELINE_PROVENANCE.md` 成为精选的来源/迁移/架构里程碑目录，而不是逐版本资产流水账。
- 常规版本 delta 进入 `CHANGELOG.md`；programme/current roles 继续只在 `ROADMAP.md`。
- 开发迭代使用 branch/worktree + 一个活动 planning scope；不复制第二套 production 源码目录。
- 提供一份可复制到新项目的治理指南，让新人能直接理解 authority、保留策略和晋级流程。

## Current Inventory Evidence

- 基点 `cde4b15` 的 tracked tree 约 79 paths；`.planning` 有 5 个 completed scopes、16 files、约 424 KB，
  是当前最大的非产品增长区。
- `docs` 有 6 files、约 141 KB；其中 M3/M4 迁移证据和 beta.2/v0.3.0/v0.3.1 acceptance 占主体。
- 根目录同时保留 v0.3.0、v0.3.1、v0.3.2 三个 bootstrap，约 61 KB；当前角色实际只需要 candidate
  v0.3.2 与 accepted v0.3.1 的运维窗口。
- Release contract 已排除 `.planning/`、`docs/` 和 `tests/`，因此治理区迁移与 production ZIP inventory
  原则上正交；README 或当前 bootstrap 如变化仍会改变 development candidate bytes，必须单独验证。

## Authority Model

| 问题 | 稳定归处 |
|---|---|
| 当前支持行为与命令 | README |
| 系统理由、信任边界与重大路径选择 | ARCHITECTURE |
| 实现布局与验证路由 | DESIGN |
| 常规版本 delta | CHANGELOG |
| programme、candidate/accepted/rollback 角色 | ROADMAP |
| upstream、不可变身份和精选里程碑索引 | BASELINE_PROVENANCE |
| 当前授权、研究、实施和验证流水 | 唯一活动 planning scope |
| 完整旧字节与逐次验收现场 | immutable commit/tag/Release |

## Recommended Retention Model

### Hot / Warm / Cold

- Hot：当前 canonical source、当前 candidate、当前 accepted baseline、一个活动 planning。
- Warm：紧凑 CHANGELOG、精选 provenance、当前 acceptance/rollback 路由。
- Cold：Git history、immutable tags/Releases、旧 acceptance、旧 bootstrap、completed planning。

### Three Baselines

- source baseline：branch 通过开发 gate 并合入 canonical source。
- release baseline：tag + sealed/downloaded assets 完成不可变验收。
- rollback baseline：真实 Cloud Fresh/Resume/doctor/rollback 后显式晋级。
- 前一层 PASS 不自动产生后一层身份。

### Role Window

- development 期间保留 candidate + accepted baseline；更早版本退出当前树。
- candidate 晋级并成为 accepted/rollback baseline 后，前一 accepted 退出当前树，仅保留 immutable refs。
- CHANGELOG 可保留紧凑版本索引，但不得吸收 SHA、测试流水或当前 lifecycle。

## Provenance Admission Rule

只有以下事件进入 provenance 里程碑：upstream/source pin、repository lineage/migration、Host ABI/trusted
graph、Release/rollback mechanism、长期基线晋级。普通 patch、文案、小功能和逐 gate 过程不进入；详细
字节/验收只链接 immutable ref。ARCHITECTURE Historical Context 保存“为什么”，provenance 保存“从哪里
来以及精确证据在哪里”。

## Iteration Model

- 推荐 branch/worktree 隔离，始终修改 canonical paths。
- `.planning/<slug>` 是可接受的迭代文件夹，但只放 plan/findings/progress；当前树最多一个活动 scope。
- 禁止在 `iterations/<version>/` 复制 hooks/runtime/contracts/tests 形成双权威。
- 必须实验时，`experiments/<slug>/` 需显式 Release-excluded、不可被 production import/dispatch，并在
  merge 前晋升有效结论后删除。

## Governance Guard Direction

- exact：production entrypoints、runtime、contracts、installer、Release allowlist、executable/mode。
- policy-based：docs、planning、handoff 等非执行治理区，检查允许 pattern、活动角色、数量上限、链接和
  Release exclusion。
- 当前 `expectedPaths` 把两类边界混为一体；它能发现 drift，但会把正常活动 planning 当作全仓库身份
  变化。H4 应保留安全 exactness，同时消除对 completed scope 名单的无限追加。
- H4 复核确认 Release machine contract 已精确列出 23 个 ZIP entries、当前外部 bootstrap 和排除前缀；
  repository guard 无需再用第二份全仓库清单复制这项精确性。
- 新 guard 应独立保护三件事：trusted/source zone 的精确路径集合、planning/docs lifecycle 的结构规则、
  已退役路径不得回流。合法治理文档出现时只要满足 lifecycle policy 就不应触发 trusted-zone drift。
- 当前 tracked tree 有 6 个完整 planning scopes；H4 不删除它们。lifecycle guard 先验证 scope 命名、固定
  三文件结构、单一有效 active pointer 与 Release exclusion；“当前树只剩活动 scope”由获批后的 H5
  迁移执行并再收紧数量/角色断言。
- 通用指南把 `docs/`、planning、runbook/acceptance 定义为 lifecycle zones，把 production entrypoints、
  runtime、contracts、installer 和 Release allowlist 定义为 exact zones；测试实现应直接体现这条边界。
- `contracts.test.js` 和 `release-package.test.js` 已分别保护 candidate artifact 的 23-entry machine contract、
  external bootstrap 与 excluded prefixes；repository guard 应消费该 authority 来核对 tracked source，避免
  复制第二份 Release entry count/全路径表。
- 当前测试集中没有 repository-level planning 生命周期断言；H4 需要新增 active pointer、scope triplet、
  允许文件名和 Release exclusion 的直接检查，同时保留退役原型/历史路径拒绝断言。
- Release contract tests 已核对 entry 唯一性、数量、当前 external bootstrap、source 存在性和 excluded
  prefix 不进入 artifact；H4 的 repository test 只需补充“trusted namespace 没有 contract 外 tracked file”
  与生命周期区结构，不再冻结全部 repository paths。

## Candidate Migration Order

1. 为分区 guard 写 failing-first tests，并捕获当前 tracked planning 红灯。
2. 只保留新活动 planning scope；旧 scopes 由 `cde4b15` 及更早 commits 恢复。
3. 当前窗口先保留 v0.3.1 + v0.3.2，移出 v0.3.0/beta.2 local acceptance/bootstrap 与 M3/M4 全文。
4. 把仍需保留的链接改为 immutable commit/tag/Release URL，历史 oracle 不再依赖当前根目录旧脚本。
5. 压缩 provenance 为 current baseline proof + milestone catalog；CHANGELOG 保留紧凑 delta。
6. 同步 AGENTS/README/DESIGN/ROADMAP/handoff 与治理测试，再跑完整 validation。
7. v0.3.2 真正晋级后执行第二次角色旋转：当前树只保留 v0.3.2 的 active assets/evidence。

## H5 Recovery Inventory

- 本地 refs 已确认：`v0.3.0` 指向 `1454c9224c83d11c073b05baf6e536a11c3bb0e5`，`v0.3.1`
  指向 `9aa2148886e499f9f45594f7ae4f7681f1045de2`；`origin/0.3.2-dev` 指向已推送的 `cde4b15`。
- 拟清退 20 个路径：5 个 completed planning scopes（15 files）、M3/M4 runbook、beta.2/v0.3.0
  acceptance 和 v0.3.0 bootstrap。当前 active scope、v0.3.1 acceptance/bootstrap 与 v0.3.2 bootstrap 保留。
- 所有拟清退路径必须先通过 `cde4b15:<path>` object lookup；v0.3.0 bootstrap/acceptance 还应由
  `v0.3.0` tag 二次证明。当前文档链接统一改为 exact commit/tag URL，不新增 `archive/` 副本。
- Recovery probe 已通过：20/20 路径存在于远端跟踪提交
  `cde4b15bba7ed8580cb774c8b8bb259c9174c3d0`；v0.3.0 acceptance/bootstrap 2/2 还存在于 tag commit
  `1454c9224c83d11c073b05baf6e536a11c3bb0e5`。origin 是
  `keeptoy/pwf-codex-cloud-hooks-next`，可生成 exact-commit GitHub blob 链接。
- 直接依赖已定位在 BASELINE_PROVENANCE、CHANGELOG、ROADMAP、README、AGENTS、v0.3.1 acceptance，
  以及 repository/release-package/skill-patch tests；删除前必须逐一改路由或退休 current-tree oracle。
- Provenance 不能删除已发布 identity 的 filename/size/SHA，因为根级 Release 规则仍要求这些精确事实只在
  provenance 维护；H5 将把 v0.3.0/beta.2 压成 milestone catalog 并把 acceptance 改为 exact-commit URL，
  而不是丢失身份或继续保留 current-tree acceptance 全文。
- CHANGELOG 的旧版本摘要可以继续保留，但历史 acceptance 链接必须改为 immutable commit URL；v0.3.1
  仍是 accepted role，因此其 current-tree acceptance 链接保持不变。
- M3、M4、v0.3.0 和 beta.2 四份待清退文档已分别在它们的 exact evidence/source commit 上通过 object
  lookup，可安全改成 GitHub `blob/<40-char-commit>/<path>` 链接。
- README 与 AGENTS 只需把常用语法检查收缩为 accepted v0.3.1 + candidate v0.3.2；v0.3.1 acceptance
  内部对 v0.3.0 的相对链接必须改成 exact v0.3.0 commit URL。
- `release-package.test.js` 的 v0.3.0 tag archive 已能独立重建并核对历史 ZIP/bootstrap；应移除对当前根
  v0.3.0 bootstrap 和 beta.2 acceptance 副本的依赖，只保留 tag oracle + provenance identity 检查。
- `skill-patch.test.js` 的 v0.3.0 bootstrap case 是冷历史重放；当前 v0.3.1/v0.3.2 tests 已覆盖 pristine
  Skill、archive pin 与 bootstrap supply-chain 边界，因此该 current-tree 历史 case 可以退休。
- `architecture-contracts.test.js` 只要求 provenance 保留三代关键 identity，并不要求旧 acceptance 留在
  current tree；exact-commit external Markdown links 不进入本地 fragment checker，适合 H5 路由。
- `repository-boundary.test.js` 最后一项仍直接读取 M3/M4/v0.3.0 冷历史文档；H5 应把历史结论承接改为
  current production safety tests + provenance exact refs，并把 planning scopes 收紧为只允许 active scope，
  同时显式冻结 current bootstrap role window 为 v0.3.1 + v0.3.2。
- 应用 link rewrite 与删除后，旧路径剩余引用只属于四类合法用途：exact-commit/Release URL、历史 tag
  archive 内部断言、current contract 的 negative assertion、repository retired-path assertion；不存在指向
  已删除 current-tree 文件的相对 Markdown 链接或 runtime import。
- H5 候选 index 收缩到 63 tracked paths：`.planning` 只剩 active pointer + 当前 scope 三文件，`docs/`
  只剩 mode 指南、通用治理指南和 v0.3.1 accepted acceptance，根级 bootstrap 只剩 v0.3.1/v0.3.2。
- H5 当前 diff 为 33 files、约 8,857 行净删除；这是 current-tree eviction，不重写任何 commit/tag/Release，
  20 个删除路径的原字节仍由已验证 refs 保存。

## Non-Goals for Current Gate

- 不删除 accepted `v0.3.1` 或 candidate `v0.3.2-dev` 当前角色所需文件；H5 只删除已验证可从 immutable ref 恢复且已退出角色窗口的历史文件。
- 不改变 package/version、Release ZIP allowlist、bootstrap hash 或 published identity。
- 不宣称 `governance/history-retention` 已成为 source/release/rollback baseline。
- 不执行 Cloud、seal、publication、rollback promotion 或 push；本地关键恢复点 commit 已获授权。

## H6 Authority Audit

- README 的唯一完整文档地图尚未列出通用仓库治理指南；目前只有 handoff 能发现它，不足以成为稳定
  “问题 → authority”入口。
- CHANGELOG Unreleased 尚未记录已经发生的 guard 分区与 history-window rotation；这些是 `0.3.2-dev`
  的实际治理 delta，应进入 CHANGELOG，而不是只留在 planning。
- ROADMAP 已说明 `0.3.2-dev` 的文档治理目标，但尚未冻结该列车采用“一个 active planning + candidate /
  accepted role window + immutable cold history”的 programme-level治理结果。
- ARCHITECTURE/DESIGN 的 runtime/trusted graph 分工已经完整，H6 不应为仓库治理重复增加系统架构章节。
- Authority 补齐后，README 提供唯一治理指南入口，CHANGELOG 记录实际 delta，ROADMAP 只冻结 programme
  级 role-window 结果；三者没有复制 planning 流水或 provenance 精确资产表。
- README 是 development ZIP 输入，因此 H6 必须以补齐后的字节重新双构建；本地确定性 hash 只证明当前
  source candidate 可复现，不建立 seal、publication 或 rollback 身份。
- 相对 `0.3.2-dev@cde4b15` 的最终边界审计没有发现 hooks、runtime、contracts、installer、tools、
  patcher、package contract 或当前 v0.3.1/v0.3.2 bootstrap 变化；`TRUSTED_CURRENT_ROLE_DIFF=NONE`。
- README 是本轮唯一变化的 candidate ZIP 输入；补齐 authority 后的双构建字节完全一致，因此该输入变化
  已在 development-package 层闭合，但不能把本地 hash 提升为正式资产身份。
- Windows 上 12 个 POSIX/Linux-only tests 继续诚实 SKIP。由于本轮没有 production/trusted/Host ABI
  变化，它们不阻塞 source merge；但也不能替代未来 Release/Cloud gate 的 Linux 和 live-host 证据。
- 综合 authority、regression、package、静态检查与边界审计，H6 对 source merge 给出 GO；对 Release、
  Cloud、publication 和 rollback 不作 GO 结论。
