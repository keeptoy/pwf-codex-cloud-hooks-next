# Progress: v0.4.3 Source/Candidate C0

## 2026-08-25

- 创建独立 C0 planning scope，并切换 active pointer。
- 冻结停止边界：本轮只做本地候选身份、验收入口、验证和 C0 commit；不做远端写入，不提前记录 Cloud PASS。
- 完成candidate admission preflight：确认原子改号面、current文档同步面、动态acceptance角色窗口和本地验证路线；三个planning scope全部KEEP，未做删除。
- stable identity、`v0.4.3` zero-hash bootstrap、PENDING acceptance及programme/overview/guard同步已物化；importer check首先PASS。
- 首次并行focused `node --test <四文件>`在Windows runner创建test worker时统一`spawn EPERM`，四个文件均未进入case执行；分类为本地执行面限制，不是产品断言失败。改用逐文件直接`node tests/<file>`运行同一测试定义。

## Error ledger

| Error | Attempt | Classification / resolution |
|---|---:|---|
| `node --test`多文件worker全部`spawn EPERM` | 1 | Windows受限进程执行面；改用Node直接加载每个test module，避免runner再派生worker，不弱化断言。 |
| focused direct run中`repository-boundary`报告active task plan缺少exact `## Authorization` | 1 | planning schema drift；拆分为测试要求的`Authorization`、`Stop Conditions`与`Next Step`稳定标题后重跑。 |
| 完整suite中architecture contract要求第4节保留“当前exact开发列车”稳定句式 | 1 | 文档稳定接口措辞漂移；恢复通用“开发列车”术语，并在同句补充stable C0候选状态，不改测试合同。 |
| focused复验继续命中旧dev语义“尚不表示stable candidate” | 1 | 版本身份已合法进入stable C0，该旧断言不再成立；保留版本无关边界并更新为“stable source identity仍不表示Cloud PASS/tag/Release”。 |

## Local C0 evidence

- Focused：contracts `5/5`、release assets `4/4`、release package `3/3`、repository boundary `16/16`、architecture contracts `9/9`。
- 完整Windows suite：`tests=187 / pass=161 / fail=0 / skipped=26`；skip均为合同标记的Linux/POSIX case，不能替代Source/Candidate Cloud零skip证据。
- Importer check：`healthy=true`，四个pinned pristine upstream文件hash闭合。
- Candidate bootstrap check：`state=unchanged`，version=`v0.4.3`，ZIP SHA为64位zero；bootstrap自身SHA-256为`32d63468cf06eb5a518b97af8a3b095983fe637f46e8f67f01307855e2222ef1`。
- Candidate ZIP双构建：`entries=22`、`size=90,364`、SHA-256=`cfcabcc93c819e2d512a1b9cf0b3f13a451ffea8c82631012b74a64813150231`，两份字节完全一致；该SHA仅是本地C0预检，不冒充Cloud evidence或正式发布资产。
- Python production modules compile、`node --check install.js`、v0.4.2/v0.4.3两个root bootstrap `bash -n`、四个upstream Git mode `100755`及`git diff --check`均PASS。
- 最终candidate admission与staged diff审查通过：14个路径，bootstrap为99% rename；无未分类用户改动，ignored `dist/`只含本地候选预检产物。本次单一commit即C0，提交后停止在远端动作之前。

## 2026-08-26

- 维护者回传Source/Candidate第一通道全部PASS；9.1明确`exit 0`且`PWF_DEEP_CHECK_HEAD=6204de36cd8b2cbc614a4bb53b8481a5a1ba234d`，与C0完全一致。
- 核对doctor、schema、inventory、bundle authority、adapter-only policy与snapshot residue全部闭合；按维护者结论直接进入C1，不要求重跑。
- 完成source-candidate closeout retirement checkpoint：所有planning、accepted窗口材料、C0输入、templates和当前guide均KEEP；没有删除或修改任何Release输入。
- 4.1 Cloud ZIP SHA未包含在本次摘要中，正式non-zero双资产保持未物化；C1之后仍须使用真实Cloud SHA，不能用本地候选SHA替代。

### C1 error ledger

| Error | Attempt | Classification / resolution |
|---|---:|---|
| architecture contract仍要求C0阶段“stable candidate未形成”措辞 | 1 | 合法lifecycle推进使旧阶段断言失效；改为版本无关的“stable source或Source/Candidate PASS不自动等于tag/public assets/Published Release”边界。 |
| repository boundary仍冻结v0.4.3 Source/Candidate为PENDING | 1 | 维护者已提供exact C0 PASS；将版本专项断言推进为exact C0、第一retirement完成且Published Release待运行。 |

### C1 local validation

- Architecture contracts：`9/9 PASS`。
- Repository boundary：`16/16 PASS`，包括Markdown显式anchors、candidate+accepted guide窗口、planning schema与exact C0 lifecycle断言。
- `git diff --check`：PASS。
- C1改动仅覆盖acceptance、ROADMAP、planning和相应静态断言，全部为Release-excluded；未修改package、contract、manifest、runtime、bootstrap、README或22项ZIP输入。

## 2026-08-26 Published Release and Latest writeback

- 维护者明确确认：固定版本`0.4.3`模板的Published Release整条通道全部PASS，9.2 exit 0。
- 核对并写入公开identity：C0 tag source、90,364-byte ZIP及SHA、21,565-byte bootstrap及SHA、22/12/4 inventory、healthy doctor、adapter-only policy、零residue和`PWF_PUBLIC_POST_RESUME=PASS`。
- GitHub `/releases/latest`只读查询返回`v0.4.3`，Release为non-draft、non-prerelease；Latest confirmation成立。
- acceptance、ROADMAP和planning推进到`STOP_BEFORE_ROLE_WINDOW_CLOSEOUT`；未删除planning、v0.4.2 guide/bootstrap，未轮转accepted/fallback，未创建C2。

### Published writeback error ledger

| Error | Attempt | Classification / resolution |
|---|---:|---|
| sandbox内`curl.exe`因Windows Schannel缺少credential而未下载bootstrap | 1 | 本地执行面限制；改用获批的只读网络调用并加`--ssl-no-revoke`，成功取得公开bootstrap与Release metadata。 |
| sandbox内`node --test tests/repository-boundary.test.js`启动runner时返回`spawn EPERM` | 1 | Windows沙箱进程限制；按环境规则在获批的沙箱外重跑，同一suite `16/16 PASS`。 |
| architecture contract仍冻结Source/Candidate尚未形成tag/publication的C1状态 | 1 | 合法lifecycle推进使旧阶段断言失效；更新为双通道与Latest PASS仍不授权删除planning或提前声明C2。 |
| 沙箱内`git add`无法创建`.git/index.lock` | 1 | workspace可写但`.git`为只读边界；改用获批的本地Git写操作创建单一范围commit。 |

### Published writeback local validation

- Architecture contracts：`9/9 PASS`。
- Repository boundary：`16/16 PASS`，包括exact public identity、Latest状态、accepted暂不轮转、planning不自动删除与C2停止点。
- `git diff --check`：PASS。
- 本次只修改Release-excluded acceptance、ROADMAP、planning与静态治理断言；没有修改package、contract、runtime、installer、README或22项ZIP输入。

## 2026-08-26 Role-window closeout / C2

- 维护者批准第二轮方案；先把v0.4.2 guide的长期入链迁到exact C2 commit `33deb5870015c94df329fe233e306363ba43232b`，再删除current guide/bootstrap。两者仍可由immutable Git/Release恢复。
- 四个planning scope全部KEEP；v0.4.3 guide/bootstrap KEEP/FREEZE；publication oracle随ROADMAP迁到v0.4.3 accepted与v0.4.2 immediate fallback。
- v0.4.3 tracked bootstrap从C0 zero-hash candidate冻结为公开exact bytes：21,565 bytes，SHA-256 `f738d61551aee20d924e565fe59f5a360a6c13fa2e40dc7e63e7e63e06485c37`。
- ROADMAP current train改为`NONE`，accepted/fallback/deeper-fallback轮转为v0.4.3/v0.4.2/v0.4.1；Phase 4 overview、provenance与acceptance final Post-run同步。

### C2 error ledger

| Error | Attempt | Classification / resolution |
|---|---:|---|
| 首轮五组回归`32/36 PASS`：ROADMAP重复链接同一acceptance anchor；materializer拒绝accepted exact-hash bootstrap；v0.4.0角色断言仍要求deeper fallback | 1 | 全部为closeout lifecycle/test drift。ROADMAP第4节改指guide anchor；materializer收窄为canonical zero或本次expected SHA sealed render；v0.4.0断言更新为provenance museum。复跑`36/36 PASS`。 |
| 首轮完整suite仅publication oracle失败：它从C0 tag读取zero-hash候选bootstrap，却与公开non-zero bootstrap SHA比较 | 1 | oracle错误耦合C0源码身份与C2正式外部资产身份；拆分为tag/source/Candidate ZIP验证和accepted tracked bootstrap验证，保留旧fallback的explicit sealed-source路径。专项`9/9 PASS`，完整suite随后全绿。 |
| 直接materializer复验在受限Windows进程内两次因Python默认临时目录ACL返回`WinError 5`，第二次留下一个受限临时目录 | 2 | platform limitation，不是断言失败；只读确认目标为本轮创建的普通目录后有界清理，再在获批执行面运行同一命令并PASS。 |
| Git Bash语法检查在受限进程内无法创建signal pipe | 1 | Windows sandbox limitation；在获批执行面重跑同一`bash -n`并PASS。 |

### C2 local validation

- Publication oracle专项：`9/9 PASS`；C0 tag精确解析到`6204de36cd8b2cbc614a4bb53b8481a5a1ba234d`，accepted/fallback恢复窗口闭合。
- 完整Windows suite：`tests=187 / pass=161 / fail=0 / skipped=26`；skip均为明确的Linux/POSIX case。
- Importer：`healthy=true`；Release builder/check：`entries=22`、`size=90,364`、SHA-256 `cfcabcc93c819e2d512a1b9cf0b3f13a451ffea8c82631012b74a64813150231`，与公开ZIP完全一致。
- Release materializer在accepted exact-hash状态PASS，生成bootstrap `21,565` bytes、SHA-256 `f738d61551aee20d924e565fe59f5a360a6c13fa2e40dc7e63e7e63e06485c37`及同一公开ZIP身份。
- Python compile、`node --check install.js`、`bash -n init-cloud-sandbox-v0.4.3.bash`和`git diff --check`全部PASS；验证临时残留已清理。
