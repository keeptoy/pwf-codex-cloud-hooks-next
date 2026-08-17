# Findings: Phase 4 F3C1 pre-implementation HEAD audit

## Scope

- Exact starting HEAD: `19508c8` (`docs: freeze F3C rollback Discovery`).
- Starting worktree was clean on `0.4.0-dev`; only this audit planning scope is being added.
- Audit only; F3C1 implementation, runtime switching, Cloud and ref mutation remain unauthorized.

## Findings log

### Stable authority recovery

- README 仍只承诺 clean install 与 contracts/tests 明确覆盖的 managed-state transition；published rollback identity 不等于
  arbitrary installed downgrade support。
- README/ARCHITECTURE 继续冻结 installer ownership：managed runtime、manifest、requirements、backup/install/doctor/
  uninstall；workspace plan state 始终由 plan owner 管理，installer 不创建、修复或删除 activation。
- 当前 runtime 不变量仍是 activation-first：commit point 缺失时 mode/nonce/attestation/ledger inert；armed invalid state
  fail closed，不回退 legacy。
- ARCHITECTURE 已吸收 F3B2/F3B3 live 事实，并仍明确把 autonomous disarm-first cross-candidate rollback 列为尚未实现的 F3C。
- Cloud setup/maintenance、shell-local export、cache 与 true startup 的边界仍支持 Phase 4.10 的 stage-explicit/self-normalizing 方案。

### Implementation/programme recovery

- DESIGN 仍把 F3C 涉及面正确分为 install plane、plan runtime、contracts/tests 和 Cloud acceptance；没有引入第三个 migration writer。
- Machine authority 仍是 manifest integrity index → runtime bundle source/install inventory；installed manifest snapshot 与 Release
  allowlist职责不变，F3C evidence 不应成为第二份 inventory。
- ROADMAP 当前状态与 Phase 4.10 一致：F3B complete，F3C Discovery conditional-go，只允许在另行授权后进入 F3C1
  Release-excluded protocol/no-live materialization。
- Pre-1.0 policy再次确认 publication recoverability 与 installed-state compatibility是两件事；unknown old/new state必须 fail closed，
  only explicitly admitted predecessor可以就地迁移。

### Current transition contract and installer

- `installed-state-transition-v1.json` 精确只描述 v0.3.5 schema-3 predecessor、11 个 manifest keys、10 个 runtime files、
  upstream/adapter/events/hash/mode；没有 reverse/downgrade entry。
- Current `assertSafeRuntimeForInstall()` 只接受两种 installed identity：exact current schema/owner/version，或 contract中唯一的
  exact v0.3.5 predecessor。predecessor还要逐项匹配 manifest keys、canonical upstream hash、adapter/events、runtime inventory、
  requirements bytes/ownership与每个文件 hash/mode；unknown path/link/identity均在 backup/write前拒绝。
- Current forward install顺序是 capture → validate predecessor/current → backup → revalidate shared state → retire only verified superseded
  paths → write current runtime/requirements/manifest。Phase 4.10 的“current installer owns cleanup and forward migration”与代码一致。
- Current uninstall执行 capture/ownership inspection后才 backup并移除 owned runtime/requirements；它没有 workspace planning path输入。
- 现有 publication oracle已证明 exact v0.3.5 → current正向迁移，以及 current uninstall → v0.3.5 clean install；它没有把
  v0.3.5 direct-over-current当成支持路线。
- “旧 installer direct downgrade 必须在任何 backup/write前拒绝”尚未由当前 F3B tests直接冻结；这是 Phase 4.10 已明确留给
  F3C1 的 no-live test目标，不是发现现有 product contract缺失。

### Exact v0.3.5 direct-downgrade reading

- Immutable source object `5d01b55890c1da2a5088e2b991b152a9fb1c3f87` 存在，package identity为 `0.3.5`。
- v0.3.5 与 current installed manifest schema都为 3；因此“旧 installer因 schema不同拒绝 current”不是精确原因，Phase 4.10
  planning中的早期口头假设需要纠正。
- v0.3.5 `assertSafeRuntimeForInstall()` 校验 schema/owner、路径安全和自己的 exact allowed path set。current v0.4.0-dev安装包含
  v2 plan contracts及额外 owned files，和 v0.3.5 的 v1/10-file布局不同，因此 old direct-over-current 应因 unknown entries在
  `backup()` 前拒绝。
- 这个结论目前来自 immutable source静态阅读；F3C1 必须把 current install → v0.3.5 direct attempt → no backup/no mutation
  变成 disposable executable test，不能只保留文档推断。

### Runtime, evidence seam and frozen refs

- Current `capture_owned_state()` 仍首先读取 activation；缺失时立即返回 legacy且完全不读 mode/nonce/attestation/ledger。
  activation存在才解析 profile-bound token与 mode，autonomous再读取/核对 task、nonce、attestation、bounded ledger。
- Current tests已覆盖 smart disarm后即使 `.mode` 损坏也返回 legacy，以及 autonomous/profile mismatch、unsafe/race refusal。
  因而 Phase 4.10 的 positive disarm输入与 current runtime行为一致。
- `validateF3EvidenceRecord()` exact keys只有一个 `candidate_sha256`/runtime source，不含 accepted asset、installed role/version、
  activation absence或transition/backup事实；不能无歧义承载 F3C rollback。这验证了新增独立 test-only rollback evidence helper的需要。
- 11 个 local F3B refs与11个 remote-tracking refs仍逐项存在；smart/autonomous disarm commits仍各自只删除对应 plan的
  `.pwf-codex-managed`。没有发现 ref drift或需要重建 lifecycle DAG的理由。
- Phase 4.6只提供 disarm-first方向；4.7补双身份/live/rollback问题，4.8补 autonomous tamper/re-attest，4.9补十份 evidence与
  ref retention，4.10以这些后继事实和当前代码重新冻结路线。当前审计没有回退到只依赖4.6。

### Identity and integrity postflight

- Exact audit HEAD为 `19508c8f993421d556cf0bad545de5eef4336dd0`，package仍为 `0.4.0-dev`。
- Manifest schema 4 路由的 runtime bundle、installed transition、Release contract三份 raw SHA均与 manifest引用匹配。
- Bundle仍为 schema 2，包含4 upstream + 3 local + 4 installed-contract records；Release仍为 schema 2、22 entries。
- v0.3.5 source/ZIP/bootstrap identity与 provenance/acceptance一致：source `5d01b558...`，ZIP 21 entries/77,800 bytes/
  `7d351cfe...`，bootstrap `33d7fca...`。没有 publication identity drift。

### Audit decision draft

- Phase 4.10 总路线不需要改：`committed disarm → current uninstall → immutable v0.3.5 clean install → current forward recovery`。
- 需要一项事实纠正：direct downgrade的当前拒绝机制不是 schema/owner不同，而是v0.3.5 exact allowed-path布局拒绝current-only
  v2/extra entries；F3C1应把该机制用 executable no-backup/no-mutation test固定。
- 除上述测试/表述精确化外，没有发现 contract/runtime/installer改动前置需求；可在维护者下一轮单独授权后进入F3C1 materialization。
