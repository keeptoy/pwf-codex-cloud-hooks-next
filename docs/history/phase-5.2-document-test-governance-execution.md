<a name="phase-5-2-historical-position"></a>

# Phase 5.2：文档测试治理执行结果回顾

> Record role: `RETROSPECTIVE_CAPSULE`

## Historical position

Phase 5.2是Product Phase 5内一轮**已经完成的本地文档测试治理执行批次**的回顾性标签，不是新增Product Phase、正式
Discovery Round或Phase 5 closeout。它回答：此前[`Phase 5.1决策`](phase-5.1-document-test-governance-discovery.md#phase-5-1-document-test-governance-decision)
选择的有条件路线，后来实际做了什么、遇到什么偏差、又留下什么边界。当前Product目标和长期结论仍只读
[`Product Phase 5 Overview`](../product-phases/phase-5-overview.md#product-phase-5-overview)。

<a name="phase-5-2-problem-before"></a>

## Problem before

两份仓库治理测试把可解析的安全、身份、链接和authority关系，与中文说明、历史叙述及一次性迁移状态混在同一批断言里。
整段文字匹配既可能被正文中的安全字样蒙混，使错误的实际命令通过；也可能把等义改写误报为失败。Phase 5.1已完成
按规则和失效后果的盘点，并冻结`CONDITIONAL_GO`与B0～B4分批路线；它当时并没有宣称这些实施已完成。

<a name="phase-5-2-core-decisions"></a>

## Core decisions

1. **先守住owner，再放开表达。** 用具名section、实际代码围栏、index/anchor、current owner链接、机器合同或immutable来源
   验证可解析关系；每一小批都用“改坏必须失败／等义改写应通过”的反例检验，而不以删除正则的数量衡量成果。
2. **安全与身份没有等效防线就保留。** Release/Cloud操作、runtime信任、published资产、历史冷来源和人工删除同意
   不因它们写在Markdown里就自动退休；未证明的断言保持`KEEP`或`DEFER`。
3. **历史决策和执行回顾分开。** Phase 5.1保留当时的假设、条件与停止点；本记录只总结后续已发生的本地执行，
   不反向改写决策，也不把本地回归升格为Linux/Cloud、C0或Release验收。

<a name="phase-5-2-completed-delivery"></a>

## Completed delivery

| 执行范围 | 已形成的结果 |
|---|---|
| 两个先导样本与B0 | C0 tag/push检查落到Wiki具名PowerShell块，Source/Candidate bootstrap选择落到Cloud模板4.1的contract派生执行链；随后冻结Phase 5.1决策，以索引成员和record role关系替换历史固定总数。样本都只覆盖各自子规则。 |
| B1 导航与文档边界 | README文档地图、handoff、DESIGN、ROADMAP当前Phase/overview、环境档案与Cloud模板，改为按所在section、owner链接、角色或状态检查。后续补齐开发列车为`NONE`时的合成指针模型；并未执行真实列车轮转。 |
| B2 操作与planning生命周期 | Handoff保持分流入口，Operator Guide按角色与冻结时序验证，planning删除仍需维护者同意，acceptance/template按各自职责核对；相邻Cloud/Release命令与停止条件继续受原安全断言保护。 |
| B3 history结构与条件退休 | 先建立索引准入、角色、Phase-scoped anchor、record结构和immutable来源关系，再有条件退休Phase 4.12、七份重编号记录及Phase 4.13～4.17的纯叙述措辞断言。Phase 4.8的缺失来源先被修复，才完成其重编号断言移交；冻结历史正文没有为测试批量改写。 |
| B4 current/cold身份 | 对齐CHANGELOG、DESIGN、ROADMAP、provenance、acceptance与published oracle的职责，逐批收窄宽泛禁词；保留精确hash、published角色、parser边界与其他仍有安全后果的守卫。最后形成有界的本地身份对账结论。 |

<a name="phase-5-2-execution-issues"></a>

## Temporary issues and disposition

| 执行中发现的问题 | 当时如何处理；是否解决 |
|---|---|
| 部分新关系检查仍有假绿或假红：例如Guide计数被同条其他分句蒙混、DESIGN裸句可能重建第二authority、历史标题去措辞化时会漏掉版本身份、B4的owner指针可能误放行具体身份声明。 | **已就各自已实施子规则修正。** 把判断限定到对应句段、声明位置与值，补有害／等义反例；没有为绿灯放宽原安全边界。新写法仍不等于通用自然语言或Shell解释器。 |
| Phase 4.8两处文字说旧guide可从文末Cold evidence恢复，但当时没有该节；Phase 4.10有同类指针缺口。 | **已修复来源入口。** 从Git核对含旧guide及显式anchor的exact祖先，在两份记录末尾各追加一处Cold evidence；随后才把Phase 4.8纳入R29关系验证。没有猜写或改写冻结正文。 |
| ROADMAP允许开发列车为`NONE`，而原A20测试只接受一条active Phase路线；部分新测试fixture又误把具体版本字面量冻结进测试源码。 | **状态模型和fixture已修复，真实轮转未发生。** `NONE`合成反例现在要求无旧当前overview指针、无active Phase行，但保留完成态overview和已接受证据入口；fixture从现有身份派生。无Product Phase的未来patch/governance列车仍需另行决定。 |
| B3的冷链接形状一度容易被误当作每份record的固定commit身份；Phase 5当前overview还滞留“Phase 5.1草稿”描述。 | **已分别澄清和纠偏。** 通用history检查只守一处immutable来源形状，不为Phase 4.14虚增hash权威；其余精确旧来源继续保留。overview在维护者授权后更新为已冻结决策与有界本地执行摘要。 |

<a name="phase-5-2-acceptance-conclusion"></a>

## Acceptance conclusion

本批次达到`B0_B4_LOCAL_RECONCILED`：已实施的分批治理、负向与等义探针、保留守卫和历史来源修复完成本地对账；聚焦及
完整Windows回归通过。Windows中的POSIX/Linux专项仍诚实跳过，这些本地结果不证明Linux/Cloud运行、Source/Candidate、
Published Release或Product Phase 5验收完成。

<a name="phase-5-2-explicit-non-goals"></a>

## Explicit non-goals and retained work

- 维护者决定**暂时保留**未移交的断言。A20中未来Phase路线、Phase 4 Release/history及Product范围的跨领域声明仍由原
  `KEEP`守卫保护，需要时再单独设计；`NONE`以外的无Product Phase列车也没有被本批次定义。
- R23仅有bootstrap选择子规则获得新守卫，其余materialization、zero-hash与公开下载身份仍`DEFER`；R25的措辞退休
  仍取决于相邻操作安全覆盖。B3索引中的重编号总述断言及部分短治理守卫未批量移除。
- R38的旧来源、Release/path-safety混合断言仍需逐项区分current guard与cold恢复；其余Cloud/Release操作、
  runtime/permission、旧路径复发、链接退役和测试源码lint的`DEFER`组均未凭本地对账自动关闭。
- 未改production、Host ABI、trusted graph或Release合同；未创建C0、tag、Cloud任务、Release，也未发布或移动远端引用。

<a name="phase-5-2-successor-inheritance"></a>

## Successor inheritance

后续文档治理沿用“唯一owner → 实际关系/命令 → 有害失败与等义通过 → 保留不可自动判定的人工审阅”的准入方法。
若要动某条保留断言，先由其Release、Cloud、runtime、历史来源或test-design owner提出单独证据门槛；不为关掉库存数字
而批量退休。Phase 5的closeout、planning保留/提炼/删除、Linux/Cloud和Release路径仍分别由其既有authority及维护者
另行决定。

<a name="phase-5-2-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable local source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/90ab434466780a5d227f85a6c49dee740b14cc61)

该exact commit及其祖先固定本批次的实施、planning对账与修正证据；链接仅用于历史来源审计，不表示该提交已经被远端发布，
也不替代当前Product、programme、合同或验收authority。
