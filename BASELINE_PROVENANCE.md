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

| 发布身份 | source 与验收 | ZIP identity | bootstrap identity | 持久证据意义 |
|---|---|---|---|---|
| `v0.3.2` | [Release](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.2)；[source `c68a53bdeab7c38badcfb4e2a733ddd851e498e4`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/c68a53bdeab7c38badcfb4e2a733ddd851e498e4)；[exact acceptance](docs/v0.3.2-cloud-hard-acceptance.md) | `pwf-codex-cloud-hooks-v0.3.2.zip`；23 entries；82,627 bytes；SHA-256 `b42aecafaba650e5595acef8c138d142747da38dde04fa78bfb0a7f4235e5081` | `init-cloud-sandbox-v0.3.2.bash`；21,565 bytes；SHA-256 `aa2c1fd64bfc8ee3804d5f4bf39f7816a2ca9ad9a96949336ec94a6c20f8f77c` | 完成兼容、供应链和仓库治理收口，并冻结双通道 Cloud hard acceptance |
| `v0.3.1` | [Release](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.1)；[source `9aa2148886e499f9f45594f7ae4f7681f1045de2`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/9aa2148886e499f9f45594f7ae4f7681f1045de2)；[exact acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/435f830577ded23f8509a7befb95e8ba5128924f/docs/v0.3.1-cloud-hard-acceptance.md) | `pwf-codex-cloud-hooks-v0.3.1.zip`；23 entries；82,725 bytes；SHA-256 `f097b04015b1a3847ca5a24b9236f882c5a008b22033793b5661e282c39131f9` | `init-cloud-sandbox-v0.3.1.bash`；21,565 bytes；SHA-256 `ce31a32002aea46bbf3f9baf9a0e93451d24c3b3653952e425d1e1ff6960a5e8` | 建立兼容与供应链安全基线；完整字节继续由 immutable Release 恢复 |
| `v0.3.0` | [Release](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.0)；[source `1454c9224c83d11c073b05baf6e536a11c3bb0e5`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/1454c9224c83d11c073b05baf6e536a11c3bb0e5)；[exact acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/1454c9224c83d11c073b05baf6e536a11c3bb0e5/docs/v0.3.0-cloud-hard-acceptance.md) | `pwf-codex-cloud-hooks-v0.3.0.zip`；22 entries；75,386 bytes；SHA-256 `f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af` | `init-cloud-sandbox-v0.3.0.bash`；17,423 bytes；SHA-256 `ab334f0367d948fa29a2bdd37bff0c220929aeb320fdf59dbacbd5a4021b39c0` | successor 首个 stable；保留 canonical runtime 与 `PWF_GLOBAL_HOOK_CANARY_V1` |
| `v0.3.0-beta.2` | [旧仓库 Release](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.3.0-beta.2)；[source `bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b`](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b)；tree `ff49c3c6656386e94450ccb24437a1c2d1c50e95`；[exact acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/cde4b15bba7ed8580cb774c8b8bb259c9174c3d0/docs/v0.3.0-beta.2-cloud-hard-acceptance.md) | [`pwf-codex-cloud-hooks-v0.3.0-beta.2.zip`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-beta.2/pwf-codex-cloud-hooks-v0.3.0-beta.2.zip)；22 entries；84,572 bytes；SHA-256 `812cc9cdcafa93b5fcc47cc763fd743f11be77958b75eea1fa4cf0508dd391ab` | [`init-cloud-sandbox-v0.3.0.bash`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-beta.2/init-cloud-sandbox-v0.3.0.bash)；17,425 bytes；SHA-256 `d572b77d920b34c34c7912ba364376ae3668216f00ce350251bd7c8b336abcd6` | successor 迁移采用的产品基线与行为 oracle；不重新发布或改写相同 identity |

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
验证 archive、license、anchor、mode 和 destination inventory。

## 4. Owned compatibility overlay

只有 `runtime/upstream/session-catchup.py` 与 pristine upstream 不同。四项 overlay 顺序固定：

1. `PWF_CLOUD_SESSION_STORE_V1`
2. `PWF_CLOUD_RUNTIME_EXPLICIT_V1`
3. `PWF_SCOPED_PLANNING_STATE_V1`
4. `PWF_BOUNDED_WRAPPER_CONTEXT_V1`

| 内容 | SHA-256 |
|---|---|
| pristine session-catchup | `6476fd9024d0cbb9bfb850119fd0beff7fb7cfab9c6683ce10e4cc8d830ce6de` |
| managed session-catchup | `fc765590dc32b3949027de97e33dad6a049daf148719ba1822598a6c146461e2` |

Overlay 只应用到 repository-owned copy；global Skill 保持 pristine。稳定 machine authority 是：

- `contracts/compatibility-overlays-v1.json`
- `patches/patch_planning_skill.py`
- `upstream-manifest.json.compatibility_patches`
- `tests/fixtures/cloud/hook-observations-v1.json`
- `tests/fixtures/cloud/session-catchup-cloud-wrapper.jsonl`
- importer、contract、patch 和 Cloud-shaped regression tests

`upstream-manifest.json.historical_patched_skill_files` 名称带有历史色彩，但 patcher 仍用它交叉校验
managed hash，因此在不修改 reproduction contract 前保留。它不是 global Skill mutation 许可。

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
  -> runtime-bundle-v1 + compatibility-overlays-v1
  -> deterministic importer/patcher
  -> exact runtime/upstream bytes
  -> upstream-manifest contract hashes
  -> installer inventory/doctor
  -> release-artifact-v1 allowlist + deterministic ZIP
  -> external bootstrap checksum
  -> version acceptance
```

任一环节变化都必须更新相应 contract/hash/test，并使用新的 Release identity；不同字节不能借用旧版本
哈希或验收结论证明。
