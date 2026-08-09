# Findings: v0.3.2 Baseline Promotion and v0.3.3-dev Handoff

## P2-PROV Early Publication Provenance Backfill

- 维护者提供旧仓库 `v0.1.0` tag 后，GitHub 只读 API 已纠正此前“临时快照没有 `.git`，因此没有可达
  publication”的局部结论：临时目录本身确实没有 Git metadata，但旧仓库存在 tag、Release 和资产 digest；
  source snapshot 无 `.git` 不能再被当作远端 tag 不存在的证据。
- 架构换代并非 successor 迁移：v0.2.2 是已完成 Cloud 黑盒验收的过渡功能基线；alpha.1 建立 inactive
  owned inventory/contracts，alpha.2 激活 owned catch-up，beta.1 完成 canonical owned-plan，beta.2 保持
  production behavior 不变并重新封板治理/资产；M1～M4 只迁移仓库来源与 authority。
- 本 gate 将按已发布身份账本字段逐版本核对 tag/source、Release assets、external bootstrap 与 acceptance；
  任何无法由旧仓库 API、可达 Git object 或历史文件直接证明的字段保持空缺。
- 2026-08-10 GitHub Release/tag API 证明旧仓库连续存在 `v0.1.0`、`v0.2.0`、`v0.2.1`、`v0.2.2`、
  `v0.3.0-alpha.1`、`v0.3.0-alpha.2`、`v0.3.0-beta.1`、`v0.3.0-beta.2` 八个 tag/Release；每个 tag
  都解析到 commit，可作为 source 入口。
- `v0.1.0` 发布单一 TGZ（9,914 bytes）；`v0.2.0` 发布单一 TGZ（33,840 bytes）；`v0.2.1` 发布单一
  ZIP（41,031 bytes）；`v0.2.2` 发布单一 ZIP（105,741 bytes）。四项 server digest 与 Release body
  记录的 checksum 一致；没有独立 bootstrap asset，不能为其虚构 bootstrap identity。
- `v0.3.0-alpha.1`、alpha.2、beta.1、beta.2 均发布 ZIP 与独立 `init-cloud-sandbox-v0.3.0.bash`；
  Release API 已提供各自 filename、size、server digest 和直接下载 URL，可完整回填双资产身份。
- `v0.2.1` Release notes 直接证明：引入 guarded `install --repair`、manifest schema v3、增强 doctor 的
  `repairable/blockers` 分类、unknown drift fail-closed 与 backup byte-restore tests。v0.2.0 Release body
  只有资产 checksum，行为意义暂不从 v0.2.1 的升级说明反推。
- tag tree 盘点显示：v0.1.0/v0.2.0/v0.2.1 没有 acceptance 文档；v0.2.2 保留完整 planning/Cloud
  黑盒记录但没有独立命名的 acceptance；alpha.1 只有 `cloud-smoke`；alpha.2、beta.1、beta.2 均有明确
  hard-acceptance 文档。
- alpha.2 acceptance 明确最终 PASS，且 ZIP/bootstrap digest 与 Release API 一致；beta.1 acceptance 明确
  A～F PASS、22-entry ZIP、外部 bootstrap、11 runtime payload 与零 snapshot residue，其双资产 digest 也
  与 Release API 一致；beta.2 同样一致并明确行为继承 beta.1、仅重新冻结独立身份。
- alpha.1 的 ZIP digest 在 smoke 文档与 Release API 间一致，但 smoke 文档记录的 bootstrap SHA 与当前
  Release asset server digest 不一致。该版本只能登记 GitHub 当前可下载资产的实际 identity，并把验收列
  标记为“pre-release smoke；非 exact acceptance”，不能用不一致文档为 bootstrap 背书。
- v0.2.2 tag tree 的 `.planning/.../progress.md` 明确记录完整 Cloud A～F 已通过；随后文档变化要求重新
  build/pin 最终 ZIP。当前 tag/Release 已保存最终发布 commit 和 server digest，因此可把 exact tag progress
  作为功能验收证据、Release API 作为最终资产证据，但不能把 progress 中的非最终测试包 SHA 当成发布 SHA。
- provenance table header 可从“ZIP identity”收敛为“package identity”，以诚实容纳 v0.1.0/v0.2.0 的 TGZ；
  repository guard 不冻结表头。旧版本 entry count 没有稳定直接证据时省略，只登记 filename、bytes、digest。
- GitHub API 显示旧仓库八个 Release 的平台 `immutable` 标志全部为 `false`。因此冷账本必须同时冻结 exact
  commit、asset URL、bytes 和 digest，并声明未来远端漂移是供应链事件，不能把新观察静默覆盖到旧行；
  “未恢复”只说明当前证据缺口，不证明历史事实绝对不存在。

### P2-PROV Result

- 已发布身份账本新增 beta.1、alpha.2、alpha.1、v0.2.2、v0.2.1、v0.2.0 与 v0.1.0，并把资产列扩展为
  可容纳 ZIP/TGZ 的 package identity；每行只使用 GitHub tag/Release API、exact commit 或历史验收直接证据。
- alpha.2/beta.1 使用 exact hard acceptance；v0.2.2 使用 exact tag planning 中的 Cloud A～F 功能验收记录；
  alpha.1 只登记 pre-release smoke 并显式暴露 bootstrap digest 不一致；v0.1/v0.2 缺少的 acceptance 或独立
  bootstrap 保持“未恢复/未发布”。
- 冷账本新增旧 Release 非平台锁定说明：exact bytes/digest 由本账本冻结，未来漂移按供应链事件处理，
  不能静默覆盖。没有修改旧 tag、Release、asset、当前 lifecycle 或 P3 状态。

## P2-H-010 v0.1.0 Recovery

- 临时 `pwf-codex-cloud-hooks-0.1.0` 是 9-file source snapshot，包含 README、package、upstream manifest、
  installer、adapter 和两组 tests；目录内未发现 `.git` metadata。
- README 将 0.1.0 定位为 B1 implementation candidate：目标是把 global PWF Skill 的两个只读 lifecycle
  Hook 安装到 active `$CODEX_HOME`，SessionStart 做 optional upstream catch-up + plan injection，
  UserPromptSubmit 做 plan/recent-progress injection，并保留 canary 观测。
- 早期 trust 模型直接依赖全局 Skill 的 pinned canonical file hashes、`$CODEX_HOME/hooks.json` 和
  `config.toml` precomputed trust；已具备 dry-run、backup、merge preservation、exclusive lock、atomic write、
  doctor、uninstall ownership 和不使用 moving/latest artifact 的供应链意识。
- manifest 固定 PWF v3.8.2、commit `b04ffd9...` 及 SKILL/resolver/session-catchup 三个 required files；
  仍需读取 adapter/installer/tests 判断 README 中哪些能力是真实实现而非候选计划。
- 实现交叉核验确认这是最早的 thin prototype，而非当前 trusted graph：installer 只复制一个
  `hook_adapter.py`，向 legacy `$CODEX_HOME/hooks.json` 注册两个 handler，并在 `config.toml` 写 precomputed
  trust hash；production runtime 仍从候选 global Skill 目录直接执行 upstream `session-catchup.py`。
- adapter 自己实现 active pointer → newest scoped → root plan 选择，并直接读取 task/progress 渲染 context；
  SessionStart 先调用 upstream catch-up。它尚无 repository-owned upstream bundle、owned-plan/owned-catchup、
  request/result schema、transcript identity/immutable bytes、private snapshot 或 managed policy adapter-only graph。
- 五个测试 case 真实覆盖：两个事件的 canary/plan 输出、无 plan 时 canary-only，以及 installer dry-run 和
  install/merge/idempotence/doctor drift/uninstall ownership。它们是本地临时 fixture，不是 Cloud acceptance。
- 当前两个临时快照都不含 `.git`。可达 refs/tags 中没有 v0.1.0，当前 object/ref topology 也找不到把该
  9-file snapshot 绑定到 commit 的可审计路径；因此只能称为 source snapshot，不能宣称 immutable Release。
- v0.2.2 有独立 Git 证据链：root commit `3bfd3ba` 经多次修复到 release commit `2f9100b`，当前由
  `origin/audit/beta2-exact` 保持可达，但没有本地 `v0.2.2` tag，也不是当前 HEAD ancestor。
- 临时 v0.2.2 共 24 个文件，与 `2f9100b` 的路径集合完全一致；23 个 blob 相同，唯一差异是 external
  bootstrap：commit 保存 64 位 zero hash，临时快照写入 sealed SHA。因此该目录可帮助恢复发布字节，
  但不能整体宣称是 release source commit 的 exact tree。

### P2-H-010 Result

- CHANGELOG 新增 v0.1.0 独立段，明确其 B1 candidate 身份、两个只读事件、canary、direct upstream
  catch-up、adapter plan rendering 和 installer/trust/doctor/uninstall 初始闭环。
- 同一段显式记录后续尚未建立的 owned runtime、Managed policy、machine contracts、transcript bytes 与
  private snapshot，避免把当前架构反向投射到早期原型。
- 证据等级保持诚实：五个本地 case 不冒充 Cloud acceptance，没有可达 tag/commit 就不宣称 immutable
  publication。v0.2.2 的 Git/source-vs-sealed-bootstrap 发现只记录到 findings，等待后续独立补全 gate。

## P2-P-R Phase 3 Invocation Route Rationale

- 临时 audit tree 的 `docs/phase-3-upstream-invocation-options.md` 与 immutable commit
  `bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b` 中同路径 blob 均为
  `5e76f074c80872c0f31958cf824b1ab5892ba381`，可以作为可信历史来源。
- 当前 Phase 3 capsule 已保存最终闭环（owned-plan、private snapshot、pristine resolver/injector、失败语义），
  但没有保存 A～F 路线取舍、overlay 后备、上游/Host 原生协议退休条件和“不要从单一插件泛化”的理由。
- 原文混有 beta.2 当前角色、旧 ZIP entry/test count、Round 3/4 状态等时间数据，不能整篇复制到当前宏观
  文档；这些现场数据继续只留在 immutable source。
- 最小分层是：Phase 3 capsule 保存历史选择与 rejected/fallback/retirement rationale；ARCHITECTURE 只保存
  仍成立的 Driver/Host 边界；BASELINE_PROVENANCE 继续只做冷证据账本，不新增第二份设计叙事。

### P2-P-R Result

- Phase 3 capsule 已补齐路线选择：受控快照为首选、多目标 overlay 为条件后备、上游结构化协议/Cloud
  原生支持为退休条件，Host-native IR 与 OS 虚拟化因证据/平台合同不足不进入当前路线。
- capsule 明确 private snapshot 是 PWF integration driver 策略而非通用 Host ABI，并在既有 immutable
  source snapshot 下记录原始决策文档路径；没有新增第二个外部 evidence link。
- ARCHITECTURE 新增 upstream invocation strategy boundary，只保存仍成立的 pristine/overlay/retirement/
  generalization/Discovery 不变量，不复制 A～F 历史全文或旧测试流水。
- `BASELINE_PROVENANCE.md` 零改动；临时原文、旧发布角色、Round 状态、测试计数和旧 ZIP identity 均未
  进入当前稳定文档。

## P2-P-T Phase Authoring Template

- 单一宏观入口收口后，repository test 仍逐份读取 Phase capsule，冻结文件名、八个 anchor、exact link 数量
  和 Phase 3.5/Phase 1 具体叙事；这属于写作格式与历史内容，不是可信执行或 repository boundary。
- 长期机器 guard 应保护高风险关系：历史目录只有一个宏观入口、不能进入 Release/trusted graph、不能
  冒充当前 authority。编辑结构变化不会跨越这些边界，不需要每次修改测试。
- 上下文恢复仍需要统一提示，因此把现有八段结构降级为可复制 authoring template 更合适：模板说明证据
  恢复顺序、准入、非目标、冻结规则和建议骨架，但明确不是 machine contract。

### P2-P-T Result

- 新增 `docs/phase-history-template.md`；历史索引和治理指南均把它作为写作/恢复工具，同时明确模板变化
  不要求批量改写已冻结摘要。
- repository test 不再枚举 capsule、匹配文件名/anchor/link 数量，也不断言任何具体历史 Phase 内容；
  只保留历史索引的 advisory/Release 边界和 README 单一宏观入口。
- DESIGN 的测试职责改为“历史归档单入口”，CHANGELOG 记录格式责任从 guard 转交模板。

## P2-P-E Phase Archive Entrance

- CHANGELOG 直接 deep-link Phase 3.5 是 README 单一历史入口的唯一宏观例外；即使只允许一条，也会让
  版本日志兼任 Phase 目录导航，并使归档 capsule 重新靠近当前文档权威。
- 最小闭环是 README → `docs/history/README.md` → capsules；Phase 文件内部可用相对链接说明继承，
  但 CHANGELOG、ROADMAP、provenance 等宏观文档不直接链接具体 capsule。
- CHANGELOG 的 v0.3.0 仍需证明 M1～M4 来源，因此应链接 provenance 中带稳定英文 anchor 的 exact-evidence
  章节，而不是删除来源链或复制 refs。

### P2-P-E Result

- CHANGELOG 已不含 `Phase 3.5`、`phase-3.5` 或 `docs/history/`；v0.3.0 改指 provenance 的
  `successor-migration-evidence` 稳定 anchor。
- 可迁移治理指南与 repository guard 已从“允许一个 CHANGELOG 特例”升级为 README 单一宏观入口；
  静态扫描确认其他宏观文档没有 `docs/history/` 引用。

## P2-P-B Provenance Cold Ledger

- `BASELINE_PROVENANCE.md` 同时被稳定文档、machine contract、repository guard 和活动 planning 引用；
  适合保留稳定文件名，避免为了定位调整制造大规模链接迁移。
- “冷”描述的是证据语义和修改纪律，不表示索引永远不增长：新 publication/迁移证据可以新增或轮换，
  但已经登记的 tag、source、资产字节、SHA 与 acceptance identity 不得被当前角色变化改写。
- 当前第 1 节把 v0.3.2 单列为 publication、再把旧版本列为 history，并在 v0.3.1 永久意义里写入
  `immediate fallback`，把 immutable identity 与 ROADMAP 的热角色混在了一起；应统一为角色无关账本。
- 第 2 节已经保存 M1～M4 exact refs，不需要反向链接 Phase 3.5；Phase 1 只需把迁移叙事入口改到
  Phase 3.5。第 5、6 节继续保留现有 Cloud/验证证据路由，不在本 gate 搬迁。

### P2-P-B Result

- 保留稳定文件名；第 1 节改成一张角色无关的已发布身份账本，v0.3.2 与精选早期身份采用同一结构，
  v0.3.1 不再携带 `immediate fallback` 这类 ROADMAP 热角色。
- README/DESIGN 只同步“冷证据账本”导航；ROADMAP 零改动，provenance 第 5、6 节与本 gate 前逐字相同。
- Phase 1 的唯一叙事改动是把 M1～M4 指向 Phase 3.5；provenance 第 2 节继续独立保存 exact refs，未增加
  反向 Phase-history 入口。
- repository guard 现在同时冻结冷账本声明、统一身份结构、Phase 1 路由，并拒绝已发布身份区重新出现
  candidate/accepted/immediate-fallback 等热角色标签。

## P2-P Phase History Capsules

- Phase 1 的闭合边界是“可信来源与 inactive verified inventory”：冻结 upstream ownership、四项 overlay ledger、
  adapter/runtime machine contracts、deterministic importer/install/package boundary；当时未激活 Hook runtime。
- Phase 2 的闭合边界是 owned catch-up 激活：Managed policy 仍只注册 adapter；`owned-catchup.py` 独立校验
  transcript 选择/身份/格式并监督 sibling runtime，global Skill 保持 pristine，UserPromptSubmit 仍未进入 Phase 3。
- 历史 capsule 应记录当时问题、决定、交付、验收、非目标与后继继承，但不冻结测试数量、逐 Round 日志或
  当前 lifecycle 角色；原始专项文档和 acceptance 只能作为 immutable evidence 链接。
- Phase 3 闭合的是 canonical owned-plan 路径：thin adapter 对两个事件监督 `owned-plan.py`，SessionStart 再把
  同一 exact project state 交给 `owned-catchup.py`；受控 private snapshot 复用 pristine resolver/injector，
  删除 adapter 内平行 plan 算法，同时明确不启用 Phase 4 的 attestation/nonce/modes/ledger。
- 现有治理指南已经定义 hot/warm/cold 与 provenance museum，但尚未定义“Phase capsule”这种 warm-layer
  文档的准入、冻结和体积边界；应补充一小节，而不是另建 archive authority。
- 当前 repository guard 已确保所有 `docs/` 不进入 Release，但没有限制 `docs/history/` 只能包含精选 Markdown、
  固定索引覆盖和禁止 executable/source 副本；本轮可在同一 lifecycle test 中补足。
- 三份临时 Phase 文档的 Git blob 与旧仓库 immutable commit `bbad3703...` 中对应路径逐字相同，因此
  capsule 的“完整原文”可直接链接该 commit，不需要把临时副本纳入当前树；beta.1 acceptance 也在该 ref，
  beta.2 exact acceptance 则由现有 provenance 指向 successor commit `cde4b15...`。
- 适合的最小结构是 `docs/history/README.md` 加三份 `v0.3.0-phase-N-*.md`；索引声明这些文件是冻结的
  warm-layer navigation，事实修正或 immutable link repair 之外不持续追加，并禁止用它承载当前状态。

### P2-P Result

- 最终采用四文件精选结构，而不是 `archive/old`：Phase 1～3 各一份 capsule，索引负责准入与阅读路由。
- BASELINE_PROVENANCE 只提供博物馆入口，README 只提供问题导航；历史摘要本身不接管 provenance、
  programme、architecture 或 acceptance authority。
- 数据驱动 guard 校验索引覆盖、固定语义模板和 immutable evidence，允许未来按同一政策增加真正闭合的
  Phase，同时拒绝未索引文件、源码副本和当前 lifecycle 状态渗入。
- Phase capsule 的文件身份属于 programme 阶段而不是发布版本；采用 `phase-<number>-<topic>.md` 可避免把
  一个跨 alpha/beta/stable 的 Phase 错看成某个版本的附属归档，具体版本关系继续写在 Historical position。
- 当前 Phase 内容入口不只 README：BASELINE_PROVENANCE 仍反向链接索引，三份 capsule 又分别直链旧仓库的
  Phase 专项文档与 acceptance；前者制造第二入口，后者容易让旧设计文本重新获得解释当前现实的权威感。
- Governance Guide、DESIGN 和 repository test 对 Phase capsule 的提及只是分类与 guard，不是内容入口，
  应保留；最小收紧是 README 单一导航、capsule self-contained、每份只留一个 immutable source snapshot。

### P2-P-A Result

- README 现在是宏观文档中唯一 `docs/history/` 入口；provenance 回到只维护来源/迁移证据，不反向导航 capsule。
- 每份 capsule 删除旧 Phase 专项设计和 acceptance 直链，只保留同一个 immutable source commit，并把段名
  改为 `Cold evidence (not current authority)`；历史摘要可以独立阅读，current contract 不由旧文档解释。
- 通用治理方法与 repository guard 继续保留，因为它们只约束 lifecycle，不承担 Phase 内容 authority。

## P2-P-M Migration Capsule

- M1～M4 发生在 Phase 3 功能闭环之后、successor stable v0.3.0 之前，适合用 `Phase 3.5` 作为回顾性
  迁移标签；必须显式声明它不是当时正式 Product Phase、没有新增 runtime/ABI/trusted graph 或授权 Phase 4。
- 迁移故事与精确证据应分层：`phase-3.5-successor-migration.md` 讲问题、四步路线、验收与继承；
  BASELINE_PROVENANCE 只保存 M1～M4 exact refs、fixture identity 和可重放 runbook。
- CHANGELOG v0.3.0 可以 deep-link 这一份具体 capsule，因为它解释该版本如何建立；README 仍是唯一通用
  Phase 索引，CHANGELOG 的单项上下文链接不是第二份历史目录，其他宏观文档不得复制入口。

### P2-P-M Result

- `Phase 3.5` 采用明确的 retrospective interlude 语义，既把 M1～M4 从版本 CHANGELOG/provenance 长叙事中
  提炼出来，又不回写原 programme 或制造新的 Product Phase authorization。
- README 仍是通用 Phase index；CHANGELOG v0.3.0 只有一条精确 capsule deep-link；provenance 不链接
  `docs/history/`，只维护 per-gate immutable refs 和重放证据。
- Decimal filename、八段模板、单一 closure snapshot、M1～M4 顺序、非目标和 exact-ref retention 均由
  repository lifecycle guard 自动验证。

## Initial Question

- 维护者希望当前树更清爽：v0.3.1 进入历史、v0.3.2 成为已完成基线，下一开发列车以 v0.3.3-dev
  占位。
- 该目标同时触发 baseline promotion、history eviction 与新 source identity，不能只改 ROADMAP 文案；
  必须先确认三者的机器事实和外部状态是否同步。

## Invariants

- v0.3.1/v0.3.2 immutable tag、Release assets、SHA 与 acceptance 不原位改写。
- v0.3.2 只有在明确授权并完成对应核验后才成为 production rollback/GitHub `Latest`。
- v0.3.3-dev 若成为真实 source identity，package、Release contract、bootstrap fail-closed 状态和测试必须
  一致；不能只让 ROADMAP 与 machine identity 分叉。
- 当前树最终只保留一个 active planning 和获批角色窗口；历史仍从 Git/tag/Release 恢复。

## Local Inventory: Role and Identity Coupling

- 当前 machine/source identity 是精确 `0.3.2`：`package.json.version`、Release contract
  `package_version`、contract 的唯一 external asset 和 sealed bootstrap 都一致；这不是可随 ROADMAP 文案
  单独变化的占位符。
- 当前 hot role files 恰好是 v0.3.1/v0.3.2 两套 bootstrap 与 acceptance。ROADMAP、README/AGENTS
  命令、provenance、CHANGELOG、repository lifecycle、publication oracles、skill-patch 和 release-package
  tests 均引用其中一部分。
- `repository-boundary.test.js` 会把 ROADMAP 当前开发列车与 `package.json.version` 交叉校验，并根据
  candidate + accepted 角色动态派生两套 bootstrap/acceptance。因此把“当前开发列车”只改成
  `v0.3.3-dev` 会正确失败，除非同时建立完整的新 source identity。
- v0.3.1 清退不是单文件删除：至少涉及 root bootstrap、当前树 acceptance、README/AGENTS 命令、
  provenance 当前/历史分区、published oracle 与 skill-patch tests。immutable tag/Release/acceptance link
  必须在删除本地副本前复核。

## Candidate Routes

- 路线 A（最小角色旋转）：先正式 promote v0.3.2 为 accepted rollback/Latest，归档 v0.3.1；ROADMAP
  只把 v0.3.3-dev 标为“下一列车预留”，package 仍为 0.3.2，后续独立 Discovery 才建立机器身份。
- 路线 B（同一事务开启新列车）：完成 v0.3.2 promotion/eviction 后，同步建立 0.3.3-dev package、Release
  contract、zero-hash bootstrap、acceptance 骨架和测试。范围显著扩大，且任何 ZIP input 变化产生新的
  development bytes，不能继续借用 v0.3.2 sealed identity。
- 不可接受路线：只改 ROADMAP 为当前 v0.3.3-dev，同时保留 package/contract 0.3.2；这会制造双重真相。

## External Release Facts

- 2026-08-09 只读 GitHub API 显示 `releases/latest` 仍返回 v0.3.1。v0.3.1 与 v0.3.2 Release 均非 draft、
  非 prerelease；各自 ZIP/bootstrap size 与 server digest 精确匹配 provenance/acceptance。
- 因此把 v0.3.2 写成 production rollback/`Latest` 不是文档归档动作，而需要维护者明确授权一次外部
  pointer promotion，并在后置查询中证明 `Latest=v0.3.2`；资产本身不应重发或改写。

## v0.3.1 Immutable Recovery

- local tags 精确存在：v0.3.1 → `9aa2148...5de2`，v0.3.2 → `c68a53b...98e4`；v0.3.1 tag tree 内的
  bootstrap 与 pre-promotion acceptance 均可读取。
- v0.3.1 最终 promotion evidence 首次写入 commit `c92b0879...f8f0`；当前完整 acceptance blob 与
  `435f8305...924f` 中的 blob 相同（`e70265e...6f77`），后者只把 v0.3.0 本地相对链接改为 immutable
  commit link，且是当前 HEAD/远端分支祖先。
- 所以当前树的 `docs/v0.3.1-cloud-hard-acceptance.md` 可以安全归档，但 provenance/CHANGELOG 必须先把
  链接改为 exact `435f8305...924f` URL；不能只链接 v0.3.1 tag，因为 tag 内版本早于最终 promotion 证据。
- root v0.3.1 bootstrap 可同时从 v0.3.1 tag 与公开 Release asset 恢复。清退本地副本后，skill-patch
  不应失去供应链断言：可由 publication oracle 从 tagged source 验证，或把仍有长期价值的通用 bootstrap
  安全性质转交当前 accepted v0.3.2 测试。

## Sealed ZIP Coupling Changes the Recommendation

- `contracts/release-artifact-v1.json` 把 `README.md` 列为 23 个 ZIP 输入之一；README 当前仍明确检查
  v0.3.1 与 v0.3.2 两个 bootstrap。删除 v0.3.1 bootstrap 而不改 README 会留下坏命令，修改 README
  又会改变从 HEAD 构建的 ZIP bytes。
- `tests/release-package.test.js` 当前不只检查确定性，还要求 HEAD 双构建的 SHA-256 精确等于已发布
  v0.3.2 ZIP `b42aecaf...e5081`，并要求 package、Release contract 与 sealed v0.3.2 bootstrap 一致。
  因此路线 A 只能做“角色晋级但保留 v0.3.1 当前树副本”，不能完成维护者要求的清爽归档。
- 若要真正清退 v0.3.1 的 root bootstrap、当前 acceptance 与默认历史 oracle，必须让 HEAD 合法离开 sealed
  v0.3.2 source tree，建立真实 `0.3.3-dev` machine identity。此时 HEAD 构建应验证新的 development bytes
  确定性与 contract boundary，而 v0.3.2 的精确字节证明转交 immutable tag/source publication oracle。
- `skill-patch.test.js` 中 v0.3.1 用例还承载了通用供应链性质：PWF archive pin/SHA、pristine subtree、
  Node `>=18`、禁止 NVM/`npx`/`curl | bash`、以及 checksum gate 顺序。归档 v0.3.1 用例前，必须把这些
  仍有效的断言迁移到当前 v0.3.2 accepted bootstrap 或新的 v0.3.3-dev fail-closed bootstrap。
- `published-release-oracles.test.js` 的 v0.3.1 oracle 同时引用 tagged source 和当前 root bootstrap；归档时
  至少应删除后者依赖。按照 history-retention contract，默认 suite 只需持续证明仍承担当前角色的历史版本；
  更早版本通过 immutable tag/Release/精确 acceptance 链恢复，是否连同 v0.3.0 oracle 一并轮出默认 suite
  不应在本次仅因 v0.3.1 归档而顺手扩大范围。

## Recommended Gate Shape

推荐把同一项 lifecycle 事务拆成两个可回滚子门槛，而不是把 ROADMAP 文案当作全部实现：

1. **P1 — v0.3.2 pointer promotion**：复核公开资产后，仅把 GitHub `Latest` 从 v0.3.1 指向 v0.3.2，
   立即重新查询并把 promotion evidence 写入 v0.3.2 acceptance；不重发、不修改任何历史资产。
2. **P2 — v0.3.3-dev source handoff + v0.3.1 eviction**：建立 package/Release contract/zero-hash
   bootstrap/tests 一致的真实 0.3.3-dev identity；ROADMAP 把 v0.3.2 写为已完成 accepted baseline，
   v0.3.3-dev 写为当前 source train；随后删除当前树 v0.3.1 bootstrap/acceptance 并把恢复链接改为 exact
   immutable refs。P2 不 seal、不发布、不部署 v0.3.3。

这一路线保留以下角色窗口：当前开发源码 `v0.3.3-dev`、当前 accepted/rollback `v0.3.2`；v0.3.1 进入
精选 provenance/CHANGELOG + immutable tag/Release/acceptance 的历史层。它比“ROADMAP 先占位、机器身份以后再说”
多改若干身份与测试文件，但避免双重真相和 sealed ZIP 漂移。

## Discovery Conclusion

`CONDITIONAL_GO`：技术路线已收敛到 P1 + P2，但尚缺维护者对两个关键动作的显式授权：

- 允许把 GitHub `Latest`/production rollback pointer 从 v0.3.1 晋级到 v0.3.2；
- 允许在同一 lifecycle 事务的下一子门槛建立真实 0.3.3-dev machine identity，并按上述 inventory
  清退当前树中的 v0.3.1 副本与默认依赖。

在这两项确认前，ROADMAP、package/contract/bootstrap、tests 与 GitHub Release 状态保持不变。

## Maintainer Decision: Three Independent Gates

- 维护者否决“P2 同时诞生 0.3.3-dev”的合并做法，冻结为 P1 promotion → P2 historical deep-clean →
  P3 successor train。这样 P2 可以把注意力全部放在隐藏历史残留、断言职责与恢复链，不把新版本脚手架
  混入清理 diff。
- P1 已获得明确实施授权；P2 当前只授权 Discovery，不能从 `architecture-contracts.test.js` 这个例子
  直接推导批量删除；P3 不在当前授权范围。
- 旧 `2026-08-09-architecture-contract-retention` 三文件对 P2 的价值在于：它们已证明 architecture test
  应保持版本无关、repository lifecycle 管当前角色、published oracle 管不可变字节，并指出 v0.3.0 oracle
  当时因仍在 rollback evidence chain 而暂缓轮出。
- 这些文件已由 commit `d4cc3b5` 完整保存。把同一已完成 scope 永久恢复到 `.planning` 会让当前树出现
  两个 planning scope，直接违反 repository-boundary 的“completed planning scopes must leave the current
  tree”合同，也重新制造本项目刚治理掉的膨胀。因此 P2 应从该 commit 读取并把有效结论吸收到当前
  findings，而不是恢复第二套长期文件；如果维护者确实要求改变“一 active scope”政策，应另开治理决策。

## P1 Preflight Revalidation

- 2026-08-09 P1 前置查询确认 GitHub Latest 仍为 v0.3.1；其 bootstrap/ZIP size 与 digest 分别为
  21,565 / 82,725 bytes，`ce31a320...60a5e8` / `f097b040...39131f9`。
- v0.3.2 Release 为 non-draft、non-prerelease；bootstrap/ZIP size 与 digest 为 21,565 / 82,627 bytes，
  `aa2c1fd6...8f77c` / `b42aecaf...e5081`，与已关闭的 Cloud acceptance 和 provenance 一致。
- P1 可以只移动 Latest pointer；不得上传、替换或编辑两个 immutable assets。

## P1 Promotion Result and Transitional Role

- `gh release edit v0.3.2 --latest` 成功；独立 `releases/latest` 后置查询返回 v0.3.2，v0.3.2 与 v0.3.1
  四个资产的 filename/size/server digest 均与 preflight 相同。P1 是纯 pointer 写入。
- P1 后 candidate/source package 与 accepted baseline 都是 v0.3.2，但 P2 尚未批准删除 v0.3.1 当前树
  bootstrap/acceptance。若只旋转 ROADMAP 两个主角色，repository lifecycle 会正确把 v0.3.1 判为越窗。
- 因此 P1-C 在 ROADMAP 声明一个显式、可解析的 `P2 历史清理过渡` 角色；repository guard 只在
  candidate=accepted 且 retained predecessor 与 accepted 不同时允许它，并继续精确派生文件集合。
  P2 收口时删除该角色与获批旧文件，不用宽泛 allowlist 或永久例外。
- BASELINE_PROVENANCE 按自身 authority 只维护不可变身份，不复制当前角色或 Latest 状态，所以 P1
  不修改它；当前 lifecycle 只在 ROADMAP，精确 promotion evidence 只在 v0.3.2 acceptance。

## P1 Validation Result

- Focused architecture/repository/release-package/published-oracle：20/20 PASS；v0.3.2 HEAD 双构建仍精确
  等于 sealed ZIP SHA `b42aecaf...e5081`，v0.3.2/v0.3.1/v0.3.0 immutable source oracle 均通过。
- 完整 `npm test`：91 tests，79 PASS，12 个 Windows/POSIX SKIP，0 FAIL；importer check、Python 编译、
  `install.js` syntax、两个 bootstrap 的 Git Bash `-n` 与 `git diff --check` 均 PASS。
- P1 没有修改 package、Release contract、README、bootstrap、production runtime、Host ABI、trusted
  graph、tag 或 asset。唯一外部变化是 Latest pointer；唯一当前树变化是 lifecycle authority、证据与
  精确 transitional-role guard。

## P2 Initial Repository Inventory

### Confirmed Clean

- `tests/architecture-contracts.test.js` 已经没有具体 v0.3.x、版本 acceptance 路径、commit、asset SHA
  或固定历史测试计数；它只保护稳定 authority、Architecture/Design 分工、Discovery/Release 规则与
  test reverse index。维护者举出的文件是本轮扫描入口，但不是当前仍需删除的残留。
- 当前 HEAD 相对 immutable `v0.3.2` tag 的 Release ZIP inputs diff 为空；P1 后仍能精确重建 sealed ZIP。
- 当前树只有一个 tracked active planning scope。旧 retention 三文件可从 `d4cc3b5` 精确读取，内容已
  恢复进本轮判断，不需要恢复第二个 scope。

### v0.3.1 Reference Surface

- 当前树实体：`init-cloud-sandbox-v0.3.1.bash` 与 `docs/v0.3.1-cloud-hard-acceptance.md`。
- 稳定/治理文档：README、AGENTS、ROADMAP、CHANGELOG、BASELINE_PROVENANCE、v0.3.2 acceptance。
- tests：`skill-patch.test.js`、`published-release-oracles.test.js`、`contracts.test.js`；repository lifecycle
  当前通过显式 P2 transition 派生 v0.3.1 两个实体。
- v0.3.2 acceptance 中的 v0.3.1 文字主要是带时间语义的 R4/R5 与 promotion 前后证据，不是残留，
  应原样保留。
- CHANGELOG 的 v0.3.1 delta 和 ROADMAP v0.3.2 的 inherited-security 摘要仍有当前解释价值；不能把
  “出现旧版本号”直接等同于应删除。

### Hard Coupling That Defers One File to P3

- `README.md` 是 sealed v0.3.2 ZIP input，并仍包含 `bash -n init-cloud-sandbox-v0.3.1.bash`。P2 若删除
  root v0.3.1 bootstrap 而不改 README，会留下坏命令；若修改 README，则 HEAD 不再精确复现 v0.3.2
  published ZIP。两条路都违反当前 gate。
- 因此 root v0.3.1 bootstrap 必须在 P2 后暂留，并降格为显式 sealed-source residue；P3 开启新的
  machine/source identity 后才能同时修改 README 并删除该文件。该项不是无限历史保留许可。

### Candidate P2 Cleanup, Pending Deeper Audit

- 可删除候选：当前树 v0.3.1 acceptance；前提是 provenance/CHANGELOG 改为 exact immutable commit
  `435f8305...924f` URL，并验证该 blob 含最终 promotion 证据。
- 可迁移候选：`skill-patch` 中 v0.3.1 专属用例承载的通用 bootstrap 安全断言转到 v0.3.2；
  `contracts.test.js` 的 v0.3.1 文件名负断言改为版本无关边界。
- 需重新决策：v0.3.1/v0.3.0 publication oracle 是否仍承担 immediate fallback 角色；不能只为减少测试
  数量删除 immutable audit。应先把 ROADMAP 的 immediate fallback 与更深 museum evidence 分开。
- 精选 tombstone 候选：repository-boundary 中旧 prototype/fixture/runbook 路径只是不允许回流的负断言，
  不是当前历史文件；需比较保留精选列表与版本无关模式，不能机械删除。

## P2 Deep Audit: Hidden Test History

- `tests/release-package.test.js` 除精确 v0.3.2 sealed SHA 外，还保存 v0.3.0/v0.3.1 ZIP SHA 并只做
  `notEqual`。精确等于 v0.3.2 已经逻辑蕴含不等于旧 SHA，这两项是无新增安全价值的隐藏历史常量。
- `tests/contracts.test.js` 逐项写死 v0.3.0/v0.3.1/v0.3.2 bootstrap 均不在 ZIP；真正合同是所有
  `init-cloud-sandbox-*` 都是 external asset，应用版本无关 pattern 断言替代三行累积名单。
- `tests/skill-patch.test.js` 的 v0.3.1 case 同时测试旧版 identity 与长期有效的供应链性质。应删除旧版
  identity 部分，把 PWF archive pin/SHA、pristine subtree、Node >=18、无 NVM/npx/npm/curl-pipe-bash、
  安装顺序与 checksum gate 全部并入 v0.3.2 accepted bootstrap case；不能随旧用例一起丢掉。
- `tests/published-release-oracles.test.js` 当前重建 v0.3.2、v0.3.1、v0.3.0，并在 v0.3.0 case 中顺带
  固定 beta.2 identity。v0.3.2 是 accepted，v0.3.1 是 immediate fallback，仍承担角色；v0.3.0/beta.2
  已可由 provenance + immutable tag/Release/acceptance 周期审计，应退出默认 suite。
- v0.3.1 publication oracle 暂留，并继续证明 tag/source ZIP 与当前 root residue bootstrap 字节；P3 删除
  root copy 时再去掉最后一个 current-tree hash seam，但保留是否周期审计由 P3 Discovery 决定。
- `repository-boundary.test.js` 的 prototype/fixture/runbook tombstones 是精选防回流断言，旧 retention
  scope 已明确决定保留；本轮没有出现新增证据推翻该结论。

## Exact Recovery and Size Evidence

- v0.3.1 acceptance：686 行 / 35,588 bytes；当前 blob 与可达 ancestor commit
  `435f830577ded23f8509a7befb95e8ba5128924f` 中 blob 均为
  `e70265e2913070cc7cd8f76fa0d590a33dba6f77`，可安全从 exact URL 恢复。
- v0.3.1 bootstrap：750 行 / 21,565 bytes；当前 blob 与 immutable v0.3.2 tag tree 中 blob 均为
  `2e470386a29ebe6fd9e78b05c736a24fd010565c`。README blob 也与 v0.3.2 tag 精确相同，证明该依赖属于
  sealed source，不是可以在 P2 单独删掉的普通文档残留。
- 全仓 moving Release URL 扫描零匹配；当前历史链接均使用 exact tag/commit/Release，不依赖
  `latest/download`、moving branch blob 或 `refs/heads`。

## Frozen P2-I Change Set

### Delete / rotate out

1. 删除当前树 `docs/v0.3.1-cloud-hard-acceptance.md`，把 provenance/CHANGELOG 链接改为 exact
   `435f830...` immutable URL。
2. 删除 `published-release-oracles.test.js` 的 v0.3.0/beta.2 默认重建 block 与其专属常量；v0.3.0 和
   beta.2 继续留在 curated provenance/CHANGELOG museum，不删除历史。
3. 删除 `release-package.test.js` 的 v0.3.0/v0.3.1 SHA `notEqual` 常量/断言。
4. 删除 `skill-patch.test.js` 的 v0.3.1 专属 identity case/constant，但先把全部通用供应链断言迁入
   v0.3.2 case。
5. 删除 AGENTS 中重复的 v0.3.1 syntax 命令；README 同名命令因 sealed-input 约束暂留。

### Generalize / relink

1. `contracts.test.js` 用版本无关 bootstrap pattern 证明所有 bootstrap 不进入 ZIP。
2. BASELINE_PROVENANCE 将 v0.3.2 作为当前已发布 identity 条目；v0.3.1 降到精选历史里程碑，保留完整
   tag/source/asset identity 与永久安全意义，并链接 exact acceptance。
3. ROADMAP 把 rollback evidence 分为 v0.3.1 immediate fallback 与 provenance museum；P2 transition
   收口为 bootstrap-only `sealed source residue`，明确 P3 删除条件。
4. repository lifecycle 分别派生 active bootstrap/acceptance 与 bootstrap-only sealed residue，不使用
   宽泛 allowlist；P2 完成后当前 acceptance 只剩 v0.3.2。

### Keep

- v0.3.1 root bootstrap 与 README v0.3.1 syntax 行：直到 P3 建立新 machine identity 后一起删除。
- v0.3.1 publication oracle：作为 immediate fallback 与 root residue 字节证明。
- v0.3.2 acceptance 中所有 v0.3.1 时间语义、CHANGELOG v0.3.1 delta、ROADMAP 的 inherited-security
  摘要、provenance v0.3.1 精选身份。
- `architecture-contracts.test.js`、repository 精选 tombstones、v0.3.0/beta.2 provenance/CHANGELOG。

## P2-D Conclusion

`CONDITIONAL_GO`。上述 change set 可以在不修改 sealed v0.3.2 ZIP inputs、production runtime、Host ABI、
trusted graph、tag/asset 或 P3 identity 的情况下实施。维护者需明确授权 P2-I；若要求连 root v0.3.1
bootstrap/README 一并删除，则当前结论转为 `NO_GO`，必须等待 P3 新 source identity。

## Maintainer Override: README May Leave the Sealed v0.3.2 Tree

- 维护者明确授权 P2 同时删除 root v0.3.1 bootstrap，并把 README 的固定版本 syntax 命令改为版本无关
  占位/循环；理由是后续 P3 会重建新 ZIP，P2 不需要继续让 HEAD 逐字等于已发布 v0.3.2。
- 这项授权推翻了 P2-D 的单一 deferred residue 结论，但没有授权复用 v0.3.2 identity 重发 ZIP，也没有
  授权建立 v0.3.3-dev。published v0.3.2 继续由 immutable tag/source oracle 证明。
- P2 后 package/contract 仍为 0.3.2，root v0.3.2 bootstrap 仍是 published asset；但当前 HEAD 的 README
  bytes 已变化，因此从 HEAD 构建的 ZIP 只能称为 deterministic unsealed transition bytes，不能称为
  candidate 或 published v0.3.2。下一次 seal 前 P3 必须建立新 machine identity 与 fail-closed bootstrap。
- README/AGENTS 采用 `for bootstrap in init-cloud-sandbox-v*.bash; do bash -n "$bootstrap"; done`，既可
  直接执行，又由当前角色文件集合决定检查对象，不冻结具体版本号。
- `release-package.test.js` 应继续证明 current source 双构建确定、contract boundary/self-contained 成立，
  同时明确 current SHA 不等于 published v0.3.2；精确 published v0.3.2 SHA 只由 tag oracle证明。

## P2-I Implementation Findings

- 删除 v0.3.1 当前树 bootstrap/acceptance 后，保留的 v0.3.1 引用全部落在三种合法语义：v0.3.2
  acceptance 的时间证据、CHANGELOG/provenance 的历史身份、以及 immediate-fallback publication oracle。
  README、AGENTS、当前 lifecycle 文件窗口和 current-source 测试均不再依赖旧副本。
- `architecture-contracts.test.js` 无需修改；全仓复扫再次证明它没有版本号、acceptance 路径、commit 或
  asset SHA。真正的隐藏历史耦合位于 release-package、contracts、skill-patch 与 publication oracle，
  已按 P2-D 分别泛化、迁移或轮出。
- 通用 bootstrap 供应链性质现统一由 v0.3.2 case 证明；v0.3.1 oracle 只从 immutable source 重建并校验
  双资产，不再与 HEAD 文件做 hash seam。v0.3.0/beta.2 退出默认 suite，但完整身份仍在 provenance。
- 当前 source 双构建测试已改为要求“确定且不等于 published v0.3.2”，并要求 ROADMAP 显式声明
  unsealed governance transition 与 P3-before-seal。这不是放松 Release 断言；published v0.3.2 仍由
  独立 immutable tag oracle 精确等值验证。

## P2-G Guide Reconciliation

- Repository Governance Guide 已完整覆盖 hot/warm/cold、角色窗口、immutable 恢复、exact/lifecycle
  分区、promotion + eviction 和 architecture/history test 分层，不需要新增 authority 或 machine contract。
- 缺口集中在“原则如何收口”：没有明确说明 promotion/eviction 可拆成独立 gate 但下一列车必须等待两者
  关闭；没有 retirement Definition of Done；也未直接禁止稳定文档与 oracle 用例按版本复制累积。
- 最小加固应落在指南第 12～14 节和现有 repository/publication tests：稳定文档使用通用 filename pattern，
  publication oracle 固定为 accepted + immediate fallback 两席，更早历史转 provenance/周期审计。
- 如果 eviction 改变 Release input 而新 identity 尚未建立，必须显式标记 unsealed transition；这是本轮
  从 sealed-source coupling 得到的可迁移 fail-closed 结论，不应增加第四种长期 baseline。

## P2-G Result

- 指南现在把 promotion + eviction 定义为同一次 lifecycle transaction，但允许分 commit/PR/gate 审查；
  eviction 未关闭前禁止开启下一开发列车。
- retirement DoD 覆盖角色文件窗口、immutable fallback、稳定文档、长期断言迁移、两席 oracle、时间语义、
  完整验证和 unsealed transition，足以解释本次残留成因并约束下一次版本轮换。
- 自动化已从单一旧版本 tombstone 升级为通用规则；publication test 只有一个两席数据表，因此以后晋级
  应替换 accepted/fallback 行，而不是继续复制历史 test block。
- 不需要新增 lifecycle JSON、archive 目录或第四类 baseline；ROADMAP 继续是当前角色 authority，指南只
  提供可迁移方法，tests 负责执行约束。

## Post-release Branch Identity

- `0.3.2-post-release` 只表示 v0.3.2 发布后的治理/source 运输分支，不是 tag、package version、Release
  identity 或可安装 candidate；因此当前无需修改 package/contract/bootstrap。
- immutable v0.3.2 tag/asset 不能出现第二套不同字节。若 post-release 变化以后需要作为公开 ZIP/bootstrap
  发布，正确身份是新的 patch version（例如 v0.3.3），并重新执行 seal、checksum、下载和 Cloud acceptance。
- `0.3.2-post.1` 之类 SemVer prerelease 在排序上早于稳定 v0.3.2；`0.3.2+post.1` build metadata 又常被
  工具忽略优先级，二者都不适合表达稳定版之后的新 rollback baseline。

## P2-H Early Version Recovery

### Work-plan evidence

- 临时 beta.2 audit tree 的 `work_plan.md` 明确声明 Phase 1～3 已完成、Phase 4 未开始；beta.2 不改变
  beta.1 已通过 live Fresh/Resume A～F 的 runtime 行为，只完成发布同步、封板和验收。
- 发布路标把 v0.2.2 定位为“已发布 Cloud catch-up 兼容行为”的兼容基线；alpha.1 对应 Phase 1 可信来源/
  打包/安装治理，alpha.2 对应 Phase 2 owned catch-up，beta.1 对应 Phase 3 canonical plan runtime。
- beta.1 是 Phase 3 的完整功能/行为闭环：owned-plan、薄 adapter、统一 validated project state，以及
  published + Cloud A～F PASS；因此可概括为 v0.3.0 路线的最小完整功能实现，而不是只有局部 prototype。
- beta.2 属于 Phase 3 发布维护：继承 beta.1 同一 runtime 行为，增加最新 README/文档治理和独立不可变
  ZIP/bootstrap/SHA，并成为当时 Phase 4～8 的 accepted rollback baseline。
- v0.2.2 的更细功能特点目前只得到“Cloud catch-up compatibility baseline”这一证据；按维护者要求，
  CHANGELOG 暂不自行扩写，等待后续补充。

### Immutable acceptance evidence

- beta.1 acceptance 的目的明确是封板 Phase 3 canonical owned-plan/owned-catchup 双 runtime；发布后 22-entry
  ZIP、external bootstrap、Fresh/UserPrompt/canonical plan/real Resume catch-up/post-resume doctor A～F
  全部 PASS。它整合了 Phase 1～3 后形成第一份最小完整功能基线。
- beta.2 acceptance 冻结的 production 行为与 beta.1 相同：plan-first、owned plan authority、SessionStart
  catch-up + plan、UserPrompt plan-only、child failure 降级、有界 snapshot/timeout/inventory 和只读 lifecycle。
- beta.2 的新增价值位于发布/文档治理：独立 22-entry ZIP/bootstrap/SHA、可从零执行且不依赖旧验收文档的
  standalone runbook、精确停止条件、证据模板、Phase 4 禁止边界，以及后续新仓库提取 Discovery 边界。
- 两个 acceptance 都证明 beta.2 没有借同 runtime 行为复用 beta.1 资产；它使用独立 immutable identity
  并重新完成 seal、下载、安装、Fresh/Resume 和 doctor 验收。

### Cross-check and changelog boundary

- `PROJECT_UNDERSTANDING` 进一步证明 v0.2.2 的已知角色是历史 Cloud compatibility overlay/baseline；
  beta.1/beta.2 保留其 golden 作为回归证据，但 v0.3.0 不能继承 v0.2.2 的验收结论。
- beta.1 release commit `068e44c...` 到 beta.2 release commit `bd26b1b...` 的 Git diff 没有 production
  hooks/runtime/installer/contracts/patcher/importer 变化；变化集中在 README、programme/Phase/acceptance
  文档、planning、package/bootstrap identity 和对应 Release tests，直接支持“行为不变、文档/发布治理”。
- beta.1 acceptance 在 beta.2 exact lineage commit `bbad3703...` 中完整存在，可使用该 immutable old-repo
  blob 链接；beta.2 exact acceptance 已由现有 provenance 链接到 successor immutable commit。
- CHANGELOG 应新增 beta.1 独立段，概括 Phase 1～3 的三层能力与 A～F；beta.2 段强调继承行为、文档治理
  和独立资产；v0.2.2 只写已证实的 early compatibility/golden/fallback 角色，等待维护者补充功能特点。
