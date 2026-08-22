# Progress: v0.4.1 Phase 9 Release Discovery

## Session: 2026-08-22

### Phase 1: Release Discovery

- **Status:** complete
- 维护者决定先发布 `v0.4.1`，历史兼容精简移交下一开发列车评估。
- planning-with-files 已确认上一 `v0.4.1` local/Cloud gate 账本完整关闭。
- 创建本 Release Discovery 账本并切换 `.planning/.active_plan`。
- 当前只授权只读 Discovery 与路线提案；未进入 materialization、seal、Cloud、tag 或 Release。
- 恢复 `v0.4.0` P9-A～P9-F 的实际 gate/evidence 顺序，确认 Source/Candidate、publication audit、Published Release
  Cloud 与 Latest promotion 必须逐层分离。
- 审计 entry identity：local/remote HEAD 均为 `5c88210…`，无 tag；source 仍是 `0.4.1-dev`，bootstrap 为正确的
  zero-hash fail-closed 状态。
- 初步判断 v0.4.1 P9-A 应收窄为 patch stable identity/pre-seal 对账，不能机械复制 v0.4.0 的大规模 dev→stable 迁移。
- 完成 `0.4.1-dev` 全仓 identity scan：production/runtime 无版本硬编码迁移需求；P9-A 主要是 package、Release
  contract/hash edge、bootstrap/acceptance rename、CHANGELOG/ROADMAP 与当前角色测试的原子传播。
- 冻结 acceptance 历史语义：已执行 Cloud source/hash/installer observation 保持原样；stable 顶层身份采用 rename-not-duplicate。
- 对比 `6c1dd52…HEAD` 与 Release inventory/external asset，交集为零；当前治理提交没有改变已验收candidate bytes。
- 冻结 P9-A最小范围与P9-B～P9-F顺序；结论为conditional-go到P9-A，但materialization及所有后继gate仍未授权。

## Test Results

| Check | Result | Status |
|---|---|---|
| entry worktree | clean; local `0.4.1` equals `origin/0.4.1` | PASS |
| release identity preflight | HEAD `5c88210…`; no tag; `0.4.1-dev`; zero-hash bootstrap | EXPECTED / PASS |
| post-Cloud changed-path/Release intersection | zero Release entries / zero external assets | PASS |
| Release contract integrity edge | source and manifest both `4f89e5b…ab6e0` | PASS |
| repository-boundary after active-plan switch | 14 pass / 0 fail / 0 skip | PASS |

## Errors

| Error | Attempt | Resolution |
|---|---:|---|
| composite identity/doc scan returned exit 1 after printing valid matches | 1 | Classified as `rg` no-match exit semantics in a multi-query read; no repository assertion or mutation depended on the aggregate exit code |
| PowerShell static SHA helper methods unavailable | 1 | Switched to `Get-FileHash`; verified exact current contract SHA without repeating the failed method |

## Current Status

`CONDITIONAL_GO_TO_V0_4_1_P9_A_PRE_SEAL_MATERIALIZATION / P9_A_NOT_AUTHORIZED / RELEASE_NOT_AUTHORIZED`

## 2026-08-22 — P9-A authorization

- 维护者回复“好的，继续”，承接上一轮明确的 P9-A 授权请求；当前只进入 stable pre-seal materialization。
- entry HEAD 为 `0a4e972381f3c90aa6d7edd679eaced6483bb179`，工作树 clean；本地 branch 比
  `origin/0.4.1` ahead 1，该 commit 仅包含 Release Discovery planning。
- P9-B exact-hash seal、Cloud、tag、Release、Latest 与所有远端写继续未授权。
- 按仓库顺序复读 README 与 ARCHITECTURE；两者的用户行为、trusted graph、zero-hash/seal 顺序和当前
  production边界均为稳定表述，P9-A不需要为版本身份迁移改写这两份ZIP/架构authority。

## Current Status

`V0_4_1_P9_A_PRE_SEAL_MATERIALIZATION_ACTIVE / P9_B_NOT_AUTHORIZED / RELEASE_NOT_AUTHORIZED`

### P9-A implementation preflight

- 已核对 `package.json`、Release artifact contract、manifest integrity edge、候选 bootstrap、CHANGELOG、ROADMAP、当前版本 acceptance 以及 repository/bootstrap 边界测试。
- 原子迁移落点与 Discovery 冻结范围一致：stable package/asset/acceptance identity、Release contract hash edge 和 current-role assertions；production runtime、Host ABI 与 installed transition contract 无需改动。
- `tests/bootstrap.test.js` 已动态从 package、Release contract 与 ROADMAP 角色派生候选路径，并明确允许尚未成为 accepted baseline 的 stable candidate 保持 64 位 zero hash；P9-A 不会弱化该 fail-closed 断言。
- 当前 acceptance 的 Cloud evidence 是已完成的 `0.4.1-dev` source 历史，P9-A 只迁移文件/顶层 current identity，并保留 exact HEAD、ZIP SHA、installer observation 与首次 C 拒绝时间线。
- ROADMAP 的 accepted/fallback 角色保持 `v0.4.0` / `v0.3.5`；只把 candidate 与 Phase 9 当前 gate 更新为 `v0.4.1` stable zero-hash pre-seal，并明确停止在 P9-B 前。
- 历史 `v0.4.0` P9-A precedent 再次确认 rename-not-duplicate：只迁移 acceptance 文件、标题与顶层 gate anchor，开发期证据 anchor 继续保留原身份；本轮按同一语义处理 `v0.4.1-dev` Cloud evidence。
- 最近边界测试已先切到 stable pre-seal 目标并完成 intentional-red：14 项中 11 PASS、3 项按预期因当前 candidate/顶层 acceptance 仍是 `v0.4.1-dev` 而失败；没有发现无关回归。
- stable identity 已原子传播到 package、Release contract、外部 bootstrap、版本 acceptance、CHANGELOG、ROADMAP 与 lifecycle assertions；dev 文件采用 rename-not-duplicate，历史 Cloud evidence anchors/observations 保留。
- 新 Release contract 原始 SHA-256 为 `f1c8af8985c52697c618fb35d105c566bf519d2a605f296b2cc53e94828a429e`，manifest integrity edge 已同步；bootstrap 仍保持 64 位 zero hash。
- 首次实现后聚焦测试为 13 PASS / 1 FAIL；唯一失败是 lifecycle assertion 仍匹配旧表项名 `Seal / publication / Latest`，实现已把该 gate 精确命名为 `P9-B seal / publication / Latest`。已同步断言，未改变行为边界。
- repository-boundary 聚焦复验：14 PASS / 0 FAIL / 0 SKIP；candidate=`v0.4.1`、accepted=`v0.4.0`、immediate fallback=`v0.3.5` 与 stable acceptance window 均通过。
- 完整 Windows runner：184 tests / 158 PASS / 0 FAIL / 26 SKIP；SKIP 均为既有 Linux/POSIX-only case，不提升为 Linux 证据。
- importer check、Python compile、`node --check install.js`、manifest→Release contract raw SHA、四个 upstream `100755` mode、zero-hash bootstrap 与 `git diff --check` 均 PASS。
- P9-A 本地预封板双构建一致：22 entries、85,910 bytes、SHA-256 `94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291`；该 hash 只写 evidence，不写 bootstrap。

### P9-A implementation errors

| Error | Attempt | Resolution |
|---|---:|---|
| double-build wrapper used invalid PowerShell generic-call syntax | 1 | Parser stopped before mutation; simplified equality proof to exact size + SHA-256 comparison |
| double-build wrapper used unsupported `New-Item -LiteralPath` on Windows PowerShell 5 | 1 | No directory was created; retried with validated temp path and `New-Item -Path` |
| Git Bash could not create a signal pipe inside the Windows sandbox | 1 | Reran the same bounded `bash -n` check outside the sandbox; both v0.4.0 and v0.4.1 bootstraps passed |
| sandbox denied creation of `.git/index.lock` during staging | 1 | Re-ran the exact bounded `git add` outside the sandbox under the authorized local-commit scope |

- Bootstrap syntax复验：`init-cloud-sandbox-v0.4.0.bash` 与 `init-cloud-sandbox-v0.4.1.bash` 均 PASS。

### P9-A closeout

- Release-input audit只命中stable身份所需的 `package.json`、Release contract、manifest integrity edge与重命名后的外部bootstrap；production runtime、Host ABI、runtime bundle及installed transition均为零交集。
- stable acceptance新增本地pre-seal双构建事实，同时明确旧`0.4.1-dev` Cloud证据不能替代P9-B exact final-source验收。
- 最终repository-boundary复验：14 PASS / 0 FAIL / 0 SKIP。
- staged审计将bootstrap识别为99% rename、acceptance识别为88% rename；没有重复保留dev命名文件，暂存范围共10个逻辑文件。

## Current Status

`P9_A_PRE_SEAL_MATERIALIZATION_PASS / ZERO_HASH_CANDIDATE_FROZEN / STOP_BEFORE_P9_B / RELEASE_NOT_AUTHORIZED`

## 2026-08-22 — P9-B authorization

- 维护者回复“继续”，承接P9-A停止点并授权P9-B；范围仅为本地exact-hash seal、sealed-source Cloud教程/交接、验证、planning/acceptance/ROADMAP和本地commit。
- entry HEAD为`8ef5ec6f396c7ae022231ace14717fd6630a7be0`，工作树clean，本地`0.4.1`比`origin/0.4.1` ahead 2。
- README与ARCHITECTURE已按恢复顺序复读；两者的seal顺序和production/trusted graph均为稳定authority，P9-B不需要改写。
- 维护者继续负责push和Cloud UI；P9-C tag/Pre-release、Release、Latest、远端ref/资产及后继gate未授权。
- DESIGN复读确认P9-B只触及package-plane外部bootstrap、版本acceptance/ROADMAP与对应Release/repository测试；production runtime与machine inventory无需修改。
- ROADMAP当前仍是P9-A complete / P9-B未授权的宏观状态；本地seal完成后需改为P9-B local seal PASS、sealed-source Cloud pending，不能提前写Cloud PASS或publication状态。
- ROADMAP完整复读确认固定字节顺序为冻结ZIP输入→双构建/check→计算ZIP SHA→写bootstrap→计算bootstrap SHA；P9-B本地seal必须在写hash后再重建ZIP确认ZIP字节未变，并止步于maintainer push/Cloud handoff。
- 活动plan已切到Phase 3 in progress；现有dev Source/Candidate PASS只保留为pre-seal历史，stable sealed-source Cloud必须从P9-B exact final source重跑。
- P9-B最近边界已先补：release-package把local-seal marker与non-zero/exact ZIP/bootstrap SHA绑定；repository-boundary冻结local seal PASS、Cloud pending、operator anchors与P9-C未授权。
- intentional-red聚焦结果：17 tests中16 PASS、1项按预期因acceptance尚无P9-B local seal表项/证据/operator而失败；Release builder与现有zero-hash行为本身无额外回归。
- 写bootstrap前的P9-B独立双构建/check PASS：22 entries、85,910 bytes、SHA-256 `94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291`；与P9-A pre-seal事实完全一致。
- bootstrap默认`HOOKS_SHA256`已从64位zero hash替换为exact ZIP SHA `94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291`；这是P9-B唯一Release external-asset字节改动。
- 写hash后再次独立双构建/check仍为22 entries、85,910 bytes与同一ZIP SHA，证明external bootstrap没有污染ZIP；sealed bootstrap为21,565 bytes、SHA-256 `1832db08c16b4f7fde88df2699384f1fff8e324909b0e024cb6ef216aea30a43`。
- 首次seal后聚焦测试为20 PASS / 1 FAIL；唯一失败是新size evidence断言去掉千分位后未允许Markdown反引号，实际字节/hash与其他封板断言均已通过。已把测试修正为匹配`` `85910` bytes ``格式，不改变产品或evidence内容。
- 首次修正把反引号直接嵌入JavaScript template literal，`node --check`立即发现语法错误；未运行测试或修改产品。改用普通字符串拼接构造正则，避免重复该转义方式。
- P9-B聚焦复验转绿：21 PASS / 0 FAIL / 0 SKIP；现场ZIP、bootstrap默认hash、acceptance exact ZIP/bootstrap SHA、local-seal状态、Cloud pending/operator与P9-C未授权全部闭合。
- 完整Windows runner封板后PASS：184 tests / 158 PASS / 0 FAIL / 26 SKIP；SKIP均为既有Linux/POSIX-only case，继续等待sealed-source Cloud零skip证据。
- importer check、Python compile、`node --check`、manifest→Release contract raw SHA、Git mode、bootstrap exact SHA与`git diff --check`均PASS；Release contract SHA保持`f1c8af…a429e`。
- `bash -n`复验`init-cloud-sandbox-v0.4.0.bash`与sealed `init-cloud-sandbox-v0.4.1.bash`均PASS。
- 最终changed-path审计仅命中一个current Release path：ZIP外`init-cloud-sandbox-v0.4.1.bash`；production/runtime intersection为空，package/contract/manifest/ZIP inputs均未改变。
- stable acceptance已冻结local-seal字节、maintainer push/exact-HEAD preflight、4.1→B～E→9.1操作顺序、原始回传字段与停止条件；Cloud结论保持`MAINTAINER_CLOUD_PENDING`。
- 活动plan切换到local-seal PASS / Cloud pending后，提交前repository+Release聚焦复验17 PASS / 0 FAIL / 0 SKIP，`git diff --check` PASS。

## Current Status

`P9_B_LOCAL_SEAL_PASS / SEALED_SOURCE_CLOUD_PENDING / STOP_BEFORE_P9_C / PUBLICATION_NOT_AUTHORIZED`

## Current Status

`V0_4_1_P9_B_LOCAL_SEAL_ACTIVE / SEALED_SOURCE_CLOUD_NOT_YET_RUN / P9_C_NOT_AUTHORIZED / RELEASE_NOT_AUTHORIZED`

## 2026-08-22 — P9-B sealed-source Cloud evidence writeback

- 维护者明确确认整条Cloud验收全部通过；本轮按最终结论直接写回，不增加验收范围或要求重跑。
- 4.1最终exit code 0：HEAD `99885b854bd9621c3340e99f031bf83ceb58414d`；Linux 175 tests / 175 pass / 0 fail / 0 skipped；ZIP 22 entries、85,910 bytes、SHA-256 `94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291`；`PWF_SOURCE_CANDIDATE_SETUP=PASS`。
- 5.1/B、C、D、E1与同一task真实reopen后的E2均PASS；canonical `.planning` fixture是唯一workspace变化。
- 9.1最终exit code 0：`PWF_WORKTREE_CHANGES=PLANNING_ONLY`、doctor healthy、manifest schema 4、Release/bundle schema 2、installer 0.4.1、22 Release entries、12 installed runtime files、4 pristine upstream、authoritative bundle inventory、adapter-only policy、零snapshot residue、exact HEAD与`PWF_SC_POST_RESUME=PASS`。
- acceptance与ROADMAP已更新为P9-B sealed-source Cloud PASS；Phase 3完成，停止在P9-C之前。
- evidence写回后的完整Windows runner PASS：184 tests / 158 pass / 0 fail / 26 skipped；SKIP仍全部为既有Linux/POSIX-only case，Cloud零skip证据由本轮exact sealed-source结果承担。
- changed-path审计仅包含活动planning、ROADMAP、版本acceptance与两处治理测试；与Release v2 entries及ZIP外bootstrap的交集为0，sealed ZIP/bootstrap字节未被本次evidence commit改动。
- `node --check`两处变更测试与`git diff --check`均PASS。
- 最终repository/Release聚焦复验：17 pass / 0 fail / 0 skipped；exact evidence、角色窗口、active planning与Release字节绑定全部通过。

### Evidence-writeback validation errors

| Error | Attempt | Resolution |
|---|---:|---|
| sandbox内Node test runner创建隔离子进程时报`spawn EPERM` | 1 | 改用`--test-isolation=none`取得预期文档状态红灯；其余spawn-based断言仍留待正常非受限复验，不把sandbox限制误判为产品失败 |

## Current Status

`P9_B_SEALED_SOURCE_CLOUD_PASS / STOP_BEFORE_P9_C / PUBLICATION_NOT_AUTHORIZED`
