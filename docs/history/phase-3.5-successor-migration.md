<a name="historical-position"></a>

# Phase 3.5：Successor 仓库迁移

## Historical position

`Phase 3.5` 是后续整理历史时采用的回顾性治理标签，不是当时 programme 正式授权的 Product Phase，也不是
版本或 Release identity。它位于 Phase 3 的 beta.2 功能/发布闭环之后、successor stable v0.3.0 建立之前；
当时 Phase 4 仍未开始。

<a name="problem-before"></a>

## Problem before

beta.2 已经冻结 canonical runtime、独立资产和 Cloud 验收，但产品权威仍在旧仓库。直接把整个旧树长期
搬入 successor 会继续携带 completed planning、Phase/Round 文档和 prototype；直接从零精简又可能在
不自知的情况下改变 runtime bytes、文件 mode、Release boundary 或 Cloud 行为。因此需要把“字节等价”、
“精简新根”、“行为等价”和“仓库权威切换”拆成可独立停止与回滚的迁移 gate。

<a name="core-decisions"></a>

## Core decisions

- 以冻结的 v0.3.0-beta.2 为唯一产品输入，不在迁移中重新设计 Phase 3 行为。
- 先建立 exact mirror，再从已核验输入构造 parentless slim root；精简不能替代来源证明。
- 在切换仓库 authority 前，先证明 successor 的 Linux、Fresh/Resume、doctor 与 package 行为等价。
- default/main、ruleset、旧仓库导航和 rollback 验收最后切换；每一步保留明确停止条件。

<a name="completed-delivery"></a>

## Completed delivery

- **M1 — exact mirror**：冻结 beta.2 commit/tree、Release assets 与 runtime bytes 的等价镜像。
- **M2 — slim transformation**：选择性建立干净 successor root，保留 canonical production、contracts、
  tests 和稳定文档，移除已完成 planning、逐 Round 文档与 snapshot prototype。
- **M3 — Cloud equivalence**：验证精简后的 successor 在 Linux、Fresh/Resume、doctor、managed policy 和
  deterministic package 上保持已接受行为。
- **M4 — repository authority cutover**：完成 repository settings、default/main、ruleset、旧仓库导航、
  accepted cutover 与 rollback 验收，使 successor 成为 canonical source authority。

<a name="acceptance-conclusion"></a>

## Acceptance conclusion

M1～M4 证明可以在不改变 Phase 3 production 行为的前提下，把来源、精简、Cloud 等价和仓库控制权逐层
迁移。closure 后以 successor 仓库发布 stable v0.3.0；完整 per-gate commits、fixture identity 和可重放
runbook 继续由 `BASELINE_PROVENANCE.md` 保存，不在本摘要复制 SHA 表。

<a name="explicit-non-goals"></a>

## Explicit non-goals

- 不发布 beta.3，也不把迁移分支名称解释为新产品版本。
- 不修改 production runtime、Host ABI、trusted graph、Hook behavior 或已发布 beta.2 assets。
- 不写入 live `/opt/codex`，不授权 attestation、nonce、mode、ledger 或任何 Phase 4 能力。
- 不把被精简掉的旧 planning、Phase/Round 原文和 prototype 重新带回当前树。

<a name="successor-inheritance"></a>

## Successor inheritance

stable v0.3.0 继承 Phase 3 已验收的 canonical runtime，同时把代码、Release 和治理 authority 收敛到
successor。后续 v0.3.1/v0.3.2 在该基线上加固兼容性、供应链和仓库治理；Phase 3.5 本身不产生新的
长期 runtime contract，也不改变未来 Product Phase 的编号或授权方式。

<a name="immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable migration closure snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/c5236958b9830ee3695b0e81e1a0746707a6b8f9)

该链接只证明本文的历史来源，不解释当前实现；M1～M4 exact refs 由当前 provenance authority 维护。
