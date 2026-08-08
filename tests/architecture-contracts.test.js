"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const readJson = relative => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const readText = relative => fs.readFileSync(path.join(root, relative), "utf8");

test("canonical plan-context architecture is exact, plan-first, and adapter-thin", () => {
  const request = readJson("contracts/adapter-plan-context-request-v1.schema.json");
  const result = readJson("contracts/plan-context-result-v1.schema.json");
  const bundle = readJson("contracts/runtime-bundle-v1.json");
  const artifact = readJson("contracts/release-artifact-v1.json");
  const upstream = readJson("upstream-manifest.json");
  const architecture = readText("ARCHITECTURE.md");

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
  assert.match(architecture, /does not resolve planning files/);
  assert.match(architecture, /只有 `runtime\/upstream\/session-catchup\.py` 与 pristine upstream 不同/);
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
    "MAINTAINER_HANDOFF.md",
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
  ]) assert.match(design, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.match(design, /repository source.*Release ZIP.*installed managed runtime/is);
  assert.match(design, /入口.*直接依赖.*影响.*验证/s);
  assert.doesNotMatch(design, /ADAPTER_DEADLINE_SECONDS|20,000|50 \/ 20|当前生产回滚|GitHub `Latest`/);
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
    "## Unreleased — 0.3.2-dev", "## v0.3.1", "## v0.3.0", "## v0.3.0-beta.2",
  ]) assert.match(changelog, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const target of ["ROADMAP.md", "BASELINE_PROVENANCE.md", "docs/v0.3.1-cloud-hard-acceptance.md"]) {
    assert.match(changelog, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(changelog, /\b[a-f0-9]{64}\b|Next Step|GitHub `Latest`|production rollback|\d+ registered/);
  assert.equal(artifact.entries.some(entry => entry.path === "CHANGELOG.md"), false);

  assert.match(roadmap, /\| 当前开发列车 \| `0\.3\.2-dev`；文档治理/);
  assert.match(roadmap, /活动.*task_plan.*当前唯一 Next Step/s);
  assert.equal((roadmap.match(/GitHub `Latest`/g) || []).length, 1);

  for (const identity of [
    "v0.3.1", "9aa2148886e499f9f45594f7ae4f7681f1045de2",
    "v0.3.0", "1454c9224c83d11c073b05baf6e536a11c3bb0e5",
    "v0.3.0-beta.2", "bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b",
  ]) assert.match(provenance, new RegExp(identity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(provenance, /当前源码权威|current lifecycle role|GitHub `Latest`|\d+ registered/);

  for (const macroDoc of [architecture, design, agents]) {
    assert.doesNotMatch(macroDoc, /当前生产回滚|当前回退层级|GitHub `Latest`|production rollback/);
  }
  assert.match(agents, /当前版本角色只见 `ROADMAP\.md`/);
  assert.match(design, /CHANGELOG\.md/);
});
