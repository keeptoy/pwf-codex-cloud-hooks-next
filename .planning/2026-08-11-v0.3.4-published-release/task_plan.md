# Task Plan: v0.3.4 Published Release

## Goal

把已经通过 Source/Candidate Cloud 的 Phase 3.8 兼容维护列车封板为 immutable `v0.3.4`，完成发布审计、
双资产公开下载复核和独立 Published Release Cloud hard acceptance；不改变产品行为、runtime inventory、
Host ABI、trusted graph 或 Product Phase 4 边界。

## Authorization

- 维护者已明确授权进入 Published Release gate，并同意先按三层文档职责建立独立 Release planning。
- 本轮 R0 允许整理稳定验收协议、版本证据与活动 Release plan，审计 seal 输入并冻结后续 gate。
- 授权覆盖后续按本计划顺序执行 machine identity、seal、publication、公开下载和 Published Release Cloud；
  每个关键 gate 仍须满足前置条件，失败即停，不得跳步或把 Source/Candidate PASS 当成最终发布 PASS。
- rollback/Latest promotion、旧版本 eviction 和 Product Phase 4 不在本计划授权范围内。

## Invariants

- Source/Candidate 证据严格绑定 commit `dc20ef9133b1998e70e733f233e97c9ac8a0bc76` 与其 zero-hash candidate
  通道，不得改写或冒充 Published Release 证据。
- `v0.3.3` accepted 与 `v0.3.2` immediate fallback 在独立 promotion gate 前保持不变。
- Release ZIP 继续由 `contracts/release-artifact-v1.json` 精确 allowlist 构建，bootstrap 永远在 ZIP 外。
- runtime bundle 是 source/install inventory 唯一权威；installed snapshot 与 ZIP allowlist 继续承担各自职责。
- 最终 tag、ZIP/bootstrap 字节、URL 与 SHA 一旦发布即不可改写；任一封板输入变化都必须重新 seal。
- 不新增或激活 Phase 4 文件，不改变 managed adapter-only policy、installed layout 或 upstream pristine bytes。

## Gates

- [x] R0 — Entry/freeze：固化文档职责，审计 exact Release inputs、目标 identity、资产名与停止条件。
- [x] R1 — Stable identity：把 machine/package/bootstrap/acceptance 身份从 `0.3.4-dev` 原子收敛为 `0.3.4`，
  同步 contracts/hashes/docs/tests，并完成完整本地回归和双构建检查；production/runtime bytes 未变，已有
  Source/Candidate Linux 120/120 与行为黑盒继续覆盖该行为面，不重复执行同一 Cloud 通道。
- [x] R2 — Seal：冻结全部 ZIP 输入，双构建逐字一致，计算最终 ZIP SHA，写入 ZIP 外 bootstrap，再计算
  bootstrap SHA；sealed source 完整回归通过，任何后续 ZIP/bootstrap 输入变化都必须回到 R2 起点。
- [x] R3 — Publication audit：在具备 exact refs 的维护环境验证 source reproducibility、历史 publication
  oracles、远端 identity 空闲与 main ancestry；sealed tree/ZIP/bootstrap 均保持 exact。
- [ ] R4 — Immutable publication：创建并发布最终 tag 与双资产，重新下载并核对 filename/size/SHA/内容。
- [ ] R5 — Published Release Cloud：在独立 Fresh Cloud 中从 immutable public bootstrap 执行 B-PR/C/D/E1/E2
  与 9.2 deep check，不使用本地 ZIP、checkout 同名脚本或 Source/Candidate 环境。
- [ ] R6 — Evidence close：把两条通道的最终不可变证据一次性写入版本 acceptance，关闭本 Release gate。

## Next Step

执行 R4 immutable publication：提交本次 R3 planning closure，在干净 HEAD 再确认 sealed ZIP/bootstrap identity，
fast-forward 推送 `0.3.4-dev` 与 `main`，创建 immutable `v0.3.4` tag/Release 并上传两项 sealed assets；随后
重新下载核对 filename/size/SHA/boundary。任一远端 identity 冲突或下载字节不一致立即停止。

## Decision

`PUBLISHED_RELEASE_GATE_AUTHORIZED / R3_COMPLETE / R4_NEXT / PUBLICATION_NOT_STARTED / PHASE4_NOT_AUTHORIZED`

## Stop Conditions

- stable identity 需要改变 product behavior、runtime inventory、Host ABI、trusted graph 或 Phase 4 准入。
- 当前 source 不包含已通过 Source/Candidate 的实现祖先，或 Release 输入与已测 candidate 出现无法解释的漂移。
- 两次 ZIP 不逐字一致，builder/importer/installer integrity check 失败，或 bootstrap 被纳入 ZIP。
- 目标 tag/Release/asset identity 已存在且字节不完全相同，或公开下载无法验证 exact SHA。
- Published Cloud 不是 Fresh 环境、使用 moving URL/本地 override，或任一 B-PR～9.2 步骤失败。
- 需要 rollback/Latest promotion、历史 eviction 或 Product Phase 4 权限才能继续。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Windows sandbox 内 `node --test` 因 child-process `spawn EPERM` 未执行断言 | 1 | 在获准的沙箱外重跑 focused suite，17/17 PASS；完整 `npm test` 同样在沙箱外通过 |
| R1 `bash -n` 在受限 Windows sandbox 因 Git Bash 无法创建 signal pipe（Win32 error 5）未完成语法检查 | 1 | 归类为 sandbox platform limitation；改为在获准的沙箱外重跑，不把后续 PowerShell 命令的零退出码误记为 Bash PASS |
| 本机只有 `wsl.exe` 占位入口但未安装 Linux distribution，Docker/Podman 也不可用 | 1 | 归类为 platform limitation；保留 12 个 POSIX/Linux SKIP，R1 停在 exact committed candidate 的 Linux 0-skip gate |
| 首次 `gh release view v0.3.4` 以预期的 `release not found` 返回 1，使并行聚合命令整体非零 | 1 | 改为显式区分 absent 与 query failure；复核 LOCAL_TAG、REMOTE_TAG、REMOTE_RELEASE 均为 ABSENT |
| R2 首次完整 suite 仅因 release-package test 仍匹配 ROADMAP 的 `stable candidate` 旧角色文字而失败 | 1 | 归类为 test fixture drift；更新为 `sealed candidate`，不弱化 ZIP/bootstrap SHA 断言后重跑完整 suite |
| PowerShell 未引用 `^{tree}` rev 表达式，花括号被 shell 处理为 encoded argument，三次 `git rev-parse` 失败 | 1 | 改用单引号包裹完整 rev；确认 `origin/main` tree 与 `dc20ef9` 完全相同，不重复原命令 |
