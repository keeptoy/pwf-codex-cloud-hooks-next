# Task Plan: Manifest/Bundle Inventory Authority Discovery

## Goal

追溯 `upstream-manifest.json` 与 `contracts/runtime-bundle-v1.json` 重复 runtime inventory 的形成历史，明确
importer、installer、Release 与 tests 的实际消费关系，比较去重路线并冻结一个不触碰 Phase 4 行为的供应链
authority 迁移设计。

## Authorization

- 维护者授权先回顾历史并开展独立探路，分析如何解决 manifest/bundle inventory 重叠。
- 本轮只允许只读历史/代码/contract/test 审计，以及记录 Discovery 结论和后续实施计划。
- 维护者补充授权把已闭合的重叠根因、路线比较与方案选择整理为 Phase 3.8 历史 interlude，并补录
  Phase 3.7 的 programme metadata 退休原因；历史文字不得冒充 inventory 去重已经实施。
- 维护者要求继续把 Phase 3.7 改成大白话，补全“字段原用途 → 测试为何读取 → production 为何不读 →
  为何长期残留 → 安全意图由谁接替”的因果链。
- 维护者接受 bundle authority 推荐路线，并授权第一轮 I0 failing-first guards：允许只修改最近边界测试与
  planning，预先冻结 manifest→bundle integrity、严格 bundle validation、Phase 4 负向准入和 v0.3.3
  升级/回滚要求。
- 维护者在 I0 闭合后授权继续 I1：允许修改 importer、installer、配套测试，以及同步 importer integrity hash；
  两个 consumer 必须先验证 manifest→bundle 原始 SHA，再严格解析并消费 bundle。
- 维护者在 I1 闭合并明确停在 I2 前后要求“继续”，据此授权 I2 atomic mirror removal：允许把 nested
  `managed_runtime` 升到 schema 2、删除已由 bundle 独占的 mirrors，并同步 consumer、tests、integrity hash、
  稳定 authority 文档和 Unreleased changelog。
- 维护者在 I2 闭合后明确要求“继续 I3”，据此授权执行本地/Linux 供应链回归与 Source/Candidate Cloud
  验证，并允许同步本 scope 的 planning 与候选 acceptance 证据。
- I3 只验证当前 zero-hash Source/Candidate；仍不授权 runtime、Release allowlist、production dispatch、seal、
  publication、push、正式部署或 Phase 4 激活。
- 维护者随后明确授权由智能体 push，并要求以 `cloud-hard-acceptance-template.md` 为主要权威、以 v0.3.3
  acceptance 为已执行样例，整理 v0.3.4-dev 的维护者黑盒协议；维护者自行执行 Cloud 黑盒。
- 该授权允许把 exact implementation commit `59395e7` 推为远端 `0.3.4-dev`，以及修改 planning/版本专项
  acceptance；不授权把未提交 evidence 混入 candidate、执行 Cloud 黑盒、seal、publication 或 Phase 4。
- 维护者追加授权把“原双视图为何短期合理、长期为何变成重复 authority、遗漏了哪些闭环约束以及经验教训”
  内化到 Phase 3.8 历史；该纯历史复盘不改变 I3 Cloud Next Step 或任何 Release/Phase 4 授权。
- 维护者进一步要求用大白话解释 retirement DoD 与字段级约束，并把 ROADMAP/task plan、Architecture、Design、
  machine contracts、production consumers 和 tests 的分层落地方式补入同一 Phase 3.8 复盘。
- 维护者授权以相同深度补全 Phase 3.7 的设计复盘：说明 programme 标签在迁移期为何合理、放入长期 runtime
  contract 遗漏了什么、测试为何固化旧路线，以及 programme/runtime 分层和 retirement 的落地教训。
- 维护者提供 Phase 1 overlay、Phase 2 owned wrapper、Phase 3 private snapshot 的因果快照，并授权补全 Phase 3.6
  复盘：必须区分 catch-up 与 plan invocation domain，解释“行为退休、供应链仍存活”，并总结全链路 retirement。

## Invariants

- v0.3.4-dev zero-hash 开发身份、v0.3.3 accepted 与 v0.3.2 fallback 角色不变。
- 四个 pristine upstream runtime、两个 owned runtime、installed inventory、Host ABI、trusted graph 与行为不变。
- 去重后的设计必须只有一个 runtime inventory machine authority，同时保留完整 integrity chain、unknown-drift
  fail-closed、self-contained importer、deterministic ZIP 与 installed-manifest 可审计性。
- Phase 4 的 attestation/nonce/opt-in v3 modes 以及 `ledger-summary.sh` 可达性不进入本轮设计。

## Gates

- [x] D0 — History：定位两份 inventory 的首次引入、演化和当时职责。
- [x] D1 — Consumer map：冻结 importer、installer、builder、doctor/repair 与 tests 的字段级读取/写入关系。
- [x] D2 — Options：比较 manifest authority、bundle authority、generated view 三条路线及迁移风险。
- [x] D3 — Decision：给出 GO/CONDITIONAL_GO/NO_GO、最小实施批次、failing-first guards、验证与回滚方案。
- [x] D4 — History promotion：补录 Phase 3.7，并将本次已闭合 Discovery 冻结为 Phase 3.8 决策 interlude。
- [x] D5 — Phase 3.7 clarification：用可读时间线补足 staged-admission ledger 的产生、消费和退休原因。
- [x] I0 — Failing-first guards：先写并执行供应链完整性、非法 bundle、Phase 4 负向准入及跨版本往返测试；
  预期只因尚未实施 I1/I2 而红，不得修改 production 使其变绿。
- [x] I1 — Verified bundle consumers：实现 manifest→bundle raw SHA、严格 bundle validator 与 importer/installer
  单一 inventory consumption；保持 manifest schema 1/mirrors 供 I2 原子删除。
- [x] I2 — Atomic mirror removal：nested schema 2、mirror 删除、consumer/tests/docs/hash 同步并完成本地回归。
- [ ] I3 — Local/Linux/Cloud verification：Windows local PASS；远端 transport 与维护者黑盒入口已就绪，等待
  维护者在 Fresh Linux Source/Candidate Cloud 执行并回传原始证据。

## Next Step

维护者按 `docs/v0.3.4-dev-cloud-hard-acceptance.md` 在 Fresh/Reset-cache Linux Cloud 执行 Source/Candidate
setup、B-SC、C、D、E1/E2 与 9.1，并原样回传输出。收到证据前 I3 保持未闭合；不得把本地或文档自检冒充
Linux/Cloud，也不提前进入 Phase 4、seal 或 publication。

## Decision

`I3_LOCAL_PASS / REMOTE_TRANSPORT_READY / MAINTAINER_CLOUD_EXECUTION_PENDING / PHASE4_RELEASE_NOT_AUTHORIZED`

进入实施的条件：

1. 维护者接受 bundle 为唯一 source/install runtime inventory authority；
2. 同意 manifest nested `managed_runtime` 升到 schema v2，并移除重复 arrays/package roots/installed-contract projections；
3. 先落 failing-first bundle integrity/unsafe inventory/upgrade-rollback guards，再改 consumer；
4. runtime 文件集合、installed layout、Host ABI、production dispatch 与 Phase 4 行为保持逐项相同。

## Stop Conditions

- 证据显示去重必须改变 installed layout、runtime dependency graph、Host ABI 或 Phase 4 行为。
- 当前两份 inventory 并非等价重复，而是分别承担不可合并的信任根职责。
- 历史 ref/consumer 无法确定，或路线选择需要维护者先决定兼容/升级支持窗口。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| `rg` pattern 以 `--bundle` 开头，被解析为未知 flag | 1 | 后续使用 `rg -e` 显式传入 pattern，不重复原命令 |
| Phase 3.7 focused tests 在受限 Windows sandbox 中因 `spawn EPERM` 未执行断言 | 1 | 在获准的沙箱外重跑同一只读命令，17/17 PASS |
| 尝试读取不存在的 `tests/helpers/published-release.js` | 1 | 确认 publication helpers 全部内联在 `published-release-oracles.test.js`，直接复用并扩展该文件 |
| I0 focused suite 返回非零 | 1 | 属于授权目标：新 guards 精确命中 I1/I2 尚未实现的缺口；既有测试与正常 v0.3.3 往返继续通过 |
| I1 Node 回归在受限 Windows sandbox 中因 `spawn EPERM` 未执行断言 | 1 | 在获准的沙箱外重跑同一命令；focused 47 PASS/1 SKIP，全量非 I2 suite 110 PASS/12 SKIP |
| I2 旧字段扫描把多个含括号 pattern 拼成一个 `rg` 正则，触发 `unopened group` | 1 | 改用多个 `rg -e` 固定 pattern 分别扫描，不重复原命令；manifest JSON 解析本身已通过 |
| I2 固定 pattern 扫描中的 Python 双引号被 PowerShell 拆成路径参数 | 2 | 移除该脆弱 pattern，分别扫描 `schema_version` 与已退休字段；已有命中仅为 schema-2/负向测试 |
| I2 focused 中 unsafe bundle reference 的产品拒绝正确，但 importer 错误标签从 `runtime bundle` 漂成 `runtime_bundle` | 1 | 分类为诊断文本回归；contract ref validator 使用人类可读 label，保留既有 domain error 合同后重跑 |
| I3 focused suite 在受限 Windows sandbox 中全部因 `spawn EPERM` 未执行断言 | 1 | 获准在沙箱外重跑；61 PASS/1 Linux-only SKIP/0 FAIL |
| 首次 Git Bash syntax loop 的 PowerShell→Bash 引号传递不完整 | 1 | 改由 PowerShell 枚举文件并逐项调用 `bash -n`；两个 bootstrap PASS |
| 首次双 ZIP probe 使用 PowerShell 不支持的 generic method 调用语法 | 1 | 解析阶段即停止、未创建 probe；改用 Base64 严格字节比较后双构建与 self-check PASS |
| 当前 Windows 主机没有 WSL distribution 或 container runtime | 1 | 分类为 platform limitation；Linux gate 保持 PENDING，不以 Git Bash/Windows SKIP 替代 |
| exact I2 candidate 只存在本地，Cloud task list 未提供 environment ID | 1 | 未越权 push 或伪造环境；记录远端 ref 证据并等待 branch transport/Cloud environment 授权输入 |
| I3 acceptance 更新后 repository authority guard 仍要求明确写出 Cloud hard acceptance 尚未开始 | 1 | 结论语义未冲突；在当前状态段补回该明确短语，保留 local PASS 与 Cloud PENDING 的分层 |
| 第二次治理复验发现 dev acceptance 还要求 zero-hash 语句不可换行，且不得冻结 64 位 commit/ZIP identity | 1 | 恢复单行 fail-closed 短语；acceptance 只留短 commit 与 planning 链接语义，exact 临时 hash 只保存在活动 evidence |
| exact candidate push 的首次自动审批复核超时 | 1 | 工具确认命令未执行并允许重试一次；第二次成功创建远端 `0.3.4-dev` at `59395e7` |
| 执行嵌入 Python authority block 时，PowerShell→`python -c` 传参剥离内部引号 | 1 | 语法已通过 stdin compile；执行改用 `python -` 从 stdin 读取原文，authority assertion PASS |
| 模板 Bash block 首次用 `bash -c` 接收 PowerShell 多行参数时引号损坏 | 1 | 改用 stdin `bash -n -s` 解析原始 block；四段 Bash 全部 syntax PASS |
| Phase 3.8 设计复盘的 focused Node tests 在受限 Windows sandbox 中因 `spawn EPERM` 未执行断言 | 1 | 在获准的沙箱外重跑同一只读命令，17/17 PASS |
