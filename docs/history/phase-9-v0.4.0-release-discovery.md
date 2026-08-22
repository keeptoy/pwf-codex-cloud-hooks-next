<a name="phase-9-v0-4-0-positioning"></a>

# Phase 9 / v0.4.0：Release 收口 Discovery

## 定位

这是 standing Phase 9 在 `v0.4.0` 版本列车上的独立实例，不是 Product Phase `4.12`，也不是未来每个版本共用的一次性
`Phase 9 PASS`。Phase 4.11 已经关闭功能施工并形成 `0.4.0` 功能/候选基线；本轮只回答怎样把该基线安全地变成
immutable public Release、怎样轮转 accepted/fallback，以及第二轮对象退役应在什么证据之后发生。

未来 `v0.5.0`、`v0.6.0` 若进入发布收口，应各自建立 `phase-9-vX.Y.Z-...` 实例，不追加为本文件的“下一轮 Phase 9”。
通用 Release 顺序仍以 ROADMAP 和 Cloud hard acceptance template 为准；本文只记录 `v0.4.0` 的差异、风险和 gate 决策。

<a name="phase-9-v0-4-0-starting-facts"></a>

## Starting facts

- 起点是 clean `0.4.0-dev` 功能基线；当前角色仍为 candidate `v0.4.0-dev`、accepted `v0.3.5`、immediate fallback
  `v0.3.4`。Phase 4/F3 的 PASS 不等于稳定字节或公开资产 PASS。
- 当前 development ZIP 是 F2/F3 的历史 evidence。README 和稳定身份变化都会生成新 ZIP，因此旧 candidate SHA 不得写进
  stable bootstrap，也不得替代新的 Source/Candidate 验收。
- Release v2 有 22 个 entries，bootstrap 在 ZIP 外。宏观文档中只有 README 进入 ZIP；ARCHITECTURE、DESIGN、CHANGELOG、
  ROADMAP、history、acceptance 和 tests 都在 Release 外。
- `installed-state-transition-v1.json` 固定的 `0.3.5` 是 v0.4.0 installer 的 exact predecessor，不是会随 Latest 指针旋转的
  role 字段。

<a name="phase-9-v0-4-0-pre-seal-inventory"></a>

## Pre-seal inventory

P9-A 必须先关闭四类债务，才能冻结 stable candidate：

1. 把 README 最后一处“F3 尚待验收”的状态耦合改成永久成立的 authority 说明：activation 文件和 probe 只能证明
   admission，Cloud lifecycle 与 Release 结论只由 ROADMAP 和版本 acceptance 承担。
2. 把 ARCHITECTURE、DESIGN、ROADMAP、CHANGELOG 中仍把已完成 F3B/F3C 写成 future 的当前叙述收敛为稳定不变量或正确
   programme 状态；只有 README 会改变 ZIP，但所有当前 authority 都必须在 seal 前一致。
3. 原子传播 stable identity：package `0.4.0` → Release contract 的 package/external asset → manifest 中新的 raw contract SHA →
   stable acceptance 与 bootstrap 文件名 → bootstrap 内 `v0.4.0`。Runtime bundle 和 installed inventory 没有行为变化时不轮转。
4. 让 publication oracle 从每个 archived source 自己的 manifest/Release contract 路由。未来窗口是 v2 accepted + v1 fallback；
   rollback 必须验证 current-owned uninstall → fallback clean install → exact current forward recovery，同时保留 direct downgrade
   fail-closed/no-mutation，而不是继续假设两个 installer 可以直接互相覆盖。

开发 acceptance 必须迁移为 stable acceptance，不能同时保留 dev/stable 两份；已经实际执行的 F3 operator guides则保持
`v0.4.0-dev-*` 原名，因为它们是 exact dev evidence，不是当前状态文件。

<a name="phase-9-v0-4-0-gates"></a>

## v0.4.0 gate 路线

| Gate | 做什么 | 通过后仍不能声称什么 |
|---|---|---|
| P9-A pre-seal materialization | 完成上述输入/测试/文档迁移；bootstrap 暂留 zero hash；构建并冻结 stable-version ZIP | 不是 seal、Cloud PASS 或公开 Release |
| P9-B seal and final-source acceptance | 将 frozen ZIP SHA 写入 ZIP 外 bootstrap，计算 bootstrap SHA；跑完整/ref-aware 本地矩阵和 exact sealed-source Source/Candidate Cloud | 不是公开 URL/asset PASS；失败或 ZIP input 变化必须重开 P9-A |
| P9-C immutable publication | 维护者创建 exact stable tag 与 Pre-release，上传两项 sealed assets，并做 publication audit | 公开资产存在不等于用户下载路径已验收 |
| P9-D Published Release Cloud | 独立 Fresh Cloud 从 public bootstrap 默认链安装，再做 real Resume、doctor 与 manifest-routed deep check | 不自动改变 Latest 或 accepted role |
| P9-E Latest promotion | 维护者只改 Release metadata；只读 postflight核对 Latest和两项 immutable资产，ROADMAP轮转为 accepted v0.4.0 / fallback v0.3.5 | 不自动授权任意文件/ref清理 |
| P9-F second retirement and handoff | 按角色窗口逐项 RETIRE/MIGRATE/KEEP，保存 fallback恢复链；关闭本列车后才讨论 `0.5.0-dev` | 不自动进入 Phase 5 implementation |

RC 只在 P9-A/P9-B 暴露风险或维护者明确选择时使用；RC/canary 永远不能替代 final stable bytes 的验收。每个 gate 都有独立
停止点，前一项 PASS 不自动授权下一项或任何远端写入。

<a name="phase-9-v0-4-0-evidence-routing"></a>

## Evidence routing

- 活动 task plan：当前唯一 Next Step、授权、禁止事项和失败恢复点。
- version acceptance：Source/Candidate、sealed-source、Published Release、Fresh/Resume/doctor 与 Latest postflight 的逐 gate 证据。
- provenance：只在 tag/source/ZIP/bootstrap 都真实存在后登记不可变身份，不预填 `v0.4.0`。
- ROADMAP：只在 promotion/postflight 通过后轮转 current/accepted/fallback，不用 acceptance 或 provenance 复制当前角色。
- F3 guides/history：保留已执行 lifecycle/rollback 的 exact evidence；不能给改变后的 stable ZIP 字节背书。

<a name="phase-9-v0-4-0-lifecycle-ledger"></a>

## 第二轮对象生命周期预决策

| 对象 | 决策 | 退出条件 |
|---|---|---|
| README 状态耦合与过时 current prose | `REPLACE / RECONCILE` | P9-A，seal 前完成 |
| dev package/bootstrap/acceptance identity | `MIGRATE` | P9-A 原子改为 stable；不留同角色重复文件 |
| v2/v1 publication oracle | `REPLACE` | P9-A 按 archived manifest 路由并采用已验证 rollback 顺序 |
| v0.3.5 working-tree bootstrap/acceptance | `KEEP → RETIRE` | 保留到 P9-D；P9-E 后可退出 candidate+accepted 工作窗口，immutable tag/Release/provenance继续承担 fallback |
| v0.3.5 public tag/source/assets | `KEEP IMMUTABLE` | 它们成为 immediate fallback，不得改写或删除重发 |
| 11 个 F3 validation refs | `KEEP` | 其中九个仍保留主线/tag均不可达的 side-branch commits；先有同强度 durable archive并另获 ref-mutation授权才可再审 |
| F3 dev-named guides | `KEEP AS EXECUTED EVIDENCE` | exact路径、refs和脚本已被 Cloud/测试采用，不为 stable外观改名 |
| rollback validator、revival negatives、installed transition | `KEEP` | 仍保护 v0.4.0 rollback/forward-migration合同 |
| `0.5.0-dev` identity | `DEFER` | P9-F 完成并另获 Phase 5 授权 |

这里的“第二轮退役”仍是做决定，不是强制删除。尤其不能因为文档已经记下 commit hash 就删除唯一保持对象可达的 ref。

<a name="phase-9-v0-4-0-stop-rules"></a>

## Stop rules

- pre-seal 若需要改变 Host ABI、trusted graph、runtime行为或 rollback contract，返回独立 Discovery，不包装成 Release 清理。
- stable身份任一 leaf/contract/manifest/hash 不闭合，或 deterministic ZIP发生漂移，停止并重开 P9-A。
- Source/Candidate、publication audit、Published Release、promotion/postflight 任一未取得明确最终 exit code与 exact identity，不得晋级。
- public asset不得用分支内文件、本地 ZIP、旧 F3 candidate SHA或模型口述代替。
- validation refs没有 durable replacement和维护者单独授权时保持不动。

<a name="phase-9-v0-4-0-decision"></a>

## Decision

当前代码与 contracts 足以进入 P9-A；没有发现必须先重开 Phase 4 或修改 production安全模型的阻塞项。开始施工前仍需维护者
单独授权，后续 seal、Cloud、tag/Release、promotion和 ref mutation也分别需要独立 gate。

结论为：

`CONDITIONAL_GO_TO_V0_4_0_PHASE_9_PRE_SEAL_MATERIALIZATION / IMPLEMENTATION_NOT_AUTHORIZED / RELEASE_AND_REF_MUTATION_NOT_AUTHORIZED`

<a name="phase-9-v0-4-0-verification"></a>

## Discovery verification

- focused Phase 4/F3/rollback/repository guards与完整 Windows suite均通过；Linux/POSIX-only cases保持 honest skip，本轮没有
  把 Windows结果冒充为 Linux或 Cloud evidence；
- importer、owned Python compile、installer Node syntax、全部 bootstrap Bash syntax与 whitespace检查通过；
- 两次 current development candidate独立 build/check字节一致，证明 Discovery没有改变旧 candidate；该事实不把旧 SHA提升为
  stable identity；
- changed-path与 Release v2 entries/external assets交集为零；11个 local/origin validation ref pairs身份一致。

<a name="phase-9-v0-4-0-successor"></a>

## Successor

Discovery 当时的下一步是维护者决定是否授权 P9-A。后续状态见下面的实施尾注；只有 P9-A/P9-B/P9-C/P9-D/P9-E/P9-F
依次闭合后，才形成 `v0.4.0` accepted baseline，随后才能另开 `0.5.0-dev` 与 Phase 5 Discovery。本文只追加本实例的
实施/验收尾注，不接管未来版本的 Phase 9。

<a name="phase-9-v0-4-0-p9-a-post-implementation"></a>

## Post-implementation status — P9-A pre-seal materialization

P9-A 按 Discovery 路线实施，并出现一项同类范围内的补充发现：`BASELINE_PROVENANCE.md` 的 current upstream/verification
chain 仍把 v1 bundle/release 与 deferred candidates 写成现行 authority。该残留与 README/ARCHITECTURE/DESIGN 的 current
prose 一并校准为 manifest-routed v2；immutable v0.3.2 overlay 冷证据没有改写。

实施闭合内容：

- package 与 Release v2 identity 从 `0.4.0-dev` 原子收敛为 `0.4.0`，bootstrap 与版本 acceptance 采用 rename-not-duplicate；
- bootstrap 默认版本已稳定化，但 ZIP SHA 保持 64 位 zero hash，继续 fail closed；exact hash 只属于 P9-B；
- README 删除最后一处 F3 状态耦合，改为“本地 state/probe 只证明 admission；Cloud/Release 结论由 ROADMAP 与版本 acceptance
  承担”的永久边界；
- ARCHITECTURE/DESIGN/provenance 只校准已经发生的 F3C 与 v2 authority，不修改 runtime、Host ABI、trusted graph、
  installed inventory 或 rollback contract；
- publication oracle 改为从每个 archived source 自己的 manifest 发现 v1/v2 Release contract，并把两席恢复顺序固定为
  fallback clean install → accepted forward → accepted-owned uninstall → fallback clean install → accepted forward recovery；
  direct downgrade refusal/no-mutation 仍由独立 negative 保留；
- F3 dev-named guides、11 个 validation refs、rollback validator、revival negatives 与 exact v0.3.5 installed transition 全部 KEEP。

对象生命周期核对：

| 对象 | P9-A 状态 | 下次复核 |
|---|---|---|
| stable package/Release/manifest/bootstrap/acceptance identity | `MIGRATED` | P9-B 只允许 bootstrap exact ZIP hash与 seal evidence |
| README/ARCHITECTURE/DESIGN/provenance current prose | `RECONCILED` | 后继 programme事实变化时按各自 authority 更新 |
| dev bootstrap/acceptance同角色路径 | `RETIRED BY RENAME` | 不恢复 dev/stable 双份 |
| F3 dev evidence、validation refs与 negative tests | `KEEP` | P9-F 仍默认保留；无 durable replacement不得退役 |
| v0.3.5 working-tree role files | `KEEP` | 保留到 P9-D，P9-E role rotation后再审 |

P9-A 本地验证完成：完整 Windows suite 为 173 tests、148 pass、0 fail、25 个 honest Linux/POSIX skips；importer、owned
Python compile、installer Node syntax、两份 bootstrap Bash syntax与 whitespace检查通过。两次独立 build/check均得到
22 entries、85,519 bytes、SHA-256 `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`，bootstrap仍为
64 位 zero hash。Release-input交集恰为 README、package、manifest、Release v2和 stable bootstrap五项，runtime/trusted-graph
delta为空。该 SHA只记录本地 pre-seal candidate，不是 sealed或公开资产身份。未执行 Cloud、tag、Release、promotion或
ref mutation。结论为：

`P9_A_PRE_SEAL_MATERIALIZATION_PASS / ZERO_HASH_CANDIDATE_FROZEN / STOP_BEFORE_P9_B / PUBLICATION_NOT_AUTHORIZED`

<a name="phase-9-v0-4-0-p9-b-local-seal"></a>

## Post-implementation status — P9-B local seal

维护者在 P9-A commit `cb5da4b61899cd05f237bc3adcd3e09c8cd24bee`后单独授权 P9-B。本地实施严格保持 Discovery的
原子边界：先从该 clean commit重建两份 candidate，确认 22 entries、85,519 bytes与 frozen SHA一致；随后只把该 SHA写入
ZIP外 `init-cloud-sandbox-v0.4.0.bash`，没有修改 README、package、manifest、Release contract、runtime或其他 ZIP input。

写入前后 candidate均保持 SHA-256
`24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`；sealed bootstrap SHA-256为
`4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f`。这证明 bootstrap作为 external asset的封印没有
污染 22-entry ZIP。P9-A的 zero-hash状态仍作为历史阶段事实保留，不被事后改写成“当时已经 sealed”。

对象生命周期没有发生新的迁移：stable bootstrap从 `PLACEHOLDER`转为 `SEALED_LOCAL_BYTES`；candidate ZIP从
`FROZEN_PRE_SEAL`转为`SEALED_LOCAL_BYTES`；v0.3.5 role files、F3 guides/refs/validators/negative tests与 installed transition
继续 KEEP。没有对象满足 P9-E/P9-F的角色退役条件。

“本地 seal完成”不等于“P9-B完整 PASS”。生成本尾注的本地 commit才是 sealed-source HEAD；维护者 push后还必须从该 exact
HEAD执行 Source/Candidate Cloud setup/deep check并回传最终 exit code、Linux零 skip、deterministic ZIP、install/doctor与
manifest-routed inventory证据。该证据返回前停止在 P9-C之前。结论为：

`P9_B_LOCAL_SEAL_PASS / SEALED_SOURCE_CLOUD_PENDING / STOP_BEFORE_P9_C / PUBLICATION_NOT_AUTHORIZED`

<a name="phase-9-v0-4-0-p9-b-sealed-source-cloud"></a>

## Post-acceptance status — P9-B sealed-source Cloud

维护者把最终 Release-excluded operator commit `fe8cd7f284ea2849f634aa68813dbb0f2cca83f9` push后，从该 exact checkout完成
`4.1 → 5.1 → 6 → 7 → 8.1 → 8.2 → 9.1`。setup与deep-check均取得明确最终 exit code 0，两端回传 HEAD都等于该
commit；Linux portable suite为164 tests、164 pass、0 fail、0 skipped。两次Cloud candidate构建逐字一致，继续得到
22 entries、85,519 bytes与sealed ZIP SHA-256
`24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`。

安装与post-Resume证据闭合到manifest schema 4、Release/bundle v2、installer `0.4.0`、12项installed runtime、4项pristine
upstream、authoritative bundle inventory、adapter-only policy、healthy doctor与零snapshot residue；工作树变化被限制为第6节
canonical planning fixture。维护者确认B～E Host链全部按模板完成，9.1输出`PWF_SC_POST_RESUME=PASS`。

本轮没有改变任何Release input、candidate/bootstrap字节、production行为、validation ref或远端Release状态。candidate ZIP与
stable bootstrap继续保持`SEALED_LOCAL_BYTES`；P9-B从`SEALED_SOURCE_CLOUD_PENDING`转为`PASS`。P9-C immutable tag /
Pre-release publication仍需维护者单独授权，不能由本尾注自动开始。结论为：

`P9_B_SEALED_SOURCE_CLOUD_PASS / STOP_BEFORE_P9_C / PUBLICATION_NOT_AUTHORIZED`

<a name="phase-9-v0-4-0-p9-c-pre-publication"></a>

## Pre-publication decision — P9-C immutable publication

维护者在 P9-B evidence writeback commit `01fecef569b00e389a3b80ccdceeabd445ff993c` push后授权进入 P9-C。实施前复核
确认：远端尚无 `v0.4.0` tag或 Release；两份资产仍为22-entry、85,519-byte、SHA-256
`24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`的 ZIP，以及21,565-byte、SHA-256
`4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f`的ZIP外bootstrap。

本轮最重要的决策是 tag source不采用“分支最新 HEAD”，而必须指向 P9-B实际通过 Cloud的
`fe8cd7f284ea2849f634aa68813dbb0f2cca83f9`。`01fecef…`及后续 operator commit只回写 Release-excluded成绩单/操作说明；
它们不改变 candidate/bootstrap字节，但也没有作为新的exact source参加 P9-B Cloud。因此二者的关系是“被验收的 source”与
“验收后的治理记录”，不能合并成同一个身份。

该选择与 v0.3.5先例一致：stable lightweight tag指向完成 seal与待发布记录的exact source，Published Release、Cloud和Latest
证据再写入后继治理提交。P9-C在当前版本acceptance内增加唯一operator入口，固定以下顺序：

1. 再次只读确认同名 tag/Release不存在；
2. 从 `fe8cd7f…`全新clone重建两份ZIP并复制同commit的bootstrap；
3. 由维护者创建指向该commit的lightweight `v0.4.0` tag并push；
4. 创建Pre-release并上传且仅上传两项sealed assets；
5. 在另一全新目录重新下载资产、核对ref/Release metadata/size/SHA，并从公开tag重建ZIP；
6. 回传`P9_C_PUBLICATION_AUDIT=PASS`后停止在P9-D前，再由仓库回写provenance与acceptance。

对象生命周期只发生“待物化”状态变化：tag为`FROZEN_TARGET / NOT_YET_CREATED`，两项资产仍为
`SEALED_LOCAL_BYTES / PUBLICATION_PENDING`，P9-B evidence writeback与P9-C operator为`KEEP_RELEASE_EXCLUDED`。v0.3.5
working-tree role文件、11个validation refs、F3 guides/validators/negative tests与installed transition继续KEEP；它们没有达到
P9-E/P9-F退出条件。

本地智能体只准备operator、静态守卫与维护者handoff，不创建tag/Release、不上传资产。P9-D Published Release Cloud、P9-E
Latest promotion/role rotation、P9-F retirement/ref cleanup均未授权。当前结论为：

`P9_C_OPERATOR_READY / TAG_SOURCE_FROZEN / MAINTAINER_PUBLICATION_PENDING / STOP_BEFORE_P9_D`

<a name="phase-9-v0-4-0-p9-c-post-publication"></a>

## Post-publication status — P9-C immutable publication

维护者按冻结operator创建并发布`v0.4.0`。后继独立只读审计确认：tag为直接指向
`fe8cd7f284ea2849f634aa68813dbb0f2cca83f9`的lightweight tag；Release为非draft Pre-release；资产inventory恰好是
22-entry、85,519-byte、SHA-256 `24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`的ZIP和
21,565-byte、SHA-256 `4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f`的ZIP外bootstrap。

公开资产被重新下载；全新clone checkout公开tag后，importer check healthy，tag source重建ZIP与下载ZIP逐字一致。审计取得
明确exit code 0与`P9_C_PUBLICATION_AUDIT=PASS`。因此对象生命周期更新为：tag=`IMMUTABLE_PUBLISHED`，两项资产=
`IMMUTABLE_PUBLIC_PRE_RELEASE_ASSETS`，P9-C operator/evidence=`KEEP_RELEASE_EXCLUDED`。v0.3.5仍是accepted/Latest，
v0.3.4仍是immediate fallback；11个validation refs、F3 guides/validators/negative tests和installed transition继续KEEP。

P9-C没有运行public bootstrap默认下载链的Fresh/Resume Cloud，也没有取消Pre-release、设置Latest、轮转角色或移动refs。
P9-D及后继gate仍需维护者单独授权。结论为：

`P9_C_IMMUTABLE_PUBLICATION_PASS / PUBLIC_ASSETS_REBUILT_AND_MATCHED / STOP_BEFORE_P9_D`

<a name="phase-9-v0-4-0-p9-d-pre-acceptance"></a>

## Pre-acceptance decision — P9-D Published Release Cloud

维护者在P9-C evidence writeback后授权进入P9-D。复核没有发现新的架构分歧：Phase 9 Discovery早已把P9-D冻结为独立
Published Release通道，通用模板也已有4.2 public bootstrap setup、5.2 Fresh startup和9.2 public ZIP deep check。因此本轮不
新建Discovery文件、不复制长脚本，只在版本acceptance中绑定v0.4.0的immutable public URL/SHA、Cloud顺序和停止条件。

实施时补了一项稳定链接治理：模板4.2、5.2、9.2原先没有显式英文anchor；现在只给这三个既有authority入口补anchor，脚本与
提示词内容不变。P9-D使用两层身份：public product bytes始终由v0.4.0 tag/Release URL/SHA决定；后继operator checkout只承载
模板与canonical fixture，不得替代资产身份。

维护者必须先push exact operator commit，再在独立Fresh Cloud的environment setup中执行4.2；已校验bootstrap不得接受
`HOOKS_URL`/`HOOKS_SHA256` override，而应使用自己的默认ZIP链。Host顺序固定为5.2 Fresh→6→7→8.1→同task real 8.2，最后
9.2重新下载ZIP并只使用ZIP内builder/importer/installer闭合doctor、inventory、policy与residue。

对象生命周期暂不迁移：v0.4.0仍是published prerelease candidate；v0.3.5仍是accepted/Latest，v0.3.4仍是immediate
fallback；11个validation refs、F3 guides/validators/negative tests、installed transition与v0.3.5 working-tree role files继续
KEEP。P9-D PASS只允许写回Published Release证据；P9-E promotion/role rotation与P9-F cleanup仍未授权。当前结论为：

`P9_D_OPERATOR_READY / MAINTAINER_FRESH_CLOUD_PENDING / STOP_BEFORE_P9_E`

<a name="phase-9-v0-4-0-p9-d-operator-materialization"></a>

## Post-implementation status — P9-D operator materialization

实施与Discovery没有架构偏差：版本acceptance只保存v0.4.0的公开tag/source、双资产URL/SHA、执行顺序与停止条件；4.2 setup、
5.2 Fresh提示词、6/7/8 lifecycle提示词和9.2 deep-check长脚本仍由通用模板单点承重。唯一新增治理是为4.2、5.2、9.2补稳定
英文anchor，脚本与提示词内容未改写。

静态守卫明确区分“Published Release operator已准备”和“Published Release Cloud已PASS”：前者允许版本文档出现immutable公开URL，
但仍禁止`R5-PR=PASS`、`CLOUD-HARD-ACCEPTANCE-PASS`或Latest结论提前出现。operator要求维护者push后动态打印control-plane HEAD，
避免把文档提交前的旧HEAD硬编码成执行身份；public product bytes继续只由v0.4.0 tag和公开资产SHA决定。

对象生命周期没有提前迁移：tag、Pre-release资产、ZIP/bootstrap、production/runtime、contract、manifest与README均未变化；
11个validation refs、F3 guides/validators/negative tests、v0.3.5 accepted与v0.3.4 immediate fallback继续`KEEP`。本轮8个changed
paths与Release entries/external assets交集为0，双构建仍为22 entries、85,519 bytes、SHA
`24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3`。

本地完整回归为175 tests、150 pass、0 fail、25个Windows上诚实的Linux/POSIX-only skip；focused守卫12/12通过，importer、owned
Python compile、installer Node syntax、两个bootstrap Bash syntax、operator PowerShell parse和`git diff --check`均通过。当前结论为：

`P9_D_OPERATOR_MATERIALIZED / LOCAL_GUARDS_PASS / MAINTAINER_FRESH_CLOUD_PENDING / STOP_BEFORE_P9_E`

<a name="phase-9-v0-4-0-p9-d-post-acceptance"></a>

## Post-acceptance status — P9-D Published Release Cloud

维护者完成独立Fresh Cloud的公开默认下载链。setup从immutable bootstrap运行到`Test complete`并输出exact bootstrap SHA与
`PWF_PUBLIC_RELEASE_SETUP=PASS`；5.2 Fresh、canonical baseline/context、E1 long tail与同task real E2 Resume全部通过。
E2观察到真实`SessionStart source=resume`、catch-up顺序、long-tail截断/tail marker和两个markerless legacy sentinel。

9.2重新下载85,519-byte、22-entry公开ZIP，SHA仍为`24a412…3bb3`，只使用ZIP内builder/importer/installer；最终exit code 0。
doctor healthy/managed，manifest schema 4、Release/bundle v2、12项installed inventory、4项pristine upstream、adapter-only policy与
零snapshot residue全部闭合。post-Resume checkout仍是operator HEAD `9d4a914b8b241fa92345702bff74846024eba5b6`，工作树只有
`.planning/.active_plan`与canonical fixture目录。

实施和规划没有偏差。Cloud模型关于`__PWF_P9D_OPERATOR_HEAD__`仍是占位符的提示不构成失败：该值本来就在执行setup时替换，
不是要提交进文档；实际HEAD只读结果已经提供更直接的identity证据。公开tag/source和两项资产在独立只读postflight中仍与P9-C一致。

生命周期只推进到P9-D：v0.4.0仍为published prerelease candidate，v0.3.5仍为accepted/Latest，v0.3.4仍为immediate fallback。
v0.3.5 working-tree role files已到达P9-E review条件，但在P9-E授权和role rotation完成前继续`KEEP`；11个validation refs与F3
guides/validators/negative tests也继续保留。当前结论为：

`P9_D_PUBLISHED_RELEASE_CLOUD_PASS / PUBLIC_DEFAULT_DOWNLOAD_CHAIN_CONFIRMED / STOP_BEFORE_P9_E`
