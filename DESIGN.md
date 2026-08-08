# 仓库实现设计

本文件面向需要定位实现、评估改动落点或继续阅读源码的维护者。它回答“系统设计落在哪些仓库模块，
这些模块在 source、build、install 和 runtime 层分别承担什么职责”。

它不解释系统为什么采用这些信任边界，不维护当前版本/Release/rollback 状态，也不替代源码、machine
contract 或测试中的字段级行为。

## 1. 文档定位

| 问题 | 权威文档 |
|---|---|
| 为什么需要适配层，跨组件数据流、trusted graph 和失败语义 | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| 实现位于哪里，模块之间怎样对应，改动应从哪里开始 | 本 DESIGN |
| 稳定用户行为、安装、doctor/repair、测试和打包命令 | [`README.md`](README.md) |
| 当前 programme、版本列车与 Release/rollback 状态 | [`ROADMAP.md`](ROADMAP.md) |
| 当前唯一 Next Step 与授权边界 | `.planning/.active_plan` 指向的活动 `task_plan.md` |

DESIGN 只提供实现层导航。函数、schema 字段、hash、allowlist 和测试结果必须回到相邻源码、contracts
与 tests；带时间的验收事实必须回到对应专项文档。

## 2. 仓库地图

| 路径 | 实现职责 |
|---|---|
| [`install.js`](install.js) | Managed install/doctor/repair/uninstall |
| [`hooks/hook_adapter.py`](hooks/hook_adapter.py) | Codex Hook protocol、child supervision、结果组合 |
| [`runtime/owned-plan.py`](runtime/owned-plan.py) | canonical plan resolution、安全快照和 context 生成 |
| [`runtime/owned-catchup.py`](runtime/owned-catchup.py) | Host transcript 校验、session catch-up result |
| [`runtime/upstream/`](runtime/upstream/) | importer 管理的四个固定上游 runtime 文件 |
| [`contracts/`](contracts/) | Host ABI、result schema、runtime/overlay/Release machine contracts |
| [`tools/import_upstream_runtime.py`](tools/import_upstream_runtime.py) | 固定 archive 的确定性 import/check |
| [`patches/patch_planning_skill.py`](patches/patch_planning_skill.py) | owned catch-up compatibility overlay 复现 |
| [`tools/build_release.py`](tools/build_release.py) | contract-driven deterministic ZIP build/check |
| [`tests/`](tests/) | production、安全、供应链、安装和仓库边界回归 |
| [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) | baseline、上游 archive、overlay 与不可变资产来源链 |
| [`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md) | 新维护者最短接手路径、踩坑摘要与检测结果分流 |

## 3. 实现布局

同一能力会依次出现在 **repository source → Release ZIP → installed managed runtime**，但三者不是
可以互换的目录副本；Managed policy 和 global Skill 又分别位于执行入口与 pristine reference 层。

```text
pinned upstream + provenance
  -> repository-owned source/runtime/contracts
  -> contract-driven Release build
  -> installer-owned managed runtime
  -> adapter-supervised Hook execution
  -> tests and acceptance evidence
```

| 布局 | 由谁产生 | 放什么 | 不承担什么 |
|---|---|---|---|
| repository source | Git checkout | 源码、contracts、importer/patcher/builder、tests 和文档 | 不因本地存在就成为 Release 或 installed runtime |
| Release ZIP | [`tools/build_release.py`](tools/build_release.py) 按 [`release-artifact-v1.json`](contracts/release-artifact-v1.json) 构建 | 可安装 runtime、installer 及 allowlist 明确要求的维护输入 | 不包含 bootstrap，也不自动表示已发布或验收 |
| installed managed runtime | [`install.js`](install.js) 校验后复制 | adapter、两个 owned runtime、四个 upstream runtime、两个 plan contracts、overlay、notice 和 installed manifest | 不带 builder、测试、维护文档或其余 repository contracts |
| Managed policy | installer 合并到共享 requirements | 指向 installed adapter 的绝对命令 | 不直接注册 plan、catch-up 或 upstream child |
| global PWF Skill | 独立上游 Skill 安装 | pristine reference 和 bootstrap 校验输入 | production 不从这里执行可变脚本 |

源码重建发生在 repository source 或自包含 Release ZIP；生产执行只发生在 installer 已校验的 managed
runtime。完整 trusted graph 及为什么必须分开见 [`ARCHITECTURE.md`](ARCHITECTURE.md)。

## 4. 模块职责与依赖

下表是维护入口，不是函数说明。字段、预算、precedence、hash 和 allowlist 仍以链接的源码与 machine
contract 为准。

| 模块 | 入口与职责 | 直接依赖与下游 | 改动影响 | 首选验证 |
|---|---|---|---|---|
| Install plane | [`install.js`](install.js)：install/doctor/repair/uninstall，拥有 managed files、manifest、requirements merge 和 drift 分类 | 读取 `package.json`、`upstream-manifest.json`、owned runtime/contracts；写 installed managed runtime 与 policy | 安装原子性、ownership、权限、备份、repair 安全边界 | [`tests/installer.test.js`](tests/installer.test.js)；跨用户行为还需 Linux gate |
| Adapter | [`hooks/hook_adapter.py`](hooks/hook_adapter.py)：接收 Host Hook stdin，校验 typed result，监督 child 并组合 context | 调用 sibling plan/catch-up；对接 request/result contracts；输出 Host Hook result | 事件 dispatch、超时/进程清理、fail-open composition、Host ABI seam | [`tests/hook-adapter.test.js`](tests/hook-adapter.test.js)、[`tests/runtime-supervisor.test.js`](tests/runtime-supervisor.test.js)、[`tests/activation.test.js`](tests/activation.test.js) |
| Plan runtime | [`runtime/owned-plan.py`](runtime/owned-plan.py)：唯一 plan selection、安全读取/快照和 context 生成入口 | 消费 plan request；调用 [`resolve-plan-dir.sh`](runtime/upstream/resolve-plan-dir.sh) 与 [`inject-plan.sh`](runtime/upstream/inject-plan.sh)；返回 plan result | planning attachment、选择顺序、安全文件读取、注入结果 | [`tests/owned-plan-runtime.test.js`](tests/owned-plan-runtime.test.js) 与 adapter seam 测试 |
| Catch-up runtime | [`runtime/owned-catchup.py`](runtime/owned-catchup.py)：验证 Host transcript 并生成可选 session report | 消费 adapter runtime request 和已验证 plan project；加载 [`session-catchup.py`](runtime/upstream/session-catchup.py)；返回 runtime result | transcript 选择/身份/解析、Resume report、partial-injection 防护 | [`tests/owned-runtime.test.js`](tests/owned-runtime.test.js)、[`tests/cloud-fixtures.test.js`](tests/cloud-fixtures.test.js) 与 activation 测试 |
| Upstream owned copy | [`runtime/upstream/`](runtime/upstream/)：固定上游脚本的 repository-owned 成品 | 由 importer/patcher 从 pinned archive 重建；只被两个 owned runtime 调用 | 上游等价性、overlay、mode、source provenance | [`tests/import-runtime.test.js`](tests/import-runtime.test.js)、[`tests/skill-patch.test.js`](tests/skill-patch.test.js) |
| Import/overlay plane | [`tools/import_upstream_runtime.py`](tools/import_upstream_runtime.py) + [`patches/patch_planning_skill.py`](patches/patch_planning_skill.py)：确定性重建并检查 owned copy | 读取 runtime bundle、overlay contract、pinned archive；写/核验 `runtime/upstream/*` | archive/source drift、patch anchor、overlay 顺序、可复现性 | import-runtime、skill-patch 与 [`tests/contracts.test.js`](tests/contracts.test.js) |
| Package plane | [`tools/build_release.py`](tools/build_release.py)：按 contract 构建/检查 deterministic ZIP | 读取 package identity、Release contract 与 allowlisted source bytes；输出 ZIP | package identity、entry/mode/metadata、bootstrap boundary、历史 asset oracle | [`tests/release-package.test.js`](tests/release-package.test.js)、contracts 与 [`tests/repository-boundary.test.js`](tests/repository-boundary.test.js) |

### 4.1 Machine contract 路由

| 接口/清单 | Machine authority | 谁必须一起复核 |
|---|---|---|
| adapter → plan request | [`adapter-plan-context-request-v1.schema.json`](contracts/adapter-plan-context-request-v1.schema.json) | adapter producer、owned-plan consumer、两侧 seam tests |
| plan → adapter result | [`plan-context-result-v1.schema.json`](contracts/plan-context-result-v1.schema.json) | owned-plan producer、adapter validator、activation tests |
| adapter → catch-up request / result | [`adapter-runtime-request-v1.schema.json`](contracts/adapter-runtime-request-v1.schema.json) / [`runtime-result-v1.schema.json`](contracts/runtime-result-v1.schema.json) | adapter、owned-catchup、runtime/activation tests |
| owned upstream inventory/source | [`runtime-bundle-v1.json`](contracts/runtime-bundle-v1.json) + [`compatibility-overlays-v1.json`](contracts/compatibility-overlays-v1.json) | importer、patcher、upstream manifest、import/patch tests |
| candidate ZIP identity/inventory | [`release-artifact-v1.json`](contracts/release-artifact-v1.json) | package identity、builder、bootstrap boundary、release tests |

修改 contract 时不能只改 JSON：必须同步检查 producer、consumer、integrity reference 和最近的 seam test；
是否允许改变 Host ABI 或 trusted graph 仍由活动 task plan 与 [`ARCHITECTURE.md`](ARCHITECTURE.md) 决定。

## 5. 按变更目标定位

| 想改变什么 | 首先阅读/修改 | 同时核对 | 不要顺手改变 |
|---|---|---|---|
| install、doctor、repair 或 uninstall | `install.js` | runtime bundle、upstream manifest、installer tests | runtime 选择算法或 shared third-party policy ownership |
| Hook 事件接入、child 调度或输出组合 | `hook_adapter.py` | 两组 request/result contracts、adapter/supervisor/activation tests | 在 adapter 中重新实现 plan selection 或 transcript parser |
| plan 定位、attachment、安全读取或 context 生成 | `owned-plan.py` | resolver/injector、plan contracts、owned-plan tests | 让 adapter 直接读取 planning 文件 |
| Resume/catch-up transcript 行为 | `owned-catchup.py` | owned upstream catch-up、runtime contracts、runtime/cloud fixture tests | 使用未验证 transcript 或产生 partial report |
| 上游版本、文件来源或 compatibility overlay | provenance → runtime bundle/overlay → importer/patcher | upstream manifest、owned copy、import/patch/contracts tests | 修改 global Skill 或绕过 hash/anchor gate |
| ZIP 内容、mode、metadata 或外部 bootstrap 边界 | release artifact contract → builder | package identity、release/repository tests、README 打包入口 | 把本地 ZIP、zero-hash bootstrap 或文件名当成 Release |
| Host ABI、trusted graph 或失败语义 | 先读 ARCHITECTURE 与活动 task plan | 所有 producer/consumer、contracts、activation 与 Cloud gate | 在普通模块修复中隐式扩大行为面 |

## 6. 验证路由

完整可复制命令只在 [`README.md` 的“本地开发”](README.md#本地开发) 维护；这里回答应选择哪一类证据，
不冻结测试数量。

1. **单模块修改：** 先跑上表对应的最近边界测试，再跑直接 producer/consumer 的 seam test。
2. **contract 或跨层修改：** 同时跑 contracts、adapter/runtime、activation 和 repository boundary；若
   Host ABI、trusted graph 或失败语义变化，先停止并取得专项设计与授权。
3. **importer、patcher 或 owned upstream 修改：** importer `check`、import/patch tests 和 mode/LF
   都必须通过；来源与 hash 还要回到 provenance/machine contract。
4. **installer 或 Release boundary 修改：** 完整 suite、deterministic ZIP build/check 和目标平台 gate
   缺一不可；Windows 的 POSIX SKIP 不能替代 Linux/Cloud。
5. **纯文档路由修改：** 运行 focused governance、相对链接/标题锚点、LF/fence、repository inventory
   与 `git diff --check`；若文档属于 ZIP 输入，仍需验证当前开发包和 immutable published oracle。

跨层架构断言集中在 [`tests/architecture-contracts.test.js`](tests/architecture-contracts.test.js)；测试通过
只证明当前合同，没有授予 seal、publication、Cloud、rollback 或下一 Product Phase。

## 7. 继续阅读

- 首次使用或寻找命令：回到 [`README.md`](README.md)。
- 判断 trust、Host contract 或失败语义：阅读 [`ARCHITECTURE.md`](ARCHITECTURE.md)。
- 判断当前 programme 或 Release 状态：阅读 [`ROADMAP.md`](ROADMAP.md)。
- 追溯 upstream、overlay 或历史资产：阅读 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)。
- 新维护者接手和结果分流：阅读 [`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md)。
