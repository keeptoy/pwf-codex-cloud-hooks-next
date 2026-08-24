# Task Plan: v0.4.2 Release closeout / candidate-readiness

## Goal

不创建 standing Phase 9，按版本无关 Release closeout workflow 完成 `v0.4.2` 的非破坏性candidate admission preflight、候选身份物化、本地验收和 Source/Candidate Cloud教程准备；第一轮真实退役只在Source/Candidate PASS后执行并写入C1。

## Next Step

维护者审核并push新的C0 HEAD；Source/Candidate继续暂停，直到维护者决定在全新Cloud执行。

## Current Phase

Phase 5 / Source-Candidate paused pending maintainer push

## Phases

### Phase 1: Authority recovery and candidate boundary

- [x] 按 AGENTS 顺序恢复 README、ARCHITECTURE、DESIGN、ROADMAP 和当前 planning。
- [x] 复核 v0.4.2 的实际 delta、Release allowlist、版本身份与停止条件。
- **Status:** complete

### Phase 2: Candidate admission preflight

- [x] 对施工planning、临时对象、旧证据依赖和版本窗口对象完成inventory、风险分类与候选形成前迁移。
- [x] 保留旧planning、恢复材料和回滚线索；C0前不执行retirement删除。
- **Status:** complete

### Phase 3: Atomic v0.4.2 candidate materialization

- [x] 同步 CHANGELOG、ROADMAP candidate authority、package、Release/transition contracts、manifest hashes 和 bootstrap。
- [x] 新建 single-Discovery `v0.4.2` Cloud hard acceptance/operator guide，保持真实证据 PENDING。
- [x] 更新直接相关 tests，不修改无需求依据的 production/runtime 核心逻辑。
- **Status:** complete

### Phase 4: Local validation and handoff

- [x] 运行风险相称的 focused checks、完整 suite、Release build/check 和 deterministic double build。
- [x] 写回 planning 与candidate admission preflight状态，并准备范围单一的本地C0 commit。
- [x] 停止在 Source/Candidate Cloud 前，准备向维护者交接精确commit、教程和待push动作。
- **Status:** complete

### Phase 4.5: Release workflow authority convergence

- [x] 把ROADMAP冻结为Release四步、C0/C1/C2与两轮retirement checkpoint的唯一programme authority，并消除C1/publication及C2/第二检查点顺序冲突。
- [x] 让模板、治理指南、v0.4.2实例和Phase 4.14历史记录按各自职责引用ROADMAP稳定anchors，不再形成第二份current authority。
- [x] 增加防回归断言并运行focused与完整本地治理验证。
- **Status:** complete

### Phase 4.6: Post-PASS retirement ordering

- [x] 把验收前步骤冻结为只读`candidate admission preflight`，把第一轮真实退役移动到Source/Candidate PASS之后、C1之前。
- [x] 保留设计理由：失败前不删恢复线索；C1/C2各保存一轮真实退役结论；触及C0 Release输入时fail closed并重建C0重验。
- [x] 同步ROADMAP、模板、治理指南、v0.4.2 guide、Phase 4.14后续状态与治理测试。
- [x] 运行focused/full regression，确认改动仍被Release allowlist排除。
- **Status:** complete

### Phase 4.7: README manual Release commands

- [x] 补充可直接复制的`./dist`候选ZIP build/check/hash命令，并区分本地candidate文件名与GitHub正式资产名。
- [x] 明确标准bootstrap封板只修改`HOOKS_VERSION`与`HOOKS_SHA256`的条件，以及派生的package/URL和不得改动的固定安全字段。
- [x] 明确README本身属于Release allowlist；本次变更必须形成新C0并重新双构建/check，不得沿用旧candidate SHA。
- [x] 增加风险相称的README/Release契约与完整回归，保留用户未跟踪的`test.zip`，创建范围单一的本地commit。
- **Status:** complete

### Phase 4.8: README newcomer-friendly Release context

- [x] 在README首次出现C0/Source-Candidate/Release-excluded前，用大白话定义三个术语并提前链接ROADMAP权威流程。
- [x] 保留“README是ZIP输入，PASS后修改必须新C0重验”的fail-closed边界，但让原因在警告前可理解。
- [x] 更新契约测试、重新双构建/check和运行风险相称回归，创建新的本地C0 commit。
- **Status:** complete

### Phase 4.9: README governance status synchronization

- [x] ROADMAP 4.1只记录current train影响：README是Release输入、旧候选身份失效、Source/Candidate仍未运行。
- [x] Phase 4.14追加带时间语义的后续治理摘要，记录手工封板教程、新人术语顺序和候选双构建结果。
- [x] 增加治理断言并运行风险相称验证；确认ROADMAP/history仍被Release ZIP排除，创建本地commit。
- **Status:** complete

### Phase 4.10: Persistent maintenance environment profile

- [x] 新建带稳定anchor的维护机执行环境档案，区分observed fact、影响、默认路由、重验触发器和更新纪律。
- [x] AGENTS的默认本地/Cloud职责直接链接档案并只保留强制执行摘要；通过维护者接手入口保证人也能发现该档案。
- [x] 增加治理断言，确认环境事实不会只停留在planning、不会被误当永久Host/Product合同，并保持Release exclusion。
- [x] 运行风险相称验证并创建本地commit；Source/Candidate保持暂停。
- **Status:** complete

### Phase 4.11: Maintenance environment status synchronization

- [x] ROADMAP 4.1记录current train新增环境档案、双入口与跨阶段提升规则，不复制具体机器事实表。
- [x] Phase 4.14追加带时间语义的后续状态，解释为何planning/AGENTS内联事实不足，以及profile如何解决跨阶段记忆。
- [x] 增加治理断言并确认本轮仍为Release-excluded、Source/Candidate仍未运行，创建本地commit。
- **Status:** complete

### Phase 5: Source/Candidate channel checkpoint

- [ ] 维护者push并在独立Fresh Cloud完成4.1、B～E与9.1。
- [ ] 核对exact C0 HEAD、Linux零skip、ZIP identity、lifecycle、doctor/inventory/policy/residue原始证据。
- [ ] 真实PASS后执行第一轮retirement review；只有Release-excluded对象可在维护者明确决定后清退，任何C0 Release输入变化都回到新C0重验。
- [ ] 将Source/Candidate与第一退役检查的真实证据一起追加到guide并创建C1；否则按首次错误停止。
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
| PowerShell中把`rg`正则、空格与`|`混在双/单引号命令里导致解析或路径错误 | 3 | 停止复用复杂组合模式，改用简单`rg README tests`与逐个关键词查询；文件未修改。 |
| Windows PowerShell未展开传给`rg`的`init-cloud-sandbox-v*.bash` glob | 1 | 改为查询明确candidate文件或由PowerShell枚举；不重复把glob直接传给`rg`。 |
| README新人顺序正文完成后契约仍搜索旧连续警告句，导致误判顺序缺失 | 1 | 保留更自然的新文案，把测试定位收窄到稳定核心短语`它本身也是Release ZIP输入`。 |
| README提前增加ROADMAP入口后与后文原链接形成重复authority fragment，完整runner为153 pass / 1 fail / 26 skipped | 1 | 保留新人首次接触处的链接，把后文改成“上文链接的ROADMAP Release流程”，不弱化跨文档唯一入口断言。 |
| PowerShell不接受静态泛型调用`SequenceEqual[byte]`，双构建脚本在解析阶段退出 | 1 | 解析发生在临时目录创建前，无文件副作用；改用`Compare-Object -SyncWindow 0`比较字节序列。 |
| 恢复时组合检索使用的ROADMAP完整标题字面串与实际标题不一致，`rg`返回exit 1 | 1 | 已由短关键词定位实际`4.1`标题和Phase 4.14文件；工作树当时clean，无文件副作用。 |
| 环境档案测试补丁中的正则换行转义被`apply_patch`解析为非法hunk | 1 | 校验阶段即停止、无部分写入；改用不含换行转义的有界跨行模式并拆分补丁。 |
| 环境档案正文完成后聚焦测试仍1 fail：断言要求Source/Candidate先于Linux证据词出现 | 1 | 正文自然先列证据需求再给默认路由；拆为证据集合与Cloud路由两条断言，不反向扭曲文档。 |
| 第二次聚焦仍1 fail：断言把“跨阶段执行路由”错误要求在“不得只写planning”之后 | 1 | 按正文因果顺序收窄为“跨阶段执行路由→不得只记录在planning”，不修改已清晰的正文。 |
| 第三次聚焦仍1 fail：治理断言额外要求正文使用不存在的中文固定标签“持久环境档案” | 1 | 按3-strike重新收窄测试设计：分别断言“不得只留planning”和“提升到持久profile”两条直接合同。 |
| 环境状态同步正文后1 fail：ROADMAP断言倒置“重验触发器”与“跨阶段提升规则”顺序 | 1 | 保留自然职责顺序，拆为profile入口、重验触发器、跨阶段规则三个直接断言。 |

## Current Status

`V0_4_2_README_RELEASE_INPUT_READY / SOURCE_CANDIDATE_NOT_RUN / STOP_BEFORE_MAINTAINER_PUSH`
