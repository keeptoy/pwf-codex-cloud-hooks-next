<a name="acceptance-role-window"></a>

# Acceptance 文档导航

本目录保存新建、正在执行以及已经冻结的版本 acceptance/operator guide；本README就是这些文档的目录索引，
不维护第二份版本状态。当前角色、Release授权与C0/C1/C2顺序只读根
[`ROADMAP`](../../ROADMAP.md#release-four-step-flow)，具体文件保存各自教程和已经实际形成的证据。

当前执行入口按已进入Release guide生命周期的candidate + accepted角色窗口选择，不等于“只留最新一份”。单独把
source/package身份收敛为不带`-dev`的pre-C0 candidate，并不会在Release尚未授权时凭版本字符串自动创建acceptance；只有
正式Release入口获批并物化Pre-run guide后，candidate槽位才进入本目录。已经冻结且仍承担accepted职责的guide可以继续作为
current副本；旧版guide在角色退出前也可保留原路径，避免改写其时间语义、相对链接或字面执行指令。
single-Discovery列车的candidate槽位使用`vX.Y.Z-cloud-hard-acceptance.md`；已有多个Discovery Round的列车在版本级Release
closeout使用`vX.Y.Z-release-operator-guide.md`。两者都只允许一个当前candidate Release入口，后者不汇总或替代各Round guide。
退出角色窗口后，默认按[`仓库治理指南`](../repository-governance-guide.md#acceptance-directory-lifecycle)保留原路径、原始内容和
验收证据，在下面的“冻结历史记录”登记exact immutable refs与文件SHA-256。保留的旧guide用于查阅、审计和恢复，不再作为当前
版本的执行入口；两次retirement review仍照常执行，其处置记为`KEEP / FROZEN_HISTORY`。已在旧规则下清退的文件不自动恢复。

<a name="acceptance-current-guides"></a>

## 当前验收入口

新文档保存本次教程，并在真实执行后追加channel checkpoint与最终结果；guide冻结后，只要仍承担accepted职责，就继续属于
当前入口。当前应执行哪份教程由[`ROADMAP当前开发列车`](../../ROADMAP.md#current-development-train)与活动task plan选择；
此处只提供文件导航，不复制accepted/fallback角色表或PASS/PENDING状态。

- [v0.5.0 Release Operator Guide](v0.5.0-release-operator-guide.md)

尚未授权Release的pre-C0 candidate没有对应guide，也不预建教程或填写尚未取得的验收结果。

<a name="acceptance-frozen-history"></a>

## 冻结历史记录

版本退出当前入口后，把它从上述导航移入下表；表中的文档链接继续指向原文件，`source`链接固定到包含最终冻结字节的完整
commit，SHA-256按Git blob原始字节计算。这三项只登记保留证据，不建立新的版本状态或执行authority。历史记录中的PASS只证明
当时的版本和身份；重放时先恢复该冻结源码快照及其模板，不能将旧教程与今天的模板、bootstrap或版本混用。

当前尚无按新规则退出角色窗口的版本级guide；表为空是正常状态。登记时每个原路径只允许一行，当前candidate/accepted不能
被提前标为历史；移动、改写或删除冻结原件都需要另外进行有证据的维护决定。

<!-- BEGIN PWF_FROZEN_GUIDE_REGISTRY_V1 -->
| 文档（原路径） | 冻结源码 | 文件 SHA-256 |
|---|---|---|
<!-- END PWF_FROZEN_GUIDE_REGISTRY_V1 -->

Cloud协议与guide结构模板继续位于`docs/`根的稳定路径。目录分层不能成为复制template、保留兼容副本或建立第二份
programme authority的理由。
