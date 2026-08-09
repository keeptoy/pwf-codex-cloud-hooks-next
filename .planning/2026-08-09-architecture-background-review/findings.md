# Findings: Architecture Background Review

## Initial System Model

- 本仓库只正式支持 `OthmanAdi/planning-with-files v3.8.2`，是垂直 Cloud adapter，不是通用 Skill
  转换器。
- global PWF Skill 必须保持 pristine；production 只执行由固定 archive、hash、machine contract、
  installer manifest 共同约束的 repository-owned / installed managed runtime。
- Managed policy 只注册绝对路径 `hook_adapter.py`；`owned-plan.py`、`owned-catchup.py` 和 upstream
  scripts 都是 adapter siblings，不是独立 Host handlers。
- 两个受支持事件均先执行 plan；`SessionStart` 仅在 plan exact-v1 result 完整验证后才把六字段 project
  交给 catch-up。组合顺序为 canary、可选 catch-up、可选 plan。
- integrity、schema、身份、路径和内容注入 fail closed；单个 advisory child failure 对 Codex 主循环
  fail open。plan 失败降级为 canary-only，catch-up 失败保留 canary 与健康 plan。
- source rebuild 与 production execution 是两条路径：importer/patcher 确定性生成 owned upstream；
  Release ZIP 携带成品；installer 校验后复制；运行时不现场 patch global Skill。
- 当前列车为 `0.3.2-dev` 文档治理，已接受版本为 `v0.3.1`；Product Phase 4、seal、publication、Cloud
  和 rollback 晋级均未授权。

## Documentation Authority

- README：稳定行为、安装/doctor/repair、开发与打包入口。
- ARCHITECTURE：设计理由、跨组件数据流、信任边界和失败语义。
- DESIGN：仓库模块、实现落位、变更影响和验证路由。
- ROADMAP：programme、版本列车、Cloud/Release/rollback lifecycle。
- 活动 planning：当前 Next Step、授权、禁止事项、研究与执行证据。
- Machine contracts：字段、hash、inventory、Host ABI 的 gate 内权威。

## Repository and Contract Shape

- 仓库是刻意收窄的 76-path 级项目：一个 Node installer、三个本地 Python production entrypoints、四个
  upstream owned scripts、七个 machine contracts、两个 supply-chain tools、一个 patcher，以及按边界
  拆分的 Node test suite；没有应用层业务模块或通用插件注册框架。
- package/source identity 是 `0.3.2-dev`；Release contract 精确 allowlist 23 个 ZIP entries，并显式排除
  `.planning/`、`docs/`、`tests/`。bootstrap 是 ZIP 外部资产，因为它必须校验 ZIP，不能被自身验证。
- plan request/result 是 exact-v1、`additionalProperties=false` 的双向 contract：behavior 固定
  `managed_legacy`，context 20,000 chars，plan/progress 50/20 行。只有 `context_emitted` 可令
  `inject=true`，其余 outcome 必须 `context=null`。
- catch-up request 把 plan runtime 已验证的 project 状态作为输入，并把 Host transcript 的验证状态、
  有序 fallback roots 与明确 scan 开关结构化；report 同样限定 20,000 chars，只有 `report_emitted`
  可以注入。
- runtime bundle 固定 installed paths、mode、hash、直接文件依赖与 Host dependencies；deferred candidates
  明确把 attestation/ledger/phase mutation/Stop 等留在未来 Phase，不能从上游存在推断为当前能力。
- upstream manifest 固定 v3.8.2 archive commit/SHA 与每个 owned byte；只有 `session-catchup.py` 应用四项
  有序 overlay，其他三份 upstream script 必须与 pristine SHA 相同。
- catch-up request 的关系约束很严格：`SessionStart` 要求 source 且 `turn_id=null`，`UserPromptSubmit`
  要求 `source=null` 且有 turn ID；planning disabled、detached 或 `plan_state=none` 会强制 plan scope/dir
  清空；validated Host path 与允许 scan 都要求提供至少一个受控 session-store root。
- runtime bundle 说明 installed runtime 只携带两个 plan contracts；catch-up 的 request/result schemas 由
  adapter/owned runtime 的 repository/integrity graph 使用，但 installed inventory 不是“把 contracts 目录
  整体复制过去”。这是 source layout 与 installed layout 不可互换的一个具体例子。

## Production Source Topology

- 核心实现规模集中在 adapter（664 行）、owned plan（928）、owned catch-up（735）和 installer（728）；
  supply-chain 层由 importer（338）、patcher（249）和 deterministic builder（174）组成。
- adapter 的函数边界与 ARCHITECTURE 一致：Host payload/root/contained path、两类 typed request/result、
  bounded process supervision、两个 sibling invocation、最终 context composition；没有 plan-file reader。
- plan runtime 明确独占 request validation、session attachment、canonical plan resolution、安全文件读取、
  private snapshot、stale cleanup、child process group 与 context 生成。
- catch-up runtime 明确独占 transcript containment/open-no-follow、session/project identity、fallback candidate、
  bounded record parsing/dedup/normalization/report rendering。
- installer 将 source inventory、shared TOML merge/ownership、lock/backup/manifest、inspection/drift、install/
  repair/doctor/uninstall 分成独立函数，说明治理面不是简单 copy script。
- importer、patcher、builder 各自是清晰的 build-time plane；production entrypoints 不依赖 builder 或 patcher。

## Adapter Mechanics

- adapter 对 Host stdin 设置 1 MB 上限；解析失败也返回 exit 0 和 canary-only 的合法 Hook JSON，体现
  advisory integration 对 Codex loop 的 fail-open。
- child 必须是 adapter 同目录的 regular non-symlink sibling。stdout/stderr/request 各自 bounded，POSIX 下
  child 启动为新 session；overflow、非零退出、无效 UTF-8/JSON、typed result 不合约或 deadline 都触发
  process-group kill/丢弃，而不是透传 partial output。
- plan validator 不只检查 schema 形状，还检查 result.root/planning_enabled/event 与 request 相等、scope/dir
  的 containment 形状、diagnostic 与 project 一致、outcome/inject/context 状态关系。
- `main()` 的真实控制流是严格串行：先 plan；只有 plan result 完整有效且 `inject=true` 时才保留 plan
  context，并且只有 `SessionStart` 才继续构造 catch-up request。catch-up 失败不会抑制已验证 plan。
- 最终 composition 固定 `canary → catch-up → plan`；总 deadline 27 秒并预留 1 秒 finalization，plan 默认
  child budget 8.5 秒，catch-up 15 秒。异常兜底统一回到 canary-only。
- adapter 从环境只读取受控 `PLAN_ID`/`PLANNING_DISABLED` 和显式 session roots；当 `CODEX_HOME` 缺失时，
  session fallback 只能从已安装 adapter 布局推导，绝不从 `HOME` 猜测。

## Owned Plan Runtime — Validation and Resolution

- runtime 再次独立执行 exact-object/identity/event/path/budget validation；即使 adapter 是 trusted producer，
  child 也不依赖“调用方已经验证过”。失败仍返回结构化 non-injecting result。
- 运行子脚本时环境被缩到固定 PATH/locale 与必要的 temp/PLAN_ID，stdin 关闭，stdout+stderr 总量有界，
  stderr 非空也视为 runtime failure；resolver/injector 都在独立 process group 和子 deadline 中执行。
- planning 文件读取基于 Linux `openat`/`O_NOFOLLOW`，要求 regular file、单 hard link、≤1 MB、UTF-8；
  读取前后以及重新 open 后比较 dev/inode/size/time/type/link/uid/gid，区分 unreadable 与 race 导致的
  `plan_state_changed`。
- session attachment 由 `.planning/sessions/*.attached` 安全枚举决定：无 marker 保持 legacy；当前
  `session_id` 命中为 attached；存在其他/不安全 marker 时 detached，从而阻止跨 session 注入。
- canonical selection 仍委托 pristine `resolve-plan-dir.sh`，precedence 由上游脚本掌握；owned wrapper
  负责把输出限定为 root 或 `.planning/<slug>`、拒绝 escape/symlink/non-regular task plan，并把显式
  `PLAN_ID`/active pointer 的回退记录为 warning，而不是在 adapter 再实现一遍选择算法。
- canonical root 本身必须已经是 realpath；plan directory 在读取前后、injector 返回后都会重新按目录
  identity 校验，避免“安全读取后目录被换掉”的 TOCTOU。
- injector 从不在 workspace 原目录执行：runtime 创建 owner-only 0700 temp base/snapshot，以 O_EXCL/
  O_NOFOLLOW 写 0600 `task_plan.md`/可选 `progress.md`，再让 pristine injector 只读该快照；最终无论成功
  失败都只清理自己命名且位于受信 base 的 snapshot。
- stale cleanup 是保守的 advisory：只检查有限条目/0.5 秒，且仅删除足够旧、owner/mode/内容精确安全的
  snapshot；不确定则 warning 并跳过，不会扩大删除范围。

## Owned Catch-up Runtime — Input Boundary

- catch-up 通过固定 sibling 路径动态加载 owned upstream parser，并禁止生成 `__pycache__`，保持 installed
  inventory fail closed。
- request validation 再次冻结 event/project/transcript/budget 的 exact 关系；它支持 schema 中两种 event，
  但 adapter 当前只在 `SessionStart` 调用，所以 `UserPromptSubmit` 是 contract seam 而非当前 dispatch。
- transcript 总字节上限 16 MB、单 record 1 MB、fallback candidates 256；Host path 必须已有 adapter 标记
  `validated` 且仍落在明确的最多三个 root 中，scan 只有显式开关与 roots 同时存在才允许。
- transcript 文件使用 root-relative no-follow open、single-link regular-file 检查、读前后/再次 open identity
  比对，并把 bytes 与 identity 一起冻结为 `VerifiedTranscript`；后续解析不再从 mutable path 重读。
- Host path 选择优先级具有安全含义：session identity mismatch 或 malformed/unreadable 立即 fail closed，不
  扫描别的文件掩盖问题；只有 path 被拒绝/缺失且明确允许 fallback 时，才在受控 roots 内最多考察 256
  个 `rollout-*.jsonl`，再按 mtime 选择匹配 session+project 的候选。
- `session_meta` 同时校验 session ID、project cwd，并拒绝 subagent source。未知 record 只告警且可退化为
  event-only conversation；invalid UTF-8/JSON/shape/oversize 则整份 transcript 不产出 report，杜绝 partial
  injection。
- 消息归一化复用 owned upstream 的 planning-update/message parser，额外吸收 Cloud `event_msg`，并用
  相邻 response fingerprints 去重；当 response records 已存在却出现不对应 event 时只告警，不把来源
  不清的内容重复注入。
- report 只取最后 15 条；assistant 300 chars、每条最多 4 个 tools，长 user 保留 350 head + 650 tail，
  总 report 仍需≤20,000 chars。只有找到了 planning update 且确有 unsynced messages 才 `report_emitted`。

## Installer Ownership Model — First Half

- installer 首先从 `upstream-manifest.json` 动态构造精确 installed inventory，并在任何复制前核对每个
  source hash/path/mode；adapter、两个 owned runtimes、四个 upstream scripts、两个 installed plan contracts、
  overlay ledger 与 notices 是显式 owned 集合，未知路径不会自动被吸收。
- global Skill discovery 仅在三个批准位置或显式 `--skill-root` 中查找，并逐个核对 pristine required files；
  installer 的注释和行为都确认它不 patch、也不执行该全局 Skill。
- 所有 shared state 都先做 read-before/read-after fingerprint；atomic replace 前再比较，写后再 hash，能把
  并发管理员漂移与普通安装失败区分开。lock 是 `$CODEX_HOME` 下的专有目录，codex home 不能是根目录。
- Managed requirements 不是用宽松字符串替换：installer 解析 ownership marker/精确 TOML header 顺序、
  key 集和 command identity。marker/legacy region 只要歧义就 `BLOCKED_AMBIGUOUS_MANAGED_REQUIREMENTS`，
  不删除猜测范围。
- policy merge 保留 unowned TOML，确保 `features.hooks=true`，并要求已有 `hooks.managed_dir` 必须包含
  adapter；否则不会抢占第三方 managed directory。两个 handler 都使用 `/usr/bin/python3` + absolute
  adapter path，并同时维护 hooks.json 与 trusted hash state。
- doctor 把 manifest identity、upstream、skill root、requirements 路径/hash、event set、完整 runtime
  inventory/hash/mode/unknown entries 一起审计；任何 symlink、非预期文件/目录、manifest/unowned policy
  漂移都是 blocker。只有 manifest 已建立且错误完全属于 owned bytes/owned requirement region 时才
  `repairable=true`。
- repair 不是“重装覆盖”：它必须从当前 unowned policy 重建 owned region，并证明结果 hash 与 manifest
  记录完全一致，随后 backup、再次并发 fingerprint、重写 owned runtime/policy、再 doctor。unknown drift
  直接 `REPAIR_BLOCKED_UNKNOWN_DRIFT`。
- install 在任何写入前验证 runtime 可安全接管并备份 shared state；uninstall 同样先备份，只移除精确 owned
  requirements/legacy hooks/trust entries 与 owned runtime directory。三条 mutation path 都通过同一 lock。

## Deterministic Import Plane

- importer 先校验 runtime bundle 与 overlay ledger 的 schema、safe relative paths、mode/hash、唯一 ID/path、
  overlay exact order/target，并动态加载 patcher 核对 patch ID、四个 anchor constants 及其 SHA。
- pinned ZIP 必须整体 SHA 匹配、无 symlink、所有 allowlisted members 在唯一单层 archive root 下各出现一次；
  license 和每份 pristine source 再逐项 hash。只有 ledger 指定 target 被 patcher 转换，产物还需 managed
  SHA 匹配。
- 已存在 `runtime/upstream` 时 importer 只做 exact inventory/hash/mode check，不覆盖；首次 import 使用同级
  exclusive staging、fsync、chmod、atomic replace，并只清理自己可证明的 staging path。
- patcher 是 build/audit 工具，不是 production runtime。它按固定顺序替换四个 exact source anchors，每个
  anchor 必须恰好出现一次，并同时验证 pristine/patched SHA；虽然 CLI 保留对显式 Skill root 的 apply/check，
  正常 importer 只调用纯 `transform_source` 生成 repository-owned copy，installer 仍要求 global Skill pristine。
- Release builder 把 package name/version 与 contract 绑定，按 UTF-8 path 字节排序、固定 1980 timestamp、
  deflate level 9、显式 0755/0644 mode 和单 archive root 写 ZIP；source 必须 non-symlink regular file。
- build 使用 exclusive temp + atomic replace；check 要求 inventory 顺序、metadata、mode 以及每个 entry bytes
  都与当前 allowlisted source 精确相同。外部 bootstrap 与 excluded prefixes 在 contract load 时即被拒绝
  进入 ZIP，而不是靠发布人员记忆。

## Historical Architecture Context

- 当前 successor 不是从零重写：它从旧仓库 `v0.3.0-beta.2` exact mirror 出发，经 parentless slim
  transformation、Cloud equivalence 和 authority cutover 建立；旧的 planning/Phase 原型被刻意留在历史
  refs，不继续污染当前 trusted graph。
- `v0.3.0` 建立 successor 的首个 stable contract-driven ZIP/bootstrap 与 Cloud acceptance；`v0.3.1`
  只做同一 0.3 行为合同内的兼容/供应链修复，关键变化是 bootstrap 的 Node/pristine-source 检查和把
  importer 的直接 patcher 依赖纳入 ZIP，production runtime/activation graph 未变。
- `0.3.2-dev` 只切换 development source/package/Release-contract identity 并治理文档真理源；当前代码
  仍以已验收的 0.3 runtime/Host ABI/trusted graph 为基线。出现新版本字符串绝不等于 Release。
- provenance 把来源链明确串成：pinned archive/license → bundle/overlay → importer/patcher → exact owned
  bytes → upstream manifest → installer/doctor → Release allowlist/ZIP → external checksum bootstrap → version
  acceptance。任一字节或 contract 变化都必须产生新 identity 与新证据。

## Maintainer and Test Safety Net

- handoff 的核心心智模型是：先保护现场，再按 authority 找答案，再从活动 plan 判授权；任何 unknown dirty
  state、authority 冲突、Host ABI/trusted graph/timeout/权限/进程/数据边界变化都应停止实施。
- 测试不是单层单元测试，而是由 schema/contract、adapter seam、real runtime、activation composition、
  Cloud-shaped fixture、installer drift、supply-chain reproducibility、repository governance 与 immutable
  published oracle 组成的多层证据网。
- 安全敏感的 Linux-only cases 明确覆盖 cross-user permissions、openat linked/race inputs、process groups 与
  real runtime activation；Windows suite 会诚实 skip 这些，不能据本地全绿推断 Linux/Cloud gate 完成。
- test titles 与 DESIGN 反向索引彼此一致：adapter thin/plan authority、transcript immutable snapshot、repair
  owned-only、import exact inventory、bootstrap global-Skill-pristine、historical source/tag oracle 都有直接回归。
- activation tests 不仅检查文本结果，还捕获两个 child 的 exact requests、写入执行顺序日志，并放置恶意
  global-Skill marker 证明它从未执行；Linux case 再用真实 owned runtimes 覆盖 root/root 与 synthetic
  install-user/Hook-user 分离。
- contract test 是跨文件关系测试：bundle、overlay ledger、patcher anchors、upstream manifest、repository
  bytes、installed contracts、Host schemas 与 23-entry artifact contract 必须同时一致。这解释了为什么修改
  任一 JSON 或 runtime byte 不能局部“修到测试绿”而不更新整条 integrity graph。
- dated Cloud fixture 冻结的是 2026-08-02 观测，而非永久 Host contract：setup 入口无 `CODEX_HOME`，
  agent/managed Hook 有 `/opt/codex`；`CODEX_THREAD_ID` 缺失；SessionStart 有 source 无 turn，prompt event
  有 prompt/turn 无 source。adapter contract 有意不把 prompt/transcript 内容传给 plan child。
- Cloud-shaped test 证明 upstream overlay 在 `CODEX_HOME` 与显式 session store 两条路径输出一致，并冻结
  structured planning update、7 条 unsynced message、tool count、duplicate suppression 和长 wrapper tail sentinel。
- golden tests 同时保存旧 managed-legacy composition oracle 与新 canonical plan oracle，覆盖 no-plan、active
  pointer、newest scoped、legacy root、UserPrompt 和 SessionStart catch-up-before-plan；因此“内部执行 plan first”
  与“输出顺序 catch-up before plan”都被明确冻结。

## Upstream Code Admission vs Activation

- pristine resolver 明确实现 `PLAN_ID → .active_plan → newest scoped by mtime → legacy root`，带 slug、BOM、
  canonical containment 与跨平台 realpath/mtime fallbacks；owned plan 又在其外增加 POSIX openat/identity
  安全层，所以 selection semantics 复用上游，filesystem trust 不外包给 shell。
- pristine injector 自身包含 legacy、autonomous/gated、attestation、nonce、smart injection、pretool/precompact
  等大量上游能力；但 production owned-plan 只把 task/progress 写入 private snapshot，固定
  `behavior_profile=managed_legacy`，不复制 `.mode/.attestation/.nonce`，也不传 `PWF_INJECT`。因此这些 v3
  分支在当前 trusted graph 中结构性不可达，`ledger-summary.sh` 虽被固定/安装也不代表已激活。
- owned catch-up 导入整份 patched upstream module，但只复用 `same_project_path`、planning-update、message
  extraction/text helpers；Host path/fallback/identity/immutable parsing/report rendering 都由 owned wrapper
  接管，未调用 upstream CLI `main()`。四项 overlay 仍是精确来源与 legacy compatibility contract，不能
  因文件内存在 patched main 路径就推断 production 正在走它。
- 这正是本项目最重要的区分：**代码存在**、**被 importer 纳入**、**被 installer 安装**、**被 Managed
  policy 注册**、**在当前 dispatch 可达**是五个不同层级。

## Read-only Consistency Evidence

- `python tools/import_upstream_runtime.py check` 当前 PASS：四个 `runtime/upstream/*` inventory/hash 与
  contract 精确一致；其中 session-catchup 为 managed overlay SHA，其余三份为 pristine SHA。
- focused activation/contracts/Cloud tests 在受控重跑后 PASS：8 tests / 6 pass / 2 honest Linux skips /
  0 fail。Windows 结果证明静态关系、composition 与 Cloud fixture replay，不替代两个 real-runtime Linux
  activation cases。

## Final Architecture Model

1. **Provenance plane：** pinned upstream/archive/license、runtime bundle、overlay ledger 与 manifest 把
   “允许哪些源码字节”冻结下来。
2. **Build plane：** importer + patcher 只生成 repository-owned upstream copy；Release builder 再从精确
   allowlist 生成 deterministic ZIP。bootstrap 永远在 ZIP 外。
3. **Install/control plane：** installer 验证 pristine global Skill 与 packaged bytes，管理 absolute adapter、
   installed inventory/manifest、shared policy ownership、doctor/repair/uninstall；未知状态 fail closed。
4. **Runtime plane：** Managed policy 只启动 adapter；adapter 监督 plan-first/catch-up-second typed siblings；
   plan 是唯一 planning authority，catch-up 只消费 plan result 中已验证 project。
5. **Data plane：** workspace plan 与 Host transcript 都是不可信可变数据；前者变成 0700/0600 snapshot，
   后者变成 immutable verified bytes，随后才进入 pristine/owned parsing logic。
6. **Evidence plane：** schema/contract、unit boundary、seam、activation、Cloud fixture、installer/supply-chain、
   deterministic package 和 immutable release oracle 共同证明各层，单个 PASS 不产生 gate 授权。

## Risk Map for Future Changes

- 改 adapter event/dispatch/composition：同时触碰两组 request/result contracts、supervisor 与 activation seam；
  容易改变 Host ABI 或 advisory failure semantics。
- 改 plan selection/read/injection：必须保持 adapter-thin、openat/identity/snapshot/cleanup；不能把 workspace
  直接读回 adapter，也不能无意激活上游 v3 modes。
- 改 transcript/catch-up：必须保持 Host-first identity、explicit fallback、immutable bytes、no partial report
  与 output budgets；未知 record 的降级和 malformed record 的拒绝语义不可混淆。
- 改 installer/policy：shared admin state、unknown inventory 与 repair classification 是高风险边界；不能用
  install/repair 静默接管第三方 TOML 或 runtime entries。
- 改 upstream/overlay/Release inputs：会沿 hash graph 传播到 bundle、manifest、tests、ZIP identity 与
  bootstrap；已发布 tag/assets/acceptance 不可重建覆盖。
- 任何 attestation/nonce/compaction/tool/Stop/generalized-driver 工作都属于未来 Discovery/Product Phase，
  不能从现有 upstream code 或 deferred inventory 获得隐含授权。

## A4 Documentation Tuning — Initial Hypotheses

- 整体文档分层已经成熟，不需要再增加新的根级架构文档或复制一份七层总览；README/ARCHITECTURE/
  DESIGN/ROADMAP 的 authority 边界清晰，应以微调为主。
- 首个值得核对的表达缺口是 ARCHITECTURE runtime 图中的“run owned session-catchup.py”：源码实际由
  `owned-catchup.py` 导入少量 upstream parser helpers，而 transcript selection、identity、immutable bytes、
  normalization/report 都由 wrapper 拥有。现有写法可能让维护者误以为 production 调用 upstream CLI main。
- 第二个候选是把“代码存在→被 importer 纳入→被 installer 安装→被 Managed policy 注册→当前 dispatch
  可达”明确为 admission/activation 边界；当前 AGENTS 与“尚未实现”已有规则，但人类架构正文尚未用
  一个短段落把这五层串起来。
- README 已在同一节同时说明执行 plan-first 与最终 composition 顺序，虽首次扫读可能混淆，但邻近解释
  已足够；是否微调应先检查重复预算，不宜新增第二张调用图。
- DESIGN §3 已经区分 repository source、Release ZIP、installed runtime、Managed policy 与 global Skill，
  因此“五层 admission/activation”不是缺少新内容，而是缺少一句明确的推理规则。若补，应放在现有表后
  作为判读原则，而不是再建新表或在 ARCHITECTURE 复制目录布局。
- ROADMAP 的 current lifecycle、未来 Phase 和“上游存在不产生授权”表达完整，本轮没有发现需要同步的
  programme 内容；为架构精度修改 ROADMAP 会制造不必要的多文档联动。
- 搜索确认 MAINTAINER_HANDOFF 已有“存在不等于 importer 接纳/installer 安装/policy 注册/production
  激活”的稳定摘要，并把完整解释指向 ARCHITECTURE；因此真正的小缺口是 ARCHITECTURE 作为 authority
  尚未显式写出这条推理规则，而不是 handoff 缺内容。
- governance tests 已保护 plan-first、adapter-thin、global Skill pristine、Managed policy only-adapter 和
  source/Release/installed 分工，但没有直接保护“admission 不等于 activation”或 catch-up 只复用 parser
  helpers。若实施，适合在现有 architecture contract case 增加最小 assertion，避免今后又写回“run upstream
  main”的模糊表述。

## A4 Candidate Ranking

1. **建议做：ARCHITECTURE 精度补丁。** 在部署/runtime/catch-up 相邻位置用一个短段落明确 admission 与
   reachability 分层；把“run owned session-catchup.py”改成“加载/复用固定 owned parser helpers”；补一句
   verified transcript bytes 在解析期间不再从 mutable path 重读。
2. **建议做：DESIGN 单行同步。** 只把 Catch-up runtime 依赖栏改为“加载 upstream parser helpers，不调用
   upstream CLI main”，保持实现导航与 Architecture 的系统语义一致；不新增章节或表。
3. **建议做：focused governance guard。** 在现有 architecture test 中保护上述两条稳定边界；无需新增
   test module 或运行计数。
4. **建议不做：README 顺序重写。** 当前相邻文字已解释 execution 与 composition；README 是 ZIP 输入，
   为低收益措辞变化触发 package identity 验证不划算。
5. **建议不做：ROADMAP/CHANGELOG/provenance/handoff 扩写。** 这些 authority 已完整，继续复制只会破坏
   truth-source governance；A4 不涉及 lifecycle、版本 delta 或历史证据。

## A4 Implementation Result

- `ARCHITECTURE.md` 现已明确 source/admission/package/install/registration/dispatch reachability 是独立状态，
  前一层不能推导后一层；没有扩大 trusted graph。
- Runtime 图和 Catch-up contract 现与源码一致：owned wrapper 冻结 verified transcript bytes，只复用固定
  `session-catchup.py` parser helpers，不调用 upstream CLI `main()`，也不从 mutable path 重读。
- `DESIGN.md` 只同步 Catch-up runtime 的直接依赖语义；没有新增重复结构或改变文档 authority。
- 现有 architecture governance case 增加了对应 guard，并先 RED 后 GREEN；README、ROADMAP、历史证据、
  production、contracts、package identity、Release 和 Cloud 均无须变更。

## A5 Catch-up Seam Clarification

- 精确实现不是 Python selective import：`_load_upstream()` 通过 `exec_module()` 动态加载完整的 fixed owned
  `session-catchup.py` module；生产路径随后只调用 `same_project_path`、`text_content`、
  `extract_messages_after` 和 `find_last_planning_update`，没有调用 `main()`。
- owned wrapper 拥有 transcript selection、containment/identity revalidation、immutable byte capture、record
  decoding/validation、Cloud event normalization/dedup、output budget 与 report rendering。基础 message
  extraction 复用 upstream helper，但最终 normalization policy 和 report composition 仍由 wrapper 编排。
- DESIGN 的模块表适合作维护入口；在表后增加一个短 seam 段落比继续加长单元格更清晰，也不复制
  ARCHITECTURE 的系统级数据流。
- A5 已按该结构实施：Architecture 图明确 validate/identity-check/freeze，DESIGN 表后完整列出 wrapper
  ownership、whole-module dynamic load 与四个实际 helper；focused guard 先 RED 后 GREEN。

## A6 Publish Preflight

- `tools/import_upstream_runtime.py` 在 contract validation/import 路径动态加载
  `patches/patch_planning_skill.py`，核对 target、patch ID、anchors 和 pristine/managed hashes，并且只对
  overlay ledger 指定的 `session-catchup.py` 调用 `transform_source()`。
- Release contract 同时携带 importer、patcher 和四个已生成 runtime files，是为了自包含重建/审计；其中
  `session-catchup.py` 标为 managed overlay，其他三个标为 pristine。
- `install.js` 消费 `upstream-manifest.json` 的 managed runtime inventory；production runtime 只从安装目录
  调用 sibling owned/upstream files。installer、adapter 与 owned runtime 均不引用 patcher。
- 因此 A4/A5 说明的是成品 runtime 内部的 wrapper/helper seam，与 §3.1 的 source rebuild path 完全正交，
  没有把 patcher 或 importer 加入 Managed policy/trusted execution graph。
