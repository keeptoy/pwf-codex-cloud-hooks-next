# Task Plan: v0.4.2 Release closeout / candidate-readiness

## Goal

不创建standing Phase 9，按版本无关Release closeout workflow完成`v0.4.2`从candidate admission preflight、C0与双通道Cloud到Latest promotion confirmation、第二退役检查和C2的完整闭环；每个阶段只在真实证据到达后推进。

## Next Step

请维护者逐项决定第二轮role-window清退范围；在明确决定前，v0.4.2 planning、v0.4.1 current guide/bootstrap和其他窗口对象继续`KEEP`。取得决定后写回真实RETIRE/MIGRATE/KEEP结论，完成C2 final Post-run与programme accepted/fallback轮转。

## Current Phase

Phase 7: role-window closeout / waiting for maintainer

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

### Documentation topology migration preflight

- [x] 给根目录与`docs/`文档登记受众、唯一职责、authority/history身份、Release ZIP关系、当前入链/测试依赖和建议目标目录。
- [x] 复核“根级全仓入口/跨领域authority”与acceptance、templates、governance、operations、history候选分区，排除没有共同生命周期收益的单文件目录。
- [x] 形成删除前入链inventory、稳定anchor策略、验证路由和Release影响分类；发现冻结v0.4.1 guide硬编码旧template路径后，收窄为只迁未冻结candidate的角色安全方案。
- [x] 将探路结论写入findings/progress，并提出ROADMAP 4.1与Phase 4.14的最小同步方案，等待维护者确认后再实施迁移。
- **Status:** complete

### Staged acceptance directory migration

- [x] failing-first更新lifecycle/path测试：新candidate必须位于`docs/acceptance/`，冻结accepted可在角色退出前保留legacy根路径，templates继续固定在`docs/`根。
- [x] 新建目录说明并移动未冻结v0.4.2 guide；原子更新candidate相对链接、current root docs、治理指南和活动planning，不改写v0.4.1 acceptance。
- [x] ROADMAP 4.1只记录current train迁移状态/退出点，Phase 4.14追加带时间语义的设计结论；README保持不变，避免新的ZIP输入delta。
- [x] 运行旧路径反向扫描、focused tests、完整suite、Release allowlist交叉检查、candidate build/check与`git diff --check`，创建范围单一的新C0 commit。
- **Status:** complete

### Phase 5: Source/Candidate channel checkpoint

- [x] 维护者push并在独立Fresh Cloud完成4.1、B～E与9.1。
- [x] 核对exact C0 HEAD、Linux零skip、ZIP identity、lifecycle、doctor/inventory/policy/residue原始证据。
- [x] 真实PASS后执行第一轮retirement review；只有Release-excluded对象可在维护者明确决定后清退，任何C0 Release输入变化都回到新C0重验。
- [x] 将Source/Candidate与第一退役检查的真实证据一起追加到guide并创建C1；否则按首次错误停止。
- [x] 修正Cloud template的C步骤能力协议：只读existence preflight可用Shell，创建/更新仍仅限apply_patch，禁止覆盖、commit、push或PR。
- **Status:** complete

### Phase 6: Published Release channel checkpoint

- [x] 维护者创建远端`v0.4.2` tag、Pre-release并上传versioned ZIP与ZIP外bootstrap；tag精确指向C0。
- [x] 维护者在独立Cloud完成Published Release setup、B～E与9.2，并明确整条通道PASS。
- [x] 给v0.4.2 guide补齐第二通道逐步教程、公开资产身份、9.2原始摘要与“本次实际从模板执行”的时间语义。
- [x] 同步provenance、ROADMAP current programme与测试；Published PASS后停止在Latest/postflight前，不提前执行第二退役检查。
- [x] 保留并验证维护者的sealed bootstrap改动，运行风险相称回归并准备本地publication checkpoint commit。
- **Status:** complete

### Phase 7: Latest confirmation and C2 closeout

- [x] 维护者push publication checkpoint，并把同一`v0.4.2` Release从Pre-release晋级Latest。
- [x] 联网核对公开Latest、tag source和双资产identity，评估是否可取消独立只读postflight。
- [x] 证据支持后更新ROADMAP Release流程与治理断言，把晋级成功确认和异常停止条件内嵌到UI操作，不再单列postflight。
- [ ] 由维护者逐项决定第二轮role-window清退对象；未明确授权的planning和冻结证据继续`KEEP`。
- [ ] 写回Latest promotion confirmation、第二退役检查和final Post-run，形成C2并同步programme角色。
- **Status:** waiting for maintainer

## Authorization

- 已授权：按已讨论并冻结的版本无关 Release closeout 路线继续下一步；创建活动计划，完成 candidate-readiness、v0.4.2 候选身份与本地/Cloud教程准备，并创建本地 commit。
- 已授权：在Source/Candidate前执行有界`Documentation topology migration preflight`，持久化分类、入链和迁移建议；未确认目标拓扑前不移动文件。
- 已授权：按preflight结论实施角色安全的分阶段acceptance迁移；本轮只移动未冻结v0.4.2 candidate，冻结v0.4.1和template路径保持不变，并同步ROADMAP 4.1、Phase 4.14、治理指南、测试与本地commit。
- 已授权：维护者确认C0 `d51f291566b5599cb21a9fc5c3f30fd1a1bbc74a`的Source/Candidate全部通过，允许直接回补PASS；同时微调C步骤验收模板，吸收本轮临时授权的有界只读Shell预检并形成C1本地commit。
- 已授权：维护者确认`v0.4.2`公开资产已经发布且Published Release Cloud整条通道通过，允许直接同步状态并补全版本验收手册；本地已seal bootstrap属于维护者改动，必须原样保留并核对公开资产。
- 已授权：维护者确认已通过GitHub UI把`v0.4.2`晋级Latest；允许联网核对一次，并在无异常时把取消独立只读postflight的理由写入ROADMAP Release小节以精简后续流程。
- 未授权：push、远端 branch/tag、Pre-release/Release、资产上传、Cloud task、Latest、部署或填写未发生的 PASS/URL/SHA。

## Stop Conditions

- 不创建或恢复 Phase 9/P9-A～F；第 9 节只是 ROADMAP 的通用 Release 章节。
- 正式验收tag只能精确指向已通过Cloud的C0，不得指向C1或后续治理分支HEAD；tag与publication仍由维护者执行。
- Latest promotion confirmation已经完成；维护者未逐项决定第二退役范围前，不删除planning或版本窗口对象，也不写accepted角色轮转、第二退役PASS或C2 final closeout。
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
| 迁移反向扫描把`rg --glob`选项放在`-- .`之后，导致选项被解析为文件路径 | 1 | 保留已取得的前半扫描结果；后续把所有glob选项放在pattern/path之前，正确完成current旧路径与标题复扫。 |
| C1正文后聚焦测试仍为12 pass / 2 fail：一条旧断言继续要求Source/Candidate未运行，另一条把自然文案`Shell不得`写成`不得通过 Shell` | 1 | 第一条按真实programme状态迁到PASS合同；第二条只修正测试词序，不扭曲已清晰的fail-closed正文。 |
| 第二次C1聚焦为13 pass / 1 fail：单条诊断断言把“只读Shell”错误要求在“临时授权”之前 | 1 | 按真实时间线拆成“首次安全停止→临时授权”和“只读preflight→后续PASS”两个直接断言。 |
| PowerShell把`v0.4.2^{}`解析成`v0.4.2^`，本地tag peel命令报ambiguous revision | 1 | 停止依赖本地缺失tag；改用GitHub Release API与`git ls-remote`只读核对远端tag和资产身份。 |
| 组合读取模板anchors时PowerShell `Select-String`双引号转义形成非法正则 | 1 | 改用简单`rg -n`定位行号，再按固定范围读取；没有修改文件或重复失败表达式。 |
| Published状态failing-first为12 pass / 2 fail | 1 | 两项均为预期缺口：ROADMAP尚未推进Published PASS、Phase 4.14尚无教程回补记录；随后先补正文再复跑。 |
| 正文后聚焦测试为12 pass / 2 fail，第二次为13 pass / 1 fail | 2 | 失败均来自测试把自然文案限定为固定距离或相反词序；拆为独立事实与稳定anchor断言，未扭曲正文。 |
| Web工具拒绝直接打开本仓库`api.github.com` Release/tag endpoints，返回safe-open internal error | 1 | 保留官方GitHub Docs作为协议依据；实际公开状态改用只读HTTPS请求，不重复同一失败调用。 |
| 单次PowerShell审计中Release-by-tag与Git-ref API分别返回504，导致两个派生字段为空 | 1 | 不使用空值；由成功的Latest endpoint核对Release/资产，另用`git ls-remote`核对tag source，避免重试同一路径。 |

## Current Status

`SOURCE_CANDIDATE_PASS / PUBLIC_ASSETS_VERIFIED / PUBLISHED_RELEASE_PASS / LATEST_PROMOTION_CONFIRMED / STOP_BEFORE_ROLE_WINDOW_CLOSEOUT`
