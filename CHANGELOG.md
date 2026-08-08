# 变更日志

本文件只摘要仓库中已经发生的版本变化。开发目标、跨 Phase 路线和当前 lifecycle 见
[`ROADMAP.md`](ROADMAP.md)；当前唯一行动与授权边界见活动 `task_plan.md`；精确 source、资产、大小和
SHA-256 见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md) 与对应 acceptance。

## Unreleased — 0.3.2-dev

`0.3.2-dev` 是 development source/package identity，不是 tag、Release 或 acceptance。

### Changed

- 将源码、package、Release contract 和 ZIP 外 zero-hash bootstrap 切换到独立的 `0.3.2-dev` 开发身份。
- README 只保留稳定行为与文档入口；新增 DESIGN，集中维护仓库模块、依赖、改动落点和验证路由。
- 建立“CHANGELOG 记录实际变化、ROADMAP 维护 programme/lifecycle、活动 task plan 控制当前行动、
  provenance/acceptance 冻结证据”的文档分层。

### Compatibility

- 没有改变 runtime、Host ABI、trusted graph、Hook 事件、安装行为或已发布资产。
- 后续目标与 Product Phase 授权状态只在 [`ROADMAP.md`](ROADMAP.md) 维护。

## v0.3.1

- 在同一 `0.3` 行为合同内完成兼容与供应链安全修复，没有新增 Hook、Host ABI 或 trusted graph。
- 外部 bootstrap 增加平台 Node.js 版本检查，并对 pristine PWF archive/subtree 执行固定来源校验。
- Release ZIP 加入 importer 的直接 patcher 依赖，使解压后的维护检查可以自包含运行；生产 runtime
  与激活图不变。
- 精确身份见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，最终字节与 Cloud A～F 证据见
  [`docs/v0.3.1-cloud-hard-acceptance.md`](docs/v0.3.1-cloud-hard-acceptance.md)。

## v0.3.0

- 建立 successor 仓库的首个稳定版本，保留已验收 canonical runtime 和 canary 行为。
- 发布 contract-driven ZIP 与独立 bootstrap，并完成最终下载资产和 Cloud 验收。
- 精确身份见 [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，验收证据见
  [`docs/v0.3.0-cloud-hard-acceptance.md`](docs/v0.3.0-cloud-hard-acceptance.md)。

## v0.3.0-beta.2

- 冻结旧仓库中被 successor 迁移采用的产品基线和行为 oracle。
- 其 source、双资产与验收字节保持不可变；精确身份见
  [`BASELINE_PROVENANCE.md`](BASELINE_PROVENANCE.md)，历史验收见
  [`docs/v0.3.0-beta.2-cloud-hard-acceptance.md`](docs/v0.3.0-beta.2-cloud-hard-acceptance.md)。
