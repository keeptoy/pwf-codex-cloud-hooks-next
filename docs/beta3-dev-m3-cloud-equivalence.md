# beta.3-dev M3 Cloud equivalence

> 状态：`M3 COMPLETE / HISTORICAL GATE / M4 COMPLETE`
>
> 目标：证明 slim successor 的受控 development commit 在 Linux、隔离安装和真实 Codex Cloud
> lifecycle 上与已验收 beta.2 production 行为等价。
>
> 时态说明：本文保留 M3-A/B/C 的精确 runbook、当时授权边界和接受证据；其中“不授权 M4”描述
> M3 gate 本身，不是当前仓库状态。后续 M4 已独立完成，当前源码路线看 `ROADMAP.md`，当前授权看
> 活动 planning。本文仍不授权 Release、live `/opt/codex` 或 Product Phase 4。

## 1. 基线与身份

| 项目 | 冻结值 |
|---|---|
| successor remote | `keeptoy/pwf-codex-cloud-hooks-next` |
| M1 audit commit | `bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b` |
| M1 audit tree | `ff49c3c6656386e94450ccb24437a1c2d1c50e95` |
| M2 slim root commit | `3234e4e02090c838f5ee260cd8f2d99daf358d65` |
| M2 slim root tree | `300f5a86b122df58f91fe7fee67e3cc561fd967f` |
| development branch | `migration/slim-beta3-dev` |
| package identity | `0.3.0-beta.3-dev`，未发布 |
| production rollback | old repository immutable `v0.3.0-beta.2` |

M2 root commit 必须保持 parentless、不可改写。M3 的 runbook/planning/evidence 可以成为它的普通
child commit，但不能 amend、rebase 或 force-move M2 root。`audit/beta2-exact` 仍是独立只读 oracle。

## 2. 等价的含义

M3 证明的是以下行为与安全边界等价，不是 ZIP 字节与 beta.2 相同：

- imported runtime、adapter、owned runtimes、installer、contracts 和安全测试没有被迁移弱化；
- Linux suite 全部通过，Windows SKIP 不替代 Linux primitive；
- install/doctor/inventory、root/root、install-user/Hook-user、process-group cleanup 全部健康；
- Fresh `SessionStart(startup)`、`UserPromptSubmit`、canonical planning context 和 Resume catch-up
  与 beta.2 的冻结行为一致；
- 长 wrapper 仍然有界截断并保留尾部 sentinel；
- global Skill pristine、Managed policy adapter-only、snapshot residue 为零；
- development ZIP 仍为 22 entries、可复现、bootstrap external；
- checkout bootstrap 始终保留 64-zero checksum，不能直接安装或冒充 Release。

beta.3-dev 的文档、仓库身份和 package version 本来就与 beta.2 不同，因此不能用“ZIP SHA 相同”
作为等价条件。真正的 production rollback 仍是不可变 beta.2 Release。

## 3. 子门与授权边界

| 子门 | 内容 | 外部状态变化 | 当前状态 |
|---|---|---|---|
| Discovery | 冻结本文、失败矩阵、运输和安装方式 | 无 | complete |
| M3-A | push 精确 development commit；Fresh Cloud 跑 no-live Linux seal 和隔离安装 | 新 remote branch；不碰 `/opt/codex` | complete / PASS |
| M3-B | 一次性 Cloud setup 用本地 development ZIP 安装；执行 Fresh/D/Resume/F | 只改变 disposable Cloud container | complete / PASS |
| M3-C | 记录原始证据、证明 closure 只有治理文件、关闭 M3 | governance commit；无 Release/cutover | complete / PASS |

每个子门单独停止。`M3-A PASS` 不自动授权 M3-B；`M3-B PASS` 不自动授权 M3-C 或 M4。

## 4. 失败分类与停止条件

| 观测 | 分类起点 | 动作 |
|---|---|---|
| remote commit 与审核值不同 | transport/integrity failure | 停止，不测试该 checkout |
| mode、importer、hash、inventory 失败 | provenance/product failure | 停止，不安装 |
| Linux case fail | product/test/platform 待诊断 | 保存完整 TAP；不得弱化断言 |
| deterministic ZIP 不一致 | Release-tool/input drift | 停止，不进入 setup |
| isolated install/doctor 失败 | installer/inventory failure | 停止，不碰 live `/opt/codex` |
| setup build SHA 与 M3-A 不同 | commit/input mismatch | 停止，不安装 |
| startup/UserPrompt canary 缺失 | Host lifecycle failure | 保存 no-tools 回复，停止 |
| controlled plan/progress 缺失 | canonical plan failure | 保存原始证据，停止 |
| Resume catch-up/尾标记/顺序失败 | catch-up/Host data failure | 保存原始证据，停止 |
| post-resume doctor/inventory/residue 失败 | installed-state failure | 保存现场，停止 |

任何失败都不能通过修改 beta.2 资产、把 beta.3-dev zero hash 写成临时默认值、创建 public `main`
或跳过相应 gate 来补救。

## 5. M3-A：remote transport 与 no-live Cloud seal

### 5.1 推送边界

获得明确授权后，只允许把审核过的本地 `migration/slim-beta3-dev` 推送到同名 remote branch：

```bash
git push origin migration/slim-beta3-dev:migration/slim-beta3-dev
```

不得推送或移动 `audit/beta2-exact`，不得创建/更新 `main`、tag、Release 或默认分支。推送后记录
local HEAD、remote branch HEAD 和 M2 root；三者关系必须是：remote HEAD 等于 local HEAD，且 M2 root
是该 history 的唯一 parentless root。

### 5.2 唯一 Cloud 执行脚本

在全新 Cloud task 中 checkout 精确 development branch 后，从仓库根执行完整脚本。它不安装到
live `/opt/codex`，不修改仓库，也不下载/publish Release：

```bash
set -Eeuo pipefail

PROBE_VERSION="PWF_BETA3DEV_M3A_CLOUD_EQUIVALENCE_V1"
EXPECTED_ROOT_COMMIT="3234e4e02090c838f5ee260cd8f2d99daf358d65"
EXPECTED_ROOT_TREE="300f5a86b122df58f91fe7fee67e3cc561fd967f"
EXPECTED_VERSION="0.3.0-beta.3-dev"
REPO_ROOT="$(git rev-parse --show-toplevel)"
PROBE_DIR="$(mktemp -d)"
trap 'rm -rf -- "$PROBE_DIR"' EXIT
cd "$REPO_ROOT"

printf 'PROBE_VERSION=%s\n' "$PROBE_VERSION"
printf 'REPO_ROOT=%s\n' "$REPO_ROOT"
test -z "$(git status --short)"

ROOT_COMMIT="$(git rev-list --max-parents=0 HEAD)"
test "$ROOT_COMMIT" = "$EXPECTED_ROOT_COMMIT"
test "$(git rev-parse "${ROOT_COMMIT}^{tree}")" = "$EXPECTED_ROOT_TREE"
test "$(git rev-list --max-parents=0 HEAD | wc -l)" -eq 1
printf 'M3_ACCEPTED_HEAD=%s\n' "$(git rev-parse HEAD)"
printf 'M2_ROOT_IDENTITY=PASS\n'

# M3 Discovery 之后只允许治理文档/planning，以及把本 runbook 纳入精确路径
# allowlist 的 repository-boundary test 变化；其他 production/tests/build inputs
# 必须仍与 M2 root 相同。
git diff --quiet "$EXPECTED_ROOT_COMMIT" -- \
  .gitattributes package.json install.js init-cloud-sandbox-v0.3.0.bash \
  hooks runtime contracts patches tools LICENSE THIRD_PARTY_NOTICES.md
TEST_DRIFT="$(git diff --name-only "$EXPECTED_ROOT_COMMIT" -- tests)"
test "$TEST_DRIFT" = "tests/repository-boundary.test.js"
test "$(git ls-files | wc -l)" -eq 60
printf 'M2_BEHAVIOR_AND_SAFETY_TEST_TREE_UNCHANGED=PASS\n'
printf 'M3_GOVERNANCE_BOUNDARY_TEST_ONLY=PASS\n'

python3 - <<'PY'
import subprocess

paths = [
    "runtime/upstream/inject-plan.sh",
    "runtime/upstream/ledger-summary.sh",
    "runtime/upstream/resolve-plan-dir.sh",
    "runtime/upstream/session-catchup.py",
]
for path in paths:
    line = subprocess.check_output(
        ["git", "ls-files", "--stage", "--", path], text=True
    ).strip()
    assert line, path
    assert line.split()[0] == "100755", (path, line)
print("IMPORTED_RUNTIME_GIT_MODES=PASS files=4 mode=100755")
PY

python3 tools/import_upstream_runtime.py check
python3 - <<'PY'
from pathlib import Path

for name in [
    "hooks/hook_adapter.py",
    "runtime/owned-plan.py",
    "runtime/owned-catchup.py",
]:
    path = Path(name)
    compile(path.read_text(encoding="utf-8"), str(path), "exec")
print("PYTHON_STATIC=PASS")
PY
node --check install.js
bash -n init-cloud-sandbox-v0.3.0.bash

TEST_OUTPUT="$PROBE_DIR/node-test.tap"
node --test --test-reporter=tap tests/*.test.js | tee "$TEST_OUTPUT"
python3 - "$TEST_OUTPUT" <<'PY'
import re
import sys
from pathlib import Path

text = Path(sys.argv[1]).read_text(encoding="utf-8")
values = {}
for key in ("tests", "pass", "fail", "skipped"):
    matches = re.findall(rf"^# {key} (\d+)$", text, flags=re.MULTILINE)
    if len(matches) != 1:
        raise SystemExit(f"missing or duplicate TAP summary: {key}={matches}")
    values[key] = int(matches[0])
expected = {"tests": 63, "pass": 63, "fail": 0, "skipped": 0}
if values != expected:
    raise SystemExit(f"unexpected Linux summary: {values}")
required = [
    "Linux root/root activation executes both real owned runtimes",
    "Linux synthetic install-user/Hook-user split executes both real owned runtimes",
    "owned plan kills the injector process group, bounds output, and cleans snapshots",
]
for marker in required:
    if marker not in text:
        raise SystemExit(f"missing required Linux case: {marker}")
print("LINUX_SUITE=PASS tests=63 pass=63 fail=0 skipped=0")
print("ROOT_CROSS_USER_AND_PROCESS_GROUP=PASS")
PY

ISO="$PROBE_DIR/isolated"
mkdir -p "$ISO/codex" "$ISO/etc"
node install.js install --json \
  --codex-home "$ISO/codex" \
  --skill-root "$REPO_ROOT/tests/fixtures/planning-with-files" \
  --managed-requirements "$ISO/etc/requirements.toml" \
  > "$ISO/install.json"
node install.js doctor --json \
  --codex-home "$ISO/codex" \
  --skill-root "$REPO_ROOT/tests/fixtures/planning-with-files" \
  --managed-requirements "$ISO/etc/requirements.toml" \
  > "$ISO/doctor.json"
python3 - "$ISO" "$EXPECTED_VERSION" <<'PY'
import json
import sys
import tomllib
from pathlib import Path

base = Path(sys.argv[1])
expected_version = sys.argv[2]
doctor = json.loads((base / "doctor.json").read_text(encoding="utf-8"))
assert doctor["healthy"] is True, doctor
assert doctor["repairable"] is False, doctor
assert doctor["errors"] == [], doctor
assert doctor["blockers"] == [], doctor
runtime = base / "codex/hooks/planning-with-files"
manifest = json.loads((runtime / "installed-manifest.json").read_text(encoding="utf-8"))
actual = sorted(
    str(path.relative_to(runtime)).replace("\\", "/")
    for path in runtime.rglob("*")
    if path.is_file() and path.name != "installed-manifest.json"
)
declared = sorted(item["path"] for item in manifest["runtime_files"])
assert manifest["installer_version"] == expected_version, manifest["installer_version"]
assert len(actual) == 11, actual
assert actual == declared, (actual, declared)
policy = tomllib.loads((base / "etc/requirements.toml").read_text(encoding="utf-8"))
commands = []
for event in ("SessionStart", "UserPromptSubmit"):
    event_groups = policy["hooks"][event]
    assert len(event_groups) == 1, (event, event_groups)
    handlers = event_groups[0]["hooks"]
    assert len(handlers) == 1, (event, handlers)
    handler = handlers[0]
    assert handler["type"] == "command", (event, handler)
    commands.append(handler["command"])
assert all("hook_adapter.py" in command for command in commands), commands
assert not any("owned-plan.py" in command or "owned-catchup.py" in command for command in commands)
print("ISOLATED_INSTALL_AND_DOCTOR=PASS")
print("MANAGED_POLICY_ADAPTER_ONLY=PASS")
print("INSTALLED_RUNTIME_FILES=11")
PY

ZIP_A="$PROBE_DIR/a.zip"
ZIP_B="$PROBE_DIR/b.zip"
python3 tools/build_release.py build --output "$ZIP_A"
python3 tools/build_release.py build --output "$ZIP_B"
python3 tools/build_release.py check --archive "$ZIP_A"
cmp "$ZIP_A" "$ZIP_B"
test "$(unzip -Z1 "$ZIP_A" | wc -l)" -eq 22
unzip -Z1 "$ZIP_A" | grep -Fxq 'pwf-codex-cloud-hooks/tools/build_release.py'
if unzip -Z1 "$ZIP_A" | grep -Fq 'init-cloud-sandbox-v0.3.0.bash'; then exit 1; fi
test "$(python3 -c 'import json; print(json.load(open("package.json", encoding="utf-8"))["version"])')" = "$EXPECTED_VERSION"
grep -Fq 'HOOKS_VERSION="${HOOKS_VERSION:-v0.3.0-beta.3-dev}"' init-cloud-sandbox-v0.3.0.bash
grep -Fq 'HOOKS_SHA256="${HOOKS_SHA256:-0000000000000000000000000000000000000000000000000000000000000000}"' init-cloud-sandbox-v0.3.0.bash
grep -Fq 'keeptoy/pwf-codex-cloud-hooks-next/releases/download' init-cloud-sandbox-v0.3.0.bash
test -z "$(git status --short)"

printf 'DEVELOPMENT_ZIP_ENTRIES=22\n'
printf 'DEVELOPMENT_ZIP_SIZE=%s\n' "$(wc -c < "$ZIP_A")"
printf 'DEVELOPMENT_ZIP_SHA256=%s\n' "$(sha256sum "$ZIP_A" | awk '{print $1}')"
printf 'DEVELOPMENT_BOOTSTRAP_ZERO_HASH=PASS\n'
printf 'WORKSPACE_CLEAN=YES\n'
printf 'M3A_NO_LIVE_CLOUD_EQUIVALENCE=PASS\n'
```

M3-A 必须保存完整 TAP 和末尾所有汇总。Cloud 应为 `63/63/0/0`；Windows 的 11 个 POSIX SKIP
不能替代它。`M3_ACCEPTED_HEAD` 与 `DEVELOPMENT_ZIP_SHA256` 是 M3-B 的外部输入，不写回 bootstrap。
任何 runbook 或 checkout 修正都会产生新的候选 HEAD，必须从脚本第一行完整重跑；不得把前一次运行中
已经通过的 63/63 与后一次从中途开始的结果拼接成 M3-A PASS。

### 5.3 已接受的 M3-A 证据

完整修复后重跑已通过，stderr 为空：

| 字段 | 接受值 |
|---|---|
| `M3_ACCEPTED_HEAD` | `39795283cd65f84547651d7bec816191fb5bfedf` |
| Linux suite | 63 tests / 63 pass / 0 fail / 0 skipped |
| root/cross-user/process-group | PASS |
| isolated install/doctor | PASS |
| Managed Policy | adapter-only PASS |
| installed runtime payload | 11 |
| development ZIP | 22 entries / 75,323 bytes |
| `DEVELOPMENT_ZIP_SHA256` | `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508` |
| bootstrap/workspace | zero-hash PASS / clean YES |

这两个完整 hash 是 M3-B setup 的固定外部输入。M3-A 证据治理更新可以先做本地 checkpoint，但在
M3-B 使用精确 checkout 前不得 push 到同名 development branch；否则 branch HEAD 会离开已接受值。

## 6. M3-B：disposable Cloud setup

M3-A PASS 且维护者单独授权后，把脚本保存为同一 development branch 的 Cloud repository
setup 配置。Cloud 创建每个新容器时，会先 clone GitHub 仓库，再在该 checkout 中自动运行这里
保存的 setup，最后才启动 Runtime 和第一轮对话。旧容器中手工安装的 `/opt/codex` 不会被新容器
继承；只手工跑过一次而没有保存为 repository setup，不能开始 Fresh。把 M3-A 原样输出的两个值
填入当前 setup 配置；不要修改仓库文件：

```bash
set -Eeuo pipefail

: "${M3_ACCEPTED_HEAD:?set M3_ACCEPTED_HEAD from the accepted M3-A output}"
: "${M3_ACCEPTED_ZIP_SHA256:?set M3_ACCEPTED_ZIP_SHA256 from the accepted M3-A output}"

REPO_ROOT="$(git rev-parse --show-toplevel)"
test "$(git rev-parse HEAD)" = "$M3_ACCEPTED_HEAD"
test -z "$(git status --short)"

PROBE_DIR="$(mktemp -d)"
trap 'rm -rf -- "$PROBE_DIR"' EXIT
ZIP="$PROBE_DIR/pwf-codex-cloud-hooks-v0.3.0-beta.3-dev.zip"

python3 "$REPO_ROOT/tools/build_release.py" build --output "$ZIP"
python3 "$REPO_ROOT/tools/build_release.py" check --archive "$ZIP"
ACTUAL_SHA256="$(sha256sum "$ZIP" | awk '{print $1}')"
test "$ACTUAL_SHA256" = "$M3_ACCEPTED_ZIP_SHA256"

# 临时环境覆盖只作用于本次进程；checkout 中的 bootstrap 仍保留 zero hash。
HOOKS_URL="file://$ZIP" \
HOOKS_SHA256="$ACTUAL_SHA256" \
bash "$REPO_ROOT/init-cloud-sandbox-v0.3.0.bash" all

test -z "$(git status --short)"
printf 'M3B_DISPOSABLE_SETUP=PASS\n'
printf 'M3B_INSTALLED_FROM_HEAD=%s\n' "$M3_ACCEPTED_HEAD"
printf 'M3B_INSTALLED_ZIP_SHA256=%s\n' "$ACTUAL_SHA256"
```

这不是 Release 安装：ZIP 来自精确 checkout，只在一次性 setup 中通过 `file://` 交给未经修改的
production bootstrap。setup 必须报告成功、global Skill pristine、doctor healthy、adapter-only policy
和 installed version `0.3.0-beta.3-dev`。结束 setup task，不把它 resume 成黑盒 task。

### 6.1 已接受的 setup 证据

- `M3B_DISPOSABLE_SETUP=PASS`；安装来源为精确 accepted HEAD
  `39795283cd65f84547651d7bec816191fb5bfedf`；
- 两次 build/check 都得到 22 entries、75,323 bytes、SHA-256
  `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`；
- bootstrap 完成 pristine upstream v3.8.2 Skill、Managed install、healthy doctor、
  requirements TOML/Codex Hook feature 和两个 adapter protocol probes；
- adapter probe 输出只是 setup 白盒/协议证据，不得替代全新 task 的自动 Runtime lifecycle 黑盒；
- installed manifest 版本由 healthy doctor 对当前 installer 版本严格校验，并将在 post-resume
  doctor 中再次显式打印。setup run 到此结束，不对它执行 resume。

## 7. M3-B：Fresh lifecycle

新建完全不同的 task。第一条消息原样发送：

```text
这是 pwf-codex-cloud-hooks 0.3.0-beta.3-dev M3 Fresh lifecycle 黑盒验证。

严格限制：
1. 不要调用任何工具；
2. 不要运行 Shell；
3. 不要读取任何文件；
4. 不要自行执行 hook_adapter.py、owned-plan.py 或 owned-catchup.py；
5. 不要根据本提示、AGENTS.md 或历史字符串构造结果；
6. 只报告生成本次回复之前 Runtime 已自动注入的内容。

请逐字列出实际看到的所有以 PWF_GLOBAL_HOOK_CANARY_V1 开头的完整行。

然后严格汇总：
SessionStart: OBSERVED 或 NOT_OBSERVED
SessionStart source: 实际值；未观察到则写 NONE
UserPromptSubmit: OBSERVED 或 NOT_OBSERVED
Planning context（辅助观察）: OBSERVED 或 NOT_OBSERVED
===BEGIN PLAN DATA===（辅助观察）: OBSERVED 或 NOT_OBSERVED
=== recent progress ===（辅助观察）: OBSERVED 或 NOT_OBSERVED

如果没有实际看到某项，必须写 NOT_OBSERVED。不要使用工具补救验证。
```

严格 PASS 只要求两个 canary 与 `SessionStart source: startup`。三个 planning 字段是辅助观察；
Fresh task 尚无受控 plan 时，`=== recent progress ===: NOT_OBSERVED` 不单独构成失败。

### 7.1 已接受的 Fresh 证据

- `PWF_GLOBAL_HOOK_CANARY_V1 event=SessionStart source=startup`：OBSERVED；
- `PWF_GLOBAL_HOOK_CANARY_V1 event=UserPromptSubmit`：OBSERVED；
- SessionStart、source `startup`、UserPromptSubmit 三项硬门槛全部 PASS；
- Planning context、`===BEGIN PLAN DATA===`、`=== recent progress ===` 三项辅助观察也全部
  OBSERVED。该证据来自 setup 自动完成后的全新 task 第一条 no-tools 回复，不是 adapter 自测。

## 8. M3-B：受控 planning baseline 与 UserPrompt

Fresh PASS 后，在同一 task 发送：

```text
这是 beta.3-dev M3 canonical plan 与 owned resume catch-up 的基线准备步骤。

允许调用工具。请严格执行：
1. 必须使用 apply_patch 创建或更新文件；
2. 创建或更新：
   - .planning/pwf-beta3dev-m3-c7f4/task_plan.md
   - .planning/pwf-beta3dev-m3-c7f4/progress.md
   - .planning/pwf-beta3dev-m3-c7f4/findings.md
   - .planning/.active_plan
3. .planning/.active_plan 必须是：pwf-beta3dev-m3-c7f4
4. task_plan.md 第一行必须是：# PWF_BETA3DEV_M3_CANONICAL_C7F4
5. progress.md 必须包含：- Beta3-dev M3 lifecycle baseline created by apply_patch.
6. findings.md 必须包含：- Waiting for automatic beta3-dev owned resume catch-up.
7. 完成最后一次 apply_patch 后，不要再修改任何 planning 文件。

完成后只回答：
PWF_BETA3DEV_M3_BASELINE_CREATED
```

必须有真实 successful `apply_patch` / structured `patch_apply_end`，不能只接受文字声称。随后立即发送：

```text
这是 beta.3-dev M3 canonical Planning context 自动注入验证。

严格限制：不要调用工具，不要运行 Shell，不要读取文件，不要根据本提示构造标记；只报告生成本次回复之前 Runtime 自动注入的内容。

请严格汇总：
UserPromptSubmit canary: OBSERVED 或 NOT_OBSERVED
PWF_BETA3DEV_M3_CANONICAL_C7F4: OBSERVED 或 NOT_OBSERVED
[planning-with-files] ACTIVE PLAN: OBSERVED 或 NOT_OBSERVED
===BEGIN PLAN DATA===: OBSERVED 或 NOT_OBSERVED
=== recent progress ===: OBSERVED 或 NOT_OBSERVED
Planning context: OBSERVED 或 NOT_OBSERVED

如果没有实际看到某项，必须写 NOT_OBSERVED。不要使用工具补救验证。
```

六项必须全部 `OBSERVED`。

### 8.1 已接受的 baseline/UserPrompt 证据

- baseline 步骤返回唯一确认词 `PWF_BETA3DEV_M3_BASELINE_CREATED`；
- 随后的无工具 UserPrompt 验证中，UserPromptSubmit canary、canonical C7F4 marker、
  ACTIVE PLAN、`===BEGIN PLAN DATA===`、`=== recent progress ===` 和 Planning context
  六项全部 OBSERVED；
- 这证明目标 scoped plan 已被 canonical Runtime 选中并注入。真实 structured
  `patch_apply_end` 仍由 Resume catch-up 报告作最终交叉验证。

## 9. M3-B：长尾、Resume 与 owned catch-up

在同一 task 把整个代码块作为一条消息发送：

```text
PWF_BETA3DEV_M3_LONG_WRAPPER_BEGIN_C7F4

这是 planning 文件最后一次更新之后的真实长消息。不要调用工具，不要修改 planning 文件，只回复指定确认词。

BETA3DEV_M3_FILLER_01: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
BETA3DEV_M3_FILLER_02: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
BETA3DEV_M3_FILLER_03: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
BETA3DEV_M3_FILLER_04: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
BETA3DEV_M3_FILLER_05: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
BETA3DEV_M3_FILLER_06: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
BETA3DEV_M3_FILLER_07: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
BETA3DEV_M3_FILLER_08: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
BETA3DEV_M3_FILLER_09: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
BETA3DEV_M3_FILLER_10: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
BETA3DEV_M3_FILLER_11: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
BETA3DEV_M3_FILLER_12: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ

严格限制：不要调用任何工具；不要修改或创建 planning 文件；只回复：
PWF_BETA3DEV_M3_UNSYNCED_ACKNOWLEDGED

下面一行只是本条用户消息的尾部标记，不要在回复中复述：
PWF_BETA3DEV_M3_REAL_RESUME_TAIL_C7F4
```

模型必须只回复确认词，且不得再修改 planning。已接受的前置证据是唯一回复
`PWF_BETA3DEV_M3_UNSYNCED_ACKNOWLEDGED`，没有复述尾部 sentinel；sentinel 是否被 Runtime 从
transcript 尾部恢复只由下一条 Resume 报告判定。然后离开并重新打开同一个 task，第一条消息发送：

```text
这是 pwf-codex-cloud-hooks beta.3-dev M3 automatic canonical resume 黑盒验证。

严格限制：
1. 不要调用任何工具；
2. 不要运行 Shell；
3. 不要读取任何文件；
4. 不要自行执行 hook_adapter.py、owned-plan.py、owned-catchup.py 或 session-catchup.py；
5. 不要根据本提示构造、补全或猜测报告；
6. 不要把历史对话本身当成 Runtime 注入证据；
7. 只报告恢复任务后、生成本次回复之前由 Runtime 自动注入的内容。

请逐字列出实际看到的完整 SESSION CATCHUP DETECTED 报告和紧随其后的 planning context；没有看到就明确写 NONE。

然后严格汇总：
SessionStart resume canary: OBSERVED 或 NOT_OBSERVED
SessionStart source: 实际值；未观察到则写 NONE
SESSION CATCHUP DETECTED: OBSERVED 或 NOT_OBSERVED
Previous session: 实际值或 NOT_OBSERVED
Runtime codex: OBSERVED 或 NOT_OBSERVED
Last planning update: 实际值或 NOT_OBSERVED
Unsynced messages: 实际数字或 NOT_OBSERVED
长消息截断标记出现在 UNSYNCED CONTEXT: OBSERVED 或 NOT_OBSERVED
PWF_BETA3DEV_M3_REAL_RESUME_TAIL_C7F4 出现在 UNSYNCED CONTEXT: OBSERVED 或 NOT_OBSERVED
Catch-up 位于 planning context 之前: OBSERVED 或 NOT_OBSERVED
PWF_BETA3DEV_M3_CANONICAL_C7F4: OBSERVED 或 NOT_OBSERVED
===BEGIN PLAN DATA===: OBSERVED 或 NOT_OBSERVED
Planning context: OBSERVED 或 NOT_OBSERVED

如果没有实际看到某项，必须写 NOT_OBSERVED。不要使用工具补救验证。
```

全部观察项必须为 `OBSERVED`，source 必须为 `resume`，unsynced messages 必须是至少 1 的实际整数；
`UNSYNCED CONTEXT` 必须同时有 `...[truncated]...` 和尾部唯一标记，并且 catch-up 在 planning context 前。

### 9.1 已接受的 Resume 证据

- Previous session：`rollout-2026-08-06T02-23-49-019fd4e2-50e2-7d60-8deb-9ecd273513e0`；
- source `resume`、SESSION CATCHUP、Runtime codex 全部 OBSERVED；
- Last planning update：`task_plan.md at message #36`；Unsynced messages：`16`；
- `UNSYNCED CONTEXT` 同时保留 `...[truncated]...` 与
  `PWF_BETA3DEV_M3_REAL_RESUME_TAIL_C7F4`，并包含 baseline acknowledgment、canonical
  UserPrompt 回复和 long-wrapper acknowledgment；
- catch-up 位于 planning context 前，C7F4 canonical marker、plan framing 和 progress 全部恢复。
  结构化 planning update 已被 catch-up 识别；Markdown 展示形式不改变冻结的 marker/更新判定。

## 10. M3-B：post-resume doctor

保存完整 no-tools Resume 回复后，再执行：

````text
请在不修改仓库、planning 文件、Managed policy 或 runtime 的前提下执行 beta.3-dev M3 resume 后健康检查：

set -Eeuo pipefail

node install.js doctor --json \
  --codex-home /opt/codex \
  --skill-root "$HOME/.agents/skills/planning-with-files" \
  --managed-requirements /etc/codex/requirements.toml

python3 - <<'PY'
import json
from pathlib import Path

runtime = Path('/opt/codex/hooks/planning-with-files')
manifest = json.loads((runtime / 'installed-manifest.json').read_text(encoding='utf-8'))
actual = sorted(
    str(path.relative_to(runtime)).replace('\\', '/')
    for path in runtime.rglob('*')
    if path.is_file() and path.name != 'installed-manifest.json'
)
declared = sorted(item['path'] for item in manifest['runtime_files'])
assert manifest.get('installer_version') == '0.3.0-beta.3-dev', manifest
assert len(actual) == 11, actual
assert actual == declared, (actual, declared)
print(f'INSTALLER_VERSION={manifest.get("installer_version")}')
print(f'INSTALLED_RUNTIME_FILES={len(actual)}')
print('INSTALLED_RUNTIME_INVENTORY=' + json.dumps(actual, ensure_ascii=False))
PY

SNAPSHOT_BASE="/tmp/pwf-codex-cloud-hooks-$(id -u)"
if [ -d "$SNAPSHOT_BASE" ]; then
  SNAPSHOT_LEFTOVERS="$(find "$SNAPSHOT_BASE" -mindepth 1 -maxdepth 1 -type d -name 'pwf-snapshot-*' | wc -l)"
else
  SNAPSHOT_LEFTOVERS=0
fi
printf 'SNAPSHOT_LEFTOVERS=%s\n' "$SNAPSHOT_LEFTOVERS"

请保留完整输出，并严格汇总：
Post-resume doctor exit: 实际退出码
Post-resume doctor healthy: true 或 false
Post-resume doctor repairable: 实际值
Post-resume doctor errors: 实际数组
Post-resume doctor blockers: 实际数组
Installer version: 实际值
Installed runtime files: 实际数字
Snapshot leftovers: 实际数字
````

PASS：doctor exit 0、healthy true、repairable false、errors/blockers 为空、version 为 beta.3-dev、
11 个 payload 与 manifest 精确相等、snapshot leftovers 为 0。

### 10.1 已接受的 post-resume doctor 证据

- doctor exit `0`，`healthy=true`，`repairable=false`，`errors=[]`，`blockers=[]`；
- installer version：`0.3.0-beta.3-dev`；
- installed runtime files：`11`，实际清单与 manifest 声明精确相等；
- inventory 包含 adapter、两个 owned runtimes、两份 exact-v1 schema、四份 upstream 文件、
  compatibility ledger 和 third-party notice；
- snapshot leftovers：`0`。

至此 M3-B 全部 PASS。该结果不自动授权 M3-C、治理 commit、push、public `main`、Release 或 M4。

## 11. M3-C 证据关闭

至少保存：

| Gate | 必需证据 |
|---|---|
| M3-A | accepted HEAD/root、63/63、mode、importer、isolated doctor、22-entry deterministic ZIP、zero hash、clean |
| setup | exact accepted HEAD/ZIP SHA、local `file://` install、pristine Skill、adapter-only policy、doctor healthy |
| Fresh | startup SessionStart canary、UserPrompt canary |
| baseline/UserPrompt | real `patch_apply_end`、canonical plan、recent progress |
| Resume | resume canary、catch-up、update、截断保尾、顺序、同一 plan |
| doctor | beta.3-dev、11 payload、manifest exact、zero snapshot residue |

关闭 M3 时记录“实际被测试的 commit”和全部原始输出。若关闭文档形成后继 commit，必须证明从 tested
commit 到 closure commit 只变化 AGENTS/README/ARCHITECTURE/ROADMAP/provenance/handoff/docs/planning
等治理文件；任何 production、tests、contract、Release input 变化都会使 M3 失效并要求重跑。

M3 PASS 后唯一 Next Step 是等待 M4 Discovery 授权。不得自动创建 public `main`、改变默认分支、
发布 beta.3、修改旧仓库导航、cut over production 或进入 Product Phase 4。

### 11.1 接受的 M3 证据清单

| Gate | 接受值 |
|---|---|
| tested commit | `39795283cd65f84547651d7bec816191fb5bfedf` |
| M2 root/tree | `3234e4e02090c838f5ee260cd8f2d99daf358d65` / `300f5a86b122df58f91fe7fee67e3cc561fd967f` |
| M3-A Linux | 63/63/0/0；root/cross-user/process-group、isolated doctor、adapter-only PASS |
| development ZIP | 22 entries / 75,323 bytes / `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508` |
| setup | exact HEAD/SHA、pristine Skill、healthy doctor、两个 adapter probes PASS |
| Fresh | SessionStart `startup` 与 UserPromptSubmit canary OBSERVED |
| baseline/UserPrompt | baseline ACK；六项 canonical context 全部 OBSERVED |
| Resume | rollout `019fd4e2...`；message #36；16 unsynced；截断/尾标记/顺序/plan PASS |
| doctor | exit 0；healthy；beta.3-dev；11-file manifest exact；snapshot 0 |

各 gate 的接受输出分别保存在 5.3、6.1、7.1、8.1、9.1 和 10.1。M3-B 的 setup/Fresh/
baseline/canonical/long-wrapper/Resume/doctor 原始回复由维护者逐步返回；本清单保留所有决定
PASS/FAIL 的原始字段、完整 identity、计数、hash、reason arrays 和 inventory 边界。

### 11.2 Closure descendant 证明

从 tested commit 到包含本节的 closure commit 恰好变化七个既有治理路径：

```text
.planning/2026-08-05-slim-repository-migration/findings.md
.planning/2026-08-05-slim-repository-migration/progress.md
.planning/2026-08-05-slim-repository-migration/task_plan.md
AGENTS.md
MAINTAINER_HANDOFF.md
ROADMAP.md
docs/beta3-dev-m3-cloud-equivalence.md
```

验证结果：60 tracked paths、唯一 parentless M2 root、四个 `100755` upstream 文件、M1 audit ref/
tree、远端 tested HEAD 均未移动；production、tests、contracts、bootstrap 与 Release allowlist
overlap 为零。Importer/static、13-doc UTF-8/fences、focused contracts 4/4、`git diff --check` 和两次
确定性 ZIP 均 PASS。该 commit 只在本地创建，未 push。M3 至此关闭。

当前补充：M4 后续通过独立 Discovery、authority、archive/provenance 和 cutover/rollback gates
完成仓库切换；M4-C 接受点为 `main@0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151`。这不会改写
本文件冻结的 M3 tested commit、ZIP SHA 或当时的 stop conditions。successor 现在是源码权威，
旧仓库仍是 published beta.2 rollback/history 权威；beta.3-dev 与 Product Phase 4 均未发布/未授权。
