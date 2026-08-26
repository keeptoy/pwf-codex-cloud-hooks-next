# Task Plan: v0.4.4 C0 → C1 → Published Release → C2

## Goal

将`v0.4.4-dev`收敛为正式`v0.4.4` C0，闭合Source/Candidate、第一轮退役检查和C1；在维护者完成immutable publication、Published Release PASS与Latest promotion后，完成第二轮role-window退役检查、programme角色轮转和C2最终治理写回。

## Authorization

- 已授权：本地正式身份切换、zero-hash candidate bootstrap物化、版本acceptance/programme状态写回、本地验证与本地commit。
- 维护者已明确报告正式C0 Cloud PASS并提供exact ZIP SHA；按交互纪律直接写回和物化，不要求重跑或扩展验收。
- 维护者已明确报告tag创建/push、Release publication和第二通道全部PASS；按提供的实际结论写回，不额外联网诊断或要求重跑。
- 维护者已明确报告远端已push且`v0.4.4`早已设为Latest；按ROADMAP正常路径直接执行第二轮retirement与C2，不另设只读postflight。
- 未授权：push、Cloud task、tag、GitHub Release、资产上传、Latest promotion或任何远端写操作。
- 维护者报告的上一轮Cloud PASS真实对应`v0.4.4-dev` checkout；正式改号会改变Release输入，因此只保留为前序发现证据，不提升为正式`v0.4.4` PASS。

## Stop Conditions

- 正式双资产只使用维护者提供的Cloud exact ZIP SHA，并写入ignored `dist/`；不得修改C0 Release输入或用C1替代C0 tag目标。
- 任一identity、contract hash、candidate bootstrap、deterministic ZIP或完整回归无法闭合时停止，不创建C0 commit。
- 不进入push、Cloud、tag、publication或Latest；这些动作留给维护者及后续明确授权。
- C2只允许旋转programme文档/oracle和清退退出role window的本地版本化材料；不得改写immutable tag、Release、公开ZIP/bootstrap或C0。

## Work Steps

### Work Step A: formal candidate admission

- [x] 核对当前checkout、Release contract、materializer和上一版stable C0模式。
- [x] 确认`dev → stable`会改变ZIP输入，旧Cloud PASS不能覆盖新字节。
- [x] 建立版本acceptance与非破坏性对象分类。

### Work Step B: materialize v0.4.4 identity

- [x] 将package、Release contract、manifest hash和根candidate bootstrap原子收敛为`v0.4.4`。
- [x] 同步CHANGELOG、ROADMAP、Phase 4 overview、acceptance与直接依赖的测试断言。
- [x] 保持runtime、Host ABI、trusted graph和已发布v0.4.3身份不变。

### Work Step C: validate and freeze C0

- [x] 运行identity、contract、bootstrap、importer、Release builder和完整本地回归。
- [x] 双构建candidate ZIP并核对exact SHA、size、entries和字节一致性。
- [x] 审查diff并创建单一范围本地C0 commit，报告`SOURCE_CANDIDATE_HEAD`后停止。

### Work Step D: record PASS, materialize assets, and freeze C1

- [x] 核对维护者的正式C0 PASS结论与Cloud ZIP SHA；确认与本地C0确定性SHA一致。
- [x] 执行source-candidate closeout retirement checkpoint；不删除planning或C0输入。
- [x] 用canonical materializer生成并复验正式ZIP与non-zero bootstrap。
- [x] 把PASS、第一退役结论、资产identity和下一停止点写回acceptance、ROADMAP与planning。
- [x] 运行相称的仓库/文档边界验证并创建`SOURCE_CANDIDATE_CHECKPOINT_HEAD`本地commit。

### Work Step E: record Published Release and clarify empty-repository baseline

- [x] 记录tag/source、公开ZIP/bootstrap exact identity和维护者确认的第二通道PASS。
- [x] 分类C步骤首次停止为empty-repository解释偏差，而非runtime/Hook缺陷。
- [x] 在稳定Cloud模板明确：`.planning`与active pointer同时缺失是合法首次创建状态；只对已有目标、错误类型或不安全pointer报冲突。
- [x] 同步ROADMAP、acceptance、planning与直接边界断言；保持Latest/第二轮retirement/C2为PENDING。
- [x] 运行相称验证并创建Published Release checkpoint本地commit。

### Work Step F: role-window closeout and C2

- [x] 记录维护者确认的Latest正常成功状态，不重复下载资产或重算公开SHA。
- [x] 对accepted/candidate/fallback窗口对象逐项完成`RETIRE/MIGRATE/KEEP`决定；六个planning scope继续`KEEP`。
- [x] 冻结当前v0.4.4 tracked bootstrap为exact public SHA，迁移publication oracle并清退退出窗口的v0.4.3 current guide/bootstrap。
- [x] 同步ROADMAP、provenance、v0.4.4 acceptance、Phase 4 overview、CHANGELOG引用和直接测试断言。
- [x] 运行相称focused/full验证，创建`PUBLISHED_RELEASE_CLOSEOUT_HEAD`本地commit后停止。

## Next Step

v0.4.4第二轮role-window closeout与C2已经完成；创建本地`PUBLISHED_RELEASE_CLOSEOUT_HEAD`后停止。下一开发列车与Product Phase 5均未授权。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 正式资产物化器拒绝在`v0.4.4-dev` checkout生成`v0.4.4`资产 | 1 | 确认为正确fail-closed：先形成stable新C0并重跑Source/Candidate，不复用旧PASS。 |
| 首次生成stable candidate bootstrap时manifest仍固定旧dev contract SHA，materializer拒绝；后续hash读取也因目标未创建而失败 | 1 | 先把新contract exact SHA写回manifest，再重新执行canonical生成/check；没有生成半成品。 |
| 受限执行面内`release-assets`、`release-package`和repository边界测试的Node进程无法spawn Python/Git，`spawnSync.status=null` | 1 | 分类为维护机子进程权限限制；在获批执行面重跑完全相同的测试，不修改或弱化断言。 |
| 获批执行面的repository专项16/17，发现v0.4.4 acceptance链接到README自动中文slug | 1 | 给README教程增加稳定英文显式anchor并改用该anchor；作为Release输入正常进入新C0。 |
| 默认受限执行面运行`bash -n`时Git Bash无法创建signal pipe，Win32 error 5 | 1 | Python compile与`node --check`已先通过；只把两个bootstrap的同一Bash语法检查切到获批执行面。 |
| 默认沙箱创建materializer系统临时目录时返回WinError 5 | 1 | 在获批执行面重跑相同canonical命令；首次失败未生成v0.4.4半成品。 |
| 首次辅助复验用“全文不得出现64个零”判断sealed bootstrap，误命中脚本合法的placeholder拒绝常量 | 1 | 改为精确核对`HOOKS_VERSION`与`HOOKS_SHA256`默认赋值行；不修改生成资产。 |
| Published Release C步骤首次报告`BASELINE_CONFLICT reason=.planning_and_active_plan_missing` | 1 | 维护者澄清空仓库允许首次创建后整条通道PASS；模板补充合法空状态与真正冲突矩阵。 |
| C2首次组合补丁因provenance表头上下文不完全匹配而整体拒绝 | 1 | 拆成按文件的小补丁并使用当前精确行；没有产生部分写入。 |
| provenance两行替换补丁漏给第二行增加标记，patch parser拒绝 | 1 | 改为独立“插入v0.4.4行”和“替换v0.4.3链接”hunk，成功应用。 |
| phase/changelog/bootstrap组合补丁因bootstrap实际含`readonly`而拒绝 | 1 | 文档与bootstrap拆开；按精确赋值行修改，没有部分写入。 |
| C2只读复扫命令中的PowerShell反引号造成字符串终止错误 | 1 | 将status、diff、rg、tag/hash拆成独立命令并使用安全单引号模式。 |
| C2首轮focused为36/39，三项治理断言漂移 | 1 | 分别拆分ROADMAP同anchor重复入口、放宽跨行授权摘要正则、给CHANGELOG补当前acceptance链接；未改生产或Release输入。 |
| C2首轮完整回归161/188、1 fail、26 skip：transition测试仍比较accepted角色 | 1 | C2后transition predecessor应等于immediate fallback；只修测试角色解析和标题，合同字节不变。 |
| C2后运行C0专用`candidate-bootstrap`只读检查，拒绝覆盖sealed tracked bootstrap | 1 | 分类为正确lifecycle refusal；C2只用`release`命令幂等复验正式双资产，不再运行zero-hash candidate命令。 |
