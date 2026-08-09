# 变更日志

本文件只摘要仓库中已经发生的版本变化。开发目标、跨 Phase 路线和当前 lifecycle 见
[`ROADMAP.md`](ROADMAP.md)；当前唯一行动与授权边界见活动 `task_plan.md`；精确 source、资产、大小和
SHA-256 见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) 与对应 acceptance。

## Unreleased

### Changed

- 将稳定 architecture contract 与版本 lifecycle/history oracle 分层：架构测试不再冻结具体 acceptance、
  release commit、资产 hash 或某次状态；candidate/accepted 文件窗口改由 ROADMAP 角色动态派生。
- 当前树继续只保留一个 active planning scope；已完成的 Release/Cloud scope 由 Git 历史恢复，不作为
  永久工作区档案。
- Discovery 明确区分讨论态、决策态与实施态；探索性疑问和单点历史残留先触发只读全局盘点，不能在
  范围与清退方案尚未冻结时直接演变为批量删改。
- 在独立 gate 复核公开双资产不变性后，将已发布并完成 Cloud hard acceptance 的 v0.3.2 晋级为新的
  accepted baseline。
- 完成独立 P2 历史清理：v0.3.1 bootstrap 与验收全文退出当前树，通用供应链断言迁移到当前版本，
  默认 publication oracle 只保留 accepted baseline 与 immediate fallback；后继开发列车仍留给 P3。
- README 与智能体入口的 bootstrap 语法检查改为版本无关循环，避免每次角色轮换继续累积固定版本命令。
- 固化 promotion + eviction 的 retirement contract：两者可分 gate 审查，但旧角色未关闭前不得开启下一
  列车；稳定文档采用版本无关 guard，publication oracle 固定为 accepted + immediate fallback 两席轮换。

## v0.3.2

### Changed

- 将经过 `0.3.2-dev` 与 `0.3.2-dev-extend` 验证的 source/package identity 晋级为稳定 `0.3.2`。
- README 只保留稳定行为与文档入口；新增 DESIGN，集中维护仓库模块、依赖、改动落点和验证路由。
- 建立“CHANGELOG 记录实际变化、ROADMAP 维护 programme/lifecycle、活动 task plan 控制当前行动、
  provenance/acceptance 冻结证据”的文档分层。
- 新增可迁移仓库治理指南，并把 trusted source exact zones 与 planning/docs lifecycle zones 分开测试，
  避免活动治理文件变化削弱或误触发执行边界。
- 采用 candidate + accepted role window：当前树只保留一个 active planning scope、v0.3.1 accepted 入口
  和 v0.3.2 candidate 入口；更早 planning、runbook、acceptance 与 bootstrap 通过 immutable refs 恢复。

### Compatibility

- 该版本没有改变 production runtime、Host ABI、trusted graph、Hook 事件或安装行为；变化限于稳定身份、
  文档/治理边界和相应 guard。
- 后续目标与 Product Phase 授权状态只在 [`ROADMAP.md`](ROADMAP.md) 维护。
- 发布与 Cloud 验收状态见 [`docs/v0.3.2-cloud-hard-acceptance.md`](docs/v0.3.2-cloud-hard-acceptance.md)；
  完成 publication 后的精确身份再由 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) 收录。

## v0.3.1

### Fixed

- 收紧 Managed TOML ownership boundary，避免 repair/uninstall 把后续第三方 array tables 吸收到受管块；
  real install/repair 的 read/classify/propose/backup/write 进入同一 lock transaction，并拒绝覆盖锁外漂移。
- catch-up 将 transcript 选择、身份校验与解析绑定到同一份 verified immutable bytes，关闭校验后重新打开
  路径造成的 TOCTOU；Host input 同时采用精确 byte budget，未知、损坏或超限输入安全退化为 canary-only。

### Security and packaging

- 外部 bootstrap 不再通过 root NVM、floating Node 或 root `npx skills` 执行远程安装；改为验证平台
  Node.js `>=18`，并按 fixed SHA-256 校验 PWF archive 后只安装 pristine Skill subtree。
- Release ZIP 加入 importer 的直接 patcher 依赖，使解压后的 importer `check` 可以 self-contained 运行；
  bootstrap 继续保持在 ZIP 外。

### Compatibility

- 所有修复均位于同一 `0.3` 行为合同内，没有新增 Hook、Host ABI 或 trusted graph；生产 runtime 的入口
  与激活图不变。
- 精确身份见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，最终字节与 Cloud A～F 证据见
  [immutable v0.3.1 acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/435f830577ded23f8509a7befb95e8ba5128924f/docs/v0.3.1-cloud-hard-acceptance.md)。

## v0.3.0

- 建立 successor 仓库的首个稳定版本，保留已验收 canonical runtime 和 canary 行为。
- 发布 contract-driven ZIP 与独立 bootstrap，并完成最终下载资产和 Cloud 验收。
- 精确身份见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，验收证据见
  [immutable v0.3.0 acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/1454c9224c83d11c073b05baf6e536a11c3bb0e5/docs/v0.3.0-cloud-hard-acceptance.md)。

## v0.3.0-beta.2

- 冻结旧仓库中被 successor 迁移采用的产品基线和行为 oracle。
- 其 source、双资产与验收字节保持不可变；精确身份见
  [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，历史验收见
  [immutable beta.2 acceptance](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/blob/cde4b15bba7ed8580cb774c8b8bb259c9174c3d0/docs/v0.3.0-beta.2-cloud-hard-acceptance.md)。
