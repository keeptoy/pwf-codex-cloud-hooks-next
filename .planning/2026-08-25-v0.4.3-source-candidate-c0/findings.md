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

## Published Release and Latest result — 2026-08-26

- 维护者最终确认：固定版本`0.4.3`的验收模板已完成Published Release整条通道，9.2最终exit code为0。
- 9.2证明公开ZIP SHA `cfcabcc93c819e2d512a1b9cf0b3f13a451ffea8c82631012b74a64813150231`、22项Release artifact、12项installed runtime、4项pristine upstream、manifest-routed v2 contracts、authoritative bundle inventory、adapter-only policy与零snapshot residue全部闭合。
- Doctor为`healthy=true`、`repairable=false`、`managed=true`，且`errors=[]`、`blockers=[]`；最终marker为`PWF_PUBLIC_POST_RESUME=PASS`。
- 公开Release只读核对：tag source精确为C0 `6204de36cd8b2cbc614a4bb53b8481a5a1ba234d`；ZIP为90,364 bytes；bootstrap为21,565 bytes、SHA-256 `f738d61551aee20d924e565fe59f5a360a6c13fa2e40dc7e63e7e63e06485c37`。
- GitHub `/releases/latest`返回`v0.4.3`，且`draft=false`、`prerelease=false`，Latest promotion confirmation成立。下一步是第二轮role-window对象决定；在维护者明确前不得删除planning或current guide/bootstrap，也不得提前轮转programme角色或声明C2。

## Role-window closeout admission — 2026-08-26

- 维护者已确认第二轮方案：v0.4.2 current guide/bootstrap `RETIRE`，四个planning scope继续`KEEP`，v0.4.3 guide/public identity `KEEP / FREEZE`，publication oracle随ROADMAP角色`MIGRATE`。
- v0.4.2 guide仍被CHANGELOG、provenance、环境档案、Phase 4 overview和Phase 4.14 history引用；删除前必须把这些入链迁到包含完整C2的immutable commit `33deb5870015c94df329fe233e306363ba43232b`，不能留下本地断链。
- v0.4.3根bootstrap当前仍是C0 zero-hash candidate，SHA-256 `32d63468cf06eb5a518b97af8a3b095983fe637f46e8f67f01307855e2222ef1`；C2需要把它冻结为已验收公开bootstrap的exact bytes，目标SHA-256为`f738d61551aee20d924e565fe59f5a360a6c13fa2e40dc7e63e7e63e06485c37`。
- C2后programme角色应为v0.4.3 accepted、v0.4.2 immediate fallback、v0.4.1 deeper fallback，当前开发列车为`NONE`；Product Phase 5仍全部TBD且未授权。
- 角色轮转首次回归暴露source-only materializer只接受zero-hash tracked candidate，无法在accepted closeout后重放自身release测试。最小安全修正允许tracked bootstrap精确等于canonical zero candidate或本次expected ZIP SHA对应的canonical sealed render；ZIP实际SHA仍先核对，其他字节继续fail closed。该修正不进入Release ZIP、runtime或trusted graph。
- publication oracle原先把没有独立`sealed bootstrap source`的版本自动回退到C0 source commit，错误要求tag内的zero-hash candidate bootstrap等于公开non-zero bootstrap。新断言明确冻结两类身份：tag/source继续验证C0与确定性ZIP；当前accepted版本的正式bootstrap从C2 tracked exact bytes验证，离开accepted窗口后则必须在provenance提供独立immutable bootstrap source。
- C2没有改变22项Release ZIP输入；重新构建仍为90,364 bytes、SHA-256 `cfcabcc93c819e2d512a1b9cf0b3f13a451ffea8c82631012b74a64813150231`。本轮变更只涉及ZIP外bootstrap、source-only release工具、测试和Release-excluded治理文档。
