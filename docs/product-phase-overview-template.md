<a name="product-phase-overview-template"></a>

# Product Phase Overview 模板

本模板只用于创建`docs/product-phases/phase-N.md`长期Product authority。只有ROADMAP与活动task plan已经明确激活真实Product
Phase时才创建实例；未激活的候选/TBD Phase不得先建空overview。创建后删除所有不适用的提示文字。

## 写作边界

1. 只写跨版本仍有解释价值的Product目标、已采纳路线、稳定边界、最终交付和后继继承。
2. current train、accepted/fallback与未来路线只链接ROADMAP；逐版本delta只链接CHANGELOG。
3. Discovery过程只链接history；tag/source/ZIP/bootstrap/SHA与Cloud验收只链接provenance/acceptance。
4. 不复制当前Next Step、临时施工状态、逐Round流水、原始测试输出、测试数量、C0/C1/C2步骤、源码或验收教程。
5. 使用稳定英文显式anchor。活动期允许维护已采纳的长期内容；closeout后只做事实纠错、链接维护或有证据的状态尾注。

---

<a name="product-phase-<N>-overview"></a>

# Product Phase <N> Overview

> Authority role: `PRODUCT_PHASE_OVERVIEW`
> Version series: `<x.y.z-* or multiple trains>`
> Current programme and train pointer: `<relative link to ROADMAP>`

## Long-term position

<!-- 一句话说明这个Product Phase最终解决什么，以及它不是什么。 -->

## Why this Phase existed

<!-- 只保留长期问题与Product目标，不复制Discovery时间线。 -->

## Adopted route and stable boundaries

<!-- 总结最终采用的路线、关键不变量和明确非目标。可以有小表，但不要复制逐gate日志。 -->

## Delivered capabilities

<!-- 写最终进入后继基线的能力；仍未实现或未验收的内容明确排除。 -->

## Version-train mapping

<!-- 说明本Phase覆盖哪些版本系列及其Product作用；逐版本变化只链接CHANGELOG。 -->

## Closeout and successor inheritance

<!-- Phase关闭后补齐最终结论、后继阶段必须继承的边界以及仍需重新Discovery的问题。 -->

## Evidence map

- Programme/current roles: `<relative link to ROADMAP>`
- Version deltas: `<relative link to CHANGELOG>`
- Historical process: `<relative link to Phase history index>`
- Published identity: `<relative link to BASELINE_PROVENANCE>`
- Exact acceptance: `<relative link to the relevant acceptance>`
