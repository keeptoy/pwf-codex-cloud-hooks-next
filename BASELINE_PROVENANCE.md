# 基线与来源证明

本文件只记录稳定 provenance。逐轮历史仍保存在旧仓库，不复制到 successor 日常权威。

## 1. 不可变产品基线

| 项目 | 值 |
|---|---|
| 旧仓库 | [`keeptoy/pwf-codex-cloud-hooks`](https://github.com/keeptoy/pwf-codex-cloud-hooks) |
| Release | [`v0.3.0-beta.2`](https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/tag/v0.3.0-beta.2) |
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
冻结。successor 不重新发布或改写相同 beta.2 identity。

## 2. M1 exact-mirror 证据

successor remote：[`keeptoy/pwf-codex-cloud-hooks-next`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next)。

只读 audit branch：[`audit/beta2-exact`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/tree/audit/beta2-exact)，与上述 commit/tree 相同。M1 验收得到：

- Windows：69 registered / 51 PASS / 18 honest POSIX skips / 0 FAIL；
- Fresh Cloud/Linux：69/69/0/0；
- exact 22-entry ZIP 和 exact external bootstrap；
- 四个且仅四个 `100755` upstream runtime files；
- zero cache residue、clean workspace；
- terminal marker `M1_EXACT_MIRROR_CLOUD_ACCEPTANCE=PASS`。

M1 只证明镜像等价。`audit/beta2-exact` 必须保持可读、clean、不移动，不能作为 slim development
branch 重写。

## 3. 当前源码权威

- 日常源码与后续治理入口：[`main`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/tree/main)；
- M4-A authority commit：[`cc9bc878ddc7d70c25156dd053e2874758f0814a`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/cc9bc878ddc7d70c25156dd053e2874758f0814a)；
- M4-C accepted cutover commit：[`0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151)；
- Cloud-tested evidence：[`39795283cd65f84547651d7bec816191fb5bfedf`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/39795283cd65f84547651d7bec816191fb5bfedf)；
- `main-integrity` 与 `evidence-integrity` 均 active，只限制 deletion 与
  non-fast-forward；classic protection 不叠加，未虚构 required CI。

旧仓库默认分支会包含历史导航治理提交，因此它不是 beta.2 Release 字节的重建来源。需要复验
beta.2 时必须使用上表冻结 commit、两个不可变 Release assets 与 SHA-256。

## 4. 上游来源

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

## 5. Owned compatibility overlay

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

`upstream-manifest.json.historical_patched_skill_files` 名称带有历史色彩，但当前 patcher 仍用它交叉
校验 managed hash，因此在不修改 reproduction contract 前保留。它不是 global Skill mutation 许可。

## 6. Cloud 事实边界

2026-08 的实测环境：

- sandbox initialization 阶段没有 `CODEX_HOME`；
- Codex/Managed Hook 阶段 `CODEX_HOME=/opt/codex`；
- session store 为 `/opt/codex/sessions`；
- Hook stdin 提供 `session_id` 和 `transcript_path`；
- SessionStart source 实测 `startup` / `resume`；
- Hook process 没有 `CODEX_THREAD_ID`；
- 普通 Cloud planning files 多次观测 `st_nlink=1`。

这些是 fixtures 与验收绑定的平台观测，不声明 `/opt/codex` 永久不变。runtime 仍必须覆盖变量缺失、
显式 Host input 和受控 fallback。

## 7. Slim transformation 来源

M2 从 M1 audit tree 选择性构造 exact 59-path orphan skeleton：46 个原名保留路径、六个 Git-aware
rename source 和七个新文档/planning entrypoints。历史 planning、Phase/Round docs 和 snapshot prototype
没有被删除；它们继续存在于旧仓库与 audit ref，只是不进入 successor root tree。

三个 fixture rename 保持 bytes 不变：

- `adapter-output-managed-legacy.json`
- `adapter-output-canonical-plan.json`
- `session-catchup-cloud-wrapper.jsonl`

Production runtime、schemas、installer 和 upstream scripts 在 M2-B 不改变行为。迁移使用的开发
身份是 `0.3.0-beta.3-dev` 和 zero-hash bootstrap；后续 stable S1 在继续保持这些行为字节不变的
前提下，把候选身份冻结为 `0.3.0` 并单独记录新资产 hash。该 candidate 尚未替代 beta.2 rollback。

## 8. 验证来源链

```text
pinned upstream archive + license
  -> runtime-bundle-v1 + compatibility-overlays-v1
  -> deterministic importer/patcher
  -> exact runtime/upstream bytes
  -> upstream-manifest contract hashes
  -> installer inventory/doctor
  -> deterministic 22-entry ZIP
  -> external bootstrap checksum
  -> Fresh/Resume Cloud acceptance
```

任一环节发生变化都必须更新相应 contract/hash/test，并使用新 Release identity；不能引用 beta.2
哈希来证明不同字节。

## 9. Stable v0.3.0 accepted Release

| 项目 | 值 |
|---|---|
| tag / Release | [`v0.3.0`](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.0) |
| exact release source commit | `1454c9224c83d11c073b05baf6e536a11c3bb0e5` |
| ZIP | `pwf-codex-cloud-hooks-v0.3.0.zip` |
| ZIP entries / size | 22 / 75,386 bytes |
| ZIP SHA-256 | `f245a554210c7f8d07eebbb775faa7b1482fea5d363ee6fa7578c9bbd98ad9af` |
| external bootstrap | `init-cloud-sandbox-v0.3.0.bash` |
| bootstrap size | 17,423 bytes |
| bootstrap SHA-256 | `ab334f0367d948fa29a2bdd37bff0c220929aeb320fdf59dbacbd5a4021b39c0` |
| behavior delta | none；保留 canonical runtime 与 `PWF_GLOBAL_HOOK_CANARY_V1` |
| current authority | published/accepted rollback；beta.2 为 immutable previous fallback |

S2 已接受上表 exact source，S3-A 已证明 tag target 与两个下载资产，Cloud setup/B～F 进一步证明
Fresh/canonical/real Resume/doctor/11-payload/zero-residue 全部门槛。后续 evidence-only `main` 提交
不得取代该 tag target；完整证据见 `docs/v0.3.0-cloud-hard-acceptance.md`。
