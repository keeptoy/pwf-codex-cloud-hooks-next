# Task Plan: Phase 9 instance — v0.4.0 Release

## Goal

完成 `v0.4.0` standing Phase 9的版本化 gate。P9-A 已把 Phase 4功能基线迁移为稳定的 pre-seal source candidate；
当前 P9-B本地字节封印与exact-HEAD sealed-source Cloud均已完成；setup/deep-check HEAD、Cloud deterministic ZIP与本地seal
identity完全一致。P9-C immutable publication与独立publication audit均已完成：`v0.4.0` lightweight tag固定指向P9-B实际
验收的`fe8cd7f…`，公开Pre-release恰好包含两项冻结资产，下载ZIP与tag-source重建字节一致。P9-D公开默认下载链、Fresh、
canonical context、real Resume与9.2 manifest-routed deep check均已PASS。P9-E pointer-only promotion/postflight也已由维护者
执行并完成只读交叉核对：`v0.4.0`现为stable Latest，immutable tag与双资产未变；本轮进入P9-F第二轮对象退役与列车交接。

## Next Step

维护者push本地P9-F closeout commit。该commit只关闭v0.4.0列车并保存accepted/fallback与对象生命周期账；在维护者另行决定
patch/minor版本、Product Phase和新活动计划前，不创建或切换任何后继development列车，也不清理validation refs。

## Current Phase

P9-F complete / maintainer push pending / next train undecided

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

**Status:** completed

- 回补 local seal事实并创建单一职责本地 commit；回传 exact sealed-source HEAD和两份资产 SHA。
- 维护者 push后，从 exact HEAD运行 Source/Candidate Cloud gate；只有其 PASS才能关闭 P9-B并请求 P9-C。

### P9-B3a — ROADMAP information architecture governance

**Status:** completed

- 保留维护者已建立的独立 Product Phase顶层章节，不回滚用户改动。
- 把 Phase 4 gate/opt-in/lifecycle长期路线迁入 Product Phase章；当前列车章只承载 current role/Phase 9 lifecycle。
- 临时4.6逐 gate流水账退出 ROADMAP并由 history/acceptance继续承载；仅保留候选原子闭合与迁移生命周期账规则。
- 暂不决定维护者点名的 P9/F3B2两段去留；先完成结构、focused governance验证与本地 commit，再进入该讨论。

### P9-B3b — ROADMAP current-status paragraph disposition

**Status:** completed

- 在新的第 4/5章边界下复核两段是否仍有独立 programme价值，区分 current state、稳定 Release规则与历史原因。
- 优先删除已由第2节、4.1、Release章节和历史证据承载的重复信息；如有唯一稳定规则，只保留最小一句并放入唯一 authority。
- 未经维护者决定不改这两段；任何结论仍不得改动 ZIP input或重开 P9-C。

### P9-B3c — Sealed-source Cloud operator entry

**Status:** completed

- 继续使用现有版本 acceptance，不创建第二份 Phase 9 acceptance authority。
- 只记录操作顺序、动态 HEAD绑定、模板锚点、回传字段和停止条件；通用 Bash脚本仍由 Cloud hard acceptance template唯一维护。
- 文档/守卫/活动 planning保持 Release-excluded；验证后本地 commit并把其 exact HEAD交给维护者 push。

### P9-B4 — Sealed-source Cloud evidence closure

**Status:** completed

- 记录 4.1 setup、B～E Host链与9.1 deep-check实际结果，不复制通用执行脚本。
- 要求 setup/deep-check HEAD等于 `fe8cd7f284ea2849f634aa68813dbb0f2cca83f9`，ZIP identity等于本地 seal。
- 更新 acceptance/history/ROADMAP/planning与静态守卫；验证并本地 commit后停止在 P9-C前。

### P9-C0 — Tag-source and asset identity decision

**Status:** completed

- 复核v0.3.5先例与P9-B证据，冻结`v0.4.0` lightweight tag source为Cloud实际验收的
  `fe8cd7f284ea2849f634aa68813dbb0f2cca83f9`。
- 明确`01fecef…`及后继operator commit只承载Release-excluded治理记录，不得替换tag source。
- 只读确认本地/远端尚无`v0.4.0` tag，GitHub尚无同名Release；冻结两项sealed asset identity。

### P9-C1 — Maintainer publication operator and guards

**Status:** completed

- 在现有版本acceptance内增加唯一P9-C operator，不创建第二份版本验收authority。
- 固定absence preflight、exact-source双构建、lightweight tag、Pre-release上传、重新下载与tag-source rebuild audit顺序。
- 同步history/ROADMAP/planning与静态守卫；运行相称回归并创建Release-excluded本地commit。

### P9-C2 — Immutable tag and Pre-release publication

**Status:** completed

- 维护者从冻结source创建并push`v0.4.0` lightweight tag；不得移动、删除或重建。
- 维护者创建Pre-release并上传且仅上传exact ZIP与ZIP外bootstrap；不得设置Latest。

### P9-C3 — Ref-aware publication audit and evidence closure

**Status:** completed

- 在全新目录重新下载两项公开资产，核对Release metadata、tag source、filename、size、SHA与bootstrap syntax。
- 从公开tag重新构建ZIP并要求与下载资产字节一致；回传明确最终exit code与`P9_C_PUBLICATION_AUDIT=PASS`。
- 证据返回后才登记provenance/acceptance并关闭P9-C；随后仍停止在P9-D前。

### P9-C4 — Publication evidence writeback

**Status:** completed

- 记录公开tag/Release metadata、两项下载资产size/SHA、tag-source rebuild与明确exit code 0。
- 更新provenance、版本acceptance、ROADMAP、planning与静态守卫，不修改任何Release ZIP input。
- 相称验证并创建本地closeout commit；停止在P9-D Published Release Cloud之前。

### P9-D-PR0 — Published identity and channel recovery

**Status:** completed

- 复核P9-C exact tag/source、Pre-release metadata、两项public URL/size/SHA与P9-D Discovery退出条件。
- 确认P9-D使用独立Fresh Cloud和public bootstrap默认ZIP链，不复用Source/Candidate/P9-C安装或本地资产。
- 确认通用模板4.2/5.2/6/7/8.1/8.2/9.2已覆盖所需脚本、提示词与manifest-routed deep check。

### P9-D-PR1 — Versioned operator and static guards

**Status:** completed

- 在现有v0.4.0 acceptance增加唯一P9-D operator，不复制通用长脚本。
- 冻结immutable bootstrap/ZIP URL与SHA、Cloud执行顺序、回传字段、失败重跑与P9-E前停止条件。
- 更新Release-excluded planning/history/ROADMAP守卫；不得修改tag、Release资产、ZIP inputs或production字节。

### P9-D-PR2 — Maintainer Fresh/Resume Cloud execution

**Status:** completed

- 在独立Fresh Cloud的environment setup中执行4.2，使Managed Hook在首个agent startup前由public bootstrap安装。
- 按5.2→6→7→8.1→同task real 8.2→9.2闭合Host、doctor、inventory、policy与residue证据。
- 回传明确最终exit code和PWF public PASS markers；证据返回后才能回写P9-D PASS。

### P9-D-PR3 — Evidence reconciliation and closeout

**Status:** completed

- 交叉核对setup最终bootstrap SHA/PASS、5.2 Fresh、canonical/long-tail/real Resume与9.2 exit code 0。
- 记录exact operator HEAD、planning-only fixture、公开ZIP identity、doctor/inventory/policy/residue与双通道最终结论。
- 更新provenance、acceptance、history、ROADMAP、planning与静态守卫；本地commit后停止在P9-E前。

### P9-E0 — Promotion authority and control-plane recovery

**Status:** completed

- 复核P9-D PASS、v0.3.5 pointer-only先例、P9-E/P9-F边界与当前GitHub Release/tag/asset事实。
- 发现Latest当前指向`v0.3.5-dev`而programme accepted仍为`v0.3.5`；将其归类为control-plane drift，不改写历史证据。
- 冻结直接晋级`v0.4.0`的路线；不先制造临时v0.3.5 Latest中间态，未知前态必须fail closed。

### P9-E1 — Versioned operator and static guards

**Status:** completed

- 在现有v0.4.0 acceptance物化read-only preflight、唯一maintainer mutation和read-only postflight。
- pre/postflight绑定exact v0.4.0 tag/source/双资产和v0.3.5 fallback身份；operator只允许Release metadata变更。
- 同步Release-excluded history/ROADMAP/planning与repository guard；本地验证并commit后交接维护者。

### P9-E2 — Maintainer pointer promotion

**Status:** completed

- 维护者push exact operator commit，执行preflight并保存previous Latest。
- 只运行一次`gh release edit v0.4.0 --prerelease=false --latest`；不得修改notes、tag、target或assets。
- 若命令最终状态未知，先进入只读postflight，不得猜测重试。

### P9-E3 — Postflight, role rotation and gate closeout

**Status:** completed

- 只读确认v0.4.0为非draft、非prerelease的Latest，tag/source与公开双资产字节不变。
- 确认v0.3.5 immutable tag/Release/双资产未变并成为immediate fallback恢复入口。
- 证据返回后才轮转ROADMAP角色并关闭P9-E；随后停止在P9-F前。

### P9-F0 — Promotion evidence and lifecycle recovery

**Status:** completed

- 只读确认`v0.4.0`为stable Latest，tag/source/双资产未变；v0.3.5 immutable身份同样未变。
- 复核working-tree版本文件、11个validation refs、F3 guides、rollback contracts/tests与publication oracle消费者。
- 冻结最小`RETIRE/MIGRATE/KEEP`账；P9-F不创建、不命名也不授权后继开发列车。

### P9-F1 — Role rotation guards and immutable routing

**Status:** completed

- 先让repository/publication guards表达post-promotion角色窗口与P9-F退出条件。
- 把v0.3.5 acceptance链接迁移为exact immutable source URL，确保工作树文件退出后仍可恢复证据。
- 保留动态publication oracle、exact predecessor transition和validation ref reachability断言。

### P9-F2 — Working-tree role-file retirement

**Status:** completed

- 删除`init-cloud-sandbox-v0.3.5.bash`与`docs/v0.3.5-cloud-hard-acceptance.md`的当前树副本。
- 不删除或修改v0.3.5 tag、Release、公开双资产、source commit、provenance身份或历史语义。
- 不删除validation refs、F3 guides、validators、negative tests、installed transition或active planning。

### P9-F3 — Regression, closeout and version-neutral handoff

**Status:** completed

- 跑focused/full regression、importer/compile/Node/Bash syntax、deterministic ZIP与Release-input交集审计。
- 回写acceptance/history/ROADMAP/planning对象账并创建本地commit。
- 关闭v0.4.0列车；后继可能是patch或新的Product Phase，必须另行Discovery/授权，本轮不预设版本号。

## Authorization

- 已授权：P9-B本地封印；重新构建并核验 P9-A candidate；只把 exact ZIP SHA写入 ZIP 外 stable bootstrap；计算 bootstrap SHA；
  修改 Release-excluded tests/planning/history与当前 acceptance/ROADMAP的 gate状态；维护者当前进一步授权 ROADMAP第4/5章
  信息架构治理、删除已确认重复的两段 current-status/F3B2说明、收缩4.1标题、在现有 v0.4.0 acceptance补充 P9-B Cloud
  operator入口、相称静态守卫与本地 commit。
- 已授权：回补维护者返回的 P9-B sealed-source Cloud证据并关闭 P9-B；相称静态守卫、Release-excluded状态同步与本地 commit。
- 已授权：P9-C本地identity preflight、operator/静态守卫/Release-excluded history与programme同步、本地验证和commit；维护者按
  operator创建exact lightweight tag、Pre-release、上传两项sealed assets并执行只读publication audit。
- 已授权：P9-D本地identity恢复、版本化operator/静态守卫/Release-excluded planning/history/ROADMAP同步、本地验证和commit；
  维护者push operator commit后，在独立Fresh Cloud按operator执行Published Release通道并回传证据。
- 已授权：交叉核对维护者返回的P9-D Cloud证据，回写provenance/acceptance/history/ROADMAP/planning与静态守卫，相称验证并
  创建本地closeout commit。
- 已授权：P9-E本地identity/control-plane恢复、版本化operator、静态守卫、Release-excluded history/ROADMAP/planning同步、
  相称验证和本地commit；维护者push后按operator执行唯一pointer-only promotion并回传只读postflight。
- 已授权：核对P9-E postflight并进入P9-F；轮转当前角色、迁移旧验收链接、退役v0.3.5 working-tree bootstrap/acceptance、
  保留仍有consumer或唯一reachability的refs/contracts/tests/guides，相称验证并创建本地commit。
- 未授权：修改任何 ZIP entry、package/contract/manifest/README或 production/runtime字节；由本地智能体执行 Cloud；创建/移动/
  删除远端refs；由本地智能体push/PR/tag/Release/publication/promotion或上传资产；validation ref cleanup；创建、命名或切换
  任何后继development列车；进入后继Product Phase。

## Stop Conditions

- P9-C从`fe8cd7f284ea2849f634aa68813dbb0f2cca83f9`之外的commit创建tag，或把分支最新HEAD当成动态tag source。
- 待上传或重新下载的candidate不是 22 entries、85,519 bytes、SHA-256
  `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`，或双构建不一致。
- bootstrap不再是ZIP外21,565-byte资产、SHA不是`4ae21c1f…c64f`，或其内嵌ZIP SHA不等于frozen candidate。
- 同名tag/Release已存在但身份不明，或远端查询/异步命令没有明确最终状态；不得猜测absence/PASS。
- tag push后任何步骤要求删除、force-update或重建tag，或资产上传后试图删除/重传同名资产来修补字节漂移。
- P9-C要求修改任何ZIP input、production/runtime、contract、manifest或README；此时回到P9-A/P9-B而不是继续publication。
- 任何P9-E步骤要求重新执行Cloud、修改Release字节、tag/ref、notes/title/target或仓库设置，而不是单次pointer metadata mutation。
- P9-D setup使用本地/branch bootstrap、`file://`、checksum override、旧candidate URL或非immutable HTTPS URL，而非公开bootstrap默认链。
- P9-D复用Source/Candidate/P9-C容器或安装，setup发生在agent startup之后，或Fresh/real Resume不属于同一规定lifecycle。
- 公开bootstrap/ZIP URL、SHA、tag source、Release metadata与P9-C冻结事实不一致，或9.2回退到workspace同名工具。
- 任一异步命令没有明确最终exit code，doctor/inventory/policy/residue不闭合，或Cloud产生planning fixture以外的仓库修改。
- P9-E preflight看到未知previous Latest、tag/source/asset漂移、dirty或未push的operator HEAD，或远端/API最终状态不明。
- postflight未确认v0.4.0 stable Latest与v0.3.5 immutable fallback就轮转accepted/fallback，或任何步骤进入P9-F/ref cleanup。
- P9-F试图删除validation refs、F3 guides/validators/negative tests或exact predecessor contract，或旧验收没有immutable恢复入口。
- P9-F改变任何Release input/public asset、恢复已退役working-tree role文件，或在独立决策前命名/创建后继开发列车。

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
| First ROADMAP governance commit attempt could not create `.git/index.lock` in the workspace sandbox | 1 | Repeated the same scoped add/commit with Git metadata permission; local commit `dfbc128` was created without changing the staged file set. |
| Resume read used the three-argument `Join-Path` form unsupported by this PowerShell | 1 | No file was written; switched to the active plan's explicit paths and completed the required recovery reads. |
| First acceptance/template inspection command had an unterminated nested PowerShell quote | 1 | No file was written; split the inspection into simple newline-separated commands and completed it successfully. |
| First focused P9-B3c green run found the deep-check field list lacked the exact `PWF_SC_POST_RESUME=PASS` acceptance value | 1 | Kept the guard strict and added the exact terminal marker to the operator PASS criteria; no product or Release input changed. |
| Second focused P9-B3c run found exact sealed ZIP evidence above the completed local-seal heading | 1 | Preserved the existing lifecycle guard and reordered the version acceptance to show completed local-seal evidence before the pending Cloud operator entry. |
| P9-B3c focused Node runner hit the known Windows sandbox `spawn EPERM` | 1 | Reran the identical focused command with child-process permission; assertions executed and the later final run passed 18/18. |
| P9-B3c sandboxed Git Bash syntax probe could not create its signal pipe (`Win32 error 5`) | 1 | Reran the same read-only `bash -n` loop with process permission; both versioned bootstraps passed. |
| A Windows `rg` audit passed `tests\\*.test.js` as a literal path and reported an invalid filename | 1 | The relevant direct test file had already been read; use repository paths or `rg -g '*.test.js'` for future Windows glob filtering. |
| First P9-B closure green run left two ROADMAP guards on the pre-Cloud wording | 1 | Restored the stable Phase 4 closeout phrases and migrated the version-scoped P9-B guard from local-seal/pending to sealed-source Cloud PASS/P9-C stop. |
| Direct execution of P9-C preflight during documentation authoring stopped on a dirty worktree | 1 | This is the intended fail-closed boundary, not a publication failure. Parse all five blocks now and rerun the exact absence preflight only after the scoped local commit restores a clean tree. |
| Initial P9-C absence draft treated any failed `gh release view` as “not found” | 1 | Replaced it with GitHub API probes that require explicit HTTP 404 for both tag and Release; authentication, transport and other HTTP failures now remain UNKNOWN and stop. |
| First independent P9-C audit hit Git Bash signal-pipe `Win32 error 5` during public bootstrap syntax | 1 | Classified as the known Windows restricted-process limitation; reran the complete audit in the permitted process environment and obtained explicit exit code 0. |
| Sandboxed focused Node runner failed with `spawn EPERM` | 1 | Reran the identical repository-boundary suite with child-process permission; the runner executed normally. |
| First executed P9-C lifecycle guards still expected unpublished/pending state | 1 | Updated only Release-excluded ROADMAP/provenance/acceptance assertions to the observed published prerelease state; rerun passed 11/11. |
| Combined PowerShell postflight passed a spaced `--jq` expression to `gh api` as two arguments | 1 | Replaced CLI quoting with `ConvertFrom-Json`; exact remote tag type/source postflight then passed. |
| P9-D read-only `git ls-remote` cross-check hit Git-Bash signal-pipe `Win32 error 5` and returned no branch HEAD | 1 | Kept the failed transport result as UNKNOWN; used the GitHub ref API instead and confirmed remote `0.4.0` equals local operator HEAD `9d4a914…`. |
| First P9-D closeout guard expected 13 installed files by manually adding `hook_adapter.py` beside bundle `local_files` | 1 | Classified as a stale v1-era test projection; removed the manual duplicate and kept runtime-bundle v2 as the only installed inventory authority. Cloud/manifest remain exact at 12 files. |
| Second focused run's promotion-boundary regex required `accepted/fallback` on the same line as `Latest` | 1 | Allowed Markdown whitespace while preserving the semantic assertion that Published Release PASS does not authorize Latest/role rotation/P9-E. |
| First P9-F focused runner attempt hit Windows `spawn EPERM` | 1 | Reran the exact repository-boundary suite with child-process permission; the intentional red run then exposed only the expected stale role/absence/evidence assertions. |
| Combined local check used the WindowsApps `python3.exe` alias, which exited 1 without output | 1 | Switched the Windows verification invocation to the real `python.exe`; importer, compile and deterministic build checks then passed. |
| Sandboxed P9-F Bash syntax probe hit the known Git Bash signal-pipe `Win32 error 5` | 1 | Reran the sole remaining bootstrap with process permission; `bash -n init-cloud-sandbox-v0.4.0.bash` passed. |

## Current status

`P9_F_SECOND_RETIREMENT_PASS / V0_4_0_TRAIN_CLOSED / NEXT_TRAIN_UNDECIDED`
