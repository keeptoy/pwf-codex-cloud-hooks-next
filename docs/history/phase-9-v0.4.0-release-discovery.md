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

下一步是维护者决定是否授权 P9-A。只有 P9-A/P9-B/P9-C/P9-D/P9-E/P9-F 依次闭合后，才形成 `v0.4.0` accepted baseline；
随后才能另开 `0.5.0-dev` 与 Phase 5 Discovery。本文后续只追加本实例的实施/验收尾注，不接管未来版本的 Phase 9。
