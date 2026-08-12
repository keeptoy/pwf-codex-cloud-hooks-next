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
| 已发布版本与 Unreleased 已经改变了什么 | [`CHANGELOG.md`](CHANGELOG.md) |
| 当前 programme、版本列车与 Release/rollback 状态 | [`ROADMAP.md`](ROADMAP.md) |
| 当前唯一 Next Step 与授权边界 | `.planning/.active_plan` 指向的活动 `task_plan.md` |
| 已发布身份、迁移 refs、upstream/overlay 与不可变资产的精确来源 | [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) |

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
| [`contracts/`](contracts/) | Host ABI、result schema、runtime/Release machine contracts |
| [`tools/import_upstream_runtime.py`](tools/import_upstream_runtime.py) | 固定 archive 的确定性 import/check |
| [`tools/build_release.py`](tools/build_release.py) | contract-driven deterministic ZIP build/check |
| [`tests/`](tests/) | production、安全、供应链、安装和仓库边界回归 |
| [`docs/cloud-hard-acceptance-template.md`](docs/cloud-hard-acceptance-template.md) | 版本中立的双通道 Cloud 执行协议与三层文档分工；活动 Release plan 保存施工状态，版本 acceptance 只登记已完成的不可变证据 |
| [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) | 持续维护的冷证据账本：已发布身份、迁移 refs、上游 archive、overlay 与不可变资产来源链 |
| [`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md) | 新维护者最短接手路径、踩坑摘要与检测结果分流 |

<a name="implementation-layout"></a>

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
| repository source | Git checkout | 源码、contracts、importer/builder、tests 和文档 | 不因本地存在就成为 Release 或 installed runtime |
| Release ZIP | [`tools/build_release.py`](tools/build_release.py) 按 manifest 指定的 [`release-artifact-v2.json`](contracts/release-artifact-v2.json) 构建 | 可安装 runtime、installer 及 allowlist 明确要求的维护输入；entry 自带 ZIP mode | 不包含 bootstrap，也不自动表示已发布或验收 |
| installed managed runtime | [`install.js`](install.js) 校验后复制 | adapter、两个 owned runtime、四个 pristine upstream runtime、四个 runtime ABI contracts、notice 和 installed manifest | 不带 builder、importer、测试、维护文档或其余 repository contracts |
| Managed policy | installer 合并到共享 requirements | 指向 installed adapter 的绝对命令 | 不直接注册 plan、catch-up 或 upstream child |
| global PWF Skill | 独立上游 Skill 安装 | pristine reference 和 bootstrap 校验输入 | production 不从这里执行可变脚本 |

源码重建发生在 repository source 或自包含 Release ZIP；生产执行只发生在 installer 已校验的 managed
runtime。完整 trusted graph 及为什么必须分开见 [`ARCHITECTURE.md`](ARCHITECTURE.md)。

<a name="module-responsibilities"></a>

## 4. 模块职责与依赖

下表是维护入口，不是函数说明。字段、预算、precedence、hash 和 allowlist 仍以链接的源码与 machine
contract 为准。

| 模块 | 入口与职责 | 直接依赖与下游 | 改动影响 | 首选验证 |
|---|---|---|---|---|
| Install plane | [`install.js`](install.js)：install/doctor/repair/uninstall，拥有 managed files、manifest、requirements merge 和 drift 分类 | 从 `upstream-manifest.json` 校验并消费 runtime bundle；读取 `package.json` 与 bundle 固定的 owned runtime/contracts；写 installed managed runtime 与 policy | 安装原子性、ownership、权限、备份、repair 安全边界 | [`tests/installer.test.js`](tests/installer.test.js)；跨用户行为还需 Linux gate |
| Adapter | [`hooks/hook_adapter.py`](hooks/hook_adapter.py)：接收 Host Hook stdin，校验 typed result，监督 child 并组合 context | 调用 sibling plan/catch-up；对接 request/result contracts；输出 Host Hook result | 事件 dispatch、超时/进程清理、fail-open composition、Host ABI seam | [`tests/hook-adapter.test.js`](tests/hook-adapter.test.js)、[`tests/runtime-supervisor.test.js`](tests/runtime-supervisor.test.js)、[`tests/activation.test.js`](tests/activation.test.js) |
| Plan runtime | [`runtime/owned-plan.py`](runtime/owned-plan.py)：唯一 plan selection、安全读取/快照和 context 生成入口 | 消费 plan request；调用 [`resolve-plan-dir.sh`](runtime/upstream/resolve-plan-dir.sh) 与 [`inject-plan.sh`](runtime/upstream/inject-plan.sh)；返回 plan result | planning attachment、选择顺序、安全文件读取、注入结果 | [`tests/owned-plan-runtime.test.js`](tests/owned-plan-runtime.test.js) 与 adapter seam 测试 |
| Catch-up runtime | [`runtime/owned-catchup.py`](runtime/owned-catchup.py)：验证 Host transcript 并生成可选 session report | 消费 adapter runtime request 和已验证 plan project；加载 [`session-catchup.py`](runtime/upstream/session-catchup.py) 的 parser helpers（不调用 upstream CLI main）；返回 runtime result | transcript 选择/身份/解析、Resume report、partial-injection 防护 | [`tests/owned-runtime.test.js`](tests/owned-runtime.test.js)、[`tests/cloud-fixtures.test.js`](tests/cloud-fixtures.test.js) 与 activation 测试 |
| Upstream owned copy | [`runtime/upstream/`](runtime/upstream/)：四个固定上游脚本的 repository-owned pristine 成品 | 由 importer 从 pinned archive 逐字重建；只被两个 owned runtime 调用 | 上游等价性、helper entrypoints、mode、source provenance | [`tests/import-runtime.test.js`](tests/import-runtime.test.js)、[`tests/pristine-catchup-boundary.test.js`](tests/pristine-catchup-boundary.test.js) |
| Import plane | [`tools/import_upstream_runtime.py`](tools/import_upstream_runtime.py)：确定性重建并检查 owned copy | 从 upstream manifest 校验 runtime bundle 原始 SHA，再读取 pinned archive；写/核验 `runtime/upstream/*` | manifest/bundle integrity、archive/source drift、pristine hash、mode、inventory、可复现性 | import-runtime、contracts 与 pristine-catchup boundary tests |
| Package plane | [`tools/build_release.py`](tools/build_release.py)：按 contract 构建/检查 deterministic ZIP | 读取 package identity、Release contract 与 allowlisted source bytes；输出 ZIP | package identity、entry/mode/metadata、bootstrap boundary、历史 asset oracle | [`tests/release-package.test.js`](tests/release-package.test.js)、[`tests/published-release-oracles.test.js`](tests/published-release-oracles.test.js)、contracts 与 [`tests/repository-boundary.test.js`](tests/repository-boundary.test.js) |

Catch-up runtime seam：`owned-catchup.py` 负责 transcript selection、containment/identity revalidation、
immutable byte capture、record decoding/validation、Cloud event normalization/dedup、output budget 和
report rendering。它动态加载完整的 fixed owned `session-catchup.py` module，但只调用
`same_project_path`、`find_last_planning_update`、`extract_messages_after` 与 `text_content` helpers，
不调用 CLI `main()`。完整 module initialization 的 UTF-8 stdio 配置与 optional `orjson` import 仍属于
trusted surface；allowed helper roots、传递闭包和 pristine/managed 等价由 runtime bundle 与边界测试冻结。

### 4.1 Machine contract 路由

| 接口/清单 | Machine authority | 谁必须一起复核 |
|---|---|---|
| adapter → plan request | [`adapter-plan-context-request-v1.schema.json`](contracts/adapter-plan-context-request-v1.schema.json) | adapter producer、owned-plan consumer、两侧 seam tests |
| plan → adapter result | [`plan-context-result-v1.schema.json`](contracts/plan-context-result-v1.schema.json) | owned-plan producer、adapter validator、activation tests |
| adapter → catch-up request / result | [`adapter-runtime-request-v1.schema.json`](contracts/adapter-runtime-request-v1.schema.json) / [`runtime-result-v1.schema.json`](contracts/runtime-result-v1.schema.json) | adapter、owned-catchup、runtime/activation tests |
| upstream provenance / bundle integrity index | [`upstream-manifest.json`](upstream-manifest.json) | importer、installer 与 manifest/contracts integrity tests；不得在这里重建 runtime inventory mirror |
| runtime source/install inventory | [`runtime-bundle-v2.json`](contracts/runtime-bundle-v2.json) | importer、installer、upstream manifest integrity index、import/installer/contracts/pristine-helper tests |
| candidate ZIP identity/inventory/mode | [`release-artifact-v2.json`](contracts/release-artifact-v2.json) | package identity、builder、bootstrap boundary、release tests；不得在 builder 保留第二份 executable-path authority |

大白话对应关系是：manifest 是 bundle 的封条和索引，bundle 是唯一装箱清单，installed manifest 是安装后的
状态快照，Release artifact 是 ZIP 外层 allowlist。前两者共同建立 source/install 信任链，后两者分别服务 drift
检查和制品边界，内容相似也不能互换职责。

修改 contract 时不能只改 JSON：必须同步检查 producer、consumer、integrity reference 和最近的 seam test；
是否允许改变 Host ABI 或 trusted graph 仍由活动 task plan 与 [`ARCHITECTURE.md`](ARCHITECTURE.md) 决定。

## 5. 按变更目标定位

| 想改变什么 | 首先阅读/修改 | 同时核对 | 不要顺手改变 |
|---|---|---|---|
| install、doctor、repair 或 uninstall | `install.js` | runtime bundle、upstream manifest、installer tests | runtime 选择算法或 shared third-party policy ownership |
| Hook 事件接入、child 调度或输出组合 | `hook_adapter.py` | 两组 request/result contracts、adapter/supervisor/activation tests | 在 adapter 中重新实现 plan selection 或 transcript parser |
| plan 定位、attachment、安全读取或 context 生成 | `owned-plan.py` | resolver/injector、plan contracts、owned-plan tests | 让 adapter 直接读取 planning 文件 |
| Resume/catch-up transcript 行为 | `owned-catchup.py` | owned upstream catch-up、runtime contracts、runtime/cloud fixture tests | 使用未验证 transcript 或产生 partial report |
| 上游版本、文件来源或 helper entrypoint | provenance → runtime bundle → importer | upstream manifest、owned pristine copy、import/contracts/helper-closure tests | 修改 global Skill、重新引入 source transformation 或绕过 hash gate |
| ZIP 内容、mode、metadata 或外部 bootstrap 边界 | release artifact contract → builder | package identity、release/repository tests、README 打包入口 | 把本地 ZIP、zero-hash bootstrap 或文件名当成 Release |
| Host ABI、trusted graph 或失败语义 | 先读 ARCHITECTURE 与活动 task plan | 所有 producer/consumer、contracts、activation 与 Cloud gate | 在普通模块修复中隐式扩大行为面 |

## 6. 验证路由

完整可复制命令只在 [`README.md` 的“本地开发”](README.md#local-development) 维护；这里回答应选择哪一类证据，
不冻结测试数量。

1. **单模块修改：** 先跑上表对应的最近边界测试，再跑直接 producer/consumer 的 seam test。
2. **contract 或跨层修改：** 同时跑 contracts、adapter/runtime、activation 和 repository boundary；若
   Host ABI、trusted graph 或失败语义变化，先停止并取得专项设计与授权。
3. **importer 或 owned upstream 修改：** importer `check`、import/contracts/pristine-helper tests 和 mode/LF
   都必须通过；来源与 hash 还要回到 provenance/machine contract。
4. **installer 或 Release boundary 修改：** 完整 suite、deterministic ZIP build/check 和目标平台 gate
   缺一不可；Windows 的 POSIX SKIP 不能替代 Linux/Cloud。
5. **纯文档路由修改：** 运行 focused governance、相对链接/标题锚点、LF/fence、repository inventory
   与 `git diff --check`；若文档属于 ZIP 输入，仍需验证当前开发包和 immutable published oracle。

跨层架构断言集中在 [`tests/architecture-contracts.test.js`](tests/architecture-contracts.test.js)；测试通过
只证明当前合同，没有授予 seal、publication、Cloud、rollback 或下一 Product Phase。

### 6.1 测试职责反向索引

第 4～6 节回答“模块或变更 → 选择什么验证”；下表提供反向入口，回答“看到一个 test module → 它主要
保护什么”。索引粒度是文件而不是单个 case，避免把测试源码复制成第二份可漂移清单。

| 测试文件 | 主要保护内容 | 直接对象/边界 | 平台属性 |
|---|---|---|---|
| [`activation.test.js`](tests/activation.test.js) | production 事件顺序、plan/catch-up 组合和 child failure 降级 | adapter 与两个 owned runtime 的集成 seam | 组合断言跨平台；真实 runtime/cross-user case 需要 Linux |
| [`architecture-contracts.test.js`](tests/architecture-contracts.test.js) | 版本无关的文档 authority、稳定锚点、Architecture/Design 分工和 handoff 治理 | 根级稳定文档与 machine/architecture 边界；不得冻结版本 acceptance、commit 或资产 hash | 跨平台静态治理 |
| [`cloud-fixtures.test.js`](tests/cloud-fixtures.test.js) | 带日期 Cloud lifecycle/Hook fixture 与 wrapper catch-up 兼容性 | Cloud-shaped fixture、owned catch-up | 跨平台重放；不替代 live Cloud gate |
| [`contracts.test.js`](tests/contracts.test.js) | schema、manifest、overlay、runtime bundle 与 Release boundary 的关系 | machine contracts 与 integrity edges | 跨平台静态/关系断言 |
| [`golden-output.test.js`](tests/golden-output.test.js) | managed-legacy composition 与 canonical plan 输出兼容性 | adapter output golden fixtures | 跨平台 golden replay |
| [`hook-adapter.test.js`](tests/hook-adapter.test.js) | Host 输入、canary、event dispatch、plan authority 与结果组合 | `hook_adapter.py` 的协议边界 | 跨平台，使用受控 child doubles |
| [`import-runtime.test.js`](tests/import-runtime.test.js) | pinned archive、allowlist、确定性 import 与 destination drift | importer、upstream manifest、owned copy | 跨平台临时 archive/workspace |
| [`installer.test.js`](tests/installer.test.js) | install/doctor/repair/uninstall、TOML ownership、锁、备份和 drift | `install.js` 与 shared managed state | 主体跨平台；权限/cross-user case 需要 Linux |
| [`owned-plan-runtime.test.js`](tests/owned-plan-runtime.test.js) | plan 选择、attachment、安全读取、private snapshot、timeout 与 cleanup | `owned-plan.py`、resolver/injector、plan contracts | 基础 schema 跨平台；文件/进程安全 case 需要 Linux |
| [`owned-runtime.test.js`](tests/owned-runtime.test.js) | transcript 选择、identity、fallback、损坏输入与 diagnostic | `owned-catchup.py`、runtime contracts、Host data | 主体跨平台；linked-file case 需要 POSIX |
| [`published-release-oracles.test.js`](tests/published-release-oracles.test.js) | accepted + immediate-fallback 两席的已发布 tag/source、ZIP 与 external bootstrap immutable oracle | 本地 Git tag/history、sealed source、当前 rollback 角色窗口 | 需要具备对应 refs/objects 的 publication 审计 checkout；不得放入 tagless Source/Candidate Cloud suite |
| [`release-package.test.js`](tests/release-package.test.js) | 当前 candidate ZIP 确定性、自包含边界与 package/contract identity drift | Release builder、artifact contract、external bootstrap boundary | tagless checkout 可执行；本地结果不构成 publication |
| [`repository-boundary.test.js`](tests/repository-boundary.test.js) | trusted source exact inventory、planning/docs 生命周期、历史归档单入口、动态角色窗口、版本无关稳定文档与 retirement DoD | Git repository、Release allowlist、当前 acceptance、runtime dispatch | 跨平台静态边界；不冻结历史摘要写作格式 |
| [`runtime-supervisor.test.js`](tests/runtime-supervisor.test.js) | child result 校验、process supervision、sibling identity 与 producer/consumer seam | adapter supervisor、plan contracts、installed siblings | 主体跨平台；process-group timeout 需要 Linux |
| [`bootstrap.test.js`](tests/bootstrap.test.js) | development checksum fail-closed、Node/toolchain 与 global Skill pristine 安装 | candidate bootstrap、pinned Skill archive | 需要 Bash；不替代 Cloud install acceptance |
| [`pristine-catchup-boundary.test.js`](tests/pristine-catchup-boundary.test.js) | managed/pristine result 等价、helper allowlist/closure 与 import-time surface | owned-catchup、pinned session module、runtime bundle | 跨平台但需要 Python child；不替代 live Resume |

同一能力可能被边界、seam、golden 和 activation 多层测试共同保护，因此这不是一一对应表。具体 case
语义以测试源码中的 test title 与 assertion 为准，运行数量由 runner 提供；新增 test module 时必须在本
节补一行，但不在 DESIGN 冻结 case 数。任何 PASS 都不能替代未执行的平台 gate 或扩大活动授权。

## 7. 继续阅读

- 首次使用或寻找命令：回到 [`README.md`](README.md)。
- 判断 trust、Host contract 或失败语义：阅读 [`ARCHITECTURE.md`](ARCHITECTURE.md)。
- 了解各版本已经发生的变化：阅读 [`CHANGELOG.md`](CHANGELOG.md)。
- 判断当前 programme 或 Release 状态：阅读 [`ROADMAP.md`](ROADMAP.md)。
- 追溯 upstream、overlay 或历史资产：阅读 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)。
- 新维护者接手和结果分流：阅读 [`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md)。
