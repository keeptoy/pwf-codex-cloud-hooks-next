# Findings: v0.3.3-dev Pristine Catch-up Runtime

## Inherited evidence

- Phase 1 的四项 overlay 只修改 upstream catch-up CLI 的 session selection、runtime inference、planning guard
  与 CLI rendering；Phase 2 owned wrapper 从首次激活起即不调用这些分支。
- Managed/pristine pinned source 的四个 helper roots 及 15-helper transitive closure 相同，与 patched symbols
  和 `main()` 的交集为空。
- Phase 3 private snapshot 属于 plan invocation strategy，只是避免新增第二组 plan overlay；catch-up overlay
  的替代机制是 Phase 2 validated/frozen transcript、explicit runtime/project state 与 owned renderer。
- 动态加载完整 module 会执行 `configure_utf8_stdio()` 和 optional `orjson` import；Route B 必须测试该真实
  import-time surface，不能宣称只加载四个函数字节。

## Selected route

Route B：保留 pinned pristine full `session-catchup.py`，显式冻结 owned helper allowlist/closure；删除 current
patcher、active overlay ledger 与 patched manifest chain。Published v0.3.2 的 overlay identity只保留在 cold
provenance 与 immutable refs，不在 current tree 保存可执行博物馆副本。

## Closed checks

- candidate/accepted 两席窗口已冻结为 v0.3.3-dev Source/Candidate + published v0.3.2 accepted；新 bootstrap
  保持 64 位 zero hash 并 fail closed，未改变发布角色。
- importer contract 已在原 contract family 内统一四项 `upstream_pristine`，拒绝 non-pristine origin、managed
  hash 分叉和任何 overlay declaration，不需要扩大 Host ABI 或 schema migration。
- `skill-patch.test.js` 的通用 bootstrap/global-Skill 安全断言已迁入 `bootstrap.test.js`；patch-specific 行为由
  importer fail-closed 与新的 pristine helper boundary 取代，不保留可执行历史 fixture。

## G6 pre-release inventory（2026-08-10）

- `.planning` 下四个历史 scope 目录的 direct item 与 recursive file 计数均为 0：
  `2026-08-09-architecture-contract-retention`、`2026-08-09-history-retention-governance`、
  `2026-08-09-v0.3.2-baseline-promotion`、`2026-08-09-v0.3.2-release-cloud-acceptance`。
- 唯一活动 scope `2026-08-10-pristine-catchup-runtime` 含 `task_plan.md`、`findings.md`、`progress.md`，不得删除。
- 本轮只删除上述已验证空目录，并重新生成未封板的本地 development ZIP；不写入 bootstrap checksum，
  不创建 tag/Release，也不改变 accepted/rollback 角色。
- G6 双构建均产生 21 entries、74,206 bytes、SHA-256
  `40e3e134aa4d9a7f452a2447f4aa9026af479882c9b7f78074fc9e3370646182`；结构化 byte-array 比较为 true，
  两次 contract check 均 `healthy=true`。只保留 `dist/pwf-codex-cloud-hooks-v0.3.3-dev.zip`。

## Post-gate ARCHITECTURE ↔ source audit（2026-08-10）

- 本轮只审计当前 `ARCHITECTURE.md` 是否准确描述 v0.3.3-dev source、contracts、installed layout、runtime
  dispatch、失败语义与 Release boundary；`ARCHITECTURE-old-0.3.2.md` 只作 immutable 历史对照，不参与结论。
- 第一轮文档/contract 对照确认：Managed policy 单 adapter、plan-first、六字段 project 转交、catch-up exact-v1
  request/result、20,000 字符预算和 child failure 降级均在当前 schema 与 adapter validator 中有直接对应。
- 仍需用函数级源码和 installer/manifest/Release inventory 反证部署图、transcript fallback 顺序、private
  snapshot、helper closure、deadline/process cleanup 与 installed file list，未完成前不宣称完全一致。
- Adapter 实际顺序为：先取得并验证 plan result，且仅在 `inject=true` 的 `SessionStart` 才把该 result 的六字段
  project 原样放入 catch-up request；catch-up 成功后最终 context 才按 canary → report → plan 拼接。该行为与
  Runtime 数据流和失败语义一致，但“调用顺序”与“最终输出顺序”需要继续保持明确区分。
- 发现一处文档精度歧义：ARCHITECTURE §6 把三类 fallback root 列成 transcript“选择顺序”，源码实际是按
  `CODEX_SESSIONS_DIR` → `$CODEX_HOME/sessions` → installed-layout 推导构造/去重最多三个 allowed roots，随后
  汇集其中最多 256 个受控候选并按 `mtime_ns` 全局倒序寻找第一个 session/project 匹配项；并非前一 root
  无匹配后才进入后一 root。Host validated path 仍保持绝对第一优先。
- Machine inventory 反证当前 Release contract 有 21 个 allowlisted source entries，installed runtime 则由
  installer 收窄为 adapter、两个 owned runtimes、四个 pristine upstream files、两个 plan contracts、
  `THIRD_PARTY_NOTICES.md` 与生成的 `installed-manifest.json`。ARCHITECTURE §3 的 installed tree 未画出 notice，
  属于简化图中的实际 inventory 漏项；DESIGN §3 已包含 notice，二者应统一。
- Runtime bundle/manifest 已证明四个 upstream `origin=upstream_pristine`、managed/pristine SHA 相等、
  `overlay_ids=[]`；Release ZIP 还包含 importer、builder、全部五份 machine contracts、README/package/install
  等维护输入，但这些不会全部进入 installed runtime。ARCHITECTURE 的 source/build/install 分层方向正确。
- Installer 源码确认 Managed policy 只生成两个指向 `/usr/bin/python3 <absolute adapter> <event>` 的 handler，
  timeout 为 30 秒；adapter 自身共享 deadline 为 27 秒并保留 1 秒 finalization reserve。`owned-plan.py` 和
  `owned-catchup.py` 从未直接注册到 policy。ARCHITECTURE §3/§8 与该真实边界一致。
- Install/doctor/repair 对 runtime inventory、hash、mode、manifest owner/version/upstream、requirements owned/
  unowned hash 和 unknown entries 均有 fail-closed 检查；repair 只在 blocker 为空时重写已拥有字节，uninstall
  先备份再移除 owned requirements block/runtime。ARCHITECTURE §8/§10 的失败和所有权口径一致。
- Importer 仅处理 runtime bundle 的四个 pristine upstream files，验证 archive/license/source hash、mode、
  symlink 与 exact destination inventory；Release builder 则按独立 allowlist 打包 21 个 source entries。
  二者确实属于不同维护面，且均不进入 production dispatch。

### Audit conclusion

- 当前 ARCHITECTURE 的核心逻辑与 source/contracts 一致：plan-first、adapter-thin、project exact forwarding、
  private snapshot、owned catch-up、pristine helper closure、adapter-only policy、fail-open advisory composition、
  fail-closed integrity/content、deterministic Release 与 external bootstrap 边界均有直接实现和测试证据。
- 本轮没有发现 production code defect、Host ABI 漂移或 trusted graph 漂移；只修正三处文档精度：主部署图
  补 deterministic ZIP layer 与 installed notice、Runtime 图区分 canary 准备和最终单次输出、fallback roots
  区分 trust-root construction order 与跨根 newest-session selection。
- `ARCHITECTURE-old-0.3.2.md` 未修改，也没有被现行 authority 引用；v0.3.2 冷历史与 v0.3.3-dev 当前事实
  继续隔离。
