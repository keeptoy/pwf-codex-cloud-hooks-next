"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const readText = relative => fs.readFileSync(path.join(root, relative), "utf8");
const currentManifest = readJson("upstream-manifest.json");
const currentArtifactPath = currentManifest.managed_runtime.contracts.release_artifact.path;
const currentBundlePath = currentManifest.managed_runtime.contracts.runtime_bundle.path;

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

  assert.ok(discovered.length > 0, "expected at least one cross-document authority fragment");
  assert.equal(new Set(discovered).size, discovered.length, `duplicate authority fragments: ${discovered.join(", ")}`);
});

test("MAINTAINER_HANDOFF is a triage desk, not another mutable runbook", () => {
  const handoff = readText("MAINTAINER_HANDOFF.md");
  const artifact = readJson(currentArtifactPath);

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
  const request = readJson("contracts/adapter-plan-context-request-v2.schema.json");
  const result = readJson("contracts/plan-context-result-v2.schema.json");
  const bundle = readJson(currentBundlePath);
  const artifact = readJson(currentArtifactPath);
  const upstream = readJson("upstream-manifest.json");
  const architecture = readText("ARCHITECTURE.md");
  const catchup = readText("runtime/owned-catchup.py");
  const ownedPlan = readText("runtime/owned-plan.py");
  const installer = readText("install.js");

  assert.equal(request.properties.schema_version.const, 2);
  assert.equal(request.properties.runtime.const, "codex");
  assert.deepEqual(request.properties.event.properties.name.enum, ["SessionStart", "UserPromptSubmit"]);
  assert.equal(request.properties.policy.properties.allowed_profiles.prefixItems[0].const, "legacy");
  assert.equal(request.properties.policy.properties.opt_in_protocol.const, "codex-managed-v1");
  assert.equal(request.properties.output_budget.properties.max_context_chars.const, 20000);
  assert.equal(request.properties.output_budget.properties.max_plan_lines.const, 50);
  assert.equal(request.properties.output_budget.properties.max_progress_lines.const, 20);
  assert.equal(Object.hasOwn(request.properties, "transcript"), false);
  assert.equal(JSON.stringify(request).includes('"prompt"'), false);

  assert.equal(result.properties.schema_version.const, 2);
  assert.ok(result.properties.outcome.enum.includes("context_emitted"));
  assert.ok(result.properties.outcome.enum.includes("plan_state_changed"));
  assert.ok(result.properties.outcome.enum.includes("output_budget_exceeded"));
  assert.equal(result.properties.context.maxLength, 20000);
  assert.deepEqual(result.properties.project.properties.session_attachment.enum, ["legacy", "attached", "detached"]);

  assert.match(architecture, /^<a name="cloud-lifecycle"><\/a>$/m);
  assert.match(catchup, /candidates\.sort\(key=lambda item: item\.mtime_ns, reverse=True\)/);
  assert.match(installer, /timeout = 30/);

  assert.equal((bundle.local_files || []).some(item => item.id === "owned_plan"), true);
  assert.equal(upstream.managed_runtime.schema_version, 3);
  assert.equal(Object.hasOwn(upstream.managed_runtime, "local_files"), false);
  assert.equal(Object.hasOwn(upstream.managed_runtime, "files"), false);
  assert.match(installer, /const RUNTIME_BUNDLE = loadVerifiedRuntimeBundle\(\)/);
  assert.equal(artifact.entries.some(item => item.path === "runtime/owned-plan.py"), true);
  assert.equal(artifact.entries.some(item => item.path === "contracts/adapter-plan-context-request-v2.schema.json"), true);
  assert.equal(artifact.entries.some(item => item.path === "contracts/plan-context-result-v2.schema.json"), true);
  assert.equal(artifact.entries.some(item => item.path === "patches/patch_planning_skill.py"), false);
  assert.match(ownedPlan, /def capture_owned_state\(/);
  assert.equal((ownedPlan.match(/capture_owned_state\(/g) || []).length, 2,
    "F2B production must call the one managed state admission seam");
  assert.match(ownedPlan, /ACTIVATION_FILE = "\.pwf-codex-managed"/);
  assert.match(ownedPlan, /revalidate_owned_state\(plan_fd, owned_state\)/);
  assert.match(ownedPlan, /NONCE_FILE = "\.nonce"/);
  assert.match(ownedPlan, /ATTESTATION_FILE = "\.attestation"/);
  assert.match(ownedPlan, /def capture_normalized_ledgers\(/);

  const adapter = readText("hooks/hook_adapter.py");
  assert.match(adapter, /"plan": "owned-plan\.py"/);
  assert.match(adapter, /def build_plan_context_request\(/);
  assert.match(adapter, /def _valid_plan_context_result\(/);
  assert.match(adapter, /def invoke_plan_runtime\(/);
  assert.match(adapter, /"allowed_profiles": \["legacy", "smart", "autonomous"\]/);
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
  const artifact = readJson(currentArtifactPath);
  const ownedPlan = readText("runtime/owned-plan.py");
  const adapter = readText("hooks/hook_adapter.py");

  assert.match(readme, /## 开发状态与文档地图/);
  for (const authority of [
    "ARCHITECTURE.md", "DESIGN.md", "CHANGELOG.md", "ROADMAP.md", "BASELINE_PROVENANCE.md",
    "MAINTAINER_HANDOFF.md", "docs/repository-governance-guide.md",
  ]) assert.match(readme, new RegExp(authority.replace(".", "\\.")));
  assert.doesNotMatch(readme, /当前源码\/package 身份|当前已接受的 rollback|previous fallback/);
  assert.doesNotMatch(readme, /## 仓库地图/);
  assert.doesNotMatch(readme, /构建当前 .*候选 ZIP|当前 ZIP 必须包含精确 \d+ entries/);

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

  assert.match(architecture, /^<a name="cloud-lifecycle"><\/a>$/m);
  assert.match(architecture, /\[.*DESIGN.*\]\(DESIGN\.md\)/);

  assert.match(design, /^<a name="implementation-layout"><\/a>$/m);
  assert.match(design, /^<a name="module-responsibilities"><\/a>$/m);

  for (const target of [
    "contracts/runtime-bundle-v2.json", "contracts/release-artifact-v2.json",
    "tests/installer.test.js", "tests/hook-adapter.test.js", "tests/owned-plan-runtime.test.js",
    "tests/owned-runtime.test.js", "tests/import-runtime.test.js", "tests/release-package.test.js",
    "tests/published-release-oracles.test.js",
  ]) assert.match(design, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

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

test("ROADMAP keeps stable Discovery and Release governance anchors", () => {
  const roadmap = readText("ROADMAP.md");
  const readme = readText("README.md");
  assert.match(roadmap, /^<a name="version-train-two-retirement-reviews"><\/a>$/m);
  assert.match(roadmap, /^<a name="phase-4-opt-in-purpose"><\/a>$/m);
  assert.match(roadmap, /^<a name="discovery-gate-governance"><\/a>$/m);
  assert.match(roadmap, /^<a name="release-four-step-flow"><\/a>$/m);
  assert.match(roadmap, /^<a name="pre-1-compatibility-admission"><\/a>$/m);
  assert.match(roadmap, /每条发布列车都必须经过两轮 retirement review/);
  assert.match(roadmap, /第一轮：Phase closeout/);
  assert.match(roadmap, /第二轮：Phase 9 role rotation/);
  assert.match(roadmap, /review.*不是为了清单好看而强制删除/);
  assert.match(roadmap, /多个低风险 Phase合并到同一版本列车[\s\S]*每个 Phase仍分别做第一轮审查[\s\S]*只在最终发布时做一次[\s\S]*第二轮审查/);
  assert.match(readme, /ROADMAP\.md#pre-1-compatibility-admission/);
});

test("Phase 4 separates platform execution permission from plan-local product consent", () => {
  const roadmap = readText("ROADMAP.md");
  const history = readText("docs/history/phase-4.1-managed-v3-discovery.md");

  for (const term of [
    "本地 sandbox / approval",
    "Cloud task / container policy",
    "system-managed Hook trust",
    "Phase 4 plan-local opt-in",
  ]) assert.match(roadmap, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(roadmap, /给计划行为授权，不给模型扩权/);
  assert.match(roadmap, /`autonomous`[\s\S]{0,180}不表示 Codex 获得更高 OS 权限/);
  assert.doesNotMatch(roadmap, /“授权”必须继续分成三层/);
  assert.match(history, /^<a name="phase-4-1-post-implementation-opt-in-clarification"><\/a>$/m);
  assert.match(history, /Phase 4 的 opt-in 不是 Codex 权限申请/);
  assert.match(history, /这才是 Phase 4 实现的产品 opt-in/);
});
