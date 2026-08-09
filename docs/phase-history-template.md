<a name="phase-history-template"></a>

# Phase 历史摘要模板

本文件是写作和上下文恢复工具，不是 machine contract，也不是当前 architecture、programme、provenance
或 acceptance authority。新增已经闭合的 Phase/迁移摘要时复制本模板，再按现有证据删改提示文字；不要
为了满足模板猜测历史事实。

## 使用步骤

1. 先恢复对应 immutable commit/tag/Release、CHANGELOG、provenance 与当时 acceptance，区分历史事实和
   当前实现。
2. 只在阶段已经闭合、具有长期解释价值且完整原文可从 immutable ref 恢复时建立摘要。
3. 复制下方骨架到历史目录；文件名优先使用 `phase-<编号>-<主题>.md`，回顾性 interlude 必须显式说明，
   但文件名和小节结构是写作约定，不是测试合同。
4. 正文保持自洽、短小，不复制源码、脚本、fixture、验收全文、SHA 表、测试计数或逐 Round 流水账。
5. 完成后只在历史目录索引登记；不要从 CHANGELOG、ROADMAP、provenance 等宏观文档直链具体摘要。
6. 摘要进入历史目录后原则上冻结，只做有证据的事实纠错或 immutable link 修复。

---

<!-- 复制时从这里开始；删除所有提示注释。 -->

<a name="historical-position"></a>

# <Phase / interlude 标签>：<主题>

## Historical position

<!-- 当时位于哪条版本/programme 路线上？为什么它已经闭合？回顾性标签必须明确不是原授权。 -->

<a name="problem-before"></a>

## Problem before

<!-- 进入该阶段前，哪个具体问题或风险尚未解决？ -->

<a name="core-decisions"></a>

## Core decisions

<!-- 记录少量关键决定、被拒绝路线和必须保持的不变量。 -->

<a name="completed-delivery"></a>

## Completed delivery

<!-- 只写真正交付并进入后继基线的闭环，不写逐次提交日志。 -->

<a name="acceptance-conclusion"></a>

## Acceptance conclusion

<!-- 说明证据证明了什么，以及没有证明什么；不冻结易漂移的测试数量。 -->

<a name="explicit-non-goals"></a>

## Explicit non-goals

<!-- 列出当时明确未授权、未实现或留给后继阶段的能力。 -->

<a name="successor-inheritance"></a>

## Successor inheritance

<!-- 后继阶段继承了什么，哪些临时机制已经退役？必要时可相对链接另一份历史摘要。 -->

<a name="immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](<exact-commit-url>)

该链接只证明本文的历史来源，不解释当前实现；当前 contract 与行为以当前仓库 authority 为准。
