<a name="phase-4-11-positioning"></a>

# Phase 4.11 — F3C4 aggregate closure Discovery

## 定位

本文件记录 F3C1 no-live、F3C2 smart rollback/recovery和 F3C3 autonomous rollback/recovery都通过之后，对 F3C4
aggregate closure做的 Release-excluded小型 Discovery。它回答的是：四份 live record、两项 revival negative、exact
runtime/asset/ref身份和残留审计能否组成同一份不混淆的 F3C结论，以及哪些对象现在仍不能退役。

本轮只审计 current exact HEAD、历史 acceptance、operator guide、validators、Git refs和可复现 candidate；没有重跑 Cloud，
没有修改 production、contracts、manifest、bundle、installer、bootstrap、README或 Release ZIP输入，也没有执行 closure、
aggregate PASS或 ref cleanup。

<a name="phase-4-11-evidence-matrix"></a>

## 四份 live record 对账

| profile | record stage | exact disarm workspace | repository state | 最终 installed role | transition | 已证明的结论 |
|---|---|---|---|---|---|---|
| smart | `rollback` | `c9275ba02073adb184cd73550c5b9f54c6f8178c` | `smart_prepared` | accepted `0.3.5` | `current_uninstall_then_accepted_clean_install` | immutable accepted runtime下 activation不复活，实际为 legacy |
| smart | `recovered` | 同一 smart disarm HEAD | `smart_prepared` | current `0.4.0-dev` | `accepted_to_current_exact_predecessor` | exact current恢复后仍 inert，实际为 legacy |
| autonomous | `rollback` | `98b6f138497af244563541ec655a1111198f0c36` | `autonomous_prepared` | accepted `0.3.5` | `current_uninstall_then_accepted_clean_install` | nonce/attestation/zero-ledger准备态未被旧 runtime摄取，实际为 legacy |
| autonomous | `recovered` | 同一 autonomous disarm HEAD | `autonomous_prepared` | current `0.4.0-dev` | `accepted_to_current_exact_predecessor` | exact current恢复后 autonomous仍不复活，实际为 legacy |

四份 record都记录 clean worktree、activation absent、真实 startup/real Resume、UserPromptSubmit、legacy Hook context、
`advisory=null`、healthy doctor、backup verified、snapshot leftovers 0和 final exit code 0。`profile`描述被审计的产品链，
`effective_profile`才描述 production实际选择；因此 autonomous record里的 `profile=autonomous` 与
`effective_profile=legacy`并不冲突。

Cloud中的四份 JSON是 disposable execution evidence。仓库保留 exact identity、字段关系 validator和 acceptance摘要，
不把 `/tmp` 文件复制成第二份事实权威。

<a name="phase-4-11-provenance-reconciliation"></a>

## 身份、负向证据与来源对账

共同身份保持一致：

- F3C protocol/runtime source为 `12a359096ab1e376014476b77a6b0833a7a90b2e`；
- current candidate两次独立 build/check均为 22 entries、85,533 bytes、SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`；
- immutable accepted source为 `v0.3.5` / `5d01b55890c1da2a5088e2b991b152a9fb1c3f87`，accepted ZIP SHA-256为
  `7d351cfe0eaa60e93bc279645ed3f480dc9e83efdff1c6abf13c14d84c286f0b`；
- immediate fallback `v0.3.4`仍解析到 `59a999f705701ec67463649e9424f3d059863c81`，只作为 publication oracle，
  不参与四份 live record的 installed transition。

Accepted v1 runtime result没有 current v2的 `effective_profile`字段；验收依据 exact accepted role、v1 request/result和实际
legacy context归一化为 legacy，而不是伪造旧 schema字段。每个 Cloud task的 backup原始计数只证明该 task内单调增加；跨 task
聚合只保留 `backup_verified=true`，不能把诸如 `3 → 6`当成全局身份。

F3C1还在 ref-aware Linux实际执行了 smart/autonomous两个 runtime-only revival negative：如果 rollback时只换 runtime而不先
disarm，workspace token会保留，current runtime回来后会复活。这两项 negative与四份 disarm-first live record互补，不能由
后者替代，也不能为了摘要简洁而删除。

<a name="phase-4-11-residue-audit"></a>

## Current HEAD、refs 与 residue 审计

- 11个 F3B2/F3B3 local validation refs与对应 11个 origin-tracking refs逐一相同；本轮没有移动、重建或删除它们。
- smart disarm ref仍只有 `.mode=inject-smart`而无 activation；autonomous disarm ref仍有 `.mode=autonomous`、原 nonce、
  与 `task_plan.md`字节一致的 attestation，且 activation和 ledger都不存在。
- current development HEAD在本轮 Discovery前没有 tracked planning machine state；新的活动 planning scope也保持 markerless，
  没有 `.mode`、activation、nonce、attestation或 ledger。
- repository scan没有发现 installed manifest、private snapshot、F3C evidence JSON、temporary candidate ZIP或 ledger residue。
- importer healthy，current candidate双构建字节相同；本轮 changed paths只在 `.planning/`、`docs/`与 `tests/`，与 Release v2
  entries/external assets交集必须保持为空。

本机另有历史 `validation/v0.3.1-s2-runbook` ref；它不属于 F3C的 11-ref retention set，本轮既不把它误计入 F3C，也不借机
清理它。

<a name="phase-4-11-lifecycle-ledger"></a>

## 对象生命周期总账

| 对象 | 本轮状态 | F3C4 closure建议动作 | 最早 retirement review |
|---|---|---|---|
| 11个 F3B2/F3B3 validation refs | exact local/origin pairs | KEEP，不移动、不删除 | F3C aggregate PASS + 当前 `0.4.0` Phase 9 instance complete + immutable recovery可用 + 维护者批准 |
| F3C operator guide | ACTIVE / Release-excluded | KEEP，closure后仍是逐 profile证据入口 | 当前 Phase 9完成或被等价 immutable运维证据替代后 |
| rollback validator与 tests | ACTIVE / Release-excluded | KEEP，继续防止四份 record关系和 revival negative退化 | F3C4 + Phase 9后，且有相同强度替代证据 |
| 四份 live JSON | Cloud task `/tmp` disposable | 不复制进仓库；只保留 acceptance摘要与 validator关系 | task销毁即退出；不得伪造重建 |
| accepted `v0.3.5` tag/source/ZIP | immutable external authority | 永不改写；closure只引用 | 不适用 |
| current development planning machine state | ABSENT | KEEP ABSENT；closure不得创建 activation/state | 若未来另一个明确 lifecycle gate授权 |
| Phase 4.10/4.11 history | append-only narrative evidence | KEEP；原时间语义不改写 | repository history policy |
| F3C protocol checkpoint commit | immutable Git object，无新增别名 ref | KEEP可恢复；不为 closure补建 ref | 当前 Phase 9后的统一 retention review |

当初保留 refs、guide和 validators不是“忘记清理”，而是 rollback与 Release窗口尚未结束。退出条件缺一项，就仍属于有 owner、
有用途、有复核点的活跃证据，不能按历史残留删除。

<a name="phase-4-11-closure-plan"></a>

## 建议的最小 F3C4 closure

若维护者下一轮授权 implementation，F3C4应只做 Release-excluded aggregate closure：

1. 在版本 acceptance和 ROADMAP中把四份已接受 live record与两项 no-live negative汇总为单一 F3C rollback结论；
2. 保留 smart/autonomous各自的 disarm HEAD、repository state和 installed-role关系，不把 profile证据压扁成“都为 legacy”；
3. 保留全部 11个 refs、operator guide、validator和 negative tests，不执行 retirement；
4. 不新增 evidence schema、Cloud task、Host ABI、trusted graph、production/runtime/installer或 Release输入；
5. 运行 focused/full regression、importer/compile/syntax、双 candidate、ref identity、residue和 Release-intersection postflight；
6. 只有全部检查闭合后才允许记录 aggregate F3C PASS，并停在 Phase 4 closeout/当前列车 Phase 9之前。

这一步是“把已经通过的四张成绩单装订、核对编号并登记保留期”，不是第五轮 rollback，也不是立即扔掉考卷。

<a name="phase-4-11-stop-rules"></a>

## Stop rules

- 四份 record任一 exact identity、transition、profile/stage字段或 Host/probe/final-exit来源无法对账，停止 closure。
- smart/autonomous prepared state、activation absence或两项 revival negative无法同时保留，停止 closure。
- local/origin ref不一致、ref不可恢复或出现未解释的 machine/snapshot/JSON/ZIP residue，停止 closure。
- closure若需要新 Cloud、schema、production、installer、contract、Release byte或 ref mutation，返回独立 Discovery。
- 不得把 F3C4 aggregate closure与 current `0.4.0` Phase 9、publication、promotion或 ref retirement合并授权。

<a name="phase-4-11-decision"></a>

## Decision

现有证据足以进入一个最小、Release-excluded、无需新 Cloud的 F3C4 aggregate closure implementation。四份 live record在
identity、transition与实际 legacy结果上相容，两项 no-live negative解释了为什么 disarm-first是必要条件；current tree、refs、
candidate和 residue也没有显示需要先修改 production或证据 schema的问题。

结论为：

`CONDITIONAL_GO_TO_F3C4_AGGREGATE_CLOSURE / IMPLEMENTATION_NOT_AUTHORIZED / REF_CLEANUP_NOT_AUTHORIZED`

这不是 `F3C_ROLLBACK_PASS`，不授权写 aggregate acceptance、删除 refs、进入 Phase 4 closeout/Phase 9或执行任何远端动作。

<a name="phase-4-11-verification"></a>

## Discovery verification

- exact refs、disarm machine-state、tag/source与四份 record关系：PASS；
- importer与两次独立 current candidate build/check：PASS；candidate均为 22 entries、85,533 bytes、SHA-256
  `df60010402d1faf937d82a66007bd6a7d78f557b8da41a14ab283922c9a4494c`，字节相同；
- focused F3C/history/repository suite：23 tests，21 pass，0 fail，2个 Linux-only honest skips；
- full Windows suite：172 tests，147 pass，0 fail，25个 Linux/POSIX-only honest skips；
- importer、owned Python compile、`install.js`、全部 bootstrap Bash syntax与 `git diff --check`：PASS；
- 11个 local/origin validation ref pairs完全一致；活动 planning machine state为 ABSENT；本轮 changed paths与 Release v2
  entries/external assets交集为 0。

测试数字只描述本次运行，不成为长期合同。
