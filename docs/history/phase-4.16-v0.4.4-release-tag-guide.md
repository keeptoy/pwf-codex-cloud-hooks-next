<a name="phase-4-16-historical-position"></a>

# Phase 4.16：v0.4.4 Release tag 操作教程治理

> Record role: `RETROSPECTIVE_CAPSULE`

## Historical position

Phase 4.16是v0.4.3完成immutable publication、双通道验收、Latest与C2之后形成的回顾性Release文档patch-train里程碑。
维护者希望在根README补齐Source/Candidate PASS后的本地tag与远端tag操作；盘点确认README本身是Release ZIP输入，因此这项
看似纯文档的修改不能继续挂在已经封板的v0.4.3身份上，而必须进入新的`v0.4.4-dev` development identity。

该列车继续归属已闭合Product Phase 4 baseline上的patch/governance范围，不重新打开Product行为，也不激活Product Phase 5。
当前命令只读根[`README`](../../README.md)，宏观C0/C1/C2与publication顺序只读
[`ROADMAP` Release流程](../../ROADMAP.md#release-four-step-flow)，长期继承边界读
[`Product Phase 4 Overview`](../product-phases/phase-4.md#product-phase-4-overview)。

<a name="phase-4-16-problem-before"></a>

## Problem before

README已经能够从Source/Candidate Cloud SHA确定性生成待上传ZIP/bootstrap，但只用一句话要求“正式tag精确指向C0”，没有给出
维护者可复制的local tag、remote tag与identity核对命令。实际流程中C1会在C0之后写回第一通道证据；若维护者在C1 checkout直接
运行不带commit参数的`git tag -a`，Git默认给当前HEAD打tag，就会把治理commit误标为第一通道实际验收的源码。

另一个风险是发布后直接补README。即使内容只是教程，它仍会改变Release ZIP；若不切换version/contract/bootstrap/manifest
身份，当前checkout会继续自称v0.4.3，却无法重建v0.4.3公开包。只把说明写进planning又会在计划退役后丢失长期操作入口。

<a name="phase-4-16-core-decisions"></a>

## Core decisions

1. **README变化进入新development identity。** package、Release contract、manifest hash和contract点名的zero-hash bootstrap
   原子轮转到v0.4.4-dev；已发布v0.4.3 tag/source/ZIP/bootstrap/acceptance保持immutable。
2. **tag只认C0显式参数。** 示例要求维护者设置`SOURCE_CANDIDATE_HEAD`，并把它作为`git tag -a`的commit参数；禁止依赖当前HEAD。
3. **同名tag fail closed。** 创建前分别检查local与remote exact tag ref；任何同名对象已存在或查询状态未知都停止，不使用
   force、移动、删除重建或覆盖修补。
4. **只push exact tag ref。** 分支由维护者按C1流程另行push；tag步骤使用完整tag refspec，只发布目标tag，不把其他branch或tag
   隐式带到远端。
5. **annotated tag按peeled commit核对。** tag ref本身指向tag object，不能直接把它的SHA当C0；远端`^{}` peeled commit必须
   唯一且精确等于`SOURCE_CANDIDATE_HEAD`。
6. **版本窗口合同同步轮转。** 新候选把当前accepted v0.4.3作为exact installed predecessor；v0.4.3离开current checkout后，
   provenance显式记录其包含正式bootstrap字节的immutable C2 source，published oracle不从新开发树猜旧资产。

<a name="phase-4-16-completed-delivery"></a>

## Completed delivery

- README在正式双资产materialization之前增加完整PowerShell教程，覆盖C0解析、local/remote collision、annotated tag创建、local
  commit核对、exact tag ref push和remote peeled commit核对，并解释为什么不能省略commit参数。
- v0.4.4-dev package、Release contract、manifest、zero-hash bootstrap与accepted predecessor transition形成一致development
  identity；v0.4.3/v0.4.2继续承担accepted/immediate-fallback角色。
- ROADMAP current train、CHANGELOG与Phase 4 overview同步；Phase 5保持TBD且未授权。
- 静态治理、Release构建、bootstrap、published/fallback恢复与完整本地回归共同证明新教程没有弱化immutable tag、ZIP、安装迁移或
  fail-closed边界；production runtime、Host ABI和trusted graph没有变化。

<a name="phase-4-16-acceptance-conclusion"></a>

## Acceptance conclusion

本轮本地交付闭合了“第一通道通过后怎样把正式tag精确绑定C0”的新人操作缺口，并证明README变化已经由新的development
identity诚实承载。命令块通过PowerShell parser和直接语义断言，候选ZIP仍由同一contract确定性构建，accepted/fallback
publication oracle与forward migration继续闭合。

这些证据只证明v0.4.4-dev本地文档补丁列车健康；它不等于v0.4.4 C0、Source/Candidate Cloud PASS、真实tag push、GitHub Release
或Published Release。README中的远端命令仍只由维护者在后续获批Release gate执行。

<a name="phase-4-16-explicit-non-goals"></a>

## Explicit non-goals

- 不创建、推送、移动或删除任何真实tag，不push branch，不编辑GitHub Release或上传资产。
- 不修改v0.4.3 immutable tag、公开ZIP/bootstrap字节、URL、SHA或acceptance结论。
- 不把C1/C2、moving branch、当前HEAD或annotated tag object SHA当作C0 commit。
- 不新增Product/runtime行为、Host event、adapter policy、installed inventory或Release entry。
- 不激活Product Phase 5，不预填Cloud PASS或版本acceptance。

<a name="phase-4-16-successor-inheritance"></a>

## Successor inheritance

后继Release列车在Source/Candidate PASS后必须保持以下顺序：先写回并push C1治理分支，再以实际Cloud PASS的
`SOURCE_CANDIDATE_HEAD`创建annotated tag，确认local peeled commit，单独push exact tag ref，最后确认remote peeled commit仍等于
C0，之后才物化/上传双资产。任何同名tag、未知查询结果或identity不一致都停止，不做原位修补。

README仍是Release ZIP输入。后续若修改本教程、materializer、contract、runtime或其他package字节，必须在新C0之前完成；第一通道
通过后发生变化就作废旧证据并重新验收。本文只解释该规则为什么形成，当前可复制命令始终读README。

<a name="phase-4-16-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/aea21aea851e17ee9cc9cbc462a031afa5cad8c8)

该链接固定Phase 4.16所回顾交付完成时的exact本地提交；维护者push后成为远端cold evidence。它不证明后继Cloud、tag、publication
或current行为，当前事实仍以当前仓库authority为准。
