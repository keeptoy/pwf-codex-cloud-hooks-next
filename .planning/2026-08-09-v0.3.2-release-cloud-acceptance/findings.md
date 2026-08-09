# Findings: v0.3.2 Release and Cloud Hard Acceptance

## Initial Facts

- `0.3.2-dev-extend@809bdf3` 已 non-force push；`0.3.2-dev` predecessor branch 未移动。
- 当前 package 与 Release contract identity 仍为 `0.3.2-dev`；外部 v0.3.2 bootstrap 使用 64 位 zero hash，
  因此会 fail closed，尚不是可发布资产。
- Release ZIP 由 `contracts/release-artifact-v1.json` 的 23-entry exact allowlist 构建；bootstrap 在 ZIP 外。
- `v0.3.1` 仍是 production rollback 与 GitHub `Latest`；发布 v0.3.2 和晋级 v0.3.2 是两个独立 gate。

## Questions to Freeze in R0

- stable identity 要同步哪些 source/contract/docs/tests，哪些文件实际进入 ZIP byte graph？
- tag 必须指向哪个 source commit，Release body 与 acceptance 如何引用该 exact commit？
- Windows 可以完成哪些 local gates，哪些 Linux/Cloud gate 必须诚实等待维护者回传？
- v0.3.2 的 Cloud 矩阵复用 v0.3.1 哪些步骤，又新增哪些 0.3.2-specific assertions？

## Non-goals

- 不新增 Hook、Host ABI、trusted graph 或 Product Phase 4 能力。
- 不改写 v0.3.1/v0.3.0/beta.2 的 tag、资产、SHA 或 acceptance。
- 不在 Cloud PASS 前把 v0.3.2 标为 accepted、rollback 或 `Latest`。

## R0 Release Contract Evidence

- `package.json.version` 与 `contracts/release-artifact-v1.json.package_version` 都是 `0.3.2-dev`；builder 会
  交叉校验两者，stable promotion 必须同步修改并更新当前 candidate tests。
- v0.3.2 bootstrap 已固定未来 tag、asset name、immutable Release URL 与 PWF/PowerShell prerequisites，
  但 `HOOKS_SHA256` 仍为 64 位 zero hash；它现在正确 fail closed。
- 开发 ZIP 测试已保护 23-entry allowlist、双构建确定性、bootstrap external、importer+patcher 自包含、
  LF 和 extracted importer replay；stable seal 应把这些断言从 dev identity 转为 v0.3.2 final identity。
- README 只提供 development ZIP 构建入口并明确本地 hash 不等于 seal。正式顺序必须继续由 Release contract、
  ROADMAP 和本 acceptance 共同约束，不能直接把首次本地 ZIP 上传。

## v0.3.1 Release Oracle

- v0.3.1 把 local seal、immutable publication、public-byte Cloud smoke 和 rollback/Latest promotion 分成
  独立 gate；v0.3.2 必须保留同样分离，维护者当前 Cloud 测试只覆盖 publication 后 acceptance。
- v0.3.1 tag `9aa2148...` 指向 sealed source；最终 ZIP hash 写入外部 bootstrap 后才提交/tag，Release
  恰好上传 ZIP 与 bootstrap 两个资产，并在下一 gate 重新下载验证。
- v0.3.1 acceptance 同时保留 source/candidate 历史和 published-release 通道，导致篇幅较长。v0.3.2
  新文档应从一开始区分“发布前本地 seal 记录”“公开资产 setup”“B～F 黑盒步骤”“结果/晋级待定”，
  避免把 pending 状态写成已发生事实。
- Cloud setup 应只消费固定公开 bootstrap URL+SHA；bootstrap 再下载固定 ZIP。setup 的静态 probe 不能
  代替 agent 阶段 Runtime 自动注入，Fresh、canonical planning、long tail、real Resume 和 doctor 都要
  在 setup 后的新 task 中验证。

## R0 Decision

- exact remote probe 确认 `refs/tags/v0.3.2` 为空，GitHub `v0.3.2` Release 不存在；没有不可变身份碰撞。
- 相对 v0.3.1，ZIP 内 runtime、installer、importer、patcher 与 runtime contracts 无变化；变化的 ZIP
  输入只有 README、package/Release identity 和相应 upstream-manifest contract hash。v0.3.2 是治理/
  文档一致性 patch，不宣称新生产行为。
- v0.3.2 external bootstrap 与 v0.3.1 除 target version 和项目 ZIP hash 外一致；不需要新 bootstrap
  架构，只需在 final seal 时把 zero hash 替换为 R2 冻结 ZIP 的精确 SHA。
- R0 结论：`GO` 进入 R1 stable identity。R1 应合并两个 Unreleased CHANGELOG 层为 v0.3.2 actual delta，
  将 ROADMAP 标为 Release candidate 但保持 v0.3.1 accepted，并生成所有结果默认 PENDING 的 acceptance。

## R2 Local Seal Candidate

- 完整 Windows-local suite 为 88 tests、76 PASS、12 POSIX/Linux-only SKIP、0 FAIL；这不是 Linux/Cloud
  证据，但本版本没有 production runtime/installer 行为变化，最终公开资产仍必须完成 Cloud gate。
- importer check、Python compile、`node --check`、四个 upstream `100755` modes 与 `git diff --check`
  PASS。复用 tests 的 D: Git Bash resolver 后，两个 bootstrap 的 `bash -n` 也在沙箱外 PASS；首次 C:
  固定路径探测是 probe scope error，不是平台缺失。
- 两份独立 pre-seal ZIP 完全一致：23 entries、82,627 bytes、SHA-256
  `b42aecafaba650e5595acef8c138d142747da38dde04fa78bfb0a7f4235e5081`。
- 23 个 staged ZIP inputs 均无 unstaged drift；path+mode+index-blob ledger SHA-256 为
  `37849a30196d51bfa93d9ec1cb529df6307231ef960037900806971eded28a51`。
- R2 结论：`GO` 进入 R3。acceptance/planning/tests 的后续变化均在 ZIP 外；任何 README、package、
  manifest、contract、runtime、installer、importer 或 patcher 变化都必须使 R2 失效并重新构建。

## R3 Final Bytes

- 最终 ZIP 仍为 R2 冻结字节：`pwf-codex-cloud-hooks-v0.3.2.zip`，23 entries、82,627 bytes、SHA-256
  `b42aecafaba650e5595acef8c138d142747da38dde04fa78bfb0a7f4235e5081`。
- 外部 bootstrap 仅将 zero hash 替换为上述 ZIP SHA；最终 21,565 bytes、SHA-256
  `aa2c1fd64bfc8ee3804d5f4bf39f7816a2ca9ad9a96949336ec94a6c20f8f77c`。
- final-hash focused 25/25 PASS，完整 suite 88 tests / 76 PASS / 12 Windows/POSIX SKIP / 0 FAIL，
  v0.3.2 bootstrap `bash -n` PASS，exact-name ZIP build/check/hash PASS。
- R3 结论：`GO` 进入 R4。R4 只能 fast-forward sealed source、创建新 tag/Release 和两个新资产；不得
  改 ZIP/bootstrap 字节、设为 Latest、覆盖旧资产或把 publication 冒充 Cloud acceptance。

## R4 Immutable Publication

- sealed source `c68a53bdeab7c38badcfb4e2a733ddd851e498e4` 已 fast-forward push；新 lightweight tag
  `v0.3.2` 精确指向该 commit。
- GitHub Release `v0.3.2` 非 draft、非 prerelease，显式 `latest=false`，恰好包含 82,627-byte ZIP 与
  21,565-byte bootstrap；服务端 digest 与本地冻结 SHA 一致。
- 从固定公开 URL 重新下载双资产后，filename/size/SHA、23-entry builder check 和 extracted importer
  replay 全部 PASS；GitHub `Latest` 复核仍为 `v0.3.1`。
- R4 结论：`GO` 进入 R5 Cloud handoff。publication 只建立不可变候选，不等于 Cloud accepted，也不
  授权 rollback/Latest promotion。

## R5 双通道验收模型

- v0.3.1 已冻结 Source/Candidate 与 Published Release 两条 Cloud 验收通道；当前 v0.3.2 runbook
  只有 Published Release 入口，遗漏了源码构建/本地 override 的独立证明。
- R5 应拆成有序的 `R5-SC` 与 `R5-PR`：前者把 PASS 绑定到运行时输出的完整 source commit，并从该
  checkout 完成 Linux 回归、双构建/check、显式 `file://` ZIP override 安装及 B～F；后者在另一个
  Fresh/Reset Cloud 环境中只消费 fixed public bootstrap URL+SHA，让 bootstrap 使用自身默认 ZIP URL，
  再完整重跑同一套冻结 B～F。
- 两条通道验证不同身份，不能共用容器、安装状态或 B～F 结果：分支只是运输 Source/Candidate runbook
  的入口；Published Release PASS 只属于 `v0.3.2` tag、公开双资产字节与 checksum。
- v0.3.2 相对 v0.3.1 没有 production runtime 行为变化，可以复用同一套黑盒 fixture，但风险较低不等于
  可以省略任一身份通道。只有 `R5-SC PASS` 与 `R5-PR PASS` 同时成立，R5 才可关闭。

## R5-SC Attempt 1：tagless Cloud checkout

- Cloud 在 branch transport 上以合成分支 `work` 检出精确 HEAD
  `8a40f806db4784a4e7eb5109257c16a240d9107a`，工作树干净且 sealed source commit object 存在，但没有
  remote 或本地 `refs/tags/v0.3.2`；这符合 Cloud checkout 不承诺完整 Git ref topology 的模型。
- Source/Candidate setup 的 upstream integrity、Python/Node/Bash static checks 均 PASS；Linux suite 为
  89 tests / 88 PASS / 1 FAIL / 0 skipped，唯一失败是 published v0.3.2 tag oracle 对本地 tag ref 的前置
  假设。脚本按 fail-fast 在 ZIP 双构建、安装和 B～F 前停止，因此没有 runtime 产品失败证据。
- 分类为 `test routing defect / Cloud fixture mismatch`，不是 product defect。不得在 Cloud 创建本地 tag
  来让测试变绿，因为那会用 runbook 常量伪造 publication 前置条件并形成循环证明。
- 选择物理测试分组：portable candidate/package tests 保留在 `release-package.test.js`；所有依赖本地
  immutable tag/历史 refs 的审计移动到 `published-release-oracles.test.js`。默认 `npm test` 仍运行两组；
  R5-SC 明确排除 publication-only 文件并要求其余 Linux tests `fail=0/skipped=0`，R5-PR 继续证明公开资产
  消费路径。测试语义不通过环境变量暗中降级。
