# Findings: Source Logic and Route Analysis

## Entry facts

- 工作树进入本轮时干净，当前分支为 `0.3.4-dev`。
- 稳定产品边界仍是固定的 `OthmanAdi/planning-with-files v3.8.2` Cloud 适配，不是通用 Skill 转换器。
- `v0.3.4` 是 accepted/Latest，`v0.3.3` 是 immediate fallback；Product Phase 4 尚未授权。
- 本轮只读分析，不修改 production/runtime/contracts/tests 或 Release 状态。

## Authority recovery

- README 管稳定行为和命令；ARCHITECTURE 管 trusted graph/Host contract/失败语义；DESIGN 管实现落点；ROADMAP 管 programme 与版本角色；活动 task plan 管当前授权。
- 运行时主链是 `hook_adapter.py -> owned-plan.py -> optional owned-catchup.py -> one Host JSON result`。
- source/install inventory 唯一 authority 是 runtime bundle；manifest 是 provenance/integrity index；installed manifest 是现场快照；Release artifact 是 ZIP allowlist。

## Repository and entrypoint inventory

- production/runtime 只有三个主动入口：adapter `main()`、owned-plan `main()`、owned-catchup `main()`；两个 owned runtime 各自把 JSON stdin 收敛到 `run_request/execute`，没有第二套 dispatch。
- 维护/供应链入口是 `install.js`、`tools/import_upstream_runtime.py` 与 `tools/build_release.py`；前者管理现场状态，后两者分别管理 upstream 重建与 deterministic ZIP。
- adapter 的核心结构已经从函数索引中显现：Host payload/path validation → typed request builders → typed result validators → bounded process supervisor → plan/catch-up dispatch → final context composition。
- owned-plan 的复杂度主要集中在 no-follow 安全读取、计划选择、private snapshot、child supervision 和 cleanup；owned-catchup 的复杂度集中在 transcript 冻结/身份匹配、fallback 选择、bounded parsing 和 report rendering。
- 当前仓库有 16 个顶层 test modules，并用 fixtures 分别重放 golden output、Cloud transcript/lifecycle 与 pinned upstream Skill；测试不是单一 unit 层，而是协议、行为、供应链、安装、publication 与治理多层证据。

## Adapter call graph

- adapter 始终先准备 canary，Host stdin 超过 1 MB、非 UTF-8/JSON/object 时也返回退出码 0 的 canary-only Host JSON；这体现“内容注入 fail closed、advisory Hook 对 Codex loop fail open”。
- 两个 event 共用 plan 路线。request 固定 `runtime=codex`、`behavior_profile=managed_legacy`、20k context/50 plan lines/20 progress lines，并把 `PLANNING_DISABLED` 和经 slug 校验的 `PLAN_ID` 变成显式 policy/project 字段，不透传 prompt/transcript 内容。
- 只有 `SessionStart` 且 plan exact-v1 result 完整有效、`inject=true` 时才构造 catch-up request；它原样转交 plan result 中六字段 project 状态，因此 adapter 不做第二次 plan resolution。
- transcript 优先级在 adapter 已开始收窄：显式 `CODEX_SESSIONS_DIR` → 显式 `CODEX_HOME/sessions` → 从 installed sibling layout 推导 home；最多三个 canonical roots。Host `transcript_path` 只有绝对、regular、非 symlink 且位于 roots 下才标记 validated。
- adapter 对两个 child result 都做 exact-key、enum、关系一致性和路径形状验证；plan result 还必须与原 request 的 root/planning flag/event 对齐。child 不能通过合法 JSON 中夹带未知字段扩展语义。
- child supervision 对 stdin/stdout/stderr 各设预算，使用独立 reader/writer threads 避免管道死锁，POSIX 启新 session，并在 timeout/overflow/nonzero 时杀整个 process group；总预算 27 秒，最终输出保留 1 秒，plan 最多 8.5 秒、catch-up 最多 15 秒。
- 最终只输出一个 Host JSON。组合顺序固定为 canary →（仅 SessionStart）catch-up → plan；plan 缺失/失败/不注入时不调用 catch-up，catch-up 失败则保留 plan，任一异常回退 canary-only。

## Owned plan runtime — validation and safe-read half

- plan runtime 再次独立验证 adapter request 的 exact shape、event 关系、绝对 POSIX root、plan slug、`managed_legacy` policy 与完整固定 budget；producer 和 consumer 两侧都拒绝协议漂移。
- 非注入结果仍尽量返回安全 diagnostic/project shape；`empty_project` 不会为了报告错误而假定不可信 request 已合法。
- 调用 upstream shell 时环境被清洗为固定 PATH 与 C locale，只可选择性加入 TMPDIR/PLAN_ID；child 使用独立 process group、无 stdin、合并 stdout+stderr 上限、deadline，并把任何 stderr/nonzero 视为 runtime failure。
- planning 文件使用 directory-fd 相对打开与 `O_NOFOLLOW`，拒绝 symlink、非 regular、超过 1 MB、hard link (`nlink != 1`)；读取前/后以及重新打开后比较 dev/inode/size/mtime/ctime/type/link/uid/gid，从而把并发替换降级为 `plan_state_changed` 而非注入竞态字节。
- session attachment 是显式状态机：没有 marker 体系为 `legacy`；存在合法 `<session>.attached` 且匹配当前 session 为 `attached`；有 marker 但不匹配、目录/条目不安全或条目超限为 `detached`。detached 会阻止 plan context 注入。
- `PLAN_ID` 与 `.planning/.active_plan` 的 warning 检查都要求 slug、真实目录、非 symlink、containment；warning 与实际 resolver 结果分离，使 diagnostics 能说明显式候选/active pointer 被拒绝，但 selection authority 仍交给 pinned resolver。

## Owned plan runtime — resolution, snapshot and injection half

- canonical precedence 并没有在 Python 中重写：owned-plan 用 `/bin/sh resolve-plan-dir.sh` 在真实 root、清洗环境和 2 秒子预算中取得唯一候选，再强制输出为单行绝对路径且 scoped 形状必须恰为 `.planning/<slug>`；空输出只可能解释为 legacy root。
- selection 后仍检查 `task_plan.md` 为非 symlink regular file；显式 PLAN_ID 未被实际选中会留下 `plan_id_rejected`。这把“上游 resolver 决策”和“owned containment/identity enforcement”拆开。
- snapshot base 固定为 `/tmp/pwf-codex-cloud-hooks-<euid>`，必须 owner=current euid、0700、非 symlink；单次 snapshot 0700，里面只写 0600 的 `task_plan.md` 与可选 `progress.md`，使用 `O_EXCL|O_NOFOLLOW` 和 fsync。
- stale cleanup 只处理同前缀、超过 10 分钟、owner/mode/内容集合完全符合预期的目录，最多 32 项/0.5 秒，并要求 `shutil.rmtree` 具备 symlink-attack 防护；不确定就跳过并告警。
- injector 在 snapshot cwd 中以 `--context=userprompt` 运行，TMPDIR 也指向 snapshot，且环境不包含 PLAN_ID 或原 workspace metadata。因此 upstream autonomous/gated markers、attestation、nonce、ledger 等不会穿过 snapshot，强制实际行为保持 managed legacy。
- 注入前后不仅文件身份稳定，原 plan directory 的 identity 也在同 fd 上检查并通过 root 重新打开复核；child 完成后再重复，任何目录交换降级为 `plan_state_changed`。
- `_execute` 是 POSIX-only：缺少 `O_DIRECTORY/O_NOFOLLOW/geteuid` 直接返回 runtime_error；Windows 测试只能覆盖 schema/controlled doubles，真实 fd/process boundary 必须 Linux/Cloud。
- 无论成功失败都关闭 fd 并删除 owned snapshot；所有可预期安全失败都返回 exit 0 的 exact non-injecting JSON，让 adapter 决定 canary-only，而不是让 child crash 终止 Hook。

## Owned catch-up runtime — request and transcript selection half

- catch-up 动态加载完整 pinned `session-catchup.py`，并关闭 bytecode 写入；完整 module initialization 属于 trusted surface，但 owned wrapper 后续只应进入 contract allowlisted helper closure。
- request 再次 exact-validate event、已验证 plan project、最多三个 session roots、Host path state/fallback 关系与固定 report budget；disabled/detached project 不能携带 resolved plan，消除 adapter 构造错误或被替换 child 的歧义。
- transcript 上限 16 MB、单 record 1 MB、fallback 最多 256 candidates。POSIX 通过 root-relative `O_NOFOLLOW` 逐组件打开；读取前后以及第二次重开比较 dev/inode/type/size/mtime/ctime/nlink，成功后只把 immutable bytes 放入 `VerifiedTranscript`，解析阶段不再读 mutable path。
- 候选必须名为 `rollout-*.jsonl`，包含有效 `session_meta`，meta 中出现的所有 id/session_id 都要与 Host session 一致，cwd 要经 upstream `same_project_path` 匹配 project，subagent transcript 明确拒绝。
- validated Host path 永远优先。若它能打开但 session identity mismatch 或内容 malformed/unreadable，直接 fail closed，不允许扫描替代；只有普通路径拒绝/缺失且 request 显式允许 fallback 才进入 store scan。
- fallback 将所有已安全冻结候选按 `mtime_ns` 全局倒序，选择第一个同时匹配 identity 与 project 的 transcript；roots 的构造优先级不等于逐 root 选择优先级。
- 已知/未知 transcript record 类型被区分：结构损坏是 hard parse error；未知但结构完整的 record 允许产生 warning，并在后续退化为 event-only conversation，而不是从未知 payload 猜出 partial user/assistant 内容。

## Owned catch-up runtime — normalization and report half

- wrapper 使用 upstream helpers 的职责很窄：`same_project_path` 比较 canonical cwd；`find_last_planning_update` 识别 Claude Write/Edit 或 Codex 成功 `patch_apply_end.changes`；`text_content` 抽取文本；`extract_messages_after` 归一化消息/tool 摘要。它不调用 upstream CLI `main()` 或它自己的 session discovery。
- `last planning update` 是 catch-up 的同步水位线；没有该水位线返回 `no_planning_update`，水位线后没有有效上下文返回 `no_unsynced_context`。所以 report 不是“整个历史摘要”，而是“最后一次 planning 落盘之后的未同步尾部”。
- Codex 同一消息可能同时出现 `response_item` 与 `event_msg`。wrapper 建立 `(role, content, line)` fingerprint，在相邻行精确重复时抑制 event；有 response 但 event 不精确对应时只给 unknown warning，不猜测合并；完全没有 response shape 时才把已知 user/agent event 降级成 conversation。
- user 内容超过 1000 字符采用 350 head + marker + 650 tail；assistant 截 300，工具每消息 4 个，总消息取最后 15 个，总 report 20k。超过总预算不是截成可能失真的 partial report，而是 `output_budget_exceeded`、不注入。
- 执行状态顺序是 planning enabled → attached → SessionStart → resolved plan → transcript selection → full bounded parse → last planning update → normalization → bounded render。任一步未满足均返回 exact non-injecting outcome。
- `--diagnostic` 会把原本可注入的 report 改写成 `diagnostic_report_available` 并清空 report；它允许运维确认结果但不会意外向 Host 注入内容。
- upstream helper 本身兼容 Claude/Codex 多种 transcript shape；owned wrapper 通过 verified immutable bytes、known-record gate 和 owned renderer 收窄了它的宽松 CLI 行为，这就是“复用 parser helper closure，而不是执行上游命令”的实际含义。

## Pristine resolver/injector integration

- upstream resolver 自身的真实 precedence 是 `PLAN_ID` → `.planning/.active_plan` → newest scoped mtime → empty stdout/legacy root；它对 slug、BOM、Windows slash/8.3 spelling、portable canonicalization 与 mtime fallback 做了广泛兼容。
- resolver containment 在 canonicalization 全部不可用时 fail closed；这比 injector 的 legacy compatibility 行为更严格。owned-plan 仍会对 resolver 输出再次施加 absolute/scoped shape/containment/fd checks，因此 production 不把 shell portability 结果直接当可信路径。
- pristine injector 内含一套独立 resolution、attestation、mode、smart extraction 与 ledger 分支，这是上游完整功能而不是当前 Cloud adapter 的平行 production authority。当前 managed runtime 总是在只含 root `task_plan.md`/optional `progress.md` 的 snapshot cwd 中调用它。
- snapshot 没有 `.planning`、`.active_plan`、`.mode`、`.attestation`、`.nonce` 或 ledger，因此 injector 自己必然落到 root legacy plan，MODE/ATTEST 为空；upstream 的 autonomous/gated/smart/attestation 分支在当前 production 数据投影下不可达。
- upstream injector 的 containment 在“两个 canonicalizer 都不可用”时为了旧版 byte compatibility 会 fail open；这不成为当前 production 弱点，因为 owned-plan 在进入 snapshot 前已经做 POSIX fd/no-follow/identity 验证，snapshot 又由 owned runtime 创建并限制为 0700/0600。

## Upstream opt-in tail and current reachability

- injector 的 legacy 输出正是当前 production 使用的字节形状：固定警示 → plan 前 50 行 → recent progress 后 20 行（时间归一化）→ findings 提示。owned-plan 再施加 20k 总 context 上限。
- autonomous/gated 分支要求 attestation；gated 即使 SHA cache 命中也强制 re-hash，nonce 仅作为 delimiter，源码明确承认真正的信任来自 attestation 而非 nonce secrecy。
- `ledger-summary.sh` 只由 injector 的 autonomous/gated progress 分支调用；它复用 resolver，输出 phase 计数、首个 in-progress heading、ledger entry 数和每 agent 最后 event。当前 snapshot 不复制 `.mode`/ledger，所以它在 managed legacy 路径不可达。
- 但 `ledger-summary.sh` 是 pristine injector 的真实条件依赖，不是孤立文件；Phase 4 roadmap 又候选启用 attestation/nonce/opt-in v3 modes。删除它会改变 upstream closure、runtime bundle、installed inventory 和 ZIP，并可能在下一 Phase 重新引入，因此当前保留是有逻辑的。
- A1 结论：运行时没有并行算法。Python owned boundary 决定信任、身份、预算和状态机；pinned upstream 只提供 canonical plan selection/rendering 与有限 parser helpers；adapter 只监督与组合。

## Machine-contract topology

- `package.json` 的 0.3.4 只描述当前 source/package identity；是否已发布仍由 immutable tag/assets/acceptance 证明。Release contract 同步冻结 package version，但本地匹配不能单独建立 Release。
- upstream manifest 固定 PWF repository/release/commit/archive URL+SHA、pristine global Skill 必需文件、runtime bundle path+raw SHA、其他 integrity references、importer 与 license/notice。它是“封条/索引”，不再列出 runtime inventory。
- runtime bundle 是唯一 source→package→installed inventory：2 个 local owned runtimes、2 个 installed plan contracts、4 个 pristine upstream files；同时固定路径、mode、hash、dependency graph 与 helper symbol allowlist。
- 四个 upstream entry 强制 `origin=upstream_pristine`、`managed_sha256 == pristine_sha256`、`overlay_ids=[]`；这表明当前没有 transformation/overlay。`owned_catchup.allowed_symbols` 把动态模块调用面冻结为四个 helper。
- 四个 JSON schemas 与 Python 手写 validator 是“双重角色”：schemas 给 source/ZIP 提供 machine-readable ABI 与关系约束，运行时为避免额外依赖使用手写 exact validator。只有两份 plan schemas 被安装；catch-up schemas 仅留 source/ZIP，这是当前已知但尚未决策的安装不对称。
- Release artifact 精确列出 21 个 ZIP entries，排除 `.git/.planning/docs/tests/upstream archive dir`；external bootstrap 明确在 ZIP 外，因为它负责下载并验证 ZIP。ZIP 包含 builder/importer，保证解压后可自检，但这些维护工具不进入 installed trusted graph。
- 三层列表名称相似但不能合并：bundle 决定“可安装什么”；Release entries 决定“整个 ZIP 装什么”；installed manifest（稍后由 installer 生成）决定“现场收到了什么”。

## Import plane

- importer 的第一条信任链是 manifest path → exact managed-runtime integrity block → bundle relative path，无 symlink traversal → raw bundle SHA；只有原始字节 hash 匹配后才 JSON parse/strict schema。`--bundle` 不能绕过 manifest，override 必须解析到同一 anchored file。
- bundle validator 对顶层/upstream/三类 entry 使用 exact keys，检查 safe POSIX relative paths、唯一 id/package/installed path、固定 mode/origin、hash shape、无 overlay、dependency target/allowed symbols 与 source/package/installed root containment；它验证整个 bundle，不因 importer 只投影 upstream files 就忽略 local/contracts 分区的非法结构。
- manifest 与 bundle 再交叉核对 repository/release/commit/archive URL+SHA 与 license SHA；这是 provenance integrity edge，不是第二份 runtime inventory。
- archive 先按 bundle 固定 SHA 校验完整原始 ZIP，再拒绝 unsafe path/symlink，要求所有 allowlisted source 与 license 恰好各出现一次且共享唯一顶层目录；然后逐文件核对 pristine/managed SHA。
- import 只写四个 upstream 成品：若 destination 已存在就只允许 exact inventory/hash/mode；不存在时用 sibling staging、exclusive file create、fsync、chmod、atomic replace，最后重新 check。未知文件/目录、symlink、hash/mode drift 全部 fail closed。
- importer 是 source reconstruction/audit plane，不检查或安装 local owned runtimes，也不进入 Managed policy。它会完整验证 bundle 对这些分区的结构，但实际写集合严格是 `files` upstream projection。

## Installer — package verification and policy merge half

- installer 在 module load 时就走与 importer 对称的 manifest → raw bundle SHA → fatal UTF-8 JSON → exact full-bundle validator → provenance cross-check；package contract drift 会在任何 install/doctor 操作前阻断。
- installed source projection由 adapter + bundle local files + bundle upstream files + bundle installed contracts + notice 组成。除 adapter 的 expected hash取当前 package bytes 外，其余都由 bundle/manifest hash固定；每个 source path逐段拒绝 symlink、要求 regular file，所有 id/path唯一且 source hash匹配后才可写。
- global PWF Skill 只在 approved candidates 中定位，并按 manifest `required_skill_files` 校验 pristine hash；installer 不从它复制/执行 runtime，global Skill 是独立 prerequisite/reference。
- `atomicWrite` 以 sibling temp + rename 写入，写前可对 shared file 重新比较 dev/inode/size/mtime/ctime/hash，写后再核对 bytes 并 chmod；这是针对 requirements/manifest 并发漂移的 optimistic concurrency gate。
- Managed TOML 不是简单字符串 append：installer 解析 header/owned region，要求唯一 marker、固定四段 header 顺序、exact keys、command identity；无 marker 却含 owned adapter 的 legacy/ambiguous state直接 blocker，不会吸收为己有。
- 合并会保留第三方文本，确保 `[features].hooks=true`，并要求已有 `hooks.managed_dir` 必须包含 adapter；Managed policy 只注册 `/usr/bin/python3 <absolute adapter> <event>`，SessionStart matcher固定四个 source，两个 handler timeout 均为30秒。
- 安装锁是 `$CODEX_HOME/.pwf-codex-cloud-hooks.lock` 的独占目录；锁与 shared-state fingerprint 共同区分同工具并发和外部管理员并发修改。

## Installer — state machine, doctor and repair half

- installed-manifest schema v3 记录 owner/installer version、完整 upstream manifest 快照、skill root、adapter hash、runtime inventory snapshot、requirements full hash、去除 owned region 后的 unowned hash与 events。它是现场收货单和 ownership evidence。
- doctor 同时检查 manifest identity/source一致性、requirements owned/unowned hash、features/managed_dir/handler唯一性、runtime exact files/directories/symlink/hash/mode；它不只比较 manifest，也重新从当前 package contract推导 expected state。
- drift 分类的关键是“是否有可证明 owner”：manifest/owner/schema/upstream/unowned requirements/unknown runtime/symlink 等是 blocker；在健康 manifest 保护下，owned requirements 或已知 runtime file hash/mode/missing 通常 repairable。
- install 在锁内按顺序 capture shared state → 生成 proposed TOML → 拒绝 unknown runtime → backup → 再核 shared state → 写 runtime → 原子写 requirements → 最后写 manifest → doctor。失败不会把未知现场静默声明为 owned。
- repair 首先要求 `repairable=true`，再从当前 TOML 去掉 owned region并重建；重建后的完整 requirements hash必须等于 manifest 记录值，才允许备份和重写 runtime/owned policy。它不会吸收 unowned drift，也不改 manifest 来迎合现场。
- doctor 本身只读，但在读取前后 fingerprint shared requirements/manifest；并发变化会进入 blockers，而不是返回一次自相矛盾的健康快照。
- uninstall 在锁内先备份，精确删除 owned TOML region，然后移除 installer-owned runtime directory；不会删除 global Skill。远端/Release/Cloud 不属于 installer 状态机。
- A2 到此形成两条互补路径：importer 证明“repository upstream 成品来自哪里且 pristine”，installer 证明“package 中受控成品如何成为 managed现场”，二者共同消费同一个经 raw SHA 验证的 bundle，但职责不交叉。

## Release builder and external bootstrap

- builder 按 Release contract 的 entry paths 做 UTF-8 字节序排序，固定 archive root、1980 timestamp、deflate level 9、regular-file mode，并把 source bytes逐字装入 sibling temp ZIP后 atomic replace；`check` 同时比较 inventory/order/metadata/mode/content并输出 SHA/size。
- executable mode 当前由 builder 内 `EXECUTABLE_PATHS` 第二份集合决定，而不是 Release entry 自带 mode；contract-v2 若要收敛 authority，应把 mode 迁入 entry并让 builder严格消费。这是路线候选，不是本轮修改授权。
- builder 实际消费 schema/version、package identity、ordering/timestamp/compression、entry state/path、external path与excluded prefixes；`contract_id`、entry origin、external reason、checksum workflow 等主要由 tests/文档治理冻结，未直接驱动 builder。
- bootstrap 是 ZIP 外的独立信任根：固定/可 override 的 PWF archive、PowerShell deb、Hook ZIP 都先下载到 mktemp并校 SHA；Hook ZIP 当前 pin到 immutable v0.3.4 Release URL与真实 SHA。
- global Skill 替换是 bounded transaction：安全 destination、archive subtree/无 symlink/关键 pristine hashes、stage验证、旧目录 backup、失败 trap恢复。它不在 Skill 内打 patch。
- Hook 安装顺序是 download+ZIP SHA → extract → installer dry-run → install → doctor → filesystem/TOML/Codex feature/canary protocol验证；真实 Fresh/UserPrompt/Resume 仍需下一新 task/live Cloud 黑盒，因为 setup shell 内的直接 adapter调用不能模拟 Host lifecycle。
- bootstrap 同时承担环境准备（Debian/amd64/root、PowerShell、Node>=18）与产品安装；这属于带日期 Cloud运行事实。adapter/runtime本身仍优先显式 CODEX_HOME/session roots，不把 `/opt/codex` 提升为永久 Host ABI。
- A2 结论：供应链是 `pinned upstream archive -> pristine repository projection -> exact Release ZIP -> checksummed external bootstrap -> verified installed snapshot -> adapter-only Managed policy`，每个箭头都有独立 hash/inventory/ownership gate。

## Test map — executable boundaries

- 运行时测试按层次分开：`hook-adapter` 测 Host/plan authority与 canary-only；`runtime-supervisor` 测 typed seam/预算/process group/sibling identity；`owned-plan` 测真实 Linux fd/snapshot/race/cleanup；`owned-runtime` 测 transcript身份/fallback/partial-injection；`activation` 测三组件组合顺序与跨用户真实执行。
- supply-chain/install 测试也不是重复：`contracts` 冻结 authority关系；`import-runtime` 对恶意 bundle/archive/destination；`installer` 对恶意 package/现场/TOML/并发/repair/backup；`release-package` 对 candidate ZIP；`published-release-oracles` 对有 refs 的已发布两席；`bootstrap` 对外部下载/toolchain/Skill replacement。
- compatibility 证据由 `golden-output`、`cloud-fixtures`、`pristine-catchup-boundary` 补齐：分别保护最终文案字节、Cloud-shaped replay、managed wrapper与 pristine helper closure等价/不可达面。
- repository/architecture tests 保护 trusted source exact set、Release exclusion、planning/docs lifecycle、文档authority/稳定锚点与 test-module反向地图；其中既有高价值结构断言，也有上一审计识别的 prose/test-title 过拟合，后者是兼容清理候选而非 runtime问题。
- Windows 当前会诚实跳过真实 Linux openat/process-group/cross-user cases；其余 schema、controlled child、transcript与静态供应链测试仍可执行。Windows全绿不能替代 Linux/Cloud gate。
- test titles 与实现逐项对齐，没有发现“存在某安全代码但完全无边界测试”的主路径；尤其 plan race、transcript path replacement、TOML concurrent rename、bundle non-projection sections、unknown runtime drift都有专门 case。

## Test map — cross-layer evidence details

- activation fixture显式放置一个若被执行就写 marker 的 global Skill catch-up，并断言 marker不存在；同时捕获 plan/catch-up request与执行顺序。这直接证明 production trusted graph从 installed sibling出发，不从 global Skill执行。
- activation 同时有 controlled failure matrix（plan failure不启动catch-up；catch-up failure保留plan）和真实 owned runtimes的 Resume transcript集成；Linux root及 synthetic uid/gid split验证 installed mode/跨用户执行假设。
- golden fixture固定 6 个 managed-legacy composition场景与 2 个 canonical-plan场景；它不验证文件安全，而是保护“canary/catch-up/plan最终字节与 legacy选择结果不漂移”。
- Cloud fixture冻结 setup/agent/managed Hook各阶段看到的字段与一个真实 wrapper transcript尾部，断言 Host path和fallback生成相同report、消息数、去重、工具上限、head/tail截断与 sentinel保留；它是 live Cloud之前的可重放证据，不冒充live gate。
- pristine boundary一边执行 managed package copy、一边执行测试fixture中的 pristine copy，要求 host/fallback/malformed三类 envelope等价；另一边通过AST冻结四个 helper roots、传递闭包、仅 `configure_utf8_stdio` 顶层调用与 optional `orjson` import，并明确排除 CLI discovery/main。
- contracts test不仅检查 JSON存在，还核对 bundle/manifest hashes、source package bytes、四文件 exact inventory、Phase 4 source denied list、无 overlay/旧 metadata、dependency closure、installed contract set与 21-entry ZIP边界。

## Architecture evolution and forward route

- v0.1 的失败点不是 plan/catch-up功能，而是 Cloud trust/registration：legacy `hooks.json/config.toml` 无法落地，adapter还直接执行可变 global Skill并自己承担 plan算法。
- v0.2 先证明 `/etc/codex/requirements.toml` system-managed、absolute adapter可行；v0.2.1 加 ownership/doctor/repair；v0.2.2 达成完整功能黑盒，但仍靠现场 patch/global Skill执行，是行为基线而非当前安全架构。
- Phase 1/v0.3 alpha.1 先建立 pinned provenance、bundle、deterministic package与 inactive installed inventory；Phase 2切换catch-up到 owned sibling；Phase 3再把 plan authority迁到 owned-plan，删除 adapter平行算法。这个顺序是“先证明来源和可回滚安装，再逐条切 production path”。
- v0.3 stable之后的路线是收敛而非扩功能：successor authority cutover；3.6退休不可达 overlay并恢复四文件 pristine；3.7删除无 consumer programme metadata；3.8选择 bundle为唯一 inventory authority；v0.3.4完成双通道Cloud、immutable publication与Latest promotion。
- 当前代码因此处于一个稳定收口点：只有两个 Hook、legacy默认、PWF v3.8.2、single adapter entry、两个 owned siblings，没有 Phase 4 source/ABI/dispatch。
- 下一低风险兼容清理应是 previous audit已冻结的 notice/history/test-title/prose-lock修正；它们不改变算法，但notice/Release输入变化仍需新版本正常 seal/Cloud gate。
- 下一独立 contract/Release gate候选：去掉 bundle中的 overlay-era tombstones、manifest无 consumer字段并补顶层 exact schema、把 ZIP mode纳入 Release entries、处理 machine metadata“严格消费或迁出”。这些会旋转 hashes/contracts/Release identity，不能夹带在文档清理。
- installed plan schema与source-only catch-up schema的不对称应留给 Phase 4 Discovery统一决定；现在删除可能在引入attestation/nonce/opt-in v3 ABI时再加回来。
- programme长期顺序仍是 Phase 4 attestation/nonce/opt-in v3 modes → Phase 5 compaction lifecycle → Phase 6 selective tool/permission hooks → Phase 7 advisory completion → Phase 8 optional hard gating。每一阶段必须重新Discovery，legacy默认和rollback先行，当前没有任何实施授权。

## Verification evidence

- `python tools/import_upstream_runtime.py check`：healthy；四个 upstream destination hashes 与 bundle完全一致。
- `npm test`：沙箱内 test-file worker统一 `spawn EPERM`，确认是执行环境限制；沙箱外完整重跑为 126 tests / 114 pass / 0 fail / 12 Windows POSIX/Linux-only SKIP。
- 12 个 SKIP 正好落在真实 owned-plan openat/snapshot/race/process cleanup、symlink/hard-link transcript、cross-user activation/permissions 与 POSIX process-group timeout；没有被计入 PASS，也不替代 Linux/Cloud evidence。
- 三个 production Python 文件 compile、`node --check install.js`、外部 `bash -n init-cloud-sandbox-v0.3.4.bash` 与 `git diff --check` 均通过。

## Final conclusion

- 当前树的核心质量不在“代码短”，而在每一层 authority单一且失败可组合：adapter薄、plan/catch-up各自拥有数据边界、bundle拥有inventory、installer拥有现场、Release contract拥有ZIP。
- 没有发现第二套production dispatch、global Skill执行回流、overlay/patcher复活或未授权 Phase 4 source准入。
- 当前最值得继续的不是重写 runtime，而是按风险分三条支线：兼容版修正低风险残留；独立 contract-v2收敛无consumer metadata/mode authority；新 Product Phase必须重新Discovery。
