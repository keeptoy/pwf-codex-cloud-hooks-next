#!/usr/bin/env python3
"""Import and verify the pinned, allowlisted planning-with-files runtime."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import stat
import sys
import zipfile


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MANIFEST = ROOT / "upstream-manifest.json"
DEFAULT_DESTINATION = ROOT / "runtime" / "upstream"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def load_json(path: Path) -> dict:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"JSON root must be an object: {path}")
    return value


def require_hash(value: object, label: str) -> str:
    if not isinstance(value, str) or len(value) != 64 or any(character not in "0123456789abcdef" for character in value):
        raise ValueError(f"invalid SHA-256 for {label}")
    return value


def safe_relative(value: object, label: str) -> PurePosixPath:
    if not isinstance(value, str) or not value or "\\" in value:
        raise ValueError(f"invalid relative path for {label}")
    path = PurePosixPath(value)
    if path.is_absolute() or any(part in ("", ".", "..") for part in path.parts):
        raise ValueError(f"unsafe relative path for {label}: {value}")
    if path.parts[0].endswith(":"):
        raise ValueError(f"unsafe relative path for {label}: {value}")
    return path


def require_exact_keys(value: object, expected: set[str], label: str) -> dict:
    if not isinstance(value, dict):
        raise ValueError(f"invalid object for {label}")
    actual = set(value)
    if actual != expected:
        raise ValueError(f"invalid fields for {label}: missing={sorted(expected - actual)}, unknown={sorted(actual - expected)}")
    return value


def require_string_list(value: object, label: str) -> list[str]:
    if not isinstance(value, list) or any(not isinstance(item, str) or not item for item in value):
        raise ValueError(f"invalid string list for {label}")
    if len(value) != len(set(value)):
        raise ValueError(f"duplicate value in {label}")
    return value


def require_identifier(value: object, label: str) -> str:
    allowed = "abcdefghijklmnopqrstuvwxyz0123456789_"
    if not isinstance(value, str) or not value or value[0] not in allowed[:26] or any(character not in allowed for character in value):
        raise ValueError(f"invalid identifier for {label}: {value}")
    return value


def relative_to(path: PurePosixPath, root: PurePosixPath, label: str) -> PurePosixPath:
    try:
        relative = path.relative_to(root)
    except ValueError as error:
        raise ValueError(f"{label} escapes expected root: {path}") from error
    if not relative.parts:
        raise ValueError(f"{label} must name a file below {root}")
    return relative


def validate_dependencies(value: object, owner: str, runtime_ids: set[str]) -> None:
    if not isinstance(value, list):
        raise ValueError(f"invalid dependencies for {owner}")
    seen: set[str] = set()
    for raw in value:
        if not isinstance(raw, dict):
            raise ValueError(f"invalid dependency for {owner}")
        allowed = {"id", "condition", "required", "allowed_symbols"} if "allowed_symbols" in raw else {"id", "condition", "required"}
        require_exact_keys(raw, allowed, f"{owner} dependency")
        dependency = raw.get("id")
        if not isinstance(dependency, str) or not dependency or dependency == owner or dependency in seen:
            raise ValueError(f"invalid dependency id for {owner}: {dependency}")
        if dependency not in runtime_ids:
            raise ValueError(f"unknown dependency for {owner}: {dependency}")
        if not isinstance(raw.get("condition"), str) or not raw["condition"]:
            raise ValueError(f"invalid dependency condition for {owner}: {dependency}")
        if not isinstance(raw.get("required"), bool):
            raise ValueError(f"invalid dependency requirement for {owner}: {dependency}")
        if "allowed_symbols" in raw:
            require_string_list(raw["allowed_symbols"], f"{owner}.{dependency}.allowed_symbols")
        seen.add(dependency)


def validate_contracts(bundle: dict) -> tuple[list[dict], dict]:
    require_exact_keys(bundle, {
        "schema_version", "contract_id", "upstream", "package_root", "local_package_root",
        "installed_root", "local_files", "installed_contracts", "files",
    }, "runtime bundle")
    if bundle.get("schema_version") != 1:
        raise ValueError("unsupported runtime bundle schema")
    if bundle.get("contract_id") != "PWF_MANAGED_RUNTIME_BUNDLE_V1":
        raise ValueError("unsupported runtime bundle identity")

    upstream = require_exact_keys(bundle.get("upstream"), {
        "repository", "release", "commit", "release_archive_url", "release_archive_sha256",
        "canonical_source_root", "license", "copyright", "license_source_path", "license_sha256",
    }, "runtime bundle upstream")
    files = bundle.get("files")
    local_files = bundle.get("local_files")
    installed_contracts = bundle.get("installed_contracts")
    if not isinstance(files, list) or not files or not isinstance(local_files, list) or not local_files or not isinstance(installed_contracts, list) or not installed_contracts:
        raise ValueError("runtime bundle is incomplete")
    archive_url = upstream.get("release_archive_url")
    if not isinstance(archive_url, str) or not archive_url.startswith("https://github.com/"):
        raise ValueError("runtime bundle must pin an HTTPS GitHub archive URL")
    require_hash(upstream.get("release_archive_sha256"), "release archive")
    require_hash(upstream.get("license_sha256"), "upstream license")
    safe_relative(upstream.get("license_source_path"), "upstream license")
    for field in ("repository", "release", "commit", "canonical_source_root", "license", "copyright"):
        if not isinstance(upstream.get(field), str) or not upstream[field]:
            raise ValueError(f"invalid runtime bundle upstream {field}")

    package_root = safe_relative(bundle.get("package_root"), "package root")
    local_package_root = safe_relative(bundle.get("local_package_root"), "local package root")
    installed_root = safe_relative(bundle.get("installed_root"), "installed root")
    managed_root = installed_root.parent
    canonical_source_root = safe_relative(upstream.get("canonical_source_root"), "canonical source root")
    seen_ids: set[str] = set()
    seen_packages: set[PurePosixPath] = set()
    seen_installed: set[PurePosixPath] = set()
    normalized: list[dict] = []
    for raw in files:
        require_exact_keys(raw, {
            "id", "source_path", "package_path", "installed_path", "origin", "language", "mode",
            "pristine_sha256", "managed_sha256", "direct_file_dependencies", "host_dependencies", "overlay_ids",
        }, "upstream runtime file")
        identifier = require_identifier(raw.get("id"), "upstream runtime file")
        if identifier in seen_ids:
            raise ValueError(f"duplicate or invalid runtime file id: {raw.get('id')}")
        source_path = safe_relative(raw.get("source_path"), raw["id"])
        package_path = safe_relative(raw.get("package_path"), raw["id"])
        installed_path = safe_relative(raw.get("installed_path"), f"{raw['id']} installed")
        relative_package = relative_to(package_path, package_root, "package path")
        relative_to(source_path, canonical_source_root, "source path")
        relative_to(installed_path, installed_root, "installed path")
        if package_path in seen_packages:
            raise ValueError(f"duplicate package path: {package_path}")
        if installed_path in seen_installed:
            raise ValueError(f"duplicate installed path: {installed_path}")
        if raw.get("mode") != "0755":
            raise ValueError(f"unsupported mode for {raw['id']}: {raw.get('mode')}")
        if not isinstance(raw.get("language"), str) or not raw["language"]:
            raise ValueError(f"invalid language for {raw['id']}")
        if raw.get("origin") != "upstream_pristine":
            raise ValueError(f"runtime file is not pristine: {raw['id']}")
        pristine_hash = require_hash(raw.get("pristine_sha256"), f"{raw['id']} pristine")
        managed_hash = require_hash(raw.get("managed_sha256"), f"{raw['id']} managed")
        if managed_hash != pristine_hash:
            raise ValueError(f"pristine/managed hash mismatch for {raw['id']}")
        if raw.get("overlay_ids") != []:
            raise ValueError(f"runtime file declares an overlay: {raw['id']}")
        require_string_list(raw.get("host_dependencies"), f"{raw['id']} host dependencies")
        seen_ids.add(raw["id"])
        seen_packages.add(package_path)
        seen_installed.add(installed_path)
        normalized.append({**raw, "source": source_path, "relative": relative_package})

    for raw in local_files:
        require_exact_keys(raw, {
            "id", "package_path", "installed_path", "origin", "language", "mode", "sha256",
            "direct_file_dependencies", "host_dependencies",
        }, "local runtime file")
        identifier = require_identifier(raw.get("id"), "local runtime file")
        if identifier in seen_ids:
            raise ValueError(f"duplicate or invalid runtime file id: {identifier}")
        package_path = safe_relative(raw.get("package_path"), identifier)
        installed_path = safe_relative(raw.get("installed_path"), f"{identifier} installed")
        relative_to(package_path, local_package_root, "local package path")
        relative_to(installed_path, managed_root, "local installed path")
        if package_path in seen_packages:
            raise ValueError(f"duplicate package path: {package_path}")
        if installed_path in seen_installed:
            raise ValueError(f"duplicate installed path: {installed_path}")
        if raw.get("origin") != "local_managed_runtime" or raw.get("mode") != "0755":
            raise ValueError(f"invalid local runtime origin or mode for {identifier}")
        if not isinstance(raw.get("language"), str) or not raw["language"]:
            raise ValueError(f"invalid language for {identifier}")
        require_hash(raw.get("sha256"), identifier)
        require_string_list(raw.get("host_dependencies"), f"{identifier} host dependencies")
        seen_ids.add(identifier)
        seen_packages.add(package_path)
        seen_installed.add(installed_path)

    for raw in installed_contracts:
        require_exact_keys(raw, {"id", "package_path", "installed_path", "mode", "sha256"}, "installed contract")
        identifier = require_identifier(raw.get("id"), "installed contract")
        if identifier in seen_ids:
            raise ValueError(f"duplicate or invalid runtime file id: {identifier}")
        package_path = safe_relative(raw.get("package_path"), identifier)
        installed_path = safe_relative(raw.get("installed_path"), f"{identifier} installed")
        relative_to(package_path, PurePosixPath("contracts"), "contract package path")
        relative_to(installed_path, managed_root, "contract installed path")
        if package_path in seen_packages:
            raise ValueError(f"duplicate package path: {package_path}")
        if installed_path in seen_installed:
            raise ValueError(f"duplicate installed path: {installed_path}")
        if raw.get("mode") != "0644":
            raise ValueError(f"unsupported mode for {identifier}: {raw.get('mode')}")
        require_hash(raw.get("sha256"), identifier)
        seen_ids.add(identifier)
        seen_packages.add(package_path)
        seen_installed.add(installed_path)

    runtime_ids = {item["id"] for item in files + local_files}
    for raw in files + local_files:
        validate_dependencies(raw.get("direct_file_dependencies"), raw["id"], runtime_ids)

    return normalized, upstream


def load_verified_bundle(manifest_path: Path, bundle_override: Path | None) -> dict:
    manifest_path = manifest_path.resolve(strict=True)
    manifest = load_json(manifest_path)
    managed = require_exact_keys(manifest.get("managed_runtime"), {
        "schema_version", "contracts", "importer", "license_provenance",
    }, "managed runtime manifest")
    if managed.get("schema_version") != 2:
        raise ValueError("unsupported managed runtime manifest schema")
    contracts = require_exact_keys(managed.get("contracts"), {
        "runtime_bundle", "adapter_runtime_request", "runtime_result", "release_artifact",
    }, "managed runtime contracts")
    for identifier, value in contracts.items():
        label = identifier.replace("_", " ")
        reference_value = require_exact_keys(value, {"path", "sha256"}, f"{label} integrity reference")
        safe_relative(reference_value.get("path"), label)
        require_hash(reference_value.get("sha256"), label)
    importer = require_exact_keys(managed.get("importer"), {"path", "sha256"}, "runtime importer")
    safe_relative(importer.get("path"), "runtime importer")
    require_hash(importer.get("sha256"), "runtime importer")
    provenance = require_exact_keys(managed.get("license_provenance"), {
        "spdx", "upstream_path", "upstream_sha256", "notice_path", "notice_sha256",
    }, "license provenance")
    for field in ("spdx",):
        if not isinstance(provenance.get(field), str) or not provenance[field]:
            raise ValueError(f"invalid license provenance {field}")
    safe_relative(provenance.get("upstream_path"), "upstream license")
    safe_relative(provenance.get("notice_path"), "third-party notice")
    require_hash(provenance.get("upstream_sha256"), "upstream license")
    require_hash(provenance.get("notice_sha256"), "third-party notice")
    reference = contracts["runtime_bundle"]
    relative = safe_relative(reference.get("path"), "runtime bundle")
    expected_hash = require_hash(reference.get("sha256"), "runtime bundle")
    candidate = manifest_path.parent
    for part in relative.parts:
        candidate /= part
        if candidate.is_symlink():
            raise ValueError(f"runtime bundle path contains a symlink: {candidate}")
    anchored = candidate.resolve(strict=False)
    selected = bundle_override.resolve(strict=False) if bundle_override is not None else anchored
    if selected != anchored:
        raise ValueError(f"runtime bundle override differs from manifest reference: {selected}")
    raw = selected.read_bytes()
    actual_hash = sha256_bytes(raw)
    if actual_hash != expected_hash:
        raise ValueError(f"runtime bundle SHA-256 mismatch: {actual_hash}")
    bundle = json.loads(raw.decode("utf-8"))
    if not isinstance(bundle, dict):
        raise ValueError(f"JSON root must be an object: {selected}")
    validate_contracts(bundle)
    upstream = bundle["upstream"]
    for manifest_key, bundle_key in (
        ("upstream", "repository"), ("release", "release"), ("commit", "commit"),
        ("release_archive_url", "release_archive_url"), ("release_archive_sha256", "release_archive_sha256"),
    ):
        if manifest.get(manifest_key) != upstream.get(bundle_key):
            raise ValueError(f"runtime bundle upstream mismatch: {manifest_key}")
    if provenance.get("upstream_sha256") != upstream.get("license_sha256"):
        raise ValueError("runtime bundle upstream license mismatch")
    return bundle


def validate_zip_info(info: zipfile.ZipInfo) -> PurePosixPath:
    path = safe_relative(info.filename.rstrip("/"), "archive entry")
    unix_mode = info.external_attr >> 16
    if stat.S_IFMT(unix_mode) == stat.S_IFLNK:
        raise ValueError(f"archive symlink is forbidden: {info.filename}")
    return path


def locate_archive_members(zf: zipfile.ZipFile, sources: list[PurePosixPath]) -> dict[PurePosixPath, zipfile.ZipInfo]:
    entries: list[tuple[PurePosixPath, zipfile.ZipInfo]] = []
    for info in zf.infolist():
        path = validate_zip_info(info)
        if not info.is_dir():
            entries.append((path, info))

    selected: dict[PurePosixPath, zipfile.ZipInfo] = {}
    prefixes: set[PurePosixPath] = set()
    for source in sources:
        matches = [
            (path, info)
            for path, info in entries
            if len(path.parts) == len(source.parts) + 1
            and path.parts[-len(source.parts):] == source.parts
        ]
        if len(matches) != 1:
            raise ValueError(f"archive must contain exactly one {source}; found {len(matches)}")
        archive_path, info = matches[0]
        prefix = PurePosixPath(*archive_path.parts[:-len(source.parts)])
        prefixes.add(prefix)
        selected[source] = info
    if len(prefixes) != 1:
        raise ValueError("allowlisted archive members do not share one top-level root")
    prefix = next(iter(prefixes))
    if len(prefix.parts) != 1:
        raise ValueError(f"archive root must be exactly one directory: {prefix}")
    return selected


def build_expected(archive: Path, bundle: dict) -> tuple[list[dict], dict[PurePosixPath, bytes]]:
    archive_bytes = archive.read_bytes()
    expected_archive = require_hash(bundle["upstream"].get("release_archive_sha256"), "release archive")
    actual_archive = sha256_bytes(archive_bytes)
    if actual_archive != expected_archive:
        raise ValueError(f"release archive SHA-256 mismatch: {actual_archive}")

    files, upstream = validate_contracts(bundle)
    license_source = safe_relative(upstream["license_source_path"], "upstream license")
    sources = [item["source"] for item in files] + [license_source]
    with zipfile.ZipFile(archive) as zf:
        members = locate_archive_members(zf, sources)
        source_bytes = {source: zf.read(members[source]) for source in sources}

    license_hash = sha256_bytes(source_bytes[license_source])
    if license_hash != require_hash(upstream["license_sha256"], "upstream license"):
        raise ValueError(f"upstream license SHA-256 mismatch: {license_hash}")

    expected: dict[PurePosixPath, bytes] = {}
    for item in files:
        content = source_bytes[item["source"]]
        actual = sha256_bytes(content)
        if actual != item["pristine_sha256"]:
            raise ValueError(f"pristine SHA-256 mismatch for {item['id']}: {actual}")
        actual_managed = sha256_bytes(content)
        if actual_managed != item["managed_sha256"]:
            raise ValueError(f"managed SHA-256 mismatch for {item['id']}: {actual_managed}")
        expected[item["relative"]] = content
    return files, expected


def check_destination(destination: Path, files: list[dict]) -> dict:
    if destination.is_symlink() or not destination.is_dir():
        raise ValueError(f"runtime destination is missing or unsafe: {destination}")
    expected = {item["relative"]: item for item in files}
    expected_directories = {
        parent
        for relative in expected
        for parent in relative.parents
        if parent != PurePosixPath(".")
    }
    actual: set[PurePosixPath] = set()
    actual_directories: set[PurePosixPath] = set()
    for path in destination.rglob("*"):
        relative = PurePosixPath(path.relative_to(destination).as_posix())
        if path.is_symlink():
            raise ValueError(f"runtime symlink is forbidden: {relative}")
        if path.is_file():
            actual.add(relative)
        elif path.is_dir():
            actual_directories.add(relative)
    missing = sorted(str(path) for path in set(expected) - actual)
    unknown = sorted(
        str(path)
        for path in (actual - set(expected)) | (actual_directories - expected_directories)
    )
    if missing or unknown:
        raise ValueError(f"runtime inventory mismatch: missing={missing}, unknown={unknown}")
    hashes: dict[str, str] = {}
    for relative, item in expected.items():
        target = destination.joinpath(*relative.parts)
        actual_hash = sha256_bytes(target.read_bytes())
        if actual_hash != item["managed_sha256"]:
            raise ValueError(f"runtime SHA-256 mismatch for {item['id']}: {actual_hash}")
        if os.name != "nt" and stat.S_IMODE(target.stat().st_mode) != int(item["mode"], 8):
            raise ValueError(f"runtime mode mismatch for {item['id']}")
        hashes[str(relative)] = actual_hash
    return {"healthy": True, "destination": str(destination), "files": hashes}


def import_runtime(archive: Path, destination: Path, bundle: dict) -> dict:
    files, expected = build_expected(archive, bundle)
    if destination.exists() or destination.is_symlink():
        result = check_destination(destination, files)
        result["changed"] = False
        return result

    destination.parent.mkdir(parents=True, exist_ok=True)
    stage = destination.parent / f".{destination.name}.pwf-import-{os.getpid()}"
    if stage.exists() or stage.is_symlink():
        raise ValueError(f"staging path already exists: {stage}")
    try:
        stage.mkdir()
        for item in files:
            relative = item["relative"]
            target = stage.joinpath(*relative.parts)
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open("xb") as output:
                output.write(expected[relative])
                output.flush()
                os.fsync(output.fileno())
            os.chmod(target, int(item["mode"], 8))
        os.replace(stage, destination)
    finally:
        if stage.exists() and stage.parent == destination.parent and stage.name.startswith(f".{destination.name}.pwf-import-"):
            shutil.rmtree(stage)
    result = check_destination(destination, files)
    result["changed"] = True
    return result


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("import", "check"))
    parser.add_argument("--archive", type=Path)
    parser.add_argument("--destination", type=Path, default=DEFAULT_DESTINATION)
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--bundle", type=Path)
    args = parser.parse_args()
    if args.command == "import" and args.archive is None:
        parser.error("--archive is required for import")
    return args


def reject_destination_symlinks(destination: Path) -> None:
    current = Path(destination.anchor)
    for part in destination.parts[1:]:
        current /= part
        if current.is_symlink():
            raise ValueError(f"runtime destination contains a symlink: {current}")


def main() -> int:
    try:
        args = parse_args()
        bundle = load_verified_bundle(args.manifest, args.bundle)
        files, _ = validate_contracts(bundle)
        destination = Path(os.path.abspath(args.destination))
        reject_destination_symlinks(destination)
        if args.command == "check":
            result = check_destination(destination, files)
        else:
            result = import_runtime(args.archive.resolve(strict=True), destination, bundle)
        print(json.dumps(result, sort_keys=True))
        return 0
    except (OSError, ValueError, UnicodeError, json.JSONDecodeError, zipfile.BadZipFile) as error:
        print(json.dumps({"healthy": False, "error": str(error)}, sort_keys=True), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
