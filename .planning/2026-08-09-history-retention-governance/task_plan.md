# Task Plan: Repository History Retention Governance

## Goal

为当前仓库建立可迁移的历史文件归处、角色窗口、planning 退场、基线晋级和膨胀控制方法；在不削弱
trusted graph、Release 不可变性和历史可追溯性的前提下，让当前树长期保持单一 canonical baseline。

## Authorization

- 当前工作分支固定为 `governance/history-retention`，基点是已推送的 `cde4b15`。
- 已授权创建本 planning scope、通用仓库治理指南和最小新人入口链接；治理模型已经维护者评审通过。
- 已授权 H4：以 failing-first 方式重构 repository governance guard，并在关键恢复点自动创建本地 commit。
- 仍不删除或迁移历史文件，不修改 production、contracts、package identity、Release inputs 或 Cloud。
- 不 push、创建 PR/tag/Release/asset；H5 历史迁移仍须维护者再次确认。

## Next Step

先提交已经通过评审的治理模型作为独立恢复点，再把 repository-boundary 的全仓库静态清单重构为
可信区域 exact guard 与治理文档 lifecycle guard；不进入 H5 清退。

## Phases

- [x] H0 — 从 `0.3.2-dev` 创建治理分支，恢复 authority、活动 planning 和已知测试证据。
- [x] H1 — 量化历史膨胀来源，形成热/温/冷分层、三类基线和角色窗口草案。
- [x] H2 — 生成可迁移的仓库治理指南，并加入维护者接手入口。
- [x] H3 — 维护者评审并冻结 retention contract、版本窗口与退出条件。
- [ ] H4 — failing-first 重构 repository governance guards；不先删文件追求绿色。
- [ ] H5 — 迁移 completed planning、旧 acceptance/runbook/bootstrap 和历史 oracle 引用。
- [ ] H6 — 同步唯一 authority、运行完整 regression/package/platform gate，形成合并建议。

## Status

H0–H3 完成，治理模型已获批，H4 已授权并即将开始。当前分支继承一个已确认的 governance test
failure，production/runtime/Release contracts 未发现由此产生的行为变化；H5–H6 尚未授权。

## Provisional Exit Conditions

- 当前树只有一个 canonical production/source 布局，不创建版本化源码副本。
- `.planning/.active_plan` 只指向一个活动 scope；completed scopes 在结论提升后退出当前树。
- 当前树按角色保留 candidate 与 accepted baseline；更早字节只由 immutable Git/tag/Release 保存。
- provenance 只收录来源、迁移、trusted graph、Release/rollback 机制和基线晋级等里程碑。
- production/contracts/Release inputs 继续 exact allowlist；docs/planning 使用受控 pattern、角色和数量规则。
- 删除任何当前文件前，已验证 immutable ref 可恢复其原字节，所有跨文档链接和历史 oracle 已改路由。
- focused governance、完整 suite、deterministic package 和适用平台 gate 均按风险通过。

## Stop Conditions

- 需要改写已发布 tag、Release asset、SHA、acceptance 或历史 commit。
- 清退会删除唯一证据、破坏 rollback，或无法证明 immutable ref 可恢复。
- 需要改变 runtime、Host ABI、trusted graph、installer ownership 或 Release byte graph。
- 当前树、远端历史或文档 authority 对版本角色/证据归处发生冲突。
- 需要 push、Release、Cloud 或其他外部写操作而缺少明确授权；本地关键恢复点 commit 已获授权。

## Known Baseline Defect

- `cde4b15` 把新的 architecture planning scope 变为 tracked files 后，
  `tests/repository-boundary.test.js` 的全仓库精确清单没有同步；复跑结果为 3 tests / 2 pass / 1 fail。
- 上一轮完整 suite 是在这些文件尚未进入 Git index 时运行，因此没有覆盖提交后的 tracked inventory。
- 该问题归类为 validation sequencing defect + brittle governance policy，不是 runtime/Product defect；H4
  必须先设计分区 guard，不能只把更多 planning 路径追加到静态清单。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Windows `rg` 接收未展开的 `init-cloud-sandbox-v0.3.*.bash` glob，返回路径语法错误 | 1 | 后续使用 `git ls-files` 或 PowerShell 枚举后传精确路径，不重复原命令 |
| 提交后 repository inventory 与静态 `expectedPaths` 不一致 | 1 | 已保存原始失败并冻结为 H4 首个 failing-first 输入；本轮不弱化断言或伪报绿色 |
