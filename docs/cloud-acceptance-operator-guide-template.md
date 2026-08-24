<a name="cloud-acceptance-operator-guide-template"></a>

# Cloud acceptance Operator Guide template

本文件规定“一轮验收教程”怎样写、怎样从执行前状态回补channel checkpoint与最终结果，以及何时冻结。它不保存任何版本、
commit、资产 SHA、当前 PASS/PENDING 或 programme 角色，也不复制
[`Cloud hard acceptance template`](cloud-hard-acceptance-template.md)中的稳定 Source/Candidate、Published Release、
B～E、deep-check 或 hard-stop 协议。

programme级Release四步、C0/C1/C2身份顺序只读
[`ROADMAP`](../ROADMAP.md#release-four-step-flow)，两个retirement checkpoint的进入/退出时点只读
[`ROADMAP`](../ROADMAP.md#version-train-two-retirement-reviews)。本模板只把这些programme检查点投影成guide章节、
channel checkpoint与final Post-run写入格式，不建立第二份宏观流程权威。

`operator guide`是统一的内容职责：它既是维护者执行教程，也是执行完成后不可变证据的容器。
`acceptance`不是第二种文档；single-Discovery版本可以沿用更短、容易发现的
`vX.Y.Z-cloud-hard-acceptance.md`文件名。multi-Discovery版本则让每个正式Discovery Round拥有一份
`vX.Y.Z-<round>-operator-guide.md`。

本模板只适用于未来新建或仍在施工的文档。已经发布或关闭的acceptance、runbook与operator guide保留
原文件名和时间语义，不批量重命名、重排章节或回写新模板。

<a name="operator-guide-document-lifecycle"></a>

## 0. 文档生命周期与使用规则

```text
Discovery decision
  -> materialize one operator guide with Pre-run status
  -> Release only: complete non-destructive candidate admission preflight
  -> maintainer executes the exact tutorial or first declared channel
  -> Release only after Source/Candidate PASS: complete source-candidate closeout retirement checkpoint
  -> if more declared channels remain: append a channel checkpoint, write C1, and stop
  -> maintainer completes the remaining authorized channels
  -> Release only: complete GitHub Release Latest promotion confirmation and role-window closeout retirement checkpoint
  -> append exact Final Post-run status to the same file
  -> freeze the guide
  -> retire it to immutable history after its role window closes
```

适用规则：

1. 正式Discovery Round才是新增Product验收文档的计数单位。Gate是Round内部或Release closeout workflow中的授权、
   停止与晋级检查点，不是验收轮数；每条实际发布列车使用的Release guide也不自动增加Product Discovery Round。
2. 一个 operator guide 可以编排多个 gate、Cloud task 或 stage；复杂状态DAG不需要按task拆成多份guide。
3. 纯 aggregate、evidence closure或retirement closeout若只汇总已经冻结的证据，不新建operator guide，
   也不重复黑盒。
4. no-live/repository-only Round可以使用本模板，但Post-run结论必须明确限定为no-live，不能冒充Cloud live。
5. Release Source/Candidate与Published Release是两个独立通道，可以由同一份Release operator guide按前后
   阶段编排；两者不计作两个Product Discovery Round，也不要求拆成两份guide。
6. Pre-run guide只保存已经审核的claim、exact输入、教程、停止条件和`PRE_RUN_READY / LIVE_NOT_RUN`。
   不预填运行输出、测试数量、PASS或Post-run evidence。
7. 多通道guide在一个通道真实PASS后可以追加channel checkpoint；它只保存该通道exact evidence和下一gate停止点，
   不会冻结guide，也不授权publication、promotion或后继通道。
8. Final Post-run status只在guide声明范围全部取得明确最终状态后追加。失败重试、第一次错误、恢复位置和Next Step
   继续写活动 planning；guide只保存最终结论及理解该结论必需的偏差。
9. Final Post-run追加完成后冻结。后继模板改进不批量回写；只允许有证据的事实纠错或immutable link repair。
10. 若执行前后product bytes、协议、risk claim、exact source或停止条件发生实质变化，当前guide失效；回到
   Discovery判断是新Round还是同Round的新候选，不能直接改写预期后继续记PASS。
11. Operator guide、版本acceptance和本模板必须被Release、installed inventory与trusted execution graph排除。

普通Release按上述ROADMAP入口进入版本无关closeout，不要求另建standing Phase 9或把历史P9-A～F复制为六轮任务。
本模板中的candidate admission preflight与两个post-PASS retirement章节只承接同一流程的对象治理，不是额外Cloud通道、
Discovery Round或guide。preflight只读盘点，不是第三轮retirement review。

生成具体guide时复制下面第1～5节，替换所有`<...>`；任何仍未解析的输入都必须fail closed。第6节只在
多通道guide的前序通道真实PASS后追加，第7节等声明范围取得最终状态后再追加。

<a name="operator-guide-positioning"></a>

## 1. 定位与 Discovery claim

具体guide必须用大白话回答：

- 本轮属于哪个Product Phase、版本列车和正式Discovery Round；
- 本轮新增或改变哪个risk/behavior claim；
- 为什么现有已冻结证据不能覆盖它；
- 本轮明确不证明什么，以及PASS后停在哪里；
- 本轮是Cloud live、Source/Candidate、Published Release、no-live，还是这些通道的有序组合。

推荐开头结构：

```markdown
# <version / round> <purpose> Operator Guide

本轮只验证<one bounded claim>。它不授权<next gates / Release / promotion / cleanup>。

执行关系：
<exact stage/task graph>
```

single-Discovery版本专项acceptance使用相同结构，只把文件命名为
`vX.Y.Z-cloud-hard-acceptance.md`；multi-Discovery版本的每个正式Round使用
`vX.Y.Z-<round>-operator-guide.md`。不要再建立一份把所有Round全文重新拼接起来的巨型version acceptance。

<a name="operator-guide-exact-inputs"></a>

## 2. Exact inputs 与前置条件

只列本轮执行实际依赖且可核验的输入，例如：

| Input | Exact value / authority | Admission check |
|---|---|---|
| source / runtime source | `<immutable commit or approved checkout>` | `<exact command/output>` |
| workspace lifecycle state | `<branch/ref/commit/plan>` | `<cleanliness and relation check>` |
| candidate/public asset | `<filename, immutable URL, size, SHA>` | `<checksum/boundary check>` |
| Host/Cloud prerequisite | `<environment, Node major, CODEX_HOME>` | `<controlled probe>` |

规则：

- moving branch、`latest`、cache receipt、模型声明或本次构建自行产生的“expected”值不能充当external identity；
- dynamic URL/SHA、当前授权、失败记录和恢复位置仍由活动task plan控制；guide只在执行身份冻结后写入exact值；
- 通用Cloud步骤直接链接
  [`Cloud hard acceptance template`](cloud-hard-acceptance-template.md)的稳定anchor；只有本Round特有状态机、
  负向case或身份关系才在guide内物化；
- unresolved placeholder、dirty worktree、identity drift或前置通道缺失时停止，不进入执行教程。

<a name="operator-guide-execution-tutorial"></a>

## 3. 执行教程

按操作者实际顺序写成可复制协议，而不是实现历史：

1. 维护者本地preflight与需要的push/ref动作；远端写仍由维护者执行；
2. Cloud environment/setup/maintenance配置；
3. task/stage顺序以及哪些必须Fresh、UserPromptSubmit或real Resume；
4. 每个stage允许的唯一workspace mutation；其余步骤默认只读；
5. production probe、doctor、inventory、policy、residue与evidence record；
6. 最终回传格式和明确停止点。

如果稳定B～E或deep-check没有变化，只引用模板anchor并说明本轮选择哪些通道，不复制脚本或提示词。
如果Round有独特DAG或tamper/rollback状态机，guide可以保持自包含，但必须清楚区分expected关系与actual evidence，
不能让手册常量自行证明PASS。

长命令只有取得明确最终`exit_code`后才能分类。stdout/stderr分片、session id、running状态、首次等待超时或
暂时静默都不代表完成；无法取得最终状态只能进入`POST_RUN_INCOMPLETE`。

<a name="operator-guide-evidence-and-stops"></a>

## 4. 证据与停止条件

每个具体guide至少冻结：

- exact source/runtime/workspace/asset identity；
- 实际执行的task/stage和最终exit code；
- Host黑盒原始观察中与本轮claim直接相关的字段；
- production probe、doctor、inventory/policy/residue或本轮专用machine oracle；
- 首次失败是否改变环境，以及是否按规则从Fresh重新开始；
- 本轮最终结论、未证明事项和下一gate不授权边界。

共同硬停止：identity/worktree漂移、无最终exit code、模型越权修改/commit/push/PR/Release、自动修复后继续记PASS、
doctor不健康、expected/actual关系不一致、需要修改production/contract/Host ABI/trusted graph才能继续。
具体Round应在此基础上增加自己的fail-closed矩阵。

<a name="operator-guide-pre-run-status"></a>

## 5. Pre-run status

具体guide在执行前以带日期的Pre-run section收口：

```text
<ROUND>_PRE_RUN_READY / LIVE_NOT_RUN / <STOP_BEFORE_NEXT_GATE>
```

这里可以记录已完成的本地materialization、failing-first、exact ref/path关系、candidate identity和维护者待执行动作，
但不得出现尚未实际取得的Cloud PASS、Post-run output或promotion结论。

<a name="operator-guide-candidate-admission-preflight"></a>

### 5.1 Release entry：candidate admission preflight

Release guide进入Source/Candidate前必须完成一次非破坏性preflight：只读inventory、分类未来可能退役的对象、核对恢复证据并
标记风险，不删除planning、恢复材料或回滚线索。Product Phase final closeout已经形成的对象账可以引用；不进入独立Product
Phase的小型patch/governance列车则在candidate baseline closeout形成等价盘点。这样第一通道失败时，排错现场与回滚路径仍完整。
该preflight只建立第一Cloud通道准入，不创建新的Cloud task、验收轮次或删除授权。

<a name="operator-guide-channel-checkpoints"></a>

## 6. Channel checkpoints（多通道 guide）

本节只用于一个guide明确声明了两个或更多顺序通道，而且前序通道已经真实PASS、后序通道尚未授权或尚无身份输入的情况。
例如Release guide在Source/Candidate完成、公开资产尚不存在时追加：

```text
SOURCE_CANDIDATE_PASS / PUBLISHED_RELEASE_NOT_RUN / STOP_BEFORE_PUBLICATION
```

channel checkpoint必须绑定已完成通道的exact identity、最终exit code、关键原始证据与明确停止点。它不会冻结guide，
不表示全部声明范围PASS，也不能授权维护者publication、Published Release、Latest或role rotation；下一步授权仍只读活动plan。

<a name="operator-guide-source-candidate-closeout-retirement-checkpoint"></a>

### 6.1 Source/Candidate closeout：source-candidate closeout retirement checkpoint

Release guide只有在Source/Candidate Cloud真实PASS后，才执行第一轮`RETIRE/MIGRATE/KEEP`审查，并在C1中保存已经实际形成的
结论。只有Release-excluded planning、临时教程和脚手架适合在这里提出清退；planning删除仍需维护者按
[仓库治理指南的Planning生命周期](repository-governance-guide.md#planning-lifecycle)明确决定。

若拟退役动作会改变package、contract、runtime、bootstrap、ZIP allowlist或其他C0 Release输入，必须fail closed：不得沿用
原PASS或直接写C1，必须形成新C0并重新运行Source/Candidate。大白话：可以在验收前列出“以后可能删什么”，但只有PASS后
才能做第一次真实退役检查；触及已验收字节就必须重新验收。

按ROADMAP的C0→C1→C2顺序，Release guide必须把`SOURCE_CANDIDATE_HEAD`写成正式tag的唯一目标，它必须等于Source/Candidate实际Cloud PASS的完整commit。
第一阶段状态写回commit记录该channel checkpoint与第一轮真实退役结论并推进治理分支，不替代经过Cloud验收的tag目标；维护者即使先push
状态commit，也必须把tag显式固定到`SOURCE_CANDIDATE_HEAD`。该状态写回后，guide保持开放并等待immutable publication
与第二通道，不把分支新HEAD冒充候选身份。

这笔证据commit在Git历史中的角色名是`SOURCE_CANDIDATE_CHECKPOINT_HEAD`，推荐message为
`docs: record <version> source candidate acceptance`。commit无法在自己的内容中自引用最终hash；创建后由本地handoff
返回exact HEAD，并把它作为第二阶段guide/workspace的治理输入，但它始终不是version tag target。

正常等待维护者完成publication或建立后序通道identity不是`POST_RUN_INCOMPLETE`。只有本应取得当前通道最终状态，
却因session丢失、环境/权限中断或证据无法绑定而不能分类时，才使用最终状态中的INCOMPLETE语义。

<a name="operator-guide-final-post-run-status"></a>

## 7. Final Post-run status

Final Post-run status只在guide声明范围全部闭合后追加；Pre-run guide中不得预建或预填。状态只能是：

- `POST_RUN_PASS`：全部必需task/stage和最终证据闭合；
- `POST_RUN_FAIL`：取得明确非零/反例，且本轮claim未成立；
- `POST_RUN_INCOMPLETE`：无最终状态、环境/权限中断或证据无法绑定，禁止猜测PASS/FAIL。

<a name="operator-guide-release-exit-retirement-checkpoint"></a>

### 7.1 Release exit：role-window closeout retirement checkpoint

Release guide只有在Published Release Cloud PASS、维护者完成同一Release的GitHub Release Latest promotion confirmation后，才执行
第二轮`RETIRE/MIGRATE/KEEP`审查。它确认新accepted与immediate fallback可恢复，并治理退出candidate/accepted窗口的
本地版本材料、oracles与compatibility transition；不得删除、移动、重建或重传sealed tag和资产。该审查必须先于C2，
使最终状态commit能够保存真实检查点结论。

正常路径中，维护者在GitHub Release编辑页面取消Pre-release并设为Latest，保存后返回或刷新GitHub Release详情页，确认
exact版本显示为Latest且不再是Pre-release，就完成GitHub Release Latest promotion confirmation，不再单列read-only postflight。
这里不是指Codex Cloud、GitHub Actions、资产上传页或任意窗口“未报错”。若保存结果未知、Release详情页状态矛盾、Latest
指错版本或观察到tag/资产变化，必须停止并按ROADMAP执行有界只读诊断，不能进入C2。

第二阶段状态写回commit负责保存Published evidence、GitHub Release Latest promotion confirmation、第二检查点与final Post-run，并同步ROADMAP中的
programme角色。两次状态写回只是仓库证据闭合，不是两次额外Cloud验收；真正的Cloud执行仍只有Source/Candidate与
Published Release两个通道。

这笔最终证据commit在Git历史中的角色名是`PUBLISHED_RELEASE_CLOSEOUT_HEAD`，推荐message为
`docs: close <version> published release acceptance`。它成为治理分支的Release closeout HEAD，但不改写已经固定到
`SOURCE_CANDIDATE_HEAD`的tag或任何sealed资产。

追加内容最少包括：执行日期、exact identity、实际task/stage矩阵、关键原始输出摘要、最终exit code、偏差、
未授权边界和一个可机器搜索的最终marker。不要复制活动planning中的逐次重试流水。

Final Post-run status追加并通过本地治理验证后，该guide冻结。若结果推动programme、Release或rollback角色变化，
再分别同步ROADMAP、provenance或CHANGELOG；不能由guide的PASS自动推导这些角色。

## 8. 模板的非权威边界

- 本模板不证明任何Discovery、Cloud task、commit、tag、Release、promotion或rollback已经发生；
- 本模板不进入Release ZIP、installed runtime、Managed policy或production trusted graph；
- 当前授权只读活动task plan，programme角色只读ROADMAP，published identity只读provenance；
- 历史runbook/operator guide/acceptance保持其原名和时间语义，本模板只约束未来实例。
