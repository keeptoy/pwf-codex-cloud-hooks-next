# Progress Log: post-v0.4.2 文档治理扫尾 Discovery

## Session: 2026-08-24

### Phase 1: Recovery and planning lifecycle correction

- **Status:** complete
- 恢复并核对 v0.4.2 closeout planning、活动 pointer、工作树和分支同步状态。
- 通过 `git blame`、pickaxe、commit diff 与 lifecycle helper 追溯唯一-scope断言。
- 确认该断言由 commit `33deb58` 在清退 24 个非活动 scope 后新增；此前稳定治理和 validator 均允许规范 inactive scope。
- 维护者明确判断该要求属于防范过度：复杂项目允许多轮 Discovery planning 并存，由维护者控制可见清退。
- 新建 `.planning/2026-08-24-post-v0.4.2-document-governance-sweep/` 三件套并切换 `.planning/.active_plan`。
- 保留 `.planning/2026-08-23-v0.4.2-release-closeout-candidate-readiness/`，未删除或改写旧账本。
- 从 `tests/repository-boundary.test.js` 删除“planning scope列表必须严格等于active pointer”的快照要求；其余 lifecycle 校验保持不变。

### Phase 2: Targeted documentation/test residue inventory

- **Status:** complete
- 下一步盘点 current tests 对 v0.4.2 临时授权时间线、C2/Phase 9/固定数量和版本角色快照的直接依赖。
- 实际批量治理尚未授权；先形成 RETIRE/MIGRATE/KEEP 建议。
- 第一轮定向扫描完成：确认stable template的只读Shell安全边界断言应保留；标出v0.4.2临时授权事故措辞、`24个`C2数量和可能不可达的v0.4.1 candidate/P9分支作为进一步核对对象。
- 第二轮核对确认v0.4.1 candidate/P9大分支已不可达：candidate由当前package version生成，v0.4.1 current guide已清退，历史P9-F与fallback恢复另有immutable test/oracle负责。旧candidate分支建议整体RETIRE；v0.4.1 predecessor contract和fallback oracle继续KEEP。
- 第三轮核对确认release-package中的P9-B条件已被通用exact-SHA规则覆盖；Phase 4.12六个旧`phase-9-*` anchors无真实入链、仅测试自证，符合pre-1.0兼容别名清退候选。Phase 4.14已有稳定anchors，逐段自然语言断言可迁移为结构/authority检查。
- 退役路径复扫发现CHANGELOG v0.4.1仍相对链接已清退guide，属于确定断链；应迁移到provenance已使用的exact immutable acceptance URL。ROADMAP 4.1的临时授权细节属于真实但重复的current摘要，可在后续authority收敛中缩写并链接历史。
- 精炼全仓相对链接审计覆盖45个tracked Markdown入口后确认2条真实missing targets：CHANGELOG中的v0.3.4与v0.4.1本地acceptance链接；现有本地fragment为0个缺失显式anchor。建议修复链接并新增版本无关的实际link-integrity test，避免只测试治理文案。

### Phase 3: Broader documentation authority and link sweep

- **Status:** complete
- 完成README/ROADMAP、governance、templates、current acceptance、history与tests的职责/引用交叉核对。
- 冻结两档建议：Batch A处理确定死分支、事故措辞断言、一次性数量、无入链aliases、真实断链和通用link audit；Batch B可选收敛Phase 4.14的50个自然语言断言与ROADMAP重复事故摘要。

### Phase 4: Maintainer decision and scoped implementation

- **Status:** waiting for maintainer
- 不提前修改Batch A/B对象；等待维护者明确批准范围后实施并验证。

## Test Results

| Test | Expected | Actual | Status |
|---|---|---|---|
| Focused repository boundary test（沙箱首次尝试） | 多个规范 planning scope 通过；pointer/三件套/状态安全仍受保护 | Node test runner 在加载测试前因 child-process `spawn EPERM` 退出；没有产生产品断言结果 | ENVIRONMENT_BLOCKED |
| `node --test tests/repository-boundary.test.js`（非沙箱执行面） | 多个规范 planning scope 通过；pointer/三件套/状态安全仍受保护 | 14 tests / 14 pass / 0 fail | PASS |
| `npm test` | 无 production/runtime 回归；多个规范 planning scope 被稳定 validator 接受 | 181 tests / 155 pass / 0 fail / 26 skipped；skip均为既有Linux/POSIX-only case | PASS |

## Error Log

| Timestamp | Error | Attempt | Resolution |
|---|---|---:|---|
| 2026-08-24 | 初次组合 Git 追溯命令 exit 1 | 1 | 保留已返回证据，改用定向 Git 命令完成追溯；未重复失败调用。 |
| 2026-08-24 | 沙箱内 Git index lock permission denied；Node test child-process spawn EPERM | 1 | 改用获准非沙箱执行面完成暂存与测试；focused suite 14/14 PASS。 |
| 2026-08-24 | Phase 2首条`rg`命令被PowerShell错误解析双引号正则 | 1 | 命令在搜索前退出；改用单引号正则，未重复原转义。 |

## 5-Question Reboot Check

| Question | Answer |
|---|---|
| Where am I? | Phase 2：定向历史残留盘点。 |
| Where am I going? | 形成 current tests/docs 的 RETIRE/MIGRATE/KEEP 建议，等待维护者批准实施。 |
| What's the goal? | 清除历史快照对长期合同的错误耦合，同时保留真实历史和多轮 planning 恢复能力。 |
| What have I learned? | 唯一-scope断言是 v0.4.2 C2快照过度泛化，不是稳定生命周期设计。 |
| What have I done? | 新建并切换 Discovery；保留旧 scope；删除唯一-scope测试要求；focused与完整Windows回归均已PASS。 |
