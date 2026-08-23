# Findings: Phase history alias-anchor retirement

## Carried audit evidence

- Phase 4.13有8个旧`phase-4-12-*` aliases；Phase 4.14有10个旧`phase-4-13-*` aliases。
- 当前有效history索引和跨history链接使用canonical编号；旧alias只观察到测试断言依赖。
- 仓库处于pre-1.0迭代期，无current入链的旧anchor不承担第三方兼容合同。

## Scope boundary

- 本轮删除的是兼容alias定义与对应测试冻结，不删除历史文档、历史正文或canonical anchors。
- completed planning retirement属于另一个独立事务，不在本轮处理。

## Authority recovery

- README/ARCHITECTURE/DESIGN确认本轮只属于Release-excluded纯文档治理，不触及runtime、machine contract、package或published identity。
- ROADMAP 9.3明确规定：`0.x`阶段没有current入链的旧alias可直接退休；改名/清退必须先做入链inventory并在删除后复扫。
- repository governance要求删除与引用迁移原子闭合，并检查README/ROADMAP、history、provenance、CHANGELOG、templates、planning、tests及其他repository docs。

## Exact document shape

- Phase 4.13每个canonical `phase-4-13-*` anchor后紧跟一个旧`phase-4-12-*` alias，共8组；正文与canonical标题不依赖旧alias。
- Phase 4.14每个主要canonical `phase-4-14-*` anchor后紧跟一个旧`phase-4-13-*` alias，共10组；两个后续post-* canonical anchors没有旧alias。
- repository-boundary tests分别完整检查Phase 4.13/4.14 canonical anchor集合；旧alias只另有一条historical-position存在性断言，删除该断言不会削弱canonical coverage。

## Inbound inventory result

- 精确提取结果为Phase 4.13旧alias 8个、Phase 4.14旧alias 10个，与前序审计一致。
- tracked仓库中指向`phase-4.13-...md#phase-4-12-*`或`phase-4.14-...md#phase-4-13-*`的链接命中为0。
- `phase-4-13-historical-position`仍被history索引和Phase 4.14正文用作Phase 4.13文件的canonical目标；本轮只删除它在Phase 4.14文件中的重复alias定义，不删除Phase 4.13中的canonical定义。
- 测试中的旧alias依赖仅为两条historical-position存在性断言；canonical数组及索引入链断言继续覆盖正确目标。

## Post-retirement verification

- 删除后Phase 4.13旧`phase-4-12-*` anchor计数为0，canonical `phase-4-13-*` anchor仍为8。
- 删除后Phase 4.14旧`phase-4-13-*` anchor计数为0，canonical `phase-4-14-*` anchor仍为12（含两个后续status anchors）。
- 两条旧alias测试断言已归零；canonical数组、history索引、跨history链接和Release exclusion断言未改变。
- 完整运行`tests/architecture-contracts.test.js`与`tests/repository-boundary.test.js`：22 tests PASS、0 fail。
- `git diff --check`通过；没有修改production、contracts、package、Release inputs或历史正文。
