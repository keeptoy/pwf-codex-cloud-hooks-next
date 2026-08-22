# Progress: v0.4.1 Linux/POSIX path-safety gate

## Session: 2026-08-22

### Phase 1: Linux execution discovery

- **Status:** complete with local NO_GO
- 维护者授权继续Linux/POSIX symlink与special-file gate。
- 使用planning-with-files创建独立活动账本；上一`v0.4.1`本地实现plan保持closed。
- `wsl.exe`存在但没有任何已安装发行版；未执行系统级`wsl --install`。
- Docker、Podman、nerdctl均未安装；本机没有现成真实Linux执行面。
- 按gate规则拒绝用Git Bash/Windows模拟Linux结果；等待维护者提供或授权Linux/Cloud环境。

### Phase 2: Source and Cloud preflight

- **Status:** in progress
- 维护者授权直接走 Source/Candidate Cloud；未授权 push、PR、seal、Published Release 或发布。
- 使用官方 OpenAI 文档复核 Cloud 与 CLI 入口：Cloud 依赖已连接 repository/environment，CLI 可用 `codex cloud exec --env` 提交任务。
- 活动 task plan 已从本地 Linux 等待态切换为 Source/Candidate Cloud gate。
- `AGENTS.md` 已记录本维护机没有 WSL 发行版和容器引擎，并冻结 Linux gate 默认转 Cloud 的路由。
- `tests/installer.test.js` 已增加 Linux-only FIFO negative case；等待本地回归与 Cloud Linux 零 skip 证明。
- 本机 `codex-cli 0.148.0-alpha.9` 提供 `codex cloud exec --env <ENV_ID> --branch <BRANCH>`；只读 task 列表鉴权成功，历史环境标签为 `pwf-codex-cloud-hooks-next`，但 API 返回的 `environment_id` 为 `null`，仍需取得可提交的环境标识。
- 远端只读核对显示 `origin/0.4.1` 仍为 `a51f300f6ccff0dfeb3c3506a907649eedf0bf1c`；当前路径安全实现与本轮 FIFO/治理改动尚未远端可见，禁止用旧 branch 启动验收。
- importer、Node/Python syntax、Git mode 与 diff checks 通过；两次 development ZIP build/check 得到相同 22-entry、85,915-byte archive，SHA-256 均为 `543a72a57fdd7ca04854d5d1dfde6f838bf40e3afa5eb2c52c2d559b3843854a`，临时 ZIP 已删除。
- Windows Git Bash 的独立 `bash -n` 因本机路径映射/执行层限制无法打开工作区脚本；完整 suite 内的 bootstrap 行为测试已通过，但该结果不替代 Cloud Linux 语法与零 skip gate。

## Test Results

| Test | Result | Status |
|---|---|---|
| repository-boundary after plan switch | 14 pass / 0 fail | PASS |
| `git diff --check` after plan switch | exit 0 | PASS |
| WSL discovery | executable present / no distro | NO_GO |
| container engine discovery | docker/podman/nerdctl absent | NO_GO |
| focused installer suite | 42 pass / 0 fail / 2 Windows skips | PASS |
| full Windows suite after FIFO test | 158 pass / 0 fail / 26 skips | PASS |
| importer / Node / Python syntax / Git mode / diff | exit 0 | PASS |
| local deterministic ZIP build/check | 2 identical builds / 22 entries | PASS |
| standalone Git Bash syntax check | cannot resolve workspace script path | PLATFORM LIMITATION |
| repository-boundary after Cloud route update | 14 pass / 0 fail | PASS |
| final `git diff --check` before commit | exit 0 | PASS |

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| WSL返回未安装发行版提示 | 1 | 未越权安装，转维护者环境决策 |
| sandboxed `node --test` returned `spawn EPERM` | 1 | platform sandbox limitation；获准在沙箱外重跑后通过 |
| sandboxed `codex cloud list` network request failed | 1 | sandbox network limitation；获准只读联网重跑后成功 |
| Cloud task list omitted environment ID | 1 | 保留环境 label；继续检查 CLI/TUI 或要求维护者提供 ID |
| remote `0.4.1` is older than local candidate | 1 | 不提交旧 source；先验证并本地 commit，等待维护者 push |
| standalone Git Bash could not open either workspace bootstrap path | 3 | 不继续搜索本机兼容层；由 Cloud Linux gate 执行真实 `bash -n` |

## Current Status

`LOCAL_WINDOWS_PASS / CLOUD_SOURCE_NOT_YET_REMOTE / CLOUD_ENV_ID_PENDING`
