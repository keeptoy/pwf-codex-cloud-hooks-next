#!/usr/bin/env python3

import importlib.util
from pathlib import Path
import unittest


SPEC = importlib.util.spec_from_file_location("completion_evaluator", Path(__file__).with_name("completion_evaluator.py"))
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def request(**overrides):
    value = {"schema_version": 1, "plan_exists": True, "incomplete": 0, "blockers": 0, "max_advisory_chars": 160}
    value.update(overrides)
    return value


class CompletionEvaluatorTests(unittest.TestCase):
    def test_no_plan_is_silent(self):
        self.assertEqual(MODULE.evaluate(request(plan_exists=False))["outcome"], "silent")

    def test_complete_plan_is_silent(self):
        self.assertIsNone(MODULE.evaluate(request())["advisory"])

    def test_incomplete_plan_is_advisory(self):
        result = MODULE.evaluate(request(incomplete=2, blockers=1))
        self.assertEqual(result["outcome"], "advisory")
        self.assertLessEqual(len(result["advisory"]), 160)

    def test_rejects_extra_fields_and_invalid_budget(self):
        with self.assertRaisesRegex(ValueError, "invalid_shape"):
            MODULE.evaluate({**request(), "path": "/secret"})
        with self.assertRaisesRegex(ValueError, "invalid_budget"):
            MODULE.evaluate(request(max_advisory_chars=10))


if __name__ == "__main__":
    unittest.main()
