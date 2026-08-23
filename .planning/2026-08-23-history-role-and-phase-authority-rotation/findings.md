# Findings: history roles and Product Phase authority rotation

## Two history identities

- `RETROSPECTIVE_CAPSULE`：对象关闭后根据immutable evidence回补的精选总复盘；同一闭合Product Phase/train/interlude最多一份，且没有长期解释价值时可以不建。
- `FROZEN_DISCOVERY_RECORD`：正式Discovery/decision round当时形成、round关闭后冻结的决策记录；同一Product Phase可以有多份，保留当时假设、证据、conditional-go与stop rules，可按证据追加post-*状态但不能重写原结论。
- 现有治理把所有history统称capsule并写成“一个Phase一份”，与Phase 4.1～4.11的多轮Discovery事实冲突，需要纠正而不是删除这些记录。

## Preliminary classification

- Phase 0～3.9.3及Phase 4.12～4.14的索引文字明确为回顾性谱系、迁移标签、维护者里程碑或closeout回补，归`RETROSPECTIVE_CAPSULE`。
- Phase 4.1～4.11是当时的Discovery、route review、implementation planning或closure decision record，归`FROZEN_DISCOVERY_RECORD`；4.3虽名为implementation plan，仍属于正式decision round记录而不是事后总复盘。

## Authority rotation

- 活动Product Phase期间，第4节是current train/programme工作台；活动planning、尚未封存的Discovery材料及需要current状态的验收材料可以引用其exact train anchor。
- 正式Discovery Round关闭后可把record冻结进history；若Product Phase仍活动，其current-authority link可暂指第4节。
- Product Phase closeout时，只把长期Product目标、路线、边界与结论提炼进第5节对应`product-phase-N`；必要时新建retrospective capsule，并把所有current-authority links从第4节迁至第5节Phase-level anchor。
- Release/版本列车轮转前必须完成旧第4节入链inventory与迁移，再替换为下一列车；版本资产、SHA、Cloud流水与角色事实不进入第5节。
- patch/governance列车没有新Product Phase时，不创建第5节伪Phase；多个Phase同列车时分别closeout到第5节，列车只在最终Release closeout时轮转一次。

## Current document and test seams

- `repository-governance-guide`第8.1节目前只定义Phase capsule，并把“一闭合阶段一份摘要”错误应用到整个history目录；适合改为两角色总则并新增8.2 authority rotation。
- `phase-history-template`目前只接受“阶段关闭后回补摘要”，但其append-only post-*结构实际也服务Discovery record；模板应先选record role，再应用不同的admission/cardinality规则。
- `docs/history/README`现有25条索引对象可分类为14个`RETROSPECTIVE_CAPSULE`与11个`FROZEN_DISCOVERY_RECORD`：Phase 4.1～4.11为后者，其余为前者。
- repository-boundary的history governance case已集中读取guide/template/index，适合冻结两种role与计数；architecture contract适合冻结ROADMAP第4→第5节的简短programme路由。

## Wording audit

- 治理文件中的泛称必须使用`history object/record`；只有明确指向回补身份时才使用`capsule`，否则会把正式Discovery record重新误读为“一Phase一摘要”。
- “不得逐Round归档”的旧规则不能原样保留；真正要拒绝的是聊天、测试批次、施工子门槛或候选版伪装成正式Discovery Round。
- 模板骨架必须按role解释`Historical position`、`Completed delivery`与`Acceptance conclusion`：round关闭不等于Product Phase关闭，Discovery决定/证据也不等于implementation/live已经完成。
