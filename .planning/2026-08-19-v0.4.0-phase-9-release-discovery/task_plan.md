# Task Plan: Phase 9 instance — v0.4.0 Release

## Goal

完成 `v0.4.0` standing Phase 9的版本化 gate。当前只实施 P9-A：把已关闭的 Phase 4功能基线迁移为稳定但尚未 sealed的
pre-seal source candidate，原子闭合文档、版本身份、Release contract/hash、bootstrap/acceptance命名和 mixed v2/v1
publication oracle；保持 bootstrap zero hash并停止在 P9-B之前。

## Next Step

P9-A 已闭合并停止。下一步只能是维护者审阅本地 commit 后决定是否另行授权 P9-B；若授权，P9-B 只允许把本次冻结的
stable candidate ZIP exact SHA 写入 ZIP 外 bootstrap、完成 final-source/Cloud seal evidence，并在任何 ZIP input变化时退回 P9-A。

## Current Phase

P9-A4 regression, candidate freeze and handoff

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

### P9-A0 — Authority, clean-tree and change ledger

**Status:** completed

- 绑定起始 HEAD、角色窗口、Release v2 inventory和 P9-A授权/禁止边界。
- 全仓扫描 `0.4.0-dev`、旧 acceptance/bootstrap路径、README/F3 current prose和 publication oracle消费者。
- 冻结每个 Release/治理对象的 owner、动作、依赖传播、验证和下一 review条件。

### P9-A1 — Failing guards for stable identity and mixed publication window

**Status:** completed

- 先让 repository/Release tests表达 stable candidate、acceptance/bootstrap rename和无重复文件。
- 让 archived source通过其自身 manifest路由 Release contract，并移除 current version literal。
- 把 direct downgrade refusal与受支持 uninstall → clean-install fallback → exact forward recovery分别守住。

### P9-A2 — Stable pre-seal materialization

**Status:** completed

- 把 README状态耦合改为永久 authority说明；把 ARCHITECTURE/DESIGN/ROADMAP/CHANGELOG/provenance current narrative收敛到
  已完成 Phase 4与未开始 seal的准确窗口。
- 原子迁移 package、Release contract、manifest raw SHA、acceptance/bootstrap文件名和 bootstrap默认版本到 `0.4.0`。
- bootstrap ZIP SHA保持64位 zero hash；不预填 provenance row，不改变 runtime bundle、installed transition或 production行为。

### P9-A3 — Dynamic publication and role-window oracles

**Status:** completed

- archived published source只通过它自己的 manifest/contract构建，不硬编码 v1/v2或版本分支。
- current installer版本从 package派生；future v2 accepted + v1 fallback采用已验证 rollback/forward route。
- 保留 immutable direct old-over-current refusal与 no-mutation断言。

### P9-A4 — Regression, candidate freeze and handoff

**Status:** completed

- 跑 focused/full Windows、importer/compile/Node/Bash syntax、deterministic双构建与 exact inventory/hash检查。
- 证明 development旧 SHA仅留在历史 evidence；生成新的 pre-seal stable candidate SHA，但不写入 bootstrap。
- 审计旧路径/旧符号、Release changed-path交集和对象生命周期；回补 history/acceptance/planning并本地 commit，停止在 P9-B。

## Authorization

- 已授权：P9-A pre-seal implementation；修改 README/ARCHITECTURE/DESIGN/CHANGELOG/ROADMAP/provenance current narrative、
  package/Release contract/manifest raw hash、bootstrap/acceptance命名与内容、Release-excluded tests/planning/history；构建本地
  zero-hash pre-seal candidate；相称本地验证与本地 commit。
- 未授权：P9-B exact ZIP SHA写入或 seal；Cloud执行；创建/移动/删除 refs；push/PR/tag/Release/publication/promotion；上传资产、
  修改 Latest或仓库设置；切换 `0.5.0-dev`/Phase 5；改变 Host ABI、trusted graph、runtime/installer行为或 installed transition。

## Stop Conditions

- 任一改动需要改变 Host ABI、trusted graph、runtime/installer行为、installed transition或 rollback contract。
- stable identity无法按 package → contract/raw SHA → manifest → acceptance/bootstrap原子闭合，或出现 dev/stable双 authority。
- 新 candidate不 deterministic、旧 `df600104…`被误提升为 stable evidence，或 bootstrap不再保持64位 zero hash。
- published oracle无法同时支持当前 v1/v1窗口与未来 v2/v1窗口，或为绿色结果削弱 direct downgrade refusal。
- 任何步骤需要 Cloud、seal、远端 ref/Release/promotion或下一版本动作。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Combined validation-ref ancestry audit returned exit code 1 after printing all requested facts | 1 | The final `git merge-base --is-ancestor` non-match leaked its normal false status into the combined command. Treat non-ancestry as audit data; future combined probes must normalize each expected non-match and return an explicit final success status. |
| Windows sandbox denied Node test-runner child creation with `spawn EPERM` | 2 | Direct-file execution confirmed the new Phase 9 test itself passes and exposed one real stale ROADMAP assertion; patch that assertion, then rerun the canonical runner with the required process permission rather than treating EPERM as a product/test failure. |
| Parallel Windows postflight made Git Bash fail to create its signal pipe (`Win32 error 5`) | 1 | This is process/sandbox contention, not Bash syntax evidence. Rerun checks sequentially and give only the Bash syntax probe the process permission it requires. |
| First ref-pair postflight used an overly narrow `for-each-ref` prefix and reported zero pairs | 1 | Rerun from `refs/heads/validation` with an explicit `validation/v0.4.0-dev-*` filter and require exactly 11 matching local/origin pairs. |
| Full P9-A suite treated a stable package name as proof that bootstrap must already have an exact hash | 1 | Stable identity begins in P9-A while seal belongs to P9-B. Derive accepted status from ROADMAP and checksum state from actual bytes; allow zero hash only for a non-accepted candidate and keep it fail closed. |

## Current status

`P9_A_PRE_SEAL_MATERIALIZATION_PASS / ZERO_HASH_CANDIDATE_FROZEN / STOP_BEFORE_P9_B / PUBLICATION_NOT_AUTHORIZED`
