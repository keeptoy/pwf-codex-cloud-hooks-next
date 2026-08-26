# Task Plan: v0.4.4 Source/Candidate C0

## Goal

将已经完成文档补丁但仍为`v0.4.4-dev`的checkout收敛为正式`v0.4.4`候选身份，重新完成candidate admission、本地回归与确定性ZIP双构建，并以新的exact commit冻结真正可供Source/Candidate Cloud验收的C0。

## Authorization

- 已授权：本地正式身份切换、zero-hash candidate bootstrap物化、版本acceptance/programme状态写回、本地验证与本地commit。
- 未授权：push、Cloud task、tag、GitHub Release、资产上传、Latest promotion或任何远端写操作。
- 维护者报告的上一轮Cloud PASS真实对应`v0.4.4-dev` checkout；正式改号会改变Release输入，因此只保留为前序发现证据，不提升为正式`v0.4.4` PASS。

## Stop Conditions

- 本任务只到新C0；不生成带non-zero SHA的正式双资产。正式`dist/`资产必须等待新C0 Source/Candidate Cloud PASS及其exact ZIP SHA。
- 任一identity、contract hash、candidate bootstrap、deterministic ZIP或完整回归无法闭合时停止，不创建C0 commit。
- 不进入push、Cloud、tag、publication或Latest；这些动作留给维护者及后续明确授权。

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

## Next Step

本次单一提交即新的`SOURCE_CANDIDATE_HEAD`。停止在维护者push与正式Source/Candidate Cloud之前；Cloud PASS和正式双资产继续保持PENDING。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 正式资产物化器拒绝在`v0.4.4-dev` checkout生成`v0.4.4`资产 | 1 | 确认为正确fail-closed：先形成stable新C0并重跑Source/Candidate，不复用旧PASS。 |
| 首次生成stable candidate bootstrap时manifest仍固定旧dev contract SHA，materializer拒绝；后续hash读取也因目标未创建而失败 | 1 | 先把新contract exact SHA写回manifest，再重新执行canonical生成/check；没有生成半成品。 |
| 受限执行面内`release-assets`、`release-package`和repository边界测试的Node进程无法spawn Python/Git，`spawnSync.status=null` | 1 | 分类为维护机子进程权限限制；在获批执行面重跑完全相同的测试，不修改或弱化断言。 |
| 获批执行面的repository专项16/17，发现v0.4.4 acceptance链接到README自动中文slug | 1 | 给README教程增加稳定英文显式anchor并改用该anchor；作为Release输入正常进入新C0。 |
| 默认受限执行面运行`bash -n`时Git Bash无法创建signal pipe，Win32 error 5 | 1 | Python compile与`node --check`已先通过；只把两个bootstrap的同一Bash语法检查切到获批执行面。 |
