# Findings: Phase 4 harness retrospective

## Initial hypothesis

- 这个仓库已经不只是一个小Hook适配器，也是一套围绕trusted runtime、installer、immutable assets、Cloud lifecycle和programme文档的Release/acceptance harness。
- v0.4.4虽然Product/runtime只增加了一小段README教程，但README属于22-entry Release ZIP输入；改动使候选ZIP字节、source identity与正式tag身份发生变化，所以在现有合同下不能沿用v0.4.3证据。
- “必须产生新C0和新资产身份”与“必须机械重复全部Cloud步骤、全文状态写回和测试同步”不是同一件事；本轮重点是找出后者的可压缩空间。

## Evidence inventory

- Phase 4最终交付不是单一Hook脚本，而是三层组合：小型runtime/installer product、immutable Release supply chain、Cloud/文档/角色窗口acceptance harness。大白话说，当前仓库确实已经是一项harness工程，只是harness服务于一个边界很窄的Product。
- v0.4.4从v0.4.3 C2到v0.4.4 C2共有六个治理/Release commits；整个列车涉及25个路径、约928行新增与376行删除。正式C0本身涉及15个路径和约294行新增，而用户可感知的原始动机只是README补充exact C0 tag教程。
- 放大并非全是浪费：README是22-entry ZIP输入，stable改号同时改变package、Release contract、manifest SHA与external bootstrap identity。因此新C0、确定性ZIP、新SHA、immutable tag和公开资产身份不能复用旧版本。
- 可压缩成本主要来自：每版复制长篇operator guide；在ROADMAP、acceptance、overview、CHANGELOG、provenance、planning之间人工投影状态；治理测试绑定当前版本、角色和自然语言句式；Cloud C步骤依赖长提示词解释文件工具边界；两个retirement checkpoint需要手写重复表格；全套lifecycle证据缺少按critical hash复用的machine admission。
- 本轮实际暴露过三类harness自耗：跨行措辞导致正则漂移、同一authority anchor被重复引用、C2后transition测试仍把predecessor错误绑定accepted而不是fallback。它们没有发现Product缺陷，却增加了closeout迭代。

## Four-way classification

### 必须保留

- exact C0、deterministic ZIP、ZIP外checksum bootstrap、immutable tag/Release和公开资产identity。
- executable/runtime/installer/contract/Host ABI变化时的Linux/Cloud真实平台证据，以及Published Release默认下载链。
- accepted + immediate fallback的可恢复性、unknown state fail closed和公开资产不可改写。
- Source/Candidate与Published Release的身份区别；后者不能在公开URL存在前复用。

### 可以自动化

- 基于Git diff与machine contracts生成change classification、risk fingerprint、required gates和不能复用证据的exact理由。
- 由一个release harness命令生成C0 identity、双构建结果、正式双资产、C1/C2最小证据块和role-window inventory；C0/C1/C2概念保留，但不再人工复制大量正文。
- 版本guide缩成“stable protocol链接 + machine-readable exact inputs/evidence + 例外/失败”；公共教程继续由固定template维护。
- retirement checkpoint保留决策语义，但默认由路径owner、Release inclusion和immutable recovery refs生成清单，只把例外留给人判断。
- Cloud canonical fixture使用一个受测、fail-closed的fixture helper，减少“只能apply_patch、何时允许只读Shell”的提示词解释成本。

### 可以按风险裁剪（必须先有machine classifier）

- `SOURCE_ONLY_GOVERNANCE`：所有变化都在Release-excluded docs/planning/tests，且不改变current authority/contract行为时，只做本地治理验证和commit，不开版本列车、不发布。
- `PACKAGE_DOC_ONLY`：只改变ZIP内用户文档，executable/runtime/installer/contracts/bootstrap template与allowlist均同hash；仍需新C0/ZIP/public identity，但可评估把Cloud范围缩为build/check、default download、install/doctor smoke，而不是重复整套smart/autonomous lifecycle。
- `RELEASE_MECHANICS`：version、builder、allowlist、bootstrap/template或publication路径变化；保留双通道默认下载与资产边界的完整验证。
- `PRODUCT_OR_SECURITY`：runtime、installer、schema、Host ABI、trusted graph、migration/path safety变化；执行当前最严格的完整suite、Linux/Cloud lifecycle、负向安全与rollback/migration gate。
- 任一分类未知、critical fingerprint变化、证据环境不匹配或复用链断裂，都自动回退到更严格lane；不得由“看起来只改文档”人工降级。

### 需要Phase 5 Discovery，不能在本轮直接实施

- 是否把维护者专用Release教程从ZIP内README迁到source-only operator documentation，使类似v0.4.4的教程修改不再改变公开package；README仍保留用户安装与稳定行为摘要。
- 哪些critical hashes足以安全复用Product lifecycle证据，Cloud Host profile/模板版本如何进入fingerprint，缓存何时失效。
- reduced lane的最小Published Release检查到底保留哪些default download、doctor、inventory和Resume证据。
- machine-readable release state/evidence采用何种schema，如何避免再造一套与ROADMAP/acceptance竞争的authority。
- 自动化harness应是薄编排还是新框架；目标必须是减少人工状态同步和误判，不能为了“简化”再增加更重的永久抽象层。
