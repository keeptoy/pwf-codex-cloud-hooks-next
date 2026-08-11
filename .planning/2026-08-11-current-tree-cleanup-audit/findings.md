# Findings: Current-tree Cleanup Audit

## Entry facts

- v0.3.4 已成为 accepted/Latest；本地分支在进入审计时工作树干净。
- 此前列出的三项中，`activation_phase` / `deferred_upstream_candidates` 已从 runtime contract 退休，
  manifest/bundle 重复 inventory 已收敛为 bundle 唯一 source/install authority。
- `ledger-summary.sh` 当前 managed-legacy production 路径不可达，但 pristine `inject-plan.sh` 的
  autonomous/gated 分支仍会调用它；Phase 4 候选范围正包含 attestation、nonce 与 opt-in v3 modes。
- 本轮要判断的不只是“有没有引用”，而是引用属于 production、供应链可恢复性、未来已登记路线，还是
  仅冻结旧文档形状的测试。

## D0 initial inventory

- 当前仓库规模小而边界明确：3 个 owned/adapter production Python、4 个 pristine upstream runtime、5 个
  machine contracts、3 个工具/installer入口、16 个顶层测试模块，以及治理/Release 文档。
- `ledger-summary.sh` 当前同时属于 runtime bundle、Release allowlist、importer pristine inventory、installer
  installed inventory 和四个 upstream executable mode 集合；直接删除会改变 source/install/ZIP identity，
  不是 current-tree 低风险删除。
- 它在 pristine `inject-plan.sh` 第 404 行附近的 autonomous/gated 条件分支被调用；“当前 managed-legacy
  不走该分支”和“文件没有运行价值”不是同一结论。
- 退休 Phase 字段没有回到 JSON contract 或 production。当前非历史命中仅有 CHANGELOG/ROADMAP 的退休说明，
  以及 `contracts.test.js` 的 absence assertions；history 中保留完整成因复盘。
- 四类 inventory authority 已按职责分开：bundle 是 source/install authority；upstream manifest 是 provenance
  与 integrity index；installed manifest 是现场快照；release artifact 是 ZIP allowlist。它们名称都含 inventory，
  但当前不再是同一事实的四份镜像。

## Test and source shape

- production/maintenance 代码的主要复杂度集中在 `owned-plan.py`（约 928 行）、`session-catchup.py`（约
  876 行）、`install.js`（约 801 行）、`owned-catchup.py`（约 735 行）和 adapter（约 659 行）。前三个 owned
  Python/installer 的长度主要来自安全读取、进程监督、TOML ownership 与严格 schema，而不是明显重复入口。
- 静态治理断言最密集的是 `repository-boundary.test.js`（约 397 行/163 assertions）、
  `architecture-contracts.test.js`（约 306/143）和 `contracts.test.js`（约 183/90）。这三者是本轮最值得审查
  “保护语义还是冻结文案”的区域；行数本身不能作为删除理由。
- DESIGN 已给 16 个 test module 建立反向职责索引。行为层、seam、golden、供应链、安装、publication 与
  repository governance 有明确分层；并非所有多层覆盖都是重复。
- source 函数索引显示 adapter、plan、catch-up、installer 各只有一个主入口，没有发现第二套 production
  dispatch 或已退休 patcher/overlay 实现回流。

## Reachability and contract observations

- `owned-plan.py` 的 private snapshot 只复制 `task_plan.md` 与可选 `progress.md`，不复制 `.mode`、`.attestation`、
  `.nonce` 或 ledger 文件；因此 installed pristine injector 在当前 managed path 必然选择 legacy output。
- 当前测试故意在真实 plan 写入 autonomous/gated marker，但仍要求 snapshot 输出保持 managed-legacy；这是
  “opt-in metadata 不得意外穿过安全快照”的负向行为断言，不是无意义的历史断言。
- `ledger_summary` 在 bundle 中是 `inject_plan` 的 optional conditional dependency，并反向依赖
  `resolve_plan_dir`。保留它维持 upstream v3 opt-in dependency closure；删除它需要同时改变 bundle、Release
  allowlist、installer inventory、import tests、file-mode 文档和 Cloud expected inventory。
- 两个 catch-up JSON schema 进入 ZIP 但不安装；两个 plan schema 既进入 ZIP又安装。代码本身执行手写严格
  validator，schema 文件承担 machine-readable ABI 与审计合同，不是 runtime parser dependency。是否都需安装
  是可审计问题，但“没有被 `jsonschema` 动态加载”不能直接推出 schema 可删。
- 发现一个值得单独复核的剩余重叠：manifest 保留 upstream/archive/license provenance，而 bundle 也保存完整
  `upstream` 对象；importer/installer 目前显式交叉核对两者。它可能是有意的 integrity edge，也可能是 Phase 3.8
  为保持 bundle 自描述性留下的最小重复，必须回读当时设计后再判断，不能按 inventory mirror 直接归类。

## Static assertion audit — first pass

- `architecture-contracts.test.js` 混合了两类价值不同的断言：schema 常量、adapter 调用顺序、禁止旧 resolver、
  Release allowlist 等可执行边界价值高；大量 `assert.match(document, /中文句子顺序/)` 只是要求文档用某组词复述
  已由代码/contract 验证的事实，维护成本高且容易把改写误报成架构回归。
- `repository-boundary.test.js` 前三类结构断言价值高：trusted source exact set、Release exclusion、active planning
  三件套、candidate+accepted 版本文件窗口。动态 published identity/asset/inventory 交叉核验也有真实 Release 价值。
- 同文件中 `retired prototype conclusions remain covered...` 只检查其他测试文件里是否存在若干 test title；它不执行
  或验证那些行为，且完整 suite 本来就会运行目标测试。这是明确的“测试测试名称”型冗余，可删除或改成直接行为
  coverage mapping，而不应继续把英文标题当合同。
- `portable repository governance...`、`historical documents...` 及 lifecycle authority case 中有大量中文 prose regex。
  其中“history 不进 Release/runtime”“宏观文档不冻结 current role”“模板无版本/SHA”是可机器验证边界，应保留；
  对治理指南逐句点名 owner、retirement、PENDING 等写法则可收敛为少量结构/禁区断言。
- `architecture-contracts.test.js` 的 test-module 反向索引 exact set 很有用：新增/删除测试必须同步 DESIGN 的职责地图；
  它验证的是集合与唯一映射，不是具体措辞，建议保留。

## Concrete residue candidates

- `THIRD_PARTY_NOTICES.md` 第 3～5 行仍声称 `session-catchup.py` 应用了本地 compatibility overlays；这与
  v0.3.3 起四个 upstream runtime 全部 pristine 的当前事实直接冲突。该 notice 会进入 ZIP 和 installed runtime，
  是真实 current-tree 残留，不是冷历史。下一兼容版本应改为“逐字 pristine owned copy”，并更新 manifest hash。
- `runtime-bundle-v1.json` 的每个 upstream entry 仍同时携带 `managed_sha256 == pristine_sha256` 和
  `overlay_ids: []`。这两项来自允许 overlay 的旧模型；当前 importer/installer 只用它们拒绝非 pristine 状态。
  exact schema 若删除这两个 tombstone 字段，未知字段回流本身仍会 fail closed，installed hash 可直接使用
  `pristine_sha256`。这是有价值的 contract 瘦身候选，但会改 bundle schema、两个 consumer、hash、测试和 Release。
- `origin=upstream_pristine` 仍建议保留：它是 entry 类型与 trust source 的显式安全声明，不只是旧 overlay 名称。
- `language` 与 `host_dependencies` 当前只被 strict validator 检查类型，没有驱动 importer/installer/runtime；
  它们是 machine-readable documentation。可考虑迁到 DESIGN 或真正建立 consumer，但优先级低于明显错误的 notice
  与 overlay-era tombstones。
- `contracts.test.js` 的 exact four-file inventory、Phase 4 denied source 名单、hash/mode/origin 与依赖图断言有
  实际供应链价值。`activation_phase`/`deferred_upstream_candidates` absence guards 虽与 exact-key validator
  部分重叠，但成本很低且直接防止旧 programme 字段回流，建议保留。

## Additional current-tree findings

- Phase 3.6 明确说 overlay IDs、patched managed hash 只应留在 immutable cold evidence；实施时却选择把
  `managed_sha256` 改成等于 pristine、把 `overlay_ids` 改成空数组，以兼容原 bundle schema。行为和旧值已退休，
  但字段壳仍存活，确认属于“已完成迁移后的 contract 兼容壳”。
- `upstream-manifest.skill_version` 在全仓库没有 consumer；`release` 已表达同一 pinned upstream 版本。它是明确的
  无 owner/无行为字段候选。manifest 顶层目前也没有 exact-key validator，未知字段能被忽略；下一次 manifest
  schema 整理应一起解决“删除无 owner 字段 + 顶层严格 schema”，不能只删一行 JSON。
- `required_skill_files` 有真实 installer consumer，用于验证 global pristine Skill，不可与 `skill_version` 一起删。
- 所有 production/maintenance 定义在本文件内至少有一次调用；静态低引用扫描没有发现“定义后从不调用”的
  明显死函数。大量 helper 只被一个主路径调用是安全边界分层的正常形态，不应按引用次数机械内联。
- history 文件全部被 `docs/history/README.md` 索引，`phase-history-template.md`、mode 文档、治理指南和 Cloud 模板
  也都有明确入口；没有发现孤立文档。

## Package/install contract asymmetries

- 两个 plan schema 是 Phase 3 引入 owned-plan 时一起加入 installed inventory 的；代码没有通过 jsonschema 或
  文件读取加载任何 installed schema。两个 catch-up schema 则只进入 Release ZIP、不安装。历史与当前文档没有
  给出这项不对称的独立理由。
- 因此 plan schemas 目前是“随 runtime 部署的可审计 ABI 副本”，不是执行依赖。是否保留应在 Phase 4 contract
  Discovery 决定：若未来 runtime/doctor 真会消费 installed schema，则统一四个 ABI contract 的策略；否则全部
  只保留在 ZIP/source，删除 `installed_contracts` section 和两个现场文件。现在先不动，避免 Phase 4 前删后再加。
- `THIRD_PARTY_NOTICES.md` 从 successor 根提交后从未更新，overlay retirement commit 漏掉了它；这确认是一次
  retirement inventory 漏项，而不是有意保留的历史措辞。
- Release artifact 的 paths 由 JSON contract 决定，但 ZIP mode 由 builder 内 `EXECUTABLE_PATHS` 第二份集合决定。
  这不是重复完整 inventory，却形成隐藏的 mode authority。下一 schema 可把每项 `mode` 写进 contract，让 builder
  只消费合同，不再维护手写 executable set。
- Release contract 中 `contract_id`、entry `origin`、external asset `reason` 当前不被 builder 验证/消费；
  `checksum_workflow` 只被测试逐句冻结，`state` 对所有 entry 永远是 `present`。应二选一：让代码严格消费并赋予
  语义，或从 machine JSON 移到文档；当前“写了但不执行”会重复 Phase 3.7 的无 owner metadata 问题。
- `tests/installer.test.js` 的 hardcoded expected installed set 虽看似复制 bundle，但它是独立 Release/Phase 4
  negative oracle：若测试也从 bundle派生，未经授权的新 entry 可同时修改 bundle 后自动变绿。该测试副本应保留。

## Planning lifecycle

- `.planning/.active_plan` 只负责选择唯一活动现场，不负责自动删除旧 scope；治理指南明确把 completed scope 的
  删除节奏交给维护者单独评审。这正是此前“为什么目录没有自动清空”的控制点，不是清理脚本失效。
- 当前树共有 6 个 planning scope（含本次审计）。此前 5 个都已由提交保存且对应工作已经闭合，但数量仍小，
  不构成代码或 Release 负担，因为 `.planning/` 被 ZIP 与 trusted graph 排除。
- 它们属于可以按维护者节奏清退的 cold evidence，不是必须立即删除的产品债务。下一次 lifecycle rotation 可一次
  删除已由 CHANGELOG/ROADMAP/provenance/acceptance 吸收结论的 completed scopes；不要把自动删除重新绑回
  `.active_plan` 切换，否则会绕过维护者对删除节奏的控制。

## Recommendation matrix

### Keep in the current design

- 保留 `ledger-summary.sh`：它不是当前 managed-legacy 的活动行为，却是 pristine injector 的真实条件依赖和
  Phase 4 已登记能力的闭合 upstream dependency；此时删除只会制造未来删后再加与一次额外 Release identity 旋转。
- 保留 exact runtime inventory、Phase 4 denied-source guard、hash/mode/origin/dependency 校验，以及 importer 与
  installer 各自的恶意输入测试。它们保护的是不同 consumer 的 fail-closed 行为，不是重复跑同一句话。
- 保留 `installed-manifest.runtime_files` 与 `release-artifact.entries`；前者是现场状态快照，后者是 ZIP 边界，
  均不是 bundle source authority 的镜像。
- 保留 installer 中独立写死的 expected installed set、DESIGN 的 test-module exact mapping、稳定显式锚点和
  accepted + immediate-fallback publication oracle；这些副本故意不能从被测合同自动派生。

### Low-risk cleanup candidates for the next compatible tree

- 修正 `THIRD_PARTY_NOTICES.md` 的 overlay 旧说法，并同步 notice hash。行为风险低，但它属于 ZIP/install 字节，
  仍必须跟随正常版本 seal 和 Cloud gate，不能在已发布 v0.3.4 上补写。
- 给 Phase 3.8 history/index 增加“后续已由 v0.3.4 实施交付”的尾注；保留 discovery 当时“尚未实施”的时间语义，
  不把旧段落改写成事后口吻。
- 删除 `repository-boundary.test.js` 中仅搜索其他测试标题的 `retired prototype conclusions...` 元测试；完整 suite
  已直接执行那些行为测试，标题拼写不是安全合同。
- 收缩治理指南与 ARCHITECTURE 的逐句中文 regex：保留 anchor、exact sets、forbidden zones、版本窗口与关键状态，
  删除同一事实已经由 source/contract/behavior 测试覆盖的措辞/顺序锁定。
- 让 `release-package.test.js` 从 package/artifact 发现当前 candidate 和 bootstrap 路径；不要在通用候选测试中
  重复硬编码 v0.3.4。`artifact.entries.length === 21` 的 sealed identity 只保留在一个合适的 package/acceptance
  oracle，通用 repository governance 不再复制固定数量。
- completed planning scopes 可在维护者指定的 lifecycle rotation 中清退；不建议恢复“切换 active pointer 就自动删”。

### Separate contract and Release gates

- Bundle schema 下一版移除 `managed_sha256` 与空 `overlay_ids`，由 `pristine_sha256` 直接承担 upstream package/install
  hash；保留 `origin=upstream_pristine`。这需要 importer、installer、nested hash、恶意 schema 测试和 Cloud gate。
- Manifest 下一版移除无 consumer 的 `skill_version`，同时补顶层 exact-key validation；是否继续保留 manifest 与
  bundle 的 upstream provenance 交叉核验，应另做 authority 决策，不能把它误称为未完成的 inventory 去重。
- Release artifact 下一版把 `mode` 纳入 entry，让 builder 删除手写 `EXECUTABLE_PATHS`；对 `contract_id`、`origin`、
  `reason`、`state`、`checksum_workflow` 逐项选择“严格消费”或“迁出 machine contract”，不再容忍无 owner 元数据。
- `language`、`host_dependencies` 等只校验类型而不驱动行为的 bundle 元数据也适用同一规则，但优先级较低。

### Defer to Phase 4 Discovery

- installed plan schemas 与 source-only catch-up schemas 的不对称先不动。Phase 4 会触及 plan ABI，届时统一决定
  schema 是 runtime/doctor 真正消费的安装合同，还是只应存在于 source/ZIP 的审计合同，避免现在删、下一阶段再加。

## Audit conclusion

- 当前代码与架构已经清晰：production 入口唯一、owned/upstream 边界明确、bundle/manifest/install/ZIP authority
  已经分工，没有发现复活的 overlay/patcher 或第二套 runtime。
- 不建议再做“按文件大小、引用次数或历史名字”驱动的大扫除。剩余问题不是大量死代码，而是少数 retirement
  漏项、machine metadata 无 consumer、Release mode 双 authority 和过拟合 prose assertions。
- 最合理顺序是：先在下一兼容版本修 notice、history 尾注和低价值静态断言；再以独立 contract/Release gate
  处理 bundle/manifest/release schema；`ledger-summary.sh` 与 installed schema 策略不在本轮删除。

## Resumed planning constraint

- Phase 3.9.1 与本审计结论一致：后续工作必须拆成兼容清理、contract/Release-v2 Discovery、Phase 4 Discovery
  三个 gate，不能把文案/测试清理与 machine-contract identity rotation 混成一次变更。
- 维护者明确要求本轮只把 Phase 4 写成前两段清理闭合后的“下一任务提示”；不得在本计划中展开 Phase 4
  实施步骤、写 source、改变 ABI 或预先宣布 Cloud gate 通过。

## Route-freeze evidence

- `THIRD_PARTY_NOTICES.md` 当前仍明确写着 compatibility overlays applied to `session-catchup.py`，不是模糊措辞；
  修正它会改变 installed/ZIP 字节，因此兼容清理仍需新 candidate identity、hash rotation、deterministic package
  和完整 Release/Cloud 闭环。
- `repository-boundary.test.js` 的 `retired prototype conclusions remain covered...` case 只按英文标题搜索另外三个
  测试文件；它不验证 production behavior，可在兼容清理 gate 删除，同时保留目标行为测试本身。
- 当前过拟合断言集中在 governance guide/ARCHITECTURE 的长串中文 prose regex；安全替代不是“全删”，而是保留
  explicit anchors、exact sets、forbidden zones、role windows、Release exclusion 与 source-level call-order guards。
- `release-package.test.js` 同时硬编码 test title、entry count、bootstrap filename 和 bootstrap default version；
  通用 candidate 测试应从 `package.json` 与 artifact contract 派生当前 identity，并把 builder entry count 与
  `artifact.entries.length` 对齐。已发布版本的精确 count 继续留在 acceptance/publication oracle，而不是通用测试。
- Phase 3.8 正文保留“当时只完成 Discovery、尚未实施”；后续落地应以独立尾注说明 v0.3.4 已完成 bundle-authority
  migration，避免事后重写原决策的时间语义。
- Notice 由 manifest 的 notice integrity reference、installer envelope、Release allowlist 与 installer/package tests
  共同固定；因此兼容 gate 的最小 hash 传播链至少包含 notice 本身、manifest 中的 notice hash、manifest/bundle
  相互 integrity edge、Release candidate 与外部 bootstrap checksum，不能只改一行 prose 后结束。
- Contract-v2 consumer 图已再次确认：bundle tombstone 同时被 importer、installer、contracts/importer tests 消费；
  `skill_version` 无 production consumer；ZIP mode 由 builder 内 `EXECUTABLE_PATHS` 决定；Release metadata 有的只在
  tests 中冻结。这验证了 contract-v2 必须是独立 Discovery + implementation/Release transaction，而非兼容 gate
  的顺手清理。
- ROADMAP 仍把 Phase 4 定位为 pending Discovery authorization，且尚未建立 `0.4.0-*` identity/branch/implementation
  gate；本计划结尾只能留下下一任务提示。

## Phase 4–9 forward-impact review

- ROADMAP confirms Phases 4–8 are distinct behavior/Host lifecycle candidates while Phase 9 is the release closure of whichever
  product train was authorized; therefore a compatible cleanup release before Phase 4 changes the future baseline identity but
  does not consume any Phase 4–8 scope.
- C1 is forward-positive if its invariants hold: it removes stale prose and version/test coupling, but leaves runtime dispatch,
  exact ABI, trusted graph, installed inventory and legacy output unchanged. Its only material downstream effect is that Phase 4
  Discovery must start from the new accepted cleanup baseline rather than v0.3.4.
- C2 Discovery is strategically useful before Phase 4 because it can prevent Phase 4 from building new behavior on duplicate mode
  authority or ownerless metadata. C2 implementation, however, must remain a separate transaction; mixing contract cleanup with
  Phase 4 activation would make failures, rollback and Release identity impossible to attribute cleanly.

### What is actually pre-positioned for Phase 4

- The pristine `inject-plan.sh` already contains opt-in `.mode`, attestation checking, nonce delimiters, smart rendering and
  autonomous/gated ledger branches; `ledger-summary.sh` is already in the exact bundle/install/ZIP inventory as its optional
  `mode=autonomous|gated` dependency. This is a deliberately preserved upstream closure, not active managed behavior.
- The owned boundary deliberately makes that closure unreachable: the request/result ABI is exact v1, `behavior_profile` is the
  constant `managed_legacy`, and the private snapshot contains only `task_plan.md` plus optional `progress.md`. `.mode`,
  `.attestation`, `.nonce`, ledger and ambient `PWF_INJECT` do not cross the projection.
- Tests explicitly put `.mode` and `.nonce` beside a real plan and require managed-legacy output. This is a current isolation
  guarantee that Phase 4 must evolve through an ABI/snapshot gate, not a dormant feature toggle that cleanup may delete.
- Phase 4 is only partially pre-positioned: the bundle intentionally denies `attest-plan.sh`, `ledger-append.sh` and
  `phase-status.sh`; the manifest pristine-Skill minimum checks only `SKILL.md`, resolver and session-catchup. Those future files
  may exist inside the pinned upstream archive/global Skill, but they are neither admitted owned runtime nor executable policy.
- The adapter/supervisor and exact sibling protocol are reusable seams, but Managed policy and schemas admit only
  `SessionStart`/`UserPromptSubmit`. No Stop, tool/permission or separate compaction runtime is pre-activated.

### Phase 5–9 pre-positioning and sequencing correction

- Phase 5 has only a narrow compatibility seam: `clear`/`compact` are accepted `SessionStart.source` values and reuse current
  plan/catch-up behavior. There is no managed `PreCompact`/`PostCompact` event, compaction checkpoint, or proven no-duplicate/
  no-loss state machine. Upstream `--context=precompact` exists but owned-plan always invokes `--context=userprompt`.
- Phase 6 likewise has only upstream code reuse potential: pristine injector supports a `pretool` render shape, while Managed
  policy and exact schemas expose no `PreToolUse` or permission event. Phase 7/8 Stop/gating logic exists in the pristine Skill
  fixture/global upstream world, but it is absent from owned bundle dispatch and Managed policy; current advisory fail-open
  semantics are intentionally incompatible with assuming hard gating is already implemented.
- Phase 9 is genuinely pre-positioned as lifecycle infrastructure: deterministic builder, external checksummed bootstrap,
  candidate/accepted role windows, publication oracles and Cloud acceptance templates are reusable for every future train.
  C1 dynamic candidate tests and a later single mode authority reduce repeated Phase 9 maintenance rather than changing features.
- Bundle `language`/`host_dependencies` are plausible inputs for admitting new Phase 4 scripts even though current consumers mostly
  type-check them. C2 should not delete them merely as ownerless metadata; the safe preliminary disposition is
  `RETAIN_WITH_OWNER` until Phase 4 decides whether bootstrap/doctor will enforce them or docs will own them.
- Sequencing refinement: after C1 accepted closure and C2 Discovery, Phase 4 Discovery may begin. C2 implementation is not an
  unconditional prerequisite to Phase 4 Discovery. The two Discoveries must decide whether Phase-4-neutral contract v2 work ships
  as a separate compatible transaction or as a distinct inactive foundation gate in the `0.4.0-*` train; Phase-4-coupled schema
  decisions must not be implemented early.

### Forward-impact conclusion

- 当前方案不会吃掉 Phase 4～8 的功能范围，也不会让未来 gate 自动通过；C1 的主要影响是建立一个更干净的新
  accepted rollback baseline，C2 的主要影响是减少 Phase 4 新增 runtime/entry 时继承的 machine-authority 债务。
- 仓库存在的“预埋”应分三类：`ledger-summary`/injector v3 branch 是保留的不可达 upstream closure；exact ABI、
  child supervisor、bundle/installer/release machinery 是可复用架构接缝；Phase 4 denied files、Stop/tool/permission/
  compaction state machine 则明确尚未准入。三类不能混称为“功能已经实现”。
- 最佳发布节奏不是预先承诺两个 Phase 4 前 stable patch：C1 可形成兼容 accepted baseline；C2 先 Discovery，随后
  根据 Phase 4 Discovery 决定独立兼容实现，或在 `0.4.0-alpha.*` 中作为与行为激活分离的 inactive foundation。

## C1 authorization and branch admission

- 维护者明确采用三段路线并选择本地开发分支 `0.3.5-dev`；这符合 ROADMAP 中同一 minor 行为合同的 patch 修复
  语义。C1 只清理错误 attribution、低价值静态锁与 candidate test coupling，不新增 Hook/ABI/trusted graph。
- 当前仅有维护者已声明的五组旧 planning scope tracked deletions，目标 C1 文件无重叠；这些 deletions 可以安全
  随 branch switch 保留，但不得暂存进 C1 commit。
- README/ARCHITECTURE 再次确认 patch 版本不得新增 Hook、Host ABI 或 trusted graph；C1 只旋转错误 notice、测试/
  文档治理和候选 Release 字节，符合 `0.3.5-dev` admission。Release ZIP 必须使用 exact allowlist，bootstrap 继续
  在 ZIP 外且 development hash 为 64 位 zero hash。
- DESIGN/ROADMAP 确认 C1 涉及 notice、manifest integrity、package/builder/repository governance 与 Release candidate
  多层验证；`0.x.y (y>0)` 正是同一 minor 行为合同内的兼容修复身份。candidate 仍需 Source/Candidate、publication、
  Published Release 与 promotion 四步，当前授权只到本地 source/candidate 准备和提交。

## C1.1 assertion classification

| 分类 | 目标 | 处置与替代证据 |
|---|---|---|
| `KEEP_STRUCTURAL` | contract exact keys/inventory、四个 pristine hash、Phase 4 denied-source、runtime dependency、mode、Release exclusions、active planning 三件套、candidate + accepted 文件窗口、source-level call order、forbidden zones | 原样保留；这些断言直接阻止 trusted graph、供应链或 lifecycle 边界漂移。 |
| `KEEP_STRUCTURAL` | 文档显式英文 anchors、唯一 history 入口、DESIGN test-module exact reverse index、published acceptance 的精确身份与 installed inventory | 原样保留；它们验证可寻址结构或不可变版本证据，不锁中文同义改写。 |
| `REPLACE_WITH_STRUCTURAL` | `ARCHITECTURE` runtime/lifecycle 长串中文/英文 prose regex；ROADMAP Discovery、Release、pre-1 compatibility 的段落顺序 regex | 只保留既有 stable anchor/section presence；行为由 adapter/runtime/installer/package tests，角色与 Release 关系由 machine contract 和 repository boundary 直接验证。 |
| `REPLACE_WITH_STRUCTURAL` | history advisory 与 repository-governance retirement 的逐句 prose regex | 保留 history 单一入口与 Release/trusted-source 排除、governance stable anchors、candidate + accepted 实际文件窗口；不再要求指南逐句复述 owner/PENDING/顺序。 |
| `DELETE_DUPLICATE` | `retired prototype conclusions remain covered...` 标题元测试 | 删除；完整 suite 直接运行目标 production safety tests，DESIGN exact module mapping 仍防止测试模块无归属。 |
| `DELETE_DUPLICATE` | 通用 repository/package test 中固定 `21` 和固定 `v0.3.4` | 用 `artifact.entries.length`、`package.json`、artifact version、外部 bootstrap path/default version 的关系断言替代；精确已发布数字继续留在版本 acceptance/publication oracle。 |

- notice guard 已先于正文修改加入 `tests/contracts.test.js`。旧文本按预期失败于缺少
  `byte-for-byte pristine`，并仍明确声明 compatibility overlay；这证明测试锁定的是当前错误事实，而非未来文案样式。
- 动态 Release 测试同时覆盖 sealed accepted bootstrap 和 zero-hash unpublished candidate：前者必须等于确定性 ZIP
  SHA，后者只允许出现在 candidate 与 accepted 不同的开发窗口。

## C1.2/C1.3 landing and candidate state

- notice 已改为四文件 byte-for-byte pristine + repository-owned wrappers 的准确 attribution；manifest 固定的新
  notice SHA-256 为 `10415e608418192d20d0e7095cfb4d77339850576043f65e796e695699424703`。runtime bundle
  schema/inventory、upstream bytes 和安装集合均未变化。
- `v0.3.5-dev` 已建立为 package、Release artifact、ROADMAP、CHANGELOG、candidate acceptance 与外部 bootstrap
  一致的 source identity；v0.3.4 accepted 与 v0.3.3 immediate fallback 文件/资产继续保留。新 bootstrap 与 v0.3.4
  版本逐字只差默认 version 和默认 checksum 两行，checksum 为 64 位 zero hash，默认下载必然 fail closed。
- Release artifact 变更后的真实 SHA 已同步回 manifest integrity index；这只是既有 v1 hash edge 的版本传播，未改变
  contract schema。candidate ZIP 双构建逐字一致，当前开发字节 SHA-256 为
  `d5687d4318a34dd514a5e203d71bd3918e6ef758ab49bde894de1b9c2b867b5f`，但在 Source/Candidate Cloud 与正式
  seal 之前不得写入 bootstrap 或冒充 immutable asset。
- prose-lock 收缩后仍有直接安全证据：完整 suite 会运行 runtime/tamper/ownership/rollback/publication tests；
  architecture/repository guards 继续验证 stable anchors、exact trusted/Release sets、candidate+accepted 文件窗口、
  immutable published identity、forbidden zones 与 adapter source call-order。
- C1 对 Phase 4～9 的影响仍是正向隔离：没有删除 `ledger-summary.sh`、installed schemas、host dependencies 或
  Phase 4 denied-source guards；没有新增 Phase 4 source、ABI、event 或 dispatch。后续 C2/Phase 4 Discovery 仍可独立
  决定 contract-v2 placement，不需要恢复本 gate 删除的任何运行时 seam。

## C1.3 Cloud return and seal admission

- 维护者确认 `v0.3.5-dev` 已推送，Cloud 仓库代码构建/测试通过，development Release 已发布，ZIP 重新下载和
  安装测试通过；并明确授权直接封板为 `v0.3.5` 后创建本地 commit。该回传构成 Source/Candidate 与下载安装
  gate 的维护者证据，但不被扩写为尚未执行的 stable publication/Latest 事实。
- 当前 `HEAD=4ee0ac19f1e7421ffe8015ac9700d68959976094` 且与 `origin/0.3.5-dev` 一致；该 commit 只提交维护者先前的
  15 个旧 planning scope 删除，不改变 Release allowlist 输入，因此不会使已测 runtime/ZIP 内容产生行为漂移。
- Cloud 验收留下的 `.planning/pwf-cloud-acceptance-v1` 三文件是合成 fixture，内容只有 canonical marker；工作树
  `.active_plan` 的冲突标记同属测试残留。两者均不进入 Release，但会破坏 repository lifecycle test，封板前应
  精确清除并恢复 tracked active pointer。

## C1.3 stable seal conclusion

- 在任何 stable identity 修改前，从 `HEAD=4ee0ac19f1e7421ffe8015ac9700d68959976094` 复建 development ZIP；
  结果仍为 21 entries、77,807 bytes、SHA-256
  `d5687d4318a34dd514a5e203d71bd3918e6ef758ab49bde894de1b9c2b867b5f`，证明 Cloud 回传后的 planning-only
  commit 没有改变已测 Release 边界。
- stable 轮转只修改 package/Release identity、manifest 对 Release contract 的 integrity edge、外部 bootstrap、
  lifecycle/acceptance 与 checksum-state 测试；runtime bundle、Host ABI、trusted graph、installed inventory、
  upstream bytes、accepted v0.3.4 与 immediate fallback v0.3.3 均未改变。
- checksum guard 不能继续按 `candidate === accepted` 推断：已封板但尚未晋级的 stable candidate 必须已有精确非零
  ZIP hash。测试现按 package identity 是否以 `-dev` 结尾区分 development zero/fail-closed 与 stable sealed/nonzero，
  同时仍直接校验 bootstrap 默认 hash 等于确定性构建结果。
- 全部 ZIP 输入冻结后的两个独立 stable 构建及 check 完全一致：21 entries、77,800 bytes、SHA-256
  `7d351cfe0eaa60e93bc279645ed3f480dc9e83efdff1c6abf13c14d84c286f0b`。该摘要写入 ZIP 外 bootstrap 后再次复建，
  ZIP 身份未漂移；bootstrap 为 21,565 bytes、SHA-256
  `33d7fcaca56c617ef70e33c9708af804a8737d587cc58571382b945e5bff58a5`。
- 该结果只构成本地 stable seal，不冒充 stable tag/Release、公开默认下载链、Published Release Cloud、Latest 或
  accepted promotion。product seal 已落在本地 commit
  `5be9b787d96e1a0927f437f24ebae5b06c7835b4`；当前停止点是维护者 push，C2 与 Phase 4 仍需后续明确授权。

## Verification

- C1.0 baseline `npm test`：126 tests，114 pass，0 fail，12 个 POSIX/Linux-only case 在 Windows 如实 SKIP。
- C1.0 baseline `python tools/import_upstream_runtime.py check`：healthy，四个 pristine upstream hash 全部匹配。
- Python compile（`hook_adapter.py`、`owned-plan.py`、`owned-catchup.py`）和 `node --check install.js`：通过。
- `git ls-files --stage runtime/upstream`：四个且仅四个 upstream runtime 文件均为 `100755`。
- `bash -n init-cloud-sandbox-v0.3.4.bash`：受限 Windows sandbox 首次因 Git Bash signal pipe `Win32 error 5`
  无法启动；在非受限只读执行上下文重跑通过，分类为 platform limitation，不是脚本缺陷。
- C1.0 baseline deterministic Release build/check：21 项 exact allowlist，build 与 check 均为 healthy，同一临时 ZIP SHA-256 为
  `497e92a861bd7882129f05b28df1e23a55330db98bebe76891db5b9761bdec3b`；临时文件验证后安全删除。
- `git diff --check`：通过。
- C1 完整 suite：124 tests，112 pass，0 fail，12 个 Windows POSIX/Linux-only case 如实 SKIP。
- C1 focused architecture/contracts/repository/Release：19/19；bootstrap focused：4/4。
- C1 candidate 双构建/check：21 entries、77,807 bytes，两份 SHA-256 均为
  `d5687d4318a34dd514a5e203d71bd3918e6ef758ab49bde894de1b9c2b867b5f`；临时 ZIP 已安全删除。
- C1 Python compile、Node syntax、accepted/candidate Bash syntax、四文件 `100755` mode、importer check 与
  `git diff --check`：全部通过。
- C1 stable seal 完整 suite：124 tests，112 pass，0 fail，12 个 Windows POSIX/Linux-only case 如实 SKIP；
  importer、Python/Node syntax、v0.3.4/v0.3.5 Bash syntax、四文件 `100755` mode 与 `git diff --check` 全部通过。
- C1 stable ZIP 双构建/check：21 entries、77,800 bytes，两份 SHA-256 均为
  `7d351cfe0eaa60e93bc279645ed3f480dc9e83efdff1c6abf13c14d84c286f0b`；写入 bootstrap 后 post-pin 复建仍一致。
- product commit 后从同一工作树再次 build/check，ZIP 与 bootstrap SHA-256 均保持上述 sealed identity，且
  `.planning` 之外没有未提交 product diff。

## C1 remote return audit

- 维护者回传的 Linux Source/Candidate 证据绑定 exact pushed source
  `5d01b55890c1da2a5088e2b991b152a9fb1c3f87`：118/118、0 fail、0 skip；两次 ZIP 构建与本地 seal 完全一致，
  setup 安装、doctor、SessionStart/UserPromptSubmit adapter 探测和 Post-Resume inventory/policy/residue 全部 PASS。
- `git ls-remote` 已只读确认 `origin/0.3.5-dev` 与 lightweight tag `v0.3.5` 都精确指向
  `5d01b55890c1da2a5088e2b991b152a9fb1c3f87`。因此 pushed branch/tag source 没有发生 seal 后漂移。
- GitHub CLI 的 Release/Latest API 查询被本机失效代理 `127.0.0.1:3080` 拒绝；这不推翻维护者回传或已确认的
  Git refs，但在改写 Published Release/Latest 权威前仍需通过另一只读通道核验 Release metadata 与双资产。
- 公共 Web 打开/搜索没有返回该仓库的 Release 页面，搜索结果只命中无关公开仓库；这与目标仓库不可公开索引
  的表现一致，不能作为 Release 缺失证据。下一只读路线是保留现有 GitHub 身份认证、仅清除失效的本机代理环境。
- 清除失效 proxy 后，已认证 GitHub API 确认 `v0.3.5` Release `draft=false`、`prerelease=false`，且 `/releases/latest`
  指向同一 tag；远端 ZIP 为 77,800 bytes / `sha256:7d351cfe…6f0b`，bootstrap 为 21,565 bytes /
  `sha256:33d7fcac…58a5`，与本地 seal 完全一致。
- 从 immutable Release URL 独立下载两项资产后，实际 size/hash 再次匹配；解压 ZIP 并使用 ZIP 内 builder/contract
  检查得到 21 entries、healthy、同一 SHA，下载 bootstrap 的 `bash -n` 也通过。临时下载目录已安全删除。
- 结合维护者回传的公开下载/安装、Source/Candidate、Post-Resume/doctor/inventory 证据，C1 外部 Release 与 Latest
  postflight 已闭合；接下来只需把已发生事实写入 acceptance/provenance/ROADMAP 并通过 publication guards。
- C1 role rotation 已按 retirement contract 收口：v0.3.5 是 accepted/Latest，v0.3.4 是 immediate fallback，
  v0.3.3 是 deeper fallback；当前 role window 收敛为单一 v0.3.5 bootstrap/acceptance，v0.3.4 本地版本文件退出
  current tree，但 immutable tag/source/资产/acceptance 继续由 provenance 与 publication oracle 恢复。
- focused repository/publication/Release 16/16 与完整 suite 124/112/0/12 全绿；publication oracle 已证明
  v0.3.5/v0.3.4 installers 双向接管和 rollback recoverability。C1 没有修改任何 ZIP 输入或 sealed asset。

## C2.0 accepted-tree consumer inventory — first pass

### Runtime bundle

- `contract_id`、顶层/section exact keys、`origin`、`mode`、hash、path、ID、dependency graph 都被 importer 与 installer
  双 consumer 直接强校验；它们不是 prose metadata。`origin=upstream_pristine` 与
  `origin=local_managed_runtime` 仍承担 trust classification，应保留。
- upstream `managed_sha256` 不只是 no-overlay sentinel：两个 consumer 都先要求它等于 `pristine_sha256`，随后又把它
  作为 import destination、installed projection 与 disk drift 的 expected hash。移除时必须把这些 operational reads
  全部原子改为 `pristine_sha256`，并旋转 bundle schema/raw SHA/manifest/Release identity。
- `overlay_ids=[]` 只承担显式 no-overlay sentinel：两个 consumer 都要求 exact empty array，但没有下游 projection。
  在 exact-key schema 与 `origin=upstream_pristine` 已存在的前提下，删除字段后旧 overlay key 回流会作为 unknown key
  fail closed；保留它的价值主要是显式审计可读性，不是运行依赖。
- `language` 和 `host_dependencies` 对 upstream/local runtime 都只做非空字符串/字符串数组形状校验；不驱动 bootstrap、
  doctor、installer prerequisite、dispatch 或 dependency resolution。它们当前属于 machine-readable declaration，尚无
  operational owner；但 Phase 4 新脚本准入可能需要它们，因此初步 disposition 是 `RETAIN_WITH_OWNER`，不是立即删除。
- `installed_contracts` 的 path/mode/hash 被 installer 真正用于安装与 drift，importer 又把它纳入全 bundle strict
  validation；是否安装 schema 仍是 Phase-4-coupled 策略，不进入 C2 neutral 删除集合。

### Upstream manifest

- `managed_runtime`、contracts/importer/license-provenance 子树已有 exact-key validation；bundle raw SHA 在 parse 前校验，
  manifest 与 bundle 的 repository/release/commit/archive/license 交叉核验是现存 integrity edge，不是 inventory mirror。
- manifest 顶层没有 exact-key validation。`skill_version` 全仓无 consumer；`release=v3.8.2` 已承担 pinned version，
  因而 `skill_version` 是可删字段，但必须与顶层 exact-key schema 同一 transaction 落地，避免“删一字段、继续接受任意
  unknown metadata”。
- `required_skill_files` 被 installer 的 global pristine Skill admission 真正消费，bootstrap tests 也验证该投影；必须保留。

### Release artifact

- builder 真正消费 `schema_version`、package name/version、archive root、ordering/timestamp/compression、entry path、
  `state=present`、external path exclusion 与 excluded prefixes；但没有顶层、entry 或 external exact-key validation。
- `contract_id`、entry `origin`、external `reason` 完全不被 builder读取；`checksum_workflow` 仅由 package test 逐项冻结。
  `state` 当前只能取 `present`，因此与“entry 出现在列表中”重复，除非未来需要 staged/optional entry lifecycle。
- ZIP mode 完全来自 builder 内 `EXECUTABLE_PATHS`，contract entry 不携带 mode。build 与 check 共用同一第二 authority，
  所以二者同时绿色也不能证明 contract 声明了 mode；这正是 C2 中安全价值最高的 Release-v2 修复点。
- 初步方向：Release v2 必须先补 exact top-level/entry/external schema，再把每项 `mode` 设为唯一 authority；
  `contract_id` 应被严格消费，`origin/reason/checksum_workflow` 则需在 `STRICTLY_CONSUME` 与 `MOVE_TO_DOCS` 间逐项决策。
## C2 Discovery：测试所有权、安装状态兼容与字段历史（2026-08-11）

### 测试所有权

- `runtime-bundle-v1` 的 overlay 退役语义并非只剩文档：importer 负向测试会直接拒绝非
  `upstream_pristine` origin、`managed_sha256 != pristine_sha256` 和非空 `overlay_ids`；
  `contracts.test.js` 还固定了 tombstone 与 inventory 语义。installer 现有 invalid-bundle matrix
  主要覆盖 raw SHA、schema、路径、重复项、mode/hash 和未知 dependency；它没有分别命名三个
  overlay tombstone case，但 exact-key/shape 校验仍会拒绝缺失或未知字段。
- `release-artifact-v1` 中 `checksum_workflow` 的中文流程文本只被
  `release-package.test.js` 精确断言，没有 production consumer。这证明它当前是“测试拥有的说明文字”，
  不是可执行 Release contract。
- release entry 的 `origin`、`state`，external asset 的 `reason` 也未被 builder/checker 消费；
  当前测试只证明这些字段存在或 contract 整体可读，不能证明它们参与了 ZIP 判定。

### installed-manifest 生命周期与跨版本兼容

- installed manifest 当前为 schema 3，保存整个 `UPSTREAM` 对象、精确 `installer_version`、adapter hash、
  runtime snapshot、requirements hashes 与 events。doctor 会要求 schema/owner/installer version/UPSTREAM
  canonical equality；因此 manifest 或 bundle contract 旋转会反映到安装状态，而不是对既有安装透明。
- 当前发布 oracle 已覆盖 v0.3.4 与 v0.3.5 双向 takeover。正常 `install` 可以由另一受信发布重新写入其
  自己的 installed manifest；但旧 installer 对新版本 manifest 的 doctor 结果应是版本不匹配 blocker，
  不应被“repair”伪装为同版本修复。
- 删除 `skill_version`、旋转 bundle path/SHA 或改变嵌套 manifest 会改变 canonical `UPSTREAM`。
  即使 installed-manifest schema 本身不变，也必须把 accepted -> candidate、candidate -> accepted 的
  takeover/rollback oracle 纳入独立 contract gate。

### 历史来源

- `overlay_ids`、`managed_sha256` 和相关 release metadata 都可追溯到初始 contract 基线
  `3234e4e`；overlay 退役提交 `60c9b11` 选择把字段归一化为 pristine equality/empty sentinel，
  而不是删除 schema。这说明它们是有意保留的退役 tombstone，不是偶然死字段。
- `release-artifact-v1` 的 `state`、entry `origin`、external `reason`、`checksum_workflow`，以及 builder
  的 `EXECUTABLE_PATHS`，同样来自初始 Release 设计；mode 双 authority 是初版建模遗留，不是近期回归。
- `skill_version` 从初始 manifest 基线起存在；当前代码只验证其类型，没有 runtime、installer 或
  Release consumer。

### overlay 退役提交复核

- `60c9b11` 同一个原子提交删除了 compatibility overlay ledger、patcher、installer 安装项与 importer
  patch 执行链，同时把原 overlay target 改为 `upstream_pristine`、令 managed/pristine hash 相等并清空
  `overlay_ids`。因此当前三个 tombstone 是当时 fail-closed 退役设计的一部分。
- 同一提交新增 importer 负向测试，明确把非 pristine origin、不相等 managed hash、非空 overlay IDs
  都定义为错误。这些断言的安全目标应保留；C2 若删除字段，必须把目标重写为“v2 exact-key schema
  拒绝任何旧 overlay 字段 + 所有 runtime 字节只按 pristine hash 验证”，不能简单删除测试。
- `59395e7` 是 importer/installer 直接消费 bundle inventory、压平 upstream manifest 的 Phase 3.8 I2
  落地提交；这进一步确认 inventory authority 已完成迁移，C2 不应重新把 manifest 或 builder 变成第二份
  runtime source authority。

### 与既有路线的交界

- Phase 3.8 已冻结：只要 runtime 集合、Host ABI、trusted graph、dispatch 和行为不变，bundle authority
  的 contract 整理不与 Phase 4～9 功能主线冲突；但新 runtime 的准入仍必须回到对应 Product Phase gate。
- Phase 3.9.1 已把 `language`、`host_dependencies`、installed/source-only schemas 等识别为可能服务后续
  Product Phase 的预埋边界。C2 不应为追求“JSON 更小”提前删除它们。
- 因此 C2 必须拆成 phase-neutral contract normalization 与 Phase-4-coupled admission/ABI 两组；前者
  可以设计为 inactive foundation，后者只能留给 Phase 4 Discovery 决定。

## C2 字段决策表（accepted v0.3.5 tree）

| Contract / field | 当前 producer / validator | production consumer | 初步裁决 | 理由与未来 owner |
|---|---|---|---|---|
| bundle `contract_id` | JSON + importer/installer exact identity | 两个 loader 的 schema admission | `STRICTLY_CONSUME` | 保留；它与 schema_version 共同阻止错误 contract 被当作 bundle |
| bundle upstream `origin` | JSON + 两个 loader exact enum | trust classification | `STRICTLY_CONSUME` | 保留 `upstream_pristine`；这是 supply-chain 声明，不是说明文字 |
| bundle upstream `managed_sha256` | JSON；两个 loader 校验等于 pristine | importer output/destination drift、installer install projection | `REMOVE_IN_V2` | 迁移所有 operational reads 到 `pristine_sha256` 后原子删除；不能先删 JSON |
| bundle upstream `overlay_ids` | JSON；两个 loader要求 exact empty | 无投影 consumer | `REMOVE_IN_V2` | v2 exact keys 必须反向拒绝该旧 key，保持 overlay 不可复活的安全意图 |
| bundle `language` | JSON；两个 loader只检查非空 | 无 capability/dependency consumer | `RETAIN_WITH_OWNER` | 暂由 runtime admission metadata 持有；Phase 4 Discovery 决定是否成为准入条件 |
| bundle `host_dependencies` | JSON；两个 loader只检查 string list | 无 prerequisite/doctor/dispatch consumer | `RETAIN_WITH_OWNER` | 同上；在 Phase 4 之前既不删除，也不假装当前已执行 dependency resolution |
| bundle `installed_contracts` | JSON + exact validator | installer install/drift projection | `KEEP` | 是真实安装 inventory；schema install asymmetry交由 Phase 4 Discovery |
| manifest top-level keys | JSON；字段分散校验 | importer/installer provenance 与 Skill admission | `ADD_EXACT_SCHEMA` | schema 升级时一次性拒绝 unknown/missing top-level key |
| manifest `skill_version` | 仅 JSON；顶层 loader 当前忽略 | 无 | `REMOVE_IN_NEW_SCHEMA` | 与 `release=v3.8.2` 重复；删除必须与顶层 exact-key validation 同一 transaction |
| manifest `required_skill_files` | JSON + hash/shape validation | installer pristine global Skill admission | `KEEP` | 是实际 trust edge，不是重复 runtime inventory |
| manifest bundle path/SHA | JSON + raw-byte verification | importer/installer bundle acquire | `KEEP` | 是到唯一 runtime inventory authority 的 integrity edge |
| manifest/bundle provenance cross-check | 两个 loader | repository/release/commit/archive/license identity | `KEEP` | 防止被正确 hash 的错误 bundle 与 manifest 组合 |
| Release `contract_id` | JSON；builder 当前忽略 | 无 | `STRICTLY_CONSUME_IN_V2` | v2 loader 必须校验 identity，禁止错误 JSON 被当作 Release contract |
| Release entry `mode` | 当前不存在 | mode 来自 builder `EXECUTABLE_PATHS` | `ADD_AS_SOLE_AUTHORITY` | 每个 entry 必填 `0644`/`0755`；build/check 均只读 contract |
| Release entry `state` | JSON；builder只接受 `present` | 无状态生命周期 | `REMOVE_IN_V2` | exact ZIP allowlist 本身就表示 present；未来 staged/optional 状态应另建 lifecycle contract |
| Release entry `origin` | JSON；builder忽略 | 无 | `MOVE_TO_DOCS` | 自报分类不影响所取字节，也不是 runtime trust authority；避免在 Release contract 复制 provenance taxonomy |
| external asset `reason` | JSON；builder忽略 | 无 | `MOVE_TO_DOCS` | 外置原因属于 Release runbook；machine contract只需 exact path 与排除断言 |
| `checksum_workflow` | JSON；prose test精确锁定 | 无 | `MOVE_TO_DOCS` | 流程由 README/Release rules/acceptance 承担，不把英文步骤数组伪装成 executable contract |
| `excluded_prefixes` | JSON + builder/checker | ZIP negative boundary | `KEEP` | 是实际 fail-closed exclusion guard，v2 中 exact validate |

这里的 `REMOVE_IN_V2` 不是当前授权，而是未来 schema transaction 的设计输入。`language`、
`host_dependencies` 和 schema 安装策略是明确延迟，不计入“C2 清理完成”的删除数字。

## C2 建议的 v2 contract 形状

### runtime bundle v2

- 新 identity/path 应为 `PWF_MANAGED_RUNTIME_BUNDLE_V2` / `contracts/runtime-bundle-v2.json`，不在名为
  v1 的文件中静默改 schema。
- upstream file exact keys 删除 `managed_sha256`、`overlay_ids`；保留 `origin=upstream_pristine`、
  `pristine_sha256`、mode、paths、dependencies、language/host_dependencies。
- importer 的 archive byte check、import expected bytes、destination drift，以及 installer 的 source projection
  全部改为只读 `pristine_sha256`。v1 key 回流因 unknown key 在任何 acquire/write 前失败。
- local files 与 installed contracts 的 shape、runtime 数量、package/installed paths、mode 和字节都不变。

### upstream manifest schema 4

- 顶层 exact keys 固定为 `schema_version/upstream/release/commit/release_archive_url/
  release_archive_sha256/required_skill_files/managed_runtime`，删除 `skill_version`。
- `managed_runtime.schema_version=2` 可以保持不变：其嵌套 shape 未改变，只更新 runtime bundle / Release
  contract 的 v2 path + SHA，以及 importer SHA。
- importer 和 installer 必须在读取任何 provenance 或 integrity reference 前验证顶层 exact keys 与 schema 4。
  不提供 v3 fallback；旧包仍使用自己的 immutable loader 和 manifest。
- 当前代码证据是：两个 loader 已对 `managed_runtime`、contracts、integrity references 和 license provenance
  做 exact-key validation，但都直接从 manifest 取 `managed_runtime`，没有先验证 manifest 顶层 key set；
  因而 schema 4 的改动落点明确，不能只补 repository test。

### release artifact v2

- 新 identity/path 应为 `PWF_RELEASE_ARTIFACT_V2` / `contracts/release-artifact-v2.json`。
- top-level exact keys：`schema_version`、`contract_id`、package identity、archive root、ordering、timestamp、
  compression、`entries`、`external_release_assets`、`excluded_prefixes`。
- entry exact keys 只保留 `path/mode`；external asset exact keys 只保留 `path`。mode 仅允许 `0644/0755`。
  paths、external paths、excluded prefixes 都应验证类型、唯一性、安全相对路径和相互排斥。
- builder loader 返回按 UTF-8 path 排序的 `{path, mode}`，build/check 共用该映射；删除
  `EXECUTABLE_PATHS`。`contract_id` 必须在读取 entries 前校验。
- 当前 builder 的 build 与 check 虽然一致，却一致地依赖同一份源码常量；这是“共享第二 authority”，
  不是 contract 已接管 mode 的证据。v2 验证需静态禁止该常量回流，并用 contract mutation 证明 mode 由
  entry 驱动。
- `state/origin/reason/checksum_workflow` 不进入 v2。Release 流程与外置原因由 README Release rules、
  acceptance template 和版本 acceptance 负责；runtime provenance 仍由 bundle/manifest 负责。

这三个变更是一个最小原子 transaction：bundle path/SHA 和 importer SHA 进入 manifest，manifest 与两个
v2 contract 又都进入 Release entries；拆开发布会制造旧 path、旧 hash 或第二 authority 的中间状态。

## C2 精确影响图

### 未来 implementation transaction 必改

- machine/source：`contracts/runtime-bundle-v2.json`、`contracts/release-artifact-v2.json`、
  `upstream-manifest.json`、`tools/import_upstream_runtime.py`、`tools/build_release.py`、`install.js`；当前
  v1 contract 文件在同一 candidate tree 退役，不并存两套 active schema。
- nearest tests：`contracts.test.js`、`import-runtime.test.js`、`installer.test.js`、
  `release-package.test.js`、`published-release-oracles.test.js`、`repository-boundary.test.js`、
  `architecture-contracts.test.js`；bootstrap test 通过外部资产与 manifest 间接受影响。
- stable design/governance：README、ARCHITECTURE、DESIGN、AGENTS 与 acceptance template 只更新当前
  contract 名称、single-authority 和 gate 规则；历史 phase 文档及既有 provenance rows 不改写。
- candidate/Release identity：package version、ROADMAP/CHANGELOG、candidate bootstrap、版本 acceptance、
  manifest 中 bundle/Release/importer hashes、Release ZIP 与外部 bootstrap hashes 全部随新 candidate
  重新轮转。任何 v0.3.5 tag/asset/acceptance 字节保持不可变。

### 明确不改

- `hooks/hook_adapter.py`、`runtime/owned-*.py`、四个 `runtime/upstream/*`、Host request/result schemas、
  installed plan-context schemas 的内容与 runtime dispatch 不变。
- release entries 数量可能因 v1 path 替换为 v2 path而保持不变；这不是 gate，不应冻结数字。installed
  runtime 文件集合、hash、mode 和 managed policy 必须逐项完全相同。

### 历史 oracle 的版本发现

- `published-release-oracles.test.js` 当前为 accepted/fallback source 硬编码两个 v1 contract path。这在
  v0.3.5 窗口内成立，但 current tree 切到 v2 后，不能把历史 package 强行按 v2 读取，也不能继续把 current
  candidate 写死为 v1。
- future gate 应让每个 source snapshot 从自己的 `upstream-manifest.json` 读取
  `managed_runtime.contracts.release_artifact.path` 与 `runtime_bundle.path`；随后校验 path 安全性和 anchored SHA。
  这样 v0.3.5/v0.3.4 仍用各自 v1 builder/contract，new candidate 用自己的 v2，oracle 才真正跨 schema。
- README 已完整保存外部 bootstrap、双构建、seal、publication、重新下载与 SHA 顺序；删除 machine JSON
  的 `checksum_workflow` 不会删除 Release 流程 authority。

## C2 compatibility / rollback contract

1. **Source/package compatibility**：candidate package 只接受 schema 4 manifest、bundle v2、Release v2；
   v0.3.5 package 继续只接受其 immutable v3/v1/v1 组合。没有同一 loader 的双 schema fallback。
2. **Installed-state takeover**：candidate 从 v0.3.5 managed install 接管时允许完整替换 owned runtime 与
   installed manifest；安装后的 10-file runtime snapshot、policy 与 requirements 行为必须逐项不变。
3. **Doctor semantics**：同版本 candidate doctor healthy；v0.3.5 doctor 面对 candidate manifest 可以报告
   identity/version mismatch blocker，但不能称为普通 repairable drift，也不能部分写回。
4. **Rollback**：使用 immutable v0.3.5 installer 从 candidate 安装完整接回 ownership，再由 v0.3.5 doctor
   healthy；随后 candidate 可再次接管。三个方向 `accepted -> candidate -> accepted -> candidate` 都需通过。
5. **Pre-write tamper**：manifest unknown/missing key、bundle raw SHA/identity/retired key、Release schema/mode
   错误都必须在 acquire/backup/write 前失败，并证明原 managed state 字节未改变、未产生 snapshot leftover。
6. **Published history**：不修改 v0.3.5/v0.3.4 tag、assets、provenance row 或 acceptance。新 identity 只有在
   future Release gate 另行授权后建立。

## C2 future implementation verification matrix

| Gate | 必须证明的内容 |
|---|---|
| failing-first unit | 两个 loader 拒绝 manifest unknown/missing key、bundle v1 identity、`managed_sha256`/`overlay_ids` 回流；builder 拒绝 unknown/missing/invalid mode、unknown keys、错误 identity 与不安全/重复 path |
| authority guards | importer/installer 只读 `pristine_sha256`；builder source 中无 `EXECUTABLE_PATHS`，build/check 只读 entry mode；manifest 顶层和 v2 contract 全部 exact-key |
| focused regression | contracts、importer、installer、Release package、repository boundary、architecture contracts 与跨版本 published oracles 全绿 |
| full local | importer check、完整 `npm test`、Python compile、`node --check install.js`、所有 bootstrap `bash -n`、Git mode 检查与 `git diff --check` |
| deterministic package | 两次独立 build 字节一致；两个 ZIP 各自 `check`；解包后使用包内 v2 builder/contract 自检；entry path/mode 与 contract 逐项相等 |
| Linux | 完整测试零失败且不得把 POSIX case 伪装为 Windows skip；installed runtime 10-file snapshot、四个 pristine runtime mode/hash、adapter-only policy 均保持 |
| no-live Cloud | Source/Candidate Fresh +真实 Resume、doctor、Hook feature、SessionStart/UserPromptSubmit probes、tamper/cache/rollback 与 snapshot-leftover gate |
| cross-version | immutable v0.3.5 -> candidate -> v0.3.5 -> candidate 双向 takeover；每一步 install/doctor、manifest owner/version、managed state 与失败前不写入 oracle |
| Release（另授权） | candidate identity/hash 全轮转、双构建、外部 bootstrap seal、Published Release、重新下载双资产、自包含 check/install、Latest/rollback promotion 分离 |

Windows 上的 POSIX skip 只能作为本地事实；Linux/Cloud 结果是 future implementation 的退出条件，不能由
本轮 C2 planning-only 验证替代。

## C2 final decision

`CONDITIONAL_GO`，首选落位是 Phase 4 Discovery 之后的 `0.4.0-alpha.*` inactive foundation gate，而不是
再切一个没有用户行为变化的稳定 `0.3.x` patch。理由：

- 三份 schema、manifest hashes、Release paths 和 bootstrap identity 必须一起轮转；单独 stable patch 的发布成本
  与 successor alpha 相同，却会制造连续两个无行为变化的稳定版本。
- 该 transaction 保持 runtime bytes、Host ABI、trusted graph、legacy 默认与 installed inventory 不变，适合在
  任何 Phase 4 行为激活之前作为独立 foundation gate。
- Phase 4 仍可能决定 `language/host_dependencies` 的 owner、schema install asymmetry 与新 runtime admission
  shape；先做 Phase 4 Discovery 可以避免刚删/刚定 v2 又立刻升 v3。
- 即使进入同一 `0.4.0-alpha.*` 列车，contract foundation 与 opt-in activation 也必须是两个独立 gate；前者
  PASS 不自动授权后者。

若 Phase 4 Discovery 发现 attestation/nonce/v3 modes 要求不同的 bundle/Release entry shape，则本方案停在
Discovery 并修订，不实施当前 v2。C2 本身已经完成；当前没有 contract implementation、successor identity 或
Phase 4 授权。
