# Task Plan: Current-tree Cleanup Audit

## Goal

在已完成的 v0.3.4 current-tree 审计基础上，冻结一条不做“大扫除”的最小清理路线：先用一个兼容版本清除
明确错误的 notice、历史尾项和低价值静态断言；兼容版本完整闭合后，再用独立 contract/Release-v2 Discovery
决定 machine metadata 与 mode authority 的去留。Phase 4 只作为本路线结束后的下一任务提示。

## Authorization

- 维护者已明确选择 `0.3.5-dev` 作为下一兼容开发分支，并授权实施 Gate C1 的本地 source/candidate 工作。
- 授权范围只限 C1 明列 notice/history/test-assertion cleanup、版本/hash/候选资产同步、本地 commit 与验证；
  不授权 contract/Release-v2 schema 改造、Product Phase 4 source 或行为激活。
- 远端 tag、push、Release、Latest、部署与 Cloud 外部状态变更仍由维护者执行；智能体只准备精确本地提交、命令和
  只读 postflight。C1 未闭合不得进入 Gate C2，Gate C2 Discovery 又不自动授权 contract-v2 implementation。
- 维护者已回传 `v0.3.5-dev` Cloud 仓库构建/测试与发布 ZIP 下载、安装验收均通过，并明确授权直接收敛
  `v0.3.5` stable identity、执行本地 deterministic seal、写入 exact ZIP hash 和创建本地 commit。该授权不包含
  push、stable tag/Release、Latest/promotion、C2 或 Phase 4。
- 维护者现已回传 sealed commits 已 push，`HEAD=5d01b55890c1da2a5088e2b991b152a9fb1c3f87` 的 Linux
  Source/Candidate setup 118/118 与 Post-Resume 全绿，并确认 GitHub publication、公开 ZIP 下载和安装通过；结合
  先前约定，授权恢复 C1 只读 publication/postflight 核验，C1 accepted closure 成立后进入 C2 Discovery。该授权
  仍不包含任何远端写、contract-v2 implementation 或 Phase 4。
- 维护者已授权从当前 closure HEAD 创建并切换本地 `0.4.0-dev` 分支，同时重新打开 C2 tombstone 取舍讨论。
  该分支名不等于 package/machine identity、Phase 4 implementation 或 Release 授权。
- 所有结论必须区分 production reachability、source/import/install/ZIP authority、未来已规划能力与测试价值。

## Gates

- [x] D0 — Inventory：扫描源码、contracts、Release allowlist、文档和测试的职责与引用关系。
- [x] D1 — Reachability and assertion audit：恢复生产调用图，并把测试分为行为安全、供应链安全、治理结构、
  历史形状四类，识别重复或过拟合断言。
- [x] D2 — Recommendation：给出保留、可直接精简、需独立 Discovery/Release gate 三张清单及优先顺序。
- [x] R0 — Route freeze：结合 Phase 3.9.1，把审计结论拆成 Gate C1、Gate C2 与 Phase 4 next-task hint，冻结范围、
  顺序、验证和停止条件；未实施任何清理。
- [x] C1 — Next compatible cleanup：`v0.3.5` exact source/tag、非 prerelease Release、Latest、双资产、Cloud/下载
  验收与 accepted/fallback 角色轮转全部闭合；未改变 runtime/ABI/trusted graph 或夹带 contract-v2。
- [ ] C2 — Contract/Release-v2 Discovery（观点复核中）：重新判断 overlay tombstone/专用反复活断言是否有
  长期价值，区分通用 exact-schema 完整性、正向 pristine contract 与架构路线治理；不实施 schema/source。

## Next Step

在本地 `0.4.0-dev` 上继续 C2 讨论态：复核“删除 tombstone 后是否还需要 overlay 专用 absence/negative guard”。
只允许更新证据与取舍；不得修改 machine contract、production、package identity 或激活 Phase 4 source。

## Decision

`C1_ACCEPTED_CLOSURE_PASS / C2_DISCOVERY_REOPENED_FOR_TOMBSTONE_REVIEW / NO_IMPLEMENTATION / PHASE4_NOT_AUTHORIZED`

## Route invariants

- 保留 `ledger-summary.sh` 及其 bundle dependency、ZIP/install inventory 和 executable mode；当前不可达由
  managed-legacy snapshot 保证，不把真实 upstream 条件依赖误判成死文件。
- 保留 `activation_phase`、`deferred_upstream_candidates` 的 absence guard 与 Phase 4 denied-source guard；
  它们防止退休字段或未准入 runtime 回流。
- 保留 bundle 作为唯一 source/install inventory authority；保留 `installed-manifest.runtime_files` 现场快照、
  `release-artifact.entries` ZIP allowlist 和 installer 独立 negative oracle，不继续做伪去重。
- `.planning/.active_plan` 只选择活动 scope，不恢复自动删除。维护者已有 planning deletions 继续作为独立工作树
  变更处理，不混入清理 gate commit。
- C1 不改变 runtime dispatch、Host ABI、trusted graph、managed-legacy output、installed runtime inventory 或
  machine-contract schema。C2 Discovery 可以研究这些边界，但没有 implementation 授权。

## Gate C1 — Next compatible cleanup

### C1.0 Admission and baseline（完成）

1. 维护者先选择并授权新 candidate identity；不得改写已发布 v0.3.4 或复用其 sealed ZIP/bootstrap identity。
2. 恢复 accepted + immediate-fallback 角色窗口、活动 planning、Git 状态和用户改动归属；为 C1 建立明确的
   candidate/acceptance 记录，不把本审计文档当 Release authority。
3. 运行 importer check、完整 suite、Python/Node/Bash syntax、deterministic ZIP check 与 `git diff --check`，记录
   Windows POSIX skip 基线；任何基线 product failure 先分类，不带病开始清理。

### C1.1 Failing-first guards and assertion classification（完成）

1. 在 notice 最近的 contract/package boundary 增加直接断言：四个 upstream 文件为 pristine，notice 不得再声明
   session-catchup overlay；先让该断言对当前旧文字失败。
2. 为准备修改的 prose regex 建立逐条分类表：`KEEP_STRUCTURAL`、`REPLACE_WITH_STRUCTURAL`、`DELETE_DUPLICATE`。
   只有已由 source/contract/behavior test 直接覆盖的措辞/顺序锁才允许删除。
3. 给 Release candidate 测试增加动态身份断言：package version、artifact package version、bootstrap filename/default
   version 必须关系一致；builder 报告的 entry count 与 `artifact.entries.length` 一致，不再复制固定版本和数字。

### C1.2 Minimal edits（完成）

1. 修正 `THIRD_PARTY_NOTICES.md`：明确四个 `runtime/upstream/*` 文件都是 pinned v3.8.2 的逐字 pristine copy，
   compatibility/security boundary 位于 repository-owned wrappers，而不是 upstream overlay。
2. 同步 notice integrity hash，并让 manifest → bundle raw SHA → package projection 的既有校验链继续通过；bundle
   inventory/schema 本 gate 不改。
3. 删除 `repository-boundary.test.js` 中只搜索其他测试标题的
   `retired prototype conclusions remain covered by production safety tests` case；目标行为测试及 DESIGN exact
   test-module mapping 全部保留。
4. 收缩 `architecture-contracts.test.js` / `repository-boundary.test.js` 的 prose locks：保留 explicit anchors、文档
   唯一入口、exact inventories、forbidden zones、Release exclusion、版本角色窗口和 source-level call-order；删除
   仅锁定中文同义词或段落先后、且已有直接行为证据的 regex。
5. 将 `release-package.test.js` 改为从 `package.json` 和 `release-artifact-v1.json` 发现当前 candidate；同步移除
   repository governance 中不属于 sealed acceptance 的固定 entry 数量。精确已发布 entry count 仍由版本 acceptance
   与 publication oracle 保存。
6. 在 Phase 3.8 摘要末尾新增独立 `Subsequent landing` 尾注，并最小更新 history index：保留原文“当时只关闭
   Discovery、尚未实施”，另行说明 bundle-authority migration 后续已由 v0.3.4 落地，不重写 cold history。

### C1.3 Candidate and Release rotation（完成）

1. 按所选 candidate 同步 package、Release contract、版本 acceptance 与外部 bootstrap identity；不把版本号硬编码
   回稳定架构文档或通用测试。
2. 重新计算 notice/manifest/ZIP 传播链中的真实 hash；先冻结全部 ZIP 输入，双构建一致后再把精确 ZIP SHA 写入
   外部 bootstrap。封板后任何 ZIP 输入变化都重新开始 seal。
3. 依次执行 Source/Candidate Cloud、Published Release、重新下载双资产与 pointer-only promotion/postflight；远端
   tag/Release/Latest 动作全部由维护者执行，智能体只准备本地 commit/命令并做只读核验。

### C1.4 Exit criteria

- notice 与当前 pristine 事实一致；无 overlay/patcher 代码、合同或文案复活。
- 目标静态断言数量下降，但 runtime/supply-chain/installer/Release 行为测试和 exact negative guards 不弱化。
- 通用 candidate 测试不含固定 v0.3.4 或固定 ZIP entry count；版本 acceptance 仍保存精确 sealed identity。
- source、candidate ZIP、installed snapshot、doctor/repair、Fresh/Resume、公开双资产与 rollback 全部通过各自 gate。
- C1 以独立本地 commit 序列和正式 acceptance 闭合；未夹带 contract-v2 fields 或 Phase 4 source。

## Gate C2 — Contract/Release-v2 Discovery

### C2.0 Scope and evidence

1. 从 accepted C1 tree 重新扫描 importer、installer、builder、contracts、tests、upgrade/rollback 与 Cloud consumer；
   不沿用本审计的行号、测试数量或 hash。
2. 为每个字段建立 `producer -> validators -> production consumers -> tests -> installed/Release lifecycle` 表；无
   consumer 不直接等于可删，先判断它是 security declaration、integrity edge 还是纯文档 metadata。

### C2.1 Decisions to freeze

- **Bundle v2：**首选移除 `managed_sha256 == pristine_sha256` 与空 `overlay_ids`，让 `pristine_sha256` 成为 upstream
  package/install hash；exact-key 保留为通用 unknown-field validation。`origin` 继续复核：比较显式 trust label 与
  `upstream_files` structural partition，不再以保留 no-overlay sentinel 为默认方向。
- **Manifest：**首选删除无 consumer 的 `skill_version` 并补顶层 exact-key validation；`required_skill_files`、bundle
  path/SHA、archive/license provenance 保留。manifest/bundle upstream provenance 交叉核验是否继续存在，必须作为
  integrity-edge 决策单列，不能冒充 inventory 去重。
- **Release contract v2：**首选给每个 entry 增加 `mode`，builder 只严格消费 entry mode，删除第二份
  `EXECUTABLE_PATHS`。unknown/missing/invalid mode 必须在写 ZIP 前 fail closed。
- **其他 metadata：**对 `contract_id`、entry `origin/state`、external `reason`、`checksum_workflow`、bundle
  `language/host_dependencies` 逐项选择 `STRICTLY_CONSUME`、`MOVE_TO_DOCS` 或 `RETAIN_WITH_OWNER`；禁止继续保留
  “JSON 里有、生产 consumer 不认、只有 prose test 锁字面”的状态。
- **Schema install asymmetry：**installed plan schemas 与 source-only catch-up schemas 不在 C2 删除或补装；只记录
  consumer 事实，交给 Phase 4 Discovery 统一决定。

### C2.2 Compatibility and exit criteria

1. 冻结 schema/version migration、旧 package/installed manifest 的 upgrade/rollback 语义，以及 accepted +
   immediate-fallback installer 双向接管测试；doctor 不得把版本升级误报成普通 repair。
2. 先设计 failing-first guards：unknown top-level/entry key、bundle raw SHA tamper、invalid/missing ZIP
   mode、builder secondary authority 回流、metadata 无 consumer 等都应在 acquire/write 之前失败。
3. 输出专项设计、字段 decision table、精确文件影响图、hash/identity rotation、Linux/Cloud/Release 验证矩阵与回滚
   方案，并给出 `GO / CONDITIONAL_GO / NO_GO`。同时冻结 implementation placement：Phase-4-neutral 子集是独立兼容
   transaction，还是 `0.4.0-*` 列车中先于行为激活的 inactive foundation gate；Discovery 结束即停，只有维护者
   另行授权才创建 implementation gate。

### C2.3 Preliminary route decision（待复核）

- 总裁决：`CONDITIONAL_GO`。bundle v2 + manifest schema 4 + Release artifact v2 在技术上可以组成
  phase-neutral、inactive、单次原子 transaction；它不需要改变 runtime bytes、Host ABI、trusted graph、
  dispatch、legacy 默认或 installed inventory。
- placement 首选：完成 Phase 4 Discovery 后，把该 transaction 作为 `0.4.0-alpha.*` 列车中先于行为激活的
  独立 foundation gate。这样只轮转一次 successor identity，同时仍以独立 commit、tests、Cloud marker 和
  rollback gate 保持可审查性。
- 当前 `NO_GO`：不再发布只含 machine-contract normalization 的稳定 `0.3.x` patch；不在 Phase 4 Discovery
  前删除 `language`、`host_dependencies`、installed schemas 或 source-only catch-up schemas；不把 C2 设计
  解释为实现授权。
- 条件：Phase 4 Discovery 必须确认 attestation/nonce/v3 mode 不需要改变本 C2 的 entry semantics，确认保留字段
  owner 与 schema asymmetry 决策，并冻结 successor identity/branch/gates。若发现 shape 冲突，则回到 Discovery
  修订 v2，而不是先实施再二次旋转。
- 此前 C2 closure 只提交 planning 证据；本次 reopened review 仅同步本地分支/C2 lifecycle 到 ROADMAP，仍不创建
  package candidate，不修改 machine contract，不运行 publication 或 Cloud 写操作。

### C2.4 Tombstone review（讨论中）

- 不把“overlay 退役提交曾有意保留 tombstone”直接推导为“v2 必须长期保留 overlay 专用防线”。历史动机只能
  解释 v1，不能自动取得 v2 owner。
- 待冻结的区分：通用 exact-key validation 保护 machine schema 不被未知字段静默扩展；
  单一 `pristine_sha256`、受限 source roots 与 import byte equality 保护当前正向供应链事实；
  ARCHITECTURE/Discovery gate 管理未来是否重新选择 overlay。三者不应再由空 `overlay_ids` 或双 hash 重复表达。
- 重点判断专用 overlay negative test 是否应退休为通用 unknown-key test，而不是继续冻结历史字段名和“永不复活”
  叙事。当前无 implementation 授权。
- 同步复核固定 `origin=upstream_pristine` 是否有独立 owner；若 v2 用明确 `upstream_files` 分区和路径/hash 约束
  完整表达来源，origin 常量也可能属于重复 machine metadata。该取舍尚未冻结。
- 本轮讨论成果已提升为回顾性维护者里程碑
  `docs/history/phase-3.9.2-contract-v2-tombstone-review.md`；它保存认识修正，不替代当前 C2 Next Step 或授权。

## Post-cleanup next task hint — Phase 4 Discovery

C1 已完成 accepted closure且 C2 Discovery 闭合后，下一任务才是新建 Phase 4 Discovery。C2 implementation 不预设为
Phase 4 Discovery 的前置发布；两轮 Discovery 必须先区分 Phase-4-neutral contract cleanup 与 Phase-4-coupled ABI/source：

- 评估 attestation、nonce 与 opt-in v3 modes；
- legacy 默认行为必须保持不变；
- 统一决定 installed plan schemas 与 source-only catch-up schemas 的策略；
- 重新执行 tamper/cache/rollback、Fresh/Resume 与真实 Cloud gate。

这只是后续任务提示，不是当前 gate、实现步骤、`0.4.0-*` identity 或 Phase 4 授权。

## Stop Conditions

- C1 需要改变 runtime dispatch/inventory、trusted graph、Host ABI、machine-contract schema 或 managed-legacy output。
- C1 发现“清理”会弱化 direct behavior、supply-chain tamper、ownership、rollback 或 publication oracle。
- C1 无法在不夹带 C2 字段旋转的情况下更新 notice/hash/version/Release，或用户改动与目标文件重叠。
- C2 发现 schema/Host ABI/trusted graph、upgrade/rollback 或 Release mode 方案存在未解决分歧；停在 Discovery，
  不用实现代码替维护者做架构决定。
- 无法从当前代码和 immutable history 区分历史理由与未来 Phase 4 需求。
- 任何动作将触及 Phase 4 source、远端状态或已发布 sealed 字节。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 三个 PowerShell 只读盘点通过嵌套 `Promise.all` 聚合时整体返回 exit 1，未保留分项输出 | 1 | 不重复聚合方式；改为顺序运行文件清单、引用图和测试规模查询 |
| Windows 上向 `rg` 直接传 `tests/*.test.js`，glob 未由 shell 展开并触发 os error 123 | 1 | 改用目录参数 `tests` 配合 `-g '*.test.js'`；其余 DESIGN/source 索引输出有效 |
| 首次 `git show` 把 commit 参数放在 `-- paths` 之后，实际显示了 HEAD 而非 `60c9b11` | 1 | 改用 `git show 60c9b11 -- <paths>`；成功恢复 overlay retirement 的准确 bundle diff |
| schema runtime-load 搜索没有匹配，导致包含前两段成功 git log 的聚合命令最终 exit 1 | 1 | 将“无 schema runtime load”作为有效负向证据；后续历史查询单独执行并成功 |
| PowerShell 双引号中的 `rg` alternation 含 JSON 引号，转义后形成未闭合正则 | 1 | 不重复复杂转义；改用单引号 pattern，成功取得全部 contract/builder 命中 |
| 受限 sandbox 不允许创建 `.git/index.lock`，planning-only 自动提交未开始暂存 | 1 | 工作树内容未受损；按权限规则在沙箱外重跑精确 `git add` / `git commit` |
| 首次 resumed-route `rg` 把 PowerShell 双引号与 `\"mode\"` 组合成未闭合 regex；同一命令的 ROADMAP 查询成功 | 1 | 改用 PowerShell 单引号包围 pattern，完整恢复 notice/contract/builder/test consumer 图 |
| Phase 4 预埋搜索把 `contracts/*.schema.json` 作为 Windows literal path 传给 `rg`，其余文件证据已输出但命令 exit 1 | 1 | 改用 `contracts -g '*.schema.json'`，成功恢复四份 exact-v1 schema 的 event/profile/unknown-key 边界 |
| 受限 Windows sandbox 中 Git Bash 无法创建 signal pipe（Win32 error 5），同一 PowerShell 批次被后续成功命令掩盖 | 1 | 单独在非受限只读上下文重跑两个 bootstrap 的 `bash -n`，均通过；记录为 platform limitation |
| 多文件 `apply_patch` 因 task plan 中文 Next Step hunk 上下文未精确匹配而整体拒绝 | 3 | 每次均未发生部分写入；拆成单文件最小 hunk 后成功，并在 `git diff --check` 中复核 |
| C1.2 修改 Release 输入后，package test 仍绑定 sealed v0.3.4 hash | 1 | 识别为预期 unsealed identity transition；不改写 v0.3.4，原子轮转到 v0.3.5-dev zero-hash candidate |
| 首次 v0.3.5-dev focused/full run 暴露 manifest Release-contract SHA、ROADMAP prose locks 与 bootstrap sealed-only 假设 | 3 | 同步真实 contract SHA；删除被动态角色解析覆盖的 prose locks；bootstrap 测试按 candidate/accepted 关系验证 zero/sealed checksum，focused 与完整 suite 全绿 |
| 预封板审计误用了不存在的 `tools/build_release_artifact.py` | 1 | 回读 README 与实际工具入口，改用 `tools/build_release.py build/check`；随后开发候选和 stable 双构建均通过 |
| 组合只读查询引用了不存在的 `docs/v0.3.4-release-acceptance.md`，使 `rg` 最终 exit 1 | 1 | 从 repository role-window 测试确认真实文件为 `docs/v0.3.4-cloud-hard-acceptance.md`；后续只读取动态 candidate acceptance 与现存路径 |
| planning 更新后的 focused `node --test` 在受限 Windows sandbox 创建 test-runner 子进程时返回 `spawn EPERM` | 3 | 均在非受限测试上下文原命令复跑通过；本次 architecture/repository focused suite 15/15 PASS，分类为 sandbox platform limitation |
| `gh release view v0.3.5` 与 latest 查询通过本机代理 `127.0.0.1:3080` 连接 GitHub API 时被拒绝 | 1 | `git ls-remote` 已成功确认 branch/tag exact source；Release/Latest metadata 改用独立只读 Web 通道，不重复失效代理路径 |
| 公共 Web open/search 未返回目标 Release，搜索只命中无关公开仓库 | 1 | 目标仓库未被公共索引时 Web 结果不具否定力；保留已认证 GitHub CLI，仅在单次只读命令中清除失效 proxy 环境重试 |
| 本地 `show-ref refs/tags/v0.3.5` 失败：维护者已创建远端 tag，但本地 refs 尚未 fetch | 1 | 远端 tag source 已由 `ls-remote` 证明；在不触碰工作树的前提下精确 fetch 单个 tag，供 publication oracle 使用 |
| fetch 后未给 PowerShell 中的 `v0.3.5^{commit}` revision expression 加引号，`git rev-parse` 报 `Needed a single revision` | 1 | 用单引号包住 revision expression 复核成功；本地 v0.3.5 tag 精确解析为 sealed HEAD |

### C2 Discovery error log

- 一次并行 `rg` 批次因至少一个无匹配查询返回 exit 1，聚合脚本未保留其他成功输出。处理：不把无匹配
  当作产品失败；拆分查询并显式回传各命令 exit/output，不重复同一聚合方式。
- 一次带多重 negative glob 的影响面 `rg -l` 意外返回无匹配，未据此作结论。后续改用已知目录的
  `rg -l -e ...` 与 `git grep` 交叉恢复文件列表。
- 一次 test-title 查询误写了不存在的 `tests/publication-oracle.test.js`；有效文件是复数形式
  `tests/published-release-oracles.test.js`。其他文件输出有效，后续矩阵使用正确文件名。
