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

## Cloud route decision

- 维护者已明确选择 Source/Candidate Cloud，不安装本机 WSL 或容器；活动计划与 `AGENTS.md` 已改为该默认路由。
- OpenAI 官方 Codex Cloud 文档确认 Cloud task 运行在隔离环境中，并从已连接的 GitHub/GitLab repository 与选定 environment 启动。
- 官方 CLI 文档确认 `codex cloud exec --env <ENV_ID> <QUERY>` 可直接提交 Cloud task；鉴权沿用主 CLI。CLI 能否枚举/选择本账户 environment 仍需本机 preflight。
- 官方 Cloud environment 文档说明 cached environment 在任务开始时 checkout 对话指定 branch；因此未 push 的本地 commit 对 Cloud 不可见，必须先核对远端 exact source，不能用近似 branch 冒充。
- `AGENTS.md` 的宿主机记忆按路径和日期限定；它避免重复探测，但在维护者明确改变 WSL/容器状态后允许重新 Discovery。

## Nearest boundary test decision

- POSIX special-file 选择 FIFO：可由标准 `mkfifo` 在一次性 fixture 内创建，不需要 root，也不会接触真实 device。
- 新用例在 Windows 明确 SKIP；在 Linux 上必须证明 uninstall 在 backup、requirements write 与 runtime mutation 前返回 `BLOCKED_UNSAFE_RUNTIME_PATH`，并保留 FIFO 原状。

## Responsibility correction

- 仓库已经形成标准迭代流水线；本轮不需要重新设计“如何自动发起 Cloud”。
- 默认职责是：智能体完成本地实现、测试、Cloud 验收教程和本地 commit；维护者完成 push，并在 Codex Cloud UI 手动创建、继续或 Resume task。
- 维护者把 Cloud 原始输出带回后，智能体负责按版本 acceptance 核对并持久化证据；未提供的轮次保持 PENDING。
- 除非维护者针对当前 gate 明确指定，智能体不默认调用 Cloud CLI；早先的 Cloud CLI/environment ID 探索不是标准前置条件。
- `AGENTS.md` 应同时保存两类信息：稳定职责分工，以及当前 Windows 维护机没有 WSL/Docker 等执行面的事实。后者用于避免无意义重复搜索，前者决定正常路线。

## v0.4.1 acceptance tutorial gap

- 当前 `docs/v0.4.1-dev-cloud-hard-acceptance.md` 只有 gate 状态与 path-safety delta，没有维护者可直接执行的职责说明、push 后 preflight、逐 task 顺序、结果回传清单或失败分流。
- 稳定 template 明确禁止版本 acceptance 再复制 setup 脚本、B～E 提示词或完整通用步骤；因此“补全教程”应采用一页式版本 run sheet：解释谁做什么、填哪些版本参数、依次点击/粘贴模板哪一节、每轮保存什么，以及何时停止。
- v0.4.0 F3C operator guide 的可借鉴部分是“一分钟理解”“冻结身份”“固定轮次”“提示词索引”“停止条件与交接”的人类操作结构；其版本专用长脚本和历史状态不能复制到 v0.4.1。
- v0.4.0 F3 lifecycle runbook 再次确认远端 refs、commit、push、PR 和 task 选择由维护者控制；验收 agent 不应自行改写 source 或把自动修复后的 task 记为 PASS。
- v0.4.1 当前状态应从容易误读的 `NOT_AUTHORIZED` 拆开表达：教程可以 `READY`，实际 Cloud evidence 仍 `PENDING`，seal/publication 仍 `NOT_AUTHORIZED`。

## Stable Source/Candidate execution facts

- 每个新 Cloud task 的第一条消息都要带模板 0.4 的只读验收权限前缀；发现问题必须停止并回传，不能让 Cloud agent 修复后继续记 PASS。
- Source/Candidate 固定顺序是：Fresh environment 中执行 4.1 setup → 新 task 执行 5.1 B-SC → 同 task 依次执行 6 C、7 D、8.1 E1 → 重新打开同一 task 执行 8.2 E2 → 执行 9.1 deep check → 丢弃环境。
- 4.1 setup 在 agent startup 后安装，因此 Source/Candidate 的 B 不是 Fresh startup，而是新 task 的 post-install Resume；不得误用 Published Release 的 5.2 B-PR。
- 4.1 会自己校验 clean checkout、Node major、portable suite 0 fail/0 skip、双 ZIP 一致、entry/size/SHA、本地 override 安装和 setup PASS；版本教程只需告诉维护者在哪里设置 `PWF_ACCEPTANCE_NODE_MAJOR`、如何粘贴本节并保存原始输出。
- C 段是唯一允许的 workspace 改动；D/E 只能观察自动注入。E1 后必须离开 task，E2 必须重新打开完全相同 task，9.1 只能从当前 exact checkout/template 取得。
- 版本写回应保存 exact commit/branch transport、runner 摘要、ZIP 证据、B～E 原始问答和 9.1 输出；未完成时不能预填 exact evidence 或宣称 PASS。

## Operator-guide lessons retained

- v0.4.0 F3C 的高价值写法是先用“一分钟理解”给出每轮目的，再给固定顺序、实际/预期事实分离、唯一 verifier、停止条件和交接；这比把一大段脚本直接称作“教程”更适合维护者操作。
- 历史 F3 runbook 冻结了长期职责：validation refs 由维护者创建/选择，验收 agent 不 commit、push、PR 或移动 ref；Cloud 模型的 Host 文本不能替代机器 verifier。
- v0.4.1 是兼容性 patch，不需要复制 F3 的 activation DAG、rollback transaction 或 evidence JSON；应复用稳定 Source/Candidate 4.1/5.1/6/7/8/9.1 协议，并只增加 FIFO/path-topology 的版本完成判据。
- 教程应把“环境 setup 后 startup 时序”和“4.1 task 内安装后必须另开 task”讲清楚，避免维护者把 Source/Candidate 误当 Published Release Fresh startup。

## Repository synchronization impact

- 教程建立前，`tests/repository-boundary.test.js` 把 v0.4.1 Source/Candidate 状态硬断言为 `NOT_AUTHORIZED`；教程 handoff 时先改为 `CURRENT / CLOUD_ACCEPTANCE_PENDING`，最终 evidence writeback 再收敛为 `PASS`，同时始终禁止伪造 Published Release URL/marker。
- 教程建立前，`ROADMAP.md` 仍写“未授权 Linux/Cloud gate”；它先随 handoff 同步为 evidence pending，最终随真实回传同步为 Source/Candidate PASS，seal/tag/Release/Latest 继续未授权。
- README 已经清楚区分 Windows SKIP 与 Linux/Cloud gate，不需要为本轮复制教程；AGENTS 的交互与提交纪律已有“维护者负责远端写”基础，只需把新增小节改成默认本地/Cloud 职责流水线。

## Source/Candidate 4.1 Cloud evidence

- Cloud checkout HEAD 为 `6c1dd52a3878f59c7140a793b9a2c2a34580b188`，与维护者已 push 的本地 HEAD 一致；本地 branch 当前跟踪 `origin/0.4.1` 且无 ahead/behind。
- Linux portable suite 报告 `175 tests / 175 pass / 0 fail / 0 skipped`；这关闭 Windows 无法提供的真实 Linux 零 skip 执行面。
- 两次 candidate ZIP identity 为 22 entries、85,915 bytes、SHA-256 `543a72a57fdd7ca04854d5d1dfde6f838bf40e3afa5eb2c52c2d559b3843854a`，与本地双构建完全一致。
- `PWF_SOURCE_CANDIDATE_SETUP=PASS` 已出现；local override 安装、doctor healthy、managed TOML、SessionStart/UserPromptSubmit adapter probes 与 clean worktree 均由 Cloud 报告通过，且没有 commit/PR。
- 首次回传摘要没有单列长脚本的最终 exit code，也没有逐字附上每条 path-safety TAP；维护者随后明确确认整条黑盒测试最终成功跑通。结合 exact source、完整 runner `0 fail / 0 skipped` 与 setup PASS，本轮 A 最终归类为 `PASS`，但仍保留首次摘要不完整这一过程事实。

## Source/Candidate C permission recovery and 9.1 evidence

- 维护者报告 B、D、E 与 9.1 其余观察均通过；9.1 明确 exit code 0，HEAD 为 `6c1dd52a3878f59c7140a793b9a2c2a34580b188`，并输出 `PWF_WORKTREE_CHANGES=PLANNING_ONLY`、`POST_RESUME_DOCTOR=PASS` 与 `PWF_SC_POST_RESUME=PASS`。
- 9.1 machine facts：doctor healthy/managed/non-repairable、events exact、errors/blockers empty、installer `0.4.1-dev`、manifest schema 4、Release/bundle v2、22 artifact entries、12 installed runtime files、4 pristine upstream files、bundle inventory authoritative、managed policy adapter-only、snapshot leftovers 0。
- C 的首次回复因仍受前一条“不读取文件”限制而无法安全确认/更新 `.planning/.active_plan`，因此 fail closed 且没有改动文件。该次拒绝本身不构成 PASS，也不能由 9.1 的 `PLANNING_ONLY` 倒推补造。
- 维护者随后在同一 task 临时明确授权读取 canonical planning 所需路径并执行规定的 `apply_patch`；C 随即成功创建 canonical baseline，D/E 在同一 fixture 上继续并全部通过。因此完整时间线是“首次安全拒绝 → 维护者 bounded authorization → C～E 成功”，最终 C 与整条 Source/Candidate 均可记为 `PASS`。
- 根因是同一 task 中 B 的用户提示明确禁止工具和文件读取，而紧接的 C 虽要求 `apply_patch`、存在性检查和 pointer 更新，却没有明确结束/取代 B 限制。Cloud 模型选择 fail closed 是正确行为。
- 修复只改稳定验收提示：C 开头显式终止 B 的一次性观察限制，并仅开放目标 planning 路径的 bounded read 与规定的 apply_patch；production、Host ABI、ZIP inventory 和 runtime 不变。
- 后续 `0d470920f42651983062945a129e38838c46f4d7` 把本次人工 bounded authorization 固化为稳定 B→C 提示交接，只改 docs/tests/planning，不进入 Release ZIP；候选 identity 仍为 22 entries、85,915 bytes 与同一 SHA。它是未来运行的 protocol hardening，不使已经在 `6c1dd52` 上完整成功的本轮证据失效，也不再触发重跑要求。
- 最终 gate 结论为 `V0_4_1_SOURCE_CANDIDATE_CLOUD_PASS / STOP_BEFORE_SEAL / RELEASE_NOT_AUTHORIZED`；seal/publication 仍需独立授权。

## Resources

- `install.js`
- `tests/installer.test.js`
- `tests/architecture-contracts.test.js`
- `docs/v0.4.1-dev-cloud-hard-acceptance.md`
- `docs/cloud-hard-acceptance-template.md`
