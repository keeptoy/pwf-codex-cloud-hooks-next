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

## Validation Status

- Pending R0.

## Current Handoff

- 当前执行 R0 Release Discovery；v0.3.2 尚未 seal、tag、发布或通过 Cloud。
- `v0.3.1` 仍是唯一 accepted rollback/`Latest`。
