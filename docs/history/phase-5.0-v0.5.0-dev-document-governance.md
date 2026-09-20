<a name="phase-5-0-historical-position"></a>

# Phase 5.0：v0.5.0-dev 文档治理基线

> Record role: `RETROSPECTIVE_CAPSULE`

## Historical position

Phase 5.0是Product Phase 5激活后第一批已经闭合的`v0.5.0-dev`治理工作。它建立开发候选身份，完成README/Wiki、
ROADMAP、Product Phase overview、planning/history和测试职责的第一轮分层，并修正审计中发现的文档/实现偏差。

这是一份已完成批次的回顾，不表示Product Phase 5已经closeout，也不是C0、Cloud PASS、tag或Release。Phase 5的当前目标、
里程碑和继承边界继续只读
[`Product Phase 5 Overview`](../product-phases/phase-5-overview.md#product-phase-5-overview)。

<a name="phase-5-0-problem-before"></a>

## Problem before

进入本批次前，仓库仍沿用上一版本列车的开发身份；根README同时承载稳定产品入口和较重的本地开发、候选ZIP教程；
ROADMAP当前列车又复制了已经完成的工作。planning是否保留、何时提炼history的维护者职责尚未在Phase authority中明确，
Product Phase文件名也不能直观看出其overview角色。

代码级对账还发现两类实际漂移：architecture的installed runtime图遗漏两个已安装ABI contract，autonomous文档要求nonce与
attestation以LF结束，但runtime仍接受无结尾换行；Design和adapter注释也有较小的入口或profile描述偏差。

<a name="phase-5-0-core-decisions"></a>

## Core decisions

1. **先建立development identity，不提前宣称Release。** branch、package、Release相关contract与zero-hash bootstrap统一进入
   `v0.5.0-dev` pre-C0状态；accepted/fallback仍保持v0.4.4/v0.4.3。
2. **按问题拆分文档authority。** README只保留稳定产品行为、安装运维、安全不变量和文档地图；开发、验证与Release资产维护
   教程进入Release-excluded `Wiki.md`；ROADMAP当前列车只保留programme指针。
3. **overview是提纲，planning是流水，history由维护者决定。** `.active_plan`只选择活动scope，不要求删除其他已完成scope；
   completed planning的保留、提炼和删除都由维护者判断。
4. **文档/实现冲突回到代码级证据。** contracts、源码和测试共同决定真实行为；autonomous exact state按既有README合同收紧为
   单个LF，而不是通过放宽文档掩盖实现差异。
5. **机器测试保护稳定关系，不冻结阶段文案。** 保留anchor、authority metadata、链接和可执行边界断言，移除对Phase 5标题、
   句式、旧术语和“某文件暂不存在”等时态状态的依赖。

<a name="phase-5-0-completed-delivery"></a>

## Completed delivery

- 初始化`v0.5.0-dev` candidate并同步本地branch；development bootstrap继续使用64位zero hash且fail closed。
- 新建根级`Wiki.md`，承接README原有的本地开发、常用检查、候选ZIP和Release资产维护入口；README回到稳定产品入口角色。
- 显式激活Product Phase 5文档治理，建立只保存阶段目的、稳定边界和里程碑提纲的Phase overview；ROADMAP当前列车收敛为
  candidate、branch、授权、版本角色和authority链接。
- 明确`.planning/`继续承载详细过程，`.active_plan`只指向一个活动scope；维护者决定completed scope是否保留、提炼或删除，
  repository test不再把“目录中只能有一个scope”误当治理规则。
- 完成architecture/design/contracts/source/tests的一次代码级对账：installed runtime说明补齐四个ABI contracts，Design链接和
  adapter注释完成校正，autonomous nonce/attestation改为严格接受exact单个LF并覆盖负向字节形式。
- Product Phase authority文件统一为`phase-N-overview.md`，稳定显式anchor保持不变，current与history链接完成迁移且不保留
  pre-1.0旧路径redirect。

<a name="phase-5-0-acceptance-conclusion"></a>

## Acceptance conclusion

本批次证明`v0.5.0-dev`已经具备一致的本地开发身份和第一轮文档治理基线：宏观文档职责不再相互复制，planning/history生命周期
由维护者控制，文档声明与当前代码级实现完成一次对账，autonomous换行合同也由实现与回归共同收紧。

这些证据只关闭上述本地source/governance批次。它们不证明C0、Linux/Cloud验收、immutable publication、Latest晋级或版本角色轮转；
`v0.5.0-dev`仍是pre-C0 development candidate，Product Phase 5仍处于活动状态。

<a name="phase-5-0-explicit-non-goals"></a>

## Explicit non-goals

- 不把Product Phase 5标记为closeout，不创建stable v0.5.0、tag、Release或Cloud PASS。
- 不改变除autonomous exact-LF修正以外的runtime行为、Host ABI、trusted graph、installer或Release边界。
- 不自动删除维护者尚未决定退役的completed planning scope，也不把完整planning复制进history。
- 不纳入后续对测试断言的粗筛结果，也不提前记录尚未开始或尚未关闭的正式Discovery；这些材料留给planning，并只在维护者决定后
  才可能形成Phase 5.1 history。

<a name="phase-5-0-successor-inheritance"></a>

## Successor inheritance

Phase 5后续工作继承本批次形成的authority分层：README回答稳定产品问题，Wiki承载开发与Release维护，ROADMAP维护current
programme，Phase overview保存长期提纲，planning保存详细过程，history只接收维护者批准且符合合法record role的成熟对象。

下一批测试断言粗筛和正式Discovery必须重新盘点证据、冻结问题与退出条件；只有该Round实际关闭并经维护者决定，才创建对应的
Phase 5.1 record。Phase 5.0不预写其判断、方案或验收结果。

<a name="phase-5-0-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/905d601c817dc74abd92f3bf4d0a41ef296f8f24)

该commit固定本批次所提炼的`v0.5.0-dev` changelog与已完成实现；它不解释当前状态。当前Product目标、programme、contracts和行为
仍以当前仓库authority为准。
