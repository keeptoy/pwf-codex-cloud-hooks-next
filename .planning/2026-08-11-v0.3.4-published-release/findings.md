# Findings: v0.3.4 Published Release

## Entry facts

- 当前 machine/package 身份仍是 `0.3.4-dev`，development bootstrap 使用 64 位 zero hash 并 fail closed。
- Source/Candidate Cloud 已在 exact commit `dc20ef9133b1998e70e733f233e97c9ac8a0bc76` 完成 4.1、B-SC、C、D、
  E1/E2 与 9.1；Linux portable suite 为 120 pass、0 fail、0 skip。
- 已测 candidate ZIP 为 21 entries、77,782 bytes、SHA-256
  `87bff3eddb8c8f6431ddfd55f707e6ba02c31cf8c2d9fc822709b3967d10de09`。
- exact candidate 之后的已知提交只调整 history、planning、docs 和治理测试，均不在 Release ZIP allowlist；
  最近一次本地重建仍得到同一 ZIP 字节。
- 当前 accepted/rollback 角色仍是 `v0.3.3`，immediate fallback 仍是 immutable `v0.3.2`。

## Documentation decision

- `docs/cloud-hard-acceptance-template.md` 是唯一稳定双通道执行协议，不保存版本、进度、SHA 或 PASS。
- 活动 `.planning/<release-gate>/` 保存 seal 输入、URL/SHA、Next Step、PENDING/失败记录等可变施工事实。
- `docs/<release-identity>-cloud-hard-acceptance.md` 只保存已经完成的版本增量和双通道不可变证据；不复制
  模板脚本，也不保存执行进度表。
- development identity 收敛为 stable identity 时重命名同一份版本 acceptance，不同时保留 dev/stable 两份。
- ROADMAP 只维护 programme 角色、授权状态与稳定协议链接，不复制上述字段级分工或施工流水账。
- “本版本验收增量”是可选的验证差异索引，不是产品 changelog：只有新增/修改验证面时才写，并说明风险、
  模板 anchor/test/oracle 落点、B～E 提示词是否变化和完成证据；没有增量时整个章节省略。

## Release boundary

- Published Release 必须建立 stable identity 和最终 public bytes；Source/Candidate PASS 不能代替 tag、公开下载、
  startup 前 bootstrap 或独立 Fresh Cloud 证明。
- rollback/Latest promotion 是 Published Release 完成后的独立 lifecycle gate，不与 seal/publication 混为一次操作。
- README 的安装、doctor/repair、构建和稳定验证命令已与当前 CLI 对照，无需在本 gate 修改。

## R0 exact identity audit

- exact Source/Candidate commit 到当前 HEAD 的已提交差异只涉及 Architecture/Design/ROADMAP、cold history、
  planning、版本 acceptance 和治理测试；当前未提交的职责收敛也只涉及 planning/docs/tests/CHANGELOG/DESIGN/
  ROADMAP。两组差异均未命中 21-entry Release ZIP allowlist。
- 当前树重新执行 importer check、build/check 后仍得到 21 entries、77,782 bytes、SHA-256
  `87bff3eddb8c8f6431ddfd55f707e6ba02c31cf8c2d9fc822709b3967d10de09`，与 Cloud 已测 candidate 完全一致。
- R1 的 machine identity 链必须原子修改：`package.json.version` →
  `contracts/release-artifact-v1.json.package_version/external_release_assets` → 该 contract 的新 SHA 写入
  `upstream-manifest.json.managed_runtime.contracts.release_artifact.sha256`。`install.js` 从 package metadata 派生
  installer version，无需手工复制版本常量。
- 外部 bootstrap 从 `init-cloud-sandbox-v0.3.4-dev.bash` 重命名为 `init-cloud-sandbox-v0.3.4.bash`，默认
  `HOOKS_VERSION` 改为 `v0.3.4`；R1 仍保持 zero hash，直到 R2 双构建完成后才写最终 ZIP SHA。
- 版本 acceptance 同步重命名为 `docs/v0.3.4-cloud-hard-acceptance.md`，更新 title/anchors/ROADMAP 链接；
  dev/stable 两份不得并存。CHANGELOG heading 和 lifecycle 文字同步 stable candidate identity。
- identity-specific tests 主要位于 `release-package.test.js`、`published-release-oracles.test.js` 和 repository
  boundary；通用 contract tests 已校验 package/artifact/bootstrap 命名关系。
- `BASELINE_PROVENANCE.md` 只在 immutable publication 与重新下载证据成立后登记最终身份，不在 R1 预填。

## R0 verification

- architecture/repository focused governance：17 pass、0 fail。
- 完整 Windows suite：114 pass、12 个诚实的 POSIX/Linux skip、0 fail。
- importer check、Release build/check 与 `git diff --check` 均通过；尚未修改 stable identity、tag 或公开资产。

## R1 stable identity evidence

- package、Release artifact、bootstrap 与 acceptance 已收敛为 `0.3.4`/`v0.3.4`；旧 dev 文件从当前角色窗口
  删除，新 stable 文件各只保留一份。branch transport 仍可使用 `0.3.4-dev`，但不再是 machine/package identity。
- `contracts/release-artifact-v1.json` 新 SHA-256 为
  `26d6962155a7e35f4834a7aab3a5419c87a9f347e1316d5b2ff4a4f4a18c4ae4`，已写入
  `upstream-manifest.json.managed_runtime.contracts.release_artifact.sha256`；importer check 通过。
- `install.js` 继续从 `package.json` 派生版本；v0.3.3 → current → v0.3.3 roundtrip 证明 installed manifest
  记录 `0.3.4` 且 immutable v0.3.3 可以重新接管。
- lifecycle test 不再用 `-dev` 后缀推断 publication：当 candidate 与 accepted 不同时，stable candidate 仍按
  当前薄 acceptance/未发布边界验证；suffix 不再冒充 lifecycle authority。
- 两次 R1 ZIP build/check 逐字一致：21 entries、77,777 bytes、SHA-256
  `497e92a861bd7882129f05b28df1e23a55330db98bebe76891db5b9761bdec3b`。该值仅是 R1 候选构建结果；bootstrap
  仍为 64 位 zero hash，尚未 seal。
- focused identity/artifact/roundtrip/lifecycle suite 为 19/19 PASS；完整 Windows suite 为 114 PASS、12 个
  POSIX/Linux SKIP、0 FAIL；Bash syntax、Node syntax、importer check 和 `git diff --check` 均通过。
- 本机未安装 WSL distribution，Docker/Podman 也不存在；因此不能把 Windows 数字冒充 Linux 0-skip。
  R1 identity/local/double-build 已完成，但 Linux 子门槛仍 open，R2 被阻塞在计划内前置条件。

## R1 Linux evidence decision

- 维护者要求按最小改动重新评估重复 Cloud gate。R1 diff 证明 production `hooks/`、`runtime/`、`install.js`、
  `tools/` 与 runtime schemas 均未变化；ZIP 只改变 package version、Release contract identity 和跟随更新的
  manifest integrity SHA，外部 bootstrap 只改变 filename/default version。
- 已完成的 Source/Candidate Linux 120/120 与 B～E 行为黑盒仍绑定完全相同的 runtime/installer logic；R1
  Windows full suite、roundtrip、importer、Bash syntax 与双构建覆盖身份和完整性增量。
- 因此取消“R1 再跑一次完整 Linux/Source-Candidate”的重复门槛，增量风险评为低。不可取消的是 R2 本地
  deterministic seal，以及 R4 后从公开资产执行的独立 Published Release Cloud；后者验证此次真正新增的
  public URL/bootstrap/default ZIP 链。

## R2 sealed identity

- preflight 确认本地 `v0.3.4` tag、远端 `v0.3.4` tag 与 GitHub `v0.3.4` Release 均不存在，identity 未占用。
- R2 两次独立 build/check 逐字一致；final ZIP 为 `pwf-codex-cloud-hooks-v0.3.4.zip`，21 entries、
  77,777 bytes、SHA-256 `497e92a861bd7882129f05b28df1e23a55330db98bebe76891db5b9761bdec3b`。
- exact ZIP SHA 已写入 ZIP 外 `init-cloud-sandbox-v0.3.4.bash`；sealed bootstrap 为 21,565 bytes、SHA-256
  `9a3df089720f4d2a3aefe5b6d12a567a23177fca7c5cab186aa9a8d52695cd40`。
- sealed ZIP 保存在
  `C:\Users\Lenovo\AppData\Local\Temp\pwf-v034-seal-2c2cc8a30e654f3eb7832f4749c3dbfe\pwf-codex-cloud-hooks-v0.3.4.zip`；
  comparison ZIP 同目录保留到 publication audit。
- 封板后完整 Windows suite 为 114 PASS、12 POSIX/Linux SKIP、0 FAIL；Bash syntax/default checksum、
  Node syntax、importer check 与 `git diff --check` 均通过。
- 首轮 sealed suite 的唯一失败是 release-package 仍匹配旧 ROADMAP `stable candidate` 文案；同步为
  `sealed candidate` 后完整 suite 全绿，未更改任何产品或 SHA 安全断言。

## R3 publication audit

- sealed source commit `2c5ee17029af76e098e4f7da6ec01953ba03c535` 的 `git archive` 可独立重建同一
  ZIP `497e92…ec3b` 和 bootstrap `9a3df0…cd40`；不是只由脏工作树偶然生成。
- publication/Release/lifecycle focused suite 17/17 PASS；完整 suite 已在完全相同的 sealed source bytes 上
  114 PASS、12 Windows POSIX SKIP、0 FAIL。
- fetch 后确认 `origin/0.3.4-dev=dc20ef9`，`origin/main=f8ed6e1`。main 是合并 dc20 的 PR merge commit；
  `origin/main` 与 `dc20ef9` tree 都为 `aca8617…8ad2`，内容零差异，只是提交拓扑分叉。
- 本地用一次 contentless merge 把 main ancestry 纳入 sealed lineage；merge commit
  `1b69fd90852d2ec91c91c953e4f1b9b05d571482` 的 tree 与 merge 前完全相同，重新从 Git archive 构建仍得到
  exact ZIP/bootstrap SHA。
- R3 结论：source reproducibility、accepted/fallback oracles、identity vacancy、main ancestry 与 sealed
  bytes 全部闭合，可以进入 R4。尚未推送本地 commits、创建 v0.3.4 tag 或上传资产。

## R4 immutable publication

- 最终 tagged source 为 `59a999f705701ec67463649e9424f3d059863c81`；`0.3.4-dev` 与 `main` 都已
  fast-forward 到该 commit，lightweight `v0.3.4` tag 指向同一 source。
- GitHub `v0.3.4` 已作为公开 prerelease 创建，避免在 Published Release Cloud 前移动 Latest：
  `https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.3.4`。
- 公开 ZIP URL 为
  `https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/download/v0.3.4/pwf-codex-cloud-hooks-v0.3.4.zip`；
  21 entries、77,777 bytes、SHA-256 `497e92a861bd7882129f05b28df1e23a55330db98bebe76891db5b9761bdec3b`。
- 公开 bootstrap URL 为
  `https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/download/v0.3.4/init-cloud-sandbox-v0.3.4.bash`；
  21,565 bytes、SHA-256 `9a3df089720f4d2a3aefe5b6d12a567a23177fca7c5cab186aa9a8d52695cd40`。
- 两项资产已从公开 URL 重新下载到
  `C:\Users\Lenovo\AppData\Local\Temp\pwf-v034-public-b17daac0cd4b40df8696062a941beb0f`，filename/size/SHA
  均与 seal 一致；下载 ZIP 的 builder check、self-contained importer check 与 Node syntax 通过。
- R4 只建立 immutable published bytes，不证明独立 Fresh Cloud；v0.3.3 继续承担 accepted/Latest，R5 是当前
  唯一 Next Step。

## R5 Published Release Cloud

- 维护者确认在独立 Cloud 环境完整执行模板 4.2、B-PR、C、D、E1/E2 与 9.2，最终脚本退出码为 0；该通道
  使用公开发布资产，不复用 Source/Candidate 的本地 override 或安装状态。
- 9.2 从公开 URL 重新下载 `pwf-codex-cloud-hooks-v0.3.4.zip`：77,777 bytes，SHA-256
  `497e92a861bd7882129f05b28df1e23a55330db98bebe76891db5b9761bdec3b`，`sha256sum`、21-entry builder check
  与 self-contained importer check 全部通过。
- importer 报告四个 upstream runtime 全部 pristine：`inject-plan.sh=72c7904…0364`、
  `ledger-summary.sh=d4fe626…3b9`、`resolve-plan-dir.sh=38a1c5e…e9bd`、
  `session-catchup.py=6476fd9…e6de`。
- installed package identity 为 `0.3.4`；doctor 返回 `healthy=true`、`repairable=false`、managed=true、
  SessionStart/UserPromptSubmit、零 errors/blockers。
- installed runtime inventory 为 exact 10 项；其中 4 项 upstream pristine，managed policy 为
  `ADAPTER_ONLY`，没有 overlay，snapshot leftovers 为 0。
- 最终原始标记为 `POST_RESUME_DOCTOR=PASS`、`PWF_PUBLIC_ZIP_BOUNDARY_IMPORTER=PASS`、
  `PWF_PUBLIC_POST_RESUME=PASS` 与 `SNAPSHOT_LEFTOVERS=0`。R5 已满足，可以只做 R6 evidence close；该结论
  不授权 Latest/rollback promotion 或 Product Phase 4。
- R6 治理断言从 ROADMAP 的明确 publication 角色判断通道状态，并从 provenance、Release artifact 与 runtime
  bundle 动态派生 source、资产名/SHA、ZIP entry count、installed inventory 和 pristine hashes；不把 v0.3.4
  的一次性数字再写成未来版本必须手改的第二份状态常量。
