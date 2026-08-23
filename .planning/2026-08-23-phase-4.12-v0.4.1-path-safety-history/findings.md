# Findings: Phase 4.12 v0.4.1 path-safety history summary

## Initial framing

- `v0.4.1`是`v0.4.0`之上的兼容性安全patch train，不是新的Product Phase。
- 已知旧边界包含两条同源问题：uninstall可穿透Windows junction父路径删除外部runtime；clean install在runtime尚不存在时可能漏检linked hooks parent并向外写入。
- 修复模型不是把uninstall改成严格inventory admission，而是先做path topology gate，再保留显式uninstall对unknown普通文件/目录的backup-and-cleanup合同。
- 摘要需要说明install/repair/uninstall在backup与mutation前拒绝symlink、junction、非目录component与nested special entry。

## Evidence to recover

- ROADMAP/CHANGELOG中的patch train定位与发布结论。
- `install.js`中path topology和inventory admission的实际分层。
- installer测试中的clean install、uninstall linked parent/runtime/nested link、FIFO和unknown regular content用例。
- v0.4.1 immutable source/tag证据入口。

## Stable authority readback

- README当前稳定合同明确：install、repair、uninstall都在backup/write/delete之前检查owned runtime路径拓扑；`hooks`、runtime root或内部entry为symlink、Windows junction、非预期类型或special path时返回`BLOCKED_UNSAFE_RUNTIME_PATH`。
- README同时明确保留显式uninstall的恢复语义：unknown普通文件/目录先完整备份，再由uninstall清理。
- ARCHITECTURE把这项设计归入installer ownership，并明确`path topology admission`与`content ownership`分层；linked/junction/special path先拒绝，unknown普通内容不是同一安全类别。
- 因此Phase 4.12不能笼统写成“uninstall遇到unknown就拒绝”，也不能只写Windows junction单点；历史价值在于冻结跨install/repair/uninstall的no-follow topology gate及其与cleanup合同的分界。
- DESIGN把该变化路由到install plane：`install.js`负责path-topology admission，首选证据是`tests/installer.test.js`，其中POSIX symlink/special-file仍需Linux gate；这支持摘要只谈installer安全边界，不扩展到runtime/Host ABI。
- ROADMAP的版本语义明确`0.x.y`补丁版本只允许同一minor行为合同内的兼容修复；新增Hook、Host ABI或trusted graph才进入minor/Product Phase。因此`v0.4.1`应明确写成`v0.4.0`上的patch train，而不是Phase 5或新Product Phase。
- ROADMAP的pre-1.0兼容政策还要求unknown ownership/drift fail closed，但不否定显式uninstall作为受控cleanup路线；history应区分“无法证明的就地升级”与“明确uninstall先备份再清理”。

## Source and acceptance evidence

- `install.js`的`assertSafeRuntimeTopology()`先用`lstat`检查`<codex-home>/hooks`与owned runtime root必须为真实目录或缺席，再递归拒绝runtime中的symlink和非file/non-directory special entry；`assertSafeRuntimeForInstall()`在此后才做exact current/predecessor inventory admission。
- install在capture shared state后、backup前调用严格install admission，并在实际mutation前再次复核topology；uninstall在capture、backup、requirements写入和recursive removal前先调用topology gate，但不调用严格inventory admission。这正是“安全路径准入”和“unknown regular cleanup”分层。
- 本地installer tests冻结五类关键结果：clean install拒绝linked hooks parent和非目录hooks component；uninstall拒绝linked hooks parent、linked runtime root、nested runtime link；POSIX专用FIFO拒绝；unknown regular file/directory仍备份并卸载。
- `v0.4.1` acceptance证明Windows本地junction/symlink边界通过，并在exact Source/Candidate Linux环境以零skip实际执行FIFO/symlink/unknown-regular用例；随后Published Release、Latest与第二轮退役均闭合。history只需概括结论并链接，不复制测试计数、ZIP大小或SHA。
- 实现提交为`89c98b54d34049a770005e32378d0a42c55a24ed`；immutable stable source/tag为`99885b854bd9621c3340e99f031bf83ceb58414d`。Phase history按模板最多保留一个immutable snapshot，应链接最终stable source，而把实现提交留给Git ancestry审计。

## History placement decision

- Phase 4.11的历史尾注写过“F3C4关闭后，后继不叫Phase 4.12”，其时间语义是：当时立即进入`v0.4.0`版本化Phase 9，而不是继续Product Phase 4施工。现在补Phase 4.12必须显式标为**后来分配的回顾性patch-train标签**，不能反向声称它是Phase 4.11当时授权的后继Product Phase。
- Phase 4.12适合采用历史模板的八段结构：position、problem、decisions、delivery、acceptance、non-goals、successor inheritance、one immutable snapshot。
- 文件名冻结为`docs/history/phase-4.12-v0.4.1-path-safety-patch-train.md`；索引放在4.11与4.13之间，摘要明确“不是新Product Phase”。
- 长期应保存的核心不是逐P9流水，而是四项关系：两条越界风险、topology/inventory分层、unknown regular cleanup保留、Windows+Linux/Cloud+published lifecycle闭合。
