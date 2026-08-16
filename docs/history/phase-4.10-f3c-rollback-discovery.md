<a name="phase-4-10-positioning"></a>

# Phase 4.10：F3C disarm-first rollback 小型 Discovery

## Historical position

本文件记录完整 F3B live lifecycle PASS 后、执行任何 runtime rollback 前的 F3C 探路。它回答三个问题：旧版能否安全接管
当前安装；怎样证明 smart/autonomous 已 disarm 后不会因降级和再次升级而复活；哪些验证对象要继续保留到 Release 收口。

本轮只恢复证据、阅读 installer/runtime/contracts、冻结矩阵和后继 gate。没有执行真实 uninstall/install/rollback、启动 Cloud、
创建或移动 validation ref、写 workspace machine state，也没有修改 production、contract、manifest、bundle、installer、bootstrap、
README 或 Release bytes。

<a name="phase-4-10-new-evidence"></a>

## New evidence recovered

- `v0.3.5` 是 accepted rollback 的 immutable publication identity，但这不自动表示它能直接覆盖未知的未来 installed manifest。
- 当前 installed-state transition contract 只准入 exact `v0.3.5 → 0.4.0-dev` 正向迁移；它没有声明反向覆盖。
- 现有 publication oracle 的 clean rollback 实际是 current uninstall 后再装 v0.3.5，不是用旧 installer 直接 downgrade。
- current uninstall 只拥有 managed runtime、installed manifest 与 requirements marker；workspace opt-in state 不属于 installer。
- v0.3.5 owned private snapshot只投影 `task_plan.md` 和可选 `progress.md`，不会把 `.mode`、activation、nonce、attestation 或 ledger
  传给 pristine injector。因此残留 preparation state在旧 runtime 下仍应是 legacy；但未删除的 activation token 会在 current
  candidate 再次安装后重新生效。
- smart/autonomous accepted disarm refs 都只删除 `.pwf-codex-managed`。它们是 F3C 的现成正向输入，不需要重建 workspace DAG。

旧版本必须从公开 immutable 资产验证，不能从当前 checkout 或同名本地文件重建：

| Identity | Exact value |
|---|---|
| source | `5d01b55890c1da2a5088e2b991b152a9fb1c3f87` |
| Release ZIP | `pwf-codex-cloud-hooks-v0.3.5.zip`；21 entries；77,800 bytes |
| ZIP SHA-256 | `7d351cfe0eaa60e93bc279645ed3f480dc9e83efdff1c6abf13c14d84c286f0b` |
| bootstrap SHA-256 | `33d7fcaca56c617ef70e33c9708af804a8737d587cc58571382b945e5bff58a5` |

2026-08-16 对官方 [`Cloud environments`](https://learn.chatgpt.com/docs/environments/cloud-environment) 文档的复核还确认：
新 chat 先 checkout 再 setup；cached resume 会重新 checkout，
再按配置执行 maintenance；setup shell 的局部 `export` 不会自动进入 agent phase；cache 也可能失效。因此每个 F3C stage 必须
显式、幂等、自校准，不得依赖上一 task 的 installed runtime、shell 变量或 cache 连续性。

<a name="phase-4-10-threat-model"></a>

## Threat model

| 输入/路线 | 风险 | F3C 决策 |
|---|---|---|
| committed disarm + clean worktree | preparation 保留，但 commit point 已删除 | 唯一 positive Cloud 起点 |
| v0.3.5 直接覆盖 current install | 旧 installer 不认识 current schema/ownership，可能绕开 current backup/cleanup | 必须 fail closed；不是支持路线 |
| armed/runtime-only rollback | 旧 runtime 暂时看不懂 token，但 token 在 current reinstall 后复活 | 禁止作为支持操作；仅 disposable no-live 负向证明 |
| prepared marker without activation | 容易被误判为“仍已启用” | repository state 可为 prepared，但 production 必须 legacy |
| tampered/unsafe state | rollback 可能掩盖原本 refusal | 不进入正向路线；继续 fail closed |
| cache 或上轮 shell export | Cloud task间不稳定，无法证明身份 | 只能记录观察，不进入 PASS 条件 |
| current checkout 重建 v0.3.5 | 字节不等于已发布资产 | 禁止；必须 public URL + exact SHA |

大白话：先把“开关”从仓库里真正删掉并提交，再换发动机。只换发动机、不关开关，旧发动机也许暂时看不懂这个开关，
但换回新发动机时它会立刻重新生效，这正是 F3C 要阻止的 dormant-token revival。

<a name="phase-4-10-supported-transition"></a>

## Supported transition

F3C 只支持以下非对称 transaction：

```text
accepted disarm ref
  → current candidate legacy confirmation
  → current installer uninstall + backup
  → immutable v0.3.5 clean install
  → v0.3.5 Fresh / UserPrompt / real Resume / doctor
  → rebuild an exact v0.3.5 predecessor from immutable assets
  → current candidate exact forward migration
  → current Fresh / UserPrompt / real Resume / doctor
  → activation still absent; effective profile still legacy
```

smart 使用现有 `validation/v0.4.0-dev-f3b2-smart-disarm` /
`c9275ba02073adb184cd73550c5b9f54c6f8178c`；autonomous 使用
`validation/v0.4.0-dev-f3b3-autonomous-disarm` /
`98b6f138497af244563541ec655a1111198f0c36`。不新增第二套 prep/arm/disarm commits。

rollback 与 recovery 必须是两个可独立重跑的 stage，而不是假设同一容器连续存活。rollback 最终 installed role 是 accepted
v0.3.5；recovery 必须重新建立 exact predecessor，再由 current installer 走已准入的正向 transition。两个 stage 都要从实际
installed probe 得出 profile，不能按 stage 名猜结果。

<a name="phase-4-10-validation-topology"></a>

## Validation topology

### F3C1 — rollback protocol materialization / no-live

- 新建自包含 operator guide、exact asset/transition 检查与 repository-only rollback evidence helper；
- 在 disposable Linux/no-live fixture 证明 direct downgrade 在任何 backup/write 前拒绝；
- 证明 supported uninstall → old clean install → current forward migration；
- 对 smart/autonomous 分别证明 runtime-only token 会在 current reinstall 后复活，因此该路线必须被拒绝；
- 不启动 live Cloud，不创建真实 state/ref，不修改 production/Release bytes。

### F3C2 — smart positive live

复用 accepted `S_DISARM`，执行并收集 `S_ROLLBACK → S_RECOVER`。每轮都验证 exact workspace HEAD、clean worktree、activation
absent、实际 installed role、Fresh/UserPrompt/real Resume、legacy profile、doctor、backup/transition 与零 residue。

### F3C3 — autonomous positive live

复用 accepted `A_DISARM`，执行 `A_ROLLBACK → A_RECOVER`。除上述共同断言外，还要证明残留 mode/nonce/attestation/zero-ledger
仍 inert，旧 runtime 不摄取它们，current recovery 后 activation 不复活。

### F3C4 — aggregate closure

最后才对账 smart/autonomous 四份正向 records、两 profile 的 no-live revival negative、accepted/current identities、Host/probe/
doctor/final-exit provenance 与 residue。单个 profile PASS、单个 installer test或旧 Release acceptance 都不能单独升级为
`F3C_ROLLBACK_PASS`。

<a name="phase-4-10-evidence-model"></a>

## Rollback evidence model

现有 `validateF3EvidenceRecord()` 只表达一个 candidate/runtime identity。F3C 同时涉及 accepted 与 current 两个 runtime role；
重载 `candidate_sha256` 会让“最终到底装的是谁”失真。因此 F3C1 应新增 Release-excluded、test-only
`validateF3RollbackEvidenceRecord()`，不修改 production schema。

建议 exact record 至少包含：

- protocol `profile`、`stage`、runtime source HEAD、workspace disarm HEAD；
- current candidate SHA、accepted version 与 accepted ZIP SHA；
- 最终 `installed_role` / `installed_version`；
- repository state、`activation_absent`、worktree；
- observed SessionStart sources、UserPrompt、actual Hook context/effective profile/advisory；
- doctor、backup/transition checks、snapshot residue 与最终 exit code。

结构 validator 仍只验证 shape 与字段关系。真实行为继续由 exact Git/asset identity、Host 原始观察、installed production probe、
doctor JSON 和工具最终 exit code共同承担。临时目录、backup 路径、raw transcript、Cloud 内部 task ID 与 cache 猜测不写入 record。

<a name="phase-4-10-lifecycle-ledger"></a>

## Object lifecycle ledger

| 对象 | 当前状态 | F3C 动作 | 最早 retirement review |
|---|---|---|---|
| smart/autonomous disarm refs | accepted F3B evidence | REUSE，不移动、不重建 | F3C PASS + 当前 0.4.0 Phase 9 instance complete |
| 其余 runtime/lifecycle refs | frozen comparison evidence | KEEP；negative/aggregate 对账仍需要 | 同上，且必须维护者人工批准 |
| future F3C runtime-source ref | ABSENT | 只有 F3C1 实施授权后才可创建 | 当前 Phase 9 后 |
| rollback operator guide/helper | PROPOSED / Release-excluded | F3C1 物化；不进入 bundle/runtime | F3 closure 或 evidence replacement 后评审 |
| public v0.3.5 assets | immutable external authority | 只下载并按 SHA 验证，不复制进仓库 | 永不改写 |
| temporary install/backup/evidence JSON | execution-scoped | disposable；只保留人类可审计摘要 | task 完成后销毁/按 Cloud 生命周期退出 |
| workspace preparation state | plan owner；disarm 后 inert | installer 只读/不写；正向 stage 保留 | plan scope closure 另行治理 |
| Phase 4.7～4.10 history | narrative evidence | KEEP；只允许事实纠错或后继尾注 | repository history policy |

这里的日期不是自动垃圾回收器。没有同时达到 F3C PASS、当前 Phase 9 完成、immutable commit可恢复和维护者批准，任何 ref 都
不得“顺手清理”。

<a name="phase-4-10-gate-plan"></a>

## Recommended next gate

下一步只建议授权 F3C1。它的交付物应是 Release-excluded protocol/operator guide、rollback evidence helper、disposable
repository/Linux tests、static guards 与生命周期尾注。F3C1 通过后必须停止，再分别授权 F3C2 和 F3C3；两条 live chain 都
通过后才进入 F3C4 aggregate closure。

F3C1 不需要为了“以后可能用到”修改 installer。若现有 current uninstall、v0.3.5 clean install 和 current forward migration
无法闭合，立即停止并把差异分类为 installer product defect 或 unsupported transition，再另做实现 Discovery。

<a name="phase-4-10-stop-rules"></a>

## Stop rules

- 未验证 committed disarm、clean worktree、activation absent 时不得开始 rollback。
- 不得把 direct old-over-new downgrade、armed/runtime-only rollback 或 silent token deletion改造成“方便路径”。
- 不得让 installer 获得 workspace writer 权限，也不得把 backup 当成 opt-in intent 恢复点。
- 不得依赖 cache、上个 task 的 install、shell-local export、模型口述或部分 stdout。
- 不得从当前 checkout 重建 v0.3.5 并冒充 Published Release。
- 任一 profile 的 Fresh/real Resume、doctor、identity、legacy profile、residue 或 final exit 缺证据时只能报告 incomplete。
- 不得在 F3C1 中顺手进入 live Cloud、创建 refs、清理 F3B evidence、seal、publication、promotion 或 Phase 9。

<a name="phase-4-10-decision"></a>

## Decision

现有架构足以进入一个独立的 F3C1 protocol/no-live materialization gate；没有发现必须先修改 production、contract 或 Release
bytes 才能设计安全 rollback 的问题。关键不是给旧 installer 增加“覆盖新版”能力，而是把 disarm、current-owned uninstall、
immutable old install 和 exact forward recovery组成受约束 transaction。

结论为：

`CONDITIONAL_GO_TO_F3C1_ROLLBACK_PROTOCOL_MATERIALIZATION / IMPLEMENTATION_NOT_AUTHORIZED / REFS_FROZEN`

这不是 rollback PASS，也不授权执行安装切换、创建 runtime-source ref、启动 Cloud、清理 refs 或进入 Release。

<a name="phase-4-10-verification"></a>

## Discovery verification

- focused F3/history/repository suite：22 tests，22 pass，0 fail，0 skipped；
- full Windows suite：166 tests，143 pass，0 fail，23 个 Linux/POSIX-only honest skips；
- importer、owned Python compile、`install.js`、全部 bootstrap Bash syntax 与 `git diff --check`：PASS；
- 两次独立 candidate build/check：均为 22 entries、85,533 bytes、SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`，字节身份一致；
- active planning machine-state residue 为 0；11 个 local F3B refs 与 11 个 remote-tracking refs 全部匹配；
- changed paths 与 Release v2 entries/external assets 交集为 0。本轮没有把旧 Cloud evidence 迁移给新 candidate bytes。

任何测试数字都只描述本次运行，不成为长期合同。
