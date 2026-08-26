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
const sourceOnlyTrustedPaths = new Set([
  "tools/materialize_release_assets.py",
  "tools/templates/init-cloud-sandbox.bash.in",
]);
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
  const developmentMatch = roadmap.match(new RegExp("^\\| 当前开发列车 \\| `(NONE|" + versionPattern + ")`", "m"));
  const acceptedMatch = roadmap.match(new RegExp("^\\| 当前已接受版本 \\| `(" + versionPattern + ")`", "m"));
  const fallbackMatch = roadmap.match(new RegExp("^\\| 当前直接回退版本 \\| immutable `(" + versionPattern + ")` immediate fallback", "m"));
  assert.ok(developmentMatch, "ROADMAP lacks a parseable current development train");
  assert.ok(acceptedMatch, "ROADMAP lacks a parseable accepted baseline role");
  assert.ok(fallbackMatch, "ROADMAP lacks a parseable immediate fallback role");
  const developmentTrain = developmentMatch[1] === "NONE" ? null : developmentMatch[1];
  const accepted = acceptedMatch[1];
  const immediateFallback = fallbackMatch[1];
  const packageVersion = JSON.parse(read("package.json")).version;
  const candidate = `v${packageVersion}`;
  assert.notEqual(accepted, immediateFallback, "accepted and immediate fallback roles must remain distinct");
  return { accepted, candidate, developmentTrain, immediateFallback, roadmap };
}

test("v0.4.4-dev is active while v0.4.3 remains accepted and v0.4.2 remains fallback", () => {
  const { accepted, candidate, developmentTrain, immediateFallback, roadmap } = currentRoleWindow();
  const acceptedAcceptance = read("docs/acceptance/v0.4.3-cloud-hard-acceptance.md");
  const retiredV042Acceptance = readGit("33deb5870015c94df329fe233e306363ba43232b",
    "docs/acceptance/v0.4.2-cloud-hard-acceptance.md");
  const provenance = read("BASELINE_PROVENANCE.md");
  const phase4Overview = read("docs/product-phases/phase-4.md");
  const currentTrain = roadmap.slice(
    roadmap.indexOf("## 4. 当前开发列车"),
    roadmap.indexOf("## 5. Product Phase 路线"),
  );

  assert.equal(developmentTrain, "v0.4.4-dev");
  assert.equal(candidate, "v0.4.4-dev");
  assert.equal(accepted, "v0.4.3");
  assert.equal(immediateFallback, "v0.4.2");
  assert.match(roadmap, /## 3\. 已接受基线 `v0\.4\.3`/);
  assert.match(roadmap,
    /当前 programme 边界[^\n]*v0\.4\.3[^\n]*均已关闭[^\n]*v0\.4\.4-dev[^\n]*尚未形成C0或Cloud PASS[^\n]*Product Phase 5[^\n]*不产生Phase 5授权/);
  assert.match(currentTrain, /当前exact开发列车是`v0\.4\.4-dev`/);
  assert.match(currentTrain, /^<a name="v0-4-4-release-tag-guide-train"><\/a>$/m);
  assert.match(currentTrain, /Product Phase 4 Overview/);
  assert.match(currentTrain, /BASELINE_PROVENANCE/);
  assert.match(currentTrain, /v0\.4\.3 acceptance/);
  assert.match(currentTrain, /五个planning scope[^\n]*继续/);
  assert.match(currentTrain, /不是C0、Cloud PASS、tag、Release或Phase 5激活/);

  assert.match(phase4Overview, /v0\.4\.3 Release资产物化与验收边界/);
  assert.match(phase4Overview,
    /exact C0、双通道Cloud、immutable publication、GitHub Latest、第二轮role-window closeout与C2现已全部闭合/);
  assert.match(phase4Overview, /`v0\.4\.3`成为[\s\S]{0,80}programme accepted/);
  assert.match(phase4Overview, /v0\.4\.2`成为immediate fallback/);
  assert.match(phase4Overview,
    /显式`SOURCE_CANDIDATE_HEAD`创建annotated tag[\s\S]{0,220}`\^\{\}` peeled commit等于C0/);

  for (const fact of [
    "6204de36cd8b2cbc614a4bb53b8481a5a1ba234d",
    "cfcabcc93c819e2d512a1b9cf0b3f13a451ffea8c82631012b74a64813150231",
    "f738d61551aee20d924e565fe59f5a360a6c13fa2e40dc7e63e7e63e06485c37",
    "PWF_PUBLIC_ZIP_BOUNDARY_IMPORTER=PASS",
    "PWF_PUBLIC_POST_RESUME=PASS",
    "latest_tag=v0.4.3",
    "ROLE_WINDOW_CLOSEOUT_PASS / C2_COMPLETE / NEXT_TRAIN_UNAUTHORIZED",
  ]) assert.match(acceptedAcceptance, new RegExp(fact.replaceAll(".", "\\.")));
  assert.match(acceptedAcceptance, /四个planning scope[\s\S]{0,80}`KEEP`/);
  assert.match(acceptedAcceptance, /v0\.4\.2 current guide\/bootstrap[\s\S]{0,80}`RETIRE`/);
  assert.match(acceptedAcceptance, /publication oracle[\s\S]{0,80}`MIGRATE`/);

  assert.match(retiredV042Acceptance, /ROLE_WINDOW_CLOSEOUT_PASS \/ C2_COMPLETE \/ NEXT_TRAIN_UNAUTHORIZED/);
  assert.equal(fs.existsSync(path.join(root, "docs/acceptance/v0.4.2-cloud-hard-acceptance.md")), false);
  assert.equal(fs.existsSync(path.join(root, "init-cloud-sandbox-v0.4.2.bash")), false);
  assert.match(provenance,
    /blob\/33deb5870015c94df329fe233e306363ba43232b\/docs\/acceptance\/v0\.4\.2-cloud-hard-acceptance\.md#v0-4-2-role-window-closeout/);
  for (const fact of [
    "v0.4.3", "90,364 bytes", "21,565 bytes",
    "cfcabcc93c819e2d512a1b9cf0b3f13a451ffea8c82631012b74a64813150231",
    "f738d61551aee20d924e565fe59f5a360a6c13fa2e40dc7e63e7e63e06485c37",
  ]) assert.match(provenance, new RegExp(fact.replaceAll(".", "\\.")));
});

test("Phase 4.12 preserves the renamed v0.4.0 Release discovery and P9 evidence", () => {
  const phase12 = read("docs/history/phase-4.12-v0.4.0-release-discovery.md");
  const provenance = read("BASELINE_PROVENANCE.md");
  const { roadmap } = currentRoleWindow();

  assert.equal(fs.existsSync(path.join(root, "init-cloud-sandbox-v0.4.0.bash")), false);
  assert.equal(fs.existsSync(path.join(root, "docs/v0.4.0-cloud-hard-acceptance.md")), false);
  assert.match(phase12, /^<a name="phase-4-12-v0-4-0-release-discovery"><\/a>$/m);
  assert.doesNotMatch(phase12, /<a name="phase-9-v0-4-0-/);
  assert.match(phase12, /^# Phase 4\.12：v0\.4\.0 Release 收口 Discovery$/m);
  assert.match(phase12, /^<a name="phase-4-12-renumbering-note"><\/a>$/m);
  assert.match(phase12, /原名[^\n]*Phase 9[^\n]*回顾性[^\n]*Phase 4\.12/);
  assert.match(phase12, /P9-A～P9-F[^\n]*历史正文[^\n]*保留/);
  assert.match(phase12,
    /P9_F_SECOND_RETIREMENT_PASS \/ V0_4_0_TRAIN_CLOSED \/ NEXT_TRAIN_UNDECIDED/);
  assert.match(provenance,
    /blob\/6b388518855da9053713a58e5c918c8b727b6dc6\/docs\/v0\.4\.0-cloud-hard-acceptance\.md#v0-4-0-p9-f-second-retirement-closeout/);
  assert.match(roadmap, /回退证据链[^\n]*`v0\.4\.0`[^\n]*provenance museum/);
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
  const expectedTrusted = [...new Set([
    ...releasePaths.filter(isTrustedSource),
    ...sourceOnlyTrustedPaths,
  ])].sort();
  const actualTrusted = actual.filter(isTrustedSource).sort();

  assert.deepEqual(actualTrusted, expectedTrusted);
  for (const relative of sourceOnlyTrustedPaths) {
    assert.equal(actual.includes(relative), true, relative);
    assert.equal(releasePaths.includes(relative), false, `${relative} must remain source-only`);
  }
  for (const relative of [...releasePaths, ...artifact.external_release_assets]) {
    assert.equal(actual.includes(relative), true, relative);
    assert.equal(fs.existsSync(path.join(root, relative)), true, `${relative} must exist in the working tree`);
  }
  for (const required of [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md", "DESIGN.md",
    "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md", "docs/cloud-hard-acceptance-template.md",
    "docs/cloud-acceptance-operator-guide-template.md",
    "docs/acceptance/README.md",
    "docs/acceptance/v0.4.3-cloud-hard-acceptance.md",
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
  const readme = read("README.md");
  const profilePath = "docs/maintenance-environment-profile.md";
  const profile = read(profilePath);
  const governance = read("docs/repository-governance-guide.md");
  const artifact = JSON.parse(read(currentArtifactPath));

  assert.match(profile, /^<a name="maintenance-environment-profile"><\/a>$/m);
  assert.match(profile, /本地维护机与远程\/Cloud执行面[\s\S]{0,200}物理\/工具限制[\s\S]{0,120}默认对策/);
  assert.match(profile, /2026-08-22[\s\S]{0,500}`wsl\.exe`[\s\S]{0,300}没有已安装发行版/);
  assert.match(profile, /Docker[\s\S]{0,200}Podman[\s\S]{0,200}nerdctl[\s\S]{0,200}不存在/);
  assert.match(profile, /Git Bash[\s\S]{0,300}不能[\s\S]{0,200}Linux\/POSIX证据/);
  assert.match(profile, /Linux零skip[\s\S]{0,200}FIFO\/device[\s\S]{0,200}filesystem/);
  assert.match(profile, /Source\/Candidate Cloud教程[\s\S]{0,200}真实Linux gate/);
  assert.match(profile, /2026-08-25[\s\S]*`CONFIRMED_ROUTE`[\s\S]*disposable Linux Cloud[\s\S]*portable Linux suite/);
  assert.match(profile, /`CONFIRMED_BOUNDARY`[\s\S]*`\/opt\/codex`[\s\S]*不是永久常量/);
  assert.match(profile,
    /`CONFIRMED_VARIABILITY`[\s\S]*只有Shell型读取与apply_patch[\s\S]*exact-path只读Shell preflight/);
  assert.match(profile, /不是[\s\S]{0,160}验收[\s\S]{0,160}永久[\s\S]{0,160}平台承诺/);
  assert.match(profile, /跨阶段执行路由[\s\S]{0,120}不得只记录在planning/);
  assert.match(profile, /重验触发器[\s\S]{0,400}维护者[\s\S]{0,200}环境已经改变/);
  assert.match(profile, /不是[\s\S]{0,160}(?:Host ABI|产品支持合同|永久)/);
  assert.doesNotMatch(profile, /C:\\Users\\|\/home\/|用户名|序列号|account id/i);
  assert.match(agents,
    /\]\(docs\/maintenance-environment-profile\.md#maintenance-environment-profile\)/);
  assert.match(handoff,
    /\]\(docs\/maintenance-environment-profile\.md#maintenance-environment-profile\)/);
  assert.match(readme,
    /\]\(docs\/maintenance-environment-profile\.md#maintenance-environment-profile\)/);
  assert.match(governance, /^<a name="maintenance-environment-memory"><\/a>$/m);
  assert.match(governance,
    /已确认、会跨任务或阶段反复改变本地\/Cloud执行路由的环境限制，不得只保存在会被清退的planning中/);
  assert.match(governance, /应提升到一个持久的[\s\S]{0,80}maintenance environment profile/);
  assert.match(governance,
    /\]\(maintenance-environment-profile\.md#maintenance-environment-profile\)/);
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

test("tracked Markdown local links resolve to existing paths and explicit anchors", () => {
  const placeholders = new Set(["exact-commit-url"]);
  const markdownPaths = repositoryPaths().filter(relative =>
    relative.endsWith(".md")
    && !relative.startsWith(".planning/")
    && !relative.startsWith("tests/fixtures/"));

  for (const source of markdownPaths) {
    const sourcePath = path.join(root, source);
    for (const match of read(source).matchAll(/\]\(([^)]+)\)/g)) {
      let target = match[1].trim();
      if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("#")
        || target.startsWith("__") || placeholders.has(target)) continue;

      const [relativeTarget, fragment] = target.split("#", 2);
      assert.notEqual(relativeTarget, "", `${source} has an empty local link target: ${target}`);
      const resolved = path.resolve(path.dirname(sourcePath), decodeURIComponent(relativeTarget));
      assert.equal(resolved === root || resolved.startsWith(`${root}${path.sep}`), true,
        `${source} link escapes the repository: ${target}`);
      assert.equal(fs.existsSync(resolved), true, `${source} link target is missing: ${target}`);

      if (fragment) {
        assert.equal(fs.statSync(resolved).isFile(), true,
          `${source} fragment target is not a file: ${target}`);
        const explicitAnchor = `<a name="${fragment}"></a>`;
        assert.equal(fs.readFileSync(resolved, "utf8").includes(explicitAnchor), true,
          `${source} link lacks an explicit target anchor: ${target}`);
      }
    }
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
  const phaseOverviewDocs = docs.filter(item => /^docs\/product-phases\/phase-\d+\.md$/.test(item));

  assert.equal(artifact.excluded_prefixes.includes("docs/"), true);
  for (const relative of docs) {
    assert.match(relative, /^docs\/(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.md$/);
    assert.equal(releasePaths.includes(relative), false, relative);
  }
  assert.deepEqual(rootBootstraps, roleVersions.map(version => `init-cloud-sandbox-${version}.bash`));
  const expectedAcceptanceDocs = [`docs/acceptance/${accepted}-cloud-hard-acceptance.md`];
  if (candidate !== accepted && !candidate.endsWith("-dev")) {
    expectedAcceptanceDocs.push(`docs/acceptance/${candidate}-cloud-hard-acceptance.md`);
  }
  assert.deepEqual(acceptanceDocs, expectedAcceptanceDocs.sort());
  assert.deepEqual(acceptanceDocs.map(relative => path.basename(relative).replace("-cloud-hard-acceptance.md", "")).sort(),
    expectedAcceptanceDocs.map(relative => path.basename(relative).replace("-cloud-hard-acceptance.md", "")).sort());
  assert.deepEqual(phaseOverviewDocs, ["docs/product-phases/phase-4.md"]);
  assert.equal(docs.includes("docs/product-phase-overview-template.md"), true);
  assert.equal(docs.includes("docs/product-phases/README.md"), true);
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
  assert.match(acceptanceTemplate,
    /Source\/Candidate 验证“当前 C0 源码 \+ 当前 contract 指定的 bootstrap \+ 当前源码构建的 ZIP”/);
  assert.match(acceptanceTemplate,
    /Published Release 才验证正式 bootstrap 的默认 GitHub 下载地址、内嵌exact ZIP SHA和公开 ZIP/);
  assert.match(acceptanceTemplate,
    /HOOKS_URL`\/`HOOKS_SHA256` override[\s\S]{0,180}不代表公开下载链[\s\S]{0,240}不得沿用[\s\S]{0,100}本地override/);
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
  assert.match(stableReadme, /三个看起来相似、实际职责完全不同的本地对象/);
  assert.match(stableReadme,
    /pwf-codex-cloud-hooks-candidate\.zip[\s\S]{0,320}本地开发预检[\s\S]{0,320}不要把`candidate\.zip`改名上传/);
  assert.match(stableReadme,
    /Release生成器不读取它[\s\S]{0,120}不会把它重命名成正式ZIP/);
  assert.match(stableReadme, /materialize_release_assets\.py candidate-bootstrap --write/);
  assert.match(stableReadme,
    /第一条带`--write`[\s\S]{0,80}真正写文件[\s\S]{0,400}64位zero ZIP SHA/);
  assert.match(stableReadme,
    /第二条不带`--write`[\s\S]{0,80}只检查、不修改[\s\S]{0,360}逐字节比较/);
  assert.match(stableReadme,
    /第一条：按唯一模板真正生成候选bootstrap[\s\S]{0,120}第二条：用只读模式确认/);
  assert.match(stableReadme,
    /当前checkout根目录中由Release contract唯一指定的candidate bootstrap[\s\S]{0,520}state=unchanged[\s\S]{0,240}不修改C0/);
  assert.doesNotMatch(stableReadme, /根目录development bootstrap属于C0受测输入/);
  assert.match(stableReadme,
    /模板4\.1[\s\S]{0,240}Source\/Candidate setup[\s\S]{0,280}不会扫描根目录、比较SemVer或猜测/);
  assert.match(stableReadme,
    /当前Cloud checkout[\s\S]{0,100}upstream-manifest\.json[\s\S]{0,160}Release artifact contract[\s\S]{0,160}external_release_assets（必须恰好一项）/);
  assert.match(stableReadme,
    /旧accepted bootstrap和新candidate bootstrap可以同时留在根目录[\s\S]{0,180}只执行当前contract点名的那一个/);
  assert.match(stableReadme,
    /HOOKS_URL=file:\/\/本轮新构建的候选ZIP[\s\S]{0,120}HOOKS_SHA256=该候选ZIP的实际SHA-256/);
  assert.match(stableReadme,
    /Source\/Candidate证明的是[\s\S]{0,240}不证明公开下载链[\s\S]{0,240}Published Release[\s\S]{0,160}不带这两个本地override/);
  assert.match(stableReadme, /4\.1的override与脚本默认值如何配合/);
  assert.match(stableReadme,
    /readonly HOOKS_URL="\$\{HOOKS_URL:-默认GitHub URL\}"[\s\S]{0,120}readonly HOOKS_SHA256="\$\{HOOKS_SHA256:-脚本内嵌SHA\}"/);
  assert.match(stableReadme,
    /`readonly`不是“禁止外部override”[\s\S]{0,300}环境值[\s\S]{0,280}内嵌非零hash[\s\S]{0,180}覆盖其默认值/);
  assert.match(stableReadme,
    /技术上“能够覆盖”不等于验收合同“允许拿正式脚本或旧脚本当candidate”[\s\S]{0,180}不override[\s\S]{0,60}`HOOKS_VERSION`/);
  assert.match(stableReadme,
    /contract asset文件名与当前package version[\s\S]{0,100}脚本内嵌[\s\S]{0,80}version[\s\S]{0,160}zero-hash字节/);
  assert.match(stableReadme,
    /zero hash：保证候选脚本[\s\S]{0,120}URL\/SHA override[\s\S]{0,140}version\/contract\/zero-hash测试/);
  assert.match(stableReadme,
    /materialize_release_assets\.py release[\s\S]{0,160}--version vX\.Y\.Z[\s\S]{0,160}--expected-zip-sha/);
  assert.match(stableReadme,
    /exact ZIP SHA-256[\s\S]{0,160}来自Cloud evidence[\s\S]{0,160}不由早期本地`candidate\.zip`代替/);
  const tagGuideStart = stableReadme.indexOf("#### 先给已通过的C0创建并推送正式tag");
  const releaseMaterializeStart = stableReadme.indexOf("维护者只替换下面命令中的`vX.Y.Z`");
  assert.ok(tagGuideStart !== -1 && tagGuideStart < releaseMaterializeStart,
    "exact C0 tag guide must precede formal asset materialization");
  assert.match(stableReadme,
    /C1 checkout直接运行不带commit参数的`git tag -a`[\s\S]{0,240}不能指向C1、C2或碰巧存在的当前HEAD/);
  assert.match(stableReadme, /git tag -a \$RELEASE_VERSION \$SOURCE_CANDIDATE_HEAD/);
  assert.match(stableReadme,
    /git push origin "refs\/tags\/\$\{RELEASE_VERSION\}:refs\/tags\/\$\{RELEASE_VERSION\}"/);
  assert.match(stableReadme,
    /annotated tag自身有一个tag-object SHA[\s\S]{0,160}带`\^\{\}`的peeled commit[\s\S]{0,100}必须等于C0/);
  assert.match(stableReadme, /不能用`-f`、删除重建或移动tag修补/);
  assert.match(stableReadme,
    /不是“复制旧ZIP并改名”[\s\S]{0,500}重新build\/check[\s\S]{0,240}Source\/Candidate Cloud SHA/);
  assert.match(stableReadme,
    /dist\/pwf-codex-cloud-hooks-vX\.Y\.Z\.zip[\s\S]{0,160}dist\/init-cloud-sandbox-vX\.Y\.Z\.bash/);
  assert.match(stableReadme, /HOOKS_PACKAGE[\s\S]{0,240}HOOKS_URL[\s\S]{0,240}派生/);
  assert.match(stableReadme, /同名但不同字节[\s\S]{0,120}停止[\s\S]{0,120}不覆盖/);
  assert.doesNotMatch(stableReadme, /readonly HOOKS_VERSION="\$\{HOOKS_VERSION:-vX\.Y\.Z\}"/);
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
  const phaseOverviewIndex = read("docs/product-phases/README.md");
  const phaseOverviewTemplate = read("docs/product-phase-overview-template.md");
  const phase4Overview = read("docs/product-phases/phase-4.md");
  const agents = read("AGENTS.md");
  assert.match(readme, /\]\(docs\/history\/README\.md\)/);
  assert.match(readme,
    /Product Phase Overview[\s\S]*Phase 历史过程账本[\s\S]*长期 Product Phase 结论读对应 overview/);
  assert.doesNotMatch(readme, /Phase 历史摘要/);
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
  assert.doesNotMatch(governanceGuide, /product-phase-authority-rotation/);
  assert.match(governanceGuide,
    /RETROSPECTIVE_CAPSULE[\s\S]*FROZEN_DISCOVERY_RECORD[\s\S]*一个Product Phase可以有多份/);
  assert.match(governanceGuide,
    /ROADMAP\.md#product-phase-overview-rotation[\s\S]*通用history冻结[\s\S]*不复制[\s\S]*仓库专用状态机/);
  assert.match(governanceGuide,
    /programme在record冻结后插入、拆分或重编号Product Phase时[\s\S]*不得搜索替换历史正文[\s\S]*Post-programme reindex status/);
  assert.match(historyIndex, /RETROSPECTIVE_CAPSULE[\s\S]*Phase 0～3\.9\.3[\s\S]*Phase 4\.12～4\.16[\s\S]*16/);
  assert.match(historyIndex, /FROZEN_DISCOVERY_RECORD[\s\S]*Phase 4\.1～4\.11[\s\S]*11/);
  assert.match(historyIndex, /Phase 4\.1～4\.11[\s\S]*不表示[\s\S]*11个独立Product Phase/);
  assert.match(historyIndex,
    /精选过的历史过程账本[\s\S]*不保存原始聊天、逐命令日志[\s\S]*长期Product结论读对应[\s\S]*Product Phase Overview[\s\S]*现行programme只读ROADMAP/);
  assert.match(historyIndex,
    /过程账本只有两种record role[\s\S]*回顾型`RETROSPECTIVE_CAPSULE`[\s\S]*探路\/决策型`FROZEN_DISCOVERY_RECORD`[\s\S]*不再扩展第三种身份/);
  assert.match(historyIndex,
    /Post-programme reindex status[\s\S]*Phase 5\/6\/7\/8[\s\S]*Phase 6\/7\/8\/9[\s\S]*`0\.9\.0-\*`/);
  assert.match(historyTemplate, /先选择 record role/);
  assert.match(historyTemplate, /RETROSPECTIVE_CAPSULE[\s\S]*FROZEN_DISCOVERY_RECORD/);
  assert.match(historyTemplate,
    /Product Phase激活后[\s\S]*docs\/product-phases\/phase-N\.md#product-phase-N-overview[\s\S]*Product Phase closeout[\s\S]*不再把history current links从ROADMAP第4节迁到第5节/);
  assert.match(phaseOverviewIndex, /^<a name="product-phase-overview-index"><\/a>$/m);
  assert.match(phaseOverviewIndex,
    /真实激活过的 Product Phase 的长期说明书[\s\S]*未激活[\s\S]*不提前创建空文件/);
  assert.match(phaseOverviewIndex,
    /不(?:是|等同于)某个 SemVer 或 GitHub Release note[\s\S]*Product Phase可以覆盖[\s\S]*多个版本列车/);
  assert.match(phaseOverviewTemplate, /^<a name="product-phase-overview-template"><\/a>$/m);
  assert.match(phaseOverviewTemplate, /未激活[\s\S]*不得先建空overview/);
  assert.match(phase4Overview, /^<a name="product-phase-4-overview"><\/a>$/m);
  assert.equal(fs.existsSync(path.join(root, "docs/product-phases/phase-5.md")), false);
  assert.match(historyTemplate, /FROZEN_DISCOVERY_RECORD不得暗示整个Product Phase已经关闭/);
  assert.match(historyTemplate, /Discovery证据不得冒充implementation\/live验收/);
  assert.match(historyTemplate, /> Record role: `<RETROSPECTIVE_CAPSULE \| FROZEN_DISCOVERY_RECORD>`/);
  assert.match(historyTemplate, /可选[\s\S]*append-only status note/i);
  assert.match(historyTemplate, /Post-implementation status/);
  assert.match(historyTemplate, /Post-live status/);
  assert.match(historyTemplate, /Post-discovery status/);
  assert.match(historyTemplate, /Post-programme reindex status/);
  assert.match(historyTemplate, /不得预填[^\n]*PASS|不预填[^\n]*PASS/);
  assert.match(historyTemplate, /本地[^\n]*不得[^\n]*替代[^\n]*(Cloud|live)/i);
  const reindexedHistory = [
    ["phase-3.9.3-machine-field-lifecycle-and-origin.md", "phase-3-9-3"],
    ["phase-4.1-managed-v3-discovery.md", "phase-4-1"],
    ["phase-4.2-programme-route-review.md", "phase-4-2"],
    ["phase-4.4-f2a-smart-activation-discovery.md", "phase-4-4"],
    ["phase-4.5-f2b-autonomous-activation-discovery.md", "phase-4-5"],
    ["phase-4.6-f3-cloud-lifecycle-discovery.md", "phase-4-6"],
    ["phase-4.8-f3b3-autonomous-live-discovery.md", "phase-4-8"],
  ];
  for (const [file, phase] of reindexedHistory) {
    const history = read(`docs/history/${file}`);
    assert.match(history, new RegExp(`<a name="${phase}-post-programme-reindex-status"></a>`));
    assert.match(history,
      /Post-programme reindex status[\s\S]*旧Phase 5\/6\/7\/8[\s\S]*Phase 6\/7\/8\/9[\s\S]*`0\.9\.0-\*`/);
    assert.match(history, /当前Phase 5只预占`0\.5\.0-\*`[\s\S]*不产生development train激活、实施或Release授权/);
    assert.match(history, /ROADMAP\.md#product-phase-route-index/);
  }
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

test("Phase 4.14 keeps stable Release closeout governance interfaces", () => {
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
    "phase-4-14-post-governance-status-product-phase-overview-authority",
    "phase-4-14-post-governance-status-post-pass-retirement-ordering",
    "phase-4-14-post-governance-status-readme-release-handoff",
    "phase-4-14-post-governance-status-maintenance-environment-memory",
    "phase-4-14-post-governance-status-acceptance-directory-migration",
    "phase-4-14-post-governance-status-canonical-baseline-tool-capability",
    "phase-4-14-post-governance-status-published-guide-completion",
    "phase-4-14-post-governance-status-latest-promotion-confirmation",
    "phase-4-14-post-governance-status-role-window-closeout",
    "phase-4-14-post-governance-status-post-v0-4-2-residue-sweep",
    "phase-4-14-immutable-evidence",
  ]) assert.match(history, new RegExp('<a name="' + anchor + '"></a>'));

  assert.match(history, /^# Phase 4\.14：Release closeout 与验收文档治理回顾$/m);
  for (const invariant of [
    /Product验收[^\n]*Discovery Round/,
    /Source\/Candidate[\s\S]{0,100}Published Release[\s\S]{0,100}两个独立Release/,
    /retirement review[^\n]*对象治理/,
    /普通Release[^\n]*不需要[^\n]*standing Phase 9/,
    /candidate admission preflight/,
    /source-candidate closeout retirement checkpoint/,
    /role-window closeout retirement checkpoint/,
    /SOURCE_CANDIDATE_HEAD/,
    /SOURCE_CANDIDATE_CHECKPOINT_HEAD/,
    /PUBLISHED_RELEASE_CLOSEOUT_HEAD/,
    /C0[\s\S]*Source\/Candidate Cloud PASS[\s\S]*正式验收tag[^\n]*C0/,
    /C1[\s\S]*第一阶段PASS[\s\S]*Published Release Cloud/,
    /C2[\s\S]*Published Release evidence[\s\S]*第二轮退役检查/,
    /phase-4\.12-v0\.4\.0-release-discovery\.md#phase-4-12-v0-4-0-release-discovery/,
    /phase-4\.13-v0\.4\.1-path-safety-patch-train\.md#phase-4-13-historical-position/,
    /post-v0\.4\.2 residue sweep（Batch A\/B）/,
    /22-entry Release allowlist[\s\S]{0,80}交集为0/,
  ]) assert.match(history, invariant);

  for (const authority of [
    "../../ROADMAP.md#release-four-step-flow",
    "../../ROADMAP.md#version-train-two-retirement-reviews",
    "../../ROADMAP.md#github-release-latest-promotion-confirmation",
    "../../ROADMAP.md#product-phase-overview-rotation",
    "../product-phases/phase-4.md#product-phase-4-overview",
  ]) assert.equal(history.includes(authority), true, 'Phase 4.14 lacks authority link: ' + authority);

  assert.match(historyIndex,
    /phase-4\.14-release-closeout-governance\.md#phase-4-14-historical-position/);
  assert.doesNotMatch(history,
    /phase-4-14-post-governance-status-release-asset-materialization|Post-governance status — Release asset materialization/);
  assert.doesNotMatch(historyIndex, /standing Phase 9 是例外的重复 Release gate/);
  assert.equal(artifact.entries.some(entry => entry.path === relative), false);
  assert.doesNotMatch(history, /\b\d+\s+(?:tests?|pass|fail|skipped)\b/i);
});

test("Phase 4.15 preserves v0.4.3 Release asset materialization governance", () => {
  const relative = "docs/history/phase-4.15-v0.4.3-release-asset-materialization.md";
  const historyIndex = read("docs/history/README.md");
  const artifact = JSON.parse(read(currentArtifactPath));
  assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  const history = read(relative);

  for (const anchor of [
    "phase-4-15-historical-position", "phase-4-15-problem-before",
    "phase-4-15-core-decisions", "phase-4-15-completed-delivery",
    "phase-4-15-acceptance-conclusion", "phase-4-15-explicit-non-goals",
    "phase-4-15-successor-inheritance", "phase-4-15-immutable-evidence",
  ]) assert.match(history, new RegExp('<a name="' + anchor + '"></a>'));

  assert.match(history, /^# Phase 4\.15：v0\.4\.3 Release asset materialization 与验收入口治理$/m);
  assert.match(history, /Record role: `RETROSPECTIVE_CAPSULE`/);
  assert.match(history, /Phase 4\.14继续只解释Release closeout[\s\S]{0,180}本文解释维护者如何/);
  assert.match(history, /单一bootstrap source[\s\S]{0,160}tools\/templates\/init-cloud-sandbox\.bash\.in/);
  assert.match(history, /薄materializer[\s\S]{0,240}tools\/materialize_release_assets\.py/);
  assert.match(history, /三个本地对象分角色[\s\S]*candidate\.zip[\s\S]*zero-hash bootstrap[\s\S]*正式双资产/);
  assert.match(history, /manifest→Release contract→唯一external asset[\s\S]*不扫描根目录[\s\S]*不比较SemVer/);
  assert.match(history, /zero或non-zero默认值[\s\S]*不override `HOOKS_VERSION`[\s\S]*canonical zero-hash字节/);
  assert.match(history, /Source\/Candidate证明当前C0[\s\S]*Published[\s\S]*不带本地override/);
  assert.match(history, /add5f8c98b81c3019f4f095f566a80913d02df95/);
  assert.match(historyIndex,
    /phase-4\.15-v0\.4\.3-release-asset-materialization\.md#phase-4-15-historical-position/);
  assert.equal(artifact.entries.some(entry => entry.path === relative), false);
  assert.doesNotMatch(history, /\b\d+\s+(?:tests?|pass|fail|skipped)\b/i);
});

test("Phase 4.16 preserves v0.4.4 exact C0 tag guide governance", () => {
  const relative = "docs/history/phase-4.16-v0.4.4-release-tag-guide.md";
  const historyIndex = read("docs/history/README.md");
  const artifact = JSON.parse(read(currentArtifactPath));
  assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  const history = read(relative);

  for (const anchor of [
    "phase-4-16-historical-position", "phase-4-16-problem-before",
    "phase-4-16-core-decisions", "phase-4-16-completed-delivery",
    "phase-4-16-acceptance-conclusion", "phase-4-16-explicit-non-goals",
    "phase-4-16-successor-inheritance", "phase-4-16-immutable-evidence",
  ]) assert.match(history, new RegExp('<a name="' + anchor + '"></a>'));

  assert.match(history, /^# Phase 4\.16：v0\.4\.4 Release tag 操作教程治理$/m);
  assert.match(history, /Record role: `RETROSPECTIVE_CAPSULE`/);
  assert.match(history, /README本身是Release ZIP输入[\s\S]*新的`v0\.4\.4-dev` development identity/);
  assert.match(history, /`SOURCE_CANDIDATE_HEAD`[\s\S]*`git tag -a`的commit参数[\s\S]*禁止依赖当前HEAD/);
  assert.match(history, /同名tag fail closed[\s\S]*不使用[\s\S]*force、移动、删除重建或覆盖/);
  assert.match(history, /只push exact tag ref[\s\S]*完整tag refspec/);
  assert.match(history, /annotated tag按peeled commit核对[\s\S]*`\^\{\}` peeled commit[\s\S]*精确等于`SOURCE_CANDIDATE_HEAD`/);
  assert.match(history, /accepted v0\.4\.3作为exact installed predecessor/);
  assert.match(history, /aea21aea851e17ee9cc9cbc462a031afa5cad8c8/);
  assert.match(historyIndex,
    /phase-4\.16-v0\.4\.4-release-tag-guide\.md#phase-4-16-historical-position/);
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
  const acceptancePath = `docs/acceptance/${accepted}-cloud-hard-acceptance.md`;
  const acceptance = read(acceptancePath);
  const escapedAccepted = accepted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

  assert.match(roadmap, new RegExp("## 3\\. 已接受基线 `" + accepted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "`"));
  assert.doesNotMatch(roadmap, /## 3\. 已完成的仓库迁移|M1 exact mirror|M2 slim transformation/);
  assert.equal((roadmap.match(/^<a name="github-release-latest-promotion-confirmation"><\/a>$/gm) || []).length, 1);

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

  assert.match(acceptance, new RegExp(`^# ${escapedAccepted} Cloud hard acceptance$`, "m"));
});

test("stable architecture contracts do not freeze version history", () => {
  const architectureContracts = read("tests/architecture-contracts.test.js");

  assert.doesNotMatch(architectureContracts, /docs\/v\d+\.\d+\.\d+[^"']*cloud-hard-acceptance\.md/i);
  assert.doesNotMatch(architectureContracts, /\bv\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\b/);
  assert.doesNotMatch(architectureContracts, /\b[a-f0-9]{40,64}\b/i);
  assert.doesNotMatch(architectureContracts, /artifact\.entries\.length/);
});
