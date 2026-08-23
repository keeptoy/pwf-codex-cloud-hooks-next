# Progress: v0.4.2 Release closeout / candidate-readiness

## 2026-08-23

- 维护者确认继续下一步。
- 已把 active pointer 从完成的只读审计切换到本 Release closeout/candidate-readiness 计划。
- 当前停止点：Phase 1 authority recovery；尚未修改 production、contracts、package、bootstrap 或正式权威文档。
- 已完整恢复planning-with-files技能说明，并复读README、ARCHITECTURE、DESIGN与ROADMAP的Release/retirement边界；确认本任务不是Phase 9。
- 已读仓库治理指南与Operator Guide模板，完成25个planning scope的current入链扫描，并定位唯一待迁移的旧planning测试依赖。
- 已核对package、Release contract、installed-state transition、manifest和bootstrap身份传播；尚未实施正式文件变更。
- 已先更新候选角色/transition测试与旧planning证据依赖；聚焦runner首次被Windows sandbox以`spawn EPERM`阻断，已记录并改走单文件直接执行。
- 已完成candidate-readiness分类并把current测试的v0.4.1 P9-F证据依赖迁到immutable acceptance；本轮不批量删除planning。
- 已原子同步package 0.4.2、Release/transition contracts、manifest hashes、zero-hash bootstrap、CHANGELOG、ROADMAP与single-Discovery Release operator guide。
- 完整Windows runner PASS：180 tests / 154 pass / 0 fail / 26 skipped；skip仍全部为Linux/POSIX-only case。
- publication oracle聚焦复验PASS，确认transition中的v0.4.1 upstream canonical identity必须随accepted manifest精确轮转，不能只改version字符串。
- importer/compile/Node/Bash syntax、manifest hash、bootstrap delta与git静态检查PASS。
- v0.4.2候选双构建/check一致：22 entries、85,912 bytes、SHA-256 `4a059fa512a2c144cef42478d217935825ee7aca0599dca5582c62dd12df415c`；尚未seal、push或运行Cloud。
- 本地C0内容与Source/Candidate教程已准备完毕；exact commit hash由commit后的维护者handoff返回，避免文件自引用。
