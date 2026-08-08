# 基线与来源证明

本文件只回答“代码与不可变资产从哪里来、如何复现”。版本变化摘要见
[`CHANGELOG.md`](CHANGELOG.md)，当前 programme/lifecycle 见 [`ROADMAP.md`](ROADMAP.md)，逐次验收过程见
对应 `docs/` acceptance。这里不维护当前开发目标、版本角色、Next Step 或测试流水账。

## 1. 已发布身份索引

### 1.1 v0.3.1

| 项目 | 值 |
|---|---|
| tag / Release | [`v0.3.1`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.1) |
| exact release source commit | [`9aa2148886e499f9f45594f7ae4f7681f1045de2`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/9aa2148886e499f9f45594f7ae4f7681f1045de2) |
| ZIP | `pwf-codex-cloud-hooks-v0.3.1.zip` |
| ZIP entries / size | 23 / 82,725 bytes |
| ZIP SHA-256 | `f097b04015b1a3847ca5a24b9236f882c5a008b22033793b5661e282c39131f9` |
| external bootstrap | `init-cloud-sandbox-v0.3.1.bash` |
| bootstrap size | 21,565 bytes |
| bootstrap SHA-256 | `ce31a32002aea46bbf3f9baf9a0e93451d24c3b3653952e425d1e1ff6960a5e8` |

公开下载、最终双资产与 Cloud A～F 证据由
[`docs/v0.3.1-cloud-hard-acceptance.md`](docs/v0.3.1-cloud-hard-acceptance.md) 冻结。

### 1.2 v0.3.0

| 项目 | 值 |
|---|---|
| tag / Release | [`v0.3.0`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.0) |
| exact release source commit | [`1454c9224c83d11c073b05baf6e536a11c3bb0e5`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/1454c9224c83d11c073b05baf6e536a11c3bb0e5) |
| ZIP | `pwf-codex-cloud-hooks-v0.3.0.zip` |
| ZIP entries / size | 22 / 75,386 bytes |
| ZIP SHA-256 | `f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af` |
| external bootstrap | `init-cloud-sandbox-v0.3.0.bash` |
| bootstrap size | 17,423 bytes |
| bootstrap SHA-256 | `ab334f0367d948fa29a2bdd37bff0c220929aeb320fdf59dbacbd5a4021b39c0` |
| behavior delta | none；保留 canonical runtime 与 `PWF_GLOBAL_HOOK_CANARY_V1` |

最终 source、tag、双资产与 Cloud 证据由
[`docs/v0.3.0-cloud-hard-acceptance.md`](docs/v0.3.0-cloud-hard-acceptance.md) 冻结。

### 1.3 v0.3.0-beta.2

| 项目 | 值 |
|---|---|
| 旧仓库 | [`keeptoy/pwf-codex-cloud-hooks`](https://github.com/keeptoy/pwf-codex-cloud-hooks) |
| tag / Release | [`v0.3.0-beta.2`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.3.0-beta.2) |
| source/audit commit | [`bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b`](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b) |
| source/audit tree | `ff49c3c6656386e94450ccb24437a1c2d1c50e95` |
| ZIP | [`pwf-codex-cloud-hooks-v0.3.0-beta.2.zip`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-beta.2/pwf-codex-cloud-hooks-v0.3.0-beta.2.zip) |
| ZIP entries / size | 22 / 84,572 bytes |
| ZIP SHA-256 | `812cc9cdcafa93b5fcc47cc763fd743f11be77958b75eea1fa4cf0508dd391ab` |
| bootstrap | [`init-cloud-sandbox-v0.3.0.bash`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-beta.2/init-cloud-sandbox-v0.3.0.bash) |
| bootstrap size | 17,425 bytes |
| bootstrap SHA-256 | `d572b77d920b34c34c7912ba364376ae3668216f00ce350251bd7c8b336abcd6` |

资产下载、prepublication seal、Fresh/Resume A～F 和 post-resume doctor 证据由
[`docs/v0.3.0-beta.2-cloud-hard-acceptance.md`](docs/v0.3.0-beta.2-cloud-hard-acceptance.md)
冻结。successor 不重新发布或改写相同 identity。

## 2. Successor 迁移来源链

successor remote：[`keeptoy/pwf-codex-cloud-hooks-next`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next)。

| 迁移证据 | 不可变 ref | 证明范围 |
|---|---|---|
| M1 exact mirror | [`audit/beta2-exact@bbad3703...`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/tree/audit/beta2-exact) | 与 beta.2 commit/tree、资产和 runtime bytes 等价 |
| M3 Cloud equivalence | [`39795283cd65f84547651d7bec816191fb5bfedf`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/39795283cd65f84547651d7bec816191fb5bfedf) | slim successor 的 Linux、Fresh/Resume、doctor 与 package 等价性 |
| M4-A authority cutover | [`cc9bc878ddc7d70c25156dd053e2874758f0814a`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/cc9bc878ddc7d70c25156dd053e2874758f0814a) | successor authority handoff 输入 |
| M4-C accepted cutover | [`0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151) | repository cutover 与 rollback 验收输入 |

M2 从 M1 audit tree 选择性构造 parentless slim root；被排除的历史 planning、Phase/Round 文档和
snapshot prototype 仍可在旧仓库与 audit ref 中追溯。三个 fixture rename 保持原字节：
`adapter-output-managed-legacy.json`、`adapter-output-canonical-plan.json` 和
`session-catchup-cloud-wrapper.jsonl`。

可重放的迁移证据见：

- [`docs/beta3-dev-m3-cloud-equivalence.md`](docs/beta3-dev-m3-cloud-equivalence.md)；
- [`docs/beta3-dev-m4-cutover-plan.md`](docs/beta3-dev-m4-cutover-plan.md)。

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
  [`ARCHITECTURE.md` 的 Cloud 生命周期](ARCHITECTURE.md#21-cloud-生命周期与-codex_home)；
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
