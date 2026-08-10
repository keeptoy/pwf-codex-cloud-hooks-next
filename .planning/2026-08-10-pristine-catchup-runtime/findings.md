# Findings: v0.3.3-dev Pristine Catch-up Runtime

## Inherited evidence

- Phase 1 的四项 overlay 只修改 upstream catch-up CLI 的 session selection、runtime inference、planning guard
  与 CLI rendering；Phase 2 owned wrapper 从首次激活起即不调用这些分支。
- Managed/pristine pinned source 的四个 helper roots 及 15-helper transitive closure 相同，与 patched symbols
  和 `main()` 的交集为空。
- Phase 3 private snapshot 属于 plan invocation strategy，只是避免新增第二组 plan overlay；catch-up overlay
  的替代机制是 Phase 2 validated/frozen transcript、explicit runtime/project state 与 owned renderer。
- 动态加载完整 module 会执行 `configure_utf8_stdio()` 和 optional `orjson` import；Route B 必须测试该真实
  import-time surface，不能宣称只加载四个函数字节。

## Selected route

Route B：保留 pinned pristine full `session-catchup.py`，显式冻结 owned helper allowlist/closure；删除 current
patcher、active overlay ledger 与 patched manifest chain。Published v0.3.2 的 overlay identity只保留在 cold
provenance 与 immutable refs，不在 current tree 保存可执行博物馆副本。

## Closed checks

- candidate/accepted 两席窗口已冻结为 v0.3.3-dev Source/Candidate + published v0.3.2 accepted；新 bootstrap
  保持 64 位 zero hash 并 fail closed，未改变发布角色。
- importer contract 已在原 contract family 内统一四项 `upstream_pristine`，拒绝 non-pristine origin、managed
  hash 分叉和任何 overlay declaration，不需要扩大 Host ABI 或 schema migration。
- `skill-patch.test.js` 的通用 bootstrap/global-Skill 安全断言已迁入 `bootstrap.test.js`；patch-specific 行为由
  importer fail-closed 与新的 pristine helper boundary 取代，不保留可执行历史 fixture。

## G6 pre-release inventory（2026-08-10）

- `.planning` 下四个历史 scope 目录的 direct item 与 recursive file 计数均为 0：
  `2026-08-09-architecture-contract-retention`、`2026-08-09-history-retention-governance`、
  `2026-08-09-v0.3.2-baseline-promotion`、`2026-08-09-v0.3.2-release-cloud-acceptance`。
- 唯一活动 scope `2026-08-10-pristine-catchup-runtime` 含 `task_plan.md`、`findings.md`、`progress.md`，不得删除。
- 本轮只删除上述已验证空目录，并重新生成未封板的本地 development ZIP；不写入 bootstrap checksum，
  不创建 tag/Release，也不改变 accepted/rollback 角色。
- G6 双构建均产生 21 entries、74,206 bytes、SHA-256
  `40e3e134aa4d9a7f452a2447f4aa9026af479882c9b7f78074fc9e3370646182`；结构化 byte-array 比较为 true，
  两次 contract check 均 `healthy=true`。只保留 `dist/pwf-codex-cloud-hooks-v0.3.3-dev.zip`。

## G7 Cloud runbook parity discovery（2026-08-10）

- 维护者发现 v0.3.3-dev acceptance 仅 142 行，而 v0.3.2 已验证手册为 649 行；这不是单纯篇幅差异：前者
  只有 setup 摘要和 B～F 目标，没有可复制的 Fresh/canonical/long-tail/real-Resume 提示词、精确 post-resume
  深度断言、失败取证、通道证据模板和完整停止条件。
- v0.3.2 的稳定可复用骨架是：双通道身份隔离 → Source/Candidate portable suite + 双构建/override 安装 →
  Fresh → 创建 canonical baseline → UserPromptSubmit → long tail → real Resume → source/publication 各自的
  doctor/inventory/policy/residue → 独立证据模板。v0.3.3-dev 应继承该结构，而不是重新发明较弱流程。
- 必须替换而不能机械复制的部分：版本/fixture 标记、21-entry pristine ZIP、zero-hash development bootstrap、
  retired patcher/overlay 的 absence、四项 upstream pristine identity 与 helper allowlist/closure；R5-PR 仍未授权，
  只能保留明确 placeholder，不能填造 tag、公开 URL、size、SHA 或 PASS。
- Current contract authority 已定位：root `upstream-manifest.json`、`contracts/runtime-bundle-v1.json` 与
  `contracts/release-artifact-v1.json`。Release allowlist 为 21 entries，external asset 只有
  `init-cloud-sandbox-v0.3.3-dev.bash`；四项 upstream 均为 `origin=upstream_pristine`、managed/pristine SHA
  相等、`overlay_ids=[]`，owned catch-up 只允许四个 parser roots。
- Current bootstrap 默认 version 是 `v0.3.3-dev`、默认 SHA 是 64 位 zero hash，并在没有显式 override 时
  fail closed。R5-SC 脚本应断言这个 placeholder 尚未被误 seal，再用 `file://` + runtime SHA override 安装；
  R5-PR 的公开 URL/SHA/size 必须全部保持 publication placeholder，而不是指向不存在的 `v0.3.3-dev` Release。
- Current installed inventory 为 10 个 manifest-owned payload 加生成的 `installed-manifest.json`：adapter、两个
  owned runtimes、四个 pristine upstream files、两个 installed plan contracts 与 notice。v0.3.2 的 11 payload
  数字包含现已退休的 compatibility ledger，不能复制到 v0.3.3-dev F gate。
- 现有 repository lifecycle guard 只冻结了双通道名、override/default-download 摘要和一个简化的 public
  post-resume 段，未冻结 Fresh/canonical/tail/real-Resume 的可执行提示词和 evidence ledger，因此 142 行手册
  仍能通过。G7 应把“可重放骨架完整性”加入该 lifecycle guard，同时保持 architecture tests 不绑定版本。

### G7 conclusion

- 扩展后的手册不再把“目标描述”当作 runbook：R5-SC setup、四段黑盒 fixture、source F deep assertion、
  未来 R5-PR 的公开重新下载复验和两套 evidence template 均可直接复制执行。
- Publication pending 被建模为硬 placeholder gate；当前文档不会指向一个不存在的 v0.3.3-dev Release，
  也不会让 Source/Candidate PASS 冒充 Published Release。
- 新 lifecycle guard 冻结可重放骨架但不把版本历史塞入 architecture invariant tests；未来 lifecycle 晋级
  需要替换 identity/placeholder 席位，而不是复制越来越多的历史 runbook 断言。

## G8 Cloud lifecycle split discovery（2026-08-10）

- 维护者回传 R5-SC setup 为 93/93 PASS，21-entry ZIP 为 74,206 bytes、SHA-256
  `40e3e134aa4d9a7f452a2447f4aa9026af479882c9b7f78074fc9e3370646182`；Source/Candidate F 的 doctor、
  exact 10-file inventory、四项 pristine upstream、四 helper roots、adapter-only policy 与 zero residue 也 PASS。
- OpenAI 官方 Cloud environment 文档区分两条容器时序：冷任务先 checkout 选定 branch/commit 再运行 setup；
  environment cache 则以 default branch clone/setup 形成，恢复缓存容器时才 checkout 本次 chat 的分支并可运行
  maintenance。不能把任一时序写成所有 Cloud 任务的唯一事实。
- 当前 R5-SC 的环境 setup 为空，安装脚本在 agent 已启动后的第一条提示中执行；安装后的下一 task 已错过
  原始 startup，B 只能验证 post-install Resume，不能要求 `source=startup`；如果新 task 没有产生新的
  SessionStart，该次 B 必须失败，不能用 UserPromptSubmit 冒充。未来 R5-PR 在 environment setup 中从公开
  URL 安装，首个 task 才能验证 Fresh `source=startup`。
- B 应恢复 v0.3.2 的直接输出锚点：SessionStart、实际 source、UserPromptSubmit、Planning context、
  `===BEGIN PLAN DATA===` 与 `=== recent progress ===`。catch-up 报告属于 E2；Phase 4 absence 属于 D 和
  source negative tests，不应作为 B 的解释性汇总字段。

## G9 publication authorization（2026-08-10）

- 维护者确认修订后的 Source/Candidate Cloud lifecycle 全部通过，并明确授权直接 push、封板和发布。
- 当前列车从 `0.3.3-dev` 晋级的正式 immutable identity 选定为 `v0.3.3`；这是同一 `0.3` 行为合同内退休
  不可达 compatibility supply-chain 的 patch release，不新增 Hook、Host ABI、trusted graph 或 Phase 4。
- publication 只关闭 tag、公开 ZIP/bootstrap 与重新下载资产复核；R5-PR 必须在资产公开后另行从 URL
  安装并跑 Fresh startup、canonical planning、real Resume 和 post-resume deep check，不能预填 PASS。
- GitHub Latest/rollback baseline promotion 仍是独立授权，不随 Release 自动发生。

## R5-PR runbook transport incident（2026-08-10）

- Cloud 10.2 在第一个下载动作前退出：临时执行文件引用 `$PUBLICATION\_TAG`，Bash 将其解析为未定义的
  `$PUBLICATION` 加字面量 `\_TAG`，`set -u` 因而报 `unbound variable`。
- Repository HEAD、`origin/0.3.3-dev` 与 acceptance 源文本第 659～678 行均使用未转义的
  `$PUBLICATION_TAG`/`$ZIP_NAME`；全仓目标文档没有任何 literal `\_`。因此不是 Release asset、产品代码或
  repository runbook source defect，而是 Markdown/提示词到 `/tmp/run-user-script.sh` 的 lexical transport drift。
- 维护者确认转义来自提示词运输。Cloud 随后直接下载原始 acceptance、提取 10.2 Bash block，并以公开
  Release 元数据复核参数后原样执行；ZIP boundary/importer、doctor、10-file inventory、adapter-only policy
  与 zero residue 全部 PASS。
- ROADMAP §7 已正确覆盖 Published Release 身份、公开 URL、重新下载、ZIP 内工具和 Fresh/Resume/doctor
  分流。本次不把上游提示词转义扩大为 repository contract 或新的 hardening gate；操作经验是执行型代码块
  应优先从 raw source 提取，而不是执行被富文本转义的复制副本。

## G10 acceptance consolidation decision（2026-08-10）

- 维护者确认完整 R5-PR 已 PASS。当前问题不是产品或验收缺口，而是版本 acceptance 把可复用行为提示词、
  版本资产输入和动态 gate 状态混在同一线性章节中，导致每轮要机械改版本、marker 和状态。
- B～E 的 lifecycle/canonical/tail/resume 行为不依赖 package version，应改用稳定语义 sentinel，不再在提示词
  中自称某版本测试，也不观察没有判定价值的 `Phase 4 marker`。
- Published setup 的最小可信输入不是“只有 ZIP SHA”：必须先有 immutable bootstrap URL 与 bootstrap SHA，
  校验 bootstrap 字节后由其内嵌默认 ZIP URL/SHA 安装。Published F 的最小外部输入可以收敛为 immutable
  ZIP URL + ZIP SHA；filename、package version、size 与 inventory 从已验证 ZIP/contracts/manifest 派生。
- v0.3.3 的 tag/source/asset identities、Cloud PASS 和回传 marker 仍是历史证据，不应从 acceptance 删除；
  它们只留在 identity/result ledger。通用黑盒正文不再随候选版本或当前 lifecycle 状态频繁改写。

## G11 reusable acceptance template decision（2026-08-10）

- 通用模板属于稳定维护协议，不是第三个版本 acceptance，也不占用 candidate + accepted 文件窗口；具体
  version/source/asset identity、测试计数和 PASS/PENDING 只能写入复制后形成的版本专项文档。
- 模板应可直接复制，但不能把当前 21-entry/10-file/4-helper 等实现数字变成永久写作事实。Source/Candidate
  和 Published deep check 从 package、Release contract、runtime bundle 与 installed manifest 动态派生。
- 黑盒 B～E 使用 G10 已冻结的 `PWF_CLOUD_ACCEPTANCE_*` 语义 fixture；setup/F 的唯一版本替换面分别是
  bootstrap URL + SHA 与 ZIP URL + SHA。模板正文不记录任何当前 programme、Latest/rollback 或 Cloud 状态。
- DESIGN 仓库地图提供实现入口，仓库治理指南规定模板的 copy/freeze 生命周期；README 已有的 `docs/`
  专项 runbook/acceptance 通用入口保持不变，避免在 post-release HEAD 改写 sealed ZIP 输入。版本专项
  acceptance 仍由 ROADMAP 角色窗口管理并在发布后成为带时间语义的冷证据。

## Post-gate ARCHITECTURE ↔ source audit（2026-08-10）

- 本轮只审计当前 `ARCHITECTURE.md` 是否准确描述 v0.3.3-dev source、contracts、installed layout、runtime
  dispatch、失败语义与 Release boundary；`ARCHITECTURE-old-0.3.2.md` 只作 immutable 历史对照，不参与结论。
- 第一轮文档/contract 对照确认：Managed policy 单 adapter、plan-first、六字段 project 转交、catch-up exact-v1
  request/result、20,000 字符预算和 child failure 降级均在当前 schema 与 adapter validator 中有直接对应。
- 仍需用函数级源码和 installer/manifest/Release inventory 反证部署图、transcript fallback 顺序、private
  snapshot、helper closure、deadline/process cleanup 与 installed file list，未完成前不宣称完全一致。
- Adapter 实际顺序为：先取得并验证 plan result，且仅在 `inject=true` 的 `SessionStart` 才把该 result 的六字段
  project 原样放入 catch-up request；catch-up 成功后最终 context 才按 canary → report → plan 拼接。该行为与
  Runtime 数据流和失败语义一致，但“调用顺序”与“最终输出顺序”需要继续保持明确区分。
- 发现一处文档精度歧义：ARCHITECTURE §6 把三类 fallback root 列成 transcript“选择顺序”，源码实际是按
  `CODEX_SESSIONS_DIR` → `$CODEX_HOME/sessions` → installed-layout 推导构造/去重最多三个 allowed roots，随后
  汇集其中最多 256 个受控候选并按 `mtime_ns` 全局倒序寻找第一个 session/project 匹配项；并非前一 root
  无匹配后才进入后一 root。Host validated path 仍保持绝对第一优先。
- Machine inventory 反证当前 Release contract 有 21 个 allowlisted source entries，installed runtime 则由
  installer 收窄为 adapter、两个 owned runtimes、四个 pristine upstream files、两个 plan contracts、
  `THIRD_PARTY_NOTICES.md` 与生成的 `installed-manifest.json`。ARCHITECTURE §3 的 installed tree 未画出 notice，
  属于简化图中的实际 inventory 漏项；DESIGN §3 已包含 notice，二者应统一。
- Runtime bundle/manifest 已证明四个 upstream `origin=upstream_pristine`、managed/pristine SHA 相等、
  `overlay_ids=[]`；Release ZIP 还包含 importer、builder、全部五份 machine contracts、README/package/install
  等维护输入，但这些不会全部进入 installed runtime。ARCHITECTURE 的 source/build/install 分层方向正确。
- Installer 源码确认 Managed policy 只生成两个指向 `/usr/bin/python3 <absolute adapter> <event>` 的 handler，
  timeout 为 30 秒；adapter 自身共享 deadline 为 27 秒并保留 1 秒 finalization reserve。`owned-plan.py` 和
  `owned-catchup.py` 从未直接注册到 policy。ARCHITECTURE §3/§8 与该真实边界一致。
- Install/doctor/repair 对 runtime inventory、hash、mode、manifest owner/version/upstream、requirements owned/
  unowned hash 和 unknown entries 均有 fail-closed 检查；repair 只在 blocker 为空时重写已拥有字节，uninstall
  先备份再移除 owned requirements block/runtime。ARCHITECTURE §8/§10 的失败和所有权口径一致。
- Importer 仅处理 runtime bundle 的四个 pristine upstream files，验证 archive/license/source hash、mode、
  symlink 与 exact destination inventory；Release builder 则按独立 allowlist 打包 21 个 source entries。
  二者确实属于不同维护面，且均不进入 production dispatch。

### Audit conclusion

- 当前 ARCHITECTURE 的核心逻辑与 source/contracts 一致：plan-first、adapter-thin、project exact forwarding、
  private snapshot、owned catch-up、pristine helper closure、adapter-only policy、fail-open advisory composition、
  fail-closed integrity/content、deterministic Release 与 external bootstrap 边界均有直接实现和测试证据。
- 本轮没有发现 production code defect、Host ABI 漂移或 trusted graph 漂移；只修正三处文档精度：主部署图
  补 deterministic ZIP layer 与 installed notice、Runtime 图区分 canary 准备和最终单次输出、fallback roots
  区分 trust-root construction order 与跨根 newest-session selection。
- `ARCHITECTURE-old-0.3.2.md` 未修改，也没有被现行 authority 引用；v0.3.2 冷历史与 v0.3.3-dev 当前事实
  继续隔离。

## G12 v0.3.3 baseline promotion preflight（2026-08-10）

- 维护者已明确授权 `v0.3.3` 晋级为 GitHub `Latest` 与 production rollback baseline，并明确
  不进入 Product Phase 4。授权面与 ROADMAP 既有 promotion-pending 停止点精确对应。
- 本地 `0.3.3-dev` 与 `origin/0.3.3-dev` 同步且 worktree 干净；`v0.3.3` tag 精确指向
  seal commit `a1b9f4548e3b6e071fee611270365c8ecf3f8d13`。
- GitHub preflight 返回 `Latest=v0.3.2`；`v0.3.3` 为 non-draft、non-prerelease Release。其 ZIP 与
  external bootstrap 分别为 74,198 / 21,565 bytes，server digest 分别为
  `2b2dca5c5894a2297a6f2ccc5fb190878c3c920b71148719a4873326b4ccb352` /
  `236e364bde8397b04c9d7ebfa121fa96963055d77b56e6299e6b9c9aad6c887e`，与 frozen acceptance/provenance
  一致。v0.3.2 双资产 identity 也与当前 accepted oracle 一致。
- 上次 v0.3.2 promotion 已证明的最小路线仍适用：design checkpoint → `gh release edit
  v0.3.3 --latest` → 独立 `releases/latest`/asset 后置复核 → lifecycle/evidence/guard 同步 →
  focused/full validation → commit/push。
- BASELINE_PROVENANCE 只维护不可变身份与来源，不复制当前 Latest/角色；因此 promotion 只需
  更新其 v0.3.3 持久证据意义中已过时的“promotion 尚待授权”表述，不改任何已登记 identity。
- G12-A design checkpoint 已提交并 push 为 `37b87d4`，其中只有活动 planning 的授权、preflight、边界与
  停止条件；没有提前改写 lifecycle 状态或 Release identity。
- G12-B 只执行 `gh release edit v0.3.3 --latest`。独立 `releases/latest` endpoint 返回 tag `v0.3.3`、
  release id `367806502`、non-draft/non-prerelease；Release list 也只把 Latest 标记从 v0.3.2 移到 v0.3.3。
- Postflight 重新读取 v0.3.3/v0.3.2 两个 Release：四个资产的 filename、size、server digest 与 preflight
  完全一致，证明 pointer-only promotion 没有重建、替换或改写 ZIP/bootstrap。
- 当前树仍需保留 v0.3.3 与 v0.3.2 两套 bootstrap/acceptance：promotion 后 candidate 与 accepted 都是
  v0.3.3，而 v0.3.2 成为 immediate fallback。ROADMAP 必须显式增加可解析的“当前直接回退版本”角色，
  repository guard 则按 candidate + accepted + immediate fallback 的去重版本集合管理 current file window。
- Published oracle 应从 v0.3.2 accepted + v0.3.1 fallback 轮换为 v0.3.3 accepted + v0.3.2 fallback；两版
  historical Release contract 的 entry count 分别为 21/23，测试需要把 entry count 放进每个 immutable oracle，
  不能继续把 v0.3.2 的 23-entry 历史常量错误套给 v0.3.3。
- v0.3.3 acceptance 是带时间语义的专项证据：应保留“Cloud gate 本身不自动授权 promotion”，并追加随后
  获得独立授权、pointer-only postflight PASS 的记录；不能把原始 Cloud PASS 改写成当时已自动晋级。

## G13 successor main fast-forward preflight（2026-08-10）

- 维护者明确要求把本地 `0.3.3-dev` 推送到远端 `main`，但没有授权 force、改写 Release/tag、branch
  settings/ruleset 或 Phase 4；因此唯一允许的远端 ref write 是 ordinary `0.3.3-dev:main`。
- Preflight 时 worktree clean，local `0.3.3-dev`、`origin/0.3.3-dev` 与 HEAD 都是
  `a65f889a1dacef4239951e284082ced9e2fcf03c`；GitHub CLI 以 `keeptoy` authenticated，Git 使用 SSH。
- Fresh fetch 后 `origin/main=03aebaca5ae7223ef56c62ec1d340ab9a7c8dea7`，且
  `git merge-base --is-ancestor origin/main 0.3.3-dev` 成功；left/right count 为 `0/71`。这证明更新可以
  fast-forward，不会覆盖 main 独有提交，也不需要 merge commit、rebase 或 force push。
- ROADMAP 已把 successor `main` 定义为源码维护权威；G13 只让远端 ref 与已完成 v0.3.3 lifecycle 对齐，
  不改变 package、runtime、Host ABI、trusted graph、Latest/rollback 或 Phase 4 状态。
- G13-A planning-only checkpoint 为 `e269b83c57f5f619a74f915f1a1818734ca50470`，先推送到
  `origin/0.3.3-dev`；随后唯一 main write 使用普通 `git push origin 0.3.3-dev:main`，Git 报告
  `03aebac..e269b83` fast-forward，没有使用 force 或产生 merge commit。
- Postflight 从 GitHub ref API 分别读取 `refs/heads/main` 与 `refs/heads/0.3.3-dev`，两者都返回
  `e269b83c57f5f619a74f915f1a1818734ca50470`；fresh fetch 后 remote-tracking refs 的 left/right count 为
  `0/0`。该证据关闭 main ref gate，不产生 Phase 4 授权。
