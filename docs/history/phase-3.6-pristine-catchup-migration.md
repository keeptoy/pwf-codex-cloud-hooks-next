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

<a name="phase-3-6-actual-lineage"></a>

## 三个阶段实际是什么关系

这段历史最容易被误写成“Phase 3 的 private snapshot 替换了 Phase 1 的四项 catch-up overlay”，实际不是：

- **Phase 1：** 在还没有 owned wrapper 时，为旧 `session-catchup.py` CLI 建立四项 Cloud compatibility overlay，
  让 runtime、session store、scoped planning state 与 bounded rendering 变成可固定、可校验的源码转换。
- **Phase 2：** 首次加入并激活 `owned-catchup.py`。transcript 选择、session/project identity、immutable bytes、
  Cloud event normalization、budget 和 report rendering 从第一版 wrapper 起就由 owned boundary 负责；wrapper
  只调用 upstream 的 parser/extraction helpers，不调用 patched CLI branches 或 upstream `main()`。
- **Phase 3：** private snapshot 专门解决 plan resolver/injector 需要真实文件语义的问题，在保持 plan scripts
  pristine 的同时避免再新增第二组 plan overlay。它属于 plan invocation domain，不是 catch-up overlay 的替代品。

immutable 历史进一步证明这条时间线：`v0.3.0-alpha.1` 已包含 patched `session-catchup.py`、patcher 和 overlay
contract，但还没有 `owned-catchup.py`；`v0.3.0-alpha.2` 首次加入 wrapper 时继续携带与 alpha.1 完全相同的 patched
upstream blob，wrapper 却从第一版起只进入未修改的四个 helper roots。也就是说，真正让四项 catch-up overlay
失去 production 用途的是 Phase 2 的 owned wrapper；Phase 3 snapshot 只是避免 plan 侧再产生另一组 overlay。

大白话就是：Phase 2 已经把旧门封住，所有人改走 owned wrapper 的新门；Phase 3 是给另一间房修了一条受控通道，
并没有回来拆旧门。旧门后面的 patched CLI 从此没人走，但仓库仍在生产它的钥匙、检查钥匙齿形，并把钥匙和说明书
一起装箱。

<a name="phase-3-6-design-hindsight"></a>

## 为什么行为退休了，供应链还活着

Phase 1 在没有 owned wrapper 的前提下使用 overlay，并不是明显错误。它把当时确实需要的 Cloud compatibility
变化变成显式 patch、固定 anchor/hash 和可审计 ledger，比现场修改 global Skill 更安全。Phase 2 切换 production
调用路径时继续暂时携带同一份 patched bytes，也可以理解为分阶段迁移中的保守做法。

真正遗漏的是没有把“行为替换”和“供应链退休”设计成同一个关闭事务。Phase 2 证明了新 wrapper 能运行，却没有
同步建立一张 retirement checklist，要求在 wrapper 稳定后清点旧 transformation 的所有入边。因此 v0.3.2 出现了
两套不同答案：

| 观察层 | 当时的实际状态 |
|---|---|
| production call graph | patched functions 已不可达；owned wrapper 只调用 parser helpers |
| source reconstruction | importer 仍加载 patcher、校验 anchors 并生成 patched bytes |
| machine contracts | overlay IDs、order、pristine/managed hash 和 compatibility ledger 仍被当作 active fact |
| Release/package | patcher、overlay ledger 与 patched upstream runtime 仍进入 ZIP |
| installed inventory | overlay ledger 和 patched runtime identity 仍由 installer 安装、doctor 和 drift 检查维护 |
| tests/docs | 仍验证 patch anchors、overlay 顺序和 managed hash，并把它描述成当前兼容层 |

这就是“行为已经退休，供应链合同仍存活”：运行时没人走旧路，不代表 source、build、install、doctor、tests 和
文档会自动知道旧路可以拆。相反，只要这些层仍互相引用，完整回归就会要求它们继续存在，残留甚至会因为测试全绿
而显得比普通死代码更像正式架构。

原设计缺少的闭环主要有四项：

- replacement gate 没有同时登记“新路径接管了哪些旧行为”和“最后一个 production consumer 何时消失”；
- retirement DoD 只看行为是否切换，没有沿 source → importer → contract → ZIP → installer → doctor → tests/docs
  逐层清掉旧机制；
- 测试长期保护 patch 实现本身，没有在 wrapper 接管后及时迁成 behavior equivalence、helper closure 与旧路径
  不可达/不入包的断言；
- immutable 历史和 current tree 的职责没有及时分开，导致为了保留 v0.3.2 可解释性而继续携带可执行 patcher，
  而不是让 tag/source/Release/provenance 保存历史。

<a name="phase-3-6-lessons-and-landing"></a>

## 经验教训与落地方式

1. 替换生产调用只完成了行为迁移的一半。compatibility layer 只有在 runtime 不可达、source 不再生成、package
   不再携带、installer 不再安装、tests/docs 不再把它当现役后，才算真正退休。
2. 新 boundary 接管旧行为时，应立即建立 retirement ledger：逐项映射旧 overlay 解决的问题由哪个新组件接管、
   需要什么本地/Linux/Cloud 证据、何时允许删除旧 mechanism，而不是等多年后再靠考古恢复调用图。
3. 不同 invocation domain 不能写成互相替代。catch-up overlay 由 Phase 2 owned wrapper 取代；Phase 3 private
   snapshot 处理 plan scripts。架构复盘必须区分“谁让旧路径不可达”和“谁避免新增另一条旧式路径”。
4. 测试应随架构换代迁移职责：从 patch anchor/order/hash 测试，转为 managed/pristine result equivalence、四个
   helper roots 及传递闭包、完整 module initialization surface、upstream `main()` 不可达，以及 patcher/ledger
   不进入 current ZIP/install inventory 的负向断言。
5. 删除前要做全链路 inventory，不能只用代码搜索判断死活。至少同时检查 runtime call graph、importer、manifest/
   bundle、Release allowlist、installer/doctor、tests/docs、upgrade/rollback 和 Cloud；任一仍有真实 consumer 就停止。
6. 历史可恢复性不等于 current-tree 可执行保留。旧 overlay IDs、anchors、managed hash 和 package bytes 由 immutable
   tag/source/Release 与 provenance 保存；current importer 不必继续充当旧版本重建器，也不能改写已发布资产。

落地时应按下面的关闭顺序进行：

```text
证明 owned wrapper 已覆盖四项 compatibility behavior
  -> 证明 patched CLI branches 在 production call graph 不可达
  -> 先增加 pristine/helper equivalence 与旧 artifact 负向 guards
  -> importer 切成 pristine-only，删除 patcher/overlay active contracts
  -> 原子更新 manifest、bundle、Release allowlist、installer inventory、hash、tests/docs
  -> 完整本地/Linux、deterministic ZIP、upgrade/rollback 与 Cloud 验收
  -> 只在 immutable provenance 中保留旧机制
```

这套顺序的重点不是“看到死代码就删”，而是先证明替代边界完整，再一次性关闭所有供应链入边。这样既不会误删仍被
使用的兼容能力，也不会留下“运行时已死、打包系统仍供养”的半退休状态。

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
