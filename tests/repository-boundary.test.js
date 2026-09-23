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

function assertHistoryIndexAdmission(index, histories) {
  const roleStart = index.indexOf("## Current role classification");
  const recordsStart = index.indexOf("## 已收录 history objects", roleStart);
  const recordsEnd = index.indexOf("## 阅读方式", recordsStart);
  assert.ok(roleStart >= 0 && recordsStart > roleStart && recordsEnd > recordsStart,
    "history index must separate role summary and indexed records");
  const roleSection = index.slice(roleStart, recordsStart);
  const roleRows = [...roleSection.matchAll(/^\| `([^`]+)` \| ([^|\r\n]+) \| (\d+) \|$/gm)];
  assert.deepEqual(roleRows.map(([, role]) => role).sort(),
    ["FROZEN_DISCOVERY_RECORD", "RETROSPECTIVE_CAPSULE"],
    "history index must have exactly the two approved record roles");
  const frozenSummary = roleRows.find(([, role]) => role === "FROZEN_DISCOVERY_RECORD")[2];
  assert.match(frozenSummary, /\bPhase 5\.1\b/,
    "Phase 5.1 must be classified as frozen Discovery in the index");

  const recordLines = index.slice(recordsStart, recordsEnd).split(/\r?\n/)
    .filter(line => /^\| Phase /.test(line));
  const indexed = recordLines.map(line => {
    const match = line.match(/^\| Phase [^|\r\n]+ \| [^|\r\n]+ \| \[[^\]]+\]\((phase-[^\/#)\s]+\.md)(?:#([a-z0-9-]+))?\) \|$/);
    assert.ok(match, "history index row must link one local phase record: " + line);
    return { file: match[1], fragment: match[2] || null };
  });
  assert.equal(new Set(indexed.map(row => row.file)).size, indexed.length,
    "history index must not duplicate a record");
  assert.equal(roleRows.reduce((total, row) => total + Number(row[3]), 0), indexed.length,
    "history role totals must equal indexed record membership");
  for (const { file, fragment } of indexed) {
    assert.ok(histories.has(file), "indexed history record is missing: " + file);
    if (fragment) {
      const phase = file.match(/^phase-(\d+(?:\.\d+)*)-/)?.[1].replaceAll(".", "-");
      assert.ok(phase && fragment.startsWith(`phase-${phase}-`),
        "history index fragment must be scoped to its record's Phase: " + file);
      assert.ok(histories.get(file).includes(`<a name="${fragment}"></a>`),
        "history index fragment must resolve in its record: " + file);
    }
    assert.doesNotMatch(histories.get(file), /^> (?:Target record role|Record status: `DRAFT)/m,
      "indexed record must no longer be a draft: " + file);
  }
  for (const [file, markdown] of histories) {
    if (indexed.some(row => row.file === file)) continue;
    assert.match(markdown, /^> Target record role: `(?:RETROSPECTIVE_CAPSULE|FROZEN_DISCOVERY_RECORD)`$/m,
      "unindexed history file must declare a draft target role: " + file);
    assert.match(markdown, /^> Record status: `DRAFT \/ OPEN[^`]*`$/m,
      "unindexed history file must remain an open draft: " + file);
  }
  const phase51 = "phase-5.1-document-test-governance-discovery.md";
  assert.ok(indexed.some(row => row.file === phase51), "Phase 5.1 frozen Discovery must be indexed");
  assert.match(histories.get(phase51), /^> Record role: `FROZEN_DISCOVERY_RECORD`$/m,
    "Phase 5.1 must declare its frozen Discovery role");
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

function assertMaintenanceEnvironmentRoutes(profile) {
  const section = number => {
    const start = profile.search(new RegExp(`^## ${number}\\. `, "m"));
    const end = profile.search(new RegExp(`^## ${number + 1}\\. `, "m"));
    assert.ok(start >= 0 && end > start, `environment profile lacks section ${number}`);
    return profile.slice(start, end);
  };
  const table = (body, label, width) => {
    const lines = body.split(/\r?\n/);
    const first = lines.findIndex(line => line.startsWith("|"));
    assert.ok(first >= 0 && /^\|[\s:|-]+\|$/.test(lines[first + 1] || ""),
      `${label} must contain a Markdown table`);
    const parse = line => line.split("|").slice(1, -1).map(cell => cell.trim());
    const rows = [];
    for (let i = first + 2; i < lines.length && lines[i].startsWith("|"); i++) {
      const cells = parse(lines[i]);
      assert.equal(cells.length, width, `${label} has a malformed row`);
      assert.ok(cells.every(Boolean), `${label} has an empty field`);
      rows.push(cells);
    }
    assert.equal(new Set(rows.map(row => row[0])).size, rows.length,
      `${label} has a duplicate environment/route`);
    return rows;
  };
  const localSection = section(2);
  const cloudSection = section(3);
  const routeSection = section(4);
  for (const [body, label] of [[localSection, "local"], [cloudSection, "Cloud"]]) {
    const date = body.match(/(?:核对|复核)日期：\*\*(\d{4}-\d{2}-\d{2})\*\*/);
    assert.ok(date && !Number.isNaN(Date.parse(`${date[1]}T00:00:00Z`)),
      `${label} facts need a valid dated scope`);
  }
  const local = new Map(table(localSection, "local facts", 5).map(row => [row[0], row]));
  const cloud = new Map(table(cloudSection, "Cloud facts", 5).map(row => [row[0], row]));
  for (const key of ["本地操作系统", "WSL", "本地容器", "Git Bash / MSYS"]) {
    assert.ok(local.has(key), `local environment fact is missing: ${key}`);
  }
  for (const key of ["Source/Candidate Linux Cloud", "Cloud Host路径/默认值", "Cloud task工具inventory"]) {
    assert.ok(cloud.has(key), `Cloud environment fact is missing: ${key}`);
  }
  for (const [key, status] of [
    ["本地操作系统", "CONFIRMED"], ["WSL", "CONFIRMED"],
    ["本地容器", "CONFIRMED"], ["Git Bash / MSYS", "CONFIRMED_BOUNDARY"],
  ]) assert.equal(local.get(key)[1], `\`${status}\``, `${key} status changed`);
  for (const [key, status] of [
    ["Source/Candidate Linux Cloud", "CONFIRMED_ROUTE"],
    ["Cloud Host路径/默认值", "CONFIRMED_BOUNDARY"],
    ["Cloud task工具inventory", "CONFIRMED_VARIABILITY"],
  ]) assert.equal(cloud.get(key)[1], `\`${status}\``, `${key} status changed`);
  assert.match(cloud.get("Source/Candidate Linux Cloud")[2], /Linux Cloud[\s\S]*portable Linux suite/,
    "Cloud route must retain its dated Linux-suite evidence");
  assert.match(cloud.get("Cloud task工具inventory")[4], /exact-path只读Shell preflight[\s\S]*apply_patch/,
    "tool variability needs a bounded read fallback and separate write path");
  const routes = table(routeSection, "default evidence routes", 3);
  const linuxRoute = routes.find(row => /Linux零skip|POSIX权限|FIFO\/device/.test(row[0]));
  assert.ok(linuxRoute, "Linux-only evidence needs an explicit default route");
  assert.match(linuxRoute[1], /Windows[\s\S]*SKIP/i,
    "Windows must not claim Linux-only evidence");
  assert.match(linuxRoute[2], /Source\/Candidate Cloud[\s\S]*Linux gate/,
    "Linux-only evidence must route to a real Cloud Linux gate");
  assert.match(local.get("Git Bash / MSYS")[4], /Linux Cloud/,
    "Git Bash must not replace the Linux Cloud route");
}

function assertPlanningDeletionConsent(governance, roadmap) {
  const guideStart = '<a name="planning-lifecycle"></a>';
  const guideEnd = '<a name="history-record-roles"></a>';
  const guideFrom = governance.indexOf(guideStart);
  const guideTo = governance.indexOf(guideEnd, guideFrom + guideStart.length);
  assert.ok(guideFrom >= 0 && guideTo > guideFrom, "Guide must own the planning lifecycle section");
  const guideBody = governance.slice(guideFrom, guideTo);
  const guide = guideBody.replace(/\s+/g, " ");
  const closeout = [...guideBody.matchAll(/^\d+\.\s+([\s\S]*?)(?=^\d+\.\s+|^活动 planning)/gm)]
    .map(([, item]) => item.replace(/\s+/g, " "))
    .find(item => /completed scope/.test(item) && /`\.active_plan`/.test(item));
  assert.ok(closeout, "Guide must retain completed-scope closeout guidance");
  assert.match(guide, /`\.planning\/\.active_plan`[^。]*(?:只|仅)[^。]*(?:选择|指向)[^。]*(?:不负责|不会|不能|不得)[^。]*(?:自动)?(?:删除|移除)/,
    "active pointer selects one scope; it does not delete others");
  assert.match(closeout, /completed scope[^。]*维护者[^。]*(?:评审|审查)[^。]*(?:决定|批准)/,
    "maintainer must decide completed-scope removal in a separate review");
  assert.match(closeout, /(?:不从|不得从|不能由)[^。]*指针切换[^。]*(?:删除|移除)|指针切换[^。]*(?:不会|不能|不产生)[^。]*(?:删除|移除)/,
    "pointer switch must not imply deletion authority");

  const roadmapStart = '<a name="version-train-two-retirement-reviews"></a>';
  const roadmapEnd = '<a name="pre-1-compatibility-admission"></a>';
  const releaseFrom = roadmap.indexOf(roadmapStart);
  const releaseTo = roadmap.indexOf(roadmapEnd, releaseFrom + roadmapStart.length);
  assert.ok(releaseFrom >= 0 && releaseTo > releaseFrom, "ROADMAP needs its Release retirement section");
  const release = roadmap.slice(releaseFrom, releaseTo).replace(/\s+/g, " ");
  assert.match(release, /\]\(docs\/repository-governance-guide\.md#planning-lifecycle\)/,
    "Release checkpoint must route planning deletion to the Guide owner");
  assert.match(release, /维护者[^。]*(?:决定|批准)[^。]*(?:移除|删除)|(?:移除|删除)[^。]*维护者[^。]*(?:决定|批准)/,
    "Release review must ask for maintainer deletion consent");
  const noAutoDelete = release.split("。").find(sentence => /C0\/C2/.test(sentence)
    && /\.active_plan/.test(sentence) && /planning/.test(sentence));
  assert.ok(noAutoDelete, "Release lifecycle must name non-authorizing checkpoint and pointer events");
  assert.match(noAutoDelete, /(?:不得|不能|不可|不应)[^。]*(?:自动删除|移除|删除)planning/,
    "C0/C2 and pointer movement must not authorize planning deletion");
  assert.doesNotMatch(`${guide} ${release}`, /(?<!不)(?:可|允许|应|直接)自动(?:删除|移除)(?:其他目录|completed scope|planning)/,
    "owner and projection must not grant automatic planning deletion");
}

function assertAcceptanceRoleProjections(index, cloudTemplate) {
  const roleAnchor = '<a name="acceptance-role-window"></a>';
  assert.equal(index.split(roleAnchor).length, 2, "acceptance index needs one role-window entry");
  const indexLinks = [...index.matchAll(/\]\(([^)]+)\)/g)].map(([, target]) => target);
  assert.ok(indexLinks.includes("../../ROADMAP.md#release-four-step-flow"),
    "acceptance index must route programme roles to ROADMAP");
  assert.ok(indexLinks.includes("../repository-governance-guide.md#acceptance-directory-lifecycle"),
    "acceptance index must route retirement to the Guide");
  const indexProse = index.replace(/\s+/g, " ");
  assert.match(indexProse, /candidate \+ accepted[^。]*(?:不等于|并非|不是)[^。]*(?:最新一份|单份)/,
    "acceptance window must not collapse to one newest guide");
  assert.match(indexProse, /(?:已经冻结|冻结后)[^。；]*accepted[^。；]*(?:可以|可)[^。；]*current/,
    "accepted guide may remain a current copy");
  assert.match(indexProse, /旧版guide[^。；]*角色退出前[^。；]*(?:可|允许)[^。；]*保留/,
    "old guide may remain until role exit");
  assert.match(indexProse, /退出角色窗口后[^。]*immutable refs[^。]*(?:清退|移除)current副本/,
    "after role exit the current copy routes to immutable refs");

  const responsibilityAnchor = '<a name="acceptance-document-responsibilities"></a>';
  const routingAnchor = '<a name="version-discovery-round-routing"></a>';
  const deltaAnchor = '<a name="version-acceptance-delta"></a>';
  const responsibilitiesStart = cloudTemplate.indexOf(responsibilityAnchor);
  const routingStart = cloudTemplate.indexOf(routingAnchor, responsibilitiesStart + responsibilityAnchor.length);
  const routingEnd = cloudTemplate.indexOf(deltaAnchor, routingStart + routingAnchor.length);
  assert.ok(responsibilitiesStart >= 0 && routingStart > responsibilitiesStart && routingEnd > routingStart,
    "Cloud template must separate responsibility and Discovery routing roles");
  const responsibilities = cloudTemplate.slice(responsibilitiesStart, routingStart);
  const rows = responsibilities.split(/\r?\n/).filter(line => /^\| /.test(line) && !/^\| 位置 \|/.test(line))
    .map(line => line.split("|").slice(1, -1).map(cell => cell.trim()));
  const byRole = new Map(rows.map(row => [row[0], row]));
  assert.equal(rows.length, 5, "Cloud template must not duplicate document responsibilities");
  assert.equal(byRole.size, 5, "Cloud template must retain five distinct document responsibilities");
  assert.deepEqual([...byRole.keys()].sort(), [
    "本模板", "Operator Guide结构模板", "活动 Release task plan", "本轮 operator guide", "ROADMAP",
  ].sort(), "Cloud template must not assign duties to an unknown owner");
  assert.ok(rows.every(row => row.length === 3 && row.every(Boolean)),
    "Cloud template responsibility rows must keep owner, duty and exclusion");
  const duty = role => byRole.get(role)?.[1] || "";
  assert.match(duty("本模板"), /Source\/Candidate[\s\S]*Published Release[\s\S]*(?:执行协议|执行流程)/,
    "Cloud template owns both channel execution protocols");
  assert.match(duty("Operator Guide结构模板"), /Pre-run[\s\S]*channel checkpoint[\s\S]*final Post-run[\s\S]*freeze/,
    "Operator Guide template owns the guide write lifecycle");
  assert.match(duty("活动 Release task plan"), /(?:当前授权|授权)[\s\S]*Next Step/,
    "active task plan owns authorization and Next Step");
  assert.match(duty("本轮 operator guide"), /(?:一轮|本轮)[\s\S]*exact身份[\s\S]*final Post-run/,
    "one operator guide owns exact evidence and final status");
  assert.match(duty("ROADMAP"), /programme[\s\S]*(?:角色|lifecycle)/,
    "ROADMAP owns programme roles");
  assert.match(cloudTemplate, /\]\(cloud-acceptance-operator-guide-template\.md\)/,
    "Cloud template must route guide structure to its owner");
  assert.match(responsibilities, /\.\.\/ROADMAP\.md#release-four-step-flow/,
    "Cloud template must route Release programme to ROADMAP");

  const routing = cloudTemplate.slice(routingStart, routingEnd);
  const bullets = routing.split(/^\s*- /m);
  const countRule = bullets.find(bullet => /Discovery Round/.test(bullet) && /gate/.test(bullet));
  assert.ok(countRule && countRule.split(/[。；;]/).some(clause =>
    /Discovery Round/.test(clause) && /计数单位|按[^。；]*计数/.test(clause)),
  "formal Discovery Round, not gate, must count new guides");
  assert.match(countRule, /gate[^。]*只是[^。]*(?:检查点|执行单元)|gate[^。]*(?:不是|不计入)[^。]*(?:Round|轮)/,
    "gate must remain inside a Round or Release workflow");
  assert.match(routing, /single-Discovery[\s\S]*vX\.Y\.Z-cloud-hard-acceptance\.md/,
    "single-Discovery uses the acceptance filename as an operator guide");
  assert.match(routing, /每个正式 Discovery Round[\s\S]*vX\.Y\.Z-<round>-operator-guide\.md/,
    "multi-Discovery uses one guide per formal Round");
}

function assertAcceptanceWritebackRoles(cloudTemplate, operatorTemplate) {
  const evidenceAnchor = '<a name="release-channel-checkpoint-routing"></a>';
  const evidenceFrom = cloudTemplate.indexOf(evidenceAnchor);
  const evidenceTo = cloudTemplate.indexOf("## 11. ", evidenceFrom + evidenceAnchor.length);
  assert.ok(evidenceFrom >= 0 && evidenceTo > evidenceFrom,
    "Cloud template must keep a bounded evidence-writeback section");
  const evidence = cloudTemplate.slice(evidenceFrom, evidenceTo);
  const bullets = evidence.split(/^- /m).map(item => item.replace(/\s+/g, " "));
  const source = bullets.find(item => item.startsWith("Source/Candidate："));
  const published = bullets.find(item => item.startsWith("Published Release："));
  assert.ok(source && published, "both Release channels need their own evidence roles");
  assert.match(source, /完整 commit[^。]*ZIP[^。]*SHA/,
    "Source/Candidate writeback needs source and candidate ZIP evidence");
  assert.match(published, /exact tag\/source[^。]*immutable URL[^。]*SHA/,
    "Published Release writeback needs public identity and asset evidence");
  assert.match(evidence, /channel checkpoint[^\r\n]*final Post-run/,
    "writeback must distinguish checkpoint from final result");

  const lifecycleAnchor = '<a name="operator-guide-document-lifecycle"></a>';
  const positioningAnchor = '<a name="operator-guide-positioning"></a>';
  const lifecycleFrom = operatorTemplate.indexOf(lifecycleAnchor);
  const lifecycleTo = operatorTemplate.indexOf(positioningAnchor, lifecycleFrom + lifecycleAnchor.length);
  assert.ok(lifecycleFrom >= 0 && lifecycleTo > lifecycleFrom,
    "Operator Guide needs a bounded lifecycle owner section");
  const lifecycle = operatorTemplate.slice(lifecycleFrom, lifecycleTo);
  const rules = [...lifecycle.matchAll(/^\d+\.\s+([\s\S]*?)(?=^\d+\.\s+|^普通Release|^生成具体guide)/gm)]
    .map(([, rule]) => rule.replace(/\s+/g, " "));
  const retryRule = rules.find(rule => /失败(?:重试|尝试)|首次错误|恢复(?:位置|点)/.test(rule));
  assert.ok(retryRule, "guide lifecycle needs a failure/retry ownership rule");
  assert.match(retryRule, /活动 planning|当前规划/,
    "retry and recovery state must stay in active planning");
  assert.match(retryRule, /guide[^。]*(?:只保存|仅保存)[^。]*(?:最终结论|最终状态)/,
    "frozen guide must retain only final outcome and essential deviation");
}

function assertCloudTemplateNeutrality(template) {
  const fences = [...template.matchAll(/^(\x60{3,}|~{3,})([A-Za-z0-9_-]+)[ \t]*\r?\n([\s\S]*?)^\1[ \t]*$/gm)];
  assert.ok(fences.length > 0, "Cloud template must retain its protocol fences");
  for (const [, , language, body] of fences) {
    const protocol = body.split(/\r?\n/)
      .filter(line => language.toLowerCase() !== "bash" || !/^\s*#/.test(line)).join("\n");
    assert.doesNotMatch(protocol, new RegExp(versionPattern, "i"),
      "Cloud template protocol must not pin a version");
    assert.doesNotMatch(protocol, /\b[a-f0-9]{40,64}\b/i,
      "Cloud template protocol must not pin a source or asset hash");
    assert.doesNotMatch(protocol, /Phase 4 marker|Gate ledger|Cloud state|当前状态|R5_PR_IN_PROGRESS/i,
      "Cloud template protocol must not carry a current gate result");
    assert.doesNotMatch(protocol,
      /^\s*(?:readonly\s+)?(?:PUBLICATION_TAG|PACKAGE_VERSION|ZIP_NAME|ZIP_SIZE)\s*=\s*(?!["']?\$\()[^\r\n]+/gm,
      "Cloud template artifact identity must be machine-derived");
  }
  for (const [startAnchor, endAnchor, names] of [
    ["published-release-setup", "blackbox-post-install-resume",
      ["BOOTSTRAP_URL", "BOOTSTRAP_SHA256"]],
    ["published-release-deep-check", "acceptance-evidence-writeback",
      ["ZIP_URL", "ZIP_SHA256"]],
  ]) {
    const start = template.indexOf(`<a name="${startAnchor}"></a>`);
    const end = template.indexOf(`<a name="${endAnchor}"></a>`, start);
    assert.ok(start >= 0 && end > start, `${startAnchor} needs a bounded section`);
    const sectionFences = [...template.slice(start, end)
      .matchAll(/^(\x60{3,}|~{3,})([A-Za-z0-9_-]+)[ \t]*\r?\n([\s\S]*?)^\1[ \t]*$/gm)];
    assert.equal(sectionFences.length, 1, `${startAnchor} needs one executable fence`);
    assert.equal(sectionFences[0][2].toLowerCase(), "bash");
    const lines = sectionFences[0][3].split(/\r?\n/).map(line => line.trim());
    for (const name of names) {
      const assignments = lines.filter(line => new RegExp(`^(?:readonly )?${name}=`).test(line));
      assert.deepEqual(assignments, [`readonly ${name}="__IMMUTABLE_${name}__"`],
        `${startAnchor} must use one unresolved ${name} placeholder`);
    }
  }
  const withoutFences = fences.reduce((text, fence) => text.replace(fence[0], ""), template);
  for (const line of withoutFences.split(/\r?\n/)) {
    if (/^#{1,6}\s/.test(line)) {
      assert.doesNotMatch(line, new RegExp(versionPattern, "i"),
        "Cloud template heading must not pin a version");
      assert.doesNotMatch(line, /\b[a-f0-9]{40,64}\b/i,
        "Cloud template heading must not pin a hash");
    }
    if (/^#{1,6}\s/.test(line) || /^\|\s*(?:当前状态|Current status|Cloud state|Gate ledger)\s*\|/i.test(line)
      || /^(?:当前状态|Current status|Cloud state|Gate ledger)\s*[:：]/i.test(line)) {
      assert.doesNotMatch(line, /当前状态|Current status|Cloud state|Gate ledger|R5_PR_IN_PROGRESS/i,
        "Cloud template must not acquire a current-state authority slot");
    }
  }
  const responsibilityStart = withoutFences.indexOf('<a name="acceptance-document-responsibilities"></a>');
  const responsibilityEnd = withoutFences.indexOf('<a name="version-discovery-round-routing"></a>');
  assert.ok(responsibilityStart >= 0 && responsibilityEnd > responsibilityStart,
    "Cloud template must retain its responsibility section");
  const responsibilities = withoutFences.slice(responsibilityStart, responsibilityEnd);
  for (const row of responsibilities.split(/\r?\n/).filter(line => /^\|/.test(line))) {
    assert.doesNotMatch(row, new RegExp(versionPattern, "i"),
      "Cloud template responsibility table must not pin a version");
    assert.doesNotMatch(row, /\b[a-f0-9]{40,64}\b/i,
      "Cloud template responsibility table must not pin a hash");
  }
}

function assertC0TagOperatorBlock(markdown) {
  const anchor = '<a name="source-candidate-c0-tag-push"></a>';
  assert.equal(markdown.split(anchor).length, 2, "Wiki must have one C0 tag guide anchor");
  const tail = markdown.slice(markdown.indexOf(anchor) + anchor.length);
  const fences = [...tail.matchAll(/^(\x60{3}|~{3})([A-Za-z0-9_-]+)[ \t]*\r?\n([\s\S]*?)^\1[ \t]*$/gm)];
  const gitFences = fences.filter(([, , , body]) => /\bgit\s+(?:tag|push)\b/i.test(body));
  assert.equal(gitFences.length, 1, "C0 guide must have one executable tag/push block");
  assert.equal(gitFences[0][2].toLowerCase(), "powershell");
  const body = gitFences[0][3];
  const lines = body.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  const tag = "git tag -a $RELEASE_VERSION $SOURCE_CANDIDATE_HEAD " + String.fromCharCode(96);
  const release = "$" + "{RELEASE_VERSION}";
  const push = 'git push origin "refs/tags/' + release + ':refs/tags/' + release + '"';
  assert.deepEqual(lines.filter(line => /^git (?:tag|push)\b/i.test(line)), [tag, push],
    "active tag/push commands must target C0 and only one exact tag ref");
  assert.equal([...body.matchAll(/\bgit\s+(?:tag|push)\b/gi)].length, 2,
    "C0 block must not hide another tag/push action");

  const stop = condition => ({ condition });
  const required = [
    '$resolvedCandidate = (git rev-parse --verify "$SOURCE_CANDIDATE_HEAD^{commit}").Trim()',
    'if ($LASTEXITCODE -ne 0 -or $resolvedCandidate -ne $SOURCE_CANDIDATE_HEAD) {',
    'git show-ref --verify --quiet "refs/tags/$RELEASE_VERSION"',
    stop('if ($LASTEXITCODE -eq 0)'),
    stop('if ($LASTEXITCODE -ne 1)'),
    '$remoteTag = git ls-remote --exit-code --tags origin "refs/tags/$RELEASE_VERSION"',
    stop('if ($LASTEXITCODE -eq 0)'),
    stop('if ($LASTEXITCODE -ne 2)'),
    tag,
    '$localTagCommit = (git rev-parse --verify "$RELEASE_VERSION^{commit}").Trim()',
    'if ($LASTEXITCODE -ne 0 -or $localTagCommit -ne $SOURCE_CANDIDATE_HEAD) {',
    push,
    '$remoteRefs = @(git ls-remote --tags origin ' + String.fromCharCode(96),
    '"refs/tags/$RELEASE_VERSION" ' + String.fromCharCode(96),
    '"refs/tags/$RELEASE_VERSION^{}")',
    "$peeledLine = @($remoteRefs | Where-Object { $_ -match '\\^\\{\\}$' })",
    stop('if ($peeledLine.Count -ne 1)'),
    "$remoteTagCommit = ($peeledLine[0] -split '\\s+')[0]",
    'if ($remoteTagCommit -ne $SOURCE_CANDIDATE_HEAD) {',
  ];
  let previous = -1;
  for (const step of required) {
    const index = lines.findIndex((line, i) => i > previous && (typeof step === "string"
      ? line === step
      : line.startsWith(step.condition + " { throw ") && line.endsWith(" }")));
    assert.ok(index > previous, "C0 operator block lacks ordered safety step: " +
      (typeof step === "string" ? step : step.condition));
    previous = index;
  }
  for (const guard of [
    'if ($LASTEXITCODE -ne 0 -or $resolvedCandidate -ne $SOURCE_CANDIDATE_HEAD) {',
    'if ($LASTEXITCODE -ne 0 -or $localTagCommit -ne $SOURCE_CANDIDATE_HEAD) {',
    'if ($remoteTagCommit -ne $SOURCE_CANDIDATE_HEAD) {',
  ]) {
    const index = lines.indexOf(guard);
    assert.match(lines[index + 1] || "", /^throw\s+\S/, "C0 guard must stop: " + guard);
    assert.equal(lines[index + 2], "}", "C0 guard must close after throw: " + guard);
  }
}

function assertSourceCandidateBootstrapSelection(template, wiki) {
  const anchor = '<a name="source-candidate-setup"></a>';
  const nextAnchor = '<a name="published-release-setup"></a>';
  assert.equal(template.split(anchor).length, 2, "Cloud template must have one 4.1 setup anchor");
  const start = template.indexOf(anchor) + anchor.length;
  const end = template.indexOf(nextAnchor, start);
  assert.ok(end > start, "4.1 setup must precede Published Release setup");
  const section = template.slice(start, end);
  const fences = [...section.matchAll(/^(\x60{3,}|~{3,})([A-Za-z0-9_-]+)[ \t]*\r?\n([\s\S]*?)^\1[ \t]*$/gm)];
  assert.equal(fences.length, 1, "4.1 setup must have one executable code fence");
  assert.equal(fences[0][2].toLowerCase(), "bash");
  const script = fences[0][3];
  const lines = script.split(/\r?\n/).map(line => line.trim())
    .filter(line => line && !line.startsWith("#"));
  const selectors = [...script.matchAll(/^BOOTSTRAP="\$\(python3 - <<'PY'\r?\n([\s\S]*?)^PY\r?\n\)"$/gm)];
  assert.equal(selectors.length, 1, "4.1 must have one active Python bootstrap selector");
  assert.equal(lines.filter(line => /^BOOTSTRAP=/.test(line)).length, 1,
    "4.1 must not overwrite the selected bootstrap");
  const selectorLines = selectors[0][1].split(/\r?\n/).map(line => line.trim())
    .filter(line => line && !line.startsWith("#"));
  const selectorSteps = [
    'manifest = json.loads(Path("upstream-manifest.json").read_text(encoding="utf-8"))',
    'artifact_path = manifest["managed_runtime"]["contracts"]["release_artifact"]["path"]',
    'artifact = json.loads(Path(artifact_path).read_text(encoding="utf-8"))',
    'assets = artifact["external_release_assets"]',
    'assert len(assets) == 1',
    'print(assets[0])',
  ];
  let previous = -1;
  for (const step of selectorSteps) {
    const index = selectorLines.indexOf(step, previous + 1);
    assert.ok(index > previous, "4.1 selector lacks ordered contract step: " + step);
    previous = index;
  }
  assert.deepEqual(selectorLines, ['import json', 'from pathlib import Path', ...selectorSteps],
    "4.1 selector must not add an executable branch or reassign contract data");
  assert.deepEqual(selectorLines.filter(line => /^print\(/.test(line)), ['print(assets[0])'],
    "4.1 must emit only the contract-selected bootstrap");

  const invocation =
    'HOOKS_URL="file://$ZIP_A" HOOKS_SHA256="$ACTUAL_ZIP_SHA256" bash "$BOOTSTRAP" all';
  const executionSteps = [
    'test -f "$BOOTSTRAP"',
    'bash -n "$BOOTSTRAP"',
    'python3 tools/build_release.py build --output "$ZIP_A"',
    'cmp "$ZIP_A" "$ZIP_B"',
  ];
  previous = lines.indexOf('BOOTSTRAP="$(python3 - <<\'PY\'');
  assert.ok(previous >= 0, "4.1 selector assignment is missing");
  for (const step of executionSteps) {
    const index = lines.indexOf(step, previous + 1);
    assert.ok(index > previous, "4.1 lacks ordered validation/build step: " + step);
    previous = index;
  }
  const hashIndex = lines.findIndex((line, i) => i > previous &&
    line.startsWith('ACTUAL_ZIP_SHA256=') && line.includes('sha256sum "$ZIP_A"'));
  assert.ok(hashIndex > previous, "4.1 must hash the locally built candidate ZIP");
  const invokeIndex = lines.indexOf(invocation, hashIndex + 1);
  assert.ok(invokeIndex > hashIndex, "4.1 must invoke the selected bootstrap with local URL/SHA");
  assert.deepEqual(lines.filter(line => /\bbash\b.*\ball\b/i.test(line)), [invocation],
    "4.1 must have only one bootstrap execution");
  assert.match(wiki, /\]\(docs\/cloud-hard-acceptance-template\.md#source-candidate-setup\)/,
    "Wiki must route selection details to the executable 4.1 owner");
}

test("C0 operator guide rejects harmful commands but permits equivalent explanation", () => {
  const wiki = read("Wiki.md");
  const changeOnce = (before, after) => {
    assert.ok(wiki.includes(before), "probe precondition missing: " + before);
    return wiki.replace(before, after);
  };
  assert.doesNotThrow(() => assertC0TagOperatorBlock(wiki));

  const wrongTag = changeOnce("\ngit tag -a $RELEASE_VERSION $SOURCE_CANDIDATE_HEAD ",
    "\ngit tag -a $RELEASE_VERSION $SOURCE_CANDIDATE_CHECKPOINT_HEAD ") +
    "\nExpected example: git tag -a $RELEASE_VERSION $SOURCE_CANDIDATE_HEAD";
  assert.throws(() => assertC0TagOperatorBlock(wrongTag), /active tag\/push commands/);

  const release = "$" + "{RELEASE_VERSION}";
  const safePush = 'git push origin "refs/tags/' + release + ':refs/tags/' + release + '"';
  const wrongPush = changeOnce(safePush, "git push origin --tags") +
    "\nExpected example: " + safePush;
  assert.throws(() => assertC0TagOperatorBlock(wrongPush), /active tag\/push commands/);

  const missingPreflight = changeOnce(
    'if ($LASTEXITCODE -ne 0 -or $resolvedCandidate -ne $SOURCE_CANDIDATE_HEAD) {',
    'if ($LASTEXITCODE -ne 0) {');
  assert.throws(() => assertC0TagOperatorBlock(missingPreflight), /ordered safety step/);

  const wrongRemotePeel = changeOnce(
    'if ($remoteTagCommit -ne $SOURCE_CANDIDATE_HEAD) {',
    'if ($remoteTagCommit -ne $SOURCE_CANDIDATE_CHECKPOINT_HEAD) {');
  assert.throws(() => assertC0TagOperatorBlock(wrongRemotePeel), /ordered safety step/);

  const fence = String.fromCharCode(96).repeat(3);
  const hiddenBroadPush = wiki + "\n### Additional command\n\n" + fence +
    "powershell\nGIT PUSH origin --tags\n" + fence + "\n";
  assert.throws(() => assertC0TagOperatorBlock(hiddenBroadPush), /one executable tag\/push block/);
  const tildeBroadPush = wiki + "\n~~~powershell\nGIT PUSH origin --tags\n~~~\n";
  assert.throws(() => assertC0TagOperatorBlock(tildeBroadPush), /one executable tag\/push block/);

  const rephrased = changeOnce(
    '不能指向C1、C2或碰巧存在的当前HEAD',
    '必须仍固定在Cloud验收通过的C0，不能因后续治理提交而改变');
  assert.doesNotThrow(() => assertC0TagOperatorBlock(rephrased));

  const rephrasedStop = changeOnce(
    'throw "本地tag已存在；停止并核对，禁止移动或覆盖"',
    'throw "同名本地标签已存在，请停止并核对"');
  assert.doesNotThrow(() => assertC0TagOperatorBlock(rephrasedStop));
});

test("Source/Candidate 4.1 selects the contract bootstrap and tolerates equivalent Wiki prose", () => {
  const template = read("docs/cloud-hard-acceptance-template.md");
  const wiki = read("Wiki.md");
  const changeOnce = (before, after) => {
    assert.ok(template.includes(before), "probe precondition missing: " + before);
    return template.replace(before, after);
  };
  assert.doesNotThrow(() => assertSourceCandidateBootstrapSelection(template, wiki));

  const wrongSelector = changeOnce('print(assets[0])', 'print("init-cloud-sandbox-old.bash")') +
    "\nExpected selector: print(assets[0])\n";
  assert.throws(() => assertSourceCandidateBootstrapSelection(wrongSelector, wiki),
    /ordered contract step/);

  const invocation =
    'HOOKS_URL="file://$ZIP_A" HOOKS_SHA256="$ACTUAL_ZIP_SHA256" bash "$BOOTSTRAP" all';
  const wrongInvocation = changeOnce(invocation,
    'HOOKS_URL="file://$ZIP_A" HOOKS_SHA256="$ACTUAL_ZIP_SHA256" bash "init-cloud-sandbox-old.bash" all') +
    "\nExpected invocation: " + invocation + "\n";
  assert.throws(() => assertSourceCandidateBootstrapSelection(wrongInvocation, wiki),
    /invoke the selected bootstrap/);

  const missingAdmission = changeOnce('assert len(assets) == 1', 'assert assets');
  assert.throws(() => assertSourceCandidateBootstrapSelection(missingAdmission, wiki),
    /ordered contract step/);
  const reassignedAssets = changeOnce('print(assets[0])',
    'assets = ["init-cloud-sandbox-old.bash"]\nprint(assets[0])');
  assert.throws(() => assertSourceCandidateBootstrapSelection(reassignedAssets, wiki),
    /must not add an executable branch/);
  const missingValidation = changeOnce('test -f "$BOOTSTRAP"', 'test -f "init-cloud-sandbox-old.bash"');
  assert.throws(() => assertSourceCandidateBootstrapSelection(missingValidation, wiki),
    /ordered validation\/build step/);
  const missingSyntaxCheck = changeOnce('bash -n "$BOOTSTRAP"', 'bash -n "init-cloud-sandbox-old.bash"');
  assert.throws(() => assertSourceCandidateBootstrapSelection(missingSyntaxCheck, wiki),
    /ordered validation\/build step/);
  const missingOverride = changeOnce(invocation,
    'HOOKS_URL="file://$ZIP_A" bash "$BOOTSTRAP" all');
  assert.throws(() => assertSourceCandidateBootstrapSelection(missingOverride, wiki),
    /invoke the selected bootstrap/);
  const missingLocalUrl = changeOnce(invocation,
    'HOOKS_SHA256="$ACTUAL_ZIP_SHA256" bash "$BOOTSTRAP" all');
  assert.throws(() => assertSourceCandidateBootstrapSelection(missingLocalUrl, wiki),
    /invoke the selected bootstrap/);
  const overwritten = changeOnce('test -f "$BOOTSTRAP"',
    'BOOTSTRAP="init-cloud-sandbox-old.bash"\ntest -f "$BOOTSTRAP"');
  assert.throws(() => assertSourceCandidateBootstrapSelection(overwritten, wiki),
    /must not overwrite/);
  const duplicateInvocation = changeOnce(invocation, invocation + '\nbash "init-cloud-sandbox-old.bash" all');
  assert.throws(() => assertSourceCandidateBootstrapSelection(duplicateInvocation, wiki),
    /only one bootstrap execution/);

  const before = '它不会扫描根目录、比较SemVer或猜测哪个文件“看起来更新”';
  assert.ok(wiki.includes(before));
  const rephrasedWiki = wiki.replace(before,
    '4.1只按当前checkout的contract选取脚本，不依据文件名猜测版本');
  assert.doesNotThrow(() => assertSourceCandidateBootstrapSelection(template, rephrasedWiki));
  const commented = changeOnce('assets = artifact["external_release_assets"]',
    '# Resolve the current checkout contract, not a filename guess.\nassets = artifact["external_release_assets"]');
  assert.doesNotThrow(() => assertSourceCandidateBootstrapSelection(commented, wiki));
});

test("frozen Phase 5.1 is admitted by the history index without a fixed record total", () => {
  const index = read("docs/history/README.md");
  const histories = new Map(repositoryPaths()
    .filter(relative => /^docs\/history\/phase-[^/]+\.md$/.test(relative))
    .map(relative => [path.basename(relative), read(relative)]));
  const phase51 = "phase-5.1-document-test-governance-discovery.md";
  const frozenRow = index.split(/\r?\n/).find(line => line.startsWith("| `FROZEN_DISCOVERY_RECORD` |"));
  const phase51Row = index.split(/\r?\n/).find(line => line.startsWith("| Phase 5.1 |"));
  assert.ok(frozenRow && phase51Row, "probe precondition: Phase 5.1 is indexed as frozen");
  const phase51Fragment = "#phase-5-1-document-test-governance-decision";
  assert.ok(phase51Row.includes(phase51Fragment), "probe precondition: Phase 5.1 has an explicit target");
  assert.doesNotThrow(() => assertHistoryIndexAdmission(index, histories));

  const wrongTotal = index.replace(frozenRow,
    frozenRow.replace(/\d+ \|$/, value => `${Number.parseInt(value, 10) + 1} |`));
  assert.notEqual(wrongTotal, index);
  assert.throws(() => assertHistoryIndexAdmission(wrongTotal, histories), /totals must equal/);
  assert.throws(() => assertHistoryIndexAdmission(index.replace(phase51Row, ""), histories),
    /totals must equal|unindexed history file|Phase 5\.1 frozen Discovery must be indexed/);
  assert.throws(() => assertHistoryIndexAdmission(index.replace(phase51Row, phase51Row + "\n" + phase51Row), histories),
    /must not duplicate/);
  const missingFragment = index.replace(phase51Fragment, "#phase-5-1-missing");
  assert.throws(() => assertHistoryIndexAdmission(missingFragment, histories), /fragment must resolve/);
  const wrongPhaseFragment = index.replace(phase51Fragment, "#phase-4-1-managed-v3-discovery");
  assert.throws(() => assertHistoryIndexAdmission(wrongPhaseFragment, histories), /fragment must be scoped/);
  const missingRecord = new Map(histories);
  missingRecord.delete(phase51);
  assert.throws(() => assertHistoryIndexAdmission(index, missingRecord), /indexed history record is missing/);
  const wrongRole = new Map(histories);
  wrongRole.set(phase51, wrongRole.get(phase51).replace(
    "> Record role: `FROZEN_DISCOVERY_RECORD`", "> Record role: `RETROSPECTIVE_CAPSULE`"));
  assert.throws(() => assertHistoryIndexAdmission(index, wrongRole), /frozen Discovery role/);
  const unindexedFrozen = new Map(histories);
  unindexedFrozen.set("phase-5.2-unindexed.md", "> Record role: `FROZEN_DISCOVERY_RECORD`\n");
  assert.throws(() => assertHistoryIndexAdmission(index, unindexedFrozen), /unindexed history file/);
  const openDraft = new Map(histories);
  openDraft.set("phase-5.2-open-draft.md",
    "> Target record role: `FROZEN_DISCOVERY_RECORD`\n> Record status: `DRAFT / OPEN — not frozen, not indexed`\n");
  assert.doesNotThrow(() => assertHistoryIndexAdmission(index, openDraft));
  const prose = "这里的Phase编号和文件名保留历史语义";
  assert.ok(index.includes(prose));
  assert.doesNotThrow(() => assertHistoryIndexAdmission(index.replace(prose,
    "这些Phase标签按形成时的含义阅读"), histories));
  assert.ok(phase51Row.includes("正式文档测试治理Discovery"));
  assert.doesNotThrow(() => assertHistoryIndexAdmission(index.replace(phase51Row,
    phase51Row.replace("正式文档测试治理Discovery", "文档测试治理的正式探路决定")), histories));
  const rewordedSummary = index.replace("回补型Phase 4.12～4.17", "事后整理的Phase 4.12～4.17");
  assert.notEqual(rewordedSummary, index);
  assert.doesNotThrow(() => assertHistoryIndexAdmission(rewordedSummary, histories));
});

test("v0.5.0-dev is active while v0.4.4 and v0.4.3 keep their release roles", () => {
  const { accepted, candidate, developmentTrain, immediateFallback, roadmap } = currentRoleWindow();
  const acceptedAcceptance = read("docs/acceptance/v0.4.4-cloud-hard-acceptance.md");
  const retiredV043Acceptance = readGit("d7b5345b165e94c18ceab9b591d9a6b6dd251110",
    "docs/acceptance/v0.4.3-cloud-hard-acceptance.md");
  const provenance = read("BASELINE_PROVENANCE.md");
  const phase4Overview = read("docs/product-phases/phase-4-overview.md");
  const phase5Overview = read("docs/product-phases/phase-5-overview.md");
  const currentTrain = roadmap.slice(
    roadmap.indexOf("## 4. 当前开发列车"),
    roadmap.indexOf("## 5. Product Phase 路线"),
  );

  assert.equal(developmentTrain, "v0.5.0-dev");
  assert.equal(candidate, "v0.5.0-dev");
  assert.equal(accepted, "v0.4.4");
  assert.equal(immediateFallback, "v0.4.3");
  assert.match(roadmap, /## 3\. 已接受基线 `v0\.4\.4`/);
  assert.match(roadmap,
    /当前 programme 边界[^\n]*v0\.4\.4[^\n]*均已关闭[^\n]*exact C0[^\n]*Source\/Candidate[^\n]*tag精确指向C0[^\n]*Published Release第二通道PASS[^\n]*Latest[^\n]*第二轮retirement[^\n]*C2[^\n]*`v0\.5\.0-dev`[^\n]*Product Phase 5[^\n]*文档治理[^\n]*Product实现[^\n]*仍未授权/);
  assert.match(currentTrain, /当前exact development candidate为`v0\.5\.0-dev`[^\n]*branch `0\.5\.0-dev`/);
  assert.doesNotMatch(currentTrain, /^<a name="v0-4-4-release-tag-guide-train"><\/a>$/m);
  assert.match(currentTrain, /Product Phase 4 Overview/);
  assert.match(currentTrain, /Product Phase 5 Overview/);
  assert.match(currentTrain, /BASELINE_PROVENANCE/);
  assert.match(currentTrain, /v0\.4\.4 acceptance/);
  assert.match(currentTrain, /Product Phase 5[\s\S]{0,160}文档治理[\s\S]{0,180}Product实现、Cloud或Release/);
  assert.match(phase5Overview, /^<a name="product-phase-5-overview"><\/a>$/m);
  assert.match(acceptedAcceptance, /^<a name="v0-4-4-release-operator-guide"><\/a>$/m);
  assert.match(acceptedAcceptance, /^<a name="v0-4-4-role-window-closeout"><\/a>$/m);
  assert.match(acceptedAcceptance, /PWF_CLOUD_ACCEPTANCE_BASELINE_CONFLICT reason=\.planning_and_active_plan_missing/);
  assert.match(acceptedAcceptance, /空仓库中`\.planning`与active pointer同时缺失属于正常首次创建/);

  assert.match(phase4Overview, /v0\.4\.4 Release tag操作教程治理/);
  assert.match(phase4Overview,
    /exact C0、双通道Cloud、immutable publication、GitHub Latest、第二轮role-window closeout与C2现已全部闭合/);
  assert.match(phase4Overview, /`v0\.4\.4`成为[\s\S]{0,80}programme accepted/);
  assert.match(phase4Overview, /v0\.4\.3`成为immediate fallback/);
  assert.match(phase4Overview,
    /显式`SOURCE_CANDIDATE_HEAD`创建annotated tag[\s\S]{0,220}`\^\{\}` peeled commit等于C0/);

  for (const fact of [
    "f7032fd0efad3df9e4b6052e8cd766d27cd2a844",
    "4a179aad3ca0ce17270ee7a63c2644e8db2aa321cc48ed6056dbe6b4e70571e4",
    "972af180babd9235788ca2d31e83a9630220b3d5cdfdef1f8d3938858ec0d701",
    "PUBLISHED_RELEASE_PASS",
    "LATEST_PROMOTION_CONFIRMED",
    "ROLE_WINDOW_CLOSEOUT_PASS / C2_COMPLETE / NEXT_TRAIN_UNAUTHORIZED",
  ]) assert.match(acceptedAcceptance, new RegExp(fact.replaceAll(".", "\\.")));
  assert.match(acceptedAcceptance, /六个planning scope[\s\S]{0,80}`KEEP`/);
  assert.match(acceptedAcceptance, /v0\.4\.3 current guide\/bootstrap[\s\S]{0,80}`RETIRE`/);
  assert.match(acceptedAcceptance, /publication oracle[\s\S]{0,80}`MIGRATE`/);

  assert.match(retiredV043Acceptance, /ROLE_WINDOW_CLOSEOUT_PASS \/ C2_COMPLETE \/ NEXT_TRAIN_UNAUTHORIZED/);
  assert.equal(fs.existsSync(path.join(root, "docs/acceptance/v0.4.3-cloud-hard-acceptance.md")), false);
  assert.equal(fs.existsSync(path.join(root, "init-cloud-sandbox-v0.4.3.bash")), false);
  assert.match(provenance,
    /blob\/d7b5345b165e94c18ceab9b591d9a6b6dd251110\/docs\/acceptance\/v0\.4\.3-cloud-hard-acceptance\.md#v0-4-3-role-window-closeout/);
  for (const fact of [
    "v0.4.4", "91,369 bytes", "21,565 bytes",
    "4a179aad3ca0ce17270ee7a63c2644e8db2aa321cc48ed6056dbe6b4e70571e4",
    "972af180babd9235788ca2d31e83a9630220b3d5cdfdef1f8d3938858ec0d701",
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
    "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md", "Wiki.md", "docs/cloud-hard-acceptance-template.md",
    "docs/cloud-acceptance-operator-guide-template.md",
    "docs/acceptance/README.md",
    "docs/acceptance/v0.4.4-cloud-hard-acceptance.md",
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
  assert.equal(releasePaths.includes("Wiki.md"), false, "Wiki.md must remain Release-excluded");
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
  assertMaintenanceEnvironmentRoutes(profile);
  assert.match(profile, /Git Bash[\s\S]{0,300}不能[\s\S]{0,200}Linux\/POSIX证据/);
  assert.match(profile, /`CONFIRMED_BOUNDARY`[\s\S]*`\/opt\/codex`[\s\S]*不是永久常量/);
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

test("environment-profile route guard rejects false Linux evidence and accepts equivalent facts", () => {
  const profile = read("docs/maintenance-environment-profile.md");
  const changeOnce = (before, after) => {
    assert.ok(profile.includes(before), "probe precondition missing: " + before);
    return profile.replace(before, after);
  };
  assert.doesNotThrow(() => assertMaintenanceEnvironmentRoutes(profile));
  const wrongRoute = changeOnce(
    "在版本Source/Candidate Cloud教程中编排真实Linux gate",
    "在本地Git Bash中完成Linux gate");
  assert.throws(() => assertMaintenanceEnvironmentRoutes(wrongRoute), /real Cloud Linux gate/);
  const wrongStatus = changeOnce(
    "| Source/Candidate Linux Cloud | `CONFIRMED_ROUTE` |",
    "| Source/Candidate Linux Cloud | `CONFIRMED_BOUNDARY` |");
  assert.throws(() => assertMaintenanceEnvironmentRoutes(wrongStatus), /status changed/);
  const wrongFallback = changeOnce("exact-path只读Shell preflight，写入仍只用apply_patch",
    "任意Shell读写均可");
  assert.throws(() => assertMaintenanceEnvironmentRoutes(wrongFallback), /bounded read fallback/);
  const rephrased = changeOnce("没有已安装发行版", "尚无可用的Linux发行版")
    .replace("2026-08-22", "2026-09-23");
  assert.doesNotThrow(() => assertMaintenanceEnvironmentRoutes(rephrased));
});

test("planning lifecycle selects one active scope without forcing completed-scope deletion", () => {
  const actual = repositoryPaths();
  const roadmap = read("ROADMAP.md");
  const governance = read("docs/repository-governance-guide.md");
  const activePlan = read(".planning/.active_plan").trim();
  const retainedCompletedScope = "2000-01-01-completed-scope-fixture";
  const withRetainedCompletedScope = [
    ...actual,
    ...["findings.md", "progress.md", "task_plan.md"]
      .map(file => `.planning/${retainedCompletedScope}/${file}`),
  ];

  assert.match(activePlan, /^\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9.-]*$/);
  assert.equal(validatePlanningScopes(root, activePlan, actual), "legacy");
  assert.equal(validatePlanningScopes(root, activePlan, withRetainedCompletedScope), "legacy");
  assertPlanningDeletionConsent(governance, roadmap);
});

test("planning deletion consent rejects automatic removal but allows equivalent explanation", () => {
  const governance = read("docs/repository-governance-guide.md");
  const roadmap = read("ROADMAP.md");
  assertPlanningDeletionConsent(governance, roadmap);
  const wrongOwner = roadmap.replace("(docs/repository-governance-guide.md#planning-lifecycle)",
    "(docs/repository-governance-guide.md#history-record-roles)");
  assert.notEqual(wrongOwner, roadmap);
  assert.throws(() => assertPlanningDeletionConsent(governance, wrongOwner), /route planning deletion/);
  const wrongGuide = governance.replace("不从指针切换自动推导删除授权",
    "指针切换后可自动删除completed scope");
  assert.notEqual(wrongGuide, governance);
  assert.throws(() => assertPlanningDeletionConsent(wrongGuide, roadmap), /pointer switch/);
  const missingConsent = governance.replace(/由维护者在单独评审中\s*明确决定/,
    "由脚本自动处理");
  assert.notEqual(missingConsent, governance);
  assert.throws(() => assertPlanningDeletionConsent(missingConsent, roadmap), /maintainer must decide/);
  const wrongRoadmap = roadmap.replace("都不得自动删除planning", "均可自动删除planning");
  assert.notEqual(wrongRoadmap, roadmap);
  assert.throws(() => assertPlanningDeletionConsent(governance, wrongRoadmap), /must not authorize planning deletion/);
  const rephrasedGuide = governance
    .replace("只选择当前唯一活动 scope，不负责自动删除其他目录",
      "仅指向当前唯一活动 scope，不会自动移除其他目录")
    .replace(/由维护者在单独评审中\s*明确决定，不从指针切换自动推导删除授权/,
      "由维护者通过单独评审作出决定；指针切换本身不会产生删除授权");
  const rephrasedRoadmap = roadmap.replace(
    "仅仅到达C0/C2、切换`.active_plan`、满足retirement DoD或已有Git恢复点，都不得自动删除planning",
    "到达C0/C2、切换`.active_plan`、满足retirement DoD或已有Git恢复点，都不能据此移除planning");
  assert.notEqual(rephrasedGuide, governance);
  assert.notEqual(rephrasedRoadmap, roadmap);
  assert.doesNotThrow(() => assertPlanningDeletionConsent(rephrasedGuide, rephrasedRoadmap));
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
  const phaseOverviewDocs = docs.filter(item => /^docs\/product-phases\/phase-\d+-overview\.md$/.test(item));

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
  assert.deepEqual(phaseOverviewDocs, [
    "docs/product-phases/phase-4-overview.md",
    "docs/product-phases/phase-5-overview.md",
  ]);
  assert.equal(docs.includes("docs/product-phase-overview-template.md"), true);
  assert.equal(docs.includes("docs/product-phases/README.md"), true);
  assert.equal(docs.some(item => item.startsWith("docs/templates/")), false,
    "frozen accepted guides still bind the stable docs-root template paths");
  const acceptanceIndex = read("docs/acceptance/README.md");
  const acceptanceTemplate = read("docs/cloud-hard-acceptance-template.md");
  const operatorGuideTemplate = read("docs/cloud-acceptance-operator-guide-template.md");
  assertAcceptanceRoleProjections(acceptanceIndex, acceptanceTemplate);
  assertAcceptanceWritebackRoles(acceptanceTemplate, operatorGuideTemplate);
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
  assert.match(acceptanceTemplate,
    /Source\/Candidate 验证“当前 C0 源码 \+ 当前 contract 指定的 bootstrap \+ 当前源码构建的 ZIP”/);
  assert.match(acceptanceTemplate,
    /Published Release 才验证正式 bootstrap 的默认 GitHub 下载地址、内嵌exact ZIP SHA和公开 ZIP/);
  assert.match(acceptanceTemplate,
    /HOOKS_URL`\/`HOOKS_SHA256` override[\s\S]{0,180}不代表公开下载链[\s\S]{0,240}不得沿用[\s\S]{0,100}本地override/);
  assert.doesNotMatch(acceptanceTemplate, /多\s*gate\s*(?:开发)?版本/i);
  assert.match(operatorGuideTemplate, /PRE_RUN_READY \/ LIVE_NOT_RUN/);
  assert.match(operatorGuideTemplate, /POST_RUN_PASS|POST_RUN_FAIL|POST_RUN_INCOMPLETE/);
  assert.match(operatorGuideTemplate, /SOURCE_CANDIDATE_PASS \/ PUBLISHED_RELEASE_NOT_RUN \/ STOP_BEFORE_PUBLICATION/);
  assert.match(operatorGuideTemplate, /SOURCE_CANDIDATE_HEAD[\s\S]*正式tag[\s\S]*实际Cloud PASS/);
  assert.match(operatorGuideTemplate, /第一阶段状态写回commit[^\n]*不替代[^\n]*tag/);
  assert.match(operatorGuideTemplate, /第二阶段状态写回commit[^\n]*final Post-run/);
  assert.match(operatorGuideTemplate, /docs: record <version> source candidate acceptance/);
  assert.match(operatorGuideTemplate, /docs: close <version> published release acceptance/);
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
  assert.match(canonicalBaseline,
    /空仓库中`\.planning`与`\.planning\/\.active_plan`同时不存在[^\n]*正常的首次创建状态[^\n]*不是拓扑异常/);
  assert.match(canonicalBaseline,
    /本轮新PLAN_ID目录和三个目标文件也都不存在[\s\S]*apply_patch创建所需父目录[\s\S]*不得报告[\s\S]*BASELINE_CONFLICT/);
  assert.match(canonicalBaseline,
    /真正的冲突只包括[\s\S]*symlink\/错误文件类型[\s\S]*目标文件已经存在[\s\S]*active pointer无法作为普通文件安全读取\/更新/);
  assert.match(canonicalBaseline, /不得先用Shell预创建或`rm -rf \.planning`/);
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
  assertCloudTemplateNeutrality(acceptanceTemplate);
  assert.equal(releasePaths.includes("docs/cloud-hard-acceptance-template.md"), false);
  const fixedBootstrapName = /init-cloud-sandbox-v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\.bash/;
  for (const stableDoc of [
    "README.md", "AGENTS.md", "docs/cloud-hard-acceptance-template.md",
    "docs/cloud-acceptance-operator-guide-template.md",
    "docs/repository-governance-guide.md",
  ]) {
    assert.doesNotMatch(read(stableDoc), fixedBootstrapName, `${stableDoc} must use a version-neutral bootstrap command`);
  }
  const releaseReadme = read("README.md");
  const stableReadme = read("Wiki.md");
  const roadmap = read("ROADMAP.md");
  assert.equal(releasePaths.includes("README.md"), true, "README is a Release ZIP input");
  assert.equal(releasePaths.includes("Wiki.md"), false, "Wiki is a Release-excluded maintainer guide");
  assert.match(releaseReadme, /\[`Wiki\.md`\]\(Wiki\.md\)/);
  assert.match(releaseReadme, /\[`Wiki` 本地开发\]\(Wiki\.md#local-development\)/);
  assert.match(releaseReadme, /\[`Wiki` 构建与 Release\]\(Wiki\.md#build-development-zip\)/);
  assert.match(stableReadme, /^## 快速入口$/m);
  for (const fragment of [
    "local-development", "build-development-zip", "candidate-bootstrap",
    "materialize-release-assets", "source-candidate-c0-tag-push",
  ]) {
    assert.match(stableReadme, new RegExp(`\\]\\(#${fragment}\\)`), `Wiki navigation lacks #${fragment}`);
    assert.match(stableReadme, new RegExp(`<a name="${fragment}"></a>`), `Wiki lacks explicit #${fragment}`);
  }
  assert.match(stableReadme,
    /权限边界[\s\S]{0,180}活动 task plan[\s\S]{0,180}push、tag、PR、Release、资产上传[\s\S]{0,180}维护者执行/);
  assert.match(stableReadme,
    /6\. 读取 `\.planning\/\.active_plan`，再读取它指向的 `task_plan\.md`、`findings\.md`、`progress\.md`/);
  assert.doesNotMatch(stableReadme, /若存在 `\.planning\/\.active_plan`/);
  assert.match(roadmap, /稳定构建\/验证命令由 \[`Wiki\.md`\]\(Wiki\.md\) 管理/);
  assert.doesNotMatch(roadmap, /稳定构建\/验证命令由 \[`README\.md`\]/);
  const newcomerTerms = stableReadme.indexOf("如果你第一次接触本仓库的Release流程");
  const readmeInputWarning = stableReadme.indexOf("`README.md`仍属于");
  assert.ok(newcomerTerms >= 0 && newcomerTerms < readmeInputWarning,
    "Wiki must explain Release terms before warning that README changes candidate bytes");
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
  assertSourceCandidateBootstrapSelection(read("docs/cloud-hard-acceptance-template.md"), stableReadme);
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
  assertC0TagOperatorBlock(stableReadme);
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

test("acceptance role projections reject wrong owners and permit equivalent prose", () => {
  const index = read("docs/acceptance/README.md");
  const cloud = read("docs/cloud-hard-acceptance-template.md");
  const operator = read("docs/cloud-acceptance-operator-guide-template.md");
  assertAcceptanceRoleProjections(index, cloud);
  assertAcceptanceWritebackRoles(cloud, operator);
  const wrongProgramme = index.replace("(../../ROADMAP.md#release-four-step-flow)",
    "(../repository-governance-guide.md#release-four-step-flow)");
  assert.notEqual(wrongProgramme, index);
  assert.throws(() => assertAcceptanceRoleProjections(wrongProgramme, cloud), /route programme roles/);
  const prematureEviction = index.replace("旧版guide在角色退出前也可保留原路径",
    "旧版guide在角色退出前必须删除原路径");
  assert.notEqual(prematureEviction, index);
  assert.throws(() => assertAcceptanceRoleProjections(prematureEviction, cloud), /until role exit/);
  const wrongProtocolOwner = cloud.replace(
    "Source/Candidate 与 Published Release 的稳定执行协议、停止条件和 evidence schema",
    "当前授权、Next Step和版本结果");
  assert.notEqual(wrongProtocolOwner, cloud);
  assert.throws(() => assertAcceptanceRoleProjections(index, wrongProtocolOwner), /both channel execution protocols/);
  const wrongCount = cloud.replace("Discovery Round是新增risk/behavior claim和验收教程的计数单位",
    "gate是新增risk/behavior claim和验收教程的计数单位");
  assert.notEqual(wrongCount, cloud);
  assert.throws(() => assertAcceptanceRoleProjections(index, wrongCount), /formal Discovery Round/);
  const wrongGuideUnit = cloud.replace("每个正式 Discovery Round使用一份",
    "每个gate使用一份");
  assert.notEqual(wrongGuideUnit, cloud);
  assert.throws(() => assertAcceptanceRoleProjections(index, wrongGuideUnit), /one guide per formal Round/);
  const wrongWriteback = cloud.replace("完整 commit、branch transport、测试 runner 原始摘要",
    "只记一行PASS、branch transport、测试 runner 原始摘要");
  assert.notEqual(wrongWriteback, cloud);
  assert.throws(() => assertAcceptanceWritebackRoles(wrongWriteback, operator), /source and candidate ZIP evidence/);
  const wrongRetryOwner = operator.replace("继续写活动 planning", "直接写入guide");
  assert.notEqual(wrongRetryOwner, operator);
  assert.throws(() => assertAcceptanceWritebackRoles(cloud, wrongRetryOwner), /stay in active planning/);
  const equivalentIndex = index
    .replace("不等于“只留最新一份”", "并非“只留最新一份”")
    .replace("已经冻结且仍承担accepted职责的guide可以继续作为current副本",
      "冻结后仍承担accepted职责的guide可继续保留为current副本")
    .replace("旧版guide在角色退出前也可保留原路径", "旧版guide在角色退出前允许保留原路径")
    .replace("清退current副本", "移除current副本");
  const equivalentCloud = cloud
    .replace("Source/Candidate 与 Published Release 的稳定执行协议、停止条件和 evidence schema",
      "Source/Candidate 和 Published Release 两个通道的稳定执行协议、停止条件与 evidence schema")
    .replace("每个正式 Discovery Round使用一份", "每个正式 Discovery Round编写一份")
    .replace("operator guide 的channel checkpoint与final Post-run status应保存以下原始证据",
      "operator guide 的channel checkpoint及final Post-run status应记录下列原始证据");
  const equivalentOperator = operator.replace("失败重试、第一次错误、恢复位置和Next Step\n   继续写活动 planning",
    "失败尝试、首次错误、恢复点和Next Step仍放在活动 planning");
  assert.notEqual(equivalentIndex, index);
  assert.notEqual(equivalentCloud, cloud);
  assert.notEqual(equivalentOperator, operator);
  assert.doesNotThrow(() => assertAcceptanceRoleProjections(equivalentIndex, equivalentCloud));
  assert.doesNotThrow(() => assertAcceptanceWritebackRoles(equivalentCloud, equivalentOperator));
});

test("Cloud template neutrality rejects active identities but permits explanatory examples", () => {
  const template = read("docs/cloud-hard-acceptance-template.md");
  const changeOnce = (before, after) => {
    assert.ok(template.includes(before), "probe precondition missing: " + before);
    return template.replace(before, after);
  };
  assert.doesNotThrow(() => assertCloudTemplateNeutrality(template));
  const fixedSha = changeOnce('readonly BOOTSTRAP_SHA256="__IMMUTABLE_BOOTSTRAP_SHA256__"',
    `readonly BOOTSTRAP_SHA256="${"a".repeat(64)}"`);
  assert.throws(() => assertCloudTemplateNeutrality(fixedSha), /asset hash|placeholder/);
  const fixedVersion = changeOnce("set -Eeuo pipefail",
    'set -Eeuo pipefail\nreadonly PACKAGE_VERSION="v0.4.4"');
  assert.throws(() => assertCloudTemplateNeutrality(fixedVersion), /pin a version/);
  const fixedSize = changeOnce("set -Eeuo pipefail",
    "set -Eeuo pipefail\nreadonly ZIP_SIZE=22");
  assert.throws(() => assertCloudTemplateNeutrality(fixedSize), /machine-derived/);
  const currentState = changeOnce("| 本模板 |", "| 当前状态 | v0.5.0-dev |\n| 本模板 |");
  assert.throws(() => assertCloudTemplateNeutrality(currentState), /current-state authority slot/);
  const tableIdentity = changeOnce("| 本模板 |", "| 本模板 | v0.4.4 |\n| 本模板 |");
  assert.throws(() => assertCloudTemplateNeutrality(tableIdentity), /responsibility table must not pin a version/);
  const explained = template + "\n说明示例：旧版本 v0.4.4、" + "a".repeat(40) +
    "、Phase 4 marker 以及‘当前状态’这几个词不构成本模板的运行身份。\n";
  assert.doesNotThrow(() => assertCloudTemplateNeutrality(explained));
});

test("historical documents have two controlled macro entrances and remain advisory", () => {
  const readme = read("README.md");
  const roadmap = read("ROADMAP.md");
  const historyIndex = read("docs/history/README.md");
  const historyTemplate = read("docs/phase-history-template.md");
  const governanceGuide = read("docs/repository-governance-guide.md");
  const phaseOverviewIndex = read("docs/product-phases/README.md");
  const phaseOverviewTemplate = read("docs/product-phase-overview-template.md");
  const phase4Overview = read("docs/product-phases/phase-4-overview.md");
  const phase5Overview = read("docs/product-phases/phase-5-overview.md");
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
  const histories = new Map(repositoryPaths()
    .filter(relative => /^docs\/history\/phase-[^/]+\.md$/.test(relative))
    .map(relative => [path.basename(relative), read(relative)]));
  assertHistoryIndexAdmission(historyIndex, histories);
  assert.match(historyIndex,
    /精选过的历史过程账本[\s\S]*不保存原始聊天、逐命令日志[\s\S]*长期Product结论读对应[\s\S]*Product Phase Overview[\s\S]*现行programme只读ROADMAP/);
  assert.match(historyIndex,
    /过程账本只有两种record role[\s\S]*回顾型`RETROSPECTIVE_CAPSULE`[\s\S]*探路\/决策型`FROZEN_DISCOVERY_RECORD`[\s\S]*不再扩展第三种身份/);
  assert.match(historyIndex,
    /Post-programme reindex status[\s\S]*Phase 5\/6\/7\/8[\s\S]*Phase 6\/7\/8\/9[\s\S]*`0\.9\.0-\*`/);
  assert.match(historyTemplate, /先选择 record role/);
  assert.match(historyTemplate, /RETROSPECTIVE_CAPSULE[\s\S]*FROZEN_DISCOVERY_RECORD/);
  assert.match(historyTemplate,
    /Product Phase激活后[\s\S]*docs\/product-phases\/phase-N-overview\.md#product-phase-N-overview[\s\S]*Product Phase closeout[\s\S]*不再把history current links从ROADMAP第4节迁到第5节/);
  assert.match(phaseOverviewIndex, /^<a name="product-phase-overview-index"><\/a>$/m);
  assert.match(phaseOverviewIndex,
    /真实激活过的 Product Phase 的长期说明书[\s\S]*未激活[\s\S]*不提前创建空文件/);
  assert.match(phaseOverviewIndex,
    /不(?:是|等同于)某个 SemVer 或 GitHub Release note[\s\S]*Product Phase可以覆盖[\s\S]*多个版本列车/);
  assert.match(phaseOverviewTemplate, /^<a name="product-phase-overview-template"><\/a>$/m);
  assert.match(phaseOverviewTemplate, /未激活[\s\S]*不得先建空overview/);
  assert.match(phase4Overview, /^<a name="product-phase-4-overview"><\/a>$/m);
  assert.match(phase5Overview, /^<a name="product-phase-5-overview"><\/a>$/m);
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
    "../product-phases/phase-4-overview.md#product-phase-4-overview",
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

test("Phase 4.17 separates immutable Release identity from reducible harness ceremony", () => {
  const relative = "docs/history/phase-4.17-phase-4-harness-retrospective.md";
  const historyIndex = read("docs/history/README.md");
  const phase4Overview = read("docs/product-phases/phase-4-overview.md");
  const artifact = JSON.parse(read(currentArtifactPath));
  assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  const history = read(relative);

  for (const anchor of [
    "phase-4-17-historical-position", "phase-4-17-problem-before",
    "phase-4-17-core-decisions", "phase-4-17-harness-cost-model",
    "phase-4-17-successor-options", "phase-4-17-completed-delivery",
    "phase-4-17-acceptance-conclusion", "phase-4-17-explicit-non-goals",
    "phase-4-17-successor-inheritance", "phase-4-17-immutable-evidence",
  ]) assert.match(history, new RegExp('<a name="' + anchor + '"></a>'));

  assert.match(history, /^# Phase 4\.17：Phase 4 harness 重量与后继精简回顾$/m);
  assert.match(history, /Record role: `RETROSPECTIVE_CAPSULE`/);
  assert.match(history, /窄Product[\s\S]{0,120}trusted supply chain[\s\S]{0,120}harness/);
  assert.match(history, /README属于Release ZIP allowlist[\s\S]*新字节必须有新身份/);
  assert.match(history, /identity与behavior证据/);
  assert.match(history, /快车道必须machine-admitted/);
  for (const lane of [
    "SOURCE_ONLY_GOVERNANCE", "PACKAGE_DOC_ONLY", "RELEASE_MECHANICS", "PRODUCT_OR_SECURITY",
  ]) assert.match(history, new RegExp(lane));
  assert.match(history, /未知路径[\s\S]*回退更严格lane/);
  assert.match(history, /不激活Product Phase 5/);
  assert.match(history, /053f66e994ca095e974f69a7fbe8f2bb54697fc3/);

  assert.match(phase4Overview, /^<a name="phase-4-harness-closeout-lessons"><\/a>$/m);
  assert.match(phase4Overview, /machine classifier[\s\S]*critical fingerprints[\s\S]*`FULL`/);
  assert.match(phase4Overview, /Product Phase 5[\s\S]*Discovery输入[\s\S]*不是现行流程变更/);
  assert.match(historyIndex,
    /phase-4\.17-phase-4-harness-retrospective\.md#phase-4-17-historical-position/);
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
