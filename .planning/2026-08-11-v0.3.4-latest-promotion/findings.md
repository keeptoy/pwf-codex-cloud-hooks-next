# Findings: v0.3.4 Latest Promotion Closure

## Entry facts

- v0.3.4 immutable publication、公开下载复核和两条独立 Cloud hard acceptance 已闭合。
- 维护者报告已在 GitHub UI 将现有 v0.3.4 Release 从 Pre-release 改为 Latest；没有要求重建 tag、Release
  或资产。
- 当前仓库仍记录 v0.3.3 为 accepted/Latest，因此必须先做只读 postflight，再同步角色。
- 维护者选择新的协作边界：智能体负责本地实现、验证和重要阶段 commit；所有远端写操作由维护者负责。

## Process decision

- 对人按四步解释 Release：候选验证（包含本地与 Cloud source checkout）→ Pre-release publication →
  公开资产 Cloud 验收 → Latest promotion。
- 这四步是执行顺序；provenance、acceptance、ROADMAP 则分别回答“发布了什么”“公开包是否验收”“当前推荐谁”。
- 远端职责下放的主要收益是减少授权往返和等待时间，并避免智能体把本地完成误扩张为远端状态变更；
  token 减少是副作用，不应作为削弱校验或证据的理由。

## Read-only postflight evidence

- GitHub v0.3.4 Release 为 `isDraft=false`、`isPrerelease=false`；现有 Release 原地转正，没有重建身份。
- lightweight `refs/tags/v0.3.4` 仍指向 `59a999f705701ec67463649e9424f3d059863c81`。
- v0.3.4 bootstrap 仍为 21,565 bytes、SHA-256 `9a3df089720f4d2a3aefe5b6d12a567a23177fca7c5cab186aa9a8d52695cd40`；
  ZIP 仍为 77,777 bytes、SHA-256 `497e92a861bd7882129f05b28df1e23a55330db98bebe76891db5b9761bdec3b`。
- v0.3.3 两项公开资产的 filename/size/digest 也保持原 identity；尚需用修正后的只读 list 查询确认
  `isLatest=true` 明确落在 v0.3.4。
- 修正后的 Release list 明确返回：v0.3.4 `isLatest=true`、v0.3.3 `isLatest=false`，两者均为
  `isDraft=false`、`isPrerelease=false`。P0 结论为 pointer-only postflight PASS。

## Lifecycle rotation scope

- repository governance 已明确规定 promotion 与 eviction 是同一次 lifecycle rotation；promotion 可以先由
  维护者完成，但 eviction 未闭合前不得开启下一开发列车。
- 晋级后 candidate 与 accepted 都是 v0.3.4，因此当前树只保留
  `init-cloud-sandbox-v0.3.4.bash` 与 `docs/v0.3.4-cloud-hard-acceptance.md`。
- v0.3.3 降为 immediate fallback：删除本地 bootstrap/acceptance 不删除历史，完整文件由其 immutable
  tag/source/Release 恢复；provenance 中的相对 acceptance link 应改为 immutable source URL。
- publication oracle 从 v0.3.3/v0.3.2 旋转为 v0.3.4/v0.3.3；v0.3.2 退出默认 suite，继续留在 provenance
  和 immutable Release 中作为 deeper fallback。
- v0.3.3 最终 promotion acceptance 的 immutable commit 是
  `a65f889a1dacef4239951e284082ced9e2fcf03c`；删除当前树副本前，provenance/CHANGELOG 应改链到该 blob。
- `tests/bootstrap.test.js` 仍硬编码 v0.3.3 bootstrap/SHA；应改为从当前 package/Release contract 和 bootstrap
  默认值派生。`published-release-oracles.test.js` 也应从 ROADMAP 角色与 provenance 动态构造 accepted/fallback
  oracle，而不是每次 promotion 手改两组常量。
- `repository-boundary.test.js` 的 accepted 分支冻结了 v0.3.3 旧版自包含 runbook 形状；当前 v0.3.4 已采用
  template + thin immutable evidence 分工，应统一按通道完成状态验证，不再让“是否 accepted”决定文档格式。

## Closure findings

- current-tree 版本文件窗口精确收敛为 `init-cloud-sandbox-v0.3.4.bash` 与
  `docs/v0.3.4-cloud-hard-acceptance.md`；v0.3.3 的恢复 authority 已迁到 immutable source/Release/provenance。
- accepted + immediate fallback publication oracle 已改为从 ROADMAP 角色和 provenance 身份动态构造；下次
  promotion 不再需要复制两组手写版本常量，但仍逐项验证 tag/source、ZIP/bootstrap 与双向 ownership。
- sealed/production 路径没有工作树差异：package、installer、hooks、runtime、contracts、tools 与 v0.3.4
  bootstrap 字节都未改变；这次是 lifecycle/governance rotation，不是重新封包。
- README 的安装、doctor/repair 与开发命令没有因本次 promotion 过期，本次无需改写 README。
