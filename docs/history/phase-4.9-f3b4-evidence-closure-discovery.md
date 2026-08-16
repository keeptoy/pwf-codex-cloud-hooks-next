<a name="phase-4-9-positioning"></a>

# Phase 4.9：F3B4 evidence closure 小型 Discovery

## Historical position

本文件记录 F3B2 smart 与 F3B3 autonomous 真实 Cloud live 已分别通过后，进入 F3B4 前做的证据收口探路。它回答的
不是“profile 能不能运行”——两轮 live 已经回答——而是：十份 stage evidence 能否组成一条不冲突、可追溯、可供
F3C rollback 使用的完整 F3B 证据链，以及哪些 validation 对象必须保留、何时才允许退休。

本轮只做 Discovery。它不重跑 Cloud，不修改 production/runtime/contract/Release bytes，不移动或删除 validation refs，
也不把 F3B4 aggregate PASS、F3C GO 或 Release readiness 写成既成事实。

<a name="phase-4-9-evidence-inventory"></a>

## Exact evidence inventory

### F3B2 smart

共同身份：

- runtime source：`b37eea4706fed8d4e764f824eb75a3820f31c9be`；
- candidate SHA-256：`df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`；
- plan：`2026-08-14-phase-4-f3b2-smart-live`；task SHA-256
  `ff952594cba55f5525d9e3ed3d8dc67c924df4da5e8603b0894a38cd3bcde96e`。

| Record | Validation ref / exact workspace HEAD | Repository state | Actual profile | 关键证据 |
|---|---|---|---|---|
| `prepared` | `validation/v0.4.0-dev-f3b2-smart-prep` / `a39dc66c755ec19bf29504dc0844de995c6cf67c` | `smart_prepared` | `legacy` | preparation inert |
| `armed` | `validation/v0.4.0-dev-f3b2-smart-arm` / `1058e704d5ab3496ab1a91a414c20c2e8fe58177` | `smart_armed` | `smart` | Fresh + mandatory real Resume |
| `disarmed` | `validation/v0.4.0-dev-f3b2-smart-disarm` / `c9275ba02073adb184cd73550c5b9f54c6f8178c` | `smart_prepared` | `legacy` | activation-only deletion |
| `rearmed` | `validation/v0.4.0-dev-f3b2-smart-rearm` / `6dea2225812939f7a5f9893f2ab90782742a264c` | `smart_armed` | `smart` | activation-only re-entry |

四份 record 均为 clean worktree、`advisory=null`、doctor healthy、snapshot leftovers 0、最终 exit code 0；无可靠 cache
事实时记录 `unknown`。完整 Host/probe 解释仍由版本 acceptance 与 frozen operator guide 承重，本文件不复制原始 transcript。

### F3B3 autonomous

共同身份：

- runtime source：`a6fa03159a442b917f893fc51a7e3ed45b37371a`；
- candidate SHA-256：与 F3B2 完全相同；
- plan：`2026-08-16-phase-4-f3b3-autonomous-materialization`；
- initial task SHA/nonce：`415295db8617e87d8d63b94c891a7e1a1494f63024c96bba0993239564e9b552` /
  `d7d00d0fcb799f3f`；
- reprepared task SHA/nonce：`2f5cd2dcb0d5ce69fb000a97550096e1421e1cd6ad5569d570777cb744144878` /
  `c748f8700d4bfcd3`。

| Record | Validation ref / exact workspace HEAD | Repository/worktree state | Actual profile/advisory | 关键证据 |
|---|---|---|---|---|
| `prepared` | `validation/v0.4.0-dev-f3b3-autonomous-prep` / `d107c1cc53199415cc704553dafeab757060ae9e` | `autonomous_prepared` / clean | `legacy` / `null` | preparation inert；legacy raw progress |
| `armed` | `validation/v0.4.0-dev-f3b3-autonomous-arm` / `f43a744cbac7f7056d4efbf9b5cbd676bc1e4091` | `autonomous_armed` / clean | `autonomous` / `null` | initial nonce/SHA、zero ledger、Fresh + real Resume |
| `tampered` | no ref；original armed HEAD `f43a744cbac7f7056d4efbf9b5cbd676bc1e4091` | `tamper_only` | `null` / `state_unsafe` | canary-only refusal；environment destroyed |
| `disarmed` | `validation/v0.4.0-dev-f3b3-autonomous-disarm` / `98b6f138497af244563541ec655a1111198f0c36` | `autonomous_prepared` / clean | `legacy` / `null` | activation-only deletion |
| `reprepared` | `validation/v0.4.0-dev-f3b3-autonomous-reprep` / `5b20eb749c77dc1ac825202ca783dc7b8d938b58` | `autonomous_prepared` / clean | `legacy` / `null` | new task/nonce/attestation inert |
| `rearmed` | `validation/v0.4.0-dev-f3b3-autonomous-rearm` / `32b13b018176cd3bbaa15480864bf168754e5f67` | `autonomous_armed` / clean | `autonomous` / `null` | new identity、zero ledger、Fresh + real Resume；old identity absent |

正向五份 record 均为 clean、doctor healthy、snapshot leftovers 0、最终 exit code 0；tamper 的唯一 dirty path 是
`task_plan.md`，实际 tampered task SHA 为
`4264555784fb42dd0274f824c57a102bccc29a4f70217f83f2497e18b34a851a`。它没有 commit/ref，环境已销毁。

### Cross-chain reconciliation

- F3B3 runtime source 是 F3B2 runtime source 的后继；两者之间 production、contracts、bundle、manifest、installer、builder、
  bootstrap 与 README 字节无差异。
- 两轮从各自 exact runtime source 独立双构建得到同一 22-entry、85,533-byte candidate SHA。不同 source HEAD 表达不同的
  markerless governance checkpoint，不表达不同 runtime。
- smart 与 autonomous 使用不同 plan ID、workspace refs 和 profile-bound activation bytes，没有共享或改写对方 state。
- 十份 stage record 的 profile 关系互补但不冲突：prepared/disarmed/reprepared 一律 inert legacy；armed/rearmed 才采用请求的
  profile；tamper 一律 canary-only fail closed。

<a name="phase-4-9-provenance-model"></a>

## Evidence provenance model

F3B1 的 `validateF3EvidenceRecord()` 只验证 exact keys、格式和字段关系，不是 Host 或 Cloud 身份 authority。F3B4 继续使用
分层证据，不新增第二份 machine contract：

| 事实 | Authority |
|---|---|
| source/workspace 字节与 parent/path relation | exact Git commit/ref |
| candidate 内容 | Release contract + deterministic build/check + exact SHA-256 |
| Hook 是否实际出现 | 原始 Host canary/context 观察 |
| production 最终选择的 profile/advisory | installed `owned-plan.py` probe JSON |
| 安装健康与 residue | doctor JSON + snapshot scan |
| 长命令成败 | 工具返回的最终 exit code；部分 stdout 不能替代 |
| record 结构 | repository-only `validateF3EvidenceRecord()` |
| programme 结论 | version acceptance + ROADMAP + 本历史里程碑 |

Phase 4.7 曾把“Cloud task identities”列为未来写回项，但本次已接受回传没有平台导出的稳定 opaque task ID，evidence v1
也没有该字段。不能从对话、时间或分支名猜一个 ID，更不能为补表而改写 v1 schema。当前每个 task 的可审计身份是
`profile + stage + runtime_source_head + candidate_sha256 + workspace_lifecycle_head + plan ID + Host/probe/final-exit observations`
组成的 tuple。

因此 opaque platform task ID 的生命周期状态为 `NOT_EXPORTED / NOT_REQUIRED_BY_EVIDENCE_V1`。原始 Cloud transcript 与平台
内部 task metadata 仍是维护者控制的外部运行证据，不进入源码仓库、cache、consent 或 machine authority。未来若官方提供
稳定、可导出、可核对的 task ID，只能作为新执行实例的辅助 provenance；是否进入 evidence v2 必须另做 schema Discovery，
不得追溯伪造本轮值。

<a name="phase-4-9-residue-audit"></a>

## Markerless and residue audit

本轮只读扫描得到：

- 当前 `0.4.0-dev` active planning 由 repository admission 判定为 `legacy`；development tree 没有 `.mode`、`.nonce`、
  `.attestation`、`.plan-attestation`、`.pwf-codex-managed`、`ledger-*.jsonl` 或 `.stop_blocks`。
- local 与 remote-tracking F3B2/F3B3 validation refs 全部指向冻结 exact commits；parent 和 diff path 与 operator guide 一致。
- 没有 tamper ref；tamper environment 已销毁，tampered SHA 只存在于人类可读的负向证据。
- 仓库没有 live 产生的 ZIP、临时 state、private snapshot/cache、Cloud evidence JSON 或第二份 installed/source inventory。
  上游 Skill 文档名中的 `cache-safe-diagram.md` 只是 pinned source 文档，不是运行残留。
- runtime/install inventory 仍只由 `contracts/runtime-bundle-v2.json` 决定；installed manifest snapshot 与 Release allowlist
  职责不变。evidence summary 不承载文件 inventory。
- Phase 4.9、planning、ROADMAP、acceptance 与 tests 均位于 Release contract 排除区；本 Discovery 不改变 candidate bytes。

<a name="phase-4-9-retention-ledger"></a>

## Object retention ledger

| 对象 | 当前状态 / owner | F3B4 closure 动作 | 最早 retirement review |
|---|---|---|---|
| 两个 runtime-source refs | FROZEN ACCEPTED EVIDENCE / maintainer | KEEP；不得移动或合并 | F3C PASS + 当前 0.4.0 Phase 9 instance complete |
| smart prep/arm/disarm/rearm refs | FROZEN ACCEPTED EVIDENCE / maintainer | KEEP；尤其保留 disarm 前后对照 | 同上；由维护者人工退休 refs，历史 commit/acceptance 不改写 |
| autonomous prep/arm/disarm/reprep/rearm refs | FROZEN ACCEPTED EVIDENCE / maintainer | KEEP；供 rollback 与 re-attest 对照 | 同上 |
| tamper environment/ref | DESTROYED / ABSENT | KEEP ABSENT；禁止补建 ref | 不适用 |
| ten disposable evidence JSON records | EXECUTION-SCOPED / Cloud task owner | 不复制进仓库；保留 acceptance 中的审计摘要 | evidence v2 或 programme 归档策略另行评审 |
| two operator guides | ACCEPTED VERSION-SCOPED PROTOCOL / docs | KEEP through F3C and current Phase 9 | 版本退役/文档归档 gate |
| `validateF3EvidenceRecord()` 与 F3 tests | ACTIVE REPOSITORY GUARD / tests | KEEP through F3C | F3 closure 或 evidence v2 replacement 后评审 |
| Phase 4.7/4.8/4.9 history | IMMUTABLE-NARRATIVE EVIDENCE / docs history | KEEP；只能追加后继尾注 | repository history policy；不随 refs 一起删除 |
| current development machine state | ABSENT / active planning | KEEP ABSENT | Phase 4 production contract 明确改变时重新 Discovery |

这里的“Phase 9 后可复核”不是自动删除日期。只有 F3C rollback 已通过、0.4.0 当前列车的 Release instance 已完成、精确
commit 仍可由 tag/acceptance 恢复，并且维护者明确批准时，才可删除 validation ref 名称；不得删除 commit 历史、改写
acceptance，或让清理动作抢在 rollback 证据之前。

<a name="phase-4-9-closure-plan"></a>

## Recommended F3B4 closure implementation

后续若维护者单独授权，实现应保持为一个 Release-excluded docs/planning/tests gate：

1. 在本文件追加 post-implementation 尾注，记录 exact ref postflight、markerless audit、candidate 双构建和最终测试。
2. 把版本 acceptance 中 F3B4 从 Discovery conditional-go 提升为 `PASS`，写入
   `F3B_LIVE_LIFECYCLE_PASS / STOP_BEFORE_F3C`；不新增或复制十份 JSON。
3. 同步 ROADMAP 为完整 F3B PASS，并把唯一 Next Step 移到“讨论/Discovery F3C rollback”；F3C 仍是未授权 gate。
4. 保留全部 validation refs、operator guides、validator 与历史文件；不做所谓“顺手清理”。
5. 运行 focused/full regression、importer/source syntax、deterministic candidate 与 clean markerless postflight，然后创建单一
   local commit 并停止。

该 implementation 不需要新 Cloud，因为没有新 runtime/candidate/Host 行为；它只汇总已经通过的 exact Cloud evidence。
如果实现审计发现任一 ref 漂移、candidate 漂移、缺失 final exit provenance、development state 泄漏或 residue，则必须停止，
不能用文档结论覆盖缺口。

<a name="phase-4-9-stop-rules"></a>

## Stop rules

- 不得把 `CONDITIONAL_GO` 写成 aggregate F3B PASS，除非维护者另行授权 closure implementation 且全部本地 postflight 通过。
- 不得因 evidence 已总结就删除 refs；F3C 正需要 armed/disarmed/rearmed 对照证明 rollback 不复活 token。
- 不得为“完整”而伪造 Cloud task ID、缓存命中、原始 transcript、record JSON 或新增 evidence schema 字段。
- 不得修改 README、production、contract、manifest、bundle、installer、bootstrap 或任何 Release entry。
- 不得自动进入 F3C、seal、publication、promotion 或远端写入。

<a name="phase-4-9-decision"></a>

## Decision

现有 F3B2/F3B3 evidence 在 Git identity、candidate identity、Host/probe/doctor/final-exit provenance、profile relation 与
residue 边界上完整且互不冲突。没有发现需要新 Cloud、schema v2 或 production 修复才能闭合的问题；也没有发现现在应
删除的 validation 对象。

<a name="phase-4-9-verification"></a>

### Discovery verification

- focused F3/history/repository suite：21 tests，21 pass，0 fail，0 skipped；
- full Windows suite：165 tests，142 pass，0 fail，23 个 Linux/POSIX-only honest skips；
- importer、owned Python compile、`install.js`、全部 bootstrap Bash syntax 与 `git diff --check`：PASS；
- 两次独立 candidate build/check：均为 22 entries、85,533 bytes、SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`，逐字节身份一致。

结论为：

`CONDITIONAL_GO_TO_F3B4_EVIDENCE_CLOSURE / IMPLEMENTATION_NOT_AUTHORIZED / F3C_NOT_AUTHORIZED`

本结论只批准维护者下一轮考虑上节列出的最小 docs/planning/tests closure；它不自动产生
`F3B_LIVE_LIFECYCLE_PASS`，也不授权 ref cleanup、F3C rollback 或 Release。
