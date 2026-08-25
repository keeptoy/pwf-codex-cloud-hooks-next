# Task Plan: v0.4.3 Source/Candidate C0

## Goal

将当前 `v0.4.3-dev` 收敛为正式候选身份 `v0.4.3`，完成非破坏性 candidate admission、本地构建与回归，建立仍为 `PENDING` 的版本 Cloud 验收入口，并以单一 Git commit 冻结精确 `SOURCE_CANDIDATE_HEAD`。

## Authorization

- 已授权：本地身份切换、candidate bootstrap 物化、版本 acceptance/programme 状态写回、本地验证与本地 commit。
- 未授权：push、Cloud task、tag、GitHub Release、资产上传、Latest promotion 或任何远端写操作。
- 本任务只到 C0；Source/Candidate Cloud 在维护者 push 后运行。Cloud 未实际执行前不得写为 PASS。

## Stop Conditions

- 不生成带正式 non-zero ZIP SHA 的发布资产；该动作必须等待 Source/Candidate Cloud PASS。
- 任一Release输入、identity、contract hash、bootstrap canonical bytes或完整回归无法闭合时停止，不创建C0 commit。
- 不进入push、Cloud、tag、publication或Latest；这些动作留给维护者及后续明确授权。

## Work steps

### Work Step A: candidate admission preflight

- [x] 读取当前 authority、Release contract、身份文件、模板和上一版本 acceptance。
- [x] 盘点所有 C0/ZIP/bootstrap 输入及候选外治理材料，不做退役删除。
- [x] 冻结最小改动范围与验证路线。

### Work Step B: materialize stable candidate identity

- [x] 将 package/contract/transition/bootstrap 身份收敛为 `v0.4.3`。
- [x] 从 canonical template 生成根目录 zero-hash candidate bootstrap，移除旧 dev bootstrap。
- [x] 新建 `v0.4.3` acceptance，Source/Candidate 与 Published Release 均保持真实 `PENDING`。
- [x] 同步 CHANGELOG、ROADMAP 和直接依赖的索引/断言。

### Work Step C: validate and freeze C0

- [x] 运行 identity、contract、bootstrap、release builder/importer 和完整本地回归。
- [x] 双构建候选 ZIP 并核对字节一致；记录本地 SHA/entries/size，但不冒充 Cloud PASS。
- [x] 检查 diff、工作树与 candidate admission；创建单一范围本地 commit。
- [x] 报告精确 `SOURCE_CANDIDATE_HEAD`，停止在 push/Cloud/tag 之前。

## Next Step

本地C0工作已闭合。停止在维护者push与Source/Candidate Cloud之前；下一步只在维护者带回真实Cloud结果后继续C1。
