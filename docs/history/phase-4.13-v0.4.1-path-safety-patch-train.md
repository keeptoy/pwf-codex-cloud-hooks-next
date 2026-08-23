<a name="phase-4-13-historical-position"></a>
<a name="phase-4-12-historical-position"></a>

# Phase 4.13：v0.4.1 path-safety patch train

## Historical position

Phase 4.13是后来为`v0.4.1`分配的**回顾性path-safety patch-train标签**。该列车位于已发布`v0.4.0`之上，
只修复installer路径安全边界，不是新的Product Phase、Discovery Round或Host/runtime能力扩展。

Phase 4.11当时关闭Product Phase 4功能施工后，立即后继仍是`v0.4.0`的版本化Phase 9；该Release discovery现已
回顾性编号为Phase 4.12，本文不反向改写那段时间线。Phase 4.13只把随后独立发生并已发布验收的`v0.4.1`
兼容性安全修复整理成长期可恢复的维护摘要。

<a name="phase-4-13-problem-before"></a>
<a name="phase-4-12-problem-before"></a>

## Problem before

旧uninstall把固定`<codex-home>/hooks/planning-with-files`目录视为可备份、可递归删除的owned位置，却没有先证明父路径
拓扑安全。Windows junction若把`<codex-home>/hooks`指向仓库外目录，uninstall会穿透父路径并删除外部runtime；即使backup
保留了字节，也不能抵消已经发生的越界删除。

同源缺口也存在于安装入口：clean install在目标runtime不存在时会过早接受空inventory，因此clean install可能在runtime不存在
的情况下漏检linked parent并向外写入。正常installer不会主动制造symlink、junction或special file；这些状态通常来自人工操作、
第三方工具、旧残留或文件系统异常，但它们一旦位于安全边界上就必须作为不可信拓扑处理。

<a name="phase-4-13-core-decisions"></a>
<a name="phase-4-12-core-decisions"></a>

## Core decisions

1. **路径准入先于内容所有权。** `path topology`与`exact inventory admission`保持分层：前者回答“能否安全进入这条路径”，
   后者回答“目录中的已安装内容是否属于受支持的current/predecessor状态”。
2. **所有写删入口共用no-follow边界。** install、repair与uninstall必须在backup和mutation前拒绝不安全拓扑，不能等目标runtime
   已经存在或等到递归复制、删除时才判断。
3. **拒绝对象按文件类型而非是否unknown区分。** symlink、junction、非目录component与nested special entry均以
   `BLOCKED_UNSAFE_RUNTIME_PATH` fail closed，因为操作可能跨越installer-owned边界或触发特殊I/O。
4. **保留显式恢复合同。** unknown普通文件/目录仍允许被完整备份后清理；它们位于已验证的真实目录树内，不等同于会改变
   路径指向的link或special entry。uninstall因此不复用install的严格inventory admission。
5. **补丁范围保持兼容。** 不改变Host ABI、managed events、adapter-only policy、runtime trusted graph、legacy默认行为或
   `v0.4.0`已建立的Product Phase 4能力。

<a name="phase-4-13-completed-delivery"></a>
<a name="phase-4-12-completed-delivery"></a>

## Completed delivery

Installer新增统一topology admission：先以no-follow元数据检查`hooks` parent和owned runtime root必须为真实目录或缺席，
再递归检查现有runtime内部只包含普通文件和真实目录。install继续在该gate之后验证exact current/predecessor inventory；
uninstall只消费topology结论，从而同时满足越界拒绝和unknown regular recovery。

回归矩阵覆盖clean install的linked parent与非目录component，以及uninstall的linked parent、linked runtime root、nested link、
POSIX special entry和unknown regular tree。README、ARCHITECTURE、DESIGN与CHANGELOG同步了稳定行为、ownership理由、实现路由和
版本delta，没有把本补丁描述为通用文件系统sandbox或任意旧状态升级器。

<a name="phase-4-13-acceptance-conclusion"></a>
<a name="phase-4-12-acceptance-conclusion"></a>

## Acceptance conclusion

本地Windows fixture证明junction/link边界会在backup、requirements写入和runtime mutation之前拒绝，外部sentinel和备份计数
保持不变。Source/Candidate的Linux/POSIX零skip验证又实际覆盖symlink、nested FIFO与unknown regular cleanup，不能由Windows
上的平台skip替代。随后公开bootstrap默认下载链、Published Release、doctor/deep check、Latest postflight与版本窗口退役均闭合。

这些证据证明`v0.4.1`发布字节保留原Product行为，同时补齐installer-owned路径拓扑安全。它们不证明任意第三方目录可以由
installer接管，也不授权沿link操作、吸收unknown installed state或跳过备份。

<a name="phase-4-13-explicit-non-goals"></a>
<a name="phase-4-12-explicit-non-goals"></a>

## Explicit non-goals

- 不创建新的Product Phase，不新增Hook、Host ABI、runtime profile或trusted graph边。
- 不把所有unknown内容统一拒绝；显式uninstall的普通文件/目录backup-and-cleanup继续受支持。
- 不把backup当成越界写删的补偿，也不尝试解析、跟随或修复symlink/junction目标。
- 不承诺从任意历史原型、陌生manifest、无ownership marker或被篡改runtime原地升级。
- 不复制逐P9状态、测试数字、ZIP/asset SHA或当前accepted/fallback角色。

<a name="phase-4-13-successor-inheritance"></a>
<a name="phase-4-12-successor-inheritance"></a>

## Successor inheritance

后继installer维护必须保留两层顺序：先证明path topology安全，再按具体动作执行inventory/ownership admission。新增install、repair、
uninstall或cleanup入口时，也必须在第一笔backup/shared-state/runtime mutation前复用等强度的no-follow检查。

Windows junction证据不能替代Linux真实filesystem证据。涉及FIFO、device或其他POSIX special entry的变更仍需在Linux/Cloud执行
零skip gate；unknown regular cleanup的正向用例必须与link/special拒绝用例一起保留，防止安全加固误伤既有恢复路线。

<a name="phase-4-13-immutable-evidence"></a>
<a name="phase-4-12-immutable-evidence"></a>

## Cold evidence (not current authority)

- [Immutable v0.4.1 source snapshot](https://github.com/keeptoy/pwf-codex-cloud-hooks-next/commit/99885b854bd9621c3340e99f031bf83ceb58414d)

该链接只证明本patch train封板时的exact源码身份，不解释当前实现；当前installer合同、版本角色与Release证据仍以当前仓库
authority为准。
