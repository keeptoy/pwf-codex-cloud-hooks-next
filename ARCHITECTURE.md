# 架构与信任边界

## 1. 一句话模型

上游 PWF 定义 planning 工作流和 canonical scripts；本仓库把经过固定来源、hash 和 contract 校验的
owned copy 部署到 Codex Cloud system-managed Hooks，并负责 Host protocol、安装治理、故障隔离和验收。

本仓库不是第二套 planning 方法，也不是通用 Skill 转换器。

已经理解这些设计边界、只需要定位源码模块、依赖关系、改动影响或验证入口时，转到
[`DESIGN.md`](DESIGN.md)；本文件继续只维护系统级理由、关系和不变量。

## 2. 为什么需要适配层

上游 `planning-with-files v3.8.2` 已有本地 Codex Hook 集成，但本地模型通常依赖项目/用户级
`.codex` 配置、用户目录 session store 和相对脚本路径。当前已验证的 Codex Cloud 环境不同：

- Managed policy 位于 `/etc/codex/requirements.toml`；
- adapter 命令必须是受控 `managed_dir` 下的绝对路径；
- 当前 Codex home 为 `/opt/codex`，session store 位于 `/opt/codex/sessions`；
- global Skill 位于 `/root/.agents/skills/planning-with-files`；
- setup shell 环境和后续 Hook process 环境不是同一个生命周期。

这些是带日期的平台事实，不是永久常量。adapter 优先使用显式 Host input 和安装位置推导，并保留
环境变量缺失时的受控兼容行为。

<a name="cloud-lifecycle"></a>

### 2.1 Cloud 生命周期与 `CODEX_HOME`

OpenAI 的公开 Cloud environment 文档区分两条时序。冷任务创建容器后先 checkout 该 chat 选定的
branch/commit，再运行 setup script，最后进入 agent phase；environment cache 则先 clone default branch、
运行 setup 并缓存容器状态，恢复该缓存时才 checkout 本次 chat 指定的 branch，并可运行 maintenance script。
因此“setup 看见默认分支”和“setup 看见选定分支”都只能在各自 lifecycle 前提下成立，不能冻结成所有
Cloud task 的单一路径。参见 OpenAI 官方 [`How Codex cloud chats run`](https://learn.chatgpt.com/docs/environments/cloud-environment#how-codex-cloud-chats-run)
与 [`Container caching`](https://learn.chatgpt.com/docs/environments/cloud-environment#container-caching)。

setup script 运行在独立 Bash session 中，因此其中临时 `export` 的值不会仅凭 shell 继承进入后续 agent
phase。安装发生在哪个阶段还决定 Hook 能观察到哪次 lifecycle：setup 中完成安装时，随后首个 task 可以
观察 `SessionStart source=startup`；如果先启动 agent、再在提示词中安装，原始 startup 已经过去，后续只能
按实际调度观察 Resume SessionStart，或者在同一 task 没有新 SessionStart 时只观察 UserPromptSubmit。

Codex Cloud 配置界面把 environment settings 与 setup script 明确分成不同控制面；维护者提供的
2026-08 界面截图也显示“环境变量”“密钥”“容器缓存”和“设置脚本”是彼此独立的配置区。应按下表
区分，不把“配置的环境变量”和“setup shell 内创建的变量”合并成一个来源：

| 渠道 | 配置/产生位置 | 生命周期 | 本仓库语义 |
|---|---|---|---|
| 配置的环境变量 | Cloud environment 的“环境变量”区 | 平台注入 setup 与 agent phase；值不是由 setup script 创建 | 显式外部输入；若用户配置 `CODEX_HOME`，bootstrap 必须把它当作 override 校验 |
| secret | Cloud environment 的“密钥”区 | 只在 setup 可见，agent phase 前移除 | 只用于受控安装输入；runtime/Hook 不得依赖其存在 |
| setup script shell | Cloud environment 的“设置脚本”区（自动或手动） | checkout 后执行的独立 Bash session；shell 内临时 `export` 不自动延续 | 安装/准备阶段；必须显式解析路径，不能借 shell 继承建立后续 Hook contract |

因此同一 setup 进程中看到的环境由两部分组成：平台预先注入的配置环境变量，以及脚本自身设置的
shell-local 变量。前者可以贯穿阶段；后者除非写入持久配置并由后续进程重新加载，否则只属于 setup
session。界面布局本身是带日期的产品观测，公开文档中的生命周期语义才是外部依据。

本仓库进一步冻结的是 2026-08 Cloud fixture 与 Fresh/Resume 验收得到的、更窄的平台观测：

```text
cold task
  -> checkout selected branch/commit -> setup shell -> agent startup

cached environment
  -> checkout default branch -> setup shell -> cached container
  -> resume cache -> checkout selected branch -> optional maintenance -> agent

setup-installed Hook -> observes the following startup SessionStart
agent-prompt-installed Hook -> original startup already passed; next observation is Resume/UserPromptSubmit

both paths after managed installation
  -> managed Hook process
       CODEX_HOME=/opt/codex
       session store=/opt/codex/sessions
```

这里的“Codex runtime starts”只是本仓库用于区分 setup 与后续 agent/Hook 生命周期的术语，不声明
一个公开 Host 进程名或精确内部启动实现。公开文档把 `CODEX_HOME` 定义为可配置的 Codex state root，
并对 CLI、IDE extension、app-server 和 installer 给出通用默认 `~/.codex`；它没有把 Cloud 的
`/opt/codex` 声明为永久合同。参见 OpenAI 官方
[`Environment variables`](https://learn.chatgpt.com/docs/config-file/environment-variables#core-locations)。
因此本仓库只把 `/opt/codex` 当作带日期、由 fixture 和 acceptance 证明的 Cloud override/默认事实。

由此得到四条设计约束：

1. setup 入口不能假设 Host 已经提供 `CODEX_HOME`；bootstrap 必须使用显式配置或受控、可验证的
   当前 Cloud 默认，并把解析后的绝对路径传给 installer。
2. setup 中的临时 `export` 不能作为后续 Hook 获得配置的证明；后续阶段必须重新使用 Host 提供的
   值、显式 config/input，或从已验证 managed adapter 安装位置受控推导。
3. 用户在 environment settings 中显式提供 `CODEX_HOME` 时，它是平台配置输入，不能与 setup
   shell 自行设置的同名变量或“实测 Host 在 setup 入口未提供该值”混为一谈；任何非默认路径仍须
   containment、存在性和权限校验。
4. fixtures 必须继续区分 `sandbox_initialization`、`agent_after_start` 与 `managed_hook`，避免用某一
   阶段的环境快照替代另一阶段的 Host contract。

## 3. 部署图

```text
fixed upstream v3.8.2 archive
        |
        | importer validates archive, runtime bundle, pristine hashes and modes
        v
repository-owned pristine upstream runtime
        + owned runtimes + contracts + installer/package inputs
        |
        | tools/build_release.py applies the exact Release allowlist
        v
candidate Release ZIP  <--- external checksum-pinning bootstrap stays outside
        |
        | install.js (lock, hash, mode, backup, policy merge)
        v
$CODEX_HOME/hooks/planning-with-files/
  |-- hook_adapter.py
  |-- owned-plan.py
  |-- owned-catchup.py
  |-- upstream/{resolve-plan-dir.sh,inject-plan.sh,ledger-summary.sh,session-catchup.py}
  |-- contracts/{adapter-plan-context-request-v2,plan-context-result-v2}
  |-- THIRD_PARTY_NOTICES.md
  `-- installed-manifest.json

/etc/codex/requirements.toml
  `-- /usr/bin/python3 <absolute-managed-path>/hook_adapter.py <event>
```

Managed policy 只认识 adapter。child runtimes 是已安装 adapter 的 sibling，不能独立注册为 handler。
代码出现在上游或仓库、被 importer 纳入、进入 Release ZIP、被 installer 安装、被 Managed policy
注册、以及在当前 event dispatch 中可达，是彼此独立的状态；前一层不能推导后一层。当前 policy
只注册 adapter，运行时也只允许 adapter 按已验证请求调用相邻 owned runtime。
repository source、Release ZIP 与 installed layout 的逐层对应见
[`DESIGN.md` 的“实现布局”](DESIGN.md#implementation-layout)。

### 3.1 源码重建与生产执行是两条路径

`tools/import_upstream_runtime.py` 位于源码重建和 Release 审计层；它随候选 ZIP 提供 self-contained
`import`/`check`，但不是安装后的 Hook runtime，也不进入 Managed policy 或 production trusted execution
graph。Importer 从固定 PWF v3.8.2 archive 重建 owned runtime 时，四个上游文件都必须逐字保持 pristine；
任何 `origin`、pristine/managed hash 或 overlay declaration 不一致都会 fail closed。

Importer 的职责严格限定为：

1. 从 manifest 取得 bundle path/SHA，先校验原始字节，再严格验证整个 bundle 的 schema、各分区 inventory、
   path、ID、hash、mode 与 dependency；不能因为 importer 只复制 upstream projection 就忽略其他分区的非法内容；
2. 从已验证 bundle 中只取四个 exact upstream source/package records，固定 archive URL/SHA、license、mode 与
   destination inventory；
3. 核对每个 source 的 pinned pristine SHA-256，并要求 package bytes 与 pristine bytes 相同；
4. 为源码树或解压后的候选 ZIP 提供确定性 `import`/`check`，拒绝 archive、source、mode、symlink 或
   unknown destination drift；
5. 不修改 global PWF Skill，不推断或生成 compatibility transformation。

已发布 v0.3.2 使用过更早的源码重建路线：`patches/patch_planning_skill.py` 当时是 importer 的直接依赖，
位于源码重建和 Release 审计层，不是安装后的 Hook runtime，也不进入 Managed policy 或 production
trusted execution graph；四个上游文件中只有 `scripts/session-catchup.py` 经过四项 overlay，另外三个保持
pristine。后来调用图证明 Phase 2 owned wrapper 从首次激活起就不调用这些 patched CLI branches，且四项
retirement condition 已由 validated/frozen transcript、explicit request、canonical project state 和 owned
renderer 满足，因此 successor current tree 退休 patcher/ledger/patched bytes。该历史实现和精确 hash 只从
immutable v0.3.2 source 与 `BASELINE_PROVENANCE.md` 恢复，不能重新进入当前构建合同。

维护者的源码重建/核验路径发生在源码树或自包含的 Release ZIP 中：

```text
pinned PWF v3.8.2 archive
  -> importer 校验 archive、license、runtime bundle、allowlist 与 pristine hashes
  -> repository-owned runtime/upstream/*（四个文件逐字 pristine）
  -> Release builder 按 exact allowlist 将成品 runtime、contracts、installer、builder 与 self-contained importer
     一起装入候选 ZIP；checksum-pinning bootstrap 继续作为 ZIP 外部资产
```

生产安装/运行路径不现场打 patch，而是使用 ZIP 内已经生成的成品：

```text
Release ZIP
  -> install.js 从 upstream manifest 取得 bundle path/SHA
  -> 校验 bundle 原始字节后严格解析唯一 source/install inventory
  -> 校验 runtime content、mode 与 dependency graph
  -> 复制成品到 $CODEX_HOME/hooks/planning-with-files/
  -> Managed policy 只启动绝对路径 hook_adapter.py
  -> adapter 只调用已安装的 sibling owned runtimes
  -> owned runtimes 只从已安装的 sibling upstream runtime 进入明确允许的调用点
```

`runtime-bundle-v2.json` 独占 repository source 到 installed path 的 runtime/contract inventory；
`upstream-manifest.json` 是 provenance 与 integrity index，不再镜像 bundle arrays 或 installed-contract projections。
importer 和 installer 共享同一条 `manifest → raw bundle SHA → strict parse → inventory` 信任边。
installed manifest 的 `runtime_files` 是安装状态快照，Release artifact 的 `entries` 是 ZIP 层 allowlist；它们分别
服务 drift 检查和制品边界，不能与 source authority 合并或删除。

说人话：manifest 是封条和索引，告诉 consumer 应取哪份 bundle、原始 SHA 应是什么；bundle 是唯一装箱清单，
决定源码和安装清单里到底有哪些 runtime/contracts；installed manifest 是安装后的收货单；Release artifact 是
整个 ZIP 的外箱清单。四者会包含部分相同路径，但只有 bundle 可以回答 source/install inventory 是什么。

因此生产安装是否健康只取决于已校验的成品 runtime 与安装 contract；源码重建工具是否自包含是独立
的 Release 维护边界，不能反向扩大 trusted execution graph。各版本对此边界的实际变化见
[`CHANGELOG.md`](CHANGELOG.md)，精确 package 身份和资产见
[`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)。

## 4. Runtime 数据流

```text
Codex Hook stdin JSON
        |
        v
hook_adapter.py
  |-- parse and validate event/Host fields
  |-- prepare mandatory PWF_GLOBAL_HOOK_CANARY_V1 (not streamed yet)
  |-- supervise owned-plan.py with exact-v2 [legacy, smart, autonomous] request
  |      `-- resolve plan -> activation-first admission -> private safe snapshot
  |          -> pristine inject-plan.sh -> state revalidation
  |-- SessionStart + validated plan result with inject=true only:
  |      forward the exact validated six-field project result
  |      to owned-catchup.py
  |         `-- validate, identity-check, and freeze transcript bytes + reuse pinned owned parser helpers
  `-- compose canary, optional catch-up, optional plan; emit one Host JSON result
        |
        v
hookSpecificOutput.additionalContext
```

Plan runtime runs first for both `SessionStart` and `UserPromptSubmit`. The adapter does not resolve planning files,
does not read `task_plan.md`/`progress.md`, and contains no parallel plan-selection or injection algorithm.
The adapter does not stream an early canary or partial child output: it prepares the mandatory canary, completes the
bounded child path, then writes exactly one final Host result. A missing/invalid/non-injecting plan result therefore
produces canary-only output and never dispatches catch-up; catch-up failure preserves the already validated plan context.

`owned-catchup.py` 不调用上游 `session-catchup.py` 的 CLI `main()`；它只从固定 owned module 复用
project-path、planning-update、message extraction 与 text helpers。transcript 选择、identity 复核、
normalization 和 report rendering 仍由 owned wrapper 负责。

各模块的代码入口、直接依赖、变更影响和测试路由见
[`DESIGN.md` 的“模块职责与依赖”](DESIGN.md#module-responsibilities)。

## 5. Canonical plan contract

`adapter-plan-context-request-v2` 固定：

- runtime：`codex`；
- events：`SessionStart` / `UserPromptSubmit`；
- ordered allowed profiles；当前 F2B producer 与 runtime capability 精确固定为 `[legacy, smart, autonomous]`；
- opt-in protocol identity：`codex-managed-v1`；独立 `.pwf-codex-managed` 缺失时不读取旧 `.mode`；
- plan/progress 输出上限：50 / 20 行；
- context 上限：20,000 字符；
- 不传 prompt 或 transcript 内容。

`owned-plan.py` 负责：

1. `PLANNING_DISABLED` 和 `PLAN_ID`；
2. active pointer → newest scoped → legacy root 的 canonical precedence；
3. path containment、regular-file、symlink/hard-link、size、UTF-8 和 race 检查；
4. 0700/0600 private snapshot；
5. 只在 profile-bound exact activation commit point 后读取 smart/autonomous state；armed invalid state 拒绝且不降级 legacy；
6. autonomous 每次核对 captured task SHA-256、exact nonce 和 bounded exact ledger schema，只投影 `tick/event`，不读取 raw progress；
7. 用 pristine `inject-plan.sh` 生成 legacy、smart 或 autonomous context；profile 决策只进入 private snapshot/owned child；
8. renderer 返回后重新读取并核对 task、activation、mode、nonce、attestation 与 ledger identity/bytes，变化时丢弃输出；
9. timeout、process-group kill、bounded output、cleanup 和 stale cleanup；
10. exact result schema 与 structured diagnostic。

Adapter 只接受完整、关系一致、位于 request root 下的 exact-v2 result。result 的 effective profile 与 advisory
只能是合同内 bounded decision，不携带 raw marker、nonce、hash、ledger 或路径诊断。失败或 `inject=false` 时不做
filesystem fallback。

### 5.1 Upstream invocation strategy boundary

对当前 pinned PWF v3.8.2，private snapshot 是 `owned-plan.py` 内部的 integration-specific 调用策略，
不是 Codex Host ABI，也不是已证明可复用于任意 Skill 的 Driver contract。选择它是为了在不增加第二个
upstream patch point 的情况下保持 resolver/injector pristine，并通过最小文件投影和环境清洗
强制由 owned decision 选择 legacy/smart/autonomous profile；安全读取、权限、预算、超时和清理成本由 owned runtime
明确承担。F2B production 仍先读取独立 activation commit point：缺失时 `.mode` 与其他 autonomous state 完全 inert；
exact autonomous token 生效后才捕获 `.mode`、nonce、attestation 和 bounded ledger，并向 private snapshot 写入
root-shaped `.plan-attestation`。该 reader 不写 workspace。F3B2 已证明同一只读边界下 smart profile 的真实 Cloud
prepare/arm/disarm/re-arm lifecycle；autonomous 与 rollback 是否可用仍由后继 F3 gate 决定。

这里的“第二个 patch point”特指当时为 plan resolver/injector 比较过的多目标 overlay，不表示 private
snapshot 直接替换了 catch-up overlay。Catch-up 是另一条 invocation domain：Phase 2 的 owned wrapper 已
通过 validated/frozen transcript bytes、显式 runtime/project request 和 owned report renderer 接管四项 CLI
compatibility behavior，只复用 pinned pristine module 的 parser helper closure。Phase 3 private snapshot
随后解决 plan scripts 的真实文件调用问题；两条路线共同体现“pristine upstream + owned boundary”，但不是
同一个 overlay → snapshot 转换。

该选择的长期边界固定为：

- 只有 Cloud/Linux 证据证明快照无法满足真实文件语义、权限或有界清理时，才重新评估多目标 overlay；
- 上游提供稳定结构化调用协议，或 Codex Cloud 原生承担同等 Skill Hook 模型时，优先迁移并删除对应
  snapshot/compatibility layer；
- 第二个只读 integration 出现前，不把 PWF 的 snapshot、overlay 或字段集合提升为通用 Driver manifest、
  Host-native IR 或转换器承诺；
- OS namespace、bind mount、FUSE 或外部 sandbox capability 未成为 Host contract 前，不作为 production
  正确性的必要条件。

任何路线切换都会改变 upstream invocation、trusted graph 或兼容层退休方式，必须重新进入 Discovery，
复核 contracts、Release boundary、Linux/Cloud evidence 与 rollback，不得在局部 runtime 修复中隐式替换。

## 6. Catch-up contract

`SessionStart` 才调用 `owned-catchup.py`。输入项目状态必须来自已验证 plan result，而不是 adapter
第二次解析磁盘。

Transcript 先构造 allowed roots，再做两级选择：

1. Adapter 按显式 `CODEX_SESSIONS_DIR` → 显式 `$CODEX_HOME/sessions` → managed adapter 安装位置推导
   的 Codex home 顺序构造、规范化并去重 allowed roots，最多保留三个；这里是信任根构造顺序，不是
   fallback session 的逐根优先级。
2. Host 提供且已通过 adapter containment/regular-file 初检的 `transcript_path` 始终优先；owned runtime
   重新以 no-follow/identity/project/session 规则打开并冻结它。确定的 session identity mismatch、损坏或
   不可读会直接 fail closed；Host path 缺席或普通路径拒绝，只有在 request 明确允许时才进入 fallback。
3. Fallback 获准时，runtime 在所有 allowed roots 中最多检查 256 个 `rollout-*.jsonl` 候选，将已安全
   打开的候选按 `mtime_ns` 全局倒序，并选择第一个同时匹配 session identity 与 project 的 transcript。

选择成功后，runtime 一次性读取并再次核对文件 identity；后续解析只使用 verified immutable bytes，
不从 mutable path 重读。

未知 JSONL record 可以诊断并退化到 event-only conversation；损坏、超限、身份不符或不可读数据不能
产生 partial report。长 Cloud wrapper 按固定 head/tail budget 保留尾部 sentinel。

## 7. 信任分层

| 层 | 信任状态 | 规则 |
|---|---|---|
| Codex Hook stdin | untrusted Host data | exact schema/enum/path/identity validation |
| workspace planning files | untrusted project data | contained safe read + private snapshot |
| transcript JSONL | mutable Host data | contained file + identity revalidation + immutable verified bytes + bounded parser |
| global PWF Skill | pristine reference | discovery/validation only，不直接执行 |
| repository owned bundle | trusted after hash verification | importer/manifest/allowlist 固定 |
| installed managed runtime | trusted after installer manifest | absolute sibling execution only |
| Managed requirements | shared admin state | merge preserving；unknown drift fail closed |

整个部署和运行链中，global PWF Skill 保持 pristine；只有 repository-owned bundle 进入执行图。

## 8. 失败语义

- 安装、来源、hash、mode、manifest、schema、内容注入：fail closed。
- Plan child process/timeout/invalid result：canary-only；不启动 catch-up。
- Catch-up child process/timeout/invalid result：保留 canary 和健康 plan。
- 单个 advisory child failure：不能终止 Codex 主循环。
- stderr 只用于诊断；stdout 必须是一个 bounded JSON result。
- repair 只处理明确 owned drift；unknown/unowned drift 必须 blocker。

Managed policy 给 adapter 30 秒 timeout；adapter 自身使用更窄的 27 秒 deadline，并为 finalization 保留
1 秒。所有 child 与最终单次 JSON 输出必须在该内部预算内完成；测试冻结当前 supervision 和
process-group cleanup 语义。

## 9. 来源与 pristine helper boundary

四个 upstream runtime 文件都由 pinned v3.8.2 archive 逐字生成并保持 pristine。Runtime bundle 以
`upstream_files`、`local_files` 和 `installed_contracts` 的结构分区表达来源，同时固定
source/package/installed path、mode、单一内容 SHA 和直接依赖。schema 2 exact-key validation 会拒绝已经退休的
`origin`、`managed_sha256`、`overlay_ids` 等 overlay-era 字段；当前架构不再用永久 tombstone 描述已结束的迁移。

`owned-catchup.py` 会动态加载完整的 fixed `session-catchup.py` module，因此 module initialization 中的 UTF-8
stdio 配置与 optional `orjson` import 仍属于真实 trusted surface；但后续只允许进入
`same_project_path`、`find_last_planning_update`、`extract_messages_after` 和 `text_content` 四个 helper roots
及其 pinned transitive closure，不调用 CLI `main()`。Helper allowlist、闭包不可达性和 managed/pristine
result 等价由 machine contract 与边界测试共同冻结。已发布版本曾使用的 overlay IDs、patcher anchors 与
managed hash 只在 `BASELINE_PROVENANCE.md` 和 immutable source 中作为冷证据保留。

## 10. Installer 所有权

Installer 负责：

- lock 与原子写入；
- source/runtime/contract hash 和 mode；
- Managed requirements 的 ownership marker 与 merge；
- backup、install、doctor、bounded repair、uninstall；
- installed inventory 和 drift 分类。

Installer 不负责修改 workspace planning，不接管第三方 policy，也不把未知现状自动变成 owned state。

## 11. Release 边界

Release ZIP 的身份与内容由 machine contract 和 package identity 决定，不由文档中的手写 entry count
决定。外部 bootstrap 下载并校验 ZIP，因此绝不能进入它所校验的 ZIP。development bootstrap 使用
zero hash 并 fail closed；授权 seal 只能在全部 ZIP 输入冻结、双构建一致后写入该 ZIP 的精确 SHA。
完成本地 seal 仍不等于已发布或已接受。

已发布 tag、ZIP、外部 bootstrap、URL、SHA 和 acceptance 均不可原位改写。候选源码、package、
contract、文件名或本地构建结果都不能单独建立 Release。各版本实际变化只在
[`CHANGELOG.md`](CHANGELOG.md) 摘要；已发布资产的精确身份与来源只在
[`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) 索引；当前 lifecycle 与未来晋级只在
[`ROADMAP.md`](ROADMAP.md) 维护。

## 12. 尚未实现

以下能力存在于远期路线或上游，但不属于当前 trusted graph：

- autonomous 的真实 Cloud activation/disarm/Resume/cache/tamper lifecycle，以及 disarm-first rollback；
- `PreCompact` / `PostCompact`；
- tool/permission lifecycle；
- advisory/hard Stop completion semantics；
- 通用多 Skill adapter/Driver framework。

它们只能在迁移完成后，通过独立 Discovery Gate、machine contract、tests 和 Cloud acceptance 逐项启用。
