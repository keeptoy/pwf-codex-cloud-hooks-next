# pwf-codex-cloud-hooks

把 [`OthmanAdi/planning-with-files`](https://github.com/OthmanAdi/planning-with-files)
的本地 Codex Skill Hook/runtime，安全接入 Codex Cloud 的 system-managed Hooks。

> 当前开发身份：`0.3.0-beta.3-dev`，尚未发布、不可直接 bootstrap 安装。
>
> 已发布回滚基线：`v0.3.0-beta.2`。其源码、资产哈希和 Cloud A～F 证据见
> [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) 与
> [`docs/v0.3.0-beta.2-cloud-hard-acceptance.md`](docs/v0.3.0-beta.2-cloud-hard-acceptance.md)。

## 项目边界

本仓库目前只正式支持 `OthmanAdi/planning-with-files v3.8.2`。它是一个垂直适配原型，负责：

- 从固定上游 archive 确定性重建 owned runtime；
- 把 adapter 注册到 Codex Cloud Managed Hook policy；
- 保持全局安装的 PWF Skill pristine；
- 校验 Host 输入、runtime/contract 哈希、安装清单和 drift；
- 提供 install、doctor、repair、uninstall、Release 构建与 Cloud 验收路径。

它不是通用 Skill 转换器。Host/runner/Driver 抽象要等第二个只读插件验证后才能泛化。

## 当前已实现行为

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

### 当前开发树

当前 bootstrap 使用 beta.3-dev successor URL，并把 ZIP SHA-256 固定为 64 个 `0`。这是有意的
fail-closed 占位：在 M3/M4 完成并正式封板前，直接运行会报 placeholder 错误。

不要把 development ZIP 或本地 bootstrap 当作 Release。需要生产回滚时使用不可变 beta.2 资产，
并按 beta.2 hard-acceptance 文档复验。

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
git diff --check
```

Windows 中 POSIX/Linux-only case 必须诚实 SKIP；最终安全边界仍需 Linux/Cloud gate 全绿。

## 构建 development ZIP

Release allowlist 由 `contracts/release-artifact-v1.json` 唯一决定。构建器固定路径顺序、时间戳、
权限、压缩参数和 archive root；`check` 再核对 entries、mode、metadata 与源文件字节。

PowerShell：

```powershell
$zip = Join-Path $env:TEMP 'pwf-codex-cloud-hooks-v0.3.0-beta.3-dev.zip'
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

development ZIP 仍必须包含精确 22 entries，且不包含外部
`init-cloud-sandbox-v0.3.0.bash`。当前 bootstrap 的 zero hash 不得替换成 development ZIP hash；
只有正式 Release gate 可以封板。

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
- 已发布 beta.2 字节、URL 和 SHA-256 不可改写；
- 封板顺序固定：冻结 ZIP 输入 → 构建 ZIP/hash → 写入 bootstrap → 计算 bootstrap hash →
  发布 → 重新下载双资产复验。

## 当前路线

slim-repository M2 本地迁移已经完成，当前等待 checkpoint 与 M3 Cloud equivalence 的独立授权；
development branch 尚未 push，M4 cutover 也未开始。产品 Phase 4 attestation/opt-in 仍未开始，
不会因仓库迁移自动获得授权。

详见 [`ROADMAP.md`](ROADMAP.md)。

## 许可证

本仓库使用 MIT License。上游 PWF 的来源和许可证信息见
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。
