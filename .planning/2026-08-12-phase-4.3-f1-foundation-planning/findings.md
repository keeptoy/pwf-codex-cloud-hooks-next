# Findings: Phase 4.3 F1A/F1B Implementation Planning Discovery

## Status

`RESERVED / NOT_STARTED / IMPLEMENTATION_NOT_AUTHORIZED`

本文件是 Phase 4.3 下一轮探路的持续回写入口。当前只保存已确认的 lineage、路线与待决问题，不包含新的
源码扫描结论。讨论闭合后，从本文件提炼 Phase 4.3 历史摘要；在此之前不得把它描述为完成的设计。

## Inherited decisions

- Phase 4.1 已选择 hybrid owned validation + normalized private snapshot + pristine rendering；legacy 默认、两个
  managed turn-start events、adapter-only policy 与 read-only workspace boundary 不变。
- Phase 4.2 已采纳 `F1A → F1B → F2A → F2B → F3`。
- F1A 是 contract/source foundation；F1B 是 inactive runtime foundation，production
  `allowed_profiles=[legacy]` 且 marker 不可达。
- F1A/F1B 可独立审查和停止，但只要 runtime/schema bytes 进入 bundle/manifest/ZIP hash，最终 candidate 必须
  作为一笔完整 transaction 闭合，不能发布半套 contract 或半套 runtime。
- F2A/F2B 与 F3 不属于本轮；它们只约束 F1 interface、legacy compatibility 和 rollback shape。

## Exploration backlog

### Exact change inventory

- F1A manifest、bundle/Release、importer、installer、builder、doctor 与 tests。
- F1B plan protocols、adapter、owned-plan、state reader/normalizer 与 tests。
- 每个字段的 producer、consumer、owner、failure behavior、review trigger 与 retirement condition。

### Atomicity and dependency

- schema/runtime byte changes 到 bundle/manifest/Release/hash 的传播图。
- 可独立通过的 review checkpoint 与不可拆分的 build/install candidate 边界。
- 是否存在安全、可构建但不可发布的 staging checkpoint。

### Verification and exit

- failing-first tests、legacy golden equivalence、exact-key refusal、marker unreachable、partial takeover guards。
- Windows/Linux/no-live Cloud 与 deterministic ZIP 的职责分流。
- candidate → v0.3.5 → candidate takeover/rollback，不删除用户 marker/state。
- F1A/F1B 的进入、退出、停止条件以及 package identity 冻结时点。

## Closeout target

探路结束后在这里补齐 exact inventory、dependency graph、test matrix、atomic transaction、gate conditions 与
`GO / CONDITIONAL_GO / NO_GO`；随后才创建冻结的 Phase 4.3 history 摘要。
