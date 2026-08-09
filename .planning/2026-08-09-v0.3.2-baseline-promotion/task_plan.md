# Task Plan: v0.3.2 Promotion, Historical Cleanup, and Successor Handoff

## Goal

按三个互不混用的 gate 完成生命周期轮换：P1 只把已完成 Cloud hard acceptance 的 v0.3.2 晋级为
accepted rollback/GitHub `Latest`；P2 对 v0.3.1 及同类隐藏历史残留做全仓 Discovery 后实施获批清退；
P3 另开新 scope，才建立后继开发列车与 `v0.3.3-dev` machine identity。

## Authorization

- 维护者已经明确授权 P1：把 GitHub `Latest`/production rollback baseline 从 v0.3.1 晋级到 v0.3.2，
  并同步相应 acceptance 与 lifecycle authority；不得重发或改写任何 tag/asset/SHA。
- 维护者把 P2 定义为独立深度清理：目标是归档 v0.3.1，并扫描 `architecture-contracts.test.js` 一类隐藏
  历史残留。P2-D inventory 后已明确授权 P2-I，并补充允许删除 root v0.3.1 bootstrap、把 README/AGENTS
  固定版本命令改为可执行的版本无关循环；P2 完成后停在 P3 前讨论。
- P3 只记录为后续独立 gate；当前不修改 package、Release contract、bootstrap 或 `v0.3.3-dev` identity，
  不 seal、不发布、不部署新版本。
- 已完成的 `2026-08-09-architecture-contract-retention` 三文件由 immutable commit `d4cc3b5` 保存，P2
  可读取并吸收有效结论，但不作为第二个长期 `.planning` scope 重新进入当前树。

## Next Step

停在 P3 前与维护者共同讨论 successor train Discovery：先评估新的版本/machine identity、开发 bootstrap、
Release contract、验收骨架和退出条件，再决定是否授权创建独立 P3 scope。当前不得创建 P3 scope、
`v0.3.3-dev` identity、candidate ZIP、seal、Release 或部署。

## Gates

- [x] D0 — Discovery：全仓库 inventory、外部事实、恢复链、测试影响与候选路线。
- [x] D1 — Decision：维护者冻结 P1 → P2 → P3 三段式；P1 获得明确 GO，P2 先 Discovery，P3 未授权。
- [x] P1-A — Preflight：Latest=v0.3.1；v0.3.2 为非 draft/prerelease，双资产 size/digest 与 acceptance 一致。
- [x] P1-B — Pointer promotion：仅把 GitHub Latest 指向 v0.3.2，并完成独立后置查询。
- [x] P1-C — Evidence and authority：写入 v0.3.2 promotion evidence，旋转 ROADMAP/CHANGELOG 角色；provenance 按职责不复制当前角色。
- [x] P1-D — Validation：focused/full suite、published oracle、sealed ZIP identity、链接与 diff 全绿。
- [x] P2-D — Deep-clean Discovery：恢复旧 retention 结论，全仓扫描并冻结 hot/warm/cold inventory、删除集合、
  断言迁移、immutable 恢复链和停止条件；未获新 GO 前不删除。
- [x] P2-I — Historical cleanup：实施获批清退集合与 README 版本无关化，不开启新版本 identity。
- [ ] P3 — Successor train：另开 active scope 和 Discovery，建立获批的后继 machine identity。

## Stop Conditions

- 无法证明 v0.3.1 tag/Release/acceptance/bootstrap 可从 immutable ref 恢复。
- P1 前置或后置查询显示 v0.3.2 资产 identity 漂移、Release draft/prerelease、或 Latest 未按预期切换。
- 需要改写 v0.3.1/v0.3.2 tag、Release、asset、SHA 或 acceptance。
- 修改或重新发布 v0.3.1/v0.3.2 immutable tag、Release、asset、URL、SHA 或历史 acceptance。
- P2 后 current HEAD 仍被测试或文档宣称可以逐字重建 published v0.3.2，或被赋予新的 candidate/
  installable bootstrap 身份；它必须显式停在 P3 前的 unsealed governance transition。
- P2 删除唯一 immutable 恢复链、削弱 v0.3.1 immediate-fallback oracle 或丢失通用 bootstrap 安全断言。
- 任何 promotion/eviction 会削弱当前回滚能力、publication oracle 或 Release gate。

## Status

P1 PASS，P2 PASS；当前 HEAD 是 P3 前的 unsealed governance transition。v0.3.1 当前树副本已清退，
immediate fallback 仍由 immutable source/asset/acceptance oracle 保护；published v0.3.2 精确字节仍由
tag oracle 保护。P3 未授权，等待共同讨论。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Web open 拒绝直接访问 GitHub API URL，返回 unsafe/internal error | 1 | 改用获批的只读 `gh api` 查询同一官方 Release API，不重复 web open |
| Windows sandbox 中 `node --test tests/repository-boundary.test.js` 在 runner 隔离进程处 `spawn EPERM` | 1 | 分类为 platform limitation；改用 `--test-isolation=none` 在同一进程执行同一测试文件，不修改断言 |
| 沙箱外 guard 首次执行报告 active planning scope 未 tracked | 1 | 这是新 scope 尚未进入 Git index 的预期 checkpoint 状态；先显式 stage 仅 planning 轮换文件，再复跑 guard 后提交 |
| 沙箱内 `git add` 无法创建 `.git/index.lock` | 1 | 工作区未受损；按既有关键 checkpoint 自动 commit 授权，仅对 planning rotation 请求沙箱外 Git 写入 |
| 重写三段式活动计划的大块补丁因旧段落精确换行不匹配被拒绝 | 1 | 未产生部分修改；改用 UTF-8 复读后按标题分段应用，不重复原补丁 |
| P1 focused 20/20 PASS 后 `git diff --check` 报 acceptance 新增行 trailing whitespace | 1 | 只移除该行末空格，不修改证据内容；随后重跑 diff/full suite |
| PowerShell 环境没有全局 `bash` 命令，两条直接 `bash -n` 未执行 | 1 | 完整 suite 的 bootstrap 行为用例已 PASS；改用测试固定的 Git Bash 绝对路径做独立语法检查 |
| Git Bash 在沙箱内创建 signal pipe 失败，Win32 error 5 | 1 | 分类为 sandbox permission limitation；仅将两个只读 `-n` 检查移到沙箱外，均 PASS |
| P2 首轮 `rg` 把 PowerShell 不展开的 `*.md` 当作路径，返回 Windows illegal path | 1 | 前两段 inventory 已输出；后续改用 `rg ... . -g '*.md'`，不重复裸 shell glob |
| 合并 inventory 命令最后的 moving-URL `rg` 因零匹配返回 exit 1 | 1 | 前置清单均成功；零匹配本身是 clean 结果，后续不把预期 no-match 与产品失败混为一谈 |
