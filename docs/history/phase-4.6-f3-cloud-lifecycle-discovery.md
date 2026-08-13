<a name="phase-4-6-historical-position"></a>

# Phase 4.6：F3 Cloud lifecycle Discovery

## Historical position

本里程碑位于 `v0.4.0-dev` 的 F2B read-only autonomous consumer 完成本地与 Source/Candidate/no-live Cloud
验收之后。它只关闭 F3 的路线探路与施工分门，不表示真实 opt-in、rollback、Release 或 baseline promotion 已完成。

## Problem before

F2B 已经证明 managed runtime 能 fail-closed 地读取 smart/autonomous state，却没有证明 Cloud 用户能安全地产生、审核、
激活、撤销并跨 Fresh/Resume 保持这些状态。此前的 Git-backed 首选和 same-chat 备选仍有四个未闭合问题：

- 官方 Cloud review/follow-up 与 container cache 是否足以充当授权和状态持久化协议；
- pristine upstream initializer 是否能原子地产生当前 managed protocol；
- 本仓库 planning lifecycle 是否允许提交这些 machine files；
- runtime rollback 后遗留 activation 是否会在重新升级时复活。

## Core decisions

1. **Git-backed 双阶段保留为唯一首选。** preparation commit 只放 mode、nonce、attestation 和可选 ledger；第二个
   activation-only commit 只增加 profile-bound token。Fresh Cloud 从 exact activated commit 启动，不依赖未提交 worktree。
2. **same-chat 不进入首轮稳定验收。** 官方文档证明 review/follow-up 与最长 12 小时 container cache，但没有承诺未提交
   状态跨 checkout、maintenance、cache invalidation 或 rebuild 持久；它保留为以后单独 Discovery 的实验路线。
3. **不把 upstream initializer 当成完整 producer transaction。** pinned v3.8.2 的 initializer 会先写 mode/nonce，并吞掉
   attestation failure；F3 必须用 fail-closed preparation/verification，activation 始终最后且独立。
4. **autonomous 是 frozen-plan opt-in。** armed 后 task bytes 变化必须拒绝；修改执行计划需要先 disarm，再重新审核
   attestation，最后以新 activation-only commit re-arm。
5. **rollback 必须先处理 workspace intent。** 只回滚 runtime 会让 token 暂时 inert，却可能在未来升级时复活；支持路线
   必须先提交 disarm，再执行 candidate → accepted predecessor → candidate 的安装切换。
6. managed runtime 继续只读；不新增 Host event、managed writer、外部认证服务、secret、environment-token 或点击链接。

## Completed delivery

Discovery 将后续工作拆成三个可独立停止的 gate：

| Gate | 范围 | 完成后仍不代表 |
|---|---|---|
| F3A | active-scope machine-state 仓库准入、基于版本化命令和现有只读 probe 的 fail-closed prepare/verify、专用 runbook、local/Linux/no-live regression | 真实 Cloud activation PASS |
| F3B | smart/autonomous exact-commit Fresh、UserPrompt、real Resume、tamper refusal、disarm/re-arm 与 cache-independent behavior | rollback 或 Release PASS |
| F3C | disarm-first candidate → immutable v0.3.5 → candidate reinstall，验证无 dormant activation resurrection | seal、publication 或 baseline promotion |

F3A 必须保持 `.planning/` 在 Release 外，只允许 active plan 的 exact state names，拒绝 inactive/history scope 残留、链接、
未知文件和不完整 activation。它默认不新增 shipped executable；若实施时发现必须引入 helper，需先独立冻结其 distribution、
hash admission 与 retirement，不能顺手进入 managed inventory。F3B 的 autonomous 最小 happy path允许零 ledger；ledger writer 的长期 owner、lock、cache/
Resume durability 与 mutable gate state仍留给 Phase 8 Discovery。

## Acceptance conclusion

结论为 `CONDITIONAL_GO_TO_F3A_IMPLEMENTATION`。现有官方 Cloud 原语与 exact Git commit 足以形成高可信路线，但当前仓库
尚缺 machine-state governance、fail-closed preparation verifier 和 live runbook，因此不能从 Discovery 直接跳到 F3B。

本轮只读取官方文档、当前仓库和 manifest-pinned upstream archive；没有创建 activation state、没有执行 live Cloud 或
rollback，也没有修改 managed trusted graph。F3A 完成后必须再次停止并请求 F3B 授权；F3B PASS 后才可请求 F3C。

## Explicit non-goals

- 不宣称 Cloud cache 是 correctness、durability 或 consent boundary；
- 不支持未提交 same-chat state 作为稳定产品路线；
- 不让 activation token 承载用户身份、secret 或账户授权；
- 不把 optional ledger producer/durability 冒充为 Phase 4 已解决；
- 不授权 push、PR/merge、live activation、rollback execution、seal、publication 或 promotion。

## Successor inheritance

后继 F3A 继承 exact profile-bound tokens、F2B read-only admission 和 legacy 默认不变，只补 source/repository lifecycle，
不得新增第二套 runtime 或 managed writer。F3B 继承 Git 两阶段和 frozen-plan 语义；F3C 继承 disarm-first 规则。任一 gate
需要 cache continuity、模糊 HEAD、activation commit 混入其他变更或 runtime-only rollback，都必须停止而不是降级安全边界。

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/e3f6b1a2ad37f7976835f7a38070d105ce35b09c)

该链接只证明 Discovery 开始时的 F2B/no-live accepted source 状态，不解释当前实现；当前 contract、programme 与授权以
当前仓库 authority 为准。
