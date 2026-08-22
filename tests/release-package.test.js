"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const builder = path.join(root, "tools", "build_release.py");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "upstream-manifest.json"), "utf8"));
const contract = path.join(root, manifest.managed_runtime.contracts.release_artifact.path);
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const sha256 = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const release032ZipSha256 = "b42aecafaba650e5595acef8c138d142747da38dde04fa78bfb0a7f4235e5081";
const release033ZipSha256 = "2b2dca5c5894a2297a6f2ccc5fb190878c3c920b71148719a4873326b4ccb352";

function run(command, archive, contractPath = contract, builderPath = builder, cwd = root) {
  const flag = command === "build" ? "--output" : "--archive";
  return spawnSync(python, [builderPath, command, "--contract", contractPath, flag, archive], {
    cwd,
    encoding: "utf8",
  });
}

function extractZip(archive, destination) {
  const script = [
    "import pathlib, stat, sys, zipfile",
    "destination = pathlib.Path(sys.argv[2])",
    "destination.mkdir(parents=True, exist_ok=True)",
    "with zipfile.ZipFile(sys.argv[1]) as package:",
    "    package.extractall(destination)",
    "    for info in package.infolist():",
    "        if info.is_dir():",
    "            continue",
    "        mode = stat.S_IMODE(info.external_attr >> 16)",
    "        if mode:",
    "            (destination / info.filename).chmod(mode)",
  ].join("\n");
  const result = spawnSync(
    python,
    ["-c", script, archive, destination],
    { encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
}

test("current candidate ZIP is deterministic, self-contained, and bound to its external bootstrap", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-candidate-"));
  const first = path.join(workspace, "first.zip"), second = path.join(workspace, "second.zip");
  try {
    const artifact = JSON.parse(fs.readFileSync(contract, "utf8"));
    const packageMetadata = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    const candidate = `v${packageMetadata.version}`;
    const expectedBootstrap = `init-cloud-sandbox-${candidate}.bash`;
    let result = run("build", first); assert.equal(result.status, 0, result.stderr);
    const firstResult = JSON.parse(result.stdout);
    result = run("build", second); assert.equal(result.status, 0, result.stderr);
    const secondResult = JSON.parse(result.stdout);
    assert.equal(sha256(first), sha256(second));
    assert.equal(firstResult.sha256, secondResult.sha256);
    assert.notEqual(firstResult.sha256, release033ZipSha256);
    assert.notEqual(firstResult.sha256, release032ZipSha256);
    assert.equal(firstResult.entries, artifact.entries.length);
    assert.ok(firstResult.size > 0);
    result = run("check", first); assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).healthy, true);

    assert.equal(artifact.package_name, packageMetadata.name);
    assert.equal(artifact.package_version, packageMetadata.version);
    assert.equal(artifact.entries.some(entry => entry.path === "tools/build_release.py"), true);
    assert.equal(artifact.entries.some(entry => entry.path === "tools/import_upstream_runtime.py"), true);
    assert.equal(artifact.entries.some(entry => entry.path === "patches/patch_planning_skill.py"), false);
    assert.equal(artifact.entries.some(entry => entry.path === "contracts/compatibility-overlays-v1.json"), false);
    assert.equal(artifact.entries.some(entry => entry.path.startsWith("init-cloud-sandbox-")), false);
    assert.deepEqual(artifact.external_release_assets, [expectedBootstrap]);
    assert.ok(artifact.entries.every(entry => ["0644", "0755"].includes(entry.mode)));
    const bootstrap = fs.readFileSync(path.join(root, expectedBootstrap), "utf8");
    const acceptance = fs.readFileSync(
      path.join(root, "docs", `${candidate}-cloud-hard-acceptance.md`), "utf8",
    );
    assert.equal(bootstrap.includes(`HOOKS_VERSION="\${HOOKS_VERSION:-${candidate}}"`), true);
    assert.match(bootstrap, /keeptoy\/pwf-codex-cloud-hooks-next\/releases\/download/);
    const hooksSha = bootstrap.match(/HOOKS_SHA256="\$\{HOOKS_SHA256:-([a-f0-9]{64})\}"/);
    assert.ok(hooksSha, "bootstrap lacks a pinned default ZIP SHA-256");
    const roadmap = fs.readFileSync(path.join(root, "ROADMAP.md"), "utf8");
    const acceptedMatch = roadmap.match(/^\| 当前已接受版本 \| `(v\d+\.\d+\.\d+(?:-[A-Za-z0-9.]+)?)`/m);
    assert.ok(acceptedMatch, "ROADMAP lacks a parseable accepted baseline role");
    if (hooksSha[1] === "0".repeat(64)) {
      assert.notEqual(candidate, acceptedMatch[1], "accepted baseline bootstrap must pin the exact ZIP SHA-256");
    } else {
      assert.equal(hooksSha[1], firstResult.sha256);
    }
    if (/P9_B_LOCAL_SEAL_PASS \/ SEALED_SOURCE_CLOUD_PENDING/.test(acceptance)) {
      assert.notEqual(hooksSha[1], "0".repeat(64), "P9-B local seal cannot retain a placeholder checksum");
      assert.match(acceptance, new RegExp(firstResult.sha256));
      assert.match(acceptance, new RegExp(sha256(path.join(root, expectedBootstrap))));
      assert.match(acceptance, new RegExp(`${firstResult.entries} entries`));
      assert.match(acceptance.replaceAll(",", ""), new RegExp("`" + firstResult.size + "` bytes"));
    }
    const extracted = path.join(workspace, "extracted");
    extractZip(first, extracted);
    const packageRoot = path.join(extracted, artifact.archive_root.slice(0, -1));
    result = spawnSync(python, ["tools/import_upstream_runtime.py", "check"], {
      cwd: packageRoot,
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr);

    const releasePaths = [
      ...artifact.entries.map(entry => entry.path),
      ...artifact.external_release_assets,
    ];
    const attributes = spawnSync("git", ["check-attr", "eol", "--", ...releasePaths], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(attributes.status, 0, attributes.stderr);
    const eolByPath = new Map(attributes.stdout.trim().split(/\r?\n/).map(line => {
      const match = line.match(/^(.*): eol: (.*)$/);
      assert.ok(match, `unexpected git check-attr output: ${line}`);
      return [match[1].replaceAll("\\", "/"), match[2]];
    }));
    assert.deepEqual([...eolByPath.keys()].sort(), [...releasePaths].sort());
    for (const releasePath of releasePaths) assert.equal(eolByPath.get(releasePath), "lf", releasePath);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("Release builder rejects package and artifact candidate identity drift", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-identity-"));
  try {
    for (const [field, value, message] of [
      ["package_name", "different-package", /package name mismatch/],
      ["package_version", "9.9.9", /package version mismatch/],
    ]) {
      const artifact = JSON.parse(fs.readFileSync(contract, "utf8"));
      artifact[field] = value;
      const driftedContract = path.join(workspace, `${field}.json`);
      fs.writeFileSync(driftedContract, `${JSON.stringify(artifact, null, 2)}\n`);
      const result = run("build", path.join(workspace, `${field}.zip`), driftedContract);
      assert.equal(result.status, 1, result.stdout);
      assert.match(result.stderr, message);
    }
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});

test("Release builder rejects malformed v2 mode and boundary lists", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-release-v2-boundary-"));
  try {
    const cases = [
      [artifact => { artifact.entries[0].mode = "0777"; }, /artifact entry is not ready/],
      [artifact => { artifact.external_release_assets = "bootstrap.bash"; }, /external release assets must be a non-empty string list/],
      [artifact => { artifact.external_release_assets.push(artifact.external_release_assets[0]); }, /external release asset list contains duplicates/],
      [artifact => { artifact.excluded_prefixes = "docs/"; }, /excluded prefixes must be a string list/],
      [artifact => { artifact.excluded_prefixes.push(artifact.excluded_prefixes[0]); }, /excluded prefix list contains duplicates/],
    ];
    for (const [mutate, expected] of cases) {
      const artifact = JSON.parse(fs.readFileSync(contract, "utf8"));
      mutate(artifact);
      const driftedContract = path.join(workspace, `${crypto.randomUUID()}.json`);
      fs.writeFileSync(driftedContract, `${JSON.stringify(artifact, null, 2)}\n`);
      const result = run("build", path.join(workspace, `${crypto.randomUUID()}.zip`), driftedContract);
      assert.equal(result.status, 1, result.stdout);
      assert.match(result.stderr, expected);
    }
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});
