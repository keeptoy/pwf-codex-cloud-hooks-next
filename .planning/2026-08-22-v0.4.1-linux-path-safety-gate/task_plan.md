# Task Plan: v0.4.1 Source/Candidate Cloud path-safety gate

## Goal

在真实 Linux/POSIX Cloud 环境中验证 `v0.4.1-dev` installer 对 symlink、junction 对应的 POSIX link 与 special-file 路径的 fail-closed 行为，并按稳定 Source/Candidate 协议运行 Linux 零 skip、候选 ZIP 和 Fresh/Resume 黑盒验收；不执行 seal、Release 或任何远端仓库写操作。

## Next Step

确认本机 Codex Cloud CLI、Cloud environment 与远端可见的 exact source commit；先补 FIFO 最近边界测试和维护主机路由说明，再把精确 source 提交给一次性 Source/Candidate Cloud 环境执行 setup gate。

## Current Phase

Phase 2 in progress / Source and Cloud preflight

## Phases

### Phase 1: Local Linux execution discovery

- [x] 探测 WSL/现有容器，不安装新发行版或下载镜像。
- [x] 确认当前 Windows 维护机没有可用 Linux 发行版或容器引擎。
- [x] 冻结 Git Bash 不得冒充 Linux gate 的结论。
- **Status:** complete with local NO_GO

### Phase 2: Source and Cloud preflight

- [x] 在 `AGENTS.md` 固化当前维护机事实与 Source/Candidate Cloud 默认路由。
- [x] 增加 FIFO special-file 最近边界测试，Windows 诚实 SKIP、Linux 必须执行。
- [ ] 确认 Cloud CLI 鉴权、可用 environment 与远端可见 exact source commit。
- [x] 创建经验证的单一范围本地 commit，供维护者 push 或确认远端已可见。
- **Status:** in progress

### Phase 3: Source/Candidate Cloud setup gate

- [ ] 在独立、可丢弃 Cloud environment 检查 exact checkout 与 clean worktree。
- [ ] 按 `docs/cloud-hard-acceptance-template.md` 4.1 运行 Linux portable suite，要求 0 fail、0 skip。
- [ ] 运行 importer、Node/Python/Bash syntax、Git mode、diff 与双构建/check development ZIP。
- [ ] 用显式 local URL/exact SHA override 执行 candidate bootstrap，不接触 Published Release。
- **Status:** pending

### Phase 4: Fresh/Resume Cloud black-box gate

- [ ] 按模板第 5～8 节运行 Fresh、New Task、真实 Resume 与 adversarial negative checks。
- [ ] 确认 backup、requirements write 和 runtime mutation 前拒绝 link/special path。
- [ ] 复核 unknown regular file/directory 的显式 uninstall recovery 合同不变。
- **Status:** pending

### Phase 5: Evidence and closeout

- [ ] 将真实 Cloud/Linux 证据写入 candidate acceptance 与 planning，不伪造未运行结论。
- [ ] 风险相称验证后创建范围单一的本地 evidence commit。
- [ ] 汇总仍待维护者执行的 push/Release gate 并封账。
- **Status:** pending

## Frozen Invariants

- 使用真实 Linux 内核与 POSIX filesystem 对象；Git Bash 或 Windows 模拟不能替代本 gate。
- Source/Candidate 与 Published Release 环境、资产和结论严格分离。
- 所有安装、link、FIFO 和删除只发生在一次性 Cloud environment/fixture，不触碰维护者真实 `/opt/codex` 或 global Skill。
- `hooks` parent、runtime root 或 nested entry 为 symlink/special path 时，必须在 backup、requirements write 和 runtime mutation 前拒绝。
- unknown 普通文件/目录的显式 uninstall recovery 合同保持不变。
- Host ABI、runtime bundle、managed events、adapter/runtime dispatch 与 sealed `v0.4.0` 资产不变。

## Authorization

- 已授权：Source/Candidate Cloud task、一次性 Cloud fixture、必要的最近边界测试、`AGENTS.md` 维护主机路由说明、candidate acceptance/planning 证据更新及本地 commit。
- 未授权：安装 WSL/容器、联网下载本机镜像、push/tag/Release、Latest、PR、部署、Published Release gate 或真实持久环境变更。
- Cloud task 必须只做验证和返回证据，不得 push、创建 PR、发布或改写远端 source。

## Stop Conditions

- Cloud environment 无法 checkout 本地验证过的 exact source commit，或 setup 前 worktree 不干净。
- Cloud/Linux 工具链不满足模板最低要求，portable suite 出现 fail/skip，或无法证明真实 special-file 语义。
- Linux 语义要求改变 Host ABI、trusted graph、unknown cleanup 合同或已发布 `v0.4.0` 字节。
- 发现需要 root、Published Release、远端仓库写入或非一次性外部状态才能继续。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| `wsl.exe` 存在但没有已安装 Linux 发行版 | 1 | 不安装；维护者已选择 Source/Candidate Cloud 路线 |
| Docker、Podman 与 nerdctl 均不存在 | 1 | 不再重复探测；默认转 Cloud gate |

## Current Status

`SOURCE_CANDIDATE_CLOUD_AUTHORIZED / PREFLIGHT_IN_PROGRESS / REMOTE_WRITES_FORBIDDEN`
