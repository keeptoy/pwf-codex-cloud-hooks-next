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
