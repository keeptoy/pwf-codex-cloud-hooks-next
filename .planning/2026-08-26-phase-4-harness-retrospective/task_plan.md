# Task Plan: Phase 4 harness retrospective

## Goal

回顾Phase 4及v0.4.1～v0.4.4 patch/governance列车的执行成本，区分不可变Release真正需要的安全门槛与当前harness造成的重复工作；把可供Product Phase 5评估的精简方向持久化到Phase 4 overview和新的Phase 4.17 history record。

## Authorization

- 已授权：只读分析现有Release/acceptance/tests/history事实，新增Phase 4.17，更新Phase 4 overview、history索引和直接治理断言，本地验证与commit。
- 本轮是回顾与路线输入，不激活Product Phase 5，不分配实现版本，不修改production/runtime/contracts/Release资产。
- 所有远端写操作仍由维护者负责。

## Work Steps

### Work Step A: evidence inventory

- [x] 复核Phase 4 overview、近期history、Release流程、acceptance模板和测试耦合面。
- [x] 量化v0.4.4“小文字改动→完整Release流程”的真实原因与重复成本。

### Work Step B: retrospective model

- [x] 冻结“必须保留 / 可以自动化 / 可以按风险裁剪 / 需要Phase 5 Discovery”的四类结论。
- [x] 给出风险分层、证据复用、文档/包边界和harness自动化的候选方向及fail-closed条件。

### Work Step C: durable documentation

- [x] 新建`docs/history/phase-4.17-phase-4-harness-retrospective.md`，保留完整回顾、问题诊断和Phase 5参考问题。
- [x] 在`docs/product-phases/phase-4.md`加入精简的长期经验与Phase 5输入，不复制流水账。
- [x] 更新history索引和直接治理测试，保持ROADMAP当前列车/Phase 5授权状态不变。

### Work Step D: validation and commit

- [x] 运行文档链接、history角色、repository/architecture边界与diff检查。
- [x] 创建单一范围本地commit并停止。

## Next Step

本轮回顾已完成；创建本地commit后停止。Product Phase 5仍未激活，后继是否开展harness精简Discovery由维护者另行决定。

## Stop Conditions

- 任一改动触及production、runtime、installer、contracts、bootstrap、Release allowlist或公开资产身份。
- 需要修改ROADMAP当前programme、激活Product Phase 5、分配`0.5.0-*`版本列车或改变现行Release gate。
- 工作树出现无法与本任务安全分离的维护者改动，或治理测试暴露本回顾范围之外的真实authority冲突。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| 读取不存在的`docs/history/phase-history-template.md` | 1 | 使用`rg --files`定位真实模板路径，再按实际位置读取。 |
| Windows下`rg tests/*.test.js`把glob当非法路径 | 1 | 改用`rg ... tests -g '*.test.js'`，不重复shell glob路径。 |
| 沙箱内Node test runner创建子进程时报`spawn EPERM` | 1 | 按维护机环境限制在沙箱外重跑同一只读测试命令。 |
| 首轮治理测试暴露活动计划缺`Stop Conditions`、旧history范围冻结到4.16及新断言绑定“现行/当前”同义句 | 1 | 补齐计划停止条件、更新索引范围，并让新测试断言直接绑定“不激活Product Phase 5”的稳定语义。 |
