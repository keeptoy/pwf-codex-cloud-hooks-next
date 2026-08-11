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

## Verification

- `npm test`：126 tests，114 pass，0 fail，12 个 POSIX/Linux-only case 在 Windows 如实 SKIP。
- `python tools/import_upstream_runtime.py check`：healthy，四个 pristine upstream hash 全部匹配。
- `git diff --check`：通过。
