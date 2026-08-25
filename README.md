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

### 显式 smart / autonomous opt-in

默认仍是 legacy。只有当前 resolved plan directory 同时存在以下 exact state，owned runtime 才选择 pristine smart
renderer：

```text
.mode                 = inject-smart\n
.pwf-codex-managed    = codex-managed-v1\n
```

`.pwf-codex-managed` 必须最后通过同目录临时文件与原子 rename 写入；它是非秘密的 product activation commit point，
不是账户凭据。managed Hook/runtime 只读这两个文件，不负责创建或修复。删除 `.pwf-codex-managed` 即 disarm；残留
`.mode` 会立即恢复为 inert，下一次 Hook 使用 legacy。activation 存在但 mode 缺失、损坏、future-only 或执行中发生
替换时 fail closed，只保留 canary，不降级 legacy。

Linux/Cloud 中可在独立终端按下面的最小顺序启用；先把 `PLAN_DIR` 换成已经人工核对的 exact plan directory：

```bash
PLAN_DIR=/absolute/project/.planning/plan-id
test -d "$PLAN_DIR" || exit 1

mode_tmp="$(mktemp "$PLAN_DIR/.mode.tmp.XXXXXX")" || exit 1
activation_tmp="$(mktemp "$PLAN_DIR/.pwf-codex-managed.tmp.XXXXXX")" || exit 1
trap 'rm -f -- "$mode_tmp" "$activation_tmp"' EXIT
printf 'inject-smart\n' >"$mode_tmp"
printf 'codex-managed-v1\n' >"$activation_tmp"
chmod 644 "$mode_tmp" "$activation_tmp"
mv -- "$mode_tmp" "$PLAN_DIR/.mode"
mv -- "$activation_tmp" "$PLAN_DIR/.pwf-codex-managed"  # commit point，必须最后写
trap - EXIT
```

退出 smart 只删除 commit point：

```bash
rm -- "$PLAN_DIR/.pwf-codex-managed"
```

用户侧写入后，可把 installed `owned-plan.py` 的 exact-v2 request 通过 stdin 送入并检查 JSON result；只有
`outcome=context_emitted`、`effective_profile=smart`、`advisory=null` 才表示该 plan 已被 production admission
确认。这个只读 probe 复用 production parser，不需要第二个 status 工具。`OWNED_PLAN`、`PROJECT_ROOT` 与 `PLAN_ID`
必须替换为当前安装和计划的 exact 值：

```bash
OWNED_PLAN=/opt/codex/hooks/planning-with-files/owned-plan.py
PROJECT_ROOT=/absolute/project
PLAN_ID=plan-id
python3 - "$PROJECT_ROOT" "$PLAN_ID" <<'PY' | "$OWNED_PLAN"
import json, sys
print(json.dumps({
    "schema_version": 2,
    "runtime": "codex",
    "event": {"name": "UserPromptSubmit", "source": None, "session_id": None, "turn_id": None},
    "project": {"root": sys.argv[1], "plan_id": sys.argv[2]},
    "policy": {"planning_enabled": True, "allowed_profiles": ["legacy", "smart", "autonomous"], "opt_in_protocol": "codex-managed-v1"},
    "output_budget": {"max_context_chars": 20000, "max_plan_lines": 50, "max_progress_lines": 20},
}))
PY
```

Autonomous 使用独立的 profile-bound commit point，旧 smart token 不能因 `.mode` 改变而自动扩权。scoped plan 的
exact state 是：

```text
.mode                 = autonomous\n
.nonce                = 16 个 lowercase hex + \n
.attestation          = task_plan.md 当前字节的 lowercase SHA-256 + \n
.pwf-codex-managed    = codex-managed-v1 autonomous\n
ledger-<agent>.jsonl  = 可选；零个 ledger 也是合法状态
```

legacy-root plan 使用 `.plan-attestation` 代替 `.attestation`。activation 必须在 mode、nonce、attestation 和 ledger
准备完成后最后原子写入。owned runtime 每次重新计算 task digest，严格验证 bounded JSONL，再只把 ledger 的 `tick` 和
`event` 投影到 0700/0600 private snapshot；raw summary、files、timestamp 和 `progress.md` 都不会进入 autonomous
renderer。状态缺失、错配、超预算、链接、执行中变化或 `gate` token 一律不注入且不回退 legacy。删除 activation file
即可 disarm，managed runtime 不创建或修复这些 workspace 文件。

任何 activation 命令、文件或 probe 输出都不要放 secret、身份或授权码。activation 文件、consumer 代码或本地
probe 只能证明状态格式与 production admission，不能单独证明某个版本已完成 Cloud lifecycle 或 Release 验收；
programme 状态见 [`ROADMAP.md`](ROADMAP.md)，逐版本结论见对应版本专项 acceptance。

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

install、repair 与 uninstall 都会在备份或写删前检查 installer-owned `hooks/planning-with-files` 路径拓扑；
若 `hooks`、runtime root 或其内部 entry 是 symlink、Windows junction、非预期文件类型或其他 special path，
操作会以 `BLOCKED_UNSAFE_RUNTIME_PATH` 拒绝。显式 uninstall 仍允许 unknown 普通文件/目录先完整备份再清理。

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

如果你第一次接触本仓库的Release流程，先记住三个词：

- `C0`：准备送入第一通道验证的候选源码exact source commit；通过后，正式tag仍精确指向它。
- `Source/Candidate`：第一条Cloud验收通道，用独立环境验证C0的源码checkout和由它构建的候选ZIP。
- `Release-excluded`：不进入Release ZIP的治理或施工文件；只改这类文件不会改变用户下载的package字节。

完整四步、C0/C1/C2和停止点见[`ROADMAP` Release流程](ROADMAP.md#release-four-step-flow)。`README.md`不属于
Release-excluded：它本身也是Release ZIP输入，修改本节就会改变候选ZIP。因此应在冻结C0、执行Source/Candidate前完成这类
修改；如果已经取得Source/Candidate PASS，就必须作废原证据、形成新C0并重跑第一通道，不能因为“只改文档”而沿用旧PASS。

PowerShell：

```powershell
python tools/build_release.py build --output ./dist/pwf-codex-cloud-hooks-candidate.zip
python tools/build_release.py check --archive ./dist/pwf-codex-cloud-hooks-candidate.zip
Get-FileHash -Algorithm SHA256 ./dist/pwf-codex-cloud-hooks-candidate.zip
```

Bash：

```bash
ZIP="$(mktemp --suffix=.zip)"
python3 tools/build_release.py build --output "$ZIP"
python3 tools/build_release.py check --archive "$ZIP"
sha256sum "$ZIP"
```

后面的命令会涉及三个看起来相似、实际职责完全不同的本地对象。先分清它们，才不容易上传错文件：

| 对象 | 什么时候产生 | 大白话用途 | 是否作为正式资产上传 |
|---|---|---|---|
| `dist/pwf-codex-cloud-hooks-candidate.zip` | C0前的本地开发预检 | 方便本地提前build/check/hash；可以随时重建，不是Cloud证据 | 否；不要把`candidate.zip`改名上传 |
| 根目录`init-cloud-sandbox-vX.Y.Z[-dev].bash` | 版本改号或bootstrap模板变化后、C0前 | 当前checkout的Release contract唯一点名的tracked候选源码输入；默认ZIP SHA是64位zero，故会fail closed，不能冒充正式下载脚本 | 否；它随源码进入Source/Candidate验证 |
| `dist/pwf-codex-cloud-hooks-vX.Y.Z.zip`与`dist/init-cloud-sandbox-vX.Y.Z.bash` | Source/Candidate实际PASS后 | 重新构建、核对Cloud SHA并生成的正式双资产 | 是；这两项才上传同一GitHub Release |

本地`candidate.zip`只是可选的早期预检产物。后面的Release生成器不读取它，也不会把它重命名成正式ZIP；即使本地从未生成过
`candidate.zip`，只要Source/Candidate已经给出exact SHA，仍可正常生成正式双资产。

### C0前：生成并核对当前checkout的candidate bootstrap

版本列车在C0前若修改了bootstrap正文、canonical模板或version identity，先运行：

```powershell
python tools/materialize_release_assets.py candidate-bootstrap --write
python tools/materialize_release_assets.py candidate-bootstrap
```

第一条带`--write`，会真正写文件：生成器读取当前`package.json`、Release contract、external asset文件名和唯一bootstrap模板，
然后创建或重写根目录对应版本的bootstrap。开发身份使用当前版本号和64位zero ZIP SHA；例如开发身份是`X.Y.Z-dev`，目标就是
`init-cloud-sandbox-vX.Y.Z-dev.bash`。它适用于新开版本列车、版本改号、模板变化、乱码修复或C0前重新物化候选脚本。

第二条不带`--write`，只检查、不修改：它重新计算“当前模板 + 当前版本 + zero SHA”应该得到的完整字节，再与根目录bootstrap
逐字节比较。相同就输出`state=unchanged`；缺失、内容漂移或路径不安全就报错，不会偷偷修复。因此两条连续执行的大白话就是：

```text
第一条：按唯一模板真正生成候选bootstrap
第二条：用只读模式确认刚生成的完整字节没有漂移
```

当前checkout根目录中由Release contract唯一指定的candidate bootstrap属于C0受测输入，生成后必须正常提交并进入
Source/Candidate。开发阶段的文件名通常带`-dev`；稳定候选可能不带`-dev`，但只要它仍是tracked zero-hash候选，就继续承担
candidate角色。若第一通道已经PASS，再运行`--write`并造成该脚本字节变化，就必须作废旧证据、形成新C0并重跑，而不是把它
当成无影响的本地整理。若命令返回`state=unchanged`，就没有产生新字节；正常的`release`命令也只在ignored `dist/`生成
exact-hash正式资产，不修改C0。

#### 模板4.1如何在双版本并存时选中正确bootstrap

这里的“模板4.1”是[`Cloud hard acceptance template`](docs/cloud-hard-acceptance-template.md)的Source/Candidate setup。
它不会扫描根目录、比较SemVer或猜测哪个文件“看起来更新”，而是按当前Cloud checkout中的machine authority走一条精确选择链：

```text
当前Cloud checkout
  → upstream-manifest.json
  → manifest点名的Release artifact contract
  → external_release_assets（必须恰好一项）
  → 该项写明的根目录candidate bootstrap
```

大白话：旧accepted bootstrap和新candidate bootstrap可以同时留在根目录，但4.1只执行当前contract点名的那一个。比如当前
checkout的contract点名`init-cloud-sandbox-vX.Y.Z-dev.bash`，旧版本脚本即使仍存在也不会被选中；若切回旧版本的immutable
checkout，则按那个checkout自己的contract选择旧脚本。`external_release_assets`不是恰好一项、目标不存在或Bash语法不通过时，
4.1都会停止，不会自行挑另一个文件兜底。

选中脚本后，4.1会先从同一checkout双构建候选ZIP、核对两份字节一致并取得实际SHA，再这样执行安装：

```text
HOOKS_URL=file://本轮新构建的候选ZIP
HOOKS_SHA256=该候选ZIP的实际SHA-256
bash 当前contract点名的candidate bootstrap all
```

这两个override不是用来“伪装版本”，而是把zero-hash candidate bootstrap临时接到本轮本地候选ZIP：`HOOKS_URL`阻止它去下载
默认GitHub URL，`HOOKS_SHA256`让它仍按本轮实际hash校验字节。于是Source/Candidate证明的是“当前C0源码、当前contract点名的
bootstrap和由当前源码构建的ZIP能一起工作”。它不证明公开下载链；发布后另一个Published Release通道会使用公开的exact-hash
bootstrap及其默认GitHub URL重新验收，不带这两个本地override。

#### 4.1的override与脚本默认值如何配合

bootstrap中的相关变量采用“调用者传值优先，脚本内嵌值兜底”的Shell写法：

```bash
readonly HOOKS_URL="${HOOKS_URL:-默认GitHub URL}"
readonly HOOKS_SHA256="${HOOKS_SHA256:-脚本内嵌SHA}"
```

这里的`readonly`不是“禁止外部override”，而是变量完成初始化后不允许脚本内部再次修改。启动`bash`时若环境里已经有非空
`HOOKS_URL`或`HOOKS_SHA256`，右侧展开会先采用环境值，然后才把结果设为只读。因此4.1无论面对内嵌zero hash的candidate
bootstrap，还是技术上面对内嵌非零hash的正式bootstrap，都能用本轮`file://`URL和候选ZIP实际SHA覆盖其默认值。

| 脚本内嵌默认值 | 不传override | 4.1传入本地override |
|---|---|---|
| zero SHA candidate | checksum准入fail closed，不会误下载未发布包 | 使用本轮候选ZIP的实际SHA，允许Source/Candidate安装验证 |
| non-zero SHA正式脚本 | 使用脚本默认GitHub URL与正式SHA | Shell层仍会改用本地ZIP与本轮SHA，但这不自动取得candidate身份 |

最后一行很重要：技术上“能够覆盖”不等于验收合同“允许拿正式脚本或旧脚本当candidate”。4.1只override URL和SHA，故意不override
`HOOKS_VERSION`；版本仍来自contract点名的脚本。安装前的完整suite还会核对contract asset文件名与当前package version、脚本内嵌
version，以及tracked candidate是否等于canonical模板生成的zero-hash字节。任一不一致都会先停止，所以旧版或已经seal为non-zero
SHA的正式bootstrap不能仅凭两个override冒充当前candidate。

```text
zero hash：保证候选脚本脱离验收override时fail closed
URL/SHA override：让候选脚本安全连接本轮本地ZIP
version/contract/zero-hash测试：保证没有拿错旧版或正式bootstrap
```

### Source/Candidate PASS后：生成待上传双资产

只有以下前提全部成立，才运行正式生成命令：

- package、Release contract、bootstrap文件名和version identity已经稳定为正式目标版本，例如`X.Y.Z`而不是`X.Y.Z-dev`；
- Source/Candidate Cloud已经对exact C0和候选ZIP给出PASS；
- 已复制第一通道原始输出中的exact ZIP SHA-256；这个SHA来自Cloud evidence，不由早期本地`candidate.zip`代替；
- PASS后没有修改README、package、contract、runtime、builder或其他ZIP输入；允许的C1写回只能是Release-excluded治理/证据文件；
- 根目录zero-hash candidate仍与canonical模板逐字节一致。

维护者只替换下面命令中的`vX.Y.Z`和Source/Candidate实际输出的64位小写ZIP SHA：

```powershell
python tools/materialize_release_assets.py release `
  --version vX.Y.Z `
  --expected-zip-sha <SOURCE_CANDIDATE_ZIP_SHA256> `
  --output-dir ./dist
```

这条命令不是“复制旧ZIP并改名”，而是执行下面的完整闭环：

```text
读取当前checkout的Release输入
  → 在临时目录重新build/check一份全新确定性ZIP
  → 计算新ZIP SHA并与Source/Candidate Cloud SHA逐字节比较
  → 一致后才把versioned ZIP写入dist/
  → 从同一canonical模板生成绑定exact ZIP SHA的正式bootstrap
  → 输出两项资产的路径、大小、SHA和ZIP entry数
```

因为ZIP构建是确定性的，只要当前Release输入仍与C0一致，重新构建的SHA就必须等于Cloud证据；不一致说明输入或证据已经漂移，
生成器会停止，而不是沿用旧`candidate.zip`掩盖问题。成功后`dist/`中会同时得到：

```text
dist/pwf-codex-cloud-hooks-vX.Y.Z.zip
dist/init-cloud-sandbox-vX.Y.Z.bash
```

命令输出一行JSON，包含两项资产的路径、大小、SHA和ZIP entry数，可直接用于publication/acceptance回填。`HOOKS_PACKAGE`与
`HOOKS_URL`继续由版本派生；生成器不会改动`HOOKS_ARCHIVE_ROOT`、PWF Skill pins、PowerShell pins或其他固定安全字段。
如果Source/Candidate SHA不匹配、根candidate偏离模板，或`dist/`已有同名但不同字节的文件，命令会停止且不覆盖旧资产；相同字节则
允许幂等重跑。模板和生成器是C0前必须冻结、测试的源码维护输入，但它们本身不进入Release ZIP，也不是待上传资产。

生成后可按需再次复核ZIP、Bash语法和bootstrap自身SHA，再把两项文件上传：

```powershell
python tools/build_release.py check --archive ./dist/pwf-codex-cloud-hooks-vX.Y.Z.zip
bash -n ./dist/init-cloud-sandbox-vX.Y.Z.bash
Get-FileHash -Algorithm SHA256 ./dist/init-cloud-sandbox-vX.Y.Z.bash
```

正式tag必须继续精确指向Source/Candidate实际PASS的C0。ZIP/bootstrap一经上传即视为immutable；不得通过移动tag、重传同名资产
或在publication后重新打包来修补。完整授权、C0/C1/C2顺序和两轮退役时点仍以上文链接的ROADMAP Release流程为准；具体版本的
exact证据写回对应acceptance。

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
| 某个已激活 Product Phase 为什么存在、最终采用什么路线、留下哪些长期边界 | [`Product Phase Overview`](docs/product-phases/README.md) |
| 本地维护机或远程/Cloud执行面有哪些已确认限制、默认怎样绕行、何时重验 | [`维护执行环境限制与对策档案`](docs/maintenance-environment-profile.md#maintenance-environment-profile) |
| 当前唯一 Next Step、授权、禁止事项和停止条件 | `.planning/.active_plan` 指向的活动 `task_plan.md` |
| 已发布身份、迁移 refs、upstream/overlay 与不可变资产从哪里来 | [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) 冷证据账本 |
| 历史如何分层保留、planning/版本文件何时退场，以及怎样迁移到新项目 | [`仓库治理指南`](docs/repository-governance-guide.md) |
| 已关闭 Phase、Discovery、patch/governance 列车当时怎样探路、为什么决定、如何回补并被后继阶段继承 | [`Phase 历史过程账本`](docs/history/README.md)；长期 Product Phase 结论读对应 overview，source snapshot 仅用于 cold audit |
| 新维护者如何接手、避坑并解释能力检测结果 | [`MAINTAINER_HANDOFF.md`](MAINTAINER_HANDOFF.md) |
| 某次迁移、Cloud 或 Release 如何被验收 | 对应的 [`docs/`](docs/) 专项 runbook/acceptance |

源码分支、package version、文件名、本地 ZIP 或本地 seal 中出现版本号，不代表 Release 已成立。

## 许可证

本仓库使用 MIT License。上游 PWF 的来源和许可证信息见
[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。
