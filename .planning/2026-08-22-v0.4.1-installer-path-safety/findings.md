# Findings: v0.4.1 installer path safety

## Inherited evidence

- `v0.4.0` 是 accepted/Latest；`v0.3.5` 是 immediate fallback。patch train 不得改写任何已发布身份或资产。
- Windows disposable fixture 已证明：`<codex-home>/hooks` 为 junction 时，当前 uninstall 会穿透父 junction 删除外部 runtime。
- unknown 普通文件被备份后显式卸载符合 README Pre-1.0 recovery/cleanup 合同，不是缺陷。
- 静态复核又发现 `assertSafeRuntimeForInstall()` 在 runtime 不存在时提前返回，可能漏掉 clean-install 场景中的 linked `hooks` parent。

## Initial threat model

异常路径不只来自恶意攻击，也可能来自管理员搬迁、备份恢复、旧安装器、共享路径或并发替换。由于 production install/uninstall 通常以提升权限运行，所有 path topology 都必须作为不可信外部状态验证。

## Initial source audit

- `pathsFor()` 只做 lexical absolute/non-root 检查，不建立 realpath containment。
- `acquire()` 会先创建 `paths.home` 和 lock；如果 `home` 自身是维护者显式传入的 link，其语义需与“linked child component”分开，不在本 patch 擅自改变。
- `assertSafeRuntimeForInstall()` 当前在 `paths.runtime` 不存在时立即返回，因此 clean install 不会检查已存在的 linked `<codex-home>/hooks` parent；后续 `writeRuntimeFiles()` 会沿该 parent 创建/写入 runtime。
- runtime 已存在时，install admission 会检查 `hooks` parent、runtime root 和递归 entry link/special 类型，再做 exact current/predecessor inventory/hash admission。
- repair 先由 `inspectInstallation()` 把 linked/unknown runtime 分类为 blocker，只有 `repairable=true` 才进入 `backup()`/`writeRuntimeFiles()`；仍需用 nearest tests 证明 linked clean paths 没有旁路。
- uninstall 在 lock 内直接 capture shared requirements/manifest、backup、改 requirements、递归删除 runtime；没有 path-topology admission。
- `backup()` 会递归复制 runtime，因此它本身也是必须在 no-follow admission 之后才允许进入的路径 consumer。

## Development identity inventory

- 当前 package 与 Release artifact 都是 `0.4.0`，external asset 是 sealed `init-cloud-sandbox-v0.4.0.bash`。
- 按现有 role-window tests，进入 `0.4.1-dev` 后应保留 accepted `v0.4.0` bootstrap，并增加 candidate `v0.4.1-dev` zero-hash bootstrap；不能改写 sealed v0.4.0 文件。
- 身份传播和 acceptance 创建时机仍需继续核对 repository/release tests 与 cloud acceptance template。

## Frozen admission matrix

| `hooks` / runtime 状态 | install / repair | uninstall |
|---|---|---|
| 两者缺失，或真实 `hooks` 目录下 runtime 缺失 | install 允许；repair 由既有状态机决定 | no-op cleanup 允许 |
| `hooks` 是 symlink/junction/非目录 special path | backup/write 前拒绝 | backup/requirements write/delete 前拒绝 |
| runtime root 是 symlink/junction/非目录 special path | backup/write 前拒绝 | backup/requirements write/delete 前拒绝 |
| runtime 内含 nested link/special entry | 拒绝 | 拒绝 |
| exact current 或 exact admitted predecessor | 允许既有 install/repair 路线 | 允许备份后卸载 |
| unknown 普通文件或普通目录 | install/repair 继续拒绝 | 允许完整备份后清理 |

## Frozen implementation split

- 新增只判断路径对象类型的 topology admission；它不读取 manifest、不判断 ownership inventory。
- `assertSafeRuntimeForInstall()` 先调用 topology admission，再执行原有 exact current/predecessor 逻辑，修掉 runtime 不存在时漏检 parent 的 early return。
- install/repair/uninstall 在 backup 前调用 topology admission，并在 backup 后、任何 runtime/shared mutation 前复核。
- 使用独立错误前缀 `BLOCKED_UNSAFE_RUNTIME_PATH`，避免把 topology 风险误报为 unknown inventory。
- `codexHome` 是调用者显式指定的根，本 patch 不改变它自身或全部祖先可为 link 的合同；只保护 installer 自己追加的 `hooks/planning-with-files` 路径组件。

## Identity transition decision

- 本地分支名是 `0.4.1`；package、candidate contract、开发 bootstrap 身份使用 `0.4.1-dev`。
- accepted 角色继续是 sealed `v0.4.0`，fallback 继续是 `v0.3.5`；未授权变更公开 Latest。
- `installed-state-transition-v1.json` 的唯一 predecessor 应轮换为 exact accepted `0.4.0`，而不是继续接受 `0.3.5`。
- 新建 `init-cloud-sandbox-v0.4.1-dev.bash`，ZIP SHA 保持 64 位 zero hash 并 fail closed；sealed `v0.4.0` bootstrap 不修改。
- 新候选 acceptance 只记录当前真实本地证据和未完成 gate；历史 `v0.4.0` acceptance/provenance 保持不可变。

## Verified identity materialization

- `package.json`与Release artifact一致为`0.4.1-dev`；external asset精确为`init-cloud-sandbox-v0.4.1-dev.bash`。
- 新bootstrap与sealed `v0.4.0`版本只差candidate version和checksum两行；candidate checksum为64位zero hash。
- transition predecessor从immutable `v0.4.0` tag提取：manifest schema 3、12项runtime inventory、exact adapter/runtime/contract hashes与canonical source-manifest identity。
- published oracle真实构建`v0.4.0` accepted与`v0.3.5` fallback包，并证明当前candidate只接管exact `v0.4.0`、拒绝篡改与direct old-over-current downgrade、owned uninstall后两级published版本仍可恢复。
- 双构建得到相同22-entry development ZIP；该hash仅是本地验证证据，未写入zero-hash bootstrap，也不构成seal/publication。

## Residual boundary

- 当前`lstat` admission与backup后复核能关闭已证实的静态junction/link拓扑漏洞并缩小并发窗口，但Node路径API不能提供完整fd-relative no-follow transaction；最后一次检查到实际mutation之间仍存在理论TOCTOU窗口。
- Windows junction证据不能替代Linux/POSIX symlink、FIFO/device等special-file真实平台gate；这些测试在当前Windows suite中按合同SKIP，未伪报通过。

## Candidate safety invariant

对 installer 即将读取、复制、写入或递归删除的 managed runtime 路径，必须先证明 codex home 下的 `hooks` parent 与 runtime root 是预期位置的真实目录/缺失叶子，而不是 symlink、junction、special entry 或越界解析；拒绝必须发生在 backup 和任何 managed/shared mutation 之前。

## Non-goals

- 不改变 runtime source/install inventory。
- 不改变 manifest schema、Host ABI、Hook events 或 runtime behavior。
- 不把 unknown regular runtime entries 自动吸收为 install/repair owned state。
- 不执行 Release、Cloud、rollback 或远端动作。

## Resources

- `install.js`
- `tests/installer.test.js`
- `README.md`
- `ARCHITECTURE.md`
- `DESIGN.md`
- `ROADMAP.md`
- `CHANGELOG.md`
- `package.json`
- `contracts/release-artifact-v2.json`
