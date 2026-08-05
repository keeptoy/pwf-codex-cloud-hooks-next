# Git executable mode 与 LF 修复

本仓库的安全/Release contract 同时依赖 Git blob 和 mode。Windows 能正常读取脚本，不代表 Git index
仍保存 Linux 可执行位。

## 正确状态

以下四个文件必须且仅它们为 `100755`：

```text
runtime/upstream/inject-plan.sh
runtime/upstream/ledger-summary.sh
runtime/upstream/resolve-plan-dir.sh
runtime/upstream/session-catchup.py
```

其他 tracked files 为 `100644`。`.gitattributes` 对所有 text 固定 `eol=lf`，常见 binary families
显式 `-text`。

## 检查 mode

```bash
git ls-files --stage runtime/upstream
```

或只列可执行文件：

```bash
git ls-files --stage | awk '$1 == "100755" { print $4 }'
```

PowerShell：

```powershell
git ls-files --stage |
  Where-Object { $_ -match '^100755 ' }
```

预期正好四行。若从 ZIP、资源管理器或不保留 mode 的备份恢复源码，Git 可能显示 `100644`，即使
`git status` 看起来只像普通新增文件。

## 修复 mode

在仓库根目录执行：

```bash
git update-index --chmod=+x -- \
  runtime/upstream/inject-plan.sh \
  runtime/upstream/ledger-summary.sh \
  runtime/upstream/resolve-plan-dir.sh \
  runtime/upstream/session-catchup.py
```

不要对整个目录批量 `chmod +x` 或 `git update-index --chmod=+x`。修复后重新运行：

```bash
git ls-files --stage runtime/upstream
python3 tools/import_upstream_runtime.py check
```

## 检查 LF

```bash
git check-attr text eol -- README.md package.json runtime/upstream/session-catchup.py
git diff --check
```

预期 text files 的 `eol` 为 `lf`。Windows checkout 的用户级 `core.autocrlf` 不应覆盖仓库属性。

若旧 checkout 在引入 repository-wide 规则前已 materialize CRLF，先确认没有用户未提交改动，再预览：

```bash
git status --short
git add --renormalize --dry-run .
```

确认范围后才能执行：

```bash
git add --renormalize .
git diff --cached --check
```

不要用 reset/checkout 覆盖用户改动。若范围超出预期，停止并先定位 `.gitattributes` 与 global Git
配置。

## Fresh clone gate

mode/LF 修复不能只在当前 worktree 验证。M2-C/Release gate 需要在 fresh Windows clone 和
Linux/Cloud clone 重新检查：

- exact tracked path count；
- exactly four `100755`；
- importer check；
- `git diff --check`；
- full platform-appropriate suite；
- deterministic ZIP bytes。

这能防止“当前 index 正确，但新 clone 因 mode/LF 规则产生不同字节”的 clean-but-different 问题。
