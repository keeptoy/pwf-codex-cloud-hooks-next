# 维护者交割手册

## 1. 接手前五分钟

1. 确认仓库、branch 和 dirty state：`git status --short --branch`。
2. 按 `AGENTS.md` 阅读 README、ARCHITECTURE、ROADMAP。
3. 打开 `.planning/.active_plan` 指向的三份 planning 文件。
4. 运行 `python3 tools/import_upstream_runtime.py check`。
5. 运行与平台相符的 suite，确认没有未知 cache/drift。

不要从旧对话、Release filename 或 upstream 脚本存在性推断当前授权和支持范围。

## 2. 当前事实

- 产品 rollback：published/accepted stable `v0.3.0`；beta.2 为不可变 previous fallback。
- 当前稳定身份：`v0.3.0` tag 精确指向 `1454c922...`，两个资产、Cloud setup、Fresh、canonical、
  real Resume、doctor、11 payload 和零 residue 全部 PASS。
- 当前版本路线：stable Release 已关闭；Product Phase 4 前另行授权的 0.3.1 security-fix train 已完成
  S1、S2 Linux/Cloud hard acceptance 与 S3-A 本地 immutable seal。当前等待 S3-B publication 授权；
  tag、publication、S3-C downloaded-asset/Cloud acceptance 与 rollback promotion 尚未授权。
- 当前仓库迁移：M1/M2/M3/M4 complete。M3 实际行为测试 HEAD 为
  `39795283cd65f84547651d7bec816191fb5bfedf`，ZIP SHA-256 为
  `82770964b938b14eea74394a4e99957e0b3f63e0a4477fbea49fd3730a31e508`；M3-B setup、Fresh、
  canonical、Resume 和 doctor 全部 PASS。M4-C no-live cutover/rollback 验收 HEAD 是
  `main@0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151`；development/audit evidence refs
  未移动，两个 active integrity ruleset 只禁止 deletion 与 non-fast-forward。successor 已成为
  后续源码维护权威；旧仓库继续承载不可变 beta.2 previous fallback。Product Phase 4 仍未授权。
- M1 audit branch：`audit/beta2-exact`，不得移动或重写。
- Product Phase 4：未开始、未授权；必须等待 stable v0.3.0 S3 关闭后再独立 Discovery。
- 生产集成：只支持 PWF v3.8.2 的两个 Managed Hook events。

## 3. 日常健康检查

```bash
git status --short --branch
python3 tools/import_upstream_runtime.py check
node --check install.js
python3 -c "from pathlib import Path; [compile(p.read_text(encoding='utf-8'), str(p), 'exec') for p in map(Path, ['hooks/hook_adapter.py','runtime/owned-plan.py','runtime/owned-catchup.py'])]"
npm test
git diff --check
```

Linux/Cloud 再加：

```bash
bash -n init-cloud-sandbox-v0.3.0.bash
bash -n init-cloud-sandbox-v0.3.1.bash
git ls-files --stage runtime/upstream
```

四个 upstream runtime 必须是 `100755`。Windows 修复方法见 `docs/git-file-modes.md`。

## 4. 变更分类

| 类型 | 典型文件 | 最小验证 |
|---|---|---|
| 文档-only | README、ARCHITECTURE、ROADMAP | UTF-8、links、fences、`git diff --check`、相关 doc contract tests |
| fixture/test name | `tests/fixtures`、test modules | fixture hash/bytes、focused tests、full suite |
| provenance metadata | overlay、manifest、baseline | JSON parse、hash chain、contracts/importer/patcher/installer tests |
| installer | `install.js`、manifest/inventory | full installer/doctor/repair/uninstall + isolated install |
| runtime/schema | adapter、owned children、schemas | focused safety tests + full suite + Linux/Cloud gate |
| Release | allowlist、builder、bootstrap、version | deterministic double build + asset/hash + fresh Cloud |
| activation/cutover | policy/event/branch/main/Release | Discovery checkpoint + explicit maintainer authorization |

如果变更跨 schema、Host ABI、trusted graph、timeout、process、permission 或 rollback，先停下来做
Discovery，不以“顺便改完”代替设计审批。

## 5. Source/runtime 更新

1. 固定新的 upstream release/commit/archive SHA；
2. 审计 canonical scripts 和 direct dependencies；
3. 更新 runtime bundle 与 overlay anchors；
4. 用 importer 在临时 destination 复现；
5. 只接受 allowlist 文件，拒绝 unknown destination content；
6. 更新 upstream manifest 的全部受影响 hashes；
7. 跑 patcher/importer/contracts/installer/runtime suite；
8. Linux/Cloud 验证 mode、permission、process-group 和真实 Host data。

不要直接编辑 `runtime/upstream/` 后把新字节当成来源；它必须能从 pinned archive 重建。

## 6. Installer/doctor 处理

Doctor 输出先分类：

- `healthy=true`：记录版本、events、inventory；
- `repairable=true`：只预览 owned repair，再执行；
- blockers/unknown drift：停止，不覆盖现场；
- manifest owner/version/schema 不符：按 upgrade/rollback 设计处理，不伪装为 repair。

安装测试必须覆盖 dry-run、merge、idempotence、cross-user read、repair boundary、backup 和 uninstall。

## 7. 测试失败分类

1. Product defect：实现没有满足 contract/security goal；修实现并补回归。
2. Test defect：断言误把 reporter/platform/zombie 等表象当产品语义；先用只读证据证明。
3. Platform limitation：Windows 无 POSIX primitive；诚实 SKIP，交给 Linux/Cloud gate。
4. Fixture drift：fixture 与冻结 Host/schema 不一致；验证来源后更新 fixture/contract。

不得仅为 test count 或绿色结果弱化 identity、containment、hard-link、race、timeout、cleanup、drift
或 output-budget 断言。

## 8. Candidate/Release ZIP

```bash
ZIP="$(mktemp --suffix=.zip)"
python3 tools/build_release.py build --output "$ZIP"
python3 tools/build_release.py check --archive "$ZIP"
unzip -Z1 "$ZIP"
sha256sum "$ZIP"
```

当前 0.3.1 本地封板候选：23 entries、82,725 bytes、ZIP SHA-256 `f097b040...31f9`；固定 package
identity/root/order/mode/metadata，importer 与 patcher 同时存在，bootstrap external。bootstrap 已固定
该 ZIP，21,565 bytes、SHA-256 `ce31a320...a5e8`。这些是 S3-A 本地证据，不是 tag、Release、下载验收
或 rollback 身份；任何 ZIP 输入变化都必须使本次 seal 失效并重新开始。已发布 v0.3.0 仍是独立的
22-entry immutable oracle，不从候选工作树重建或覆盖。

## 9. 正式 Release

只有 ROADMAP/task plan 明确授权时：

1. 冻结 version、source、contracts、tests 和 ZIP allowlist；
2. Linux/Windows/Cloud gate 全绿；
3. 构建两次 ZIP 并证明字节一致；
4. 计算 ZIP SHA，写入外部 bootstrap；
5. 计算 bootstrap SHA；
6. 在已验收的 exact release source 创建新的 tag/Release，上传两个独立资产；
7. 从 Release 页面重新下载并核对 SHA；
8. fresh Cloud install、Fresh/UserPrompt、real Resume、doctor；
9. 记录 immutable acceptance 文档和 rollback。

不要重用 beta.2 asset name/hash，也不要用 moving branch/latest URL。

## 9.1 M4 仓库切换

M4 的完成证据在 `docs/beta3-dev-m4-cutover-plan.md`。实际 accepted main 是 `0b4bd7d...`；
Cloud-tested development 与 audit refs 保持不动，旧仓库继续承载 beta.2 Release 和 previous fallback。
后续正常 main 治理提交不会改写这次 accepted SHA；若要重新执行历史 M4-C 唯一脚本，应使用记录的
验收 commit，而不是把新 main HEAD 冒充成旧验收输入。

## 10. 回滚

迁移/开发失败：保持 M1 audit oracle；移除的只能是已验证的临时 worktree/local unpublished branch，
禁止 `git reset --hard` audit ref。

Production 回滚：优先使用 successor 已发布/接受的不可变 v0.3.0 ZIP/bootstrap，并按其
hard-acceptance 复核。beta.2 只是 previous fallback；需要再退一级时，使用旧仓库不可变资产、重新
核验两个 SHA，并按 beta.2 acceptance 执行 install/doctor/Fresh/Resume。回滚不得依赖当前 0.3.1
候选或 development branch 先被修好。

## 11. 交接完成标准

新人应能回答：

- 当前唯一 Next Step 在哪里？
- 哪个版本是 production rollback，哪个只是 dev？
- global Skill 与 owned runtime 的边界是什么？
- overlay 如何从 upstream 复现？
- 什么情况可以 repair，什么情况必须 blocker？
- 为什么 bootstrap 在 ZIP 外？
- 哪些 case 必须在 Linux/Cloud 验证？
- 如何在不移动 audit ref 的情况下回滚迁移？
