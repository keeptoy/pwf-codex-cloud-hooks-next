# pwf-codex-cloud-hooks

把 [`OthmanAdi/planning-with-files`](https://github.com/OthmanAdi/planning-with-files)
的本地 Codex Skill Hook/runtime，安全接入 Codex Cloud 的 system-managed Hooks。

> 当前源码/package 身份：`0.3.1`。源码 checkout、版本字段、文件名、本地 ZIP 或本地 seal 都不单独
> 构成 Release；seal、publication 与 acceptance 状态以 [`ROADMAP.md`](ROADMAP.md) 和活动 task plan
> 为准。
>
> 当前已接受的 rollback：`v0.3.0`；其 tag、双资产和 Cloud A～F 证据见
> [`docs/v0.3.0-cloud-hard-acceptance.md`](docs/v0.3.0-cloud-hard-acceptance.md)。
> `v0.3.0-beta.2` 保持为不可变 previous fallback，来源见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)。

## 项目边界

本仓库目前只正式支持 `OthmanAdi/planning-with-files v3.8.2`。它是一个垂直适配原型，负责：

- 从固定上游 archive 确定性重建 owned runtime；
- 把 adapter 注册到 Codex Cloud Managed Hook policy；
- 保持全局安装的 PWF Skill pristine；
- 校验 Host 输入、runtime/contract 哈希、安装清单和 drift；
- 提供 install、doctor、repair、uninstall、Release 构建与 Cloud 验收路径。

它不是通用 Skill 转换器。Host/runner/Driver 抽象要等第二个只读插件验证后才能泛化。

## 支持的运行行为

Managed policy 只注册一个绝对路径 adapter，事件集固定为：

| Event | 行为 |
|---|---|
| `SessionStart` | canary → canonical owned plan → 可选 owned catch-up → plan context |
| `UserPromptSubmit` | canary → canonical owned plan context |

两个事件都会先调用 sibling `owned-plan.py`。只有 exact-v1 result 通过严格校验且
`inject=true` 时才注入 planning context。`SessionStart` 再把 result 中已验证的六字段
`project` 原样交给 `owned-catchup.py`。

最终顺序固定为 canary、可选 catch-up、可选 plan：

- plan child 失败：只保留 canary，不运行 catch-up；
- catch-up child 失败：保留 canary 和已验证 plan；
- 内容、身份、路径或输出预算无法验证：不注入；
- advisory child failure 不终止 Codex 主循环。

详细调用链、信任图和失败语义见 [`ARCHITECTURE.md`](ARCHITECTURE.md)。

## 安装与运维

### 前置条件

- Node.js 18 或更高版本；
- Python 3；
- Linux/Cloud production 路径需要 POSIX shell；
- 已安装且与 manifest 匹配的 pristine PWF v3.8.2 Skill；
- production install 需要写入 `$CODEX_HOME` 和 Managed requirements 的权限。

### 外部 bootstrap 安全边界

`init-cloud-sandbox-v0.3.0.bash` 使用精确 `v0.3.0` tag、包名和 ZIP SHA-256，并始终作为 ZIP 外部
的独立资产。源码 checkout、文件名或本地 ZIP 本身不能证明 Release 已发布；只能在 Release 页面
重新下载两个资产、核对 hard-acceptance 中的 SHA 后执行 bootstrap。

`init-cloud-sandbox-v0.3.1.bash` 是 ZIP 外部的候选资产：普通 development 状态使用 64 位 zero hash
并 fail closed；只有明确授权的 seal 才能写入冻结 ZIP 的精确 SHA-256。即使完成本地 seal，也必须在
独立 publication、重新下载和 Cloud acceptance 关闭后才能成为 Release 或 rollback。当前 gate 与
rollback 状态只在 ROADMAP 和活动 task plan 维护。

### Installer CLI

先在隔离目录 dry-run：

```bash
node install.js install --dry-run --json \
  --codex-home /absolute/test/codex \
  --skill-root /absolute/planning-with-files \
  --managed-requirements /absolute/test/requirements.toml
```

生产运维命令：

```bash
sudo node install.js install --json --codex-home /opt/codex
node install.js doctor --json --codex-home /opt/codex
sudo node install.js install --repair --dry-run --json --codex-home /opt/codex
sudo node install.js install --repair --json --codex-home /opt/codex
sudo node install.js uninstall --json --codex-home /opt/codex
```

可用参数：

- `--skill-root PATH`：显式指定 pristine PWF Skill；
- `--managed-requirements PATH`：默认 `/etc/codex/requirements.toml`；
- `--dry-run`：只报告将发生的变更；
- `--json`：输出机器可读结果。

`repair` 只修复 installer 明确拥有的 adapter 和 managed definition drift。未知 runtime、manifest、
requirements 或第三方管理员变更会 fail closed，不会被静默吸收。

### Doctor 判定

健康安装应返回：

```json
{
  "action": "doctor",
  "healthy": true,
  "repairable": false,
  "managed": true,
  "events": ["SessionStart", "UserPromptSubmit"],
  "errors": [],
  "blockers": []
}
```

若 `healthy=false`：

1. 先保存完整 doctor JSON；
2. 只有 `repairable=true` 才预览 repair；
3. blockers 或 unknown drift 必须人工定位；
4. 修复后重新 doctor，再做 Fresh/Resume 黑盒验证。

## 本地开发

恢复上下文时按以下顺序阅读：

1. [`AGENTS.md`](AGENTS.md)
2. 本 README
3. [`ARCHITECTURE.md`](ARCHITECTURE.md)
4. [`ROADMAP.md`](ROADMAP.md)
5. `.planning/.active_plan` 指向的 `task_plan.md`、`findings.md`、`progress.md`
6. 当前任务直接相关的 contracts、源码和测试

常用检查：

```bash
python3 tools/import_upstream_runtime.py check
npm test
python3 -c "from pathlib import Path; [compile(p.read_text(encoding='utf-8'), str(p), 'exec') for p in map(Path, ['hooks/hook_adapter.py','runtime/owned-plan.py','runtime/owned-catchup.py'])]"
node --check install.js
bash -n init-cloud-sandbox-v0.3.0.bash
bash -n init-cloud-sandbox-v0.3.1.bash
git diff --check
```

Windows 中 POSIX/Linux-only case 必须诚实 SKIP；最终安全边界仍需 Linux/Cloud gate 全绿。

### Git mode 与 LF 快速检查

源码仓库中的四个 `runtime/upstream/*` 文件必须且仅它们保持 Git `100755`。Windows 能读取脚本，
不代表 Git index 仍保存 Linux 可执行位。先运行：

```bash
git ls-files --stage runtime/upstream
```

若四行不是 `100755`，先确认 `git status --short` 没有待保护的用户改动，再只修复这四个路径：

```bash
git update-index --chmod=+x -- \
  runtime/upstream/inject-plan.sh \
  runtime/upstream/ledger-summary.sh \
  runtime/upstream/resolve-plan-dir.sh \
  runtime/upstream/session-catchup.py

python3 tools/import_upstream_runtime.py check
git diff --check
```

不要对整个目录批量设置 executable，也不要用 reset/checkout 覆盖用户改动。Windows CRLF、
renormalize 和 fresh-clone 复验步骤见完整源码仓库的
[`docs/git-file-modes.md`](docs/git-file-modes.md)。

## 构建当前 0.3.1 候选 ZIP

Release allowlist 由 `contracts/release-artifact-v1.json` 唯一决定。构建器固定路径顺序、时间戳、
权限、压缩参数和 archive root；`check` 再核对 entries、mode、metadata 与源文件字节。

PowerShell：

```powershell
$zip = Join-Path $env:TEMP 'pwf-codex-cloud-hooks-v0.3.1.zip'
python tools/build_release.py build --output $zip
python tools/build_release.py check --archive $zip
Get-FileHash -Algorithm SHA256 $zip
```

Bash：

```bash
ZIP="$(mktemp --suffix=.zip)"
python3 tools/build_release.py build --output "$ZIP"
python3 tools/build_release.py check --archive "$ZIP"
sha256sum "$ZIP"
```

当前 ZIP 必须包含精确 23 entries：importer 与其必需的
`patches/patch_planning_skill.py` 必须同时存在；两个 bootstrap 都不得进入 ZIP，当前外部候选资产是
`init-cloud-sandbox-v0.3.1.bash`。本地构建或 seal 成功不等于 Release 成立；bootstrap 的默认 hash
必须与当前 gate 一致，并且只能在冻结全部 ZIP 输入后由授权 seal 从 zero 改为该 ZIP 的精确 SHA-256。
已发布 v0.3.0 的 22-entry ZIP、外部 bootstrap、tag 和 SHA 继续由其 hard-acceptance 冻结，不从当前
工作树重建或覆盖。

### Importer 与 patcher 摘要

候选 ZIP 必须同时包含 importer 与 patcher，确保解压后的维护工具可以独立 `check`；正常安装不会
现场打 patch，而是由 `install.js` 校验并复制 ZIP 内已经生成的 owned runtime。因此 v0.3.0 的生产
安装能够正常运行，0.3.1 增加第 23 个 patcher entry 修复的是 Release 工具自包含性。两条路径、
patcher 的四项职责、信任边界和 overlay 顺序见 [`ARCHITECTURE.md`](ARCHITECTURE.md) 的部署图及
“来源与 overlay”章节。

## 仓库地图

| 路径 | 职责 |
|---|---|
| `install.js` | Managed install/doctor/repair/uninstall |
| `hooks/hook_adapter.py` | Codex Hook protocol、child supervision、结果组合 |
| `runtime/owned-plan.py` | canonical plan resolution、安全快照和 context 生成 |
| `runtime/owned-catchup.py` | Host transcript 校验、session catch-up result |
| `runtime/upstream/` | importer 管理的四个固定上游 runtime 文件 |
| `contracts/` | Host ABI、result schema、runtime/overlay/Release machine contracts |
| `tools/import_upstream_runtime.py` | 固定 archive 的确定性 import/check |
| `patches/patch_planning_skill.py` | owned catch-up compatibility overlay 复现 |
| `tools/build_release.py` | 确定性 ZIP build/check |
| `tests/` | production、安全、供应链、安装和仓库边界回归 |
| `BASELINE_PROVENANCE.md` | beta.2、M1、上游与 overlay 来源链 |
| `MAINTAINER_HANDOFF.md` | 维护、变更分类、验证、Release 与回滚入口 |

## 安全与 Release 不变量

- global PWF Skill 始终 pristine；production 只执行 manifest/allowlist 固定的 owned runtime；
- Managed policy 只注册 adapter，不直接注册 child runtimes；
- `/opt/codex` 是当前 Cloud 默认事实，不是永久平台常量；
- transcript path 必须 containment、regular-file 和 session identity 校验；
- integrity 与内容注入 fail closed，单个 advisory child 对 Codex loop fail open；
- Release ZIP 使用精确 allowlist，bootstrap 永远作为 ZIP 外部独立资产；
- 已发布 v0.3.0 与 beta.2 的字节、URL 和 SHA-256 不可改写；
- 封板顺序固定：冻结 ZIP 输入 → 构建 ZIP/hash → 写入 bootstrap → 计算 bootstrap hash →
  发布 → 重新下载双资产复验。

## 开发状态

README 不复制频繁变化的 migration、Cloud、Release 或 Product Phase 状态。在完整源码仓库中：

- [`ROADMAP.md`](ROADMAP.md) 是 programme、migration、Cloud 与 Release gate 的当前权威；
- `.planning/.active_plan` 指向的 `task_plan.md` 是唯一 Next Step、授权与停止条件的当前权威。

源码分支、package version、文件名或本地 ZIP 中出现版本号，不代表 Release 已成立。

## 许可证

本仓库使用 MIT License。上游 PWF 的来源和许可证信息见
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。
