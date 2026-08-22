# Task Plan: v0.4.1 installer path safety patch train

## Goal

建立本地 `0.4.1` 兼容性修复列车，使 install/uninstall 在任何备份、共享配置写入或 runtime 删除前拒绝 symlink、junction、special path 与越界父路径，同时保留 unknown 普通文件可备份后显式卸载的 recovery 合同。

## Next Step

本地修复列车已封账。下一步仅在维护者另行授权时创建新planning，执行Linux/POSIX gate或后续Cloud/Release流程。

## Current Phase

Phase 6 complete / Local handoff

## Phases

### Phase 1: Discovery and development identity

- [x] 从已接受 `v0.4.0` 后继 HEAD 创建本地 `0.4.1` 分支。
- [x] 全量审计 install/repair/backup/uninstall 的路径创建、检查、复制、写入与删除顺序。
- [x] 冻结 threat model、支持/拒绝矩阵、非目标、回滚与停止条件。
- [x] 核对 patch-train package/bootstrap/ROADMAP/CHANGELOG 身份传播范围。
- **Status:** complete

### Phase 2: Nearest boundary tests

- [x] 先补 linked `hooks` parent 的 clean-install 写前拒绝。
- [x] 补 linked `hooks` parent 与 direct runtime link 的 uninstall 写前拒绝。
- [x] 保留 unknown regular file/directory 可备份后卸载的正向合同。
- [ ] Windows junction 与 Linux/POSIX symlink 分别提供真实平台证据。
- **Status:** complete on Windows; Linux/POSIX evidence pending Phase 5

### Phase 3: Minimal implementation

- [x] 增加 install/uninstall 共用或职责清晰的 no-follow path-topology admission。
- [x] admission 必须发生在 backup、requirements write、runtime write/delete 之前。
- [x] 不改变 exact current/predecessor inventory admission、unknown cleanup、Host ABI 或 runtime trusted graph。
- **Status:** complete

### Phase 4: Patch-train identity and documentation

- [x] 将本地开发身份原子传播为 `0.4.1-dev`，development bootstrap 保持 zero hash/fail closed。
- [x] 更新 CHANGELOG、ROADMAP 与稳定运维说明的唯一权威，不改写 `v0.4.0` 历史 acceptance/provenance。
- [x] 核对 Release allowlist 与 deterministic ZIP 输入闭合。
- **Status:** complete

### Phase 5: Verification

- [x] 运行 installer focused tests、repository/contracts/release seams 与完整 suite。
- [x] 运行 importer、Python/Node/Bash syntax、Git mode 与 `git diff --check`。
- [x] 双构建/check development ZIP；Windows 的 Linux/POSIX case 诚实 SKIP，并明确待 Linux gate。
- **Status:** complete on Windows; Linux/POSIX and Cloud gates remain unauthorized

### Phase 6: Commit and handoff

- [x] 按可恢复阶段创建范围单一的本地 commits。
- [x] 汇总本地 commit、测试、剩余 Linux/Cloud gate 与维护者后续动作。
- [x] 不执行 push、tag、Release、资产上传、Latest 切换或部署。
- **Status:** complete

## Frozen invariants

- `v0.4.0` tag、ZIP/bootstrap 字节、URL、SHA、acceptance 与 accepted 角色不可改写。
- unknown 普通 runtime 内容仍允许通过显式 uninstall 备份后清理；修复的是路径对象/父路径不可信，不是扩大 exact inventory ownership。
- linked/special/escaped path 必须在任何 managed backup、shared requirements write 或 runtime mutation 前 fail closed。
- global PWF Skill pristine；runtime bundle inventory、Host ABI、managed events、adapter-only graph 与 smart/autonomous 行为不变。
- production 不执行 workspace writer；本任务不进入 Cloud/Release/publication gate。

## Authorization

- 已授权：创建本地 `0.4.1` 分支与 `0.4.1-dev` 开发身份；修改 installer、最近边界测试和必要文档；运行本地/disposable 验证；创建范围单一的本地 commits。
- 未授权：远端 push/branch/tag、PR/Release、资产上传、Latest/Pre-release、Cloud 部署或真实 `/opt/codex` 安装变更。

## Stop Conditions

- 修复要求改变 Host ABI、runtime bundle/schema、managed event set、trusted graph、unknown cleanup 合同或 rollback 路线。
- Linux 与 Windows 对 link/path 语义出现无法由同一安全不变量解释的冲突。
- 需要修改已发布 `v0.4.0` sealed 字节、tag、acceptance 或公开资产。
- 发现不属于本 path-safety 缺口的重大 installer transaction/ownership 问题。

## Decisions Made

| Decision | Rationale |
|---|---|
| 使用 patch train `0.4.1` | 同一 `0.4` 行为合同内的安全兼容修复，不新增用户行为面 |
| 先 Discovery 与边界测试，再改 production | 路径安全属于关键 gate，必须先冻结拒绝矩阵与写前边界 |
| 不直接复用 exact install inventory admission 作为 uninstall guard | 必须保留 unknown-drift 的显式备份/清理出口 |
| topology admission 独立于 inventory admission | install/repair 仍要求 exact current/predecessor；uninstall 只拒绝 link/special topology，继续接受 unknown regular 内容 |
| 校验 `hooks` 与 runtime 两个 installer-owned component | 修复已证实的 parent junction 穿透与 direct runtime link；不擅自扩大到显式 `codexHome` 或其全部祖先 |
| backup 前校验，backup 后 mutation 前复核 | 缩小可利用的并发替换窗口；完全 race-free 的 fd-relative traversal 留待独立设计，不伪装成本 patch 已解决 |
| 0.4.1-dev 只接受 exact v0.4.0 predecessor | 当前 accepted 安装是唯一兼容前驱；published round-trip oracle 已证明前向接管、clean rollback 与直接降级拒绝 |
| 当前不写入 development ZIP 的 exact SHA | 双构建 SHA 只是本地可复现证据；bootstrap 按未授权 seal 规则继续使用64位zero hash |

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 查询了不存在的 `tools/build_release_zip.py` | 1 | 读取实际权威 `tools/build_release.py`，未产生文件变更 |
| 沙箱内Node子进程执行`git show`返回`EPERM` | 1 | 以只读授权从本地immutable `v0.4.0` tag提取exact predecessor |
| repository test新正则未转义`/` | 1 | 修正语法并复跑14/14通过 |
| 完整suite首跑仍冻结`### 4.1 v0.4.0` | 1 | 改为动态解析ROADMAP当前candidate；最终suite通过 |
| 沙箱内Git Bash无法创建signal pipe | 1 | 仅对两个bootstrap以授权的`bash -n`复跑通过 |

## Current Status

`V0_4_1_LOCAL_TRAIN_COMPLETE / WINDOWS_PATH_SAFETY_PASS / LINUX_CLOUD_RELEASE_NOT_AUTHORIZED / PLAN_CLOSED`
