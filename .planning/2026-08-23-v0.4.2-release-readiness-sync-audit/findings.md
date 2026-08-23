# Findings: v0.4.2 release-readiness synchronization audit

## Initial boundary

- 本轮是讨论前的只读release-readiness审计，不直接同步正式文档或版本身份。
- 重点区分：代码/Release输入实际delta、已经完成但未提升的文档治理delta、以及只有进入正式Release gate后才能产生的证据。

## README / Architecture reread

- README当前稳定行为仍对应v0.4.1代码基线；它不应因纯文档治理列车提前写`v0.4.2`发布身份，但正式seal前必须确认README是否属于ZIP输入并冻结最终字节。
- ARCHITECTURE只维护系统信任边界，当前文档治理没有提出新的Host ABI、trusted graph、runtime或installer行为，因此除非delta inventory发现矛盾，理论上不需要为v0.4.2版本号同步正文。
- 两份authority都明确：版本身份、文件名或本地构建不等于Release；CHANGELOG负责实际版本delta，ROADMAP负责当前列车/RC授权，acceptance/provenance只写真实证据。

## Design / Roadmap reread

- DESIGN把纯文档路由修改的验证限定为focused governance、链接/anchor、inventory与`git diff --check`；只有文档属于ZIP输入时才影响candidate bytes。
- ROADMAP 4.1仍明确`v0.4.2-dev`只做文档治理、package identity仍为`0.4.1`、没有RC或seal授权。这与当前用户“后续将发布”不冲突，但正式发布前需要一个新的Release task plan把列车从documentation governance推进到candidate closeout。
- ROADMAP已包含未来通用Release workflow、C0/C1/C2、两个retirement checkpoint和pre-1.0清退政策；这些规则本身无需为了`v0.4.2`复制一遍。
- 如果`v0.4.2`确实只包含Release-excluded docs/planning/tests，版本发布的核心问题将不是production行为变化，而是：是否要物化`0.4.2`package/bootstrap身份、CHANGELOG如何描述治理delta，以及生成一份具体版本Release operator guide。

## Exact delta from immutable v0.4.1 tag

- immutable `v0.4.1` tag解引用为`99885b854bd9621c3340e99f031bf83ceb58414d`；当前HEAD为`3af7141eb6142bb97151011ffacef371b56247cb`。
- 从tag到HEAD，`install.js`、`hooks/`、`runtime/`、`contracts/`、`tools/`、`upstream-manifest.json`、`package.json`和当前`init-cloud-sandbox-v0.4.1.bash`均为0改动。因此可以准确说：当前整条post-v0.4.1治理列车没有改production、contracts、supply-chain工具或当前package/bootstrap字节。
- 发生变化的是docs/planning/tests/governance：DESIGN、ROADMAP、CHANGELOG、provenance、templates、history、acceptance与repository tests等；另外退役了旧`v0.4.0`bootstrap和阶段教程。
- 当前Release allowlist共22项，只包含README这一份宏观稳定文档；README自v0.4.1 tag以来也未改变。DESIGN、ROADMAP、CHANGELOG、history、planning和tests均不进入ZIP。
- 当前`package.json.version`仍是`0.4.1`，根目录也只有`init-cloud-sandbox-v0.4.1.bash`。所以现在还不能构成`v0.4.2`候选：必须在正式candidate gate中物化`0.4.2`package identity与新的外部bootstrap，这会首次改变v0.4.2 Release字节并要求重新build/check/Cloud。

## Authority synchronization findings

- `CHANGELOG.md`当前顶部仍从`v0.4.1`开始，没有`Unreleased`或`v0.4.2`段；本轮已经发生的大量文档治理、模板重构、历史分层与清退没有进入版本delta authority。这是发布前必须补的明确缺口。
- `ROADMAP.md`当前陈述仍准确：治理列车、package 0.4.1、未授权RC。现在无需把它提前改成已获批candidate；一旦维护者授权candidate closeout，ROADMAP才应同步目标`v0.4.2`、RC状态和第一retirement checkpoint结论。
- README、ARCHITECTURE、DESIGN、AGENTS与MAINTAINER_HANDOFF没有发现需要随版本号轮换的稳定行为缺口。DESIGN已经纳入新Operator Guide/Release workflow职责；README和ARCHITECTURE不应为了纯治理release制造无行为变化的ZIP输入。
- `BASELINE_PROVENANCE.md`只登记已发布immutable身份，目前只应保留v0.4.1/v0.4.0等真实资产；不得在Pre-release和公开资产形成前预填v0.4.2 URL、size或SHA。
- 当前只有`docs/v0.4.1-cloud-hard-acceptance.md`。正式Source/Candidate前需要创建single-Discovery简写的`docs/v0.4.2-cloud-hard-acceptance.md`，写Pre-run、exact scope与双通道教程；没有新增风险面时不复制稳定脚本或虚构“验收增量”。

## Candidate identity propagation

- v0.4.2不是只改`package.json`：`contracts/release-artifact-v2.json`同时固定`package_version=0.4.1`和external bootstrap名；两者必须原子切换到0.4.2。
- `contracts/installed-state-transition-v1.json`当前只准入exact v0.4.0 predecessor。若v0.4.2要支持从当前accepted v0.4.1原地forward install，必须从immutable v0.4.1 installed state冻结新的exact predecessor合同，不能只猜测改版本字符串。
- 上述两个contract字节变化后，`upstream-manifest.json`中的对应raw SHA必须一起更新；相关contracts/installer/release-package/repository tests也必须同步。`install.js`消费通用package/transition contract，当前没有证据需要修改核心逻辑。
- 新`init-cloud-sandbox-v0.4.2.bash`应先使用64位zero hash进入Source/Candidate；候选ZIP输入冻结并双构建一致后才写exact ZIP SHA。旧v0.4.1 bootstrap继续承担accepted/immediate-fallback窗口，不应提前删除。

## Test and contract synchronization map

- `tests/contracts.test.js`当前把transition标题和predecessor版本冻结为v0.4.0；物化v0.4.2时应改为exact v0.4.1 predecessor，并继续保留单一12-file inventory断言。
- `tests/repository-boundary.test.js`当前有一项专门冻结“治理阶段candidate==accepted==v0.4.1、v0.4.2 RC未授权”的临时状态测试。进入candidate gate后该测试必须改写为v0.4.2 candidate + v0.4.1 accepted + v0.4.0 fallback，而不能为了绿色保留旧package身份。
- 同一repository-boundary测试会动态要求`CHANGELOG`首段等于package version、存在`docs/<candidate>-cloud-hard-acceptance.md`、未发布candidate不进入provenance；这正好给出candidate准备顺序。
- `tests/release-package.test.js`、`tests/bootstrap.test.js`和builder从package/Release contract动态派生candidate与bootstrap，大部分不需硬编码修改；新文件与合同identity闭合后它们会验证zero-hash/精确hash、deterministic ZIP和guide存在性。
- v0.4.2 identity transaction会修改contracts/manifest/package/bootstrap与相关tests，但仍不需要改`install.js`、adapter或runtime算法；这应归类为Release identity/transition contract物化，不是新产品行为。

## Candidate-readiness retirement checkpoint

- 当前`.planning/`共有24个scope：本审计1个active，另有23个非active账本。它们不进入Release ZIP，但属于第一retirement checkpoint必须逐项`RETIRE/MIGRATE/KEEP`的施工对象，不能在Source/Candidate前完全不审查。
- 前序审计已确认大多数completed scopes在planning外零入链，但v0.4.1 Phase 9 scope仍被repository-boundary test直接读取。若本轮决定批量退役planning，应先把该证据依赖迁移到v0.4.1 acceptance/provenance，再清目录；这应作为独立有界事务，不夹进package identity机械改号。
- `MAINTAINER_HANDOFF.md`仍保持导诊角色，没有复制Phase 9或Release教程；无需同步版本内容。

## Final synchronization classification

### 现在保持不动

- `install.js`、`hooks/`、`runtime/`：核心算法相对v0.4.1未变，不应为版本号制造伪改动。
- README、ARCHITECTURE、DESIGN、AGENTS、MAINTAINER_HANDOFF：当前职责和事实一致，无需额外版本化叙述。
- `BASELINE_PROVENANCE.md`、`docs/v0.4.1-cloud-hard-acceptance.md`：继续保存已发布v0.4.1事实，v0.4.2公开身份形成前不得改写或预填。

### v0.4.2 candidate准备必须原子同步

- candidate-readiness planning与第一retirement checkpoint；决定23个非active scopes的`RETIRE/MIGRATE/KEEP`。
- `CHANGELOG.md`顶部新增v0.4.2实际治理delta；`ROADMAP.md`只在RC获批时把当前列车推进到candidate状态。
- 新建`docs/v0.4.2-cloud-hard-acceptance.md`作为single-Discovery Release operator guide，并冻结Pre-run/双通道/停止条件。
- `package.json`、`contracts/release-artifact-v2.json`、从immutable v0.4.1生成的`contracts/installed-state-transition-v1.json`、`upstream-manifest.json`两项contract SHA、新`init-cloud-sandbox-v0.4.2.bash` zero hash及相邻tests。
- 该原子事务完成后重新运行完整suite、deterministic双构建/check与Source/Candidate Cloud；当前34项PASS不能替代v0.4.2 candidate证据。

### 真实Release事件发生后再写

- Source/Candidate PASS后在v0.4.2 guide追加channel checkpoint并形成C1治理commit；正式tag仍指向实际PASS的C0。
- Pre-release和双资产真实存在后才向provenance登记v0.4.2 URL/size/SHA，并启动独立Published Release Cloud。
- Published PASS、Latest/postflight与第二retirement checkpoint闭合后，才写C2/final Post-run并轮转ROADMAP accepted/fallback角色。

## Current validation

- 当前状态运行architecture/contracts/bootstrap/release-package/repository-boundary五个测试模块：34 tests PASS、0 fail。
- 该结果证明当前checkout作为`package 0.4.1 + v0.4.2-dev documentation governance`自洽；不证明尚未物化的v0.4.2 candidate或Release。
