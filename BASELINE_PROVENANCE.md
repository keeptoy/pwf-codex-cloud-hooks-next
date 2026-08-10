# 基线与来源证明

本文件是持续维护的**冷证据账本**，只回答“已发布代码与不可变资产从哪里来、如何复现，以及哪些
精确证据支撑仓库的来源链”。冷不等于文件永远不变：索引可以在新证据闭合后新增或轮换精选入口；
已经登记的 tag、source、ZIP/bootstrap 字节、SHA 和 acceptance identity 不得随当前角色变化而改写。

架构共识及当前实现理由以 [`ARCHITECTURE.md`](ARCHITECTURE.md) 和 machine contracts 为准；版本变化
摘要见 [`CHANGELOG.md`](CHANGELOG.md)，programme/lifecycle 角色只见 [`ROADMAP.md`](ROADMAP.md)。本文件
不承担开发目标、角色窗口或测试流水账，也不为每个普通 patch 无限追加资产表。

## 1. 已发布身份账本

以下条目按同一 immutable identity 结构登记，不区分“当前”与“历史”身份。是否继续作为开发、回滚或
发布角色由 ROADMAP 决定；从本索引轮换出去的完整字节仍由对应 tag、Release 和 exact acceptance 恢复。

| 发布身份 | source 与验收 | package identity | bootstrap identity | 持久证据意义 |
|---|---|---|---|---|
| `v0.3.3` | [Release](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.3)；[source `a1b9f4548e3b6e071fee611270365c8ecf3f8d13`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/a1b9f4548e3b6e071fee611270365c8ecf3f8d13)；[exact dual-channel Cloud acceptance](docs/v0.3.3-cloud-hard-acceptance.md) | `pwf-codex-cloud-hooks-v0.3.3.zip`；21 entries；74,198 bytes；SHA-256 `2b2dca5c5894a2297a6f2ccc5fb190878c3c920b71148719a4873326b4ccb352` | `init-cloud-sandbox-v0.3.3.bash`；21,565 bytes；SHA-256 `236e364bde8397b04c9d7ebfa121fa96963055d77b56e6299e6b9c9aad6c887e` | 退休不可达 catch-up overlay supply-chain；公开双资产复核、R5-PR Cloud hard acceptance 与独立 baseline promotion 已完成 |
| `v0.3.2` | [Release](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.2)；[source `c68a53bdeab7c38badcfb4e2a733ddd851e498e4`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/c68a53bdeab7c38badcfb4e2a733ddd851e498e4)；[exact acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/1b668b4af8691c5685b5cd94d10002ff757e2971/docs/v0.3.2-cloud-hard-acceptance.md) | `pwf-codex-cloud-hooks-v0.3.2.zip`；23 entries；82,627 bytes；SHA-256 `b42aecafaba650e5595acef8c138d142747da38dde04fa78bfb0a7f4235e5081` | `init-cloud-sandbox-v0.3.2.bash`；21,565 bytes；SHA-256 `aa2c1fd64bfc8ee3804d5f4bf39f7816a2ca9ad9a96949336ec94a6c20f8f77c` | 完成兼容、供应链和仓库治理收口，并冻结双通道 Cloud hard acceptance |
| `v0.3.1` | [Release](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.1)；[source `9aa2148886e499f9f45594f7ae4f7681f1045de2`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/9aa2148886e499f9f45594f7ae4f7681f1045de2)；[exact acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/435f830577ded23f8509a7befb95e8ba5128924f/docs/v0.3.1-cloud-hard-acceptance.md) | `pwf-codex-cloud-hooks-v0.3.1.zip`；23 entries；82,725 bytes；SHA-256 `f097b04015b1a3847ca5a24b9236f882c5a008b22033793b5661e282c39131f9` | `init-cloud-sandbox-v0.3.1.bash`；21,565 bytes；SHA-256 `ce31a32002aea46bbf3f9baf9a0e93451d24c3b3653952e425d1e1ff6960a5e8` | 建立兼容与供应链安全基线；完整字节继续由 immutable Release 恢复 |
| `v0.3.0` | [Release](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.0)；[source `1454c9224c83d11c073b05baf6e536a11c3bb0e5`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/1454c9224c83d11c073b05baf6e536a11c3bb0e5)；[exact acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/1454c9224c83d11c073b05baf6e536a11c3bb0e5/docs/v0.3.0-cloud-hard-acceptance.md) | `pwf-codex-cloud-hooks-v0.3.0.zip`；22 entries；75,386 bytes；SHA-256 `f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af` | `init-cloud-sandbox-v0.3.0.bash`；17,423 bytes；SHA-256 `ab334f0367d948fa29a2bdd37bff0c220929aeb320fdf59dbacbd5a4021b39c0` | successor 首个 stable；保留 canonical runtime 与 `PWF_GLOBAL_HOOK_CANARY_V1` |
| `v0.3.0-beta.2` | [旧仓库 Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.3.0-beta.2)；[source `bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b`](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b)；tree `ff49c3c6656386e94450ccb24437a1c2d1c50e95`；[exact acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/cde4b15bba7ed8580cb774c8b8bb259c9174c3d0/docs/v0.3.0-beta.2-cloud-hard-acceptance.md) | [`pwf-codex-cloud-hooks-v0.3.0-beta.2.zip`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-beta.2/pwf-codex-cloud-hooks-v0.3.0-beta.2.zip)；22 entries；84,572 bytes；SHA-256 `812cc9cdcafa93b5fcc47cc763fd743f11be77958b75eea1fa4cf0508dd391ab` | [`init-cloud-sandbox-v0.3.0.bash`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-beta.2/init-cloud-sandbox-v0.3.0.bash)；17,425 bytes；SHA-256 `d572b77d920b34c34c7912ba364376ae3668216f00ce350251bd7c8b336abcd6` | successor 迁移采用的产品基线与行为 oracle；不重新发布或改写相同 identity |
| `v0.3.0-beta.1` | [旧仓库 Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.3.0-beta.1)；[tag source `068e44c16811fa65364535248ae8b492ab915643`](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/068e44c16811fa65364535248ae8b492ab915643)；[exact acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks/blob/068e44c16811fa65364535248ae8b492ab915643/docs/v0.3.0-beta.1-cloud-hard-acceptance.md) | [`pwf-codex-cloud-hooks-v0.3.0-beta.1.zip`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-beta.1/pwf-codex-cloud-hooks-v0.3.0-beta.1.zip)；22 entries；84,316 bytes；SHA-256 `c9dd8bf5dea0f50662df0a15d653584b7d9a6f1f0329dfc3c2d55fe33a366f91` | [`init-cloud-sandbox-v0.3.0.bash`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-beta.1/init-cloud-sandbox-v0.3.0.bash)；17,425 bytes；SHA-256 `0c9d57f53ff980d9d207bc8291b1f055058000e45258732b19156ec93b8b1f2a` | Phase 1～3 的首个 canonical 完整闭环；Cloud A～F、双 runtime、doctor 与零 snapshot residue PASS |
| `v0.3.0-alpha.2` | [旧仓库 Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.3.0-alpha.2)；[tag source `efbcaafef253d97c35dbd4ed080fca2aac82648f`](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/efbcaafef253d97c35dbd4ed080fca2aac82648f)；[exact acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks/blob/efbcaafef253d97c35dbd4ed080fca2aac82648f/docs/v0.3.0-alpha.2-cloud-hard-acceptance.md) | [`pwf-codex-cloud-hooks-v0.3.0-alpha.2.zip`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-alpha.2/pwf-codex-cloud-hooks-v0.3.0-alpha.2.zip)；65,989 bytes；SHA-256 `61f2001f3dd3934d79144d5f1be09385a55936aba9f7481ad5e2177a486059db` | [`init-cloud-sandbox-v0.3.0.bash`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-alpha.2/init-cloud-sandbox-v0.3.0.bash)；17,426 bytes；SHA-256 `9328748023b401df8d4cbf98c48b2885978ba074654c94a09a46cae264c2869d` | 首次激活 repository-owned catch-up；pristine global Skill、adapter-only policy 与真实 Fresh/Resume PASS |
| `v0.3.0-alpha.1` | [旧仓库 Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.3.0-alpha.1)；[tag source `033a82b88579ff866011f92447a69747941f1b30`](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/033a82b88579ff866011f92447a69747941f1b30)；[pre-release smoke（非 exact acceptance）](https://github.com/keeptoy/pwf-codex-cloud-hooks/blob/033a82b88579ff866011f92447a69747941f1b30/docs/v0.3.0-alpha.1-cloud-smoke.md) | [`pwf-codex-cloud-hooks-v0.3.0-alpha.1.zip`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-alpha.1/pwf-codex-cloud-hooks-v0.3.0-alpha.1.zip)；59,097 bytes；SHA-256 `94fe21837d26bbe07d23cdf88b89133c12e6f431eafd8c412ece96204f6a5027` | [`init-cloud-sandbox-v0.3.0.bash`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-alpha.1/init-cloud-sandbox-v0.3.0.bash)；18,699 bytes；Release server SHA-256 `17e2248d04027001a929dbc07fcf06c6f4a9cb727530fcdb99edbcc4e90fba32` | 建立 inactive owned inventory/contracts；smoke 中 bootstrap SHA 与服务器资产不一致，故不宣称 exact acceptance |
| `v0.2.2` | [旧仓库 Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.2.2)；[tag source `216f2cec2dab3ac9e6bae91924aa237a97bf6c46`](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/216f2cec2dab3ac9e6bae91924aa237a97bf6c46)；[Cloud A～F 功能验收记录](https://github.com/keeptoy/pwf-codex-cloud-hooks/blob/216f2cec2dab3ac9e6bae91924aa237a97bf6c46/.planning/2026-08-01-v0.2.2-cloud-catchup-compatibility/progress.md) | [`pwf-codex-cloud-hooks-v0.2.2.zip`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.2.2/pwf-codex-cloud-hooks-v0.2.2.zip)；23 entries；105,741 bytes；SHA-256 `71d2ac8e073c49a6a75e4b649f1d9687b6eb9c5c51e525db72c505e69c353d84` | ZIP 内 `pwf-codex-cloud-hooks/init-cloud-sandbox-v0.2.2.bash`；18,691 bytes；SHA-256 `28861dc61b8ba292d37b804d7cd2f542929dac73bbe35860be64eab0ae1fa095`；未发布独立 bootstrap asset | 最早完成完整 Cloud 黑盒验收的过渡功能基线；现场 patch global Skill，尚非 owned canonical architecture |
| `v0.2.1` | [旧仓库 Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.2.1)；[tag source `3c599e445c8cf5a717cdc98d6a4a2d1e3fb62846`](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/3c599e445c8cf5a717cdc98d6a4a2d1e3fb62846)；acceptance：—（未恢复） | [`pwf-codex-cloud-hooks-v0.2.1.zip`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.2.1/pwf-codex-cloud-hooks-v0.2.1.zip)；41,031 bytes；SHA-256 `307ad804153a64a57cbeae7690d41e483f94ad9cde64c0d101f43caaf1ca04e2` | —（未发布独立 bootstrap asset） | 引入 guarded repair、manifest schema v3、增强 doctor/drift 分类与 backup byte restoration；证据来自 Release notes |
| `v0.2.0` | [旧仓库 Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.2.0)；[tag source `eaa0da3abf4f4c8166b6663935e14bf9018c9c51`](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/eaa0da3abf4f4c8166b6663935e14bf9018c9c51)；acceptance：—（未恢复） | [`pwf-codex-cloud-hooks-v0.2.0.tgz`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.2.0/pwf-codex-cloud-hooks-v0.2.0.tgz)；33,840 bytes；SHA-256 `536e416c1fdd58805b4d54dfb09c7fea6bfa8dddbf4e39211d0a13b1b62efd74` | —（未发布独立 bootstrap asset） | 首个成功的 system-managed Cloud Hook 验证原型；成功状态由维护者历史确认，独立 acceptance 未恢复 |
| `v0.1.0` | [旧仓库 Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.1.0)；[tag source `49c2709b3522aada53fbc97ae71d020d6619bb0e`](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/49c2709b3522aada53fbc97ae71d020d6619bb0e)；acceptance：—（未恢复） | [`pwf-codex-cloud-hooks-v0.1.0.tgz`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.1.0/pwf-codex-cloud-hooks-v0.1.0.tgz)；9,914 bytes；SHA-256 `bb274a32d8d118c744a6f30bdc94ec6bcde508c3a4cbcab235d343bef7cb2575` | —（未发布独立 bootstrap asset） | legacy Hook trust 路线的失败 B1 尝试；tag/Release 只证明曾打包，不证明 Cloud 可行 |

“—（未恢复）”表示当前证据集中没有闭合该字段，不证明它历史上绝对不存在，也不允许用后续版本事实补写。
“未发布独立 bootstrap asset”只描述 Release 的运输边界，不等于安装脚本不存在：v0.2.2 的 bootstrap
包含在 ZIP 内；从 v0.3.0-alpha.1 起，账本登记的是 ZIP 外单独发布并校验的 bootstrap asset。
截至 2026-08-10，旧仓库上述八个 Release 的 GitHub `immutable` 标志均为 `false`；本账本以 exact commit、
asset URL、bytes 与 SHA 冻结当前认可身份。若远端 tag 或资产以后漂移，应保留原记录并按供应链事件处理，
不得把新观察静默覆盖成同一历史 identity。

<a name="successor-migration-evidence"></a>

## 2. Successor 迁移不可变证据

本节只固定 `v0.3.0-beta.2` → `v0.3.0` 的 M1～M4 exact refs 与可重放证据，不承担迁移叙事，也不解释
当前 runtime。M1～M4 没有发布 beta.3、改变 production behavior 或授权 Product Phase 4。

successor remote：[`keeptoy/pwf-codex-cloud-hooks-next`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next)。

| 迁移证据 | 不可变 ref | 证明范围 |
|---|---|---|
| M1 exact mirror | [`bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b) | 与 beta.2 commit/tree、资产和 runtime bytes 等价 |
| M2 slim transformation | [`3234e4e02090c838f5ee260cd8f2d99daf358d65`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/3234e4e02090c838f5ee260cd8f2d99daf358d65) | 从 M1 audit tree 选择性构造 parentless slim root，冻结稳定文档边界、repository-wide LF 和四个 executable runtime |
| M3 Cloud equivalence | [`39795283cd65f84547651d7bec816191fb5bfedf`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/39795283cd65f84547651d7bec816191fb5bfedf) | slim successor 的 Linux、Fresh/Resume、doctor 与 package 等价性 |
| M4 repository cutover | [M4-A `cc9bc878ddc7d70c25156dd053e2874758f0814a`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/cc9bc878ddc7d70c25156dd053e2874758f0814a) → [M4-C `0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151) → [closure `c5236958b9830ee3695b0e81e1a0746707a6b8f9`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/c5236958b9830ee3695b0e81e1a0746707a6b8f9) | 完成 authority handoff、default/main/ruleset、旧仓库导航、accepted cutover 与 rollback 验收 |

M2 排除的历史 planning、Phase/Round 文档和 snapshot prototype 仍可在旧仓库与 M1 exact ref 中追溯。
三个 fixture rename 保持原字节：
`adapter-output-managed-legacy.json`、`adapter-output-canonical-plan.json` 和
`session-catchup-cloud-wrapper.jsonl`。

可重放的迁移证据见：

- [M3 exact runbook](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/39795283cd65f84547651d7bec816191fb5bfedf/docs/beta3-dev-m3-cloud-equivalence.md)；
- [M4 exact runbook](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151/docs/beta3-dev-m4-cutover-plan.md)。

## 3. 上游来源

| 项目 | 值 |
|---|---|
| repository | `OthmanAdi/planning-with-files` |
| release | `v3.8.2` |
| commit | `b04ffd9c8f9f93919649d197e5d4ec1bfc06fa14` |
| archive URL | `https://github.com/OthmanAdi/planning-with-files/archive/refs/tags/v3.8.2.zip` |
| archive SHA-256 | `7dab03ae283da38d33b9d551c7ec621d1818b9f0f17cf9ced566d4accbfc6dd1` |
| license | MIT |

`contracts/runtime-bundle-v1.json` 固定 source/package/installed path、direct dependencies、mode、
pristine/managed hashes 和 deferred candidates。`tools/import_upstream_runtime.py` 只接受该 allowlist，
验证 archive、license、pristine source hash、mode 和 destination inventory。

`v0.3.3-dev` 是 `v0.3.3` 的 Source/Candidate 运输身份；R4 已把新的 tag、资产字节、SHA 和 publication
runbook 独立登记到第 1 节。它不继承 v0.3.2 的 overlay package identity，也不因 publication 自动取得
accepted/Latest/rollback 角色。

## 4. Published v0.3.2 owned compatibility overlay（冷证据）

在 immutable v0.3.2 source/package 中，只有 `runtime/upstream/session-catchup.py` 与 pristine upstream
不同，四项 overlay 顺序固定：

1. `PWF_CLOUD_SESSION_STORE_V1`
2. `PWF_CLOUD_RUNTIME_EXPLICIT_V1`
3. `PWF_SCOPED_PLANNING_STATE_V1`
4. `PWF_BOUNDED_WRAPPER_CONTEXT_V1`

| 内容 | SHA-256 |
|---|---|
| pristine session-catchup | `6476fd9024d0cbb9bfb850119fd0beff7fb7cfab9c6683ce10e4cc8d830ce6de` |
| managed session-catchup | `fc765590dc32b3949027de97e33dad6a049daf148719ba1822598a6c146461e2` |

Overlay 只应用到当时的 repository-owned copy；global Skill 始终保持 pristine。该已发布实现从 immutable
v0.3.2 source 的以下路径恢复：

- [`contracts/compatibility-overlays-v1.json`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/c68a53bdeab7c38badcfb4e2a733ddd851e498e4/contracts/compatibility-overlays-v1.json)
- [`patches/patch_planning_skill.py`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/c68a53bdeab7c38badcfb4e2a733ddd851e498e4/patches/patch_planning_skill.py)
- [`upstream-manifest.json`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/c68a53bdeab7c38badcfb4e2a733ddd851e498e4/upstream-manifest.json) 的 compatibility metadata
- [`runtime/upstream/session-catchup.py`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/c68a53bdeab7c38badcfb4e2a733ddd851e498e4/runtime/upstream/session-catchup.py) managed bytes
- v0.3.2 immutable acceptance 与 source 内 importer/contract/patch/Cloud-shaped regression tests

当时的 `upstream-manifest.json.historical_patched_skill_files` 虽然名称带有历史色彩，仍被 patcher 用于
交叉校验 managed hash；它从来不是 global Skill mutation 许可。Successor 在独立 trusted-graph gate 证明
patched CLI branches 不可达并满足四项 retirement condition 后，已从 current source contract 退休可执行
patcher/ledger/patched bytes；历史 package 继续只由上述 immutable refs 证明，不能用 current importer 重建。

## 5. Cloud 与平台证据路由

Cloud 平台观测属于带日期的 fixture/acceptance，不在本文件复制成第二份平台合同：

- 当前已验证的 setup、agent 与 Hook 生命周期语义见
  [`ARCHITECTURE.md` 的 Cloud 生命周期](ARCHITECTURE.md#cloud-lifecycle)；
- machine-shaped 观测见 `tests/fixtures/cloud/hook-observations-v1.json` 与
  `tests/fixtures/cloud/session-catchup-cloud-wrapper.jsonl`；
- 迁移 Cloud 等价性见 M3/M4 专项文档；
- 每个已发布版本的最终字节与 Fresh/Resume 结果见第 1 节链接的 acceptance。

这些证据不把 `/opt/codex` 或任何带日期 Host 观测提升为永久常量；runtime 仍须覆盖显式 Host input、
变量缺失和受控 compatibility fallback。

## 6. 验证来源链

```text
pinned upstream archive + license
  -> runtime-bundle-v1 pristine allowlist + helper entrypoints
  -> deterministic importer
  -> exact pristine runtime/upstream bytes
  -> upstream-manifest contract hashes
  -> installer inventory/doctor
  -> release-artifact-v1 allowlist + deterministic ZIP
  -> external bootstrap checksum
  -> version acceptance
```

任一环节变化都必须更新相应 contract/hash/test，并使用新的 Release identity；不同字节不能借用旧版本
哈希或验收结论证明。
