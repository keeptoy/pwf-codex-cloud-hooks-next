<a name="acceptance-role-window"></a>

# Acceptance role window

本目录保存当前分支中**新建或尚未冻结**的版本 acceptance/operator guide；它只是专项文档的发现入口，
不维护第二份版本状态。当前角色、Release授权与C0/C1/C2顺序只读根
[`ROADMAP`](../../ROADMAP.md#release-four-step-flow)，具体文件保存各自教程和已经实际形成的证据。

当前树按candidate + accepted角色窗口保留验收材料，不等于“只留最新一份”。已经冻结且仍承担accepted职责的guide
可以继续作为current副本；旧版guide在角色退出前也可保留原路径，避免改写其时间语义、相对链接或字面执行指令。
退出角色窗口后，再按[`仓库治理指南`](../repository-governance-guide.md#acceptance-directory-lifecycle)迁往exact immutable refs并
清退current副本；因此当前目录不保证为每个历史版本保留本地副本。

Cloud协议与guide结构模板继续位于`docs/`根的稳定路径。目录分层不能成为复制template、保留兼容副本或建立第二份
programme authority的理由。
