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
DEFAULT_BUNDLE = ROOT / "contracts" / "runtime-bundle-v1.json"
DEFAULT_DESTINATION = ROOT / "runtime" / "upstream"


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def load_json(path: Path) -> dict:
    value = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(value, dict):
        raise ValueError(f"JSON root must be an object: {path}")
    return value


def require_hash(value: object, label: str) -> str:
    if not isinstance(value, str) or len(value) != 64:
        raise ValueError(f"invalid SHA-256 for {label}")
    try:
        int(value, 16)
    except ValueError as error:
        raise ValueError(f"invalid SHA-256 for {label}") from error
    return value.lower()


def safe_relative(value: object, label: str) -> PurePosixPath:
    if not isinstance(value, str) or not value or "\\" in value:
        raise ValueError(f"invalid relative path for {label}")
    path = PurePosixPath(value)
    if path.is_absolute() or any(part in ("", ".", "..") for part in path.parts):
        raise ValueError(f"unsafe relative path for {label}: {value}")
    if path.parts[0].endswith(":"):
        raise ValueError(f"unsafe relative path for {label}: {value}")
    return path


def validate_contracts(bundle: dict) -> tuple[list[dict], dict]:
    if bundle.get("schema_version") != 1:
        raise ValueError("unsupported runtime bundle schema")

    upstream = bundle.get("upstream")
    files = bundle.get("files")
    if not isinstance(upstream, dict) or not isinstance(files, list) or not files:
        raise ValueError("runtime bundle is incomplete")
    archive_url = upstream.get("release_archive_url")
    if not isinstance(archive_url, str) or not archive_url.startswith("https://github.com/"):
        raise ValueError("runtime bundle must pin an HTTPS GitHub archive URL")
    require_hash(upstream.get("release_archive_sha256"), "release archive")
    require_hash(upstream.get("license_sha256"), "upstream license")
    safe_relative(upstream.get("license_source_path"), "upstream license")

    package_root = safe_relative(bundle.get("package_root"), "package root")
    seen_ids: set[str] = set()
    seen_packages: set[PurePosixPath] = set()
    normalized: list[dict] = []
    for raw in files:
        if not isinstance(raw, dict) or not isinstance(raw.get("id"), str):
            raise ValueError("invalid runtime file entry")
        if raw["id"] in seen_ids:
            raise ValueError(f"duplicate runtime file id: {raw['id']}")
        source_path = safe_relative(raw.get("source_path"), raw["id"])
        package_path = safe_relative(raw.get("package_path"), raw["id"])
        try:
            relative_package = package_path.relative_to(package_root)
        except ValueError as error:
            raise ValueError(f"package path escapes package root: {package_path}") from error
        if relative_package in seen_packages:
            raise ValueError(f"duplicate package path: {relative_package}")
        if raw.get("mode") != "0755":
            raise ValueError(f"unsupported mode for {raw['id']}: {raw.get('mode')}")
        if raw.get("origin") != "upstream_pristine":
            raise ValueError(f"runtime file is not pristine: {raw['id']}")
        pristine_hash = require_hash(raw.get("pristine_sha256"), f"{raw['id']} pristine")
        managed_hash = require_hash(raw.get("managed_sha256"), f"{raw['id']} managed")
        if managed_hash != pristine_hash:
            raise ValueError(f"pristine/managed hash mismatch for {raw['id']}")
        if raw.get("overlay_ids") != []:
            raise ValueError(f"runtime file declares an overlay: {raw['id']}")
        seen_ids.add(raw["id"])
        seen_packages.add(relative_package)
        normalized.append({**raw, "source": source_path, "relative": relative_package})

    return normalized, upstream


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
    parser.add_argument("--bundle", type=Path, default=DEFAULT_BUNDLE)
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
        bundle = load_json(args.bundle.resolve(strict=True))
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
