# Progress: v0.3.4 Published Release

## 2026-08-11

- 维护者授权进入 Published Release gate。
- 建立独立 Release planning scope，并把 `.planning/.active_plan` 切换到本计划。
- 开始 R0：固化 template / active planning / version acceptance 三层职责，清除版本 acceptance 中的动态进度账本。
- template 现为唯一稳定执行协议；活动 plan 保存施工状态；版本 acceptance 只保存已完成的不可变证据；
  ROADMAP 只保留宏观授权、lifecycle 与模板职责链接。
- exact Release input 审计确认当前 docs/planning/tests 改动不进入 ZIP；重建 candidate 仍为 21 entries、
  77,782 bytes、SHA-256 `87bff3eddb8c8f6431ddfd55f707e6ba02c31cf8c2d9fc822709b3967d10de09`。
- 冻结 R1 identity 链：package version、release artifact/其 manifest integrity SHA、bootstrap rename/default、
  acceptance rename、lifecycle docs 与 identity-specific tests；最终 ZIP SHA 留给 R2。
- focused governance 17/17 PASS；完整 Windows suite 114 PASS、12 POSIX/Linux SKIP、0 FAIL；importer 与
  Release build/check PASS。
- R0 完成，Next Step 为 R1；尚未创建 tag、修改 stable machine identity、写入最终 bootstrap SHA、发布资产或
  执行 Published Release Cloud。
- 按维护者复核补充 R0 文档细节：4.1 明确 `PWF_ACCEPTANCE_NODE_MAJOR` 必须从系统 Environment variables
  设置注入；模板新增可选“本版本验收增量”写法，v0.3.4-dev 用 4.1/9.1 anchor 和完成输出说明本次增量，
  明确 B～E 提示词未改变。该微调不改变 R1 Next Step 或 Release 字节。
