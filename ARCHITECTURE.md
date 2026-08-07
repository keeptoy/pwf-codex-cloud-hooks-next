# 架构与信任边界

## 1. 一句话模型

上游 PWF 定义 planning 工作流和 canonical scripts；本仓库把经过固定来源、hash 和 contract 校验的
owned copy 部署到 Codex Cloud system-managed Hooks，并负责 Host protocol、安装治理、故障隔离和验收。

本仓库不是第二套 planning 方法，也不是通用 Skill 转换器。

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

### 2.1 Cloud 生命周期与 `CODEX_HOME`

OpenAI 的公开 Cloud environment 文档给出的顺序是：创建容器并 checkout 选定仓库版本，运行 setup
script（复用缓存容器时可再运行 maintenance script），然后才进入 agent phase。setup script 运行在
独立 Bash session 中，因此其中临时 `export` 的值不会仅凭 shell 继承进入后续 agent phase。
参见 OpenAI 官方 [`Cloud environments`](https://learn.chatgpt.com/docs/environments/cloud-environment)。

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
new container
  -> repository clone / checkout
  -> setup shell
       CODEX_HOME 在入口处未由 Host 提供
       bootstrap 显式解析 CODEX_HOME（当前默认 /opt/codex）
  -> agent / Codex runtime starts
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
        | importer validates manifest/ledger; patcher applies owned overlay
        v
repository-owned runtime bundle
        |
        | install.js (lock, hash, mode, backup, policy merge)
        v
$CODEX_HOME/hooks/planning-with-files/
  |-- hook_adapter.py
  |-- owned-plan.py
  |-- owned-catchup.py
  |-- upstream/{resolve-plan-dir.sh,inject-plan.sh,ledger-summary.sh,session-catchup.py}
  |-- contracts/{adapter-plan-context-request-v1,plan-context-result-v1}
  |-- compatibility-overlays-v1.json
  `-- installed-manifest.json

/etc/codex/requirements.toml
  `-- /usr/bin/python3 <absolute-managed-path>/hook_adapter.py <event>
```

Managed policy 只认识 adapter。child runtimes 是已安装 adapter 的 sibling，不能独立注册为 handler。

### 3.1 源码重建与生产执行是两条路径

`patches/patch_planning_skill.py` 位于源码重建和 Release 审计层，是
`tools/import_upstream_runtime.py` 的直接依赖；它不是安装后的 Hook runtime，也不进入 Managed policy
或 trusted execution graph。Importer 从固定的 PWF v3.8.2 archive 重建 owned runtime 时，只有上游
`scripts/session-catchup.py` 需要经过 patcher，另外三个上游脚本保持 pristine。

Patcher 的职责严格限定为：

1. 固定 patch ID、目标文件和四个精确源码 anchor；上游结构意外变化时拒绝继续，而不是猜测替换；
2. 按 machine contract 的顺序应用 session store、explicit runtime、scoped planning state 和 bounded
   wrapper context 四项 compatibility overlay；
3. 核对 pristine/managed SHA-256，使 `runtime/upstream/session-catchup.py` 可以从固定上游确定性复现；
4. 为 importer 的 `import`/`check` 和独立维护检查提供转换逻辑，不在生产安装时修改 global PWF Skill。

维护者的源码重建/核验路径发生在源码树或自包含的 Release ZIP 中：

```text
pinned PWF v3.8.2 archive
  -> importer 校验 archive、manifest、allowlist、overlay ledger 与 patcher anchors
  -> patcher 只转换 session-catchup.py
  -> repository-owned runtime/upstream/*
  -> Release builder 将成品 runtime、importer 与 patcher 一起装入候选 ZIP
```

生产安装/运行路径不现场打 patch，而是使用 ZIP 内已经生成的成品：

```text
Release ZIP
  -> install.js 校验 runtime contract、SHA-256、mode 与 inventory
  -> 复制成品到 $CODEX_HOME/hooks/planning-with-files/
  -> Managed policy 只启动绝对路径 hook_adapter.py
  -> adapter 只调用已安装的 sibling owned/upstream runtime
```

因此 v0.3.0 即使没有在 ZIP 中附带 patcher，也能正常安装和运行：它已经包含转换完成的
`runtime/upstream/session-catchup.py`。缺陷只在于解压 v0.3.0 ZIP 后，随包提供的 importer 缺少直接
依赖，无法独立完成维护自检。0.3.1 把 patcher 加入第 23 个 entry，修复的是 Release 工具自包含性，
没有新增生产 runtime 或激活边。

## 4. Runtime 数据流

```text
Codex Hook stdin JSON
        |
        v
hook_adapter.py
  |-- parse and validate event/Host fields
  |-- emit PWF_GLOBAL_HOOK_CANARY_V1
  |-- supervise owned-plan.py with exact-v1 request
  |      `-- resolve plan + private safe snapshot + pristine inject-plan.sh
  |-- SessionStart only:
  |      forward the exact validated six-field project result
  |      to owned-catchup.py
  |         `-- validate transcript + run owned session-catchup.py
  `-- compose canary, optional catch-up, optional plan
        |
        v
hookSpecificOutput.additionalContext
```

Plan runtime runs first for both `SessionStart` and `UserPromptSubmit`. The adapter does not resolve planning files,
does not read `task_plan.md`/`progress.md`, and contains no parallel plan-selection or injection algorithm.

## 5. Canonical plan contract

`adapter-plan-context-request-v1` 固定：

- runtime：`codex`；
- events：`SessionStart` / `UserPromptSubmit`；
- behavior profile：`managed_legacy`；
- plan/progress 输出上限：50 / 20 行；
- context 上限：20,000 字符；
- 不传 prompt 或 transcript 内容。

`owned-plan.py` 负责：

1. `PLANNING_DISABLED` 和 `PLAN_ID`；
2. active pointer → newest scoped → legacy root 的 canonical precedence；
3. path containment、regular-file、symlink/hard-link、size、UTF-8 和 race 检查；
4. 0700/0600 private snapshot；
5. 用 pristine `inject-plan.sh` 生成 managed-legacy context；
6. timeout、process-group kill、bounded output、cleanup 和 stale cleanup；
7. exact result schema 与 structured diagnostic。

Adapter 只接受完整、关系一致、位于 request root 下的 exact-v1 result。失败或 `inject=false` 时不做
filesystem fallback。

## 6. Catch-up contract

`SessionStart` 才调用 `owned-catchup.py`。输入项目状态必须来自已验证 plan result，而不是 adapter
第二次解析磁盘。

Transcript 选择顺序：

1. Host 提供且通过 containment、regular-file、session identity 校验的 `transcript_path`；
2. 显式 `CODEX_SESSIONS_DIR`；
3. 显式 `$CODEX_HOME/sessions`；
4. 从 managed adapter 安装位置推导的 Codex home；
5. 仅在明确允许时扫描 compatibility fallback roots。

未知 JSONL record 可以诊断并退化到 event-only conversation；损坏、超限、身份不符或不可读数据不能
产生 partial report。长 Cloud wrapper 按固定 head/tail budget 保留尾部 sentinel。

## 7. 信任分层

| 层 | 信任状态 | 规则 |
|---|---|---|
| Codex Hook stdin | untrusted Host data | exact schema/enum/path/identity validation |
| workspace planning files | untrusted project data | contained safe read + private snapshot |
| transcript JSONL | mutable Host data | contained file + session identity + bounded parser |
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

Adapter deadline 为 27 秒，child 与 finalization 必须在该总预算内完成；测试冻结当前 supervision 和
process-group cleanup 语义。

## 9. 来源与 overlay

四个 upstream runtime 文件由 pinned v3.8.2 archive 生成。`resolve-plan-dir.sh`、`inject-plan.sh`、
`ledger-summary.sh` 保持 pristine；`session-catchup.py` 的 owned copy 应用四项受控 Cloud compatibility
overlay：session store、explicit runtime、scoped planning state 和 bounded wrapper context。
四个文件中，只有 `runtime/upstream/session-catchup.py` 与 pristine upstream 不同。

Overlay 只作用于 owned copy，不修改 global Skill。具体 hash、anchor、状态和证据见
`contracts/compatibility-overlays-v1.json` 与 `BASELINE_PROVENANCE.md`。

## 10. Installer 所有权

Installer 负责：

- lock 与原子写入；
- source/runtime/contract hash 和 mode；
- Managed requirements 的 ownership marker 与 merge；
- backup、install、doctor、bounded repair、uninstall；
- installed inventory 和 drift 分类。

Installer 不负责修改 workspace planning，不接管第三方 policy，也不把未知现状自动变成 owned state。

## 11. Release 边界

已发布 `v0.3.0` ZIP 由 22-entry machine allowlist 构建；它的 tag、ZIP、外部 bootstrap 与 SHA 均保持
不可变。未封板 `0.3.1` 候选由 23-entry machine allowlist 构建，新增的非 runtime entry 是 importer
必需的 `patches/patch_planning_skill.py`，从而使解压后的 importer check 自包含。外部 bootstrap 下载并
校验 ZIP，因此绝不能进入它所校验的 ZIP；0.3.1 候选 bootstrap 在 seal 前保持 zero hash 并 fail closed。

stable v0.3.0 已从 exact source `1454c922...` 发布并完成下载复核与 Cloud A～F，现为 accepted
rollback。beta.2 资产保持不可变 previous fallback。候选源码/package/contract 身份不表示已发布。

## 12. 尚未实现

以下能力存在于远期路线或上游，但不属于当前 trusted graph：

- attestation、nonce framing、smart/structured ledger opt-in；
- `PreCompact` / `PostCompact`；
- tool/permission lifecycle；
- advisory/hard Stop completion semantics；
- 通用多 Skill adapter/Driver framework。

它们只能在迁移完成后，通过独立 Discovery Gate、machine contract、tests 和 Cloud acceptance 逐项启用。
