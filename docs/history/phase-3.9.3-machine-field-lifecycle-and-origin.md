<a name="phase-3-9-3-historical-position"></a>

# Phase 3.9.3：Machine field 生命周期与 `origin` 裁决边界

## Historical position

`Phase 3.9.3` 是 v0.3.5 accepted baseline 之后、本地 `0.4.0-dev` 上 C2 contract-design 讨论继续收敛形成的
**回顾性维护者里程碑**。它承接 Phase 3.9.2 对 overlay tombstone 的复核，进一步回答两个问题：

- `origin=upstream_pristine` 是否必须在 Phase 4 Discovery 前解决；
- 历史字段为什么容易长期残留，以及以后如何给 machine field 建立明确生命周期。

它不是原 programme 的正式 Product Phase，不表示 C2、bundle/manifest/Release v2 或 Phase 4 已实施，也不产生
package identity、Cloud、Release 或远端授权。当前 Next Step 与实现边界仍由活动 planning 管理。

<a name="phase-3-9-3-problem-before"></a>

## Problem before

overlay 退役时保留 `managed_sha256 == pristine_sha256`、空 `overlay_ids` 和固定
`origin=upstream_pristine`，在当时是合理的 fail-closed 迁移措施。真正的生命周期缺口不是“为什么引入”，而是
只记录了引入理由，没有同时记录：

- 谁对字段负责；
- 字段服务哪个 transition window；
- 什么证据成立后必须删除；
- 最迟在哪个 schema 或 Product Phase 重新审核。

缺少这些退出条件后，临时 tombstone 会被 validator 和测试继续固定。后人看到字段被严格断言，容易把“当时有意
保留”误读成“永远有独立安全价值”；测试又因为字段仍存在而继续维护它，最后形成自我延续的合同残留。

`origin` 是最直接的例子。当前 bundle 已把上游文件放在 `files`、本地 owned runtime 放在 `local_files`，同时又为
每个 entry 重复写固定来源标签。若 v2 进一步把前者明确命名为 `upstream_files`，并已有严格 path、hash、mode 与
dependency admission，来源可能已经由结构完整表达。

<a name="phase-3-9-3-core-decisions"></a>

## Core decisions

1. **`origin` 不阻塞 Phase 4 Discovery。** Phase 4 先决定新 upstream scripts、owned wrappers、source-only schemas
   与 installed contracts 的准入分区；`origin` 是这个架构决定的下游字段，不应反过来先决定整体路线。
2. **v1 原样保留。** accepted v0.3.5 的 schema、字段和字节不可原位改写；当前讨论不削弱 v1 validator。
3. **给 `origin` 一个有截止点的待审状态。** 不是无限期 `KEEP`，也不是在未知 Phase 4 shape 时立即删除。
4. **v2 首选由结构表达来源。** 若 `upstream_files` / `local_files` 分区、受限 roots、单一 pristine hash、mode 与
   dependency 已充分表达准入，首选删除固定 `origin` 常量。
5. **结构兜不住时可以重新贴标签。** 若未来确实需要在同一集合混合多种来源，而且 importer、installer 或 runtime
   会根据来源采取不同行为，可以在新的 schema/gate 中重新引入 `origin` 或更准确的 source-kind 字段；不能通过
   unknown field 或普通 patch 静默恢复。
6. **字段是否保留看真实 consumer。** “看起来更安全”“方便解释”或“以后也许有用”都不能单独成为 machine JSON
   的永久 owner。纯说明信息应迁到文档；会改变 acquire、validate、install 或 dispatch 行为的信息才留在 contract。

<a name="phase-3-9-3-origin-lifecycle"></a>

## Current lifecycle state for `origin`

| 项目 | 当前结论 |
|---|---|
| 当前 v1 行为 | 保留并继续按现行 exact schema 校验，不修改 accepted baseline |
| 生命周期状态 | `DEFERRED_WITH_REVIEW_TRIGGER` |
| 临时 owner | runtime source-admission contract，而不是 overlay 反复活叙事 |
| 复核触发点 | Phase 4 Discovery 冻结 source/inventory shape 时 |
| 最迟裁决点 | contract v2 implementation 之前 |
| 首选方向 | 明确 `upstream_files` / `local_files` 分区后删除重复常量 |
| 保留条件 | 同一 machine collection 确实混合多种来源，且 production consumer 根据来源改变处理行为 |
| 删除后的安全证据 | exact schema、受限 paths、pinned archive、pristine hash、byte equality、dependency/mode 与 exact inventories |
| 未来恢复条件 | 新需求证明结构不足，经 schema version、Discovery、tests、Linux/Cloud、rollback 与 Release gate 显式加入 |

因此“大概率先删除”的完整含义是：v2 设计默认不携带重复标签，先让结构和可执行 contract 说清来源；只有真实
consumer 证明结构表达不足时，才重新引入一个有行为语义的来源字段。这是可逆的 schema 演进，不是把未来路线
永久封死。

<a name="phase-3-9-3-minimum-field-lifecycle"></a>

## Minimum lifecycle table for machine fields

以后新增或复核 machine field，至少要回答下表；字段 decision table 应留在对应活动 Discovery，稳定规则只提升到
既有治理 authority，不能再把生命周期说明塞回 machine JSON 制造新的自描述 metadata。

| 必填项 | 必须回答的问题 |
|---|---|
| field / contract | 字段属于哪个 schema 和 exact key 层级 |
| introduced because | 它解决了什么真实问题，还是只服务一次迁移 |
| owner | 哪个组件或 gate 对其语义负责 |
| producer / validators | 谁写入，谁校验 shape 与关系 |
| behavioral consumer | 哪段 production 逻辑会根据它改变 acquire/install/dispatch 行为 |
| lifecycle class | `PERMANENT_CONTRACT`、`TRANSITIONAL_TOMBSTONE`、`DEFERRED_WITH_REVIEW_TRIGGER`、`RETIRE_NEXT_SCHEMA` 或 `HISTORICAL_ONLY` |
| transition window | 临时字段覆盖哪些来源版本或安装状态 |
| review trigger / latest gate | 哪个事件触发复核，最迟在哪个 schema/Phase 前裁决 |
| retirement evidence | 哪些测试、迁移或替代 contract 成立后必须删除 |
| replacement / recovery | 删除后由什么证据保护；未来确有需要时如何经新 schema 恢复 |

这张表的目的不是增加 paperwork，而是让“为什么加”和“什么时候删”同时出现。尤其 tombstone、兼容字段和
防患型字段必须自带 sunset condition；没有退出条件的临时安全措施不应进入下一 schema。

<a name="phase-3-9-3-programme-impact"></a>

## Impact on Phase 4 through Phase 9

- **Phase 4：**适合现在开始 Discovery。它首先冻结 attestation、nonce、opt-in v3 modes 所需的 upstream/local、
  source-only/installed 分区和 runtime admission；随后按实际 shape 裁决 `origin`。
- **Phase 5～8：**compaction、tool/permission、advisory completion 与 optional hard Stop 主要改变 Host event、ABI、
  dispatch 和失败语义，没有证据要求为它们永久保留 `origin=upstream_pristine`。
- **Phase 9：**只做对应版本列车的 Release 收口，不应拖到这里才决定 schema 字段。`origin` 最迟必须在 v2
  implementation 前关闭取舍。

推荐顺序保持不变：先在 C2 把 `origin` 记为有期限的 deferred decision，再进入 Phase 4 Discovery；两轮 Discovery
共同冻结 source-admission shape，之后决定 C2 foundation 是否作为 `0.4.0-alpha.*` 中独立、未激活的 gate 落地。
contract foundation PASS 仍不自动授权 Phase 4 behavior activation。

<a name="phase-3-9-3-acceptance-conclusion"></a>

## Acceptance conclusion

本轮讨论确认：进入 Phase 4 Discovery 不需要先为 `origin` 选择永久保留或立即删除。所需的闭合不是字段最终值，
而是为它建立明确 owner、review trigger、删除/保留条件和最迟裁决 gate。

同时确认，当前代码生命周期问题应准确表述为：迁移时的 tombstone 设计合理，但缺少 sunset/retirement condition；
不能因此否定当时的安全取舍，也不能让历史理由自动变成永久 machine contract。

本文只关闭生命周期治理与裁决时点的认识复核，没有证明 v2 schema、Phase 4 source admission、runtime behavior 或
Cloud/Release 已经通过。

<a name="phase-3-9-3-explicit-non-goals"></a>

## Explicit non-goals

- 不修改 v1 bundle、manifest、importer、installer、builder、tests 或 Release inputs。
- 不立即删除或保留 v2 `origin`；最终结果由 Phase 4 source-admission evidence 决定。
- 不创建 `0.4.0-*` package/machine identity，不启用 attestation、nonce、v3 modes 或新 Hook event。
- 不把字段生命周期表变成另一份 machine contract，也不为每个字段建立新的永久文档副本。
- 不用“未来可以重新添加”降低 schema version、exact validation、rollback 或 Release gate。

<a name="phase-3-9-3-successor-inheritance"></a>

## Successor inheritance

后续 Phase 4 Discovery 应在第一轮 source-admission inventory 中使用上述生命周期表，并在冻结 runtime bundle v2
shape 时关闭 `origin` 取舍。默认路线是结构优先、删除重复常量；若结构无法表达真实的多来源行为，再以新的
schema 和明确 consumer 恢复标签。

后续所有 compatibility/tombstone 设计都应同时带入 owner、transition window、review trigger、retirement evidence
和 latest decision gate，避免临时字段再次因测试固化而失去退出路径。

<a name="phase-3-9-3-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/a15aa06ab85a5c519d7afa6dc8f40bdf0bc99998)

该链接只证明本轮讨论开始时的仓库状态，不解释当前实现；当前 contract、programme、授权与行为以当前仓库
authority 为准。
