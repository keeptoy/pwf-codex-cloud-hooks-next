# Progress: v0.4.4 Source/Candidate C0

## 2026-08-26

- 维护者授权继续正式C0流程；创建独立planning scope并切换active pointer，既有五个前序scope均保留，当前总数为六个。
- 只读准入确认当前checkout为`a64afc74499c73b78d47dd1992f092d918a77775`、package/contract身份为`0.4.4-dev`、tracked candidate bootstrap为canonical zero-hash且未漂移。
- 正式物化器用`--version v0.4.4`执行时在写入前fail closed，错误为`release version mismatch: requested='v0.4.4' current='v0.4.4-dev'`；工作树和临时输出均保持干净。
- 冻结新边界：旧Cloud PASS不冒充正式版本证据；本轮形成stable C0并停止，正式双资产等待新C0 Cloud PASS。
- machine identity已收敛为`v0.4.4`：Release contract SHA为`4be2877564b28d77708135b8ece97f85082507626909f5c323af2d2b32685ba9`；canonical zero-hash bootstrap SHA为`5a1c39c6c0aa018432f6dba696bc0ee3a1386492a41b210346144762af6e3703`。
- 新增PENDING `v0.4.4` acceptance，并同步ROADMAP、CHANGELOG、Phase 4 overview和角色窗口断言；Phase 4.16及旧dev planning保持原始时间语义。
- README tag教程新增稳定显式anchor；该字节与正式改号一起进入新C0，不沿用旧dev Cloud证据。

## Validation Evidence

| Check | Result |
|---|---|
| Initial worktree | clean，`0.4.4...origin/0.4.4` |
| Candidate bootstrap admission | `state=unchanged`，version=`v0.4.4-dev`，zero SHA |
| Formal release admission | expected fail closed before output creation |
| Focused identity/contracts | contracts 5/5；release-assets 4/4；release-package 3/3；repository 17/17；architecture 9/9 |
| Full Windows suite | 188 tests / 162 pass / 0 fail / 26 skipped；skip均为Linux/POSIX cases |
| Candidate ZIP double build | 22 entries / 91,369 bytes / SHA-256 `4a179aad3ca0ce17270ee7a63c2644e8db2aa321cc48ed6056dbe6b4e70571e4` / byte-identical |
| Static and source checks | Python compile、`node --check`、v0.4.3/v0.4.4 `bash -n`、importer、candidate-bootstrap、upstream modes、`git diff --check`均PASS |

## Error Log

| Error | Attempt | Classification / Resolution |
|---|---:|---|
| `release --version v0.4.4`与current `v0.4.4-dev`不匹配 | 1 | Release identity admission正确拒绝；建立新stable C0，不生成或上传未验收资产。 |
| 首次`candidate-bootstrap --write`在contract已改、manifest仍为旧SHA时返回`release artifact contract SHA-256 mismatch`；随后hash读取因新bootstrap尚未创建而失败 | 1 | 严格合同校验正常工作；先写回新contract SHA，再重跑生成与只读check，无半成品残留。 |
| 并行/逐项focused中`release-assets`、`release-package`及repository需要spawn Python/Git的case均返回`status=null` | 1 | 与已登记的Windows受限子进程执行面一致；不算产品失败，在获批执行面重跑同一命令。contracts、architecture、importer和diff check已经真实PASS。 |
| 获批focused中release-assets 4/4、release-package 3/3 PASS；repository 16/17因新acceptance链接README自动中文slug失败 | 1 | 新增`source-candidate-c0-tag-push`显式anchor并更新链接；不放宽跨文档anchor合同。 |
| 组合静态检查在Python compile和`node --check`通过后，Git Bash因Win32 error 5无法创建signal pipe | 1 | 维护机执行面限制；单独在获批执行面复验v0.4.3/v0.4.4两个bootstrap的`bash -n`，其余检查不受影响。 |

## Source/Candidate C1 — 2026-08-26

- 维护者明确报告正式C0 Source/Candidate Cloud PASS，并提供ZIP SHA `4a179aad3ca0ce17270ee7a63c2644e8db2aa321cc48ed6056dbe6b4e70571e4`；它与本地C0双构建完全一致。
- 第一轮retirement checkpoint完成：当前C0/C1 planning、五个前序planning、accepted v0.4.3窗口材料、全部C0 sealed inputs、当前guide/templates/ROADMAP/tests均`KEEP`；没有RETIRE、MIGRATE或删除。
- canonical materializer生成`dist/pwf-codex-cloud-hooks-v0.4.4.zip`（22 entries、91,369 bytes、Cloud exact SHA）与`dist/init-cloud-sandbox-v0.4.4.bash`（21,565 bytes、SHA `972af180babd9235788ca2d31e83a9630220b3d5cdfdef1f8d3938858ec0d701`）。
- 第二次物化两项均为`unchanged`；builder check `healthy=true`、`bash -n`和精确version/SHA赋值核对PASS。
- C1只修改Release-excluded acceptance、ROADMAP、planning与测试断言；ignored `dist/`资产不提交，C0 source字节保持不变。
- C1边界复验：repository `17/17 PASS`、architecture `9/9 PASS`、`git diff --check` PASS；待提交路径与`dist/`资产严格分离。

### C1 Error Log

| Error | Attempt | Classification / Resolution |
|---|---:|---|
| 默认沙箱无法创建`pwf-release-materialize-*`临时目录，WinError 5 | 1 | 维护机执行面限制；获批执行面使用同一命令成功，首次失败未产生v0.4.4输出。 |
| 辅助检查误把bootstrap内用于fail-closed的64位zero常量当成未seal状态 | 1 | 测试断言过宽；改为核对实际`HOOKS_VERSION`/`HOOKS_SHA256`默认赋值，资产无需重建。 |

## Published Release checkpoint — 2026-08-26

- 维护者确认正式`v0.4.4` annotated tag已创建并push，tag精确指向C0；GitHub Release和ZIP/bootstrap双资产已经发布。
- 维护者确认独立Published Release通道全部PASS。公开ZIP为91,369 bytes、SHA `4a179aad...71e4`；bootstrap为21,565 bytes、SHA `972af180...d701`，与C1本地物化身份一致。
- Release测试仓库初始没有任何`.planning`文件。Cloud模型先前清理临时planning后，把`.planning`与active pointer同时缺失误判成`BASELINE_CONFLICT`；维护者明确授权首次创建后，apply_patch成功建立canonical fixture，后续planning injection、recent progress和整条通道全部PASS。
- 稳定模板第6节现明确：empty repository是合法首次创建状态；apply_patch负责创建父目录/三文件/pointer。真正冲突仅限已有目标、symlink/错误类型、不安全component或无法安全读取/更新的pointer；禁止Shell预创建或`rm -rf .planning`。
- 本轮只修改Release-excluded template、acceptance、ROADMAP、planning和静态断言，不改写C0、tag、公开ZIP或bootstrap。Latest confirmation、第二轮retirement和C2保持PENDING。
- Published Release checkpoint边界复验：repository `17/17 PASS`、architecture `9/9 PASS`、`git diff --check` PASS。

## C2 closeout — 2026-08-26

- 维护者确认远端已push且`v0.4.4`早已Latest；按ROADMAP正常路径直接进入第二轮role-window closeout，不另做postflight。
- 冻结对象决定：v0.4.4 guide/bootstrap `KEEP/FREEZE`；v0.4.3 current guide/bootstrap `RETIRE`并由immutable `d7b5345...`与Release恢复；publication oracle `MIGRATE`；六个planning scope及稳定contracts/runtime/templates/history/tests `KEEP`。
- 首次组合补丁因`BASELINE_PROVENANCE.md`表头上下文不完全匹配被apply_patch整体拒绝；确认没有部分写入，后续改用当前精确行分文件应用。
- ROADMAP已轮转为development `NONE`、accepted v0.4.4、fallback v0.4.3、deeper v0.4.2；provenance新增v0.4.4并把v0.4.3链接迁到immutable `d7b5345...`。
- v0.4.4 acceptance追加Latest/第二轮retirement/final Post-run与C2 token；Phase 4 overview和CHANGELOG同步最终角色。
- tracked v0.4.4 bootstrap已冻结为公开ZIP exact SHA，文件SHA与ignored `dist/`正式bootstrap相同：`972af180...d701`。
- current v0.4.3 guide/bootstrap已按第二轮决定清退；当前树所有长期引用均迁到immutable恢复点，测试中的剩余路径只用于`readGit`和“不应存在”断言。
- 本地annotated tag `v0.4.4^{}`精确解析到C0 `f7032fd0efad3df9e4b6052e8cd766d27cd2a844`；`git diff --check` PASS。
- 首轮C2 focused测试36/39；三个失败均为治理投影：ROADMAP重复同anchor、测试误把跨行授权摘要写成单行、CHANGELOG缺当前acceptance链接。已做最小修正，production与Release输入不变。
- 首轮完整Windows suite：188 tests / 161 pass / 1 fail / 26 skip。唯一失败是transition测试仍把predecessor与accepted比较；C2后正确角色是immediate fallback，已只修测试语义，machine contract不变。
- contracts专项5/5 PASS；完整Windows suite复验188 tests / 162 pass / 0 fail / 26 Linux/POSIX skip。
- C2后误调用C0专用`candidate-bootstrap`检查，canonical工具正确拒绝用zero-hash render覆盖sealed accepted脚本；后续只使用`release`路径复验正式双资产。
- C2正式双资产幂等复验：ZIP `unchanged`，22 entries、91,369 bytes、SHA `4a179aad...71e4`；bootstrap `unchanged`，21,565 bytes、SHA `972af180...d701`。
- 最终静态边界：importer healthy；Python compile、`node --check`、v0.4.4 `bash -n`、四个upstream `100755`、`git diff --check`全部PASS。
- C2范围确认：runtime、installer、machine contracts、Host ABI与22-entry ZIP输入均未修改；current v0.4.3 guide/bootstrap可由immutable Git/Release恢复，六个planning scope全部保留。
