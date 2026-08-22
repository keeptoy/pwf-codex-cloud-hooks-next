# Task Plan: v0.4.1 local acceptance and Cloud tutorial

## Goal

完成 `v0.4.1-dev` 路径安全修复的本地验收，并把维护者可照抄执行的 Source/Candidate Cloud 验收教程补全到版本 acceptance；默认职责是智能体负责本地实现、验证、教程和本地 commit，维护者负责 push 与手动开启/继续 Cloud task，除非维护者另行明确授权改变分工。

## Next Step

维护者审核并 push `0.4.1` 的最新本地 commit，然后严格按 `docs/v0.4.1-dev-cloud-hard-acceptance.md` 手动完成 Source/Candidate Cloud A～F；将原始输出带回后进入 Phase 5 evidence intake。

## Current Phase

Phase 4 complete / Waiting for maintainer Cloud run

## Phases

### Phase 1: Local execution discovery

- [x] 确认当前 Windows 维护机没有已安装 WSL 发行版或容器引擎。
- [x] 冻结 Git Bash 不得冒充真实 Linux/POSIX gate。
- [x] 维护者确认无需继续搜索本机 Linux 执行面。
- **Status:** complete

### Phase 2: Local candidate acceptance

- [x] 增加 Linux-only FIFO special-file 最近边界测试。
- [x] 运行 focused installer、完整 Windows suite、repository boundary、importer/syntax/mode/diff 和双构建检查。
- [x] 创建本地 commit `69304c7`；工作树 clean。
- **Status:** complete

### Phase 3: Responsibilities and Cloud tutorial

- [x] 将 `AGENTS.md` 的主机路由改写为默认职责分工，并保留“不重复探测 WSL/Docker”的执行记忆。
- [x] 对照两份 v0.4.0 operator/runbook 与稳定模板，盘点 v0.4.1 acceptance 缺口。
- [x] 补全维护者 push、手动开启 Cloud、Fresh/New Task/Resume、结果回传和 NO_GO 分流教程。
- [x] 确保教程只引用稳定模板协议，不复制第二份易漂移的通用命令 authority。
- **Status:** complete

### Phase 4: Documentation verification and local commit

- [x] 运行文档/架构边界测试、完整风险相称回归与 `git diff --check`。
- [x] 创建范围单一的本地文档 commit，不执行 push 或 Cloud task。
- [x] 将交接收敛为维护者下一步：push 后按教程手动开启 Source/Candidate Cloud。
- **Status:** complete

### Phase 5: Cloud evidence intake

- [ ] 维护者提供各轮 Cloud 原始输出后，核对 exact source、0 skip、Fresh/Resume 与路径安全证据。
- [ ] 只把真实结果写入版本 acceptance；未执行轮次保持 PENDING。
- [ ] 通过后封闭本 gate，并单独决定后续 seal/Release 授权。
- **Status:** pending / external maintainer action

## Frozen Invariants

- 默认职责：智能体做本地实现、验收、教程和本地 commit；维护者做 push、手动创建/继续 Cloud task 及其他远端写操作。
- 只有维护者针对当前动作明确授权时，智能体才偏离默认 Cloud 操作分工；历史授权不自动延续到新 gate。
- Source/Candidate 与 Published Release 环境、资产和结论严格分离。
- Linux/POSIX 证据必须来自真实 Cloud/Linux filesystem；Windows SKIP 不得伪装为 PASS。
- `v0.4.0` sealed 字节、Host ABI、runtime bundle、managed events 与 trusted graph 不变。
- 稳定通用命令与 evidence schema 由 `docs/cloud-hard-acceptance-template.md` 唯一维护；版本 acceptance 只冻结版本参数、轮次教程、当前状态和真实结果。

## Authorization

- 已授权：本地只读分析、文档和测试改动、本地验证、planning/acceptance 更新及本地 commit。
- 默认由维护者执行：push、Cloud task 的创建/继续/Resume、PR、tag、Release、Latest 与部署。
- 当前未授权智能体执行：任何远端写操作、Cloud task 创建、Published Release gate 或本机 WSL/容器安装。

## Stop Conditions

- 教程要求复制或改写稳定模板的通用协议，形成第二份 machine/command authority。
- 发现 v0.4.1 修复需要改变 Host ABI、trusted graph、unknown cleanup 合同或 sealed `v0.4.0` 字节。
- 验证依赖尚未 push 的 exact source、维护者 UI 操作或真实 Cloud 输出；此时完成本地教程后交接，不伪造结果。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 先前把“转 Source/Candidate Cloud”误解为智能体默认代启 Cloud | 1 | 维护者澄清标准分工；重写 plan 与 AGENTS，Cloud 启动默认交回维护者 |
| `wsl.exe` 存在但无发行版，Docker/Podman/nerdctl 不存在 | 1 | 固化为本机执行记忆；默认流程不再重复搜索 |

## Current Status

`LOCAL_ACCEPTANCE_PASS / CLOUD_TUTORIAL_READY / WAITING_FOR_MAINTAINER_PUSH_AND_CLOUD_OUTPUT`
