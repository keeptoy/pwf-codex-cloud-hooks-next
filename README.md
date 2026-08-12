# pwf-codex-cloud-hooks

把 [`OthmanAdi/planning-with-files`](https://github.com/OthmanAdi/planning-with-files)
的本地 Codex Skill Hook/runtime，安全接入 Codex Cloud 的 system-managed Hooks。

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

两个事件都会先调用 sibling `owned-plan.py`。只有 exact-v2 result 通过严格校验且
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

所有 bootstrap 都是 ZIP 外部资产，因为它们负责下载并校验 ZIP，不能进入自己验证的 archive。
development bootstrap 使用 64 位 zero hash 并 fail closed；只有独立授权的 seal 才能在冻结全部 ZIP
输入后写入精确 SHA-256。已发布资产必须从对应 Release 页面重新下载，并按版本 acceptance 核对
filename、size 和 SHA；源码 checkout、版本字段、文件名或本地 ZIP 都不能单独证明 Release 成立。

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

### Pre-1.0 支持与升级边界

本项目在 `1.0.0` 前只支持 clean install 和当前 contracts/tests 明确覆盖的 managed 状态；不保证从早期
原型、无 ownership marker 或身份不明的旧安装直接升级。旧 tag/Release/acceptance 可用于审计和 rollback，
不等于当前 installer 承诺迁移其 installed state。遇到 unknown drift 时先保存 doctor/backup 证据，再按
明确卸载/清理流程重新安装；兼容例外的准入条件见
[`ROADMAP` 的 Pre-1.0 compatibility policy](ROADMAP.md#pre-1-compatibility-admission)。

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

<a name="local-development"></a>

## 本地开发

恢复上下文时按以下顺序阅读：

1. [`AGENTS.md`](AGENTS.md)
2. 本 README
3. [`ARCHITECTURE.md`](ARCHITECTURE.md)
4. [`DESIGN.md`](DESIGN.md)
5. [`ROADMAP.md`](ROADMAP.md)
6. `.planning/.active_plan` 指向的 `task_plan.md`、`findings.md`、`progress.md`
7. 当前任务直接相关的 contracts、源码和测试

常用检查：

```bash
python3 tools/import_upstream_runtime.py check
npm test
python3 -c "from pathlib import Path; [compile(p.read_text(encoding='utf-8'), str(p), 'exec') for p in map(Path, ['hooks/hook_adapter.py','runtime/owned-plan.py','runtime/owned-catchup.py'])]"
node --check install.js
for bootstrap in init-cloud-sandbox-v*.bash; do
  bash -n "$bootstrap"
done
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

## 构建开发 ZIP

Release allowlist 由 `upstream-manifest.json` 指向的当前
[`release-artifact-v2.json`](contracts/release-artifact-v2.json) 唯一决定。每个 entry 自带 ZIP mode；构建器固定
路径顺序、时间戳、压缩参数和 archive root，`check` 再核对 entries、mode、metadata 与源文件字节。

PowerShell：

```powershell
$zip = Join-Path $env:TEMP 'pwf-codex-cloud-hooks-candidate.zip'
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

ZIP entries、外部资产和 package identity 只由 Release contract 决定；不要在文档中另建可漂移的
entry count。Self-contained importer 与四个 pinned pristine runtime 文件必须同时进入 allowlist，所有
bootstrap 必须保持在 ZIP 外。本地双构建、`check` 或 hash 只证明当前开发字节可复现，不等于完成 seal、publication、Cloud
acceptance 或 rollback 晋级。已发布版本的精确字节只从 immutable tag/source oracle 和对应 acceptance
复核，不从当前工作树覆盖。

### Importer 与 pristine runtime 摘要

候选 ZIP 包含 self-contained importer，确保解压后可以独立 `check`；四个 upstream runtime 文件全部从
pinned archive 逐字重建并保持 pristine。正常安装不会现场转换上游源码，而是由 `install.js` 校验并复制
ZIP 内已经生成的 owned runtime。源码重建/生产执行分层、已退休 patcher 的历史定位和 parser helper
边界见 [`ARCHITECTURE.md`](ARCHITECTURE.md)；各版本实际 package delta 见 [`CHANGELOG.md`](CHANGELOG.md)。

runtime source/install inventory 的唯一 machine authority 是
[`runtime-bundle-v2.json`](contracts/runtime-bundle-v2.json)。`upstream-manifest.json` 只保存上游 provenance、
bundle path/SHA 和非重复 integrity references；importer 与 installer 都必须先按 manifest 校验 bundle 原始字节，
再严格解析并消费 inventory。`installed-manifest.json.runtime_files` 仍是安装状态快照，Release artifact entries
仍是 ZIP 层 allowlist，两者不属于重复的 source authority。

## 安全与 Release 不变量

- global PWF Skill 始终 pristine；production 只执行 manifest/allowlist 固定的 owned runtime；
- Managed policy 只注册 adapter，不直接注册 child runtimes；
- `/opt/codex` 是当前 Cloud 默认事实，不是永久平台常量；
- transcript path 必须 containment、regular-file 和 session identity 校验；
- integrity 与内容注入 fail closed，单个 advisory child 对 Codex loop fail open；
- Release ZIP 使用精确 allowlist，bootstrap 永远作为 ZIP 外部独立资产；
- 任何已发布版本的 tag、资产字节、URL、SHA-256 和 acceptance 证据都不可原位改写；
- 封板顺序固定：冻结 ZIP 输入 → 构建 ZIP/hash → 写入 bootstrap → 计算 bootstrap hash →
  发布 → 重新下载双资产复验。

<a name="documentation-map"></a>

## 开发状态与文档地图

README 只维护稳定支持行为和用户/开发命令，不复制频繁变化的 migration、Cloud、Release 或当前 gate
状态。需要继续了解仓库时，按问题进入唯一权威：

| 要回答的问题 | 唯一权威 |
|---|---|
| 支持什么，以及如何安装、doctor/repair、测试和打包 | 本 README |
| 为什么这样设计，跨组件数据流、信任边界和失败语义是什么 | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| 实现落在哪些仓库模块，源码/build/install/runtime 如何对应 | [`DESIGN.md`](DESIGN.md) |
| 各已发布版本和 Unreleased 已经改变了什么 | [`CHANGELOG.md`](CHANGELOG.md) |
| 当前 programme、版本列车、Cloud/Release/rollback 状态 | [`ROADMAP.md`](ROADMAP.md) |
| 当前唯一 Next Step、授权、禁止事项和停止条件 | `.planning/.active_plan` 指向的活动 `task_plan.md` |
| 已发布身份、迁移 refs、upstream/overlay 与不可变资产从哪里来 | [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) 冷证据账本 |
| 历史如何分层保留、planning/版本文件何时退场，以及怎样迁移到新项目 | [`仓库治理指南`](docs/repository-governance-guide.md) |
| 已关闭 Product Phase、跨版本架构谱系与迁移 interlude 当时解决了什么、如何被后继阶段继承 | [`Phase 历史摘要`](docs/history/README.md)；source snapshot 仅用于 cold audit，不解释当前实现 |
| 新维护者如何接手、避坑并解释能力检测结果 | [`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md) |
| 某次迁移、Cloud 或 Release 如何被验收 | 对应的 [`docs/`](docs/) 专项 runbook/acceptance |

源码分支、package version、文件名、本地 ZIP 或本地 seal 中出现版本号，不代表 Release 已成立。

## 许可证

本仓库使用 MIT License。上游 PWF 的来源和许可证信息见
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。
