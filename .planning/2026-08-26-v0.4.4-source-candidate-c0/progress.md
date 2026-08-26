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
