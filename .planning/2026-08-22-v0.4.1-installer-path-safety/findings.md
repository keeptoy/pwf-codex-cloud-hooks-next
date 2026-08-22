# Findings: v0.4.1 installer path safety

## Inherited evidence

- `v0.4.0` 是 accepted/Latest；`v0.3.5` 是 immediate fallback。patch train 不得改写任何已发布身份或资产。
- Windows disposable fixture 已证明：`<codex-home>/hooks` 为 junction 时，当前 uninstall 会穿透父 junction 删除外部 runtime。
- unknown 普通文件被备份后显式卸载符合 README Pre-1.0 recovery/cleanup 合同，不是缺陷。
- 静态复核又发现 `assertSafeRuntimeForInstall()` 在 runtime 不存在时提前返回，可能漏掉 clean-install 场景中的 linked `hooks` parent。

## Initial threat model

异常路径不只来自恶意攻击，也可能来自管理员搬迁、备份恢复、旧安装器、共享路径或并发替换。由于 production install/uninstall 通常以提升权限运行，所有 path topology 都必须作为不可信外部状态验证。

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
