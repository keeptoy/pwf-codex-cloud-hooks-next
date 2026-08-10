"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const trustedPrefixes = ["contracts/", "hooks/", "patches/", "runtime/", "tools/"];
const trustedRootPaths = new Set(["install.js", "package.json", "upstream-manifest.json"]);
const planningFiles = ["findings.md", "progress.md", "task_plan.md"];
const versionPattern = "v\\d+\\.\\d+\\.\\d+(?:-[A-Za-z0-9.]+)?";

function trackedPaths() {
  const result = spawnSync("git", ["-c", "core.quotepath=false", "ls-files"], {
    cwd: root, encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim().split(/\r?\n/).filter(Boolean)
    .map(value => value.replaceAll("\\", "/")).sort();
}

function isTrustedSource(relative) {
  return trustedRootPaths.has(relative) || trustedPrefixes.some(prefix => relative.startsWith(prefix));
}

function currentRoleWindow() {
  const roadmap = read("ROADMAP.md");
  const candidateMatch = roadmap.match(new RegExp("^\\| 当前开发列车 \\| `(" + versionPattern + ")`", "m"));
  const acceptedMatch = roadmap.match(new RegExp("^\\| 当前已接受版本 \\| `(" + versionPattern + ")`", "m"));
  const fallbackMatch = roadmap.match(new RegExp("^\\| 当前直接回退版本 \\| immutable `(" + versionPattern + ")` immediate fallback", "m"));
  assert.ok(candidateMatch, "ROADMAP lacks a parseable current candidate role");
  assert.ok(acceptedMatch, "ROADMAP lacks a parseable accepted baseline role");
  assert.ok(fallbackMatch, "ROADMAP lacks a parseable immediate fallback role");
  const candidate = candidateMatch[1];
  const accepted = acceptedMatch[1];
  const immediateFallback = fallbackMatch[1];
  const packageVersion = JSON.parse(read("package.json")).version;
  assert.equal(candidate, `v${packageVersion}`, "package identity must match the current candidate role");
  assert.notEqual(accepted, immediateFallback, "accepted and immediate fallback roles must remain distinct");
  return { accepted, candidate, immediateFallback, roadmap };
}

test("trusted source zones are exact while repository governance paths remain lifecycle-managed", () => {
  const actual = trackedPaths();
  const artifact = JSON.parse(read("contracts/release-artifact-v1.json"));
  const releasePaths = artifact.entries.map(item => item.path);
  const expectedTrusted = releasePaths.filter(isTrustedSource).sort();
  const actualTrusted = actual.filter(isTrustedSource).sort();

  assert.deepEqual(actualTrusted, expectedTrusted);
  for (const relative of [...releasePaths, ...artifact.external_release_assets.map(item => item.path)]) {
    assert.equal(actual.includes(relative), true, relative);
  }
  for (const required of [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md", "DESIGN.md",
    "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md", "docs/cloud-hard-acceptance-template.md",
    "docs/repository-governance-guide.md",
  ]) assert.equal(actual.includes(required), true, required);
  for (const prefix of [".planning/", "docs/", "tests/"]) {
    assert.equal(artifact.excluded_prefixes.includes(prefix), true, prefix);
    assert.equal(releasePaths.some(item => item.startsWith(prefix)), false, prefix);
  }
  for (const forbidden of [
    "PROJECT_UNDERSTANDING.md", "work_plan.md", "黑盒验证.md", "snapshot-prototype/",
    "tests/phase3-contracts.test.js", "tests/snapshot-prototype-handoff.test.js",
  ]) assert.equal(actual.some(item => item === forbidden || item.startsWith(forbidden)), false, forbidden);
  for (const relative of actual.filter(item => item.startsWith("tests/fixtures/"))) {
    assert.doesNotMatch(relative, new RegExp(versionPattern, "i"),
      `test fixture path must use a semantic identity: ${relative}`);
  }
});

test("planning lifecycle has one valid active pointer and complete scoped records", () => {
  const actual = trackedPaths();
  const activePlan = read(".planning/.active_plan").trim();
  const scopeFiles = new Map();

  assert.match(activePlan, /^\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9.-]*$/);
  for (const relative of actual.filter(item => item.startsWith(".planning/") && item !== ".planning/.active_plan")) {
    const match = relative.match(/^\.planning\/(\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9.-]*)\/(findings\.md|progress\.md|task_plan\.md)$/);
    assert.ok(match, `unexpected planning lifecycle path: ${relative}`);
    const [, scope, file] = match;
    if (!scopeFiles.has(scope)) scopeFiles.set(scope, []);
    scopeFiles.get(scope).push(file);
  }

  assert.equal(scopeFiles.has(activePlan), true, `active planning scope is not tracked: ${activePlan}`);
  assert.deepEqual([...scopeFiles.keys()], [activePlan], "completed planning scopes must leave the current tree");
  for (const [scope, files] of scopeFiles) {
    assert.deepEqual(files.sort(), [...planningFiles].sort(), `incomplete planning scope: ${scope}`);
  }

  const activeTask = read(`.planning/${activePlan}/task_plan.md`);
  for (const heading of ["Authorization", "Next Step", "Stop Conditions"]) {
    assert.match(activeTask, new RegExp(`^## ${heading}$`, "m"), `active task plan lacks ${heading}`);
  }
});

test("documentation lifecycle paths stay portable and outside the Release artifact", () => {
  const actual = trackedPaths();
  const artifact = JSON.parse(read("contracts/release-artifact-v1.json"));
  const releasePaths = artifact.entries.map(item => item.path);
  const docs = actual.filter(item => item.startsWith("docs/"));
  const { accepted, candidate, immediateFallback } = currentRoleWindow();
  const roleVersions = [...new Set([accepted, candidate, immediateFallback])].sort();
  const rootBootstraps = actual.filter(item => /^init-cloud-sandbox-v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\.bash$/.test(item));
  const acceptanceDocs = docs.filter(item => /^docs\/v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?-cloud-hard-acceptance\.md$/.test(item));

  assert.equal(artifact.excluded_prefixes.includes("docs/"), true);
  for (const relative of docs) {
    assert.match(relative, /^docs\/(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.md$/);
    assert.equal(releasePaths.includes(relative), false, relative);
  }
  assert.deepEqual(rootBootstraps, roleVersions.map(version => `init-cloud-sandbox-${version}.bash`));
  assert.deepEqual(acceptanceDocs, roleVersions.map(version => `docs/${version}-cloud-hard-acceptance.md`));
  const acceptanceTemplate = read("docs/cloud-hard-acceptance-template.md");
  assert.match(acceptanceTemplate, /^<a name="cloud-hard-acceptance-template"><\/a>$/m);
  assert.match(acceptanceTemplate, /### 4\.2 Published Release[\s\S]*__IMMUTABLE_BOOTSTRAP_URL__[\s\S]*__IMMUTABLE_BOOTSTRAP_SHA256__/);
  assert.match(acceptanceTemplate, /### 9\.2 Published Release[\s\S]*__IMMUTABLE_ZIP_URL__[\s\S]*__IMMUTABLE_ZIP_SHA256__/);
  assert.match(acceptanceTemplate, /PWF_CLOUD_ACCEPTANCE_CANONICAL_V1[\s\S]*PWF_CLOUD_ACCEPTANCE_REAL_RESUME_TAIL/);
  assert.match(acceptanceTemplate, /版本专项 acceptance 应保存以下原始证据/);
  assert.doesNotMatch(acceptanceTemplate, new RegExp(versionPattern, "i"));
  assert.doesNotMatch(acceptanceTemplate, /\b[a-f0-9]{40,64}\b/i);
  assert.doesNotMatch(acceptanceTemplate, /Phase 4 marker/i);
  assert.doesNotMatch(acceptanceTemplate, /Gate ledger|Cloud state|当前状态|R5_PR_IN_PROGRESS/);
  assert.doesNotMatch(acceptanceTemplate, /readonly (?:PUBLICATION_TAG|PACKAGE_VERSION|ZIP_NAME|ZIP_SIZE)=/);
  assert.equal(releasePaths.includes("docs/cloud-hard-acceptance-template.md"), false);
  const fixedBootstrapName = /init-cloud-sandbox-v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\.bash/;
  for (const stableDoc of [
    "README.md", "AGENTS.md", "docs/cloud-hard-acceptance-template.md",
    "docs/repository-governance-guide.md",
  ]) {
    assert.doesNotMatch(read(stableDoc), fixedBootstrapName, `${stableDoc} must use a version-neutral bootstrap command`);
  }
  assert.match(read("README.md"), /for bootstrap in init-cloud-sandbox-v\*\.bash; do/);
  for (const retired of [
    "docs/beta3-dev-m3-cloud-equivalence.md",
    "docs/beta3-dev-m4-cutover-plan.md",
  ]) assert.equal(actual.includes(retired), false, retired);
  assert.match(read("docs/repository-governance-guide.md"), /^<a name="repository-governance-guide"><\/a>$/m);
  assert.match(read("MAINTAINER_HANDOFF.md"), /\[[^\]]*仓库治理指南[^\]]*\]\(docs\/repository-governance-guide\.md\)/);
});

test("historical documents have one macro entrance and remain advisory", () => {
  const index = read("docs/history/README.md");
  assert.match(index, /warm layer.*不是源码 archive.*当前\s+programme authority/s);
  assert.match(index, /只允许事实纠错或修复.*immutable link/s);
  assert.match(index, /不得进入 Release.*trusted graph.*runtime dispatch/s);

  const readme = read("README.md");
  assert.match(readme, /\]\(docs\/history\/README\.md\)/);
  assert.equal((readme.match(/docs\/history\//g) || []).length, 1,
    "README must expose exactly one historical-document entrance");
  for (const macroDoc of [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md", "DESIGN.md",
    "MAINTAINER_HANDOFF.md", "ROADMAP.md",
  ]) assert.doesNotMatch(read(macroDoc), /docs\/history\//,
    `${macroDoc} must not create a second historical-document entrance`);
});

test("root architecture history snapshots remain non-authoritative and isolated", () => {
  const actual = trackedPaths();
  const artifact = JSON.parse(read("contracts/release-artifact-v1.json"));
  const snapshots = actual.filter(item =>
    /^ARCHITECTURE-old-v?\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\.md$/.test(item));

  assert.ok(snapshots.length > 0, "expected at least one architecture history snapshot");
  for (const snapshot of snapshots) {
    const text = read(snapshot);
    assert.match(text, /非权威历史副本/);
    assert.match(text, /immutable (?:tag|post-release commit)/);
    assert.doesNotMatch(text, /github\.com\/[^/]+\/[^/]+\/blob\/(?:main|master|[^/]*-post-release)\//,
      `${snapshot} must not use a moving branch as its source identity`);
    assert.match(text, /当前架构始终以 \[`ARCHITECTURE\.md`\]\(ARCHITECTURE\.md\)/);
    assert.equal(artifact.entries.some(item => item.path === snapshot), false,
      `${snapshot} must stay outside the Release artifact`);
    for (const authority of [
      "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md", "DESIGN.md",
      "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md", "docs/repository-governance-guide.md",
    ]) assert.equal(read(authority).includes(snapshot), false,
      `${authority} must not promote ${snapshot} into the authority graph`);
  }
});

test("portable repository governance defines a closed retirement transaction", () => {
  const guide = read("docs/repository-governance-guide.md");

  assert.match(guide, /^<a name="retirement-definition-of-done"><\/a>$/m);
  assert.match(guide, /同一次 lifecycle rotation.*不要求.*同一个 commit.*实施 gate/s);
  assert.match(guide, /eviction.*关闭前不得开启下一开发列车/s);
  assert.match(guide, /candidate \+ accepted 角色窗口/);
  assert.match(guide, /accepted \+ immediate fallback 两个席位/);
  assert.match(guide, /长期安全不变量已经迁入当前版本或版本无关测试/);
  assert.match(guide, /unsealed transition.*旧版本 bootstrap checksum/s);
  assert.match(guide, /不是第四种长期 baseline/);
  assert.match(guide, /compatibility code.*支持来源窗口.*owner.*行为测试.*retirement condition/s);
  assert.match(guide, /machine contract.*Phase\/Round.*运行时、构建或验证语义/s);
  assert.match(guide, /稳定模板和当前角色窗口内的版本专项 acceptance/);
  assert.match(guide, /Cloud hard acceptance template.*版本中立黑盒提示词/s);
  assert.match(guide, /模板不得保存具体版本.*PASS\/PENDING.*不占用 candidate \+ accepted 文件窗口/s);
  assert.match(guide, /模板和所有版本 acceptance.*Release.*trusted execution graph 排除/s);
});

test("retired prototype conclusions remain covered by production safety tests", () => {
  const planTests = read("tests/owned-plan-runtime.test.js");
  const activationTests = read("tests/activation.test.js");
  const catchupTests = read("tests/owned-runtime.test.js");
  for (const title of [
    "owned plan emits pristine managed-legacy context from a private snapshot",
    "owned plan rejects linked, non-regular, oversized, and invalid UTF-8 inputs",
    "owned plan safe reads detect replacement, truncation, append, and hard-link races",
    "owned plan kills the injector process group, bounds output, and cleans snapshots",
    "owned plan removes only bounded safe stale snapshots from its trusted base",
  ]) assert.match(planTests, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(activationTests, /Linux synthetic install-user\/Hook-user split executes both real owned runtimes/);
  assert.match(catchupTests, /owned runtime distinguishes planning\/update\/output-budget skip reasons/);
});

test("cold history stays on immutable refs and outside runtime, Release, and adapter dispatch", () => {
  const runtime = read("contracts/runtime-bundle-v1.json");
  const release = read("contracts/release-artifact-v1.json");
  const adapter = read("hooks/hook_adapter.py");
  const installer = read("install.js");
  const provenance = read("BASELINE_PROVENANCE.md");
  const { candidate } = currentRoleWindow();
  for (const content of [runtime, release, adapter]) {
    assert.doesNotMatch(content, /snapshot-prototype|prototype_snapshot_runner/);
    assert.doesNotMatch(content, /docs\/phase-|\.planning\/2026-08-01/);
  }
  const artifact = JSON.parse(release);
  assert.equal(artifact.package_version, candidate.slice(1));
  assert.equal(artifact.entries.length, 21);
  assert.equal(artifact.entries.some(item => item.path === "patches/patch_planning_skill.py"), false);
  assert.equal(artifact.entries.some(item => item.path === "contracts/compatibility-overlays-v1.json"), false);
  assert.equal(artifact.entries.some(item => item.path.startsWith("docs/") || item.path.startsWith("tests/")), false);
  assert.deepEqual(artifact.external_release_assets.map(item => item.path), [`init-cloud-sandbox-${candidate}.bash`]);
  assert.match(installer, /\[\[hooks\.SessionStart\.hooks\]\]/);
  assert.match(installer, /\[\[hooks\.UserPromptSubmit\.hooks\]\]/);
  for (const immutable of [
    "39795283cd65f84547651d7bec816191fb5bfedf",
    "0b4bd7d4b688f60bcd72a03ae5ebe6db129e5151",
    "1454c9224c83d11c073b05baf6e536a11c3bb0e5",
    "bbad3703fe2bc3f34bda6ec350f8cfea6f7a159b",
    "3234e4e02090c838f5ee260cd8f2d99daf358d65",
    "cc9bc878ddc7d70c25156dd053e2874758f0814a",
    "c5236958b9830ee3695b0e81e1a0746707a6b8f9",
  ]) assert.match(provenance, new RegExp(immutable));
});

test("change history, programme, provenance, and current acceptance keep separate lifecycle authorities", () => {
  const changelog = read("CHANGELOG.md");
  const provenance = read("BASELINE_PROVENANCE.md");
  const architecture = read("ARCHITECTURE.md");
  const design = read("DESIGN.md");
  const agents = read("AGENTS.md");
  const artifact = JSON.parse(read("contracts/release-artifact-v1.json"));
  const { accepted, candidate, immediateFallback, roadmap } = currentRoleWindow();
  const acceptancePath = `docs/${candidate}-cloud-hard-acceptance.md`;
  const acceptance = read(acceptancePath);
  const escapedCandidate = candidate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const changelogVersions = [...changelog.matchAll(new RegExp(`^## (${versionPattern})$`, "gm"))]
    .map(match => match[1]);
  assert.equal(changelogVersions[0], candidate, "CHANGELOG must lead with the current package version");
  assert.equal(changelogVersions.includes(accepted), true, "CHANGELOG must retain the accepted baseline delta");
  assert.equal(changelogVersions.includes(immediateFallback), true,
    "CHANGELOG must retain the immediate fallback delta");
  for (const target of ["ROADMAP.md", "BASELINE_PROVENANCE.md", acceptancePath]) {
    assert.match(changelog, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.doesNotMatch(changelog, /\b[a-f0-9]{64}\b|Next Step|GitHub `Latest`|production rollback|\d+ registered/);
  assert.equal(artifact.entries.some(entry => entry.path === "CHANGELOG.md"), false);

  assert.match(roadmap, /活动.*task_plan.*当前唯一 Next Step/s);
  assert.match(roadmap, /一个 active planning.*candidate.*accepted.*immediate fallback role\s+window.*immutable/s);
  assert.match(roadmap, new RegExp("## 3\\. 已完成的基线 `" + accepted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "`"));
  assert.doesNotMatch(roadmap, /## 3\. 已完成的仓库迁移|M1 exact mirror|M2 slim transformation/);
  assert.equal((roadmap.match(/GitHub `Latest`/g) || []).length, 1);

  for (const roleVersion of new Set([candidate, accepted, immediateFallback])) {
    assert.match(provenance, new RegExp(roleVersion.replaceAll(".", "\\.")));
  }
  assert.match(provenance, /^## 1\. 已发布身份账本$/m);
  assert.match(provenance, /持续维护的\*\*冷证据账本\*\*/);
  assert.match(provenance, /索引可以在新证据闭合后新增或轮换精选入口/);
  assert.match(provenance, /已经登记的 tag、source、ZIP\/bootstrap 字节、SHA 和 acceptance identity 不得.*改写/s);
  assert.match(provenance, /架构共识.*ARCHITECTURE\.md.*machine contracts.*programme\/lifecycle 角色只见.*ROADMAP\.md/s);
  assert.doesNotMatch(provenance, /^### 1\.[12] /m,
    "published identities must share one role-neutral ledger instead of current/history subsections");
  const publishedLedger = provenance.slice(0, provenance.indexOf("## 2. Successor 迁移不可变证据"));
  assert.doesNotMatch(publishedLedger, /\b(?:candidate|accepted)\b|immediate fallback/,
    "published identity entries must not inherit ROADMAP role labels");
  assert.match(provenance, /## 2\. Successor 迁移不可变证据/);
  assert.doesNotMatch(provenance, /## 2\. Successor 迁移来源链/);
  assert.doesNotMatch(provenance, /当前源码权威|current lifecycle role|GitHub `Latest`|Next Step|\d+ registered/);

  for (const macroDoc of [architecture, design, agents]) {
    assert.doesNotMatch(macroDoc, /当前生产回滚|当前回退层级|GitHub `Latest`|production rollback/);
  }
  assert.match(agents, /当前版本角色只见 `ROADMAP\.md`/);
  assert.match(agents, /for bootstrap in init-cloud-sandbox-v\*\.bash; do/);
  assert.match(design, /CHANGELOG\.md/);
  assert.match(changelog,
    /\[`BASELINE_PROVENANCE\.md` 的 Successor 迁移不可变证据\]\(BASELINE_PROVENANCE\.md#successor-migration-evidence\)/);
  assert.doesNotMatch(changelog, /docs\/history\//);
  assert.doesNotMatch(changelog, /Successor 迁移来源链/);

  assert.match(acceptance, new RegExp(`^# ${escapedCandidate} Cloud hard acceptance$`, "m"));
  assert.match(acceptance, /R5-SC.*Source\/Candidate.*HOOKS_URL.*HOOKS_SHA256/is);
  assert.match(acceptance, /R5-PR.*Published Release.*默认.*下载/is);
  assert.match(acceptance, /两条通道不得共用容器、安装状态或 B～F 结果/);
  assert.match(acceptance, /Cloud 结论本身不自动授权.*Latest.*rollback/is);
  assert.match(acceptance, /Latest\/rollback promotion \| PASS[\s\S]*G12[\s\S]*pointer-only postflight/);
  assert.match(acceptance, /Product Phase 4[\s\S]*Discovery authorization 之前/);
  assert.match(acceptance, /## 4\. 安装 setup[\s\S]*### 4\.1 Source\/Candidate[\s\S]*published-release-oracles\.test\.js[\s\S]*node --test[\s\S]*cmp "\$ZIP_A" "\$ZIP_B"/);
  assert.match(acceptance, /V033_DEV_STATIC_CONTRACT=PASS/);
  assert.match(acceptance, /origin.*upstream_pristine[\s\S]*managed_sha256[\s\S]*pristine_sha256[\s\S]*overlay_ids/s);
  assert.match(acceptance, /allowed_symbols[\s\S]*extract_messages_after[\s\S]*find_last_planning_update[\s\S]*same_project_path[\s\S]*text_content/s);
  const publishedSetupStart = acceptance.indexOf("### 4.2 Published Release");
  const lifecycleStart = acceptance.indexOf("## 5. B：", publishedSetupStart);
  assert.ok(publishedSetupStart >= 0 && lifecycleStart > publishedSetupStart);
  const publishedSetup = acceptance.slice(publishedSetupStart, lifecycleStart);
  assert.match(publishedSetup, /readonly BOOTSTRAP_URL="https:\/\/github\.com\/[^\s"]+\/releases\/download\/v0\.3\.3\/init-cloud-sandbox-v0\.3\.3\.bash"/);
  assert.match(publishedSetup, /readonly BOOTSTRAP_SHA256="[a-f0-9]{64}"/);
  assert.match(publishedSetup, /bash "\$BOOTSTRAP" all/);
  assert.doesNotMatch(publishedSetup, /readonly (?:PUBLICATION_TAG|BOOTSTRAP_NAME|BOOTSTRAP_SIZE|RELEASE_URL)=/);
  assert.doesNotMatch(publishedSetup, /(?:^|\s)HOOKS_(?:URL|SHA256)=/m);
  assert.match(acceptance, /## 5\. B：按安装阶段分流 lifecycle[\s\S]*### 5\.1 B-SC：Source\/Candidate post-install Resume[\s\S]*SessionStart source[\s\S]*===BEGIN PLAN DATA===[\s\S]*=== recent progress ===/);
  assert.match(acceptance, /### 5\.2 B-PR：Published Release Fresh startup[\s\S]*SessionStart source[\s\S]*source 为 startup/);
  const lifecycleB = acceptance.slice(
    acceptance.indexOf("## 5. B：按安装阶段分流 lifecycle"),
    acceptance.indexOf("## 6. C：创建 canonical planning baseline"),
  );
  assert.doesNotMatch(lifecycleB, /^SESSION CATCHUP DETECTED:/m);
  assert.doesNotMatch(lifecycleB, /这是 planning-with-files (?:Source\/Candidate|Published Release)/);
  assert.doesNotMatch(acceptance, /Phase 4 marker/i);
  assert.match(acceptance, /## 6\. C：创建 canonical planning baseline[\s\S]*PWF_CLOUD_ACCEPTANCE_CANONICAL_V1/);
  assert.match(acceptance, /## 7\. D：canonical UserPromptSubmit[\s\S]*===BEGIN PLAN DATA===[\s\S]*=== recent progress ===/);
  assert.match(acceptance, /### 8\.1 E1：long tail[\s\S]*PWF_CLOUD_ACCEPTANCE_FILLER_01[\s\S]*PWF_CLOUD_ACCEPTANCE_REAL_RESUME_TAIL/);
  assert.match(acceptance, /### 8\.2 E2：real Resume[\s\S]*Unsynced messages[\s\S]*Catch-up 位于 planning context 之前/);
  assert.match(acceptance, /## 9\. Post-resume doctor、inventory、policy 与 residue[\s\S]*### 9\.1 Source\/Candidate[\s\S]*INSTALLED_RUNTIME_FILES=10[\s\S]*UPSTREAM_PRISTINE_FILES=4[\s\S]*OWNED_CATCHUP_HELPERS=4[\s\S]*GLOBAL_SKILL_PRISTINE=PASS/s);
  assert.match(acceptance, /### 10\.1 R5-SC Source\/Candidate[\s\S]*R5-SC=PASS/);
  assert.match(acceptance, /### 10\.2 R5-PR Published Release[\s\S]*R5-PR=PASS[\s\S]*CLOUD-HARD-ACCEPTANCE-PASS/);
  assert.doesNotMatch(acceptance, /R5_PR_IN_PROGRESS|final Cloud hard acceptance \| PENDING/);
  if (roadmap.includes("Cloud hard acceptance PASS")) {
    assert.match(acceptance, /CLOUD-HARD-ACCEPTANCE-PASS/);
    assert.doesNotMatch(acceptance, /PENDING_R5_SC|PENDING_R5_PR|PENDING_R5/);
  }

  const publishedFStart = acceptance.indexOf("### 9.2 Published Release");
  const evidenceStart = acceptance.indexOf("## 10.", publishedFStart);
  assert.ok(publishedFStart >= 0 && evidenceStart > publishedFStart);
  const publishedF = acceptance.slice(publishedFStart, evidenceStart);
  assert.match(publishedF, /readonly ZIP_URL="https:\/\/github\.com\/[^\s"]+\/releases\/download\/v0\.3\.3\/pwf-codex-cloud-hooks-v0\.3\.3\.zip"/);
  assert.match(publishedF, /readonly ZIP_SHA256="[a-f0-9]{64}"/);
  assert.match(publishedF, /tools\/build_release\.py.*check/is);
  assert.match(publishedF, /tools\/import_upstream_runtime\.py.*check/is);
  assert.match(publishedF, /node "\$PACKAGE_ROOT\/install\.js" doctor/);
  assert.match(publishedF, /PACKAGE_VERSION=.*package\.json/);
  assert.match(publishedF, /INSTALLED_RUNTIME_FILES=" \+ str\(len\(actual\)\)/);
  assert.match(publishedF, /UPSTREAM_PRISTINE_FILES=" \+ str\(len\(bundle\["files"\]\)\)/);
  assert.match(publishedF, /SNAPSHOT_LEFTOVERS=0/);
  assert.doesNotMatch(publishedF, /git rev-parse|workspace.*install\.js/is);
  assert.doesNotMatch(publishedF, /__[A-Z0-9_]+__/);
  assert.doesNotMatch(publishedF, /readonly (?:PUBLICATION_TAG|PACKAGE_VERSION|ZIP_NAME|ZIP_SIZE)=/);
});

test("stable architecture contracts do not freeze version history", () => {
  const architectureContracts = read("tests/architecture-contracts.test.js");

  assert.doesNotMatch(architectureContracts, /docs\/v\d+\.\d+\.\d+[^"']*cloud-hard-acceptance\.md/i);
  assert.doesNotMatch(architectureContracts, /\bv\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\b/);
  assert.doesNotMatch(architectureContracts, /\b[a-f0-9]{40,64}\b/i);
  assert.doesNotMatch(architectureContracts, /artifact\.entries\.length/);
});
