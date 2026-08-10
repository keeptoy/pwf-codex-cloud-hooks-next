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
