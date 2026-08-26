# Task Plan: v0.4.3 Release C0 → C2

## Goal

将当前 `v0.4.3-dev` 收敛为正式身份 `v0.4.3`，冻结精确C0并闭合双通道Cloud；在维护者明确第二轮对象决定后形成C2并轮转programme角色。

## Authorization

- 已授权：本地身份切换、candidate bootstrap 物化、版本 acceptance/programme 状态写回、本地验证与本地 commit。
- 维护者已于2026-08-26明确报告第一通道全部PASS，并提供绑定C0的9.1原始摘要；按交互纪律直接写回，不扩展或要求重跑。
- 维护者已于2026-08-26明确报告Published Release整条通道全部PASS，并提供9.2 exit 0原始摘要。
- 未授权：push、Cloud task、tag、GitHub Release、资产上传、Latest promotion 或任何远端写操作。
- 当前授权覆盖Published Release与Latest状态写回；第二轮涉及删除current guide/bootstrap时仍等待维护者明确决定。

## Stop Conditions

- 不执行push、Cloud、tag、publication、Latest或其他远端写操作。
- 不改写immutable tag、ZIP、bootstrap、URL或SHA；本次只保存已形成的公开证据。
- 不自动删除planning；任何current guide/bootstrap退役也先等待维护者明确决定。

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

### Work Step E: record Published Release and Latest

- [x] 按维护者最终结论记录固定版本`0.4.3`模板的Published Release整通道PASS与9.2 exit 0。
- [x] 核对公开ZIP/bootstrap identity、tag source与GitHub Latest状态。
- [x] 把Published Release和Latest真实证据写入acceptance、ROADMAP与planning，不创建产品补丁。
- [x] 在维护者明确具体对象决定后进入role-window closeout。

### Work Step F: role-window closeout and C2

- [x] 把v0.4.2长期入链迁到包含完整C2的immutable Git ref，再清退current guide/bootstrap。
- [x] 把v0.4.3 tracked bootstrap冻结为公开资产exact bytes；核对tag、ZIP/bootstrap与provenance identity。
- [x] 保留四个planning，轮转accepted/fallback/deeper-fallback，关闭当前开发列车但不激活Product Phase 5。
- [x] 追加acceptance final Post-run，更新Phase 4 overview、ROADMAP、provenance与动态oracles/治理断言。
- [x] 运行完整本地回归和Release边界验证，创建`PUBLISHED_RELEASE_CLOSEOUT_HEAD`本地commit。

## Next Step

C2内容与验证已经闭合；创建单一范围的`PUBLISHED_RELEASE_CLOSEOUT_HEAD`本地commit，然后停止在任何远端写操作或Product Phase 5激活之前。
