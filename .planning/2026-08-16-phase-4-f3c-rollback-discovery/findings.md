# Findings: Phase 4 F3C rollback Discovery

## Inherited facts

- F3B2 smart 与 F3B3 autonomous live lifecycle 已完成 aggregate closure；十份 evidence 互不冲突。
- validation refs 是 F3C rollback 对照输入，不是可立即清理的残留。
- F3C 仍未授权 implementation；本轮只研究 disarm-first rollback 和 dormant-token revival。

## Research log

### Stable support and architecture

- README 只承诺 pre-1.0 clean install 和 contracts/tests 已覆盖的 managed-state migration；旧 tag 可用于 rollback 审计，
  不能自动推导当前 installer 支持任意降级现场。
- Product opt-in commit point 位于 workspace plan directory；managed installer 不创建、修复或拥有这些文件。因此 runtime
  rollback 与 workspace intent 是两个独立状态面，F3C 必须同时观察但不能让 installer 写 workspace。
- Smart/autonomous disarm 都只删除 `.pwf-codex-managed`；残留 preparation state 应保持 inert。旧 v0.3.5 runtime 不认识
  Phase 4 activation semantics，真正风险发生在再次安装/升级到 v0.4.0-dev 时 dormant token 是否仍然存在并重新生效。
- Architecture 已明确把 F3C 定位为跨 candidate rollback，且列为尚未实现能力；F3B Cloud PASS 不能替代它。
- Installer 只拥有 managed runtime、installed manifest 与 requirements marker；unknown/unowned drift 必须 blocker，不能借 rollback
  扩大为 workspace migration authority。

### Programme and implementation routing

- DESIGN 把 rollback 涉及的实现面分成 install plane 与 plan runtime：降级/再升级验证必须同时检查 managed install ownership
  和只读 plan admission，但不应新增第三个迁移 writer。
- ROADMAP 的 accepted + immediate fallback 是 publication/asset oracle 席位，不是任意 installed-state migration contract。F3C
  必须显式限定 source/target 状态，不能因为 v0.3.5 是 rollback baseline 就假定 `0.4.0-dev → v0.3.5` 已受支持。
- 正式基线提升要求 rollback 验证，但 Source/Candidate、Publication audit、Published Release 三个通道前提不同。F3C 应先做
  repository-only materialization，再由独立 Cloud gate验证真实 installed transition；不能把 tag/ref-dependent oracle 塞进 tagless Cloud。
- 当前 programme 已满足“完整 F3B PASS”前置条件，但 F3C 仍是关键 rollback gate，必须先冻结 transition matrix 后再授权实施。

### Existing F3C skeleton discovered

- 现有 F3 runbook 已预留顺序：committed disarm → candidate legacy confirmation → candidate uninstall/backup → immutable
  v0.3.5 clean install + Fresh/Resume/doctor → candidate reinstall → still-disarmed legacy confirmation。
- Runbook 明确把 runtime-only rollback 后 dormant activation 复活列为隔离负向证明，不是支持操作；未 disarm 就 rollback
  必须立即 STOP/FAIL_CLOSED。
- 该骨架仍需 F3C Discovery补齐：exact source/ref topology、clean install 是否意味着必须 uninstall、两种 profile 的最小矩阵、
  workspace preparation state 如何在旧 runtime 阶段保持 inert，以及再升级时如何证明 activation 没有复活。

### Installed-state transition facts

- Current `installed-state-transition-v1` 只准入 exact v0.3.5 predecessor，证明的是 `v0.3.5 → 0.4.0-dev` forward migration；
  它没有声明 v0.3.5 installer 能识别或覆盖 0.4.0-dev installed manifest。
- 现有 publication oracle 的“clean rollback”实际顺序是 current uninstall → v0.3.5 install，而不是把 v0.3.5 直接覆盖到
  current runtime。这个区别必须成为 F3C 支持合同，不能把 clean install 简写成 direct downgrade。
- Current uninstall 备份并删除 installer-owned managed runtime/requirements marker，不读取或删除 workspace plan state；因此
  disarm commit 必须在 uninstall 前独立完成和验证。
- Managed backup 只覆盖 managed runtime 与 requirements，不含 workspace activation；它不能被用作 opt-in intent 的恢复点。

### Exact v0.3.5 behavior

- v0.3.5 installer只接受自己的 manifest schema/owner/inventory；current v0.4.0-dev manifest schema 不在其准入窗口，因此 direct
  downgrade 应 fail closed。受支持流程必须由 current installer先 uninstall，再由 immutable v0.3.5 clean install。
- v0.3.5 owned-plan private snapshot只投影 `task_plan.md` 与可选 `progress.md`，不会把 workspace `.mode`、nonce、attestation、
  ledger 或 current activation token复制给 pristine injector。旧 runtime 因此应输出 legacy，而不是直接消费残留 preparation state。
- 上游 v0.3.5 injector本身能识别 `.mode`，但 production只在 owned private snapshot中执行；F3C必须同时证明 installed v0.3.5
  仍走 owned snapshot，不能仅凭上游脚本文本推断现场行为。
- 再升级到 current candidate 后，唯一决定是否复活的是 workspace activation commit point 是否仍存在且匹配 profile。故 positive
  rollback从已提交 disarm ref开始；runtime-only负向路线的核心是证明“token 未删就会在 reinstall candidate 后重新生效”。

### Frozen rollback inputs

- Smart `S_DISARM` 与 autonomous `A_DISARM` refs 均只删除各自 plan 的 `.pwf-codex-managed`，正好是 F3C 两条 positive
  workspace 输入；local 与 remote-tracking identity仍匹配 F3B4 冻结值。
- F3C不应创建新的 workspace transition chain来重复 disarm。它应复用这两个 accepted disarm refs，并为新的 operator/runtime
  protocol source单独冻结 identity，避免“验证 rollback”时改写已经通过的 opt-out evidence。
- v0.3.5 published ZIP/bootstrap已有 immutable URL、size、SHA 与 Cloud acceptance；Cloud rollback阶段应从公开资产重新下载校验，
  不能从当前 checkout重建旧包或用本地 tag source冒充 Published Release。
- Current candidate仍是 zero-hash development identity；F3C可用 exact runtime-source commit + deterministic candidate URL/SHA override，
  但不得把它写成已发布 0.4.0。

### Current official Cloud lifecycle check

- 2026-08-16 复核官方 `Cloud environments`：新 chat先 checkout selected branch/commit，再运行 setup；cached container恢复时先
  checkout chat指定 branch，再可运行 maintenance。setup在独立 Bash session中，environment variables贯穿 chat，shell-local
  `export` 不自动进入 agent phase；cache最长可保留 12 小时但会因配置变化失效。
- 因此 F3C stage不能依赖上一个 task留下的 installed runtime或 shell变量。每个 `rollback`/`recovered` setup必须从当前现场
  自校准并执行完整、幂等、exact identity transaction；cache只记录观察值，不进入 PASS 条件。
- 要观察某个最终 installed role 的 true startup，安装切换必须在该 task的 setup/maintenance阶段完成。agent prompt内切换只能
  证明后续 UserPrompt/Resume，不足以冒充 startup Fresh。

### Frozen supported transition

- 正向支持矩阵只接受两个已通过 F3B 的 committed disarm 输入：smart
  `c9275ba02073adb184cd73550c5b9f54c6f8178c` 与 autonomous
  `98b6f138497af244563541ec655a1111198f0c36`。两者都保留 preparation state，但 activation commit point 已删除。
- rollback transaction 必须是：验证 exact disarm/clean/activation absent → 当前 candidate legacy probe → current installer
  uninstall/backup → 从 immutable public URL 校验并 clean-install v0.3.5 → v0.3.5 Fresh/UserPrompt/real Resume/doctor。
- recovery transaction 必须自校准，不依赖上一 Cloud task：再次建立 v0.3.5 accepted predecessor → 由 current candidate 执行
  exact forward migration → current Fresh/UserPrompt/real Resume/doctor → 再证 activation absent 且 effective profile 仍为 legacy。
- v0.3.5 immutable identity 固定为 source `5d01b55890c1da2a5088e2b991b152a9fb1c3f87`，ZIP 21 entries、
  77,800 bytes、SHA-256 `7d351cfe0eaa60e93bc279645ed3f480dc9e83efdff1c6abf13c14d84c286f0b`，bootstrap
  SHA-256 `33d7fcaca56c617ef70e33c9708af804a8737d587cc58571382b945e5bff58a5`。旧资产必须下载复核，不能从当前 checkout 重建。
- direct v0.3.5 overwrite、armed/runtime-only rollback、cache continuity、installer 写 workspace、把本地 candidate 当 Published Release
  均为 denied route。runtime-only dormant-token revival 只允许在 disposable Linux/no-live fixture 中作负向证明。

### Validation topology and evidence v2 need

- F3C1 先物化 Release-excluded operator protocol、repository-only/no-live transition tests 与 rollback evidence helper；不做 live rollback。
- F3C2 复用 smart disarm ref，独立验证 `S_ROLLBACK → S_RECOVER`；F3C3 复用 autonomous disarm ref，独立验证
  `A_ROLLBACK → A_RECOVER`。不创建第二套 workspace preparation/activation DAG。
- F3C4 才对账 smart/autonomous rollback/recovery records、no-live negative evidence、candidate/accepted identity 与 residue，并决定
  `F3C_ROLLBACK_PASS`。在此之前不能把单 profile 或单 stage 写成 aggregate PASS。
- 现有 evidence v1 只能表达一个 candidate/runtime role，不能无损表达 accepted + candidate 双 runtime identity。后续 F3C1 应新增
  Release-excluded `validateF3RollbackEvidenceRecord()`，而不是重载 `candidate_sha256`、扩写 production schema 或伪造 Cloud task ID。
- record 应至少表达 protocol profile/stage、runtime source、workspace disarm HEAD、current candidate SHA、accepted version/ZIP SHA、
  最终 installed role/version、repository state、activation absent、Host sources、actual profile/advisory、doctor、transition/backup、residue
  与 final exit code。临时路径、raw transcript、cache 猜测不进入 machine record。

### Lifecycle decision

- 两个 runtime-source refs、九个正向 lifecycle refs、operator guides、F3 evidence helper 与 Phase 4.7～4.10 历史都继续保留。
- F3C 复用既有 disarm refs；Discovery 不创建、移动或删除 ref。未来 protocol materialization 若需要新 runtime-source ref，必须单独授权。
- rollback temporary installs/backups/evidence JSON 属 execution-scoped；Cloud task 结束后不得进入仓库或 source authority。
- refs 最早只能在 `F3C PASS + 当前 0.4.0 Phase 9 instance complete` 后人工复核；这不是自动删除日期。
- Discovery 决策：`CONDITIONAL_GO_TO_F3C1_ROLLBACK_PROTOCOL_MATERIALIZATION / IMPLEMENTATION_NOT_AUTHORIZED / REFS_FROZEN`。
