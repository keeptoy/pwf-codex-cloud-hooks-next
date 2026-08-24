# Findings: v0.4.2 Release closeout / candidate-readiness

## Starting boundary

- 普通 Release 直接进入版本无关 closeout workflow；不创建 standing Phase 9，不复制 P9-A～F。
- 两个 retirement checkpoint 是同一 Release workflow 的入口/出口对象治理，不增加 Cloud 通道。
- 本轮只推进到 C0 前的本地候选准备和 Source/Candidate 教程；远端与 Cloud 动作仍由维护者负责。

## Authority recovery

- README/ARCHITECTURE确认当前稳定 product、trusted graph、installer path-safety与Release字节顺序不需因文档治理改变。
- DESIGN把Release operator guide、双通道模板、package/contract/bootstrap边界及相应验证路由列为本任务的直接落点。
- ROADMAP明确第9节是版本无关Release章节：普通Release不建standing Phase 9；Source/Candidate前只做非破坏性candidate admission preflight，两轮真实retirement review分别在Source/Candidate PASS后与Latest/postflight后闭合。
- 当前候选只应产生文档治理delta与Release身份/升级前驱事务，不应修改install、adapter或runtime行为。

## Candidate identity transaction

- 当前`package.json`与Release artifact仍是`0.4.1`，external asset仍是`init-cloud-sandbox-v0.4.1.bash`；v0.4.2候选需把三者同步到`0.4.2`。
- `installed-state-transition-v1`当前只接受exact v0.4.0 predecessor。v0.4.2必须改为exact v0.4.1 predecessor；installed manifest schema仍是3，12-file installed inventory与runtime hashes因v0.4.1只修改installer path safety而保持不变。
- release artifact与transition contract字节变化后，必须同步`upstream-manifest.json`中的两个SHA；runtime bundle/importer/source pin不变。
- v0.4.2 bootstrap是v0.4.1脚本的身份轮转副本：版本改为v0.4.2，Source/Candidate阶段SHA必须为64位zero hash；其余稳定安装逻辑不变。

## Candidate-readiness inventory

- 当前共有25个planning scopes：1个active、24个non-active。除`tests/repository-boundary.test.js`仍直接读取v0.4.1 Phase-9 planning外，non-active scope没有current外部入链。
- v0.4.1 Phase-9 planning的长期P9-F结论已经存在于v0.4.1 acceptance；测试依赖应先迁移到acceptance，再决定账本退役。
- v0.4.2 documentation-governance相关completed scopes仍解释本列车的施工与恢复位置，适合KEEP到C2 role-window closeout再复核；更早v0.4.0/v0.4.1与初始source-analysis scopes具备Git恢复且已由history/acceptance接管，是Source/Candidate PASS后第一轮review的RETIRE候选。
- 治理指南规定completed scope的实际删除必须由维护者在单独评审中明确决定；C1/C2分别保存第一、第二轮真实检查结论，但任何检查点都不能把`RETIRE`建议解释为自动删除授权。
- 维护者进一步澄清这不是v0.4.2特例：ROADMAP的两轮retirement checkpoint必须直接路由到治理指南，并长期冻结“检查点只列清单/建议，planning删除仍需维护者明确决定”。

## Local candidate evidence

- 完整Windows suite：180 tests / 154 pass / 0 fail / 26 skipped；26项均为既有Linux/POSIX-only case，不能替代Cloud零skip。
- exact v0.4.1 predecessor publication oracle全绿，包括forward migration、tampered-state写前拒绝、owned uninstall与accepted/fallback恢复。
- deterministic双构建：22 entries、85,912 bytes、SHA-256 `4a059fa512a2c144cef42478d217935825ee7aca0599dca5582c62dd12df415c`，两份字节身份一致。该hash只属于当前本地zero-hash candidate，不是sealed/public asset identity。
- importer check、Python compile、`node --check install.js`、两份bootstrap Bash syntax、manifest contract hash、bootstrap identity-only delta与`git diff --check`全部PASS。
- 相对v0.4.1，install.js、hooks、runtime、runtime bundle和tools仍为零delta；Release输入变化只限package identity、Release/transition contracts、manifest integrity references和新bootstrap。

## Release workflow authority convergence

- ROADMAP已有`release-four-step-flow`与`version-train-two-retirement-reviews`稳定anchors，但当前没有其他文档链接这两个入口；模板、治理指南、v0.4.2实例和Phase 4.14历史记录都重复了部分流程。
- 当前存在两处真实顺序漂移：ROADMAP宏观流把Pre-release放在C1前，而v0.4.2 guide与Operator Guide模板要求先写C1再等待publication；ROADMAP示例把第二retirement checkpoint放在C2后，但C2定义又要求保存该检查点。
- 先前收敛曾把第一检查点放在C0前；维护者随后进一步批准post-PASS顺序：candidate baseline →只读candidate admission preflight→C0→Source/Candidate PASS→第一真实检查点→C1写回/push→tag精确指向C0并publication→Published Release PASS→Latest/postflight→第二检查点→C2 final closeout。
- 其他文档只保留职责内细节：Cloud模板管执行协议，Operator Guide模板管状态容器，治理指南管对象/planning生命周期，版本guide管exact实例，Phase history管当时设计理由；current programme顺序一律链接ROADMAP。

## Post-PASS retirement ordering

- 维护者确认两轮真实retirement review都必须位于对应验收PASS之后：第一轮在Source/Candidate PASS后、C1前；第二轮在Published Release PASS和Latest/postflight后、C2前。
- 验收前仍保留`candidate admission preflight`，但它只做inventory、分类、恢复证据和风险检查；候选形成所需迁移必须在C0前闭合，preflight本身不删除planning、恢复材料或回滚线索。
- 设计理由是让失败现场保持完整：Source/Candidate失败时不因提前清退增加排错/回滚成本；C1/C2分别保存已真实发生的一、二轮退役结论，不写未来承诺。
- 第一轮PASS后的清退只适用于Release-excluded planning、临时教程和脚手架，且planning删除仍需维护者明确决定。若拟清退对象改变package、contract、runtime、bootstrap、ZIP allowlist或其他C0 Release输入，必须fail closed，形成新C0并重跑Source/Candidate。

## README manual Release handoff

- 维护者要求暂停Source/Candidate，先把可复制的本地ZIP build/check/hash与GitHub手工上传准备写入根README。
- 当前bootstrap的`HOOKS_PACKAGE`由`HOOKS_VERSION`派生为`pwf-codex-cloud-hooks-${HOOKS_VERSION}.zip`，`HOOKS_URL`再由repo、version和package派生；标准tag/asset命名不变时，seal默认值只需写入`HOOKS_VERSION`与exact `HOOKS_SHA256`。
- `pwf-codex-cloud-hooks-candidate.zip`适合作为本地中间文件；GitHub正式资产必须按bootstrap默认合同改名/构建为`pwf-codex-cloud-hooks-vX.Y.Z.zip`，否则必须显式改写`HOOKS_PACKAGE`或`HOOKS_URL`，不属于默认发布路线。
- 工作树恢复时存在用户未跟踪`test.zip`；本任务只读保留，不纳入暂存、Release资产或删除范围。
- Release allowlist交叉检查确认`README.md`本身是22-entry ZIP输入，因此本次说明不是Release-excluded治理改动。Source/Candidate尚未运行，允许现在改；但旧本地candidate ZIP/SHA与先前C0都必须作废，完成后重新双构建/check并形成新C0。
- README更新后的本地双构建一致：22 entries、87,152 bytes、SHA-256 `f90dd556477a166cbe0faade8cab1b36976729b847a84e7591e0dba3a0caf709`；先前85,912-byte/`4a059f…`身份已被本次Release-input变化取代，不得再用于Source/Candidate。
- 维护者指出当前README在首次提到C0与Source/Candidate时直接给出作废/重验警告，而术语定义和ROADMAP流程链接要到约60行后才出现；新人无法先理解“为什么”。本轮应把简短定义和authority链接提前，再保留原fail-closed结论。
- 最终README先用三条大白话定义C0、Source/Candidate与Release-excluded，再给出唯一ROADMAP流程入口和README-as-ZIP-input警告；后文仅承接“上文链接”，避免在同一authority文档重复同一跨文档fragment。
- 最终候选双构建/check逐字一致：22 entries、87,386 bytes、SHA-256 `d1547ab50afcc3a275592d41b60daa77ab1062c97c072be3661cfe763467264e`。该身份取代此前`f90dd5…`及改写期间所有临时候选，只供新的C0/Source-Candidate使用。

## README governance status synchronization

- ROADMAP 4.1是current train工作台，适合写“README进入候选、旧本地身份失效、Cloud仍PENDING”，但不应复制逐次命令或建立第二份exact证据表。
- Phase 4.14是回顾性治理摘要，适合追加独立post-governance status，解释为什么手工交接说明最终必须进入根README、为什么新人术语必须先于fail-closed警告，以及这次README-as-ZIP-input如何触发重新双构建。
- `ROADMAP.md`、`docs/history/*`、`.planning/*`和`tests/*`均在Release contract excluded prefixes内；本轮同步不会再次改变87,386-byte候选ZIP，但新的Git commit会成为待验收的更新C0 source HEAD。
- ROADMAP 4.1现已记录README手工交接、新人术语顺序、旧候选身份失效与Cloud仍PENDING；没有把exact SHA或逐命令提升成programme authority。
- Phase 4.14新增稳定`phase-4-14-post-governance-status-readme-release-handoff`锚点，保存README-as-ZIP-input的原因、本地`d1547a…`快照及“不是Cloud/sealed/public evidence”的边界。
