# Findings: v0.3.2 Baseline Promotion and v0.3.3-dev Handoff

## Initial Question

- 维护者希望当前树更清爽：v0.3.1 进入历史、v0.3.2 成为已完成基线，下一开发列车以 v0.3.3-dev
  占位。
- 该目标同时触发 baseline promotion、history eviction 与新 source identity，不能只改 ROADMAP 文案；
  必须先确认三者的机器事实和外部状态是否同步。

## Invariants

- v0.3.1/v0.3.2 immutable tag、Release assets、SHA 与 acceptance 不原位改写。
- v0.3.2 只有在明确授权并完成对应核验后才成为 production rollback/GitHub `Latest`。
- v0.3.3-dev 若成为真实 source identity，package、Release contract、bootstrap fail-closed 状态和测试必须
  一致；不能只让 ROADMAP 与 machine identity 分叉。
- 当前树最终只保留一个 active planning 和获批角色窗口；历史仍从 Git/tag/Release 恢复。

## Local Inventory: Role and Identity Coupling

- 当前 machine/source identity 是精确 `0.3.2`：`package.json.version`、Release contract
  `package_version`、contract 的唯一 external asset 和 sealed bootstrap 都一致；这不是可随 ROADMAP 文案
  单独变化的占位符。
- 当前 hot role files 恰好是 v0.3.1/v0.3.2 两套 bootstrap 与 acceptance。ROADMAP、README/AGENTS
  命令、provenance、CHANGELOG、repository lifecycle、publication oracles、skill-patch 和 release-package
  tests 均引用其中一部分。
- `repository-boundary.test.js` 会把 ROADMAP 当前开发列车与 `package.json.version` 交叉校验，并根据
  candidate + accepted 角色动态派生两套 bootstrap/acceptance。因此把“当前开发列车”只改成
  `v0.3.3-dev` 会正确失败，除非同时建立完整的新 source identity。
- v0.3.1 清退不是单文件删除：至少涉及 root bootstrap、当前树 acceptance、README/AGENTS 命令、
  provenance 当前/历史分区、published oracle 与 skill-patch tests。immutable tag/Release/acceptance link
  必须在删除本地副本前复核。

## Candidate Routes

- 路线 A（最小角色旋转）：先正式 promote v0.3.2 为 accepted rollback/Latest，归档 v0.3.1；ROADMAP
  只把 v0.3.3-dev 标为“下一列车预留”，package 仍为 0.3.2，后续独立 Discovery 才建立机器身份。
- 路线 B（同一事务开启新列车）：完成 v0.3.2 promotion/eviction 后，同步建立 0.3.3-dev package、Release
  contract、zero-hash bootstrap、acceptance 骨架和测试。范围显著扩大，且任何 ZIP input 变化产生新的
  development bytes，不能继续借用 v0.3.2 sealed identity。
- 不可接受路线：只改 ROADMAP 为当前 v0.3.3-dev，同时保留 package/contract 0.3.2；这会制造双重真相。

## External Release Facts

- 2026-08-09 只读 GitHub API 显示 `releases/latest` 仍返回 v0.3.1。v0.3.1 与 v0.3.2 Release 均非 draft、
  非 prerelease；各自 ZIP/bootstrap size 与 server digest 精确匹配 provenance/acceptance。
- 因此把 v0.3.2 写成 production rollback/`Latest` 不是文档归档动作，而需要维护者明确授权一次外部
  pointer promotion，并在后置查询中证明 `Latest=v0.3.2`；资产本身不应重发或改写。

## v0.3.1 Immutable Recovery

- local tags 精确存在：v0.3.1 → `9aa2148...5de2`，v0.3.2 → `c68a53b...98e4`；v0.3.1 tag tree 内的
  bootstrap 与 pre-promotion acceptance 均可读取。
- v0.3.1 最终 promotion evidence 首次写入 commit `c92b0879...f8f0`；当前完整 acceptance blob 与
  `435f8305...924f` 中的 blob 相同（`e70265e...6f77`），后者只把 v0.3.0 本地相对链接改为 immutable
  commit link，且是当前 HEAD/远端分支祖先。
- 所以当前树的 `docs/v0.3.1-cloud-hard-acceptance.md` 可以安全归档，但 provenance/CHANGELOG 必须先把
  链接改为 exact `435f8305...924f` URL；不能只链接 v0.3.1 tag，因为 tag 内版本早于最终 promotion 证据。
- root v0.3.1 bootstrap 可同时从 v0.3.1 tag 与公开 Release asset 恢复。清退本地副本后，skill-patch
  不应失去供应链断言：可由 publication oracle 从 tagged source 验证，或把仍有长期价值的通用 bootstrap
  安全性质转交当前 accepted v0.3.2 测试。

## Sealed ZIP Coupling Changes the Recommendation

- `contracts/release-artifact-v1.json` 把 `README.md` 列为 23 个 ZIP 输入之一；README 当前仍明确检查
  v0.3.1 与 v0.3.2 两个 bootstrap。删除 v0.3.1 bootstrap 而不改 README 会留下坏命令，修改 README
  又会改变从 HEAD 构建的 ZIP bytes。
- `tests/release-package.test.js` 当前不只检查确定性，还要求 HEAD 双构建的 SHA-256 精确等于已发布
  v0.3.2 ZIP `b42aecaf...e5081`，并要求 package、Release contract 与 sealed v0.3.2 bootstrap 一致。
  因此路线 A 只能做“角色晋级但保留 v0.3.1 当前树副本”，不能完成维护者要求的清爽归档。
- 若要真正清退 v0.3.1 的 root bootstrap、当前 acceptance 与默认历史 oracle，必须让 HEAD 合法离开 sealed
  v0.3.2 source tree，建立真实 `0.3.3-dev` machine identity。此时 HEAD 构建应验证新的 development bytes
  确定性与 contract boundary，而 v0.3.2 的精确字节证明转交 immutable tag/source publication oracle。
- `skill-patch.test.js` 中 v0.3.1 用例还承载了通用供应链性质：PWF archive pin/SHA、pristine subtree、
  Node `>=18`、禁止 NVM/`npx`/`curl | bash`、以及 checksum gate 顺序。归档 v0.3.1 用例前，必须把这些
  仍有效的断言迁移到当前 v0.3.2 accepted bootstrap 或新的 v0.3.3-dev fail-closed bootstrap。
- `published-release-oracles.test.js` 的 v0.3.1 oracle 同时引用 tagged source 和当前 root bootstrap；归档时
  至少应删除后者依赖。按照 history-retention contract，默认 suite 只需持续证明仍承担当前角色的历史版本；
  更早版本通过 immutable tag/Release/精确 acceptance 链恢复，是否连同 v0.3.0 oracle 一并轮出默认 suite
  不应在本次仅因 v0.3.1 归档而顺手扩大范围。

## Recommended Gate Shape

推荐把同一项 lifecycle 事务拆成两个可回滚子门槛，而不是把 ROADMAP 文案当作全部实现：

1. **P1 — v0.3.2 pointer promotion**：复核公开资产后，仅把 GitHub `Latest` 从 v0.3.1 指向 v0.3.2，
   立即重新查询并把 promotion evidence 写入 v0.3.2 acceptance；不重发、不修改任何历史资产。
2. **P2 — v0.3.3-dev source handoff + v0.3.1 eviction**：建立 package/Release contract/zero-hash
   bootstrap/tests 一致的真实 0.3.3-dev identity；ROADMAP 把 v0.3.2 写为已完成 accepted baseline，
   v0.3.3-dev 写为当前 source train；随后删除当前树 v0.3.1 bootstrap/acceptance 并把恢复链接改为 exact
   immutable refs。P2 不 seal、不发布、不部署 v0.3.3。

这一路线保留以下角色窗口：当前开发源码 `v0.3.3-dev`、当前 accepted/rollback `v0.3.2`；v0.3.1 进入
精选 provenance/CHANGELOG + immutable tag/Release/acceptance 的历史层。它比“ROADMAP 先占位、机器身份以后再说”
多改若干身份与测试文件，但避免双重真相和 sealed ZIP 漂移。

## Discovery Conclusion

`CONDITIONAL_GO`：技术路线已收敛到 P1 + P2，但尚缺维护者对两个关键动作的显式授权：

- 允许把 GitHub `Latest`/production rollback pointer 从 v0.3.1 晋级到 v0.3.2；
- 允许在同一 lifecycle 事务的下一子门槛建立真实 0.3.3-dev machine identity，并按上述 inventory
  清退当前树中的 v0.3.1 副本与默认依赖。

在这两项确认前，ROADMAP、package/contract/bootstrap、tests 与 GitHub Release 状态保持不变。

## Maintainer Decision: Three Independent Gates

- 维护者否决“P2 同时诞生 0.3.3-dev”的合并做法，冻结为 P1 promotion → P2 historical deep-clean →
  P3 successor train。这样 P2 可以把注意力全部放在隐藏历史残留、断言职责与恢复链，不把新版本脚手架
  混入清理 diff。
- P1 已获得明确实施授权；P2 当前只授权 Discovery，不能从 `architecture-contracts.test.js` 这个例子
  直接推导批量删除；P3 不在当前授权范围。
- 旧 `2026-08-09-architecture-contract-retention` 三文件对 P2 的价值在于：它们已证明 architecture test
  应保持版本无关、repository lifecycle 管当前角色、published oracle 管不可变字节，并指出 v0.3.0 oracle
  当时因仍在 rollback evidence chain 而暂缓轮出。
- 这些文件已由 commit `d4cc3b5` 完整保存。把同一已完成 scope 永久恢复到 `.planning` 会让当前树出现
  两个 planning scope，直接违反 repository-boundary 的“completed planning scopes must leave the current
  tree”合同，也重新制造本项目刚治理掉的膨胀。因此 P2 应从该 commit 读取并把有效结论吸收到当前
  findings，而不是恢复第二套长期文件；如果维护者确实要求改变“一 active scope”政策，应另开治理决策。

## P1 Preflight Revalidation

- 2026-08-09 P1 前置查询确认 GitHub Latest 仍为 v0.3.1；其 bootstrap/ZIP size 与 digest 分别为
  21,565 / 82,725 bytes，`ce31a320...60a5e8` / `f097b040...39131f9`。
- v0.3.2 Release 为 non-draft、non-prerelease；bootstrap/ZIP size 与 digest 为 21,565 / 82,627 bytes，
  `aa2c1fd6...8f77c` / `b42aecaf...e5081`，与已关闭的 Cloud acceptance 和 provenance 一致。
- P1 可以只移动 Latest pointer；不得上传、替换或编辑两个 immutable assets。

## P1 Promotion Result and Transitional Role

- `gh release edit v0.3.2 --latest` 成功；独立 `releases/latest` 后置查询返回 v0.3.2，v0.3.2 与 v0.3.1
  四个资产的 filename/size/server digest 均与 preflight 相同。P1 是纯 pointer 写入。
- P1 后 candidate/source package 与 accepted baseline 都是 v0.3.2，但 P2 尚未批准删除 v0.3.1 当前树
  bootstrap/acceptance。若只旋转 ROADMAP 两个主角色，repository lifecycle 会正确把 v0.3.1 判为越窗。
- 因此 P1-C 在 ROADMAP 声明一个显式、可解析的 `P2 历史清理过渡` 角色；repository guard 只在
  candidate=accepted 且 retained predecessor 与 accepted 不同时允许它，并继续精确派生文件集合。
  P2 收口时删除该角色与获批旧文件，不用宽泛 allowlist 或永久例外。
- BASELINE_PROVENANCE 按自身 authority 只维护不可变身份，不复制当前角色或 Latest 状态，所以 P1
  不修改它；当前 lifecycle 只在 ROADMAP，精确 promotion evidence 只在 v0.3.2 acceptance。

## P1 Validation Result

- Focused architecture/repository/release-package/published-oracle：20/20 PASS；v0.3.2 HEAD 双构建仍精确
  等于 sealed ZIP SHA `b42aecaf...e5081`，v0.3.2/v0.3.1/v0.3.0 immutable source oracle 均通过。
- 完整 `npm test`：91 tests，79 PASS，12 个 Windows/POSIX SKIP，0 FAIL；importer check、Python 编译、
  `install.js` syntax、两个 bootstrap 的 Git Bash `-n` 与 `git diff --check` 均 PASS。
- P1 没有修改 package、Release contract、README、bootstrap、production runtime、Host ABI、trusted
  graph、tag 或 asset。唯一外部变化是 Latest pointer；唯一当前树变化是 lifecycle authority、证据与
  精确 transitional-role guard。

## P2 Initial Repository Inventory

### Confirmed Clean

- `tests/architecture-contracts.test.js` 已经没有具体 v0.3.x、版本 acceptance 路径、commit、asset SHA
  或固定历史测试计数；它只保护稳定 authority、Architecture/Design 分工、Discovery/Release 规则与
  test reverse index。维护者举出的文件是本轮扫描入口，但不是当前仍需删除的残留。
- 当前 HEAD 相对 immutable `v0.3.2` tag 的 Release ZIP inputs diff 为空；P1 后仍能精确重建 sealed ZIP。
- 当前树只有一个 tracked active planning scope。旧 retention 三文件可从 `d4cc3b5` 精确读取，内容已
  恢复进本轮判断，不需要恢复第二个 scope。

### v0.3.1 Reference Surface

- 当前树实体：`init-cloud-sandbox-v0.3.1.bash` 与 `docs/v0.3.1-cloud-hard-acceptance.md`。
- 稳定/治理文档：README、AGENTS、ROADMAP、CHANGELOG、BASELINE_PROVENANCE、v0.3.2 acceptance。
- tests：`skill-patch.test.js`、`published-release-oracles.test.js`、`contracts.test.js`；repository lifecycle
  当前通过显式 P2 transition 派生 v0.3.1 两个实体。
- v0.3.2 acceptance 中的 v0.3.1 文字主要是带时间语义的 R4/R5 与 promotion 前后证据，不是残留，
  应原样保留。
- CHANGELOG 的 v0.3.1 delta 和 ROADMAP v0.3.2 的 inherited-security 摘要仍有当前解释价值；不能把
  “出现旧版本号”直接等同于应删除。

### Hard Coupling That Defers One File to P3

- `README.md` 是 sealed v0.3.2 ZIP input，并仍包含 `bash -n init-cloud-sandbox-v0.3.1.bash`。P2 若删除
  root v0.3.1 bootstrap 而不改 README，会留下坏命令；若修改 README，则 HEAD 不再精确复现 v0.3.2
  published ZIP。两条路都违反当前 gate。
- 因此 root v0.3.1 bootstrap 必须在 P2 后暂留，并降格为显式 sealed-source residue；P3 开启新的
  machine/source identity 后才能同时修改 README 并删除该文件。该项不是无限历史保留许可。

### Candidate P2 Cleanup, Pending Deeper Audit

- 可删除候选：当前树 v0.3.1 acceptance；前提是 provenance/CHANGELOG 改为 exact immutable commit
  `435f8305...924f` URL，并验证该 blob 含最终 promotion 证据。
- 可迁移候选：`skill-patch` 中 v0.3.1 专属用例承载的通用 bootstrap 安全断言转到 v0.3.2；
  `contracts.test.js` 的 v0.3.1 文件名负断言改为版本无关边界。
- 需重新决策：v0.3.1/v0.3.0 publication oracle 是否仍承担 immediate fallback 角色；不能只为减少测试
  数量删除 immutable audit。应先把 ROADMAP 的 immediate fallback 与更深 museum evidence 分开。
- 精选 tombstone 候选：repository-boundary 中旧 prototype/fixture/runbook 路径只是不允许回流的负断言，
  不是当前历史文件；需比较保留精选列表与版本无关模式，不能机械删除。

## P2 Deep Audit: Hidden Test History

- `tests/release-package.test.js` 除精确 v0.3.2 sealed SHA 外，还保存 v0.3.0/v0.3.1 ZIP SHA 并只做
  `notEqual`。精确等于 v0.3.2 已经逻辑蕴含不等于旧 SHA，这两项是无新增安全价值的隐藏历史常量。
- `tests/contracts.test.js` 逐项写死 v0.3.0/v0.3.1/v0.3.2 bootstrap 均不在 ZIP；真正合同是所有
  `init-cloud-sandbox-*` 都是 external asset，应用版本无关 pattern 断言替代三行累积名单。
- `tests/skill-patch.test.js` 的 v0.3.1 case 同时测试旧版 identity 与长期有效的供应链性质。应删除旧版
  identity 部分，把 PWF archive pin/SHA、pristine subtree、Node >=18、无 NVM/npx/npm/curl-pipe-bash、
  安装顺序与 checksum gate 全部并入 v0.3.2 accepted bootstrap case；不能随旧用例一起丢掉。
- `tests/published-release-oracles.test.js` 当前重建 v0.3.2、v0.3.1、v0.3.0，并在 v0.3.0 case 中顺带
  固定 beta.2 identity。v0.3.2 是 accepted，v0.3.1 是 immediate fallback，仍承担角色；v0.3.0/beta.2
  已可由 provenance + immutable tag/Release/acceptance 周期审计，应退出默认 suite。
- v0.3.1 publication oracle 暂留，并继续证明 tag/source ZIP 与当前 root residue bootstrap 字节；P3 删除
  root copy 时再去掉最后一个 current-tree hash seam，但保留是否周期审计由 P3 Discovery 决定。
- `repository-boundary.test.js` 的 prototype/fixture/runbook tombstones 是精选防回流断言，旧 retention
  scope 已明确决定保留；本轮没有出现新增证据推翻该结论。

## Exact Recovery and Size Evidence

- v0.3.1 acceptance：686 行 / 35,588 bytes；当前 blob 与可达 ancestor commit
  `435f830577ded23f8509a7befb95e8ba5128924f` 中 blob 均为
  `e70265e2913070cc7cd8f76fa0d590a33dba6f77`，可安全从 exact URL 恢复。
- v0.3.1 bootstrap：750 行 / 21,565 bytes；当前 blob 与 immutable v0.3.2 tag tree 中 blob 均为
  `2e470386a29ebe6fd9e78b05c736a24fd010565c`。README blob 也与 v0.3.2 tag 精确相同，证明该依赖属于
  sealed source，不是可以在 P2 单独删掉的普通文档残留。
- 全仓 moving Release URL 扫描零匹配；当前历史链接均使用 exact tag/commit/Release，不依赖
  `latest/download`、moving branch blob 或 `refs/heads`。

## Frozen P2-I Change Set

### Delete / rotate out

1. 删除当前树 `docs/v0.3.1-cloud-hard-acceptance.md`，把 provenance/CHANGELOG 链接改为 exact
   `435f830...` immutable URL。
2. 删除 `published-release-oracles.test.js` 的 v0.3.0/beta.2 默认重建 block 与其专属常量；v0.3.0 和
   beta.2 继续留在 curated provenance/CHANGELOG museum，不删除历史。
3. 删除 `release-package.test.js` 的 v0.3.0/v0.3.1 SHA `notEqual` 常量/断言。
4. 删除 `skill-patch.test.js` 的 v0.3.1 专属 identity case/constant，但先把全部通用供应链断言迁入
   v0.3.2 case。
5. 删除 AGENTS 中重复的 v0.3.1 syntax 命令；README 同名命令因 sealed-input 约束暂留。

### Generalize / relink

1. `contracts.test.js` 用版本无关 bootstrap pattern 证明所有 bootstrap 不进入 ZIP。
2. BASELINE_PROVENANCE 将 v0.3.2 作为当前已发布 identity 条目；v0.3.1 降到精选历史里程碑，保留完整
   tag/source/asset identity 与永久安全意义，并链接 exact acceptance。
3. ROADMAP 把 rollback evidence 分为 v0.3.1 immediate fallback 与 provenance museum；P2 transition
   收口为 bootstrap-only `sealed source residue`，明确 P3 删除条件。
4. repository lifecycle 分别派生 active bootstrap/acceptance 与 bootstrap-only sealed residue，不使用
   宽泛 allowlist；P2 完成后当前 acceptance 只剩 v0.3.2。

### Keep

- v0.3.1 root bootstrap 与 README v0.3.1 syntax 行：直到 P3 建立新 machine identity 后一起删除。
- v0.3.1 publication oracle：作为 immediate fallback 与 root residue 字节证明。
- v0.3.2 acceptance 中所有 v0.3.1 时间语义、CHANGELOG v0.3.1 delta、ROADMAP 的 inherited-security
  摘要、provenance v0.3.1 精选身份。
- `architecture-contracts.test.js`、repository 精选 tombstones、v0.3.0/beta.2 provenance/CHANGELOG。

## P2-D Conclusion

`CONDITIONAL_GO`。上述 change set 可以在不修改 sealed v0.3.2 ZIP inputs、production runtime、Host ABI、
trusted graph、tag/asset 或 P3 identity 的情况下实施。维护者需明确授权 P2-I；若要求连 root v0.3.1
bootstrap/README 一并删除，则当前结论转为 `NO_GO`，必须等待 P3 新 source identity。

## Maintainer Override: README May Leave the Sealed v0.3.2 Tree

- 维护者明确授权 P2 同时删除 root v0.3.1 bootstrap，并把 README 的固定版本 syntax 命令改为版本无关
  占位/循环；理由是后续 P3 会重建新 ZIP，P2 不需要继续让 HEAD 逐字等于已发布 v0.3.2。
- 这项授权推翻了 P2-D 的单一 deferred residue 结论，但没有授权复用 v0.3.2 identity 重发 ZIP，也没有
  授权建立 v0.3.3-dev。published v0.3.2 继续由 immutable tag/source oracle 证明。
- P2 后 package/contract 仍为 0.3.2，root v0.3.2 bootstrap 仍是 published asset；但当前 HEAD 的 README
  bytes 已变化，因此从 HEAD 构建的 ZIP 只能称为 deterministic unsealed transition bytes，不能称为
  candidate 或 published v0.3.2。下一次 seal 前 P3 必须建立新 machine identity 与 fail-closed bootstrap。
- README/AGENTS 采用 `for bootstrap in init-cloud-sandbox-v*.bash; do bash -n "$bootstrap"; done`，既可
  直接执行，又由当前角色文件集合决定检查对象，不冻结具体版本号。
- `release-package.test.js` 应继续证明 current source 双构建确定、contract boundary/self-contained 成立，
  同时明确 current SHA 不等于 published v0.3.2；精确 published v0.3.2 SHA 只由 tag oracle证明。
