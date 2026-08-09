<a name="historical-position"></a>

# Phase 0（回顾性）：架构谱系总览

## Historical position

`Phase 0` 是后续整理历史时建立的 architecture-lineage overview，不是当时 programme 正式授权的 Product
Phase，也不是版本或 Release identity。它跨越旧仓库的 `v0.1.0` trust 路线失败、`v0.2.0` 成功原型、
`v0.2.2` Cloud 功能基线、v0.3.0 Phase 1～3 的 owned architecture 建设、`v0.3.0-beta.2` 重新封板，
以及 successor stable `v0.3.0` 的建立。

这个编号只提供一个易恢复的历史入口：先理解“功能可行、Cloud 可用、架构完成、仓库迁移”是四种不同
结论，再下钻正式 Phase 摘要。它不把后来的知识反向写成早期 programme 授权。

<a name="problem-before"></a>

## Problem before

早期版本同时发生产品验证、信任通道切换、运行时 ownership 重构和仓库迁移，容易把 `v0.1.0` 的本地
可执行代码误写成成功原型、把 `v0.2.0` 的成功验证误写成完整 hard acceptance、把 `v0.2.2` 的可靠功能链
说成今天的 owned architecture，或把 `v0.3.0-beta.2` 到 stable `v0.3.0` 的 successor 迁移说成运行时
架构换代。
这些说法会混淆“本地逻辑可运行”“Cloud 信任路线成功”“完整功能验收”“安全边界完成”和“只更换 source
authority”。

<a name="core-decisions"></a>

## Core decisions

用同一组问题区分四个关键检查点：它更准确的定位是什么、已经证明了什么、尚未证明什么。

| 阶段 | 更准确的定位 | 已经证明什么 | 尚未证明什么 |
|---|---|---|---|
| `v0.1.0` | legacy Hook trust 的失败 B1 尝试 | 本地 fixture 证明两个 Hook、canary、plan/catch-up 代码可以串联，也证明 tag/Release 可以形成 | precomputed trust 无法在 Cloud 落地，不能称为成功原型 |
| `v0.2.0` | 第一个成功的 Cloud Hook 可行性原型 | system-managed requirements、absolute adapter 与同一 Hook 行为可以在 Cloud 信任通道中工作 | 独立 acceptance 未恢复，也没有 v0.2.1 的 guarded repair 或 v0.2.2 的 A～F 闭环 |
| `v0.2.1` | 成功 Managed 路线的运维安全加固 | schema-v3 fingerprints、结构化 drift 分类、guarded repair 与 backup byte restoration 已形成 | 尚未解决 v0.2.2 的 Cloud catch-up compatibility，也没有完整 A～F 闭环 |
| `v0.2.2` | 第一个经过 Cloud 验收的最小可部署功能模型 | 安装、Managed policy、真实 Resume catch-up、repair、drift fail-closed 和 A～F 黑盒链路可以工作 | 仍是过渡架构：现场 patch global Skill、adapter 自己处理 plan，并直接调用 Skill runtime |
| `v0.3.0-beta.1` | 当前 canonical architecture 的第一个最小完整实现 | Phase 1～3 闭环：owned runtime、owned catch-up、canonical owned-plan、thin adapter、确定性发布和 Cloud 验收 | 文档治理、独立发布资产与可重放验收随后由 `v0.3.0-beta.2` 重新封板 |
| Phase 3.5 | 仓库权威迁移，不是运行时架构换代 | 从旧仓库 exact mirror，经 slim transformation、Cloud equivalence，最终切换 successor authority | 没有重新设计或改变 Phase 3 production behavior |

判断历史变化时固定分开三条轴：product behavior 是否可用、trusted runtime ownership 是否完成、repository
authority 是否迁移。任何一条轴的 PASS 都不能自动替另外两条背书。

<a name="completed-delivery"></a>

## Completed delivery

架构换代是逐段完成的，不是 `v0.3.0-beta.1` 单次重写：

```text
v0.1.0 legacy Hook trust 尝试在 Cloud 失败
  -> v0.2.0：切换 system-managed trust/registration，建立首个成功原型
  -> v0.2.1：增加 schema-v3 fingerprints、doctor/drift 分类与 guarded repair
  -> v0.2.2：补 Cloud catch-up compatibility，完成 A～F，并形成旧过渡架构
  -> v0.3.0-alpha.1 / Phase 1：建立 owned runtime、contracts 与供应链边界，但尚未激活
  -> v0.3.0-alpha.2 / Phase 2：切换到 repository-owned catch-up
  -> v0.3.0-beta.1 / Phase 3：切换到 canonical owned-plan + thin adapter
  -> v0.3.0-beta.2：不改架构，补文档治理、独立资产和可重放验收
  -> Phase 3.5：把 v0.3.0-beta.2 基线从旧仓库迁往 successor
  -> v0.3.0：在 next 仓库发布 stable
```

- `v0.1.0` 的 adapter/本地 fixture 已能执行，但 legacy `hooks.json` + `config.toml` precomputed trust 无法在
  Cloud 落地；其 tag/Release 是失败候选的可恢复字节，不是成功证明。
- `v0.2.0` 保持同一 Hook 算法，改由 `/etc/codex/requirements.toml` system-managed policy 注册 absolute
  adapter；维护者确认这条路线实际成功。v0.2.1 随后增加更严格的 manifest/doctor/repair 治理。
- `v0.2.2` 使用单一 Release ZIP，bootstrap 作为包内文件随 installer/runtime 一起运输，并在安装现场修改
  global Skill；adapter 调用 global Skill 的 `session-catchup.py`，并保留自己的 plan resolution/rendering。
  它建立可靠功能基线，但不是当前 trusted graph。
- `v0.3.0-alpha.1` 建立 owned runtime、machine contracts、deterministic import/install/package 和 exact
  inventory，同时把 bootstrap 外置为独立 Release asset；但 runtime 只是 inactive verified inventory，
  没有切换 production dispatch。
- `v0.3.0-alpha.2` 是第一次真正的 production architecture 切换：global Skill 恢复 pristine，
  SessionStart catch-up 由 repository-owned wrapper 承担，Managed policy 继续只注册 adapter。
- `v0.3.0-beta.1` 完成最后一块：`owned-plan.py` 成为唯一 plan authority，SessionStart 与
  UserPromptSubmit 共用同一 project state，adapter 内平行 plan 算法退休，thin adapter + owned siblings
  架构闭合。
- `v0.3.0-beta.2` 保持 hooks、runtime、installer、contracts 与 trusted graph 不变，只用独立身份重新完成文档治理、
  资产封板和 Fresh/Resume 验收。
- 后续迁移以 `v0.3.0-beta.2` 为唯一产品输入，依次完成 M1 exact mirror、M2 slim successor root、M3 Cloud
  equivalence 和 M4 repository authority cutover；stable `v0.3.0` 继承已经完成的 Phase 3 runtime。

<a name="acceptance-conclusion"></a>

## Acceptance conclusion

一句大白话是：`v0.1.0` 证明“这条 trust 路线走不通”；`v0.2.0` 才证明“这件事能做”；`v0.2.2` 证明
“这件事能在 Cloud 上可靠运行”；`v0.3.0-beta.1` 才建立“今天这套 owned canonical architecture”；
Phase 3.5 只是把已经完成的架构安全搬进 next 仓库。

因此最准确的三条历史主线是：

- **可行性验证**：v0.1.0 trust failure → v0.2.0 successful prototype → v0.2.1 operational hardening → v0.2.2 Cloud A～F。
- **架构换代**：`v0.2.2` → `v0.3.0-alpha.1` → `v0.3.0-alpha.2` → `v0.3.0-beta.1`。
- **仓库换代**：`v0.3.0-beta.2` → Phase 3.5 → next 仓库的 stable `v0.3.0`。

<a name="explicit-non-goals"></a>

## Explicit non-goals

- 不把 `Phase 0` 写回原 programme，不新增 Phase 授权，也不改变现有版本编号。
- 不用早期 tag/Release 代替缺失的 Cloud acceptance，不把 v0.1.0 提升为成功原型，也不把维护者确认的
  v0.2.0 成功验证扩写成尚未恢复的 A～F hard acceptance。
- 不把 v0.2.2 的功能可靠性解释为 owned runtime 已完成，也不把 `v0.3.0-alpha.1` 的 inactive inventory
  解释为已激活。
- 不把 successor migration 解释为新 runtime contract，不复制资产 SHA、测试计数、验收全文或当前状态。
- 不用本摘要解释当前实现；当前 architecture、contracts、programme 与 source identity 仍由各自 authority 管理。

<a name="successor-inheritance"></a>

## Successor inheritance

需要理解每段技术闭环时，依次阅读 [Phase 1：Runtime 来源与契约](phase-1-runtime-provenance.md)、
[Phase 2：Owned Catch-up](phase-2-owned-catchup.md) 和
[Phase 3：Canonical Owned Plan](phase-3-canonical-plan.md)。需要理解仓库归属变化时，再阅读
[Phase 3.5：Successor 仓库迁移](phase-3.5-successor-migration.md)。

stable `v0.3.0` 继承 `v0.3.0-beta.1` 已完成、`v0.3.0-beta.2` 已重新验收的 canonical runtime；后续版本
是在这个基线上加固兼容、供应链与治理，而不是重新走一遍早期原型路线。

<a name="immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable old-repository lineage snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks/commit/bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b)

该链接只证明本文旧仓库架构谱系的历史来源，不解释当前实现；successor M1～M4 exact refs 由当前
provenance authority 维护，当前 contract 与行为以当前仓库 authority 为准。
