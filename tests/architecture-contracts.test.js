"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const readText = relative => fs.readFileSync(path.join(root, relative), "utf8");

test("cross-document fragments use stable explicit anchors", () => {
  const authorityDocs = [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md",
    "DESIGN.md", "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md",
  ];
  const discovered = [];

  for (const source of authorityDocs) {
    const sourceText = readText(source);
    const linkPattern = /\]\(([^)#]+\.md)#([^)]+)\)/g;
    for (const match of sourceText.matchAll(linkPattern)) {
      const [, relativeTarget, fragment] = match;
      const targetPath = path.resolve(root, path.dirname(source), relativeTarget);
      assert.equal(fs.existsSync(targetPath), true, `${source}: missing target ${relativeTarget}`);
      assert.match(fragment, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/, `${source}: unstable fragment #${fragment}`);
      const targetText = fs.readFileSync(targetPath, "utf8");
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const explicitAnchor = new RegExp(`<a\\s+(?:name|id)=["']${escaped}["']\\s*><\\/a>`, "i");
      assert.match(targetText, explicitAnchor, `${source}: target lacks explicit anchor #${fragment}`);
      discovered.push(`${source}->${path.basename(relativeTarget)}#${fragment}`);
    }
  }

  assert.equal(discovered.length, 9, `unexpected root authority fragment inventory: ${discovered.join(", ")}`);
});

test("MAINTAINER_HANDOFF is a triage desk, not another mutable runbook", () => {
  const handoff = readText("MAINTAINER_HANDOFF.md");
  const artifact = readJson("contracts/release-artifact-v1.json");

  for (const heading of [
    "# 维护者接手导诊",
    "## 1. 新人五分钟接手",
    "## 2. 高频情形导诊",
    "## 3. 常见安全误判",
    "## 4. 能力与健康检测结果分流",
    "## 5. 停止条件与接手完成标准",
  ]) assert.match(handoff, new RegExp(`^${heading.replaceAll(".", "\\.")}$`, "m"));

  for (const target of [
    "README.md#documentation-map", "README.md#local-development",
    "DESIGN.md#module-responsibilities", "ARCHITECTURE.md", "ROADMAP.md", "CHANGELOG.md",
    "BASELINE_PROVENANCE.md", ".planning/.active_plan", "docs/",
  ]) assert.match(handoff, new RegExp(target.replaceAll(".", "\\.")));

  for (const signal of [
    "healthy", "repairable", "blocker", "platform limitation",
    "product defect", "test defect", "fixture drift",
  ]) assert.match(handoff, new RegExp(signal, "i"));

  assert.doesNotMatch(handoff, /```/);
  assert.doesNotMatch(handoff, /\bv?\d+\.\d+\.\d+(?:[-.][A-Za-z0-9.]+)?\b/);
  assert.doesNotMatch(handoff, /\b[a-f0-9]{7,64}\b/i);
  assert.doesNotMatch(handoff, /GitHub `Latest`|当前事实|Product Phase \d+/);
  assert.doesNotMatch(handoff, /\b\d+\s+(?:entries|bytes|tests?|passed|failed|skipped|PASS|FAIL|SKIP)\b/i);
  assert.doesNotMatch(handoff, /build_release\.py build|sha256sum|mktemp|git reset/);
  assert.doesNotMatch(handoff, /^## .*?(?:Source\/runtime 更新|Candidate\/Release ZIP|正式 Release|M4 仓库切换|回滚)$/m);
  assert.equal(artifact.entries.some(entry => entry.path === "MAINTAINER_HANDOFF.md"), false);
});

test("canonical plan-context architecture is exact, plan-first, and adapter-thin", () => {
  const request = readJson("contracts/adapter-plan-context-request-v1.schema.json");
  const result = readJson("contracts/plan-context-result-v1.schema.json");
  const bundle = readJson("contracts/runtime-bundle-v1.json");
  const artifact = readJson("contracts/release-artifact-v1.json");
  const upstream = readJson("upstream-manifest.json");
  const architecture = readText("ARCHITECTURE.md");
  const design = readText("DESIGN.md");

  assert.equal(request.properties.schema_version.const, 1);
  assert.equal(request.properties.runtime.const, "codex");
  assert.deepEqual(request.properties.event.properties.name.enum, ["SessionStart", "UserPromptSubmit"]);
  assert.equal(request.properties.policy.properties.behavior_profile.const, "managed_legacy");
  assert.equal(request.properties.output_budget.properties.max_context_chars.const, 20000);
  assert.equal(request.properties.output_budget.properties.max_plan_lines.const, 50);
  assert.equal(request.properties.output_budget.properties.max_progress_lines.const, 20);
  assert.equal(Object.hasOwn(request.properties, "transcript"), false);
  assert.equal(JSON.stringify(request).includes('"prompt"'), false);

  assert.equal(result.properties.schema_version.const, 1);
  assert.ok(result.properties.outcome.enum.includes("context_emitted"));
  assert.ok(result.properties.outcome.enum.includes("plan_state_changed"));
  assert.ok(result.properties.outcome.enum.includes("output_budget_exceeded"));
  assert.equal(result.properties.context.maxLength, 20000);
  assert.deepEqual(result.properties.project.properties.session_attachment.enum, ["legacy", "attached", "detached"]);

  assert.match(architecture, /Plan runtime runs first for both `SessionStart` and `UserPromptSubmit`/);
  assert.match(architecture, /global PWF Skill 保持 pristine/);
  assert.match(architecture, /Managed policy 只认识 adapter/);
  assert.match(architecture, /代码出现在上游或仓库.*前一层不能推导后一层/s);
  assert.match(architecture, /does not resolve planning files/);
  assert.match(architecture, /只有 `runtime\/upstream\/session-catchup\.py` 与 pristine upstream 不同/);
  assert.match(architecture, /verified immutable bytes/);
  assert.match(architecture, /不调用上游 `session-catchup\.py` 的 CLI `main\(\)`/);
  assert.doesNotMatch(architecture, /run owned session-catchup\.py/);
  assert.match(architecture, /validate, identity-check, and freeze transcript bytes \+ reuse pinned owned parser helpers/);
  assert.match(design, /parser helpers（不调用 upstream CLI main）/);
  assert.match(
    design,
    /transcript selection.*identity revalidation.*immutable byte capture.*Cloud event normalization\/dedup.*report rendering/s,
  );
  assert.match(
    design,
    /动态加载完整的 fixed owned `session-catchup\.py` module.*`same_project_path`.*`find_last_planning_update`.*`extract_messages_after`.*`text_content`.*不调用 CLI `main\(\)`/s,
  );
  assert.match(architecture, /Release ZIP 的身份与内容由 machine contract/);
  assert.match(architecture, /已发布资产的精确身份与来源只在.*BASELINE_PROVENANCE/s);

  assert.equal((bundle.local_files || []).some(item => item.id === "owned_plan"), true);
  assert.equal((upstream.managed_runtime.local_files || []).some(item => item.id === "owned_plan"), true);
  assert.equal(artifact.entries.some(item => item.path === "runtime/owned-plan.py"), true);
  assert.equal(artifact.entries.some(item => item.path === "contracts/adapter-plan-context-request-v1.schema.json"), true);
  assert.equal(artifact.entries.some(item => item.path === "contracts/plan-context-result-v1.schema.json"), true);
  assert.equal(artifact.entries.some(item => item.path === "patches/patch_planning_skill.py"), true);
  assert.equal(artifact.entries.length, 23);

  const adapter = readText("hooks/hook_adapter.py");
  assert.match(adapter, /"plan": "owned-plan\.py"/);
  assert.match(adapter, /def build_plan_context_request\(/);
  assert.match(adapter, /def _valid_plan_context_result\(/);
  assert.match(adapter, /def invoke_plan_runtime\(/);
  assert.match(adapter, /ADAPTER_DEADLINE_SECONDS = 27\.0/);
  assert.match(adapter, /CATCHUP_SECONDS = 15\.0/);
  assert.match(adapter, /FINALIZATION_RESERVE_SECONDS = 1\.0/);
  assert.doesNotMatch(adapter, /subprocess\.run\(/);
  assert.match(adapter, /sibling_runtime_path\("plan"\)/);
  assert.match(adapter, /sibling_runtime_path\("catchup"\)/);
  const main = adapter.slice(adapter.indexOf("def main()"));
  assert.ok(main.indexOf('sibling_runtime_path("plan")') < main.indexOf('sibling_runtime_path("catchup")'));
  for (const retired of [
    "def _plan_candidate(", "def _active_slug(", "def resolve_plan(",
    "def session_attachment(", "def plan_file(", "def resolve_project_state(",
  ]) assert.doesNotMatch(adapter, new RegExp(retired.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(adapter, /task_file\.read_text|progress_file\.read_text/);
});

test("README owns the document map while DESIGN owns the repository implementation map", () => {
  const readme = readText("README.md");
  const design = readText("DESIGN.md");
  const roadmap = readText("ROADMAP.md");
  const agents = readText("AGENTS.md");
  const artifact = readJson("contracts/release-artifact-v1.json");
  const ownedPlan = readText("runtime/owned-plan.py");
  const adapter = readText("hooks/hook_adapter.py");

  assert.match(readme, /## 开发状态与文档地图/);
  for (const authority of [
    "ARCHITECTURE.md", "DESIGN.md", "CHANGELOG.md", "ROADMAP.md", "BASELINE_PROVENANCE.md",
    "MAINTAINER_HANDOFF.md", "docs/repository-governance-guide.md",
  ]) assert.match(readme, new RegExp(authority.replace(".", "\\.")));
  assert.doesNotMatch(readme, /当前源码\/package 身份|当前已接受的 rollback|previous fallback/);
  assert.doesNotMatch(readme, /## 仓库地图/);
  assert.doesNotMatch(readme, /构建当前 0\.3\.1 候选 ZIP|当前 ZIP 必须包含精确 23 entries/);

  assert.match(design, /^# 仓库实现设计/m);
  assert.match(design, /## 1\. 文档定位/);
  assert.match(design, /## 2\. 仓库地图/);
  for (const implementationPath of [
    "install.js", "hooks/hook_adapter.py", "runtime/owned-plan.py", "runtime/owned-catchup.py",
    "tools/import_upstream_runtime.py", "tools/build_release.py",
  ]) assert.match(design, new RegExp(implementationPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(design, /当前生产回滚|GitHub `Latest`|Product Phase 4.*未授权/);
  assert.equal(artifact.entries.some(entry => entry.path === "DESIGN.md"), false);

  assert.doesNotMatch(roadmap, /\| 当前允许做什么、唯一 Next Step 是什么 \|/);
  assert.match(roadmap, /README\.md.*开发状态与文档地图/);
  assert.match(agents, /README\.md.*开发状态与文档地图/);
  assert.match(agents, /DESIGN\.md/);
  assert.doesNotMatch(ownedPlan, /Inactive managed plan-context runtime|Phase 3 Round 4/);
  assert.doesNotMatch(adapter, /inactive exact-v1 owned-plan request/);
});

test("ARCHITECTURE preserves system reasoning while DESIGN routes implementation changes", () => {
  const architecture = readText("ARCHITECTURE.md");
  const design = readText("DESIGN.md");
  const agents = readText("AGENTS.md");

  for (const architectureSection of [
    "## 2. 为什么需要适配层", "## 3. 部署图", "## 4. Runtime 数据流",
    "## 7. 信任分层", "## 8. 失败语义",
  ]) assert.match(architecture, new RegExp(architectureSection.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(architecture, /\[.*DESIGN.*\]\(DESIGN\.md\)/);

  for (const designSection of [
    "## 3. 实现布局", "## 4. 模块职责与依赖", "## 5. 按变更目标定位",
    "## 6. 验证路由",
  ]) assert.match(design, new RegExp(designSection.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  for (const target of [
    "contracts/runtime-bundle-v1.json", "contracts/release-artifact-v1.json",
    "tests/installer.test.js", "tests/hook-adapter.test.js", "tests/owned-plan-runtime.test.js",
    "tests/owned-runtime.test.js", "tests/import-runtime.test.js", "tests/release-package.test.js",
    "tests/published-release-oracles.test.js",
  ]) assert.match(design, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(design, /repository source.*Release ZIP.*installed managed runtime/is);
  assert.match(design, /入口.*直接依赖.*影响.*验证/s);
  assert.doesNotMatch(design, /ADAPTER_DEADLINE_SECONDS|20,000|50 \/ 20|当前生产回滚|GitHub `Latest`/);
});

test("DESIGN maps every test module back to the capability and boundary it protects", () => {
  const design = readText("DESIGN.md");
  const start = design.indexOf("### 6.1 测试职责反向索引");
  const end = design.indexOf("## 7. 继续阅读", start);
  assert.notEqual(start, -1, "DESIGN lacks the reverse test responsibility index");
  assert.notEqual(end, -1, "DESIGN reverse test responsibility index has no section boundary");
  const reverseIndex = design.slice(start, end);

  for (const column of ["测试文件", "主要保护内容", "直接对象/边界", "平台属性"]) {
    assert.match(reverseIndex, new RegExp(column));
  }

  const testModules = fs.readdirSync(path.join(root, "tests"), { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith(".test.js"))
    .map(entry => entry.name)
    .sort();
  const documentedModules = [...reverseIndex.matchAll(/\]\(tests\/([^)]+\.test\.js)\)/g)]
    .map(match => match[1])
    .sort();
  assert.deepEqual(documentedModules, testModules);
  for (const module of testModules) {
    const link = `](tests/${module})`;
    assert.equal(reverseIndex.split(link).length - 1, 1, `${module}: expected one reverse-index row`);
  }

  assert.match(reverseIndex, /test title.*assertion/is);
  assert.doesNotMatch(reverseIndex, /\b\d+\s+(?:tests?|cases?|passed|failed|skipped)\b/i);
});

test("change history, programme intent, current action, and immutable evidence have separate authorities", () => {
  const changelog = readText("CHANGELOG.md");
  const roadmap = readText("ROADMAP.md");
  const provenance = readText("BASELINE_PROVENANCE.md");
  const architecture = readText("ARCHITECTURE.md");
  const design = readText("DESIGN.md");
  const agents = readText("AGENTS.md");
  const artifact = readJson("contracts/release-artifact-v1.json");

  for (const heading of [
    "## v0.3.2", "## v0.3.1", "## v0.3.0", "## v0.3.0-beta.2",
  ]) assert.match(changelog, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const target of ["ROADMAP.md", "BASELINE_PROVENANCE.md", "docs/v0.3.2-cloud-hard-acceptance.md"]) {
    assert.match(changelog, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(changelog, /trusted.*exact.*planning.*lifecycle/is);
  assert.match(changelog, /candidate.*accepted.*role window/is);
  assert.doesNotMatch(changelog, /## Unreleased — 0\.3\.2-dev(?:-extend)?/);
  const stable032Start = changelog.indexOf("## v0.3.2\n");
  const stable031Start = changelog.indexOf("## v0.3.1\n");
  assert.ok(stable032Start >= 0 && stable031Start > stable032Start);
  const stable032Section = changelog.slice(stable032Start, stable031Start);
  assert.match(stable032Section, /trusted.*exact.*planning.*lifecycle/is);
  assert.match(stable032Section, /candidate.*accepted.*role window/is);
  assert.match(stable032Section, /没有改变.*runtime.*Host ABI.*trusted graph/is);
  const stable030Start = changelog.indexOf("## v0.3.0\n");
  assert.ok(stable031Start >= 0 && stable030Start > stable031Start);
  const stable031Section = changelog.slice(stable031Start, stable030Start);
  assert.match(
    stable031Section,
    /Managed TOML.*lock transaction.*transcript.*immutable bytes.*byte budget.*Node.*fixed SHA.*patcher/is,
  );
  assert.doesNotMatch(stable031Section, /\b[a-f0-9]{40,64}\b|GitHub `Latest`|production rollback|M[1-4]/);
  assert.doesNotMatch(changelog, /\b[a-f0-9]{64}\b|Next Step|GitHub `Latest`|production rollback|\d+ registered/);
  assert.equal(artifact.entries.some(entry => entry.path === "CHANGELOG.md"), false);

  assert.match(roadmap, /\| 当前开发列车 \| `v0\.3\.2` Release candidate.*published.*Cloud pending.*尚未 accepted/s);
  assert.match(roadmap, /\| 当前已接受版本 \| `v0\.3\.1`/);
  assert.match(roadmap, /活动.*task_plan.*当前唯一 Next Step/s);
  assert.match(roadmap, /一个 active planning.*candidate.*accepted role window.*immutable/s);
  assert.match(roadmap, /## 3\. 已完成的基线 `v0\.3\.1`/);
  assert.match(roadmap, /Managed TOML.*lock.*transcript.*Host input.*bootstrap.*patcher/is);
  assert.doesNotMatch(roadmap, /## 3\. 已完成的仓库迁移|M1 exact mirror|M2 slim transformation/);
  assert.equal((roadmap.match(/GitHub `Latest`/g) || []).length, 1);

  for (const identity of [
    "v0.3.2", "c68a53bdeab7c38badcfb4e2a733ddd851e498e4",
    "b42aecafaba650e5595acef8c138d142747da38dde04fa78bfb0a7f4235e5081",
    "aa2c1fd64bfc8ee3804d5f4bf39f7816a2ca9ad9a96949336ec94a6c20f8f77c",
    "v0.3.1", "9aa2148886e499f9f45594f7ae4f7681f1045de2",
    "v0.3.0", "1454c9224c83d11c073b05baf6e536a11c3bb0e5",
    "v0.3.0-beta.2", "bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b",
  ]) assert.match(provenance, new RegExp(identity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(provenance, /## 2\. Successor 迁移来源链[\s\S]*`v0\.3\.0-beta\.2`\s*→\s*`v0\.3\.0`/);
  assert.match(provenance, /M1 exact mirror.*M2 slim transformation.*M3 Cloud equivalence.*M4 repository cutover/is);
  assert.match(provenance, /3234e4e02090c838f5ee260cd8f2d99daf358d65/);
  assert.match(provenance, /c5236958b9830ee3695b0e81e1a0746707a6b8f9/);
  assert.doesNotMatch(provenance, /当前源码权威|current lifecycle role|GitHub `Latest`|\d+ registered/);

  for (const macroDoc of [architecture, design, agents]) {
    assert.doesNotMatch(macroDoc, /当前生产回滚|当前回退层级|GitHub `Latest`|production rollback/);
  }
  assert.match(agents, /当前版本角色只见 `ROADMAP\.md`/);
  assert.match(design, /CHANGELOG\.md/);

  const acceptance032Path = path.join(root, "docs", "v0.3.2-cloud-hard-acceptance.md");
  assert.equal(fs.existsSync(acceptance032Path), true);
  const acceptance032 = fs.readFileSync(acceptance032Path, "utf8");
  assert.match(acceptance032, /^# v0\.3\.2 Cloud hard acceptance$/m);
  assert.match(acceptance032, /当前状态.*PUBLICATION-PASS.*Cloud.*PENDING/is);
  assert.match(acceptance032, /b42aecafaba650e5595acef8c138d142747da38dde04fa78bfb0a7f4235e5081/);
  assert.doesNotMatch(acceptance032, /PENDING_R2|PENDING_R3_BOOTSTRAP_SHA256/);
  assert.match(acceptance032, /c68a53bdeab7c38badcfb4e2a733ddd851e498e4/);
  assert.match(acceptance032, /R4 immutable publication \| `PASS`/);
  assert.match(acceptance032, /releases\/download\/v0\.3\.2\/init-cloud-sandbox-v0\.3\.2\.bash/);
  assert.match(acceptance032, /R5-SC.*Source\/Candidate.*HOOKS_URL.*HOOKS_SHA256/is);
  assert.match(acceptance032, /R5-PR.*Published Release.*默认.*下载/is);
  assert.match(acceptance032, /两条通道不得共用容器、安装状态或 B～F 结果/);
  assert.match(acceptance032, /V032_SOURCE_CANDIDATE_SETUP=PASS/);
  assert.match(acceptance032, /V032_PUBLIC_RELEASE_SETUP=PASS/);
  assert.match(acceptance032, /published-release-oracles\.test\.js/);
  assert.match(acceptance032, /tagless.*Source\/Candidate/is);
  assert.match(acceptance032, /V032_SC_EXCLUDED_TEST_SUITE=published-release-oracles\.test\.js/);
  assert.match(acceptance032, /PENDING_R5_SC.*PENDING_R5_PR.*PENDING_R5/is);
  assert.match(acceptance032, /Fresh.*canonical.*long tail.*real Resume.*doctor/is);
  assert.match(acceptance032, /不授权.*Latest.*rollback/is);
});

test("ROADMAP discovery governance separates new rounds from in-round safety gates", () => {
  const roadmap = readText("ROADMAP.md");
  const discoveryStart = roadmap.indexOf("## 6. Discovery 与 gate 晋级模型\n");
  const releaseStart = roadmap.indexOf("## 7. Release 授权与封板顺序\n");
  assert.ok(discoveryStart >= 0 && releaseStart > discoveryStart);
  const discovery = roadmap.slice(discoveryStart, releaseStart);

  assert.match(discovery, /新 Product Phase.*第一轮.*Discovery/is);
  assert.match(discovery, /激活.*迁移.*删除旧.*schema.*Host ABI.*trusted graph.*Release.*rollback/is);
  assert.match(discovery, /架构.*契约.*Phase 范围.*信任.*Release.*回滚.*正式增加.*Round/is);
  assert.match(discovery, /架构不变.*Round 内.*A\/B\/C.*子门槛/is);
  assert.match(discovery, /测试补漏.*文档同步.*局部 bug.*不.*增加.*探路轮/is);
  assert.match(discovery, /新证据.*差异.*可选路线.*代价.*不变量.*非目标.*停止条件/is);
  assert.match(discovery, /本地测试.*Cloud.*回滚.*GO.*CONDITIONAL_GO.*NO_GO/is);
  assert.match(discovery, /暂停.*production dispatch.*发布哈希.*外部.*不变/is);
  assert.match(discovery, /实现正确.*架构方向错/is);
});

test("Release governance routes tests by checkout prerequisites without forging refs", () => {
  const roadmap = readText("ROADMAP.md");
  const releaseStart = roadmap.indexOf("## 7. Release 授权与封板顺序\n");
  const retentionStart = roadmap.indexOf("## 8.", releaseStart);
  assert.ok(releaseStart >= 0 && retentionStart > releaseStart);
  const release = roadmap.slice(releaseStart, retentionStart);

  assert.match(release, /Source\/Candidate.*Published Release/is);
  assert.match(release, /tagless.*checkout.*remote.*tag/is);
  assert.match(release, /publication-only.*oracle.*分流/is);
  assert.match(release, /不得.*创建.*tag.*伪造.*前置条件/is);
  assert.match(release, /完整.*suite.*封板.*publication/is);
  assert.match(release, /公开.*URL.*SHA.*默认.*下载/is);
});
