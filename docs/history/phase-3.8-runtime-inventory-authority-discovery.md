<a name="phase-3-8-historical-position"></a>

# Phase 3.8：Runtime Inventory Authority 探路

## Historical position

`Phase 3.8` 是 Phase 3.7 后一次已经闭合的回顾性 supply-chain Discovery/decision interlude，不是原 programme
的正式 Product Phase，也不表示方案已经实施。它只冻结 `upstream-manifest.json` 与
`contracts/runtime-bundle-v1.json` 重复 inventory 的形成原因、消费者关系、路线选择与未来实施边界；
production、machine contracts、Release bytes 和 Phase 4 行为均未因此改变。

<a name="phase-3-8-problem-before"></a>

## Problem before

最早的 upstream manifest 只记录 pinned Skill/archive、required Skill files 与 compatibility patch provenance。
在 `0.3.0-alpha.1` 的 Phase 1 contract-only gate 中，仓库同时创建 runtime bundle、importer 与 Release builder，
并把 manifest 升级为包含 `managed_runtime.files` 的 schema v3。此时形成了两条直接消费路径：

- importer 从 bundle 读取 source/package inventory；
- installer 从 manifest 读取同一批文件的简化 install projection；
- manifest 另外用 path + SHA-256 锚定 bundle，contract test 再逐字段要求两份数组相等。

因此，重叠不是后期误复制，而是第一版供应链分层时有意建立的双视图：bundle 承担丰富的 source/install/
dependency contract，manifest 为了让 installer 不理解 bundle 结构，又复制一份最小字段子集。后续加入 local
owned runtimes、installed contracts、successor baseline 和 pristine overlay retirement 时，两份 inventory
一直同步扩展，临时镜像由此固化成长期双写。

<a name="phase-3-8-consumer-findings"></a>

## Consumer findings

- manifest 的 upstream/local file 字段分别是 bundle 对应条目的严格子集，文件 ID 集合完全相同；没有证据表明
  两份 source/install inventory 被允许独立变化。
- importer 直接消费 bundle；installer 的 install、doctor、repair、unknown-drift blocker 与 installed-manifest
  生成都汇聚到 manifest-derived `sourceRuntimeFiles()`。
- installed manifest 的 `runtime_files` 是已安装状态快照，Release artifact 的 `entries` 是 ZIP entry allowlist；
  它们属于不同生命周期，不是本次应删除的重复 source authority。
- Release builder 只把 manifest 与 bundle 当作被 allowlist 固定的字节，不解释两者内部 runtime inventory。
- installer 当时并不读取 bundle，也不在运行时验证 manifest 中的 bundle SHA；该缺口决定了 authority 迁移
  不能只是把 `require()` 的目标文件换掉。

<a name="phase-3-8-option-decision"></a>

## Options and decision

- **Manifest authority — NO_GO。** 改 installer 最少，但会逆转 Phase 1 把 bundle 定义为 machine source of truth
  的原始职责，继续让 manifest 混合 provenance、integrity 与 inventory；未来新增 runtime 仍需跨文件 join。
- **Bundle authority — CONDITIONAL_GO。** bundle 已是 source/package/installed path、hash、mode、origin 与
  dependency 的严格超集；manifest 收敛为 upstream provenance + integrity index 后，importer 与 installer
  可以消费同一份 runtime inventory。这是选定路线，但本 interlude 不授权实施。
- **Generated mirror — 不作为终态。** generator 可以消除人工双写，却仍在 package 中保留两份 machine fact，
  并新增生成时序和 source/ZIP drift 风险。
- **第三份 shared inventory contract — 拒绝。** bundle 已经是所需超集；再增加合同只会增加 hash edge 和 join，
  没有形成更清晰的 authority。

选定的职责边界是：manifest 保留 upstream/Skill provenance、bundle exact path + SHA、非重复 contract integrity、
importer 与 license/notice provenance；bundle 独占两项 local runtime、四项 upstream runtime 与两项 installed
contract 的 inventory。adapter、notice 构成的 installer envelope、installed-state snapshot 与 Release ZIP
inventory 继续各守原有生命周期。

<a name="phase-3-8-trust-chain"></a>

## Required trust chain

未来若实施 bundle authority，consumer 必须按以下顺序 fail closed：

```text
trusted Git/ZIP bytes
  -> manifest bundle {path, sha256}
  -> verify raw bundle bytes before parse/use
  -> validate bundle schema/path/id/hash/mode/dependency
  -> importer source inventory / installer source projection
  -> installed-manifest runtime_files snapshot
  -> doctor/repair exact drift comparison
```

不能直接加载 bundle 后信任其自报 hash；否则攻击者可以同时篡改文件内容和 bundle 中的 expected hash。所有
bundle missing、raw SHA mismatch、invalid schema、unsafe/duplicate path 或 ID、invalid mode/hash、unknown
dependency 都必须在 acquire、backup 或 write 之前失败。

<a name="phase-3-8-completed-discovery"></a>

## Completed discovery

- 冻结了四类 inventory 的生命周期：只合并 bundle source inventory 与 manifest install projection，保留
  installed-state snapshot 和 Release entry allowlist。
- 冻结了后续最小实施顺序：先加 bundle integrity/unsafe inventory/upgrade-rollback failing-first guards，再迁移
  importer/installer consumer，最后原子删除 manifest mirrors 并更新 schema/hash/docs。
- 冻结了兼容条件：四个 pristine upstream runtime、两个 owned runtime、两个 installed contracts、installer
  最终文件集合、Host ABI、trusted graph、production dispatch 与行为必须逐项不变。
- 冻结了回滚要求：证明既有安装可被新版本完整替换，并能使用既有 immutable installer/assets 回退；doctor
  不能把版本升级误当成普通 repair。

<a name="phase-3-8-acceptance-conclusion"></a>

## Acceptance conclusion

历史和现行 consumer map 足以证明：两份 source/install inventory 是同一事实的丰富视图与简化投影，长期双写
没有独立业务语义；bundle authority 能以最少的新概念恢复单一 machine authority。该结论只关闭路线选择，
没有交付 schema migration、verified bundle loader、installer/importer 改造、Linux/Cloud 验收或 Release gate。

<a name="phase-3-8-explicit-non-goals"></a>

## Explicit non-goals

- 不在本 interlude 修改 manifest、bundle、importer、installer、runtime 或 Release allowlist/hash。
- 不删除 `ledger-summary.sh`，也不改变其未来 Phase 4 条件路径。
- 不合并 installed manifest 或 Release artifact inventory；它们不是重复 source authority。
- 不顺手重构 bundle 的 upstream provenance block；若仍需去重，应另开独立 gate。
- 不激活 Phase 4，也不替代 Phase 9 到来时必须重新执行的 Release Discovery 与 closure。

<a name="phase-3-8-successor-inheritance"></a>

## Successor inheritance

后继实施 gate 继承 bundle authority 的条件性决策和上述 fail-closed trust chain，但不继承实施授权。只要 runtime
集合与行为保持不变，该迁移和未来 Phase 4～9 主路线没有功能冲突；未来新增已准入 runtime 时只需进入 bundle
这一 inventory authority，但仍必须经过对应 Product Phase、Cloud 与 Release gate。

<a name="phase-3-8-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/033a82b88579ff866011f92447a69747941f1b30)

该链接只证明双 inventory 初次共同引入时的历史字节；本 interlude 的路线选择不等于实施，当前 contract 与行为
仍以当前仓库 authority 为准。
