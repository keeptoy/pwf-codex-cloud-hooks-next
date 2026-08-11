# Progress: Source Logic and Route Analysis

## 2026-08-11

- 完成 planning-with-files session catch-up；进入本轮时工作树干净。
- 按根级顺序恢复 README、ARCHITECTURE、DESIGN、ROADMAP 与上一活动 planning。
- 确认上一 cleanup audit 已结束；建立新的只读源码逻辑分析现场，未修改 production、contracts、tests 或 Release 输入。
- 完成 A0：盘点全部 tracked source/contracts/tests/docs 与 production/maintenance 函数入口；开始 A1 runtime 调用图逐函数阅读。
- 逐行阅读 `hooks/hook_adapter.py`：冻结 Host 输入预算、plan-first dispatch、typed child validation、进程组监督、单次 JSON 输出与 canary/catch-up/plan 降级语义。
- 阅读 `owned-plan.py` 前半：确认 exact request 双边验证、受控 child 环境、fd-relative/no-follow 文件读取、竞态身份复核与 session attachment 状态机。
- 完成 `owned-plan.py`：恢复 resolver authority、private snapshot 投影、受限 stale cleanup、pristine injector 调用、注入前后 directory identity 复核与 POSIX-only boundary。
- 阅读 `owned-catchup.py` 前半：确认 exact request、immutable transcript capture、Host path 优先、identity/project fail-closed 与显式 store fallback 的全局候选选择。
- 完成 `owned-catchup.py` 并回读 pinned helper closure：恢复 planning-update 水位线、Codex record 去重/降级、bounded renderer 和 diagnostic-only 路径。
- 阅读 pristine resolver 与 injector 前半：确认 canonical selection precedence，以及 private snapshot 如何让上游 v3 opt-in/attestation 分支在 managed production 中保持不可达。
- 完成 A1 runtime 调用图：读完 injector 与 ledger 条件分支，确认当前 managed-legacy reachability 和 Phase 4 候选能力之间的边界；进入 A2 供应链/安装链。
- 读完 package、manifest、runtime bundle、四个 ABI schema 与 Release artifact：冻结 provenance index、唯一 source/install inventory、installed-schema 投影与 ZIP allowlist 的分层关系。
- 逐行阅读 importer：确认 raw bundle/archive 双重 SHA、strict full-bundle validation、archive member/root gate、exact destination inventory 和 staging/atomic import。
- 阅读 installer 前半：恢复 package hash投影、global Skill pristine检查、atomic shared-state写入、TOML ownership parser/merge与 Managed adapter-only policy。
- 完成 installer：冻结 installed-manifest现场快照、doctor drift分类、install/repair/uninstall锁/备份/并发检查与 unknown-state fail-closed。
- 完成 A2：读完 deterministic builder 与外部 bootstrap，冻结 upstream→source→ZIP→bootstrap→installed runtime→Managed policy 的端到端信任链；进入测试/路线综合。
- 盘点 16 个 test modules 的全部可枚举 case与平台 skip条件；完成 runtime、供应链、安装、compatibility、publication和治理证据的第一轮反向映射。
- 深读 activation/golden/Cloud fixture/contracts/pristine boundary测试，确认测试确实跨层验证 sibling trusted graph、失败矩阵、最终字节兼容、Cloud-shaped replay与 helper closure，而非只按文件名宣称覆盖。
- 完成 A3：结合 CHANGELOG与Phase历史索引恢复 v0.1 trust失败→v0.2 managed policy→Phase 1供应链→Phase 2 owned catch-up→Phase 3 canonical plan→3.6/3.7/3.8收敛→v0.3.4 accepted 的演进路线，并分层未来工作。
- 首次并行验证因 Windows sandbox中的 Git Bash signal-pipe平台错误中止且未保留分项输出；已记录并改为顺序验证，不重复同一聚合方式。
- importer check healthy；`npm test` 沙箱内因 worker spawn EPERM无有效产品结果，沙箱外完整重跑通过 126/114/0/12 SKIP。
- Python compile、Node syntax、external Bash syntax与 `git diff --check` 全部通过；A4完成，结论与后续三层路线已冻结，未修改production/contracts/tests/Release输入。
