<a name="historical-position"></a>

# Phase 3.6：Pristine Catch-up Runtime 迁移

## Historical position

`Phase 3.6` 是后续整理 v0.3.2 → v0.3.3-dev 变化时采用的回顾性 architecture-migration 标签，不是
programme 正式授权的 Product Phase，也不是版本、tag 或 Release identity。它位于 published v0.3.2
之后，记录 successor source line 将 catch-up compatibility supply-chain 从 active current contract 退休的
本地架构闭环；它不把 v0.3.3-dev 描述为已经发布或已经完成 Cloud hard acceptance。

<a name="problem-before"></a>

## Problem before

v0.3.2 的源码重建链仍让 `session-catchup.py` 经过四项 compatibility overlay，并把 patcher、overlay ledger
和 managed upstream bytes 带入 importer、Release ZIP 与安装清单。但 Phase 2 激活的 `owned-catchup.py`
从一开始就负责 transcript selection/identity、immutable bytes、normalization、budget 与 report rendering，
只复用 upstream parser helpers，不调用被 patch 的 CLI branches 或 upstream `main()`。

这使 production behavior 本身保持正确，却在供应链中长期保留了一条已经不可达的 transformation：current
source 既要维护 pristine helper 语义，又要维护不再参与执行的 patch anchors、overlay order 与第二份 managed
hash。继续保留会把已发布 v0.3.2 的历史实现误当成后继版本仍需承担的当前架构合同。

<a name="core-decisions"></a>

## Core decisions

- 选择 pristine successor 路线：固定的四个 PWF v3.8.2 upstream runtime 文件全部逐字保持 pristine，
  importer 统一拒绝 non-pristine origin、managed/pristine hash 分叉和任何 overlay declaration。
- `owned-catchup.py` 继续拥有完整的 Host/runtime 边界，只允许进入
  `same_project_path`、`find_last_planning_update`、`extract_messages_after` 与 `text_content` 四个 helper roots
  及其固定传递闭包，不调用 upstream CLI `main()`。
- 动态加载完整 pristine module 的 initialization surface 仍被视为真实 trusted surface；不能把“只调用四个
  helper”误写成“只加载四个函数字节”。
- current tree 退休 patcher、active overlay ledger 与 patched upstream bytes；v0.3.2 的 overlay IDs、anchors、
  managed hash 和 package identity 只从 immutable tag/source/Release 与 provenance 冷证据恢复。
- Host ABI、两个 Hook event、adapter-only Managed policy、canonical owned-plan、private snapshot、输出顺序与
  fail-open loop/fail-closed injection 语义保持不变。后继 source 使用独立 development identity 和
  fail-closed zero-hash bootstrap，不能冒充 published v0.3.2 assets。

<a name="completed-delivery"></a>

## Completed delivery

- `runtime/upstream/session-catchup.py` 恢复为 pinned archive 的 pristine bytes；runtime bundle 显式固定四个
  allowed helper roots，并证明其 closure 不进入旧 CLI compatibility branches。
- importer 简化为四文件 pristine import/check；upstream manifest、installer inventory 与 Release allowlist
  同步移除 patcher、overlay contract 和 patched runtime identity。
- 旧 patch-specific tests 退役，通用 bootstrap/global-Skill 安全断言迁入版本无关测试；新增 managed/pristine
  result equivalence、helper allowlist/closure 与 import-time surface 边界测试。
- 当前 `ARCHITECTURE.md` 重新对齐 source → deterministic ZIP → install → adapter/runtime 数据流；published
  v0.3.2 的架构正文另存为非权威历史快照，不进入现行文档 authority graph 或 Release artifact。

<a name="acceptance-conclusion"></a>

## Acceptance conclusion

本 interlude 的 closure 证明：在不改变现有 Hook behavior、Host contracts 与 trusted execution graph 的
前提下，可以删除不可达的 catch-up transformation，并让 repository source、importer、installed inventory
和 candidate ZIP 对同一组 pristine upstream bytes 达成一致。完整跨平台回归、importer integrity、架构/
仓库 guards 与 deterministic double-build 均支持该结论。

这些证据只关闭本地 source/architecture migration，不证明 live Linux/Cloud Fresh/Resume、public asset
download、seal、tag、Release、Latest 或 rollback promotion。任何后继发布身份都必须用自身的 immutable
assets、checksum 和 Cloud acceptance 重新证明，不能继承 v0.3.2 的 PASS。

<a name="explicit-non-goals"></a>

## Explicit non-goals

- 不新增 Hook event，不修改 adapter request/result schema、Host ABI 或 Managed policy 注册方式。
- 不重新设计 canonical owned-plan/private snapshot，也不启用 attestation、nonce、smart mode、structured
  ledger、completion gating 或其他 Phase 4+ 能力。
- 不用 current importer 重建、改写或重新发布 v0.3.2 package；历史 patcher/overlay 不作为可执行博物馆副本
  留在 current tree。
- 不把本地 deterministic ZIP、development bootstrap 或 branch/package version 当成 publication identity。

<a name="successor-inheritance"></a>

## Successor inheritance

后继版本继承 Phase 3 已建立的 thin adapter、canonical owned-plan、private snapshot、owned catch-up 与单一
project state，但 catch-up supply-chain 从“pristine source + historical patch transformation”收敛为“四文件
pristine source + owned explicit boundary”。未来若修改 helper closure、transcript selection、upstream
invocation 或 trusted graph，必须重新进入 Discovery；普通版本轮换不得重新复制旧 patcher/overlay 路径。

<a name="immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/8f8fce8c9668f7d5a2932611c7dee55d55144ce2)

该链接只证明本次本地 architecture/source migration closure 的来源，不解释未来实现，也不证明
v0.3.3-dev 已经发布或完成 Cloud hard acceptance；当前 contract 与行为以当前仓库 authority 为准。
