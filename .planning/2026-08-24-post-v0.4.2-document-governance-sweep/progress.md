# Progress Log: post-v0.4.2 文档治理扫尾 Discovery

## Session: 2026-08-24

### Phase 1: Recovery and planning lifecycle correction

- **Status:** complete
- 恢复并核对 v0.4.2 closeout planning、活动 pointer、工作树和分支同步状态。
- 通过 `git blame`、pickaxe、commit diff 与 lifecycle helper 追溯唯一-scope断言。
- 确认该断言由 commit `33deb58` 在清退 24 个非活动 scope 后新增；此前稳定治理和 validator 均允许规范 inactive scope。
- 维护者明确判断该要求属于防范过度：复杂项目允许多轮 Discovery planning 并存，由维护者控制可见清退。
- 新建 `.planning/2026-08-24-post-v0.4.2-document-governance-sweep/` 三件套并切换 `.planning/.active_plan`。
- 保留 `.planning/2026-08-23-v0.4.2-release-closeout-candidate-readiness/`，未删除或改写旧账本。
- 从 `tests/repository-boundary.test.js` 删除“planning scope列表必须严格等于active pointer”的快照要求；其余 lifecycle 校验保持不变。

### Phase 2: Targeted documentation/test residue inventory

- **Status:** complete
- 下一步盘点 current tests 对 v0.4.2 临时授权时间线、C2/Phase 9/固定数量和版本角色快照的直接依赖。
- 实际批量治理尚未授权；先形成 RETIRE/MIGRATE/KEEP 建议。
- 第一轮定向扫描完成：确认stable template的只读Shell安全边界断言应保留；标出v0.4.2临时授权事故措辞、`24个`C2数量和可能不可达的v0.4.1 candidate/P9分支作为进一步核对对象。
- 第二轮核对确认v0.4.1 candidate/P9大分支已不可达：candidate由当前package version生成，v0.4.1 current guide已清退，历史P9-F与fallback恢复另有immutable test/oracle负责。旧candidate分支建议整体RETIRE；v0.4.1 predecessor contract和fallback oracle继续KEEP。
- 第三轮核对确认release-package中的P9-B条件已被通用exact-SHA规则覆盖；Phase 4.12六个旧`phase-9-*` anchors无真实入链、仅测试自证，符合pre-1.0兼容别名清退候选。Phase 4.14已有稳定anchors，逐段自然语言断言可迁移为结构/authority检查。
- 退役路径复扫发现CHANGELOG v0.4.1仍相对链接已清退guide，属于确定断链；应迁移到provenance已使用的exact immutable acceptance URL。ROADMAP 4.1的临时授权细节属于真实但重复的current摘要，可在后续authority收敛中缩写并链接历史。
- 精炼全仓相对链接审计覆盖45个tracked Markdown入口后确认2条真实missing targets：CHANGELOG中的v0.3.4与v0.4.1本地acceptance链接；现有本地fragment为0个缺失显式anchor。建议修复链接并新增版本无关的实际link-integrity test，避免只测试治理文案。

### Phase 3: Broader documentation authority and link sweep

- **Status:** complete
- 完成README/ROADMAP、governance、templates、current acceptance、history与tests的职责/引用交叉核对。
- 冻结两档建议：Batch A处理确定死分支、事故措辞断言、一次性数量、无入链aliases、真实断链和通用link audit；Batch B可选收敛Phase 4.14的50个自然语言断言与ROADMAP重复事故摘要。

### Phase 4: Maintainer decision and scoped implementation

- **Status:** complete
- 维护者已批准先Batch A、后Batch B并允许分轮实施。
- Batch A实施前反向枚举Phase 4.12正文，发现同类`phase-9-v0-4-0-*`anchors实际为21个，不是初扫由测试暴露的6个；21个均无真实文档入链，7个仅测试自证、14个仅有定义。
- 为避免只清一半同类包袱，已暂停正文/test修改，等待维护者确认把该项扩大为21个原子清退；其余Batch A范围不变。
- 维护者确认21个完整清退范围后开始Batch A：两条CHANGELOG断链已迁到immutable URLs；21个旧anchors和尾注兼容承诺已移除；事故/数量断言收窄为C2语义；不可达v0.4.1 P9分支删除175行；P9-B重复条件删除；通用Markdown path/anchor审计已加入。
- 首次focused测试为18 tests / 17 pass / 1 fail；唯一失败是Phase 4.12尾注测试仍期待旧“保持”措辞，新link audit和Release package均已PASS。按新稳定语义修正断言，不恢复aliases，等待重跑。
- 迁移尾注断言后focused测试18/18 PASS；Phase 4.12正文历史、v0.4.1 immutable P9-F、current accepted身份、Release package和新Markdown link/anchor audit均通过。
- 完整Windows suite PASS：182 tests / 156 pass / 0 fail / 26 skipped；新增第182项为版本无关Markdown local path/explicit-anchor审计。
- Batch A最终静态审计PASS：6个changed paths与Release inputs交集0；Phase 4.12旧anchor definitions=0；CHANGELOG退役local links=0；dead v0.4.0/v0.4.1 candidate branches=0；`git diff --check`通过。
- Batch A停止在独立commit前；Batch B按维护者“先A后B”要求留到下一轮，不夹入本次变更。
- Batch B把Phase 4.14 current regression由89行收敛为57行：保留20个显式anchor、核心Release/retirement/C0-C2不变量、三条ROADMAP authority links、history index入口与Release-excluded边界；移除逐段自然语言和事故措辞快照。Phase 4.14正文及v0.4.2 acceptance均未改写。
- ROADMAP 4.1把C步骤事故过程压缩为稳定工具能力结果，并只链接immutable v0.4.2 acceptance。首次加入Phase 4.14直达链接后触发“两处受控宏观history入口”断言，已撤回该第三入口且不削弱历史可达性。
- Batch B focused复跑24/24 PASS；完整Windows suite 182 tests / 156 pass / 0 fail / 26 skipped。最终静态审计：5个changed paths（含三件planning账本）与Release inputs交集0、20个Phase 4.14 anchors缺失0、Phase 4.14正文diff 0、ROADMAP history links保持2、`git diff --check`通过。

## Test Results

| Test | Expected | Actual | Status |
|---|---|---|---|
| Focused repository boundary test（沙箱首次尝试） | 多个规范 planning scope 通过；pointer/三件套/状态安全仍受保护 | Node test runner 在加载测试前因 child-process `spawn EPERM` 退出；没有产生产品断言结果 | ENVIRONMENT_BLOCKED |
| `node --test tests/repository-boundary.test.js`（非沙箱执行面） | 多个规范 planning scope 通过；pointer/三件套/状态安全仍受保护 | 14 tests / 14 pass / 0 fail | PASS |
| `npm test` | 无 production/runtime 回归；多个规范 planning scope 被稳定 validator 接受 | 181 tests / 155 pass / 0 fail / 26 skipped；skip均为既有Linux/POSIX-only case | PASS |
| Batch A focused | history/acceptance/link/Release package边界保持且旧快照退役 | 18 tests / 18 pass / 0 fail | PASS |
| Batch A `npm test` | 无production/runtime/Release回归 | 182 tests / 156 pass / 0 fail / 26 skipped | PASS |
| Batch A static/Release audit | 无旧anchor/断链/dead branch；Release输入不变 | 4项残留计数均0；Release input intersection=0 | PASS |
| Batch B focused | 稳定anchors/authority/宏观history入口保持；不锁定事故措辞 | 24 tests / 24 pass / 0 fail | PASS |
| Batch B `npm test` | 无production/runtime/Release回归 | 182 tests / 156 pass / 0 fail / 26 skipped | PASS |
| Batch B static/Release audit | Phase 4.14正文和Release输入不变；20个稳定anchors齐全；ROADMAP只有两处history入口 | history diff=0；Release input intersection=0；missing anchors=0；history links=2 | PASS |
| v0.4.2 Batch A/B归属同步 focused | ROADMAP摘要、Phase 4.14新anchor与Release-excluded边界一致 | 24 tests / 24 pass / 0 fail | PASS |
| v0.4.2 Batch A/B归属同步 `npm test` | 无production/runtime/Release回归 | 182 tests / 156 pass / 0 fail / 26 skipped | PASS |
| v0.4.2 Batch A/B归属同步 static audit | Release输入不变；ROADMAP宏观history入口不扩张 | 6 changed paths；Release intersection=0；history links=2；`git diff --check`通过 | PASS |
| ROADMAP Phase 5/6～9 focused | `NONE`空列车、5.1.4 authority、顺延路线与历史链接闭合 | 24 tests / 24 pass / 0 fail | PASS |
| ROADMAP Phase 5/6～9 `npm test` | 无production/runtime/Release/publication/planning回归 | 182 tests / 156 pass / 0 fail / 26 skipped | PASS |

### Phase 5: Closeout and train attribution

- **Status:** in_progress
- 维护者决定Batch A/B归入v0.4.2 post-C2文档治理扫尾，不另开版本身份、不改写immutable Release。
- ROADMAP 4.1已追加programme摘要；Phase 4.14已追加带稳定anchor的Batch A/B详细历史，包含exact commits、RETIRE/KEEP边界及Release allowlist交集0的解释。
- repository-boundary已开始同步新Phase 4.14 anchor与核心Release-excluded结论；尚待补ROADMAP摘要断言、运行focused/full validation并提交。
- ROADMAP摘要断言与Phase 4.14新anchor/Release-excluded断言已补齐；静态审计确认6个changed paths与22-entry Release allowlist交集0、ROADMAP history links仍为2、`git diff --check`通过。
- focused governance validation 24 tests / 24 pass / 0 fail；尚待完整Windows suite、最终账本状态与独立本地commit。
- 完整Windows suite 182 tests / 156 pass / 0 fail / 26 skipped；skip均为既有Linux/POSIX-only case。本轮未触发Cloud/Release重验。
- Phase 5版本归属与文档同步完成；当前只剩维护者决定本scope与旧v0.4.2 scope的KEEP/RETIRE，提交不会自动删除planning。
- 维护者随后决定两个planning scope全部KEEP，并授权新增Product Phase 5文档治理、原Product Phase 5～8顺延为6～9，以及4.1 closed train向5.1.4迁移。

### Phase 6: ROADMAP lifecycle rotation

- **Status:** in_progress
- 初读确认第5节表格当前包含Product Phase 4～8；`5.1.1～5.1.3`是Phase 4长期摘要，需先完成全仓库anchor/reference inventory再决定5.1.4标题与迁移边界。
- 全仓库引用inventory完成：历史Phase 5～8编号保持冻结；current ROADMAP新增`product-phase-5`，旧`v0-4-2-release-closeout` anchor随正文迁入5.1.4；current-role tests需支持显式空开发列车。
- 迁移结构冻结：第4节使用`NONE`空列车并保留通用工作台规则；5.1改为Phase 4～5已采纳路线，5.1.4承接Phase 5/v0.4.2 closeout；原候选工作只顺延Product Phase编号，version series不机械改号。
- ROADMAP顶层角色已改为`NONE`空开发列车，programme边界登记Phase 4～5关闭；路线表新增complete Phase 5文档治理，原候选Product Phase 5～8已顺延为6～9并校准相互引用。正文迁移与tests尚未完成。
- 4.1正文已内化整理到`5.1.4 Phase 5文档治理与v0.4.2 Release closeout`；`product-phase-5`与旧`v0-4-2-release-closeout` anchors均位于新长期authority。第4节只保留通用工作台规则、`NONE`空列车状态与planning KEEP说明。
- repository-boundary与architecture contracts已同步`NONE`空列车、5.1.4长期authority、Product Phase 5 complete及原候选6～9路线；历史fixtures/tests未机械改号，等待静态审计与测试反馈。
- repository-governance-guide已补列车间`NONE`空窗规则与状态流，明确保留planning不等于激活列车；architecture contract同步保护该长期边界。
- 首轮静态审计PASS：7个changed paths与Release allowlist交集0；`v0-4-2-release-closeout`和`product-phase-5`各1个定义；第4节4.1标题0；ROADMAP history links仍为2；current authority没有旧Phase 5～8路线命中；两份Node测试文件语法通过。
- 首次focused为22/24 PASS；删除重复planning-lifecycle fragment并明确package identity `0.4.2`后复跑24/24 PASS。空列车、Phase 5 authority、6～9路线、历史链接和治理指南空窗合同均通过。
- 完整Windows suite 182 tests / 156 pass / 0 fail / 26 skipped；production/runtime/Release/publication/planning均无回归。Phase 6实施与验证完成，所有planning scope继续KEEP。

### Phase 7: Product Phase attribution correction

- **Status:** in_progress
- 维护者纠正v0.4.2归属：它仍是Product Phase 4并保留5.1.4；Product Phase 5是另一轮planning中的其他文档治理，应使用5.2精简摘要。上一轮本地commit尚未push，当前将以追加纠正commit修复，不删除planning。
- ROADMAP已纠正Phase归属：5.1.4标题/正文恢复Phase 4，Phase 5改为`TBD / planning`并新增5.2精简摘要；第4节只有一个`#product-phase-5`链接。repository/architecture tests已同步新层级，等待静态审计与测试。
- 首轮静态审计通过：第4节Phase摘要链接1个、`product-phase-5`与`v0-4-2-release-closeout`各1个；旧“Phase 5 = v0.4.2”归属命中为0，Phase 4～9结构与5.1.4/5.2位置正确，`git diff --check`和两个测试文件语法检查均通过。
- 首次focused在沙箱内因Node runner创建子进程`EPERM`未执行；按既有环境路由在沙箱外重跑后22/24 PASS。两条失败均为旧测试措辞：一条仍要求旧`Published Release已PASS`句式，另一条仍计数已退场的`GitHub \`Latest\``写法；正文已有更精确的双通道/C2摘要与唯一Latest confirmation anchor，因此只更新断言，不改programme语义。
- 第二次focused为23/24 PASS；同一测试稍后还有一条重复的旧`GitHub \`Latest\` promotion confirmation`programme摘要断言。继续把这条重复断言收敛到当前双通道/Latest/第二轮退役/C2事实，不改变ROADMAP。
- 第三次focused 24/24 PASS：空开发列车、单一Phase 5摘要入口、v0.4.2归属Phase 4、5.2 planning状态、稳定anchors、history入口和planning lifecycle均通过。
- 完整Windows suite 182 tests / 156 pass / 0 fail / 26 skipped；production、runtime、installer、Release/publication、文档authority与planning lifecycle均无回归。Linux/POSIX-only项目继续诚实SKIP。
- 最终静态审计通过：6条修改路径与22-entry Release allowlist交集为0；第4节Phase链接1个，Phase 5/v0.4.2 anchors各1个，错误归属命中0，ROADMAP直达history链接仍为2；planning scopes保持2个，active pointer未变，`git diff --check`通过。

### Phase 8: Candidate train and frozen-history reindex

- **Status:** in_progress
- 维护者确认Phase 5预占`0.5.0-*`，其他programme字段保持TBD；原路线与版本同步顺延为Phase 6～9、`0.6.0-*`～`0.9.0-*`。第4节删除TBD Phase摘要链接，只保留`NONE`工作台与两个planning scope恢复语义。
- ROADMAP、history索引、仓库治理指南和Phase history模板已同步；7份受旧编号影响的冻结record只在文件末尾追加`Post-programme reindex status`，正文未搜索替换。current tests已迁移到新版本映射、零Phase链接和7份尾注合同，等待静态与运行验证。
- 首轮静态审计通过：第4节Product Phase链接0个，Phase 5～9候选版本连续为`0.5.0-*`～`0.9.0-*`，history尾注/anchor文件均恰好7份，Release allowlist交集0；测试文件语法、`git diff --check`均通过。
- focused governance 24/24 PASS：空列车无Phase链接、Phase 5占位/0.5系列、Phase 6～9版本顺延、7份reindex尾注、history索引/模板/治理规则及受控宏观入口全部通过。
- 完整Windows suite 182 tests / 156 pass / 0 fail / 26 skipped；production、runtime、installer、Release/publication、planning与history入口均无回归，Linux/POSIX-only项目继续诚实SKIP。
- 最终静态审计通过：7份冻结history各追加9行、删除0行；16条修改路径与Release allowlist交集0；第4节Phase链接0、reindex尾注7、planning scopes 2、active pointer未变，`git diff --check`通过。

## Error Log

| Timestamp | Error | Attempt | Resolution |
|---|---|---:|---|
| 2026-08-24 | 初次组合 Git 追溯命令 exit 1 | 1 | 保留已返回证据，改用定向 Git 命令完成追溯；未重复失败调用。 |
| 2026-08-24 | 沙箱内 Git index lock permission denied；Node test child-process spawn EPERM | 1 | 改用获准非沙箱执行面完成暂存与测试；focused suite 14/14 PASS。 |
| 2026-08-24 | Phase 2首条`rg`命令被PowerShell错误解析双引号正则 | 1 | 命令在搜索前退出；改用单引号正则，未重复原转义。 |
| 2026-08-24 | Phase 4.12 anchor审计末尾展示用`rg`返回exit 1 | 1 | 核心PowerShell枚举和逐anchor入链结果已成功；不重复展示命令，使用21项结构化结果。 |
| 2026-08-24 | Batch A focused测试Phase 4.12尾注旧措辞断言失败 | 1 | 其余17项PASS；迁移断言为历史正文保留/compat anchors退役语义后重跑。 |
| 2026-08-24 | Batch B首次focused测试23/24 PASS；ROADMAP新增第三条直达history链接触发宏观入口断言 | 1 | 归类为本批authority边界冲突；ROADMAP改为只链接immutable acceptance，不增加新的history宏观入口，待重跑。 |
| 2026-08-24 | Batch B最终静态汇总命令被PowerShell反引号解析提前终止 | 1 | 未执行任何检查或写入；改用不含反引号的拆分命令完成审计，不重复原命令。 |
| 2026-08-25 | Phase 5首次planning结项补丁因progress表格上下文不精确而未应用 | 1 | 没有文件被部分修改；读取精确UTF-8上下文后拆分补丁，不重复旧上下文。 |
| 2026-08-25 | ROADMAP结构展示用`rg`正则缺少闭合字符类 | 1 | 主体`Get-Content`仍成功；后续改用literal searches和分项引用inventory，不重复错误正则。 |
| 2026-08-25 | ROADMAP首个组合迁移补丁因历史Phase 9说明换行不匹配而未应用 | 1 | 无部分修改；拆为四个有界补丁继续，不重复大上下文。 |
| 2026-08-25 | Phase 6首次focused测试22/24 PASS：重复planning-lifecycle fragment、package identity关系表述不直接 | 1 | 保留唯一authority链接并明确package identity `0.4.2`；修正后再复跑。 |
| 2026-08-25 | Phase 6首次planning结项组合补丁因progress测试表格上下文不精确而未应用 | 1 | 仓库正文与测试结果未受影响；读取精确UTF-8上下文后拆分补丁。 |
| 2026-08-25 | Phase 7首次静态汇总命令因PowerShell复合表达式括号解析失败 | 1 | 未执行检查或写入；拆分为简单Select-String与独立计数。 |
| 2026-08-25 | Phase 7首次focused在沙箱内因Node test runner子进程`spawn EPERM`未执行 | 1 | 按维护机已知限制在沙箱外重跑，得到真实22/24结果。 |
| 2026-08-25 | Phase 7首次真实focused为22/24 PASS：两条测试仍匹配旧Release摘要/Latest写法 | 1 | 保留新ROADMAP权威结构，只把断言迁到当前双通道/C2摘要与唯一Latest confirmation anchor。 |
| 2026-08-25 | Phase 7第二次focused为23/24 PASS：同一测试残留一条重复旧programme摘要断言 | 2 | 将最后一条旧措辞断言同步到当前双通道/C2摘要。 |
| 2026-08-25 | Phase 8首次读取使用了不存在的`docs/templates/phase-history-template.md` | 1 | 其他只读检查完成且无写入；使用真实路径`docs/phase-history-template.md`继续。 |
| 2026-08-25 | Phase 8最终复合静态审计在PowerShell解析阶段报告缺少闭合括号 | 1 | 没有执行检查或写入；改用简单变量逐项计算，不重复原表达式。 |

## 5-Question Reboot Check

| Question | Answer |
|---|---|
| Where am I? | Phase 8完成：Phase 5预占0.5系列但内容TBD，Phase 6～9及版本已同步顺延；当前开发列车仍为NONE。 |
| Where am I going? | 等待维护者push本地commit，或另行授权Product Phase 5第一轮Discovery。 |
| What's the goal? | 清除历史快照对长期合同的错误耦合，同时保留真实历史和多轮 planning 恢复能力。 |
| What have I learned? | Phase编号与候选版本系列必须同步顺延；冻结history保留当时编号，通过post-programme尾注解释后继reindex。 |
| What have I done? | 冻结Phase 5的0.5占位与TBD边界、顺延Phase 6～9至0.6～0.9、移除第4节占位链接，并为7份history追加纯后置说明；全部验证PASS。 |
