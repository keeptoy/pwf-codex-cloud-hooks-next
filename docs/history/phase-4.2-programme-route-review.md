<a name="phase-4-2-historical-position"></a>

# Phase 4.2：Phase 4～9 路线复核与校准

## Historical position

`Phase 4.2` 是 Phase 4 第一轮 Discovery 已冻结、但 F1 implementation 尚未授权时形成的**路线复核讨论
里程碑**。它回答两个问题：Phase 4.1 是否真正继承了 Phase 3.9.3 的 machine-field 生命周期原则；现有
ROADMAP 的 Phase 4～9 风险顺序是否仍适合当前架构与探路结果。

本记录不代表新的 Product Phase、programme 状态或实施授权。文中 F1A/F1B、F2A/F2B 等名称是后续细化
gate 时的建议；在维护者另行决定并修改当前 authority 前，ROADMAP 与活动 task plan 仍是唯一有效状态，
`CONDITIONAL_GO_TO_F1` 也没有因此自动变成 implementation go。

<a name="phase-4-2-questions-reviewed"></a>

## Questions reviewed

Phase 3.9.3 指出，历史字段真正的治理缺口通常不是“当初为什么加入”，而是加入时没有同时定义 owner、
consumer、transition window、review trigger 和 retirement condition。Phase 4.1 又提出 bundle/Release v2、
versioned managed opt-in、attestation、nonce 与 smart/autonomous profile，因此需要确认：

- `origin`、overlay tombstone 和无 consumer metadata 是否已经到了生命周期复核点；
- Phase 4 foundation 与行为激活是否拆得足够清楚，又是否会破坏 contract/hash 的原子边界；
- Phase 5～8 是否仍按风险递增，还是因当前 Hook ABI 和 adapter-only 架构而需要重排；
- Phase 9 是一次性完成状态，还是每条开发列车都要重新进入的 Release 收口 gate。

<a name="phase-4-2-lifecycle-inheritance"></a>

## Phase 3.9.3 inheritance

结论是：Phase 4.1 已经把 Phase 3.9.3 从治理原则变成了可执行的 contract 取舍，而不是只在文字上引用。

| 待治理对象 | Phase 4.1 的生命周期结论 | 以后重新引入的条件 |
|---|---|---|
| entry `origin=upstream_pristine` | v1 为已发布历史；v2 由 exact `upstream_files` / `local_files` 结构表达来源并删除重复标签 | 新结构确实无法表达来源，且存在真实 consumer、schema 与 review gate |
| `managed_sha256 == pristine_sha256`、空 `overlay_ids` | overlay 迁移 tombstone 的退出条件已经满足；v2 删除，exact schema 继续拒绝旧 key | 新迁移必须另立字段与明确 sunset，不能复活旧模型 |
| `language`、`host_dependencies` | 没有 operational consumer，不继续占用 machine contract；迁出或删除 | 先出现执行期 consumer，再定义 owner、failure semantics 与生命周期 |
| 四个 adapter/child ABI schema | 由 `installed_contracts` 统一表达安装与校验责任 | placement 改动必须重新经过 supply-chain/Release gate |
| profile、protocol、result 与 token 字段 | 保留，因为 owned runtime/adapter 有明确 producer 与 consumer | schema 变更仍需 exact validation、兼容窗口和退出条件 |

因此，“来源优先由结构表达；结构表达不够时再贴来源标签”的判断已经可以用于候选 v2。它不会改写
published v1，也不会删除 v1 对应的历史验证。旧字段防复活由 v2 exact-key admission 与 denied-source guard
承担，不需要永久保存每一枚 tombstone 才能 fail closed。

<a name="phase-4-2-programme-assessment"></a>

## Programme assessment

Phase 4～9 的主骨架仍然合理，不需要推翻：

```text
Phase 4  安全读取 + 明确 opt-in
Phase 5  compaction lifecycle
Phase 6  selective tool/permission hooks（可跳过）
Phase 7  advisory completion
Phase 8  optional hard gating
Phase 9  当前获批列车的 Release 收口
```

这条顺序让风险从 default-off/read-only，逐步增加到新事件、advisory decision、mutable blocking state，最后
才进入 Release。特别是 Phase 7 必须在 Phase 8 前：先证明 completion evaluator 能稳定、安静、bounded 地给出
建议，再允许同一判断参与阻断。

需要调整的是 gate 粒度、前置协议和状态措辞，不是产品架构方向。

<a name="phase-4-2-phase-4-gate-calibration"></a>

## Phase 4 gate calibration

后续若修改活动计划，建议把 Phase 4 细分为以下检查点：

### F1A — contract and source foundation

- manifest schema 4、runtime-bundle v2 与 release-artifact v2 作为一笔原子 contract transaction；
- adapter 纳入 bundle `local_files`，四个内部 ABI schema 统一进入 `installed_contracts`；
- exact-key validation、entry mode 单一 authority、字段 retirement 与 v0.3.5 legacy compatibility；
- 不扩大 trusted profile，不让新 marker 可达。

### F1B — inactive runtime foundation

- plan request/result v2、owned state capture/normalization 与明确 refusal taxonomy；
- `allowed_profiles=[legacy]`，smart/autonomous/gated 仍不可达；
- 证明现有 Host 输出、canary、install/doctor、takeover/rollback 保持兼容。

F1A/F1B 是评审、测试和停止点，不要求产生两个可独立发布的半成品。bundle 内容、manifest hash、Release
entries 与 runtime/schema 实现彼此绑定时，应在一个完整 candidate transaction 中闭合；不能为了形式上的拆分
提交不可构建、hash 不一致或 partial takeover 的中间树。

### F2A — explicit smart activation

- 只承认 versioned managed opt-in；旧 upstream token 单独存在仍是 legacy；
- 先激活较低风险的 smart plan selection；
- 不准入 attestation、nonce、ledger 或 Stop/gated 语义。

### F2B — explicit autonomous activation

- 再准入 attestation、exact nonce、normalized ledger 与 no-downgrade refusal；
- 缺状态、篡改、race、helper failure 或超预算时不回退 raw progress；
- 继续保持 Hook/runtime 不写 workspace，不吸收 upstream writer。

### F3 — Cloud and rollback acceptance

- Fresh、UserPrompt、real Resume、cache reuse、pre-existing marker、opt-out/re-arm 与双向 rollback；
- live Cloud 和 Release 仍分别授权，F3 也不自动等于正式发布。

<a name="phase-4-2-activation-protocol"></a>

## Activation and disarm protocol

F2 前必须冻结“谁写什么、何时算激活成功”的用户协议。managed runtime 只读 workspace，因此不能由 Hook
偷偷修复或补齐 opt-in。推荐把 managed token 当作最后的 activation commit point：

1. 对 smart，用户侧工具先准备获准状态，再显式写入 versioned managed token；移除 token 即 disarm。
2. 对 autonomous，pristine Skill/用户侧流程先初始化 nonce、attestation 与所需状态。
3. 只有 attestation 成功后才最后写 managed token；不能沿用上游 initializer 吞掉 attestation failure 后留下
   看似可用状态的做法。
4. token 已存在但状态缺失或非法时，managed runtime 必须明确拒绝；不得把它当作未 opt-in 并降级到 legacy。

managed token 只是显式同意某版协议，不是 secret、身份凭据或 plan-write 攻击者的防线。

<a name="phase-4-2-phase-5-to-8-calibration"></a>

## Phase 5～8 calibration

### Phase 5 — 先证明现有 lifecycle 是否已经足够

当前 Host/fixture 已有 `SessionStart source=clear|compact`，公开 ABI 也出现 compaction events。因此后续 Discovery
不应再笼统写成“等待观测 clear/compact schema”，而应：重新验证真实 Cloud payload；比较现有 SessionStart
语义与 Pre/PostCompact 的时序；先证明现有事件能否恢复上下文。只有出现真实 timing/context-loss gap，才增加
新 Hook。ABI 存在本身不是扩大 trusted graph 的理由。

### Phase 6 — 明确允许 NO_GO

当前 managed integration 没有 per-tool 重复 plan injection，不能为了路线编号机械接入高频事件。PreToolUse、
PostToolUse、PermissionRequest 应各自有具体 use case、latency/token budget、噪声测量与 Cloud 证据，例如危险工具
前的 bounded advisory 或权限请求的最小上下文。没有足够收益时，Phase 6 可以整体或逐事件 `NO_GO`，且不应
成为 Phase 7 的硬前置。

### Phase 7 / Phase 8 — 共用一套 completion evaluator

Phase 7 只建立 read-only、bounded、non-recursive evaluator，输出 advisory，不阻断、不写 counter/ledger。Phase 8
复用同一 evaluator，再单独增加 Stop decision、重试上限、逃生路径和 stall state，不能开发第二套完成判断算法。

由于 Phase 8 首次引入会影响用户循环的 mutable blocking state，开始实现前必须重新 Discovery：谁写 ledger/counter、
原子性与锁、Cloud cache/Resume 如何继承、rollback 后如何识别和清理残留。上游 best-effort advisory lock 不能因
脚本现成就直接成为 managed authority。

<a name="phase-4-2-phase-9-standing-gate"></a>

## Phase 9 as a standing Release gate

Phase 9 不应被理解为“v0.3.5 做过一次，所以永久 complete”。准确语义是：

- `v0.3.5` 这一次 Release 收口已经 complete；
- Phase 9 是每条获批开发列车都必须重新进入的 standing Release gate；
- 当前 `0.4.0-dev` 尚未进入其 RC/stable seal，Phase 4 的 conditional go 也不能继承旧版本的 Release PASS。

Phase 9 仍不机械等于 `0.9.0`。它只封板当时已经分别通过 feature、Cloud、rollback 与 Release 授权的实际版本列车。

<a name="phase-4-2-acceptance-conclusion"></a>

## Acceptance conclusion

本轮结论是：Phase 4.1 已结合 Phase 3.9.3，并已触发 `origin` 等待审字段的退出判断；Phase 4～9 的总体风险
顺序正确，适合继续使用。建议只做六项 programme 校准：

1. Phase 4 拆为 F1A/F1B/F2A/F2B/F3，但保持 candidate contract/hash 原子闭合；
2. F2 前冻结显式 activation/disarm 协议；
3. Phase 5 先验证现有 compact/clear lifecycle 是否足够；
4. Phase 6 标为独立、可跳过、允许 NO_GO；
5. Phase 7/8 复用 evaluator，Phase 8 重新审计 mutable state；
6. Phase 9 改为 standing Release gate，并区分 v0.3.5 已完成实例与当前列车状态。

这些是后续更新 ROADMAP/F1 plan 的候选输入，不是本记录自行生效的 programme 变更。当前最小 Next Step 仍由
活动 task plan 决定。

<a name="phase-4-2-explicit-non-goals"></a>

## Explicit non-goals

- 不实施 manifest/bundle/Release v2，不修改 production、tests 或 package identity。
- 不授权 F1、F2、Cloud、Release，也不创建 `0.4.0-*` machine identity。
- 不提前激活 smart/autonomous/gated，不准入上游 writer 或新 Host event。
- 不为了生命周期整洁删除未来可能有 Phase 4 consumer 的字段；只按已确认 consumer 与结构表达做决定。
- 不在这份历史讨论记录中直接改写 ROADMAP 当前状态。

<a name="phase-4-2-successor-inheritance"></a>

## Successor inheritance

后续维护者若授权 F1，应先把上述子 gate、原子 transaction 和 legacy-equivalence 退出条件落实到活动 task plan；
若决定调整 programme，再由 ROADMAP 统一表达 Phase 5、Phase 6 和 Phase 9 的新措辞。任何 machine field 新增都应
同时登记 producer、consumer、owner、failure behavior、review trigger 与 retirement condition，避免再次形成“只知道
为什么引入，却没人负责何时删除”的残留。

如果未来证据证明结构分区不能完整表达来源，可以通过新 schema 重新增加来源标签；这属于基于真实 consumer 的
设计演进，不应成为永久保留重复常量的理由。

<a name="phase-4-2-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/f9e35a21b1a30ff445677b86393cc5c8999d228e)

该链接只证明本轮路线复核开始时的仓库状态，不解释当前实现；当前 contract、programme、授权与行为以当前仓库
authority 为准。
