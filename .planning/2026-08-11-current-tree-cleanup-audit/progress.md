# Progress: Current-tree Cleanup Audit

## 2026-08-11

- 恢复 planning-with-files session、根级文档权威与已完成 v0.3.4 promotion 计划。
- 确认进入审计前工作树干净，建立独立 discovery-only cleanup audit；尚未修改任何 production、contract
  或测试文件。
- 完成首轮文件与引用清单：确认 Phase metadata 已退出 machine contract，manifest/bundle authority 已分工；
  `ledger-summary.sh` 仍横跨 pristine upstream、bundle、ZIP 与 installed inventory，不能按孤儿文件处理。
- 完成模块规模与 DESIGN 验证路由盘点；锁定三个静态治理测试为断言必要性审计重点，未发现并行 production
  dispatch 或 patcher/overlay 代码复活。
- 恢复 ledger 条件调用与 private snapshot 数据流：确认当前不可达是受 managed-legacy snapshot 保证，而非
  文件无依赖；开始复核 machine schema 安装边界和 manifest/bundle 剩余 provenance 交叉核验。
- 完成 architecture/repository 静态测试首轮逐项阅读；已区分结构/供应链断言与锁死中文文案或 test title 的
  元测试，后者形成下一兼容版本的低风险精简候选。
- 完成历史/debt marker 扫描，发现 installed notice 的 overlay 陈述已过期，并识别 bundle 中
  `managed_sha256`/empty `overlay_ids` 等 overlay-era contract tombstone；继续评估其变更风险与优先级。
- 回读 Phase 3.6 与 retirement commit，确认 tombstone 的历史形成；完成 manifest 字段 consumer 和文档入口
  扫描，发现无 consumer 的 `skill_version`，未发现孤立文档或明显未调用 production 函数。
- 追溯 installed plan schemas 与 notice 历史；确认 schema 安装无 runtime loader、notice 是遗漏更新。审计 Release
  contract/builder 后发现 mode 第二 authority 与多项未消费 metadata，列入独立 contract-v2 候选。
- 复核 planning 生命周期：旧 scope 不会由 `.active_plan` 自动删除，当前 5 个 completed scope 可由维护者在后续
  lifecycle rotation 中按节奏清退；它们不进入 Release/trusted graph，因此不是本轮紧急风险。
- 完成 D2 建议矩阵初稿：明确 `ledger-summary.sh` 与高价值安全断言保留；notice/history/test-title/prose locks
  属于下一兼容树精简；bundle/manifest/release schema 债务必须拆成独立 contract + Release gate；installed schema
  策略留给 Phase 4 Discovery。
- 完整本地回归通过：`npm test` 为 126 tests / 114 pass / 0 fail / 12 Windows POSIX SKIP；importer check healthy，
  `git diff --check` 通过。审计结论已冻结，未修改 production、contracts、tests 或 Release 输入。
- 首次 planning-only 自动提交因 sandbox 拒绝创建 `.git/index.lock` 而未暂存任何文件；按仓库纪律保留现场，
  改为在沙箱外对四个精确 planning 路径提交，不扩大范围。
