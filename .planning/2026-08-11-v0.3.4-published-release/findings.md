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
