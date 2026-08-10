# Task Plan: v0.3.3-dev Pristine Catch-up Runtime

## Goal

把已经从 production behavior graph 退出的 catch-up overlay 从 current source/rebuild/install/Release contract
中正式退休：四个 pinned PWF v3.8.2 upstream runtime 文件全部保持 pristine，`owned-catchup.py` 继续只复用
显式允许的 parser helper closure，不调用 upstream CLI `main()`。

## Authorization

- 维护者已批准 P2-OTG-D 的 Route B 并要求继续施工，同时补充 `ARCHITECTURE.md` 的源码重建/生产执行边界。
- 本 gate 授权建立 `v0.3.3-dev` successor source identity、fail-closed development bootstrap、迁移 trusted
  bytes/contracts/importer/installer/Release allowlist/tests/docs，并进行本地完整验证。
- 不授权 seal、tag、Release、push、Cloud deployment、Latest/rollback promotion 或 Product Phase 4 功能。
- 已发布 v0.3.2 的 tag、ZIP/bootstrap、SHA、acceptance、patcher/overlay identity 不得改写；历史恢复只走
  immutable refs 与 `BASELINE_PROVENANCE.md`。

## Invariants

- global PWF Skill 保持 pristine；production 只从 installed sibling owned runtime 执行。
- Managed policy 仍只注册 absolute `hook_adapter.py`。
- `owned-catchup.py` 继续负责 transcript selection/identity、immutable bytes、normalization、budget/rendering。
- Pinned pristine helper result 必须与退休前 managed helper result 等价；helper closure 不得进入 CLI selection/
  runtime inference/planning guard/rendering 或 `main()`。
- plan private snapshot、Host ABI、event dispatch、failure semantics 与 Phase 4 deferred behavior不变。
- current dev bytes 不能冒充 published v0.3.2；bootstrap checksum 在 seal 前必须为 64 位 zero hash并 fail closed。

## Gates

- [x] G0 — Successor identity and planning rotation：建立唯一 active scope、`v0.3.3-dev` package/candidate role与
  zero-hash bootstrap，不改发布角色。
- [x] G1 — Boundary tests：先补 managed/pristine result equivalence、helper allowlist/transitive closure 与
  import-time surface 断言。
- [x] G2 — Runtime/source migration：恢复 pristine `session-catchup.py`，简化 importer/runtime bundle/upstream
  manifest，删除 current patcher/overlay executable contract。
- [x] G3 — Install/Release/docs migration：同步 installed inventory、Release allowlist、tests、README、
  ARCHITECTURE、DESIGN、ROADMAP、CHANGELOG 与 provenance 冷历史边界。
- [x] G4 — Local acceptance：focused/full suite、import/check、compile/syntax、mode/LF、deterministic ZIP、
  repository guards 与 diff check 全绿。
- [x] G5 — Cloud handoff：生成 Source/Candidate 验收步骤并停下，等待维护者另行授权/执行 Cloud；不 seal。

## Next Step

创建本地关键检查点后停止。下一步是维护者另行授权并在 Linux/Cloud 执行
`docs/v0.3.3-dev-cloud-hard-acceptance.md` 的 R5-SC；本 scope 不 seal、不 push，也不进入 R5-PR。

## Stop Conditions

- pristine 与 managed module 对任何 owned request 产生不同 result envelope 或 diagnostic。
- helper transitive closure 进入四个 patched symbols、CLI `main()`，或 import 触发文件/网络/子进程行为。
- 迁移要求改变 Host ABI、plan snapshot、event dispatch、failure semantics 或 Product Phase 4 范围。
- current tree 需要改写 v0.3.2 immutable identity、移除其唯一恢复证据或削弱 publication/fallback oracle。
- 通用 archive hash、source integrity、global Skill pristine、installer drift 或 Release boundary 断言无法无损迁移。

## Status

G0～G5 本地范围全部 PASS；实现状态为 `LOCAL_PASS / CLOUD_PENDING`。P2-OTG-D 的 Route B 已落地；
published v0.3.2 身份未改写，v0.3.3-dev 仍是 zero-hash、未封板的 Source/Candidate。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| shell read 返回值包含 `Exit code/Wall time/Output` 三行元数据，机械生成的新 bootstrap 将其带入文件头 | 1 | 未执行该文件；用 apply_patch 删除三行并复核 shebang/version/zero hash，不重复假设 raw result 纯正文 |
| 新等价测试直接执行 wrapper CLI，在 Windows 因 production POSIX gate 返回 `invalid_request` | 1 | 保留 production gate；测试改用现有 native harness 调用 `run_request(require_posix=False)`，只比较 parser module 等价性 |
| shell read → apply_patch 替换 pristine runtime 时多带一个末尾空行，hash 为 `216268...` | 1 | importer fail closed；用 no-index diff 定位唯一空行并删除，继续以 pinned SHA `6476fd...` 为 authority |
| staged repository guard 发现 P2 completed scope 与新 active scope 同时留在 current tree | 1 | P2 已由 local immutable `b7f9713` 保存；按 lifecycle contract 删除其 current-tree 三文件，只保留新 active scope |
| 首次 full suite 唯一失败：Cloud fixture 仍直接执行已退休 upstream CLI，pristine CLI 对 scoped-only plan 安静退出 | 1 | 分类为历史 test coupling；迁移同一 fixture 到 owned wrapper exact request，覆盖 validated Host path 与 explicit fallback，保留 count/tail 断言 |
| 最终 repository guard 在受限 Windows 沙箱内派生只读 `git ls-files` 时返回 `status=null` | 1 | 归类为 sandbox process limitation；沙箱外原样重跑 repository/architecture guards 17/17 PASS，未修改断言 |
