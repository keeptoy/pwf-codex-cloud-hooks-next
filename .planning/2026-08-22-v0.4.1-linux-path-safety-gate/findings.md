# Findings: v0.4.1 Linux/POSIX path-safety gate

## Inherited evidence

- Windows已证明linked hooks parent、direct runtime junction、nested junction与非目录component会以`BLOCKED_UNSAFE_RUNTIME_PATH`在backup/mutation前拒绝。
- 完整Windows suite为158 pass、0 fail、25个Linux/POSIX-only skip；这些skip不能作为本gate证据。
- Hook adapter、owned runtime、Host ABI与runtime bundle未修改；本gate聚焦installer topology及Linux零skip回归。
- Source/Candidate setup会现场构建ZIP并以local URL/exact SHA override执行zero-hash bootstrap；Published Release仍未授权。

## Questions

- 当前主机是否有已安装且无需联网的WSL发行版或现成容器？
- Windows挂载路径是否会扭曲mode/symlink语义，是否需要复制到Linux`/tmp`？
- 现有installer tests是否覆盖FIFO/socket/device等special entry，还是需要补最近边界test？

## Execution discovery

- Windows主机存在`C:\Windows\system32\wsl.exe`，但`wsl --list --verbose`报告没有已安装发行版并提示执行`wsl.exe --install`。
- `docker`、`podman`与`nerdctl`命令均不存在，没有可复用的本地Linux容器引擎。
- Git Bash只是Windows/MSYS执行层，不能提供Linux kernel、native POSIX filesystem、FIFO/device与Linux mode语义，按冻结不变量不能作为本gate证据。
- 当前安全选择是停止：安装WSL属于系统级外部变更且可能联网/重启；转Cloud需要新的Cloud授权和维护者先提供远端exact source。

## Recommended route

- 若只做Linux代码gate，优先由维护者准备已有WSL2 Ubuntu或其他受支持Linux，再把repository复制到Linux原生`/tmp`/home filesystem运行，避免`/mnt/c`扭曲mode/link语义。
- 若准备直接进入Source/Candidate Cloud，可复用模板4.1；它要求Linux suite为0 skip，并现场构建ZIP、用local URL/exact SHA override执行candidate bootstrap，同时还能继续完成Fresh/Resume黑盒证据。

## Resources

- `install.js`
- `tests/installer.test.js`
- `tests/architecture-contracts.test.js`
- `docs/v0.4.1-dev-cloud-hard-acceptance.md`
- `docs/cloud-hard-acceptance-template.md`
