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

<a name="phase-3-8-design-hindsight"></a>

## 当时这样拆，合理吗

只看 `0.3.0-alpha.1` 当时的局部目标，这个拆法并不荒唐。bundle 要服务 importer，包含 source、package、
installed path、hash、mode 和 dependency 等完整信息；installer 当时只需要其中一小部分。给 installer 一份较小、
较容易读取的投影视图，可以减少首版 consumer 的理解成本。manifest 还保存了 bundle 的 path + SHA，测试也要求
两份数组逐字段相等，所以短期看起来既清楚又安全。

真正遗漏的不是“能不能有投影”，而是没有把投影的地位和退场方式设计完整：

- 文档把 bundle 叫作 machine source of truth，但 installer 仍把 manifest 副本当作直接生产输入；因此 bundle
  只是 importer 的权威，不是整条 source/install 链的唯一权威。
- manifest 中的精简视图不是从 bundle 运行时派生，也不是由 generator 生成的只读产物，而是需要维护者手工
  同步的第二份 machine fact。
- manifest 虽然记录 bundle SHA，installer 当时却不在读取 inventory 前验证这条 hash edge；完整性主要由仓库
  contract test 代为检查，没有形成 consumer 自己的 fail-closed 信任链。
- 测试保护的是“两份字段必须相等”这个结构，没有保护“一个事实只能有一个作者权威”这个架构不变量。它成功
  防止了静默漂移，也同时把双写变成每次改动都必须延续的合同。
- Phase 计划没有给这个过渡投影设置 owner、退休条件和完成门槛。等 local runtime、installed contract 与
  overlay retirement 继续加入后，原本很小的便利视图逐步长成 bundle 镜像，再删除就需要 schema、consumer、
  upgrade/rollback 和 Cloud gate 一起迁移。

所以不能简单说原方案“完全不合理”，也不能归因于后来没有认真执行。更准确的结论是：**它是一个短期合理、
长期闭环不足的过渡设计；后续维护者恰恰严格执行了它，才把过渡结构稳定地保留了下来。** 本次清理是在偿还当时
没有定义单一 authority 和 retirement contract 的设计债，而不是修复一次偶然复制错误。好的一面是，原有 hash
记录和逐字段相等测试避免了两份 inventory 在偿债前悄悄分叉，使后续迁移仍能在保持 installed layout 与行为不变
的前提下完成。

由此得到的经验是：

1. 为了让 consumer 简单而创建投影可以接受，但投影必须明确为派生物；优先让 consumer 读取并校验同一权威，
   其次才是从权威自动生成不可独立编辑的视图。
2. “source of truth” 不能只写在设计文档里；所有生产 consumer 都必须通过可执行的 path/hash/schema 验证链到达
   它，边界测试还要证明旧副本不再被读取。
3. 临时 schema 字段、programme metadata 和兼容投影在引入时就要写明 owner、retirement condition 与退出 gate；
   Phase 完成时检查“该删什么”，不能只检查“新增能力是否通过”。
4. 测试应冻结安全意图和唯一 authority，而不是无期限冻结某次 rollout 的临时形状。若测试只能通过维护两份相同
   数组，应先追问它是在防漂移，还是在替重复设计续命。
5. ROADMAP 可以要求 retirement/DoD，但字段归属不能只靠路线文字。ARCHITECTURE 要定义唯一权威，DESIGN 要标明
   producer/consumer，machine contract 和 production loader 要落实，tests 才能把它变成自动红线。
6. 去重前先按生命周期分类：source authority 应唯一；installed-state snapshot 和 Release artifact allowlist 分别
   服务 drift 与 ZIP 边界，不能因为内容相似就一起删除。

<a name="phase-3-8-governance-landing"></a>

### 这两点怎样真正落地

“ROADMAP 没有 retirement DoD”用大白话说，就是当时的阶段验收只问“新东西是否已经建好并能工作”，没有再问
“为了施工临时加的字段、投影和测试现在该删、该迁还是该长期保留”。就像验收新楼只检查通水通电，却没有把
脚手架、临时电线和施工围挡列入收尾清单。Phase 2/3 完成后没有一个 gate 强制逐项清点临时结构，它们自然会被
下一个版本原样继承。

ROADMAP 的正确落点不是记录每个 JSON 字段，而是为阶段关闭增加一条 retirement DoD：本阶段引入或继承的每个
临时字段、兼容投影、inactive path 和 rollout test，都必须在关闭前被分类为“现在删除”“迁到长期权威”或“明确
保留”；保留项要写 owner、理由、下一次复核条件和恢复证据。清单没有归零或得到明确延期，阶段就只能算功能完成，
不能算治理收口。当前 gate 的 task plan 再把这条宏观要求拆成精确文件、证据和停止条件。

“字段级约束没有落实”用大白话说，就是虽然文档说 bundle 是 source of truth，代码却仍允许 installer 从 manifest
副本拿同一事实，测试还把“两份必须相等”当作正确答案。口头指定了总账，但收银台仍可直接认第二本手抄账；只要
第二本账存在并被生产读取，就还没有唯一权威。

落地时要让每一层各做一件可检查的事：

| 层 | 必须落下的约束 |
|---|---|
| ROADMAP / task plan | 阶段关闭必须完成临时结构清点；当前 gate 冻结删除、迁移、保留集合和证据，不把延期当完成 |
| ARCHITECTURE | 明文规定“同一逻辑事实只有一个 machine authority”，并区分允许保留的 installed snapshot、Release allowlist 等生命周期副本 |
| DESIGN | 列清 producer/consumer map：谁写 bundle，谁只通过 manifest 的 path/SHA 到达 bundle，禁止哪个旧读取路径 |
| machine contracts | manifest exact schema 不再接受 mirror；bundle 独占 inventory；path、SHA、schema、ID、mode、dependency 全部严格校验 |
| production consumers | importer 和 installer 都先校验 bundle 原始字节，再解析同一 inventory；不得 fallback 到退休字段，也不得信任 bundle 自报 hash |
| tests | 删除或篡改旧 mirror 仍应正常工作，mirror 回流必须被拒绝，bundle tamper 必须在任何写入前失败，并继续保护 Phase 4 负向准入与 exact installed set |

这样 ROADMAP 提供“必须收尾”的关卡，架构和设计说明“应该只有哪一本账”，contract 与 consumer 决定“代码实际上
认哪一本账”，测试则负责证明旁路真的走不通。缺少其中任意一层，retirement 都可能重新退化成一句没有执行力的
文档愿望。

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

<a name="phase-3-8-subsequent-landing"></a>

## Subsequent landing

本摘要上文保留的是 Phase 3.8 关闭时“只完成 Discovery、尚未实施”的历史语义。后继兼容 gate 随后在 `v0.3.4`
完成 bundle-authority migration：installer 与 importer 先校验 bundle 原始 SHA 再解析，由 bundle 独占 source/install
inventory；manifest 收敛为 provenance 与 integrity index。installed-state snapshot 和 Release ZIP allowlist 仍按各自
生命周期保留，因此不属于重复 source authority。该后续事实不反向扩大 Phase 3.8 当时的授权。

<a name="phase-3-8-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/033a82b88579ff866011f92447a69747941f1b30)

该链接只证明双 inventory 初次共同引入时的历史字节；本 interlude 的路线选择不等于实施，当前 contract 与行为
仍以当前仓库 authority 为准。
