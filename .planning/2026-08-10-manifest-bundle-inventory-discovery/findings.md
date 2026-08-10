# Findings: Manifest/Bundle Inventory Authority Discovery

## Initial framing

- 当前文档把 runtime bundle称为 owned upstream inventory/source authority，但 installer 模块说明仍直接读取
  `upstream-manifest.json`；这表明 source/import 与 install 两层可能各自形成了 inventory authority。
- `upstream-manifest.json` 同时承载 pinned upstream provenance、contract integrity references 和 managed runtime
  inventory；runtime bundle 则承载更丰富的 source/package/installed paths、hash、mode 与 dependency graph。
- 去重不能只删除重复数组；必须先决定哪个文件拥有 inventory，以及另一个文件如何验证并消费该权威。

## Non-goals

- 不删除 `ledger-summary.sh`，不改变 runtime 文件集合。
- 不进入 Phase 4 或任何行为激活。
- 不在 Discovery 阶段改 schema、consumer 或 Release 字节。

## D0 history evidence

- `upstream-manifest.json` 最早存在于 v0.2.2；当时是 schema v2，只固定 upstream Skill/archive、required Skill
  files 和 compatibility patch provenance，不包含 managed runtime inventory。
- `033a82b`（`0.3.0-alpha.1`）在同一个 contract-only gate 中同时：把 manifest 升到 schema v3 并新增
  `managed_runtime.files`；创建 `PWF_MANAGED_RUNTIME_BUNDLE_V1`；创建 importer、Release builder 和相应 tests；
  扩展 installer 让它从 manifest 组装安装文件。
- 因而重叠不是后期复制失控，而是首版分层时有意形成的双视图：importer 直接读 bundle 的 source inventory，
  installer 直接读 manifest 的简化 install inventory；manifest 同时以 SHA-256 锚定 bundle。
- 首版 bundle 比 manifest 更丰富：增加 installed path、language、dependency/host dependency、overlay/phase
  信息；manifest 只复制 importer/installer 共用的 id、source/package path、mode、origin 和 content hashes。
- 后续版本不断同步两份数组；`3234e4e` successor baseline 继承双视图，`60c9b11` 退休 overlay 后仍保留双份
  pristine inventory，`07bc83c` 只从 bundle 删除 programme metadata，没有解决 authority 重叠。
- Phase 1 原始设计文档明确把 runtime bundle 等 contracts 称为 machine-readable sources of truth，却没有把
  upstream manifest 列入该列表；它同时明确 importer 消费 bundle。原始 contract test 则承担两份数组逐字段
  相等的防漂移断言。
- `e0e793c` 在两个文件中同步加入两个 local owned runtimes；`dfb75a9` 在 bundle 加入 installed contracts；
  `3234e4e` 建 successor baseline 时再次同步重建 manifest/bundle/install.js/tests，延续同一镜像模型。
- `60c9b11` 证明每次供应链变化都要双写：overlay 退休时，bundle 和 manifest 同时改 origin/hash，contract
  test 再验证相等。这种同步断言避免静默漂移，却没有消除双主写入成本。

## D0 conclusion

- 根因是 0.3.0-alpha.1 把“source/import 合同”和“installer package manifest”交给两个直接消费者，却没有
  让 installer 通过已由 manifest hash 锚定的 bundle 读取 inventory。为了让 installer 不理解 bundle 的丰富
  dependency 字段，选择复制最小子集；后来 local runtime/installed contract 加入后，镜像扩展成长期结构。
- 这不是两份独立业务事实：原始测试要求字段相等、当前值也完全相等，因此重复部分应收敛为一个 machine
  authority；但 manifest 的 provenance/integrity ledger 与 bundle 的 dependency graph 仍需分别保留。

## D1 current consumer map

| 层/消费者 | 当前直接读取 | inventory 用途 |
|---|---|---|
| importer | runtime bundle `upstream/package_root/files` | archive/source allowlist、pristine hash、destination exact inventory、mode |
| installer source assembly | manifest `managed_runtime.local_files/files/contracts/license_provenance` | 形成复制源、installed relative path、hash、mode |
| installed-manifest builder | installer 的 `runtimeInventory()` + 整份 `UPSTREAM` manifest | 写入安装时派生快照，供 doctor/repair/drift 比较 |
| doctor/repair/install safety | 再调用 manifest-derived `sourceRuntimeFiles()` | exact installed file/directory set、hash/mode、unknown drift |
| Release builder | release artifact `entries` | ZIP entry inventory；只把 manifest 与 bundle 当字节，不理解 runtime inventory |
| contract/architecture tests | 同时读取 manifest + bundle | 校验 integrity references、两份数组逐字段相等、dependency/installed contract 关系 |
| import tests/helper tests | runtime bundle | importer fail-closed 与 helper graph 边界 |

- `install.js` 启动时只 `require("./upstream-manifest.json")`，没有加载 runtime bundle。manifest 中 bundle
  path/SHA 当前由 contract test 验证，但 installer 不在运行时校验该 SHA，因为 runtime_bundle 没有
  `installed_path`，不会进入 installed contracts loop。
- `sourceRuntimeFiles()` 是 install、doctor、repair、unknown-entry blocker 和 installed manifest 的共同 source
  projection；若 authority 切换，必须一次性切换这个函数的输入，不能让各命令分读不同 inventory。
- `installed-manifest.json.runtime_files` 是已安装状态的派生快照，不是重复的源码 authority，应保留；它必须继续
  与当前权威 inventory 对比，才能识别 drift。Release artifact inventory同理属于 ZIP 层，不能被本次去重删除。
- manifest 的 `managed_runtime.contracts`、importer hash、license/notice provenance 不是 bundle inventory 重复，
  它们是 integrity/provenance ledger；去重目标只应是 `local_files`、`files`，并视设计决定是否迁移两个 package root。

## Critical trust edge

- 如果 installer 改读 bundle，顺序必须是：从 manifest 取固定 bundle path/SHA → 对 bundle 原始字节算 hash 并
  fail closed → 严格解析/校验 bundle schema/path/id/mode/hash → 派生 install inventory。不能直接 `require(bundle)`
  后信任 bundle 内自报 hash，否则被篡改 bundle 可以同时篡改“文件内容”和“期望 hash”。
- manifest 仍由外层候选 ZIP checksum/immutable Release identity 保护；本地 source install 还需上述内部 hash
  edge，维持现有 `BLOCKED_PACKAGE_DRIFT` 语义。

## Existing test implications

- installer fixture 已把 `contracts/` 整体复制进隔离 package，因此切换到 bundle 不要求新增测试打包输入；但
  当前 installer tests 没有“bundle hash mismatch/invalid schema/unsafe path/duplicate id”用例，需要 failing-first 补齐。
- installer tests 已覆盖 installed manifest runtime inventory tamper、unknown installed entry、owned file hash/mode
  drift 和 repair blocker；authority 迁移后这些行为应保持，expected inventory 只改为从已验证 bundle 派生。
- architecture test 同时要求 bundle 和 manifest 都含 `owned_plan`，这是双 authority 的架构断言；应迁成 bundle
  单一存在性 + manifest 不再携带 arrays + installer 确实验证 bundle integrity 的断言。
- bootstrap 只把 manifest 顶层 archive URL/SHA、required Skill files 作为固定上游来源；删除 managed runtime
  arrays 不影响 bootstrap 逻辑。

## D1 conclusion

- 供应链中实际存在四种不同 inventory，只有第一、第二项应该去重：source runtime bundle、manifest 的
  install projection、installed-manifest state snapshot、Release ZIP entry allowlist。后两项属于不同生命周期，
  继续独立是安全需要。
- importer 的 `--bundle` 允许独立 fixture，当前默认执行也不读取 manifest anchor；repository contract test 才
  校验 bundle SHA。若选择 bundle authority，推荐同时让默认 importer 和 installer 都执行 manifest → bundle
  hash edge，fixture 则显式提供配套临时 manifest，避免只有测试进程替生产校验 integrity。
- authority 迁移集中在 installer `sourceRuntimeFiles()` 和 importer contract loader；installed manifest、doctor、
  repair、write/unknown inventory 都已汇聚到这两个 projection，下游不必各自重写。

## D2 option comparison

| 路线 | 做法 | 优点 | 主要问题 | 结论 |
|---|---|---|---|---|
| Manifest authority | 保留 manifest arrays；bundle 只留 dependency/installed enrichment，importer 改读 manifest | installer 改动最少 | 反转 Phase 1 原始 authority；manifest 继续混合 provenance、integrity、source inventory；Phase 4 新组件仍需跨文件 join | NO_GO |
| Bundle authority | manifest 只保留 bundle path/SHA 与非重复 provenance/integrity；installer/importer 校验后消费 bundle | bundle 是现有字段超集；source/package/install/dependency 同处；未来准入只改一个 inventory | 需要严格 Node loader、importer hash edge、nested schema migration 和 installer/rollback gate | 推荐 |
| Generated mirror | bundle 为作者源，通过 generator 继续写 manifest arrays | consumer 改动小，消除手工双写 | artifact 中仍有两份事实；新增 generator/生成时序和 source-vs-ZIP 漂移；未解决语义双 authority | 仅可作短暂迁移工具，不作终态 |

- 另建第三份 shared inventory contract 会增加一个 hash edge 和两边 join，而 bundle 已经是严格超集，没有收益；
  不推荐。
- 当前 manifest 约 4,974 bytes；删除 package roots、两组 arrays 以及由 bundle 已覆盖的两个 installed contract
  references 后，机械投影约 3,673 bytes，减少约 1.3 KiB。体积不是决策理由，单一变更权威才是。

## Recommended ownership split

### `upstream-manifest.json` keeps

- pinned upstream/Skill provenance 与 required Skill files；
- `managed_runtime.schema_version = 2`；
- runtime bundle 的 exact relative path + SHA-256；
- 不由 bundle 覆盖的 maintenance/ABI/Release contract integrity refs；
- importer 与 notice/license provenance。

### `upstream-manifest.json` removes

- `managed_runtime.package_root`、`local_package_root`、`local_files`、`files`；
- `adapter_plan_context_request`、`plan_context_result` 的独立 installed-path projection；这两个 installed contracts
  已由 bundle `installed_contracts` 完整固定 path/installed_path/hash/mode。

### Runtime bundle owns

- 两个 local runtime、四个 upstream runtime、两个 installed contracts 的 source/package/installed path、hash、
  mode、origin 与 dependency metadata（共 8 个 bundle-declared components）；
- 当前 exact id/source negative guard，包括未准入 Phase 4 文件不得出现；
- installer envelope 仍单独加入 adapter 与 notice，因此 installed runtime 仍为 10 个受管文件，集合不变。

### Explicitly unchanged

- Release artifact 继续拥有 ZIP entries；installed manifest `runtime_files` 继续保存安装状态快照；二者不是重复
  source authority，不参与删除。
- bundle 中 upstream provenance block 暂不迁移。本 gate 只解决 inventory，避免顺手扩大为 provenance schema
  重构；未来若要去重应另开 gate。

## Required integrity chain

```text
trusted Git/ZIP bytes
  -> upstream-manifest managed_runtime.runtime_bundle {path, sha256}
  -> verify raw bundle bytes before JSON parse/use
  -> strict bundle schema/path/id/hash/mode/dependency validation
  -> importer source inventory / installer source projection
  -> installed-manifest runtime_files snapshot
  -> doctor/repair exact drift comparison
```

- manifest 是受 Git/ZIP 身份保护后的内部 integrity index，不单独创造 authenticity；zero-hash dev bootstrap 仍
  fail closed，正式身份仍来自 sealed ZIP/bootstrap。

## D3 proposed implementation gates

### I0 — Failing-first guards

- contract test 要求 manifest nested schema v2，且禁止 `package_root/local_package_root/local_files/files`；bundle
  继续固定 exact 2 local + 4 upstream + 2 installed contracts。
- installer package fixtures覆盖：bundle missing、raw SHA mismatch、invalid JSON/schema、unsafe/duplicate package
  或 installed path、duplicate id、invalid hash/mode、unknown dependency。
- importer 默认路径必须验证 manifest → bundle hash；synthetic fixture 同时生成临时 manifest + bundle。
- 保留“Phase 4 candidates 不得进入 bundle exact id/source inventory”的负向断言。
- 增加 v0.3.3 exact managed layout → v0.3.4 install → doctor → v0.3.3 rollback 的兼容/回滚证据；若完整
  published fixture 只能在 ref-aware checkout 执行，则拆成 portable layout test + publication audit test。

### I1 — Verified bundle consumers

- `install.js` 不直接 `require` bundle；先从 manifest 读取 safe relative path/SHA，对原始字节校验，再 parse 并
  严格验证 bundle。`sourceRuntimeFiles()` 只从已验证 bundle 的 local/files/installed_contracts 派生。
- installer 使用 bundle `installed_path`，不再从 package path 隐式推导目标；解析后仍校验 source 文件实际
  hash/mode，所有失败发生在 acquire/write/backup 之前并返回 `BLOCKED_PACKAGE_DRIFT`。
- importer 新增 manifest loader，默认从 manifest reference 解析 bundle 并验证 raw SHA；`--bundle` override
  仍必须与显式/默认 manifest hash 对齐。

### I2 — Remove mirrors atomically

- manifest nested schema `1 → 2`，删除两组 arrays、两个 package roots 和 bundle 已覆盖的两个 installed contract
  projections；保留 bundle ref、非重复 contracts、importer 和 license/notice provenance。
- 更新 importer hash、相关 contract assertions、Architecture/DESIGN/README/AGENTS 的 authority 表述、CHANGELOG
  与 v0.3.4 pending acceptance；不改 runtime bundle inventory/bytes，除非测试证明 schema必须显式新增字段。
- installed manifest container schema 保持 3：其 `runtime_files` 与行为未变，`upstream` 只是当前 source provenance
  snapshot；任何现有 v0.3.3 doctor mismatch 沿用版本升级语义，不把 unknown drift 变成 repairable。

### I3 — Local/Linux supply-chain verification

- focused：contracts、installer、import-runtime、architecture、release-package、publication oracles；随后完整 suite。
- importer check、Node/Python/Bash syntax、Git modes/LF、manifest/bundle/importer hashes、两次 deterministic ZIP。
- Linux：fresh install/doctor/repair/uninstall、cross-user readability、bundle tamper-before-write、v0.3.3 managed layout
  replacement与 rollback。
- Source/Candidate Cloud：zero-hash override 下安装 candidate ZIP、doctor、installed exact inventory 与基本 Hook smoke；
  不宣称 Published Release，不进入 Phase 4。

## Failure matrix

| Failure | Required outcome |
|---|---|
| bundle missing/hash mismatch/invalid JSON/schema | install/import 在任何写入前 fail closed |
| unsafe/duplicate id/path/mode/hash/dependency | `BLOCKED_PACKAGE_DRIFT` 或 importer unhealthy；不产生 partial install/import |
| runtime source bytes 与 bundle hash 不符 | fail closed；不得让 bundle 自报 hash掩盖内容漂移 |
| installed manifest/runtime_files 被改 | doctor blocker；repair 不吸收 unknown drift |
| v0.3.3 exact managed layout | 普通 install 可替换为 v0.3.4；doctor-only 不猜测升级 |
| rollback 到 immutable v0.3.3 | 同一 installed set 可被 v0.3.3 installer重新接管；已发布资产不改写 |
| runtime/installed file set 发生变化 | 停止，本设计失效并重新 Discovery |

## Release and rollback boundary

- I0～I3 只完成 v0.3.4-dev Source/Candidate implementation，不授权 seal。任何 ZIP 变化继续由 zero-hash bootstrap
  fail closed。
- 独立 Release gate 必须在 implementation/Linux/Source-Cloud 通过后重新冻结 ZIP inputs、双构建、写入 bootstrap
  exact SHA、发布、重新下载双资产、Published Cloud 与 rollback；不得与 Phase 4 激活合并。
- 发布前回滚是 revert authority migration；发布后产品回滚继续指向 immutable v0.3.3。因为 runtime bytes/layout
  不变，rollback 风险集中在 installer source contract，必须由端到端替换测试证明。

## D3 conclusion

- `CONDITIONAL_GO_BUNDLE_AUTHORITY`：架构路线清晰，且不与 Phase 4/9 冲突；条件是维护者明确授权上述 I0～I3，
  并坚持 failing-first、raw bundle hash edge、unchanged installed inventory 和 cross-version rollback 四条门槛。
- Discovery 结论不授权 implementation、seal、publication、Cloud deployment 或 Phase 4。

## Current overlap

- upstream 四项的 manifest 字段是 bundle 字段的严格子集：7/12 字段重复；local 两项是 5/9 字段重复。
- 两边当前 id 顺序和文件集合完全相同：upstream 为 session/resolve/inject/ledger，local 为 catch-up/plan。
- bundle 还独占 installed paths、installed contracts 和 dependency graph；manifest 还独占 contract/importer/
  notice integrity references。两份文件不是整体重复，真正重复的是 `managed_runtime.files/local_files` 视图。

## History promotion

- Phase 3.7 补录 contract metadata 退休：`activation_phase` 与 `deferred_upstream_candidates` 只是早期路线标签，
  production 从未读取，只有测试为了冻结当时 rollout 计划而维护；exact inventory guard 接替负向准入职责。
- Phase 3.8 只冻结本次 Discovery 的根因、consumer map、路线取舍、trust chain 与实施边界，明确标注 bundle
  authority 是 `CONDITIONAL_GO`，不把尚未授权的 implementation 写成已完成交付。
- Phase 3.7 的精确时间线是：`033a82b` 同时引入两个 programme 字段，并建立 deferred source 不得进入
  `bundle.files`、`earliest_phase >= 4` 的断言；`owned_catchup=2` 与 `owned_plan=3` 是两个 owned runtime
  后续加入时才补进测试。共同根因仍是测试冻结阶段计划，而 production 从不把 Phase 数字作为执行输入。
