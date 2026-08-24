"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");
const { validatePlanningScopes } = require("./f3-lifecycle-helpers");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const readGit = (ref, relative) => {
  const result = spawnSync("git", ["show", `${ref}:${relative}`], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
};
const trustedPrefixes = ["contracts/", "hooks/", "patches/", "runtime/", "tools/"];
const trustedRootPaths = new Set(["install.js", "package.json", "upstream-manifest.json"]);
const versionPattern = "v\\d+\\.\\d+\\.\\d+(?:-[A-Za-z0-9.]+)?";
const currentManifest = JSON.parse(read("upstream-manifest.json"));
const currentArtifactPath = currentManifest.managed_runtime.contracts.release_artifact.path;
const currentBundlePath = currentManifest.managed_runtime.contracts.runtime_bundle.path;

function repositoryPaths() {
  const result = spawnSync("git", ["-c", "core.quotepath=false", "ls-files", "--cached", "--others", "--exclude-standard"], {
    cwd: root, encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim().split(/\r?\n/).filter(Boolean)
    .map(value => value.replaceAll("\\", "/"))
    .filter(relative => fs.existsSync(path.join(root, relative))).sort();
}

function isTrustedSource(relative) {
  return trustedRootPaths.has(relative) || trustedPrefixes.some(prefix => relative.startsWith(prefix));
}

function currentRoleWindow() {
  const roadmap = read("ROADMAP.md");
  const developmentMatch = roadmap.match(new RegExp("^\\| 当前开发列车 \\| `(" + versionPattern + ")`", "m"));
  const acceptedMatch = roadmap.match(new RegExp("^\\| 当前已接受版本 \\| `(" + versionPattern + ")`", "m"));
  const fallbackMatch = roadmap.match(new RegExp("^\\| 当前直接回退版本 \\| immutable `(" + versionPattern + ")` immediate fallback", "m"));
  assert.ok(developmentMatch, "ROADMAP lacks a parseable current development train");
  assert.ok(acceptedMatch, "ROADMAP lacks a parseable accepted baseline role");
  assert.ok(fallbackMatch, "ROADMAP lacks a parseable immediate fallback role");
  const developmentTrain = developmentMatch[1];
  const accepted = acceptedMatch[1];
  const immediateFallback = fallbackMatch[1];
  const packageVersion = JSON.parse(read("package.json")).version;
  const candidate = `v${packageVersion}`;
  assert.notEqual(accepted, immediateFallback, "accepted and immediate fallback roles must remain distinct");
  return { accepted, candidate, developmentTrain, immediateFallback, roadmap };
}

test("v0.4.2 C2 closes the release train and rotates the programme rollback window", () => {
  const { accepted, candidate, developmentTrain, immediateFallback, roadmap } = currentRoleWindow();
  const pathSafetyHistory = read("docs/history/phase-4.13-v0.4.1-path-safety-patch-train.md");
  const candidateAcceptance = read("docs/acceptance/v0.4.2-cloud-hard-acceptance.md");
  const provenance = read("BASELINE_PROVENANCE.md");
  const currentTrain = roadmap.slice(
    roadmap.indexOf('<a name="v0-4-2-release-closeout"></a>'),
    roadmap.indexOf("## 5. Product Phase 路线"),
  );
  assert.equal(developmentTrain, "v0.4.2");
  assert.equal(candidate, "v0.4.2");
  assert.equal(accepted, "v0.4.2");
  assert.equal(immediateFallback, "v0.4.1");
  assert.equal(candidate, accepted);
  assert.match(roadmap, /`v0\.4\.2`[\s\S]*Release closeout/);
  assert.match(roadmap, /package identity[\s\S]*`0\.4\.2`/);
  assert.match(roadmap,
    /当前 programme 边界[^\n]*Published Release已`PASS`[^\n]*Latest[^\n]*第二轮退役[^\n]*C2[^\n]*`PASS`/);
  assert.match(currentTrain, /README\.md[\s\S]*Release ZIP输入[\s\S]*旧候选身份[\s\S]*失效/);
  assert.match(currentTrain, /C0[\s\S]*已通过Source\/Candidate[\s\S]*exact HEAD[\s\S]*版本acceptance/);
  assert.match(currentTrain, /maintenance-environment-profile\.md#maintenance-environment-profile/);
  assert.match(currentTrain, /重验触发器/);
  assert.match(currentTrain, /跨阶段[\s\S]{0,40}提升规则/);
  assert.match(currentTrain,
    /docs\/acceptance\/v0\.4\.2-cloud-hard-acceptance\.md[\s\S]*v0\.4\.1[\s\S]*immutable[\s\S]*清退/);
  assert.match(currentTrain, /templates[\s\S]{0,120}原路径[\s\S]{0,120}KEEP/);
  assert.match(currentTrain, /该C0现已通过Source\/Candidate/);
  assert.match(roadmap, /`v0\.4\.2` Release closeout已完成/);
  assert.match(currentTrain, /Published Release[\s\S]{0,120}`PASS`/);
  assert.match(currentTrain, /Latest promotion confirmation[\s\S]{0,120}第二轮role-window closeout与C2均已闭合/);
  assert.match(currentTrain,
    /Published Release[\s\S]{0,240}exact tag\/source\/ZIP\/bootstrap[\s\S]{0,240}Latest promotion confirmation[\s\S]{0,240}不(?:再|另设)[\s\S]{0,120}独立postflight/);
  assert.match(currentTrain, /#github-release-latest-promotion-confirmation/);
  assert.match(roadmap, /当前已接受版本[^\n]*`v0\.4\.2`[^\n]*programme accepted/);
  assert.match(roadmap, /当前 programme 边界[^\n]*`v0\.4\.2`[^\n]*GitHub `Latest` promotion confirmation[^\n]*C2均已`PASS`/);
  assert.doesNotMatch(roadmap, /^<a name="v0-4-1-path-safety-train"><\/a>$/m);
  assert.match(pathSafetyHistory, /兼容性安全/);
  assert.match(pathSafetyHistory, /99885b854bd9621c3340e99f031bf83ceb58414d/);
  assert.match(roadmap, /## 3\. 已接受基线 `v0\.4\.2`/);
  assert.match(candidateAcceptance, /\.\.\/\.\.\/ROADMAP\.md#release-four-step-flow/);
  assert.match(candidateAcceptance, /\.\.\/\.\.\/ROADMAP\.md#version-train-two-retirement-reviews/);
  for (const fact of [
    "d51f291566b5599cb21a9fc5c3f30fd1a1bbc74a",
    "PWF_SOURCE_CANDIDATE_SETUP=PASS",
    "PWF_SC_POST_RESUME=PASS",
    "PWF_PUBLIC_ZIP_BOUNDARY_IMPORTER=PASS",
    "PWF_PUBLIC_POST_RESUME=PASS",
    "SOURCE_CANDIDATE_PASS / PUBLISHED_RELEASE_PASS / LATEST_PROMOTION_CONFIRMED / STOP_BEFORE_ROLE_WINDOW_CLOSEOUT",
    "https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/download/v0.4.2/pwf-codex-cloud-hooks-v0.4.2.zip",
    "https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/download/v0.4.2/init-cloud-sandbox-v0.4.2.bash",
    "4c04b4758bce0f3e9eb22afcba05dcb8788958357c24e31014a55edf850dec64",
  ]) assert.match(candidateAcceptance, new RegExp(fact.replaceAll(".", "\\.")));
  assert.match(candidateAcceptance, /latest_tag=v0\.4\.2/);
  assert.match(candidateAcceptance, /draft=false[\s\S]*prerelease=false/);
  assert.match(candidateAcceptance,
    /GitHub Release编辑页面[\s\S]*取消Pre-release[\s\S]*设为Latest[\s\S]*Release详情页/);
  assert.match(candidateAcceptance, /\.\.\/\.\.\/ROADMAP\.md#github-release-latest-promotion-confirmation/);
  assert.match(candidateAcceptance, /本节只保存本次[\s\S]*真实证据[\s\S]*不重新定义/);
  assert.doesNotMatch(candidateAcceptance,
    /它不是Codex Cloud|只有保存结果未知|不再单列重复下载、重算SHA/);
  assert.match(candidateAcceptance, /C步骤首次安全停止[\s\S]*维护者随后临时授权/);
  assert.match(candidateAcceptance, /只读Shell existence preflight[\s\S]*D～F顺利PASS/);
  assert.match(candidateAcceptance, /Role-window closeout retirement checkpoint[\s\S]*24个非活动planning[\s\S]*RETIRE/);
  for (const anchor of [
    "published-release-setup", "blackbox-fresh-startup", "blackbox-canonical-baseline",
    "blackbox-canonical-context", "blackbox-real-resume", "published-release-deep-check",
  ]) assert.match(candidateAcceptance, new RegExp(`cloud-hard-acceptance-template\\.md#${anchor}`));
  assert.match(candidateAcceptance, /4\.2[\s\S]*5\.2[\s\S]*第6节[\s\S]*第7节[\s\S]*8\.1[\s\S]*8\.2[\s\S]*9\.2/);
  assert.doesNotMatch(candidateAcceptance, /set -Eeuo pipefail|readonly BOOTSTRAP_URL=|readonly ZIP_URL=/,
    "version guide must not copy the stable Published Release scripts");
  for (const fact of [
    "v0.4.2", "d51f291566b5599cb21a9fc5c3f30fd1a1bbc74a",
    "87,386 bytes", "21,565 bytes",
    "d1547ab50afcc3a275592d41b60daa77ab1062c97c072be3661cfe763467264e",
    "4c04b4758bce0f3e9eb22afcba05dcb8788958357c24e31014a55edf850dec64",
  ]) assert.match(provenance, new RegExp(fact.replaceAll(".", "\\.")));
  assert.match(provenance, /Latest promotion confirmation[\s\S]*第二轮退役[\s\S]*C2 programme轮转均已闭合/);
});

test("Phase 4.12 preserves the renamed v0.4.0 Release discovery and P9 evidence", () => {
  const phase12 = read("docs/history/phase-4.12-v0.4.0-release-discovery.md");
  const provenance = read("BASELINE_PROVENANCE.md");
  const { roadmap } = currentRoleWindow();

  assert.equal(fs.existsSync(path.join(root, "init-cloud-sandbox-v0.4.0.bash")), false);
  assert.equal(fs.existsSync(path.join(root, "docs/v0.4.0-cloud-hard-acceptance.md")), false);
  for (const anchor of [
    "phase-9-v0-4-0-p9-a-post-implementation",
    "phase-9-v0-4-0-p9-b-sealed-source-cloud",
    "phase-9-v0-4-0-p9-c-post-publication",
    "phase-9-v0-4-0-p9-d-post-acceptance",
    "phase-9-v0-4-0-p9-e-post-promotion",
    "phase-9-v0-4-0-p9-f-post-implementation",
  ]) assert.match(phase12, new RegExp(`<a name="${anchor}"></a>`));
  assert.match(phase12, /^<a name="phase-4-12-v0-4-0-release-discovery"><\/a>$/m);
  assert.match(phase12, /^<a name="phase-9-v0-4-0-positioning"><\/a>$/m);
  assert.match(phase12, /^# Phase 4\.12：v0\.4\.0 Release 收口 Discovery$/m);
  assert.match(phase12, /^<a name="phase-4-12-renumbering-note"><\/a>$/m);
  assert.match(phase12, /原名[^\n]*Phase 9[^\n]*回顾性[^\n]*Phase 4\.12/);
  assert.match(phase12, /P9-A～P9-F[^\n]*保持/);
  assert.match(phase12,
    /P9_F_SECOND_RETIREMENT_PASS \/ V0_4_0_TRAIN_CLOSED \/ NEXT_TRAIN_UNDECIDED/);
  assert.match(provenance,
    /blob\/6b388518855da9053713a58e5c918c8b727b6dc6\/docs\/v0\.4\.0-cloud-hard-acceptance\.md#v0-4-0-p9-f-second-retirement-closeout/);
  assert.match(roadmap, /回退证据链[^\n]*immutable `v0\.4\.0` deeper fallback/);
});

test("v0.4.1 P9-F evidence stays immutable after its local role-window files retire", () => {
  const acceptance = readGit("3903326d7bbea344a8b03de1d9e1e7205eed57b1",
    "docs/v0.4.1-cloud-hard-acceptance.md");
  const provenance = read("BASELINE_PROVENANCE.md");
  const actual = repositoryPaths();

  assert.match(acceptance, /^<a name="v0-4-1-p9-f-second-retirement-closeout"><\/a>$/m);
  assert.match(acceptance,
    /P9_F_SECOND_RETIREMENT_PASS \/ V0_4_1_TRAIN_CLOSED \/ NEXT_TRAIN_UNDECIDED/);
  assert.match(provenance,
    /\`v0\.4\.1\`[^\n]*blob\/3903326d7bbea344a8b03de1d9e1e7205eed57b1\/docs\/v0\.4\.1-cloud-hard-acceptance\.md#v0-4-1-p9-f-second-retirement-closeout/);
  assert.match(provenance,
    /\`v0\.4\.0\`[^\n]*fe8cd7f284ea2849f634aa68813dbb0f2cca83f9[^\n]*24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3/);
  assert.match(acceptance, /11个validation refs[^\n]*KEEP/);
  for (const retained of [
    "contracts/installed-state-transition-v1.json",
    "tests/f3-lifecycle-helpers.js",
    "tests/owned-plan-runtime.test.js",
  ]) assert.equal(fs.existsSync(path.join(root, retained)), true, retained);
  for (const retired of [
    "docs/v0.4.1-cloud-hard-acceptance.md",
    "init-cloud-sandbox-v0.4.1.bash",
    "docs/v0.4.0-dev-f3-cloud-lifecycle-runbook.md",
    "docs/v0.4.0-dev-f3b2-smart-live-operator-guide.md",
    "docs/v0.4.0-dev-f3b3-autonomous-live-operator-guide.md",
    "docs/v0.4.0-dev-f3c-rollback-operator-guide.md",
  ]) {
    assert.equal(actual.includes(retired), false, retired);
    assert.equal(fs.existsSync(path.join(root, retired)), false, retired);
  }
  assert.match(read(".gitignore"), /^\/临时文件\/$/m);
  assert.equal(actual.some(relative => relative.startsWith("临时文件/")), false);
});

test("trusted source zones are exact while repository governance paths remain lifecycle-managed", () => {
  const actual = repositoryPaths();
  const artifact = JSON.parse(read(currentArtifactPath));
  const releasePaths = artifact.entries.map(item => item.path);
  const expectedTrusted = releasePaths.filter(isTrustedSource).sort();
  const actualTrusted = actual.filter(isTrustedSource).sort();

  assert.deepEqual(actualTrusted, expectedTrusted);
  for (const relative of [...releasePaths, ...artifact.external_release_assets]) {
    assert.equal(actual.includes(relative), true, relative);
    assert.equal(fs.existsSync(path.join(root, relative)), true, `${relative} must exist in the working tree`);
  }
  for (const required of [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md", "DESIGN.md",
    "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md", "docs/cloud-hard-acceptance-template.md",
    "docs/cloud-acceptance-operator-guide-template.md",
    "docs/acceptance/README.md",
    "docs/acceptance/v0.4.2-cloud-hard-acceptance.md",
    "docs/maintenance-environment-profile.md",
    "docs/repository-governance-guide.md",
  ]) {
    assert.equal(actual.includes(required), true, required);
    assert.equal(fs.existsSync(path.join(root, required)), true, `${required} must exist in the working tree`);
  }
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

test("maintenance environment constraints survive planning retirement", () => {
  const agents = read("AGENTS.md");
  const handoff = read("MAINTAINER_HANDOFF.md");
  const profilePath = "docs/maintenance-environment-profile.md";
  const profile = read(profilePath);
  const governance = read("docs/repository-governance-guide.md");
  const artifact = JSON.parse(read(currentArtifactPath));

  assert.match(profile, /^<a name="maintenance-environment-profile"><\/a>$/m);
  assert.match(profile, /2026-08-22[\s\S]{0,500}`wsl\.exe`[\s\S]{0,300}没有已安装发行版/);
  assert.match(profile, /Docker[\s\S]{0,200}Podman[\s\S]{0,200}nerdctl[\s\S]{0,200}不存在/);
  assert.match(profile, /Git Bash[\s\S]{0,300}不能[\s\S]{0,200}Linux\/POSIX证据/);
  assert.match(profile, /Linux零skip[\s\S]{0,200}FIFO\/device[\s\S]{0,200}filesystem/);
  assert.match(profile, /Source\/Candidate Cloud教程[\s\S]{0,200}真实Linux gate/);
  assert.match(profile, /跨阶段执行路由[\s\S]{0,120}不得只记录在planning/);
  assert.match(profile, /重验触发器[\s\S]{0,400}维护者[\s\S]{0,200}环境已经改变/);
  assert.match(profile, /不是[\s\S]{0,160}(?:Host ABI|产品支持合同|永久)/);
  assert.doesNotMatch(profile, /C:\\Users\\|\/home\/|用户名|序列号|account id/i);
  assert.match(agents,
    /\]\(docs\/maintenance-environment-profile\.md#maintenance-environment-profile\)/);
  assert.match(handoff,
    /\]\(docs\/maintenance-environment-profile\.md#maintenance-environment-profile\)/);
  assert.match(governance, /^<a name="maintenance-environment-memory"><\/a>$/m);
  assert.match(governance,
    /已确认、会跨任务或阶段反复改变本地\/Cloud执行路由的环境限制，不得只保存在会被清退的planning中/);
  assert.match(governance, /应提升到一个持久的[\s\S]{0,80}maintenance environment profile/);
  assert.equal(artifact.entries.some(entry => entry.path === profilePath), false);
  assert.equal(artifact.excluded_prefixes.includes("docs/"), true);
});

test("planning lifecycle has one valid active pointer and complete scoped records", () => {
  const actual = repositoryPaths();
  const activePlan = read(".planning/.active_plan").trim();

  assert.match(activePlan, /^\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9.-]*$/);
  assert.equal(validatePlanningScopes(root, activePlan, actual), "legacy",
    "the development candidate's real active planning scope must remain markerless before F3B live");

  const activeTask = read(`.planning/${activePlan}/task_plan.md`);
  for (const heading of ["Authorization", "Next Step", "Stop Conditions"]) {
    assert.match(activeTask, new RegExp(`^## ${heading}$`, "m"), `active task plan lacks ${heading}`);
  }
});

test("documentation lifecycle paths stay portable and outside the Release artifact", () => {
  const actual = repositoryPaths();
  const artifact = JSON.parse(read(currentArtifactPath));
  const releasePaths = artifact.entries.map(item => item.path);
  const docs = actual.filter(item => item.startsWith("docs/"));
  const { accepted, candidate } = currentRoleWindow();
  const roleVersions = [...new Set([accepted, candidate])].sort();
  const rootBootstraps = actual.filter(item => /^init-cloud-sandbox-v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\.bash$/.test(item));
  const acceptanceDocs = docs.filter(item =>
    /^docs\/(?:acceptance\/)?v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?-cloud-hard-acceptance\.md$/.test(item));

  assert.equal(artifact.excluded_prefixes.includes("docs/"), true);
  for (const relative of docs) {
    assert.match(relative, /^docs\/(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.md$/);
    assert.equal(releasePaths.includes(relative), false, relative);
  }
  assert.deepEqual(rootBootstraps, roleVersions.map(version => `init-cloud-sandbox-${version}.bash`));
  const expectedAcceptanceDocs = accepted === candidate
    ? [`docs/acceptance/${candidate}-cloud-hard-acceptance.md`]
    : [`docs/${accepted}-cloud-hard-acceptance.md`, `docs/acceptance/${candidate}-cloud-hard-acceptance.md`];
  assert.deepEqual(acceptanceDocs, expectedAcceptanceDocs.sort());
  assert.deepEqual(acceptanceDocs.map(relative => path.basename(relative).replace("-cloud-hard-acceptance.md", "")).sort(),
    roleVersions);
  assert.equal(docs.some(item => item.startsWith("docs/templates/")), false,
    "frozen accepted guides still bind the stable docs-root template paths");
  const acceptanceIndex = read("docs/acceptance/README.md");
  assert.match(acceptanceIndex, /^<a name="acceptance-role-window"><\/a>$/m);
  assert.match(acceptanceIndex, /当前角色[\s\S]*ROADMAP/);
  assert.match(acceptanceIndex, /已经冻结[\s\S]{0,120}accepted职责/);
  assert.match(acceptanceIndex, /旧版guide在角色退出前/);
  assert.match(acceptanceIndex, /清退current副本/);
  assert.match(acceptanceIndex, /退出角色窗口后[\s\S]{0,160}immutable refs/);
  const acceptanceTemplate = read("docs/cloud-hard-acceptance-template.md");
  const operatorGuideTemplate = read("docs/cloud-acceptance-operator-guide-template.md");
  assert.match(acceptanceTemplate, /^<a name="cloud-hard-acceptance-template"><\/a>$/m);
  assert.match(acceptanceTemplate, /^<a name="acceptance-document-responsibilities"><\/a>$/m);
  assert.match(acceptanceTemplate, /^<a name="version-discovery-round-routing"><\/a>$/m);
  assert.match(acceptanceTemplate, /^<a name="version-acceptance-delta"><\/a>$/m);
  assert.match(operatorGuideTemplate, /^<a name="cloud-acceptance-operator-guide-template"><\/a>$/m);
  assert.match(operatorGuideTemplate, /^<a name="operator-guide-document-lifecycle"><\/a>$/m);
  assert.match(operatorGuideTemplate, /^<a name="operator-guide-channel-checkpoints"><\/a>$/m);
  assert.match(operatorGuideTemplate, /^<a name="operator-guide-final-post-run-status"><\/a>$/m);
  assert.match(operatorGuideTemplate,
    /^<a name="operator-guide-candidate-admission-preflight"><\/a>$/m);
  assert.match(operatorGuideTemplate,
    /^<a name="operator-guide-source-candidate-closeout-retirement-checkpoint"><\/a>$/m);
  assert.match(operatorGuideTemplate,
    /^<a name="operator-guide-release-exit-retirement-checkpoint"><\/a>$/m);
  assert.match(acceptanceTemplate, /\| 本模板 \| Source\/Candidate 与 Published Release 的稳定执行协议/);
  assert.match(acceptanceTemplate, /\| 活动 Release task plan \|[^\n]*Next Step/);
  assert.match(acceptanceTemplate, /\| 本轮 operator guide \|[^\n]*channel checkpoint[^\n]*final Post-run/);
  assert.match(acceptanceTemplate, /多 Discovery 版本[^\n]*每个正式 Discovery Round/);
  assert.match(acceptanceTemplate, /single-Discovery 版本专项 acceptance[^\n]*operator guide/);
  assert.doesNotMatch(acceptanceTemplate, /多\s*gate\s*(?:开发)?版本/i);
  assert.match(operatorGuideTemplate, /PRE_RUN_READY \/ LIVE_NOT_RUN/);
  assert.match(operatorGuideTemplate, /POST_RUN_PASS|POST_RUN_FAIL|POST_RUN_INCOMPLETE/);
  assert.match(operatorGuideTemplate, /Final Post-run status[^\n]*声明范围[^\n]*闭合/);
  assert.match(operatorGuideTemplate, /SOURCE_CANDIDATE_PASS \/ PUBLISHED_RELEASE_NOT_RUN \/ STOP_BEFORE_PUBLICATION/);
  assert.match(operatorGuideTemplate, /channel checkpoint[^\n]*不会冻结guide/);
  assert.match(operatorGuideTemplate, /正常等待[^\n]*不是`POST_RUN_INCOMPLETE`/);
  assert.match(operatorGuideTemplate, /SOURCE_CANDIDATE_HEAD[\s\S]*正式tag[\s\S]*实际Cloud PASS/);
  assert.match(operatorGuideTemplate, /第一阶段状态写回commit[^\n]*不替代[^\n]*tag/);
  assert.match(operatorGuideTemplate, /第二阶段状态写回commit[^\n]*final Post-run/);
  assert.match(operatorGuideTemplate, /docs: record <version> source candidate acceptance/);
  assert.match(operatorGuideTemplate, /docs: close <version> published release acceptance/);
  assert.match(operatorGuideTemplate, /失败重试[\s\S]{0,100}活动 planning/);
  assert.match(acceptanceTemplate, /development identity 收敛为 stable identity/);
  assert.match(acceptanceTemplate, /不得让 dev\/stable\s+两份 single-Discovery acceptance 并存/);
  assert.match(acceptanceTemplate, /### 0\.3 “当前 Discovery Round 验收增量”（可选）/);
  assert.match(acceptanceTemplate, /没有验收增量时/);
  assert.match(acceptanceTemplate, /B～E 黑盒提示词是否变化/);
  assert.match(acceptanceTemplate, /operator guide 不得再次复制未变化的脚本、提示词或完整执行步骤/);
  assert.match(acceptanceTemplate, /Environment variables（“环境变量”）[\s\S]*PWF_ACCEPTANCE_NODE_MAJOR[\s\S]*不要只在 setup script 中/);
  assert.match(acceptanceTemplate, /### 4\.2 Published Release[\s\S]*__IMMUTABLE_BOOTSTRAP_URL__[\s\S]*__IMMUTABLE_BOOTSTRAP_SHA256__/);
  assert.match(acceptanceTemplate, /### 9\.2 Published Release[\s\S]*__IMMUTABLE_ZIP_URL__[\s\S]*__IMMUTABLE_ZIP_SHA256__/);
  assert.match(acceptanceTemplate, /PWF_CLOUD_ACCEPTANCE_CANONICAL_V1[\s\S]*PWF_CLOUD_ACCEPTANCE_REAL_RESUME_TAIL/);
  assert.match(acceptanceTemplate,
    /上一步 B 中“不要调用工具、运行 Shell、读取文件”的限制只适用于 B 的那一次黑盒观察回复，现在已经结束/);
  const canonicalBaseline = acceptanceTemplate.slice(
    acceptanceTemplate.indexOf("## 6. C"), acceptanceTemplate.indexOf("## 7. D"));
  assert.match(canonicalBaseline, /优先使用独立的只读文件工具/);
  assert.match(canonicalBaseline, /没有独立的只读文件工具[\s\S]*只读 Shell preflight/);
  assert.match(canonicalBaseline, /Shell[\s\S]*只允许[\s\S]*存在性[\s\S]*类型[\s\S]*读取 `[.]planning\/[.]active_plan`/);
  assert.match(canonicalBaseline, /Shell不得创建、修改、删除、移动[\s\S]*重定向/);
  assert.match(canonicalBaseline, /正文写入[\s\S]*只允许使用 apply_patch/);
  assert.match(acceptanceTemplate,
    /PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_COMPLETED_V1[\s\S]*PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_ACTIVE_V1/);
  for (const sentinel of [
    "PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_COMPLETED_V1",
    "PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_ACTIVE_V1",
  ]) {
    for (const section of [
      acceptanceTemplate.slice(acceptanceTemplate.indexOf("## 6. C"), acceptanceTemplate.indexOf("## 7. D")),
      acceptanceTemplate.slice(acceptanceTemplate.indexOf("## 7. D"), acceptanceTemplate.indexOf("## 8. E")),
      acceptanceTemplate.slice(acceptanceTemplate.indexOf("### 8.2 E2"), acceptanceTemplate.indexOf("## 9. Post-resume")),
    ]) assert.match(section, new RegExp(sentinel), `${sentinel} must remain in C, D, and E2`);
  }
  assert.match(acceptanceTemplate, /不要创建或修改任何 \.pwf-codex-managed、\.mode/);
  assert.match(acceptanceTemplate, /禁止创建或切换 branch，禁止 commit、push、创建或更新 PR\/Release/);
  assert.match(acceptanceTemplate, /C 段改动只保留在工作树，不得提交/);
  assert.match(acceptanceTemplate, /stdout\/stderr 分片不代表进程已经结束/);
  assert.match(acceptanceTemplate, /session_id[\s\S]*继续轮询同一 session[\s\S]*exit_code/);
  assert.match(acceptanceTemplate, /没有明确最终 exit_code/);
  assert.match(acceptanceTemplate, /INCOMPLETE\/UNKNOWN[\s\S]*禁止猜测或补写工具未返回的 exit code/);
  assert.match(acceptanceTemplate, /YYYY-MM-DD-pwf-cloud-acceptance-v1-xxxxxxxx/);
  assert.match(acceptanceTemplate, /PWF_CLOUD_ACCEPTANCE_BASELINE_CREATED plan_id=PLAN_ID/);
  assert.match(acceptanceTemplate, /PWF_WORKTREE_CHANGES=PLANNING_ONLY/);
  assert.match(acceptanceTemplate, /grep -Ev '\^\.\. \\.planning\/'/);
  assert.doesNotMatch(acceptanceTemplate, /PWF_DEEP_CHECK_PROTOCOL=MANIFEST_ROUTED_BUNDLE_V2/);
  for (const fact of [
    "PWF_DEEP_CHECK_MANIFEST_SCHEMA",
    "PWF_DEEP_CHECK_RELEASE_CONTRACT_PATH",
    "PWF_DEEP_CHECK_RELEASE_CONTRACT_ID",
    "PWF_DEEP_CHECK_RELEASE_SCHEMA",
    "PWF_DEEP_CHECK_BUNDLE_CONTRACT_PATH",
    "PWF_DEEP_CHECK_BUNDLE_CONTRACT_ID",
    "PWF_DEEP_CHECK_BUNDLE_SCHEMA",
    "PWF_DEEP_CHECK_INSTALLED_ROOT",
  ]) {
    assert.equal((acceptanceTemplate.match(new RegExp(fact, "g")) || []).length, 2,
      `${fact} must be emitted by both deep-check channels`);
  }
  assert.doesNotMatch(acceptanceTemplate, /ACCEPTANCE_STATE|pwf-source-candidate-acceptance\.json/);
  assert.match(acceptanceTemplate, /bundle\["roots"\]\["installed"\]/);
  assert.equal((acceptanceTemplate.match(/for section in \("upstream_files", "local_files", "installed_contracts"\):/g) || []).length, 4,
    "both deep checks must derive inventory and hashes from all v2 bundle partitions");
  assert.equal((acceptanceTemplate.match(/hash_key = "pristine_sha256" if section == "upstream_files" else "sha256"/g) || []).length, 2);
  assert.doesNotMatch(acceptanceTemplate, /release-artifact-v1|runtime-bundle-v1|bundle\["files"\]/);
  assert.match(acceptanceTemplate, /^<a name="release-channel-checkpoint-routing"><\/a>$/m);
  assert.match(acceptanceTemplate, /operator guide 的channel checkpoint与final Post-run status应保存以下原始证据/);
  assert.match(acceptanceTemplate, /candidate admission preflight/);
  assert.match(acceptanceTemplate, /source-candidate closeout retirement checkpoint/);
  assert.match(acceptanceTemplate, /role-window closeout retirement checkpoint/);
  assert.match(acceptanceTemplate, /两次状态写回[^\n]*不是[^\n]*Cloud/);
  assert.match(acceptanceTemplate, /正式tag[^\n]*SOURCE_CANDIDATE_HEAD/);
  assert.match(acceptanceTemplate, /SOURCE_CANDIDATE_CHECKPOINT_HEAD/);
  assert.match(acceptanceTemplate, /PUBLISHED_RELEASE_CLOSEOUT_HEAD/);
  assert.match(acceptanceTemplate, /\.\.\/ROADMAP\.md#release-four-step-flow/);
  assert.match(acceptanceTemplate, /\.\.\/ROADMAP\.md#version-train-two-retirement-reviews/);
  assert.match(acceptanceTemplate, /exact final source[\s\S]{0,220}所有Release输入[^\n]*不变[\s\S]{0,220}Source\/Candidate/);
  assert.match(acceptanceTemplate, /Published Release[^\n]*不能提前复用/);
  assert.doesNotMatch(acceptanceTemplate, new RegExp(versionPattern, "i"));
  assert.doesNotMatch(acceptanceTemplate, /\b[a-f0-9]{40,64}\b/i);
  assert.doesNotMatch(acceptanceTemplate, /Phase 4 marker/i);
  assert.doesNotMatch(acceptanceTemplate, /Gate ledger|Cloud state|当前状态|R5_PR_IN_PROGRESS/);
  assert.doesNotMatch(acceptanceTemplate, /readonly (?:PUBLICATION_TAG|PACKAGE_VERSION|ZIP_NAME|ZIP_SIZE)=/);
  assert.equal(releasePaths.includes("docs/cloud-hard-acceptance-template.md"), false);
  const fixedBootstrapName = /init-cloud-sandbox-v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\.bash/;
  for (const stableDoc of [
    "README.md", "AGENTS.md", "docs/cloud-hard-acceptance-template.md",
    "docs/cloud-acceptance-operator-guide-template.md",
    "docs/repository-governance-guide.md",
  ]) {
    assert.doesNotMatch(read(stableDoc), fixedBootstrapName, `${stableDoc} must use a version-neutral bootstrap command`);
  }
  const stableReadme = read("README.md");
  assert.equal(releasePaths.includes("README.md"), true, "README is a Release ZIP input");
  const newcomerTerms = stableReadme.indexOf("如果你第一次接触本仓库的Release流程");
  const readmeInputWarning = stableReadme.indexOf("它本身也是Release ZIP输入");
  assert.ok(newcomerTerms >= 0 && newcomerTerms < readmeInputWarning,
    "README must explain Release terms before warning that it changes candidate bytes");
  const newcomerIntro = stableReadme.slice(newcomerTerms, readmeInputWarning);
  assert.match(newcomerIntro, /`C0`[\s\S]*exact source commit/);
  assert.match(newcomerIntro, /`Source\/Candidate`[\s\S]*第一条Cloud验收通道/);
  assert.match(newcomerIntro, /`Release-excluded`[\s\S]*不进入Release ZIP/);
  assert.match(newcomerIntro, /ROADMAP\.md#release-four-step-flow/);
  assert.match(stableReadme, /for bootstrap in init-cloud-sandbox-v\*\.bash; do/);
  assert.match(stableReadme,
    /python tools\/build_release\.py build --output \.\/dist\/pwf-codex-cloud-hooks-candidate\.zip/);
  assert.match(stableReadme,
    /python tools\/build_release\.py check --archive \.\/dist\/pwf-codex-cloud-hooks-candidate\.zip/);
  assert.match(stableReadme, /candidate\.zip[\s\S]{0,240}本地中间产物[\s\S]{0,240}正式资产名/);
  assert.match(stableReadme, /HOOKS_VERSION[\s\S]{0,320}HOOKS_SHA256/);
  assert.match(stableReadme, /HOOKS_PACKAGE[\s\S]{0,240}HOOKS_URL[\s\S]{0,240}派生/);
  assert.match(stableReadme, /package、contract[\s\S]{0,240}Source\/Candidate[\s\S]{0,240}只(?:修改|替换)[\s\S]{0,160}HOOKS_VERSION[\s\S]{0,160}HOOKS_SHA256/);
  assert.match(stableReadme, /README\.md[\s\S]{0,200}Release ZIP输入[\s\S]{0,240}Source\/Candidate[\s\S]{0,200}新C0/);
  assert.doesNotMatch(stableReadme, /尚需 F3 live gate|不得描述成 Cloud lifecycle PASS/);
  assert.match(stableReadme, /版本专项 acceptance/);
  for (const retired of [
    "docs/beta3-dev-m3-cloud-equivalence.md",
    "docs/beta3-dev-m4-cutover-plan.md",
  ]) assert.equal(actual.includes(retired), false, retired);
  assert.match(read("docs/repository-governance-guide.md"), /^<a name="repository-governance-guide"><\/a>$/m);
  assert.match(read("MAINTAINER_HANDOFF.md"), /\[[^\]]*仓库治理指南[^\]]*\]\(docs\/repository-governance-guide\.md\)/);
});

test("historical documents have two controlled macro entrances and remain advisory", () => {
  const readme = read("README.md");
  const roadmap = read("ROADMAP.md");
  const historyIndex = read("docs/history/README.md");
  const historyTemplate = read("docs/phase-history-template.md");
  const governanceGuide = read("docs/repository-governance-guide.md");
  const agents = read("AGENTS.md");
  assert.match(readme, /\]\(docs\/history\/README\.md\)/);
  assert.equal((readme.match(/docs\/history\//g) || []).length, 1,
    "README must expose exactly one historical-document entrance");
  for (const anchor of [
    "phase-4-8-post-implementation-status-f3b3",
    "phase-4-8-post-live-status-f3b3",
  ]) assert.match(roadmap, new RegExp(
    `\\]\\(docs/history/phase-4\\.8-f3b3-autonomous-live-discovery\\.md#${anchor}\\)`,
  ));
  assert.equal((roadmap.match(/docs\/history\//g) || []).length, 2,
    "ROADMAP may expose only the two exact Phase evidence links frozen by lifecycle governance");
  assert.doesNotMatch(roadmap, /\]\(docs\/history\/README\.md\)/,
    "ROADMAP must not duplicate README's history index");
  for (const macroDoc of [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md", "DESIGN.md",
    "MAINTAINER_HANDOFF.md",
  ]) assert.doesNotMatch(read(macroDoc), /docs\/history\//,
    `${macroDoc} must not create a third historical-document entrance`);
  for (const policyDoc of [historyIndex, historyTemplate, governanceGuide, agents]) {
    assert.match(policyDoc, /README[\s\S]*ROADMAP/);
  }
  assert.match(governanceGuide, /^<a name="history-record-roles"><\/a>$/m);
  assert.match(governanceGuide, /^<a name="product-phase-authority-rotation"><\/a>$/m);
  assert.match(governanceGuide,
    /RETROSPECTIVE_CAPSULE[\s\S]*FROZEN_DISCOVERY_RECORD[\s\S]*一个Product Phase可以有多份/);
  assert.match(governanceGuide,
    /ROADMAP第4节是current development train工作台[\s\S]*Product Phase closeout[\s\S]*product-phase-N/);
  assert.match(governanceGuide,
    /patch\/governance列车没有新Product Phase时[\s\S]*不得[\s\S]*虚构第5节条目/);
  assert.match(governanceGuide,
    /Product Phase \/ Discovery正在进行[\s\S]*某个Discovery Round关闭[\s\S]*Product Phase正式关闭[\s\S]*版本列车完成Release并轮转/);
  assert.match(governanceGuide,
    /默认是一条列车、一个Product Phase[\s\S]*只有维护者[\s\S]*明确批准/);
  assert.match(governanceGuide,
    /patch继承它修补的Product baseline[\s\S]*governance按声明的版本系列落位/);
  assert.match(governanceGuide,
    /不能唯一判断就停下来问[\s\S]*必须先向维护者[\s\S]*请求确认/);
  assert.match(historyIndex, /RETROSPECTIVE_CAPSULE[\s\S]*Phase 0～3\.9\.3[\s\S]*14/);
  assert.match(historyIndex, /FROZEN_DISCOVERY_RECORD[\s\S]*Phase 4\.1～4\.11[\s\S]*11/);
  assert.match(historyIndex, /Phase 4\.1～4\.11[\s\S]*不表示[\s\S]*11个独立Product Phase/);
  assert.match(historyTemplate, /先选择 record role/);
  assert.match(historyTemplate, /RETROSPECTIVE_CAPSULE[\s\S]*FROZEN_DISCOVERY_RECORD/);
  assert.match(historyTemplate,
    /Product Phase仍活动时[\s\S]*ROADMAP第4节[\s\S]*Product Phase closeout后[\s\S]*ROADMAP第5节/);
  assert.match(historyTemplate, /FROZEN_DISCOVERY_RECORD不得暗示整个Product Phase已经关闭/);
  assert.match(historyTemplate, /Discovery证据不得冒充implementation\/live验收/);
  assert.match(historyTemplate, /> Record role: `<RETROSPECTIVE_CAPSULE \| FROZEN_DISCOVERY_RECORD>`/);
  assert.match(historyTemplate, /可选[\s\S]*append-only status note/i);
  assert.match(historyTemplate, /Post-implementation status/);
  assert.match(historyTemplate, /Post-live status/);
  assert.match(historyTemplate, /Post-discovery status/);
  assert.match(historyTemplate, /不得预填[^\n]*PASS|不预填[^\n]*PASS/);
  assert.match(historyTemplate, /本地[^\n]*不得[^\n]*替代[^\n]*(Cloud|live)/i);
  const phaseHistory = repositoryPaths()
    .filter(relative => /^docs\/history\/[^/]+\.md$/.test(relative))
    .map(read)
    .join("\n");
  assert.doesNotMatch(phaseHistory, /\]\(\.\.\/v0\.4\.0-dev-cloud-hard-acceptance\.md/,
    "Phase history must use immutable evidence after a version acceptance root copy retires");
});

test("Phase 4.13 preserves the v0.4.1 path-safety patch rationale", () => {
  const relative = "docs/history/phase-4.13-v0.4.1-path-safety-patch-train.md";
  const historyIndex = read("docs/history/README.md");
  const artifact = JSON.parse(read(currentArtifactPath));
  assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  const history = read(relative);

  for (const anchor of [
    "phase-4-13-historical-position", "phase-4-13-problem-before",
    "phase-4-13-core-decisions", "phase-4-13-completed-delivery",
    "phase-4-13-acceptance-conclusion", "phase-4-13-explicit-non-goals",
    "phase-4-13-successor-inheritance", "phase-4-13-immutable-evidence",
  ]) assert.match(history, new RegExp(`<a name="${anchor}"></a>`));
  assert.match(history, /^# Phase 4\.13：v0\.4\.1 path-safety patch train$/m);

  assert.match(history, /回顾性[^\n]*patch-train标签/);
  assert.match(history, /不是[^\n]*Product Phase/);
  assert.match(history, /Windows junction[^\n]*穿透[^\n]*外部runtime/);
  assert.match(history, /clean install[\s\S]*runtime不存在[\s\S]*linked parent[\s\S]*向外写入/);
  assert.match(history, /path topology[\s\S]*exact inventory admission[\s\S]*分层/);
  assert.match(history, /install、repair与uninstall[\s\S]*backup[^\n]*mutation前[^\n]*拒绝/);
  assert.match(history, /symlink[\s\S]*junction[\s\S]*非目录component[\s\S]*nested special entry/);
  assert.match(history, /unknown普通文件\/目录[^\n]*完整备份[^\n]*清理/);
  assert.match(history, /`BLOCKED_UNSAFE_RUNTIME_PATH`/);
  assert.match(history, /Linux\/POSIX[^\n]*零skip/);
  assert.match(history, /99885b854bd9621c3340e99f031bf83ceb58414d/);
  assert.match(historyIndex,
    /phase-4\.13-v0\.4\.1-path-safety-patch-train\.md#phase-4-13-historical-position/);
  assert.equal(artifact.entries.some(entry => entry.path === relative), false);
  assert.doesNotMatch(history, /\b\d+\s+(?:tests?|pass|fail|skipped)\b/i);
});

test("Phase 4.14 preserves the Release closeout governance rationale", () => {
  const relative = "docs/history/phase-4.14-release-closeout-governance.md";
  const historyIndex = read("docs/history/README.md");
  const artifact = JSON.parse(read(currentArtifactPath));
  assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  const history = read(relative);

  for (const anchor of [
    "phase-4-14-historical-position", "phase-4-14-problem-before",
    "phase-4-14-historical-p9-calibration", "phase-4-14-core-decisions", "phase-4-14-c0-c1-c2",
    "phase-4-14-completed-delivery", "phase-4-14-acceptance-conclusion",
    "phase-4-14-explicit-non-goals", "phase-4-14-successor-inheritance",
    "phase-4-14-post-implementation-status-stage-guide-retirement",
    "phase-4-14-post-governance-status-history-role-rotation",
    "phase-4-14-post-governance-status-post-pass-retirement-ordering",
    "phase-4-14-post-governance-status-readme-release-handoff",
    "phase-4-14-post-governance-status-maintenance-environment-memory",
    "phase-4-14-post-governance-status-acceptance-directory-migration",
    "phase-4-14-post-governance-status-canonical-baseline-tool-capability",
    "phase-4-14-post-governance-status-published-guide-completion",
    "phase-4-14-post-governance-status-latest-promotion-confirmation",
    "phase-4-14-immutable-evidence",
  ]) assert.match(history, new RegExp(`<a name="${anchor}"></a>`));
  assert.match(history, /^# Phase 4\.14：Release closeout 与验收文档治理回顾$/m);

  assert.match(history, /Product验收[^\n]*Discovery Round/);
  assert.match(history, /Source\/Candidate[^\n]*Published Release[^\n]*两个独立/);
  assert.match(history, /retirement review[^\n]*对象治理/);
  assert.match(history, /普通Release[^\n]*不需要[^\n]*standing Phase 9/);
  assert.match(history, /P9-A～P9-F[\s\S]*首次完整Release探路[\s\S]*不是未来默认模板/);
  assert.match(history, /phase-4\.12-v0\.4\.0-release-discovery\.md/);
  assert.match(history, /phase-4\.13-v0\.4\.1-path-safety-patch-train\.md/);
  assert.match(history, /candidate-readiness retirement checkpoint/);
  assert.match(history, /candidate admission preflight/);
  assert.match(history, /source-candidate closeout retirement checkpoint/);
  assert.match(history, /role-window closeout retirement checkpoint/);
  for (const role of [
    "SOURCE_CANDIDATE_HEAD", "SOURCE_CANDIDATE_CHECKPOINT_HEAD",
    "PUBLISHED_RELEASE_CLOSEOUT_HEAD",
  ]) assert.match(history, new RegExp(`\`${role}\``));
  assert.match(history, /C0[\s\S]*Source\/Candidate Cloud PASS[\s\S]*正式验收tag[^\n]*C0/);
  assert.match(history, /C1[\s\S]*第一阶段PASS[\s\S]*Published Release Cloud/);
  assert.match(history, /C2[\s\S]*Published Release evidence[\s\S]*Latest promotion\/postflight[\s\S]*第二轮退役检查/);
  assert.match(history, /\.\.\/\.\.\/ROADMAP\.md#release-four-step-flow/);
  assert.match(history, /\.\.\/\.\.\/ROADMAP\.md#version-train-two-retirement-reviews/);
  assert.match(history, /版本级black-box acceptance[\s\S]{0,240}阶段guide没有[\s\S]{0,120}同一retirement transaction/);
  assert.match(history, /current tests[\s\S]{0,120}历史教程[\s\S]{0,80}必须存在的回归资产/);
  assert.match(history, /4份阶段guide[\s\S]{0,100}tracked tree清退/);
  assert.match(history, /`临时文件\/`[\s\S]{0,100}Git忽略/);
  assert.match(history,
    /Post-governance status — history roles and Product Phase authority rotation[\s\S]*RETROSPECTIVE_CAPSULE[\s\S]*FROZEN_DISCOVERY_RECORD/);
  assert.match(history,
    /Post-governance status — post-PASS retirement ordering[\s\S]*Source\/Candidate失败[\s\S]*planning[\s\S]*回滚[\s\S]*新C0/);
  assert.match(history,
    /Post-governance status — README Release handoff[\s\S]*build\/check\/hash[\s\S]*HOOKS_VERSION[\s\S]*HOOKS_SHA256/);
  assert.match(history,
    /第一次接触[\s\S]*`C0`[\s\S]*`Source\/Candidate`[\s\S]*`Release-excluded`[\s\S]*README\.md[\s\S]*Release ZIP输入/);
  assert.match(history, /d1547ab50afcc3a275592d41b60daa77ab1062c97c072be3661cfe763467264e/);
  assert.match(history,
    /Post-governance status — persistent maintenance environment memory[\s\S]*planning[\s\S]*AGENTS[\s\S]*重验触发器/);
  assert.match(history,
    /maintenance-environment-profile\.md#maintenance-environment-profile[\s\S]*Release-excluded[\s\S]*Source\/Candidate[\s\S]*PENDING/);
  assert.match(history,
    /Post-governance status — staged acceptance directory migration[\s\S]*v0\.4\.1[\s\S]*冻结[\s\S]*v0\.4\.2[\s\S]*docs\/acceptance\//);
  assert.match(history, /template[\s\S]*硬编码[\s\S]*不可原位改写[\s\S]*C2/);
  assert.match(history,
    /Post-governance status — canonical baseline tool capability[\s\S]*首次安全拒绝[\s\S]*临时授权[\s\S]*exact `[.]planning`路径/);
  assert.match(history, /fixture正文仍只能由apply_patch创建[\s\S]*正式tag继续精确指向C0/);
  assert.match(history, /Post-governance status — Published Release guide completion/);
  assert.match(history, /教程缺口[\s\S]*Cloud hard acceptance template/);
  assert.match(history, /Published Release PASS有效[\s\S]*不需要重跑/);
  assert.match(history, /Pre-release[\s\S]*Latest[\s\S]*尚未[\s\S]*第二轮role-window closeout/);
  assert.match(history,
    /ROADMAP第4节与第5节形成显式authority rotation[\s\S]*product-phase-N[\s\S]*旧第4节没有current入链/);
  assert.match(history,
    /patch train继承它[\s\S]*Product baseline[\s\S]*version series落位[\s\S]*维护者确认/);
  assert.match(history, /没有授权`0\.4\.2`候选封板、Cloud、publication、Latest或下一Product Phase/);
  assert.match(history,
    /Published Release[\s\S]*exact tag\/source\/ZIP\/bootstrap[\s\S]*GitHub Release编辑页面[\s\S]*Release详情页[\s\S]*Latest[\s\S]*不(?:再|另设)[\s\S]*独立postflight/);
  assert.match(history, /\.\.\/\.\.\/ROADMAP\.md#github-release-latest-promotion-confirmation/);
  assert.match(history, /本节[\s\S]{0,180}不重新定义[\s\S]{0,180}通用判断/);
  assert.match(historyIndex,
    /phase-4\.14-release-closeout-governance\.md#phase-4-14-historical-position/);
  assert.match(historyIndex, /Phase 4\.12[^\n]*原P9-A～P9-F[^\n]*历史语义/);
  assert.doesNotMatch(historyIndex, /standing Phase 9 是例外的重复 Release gate/);
  assert.equal(artifact.entries.some(entry => entry.path === relative), false);
  assert.doesNotMatch(history, /\b\d+\s+(?:tests?|pass|fail|skipped)\b/i);
});

test("portable repository governance keeps stable retirement anchors", () => {
  const guide = read("docs/repository-governance-guide.md");

  assert.match(guide, /^<a name="repository-governance-guide"><\/a>$/m);
  assert.match(guide, /^<a name="retirement-definition-of-done"><\/a>$/m);
  assert.match(guide, /清退acceptance、runbook、operator guide[\s\S]*同一个retirement transaction/);
  assert.match(guide, /删除前做入链inventory[\s\S]*README\/ROADMAP[\s\S]*history[\s\S]*planning[\s\S]*tests/);
  assert.match(guide, /删除与引用迁移原子闭合[\s\S]*自包含history record[\s\S]*immutable commit\/tag\/Release URL/);
  assert.match(guide, /删除后做反向复扫[\s\S]*broken relative links[\s\S]*失效anchor[\s\S]*test\/oracle依赖/);
  assert.match(guide, /未分类命中[\s\S]{0,40}阻断retirement PASS/);
  assert.match(guide, /允许保留的历史文字命中必须明确只是时间语义，不得仍被解析为current\s+link、required path或可执行教程/);
  assert.match(guide, /^<a name="acceptance-directory-lifecycle"><\/a>$/m);
  assert.match(guide, /新建或尚未冻结的acceptance[\s\S]{0,100}docs\/acceptance\//);
  assert.match(guide, /已经发布并冻结[\s\S]{0,160}角色退出前保留原路径/);
  assert.match(guide, /角色退出后[\s\S]{0,180}exact immutable ref/);
  assert.match(guide, /template路径[\s\S]*冻结guide[\s\S]*不得[\s\S]*双authority/);
});

test("cold history stays on immutable refs and outside runtime, Release, and adapter dispatch", () => {
  const runtime = read(currentBundlePath);
  const release = read(currentArtifactPath);
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
  assert.equal(artifact.entries.some(item => item.path === "patches/patch_planning_skill.py"), false);
  assert.equal(artifact.entries.some(item => item.path === "contracts/compatibility-overlays-v1.json"), false);
  assert.equal(artifact.entries.some(item => item.path.startsWith("docs/") || item.path.startsWith("tests/")), false);
  assert.deepEqual(artifact.external_release_assets, [`init-cloud-sandbox-${candidate}.bash`]);
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
  const phase9History = read("docs/history/phase-4.12-v0.4.0-release-discovery.md");
  const artifact = JSON.parse(read(currentArtifactPath));
  const runtimeBundle = JSON.parse(read(currentBundlePath));
  const { accepted, candidate, immediateFallback, roadmap } = currentRoleWindow();
  const acceptancePath = `docs/acceptance/${candidate}-cloud-hard-acceptance.md`;
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
  const currentDeltaStart = changelog.indexOf(`## ${candidate}`);
  const nextDeltaStart = changelog.indexOf("\n## ", currentDeltaStart + 1);
  const currentDelta = changelog.slice(currentDeltaStart,
    nextDeltaStart === -1 ? changelog.length : nextDeltaStart);
  if (candidate === "v0.4.0") {
    for (const durableReleaseFact of [
      /manifest schema 4/,
      /runtime bundle[^\n]*Release artifact[^\n]*v2/,
      /smart activation/,
      /autonomous/,
      /attestation/,
      /nonce/,
      /ledger/,
      /Fresh\/Resume/,
      /tamper refusal/,
      /disarm-first rollback\/recovery/,
      /deterministic ZIP|确定性 ZIP/,
      /Published Release Cloud/,
    ]) assert.match(currentDelta, durableReleaseFact);
    assert.doesNotMatch(currentDelta, /P9-[A-F]|仍须后继 gate|真实 Cloud[^\n]*仍须|zero-hash pre-seal/,
      "released version delta must not retain pre-release gate state or Phase 9 execution chronology");
  } else if (candidate === "v0.4.1") {
    assert.match(currentDelta, /path topology/);
    assert.match(currentDelta, /unknown普通文件和目录仍会先完整备份再清理/);
    assert.match(currentDelta, /exact SHA并fail closed/);
    assert.match(currentDelta, /immutable publication[\s\S]*Published Release Cloud[\s\S]*pointer-only promotion/);
    assert.doesNotMatch(currentDelta, /\b[a-f0-9]{64}\b|P9-[A-F]|仍须后继 gate|未完成gate|zero hash/);
  }
  assert.equal(artifact.entries.some(entry => entry.path === "CHANGELOG.md"), false);

  assert.match(roadmap, new RegExp("## 3\\. 已接受基线 `" + accepted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "`"));
  assert.doesNotMatch(roadmap, /## 3\. 已完成的仓库迁移|M1 exact mirror|M2 slim transformation/);
  assert.equal((roadmap.match(/GitHub `Latest`/g) || []).length, 1);

  for (const publishedRoleVersion of new Set([accepted, immediateFallback])) {
    assert.match(provenance, new RegExp(publishedRoleVersion.replaceAll(".", "\\.")));
  }
  if (candidate !== accepted) {
    const candidateIsPublished = new RegExp(
      `\`${candidate.replaceAll(".", "\\.")}\` published (?:prerelease candidate|Latest closeout)`,
    ).test(roadmap);
    const candidatePattern = new RegExp(candidate.replaceAll(".", "\\."));
    if (candidateIsPublished) {
      assert.match(provenance, candidatePattern,
        "published candidate must enter the role-neutral provenance ledger");
    } else {
      assert.doesNotMatch(provenance, candidatePattern,
        "unpublished candidate must not enter the published provenance ledger");
    }
  }
  assert.match(provenance, /^## 1\. 已发布身份账本$/m);
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
  assert.match(design, /CHANGELOG\.md/);
  assert.match(changelog,
    /\[`BASELINE_PROVENANCE\.md` 的 Successor 迁移不可变证据\]\(BASELINE_PROVENANCE\.md#successor-migration-evidence\)/);
  assert.doesNotMatch(changelog, /docs\/history\//);
  assert.doesNotMatch(changelog, /Successor 迁移来源链/);

  assert.match(acceptance, new RegExp(`^# ${escapedCandidate} Cloud hard acceptance$`, "m"));
  if (candidate === "v0.4.1") {
    assert.match(acceptance, /^<a name="v0-4-1-gate-status"><\/a>$/m);
    assert.match(acceptance, /Windows path-topology local implementation[^\n]*`PASS`/);
    assert.match(acceptance,
      /Source\/Candidate Linux\/POSIX \+ Cloud[^\n]*`PASS`/);
    assert.match(acceptance, /P9-B local seal[^\n]*`PASS`/);
    assert.match(acceptance, /P9-B sealed-source Cloud[^\n]*`PASS`/);
    assert.match(acceptance, /P9-C immutable publication[^\n]*`PASS`/);
    assert.match(acceptance, /P9-D Published Release Cloud[^\n]*`PASS`/);
    assert.match(acceptance, /P9-E \/ Latest[^\n]*`PASS`/);
    assert.match(acceptance, /P9-F retirement[^\n]*`PASS`/);
    assert.match(acceptance,
      /V0_4_1_SOURCE_CANDIDATE_CLOUD_PASS \/ STOP_BEFORE_SEAL \/ RELEASE_NOT_AUTHORIZED/);
    assert.match(acceptance,
      /V0_4_1_P9_A_PRE_SEAL_MATERIALIZATION_PASS \/ ZERO_HASH_CANDIDATE_FROZEN \/ STOP_BEFORE_P9_B \/ RELEASE_NOT_AUTHORIZED/);
    assert.match(acceptance,
      /P9_B_SEALED_SOURCE_CLOUD_PASS \/ STOP_BEFORE_P9_C \/ PUBLICATION_NOT_AUTHORIZED/);
    assert.match(acceptance, /^<a name="v0-4-1-p9-b-local-seal-evidence"><\/a>$/m);
    assert.match(acceptance, /^<a name="v0-4-1-p9-b-sealed-source-cloud-operator"><\/a>$/m);
    assert.match(acceptance, /^<a name="v0-4-1-p9-b-sealed-source-cloud-evidence"><\/a>$/m);
    const p9bEvidenceAt = acceptance.indexOf('<a name="v0-4-1-p9-b-sealed-source-cloud-evidence"></a>');
    const historicalDevAt = acceptance.indexOf('<a name="v0-4-1-dev-plain-language-workflow"></a>');
    assert.ok(p9bEvidenceAt > 0 && historicalDevAt > p9bEvidenceAt);
    const p9bEvidence = acceptance.slice(p9bEvidenceAt, historicalDevAt);
    for (const fact of [
      "99885b854bd9621c3340e99f031bf83ceb58414d",
      "175 tests，175 pass，0 fail，0 skipped",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "PWF_SOURCE_CANDIDATE_SETUP=PASS", "PWF_WORKTREE_CHANGES=PLANNING_ONLY",
      "POST_RESUME_DOCTOR=PASS", "INSTALLER_VERSION=0.4.1",
      "RELEASE_ARTIFACT_ENTRIES=22", "INSTALLED_RUNTIME_FILES=12",
      "UPSTREAM_PRISTINE_FILES=4", "BUNDLE_INSTALLED_INVENTORY=AUTHORITATIVE",
      "MANAGED_POLICY=ADAPTER_ONLY", "SNAPSHOT_LEFTOVERS=0", "PWF_SC_POST_RESUME=PASS",
    ]) assert.match(p9bEvidence, new RegExp(fact.replaceAll(".", "\\.")));
    assert.match(acceptance, /^<a name="v0-4-1-p9-c-immutable-publication-operator"><\/a>$/m);
    const p9cAt = acceptance.indexOf('<a name="v0-4-1-p9-c-immutable-publication-operator"></a>');
    assert.ok(p9cAt > p9bEvidenceAt && historicalDevAt > p9cAt);
    const p9cOperator = acceptance.slice(p9cAt, historicalDevAt);
    for (const fact of [
      "99885b854bd9621c3340e99f031bf83ceb58414d",
      "5560175aac3a3a3505f56de1df22e9b81112c4b9",
      "pwf-codex-cloud-hooks-v0.4.1.zip", "init-cloud-sandbox-v0.4.1.bash",
      "22 entries", "85,910 bytes", "21,565 bytes",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "1832db08c16b4f7fde88df2699384f1fff8e324909b0e024cb6ef216aea30a43",
      "PWF_P9C_REMOTE_ABSENCE_PREFLIGHT=PASS", "git tag v0.4.1",
      "git push origin refs/tags/v0.4.1", "gh release create v0.4.1",
      "--verify-tag", "--prerelease", "gh release download $tag",
      "P9_C_PUBLICATION_AUDIT=PASS",
      "P9_C_OPERATOR_READY / TAG_SOURCE_FROZEN / MAINTAINER_PUBLICATION_PENDING / STOP_BEFORE_P9_D",
    ]) assert.match(p9cOperator, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(p9cOperator,
      /tag source[^\n]*99885b854bd9621c3340e99f031bf83ceb58414d[\s\S]*5560175aac3a3a3505f56de1df22e9b81112c4b9[^\n]*Release-excluded/);
    assert.match(p9cOperator, /Pre-release[\s\S]*不得[^\n]*(?:Latest|轮转)/);
    assert.match(p9cOperator, /若tag push已成功[\s\S]*不得删除、移动或重建tag/);
    assert.match(acceptance, /^<a name="v0-4-1-p9-c-immutable-publication-evidence"><\/a>$/m);
    const p9cEvidenceAt = acceptance.indexOf('<a name="v0-4-1-p9-c-immutable-publication-evidence"></a>');
    assert.ok(p9cEvidenceAt > p9cAt && historicalDevAt > p9cEvidenceAt);
    const p9cEvidence = acceptance.slice(p9cEvidenceAt, historicalDevAt);
    for (const fact of [
      "99885b854bd9621c3340e99f031bf83ceb58414d",
      "https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/tag/v0.4.1",
      "pwf-codex-cloud-hooks-v0.4.1.zip", "init-cloud-sandbox-v0.4.1.bash",
      "22 entries", "85,910 bytes", "21,565 bytes",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "1832db08c16b4f7fde88df2699384f1fff8e324909b0e024cb6ef216aea30a43",
      "isDraft=false", "isPrerelease=true", "P9_C_PUBLICATION_AUDIT=PASS",
      "P9_C_IMMUTABLE_PUBLICATION_PASS / PUBLIC_ASSETS_REBUILT_AND_MATCHED / STOP_BEFORE_P9_D",
    ]) assert.match(p9cEvidence, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(acceptance, /^<a name="v0-4-1-p9-d-published-release-cloud-operator"><\/a>$/m);
    const p9dAt = acceptance.indexOf('<a name="v0-4-1-p9-d-published-release-cloud-operator"></a>');
    assert.match(acceptance, /^<a name="v0-4-1-p9-d-published-release-cloud-evidence"><\/a>$/m);
    const p9dEvidenceAt = acceptance.indexOf('<a name="v0-4-1-p9-d-published-release-cloud-evidence"></a>');
    assert.ok(p9dAt > p9cEvidenceAt && p9dEvidenceAt > p9dAt && historicalDevAt > p9dEvidenceAt);
    const p9dOperator = acceptance.slice(p9dAt, p9dEvidenceAt);
    for (const anchor of [
      "published-release-setup", "blackbox-fresh-startup", "blackbox-canonical-baseline",
      "blackbox-canonical-context", "blackbox-real-resume", "published-release-deep-check",
    ]) assert.match(p9dOperator, new RegExp(`cloud-hard-acceptance-template\\.md#${anchor}`));
    for (const fact of [
      "__PWF_P9D_OPERATOR_HEAD__", "99885b854bd9621c3340e99f031bf83ceb58414d",
      "https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/download/v0.4.1/init-cloud-sandbox-v0.4.1.bash",
      "1832db08c16b4f7fde88df2699384f1fff8e324909b0e024cb6ef216aea30a43",
      "https://github.com/keeptoy/pwf-codex-cloud-hooks-next/releases/download/v0.4.1/pwf-codex-cloud-hooks-v0.4.1.zip",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "PWF_P9D_PUBLIC_IDENTITY_PREFLIGHT=PASS", "PWF_PUBLIC_RELEASE_SETUP=PASS",
      "PUBLIC_PACKAGE_IDENTITY=0.4.1", "POST_RESUME_DOCTOR=PASS",
      "BUNDLE_INSTALLED_INVENTORY=AUTHORITATIVE", "MANAGED_POLICY=ADAPTER_ONLY",
      "PWF_PUBLIC_ZIP_BOUNDARY_IMPORTER=PASS", "PWF_PUBLIC_POST_RESUME=PASS",
      "P9_D_OPERATOR_READY / MAINTAINER_FRESH_CLOUD_PENDING / STOP_BEFORE_P9_E",
    ]) assert.match(p9dOperator, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(p9dOperator, /4\.2[\s\S]*5\.2[\s\S]*第6节[\s\S]*第7节[\s\S]*8\.1[\s\S]*8\.2[\s\S]*9\.2/);
    assert.match(p9dOperator, /不得设置`HOOKS_URL`、`HOOKS_SHA256`或任何ZIP override/);
    assert.match(p9dOperator, /必须停止在P9-E前/);
    assert.doesNotMatch(p9dOperator, /set -Eeuo pipefail|readonly BOOTSTRAP_URL=|readonly ZIP_URL=/,
      "version operator must not copy the shared Published Release Bash authority");
    assert.match(acceptance, /^<a name="v0-4-1-p9-e-latest-promotion-operator"><\/a>$/m);
    assert.match(acceptance, /^<a name="v0-4-1-p9-e-latest-promotion-evidence"><\/a>$/m);
    const p9eAt = acceptance.indexOf('<a name="v0-4-1-p9-e-latest-promotion-operator"></a>');
    const p9eEvidenceAt = acceptance.indexOf('<a name="v0-4-1-p9-e-latest-promotion-evidence"></a>');
    assert.ok(p9eAt > p9dEvidenceAt && p9eEvidenceAt > p9eAt && historicalDevAt > p9eEvidenceAt);
    const p9dEvidence = acceptance.slice(p9dEvidenceAt, p9eAt);
    for (const fact of [
      "b11464b85df8ff4ed90c34492286a0b1b64f32ca",
      "99885b854bd9621c3340e99f031bf83ceb58414d",
      "PWF_PUBLIC_RELEASE_SETUP=PASS", "PUBLIC_PACKAGE_IDENTITY=0.4.1",
      '"healthy":true', '"repairable":false', '"managed":true',
      '"events":["SessionStart","UserPromptSubmit"]', '"errors":[]', '"blockers":[]',
      '"entries": 22', '"sha256": "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291"',
      '"size": 85910', "POST_RESUME_DOCTOR=PASS", "PWF_DEEP_CHECK_MANIFEST_SCHEMA=4",
      "PWF_DEEP_CHECK_RELEASE_SCHEMA=2", "PWF_DEEP_CHECK_BUNDLE_SCHEMA=2",
      "RELEASE_ARTIFACT_ENTRIES=22", "INSTALLED_RUNTIME_FILES=12", "UPSTREAM_PRISTINE_FILES=4",
      "BUNDLE_INSTALLED_INVENTORY=AUTHORITATIVE", "MANAGED_POLICY=ADAPTER_ONLY",
      "PWF_PUBLIC_ZIP_REDOWNLOAD_SHA256=94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "PWF_PUBLIC_ZIP_BOUNDARY_IMPORTER=PASS", "SNAPSHOT_LEFTOVERS=0", "PWF_PUBLIC_POST_RESUME=PASS",
      "P9_D_PUBLISHED_RELEASE_CLOUD_PASS / PUBLIC_DEFAULT_DOWNLOAD_CHAIN_CONFIRMED / STOP_BEFORE_P9_E",
    ]) assert.match(p9dEvidence, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    const p9eOperator = acceptance.slice(p9eAt, p9eEvidenceAt);
    for (const fact of [
      "99885b854bd9621c3340e99f031bf83ceb58414d",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "1832db08c16b4f7fde88df2699384f1fff8e324909b0e024cb6ef216aea30a43",
      "fe8cd7f284ea2849f634aa68813dbb0f2cca83f9",
      "24a412c19e220a60134547a18797fbd382a48fd5319a1f30a6d5c9b47bd53bb3",
      "4ae21c1fc99f52b1382543fac437096d4db1d3415cb40df578f29ed82cc4c64f",
      "git push origin 0.4.1",
      "gh release edit v0.4.1 --repo keeptoy/pwf-codex-cloud-hooks-next --prerelease=false --latest",
      "PWF_P9E_OPERATOR_HEAD", "PWF_P9E_PREVIOUS_LATEST=v0.4.0", "PWF_P9E_PREFLIGHT=PASS",
      "PWF_P9E_POINTER_PROMOTION=PASS", "PWF_P9E_LATEST=v0.4.1", "PWF_P9E_ACCEPTED=v0.4.1",
      "PWF_P9E_IMMEDIATE_FALLBACK=v0.4.0", "PWF_P9E_DEEPER_FALLBACK=v0.3.5",
      "PWF_P9E_POSTFLIGHT=PASS",
      "P9_E_OPERATOR_READY / MAINTAINER_POINTER_PROMOTION_PENDING / STOP_BEFORE_P9_F",
    ]) assert.match(p9eOperator, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(p9eOperator, /current Latest[^\n]*`v0\.4\.0`/);
    assert.match(p9eOperator, /停止在P9-F前/);
    assert.equal((p9eOperator.match(/^gh release edit v0\.4\.1 .*--prerelease=false --latest$/gm) || []).length, 1);
    assert.doesNotMatch(p9eOperator,
      /gh release (?:create|delete|upload)|git tag|refs\/tags\/v0\.4\.1|--notes|--title|--target/,
      "P9-E operator must not recreate assets, mutate refs, or widen the pointer-only write");
    const p9eEvidence = acceptance.slice(p9eEvidenceAt, historicalDevAt);
    for (const fact of [
      "PWF_P9E_POINTER_PROMOTION=PASS", "PWF_P9E_LATEST=v0.4.1", "PWF_P9E_ACCEPTED=v0.4.1",
      "PWF_P9E_IMMEDIATE_FALLBACK=v0.4.0", "PWF_P9E_DEEPER_FALLBACK=v0.3.5",
      "PWF_P9E_POSTFLIGHT=PASS", "isLatest=true", "isPrerelease=false", "isDraft=false",
      "P9_E_POINTER_PROMOTION_PASS / V0_4_1_ACCEPTED_LATEST / V0_4_0_IMMEDIATE_FALLBACK / STOP_BEFORE_P9_F",
    ]) assert.match(p9eEvidence, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    const v041Provenance = provenance.split(/\r?\n/)
      .find(line => line.startsWith("| `v0.4.1` |")) || "";
    for (const fact of [
      "99885b854bd9621c3340e99f031bf83ceb58414d", "22 entries", "85,910 bytes", "21,565 bytes",
      "94f12fca8157b97a613a04f1857b6688c8d94650ac566c573345760ff6bb6291",
      "1832db08c16b4f7fde88df2699384f1fff8e324909b0e024cb6ef216aea30a43",
    ]) assert.match(v041Provenance, new RegExp(fact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(acceptance, /__PWF_P9B_EXPECTED_HEAD__/);
    assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-setup/);
    assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-deep-check/);
    assert.match(acceptance, /默认情况下，智能体不代替维护者 push/);
    assert.match(acceptance, /维护者回传时请保留/);
    assert.match(acceptance, /明确结束 B 的单次无工具\/不读文件观察限制/);
    assert.match(acceptance, /cloud-hard-acceptance-template\.md#cloud-task-acceptance-permission-prefix/);
    assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-setup/);
    assert.match(acceptance, /cloud-hard-acceptance-template\.md#source-candidate-deep-check/);
    assert.match(acceptance, /^<a name="v0-4-1-dev-source-candidate-evidence"><\/a>$/m);
    assert.match(acceptance, /6c1dd52a3878f59c7140a793b9a2c2a34580b188/);
    assert.match(acceptance, /175 tests \/ 175 pass \/ 0 fail \/ 0 skipped/);
    assert.match(acceptance, /543a72a57fdd7ca04854d5d1dfde6f838bf40e3afa5eb2c52c2d559b3843854a/);
    assert.match(acceptance, /PWF_SOURCE_CANDIDATE_SETUP=PASS/);
    assert.match(acceptance, /PWF_SC_POST_RESUME=PASS/);
    assert.match(acceptance, /首次拒绝作为诊断时间线保留/);
    assert.match(acceptance, /0d470920f42651983062945a129e38838c46f4d7/);
    assert.doesNotMatch(acceptance, /R5-PR=PASS|CLOUD-HARD-ACCEPTANCE-PASS/i);
    assert.match(acceptance,
      /https:\/\/github\.com\/keeptoy\/pwf-codex-cloud-hooks-next\/releases\/download\/v0\.4\.1\//);
  }

});

test("stable architecture contracts do not freeze version history", () => {
  const architectureContracts = read("tests/architecture-contracts.test.js");

  assert.doesNotMatch(architectureContracts, /docs\/v\d+\.\d+\.\d+[^"']*cloud-hard-acceptance\.md/i);
  assert.doesNotMatch(architectureContracts, /\bv\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\b/);
  assert.doesNotMatch(architectureContracts, /\b[a-f0-9]{40,64}\b/i);
  assert.doesNotMatch(architectureContracts, /artifact\.entries\.length/);
});
