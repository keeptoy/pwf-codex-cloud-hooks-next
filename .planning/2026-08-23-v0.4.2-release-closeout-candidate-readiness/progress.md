# Progress: v0.4.2 Release closeout / candidate-readiness

## 2026-08-23

- 维护者确认继续下一步。
- 已把 active pointer 从完成的只读审计切换到本 Release closeout/candidate-readiness 计划。
- 当前停止点：Phase 1 authority recovery；尚未修改 production、contracts、package、bootstrap 或正式权威文档。
- 已完整恢复planning-with-files技能说明，并复读README、ARCHITECTURE、DESIGN与ROADMAP的Release/retirement边界；确认本任务不是Phase 9。
- 已读仓库治理指南与Operator Guide模板，完成25个planning scope的current入链扫描，并定位唯一待迁移的旧planning测试依赖。
- 已核对package、Release contract、installed-state transition、manifest和bootstrap身份传播；尚未实施正式文件变更。
- 已先更新候选角色/transition测试与旧planning证据依赖；聚焦runner首次被Windows sandbox以`spawn EPERM`阻断，已记录并改走单文件直接执行。
- 已完成candidate-readiness分类并把current测试的v0.4.1 P9-F证据依赖迁到immutable acceptance；本轮不批量删除planning。
- 已原子同步package 0.4.2、Release/transition contracts、manifest hashes、zero-hash bootstrap、CHANGELOG、ROADMAP与single-Discovery Release operator guide。
- 完整Windows runner PASS：180 tests / 154 pass / 0 fail / 26 skipped；skip仍全部为Linux/POSIX-only case。
- publication oracle聚焦复验PASS，确认transition中的v0.4.1 upstream canonical identity必须随accepted manifest精确轮转，不能只改version字符串。
- importer/compile/Node/Bash syntax、manifest hash、bootstrap delta与git静态检查PASS。
- v0.4.2候选双构建/check一致：22 entries、85,912 bytes、SHA-256 `4a059fa512a2c144cef42478d217935825ee7aca0599dca5582c62dd12df415c`；尚未seal、push或运行Cloud。
- 本地C0内容与Source/Candidate教程已准备完毕；exact commit hash由commit后的维护者handoff返回，避免文件自引用。
- 按维护者复核统一planning退役语义：治理指南新增稳定`planning-lifecycle` anchor；v0.4.2 guide把C2表述收窄为提醒维护者单独评审，所有相关scope当前保持`KEEP`，未经明确决定不删除。
- focused `node --test`再次被Windows sandbox以`spawn EPERM`阻断；错误与本计划已记录的runner限制相同，改用两个test文件直接执行，不重复失败路径。
- 在允许Node/git只读子进程的执行面重跑focused治理测试：22 tests / 22 pass / 0 fail；稳定anchor、跨文档fragment、planning lifecycle与Release治理边界均通过。
- 首次本地commit被workspace沙箱阻止创建`.git/index.lock`；文件内容未丢失，改在获准的Git写入执行面重试同一精确暂存集合。
- 维护者澄清长期意图后，先为ROADMAP→治理指南链接与planning非自动删除边界补failing-first治理断言；断言按预期因ROADMAP尚无该规则而失败。
- ROADMAP两轮retirement checkpoint现已直接链接治理指南Planning生命周期，并用大白话冻结：C0/C2、pointer切换、DoD或Git恢复点都不自动授权删除，维护者未明确决定的scope继续KEEP。
- focused治理回归PASS：22 tests / 22 pass / 0 fail；新增断言已保护ROADMAP链接、稳定anchor与planning非自动删除边界。

## 2026-08-24

- 维护者授权按只读审计结论继续：收敛Release workflow authority，修正C1/publication与C2/第二检查点顺序，并把current docs路由到ROADMAP稳定anchors。
- 已确认工作树clean且本地与`origin/0.4.2`同步；前两笔planning退役治理commit已由维护者push。
- 已先增加authority-link与canonical顺序防回归断言；focused runner得到17 pass / 5 fail，失败全部对应预期缺口：三份current通用文档、v0.4.2实例、Phase 4.14历史入口尚未链接ROADMAP，且ROADMAP两张流程图仍是旧顺序。
- 已把ROADMAP两张流程图统一为C0→Source/Candidate PASS→C1→tag(C0)/publication→Published PASS→Latest/postflight→第二检查点→C2；消除了C1/publication与C2/第二检查点的相反顺序。
- Operator Guide模板、Cloud hard模板、治理指南和v0.4.2实例已链接ROADMAP两个稳定anchors并收窄为各自职责；Phase 4.14保留历史讨论快照，但明确不得作为current执行顺序。
- focused治理回归PASS：22/22；完整Windows suite PASS：180 tests / 154 pass / 0 fail / 26 skipped，skip仍全部是既有Linux/POSIX-only证据缺口。
- authority收敛完成，活动计划回到Phase 5；Source/Candidate仍未运行，最新本地commit形成后才交维护者push。
- Release allowlist交叉检查为`PWF_AUTHORITY_GOVERNANCE_RELEASE_INPUT_DELTA=NONE`；本轮只改变Release-excluded治理文档、planning与tests，候选ZIP输入和既有本地ZIP identity不变。
