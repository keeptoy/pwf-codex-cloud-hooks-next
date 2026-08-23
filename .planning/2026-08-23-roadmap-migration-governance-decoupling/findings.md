# Findings: ROADMAP migration-governance decoupling

## Initial finding

- 第8节的真正programme级合同是：关键迁移可以按风险拆成多个审查/施工停止点，但最终可发布候选必须在同一transaction内原子闭合；每次迁移维护对象生命周期账并在implementation/live两个时间点复核。
- 当前开头用“Phase 4的F1A/F1B”定义通用规则，又称它是“首个完整实例”，把已经完成的历史施工结构重新带回current authority。
- F1A/F1B细节已经由ROADMAP第5节Phase 4路线与Phase history承接，第8节无需再次用它们解释通用规则。
- `migration-transaction-lifecycle-governance`是current稳定anchor；`phase-4-migration-lifecycle-governance`被正文声明为兼容别名，处置前必须审计入链。

## Working direction

- 用版本无关语言直接定义“风险可拆门、发布不可半闭合”。
- 历史Phase 4实例若需要恢复，应由第5节或Phase history承担，而不是留在第8节正文。
- 保留仍有入链的兼容anchor，但将其标明为legacy redirect/compatibility alias，不再让正文围绕Phase 4展开。

## Reference audit

- current tree中`phase-4-migration-lifecycle-governance`只出现在ROADMAP定义和architecture contract断言，没有current文档入链；但正文已经公开承诺它是兼容别名，仍可能存在仓库外旧链接，因此本轮保留anchor。
- F1A/F1B在ROADMAP第5节Phase 4路线以及Phase 4.2/4.3等history中已有完整恢复路径；从第8节删除实例叙述不会丢失历史事实。
- 第8节的测试应从“必须出现F1A/F1B实例”翻转为“必须按风险/ownership/故障域决定拆分，且正文不得出现F1A/F1B”。
- Phase 4.14已经解释对象生命周期治理的来源与历史偏差；本轮不需要再次扩大历史摘要，只修改current programme authority及其contract。
