# Progress: v0.3.2 Release and Cloud Hard Acceptance

## 2026-08-09

- 维护者授权 non-force push 当前 extension 分支，并要求下一步发布 v0.3.2 ZIP 供其 Cloud 测试，同时
  生成 v0.3.2 Cloud hard acceptance。
- push 前确认本地 `809bdf3` 相对远端 `55bbf43` ahead 4、tracked tree clean；push 成功，远端同名分支
  快进为 `809bdf3`，没有移动 `0.3.2-dev`。
- 完整读取 planning-with-files skill 并运行 session catch-up；没有未同步输出。
- 已关闭的 history-retention scope 由已推送 `809bdf3` 恢复并退出当前树；创建本 scope 作为唯一活动
  Release/Cloud 施工现场。
- R0 开始：当前只恢复和冻结证据，不提前修改 production dispatch、最终发布哈希或外部 Release。
- 已确认 stable promotion 的直接身份文件至少包括 `package.json`、Release contract 与 candidate tests；
  bootstrap 已固定 v0.3.2 URL/name，但 zero hash 使其在 seal 前 fail closed。
- 开发 package oracle 已覆盖双构建、23-entry boundary、external bootstrap、extracted importer+patcher replay
  与 LF；正式 seal 仍需完整回归、最终 hash 写入后重验和发布后重新下载。
- 已恢复 v0.3.1 acceptance 的 gate 结构：local seal、publication、public-byte Cloud、promotion 相互独立；
  v0.3.2 当前只授权走到 publication/Cloud handoff，不自动 promotion。
- 一次 `git show` 因 revision 放在 `--` 后未输出预期历史 path diff，已记录并改用精确 blob/正确 revision
  语法继续核验。
- R0 remote collision probe：exact v0.3.2 tag 为空，GitHub Release 查询返回 expected not-found；目标身份
  尚未被占用。
- R0 对比确认 v0.3.2 ZIP 内无 production/runtime 行为变化，external bootstrap 只待 version/hash seal；
  结论 `GO` 进入 R1 stable identity，不授权跳过本地 seal 直接上传。
- R1 failing-first 聚焦测试 25 项中 21 PASS、4 FAIL；红项只对应尚未应用的 package/contract stable
  identity 与 CHANGELOG/ROADMAP/acceptance，planning lifecycle 和 bootstrap zero-hash gate 保持绿色。
- 已应用 R1 stable identity：package 与 Release contract 改为 `0.3.2`，同步 manifest contract hash；合并
  v0.3.2 CHANGELOG，ROADMAP 标为未 accepted 的获批 Release candidate，并新增 PRE-SEAL acceptance。
- acceptance 已提供 fail-closed 的公开 setup 骨架、v0.3.2 B～F 黑盒 fixture、证据模板和独立 promotion
  禁区；最终 ZIP/bootstrap/source 值仍为 PENDING，R3 前不可执行公开 setup。
- R1 完整候选暂存后，architecture/contracts/repository/release/skill-patch 聚焦测试 25/25 PASS；R1 关闭，
  进入 R2 local seal candidate。
- R2 完整 `npm test`：88 tests、76 PASS、12 Windows/POSIX SKIP、0 FAIL；package runner 显示 stable
  `pwf-codex-cloud-hooks@0.3.2`。
- importer、Python compile、Node syntax、upstream executable modes、`git diff --check` PASS；读取测试
  resolver 后定位 D: Git Bash，沙箱内受 signal-pipe 权限阻断，沙箱外复跑两个 bootstrap `bash -n` PASS。
- R2 独立双构建/check PASS：两份 ZIP 均为 23 entries、82,627 bytes、SHA-256 `b42aecaf...e5081`；
  staged input ledger 为 `37849a30...8a51`，全部 ZIP inputs 无 unstaged drift。
- R3 failing-first 聚焦测试 19 项中 16 PASS、3 FAIL；红项严格对应 bootstrap zero hash、acceptance
  PRE-SEAL 状态和 sealed ZIP assertion，其他 Release/历史 oracle/patch tests 保持绿色。
- 外部 v0.3.2 bootstrap 已只把默认 project ZIP hash 改为 R2 冻结的 `b42aecaf...e5081`；最终文件为
  21,565 bytes、SHA-256 `aa2c1fd64bfc8ee3804d5f4bf39f7816a2ca9ad9a96949336ec94a6c20f8f77c`。
- R3 final-hash focused 25/25 PASS；完整 `npm test` 再次为 88 tests、76 PASS、12 Windows/POSIX SKIP、
  0 FAIL；v0.3.2 bootstrap 的沙箱外 `bash -n` PASS。
- exact-name final ZIP build/check 仍为 23 entries、82,627 bytes、SHA-256 `b42aecaf...e5081`；R3 关闭，
  进入 R4 immutable publication，仍不授权 Latest/rollback promotion。
- 创建 sealed commit `c68a53b` 后从 clean worktree 重建同名 ZIP，双资产 size/SHA 均未变化；branch 已
  fast-forward push，lightweight `v0.3.2` tag 已首次创建并推送。
- GitHub Release v0.3.2 已创建为非 draft/非 prerelease 且 `latest=false`，恰好上传 ZIP 与 bootstrap。
- 公开 URL 重新下载核验 PASS：ZIP 82,627 / `b42aecaf...e5081`，bootstrap 21,565 / `aa2c1fd6...8f77c`；
  builder check、extracted importer replay PASS，Latest 仍为 v0.3.1。
- R4 evidence failing-first：architecture/release 13 tests 中 12 PASS、1 FAIL；v0.3.2 tag oracle 已绿色，
  唯一红项是 ROADMAP/Provenance/acceptance 尚未写回已发生 publication，现已同步。

## Validation Status

- R0–R4 PASS；R5-SC Attempt 1 因 test routing defect 停止，修复已本地验证，等待 Fresh Cloud 重跑；
  R5-PR 尚未开始，仍无 Cloud PASS。

## Current Handoff

- 当前执行 R5-SC Cloud handoff；v0.3.2 已 seal/tag/publication，但尚未通过 Cloud hard acceptance。
- `v0.3.1` 仍是唯一 accepted rollback/`Latest`。
- 维护者要求把 v0.3.2 Cloud hard acceptance 拆成两步：先源码构建/本地 override 安装并跑黑盒，再在
  独立 Fresh Cloud 中用公开 bootstrap 默认下载链重跑黑盒；两条证据不得混用。
- 已把 runbook 重构为 R5-SC 与 R5-PR：新增完整 Source/Candidate Linux 回归、双构建、精确 ZIP
  identity、本地 `file://` override 安装脚本；Published Release 保留固定 public bootstrap URL/SHA，
  且明确不设置 override。B～F 成为两条通道各自完整重跑的冻结 fixture。
- ROADMAP 与活动 task plan 已同步双通道 lifecycle；总 R5 只有在两条通道各自 PASS 后才能关闭，
  Latest/rollback 仍未授权。
- architecture contract test 已增加双通道 guard：保护 R5-SC/R5-PR 身份、显式 override/公开默认下载、
  容器与 B～F 证据隔离、两个 setup marker 以及三层 pending 状态。
- validation：更新后的 architecture/release focused tests 13/13 PASS；runbook 内 3 个 Bash code block 均
  经 Git Bash `bash -n` PASS；`git diff --check` PASS，未发现旧章节引用。
- 从当前树重新 build/check Release ZIP 仍为 23 entries、82,627 bytes、SHA-256
  `b42aecafaba650e5595acef8c138d142747da38dde04fa78bfb0a7f4235e5081`；本轮仅修改 ZIP 外的
  docs/planning/test guard，sealed tag/source、bootstrap 与公开 Release 资产不变。
- R5-SC Cloud Attempt 1 已按预期 fail-fast：tagless/no-remote `work@8a40f80` 通过所有静态检查，但完整
  Linux suite 的 published v0.3.2 tag oracle 因缺少本地 tag 成为唯一失败；ZIP/install/B～F 均未执行。
- 当前修复 gate：把 publication-only tag/history oracles 物理分离为独立 test file；R5-SC 只运行明确
  可在 tagless checkout 执行的 portable suite，默认本地 `npm test` 仍包含全部 oracles；同时把前置条件
  分流规则提升到 ROADMAP 第 7 节。
- failing-first governance test 为 9 tests / 7 PASS / 2 expected FAIL，红项精确对应 runbook 尚未分流
  publication oracle 与 ROADMAP 第 7 节尚未记录 checkout prerequisites。
- 三个 published tag/source/asset oracle 已物理迁入 `tests/published-release-oracles.test.js`；candidate ZIP
  与 identity drift 留在 `tests/release-package.test.js`。DESIGN reverse index 已同步，默认 `npm test`
  仍包含两个模块。
- R5-SC runbook 现在用 `find` 组装除 publication oracle 文件外的 portable suite，拒绝 oracle 泄漏，
  并输出 `V032_SC_EXCLUDED_TEST_SUITE=published-release-oracles.test.js`；不再把 scoped PASS 表述为完整 suite。
- ROADMAP 第 7 节已持久化 Source/Candidate、Publication audit、Published Release 三类 checkout 前置条件、
  验证职责与不可替代结论，并禁止为了测试绿色在 Cloud 补造 tag/remote。
- validation：architecture + candidate + publication focused 14/14 PASS；默认完整 `npm test` 为 90 tests、
  78 PASS、12 Windows/POSIX SKIP、0 FAIL，三个 publication oracle 实际通过；本地模拟 portable selection
  为 87 tests、75 PASS、12 Windows/POSIX SKIP、0 FAIL，且 oracle 未泄漏。
- 更新后的 3 个 runbook Bash blocks 均 `bash -n` PASS；JS syntax、`git diff --check` PASS；Release ZIP
  仍为 23 entries、82,627 bytes、SHA-256 `b42aecaf...e5081`，sealed/public assets 未变化。
- commit 后在受控临时 clone 中移除全部本地 tags 与 remote，确认工作树干净后执行同一 portable selection：
  87 tests、75 PASS、12 Windows/POSIX SKIP、0 FAIL；输出 `TAGLESS_NO_REMOTE=PASS`、
  `TAGLESS_NO_TAGS=PASS`、`TAGLESS_PORTABLE_SUITE=PASS`。首次 `--no-tags --local` 因本地优化仍复制 refs，
  fixture 已安全清理并改用显式删除临时 refs 的方法复验。
- 维护者反馈修复后的 R5-SC setup 以及后续 B～F 均可通过，并指出 Published Release 的 F 不能从
  workspace 获取 `install.js`：public bootstrap 正确清理了 setup 临时目录。当前进入 R5-PR post-resume
  verification redesign，目标是重新下载/校验/解压 public ZIP 并只用其中的维护工具完成深度断言。
- R5-PR F failing-first architecture governance 为 9 tests / 7 PASS / 2 expected FAIL，红项精确对应缺少
  channel-specific 10.2 与 ROADMAP 未冻结 bootstrap-cleanup/post-install tool provenance。
- runbook 第 10 节已拆成 10.1 R5-SC workspace 工具与 10.2 R5-PR public ZIP 工具；后者固定 URL/SHA/size，
  重下载并解压 ZIP，执行 builder check、importer check、ZIP 内 `install.js doctor`、package/contract/
  installed inventory/policy Python 深断言与 snapshot residue 检查，全程不读取 Git/workspace 工具。
- ROADMAP 第 7 节新增长期规则：bootstrap setup 临时目录可以正常清理；post-install 必须重新取得同一
  immutable ZIP 并使用其中的维护工具，禁止回退到可移动 workspace。
- validation：更新后的 architecture governance 9/9 PASS；4 个 Bash blocks 均 `bash -n` PASS；完整
  `npm test` 为 90 tests、78 PASS、12 Windows/POSIX SKIP、0 FAIL；`git diff --check` PASS；Release ZIP
  仍为 23 entries、82,627 bytes、SHA-256 `b42aecaf...e5081`。
