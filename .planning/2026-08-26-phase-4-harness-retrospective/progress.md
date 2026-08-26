# Progress: Phase 4 harness retrospective

## 2026-08-26

- 维护者授权Phase 4回顾，目标是解释v0.4.4小改动为何触发完整Release，以及为Phase 5保存harness精简方向。
- 新建独立planning scope并切换active pointer；六个既有scope全部保留，本轮不激活Phase 5、不修改production或Release资产。
- 完成第一轮证据盘点：v0.4.4列车六个commit、25个路径；C0涉及15个路径。确认不可变身份成本与harness重复成本必须分开评价。
- 初步冻结四类结论：必须保留、可以自动化、可由fail-closed风险lane裁剪、必须留给Phase 5 Discovery。
- 读取历史模板时使用了不存在的`docs/history/phase-history-template.md`路径；后续先用`rg --files`定位真实模板，不重复猜路径。
- 找到真实模板`docs/phase-history-template.md`并确认Phase 4.17应作为已关闭Phase 4之后的`RETROSPECTIVE_CAPSULE`，不是新Product Phase或正式Discovery授权。
- 当前Cloud稳定template约960行、operator-guide模板与v0.4.4 guide各约260行；重点不是机械删行，而是让固定协议与逐版本增量证据分离。
- Windows下测试搜索的shell glob路径无效；改用`rg -g`完成测试耦合盘点。
- 已新增Phase 4.17 retrospective capsule、Phase 4 overview长期经验、history索引条目与直接治理断言；没有修改ROADMAP或Release输入。
- 首轮repository/architecture测试在沙箱内因Node runner `spawn EPERM`无法启动；沙箱外实际执行27项时24项通过，三项治理格式/断言失败。
- 三项失败均已定界并修正：活动计划补`Stop Conditions`；旧history角色范围更新至Phase 4.17/17项；新测试不再依赖“现行/当前”同义句，改为断言明确的Phase 5不激活边界。
- 定向repository/architecture治理测试复跑通过：27 pass、0 fail。
- 完整`npm test`通过：189 tests、163 pass、0 fail、26 Windows平台诚实skip；本轮没有production、runtime、contract、bootstrap或Release ZIP输入变化。
