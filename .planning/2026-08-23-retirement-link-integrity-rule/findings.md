# Findings: retirement link-integrity rule

- 治理指南第11节已经要求immutable ref、字节可恢复、immutable link、rollback入口和tests不依赖旧root copy，但没有明确要求删除前枚举全部入链、删除后复扫断链。
- Lifecycle zones第6.2节已把“链接有效性”列为治理维度，因此新规则应落在第11节retirement DoD，而不是创建新的authority章节。
- 扫描范围不能只写Phase history；至少包括README/ROADMAP、Phase capsules、provenance、CHANGELOG、acceptance/template、planning、tests和其他repository docs。
- 替代策略必须显式：自包含摘要、仍在位current authority或immutable commit/tag/Release URL；不得用moving branch或删除引用来掩盖证据缺口。
