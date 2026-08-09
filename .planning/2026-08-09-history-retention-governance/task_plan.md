# Task Plan: Repository History Retention Governance

## Goal

为当前仓库建立可迁移的历史文件归处、角色窗口、planning 退场、基线晋级和膨胀控制方法；在不削弱
trusted graph、Release 不可变性和历史可追溯性的前提下，让当前树长期保持单一 canonical baseline。

## Authorization

- H0–H6 在 `governance/history-retention` 上完成，基点是已推送的 `cde4b15`。
- 已授权创建本 planning scope、通用仓库治理指南和最小新人入口链接；治理模型已经维护者评审通过。
- 已授权 H4：以 failing-first 方式重构 repository governance guard，并在关键恢复点自动创建本地 commit。
- 已授权 H5：验证 immutable recovery 后，移除 completed planning、角色窗口外的历史 acceptance/runbook/
  bootstrap，并同步直接链接、历史 oracle 和治理测试；必要的 README/DESIGN/ROADMAP 路由更新属于 H5。
- H5 不修改 production、contracts、package identity、当前 `v0.3.2` bootstrap、Release contract 或 Cloud。
- 已授权 H6：同步唯一 authority，运行完整本地 regression、deterministic development package 与适用
  Windows checks，形成 source-merge 建议并创建本地关键恢复点。
- 已授权 H7：保留本地/远端 `0.3.2-dev` 不变，把当前分支改名为 `0.3.2-dev-extend` 并以同名推送；
  将本轮治理 delta 从 CHANGELOG 的 `0.3.2-dev` 章节迁入独立 extension 章节；删除经核验为空的旧
  `.planning` 子目录。
- H7 不 merge、创建 PR/tag/Release/asset，不运行 live Cloud 或 rollback promotion，也不改变 package
  identity `0.3.2-dev`。
- 已授权 H8：明确不把 extension 合回 `0.3.2-dev`，将 `0.3.2-dev-extend` 提升为仓库当前开发列车的
  source/governance 话术；`0.3.2-dev` 保留为 predecessor branch 和 package/Release candidate identity。
- H8 只修改本地 current-state authority、活动 planning 和治理断言；不 push，不改 package/contracts/
  bootstrap，不创建 PR/tag/Release/asset，也不运行 Cloud 或 rollback。

## Next Step

H0–H8 已完成；`0.3.2-dev-extend` 是当前 source/governance 开发列车且不计划合回 `0.3.2-dev`。
等待维护者授权新的治理任务或 Product Phase Discovery；不自动 push、PR、Release 或 Cloud gate。

## Phases

- [x] H0 — 从 `0.3.2-dev` 创建治理分支，恢复 authority、活动 planning 和已知测试证据。
- [x] H1 — 量化历史膨胀来源，形成热/温/冷分层、三类基线和角色窗口草案。
- [x] H2 — 生成可迁移的仓库治理指南，并加入维护者接手入口。
- [x] H3 — 维护者评审并冻结 retention contract、版本窗口与退出条件。
- [x] H4 — failing-first 重构 repository governance guards；不先删文件追求绿色。
- [x] H5 — 迁移 completed planning、旧 acceptance/runbook/bootstrap 和历史 oracle 引用。
- [x] H6 — 同步唯一 authority、运行完整 regression/package/platform gate，形成合并建议。
- [x] H7 — 分离 extension 分支与 CHANGELOG delta，清理空 planning 目录并推送同名远端分支。
- [x] H8 — 将 extension 确立为当前开发列车话术，明确不 merge，并保持 package/Release identity 不变。

## Status

H0–H8 完成；current-state authority 和治理断言已同步。明确不 merge，且没有授权 push、PR、Release、
Cloud 或 rollback。

## Branch Disposition

- **不 merge（维护者决定）**：`0.3.2-dev-extend` 独立承担当前 source/governance 开发列车；
  `0.3.2-dev` 保留为 predecessor branch 和底层 package/Release candidate identity。
- authority 已同步到 README 文档地图、CHANGELOG Unreleased 与 ROADMAP programme 摘要；ARCHITECTURE/
  DESIGN 无需复制第二份治理规则。
- 完整本地 regression 为 87 tests、75 PASS、12 Windows/POSIX SKIP、0 FAIL；适用 source/static/
  bootstrap checks 全部通过。
- development ZIP 双构建均为 23 entries、82,632 bytes、同一 SHA-256；该证据只说明当前候选字节
  可确定性重建，不建立 seal 或 Release identity。
- 相对 `0.3.2-dev@cde4b15`，候选没有 hooks、runtime、contracts、installer、importer/patcher、package
  contract 或当前 v0.3.1/v0.3.2 bootstrap 漂移；变化局限于治理、文档、planning 与治理测试。
- H6 的 source-merge GO 只保留为代码质量证据，不再代表计划中的下一动作。
- **非 Release/Cloud GO**：12 个 POSIX/Linux-only case 在 Windows 上诚实 SKIP，且本轮未运行 live Cloud、
  publication、rollback 或最终资产验收；后续相关 gate 必须重新执行平台证据。

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
| 新 documentation lifecycle test 把 handoff 链接标签误写成不含反引号的精确文本 | 1 | 分类为 test defect；改为验证标签包含目标语义且链接目的地精确，不改生产或文档内容 |
| PowerShell 环境中直接调用 `bash -n` 时找不到 `bash` | 1 | 分类为 platform limitation；不重复原命令，使用测试套件已采用的 Git for Windows Bash 探测路径，若不存在则诚实 SKIP |
| 仓库 Markdown link probe 把裁剪后的 upstream Skill fixture 当作完整文档检查 | 1 | 分类为 fixture scope error；排除 `tests/fixtures/` 后检查 repository-owned Markdown，fixture 完整性继续由其专属 import/runtime tests 负责 |
| 沙箱内最终 Node 聚焦测试无法创建 worker，两个文件均报 `spawn EPERM` | 1 | 分类为 sandbox execution limitation；获批后在沙箱外以同一命令复跑，12/12 PASS |
| CHANGELOG test 用 base header 的裸前缀定位时会命中未来 extension header | 1 | 在迁移正文前识别为 test defect；改用包含行尾的完整 Markdown header 定位 |
