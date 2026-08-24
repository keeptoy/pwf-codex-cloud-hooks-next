# Task Plan: post-v0.4.2 文档治理扫尾 Discovery

## Goal

在不改写 v0.4.2 真实历史证据、不自动清退 planning 的前提下，识别并治理发布收官快照、临时事故叙事或版本专用规则泄漏到长期模板与 current regression 的残留。

## Next Step

按维护者决定完成Phase 5归属写回：Batch A/B归入v0.4.2 post-C2文档治理扫尾，在ROADMAP 4.1追加programme摘要，并在Phase 4.14追加详细历史与稳定anchor；验证后独立提交，不删除planning或激活新列车。

## Current Phase

Phase 5: closeout and train attribution

## Phases

### Phase 1: Recovery and planning lifecycle correction

- [x] 确认 v0.4.2 Release closeout 已关闭且本地分支与远端同步。
- [x] 追溯“current tree 只能存在一个 planning scope”断言的引入时间与背景。
- [x] 确认该断言是 v0.4.2 C2 清退快照的过度泛化，并与稳定 planning lifecycle authority、底层 validator 冲突。
- [x] 按维护者授权删除唯一-scope快照断言，保留 pointer、活动/非活动 scope 结构与三件套校验。
- [x] 新建本 Discovery scope 并切换 `.planning/.active_plan`；旧 v0.4.2 scope 保留，不自动清退。
- **Status:** complete

### Phase 2: Targeted documentation/test residue inventory

- [x] 盘点 tests 对 v0.4.2“首次停止 → 临时授权 → PASS”事故时间线的直接依赖。
- [x] 区分 immutable acceptance/history 真实证据与 stable template/current regression 长期合同。
- [x] 扫描 C2、Phase 9、旧版本角色、一次性数量及其他 snapshot-specific 断言。
- [x] 把精确发现、影响范围与建议写入 `findings.md`。
- **Status:** complete

### Phase 3: Broader documentation authority and link sweep

- [x] 检查 current authority 重复、旧 current-state 投影、失效/过度兼容 anchor 与断链风险。
- [x] 核对 README/ROADMAP、治理指南、templates、acceptance 与 history 的职责边界。
- [x] 形成 RETIRE/MIGRATE/KEEP 清单，不提前修改未授权对象。
- **Status:** complete

### Phase 4: Maintainer decision and scoped implementation

- [x] 向维护者报告发现、依据、影响范围和最小修改建议。
- [x] 维护者批准先A后B、分步实施。
- [x] 确认Phase 4.12同类旧anchor由初扫6个扩大为完整21个的原子清退范围。
- [x] 实施Batch A：清退确定死分支/快照断言/21个旧anchors，修复两条断链并增加通用Markdown链接审计。
- [x] Batch A运行focused/full validation、反向残留扫描与Release-input交叉检查，记录真实结果。
- [x] 实施Batch B：收敛Phase 4.14自然语言断言与ROADMAP重复事故摘要；不改历史事实正文。
- [x] Batch B运行风险相称验证并独立提交。
- **Status:** complete

### Phase 5: Closeout and train attribution

- [x] 决定Batch A/B归入v0.4.2 post-C2文档治理扫尾，不另开版本身份，也不改写immutable Release。
- [x] 把programme级摘要写入ROADMAP 4.1，把详细取舍与验证写入Phase 4.14，并同步稳定边界测试。
- [ ] 由维护者决定本 scope 及旧 v0.4.2 scope 的后续 KEEP/RETIRE；pointer 切换不自动授权删除。
- **Status:** in_progress

## Key Questions

1. 哪些 current tests 在保护稳定协议，哪些只是在逐字保护某次版本事故或 closeout 快照？
2. v0.4.2 acceptance/history 中的真实临时授权时间线应保留到什么粒度，而 current regression 应迁移为什么稳定语义？
3. 是否还有 C2/Phase 9/固定数量/版本角色等历史状态被错误提升为永久规则？
4. 本轮治理 delta 是否需要新的版本身份与双通道 Release 验收？

## Decisions Made

| Decision | Rationale |
|---|---|
| 保留多个完整 planning scope | 复杂项目的多轮 Discovery 需要相邻上下文帮助恢复；维护者可见且控制退役节奏，测试无需强制只剩一个目录。 |
| 删除 `planningScopes === [activePlan]` 断言 | 它只反映 v0.4.2 C2 清退后的瞬时结果，与稳定指南及支持 inactive 三件套的 validator 冲突。 |
| 不删除旧 v0.4.2 scope | pointer 切换不是 planning 删除授权；旧 scope 已关闭但仍可作为本轮紧邻来源。 |
| acceptance/history 保留真实时间线，模板/测试只冻结稳定协议 | 历史证据回答“当时发生了什么”，current regression 应回答“今后必须保证什么”。 |

## Authorization

- 已授权：新建并切换到 post-v0.4.2 文档治理扫尾 Discovery；保留旧 planning scope。
- 已授权：删除 current repository test 中“只能存在一个 planning scope”的要求，保留其余 planning lifecycle 校验。
- 已授权：只读扫描文档、tests、Git 历史和引用关系，形成后续治理建议。
- 已授权：先实施Batch A、后实施Batch B；Batch A的Phase 4.12范围按复核后的全部21个无入链旧anchors原子清退。
- 已授权：Batch B收敛Phase 4.14逐段自然语言断言，并压缩ROADMAP 4.1重复的临时授权事故过程；历史正文和真实acceptance证据保持不变。
- 已授权：把Batch A/B明确归入v0.4.2，在ROADMAP 4.1追加programme摘要，并同步到Phase 4.14历史；只改治理文档、相应测试与活动planning，不碰22项Release输入。
- 未授权：自动删除任何 planning、历史 acceptance/history、production/runtime/contract 或 Release 输入。
- 未授权：push、远端 branch/tag/Release/资产、Latest、Cloud task、部署或下一 Product Phase/版本列车 activation。

## Stop Conditions

- 发现拟修改对象属于 immutable release identity、production/runtime、contract、bootstrap、ZIP allowlist 或其他 Release 输入时停止并报告。
- 发现历史正文与稳定模板看似冲突时，先按角色分类，不用当前协议回写改造真实历史时间线。
- 任何 planning 删除都必须由维护者明确决定；完成状态、Git 恢复点或 pointer 切换都不构成删除授权。
- Discovery 结论扩大到实际文档/test批量治理前，先提交发现、影响和建议，等待维护者授权。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 初次 Git 追溯组合命令以 exit 1 结束，但 blame/pickaxe 已完整返回 | 1 | 不重复原命令；拆分为定向 `git show`、`git blame` 与 helper 读取，确认引入 commit 和原始生命周期语义。 |
| 沙箱内 `git add` 无法创建 `.git/index.lock`，Node test runner 创建子进程返回 `EPERM` | 1 | 归类为维护机沙箱执行面限制；记录后改用获准的非沙箱执行面分别完成暂存与验证，不弱化断言。 |
| Phase 2首条`rg`组合命令因PowerShell双引号与正则冲突，在解析阶段退出 | 1 | 未执行搜索；改用单引号包裹正则并拆分可读输出，不重复原转义方式。 |
| Phase 4.12完整anchor审计末尾的展示用`rg`返回exit 1 | 1 | 主审计已成功枚举21个anchor及全部入链；展示命令不再重跑，改用已解析结果。 |
| Batch A首次focused测试17 pass / 1 fail：Phase 4.12尾注断言仍匹配旧“保持”措辞 | 1 | anchors按授权继续清退；把断言迁移为“P9正文保留、旧anchors不保留”的新稳定语义后重跑。 |
| Batch B首次focused测试23 pass / 1 fail：ROADMAP新增第三条直达history链接，违反“两处受控宏观入口”边界 | 1 | 保留真实时间线于immutable acceptance/history；ROADMAP只链接版本acceptance并明确不新增第三入口，随后重跑。 |
| Batch B最终静态汇总命令被PowerShell反引号解析提前终止 | 1 | 命令未执行任何检查或写入；拆分为不含反引号的简单命令完成最终审计，不重复原命令。 |
| Phase 5首次planning结项补丁因progress表格上下文不精确而未应用 | 1 | 没有文件被部分修改；读取精确UTF-8上下文后拆分补丁，不重复旧上下文。 |

## Current Status

`V0_4_2_ATTRIBUTION_AND_DOC_SYNC_COMPLETE / RELEASE_INPUTS_UNCHANGED / PLANNING_KEEP_RETIRE_DECISION_PENDING`
