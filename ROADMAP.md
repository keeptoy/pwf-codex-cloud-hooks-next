# 路线图

本文件是后续 Product Phase、版本列车、Cloud 验收、Release 晋级和 rollback 状态的唯一宏观权威。
精确 Next Step、当前授权、禁止事项和停止条件仍由活动 `task_plan.md` 决定。README 只描述稳定行为，
不复制逐 gate 状态。

> 当前生产回滚基线：published/accepted stable `v0.3.0`；beta.2 保持不可变 previous fallback。
>
> 当前稳定身份：published/accepted `v0.3.0`；exact source `1454c922...` 已通过 S0～S3 全部门槛。
>
> 当前状态：M1～M4 与 stable v0.3.0 Release 已关闭。Product Phase 4 之前另行授权的
> `0.3.1 security-fix train` 正在进行；S1 与 S2 Linux/Cloud hard acceptance 已完成，当前停止在
> S3-A immutable seal 授权门前。seal、tag、publication 与 rollback promotion 尚未授权。

## 1. 与活动 planning 的分工

| 问题 | 权威文件 |
|---|---|
| 产品将经过哪些 Phase、每个版本列车要证明什么 | `ROADMAP.md` |
| 哪些 Phase、Cloud gate 或 Release 已经完成 | `ROADMAP.md` |
| 当前允许做什么、唯一 Next Step 是什么 | 活动 `.planning/<slug>/task_plan.md` |
| 当前 gate 的不变量、退出条件和停止条件 | 活动 `task_plan.md` |
| 研究结论、路线比较和技术取舍 | 活动 `findings.md`；稳定后提升到架构或专项文档 |
| 实施、测试、错误和恢复记录 | 活动 `progress.md` |
| 可复制的 Release/运维操作 | [`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md) 与版本专项 runbook |
| 稳定支持行为和用户命令 | [`README.md`](README.md) |

两层计划互补而不互相复制：ROADMAP 回答“去哪里、何时验收、何时能发布”；活动 task plan 回答
“现在做什么、按什么合同做、做到哪里必须停”。两者若在当前 gate 或 Next Step 上冲突，以活动
task plan 为准，并在 Phase、Cloud、Release 或 rollback 状态变化时同步本文件。

## 2. 当前基线与仓库角色

| 项目 | 当前事实 |
|---|---|
| 源码维护权威 | successor `main` |
| 已发布生产回滚 | successor `v0.3.0`；beta.2 为不可变 previous fallback |
| 当前稳定身份 | published/accepted `v0.3.0`；source `1454c922...` |
| 当前 programme gate | `0.3.1 security-fix train` S2 PASS；等待 S3-A seal 授权；Product Phase 4 未授权 |
| 当前 Release | stable `v0.3.0` 已完成 Cloud A～F 并晋级 rollback |
| 当前候选源码 | `0.3.1`；bootstrap zero hash，未封板、未发布 |
| 长期支持范围 | 只正式支持 `OthmanAdi/planning-with-files v3.8.2` |

beta.2 的精确 source、资产、SHA 和回滚入口见
[`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) 与
[`docs/v0.3.0-beta.2-cloud-hard-acceptance.md`](docs/v0.3.0-beta.2-cloud-hard-acceptance.md)。

## 3. 已完成的仓库迁移

M1～M4 只建立独立 successor 的来源、历史、Cloud 等价性和源码权威，没有发布 beta.3、写入 live
`/opt/codex`、改变 production behavior 或授权 Product Phase 4。

| Gate | 冻结结果 | 状态 |
|---|---|---|
| M1 exact mirror | `audit/beta2-exact@bbad3703...` 保留 beta.2 commit/tree/资产 oracle | complete |
| M2 slim transformation | parentless slim root、稳定文档边界、repository-wide LF、四个 `100755` runtime | complete |
| M3 Cloud equivalence | tested `39795283...`；Linux/Fresh/Resume/doctor/ZIP 等价性 PASS | complete |
| M4 repository cutover | accepted `main@0b4bd7d4...`；default/main/ruleset、handoff 与 beta.2 rollback PASS | complete |

详细、可重放的历史门槛只保留在：

- [`docs/beta3-dev-m3-cloud-equivalence.md`](docs/beta3-dev-m3-cloud-equivalence.md)；
- [`docs/beta3-dev-m4-cutover-plan.md`](docs/beta3-dev-m4-cutover-plan.md)；
- 活动 planning 的 findings/progress 历史。

后续治理提交不会把新的 `main` HEAD 冒充为旧 M3/M4 accepted input，也不会移动冻结 evidence refs。

## 4. Product Phase 路线与候选版本列车

Phase 是研发/验收边界；版本号是对外行为与兼容合同边界。下表是 Discovery 的默认候选，不是发布
承诺，也不自动授权下一 Phase。一个 Phase 可以有多个 pre-release；多个低风险 Phase 也可以在明确
评审后合并进同一版本列车。

Product Phase 4 之前已完成独立 stable v0.3.0 里程碑。随后发现的兼容安全问题由单独授权的
`0.3.1 security-fix train` 处理，不新增 Hook、Host ABI 或 trusted graph。它分为本地实现/身份收口、
完整本地与 Linux/no-live Cloud 验证、最终 seal/release decision；精确 Next Step 与授权边界由活动
`2026-08-06-v0.3.1-security-fix-discovery` task plan 管理。

| Phase | 候选版本列车 | 候选范围 | 最低退出/Cloud 门槛 | 状态 |
|---|---|---|---|---|
| 4 | `0.4.0-*` | attestation、nonce 与 opt-in v3 modes | legacy 默认不变；tamper/cache/rollback 与 Fresh/Resume | pending Discovery authorization |
| 5 | `0.5.0-*` | compaction lifecycle | 先观测 `clear`/`compact` Host schema；无重复或丢失 context | pending |
| 6 | `0.6.0-*` | selective tool/permission hooks | 逐事件测量 latency/token/噪声；先 advisory、后扩展 | pending |
| 7 | `0.7.0-*` | advisory completion | bounded、non-recursive、无 plan 时安静 | pending |
| 8 | `0.8.0-*` | optional hard gating | 明确 Stop contract、上限、逃生路径、rollback 与隔离 Cloud | pending |
| 9 | 当前列车的 `rc.N` → stable | 完整矩阵、最终字节、canary retirement、正式发布 | RC 与最终资产分别验收；重新下载双资产；可逆 | pending |

Phase 9 是 Release 收口，不机械等于 `0.9.0`。例如只完成 Phase 4 时，它可以封板 `0.4.0`；如果多个
Phase 经独立 gate 后被明确合并，则封板当时获批的同一版本列车。

## 5. 版本号与晋级语义

项目在 `0.x` 阶段仍主动维持 legacy 默认兼容；SemVer 允许的变化范围不能替代显式 Host ABI、
trusted graph、rollback 和 Cloud 评审。

| 身份 | 含义 |
|---|---|
| `0.x.y-dev` | checkout/source identity；不是 tag 或 Release，bootstrap 必须 fail closed |
| `0.x.0-alpha.N` | contract、inactive implementation 或有限 Cloud 探针；不得宣称 production ready |
| `0.x.0-beta.N` | 目标行为已受控激活，正在完成完整 Cloud、upgrade 与 rollback 验收 |
| `0.x.0-rc.N` | feature/contract/asset boundary 冻结；只接受 Release blocker 修复 |
| `0.x.0` | 最终 ZIP/bootstrap 字节发布并重新下载验收，建立新的 rollback 候选 |
| `0.x.y`（`y>0`） | 同一 minor 行为合同内的兼容修复；不新增 Hook、Host ABI 或 trusted graph |

新增 Hook 类型、Host ABI、信任/激活模型或明显用户行为面，默认提升 minor；纯兼容修复才使用 patch。
任何字节变化都必须使用新身份和新 hash，不得复用 beta.2 或其他已发布资产。

`v0.3.0` 已完成独立 S0～S3 gate 并成为 rollback；当前 0.3.1 只修复同一 minor 行为合同内的问题。
0.3.1 的源码身份、bootstrap、ZIP、Cloud、seal 和 Release 必须继续按活动 task plan 分 gate 授权；
该安全修复列车不授权 Product Phase 4，也不允许重写任何 v0.3.0 或 beta.2 身份与资产。

## 6. Discovery 与 gate 晋级模型

每个新 Product Phase 的第一轮必须是 Discovery：恢复当前 upstream/Host/Cloud 事实，比较路线与代价，
冻结不变量、失败矩阵、轮次、测试、Cloud/rollback 计划，并给出 `GO`、`CONDITIONAL_GO` 或 `NO_GO`。

标准晋级链为：

```text
Discovery
  -> inactive implementation / exact contracts
  -> local + Linux regression
  -> no-live Cloud acceptance
  -> explicit opt-in / canary activation
  -> Fresh + UserPrompt + real Resume + doctor
  -> Release candidate seal
  -> immutable publication
  -> downloaded-asset revalidation
  -> rollback-baseline promotion
```

每个箭头都是独立 gate；前一 gate PASS 不自动授权后一 gate。出现以下情况必须暂停并增加探路轮或
Round 内子 gate：

- Cloud 与本地证据冲突；
- schema、Host ABI、trusted graph、安全或 rollback 变化；
- timeout、进程组、权限、identity 或数据安全模型变化；
- 两条路线代价显著不同，继续实现可能“代码正确但方向错误”。

## 7. Release 授权与封板顺序

只有 ROADMAP 把目标版本标为获批 Release candidate，且活动 task plan 明确授权具体 Release gate，
才允许封板。可复制命令和完整运维检查由
[`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md) 与相应版本 runbook 管理。

固定字节顺序：

1. 冻结目标 version、source、contracts、tests 和 ZIP 精确 allowlist；
2. build/check ZIP，并用独立双构建证明确定性；
3. 计算最终 ZIP SHA-256；
4. 把版本、包名和 ZIP SHA 写入 ZIP 外部 bootstrap；
5. 计算封板后 bootstrap SHA-256；
6. 创建新的 immutable tag/pre-release 或 Release，上传两个独立资产；
7. 从 Release 页面重新下载两个资产并核对 filename、size、SHA 和 ZIP boundary；
8. 在全新 Cloud 完成 install、Fresh/UserPrompt、real Resume、doctor 与 rollback 冒烟；
9. 冻结 acceptance 证据，才可把该版本提升为新的 rollback baseline。

RC/canary 通过不能替代最终字节验收。ZIP 或 bootstrap 任一字节重建，都必须产生新身份、新 hash 和
新的 downloaded-asset/Fresh Cloud 证据。bootstrap 永远是 ZIP 外部资产，禁止 moving branch、
`latest` 或无 checksum URL。

## 8. 回滚与基线提升

stable `v0.3.0` 已完成第 7 节全部门槛并成为当前 production rollback。successor `main` 继续作为
源码维护权威；beta.2 作为不可变 previous fallback，M3/M4 evidence refs 仍只证明迁移/等价性。

未来版本仍只有在 immutable publication、重新下载、Fresh/Resume/doctor 和 rollback 验证全部通过后，
才能在本文件中取代 v0.3.0。旧资产、tag、SHA 和 acceptance 记录不得重写。

## 9. 长期泛化边界

当前唯一正式集成仍是 PWF v3.8.2。第二个只读插件尚未证明 Host/runner/Driver 抽象，因此不得把项目
描述为通用 Skill 转换器，也不预先为泛化能力分配版本号。只有独立 Discovery 和第二实现证据完成后，
才能决定抽象是否进入新的 Product Phase 或 `1.0.0` 稳定合同。
