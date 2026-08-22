# Progress: v0.4.1 installer path safety

## Session: 2026-08-22

### Phase 1: Discovery and development identity

- **Status:** complete
- 运行 planning-with-files session catch-up；无未同步上下文。
- 按仓库顺序复读 README、ARCHITECTURE、DESIGN、ROADMAP 与上一活动 planning。
- 确认工作树干净，`0.4.0` 本地分支领先远端 3 个已核对提交。
- 维护者明确授权创建本地 `0.4.1` 开发列车并修复 installer path-safety 漏洞。
- 创建并切换本地 `0.4.1` 分支；新 active planning 通过 repository-boundary 14/14 和 `git diff --check`，提交为 `5196030`。
- 初步审计 `install.js` 全部路径 mutation call sites，确认 clean install 的 early-return parent-link 漏检与 uninstall 的无准入删除路径。
- 初步盘点 package/Release/bootstrap 身份：目标开发身份应为 `0.4.1-dev`，并保留 sealed `v0.4.0` accepted 资产。
- 冻结路径状态矩阵：拒绝 linked/special `hooks`、runtime root 和 nested entry；unknown regular 内容仅 install/repair 拒绝，uninstall 继续备份后清理。
- 冻结最小实现：topology 与 inventory admission 分层，backup 前检查并在 mutation 前复核；不扩大到显式 `codexHome` 的祖先链。
- 核对版本窗口：candidate `v0.4.1-dev`、accepted `v0.4.0`、fallback `v0.3.5`；transition predecessor 轮换为 exact `0.4.0`。

### Phase 2: Nearest boundary tests

- **Status:** complete on Windows; Linux/POSIX evidence pending Phase 5
- 加入 clean-install linked/non-directory `hooks`、uninstall linked parent/direct runtime/nested link 的写前拒绝合同。
- 加入 unknown regular file/directory 内容仍可备份后卸载的正向合同。
- production 修改前 focused 运行：4 tests 中危险拓扑 3 fail，unknown cleanup 1 pass；父 junction uninstall 真实返回成功，direct runtime junction 仅在 `fs.cpSync` 偶发 `EPERM`，均非显式安全准入。

### Phase 3: Minimal implementation

- **Status:** complete
- 新增 `assertSafeRuntimeTopology()`：对 `hooks` parent、runtime root 与递归 entry 使用 `lstat`，拒绝 symlink/junction、非目录 component 和非 regular entry。
- `assertSafeRuntimeForInstall()` 复用 topology 结果后继续执行原有 exact current/predecessor inventory admission。
- install、repair、uninstall 在 capture/backup 前检查，并在 backup 后、任何 shared/runtime mutation 前复核。
- focused path-safety tests 4/4 通过；完整 installer tests 42 pass / 1 Windows Linux-only skip。

### Phase 4: Patch-train identity and documentation

- **Status:** in_progress

## Test Results

| Test | Result | Status |
|---|---|---|
| repository-boundary after plan switch | 14 pass / 0 fail | PASS |
| `git diff --check` after plan switch | exit 0 | PASS |
| focused path-safety before production | 1 pass / 3 expected fail | RED EVIDENCE |
| focused path-safety after production | 4 pass / 0 fail | PASS |
| complete installer tests after production | 42 pass / 0 fail / 1 skip | PASS |

## Errors

| Error | Attempt | Resolution |
|---|---:|---|

## Current Status

`IDENTITY_PROPAGATION_IN_PROGRESS / PATH_SAFETY_IMPLEMENTED / BRANCH_0_4_1_ACTIVE`
