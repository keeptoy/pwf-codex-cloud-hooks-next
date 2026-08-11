# Progress: Current-tree Cleanup Audit

## 2026-08-11

- 恢复 planning-with-files session、根级文档权威与已完成 v0.3.4 promotion 计划。
- 确认进入审计前工作树干净，建立独立 discovery-only cleanup audit；尚未修改任何 production、contract
  或测试文件。
- 完成首轮文件与引用清单：确认 Phase metadata 已退出 machine contract，manifest/bundle authority 已分工；
  `ledger-summary.sh` 仍横跨 pristine upstream、bundle、ZIP 与 installed inventory，不能按孤儿文件处理。
- 完成模块规模与 DESIGN 验证路由盘点；锁定三个静态治理测试为断言必要性审计重点，未发现并行 production
  dispatch 或 patcher/overlay 代码复活。
- 恢复 ledger 条件调用与 private snapshot 数据流：确认当前不可达是受 managed-legacy snapshot 保证，而非
  文件无依赖；开始复核 machine schema 安装边界和 manifest/bundle 剩余 provenance 交叉核验。
- 完成 architecture/repository 静态测试首轮逐项阅读；已区分结构/供应链断言与锁死中文文案或 test title 的
  元测试，后者形成下一兼容版本的低风险精简候选。
- 完成历史/debt marker 扫描，发现 installed notice 的 overlay 陈述已过期，并识别 bundle 中
  `managed_sha256`/empty `overlay_ids` 等 overlay-era contract tombstone；继续评估其变更风险与优先级。
- 回读 Phase 3.6 与 retirement commit，确认 tombstone 的历史形成；完成 manifest 字段 consumer 和文档入口
  扫描，发现无 consumer 的 `skill_version`，未发现孤立文档或明显未调用 production 函数。
- 追溯 installed plan schemas 与 notice 历史；确认 schema 安装无 runtime loader、notice 是遗漏更新。审计 Release
  contract/builder 后发现 mode 第二 authority 与多项未消费 metadata，列入独立 contract-v2 候选。
- 复核 planning 生命周期：旧 scope 不会由 `.active_plan` 自动删除，当前 5 个 completed scope 可由维护者在后续
  lifecycle rotation 中按节奏清退；它们不进入 Release/trusted graph，因此不是本轮紧急风险。
- 完成 D2 建议矩阵初稿：明确 `ledger-summary.sh` 与高价值安全断言保留；notice/history/test-title/prose locks
  属于下一兼容树精简；bundle/manifest/release schema 债务必须拆成独立 contract + Release gate；installed schema
  策略留给 Phase 4 Discovery。
- 完整本地回归通过：`npm test` 为 126 tests / 114 pass / 0 fail / 12 Windows POSIX SKIP；importer check healthy，
  `git diff --check` 通过。审计结论已冻结，未修改 production、contracts、tests 或 Release 输入。
- 首次 planning-only 自动提交因 sandbox 拒绝创建 `.git/index.lock` 而未暂存任何文件；按仓库纪律保留现场，
  改为在沙箱外对四个精确 planning 路径提交，不扩大范围。
- 维护者在 Phase 3.9.1 架构里程碑完成后重新激活本 scope，授权把既有审计结论细化成三段 gate 路线；本轮只
  更新 planning，不实施兼容清理、contract/Release v2 或 Phase 4。
- 回读 Phase 3.9.1 与低风险候选的精确源码位置，确认 notice 属于 Release 输入、标题元测试没有行为语义、
  prose regex 必须以结构/禁区断言替代而非机械删除，candidate package 测试可从 package/artifact 动态派生身份。
- 恢复 notice/hash、bundle tombstone、manifest metadata、Release mode 与测试 consumer 图；确认兼容清理和
  contract-v2 必须拆开，Phase 4 仍处于 ROADMAP 的 Discovery authorization 之前。
- 完成 R0 路线冻结：C1 细化为 admission、failing-first、最小编辑、candidate/Release rotation 与 exit criteria；
  C2 细化为字段 consumer map、四组 architecture decision 和 compatibility/Discovery exit；Phase 4 仅留 next-task hint。
- `.planning/.active_plan` 已切回本 scope；focused repository-boundary tests 在沙箱外通过 9/9，证明 active pointer、
  planning 三件套与历史/Release 排除边界仍成立。未修改任何清理目标文件。
- 开始复核 C1/C2 对 Phase 4～9 的前向影响；当前 active pointer 正确，维护者已有的旧 planning deletions 仍保持
  未暂存且不进入本次分析记录提交。
- 回读当前 plan 与 ROADMAP Phase 4～9/gate 模型：确认 C1 只旋转未来 baseline identity；C2 Discovery 应在 Phase 4
  前完成，但 contract-v2 implementation 不能与 Phase 4 behavior activation 混成一个 transaction。
- 复核 upstream injector、owned snapshot、exact schemas、Managed events、bundle dependency 与 Phase 4 denied sources：
  当前确有“保留 upstream 闭包 + 预留 typed seams”，但没有隐藏激活路径；Phase 4 仍需显式 ABI/source/trust gate。
- 完成 Phase 5～9 前向映射并识别一项路线修正：C2 Discovery 必须先于 Phase 4，但 C2 implementation 不应被预设为
  Phase 4 Discovery 的前置发布；两轮 Discovery 应共同决定独立兼容 transaction 或 0.4.0 inactive foundation。
- 已把 sequencing refinement 写回 task plan；focused repository-boundary tests 再次在沙箱外通过 9/9。最终结论是
  当前方案总体前向兼容，但必须保持“保留 upstream 闭包、可复用 seam、未准入 feature”三层区分。
- 维护者授权进入 C1 并选择 `0.3.5-dev`；已确认本地不存在同名分支，现有 dirty state 只有维护者声明的旧 planning
  deletions，开始 C1.0 branch admission 与修改前基线。
- 已创建并切换本地 `0.3.5-dev`；回读 README 与 ARCHITECTURE，确认 C1 patch/version/Release/trusted-graph 边界，
  维护者旧 planning deletions 在分支切换中保持原样。
- 回读 DESIGN 与 ROADMAP，确认 C1 的模块/验证落点和 `0.3.5` patch identity 语义；未扩大到 Phase 4、contract-v2
  或远端 Release 动作。
- 按根级顺序完整恢复活动 task plan、findings、progress；C1.0 权威恢复完成，开始运行修改前 importer、suite、
  syntax、ZIP 与 diff 基线。
- C1.0 修改前基线闭合：importer healthy；完整 suite 126/114/0/12；Python/Node syntax、`git diff --check`、
  四文件 `100755` mode 与 Bash syntax 通过。Bash 在受限 Windows sandbox 的 signal-pipe 启动失败已在非受限只读
  上下文复跑通过，归类为 platform limitation。
- deterministic ZIP build/check 均 healthy（21 exact entries，SHA-256
  `497e92a861bd7882129f05b28df1e23a55330db98bebe76891db5b9761bdec3b`）；临时资产已删除。C1.0 无 product
  failure，下一步进入 C1.1 failing-first guards 与断言分类。
- 一次组合 `apply_patch` 因 task plan hunk 上下文未精确匹配而整体未应用；拆成最小 hunk 后成功，未造成部分写入
  或内容损失。
- 本地提交 `98792cd`（`docs: open v0.3.5 compatible cleanup`）只包含活动 planning 三件套；维护者已有五组旧
  planning deletions 未被暂存。
- C1.1 notice guard 已加入合同边界；修改正文前的 focused run 按预期 1/2 失败，失败内容正是旧 notice 的 overlay
  声明和缺失 pristine/wrapper 事实。动态 Release 与 repository boundary focused run 10/10 通过。
- 已删除仅检查其他测试标题的元测试和通用固定 entry count；`release-package.test.js` 改从 package/artifact 派生
  candidate、bootstrap 与 entry count，并区分 zero-hash unpublished candidate 和 sealed accepted identity。
- 已冻结 `KEEP_STRUCTURAL / REPLACE_WITH_STRUCTURAL / DELETE_DUPLICATE` 分类表。两次只读盘点命令分别因
  PowerShell 嵌套 range 类型和 Windows 不展开 `tests/*.test.js` glob 失败；均改用逐文件行号/目录级 `rg` 完成，
  未产生文件修改。另一次组合 planning patch 因 Next Step 上下文匹配失败而整体未应用，拆成最小 hunk 后成功。
  C1.1 闭合，进入 C1.2 最小编辑。
- C1.2 已修正 notice 并同步 SHA-256 `10415e608418192d20d0e7095cfb4d77339850576043f65e796e695699424703`；
  importer check healthy。Phase 3.8 摘要增加独立 subsequent-landing 尾注，索引保留“当时未实施”的时间语义。
- 按分类表删除标题元测试与 prose/order locks，保留 stable anchors、exact inventory、forbidden zones、role windows、
  Release exclusion 和 source call-order。focused run 18/19：合同/架构/仓库边界全绿，唯一失败是已改 ZIP 输入仍搭配
  sealed v0.3.4 bootstrap hash（旧 `497e...`，新构建 `fff589...`）。分类为预期 unsealed identity transition，证明
  已发布 v0.3.4 不可改写；C1.2 不单独提交红色中间态，立即进入 C1.3 原子 candidate rotation。
- 已建立 `v0.3.5-dev` local identity：package、Release contract、ROADMAP/CHANGELOG、candidate acceptance 与新
  bootstrap 一致；v0.3.4 accepted 文件保留。新 bootstrap 只从 accepted 版本复制并改默认 version/zero hash，两个
  bootstrap 的 `bash -n` 均通过。
- 身份轮转首轮 focused run 先暴露 Release contract SHA 未同步和两条剩余 ROADMAP prose locks；同步 manifest SHA、
  删除由动态角色解析覆盖的措辞锁后，focused architecture/contracts/repository/Release 19/19 通过。
- 完整 suite 首轮 111 pass/1 fail/12 skip，唯一失败是 `bootstrap.test.js` 仍假设当前 bootstrap 必然 sealed；改为
  从 ROADMAP 解析 accepted role，并要求 unpublished candidate 默认 zero/fail-closed、accepted 默认 nonzero 后，
  bootstrap focused 4/4、完整 suite 124 tests / 112 pass / 0 fail / 12 honest Windows skips。
- 最终 importer healthy；Python compile、Node syntax、accepted/candidate Bash syntax、四个 upstream `100755` mode
  与 `git diff --check` 通过。candidate ZIP 双构建/check 均为 21 entries、77,807 bytes、SHA-256
  `d5687d4318a34dd514a5e203d71bd3918e6ef758ab49bde894de1b9c2b867b5f`，临时资产已删除；该开发 hash 未写入
  zero-hash bootstrap。
- C1 本地 source-candidate 已准备完成；按授权停在 Source/Candidate Cloud 之前，不执行 push/tag/Release/Latest，
  不进入 C2 或 Phase 4。
- 本地提交 `cb59ad7`（`chore: prepare v0.3.5 compatible candidate`）只包含 15 个 C1 source-candidate 文件；
  活动 planning 证据另行提交，维护者已有 15 个旧 planning tracked deletions 继续未暂存。
- 维护者已推送本地提交并回传：Cloud 仓库代码构建/测试通过，`v0.3.5-dev` 已发布，ZIP 下载与安装验收通过；
  明确授权直接收敛 `v0.3.5` stable identity、执行本地 seal 和 commit，后续 push 仍由维护者执行。
- 恢复时确认 `HEAD`/`origin/0.3.5-dev` 均为 `4ee0ac1`；该提交只纳入先前 15 个旧 planning scope 删除，没有
  修改 Release 输入。session catch-up 同时发现 Cloud 合成 fixture 与 `.active_plan` 冲突标记；已用精确 patch
  恢复 active pointer 并删除三份临时 fixture，未触碰产品或验收资产。
- 在 stable 轮转前重新构建/check `v0.3.5-dev` candidate，结果与 Cloud 前记录完全一致：21 entries、77,807
  bytes、SHA-256 `d5687d4318a34dd514a5e203d71bd3918e6ef758ab49bde894de1b9c2b867b5f`；临时 ZIP 已删除。
- 已把 package、Release contract、外部 bootstrap、CHANGELOG、ROADMAP 与版本 acceptance 原子收敛为 `v0.3.5`；
  同步 manifest 中 Release-contract SHA。bootstrap 测试改按 `-dev`/stable identity 验证 zero/sealed checksum，覆盖
  “stable candidate 已封板但尚未 accepted”的真实中间态。
- stable ZIP 两次独立 build/check 完全一致：21 entries、77,800 bytes、SHA-256
  `7d351cfe0eaa60e93bc279645ed3f480dc9e83efdff1c6abf13c14d84c286f0b`。写入外部 bootstrap 后 post-pin 复建仍为
  同一摘要；bootstrap 为 21,565 bytes、SHA-256
  `33d7fcaca56c617ef70e33c9708af804a8737d587cc58571382b945e5bff58a5`。
- 封板全量 suite 通过：124 tests / 112 pass / 0 fail / 12 honest Windows skips；importer、Python/Node syntax、
  v0.3.4/v0.3.5 Bash syntax、四文件 `100755` mode、deterministic ZIP post-pin 与 `git diff --check` 全部通过。
- planning 收口后的 repository boundary focused run 在受限 sandbox 因 Node test-runner `spawn EPERM` 未启动；
  非受限上下文原命令复跑 8/8 通过，确认为平台限制而非测试或产品失败。
- 已创建本地 product seal commit `5be9b787d96e1a0927f437f24ebae5b06c7835b4`
  （`release: seal v0.3.5 candidate`），只包含 9 个稳定身份/验收/测试文件；未 push。
- commit 后再次 build/check：ZIP 仍为 21 entries、77,800 bytes、SHA-256
  `7d351cfe0eaa60e93bc279645ed3f480dc9e83efdff1c6abf13c14d84c286f0b`，bootstrap SHA-256 仍为
  `33d7fcaca56c617ef70e33c9708af804a8737d587cc58571382b945e5bff58a5`；`.planning` 外工作树无差异。
- C1 本地 stable seal 已完成；按授权停止在 push/publication 前，不执行远端动作，不进入 C2 或 Phase 4。
- 维护者回传已 push `HEAD=5d01b55890c1da2a5088e2b991b152a9fb1c3f87`，Cloud Source/Candidate setup
  与 Post-Resume 全部通过：Linux 118/118、0 fail、0 skip；ZIP 21 entries、77,800 bytes、SHA-256
  `7d351cfe0eaa60e93bc279645ed3f480dc9e83efdff1c6abf13c14d84c286f0b`；doctor healthy/managed，installed
  runtime 10 项、upstream pristine 4 项、bundle inventory authoritative、policy adapter-only、snapshot leftovers 0。
- 维护者同时确认 GitHub 已发布，公开 ZIP 下载与安装测试通过。该回传先作为待只读核验的 C1 external evidence
  记录；尚未据此宣称 Latest/pointer promotion，后续先核验远端 tag/source/双资产 identity 与 lifecycle 角色。
- 只读 `git ls-remote` 已确认 `origin/0.3.5-dev` 与 tag `v0.3.5` 均指向 exact sealed HEAD
  `5d01b55890c1da2a5088e2b991b152a9fb1c3f87`。同一批次的 `gh release view` 因本机代理
  `127.0.0.1:3080` 拒绝连接而未取得 Release/Latest metadata；转用独立只读 Web 通道，不重复同一失败路径。
- 公共 Web 通道未能读取/索引目标 Release，只返回无关公开搜索结果；不据此判定目标 Release 缺失。下一步用
  已认证 `gh` 在单次命令内清除失效 proxy 环境后只读查询，仍不执行任何远端写。
- 清除失效 proxy 后只读 API 核验成功：`v0.3.5` Release 非 draft、非 prerelease，Latest 指向同一 tag；ZIP 与
  bootstrap 的远端 filename/size/digest 精确匹配本地 seal。
- 已从 immutable Release URL 下载双资产到受控临时目录：ZIP 77,800 bytes / `7d351cfe…6f0b`，bootstrap
  21,565 bytes / `33d7fcac…58a5`；ZIP 内自带 builder/contract check 为 21 entries、healthy，bootstrap Bash
  syntax 通过，临时目录随后安全删除。C1 远端 postflight PASS，开始同步正式 acceptance/provenance/ROADMAP。
- publication oracle 预检发现本地尚无 `refs/tags/v0.3.5`，但 `origin/0.3.5-dev` 已在 exact sealed HEAD；下一步
  只 fetch 远端单个 `v0.3.5` tag，不移动 branch、不覆盖用户文件。
- 已 fetch `v0.3.5` tag；Git 的 reachable-tag auto-follow 同时取得远端 `v0.3.5-dev` tag。加引号复核后，
  `v0.3.5^{commit}=5d01b55890c1da2a5088e2b991b152a9fb1c3f87`；工作树只保留活动 planning 变更。
- 已同步 v0.3.5 exact dual-channel acceptance、published provenance、CHANGELOG 与 ROADMAP 角色：v0.3.5
  accepted/Latest，v0.3.4 immediate fallback，v0.3.3 deeper fallback。按单一 candidate+accepted role window 删除
  current-tree 的 v0.3.4 bootstrap/acceptance；历史证据改由 immutable source URL/provenance 恢复。
- C1 closure focused repository/publication/Release 16/16 通过；完整 suite 为 124 tests / 112 pass / 0 fail /
  12 honest Windows skips。角色轮转只改 governance/acceptance/provenance 文件，不改变 ZIP/sealed runtime bytes。
- 已创建本地 C1 closure commit `e8ee0518ea52361f995b28ff01fa53614264d9ee`
  （`docs: accept v0.3.5 release baseline`）；工作树干净，未 push。C1 完成，开始 C2.0 read-only consumer inventory。
- C2.0 首轮读取 manifest、runtime bundle、Release artifact、importer、installer 与 builder。已确认 bundle tombstone
  是双 consumer schema/投影，manifest `skill_version` 无 consumer但顶层也不 exact，Release mode 由 builder
  `EXECUTABLE_PATHS` 独占且 contract 无 mode；详细 producer/consumer 分类已写入 findings，尚未修改任何 contract/code。
## 2026-08-11 C2 Discovery：消费链与历史证据

- 只读检查 `runtime-bundle-v1`、`upstream-manifest`、`release-artifact-v1` 的 producer、validators、
  production consumers、tests 与 installed-state 生命周期。
- 确认 bundle 的 `managed_sha256` 当前参与 importer/install 投影与 drift 检查，不能当作普通无 consumer
  字段直接删除；`overlay_ids` 是 exact empty tombstone。
- 确认 manifest `skill_version` 无 consumer，且 top-level 尚无 exact-key validation。
- 确认 Release mode 仍由 builder `EXECUTABLE_PATHS` 提供；contract 中多项 metadata 没有 production
  owner，其中 `checksum_workflow` 仅被测试固定。
- 确认 installed manifest 嵌入完整 UPSTREAM，contract 旋转必须验证跨版本 takeover/rollback。
- C2 仍为 Discovery-only；未修改 machine contract、production、Release identity 或 Phase 4 source。
- 复核 overlay 退役提交 `60c9b11` 与 inventory authority 提交 `59395e7`：当前 tombstone 是有意的
  fail-closed 迁移结果；未来 v2 可以改写安全断言，但不能丢掉拒绝 overlay 复活的行为。
- 对照 Phase 3.8/3.9.1 冻结 C2 与 Phase 4 的边界：只研究 phase-neutral normalization；后续可能作为
  `0.4.0-alpha.*` 未激活 foundation gate，但最终落位要等 Phase 4 Discovery 联合裁决。
- 建立字段级初步裁决表：bundle 删除双 hash/空 overlay tombstone但保留 v2 反复活 guard；manifest
  删除 `skill_version` 并补顶层 exact schema；Release v2 以 entry mode 取代 builder 第二 authority，
  把纯说明 metadata 迁出 machine JSON；Phase-4-coupled metadata 延迟。
- 冻结建议 schema 形状：bundle v2、manifest schema 4、Release artifact v2 必须同一原子 transaction；
  v1 文件不静默变义，builder build/check 共用 contract mode，旧 key/path 在写入前 fail closed。
- 冻结兼容/rollback 与验证矩阵：新旧 package 各读自己的 schema，published oracle 从各 source manifest
  动态发现 contract path，future gate 必须验证 v0.3.5 与 candidate 双向 takeover、pre-write tamper、
  deterministic ZIP、Linux/Cloud Fresh/Resume 和独立 Release closure。
- C2 Discovery 结论为 `CONDITIONAL_GO`：首选 Phase 4 Discovery 后放入 `0.4.0-alpha.*` 的独立 inactive
  foundation gate；不建议再发纯 normalization 的稳定 0.3.x patch。当前停在 planning-only closure。
- C2 closure validation：`git diff --check` PASS；repository-boundary focused test 在受限 Windows sandbox
  首次因 `spawn EPERM` 未启动，在已授权非受限上下文原命令重跑 8/8 PASS。未运行 production/Release/Cloud
  gate，因为本轮仅修改 `.planning` 且明确无 implementation 权限。
