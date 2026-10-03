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
const markdownLinks = markdown => [...markdown.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)]
  .map(([, target]) => target);

function sectionBetween(markdown, start, end) {
  const first = markdown.indexOf(start);
  const last = markdown.indexOf(end, first + start.length);
  assert.ok(first >= 0 && last > first, `missing section boundary ${start} -> ${end}`);
  return markdown.slice(first, last);
}

function assertOverviewRouteRelationship(roadmap) {
  const trainRole = roadmap.match(/^\| 当前开发列车 \| `(NONE|v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?)`([^\r\n]*)/m);
  assert.ok(trainRole, "ROADMAP must declare a parseable development train state");
  const noTrain = trainRole[1] === "NONE";
  const trainPhase = trainRole[2].match(/Product Phase (\d+)/)?.[1];
  assert.equal(Boolean(trainPhase), !noTrain,
    "an active train must declare its Product Phase; NONE must not name one");
  const current = sectionBetween(roadmap, "## 4. 当前开发列车", '<a name="product-phase-route-index"></a>');
  const routes = sectionBetween(roadmap, '<a name="product-phase-route-index"></a>',
    '<a name="product-phase-overview-rotation"></a>');
  const overviewPattern = /^docs\/product-phases\/phase-(\d+)-overview\.md#product-phase-(\d+)-overview$/;
  const overviewLinks = text => markdownLinks(text).filter(target => target.startsWith("docs/product-phases/phase-"));
  const activeTargets = overviewLinks(current);
  if (noTrain) {
    assert.equal(activeTargets.length, 0, "NONE must not retain a current Phase overview pointer");
    const currentProse = current.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    assert.doesNotMatch(currentProse, /\b[vV]?\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?\b/,
      "NONE must not retain an exact train or version-role identity in section 4");
  } else {
    assert.ok(activeTargets.length > 0, "current train must link its materialized Phase overview");
    assert.ok(activeTargets.includes(`docs/product-phases/phase-${trainPhase}-overview.md#product-phase-${trainPhase}-overview`),
      "current Product Phase must have a matching train pointer");
  }
  assert.equal(new Set(activeTargets).size, activeTargets.length,
    "current train must not repeat an overview pointer");
  const routeTargets = new Map();
  for (const line of routes.split(/\r?\n/).filter(line => /^\| \d+ \|/.test(line))) {
    const targets = overviewLinks(line);
    assert.ok(targets.length <= 1, "one Phase route row must not name multiple overviews");
    if (!targets.length) continue;
    const phase = Number(line.match(/^\| (\d+) \|/)[1]);
    const match = targets[0].match(overviewPattern);
    assert.ok(match && Number(match[1]) === phase && match[1] === match[2],
      "Phase route row must point to its own overview");
    assert.equal(routeTargets.has(targets[0]), false, "Phase route index must not duplicate an overview");
    routeTargets.set(targets[0], phase);
  }
  for (const target of activeTargets) {
    const match = target.match(overviewPattern);
    assert.ok(match && match[1] === match[2], "current train must use a canonical Phase overview anchor");
    assert.equal(routeTargets.get(target), Number(match[1]),
      "current train pointer must match its Phase route index row");
  }
  const counts = new Map();
  for (const target of overviewLinks(roadmap)) counts.set(target, (counts.get(target) || 0) + 1);
  for (const [target, count] of counts) {
    if (count <= 1) continue;
    assert.equal(count, 2, "an overview may appear only once per current/route role");
    assert.ok(activeTargets.includes(target) && routeTargets.has(target),
      "a repeated overview must pair current train and route index roles");
  }
  return { current, routes, trainPhase: trainPhase ? Number(trainPhase) : null, noTrain };
}

function assertRoadmapPhaseRoutes(roadmap, overviewIndex) {
  const { current, routes, trainPhase, noTrain } = assertOverviewRouteRelationship(roadmap);
  const phaseRows = new Map();
  const statusOf = cell => {
    const states = [
      /\bactive\b|已激活/i.test(cell) && "active",
      /\bcomplete\b|已闭合|已完成/i.test(cell) && "complete",
      /\bpending\b|待定|未激活/i.test(cell) && "pending",
    ].filter(Boolean);
    assert.equal(states.length, 1, "Phase row must have one parseable lifecycle state");
    return states[0];
  };
  for (const line of routes.split(/\r?\n/).filter(line => /^\| \d+ \|/.test(line))) {
    const cells = line.split(/(?<!\\)\|/).slice(1, -1).map(cell => cell.trim());
    assert.equal(cells.length, 5, "Phase route row must retain five columns");
    const phase = Number(cells[0]);
    assert.equal(phaseRows.has(phase), false, "Phase route index must have one row per Phase");
    const targets = markdownLinks(cells[4]).filter(target => /phase-\d+-overview\.md#/.test(target));
    assert.ok(targets.length <= 1, "Phase status cell must have at most one overview");
    const status = statusOf(cells[4]);
    assert.equal(targets.length, status === "pending" ? 0 : 1,
      "only active or complete Phase rows may have materialized overviews");
    if (status === "active") {
      assert.equal(phase, trainPhase, "active Phase row must match current train");
      const series = cells[1].match(/`([^`]+)`/)?.[1];
      const candidate = readJson("package.json").version;
      const admitted = series?.endsWith("-*")
        ? candidate.startsWith(series.slice(0, -1))
        : candidate === series;
      assert.ok(series && admitted,
        "active Phase series must admit the current package candidate");
    }
    phaseRows.set(phase, { status, target: targets[0] || null });
  }
  assert.equal([...phaseRows.values()].filter(row => row.status === "active").length, noTrain ? 0 : 1,
    "Phase route activity must match the approved development train state");

  const indexRows = new Map();
  for (const line of overviewIndex.split(/\r?\n/).filter(line => /^\| \d+ \|/.test(line))) {
    const cells = line.split(/(?<!\\)\|/).slice(1, -1).map(cell => cell.trim());
    assert.equal(cells.length, 3, "materialized overview index row must retain three columns");
    const phase = Number(cells[0]);
    assert.equal(indexRows.has(phase), false, "overview index must have one row per materialized Phase");
    const links = markdownLinks(cells[1]);
    assert.deepEqual(links, [`phase-${phase}-overview.md#product-phase-${phase}-overview`],
      "overview index row must link its own Phase");
    indexRows.set(phase, { status: statusOf(cells[2]),
      target: `docs/product-phases/${links[0]}` });
  }
  const materialized = [...phaseRows.entries()].filter(([, row]) => row.target).map(([phase]) => phase).sort((a, b) => a - b);
  assert.deepEqual([...indexRows.keys()].sort((a, b) => a - b), materialized,
    "overview index must equal the materialized ROADMAP Phase routes");
  const overviewFiles = fs.readdirSync(path.join(root, "docs/product-phases"))
    .filter(file => /^phase-\d+-overview\.md$/.test(file))
    .map(file => Number(file.match(/^phase-(\d+)-overview\.md$/)[1])).sort((a, b) => a - b);
  assert.deepEqual(overviewFiles, materialized,
    "materialized Phase overview files must equal the ROADMAP/index routes");
  for (const phase of materialized) {
    assert.deepEqual(indexRows.get(phase), phaseRows.get(phase),
      "overview index and ROADMAP must agree on target and lifecycle state");
  }
  const accepted = roadmap.match(/^\| 当前已接受版本 \| `(v\d+\.\d+\.\d+)`/m)?.[1];
  assert.ok(accepted, "ROADMAP must declare its accepted role");
  assert.ok(markdownLinks(current).includes("BASELINE_PROVENANCE.md"),
    "current train must delegate immutable identity to provenance");
  assert.ok(markdownLinks(current).some(target => target.startsWith(
    `docs/acceptance/${accepted}-cloud-hard-acceptance.md#`)),
    "current train must point to accepted-version evidence");
  const currentBody = current.replace(/^## 4\. 当前开发列车\r?\n/, "");
  assert.doesNotMatch(currentBody, /\]\(docs\/history\/|^#{2,6} /m,
    "current train pointer must not become a history route or a nested runbook");
}

function assertDuplicateAuthorityRoutes(discovered, roadmap) {
  const counts = new Map();
  for (const link of discovered) counts.set(link, (counts.get(link) || 0) + 1);
  for (const [link, count] of counts) {
    if (count <= 1) continue;
    assert.match(link, /^ROADMAP\.md->phase-\d+-overview\.md#product-phase-\d+-overview$/,
      "only ROADMAP Phase overviews may have repeated authority links");
    assert.equal(count, 2, "a ROADMAP overview may have only two distinct role links");
  }
  assertOverviewRouteRelationship(roadmap);
}

function assertHandoffNavigation(handoff, readme) {
  const ownerMap = sectionBetween(readme, '<a name="documentation-map"></a>', "## 许可证");
  const ownerFiles = new Set(markdownLinks(ownerMap).map(target => target.split("#")[0]));
  const navigation = handoff.slice(0, handoff.indexOf("## 3."));
  for (const target of markdownLinks(navigation)) {
    const file = target.split("#")[0];
    if (file !== "README.md" && file.endsWith(".md")) {
      assert.ok(ownerFiles.has(file), "README owner map lacks handoff destination: " + file);
    }
  }
  const introduction = handoff.slice(0, handoff.indexOf("## 1."));
  assert.ok(markdownLinks(introduction).includes("README.md#documentation-map"),
    "handoff introduction must route to README's owner map");
  const quickstart = sectionBetween(handoff, "## 1.", "## 2.");
  const starts = [...quickstart.matchAll(/^\d+\. \*\*/gm)].map(match => match.index);
  assert.ok(starts.length > 0, "handoff must expose numbered quickstart steps");
  const steps = starts.map((start, i) => quickstart.slice(start, starts[i + 1] ?? quickstart.length));
  const stepTargets = steps.map(markdownLinks);
  const stepWith = target => {
    const matches = stepTargets.filter(targets => targets.includes(target));
    assert.equal(matches.length, 1, "handoff quickstart must have one step for " + target);
    return matches[0];
  };
  stepWith(".planning/.active_plan");
  stepWith("Wiki.md#local-development");
  assert.ok(stepWith("DESIGN.md#module-responsibilities").includes("ARCHITECTURE.md"),
    "handoff implementation step must pair DESIGN with ARCHITECTURE");

  const triage = sectionBetween(handoff, "## 2.", "## 3.");
  const rowTargets = triage.split(/\r?\n/).filter(line => /^\| [^|-]/.test(line))
    .map(markdownLinks);
  const rowWith = target => {
    const matches = rowTargets.filter(targets => targets.includes(target));
    assert.equal(matches.length, 1, "handoff triage must have one row for " + target);
    return matches[0];
  };
  rowWith("README.md");
  const versionRow = rowWith("ROADMAP.md");
  assert.ok(versionRow.includes("CHANGELOG.md") && versionRow.includes("BASELINE_PROVENANCE.md"),
    "version triage must join programme, delta and immutable identity owners");
  rowWith("docs/");
  rowWith("docs/maintenance-environment-profile.md#maintenance-environment-profile");
}

function assertHandoffTriageBoundary(handoff) {
  assert.equal((handoff.match(/^# [^#\r\n]+$/gm) || []).length, 1,
    "handoff needs one document title");
  const sections = [...handoff.matchAll(/^## (\d+)\. [^\r\n]+$/gm)].map(([, number]) => Number(number));
  assert.deepEqual(sections, [1, 2, 3, 4, 5],
    "handoff must keep quickstart, triage, safety, results and stop roles in order");
  const results = sectionBetween(handoff, "## 4.", "## 5.");
  const rows = results.split(/\r?\n/).filter(line => /^\| [^|-]/.test(line))
    .map(line => line.split(/(?<!\\)\|/).slice(1, -1).map(cell => cell.trim()));
  assert.ok(rows.every(row => row.length === 4),
    "handoff result-classification rows must keep four columns");
  assert.ok(rows.length >= 9 && rows.every(row => row.every(Boolean)),
    "handoff needs complete result-classification rows");
  const rowWith = cue => {
    const matches = rows.filter(row => cue.test(row[0]));
    assert.equal(matches.length, 1, `handoff result classification lacks ${cue}`);
    return matches[0];
  };
  for (const cue of [
    /unknown dirty state/i, /importer failure/i, /doctor healthy/i, /doctor repairable/i,
    /doctor blocker.*unknown drift/i, /tests PASS/i, /test failure/i,
    /platform limitation.*SKIP/i, /deterministic package.*Cloud gate PASS/i,
  ]) rowWith(cue);
  for (const cue of [/unknown dirty state/i, /doctor blocker.*unknown drift/i, /test failure/i]) {
    assert.match(rowWith(cue)[2], /否|停止|先停/,
      "unknown or failed state must not be presented as permission to continue");
  }
  assert.match(rowWith(/test failure/i)[1], /product defect.*test defect.*fixture drift/,
    "test failure must retain its diagnostic categories");
  const stopSection = handoff.slice(handoff.indexOf("## 5."));
  const stopBullets = stopSection.split(/\r?\n/).filter(line => /^- /.test(line));
  assert.ok(stopBullets.length >= 4 && stopBullets.some(line => /dirty|unowned|unknown/i.test(line))
    && stopBullets.some(line => /Host ABI|trusted graph/.test(line))
    && stopBullets.some(line => /Cloud|Release|rollback/i.test(line)),
    "handoff must retain stop routes for unknown state, trust and lifecycle gates");
  const fences = [...handoff.matchAll(/^(\x60{3,}|~{3,})([A-Za-z0-9_-]+)[ \t]*\r?\n([\s\S]*?)^\1[ \t]*$/gm)];
  const activeCommand = /^\s*(?:(?:[-*]|\d+\.)\s+)?(?:\$\s*)?(?:sudo\b|git\s+(?:push|reset|tag)\b|node\s+install\.js\b|python\d*\s+tools\/build_release\.py\b|bash\s+init-cloud-sandbox\b|sha256sum\b|mktemp\b)/im;
  for (const [, , language, body] of fences) {
    assert.doesNotMatch(language, /^(?:bash|sh|shell|console|powershell|ps1|python\d*|javascript|js)$/i,
      "handoff must not contain an executable command fence");
    assert.doesNotMatch(body, activeCommand,
      "handoff example must not hide an active install/Release/rollback command");
  }
  const prose = fences.reduce((text, fence) => text.replace(fence[0], ""), handoff);
  assert.doesNotMatch(prose, activeCommand,
    "handoff must route commands to their owner instead of executing them inline");
  assert.doesNotMatch(prose,
    /(?:当前(?:已接受版本|开发列车|直接回退版本)|GitHub\s*`?Latest`?)\s*(?:为|是|指向|=|：|:)\s*`?v?\d+\.\d+\.\d+/i,
    "handoff must not declare a current version role");
  for (const line of prose.split(/\r?\n/)) {
    if (/^#{1,6}\s/.test(line)) {
      assert.doesNotMatch(line, /\bv?\d+\.\d+\.\d+(?:[-.][A-Za-z0-9.]+)?\b|\b[a-f0-9]{7,64}\b/i,
        "handoff headings must not pin a version or hash");
    }
    assert.doesNotMatch(line,
      /^\|\s*(?:当前(?:版本|已接受版本|开发列车|状态)|Latest|Release状态)\s*\|/i,
      "handoff must not acquire a current-role table");
  }
}

function assertOperatorGuideLifecycle(template) {
  const roles = [
    "operator-guide-document-lifecycle", "operator-guide-positioning",
    "operator-guide-exact-inputs", "operator-guide-execution-tutorial",
    "operator-guide-evidence-and-stops", "operator-guide-pre-run-status",
    "operator-guide-channel-checkpoints", "operator-guide-final-post-run-status",
  ];
  const sections = new Map();
  for (let i = 0; i < roles.length; i++) {
    const anchor = `<a name="${roles[i]}"></a>`;
    assert.equal(template.split(anchor).length, 2, `operator guide needs one ${roles[i]} role`);
    const next = roles[i + 1] && `<a name="${roles[i + 1]}"></a>`;
    const body = next ? sectionBetween(template, anchor, next) : template.slice(template.indexOf(anchor));
    assert.match(body.slice(anchor.length), /^\s*## [^#\r\n]+\r?\n/,
      `operator guide ${roles[i]} must introduce a section`);
    sections.set(roles[i], body);
  }
  const lifecycle = sections.get(roles[0]);
  const positioning = sections.get(roles[1]);
  const channel = sections.get(roles[6]);
  const final = sections.get(roles[7]);
  const rules = [...lifecycle.matchAll(/^\d+\.\s+([\s\S]*?)(?=^\d+\.\s+|^普通Release|^生成具体guide)/gm)]
    .map(([, rule]) => rule);
  assert.ok(rules.some(rule => rule.split(/[。；;]/).some(clause =>
    /Discovery Round/.test(clause) && /Product/.test(clause) && /计数|一轮|一份/.test(clause))
    && /\bGate\b|\bgate\b/.test(rule) && /不是|不按|不计|不算|而非/.test(rule)),
  "Product guide count must follow formal Discovery Rounds, not gates");
  assert.ok(rules.some(rule => /operator guide/i.test(rule) && /多个 gate/.test(rule)
    && /可以|可|允许|能够/.test(rule)),
  "one operator guide must be able to cover multiple gates");
  assert.ok(rules.some(rule => /aggregate/i.test(rule) && /不新建|无需新建|不会新建/.test(rule)),
  "aggregate-only closeout must not create another guide");
  assert.match(positioning, /single-Discovery[\s\S]*vX\.Y\.Z-cloud-hard-acceptance\.md/);
  assert.match(positioning, /multi-Discovery[\s\S]*vX\.Y\.Z-<round>-operator-guide\.md/);

  const flow = lifecycle.match(/```text\r?\n([\s\S]*?)```/)?.[1];
  assert.ok(flow, "operator guide needs its lifecycle sequence");
  const stages = flow.split(/\r?\n/).filter(line => /^\s*->/.test(line));
  const stageIndex = cue => stages.findIndex(line => cue.test(line));
  const pre = stageIndex(/Pre-run status/);
  const checkpoint = stageIndex(/channel checkpoint/);
  const post = stageIndex(/Final Post-run status/);
  const freeze = stageIndex(/(?:freeze|冻结|immutable).*guide|guide.*(?:freeze|冻结|immutable)/i);
  assert.ok(pre >= 0 && pre < checkpoint && checkpoint < post && post < freeze,
    "guide must progress from Pre-run through channel checkpoint and Final Post-run before freeze");
  assert.match(stages[checkpoint], /\bstop\b|停止/i,
    "channel checkpoint must stop before the next channel");
  assert.match(stages[post], /same file|同一份|同一文件/i,
    "Final Post-run must close the same guide");
  assert.match(lifecycle, /Final Post-run status[^\r\n]*(?:全部|所有)[^\r\n]*(?:最终状态|最终结论)/,
    "Final Post-run requires every declared scope to reach a final state");
  assert.match(channel, /(?:不会|不|尚未)冻结guide|guide[^\r\n]*保持开放/,
    "channel checkpoint must leave the guide open");
  assert.doesNotMatch(channel, /(?<!不)(?:会|可以|立即)冻结guide/,
    "channel checkpoint must leave the guide open");
  assert.match(final, /Final Post-run status[^\r\n]*guide冻结|Final Post-run status[^\r\n]*guide[^\r\n]*不可变/,
    "the guide freezes only after Final Post-run");
  assert.match(channel, /正常等待[^\r\n]*(?:不是|不属于|不应记为)`POST_RUN_INCOMPLETE`/,
    "waiting for the next channel is not an incomplete current-channel result");
}

function assertReadmeOwnerMap(readme) {
  const map = sectionBetween(readme, '<a name="documentation-map"></a>', "## 许可证");
  const rows = map.split(/\r?\n/).map(line => line.match(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/))
    .filter(Boolean).map(([, question, owner]) => ({ question, owner }))
    .filter(({ question }) => !/^-+$/.test(question));
  assert.ok(rows.length > 1, "README document map must have question-to-owner rows");
  for (const { owner } of rows.slice(1)) {
    assert.ok(markdownLinks(owner).length > 0 || owner === "本 README" || owner.includes("`.planning/.active_plan`"),
      "every README owner-map row must have a navigable destination");
  }
  const ownerFor = cue => {
    const matches = rows.filter(row => cue.test(row.question));
    assert.equal(matches.length, 1, `README map must have one row for ${cue}`);
    return matches[0].owner;
  };
  for (const [cue, target] of [
    [/信任边界/, "ARCHITECTURE.md"],
    [/源码\/build\/install\/runtime|实现落在/, "DESIGN.md"],
    [/Unreleased|已经改变/, "CHANGELOG.md"],
    [/programme/, "ROADMAP.md"],
    [/不可变资产|迁移 refs/, "BASELINE_PROVENANCE.md"],
    [/新项目/, "docs/repository-governance-guide.md"],
    [/接手/, "MAINTAINER_HANDOFF.md"],
  ]) assert.deepEqual(markdownLinks(ownerFor(cue)), [target],
    `README map must route ${cue} to ${target}`);
  assert.deepEqual(markdownLinks(ownerFor(/本地开发、运行检查/)),
    ["Wiki.md#local-development", "Wiki.md#build-development-zip"],
    "README map must route local development and Release preparation to Wiki");
  const activePlanOwner = ownerFor(/Next Step/);
  assert.match(activePlanOwner, /`\.planning\/\.active_plan`/,
    "README map must route current authorization to active planning");
  assert.deepEqual(markdownLinks(activePlanOwner), [],
    "README map must not add a competing current-authorization owner");

  const outsideMap = readme.replace(map, "");
  assert.doesNotMatch(outsideMap,
    /^\|\s*(?:当前源码\/package 身份|当前已接受的 rollback|previous fallback|当前开发列车)\s*\|/m,
    "README must not add a second current-role table");
  assert.doesNotMatch(readme, /^## 仓库地图$/m,
    "README must not add a second repository implementation map");
  const development = sectionBetween(readme, "## 开发与 Release 维护", "## 安全与 Release 不变量");
  assert.ok(markdownLinks(development).includes("Wiki.md"),
    "README must delegate local build and Release instructions to Wiki");
  assert.doesNotMatch(development, /```/,
    "README development delegation must not become a second build runbook");
}

function assertDesignOwnerBoundaries(design) {
  const positioning = sectionBetween(design, "## 1. 文档定位", "## 2. 仓库地图");
  const rows = positioning.split(/\r?\n/).map(line => line.match(/^\|\s*(.*?)\s*\|\s*(.*?)\s*\|$/))
    .filter(Boolean).map(([, question, owner]) => ({ question, owner }));
  const ownerFor = cue => {
    const matches = rows.filter(row => cue.test(row.question));
    assert.equal(matches.length, 1, `DESIGN positioning must have one route for ${cue}`);
    return markdownLinks(matches[0].owner);
  };
  assert.deepEqual(ownerFor(/为什么需要适配层|trusted graph/), ["ARCHITECTURE.md"],
    "DESIGN must route architecture rationale to ARCHITECTURE");
  assert.deepEqual(ownerFor(/当前 programme/), ["ROADMAP.md"],
    "DESIGN must route current programme and rollback state to ROADMAP");
  assert.deepEqual(ownerFor(/已发布版本与 Unreleased/), ["CHANGELOG.md"],
    "DESIGN must route version deltas to CHANGELOG");

  const outsidePositioning = design.replace(positioning, "");
  assert.doesNotMatch(outsidePositioning,
    /^#{2,3}\s+(?:\d+\.\s*)?(?:当前(?:版本|Release|rollback|生产回滚|回退层级|开发列车)|GitHub `Latest`|production rollback|架构理由|信任边界原理)/im,
    "DESIGN must not add a competing architecture or current-state section");
  assert.doesNotMatch(outsidePositioning,
    /^\|\s*(?:当前(?:开发列车|生产回滚|回退层级|Release状态|已接受版本)|GitHub `Latest`|production rollback)\s*\|/im,
    "DESIGN must not add a current-role status table");
  assert.doesNotMatch(outsidePositioning,
    /(?:当前生产回滚|当前回退层级|GitHub `Latest`|production rollback)\s*(?:版本)?\s*(?:为|是|指向|=|：|:)/i,
    "DESIGN must not assert moving rollback or Latest state");
  assert.doesNotMatch(outsidePositioning,
    /\b[A-Z][A-Z0-9_]{5,}\s*=\s*\d+(?:\.\d+)?\b|\b(?:max_\w+|timeout_\w+)\s*[:=]\s*\d+\b/i,
    "DESIGN must not become a second machine-constant authority");
  assert.doesNotMatch(outsidePositioning,
    /(?:输出预算|context预算|plan\/progress行数|adapter超时)\s*(?:为|是|=|：|:)\s*[\d,]+(?:\s*\/\s*\d+)?/i,
    "DESIGN must not state mutable runtime budgets");
}

function assertDesignReverseIndexShape(reverseIndex) {
  const rows = reverseIndex.split(/\r?\n/)
    .filter(line => /^\| \[`[^`]+\.test\.js`\]\(tests\//.test(line));
  assert.ok(rows.length > 0, "DESIGN reverse index must contain test-module rows");
  for (const row of rows) {
    const cells = row.split("|").slice(1, -1).map(cell => cell.trim());
    assert.equal(cells.length, 4, "each DESIGN test-module row must keep four role columns");
    assert.ok(cells.every(Boolean), "each DESIGN test-module role column must be nonempty");
    assert.doesNotMatch(row, /\b\d+\s+(?:tests?|cases?|passed|failed|skipped)\b/i,
      "DESIGN reverse-index rows must not freeze runner results");
  }
}

test("cross-document fragments use stable explicit anchors", () => {
  const authorityDocs = [
    "AGENTS.md", "ARCHITECTURE.md", "BASELINE_PROVENANCE.md", "CHANGELOG.md",
    "DESIGN.md", "MAINTAINER_HANDOFF.md", "README.md", "ROADMAP.md",
    "Wiki.md",
  ];
  const discovered = [];

  for (const source of authorityDocs) {
    const sourceText = readText(source);
    const linkPattern = /\]\(([^)#]+\.md)#([^)]+)\)/g;
    for (const match of sourceText.matchAll(linkPattern)) {
      const [, relativeTarget, fragment] = match;
      const immutableBlob = relativeTarget.match(
        /^https:\/\/github\.com\/keeptoy\/pwf-codex-cloud-hooks-next\/blob\/[a-f0-9]{40}\/(.+\.md)$/,
      );
      if (immutableBlob) {
        assert.match(fragment, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/,
          `${source}: unstable fragment #${fragment}`);
        discovered.push(`${source}->${immutableBlob[1]}#${fragment}`);
        continue;
      }
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
  assertDuplicateAuthorityRoutes(discovered, readText("ROADMAP.md"));
});

test("ROADMAP overview route roles reject wrong pointers and permit equivalent prose", () => {
  const roadmap = readText("ROADMAP.md");
  const phase5 = "docs/product-phases/phase-5-overview.md#product-phase-5-overview";
  const phase4 = "docs/product-phases/phase-4-overview.md#product-phase-4-overview";
  assertOverviewRouteRelationship(roadmap);
  assert.throws(() => assertOverviewRouteRelationship(roadmap.replace(phase5, phase4)),
    /current Product Phase|current train/);
  const wrongRoute = roadmap.replace(/^(\| 5 \|[^\r\n]*)$/m,
    line => line.replace(phase5, phase4));
  assert.notEqual(wrongRoute, roadmap);
  assert.throws(() => assertOverviewRouteRelationship(wrongRoute), /Phase route row/);
  const strayDuplicate = roadmap.replace('<a name="product-phase-overview-rotation"></a>',
    `[also](${phase5})\n<a name="product-phase-overview-rotation"></a>`);
  assert.throws(() => assertOverviewRouteRelationship(strayDuplicate), /once per current\/route role/);
  assert.throws(() => assertDuplicateAuthorityRoutes(["README.md->ROADMAP.md#some-anchor",
    "README.md->ROADMAP.md#some-anchor"], roadmap), /only ROADMAP Phase overviews/);
  assertOverviewRouteRelationship(roadmap.replace("当前只授权Phase 5文档治理",
    "目前仅授权第五阶段的文档治理"));
});

test("MAINTAINER_HANDOFF is a triage desk, not another mutable runbook", () => {
  const handoff = readText("MAINTAINER_HANDOFF.md");
  const artifact = readJson(currentArtifactPath);
  assertHandoffTriageBoundary(handoff);
  assertHandoffNavigation(handoff, readText("README.md"));
  assert.equal(artifact.entries.some(entry => entry.path === "MAINTAINER_HANDOFF.md"), false);
});

test("handoff triage rejects an active runbook but permits explanatory examples", () => {
  const handoff = readText("MAINTAINER_HANDOFF.md");
  const exampleVersion = `v${readJson("package.json").version}`;
  assert.doesNotThrow(() => assertHandoffTriageBoundary(handoff));
  const command = handoff + "\n~~~bash\nnode install.js install --json\n~~~\n";
  assert.throws(() => assertHandoffTriageBoundary(command), /executable command fence/);
  const currentRole = handoff.replace("## 3. 常见安全误判",
    `## 3. 常见安全误判\n\n| 当前已接受版本 | ${exampleVersion} |\n`);
  assert.throws(() => assertHandoffTriageBoundary(currentRole), /current-role table/);
  const proseRole = handoff + `\n当前已接受版本为 ${exampleVersion}。\n`;
  assert.throws(() => assertHandoffTriageBoundary(proseRole), /current version role/);
  const listedCommand = handoff + `\n1. git tag -a ${exampleVersion} HEAD\n`;
  assert.throws(() => assertHandoffTriageBoundary(listedCommand), /route commands to their owner/);
  const missingStop = handoff.replace("否；不得覆盖", "可以继续处理");
  assert.throws(() => assertHandoffTriageBoundary(missingStop), /permission to continue/);
  const missingStopSection = handoff.slice(0, handoff.indexOf("## 5.")) +
    "## 5. 停止条件与接手完成标准\n\n请自行判断。\n";
  assert.throws(() => assertHandoffTriageBoundary(missingStopSection), /retain stop routes/);
  const explained = handoff.replace("## 3. 常见安全误判", "## 3. 易混淆的安全边界") +
    `\n示例版本 ${exampleVersion} 与示例哈希 abcdef0123456789 仅用于说明查证方式。\n` +
    "~~~text\nhealthy → 阅读 README\n~~~\n";
  assert.doesNotThrow(() => assertHandoffTriageBoundary(explained));
});

test("handoff navigation rejects misplaced links and permits equivalent explanation", () => {
  const handoff = readText("MAINTAINER_HANDOFF.md");
  const readme = readText("README.md");
  assertHandoffNavigation(handoff, readme);
  assert.throws(() => assertHandoffNavigation(handoff.replace("(README.md#documentation-map)",
    "(ROADMAP.md#documentation-map)") + "\n[map](README.md#documentation-map)\n", readme),
  /introduction must route/);
  assert.throws(() => assertHandoffNavigation(handoff.replace("(DESIGN.md#module-responsibilities)",
    "(ROADMAP.md#module-responsibilities)") + "\n[design](DESIGN.md#module-responsibilities)\n", readme),
  /quickstart must have one step/);
  assert.throws(() => assertHandoffNavigation(handoff.replace("[CHANGELOG](CHANGELOG.md)",
    "[CHANGELOG](Wiki.md)") + "\n[delta](CHANGELOG.md)\n", readme),
  /version triage/);
  assert.throws(() => assertHandoffNavigation(handoff.replace("(.planning/.active_plan)",
    "(README.md)") + "\n[plan](.planning/.active_plan)\n", readme),
  /quickstart must have one step/);
  assertHandoffNavigation(handoff.replace("[Wiki 的本地开发入口]", "[开发与验证指南]")
    .replace("绿色结果只是证据，不会自动扩大授权。", "通过检查只构成证据，并不授予下一步权限。"), readme);
});

test("acceptance documents are counted by Discovery Round and share one operator-guide lifecycle", () => {
  const cloudTemplate = readText("docs/cloud-hard-acceptance-template.md");
  const operatorTemplate = readText("docs/cloud-acceptance-operator-guide-template.md");
  const governance = readText("docs/repository-governance-guide.md");
  const design = readText("DESIGN.md");
  const roadmap = readText("ROADMAP.md");
  const artifact = readJson(currentArtifactPath);

  assert.match(operatorTemplate, /^<a name="cloud-acceptance-operator-guide-template"><\/a>$/m);
  assertOperatorGuideLifecycle(operatorTemplate);
  assert.match(operatorTemplate,
    /SOURCE_CANDIDATE_PASS \/ PUBLISHED_RELEASE_NOT_RUN \/ STOP_BEFORE_PUBLICATION/);
  assert.match(operatorTemplate,
    /^<a name="operator-guide-candidate-admission-preflight"><\/a>$/m);
  assert.match(operatorTemplate,
    /^<a name="operator-guide-source-candidate-closeout-retirement-checkpoint"><\/a>$/m);
  assert.match(operatorTemplate,
    /^<a name="operator-guide-release-exit-retirement-checkpoint"><\/a>$/m);
  assert.match(operatorTemplate, /SOURCE_CANDIDATE_HEAD[\s\S]*正式tag[\s\S]*实际Cloud PASS/);
  assert.match(operatorTemplate, /第一阶段状态写回commit[^\n]*不替代[^\n]*tag/);
  assert.match(operatorTemplate, /两次状态写回[^\n]*不是[^\n]*Cloud/);
  assert.match(operatorTemplate, /SOURCE_CANDIDATE_CHECKPOINT_HEAD/);
  assert.match(operatorTemplate, /PUBLISHED_RELEASE_CLOSEOUT_HEAD/);
  for (const currentReleaseDoc of [operatorTemplate, cloudTemplate, governance]) {
    assert.match(currentReleaseDoc, /\.\.\/ROADMAP\.md#release-four-step-flow/);
    assert.match(currentReleaseDoc, /\.\.\/ROADMAP\.md#version-train-two-retirement-reviews/);
  }

  for (const value of [cloudTemplate, governance]) {
    assert.match(value, /多 Discovery 版本/);
    assert.match(value, /Discovery Round/);
    assert.doesNotMatch(value, /多\s*gate\s*(?:开发)?版本/i);
  }
  assert.match(cloudTemplate, /single-Discovery 版本专项 acceptance[^\n]*operator guide/);
  assert.match(cloudTemplate, /Source\/Candidate 与 Published Release[^\n]*两个独立通道/);
  assert.match(governance, /runbook[^\n]*operator-guide[^\n]*历史文件/);
  assert.match(design, /cloud-acceptance-operator-guide-template\.md/);
  assert.match(design, /Discovery Round[^\n]*Pre-run[^\n]*channel checkpoint[^\n]*final Post-run/);
  assert.match(roadmap, /Product验收[^\n]*Discovery Round/);
  assert.match(roadmap, /Release验收[^\n]*Source\/Candidate[^\n]*Published Release/);
  assert.match(roadmap, /retirement review[^\n]*不是Cloud acceptance/);
  assert.match(roadmap, /第1、3步[^\n]*Cloud[^\n]*第2、4步[^\n]*控制面/);
  assert.match(roadmap, /candidate baseline closeout/);
  assert.match(roadmap, /普通Release[^\n]*不需要[^\n]*standing Phase 9/);
  assert.match(roadmap, /candidate admission preflight/);
  assert.match(roadmap, /source-candidate closeout retirement checkpoint/);
  assert.match(roadmap, /role-window closeout retirement checkpoint/);
  assert.match(roadmap, /正式tag[^\n]*Source\/Candidate[^\n]*实际Cloud PASS[^\n]*commit/);
  assert.doesNotMatch(roadmap,
    /随后该版本列车进入自己的 standing Phase 9|每条未来列车都要重新进入的 standing gate/);
  assert.equal(artifact.entries.some(entry => entry.path === "docs/cloud-acceptance-operator-guide-template.md"), false);
});

test("operator-guide lifecycle rejects wrong count or freeze while permitting equivalent prose", () => {
  const template = readText("docs/cloud-acceptance-operator-guide-template.md");
  assertOperatorGuideLifecycle(template);
  const wrongCount = template.replace("正式Discovery Round才是新增Product验收文档的计数单位",
    "每个Gate才是新增Product验收文档的计数单位");
  assert.notEqual(wrongCount, template);
  assert.throws(() => assertOperatorGuideLifecycle(wrongCount), /Product guide count/);
  const splitGuide = template.replace("一个 operator guide 可以编排多个 gate、Cloud task 或 stage",
    "每个 gate 必须分别新建 operator guide");
  assert.notEqual(splitGuide, template);
  assert.throws(() => assertOperatorGuideLifecycle(splitGuide), /one operator guide/);
  const prematureFreeze = template.replaceAll("不会冻结guide", "会冻结guide");
  assert.notEqual(prematureFreeze, template);
  assert.throws(() => assertOperatorGuideLifecycle(prematureFreeze), /checkpoint must leave the guide open/);
  const reordered = template.replace(/(  -> append exact Final Post-run status to the same file\r?\n)(  -> freeze the guide)/,
    "$2\n$1");
  assert.notEqual(reordered, template);
  assert.throws(() => assertOperatorGuideLifecycle(reordered), /before freeze/);
  const equivalent = template
    .replace("## 1. 定位与 Discovery claim", "## 1. 本轮定位与 Discovery claim")
    .replace("一个 operator guide 可以编排多个 gate、Cloud task 或 stage",
      "一个 operator guide 可覆盖多个 gate、Cloud task 或 stage")
    .replace("纯 aggregate、evidence closure或retirement closeout若只汇总已经冻结的证据，不新建operator guide",
      "纯 aggregate、evidence closure或retirement closeout若仅汇总已冻结证据，无需新建operator guide")
    .replaceAll("不会冻结guide", "guide仍保持开放")
    .replace("Final Post-run status只在guide声明范围全部取得明确最终状态后追加。",
      "Final Post-run status须待guide覆盖的全部事项取得明确最终结论后追加。")
    .replace("Final Post-run status追加并通过本地治理验证后，该guide冻结。",
      "Final Post-run status追加并通过本地治理验证后，该guide成为不可变记录。")
    .replace("正常等待维护者完成publication或建立后序通道identity不是`POST_RUN_INCOMPLETE`",
      "正常等待维护者完成publication或建立后序通道identity不属于`POST_RUN_INCOMPLETE`");
  assert.notEqual(equivalent, template);
  assert.doesNotThrow(() => assertOperatorGuideLifecycle(equivalent));
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
  for (const item of bundle.installed_contracts) {
    const contractName = path.posix.basename(item.installed_path);
    assert.match(architecture, new RegExp(contractName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      `ARCHITECTURE deployment tree omits installed contract ${contractName}`);
  }
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
  assert.match(adapter, /Build the exact-v2 plan-context request/);
  assert.doesNotMatch(adapter, /legacy\+smart request/);
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

  assertReadmeOwnerMap(readme);

  assert.match(design, /^# 仓库实现设计/m);
  assert.match(design, /## 1\. 文档定位/);
  assert.match(design, /## 2\. 仓库地图/);
  for (const implementationPath of [
    "install.js", "hooks/hook_adapter.py", "runtime/owned-plan.py", "runtime/owned-catchup.py",
    "tools/import_upstream_runtime.py", "tools/build_release.py",
  ]) assert.match(design, new RegExp(implementationPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(design, /Product Phase 4.*未授权/);
  assert.equal(artifact.entries.some(entry => entry.path === "DESIGN.md"), false);

  assert.doesNotMatch(roadmap, /\| 当前允许做什么、唯一 Next Step 是什么 \|/);
  assert.match(roadmap, /README\.md.*开发状态与文档地图/);
  assert.match(agents, /README\.md.*开发状态与文档地图/);
  assert.match(agents, /DESIGN\.md/);
  assert.doesNotMatch(ownedPlan, /Inactive managed plan-context runtime|Phase 3 Round 4/);
  assert.doesNotMatch(adapter, /inactive exact-v1 owned-plan request/);
});

test("README owner map rejects wrong destinations but allows equivalent explanation", () => {
  const readme = readText("README.md");
  assertReadmeOwnerMap(readme);
  const wrongProgramme = readme.replace(/(\| 当前 programme[^\r\n]*\]\()ROADMAP\.md(\) \|)/,
    "$1CHANGELOG.md$2") + "\n[programme](ROADMAP.md)\n";
  assert.notEqual(wrongProgramme, readme + "\n[programme](ROADMAP.md)\n");
  assert.throws(() => assertReadmeOwnerMap(wrongProgramme), /route \/programme\/ to ROADMAP/);
  const wrongImplementation = readme.replace(/(\| 实现落在[^\r\n]*\]\()DESIGN\.md(\) \|)/,
    "$1ARCHITECTURE.md$2") + "\n[design](DESIGN.md)\n";
  assert.throws(() => assertReadmeOwnerMap(wrongImplementation), /route .* to DESIGN/);
  const unlinkedOverview = readme.replace("[`Product Phase Overview`](docs/product-phases/README.md)",
    "docs/product-phases/README.md");
  assert.throws(() => assertReadmeOwnerMap(unlinkedOverview), /navigable destination/);
  const competingPlan = readme.replace("`.planning/.active_plan` 指向的活动 `task_plan.md`",
    "`.planning/.active_plan` 指向的活动 `task_plan.md` 或 [README](README.md)");
  assert.throws(() => assertReadmeOwnerMap(competingPlan), /competing current-authorization owner/);
  assert.throws(() => assertReadmeOwnerMap(readme + "\n| 当前开发列车 | moving candidate |\n"),
    /second current-role table/);
  const duplicateRunbook = readme.replace("本地开发、Git mode/LF 检查",
    "```bash\npython tools/build_release.py build\n```\n本地开发、Git mode/LF 检查");
  assert.throws(() => assertReadmeOwnerMap(duplicateRunbook), /second build runbook/);
  const equivalent = readme.replace("当前 programme、版本列车、Cloud/Release/rollback 状态",
    "当前 programme 的路线与阶段进展")
    .replace(/(\| 当前 programme[^\r\n]*\| )\[`ROADMAP\.md`\]\(ROADMAP\.md\)/,
      "$1[路线权威](ROADMAP.md)")
    + "\n当前已接受的 rollback 应由 ROADMAP 判断；这里仅是提醒。\n";
  assert.match(equivalent, /\| 当前 programme 的路线与阶段进展 \| \[路线权威\]\(ROADMAP\.md\) \|/);
  assertReadmeOwnerMap(equivalent);
});

test("ARCHITECTURE preserves system reasoning while DESIGN routes implementation changes", () => {
  const architecture = readText("ARCHITECTURE.md");
  const design = readText("DESIGN.md");
  const verificationStart = design.indexOf("## 6. 验证路由");
  const verificationEnd = design.indexOf("### 6.1 测试职责反向索引", verificationStart);
  const verification = design.slice(verificationStart, verificationEnd);

  assert.match(architecture, /^<a name="cloud-lifecycle"><\/a>$/m);
  assert.match(architecture, /\[.*DESIGN.*\]\(DESIGN\.md\)/);

  assert.match(design, /^<a name="implementation-layout"><\/a>$/m);
  assert.match(design, /^<a name="module-responsibilities"><\/a>$/m);
  assert.match(verification, /Wiki\.md#local-development/);
  assert.match(verification, /Wiki\.md#build-development-zip/);

  for (const target of [
    "contracts/runtime-bundle-v2.json", "contracts/release-artifact-v2.json",
    "tests/installer.test.js", "tests/hook-adapter.test.js", "tests/owned-plan-runtime.test.js",
    "tests/owned-runtime.test.js", "tests/import-runtime.test.js", "tests/release-package.test.js",
    "tests/published-release-oracles.test.js",
  ]) assert.match(design, new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assertDesignOwnerBoundaries(design);
});

test("DESIGN ownership rejects second authorities while allowing safe cross-references", () => {
  const design = readText("DESIGN.md");
  assertDesignOwnerBoundaries(design);
  const wrongArchitecture = design.replace(/(\| 为什么需要适配层[^\r\n]*\]\()ARCHITECTURE\.md(\) \|)/,
    "$1DESIGN.md$2") + "\n[architecture](ARCHITECTURE.md)\n";
  assert.notEqual(wrongArchitecture, design + "\n[architecture](ARCHITECTURE.md)\n");
  assert.throws(() => assertDesignOwnerBoundaries(wrongArchitecture), /architecture rationale/);
  const wrongProgramme = design.replace(/(\| 当前 programme[^\r\n]*\]\()ROADMAP\.md(\) \|)/,
    "$1CHANGELOG.md$2") + "\n[programme](ROADMAP.md)\n";
  assert.throws(() => assertDesignOwnerBoundaries(wrongProgramme), /current programme/);
  assert.throws(() => assertDesignOwnerBoundaries(design.replace("## 7. 继续阅读",
    "## 当前生产回滚\n\n此处另列当前角色。\n\n## 7. 继续阅读")), /competing architecture or current-state section/);
  assert.throws(() => assertDesignOwnerBoundaries(design + "\n| 当前开发列车 | moving candidate |\n"),
    /current-role status table/);
  assert.throws(() => assertDesignOwnerBoundaries(design + "\n当前生产回滚是 accepted。\n"),
    /moving rollback or Latest state/);
  assert.throws(() => assertDesignOwnerBoundaries(design + "\n## GitHub `Latest`\n\n这里另列当前版本。\n"),
    /competing architecture or current-state section/);
  assert.throws(() => assertDesignOwnerBoundaries(design + "\n| 当前回退层级 | accepted |\n"),
    /current-role status table/);
  assert.throws(() => assertDesignOwnerBoundaries(design + "\nproduction rollback: accepted\n"),
    /moving rollback or Latest state/);
  assert.throws(() => assertDesignOwnerBoundaries(design + "\nADAPTER_DEADLINE_SECONDS = 27\n"),
    /machine-constant authority/);
  assert.throws(() => assertDesignOwnerBoundaries(design + "\n输出预算为20,000。\n"),
    /mutable runtime budgets/);
  assertDesignOwnerBoundaries(design + "\nGitHub `Latest` 的当前状态看 ROADMAP；"
    + "`ADAPTER_DEADLINE_SECONDS` 的值看源码，不在此冻结。\n");
  assertDesignOwnerBoundaries(design + "\n当前生产回滚与当前回退层级见 ROADMAP；"
    + "for production rollback and GitHub `Latest`, consult ROADMAP.\n");
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

  assertDesignReverseIndexShape(reverseIndex);
});

test("DESIGN reverse index rejects result snapshots but allows explanation rewrites", () => {
  const design = readText("DESIGN.md");
  const index = sectionBetween(design, "### 6.1 测试职责反向索引", "## 7. 继续阅读");
  assertDesignReverseIndexShape(index);
  const frozenResult = index.replace("| 跨平台静态治理 |",
    "| 跨平台静态治理；27 tests passed | ");
  assert.notEqual(frozenResult, index);
  assert.throws(() => assertDesignReverseIndexShape(frozenResult), /runner results/);
  const missingRole = index.replace("| 跨平台静态治理 |", "|  | ");
  assert.throws(() => assertDesignReverseIndexShape(missingRole), /nonempty/);
  const equivalent = index.replace("具体 case\n语义以测试源码中的 test title 与 assertion 为准",
    "单个 case 的实际行为请回到测试源码核对");
  assert.notEqual(equivalent, index);
  assertDesignReverseIndexShape(equivalent);
});

test("ROADMAP keeps stable Discovery, migration, and Release governance anchors", () => {
  const roadmap = readText("ROADMAP.md");
  const readme = readText("README.md");
  const agents = readText("AGENTS.md");
  const cloudTemplate = readText("docs/cloud-hard-acceptance-template.md");
  const operatorTemplate = readText("docs/cloud-acceptance-operator-guide-template.md");
  const repositoryGovernance = readText("docs/repository-governance-guide.md");
  const phaseOverviewIndex = readText("docs/product-phases/README.md");
  const phaseOverviewTemplate = readText("docs/product-phase-overview-template.md");
  const phase4Overview = readText("docs/product-phases/phase-4-overview.md");
  const phase5Overview = readText("docs/product-phases/phase-5-overview.md");
  const phase41 = readText("docs/history/phase-4.1-managed-v3-discovery.md");
  const phase44 = readText("docs/history/phase-4.4-f2a-smart-activation-discovery.md");
  const currentTrainStart = roadmap.indexOf("## 4. 当前开发列车");
  const productPhaseStart = roadmap.indexOf("## 5. Product Phase 路线索引");
  const versioningStart = roadmap.indexOf("## 6. 版本号与晋级语义");
  const discoveryStart = roadmap.indexOf("## 7. Discovery 与 gate 晋级模型");
  const migrationStart = roadmap.indexOf("## 8. Migration transaction 与对象生命周期治理");
  const releaseStart = roadmap.indexOf("## 9. Release 授权与封板顺序");
  const rollbackStart = roadmap.indexOf("## 10. rollback 原则");
  const longTermStart = roadmap.indexOf("## 11. 长期路线");
  const retirementStart = roadmap.indexOf('<a name="version-train-two-retirement-reviews"></a>');
  const compatibilityStart = roadmap.indexOf('<a name="pre-1-compatibility-admission"></a>');
  const releaseFlowStart = roadmap.indexOf('<a name="release-four-step-flow"></a>');
  assert.notEqual(currentTrainStart, -1);
  assert.notEqual(productPhaseStart, -1);
  assert.notEqual(versioningStart, -1);
  assert.notEqual(discoveryStart, -1);
  assert.notEqual(migrationStart, -1);
  assert.notEqual(releaseStart, -1);
  assert.notEqual(rollbackStart, -1);
  assert.notEqual(longTermStart, -1);
  const currentTrain = roadmap.slice(currentTrainStart, productPhaseStart);
  const productPhases = roadmap.slice(productPhaseStart, versioningStart);
  assertRoadmapPhaseRoutes(roadmap, phaseOverviewIndex);
  const migrationGovernance = roadmap.slice(migrationStart, releaseStart);
  const compatibilityGovernance = roadmap.slice(compatibilityStart, rollbackStart);
  const developmentTrain = roadmap.match(/^\| 当前开发列车 \| `(NONE|v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?)`/m)?.[1];
  assert.ok(developmentTrain, "ROADMAP lacks a parseable current development train state");
  const packageVersion = JSON.parse(readText("package.json")).version;
  if (developmentTrain !== "NONE") assert.equal(developmentTrain, `v${packageVersion}`);
  assert.match(roadmap, /^<a name="version-train-two-retirement-reviews"><\/a>$/m);
  assert.match(roadmap, /^<a name="product-phase-route-index"><\/a>$/m);
  assert.match(roadmap, /^<a name="product-phase-overview-rotation"><\/a>$/m);
  assert.match(phase4Overview, /^<a name="product-phase-4-overview"><\/a>$/m);
  assert.match(phase5Overview, /^<a name="product-phase-5-overview"><\/a>$/m);
  assert.match(roadmap, /^<a name="discovery-gate-governance"><\/a>$/m);
  assert.match(roadmap, /^<a name="migration-transaction-lifecycle-governance"><\/a>$/m);
  assert.match(roadmap, /^<a name="release-four-step-flow"><\/a>$/m);
  assert.match(roadmap, /^<a name="pre-1-compatibility-admission"><\/a>$/m);
  assert.match(roadmap, /每条发布列车都必须经过两轮 retirement review/);
  assert.match(roadmap, /第一轮：source-candidate closeout/);
  assert.match(roadmap, /第二轮：role-window closeout/);
  assert.match(roadmap, /review.*不是为了清单好看而强制删除/);
  assert.match(repositoryGovernance, /^<a name="planning-lifecycle"><\/a>$/m);
  assert.doesNotMatch(repositoryGovernance, /product-phase-authority-rotation/);
  assert.match(repositoryGovernance,
    /ROADMAP\.md#product-phase-overview-rotation[\s\S]*不复制[\s\S]*仓库专用状态机/);
  assert.match(productPhases,
    /下一列车未授权时写`NONE`[\s\S]*不保留旧exact train anchor[\s\S]*overview本身保持长期canonical/);
  assert.match(roadmap, /docs\/repository-governance-guide\.md#planning-lifecycle/);
  assert.match(roadmap, /planning[\s\S]{0,180}维护者[\s\S]{0,120}明确决定[\s\S]{0,120}不(?:得|会)自动删除/);
  assert.match(roadmap, /candidate admission preflight[\s\S]{0,240}只读[\s\S]{0,240}不删除/);
  assert.match(roadmap, /Source\/Candidate[\s\S]{0,240}失败[\s\S]{0,240}planning[\s\S]{0,180}回滚/);
  assert.match(roadmap, /package、contract、runtime、bootstrap、ZIP allowlist[\s\S]{0,240}新C0[\s\S]{0,160}Source\/Candidate/);
  assert.match(roadmap, /多个低风险 Phase合并到同一版本列车[\s\S]*每个 Phase仍分别做第一轮审查[\s\S]*只在最终发布时做一次[\s\S]*第二轮审查/);
  assert.ok(discoveryStart < migrationStart && migrationStart < releaseStart
    && releaseStart < rollbackStart && rollbackStart < longTermStart,
    "Discovery, migration, Release, rollback, and long-term governance must remain ordered");
  assert.ok(releaseStart < retirementStart && retirementStart < compatibilityStart,
    "retirement reviews must live inside Release governance before compatibility policy");
  const releaseFlow = roadmap.slice(releaseFlowStart, retirementStart);
  assert.match(releaseFlow,
    /candidate admission preflight[\s\S]*C0：候选源码 commit[\s\S]*Source\/Candidate Cloud PASS[\s\S]*source-candidate closeout retirement checkpoint[\s\S]*C1：第一阶段状态commit[\s\S]*正式验收tag精确指向C0[\s\S]*immutable Pre-release[\s\S]*Published Release Cloud PASS[\s\S]*Latest promotion confirmation[\s\S]*role-window closeout retirement checkpoint[\s\S]*C2：最终治理commit/);
  assert.match(releaseFlow,
    /GitHub Release编辑页面[\s\S]*取消Pre-release[\s\S]*设为Latest[\s\S]*Release详情页[\s\S]*exact版本[\s\S]*Latest/);
  assert.match(releaseFlow, /不是Codex Cloud[\s\S]*GitHub Actions[\s\S]*任意[\s\S]*未报错/);
  assert.match(releaseFlow, /成功[\s\S]*不再单列[\s\S]*postflight/);
  assert.match(releaseFlow, /结果未知[\s\S]*停止角色轮转和C2[\s\S]*只读诊断/);
  assert.match(roadmap, /^<a name="github-release-latest-promotion-confirmation"><\/a>$/m);
  assert.equal((roadmap.match(/<a name="github-release-latest-promotion-confirmation"><\/a>/g) || []).length, 1);
  const retirementFlow = roadmap.slice(retirementStart, compatibilityStart);
  assert.match(retirementFlow,
    /candidate admission preflight[\s\S]*C0 \/ Source-Candidate[\s\S]*Source\/Candidate Cloud PASS[\s\S]*source-candidate closeout retirement checkpoint[\s\S]*C1 \/ 第一阶段状态写回[\s\S]*immutable publication[\s\S]*Published Release Cloud PASS[\s\S]*Latest promotion confirmation[\s\S]*role-window closeout retirement checkpoint[\s\S]*C2 \/ final evidence与programme closeout/);
  for (const currentPolicy of [cloudTemplate, operatorTemplate, repositoryGovernance]) {
    assert.match(currentPolicy, /GitHub Release Latest promotion confirmation/);
    assert.match(currentPolicy, /ROADMAP\.md#github-release-latest-promotion-confirmation/);
    assert.doesNotMatch(currentPolicy, /完成(?:同一Release的)?Latest promotion与只读postflight|Latest(?: promotion)?\/postflight/);
  }
  assert.match(agents, /ROADMAP\.md#github-release-latest-promotion-confirmation/);
  assert.match(agents, /GitHub Release Latest\s+promotion confirmation[\s\S]{0,240}只读[\s\S]{0,120}ROADMAP/);
  for (const authorityProjection of [agents, operatorTemplate, cloudTemplate, repositoryGovernance]) {
    assert.doesNotMatch(authorityProjection,
      /GitHub Release编辑页面[\s\S]{0,240}Release详情页|不是Codex Cloud[\s\S]{0,200}GitHub Actions|不再重复下载资产、重算SHA/);
  }
  for (const role of [
    "SOURCE_CANDIDATE_HEAD", "SOURCE_CANDIDATE_CHECKPOINT_HEAD",
    "PUBLISHED_RELEASE_CLOSEOUT_HEAD",
  ]) assert.match(roadmap, new RegExp("`" + role + "`"));
  assert.match(roadmap, /C0[\s\S]*C1[\s\S]*C2/);
  assert.doesNotMatch(roadmap, /<a name="phase-9-v0-4-0-instance"><\/a>/);
  assert.doesNotMatch(currentTrain, /^<a name="v\d+-\d+-\d+(?:-[a-z0-9-]+)?-phase-history-governance-train"><\/a>$/m);
  assert.match(currentTrain,
    /当前exact (?:development|stable) candidate为`v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?`[^\n]*branch `\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?`/);
  assert.doesNotMatch(currentTrain, /^<a name="v\d+-\d+-\d+(?:-[a-z0-9-]+)?-release-tag-guide-train"><\/a>$/m);
  assert.match(currentTrain, /trusted\/Release zones 继续 exact[\s\S]*docs\/planning zones 按 lifecycle policy/);
  assert.match(productPhases, /^<a name="product-phase-overview-rotation"><\/a>$/m);
  assert.match(productPhases, /本节只保存未来Product Phase路线[\s\S]*不自动授权下一Phase/);
  assert.match(productPhases,
    /当前维护默认一条版本列车只承载一个Product Phase[\s\S]*维护者[\s\S]*明确授权/);
  assert.match(productPhases, /patch\/governance归属[\s\S]*没有新Product Phase时[\s\S]*不创建overview/);
  assert.match(productPhases,
    /所修补Product baseline[\s\S]*ROADMAP声明的版本系列[\s\S]*不能唯一判断时先由维护者确认/);
  assert.match(productPhases, /\| 6 \| `0\.6\.0-\*`[\s\S]*PreCompact\/PostCompact/);
  assert.match(productPhases, /\| 7 \| `0\.7\.0-\*`[\s\S]*噪声[\s\S]*`NO_GO`[\s\S]*不是Phase 8前置/);
  assert.match(productPhases, /\| 8 \| `0\.8\.0-\*`[\s\S]*唯一[\s\S]*read-only[\s\S]*Phase 7/);
  assert.match(productPhases, /\| 9 \| `0\.9\.0-\*`[\s\S]*复用Phase 8 evaluator[\s\S]*best-effort shell lock[\s\S]*managed authority/);
  assert.doesNotMatch(productPhases, /5\.1\.1|5\.1\.2|5\.1\.3|5\.1\.4|### 5\.2/);
  assert.match(phaseOverviewIndex, /^<a name="product-phase-overview-index"><\/a>$/m);
  assert.match(phaseOverviewTemplate, /^<a name="product-phase-overview-template"><\/a>$/m);
  assert.match(phaseOverviewTemplate, /不复制当前Next Step[\s\S]*C0\/C1\/C2/);
  assert.match(phaseOverviewTemplate, /tag\/source\/ZIP\/bootstrap\/SHA/);
  assert.match(phase4Overview, /^> Authority role: `PRODUCT_PHASE_OVERVIEW`$/m);
  assert.match(phase4Overview, /^## Why this Phase existed$/m);
  assert.match(phase4Overview, /^<a name="v0-4-2-release-closeout"><\/a>$/m);
  assert.match(phase4Overview, /^<a name="v0-4-3-release-asset-governance"><\/a>$/m);
  assert.match(phase4Overview,
    /v0\.4\.3 Release资产物化与验收边界[\s\S]*canonical `\.bash\.in`模板[\s\S]*三个不同生命周期对象/);
  assert.match(phase4Overview,
    /manifest→Release contract→唯一external asset[\s\S]*Source\/Candidate证明当前C0源码[\s\S]*Published Release不带本地override/);
  assert.match(phase4Overview, /没有重新打开Phase 4、激活Phase 5或改变Product\/runtime行为/);
  assert.match(phase4Overview, /RETROSPECTIVE_CAPSULE[\s\S]*FROZEN_DISCOVERY_RECORD/);
  assert.match(phase5Overview,
    /Authority role: `PRODUCT_PHASE_OVERVIEW`[\s\S]*Version series: `0\.5\.0`/);
  assert.match(phase41, /\]\(\.\.\/product-phases\/phase-4-overview\.md#product-phase-4-overview\)/);
  assert.match(phase44, /\]\(\.\.\/product-phases\/phase-4-overview\.md#product-phase-4-overview\)/);
  assert.doesNotMatch(roadmap, /### 5\.4 迁移 transaction 与对象生命周期治理/);
  assert.doesNotMatch(roadmap, /### 5\.5 .*已采纳边界/);
  assert.match(migrationGovernance, /关键迁移可以按照风险、ownership和故障域拆成独立审查、实施、测试和停止点/);
  assert.match(migrationGovernance, /具体拆分由当前Discovery与活动task plan[\s\S]*不继承历史Phase的gate名称或数量/);
  assert.match(migrationGovernance, /任何拆分都不能形成可发布的半成品[\s\S]*最终候选必须在同一transaction内[\s\S]*原子闭合/);
  assert.doesNotMatch(migrationGovernance, /F1A|F1B/);
  assert.match(migrationGovernance, /对象生命周期账[\s\S]*KEEP\/REPLACE\/RETIRE\/DEFER/);
  assert.match(migrationGovernance, /planning[^\n]*implementation drift/i);
  assert.match(migrationGovernance, /implementation[^\n]*live[^\n]*lifecycle drift/i);
  assert.match(compatibilityGovernance, /文档路径与anchor在`0\.x`阶段同样不会自动成为永久兼容合同/);
  assert.match(compatibilityGovernance, /没有current入链的旧alias可以直接退休[\s\S]*immutable commit\/tag保留/);
  assert.match(compatibilityGovernance, /进入`1\.0\.0`稳定线[\s\S]*public documentation surface[\s\S]*长期兼容面治理/);
  assert.doesNotMatch(roadmap, /### 4\.6 流水账/);
  assert.match(readme, /ROADMAP\.md#pre-1-compatibility-admission/);
});

test("ROADMAP Phase routes reject wrong materialization and permit summary rewrites", () => {
  const roadmap = readText("ROADMAP.md");
  const overviewIndex = readText("docs/product-phases/README.md");
  assertRoadmapPhaseRoutes(roadmap, overviewIndex);
  const routeRows = roadmap.split(/\r?\n/).filter(line => /^\| \d+ \|/.test(line));
  const active = routeRows.find(line => /\bactive\b/.test(line));
  const pending = routeRows.find(line => /\bpending\b/.test(line));
  assert.ok(active && pending, "probe requires an active and a pending Phase row");
  assert.throws(() => assertRoadmapPhaseRoutes(roadmap.replace(active,
    active.replace(/\bactive\b/, "pending")), overviewIndex),
  /only active or complete Phase rows|one active train/);
  const pendingPhase = pending.match(/^\| (\d+) \|/)[1];
  const premature = pending.replace(/\bpending\b/,
    `pending；[overview](docs/product-phases/phase-${pendingPhase}-overview.md#product-phase-${pendingPhase}-overview)`);
  assert.throws(() => assertRoadmapPhaseRoutes(roadmap.replace(pending, premature), overviewIndex),
    /only active or complete Phase rows/);
  const indexRow = overviewIndex.split(/\r?\n/).find(line => /^\| \d+ \|/.test(line));
  assert.ok(indexRow, "probe requires a materialized overview index row");
  assert.throws(() => assertRoadmapPhaseRoutes(roadmap, overviewIndex.replace(indexRow, "")),
    /overview index must equal/);
  const wrongIndex = indexRow.replace(/phase-(\d+)-overview\.md#product-phase-\d+-overview/,
    "phase-999-overview.md#product-phase-999-overview");
  assert.throws(() => assertRoadmapPhaseRoutes(roadmap, overviewIndex.replace(indexRow, wrongIndex)),
    /overview index row must link its own Phase/);
  const current = sectionBetween(roadmap, "## 4. 当前开发列车", '<a name="product-phase-route-index"></a>');
  const accepted = roadmap.match(/^\| 当前已接受版本 \| `(v\d+\.\d+\.\d+)`/m)[1];
  const acceptedEvidence = new RegExp(`\\]\\(docs/acceptance/${accepted.replaceAll(".", "\\.")}-cloud-hard-acceptance\\.md#[^)]+\\)`);
  const wrongEvidence = current.replace(acceptedEvidence,
    `](docs/acceptance/${accepted}-wrong.md#wrong)`);
  assert.notEqual(wrongEvidence, current);
  assert.throws(() => assertRoadmapPhaseRoutes(roadmap.replace(current, wrongEvidence), overviewIndex),
    /accepted-version evidence/);
  assert.throws(() => assertRoadmapPhaseRoutes(roadmap.replace(current,
    current + "\n### copied historical runbook\n"), overviewIndex),
  /nested runbook/);
  const equivalent = roadmap.replace(active, active.replace("文档治理：authority分层", "文档权威治理：分层职责"))
    .replace("candidate + accepted role window", "候选与已接受角色窗口");
  assert.match(equivalent, /文档权威治理：分层职责/);
  assert.match(equivalent, /候选与已接受角色窗口/);
  assertRoadmapPhaseRoutes(equivalent, overviewIndex);
});

test("ROADMAP NONE state removes current pointers but retains completed Phase routes", () => {
  const roadmap = readText("ROADMAP.md");
  const overviewIndex = readText("docs/product-phases/README.md");
  const developmentState = roadmap.match(/^\| 当前开发列车 \| `(NONE|v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?)`/m)?.[1];
  const accepted = roadmap.match(/^\| 当前已接受版本 \| `(v\d+\.\d+\.\d+)`/m)?.[1];
  assert.ok(developmentState && accepted, "NONE probe requires development and accepted roles");
  const staleVersion = developmentState === "NONE" ? `v${readJson("package.json").version}` : developmentState;
  const current = sectionBetween(roadmap, "## 4. 当前开发列车", '<a name="product-phase-route-index"></a>');
  const acceptanceTarget = markdownLinks(current).find(target => target.startsWith(
    `docs/acceptance/${accepted}-cloud-hard-acceptance.md#`));
  assert.ok(acceptanceTarget, "NONE probe requires the current accepted evidence route");
  const routeRows = roadmap.split(/\r?\n/).filter(line => /^\| \d+ \|/.test(line));
  const activeRow = routeRows.find(line => /\bactive\b/.test(line));
  const completedRow = routeRows.find(line => /\bcomplete\b/.test(line));
  const pendingRow = routeRows.find(line => /\bpending\b/.test(line));
  const routeRow = activeRow || completedRow;
  const materializedPhase = routeRow?.match(/^\| (\d+) \|/)?.[1];
  const pendingPhase = pendingRow?.match(/^\| (\d+) \|/)?.[1];
  const indexRow = overviewIndex.split(/\r?\n/).find(line => line.startsWith(`| ${materializedPhase} |`));
  assert.ok(routeRow && pendingRow && indexRow, "NONE probe requires materialized and pending Phase routes");
  const noneCurrent = `## 4. 当前开发列车

当前没有获批开发列车；长期Product结论请查第5节路线索引。
精确来源见[provenance](BASELINE_PROVENANCE.md)，已接受验收见
[acceptance](${acceptanceTarget})。

`;
  let none = roadmap.replace(/^\| 当前开发列车 \|[^\r\n]*/m,
    "| 当前开发列车 | `NONE`；尚未授权下一列车 |")
    .replace(current, noneCurrent);
  if (activeRow) none = none.replace(activeRow, activeRow.replace(/\bactive\b/, "complete"));
  const completeIndex = activeRow
    ? overviewIndex.replace(indexRow, indexRow.replace(/\bactive\b/, "complete"))
    : overviewIndex;
  const completeRouteRow = activeRow ? activeRow.replace(/\bactive\b/, "complete") : completedRow;
  const completeIndexRow = activeRow ? indexRow.replace(/\bactive\b/, "complete") : indexRow;
  assertRoadmapPhaseRoutes(none, completeIndex);

  assert.throws(() => assertRoadmapPhaseRoutes(none.replace(noneCurrent,
    noneCurrent.replace("当前没有获批开发列车", `旧列车 ${staleVersion} 仍是当前候选`)), completeIndex),
  /exact train or version-role identity/);
  assert.throws(() => assertRoadmapPhaseRoutes(none.replace(noneCurrent,
    noneCurrent.replace("长期Product结论", `[旧Phase指针](docs/product-phases/phase-${materializedPhase}-overview.md#product-phase-${materializedPhase}-overview)；长期Product结论`)), completeIndex),
  /NONE must not retain a current Phase overview pointer/);
  assert.throws(() => assertRoadmapPhaseRoutes(none.replace(completeRouteRow,
    completeRouteRow.replace(/\bcomplete\b/, "active")),
    completeIndex), /active Phase row must match current train/);
  assert.throws(() => assertRoadmapPhaseRoutes(none.replace(pendingRow, pendingRow.replace(/\bpending\b/,
    `pending；[premature overview](docs/product-phases/phase-${pendingPhase}-overview.md#product-phase-${pendingPhase}-overview)`)),
  completeIndex), /only active or complete Phase rows/);
  assert.throws(() => assertRoadmapPhaseRoutes(none, completeIndex.replace(completeIndexRow,
    completeIndexRow.replace(/\bcomplete\b/, "active"))),
    /overview index and ROADMAP must agree/);
  assert.throws(() => assertRoadmapPhaseRoutes(none.replace(noneCurrent,
    noneCurrent.replace(`${accepted}-cloud-hard-acceptance.md`, `${accepted}-wrong.md`)), completeIndex),
  /accepted-version evidence/);

  const equivalent = none.replace("当前没有获批开发列车；长期Product结论请查第5节路线索引。",
    "下一开发列车尚未获批；已完成Phase的长期说明仍可从第5节查阅。");
  assertRoadmapPhaseRoutes(equivalent, completeIndex);
});

test("Phase 4 separates platform execution permission from plan-local product consent", () => {
  const phase4Overview = readText("docs/product-phases/phase-4-overview.md");
  const history = readText("docs/history/phase-4.1-managed-v3-discovery.md");

  for (const term of [
    "本地 sandbox / approval",
    "Cloud task / container policy",
    "system-managed Hook trust",
    "Phase 4 plan-local opt-in",
  ]) assert.match(phase4Overview, new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(phase4Overview, /给计划行为授权，不给模型扩权/);
  assert.match(phase4Overview, /`autonomous`[\s\S]{0,180}不表示Codex获得更高系统权限/);
  assert.doesNotMatch(phase4Overview, /“授权”必须继续分成三层/);
  assert.match(history, /^<a name="phase-4-1-post-implementation-opt-in-clarification"><\/a>$/m);
  assert.match(history, /Phase 4 的 opt-in 不是 Codex 权限申请/);
  assert.match(history, /这才是 Phase 4 实现的产品 opt-in/);
});
