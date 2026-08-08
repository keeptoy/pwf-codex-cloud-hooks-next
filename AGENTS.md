# 仓库智能体入口

本文件适用于整个仓库。它定义阅读顺序、文档权威、稳定安全边界和验证规则，不复制临时测试
数字或某轮流水账。若子目录以后增加更具体的 `AGENTS.md`，仍不得绕过根级 trust/Release 边界。

## 必读顺序

1. 读 `README.md`：支持的稳定行为、安装、doctor/repair 和开发入口。
2. 读 `ARCHITECTURE.md`：组件职责、Host contract、trusted graph 和失败语义。
3. 读 `DESIGN.md`：仓库模块、实现层次、改动落点和验证路由。
4. 读 `ROADMAP.md`：当前 migration/Product Phase、Cloud gate 和 Release 路线。
5. 读 `.planning/.active_plan`，再读活动计划的 `task_plan.md`、`findings.md`、`progress.md`。
6. 只读当前任务直接相关的 contracts、源码、tests 和专项文档。
7. 修改前运行 `git status --short --branch`，保留用户已有改动。

恢复、resume、`/clear` 或 context compaction 后重复以上流程，不凭历史对话猜授权范围。

## 文档权威与智能体职责

面向人的完整“问题 → 唯一权威”表只在 [`README.md` 的“开发状态与文档地图”](README.md#documentation-map)
维护，本文件不复制第二份。智能体额外遵守以下执行入口：

| 智能体必须确认的事项 | 读取位置 |
|---|---|
| 当前唯一 Next Step、授权、禁止事项和停止条件 | 活动 `.planning/<slug>/task_plan.md` |
| 当前研究、实施、验证和错误证据 | 活动 `findings.md` / `progress.md` |
| gate 内 schema/hash/inventory/Host ABI 技术语义 | 当前任务直接相关的 machine contract |
| 已完成 gate 的不可变历史证据 | README 文档地图指向的对应专项 acceptance/runbook |

冲突时：当前用户指令优先，但不会自动扩大破坏性、发布、部署或外部变更权限；活动 task plan
控制当前 gate；专项 contract 控制 gate 内技术语义；ROADMAP 控制 programme 路线；README 不能把
未实现能力变成事实；历史验收只作证据，不产生新需求。

## 文档同步

- 稳定结论只提升到 README 文档地图指定的唯一 authority；其他位置保留最小摘要和链接。
- AGENTS 只维护智能体读取顺序、冲突规则、trust/Release 安全边界和强制验证，不维护当前 lifecycle。
- 已发生的版本 delta 只写 CHANGELOG；programme/lifecycle 只写 ROADMAP；不可变身份只写 provenance/
  acceptance。
- 跨文档深链接必须指向目标文件中的稳定英文显式命名锚点；不得把标题编号、中文文字或自动 heading
  slug 当作长期链接合同。
- 当前 Next Step/禁止/停止条件只写 task plan；实施、测试和错误写 progress，研究取舍写 findings。
- 历史 acceptance/runbook 保留时间语义，不用当前状态批量改写；不要在多个宏观文档复制流水账。

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
- 所有已发布版本的 tag、ZIP/bootstrap 字节、URL、SHA 和 acceptance 均不可变；精确身份见
  `BASELINE_PROVENANCE.md`，当前版本角色只见 `ROADMAP.md`。

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
bash -n init-cloud-sandbox-v0.3.1.bash
bash -n init-cloud-sandbox-v0.3.2.bash
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
- pointer-only rollback/`Latest` promotion 不得改写 sealed README 或其他 ZIP 输入；tag 后 current-state
  治理进入 ROADMAP、版本 acceptance 和活动 planning，README 在下一新版本 seal 中再同步。

## Programme 与历史证据入口

当前开发列车、版本角色、Product Phase 与授权状态只读 `ROADMAP.md` 和活动 task plan。已完成迁移、
已发布版本、不可变 refs/资产与 Cloud 验收只读 `BASELINE_PROVENANCE.md` 及其链接的专项 acceptance；
不得在本文件冻结第二份 commit、测试计数、逐 gate 状态或 rollback 层级。
