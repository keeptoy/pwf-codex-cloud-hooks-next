#!/usr/bin/env python3
"""Emit a read-only Phase 5.3 G1 Release-risk advisory for two explicit commits."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path, PurePosixPath
import subprocess
import sys
from typing import NoReturn


ROOT = Path(__file__).resolve().parents[1]
POLICY_RELATIVE = "tools/release-risk-policy-v1.json"
RELEASE_AUTHORITY = "contracts/release-artifact-v2.json"
RESULT_TYPE = "PWF_RELEASE_RISK_ADVISORY_V1"
ERROR_TYPE = "PWF_RELEASE_RISK_ADVISORY_ERROR_V1"
LANE_PRIORITY = {
    "SOURCE_ONLY_GOVERNANCE": 1,
    "PACKAGE_DOC_ONLY": 2,
    "RELEASE_MECHANICS": 3,
    "PRODUCT_OR_SECURITY": 4,
}
SAFE_MODES = {"000000": "absent", "100644": "regular", "100755": "regular"}
KNOWN_MODES = {**SAFE_MODES, "120000": "symlink", "160000": "gitlink"}


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


def git_show(commit: str, relative: str) -> bytes:
    return git_bytes(["show", f"{commit}:{relative}"], code="INVALID_RELEASE_AUTHORITY")


def load_release_authority(head: str) -> tuple[set[str], set[str], bytes]:
    raw = git_show(head, RELEASE_AUTHORITY)
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
    return set(release_paths), set(external), raw


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
    release_paths, external, authority_raw = load_release_authority(head)
    changes = [classify_change(change, policy, release_paths, external) for change in parse_raw_delta(base, head)]
    reasons = sorted({reason for change in changes for reason in change["matched_rules"]})
    unknowns = sorted({unknown for change in changes for unknown in change["unknowns"]})
    if changes:
        lane = strictest([change["lane"] for change in changes])
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
        "result_type": RESULT_TYPE,
        "schema_version": 1,
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
        "schema_version": 1,
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
