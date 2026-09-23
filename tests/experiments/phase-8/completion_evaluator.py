#!/usr/bin/env python3
"""Pure bounded decision core for the Phase 8 advisory experiment."""

import json
import sys

MAX_INPUT_BYTES = 2_048
MAX_ADVISORY_CHARS = 240


def evaluate(value: object) -> dict:
    required = {"schema_version", "plan_exists", "incomplete", "blockers", "max_advisory_chars"}
    if not isinstance(value, dict) or set(value) != required:
        raise ValueError("invalid_shape")
    if value["schema_version"] != 1 or not isinstance(value["plan_exists"], bool):
        raise ValueError("invalid_identity")
    for field in ("incomplete", "blockers"):
        if isinstance(value[field], bool) or not isinstance(value[field], int) or not 0 <= value[field] <= 999:
            raise ValueError(f"invalid_{field}")
    budget = value["max_advisory_chars"]
    if isinstance(budget, bool) or not isinstance(budget, int) or not 80 <= budget <= MAX_ADVISORY_CHARS:
        raise ValueError("invalid_budget")

    if not value["plan_exists"] or (value["incomplete"] == 0 and value["blockers"] == 0):
        return {"schema_version": 1, "outcome": "silent", "advisory": None}

    message = f'Plan still has {value["incomplete"]} incomplete item(s) and {value["blockers"]} blocker(s); review before stopping.'
    if len(message) > budget:
        raise ValueError("output_budget_exceeded")
    return {"schema_version": 1, "outcome": "advisory", "advisory": message}


def main() -> int:
    raw = sys.stdin.buffer.read(MAX_INPUT_BYTES + 1)
    try:
        if len(raw) > MAX_INPUT_BYTES:
            raise ValueError("input_too_large")
        value = json.loads(raw.decode("utf-8"))
        result = evaluate(value)
    except (UnicodeDecodeError, json.JSONDecodeError, ValueError) as error:
        print(json.dumps({"error": str(error)}, separators=(",", ":")))
        return 2
    print(json.dumps(result, sort_keys=True, separators=(",", ":")))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
