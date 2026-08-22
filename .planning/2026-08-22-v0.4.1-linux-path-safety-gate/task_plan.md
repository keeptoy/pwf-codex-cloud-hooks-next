# Task Plan: v0.4.1 Linux/POSIX path-safety gate

## Goal

在真实Linux/POSIX文件系统的一次性fixture中验证`v0.4.1-dev` installer对symlink与special-file路径的fail-closed行为，并运行Linux零skip回归；只把真实平台结果写入candidate acceptance，不执行Cloud、seal或Release。

## Next Step

等待维护者选择真实Linux执行面：授权安装WSL发行版，或提供已有Linux/Cloud环境；不得以Git Bash冒充本gate证据。

## Current Phase

Phase 1 complete / Local Linux execution unavailable

## Phases

### Phase 1: Linux execution discovery

- [x] 探测WSL/现有容器，不安装新发行版或下载镜像。
- [ ] 确认可用Linux内核、Node>=18、Python3、Bash及Git。
- [ ] 冻结一次性Linux-native workspace与清理边界。
- **Status:** complete with NO_GO on current host

### Phase 2: Nearest POSIX boundary tests

- [ ] 在Linux原生文件系统运行installer symlink负向用例。
- [ ] 增加并运行FIFO或其他可移植special-file负向用例，证明backup/mutation前拒绝。
- [ ] 复核unknown regular file/directory仍可备份卸载。
- **Status:** pending

### Phase 3: Linux regression gate

- [ ] 运行完整Linux suite并要求0 fail、0 skip。
- [ ] 运行importer、Node/Python/Bash syntax、Git mode和diff检查。
- [ ] 双构建/check development ZIP。
- **Status:** pending

### Phase 4: Evidence and closeout

- [ ] 将真实Linux证据写入candidate acceptance与planning，不伪造Cloud结论。
- [ ] 风险相称验证后创建范围单一的本地commit。
- [ ] 汇总仍待Cloud/Release授权的gate并封账。
- **Status:** pending

## Frozen Invariants

- 使用真实Linux内核与POSIX filesystem对象；Git Bash或Windows模拟不能替代本gate。
- 所有安装、link、FIFO和删除只发生在一次性fixture/复制工作区，不触碰真实`/opt/codex`或用户global Skill。
- `hooks` parent、runtime root或nested entry为symlink/special path时，必须在backup、requirements write和runtime mutation前拒绝。
- unknown普通文件/目录的显式uninstall recovery合同保持不变。
- Host ABI、runtime bundle、managed events、adapter/runtime dispatch与sealed`v0.4.0`资产不变。

## Authorization

- 已授权：本地Linux/POSIX discovery、一次性fixture测试、必要的最近边界测试、候选acceptance/planning证据更新及本地commit。
- 未授权：安装WSL/容器、联网下载镜像、Cloud task、push/tag/Release、Latest、部署或真实`/opt/codex`变更。

## Stop Conditions

- 本机没有现成可用的真实Linux执行面，或Linux工具链不满足项目最低要求。
- Linux语义要求改变Host ABI、trusted graph、unknown cleanup合同或已发布v0.4.0字节。
- 发现需要root、真实系统requirements或非一次性外部状态才能复现。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| `wsl.exe`存在但没有已安装Linux发行版 | 1 | 未越权安装；等待维护者选择执行面 |
| Docker、Podman与nerdctl均不存在 | 1 | 当前主机没有可复用的容器Linux引擎 |

## Current Status

`LOCAL_LINUX_EXECUTION_NO_GO / WAITING_FOR_MAINTAINER_ENVIRONMENT_CHOICE / PRODUCTION_UNCHANGED`
