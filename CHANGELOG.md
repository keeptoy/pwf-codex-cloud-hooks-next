# 变更日志

本文件只摘要仓库中已经发生的版本变化。开发目标、跨 Phase 路线和当前 lifecycle 见
[`ROADMAP.md`](ROADMAP.md)；当前唯一行动与授权边界见活动 `task_plan.md`；精确 source、资产、大小和
SHA-256 见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) 与对应 acceptance。

## v0.3.3

### Changed

- 先以不冒充任何已发布资产的 `v0.3.3-dev` successor source identity 和 64 位 zero-hash bootstrap 完成
  Source/Candidate 验收，再冻结 `v0.3.3` stable package、精确 ZIP checksum 与外部 bootstrap。当前
  programme/lifecycle 见 [`ROADMAP.md`](ROADMAP.md)，已发布 v0.3.2 immutable identity
  见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，候选 Cloud gate 见
  [`docs/v0.3.3-cloud-hard-acceptance.md`](docs/v0.3.3-cloud-hard-acceptance.md)。
- 发布 stable `v0.3.3` exact tag、21-entry ZIP 与外部 bootstrap，并从公开 URL 重新下载复核；Published
  Release Cloud 通道随后在独立 Fresh 环境完成，baseline/Latest promotion 仍作为独立 gate。
- 在独立 gate 完成 pointer-only baseline promotion；postflight 确认 v0.3.3/v0.3.2 的 immutable tag、
  source 与公开 ZIP/bootstrap identity 未改变，v0.3.2 转为 immediate fallback，Product Phase 4 仍未开启。
- 退休已不可达的 catch-up compatibility supply-chain：四个 pinned upstream runtime 文件全部恢复 pristine，
  importer 不再加载 patcher/overlay ledger，installed inventory 与 Release allowlist 同步收窄；
  `owned-catchup.py` 继续拥有 transcript/identity/immutable bytes/normalization/rendering，只通过显式
  helper allowlist 复用 pristine session module，且不调用 upstream CLI `main()`。
- 将稳定 architecture contract 与版本 lifecycle/history oracle 分层：架构测试不再冻结具体 acceptance、
  release commit、资产 hash 或某次状态；candidate/accepted 文件窗口改由 ROADMAP 角色动态派生。
- 当前树继续只保留一个 active planning scope；已完成的 Release/Cloud scope 由 Git 历史恢复，不作为
  永久工作区档案。
- Discovery 明确区分讨论态、决策态与实施态；探索性疑问和单点历史残留先触发只读全局盘点，不能在
  范围与清退方案尚未冻结时直接演变为批量删改。
- 在独立 gate 复核公开双资产不变性后，将已发布并完成 Cloud hard acceptance 的 v0.3.2 晋级为新的
  accepted baseline。
- 完成独立 P2 历史清理：v0.3.1 bootstrap 与验收全文退出当前树，通用供应链断言迁移到当前版本，
  默认 publication oracle 只保留 accepted baseline 与 immediate fallback；后继开发列车仍留给 P3。
- README 与智能体入口的 bootstrap 语法检查改为版本无关循环，避免每次角色轮换继续累积固定版本命令。
- 固化 promotion + eviction 的 retirement contract：两者可分 gate 审查，但旧角色未关闭前不得开启下一
  列车；稳定文档采用版本无关 guard，publication oracle 固定为 accepted + immediate fallback 两席轮换。
- 收紧内测原型的 installer ownership：不再迁移或清退 v0.1 legacy hooks/trust/manifest 状态，不再读取、
  写入或备份非 managed 的 `config.toml`/`hooks.json`；无 marker owned handler 与非当前 manifest identity
  统一 fail closed，同时删除不可达 adapter/installer compatibility helper。
- golden fixture 的版本/Round 施工标记改为语义 identity；repository guard 改用通用产品版本 pattern，
  防止后续 fixture 再按历史版本累计 tombstone。治理指南同步 compatibility code 的支持窗口与退休合同。
- 新增跨版本 architecture-lineage overview、Phase 1～3 与 successor 迁移 interlude 的精选历史摘要：
  用统一冻结模板提炼问题、决定、交付、
  非目标与继承关系；README 维护唯一宏观入口，每份摘要只保留一个 cold source snapshot，不把旧设计/
  验收重新提升为当前 authority，也不把旧 planning、脚本、源码或测试流水带回当前树。摘要写作结构
  转交可复制模板维护，不再由 repository guard 固化。
- 将 BASELINE_PROVENANCE 明确为持续维护的冷证据账本：已发布身份采用统一、角色无关的登记结构；索引
  可以新增或轮换精选入口，但已登记 immutable identity 不随 ROADMAP lifecycle 变化而改写。
- 将 v0.3.3-dev Cloud hard acceptance 从目标摘要扩展为可重放双通道手册并完成两条 Cloud 通道：
  Source/Candidate 覆盖 portable Linux suite、双构建/override 安装、post-install Resume、canonical
  planning、long-tail/real Resume 与 deep assertion；Published Release 从公开 bootstrap 默认链完成 Fresh
  startup，并从重新校验的 ZIP 内工具完成 post-resume 复验。
- 把可复用黑盒协议与版本证据分层：B～E 提示词只描述 lifecycle 和 observable behavior，删除无行为意义
  的阶段 marker；Published setup 仅替换 bootstrap URL/SHA，post-resume deep check 仅替换 ZIP URL/SHA，
  其余 version、size 与 inventory 从已校验产物派生。精确 tag、资产字节和最终 PASS 只保留在冻结证据表。
- 新增版本中立的 [`Cloud hard acceptance template`](docs/cloud-hard-acceptance-template.md)：集中维护双通道
  setup、B～F 黑盒协议、deep check、停止条件与 evidence schema；具体版本 identity、测试计数和运行结论
  只写复制后的版本专项 acceptance，模板不占用 candidate + accepted 角色窗口。
- 根据实际 Cloud lifecycle 修正双通道 B gate：agent prompt 内安装的 Source/Candidate 验证 post-install
  Resume，environment setup 内安装的 Published Release 才验证 Fresh startup；B 的模型汇总恢复为
  SessionStart/UserPromptSubmit 与 planning 原始输出锚点，catch-up 留给 E2，内部 supply-chain 语义由
  portable suite 与 post-resume inventory 断言证明。ARCHITECTURE 同步区分冷任务与 cached environment
  的 checkout/setup 时序。

## v0.3.2

### Changed

- 将经过 `0.3.2-dev` 与 `0.3.2-dev-extend` 验证的 source/package identity 晋级为稳定 `0.3.2`。
- README 只保留稳定行为与文档入口；新增 DESIGN，集中维护仓库模块、依赖、改动落点和验证路由。
- 建立“CHANGELOG 记录实际变化、ROADMAP 维护 programme/lifecycle、活动 task plan 控制当前行动、
  provenance/acceptance 冻结证据”的文档分层。
- 新增可迁移仓库治理指南，并把 trusted source exact zones 与 planning/docs lifecycle zones 分开测试，
  避免活动治理文件变化削弱或误触发执行边界。
- 采用 candidate + accepted role window：当前树只保留一个 active planning scope、v0.3.1 accepted 入口
  和 v0.3.2 candidate 入口；更早 planning、runbook、acceptance 与 bootstrap 通过 immutable refs 恢复。

### Compatibility

- 该版本没有改变 production runtime、Host ABI、trusted graph、Hook 事件或安装行为；变化限于稳定身份、
  文档/治理边界和相应 guard。
- 后续目标与 Product Phase 授权状态只在 [`ROADMAP.md`](ROADMAP.md) 维护。
- 发布与 Cloud 验收状态见
  [immutable v0.3.2 acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/1b668b4af8691c5685b5cd94d10002ff757e2971/docs/v0.3.2-cloud-hard-acceptance.md)；
  完成 publication 后的精确身份由 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) 收录。

## v0.3.1

### Fixed

- 收紧 Managed TOML ownership boundary，避免 repair/uninstall 把后续第三方 array tables 吸收到受管块；
  real install/repair 的 read/classify/propose/backup/write 进入同一 lock transaction，并拒绝覆盖锁外漂移。
- catch-up 将 transcript 选择、身份校验与解析绑定到同一份 verified immutable bytes，关闭校验后重新打开
  路径造成的 TOCTOU；Host input 同时采用精确 byte budget，未知、损坏或超限输入安全退化为 canary-only。

### Security and packaging

- 外部 bootstrap 不再通过 root NVM、floating Node 或 root `npx skills` 执行远程安装；改为验证平台
  Node.js `>=18`，并按 fixed SHA-256 校验 PWF archive 后只安装 pristine Skill subtree。
- Release ZIP 加入 importer 的直接 patcher 依赖，使解压后的 importer `check` 可以 self-contained 运行；
  bootstrap 继续保持在 ZIP 外。

### Compatibility

- 所有修复均位于同一 `0.3` 行为合同内，没有新增 Hook、Host ABI 或 trusted graph；生产 runtime 的入口
  与激活图不变。
- 精确身份见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，最终字节与 Cloud A～F 证据见
  [immutable v0.3.1 acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/435f830577ded23f8509a7befb95e8ba5128924f/docs/v0.3.1-cloud-hard-acceptance.md)。

## v0.3.0

- 由 [`BASELINE_PROVENANCE.md` 的 Successor 迁移不可变证据](BASELINE_PROVENANCE.md#successor-migration-evidence)
  从冻结的 `v0.3.0-beta.2` 出发，依次完成 M1 exact mirror、M2 slim transformation、M3 Cloud equivalence
  与 M4 repository authority cutover，建立 successor 仓库的首个 stable baseline。
- 本次迁移没有重新设计 production runtime、Host ABI、trusted graph 或 Hook behavior；stable 版本继承 beta.1
  已完成、beta.2 已重新验收的 canonical runtime，只把 source、Release 与治理 authority 收敛到 successor。
- 因而 `v0.3.0` 表示“既有新架构在 successor 的首个 stable 身份”，不是从旧架构切换到新架构的版本；
  实际架构换代发生在 `v0.3.0-alpha.1`～`v0.3.0-beta.1`。
- 发布 contract-driven ZIP 与独立 bootstrap，并完成最终下载资产和 Cloud 验收。
- 精确身份见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，验收证据见
  [immutable v0.3.0 acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/1454c9224c83d11c073b05baf6e536a11c3bb0e5/docs/v0.3.0-cloud-hard-acceptance.md)。

## v0.3.0-beta.2

- 在 beta.1 已完成 Phase 1～3 和 live Cloud A～F 的基础上完成发布维护与文档治理；production
  hooks、runtime、installer、contracts 和 trusted graph 均未改变。
- 统一 README、programme/Phase 状态、专项 acceptance、planning 交接与 Release/Cloud 停止条件，并提供
  不依赖旧验收文档、可从零重放的 beta.2 hard-acceptance runbook。
- 使用独立 immutable ZIP/bootstrap/version/SHA 重新完成 seal、公开下载、Fresh/Resume 和 doctor 验收，
  成为当时 Phase 4～8 的 accepted rollback baseline，并冻结为 successor 迁移采用的产品/行为 oracle。
- 其 source、双资产与验收字节保持不可变；精确身份见
  [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，历史验收见
  [immutable beta.2 acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/cde4b15bba7ed8580cb774c8b8bb259c9174c3d0/docs/v0.3.0-beta.2-cloud-hard-acceptance.md)。

## v0.3.0-beta.1

- 作为 v0.3.0 路线和当前 canonical architecture 的首个最小完整功能实现版，汇合 Phase 1 的可信来源/
  确定性打包与安装治理、Phase 2 的 owned catch-up/runtime 安全边界，以及 Phase 3 的 canonical
  owned-plan、薄 adapter 和统一 project state；它是渐进式架构换代的完成点，不是全部改造的起点。
- 将 `owned-plan.py` 确立为两个 Hook 事件唯一的 plan authority；`SessionStart` 把同一份 exact project
  state 继续交给 `owned-catchup.py`，并删除 adapter 中旧的平行 plan resolution/rendering 路径。
- 通过 bounded private snapshot 复用 pinned pristine resolver/injector，同时隔离尚未授权的 mode、
  attestation、nonce、smart injection 与 ledger 输入；Managed policy 仍然只注册 absolute adapter。
- 封板并发布自校验 ZIP 与 ZIP 外 bootstrap，完成 startup、UserPrompt、canonical planning context、真实
  Resume catch-up、post-resume doctor 和零 snapshot residue 的 Cloud A～F 验收，正式关闭 Phase 1～3。
- beta.2 继承其 runtime 行为并替代当前 rollback 角色后，beta.1 保留为 immutable historical fallback；
  完整证据见 [immutable beta.1 acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks/blob/bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b/docs/v0.3.0-beta.1-cloud-hard-acceptance.md)。

## v0.3.0-alpha.2

- 在 alpha.1 已安装但尚未激活的 verified inventory 上首次切换 production catch-up：`SessionStart` 不再从
  global Skill 执行可变脚本，而由 thin adapter 监督 sibling `owned-catchup.py`；Managed policy 仍然只认识
  `hook_adapter.py`，child runtime 不是平台 handler。
- owned wrapper 负责 transcript 选择、allowed-root/regular-file/identity 校验、immutable bytes、严格
  UTF-8/JSONL、消息归一化、预算和 report rendering；它只复用 pinned owned upstream 中少量 parser/
  extraction helpers，不调用 upstream CLI `main()`。
- bootstrap 停止现场 patch global Skill，要求全局 PWF v3.8.2 保持 pristine；installer/manifest 接管 owned
  runtime 的 hash、mode、inventory、doctor 与 repair，形成 repository-owned trusted execution graph。
- 对 runtime integrity 和内容注入 fail closed；advisory catch-up failure 对 Codex loop fail open，并且不能
  吞掉 canary 或已验证的 plan context。此版本完成 owned catch-up 的 Cloud 闭环，但 canonical owned-plan
  尚未激活，adapter 中的旧 plan 路径仍等待 Phase 3 退休。
- 历史身份见 [old-repository `v0.3.0-alpha.2` Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.3.0-alpha.2)。

## v0.3.0-alpha.1

- 针对 v0.2.2“可运行但仍从可变 global Skill 执行脚本”的边界，建立 v0.3.0 系列的新架构地基：固定
  PWF v3.8.2 archive 来源，把 runtime 分为 pristine upstream、单目标 compatibility overlay、
  repository-owned 与 deferred 四类，并明确“上游存在”不等于“获准导入、安装或激活”。
- 新增 machine-readable runtime bundle、overlay ledger、adapter/runtime request/result 与 Release artifact
  contracts；importer/patcher 依精确 allowlist、anchor、hash、mode 和 inventory 确定性重建 owned runtime，
  unknown path、hash、anchor、mode 或 symlink drift 一律 fail closed。
- 固定“contract-driven ZIP + ZIP 外独立 bootstrap”的发布边界，并把 installed manifest、doctor、repair、
  第三方声明和 deterministic package 纳入同一 ownership 模型。
- 该检查点只安装 inactive verified inventory，没有切换当时 Hook 的 production dispatch；因此 alpha.1
  建立的是供应链、契约和可信执行边界，真正的运行路径切换从 alpha.2 开始。
- 历史身份见 [old-repository `v0.3.0-alpha.1` Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.3.0-alpha.1)。

## v0.2.2

- 建立 v0.3.0 路线之前最早经过完整 Cloud 黑盒验收的最小可部署功能模型：安装两个只读事件，
  `SessionStart` 提供 resume catch-up、active plan 与 recent progress，`UserPromptSubmit` 提供 plan/progress，
  两者均保留 `PWF_GLOBAL_HOOK_CANARY_V1`。
- 通过 pinned PWF v3.8.2 和四项窄 compatibility patch 解决 explicit Codex runtime、Cloud session store、
  scoped planning state 与长 wrapper 尾部保留；Cloud A～F 覆盖 startup/UserPrompt、planning context、真实
  Resume unsynced sentinel、owned repair、unknown drift fail-closed 与最终 healthy doctor。
- 沿用 v0.2.1 已建立的 `/etc/codex/requirements.toml` Managed policy、absolute adapter、manifest
  inventory、backup、doctor、guarded repair 与 ownership-aware uninstall，并把这些运维边界纳入完整
  Cloud 功能验收。
- 当时仍采用单一 package 运输：`init-cloud-sandbox-v0.2.2.bash` 包含在 Release ZIP 内，并没有作为第二个
  独立 Release asset 发布；“contract-driven ZIP + ZIP 外 bootstrap”的边界从 v0.3.0-alpha.1 才建立。
- 但它仍是过渡架构：bootstrap 在安装现场 patch global Skill，adapter 直接执行该 Skill 的
  `session-catchup.py`，并自行承担 plan resolution/rendering；它是后续版本的 golden behavior 与 historical
  fallback，不是当前 owned canonical architecture 的最小实现。
- [old-repository `v0.2.2` Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.2.2)
  保留最终 ZIP、发布校验和与可恢复的历史身份；CHANGELOG 不复制资产 SHA。

## v0.2.1

- 沿用 v0.2.0 已经成功的 `/etc/codex/requirements.toml` system-managed Hook 路线，并在不改变两个 Hook
  功能算法的前提下加固部署所有权；若管理员已有 `managed_dir` 不包含 owned adapter，仍然拒绝接管。
- installed ownership manifest 从 schema v2 升级到 v3，记录 upstream、Skill/install paths、events、adapter
  source hash，以及完整/非 owned requirements fingerprints；普通 install 可以清退 v0.1.0 legacy handler/
  trust entries，uninstall 只移除 owned policy/runtime，并保留第三方配置。
- 新增 `errors`、`blockers` 与 `repairable` drift 分类及受限 `install --repair`：只修复已证明 owned 的 adapter
  或 Managed Hook definition；unowned requirements、manifest、path、upstream 或 unknown runtime drift
  一律以 `REPAIR_BLOCKED_UNKNOWN_DRIFT` fail closed。备份范围扩展到 system requirements 和全部既有
  managed files，并用 byte-for-byte restoration 测试闭环。
- `hook_adapter.py`、三个 Hook 行为测试和 PWF v3.8.2 pristine pin 在 v0.1.0、v0.2.0、v0.2.1 之间逐字
  不变；因此该版本建立的是部署、所有权、doctor/repair 与运维安全基线，不是新的 planning/catch-up
  算法。README 当时只记录
  startup/resume 已配置验证，forced compaction 与后续 v0.2.2 完成的 Cloud A～F 不属于本版本结论。
- [old-repository `v0.2.1` Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.2.1)
  保留单一 ZIP 与发布校验和；当时没有 ZIP 外独立 bootstrap asset，CHANGELOG 不复制资产 SHA。

## v0.2.0

- 放弃 v0.1.0 在 Codex Cloud 无法落地的 legacy `hooks.json` + `config.toml` precomputed trust 路线，改用
  `/etc/codex/requirements.toml` system-managed Hook；维护者确认这条新信任/注册路线实际成功，因此
  v0.2.0 才是最早成功的 Cloud Hook 可行性原型。
- installer 启用 `features.hooks`，建立或校验 `hooks.managed_dir`，以 absolute
  `/usr/bin/python3 <adapter> <event>` 注册两个只读事件，并在已有 managed root 不包含 owned adapter 时
  fail closed；普通 install 同时清退 v0.1.0 留下的 owned legacy handler 与 trust entries。
- installed manifest 使用 schema v2；dry-run、backup、merge-preserving managed install、doctor 与
  ownership-aware uninstall 已形成最小闭环，但尚无 v0.2.1 的 schema-v3 requirements fingerprints、
  `repairable/blockers` 分类、guarded repair 和 unknown-drift blocker。
- Hook adapter、三个行为测试与 PWF v3.8.2 pin 仍和 v0.1.0 相同，所以成功点是 Cloud trust/registration
  plane，而不是 planning/catch-up 算法。独立 acceptance 文档尚未恢复；维护者确认的成功原型不能扩写成
  v0.2.2 后来完成的 Fresh/Resume A～F hard acceptance。
- [old-repository `v0.2.0` Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.2.0)
  保留单一 TGZ 与发布校验和；当时没有 ZIP 外独立 bootstrap asset，CHANGELOG 不复制资产 SHA。

## v0.1.0

- 这是最早可恢复、但未能在 Cloud 落地的 B1 implementation attempt：尝试以个人 installer 把 `SessionStart` 和
  `UserPromptSubmit` 两个只读 PWF lifecycle Hook 安装到 active `$CODEX_HOME`，并用
  `PWF_GLOBAL_HOOK_CANARY_V1` 观察新会话调用。
- `SessionStart` 直接调用已校验 global Skill 中的 upstream `session-catchup.py`，随后由 adapter 选择并
  渲染 active plan；`UserPromptSubmit` 注入 active plan 与 recent progress，无 plan 时只输出 canary。
- installer 只部署一个 adapter，通过 legacy `hooks.json` 与 `config.toml` precomputed trust 注册两个
  handler；已具备 upstream file hash pin、dry-run、备份、merge preservation、exclusive lock、atomic write、
  idempotent install、doctor drift 检测和 ownership-aware uninstall 的本地实现，但这套 Hook 信任链在
  Codex Cloud 无法解决，因而没有形成成功原型。
- 该失败尝试仍直接发现并执行 global Skill，plan 选择/文件读取/渲染也位于 adapter；尚未建立 repository-owned
  runtime、Managed policy adapter-only graph、request/result contracts、transcript identity/immutable bytes
  或 private snapshot 等后续安全边界。现存五个 case 只证明本地 fixture 行为，既不构成 Cloud acceptance，
  也不能覆盖实际 Cloud trust 失败。
- 后续核对旧仓库确认其历史身份并非只有无 Git 元数据的 source snapshot：[`v0.1.0` tag](https://github.com/keeptoy/pwf-codex-cloud-hooks/tree/v0.1.0)
  当前指向 commit `49c2709b3522aada53fbc97ae71d020d6619bb0e`，[对应 Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.1.0)
  保留发布 TGZ 与校验和；CHANGELOG 不复制资产 SHA。
  这些证据只证明失败候选曾被打包发布；README 当时仍把 fresh Cloud canary observation 列为后续步骤，
  不能把“存在 tag/Release”升级解释为成功原型或 Cloud hard acceptance。
