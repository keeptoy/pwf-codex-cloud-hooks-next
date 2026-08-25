# Findings: v0.4.3 Phase history role governance

## Initial framing

- `docs/history/`应被新人理解为“精选过的历史过程账本”：它保存有长期解释价值的过程、决定、条件与后继状态，不保存原始聊天、逐命令日志、测试输出或current lifecycle。
- `RETROSPECTIVE_CAPSULE`是回顾型：对象关闭后依据immutable evidence回补，回答“后来如何总览这段历史”。
- `FROZEN_DISCOVERY_RECORD`是探路/决策型：正式Discovery/decision round关闭时冻结，回答“当时为什么这样判断、有哪些条件与停止点”。
- ROADMAP第5节是Product Phase长期摘要和programme authority；history records不能因为内容详细就取代它。
- `v0.4.3-dev`仍是Phase 4上的文档治理patch train，不能从版本变化推断Product Phase 5已经激活。
- 当前稳定package identity仍为`0.4.2`，Release contract也固定`package_version=0.4.2`与外部`init-cloud-sandbox-v0.4.2.bash`；ROADMAP/provenance中的v0.4.2多数是已发布事实，不能机械改号。
- Git历史显示`58a3452 chore: open v0.4.1-dev patch train`先把Release contract从稳定0.4.0切到`0.4.1-dev`，到`8ef5ec6` pre-seal才物化稳定0.4.1；v0.4.2则在`418f8b5` Source/Candidate前直接从0.4.1物化稳定0.4.2。当前v0.4.3预计还有多轮文档治理，应采用前者：先开`0.4.3-dev`，C0前再稳定化。
- 当前直接version输入只有`package.json`、`contracts/release-artifact-v2.json`和唯一bootstrap；已发布ROADMAP/provenance/acceptance中的v0.4.2是历史/角色事实，不属于机械改号面。
- v0.4.2 predecessor transition不能只改`package_version`：其`upstream_canonical_sha256`是已安装manifest的canonical identity，v0.4.2因contract/manifest身份变化与v0.4.1不同，必须从published v0.4.2 oracle精确派生。
- CHANGELOG可以描述“Phase history”变化，但不能写字面`docs/history/`路径，否则会违反README+ROADMAP唯二宏观入口规则；history详情只从README文档地图进入索引。
- immutable v0.4.2 `upstream-manifest.json` canonical SHA为`67bd9c32ae8964fe5ee5ef4290aa9caa564d8e9b8161d153cd8eebcb9ef75b40`；该值已进入0.4.3-dev predecessor transition并重新传播manifest contract hash。

## Open questions

- 当前索引开头是否足够新人友好地先讲“过程账本”，再讲两个machine role名称？
- README文档地图、治理指南与Phase history模板是否已有重复或含混表述需要收敛？
- 哪些版本身份文件属于`v0.4.3-dev`原子改号面，哪些已发布v0.4.2证据必须保持不变？
# Overview authority model discussion — 2026-08-25

- 维护者已创建但尚未跟踪的`docs/overview/phase4-release-note.md`与`phase5-release-note.md`目前均为空；它们属于维护者材料，本轮只读保留。
- 当前重复来源属实：ROADMAP第5节保存Phase路线表和Phase 4长期正文；治理指南8.2又保存一份第4节→第5节轮转事务；history索引与模板也把第5节写成长期authority。
- 把长期Product Phase摘要迁入`docs/overview/`可以降低ROADMAP体积；ROADMAP仍应独占current programme、版本角色、未来Phase路线和“当前指向哪份overview”的指针事务。
- `phaseN-release-note.md`必须明确是**Product Phase release overview**，不是某个SemVer版本的GitHub Release notes。版本delta仍归CHANGELOG，exact tag/ZIP/bootstrap与验收仍归provenance/acceptance。
- 建议第4节只保留exact development train状态、active Product Phase overview链接和授权边界；第5节保留Phase 4～9路线索引，但Phase长期正文迁出。未激活Phase可以只留ROADMAP候选行，避免空overview被误读为已激活authority。
- 轮转规则适合由ROADMAP单独持有，因为它直接控制ROADMAP指针与programme状态；repository-governance-guide只保留通用的history admission/link-retirement原则，并链接ROADMAP规则，不再复制步骤。
- 仍需保留稳定canonical anchor：ROADMAP的轮转规则anchor，以及每份Phase overview自己的Phase-level anchor。history current-authority链接在Phase活动和关闭后都可指向同一overview anchor，列车轮转只更新ROADMAP第4节指针，无需批量把history从ROADMAP第4节迁到第5节。
- 引用盘点显示迁移面不只ROADMAP与治理指南：history模板、history索引、Phase 4.14、Phase 4.1/4.4的`product-phase-4` current links，以及architecture/repository tests都冻结了旧模型；实施时必须原子迁移链接与断言。
- 多份history尾注链接`ROADMAP#product-phase-5`，它们表达的是programme重编号后的未来Phase 5，而不是已形成的长期Phase 5总结。新模型下应继续指向ROADMAP的Phase 5路线anchor；不能因为存在空`phase5-release-note.md`就把未激活Phase提升为overview authority。
- 新模型最好把两类链接分开：ROADMAP保留`product-phase-N-route`用于候选/未激活programme路线；`docs/overview/phaseN-release-note.md#product-phase-N-overview`只在Phase实际激活后成为current/long-term Product authority。

## Work Step B implementation decisions

- 维护者已清除临时`docs/overview/`，工作树在施工前干净；正式结构采用`docs/product-phases/README.md`与`phase-4.md`，模板单独放`docs/product-phase-overview-template.md`，避免模板冒充真实Phase实例。
- ROADMAP第5节改成`Product Phase路线索引`：保留Phase 4～9表与Release-closeout边界，删除5.1/5.2长期正文；Phase 4行链接真实overview，Phase 5继续只作为TBD路线行，不创建overview。
- ROADMAP新增稳定`product-phase-route-index`与`product-phase-overview-rotation` anchors。前者服务未激活Phase路线引用；后者独占current train→overview的指针事务。
- Phase 4 overview保留原5.1.1～5.1.4的长期Product内容，但所有相对链接按新目录重写；精确Release/Cloud证据仍只链接acceptance/provenance，不复制SHA或原始输出。
- 旧`product-phase-4` current-authority链接迁到`docs/product-phases/phase-4.md#product-phase-4-overview`；旧`product-phase-5`重编号尾注迁到ROADMAP的路线索引anchor，因为Phase 5尚未激活。
- repository-governance-guide删除仓库专用8.2轮转正文与旧anchor，只在history通用治理中引用ROADMAP新规则；Phase 4.14按允许的current-link maintenance改链并追加新authority状态说明。
- 稳定测试目前把ROADMAP长期正文、治理指南8.2、Phase 5占位正文与旧current links都写成正向合同；这些是本次应迁移的test authority，而非产品失败。新断言应覆盖目录准入、模板边界、Phase 4 overview内容、ROADMAP路线/轮转唯一性及Release exclusion。
- repository-boundary首个版本测试过去从ROADMAP切出v0.4.2 closeout；新模型必须改为读取`docs/product-phases/phase-4.md`，同时继续证明accepted acceptance与ROADMAP role window不变。

## Work Step B final conclusion

- `docs/product-phases/`现在是已激活Product Phase长期authority；当前只物化Phase 4，Phase 5继续只存在于ROADMAP的TBD路线行。
- ROADMAP第4节只做current train指针，第5节只做Phase 4～9路线索引并独占overview轮转规则；治理指南不再保存第二份仓库状态机。
- history两种record role和原时间语义保持不变；需要current Product authority的链接直接指向同一Phase overview，不再经历第4节→第5节批量迁链。
- Phase overview模板放在authority目录之外，并使用显式relative-link占位符，避免模板自身被误认成真实Phase或复制后继承错误相对路径。
- 新目录、模板和全部history迁链均不进入22-entry Release allowlist；本轮没有修改production/runtime/contract行为。

## Work Step C initial environment-profile inventory

- 现有`maintenance-environment-profile`只把“当前维护机物理/工具执行面”写成正式scope；远程/Cloud只作为本地缺口的默认路由出现，尚未被定义成同一份档案可登记的执行面。
- 维护者提出的更准确定位是“物理/工具限制和对策思路本”：应同时允许登记本地维护机与远程/Cloud执行面的跨任务稳定限制，但不能把责任授权、Host ABI、单次Cloud报错或逐轮验收输出混进来。
- 当前可发现入口已有AGENTS、MAINTAINER_HANDOFF、Phase 4 overview与Phase 4.14历史记录；README文档地图没有直接入口，新人必须先经过其他文档才能发现该档案。
- 文件路径可继续保持`docs/maintenance-environment-profile.md`以避免无收益改名；正文标题和准入模型应从“单台维护机事实”提升为“维护执行环境（local/remote）限制、影响、默认对策、核对日期与重验触发器”。
- 远程事实必须有真实Cloud/维护者证据并标注执行面与适用范围；不能把某次task的工具缺失或临时policy直接写成永久Cloud事实。
- 当前路径字面共11次、分布在8个tracked文件：其中面向维护者的直接引用是AGENTS、MAINTAINER_HANDOFF、Phase 4 overview与Phase 4.14共4处；其余为3处测试合同和4处planning记忆。README仍为零入口。
- repository-governance-guide已经用“反复改变本地/Cloud执行路由”定义提升条件，说明长期模型本来就允许local/remote两类执行面；真正的偏差在profile正文仍只声明“当前维护机”。
- 现有repository-boundary测试固定了本地Windows/WSL/container/Git Bash事实、Cloud Linux缺口路由、重验触发器、隐私边界与Release exclusion；扩展remote scope时应增加README入口和remote admission断言，而不是删除这些本地证据。
- 原始`d015a68`提交明确以“本机限制长期记忆”为起点；本次不是纠正错误历史，而是按维护者新决策把同一机制推广到remote/Cloud执行面，文件路径可兼容保留。
- immutable v0.4.2 acceptance提供可引用的remote事实：2026-08-23 Source/Candidate使用disposable Linux Cloud完成portable Linux证据；同轮C步骤确认Cloud task工具inventory可能只有Shell型读取与apply_patch，缺少独立只读工具。
- remote登记应区分三类状态：`CONFIRMED_ROUTE`表示真实跑通过但不承诺永久可用的执行路线；`CONFIRMED_BOUNDARY`表示不能硬编码的Host路径/默认值；`CONFIRMED_VARIABILITY`表示每个task需重新核对的工具能力。这样不会把一次task快照冒充永久Cloud合同。
- 实施保留了`maintenance-environment-profile.md#maintenance-environment-profile`稳定路径合同，只改新人可见标题与职责；历史v0.4.2记录继续保持当时“本机限制起点”的时间语义。
- README成为环境档案的一级新人入口；AGENTS和MAINTAINER_HANDOFF只保留执行摘要，repository-governance-guide只维护提升规则并链接profile，不复制事实表。

## Work Step C final conclusion

- 环境档案现在同时覆盖local维护机和remote/Cloud执行面，但准入只接受会跨任务改变执行路线的已确认物理/工具事实及默认对策；瞬时Cloud错误、职责授权、Host ABI和验收步骤仍留在各自authority。
- README文档地图是新人一级入口。当前另有AGENTS、MAINTAINER_HANDOFF、治理指南、Phase 4 overview与Phase 4.14共5个职责内投影/历史链接，合计6份human-facing文档各1条链接。
- remote事实没有被写成永久平台承诺：Linux Cloud是`CONFIRMED_ROUTE`，`/opt/codex`是`CONFIRMED_BOUNDARY`，task工具inventory是`CONFIRMED_VARIABILITY`；三类状态分别决定复用、受控探测或每task核对。
- profile保持Release-excluded；README入口属于22-entry ZIP输入，因此任何正式C0前都必须使用当前README字节重新构建候选。

## Work Step D initial Release asset materialization inventory

- README已有两段手工流程：开发ZIP固定输出`dist/pwf-codex-cloud-hooks-candidate.zip`；正式块会重建`dist/pwf-codex-cloud-hooks-vX.Y.Z.zip`并校验Source/Candidate SHA，但只把`./init-cloud-sandbox-vX.Y.Z.bash`当成已经存在的文件，不负责从模板生成bootstrap。
- 当前文档要求Source/Candidate PASS后才seal bootstrap，并称标准仓库/资产名下通常只替换`HOOKS_VERSION`与`HOOKS_SHA256`；`HOOKS_PACKAGE`和`HOOKS_URL`是派生值，其他Skill/PowerShell pins与archive root不得顺手改。
- bootstrap必须继续是ZIP外部资产。ARCHITECTURE的package plane只有`tools/build_release.py`→candidate ZIP，未定义bootstrap生成器；直接把第二份完整脚本当模板会新增一个需要防漂移的Release source authority。
- README本身进入Release ZIP。任何新增“生成ZIP+bootstrap”命令都必须在C0与Source/Candidate前完成；若在PASS后才改README或生成规则，会使原C0证据失效。
- 维护者目标可以保留为“Source/Candidate PASS后物化最终上传文件到`dist/`”，但生成规则和模板字节必须在PASS前已冻结，PASS后只能向冻结模板注入exact version/SHA并复验，不能临时改生成逻辑。
- DESIGN把`tools/build_release.py`定义为唯一package plane，只负责contract-driven ZIP build/check；若让它同时渲染外部bootstrap，会扩大现有模块职责。更清晰的候选是新增一个很薄的release-assets materializer，调用builder并消费单一bootstrap template。
- ROADMAP要求正式tag精确指向Source/Candidate PASS的C0，而C1后才上传最终ZIP/bootstrap。PASS后本地可以确定性重建ZIP，但必须以Cloud回传SHA为admission：字节不相等就停止，不能生成可上传bootstrap或“顺手修复”。
- bootstrap/template/generator都属于C0 Release输入或seal规则；它们必须在C0前进入source并被Source/Candidate验收。PASS后允许变化的只有`dist/`生成物，不能再改模板/生成器/README。
- 推荐把“构建ZIP”和“seal外部bootstrap”包装为一个命令，但内部仍保持顺序：build ZIP → check → 比对expected Source/Candidate SHA → 渲染bootstrap → `bash -n` → 输出双资产hash。这样维护者只复制一次命令，而安全边界没有合并。
- `dist/`已由`.gitignore`排除，当前还残留旧candidate与v0.4.2 ZIP；它适合承载可再生本地产物，但materializer不能顺手清空目录，也不能静默覆盖同名immutable版本资产。目标存在时应“字节相同则复用，字节不同则fail closed”。
- 当前machine contract要求外部资产精确命名为`init-cloud-sandbox-${candidate}.bash`，并且current bootstrap tests直接读取根目录同名文件验证version、zero/exact hash和安全pins；根versioned bootstrap本身已经是Source/Candidate验证输入。
- `init-cloud-sandbox-template.sh`若复制完整约700行bootstrap，会与根versioned bootstrap形成第二份大字节authority。除非新增确定性render-equivalence测试并明确谁是source，否则比现状更容易漂移。
- 更小的设计是把C0中已跟踪、已测试的`init-cloud-sandbox-vX.Y.Z.bash`当作候选模板，post-PASS materializer只在写入`dist/`副本时把唯一64位zero hash替换为Cloud回传SHA；version已经由package/contract/current bootstrap在C0前冻结，不应PASS后再手工改一次。
- 精确normalized对比推翻了“现有两个bootstrap只差version/hash”的假设：两份脚本均751行且version/hash各唯一命中一次，但`v0.4.3-dev`内嵌的lifecycle黑盒中文prompt已经成为UTF-8可解码的mojibake，`v0.4.2`对应正文正常；这属于current candidate defect，现有bootstrap tests未覆盖。
- 因此不能直接把当前v0.4.3-dev bootstrap当canonical模板。实施前应由维护者授权：从已知良好的v0.4.2结构恢复该prompt、保留v0.4.3身份/zero hash，并新增“规范化version/hash后其余canonical字节不得漂移”或等价template-render测试。
- `tools/build_release.py`目前用临时文件后`os.replace(output)`，会静默覆盖同名ZIP。面向最终上传资产的新materializer必须在外层增加existing-output admission，不能沿用这种覆盖语义处理versioned `dist`资产。

### Work Step D route comparison and recommended design

| Route | 优点 | 主要问题 | 结论 |
|---|---|---|---|
| 根`init-cloud-sandbox-template.sh` + README手工复制/替换 | 直观、改动少 | 完整模板与versioned脚本会成为两份authority；手工替换易错，Windows quoting/encoding风险高；无法自动阻止覆盖或SHA错配 | 不推荐 |
| 直接把current root versioned bootstrap当post-PASS模板 | 无第二份大文件，最小改动 | 每开新列车仍需人工复制旧脚本；本次mojibake正说明这一步会漂移；缺少明确canonical source | 可作短期patch，不适合作为长期规范 |
| canonical `.bash.in` template + Python materializer + render-equivalence tests | 模板单一authority；Windows/Linux同一命令；候选和release两种产物都可确定性生成；可以集中fail closed | 初次改动较大，需要修复current bootstrap并补边界测试 | 推荐 |

推荐具体结构：

- `tools/templates/init-cloud-sandbox.bash.in`：唯一完整bootstrap source，只有`@HOOKS_VERSION@`与`@HOOKS_SHA256@`两个token；`.in`明确表示不可直接执行或上传，比根`template.sh`更不易误用。
- `tools/materialize_release_assets.py`：维护者侧薄编排器，不改变`tools/build_release.py`的ZIP-only职责。
- `candidate-bootstrap`模式：版本列车开立/C0前，用package/contract一致的version和64位zero hash生成根`init-cloud-sandbox-vX.Y.Z[-dev].bash`；该派生文件继续tracked并由bootstrap/contract tests验证。
- `release`模式：Source/Candidate PASS后，要求显式`--version`和`--expected-zip-sha`，先在临时路径build/check ZIP并比对Cloud SHA，再从同一template生成exact-hash bootstrap，最终只输出到ignored `dist/`。

建议README最终只给维护者一条post-PASS命令：

```powershell
python tools/materialize_release_assets.py release --version vX.Y.Z --expected-zip-sha <SOURCE_CANDIDATE_SHA256> --output-dir ./dist
```

命令必须自动派生并输出：

- `dist/pwf-codex-cloud-hooks-vX.Y.Z.zip`及其size/SHA；
- `dist/init-cloud-sandbox-vX.Y.Z.bash`及其SHA；
- machine-readable JSON summary，便于复制到publication/acceptance。

Fail-closed条件：version必须同时匹配package、Release contract和external asset identity；SHA必须是非zero 64位小写hex；ZIP build/check结果必须等于Source/Candidate SHA；template token必须各唯一一次且无未知token；root candidate bootstrap除zero→exact SHA外必须与render结果一致；目标存在时相同字节才幂等成功，不同字节拒绝覆盖；任一失败不得留下半套可误传资产。

实施测试至少覆盖：template token/inventory、current candidate render equivalence、mojibake sentinel、invalid version/SHA、Cloud SHA mismatch、existing-output conflict、ZIP/bootstrap命名和Release exclusion；完整suite与临时`dist`端到端生成后再本地commit。

### Work Step D implementation outcome

- 最终采用`tools/templates/init-cloud-sandbox.bash.in`作为不可直接上传/执行的canonical Bash模板，以`tools/materialize_release_assets.py`作为唯一维护者生成脚本；用户所说的“脚本生成两个目标文件”由其`release`子命令实现，不再手工复制或替换大段bootstrap。
- `candidate-bootstrap --write`只用于C0前把current package/contract身份和zero hash渲染为tracked根bootstrap；无`--write`时执行exact byte check。`release`只在Source/Candidate PASS后使用，要求维护者提供exact Cloud ZIP SHA并在ignored `dist/`同时产生versioned ZIP与exact-hash bootstrap。
- `release`在写入前核对package、contract、external asset、tracked candidate、template token/UTF-8 sentinel与重建ZIP SHA；同名相同字节幂等，同名不同字节拒绝覆盖。generator/template是source-only trusted inputs，不进入22-entry ZIP。
- v0.4.3-dev的19行mojibake提示已按v0.4.2已验证正文重新派生为正确UTF-8；candidate checker返回`state=unchanged`，证明tracked脚本完整字节等于canonical template的v0.4.3-dev/zero-hash render。
- README、DESIGN、ARCHITECTURE、CHANGELOG、ROADMAP与Phase 4.14只分别承载命令入口、实现导航、部署关系、版本delta、current train和历史原因；没有复制第二份machine规则。

### Work Step E newcomer explanation boundary

- README必须先分离三个对象：本地`candidate.zip`只是可选预检，tracked root bootstrap是C0的zero-hash源码输入，`dist/`双资产才是Source/Candidate PASS后上传对象。只列文件名而不解释生命周期，会诱导新人把旧candidate改名发布。
- `candidate-bootstrap --write`是显式mutation，用于C0前从canonical template真正创建/重写tracked candidate；无`--write`是read-only exact-byte admission。两条连续执行表达“先生成、再独立核对”，不是重复做同一件事。
- `release`不消费早期candidate文件。它从当前checkout重新构建临时ZIP，再把实际SHA与Cloud evidence比较；只有相等才向`dist/`写versioned ZIP并渲染exact-hash bootstrap。该设计用确定性重建发现PASS后的Release-input drift，而不是让陈旧本地文件绕过证据。
- 正式命令的SHA authority是Source/Candidate原始输出；本地candidate hash只能preflight。正式version identity、Cloud PASS、Release输入未变、tracked candidate等于zero-hash template render是共同前提。
