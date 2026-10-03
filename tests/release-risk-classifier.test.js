"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const toolRelative = "tools/classify_release_risk.py";
const policyRelative = "tools/release-risk-policy-v1.json";
const replayRelative = "tests/fixtures/release-risk-replay-v1.json";

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

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

const installedManifestKeys = [
  "adapter_sha256", "events", "installer_version", "owner", "requirements_file",
  "requirements_sha256", "runtime_files", "schema_version", "skill_root",
  "unowned_requirements_sha256", "upstream",
];

function transitionBytes(packageVersion, upstream, adapterSha, runtimeFiles) {
  const quoted = value => JSON.stringify(value);
  const lines = [
    "{",
    '  "schema_version": 1,',
    '  "contract_id": "PWF_INSTALLED_STATE_TRANSITION_V1",',
    '  "predecessor": {',
    `    "package_version": ${quoted(packageVersion)},`,
    '    "installed_manifest_schema": 3,',
    '    "owner": "pwf-codex-cloud-hooks",',
    `    "manifest_keys": [${installedManifestKeys.map(quoted).join(", ")}],`,
    `    "upstream_canonical_sha256": ${quoted(sha256(canonical(upstream)))},`,
    `    "adapter_sha256": ${quoted(adapterSha)},`,
    '    "events": ["SessionStart", "UserPromptSubmit"],',
    '    "runtime_files": [',
  ];
  runtimeFiles.forEach((file, index) => {
    const rendered = `{ "id": ${quoted(file.id)}, "path": ${quoted(file.path)}, "sha256": ${quoted(file.sha256)}, "mode": ${quoted(file.mode)} }`;
    lines.push(`      ${rendered}${index + 1 === runtimeFiles.length ? "" : ","}`);
  });
  lines.push("    ]", "  }", "}");
  return `${lines.join("\n")}\n`;
}

function bootstrapTemplate() {
  return [
    "#!/usr/bin/env bash",
    'readonly HOOKS_VERSION="${HOOKS_VERSION:-@HOOKS_VERSION@}"',
    'readonly HOOKS_SHA256="${HOOKS_SHA256:-@HOOKS_SHA256@}"',
    "exit 1",
    "",
  ].join("\n");
}

function renderBootstrap(template, version, checksum) {
  return template.replace("@HOOKS_VERSION@", version).replace("@HOOKS_SHA256@", checksum);
}

function releaseContract(version) {
  return {
    schema_version: 2,
    contract_id: "PWF_RELEASE_ARTIFACT_V2",
    package_name: "pwf-codex-cloud-hooks",
    package_version: version,
    archive_root: "pwf-codex-cloud-hooks/",
    ordering: "lexicographic_by_utf8_path",
    timestamp: "1980-01-01T00:00:00Z",
    compression: "deflate",
    entries: [
      { path: "README.md", mode: "0644" },
      { path: "hooks/hook_adapter.py", mode: "0755" },
    ],
    external_release_assets: [`init-cloud-sandbox-v${version}.bash`],
    excluded_prefixes: [".planning/", "docs/", "tests/"],
  };
}

function identityFixture({ tamperBootstrap = false } = {}) {
  const repository = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-risk-identity-"));
  git(repository, "init", "-q");
  for (const relative of [toolRelative, policyRelative]) {
    write(repository, relative, fs.readFileSync(path.join(root, relative)));
  }

  const adapter = "#!/usr/bin/env python3\nprint('adapter')\n";
  const notice = "fixture notice\n";
  const importer = "#!/usr/bin/env python3\nprint('importer')\n";
  const adapterSha = sha256(adapter);
  const noticeSha = sha256(notice);
  const importerSha = sha256(importer);
  const runtimeFiles = [
    { id: "adapter", path: "hook_adapter.py", sha256: adapterSha, mode: "0755" },
    { id: "third_party_notices", path: "THIRD_PARTY_NOTICES.md", sha256: noticeSha, mode: "0644" },
  ];
  const bundle = {
    schema_version: 2,
    contract_id: "PWF_MANAGED_RUNTIME_BUNDLE_V2",
    upstream: {
      repository: "fixture/upstream",
      release: "v1.0.0",
      commit: "1".repeat(40),
      release_archive_url: "https://example.invalid/upstream.zip",
      release_archive_sha256: "2".repeat(64),
      license: "MIT",
      copyright: "fixture",
      license_source_path: "LICENSE",
      license_sha256: "3".repeat(64),
    },
    roots: {
      upstream_source: "skills/planning-with-files",
      upstream_package: "runtime/upstream",
      local_packages: ["hooks", "runtime"],
      contract_package: "contracts",
      installed: "hooks/planning-with-files",
    },
    upstream_files: [],
    local_files: [{
      id: "adapter",
      package_path: "hooks/hook_adapter.py",
      installed_path: "hooks/planning-with-files/hook_adapter.py",
      mode: "0755",
      sha256: adapterSha,
      direct_dependencies: [],
    }],
    installed_contracts: [],
  };
  const template = bootstrapTemplate();
  const baseRelease = releaseContract("1.0.0");
  const baseTransition = transitionBytes("0.9.0", { fixture: true }, adapterSha, runtimeFiles);

  write(repository, "README.md", "fixture readme\n");
  write(repository, "package.json", `${JSON.stringify({ name: "pwf-codex-cloud-hooks", version: "1.0.0", private: true }, null, 2)}\n`);
  write(repository, "hooks/hook_adapter.py", adapter);
  write(repository, "THIRD_PARTY_NOTICES.md", notice);
  write(repository, "tools/import_upstream_runtime.py", importer);
  write(repository, "contracts/runtime-bundle-v2.json", `${JSON.stringify(bundle, null, 2)}\n`);
  write(repository, "contracts/release-artifact-v2.json", `${JSON.stringify(baseRelease, null, 2)}\n`);
  write(repository, "contracts/installed-state-transition-v1.json", baseTransition);
  write(repository, "tools/templates/init-cloud-sandbox.bash.in", template);
  write(repository, "init-cloud-sandbox-v1.0.0.bash", renderBootstrap(template, "v1.0.0", "4".repeat(64)));

  const baseManifest = {
    schema_version: 4,
    upstream: "fixture/upstream",
    release: "v1.0.0",
    commit: "1".repeat(40),
    release_archive_url: "https://example.invalid/upstream.zip",
    release_archive_sha256: "2".repeat(64),
    required_skill_files: {},
    managed_runtime: {
      schema_version: 3,
      contracts: {
        runtime_bundle: { path: "contracts/runtime-bundle-v2.json", sha256: sha256(`${JSON.stringify(bundle, null, 2)}\n`) },
        release_artifact: { path: "contracts/release-artifact-v2.json", sha256: sha256(`${JSON.stringify(baseRelease, null, 2)}\n`) },
        installed_state_transition: { path: "contracts/installed-state-transition-v1.json", sha256: sha256(baseTransition) },
      },
      importer: { path: "tools/import_upstream_runtime.py", sha256: importerSha },
      license_provenance: {
        spdx: "MIT",
        upstream_path: "LICENSE",
        upstream_sha256: "3".repeat(64),
        notice_path: "THIRD_PARTY_NOTICES.md",
        notice_sha256: noticeSha,
      },
    },
  };
  write(repository, "upstream-manifest.json", `${JSON.stringify(baseManifest, null, 2)}\n`);
  const base = commit(repository, "identity baseline");

  const headRelease = releaseContract("1.0.1");
  const headTransition = transitionBytes("1.0.0", baseManifest, adapterSha, runtimeFiles);
  const headManifest = structuredClone(baseManifest);
  headManifest.managed_runtime.contracts.release_artifact.sha256 = sha256(`${JSON.stringify(headRelease, null, 2)}\n`);
  headManifest.managed_runtime.contracts.installed_state_transition.sha256 = sha256(headTransition);
  write(repository, "package.json", `${JSON.stringify({ name: "pwf-codex-cloud-hooks", version: "1.0.1", private: true }, null, 2)}\n`);
  write(repository, "contracts/release-artifact-v2.json", `${JSON.stringify(headRelease, null, 2)}\n`);
  write(repository, "contracts/installed-state-transition-v1.json", headTransition);
  write(repository, "upstream-manifest.json", `${JSON.stringify(headManifest, null, 2)}\n`);
  let candidate = renderBootstrap(template, "v1.0.1", "0".repeat(64));
  if (tamperBootstrap) candidate += "# unexplained\n";
  write(repository, "init-cloud-sandbox-v1.0.1.bash", candidate);
  const head = commit(repository, tamperBootstrap ? "tampered identity" : "canonical identity");
  return { repository, base, head };
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

test("G2 classifier preserves deterministic read-only source-governance advice", () => {
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
      "advisory_only", "base_commit", "changes", "evidence_invalidated", "head_commit", "identity_closure",
      "lane", "policy", "reasons", "release_authority", "residual_changes", "result_type",
      "schema_version", "unknowns",
    ]);
    assert.equal(result.schema_version, 2);
    assert.equal(result.result_type, "PWF_RELEASE_RISK_ADVISORY_V2");
    assert.equal(result.advisory_only, true);
    assert.equal(result.base_commit, layout.base);
    assert.equal(result.head_commit, head);
    assert.equal(result.lane, "SOURCE_ONLY_GOVERNANCE");
    assert.deepEqual(result.unknowns, []);
    assert.equal(Object.hasOwn(result, "required_gates"), false);
    assert.equal(result.identity_closure.state, "not_applicable");
    assert.equal(result.identity_closure.complete, false);
    assert.deepEqual(result.identity_closure.explained_paths, []);
    assert.deepEqual(result.residual_changes, result.changes);
    assert.deepEqual(result.changes.map(change => change.status), ["M"]);
    assert.equal(result.changes[0].release_intersection, false);
    assert.equal(result.changes[0].old_type, "regular");
    assert.equal(result.changes[0].new_type, "regular");
  } finally {
    fs.rmSync(layout.repository, { recursive: true, force: true });
  }
});

test("G2 classifier preserves strict G1 owner precedence across the four advisory lanes", () => {
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

test("G2 classifier preserves add delete rename and executable-mode evidence", () => {
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

test("G2 classifier fails closed for unknown paths unsafe types and self-change", () => {
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

test("G2 classifier marks changed tests as invalid evidence without lowering a stricter owner", () => {
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

test("G2 classifier rejects unresolved endpoints and never guesses a moving base", () => {
  const layout = fixture();
  try {
    const run = runClassifier(layout.repository, "missing-base", layout.base);
    assert.equal(run.status, 1);
    assert.equal(run.stdout, "");
    const error = JSON.parse(run.stderr);
    assert.equal(error.schema_version, 2);
    assert.equal(error.result_type, "PWF_RELEASE_RISK_ADVISORY_ERROR_V2");
    assert.equal(error.healthy, false);
    assert.equal(error.error_code, "INVALID_ENDPOINT");
  } finally {
    fs.rmSync(layout.repository, { recursive: true, force: true });
  }
});

test("G2 canonical identity-only closure returns NO_RELEASE_REQUIRED", () => {
  const layout = identityFixture();
  try {
    const before = git(layout.repository, "status", "--porcelain=v1");
    const run = runClassifier(layout.repository, layout.base, layout.head);
    assert.equal(run.status, 0, run.stderr);
    assert.equal(git(layout.repository, "status", "--porcelain=v1"), before);
    const result = JSON.parse(run.stdout);
    assert.equal(result.lane, "NO_RELEASE_REQUIRED");
    assert.equal(result.identity_closure.state, "complete");
    assert.equal(result.identity_closure.complete, true);
    assert.equal(result.identity_closure.renderer, "head_template_v1");
    assert.deepEqual(result.identity_closure.unknowns, []);
    assert.deepEqual(result.residual_changes, []);
    assert.deepEqual(result.identity_closure.explained_paths, [
      "contracts/installed-state-transition-v1.json",
      "contracts/release-artifact-v2.json",
      "init-cloud-sandbox-v1.0.1.bash",
      "package.json",
      "upstream-manifest.json",
    ]);
    assert.ok(result.changes.every(change => change.identity_explained));
  } finally {
    fs.rmSync(layout.repository, { recursive: true, force: true });
  }
});

test("G2 incomplete identity closure retains every raw member and fails closed", () => {
  const layout = identityFixture({ tamperBootstrap: true });
  try {
    const run = runClassifier(layout.repository, layout.base, layout.head);
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);
    assert.equal(result.lane, "PRODUCT_OR_SECURITY");
    assert.equal(result.identity_closure.state, "invalid");
    assert.equal(result.identity_closure.complete, false);
    assert.deepEqual(result.identity_closure.explained_paths, []);
    assert.equal(result.residual_changes.length, result.changes.length);
    assert.ok(result.identity_closure.unknowns.includes("candidate_bootstrap_bytes_mismatch"));
    assert.ok(result.unknowns.includes("candidate_bootstrap_bytes_mismatch"));
  } finally {
    fs.rmSync(layout.repository, { recursive: true, force: true });
  }
});

test("G2 exact historical replay ledger matches every frozen lane with zero false-fast results", () => {
  const ledger = JSON.parse(fs.readFileSync(path.join(root, replayRelative), "utf8"));
  assert.equal(ledger.schema_version, 1);
  assert.equal(ledger.fixture_id, "PWF_RELEASE_RISK_REPLAY_V1");
  assert.equal(ledger.samples.length, 6);
  const observed = [];
  for (const sample of ledger.samples) {
    assert.match(sample.base_commit, /^[a-f0-9]{40}$/);
    assert.match(sample.head_commit, /^[a-f0-9]{40}$/);
    const run = runClassifier(root, sample.base_commit, sample.head_commit);
    assert.equal(run.status, 0, `${sample.id}: ${run.stderr}`);
    const result = JSON.parse(run.stdout);
    observed.push([sample.id, result.lane]);
    assert.equal(result.base_commit, sample.base_commit, sample.id);
    assert.equal(result.head_commit, sample.head_commit, sample.id);
    assert.equal(result.lane, sample.expected_lane, sample.id);
  }
  assert.deepEqual(observed, ledger.samples.map(sample => [sample.id, sample.expected_lane]));
});
