# 路线图

本文件是后续 Product Phase、版本列车、Cloud 验收、Release 晋级和 rollback 状态的唯一宏观权威。
已经发生的版本变化见 [`CHANGELOG.md`](CHANGELOG.md)，不可变来源与资产见
[`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)。精确 Next Step、当前授权、禁止事项和停止条件仍由
活动 `task_plan.md` 决定。

## 1. 文档分层与活动 planning

面向所有读者的“问题 → 唯一权威”导航见
[`README.md` 的“开发状态与文档地图”](README.md#documentation-map)。本文件只回答 programme 将去哪里、
当前版本角色是什么，以及 Phase/版本列车要证明什么；不维护逐次实现流水账或证据表。

ROADMAP 与活动 planning 互补：ROADMAP 管宏观路线和 lifecycle，`.planning/.active_plan` 指向的活动
`task_plan.md` 管当前唯一 Next Step、授权、禁止事项和停止条件。两者若在当前 gate 上冲突，以活动
task plan 为准；只有 programme、Cloud、Release 或 rollback 状态真正变化时才同步本文件。

## 2. 当前基线与仓库角色

本节是当前 lifecycle 角色的唯一完整陈述；其他宏观文档只链接这里。

| 项目 | 当前事实 |
|---|---|
| 源码维护权威 | successor `main` |
| 当前开发列车 | `0.3.2-dev`；文档治理与自解释入口收口，不改变 runtime、Host ABI 或 trusted graph |
| 当前已接受版本 | `v0.3.1`；production rollback 与 GitHub `Latest` |
| 回退证据链 | immutable `v0.3.0` → immutable `v0.3.0-beta.2` oracle |
| 当前 programme 边界 | Product Phase 4 未授权 |
| 长期支持范围 | 只正式支持 `OthmanAdi/planning-with-files v3.8.2` |

`v0.3.1` tag 中的 README 和资产仍是 sealed 历史输入；当前 main 属于后续 development source，不反向
改写已发布版本。版本 delta 见 [`CHANGELOG.md`](CHANGELOG.md)，精确 source/资产/SHA 见
[`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，最终验收见
[`docs/v0.3.1-cloud-hard-acceptance.md`](docs/v0.3.1-cloud-hard-acceptance.md)。

## 3. 已完成的仓库迁移

M1～M4 建立了独立 successor 的来源、历史、Cloud 等价性和源码权威，没有发布 beta.3、写入 live
`/opt/codex`、改变 production behavior 或授权 Product Phase 4。

| Gate | 冻结结果 | 状态 |
|---|---|---|
| M1 exact mirror | beta.2 commit/tree/资产 oracle 的 exact mirror | complete |
| M2 slim transformation | parentless slim root、稳定文档边界、repository-wide LF、固定 executable runtime | complete |
| M3 Cloud equivalence | Linux/Fresh/Resume/doctor/ZIP 等价性 | complete |
| M4 repository cutover | default/main/ruleset、旧仓库导航与 rollback | complete |

不可变 refs 和可重放证据只由 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) 索引；M3/M4 完整
runbook 已退出当前树，并通过其中的 exact-commit links 恢复。后续 main 提交不能冒充这些旧 gate 的
accepted input。

## 4. 当前开发列车与 Product Phase 路线

`0.3.2-dev` 的宏观目标是完成文档真理源治理：稳定行为、架构理由、实现导航、实际版本变化、programme
路线、当前行动和不可变证据分别只有一个主维护位置。该列车当前只改变 development 文档与治理检查，
不授权 seal、publication、Cloud acceptance、行为变化或 Product Phase 4。

该列车的仓库生命周期治理保持一个 active planning，并以 candidate + accepted role window 控制当前
bootstrap/acceptance；更早历史退出 HEAD 后由 immutable commit、tag 和 Release 恢复。trusted/Release
zones 继续 exact，docs/planning zones 按 lifecycle policy 验证。

下表是未来 Discovery 的候选，不是发布承诺，也不自动授权下一 Phase。一个 Phase 可以有多个
pre-release；多个低风险 Phase 也只有在独立评审后才能进入同一版本列车。

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
任何字节变化都必须使用新身份和新 hash，不得复用已发布资产。

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
才允许封板。稳定构建/验证命令由 [`README.md`](README.md) 管理，精确版本步骤和资产证据由相应版本
acceptance 管理；[`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md) 只提供维护者接手和结果分流入口。

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

当前角色只在第 2 节维护。未来版本只有在 immutable publication、重新下载、Fresh/Resume/doctor 和
rollback 验证全部通过后，才能更新该表并成为新的基线。旧资产、tag、SHA、acceptance 和迁移 evidence
refs 不得重写；pointer-only promotion 也不能反向修改 sealed ZIP 输入。

## 9. 长期泛化边界

当前唯一正式集成仍是 PWF v3.8.2。第二个只读插件尚未证明 Host/runner/Driver 抽象，因此不得把项目
描述为通用 Skill 转换器，也不预先为泛化能力分配版本号。只有独立 Discovery 和第二实现证据完成后，
才能决定抽象是否进入新的 Product Phase 或 `1.0.0` 稳定合同。
