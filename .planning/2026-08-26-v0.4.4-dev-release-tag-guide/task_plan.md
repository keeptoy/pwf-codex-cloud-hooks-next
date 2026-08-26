# Task Plan: v0.4.4-dev Release tag guide

## Goal

在不改写已发布v0.4.3身份的前提下，开启v0.4.4-dev文档补丁列车，为README补齐Source/Candidate PASS后创建并推送exact C0 annotated tag的新人教程，并同步Phase 4长期摘要与Phase 4.16历史账本。

## Authorization

- 已授权：开启`v0.4.4-dev`文档补丁列车；更新README、版本身份、Phase 4 overview、新建Phase 4.16、相应测试和本地commit。
- 未授权：push、创建或推送真实tag、Cloud task、GitHub Release、资产上传、Latest或其他远端写操作。
- 四个既有planning scope继续保留；本任务只新增并激活第五个scope。

## Stop Conditions

- 不对真实远端执行README示例中的tag/push命令。
- 不移动或改写immutable v0.4.3 tag、ZIP、bootstrap、URL、SHA或acceptance。
- 不把`v0.4.4-dev`描述成C0、Cloud PASS、candidate、Release或Product Phase 5激活。

## Work Steps

### Work Step A: identity and documentation discovery

- [x] 盘点从accepted v0.4.3切换到v0.4.4-dev所需的原子身份文件和测试断言。
- [x] 冻结README tag教程的安全顺序、PowerShell变量与fail-closed检查。
- [x] 确定Phase 4 overview、Phase 4.16、ROADMAP和CHANGELOG的最小同步范围。

### Work Step B: materialize v0.4.4-dev train

- [x] 更新package、Release contract、manifest和zero-hash development bootstrap身份。
- [x] 在README双资产小节补充C1 push后创建并单独推送exact C0 annotated tag的教程。
- [ ] 同步ROADMAP、CHANGELOG、Phase 4 overview并新建Phase 4.16历史记录。

### Work Step C: verify and commit

- [x] 更新相应静态与Release边界测试。
- [x] 运行完整本地回归、deterministic ZIP/bootstrap、importer与语法检查。
- [ ] 审计diff并创建单一范围本地commit；停止在任何远端写操作前。

## Next Step

审计并创建v0.4.4-dev身份/README/overview交付commit A；随后以其exact hash建立Phase 4.16 cold evidence。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 首次恢复读取使用了三个位置参数调用PowerShell `Join-Path` | 1 | 改为嵌套`Join-Path -Path ... -ChildPath ...`；没有文件修改或上下文丢失。 |
| 一次planning补丁因冗余上下文未匹配而被拒绝 | 1 | 重新读取当前文件后使用精确上下文；apply_patch未产生部分写入。 |
| focused tests首次35/37，两个失败均为文档/测试生命周期漂移 | 1 | 恢复authority链接顺序；把architecture版本断言改为动态派生后重跑。 |
| focused复跑36/37，剩余复合regex错误冻结正文顺序 | 2 | 拆为“不冒充C0”和“第五个active planning”两条直接语义断言。 |
| 首轮完整suite 157 pass / 4 fail / 26 skip | 1 | 补v0.4.3 sealed bootstrap source，并把candidate predecessor轮转到current accepted v0.4.3后重跑。 |
| predecessor专项复验仍因v0.4.2 canonical upstream值失败 | 2 | 从immutable v0.4.3 tag计算并更新exact canonical upstream SHA。 |
| 一次混合补丁因planning上下文未匹配被拒绝 | 1 | 拆分production与planning补丁；apply_patch原子拒绝，未形成部分状态。 |
