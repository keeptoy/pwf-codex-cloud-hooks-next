# Progress: v0.3.4-dev Runtime-contract Metadata Cleanup

## 2026-08-10

- 完成字段引入历史、测试消费者和 production 读取路径审计；M0 PASS。
- 维护者授权只处理这两个 programme metadata 字段；开始 M1 successor identity。
- 建立 package/Release contract、zero-hash bootstrap、pending acceptance、ROADMAP/CHANGELOG 的
  v0.3.4-dev Source/Candidate identity；M1 PASS，尚未修改 runtime bundle。
- Release/repository guards 已区分 zero-hash `-dev` candidate 与已完成 stable acceptance；当前 candidate
  不再冒充 published v0.3.3 字节。
- 新 contract guard 冻结四个 exact id/source，并明确禁止 bundle/local/upstream entries 携带
  `activation_phase` 或顶层 `deferred_upstream_candidates`；等待 failing-first 执行。
- Failing-first `node tests/contracts.test.js` 仅因顶层 deferred 字段仍存在而失败，符合预期；M2 PASS。
- 已从两个 local entries、四个 upstream entries 删除 `activation_phase`，并删除顶层 deferred 列表；
  files、dependencies、hashes、modes 与 runtime bytes 未改。
- Integrity test 随后只报告旧 runtime-bundle hash；已将 upstream manifest 更新为
  `d707a65d6f0d6c5229cd9b4a03c76a2377b97a14411a8a2c5ecf76432d7e3567`，M3 PASS。
- 首轮 focused 并行执行中，contracts/repository 各发现一个 v0.3.3 identity 硬编码；其余 Git/Python child
  因 sandbox `status=null` 未执行断言。已修正硬编码，下一步沙箱外串行复验。
- focused 复验仅剩 lifecycle authority guard 失败：旧断言把 candidate 与已发布 accepted/fallback 一并要求写入
  `BASELINE_PROVENANCE.md`。已修正为未发布 candidate 必须留在 published provenance 账本外，避免污染冷证据权威。
- dev acceptance 原样引用最终 PASS marker，导致 pending guard 正确拒绝；已改成普通文字，不预填任何机器验收标记。
- focused 16/16 PASS；完整 `npm test` 为 96 tests、84 PASS、12 Windows platform SKIP、0 FAIL。
- importer check、Python compile、`node --check install.js`、两个 bootstrap 的 Git Bash `bash -n`、四个 upstream
  Git `100755` mode 与 `git diff --check` 全部通过。
- 两次独立 ZIP build/check 均为 21 entries、73929 bytes、SHA-256
  `5b7d0e8de08a3e89e63e311fca3ab29558a73a98122e1024a6e47def24643205`；开发 bootstrap 保持 64 位 zero hash。
- bundle/release contract hash 与 upstream manifest 对齐；production inventory、runtime bytes、Host ABI 与 dispatch 未变。
- M4 PASS；结论：`V034_CONTRACT_METADATA_CLEANUP_PASS / CLOUD_PENDING / PHASE4_NOT_AUTHORIZED`。
- 维护者要求自行控制 completed planning 删除节奏；已按 HEAD 原字节恢复
  `2026-08-10-current-tree-cleanup` 的 task/findings/progress，`.active_plan` 仍指向本 scope。
- 治理指南改为 active pointer 只选择唯一活动 scope，completed scope 的删除必须由维护者另行决定；repository
  guard 继续校验所有保留 scope 都有完整三文件，但不再强制 current tree 只能存在 active scope。
- 删除 `root architecture history snapshots leave the current tree` 整条 tombstone test；没有恢复旧
  `ARCHITECTURE-old-*` 文件。
- M5 focused repository suite 9/9 PASS，旧 scope 与 HEAD 完全一致，Node syntax 与 `git diff --check` PASS。
