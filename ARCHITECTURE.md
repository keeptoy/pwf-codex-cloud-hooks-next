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

## 3. 部署图

```text
fixed upstream v3.8.2 archive
        |
        | importer + manifest + compatibility overlay
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

Release ZIP 由 22-entry machine allowlist 构建。外部 bootstrap 下载并校验 ZIP，因此绝不能进入它
所校验的 ZIP。当前 stable v0.3.0 candidate 已按最终 ZIP SHA 封板；在 S2/S3 Cloud 与发布后验收
完成前它仍不是 Release 或 rollback。beta.2 资产保持不可变。

## 12. 尚未实现

以下能力存在于远期路线或上游，但不属于当前 trusted graph：

- attestation、nonce framing、smart/structured ledger opt-in；
- `PreCompact` / `PostCompact`；
- tool/permission lifecycle；
- advisory/hard Stop completion semantics；
- 通用多 Skill adapter/Driver framework。

它们只能在迁移完成后，通过独立 Discovery Gate、machine contract、tests 和 Cloud acceptance 逐项启用。
