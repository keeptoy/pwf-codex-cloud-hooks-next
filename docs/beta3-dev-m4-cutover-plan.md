# beta.3-dev M4 仓库切换方案

> 状态：`M4 COMPLETE / CLOUD ACCEPTED`
>
> 本文冻结 successor authority cutover 的路线、外部变更、验证和回滚合同，并记录 M4-A/B/C
> 的实际结果。M4 已关闭；tag/Release、live `/opt/codex`、production behavior 和产品 Phase 4
> 没有因迁移完成而获得授权。

## 1. 目标与边界

M4 只解决“哪个 GitHub 仓库和默认分支成为后续源码维护权威”。它不重新证明 PWF 产品设计，
不重发 beta.2，也不把 repository cutover 偷换成 beta.3 Release。

M4 完成后应同时满足：

- successor 的公开默认分支是 `main`，其起点是已审计 M3 后代；
- M3 Cloud-tested ref 和 M1 audit oracle 保持可读、原 SHA、不被改名或移动；
- 旧仓库继续公开、未归档，保留 beta.2 Release、历史证据和独立 rollback；
- 旧仓库入口明确指向 successor，successor provenance 反向链接旧冻结来源；
- fresh clone 不指定 branch 时得到 exact `main`，并通过 no-live 回归；
- development bootstrap 仍为 zero hash，M4 不发布任何资产；
- 产品 Phase 4 仍需新的 Discovery 授权。

## 2. Discovery 冻结事实

| 项目 | 观测值 |
|---|---|
| successor | `keeptoy/pwf-codex-cloud-hooks-next`，public，未归档 |
| 当前远端默认分支 | `migration/slim-beta3-dev` |
| 当前远端分支 | `migration/slim-beta3-dev`、`audit/beta2-exact` |
| 当前远端 `main` / tags / Releases | 均不存在 |
| Cloud-tested development | `39795283cd65f84547651d7bec816191fb5bfedf` |
| 本地 M3 closure | `d93087632ef0e77659cd65e87e316fa6da38b939` |
| parentless M2 root | `3234e4e02090c838f5ee260cd8f2d99daf358d65` |
| M1 audit oracle | `bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b` |
| successor rulesets | public API 观测为 0；classic protection 未观察 |
| 旧仓库默认分支 | `0.3.0-beta.2` |
| 旧仓库 rollback | immutable `v0.3.0-beta.2` ZIP/bootstrap |
| 旧仓库本地状态 | M3 handoff checkpoint 比远端领先一个治理提交 |

GitHub 当前文档说明：仓库必须已有第二个分支才能切换默认分支；rename 会重定向网页文件 URL，
但 raw URL 和 `git pull` 不会跟随 rename。ruleset 可与 classic protection 叠加，并可限制删除和
non-fast-forward。参考：

- <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/changing-the-default-branch>
- <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/renaming-a-branch>
- <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets>
- <https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches>

## 3. 路线比较与冻结选择

| 路线 | 优点 | 代价/风险 | 判断 |
|---|---|---|---|
| 把当前默认 development branch 直接 rename 为 `main` | 操作少，GitHub 更新部分链接和策略 | M3 证据 ref 消失；raw/Git pull 不重定向；把证据保存与 authority cutover 耦合 | 不采用 |
| 先 fast-forward 远端 development，再从它建 `main` | 两个 ref 起点一致 | 移动实际 Cloud-tested ref，弱化精确证据身份 | 不采用 |
| 从经审计本地后代新建 `main`，再切 default | 保留 tested ref；每个外部动作可独立验证/回滚；无 force | 多保留一个 evidence branch；需要显式 default/ruleset 操作 | **采用** |
| rename successor 或复用旧仓库 slug | URL 表面更短 | 破坏 beta.2 来源边界、redirect/Release/rollback 语义复杂 | 不采用 |
| cutover 同时发布 beta.3 | 新仓库立即有可安装资产 | 版本/bootstrap/README/tests 和 Release bytes 全变；必须重跑完整发布验收 | 本 M4 不采用 |

冻结选择：保留 successor slug；保留两个 evidence refs；从 exact M4 candidate 新建 `main`；确认
remote SHA 后切 default；设置最小 integrity ruleset；旧仓库只加导航，不 archive/rename/delete；
Release 留给单独授权的发布 gate。

## 4. M4 子门与轮次

M4 按四轮处理，任一轮不自动授权下一轮：

1. **Discovery（本轮）**：恢复事实、比较路线、冻结本文和 61-path 边界；无外部写入。
2. **M4-A successor authority**：创建远端 `main`、验证 exact SHA、切 default、配置 integrity policy。
3. **M4-B archive/provenance handoff**：更新旧仓库入口与 successor provenance，保持 beta.2 不变。
4. **M4-C cutover/rollback acceptance**：fresh default clone、Linux/Cloud no-live seal、rollback 下载复验、交割演练和闭环。

如果 classic protection、GitHub policy、SHA、default clone 或 beta.2 资产与本文不一致，必须插入
新的探路子门，不能继续下一个外部动作。

## 5. M4-A — successor authority

### 5.1 前置条件

- M4 Discovery checkpoint 已由维护者确认，两个工作区 clean；
- exact candidate 是 `d9308763...` 的普通后代；
- candidate 相对 `39795283...` 只含已批准 governance/repository-boundary 变化；
- production、contracts、bootstrap、Release 22-entry inputs 均无变化；
- fetch 后远端 development 仍为 `39795283...`，audit 仍为 `bbad3703...`；
- authenticated GitHub 设置页/API 已记录 classic protection、rulesets、default 和权限；
- 维护者明确授权 M4-A 的远端 mutations。

### 5.2 冻结顺序

1. 记录 `EXPECTED_MAIN_SHA`，运行 importer、focused/full suite、确定性 ZIP 和 clean gate；
2. 以 non-force exact refspec 新建远端分支：

   ```bash
   git push origin "$EXPECTED_MAIN_SHA:refs/heads/main"
   ```

3. 重新读取远端，要求 `main == EXPECTED_MAIN_SHA`，development/audit 均未移动；
4. 把 successor default branch 从 development 切为 `main`；
5. 新建 active `main-integrity` ruleset：exact target `main`，限制删除和 non-fast-forward；不在
   没有 CI 的情况下伪造 required status checks；
6. 单独保护 evidence refs，至少限制删除和 non-fast-forward；是否完全 restrict updates 必须在
   M4-A 前置检查中确认维护者的应急维护方式；
7. 可选设置简短 repository description；不得 rename 或 archive repository；
8. 无 branch 参数 fresh clone，验证默认 checkout 为 `main` 和 exact SHA。

### 5.3 M4-A 严格汇总

```text
Main created by non-force exact ref: PASS/FAIL
Remote main SHA: <sha>/NOT_OBSERVED
Development evidence SHA unchanged: PASS/FAIL
Audit oracle SHA unchanged: PASS/FAIL
Default branch main: PASS/FAIL
Main integrity policy active: PASS/FAIL
Classic protection observation: <actual>/NOT_OBSERVED
Fresh default clone main/exact: PASS/FAIL
Release/tag/live Cloud mutations: 0/<actual>
M4-A successor authority: PASS/FAIL
```

只有全部 PASS 才可输出 `M4A_SUCCESSOR_AUTHORITY_CUTOVER=PASS`。

## 6. M4-B — archive 与 provenance 交割

### 6.1 successor

- `BASELINE_PROVENANCE.md` 把旧仓库、冻结 commit、beta.2 Release 和两个资产写成可点击的精确链接；
- `ROADMAP.md`、`MAINTAINER_HANDOFF.md` 和 planning 记录 `main`/default/protection 实际值；
- README 继续只描述稳定行为，不复制 cutover 流水账，也不改变 Release input bytes；
- development bootstrap 继续 zero hash。

### 6.2 旧仓库

- README 顶部增加归档/回滚 banner，明确当前开发权威和 successor URL；
- AGENTS/work plan/活动 planning 更新为“历史证据与 beta.2 Release 权威”；
- 保留所有历史源码、branches、tags、Releases 和 beta.2 资产；
- default 继续是 `0.3.0-beta.2`，仓库保持 public、unarchived；
- 先包含本地 M3 handoff checkpoint，再用 normal push 发布导航提交；
- 可选更新 description，但不得 rename、archive、delete 或重写 Release。

M4-B 完成标记：`M4B_ARCHIVE_PROVENANCE_HANDOFF=PASS`。

## 7. M4-C — cutover 与 rollback 验收

在全新 Cloud/Linux 临时目录中通过仓库 URL clone，不能指定 branch：

1. 默认 checkout 必须为 `main` 和 M4 接受 SHA；
2. exact tracked boundary 为 61 paths，且只有四个 upstream 文件为 `100755`；
3. importer、Python/Node/Bash static、Linux suite 全绿；
4. 两次 development ZIP 必须仍为 22 entries，并与接受的 M3 ZIP SHA-256
   `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508` 相同；
5. bootstrap 仍为 zero hash，并继续拒绝 production install；
6. 从旧仓库 Release 页面下载 beta.2 ZIP/bootstrap，核对 SHA-256
   `812cc9cdcafa93b5fcc47cc763fd743f11be77958b75eea1fa4cf0508dd391ab` 与
   `d572b77d920b34c34c7912ba364376ae3668216f00ce350251bd7c8b336abcd6`；
7. beta.2 rollback doctor/build check 必须不依赖 successor 的修复或资产；
8. 按 `MAINTAINER_HANDOFF.md` 做一次新人接手演练；
9. 新旧工作区 clean，远端 main/default/evidence refs/old default 再次核对。

M4-B 最终读回 commit 是 `5476a5c97e713d935622a9998f902e35a114db07`。由于唯一验收脚本本身
需要提交到本文，M4-C 接受 HEAD 必须是它的**一个且只有一个**普通后代，并且该后代只能修改下面
七个治理文件：根 `AGENTS.md`、`ROADMAP.md`、`MAINTAINER_HANDOFF.md`、本文和活动 planning 三文件。
脚本在 clone 前捕获远端 `main` 精确 SHA，运行末尾要求同一 SHA 未移动；这避免把 moving branch
误当作固定验收身份，同时也避免在 commit 内容中制造无法收敛的 self-hash。

### 7.1 执行边界

- 在没有预设仓库 setup script 的全新 Cloud/Linux task 中复制执行下方完整 Bash；脚本自己 clone
  两个 public repository，不能从当前 workspace 或历史 cache 借用文件；
- 不执行 successor development bootstrap，也不执行下载的 beta.2 bootstrap；前者只调用无副作用
  的 zero-hash guard，后者只做不可变资产 hash/size 校验；
- beta.2 install/doctor 只写 `mktemp` 下的隔离 `CODEX_HOME` 和 requirements，Skill 输入只来自
  旧仓库自己的 pinned fixture；不得读取 successor 的 fixture/runtime 来帮助 rollback；
- 成功输出 `M4C_CUTOVER_ROLLBACK_ACCEPTANCE=PASS` 后，把完整严格汇总返回维护者。该 marker 只
  关闭 Cloud gate；`M4_REPOSITORY_CUTOVER=PASS` 必须等证据回写和双仓库 clean/remote readback
  完成后才能由维护者记录。

### 7.2 唯一执行脚本

```bash
set -Eeuo pipefail

PROBE_VERSION="PWF_BETA3DEV_M4C_CUTOVER_ROLLBACK_V1"
SUCCESSOR_URL="https://github.com/keeptoy/pwf-codex-cloud-hooks-next.git"
ARCHIVE_URL="https://github.com/keeptoy/pwf-codex-cloud-hooks.git"
M4B_FINAL_SHA="5476a5c97e713d935622a9998f902e35a114db07"
DEVELOPMENT_SHA="39795283cd65f84547651d7bec816191fb5bfedf"
AUDIT_SHA="bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b"
ARCHIVE_DEFAULT_SHA="11ef7c968ad8e8ef0babe5ed169e814b71cea18a"
DEVELOPMENT_ZIP_SHA256="82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508"
BETA2_ZIP_SHA256="812cc9cdcafa93b5fcc47cc763fd743f11be77958b75eea1fa4cf0508dd391ab"
BETA2_BOOTSTRAP_SHA256="d572b77d920b34c34c7912ba364376ae3668216f00ce350251bd7c8b336abcd6"
BETA2_BASE_URL="https://github.com/keeptoy/pwf-codex-cloud-hooks/releases/download/v0.3.0-beta.2"
ZERO_SHA256="0000000000000000000000000000000000000000000000000000000000000000"

for command in bash cmp curl git mktemp node python3 sha256sum unzip; do
  command -v "$command" >/dev/null 2>&1 || {
    printf 'MISSING_COMMAND=%s\n' "$command" >&2
    exit 1
  }
done

PROBE_DIR="$(mktemp -d)"
trap 'rm -rf -- "$PROBE_DIR"' EXIT
case "$PROBE_DIR" in
  /tmp/*|/var/tmp/*) ;;
  *) printf 'UNTRUSTED_PROBE_DIR=%s\n' "$PROBE_DIR" >&2; exit 1 ;;
esac

SUCCESSOR_CLONE="$PROBE_DIR/successor"
ARCHIVE_CLONE="$PROBE_DIR/archive"
TEST_OUTPUT="$PROBE_DIR/linux-suite.tap"
ZIP_ONE="$PROBE_DIR/development-one.zip"
ZIP_TWO="$PROBE_DIR/development-two.zip"
BETA2_ZIP="$PROBE_DIR/pwf-codex-cloud-hooks-v0.3.0-beta.2.zip"
BETA2_BOOTSTRAP="$PROBE_DIR/init-cloud-sandbox-v0.3.0.bash"
BETA2_PACKAGE_DIR="$PROBE_DIR/beta2-package"
BETA2_CODEX_HOME="$PROBE_DIR/beta2-codex-home"
BETA2_REQUIREMENTS="$PROBE_DIR/beta2-etc/codex/requirements.toml"

remote_sha() {
  git ls-remote "$1" "$2" |
    awk -v expected_ref="$2" '$2 == expected_ref { print $1 }'
}

SUCCESSOR_SYMREF_BEFORE="$(git ls-remote --symref "$SUCCESSOR_URL" HEAD)"
printf '%s\n' "$SUCCESSOR_SYMREF_BEFORE" | grep -Fqx $'ref: refs/heads/main\tHEAD'
EXPECTED_MAIN_SHA="$(printf '%s\n' "$SUCCESSOR_SYMREF_BEFORE" |
  awk '$2 == "HEAD" && $1 != "ref:" && length($1) == 40 { print $1 }')"
test -n "$EXPECTED_MAIN_SHA"
test "$(remote_sha "$SUCCESSOR_URL" refs/heads/main)" = "$EXPECTED_MAIN_SHA"
test "$(remote_sha "$SUCCESSOR_URL" refs/heads/migration/slim-beta3-dev)" = "$DEVELOPMENT_SHA"
test "$(remote_sha "$SUCCESSOR_URL" refs/heads/audit/beta2-exact)" = "$AUDIT_SHA"

ARCHIVE_SYMREF_BEFORE="$(git ls-remote --symref "$ARCHIVE_URL" HEAD)"
printf '%s\n' "$ARCHIVE_SYMREF_BEFORE" |
  grep -Fqx $'ref: refs/heads/0.3.0-beta.2\tHEAD'
test "$(remote_sha "$ARCHIVE_URL" refs/heads/0.3.0-beta.2)" = "$ARCHIVE_DEFAULT_SHA"

git clone --quiet "$SUCCESSOR_URL" "$SUCCESSOR_CLONE"
git -C "$SUCCESSOR_CLONE" branch --show-current | grep -Fxq main
test "$(git -C "$SUCCESSOR_CLONE" rev-parse HEAD)" = "$EXPECTED_MAIN_SHA"
test "$(git -C "$SUCCESSOR_CLONE" symbolic-ref refs/remotes/origin/HEAD)" = \
  refs/remotes/origin/main
test "$(git -C "$SUCCESSOR_CLONE" rev-parse HEAD^)" = "$M4B_FINAL_SHA"
test "$(git -C "$SUCCESSOR_CLONE" rev-list --count "$M4B_FINAL_SHA..HEAD")" -eq 1

EXPECTED_GOVERNANCE_DIFF="$(cat <<'EOF'
.planning/2026-08-05-slim-repository-migration/findings.md
.planning/2026-08-05-slim-repository-migration/progress.md
.planning/2026-08-05-slim-repository-migration/task_plan.md
AGENTS.md
MAINTAINER_HANDOFF.md
ROADMAP.md
docs/beta3-dev-m4-cutover-plan.md
EOF
)"
ACTUAL_GOVERNANCE_DIFF="$(
  git -C "$SUCCESSOR_CLONE" diff --name-only "$M4B_FINAL_SHA..HEAD" |
    LC_ALL=C sort
)"
test "$ACTUAL_GOVERNANCE_DIFF" = "$EXPECTED_GOVERNANCE_DIFF"

test "$(git -C "$SUCCESSOR_CLONE" ls-files | wc -l)" -eq 61
EXPECTED_EXECUTABLES="$(cat <<'EOF'
runtime/upstream/inject-plan.sh
runtime/upstream/ledger-summary.sh
runtime/upstream/resolve-plan-dir.sh
runtime/upstream/session-catchup.py
EOF
)"
ACTUAL_EXECUTABLES="$(
  git -C "$SUCCESSOR_CLONE" ls-files --stage |
    awk '$1 == "100755" { print $4 }' |
    LC_ALL=C sort
)"
test "$ACTUAL_EXECUTABLES" = "$EXPECTED_EXECUTABLES"

cd "$SUCCESSOR_CLONE"
python3 tools/import_upstream_runtime.py check > "$PROBE_DIR/importer.json"
python3 - <<'PY'
from pathlib import Path
for value in (
    "hooks/hook_adapter.py",
    "runtime/owned-plan.py",
    "runtime/owned-catchup.py",
):
    path = Path(value)
    compile(path.read_text(encoding="utf-8"), str(path), "exec")
PY
node --check install.js
bash -n init-cloud-sandbox-v0.3.0.bash

if ! node --test --test-reporter=tap tests/*.test.js > "$TEST_OUTPUT" 2>&1; then
  cat "$TEST_OUTPUT" >&2
  exit 1
fi
if ! python3 - "$TEST_OUTPUT" <<'PY'
import re
import sys
from pathlib import Path

text = Path(sys.argv[1]).read_text(encoding="utf-8")
expected = {"tests": 63, "pass": 63, "fail": 0, "skipped": 0}
for name, value in expected.items():
    matches = re.findall(rf"^(?:#|ℹ)\s*{name}\s+(\d+)\s*$", text, re.MULTILINE)
    if not matches or int(matches[-1]) != value:
        raise SystemExit(f"unexpected {name} summary: {matches}")
PY
then
  cat "$TEST_OUTPUT" >&2
  exit 1
fi

python3 tools/build_release.py build --output "$ZIP_ONE" > /dev/null
python3 tools/build_release.py check --archive "$ZIP_ONE" > /dev/null
python3 tools/build_release.py build --output "$ZIP_TWO" > /dev/null
python3 tools/build_release.py check --archive "$ZIP_TWO" > /dev/null
cmp "$ZIP_ONE" "$ZIP_TWO"
test "$(unzip -Z1 "$ZIP_ONE" | wc -l)" -eq 22
test "$(wc -c < "$ZIP_ONE")" -eq 75323
test "$(sha256sum "$ZIP_ONE" | awk '{print $1}')" = "$DEVELOPMENT_ZIP_SHA256"

grep -Fq "readonly HOOKS_SHA256=\"\${HOOKS_SHA256:-$ZERO_SHA256}\"" \
  init-cloud-sandbox-v0.3.0.bash
set +e
BOOTSTRAP_REJECTION="$(
  bash -c 'source "$1"; assert_hooks_checksum_configured' _ \
    "$SUCCESSOR_CLONE/init-cloud-sandbox-v0.3.0.bash" 2>&1
)"
BOOTSTRAP_STATUS=$?
set -e
test "$BOOTSTRAP_STATUS" -ne 0
printf '%s\n' "$BOOTSTRAP_REJECTION" | grep -Fq 'HOOKS_SHA256 is still a placeholder'

git clone --quiet "$ARCHIVE_URL" "$ARCHIVE_CLONE"
git -C "$ARCHIVE_CLONE" branch --show-current | grep -Fxq '0.3.0-beta.2'
test "$(git -C "$ARCHIVE_CLONE" rev-parse HEAD)" = "$ARCHIVE_DEFAULT_SHA"
test "$(git -C "$ARCHIVE_CLONE" symbolic-ref refs/remotes/origin/HEAD)" = \
  refs/remotes/origin/0.3.0-beta.2

curl --fail --silent --show-error --location --retry 3 \
  --output "$BETA2_ZIP" \
  "$BETA2_BASE_URL/pwf-codex-cloud-hooks-v0.3.0-beta.2.zip"
curl --fail --silent --show-error --location --retry 3 \
  --output "$BETA2_BOOTSTRAP" \
  "$BETA2_BASE_URL/init-cloud-sandbox-v0.3.0.bash"
printf '%s  %s\n' "$BETA2_ZIP_SHA256" "$BETA2_ZIP" | sha256sum --check --status -
printf '%s  %s\n' "$BETA2_BOOTSTRAP_SHA256" "$BETA2_BOOTSTRAP" |
  sha256sum --check --status -
test "$(wc -c < "$BETA2_ZIP")" -eq 84572
test "$(wc -c < "$BETA2_BOOTSTRAP")" -eq 17425

mkdir -p "$BETA2_PACKAGE_DIR" "$BETA2_CODEX_HOME" "$(dirname "$BETA2_REQUIREMENTS")"
unzip -q "$BETA2_ZIP" -d "$BETA2_PACKAGE_DIR"
BETA2_PACKAGE="$BETA2_PACKAGE_DIR/pwf-codex-cloud-hooks"
test -f "$BETA2_PACKAGE/install.js"
test -f "$BETA2_PACKAGE/tools/build_release.py"
python3 "$BETA2_PACKAGE/tools/build_release.py" check \
  --contract "$BETA2_PACKAGE/contracts/release-artifact-v1.json" \
  --archive "$BETA2_ZIP" > /dev/null
python3 - "$BETA2_PACKAGE/package.json" <<'PY'
import json
import sys
from pathlib import Path
assert json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))["version"] == "0.3.0-beta.2"
PY

node "$BETA2_PACKAGE/install.js" install --json \
  --codex-home "$BETA2_CODEX_HOME" \
  --skill-root "$ARCHIVE_CLONE/tests/fixtures/planning-with-files" \
  --managed-requirements "$BETA2_REQUIREMENTS" > "$PROBE_DIR/beta2-install.json"
node "$BETA2_PACKAGE/install.js" doctor --json \
  --codex-home "$BETA2_CODEX_HOME" \
  --skill-root "$ARCHIVE_CLONE/tests/fixtures/planning-with-files" \
  --managed-requirements "$BETA2_REQUIREMENTS" > "$PROBE_DIR/beta2-doctor.json"

python3 - \
  "$PROBE_DIR/beta2-install.json" \
  "$PROBE_DIR/beta2-doctor.json" \
  "$BETA2_CODEX_HOME/hooks/planning-with-files/installed-manifest.json" \
  "$BETA2_REQUIREMENTS" \
  "$BETA2_CODEX_HOME" <<'PY'
import json
import sys
from pathlib import Path

install = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
doctor = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
manifest = json.loads(Path(sys.argv[3]).read_text(encoding="utf-8"))
requirements = Path(sys.argv[4]).read_text(encoding="utf-8")
codex_home = str(Path(sys.argv[5]).resolve())
assert install["healthy"] is True
assert doctor == {
    **doctor,
    "action": "doctor",
    "healthy": True,
    "repairable": False,
    "managed": True,
    "events": ["SessionStart", "UserPromptSubmit"],
    "errors": [],
    "blockers": [],
}
assert len(manifest["runtime_files"]) == 11
assert codex_home in requirements
assert "/opt/codex" not in requirements
PY

for file in \
  AGENTS.md README.md ARCHITECTURE.md ROADMAP.md BASELINE_PROVENANCE.md \
  MAINTAINER_HANDOFF.md .planning/.active_plan; do
  test -s "$SUCCESSOR_CLONE/$file"
  sed -n '1,80p' "$SUCCESSOR_CLONE/$file" > /dev/null
done
PLAN_ID="$(tr -d '\r\n[:space:]' < "$SUCCESSOR_CLONE/.planning/.active_plan")"
case "$PLAN_ID" in
  ''|*[!A-Za-z0-9._-]*) exit 1 ;;
esac
for file in task_plan.md findings.md progress.md; do
  test -s "$SUCCESSOR_CLONE/.planning/$PLAN_ID/$file"
  sed -n '1,80p' "$SUCCESSOR_CLONE/.planning/$PLAN_ID/$file" > /dev/null
done
grep -Fq 'v0.3.0-beta.2' "$SUCCESSOR_CLONE/README.md"
grep -Fq '0.3.0-beta.3-dev' "$SUCCESSOR_CLONE/README.md"
grep -Fq 'global PWF Skill' "$SUCCESSOR_CLONE/ARCHITECTURE.md"
grep -Fq 'bootstrap 永远在 ZIP 外' "$SUCCESSOR_CLONE/AGENTS.md"

test -z "$(git -C "$SUCCESSOR_CLONE" status --short)"
test -z "$(git -C "$ARCHIVE_CLONE" status --short)"
test -z "$(find "$SUCCESSOR_CLONE" -type d -name __pycache__ -print -quit)"

SUCCESSOR_SYMREF_AFTER="$(git ls-remote --symref "$SUCCESSOR_URL" HEAD)"
ARCHIVE_SYMREF_AFTER="$(git ls-remote --symref "$ARCHIVE_URL" HEAD)"
test "$SUCCESSOR_SYMREF_AFTER" = "$SUCCESSOR_SYMREF_BEFORE"
test "$ARCHIVE_SYMREF_AFTER" = "$ARCHIVE_SYMREF_BEFORE"
test "$(remote_sha "$SUCCESSOR_URL" refs/heads/main)" = "$EXPECTED_MAIN_SHA"
test "$(remote_sha "$SUCCESSOR_URL" refs/heads/migration/slim-beta3-dev)" = "$DEVELOPMENT_SHA"
test "$(remote_sha "$SUCCESSOR_URL" refs/heads/audit/beta2-exact)" = "$AUDIT_SHA"
test "$(remote_sha "$ARCHIVE_URL" refs/heads/0.3.0-beta.2)" = "$ARCHIVE_DEFAULT_SHA"
test -z "$(git ls-remote --tags "$SUCCESSOR_URL")"

printf 'PROBE_VERSION=%s\n' "$PROBE_VERSION"
printf 'M4C_ACCEPTED_MAIN=%s\n' "$EXPECTED_MAIN_SHA"
printf 'M4B_GOVERNANCE_DESCENDANT=PASS paths=7 commits=1\n'
printf 'LINUX_SUITE=PASS tests=63 pass=63 fail=0 skipped=0\n'
printf 'SUCCESSOR_BOUNDARY=PASS paths=61 executables=4\n'
printf 'DEVELOPMENT_ZIP=PASS entries=22 size=75323 sha256=%s\n' \
  "$DEVELOPMENT_ZIP_SHA256"
printf 'DEVELOPMENT_BOOTSTRAP_ZERO_HASH=PASS\n'
printf 'BETA2_ASSETS=PASS zip_size=84572 bootstrap_size=17425\n'
printf 'BETA2_ROLLBACK_BUILD_DOCTOR=PASS payloads=11 isolated=true\n'
printf 'MAINTAINER_HANDOFF_REHEARSAL=PASS\n'
printf 'REMOTE_DEFAULT_AND_EVIDENCE_RECHECK=PASS\n'
printf 'LIVE_CODEX_MUTATIONS=0\n'
printf 'WORKSPACES_CLEAN=YES\n'
printf 'M4C_CUTOVER_ROLLBACK_ACCEPTANCE=PASS\n'
```

脚本成功时只输出上面的严格汇总；Linux suite 仅在失败时展开完整 TAP，避免正常运行产生一长串
无关日志。任何命令失败都会由 `set -Eeuo pipefail` 立即停止，且不会输出 PASS marker。

M4-C Cloud 完成标记：`M4C_CUTOVER_ROLLBACK_ACCEPTANCE=PASS`。M4 最终闭环标记仍为
`M4_REPOSITORY_CUTOVER=PASS`，但只能在 Cloud 结果回写后记录。

## 8. 外部 mutation 清单

| Mutation | 所属 gate | 本 Discovery 是否授权 | 失败后的安全状态 |
|---|---|---|---|
| push new `main` exact ref | M4-A | 否 | main 存在但非 default；停止并核对 SHA |
| change successor default | M4-A | 否 | 可切回 development；不得删除证据 ref |
| create/edit integrity ruleset | M4-A | 否 | 未验收前切回旧 default 或修正规则 |
| update successor description | M4-A，可选 | 否 | 无代码影响，可独立恢复 |
| push old archive navigation | M4-B | 否 | successor 已可用，旧 README 暂时滞后；停止补齐 |
| update old description | M4-B，可选 | 否 | 无资产影响，可独立恢复 |
| tag/Release/upload asset | 独立 Release gate | 否 | M4 全程禁止 |
| archive/rename/delete repository | 本路线不使用 | 否 | 禁止 |

## 9. 失败矩阵

| 失败点 | 分类 | 必须动作 |
|---|---|---|
| candidate 含 production/Release input | boundary drift | 停止 M4，回到 Discovery 分类 |
| remote development/audit SHA 不符 | external drift | 不 push；保留现场并查明来源 |
| new main SHA 不符 | transport defect | 不切 default；禁止 force 修正 |
| default 切换失败 | repository setting | main 保持非 default；停止 |
| protection/ruleset 与预期冲突 | policy divergence | 不宣告 authority；记录 classic/ruleset 层叠 |
| fresh clone 非 main 或 SHA 不符 | cutover defect | 切回旧 default 或停止推进 |
| old beta.2 SHA/下载失败 | rollback blocker | 不关闭 M4，不发布 successor Release |
| development ZIP hash 改变 | Release-input drift | 查出 allowlist byte；不得沿用 M3 结论 |
| 需要改 production 才能 cutover | architecture divergence | M4 NO_GO，另开产品 gate |

## 10. Release 决策

M4 不发布 beta.3。把 cutover 与 Release 捆绑会修改 package/bootstrap/README/test 及最终资产，迫使
本轮同时承担版本封板、双资产下载和 live Fresh/Resume；这会把 repository authority 与 product
Release 的失败域合并。M4 只证明新默认源码权威和旧 beta.2 rollback。未来 Release 必须另行授权，
使用非 `-dev` 新 identity、真实 ZIP hash、外部 bootstrap hash 和完整发布后 Cloud 验收。

## 11. Discovery 退出条件

- [x] 本文、AGENTS、ROADMAP、handoff、planning 和 61-path boundary 同步；
- [x] production/contracts/bootstrap/Release inputs 相对 M3 closure 无变化；
- [x] importer、focused repository contracts、文档链接/fences 和 `git diff --check` PASS；
- [x] 路线、子门、外部 mutations、失败矩阵、rollback 和 Release 解耦已冻结；
- [x] 维护者收到 Discovery checkpoint；
- [x] 维护者明确授权 M4-A；本地/远端身份、回归与确定性 ZIP 前置检查通过；
- [x] 通过独立 GitHub CLI 授权建立受控管理通道，按 5.2 原顺序创建 exact `main`、
  切换 default、建立并核验 integrity rulesets、完成无分支 fresh clone；M4-A PASS。

## 12. M4-A 实际结果

```text
Main created by non-force exact ref: PASS
Remote main SHA: cc9bc878ddc7d70c25156dd053e2874758f0814a
Development evidence SHA unchanged: PASS
Audit oracle SHA unchanged: PASS
Default branch main: PASS
Main integrity policy active: PASS
Classic protection observation: ABSENT; protection is supplied by active rulesets
Fresh default clone main/exact: PASS
Release/tag/live Cloud mutations: 0
M4-A successor authority: PASS
```

`main-integrity` 和 `evidence-integrity` 均为 active branch ruleset，只包含
`deletion` 与 `non_fast_forward`。没有 required status checks，也没有完全禁止正常
fast-forward update。无分支 HTTPS fresh clone 检出 `main@cc9bc878...`、61 个 tracked
paths、四个 `100755` upstream runtime 文件和 clean workspace。

完成标记：`M4A_SUCCESSOR_AUTHORITY_CUTOVER=PASS`。本轮不授权 M4-B。

## 13. M4-B 实际结果

- successor 的 `BASELINE_PROVENANCE.md` 现在提供旧仓库、冻结 commit、beta.2 Release、
  ZIP/bootstrap 和 audit/main 的精确可点击链接；README 与 22-entry Release inputs 未改；
- successor ROADMAP、handoff 和 planning 记录 exact main/default/ruleset/evidence 实际值；
- 旧仓库 README 顶部明确指向 successor `main`，并把自身定位为 public/unarchived
  历史证据与 immutable beta.2 rollback 权威；安装与验收正文保留；
- 旧仓库 AGENTS、work plan 和 planning 已同步历史权威/停止边界；默认分支、仓库名称、
  public/unarchived 状态、tags、Releases 和 beta.2 assets 不变；
- successor importer、3/3 boundary、双 ZIP 22 entries / 75,323 bytes / SHA-256
  `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508` PASS；
- 双仓库 changed-doc UTF-8/LF/fence/local-link 与 `git diff --check` PASS。

完成标记：`M4B_ARCHIVE_PROVENANCE_HANDOFF=PASS`。维护者随后已单独授权 M4-C no-live
acceptance；Release/tag、live `/opt/codex`、production behavior 与 Product Phase 4 仍未授权。

## 14. M4-C 实际结果与迁移闭环

Cloud/Linux 在精确 `main@0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151` 执行了 7.2 的完整
唯一脚本，得到：

```text
PROBE_VERSION=PWF_BETA3DEV_M4C_CUTOVER_ROLLBACK_V1
M4C_ACCEPTED_MAIN=0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151
M4B_GOVERNANCE_DESCENDANT=PASS paths=7 commits=1
LINUX_SUITE=PASS tests=63 pass=63 fail=0 skipped=0
SUCCESSOR_BOUNDARY=PASS paths=61 executables=4
DEVELOPMENT_ZIP=PASS entries=22 size=75323 sha256=82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508
DEVELOPMENT_BOOTSTRAP_ZERO_HASH=PASS
BETA2_ASSETS=PASS zip_size=84572 bootstrap_size=17425
BETA2_ROLLBACK_BUILD_DOCTOR=PASS payloads=11 isolated=true
MAINTAINER_HANDOFF_REHEARSAL=PASS
REMOTE_DEFAULT_AND_EVIDENCE_RECHECK=PASS
LIVE_CODEX_MUTATIONS=0
WORKSPACES_CLEAN=YES
M4C_CUTOVER_ROLLBACK_ACCEPTANCE=PASS
```

严格结论：

- successor public default/source authority、两个 evidence refs 和旧仓库 default 在执行前后一致；
- beta.3-dev development ZIP 与 M3 接受字节一致，但仍不是 Release；
- beta.2 rollback 的下载、build 和隔离 doctor 不依赖 successor runtime/fixture 修复；
- 没有写 live `/opt/codex`，没有 tag/Release、production、rename/archive/delete 或 Product Phase 4
  mutation；
- M4 repository migration/cutover 已完整关闭。

完成标记：`M4_REPOSITORY_CUTOVER=PASS`。

7.2 脚本是针对 accepted `0b4bd7d...` 的封闭验收证据。后续正常治理提交会移动 `main`，不应
修改脚本的 exact-parent/seven-path 断言来伪造重跑；需要重验时应 checkout 该 accepted commit，
或另开一个带新输入的新 gate。

Discovery 自身不得输出任何 M4-A/B/C PASS 标记。
