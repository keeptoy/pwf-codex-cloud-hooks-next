"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const toolRelative = "tools/classify_release_risk.py";
const policyRelative = "tools/release-risk-policy-v1.json";

function git(repository, ...args) {
  const result = spawnSync("git", args, { cwd: repository, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function write(repository, relative, content = `${relative}\n`) {
  const target = path.join(repository, ...relative.split("/"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

function commit(repository, message) {
  git(repository, "add", "-A");
  return commitStaged(repository, message);
}

function commitStaged(repository, message) {
  git(repository, "-c", "user.name=Risk Fixture", "-c", "user.email=risk@example.invalid",
    "commit", "-m", message);
  return git(repository, "rev-parse", "HEAD");
}

function fixture() {
  const repository = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-risk-"));
  git(repository, "init", "-q");
  for (const relative of [toolRelative, policyRelative]) {
    write(repository, relative, fs.readFileSync(path.join(root, relative)));
  }
  const artifact = {
    schema_version: 2,
    contract_id: "PWF_RELEASE_ARTIFACT_V2",
    package_name: "fixture",
    package_version: "0.0.0",
    archive_root: "fixture/",
    ordering: "lexicographic_by_utf8_path",
    timestamp: "1980-01-01T00:00:00Z",
    compression: "deflate",
    entries: [
      { path: "README.md", mode: "0644" },
      { path: "runtime/owned-plan.py", mode: "0755" },
      { path: "tools/build_release.py", mode: "0755" },
    ],
    external_release_assets: ["init-cloud-sandbox-v0.0.0.bash"],
    excluded_prefixes: [".planning/", "docs/", "tests/"],
  };
  write(repository, "contracts/release-artifact-v2.json", `${JSON.stringify(artifact, null, 2)}\n`);
  write(repository, "README.md", "fixture readme\n");
  write(repository, "runtime/owned-plan.py", "print('fixture')\n");
  write(repository, "tools/build_release.py", "print('build')\n");
  write(repository, "docs/history/note.md", "history\n");
  write(repository, "docs/history/delete.md", "delete\n");
  write(repository, "docs/history/mode.md", "mode\n");
  write(repository, "tests/sample.test.js", "// fixture\n");
  write(repository, "init-cloud-sandbox-v0.0.0.bash", "#!/bin/sh\nexit 1\n");
  return { repository, base: commit(repository, "baseline") };
}

function runClassifier(repository, base, head, extra = []) {
  return spawnSync(python, [path.join(repository, toolRelative), "--base", base, "--head", head, ...extra], {
    cwd: repository,
    encoding: "utf8",
  });
}

function classifySingle(relative, mutate) {
  const layout = fixture();
  try {
    mutate(layout.repository, relative);
    const head = commit(layout.repository, `change ${relative}`);
    const run = runClassifier(layout.repository, layout.base, head);
    assert.equal(run.status, 0, run.stderr);
    return JSON.parse(run.stdout);
  } finally {
    fs.rmSync(layout.repository, { recursive: true, force: true });
  }
}

test("G1 classifier emits deterministic read-only source-governance advice", () => {
  const layout = fixture();
  try {
    write(layout.repository, "docs/history/note.md", "updated history\n");
    const head = commit(layout.repository, "governance change");
    const before = git(layout.repository, "status", "--porcelain=v1");
    const first = runClassifier(layout.repository, layout.base, head);
    const second = runClassifier(layout.repository, layout.base, head);
    assert.equal(first.status, 0, first.stderr);
    assert.equal(second.status, 0, second.stderr);
    assert.equal(first.stdout, second.stdout);
    assert.equal(git(layout.repository, "status", "--porcelain=v1"), before);

    const result = JSON.parse(first.stdout);
    assert.deepEqual(Object.keys(result).sort(), [
      "advisory_only", "base_commit", "changes", "evidence_invalidated", "head_commit", "lane",
      "policy", "reasons", "release_authority", "result_type", "schema_version", "unknowns",
    ]);
    assert.equal(result.schema_version, 1);
    assert.equal(result.result_type, "PWF_RELEASE_RISK_ADVISORY_V1");
    assert.equal(result.advisory_only, true);
    assert.equal(result.base_commit, layout.base);
    assert.equal(result.head_commit, head);
    assert.equal(result.lane, "SOURCE_ONLY_GOVERNANCE");
    assert.deepEqual(result.unknowns, []);
    assert.equal(Object.hasOwn(result, "required_gates"), false);
    assert.equal(Object.hasOwn(result, "identity_closure"), false);
    assert.deepEqual(result.changes.map(change => change.status), ["M"]);
    assert.equal(result.changes[0].release_intersection, false);
    assert.equal(result.changes[0].old_type, "regular");
    assert.equal(result.changes[0].new_type, "regular");
  } finally {
    fs.rmSync(layout.repository, { recursive: true, force: true });
  }
});

test("G1 classifier applies strict owner precedence across the four advisory lanes", () => {
  const samples = [
    ["docs/history/note.md", "SOURCE_ONLY_GOVERNANCE"],
    ["README.md", "PACKAGE_DOC_ONLY"],
    ["tools/build_release.py", "RELEASE_MECHANICS"],
    ["runtime/owned-plan.py", "PRODUCT_OR_SECURITY"],
  ];
  for (const [relative, lane] of samples) {
    const result = classifySingle(relative, (repository, target) => write(repository, target, `changed ${target}\n`));
    assert.equal(result.lane, lane, relative);
    assert.equal(result.changes[0].lane, lane, relative);
  }

  const layout = fixture();
  try {
    write(layout.repository, "README.md", "doc change\n");
    write(layout.repository, "runtime/owned-plan.py", "product change\n");
    const head = commit(layout.repository, "mixed change");
    const run = runClassifier(layout.repository, layout.base, head);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(JSON.parse(run.stdout).lane, "PRODUCT_OR_SECURITY");
  } finally {
    fs.rmSync(layout.repository, { recursive: true, force: true });
  }
});

test("G1 classifier preserves add delete rename and executable-mode evidence", () => {
  const layout = fixture();
  try {
    fs.renameSync(path.join(layout.repository, "docs/history/note.md"),
      path.join(layout.repository, "docs/history/renamed.md"));
    fs.rmSync(path.join(layout.repository, "docs/history/delete.md"));
    write(layout.repository, "docs/history/added.md", "added\n");
    git(layout.repository, "update-index", "--chmod=+x", "docs/history/mode.md");
    const head = commit(layout.repository, "delta shapes");
    const run = runClassifier(layout.repository, layout.base, head);
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);
    assert.equal(result.lane, "SOURCE_ONLY_GOVERNANCE");
    assert.deepEqual(result.changes.map(change => change.status).sort(), ["A", "D", "M", "R"]);
    const renamed = result.changes.find(change => change.status === "R");
    assert.equal(renamed.old_path, "docs/history/note.md");
    assert.equal(renamed.new_path, "docs/history/renamed.md");
    assert.equal(renamed.score, 100);
    const mode = result.changes.find(change => change.new_path === "docs/history/mode.md");
    assert.equal(mode.old_mode, "100644");
    assert.equal(mode.new_mode, "100755");
    assert.equal(mode.old_type, "regular");
    assert.equal(mode.new_type, "regular");
  } finally {
    fs.rmSync(layout.repository, { recursive: true, force: true });
  }
});

test("G1 classifier fails closed for unknown paths unsafe types and self-change", () => {
  let result = classifySingle("unknown.bin", (repository, relative) => write(repository, relative, "unknown\n"));
  assert.equal(result.lane, "PRODUCT_OR_SECURITY");
  assert.ok(result.unknowns.some(value => value.includes("unknown.bin")));

  result = classifySingle(policyRelative,
    (repository, relative) => fs.appendFileSync(path.join(repository, relative), " \n"));
  assert.equal(result.lane, "PRODUCT_OR_SECURITY");
  assert.ok(result.reasons.includes("classifier_self_change"));

  const layout = fixture();
  try {
    const blob = spawnSync("git", ["hash-object", "-w", "--stdin"], {
      cwd: layout.repository, input: "target\n", encoding: "utf8",
    });
    assert.equal(blob.status, 0, blob.stderr);
    git(layout.repository, "update-index", "--add", "--cacheinfo", `120000,${blob.stdout.trim()},docs/history/link.md`);
    const head = commitStaged(layout.repository, "unsafe link");
    const run = runClassifier(layout.repository, layout.base, head);
    assert.equal(run.status, 0, run.stderr);
    result = JSON.parse(run.stdout);
    assert.equal(result.lane, "PRODUCT_OR_SECURITY");
    assert.equal(result.changes[0].new_type, "symlink");
    assert.ok(result.changes[0].unknowns.includes("unsafe_object_type"));
  } finally {
    fs.rmSync(layout.repository, { recursive: true, force: true });
  }
});

test("G1 classifier marks changed tests as invalid evidence without lowering a stricter owner", () => {
  const layout = fixture();
  try {
    write(layout.repository, "tests/sample.test.js", "// changed test\n");
    write(layout.repository, "runtime/owned-plan.py", "product change\n");
    const head = commit(layout.repository, "test and product");
    const run = runClassifier(layout.repository, layout.base, head);
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);
    assert.equal(result.lane, "PRODUCT_OR_SECURITY");
    assert.deepEqual(result.evidence_invalidated, ["LOCAL_TEST_BASELINE"]);
  } finally {
    fs.rmSync(layout.repository, { recursive: true, force: true });
  }
});

test("G1 classifier rejects unresolved endpoints and never guesses a moving base", () => {
  const layout = fixture();
  try {
    const run = runClassifier(layout.repository, "missing-base", layout.base);
    assert.equal(run.status, 1);
    assert.equal(run.stdout, "");
    const error = JSON.parse(run.stderr);
    assert.equal(error.schema_version, 1);
    assert.equal(error.result_type, "PWF_RELEASE_RISK_ADVISORY_ERROR_V1");
    assert.equal(error.healthy, false);
    assert.equal(error.error_code, "INVALID_ENDPOINT");
  } finally {
    fs.rmSync(layout.repository, { recursive: true, force: true });
  }
});
