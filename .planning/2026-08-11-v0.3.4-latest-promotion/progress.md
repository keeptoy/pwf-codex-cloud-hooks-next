# Progress: v0.3.4 Latest Promotion Closure

## 2026-08-11

- 维护者报告 v0.3.4 已从 Pre-release 晋级为 Latest，并要求固化四步 Release 流程与新的本地/远端交互纪律。
- 建立独立 promotion closure plan；当前只授权远端只读 postflight、本地文档/测试更新和自动本地 commit，
  不授权任何智能体远端写操作或 Product Phase 4。
- 首轮只读 postflight 已确认 v0.3.4 非 draft/非 prerelease、tag source 与双资产 size/digest 未漂移；v0.3.3
  双资产也未漂移。`gh release list` 因误请求不支持的 `url` 字段未给出 Latest 行，已记录并改用支持字段重查。
- 修正查询确认 v0.3.4 `isLatest=true`、v0.3.3 `isLatest=false`，且均非 draft/prerelease。P0 complete，
  promotion 是原地 metadata/role 切换，不涉及 tag 或资产重建；开始 P1 文档、角色和纪律更新。
- P1 complete：ROADMAP 固化“候选验证 → Pre-release → 公开包验收 → Latest”四步流程并完成角色旋转；
  acceptance/provenance 冻结 postflight；AGENTS 固化本地自动 commit 与维护者独占远端写操作的纪律。
- 按 retirement DoD 删除 current-tree 的 v0.3.3 bootstrap/acceptance；历史仍由 immutable v0.3.3
  tag、Release、source acceptance URL 与 provenance 恢复。当前窗口只保留 v0.3.4 两份版本文件。
- publication oracle 与治理测试改为动态消费 ROADMAP accepted/immediate fallback 角色；两轮测试缺陷修正后，
  聚焦 suite 为 21/21 pass。
- 完整 `npm test`：126 tests，114 pass、0 fail、12 个 Windows 上明确标记的 Linux/POSIX skip。
- `import_upstream_runtime.py check`、Python compile、`node --check install.js`、单独提权后的
  `bash -n init-cloud-sandbox-v0.3.4.bash` 与 `git diff --check` 全部通过。
- sealed/production 路径 diff 为空；未修改 package、installer、hooks、runtime、contracts、tools 或 v0.3.4
  bootstrap。P2 complete；本次收口由随后的本地 commit 承载，停止在远端 push 前。
