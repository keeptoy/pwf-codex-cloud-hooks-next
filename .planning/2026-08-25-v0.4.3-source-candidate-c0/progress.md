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
