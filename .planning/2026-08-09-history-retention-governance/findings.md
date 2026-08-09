# Findings: Repository History Retention Governance

## Maintainer Intent

- 把完整历史从当前工作树迁回 Git commit/tag/Release，不再让每轮 planning、acceptance 和 bootstrap 永久
  累加在 HEAD。
- 让 `BASELINE_PROVENANCE.md` 成为精选的来源/迁移/架构里程碑目录，而不是逐版本资产流水账。
- 常规版本 delta 进入 `CHANGELOG.md`；programme/current roles 继续只在 `ROADMAP.md`。
- 开发迭代使用 branch/worktree + 一个活动 planning scope；不复制第二套 production 源码目录。
- 提供一份可复制到新项目的治理指南，让新人能直接理解 authority、保留策略和晋级流程。

## Current Inventory Evidence

- 基点 `cde4b15` 的 tracked tree 约 79 paths；`.planning` 有 5 个 completed scopes、16 files、约 424 KB，
  是当前最大的非产品增长区。
- `docs` 有 6 files、约 141 KB；其中 M3/M4 迁移证据和 beta.2/v0.3.0/v0.3.1 acceptance 占主体。
- 根目录同时保留 v0.3.0、v0.3.1、v0.3.2 三个 bootstrap，约 61 KB；当前角色实际只需要 candidate
  v0.3.2 与 accepted v0.3.1 的运维窗口。
- Release contract 已排除 `.planning/`、`docs/` 和 `tests/`，因此治理区迁移与 production ZIP inventory
  原则上正交；README 或当前 bootstrap 如变化仍会改变 development candidate bytes，必须单独验证。

## Authority Model

| 问题 | 稳定归处 |
|---|---|
| 当前支持行为与命令 | README |
| 系统理由、信任边界与重大路径选择 | ARCHITECTURE |
| 实现布局与验证路由 | DESIGN |
| 常规版本 delta | CHANGELOG |
| programme、candidate/accepted/rollback 角色 | ROADMAP |
| upstream、不可变身份和精选里程碑索引 | BASELINE_PROVENANCE |
| 当前授权、研究、实施和验证流水 | 唯一活动 planning scope |
| 完整旧字节与逐次验收现场 | immutable commit/tag/Release |

## Recommended Retention Model

### Hot / Warm / Cold

- Hot：当前 canonical source、当前 candidate、当前 accepted baseline、一个活动 planning。
- Warm：紧凑 CHANGELOG、精选 provenance、当前 acceptance/rollback 路由。
- Cold：Git history、immutable tags/Releases、旧 acceptance、旧 bootstrap、completed planning。

### Three Baselines

- source baseline：branch 通过开发 gate 并合入 canonical source。
- release baseline：tag + sealed/downloaded assets 完成不可变验收。
- rollback baseline：真实 Cloud Fresh/Resume/doctor/rollback 后显式晋级。
- 前一层 PASS 不自动产生后一层身份。

### Role Window

- development 期间保留 candidate + accepted baseline；更早版本退出当前树。
- candidate 晋级并成为 accepted/rollback baseline 后，前一 accepted 退出当前树，仅保留 immutable refs。
- CHANGELOG 可保留紧凑版本索引，但不得吸收 SHA、测试流水或当前 lifecycle。

## Provenance Admission Rule

只有以下事件进入 provenance 里程碑：upstream/source pin、repository lineage/migration、Host ABI/trusted
graph、Release/rollback mechanism、长期基线晋级。普通 patch、文案、小功能和逐 gate 过程不进入；详细
字节/验收只链接 immutable ref。ARCHITECTURE Historical Context 保存“为什么”，provenance 保存“从哪里
来以及精确证据在哪里”。

## Iteration Model

- 推荐 branch/worktree 隔离，始终修改 canonical paths。
- `.planning/<slug>` 是可接受的迭代文件夹，但只放 plan/findings/progress；当前树最多一个活动 scope。
- 禁止在 `iterations/<version>/` 复制 hooks/runtime/contracts/tests 形成双权威。
- 必须实验时，`experiments/<slug>/` 需显式 Release-excluded、不可被 production import/dispatch，并在
  merge 前晋升有效结论后删除。

## Governance Guard Direction

- exact：production entrypoints、runtime、contracts、installer、Release allowlist、executable/mode。
- policy-based：docs、planning、handoff 等非执行治理区，检查允许 pattern、活动角色、数量上限、链接和
  Release exclusion。
- 当前 `expectedPaths` 把两类边界混为一体；它能发现 drift，但会把正常活动 planning 当作全仓库身份
  变化。H4 应保留安全 exactness，同时消除对 completed scope 名单的无限追加。

## Candidate Migration Order

1. 为分区 guard 写 failing-first tests，并捕获当前 tracked planning 红灯。
2. 只保留新活动 planning scope；旧 scopes 由 `cde4b15` 及更早 commits 恢复。
3. 当前窗口先保留 v0.3.1 + v0.3.2，移出 v0.3.0/beta.2 local acceptance/bootstrap 与 M3/M4 全文。
4. 把仍需保留的链接改为 immutable commit/tag/Release URL，历史 oracle 不再依赖当前根目录旧脚本。
5. 压缩 provenance 为 current baseline proof + milestone catalog；CHANGELOG 保留紧凑 delta。
6. 同步 AGENTS/README/DESIGN/ROADMAP/handoff 与治理测试，再跑完整 validation。
7. v0.3.2 真正晋级后执行第二次角色旋转：当前树只保留 v0.3.2 的 active assets/evidence。

## Non-Goals for Current Gate

- 不删除任何历史文件。
- 不改变 package/version、Release ZIP allowlist、bootstrap hash 或 published identity。
- 不宣称 `governance/history-retention` 已成为 source/release/rollback baseline。
- 不执行 Cloud、seal、publication、rollback promotion 或 push；本地关键恢复点 commit 已获授权。
