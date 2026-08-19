# Task Plan: Phase 9 instance — v0.4.0 Release

## Goal

完成 `v0.4.0` standing Phase 9的版本化 gate。P9-A 已把 Phase 4功能基线迁移为稳定的 pre-seal source candidate；
当前 P9-B本地字节封印已完成；sealed-source Cloud前先闭合维护者授权的 Release-excluded ROADMAP信息架构治理，重新生成
最终 sealed-source HEAD，再执行 exact-HEAD Cloud handoff。Cloud证据未返回前，P9-B不得记为完整 PASS。

## Next Step

ROADMAP第 4/5章结构治理已闭合并验证；下一步只讨论维护者点名的 P9/F3B2段落应删除、压缩还是迁移，未获维护者决定前
不改这两段。该讨论关闭并形成最后一个 Release-excluded commit后，新 commit才是 exact sealed-source HEAD；维护者 push并
完成 Cloud PASS前停止，不进入 P9-C。

## Current Phase

P9-B3b ROADMAP current-status paragraph disposition

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

### P9-B0 — Authority and byte-identity preflight

**Status:** completed

- 绑定 clean P9-A source commit和冻结 candidate事实，不从文档口号推断字节身份。
- 在写 bootstrap前独立重建两份 ZIP，并要求 22 entries、85,519 bytes与 frozen SHA完全一致。

### P9-B1 — Exact external-bootstrap seal

**Status:** completed

- 只把 frozen candidate SHA写入 `init-cloud-sandbox-v0.4.0.bash` 的默认 checksum。
- 计算并记录 bootstrap SHA；再次证明 bootstrap在 ZIP外且 candidate字节未变化。

### P9-B2 — Local and ref-aware regression

**Status:** completed

- 跑完整 Windows、本地静态、deterministic build和 ref-aware publication/rollback矩阵。
- 对账 changed paths：任何 ZIP entry变化都使 P9-B失败并退回 P9-A。

### P9-B3 — Sealed-source Cloud handoff

**Status:** in_progress

- 回补 local seal事实并创建单一职责本地 commit；回传 exact sealed-source HEAD和两份资产 SHA。
- 维护者 push后，从 exact HEAD运行 Source/Candidate Cloud gate；只有其 PASS才能关闭 P9-B并请求 P9-C。

### P9-B3a — ROADMAP information architecture governance

**Status:** completed

- 保留维护者已建立的独立 Product Phase顶层章节，不回滚用户改动。
- 把 Phase 4 gate/opt-in/lifecycle长期路线迁入 Product Phase章；当前列车章只承载 current role/Phase 9 lifecycle。
- 临时4.6逐 gate流水账退出 ROADMAP并由 history/acceptance继续承载；仅保留候选原子闭合与迁移生命周期账规则。
- 暂不决定维护者点名的 P9/F3B2两段去留；先完成结构、focused governance验证与本地 commit，再进入该讨论。

### P9-B3b — ROADMAP current-status paragraph disposition

**Status:** in_progress

- 在新的第 4/5章边界下复核两段是否仍有独立 programme价值，区分 current state、稳定 Release规则与历史原因。
- 优先删除已由第2节、4.1、Release章节和历史证据承载的重复信息；如有唯一稳定规则，只保留最小一句并放入唯一 authority。
- 未经维护者决定不改这两段；任何结论仍不得改动 ZIP input或重开 P9-C。

## Authorization

- 已授权：P9-B本地封印；重新构建并核验 P9-A candidate；只把 exact ZIP SHA写入 ZIP 外 stable bootstrap；计算 bootstrap SHA；
  修改 Release-excluded tests/planning/history与当前 acceptance/ROADMAP的 gate状态；维护者当前进一步授权 ROADMAP第4/5章
  信息架构治理、相称静态守卫与本地 commit。
- 未授权：修改任何 ZIP entry、package/contract/manifest/README或 production/runtime字节；由本地智能体执行 Cloud；创建/移动/
  删除 refs；push/PR/tag/Release/publication/promotion；上传资产、修改 Latest或仓库设置；P9-C；切换 `0.5.0-dev`/Phase 5。

## Stop Conditions

- 写 bootstrap前或写入后，candidate不是 22 entries、85,519 bytes、SHA-256
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`，或双构建不一致。
- 除 stable bootstrap checksum、Release-excluded gate记录/守卫外还需要修改任何 ZIP input、production/runtime、contract或 manifest。
- bootstrap不再是 ZIP外资产、checksum不是 frozen candidate SHA，或无法冻结其自身 SHA。
- 本地/ref-aware回归失败，或 Cloud要求 source修复；前者停止分类，后者明确退回 P9-A而不是继续 seal。
- 任何步骤需要远端 ref/Release/publication/promotion、P9-C或下一版本动作。
- ROADMAP治理需要改动 README或任何 ZIP input，删除维护者点名后置讨论的 P9/F3B2段落，或把历史流水账重新复制到另一宏观章节。

## Errors Encountered

| Error | Attempt | Resolution |
|---|---:|---|
| Combined validation-ref ancestry audit returned exit code 1 after printing all requested facts | 1 | The final `git merge-base --is-ancestor` non-match leaked its normal false status into the combined command. Treat non-ancestry as audit data; future combined probes must normalize each expected non-match and return an explicit final success status. |
| Windows sandbox denied Node test-runner child creation with `spawn EPERM` | 2 | Direct-file execution confirmed the new Phase 9 test itself passes and exposed one real stale ROADMAP assertion; patch that assertion, then rerun the canonical runner with the required process permission rather than treating EPERM as a product/test failure. |
| Parallel Windows postflight made Git Bash fail to create its signal pipe (`Win32 error 5`) | 1 | This is process/sandbox contention, not Bash syntax evidence. Rerun checks sequentially and give only the Bash syntax probe the process permission it requires. |
| First ref-pair postflight used an overly narrow `for-each-ref` prefix and reported zero pairs | 1 | Rerun from `refs/heads/validation` with an explicit `validation/v0.4.0-dev-*` filter and require exactly 11 matching local/origin pairs. |
| Full P9-A suite treated a stable package name as proof that bootstrap must already have an exact hash | 1 | Stable identity begins in P9-A while seal belongs to P9-B. Derive accepted status from ROADMAP and checksum state from actual bytes; allow zero hash only for a non-accepted candidate and keep it fail closed. |
| First P9-B PowerShell audit interpolated `$tag:` as an invalid drive-qualified variable | 1 | Delimit the variable as `${tag}:`; rerun the complete audit rather than treating the parser error as repository evidence. |
| ROADMAP focused Node runner again hit Windows sandbox `spawn EPERM` | 1 | Reran the exact two-file command with process permission; all 18 tests passed, so this remained a platform launch limitation. |

## Current status

`P9_B_LOCAL_SEAL_PASS / SEALED_SOURCE_CLOUD_PENDING / STOP_BEFORE_P9_C / PUBLICATION_NOT_AUTHORIZED`
