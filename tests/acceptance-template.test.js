const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const test = require("node:test");

const template = fs.readFileSync(path.resolve(__dirname, "..", "docs", "cloud-hard-acceptance-template.md"), "utf8");
const python = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");

function embeddedPython(marker) {
  const markerAt = template.indexOf(marker);
  assert.notEqual(markerAt, -1, `missing marker: ${marker}`);
  const start = template.indexOf("<<'PY'\n", markerAt);
  const end = template.indexOf("\nPY", start);
  assert.ok(start > markerAt && end > start, `missing embedded Python after: ${marker}`);
  return template.slice(start + "<<'PY'\n".length, end);
}

function git(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

function runOracle(script, root) {
  return spawnSync(python, ["-", root], { input: script, encoding: "utf8" });
}

test("Source deep-check worktree oracle accepts only the uncommitted canonical fixture", () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), "pwf-acceptance-oracle-"));
  const planId = "2026-08-13-pwf-cloud-acceptance-v1-a41c9e72";
  const plan = path.join(workspace, ".planning", planId);
  const oracle = embeddedPython('python3 - "$PACKAGE_ROOT"');
  try {
    git(workspace, ["init", "--quiet"]);
    git(workspace, ["config", "user.email", "acceptance@example.invalid"]);
    git(workspace, ["config", "user.name", "Acceptance Test"]);
    fs.mkdirSync(path.join(workspace, ".planning"), { recursive: true });
    fs.writeFileSync(path.join(workspace, ".planning", ".active_plan"), "baseline\n");
    git(workspace, ["add", ".planning/.active_plan"]);
    git(workspace, ["commit", "--quiet", "-m", "baseline"]);

    fs.mkdirSync(plan);
    fs.writeFileSync(path.join(workspace, ".planning", ".active_plan"), `${planId}\n`);
    fs.writeFileSync(path.join(plan, "task_plan.md"), [
      "# PWF_CLOUD_ACCEPTANCE_CANONICAL_V1",
      "PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_COMPLETED_V1",
      "PWF_CLOUD_ACCEPTANCE_MARKERLESS_LEGACY_ACTIVE_V1",
      "",
    ].join("\n"));
    fs.writeFileSync(path.join(plan, "progress.md"), "fixture\n");
    fs.writeFileSync(path.join(plan, "findings.md"), "fixture\n");

    let result = runOracle(oracle, workspace);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /PWF_CANONICAL_WORKTREE=EXACT_FIXTURE_ONLY/);
    assert.match(result.stdout, new RegExp(`PWF_CANONICAL_PLAN_ID=${planId}`));

    fs.writeFileSync(path.join(workspace, "unexpected-product-change"), "reject\n");
    result = runOracle(oracle, workspace);
    assert.notEqual(result.status, 0, "oracle accepted an extra repository write");
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
  }
});
