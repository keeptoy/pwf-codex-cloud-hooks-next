<a name="cloud-hard-acceptance-template"></a>

# Cloud hard acceptance template

本文件是 `pwf-codex-cloud-hooks` 新版本 Cloud hard acceptance 的稳定写作与执行模板，不是任何版本的
验收结果，也不维护任何已发生的 candidate、accepted、Latest、rollback、PASS/PENDING、测试数量或资产大小。

版本专项 acceptance 直接引用本模板。多 gate 开发版本可以维护一张简洁的版本内 gate 验收状态表，并说明当前
gate 相对模板新增了什么验证；只有通道完成后才能登记 exact source、资产 identity 和实际证据。模板本身只在
Cloud lifecycle、trusted graph、Host ABI、Release boundary 或稳定观测协议变化时修改；普通版本轮换不得把
运行状态回填到这里，也不得整份复制模板脚本。

## 0. 使用规则

<a name="acceptance-document-responsibilities"></a>

### 0.1 文档职责与写入时机

| 位置 | 唯一职责 | 不得保存 |
|---|---|---|
| 本模板 | Source/Candidate 与 Published Release 的稳定执行协议、停止条件和 evidence schema | 具体版本、当前进度、资产 SHA 或某次 PASS |
| 活动 Release task plan | 当前授权、执行到哪一步、seal 输入、URL/SHA、Next Step、失败记录和恢复位置 | 已完成版本的长期不可变证据 |
| 版本专项 acceptance | 版本内 gate 验收状态、当前 gate 验收增量/模板同步、已完成 gate 的 exact evidence 与最终结论 | 逐步骤流水账、重试记录、Next Step、模板脚本副本 |
| ROADMAP | programme 角色、宏观 Release 授权与 lifecycle 结论 | seal 流水账、逐资产 SHA、逐步骤状态 |

多 gate 版本的状态表只回答“哪些 gate 已通过、当前验收哪个 gate、哪些 gate 尚未授权”，不能展开成执行到第几步、
第一次失败、重跑命令或下一步操作。当前 gate 可以标为 `CLOUD_ACCEPTANCE_PENDING`，但不能预填 source/ZIP/hash 或
伪造 PASS；通道完成后再把 exact evidence 一次性追加到同一文件。只有一次整体验收的版本可以省略状态表，直接
保存最终证据。development identity 收敛为 stable identity 时，重命名这份文件并更新内容，不得让 dev/stable
两份 acceptance 并存。

<a name="version-gate-status-ledger"></a>

### 0.2 版本内 gate 验收状态（多 gate 版本）

状态表至少包含 gate、粗粒度状态、模板/证据入口和不授权边界。允许的状态语义是：已完成 gate 写 `PASS` 并链接
完成证据；唯一当前 gate 写 `CURRENT / CLOUD_ACCEPTANCE_PENDING` 并链接当前模板小节；未来 gate 写
`NOT_AUTHORIZED`。如果执行结果已通过但 exact source/asset/黑盒证据还未完整写回，可以短暂使用
`CURRENT / EVIDENCE_WRITEBACK_PENDING`；它不等于 PASS，也不能跨入下一 gate。状态表是“这个版本各阶段测到哪里”
的索引，不取代 ROADMAP 的 programme 状态，也不取代活动 task plan 的执行控制。一次性版本没有中间 gate 时
整个状态表省略。

<a name="version-acceptance-delta"></a>

### 0.3 “当前 gate 验收增量”（可选）

只有当前 gate 相对本模板新增或修改了验证面时，版本 acceptance 才写“当前 gate 验收增量”；没有验收增量时，
整个章节直接省略，不写“无”或占位文字。该章节至少回答：

1. 本版本改变了哪个 contract、信任边界或风险面，因此需要增加什么证明；
2. 增量落在模板哪个稳定 anchor、哪项 portable/publication test 或哪个 machine oracle；
3. B～E 黑盒提示词是否变化；若变化，指出模板中的具体小节和变化理由，若未变化则明确复用原协议；
4. gate 未完成时，哪项 exact output/结论将作为完成判据；完成后，再绑定实际返回的对应证据。

会被后续版本复用的共同验证必须先进入本模板，版本 acceptance 只链接对应小节并解释本版本为何需要它；
版本文件不得再次复制脚本、提示词或完整执行步骤。只针对一次 immutable identity 的检查可以链接相应
contract/test/oracle，不必把它提升为通用黑盒协议。

1. 从 ROADMAP 和活动 task plan 确认目标版本、当前角色、授权 gate 与停止条件。
2. 直接引用本模板执行，不把完整协议或脚本复制到版本 acceptance；版本专项文件必须进入当前角色窗口。
3. 在活动 Release task plan 冻结当次 source、tag、filename、size、URL、SHA、测试计数和停止条件。
4. 只有通道完整通过后，才在版本 acceptance 登记相应 exact identity、Cloud 原始结果和最终结论。
5. 执行第 4.2 节时替换 immutable bootstrap URL/SHA，执行第 9.2 节时替换 immutable ZIP URL/SHA；不得用 moving
   branch、`latest`、zero hash 或本地文件代替 Published Release identity。
6. 第 5～8 节的提示词原样使用，不嵌入版本名、动态 gate 结论或施工阶段 marker。
7. Source/Candidate 与 Published Release 必须使用两个独立、可丢弃的 Cloud 环境，不共享安装、planning、
   transcript、cache 或 B～F 结果。
8. 任一步失败立即停止并保存第一次错误；不得 repair 后继续把同一次 run 记为成功。

模板里的 `__...__` 是 fail-closed 占位符。实际执行副本或命令开始运行前不得残留任何占位符；占位符和
替换后的动态值只属于当次 Release task plan/执行环境，不写回稳定模板。

### 0.4 Cloud task 验收权限前缀

每个新 Cloud task 的第一条用户消息必须先带上下面这段权限前缀，再附该 task 对应的脚本或 B～E 提示词。它只
冻结验收期间的仓库写权限，不禁止 setup 安装到受控 CODEX_HOME、在临时目录构建候选或执行只读检查：

~~~text
本轮是验收任务，不是开发或修复任务。禁止创建或切换 branch，禁止 commit、push、创建或更新 PR/Release，禁止调用任何会写远端的 GitHub 操作。发现脚本、文档、产品或环境问题时立即停止并原样报告，不得自行修复后继续记 PASS。

除 Cloud hard acceptance 模板 C 段明确列出的 canonical planning fixture 与 .planning/.active_plan 外，不得修改仓库文件；C 段改动只保留在工作树，不得提交。不得修改 runtime、contracts、manifest、installer、builder、bootstrap 或其他候选/Release 输入。

命令的 stdout/stderr 分片不代表进程已经结束。若执行工具返回 session_id、running 状态或没有明确最终 exit_code，必须继续轮询同一 session，直到取得真实 exit_code；不得因当前分片尚未出现 PASS、首次等待超时或输出暂时静默而推断成功或失败。只有明确 exit_code=0 才能报告该命令 PASS，明确非零 exit_code 才能报告 FAIL；session 丢失或始终无法取得最终状态时只能报告 INCOMPLETE/UNKNOWN，禁止猜测或补写工具未返回的 exit code。最终汇报必须保留实际执行的命令/脚本身份、最终 exit code 和关键 stdout/stderr。
~~~

同一 task 后续消息继续受该前缀约束。模型违反该边界、自动修复后 commit，或创建 PR，当前通道立即作废；不能用
自动 PR 的新 HEAD 冒充原始 Source/Candidate checkout。

## 1. 双通道合同

| 通道 | 身份来源 | 安装路径 | 证明范围 |
|---|---|---|---|
| Source/Candidate | Cloud 实际 checkout 的完整 commit + 当次确定性构建 ZIP | 从 source 构建/check ZIP，以显式本地 `HOOKS_URL`/`HOOKS_SHA256` override 安装 | 当前 source、portable suite、候选 ZIP 与 installed behavior |
| Published Release | immutable public bootstrap URL + bootstrap SHA；bootstrap 内嵌默认 ZIP URL/SHA | environment setup 在 agent startup 前校验并执行 public bootstrap | 公开默认下载链、Fresh startup 与最终发布字节 |

Publication audit 另行在具备 exact refs 的维护环境执行完整 tag/source/asset oracle。Source/Candidate 的
tagless checkout 不应伪造 remote/tag；Published Release 也不能使用 workspace 同名工具代替公开资产。

## 2. 共同硬停止条件

<a name="acceptance-hard-stops"></a>

遇到以下任一情况立即停止：

- 无法记录 Source/Candidate 完整 commit，或 setup 前工作树不干净；
- Cloud Node major 不符合版本专项文件冻结的环境；
- 目标 CODEX_HOME 已存在不属于本次 Fresh run 的 managed runtime；
- portable suite 出现 fail/skip，或 publication-only oracle 混入 tagless Source/Candidate；
- 两次 ZIP 不逐字一致、builder/importer check 失败、bootstrap 进入 ZIP 或 Release inventory 漂移；
- global PWF Skill 不 pristine，Managed policy 不再 adapter-only，或 installed manifest/inventory 漂移；
- Fresh 与 Resume 的 SessionStart source 不符合安装时序；
- canonical plan、real Resume catch-up、tail marker或 canary/plan/catch-up 顺序不符合 current contract；markerless
  canonical fixture 的 completed/active 两个 legacy sentinel 未同时出现也属于失败；
- 验收期间出现 branch/commit/push/PR/Release 写入、自动修复，或 C 段之外的仓库改动；
- post-resume deep check 没有从 manifest 当前路由打印 release/bundle contract path、id、schema 和 installed root，
  或实际执行的是以前保存的 `/tmp`/聊天脚本而不是当前 checkout/template 中的 9.1/9.2；
- 异步命令仍返回 session/running 或没有明确最终 exit code；此时状态只能是 `INCOMPLETE/UNKNOWN`，必须继续轮询，
  不得把部分 stdout、缺少 PASS marker 或首次 yield timeout 归类为产品/脚本失败；
- doctor 不健康、repairable、存在 error/blocker 或 snapshot residue；
- Published 脚本仍有占位符，或者使用 moving URL、未校验字节、本地 override 或 checkout 工具。

产品或资产字节修复后，必须从对应通道的 Fresh setup 重新开始。任何已发布字节变化都需要新 identity、
新 SHA 和新的 downloaded-asset/Cloud evidence。

如果失败被证明发生在当前模板执行前或由外部保存的旧脚本造成，而且该脚本只读、未改变安装/workspace 状态，
已经完成的前序 Host 黑盒观测可以保留。修正后的新 invocation 只有在脚本语义与当前 checkout/template 一致、
原始输出完整且 exact source、installed bundle 与前序通道可绑定时，才算该步骤的 gate evidence；否则只算诊断。
无法证明这些条件或只读性时，仍从 Fresh setup 重跑整个通道。

## 3. 执行顺序

<a name="source-candidate-sequence"></a>

```text
Source/Candidate fresh environment
  -> 4.1 source setup
  -> new task: 5.1 B-SC
  -> 6 C -> 7 D -> 8.1 E1
  -> reopen same task: 8.2 E2
  -> 9.1 source deep check
  -> discard environment

Published Release fresh environment
  -> environment setup: 4.2 public bootstrap
  -> first task: 5.2 B-PR
  -> 6 C -> 7 D -> 8.1 E1
  -> reopen same task: 8.2 E2
  -> 9.2 public ZIP deep check
  -> discard environment
```

安装脚本内的 direct adapter probe 或 doctor 只证明静态安装链健康，不能替代 agent/task lifecycle 中自动
注入的黑盒证据。

## 4. 安装 setup

<a name="source-candidate-setup"></a>

### 4.1 Source/Candidate：source、双构建与本地 override

在 agent startup 完成并切到目标 checkout 后，作为第一条任务执行。下面脚本从 package/Release contract
派生版本、bootstrap 与 entry count。Cloud environment 必须在系统的 Environment variables（“环境变量”）
设置中，把预先选定的 Node major 通过 `PWF_ACCEPTANCE_NODE_MAJOR` 显式注入；不要只在 setup script 中
临时设置，因为 4.1 运行在后续 agent task。脚本不把某次 Cloud image 的 major 冻结成模板常量。

~~~bash
set -Eeuo pipefail

readonly REQUIRED_NODE_MAJOR="${PWF_ACCEPTANCE_NODE_MAJOR:-}"
readonly TARGET_CODEX_HOME="${CODEX_HOME:-/opt/codex}"
readonly PUBLICATION_ORACLE_SUITE="tests/published-release-oracles.test.js"

case "$REQUIRED_NODE_MAJOR" in
  ''|*[!0-9]*) printf 'Source/Candidate setup is blocked: PWF_ACCEPTANCE_NODE_MAJOR must be numeric\n' >&2; exit 64 ;;
esac

PROBE_DIR="$(mktemp -d)"
trap 'rm -rf -- "$PROBE_DIR"' EXIT

test -z "$(git status --short)"
readonly RUNBOOK_HEAD="$(git rev-parse HEAD)"
test "$(node -p 'process.versions.node.split(".")[0]')" = "$REQUIRED_NODE_MAJOR"
git diff --check

python3 tools/import_upstream_runtime.py check
python3 - <<'PY'
import hashlib
import json
from pathlib import Path

for value in (
    "hooks/hook_adapter.py",
    "runtime/owned-plan.py",
    "runtime/owned-catchup.py",
):
    path = Path(value)
    compile(path.read_text(encoding="utf-8"), str(path), "exec")

package = json.loads(Path("package.json").read_text(encoding="utf-8"))
manifest = json.loads(Path("upstream-manifest.json").read_text(encoding="utf-8"))
managed = manifest["managed_runtime"]
artifact_ref = managed["contracts"]["release_artifact"]
artifact = json.loads(Path(artifact_ref["path"]).read_text(encoding="utf-8"))

assert artifact["package_version"] == package["version"]
assert set(managed) == {"schema_version", "contracts", "importer", "license_provenance"}
assert managed["schema_version"] == 3
assert set(managed["contracts"]) == {
    "runtime_bundle",
    "release_artifact",
    "installed_state_transition",
}
for retired in ("package_root", "local_package_root", "local_files", "files"):
    assert retired not in managed

bundle_ref = managed["contracts"]["runtime_bundle"]
bundle_path = Path(bundle_ref["path"])
bundle_bytes = bundle_path.read_bytes()
assert hashlib.sha256(bundle_bytes).hexdigest() == bundle_ref["sha256"]
bundle = json.loads(bundle_bytes.decode("utf-8"))
assert bundle["contract_id"] == "PWF_MANAGED_RUNTIME_BUNDLE_V2"
assert bundle["schema_version"] == 2

admitted = {
    item["package_path"]
    for section in ("upstream_files", "local_files", "installed_contracts")
    for item in bundle[section]
}
for candidate in ("attest-plan.sh", "ledger-append.sh", "phase-status.sh"):
    assert not any(path.endswith("/" + candidate) for path in admitted)

print("MANIFEST_BUNDLE_AUTHORITY=PASS")
PY
node --check install.js

BOOTSTRAP="$(python3 - <<'PY'
import json
from pathlib import Path

manifest = json.loads(Path("upstream-manifest.json").read_text(encoding="utf-8"))
artifact_path = manifest["managed_runtime"]["contracts"]["release_artifact"]["path"]
artifact = json.loads(Path(artifact_path).read_text(encoding="utf-8"))
assets = artifact["external_release_assets"]
assert len(assets) == 1
print(assets[0])
PY
)"
test -f "$BOOTSTRAP"
bash -n "$BOOTSTRAP"

test -f "$PUBLICATION_ORACLE_SUITE"
mapfile -t TEST_FILES < <(
  find tests -maxdepth 1 -type f -name '*.test.js' ! -name 'published-release-oracles.test.js' -print | sort
)
test "${#TEST_FILES[@]}" -gt 0
TEST_OUTPUT="$PROBE_DIR/tests.tap"
node --test --test-reporter=tap "${TEST_FILES[@]}" | tee "$TEST_OUTPUT"
grep -Eq '^# fail 0$' "$TEST_OUTPUT"
grep -Eq '^# skipped 0$' "$TEST_OUTPUT"
TESTS="$(awk '/^# tests / {print $3}' "$TEST_OUTPUT" | tail -1)"
PASSES="$(awk '/^# pass / {print $3}' "$TEST_OUTPUT" | tail -1)"
test -n "$TESTS"
test "$PASSES" = "$TESTS"

ZIP_A="$PROBE_DIR/candidate-a.zip"
ZIP_B="$PROBE_DIR/candidate-b.zip"
python3 tools/build_release.py build --output "$ZIP_A"
python3 tools/build_release.py check --archive "$ZIP_A"
python3 tools/build_release.py build --output "$ZIP_B"
python3 tools/build_release.py check --archive "$ZIP_B"
cmp "$ZIP_A" "$ZIP_B"

EXPECTED_ENTRIES="$(python3 - <<'PY'
import json
from pathlib import Path

manifest = json.loads(Path("upstream-manifest.json").read_text(encoding="utf-8"))
artifact_path = manifest["managed_runtime"]["contracts"]["release_artifact"]["path"]
artifact = json.loads(Path(artifact_path).read_text(encoding="utf-8"))
print(len(artifact["entries"]))
PY
)"
test "$(unzip -Z1 "$ZIP_A" | wc -l)" -eq "$EXPECTED_ENTRIES"
if unzip -Z1 "$ZIP_A" | grep -Fq 'init-cloud-sandbox-'; then
  printf 'Bootstrap unexpectedly entered candidate ZIP\n' >&2
  exit 1
fi

ACTUAL_ZIP_SIZE="$(wc -c < "$ZIP_A")"
ACTUAL_ZIP_SHA256="$(sha256sum "$ZIP_A" | awk '{print $1}')"

unzip -q "$ZIP_A" -d "$PROBE_DIR/extracted"
PACKAGE_ROOT="$PROBE_DIR/extracted/pwf-codex-cloud-hooks"
python3 "$PACKAGE_ROOT/tools/build_release.py" check --archive "$ZIP_A"
python3 "$PACKAGE_ROOT/tools/import_upstream_runtime.py" check

if [ -e "$TARGET_CODEX_HOME/hooks/planning-with-files" ]; then
  printf 'Fresh setup required; managed runtime already exists: %s\n' "$TARGET_CODEX_HOME" >&2
  exit 1
fi

HOOKS_URL="file://$ZIP_A" HOOKS_SHA256="$ACTUAL_ZIP_SHA256" bash "$BOOTSTRAP" all

test -z "$(git status --short)"
printf 'PWF_SC_RUNBOOK_HEAD=%s\n' "$RUNBOOK_HEAD"
printf 'PWF_SC_LINUX_SUITE=PASS tests=%s pass=%s fail=0 skipped=0\n' "$TESTS" "$PASSES"
printf 'PWF_SC_ZIP_ENTRIES=%s\n' "$EXPECTED_ENTRIES"
printf 'PWF_SC_ZIP_SIZE=%s\n' "$ACTUAL_ZIP_SIZE"
printf 'PWF_SC_ZIP_SHA256=%s\n' "$ACTUAL_ZIP_SHA256"
printf 'PWF_SOURCE_CANDIDATE_SETUP=PASS\n'
~~~

安装发生在原始 startup 之后。脚本成功后创建新 task，从第 5.1 节开始验证 post-install Resume；不得在
安装 task 中手工调用 adapter 冒充 lifecycle evidence。

<a name="published-release-setup"></a>

### 4.2 Published Release：public bootstrap environment setup

将本节放进独立 Fresh Cloud 的 environment setup，使 Managed Hook 在 agent startup 前安装。实际执行时只
替换两项 immutable identity；bootstrap 校验后必须使用自身默认 ZIP URL/SHA，不设置 override。

~~~bash
set -Eeuo pipefail

readonly BOOTSTRAP_URL="__IMMUTABLE_BOOTSTRAP_URL__"
readonly BOOTSTRAP_SHA256="__IMMUTABLE_BOOTSTRAP_SHA256__"

case "$BOOTSTRAP_URL$BOOTSTRAP_SHA256" in
  *__*) printf 'Published setup is blocked: immutable bootstrap inputs are unresolved\n' >&2; exit 64 ;;
esac
case "$BOOTSTRAP_URL" in
  https://*) ;;
  *) printf 'Published setup requires an immutable HTTPS bootstrap URL\n' >&2; exit 64 ;;
esac
test "${#BOOTSTRAP_SHA256}" -eq 64
case "$BOOTSTRAP_SHA256" in
  *[!0-9a-f]*) printf 'Published setup requires a lowercase SHA-256\n' >&2; exit 64 ;;
esac

ACCEPT_DIR="$(mktemp -d)"
trap 'rm -rf -- "$ACCEPT_DIR"' EXIT
BOOTSTRAP="$ACCEPT_DIR/bootstrap.bash"

curl --fail --location --proto '=https' --tlsv1.2 --output "$BOOTSTRAP" "$BOOTSTRAP_URL"
printf '%s  %s\n' "$BOOTSTRAP_SHA256" "$BOOTSTRAP" | sha256sum --check --strict
bash -n "$BOOTSTRAP"
bash "$BOOTSTRAP" all

printf 'PWF_PUBLIC_BOOTSTRAP_SHA256=%s\n' "$BOOTSTRAP_SHA256"
printf 'PWF_PUBLIC_RELEASE_SETUP=PASS\n'
~~~

setup 成功后的首个 agent task 从第 5.2 节开始。Published Release 的 B～F 不能复用 Source/Candidate 输出。

## 5. B：按安装时序分流 SessionStart

<a name="blackbox-post-install-resume"></a>

### 5.1 B-SC：post-install Resume

第 4.1 节完成后创建新 task，原样发送：

~~~text
这是 planning-with-files post-install Resume lifecycle 黑盒验证。

严格限制：不要调用工具、运行 Shell、读取文件、自行执行任何 Hook/runtime，也不要根据本提示或仓库文档构造结果；只报告生成本次回复之前 Runtime 已自动注入的内容。

请逐字列出实际看到的所有以 PWF_GLOBAL_HOOK_CANARY_V1 开头的完整行。

然后严格汇总：
SessionStart: OBSERVED 或 NOT_OBSERVED
SessionStart source: 实际值；未观察到则写 NONE
UserPromptSubmit: OBSERVED 或 NOT_OBSERVED
Planning context（辅助观察）: OBSERVED 或 NOT_OBSERVED
===BEGIN PLAN DATA===（辅助观察）: OBSERVED 或 NOT_OBSERVED
=== recent progress ===（辅助观察）: OBSERVED 或 NOT_OBSERVED

没有实际看到的项必须写 NOT_OBSERVED。不要使用工具补救验证。
~~~

SessionStart 与 UserPromptSubmit 必须被观察到，SessionStart source 必须是真实 Resume source而不是 startup；
planning 三项只作辅助观察。没有产生新 SessionStart 时，本步不成立。

<a name="blackbox-fresh-startup"></a>

### 5.2 B-PR：Fresh startup

第 4.2 节已在 environment setup 中完成后，首个 agent task 原样发送：

~~~text
这是 planning-with-files Fresh startup lifecycle 黑盒验证。

严格限制：不要调用工具、运行 Shell、读取文件、自行执行任何 Hook/runtime，也不要根据本提示或仓库文档构造结果；只报告生成本次回复之前 Runtime 已自动注入的内容。

请逐字列出实际看到的所有以 PWF_GLOBAL_HOOK_CANARY_V1 开头的完整行。

然后严格汇总：
SessionStart: OBSERVED 或 NOT_OBSERVED
SessionStart source: 实际值；未观察到则写 NONE
UserPromptSubmit: OBSERVED 或 NOT_OBSERVED
Planning context（辅助观察）: OBSERVED 或 NOT_OBSERVED
===BEGIN PLAN DATA===（辅助观察）: OBSERVED 或 NOT_OBSERVED
=== recent progress ===（辅助观察）: OBSERVED 或 NOT_OBSERVED

没有实际看到的项必须写 NOT_OBSERVED。不要使用工具补救验证。
~~~

SessionStart 与 UserPromptSubmit 必须被观察到，SessionStart source 必须为 startup；planning 三项只作
辅助观察。

<a name="blackbox-canonical-baseline"></a>

## 6. C：创建 canonical planning baseline

在当前通道的 B 完成后，于同一 task 原样发送：

~~~text
这是 planning-with-files canonical planning baseline 创建步骤。

请使用 apply_patch：
1. 为本轮生成一个新的 plan ID，格式必须是 YYYY-MM-DD-pwf-cloud-acceptance-v1-xxxxxxxx，其中日期使用当前 UTC 日期，xxxxxxxx 是本轮新生成的 8 位小写十六进制 run ID。以下用 PLAN_ID 表示这个具体值。只能用 apply_patch 的 Add File 创建新文件；如果目标目录或任一目标文件已经存在，立即停止并报告冲突，不得覆盖、删除或改用 Update File。
2. 创建 .planning/PLAN_ID/task_plan.md，内容必须按顺序包含：
   # PWF_CLOUD_ACCEPTANCE_CANONICAL_V1
   ## Phases
   ### Phase 1
   **Status:** complete
   PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_COMPLETED_V1
   ### Phase 2
   **Status:** in_progress
   PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_ACTIVE_V1
3. 创建同目录 progress.md，内容必须包含：
   PWF Cloud acceptance baseline created by apply_patch.
4. 创建同目录 findings.md，内容必须包含：
   planning-with-files Cloud acceptance fixture.
5. 不要创建或修改任何 .pwf-codex-managed、.mode 或其他 activation/profile 文件。
6. 只允许更新 .planning/.active_plan，使其内容为本轮具体 PLAN_ID。不要修改任何其他仓库文件，不要 commit、push 或创建 PR。
7. 完成后只回复一行，并把占位符替换为本轮具体值：
   PWF_CLOUD_ACCEPTANCE_BASELINE_CREATED plan_id=PLAN_ID
~~~

必须实际产生 structured planning update，并收到精确 acknowledgment。这个 fixture 故意保持 markerless：completed
与 active 两个 sentinel 在后续同时出现，才证明默认 profile 仍是 legacy；若只出现 active sentinel，必须按 profile
漂移停止，不能把它解释为更聪明的等价输出。日期前缀与 upstream slug-mode 习惯一致，8 位 run ID 才负责避免
同一天循环验收发生目录碰撞；production resolver 仍兼容合法的无日期历史 plan ID。

<a name="blackbox-canonical-context"></a>

## 7. D：canonical UserPromptSubmit

C 完成后立即原样发送：

~~~text
这是 planning-with-files canonical Planning context 自动注入验证。

严格限制：不要调用工具、运行 Shell、读取文件或根据本提示/仓库文档构造标记；只报告生成本次回复之前 Runtime 已自动注入的内容。

请严格汇总：
UserPromptSubmit canary: OBSERVED 或 NOT_OBSERVED
PWF_CLOUD_ACCEPTANCE_CANONICAL_V1: OBSERVED 或 NOT_OBSERVED
PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_COMPLETED_V1: OBSERVED 或 NOT_OBSERVED
PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_ACTIVE_V1: OBSERVED 或 NOT_OBSERVED
[planning-with-files] ACTIVE PLAN: OBSERVED 或 NOT_OBSERVED
===BEGIN PLAN DATA===: OBSERVED 或 NOT_OBSERVED
=== recent progress ===: OBSERVED 或 NOT_OBSERVED
Planning context: OBSERVED 或 NOT_OBSERVED

没有实际看到的项必须写 NOT_OBSERVED。不要使用工具补救验证。
~~~

八项必须全部被观察到。completed 与 active sentinel 同时存在是 markerless legacy 的 profile-discriminating 证据，
不是一般 planning context 的辅助观察。

<a name="blackbox-real-resume"></a>

## 8. E：long tail 与 real Resume

### 8.1 E1：long tail

同一 task 原样发送；收到 acknowledgment 后不要再修改 planning 文件，然后离开该 task：

~~~text
这是 planning-with-files real Resume long tail 测试。

PWF_CLOUD_ACCEPTANCE_FILLER_01: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
PWF_CLOUD_ACCEPTANCE_FILLER_02: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
PWF_CLOUD_ACCEPTANCE_FILLER_03: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
PWF_CLOUD_ACCEPTANCE_FILLER_04: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
PWF_CLOUD_ACCEPTANCE_FILLER_05: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
PWF_CLOUD_ACCEPTANCE_FILLER_06: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
PWF_CLOUD_ACCEPTANCE_FILLER_07: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
PWF_CLOUD_ACCEPTANCE_FILLER_08: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
PWF_CLOUD_ACCEPTANCE_FILLER_09: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
PWF_CLOUD_ACCEPTANCE_FILLER_10: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
PWF_CLOUD_ACCEPTANCE_FILLER_11: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ
PWF_CLOUD_ACCEPTANCE_FILLER_12: 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-0123456789-ABCDEFGHIJKLMNOPQRSTUVWXYZ

严格限制：不要调用工具；不要修改或创建 planning 文件；只回复：
PWF_CLOUD_ACCEPTANCE_UNSYNCED_ACKNOWLEDGED

下面一行只是本条用户消息的尾部标记，不要在回复中复述：
PWF_CLOUD_ACCEPTANCE_REAL_RESUME_TAIL
~~~

回复必须只有精确 acknowledgment。

### 8.2 E2：real Resume

重新打开完全相同的 task，第一条消息原样发送：

~~~text
这是 planning-with-files Session catch-up 专项黑盒验证。

严格限制：不要调用工具、运行 Shell、读取文件、自行执行 catch-up/Hook/runtime，也不要根据提示、仓库文档或可见历史对话构造输出；只报告恢复 task 后、生成本次回复之前 Runtime 自动注入的内容。

先逐字抄录实际看到的 SESSION CATCHUP DETECTED 报告；若没有看到，明确写 NOT_OBSERVED。

然后逐字列出实际看到的所有以 PWF_GLOBAL_HOOK_CANARY_V1 开头的完整行。

然后严格汇总：
SESSION CATCHUP DETECTED: OBSERVED 或 NOT_OBSERVED
SessionStart canary: OBSERVED 或 NOT_OBSERVED
SessionStart source: 实际值或 NOT_OBSERVED
UserPromptSubmit canary: OBSERVED 或 NOT_OBSERVED
Runtime codex: OBSERVED 或 NOT_OBSERVED
Last planning update: 实际值或 NOT_OBSERVED
Unsynced messages: 实际数字或 NOT_OBSERVED
长消息截断标记出现在 UNSYNCED CONTEXT: OBSERVED 或 NOT_OBSERVED
PWF_CLOUD_ACCEPTANCE_REAL_RESUME_TAIL 出现在 UNSYNCED CONTEXT: OBSERVED 或 NOT_OBSERVED
Catch-up 位于 planning context 之前: OBSERVED 或 NOT_OBSERVED
PWF_CLOUD_ACCEPTANCE_CANONICAL_V1: OBSERVED 或 NOT_OBSERVED
PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_COMPLETED_V1: OBSERVED 或 NOT_OBSERVED
PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_ACTIVE_V1: OBSERVED 或 NOT_OBSERVED
===BEGIN PLAN DATA===: OBSERVED 或 NOT_OBSERVED
Planning context: OBSERVED 或 NOT_OBSERVED

没有实际看到的项必须写 NOT_OBSERVED。不要使用工具补救验证。
~~~

所有汇总项必须被观察到；两个 markerless legacy sentinel 必须再次同时出现。Unsynced messages 数字不预设，
SessionStart source 必须是真实 Resume source且
不能为 startup。黑盒只证明 observable behavior；helper closure、immutable bytes、overlay absence 与不调用
upstream CLI `main()` 由 source/inventory assertions 和 portable negative suite证明。

## 9. Post-resume doctor、inventory、policy 与 residue

<a name="source-candidate-deep-check"></a>

### 9.1 Source/Candidate

E2 完成后，只在 Source/Candidate 的精确 checkout 运行。必须从当前 checkout 的本节重新取得脚本，不得复用以前
保存的 `/tmp/post-resume.sh`、聊天片段或旧版本 acceptance 副本。只执行并报告；任何失败都不得自动修改、commit
或创建 PR：

~~~bash
set -Eeuo pipefail

PACKAGE_ROOT="$(git rev-parse --show-toplevel)"
RUNBOOK_HEAD="$(git rev-parse HEAD)"
TARGET_CODEX_HOME="${CODEX_HOME:-/opt/codex}"
SKILL_ROOT="$HOME/.agents/skills/planning-with-files"
REQUIREMENTS="/etc/codex/requirements.toml"

NON_PLANNING_CHANGES="$(git status --porcelain=v1 --untracked-files=all | grep -Ev '^.. \.planning/' || true)"
test -z "$NON_PLANNING_CHANGES"
printf 'PWF_WORKTREE_CHANGES=PLANNING_ONLY\n'

DOCTOR_JSON="$(node "$PACKAGE_ROOT/install.js" doctor --json \
  --codex-home "$TARGET_CODEX_HOME" \
  --skill-root "$SKILL_ROOT" \
  --managed-requirements "$REQUIREMENTS")"
printf '%s\n' "$DOCTOR_JSON"

python3 - "$DOCTOR_JSON" "$PACKAGE_ROOT" "$TARGET_CODEX_HOME" "$SKILL_ROOT" "$REQUIREMENTS" <<'PY'
import hashlib
import json
import pathlib
import sys
import tomllib

doctor = json.loads(sys.argv[1])
package_root = pathlib.Path(sys.argv[2])
codex_home = pathlib.Path(sys.argv[3])
skill_root = pathlib.Path(sys.argv[4])
requirements_path = pathlib.Path(sys.argv[5])

package = json.loads((package_root / "package.json").read_text(encoding="utf-8"))
upstream_manifest = json.loads((package_root / "upstream-manifest.json").read_text(encoding="utf-8"))
contracts = upstream_manifest["managed_runtime"]["contracts"]
artifact_path = contracts["release_artifact"]["path"]
bundle_path = contracts["runtime_bundle"]["path"]
artifact = json.loads((package_root / artifact_path).read_text(encoding="utf-8"))
bundle = json.loads((package_root / bundle_path).read_text(encoding="utf-8"))

assert artifact["package_version"] == package["version"]
assert artifact["entries"]
assert artifact["schema_version"] == 2
assert bundle["schema_version"] == 2
assert bundle["upstream_files"]
assert doctor["healthy"] is True
assert doctor["repairable"] is False
assert doctor["managed"] is True
assert doctor["events"] == ["SessionStart", "UserPromptSubmit"]
assert doctor["errors"] == []
assert doctor["blockers"] == []

installed_root = pathlib.PurePosixPath(bundle["roots"]["installed"])
assert not installed_root.is_absolute()
assert ".." not in installed_root.parts
runtime = codex_home / pathlib.Path(*installed_root.parts)
installed = json.loads((runtime / "installed-manifest.json").read_text(encoding="utf-8"))
installed_snapshot = sorted(item["path"] for item in installed["runtime_files"])
actual = sorted(
    str(path.relative_to(runtime)).replace("\\", "/")
    for path in runtime.rglob("*")
    if path.is_file() and path.name != "installed-manifest.json"
)

bundle_authority = ["THIRD_PARTY_NOTICES.md"]
for section in ("upstream_files", "local_files", "installed_contracts"):
    for item in bundle[section]:
        relative = pathlib.PurePosixPath(item["installed_path"]).relative_to(installed_root)
        bundle_authority.append(relative.as_posix())
bundle_authority = sorted(bundle_authority)

assert len(bundle_authority) == len(set(bundle_authority))
assert installed["installer_version"] == package["version"]
assert installed_snapshot == bundle_authority
assert actual == bundle_authority
assert not any("compatibility" in item or item.startswith("patches/") for item in actual)

def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

for section in ("upstream_files", "local_files", "installed_contracts"):
    hash_key = "pristine_sha256" if section == "upstream_files" else "sha256"
    for item in bundle[section]:
        relative = pathlib.PurePosixPath(item["installed_path"]).relative_to(installed_root)
        assert sha256(runtime / pathlib.Path(*relative.parts)) == item[hash_key]

owned_catchup = next(item for item in bundle["local_files"] if item["id"] == "owned_catchup")
assert owned_catchup["direct_dependencies"][0]["allowed_symbols"] == [
    "extract_messages_after",
    "find_last_planning_update",
    "same_project_path",
    "text_content",
]

for relative, expected_hash in upstream_manifest["required_skill_files"].items():
    path = skill_root / pathlib.Path(*pathlib.PurePosixPath(relative).parts)
    assert sha256(path) == expected_hash

policy = tomllib.loads(requirements_path.read_text(encoding="utf-8"))
for event in ("SessionStart", "UserPromptSubmit"):
    groups = policy["hooks"][event]
    assert len(groups) == 1
    handlers = groups[0]["hooks"]
    assert len(handlers) == 1
    command = handlers[0]["command"]
    assert "hook_adapter.py" in command
    assert "owned-plan.py" not in command
    assert "owned-catchup.py" not in command
    assert "session-catchup.py" not in command

print("POST_RESUME_DOCTOR=PASS")
print("PWF_DEEP_CHECK_MANIFEST_SCHEMA=" + str(upstream_manifest["schema_version"]))
print("PWF_DEEP_CHECK_RELEASE_CONTRACT_PATH=" + artifact_path)
print("PWF_DEEP_CHECK_RELEASE_CONTRACT_ID=" + artifact["contract_id"])
print("PWF_DEEP_CHECK_RELEASE_SCHEMA=" + str(artifact["schema_version"]))
print("PWF_DEEP_CHECK_BUNDLE_CONTRACT_PATH=" + bundle_path)
print("PWF_DEEP_CHECK_BUNDLE_CONTRACT_ID=" + bundle["contract_id"])
print("PWF_DEEP_CHECK_BUNDLE_SCHEMA=" + str(bundle["schema_version"]))
print("PWF_DEEP_CHECK_INSTALLED_ROOT=" + bundle["roots"]["installed"])
print("INSTALLER_VERSION=" + package["version"])
print("RELEASE_ARTIFACT_ENTRIES=" + str(len(artifact["entries"])))
print("INSTALLED_RUNTIME_FILES=" + str(len(actual)))
print("UPSTREAM_PRISTINE_FILES=" + str(len(bundle["upstream_files"])))
print("BUNDLE_INSTALLED_INVENTORY=AUTHORITATIVE")
print("MANAGED_POLICY=ADAPTER_ONLY")
print("INSTALLED_RUNTIME_INVENTORY=" + json.dumps(actual, ensure_ascii=False))
PY

test "$RUNBOOK_HEAD" = "$(git rev-parse HEAD)"
printf 'PWF_DEEP_CHECK_HEAD=%s\n' "$RUNBOOK_HEAD"

SNAPSHOT_BASE="${TMPDIR:-/tmp}/pwf-codex-cloud-hooks/snapshots"
LEFTOVERS=0
if [ -d "$SNAPSHOT_BASE" ]; then
  LEFTOVERS="$(find "$SNAPSHOT_BASE" -mindepth 1 -maxdepth 1 -type d -name 'pwf-snapshot-*' | wc -l)"
fi
test "$LEFTOVERS" -eq 0
printf 'SNAPSHOT_LEFTOVERS=0\n'
printf 'PWF_SC_POST_RESUME=PASS\n'
~~~

<a name="published-release-deep-check"></a>

### 9.2 Published Release

public bootstrap 的临时目录可能已经删除。本节重新取得同一 immutable ZIP，校验后只使用 ZIP 内
builder/importer/installer 复验 installed state；实际执行时只替换 URL/SHA 两项 identity。

~~~bash
set -Eeuo pipefail

readonly ZIP_URL="__IMMUTABLE_ZIP_URL__"
readonly ZIP_SHA256="__IMMUTABLE_ZIP_SHA256__"

case "$ZIP_URL$ZIP_SHA256" in
  *__*) printf 'Published deep check is blocked: immutable ZIP inputs are unresolved\n' >&2; exit 64 ;;
esac
case "$ZIP_URL" in
  https://*) ;;
  *) printf 'Published deep check requires an immutable HTTPS ZIP URL\n' >&2; exit 64 ;;
esac
test "${#ZIP_SHA256}" -eq 64
case "$ZIP_SHA256" in
  *[!0-9a-f]*) printf 'Published deep check requires a lowercase SHA-256\n' >&2; exit 64 ;;
esac

VERIFY_DIR="$(mktemp -d)"
trap 'rm -rf -- "$VERIFY_DIR"' EXIT
ZIP="$VERIFY_DIR/release.zip"
EXTRACT_DIR="$VERIFY_DIR/extracted"
PACKAGE_ROOT="$EXTRACT_DIR/pwf-codex-cloud-hooks"

curl --fail --location --proto '=https' --tlsv1.2 --output "$ZIP" "$ZIP_URL"
printf '%s  %s\n' "$ZIP_SHA256" "$ZIP" | sha256sum --check --strict

mkdir -p "$EXTRACT_DIR"
unzip -q "$ZIP" -d "$EXTRACT_DIR"
test -f "$PACKAGE_ROOT/install.js"
test -f "$PACKAGE_ROOT/tools/build_release.py"
test -f "$PACKAGE_ROOT/tools/import_upstream_runtime.py"

python3 "$PACKAGE_ROOT/tools/build_release.py" check --archive "$ZIP"
python3 "$PACKAGE_ROOT/tools/import_upstream_runtime.py" check

PACKAGE_VERSION="$(node -p "require('$PACKAGE_ROOT/package.json').version")"
DOCTOR_JSON="$(node "$PACKAGE_ROOT/install.js" doctor --json \
  --codex-home /opt/codex \
  --skill-root "$HOME/.agents/skills/planning-with-files" \
  --managed-requirements /etc/codex/requirements.toml)"
printf '%s\n' "$DOCTOR_JSON"

python3 - "$DOCTOR_JSON" "$PACKAGE_ROOT" "$PACKAGE_VERSION" <<'PY'
import hashlib
import json
import pathlib
import sys
import tomllib

doctor = json.loads(sys.argv[1])
package_root = pathlib.Path(sys.argv[2])
package_version = sys.argv[3]
package = json.loads((package_root / "package.json").read_text(encoding="utf-8"))
upstream_manifest = json.loads((package_root / "upstream-manifest.json").read_text(encoding="utf-8"))
contracts = upstream_manifest["managed_runtime"]["contracts"]
artifact = json.loads((package_root / contracts["release_artifact"]["path"]).read_text(encoding="utf-8"))
bundle = json.loads((package_root / contracts["runtime_bundle"]["path"]).read_text(encoding="utf-8"))

assert package["version"] == package_version
assert artifact["package_version"] == package_version
assert artifact["entries"]
assert artifact["schema_version"] == 2
assert bundle["schema_version"] == 2
assert bundle["upstream_files"]

assert doctor["healthy"] is True
assert doctor["repairable"] is False
assert doctor["managed"] is True
assert doctor["events"] == ["SessionStart", "UserPromptSubmit"]
assert doctor["errors"] == []
assert doctor["blockers"] == []

installed_root = pathlib.PurePosixPath(bundle["roots"]["installed"])
assert not installed_root.is_absolute()
assert ".." not in installed_root.parts
runtime = pathlib.Path("/opt/codex") / pathlib.Path(*installed_root.parts)
manifest = json.loads((runtime / "installed-manifest.json").read_text(encoding="utf-8"))
expected = sorted(item["path"] for item in manifest["runtime_files"])
actual = sorted(
    str(path.relative_to(runtime)).replace("\\", "/")
    for path in runtime.rglob("*")
    if path.is_file() and path.name != "installed-manifest.json"
)
assert manifest["installer_version"] == package_version
assert expected == actual
assert not any("compatibility" in item or item.startswith("patches/") for item in actual)

bundle_authority = ["THIRD_PARTY_NOTICES.md"]
for section in ("upstream_files", "local_files", "installed_contracts"):
    for item in bundle[section]:
        relative = pathlib.PurePosixPath(item["installed_path"]).relative_to(installed_root)
        bundle_authority.append(relative.as_posix())
bundle_authority = sorted(bundle_authority)
assert len(bundle_authority) == len(set(bundle_authority))
assert expected == bundle_authority

def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

for section in ("upstream_files", "local_files", "installed_contracts"):
    hash_key = "pristine_sha256" if section == "upstream_files" else "sha256"
    for item in bundle[section]:
        relative = pathlib.PurePosixPath(item["installed_path"]).relative_to(installed_root)
        assert sha256(runtime / pathlib.Path(*relative.parts)) == item[hash_key]

policy = tomllib.loads(pathlib.Path("/etc/codex/requirements.toml").read_text(encoding="utf-8"))
for event in ("SessionStart", "UserPromptSubmit"):
    groups = policy["hooks"][event]
    assert len(groups) == 1
    handlers = groups[0]["hooks"]
    assert len(handlers) == 1
    command = handlers[0]["command"]
    assert "hook_adapter.py" in command
    assert "owned-plan.py" not in command
    assert "owned-catchup.py" not in command
    assert "session-catchup.py" not in command

print("PUBLIC_PACKAGE_IDENTITY=" + package_version)
print("POST_RESUME_DOCTOR=PASS")
print("PWF_DEEP_CHECK_MANIFEST_SCHEMA=" + str(upstream_manifest["schema_version"]))
print("PWF_DEEP_CHECK_RELEASE_CONTRACT_PATH=" + contracts["release_artifact"]["path"])
print("PWF_DEEP_CHECK_RELEASE_CONTRACT_ID=" + artifact["contract_id"])
print("PWF_DEEP_CHECK_RELEASE_SCHEMA=" + str(artifact["schema_version"]))
print("PWF_DEEP_CHECK_BUNDLE_CONTRACT_PATH=" + contracts["runtime_bundle"]["path"])
print("PWF_DEEP_CHECK_BUNDLE_CONTRACT_ID=" + bundle["contract_id"])
print("PWF_DEEP_CHECK_BUNDLE_SCHEMA=" + str(bundle["schema_version"]))
print("PWF_DEEP_CHECK_INSTALLED_ROOT=" + bundle["roots"]["installed"])
print("RELEASE_ARTIFACT_ENTRIES=" + str(len(artifact["entries"])))
print("INSTALLED_RUNTIME_FILES=" + str(len(actual)))
print("UPSTREAM_PRISTINE_FILES=" + str(len(bundle["upstream_files"])))
print("BUNDLE_INSTALLED_INVENTORY=AUTHORITATIVE")
print("MANAGED_POLICY=ADAPTER_ONLY")
print("INSTALLED_RUNTIME_INVENTORY=" + json.dumps(actual, ensure_ascii=False))
PY

SNAPSHOT_BASE="${TMPDIR:-/tmp}/pwf-codex-cloud-hooks/snapshots"
LEFTOVERS=0
if [ -d "$SNAPSHOT_BASE" ]; then
  LEFTOVERS="$(find "$SNAPSHOT_BASE" -mindepth 1 -maxdepth 1 -type d -name 'pwf-snapshot-*' | wc -l)"
fi
test "$LEFTOVERS" -eq 0
printf 'PWF_PUBLIC_ZIP_REDOWNLOAD_SHA256=%s\n' "$ZIP_SHA256"
printf 'PWF_PUBLIC_ZIP_BOUNDARY_IMPORTER=PASS\n'
printf 'SNAPSHOT_LEFTOVERS=0\n'
printf 'PWF_PUBLIC_POST_RESUME=PASS\n'
~~~

<a name="acceptance-evidence-writeback"></a>

## 10. 版本 acceptance 的证据写回

模板不保存运行结果。版本专项 acceptance 应保存以下原始证据，并在证据闭合后由维护者写入版本结论：

- Source/Candidate：完整 commit、branch transport、测试 runner 原始摘要、明确排除的 publication suite、
  两次 ZIP build/check、entry count、size、SHA 与 override 安装输出；
- Published Release：exact tag/source、bootstrap 与 ZIP 的 immutable URL、filename、size、SHA，以及公开
  重新下载输出；
- 两条通道各自的 B～E 原始提示词、模型原始回复、SessionStart source、markerless legacy completed/active
  sentinel、Unsynced messages 和顺序观察；
- 两条通道各自的 doctor JSON、installed inventory、upstream/helper、adapter-only policy 与 residue 输出；
- publication oracle、失败的首次输出、停止点，以及是否从 Fresh 环境重新开始；
- GitHub Latest、rollback baseline 或下一 Product Phase 的授权应另行记录，不能由 Cloud 结果自动推导。

多 gate 版本专项文件可以维护粗粒度 gate 状态表；未完成 gate 只能写 current/pending 与模板入口，不能预建 exact
evidence 表或填写 source/asset identity。任何版本号、测试计数、资产 identity 或动态状态都不得反向写回本模板。

## 11. 模板的非权威边界

- 本模板不证明任何 commit、tag、Release、Cloud run 或 rollback 角色已经成立；
- 本模板不进入 Release ZIP、installed runtime、Managed policy 或 trusted execution graph；
- machine contracts 和源码优先于模板中的实现断言；架构变化时先进入 Discovery，再更新模板；
- 已发布的版本 acceptance 保留其时间语义，不因模板改进而批量重写；
- 当前 programme 与角色只读 ROADMAP，当前授权与停止条件只读活动 task plan。
