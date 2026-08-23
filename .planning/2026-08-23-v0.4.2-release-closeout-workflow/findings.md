# Findings: v0.4.2 Release closeout workflow governance

## Confirmed maintainer intent

- 保留两个retirement review的时间检查点，但不保留强制standing Phase 9。
- 两个检查点嵌入Release流程，不产生额外Cloud黑盒轮次。
- 普通Release只运行Source/Candidate与Published Release两次Cloud验收，并分别进行两次仓库状态写回。
- Source/Candidate Cloud失败时修改、push并重跑；PASS后，正式验收tag精确指向该Cloud实际通过的candidate commit。
- 第一阶段状态commit只回补证据并推进分支，不替代tag身份；随后发布公开ZIP/bootstrap并启动第二阶段。
- 第二阶段PASS后回补Published evidence、Latest/postflight、第二retirement checkpoint与Release closeout。

## Stable safety interpretation

- 第一retirement checkpoint中的任何Release输入变更都必须发生在Source/Candidate之前；之后若Release输入变化，必须重跑第一通道。
- 第二retirement checkpoint不得改写已发布tag、ZIP、bootstrap、URL或SHA，只能治理退出角色窗口的材料。
- 历史P9-A～F保留原名和时间语义；新默认流程不从历史结构复制六轮施工。

## Scope guard

- 三份维护者补回的历史acceptance是只读reference fixtures，不进入commit。
- 本任务是文档治理，不改变package `0.4.1`、production、runtime、installer、contracts、manifest或Release allowlist。

## README / architecture authority recovery

- README把programme/版本列车/Cloud/Release状态唯一交给ROADMAP，把逐版本验收交给专项acceptance；因此取消强制Phase 9应落在ROADMAP和模板，不应改写README稳定行为。
- README与ARCHITECTURE都冻结：本地构建或源码字段不能建立Release；已发布tag、ZIP、bootstrap、URL、SHA与acceptance不可原位改写。
- Release封板顺序仍是冻结输入、构建ZIP/hash、写bootstrap/hash、发布、重新下载复验；本轮只能改变治理编排，不能改变该字节链。
- ARCHITECTURE没有把Phase 9定义为产品、Host或Release安全不变量；强制Phase 9属于programme治理结构，可从默认Release流程中移除而不触碰trusted graph。
- tag绑定Cloud实际PASS的candidate HEAD符合ARCHITECTURE的精确身份边界；后续状态commit只能作为分支治理证据，不能反向替代sealed candidate identity。

## DESIGN / ROADMAP recovery

- DESIGN把两套模板和治理测试定位为纯文档/仓库边界，验证路由是focused governance、anchors/fences、repository inventory与`git diff --check`；它不要求改production或Release builder。
- ROADMAP当前残留两处结构性耦合：4.3仍写“每条列车进入standing Phase 9”，Product Phase表仍把Phase 9列为每条未来列车必须重新进入的standing gate。
- ROADMAP 8.1已经正确拆开两次Cloud（步骤1/3）与两次维护者控制面动作（步骤2/4），也已说明retirement review不是Cloud acceptance；本轮应在这个基础上移除Phase编号容器，而不是改写四步字节/发布顺序。
- 推荐默认Release closeout：checkpoint 1（candidate readiness）→ Source/Candidate → immutable tag/Pre-release → Published Release → Latest/postflight → checkpoint 2（role-window closeout）。
- checkpoint 1可以复用Product Phase closeout的已完成review；小型patch/governance列车在candidate baseline closeout完成等价review。它是第一Cloud通道的准入条件，任何Release输入变更必须发生在其后重新验收前。
- checkpoint 2是Latest/postflight后的退出检查，治理退出candidate/accepted窗口的对象；不得改写sealed tag/assets。
- 历史v0.4.0/v0.4.1 P9叙述必须保持时间语义；只把未来默认规则改为Release workflow，历史P9-A～F继续作为已关闭实例证据。
- tag必须固定为`SOURCE_CANDIDATE_HEAD`（第一阶段Cloud实际PASS commit）；第一状态写回与最终closeout是后继分支commit，不成为tag目标。

## Operator Guide / Cloud template routing

- Operator Guide模板已经允许同一Release guide编排Source/Candidate与Published Release，并在前序通道后写channel checkpoint、全部范围后写final Post-run；无需新增文档类型。
- Operator Guide当前缺少两个retirement checkpoint在Release生命周期中的明确位置，也没有冻结“tag目标是第一Cloud通道实际PASS HEAD，状态commit不替代它”。
- Cloud hard template当前职责表、双通道合同、硬停止、执行顺序和第10节写回已经提供目标修改落点；稳定B～E和deep-check脚本无需变更。
- 本轮应只改Cloud template的治理文字与evidence schema，不改第4～9节可执行脚本，从而保持Cloud黑盒行为和Release输入不变。
- 第一状态写回应明确记录`SOURCE_CANDIDATE_HEAD`和channel checkpoint；其commit是branch evidence head，不要求或允许成为version tag目标。
- 第二状态写回应在Published PASS、Latest/postflight和checkpoint 2闭合后追加final Post-run并同步programme角色；两个状态写回不是新的Cloud通道。

## Repository governance implications

- repository governance 11.1仍使用“standing Release流程”措辞并只说review时点；应改为version-neutral Release closeout workflow，并明确两个review是同一guide/流程的进入与退出checkpoint。
- governance 12把promotion与eviction视为同一lifecycle transaction但允许不同commit/gate，正好支持Published PASS→Latest/postflight→checkpoint 2→final closeout，而无需standing Phase 9。
- retirement DoD继续有效；第二checkpoint只负责根据角色旋转执行/记录RETIRE/MIGRATE/KEEP，不改变immutable资产。
- 两次状态写回的默认边界应进入通用治理：第一笔记录Source/Candidate channel checkpoint，第二笔记录Published evidence、Latest/postflight、checkpoint 2与final Post-run；Pre-release/Latest本身仍是维护者控制面动作。

## Frozen implementation scope

- 修改：`ROADMAP.md`、`DESIGN.md`、两套Cloud/Operator Guide模板、`docs/repository-governance-guide.md`、两处治理测试与本planning。
- 不修改：README、ARCHITECTURE、AGENTS、MAINTAINER_HANDOFF、CHANGELOG、provenance、历史P9/acceptance、production、contracts、runtime、manifest、package、bootstrap或Release allowlist。
- 历史P9-A～F只作为已经关闭的实例保留；未来规则使用`Release closeout workflow`、`candidate-readiness checkpoint`和`role-window closeout checkpoint`。

## Existing test migration

- `architecture-contracts.test.js`已有一个版本无关的operator lifecycle test和一个ROADMAP governance test，是新增Phase 9负断言、双retirement checkpoint和tag-target正断言的首选位置。
- `repository-boundary.test.js`的文档生命周期case已保护模板anchors、channel/final写回与Release exclusion；可增加两个retirement checkpoint anchor、两次状态写回及candidate/tag身份边界。
- 版本专项P9断言属于历史lifecycle证据，必须保持；新负断言只能针对未来规则段落或精确旧规则句，不能禁止历史文档出现`P9`/`Phase 9`。
- Operator Guide适合在现有Pre-run与Final Post-run下分别增加entry/exit retirement子节，避免重排已经稳定的1～7主章节。

## Manual diff audit

- ROADMAP只删除未来programme表中的Phase 9 standing row和强制句；4.1/4.2及当前角色中的P9-A～F全部仍是历史事实。
- Cloud hard template diff只位于0.2、执行顺序说明和第10节evidence writeback；第4～9节B～E/deep-check脚本字节未触碰。
- 两个新Operator Guide anchor位于Pre-run后的entry checkpoint和Final Post-run内的exit checkpoint，未重排既有主章节。
- 所有未来规则中的`standing Phase 9`均为明确否定句；旧“进入自己的standing Phase 9”“每条未来列车重新进入”规则已经消失。
- 为了真正满足“两阶段commit head分别取名”，Operator Guide还应给两笔证据commit固定角色名/推荐message，并明确它们不要求自引用自身hash；Source/Candidate tag身份仍单独由`SOURCE_CANDIDATE_HEAD`承担。
