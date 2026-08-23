# Progress: retirement link-integrity rule

## 2026-08-23 — Entry

- 维护者要求把上一轮暴露的断链风险提升为通用清退规则。
- 已完整读取planning-with-files skill并运行session catchup；上一清退plan已关闭且工作树干净。
- 已定位唯一authority为repository-governance-guide第11节retirement DoD；现有规则缺少pre-delete inbound-reference inventory与post-delete broken-link复扫。
- 首次正文/测试补丁因编排字符串展开正则换行而被整体拒绝；改用bounded断言后重放，未产生部分修改。

## Current Status

`RETIREMENT_LINK_INTEGRITY_RULE_IMPLEMENTATION`

## 2026-08-23 — Focused-test correction

- 首轮 focused test 仅最后一条历史文字断言失败：字符距离上限没有容纳正文换行与缩进。
- 正文规则无误；断言已改为精确句子，只对排版换行使用 `\s+` 容忍。

## 2026-08-23 — Validation

- focused governance contract：1 test / 1 pass / 0 fail。
- 完整 `npm test`：180 tests / 154 pass / 0 fail / 26 platform skips。
- `node --check tests/repository-boundary.test.js` 与 `git diff --check` 均通过。
- 改动仅限治理指南、repository boundary contract与本次planning；production、contracts、package和Release inputs未变。

## 2026-08-23 — Closeout

- 已创建单一职责本地治理commit，未执行push或任何远端写操作。
- postcommit `node tests/repository-boundary.test.js`：13 tests / 13 pass / 0 fail。
- 当前任务完成；后续只有维护者按需push。
