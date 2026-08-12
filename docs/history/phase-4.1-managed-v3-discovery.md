<a name="phase-4-1-historical-position"></a>

# Phase 4.1：Managed v3 mode 第一轮 Discovery

## Historical position

`Phase 4.1` 是 v0.3.5 成为 accepted baseline 后、本地 `0.4.0-dev` 上完成的 **Phase 4 第一轮 Discovery
里程碑**。它把此前 C2 contract-cleanup 讨论与 attestation、nonce framing、smart/autonomous mode 的真实
上游语义放到同一张架构图中，冻结下一轮可实施路线。

这个编号用于保存 Phase 4 内部的探路成果，不表示一个已经交付用户行为的独立 Product Phase。该轮没有创建
`0.4.0-*` package identity，没有修改 production、machine contract 或 Release inputs，也没有激活任何 mode。
当前授权、Next Step 和 programme 状态仍以活动 planning 与 ROADMAP 为准。

<a name="phase-4-1-problem-before"></a>

## Problem before

v0.3.5 已安装 pristine `inject-plan.sh` 与它的条件依赖 `ledger-summary.sh`，但 `owned-plan.py` 的 private
snapshot 只复制 `task_plan.md` 和可选 `progress.md`。因此上游代码虽然包含 smart、autonomous、gated、
attestation 和 nonce 分支，当前 managed runtime 必然只走 legacy。

进入 Phase 4 前仍有几组问题没有统一答案：

- 是直接投影 `.mode`、`.nonce`、`.attestation` 和 ledger，还是建立新的 owned state boundary；
- 上游 attestation/nonce 分别真正证明什么，cache、并发和失败时是否会降级；
- 是否必须导入 `attest-plan.sh`、`ledger-append.sh`、`phase-status.sh` 等上游 writer；
- 公开 Host 已出现更多 Hook event 后，Phase 4 是否需要扩大 managed event set；
- C2 的 bundle/Release v2、`origin`、metadata 生命周期与 Phase 4 source admission 应分开发版还是一起收敛；
- 如何防止升级后突然承认 workspace 中早已存在、但 v0.3.5 一直忽略的上游 `.mode`。

<a name="phase-4-1-evidence-recovered"></a>

## Evidence recovered

### Upstream semantics

- 上游基础状态只有 legacy、autonomous 和 gated；smart injection 是可与它们组合的正交 opt-in，不是第四个
  同等级 mode。
- autonomous/gated 要求 attestation 后才注入 plan body，并用 ledger summary 替换 raw progress tail；gated
  还属于后续 Stop completion gate 的输入，不能只启用 context 半边就宣称 gated 已实现。
- nonce 只随机化 delimiter。它与 plan 位于同一 trust domain，能写 plan 的主体也能读取 nonce，因此 nonce
  不是 plan-write attacker 的防线。
- attestation 是 plan 内容的 workflow change detector，但 attestation 文件也与 plan 同域；它不构成独立
  human identity 或授权证明，不能在产品描述中夸大。
- 上游 mode 使用 substring `grep`，nonce 接受范围比 initializer 宣称的 16 位小写十六进制更宽；ledger reader
  还会从 filename、event 和 phase heading 提取 workspace 内容。这些 parser/data surface 不能未经 owned
  validation 直接进入 managed context。
- 上游 autonomous 在 `ledger-summary.sh` 缺失时退回 raw `progress.md`；这会破坏“结构化 ledger 不注入自由文本”
  的安全理由，managed 路径必须拒绝而不是降级。

### Writer and integration boundaries

- `attest-plan.sh`、`ledger-append.sh`、`phase-status.sh` 都会写 workspace；后两者不是 Hook injector 的隐式
  dependency。它们使用普通 shell path 与 best-effort advisory lock，不满足当前 owned safe-write boundary。
- upstream `.codex` glue 与 canonical Skill scripts 是两套行为并不完全一致的 integration surface；部分 glue
  直接读 workspace、绕过 canonical injector。它不能成为第二套 managed Host integration。
- 当前 managed path 已经只在 `SessionStart` 与 `UserPromptSubmit` 注入，不存在 upstream autonomous 想消除的
  per-tool plan recitation。Phase 4 无需为这个已经不存在的问题增加 `PreToolUse`。

### Host and Cloud facts

- 当前公开 Hook ABI 已包含 compaction、tool/permission、Stop 等事件，但“ABI 已存在”不等于 Phase 5～8 已获
  授权。Phase 4 继续只使用现有两个 managed events。
- 多个匹配 Hook 可以并发执行，因此 Phase 4 runtime 必须保持 read-only、idempotent、每次调用使用独立 private
  snapshot，不能依赖共享 mutable cache 或 workspace lock。
- Cloud Fresh、cache Resume、default-branch setup、selected-branch checkout 与 maintenance 是不同生命周期。
  pre-existing marker、显式 re-arm、real Resume、rollback 和 snapshot residue 都必须进入后续验收。
- transcript 仍是可变且非稳定 Host data；mode/attestation authority 不与 transcript 或 session-store fallback 绑定。

<a name="phase-4-1-core-decisions"></a>

## Core decisions

### 1. 选择 hybrid owned-boundary 路线

冻结的推荐调用链是：

```text
SessionStart / UserPromptSubmit
  -> one absolute managed adapter
  -> exact plan-context request
  -> owned-plan safe capture and policy
       -> validate mode / nonce / attestation / bounded ledgers
       -> produce a normalized private snapshot
       -> pristine inject-plan.sh
       -> required pristine ledger-summary.sh when autonomous
  -> exact result validation
  -> canary + verified context
```

`owned-plan` 负责 no-follow/regular-file/single-link/identity/race/size/UTF-8、exact grammar、digest comparison、
effective profile 和 normalized snapshot；pristine upstream scripts 继续负责 canonical rendering。adapter 仍只负责
Host boundary、child supervision、result validation 和有序组合，不建立第二套 plan/mode/ledger 算法。

以下路线被拒绝：

- 直接在真实 plan directory 执行 upstream Codex glue 或 writer；
- 把所有 raw marker/ledger 不经规范化复制进 snapshot；
- 在 Python 中完整重写另一套 legacy/smart/ledger renderer；
- 为本轮引入 installer-owned persistent mode/attestation database。

### 2. 使用版本化 managed opt-in，避免升级误激活

仅有 upstream `autonomous`、`gate` 或 `inject-smart` marker 时，candidate 仍必须保持 managed legacy。推荐在同一
`.mode` 中额外要求版本化 token，例如 `codex-managed-v1`，并由 owned runtime 对完整 token set 做 exact、bounded
validation。只有这个 token 与获准 profile 同时存在，managed behavior 才能离开 legacy。

这个 token 表示“明确对本 managed protocol opt in”，不是 secret 或身份凭据。`gate` 在 Phase 4 中必须明确拒绝，
不能静默只启用 autonomous context 而让用户误以为 Phase 8 hard Stop 已经生效。

### 3. Phase 4 不持久化 attestation cache，也不写 workspace

owned runtime 每次直接对安全捕获的 plan bytes 计算 SHA-256。它不继承上游 path+mtime cache，不创建共享 cache，
不修复 marker/ledger，也不调用 workspace writer。缺失、无效、篡改、race、helper failure、timeout 或超预算时，
plan-derived content fail closed；Codex loop 与 canary 仍 fail open。已识别的 managed state 永远不能降级为 legacy raw
context。

### 4. smart/autonomous 与 gated/Stop 分开

Phase 4 的候选激活面只包括 smart 和 autonomous，并继续使用两个现有 turn-start events。gated marker、Stop contract、
block counter、stall detector、逃生路径和 hard-gating Cloud 隔离统一留给 Phase 8。Phase 5～7 同样不能因为复用 state
reader 就自动继承新 Hook 或 writer。

<a name="phase-4-1-contract-convergence"></a>

## Contract and source convergence

Discovery 同时关闭了 C2 留下的字段与 placement 讨论：

- Phase 4 不新增 upstream executable；`attest-plan.sh`、`ledger-append.sh`、`phase-status.sh` 等继续 denied。
- runtime bundle v2 首选使用 exact `upstream_files`、`local_files`、`installed_contracts` 分区。
- 当前 `hook_adapter.py` 是会安装和执行的 runtime，却由 installer 在 bundle 外单独加入；v2 应把 adapter 纳入
  `local_files`，消除这份 bundle 外 executable authority。
- 四个 adapter/child ABI schema 统一进入 `installed_contracts`，由 installer/doctor 安装和校验，关闭 plan schema
  已安装、catch-up schema 只进 ZIP 的无理由不对称；manifest 不再重复锚定其中两个 contract。
- 结构分区、受限 roots、单一 pristine hash、mode 与 dependency closure 已能表达来源，因此 v2 删除无独立 consumer
  的 entry `origin`。
- `managed_sha256 == pristine_sha256`、空 `overlay_ids` 随 v2 退休；只做类型校验、没有 operational consumer 的
  `language`、`host_dependencies` 也迁出 machine contract。未来确有真实 consumer 时，只能经新 schema 和生命周期表
  重新引入。
- manifest schema 4、runtime-bundle v2、release-artifact v2 是一个原子 contract transaction：manifest 顶层 exact，
  删除重复 `skill_version`；Release entry mode 成为唯一 authority，builder 删除第二份 executable mode set，并移除
  ignored prose/classification fields。
- published v0.3.5 继续使用它自己的 immutable v1/schema-3 contracts。candidate 不提供双 schema fallback；跨版本
  oracle 从各 source snapshot 的 manifest 发现其 contract path。

<a name="phase-4-1-threat-model"></a>

## Threat and compatibility model

后续实现至少要保持以下判断：

| Workspace state | Managed behavior |
|---|---|
| marker 缺失，或只有旧 upstream token | v0.3.5-equivalent legacy |
| marker 存在但 symlink/hard-link/oversized/invalid UTF-8/raced | canary + bounded refusal；不得当作 marker 缺失 |
| managed token 与 unknown、duplicate、incompatible token 组合 | 拒绝 opt-in，不注入 plan/progress/ledger |
| managed smart | pristine smart plan rendering；仍属于 legacy trust level |
| managed autonomous + exact nonce + matching attestation + valid bounded ledger | attested plan、nonce framing、normalized ledger summary |
| managed autonomous 缺任一必需状态或 digest mismatch | canary + bounded refusal；无 plan-derived content |
| helper/child timeout、stderr、nonzero 或 oversize | canary 保留；不得降级到 raw progress |

nonce 最终 shape、marker/ledger 数量与字节上限属于 implementation contract，应由一份 schema/常量和 nearest tests
固定，不应再被多个治理文档逐字锁死。Discovery 给出的具体上限是 implementation 的起始建议，后续微调必须保持
bounded、exact、no-downgrade 三条原则。

跨版本必须证明：v0.3.5 中已存在的 upstream marker 升级后仍是 legacy；显式 managed opt-in 可随 marker 删除立即
回到 legacy；candidate → immutable v0.3.5 → candidate 双向 takeover 都重新验证状态且不删除用户文件；任何 contract
或 install preflight failure 都不能产生 partial takeover。

<a name="phase-4-1-completed-delivery"></a>

## Completed delivery

本里程碑真正完成的是 Discovery 闭环，而不是 runtime feature：

- 恢复 pinned v3.8.2 mode/attestation/nonce/ledger 的真实调用图、读写面和 failure semantics；
- 对齐当前官方 Hook/Cloud lifecycle 与仓库带日期 fixture，确认 Phase 4 不需要新增 Host event；
- 比较五条架构路线并冻结 hybrid owned-boundary 方案；
- 冻结 source admission、contract v2、字段生命周期、upgrade/rollback 与 Phase 5～8 交界；
- 建立 local、Linux、no-live Cloud、live opt-in 和 Release 分层验证矩阵；
- 得出 `CONDITIONAL_GO_TO_F1_INACTIVE_FOUNDATION`，并把实现、激活、Cloud、Release 保持为独立 gate。

<a name="phase-4-1-gate-route"></a>

## Recommended successor gates

### F1 — inactive foundation

当维护者另行授权后，先用 failing-first tests 原子落 manifest schema 4、bundle/Release v2、adapter admission、统一
installed ABI schemas、plan protocol v2 与 hybrid state code，但 trusted policy 只允许 `[legacy]`。marker、nonce、
attestation 和 ledger 仍不可达，所有现有输出必须保持 v0.3.5 等价。

F1 完成 contract/local/Linux/no-live Cloud、deterministic ZIP 和 v0.3.5 takeover/rollback 后必须停；foundation PASS
不自动授权激活。

### F2 — explicit smart/autonomous activation

只有新授权才能把 trusted profiles 扩展为 `[legacy, smart, autonomous]`。从 versioned managed token、所有 refusal
path、raw-progress non-leak 和 real opt-out 测试开始；不得吸收 `gate` 或 Stop。

### F3 and later

live Cloud opt-in、Fresh/UserPrompt/real Resume、Release seal/publication、下载资产复验和 Latest promotion继续逐门授权。
Phase 5～8 分别保留 compaction、tool/permission、advisory completion 和 optional hard gating；Phase 9 只封板实际已经
通过独立 gate 的 feature set。

<a name="phase-4-1-acceptance-conclusion"></a>

## Acceptance conclusion

结论为 `CONDITIONAL_GO_TO_F1_INACTIVE_FOUNDATION`：Phase 4 在不扩大 Host event set、不执行 workspace script、不导入
上游 writer、不建立 persistent cache 且不削弱 private snapshot 的前提下可行。

该结论只证明路线已经具备可实施的边界、threat model 和退出条件。它没有证明 contract v2、hybrid runtime、
smart/autonomous behavior、Linux/Cloud acceptance 或 `0.4.0` Release 已经存在或通过。

<a name="phase-4-1-explicit-non-goals"></a>

## Explicit non-goals

- 不把 `.codex` upstream glue 注册进 managed policy，不新增 PreToolUse、PreCompact、Stop 等 event。
- 不准入或执行 attester、ledger/phase writer、init/gate scripts。
- 不在 Phase 4 激活 gated/hard Stop，不提前实现 Phase 5～8。
- 不把 attestation 描述为独立人类身份认证，不把 nonce 描述为 plan-write 防线。
- 不持久化 SHA cache，不由 Hook 写、修复或删除用户 planning state。
- 不修改已发布 v0.3.5/v0.3.4 的 contract、tag、资产、SHA、acceptance 或 rollback evidence。
- 不因本地分支名创建 package、alpha、Release 或 Cloud 状态。

<a name="phase-4-1-successor-inheritance"></a>

## Successor inheritance

后续讨论或 F1 设计应继承四条主线：

1. hybrid owned validation + normalized snapshot + pristine rendering；
2. versioned managed opt-in，旧 upstream marker 永不因升级自动激活；
3. F1 foundation、F2 behavior、Cloud 与 Release 分门推进；
4. machine metadata 必须有真实 consumer 与 lifecycle，否则由结构表达或迁出 contract。

允许微调的是 token 名称、exact result taxonomy、具体文件/ledger budgets 和 F1 子步骤；如果微调会改变 trusted graph、
workspace write policy、Host event set、legacy default、attestation claim、persistent state 或 Phase 8 边界，则必须重新打开
Discovery，而不能作为普通实现细节处理。

<a name="phase-4-1-post-implementation-status"></a>

## Post-implementation status

后续 F1 foundation 已实施并通过 Source/Candidate/no-live Cloud 验收；F2A implementation 仍未授权。本轮后继
Discovery 还对 Phase 4.1 做了一个必要的微调：当时“token 放在同一个 `.mode`”只是推荐示例，不是架构不变量。
独立 plan-local `.pwf-codex-managed` commit-point 文件可以保证“未显式 opt-in 就完全不读取旧 `.mode`”，因此更严格地
落实 legacy 默认不变。

这个调整没有改变本里程碑冻结的 hybrid owned-boundary、只读 workspace、versioned opt-in、fail-closed refusal、
trusted graph 或 Host event set；它只是用更强的物理零读取边界替换了尚未实施的同文件示例。当前协议与授权状态以
[`ROADMAP`](../../ROADMAP.md#phase-4-f2-activation-protocol) 和 Phase 4.4 后继 Discovery 为准。

<a name="phase-4-1-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/6ed44593210ebdb46ce42fe58b89e2b20c06f499)

该链接只证明本轮 Discovery 封板时的仓库状态，不解释当前实现；当前 contract、programme、授权与行为以当前仓库
authority 为准。
