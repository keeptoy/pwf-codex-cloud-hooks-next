# Task Plan: Phase 9 instance — v0.4.0 Release Discovery

## Goal

在不修改 candidate/Release字节、不执行 Cloud或远端写入的前提下，复核 `v0.4.0`功能基线进入 standing Phase 9所需的
pre-seal输入、发布/公开验收/晋级顺序、rollback角色轮转和第二轮对象退役审查，形成一个版本作用域明确、可独立授权的
Release实施方案。

## Next Step

等待维护者决定是否单独授权 `P9-A pre-seal materialization`。在新授权前保持 README/package/contracts/bootstrap等 Release
输入不变，不执行 seal、Cloud、publication、promotion或 ref mutation。

## Current Phase

Discovery complete — awaiting P9-A authorization

## Phases

### P9-D0 — Authority, identity and readiness recovery

**Status:** completed

- 绑定 starting HEAD、clean worktree、candidate/accepted/fallback角色与 Phase 4功能基线证据。
- 复核 standing Phase 9、版本 acceptance、provenance、Release contract和活动授权边界。

### P9-D1 — Pre-seal candidate-input inventory

**Status:** completed

- 对账 README、ARCHITECTURE、DESIGN、CHANGELOG、package/manifest/contracts/bootstrap与全部 ZIP entries。
- 把 README最后一处状态耦合列为首个实施项，并扫描其他会随 programme漂移的 Release-input文案。
- 冻结 leaf → contract/hash → candidate → bootstrap的原子传播顺序和 seal restart条件。

### P9-D2 — Release gates and evidence routing

**Status:** completed

- 冻结 pre-seal cleanup、Source/Candidate、seal、publication audit、Published Release、Latest promotion和 postflight的顺序。
- 明确每个 gate的输入、操作者、Cloud环境、证据 authority、停止条件和哪些历史 PASS不能迁移到新字节。

### P9-D3 — Rollback roles and second retirement review

**Status:** completed

- 设计 `v0.3.5 accepted / v0.3.4 fallback`到 `v0.4.0 accepted / v0.3.5 fallback`的角色轮转与恢复证明。
- 对 11个 validation refs、F3 guides/validators、旧版本窗口 contracts/tests/docs逐项给出 KEEP/MIGRATE/RETIRE条件。
- 审查不等于强制删除；任何远端 ref mutation继续需要维护者单独授权。

### P9-D4 — Decision, history record and handoff

**Status:** completed

- 形成 `phase-9-v0.4.0-release-discovery.md`，只记录本列车实例的差异、风险、gate与结论，不复制通用 Phase 9规则。
- 在 Phase 4.11追加最小后继链接，同步 history index/ROADMAP/静态守卫并运行相称本地验证。
- 本地 commit后停止；Discovery conditional-go不自动授权 README修改、seal、publication或第二轮清理。

## Authorization

- 已授权：`v0.4.0` Phase 9 Discovery；本地只读代码/contract/ref/历史审计；Release-excluded planning/history/ROADMAP/
  version-acceptance/tests的最小探路记录；相称本地验证与本地 commit。
- 未授权：修改 README/ARCHITECTURE/DESIGN/CHANGELOG/package/manifest/contracts/bootstrap/runtime/installer或其他 Release输入；
  构建正式 sealed资产；Cloud执行；删除/移动 refs；push/PR/tag/Release/publication/promotion或仓库设置变更。

## Stop Conditions

- Phase 4 aggregate、candidate/accepted/fallback identity、Release contract或 published provenance出现冲突。
- Discovery发现必须先改变 Host ABI、trusted graph、runtime行为或 rollback contract。
- 无法把 README等 ZIP-input变更与旧 `df600104…` evidence明确断开，或无法定义重新验收边界。
- role rotation、公开资产验收或第二轮退役对象缺少 owner、恢复路径、退出条件或维护者授权点。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Combined validation-ref ancestry audit returned exit code 1 after printing all requested facts | 1 | The final `git merge-base --is-ancestor` non-match leaked its normal false status into the combined command. Treat non-ancestry as audit data; future combined probes must normalize each expected non-match and return an explicit final success status. |
| Windows sandbox denied Node test-runner child creation with `spawn EPERM` | 2 | Direct-file execution confirmed the new Phase 9 test itself passes and exposed one real stale ROADMAP assertion; patch that assertion, then rerun the canonical runner with the required process permission rather than treating EPERM as a product/test failure. |
| Parallel Windows postflight made Git Bash fail to create its signal pipe (`Win32 error 5`) | 1 | This is process/sandbox contention, not Bash syntax evidence. Rerun checks sequentially and give only the Bash syntax probe the process permission it requires. |
| First ref-pair postflight used an overly narrow `for-each-ref` prefix and reported zero pairs | 1 | Rerun from `refs/heads/validation` with an explicit `validation/v0.4.0-dev-*` filter and require exactly 11 matching local/origin pairs. |

## Current status

`CONDITIONAL_GO_TO_V0_4_0_PHASE_9_PRE_SEAL_MATERIALIZATION / IMPLEMENTATION_NOT_AUTHORIZED / RELEASE_INPUTS_UNCHANGED / PUBLICATION_NOT_AUTHORIZED`
