<a name="phase-3-9-2-historical-position"></a>

# Phase 3.9.2：Contract v2 tombstone 与验证边界复核

## Historical position

`Phase 3.9.2` 是 v0.3.5 成为 accepted baseline、仓库切出本地 `0.4.0-dev` 探路分支后形成的
**回顾性 contract-design 讨论里程碑**。它不是原 programme 的正式 Product Phase，不对应已经落地的
bundle/manifest/Release v2，也不授权 Phase 4、package identity、Cloud 或 Release。

本文保存的是 C2 Discovery 中一次关键认识修正：overlay 退役时有意留下 fail-closed tombstone，能够解释
v1 的历史形状，但不能仅凭“当时是有意的”取得 v2 的永久 owner。当前 contract、programme、授权与实现仍以
根级 ARCHITECTURE、DESIGN、ROADMAP、machine contracts 和活动 planning 为准。

<a name="phase-3-9-2-problem-before"></a>

## Problem before

overlay 退役后，runtime bundle 的每个 upstream entry 仍保留：

- `managed_sha256 == pristine_sha256`；
- `overlay_ids=[]`；
- `origin=upstream_pristine`。

importer 和 installer 严格校验这些值，相关测试还逐名拒绝旧 overlay 字段、旧 patcher path 与旧 overlay
contract path。历史复核证明它们不是随手留下的死字段，而是当时为了在不立即升级 schema 的情况下 fail closed
而保留的迁移 tombstone。

最初的 C2 解释进一步认为：v2 删除这些字段后仍应使用 exact-key 和专用 negative guards，持续证明 overlay
不能复活。问题在于，这把三种不同职责混到了一起：machine schema 完整性、当前 pristine 供应链事实，以及未来
是否允许重新选择 overlay 的架构治理。它还隐含了一个不准确前提——需要用测试防止维护者或大模型“无意做出”
overlay 架构选择。

<a name="phase-3-9-2-core-decisions"></a>

## Core decisions

1. **历史动机不等于永久 owner。** tombstone 在 v1 transition 中有明确作用，但迁移闭合后，如果字段不再表达
   可变化状态、没有独立 consumer，就应在新 schema 中退休。
2. **exact-key 是通用 schema 规则。** 它用于拒绝未知、拼错或漂移字段，避免 consumer 静默忽略 machine input；
   它不应被解释成 overlay 专用防线，也不需要为每个退休字段永久保留一条专用测试。
3. **当前路线用正向事实证明。** pinned archive、raw bundle SHA、受限 source/package/installed roots、单一
   pristine hash、imported/package bytes 与 upstream bytes 相等，共同证明当前 source/import/install 路径没有
   transformation。
4. **架构选择由 Discovery 管理。** private snapshot + pristine upstream 是当前已确认路线。只有真实 Linux/Cloud
   证据证明 snapshot 无法满足文件语义、权限或有界清理时，才能重新 Discovery 评估 overlay。当前路线不得被普通
   patch 静默替换，但也不应被历史测试写成“未来永远禁止重新评估”。
5. **测试证明合同，不负责约束模型思考。** 真正恢复 overlay 必须同时修改 importer、installer、hash projection、
   bundle schema、Release inputs 与 tests；一个空字段不会自行激活能力。代码评审和 gate 决定路线，测试负责证明
   获批路线的可执行不变量。

<a name="phase-3-9-2-field-disposition"></a>

## Field and guard disposition

| 对象 | Phase 3.9.2 结论 | 长期证据 |
|---|---|---|
| upstream `managed_sha256` | v2 删除；所有 operational reads 原子迁到 `pristine_sha256` | archive/package/destination bytes 只与 pristine hash 比较 |
| upstream `overlay_ids` | v2 删除；不建立 overlay 专用永久字段 | 通用 exact-key validator 拒绝任意 unknown entry field |
| `origin=upstream_pristine` | 继续复核，不因措辞积极而自动保留 | 若采用明确 `upstream_files` 分区、受限 roots 与 pristine hash，固定 origin 常量可能重复 |
| 旧 manifest overlay 字段 absence guards | v2 exact top-level/nested schema 建立后退休逐名 guard | 通用 unknown/missing-key tests |
| 两个旧 patcher/overlay contract path 的多处 ZIP absence assertions | 删除重复逐名断言；不把历史路径变成永久合同 | exact trusted source inventory、Release allowlist 与 imported byte equality |
| “managed/pristine helper closure 相等”行为测试 | 保留，但标题改成路线中性描述 | helper closure equality 与 bounded import-time surface |
| notice 不得声称 applied overlay | 保留事实准确性或改写为正向 pristine 断言 | 当前 notice 与 packaged bytes 的真实来源一致 |

`origin` 的最终去留尚未由本里程碑冻结。若 v2 继续使用模糊的 `files` 分区，显式 trust label 仍有可读性；若
分区改名为 `upstream_files` 且严格路径/hash 已完整表达来源，则固定 origin 值更像重复 machine metadata。
判断标准仍是是否存在独立 consumer，而不是字段看起来是否“更安全”。

<a name="phase-3-9-2-validation-model"></a>

## Revised validation model

建议的 v2 证据层次是：

```text
manifest exact schema + anchored raw bundle SHA
  -> bundle exact schema + safe roots/IDs/modes/dependencies
  -> pinned archive member SHA == pristine_sha256
  -> repository package bytes == pinned pristine bytes
  -> installed bytes == package/pristine bytes
  -> exact trusted source/install/ZIP inventories
```

这条链不需要 `managed_sha256`、空 `overlay_ids` 或一串旧文件名才能 fail closed。旧 key 若进入 v2，会和任何
其他 unknown key 一样在解析阶段被拒绝；源码若真的加入 transformation，即使换了全新名字，也会被 byte equality、
inventory、hash 和行为测试暴露。相比逐个记住历史名字，这种正向 contract 更少、更强，也更适合后续审计。

专用 absence guard 只应在 transition window 内保留，直到新 exact schema 与正向行为测试已经建立。完成替代后，
继续锁定旧字段名或路径只会增加测试重复，并让后人误以为 overlay 是被永久禁止的架构，而不是一个必须重新取得
证据和授权的备选路线。

<a name="phase-3-9-2-broader-c2-boundary"></a>

## Broader C2 boundary

本次修正不推翻 C2 的其他主要发现：

- manifest 仍应评估删除无 consumer 的 `skill_version`，并补顶层 exact-key validation；
- Release v2 仍应把 entry mode 变成唯一 machine authority，删除 builder 的 `EXECUTABLE_PATHS`；
- Release `state/origin/reason/checksum_workflow` 仍应按“严格消费或迁出 JSON”逐项处理；
- `language`、`host_dependencies`、installed plan schemas 与 source-only catch-up schemas 仍可能与 Phase 4
  admission/ABI 有关，不在本讨论中提前删除；
- bundle、manifest schema 与 Release contract 的实际旋转仍需独立 implementation、rollback、Linux/Cloud 与
  Release gate，不能由本文直接授权。

<a name="phase-3-9-2-acceptance-conclusion"></a>

## Acceptance conclusion

源码调用图、现有 contracts、overlay retirement history 与 ARCHITECTURE 的长期 invocation boundary 足以证明：
当前 production 没有 overlay/patcher path，snapshot 是明确选择，不存在一个字段会让大模型或 runtime 自动恢复
overlay。长期安全应依赖通用 exact schema、正向 pristine byte contract、exact inventory 和显式 Discovery gate，
而不是永久保存迁移 tombstone 与历史名称黑名单。

本文只关闭这项设计认识的复核，不表示 C2 全部字段取舍已经完成，也不表示 v2 已实施或通过测试、Cloud、Release。

<a name="phase-3-9-2-explicit-non-goals"></a>

## Explicit non-goals

- 不修改 runtime bundle、manifest、importer、installer、builder、tests 或 Release inputs。
- 不建立 `0.4.0-*` package/machine identity，不激活 Phase 4。
- 不把 overlay 声明为永远禁止；只有新的 Discovery 与证据可以改变当前 snapshot 路线。
- 不因删除 tombstone 建议而弱化 raw SHA、pristine byte equality、safe path、exact inventory 或 rollback gate。
- 不在本里程碑冻结 `origin`、`language`、`host_dependencies` 或 installed schema 的最终去留。

<a name="phase-3-9-2-successor-inheritance"></a>

## Successor inheritance

后续 C2 应继承一个更简单的判断准则：machine JSON 中的字段必须有独立 consumer 或明确的可变化语义；迁移
tombstone 在 transition 完成后退休；安全意图优先由正向、可执行、与名字无关的 contract 证明。未来若重新评估
overlay，必须显式改变 ARCHITECTURE/trusted graph 并重新经过 Discovery、Linux/Cloud、rollback 与 Release gate，
不能借普通兼容修复进入。

<a name="phase-3-9-2-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/56ecc5bc30e44313676ea83a20dc3b59570b9b7e)

该链接只证明本次 C2 tombstone 观点复核的来源状态，不解释当前实现；当前 contract、programme、授权与行为以
当前仓库 authority 为准。
