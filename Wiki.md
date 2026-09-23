# 开发与 Release 维护

本文件集中维护本仓库的本地开发、候选 ZIP 构建和 Release 资产准备流程。稳定产品行为、安装与
doctor/repair 仍见 [`README.md`](README.md)；programme、版本角色和 Release gate 仍以
[`ROADMAP.md`](ROADMAP.md) 为准。

## 快速入口

- [本地开发与常用检查](#local-development)
- [构建开发 ZIP](#build-development-zip)
- [生成并核对 candidate bootstrap](#candidate-bootstrap)
- [Source/Candidate PASS 后生成正式资产](#materialize-release-assets)
- [将正式 tag 精确固定到 C0](#source-candidate-c0-tag-push)

> 权限边界：读取、检查、构建和本地提交是否执行，仍以活动 task plan 的授权为准；push、tag、PR、Release、资产上传、
> Latest 切换和部署始终由维护者执行。本文中的远端命令只是维护者操作教程，不会向智能体授予远端写权限。

<a name="local-development"></a>

## 本地开发

恢复上下文时按以下顺序阅读：

1. [`AGENTS.md`](AGENTS.md)
2. [`README.md`](README.md)
3. [`ARCHITECTURE.md`](ARCHITECTURE.md)
4. [`DESIGN.md`](DESIGN.md)
5. [`ROADMAP.md`](ROADMAP.md)
6. 读取 `.planning/.active_plan`，再读取它指向的 `task_plan.md`、`findings.md`、`progress.md`
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

<a name="build-development-zip"></a>

## 构建开发 ZIP

Release allowlist 由 `upstream-manifest.json` 指向的当前
[`release-artifact-v2.json`](contracts/release-artifact-v2.json) 唯一决定。每个 entry 自带 ZIP mode；构建器固定
路径顺序、时间戳、压缩参数和 archive root，`check` 再核对 entries、mode、metadata 与源文件字节。

如果你第一次接触本仓库的Release流程，先记住三个词：

- `C0`：准备送入第一通道验证的候选源码exact source commit；通过后，正式tag仍精确指向它。
- `Source/Candidate`：第一条Cloud验收通道，用独立环境验证C0的源码checkout和由它构建的候选ZIP。
- `Release-excluded`：不进入Release ZIP的治理或施工文件；只改这类文件不会改变用户下载的package字节。

完整四步、C0/C1/C2和停止点见[`ROADMAP` Release流程](ROADMAP.md#release-four-step-flow)。`README.md`仍属于
Release ZIP输入，修改它会改变候选ZIP；本 `Wiki.md` 不在Release allowlist中，属于Release-excluded维护文档。
所有Release输入修改都应在冻结C0、执行Source/Candidate前完成；如果已经取得Source/Candidate PASS，就必须作废原证据、
形成新C0并重跑第一通道，不能因为“只改文档”而沿用旧PASS。

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

<a name="candidate-bootstrap"></a>

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

这里的“模板4.1”是[`Cloud hard acceptance template`](docs/cloud-hard-acceptance-template.md#source-candidate-setup)的Source/Candidate setup。
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

<a name="materialize-release-assets"></a>

### Source/Candidate PASS后：生成待上传双资产

只有以下前提全部成立，才运行正式生成命令：

- package、Release contract、bootstrap文件名和version identity已经稳定为正式目标版本，例如`X.Y.Z`而不是`X.Y.Z-dev`；
- Source/Candidate Cloud已经对exact C0和候选ZIP给出PASS；
- 已复制第一通道原始输出中的exact ZIP SHA-256；这个SHA来自Cloud evidence，不由早期本地`candidate.zip`代替；
- PASS后没有修改README、package、contract、runtime、builder或其他ZIP输入；允许的C1写回只能是Release-excluded治理/证据文件；
- 根目录zero-hash candidate仍与canonical模板逐字节一致。

<a name="source-candidate-c0-tag-push"></a>

#### 先给已通过的C0创建并推送正式tag

第一通道通过后，先把Source/Candidate证据和第一轮退役结果写入C1并push治理分支；然后创建正式annotated tag。这里最容易犯的错是
在C1 checkout直接运行不带commit参数的`git tag -a`：Git会默认给当前HEAD打tag，但正式tag必须精确指向Cloud实际验收通过的
`SOURCE_CANDIDATE_HEAD`（C0），不能指向C1、C2或碰巧存在的当前HEAD。

下面是维护者在本地PowerShell执行的完整示例。只替换正式版本和40位C0 commit；tag message可以调整，但不要删除命令中的
`$SOURCE_CANDIDATE_HEAD`参数：

```powershell
$RELEASE_VERSION = "vX.Y.Z"
$SOURCE_CANDIDATE_HEAD = "<40位SOURCE_CANDIDATE_HEAD>"

$resolvedCandidate = (git rev-parse --verify "$SOURCE_CANDIDATE_HEAD^{commit}").Trim()
if ($LASTEXITCODE -ne 0 -or $resolvedCandidate -ne $SOURCE_CANDIDATE_HEAD) {
  throw "SOURCE_CANDIDATE_HEAD不是当前仓库中的exact commit"
}

git show-ref --verify --quiet "refs/tags/$RELEASE_VERSION"
if ($LASTEXITCODE -eq 0) { throw "本地tag已存在；停止并核对，禁止移动或覆盖" }
if ($LASTEXITCODE -ne 1) { throw "无法检查本地tag状态" }

$remoteTag = git ls-remote --exit-code --tags origin "refs/tags/$RELEASE_VERSION"
if ($LASTEXITCODE -eq 0) { throw "远端tag已存在；停止并核对，禁止删除重建" }
if ($LASTEXITCODE -ne 2) { throw "无法确认远端tag是否存在" }

git tag -a $RELEASE_VERSION $SOURCE_CANDIDATE_HEAD `
  -m "$RELEASE_VERSION Source/Candidate PASS"

$localTagCommit = (git rev-parse --verify "$RELEASE_VERSION^{commit}").Trim()
if ($LASTEXITCODE -ne 0 -or $localTagCommit -ne $SOURCE_CANDIDATE_HEAD) {
  throw "本地annotated tag没有精确指向SOURCE_CANDIDATE_HEAD"
}

git push origin "refs/tags/${RELEASE_VERSION}:refs/tags/${RELEASE_VERSION}"

$remoteRefs = @(git ls-remote --tags origin `
  "refs/tags/$RELEASE_VERSION" `
  "refs/tags/$RELEASE_VERSION^{}")
$peeledLine = @($remoteRefs | Where-Object { $_ -match '\^\{\}$' })
if ($peeledLine.Count -ne 1) { throw "远端annotated tag缺少唯一peeled commit" }
$remoteTagCommit = ($peeledLine[0] -split '\s+')[0]
if ($remoteTagCommit -ne $SOURCE_CANDIDATE_HEAD) {
  throw "远端tag没有精确指向SOURCE_CANDIDATE_HEAD"
}
```

大白话：`git tag -a <版本> <C0> ...`只在本地创建tag；`git push origin refs/tags/<版本>:refs/tags/<版本>`只推这一条tag，
不会顺手push其他branch。annotated tag自身有一个tag-object SHA，所以远端核对要看带`^{}`的peeled commit；该值必须等于C0。
任何local/remote同名tag已存在、C0无法解析或peeled commit不一致都必须停止，不能用`-f`、删除重建或移动tag修补。

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
exact证据写回对应版本专项 acceptance。

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
