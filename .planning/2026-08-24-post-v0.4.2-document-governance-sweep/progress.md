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

### Phase 5: Closeout and train attribution

- **Status:** in_progress
- 维护者决定Batch A/B归入v0.4.2 post-C2文档治理扫尾，不另开版本身份、不改写immutable Release。
- ROADMAP 4.1已追加programme摘要；Phase 4.14已追加带稳定anchor的Batch A/B详细历史，包含exact commits、RETIRE/KEEP边界及Release allowlist交集0的解释。
- repository-boundary已开始同步新Phase 4.14 anchor与核心Release-excluded结论；尚待补ROADMAP摘要断言、运行focused/full validation并提交。
- ROADMAP摘要断言与Phase 4.14新anchor/Release-excluded断言已补齐；静态审计确认6个changed paths与22-entry Release allowlist交集0、ROADMAP history links仍为2、`git diff --check`通过。
- focused governance validation 24 tests / 24 pass / 0 fail；尚待完整Windows suite、最终账本状态与独立本地commit。
- 完整Windows suite 182 tests / 156 pass / 0 fail / 26 skipped；skip均为既有Linux/POSIX-only case。本轮未触发Cloud/Release重验。
- Phase 5版本归属与文档同步完成；当前只剩维护者决定本scope与旧v0.4.2 scope的KEEP/RETIRE，提交不会自动删除planning。

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

## 5-Question Reboot Check

| Question | Answer |
|---|---|
| Where am I? | Phase 5：Batch A/B均已实施并验证，等待closeout与列车归属决策。 |
| Where am I going? | 确认本轮结果如何归档，并由维护者决定两个完整planning scope的KEEP/RETIRE。 |
| What's the goal? | 清除历史快照对长期合同的错误耦合，同时保留真实历史和多轮 planning 恢复能力。 |
| What have I learned? | 历史正文可以完整保留，但current regression和programme authority应只冻结稳定语义与受控入口。 |
| What have I done? | 完成并分批提交A/B治理：清退死快照、修复链接、加入通用审计、收敛Phase 4.14回归与ROADMAP事故摘要；完整Windows回归均PASS。 |
