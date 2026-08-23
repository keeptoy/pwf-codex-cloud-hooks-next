# Progress: Phase history renumbering

## 2026-08-23 — Entry

- 维护者授权统一Phase 4后段历史编号。
- 已完整读取planning-with-files skill并运行session catchup。
- 入场确认分支`0.4.2`；工作树已有维护者将4份历史验收教程移入`临时文件/`的独立改动。
- 已建立独立planning scope并明确排除临时参考、production和Release inputs。
- 已按README→ARCHITECTURE→DESIGN→ROADMAP顺序复核宏观authority及history单一入口，并枚举三个目标history文件、相邻4.11、history索引和全仓引用。
- 已冻结rename graph：旧v0.4.0 Phase 9→Phase 4.12，旧path-safety 4.12→4.13，旧Release governance 4.13→4.14。
- 已确认迁移只重编号warm history；旧P9-A～P9-F gate名与历史planning语义保持原样，canonical anchor更新时保留旧fragment alias。
- 已记录`临时文件/`7份参考的入场长度与SHA-256，后续不修改、不暂存。
- 已复核旧P9文件尾部：最末事实是`P9_F_SECOND_RETIREMENT_PASS`，适合在其后追加独立renumbering尾注，不会插入或改写当时gate流水。
- 已定位repository边界测试中的4处目标读取与2个编号专用case；同时发现现有测试仍要求维护者已移入临时目录的F3 guides存在，后续全量验证将用可逆夹具临时恢复而不放宽合同。
- 已更新repository failing-first合同，冻结新4.12 Release discovery的canonical/compat anchors与renumbering尾注，并把path-safety、Release-governance专用case顺延为4.13、4.14。
- 首个整块test补丁因JS编排字符串把正则`\n`解释成换行而被完整拒绝；拆成三个小补丁并正确转义后，`node --check`通过。
- failing-first精确取得3 tests / 0 pass / 3 fail，全部失败于新4.12、4.13、4.14路径尚不存在，没有混入断言漂移。
- 三个history文件已按4.12～4.14顺延；新canonical anchors已加入，path-safety与governance的旧section anchors作为alias保留。
- 旧Phase 9摘要已在P9-F结论之后追加独立renumbering note；正文开头改成明确的原始时间语态，P9-A～P9-F名称、证据和anchors未改写。
- history索引、ROADMAP当前历史分流、Phase 4.11 successor note与Phase 4.14内部链接已转向新canonical路径；排除planning历史后，current docs/tests不再引用三个旧文件名。
- 一次只读heading审计因PowerShell双引号嵌套导致`rg`pattern被截断；命令前半段已输出status/diff，无文件写入，后续改用单引号。
- 第二次复合heading查询仍被PowerShell拆分，但已返回全部新旧anchor行，确认canonical与compat alias并存；后续不再复用该复合pattern。
- materialization后3个目标治理测试全部PASS；新路径、4.12尾注、P9证据anchors、4.13 path-safety与4.14 Release-governance合同闭合。
- 语义复查确认current docs/tests旧路径命中为0；仅已关闭planning保留当时的old naming陈述，不作为活引用改写。
- 发现两处需要最小校准：4.13应指出当时Phase 9现回顾性编号4.12；4.14应移除“相邻编号尚未补写”的旧前提，改为不接管4.12/4.13证据。
- 两处语义校准已完成；Phase 3 materialization与current-reference同步闭合，进入本地验证。
- 可逆临时参考夹具下，focused governance为22/22 PASS；完整`npm test`为184 tests、158 pass、0 fail、26个Windows平台诚实skip。
- 静态审计PASS：`git diff --check`无输出；new/old history路径图正确；current docs/tests旧路径命中0；Release artifact重叠0；package仍为`0.4.1`。
- `临时文件/`已恢复为入场7文件布局；3份acceptance SHA-256与入场值一致，4份tracked guide Git blob与HEAD一致，系统临时区无夹具残留。
- 首次提交前scope校验因把3个rename source也要求出现在`--name-only`结果中而主动中止；Git只列canonical target，未创建commit且用户文件未暂存。后续改为canonical path与rename status双重核对。
- 修正后的提交前审计确认11个canonical paths、3条Git rename与0个用户临时移动；已创建单一范围本地commit `docs: renumber phase history sequence`，未执行push。

## Current Status

`PHASE_HISTORY_RENUMBERING_COMPLETE / LOCAL_COMMIT_ONLY / USER_TEMP_REFERENCES_EXCLUDED`
