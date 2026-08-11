# Task Plan: v0.3.4 Published Release

## Goal

把已经通过 Source/Candidate Cloud 的 Phase 3.8 兼容维护列车封板为 immutable `v0.3.4`，完成发布审计、
双资产公开下载复核和独立 Published Release Cloud hard acceptance；不改变产品行为、runtime inventory、
Host ABI、trusted graph 或 Product Phase 4 边界。

## Authorization

- 维护者已明确授权进入 Published Release gate，并同意先按三层文档职责建立独立 Release planning。
- 本轮 R0 允许整理稳定验收协议、版本证据与活动 Release plan，审计 seal 输入并冻结后续 gate。
- 授权覆盖后续按本计划顺序执行 machine identity、seal、publication、公开下载和 Published Release Cloud；
  每个关键 gate 仍须满足前置条件，失败即停，不得跳步或把 Source/Candidate PASS 当成最终发布 PASS。
- rollback/Latest promotion、旧版本 eviction 和 Product Phase 4 不在本计划授权范围内。

## Invariants

- Source/Candidate 证据严格绑定 commit `dc20ef9133b1998e70e733f233e97c9ac8a0bc76` 与其 zero-hash candidate
  通道，不得改写或冒充 Published Release 证据。
- `v0.3.3` accepted 与 `v0.3.2` immediate fallback 在独立 promotion gate 前保持不变。
- Release ZIP 继续由 `contracts/release-artifact-v1.json` 精确 allowlist 构建，bootstrap 永远在 ZIP 外。
- runtime bundle 是 source/install inventory 唯一权威；installed snapshot 与 ZIP allowlist 继续承担各自职责。
- 最终 tag、ZIP/bootstrap 字节、URL 与 SHA 一旦发布即不可改写；任一封板输入变化都必须重新 seal。
- 不新增或激活 Phase 4 文件，不改变 managed adapter-only policy、installed layout 或 upstream pristine bytes。

## Gates

- [x] R0 — Entry/freeze：固化文档职责，审计 exact Release inputs、目标 identity、资产名与停止条件。
- [ ] R1 — Stable identity：把 machine/package/bootstrap/acceptance 身份从 `0.3.4-dev` 原子收敛为 `0.3.4`，
  同步 contracts/hashes/docs/tests，并完成完整本地/Linux 回归和双构建检查。
- [ ] R2 — Seal：冻结全部 ZIP 输入，双构建逐字一致，计算最终 ZIP SHA，写入 ZIP 外 bootstrap，再计算
  bootstrap SHA；任何输入变化都回到 R2 起点。
- [ ] R3 — Publication audit：在具备 exact refs 的维护环境验证 tag/source/asset oracle 和完整 suite。
- [ ] R4 — Immutable publication：创建并发布最终 tag 与双资产，重新下载并核对 filename/size/SHA/内容。
- [ ] R5 — Published Release Cloud：在独立 Fresh Cloud 中从 immutable public bootstrap 执行 B-PR/C/D/E1/E2
  与 9.2 deep check，不使用本地 ZIP、checkout 同名脚本或 Source/Candidate 环境。
- [ ] R6 — Evidence close：把两条通道的最终不可变证据一次性写入版本 acceptance，关闭本 Release gate。

## Next Step

进入 R1：原子收敛 `0.3.4` stable machine identity，重命名 bootstrap/acceptance，同步 release contract、
manifest integrity、版本文档和边界测试；完成完整本地/Linux 回归与双构建后停在 R2 seal 前复核。

## Decision

`PUBLISHED_RELEASE_GATE_AUTHORIZED / R0_COMPLETE / R1_NEXT / SEAL_NOT_STARTED / PHASE4_NOT_AUTHORIZED`

## Stop Conditions

- stable identity 需要改变 product behavior、runtime inventory、Host ABI、trusted graph 或 Phase 4 准入。
- 当前 source 不包含已通过 Source/Candidate 的实现祖先，或 Release 输入与已测 candidate 出现无法解释的漂移。
- 两次 ZIP 不逐字一致，builder/importer/installer integrity check 失败，或 bootstrap 被纳入 ZIP。
- 目标 tag/Release/asset identity 已存在且字节不完全相同，或公开下载无法验证 exact SHA。
- Published Cloud 不是 Fresh 环境、使用 moving URL/本地 override，或任一 B-PR～9.2 步骤失败。
- 需要 rollback/Latest promotion、历史 eviction 或 Product Phase 4 权限才能继续。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Windows sandbox 内 `node --test` 因 child-process `spawn EPERM` 未执行断言 | 1 | 在获准的沙箱外重跑 focused suite，17/17 PASS；完整 `npm test` 同样在沙箱外通过 |
