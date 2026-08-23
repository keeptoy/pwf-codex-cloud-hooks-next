# Task Plan: v0.4.2-dev document governance discovery

## Goal

在不改动production、Release字节或历史验收事实的前提下，冻结“一个Discovery轮次对应一轮有意义的黑盒验收”的文档治理模型，并在维护者批准后把v0.4.2作为专作文档治理的开发列车。

## Next Step

维护者核对本地commit后push本地`0.4.2`分支；当前任务停止，不进入package identity、Cloud或Release工作。

## Current Phase

Complete / local handoff

## Phases

### Phase 1: Recover evidence and define terms

- [x] 复核README、ARCHITECTURE、DESIGN、ROADMAP与现行Release/文档治理边界。
- [x] 比较single-Discovery与multi-Discovery历史实例及其验收材料。
- [x] 区分phase、Discovery、implementation gate、Cloud acceptance round与Release gate。
- **Status:** complete

### Phase 2: Propose the governance model

- [x] 提出“何时一轮验收足够、何时必须多轮验收”的候选规则。
- [x] 提出模板、phase runbook、operator guide、version acceptance各自职责。
- [x] 维护者采纳统一operator-guide、同文件Post-run回补与single-Discovery acceptance简化形态。
- [x] 维护者确认候选实施文件集；package保持0.4.1，v0.4.2仍是governance-only source train。
- **Status:** complete / GO

### Phase 3: Authorized documentation implementation

- [x] 仅在维护者批准方案后修改文档、治理测试与planning。
- [x] 保持历史acceptance时间语义，不批量重写已发生证据。
- [x] 不夹带production、兼容精简、Release或新feature工作。
- **Status:** complete / authorized exact scope

### Phase 4: Validation and local commit

- [x] 运行文档链接、authority、Release边界和风险相称回归。
- [x] 记录变更范围与未改变边界。
- [x] 创建单一范围本地commit，交由维护者push。
- **Status:** complete

## Key Questions

1. “一轮Discovery对应一轮黑盒验收”应按Product Phase、implementation delta还是Cloud风险边界计数？
2. 多gate通用模板应表达可组合的验收原语，还是默认要求每个phase机械跑完全部gate？
3. v0.4.0的F3B2/F3B3/F3C等多轮材料中，哪些是多Discovery必需证据，哪些只是当时operator分工产物？
4. 恢复的v0.3.4/v0.3.5/v0.4.0 acceptance应回到current tree、history还是仅作为本轮分析fixture？
5. v0.4.2-dev文档治理列车的最小DoD是什么，是否需要Cloud黑盒验收？
6. single-round `version acceptance`与multi-round `operator-guide`是否只保留命名差异，并共享同一pre-run→post-run→freeze生命周期？

## Decisions Made

| Decision | Rationale |
|---|---|
| 本地分支从已发布且同步的`0.4.1`创建为`0.4.2` | 用户明确授权；分支身份与候选package identity `v0.4.2-dev`分离，后者需讨论后冻结 |
| 本轮先Discovery和讨论，不直接批量改文档 | 用户明确要求先讨论；AGENTS要求潜在方案先提交意见、依据与影响范围 |
| 三个恢复的acceptance暂按用户未跟踪输入保留 | 不覆盖、不暂存、不提交，先判断它们应作为current authority、history还是分析fixture |
| 建议按正式Discovery Round而非版本/模板gate计数产品验收 | 与ROADMAP 7.2现有Round治理一致，并能解释v0.4.0多轮与v0.3.4单轮差异 |
| standing Release双通道与Product Round计数分开 | final source和public asset是两种不可合并的身份边界；瘦身不能削弱Published Release证据 |
| 暂不切换package到`0.4.2-dev` | 分支已隔离讨论；machine identity切换会建立真实Release义务，应等方案和是否发布决定冻结 |
| 候选统一`runbook`与`operator-guide`为`operator-guide` | 两者都承担可复制验收教程、停止条件和结果回补；统一命名能减少伪职责分层 |
| 候选让single-round version acceptance成为operator guide的简写形态 | 保留易发现的版本文件名，同时避免为简单版本建立多gate ledger或另一份证据文档 |
| 候选用“multi-Discovery version”替代“multi-gate version” | Discovery Round才是新claim与验收计数单位；gate仍保留为Round/Release内授权检查点 |
| 候选新增独立operator-guide结构模板 | Cloud hard template继续专注稳定执行协议，operator template专注一轮教程的文档生命周期，避免复制第二份脚本authority |

## Authorization

- 已授权：创建并切换本地`0.4.2`分支；只读分析；建立本Discovery planning。
- 已授权：新增Operator Guide模板；同步Cloud template、治理指南、DESIGN、两处治理测试和当前planning；相称本地验证与单一范围本地commit。
- 未授权：恢复文件入库、README/ROADMAP/AGENTS、production/contract/runtime/manifest/package identity修改、Cloud/Release、push及其他远端写。

## Stop Conditions

- 任一改动需要进入README、ROADMAP、AGENTS、production、contract、runtime、manifest或Release输入时停止并先请维护者扩展授权。
- 三个历史acceptance参考文件无法按原SHA-256恢复，或与本任务改动无法安全分离时立即停止，不提交。
- focused/full回归出现与本治理方案相关的真实失败时不弱化断言；先分类、记录并修正，未闭合前不创建commit。
- 本地commit后停止，等待维护者push；不执行任何远端写或Release动作。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell把`foreach {...} | Format-Table`解析为empty pipe element | 1 | 不重复该组合；先把循环结果赋给数组变量，再单独格式化输出 |
| Operator Guide failing-first中architecture守卫按预期因新模板缺失失败；repository守卫在sandbox内`repositoryPaths()`无法spawn Git并返回null | 1 | 保留architecture intentional-red作为有效前置证据；实现后在正常子进程执行面复验repository suite，不把sandbox限制记为产品失败 |
| 首轮focused复验为1 pass / 1 fail；repository lifecycle把三个用户补回的untracked reference acceptance计入current role window | 1 | 不弱化role-window断言、不提交或删除参考文件；最终验证时对三个exact文件做hash保护的临时隔离，结束后原位恢复 |
| 无旧anchor/术语命中的`rg`审计按标准语义返回exit 1，被组合命令报告为失败 | 1 | 结果本身证明零命中；后续零命中审计显式接受exit 1，不重复同一未分流命令 |
| 第二轮focused复验为1 pass / 1 fail；失败仅因“失败重试→活动planning”语义跨Markdown换行而测试要求同一行 | 1 | 将守卫改为有界跨行语义匹配，不强制写作换行；三个参考文件已在finally中按hash原位恢复 |
| 只读审计包装器把PowerShell here-string直接写进JavaScript编排层，触发`SyntaxError`且仓库命令未执行 | 1 | 改用JavaScript字符串数组拼接PowerShell脚本；未重复错误包装形式 |
| 临时锚点审计误以为新模板应使用`<a id=...>`，而仓库稳定合同及测试实际使用`<a name=...>` | 1 | 读取模板和测试确认等价选择后，保留仓库既有`name`合同并修正审计条件，不改production文档 |
| planning错误日志补丁依赖一条中文长行，因上下文/换行未精确匹配而未应用 | 1 | 改为只锚定稳定英文`Current Status`标题插入；未覆盖或重写账本 |
| focused复验把参考文件临时隔离到活动planning子目录，repository lifecycle守卫正确拒绝该额外路径（19 pass / 1 fail） | 1 | `finally`已按SHA-256原位恢复且无residue；下一次改用workspace外的系统临时目录，不弱化守卫 |
| workspace外隔离后focused复验仍为19 pass / 1 fail；新plan标题写成`Authorization Boundary`而合同要求精确`## Authorization` | 1 | 修正planning实例标题，并把用户已授权的Phase 4状态从`not authorized`改为`in_progress / authorized`；不改测试断言 |
| 修正Authorization后focused复验仍为19 pass / 1 fail；同一新plan缺少必需`## Stop Conditions` | 1 | 按三次错误协议直接读取完整守卫；确认仅要求Authorization、Next Step、Stop Conditions并一次补齐，不再逐项猜测 |

## Current Status

`V0_4_2_OPERATOR_GUIDE_GOVERNANCE_COMPLETE / LOCAL_COMMIT_READY / PACKAGE_IDENTITY_0_4_1`
