# 仓库智能体入口

本文件适用于整个仓库。它定义阅读顺序、文档权威、稳定安全边界和验证规则，不复制临时测试
数字或某轮流水账。若子目录以后增加更具体的 `AGENTS.md`，仍不得绕过根级 trust/Release 边界。

## 必读顺序

1. 读 `README.md`：支持的稳定行为、安装、doctor/repair 和开发入口。
2. 读 `ARCHITECTURE.md`：组件职责、Host contract、trusted graph 和失败语义。
3. 读 `ROADMAP.md`：当前 migration/Product Phase、Cloud gate 和 Release 路线。
4. 读 `.planning/.active_plan`，再读活动计划的 `task_plan.md`、`findings.md`、`progress.md`。
5. 只读当前任务直接相关的 contracts、源码、tests 和专项文档。
6. 修改前运行 `git status --short --branch`，保留用户已有改动。

恢复、resume、`/clear` 或 context compaction 后重复以上流程，不凭历史对话猜授权范围。

## 文档权威

| 文件 | 唯一回答的问题 |
|---|---|
| `README.md` | 稳定支持行为，以及怎么安装、修复、测试和打包 |
| `ARCHITECTURE.md` | 为什么这样设计，组件和信任边界是什么 |
| `ROADMAP.md` | 后续 migration/Product Phase、Cloud 与 Release gate |
| `BASELINE_PROVENANCE.md` | beta.2、M1、上游和 overlay 从哪里来、如何复现 |
| `MAINTAINER_HANDOFF.md` | 新人如何接手、分类变更、验证、发布和回滚 |
| 活动 `.planning/<slug>/task_plan.md` | 当前唯一 Next Step、授权、禁止事项和停止条件 |
| 活动 `findings.md` / `progress.md` | 研究结论、实施和错误证据 |
| `docs/beta3-dev-m3-cloud-equivalence.md` | 已完成 M3 的 transport、no-live Cloud seal、disposable setup、Fresh/Resume 和历史停止门槛 |
| `docs/beta3-dev-m4-cutover-plan.md` | 已完成 M4 的 public main、default/protection、旧仓库导航、rollback 和接受证据 |
| `docs/v0.3.0-beta.2-cloud-hard-acceptance.md` | 不可变 beta.2 A～F 与资产验收证据 |
| `docs/git-file-modes.md` | Windows/Linux mode、LF 检查与恢复 |

冲突时：当前用户指令优先，但不会自动扩大破坏性、发布、部署或外部变更权限；活动 task plan
控制当前 gate；专项 contract 控制 gate 内技术语义；ROADMAP 控制 programme 路线；README 不能把
未实现能力变成事实；历史验收只作证据，不产生新需求。

## 文档同步

- 稳定用户行为、命令：README；频繁变化的 gate/Next Step 不复制进 README。
- 稳定架构、Cloud 事实、职责：ARCHITECTURE + findings。
- migration/Product Phase、Cloud、Release、rollback：ROADMAP + task plan。
- baseline/upstream/overlay/资产来源：BASELINE_PROVENANCE + machine contract。
- 当前 Next Step/禁止/停止条件：task plan。
- 实施、测试、错误：progress；稳定研究结论进入 findings。
- 运维流程：MAINTAINER_HANDOFF；mode/LF 专项进入 `docs/git-file-modes.md`。

不要在多个宏观文档复制逐轮流水账。

## 稳定架构与安全边界

- 当前唯一支持的集成是 `OthmanAdi/planning-with-files v3.8.2`，不得描述为通用转换器。
- global PWF Skill 必须 pristine。production 只能执行 installer 管理、manifest/allowlist 固定并
  校验的 owned runtime；不得从用户 Skill 目录执行可变脚本。
- Managed policy 只注册 absolute adapter。`owned-plan.py`、`owned-catchup.py` 是 adapter sibling，
  不是平台 handler。
- 不因 pinned upstream 中存在某脚本就推断它已导入、安装或激活。
- `/opt/codex` 是带日期 Cloud 默认事实，不是永久常量；优先显式 Host input/config/受控探测。
- `session_id` 和已验证 `transcript_path` 是首选；store 扫描只能是显式 compatibility fallback。
- transcript JSONL 是可变 Host data；未知、损坏或身份不符不得造成 partial injection。
- integrity 和内容注入 fail closed；advisory child failure 对 Codex loop fail open，且不能抑制
  canary 或其他已验证上下文。
- 发布过的 beta.2 ZIP/bootstrap 字节、URL 和 SHA 不可变；当前 v0.3.0 candidate 已封板但不是
  Release，直到 S3 发布和 A～F 关闭前仍不得作为 production rollback。

## Discovery 与 gate

- 每个新 Product Phase 第一轮必须重新恢复证据、扫描 Cloud/代码/文档事实、复核假设并冻结退出条件。
- 激活、迁移、root commit、push、cutover、schema/Host ABI/trusted graph、Release 或 rollback
  属于关键 gate，必须先有专项设计和维护者授权。
- 出现 Cloud/本地冲突、架构分歧或 timeout/权限/进程/数据安全模型变化时，暂停并增加探路 gate。
- 只实施活动 task plan 明确授权的最小 gate；前一 gate 未通过不得顺手进入下一 gate。

## 代码与验证

- 修改 production 前先补最近边界测试，再跑风险相称的完整回归。
- 常用基线：

```bash
python3 tools/import_upstream_runtime.py check
npm test
python3 -c "from pathlib import Path; [compile(p.read_text(encoding='utf-8'), str(p), 'exec') for p in map(Path, ['hooks/hook_adapter.py','runtime/owned-plan.py','runtime/owned-catchup.py'])]"
node --check install.js
bash -n init-cloud-sandbox-v0.3.0.bash
git diff --check
```

- Windows 的 POSIX/Linux-only case 必须诚实 SKIP；Linux/Cloud gate 不可被 Windows 数字替代。
- 测试数量从 runner 获取，不在本文件冻结历史计数。
- runtime、installer、contract、manifest、Release 边界变化必须跑完整 suite 和对应平台 gate。
- 测试失败先分类为 product defect、test defect、platform limitation 或 fixture drift；不得为绿色结果
  弱化安全断言。
- 四个 `runtime/upstream/*` 文件必须且仅它们保持 Git `100755`；详见 mode 文档。

## Release 规则

- 禁止 moving branch、`latest` 或无 checksum artifact。
- ZIP 必须由 `contracts/release-artifact-v1.json` 精确 allowlist 构建；bootstrap 永远在 ZIP 外。
- 普通 development bootstrap 使用 64 位 zero hash 并 fail closed；正式 candidate 只能在全部 ZIP
  输入冻结、双构建一致后写入该 ZIP 的精确 hash，封板后任一 ZIP 输入变化都要求重新开始 seal。
- 正式顺序：冻结版本/ZIP 输入 → build/check ZIP → 计算 ZIP SHA → 写入 bootstrap → 计算
  bootstrap SHA → 发布 → 重新下载双资产验证。
- RC/canary 不能替代最终字节验收；任何重新打包都需要新身份、新 hash 和重新冒烟。

## 当前迁移边界

M1 exact mirror、M2 slim transformation、M3 Cloud equivalence 和 M4 repository cutover 已完成。
M4-C 在 `main@0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151` 通过 Fresh Cloud/Linux no-live
验收；Cloud-tested development `39795283...` 与 audit `bbad3703...` 保持不动，旧仓库仍是
不可变 beta.2 Release/rollback 权威。当前 successor 是后续源码维护权威；不改变行为且保留
canary 的 stable `v0.3.0` candidate 已在 S1 冻结身份和资产字节，尚未发布。当前活动计划已经
进入 S2 Cloud prepublication seal。禁止把 candidate 理解为 tag/Release、live
`/opt/codex`、production behavior 或 Product Phase 4 授权；Product Phase 4 必须等 stable S3
关闭后再独立授权。
