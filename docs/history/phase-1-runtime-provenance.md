<a name="historical-position"></a>

# v0.3.0 Phase 1：Runtime 来源与契约

## Historical position

Phase 1 对应 `v0.3.0-alpha.1`。它建立了 v0.3.0 系列的可信来源、owned runtime 合同和确定性发布边界，
但在该检查点只安装 inactive verified inventory，没有切换 Hook 生产行为。

<a name="problem-before"></a>

## Problem before

早期 Cloud compatibility 行为可以作为 golden 参考，却不足以回答新仓库的供应链问题：哪些 upstream
文件可以进入包、哪些字节 pristine 或经过 overlay、adapter 与 runtime 之间传递什么、安装后如何发现
drift，以及 ZIP 和外部 bootstrap 的边界在哪里。直接从可变 global Skill 执行脚本也无法形成受控 trusted
graph。

<a name="core-decisions"></a>

## Core decisions

- 唯一 upstream 来源固定为 PWF v3.8.2 archive 中的 canonical Skill path，拒绝 IDE mirror 和模糊来源。
- runtime 分为 pristine upstream、单目标 managed overlay、repository-owned 与 deferred 四类；存在于
  upstream 不等于获准导入、安装或激活。
- 以 machine-readable contracts 固定 bundle、overlay ledger、adapter/runtime request/result 和 Release
  artifact；unknown path、hash、anchor、mode 或 inventory drift fail closed。
- Release ZIP 只由 exact allowlist 构建；负责下载并校验 ZIP 的 bootstrap 永远是 ZIP 外独立资产。

<a name="completed-delivery"></a>

## Completed delivery

- importer 校验 pinned archive、allowlist、pristine/managed hash 与 overlay anchors，并以原子替换产生 owned
  runtime；精确已有目录保持幂等，未知或 symlinked 内容不被静默覆盖。
- compatibility ledger 将旧的物理转换拆成 explicit runtime、session store、scoped planning state 和
  bounded wrapper rendering 四项可独立退役的逻辑 overlay。
- installer/doctor/repair、manifest、文件 mode、第三方声明和 deterministic package boundary 覆盖新 runtime
  inventory，但 adapter 尚不 dispatch 这些 child runtime。

<a name="acceptance-conclusion"></a>

## Acceptance conclusion

`v0.3.0-alpha.1` 的 Cloud checkpoint 证明固定 ZIP 下载与校验、安装、doctor、精确 inventory、owned 文件
hash、adapter-only command boundary 和简化兼容 smoke 可以成立。该结论证明供应链与 inactive 安装闭环，
不证明 Phase 2/3 的生产调用已经启用。

<a name="explicit-non-goals"></a>

## Explicit non-goals

- 不激活 owned catch-up 或 owned plan runtime，不改变当时的 Hook 输出。
- 不启用 attestation、nonce、mode、ledger mutation、completion 或 Stop gating。
- 不因为已导入 resolver/injector 就把它们注册为 handler 或提前进入 Phase 3 trusted graph。

<a name="successor-inheritance"></a>

## Successor inheritance

Phase 2 继承这套来源、安装和 request/result 边界并激活 owned catch-up；Phase 3 再用同一 ownership 模型
加入 canonical owned-plan。随后 beta.1 完成 Phase 1～3 功能闭环，beta.2 重新封板文档与独立资产，stable
v0.3.0 最终通过 `BASELINE_PROVENANCE.md` 的 M1～M4 迁移链进入 successor 仓库。

<a name="immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b)

该链接只证明本文的历史来源，不解释当前实现；当前 contract 与行为以当前仓库 authority 为准。
