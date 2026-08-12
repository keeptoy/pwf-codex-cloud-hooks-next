# Findings: Phase 4.3 F1A/F1B Implementation Planning Discovery

## Status

`DISCOVERY_IN_PROGRESS / P0_EVIDENCE_REFRESH / IMPLEMENTATION_NOT_AUTHORIZED`

本文件是 Phase 4.3 探路的持续回写入口。维护者已授权开始只读 evidence refresh 与实施规划研究；讨论闭合后，
从本文件提炼 Phase 4.3 历史摘要。在此之前不得把它描述为完成的设计或 implementation authorization。

## Inherited decisions

- Phase 4.1 已选择 hybrid owned validation + normalized private snapshot + pristine rendering；legacy 默认、两个
  managed turn-start events、adapter-only policy 与 read-only workspace boundary 不变。
- Phase 4.2 已采纳 `F1A → F1B → F2A → F2B → F3`。
- F1A 是 contract/source foundation；F1B 是 inactive runtime foundation，production
  `allowed_profiles=[legacy]` 且 marker 不可达。
- F1A/F1B 可独立审查和停止，但只要 runtime/schema bytes 进入 bundle/manifest/ZIP hash，最终 candidate 必须
  作为一笔完整 transaction 闭合，不能发布半套 contract 或半套 runtime。
- F2A/F2B 与 F3 不属于本轮；它们只约束 F1 interface、legacy compatibility 和 rollback shape。

## Exploration backlog

### Exact change inventory

- F1A manifest、bundle/Release、importer、installer、builder、doctor 与 tests。
- F1B plan protocols、adapter、owned-plan、state reader/normalizer 与 tests。
- 每个字段的 producer、consumer、owner、failure behavior、review trigger 与 retirement condition。

### Atomicity and dependency

- schema/runtime byte changes 到 bundle/manifest/Release/hash 的传播图。
- 可独立通过的 review checkpoint 与不可拆分的 build/install candidate 边界。
- 是否存在安全、可构建但不可发布的 staging checkpoint。

### Verification and exit

- failing-first tests、legacy golden equivalence、exact-key refusal、marker unreachable、partial takeover guards。
- Windows/Linux/no-live Cloud 与 deterministic ZIP 的职责分流。
- candidate → v0.3.5 → candidate takeover/rollback，不删除用户 marker/state。
- F1A/F1B 的进入、退出、停止条件以及 package identity 冻结时点。

## Closeout target

探路结束后在这里补齐 exact inventory、dependency graph、test matrix、atomic transaction、gate conditions 与
`GO / CONDITIONAL_GO / NO_GO`；随后才创建冻结的 Phase 4.3 history 摘要。

## P0 evidence refresh

### Repository and lifecycle baseline

- 当前 checkout 为本地 `0.4.0-dev`，source/package identity 仍是 `package.json=0.3.5`；HEAD 开始探路时为
  `71f8f71`，没有 tag 指向 HEAD。分支名和远端同名/相邻 branch ref 不建立 package 或 Release identity。
- v0.3.5 仍同时占 current candidate/accepted 角色，v0.3.4 是 immutable immediate fallback；Phase 4.3 不轮转
  package、bootstrap、acceptance 或 rollback window。
- current trusted graph 仍是两个 Host events → absolute adapter → owned plan/catch-up siblings；installed runtime
  当前含 adapter、两个 owned runtime、四个 pristine upstream runtime、两个 plan ABI contracts、notice 与 manifest。

### Current contract baseline

- `upstream-manifest.json` 顶层 schema 3；`managed_runtime` nested schema 2。它固定 bundle、adapter catch-up ABI、
  release contract、importer 与 notice hashes，但没有顶层 exact-key parser。
- `runtime-bundle-v1.json` 是 schema 1，当前分为 `local_files`、`installed_contracts` 与上游 `files`：adapter 不在
  bundle；只安装 plan request/result 两个 ABI；catch-up request/result 只进 ZIP并由 manifest hash 固定。
- bundle 的上游 entries 仍含 `origin`、`language`、`managed_sha256`、`host_dependencies`、空 `overlay_ids`；local
  entries 仍含 `origin`、`language`、`host_dependencies`。这些正是 F1A v2 生命周期清理面。
- `release-artifact-v1.json` schema 1 的 21 个 entries 只有 path/state/origin，文件 mode 仍由 builder 内
  `EXECUTABLE_PATHS` 第二份 authority 推导；contract 自身还含 prose/classification metadata。
- plan request/result 当前 exact-v1；adapter 与 owned-plan 都直接构造/校验 schema_version 1。F1B 必须把新的
  `allowed_profiles`、`opt_in_protocol` 和 advisory/refusal result 作为真实 producer/consumer seam，而不是只加 JSON。

### First dependency observation

- importer、installer、contracts tests 和 architecture tests都直接写死 v1/schema-3/nested-schema-2 字段与路径；
  builder、bootstrap/release tests 和 published oracle 也直接发现当前 Release contract path。
- 因此 F1A 不是“换三份 JSON”：它至少是 loader + integrity references + inventory/mode consumer + tests 的迁移。
- F1B 的 schema/runtime bytes 最终必须进入 bundle `installed_contracts` / `local_files`，又会改变 bundle hash、manifest
  hash references 和 Release entries。初步支持“F1A/F1B 独立 review，但最终 candidate transaction 一起闭合”。

## P1/P2 working conclusion — checkpoint shape

源码进一步确认，F1A 可以成为**独立、完整、可构建的绿色 checkpoint**，不必和 F1B 挤在一个大提交里：

1. F1A 先轮转 manifest schema 4、runtime bundle v2、Release artifact v2；
2. adapter 进入 bundle `local_files`，当前四个 ABI（plan v1 两个 + catch-up v1 两个）全部进入
   `installed_contracts`；installer 不再在 bundle 外手工拼 adapter/contracts；
3. Release v2 entry 自带 exact mode，builder 删除 `EXECUTABLE_PATHS`；
4. 运行时仍使用 plan v1、`behavior_profile=managed_legacy`，因此 F1A 可以独立 build/install/doctor 且行为不变；
5. F1B 再新增/切换 plan request/result v2 与 state reader/normalizer，保持 `allowed_profiles=[legacy]`。

F1A 绿色 checkpoint **不是可发布 alpha，也不是最终 F1 candidate**。F1B 改变 runtime/schema bytes 后必须重新更新
bundle hashes、manifest 的 bundle/integrity references、Release entries 并重跑 deterministic build/install。大白话：
可以分两次施工和验收，但第二次施工后必须重新封整栋楼，不能拿 F1A 的 ZIP/hash 当 F1B 成品。

### Why this is preferable to one F1A+F1B mega-change

- F1A 失败可集中定位 importer/installer/builder/contract migration；F1B 失败可集中定位 adapter/owned-plan seam。
- F1A 使用现有 v1 runtime behavior，能用当前 golden/activation 证明纯供应链迁移没有偷偷改用户行为。
- F1B 可从已经单一化的 bundle/install/mode authority 开始，不必同时调试 schema placement 与 state semantics。
- 每个 checkpoint 都保持 exact loaders、完整 inventory、deterministic ZIP 和 install/doctor 自洽；不需要维护不可构建
  staging tree。

### Current-path versus historical-oracle split

- current builder、bootstrap/release tests、Cloud acceptance template、README/ARCHITECTURE/DESIGN/AGENTS 和 current
  repository/architecture assertions 都引用 v1 contract path；F1A 必须把当前 authority 路由到 v2。
- published-release oracle 在 historical source checkout 中读取该版本自己的 `release-artifact-v1.json`，这部分是
  immutable v0.3.5/v0.3.4 事实，不能批量改成 v2。
- 同一个 oracle 的 `buildCurrentPackage()` 和 current-source drift case 属于当前 candidate，必须改为从当前 manifest
  或 current contract discovery 获取 v2 path，不能继续借历史文件名。
- `docs/history/*` 中的 v1 文件名描述历史事实，应冻结；current Cloud template 中的 v1 执行命令必须随 F1A 更新。

### Identity gate before implementation

- current `package.json=0.3.5`、bootstrap、acceptance 与 ROADMAP candidate role 仍共同指向 accepted v0.3.5。不能在
  这个身份下修改 F1A ZIP inputs，否则本地 source 会冒充已发布的不可变版本。
- F1A implementation 前需要先完成一个 identity-preparation gate：package/Release contract/ROADMAP/CHANGELOG、
  zero-hash bootstrap 与 candidate acceptance 文件一起轮转到开发身份。
- 推荐先使用 `0.4.0-dev`，因为 F1A/F1B 都是未激活 foundation checkpoint；只有完整 F1 foundation 通过本地、
  Linux 与 no-live Cloud、准备形成可公开 prerelease candidate 时，才冻结 `0.4.0-alpha.N`。
- identity preparation 本身会改变 Release inputs，必须在未来 implementation plan 中作为 F0 单独授权和验证；
  Phase 4.3 只设计它，不执行。

### Marker-unreachable meaning for F1B

- `allowed_profiles=[legacy]` 不能解释成“读取 `.mode` 后发现 profile 不允许”；F1B 的 production branch 必须在
  state capture 之前短路，根本不打开 `.mode`、nonce、attestation 或 ledger。
- 原因：读取后拒绝会让 unsafe marker 改变 F1B 用户行为，等于 foundation 阶段已经隐式激活一部分新协议；这也
  无法证明 old marker、symlink/hard-link marker 与 v0.3.5 完全等价。
- state reader/normalizer 可以在 F1B 以受控 unit/fixture API 存在并被测试，但 production `execute()` 只有在
  adapter capability 包含非 legacy profile 时才可调用它。F2A 才改变这条 policy branch。
- 因此 F1B 的强断言是：在 `[legacy]` 下对 `.mode`/nonce/attestation/ledger 的 open/read helper 调用次数为零，
  即便这些路径是恶意 symlink、hard link、oversized 或 invalid UTF-8，输出仍走 v0.3.5-equivalent legacy path。

## P1 exact file and authority map

### F0 — development identity preparation

F1A 会改变 ZIP 输入，不能继续使用已发布且不可变的 `0.3.5` package identity。未来获得实施授权后，应先用一个
独立、可恢复的 F0 提交把当前开发列车真正轮转到 `0.4.0-dev`：

| 文件/authority | F0 动作 | 边界 |
|---|---|---|
| `package.json` | 版本改为 `0.4.0-dev` | 不宣称 alpha、RC 或 accepted |
| `CHANGELOG.md` | 新增开发列车条目 | 只记录已发生的 identity preparation |
| `ROADMAP.md` | current candidate 改为 `v0.4.0-dev`，accepted/fallback 仍为 v0.3.5/v0.3.4 | programme 状态仍是 F1 implementation |
| `init-cloud-sandbox-v0.4.0-dev.bash` | 从当前 bootstrap 轮转，使用 64 位 zero hash | 开发 bootstrap 必须 fail closed，不覆盖 v0.3.5 sealed 文件 |
| `docs/v0.4.0-dev-cloud-hard-acceptance.md` | 新建候选验收入口，初始状态明确 PENDING | 不能复制 v0.3.5 PASS |
| Release/Bootstrap/repository tests | 改为动态读取 candidate 与 accepted 窗口 | 历史 v0.3.5 oracle 仍冻结 |

F0 不改 runtime 行为或 contract schema。它完成后必须先保持完整测试绿色，再进入 F1A；分支名本身不替代这一步。

### F1A — contract/source foundation

F1A 的 production/machine 文件范围如下。`docs/history/*` 中的 v1 文件名属于历史事实，不批量替换。

| 文件/区域 | 精确动作 | 新 authority/consumer |
|---|---|---|
| `upstream-manifest.json` | 顶层 schema 4、顶层/nested exact keys；删 `skill_version`；ABI 直接 hashes 退出；新增 transition contract integrity edge | importer 与 installer 是 exact parser；manifest 是当前 contract 路由索引 |
| `contracts/runtime-bundle-v2.json` | 取代当前 v1；使用 `upstream_files`、`local_files`、`installed_contracts`；adapter 入 bundle；四个当前 ABI 全部 installed | importer 校验/复制 upstream；installer 投影完整 managed runtime；doctor 校验现场 |
| `contracts/release-artifact-v2.json` | 取代当前 v1；entry 自带 mode；删除 state/origin/reason/checksum prose | builder 是唯一 mode/ZIP consumer |
| `contracts/installed-state-transition-v1.json` | 新增仅包含已发布 v0.3.5 installed-state 的精确前向迁移 profile | candidate installer 在任何写入前识别唯一受支持 predecessor |
| `tools/import_upstream_runtime.py` | 只接受 manifest schema 4、bundle v2 exact shape；继续先验 raw bundle hash | 不提供当前 candidate 的 v1 fallback |
| `install.js` | bundle v2 exact loader；删除 bundle 外 adapter/ABI 拼接；消费 transition profile；保持 installed snapshot 语义 | bundle 是 current install inventory authority；transition contract 只拥有 predecessor admission |
| `tools/build_release.py` | 从 manifest 发现 current Release contract；exact 解析 v2 entry mode；删除 `EXECUTABLE_PATHS` | Release entries 成为 ZIP inventory+mode 单一 authority |
| current docs/templates | 当前路径和开发身份改为动态/current v2；供应链说明同步 | 不改写 immutable history |
| contract/import/install/release/oracle/governance tests | failing-first 轮转并增加 unknown/missing/old-field refusal | 证明 schema、路径、mode 和 migration profile 都有真实 consumer |

F1A 保持 adapter → plan request/result v1 → owned-plan 的现有行为。这样 contract/supply-chain 迁移可以独立用所有
legacy golden 验证，不同时调试 state semantics。

### Proposed runtime-bundle v2 shape

顶层只保留 `schema_version`、`contract_id`、`upstream`、`roots`、`upstream_files`、`local_files` 和
`installed_contracts`。`roots` 对 canonical upstream source、upstream package、允许的 local package roots、contract
package root 与 installed root 做 exact 限制；entry 仍使用完整 relative path，loader 同时做 containment，避免 root 只成为
说明文字。

三个分区的 entry shape：

- `upstream_files`：`id/source_path/package_path/installed_path/mode/pristine_sha256/direct_dependencies`；
- `local_files`：`id/package_path/installed_path/mode/sha256/direct_dependencies`；
- `installed_contracts`：`id/package_path/installed_path/mode/sha256`。

`direct_dependencies` 中的每一项都是必需 closure，不再保留无人消费的 `condition`/`required`。普通依赖只含 `id`；
`owned_catchup -> session_catchup` 额外带 exact `allowed_symbols`，由 source-boundary test 消费。依赖图冻结为：

```text
adapter -> owned_plan, owned_catchup
owned_plan -> resolve_plan_dir, inject_plan
owned_catchup -> session_catchup (exact allowed symbols)
inject_plan -> ledger_summary
ledger_summary -> resolve_plan_dir
```

结构分区已经表达来源，所以 v2 删除 entry `origin`；同时退休 `managed_sha256`、空 `overlay_ids`、`language` 与
`host_dependencies`。这正是 Phase 3.9.3 的生命周期退出条件，不是减弱 pristine 保护：upstream 分区、受限 root、pinned
archive、唯一 `pristine_sha256`、byte equality、mode、dependency closure 与 exact inventory 共同接管证据。

adapter、`owned-plan`、`owned-catchup` 是三个 local executable；四个 upstream executable 继续且仅它们保持 Git
`100755` 的源码 mode 规则。ZIP 中所有可执行文件（还包括 installer/importer/builder）由 Release entry mode 决定，
不再由 builder 常量推断。

### Proposed manifest schema 4 and Release v2 shape

`upstream-manifest.json` 顶层 exact keys 保留 upstream/release/commit/archive identity、`required_skill_files` 和
`managed_runtime`，删除重复 `skill_version`。nested managed runtime 轮转为新 schema，并只保留有 consumer 的：

- `contracts.runtime_bundle`、`contracts.release_artifact`、`contracts.installed_state_transition`；
- importer path/hash；
- license provenance 与 notice integrity。

四个内部 ABI 只由 bundle `installed_contracts` 锚定，不再由 manifest 二次 hash。第三方 notice 仍是由 license edge
安装的 package documentation，不变成可执行 runtime source。

Release v2 顶层 exact keys 保留 package identity、archive root、ordering、timestamp、compression、exact entries、
external asset paths 与 excluded prefixes。每个 entry 只有 `{path, mode}`；external assets 改为 path strings。builder
在未显式传 `--contract` 时从 current manifest 发现 v2 path；显式参数仍用于各历史 source 自带的旧 builder/contract。

### Installed manifest is a separate lifecycle

`upstream-manifest schema 4` 不等于 `installed-manifest.json schema 4`。后者当前 schema 3 是现场 ownership/snapshot
协议，并由 v0.3.5 installer 读取。F1 不应顺手轮转它：

- `runtime_files` 继续是安装现场快照，不成为 source authority；
- `adapter_sha256` 在 adapter 入 bundle 后对新 installer 看似重复，但 v0.3.5 doctor 仍消费它；F1 先保留并登记退出条件；
- installed-manifest schema/shape 的轮转必须和 predecessor migration、rollback 一起单独设计，不能借 source manifest
  schema 号混过去。

生命周期结论：`adapter_sha256` 状态为 `KEEP_FOR_V0.3.5_INSTALLED_STATE_WINDOW`，owner 是 install/doctor compatibility；
当 accepted predecessor 不再读取它、且新的 installed-state migration contract 已通过 Linux/Cloud/rollback 后重新审核删除。

### Forward upgrade and rollback are intentionally asymmetric

源码复核暴露了此前规划未写清的事实：F1A 安装四个 ABI 后会新增 catch-up schema；F1B 又会把 installed plan schema
路径从 v1 换成 v2。旧 v0.3.5 installer 的 exact allowed-file 集合不认识这些路径，因此它不可能直接接管 F1B 现场；
而没有专用迁移 profile 的 F1B installer 也会把 v0.3.5 遗留的 plan-v1 schema 当 unknown file 拒绝。

最佳闭环不是保留两套活跃 schema，也不是放宽 unknown-file blocker，而是：

1. candidate 通过 `installed-state-transition-v1.json` **单向、精确**接管已发布 v0.3.5：校验 owner/schema/version、
   exact manifest keys、旧 runtime inventory/path/hash/mode、实际 bytes 与 managed requirements ownership 后，才允许 backup+replace；
2. transition contract 只列 v0.3.5，不因为 v0.3.4 是 publication fallback 就自动扩大 installed-state support；
3. rollback 使用 candidate installer 明确 `uninstall`/保存 backup，再运行 immutable v0.3.5 clean install；不得声称旧 installer
   可以原地识别新 layout；
4. upgrade/rollback 每个失败点都要证明 prior bytes、requirements 与 backup 集不被 partial mutation；
5. transition profile 不进入 runtime bundle/installed runtime，只由 package manifest integrity 固定并由 installer 消费。

该 compatibility contract 的生命周期是 `ONE_ACCEPTED_PREDECESSOR_WINDOW`：owner 为 installer；review trigger 是 accepted
baseline promotion；后续版本只能替换成当时明确支持的前代 profile，不能无限累积历史 inventories。若维护者不愿承担该
迁移 contract，安全备选是公开只支持 old uninstall → candidate clean install，但必须同时修改 bootstrap/Cloud runbook；
不能继续写“直接双向 takeover”。当前推荐前者。

## F1B exact runtime/protocol map

### Files and protocol rotation

| 文件/区域 | F1B 动作 | 不做什么 |
|---|---|---|
| plan request/result schemas | 删除 current candidate 的 plan-v1 文件，新增 v2；bundle/Release/hashes 同步 | 不提供 active v1/v2 dual loader |
| `hooks/hook_adapter.py` | 生产 request 固定 `allowed_profiles=[legacy]`、`opt_in_protocol=codex-managed-v1`；exact 校验 v2 result/advisory | 不解析 workspace state，不决定 effective mode |
| `runtime/owned-plan.py` | exact-v2 parser/result；加入受控 state reader/normalizer seam；build capability 仍仅 legacy | 不写 workspace，不投影 raw state，不激活 smart/autonomous |
| bundle/manifest/Release | plan schema entries/path/hash 从 v1 原子切换到 v2；其他 F1A shape 不变 | 不复用 F1A ZIP/hash |
| runtime/seam/golden/install tests | 证明 forged future capability 被拒、state helper 受测、production marker 零读取、legacy byte parity | 不用单纯 schema 文件存在代替 producer/consumer 测试 |

state reader/normalizer 先作为 `owned-plan.py` 内部函数存在，以复用当前 descriptor-relative no-follow/single-link/race
边界，不提前增加新的 installed module。若 F2B 的 ledger normalizer 使该文件无法独立审查，再以新 gate 提议拆 module；
“以后也许会大”不足以在 F1B 增加 trusted file。

### Plan request/result v2 seam

request v2 保持现有 runtime/event/project/output budgets；policy exact keys 改为：

- `planning_enabled`；
- ordered `allowed_profiles`，schema 允许未来 gate 的精确序列 `[legacy]`、`[legacy,smart]`、
  `[legacy,smart,autonomous]`；
- `opt_in_protocol=codex-managed-v1`。

F1B binary 另有 `SUPPORTED_PROFILES=[legacy]`。因此即使绕过 adapter 伪造 smart/autonomous request，owned-plan 也必须
返回 non-injecting invalid/unsupported result，不能触发 state capture。F2A/F2B 分别改变 producer capability 与 runtime
supported set，不需要再次轮转 schema。

result v2 在 v1 字段上新增 exact `effective_profile` 与 bounded `advisory`：正常 legacy result 的 profile 为 `legacy`、
advisory 为 `null`；无法建立 profile 时 profile 可为 `null`。refusal 只传 exact reason code，adapter 将 code 映射为固定、
有长度上限的用户提示，绝不接受 child 自由文本。建议 reason taxonomy 只覆盖
`state_unsafe/opt_in_invalid/profile_unsupported/state_incomplete/state_changed/state_over_budget`；具体 code 名可在
failing-first schema patch 中微调，但不得携带 hash、nonce、ledger count 或 raw path/content。

F1B production 必须在 `allowed_profiles == [legacy]` 后、任何 state helper 前短路。state helper 的 grammar/race unit tests
可以直接调用受控 seam；production `run_request/execute` 对 future profile 同时受 producer policy 与 runtime supported-set
双重关闭。

## P2 dependency and atomicity map

### Hash and inventory propagation

```text
F0 package/bootstrap/acceptance identity
  -> Release package_version + external bootstrap path

F1A source/contract bytes
  -> runtime-bundle-v2 entry hashes
  -> upstream-manifest bundle/transition/Release/importer/license refs
  -> install.js runtime projection + installed-manifest runtime_files snapshot
  -> release-artifact-v2 entries + entry modes
  -> deterministic ZIP bytes/SHA
  -> zero-hash development bootstrap remains intentionally unsealed

F1B plan-v2 schemas + adapter/owned-plan bytes
  -> runtime-bundle-v2 local/installed-contract hashes
  -> upstream-manifest bundle hash
  -> release-artifact-v2 path inventory
  -> new deterministic ZIP bytes/SHA
```

每个提交都必须从 leaves 到 manifest/Release 重新闭合，不能提交 stale hash。F1A 和 F1B 都能形成 build/check/install/doctor
绿色树；F1A 只是审查 checkpoint，F1B 之后必须废弃 F1A artifact identity。开发 bootstrap 维持 zero hash，直到后续独立
seal gate 才写精确 candidate ZIP SHA。

### Current versus historical discovery

- current importer 继续从 current manifest 发现 bundle；current builder/tests/template 同样从 manifest 发现 Release path；
- published v0.3.5/v0.3.4 source oracle 读取各自 source snapshot 的 manifest/contract，仍使用 v1；
- current-source oracle 不得借历史固定文件名，drift mutation 要定位 current manifest 指向的 bundle；
- candidate trusted source zones 只允许 v2/schema4；历史 Git objects/docs 可以提到 v1，但不进入 current ZIP/runtime。

## P3 failing-first and regression plan

### F0 sequence

1. 先改 repository/bootstrap/release identity tests，要求 candidate=0.4.0-dev、accepted=v0.3.5、zero hash 和双文件窗口；
2. 再轮转 package/ROADMAP/CHANGELOG/bootstrap/acceptance；
3. 跑 focused governance/bootstrap/release 与 full suite，单独 commit；不顺手进入 F1A。

### F1A sequence

1. `contracts.test.js` 先要求 schema4/v2 exact keys、字段退休、adapter/四 ABI placement、dependency closure；
2. importer/installer mutation tests 先覆盖 old/unknown/missing keys、unsafe roots、hash mismatch、mode、transition profile，
   并断言 pre-write state 完全不变；
3. release tests 先要求 entry-owned mode、删除 builder mode set、动态 contract discovery、双构建一致；
4. published oracle 先拆开 historical self-discovery 与 current discovery，并增加 v0.3.5 → candidate forward migration；
5. 再改三个 contracts/loaders/install projection；最后更新 hashes、current docs 与 static boundaries；
6. 跑所有 legacy activation/golden/adapter/catch-up tests，证明 F1A 只有供应链变化。

明确保留 absence guards：candidate v2 拒绝 `origin/managed_sha256/overlay_ids/language/host_dependencies` 和 deferred writer
paths；这些是新结构的直接边界，不是依赖旧测试标题的 tombstone 元测试。

### F1B sequence

1. 先写 plan-v2 schema/seam tests：exact policy、ordered profile sets、result relational rules、bounded advisory、impossible
   combinations；
2. 先写 production marker-unreachable test：patch state capture/open helper 为“调用即失败”，两种 Host event、planning disabled、
   no-plan/active plan 仍不得调用；再加恶意 marker fixture证明 legacy 输出不变；
3. 先写 forged smart/autonomous request 被 F1B supported-set 拒绝，零 state read/零 context；
4. state reader/normalizer 只做受控 unit tests：safe regular/single-link/bounds/UTF-8/identity/race 与 exact grammar；不通过
   production 开口模拟 F2；
5. 再实现 adapter/owned-plan v2，并原子替换 plan-v1 contract paths/hashes；
6. 重跑全部 legacy golden，输出必须 byte-for-byte 等于 v0.3.5 fixture；snapshot residue 永远为零。

## P4 platform, migration and rollback matrix

| 环境/gate | 必须证明 | 不承担的结论 |
|---|---|---|
| Windows/local | exact JSON/mutation、adapter doubles、installer temp homes、historical/current discovery、deterministic ZIP、governance；POSIX case 诚实 SKIP | 不替代 descriptor/race/mode/cross-user |
| Linux F1A | full suite、import/build/check、mode、install/doctor/repair/uninstall、v0.3.5 exact forward migration、failed migration zero mutation | 不宣称 state foundation 或 Cloud lifecycle |
| Linux F1B | F1A 全部 + plan-v2 seam、state-reader safety、legacy zero-read、golden parity、candidate uninstall → v0.3.5 clean rollback → candidate migration | 不激活 smart/autonomous |
| no-live Cloud F1 foundation | F1B 完成后只跑一次 Source/Candidate Fresh + real Resume、startup/resume、doctor、inventory/mode/hash、cache reuse、v0.3.5 forward migration与显式 rollback、`SNAPSHOT_LEFTOVERS=0` | 不重复为 F1A 单独烧一轮 Cloud，不等于 F3 activated Cloud 或 Release |

这样回应了此前“只改版本号却重复 Cloud”的浪费问题：F0 和 F1A 只做与风险匹配的 local/Linux；完整 F1B 闭合后
再跑一次 no-live Cloud foundation。只有 Linux 暴露真实 Cloud path/permission 假设冲突时，才允许在 F1A 提前增加最小
Cloud probe，并记录原因。F3 以后承担已激活 smart/autonomous 的 Fresh/Resume/opt-out/re-arm/tamper Cloud acceptance。

## P5 entry, exit and stop conditions

### F1A entry and exit

进入条件：维护者另行授权 F0/F1A；工作树可分离；v0.3.5 accepted identity、upstream pin 与 current Host event set 未变；
F0 已绿色 commit。

退出条件：

1. manifest schema4、bundle/Release v2 与 transition contract exact、单一且所有 raw hashes 闭合；
2. adapter 与四 ABI 由 bundle 投影一次；Release mode 无第二 authority；retired fields/denied files 均被 direct guard 拒绝；
3. v0.3.5 direct forward migration 只接受精确 profile，未知/篡改现场 pre-write fail closed；
4. plan-v1 legacy runtime/golden、install/doctor/repair/uninstall、deterministic ZIP、local+Linux 全绿；
5. 无新 Host event、workspace read/write、state marker、persistent cache、smart/autonomous/gated behavior；
6. 独立 local commit，停止并汇报；不自动进入 F1B。

### F1B entry and exit

进入条件：F1A 已通过并由维护者授权 F1B；不复用 F1A ZIP/hash。

退出条件：

1. candidate 只含 plan protocol v2；adapter producer、owned-plan consumer 与 JSON schema 同时 exact；
2. production policy/runtime capability 均为 `[legacy]`，future forged profiles non-injecting；
3. `.mode`/nonce/attestation/ledger 在 production 零 open/read，全部 v0.3.5 legacy golden byte-identical；
4. state reader unit seam 通过安全文件、bounds、UTF-8、identity/race/grammar tests，但没有 production activation path；
5. bundle/manifest/Release/hashes/installed inventory 重新闭合；local+Linux+一次 no-live Cloud foundation 全绿；
6. v0.3.5 forward migration、candidate-controlled rollback/clean reinstall、Resume/cache 和 zero residue 通过；
7. 独立 commit 后停止，结论最多为 `CONDITIONAL_GO_TO_F2A_DISCOVERY/AUTHORIZATION`，不自动激活。

### Stop and reopen conditions

- 如果必须保留 active plan-v1/plan-v2 双 loader 才能迁移，停止；改走 explicit transition/clean-install，不削弱 exact current schema；
- 如果 installed-state profile 不能精确识别 v0.3.5 或要求信任自报 manifest hashes，停止并把支持面降为 uninstall→clean install；
- 如果 F1B state helper 需要新 writer、Host event、persistent cache、workspace mutation 或执行 deferred upstream source，重开 Discovery；
- 如果 legacy output、catch-up ordering、canary、adapter-only policy 或 pristine upstream bytes 改变，停止并分类 product defect；
- 如果 current package identity、accepted baseline、upstream pin、Host/Cloud ABI 在实施前变化，重做 evidence refresh；
- 如果 `0.4.0-alpha.N` 准备公开发布，另开 identity/seal/Cloud/Release gate；F1A/F1B 绿色不自动冻结 alpha。

## Route conclusion

结论为：

`GO_TO_SEPARATE_F0_THEN_F1A_WHEN_AUTHORIZED / F1B_REQUIRES_F1A_PASS_AND_NEW_AUTHORIZATION / CLOSEOUT_COMPLETE / IMPLEMENTATION_NOT_AUTHORIZED`

F1A/F1B 的文件、authority、hash、测试、升级与平台边界已经足够清晰，可以结束实施规划探路。唯一新增的重要校准
是 installed-state transition：forward upgrade 与 rollback 必须按真实文件集合设计成非对称流程，不能继续笼统写成“旧新
installer 直接双向 takeover”。这个校准不改变 Phase 4.1 hybrid 架构或 Phase 4.2 gate 顺序，只把 F1/F3 的兼容证据说实。

## Post-closeout maintainer clarification

- ROADMAP 的状态文字曾提到 F0，但正式 Phase 4 顺序和 gate table 从 F1A 开始；现已确认这是 programme 表达缺口，
  F0 应作为正式独立前置 gate，完整顺序为 `F0 → F1A → F1B → F2A → F2B → F3`。
- Phase 4.3 原有字段 lifecycle、hash propagation、absence guards 和 retirement conditions，但缺少跨字段/代码/路径/
  测试/文档的一张对象级迁移总账。历史摘要与 ROADMAP 已补充 ledger 最小字段、迁移前/中/后对账、current residue 与
  immutable history 分类、deferred owner/sunset 以及 Phase 9 retirement audit。
- ledger 只存在于未来各 gate 的活动 planning，服务施工和回溯；不得复制为新的 machine authority。
- 维护者当前明确暂停 F0；上述文档完善不产生 F0/F1A implementation 授权。
