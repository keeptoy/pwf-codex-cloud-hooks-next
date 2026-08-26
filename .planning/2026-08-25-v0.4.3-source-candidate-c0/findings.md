# Findings: v0.4.3 Source/Candidate C0

## Initial boundary

- 用户明确要求把当前身份从 `v0.4.3-dev` 切换为正式 `v0.4.3`，进入 C0 Source/Candidate 候选阶段。
- C0 是等待 Cloud 第一通道验收的精确源码候选，不等于 Source/Candidate PASS，也不等于公开 Release。
- 正式发布 ZIP 与 non-zero bootstrap 必须等待 Source/Candidate Cloud PASS 后再物化；本轮根目录 candidate bootstrap 仍使用 64 位 zero hash，并由 4.1 运行时 override 验证本地候选 ZIP。

## Candidate admission findings

- 当前 machine identity 的原子改号面是 `package.json`、`contracts/release-artifact-v2.json`、该contract在`upstream-manifest.json`中的SHA，以及contract唯一点名的根bootstrap。`installed-state-transition-v1.json`继续描述exact `0.4.2` predecessor，不因candidate从dev转stable而变化。
- 根bootstrap必须从canonical template重新物化为`init-cloud-sandbox-v0.4.3.bash`，内嵌`v0.4.3`与64位zero SHA；旧`v0.4.3-dev` bootstrap退出current role window。accepted `v0.4.2` bootstrap继续保留。
- `docs/acceptance/`的动态角色规则要求stable candidate与accepted guide并存，因此本轮新增`v0.4.3-cloud-hard-acceptance.md`；它只写Pre-run和candidate admission，两个Cloud通道都保持未运行，不预建final Post-run。
- ROADMAP只把当前列车从development identity切到stable C0 candidate，并授权Source/Candidate待验收；accepted/fallback和provenance保持不变。Phase 4 overview是current长期authority，应把`v0.4.3-dev`收敛为`v0.4.3`；Phase history和旧planning保留当时的dev时间语义。
- 当前三个planning scope均有Git恢复点且用户此前明确要求保留为相邻Discovery恢复/治理参考；candidate admission只分类为`KEEP`，不做退役删除。
- Release ZIP输入变化包括package、contract、manifest、README和bootstrap；本轮不改production/runtime/Host ABI/trusted graph。新acceptance、ROADMAP、CHANGELOG、overview、tests与planning不进入22项ZIP，但必须与candidate身份一致。

## Source/Candidate Cloud result — 2026-08-26

- 维护者明确报告第一通道全部PASS；提供的9.1脚本最终`exit code 0`，Cloud checkout HEAD为`6204de36cd8b2cbc614a4bb53b8481a5a1ba234d`，精确等于C0。
- Deep check确认manifest schema 4、Release/runtime bundle contract schema 2、installer `0.4.3`、22项Release allowlist、12项installed runtime、4项pristine upstream、bundle inventory authority与adapter-only policy。
- Doctor为`healthy=true`、`repairable=false`、`managed=true`，events精确为SessionStart/UserPromptSubmit，`errors=[]`、`blockers=[]`；workspace只有验收允许的planning fixture，snapshot residue为0。
- 回传没有包含4.1候选ZIP SHA和测试runner数字；不得用本地SHA代替或猜测。C1可以真实保存通道PASS和已提供的deep-check证据，正式资产materialization仍等待维护者提供实际Cloud 4.1 SHA。
- 第一退役检查不删除任何对象：四个planning scope按用户既有决定继续KEEP；v0.4.2 accepted guide/bootstrap保留到第二轮；v0.4.3 guide、templates、C0输入和治理材料继续承担publication/Published Release/C2职责。
