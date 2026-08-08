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

## 3. 实现层次

```text
pinned upstream + provenance
  -> repository-owned source/runtime/contracts
  -> contract-driven Release build
  -> installer-owned managed runtime
  -> adapter-supervised Hook execution
  -> tests and acceptance evidence
```

- **Source/rebuild：** importer、patcher、runtime bundle 和 provenance 共同证明 owned runtime 可复现。
- **Build/package：** Release contract 是 ZIP inventory 的 machine authority；bootstrap 始终在 ZIP 外。
- **Install：** installer 校验 source/hash/mode/inventory，再写入 managed runtime 和 requirements policy。
- **Runtime：** Managed policy 只启动 adapter；adapter 只调用已安装的 sibling owned runtime。
- **Evidence：** tests 证明可执行合同；`docs/` acceptance 保存带时间、不可变的 gate 证据。

更完整的依赖、改动影响和验证路由将在本文件后续章节维护；系统设计理由仍只在 ARCHITECTURE。

## 4. 继续阅读

- 首次使用或寻找命令：回到 [`README.md`](README.md)。
- 判断 trust、Host contract 或失败语义：阅读 [`ARCHITECTURE.md`](ARCHITECTURE.md)。
- 判断当前 programme 或 Release 状态：阅读 [`ROADMAP.md`](ROADMAP.md)。
- 追溯 upstream、overlay 或历史资产：阅读 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)。
- 新维护者接手和结果分流：阅读 [`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md)。
