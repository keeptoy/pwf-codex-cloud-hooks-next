#!/usr/bin/env python3
"""Emit a read-only Phase 5.3 G2 Release-risk advisory for two explicit commits."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
from typing import NoReturn


ROOT = Path(__file__).resolve().parents[1]
POLICY_RELATIVE = "tools/release-risk-policy-v1.json"
RELEASE_AUTHORITY = "contracts/release-artifact-v2.json"
PACKAGE_IDENTITY = "package.json"
INSTALLED_TRANSITION = "contracts/installed-state-transition-v1.json"
UPSTREAM_MANIFEST = "upstream-manifest.json"
BOOTSTRAP_TEMPLATE = "tools/templates/init-cloud-sandbox.bash.in"
ZERO_SHA256 = "0" * 64
RESULT_TYPE = "PWF_RELEASE_RISK_ADVISORY_V2"
ERROR_TYPE = "PWF_RELEASE_RISK_ADVISORY_ERROR_V2"
LANE_PRIORITY = {
    "NO_RELEASE_REQUIRED": 0,
    "SOURCE_ONLY_GOVERNANCE": 1,
    "PACKAGE_DOC_ONLY": 2,
    "RELEASE_MECHANICS": 3,
    "PRODUCT_OR_SECURITY": 4,
}
SAFE_MODES = {"000000": "absent", "100644": "regular", "100755": "regular"}
KNOWN_MODES = {**SAFE_MODES, "120000": "symlink", "160000": "gitlink"}
VERSION_PATTERN = re.compile(r"[0-9]+\.[0-9]+\.[0-9]+(?:-[A-Za-z0-9.-]+)?\Z")
SHA256_PATTERN = re.compile(r"[a-f0-9]{64}\Z")
INSTALLED_MANIFEST_KEYS = [
    "adapter_sha256", "events", "installer_version", "owner", "requirements_file",
    "requirements_sha256", "runtime_files", "schema_version", "skill_root",
    "unowned_requirements_sha256", "upstream",
]


class AdvisoryError(ValueError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def safe_path(value: object) -> str:
    if not isinstance(value, str) or not value or "\\" in value or "\x00" in value:
        raise AdvisoryError("INVALID_EVIDENCE", f"unsafe repository path: {value!r}")
    candidate = PurePosixPath(value)
    if candidate.is_absolute() or any(part in ("", ".", "..") for part in candidate.parts):
        raise AdvisoryError("INVALID_EVIDENCE", f"unsafe repository path: {value!r}")
    return candidate.as_posix()


def git_bytes(arguments: list[str], *, code: str = "GIT_EVIDENCE_ERROR") -> bytes:
    result = subprocess.run(
        ["git", *arguments], cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False,
    )
    if result.returncode != 0:
        diagnostic = result.stderr.decode("utf-8", errors="replace").strip()
        raise AdvisoryError(code, diagnostic or f"git {' '.join(arguments)} failed")
    return result.stdout


def resolve_commit(value: str) -> str:
    if not value or "\x00" in value:
        raise AdvisoryError("INVALID_ENDPOINT", "base/head must be non-empty Git commit-ish values")
    resolved = git_bytes(
        ["rev-parse", "--verify", "--end-of-options", f"{value}^{{commit}}"], code="INVALID_ENDPOINT",
    ).decode("ascii", errors="strict").strip()
    if len(resolved) != 40 or any(character not in "0123456789abcdef" for character in resolved):
        raise AdvisoryError("INVALID_ENDPOINT", f"Git endpoint did not resolve to an exact commit: {value!r}")
    return resolved


def validate_string_list(value: object, label: str, *, prefixes: bool = False) -> list[str]:
    if not isinstance(value, list) or any(not isinstance(item, str) for item in value):
        raise AdvisoryError("INVALID_POLICY", f"{label} must be a string list")
    normalized = [safe_path(item[:-1]) + "/" if prefixes and item.endswith("/") else safe_path(item) for item in value]
    if prefixes and any(not item.endswith("/") for item in value):
        raise AdvisoryError("INVALID_POLICY", f"{label} entries must end with slash")
    if len(normalized) != len(set(normalized)):
        raise AdvisoryError("INVALID_POLICY", f"{label} contains duplicates")
    return normalized


def load_policy() -> tuple[dict, bytes]:
    path = ROOT / POLICY_RELATIVE
    raw = path.read_bytes()
    policy = json.loads(raw.decode("utf-8"))
    if not isinstance(policy, dict) or set(policy) != {
        "schema_version", "policy_id", "classifier_paths", "package_document_paths", "rules",
    }:
        raise AdvisoryError("INVALID_POLICY", "unsupported Release-risk policy fields")
    if policy.get("schema_version") != 1 or policy.get("policy_id") != "PWF_RELEASE_RISK_POLICY_V1":
        raise AdvisoryError("INVALID_POLICY", "unsupported Release-risk policy identity")
    classifier_paths = validate_string_list(policy.get("classifier_paths"), "classifier_paths")
    if classifier_paths != ["tools/classify_release_risk.py", POLICY_RELATIVE]:
        raise AdvisoryError("INVALID_POLICY", "classifier self-protection paths are not exact")
    package_documents = validate_string_list(policy.get("package_document_paths"), "package_document_paths")
    rules = policy.get("rules")
    if not isinstance(rules, list) or not rules:
        raise AdvisoryError("INVALID_POLICY", "policy rules must be a non-empty list")
    rule_ids: list[str] = []
    for rule in rules:
        if not isinstance(rule, dict) or set(rule) != {"id", "lane", "exact_paths", "prefixes"}:
            raise AdvisoryError("INVALID_POLICY", "policy rule fields are not exact")
        rule_id = rule.get("id")
        if not isinstance(rule_id, str) or not rule_id or rule_id in rule_ids:
            raise AdvisoryError("INVALID_POLICY", "policy rule IDs must be unique non-empty strings")
        if rule.get("lane") not in LANE_PRIORITY:
            raise AdvisoryError("INVALID_POLICY", f"unsupported policy lane: {rule.get('lane')!r}")
        rule["exact_paths"] = validate_string_list(rule.get("exact_paths"), f"{rule_id}.exact_paths")
        rule["prefixes"] = validate_string_list(rule.get("prefixes"), f"{rule_id}.prefixes", prefixes=True)
        rule_ids.append(rule_id)
    policy["classifier_paths"] = classifier_paths
    policy["package_document_paths"] = package_documents
    return policy, raw


def git_show(commit: str, relative: str, *, code: str = "INVALID_IDENTITY_EVIDENCE") -> bytes:
    return git_bytes(["show", f"{commit}:{relative}"], code=code)


def git_path_exists(commit: str, relative: str) -> bool:
    result = subprocess.run(
        ["git", "cat-file", "-e", f"{commit}:{relative}"], cwd=ROOT,
        stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, check=False,
    )
    if result.returncode == 0:
        return True
    if result.returncode in {1, 128}:
        return False
    diagnostic = result.stderr.decode("utf-8", errors="replace").strip()
    raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", diagnostic or "unable to inspect Git path")


def git_regular_mode(commit: str, relative: str) -> str:
    raw = git_bytes(["ls-tree", "-z", commit, "--", relative], code="INVALID_IDENTITY_EVIDENCE")
    records = [record for record in raw.split(b"\0") if record]
    if len(records) != 1 or b"\t" not in records[0]:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"missing or ambiguous Git identity path: {relative}")
    metadata, encoded_path = records[0].split(b"\t", 1)
    fields = metadata.decode("ascii", errors="strict").split()
    actual_path = encoded_path.decode("utf-8", errors="strict")
    if len(fields) != 3 or fields[1] != "blob" or actual_path != relative or fields[0] not in {"100644", "100755"}:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"unsafe Git identity object: {relative}")
    return fields[0]


def exact_object(value: object, keys: set[str], label: str) -> dict:
    if not isinstance(value, dict) or set(value) != keys:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"{label} fields are not exact")
    return value


def load_json_blob(commit: str, relative: str, label: str) -> tuple[dict, bytes]:
    git_regular_mode(commit, relative)
    raw = git_show(commit, relative)
    value = json.loads(raw.decode("utf-8"))
    if not isinstance(value, dict):
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"{label} must be a JSON object")
    return value, raw


def load_release_authority(head: str) -> tuple[dict, set[str], set[str], bytes]:
    git_regular_mode(head, RELEASE_AUTHORITY)
    raw = git_show(head, RELEASE_AUTHORITY, code="INVALID_RELEASE_AUTHORITY")
    contract = json.loads(raw.decode("utf-8"))
    if not isinstance(contract, dict) or set(contract) != {
        "schema_version", "contract_id", "package_name", "package_version", "archive_root", "ordering",
        "timestamp", "compression", "entries", "external_release_assets", "excluded_prefixes",
    } or contract.get("schema_version") != 2 or contract.get("contract_id") != "PWF_RELEASE_ARTIFACT_V2":
        raise AdvisoryError("INVALID_RELEASE_AUTHORITY", "unsupported Release artifact authority")
    entries = contract.get("entries")
    if not isinstance(entries, list) or not entries:
        raise AdvisoryError("INVALID_RELEASE_AUTHORITY", "Release artifact entries are missing")
    release_paths: list[str] = []
    for entry in entries:
        if not isinstance(entry, dict) or set(entry) != {"path", "mode"} or entry.get("mode") not in {"0644", "0755"}:
            raise AdvisoryError("INVALID_RELEASE_AUTHORITY", "Release artifact entry is invalid")
        release_paths.append(safe_path(entry.get("path")))
    external = validate_string_list(contract.get("external_release_assets"), "external_release_assets")
    if len(release_paths) != len(set(release_paths)) or set(release_paths) & set(external):
        raise AdvisoryError("INVALID_RELEASE_AUTHORITY", "Release authority paths overlap or duplicate")
    return contract, set(release_paths), set(external), raw


def canonical_json(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def content_hash(value: object, label: str) -> str:
    if not isinstance(value, str) or not SHA256_PATTERN.fullmatch(value):
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"invalid SHA-256 for {label}")
    return value


def load_package(commit: str) -> tuple[dict, bytes, str]:
    package, raw = load_json_blob(commit, PACKAGE_IDENTITY, "package identity")
    version = package.get("version")
    if not isinstance(package.get("name"), str) or not package["name"]:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "package name is invalid")
    if not isinstance(version, str) or not VERSION_PATTERN.fullmatch(version):
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "package version is invalid")
    return package, raw, version


def reference_blob(commit: str, reference: object, label: str, *, expected_path: str | None = None) -> tuple[str, bytes]:
    value = exact_object(reference, {"path", "sha256"}, f"{label} reference")
    relative = safe_path(value.get("path"))
    if expected_path is not None and relative != expected_path:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"{label} path is not canonical")
    expected = content_hash(value.get("sha256"), label)
    git_regular_mode(commit, relative)
    raw = git_show(commit, relative)
    if sha256_bytes(raw) != expected:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"{label} SHA-256 mismatch")
    return relative, raw


def load_manifest_evidence(commit: str) -> dict:
    manifest, raw = load_json_blob(commit, UPSTREAM_MANIFEST, "upstream manifest")
    exact_object(manifest, {
        "schema_version", "upstream", "release", "commit", "release_archive_url",
        "release_archive_sha256", "required_skill_files", "managed_runtime",
    }, "upstream manifest")
    if manifest.get("schema_version") != 4:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "unsupported upstream manifest schema")
    managed = exact_object(manifest.get("managed_runtime"), {
        "schema_version", "contracts", "importer", "license_provenance",
    }, "managed runtime manifest")
    if managed.get("schema_version") != 3:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "unsupported managed runtime manifest schema")
    contracts = exact_object(managed.get("contracts"), {
        "runtime_bundle", "release_artifact", "installed_state_transition",
    }, "managed runtime contracts")
    _, bundle_raw = reference_blob(commit, contracts.get("runtime_bundle"), "runtime bundle",
                                   expected_path="contracts/runtime-bundle-v2.json")
    _, release_raw = reference_blob(commit, contracts.get("release_artifact"), "Release artifact",
                                    expected_path=RELEASE_AUTHORITY)
    _, transition_raw = reference_blob(commit, contracts.get("installed_state_transition"),
                                       "installed state transition", expected_path=INSTALLED_TRANSITION)
    reference_blob(commit, managed.get("importer"), "runtime importer")
    provenance = exact_object(managed.get("license_provenance"), {
        "spdx", "upstream_path", "upstream_sha256", "notice_path", "notice_sha256",
    }, "license provenance")
    notice_path = safe_path(provenance.get("notice_path"))
    notice_sha = content_hash(provenance.get("notice_sha256"), "third-party notice")
    git_regular_mode(commit, notice_path)
    if sha256_bytes(git_show(commit, notice_path)) != notice_sha:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "third-party notice SHA-256 mismatch")
    bundle = json.loads(bundle_raw.decode("utf-8"))
    return {
        "bundle": bundle,
        "bundle_raw": bundle_raw,
        "manifest": manifest,
        "notice_path": notice_path,
        "notice_sha256": notice_sha,
        "raw": raw,
        "release_raw": release_raw,
        "transition_raw": transition_raw,
    }


def below_installed_root(value: object, label: str) -> str:
    installed = safe_path(value)
    prefix = "hooks/planning-with-files/"
    if not installed.startswith(prefix) or installed == prefix:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"{label} escapes installed runtime root")
    return safe_path(installed[len(prefix):])


def runtime_inventory(commit: str, evidence: dict) -> tuple[list[dict], str]:
    bundle = exact_object(evidence["bundle"], {
        "schema_version", "contract_id", "upstream", "roots", "upstream_files", "local_files",
        "installed_contracts",
    }, "runtime bundle")
    if bundle.get("schema_version") != 2 or bundle.get("contract_id") != "PWF_MANAGED_RUNTIME_BUNDLE_V2":
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "unsupported runtime bundle")
    inventory: list[dict] = []
    adapter_sha = ""
    groups = [
        ("local_files", "sha256"),
        ("upstream_files", "pristine_sha256"),
        ("installed_contracts", "sha256"),
    ]
    seen_ids: set[str] = set()
    seen_paths: set[str] = set()
    for group, hash_key in groups:
        values = bundle.get(group)
        if not isinstance(values, list):
            raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"{group} must be a list")
        for item in values:
            if not isinstance(item, dict):
                raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"{group} entry must be an object")
            identifier = item.get("id")
            if not isinstance(identifier, str) or not re.fullmatch(r"[a-z][a-z0-9_]*", identifier):
                raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"invalid runtime ID in {group}")
            package_path = safe_path(item.get("package_path"))
            installed_path = below_installed_root(item.get("installed_path"), identifier)
            expected = content_hash(item.get(hash_key), identifier)
            mode = item.get("mode")
            if mode not in {"0644", "0755"}:
                raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"invalid runtime mode for {identifier}")
            if identifier in seen_ids or installed_path in seen_paths:
                raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "duplicate runtime inventory identity")
            git_regular_mode(commit, package_path)
            if sha256_bytes(git_show(commit, package_path)) != expected:
                raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", f"runtime content hash mismatch for {identifier}")
            inventory.append({"id": identifier, "path": installed_path, "sha256": expected, "mode": mode})
            seen_ids.add(identifier)
            seen_paths.add(installed_path)
            if identifier == "adapter":
                adapter_sha = expected
    notice = {"id": "third_party_notices", "path": "THIRD_PARTY_NOTICES.md",
              "sha256": evidence["notice_sha256"], "mode": "0644"}
    if notice["id"] in seen_ids or notice["path"] in seen_paths:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "duplicate notice runtime identity")
    inventory.append(notice)
    if not adapter_sha:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "runtime adapter identity is missing")
    return inventory, adapter_sha


def render_transition(package_version: str, upstream: dict, adapter_sha: str, inventory: list[dict]) -> bytes:
    quote = lambda value: json.dumps(value, ensure_ascii=False)
    lines = [
        "{",
        '  "schema_version": 1,',
        '  "contract_id": "PWF_INSTALLED_STATE_TRANSITION_V1",',
        '  "predecessor": {',
        f'    "package_version": {quote(package_version)},',
        '    "installed_manifest_schema": 3,',
        '    "owner": "pwf-codex-cloud-hooks",',
        f'    "manifest_keys": [{", ".join(quote(value) for value in INSTALLED_MANIFEST_KEYS)}],',
        f'    "upstream_canonical_sha256": {quote(sha256_bytes(canonical_json(upstream).encode("utf-8")))},',
        f'    "adapter_sha256": {quote(adapter_sha)},',
        '    "events": ["SessionStart", "UserPromptSubmit"],',
        '    "runtime_files": [',
    ]
    for index, item in enumerate(inventory):
        rendered = (
            f'{{ "id": {quote(item["id"])}, "path": {quote(item["path"])}, '
            f'"sha256": {quote(item["sha256"])}, "mode": {quote(item["mode"])} }}'
        )
        lines.append(f"      {rendered}{',' if index + 1 < len(inventory) else ''}")
    lines.extend(["    ]", "  }", "}"])
    return ("\n".join(lines) + "\n").encode("utf-8")


def replace_once(raw: bytes, old: bytes, new: bytes) -> bytes | None:
    if not old or raw.count(old) != 1:
        return None
    return raw.replace(old, new)


def object_type(mode: str) -> str:
    return KNOWN_MODES.get(mode, "unknown")


def parse_raw_delta(base: str, head: str) -> list[dict]:
    raw = git_bytes([
        "-c", "core.quotepath=false", "diff-tree", "--no-commit-id", "--raw", "-z", "-r", "-M", base, head,
    ])
    tokens = raw.split(b"\0")
    if tokens and tokens[-1] == b"":
        tokens.pop()
    changes: list[dict] = []
    index = 0
    while index < len(tokens):
        header = tokens[index].decode("ascii", errors="strict")
        index += 1
        fields = header.split()
        if len(fields) != 5 or not fields[0].startswith(":"):
            raise AdvisoryError("INVALID_EVIDENCE", f"unexpected Git raw-diff header: {header!r}")
        old_mode, new_mode = fields[0][1:], fields[1]
        status_token = fields[4]
        status = status_token[:1]
        if status not in {"A", "C", "D", "M", "R", "T"}:
            raise AdvisoryError("INVALID_EVIDENCE", f"unsupported Git delta status: {status_token!r}")
        score = int(status_token[1:]) if status_token[1:].isdigit() else None
        path_count = 2 if status in {"C", "R"} else 1
        if index + path_count > len(tokens):
            raise AdvisoryError("INVALID_EVIDENCE", "Git raw-diff path list is truncated")
        paths = [safe_path(tokens[index + offset].decode("utf-8", errors="strict")) for offset in range(path_count)]
        index += path_count
        old_path = None if status == "A" else paths[0]
        new_path = None if status == "D" else paths[-1]
        changes.append({
            "new_mode": new_mode,
            "new_path": new_path,
            "new_type": object_type(new_mode),
            "old_mode": old_mode,
            "old_path": old_path,
            "old_type": object_type(old_mode),
            "score": score,
            "status": status,
        })
    return sorted(changes, key=lambda item: ((item["new_path"] or item["old_path"] or "").encode("utf-8"), item["status"]))


def exact_delta(changes: list[dict], path: str, status: str, old_mode: str, new_mode: str) -> bool:
    matches = [change for change in changes if path in {change["old_path"], change["new_path"]}]
    return len(matches) == 1 and matches[0]["status"] == status and matches[0]["old_path"] == (
        None if status == "A" else path
    ) and matches[0]["new_path"] == (None if status == "D" else path) and matches[0]["old_mode"] == old_mode \
        and matches[0]["new_mode"] == new_mode


def json_field_token(name: str, value: str) -> bytes:
    return f'{json.dumps(name)}: {json.dumps(value, ensure_ascii=False)}'.encode("utf-8")


def bootstrap_bytes(base: str, head: str, base_asset: str, target_version: str) -> tuple[bytes, str]:
    if git_path_exists(head, BOOTSTRAP_TEMPLATE):
        git_regular_mode(head, BOOTSTRAP_TEMPLATE)
        template = git_show(head, BOOTSTRAP_TEMPLATE)
        if template.count(b"@HOOKS_VERSION@") != 1 or template.count(b"@HOOKS_SHA256@") != 1:
            raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "bootstrap template identity tokens are not exact")
        rendered = template.replace(b"@HOOKS_VERSION@", f"v{target_version}".encode("ascii"))
        rendered = rendered.replace(b"@HOOKS_SHA256@", ZERO_SHA256.encode("ascii"))
        return rendered, "head_template_v1"
    git_regular_mode(base, base_asset)
    base_bootstrap = git_show(base, base_asset)
    base_contract, _, _, _ = load_release_authority(base)
    base_version = base_contract.get("package_version")
    old_version = f"v{base_version}".encode("ascii")
    matches = re.findall(rb'HOOKS_SHA256="\$\{HOOKS_SHA256:-([a-f0-9]{64})\}"', base_bootstrap)
    if base_bootstrap.count(old_version) != 1 or len(matches) != 1 or base_bootstrap.count(matches[0]) != 1:
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "accepted bootstrap identity fields are not exact")
    if matches[0] == ZERO_SHA256.encode("ascii"):
        raise AdvisoryError("INVALID_IDENTITY_EVIDENCE", "accepted bootstrap ZIP hash is not sealed")
    rendered = base_bootstrap.replace(old_version, f"v{target_version}".encode("ascii"))
    rendered = rendered.replace(matches[0], ZERO_SHA256.encode("ascii"))
    return rendered, "accepted_bootstrap_identity_substitution_v1"


def empty_identity_closure() -> dict:
    return {
        "applicable": False,
        "base_version": None,
        "checks": [],
        "complete": False,
        "explained_paths": [],
        "renderer": None,
        "state": "not_applicable",
        "target_version": None,
        "unknowns": [],
    }


def verify_identity_closure(base: str, head: str, changes: list[dict], head_contract: dict,
                            head_authority_raw: bytes) -> tuple[dict, dict[str, str]]:
    if not any(PACKAGE_IDENTITY in {change["old_path"], change["new_path"]} for change in changes):
        return empty_identity_closure(), {}
    closure = empty_identity_closure()
    roles: dict[str, str] = {}
    checks: list[dict] = []
    unknowns: set[str] = set()
    fully_explained: set[str] = set()
    renderer: str | None = None

    def check(identifier: str, passed: bool, unknown: str) -> None:
        checks.append({"id": identifier, "status": "pass" if passed else "fail"})
        if not passed:
            unknowns.add(unknown)

    try:
        base_package, base_package_raw, base_version = load_package(base)
        head_package, head_package_raw, head_version = load_package(head)
        if base_version == head_version:
            return closure, {}
        closure.update({"applicable": True, "base_version": base_version, "target_version": head_version})
        base_contract, _, base_external, base_authority_raw = load_release_authority(base)
        expected_base_asset = f"init-cloud-sandbox-v{base_version}.bash"
        expected_head_asset = f"init-cloud-sandbox-v{head_version}.bash"
        roles = {
            PACKAGE_IDENTITY: "package_version",
            RELEASE_AUTHORITY: "release_contract_identity",
            INSTALLED_TRANSITION: "accepted_predecessor_snapshot",
            UPSTREAM_MANIFEST: "manifest_integrity_references",
            expected_head_asset: "candidate_bootstrap",
        }

        package_valid = (
            base_package.get("name") == head_package.get("name") == base_contract.get("package_name")
            == head_contract.get("package_name")
        )
        check("package_identity", package_valid, "package_identity_mismatch")
        release_valid = (
            base_contract.get("package_version") == base_version
            and head_contract.get("package_version") == head_version
            and base_external == {expected_base_asset}
            and set(head_contract.get("external_release_assets", [])) == {expected_head_asset}
            and len(head_contract.get("external_release_assets", [])) == 1
        )
        check("release_contract_identity", release_valid, "release_contract_identity_mismatch")

        required_deltas = [
            (PACKAGE_IDENTITY, "M", "100644", "100644"),
            (RELEASE_AUTHORITY, "M", "100644", "100644"),
            (INSTALLED_TRANSITION, "M", "100644", "100644"),
            (UPSTREAM_MANIFEST, "M", "100644", "100644"),
            (expected_head_asset, "A", "000000", "100644"),
        ]
        delta_valid = all(exact_delta(changes, *expected) for expected in required_deltas)
        check("identity_delta_shape", delta_valid, "identity_delta_shape_mismatch")
        check("candidate_not_in_base", not git_path_exists(base, expected_head_asset),
              "candidate_bootstrap_preexists_base")

        base_evidence = load_manifest_evidence(base)
        head_evidence = load_manifest_evidence(head)
        inventory, adapter_sha = runtime_inventory(base, base_evidence)
        expected_transition = render_transition(base_version, base_evidence["manifest"], adapter_sha, inventory)
        transition_valid = head_evidence["transition_raw"] == expected_transition
        check("accepted_predecessor_snapshot", transition_valid, "accepted_predecessor_bytes_mismatch")

        manifest_refs_valid = (
            head_evidence["release_raw"] == head_authority_raw
            and head_evidence["transition_raw"] == git_show(head, INSTALLED_TRANSITION)
        )
        check("manifest_integrity_references", manifest_refs_valid, "manifest_integrity_reference_mismatch")

        expected_bootstrap, renderer = bootstrap_bytes(base, head, expected_base_asset, head_version)
        actual_bootstrap = git_show(head, expected_head_asset)
        bootstrap_valid = actual_bootstrap == expected_bootstrap
        check("candidate_bootstrap", bootstrap_valid, "candidate_bootstrap_bytes_mismatch")

        expected_package_raw = replace_once(
            base_package_raw, json_field_token("version", base_version), json_field_token("version", head_version),
        )
        expected_release_raw = replace_once(
            base_authority_raw,
            json_field_token("package_version", base_version),
            json_field_token("package_version", head_version),
        )
        if expected_release_raw is not None:
            expected_release_raw = replace_once(
                expected_release_raw,
                json.dumps(expected_base_asset).encode("utf-8"),
                json.dumps(expected_head_asset).encode("utf-8"),
            )
        base_release_sha = sha256_bytes(base_evidence["release_raw"])
        head_release_sha = sha256_bytes(head_evidence["release_raw"])
        base_transition_sha = sha256_bytes(base_evidence["transition_raw"])
        head_transition_sha = sha256_bytes(head_evidence["transition_raw"])
        expected_manifest_raw = replace_once(
            base_evidence["raw"], base_release_sha.encode("ascii"), head_release_sha.encode("ascii"),
        )
        if expected_manifest_raw is not None:
            expected_manifest_raw = replace_once(
                expected_manifest_raw, base_transition_sha.encode("ascii"), head_transition_sha.encode("ascii"),
            )

        complete = all(item["status"] == "pass" for item in checks)
        if complete:
            if expected_package_raw == head_package_raw:
                fully_explained.add(PACKAGE_IDENTITY)
            if expected_release_raw == head_authority_raw:
                fully_explained.add(RELEASE_AUTHORITY)
            fully_explained.add(INSTALLED_TRANSITION)
            if expected_manifest_raw == head_evidence["raw"]:
                fully_explained.add(UPSTREAM_MANIFEST)
            fully_explained.add(expected_head_asset)
        closure.update({
            "checks": checks,
            "complete": complete,
            "explained_paths": sorted(fully_explained, key=lambda value: value.encode("utf-8")),
            "renderer": renderer,
            "state": "complete" if complete else "invalid",
            "unknowns": sorted(unknowns),
        })
        return closure, roles
    except (AdvisoryError, UnicodeError, json.JSONDecodeError) as error:
        unknown = f"identity_evidence_error:{error.code}" if isinstance(error, AdvisoryError) else "identity_evidence_error"
        unknowns.add(unknown)
        checks.append({"id": "identity_evidence", "status": "fail"})
        closure.update({
            "checks": checks,
            "complete": False,
            "explained_paths": [],
            "renderer": renderer,
            "state": "invalid",
            "unknowns": sorted(unknowns),
        })
        return closure, roles


def strictest(lanes: list[str]) -> str:
    return max(lanes, key=LANE_PRIORITY.__getitem__)


def classify_path(path: str, policy: dict, release_paths: set[str], external: set[str]) -> tuple[str, list[str], list[str]]:
    if path in policy["classifier_paths"]:
        return "PRODUCT_OR_SECURITY", ["classifier_self_change"], []
    matched: list[tuple[str, str]] = []
    if path in release_paths and path in policy["package_document_paths"]:
        matched.append(("packaged_document", "PACKAGE_DOC_ONLY"))
    for rule in policy["rules"]:
        if path in rule["exact_paths"] or any(path.startswith(prefix) for prefix in rule["prefixes"]):
            matched.append((rule["id"], rule["lane"]))
    if matched:
        return strictest([lane for _, lane in matched]), sorted({rule_id for rule_id, _ in matched}), []
    if path in release_paths:
        return "PRODUCT_OR_SECURITY", ["unclassified_release_surface"], ["unclassified_release_surface"]
    if path in external:
        return "PRODUCT_OR_SECURITY", ["identity_requires_g2"], ["external_identity_requires_g2"]
    return "PRODUCT_OR_SECURITY", ["unknown_path"], [f"unclassified_path:{path}"]


def classify_change(change: dict, policy: dict, release_paths: set[str], external: set[str]) -> dict:
    paths = [path for path in (change["old_path"], change["new_path"]) if path is not None]
    lanes: list[str] = []
    matched_rules: set[str] = set()
    unknowns: set[str] = set()
    for path in paths:
        lane, rules, path_unknowns = classify_path(path, policy, release_paths, external)
        lanes.append(lane)
        matched_rules.update(rules)
        unknowns.update(path_unknowns)
    if change["old_mode"] not in SAFE_MODES or change["new_mode"] not in SAFE_MODES:
        lanes.append("PRODUCT_OR_SECURITY")
        matched_rules.add("unsafe_object_type")
        unknowns.add("unsafe_object_type")
    result = dict(change)
    result.update({
        "lane": strictest(lanes or ["PRODUCT_OR_SECURITY"]),
        "matched_rules": sorted(matched_rules),
        "release_intersection": any(path in release_paths or path in external for path in paths),
        "unknowns": sorted(unknowns),
    })
    return result


def classify(base_value: str, head_value: str) -> dict:
    repository = git_bytes(["rev-parse", "--show-toplevel"]).decode("utf-8", errors="strict").strip()
    if Path(repository).resolve() != ROOT.resolve():
        raise AdvisoryError("INVALID_REPOSITORY", "classifier source is not inside the selected Git repository")
    base = resolve_commit(base_value)
    head = resolve_commit(head_value)
    policy, policy_raw = load_policy()
    head_contract, release_paths, external, authority_raw = load_release_authority(head)
    raw_delta = parse_raw_delta(base, head)
    identity_closure, identity_roles = verify_identity_closure(
        base, head, raw_delta, head_contract, authority_raw,
    )
    explained = set(identity_closure["explained_paths"]) if identity_closure["complete"] else set()
    changes = []
    for raw_change in raw_delta:
        change = classify_change(raw_change, policy, release_paths, external)
        paths = [path for path in (change["old_path"], change["new_path"]) if path is not None]
        roles = sorted({identity_roles[path] for path in paths if path in identity_roles})
        change["identity_explained"] = bool(paths) and all(path in explained for path in paths)
        change["identity_role"] = roles[0] if len(roles) == 1 else None
        changes.append(change)
    residual = [change for change in changes if not change["identity_explained"]]
    reasons = sorted({reason for change in residual for reason in change["matched_rules"]})
    unknowns = sorted(
        {unknown for change in residual for unknown in change["unknowns"]}
        | set(identity_closure["unknowns"])
    )
    if identity_closure["complete"] and not residual:
        lane = "NO_RELEASE_REQUIRED"
        reasons = ["canonical_identity_only"]
    elif residual:
        lane = strictest([change["lane"] for change in residual])
        if identity_closure["complete"]:
            reasons = sorted(set(reasons) | {"canonical_identity_closure"})
    else:
        lane = "PRODUCT_OR_SECURITY"
        reasons = ["empty_delta_not_classifiable"]
        unknowns = ["empty_delta"]
    invalidated = ["LOCAL_TEST_BASELINE"] if any(
        (change["old_path"] or "").startswith("tests/") or (change["new_path"] or "").startswith("tests/")
        for change in changes
    ) else []
    return {
        "advisory_only": True,
        "base_commit": base,
        "changes": changes,
        "evidence_invalidated": invalidated,
        "head_commit": head,
        "identity_closure": identity_closure,
        "lane": lane,
        "policy": {
            "id": policy["policy_id"],
            "path": POLICY_RELATIVE,
            "schema_version": policy["schema_version"],
            "sha256": sha256_bytes(policy_raw),
        },
        "reasons": reasons,
        "release_authority": {
            "commit": head,
            "path": RELEASE_AUTHORITY,
            "sha256": sha256_bytes(authority_raw),
        },
        "residual_changes": residual,
        "result_type": RESULT_TYPE,
        "schema_version": 2,
        "unknowns": unknowns,
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", required=True, help="explicit accepted/base commit-ish")
    parser.add_argument("--head", required=True, help="explicit candidate/head commit-ish")
    return parser.parse_args()


def fail(error: Exception) -> NoReturn:
    code = error.code if isinstance(error, AdvisoryError) else "INVALID_EVIDENCE"
    result = {
        "error": str(error),
        "error_code": code,
        "healthy": False,
        "result_type": ERROR_TYPE,
        "schema_version": 2,
    }
    print(json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(",", ":")), file=sys.stderr)
    raise SystemExit(1)


def main() -> int:
    try:
        args = parse_args()
        result = classify(args.base, args.head)
        print(json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
        return 0
    except (AdvisoryError, OSError, UnicodeError, json.JSONDecodeError, subprocess.SubprocessError) as error:
        fail(error)


if __name__ == "__main__":
    raise SystemExit(main())
