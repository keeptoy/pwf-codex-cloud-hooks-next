#!/usr/bin/env python3
"""Plan or project one bounded Phase 5.3 G3 Release-evidence block."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import stat
import sys
import tempfile
from typing import NoReturn

import classify_release_risk as risk


ROOT = risk.ROOT
RESULT_TYPE = "PWF_RELEASE_EVIDENCE_PROJECTION_V1"
ERROR_TYPE = "PWF_RELEASE_EVIDENCE_PROJECTION_ERROR_V1"
BEGIN_MARKER = "<!-- BEGIN PWF RELEASE EVIDENCE PLAN V1 -->"
END_MARKER = "<!-- END PWF RELEASE EVIDENCE PLAN V1 -->"
BEGIN_BYTES = BEGIN_MARKER.encode("ascii")
END_BYTES = END_MARKER.encode("ascii")
MAX_DOCUMENT_BYTES = 2 * 1024 * 1024
METRICS = {
    "authority_bodies_duplicated": 0,
    "generated_checklist_fields": 5,
    "generated_blocks": 1,
    "manual_evidence_fields": 0,
}


class ProjectionError(ValueError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def validate_advisory(advisory: object) -> dict:
    if not isinstance(advisory, dict):
        raise ProjectionError("INVALID_ADVISORY", "classifier result must be an object")
    required = {
        "advisory_only", "base_commit", "evidence_invalidated", "head_commit", "identity_closure", "lane",
        "owner_fingerprints", "policy", "reasons", "release_authority", "required_gates", "result_type",
        "schema_version", "unknowns",
    }
    if not required.issubset(advisory):
        raise ProjectionError("INVALID_ADVISORY", "classifier result is missing required G3 fields")
    if advisory.get("schema_version") != 3 or advisory.get("result_type") != risk.RESULT_TYPE \
            or advisory.get("advisory_only") is not True:
        raise ProjectionError("INVALID_ADVISORY", "unsupported classifier result identity")
    for key in ("base_commit", "head_commit"):
        value = advisory.get(key)
        if not isinstance(value, str) or len(value) != 40 or any(character not in "0123456789abcdef" for character in value):
            raise ProjectionError("INVALID_ADVISORY", f"invalid {key}")
    fingerprints = advisory.get("owner_fingerprints")
    if not isinstance(fingerprints, list) or [item.get("id") for item in fingerprints if isinstance(item, dict)] != [
        "RELEASE_ARTIFACT_AUTHORITY", "RELEASE_RISK_POLICY",
    ]:
        raise ProjectionError("INVALID_ADVISORY", "owner fingerprints are missing or ambiguous")
    expected_fingerprint_fields = [
        {"commit", "id", "path", "sha256"},
        {"id", "path", "sha256"},
    ]
    for fingerprint, expected_fields in zip(fingerprints, expected_fingerprint_fields):
        if set(fingerprint) != expected_fields or not isinstance(fingerprint.get("path"), str) \
                or not isinstance(fingerprint.get("sha256"), str) \
                or len(fingerprint["sha256"]) != 64 \
                or any(character not in "0123456789abcdef" for character in fingerprint["sha256"]):
            raise ProjectionError("INVALID_ADVISORY", "owner fingerprint fields are invalid")
    gates = advisory.get("required_gates")
    expected_gate_fields = {
        "authority_references", "cloud", "escalation", "lane", "lifecycle", "linux", "local",
        "operative_workflow", "plan_schema_version", "retirement", "status",
    }
    if not isinstance(gates, dict) or set(gates) != expected_gate_fields:
        raise ProjectionError("INVALID_ADVISORY", "required-gate fields are not exact")
    if gates.get("plan_schema_version") != 1 or gates.get("lane") != advisory.get("lane") \
            or gates.get("status") != "SHADOW_ONLY_NOT_EXECUTION_AUTHORITY" \
            or gates.get("operative_workflow") != "ROADMAP_CURRENT_FULL_UNTIL_G5":
        raise ProjectionError("INVALID_ADVISORY", "required-gate identity is invalid")
    cloud = gates.get("cloud")
    if not isinstance(cloud, dict) or set(cloud) != {"published_release", "source_candidate"}:
        raise ProjectionError("INVALID_ADVISORY", "Cloud gate fields are not exact")
    for value in (gates.get("local"), gates.get("linux"), cloud.get("source_candidate"),
                  cloud.get("published_release"), gates.get("retirement"), gates.get("escalation")):
        if not isinstance(value, list) or any(not isinstance(item, str) or not item for item in value):
            raise ProjectionError("INVALID_ADVISORY", "evidence gate lists must contain non-empty strings")
    lifecycle = gates.get("lifecycle")
    if not isinstance(lifecycle, list) or [item.get("id") for item in lifecycle if isinstance(item, dict)] != risk.LIFECYCLE_IDS:
        raise ProjectionError("INVALID_ADVISORY", "lifecycle objects are missing or reordered")
    for item in lifecycle:
        if set(item) != {"disposition", "id", "required"} or not isinstance(item.get("required"), bool) \
                or item.get("disposition") not in {"REQUIRED_BY_CURRENT_WORKFLOW", "NOT_APPLICABLE_NO_RELEASE"}:
            raise ProjectionError("INVALID_ADVISORY", "lifecycle object fields are invalid")
    references = gates.get("authority_references")
    if not isinstance(references, list) or len(references) != 4:
        raise ProjectionError("INVALID_ADVISORY", "authority references are missing")
    if any(not isinstance(item, dict) or set(item) != {"anchor", "id", "path"}
           or any(not isinstance(item[field], str) or not item[field] for field in item)
           for item in references):
        raise ProjectionError("INVALID_ADVISORY", "authority reference fields are invalid")
    for key in ("evidence_invalidated", "reasons", "unknowns"):
        value = advisory.get(key)
        if not isinstance(value, list) or any(not isinstance(item, str) or not item for item in value):
            raise ProjectionError("INVALID_ADVISORY", f"{key} must be a string list")
    return advisory


def markdown_values(values: list[str], empty: str = "none") -> str:
    return ", ".join(f"`{value}`" for value in values) if values else f"_{empty}_"


def render_block(advisory: dict) -> bytes:
    gates = advisory["required_gates"]
    cloud = gates["cloud"]
    lifecycle = ", ".join(
        f"`{item['id']}={'REQUIRED' if item['required'] else item['disposition']}`"
        for item in gates["lifecycle"]
    )
    references = ", ".join(
        f"`{item['path']}#{item['anchor']}`" for item in gates["authority_references"]
    )
    fingerprints = ", ".join(
        f"`{item['id']}:{item['path']}@{item['sha256']}`" for item in advisory["owner_fingerprints"]
    )
    lines = [
        BEGIN_MARKER,
        "### Generated Release evidence plan (advisory only)",
        "",
        f"- Classification: `{advisory['result_type']}` / `{advisory['lane']}` / "
        f"`{gates['status']}`.",
        f"- Exact range: `{advisory['base_commit']}` → `{advisory['head_commit']}`.",
        f"- Owner fingerprints: {fingerprints}.",
        f"- Local evidence: {markdown_values(gates['local'])}.",
        f"- Linux evidence: {markdown_values(gates['linux'], 'not required by this no-release lane')}.",
        f"- Source/Candidate evidence: "
        f"{markdown_values(cloud['source_candidate'], 'not applicable; no C0 or publication')}.",
        f"- Published Release evidence: "
        f"{markdown_values(cloud['published_release'], 'not applicable; no publication')}.",
        f"- Retirement/checkpoint evidence: "
        f"{markdown_values(gates['retirement'], 'not applicable; C1/C2 are not removed')}.",
        f"- Lifecycle objects: {lifecycle}.",
        f"- Evidence invalidated: {markdown_values(advisory['evidence_invalidated'])}.",
        f"- Unknowns: {markdown_values(advisory['unknowns'])}.",
        f"- Escalation: {markdown_values(gates['escalation'])}.",
        f"- Existing authorities only: {references}.",
        f"- Operative workflow: `{gates['operative_workflow']}`; this generated block records no PASS, "
        "executes no gate and grants no authorization.",
        END_MARKER,
    ]
    return "\n".join(lines).encode("utf-8")


def validate_target(relative_value: str, document_kind: str) -> tuple[str, Path]:
    try:
        relative = risk.safe_path(relative_value)
    except risk.AdvisoryError as error:
        raise ProjectionError("INVALID_TARGET", str(error)) from error
    parts = relative.split("/")
    if document_kind == "task-plan":
        valid_kind = len(parts) >= 3 and parts[0] == ".planning" and parts[-1] == "task_plan.md"
    else:
        filename = parts[-1]
        valid_location = len(parts) == 2 or (len(parts) == 3 and parts[1] == "acceptance")
        valid_kind = valid_location and parts[0] == "docs" and not filename.endswith("-template.md") and (
            "operator-guide" in filename or filename.endswith("cloud-hard-acceptance.md")
        )
    if not valid_kind:
        raise ProjectionError("INVALID_TARGET", f"target does not match document kind {document_kind!r}")
    target = ROOT.joinpath(*parts)
    try:
        target_stat = target.lstat()
    except FileNotFoundError as error:
        raise ProjectionError("INVALID_TARGET", "projection target must already exist") from error
    if target.is_symlink() or not stat.S_ISREG(target_stat.st_mode):
        raise ProjectionError("INVALID_TARGET", "projection target must be a regular non-symlink file")
    resolved = target.resolve(strict=True)
    try:
        resolved.relative_to(ROOT.resolve())
    except ValueError as error:
        raise ProjectionError("INVALID_TARGET", "projection target escapes the repository") from error
    if os.path.normcase(str(resolved)) != os.path.normcase(str(target.absolute())):
        raise ProjectionError("INVALID_TARGET", "projection target traverses a linked parent")
    return relative, target


def replace_generated_block(original: bytes, block: bytes) -> bytes:
    begin_count = original.count(BEGIN_BYTES)
    end_count = original.count(END_BYTES)
    if begin_count == 0 and end_count == 0:
        separator = b"" if not original else (b"\n" if original.endswith(b"\n") else b"\n\n")
        return original + separator + block + b"\n"
    if begin_count != 1 or end_count != 1:
        raise ProjectionError("MALFORMED_MARKERS", "expected zero or one exact generated marker pair")
    begin = original.index(BEGIN_BYTES)
    end = original.index(END_BYTES)
    if end <= begin:
        raise ProjectionError("MALFORMED_MARKERS", "generated markers are reversed or nested")
    return original[:begin] + block + original[end + len(END_BYTES):]


def target_identity(value: os.stat_result) -> tuple[int, int, int, int]:
    return value.st_dev, value.st_ino, value.st_size, value.st_mtime_ns


def atomic_write(target: Path, before: bytes, after: bytes, before_stat: os.stat_result) -> None:
    descriptor = -1
    temporary_name = ""
    try:
        descriptor, temporary_name = tempfile.mkstemp(prefix=".pwf-release-evidence-", dir=target.parent)
        with os.fdopen(descriptor, "wb") as stream:
            descriptor = -1
            stream.write(after)
            stream.flush()
            os.fsync(stream.fileno())
        os.chmod(temporary_name, stat.S_IMODE(before_stat.st_mode))
        current_stat = target.lstat()
        if target.is_symlink() or target_identity(current_stat) != target_identity(before_stat) \
                or target.read_bytes() != before:
            raise ProjectionError("TARGET_CHANGED", "projection target changed before atomic replacement")
        os.replace(temporary_name, target)
        temporary_name = ""
    finally:
        if descriptor >= 0:
            os.close(descriptor)
        if temporary_name:
            try:
                os.unlink(temporary_name)
            except FileNotFoundError:
                pass


def project(args: argparse.Namespace) -> dict:
    advisory = validate_advisory(risk.classify(args.base, args.head))
    relative, target = validate_target(args.target, args.document_kind)
    before_stat = target.lstat()
    if before_stat.st_size > MAX_DOCUMENT_BYTES:
        raise ProjectionError("INVALID_TARGET", "projection target exceeds the size limit")
    before = target.read_bytes()
    try:
        before.decode("utf-8")
    except UnicodeDecodeError as error:
        raise ProjectionError("INVALID_TARGET", "projection target is not UTF-8") from error
    block = render_block(advisory)
    after = replace_generated_block(before, block)
    changed = after != before
    if args.check and changed:
        raise ProjectionError("PROJECTION_DRIFT", "generated evidence block is absent or stale")
    if args.write and changed:
        atomic_write(target, before, after, before_stat)
    return {
        "base_commit": advisory["base_commit"],
        "changed": changed,
        "document_kind": args.document_kind,
        "head_commit": advisory["head_commit"],
        "lane": advisory["lane"],
        "metrics": METRICS,
        "mode": "check" if args.check else "write",
        "result_type": RESULT_TYPE,
        "schema_version": 1,
        "sha256": sha256_bytes(after),
        "target": relative,
    }


def add_endpoints(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--base", required=True, help="explicit accepted/base commit-ish")
    parser.add_argument("--head", required=True, help="explicit candidate/head commit-ish")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    plan = commands.add_parser("plan", help="emit the read-only V3 advisory and evidence plan")
    add_endpoints(plan)
    projection = commands.add_parser("project", help="check or write one bounded generated Markdown block")
    add_endpoints(projection)
    projection.add_argument("--target", required=True, help="repository-relative existing Markdown target")
    projection.add_argument("--document-kind", required=True, choices=("task-plan", "operator-guide"))
    action = projection.add_mutually_exclusive_group(required=True)
    action.add_argument("--check", action="store_true", help="fail if the generated block is absent or stale")
    action.add_argument("--write", action="store_true", help="atomically append or replace the generated block")
    return parser.parse_args()


def fail(error: Exception) -> NoReturn:
    code = error.code if isinstance(error, (ProjectionError, risk.AdvisoryError)) else "PROJECTION_ERROR"
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
        if args.command == "plan":
            result = validate_advisory(risk.classify(args.base, args.head))
        else:
            result = project(args)
        print(json.dumps(result, ensure_ascii=False, sort_keys=True, separators=(",", ":")))
        return 0
    except (ProjectionError, risk.AdvisoryError, OSError, UnicodeError, json.JSONDecodeError) as error:
        fail(error)


if __name__ == "__main__":
    raise SystemExit(main())
