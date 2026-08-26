# Findings: v0.4.4-dev Release tag guide

## Initial boundary

- v0.4.3已完成双通道、Latest、第二轮retirement与C2，tag精确指向C0，当前programme开发列车为`NONE`。
- `README.md`由`contracts/release-artifact-v2.json`列入22项Release ZIP输入；发布后直接修改而不切换身份，会让当前`0.4.3` checkout重建出不同于公开包的字节。
- 用户已明确授权开启`v0.4.4-dev`文档补丁列车，并要求同步`docs/product-phases/phase-4.md`与新建Phase 4.16历史记录。
- README新增教程必须强调tag指向`SOURCE_CANDIDATE_HEAD`，不能默认指向C1、C2或当前HEAD；实际tag/push仍由维护者执行。
- 当前原子identity面至少包括`package.json`、`contracts/release-artifact-v2.json`、该contract在`upstream-manifest.json`中的SHA和contract唯一点名的根bootstrap；完整回归进一步证明新候选还必须把installed-state transition轮转到当前accepted predecessor。
- canonical bootstrap模板实际位于`tools/templates/init-cloud-sandbox.bash.in`；materializer会从package/contract派生版本并要求external asset精确匹配，因此应生成新的`init-cloud-sandbox-v0.4.4-dev.bash` zero-hash候选，同时保留accepted v0.4.3正式bootstrap。
- history索引当前把Phase 4.12～4.15归为`RETROSPECTIVE_CAPSULE`；Phase 4.16也应使用同一角色，说明“发布后README补充必须进入新身份”的治理经验，而不是虚构Discovery Round或Product Phase 5。
- v0.4.3-dev的历史激活提交`bae0755ae4372dd93cedddb60a8cedd53794a5bf`确认成熟模式：development train更新package/contract/bootstrap/manifest hash，accepted/fallback角色保持不变，ROADMAP第4节建立exact train anchor，CHANGELOG新增dev delta。
- 当前测试把“开发列车NONE、accepted=current v0.4.3”冻结为C2状态；v0.4.4-dev激活后应调整为candidate=`v0.4.4-dev`、accepted=`v0.4.3`、immediate fallback=`v0.4.2`，并保持published oracle只验证accepted+fallback窗口。
- Release package测试已经支持zero-hash candidate与accepted分离；只要ROADMAP candidate、package、contract和新bootstrap一致，不需要弱化ZIP或bootstrap安全断言。
- README教程应位于Source/Candidate PASS前提清单之后、正式双资产materializer之前：先确认C1证据commit已push，再以变量显式核对C0 commit、local/remote同名tag不存在，创建annotated tag，验证peeled commit，最后只push该exact tag ref。这样不会把C1/C2或当前HEAD误标为验收源码。
- Phase 4.16不能在同一提交中自称有指向自身的immutable evidence；采用两步本地提交：A提交完成v0.4.4-dev身份/README/overview与测试，B提交新增retrospective capsule并以A的exact commit作cold evidence，同时更新history索引和planning closeout。
- v0.4.3 provenance在它还是current checkout时可直接用tracked bootstrap验证；v0.4.4-dev激活后，published oracle要求显式immutable sealed source。已推送C2 `d7b5345b165e94c18ceab9b591d9a6b6dd251110`包含与公开资产逐字节一致的v0.4.3 bootstrap，现作为其sealed source。

## Decisions

| Decision | Rationale |
|---|---|
| 使用独立v0.4.4-dev身份承载README变化 | 保持v0.4.3 tag/source/ZIP/bootstrap与acceptance不可变，并使当前checkout身份诚实。 |
| 示例使用变量占位而非v0.4.3硬编码 | 可跨版本复制，减少把旧C0或旧tag带入新列车的风险。 |
| 新增Phase 4.16过程账本并同步Phase 4 overview | history保存本轮为什么发生，overview保存长期规则；ROADMAP只持有current train指针。 |
| installed-state transition轮转到exact v0.4.3 | 新候选若继续只接受v0.4.2，会拒绝从当前accepted v0.4.3正常forward install；只改predecessor identity，不改runtime inventory。 |
| 本地分支切换为`0.4.4` | 与新开发列车身份一致，避免在已推送并关闭的`0.4.3`分支继续累积Release输入变更；不创建或推送远端branch。 |
| Phase 4.16在第二个本地commit形成 | 让历史capsule能引用前一个不可变交付commit，避免placeholder或自引用；两个commit均保持单一、可恢复范围。 |

## Resources

- `README.md` — 稳定Release构建与维护者命令入口
- `ROADMAP.md#release-four-step-flow` — C0/C1/C2与publication宏观顺序
- `contracts/release-artifact-v2.json` — Release ZIP allowlist与external bootstrap authority
- `docs/product-phases/phase-4.md` — Phase 4长期摘要
- `docs/history/README.md` — Phase history角色与索引
- `docs/phase-history-template.md` — history对象写作模板
