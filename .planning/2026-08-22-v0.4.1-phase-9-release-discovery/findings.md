# Findings: v0.4.1 Phase 9 Release Discovery

## Entry facts

- `v0.4.1-dev` 是 `v0.4.0` 之上的 path-safety compatibility/security patch；不改变 Host ABI、runtime trusted
  graph 或 unknown regular cleanup 合同。
- 本地 gate 与 exact source `6c1dd52a3878f59c7140a793b9a2c2a34580b188` 的 Source/Candidate Linux/Cloud 已
  PASS；后续 docs/tests/planning-only commits 不改变候选 ZIP。
- 当前版本 acceptance 明确停在 `STOP_BEFORE_SEAL / RELEASE_NOT_AUTHORIZED`。
- 当前 `0.4.1` branch 工作树 clean，local 与 `origin/0.4.1` 同步。
- Release artifact 为 22 entries；`.planning/`、`docs/` 与 `tests/` 不进入 ZIP。历史文档清理不会缩小 runtime 包。
- `contracts/installed-state-transition-v1.json` 固定当前 accepted `0.4.0` predecessor，是 `0.4.1` 升级准入，
  不能在本列车发布前当作纯历史垃圾删除。

## Initial decision

- 先完成 `v0.4.1` Release，再在下一开发列车做 compatibility retirement Discovery。
- 下一轮只有在不改变安装、升级、回滚和 runtime 用户合同时才适合 `0.4.2`；触及这些合同则需要更高版本/独立
  Product Phase。
- 本 Discovery 首先复用 `v0.4.0` 已证明的 Phase 9 路线，但不会机械复制其 commit、SHA、资产或历史结论。

## Current identity audit

- Discovery entry HEAD 与 `origin/0.4.1` 均为 `5c88210d641a7299b919fe20dd671dc7158c930e`；该 HEAD 没有 tag。
- source identity 仍为 `0.4.1-dev`：`package.json`、Release contract 与 bootstrap 相互一致，external asset 为
  `init-cloud-sandbox-v0.4.1-dev.bash`。
- bootstrap 默认 SHA 仍是 64 位 zero hash，并在未 override 时 fail closed。这是 pre-seal development candidate 的
  正确状态，不是缺陷。
- current accepted 为 immutable `v0.4.0`，immediate fallback 为 immutable `v0.3.5`；任何 v0.4.1 promotion 前都
  不能提前轮转这两个角色。

## v0.4.0 Phase 9 lessons recovered

- 已证明顺序为 P9-A pre-seal materialization → P9-B local seal + sealed-source Cloud → P9-C immutable Pre-release
  publication → P9-D public default-download Cloud → P9-E pointer-only Latest promotion → P9-F second retirement。
- P9-A 与 P9-B 必须分开：P9-A 可以冻结 stable identity 与 ZIP inputs，但保持 zero hash；P9-B 必须从 P9-A clean
  source 重新双构建、写入 exact ZIP SHA，再计算 bootstrap SHA。
- P9-B local seal 不等于 P9-B PASS；exact final-source Source/Candidate Cloud 返回前，P9-C 仍未授权。
- P9-C tag source 固定为实际 sealed-source Cloud 测过的 source；其后的 Release-excluded operator/evidence commit
  不能替换 tag target。
- P9-D 必须使用公开 bootstrap 的默认 HTTPS URL/SHA 链和全新 Cloud，不得复用 Source/Candidate environment 或
  local override。
- P9-E 只能在 P9-D PASS 后做一次 Release metadata pointer mutation；不得改 tag、资产、notes、title 或 target。
- P9-F 只处理角色窗口退出对象；稳定 contracts/tests/history 与仍承担恢复职责的 refs 不得机械删除。

## v0.4.1 narrowing hypothesis

- `v0.4.0` P9-A 曾包含 `0.4.0-dev → 0.4.0` 的大规模身份迁移、README/current authority 对账和 oracle 替换。
  `v0.4.1` 已是范围冻结的 patch candidate，P9-A 应先证明哪些 stable identity 传播仍必需，不能照搬上一列车的大迁移。
- 当前验收过的 candidate source 是早期 `6c1dd52…`；当前 final development HEAD 是 `5c88210…`，差异为
  Release-excluded docs/tests/planning 治理。seal 前仍需冻结真正 tag source，并在 P9-B 从该 exact source 重跑 Cloud。

## v0.4.1 identity propagation inventory

- 需要从 dev 收敛到 stable 的 machine identity 至少包括：`package.json` version、Release v2 `package_version`、
  Release v2 external bootstrap filename、bootstrap filename/default `HOOKS_VERSION`，以及 Release contract 原始字节变化后
  `upstream-manifest.json` 中的 exact SHA edge。
- 当前版本 acceptance 应 rename-not-duplicate 为 stable `v0.4.1` 文件/顶层 anchor；其中已经执行的 Cloud source、ZIP
  hash与 installer `0.4.1-dev` 观察是历史事实，不能为了 stable 外观批量改写。
- CHANGELOG 的单一 `v0.4.1-dev` delta 应提升为 `v0.4.1`，不复制 dev/stable 两份变化清单。
- ROADMAP 仍需保持 candidate `v0.4.1`、accepted `v0.4.0`、fallback `v0.3.5` 三席分离；P9-A 不提前轮转
  accepted/fallback。
- repository-boundary 有两处当前 candidate hardcode `v0.4.1-dev`，应在 P9-A 与 stable identity 同步；Release package
  测试其余 identity edge 已从 package/contract 动态派生。
- README、ARCHITECTURE 与 DESIGN 没有发现需要随 patch stable identity 改写的 `v0.4.1-dev` current claim；不能复制
  v0.4.0 P9-A 当时的 F3/current-authority 大规模对账。
- `BASELINE_PROVENANCE.md` 在 immutable tag/双资产真实存在前不得预填 `v0.4.1` public row；它属于 P9-C evidence
  writeback，不属于 P9-A stable identity materialization。

## Proposed P9-A scope boundary

- `MIGRATE`: package/Release-contract/manifest/bootstrap/acceptance/CHANGELOG/ROADMAP/current-role tests 的 stable identity。
- `KEEP`: production runtime、Host ABI、runtime bundle、installed-state transition predecessor `0.4.0`、v0.4.0 accepted
  bootstrap/acceptance、v0.3.5 immutable fallback、历史 Cloud evidence。
- `DEFER`: exact ZIP SHA写入、bootstrap SHA、sealed-source Cloud operator/evidence、tag/Release/publication、Latest、
  role rotation与历史兼容 retirement。
- P9-A 的 candidate ZIP 将因 package/contract/manifest stable identity 字节变化而获得新 hash；该 hash只作为 zero-hash
  pre-seal 本地事实，P9-B 必须重新证明后才能写入 bootstrap。

## Exact-source continuity

- `git diff 6c1dd52…HEAD` 只有 planning、AGENTS、ROADMAP、stable Cloud template/version acceptance 与
  repository-boundary 治理变更；与 Release v2 entries及 external bootstrap 的交集为零。
- 因此当前 `5c88210…` development source 的 Release bytes 与已记录的 22-entry、85,915-byte、SHA-256
  `543a72a57fdd7ca04854d5d1dfde6f838bf40e3afa5eb2c52c2d559b3843854a` candidate 保持同一输入。
  这只证明 P9-A 前没有隐性 ZIP 漂移，不替代 P9-A stable identity 变更后的重新双构建。
- 当前 Release contract SHA-256 为 `4f89e5bfc6c1cbe68afa82e612381bf99c66ae223c3c12295e3dd112a03ab6e0`，
  与 `upstream-manifest.json` 的 exact integrity edge 一致。

## Proposed v0.4.1 Phase 9 route

1. `P9-A pre-seal materialization`：将必要 machine/current identity 原子收敛为 `0.4.1`；bootstrap保持zero hash；
   rename acceptance/bootstrap而不复制；跑完整本地矩阵与双构建，记录新的 pre-seal ZIP事实。
2. `P9-B seal + final-source Source/Candidate`：从clean P9-A source重新双构建，写入exact ZIP SHA，计算bootstrap
   SHA；由维护者push exact seal HEAD并按版本operator重跑Source/Candidate，失败若涉及ZIP input则回到P9-A。
3. `P9-C immutable Pre-release`：固定Cloud实际验收的tag source；维护者创建lightweight tag/Pre-release、上传
   双资产；从tag source和public download分别重建/校验后才登记provenance。
4. `P9-D Published Release Cloud`：在独立Fresh Cloud从公开bootstrap默认链安装，完成Fresh/canonical/real Resume、
   doctor与9.2 public ZIP deep check。
5. `P9-E pointer-only Latest promotion`：P9-D PASS后只改变Release metadata；postflight确认`v0.4.1` accepted/Latest、
   `v0.4.0` immediate fallback，tag/source/assets不变。
6. `P9-F second retirement`：只退役已有immutable恢复入口接管的旧working-tree role文件；保留v0.4.0 public fallback、
   exact transition、稳定tests/history与必要refs；下一列车compatibility retirement另行Discovery。

## Discovery decision

- 推荐 `CONDITIONAL_GO` 到 P9-A，不建议为这个窄patch额外插入RC；若P9-A/P9-B发现production、contract、ZIP inventory
  或兼容范围漂移，再停止并重新评估RC/新版本身份。
- P9-A可以独立授权，因为当前没有发现必须修改production、Host ABI、trusted graph、runtime bundle、installed inventory
  或upgrade/rollback合同的阻塞项。
- 该结论只授权建议，不自动授权P9-A实施，更不授权seal、Cloud、tag、Release、Latest或远端写。

## Resources to inspect

- `ROADMAP.md`
- `docs/history/phase-9-v0.4.0-release-discovery.md`
- `docs/v0.4.0-cloud-hard-acceptance.md`
- `docs/v0.4.1-dev-cloud-hard-acceptance.md`
- `BASELINE_PROVENANCE.md`
- `docs/cloud-hard-acceptance-template.md`
- `tools/build_release.py`
- `contracts/release-artifact-v2.json`
- `upstream-manifest.json`
- `init-cloud-sandbox-v0.4.1-dev.bash`

## P9-B entry reconciliation — 2026-08-22

- P9-A已在commit `8ef5ec6f396c7ae022231ace14717fd6630a7be0`完成stable identity物化；当前package/Release contract/bootstrap/acceptance均为`v0.4.1`，工作树clean。
- P9-A预封板ZIP为22 entries、85,910 bytes、SHA-256 `94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291`；P9-B必须从clean P9-A HEAD重新双构建确认，不能直接抄写该观察值。
- P9-B唯一允许改变的Release外部字节是`init-cloud-sandbox-v0.4.1.bash`中的默认`HOOKS_SHA256`；bootstrap不在ZIP allowlist，因此写hash后ZIP必须保持完全相同。
- local seal完成状态与sealed-source Cloud PASS必须分开：本地可冻结ZIP/bootstrap SHA与Cloud operator；Cloud结果回传前ROADMAP/acceptance只能写`SEALED_SOURCE_CLOUD_PENDING`，P9-C继续未授权。
- P9-B不修改package、Release contract、manifest、runtime bundle、installed transition、production runtime、README、ARCHITECTURE或DESIGN；若双构建出现不同ZIP身份或需要改变这些输入，立即停止并重新seal/Discovery。
- v0.4.0 precedent将P9-B本地seal evidence与sealed-source Cloud operator放在同一stable acceptance：本地段冻结P9-A起点、ZIP entries/size/SHA、bootstrap SHA与pending marker；operator只链接稳定template并要求expected HEAD三点一致。
- 当前bootstrap test已经会在non-zero默认hash时要求`assert_hooks_checksum_configured`成功；还需为v0.4.1 current candidate补最近边界，直接证明bootstrap默认SHA等于从当前Release输入构建的ZIP SHA，并冻结P9-B local evidence/operator状态。
- `tests/release-package.test.js`实际上已具备seal核心关系断言：一旦bootstrap默认SHA非零，就必须等于现场双构建ZIP SHA；P9-B只需增加“local seal marker出现时默认SHA不得为零、acceptance中的ZIP/bootstrap SHA必须匹配现场字节”的状态绑定。
- 当前v0.4.1 acceptance的0～6节属于已执行dev Source/Candidate历史并保留dev anchors；P9-B应像v0.4.0 precedent一样在它们之前新增stable local-seal evidence与sealed-source operator，避免把历史run sheet改写成新的Cloud结果。

## P9-B sealed-source Cloud reconciliation — 2026-08-22

- 维护者确认整条`4.1 → 5.1 → 6 → 7 → 8.1 → 8.2 → 9.1`全部通过；按AGENTS交互纪律直接写回，不重判、不要求重跑。
- pushed、setup与deep-check exact HEAD均为`99885b854bd9621c3340e99f031bf83ceb58414d`；未来P9-C tag source必须固定为该Cloud实际验收的seal commit，而不是本次Release-excluded evidence commit。
- Linux portable suite为175/175、零fail/skip；Cloud ZIP仍为22 entries、85,910 bytes、SHA-256 `94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291`，与本地seal完全一致。
- real Resume后的doctor、schema/contract、12-file installed inventory、4-file pristine upstream、bundle authority、adapter-only policy与零snapshot residue全部闭合。
- P9-B结束只证明sealed source可以发布；immutable tag、Pre-release、公开双资产、Published Release Cloud、Latest和角色轮换仍是独立后继gate。
