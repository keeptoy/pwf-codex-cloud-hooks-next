# Task Plan: v0.3.2 Release and Cloud Hard Acceptance

## Goal

把当前 `0.3.2-dev-extend` source/governance 列车收敛为不可变 `v0.3.2` ZIP 与外部 bootstrap，发布后由
维护者在真实 Codex Cloud 执行 hard acceptance；在证据回传并冻结前，不提升 rollback baseline 或
GitHub `Latest`。

## Authorization

- 维护者已授权把本地 `0.3.2-dev-extend` 的四个治理提交 non-force push 到同名远端；已完成。
- 维护者要求下一步发布 `v0.3.2` ZIP 供其 Cloud 测试，并生成 `v0.3.2` Cloud hard acceptance。
- 本轮先执行 Release Discovery、身份/字节冻结、完整本地验证、双构建和 acceptance 骨架；所有前置
  gate 通过后，才进入 tag/Release/双资产外部写入。
- 当前授权不包含 GitHub `Latest`、production rollback promotion、Product Phase 4、Cloud 代跑或改写
  任何既有 tag/Release/asset。
- 若最终 ZIP 输入或 bootstrap 在 seal 后变化，必须停止并重新开始 seal，不得覆盖同一身份。

## Next Step

维护者按 `docs/v0.3.2-cloud-hard-acceptance.md` 第 4～10 节执行 R5：全新 Cloud public setup、Fresh、
canonical planning、long tail、real Resume 与 doctor；回传原始输出。智能体等待证据，不代跑 Cloud。

## Gates

- [x] R0 — Release Discovery：恢复历史流程、核对当前 refs/identity/allowlist、冻结差异与退出条件。
- [x] R1 — Stable identity：将获批文件从 `0.3.2-dev` 晋级到 `0.3.2`，生成 Cloud hard acceptance 骨架。
- [x] R2 — Local seal candidate：完整 regression、平台检查、双构建、ZIP boundary 与 importer replay 全绿。
- [x] R3 — Final bytes：计算 ZIP SHA，写入外部 bootstrap，复跑受影响验证并冻结双资产 identity。
- [x] R4 — Immutable publication：创建 exact tag/Release，上传 ZIP 与 bootstrap，重新下载并逐字节核验。
- [ ] R5 — Cloud handoff：交付维护者可复制的 Fresh/Resume/doctor/rollback 测试步骤，等待真实结果。
- [ ] R6 — Acceptance closure：只根据回传证据关闭 Cloud acceptance；Latest/rollback promotion 另行授权。

## Stop Conditions

- 当前候选不是可从单一 source commit 确定性构建的完整 ZIP 输入。
- version、contract、README、bootstrap URL/hash 或 acceptance 对目标身份存在冲突。
- 完整 regression、Linux-required gate、双构建、下载后校验或 Cloud hard acceptance 失败。
- 需要 force-push、覆盖既有 tag/Release/asset、使用 moving URL、跳过 checksum 或把 bootstrap 放入 ZIP。
- 需要提升 `Latest`/rollback、运行真实 Cloud 或进入 Product Phase 4，而没有新的明确授权与证据。

## Status

R0–R4 PASS / R5 waiting for maintainer Cloud evidence。当前 production rollback/`Latest` 仍为 `v0.3.1`；
`v0.3.2` 已发布但尚未通过 Cloud hard acceptance。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| `git show -- <paths> 9aa2148` 把 revision 放在 `--` 后，实际按 path 解析并显示 HEAD 元数据 | 1 | 后续使用 `git show 9aa2148:<path>` 或把 revision 放在 `--` 前，不重复原命令 |
| `gh release view v0.3.2` 因目标 Release 不存在返回 1 | 1 | 这是预期的 collision negative probe；与空的 exact tag 查询共同证明目标身份尚可创建，不重复当作故障 |
| 初版 input-ledger probe 用 `if (git diff --quiet)` 判断无输出命令，把干净 LICENSE 误报 drift | 1 | 改为显式读取 `$LASTEXITCODE`；23 个输入随后全部确认无 unstaged drift |
| 当前 Windows PowerShell/.NET 不支持静态 `SHA256.HashData` 与 `Convert.ToHexString` | 1 | 改用兼容的 `SHA256.Create().ComputeHash()` 与逐字节 hex；ledger SHA 成功冻结 |
| 初次 Bash 探测只检查 C: 固定路径，漏掉测试实际使用的 D: Git Bash | 1 | 读取测试 resolver 后使用 `D:\Program Files\Git\bin\bash.exe`，不再把它记为缺失 |
| Git Bash 在沙箱内 `bash -n` 因 signal pipe Win32 error 5 退出 | 1 | 分类为 sandbox execution limitation；获批后在沙箱外以同一命令复跑，两个 bootstrap 均 PASS |
| downloaded importer probe 把尚未创建的 extraction path 设为 shell cwd，Windows 启动前报 error 267 | 1 | 从现有仓库 cwd 解压，再在命令内部 Push-Location；extracted importer check PASS |
