"use strict";
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { after, before, test } = require("node:test");

const root = path.resolve(__dirname, "..");
let cli;
const pristineSkill = path.join(root, "tests", "fixtures", "planning-with-files");
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
let skillWorkspace;
let skill;
let cliWorkspace;
const sha256 = value => crypto.createHash("sha256").update(value).digest("hex");

const expectedRuntimeFiles = [
  "THIRD_PARTY_NOTICES.md",
  "contracts/adapter-plan-context-request-v1.schema.json",
  "contracts/plan-context-result-v1.schema.json",
  "hook_adapter.py",
  "installed-manifest.json",
  "owned-catchup.py",
  "owned-plan.py",
  "upstream/inject-plan.sh",
  "upstream/ledger-summary.sh",
  "upstream/resolve-plan-dir.sh",
  "upstream/session-catchup.py",
];

before(() => {
  const executable = spawnSync(python, ["-c", "import sys; print(sys.executable)"], { encoding: "utf8" });
  assert.equal(executable.status, 0, executable.stderr);
  cliWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-installer-package-"));
  for (const entry of ["install.js", "package.json", "upstream-manifest.json", "THIRD_PARTY_NOTICES.md", "hooks", "runtime", "contracts"]) {
    fs.cpSync(path.join(root, entry), path.join(cliWorkspace, entry), { recursive: true });
  }
  cli = path.join(cliWorkspace, "install.js");
  const source = fs.readFileSync(cli, "utf8");
  const replacement = `const MANAGED_PYTHON = ${JSON.stringify(executable.stdout.trim().replace(/\\/g, "/"))};`;
  assert.equal((source.match(/const MANAGED_PYTHON = "\/usr\/bin\/python3";/g) || []).length, 1);
  fs.writeFileSync(cli, source.replace('const MANAGED_PYTHON = "/usr/bin/python3";', replacement));

  skillWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-patched-skill-"));
  skill = path.join(skillWorkspace, "planning-with-files");
  fs.cpSync(pristineSkill, skill, { recursive: true });
});

after(() => {
  if (skillWorkspace) fs.rmSync(skillWorkspace, { recursive: true, force: true });
  if (cliWorkspace) fs.rmSync(cliWorkspace, { recursive: true, force: true });
});
function run(home, ...args) {
  const requirements = path.join(home, "etc", "codex", "requirements.toml");
  const result = spawnSync(process.execPath, [cli, ...args, "--codex-home", home, "--skill-root", skill, "--managed-requirements", requirements, "--json"], { encoding: "utf8" });
  return { ...result, json: result.stdout.trim() ? JSON.parse(result.stdout) : null };
}
function directOptions(home) {
  return {
    codexHome: home,
    skillRoot: skill,
    managedRequirements: path.join(home, "etc", "codex", "requirements.toml"),
    dryRun: false,
    repair: false,
  };
}
function fixture() {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-hooks-test-"));
  fs.mkdirSync(path.join(home, "etc", "codex"), { recursive: true });
  fs.writeFileSync(path.join(home, "config.toml"), 'personality = "pragmatic"\n\n[mcp_servers.keep]\ncommand = "keep"\n');
  fs.writeFileSync(path.join(home, "hooks.json"), JSON.stringify({ description: "keep", hooks: { Stop: [{ hooks: [{ type: "command", command: "echo keep" }] }] } }, null, 2) + "\n");
  fs.writeFileSync(path.join(home, "etc", "codex", "requirements.toml"), `enforce_residency = "us"\n\n[features]\nbrowser_use = false\n\n[hooks]\nmanaged_dir = ${JSON.stringify(path.join(home, "hooks"))}\n\n[[hooks.Stop]]\n[[hooks.Stop.hooks]]\ntype = "command"\ncommand = "/usr/bin/keep"\n`);
  return home;
}
function snapshot(paths) {
  return paths.map(file => [file, fs.existsSync(file) ? fs.readFileSync(file) : null]);
}
function assertSnapshot(expected) {
  for (const [file, content] of expected) {
    if (content === null) assert.equal(fs.existsSync(file), false, file);
    else assert.deepEqual(fs.readFileSync(file), content, file);
  }
}
function runtimeFiles(home) {
  const runtime = path.join(home, "hooks", "planning-with-files"), result = [];
  function walk(directory, prefix = "") {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(path.join(directory, entry.name), relative);
      else result.push(relative);
    }
  }
  walk(runtime);
  return result.sort();
}

async function withMutatedRuntimeBundle(scenario, action) {
  const bundlePath = path.join(cliWorkspace, "contracts", "runtime-bundle-v1.json");
  const manifestPath = path.join(cliWorkspace, "upstream-manifest.json");
  const originalBundle = fs.readFileSync(bundlePath);
  const originalManifest = fs.readFileSync(manifestPath);
  try {
    if (scenario.missing) {
      fs.rmSync(bundlePath);
    } else {
      const bundle = JSON.parse(originalBundle.toString("utf8"));
      const bytes = scenario.raw
        ? Buffer.from(scenario.raw(bundle), "utf8")
        : Buffer.from(`${JSON.stringify(scenario.mutate(bundle), null, 2)}\n`, "utf8");
      fs.writeFileSync(bundlePath, bytes);
      if (scenario.anchor !== false || scenario.mutateManifest) {
        const manifest = JSON.parse(originalManifest.toString("utf8"));
        if (scenario.anchor !== false) manifest.managed_runtime.contracts.runtime_bundle.sha256 = sha256(bytes);
        if (scenario.mutateManifest) scenario.mutateManifest(manifest);
        fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      }
    }
    await action();
  } finally {
    fs.writeFileSync(bundlePath, originalBundle);
    fs.writeFileSync(manifestPath, originalManifest);
  }
}

test("dry-run is read-only and reports two handlers", () => {
  const home = fixture(), requirements = path.join(home, "etc", "codex", "requirements.toml"), beforeRequirements = fs.readFileSync(requirements, "utf8");
  const result = run(home, "install", "--dry-run");
  assert.equal(result.status, 0, result.stderr); assert.deepEqual(result.json.events, ["SessionStart", "UserPromptSubmit"]);
  assert.equal(fs.readFileSync(requirements, "utf8"), beforeRequirements);
  assert.equal(fs.existsSync(path.join(home, "hooks", "planning-with-files")), false);
});

test("managed install fails closed when an existing managed_dir excludes the adapter", () => {
  const home = fixture(), requirements = path.join(home, "etc", "codex", "requirements.toml");
  fs.writeFileSync(requirements, '[hooks]\nmanaged_dir = "/enterprise/hooks"\n');
  const result = run(home, "install", "--dry-run");
  assert.equal(result.status, 1); assert.match(result.stderr, /existing hooks\.managed_dir does not contain adapter/);
  fs.rmSync(home, { recursive: true, force: true });
});

test("managed install rejects a runtime owned by a non-current manifest", () => {
  const home = fixture(), runtime = path.join(home, "hooks", "planning-with-files");
  fs.mkdirSync(runtime, { recursive: true });
  fs.writeFileSync(path.join(runtime, "hook_adapter.py"), "# incompatible adapter\n");
  fs.writeFileSync(path.join(runtime, "installed-manifest.json"), '{"schema_version":2,"owner":"pwf-codex-cloud-hooks"}\n');
  const result = run(home, "install");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /installed manifest identity mismatch/);
  assert.equal(fs.readFileSync(path.join(runtime, "hook_adapter.py"), "utf8"), "# incompatible adapter\n");
  fs.rmSync(home, { recursive: true, force: true });
});

test("managed install rejects an unverified or invalid runtime bundle before any managed write", async t => {
  const scenarios = [
    { name: "missing bundle", missing: true },
    { name: "raw bundle hash mismatch", anchor: false, raw: bundle => `${JSON.stringify(bundle, null, 2)}\n ` },
    { name: "invalid JSON", raw: () => "{\n" },
    { name: "unsupported schema", mutate: bundle => { bundle.schema_version = 999; return bundle; } },
    { name: "retired manifest inventory mirror", mutate: bundle => bundle, mutateManifest: manifest => { manifest.managed_runtime.package_root = "runtime/upstream"; } },
    { name: "unsafe bundle reference", mutate: bundle => bundle, mutateManifest: manifest => { manifest.managed_runtime.contracts.runtime_bundle.path = "../runtime-bundle-v1.json"; } },
    { name: "unsafe package path", mutate: bundle => { bundle.local_files[0].package_path = "../owned-catchup.py"; return bundle; } },
    { name: "unsafe installed path", mutate: bundle => { bundle.installed_contracts[0].installed_path = "../adapter-plan-context-request-v1.schema.json"; return bundle; } },
    { name: "duplicate package path", mutate: bundle => { bundle.files[1].package_path = bundle.files[0].package_path; return bundle; } },
    { name: "duplicate installed path", mutate: bundle => { bundle.installed_contracts[1].installed_path = bundle.installed_contracts[0].installed_path; return bundle; } },
    { name: "duplicate runtime id", mutate: bundle => { bundle.files[1].id = bundle.files[0].id; return bundle; } },
    { name: "duplicate cross-section id", mutate: bundle => { bundle.local_files[0].id = bundle.files[0].id; return bundle; } },
    { name: "malformed runtime id", mutate: bundle => { bundle.local_files[0].id = "Phase-4"; return bundle; } },
    { name: "invalid mode", mutate: bundle => { bundle.files[0].mode = "0777"; return bundle; } },
    { name: "invalid content hash", mutate: bundle => { bundle.local_files[0].sha256 = "not-a-sha256"; return bundle; } },
    { name: "unknown dependency", mutate: bundle => { bundle.local_files[0].direct_file_dependencies[0].id = "not_admitted"; return bundle; } },
  ];

  for (const scenario of scenarios) {
    await t.test(scenario.name, async () => {
      const home = fixture();
      const requirements = path.join(home, "etc", "codex", "requirements.toml");
      const protectedState = snapshot([
        path.join(home, "config.toml"),
        path.join(home, "hooks.json"),
        requirements,
      ]);
      try {
        await withMutatedRuntimeBundle(scenario, () => {
          const result = run(home, "install");
          assert.equal(result.status, 1, `installer accepted ${scenario.name}`);
          assert.match(result.stderr, /BLOCKED_PACKAGE_DRIFT/);
          assertSnapshot(protectedState);
          assert.equal(fs.existsSync(path.join(home, "hooks", "planning-with-files")), false,
            `${scenario.name} wrote a managed runtime before validation completed`);
        });
      } finally {
        fs.rmSync(home, { recursive: true, force: true });
      }
    });
  }
});

test("managed install uses the verified bundle with no manifest inventory mirrors", async () => {
  const home = fixture();
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(cliWorkspace, "upstream-manifest.json"), "utf8"));
    assert.deepEqual(Object.keys(manifest.managed_runtime).sort(),
      ["contracts", "importer", "license_provenance", "schema_version"]);
    const result = run(home, "install");
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(runtimeFiles(home), expectedRuntimeFiles);
    const installed = JSON.parse(fs.readFileSync(
      path.join(home, "hooks", "planning-with-files", "installed-manifest.json"),
      "utf8",
    ));
    assert.deepEqual(installed.runtime_files.map(item => item.path).sort(),
      expectedRuntimeFiles.filter(item => item !== "installed-manifest.json").sort());
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test("managed install is merge-preserving, idempotent, diagnosable and uninstallable", () => {
  const home = fixture();
  const pristineCatchup = fs.readFileSync(path.join(skill, "scripts", "session-catchup.py"));
  const unmanaged = snapshot([path.join(home, "config.toml"), path.join(home, "hooks.json")]);
  let result = run(home, "install"); assert.equal(result.status, 0, result.stderr); assert.equal(result.json.action, "install"); assert.equal(result.json.healthy, true);
  assertSnapshot(unmanaged);
  assert.deepEqual(fs.readFileSync(path.join(skill, "scripts", "session-catchup.py")), pristineCatchup);
  assert.deepEqual(runtimeFiles(home), expectedRuntimeFiles);
  const installedManifest = JSON.parse(fs.readFileSync(path.join(home, "hooks", "planning-with-files", "installed-manifest.json"), "utf8"));
  assert.deepEqual(installedManifest.runtime_files.map(item => item.path).sort(), expectedRuntimeFiles.filter(item => item !== "installed-manifest.json").sort());
  const requirementsPath = path.join(home, "etc", "codex", "requirements.toml");
  let requirements = fs.readFileSync(requirementsPath, "utf8");
  assert.match(requirements, /enforce_residency = "us"/); assert.match(requirements, /browser_use = false/); assert.match(requirements, /command = "\\\/usr\\\/bin\\\/keep"|command = "\/usr\/bin\/keep"/);
  assert.match(requirements, /hooks = true/); assert.equal((requirements.match(/hook_adapter\.py/g) || []).length, 2);
  assert.doesNotMatch(requirements, /owned-catchup\.py/);
  assert.doesNotMatch(requirements, /owned-plan\.py/);
  result = run(home, "install"); assert.equal(result.status, 0, result.stderr);
  requirements = fs.readFileSync(requirementsPath, "utf8"); assert.equal((requirements.match(/hook_adapter\.py/g) || []).length, 2);
  result = run(home, "doctor"); assert.equal(result.status, 0, result.stderr); assert.equal(result.json.healthy, true);
  result = run(home, "uninstall"); assert.equal(result.status, 0, result.stderr);
  assertSnapshot(unmanaged);
  requirements = fs.readFileSync(requirementsPath, "utf8");
  assert.match(requirements, /command = "\/usr\/bin\/keep"/); assert.doesNotMatch(requirements, /hook_adapter\.py/);
  assert.equal(fs.existsSync(path.join(home, "hooks", "planning-with-files")), false);
});

test("managed TOML ownership preserves unrelated array tables and rejects ambiguous marked state", () => {
  const home = fixture();
  try {
    const installer = require(cli);
    const paths = installer.pathsFor(home, path.join(home, "etc", "codex", "requirements.toml"));
    const base = fs.readFileSync(paths.requirements, "utf8");
    const managed = installer.managedRequirements(base, paths);
    assert.match(managed, /# BEGIN pwf-codex-cloud-hooks managed requirements/);
    assert.match(managed, /# END pwf-codex-cloud-hooks managed requirements/);

    const admin = '[[permissions.audit]]\nname = "administrator-owned-rule"\nnetwork = "deny"\n';
    const withAdmin = `${managed.trimEnd()}\n${admin}`;
    const unowned = installer.removeOwnedRequirements(withAdmin);
    assert.match(unowned, /administrator-owned-rule/);
    assert.doesNotMatch(unowned, /hook_adapter\.py/);

    const ambiguous = managed.replace(
      "# END pwf-codex-cloud-hooks managed requirements",
      "unknown = true\n# END pwf-codex-cloud-hooks managed requirements",
    );
    assert.throws(
      () => installer.removeOwnedRequirements(ambiguous),
      /BLOCKED_AMBIGUOUS_MANAGED_REQUIREMENTS/,
    );

    const quotedAdmin = '  # administrator comment\r\n[["permissions.audit"]]\r\nname = "quoted-admin"\r\n';
    const preserved = installer.removeOwnedRequirements(`${managed.trimEnd()}\n${quotedAdmin}`);
    assert.ok(preserved.includes(quotedAdmin));
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test("unmarked owned requirements fail closed without migration", () => {
  const home = fixture();
  try {
    const installer = require(cli);
    const paths = installer.pathsFor(home, path.join(home, "etc", "codex", "requirements.toml"));
    const managed = installer.managedRequirements(fs.readFileSync(paths.requirements, "utf8"), paths);
    const legacy = managed
      .replace(/^# BEGIN pwf-codex-cloud-hooks managed requirements\r?\n/m, "")
      .replace(/^# END pwf-codex-cloud-hooks managed requirements\r?\n?/m, "");

    assert.throws(
      () => installer.removeOwnedRequirements(legacy),
      /unmarked owned handlers are unsupported/,
    );

    const collision = '[[hooks.Stop]]\n[[hooks.Stop.hooks]]\ntype = "command"\ncommand = "/tmp/hooks/planning-with-files/hook_adapter.py Stop"\n';
    assert.throws(
      () => installer.removeOwnedRequirements(collision),
      /unmarked owned handlers are unsupported/,
    );
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test("real install recomputes shared requirements after acquiring its lock", () => {
  const home = fixture();
  const requirements = path.join(home, "etc", "codex", "requirements.toml");
  const installer = require(cli);
  try {
    installer.setTestHooks({
      afterAcquire({ operation }) {
        if (operation === "install") {
          fs.appendFileSync(requirements, '\n[[permissions.audit]]\nname = "lock-held-admin-write"\n');
        }
      },
    });
    const result = installer.install(directOptions(home));
    assert.equal(result.healthy, true);
    assert.match(fs.readFileSync(requirements, "utf8"), /lock-held-admin-write/);
  } finally {
    installer.setTestHooks(null);
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test("real install aborts rather than overwriting requirements changed before rename", () => {
  const home = fixture();
  const requirements = path.join(home, "etc", "codex", "requirements.toml");
  const initial = fs.readFileSync(requirements);
  const installer = require(cli);
  let injected = false;
  try {
    installer.setTestHooks({
      beforeAtomicReplace({ file }) {
        if (!injected && file === requirements) {
          injected = true;
          fs.appendFileSync(requirements, '\n[[permissions.audit]]\nname = "pre-rename-admin-write"\n');
        }
      },
    });
    assert.throws(() => installer.install(directOptions(home)), /BLOCKED_CONCURRENT_DRIFT/);
    assert.match(fs.readFileSync(requirements, "utf8"), /pre-rename-admin-write/);
    const backups = path.join(home, "backups", "planning-with-files-hooks");
    const entries = fs.readdirSync(backups);
    assert.equal(entries.length, 1);
    assert.deepEqual(fs.readFileSync(path.join(backups, entries[0], "system-requirements.toml")), initial);
    assert.equal(fs.existsSync(path.join(home, ".pwf-codex-cloud-hooks.lock")), false);
  } finally {
    installer.setTestHooks(null);
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test("installed runtime permissions are cross-user readable on the Linux target", { skip: process.platform === "win32" }, () => {
  const home = fixture();
  try {
    const result = run(home, "install"); assert.equal(result.status, 0, result.stderr);
    const runtime = path.join(home, "hooks", "planning-with-files");
    assert.equal(fs.statSync(runtime).mode & 0o777, 0o755);
    assert.equal(fs.statSync(path.join(runtime, "upstream")).mode & 0o777, 0o755);
    assert.equal(fs.statSync(path.join(runtime, "hook_adapter.py")).mode & 0o777, 0o755);
    assert.equal(fs.statSync(path.join(runtime, "owned-catchup.py")).mode & 0o777, 0o755);
    assert.equal(fs.statSync(path.join(runtime, "owned-plan.py")).mode & 0o777, 0o755);
    assert.equal(fs.statSync(path.join(runtime, "contracts", "adapter-plan-context-request-v1.schema.json")).mode & 0o777, 0o644);
    assert.equal(fs.statSync(path.join(runtime, "contracts", "plan-context-result-v1.schema.json")).mode & 0o777, 0o644);
    assert.equal(fs.statSync(path.join(runtime, "upstream", "session-catchup.py")).mode & 0o777, 0o755);
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test("repair fixes only owned adapter and managed definition drift", () => {
  const home = fixture(), adapter = path.join(home, "hooks", "planning-with-files", "hook_adapter.py"), requirements = path.join(home, "etc", "codex", "requirements.toml");
  let result = run(home, "install"); assert.equal(result.status, 0, result.stderr);

  fs.appendFileSync(adapter, "# drift\n");
  result = run(home, "doctor"); assert.equal(result.status, 1); assert.equal(result.json.repairable, true); assert.match(result.json.errors.join(" "), /adapter hash drift/);
  result = run(home, "install", "--repair"); assert.equal(result.status, 0, result.stderr); assert.equal(result.json.action, "repair");

  const ownedCatchup = path.join(home, "hooks", "planning-with-files", "owned-catchup.py");
  fs.appendFileSync(ownedCatchup, "# drift\n");
  result = run(home, "doctor"); assert.equal(result.status, 1); assert.equal(result.json.repairable, true); assert.match(result.json.errors.join(" "), /owned_catchup hash drift/);
  result = run(home, "install", "--repair"); assert.equal(result.status, 0, result.stderr);

  const ownedPlan = path.join(home, "hooks", "planning-with-files", "owned-plan.py");
  fs.appendFileSync(ownedPlan, "# drift\n");
  result = run(home, "doctor"); assert.equal(result.status, 1); assert.equal(result.json.repairable, true); assert.match(result.json.errors.join(" "), /owned_plan hash drift/);
  result = run(home, "install", "--repair"); assert.equal(result.status, 0, result.stderr);

  const catchup = path.join(home, "hooks", "planning-with-files", "upstream", "session-catchup.py");
  fs.appendFileSync(catchup, "# drift\n");
  result = run(home, "doctor"); assert.equal(result.status, 1); assert.equal(result.json.repairable, true); assert.match(result.json.errors.join(" "), /session_catchup hash drift/);
  result = run(home, "install", "--repair"); assert.equal(result.status, 0, result.stderr);

  fs.rmSync(catchup);
  result = run(home, "doctor"); assert.equal(result.status, 1); assert.equal(result.json.repairable, true); assert.match(result.json.errors.join(" "), /session_catchup missing/);
  result = run(home, "install", "--repair"); assert.equal(result.status, 0, result.stderr);

  fs.rmSync(adapter);
  result = run(home, "doctor"); assert.equal(result.status, 1); assert.equal(result.json.repairable, true); assert.match(result.json.errors.join(" "), /adapter missing/);
  result = run(home, "install", "--repair"); assert.equal(result.status, 0, result.stderr);

  fs.writeFileSync(requirements, fs.readFileSync(requirements, "utf8").replace('statusMessage = "Refreshing planning context"', 'statusMessage = "changed"'));
  result = run(home, "doctor"); assert.equal(result.status, 1); assert.equal(result.json.repairable, true); assert.match(result.json.errors.join(" "), /owned managed requirements drift/);
  result = run(home, "install", "--repair"); assert.equal(result.status, 0, result.stderr);
  assert.match(fs.readFileSync(requirements, "utf8"), /statusMessage = "Refreshing planning context"/);
  fs.rmSync(home, { recursive: true, force: true });
});

test("repair fails closed for unowned requirements, manifest, and runtime drift", () => {
  const home = fixture(), requirements = path.join(home, "etc", "codex", "requirements.toml"), manifest = path.join(home, "hooks", "planning-with-files", "installed-manifest.json"), runtime = path.dirname(manifest);
  let result = run(home, "install"); assert.equal(result.status, 0, result.stderr);

  const installedRequirements = fs.readFileSync(requirements, "utf8");
  fs.appendFileSync(requirements, '\n[permissions.audit]\nnetwork = "deny"\n');
  result = run(home, "doctor"); assert.equal(result.status, 1); assert.equal(result.json.repairable, false); assert.match(result.json.blockers.join(" "), /unowned managed requirements drift/);
  result = run(home, "install", "--repair"); assert.equal(result.status, 1); assert.match(result.stderr, /REPAIR_BLOCKED_UNKNOWN_DRIFT/);

  fs.writeFileSync(requirements, installedRequirements);
  result = run(home, "doctor"); assert.equal(result.status, 0, result.stderr);
  const changedManifest = JSON.parse(fs.readFileSync(manifest, "utf8")); changedManifest.runtime_files[0].sha256 = "0".repeat(64); fs.writeFileSync(manifest, JSON.stringify(changedManifest));
  result = run(home, "doctor"); assert.equal(result.status, 1); assert.equal(result.json.repairable, false); assert.match(result.json.blockers.join(" "), /manifest runtime inventory mismatch/);
  result = run(home, "install", "--repair"); assert.equal(result.status, 1); assert.match(result.stderr, /REPAIR_BLOCKED_UNKNOWN_DRIFT/);

  result = run(home, "install"); assert.equal(result.status, 0, result.stderr); fs.writeFileSync(path.join(runtime, "unknown.sh"), "exit 0\n");
  result = run(home, "doctor"); assert.equal(result.status, 1); assert.equal(result.json.repairable, false); assert.match(result.json.blockers.join(" "), /unknown runtime entries/);
  result = run(home, "install"); assert.equal(result.status, 1); assert.match(result.stderr, /BLOCKED_UNKNOWN_RUNTIME/);
  fs.rmSync(path.join(runtime, "unknown.sh")); fs.mkdirSync(path.join(runtime, "unknown-directory"));
  result = run(home, "doctor"); assert.equal(result.status, 1); assert.equal(result.json.repairable, false); assert.match(result.json.blockers.join(" "), /unknown-directory/);
  fs.rmSync(home, { recursive: true, force: true });
});

test("doctor and repair preserve third-party array drift and report ambiguous owned state as a blocker", () => {
  const home = fixture(), requirements = path.join(home, "etc", "codex", "requirements.toml");
  try {
    let result = run(home, "install");
    assert.equal(result.status, 0, result.stderr);
    const installed = fs.readFileSync(requirements, "utf8");
    const admin = '\n[[permissions.audit]]\nname = "administrator-owned-rule"\nnetwork = "deny"\n';
    fs.writeFileSync(requirements, installed + admin);
    const drifted = fs.readFileSync(requirements);

    result = run(home, "doctor");
    assert.equal(result.status, 1);
    assert.equal(result.json.repairable, false);
    assert.match(result.json.blockers.join(" "), /unowned managed requirements drift/);
    result = run(home, "install", "--repair");
    assert.equal(result.status, 1);
    assert.match(result.stderr, /REPAIR_BLOCKED_UNKNOWN_DRIFT/);
    assert.deepEqual(fs.readFileSync(requirements), drifted);

    fs.writeFileSync(requirements, installed.replace(
      "# END pwf-codex-cloud-hooks managed requirements",
      "unknown = true\n# END pwf-codex-cloud-hooks managed requirements",
    ));
    result = run(home, "doctor");
    assert.equal(result.status, 1);
    assert.equal(result.json.repairable, false);
    assert.match(result.json.blockers.join(" "), /BLOCKED_AMBIGUOUS_MANAGED_REQUIREMENTS/);
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test("installation backup can restore every pre-existing managed file byte-for-byte", () => {
  const home = fixture(), requirements = path.join(home, "etc", "codex", "requirements.toml"), runtime = path.join(home, "hooks", "planning-with-files");
  fs.mkdirSync(runtime, { recursive: true });
  fs.writeFileSync(path.join(runtime, "hook_adapter.py"), "# previous adapter\n");
  fs.writeFileSync(path.join(runtime, "installed-manifest.json"), '{"schema_version":3,"owner":"pwf-codex-cloud-hooks"}\n');
  const unmanaged = snapshot([path.join(home, "config.toml"), path.join(home, "hooks.json")]);
  const files = [requirements, path.join(runtime, "hook_adapter.py"), path.join(runtime, "installed-manifest.json")];
  const before = snapshot(files);
  const result = run(home, "install"); assert.equal(result.status, 0, result.stderr);
  assertSnapshot(unmanaged);
  assert.equal(fs.existsSync(path.join(result.json.backup, "config.toml")), false);
  assert.equal(fs.existsSync(path.join(result.json.backup, "hooks.json")), false);

  fs.rmSync(runtime, { recursive: true, force: true }); fs.mkdirSync(runtime, { recursive: true });
  fs.copyFileSync(path.join(result.json.backup, "system-requirements.toml"), requirements);
  fs.cpSync(path.join(result.json.backup, "hooks", "planning-with-files"), runtime, { recursive: true });
  assertSnapshot(before);
  assertSnapshot(unmanaged);
  fs.rmSync(home, { recursive: true, force: true });
});
