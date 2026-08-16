# Task Plan: Phase 4 F3C rollback Discovery

## Goal

在完整 F3B live lifecycle PASS 的基础上，研究 disarm-first rollback/reinstall/forward-recovery 的真实安全边界，冻结最小验证矩阵、
对象生命周期、Cloud 分工、退出条件与停止规则，并把结论记录为 Phase 4.10；本轮只做 Discovery，不执行 rollback 或实现。

## Next Step

完成 Phase 4.10、ROADMAP/acceptance/history index 与静态守卫的 Discovery-only 收口；验证并本地提交后停止，等待维护者另行授权 F3C1。

## Current Phase

F3C-D1 rollback threat model and transition matrix

## Phases

### F3C-D0 — Evidence recovery and scope freeze

**Status:** completed

- 恢复 programme、F3B evidence、published rollback 与 installer ownership 事实。
- 明确 Discovery-only 授权和禁止事项。

### F3C-D1 — Rollback threat model and transition matrix

**Status:** completed

- 区分 disarmed、armed、prepared、tampered 与 markerless 输入。
- 研究 `0.4.0-dev → v0.3.5 → 0.4.0-dev`、repair/reinstall 和 dormant-token revival 风险。

### F3C-D2 — Validation topology and lifecycle ledger

**Status:** completed

- 冻结 repository-only/no-live/Cloud 职责、exact refs、evidence record 与退出条件。
- 决定 validation refs、state files、temporary installs 和 operator artifacts 的保留/退役时点。

### F3C-D3 — Phase 4.10 decision and local handoff

**Status:** completed

- 新建 Phase 4.10 Discovery 历史文件并补相称静态守卫。
- 运行文档/边界验证，创建单一 local commit 后停止，等待 implementation 授权。

## Authorization

- 已授权：F3C 小型 Discovery；只读源码/ref/历史审计；新建 markerless planning、Phase 4.10 历史文档与相称测试；本地验证和本地 commit。
- 未授权：真实 rollback/reinstall、创建/移动/删除 validation refs、写 machine state、启动 Cloud task、修改 production/runtime/
  contracts/manifest/bundle/installer/bootstrap/README/Release bytes、F3C implementation、push/PR/tag/Release/publication/promotion。

## Frozen boundaries

1. `F3B_LIVE_LIFECYCLE_PASS` 保持成立，但不外推 rollback PASS。
2. 两个 runtime-source refs 与九个正向 lifecycle refs 全部冻结并保留。
3. 首选路线为 disarm-first；armed rollback 只能作为必须拒绝/停止的威胁输入，不能被正常化为受支持流程。
4. development active scope 保持 markerless legacy；Discovery 不制造 live state。
5. v0.3.5 是当前 accepted rollback，v0.4.0-dev 是未发布 candidate；不得把本地构建写成正式 Release。

## Stop Conditions

- 发现 rollback 必须修改 production/schema/Release bytes 才能安全验证。
- published v0.3.5、candidate、validation refs、installer ownership 或 F3B evidence 出现身份漂移。
- 需要执行真实 rollback、Cloud、远端写入或 ref mutation 才能继续。
- 方案会允许 armed rollback、静默 token revival、旧 runtime 写回 workspace 或把缓存/模型口述当成证据。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| F3 history search referenced nonexistent `docs/history/phase-4.6-f3a-lifecycle-foundation.md` | 1 | Corrected the path from the history index to `phase-4.6-f3-cloud-lifecycle-discovery.md`; rerun only the missing read |
| Combined findings/phase-status patch used an over-broad context and failed verification | 1 | Reapplied as smaller exact hunks after locating the current headings; no file was partially modified |
| Windows sandbox blocked Node test-runner child processes with `spawn EPERM` | 1 | Re-ran the same focused/full Node suites outside that sandbox boundary; both completed with zero failures |
| Parallel static-check attempt started Git Bash inside the Windows sandbox and failed to create its signal pipe | 1 | Re-ran importer/Python/Node/Bash/diff checks serially with the required execution permission; all passed |

## Current status

`F3C_DISCOVERY_COMPLETE / CONDITIONAL_GO_TO_F3C1_ROLLBACK_PROTOCOL_MATERIALIZATION / IMPLEMENTATION_NOT_AUTHORIZED / REFS_FROZEN`
