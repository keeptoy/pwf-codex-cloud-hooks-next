# Progress: Manifest/Bundle Inventory Authority Discovery

## 2026-08-10

- 按 README → ARCHITECTURE → DESIGN → ROADMAP → active planning 顺序恢复上下文，工作树起点干净，当前分支
  为 `0.3.4-dev`、HEAD `07bc83c`。
- 维护者授权独立探路 manifest/bundle inventory 去重；建立本 Discovery scope，旧 completed scopes 保留。
- 冻结只读边界：不修改 production、contracts、Release 或 Phase 4 行为；开始 D0 历史恢复。
- 历史确认双 inventory 在 `033a82b` 同时诞生：bundle 服务 importer 的 source contract，manifest schema v3
  服务 installer 的 installed-file assembly，并由 manifest hash 锚定 bundle；这是一开始的分层镜像，不是后来偶然复制。
- 当前重复范围已量化：manifest upstream 7 字段/local 5 字段均为 bundle 对应条目的严格子集；D0 继续核对
  后续演化节点和原始设计文档。
- 原始 Phase 1 文档和 contract test 证实 bundle 才被定义为 machine source of truth；manifest 数组是为 installer
  复制的最小投影视图，测试以逐字段相等阻止漂移。
- local files、installed contracts、successor baseline 和 overlay retirement 的历史均延续双写，没有发现两份
  inventory 被允许独立变化的证据。D0 PASS，开始 D1 consumer map。
- 当前 consumer map 确认 importer 只读 bundle，installer/install/doctor/repair 只读 manifest inventory；builder
  使用独立 Release artifact inventory，installed manifest 保存派生安装快照。
- 发现核心 trust 要求：installer 迁往 bundle 前必须先用 manifest 中的固定 path/SHA 校验 bundle 原始字节，
  不能直接加载 bundle 并信任其自报的 runtime hash。D1 继续检查测试覆盖和兼容/回滚影响。
- installer/architecture/bootstrap tests 已审计：现有 drift/repair 行为可复用，但缺 bundle tamper/schema/path 的
  installer failing-first cases；architecture 中的双存在性断言需要迁移。一次 `rg` 因 pattern 以 `--bundle`
  开头被误解析为 flag，已记录并改用 `-e`。
- importer CLI/fixtures 确认只接受 bundle；默认 check 的 manifest hash edge 目前依赖外部 contract test。D1 consumer
  map 已闭合：去重只迁移 source/install authority，installed snapshot 与 Release entry inventory 必须保留。
- D1 PASS，开始 D2 三路线比较。
- 完成 manifest authority、bundle authority、generated mirror 比较；另建第三 inventory contract 也因 join/hash
  复杂度被排除。推荐 bundle authority，manifest 收敛为 provenance + integrity index。
- 冻结初步字段归属：bundle 独占六个 runtimes + 两个 installed contracts；installer envelope 的 adapter/notice、
  installed-state snapshot 与 Release entry inventory 保持独立。D2 PASS，开始 D3 gate 设计。
- 冻结 I0 failing-first、I1 verified consumers、I2 atomic mirror removal、I3 local/Linux supply-chain verification；
  另列 Source/Candidate Cloud 与后续独立 Release gate。
- 冻结 failure matrix 和 rollback：所有 bundle drift 在写入前 fail closed；installed set 必须不变；v0.3.3 →
  v0.3.4 install replacement 与 v0.3.3 rollback 必须端到端证明。
- D3 PASS；结论为 `CONDITIONAL_GO_BUNDLE_AUTHORITY / IMPLEMENTATION_NOT_AUTHORIZED / PHASE4_NOT_AUTHORIZED`。
- Discovery 仅修改 active pointer 与本 scope 三份 planning 记录；repository-boundary focused suite 9/9 PASS，
  未修改 production、machine contracts、Release inputs 或 runtime bytes。
- 维护者授权将已闭合 Discovery 编入历史：新增 Phase 3.7 contract-metadata cleanup 与 Phase 3.8 inventory-authority
  decision interlude，并在 history 索引登记；Phase 3.8 明确不代表方案已经实施。
- history/repository focused suite 17/17 PASS；`git diff --check` PASS。D4 PASS，production、contracts、Release
  bytes 与 Phase 4 仍未修改。
- 按维护者要求将 Phase 3.7 改为大白话时间线：用“施工进度表误留在装箱清单”解释字段角色，补全 Phase 1
  contract-only 背景、测试消费原因、production 真实激活链、successor 原样继承和不自动退休的闭环。
- 历史审计纠正一处时间线：`033a82b` 建立 deferred/earliest guard；owned catch-up/plan 的 Phase 2/3 断言随
  各自 runtime 后续加入。focused suite 沙箱内 `spawn EPERM`，沙箱外 17/17 PASS；diff/whitespace PASS，D5 PASS。
- 维护者接受推荐路线并只授权 I0；工作树起点为 clean `0.3.4-dev`/`3839c01`。task plan 明确 I1～I3 与
  production/contracts/Release/Phase 4 仍未授权。
- 新增 manifest schema/mirror 终态 guard、importer manifest→bundle raw SHA guard、installer 14 项 bundle
  tamper/invalid guard、三个 Phase 4 source negative guard，以及 ref-aware v0.3.3 invalid-upgrade/valid-roundtrip guards。
- 四个测试文件 Node syntax 与 `git diff --check` PASS。首次 focused failing-first：既有 contract/import/runtime/
  installer/publication cases 和正常 v0.3.3 往返通过；新 manifest、importer、14 项 installer 与 invalid-upgrade
  guards 按预期失败，分别命中 I2 mirrors、I1 manifest CLI/hash edge 和 installer 未消费 bundle。
- 补强 unsafe manifest bundle reference、unsafe installed path、duplicate package path 与跨分区 duplicate id 后，
  installer 复验仍为 14 项全部精准红、既有 12 项 PASS、Windows-only 1 项诚实 SKIP。I0 闭合并停在 I1 授权前。
- 最终 repository/architecture 治理复验 17/17 PASS；四个修改测试文件 syntax、diff/whitespace 检查均 PASS，
  工作树只包含 planning 与 tests，没有 production、machine contract、runtime、Release 或文档 authority 改动。
- 维护者在 I0 闭合后授权 I1；实现 importer/installer 共用的 manifest→bundle raw SHA 信任边，并让两者在解析、
  inventory 消费及任何安装写入前严格拒绝 missing/tampered/invalid bundle。
- importer 新增 manifest loader 与全 bundle validator；installer 的 `sourceRuntimeFiles()` 改由 bundle 的两类 runtime
  和 installed contracts 派生。新增正向证明：即使 manifest mirrors 被破坏/删除，安装仍从已验证 bundle 得到精确 inventory。
- 同步 `upstream-manifest.json` 中 importer integrity hash；未改 bundle bytes、runtime files、Release allowlist、
  bootstrap、nested manifest schema 或 mirrors。
- 静态/自检通过：`node --check install.js`、Python compile、`python tools/import_upstream_runtime.py check`、
  `git diff --check`。
- I1 focused 回归 47 PASS/1 Windows SKIP；全量排除唯一 I2 终态 contract 的 suite 为 110 PASS/12 Windows SKIP；
  contract/architecture 为 9 PASS/1 expected FAIL，唯一红灯逐项列出 schema 1、四个 inventory mirrors 和两个
  installed-contract mirrors。v0.3.3 bad-upgrade fail-closed 与 valid candidate→v0.3.3 rollback 均通过。
- I1 闭合并停止；I2/I3、Phase 4、commit/push、Cloud、seal/publication 均未进入。
- 维护者在 I1 闭合并明确停在 I2 前后要求继续；授权 I2 atomic mirror removal，I3/Phase 4/Release/Cloud/push
  继续保持未授权。
- 将 `managed_runtime` 升至 schema 2，删除 `package_root/local_package_root/local_files/files` 与两个已由 bundle
  独占的 installed-contract projections；manifest 从 4,974 bytes 缩至 1,982 bytes。
- importer/installer 同步严格验证 schema 2 的 exact nested fields，并拒绝旧 mirror 回流；runtime bundle 原始 SHA、
  runtime/installed inventory、Release allowlist、Host ABI、production dispatch 与 upstream Git modes 均未改变。
- 同步 contracts/architecture/importer/installer tests，以及 README、ARCHITECTURE、DESIGN、AGENTS、CHANGELOG、
  ROADMAP 的稳定 authority 表述；importer integrity hash 更新为当前源码字节。
- I2 focused 最终 53 PASS/1 Windows SKIP；完整 `npm test` 为 114 PASS/12 Windows SKIP；v0.3.3 bad-upgrade
  fail-closed、valid candidate→immutable v0.3.3 rollback、deterministic candidate ZIP 与 Phase 4 exact negative guard 均通过。
- JSON/Node/Python syntax、importer check、`git diff --check` 全绿；I2 闭合并停止，Linux/Cloud I3 尚未执行。
- 维护者明确授权继续 I3；活动计划同步为 local/Linux/Source-Candidate Cloud 验证，继续禁止 Phase 4、Release、
  publication 与 push。
- I3 Windows focused 为 61 PASS/1 Linux-only SKIP，完整 suite 为 114 PASS/12 POSIX/Linux SKIP、0 FAIL；首次
  沙箱内 runner 因 `spawn EPERM` 未执行断言，获准在沙箱外重跑后通过。
- importer、Node/Python/JSON/Bash syntax、manifest integrity hashes、四项 exact `100755` 与 LF 全部通过；一次
  Bash loop 引号错误和一次 PowerShell generic method parse error 均在未执行目标动作前修正并成功重跑。
- 两次 deterministic ZIP 逐字一致：21 entries、77,782 bytes、SHA-256 `87bff3eddb8c8f6431ddfd55f707e6ba02c31cf8c2d9fc822709b3967d10de09`；
  bootstrap ZIP 外边界及 extracted builder/importer self-check PASS。
- Linux 探针确认 WSL distribution 与 container runtime 均不存在；Git Bash 只能做语法检查。远端复核确认
  `origin/main=0377453` 不含 `59395e7`，且没有 `origin/0.3.4-dev`；因 push 未授权、Cloud environment ID 未取得，
  Linux/Source-Candidate Cloud 保持 PENDING，I3 不闭合。
- 维护者授权 push 并由其自行执行 Cloud 黑盒；首次 push 的自动审批复核超时、命令未执行，按工具指引只重试
  一次后成功创建远端 `0.3.4-dev`，exact head 为 `59395e7`。当前未提交 planning/acceptance evidence 未混入候选。
- 审计 template 与 v0.3.3 acceptance：确认 B-SC/C/D/E1/E2 行为提示词无需改变；v0.3.3 的旧 source 脚本仍读取
  已退休 `manifest.managed_runtime.files`，不能复用。模板 9.1 原有 installed snapshot→disk 自洽检查还不足以
  单独证明 bundle authority。
- 为 template 增加稳定英文 anchors 与显式 `PWF_ACCEPTANCE_NODE_MAJOR` 输入；4.1 新增 schema-2 exact manifest、
  raw bundle SHA、retired mirror 与 Phase 4 negative admission 断言，9.1 新增 bundle-derived inventory、installed
  snapshot、disk actual 三方相等。v0.3.4-dev 改为薄执行入口，只维护分支输入、架构 delta、模板步骤链接与原始
  证据回传清单，不复制稳定提示词或预填动态 status/hash/test count。
- 模板嵌入 Python 共三段 syntax PASS，authority block 在当前树执行输出 `MANIFEST_BUNDLE_AUTHORITY=PASS`；
  bundle-derived installed inventory 为 exact 10 payload。四段嵌入 Bash 经 stdin `bash -n -s` 全部 syntax PASS。
- architecture/repository focused governance 17/17 PASS，stable cross-document anchors、dev zero-hash/无 sealed
  identity、current acceptance lifecycle 与 Phase 4 boundary 均保持；`git diff --check` PASS。黑盒交付就绪，
  I3 等待维护者真实 Cloud 输出，不预填通过状态。
- 黑盒 template、v0.3.4-dev 薄入口与 planning evidence 已作为纯 docs/planning commit `e54f459` 推送到远端
  `0.3.4-dev`；该提交不含 Release allowlist 输入或 production bytes，`59395e7` implementation 仍在其祖先链中。
- 按维护者要求补充 Phase 3.8 设计复盘：明确原双视图在首版局部目标下并非荒唐，真正遗漏的是 projection 的
  派生身份、consumer 端 SHA 信任链、唯一 authority 不变量和 retirement gate；后续严格 equality 维护既避免
  drift，也把过渡结构固化为长期双写。历史新增六条可复用教训，不改变 I3 Cloud PENDING、Release 或 Phase 4。
- 设计复盘的 architecture/repository focused governance 在受限 Windows sandbox 中因 `spawn EPERM` 未进入断言；
  获准沙箱外重跑后 17/17 PASS，`git diff --check` PASS。
- 继续按维护者要求把两点翻成可执行治理：用“楼建好后仍要拆脚手架”解释 retirement DoD，并新增六层落地表，
  明确 ROADMAP/task plan 管收尾 gate，Architecture/Design 管唯一权威与 consumer route，contracts/loaders/tests
  负责拒绝旧 mirror 和生产旁路；仍只修改历史/planning，不改变当前 I3 或产品字节。
- 本轮补充后的 architecture/repository focused governance 17/17 PASS，`git diff --check` PASS。
- 按维护者要求补全 Phase 3.7 复盘：用“搬家便签不应永久留在正式物品清单”解释 programme metadata 的局部
  合理性与长期错位，补充五项设计遗漏、六条经验和 ROADMAP/contract/consumer/tests/history 分层落地；只改
  cold history/planning，不改变 current runtime、I3、Release 或 Phase 4。
- Phase 3.7 复盘补充后的 architecture/repository focused governance 17/17 PASS，`git diff --check` PASS。
