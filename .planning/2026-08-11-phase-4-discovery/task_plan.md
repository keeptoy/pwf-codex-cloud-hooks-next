# Task Plan: Phase 4 Discovery

## Goal

在 v0.3.5 accepted baseline 与本地 `0.4.0-dev` 上，对 attestation、nonce framing 和 opt-in v3 modes 做第一轮
独立 Discovery：恢复 pinned upstream、当前 runtime/Host ABI、Cloud lifecycle 与 C2 contract-v2 证据，冻结可选
架构、默认关闭语义、source admission、tamper/cache/rollback 模型、验证矩阵和实施退出条件。

本 scope 只决定“是否做、怎么分 gate、必须证明什么”，不直接激活 Phase 4 行为。

## Authorization

- 维护者已明确要求进入 Phase 4 Discovery；授权本地只读源码/历史/contract 扫描、官方 OpenAI 文档核对、
  非生产探针、fixture/设计文档与本 planning scope 的更新。
- 当前没有 production implementation、machine-contract rotation、package identity、Release、Cloud 写入、部署或
  远端变更授权。
- 若需要 live Cloud probe，必须先设计无副作用脚本、输入/输出、清理与停止条件，再由维护者单独执行或授权。
- C2 的 `CONDITIONAL_GO` 只是输入：contract-v2 foundation 是否落地、采用什么 shape，必须等本 Discovery 联合裁决。

## Gates

- [x] D0 — Scope transition：关闭 current-tree cleanup scope，建立唯一 Phase 4 active planning，并同步 ROADMAP
  lifecycle；未改变 package/machine identity。
- [x] D1 — Evidence recovery and inventory：扫描 pinned upstream v3 mode/attestation/nonce/ledger 文件、
  当前 owned snapshot 投影、Host contracts、Cloud fixtures、source/install/ZIP inventory 与 denied surfaces。
- [x] D2 — Upstream semantic model：画出 legacy/autonomous/gated 与正交 smart-injection opt-in 的输入、读写、
  attestation、nonce、ledger、completion 与失败语义，区分 parser/helper、CLI 与真实依赖 closure。
- [ ] D3 — Host/Cloud ABI reconciliation（进行中）：以当前官方文档和带日期 Cloud 证据核对事件、input/output、并发、managed
  policy、cache/Fresh/Resume；把 Phase 5～8 新 Host 能力与 Phase 4 明确隔离。
- [ ] D4 — Architecture options：比较最小 snapshot projection、owned wrapper/state machine、上游 CLI 调用等路线，
  冻结 trusted graph、状态 owner、原子性、并发和 fail-open/fail-closed 边界。
- [ ] D5 — Source admission and C2 intersection：决定 upstream/local、source-only/installed schemas、`origin`、
  `language/host_dependencies` 与 contract-v2 foundation 的 shape/placement；建立字段生命周期表。
- [ ] D6 — Threat, compatibility and validation matrix：冻结 tamper、replay/nonce、cache、concurrency、partial write、
  rollback、legacy parity、Fresh/Resume、Linux/Cloud 与 Release 证据。
- [ ] D7 — Route freeze：输出 `GO / CONDITIONAL_GO / NO_GO`，划分 inactive foundation、opt-in activation、Cloud、
  Release 与 rollback gates；Discovery 结束即停，等待维护者授权实施。

## Next Step

执行 D3 Host/Cloud reconciliation：把官方 Hook 并发、SessionStart source、transcript 非稳定性与 Cloud
setup/cache/Resume 生命周期映射到 Phase 4 所需输入；明确哪些可用现有两个 managed events完成，哪些必须延后。
只写 findings，不修改 contracts/production/Release inputs。

## Current decision

`PHASE4_DISCOVERY_AUTHORIZED / D1-D2_COMPLETE / D3_IN_PROGRESS / IMPLEMENTATION_NOT_AUTHORIZED / LEGACY_DEFAULT_FROZEN`

## Invariants

- v0.3.5、v0.3.4 及更早已发布 tag、source、ZIP/bootstrap、SHA、acceptance 与 rollback 证据不可改写。
- `0.4.0-dev` 只是本地探路分支，不是 `0.4.0-*` package/machine identity。
- managed legacy 必须保持默认；没有显式、验证过的 opt-in 时，输出与 v0.3.5 行为等价。
- global PWF Skill 保持 pristine；production 只执行 installer 管理、bundle/manifest allowlist 固定的 owned runtime。
- Managed policy 继续只注册 absolute adapter；不得把 upstream script 或 owned child 直接注册为平台 handler。
- adapter 继续只承担 Host boundary、监督与组合；不得在 adapter 中建立第二套 plan/mode/ledger 算法。
- integrity、state identity 与内容注入 fail closed；advisory child failure 对 Codex loop fail open，且不能压掉 canary
  或其他已验证上下文。
- transcript 是可变、非稳定 Host data；优先使用 `session_id` 与已验证 `transcript_path`，不把 store 扫描升级为默认。
- Discovery 不写真实用户 plan 的 `.mode`、attestation、nonce 或 ledger；任何 mutation probe 只允许在受控 fixture。
- Phase 5 compaction、Phase 6 tool/permission、Phase 7 advisory completion、Phase 8 hard Stop 不因官方 ABI 已存在就
  自动并入 Phase 4；本轮只记录交界和前置约束。
- C2 v2 不先实施；若 Phase 4 需要不同 entry/source/schema shape，先修订设计，避免连续 schema rotation。

## Discovery questions

1. pinned v3.8.2 中 legacy/autonomous/gated 与 smart-injection token 的组合、输入文件、调用链和 mutation surface 是什么？
2. attestation 证明什么，nonce 防什么；验证失败、缺失、重放和并发时各应如何降级？
3. private snapshot 能否最小、安全地投影所需 metadata/state，还是需要新的 owned state boundary？
4. opt-in authority 放在哪里，如何做到用户可理解、Host 可验证、默认 legacy 且 rollback 可逆？
5. 哪些 upstream scripts 必须 source-admit/install，哪些只需复用 helper，哪些应由 owned runtime 重写边界？
6. installed plan schemas 与 source-only catch-up schemas 是否应统一，谁是 producer/consumer/owner？
7. Phase 4 source shape 是否支持 C2 的 `upstream_files` / `local_files` 分区；`origin` 是否删除？
8. Cloud cache、Fresh/Resume、concurrent hooks、timeout/cleanup 与跨版本 takeover 如何进入 acceptance？

## Stop Conditions

- 官方 Host ABI 与当前 Cloud fixture 冲突，或关键字段/事件没有稳定证据。
- 上游 mode/attestation 需要扩大 trusted graph、写用户状态或执行新 source，但 owner、原子性或 rollback 未冻结。
- legacy 默认、canary、advisory fail-open 或 current transcript safety 无法保持。
- C2 contract shape 与 Phase 4 admission shape 冲突；停在 Discovery 修订，不先做 v2 再升 v3。
- 需要 live Cloud、外部部署、Release、远端写或真实用户数据 mutation 才能继续；先请求独立授权。
- 出现两个以上代价明显不同的安全路线而维护者尚未选择。

## Errors encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 官方文档首轮精确搜索没有返回可用结果 | 2 | 改用官方 Codex docs 导航页，实际打开 Hooks 与 Cloud environment 页面；没有使用搜索摘要作结论 |
| active planning focused test 报 `active task plan lacks Stop Conditions` | 1 | 标题大小写未满足 repository lifecycle exact contract；修正为 `## Stop Conditions` 后重跑原测试 |
| 盘点命令读取不存在的 `contracts/managed-hook-request-v1.json` | 1 | 用 `rg --files contracts` 恢复真实名称，改读 `adapter-plan-context-request-v1.schema.json` 与 result contract |
| Windows `node --test <two files>` 在 runner 启动子进程时报 `spawn EPERM` | 1 | 分类为本地 runner/sandbox limitation；改用 `node <test-file>` 单进程逐文件执行同一断言，不跳过测试 |
| 沙箱内 `git commit` 无法创建 `.git/index.lock` | 1 | 工作树无冲突；按仓库纪律仅请求沙箱外本地 add/commit，不执行 push |
| `python -m unittest <hyphenated-path>` 把 `planning-with-files-3.8.2` 解析为 module name | 1 | 改在 pinned extraction 根目录直接逐个执行测试脚本，避免错误 module discovery |
| upstream Python tests 无权写系统 `%TEMP%` fixture | 1 | 分类为沙箱 tempfile limitation；在沙箱外运行相同只读源码/临时 fixture 测试，不写仓库或外部系统 |
| Windows 默认 GBK 解码 upstream UTF-8 Hook 输出失败 | 1 | 设置 `PYTHONUTF8=1` 后重跑完整 targeted group；不修改 upstream tests 或输出 |
