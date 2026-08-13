# Task Plan: Phase 4 F2B autonomous activation Discovery

## Goal

在不修改 production runtime、contract、installer 或用户行为的前提下，复核 F2B autonomous 所需的
attestation、nonce、normalized ledger、activation/consent 与 Cloud lifecycle；给出可实施、仅保留 inactive seam，
或 `NO_GO` 的证据化结论，并维护关键对象的生命周期与退休条件。

## Authorization

- Maintainer authorization: F2A Cloud 完成后进入 F2B 探路。
- Authorized: 只读代码/上游/合同/测试审计；官方 OpenAI 文档复核；Discovery planning/history/ROADMAP 必要同步；
  风险、方案、测试矩阵和退出条件设计；本地文档验证与 commit。
- Not authorized: F2B production implementation；创建真实 activation/nonce/attestation/ledger；live Cloud opt-in；F3；
  schema/Host ABI/trusted graph 变更；seal、publication、promotion、push 或其他远端写入。

## Next Step

等待维护者决定是否接受并授权两项后继实施前提：使用 exact `codex-managed-v1 autonomous\n` 作为 profile-bound、
last-written commit point；把 Cloud prepare/review/follow-up activation 作为 F3 可失败的 live hypothesis。未明确授权前保持
当前 smart-only production、autonomous unreachable seam 与 negative guards，不修改 runtime/contract/Release bytes。

## Phases

| Phase | Status | Exit condition |
|---|---|---|
| D0 Recovery and authority boundary | completed | F2A stop 已履行；Discovery-only 授权、官方本地/Cloud approval 差异与禁止事项明确 |
| D1 Upstream/current-tree protocol inventory | completed | producer/consumer、文件格式、call graph、hash/inventory 与残留 seam 完整 |
| D2 Threat/lifecycle and authorization analysis | completed | consent、tamper、cache、Resume、rollback、writer ownership 与 failure matrix 闭合 |
| D3 Options and implementation gate design | completed | full/inactive/defer 代价、最小 schema、tests、Cloud gates 与 stop conditions 可比较 |
| D4 Discovery conclusion and documentation | completed | `GO/CONDITIONAL_GO/NO_GO`、生命周期表、后继授权边界写回并通过文档验证 |

## Lifecycle ledger

| Object / seam | Current state | Discovery question | Required disposition |
|---|---|---|---|
| `.pwf-codex-managed` | F2A active commit point | F2B 是否复用，何时仍算显式 consent | KEEP/REPLACE + exact transition |
| `.mode=autonomous` | pristine upstream vocabulary；owned runtime currently rejects | 是否准入、如何与 activation 原子关联 | ADMIT/KEEP_DENIED |
| nonce | no owned consumer | producer、scope、freshness、replay 与 cache semantics | ADD/DEFER/DENY |
| attestation | no owned consumer | attest 什么 bytes/identity，谁写、谁撤销 | ADD/DEFER/DENY |
| ledger/progress | pristine helper exists；owned runtime no reader | normalized authority、raw progress fallback 与 lock/atomicity | ADD/DEFER/DENY |
| upstream initializer/writer | not installed/production trusted | 能否只作为 user-side producer；Cloud 如何显式触发 | EXTERNALIZE/DEFER/DENY |
| autonomous inactive interface | future-profile refusal only | 若 Cloud consent 无可靠路径，保留多窄的无行为接口 | KEEP/ADD/RETIRE |
| official Host consent callback | not established | 是否存在 exact user/repo/commit/plan/state binding | REQUIRE EVIDENCE / NO ASSUMPTION |

## Stop Conditions

- 需要假定未公开的 Cloud approval/callback、用户身份或 secret 传播语义；
- 需要 managed runtime 写 workspace，或把 setup secret/environment variable 当 plan-local consent；
- 无法定义 nonce/attestation/ledger 的单一 producer、scope、atomicity、cache/Resume 与 rollback 语义；
- 无效 autonomous 状态必须降级 legacy 才能工作，或 raw progress 能绕过 normalized ledger；
- 发现两条安全代价明显不同的架构路线需要维护者选择；
- Discovery 尚未闭合却需要修改 production、contract 或 Release bytes。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Official docs search did not surface a dedicated Cloud in-task consent callback | 1 | Opened current official approval, Cloud and environment pages directly; record only established local/Cloud surfaces and treat callback absence as unproven, not impossible forever. |
| Compact upstream test fixture does not contain initializer or attester scripts | 1 | Treat absence as current denied-source evidence; use pinned injector/helper bytes plus prior archive audit, and do not download or admit writers during Discovery. |

## Current status

`F2B_DISCOVERY_COMPLETE / CONDITIONAL_GO_TO_F2B_READ_ONLY_IMPLEMENTATION / IMPLEMENTATION_NOT_AUTHORIZED`
