# Progress: Phase 4 Discovery

## 2026-08-11

- 维护者明确要求进入 Phase 4 Discovery。
- 读取 `planning-with-files` 与 `openai-docs` skill，先从官方 OpenAI 文档恢复当前 Hook/Cloud ABI。
- 官方 Hooks 文档确认当前事件集合已包含 compaction、tool/permission、Stop 等后续 Phase 邻接能力，并明确 managed
  hook、并发、`SessionStart` source 与 transcript 非稳定接口语义；未据此扩大 Phase 4 production scope。
- 官方 Cloud environment 文档确认 setup/agent 环境、secret、最长 12 小时 cache、default-branch setup 与 chat-branch
  resume/maintenance 生命周期；记录为后续 Fresh/Resume/cache threat model 输入。
- 关闭 current-tree cleanup scope 的 C2 Discovery，保留 `CONDITIONAL_GO` 为 Phase 4 输入；新建并激活
  `.planning/2026-08-11-phase-4-discovery`。
- 当前只完成 D0 并启动 D1；未修改 production、contracts、tests、Release inputs 或远端/Cloud 状态。
- 首次 lifecycle focused test 为 14/15：新 task plan 使用 `## Stop conditions`，未满足 repository-boundary 的
  exact heading contract；已改为 `## Stop Conditions`，分类为 planning fixture drift，不弱化测试。
- 修正后 `repository-boundary` 与 `architecture-contracts` focused suite 15/15 PASS；`git diff --check` PASS。
- 创建本地 D0 commit `4a6d4ed`（`docs: open phase 4 discovery`）；未 push。
- D1 首轮文件盘点确认 ignored full pinned extraction 可用；识别三个未准入 Phase 4 canonical skill candidates
  `attest-plan.sh`、`ledger-append.sh`、`phase-status.sh`，以及上游 `.codex` integration glue。后者不因存在就进入
  当前 adapter-only trusted graph。
- 已读 canonical `inject-plan.sh` 与 `attest-plan.sh`：确认 autonomous/gated 是 mode，smart injection 是正交 token；
  attestation 承担 tamper defense，nonce 只加固 delimiter；attester 会写用户 planning state，不能绕过 owned safe-state
  boundary 直接准入 production。
- 已读 `ledger-append.sh`、`ledger-summary.sh`、`phase-status.sh` 与 `init-session.sh` 的 mode 初始化路径：确认 ledger/phase
  writer 使用会超时后继续的 advisory lock，初始化会先落 mode/nonce 状态且吞掉 attestation failure。已将“读取语义”与
  “可信写入/激活语义”拆成两个待决架构面，尚未准入任何新文件。
- 已核对 upstream `.codex/hooks.json`、SessionStart/UserPromptSubmit/Stop glue 与 canonical Skill 引用：未发现 Hook 对
  `ledger-append.sh` 或 `phase-status.sh` 的隐式调用；上游 Codex glue 还存在直接读取 workspace、绕过 canonical injector 的
  行为分叉，明确维持 denied，不作为 managed implementation 基础。
- 已映射当前 adapter → exact-v1 plan request → `owned-plan.py` → private snapshot → pristine injector 链：snapshot 只复制
  plan/progress，正是所有 v3 marker 当前不可达的原因。初步确认可以扩展安全只读投影，但 attestation authority 与 cache owner
  不能靠“多复制几个文件”自动解决。
- 一次盘点命令误读不存在的 `contracts/managed-hook-request-v1.json` 并以 exit 1 结束；实际合同名是
  `adapter-plan-context-request-v1.schema.json`，随后已读取正确 request/result contracts。未产生代码改动。
- D1 inventory 已冻结：现有四个 pristine 文件足以覆盖候选 read-only rendering closure；三个 deferred shell writer
  都不是 Hook 隐式依赖，不应整包准入。当前 private snapshot 的 child cache 位于 snapshot 内且随调用清理，v3 cache
  若需持久化必须另设 owner。D1 完成，进入 D2 semantic model。
- D1 milestone 首次 focused runner 未执行断言：Windows `node --test` 启动两个测试文件子进程时均报 `spawn EPERM`。
  已分类为 runner/sandbox limitation，按计划改用单进程逐文件入口复跑原测试内容。
- 单进程入口内部仍需调用 Git 子进程，同样被沙箱以 `EPERM` 拒绝；随后在获批的沙箱外只读环境重跑原
  `node --test` 命令，15/15 PASS，`git diff --check` PASS。D1 研究记录可独立提交。
- 首次本地 commit 尝试因沙箱禁止创建 `.git/index.lock` 失败；没有文件被 staged 或提交，准备使用获批沙箱外
  本地 Git 完成同一范围的 commit，不含远端动作。
- D1 已创建本地 commit `92933e8`（`docs: freeze phase 4 source inventory`），未 push。
- D2 已冻结 mode composition 与主要失败语义：smart 是正交选择；gated 的 context 半边不等于 Phase 8 Stop gate；
  upstream substring mode parser、invalid-nonce static fallback、ledger helper 缺失时 raw-progress fallback，以及 ledger
  filename/heading 注入面都需要 owned policy 收紧。attestation 只定义为 workflow change detector，不宣称独立身份认证。
- D2 targeted upstream test 首次用 `python -m unittest` 加带连字符目录路径，loader 将路径误当 module name，5 个
  `_FailedTest` 均未执行真实断言；改为在 pinned extraction 根目录逐脚本运行。
- 逐脚本运行后，首个 upstream test 的 21 cases 中 5 个只读 case 通过、16 个在创建系统 `%TEMP%` fixture 时
  `PermissionError`；后续四个脚本因 fail-fast 未运行。分类为沙箱 tempfile limitation，准备在沙箱外重跑同一组。
- 沙箱外首个脚本 21/21 PASS；第二个 smart-injection 脚本因 Windows Python 默认 GBK 无法解码 Hook 输出中的
  UTF-8 标点而出现 reader-thread `UnicodeDecodeError`，7 个 case 随后拿到 `stdout=None`。分类为平台编码设置，
  以 `PYTHONUTF8=1` 重跑全部 targeted scripts；未弱化断言。
- 设置 `PYTHONUTF8=1` 后，五个 pinned upstream targeted scripts 分别 21/21、8/8、7/7、7/7、12/12 PASS，
  共 55/55。该结果证明已记录的 upstream 当前语义；不证明 proposed managed policy 或 Linux/Cloud acceptance。
- D2 完成：冻结 legacy/smart/autonomous/gated 组合、失败/缓存语义与 parser/data gaps；进入 D3 Host/Cloud ABI 对齐。
- D2 已创建本地 commit `b34240c`（`docs: model phase 4 upstream semantics`），未 push。
- D3 对齐确认现有两个 managed events 足以承载 Phase 4；官方新增事件继续留给 Phase 5～8。发现 upgrade opt-in
  问题：v0.3.5 可能已忽略 workspace 中既有 `.mode`，新版本不能突然承认它。推荐在同一 `.mode` 中增加并严格要求
  `codex-managed-v1` token；`gate` 在 Phase 4 明确 unsupported，避免只启用半套 gated 语义。
- Cloud fixture 首次按猜测文件名读取失败；真实带日期证据是 `tests/fixtures/cloud/hook-observations-v1.json`，其 startup/
  resume 与 input-key shape 由 `cloud-fixtures.test.js` 固定。未产生 production 改动。
- D3 完成：Phase 4 保持两个现有 managed events，使用 versioned per-plan opt-in 防止旧 `.mode` 在升级后误激活；
  Fresh/Resume/cache/rollback 必须覆盖 pre-existing marker 与显式 re-arm。
- D4 完成并推荐 hybrid：owned-plan 严格读取/验证并生成 normalized private snapshot，pristine injector/ledger-summary
  只渲染规范化输入。拒绝直接 workspace execution、完整 Python renderer duplication 与当前引入 persistent managed DB。
- D5 完成：Phase 4 不准入新 upstream executable；bundle v2 把现有 adapter 纳入 `local_files`，四个内部 ABI schema
  统一安装。结构分区后删除 `origin`，并删除 overlay tombstone 与无 operational consumer 的 language/host metadata。
  C2 + Phase 4 进入同一 alpha train，但拆为 `[legacy]` inactive foundation 与后续 smart/autonomous activation 两个 gate。
- D6 完成：冻结 marker/nonce/attestation/ledger exact grammar、tamper/race/cache/concurrency 边界、v0.3.5 双向 takeover
  与 local/Linux/no-live Cloud/Release 分层矩阵。Phase 4 不持久化 cache、不写 workspace、不把 workflow attestation
  描述为 human identity proof。
- D7 完成：结论 `CONDITIONAL_GO_TO_F1_INACTIVE_FOUNDATION`。F1 只允许在未来明确授权后落 exact-v2/schema-4、
  adapter bundle admission、统一 installed ABI schemas、plan protocol v2 与 `[legacy]` 不可达实现；F2 smart/autonomous、
  live Cloud、Release 继续是独立授权。Discovery 到此停止。
- Discovery 封板 focused governance 15/15 PASS，`git diff --check` PASS；全程未修改 production、machine contracts、
  tests、package/Release identity 或远端状态。

## 2026-08-12

- 按维护者要求，把已封板的 Discovery 结果整理为 `docs/history/phase-4.1-managed-v3-discovery.md`，并登记历史索引。
  文档把 Phase 4.1 明确标为第一轮 Discovery 里程碑，不把 F1 foundation、smart/autonomous activation 或 Release
  描述为已实施事实；活动 Next Step 仍是等待维护者决定是否授权 F1。
- 恢复 authority 时误用不存在的 PowerShell `Get-RawContent`；已改用标准 `Get-Content -Raw -Encoding UTF8`，没有
  文件改动或证据丢失。
- Phase 4.1 历史摘要与索引完成后，repository/architecture focused governance 15/15 PASS，`git diff --check`
  PASS；未改变 production、contracts、tests、Release inputs 或活动 F1 未授权状态。
- 按维护者要求，把“Phase 4.1 是否继承 Phase 3.9.3、Phase 4～9 是否需要调路”的复核结论整理为
  `docs/history/phase-4.2-programme-route-review.md` 并登记索引。记录确认总体风险顺序不变，提出 F1A/F1B、
  F2A/F2B/F3、activation/disarm protocol、Phase 6 可选 NO_GO、Phase 7/8 共用 evaluator 与 Phase 9 standing
  Release gate 等后续校准输入。
- Phase 4.2 只保存讨论溯源：未修改 ROADMAP 当前 authority，未授权 F1/F2/Cloud/Release，也未修改 production、
  machine contracts、tests 或 Release inputs；活动 Next Step 继续等待维护者决定是否授权 F1。
- Phase 4.2 文档、索引与 planning 记录完成后，repository/architecture focused governance 15/15 PASS，
  `git diff --check` PASS；验证没有把讨论建议提升为当前 programme authority。
