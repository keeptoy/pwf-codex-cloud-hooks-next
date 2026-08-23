# Findings: ROADMAP Phase anchor consolidation

## Maintainer-owned starting delta

- 维护者已把原5.2/5.3收进5.1，并把三个内部标题统一为5.1.1、5.1.2、5.1.3；该未提交ROADMAP改动属于本轮授权基线，必须原样保留。

## Inbound inventory

- `phase-4-opt-in-purpose`：current authority有1条实际链接，位于ROADMAP 5.1.2；planning另有一条带时间语义的历史说明，测试冻结anchor和自链接。
- `phase-4-f2-activation-protocol`：current authority有2条实际链接，位于Phase 4.1和Phase 4.4 history；测试冻结anchor。
- `phase-4-f2b-discovery-handoff`：current实际入链为0；只有ROADMAP定义和测试冻结。
- 三者均在pre-1.0公开历史refs中出现，但immutable tag保留原定位，不阻止current tree迁移。

## Chosen target

- 在`### 5.1 Phase 4 已采纳 gate 路线`前建立唯一`product-phase-4`显式anchor。
- 5.1.2的“上面的四开关模型”改为同节内普通回指，不再维持自链接。
- 两份Phase history把current authority链接迁移到`ROADMAP.md#product-phase-4`，并将链接文字收敛为Phase 4 current authority，避免把内部F2子节当永久接口。
- architecture contract只冻结一个Phase 4入口及两份迁移后的history links，不保留三个旧anchor named tombstone。
