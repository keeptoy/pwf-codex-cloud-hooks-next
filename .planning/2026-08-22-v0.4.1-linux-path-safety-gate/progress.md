# Progress: v0.4.1 local acceptance and Cloud tutorial

## Session: 2026-08-22

### Phase 1: Local execution discovery

- **Status:** complete
- 使用 planning-with-files 创建本轮活动账本；上一 `v0.4.1` 实现 plan 保持 closed。
- `wsl.exe` 存在但没有已安装发行版；Docker、Podman、nerdctl 均不存在。
- 未安装系统组件，也未用 Git Bash 冒充 Linux/POSIX 结果。
- 维护者随后澄清标准职责：默认不再搜索本机 Linux 执行面，Linux gate 由维护者按 Cloud 教程手动执行。

### Phase 2: Local candidate acceptance

- **Status:** complete
- `tests/installer.test.js` 增加 Linux-only nested FIFO negative case；Windows 明确 SKIP，Cloud Linux 必须执行。
- focused installer suite、完整 Windows suite、repository boundary、importer、Node/Python syntax、Git mode 与 diff checks 通过。
- 两次 development ZIP build/check 得到相同 22-entry、85,915-byte archive，SHA-256 均为
  `543a72a57fdd7ca04854d5d1dfde6f838bf40e3afa5eb2c52c2d559b3843854a`；临时 ZIP 已删除。
- 创建本地 commit `69304c7`；该时点工作树 clean。

### Phase 3: Responsibilities and Cloud tutorial

- **Status:** complete
- 维护者澄清项目已有标准流程：智能体负责本地验收和 Cloud 教程，维护者负责 push 与手动创建/继续/Resume Cloud task。
- 活动计划从“寻找 environment ID 并代启 Cloud”收窄为“补全 `v0.4.1-dev Cloud hard acceptance` 操作教程”。
- `AGENTS.md` 已改为默认职责流水线，并保留当前 Windows 主机不重复探测 WSL/Docker 的执行记忆。
- 对照 v0.4.0 F3C operator guide、F3 lifecycle runbook 与稳定 template，确认采用“一分钟说明 + version run sheet +
  PASS/stop/return”结构，不复制通用 Bash 或 B～E 提示词。
- `docs/v0.4.1-dev-cloud-hard-acceptance.md` 已补齐维护者 push、Cloud 环境、A～F 顺序、FIFO/path-safety 增量、
  原始证据回传和失败分流。
- 稳定 template 只增加 `cloud-task-acceptance-permission-prefix` 显式锚点，执行协议未改变。
- `ROADMAP.md` 已同步为本地 gate PASS、Source/Candidate 等待维护者 push/手动 Cloud、Release 仍未授权。

### Phase 4: Documentation verification and local commit

- **Status:** complete
- 已更新 repository-boundary 对 v0.4.1 当前 gate、职责说明、回传入口和稳定 template anchors 的断言。
- repository-boundary 与完整 suite 均通过，跨文档显式 anchors、当前角色和 acceptance 状态一致。
- `git diff --check` 通过；准备创建范围单一的本地文档 commit，不执行 push 或 Cloud task。

## Test Results

| Test | Result | Status |
|---|---|---|
| repository-boundary after initial plan switch | 14 pass / 0 fail | PASS |
| focused installer suite with FIFO case | 42 pass / 0 fail / 2 Windows skips | PASS |
| full Windows suite after FIFO test | 158 pass / 0 fail / 26 skips | PASS |
| importer / Node / Python syntax / Git mode / diff | exit 0 | PASS |
| local deterministic ZIP build/check | 2 identical builds / 22 entries | PASS |
| repository-boundary after tutorial | 14 pass / 0 fail / 0 skip | PASS |
| full suite after tutorial | 158 pass / 0 fail / 26 Windows skips | PASS |
| cross-document anchors / current role assertions | included in full suite | PASS |
| final `git diff --check` | exit 0 | PASS |

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| 先前把“转 Source/Candidate Cloud”误解为智能体默认代启 Cloud | 1 | 维护者澄清标准分工；重写 plan 与 AGENTS，Cloud 启动默认交回维护者 |
| sandboxed `node --test` returned `spawn EPERM` | 1 | platform sandbox limitation；获准在沙箱外重跑后通过 |
| Cloud task list omitted environment ID | 1 | 标记为非默认流程信息；维护者手动 Cloud 不依赖本地 CLI environment ID |
| standalone Git Bash could not resolve workspace bootstrap paths | 3 | 不继续搜索兼容层；Cloud Linux 执行真实 Bash gate |
| ROADMAP 首次 patch 重复保留旧状态行 | 1 | 立即复核并合并为单一 current-state 段落 |

## Current Status

`LOCAL_ACCEPTANCE_PASS / TUTORIAL_READY / LOCAL_COMMIT_PENDING`
