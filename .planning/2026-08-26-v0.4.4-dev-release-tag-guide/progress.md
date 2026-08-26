# Progress: v0.4.4-dev Release tag guide

## 2026-08-26

- planning-with-files session catch-up无输出，工作树为clean且与`origin/0.4.3`同步。
- 确认README是Release ZIP输入；在closed v0.4.3身份上直接追加教程会产生unversioned package drift。
- 维护者授权开启v0.4.4-dev文档补丁列车；创建独立planning scope并切换active pointer，既有planning不删除。
- 完成第一轮identity/history盘点：确认package→Release contract→manifest hash→external bootstrap是原子改号面；Phase 4.16应为回顾型capsule，ROADMAP需从`NONE`切换到已授权但尚非C0的v0.4.4-dev列车。
- 对照v0.4.3-dev历史激活提交与当前测试：确认v0.4.4-dev仍归属已闭合Phase 4 baseline上的小型文档patch train，accepted/fallback保持v0.4.3/v0.4.2，不激活Phase 5；repository/architecture断言需要随current pointer和第五个planning scope更新。
- 从clean v0.4.3 C2创建并切换到本地`0.4.4`分支；未创建远端branch。冻结两提交策略：先交付身份/README/overview，再用其exact commit建立Phase 4.16 cold evidence。
- 原子更新package与Release contract为`0.4.4-dev`，contract SHA更新为`6f27bfd4f172ea3c17fb144ac3f421622747cc8db8b7134080dc99100037947d`并写回manifest；完整回归后又把installed-state transition从旧v0.4.2轮转到当前accepted v0.4.3，等待最终hash复验。
- README已加入C1 push后exact C0 annotated tag教程；ROADMAP、CHANGELOG与Phase 4 overview同步。canonical materializer创建`init-cloud-sandbox-v0.4.4-dev.bash`，SHA-256 `fde557738c2c5b87b98c1665dfb9ed083a9d6069991a9c2f40e0b93e542bcb3c`，zero hash且只读复验`state=unchanged`。
- 身份、Release与文档五组focused回归在修正两项生命周期断言后`37/37 PASS`；README tag教程由直接命令/顺序语义断言保护，未弱化现有ZIP、contract或bootstrap准入。
- v0.4.3 oracle修正与accepted predecessor轮转后，完整Windows suite为`tests=187 / pass=161 / fail=0 / skipped=26`；skip均为明确Linux/POSIX cases。
- Final transition SHA为`1b68634830da24bea366c9f9be47e3b98bcad543f39d83ba32d36e07c30045f1`；v0.4.4-dev deterministic ZIP为22 entries、91,354 bytes、SHA-256 `20bb693c2ca1acd34ce90b870efc63a492e0edcdcfc1cccbf392171d570c0722`。
- Importer、candidate-bootstrap check、README tag PowerShell parser、Python compile、`node --check install.js`、v0.4.3/v0.4.4-dev `bash -n`与`git diff --check`均PASS。

## Validation

| Check | Result |
|---|---|
| Initial `git status --short --branch` | clean，`0.4.3...origin/0.4.3` |
| Candidate bootstrap materialization | created后只读复验unchanged；version=`v0.4.4-dev`，ZIP SHA为64位zero |
| Focused contracts/release/docs tests | 37/37 PASS |
| Published/predecessor oracle | 14/14 PASS |
| Full Windows suite | 187 tests / 161 pass / 0 fail / 26 skip |
| Candidate ZIP | 22 entries / 91,354 bytes / SHA-256 `20bb693c2ca1acd34ce90b870efc63a492e0edcdcfc1cccbf392171d570c0722` |
| Static / importer / bootstrap checks | PASS |

## Error Log

| Error | Attempt | Resolution |
|---|---:|---|
| PowerShell `Join-Path`首次组合活动plan文件路径时报位置参数错误 | 1 | 使用显式`-Path/-ChildPath`嵌套组合后成功读取；只读失败，无副作用。 |
| 误读不存在的`assets/init-cloud-sandbox-template.sh` | 1 | `rg`与materializer源码确认canonical模板实际为`tools/templates/init-cloud-sandbox.bash.in`；后续只读正确路径。 |
| 误读不存在的`docs/history/phase-history-template.md` | 1 | history索引明确模板位于`docs/phase-history-template.md`；后续改用该路径。 |
| 首次`git show`把commit参数放在`--`路径分隔符之后，实际显示了当前HEAD路径diff | 1 | 不重复该命令；随后使用`git show <commit> -- <paths>`正确读取`bae0755`历史激活模式。 |
| 一次planning补丁包含了不匹配的重复上下文，整批apply_patch被拒绝 | 1 | 重新读取三个planning文件后使用精确现有上下文拆分更新；拒绝是原子的，没有部分写入。 |
| focused tests首次`35/37 PASS`：current authority链接顺序漂移；architecture测试硬编码`v0.4.4-dev` | 1 | ROADMAP恢复Overview→provenance→acceptance稳定顺序；架构断言改从package动态派生并用版本无关anchor regex。 |
| focused复跑`36/37 PASS`：一个复合regex错误假定“不是C0”必须出现在planning数量之后 | 2 | 拆成两条直接语义断言，不为了测试机械调换自然正文顺序。 |
| 首轮完整suite `157 pass / 4 fail / 26 skip`：v0.4.3缺少离开current后的sealed bootstrap source；v0.4.4-dev仍只接受v0.4.2 predecessor | 1 | 补v0.4.3 C2 immutable bootstrap source；transition轮转到当前accepted v0.4.3并同步manifest hash，保留所有runtime字节。 |
| predecessor专项复验仍报告`predecessor upstream mismatch` | 2 | 从immutable v0.4.3 tag按installer canonical算法计算upstream SHA `7c6f3a...d38d`并更新transition；不猜测或沿用v0.4.2值。 |
| 受限执行面内Node无法spawn只读git子进程（`EPERM`） | 1 | 按环境分工在获批执行面重跑同一只读计算并成功；未修改仓库或远端。 |
| 一次跨production/planning补丁因planning上下文顺序不匹配而整批拒绝 | 1 | 拆分为production合同补丁和精确planning更新；首次拒绝无部分写入。 |
| 一次`rg`命令的PowerShell引号转义使末尾pattern被解释为路径 | 1 | 所需匹配已由同次`Get-Content`取得；后续不复用该组合命令，使用独立pattern或单引号。 |
