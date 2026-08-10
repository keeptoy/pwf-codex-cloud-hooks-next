<a name="phase-3-7-historical-position"></a>

# Phase 3.7：Runtime Contract 元数据清理

## Historical position

`Phase 3.7` 是后来为了说清这次清理而补的回顾标签，不是原 programme 的正式 Product Phase，也不是 tag 或
Release identity。它记录了一件范围很小但应该讲明白的事：两个早期阶段标签为什么会进入 runtime contract、
为什么一直只有测试在看、为什么现在可以删除，以及删除后由什么继续守住准入边界。

<a name="phase-3-7-plain-summary"></a>

## 先说结论

说白了，`activation_phase` 和 `deferred_upstream_candidates` 不是 runtime 开关，而是一张早期施工进度表：
它写着“这个文件计划第几阶段启用”“这些脚本先放在候选区，以后再决定”。这张进度表被塞进了 runtime 的
装箱清单，但真正运行时从来不看它。后来施工已经往前走了，装箱内容也不断更新，唯独这张旧进度表没人退休。

<a name="phase-3-7-problem-before"></a>

## Problem before

两个字段都由 `0.3.0-alpha.1` 的 `033a82b` 同时引入。当时处在 Phase 1：这一阶段只负责把来源、hash、路径、
依赖和打包边界先冻结成合同，不负责把后续能力全部打开。为了让 Phase 2/3 后面有可复现的输入，相关文件可以
提前进入受管 bundle；Phase 4+ 脚本则只能登记为候选，不能混进当前 `bundle.files`。

所以两字段当时各有一个很具体的用途：

- `activation_phase` 是文件旁边的计划标签，表示当时打算在哪个 Phase 让它进入可达路径；
- `deferred_upstream_candidates` 是候选清单，列出尚未准入的 Phase 4/7/8 脚本及最早可能考虑它们的阶段。

<a name="phase-3-7-why-tests-read-fields"></a>

## 为什么会变成“只有测试在读”

Phase 1 需要证明“提前准备”没有变成“提前启用”，所以同一批合同测试被用来冻结这张阶段计划：先确认 deferred
脚本没有出现在已准入的 `bundle.files`，再确认它们的 `earliest_phase` 不早于 Phase 4。后来 owned runtimes
陆续加入，测试又把 `owned_catchup` 固定为 Phase 2、把 `owned_plan` 固定为 Phase 3。

这里有一个时间线细节：`033a82b` 首先建立 deferred 排除与 `earliest_phase >= 4` 的断言；
`owned_catchup=2` 和 `owned_plan=3` 是这两个 owned runtime 后续进入 bundle 时分别补上的。它们共同表达的
仍是同一件事——测试在核对当年的分阶段准入计划，不是在验证当前 runtime 怎样执行。

production 的判断链完全不同：

- importer 关心 bundle schema、固定上游、package root、文件路径、hash、mode 与 inventory；它没有根据这两个
  Phase 字段决定导入、安装或激活什么；
- installer 直接使用 `upstream-manifest.json` 组装 installed inventory，该 manifest 本来就没有这两个字段；
- 真正决定“会不会运行”的，是文件是否经过 inventory/installer 准入、Managed policy 是否只注册绝对路径
  adapter，以及 adapter 在当前 event 下是否 dispatch 对应的已安装 sibling runtime。

换句话说，即使把 `activation_phase` 从 2 改成 200，production 行为也不会改变；只有旧测试会因为“进度表被改了”
而失败。

<a name="phase-3-7-why-fields-lingered"></a>

## 为什么一直没有自动退休

Phase 2/3 完成后，维护工作集中在真正影响执行的 hash、origin、dependency 和 inventory 上，没有安排一次
“阶段元数据退休”。successor 根提交 `3234e4e` 又把 Phase 1 bundle 和配套测试原样继承下来，于是字段与断言
互相证明对方“还需要”：contract 里有字段，测试就继续检查；测试还在检查，字段看上去就不敢删除。

根因不是 runtime 依赖它们，而是把 programme 路线塞进 machine runtime contract 后形成了历史耦合。它们不会
因为某个 Phase 完成就自动消失；除非专门做一次治理清理，contract 和维护它的测试都会一直留下。

<a name="phase-3-7-core-decisions"></a>

## Core decisions

- 删除的是旧进度标签，不是准入闸门：programme/lifecycle 回到 ROADMAP 等专用 authority，runtime contract
  只保留当前确实影响 source/build/install/runtime 的事实。
- `deferred_upstream_candidates` 原来表达的“未批准脚本不能混进来”仍然有价值，但不再靠 Phase 数字表达。
  contract test 改为直接冻结当前四个 upstream 文件的 exact id/source inventory，并检查 programme 字段不会
  重新进入 local/upstream entries；Release allowlist 继续守住 package 边界。
- 以后若要准入新文件，必须显式修改 bundle inventory、相关 integrity reference、测试和对应 Product Phase/
  Release gate，不能因为 pinned upstream 里恰好存在某个脚本就自动进入 production。
- runtime 文件集合、dependency graph、hash、mode、Host ABI、production dispatch 与 installed layout 均不变。
- 因 runtime bundle 是 sealed package 的输入，清理只能进入新的兼容 development identity，不能改写既有发布字节。

<a name="phase-3-7-completed-delivery"></a>

## Completed delivery

- 两个 local entries 和四个 upstream entries 不再携带 `activation_phase`，bundle 顶层不再携带
  `deferred_upstream_candidates`。
- manifest 中的 bundle integrity reference 与新 bundle 字节同步更新；runtime sources 本身没有变化。
- contract guards 同时验证 programme 字段缺席和当前 exact admitted inventory，因此未准入的 Phase 4+ 文件仍不能
  仅凭存在于 pinned upstream 就进入 package/install/runtime 路径。
- 开发版本、Release contract 与 bootstrap 身份同步轮换，但 bootstrap 保持 zero-hash fail closed，不构成发布。

<a name="phase-3-7-acceptance-conclusion"></a>

## Acceptance conclusion

本 interlude 的验证证明：删掉的是不会参与运行的旧进度便签，不是安全门。source inventory、runtime bytes、
installer 行为、trusted graph 与 Hook behavior 都没有改变；真正的负向安全边界继续由 exact inventory、
integrity reference 和 Release allowlist 承担。

这些证据不证明 Cloud acceptance、seal、publication、Latest promotion 或 Phase 4 激活，也没有证明可以删除
`ledger-summary.sh` 或合并 manifest/bundle inventory。

<a name="phase-3-7-explicit-non-goals"></a>

## Explicit non-goals

- 不删除 `ledger-summary.sh`，不改变其在 pristine `inject-plan.sh` 中的条件依赖关系。
- 不迁移 manifest/bundle inventory authority，不改变 importer、installer 或 Release supply-chain。
- 不启用 attestation、nonce、opt-in v3 modes 或其他 Phase 4+ 能力。
- 不用元数据清理替代后续 Product Phase 的独立 Discovery、退出条件和 Release gate。

<a name="phase-3-7-successor-inheritance"></a>

## Successor inheritance

后继版本继承的是“runtime contract 只描述当前可执行/可安装事实”和“新增 runtime 必须显式修改 exact inventory”
两条边界，不继承早期 Phase 数字。未来演进到 Phase 9 时仍按当时证据执行独立 Release closure；该路线不依赖
已退休的 programme 元数据，因此本清理不会阻断 Phase 9。

<a name="phase-3-7-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/07bc83cd51a272d583b0b0b383f7609029168960)

该链接只证明本次 contract-cleanup closure 的历史来源，不解释未来实现，也不证明任何后继版本已经发布；当前
contract 与行为以当前仓库 authority 为准。
