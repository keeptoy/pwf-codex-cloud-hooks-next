#!/usr/bin/env python3
"""Bounded, content-free event trace summarizer for the Phase 6 experiment."""

import json
import sys

MAX_INPUT_BYTES = 64_000
MAX_LINE_BYTES = 1_024
MAX_RECORDS = 256
EVENTS = {"SessionStart", "UserPromptSubmit", "PreCompact", "PostCompact"}
SOURCES = {"startup", "resume", "clear", "compact", None}


def summarize(raw: bytes) -> dict:
    if len(raw) > MAX_INPUT_BYTES:
        raise ValueError("input_too_large")
    records = []
    for line_number, line in enumerate(raw.splitlines(), start=1):
        if not line.strip():
            continue
        if len(line) > MAX_LINE_BYTES:
            raise ValueError(f"line_too_large:{line_number}")
        if len(records) >= MAX_RECORDS:
            raise ValueError("too_many_records")
        try:
            value = json.loads(line)
        except json.JSONDecodeError as error:
            raise ValueError(f"invalid_json:{line_number}") from error
        if not isinstance(value, dict) or set(value) != {"event", "source"}:
            raise ValueError(f"invalid_shape:{line_number}")
        if value["event"] not in EVENTS or value["source"] not in SOURCES:
            raise ValueError(f"unknown_event:{line_number}")
        records.append(value)

    counts = {}
    sequence = []
    for record in records:
        key = record["event"] if record["source"] is None else f'{record["event"]}:{record["source"]}'
        counts[key] = counts.get(key, 0) + 1
        sequence.append(key)
    return {
        "schema_version": 1,
        "records": len(records),
        "counts": counts,
        "sequence": sequence,
        "conclusion": "INSUFFICIENT_EVIDENCE",
        "reason": "event_presence_does_not_prove_context_recovery",
    }


def main() -> int:
    try:
        result = summarize(sys.stdin.buffer.read(MAX_INPUT_BYTES + 1))
    except ValueError as error:
        print(json.dumps({"error": str(error)}, separators=(",", ":")))
        return 2
    print(json.dumps(result, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
