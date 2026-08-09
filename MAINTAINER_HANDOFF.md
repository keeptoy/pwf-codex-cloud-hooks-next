# 维护者接手导诊

本文件只负责新人接手顺序、常见误判和检测结果分流，不保存当前版本、提交、资产身份、逐 gate 状态，
也不提供第二份安装、Release 或回滚 runbook。先从
[README 的开发状态与文档地图](README.md#documentation-map)找到每类问题的唯一权威；本文件只告诉你
“先去哪一科、何时必须停”。

## 1. 新人五分钟接手

1. **先保护现场。** 只读确认仓库、分支和 dirty state；不能解释的未提交内容视为 unknown state，
   不覆盖、不清理，也不假设它属于上一位维护者。
2. **确认文档权威。** 按 README 的地图区分稳定行为、架构、实现设计、programme、变更历史和不可变
   证据，不从文件名或旧对话推断状态。
3. **确认本轮授权。** 打开 [.planning/.active_plan](.planning/.active_plan)，读取它指向的 task plan、
   findings 和 progress。只有活动 task plan 能回答当前 Next Step、允许事项、禁止事项和停止条件。
4. **定位改动边界。** 用
   [DESIGN 的模块职责与依赖](DESIGN.md#module-responsibilities)找到源码落点和验证路由，再用
   [ARCHITECTURE](ARCHITECTURE.md)复核系统职责、Host contract、trusted graph 与失败语义。
5. **先检测，再解释。** 从
   [README 的本地开发入口](README.md#local-development)选择相称检查；结果必须按本文第 4 节分类，
   绿色结果只是证据，不会自动扩大授权。

## 2. 高频情形导诊

| 你遇到的情形 | 阅读顺序 | 要回答的问题 |
|---|---|---|
| 收到源码或文档变更请求 | 活动 task plan → [DESIGN](DESIGN.md) → ARCHITECTURE | 这轮是否获准、改动落在哪个模块、是否触碰系统安全边界 |
| 安装、doctor 或 repair 异常 | [README](README.md) → ARCHITECTURE → 相关 contract/tests | 稳定操作入口是什么、结果属于 owned drift 还是未知现场 |
| 版本、Release 或回滚问题 | [ROADMAP](ROADMAP.md) → [CHANGELOG](CHANGELOG.md) → [BASELINE_PROVENANCE](BASELINE_PROVENANCE.md) | 当前角色、已发生 delta 与不可变身份是否被分开解释 |
| Cloud 事实或历史验收争议 | BASELINE_PROVENANCE → [docs 专项证据](docs/) | 争议属于当前 programme，还是带日期的 acceptance/runbook 快照 |

这张表不是第二份文档地图。若问题继续下钻，以目标 authority、machine contract、源码和测试为准，
并把本轮研究与验证分别记入活动 findings 和 progress。

## 3. 常见安全误判

- **源码 checkout、版本字段或本地 package 不等于 Release。** Release 身份和可回退资产必须由
  ROADMAP、provenance、对应 acceptance 与 machine contract 共同闭合。
- **本地检查或测试 PASS 不等于下一 gate 获准。** 它只满足当前 task plan 中明确的一项证据要求；
  activation、cutover、发布和回滚仍要单独授权。
- **Windows 的 platform limitation 或 SKIP 不替代 Linux/Cloud。** 保留诚实平台结论，把缺失的
  POSIX、权限、进程或真实 Host data 证据交给指定平台 gate。
- **global Skill 必须 pristine。** pinned upstream 中存在某文件，不代表它已被 importer 接纳、installer
  安装、Managed policy 注册或在 production 激活；完整信任边界见 ARCHITECTURE。
- **repairable 不等于所有 drift 都可修。** 只有已识别、owned 且可预览的差异才能进入 repair；
  blocker、身份不符或 unknown drift 必须保留现场并停止。
- **历史记录不是当前授权。** 旧对话、旧 runbook、旧 branch 名或曾经通过的 gate 都不能替代活动
  task plan；历史文档只证明当时发生过什么。

## 4. 能力与健康检测结果分流

| 信号 | 它意味着什么 | 能否继续 | 下一站 |
|---|---|---|---|
| unknown dirty state | 现场归属和意图尚不清楚 | 否；先保护现场并确认所有者 | 活动 task plan / 维护者 |
| importer failure | pinned 来源、overlay、manifest 或目标 inventory 至少一处不闭合 | 否；不要手改 imported runtime 掩盖错误 | DESIGN、provenance、相关 contract/tests |
| doctor healthy | 已检查的 installed managed state 满足该 doctor contract | 仅可继续当前已授权工作 | README、活动 task plan |
| doctor repairable | 差异已被识别为 owned 且存在受控修复路径 | 只有 task plan 允许并完成预览后 | README、ARCHITECTURE |
| doctor blocker / unknown drift | 现场超出受控 repair 边界，或身份无法可信解释 | 否；不得覆盖 | ARCHITECTURE、活动 findings |
| tests PASS | 已运行断言在当前平台和输入上通过 | 仅作为当前 gate 的一份证据 | DESIGN 验证路由、活动 progress |
| test failure | 失败尚未完成 product defect、test defect 或 fixture drift 分类 | 否；先用只读证据分类 | 相关源码、contract/tests、活动 findings |
| platform limitation / SKIP | 当前平台不能提供所需 primitive；并不证明产品通过或失败 | 可继续无关工作，缺失 gate 仍未完成 | README、ROADMAP、活动 task plan |
| deterministic package 或 Cloud gate PASS | 指定输入或平台证据已闭合 | 只推进明确授权的对应 gate | ROADMAP、provenance、专项 acceptance |

分类时先保留原始输出和平台条件。不得为了绿色摘要把 product defect 改名为 platform limitation，
也不得用 test defect 或 fixture drift 弱化 identity、containment、timeout、cleanup 等安全断言。

## 5. 停止条件与接手完成标准

出现以下任一情况时停止实施，先记录证据并请求维护者决策：

- dirty/unowned state 无法解释，或拟修改内容与用户已有改动重叠；
- README、ARCHITECTURE、DESIGN、ROADMAP、provenance、contract 或活动 plan 对同一事实给出冲突答案；
- 变更触碰 schema、Host ABI、trusted graph、安全模型、timeout、权限、进程或数据边界；
- activation、迁移、root commit、push、cutover、Release、rollback 或 Cloud 操作缺少明确授权；
- 当前 programme 判断与带日期的历史 acceptance/runbook 不一致，且无法确认是事实冲突还是时间语义。

完成接手不要求背诵某个版本或 hash，而是能够：

- 从 README 地图找到问题的唯一 authority，并从活动 plan 找到当前行动边界；
- 把请求映射到 DESIGN 中的模块，再用 ARCHITECTURE 说明为什么不能越过信任边界；
- 区分 repository source、Release artifact 与 installed managed runtime；
- 正确解释 doctor、importer、test、package 和平台结果，知道哪些只是一份局部证据；
- 在未知现场、authority 冲突或关键 gate 未授权时主动停止，并把证据送到正确文档。
