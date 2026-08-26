# Task Plan: v0.4.3 Source/Candidate C0 → C1

## Goal

将当前 `v0.4.3-dev` 收敛为正式候选身份 `v0.4.3`，冻结精确C0；在维护者回传真实Source/Candidate PASS后，完成第一轮退役检查和C1状态写回，同时保持Published Release为`PENDING`。

## Authorization

- 已授权：本地身份切换、candidate bootstrap 物化、版本 acceptance/programme 状态写回、本地验证与本地 commit。
- 维护者已于2026-08-26明确报告第一通道全部PASS，并提供绑定C0的9.1原始摘要；按交互纪律直接写回，不扩展或要求重跑。
- 未授权：push、Cloud task、tag、GitHub Release、资产上传、Latest promotion 或任何远端写操作。
- 当前授权扩展到C1证据与第一退役检查的本地commit；后续远端和publication动作仍由维护者负责。

## Stop Conditions

- 不生成带正式 non-zero ZIP SHA 的发布资产；该动作必须等待 Source/Candidate Cloud PASS。
- 任一Release输入、identity、contract hash、bootstrap canonical bytes或完整回归无法闭合时停止，不创建C0 commit。
- 不进入push、Cloud、tag、publication或Latest；这些动作留给维护者及后续明确授权。
- 不猜测本次回传未包含的4.1 ZIP SHA、测试数字或B～E逐步输出；正式资产materialization必须使用实际Cloud 4.1 SHA。

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

### Work Step D: record Source/Candidate PASS and freeze C1

- [x] 核对Cloud 9.1 HEAD、exit code、doctor、contract、inventory、policy与residue证据。
- [x] 执行source-candidate closeout retirement checkpoint；只审查Release-excluded对象，不删除planning或C0输入。
- [x] 把第一通道PASS、retirement结论和下一停止点写入acceptance、ROADMAP与planning。
- [x] 运行相称的文档/仓库边界验证，创建`SOURCE_CANDIDATE_CHECKPOINT_HEAD`本地commit。

## Next Step

C1本地状态写回已闭合。停止在维护者push、tag、资产materialization和Published Release之前；正式资产仍等待实际4.1 Cloud ZIP SHA。
